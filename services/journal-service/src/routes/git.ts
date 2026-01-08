
import express, { Request, Response } from 'express';
import prisma from '../prisma';
import logger from '../utils/logger';

const router = express.Router();

// GET /git/branches
router.get('/branches', async (req: Request, res: Response) => {
    try {
        const projectId = req.query.projectId as string;

        const where = projectId ? { projectId } : {};

        // Find distinct branches in journal entries
        const branches = await prisma.journalEntry.findMany({
            where,
            distinct: ['gitBranch'],
            select: {
                gitBranch: true,
                updatedAt: true
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format for frontend
        const formatted = branches
            .filter(b => b.gitBranch) // Filter nulls
            .map(b => ({
                name: b.gitBranch,
                lastActivity: b.updatedAt
            }));

        res.json(formatted);
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch git branches');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
