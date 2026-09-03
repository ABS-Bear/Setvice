import { defineCollection, z } from 'astro:content';

const settings = defineCollection({
  type: 'data',
  schema: z.any()
});

const services = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    label: z.string(),
    summary: z.string(),
    image: z.string(),
    alt: z.string(),
    cta: z.string(),
    order: z.number()
  })
});

const team = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    image: z.string(),
    points: z.array(z.object({
      title: z.string(),
      text: z.string()
    }))
  })
});

const businessDirections = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    navLabel: z.string(),
    href: z.string(),
    status: z.enum(['active', 'prepared', 'planned']),
    leadKind: z.string(),
    summary: z.string(),
    order: z.number()
  })
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['draft', 'published']),
    publishDate: z.date().optional(),
    author: z.string()
  })
});

export const collections = {
  settings,
  services,
  team,
  'business-directions': businessDirections,
  articles
};
