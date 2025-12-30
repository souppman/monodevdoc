import { createJournalEntry, JournalEntryInput } from '../../src/services/journalService';
// @ts-ignore
import prisma from '../../src/prisma';
import axios from 'axios';

jest.mock('../../src/prisma', () => ({
    __esModule: true,
    default: {
        journalEntry: {
            create: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('createJournalEntry', () => {
    const mockInput: JournalEntryInput = {
        content: 'Test Entry',
        author_id: 'user-123',
        project_id: 'proj-123',
        git_context: {
            git_commit_hash: 'abc1234',
            git_branch: 'main',
            author_id: 'user-123',
            repo_url: 'http://github.com/test/repo',
            file_path: 'src/test.ts'
        }
    };

    const mockSavedEntry = {
        id: 'entry-123',
        content: 'Test Entry',
        projectId: 'proj-123',
        authorId: 'user-123',
        createdAt: new Date(),
        gitCommitHash: 'abc1234',
        gitBranch: 'main',
        filePath: 'src/test.ts'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create an entry and index it in RAG', async () => {
        (prisma.journalEntry.create as jest.Mock).mockResolvedValue(mockSavedEntry);
        mockedAxios.post.mockResolvedValue({ status: 200 });

        const result = await createJournalEntry(mockInput);

        expect(prisma.journalEntry.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                content: mockInput.content,
                gitCommitHash: mockInput.git_context.git_commit_hash,
            }),
        });

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/index'),
            expect.objectContaining({
                content: mockInput.content,
                metadata: expect.objectContaining({
                    source: 'journal',
                    git_commit_hash: mockInput.git_context.git_commit_hash,
                    repo_url: mockInput.git_context.repo_url
                })
            })
        );

        expect(result).toEqual(mockSavedEntry);
    });

    it('should rollback if RAG indexing fails', async () => {
        (prisma.journalEntry.create as jest.Mock).mockResolvedValue(mockSavedEntry);
        mockedAxios.post.mockRejectedValue(new Error('RAG Down'));

        await expect(createJournalEntry(mockInput)).rejects.toThrow('RAG Service unavailable - Entry rolled back');

        expect(prisma.journalEntry.delete).toHaveBeenCalledWith({
            where: { id: mockSavedEntry.id }
        });
    });

    it('should throw if database creation fails', async () => {
        (prisma.journalEntry.create as jest.Mock).mockRejectedValue(new Error('DB Error'));

        await expect(createJournalEntry(mockInput)).rejects.toThrow('Database error');

        expect(mockedAxios.post).not.toHaveBeenCalled();
    });
});
