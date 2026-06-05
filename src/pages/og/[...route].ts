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
    bgGradient: [[251, 251, 249]],
    border: { color: [200, 255, 0], width: 18, side: 'inline-start' },
    padding: 60,
    font: {
      title: { color: [24, 24, 27], families: ['Geist'], weight: 'Bold' },
      description: { color: [113, 113, 122], families: ['Geist'], weight: 'Normal' },
    },
    fonts: [
      'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-700-normal.ttf',
      'https://cdn.jsdelivr.net/fontsource/fonts/geist@latest/latin-400-normal.ttf',
    ],
  }),
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
