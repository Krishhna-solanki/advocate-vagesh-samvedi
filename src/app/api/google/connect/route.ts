import { NextResponse } from 'next/server';
import { connectConfigured, consentUrl, keyMatches } from '@/lib/google';

export const dynamic = 'force-dynamic';

// Step 1 of connecting the advocate's Google account (one time):
// open /api/google/connect?key=<GOOGLE_CONNECT_KEY>, sign in as the calendar owner and allow access.
export async function GET(req: Request) {
  if (!connectConfigured()) {
    return new NextResponse('Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and GOOGLE_CONNECT_KEY (16+ characters) first.', { status: 503 });
  }
  if (!keyMatches(new URL(req.url).searchParams.get('key'))) return new NextResponse('Not found', { status: 404 });
  return NextResponse.redirect(consentUrl(new URL('/api/google/callback', req.url).toString()));
}
