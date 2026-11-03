// The rules every content file must follow.
// If a markdown file breaks one of these rules, the build stops and prints
// the file name plus the message written here, so keep messages plain.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const required = (field: string, hint = '') =>
  z.string({ error: `"${field}" is missing.${hint ? ' ' + hint : ''}` }).min(1, `"${field}" is empty.`);

// ---------------------------------------------------------------------------
// Sources: either a real reference (title + publisher + url), or a visible
// placeholder written as   needed: "what source is missing"
// ---------------------------------------------------------------------------
const source = z
  .object({
    title: z.string().optional(),
    publisher: z.string().optional(),
    year: z.union([z.number(), z.string()]).optional(),
    url: z.url({ error: '"url" must be a full web address starting with https://' }).optional(),
    needed: z.string().optional(),
  })
  .superRefine((s, ctx) => {
    if (s.needed) return;
    for (const field of ['title', 'publisher', 'url'] as const) {
      if (!s[field]) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message:
            `This source has no "${field}". A real source needs title, publisher and url. ` +
            `If you don't have it yet, write   needed: "what's missing"   instead.`,
        });
      }
    }
  });

// External links (e.g. organisations on the "Where we're headed" page)
// follow the same rule: a real link, or a visible "needed" placeholder.
const action = z
  .object({
    title: required('title'),
    description: required('description'),
    organisation: z.string().optional(),
    url: z.url({ error: '"url" must be a full web address starting with https://' }).optional(),
    needed: z.string().optional(),
  })
  .superRefine((a, ctx) => {
    // A link is optional, but if there is one it needs both an organisation and a url.
    if (a.needed || (!a.organisation && !a.url)) return;
    for (const field of ['organisation', 'url'] as const) {
      if (!a[field]) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `This action links to an organisation but has no "${field}". Add it, or remove the link.`,
        });
      }
    }
  });

// "What needs to change": who is responsible, what they should do, and
// sources for any figures quoted.
const change = z.object({
  who: required('who', 'e.g. "Governments and funders".'),
  points: z.array(z.string().min(1), { error: 'Each group needs a "points" list.' }).min(1, 'Add at least one point.'),
  sources: z.array(source).default([]),
});

// A "last reviewed" date, or the honest alternative.
const lastReviewed = z.union([z.literal('not yet reviewed'), z.coerce.date()], {
  error: '"lastReviewed" must be a date like 2026-11-02, or the words: not yet reviewed',
});

// Numbers in YAML (e.g. value: 12) are accepted and treated as text.
const text = (field: string, hint = '') =>
  z.preprocess((v) => (typeof v === 'number' ? String(v) : v), required(field, hint));

// ---------------------------------------------------------------------------
// Stat callouts on problem pages
// ---------------------------------------------------------------------------
const stat = z.object({
  value: text('value', 'e.g. "1 in 7", or "[STAT – source needed]".'),
  label: text('label', 'This is the sentence explaining what the number means.'),
  region: z.enum(['Australia', 'Global'], {
    error: 'Each stat needs   region: Australia   or   region: Global',
  }),
  source: z
    .number({ error: '"source" must be the number of a source in the sources list (1 = the first one).' })
    .int()
    .min(1, '"source" numbers start at 1.'),
});

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

/** Act 1 topics: "Menstrual health", "Cardiovascular disease", "Bones", "Cancer". */
const topics = defineCollection({
  loader: glob({ base: './src/content/topics', pattern: '*.md' }),
  schema: z.object({
    title: required('title'),
    hook: required('hook'),
    order: z.number({ error: '"order" must be a number (1 shows first).' }),
    // live: a hub page listing conditions. page: a single condition page,
    // written in problems/<topic>/overview.md. coming-soon: a card only.
    status: z.enum(['live', 'page', 'coming-soon'], { error: '"status" must be live, page or coming-soon' }),
    // Sub-topics shown as "coming soon" on the hub page, e.g. Menopause.
    comingSoon: z.array(z.string()).default([]),
    // Sources for any figures in the hook, shown on the home page card.
    sources: z.array(source).default([]),
  }),
});

/** Problem pages. Each lives in a folder named after its topic. */
const problems = defineCollection({
  loader: glob({ base: './src/content/problems', pattern: '**/*.md' }),
  schema: z
    .object({
      title: required('title'),
      hook: required('hook', 'This is the one-line summary under the title.'),
      order: z.number({ error: '"order" must be a number (1 shows first).' }),
      mentalHealth: z.boolean({
        error:
          'Add   mentalHealth: true   or   mentalHealth: false.   ' +
          'Use true for any page that covers mental health (e.g. PMDD), so the Lifeline box appears.',
      }),
      stats: z
        .array(stat, { error: 'A problem page needs a "stats" list.' })
        .min(3, 'A problem page needs at least 3 stats.')
        .max(5, 'A problem page can have at most 5 stats.'),
      sources: z.array(source, { error: 'A problem page needs a "sources" list.' }).min(1, 'Add at least one source.'),
      lastReviewed,
    })
    .superRefine((page, ctx) => {
      page.stats.forEach((s, i) => {
        if (s.source > page.sources.length) {
          ctx.addIssue({
            code: 'custom',
            path: ['stats', i, 'source'],
            message: `Stat ${i + 1} points to source ${s.source}, but only ${page.sources.length} source(s) are listed.`,
          });
        }
      });
    }),
});

/** History timeline: one file per event. */
const timeline = defineCollection({
  loader: glob({ base: './src/content/timeline', pattern: '*.md' }),
  schema: z.object({
    date: required('date', 'This is the label shown on the page, e.g. "1977" or "Ancient Greece".'),
    sortYear: z.number({
      error: '"sortYear" must be a number used to put events in order. Use a negative number for BCE (e.g. -400).',
    }),
    title: required('title'),
    source,
    // Optional small drawing beside the entry.
    illustration: z
      .enum(['door-closed', 'door-open', 'mice'], {
        error: '"illustration" must be one of: door-closed, door-open, mice (or leave it out)',
      })
      .optional(),
  }),
});

/** "Where the words come from": short entries shown under the history timeline. */
const origins = defineCollection({
  loader: glob({ base: './src/content/origins', pattern: '*.md' }),
  schema: z.object({
    term: required('term', 'The word being explained, e.g. "Hysteria".'),
    order: z.number({ error: '"order" must be a number (1 shows first).' }),
    source,
  }),
});

/** Standalone pages. "page" says which one, and decides which fields are needed. */
const base = { title: required('title'), description: required('description', 'Used by search engines and link previews.') };
const act = z.object({ title: required('title'), blurb: required('blurb') });

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '*.md' }),
  schema: z.discriminatedUnion(
    'page',
    [
      z.object({ page: z.literal('home'), ...base, act1: act, act2: act, act3: act }),
      z.object({ page: z.literal('history'), ...base }),
      z.object({
        page: z.literal('headed'),
        ...base,
        changesTitle: required('changesTitle'),
        changes: z.array(change).min(3, 'List at least 3 groups.').max(5, 'List at most 5 groups.'),
        youTitle: required('youTitle'),
        actions: z
          .array(action)
          .min(3, 'List at least 3 actions.')
          .max(6, 'List at most 6 actions.'),
      }),
      z.object({ page: z.literal('about'), ...base }),
    ],
    { error: '"page" must be one of: home, history, headed, about' },
  ),
});

export const collections = { topics, problems, timeline, origins, pages };
