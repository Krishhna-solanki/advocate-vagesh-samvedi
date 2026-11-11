import type { PracticeArea } from '@/lib/practice-areas';

const paths: Record<PracticeArea['icon'], React.ReactNode> = {
  scales: (
    <>
      <path d="M24 6v34M14 40h20M10 12h28" />
      <path d="M10 12 4 26h12L10 12ZM38 12l-6 14h12l-6-14Z" />
      <path d="M4 26a6 4 0 0 0 12 0M32 26a6 4 0 0 0 12 0" />
    </>
  ),
  gavel: (
    <>
      <path d="m20 8 12 12M14 14l12 12M17 11l12 12" />
      <path d="M23 20 9 34a2.8 2.8 0 0 0 4 4l14-14" />
      <path d="M26 42h16" />
    </>
  ),
  briefcase: (
    <>
      <rect x="6" y="14" width="36" height="26" />
      <path d="M18 14V9h12v5M6 24h36M22 24v4h4v-4" />
    </>
  ),
  seal: (
    <>
      <circle cx="24" cy="20" r="12" />
      <circle cx="24" cy="20" r="7.5" />
      <path d="M18 31l-3 11 9-4 9 4-3-11" />
    </>
  ),
  shield: (
    <>
      <path d="M24 5 8 11v12c0 10 7 17 16 20 9-3 16-10 16-20V11L24 5Z" />
      <path d="M18 22h12v10H18zM20.5 22v-3a3.5 3.5 0 0 1 7 0v3" />
    </>
  ),
  // Property & revenue: a pillared building on a land plot
  landmark: (
    <>
      <path d="M6 18 24 7l18 11H6Z" />
      <path d="M11 22v12M19 22v12M29 22v12M37 22v12" />
      <path d="M7 38h34M4 42h40" />
    </>
  ),
  // Family: two figures under one roof
  family: (
    <>
      <path d="M6 22 24 8l18 14" />
      <circle cx="18" cy="24" r="3.5" />
      <circle cx="30" cy="24" r="3.5" />
      <path d="M11 40v-4a7 7 0 0 1 14 0v4M23 40v-4a7 7 0 0 1 14 0v4" />
    </>
  ),
  // Dispute resolution: clasped hands
  handshake: (
    <>
      <path d="M4 20l8-6 8 3 6-3 8 1 10 7" />
      <path d="M4 20v10l7 4M44 22v8l-7 4" />
      <path d="M20 17l-6 7a2.5 2.5 0 0 0 3.6 3.4L23 23l9 8a2.4 2.4 0 0 1-3.4 3.4M26 34l-3.5-3.5M22 37l-3.5-3.5M29 31l-5-4.5" />
    </>
  ),
  compass: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="m31 17-4.5 9.5L17 31l4.5-9.5L31 17Z" />
      <path d="M24 6v4M24 38v4M6 24h4M38 24h4" />
    </>
  ),
};

export default function PracticeIcon({ name, className = 'h-10 w-10' }: { name: PracticeArea['icon']; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
