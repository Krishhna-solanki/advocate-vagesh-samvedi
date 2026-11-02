import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Drafts (including the labelled sample entries) are visible in `npm run dev` only.
export const SHOW_DRAFTS = process.env.NODE_ENV === 'development';

// WordPress and the CMS write local time without an offset; treat it as IST.
export const toIso = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString();
  const s = String(v ?? '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00:00+05:30`;
  return /T\d\d:\d\d(:\d\d)?$/.test(s) ? `${s}+05:30` : s;
};

/** Reads every Markdown file in content/<folder> as { slug, data, body }. */
export function readCollection(folder: string) {
  const dir = path.join(process.cwd(), 'content', folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      return { slug: file.replace(/\.md$/, ''), data, body: content };
    });
}

export const byDateDesc = <T extends { date: string }>(a: T, b: T) => +new Date(b.date) - +new Date(a.date);
