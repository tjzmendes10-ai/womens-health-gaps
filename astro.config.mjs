// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { placeholderMarkdownPlugin, placeholderReport } from './src/lib/placeholder-plugins.mjs';

export default defineConfig({
  // The site lives at https://tjzmendes10-ai.github.io/womens-health-gaps/
  site: 'https://tjzmendes10-ai.github.io',
  base: '/womens-health-gaps',

  // Old addresses keep working after pages are renamed.
  // Destinations need the full path: Astro doesn't add `base` to them.
  redirects: {
    // "The cycle" became "Dismissed as normal", then "Menstrual health".
    '/the-cycle': '/womens-health-gaps/menstrual-health/',
    '/the-cycle/endometriosis': '/womens-health-gaps/menstrual-health/endometriosis/',
    '/the-cycle/pmos': '/womens-health-gaps/menstrual-health/pmos/',
    '/the-cycle/pmdd': '/womens-health-gaps/menstrual-health/pmdd/',
    '/dismissed-as-normal': '/womens-health-gaps/menstrual-health/',
    '/dismissed-as-normal/endometriosis': '/womens-health-gaps/menstrual-health/endometriosis/',
    '/dismissed-as-normal/pmos': '/womens-health-gaps/menstrual-health/pmos/',
    '/dismissed-as-normal/pmdd': '/womens-health-gaps/menstrual-health/pmdd/',
    // "Heart disease" became "Cardiovascular disease".
    '/heart-disease': '/womens-health-gaps/cardiovascular-disease/',
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
