
import { NextRequest, NextResponse } from 'next/server';


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
    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });

    try {
        const body = await request.json();

        const res = await fetch(`${JOURNAL_SERVICE_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
