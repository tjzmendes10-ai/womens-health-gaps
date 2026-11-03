// Global life expectancy and healthy life expectancy (HALE) by sex, read at
// build time from research-data/clean/who_le_hale_by_sex.csv (WHO Global
// Health Estimates). No numbers are typed in by hand: if the file or the row
// is missing, the build stops with a clear message.
// Bundled at build time as plain text.
import csvText from '../../research-data/clean/who_le_hale_by_sex.csv?raw';

const FILE = 'research-data/clean/who_le_hale_by_sex.csv';
export const WHO_YEAR = 2021;
export const WHO_URL =
  'https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy';

export interface LifeRow { life: number; healthy: number; ill: number }

// Round to 1 decimal place from the CSV's 2-decimal values without
// floating-point surprises (e.g. 60.85 -> 60.9).
const round1 = (s: string) => Math.floor((Math.round(parseFloat(s) * 100) + 5) / 10) / 10;

export function worldLife(): { women: LifeRow; men: LifeRow } {
  if (!csvText) throw new Error(`Home page: ${FILE} is empty. It holds the global life expectancy figures.`);
  const [header, ...lines] = csvText.trim().split('\n');
  const cols = header.split(',');
  const col = (name: string) => {
    const i = cols.indexOf(name);
    if (i < 0) throw new Error(`Home page: ${FILE} has no "${name}" column.`);
    return i;
  };
  const [cYear, cArea, cSex, cLife, cHale, cIll] = ['year', 'area', 'sex', 'life_expectancy', 'hale', 'years_ill_health'].map(col);
  const pick = (sex: string): LifeRow => {
    const row = lines.map((l) => l.split(',')).find((r) => r[cYear] === String(WHO_YEAR) && r[cArea] === 'World' && r[cSex] === sex);
    if (!row) throw new Error(`Home page: ${FILE} has no World ${sex} row for ${WHO_YEAR}.`);
    return { life: round1(row[cLife]), healthy: round1(row[cHale]), ill: round1(row[cIll]) };
  };
  return { women: pick('FEMALE'), men: pick('MALE') };
}
