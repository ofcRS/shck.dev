import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { SITE } from '../../site.config';

const posts = await getCollection('posts');

const pages = {
  site: { title: SITE.title, description: SITE.description },
  ...Object.fromEntries(posts.map((p) => [p.id, p.data])),
};

const route = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path: string, page: any) => ({
    title: page.title,
    description: page.description ?? '',
    bgGradient: [[252, 252, 252]],
    border: { color: [79, 70, 229], width: 12, side: 'inline-start' },
    font: {
      title: { color: [10, 10, 10], families: ['JetBrains Mono'], weight: 'Medium' },
      description: { color: [107, 107, 107], families: ['JetBrains Mono'] },
    },
    fonts: [
      'https://api.fontsource.org/v1/fonts/jetbrains-mono/latin-500-normal.ttf',
      'https://api.fontsource.org/v1/fonts/jetbrains-mono/latin-400-normal.ttf',
    ],
  }),
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
