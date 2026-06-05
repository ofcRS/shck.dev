// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shck.dev',
  integrations: [sitemap()],
  redirects: {
    '/blog/notion-mcp': '/posts/notion-mcp/',
    '/blog': '/posts/',
  },
  markdown: { shikiConfig: { theme: 'github-light' } },
});
