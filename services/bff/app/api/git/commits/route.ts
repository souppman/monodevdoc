
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;

    if (!JOURNAL_SERVICE_URL) {
        return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    }

    try {
        const res = await fetch(`${JOURNAL_SERVICE_URL}/git/commits`);

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch commits from journal service' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('BFF Proxy Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
