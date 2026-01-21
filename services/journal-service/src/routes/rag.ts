
import express, { Request, Response } from 'express';
import { fetchRepoTree, fetchFileContent } from '../services/githubService';
import { RAGIndexRequest } from 'devdoc-contracts';
import prisma from '../prisma';
import axios from 'axios';
import logger from '../utils/logger';

const router = express.Router();
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

// Helper to extract owner/repo from URL
const parseRepoUrl = (url: string) => {
    try {
        const parts = url.split('github.com/')[1].split('/');
        return { owner: parts[0], repo: parts[1] };
    } catch (e) {
        return null;
    }
};

// POST /rag/sync/:projectId
router.post('/sync/:projectId', async (req: Request, res: Response) => {
    const { projectId } = req.params;
    logger.info({ projectId }, 'Received RAG Sync Request');

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project || !project.repoUrl) {
            return res.status(404).json({ error: 'Project not found or missing repoUrl' });
        }

        const repoDetails = parseRepoUrl(project.repoUrl);
        if (!repoDetails) {
            return res.status(400).json({ error: 'Invalid repoUrl format' });
        }

        const { owner, repo } = repoDetails;

        // 1. Fetch all files
        logger.info({ owner, repo }, 'Fetching repo tree...');
        const allFiles = await fetchRepoTree(owner, repo);

        // 2. Filter for code
        const codeFiles = allFiles.filter(f =>
            !f.endsWith('.lock') &&
            !f.includes('node_modules') &&
            !f.includes('dist/') &&
            (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.md') || f.endsWith('.prisma'))
        );

        logger.info({ count: codeFiles.length }, 'Found code files to index');

        // 3. Index each file (Background process? No, keep it simple for now, maybe with Promise.allLimit if needed)
        let indexedCount = 0;

        for (const filePath of codeFiles) {
            try {
                const content = await fetchFileContent(owner, repo, filePath, 'main');
                if (!content) continue;

                const ragPayload: RAGIndexRequest = {
                    content: content,
                    metadata: {
                        id: `code_sync_${filePath.replace(/\//g, '_')}`,
                        source: 'code_file',
                        project_id: projectId,
                        created_at: new Date().toISOString(),
                        git_commit_hash: 'HEAD', // We don't have exact hash for bulk sync easily without extra call
                        git_branch: 'main',
                        file_path: filePath,
                        author_id: 'system_sync',
                        repo_url: project.repoUrl
                    }
                };

                await axios.post(`${RAG_SERVICE_URL}/index`, ragPayload);
                indexedCount++;
                if (indexedCount % 5 === 0) logger.info({ indexedCount }, 'Indexing progress...');

            } catch (err: any) {
                logger.warn({ file: filePath, err: err.message }, 'Failed to index file during sync');
            }
        }

        logger.info({ total: indexedCount }, 'RAG Sync Completed');
        res.json({ success: true, indexedCount, totalFiles: codeFiles.length });

    } catch (error: any) {
        logger.error({ err: error.message }, 'Failed to sync project');
        res.status(500).json({ error: error.message });
    }
});

export default router;
