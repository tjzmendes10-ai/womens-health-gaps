// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { placeholderMarkdownPlugin, placeholderReport } from './src/lib/placeholder-plugins.mjs';

export default defineConfig({
  // The site lives at https://tjzmendes10-ai.github.io/womens-health-gaps/
  site: 'https://tjzmendes10-ai.github.io',
  base: '/womens-health-gaps',

  markdown: {
    // Highlights [CAPS – like this] placeholders inside markdown text.
    processor: satteri({ hastPlugins: [placeholderMarkdownPlugin] }),
  },

  // Lists every page that still has placeholders at the end of each build.
  integrations: [placeholderReport()],
});
