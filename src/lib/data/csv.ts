// Shared helpers for reading research-data/clean/*.csv at build time.
// Every number on the "In numbers" page comes through here. Nothing is typed
// in by hand: if a file, column or row is missing, the build stops with a
// plain message saying exactly what to fix.

export const REPO_URL = 'https://github.com/tjzmendes10-ai/womens-health-gaps';
export const SOURCES_URL = `${REPO_URL}/blob/main/research-data/SOURCES.md`;

/** Link to a data file on GitHub, e.g. csvUrl('who_le_hale_by_sex.csv'). */
export const csvUrl = (file: string) => `${REPO_URL}/blob/main/research-data/clean/${file}`;

export type Row = Record<string, string>;

/** Split CSV text into rows, handling "quoted, values" and "" escapes. */
function parse(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c !== '')) out.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c !== '')) out.push(row);
  return out;
}

export interface Table {
  file: string;
  url: string;
  rows: Row[];
  /** The one row matching every key/value pair. Stops the build if there isn't exactly one. */
  one(match: Row): Row;
  /** All rows matching every key/value pair. Stops the build if there are none. */
  all(match: Row): Row[];
  /** A number from a row. Stops the build if the cell is empty or not a number. */
  num(row: Row, column: string): number;
}

const describe = (match: Row) =>
  Object.entries(match).map(([k, v]) => `${k} = "${v}"`).join(', ');

/**
 * Load a CSV that was bundled with  import text from '…csv?raw'.
 * `columns` lists the columns the page relies on.
 */
export function table(file: string, text: string, columns: string[]): Table {
  const where = `research-data/clean/${file}`;
  if (!text || !text.trim()) throw new Error(`${where} is empty or missing. The "In numbers" page reads its figures from it.`);
  const [header, ...body] = parse(text);
  const cols = header.map((h) => h.trim());
  for (const c of columns) {
    if (!cols.includes(c)) throw new Error(`${where} has no "${c}" column. Columns found: ${cols.join(', ')}.`);
  }
  const rows = body.map((r) => Object.fromEntries(cols.map((c, i) => [c, (r[i] ?? '').trim()])));
  const matches = (match: Row) => rows.filter((r) => Object.entries(match).every(([k, v]) => r[k] === v));
  return {
    file,
    url: csvUrl(file),
    rows,
    one(match) {
      const found = matches(match);
      if (found.length === 0) throw new Error(`${where} has no row where ${describe(match)}.`);
      if (found.length > 1) throw new Error(`${where} has ${found.length} rows where ${describe(match)}; expected one.`);
      return found[0];
    },
    all(match) {
      const found = matches(match);
      if (found.length === 0) throw new Error(`${where} has no rows where ${describe(match)}.`);
      return found;
    },
    num(row, column) {
      const raw = row[column];
      const n = Number(raw);
      if (raw === undefined || raw === '' || !Number.isFinite(n)) {
        throw new Error(`${where}: expected a number in column "${column}" but found "${raw ?? ''}" (row: ${Object.values(row).slice(0, 4).join(', ')}).`);
      }
      return n;
    },
  };
}

/** True/False columns written by the data scripts. */
export const isTrue = (v: string) => v.trim().toLowerCase() === 'true';

// ---------------------------------------------------------------------------
// Formatting. Rounding is done on the decimal string so 60.85 becomes 60.9,
// not 60.8 (floating-point).
// ---------------------------------------------------------------------------
export function round(n: number, dp = 0): number {
  const f = 10 ** dp;
  return Math.round((n + Number.EPSILON) * f) / f;
}
export const fmt = (n: number, dp = 0) =>
  round(n, dp).toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp });

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
/** 4 -> "four" (up to ten); larger numbers stay as digits. */
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? fmt(n);
export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Spearman rank correlation (ties get their average rank). */
export function spearman(a: number[], b: number[]): number {
  const rank = (v: number[]) => {
    const order = v.map((x, i) => [x, i] as const).sort((p, q) => p[0] - q[0]);
    const r = new Array(v.length);
    for (let i = 0; i < order.length; ) {
      let j = i;
      while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j++;
      for (let k = i; k <= j; k++) r[order[k][1]] = (i + j) / 2 + 1;
      i = j + 1;
    }
    return r as number[];
  };
  const ra = rank(a), rb = rank(b);
  const mean = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length;
  const ma = mean(ra), mb = mean(rb);
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < ra.length; i++) { num += (ra[i] - ma) * (rb[i] - mb); da += (ra[i] - ma) ** 2; db += (rb[i] - mb) ** 2; }
  return num / Math.sqrt(da * db);
}
