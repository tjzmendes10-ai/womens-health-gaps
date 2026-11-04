// ABS Patient Experiences, 2024–25 (Australia): people aged 15+ who delayed
// or went without care because of cost, by sex, with 95% margins of error.
import text from '../../../research-data/clean/abs_patient_experiences_2024_25_by_sex_age.csv?raw';
import { table } from './csv';

const t = table('abs_patient_experiences_2024_25_by_sex_age.csv', text, ['service', 'measure', 'sex', 'age_group', 'percent', 'moe_95']);

export const COST_FILE = t;
export const COST_YEAR = '2024–25';
export const COST_SOURCE = {
  label: 'ABS, Patient Experiences, 2024–25',
  url: 'https://www.abs.gov.au/statistics/health/health-services/patient-experiences/latest-release',
};

const MEASURES = [
  { key: 'gp', label: 'GP', service: 'GP', measure: 'At least once delayed seeing or did not see a GP when needed - cost a reason' },
  { key: 'specialist', label: 'Specialist', service: 'Medical specialist', measure: 'At least once delayed seeing or did not see a medical specialist when needed - cost a reason' },
  { key: 'dental', label: 'Dental', service: 'Dental', measure: 'At least once delayed seeing or did not see a dental professional when needed - cost a reason' },
  { key: 'medicine', label: 'Prescribed medicine', service: 'GP', measure: 'Delayed getting or did not get prescribed medication due to cost' },
] as const;

export interface CostRow { key: string; label: string; measure: string; women: number; womenMoe: number; men: number; menMoe: number }

export function costBarriers(): CostRow[] {
  return MEASURES.map((m) => {
    const w = t.one({ service: m.service, measure: m.measure, sex: 'Females', age_group: 'Total' });
    const mm = t.one({ service: m.service, measure: m.measure, sex: 'Males', age_group: 'Total' });
    return {
      key: m.key,
      label: m.label,
      measure: m.measure,
      women: t.num(w, 'percent'),
      womenMoe: t.num(w, 'moe_95'),
      men: t.num(mm, 'percent'),
      menMoe: t.num(mm, 'moe_95'),
    };
  });
}
