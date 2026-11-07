import 'server-only';
import { createHash } from 'node:crypto';
import { checkDate, formatDate, formatRange, possibleSlots, SCHEDULE } from './schedule';
import { freeBusy, getEvent, insertEvent, replaceEvent, sendEmail, type Busy } from '../google';

// Google Calendar is the single source of truth: a slot is free only if FreeBusy shows nothing overlapping it.
// That covers the advocate's own events and appointments booked through the website (they are calendar events).

const overlaps = (aStart: string, aEnd: string, b: Busy) => new Date(aStart) < new Date(b.end) && new Date(aEnd) > new Date(b.start);

export type SlotView = { start: string; end: string; label: string };

export async function availableSlots(date: string, now = new Date()) {
  const all = possibleSlots(date);
  const busy = await freeBusy(all[0].start, all[all.length - 1].end);
  const earliest = now.getTime() + SCHEDULE.minNoticeMinutes * 60_000;
  const upcoming = all.filter((s) => new Date(s.start).getTime() >= earliest);
  const free = upcoming.filter((s) => !busy.some((b) => overlaps(s.start, s.end, b)));
  return {
    slots: free.map((s) => ({ start: s.start, end: s.end, label: formatRange(s.start, s.end) })),
    /** True when the calendar (not just the clock) removed at least one slot */
    someBusy: free.length < upcoming.length,
  };
}

export type BookingInput = { start: string; name: string; address: string; email: string; phone: string; purpose: string };

export type BookingOutcome =
  | { ok: true; reference: string; start: string; end: string; date: string; time: string; repeat: boolean; eventId: string }
  | { ok: false; error: 'invalid-slot' | 'taken' };

// One event id per slot ("vsappt" + IST date/time). Google rejects a second event with the same id, so two
// visitors can't both book a slot even if they press confirm at the same moment.
// Event ids may use only the characters a–v and 0–9.
const eventIdFor = (start: string) => {
  const ist = new Date(new Date(start).getTime() + 330 * 60_000).toISOString(); // 2026-11-09T18:00:00.000Z (IST clock)
  return `vsappt${ist.slice(0, 16).replace(/\D/g, '')}`;
};
const referenceFor = (eventId: string) => `VS-${eventId.slice(6, 14)}-${eventId.slice(14)}`;
// Lets a repeated submission by the same visitor be recognised without copying personal data into extra fields
const requestKey = (b: BookingInput) => createHash('sha256').update(`${b.phone}|${b.email.toLowerCase()}`).digest('hex').slice(0, 32);

export async function book(b: BookingInput, now = new Date()): Promise<BookingOutcome> {
  // The slot must be one of the advertised slots, on an allowed date, still in the future
  const date = new Date(new Date(b.start).getTime() + 330 * 60_000).toISOString().slice(0, 10);
  const slot = checkDate(date, now).ok ? possibleSlots(date).find((s) => s.start === new Date(b.start).toISOString()) : undefined;
  if (!slot || new Date(slot.start).getTime() < now.getTime() + SCHEDULE.minNoticeMinutes * 60_000) return { ok: false, error: 'invalid-slot' };

  const id = eventIdFor(slot.start);
  const key = requestKey(b);
  const event = {
    id,
    summary: `Client Appointment - ${b.name}`,
    description: [`Client Name: ${b.name}`, `Address: ${b.address}`, `Email: ${b.email}`, `Phone: ${b.phone}`, `Appointment Purpose: ${b.purpose}`, '', 'Booked through the website.'].join('\n'),
    start: { dateTime: `${date}T${new Date(new Date(slot.start).getTime() + 330 * 60_000).toISOString().slice(11, 19)}${SCHEDULE.offset}`, timeZone: SCHEDULE.timezone },
    end: { dateTime: `${date}T${new Date(new Date(slot.end).getTime() + 330 * 60_000).toISOString().slice(11, 19)}${SCHEDULE.offset}`, timeZone: SCHEDULE.timezone },
    status: 'confirmed',
    transparency: 'opaque',
    reminders: { useDefault: true },
    extendedProperties: { private: { source: 'website-booking', requestKey: key } },
  };
  const success = (repeat: boolean): BookingOutcome => ({
    ok: true,
    reference: referenceFor(id),
    start: slot.start,
    end: slot.end,
    date: formatDate(slot.start),
    time: formatRange(slot.start, slot.end),
    repeat,
    eventId: id,
  });

  // Re-check the calendar right before booking
  const busy = await freeBusy(slot.start, slot.end);
  if (busy.some((x) => overlaps(slot.start, slot.end, x))) {
    // Busy because this same visitor already booked it (e.g. a double click or retry)?
    const existing = await getEvent(id);
    if (existing && existing.status !== 'cancelled' && existing.extendedProperties?.private?.requestKey === key) return success(true);
    return { ok: false, error: 'taken' };
  }

  const created = await insertEvent(event);
  if (created) return success(false);

  // The id already exists: booked a moment ago, or an earlier booking for this slot was deleted in Google Calendar
  const existing = await getEvent(id);
  if (!existing) return { ok: false, error: 'taken' };
  if (existing.status !== 'cancelled') {
    return existing.extendedProperties?.private?.requestKey === key ? success(true) : { ok: false, error: 'taken' };
  }
  // A deleted earlier booking: reuse its id, but only if nobody else changed it since we read it
  const revived = existing.etag ? await replaceEvent(id, existing.etag, event) : null;
  return revived ? success(false) : { ok: false, error: 'taken' };
}

/** Email to the advocate. Failure is reported to the caller, never retried by creating another event. */
export async function notifyAdvocate(b: BookingInput, booking: Extract<BookingOutcome, { ok: true }>) {
  const to = process.env.APPOINTMENT_NOTIFY_EMAIL;
  if (!to) return { sent: false, reason: 'APPOINTMENT_NOTIFY_EMAIL not set' };
  const text = [
    'Namaste Sir,',
    '',
    'A new client has booked an appointment through your website.',
    '',
    `Client Name: ${b.name}`,
    `Address: ${b.address}`,
    `Email: ${b.email}`,
    `Contact Number: ${b.phone}`,
    `Appointment Date: ${booking.date}`,
    `Appointment Time: ${booking.time} (IST)`,
    `Purpose: ${b.purpose}`,
    `Reference: ${booking.reference}`,
    '',
    'The appointment has also been added to your Google Calendar.',
    '',
    'Regards,',
    'Advocate Website Appointment System',
  ].join('\n');
  try {
    await sendEmail(to, `New Client Appointment Booked - ${b.name}`, text);
    return { sent: true as const };
  } catch (e) {
    return { sent: false as const, reason: e instanceof Error ? e.message : 'unknown error' };
  }
}

// Best-effort, per-instance rate limit (same approach as the contact form)
const hits = new Map<string, number[]>();
export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export const clientIp = (req: Request) => req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
