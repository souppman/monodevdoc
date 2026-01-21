
import { GET as CallbackGET } from '../app/api/auth/github/callback/route';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, GITHUB_CLIENT_ID: 'id', GITHUB_CLIENT_SECRET: 'secret', JWT_SECRET: 'testsecret' };
    global.fetch = jest.fn();
});

afterAll(() => {
    process.env = originalEnv;
});

describe('GET /api/auth/github/callback', () => {
    it('should return 400 if code is missing', async () => {
        const req = new NextRequest('http://localhost:4000/api/auth/github/callback');
        const res = await CallbackGET(req);

        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('Missing code parameter');
    });

    it('should handle successful login flow', async () => {
        // Mock GitHub Access Token Response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ access_token: 'gh_token_123' }),
            ok: true
        });

        // Mock GitHub User Profile Response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ id: 12345, login: 'testuser', name: 'Test User', avatar_url: 'http://avatar.url' }),
            ok: true
        });

        const req = new NextRequest('http://localhost:4000/api/auth/github/callback?code=valid_code');
        const res = await CallbackGET(req);

        // Verify Redirect
        expect(res.status).toBe(307);
        expect(res.headers.get('Location')).toBe('http://localhost:3000/github-auth');

        // Verify Cookie
        const setCookie = res.headers.get('Set-Cookie');
        expect(setCookie).toBeTruthy();

        // Parse Cookie to verify JWT
        // Cookie format: devdoc_session=...; Path=/; HttpOnly...
        const parsedCookie = parse(setCookie || '');
        const sessionToken = parsedCookie.devdoc_session;

        expect(sessionToken).toBeTruthy();

        const decoded = jwt.verify(sessionToken, 'testsecret') as any;
        expect(decoded.login).toBe('testuser');
        expect(decoded.access_token).toBe('gh_token_123');
    });

    it('should handle GitHub error response', async () => {
        // Mock GitHub Error
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ error: 'bad_verification_code', error_description: 'The code is invalid' }),
            ok: true
        });

        const req = new NextRequest('http://localhost:4000/api/auth/github/callback?code=invalid_code');
        const res = await CallbackGET(req);

        expect(res.status).toBe(400);
        const body = await res.json();
        expect(body.error).toBe('The code is invalid');
    });
});
