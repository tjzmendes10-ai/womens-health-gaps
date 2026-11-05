// Time to diagnosis for endometriosis in Australia (published surveys,
// transcribed into research-data/clean/time_to_diagnosis.csv). The chart uses
// one study only (Armour et al. 2020); a second (Mosterd et al. 2025) is
// quoted in the caveat.
import text from '../../../research-data/clean/time_to_diagnosis.csv?raw';
import { table, type Row } from './csv';

const t = table('time_to_diagnosis.csv', text, [
  'condition', 'region', 'subgroup', 'years_to_diagnosis', 'measure', 'measured_from', 'sample_size', 'study_years', 'source_title', 'source_publisher', 'source_year', 'source_url',
]);
export const DIAGNOSIS_FILE = t;

const ARMOUR = 'Scientific Reports 10:16253';
const MOSTERD = 'Journal of Psychosomatic Research 193:112143';
const PERIODS = ['First saw a doctor before 2005', 'First saw a doctor 2005–2012', 'First saw a doctor 2013 onwards'];

const endo = (publisher: string, subgroup: string, measuredFrom?: string) =>
  t.one({ condition: 'Endometriosis', region: 'Australia', source_publisher: publisher, subgroup, ...(measuredFrom !== undefined ? { measured_from: measuredFrom } : {}) });

/** e.g. "Armour et al., Scientific Reports (2020)", built from the CSV's title and publisher. */
const source = (r: Row) => {
  const author = r.source_title.match(/\((\S+) [A-Z]+ et al\.\)$/)?.[1];
  if (!author) throw new Error(`research-data/clean/${t.file}: couldn't find "(Surname X et al.)" at the end of source_title "${r.source_title}".`);
  const journal = r.source_publisher.replace(/ \d.*$/, '');
  return { label: `${author} et al., ${journal} (${r.source_year})`, url: r.source_url };
};

export function endometriosisDelay() {
  const total = endo(ARMOUR, 'All', 'symptom onset');
  const periods = PERIODS.map((p) => {
    const r = endo(ARMOUR, p, 'first presentation');
    return { label: p.replace('First saw a doctor ', ''), years: t.num(r, 'years_to_diagnosis') };
  });
  const later = endo(MOSTERD, 'All');
  const laterRecent = endo(MOSTERD, 'First saw a GP from 2018');
  return {
    years: t.num(total, 'years_to_diagnosis'),
    sampleSize: t.num(total, 'sample_size'),
    surveyYear: total.study_years,
    periods,
    later: { years: t.num(later, 'years_to_diagnosis'), sampleSize: t.num(later, 'sample_size'), year: later.source_year, recent: t.num(laterRecent, 'years_to_diagnosis') },
    sources: [source(total), source(later)],
  };
}
