
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;
    const { searchParams } = new URL(request.url);
    const repoUrl = searchParams.get('repoUrl');

    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'JOURNAL_SERVICE_URL not configured' }, { status: 500 });
    if (!repoUrl) return NextResponse.json({ error: 'repoUrl required' }, { status: 400 });

    try {
        const res = await fetch(`${JOURNAL_SERVICE_URL}/projects/lookup?repoUrl=${repoUrl}`, { cache: 'no-store' });
        if (!res.ok) {
            if (res.status === 404) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            throw new Error(`Upstream error: ${res.status}`);
        }
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('BFF Project Lookup Error:', error);
        return NextResponse.json({ error: 'Failed to lookup project' }, { status: 500 });
    }
}
