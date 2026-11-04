// Our analysis of ClinicalTrials.gov (women's share of trial participants)
// against GBD 2023 (women's share of DALYs), by condition. Global.
import summaryText from '../../../research-data/clean/ctgov_vs_gbd_summary.csv?raw';
import trialsText from '../../../research-data/clean/ctgov_trials_sex_by_condition.csv?raw';
import { table } from './csv';

const summary = table('ctgov_vs_gbd_summary.csv', summaryText, ['condition', 'trials', 'women_pct_all', 'median_trial_women_pct', 'women_pct_DALYs']);
const trials = table('ctgov_trials_sex_by_condition.csv', trialsText, ['condition', 'nct_id', 'start_year']);

export const TRIALS_FILES = [summary, trials];
export const HEART = 'Ischaemic heart disease';
export const STROKE = 'Stroke';

export interface TrialRow { condition: string; trials: number; pooled: number; median: number; burden: number; gap: number }

export function trialShares(): TrialRow[] {
  return summary.rows
    .map((r) => {
      const pooled = summary.num(r, 'women_pct_all');
      const burden = summary.num(r, 'women_pct_DALYs');
      return { condition: r.condition, trials: summary.num(r, 'trials'), pooled, median: summary.num(r, 'median_trial_women_pct'), burden, gap: pooled - burden };
    })
    .sort((a, b) => a.gap - b.gap);
}

export function heartTrials(): TrialRow {
  const row = trialShares().find((r) => r.condition === HEART);
  if (!row) throw new Error(`research-data/clean/${summary.file} has no row where condition = "${HEART}".`);
  return row;
}

/** Distinct trials (some are counted under more than one condition), and the start-year range. */
export function trialCount(): { distinct: number; entries: number; firstYear: number; lastYear: number } {
  const years = trials.rows.map((r) => trials.num(r, 'start_year'));
  return {
    distinct: new Set(trials.rows.map((r) => r.nct_id)).size,
    entries: trials.rows.length,
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
  };
}

/** Plain-English condition names for labels. */
export const conditionLabel = (c: string) =>
  c === 'Alzheimers disease and other dementias' ? "Alzheimer's and other dementias" : c;
