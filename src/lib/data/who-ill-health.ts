// WHO Global Health Estimates 2021: years lived in ill health (life
// expectancy minus healthy life expectancy), women vs men, by WHO region,
// and the number of countries where women's figure is higher. Global.
import text from '../../../research-data/clean/who_le_hale_by_sex.csv?raw';
import { table } from './csv';
import { WHO_YEAR, WHO_URL } from '../who-global';

const t = table('who_le_hale_by_sex.csv', text, ['year', 'geo_type', 'area', 'sex', 'years_ill_health']);
export const WHO_FILE = t;
export { WHO_YEAR };
export const WHO_SOURCE = { label: 'WHO Global Health Estimates 2021', url: WHO_URL };

export interface RegionRow { region: string; women: number; men: number }

export function illHealthByRegion(): RegionRow[] {
  const year = String(WHO_YEAR);
  const regions = [...new Set(t.all({ year, geo_type: 'WHOREGION' }).map((r) => r.area))];
  return regions
    .map((region) => ({
      region,
      women: t.num(t.one({ year, geo_type: 'WHOREGION', area: region, sex: 'FEMALE' }), 'years_ill_health'),
      men: t.num(t.one({ year, geo_type: 'WHOREGION', area: region, sex: 'MALE' }), 'years_ill_health'),
    }))
    .sort((a, b) => b.women - a.women);
}

/** Countries with both a women's and a men's figure, and how many have women's higher. */
export function countriesWomenHigher(): { higher: number; total: number } {
  const rows = t.all({ year: String(WHO_YEAR), geo_type: 'COUNTRY' });
  const byArea = new Map<string, { f?: number; m?: number }>();
  for (const r of rows) {
    if (r.sex !== 'FEMALE' && r.sex !== 'MALE') continue;
    const e = byArea.get(r.area) ?? {};
    if (r.sex === 'FEMALE') e.f = t.num(r, 'years_ill_health');
    else e.m = t.num(r, 'years_ill_health');
    byArea.set(r.area, e);
  }
  const pairs = [...byArea.values()].filter((e) => e.f !== undefined && e.m !== undefined);
  return { higher: pairs.filter((e) => e.f! > e.m!).length, total: pairs.length };
}
