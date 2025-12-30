import { Octokit } from '@octokit/rest';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // Optional for public repos, required for private
});

export const fetchFileContent = async (owner: string, repo: string, path: string, ref: string): Promise<string | null> => {
    try {
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
