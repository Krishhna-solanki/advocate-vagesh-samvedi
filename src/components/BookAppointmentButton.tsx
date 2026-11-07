'use client';

// Opens the site assistant straight into the appointment booking flow.
export default function BookAppointmentButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('vs:open-chat', { detail: { book: true } }))}
      className={`btn-outline ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3.5" y="5" width="17" height="15" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4M8.5 14l2.2 2.2L15.5 12" />
      </svg>
      Book an Appointment
    </button>
  );
}
