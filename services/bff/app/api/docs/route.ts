
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

    try {
        const res = await fetch(`${JOURNAL_SERVICE_URL}/docs?projectId=${projectId}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch docs' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;
    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });

    try {
        const body = await request.json();
        const res = await fetch(`${JOURNAL_SERVICE_URL}/docs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save doc' }, { status: 500 });
    }
}
