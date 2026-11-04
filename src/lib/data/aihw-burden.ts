// AIHW: share of the burden of disease that is non-fatal (living with
// illness) rather than fatal (dying early), by sex. Transcribed from the
// figure already cited on the home page (src/content/pages/home.md).
import text from '../../../research-data/clean/aihw_burden_fatal_nonfatal.csv?raw';
import { table } from './csv';

const t = table('aihw_burden_fatal_nonfatal.csv', text, ['sex', 'pct_non_fatal', 'source_title', 'source_url', 'transcribed_from']);
export const BURDEN_FILE = t;

export interface BurdenRow { sex: 'Females' | 'Males'; nonFatal: number; fatal: number }

/** Women's row is required. Men's is optional: if it's missing the chart shows a visible placeholder. */
export function burdenSplit(): { women: BurdenRow; men?: BurdenRow; source: { label: string; url: string } } {
  const w = t.one({ sex: 'Females' });
  const nonFatal = t.num(w, 'pct_non_fatal');
  if (nonFatal < 0 || nonFatal > 100) throw new Error(`research-data/clean/${t.file}: pct_non_fatal must be between 0 and 100.`);
  const m = t.rows.find((r) => r.sex === 'Males');
  const men = m ? { sex: 'Males' as const, nonFatal: t.num(m, 'pct_non_fatal'), fatal: 100 - t.num(m, 'pct_non_fatal') } : undefined;
  return { women: { sex: 'Females', nonFatal, fatal: 100 - nonFatal }, men, source: { label: w.source_title, url: w.source_url } };
}
