import { Octokit } from '@octokit/rest';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Helper to get authenticated Octokit
const getOctokit = (token?: string) => {
    return new Octokit({
        auth: token || process.env.GITHUB_TOKEN, // Fallback to system token if none provided
    });
};

export const fetchFileContent = async (owner: string, repo: string, path: string, ref: string, token?: string): Promise<string | null> => {
    try {
        const octokit = getOctokit(token);
        const response = await octokit.repos.getContent({
            owner,
            repo,
            path,
            ref,
        });

        // GitHub API returns content in base64
        if ('content' in response.data && typeof response.data.content === 'string') {
            return Buffer.from(response.data.content, 'base64').toString('utf-8');
        }

        return null;
    } catch (error) {
        logger.error({ error, path, repo }, 'Failed to fetch file content from GitHub');
        return null;
    }
};

export const fetchRepoTree = async (owner: string, repo: string, ref: string = 'main', token?: string): Promise<string[]> => {
    try {
        const octokit = getOctokit(token);
        const response = await octokit.git.getTree({
            owner,
            repo,
            tree_sha: ref,
            recursive: 'true',
        });

        if (response.data.truncated) {
            logger.warn({ repo }, 'Repo tree truncated (too large)');
        }

        return response.data.tree
            .filter(item => item.type === 'blob') // Only files
            .map(item => item.path)
            .filter((path): path is string => !!path);

    } catch (error) {
        logger.error({ error, repo }, 'Failed to fetch repo tree');
        return [];
    }
};
