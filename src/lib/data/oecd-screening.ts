// OECD Health Statistics: breast and cervical screening (programme data,
// women). Australia's latest year vs the median of the other countries
// reporting that year.
import text from '../../../research-data/clean/oecd_cancer_screening.csv?raw';
import { table, median } from './csv';

const t = table('oecd_cancer_screening.csv', text, ['iso3', 'country', 'cancer_site', 'age', 'sex', 'data_source', 'year', 'pct_screened', 'status']);
export const OECD_FILE = t;
export const OECD_SOURCE = { label: 'OECD Health Statistics, cancer screening', url: 'https://data-explorer.oecd.org/' };

export const SITES = {
  cervical: { site: 'Malignant neoplasms of cervix uteri', label: 'Cervical screening', ages: '20–69' },
  breast: { site: 'Malignant neoplasms of female breast', label: 'Breast screening', ages: '50–69' },
} as const;

export interface ScreenRow { key: string; label: string; ages: string; year: number; australia: number; status: string; median: number; countries: number }

export function screening(): ScreenRow[] {
  return (Object.keys(SITES) as (keyof typeof SITES)[]).map((key) => {
    const { site, label, ages } = SITES[key];
    const rows = t.all({ cancer_site: site, sex: 'F', data_source: 'Programme data' }).filter((r) => r.pct_screened !== '');
    const au = rows.filter((r) => r.iso3 === 'AUS');
    if (au.length === 0) throw new Error(`research-data/clean/${t.file} has no Australian programme data for ${site}.`);
    const latest = au.reduce((a, b) => (Number(b.year) > Number(a.year) ? b : a));
    const others = rows.filter((r) => r.year === latest.year && r.iso3 !== 'AUS').map((r) => t.num(r, 'pct_screened'));
    if (others.length < 5) throw new Error(`research-data/clean/${t.file}: fewer than 5 other countries report ${site} in ${latest.year}.`);
    return { key, label, ages, year: Number(latest.year), australia: t.num(latest, 'pct_screened'), status: latest.status, median: median(others), countries: others.length };
  });
}
