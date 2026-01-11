
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;

    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'Config error' }, { status: 500 });

    try {
        const res = await fetch(`${JOURNAL_SERVICE_URL}/docs/${id}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch doc' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL;

    if (!JOURNAL_SERVICE_URL) return NextResponse.json({ error: 'Config error' }, { status: 500 });

    try {
        const res = await fetch(`${JOURNAL_SERVICE_URL}/docs/${id}`, { method: 'DELETE' });
        if (res.status === 204) return new NextResponse(null, { status: 204 });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete doc' }, { status: 500 });
    }
}
