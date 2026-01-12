import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    const clientId = process.env.GITHUB_CLIENT_ID;

    // Fallback for demo if not configured, though we expect it to be.
    if (!clientId) {
        return NextResponse.json({ error: 'GitHub Client ID not configured' }, { status: 500 });
    }

    // Use the RAILWAY_PUBLIC_DOMAIN if present (Railway automatically sets this)
    // Otherwise fallback to process.env.BFF_URL or localhost
    const bffUrl = process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : (process.env.BFF_URL || 'http://localhost:4000');

    const redirectUri = `${bffUrl}/api/auth/github/callback`;
    const scopes = 'read:user repo'; // We need repo scope to list private repos and push journal entries

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

    return NextResponse.redirect(githubAuthUrl);
}
