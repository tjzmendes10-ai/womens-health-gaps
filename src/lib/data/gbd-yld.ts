// IHME GBD 2023: age-standardised YLD rates (years lived with disability per
// 100,000), women vs men, Global and Australia. Only rows where the
// uncertainty ranges don't overlap (gap_clear) are used for claims.
import text from '../../../research-data/clean/gbd_yld_women_vs_men_2023.csv?raw';
import { table, isTrue } from './csv';

const t = table('gbd_yld_women_vs_men_2023.csv', text, ['location', 'cause', 'women_yld_rate', 'men_yld_rate', 'ratio_women_to_men', 'gap_clear']);
export const YLD_FILE = t;
export const GBD_YEAR = 2023;
export const GBD_SOURCE = {
  label: 'Global Burden of Disease Collaborative Network, GBD 2023 Results (IHME, 2024)',
  url: 'https://vizhub.healthdata.org/gbd-results/',
};

export interface YldRow { cause: string; women: number; men: number; ratio: number }

export function clearGaps(location: 'Global' | 'Australia'): YldRow[] {
  const rows = t.all({ location }).filter((r) => isTrue(r.gap_clear));
  if (rows.length === 0) throw new Error(`research-data/clean/${t.file} has no rows for ${location} where gap_clear is True.`);
  return rows
    .map((r) => ({ cause: r.cause, women: t.num(r, 'women_yld_rate'), men: t.num(r, 'men_yld_rate'), ratio: t.num(r, 'ratio_women_to_men') }))
    .sort((a, b) => b.ratio - a.ratio);
}

/** Causes with a clear women-vs-men gap in either location (used to mark the research scatter). */
export function clearGapCauses(): Set<string> {
  return new Set(t.rows.filter((r) => isTrue(r.gap_clear)).map((r) => r.cause));
}
