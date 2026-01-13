
import express, { Request, Response } from 'express';
import { Project } from '@prisma/client';
import prisma from '../prisma';
import logger from '../utils/logger';

import { syncProject } from '../services/syncService';

const router = express.Router();

// GET /projects/lookup?repoUrl=...
router.get('/lookup', async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.query;
        if (!repoUrl) {
            return res.status(400).json({ error: 'Missing repoUrl query parameter' });
        }

        const projects = await prisma.project.findMany();
        const found = projects.find((p: Project) => p.repoUrl && p.repoUrl.includes(String(repoUrl)));

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
        logger.info({ id, name, ownerId }, 'Received POST /projects request');

        if (!id || !name || !ownerId) {
            return res.status(400).json({ error: 'Missing required fields: id, name, ownerId' });
        }

        // 2. Upsert Project with Safe User Connection
        // 2. Upsert Project with Safe User Connection
        const project = await prisma.project.upsert({
            where: { id: String(id) },
            update: {
                name,
                repoUrl,
                owner: {
                    connectOrCreate: {
                        where: { id: ownerId },
                        create: {
                            id: ownerId,
                            email: `${ownerId}@github.placeholder`,
                            name: ownerId
                        }
                    }
                }
            },
            create: {
                id: String(id),
                name,
                repoUrl,
                owner: {
                    connectOrCreate: {
                        where: { id: ownerId },
                        create: {
                            id: ownerId,
                            email: `${ownerId}@github.placeholder`,
                            name: ownerId
                        }
                    }
                }
            }
        });

        logger.info({ projectId: project.id }, 'Project upserted successfully');

        // TRIGGER BACKGROUND SYNC
        // Extract GitHub Token from Header (Multi-Tenant Support)
        const githubToken = req.headers['x-github-token'] as string | undefined;

        syncProject(project.id, githubToken).catch(err => {
            logger.error({ err, projectId: project.id }, 'Background Sync Failed');
        });

        res.json(project);

    } catch (error: any) {
        logger.error({ err: error.message }, 'Failed to upsert project');
        res.status(500).json({ error: error.message || 'Failed to upsert project' });
    }
});

export default router;
