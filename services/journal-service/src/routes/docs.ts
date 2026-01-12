
import express, { Request, Response } from 'express';
import prisma from '../prisma';
import logger from '../utils/logger';
import { z } from 'zod';

const router = express.Router();

const CreateDocSchema = z.object({
    title: z.string(),
    content: z.string(),
    docType: z.string(),
    docStyle: z.string(),
    projectId: z.string()
});

// GET /docs - List docs for project
router.get('/', async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;
        if (!projectId) {
            return res.status(400).json({ error: 'Missing projectId' });
        }

        const docs = await prisma.generatedDoc.findMany({
            where: { projectId: String(projectId) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(docs);
    } catch (error) {
        logger.error({ err: error }, 'Failed to list docs');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /docs/:id - Get single doc
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doc = await prisma.generatedDoc.findUnique({
            where: { id }
        });

        if (!doc) return res.status(404).json({ error: 'Document not found' });

        res.json(doc);
    } catch (error) {
        logger.error({ err: error }, 'Failed to get doc');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /docs - Create new doc
router.post('/', async (req: Request, res: Response) => {
    try {
        const payload = CreateDocSchema.parse(req.body);

        const doc = await prisma.generatedDoc.create({
            data: payload
        });

        res.json(doc);
    } catch (error: any) {
        logger.error({ err: error }, 'Failed to create doc');
        // Return actual error message for debugging
        const errorMessage = error instanceof z.ZodError
            ? (error as any).errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
            : (error as Error).message || 'Unknown error';

        res.status(400).json({ error: `Invalid payload: ${errorMessage}` });
    }
});

// DELETE /docs/:id - Delete doc
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.generatedDoc.delete({
            where: { id }
        });
        res.status(204).send();
    } catch (error) {
        logger.error({ err: error }, 'Failed to delete doc');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
