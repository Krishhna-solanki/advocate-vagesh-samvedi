'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'error'; message: string };
type Errors = Partial<Record<'name' | 'email' | 'message' | 'consent', string>>;

function validate(f: FormData): Errors {
  const errors: Errors = {};
  const name = String(f.get('name') ?? '').trim();
  const email = String(f.get('email') ?? '').trim();
  const message = String(f.get('message') ?? '').trim();
  if (name.length < 2) errors.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (message.length < 20) errors.message = 'Please write at least 20 characters.';
  if (message.length > 3000) errors.message = 'Please keep your message under 3,000 characters.';
  if (!f.get('consent')) errors.consent = 'Please confirm you have read the disclaimer.';
  return errors;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [errors, setErrors] = useState<Errors>({});
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
          website: data.get('website'), // honeypot
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Your message could not be sent.');
      setStatus({ kind: 'success' });
      form.reset();
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Your message could not be sent.' });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  const fieldError = (k: keyof Errors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-2 text-xs text-[#E8A598]">
        {errors[k]}
      </p>
    ) : null;

  if (status.kind === 'success') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-gold/40 bg-charcoal p-8 outline-none md:p-10">
        <p className="label">Message received</p>
        <p className="mt-4 font-serif text-3xl">Thank you for writing.</p>
        <p className="mt-4 text-sm leading-7 text-muted">
          Your message has been delivered. Please do not send confidential or time-sensitive information through this form.
        </p>
        <button type="button" onClick={() => setStatus({ kind: 'idle' })} className="link-gold mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby="form-note">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            className="field"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="email" className="label text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {fieldError('email')}
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={3000}
          className="field resize-y"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {fieldError('message')}
      </div>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm leading-6 text-muted">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 accent-[#C8A45D]"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I understand that contacting the advocate through this form does not create an advocate–client relationship, and I have
            read the{' '}
            <Link href="/disclaimer" className="text-gold underline underline-offset-4 hover:text-gold-light">
              disclaimer
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-gold underline underline-offset-4 hover:text-gold-light">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {fieldError('consent')}
      </div>

      <p id="form-note" className="text-xs leading-6 text-muted/80">
        Please do not share confidential or privileged details in this form.
      </p>

      {status.kind === 'error' && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border border-[#E8A598]/40 p-4 text-sm text-[#E8A598] outline-none">
          {status.message}
        </div>
      )}

      <button type="submit" data-magnetic className="btn-gold min-w-[12rem] disabled:opacity-60" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-ink border-t-transparent" aria-hidden />
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
