import { settings } from '@/lib/content';
import { canonicalUrl, withBase } from '@/lib/paths';

export async function GET() {
  const contacts = await settings<any>('contacts');
  const sitemap = canonicalUrl(contacts.siteUrl, '/sitemap.xml');
  const adminPath = withBase('/admin');
  const adminPathTrailing = withBase('/admin/');

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      `Disallow: ${adminPath}`,
      `Disallow: ${adminPathTrailing}`,
      '',
      `Sitemap: ${sitemap}`,
      ''
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    }
  );
}
