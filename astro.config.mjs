// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { placeholderMarkdownPlugin, placeholderReport } from './src/lib/placeholder-plugins.mjs';

export default defineConfig({
  // The site lives at https://tjzmendes10-ai.github.io/womens-health-gaps/
  site: 'https://tjzmendes10-ai.github.io',
  base: '/womens-health-gaps',

  // Old addresses keep working after the hub was renamed (Nov 2026).
  // Destinations need the full path: Astro doesn't add `base` to them.
  redirects: {
    '/the-cycle': '/womens-health-gaps/dismissed-as-normal/',
    '/the-cycle/endometriosis': '/womens-health-gaps/dismissed-as-normal/endometriosis/',
    '/the-cycle/pmos': '/womens-health-gaps/dismissed-as-normal/pmos/',
    '/the-cycle/pmdd': '/womens-health-gaps/dismissed-as-normal/pmdd/',
  },

  markdown: {
    // Highlights [CAPS – like this] placeholders inside markdown text.
    processor: satteri({ hastPlugins: [placeholderMarkdownPlugin] }),
  },

  // Fonts are downloaded at build time and served from this site:
  // no requests to Google or other font services.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Newsreader',
      cssVariable: '--font-serif',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],

  // Lists every page that still has placeholders at the end of each build.
  integrations: [placeholderReport()],
});
