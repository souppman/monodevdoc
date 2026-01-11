import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const cookies = parse(request.headers.get('cookie') || '');
    const sessionToken = cookies.devdoc_session;

    if (!sessionToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
        const decoded = jwt.verify(sessionToken, jwtSecret) as any;
        const accessToken = decoded.access_token;

        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch repos from GitHub');
        }

        const repos = await response.json();

        // Map to simpler format
        const cleanRepos = repos.map((r: any) => ({
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            html_url: r.html_url,
            private: r.private,
            default_branch: r.default_branch,
        }));

        return NextResponse.json(cleanRepos);

    } catch (error) {
        console.error('Error fetching repos:', error);
        return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
    }
}
