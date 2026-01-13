
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export async function GET(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;
    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    const { searchParams } = new URL(request.url);

    try {
        // Forward query params (e.g. ?repoUrl=...)
        const res = await fetch(`${JOURNAL_SERVICE_URL}/projects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`, { cache: 'no-store' });
        if (!res.ok) {
            // Pass through upstream error
            const errBody = await res.text();
            return new NextResponse(errBody, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('BFF Fetch Projects Error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;
    if (!JOURNAL_SERVICE_URL) {
        console.error('Configuration Error: JOURNAL_SERVICE_URL is missing');
        return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const targetUrl = `${JOURNAL_SERVICE_URL}/projects`;
        console.log(`[BFF] POST Project -> Attempting to fetch: ${targetUrl}`);

        // Extract GitHub Token from Session
        const cookies = parse(request.headers.get('cookie') || '');
        const sessionToken = cookies.devdoc_session;
        let githubToken = '';

        if (sessionToken) {
            try {
                const jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
                const decoded = jwt.verify(sessionToken, jwtSecret) as any;
                githubToken = decoded.access_token || '';
            } catch (e) {
                console.warn('Failed to decode session token for GitHub auth', e);
            }
        }

        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-GitHub-Token': githubToken // Pass token to Journal Service
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const errBody = await res.text();
            return new NextResponse(errBody, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error('BFF Upsert Project Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to upsert project' }, { status: 500 });
    }
}
