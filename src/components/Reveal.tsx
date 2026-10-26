// Marks an element for a GSAP scroll animation (see ScrollAnimations.tsx). Works in server components.
type Props = {
  as?: 'div' | 'section' | 'li' | 'article' | 'span' | 'ul' | 'ol' | 'figure';
  className?: string;
  /** milliseconds */
  delay?: number;
  variant?: 'fade-up' | 'stagger' | 'image' | 'line-x' | 'line-y';
  id?: string;
  children?: React.ReactNode;
};

export default function Reveal({ as: Tag = 'div', className, delay, variant = 'fade-up', id, children }: Props) {
  return (
    <Tag id={id} className={className} data-anim={variant} data-delay={delay || undefined}>
      {children}
    </Tag>
  );
}
