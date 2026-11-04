// PubMed papers (2015–2024) per 100,000 DALYs (GBD 2023, global, both sexes),
// against the share of each condition's burden that comes from living unwell.
import text from '../../../research-data/clean/research_vs_burden_type.csv?raw';
import { table, isTrue } from './csv';

const t = table('research_vs_burden_type.csv', text, ['condition', 'papers_per_100k_DALYs', 'pct_burden_from_living_unwell', 'gynaecological_exclude']);
export const RESEARCH_FILE = t;

export interface ResearchRow { condition: string; papers: number; livingUnwell: number }

export function researchVsBurden(): ResearchRow[] {
  const rows = t.rows
    .filter((r) => !isTrue(r.gynaecological_exclude))
    .map((r) => ({ condition: r.condition, papers: t.num(r, 'papers_per_100k_DALYs'), livingUnwell: t.num(r, 'pct_burden_from_living_unwell') }));
  if (rows.length === 0) throw new Error(`research-data/clean/${t.file} has no rows left after removing gynaecological conditions.`);
  return rows;
}

export function researchRow(condition: string): ResearchRow {
  const row = researchVsBurden().find((r) => r.condition === condition);
  if (!row) throw new Error(`research-data/clean/${t.file} has no row where condition = "${condition}".`);
  return row;
}
