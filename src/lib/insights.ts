import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { getCategory } from './categories';

const DIR = path.join(process.cwd(), 'content', 'insights');
const SHOW_DRAFTS = process.env.NODE_ENV === 'development';

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  categoryName: string;
  tags: string[];
  author?: string;
  excerpt: string;
  cover?: string;
  coverAlt: string;
  featured: boolean;
  draft: boolean;
  seoTitle?: string;
  seoDescription?: string;
  source?: string;
  migrationStatus: 'full' | 'summary';
  readingMinutes: number;
};

export type Article = ArticleMeta & { body: string };
export type Heading = { id: string; text: string; depth: 2 | 3 };

// WordPress exports local time without an offset; treat it as IST.
const toIso = (v: unknown): string => {
  if (v instanceof Date) return v.toISOString();
  const s = String(v ?? '');
  return /T\d\d:\d\d(:\d\d)?$/.test(s) ? `${s}+05:30` : s;
};

function parseFile(file: string): Article {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, '');
  const words = content.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: String(data.title),
    date: toIso(data.date),
    updated: data.updated ? toIso(data.updated) : undefined,
    category: data.category ?? 'legal-commentary',
    categoryName: getCategory(data.category ?? 'legal-commentary').name,
    tags: data.tags ?? [],
    author: data.author || undefined,
    excerpt: data.excerpt ?? '',
    cover: data.cover || undefined,
    coverAlt: data.coverAlt ?? '',
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    seoTitle: data.seoTitle || undefined,
    seoDescription: data.seoDescription || undefined,
    source: data.source || undefined,
    migrationStatus: data.migrationStatus === 'summary' ? 'summary' : 'full',
    readingMinutes: Math.max(1, Math.round(words / 220)),
    body: content,
  };
}

let cache: Article[] | null = null;

export function getAllArticles(): Article[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith('.md')) : [];
  cache = files
    .map(parseFile)
    .filter((a) => SHOW_DRAFTS || !a.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return cache;
}

export const getArticleMetas = (): ArticleMeta[] => getAllArticles().map(({ body: _body, ...meta }) => meta);

export const getArticle = (slug: string) => getAllArticles().find((a) => a.slug === slug);

export function getFeatured(): ArticleMeta | undefined {
  const all = getArticleMetas();
  return all.find((a) => a.featured) ?? all[0];
}

export function getAdjacent(slug: string) {
  const all = getArticleMetas();
  const i = all.findIndex((a) => a.slug === slug);
  // List is newest-first: "previous" is the older article, "next" the newer one.
  return { previous: all[i + 1], next: i > 0 ? all[i - 1] : undefined };
}

export function getRelated(article: ArticleMeta, limit = 3): ArticleMeta[] {
  const others = getArticleMetas().filter((a) => a.slug !== article.slug);
  const score = (a: ArticleMeta) =>
    (a.category === article.category ? 10 : 0) + a.tags.filter((t) => article.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a) || +new Date(b.date) - +new Date(a.date)).slice(0, limit);
}

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[]; value?: string };

const textOf = (n: HastNode): string => (n.type === 'text' ? n.value ?? '' : (n.children ?? []).map(textOf).join(''));

// Collects h2/h3 ids (added by rehype-slug) for the table of contents.
const collectHeadings = (out: Heading[]) => () => (tree: HastNode) => {
  const walk = (n: HastNode) => {
    if (n.type === 'element' && (n.tagName === 'h2' || n.tagName === 'h3')) {
      out.push({ id: String(n.properties?.id ?? ''), text: textOf(n), depth: n.tagName === 'h2' ? 2 : 3 });
    }
    n.children?.forEach(walk);
  };
  walk(tree);
};

export async function renderMarkdown(md: string) {
  const headings: Heading[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(collectHeadings(headings))
    .use(rehypeStringify)
    .process(md);
  return { html: String(file), headings };
}
