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
