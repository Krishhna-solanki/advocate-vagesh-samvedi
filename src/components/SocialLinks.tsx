import { socialProfiles } from '@/lib/site';
import PlatformIcon from './PlatformIcon';

type Props = {
  /** icon: square icon buttons; labelled: icon followed by the platform name */
  variant?: 'icon' | 'labelled';
  size?: 'sm' | 'md';
  className?: string;
};

// The advocate's social profiles (LinkedIn, Instagram), from site.profiles.
export default function SocialLinks({ variant = 'icon', size = 'md', className = '' }: Props) {
  if (socialProfiles.length === 0) return null;
  const box = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';
  const icon = size === 'sm' ? 'h-[1.05rem] w-[1.05rem]' : 'h-[1.15rem] w-[1.15rem]';

  return (
    <ul className={`flex flex-wrap items-center ${variant === 'icon' ? 'gap-2' : 'gap-x-6 gap-y-3'} ${className}`}>
      {socialProfiles.map((p) => (
        <li key={p.href}>
          {variant === 'icon' ? (
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${p.label} (opens in a new tab)`}
              title={p.label}
              className={`flex ${box} items-center justify-center border border-gold/30 text-gold transition-[color,border-color,background-color] hover:border-gold hover:bg-gold/10 hover:text-gold-light`}
            >
              <PlatformIcon platform={p.label} className={icon} />
            </a>
          ) : (
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-gold">
              <PlatformIcon platform={p.label} className="h-4 w-4" />
              {p.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
