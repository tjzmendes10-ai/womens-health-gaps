// ABS, Causes of Death, Australia, 2025: deaths registered in 2025 and years
// of potential life lost (YPLL), by cause and sex.
import text from '../../../research-data/clean/abs_cod_2025_by_cause_sex.csv?raw';
import { table } from './csv';

const t = table('abs_cod_2025_by_cause_sex.csv', text, ['cause', 'deaths_female', 'ypll_female']);
export const COD_FILE = t;
export const COD_YEAR = 2025;
export const COD_SOURCE = {
  label: 'ABS, Causes of Death, Australia, 2025',
  url: 'https://www.abs.gov.au/statistics/health/causes-death/causes-death-australia/latest-release',
};

export const CAUSES = {
  heart: 'Ischaemic heart diseases (I20-I25)',
  breast: 'Malignant neoplasm of breast (C50)',
  ovarian: 'Malignant neoplasm of ovary (C56)',
  cervical: 'Malignant neoplasm of cervix uteri (C53)',
} as const;

export function womensDeaths(key: keyof typeof CAUSES): { cause: string; deaths: number; ypll: number } {
  const row = t.one({ cause: CAUSES[key] });
  return { cause: CAUSES[key], deaths: t.num(row, 'deaths_female'), ypll: t.num(row, 'ypll_female') };
}
