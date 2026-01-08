
import express, { Request, Response } from 'express';
import prisma from '../prisma';
import logger from '../utils/logger';

const router = express.Router();

// GET /journal/stats
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const totalEntries = await prisma.journalEntry.count();
        const distinctDocs = await prisma.project.count(); // Using projects as proxy for "Docs" for now, or just hardcode/count something else if needed. 
        // Plan said: "Documents" (12 in mock).
        // Check schema. Project has entries. 
        // Ideally "Documents" are what we generate. We don't have a "Document" model yet, maybe RAG knows? 
        // For now, let's just return what we have: Journal Entries, and maybe Projects.

        // Actually, looking at the mock: "12 Documents", "47 Journal Entries", "8 AI Generated".
        // We can count JournalEntries.
        // We can count Projects.
        // We don't have "Generated Docs" stored in Postgres yet (they are in RAG/Markdown files?). 
        // Let's just return counts we can get.

        const stats = {
            documents: await prisma.project.count(), // Mapping Projects -> Documents concept for Dashboard
            journalEntries: totalEntries,
            aiGenerated: 0 // Placeholder until we track this
        };

        res.json(stats);
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch journal stats');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
