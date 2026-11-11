'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { lockScroll } from '@/lib/smooth-scroll';
import { answer } from '@/lib/assistant/answer';
import type { Knowledge, Link } from '@/lib/assistant/types';
import { addDays, checkDate, dateProblem, normalisePhone, SCHEDULE, todayIst, validEmail } from '@/lib/appointments/schedule';
import { isLang, t, type Lang } from '@/lib/appointments/i18n';
import { getSiteLang } from '@/lib/site-language';

/**
 * Site-wide assistant: answers questions and books appointments.
 * - Questions are answered in the browser from the website's own content (src/lib/assistant/answer.ts) — free, no AI service.
 * - Booking: date → free times (live from Google Calendar) → name, address, email, phone, purpose → confirm.
 *   A booking is shown as confirmed only after the server reports that Google Calendar created the event.
 * Open it from anywhere with: window.dispatchEvent(new CustomEvent('vs:open-chat', { detail: { book: true } }))
 */

type Slot = { start: string; end: string; label: string };
type Confirmation = { reference: string; date: string; time: string; name: string };
type Msg =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'assistant'; text: string; links?: Link[]; suggestions?: string[] }
  | { id: number; role: 'urgent' }
  | { id: number; role: 'lang' }
  | { id: number; role: 'confirmation'; booking: Confirmation };
type Field = 'name' | 'address' | 'email' | 'phone' | 'purpose';
type Step = 'chat' | 'date' | 'loading-slots' | 'time' | Field | 'confirm' | 'saving';

const FIELDS: Field[] = ['name', 'address', 'email', 'phone', 'purpose'];
const LANG_KEY = 'vs-chat-lang';

/** Returns null when valid, otherwise the problem in the visitor's language */
function validate(field: Field, v: string, lang: Lang): string | null {
  const ok =
    field === 'name'
      ? v.length >= 2 && v.length <= 120 && /\p{L}/u.test(v)
      : field === 'address'
        ? v.length >= 10 && v.length <= 300
        : field === 'email'
          ? validEmail(v)
          : field === 'phone'
            ? Boolean(normalisePhone(v))
            : v.length >= 3 && v.length <= 500;
  return ok ? null : t(lang).invalid[field];
}

let uid = 0;
const nextId = () => ++uid;

const fmtDay = (date: string, lang: Lang) =>
  new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { timeZone: SCHEDULE.timezone, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${date}T12:00:00+05:30`),
  );

function Links({ links }: { links: Link[] }) {
  return (
    <ul className="mt-2.5 space-y-1.5 border-t border-gold/15 pt-2.5">
      {links.map((l) => {
        const external = l.external || /^https?:/.test(l.href);
        return (
          <li key={l.href + l.label}>
            <a
              href={l.href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-start gap-1.5 text-[13px] leading-5 text-gold-light transition-colors hover:text-ivory"
            >
              <span aria-hidden className="text-gold">
                {external ? '↗' : '→'}
              </span>
              <span className="underline decoration-gold/30 underline-offset-2">{l.label}</span>
              {external && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default function ChatWidget({ knowledge }: { knowledge: Knowledge }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<Step>('chat');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [details, setDetails] = useState<Record<Field, string>>({ name: '', address: '', email: '', phone: '', purpose: '' });
  const [inputError, setInputError] = useState('');
  const launcher = useRef<HTMLButtonElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const saving = useRef(false);
  /** Booking requested (e.g. from the contact page) before a language was chosen */
  const pendingBook = useRef(false);
  const m = t(lang);
  const L: Lang = lang ?? 'en';

  // The site language wins (Hindi site → Hindi chat, no question); otherwise the language chosen earlier in this session
  useEffect(() => {
    if (getSiteLang() === 'hi') {
      setLang('hi');
      return;
    }
    try {
      const saved = sessionStorage.getItem(LANG_KEY);
      if (isLang(saved)) setLang(saved);
    } catch {}
  }, []);

  const say = useCallback(
    (text: string, extra: { links?: Link[]; suggestions?: string[] } = {}) => setMessages((m) => [...m, { id: nextId(), role: 'assistant', text, ...extra }]),
    [],
  );
  const echo = useCallback((text: string) => setMessages((m) => [...m, { id: nextId(), role: 'user', text }]), []);
  const urgent = useCallback(() => setMessages((m) => (m.at(-1)?.role === 'urgent' ? m : [...m, { id: nextId(), role: 'urgent' }])), []);

  // First open: ask for the language (once per session), then greet in it
  useEffect(() => {
    if (!open || messages.length > 0) return;
    if (lang) say(t(lang).greeting);
    else setMessages([{ id: nextId(), role: 'lang' }]);
  }, [open, messages.length, lang, say]);

  // Keep the newest message in view
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' });
  }, [messages, step, busy]);

  // Focus the text box when it is the next thing to fill in
  useEffect(() => {
    if (open && (step === 'chat' || (FIELDS as string[]).includes(step))) field.current?.focus({ preventScroll: true });
  }, [open, step]);

  // Full-screen on phones: stop the page scrolling underneath
  useEffect(() => {
    const small = window.matchMedia('(max-width: 639px)').matches;
    if (open && small) {
      lockScroll('chat', true);
      return () => lockScroll('chat', false);
    }
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const startBooking = useCallback(
    (as: Lang) => {
      setSlot(null);
      setSlots([]);
      say(t(as).askDate);
      urgent();
      setStep('date');
    },
    [say, urgent],
  );

  const chooseLang = (choice: Lang) => {
    setLang(choice);
    try {
      sessionStorage.setItem(LANG_KEY, choice);
    } catch {}
    echo(choice === 'hi' ? 'हिंदी' : 'English');
    say(t(choice).greeting);
    if (pendingBook.current) {
      pendingBook.current = false;
      echo(t(choice).quick[0]);
      startBooking(choice);
    }
  };

  // Open requests from other parts of the site (e.g. the button under the contact form)
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      if (!(e as CustomEvent<{ book?: boolean }>).detail?.book || step !== 'chat') return;
      if (!lang) {
        pendingBook.current = true; // book right after the language is chosen
        return;
      }
      if (messages.length === 0) say(t(lang).greeting);
      echo(t(lang).quick[0]);
      startBooking(lang);
    };
    window.addEventListener('vs:open-chat', onOpen);
    return () => window.removeEventListener('vs:open-chat', onOpen);
  }, [echo, say, startBooking, step, lang, messages.length]);

  // Answers locally from the site's content; a short pause keeps the conversation feeling natural
  const ask = (text: string) => {
    echo(text);
    const reply = answer(text, knowledge, L);
    if (reply.action === 'book') {
      startBooking(L);
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      say(reply.text, { links: reply.links, suggestions: reply.suggestions });
      setBusy(false);
    }, 450);
  };

  // Live availability for a date, straight from Google Calendar
  const loadSlots = async (d: string, quiet = false) => {
    setStep('loading-slots');
    try {
      const res = await fetch(`/api/appointments/slots?date=${d}&lang=${L}`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        say(data.error || m.loadFailed);
        if (res.status !== 400) urgent();
        setStep('date');
        return;
      }
      const list = data.slots as Slot[];
      setSlots(list);
      if (!list.length) {
        say(m.fullyBusy);
        urgent();
        setStep('date');
        return;
      }
      if (!quiet) say(data.someBusy ? m.someBusy : m.allFree);
      setStep('time');
    } catch {
      say(m.connection);
      urgent();
      setStep('date');
    }
  };

  const chooseDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    echo(fmtDay(date, L));
    const check = checkDate(date);
    if (!check.ok) {
      say(dateProblem(check, L));
      return;
    }
    loadSlots(date);
  };

  const nextMissing = (d: Record<Field, string>) => FIELDS.find((f) => validate(f, d[f], L) !== null);

  const pickSlot = (s: Slot) => {
    setSlot(s);
    echo(s.label);
    const missing = nextMissing(details);
    if (missing) {
      say(m.prompts[missing]);
      setStep(missing);
    } else {
      setStep('confirm');
    }
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.replace(/\s+/g, ' ').trim();
    if (!text || busy) return;
    setInputError('');

    if (step === 'chat') {
      ask(text);
    } else if ((FIELDS as string[]).includes(step)) {
      const f = step as Field;
      const problem = validate(f, text, L);
      if (problem) return setInputError(problem);
      const updated = { ...details, [f]: text };
      setDetails(updated);
      echo(text);
      const missing = nextMissing(updated);
      if (missing) {
        if (f === 'name') say(m.thanksName(text.split(' ')[0]));
        say(m.prompts[missing]);
        setStep(missing);
      } else {
        setStep('confirm');
      }
    } else {
      return;
    }
    setInput('');
  };

  const confirm = async () => {
    if (!slot || saving.current) return; // one submission at a time
    saving.current = true;
    setStep('saving');
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: slot.start, ...details, lang: L, website: honeypot.current?.value || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && data.appointment?.reference) {
        setMessages((m) => [...m, { id: nextId(), role: 'confirmation', booking: data.appointment }]);
        setSlot(null);
        setDetails({ name: '', address: '', email: '', phone: '', purpose: '' });
        setStep('chat');
        return;
      }
      if (res.status === 409) {
        say(data.error || m.unavailableSlot);
        setSlot(null);
        await loadSlots(date, true);
        return;
      }
      if (res.status === 400 && FIELDS.includes(data.field)) {
        say(data.error);
        setStep(data.field as Field);
        return;
      }
      say(data.error || m.notBooked);
      urgent();
      setStep('confirm');
    } catch {
      say(m.confirmConnection);
      setStep('confirm');
    } finally {
      saving.current = false;
    }
  };

  const cancelBooking = () => {
    say(m.cancelled);
    setSlot(null);
    setStep('chat');
  };

  const chip =
    'rounded-full border border-gold/40 px-3.5 py-1.5 text-xs text-ivory/90 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold-light disabled:opacity-40';
  const isField = (FIELDS as string[]).includes(step);
  const textEnabled = Boolean(lang) && (step === 'chat' || isField);
  const placeholder = isField ? m.placeholders[step as Field] : m.askPlaceholder;
  const today = todayIst();

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcher}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="vs-chat"
        translate="no"
        className={`notranslate group fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 rounded-full border border-gold/60 bg-ink/90 py-2 pl-2 pr-2 text-gold-light shadow-[0_18px_40px_-14px_rgba(200,164,93,0.55)] backdrop-blur transition-[transform,border-color,opacity] duration-500 hover:border-gold motion-safe:hover:-translate-y-0.5 sm:pr-5 md:bottom-8 md:right-8 ${open ? 'max-sm:pointer-events-none max-sm:opacity-0' : ''}`}
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dim text-ink">
          {open ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 5.5h16v10H9.5L5 19.5v-4H4z" />
              <path d="M8.5 9.5h7M8.5 12.5h4.5" />
            </svg>
          )}
        </span>
        <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:inline">{open ? (lang === 'hi' ? 'बंद करें' : 'Close') : lang === 'hi' ? 'पूछें · बुक करें' : 'Ask · Book'}</span>
        <span className="sr-only">{open ? 'Close the assistant' : 'Open the assistant to ask a question or book an appointment'}</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          id="vs-chat"
          translate="no"
          role="dialog"
          aria-label="Assistant and appointment booking"
          className="notranslate vs-chat-panel fixed inset-0 z-[80] flex flex-col bg-ink sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(640px,calc(100dvh-8rem))] sm:w-[400px] sm:border sm:border-gold/40 sm:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(200,164,93,0.08)] md:bottom-28 md:right-8"
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 border-b border-gold/25 bg-gradient-to-b from-charcoal to-ink px-5 py-4">
            <span aria-hidden className="flex h-10 w-10 items-center justify-center border border-gold/60 font-serif text-lg text-gold">
              VS
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg leading-tight text-ivory">Ask or Book an Appointment</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted">Virtual assistant · English &amp; हिंदी</p>
            </div>
            <button type="button" onClick={close} className="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-gold-light" aria-label="Close the assistant">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          </div>

          {/* Conversation */}
          <div ref={scroller} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
            {messages.map((m) => {
              if (m.role === 'confirmation') {
                return (
                  <div key={m.id} className="border border-gold/60 bg-gold/[0.07] p-4 shadow-[0_0_30px_-12px_rgba(200,164,93,0.5)]">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M8 12.5l2.7 2.7L16 9.8" />
                      </svg>
                      {t(L).bookedTitle}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ivory">{t(L).bookedLine}</p>
                    <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-sm">
                      <dt className="text-muted">{t(L).date}</dt>
                      <dd className="text-ivory">{m.booking.date}</dd>
                      <dt className="text-muted">{t(L).time}</dt>
                      <dd className="text-gold-light">{m.booking.time} (IST)</dd>
                      <dt className="text-muted">{t(L).reference}</dt>
                      <dd className="font-semibold tracking-wider text-ivory">{m.booking.reference}</dd>
                    </dl>
                    <p className="mt-3 text-sm text-ivory/90">{t(L).bookedThanks}</p>
                  </div>
                );
              }
              if (m.role === 'lang') {
                return (
                  <div key={m.id} className="border-l-2 border-gold/60 bg-charcoal px-3.5 py-3 text-sm leading-6 text-ivory/90">
                    <p>Which language are you comfortable with?</p>
                    {!lang && (
                      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Choose a language">
                        <button type="button" onClick={() => chooseLang('en')} className="btn-outline px-4 py-2 text-[11px]">
                          English
                        </button>
                        <button type="button" onClick={() => chooseLang('hi')} className="btn-outline px-4 py-2 text-[11px]">
                          हिंदी (Hindi)
                        </button>
                      </div>
                    )}
                  </div>
                );
              }
              if (m.role === 'urgent') {
                return (
                  <div key={m.id} className="border border-dashed border-gold/35 px-3.5 py-3 text-[13px] leading-5 text-ivory/85">
                    <p>{t(L).urgent}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <a href="/contact" className="btn-outline px-3 py-1.5 text-[10px]">
                        {t(L).contactOffice}
                      </a>
                      {knowledge.phone && knowledge.phoneHref && (
                        <a href={knowledge.phoneHref} className="text-gold-light underline decoration-gold/30 underline-offset-2 hover:text-ivory">
                          {knowledge.phone}
                        </a>
                      )}
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line px-3.5 py-2.5 text-sm leading-6 ${
                      m.role === 'user' ? 'bg-gold/15 text-ivory' : 'border-l-2 border-gold/60 bg-charcoal text-ivory/90'
                    }`}
                  >
                    {m.text}
                    {m.role === 'assistant' && m.links?.length ? <Links links={m.links} /> : null}
                  </div>
                </div>
              );
            })}

            {/* Follow-up questions offered by the latest answer */}
            {(() => {
              const last = messages.at(-1);
              return step === 'chat' && !busy && messages.length > 1 && last?.role === 'assistant' && last.suggestions?.length ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {last.suggestions.map((q) => (
                    <button key={q} type="button" className={chip} onClick={() => ask(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              ) : null;
            })()}

            {(busy || step === 'loading-slots' || step === 'saving') && (
              <div className="flex items-center gap-2 px-1 text-xs text-muted" role="status">
                <span className="vs-typing" aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                {step === 'loading-slots' ? m.checkingCalendar : step === 'saving' ? m.booking : m.typing}
              </div>
            )}

            {/* Quick questions */}
            {lang && step === 'chat' && !busy && messages.at(-1)?.role === 'assistant' && messages.filter((x) => x.role === 'user').length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {m.quick.map((q) => (
                  <button key={q} type="button" className={chip} onClick={() => ask(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Date picker */}
            {step === 'date' && (
              <form onSubmit={chooseDate} className="border border-gold/35 bg-charcoal p-3.5">
                <label htmlFor="vs-chat-date" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                  {m.dateLabel}
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    id="vs-chat-date"
                    type="date"
                    min={today}
                    max={addDays(today, SCHEDULE.bookingWindowDays)}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="min-w-0 flex-1 border border-line bg-ink px-3 py-2 text-sm text-ivory [color-scheme:dark] focus:border-gold/70 focus:outline-none"
                  />
                  <button type="submit" disabled={!date} className="btn-gold px-4 py-2 text-[11px] disabled:opacity-50">
                    {m.check}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-muted">{m.dateHint}</p>
              </form>
            )}

            {/* Time choice */}
            {step === 'time' && (
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button key={s.start} type="button" className={chip} onClick={() => pickSlot(s)}>
                      {s.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setStep('date')} className="text-xs text-muted underline-offset-2 hover:text-gold-light hover:underline">
                  {m.otherDate}
                </button>
              </div>
            )}

            {/* Review */}
            {(step === 'confirm' || step === 'saving') && slot && (
              <div className="border border-gold/40 bg-charcoal p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{m.confirmTitle}</p>
                <p className="mt-2 font-serif text-lg text-ivory">{fmtDay(date, L)}</p>
                <p className="text-gold-light">{slot.label}</p>
                <dl className="mt-2 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-xs">
                  {FIELDS.map((f) => (
                    <div key={f} className="contents">
                      <dt className="text-muted">{m.labels[f]}</dt>
                      <dd className="line-clamp-2 break-words text-ivory">{details[f]}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={confirm} disabled={step === 'saving'} className="btn-gold px-4 py-2.5 text-[11px] disabled:opacity-60">
                    {step === 'saving' ? m.savingBtn : m.confirmBtn}
                  </button>
                  <button type="button" onClick={() => setStep('date')} disabled={step === 'saving'} className="text-xs text-muted hover:text-gold-light">
                    {m.changeTime}
                  </button>
                  <button type="button" onClick={cancelBooking} disabled={step === 'saving'} className="text-xs text-muted hover:text-gold-light">
                    {m.cancel}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={submit} className="border-t border-gold/20 bg-charcoal/60 p-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            {inputError && (
              <p className="mb-2 px-1 text-xs text-[#e8a39a]" role="alert">
                {inputError}
              </p>
            )}
            <div className="flex items-end gap-2">
              <label htmlFor="vs-chat-input" className="sr-only">
                {placeholder}
              </label>
              <textarea
                id="vs-chat-input"
                ref={field}
                rows={1}
                value={input}
                disabled={!textEnabled || busy}
                onChange={(e) => {
                  setInput(e.target.value);
                  setInputError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder={textEnabled ? placeholder : m.choosePlaceholder}
                inputMode={step === 'phone' ? 'tel' : step === 'email' ? 'email' : undefined}
                autoComplete={step === 'name' ? 'name' : step === 'phone' ? 'tel' : step === 'email' ? 'email' : step === 'address' ? 'street-address' : 'off'}
                maxLength={step === 'purpose' ? 500 : step === 'address' ? 300 : 2000}
                className="max-h-28 min-h-[44px] flex-1 resize-none border border-line bg-ink px-3 py-2.5 text-sm text-ivory placeholder:text-muted/70 focus:border-gold/70 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!textEnabled || busy || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-gold text-ink transition-colors hover:bg-gold-light disabled:opacity-40"
                aria-label={m.send}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            {lang && step === 'chat' && messages.length > 3 && (
              <button type="button" onClick={() => ask(m.quick[0])} disabled={busy} className="mt-2 px-1 text-[11px] uppercase tracking-[0.16em] text-gold hover:text-gold-light disabled:opacity-40">
                {m.bookLink}
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}
