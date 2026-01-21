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

import logger from './utils/logger';

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
    if (!signature) return next();

    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

    if (signature !== digest) {
        logger.warn('Invalid GitHub signature');
        return res.status(401).send('Invalid signature');
    }
    next();
};

// Routes
import webhookRouter from './routes/webhooks';
import journalRouter from './routes/journal';
import gitRouter from './routes/git';
import docsRouter from './routes/docs';
import projectsRouter from './routes/projects';
import ragRouter from './routes/rag';

app.use('/webhooks', verifyGitHubSignature, webhookRouter);
app.use('/journal', journalRouter);
app.use('/git', gitRouter);
app.use('/docs', docsRouter);
app.use('/projects', projectsRouter);
app.use('/rag', ragRouter);

app.get('/', (req: Request, res: Response) => {
    res.redirect('/api-docs');
});

const PORT = process.env.PORT || 3000;
import { fileWatcher } from './services/fileWatcher';

app.listen(PORT, () => {
    logger.info(`Journal Service running on port ${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);

    // Start File Watcher for Dev Mode
    if (process.env.NODE_ENV !== 'production') {
        fileWatcher.start();
    }
});

export default app;
