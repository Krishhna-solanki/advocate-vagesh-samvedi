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

/** Width and height of a PNG, JPEG or WebP in /public, read from the file header (no dependency). */
export function imageSize(publicPath: string): { width: number; height: number } | undefined {
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), 'public', publicPath));
    // PNG: IHDR width/height at bytes 16–23
    if (buf.readUInt32BE(0) === 0x89504e47) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    // JPEG: find a start-of-frame marker
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) return undefined;
        const marker = buf[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
          return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
        i += 2 + buf.readUInt16BE(i + 2);
      }
    }
    // WebP (extended VP8X, lossy VP8, lossless VP8L)
    if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const chunk = buf.toString('ascii', 12, 16);
      if (chunk === 'VP8X') return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
      if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
      if (chunk === 'VP8L') {
        const b = buf.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
    }
  } catch {}
  return undefined;
}
