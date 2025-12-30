import request from 'supertest';
// @ts-ignore
import app from '../src/app';
import { createJournalEntry } from '../src/services/journalService';
import { fetchFileContent } from '../src/services/githubService';
// @ts-ignore
import prisma from '../src/prisma';
import crypto from 'crypto';
import axios from 'axios';

jest.mock('../src/services/journalService');
jest.mock('../src/services/githubService');
jest.mock('axios');
jest.mock('../src/prisma', () => ({
    __esModule: true,
    default: {
        journalEntry: {
            findMany: jest.fn(),
        },
    },
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;


const WEBHOOK_SECRET = 'devdoc-secret'; // Default in app.ts

describe('API Endpoints', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /journal/entries', () => {
        it('should create an entry successfully', async () => {
            (createJournalEntry as jest.Mock).mockResolvedValue({ id: '123', content: 'test' });

            const res = await request(app)
                .post('/journal/entries')
                .send({
                    content: 'test',
                    author_id: 'user1',
                    project_id: 'proj1',
                    git_context: {
                        git_commit_hash: 'abc',
                        git_branch: 'main',
                        author_id: 'user1',
                        repo_url: 'http://repo'
                    }
                });

            expect(res.status).toBe(201);
            expect(createJournalEntry).toHaveBeenCalled();
        });

        it('should return 400 for invalid input', async () => {
            const res = await request(app).post('/journal/entries').send({});
            expect(res.status).toBe(400);
        });

        it('should return 502 if RAG service fails', async () => {
            (createJournalEntry as jest.Mock).mockRejectedValue(new Error('RAG Service unavailable'));

            const res = await request(app)
                .post('/journal/entries')
                .send({
                    content: 'test',
                    author_id: 'user1',
                    project_id: 'proj1',
                    git_context: {
                        git_commit_hash: 'abc',
                        git_branch: 'main',
                        author_id: 'user1',
                        repo_url: 'http://repo'
                    }
                });

            expect(res.status).toBe(502);
        });
    });

    describe('GET /journal/entries', () => {
        it('should return entries', async () => {
            (prisma.journalEntry.findMany as jest.Mock).mockResolvedValue([{ id: '1' }]);

            const res = await request(app).get('/journal/entries');
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });

    describe('POST /webhooks/github', () => {
        const payload = {
            ref: 'refs/heads/main',
            repository: { name: 'repo', owner: { name: 'owner' }, html_url: 'http://repo' },
            pusher: { email: 'test@test.com' },
            commits: [
                {
                    id: 'hash123',
                    message: 'msg',
                    time: 'timestamp',
                    author: { email: 'author@test.com' },
                    added: ['file.ts'],
                    modified: []
                }
            ]
        };
        const body = JSON.stringify(payload);
        const signature = 'sha256=' + crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');

        it('should process webhook and create journal entry + index files', async () => {
            (fetchFileContent as jest.Mock).mockResolvedValue('code content');
            (createJournalEntry as jest.Mock).mockResolvedValue({});
            mockedAxios.post.mockResolvedValue({});

            const res = await request(app)
                .post('/webhooks/github')
                .set('x-github-event', 'push')
                .set('x-hub-signature-256', signature)
                .set('Content-Type', 'application/json')
                .send(payload);

            expect(res.status).toBe(200);

            // Allow async processing to happen (webhook might not await everything in the handler, 
            // but in my implementation I awaited processPushEvent so it should be fine)

            expect(createJournalEntry).toHaveBeenCalledWith(expect.objectContaining({
                git_context: expect.objectContaining({ git_commit_hash: 'hash123' })
            }));

            expect(fetchFileContent).toHaveBeenCalledWith('owner', 'repo', 'file.ts', 'hash123');
        });

        it('should reject invalid signatures', async () => {
            const res = await request(app)
                .post('/webhooks/github')
                .set('x-github-event', 'push')
                .set('x-hub-signature-256', 'invalid')
                .send(payload);

            expect(res.status).toBe(401);
        });
    });
});
