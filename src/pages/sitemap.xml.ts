import { getCollection } from 'astro:content';
import { settings } from '@/lib/content';
import { canonicalUrl } from '@/lib/paths';

export async function GET() {
  const contacts = await settings<any>('contacts');
  const seo = await settings<any>('seo');
  const articles = await getCollection('articles', ({ data }) => data.status === 'published');
  const pageUrls = Object.entries(seo.pages)
    .filter(([key]) => key !== 'articles' || articles.length > 0)
    .map(([, page]) => (page as any).canonical);
  const articleUrls = articles.map((article) => `/articles/${article.slug}/`);
  const urls = [...new Set([...pageUrls, ...articleUrls])];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((path) => `  <url><loc>${canonicalUrl(contacts.siteUrl, path)}</loc></url>`),
    '</urlset>'
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
