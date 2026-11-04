// Numbers for the "Then" chapter, read from the history timeline entries
// (src/content/timeline/*.md). Each figure is found in the entry's own text,
// so editing the timeline updates the "In numbers" page too. If the wording
// changes so a figure can't be found, the build stops and says which entry
// and which phrase it was looking for.
import { getEntry, type CollectionEntry } from 'astro:content';

const WORDS: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
};
const toNumber = (s: string) => WORDS[s.toLowerCase()] ?? Number(s.replace(/,/g, ''));

async function entry(id: string): Promise<CollectionEntry<'timeline'>> {
  const e = await getEntry('timeline', id);
  if (!e) throw new Error(`"In numbers" page: missing timeline entry src/content/timeline/${id}.md.`);
  return e;
}

/** Find a number in an entry's title or text. `pattern` must have one capture group. */
function find(e: CollectionEntry<'timeline'>, pattern: RegExp, what: string): number {
  const text = `${e.data.title}\n${e.body ?? ''}`;
  const m = text.match(pattern);
  const n = m ? toNumber(m[1]) : NaN;
  if (!Number.isFinite(n)) {
    throw new Error(
      `"In numbers" page: couldn't find ${what} in src/content/timeline/${e.id}.md ` +
        `(looking for text matching ${pattern}). If you reworded that entry, update src/lib/data/timeline-figures.ts to match.`,
    );
  }
  return n;
}

const year = (e: CollectionEntry<'timeline'>) => Math.floor(e.data.sortYear);

export interface ThenFigure { id: string; date: string; title: string; source: CollectionEntry<'timeline'>['data']['source'] }

const meta = (e: CollectionEntry<'timeline'>): ThenFigure => ({ id: e.id, date: e.data.date, title: e.data.title, source: e.data.source });

export async function thenFigures() {
  const [excl, rev, aspM, aspW, withdrawn, bias, zolp, nhmrc] = await Promise.all(
    ['fda-exclusion-1977', 'fda-reversal-1993', 'aspirin-men-1989', 'aspirin-women-2005', 'withdrawn-drugs-2001', 'male-bias-2011', 'zolpidem-2013', 'nhmrc-2026'].map(entry),
  );

  const zolpApproved = find(zolp, /approved in the US since (\d{4})/, 'the year zolpidem was approved');
  const zolpHalved = find(zolp, /In \w+ (\d{4}), the US Food and Drug Administration/, 'the year the dose was halved');

  return {
    exclusion: { from: year(excl), to: year(rev), years: year(rev) - year(excl), entries: [meta(excl), meta(rev)] },
    aspirinMen: { year: year(aspM), men: find(aspM, /in ([\d,]+) doctors, all of them men/, 'the number of men'), entry: meta(aspM) },
    aspirinWomen: { year: year(aspW), women: find(aspW, /results from ([\d,]+) women/, 'the number of women'), entry: meta(aspW) },
    withdrawn: {
      year: year(withdrawn),
      total: find(withdrawn, /looked at the (\d+) prescription drugs/, 'the number of drugs withdrawn'),
      riskier: find(withdrawn, /(\w+) of them posed greater health risks for women/, 'the number that were riskier for women'),
      prescribedMore: find(withdrawn, /(\w+) of the eight were simply prescribed more often to women/, 'the number prescribed more often to women'),
      entry: meta(withdrawn),
    },
    maleBias: { year: year(bias), ratio: find(bias, /by ([\d.]+) to 1/, 'the male-to-female ratio'), entry: meta(bias) },
    zolpidem: { from: zolpApproved, to: zolpHalved, years: zolpHalved - zolpApproved, entry: meta(zolp) },
    nhmrc: { year: year(nhmrc), entry: meta(nhmrc) },
  };
}
