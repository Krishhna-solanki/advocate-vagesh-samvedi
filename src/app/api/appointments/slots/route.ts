import { NextResponse } from 'next/server';
import { checkDate, dateProblem } from '@/lib/appointments/schedule';
import { isLang, t } from '@/lib/appointments/i18n';
import { availableSlots, clientIp, rateLimited } from '@/lib/appointments/server';
import { GoogleError, googleConfigured } from '@/lib/google';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

// Free slots for one date, read live from Google Calendar (FreeBusy) on every request.
// Visitors only learn which times are free — never what the advocate's events are.
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const lang = isLang(params.get('lang')) ? (params.get('lang') as 'en' | 'hi') : 'en';
  const m = t(lang);
  const date = params.get('date') ?? '';
  const check = checkDate(date);
  if (!check.ok) return NextResponse.json({ error: dateProblem(check, lang), reason: check.reason }, { status: 400, headers: noStore });

  if (!googleConfigured()) return NextResponse.json({ configured: false, error: m.serverUnavailable }, { status: 503, headers: noStore });
  if (rateLimited(`slots:${clientIp(req)}`, 60, 60 * 60 * 1000)) return NextResponse.json({ error: m.tooMany }, { status: 429, headers: noStore });
  try {
    const { slots, someBusy } = await availableSlots(date);
    return NextResponse.json({ configured: true, date, slots, someBusy }, { headers: noStore });
  } catch (e) {
    const kind = e instanceof GoogleError ? e.kind : 'unknown';
    console.error('[appointments] availability failed:', kind, e instanceof Error ? e.message : e);
    // Never fall back to guessed availability
    return NextResponse.json({ error: kind === 'auth' ? m.serverUnavailable : m.scheduleError }, { status: 503, headers: noStore });
  }
}
