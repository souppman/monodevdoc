
import express, { Request, Response } from 'express';
import prisma from '../prisma';
import logger from '../utils/logger';

const router = express.Router();

// GET /projects/lookup?repoUrl=...
router.get('/lookup', async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.query;
        if (!repoUrl) {
            return res.status(400).json({ error: 'Missing repoUrl query parameter' });
        }

        const projects = await prisma.project.findMany();
        const found = projects.find(p => p.repoUrl && p.repoUrl.includes(String(repoUrl)));

        if (!found) {
            return res.status(404).json({ error: 'Project not found for repository' });
        }
        res.json(found);
    } catch (error) {
        logger.error({ err: error }, 'Failed to lookup project');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /projects (Upsert)
router.post('/', async (req: Request, res: Response) => {
    try {
        const { id, name, repoUrl, ownerId } = req.body;

        if (!id || !name || !ownerId) {
            return res.status(400).json({ error: 'Missing required fields: id, name, ownerId' });
        }

        // 1. Ensure User Exists (Self-healing)
        // We assume ownerId is the GitHub Login or ID used for auth
        await prisma.user.upsert({
            where: { id: ownerId }, // Schema: id is String @id
            // If email is unique and we don't have it, we might have a conflict if we try to create with dummy email.
            // However, User model requires email @unique.
            // We'll use a placeholder email if verifying/creating, or check if we can skip it.
            // Schema: email String @unique.
            // This is tricky if we don't have the email from the frontend.
            // The frontend has `user` object from session.
            // Let's assume we can pass email if we have it, or generate a dummy one: `id@github.placeholder`
            update: {},
            create: {
                id: ownerId,
                email: `${ownerId}@github.placeholder`, // Fallback
                name: ownerId
            }
        }).catch(err => {
            // Soft ignore if email conflict, but user might already exist
            logger.warn({ err }, 'User upsert warning');
        });

        // 2. Upsert Project
        const project = await prisma.project.upsert({
            where: { id: String(id) },
            update: {
                name,
                repoUrl,
                ownerId
            },
            create: {
                id: String(id),
                name,
                repoUrl,
                ownerId
            }
        });

        logger.info({ projectId: project.id }, 'Project upserted successfully');
        res.json(project);

    } catch (error: any) {
        logger.error({ err: error.message }, 'Failed to upsert project');
        res.status(500).json({ error: 'Failed to upsert project' });
    }
});

export default router;
