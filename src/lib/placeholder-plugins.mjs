// Placeholders are any text in square brackets that starts with a CAPITALISED
// word of 3+ letters, e.g. [STAT – source needed] or [TEXT – bio goes here].
// They are highlighted on the site and counted at the end of every build,
// so nothing unverified can slip through unnoticed.

import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const PLACEHOLDER_PATTERN = /\[[A-Z]{3,}[^\]]*\]/g;
export const PLACEHOLDER_TITLE = 'Placeholder: content not yet written or verified';

/**
 * Split a string into normal text and placeholder pieces.
 * @param {string} text
 * @returns {{ text: string, placeholder: boolean }[]}
 */
export function splitPlaceholders(text) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(PLACEHOLDER_PATTERN)) {
    const start = match.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), placeholder: false });
    parts.push({ text: match[0], placeholder: true });
    last = start + match[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), placeholder: false });
  return parts;
}

/** Markdown plugin (for Astro's Sätteri processor): wraps placeholders in <mark class="placeholder">. */
export const placeholderMarkdownPlugin = {
  name: 'placeholders',
  /** @param {any} node @param {any} ctx */
  text(node, ctx) {
    const parts = splitPlaceholders(node.value);
    if (!parts.some((p) => p.placeholder)) return;
    ctx.replaceNode(
      node,
      parts.map((part) =>
        part.placeholder
          ? {
              type: 'element',
              tagName: 'mark',
              properties: { className: ['placeholder'], title: PLACEHOLDER_TITLE },
              children: [{ type: 'text', value: part.text }],
            }
          : { type: 'text', value: part.text },
      ),
    );
  },
};

/** Build step: prints how many placeholders are left on each page. */
export function placeholderReport() {
  return {
    name: 'placeholder-report',
    hooks: {
      'astro:build:done': async (/** @type {{ dir: URL, logger: any }} */ { dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
        const rows = [];
        for (const file of files) {
          const html = await readFile(path.join(root, file), 'utf8');
          const count = (html.match(/<mark class="placeholder/g) ?? []).length;
          if (count) rows.push({ file, count });
        }
        if (rows.length === 0) {
          logger.info('No placeholders left on any page.');
          return;
        }
        const total = rows.reduce((sum, r) => sum + r.count, 0);
        logger.warn(`${total} placeholder(s) still on the site:`);
        for (const r of rows.sort((a, b) => a.file.localeCompare(b.file))) {
          logger.warn(`  ${String(r.count).padStart(3)}  ${r.file}`);
        }
      },
    },
  };
}
