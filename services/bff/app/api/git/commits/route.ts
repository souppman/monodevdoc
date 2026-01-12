import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get('repo'); // "owner/repo"

    // 1. Auth Check
    const cookies = parse(request.headers.get('cookie') || '');
    const sessionToken = cookies.devdoc_session;

    if (!sessionToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!repo) {
        return NextResponse.json({ error: 'Missing repo query param' }, { status: 400 });
    }

    try {
        // 2. Extract Access Token
        const jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
        const decoded = jwt.verify(sessionToken, jwtSecret) as any;
        const accessToken = decoded.access_token;

        // 3. Call GitHub API
        const ghRes = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=10`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!ghRes.ok) {
            console.error('GitHub API Error:', await ghRes.text());
            return NextResponse.json({ error: 'Failed to fetch commits from GitHub' }, { status: ghRes.status });
        }

        const commits = await ghRes.json();

        // 4. Map to Frontend Format
        const mappedHelper = commits.map((c: any) => ({
            gitCommitHash: c.sha,
            content: c.commit.message,
            date: c.commit.author.date,
            author: c.commit.author.name
        }));

        return NextResponse.json(mappedHelper);

    } catch (error) {
        console.error('BFF Commits Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
