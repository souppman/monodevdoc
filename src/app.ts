import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import prisma from './prisma';
import { z } from 'zod';
import pino from 'pino';
import pinoHttp from 'express-pino-logger';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import crypto from 'crypto';
import { Webhooks } from '@octokit/webhooks';
import { createJournalEntry, JournalEntryInput } from './services/journalService';
import { fetchFileContent } from './services/githubService';
import { RAGIndexRequest } from 'devdoc-contracts';
import axios from 'axios';

dotenv.config();

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty'
    }
});

const app = express();
app.use(express.json({
    verify: (req: any, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(pinoHttp({ logger: logger as any }));

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'devdoc-secret';
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';


// Types
const GitMetadataSchema = z.object({
    git_commit_hash: z.string(),
    git_branch: z.string(),
    file_path: z.string().optional(),
    author_id: z.string(),
    repo_url: z.string(),
});

const JournalEntryInputSchema = z.object({
    id: z.string().optional(),
    content: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    author_id: z.string(),
    project_id: z.string(),
    git_context: GitMetadataSchema,
    linked_issues: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
});

// Middleware
const verifyGitHubSignature = (req: any, res: Response, next: NextFunction) => {
    const signature = req.headers['x-hub-signature-256'];
    if (!signature) return next(); // Optionally enforce strictness

    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    if (signature !== digest) {
        logger.warn('Invalid GitHub signature');
        return res.status(401).send('Invalid signature');
    }
    next();
};

// Helper: Process Push Event
const processPushEvent = async (payload: any) => {
    const { commits, repository, pusher } = payload;

    for (const commit of commits) {
        // 1. Journal Entry with Git Context (Task 2)
        try {
            await createJournalEntry({
                content: commit.message,
                git_context: {
                    git_commit_hash: commit.id,
                    git_branch: payload.ref.replace('refs/heads/', ''),
                    author_id: commit.author.email || 'unknown',
                    repo_url: repository.html_url,
                    file_path: undefined
                },
                project_id: repository.name, // In real app, look up internal Project ID
                author_id: pusher.email || 'system'
            });
            logger.info({ commit: commit.id }, 'Created Journal Entry for Commit');
        } catch (error) {
            logger.error({ commit: commit.id, err: error }, 'Failed to create journal entry for commit');
        }

        // 2. Index Code Files (Task 4)
        // Combine added and modified files
        const changedFiles = [...(commit.added || []), ...(commit.modified || [])];

        for (const filePath of changedFiles) {
            // Skip non-code files or huge files if necessary (basic filtering)
            if (filePath.endsWith('.md') || filePath.endsWith('.json') || filePath.endsWith('.lock')) continue;

            try {
                const content = await fetchFileContent(
                    repository.owner.name || repository.owner.login,
                    repository.name,
                    filePath,
                    commit.id
                );

                if (content) {
                    const ragPayload: RAGIndexRequest = {
                        content: content,
                        metadata: {
                            id: `code_${commit.id}_${filePath.replace(/\//g, '_')}`,
                            source: 'code_file',
                            project_id: repository.name,
                            created_at: new Date().toISOString(),
                            git_commit_hash: commit.id,
                            git_branch: payload.ref.replace('refs/heads/', ''),
                            file_path: filePath,
                            author_id: commit.author.email || 'unknown',
                            repo_url: repository.html_url
                        }
                    };

                    await axios.post(`${RAG_SERVICE_URL}/index`, ragPayload);
                    logger.info({ file: filePath }, 'Indexed Code File to RAG');
                }
            } catch (error) {
                logger.error({ file: filePath, err: error }, 'Failed to index code file');
            }
        }
    }
};

// Routes
app.post('/journal/entries', async (req: Request, res: Response): Promise<void> => {
    try {
        const validation = JournalEntryInputSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ error: validation.error });
            return;
        }

        const input = validation.data;

        try {
            const savedEntry = await createJournalEntry({
                id: input.id,
                content: input.content,
                created_at: input.created_at,
                author_id: input.author_id,
                project_id: input.project_id,
                git_context: {
                    git_commit_hash: input.git_context.git_commit_hash,
                    git_branch: input.git_context.git_branch,
                    file_path: input.git_context.file_path,
                    author_id: input.git_context.author_id,
                    repo_url: input.git_context.repo_url,
                }
            });

            res.status(201).json(savedEntry);
        } catch (serviceError: any) {
            if (serviceError.message.includes('RAG Service unavailable')) {
                res.status(502).json({ error: serviceError.message });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } catch (error) {
        logger.error({ err: error }, 'Unhandled error in create entry');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/journal/entries', async (req: Request, res: Response) => {
    try {
        const { project_id, commit_hash } = req.query;

        const where: any = {};
        if (project_id) where.projectId = String(project_id);
        if (commit_hash) where.gitCommitHash = String(commit_hash);

        const entries = await prisma.journalEntry.findMany({ where });
        res.json(entries);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/webhooks/github', verifyGitHubSignature, async (req: Request, res: Response) => {
    const eventName = req.headers['x-github-event'] as string;

    logger.info({ event: eventName }, 'GitHub Webhook Received');

    if (eventName === 'push') {
        try {
            await processPushEvent(req.body);
            res.status(200).send('Processed Push Event');
        } catch (error) {
            logger.error(error, 'Error processing push event');
            res.status(500).send('Error processing');
        }
    } else {
        res.status(200).send('Ignored Event Type');
    }
});

app.get('/', (req: Request, res: Response) => {
    res.redirect('/api-docs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Journal Service running on port ${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

export default app;
