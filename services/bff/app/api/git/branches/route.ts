
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
        const ghRes = await fetch(`https://api.github.com/repos/${repo}/branches`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        });

        if (!ghRes.ok) {
            console.error('GitHub API Error:', await ghRes.text());
            return NextResponse.json({ error: 'Failed to fetch branches from GitHub' }, { status: ghRes.status });
        }

        const branches = await ghRes.json();

        // 4. Map to Frontend Format
        const mappedBranches = branches.map((b: any) => ({
            name: b.name,
            current: false // GitHub API doesn't know "current" context of local machine
        }));

        return NextResponse.json(mappedBranches);

    } catch (error) {
        console.error('BFF Branches Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
