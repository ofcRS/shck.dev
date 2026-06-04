import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { feedLoader } from '@ascorbic/feed-loader';
import { TOOLS } from './site.config';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    tool: z.string().optional(), // ties a post to a TOOLS entry
    draft: z.boolean().default(false),
  }),
});

// One release collection per tool — /changelog renders them all.
const releaseCollections = Object.fromEntries(
  TOOLS.map((t) => [
    `releases_${t.name}`,
    defineCollection({
      loader: feedLoader({ url: `https://github.com/${t.repo}/releases.atom` }),
    }),
  ]),
);

export const collections = { posts, ...releaseCollections };
