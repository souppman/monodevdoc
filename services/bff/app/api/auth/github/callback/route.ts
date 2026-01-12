import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
    }




    try {
        // 1. Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return NextResponse.json({ error: tokenData.error_description || 'Failed to exchange code' }, { status: 400 });
        }

        const accessToken = tokenData.access_token;

        // 2. Fetch User Profile
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userData = await userResponse.json();

        // 3. Create Session JWT
        // In a real app, generate a better secret or use a dedicated auth service.
        const jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';

        const sessionToken = jwt.sign(
            {
                id: userData.id,
                login: userData.login,
                name: userData.name,
                avatar_url: userData.avatar_url,
                access_token: accessToken, // Storing here for simplicity in this mono-context
            },
            jwtSecret,
            { expiresIn: '7d' }
        );

        // 4. Set Cookie
        const cookie = serialize('devdoc_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        // 5. Redirect to Frontend
        const response = NextResponse.redirect(new URL('http://localhost:3000/github-auth', request.url));
        response.headers.append('Set-Cookie', cookie);

        return response;

    } catch (error) {
        console.error('OAuth Callback Error:', error);
        return NextResponse.json({ error: 'Internal Server Error during Auth' }, { status: 500 });
    }
}
