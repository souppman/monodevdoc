
import { NextResponse } from 'next/server';
import axios from 'axios';

const JOURNAL_SERVICE_URL = process.env.JOURNAL_SERVICE_URL || 'http://localhost:3001';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    console.log(`[BFF] Proxying to Journal Service: GET /git/branches?projectId=${projectId || ''}`);

    try {
        const response = await axios.get(`${JOURNAL_SERVICE_URL}/git/branches`, {
            params: { projectId }
        });
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('[BFF] Error proxying to Journal Service:', error.message);
        if (error.response) {
            return NextResponse.json(error.response.data, { status: error.response.status });
        }
        return NextResponse.json({ error: 'Failed to fetch git branches' }, { status: 500 });
    }
}
