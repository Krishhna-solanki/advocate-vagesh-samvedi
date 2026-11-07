import { holidayOn } from '@/config/holidays-mp';
import { t, type Lang } from './i18n';

// Appointment rules, shared by the chat (instant feedback) and the server (the authority).
// Google Calendar decides which of these possible slots are actually free.
export const SCHEDULE = {
  timezone: 'Asia/Kolkata',
  /** India has no daylight saving, so this offset is exact all year */
  offset: '+05:30',
  /** 0 = Sunday … 6 = Saturday */
  workingDays: [1, 2, 3, 4, 5, 6],
  start: '18:00',
  end: '21:00',
  slotMinutes: 30,
  /** Visitors can book up to this many days ahead */
  bookingWindowDays: 60,
  /** Slots starting sooner than this are not offered */
  minNoticeMinutes: 60,
} as const;

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const pad = (n: number) => String(n).padStart(2, '0');

/** Today's date in India, YYYY-MM-DD */
export function todayIst(now = new Date()) {
  return new Date(now.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export type DateCheck =
  | { ok: true }
  | { ok: false; reason: 'invalid' | 'past' | 'sunday' | 'holiday' | 'too-far'; holiday?: string };

export function checkDate(date: string, now = new Date()): DateCheck {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return { ok: false, reason: 'invalid' };
  const today = todayIst(now);
  if (date < today) return { ok: false, reason: 'past' };
  if (date > addDays(today, SCHEDULE.bookingWindowDays)) return { ok: false, reason: 'too-far' };
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (!(SCHEDULE.workingDays as readonly number[]).includes(weekday)) return { ok: false, reason: 'sunday' };
  const holiday = holidayOn(date);
  if (holiday) return { ok: false, reason: 'holiday', holiday: holiday.name };
  return { ok: true };
}

/** Every possible slot start on a date (ISO, UTC), ignoring the calendar */
export function possibleSlots(date: string): { start: string; end: string; time: string }[] {
  const out = [];
  for (let m = toMin(SCHEDULE.start); m + SCHEDULE.slotMinutes <= toMin(SCHEDULE.end); m += SCHEDULE.slotMinutes) {
    const time = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
    const e = m + SCHEDULE.slotMinutes;
    out.push({
      time,
      start: new Date(`${date}T${time}:00${SCHEDULE.offset}`).toISOString(),
      end: new Date(`${date}T${pad(Math.floor(e / 60))}:${pad(e % 60)}:00${SCHEDULE.offset}`).toISOString(),
    });
  }
  return out;
}

/** Message for a date that can't be booked, in the visitor's language */
export function dateProblem(check: Exclude<DateCheck, { ok: true }>, lang: Lang = 'en') {
  const m = t(lang);
  switch (check.reason) {
    case 'past':
      return m.datePast;
    case 'sunday':
      return m.dateSunday;
    case 'holiday':
      return m.dateHoliday(check.holiday);
    case 'too-far':
      return m.dateTooFar(SCHEDULE.bookingWindowDays);
    default:
      return m.dateInvalid;
  }
}

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions, locale = 'en-IN') =>
  new Intl.DateTimeFormat(locale, { timeZone: SCHEDULE.timezone, ...opts }).format(new Date(iso));

/** "Monday, 9 November 2026" / "सोमवार, 9 नवंबर 2026" */
export const formatDate = (iso: string, lang: Lang = 'en') => {
  const loc = lang === 'hi' ? 'hi-IN' : 'en-IN';
  return `${fmt(iso, { weekday: 'long' }, loc)}, ${fmt(iso, { day: 'numeric' }, loc)} ${fmt(iso, { month: 'long' }, loc)} ${fmt(iso, { year: 'numeric' }, loc)}`;
};

/** "6:30 pm" */
export const formatTime = (iso: string) => fmt(iso, { hour: 'numeric', minute: '2-digit', hour12: true });

/** "6:00 pm – 6:30 pm" */
export const formatRange = (start: string, end: string) => `${formatTime(start)} – ${formatTime(end)}`;

/** Accepts Indian mobile numbers (with or without +91 / 0) and international numbers with a + prefix */
export function normalisePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^0[6-9]\d{9}$/.test(digits)) return `+91${digits.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  if (trimmed.startsWith('+') && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}

export const validEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()) && s.trim().length <= 200;
