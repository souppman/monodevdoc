
import axios from 'axios';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

export const docMonitor = {
    async checkStaleDocs(filePaths: string[], repoUrl?: string) {
        logger.info({ filePaths }, 'Checking for stale documentation...');

        // Logic:
        // 1. Ask RAG: "Which journal entries or docs mention these files?"
        // 2. Ideally, the RAG service would have a specific endpoint for "reverse index lookup"
        //    or we perform a semantic search for the filenames.

        // For V1, we will simulate this by logging.
        // In V2, we would query `POST /query` with `filters: { file_path: ... }` 
        // OR a new `POST /impact-analysis` endpoint on RAG.

        const impactedDocs = [];

        for (const file of filePaths) {
            try {
                // Simple search query to find related context
                const response = await axios.post(`${RAG_SERVICE_URL}/query`, {
                    query: `References to ${file}`,
                    project_id: 'proj-test-1', // Todo: dynamic project ID from webhook payload if possible
                    top_k: 1
                });

                if (response.data.results && response.data.results.length > 0) {
                    impactedDocs.push({
                        file,
                        related_context_id: response.data.results[0].id
                    });
                }
            } catch (error) {
                logger.warn({ file, error: (error as any).message }, 'Failed to query RAG for file impact');
            }
        }

        if (impactedDocs.length > 0) {
            logger.warn({ impactedDocs }, 'STALE DOCS DETECTED: The following files changed and have related documentation.');
            // Here we would create a "Notification" or "Task" in the DB
        } else {
            logger.info('No stale documentation impact detected for these changes.');
        }
    }
};
