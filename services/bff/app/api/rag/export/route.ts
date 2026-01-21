import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL;

    if (!RAG_SERVICE_URL) {
        return NextResponse.json({ error: 'RAG_SERVICE_URL not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Forward to RAG Service /export endpoint
        const res = await fetch(`${RAG_SERVICE_URL}/export`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json({ error: `RAG Service Error: ${errorText}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error('BFF RAG Export Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to connect to RAG Service' }, { status: 500 });
    }
}
