
import prisma from '../prisma'; // Adjusted import path
import axios from 'axios';
import { RAGIndexRequest } from 'devdoc-contracts';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://127.0.0.1:8000';

async function reindexAll() {
    console.log('Fetching all journal entries from DB...');
    const entries = await prisma.journalEntry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100 // Limit for safety, or remove for full backfill
    });

    console.log(`Found ${entries.length} entries. Indexing to RAG Service at ${RAG_SERVICE_URL}...`);

    for (const entry of entries) {
        const ragPayload: RAGIndexRequest = {
            content: entry.content,
            metadata: {
                id: entry.id,
                source: 'journal',
                project_id: entry.projectId,
                created_at: entry.createdAt.toISOString(),
                git_commit_hash: entry.gitCommitHash || 'unknown',
                git_branch: entry.gitBranch || 'unknown',
                file_path: entry.filePath || 'unknown',
                author_id: entry.authorId,
                repo_url: 'https://github.com/souppman/monodevdoc', // fallback
            },
        };

        try {
            await axios.post(`${RAG_SERVICE_URL}/index`, ragPayload);
            console.log(`Indexed entry ${entry.id}`);
        } catch (error: any) {
            console.error(`Failed to index ${entry.id}: ${error.message}`);
        }
    }
    console.log('Reindexing complete.');
}

reindexAll()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
