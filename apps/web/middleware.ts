
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('devdoc_session')?.value;
    const { pathname } = request.nextUrl;

    // Protected Routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/journal')) {
        if (!sessionToken) {
            // Redirect to GitHub Auth page if not logged in
            const loginUrl = new URL('/github-auth', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Auth Page Logic: If already logged in, no need to stay on "Connect" page unless intentionally switching?
    // Actually, /github-auth is also the "Project Selector", so we allow logged-in users there.

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/journal/:path*', '/github-auth'],
};
