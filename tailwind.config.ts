import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // No sticky hover states after taps on touch screens
  future: { hoverOnlyWhenSupported: true },
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', md: '2rem', lg: '3rem' }, screens: { '2xl': '1320px' } },
    extend: {
      colors: {
        ink: '#0B0B0B',
        charcoal: '#151515',
        line: '#262421',
        gold: { DEFAULT: '#C8A45D', light: '#E4CC91', dim: '#8C7442' },
        ivory: '#F5F1E8',
        muted: '#AAA6A0',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      letterSpacing: { label: '0.22em' },
      // Smooth default for every hover/transition utility
      transitionDuration: { DEFAULT: '450ms' },
      transitionTimingFunction: { DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)', lux: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      maxWidth: { prose: '68ch' },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        legal: {
          css: {
            '--tw-prose-body': theme('colors.ivory / 0.86'),
            '--tw-prose-headings': theme('colors.ivory'),
            '--tw-prose-lead': theme('colors.muted'),
            '--tw-prose-links': theme('colors.gold.light'),
            '--tw-prose-bold': theme('colors.ivory'),
            '--tw-prose-counters': theme('colors.gold.DEFAULT'),
            '--tw-prose-bullets': theme('colors.gold.DEFAULT'),
            '--tw-prose-hr': theme('colors.line'),
            '--tw-prose-quotes': theme('colors.ivory'),
            '--tw-prose-quote-borders': theme('colors.gold.DEFAULT'),
            '--tw-prose-captions': theme('colors.muted'),
            '--tw-prose-code': theme('colors.gold.light'),
            '--tw-prose-th-borders': theme('colors.line'),
            '--tw-prose-td-borders': theme('colors.line'),
            fontSize: '1.0625rem',
            lineHeight: '1.85',
            'h2, h3, h4': { fontFamily: theme('fontFamily.serif'), fontWeight: '500', scrollMarginTop: '7rem' },
            h2: { fontSize: '2rem', lineHeight: '1.2', marginTop: '2.5em' },
            h3: { fontSize: '1.5rem' },
            a: { textUnderlineOffset: '4px', textDecorationThickness: '1px' },
            blockquote: { fontFamily: theme('fontFamily.serif'), fontStyle: 'italic', fontSize: '1.35rem', fontWeight: '400' },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
