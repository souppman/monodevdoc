import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const cookies = parse(request.headers.get('cookie') || '');
    const sessionToken = cookies.devdoc_session;

    if (!sessionToken) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    try {
        const jwtSecret = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod';
        const decoded = jwt.verify(sessionToken, jwtSecret);

        return NextResponse.json({ authenticated: true, user: decoded });
    } catch (error) {
        return NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 200 });
    }
}
