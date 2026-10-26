import data from '../../content/categories.json';

export type Category = { slug: string; name: string; description?: string };

export const categories: Category[] = data.categories;

export const getCategory = (slug: string): Category =>
  categories.find((c) => c.slug === slug) ?? { slug, name: slug.replace(/-/g, ' ') };
