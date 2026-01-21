
import express, { Request, Response } from 'express';
import prisma from '../prisma';
import logger from '../utils/logger';

const router = express.Router();

// GET /journal/stats
router.get('/entries', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ error: 'Missing projectId query parameter' });
        }
        const where: any = { projectId: String(projectId) };

        const entries = await prisma.journalEntry.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });
        res.json(entries);
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch journal entries');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /journal/stats
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ error: 'Missing projectId query parameter' });
        }
        const whereArgs = { projectId: String(projectId) };

        const totalEntries = await prisma.journalEntry.count({
            where: whereArgs
        });

        // Count actual GeneratedDocs for this project
        const totalDocs = await prisma.generatedDoc.count({
            where: whereArgs
        });

        const stats = {
            documents: totalDocs,
            journalEntries: totalEntries,
            aiGenerated: totalDocs // Assuming all docs are AI generated for now
        };

        res.json(stats);
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch journal stats');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// POST /journal/entries
router.post('/entries', async (req: Request, res: Response) => {
    try {
        logger.info({ body: req.body }, 'Received POST /entries request');
        const { projectId, authorId, content, gitCommitHash, gitBranch } = req.body;

        if (!projectId || !authorId || !content) {
            logger.warn({ projectId, authorId, hasContent: !!content }, 'Missing required fields');
            return res.status(400).json({ error: 'Missing required fields: projectId, authorId, content' });
        }

        const entry = await prisma.journalEntry.create({
            data: {
                projectId,
                authorId,
                content,
                gitCommitHash: gitCommitHash || undefined,
                gitBranch: gitBranch || undefined,
            }
        });

        res.status(201).json(entry);
    } catch (error: any) {
        logger.error({ err: error.message }, 'Failed to create journal entry');
        res.status(500).json({ error: 'Failed to create entry' });
    }
});

export default router;
