import { connectConfigured, exchangeCode, GOOGLE_SCOPES, stateValid } from '@/lib/google';

export const dynamic = 'force-dynamic';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function page(title: string, body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(title)}</title>
<style>body{margin:0;background:#0b0b0b;color:#f5f1e8;font:16px/1.6 system-ui,sans-serif}main{max-width:720px;margin:0 auto;padding:48px 20px}h1{font-weight:500;color:#e4cc91}code,textarea{font:13px ui-monospace,monospace}textarea{width:100%;box-sizing:border-box;background:#151515;color:#e4cc91;border:1px solid #c8a45d;padding:12px}li{margin:6px 0}.muted{color:#aaa6a0}.warn{color:#e8a39a}</style></head><body><main>${body}</main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } },
  );
}

// Step 2: Google sends the advocate back here. The refresh token is shown once, to be saved as an environment
// variable (there is no database). It is never logged or stored by the website itself.
export async function GET(req: Request) {
  const url = new URL(req.url);
  if (!connectConfigured()) return page('Not configured', '<h1>Not configured</h1>', 503);
  if (url.searchParams.get('error')) {
    return page('Not connected', `<h1>Not connected</h1><p>Google reported: <code>${esc(url.searchParams.get('error')!)}</code>. Nothing was changed. You can try again.</p>`, 400);
  }
  if (!stateValid(url.searchParams.get('state'))) {
    return page('Link expired', '<h1>Link expired</h1><p>Please start again from <code>/api/google/connect?key=…</code> (the link is valid for 15 minutes).</p>', 400);
  }
  const code = url.searchParams.get('code');
  if (!code) return page('Missing code', '<h1>Missing code</h1>', 400);

  try {
    const { refreshToken, email, scopes } = await exchangeCode(code, new URL('/api/google/callback', req.url).toString());
    const missing = GOOGLE_SCOPES.filter((s) => s.startsWith('https://') && !scopes.includes(s));
    if (!refreshToken) {
      return page(
        'No refresh token',
        `<h1>Almost there</h1><p class="warn">Google did not return a refresh token${email ? ` for <b>${esc(email)}</b>` : ''}.</p><p>Remove the website's access at <a style="color:#e4cc91" href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>, then open the connect link again.</p>`,
        400,
      );
    }
    return page(
      'Google account connected',
      `<h1>Google account connected</h1>
<p>Signed in as <b>${esc(email || 'unknown')}</b>. Bookings will use this account's calendar${process.env.GOOGLE_CALENDAR_ID ? ` (<code>${esc(process.env.GOOGLE_CALENDAR_ID)}</code>)` : ' (primary calendar)'} and send notification emails from it.</p>
${missing.length ? `<p class="warn">Some permissions were not granted: ${missing.map((m) => `<code>${esc(m.replace('https://www.googleapis.com/auth/', ''))}</code>`).join(', ')}. Please connect again and tick every box.</p>` : ''}
<p>Copy this refresh token. It is shown only now:</p>
<textarea rows="4" readonly onclick="this.select()">${esc(refreshToken)}</textarea>
<ol>
<li>In Vercel → Project → Settings → Environment Variables, set <code>GOOGLE_REFRESH_TOKEN</code> to this value (Production and Preview).</li>
<li>Redeploy the site.</li>
<li>Check the connection at <code>/api/google/status?key=…</code>, then make a test booking from the chat.</li>
</ol>
<p class="muted">Keep this token private. It gives access to this account's calendar and lets the site send email from it. You can revoke it at any time at myaccount.google.com/permissions.</p>`,
    );
  } catch (e) {
    console.error('[google] connect failed:', e instanceof Error ? e.message : e);
    return page('Not connected', '<h1>Not connected</h1><p>Google did not accept the authorisation. Check the client ID, secret and redirect URI, then try again.</p>', 400);
  }
}
