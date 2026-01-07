import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;

    if (!JOURNAL_SERVICE_URL) {
        return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    }

    try {
        const res = await fetch(`${JOURNAL_SERVICE_URL}/journal/entries${request.nextUrl.search}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch from Journal Service' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;

    if (!JOURNAL_SERVICE_URL) {
        return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const res = await fetch(`${JOURNAL_SERVICE_URL}/journal/entries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to post to Journal Service' }, { status: 500 });
    }
}
