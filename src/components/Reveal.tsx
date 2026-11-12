// Marks an element for a GSAP scroll animation (see ScrollAnimations.tsx). Works in server components.
type Props = {
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'ul' | 'ol' | 'figure';
  className?: string;
  /** milliseconds */
  delay?: number;
  variant?: 'fade-up' | 'stagger' | 'image' | 'line-x' | 'line-y';
  id?: string;
  /** On phones/tablets, use a short, undelayed reveal so the content (e.g. a key image) appears quickly */
  mobileFast?: boolean;
  children?: React.ReactNode;
};

export default function Reveal({ as: Tag = 'div', className, delay, variant = 'fade-up', id, mobileFast, children }: Props) {
  return (
    <Tag id={id} className={className} data-anim={variant} data-delay={delay || undefined} data-mobile-fast={mobileFast || undefined}>
      {children}
    </Tag>
  );
}
