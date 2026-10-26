import data from '../../content/publications.json';

// External publications (journals, edited volumes, op-eds). Managed in the CMS under
// Settings → Publications. Only verified entries with genuine links should be added.
export type Publication = {
  title: string;
  description?: string;
  date: string;
  author: string;
  publisher?: string;
  url: string;
};

export const publications: Publication[] = (data.publications as Publication[])
  .slice()
  .sort((a, b) => +new Date(b.date) - +new Date(a.date));
