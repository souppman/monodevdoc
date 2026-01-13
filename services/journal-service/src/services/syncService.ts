import prisma from '../prisma';
import axios from 'axios';
import logger from '../utils/logger';
import { fetchRepoTree, fetchFileContent } from './githubService';
import { RAGIndexRequest } from 'devdoc-contracts';

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

export const syncProject = async (projectId: string, token?: string): Promise<{ success: boolean; indexedCount: number; totalFiles: number }> => {
    logger.info({ projectId, hasToken: !!token }, 'Starting background project sync...');

    try {
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        if (!project || !project.repoUrl) {
            logger.warn({ projectId }, 'Project not found or missing repoUrl during sync');
            return { success: false, indexedCount: 0, totalFiles: 0 };
        }

        const repoDetails = parseRepoUrl(project.repoUrl);
        if (!repoDetails) {
            logger.warn({ repoUrl: project.repoUrl }, 'Invalid repoUrl format during sync');
            return { success: false, indexedCount: 0, totalFiles: 0 };
        }

        const { owner, repo } = repoDetails;

        // 1. Fetch all files (Pass Token)
        logger.info({ owner, repo }, 'Fetching repo tree...');
        const allFiles = await fetchRepoTree(owner, repo, 'main', token);

        // 2. Filter for code
        const codeFiles = allFiles.filter(f =>
            !f.endsWith('.lock') &&
            !f.includes('node_modules') &&
            !f.includes('dist/') &&
            (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.py') || f.endsWith('.md') || f.endsWith('.prisma'))
        );

        logger.info({ count: codeFiles.length }, 'Found code files to index');

        // 3. Index each file
        let indexedCount = 0;

        for (const filePath of codeFiles) {
            try {
                const content = await fetchFileContent(owner, repo, filePath, 'main', token);
                if (!content) continue;

                const ragPayload: RAGIndexRequest = {
                    content: content,
                    metadata: {
                        id: `code_sync_${filePath.replace(/\//g, '_')}`,
                        source: 'code_file',
                        project_id: projectId,
                        created_at: new Date().toISOString(),
                        git_commit_hash: 'HEAD',
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

        logger.info({ total: indexedCount, projectId }, 'Project Sync Completed Successfully');
        return { success: true, indexedCount, totalFiles: codeFiles.length };

    } catch (error: any) {
        logger.error({ err: error.message, projectId }, 'Critical failure during project sync');
        throw error;
    }
};
