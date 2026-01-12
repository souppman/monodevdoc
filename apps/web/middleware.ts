
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const sessionToken = request.cookies.get('devdoc_session')?.value;
    const { pathname } = request.nextUrl;

    // Public Routes (Auth, etc.)
    if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    // Protected Routes (Dashboard, Journal, Settings, and now API)
    // We protect everything by default for "Security Audit" purposes, or specific sensitive paths.
    // Given the request for "security", blocking all /api except auth is safer.
    const isApiRoute = pathname.startsWith('/api/');
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/journal') || pathname.startsWith('/settings') || isApiRoute;

    if (isProtectedRoute) {
        if (!sessionToken) {
            if (isApiRoute) {
                // For API, return 401 instead of redirecting
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            } else {
                // For Pages, redirect to GitHub Auth
                const loginUrl = new URL('/github-auth', request.url);
                return NextResponse.redirect(loginUrl);
            }
        }
    }

    // Auth Page Logic: /github-auth is also the "Project Selector", so we allow logged-in users there.

    return NextResponse.next();
}

export const config = {
    // Match everything except static files
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
