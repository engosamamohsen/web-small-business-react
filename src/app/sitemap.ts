import { MetadataRoute } from 'next';
import { fetchSettings } from '@/hooks/fetchSettings';

// Dynamic sitemap generation using Next.js 15 features
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: settings } = await fetchSettings();
  const baseUrl = settings?.website_url || 'https://example.com';

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ] as MetadataRoute.Sitemap;

  // You can also fetch dynamic routes like products, categories, etc. 
  // and add them to the sitemap

  return routes;
}
