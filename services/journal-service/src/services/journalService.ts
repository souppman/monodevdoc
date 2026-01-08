import prisma from '../prisma';
import axios from 'axios';
import { RAGIndexRequest } from 'devdoc-contracts';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

export interface GitContext {
    git_commit_hash: string;
    git_branch: string;
    file_path?: string;
    author_id: string;
    repo_url: string;
}

export interface JournalEntryInput {
    id?: string;
    content: string;
    created_at?: string;
    updated_at?: string;
    author_id: string;
    project_id: string;
    git_context: GitContext;
    linked_issues?: string[];
    tags?: string[];
}

export const createJournalEntry = async (input: JournalEntryInput) => {
    // 1. Create in DB
    let savedEntry;
    try {


        savedEntry = await prisma.journalEntry.create({
            data: {
                id: input.id || undefined,
                content: input.content,
                gitCommitHash: input.git_context.git_commit_hash,
                gitBranch: input.git_context.git_branch,
                filePath: input.git_context.file_path,
                authorId: input.author_id,
                projectId: input.project_id,
                createdAt: input.created_at ? new Date(input.created_at) : undefined,
            },
        });
    } catch (dbError: any) {
        logger.error({ err: dbError }, 'Database creation failed');
        throw new Error('Database error');
    }

    // 2. Prepare RAG Payload
    const ragPayload: RAGIndexRequest = {
        content: savedEntry.content,
        metadata: {
            id: savedEntry.id,
            source: 'journal',
            project_id: savedEntry.projectId,
            created_at: savedEntry.createdAt.toISOString(),
            git_commit_hash: savedEntry.gitCommitHash || input.git_context.git_commit_hash,
            git_branch: savedEntry.gitBranch || input.git_context.git_branch,
            file_path: savedEntry.filePath || input.git_context.file_path,
            author_id: savedEntry.authorId,
            repo_url: input.git_context.repo_url, // Added missing field
            linked_jira_issue: input.linked_issues?.[0], // Mapping first issue for now
        },
    };

    // 3. Index in RAG (Task 3: Wiring)
    try {
        await axios.post(`${RAG_SERVICE_URL}/index`, ragPayload);
        logger.info({ entryId: savedEntry.id }, 'Successfully indexed to RAG');
    } catch (ragError: any) {
        const errorDetail = ragError.response?.data || ragError.message;
        logger.warn({ err: errorDetail, status: ragError.response?.status }, 'RAG Indexing failed, but entry saved to DB');
        // No rollback - we want to keep the entry even if RAG is down
        // await prisma.journalEntry.delete({ where: { id: savedEntry.id } });
    }

    return savedEntry;
};
