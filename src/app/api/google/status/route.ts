import { NextResponse } from 'next/server';
import { calendarInfo, freeBusy, GoogleError, googleConfigured, keyMatches } from '@/lib/google';

export const dynamic = 'force-dynamic';

// Setup check: /api/google/status?key=<GOOGLE_CONNECT_KEY>
// Confirms the stored authorisation works and the calendar can be read. Shows no event details.
export async function GET(req: Request) {
  if (!keyMatches(new URL(req.url).searchParams.get('key'))) return new NextResponse('Not found', { status: 404 });
  const result: Record<string, unknown> = {
    configured: googleConfigured(),
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    notifyEmailSet: Boolean(process.env.APPOINTMENT_NOTIFY_EMAIL),
  };
  if (!googleConfigured()) return NextResponse.json({ ...result, ok: false, problem: 'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET or GOOGLE_REFRESH_TOKEN missing' });
  try {
    const info = await calendarInfo();
    const now = new Date();
    const busy = await freeBusy(now.toISOString(), new Date(now.getTime() + 7 * 86400_000).toISOString());
    return NextResponse.json({ ...result, ok: true, calendar: info.summary, calendarTimeZone: info.timeZone, busyPeriodsNext7Days: busy.length }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return NextResponse.json({
      ...result,
      ok: false,
      problem: e instanceof GoogleError ? `${e.kind}: ${e.message}` : 'unknown error',
      hint: e instanceof GoogleError && e.kind === 'auth' ? 'Reconnect via /api/google/connect?key=… and update GOOGLE_REFRESH_TOKEN.' : undefined,
    });
  }
}
