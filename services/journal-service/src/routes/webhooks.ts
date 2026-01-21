
import express, { Request, Response } from 'express';
import { docMonitor } from '../services/docMonitor';
import { createJournalEntry } from '../services/journalService';
import { fetchFileContent } from '../services/githubService';
import { RAGIndexRequest } from 'devdoc-contracts';
import axios from 'axios';
import logger from '../utils/logger';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';
const router = express.Router();

// Helper: Process Push Event
const processPushEvent = async (payload: any) => {
    const { commits, repository, pusher } = payload;

    if (!commits || !Array.isArray(commits)) return;

    for (const commit of commits) {
        // 1. Journal Entry with Git Context
        // Only if commit message is significant? For now, journal everything.
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
                project_id: repository.name,
                author_id: pusher.email || 'system'
            });
            logger.info({ commit: commit.id }, 'Created Journal Entry for Commit');
        } catch (error) {
            logger.error({ commit: commit.id, err: error }, 'Failed to create journal entry for commit');
        }

        // 2. Index Code Files
        const changedFiles = [...(commit.added || []), ...(commit.modified || [])];

        for (const filePath of changedFiles) {
            // Skip non-code files
            if (filePath.endsWith('.md') || filePath.endsWith('.json') || filePath.endsWith('.lock') || filePath.includes('node_modules')) continue;

            try {
                logger.info({ file: filePath }, 'Fetching content for indexing...');
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
                } else {
                    logger.warn({ file: filePath }, 'No content fetched (might be empty or binary)');
                }
            } catch (error) {
                logger.error({ file: filePath, err: (error as any).message }, 'Failed to index code file');
            }
        }
    }

    // 3. Check for Stale Docs (DocMonitor)
    // Gather all modified files across all commits
    const allModifiedFiles = commits.flatMap((c: any) => c.modified || []);
    const uniqueFiles = [...new Set(allModifiedFiles)] as string[];

    if (uniqueFiles.length > 0) {
        // Run in background
        docMonitor.checkStaleDocs(uniqueFiles, repository.html_url).catch((err: any) => {
            logger.error({ err }, 'Error in docMonitor background task');
        });
    }
};

router.post('/github', async (req: Request, res: Response): Promise<void> => {
    try {
        const eventType = req.headers['x-github-event'];

        if (eventType === 'push') {
            await processPushEvent(req.body);
            res.status(200).json({ received: true, action: 'processed_push' });
        } else {
            res.status(200).json({ received: true, action: 'ignored_event' });
        }
    } catch (error) {
        logger.error({ err: error }, 'Error processing webhook');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
