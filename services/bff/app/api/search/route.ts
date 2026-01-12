
import { NextResponse } from 'next/server';
import axios from 'axios';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

export async function POST(request: Request) {
    try {
        const body = await request.json();


        const response = await axios.post(`${RAG_SERVICE_URL}/query`, body);
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('[BFF] Error proxying to RAG Service:', error.message);
        if (error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
    }
}
