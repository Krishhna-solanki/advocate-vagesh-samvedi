'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { normalisePhone } from '@/lib/appointments/schedule';

export const LEGAL_AREAS = [
  'Civil Litigation',
  'Property & Revenue Law',
  'Criminal Law',
  'Family & Matrimonial Law',
  'Cyber Law',
  'Intellectual Property Rights',
  'Business & Commercial Law',
  'Alternative Dispute Resolution',
  'Other',
] as const;

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'error'; message: string };
type Errors = Partial<Record<'name' | 'email' | 'phone' | 'area' | 'message' | 'consent', string>>;

function validate(f: FormData): Errors {
  const errors: Errors = {};
  const name = String(f.get('name') ?? '').trim();
  const email = String(f.get('email') ?? '').trim();
  const message = String(f.get('message') ?? '').trim();
  if (name.length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Please enter a valid email address.';
  if (!normalisePhone(String(f.get('phone') ?? ''))) errors.phone = 'Please enter a valid contact number (10-digit mobile, or with country code).';
  if (!f.get('area')) errors.area = 'Please choose the area of your legal concern.';
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
          phone: data.get('phone'),
          area: data.get('area'),
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
      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        <p className="label">Enquiry received</p>
        <p className="mt-4 font-serif text-3xl">Thank you for submitting your enquiry.</p>
        <p className="mt-4 text-sm leading-7 text-muted">
          Your message has been received and will be reviewed through the available contact channel.
        </p>
        <button type="button" onClick={() => setStatus({ kind: 'idle' })} className="link-gold mt-6">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby="form-note">
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="field-group">
          <label htmlFor="name" className="label">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            className="field-boxed"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {fieldError('name')}
        </div>
        <div className="field-group">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field-boxed"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {fieldError('email')}
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="field-group">
          <label htmlFor="phone" className="label">
            Contact Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className="field-boxed"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {fieldError('phone')}
        </div>
        <div className="field-group">
          <label htmlFor="area" className="label">
            Area of Legal Concern
          </label>
          <select
            id="area"
            name="area"
            required
            defaultValue=""
            className="field-boxed field-select"
            aria-invalid={!!errors.area}
            aria-describedby={errors.area ? 'area-error' : undefined}
          >
            <option value="" disabled>
              Select an area
            </option>
            {LEGAL_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {fieldError('area')}
        </div>
      </div>
      <div className="field-group">
        <label htmlFor="message" className="label">
          Brief Description of the Matter
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={3000}
          className="field-boxed resize-y"
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
            className="consent-box mt-1 h-4 w-4 shrink-0"
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
        Please avoid submitting highly sensitive personal information or confidential legal documents through this general enquiry form.
        Submission of an enquiry does not automatically establish an advocate-client relationship.
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
          <>
            Submit Enquiry
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
