
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

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    if (!owner || !repo) {
        return NextResponse.json({ error: 'Missing owner or repo parameters' }, { status: 400 });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
        const decoded = jwt.verify(sessionToken, jwtSecret) as any;
        const accessToken = decoded.access_token;

        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('GitHub API Error:', response.status, errorBody);
            throw new Error(`Failed to fetch branches from GitHub: ${response.status}`);
        }

        const branches = await response.json();
        return NextResponse.json(branches);

    } catch (error) {
        console.error('Error fetching branches:', error);
        return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }
}
