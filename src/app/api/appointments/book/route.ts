import { NextResponse } from 'next/server';
import { z } from 'zod';
import { formatDate, normalisePhone, validEmail } from '@/lib/appointments/schedule';
import { t } from '@/lib/appointments/i18n';
import { book, clientIp, notifyAdvocate, rateLimited } from '@/lib/appointments/server';
import { GoogleError, googleConfigured } from '@/lib/google';

export const dynamic = 'force-dynamic';

// Single-line, printable text: keeps the calendar entry and email tidy
const clean = (max: number, min = 1) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim())
    .pipe(z.string().min(min).max(max));

const schema = z.object({
  start: z.string().datetime({ offset: true }),
  name: clean(120, 2),
  address: clean(300, 10),
  email: clean(200, 5),
  phone: clean(25, 1),
  purpose: clean(500, 3),
  website: z.string().optional().nullable(), // honeypot
});

export async function POST(req: Request) {
  const raw = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const lang = raw?.lang === 'hi' ? 'hi' : 'en';
  const m = t(lang);

  if (!googleConfigured()) return NextResponse.json({ error: m.serverUnavailable }, { status: 503 });
  if (rateLimited(`book:${clientIp(req)}`, 10, 60 * 60 * 1000)) return NextResponse.json({ error: m.tooMany }, { status: 429 });

  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: m.detailsInvalid, field: parsed.error.issues[0]?.path[0] }, { status: 400 });
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ error: m.detailsInvalid }, { status: 400 });
  if (!validEmail(data.email)) return NextResponse.json({ error: m.emailInvalid, field: 'email' }, { status: 400 });
  const phone = normalisePhone(data.phone);
  if (!phone) return NextResponse.json({ error: m.phoneInvalid, field: 'phone' }, { status: 400 });
  const input = { ...data, phone };

  let outcome;
  try {
    outcome = await book(input);
  } catch (e) {
    const kind = e instanceof GoogleError ? e.kind : 'unknown';
    console.error('[appointments] booking failed:', kind, e instanceof Error ? e.message : e);
    // Nothing was confirmed, so never report success
    return NextResponse.json({ error: m.bookFailed }, { status: 503 });
  }

  if (!outcome.ok) {
    return NextResponse.json({ error: outcome.error === 'taken' ? m.taken : m.slotGone, code: outcome.error }, { status: 409 });
  }

  // The event exists in Google Calendar from here on. Email problems never undo or repeat the booking.
  let emailSent: boolean | null = null;
  if (!outcome.repeat) {
    const mail = await notifyAdvocate(input, outcome);
    emailSent = mail.sent;
    if (!mail.sent) console.error(`[appointments] booking ${outcome.reference} saved, but the notification email failed: ${mail.reason}`);
  }

  return NextResponse.json({
    ok: true,
    appointment: { reference: outcome.reference, date: formatDate(outcome.start, lang), time: outcome.time, name: input.name },
    emailSent,
  });
}
