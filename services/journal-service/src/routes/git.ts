
import express, { Request, Response } from 'express';
import simpleGit from 'simple-git';
import path from 'path';
import pino from 'pino';

const router = express.Router();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Target the monorepo root
const REPO_ROOT = path.resolve(__dirname, '../../../../');
const git = simpleGit(REPO_ROOT);

router.get('/commits', async (req: Request, res: Response) => {
    try {
        const log = await git.log({ maxCount: 10 });
        const commits = log.all.map(commit => ({
            gitCommitHash: commit.hash,
            content: commit.message,
            date: commit.date,
            author: commit.author_name
        }));
        res.json(commits);
    } catch (error: any) {
        logger.error({ err: error.message }, 'Failed to fetch git commits');
        res.status(500).json({ error: 'Failed to fetch git history' });
    }
});

export default router;
