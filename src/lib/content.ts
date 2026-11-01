import { getEntry, type CollectionEntry } from 'astro:content';

type PageKind = CollectionEntry<'pages'>['data']['page'];

/** Load a standalone page (e.g. 'about') and check it's the right kind. */
export async function getPage<K extends PageKind>(id: string, kind: K) {
  const entry = await getEntry('pages', id);
  if (!entry) throw new Error(`Missing content file: src/content/pages/${id}.md`);
  if (entry.data.page !== kind) {
    throw new Error(`src/content/pages/${id}.md should have   page: ${kind}   in its frontmatter.`);
  }
  return entry as typeof entry & { data: Extract<typeof entry.data, { page: K }> };
}

const WHY_AU = '<h2 id="why-it-matters-in-australia"';
const GLOBAL = '<h2 id="global-context"';

/**
 * Splits a problem page's markdown into its sections, so the stat callouts
 * can sit between the summary and "Why it matters in Australia".
 */
export function splitProblemBody(entry: CollectionEntry<'problems'>) {
  const html = entry.rendered?.html ?? '';
  const file = entry.filePath ?? entry.id;
  const whyAt = html.indexOf(WHY_AU);
  if (whyAt === -1) {
    throw new Error(`${file} needs a heading written exactly as:   ## Why it matters in Australia`);
  }
  const globalAt = html.indexOf(GLOBAL);
  if (globalAt !== -1 && globalAt < whyAt) {
    throw new Error(`${file}: "## Global context" must come after "## Why it matters in Australia".`);
  }
  return {
    summary: html.slice(0, whyAt),
    whyAustralia: html.slice(whyAt, globalAt === -1 ? undefined : globalAt),
    globalContext: globalAt === -1 ? '' : html.slice(globalAt),
  };
}
