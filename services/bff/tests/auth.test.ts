
import { GET as GitHubAuthGET } from '../app/api/auth/github/route';
import { NextRequest } from 'next/server';

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
});

afterAll(() => {
    process.env = originalEnv;
});

describe('GET /api/auth/github', () => {
    it('should redirect to GitHub OAuth URL with correct parameters', async () => {
        process.env.GITHUB_CLIENT_ID = 'test_client_id';

        const req = new NextRequest('http://localhost:4000/api/auth/github');
        const res = await GitHubAuthGET(req);

        expect(res.status).toBe(307); // NextResponse.redirect uses 307 by default
        const redirectUrl = res.headers.get('Location');
        expect(redirectUrl).toContain('https://github.com/login/oauth/authorize');
        expect(redirectUrl).toContain('client_id=test_client_id');
        expect(redirectUrl).toContain('scope=read%3Auser%20repo');
    });

    it('should return 500 if GITHUB_CLIENT_ID is missing', async () => {
        delete process.env.GITHUB_CLIENT_ID;

        const req = new NextRequest('http://localhost:4000/api/auth/github');
        const res = await GitHubAuthGET(req);

        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.error).toBe('GitHub Client ID not configured');
    });
});
