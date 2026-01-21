
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
        await git.fetch(); // Ensure we have latest from remote
        // Log from the remote HEAD to see the actual history, not just the local container's checkout
        const log = await git.log({ from: 'origin/main', maxCount: 50 });
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

router.get('/branches', async (req: Request, res: Response) => {
    try {
        await git.fetch(); // Ensure we have latest from remote
        // Fetch all branches (-a) to see remotes like 'frontend-dev'
        const branchSummary = await git.branch(['-a']);

        // Extract names, remove 'remotes/origin/' prefix, and deduplicate
        const uniqueNames = new Set<string>();

        branchSummary.all.forEach(name => {
            // "remotes/origin/HEAD -> origin/main" case?
            if (name.includes('HEAD')) return;

            // "remotes/origin/my-branch" -> "my-branch"
            const cleanName = name.replace('remotes/origin/', '').replace('origin/', '');
            uniqueNames.add(cleanName);
        });

        const branches = Array.from(uniqueNames).map(name => ({
            name,
            current: name === branchSummary.current
        })).sort((a, b) => a.name.localeCompare(b.name));

        res.json(branches);
    } catch (error: any) {
        logger.error({ err: error.message }, 'Failed to fetch git branches');
        res.status(500).json({ error: 'Failed to fetch local branches' });
    }
});

export default router;
