import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Google Calendar + Gmail over their REST APIs (free within Google's normal quotas), server side only.
// Credentials live in environment variables; the browser never sees them.
//   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET — OAuth client from Google Cloud Console
//   GOOGLE_REFRESH_TOKEN — obtained once via /api/google/connect, then stored in Vercel
//   GOOGLE_CALENDAR_ID — calendar to read/write (default "primary" of the connected account)
//   GOOGLE_CONNECT_KEY — setup key that protects /api/google/connect and /api/google/status

export const GOOGLE_SCOPES = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/calendar.freebusy',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.send',
];

// Lets local tests point at a stand-in server. Ignored in production builds.
const override = process.env.NODE_ENV !== 'production' ? process.env.GOOGLE_API_BASE_OVERRIDE : undefined;
const URLS = {
  auth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: override ? `${override}/token` : 'https://oauth2.googleapis.com/token',
  calendar: override ? `${override}/calendar/v3` : 'https://www.googleapis.com/calendar/v3',
  gmail: override ? `${override}/gmail/v1` : 'https://gmail.googleapis.com/gmail/v1',
};

export const calendarId = () => process.env.GOOGLE_CALENDAR_ID || 'primary';

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);
}

export class GoogleError extends Error {
  constructor(
    message: string,
    public status: number,
    /** 'auth' = the stored authorisation no longer works and must be reconnected */
    public kind: 'auth' | 'api' | 'network' = 'api',
  ) {
    super(message);
  }
}

// ---------- Access tokens ----------

let cachedToken: { value: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;
  if (!googleConfigured()) throw new GoogleError('Google Calendar is not connected', 503, 'auth');
  let res: Response;
  try {
    res = await fetch(URLS.token, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
        grant_type: 'refresh_token',
      }),
      cache: 'no-store',
    });
  } catch {
    throw new GoogleError('Could not reach Google', 503, 'network');
  }
  const json = (await res.json().catch(() => ({}))) as { access_token?: string; expires_in?: number; error?: string };
  if (!res.ok || !json.access_token) {
    // invalid_grant: the refresh token was revoked, expired or belongs to another client
    throw new GoogleError(`Token refresh failed (${json.error ?? res.status})`, res.status, 'auth');
  }
  cachedToken = { value: json.access_token, expires: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

/** Authorised request with one retry for rate limits (429) and temporary server errors (5xx) */
async function call(url: string, init: RequestInit = {}, attempt = 0): Promise<Response> {
  const token = await accessToken();
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers }, cache: 'no-store' });
  } catch {
    if (attempt === 0) return call(url, init, 1);
    throw new GoogleError('Could not reach Google', 503, 'network');
  }
  if (res.status === 401 && attempt === 0) {
    cachedToken = null;
    return call(url, init, 1);
  }
  if ((res.status === 429 || res.status >= 500 || (res.status === 403 && /rateLimit/i.test(await res.clone().text()))) && attempt === 0) {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    return call(url, init, 1);
  }
  return res;
}

async function fail(res: Response, what: string): Promise<never> {
  const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
  throw new GoogleError(`${what} failed (${res.status}${body.error?.message ? `: ${body.error.message}` : ''})`, res.status, res.status === 401 ? 'auth' : 'api');
}

// ---------- Calendar ----------

export type Busy = { start: string; end: string };

/** Busy periods of the calendar between two instants. Only times are returned — never event details. */
export async function freeBusy(timeMin: string, timeMax: string): Promise<Busy[]> {
  const id = calendarId();
  const res = await call(`${URLS.calendar}/freeBusy`, { method: 'POST', body: JSON.stringify({ timeMin, timeMax, timeZone: 'Asia/Kolkata', items: [{ id }] }) });
  if (!res.ok) await fail(res, 'FreeBusy');
  const json = (await res.json()) as { calendars?: Record<string, { busy?: Busy[]; errors?: { reason: string }[] }> };
  const cal = json.calendars?.[id] ?? Object.values(json.calendars ?? {})[0];
  // A per-calendar error (e.g. notFound) must never be read as "free"
  if (!cal || cal.errors?.length) throw new GoogleError(`FreeBusy calendar error: ${cal?.errors?.map((e) => e.reason).join(', ') ?? 'missing'}`, 502);
  return cal.busy ?? [];
}

export type CalendarEvent = {
  id: string;
  status?: string;
  etag?: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  extendedProperties?: { private?: Record<string, string> };
};

const eventsUrl = (suffix = '') => `${URLS.calendar}/calendars/${encodeURIComponent(calendarId())}/events${suffix}`;

/** Creates an event. Returns null if an event with this id already exists (409). */
export async function insertEvent(event: Record<string, unknown>): Promise<CalendarEvent | null> {
  const res = await call(eventsUrl('?sendUpdates=none'), { method: 'POST', body: JSON.stringify(event) });
  if (res.status === 409) return null;
  if (!res.ok) await fail(res, 'Event creation');
  return (await res.json()) as CalendarEvent;
}

export async function getEvent(id: string): Promise<CalendarEvent | null> {
  const res = await call(eventsUrl(`/${encodeURIComponent(id)}`));
  if (res.status === 404 || res.status === 410) return null;
  if (!res.ok) await fail(res, 'Event lookup');
  return (await res.json()) as CalendarEvent;
}

/** Replaces an event only if it is unchanged since it was read (etag). Returns null if someone changed it first. */
export async function replaceEvent(id: string, etag: string, event: Record<string, unknown>): Promise<CalendarEvent | null> {
  const res = await call(eventsUrl(`/${encodeURIComponent(id)}?sendUpdates=none`), { method: 'PUT', headers: { 'If-Match': etag }, body: JSON.stringify(event) });
  if (res.status === 412 || res.status === 409) return null;
  if (!res.ok) await fail(res, 'Event update');
  return (await res.json()) as CalendarEvent;
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await call(eventsUrl(`/${encodeURIComponent(id)}?sendUpdates=none`), { method: 'DELETE' });
  if (!res.ok && res.status !== 404 && res.status !== 410) await fail(res, 'Event deletion');
}

/** Light check used by /api/google/status: can we read this calendar? */
export async function calendarInfo(): Promise<{ summary: string; timeZone: string }> {
  const res = await call(`${URLS.calendar}/calendars/${encodeURIComponent(calendarId())}`);
  if (!res.ok) await fail(res, 'Calendar lookup');
  return (await res.json()) as { summary: string; timeZone: string };
}

// ---------- Gmail ----------

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

/** Sends a plain-text email from the connected Google account (Gmail API, gmail.send scope). */
export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const mime = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    b64(text).replace(/.{76}/g, '$&\r\n'),
  ].join('\r\n');
  const raw = Buffer.from(mime).toString('base64url');
  const res = await call(`${URLS.gmail}/users/me/messages/send`, { method: 'POST', body: JSON.stringify({ raw }) });
  if (!res.ok) await fail(res, 'Gmail send');
}

// ---------- One-time connection (OAuth consent) ----------

const connectKey = () => process.env.GOOGLE_CONNECT_KEY ?? '';
export const connectConfigured = () => Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && connectKey().length >= 16);

export function keyMatches(input: string | null) {
  if (!input || !connectConfigured()) return false;
  const h = (s: string) => createHmac('sha256', 'connect').update(s).digest();
  return timingSafeEqual(h(input), h(connectKey()));
}

const sign = (v: string) => createHmac('sha256', connectKey()).update(v).digest('base64url');

export function consentUrl(redirectUri: string) {
  const ts = String(Date.now());
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'false',
    state: `${ts}.${sign(ts)}`,
  });
  return `${URLS.auth}?${params}`;
}

export function stateValid(state: string | null) {
  if (!state) return false;
  const [ts, sig] = state.split('.');
  if (!ts || !sig) return false;
  const expected = sign(ts);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  return Date.now() - Number(ts) < 15 * 60_000;
}

export async function exchangeCode(code: string, redirectUri: string) {
  const res = await fetch(URLS.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });
  const json = (await res.json().catch(() => ({}))) as { refresh_token?: string; id_token?: string; scope?: string; error?: string };
  if (!res.ok) throw new GoogleError(`Authorisation failed (${json.error ?? res.status})`, res.status, 'auth');
  // The ID token comes straight from Google over TLS, so its payload can be read without re-verifying it
  let email = '';
  try {
    email = JSON.parse(Buffer.from((json.id_token ?? '').split('.')[1] ?? '', 'base64url').toString()).email ?? '';
  } catch {}
  return { refreshToken: json.refresh_token ?? null, email, scopes: (json.scope ?? '').split(' ') };
}
