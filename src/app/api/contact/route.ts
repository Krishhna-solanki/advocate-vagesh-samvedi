import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(20).max(3000),
  website: z.string().optional().nullable(), // honeypot
  elapsedMs: z.number().optional(),
});

// Best-effort, per-instance rate limit. Use a shared store (e.g. Upstash) on multi-instance hosting.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages. Please try again later or write by email.' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the form fields and try again.' }, { status: 400 });
  }
  const { name, email, message, website, elapsedMs } = parsed.data;

  // Spam: filled honeypot or submitted implausibly fast. Respond as if successful.
  if (website || (elapsedMs !== undefined && elapsedMs < 3000)) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[contact] Delivery not configured; received submission from', email);
      return NextResponse.json({ ok: true, delivered: false });
    }
    return NextResponse.json(
      { error: 'The contact form is not yet configured. Please write directly by email.' },
      { status: 503 },
    );
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });

  if (!res.ok) {
    console.error('[contact] Email provider error', res.status);
    return NextResponse.json({ error: 'Your message could not be sent. Please try again or write by email.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
