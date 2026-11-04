// IHME GBD 2023: Australian women, age-standardised death rates per 100,000,
// 1990, 2010 and 2023, by cause.
import text from '../../../research-data/clean/gbd_au_women_death_rates_1990_2023.csv?raw';
import { table } from './csv';

const t = table('gbd_au_women_death_rates_1990_2023.csv', text, ['cause', 'year', 'death_rate_per_100k']);
export const RATES_FILE = t;
export const RATE_YEARS = [1990, 2010, 2023] as const;

export interface RateRow { cause: string; rates: number[]; fallPct: number }

export function deathRateTrends(): RateRow[] {
  const causes = [...new Set(t.rows.map((r) => r.cause))];
  return causes
    .map((cause) => {
      const rates = RATE_YEARS.map((y) => t.num(t.one({ cause, year: String(y) }), 'death_rate_per_100k'));
      return { cause, rates, fallPct: ((rates[0] - rates[rates.length - 1]) / rates[0]) * 100 };
    })
    .sort((a, b) => b.rates[0] - a.rates[0]);
}
