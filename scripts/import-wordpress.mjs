#!/usr/bin/env node
// Imports full article text from the previous WordPress site into content/insights.
//
// Usage:
//   npm run import:wp -- path/to/export.xml      (WordPress → Tools → Export → Posts)
//   npm run import:wp -- path/to/posts.json      (saved from /wp-json/wp/v2/posts?per_page=100&_embed)
//
// Existing files keep their category, cover, featured flag and SEO fields; the body,
// title, date, author and excerpt are replaced with the original and the article is
// marked as a full migration. Test/placeholder posts are skipped.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import TurndownService from 'turndown';
import { XMLParser } from 'fast-xml-parser';

const input = process.argv[2];
if (!input) {
  console.error('Usage: npm run import:wp -- <export.xml | posts.json>');
  process.exit(1);
}

const OUT = path.join(process.cwd(), 'content', 'insights');
const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
turndown.remove(['script', 'style', 'iframe']);

const decode = (s = '') =>
  String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
const stripTags = (html = '') => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const arr = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

function fromWxr(xml) {
  const doc = new XMLParser({ ignoreAttributes: false, cdataPropName: false, parseTagValue: false }).parse(xml);
  const items = arr(doc?.rss?.channel?.item);
  const meta = (it, key) => arr(it['wp:postmeta']).find((m) => m['wp:meta_key'] === key)?.['wp:meta_value'];
  const attachments = new Map(
    items.filter((it) => it['wp:post_type'] === 'attachment').map((it) => [String(it['wp:post_id']), it['wp:attachment_url']]),
  );
  return items
    .filter((it) => it['wp:post_type'] === 'post' && it['wp:status'] === 'publish')
    .map((it) => ({
      slug: it['wp:post_name'],
      title: decode(it.title),
      date: String(it['wp:post_date']).replace(' ', 'T'),
      author: it['dc:creator'],
      html: it['content:encoded'] ?? '',
      excerpt: stripTags(it['excerpt:encoded'] ?? ''),
      tags: arr(it.category).filter((c) => c?.['@_domain'] === 'post_tag').map((c) => decode(c['#text'])),
      image: attachments.get(String(meta(it, '_thumbnail_id'))),
    }));
}

function fromRest(json) {
  return arr(json)
    .filter((p) => p.status === undefined || p.status === 'publish')
    .map((p) => ({
      slug: p.slug,
      title: decode(p.title?.rendered),
      date: p.date,
      author: p._embedded?.author?.[0]?.name,
      html: p.content?.rendered ?? '',
      excerpt: stripTags(p.excerpt?.rendered ?? ''),
      tags: arr(p._embedded?.['wp:term']).flat().filter((t) => t.taxonomy === 'post_tag').map((t) => decode(t.name)),
      image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    }));
}

const raw = fs.readFileSync(input, 'utf8');
const posts = input.endsWith('.json') ? fromRest(JSON.parse(raw)) : fromWxr(raw);
fs.mkdirSync(OUT, { recursive: true });

let written = 0;
for (const post of posts) {
  if (/^test post/i.test(post.title)) {
    console.log(`skip  ${post.slug} (test post)`);
    continue;
  }
  const file = path.join(OUT, `${post.slug}.md`);
  const existing = fs.existsSync(file) ? matter(fs.readFileSync(file, 'utf8')).data : {};
  const body = turndown.turndown(post.html).replace(/\n{3,}/g, '\n\n').trim();

  const data = {
    ...existing,
    title: post.title,
    date: post.date,
    // WordPress exports the login name as the author, so prefer the verified name already on file
    author: existing.author || post.author || '',
    excerpt: existing.excerpt || post.excerpt.slice(0, 300),
    tags: existing.tags?.length ? existing.tags : post.tags,
    category: existing.category || 'legal-commentary',
    cover: existing.cover || post.image || '',
    coverAlt: existing.coverAlt || '',
    featured: existing.featured ?? false,
    draft: existing.draft ?? false,
    migrationStatus: 'full',
  };
  fs.writeFileSync(file, matter.stringify(`\n${body}\n`, data));
  console.log(`write ${post.slug}`);
  written++;
}
console.log(`\n${written} article(s) imported into content/insights. Review each before publishing.`);
