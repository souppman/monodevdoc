
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL;

    if (!RAG_SERVICE_URL) {
        return NextResponse.json({ error: 'RAG_SERVICE_URL not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Forward the request to the RAG service's /query endpoint (or /generate if that's what we decided, checking main.py)
        // main.py has /query for RAGQueryRequest. The UI "Generate" feature basically queries the RAG service.
        // Let's check main.py again. It accepts RAGQueryRequest at /query.
        // The implementation plan said /generate, but main.py has /query. I will use /query to match the actual service.

        const res = await fetch(`${RAG_SERVICE_URL}/query`, {
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
        console.error('BFF RAG Proxy Error:', error);
        return NextResponse.json({ error: 'Failed to connect to RAG Service' }, { status: 500 });
    }
}
