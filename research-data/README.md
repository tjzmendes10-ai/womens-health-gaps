# Research data

Data collected for the planned "In numbers" and data explorer pages. **The website
doesn't use any of it yet.** Astro only builds what's in `src/`, so files in
this folder don't change the live site.

- `SOURCES.md`: where each dataset came from, its licence, and the caveats to
  follow when using it on the site. **Read this before using any number.**
- `clean/`: tidied CSV files, ready for charts. The values are exactly as
  published, only reshaped.
- `raw/`: original downloads, kept where they're small and the licence allows
  sharing (ABS spreadsheets, OECD and WHO CSVs).
- `scripts/`: scripts used to download or tidy the World Bank, ClinicalTrials.gov,
  PubMed and WHO data. They can be re-run to refresh it.

## Not in this repo

- **Raw API responses from the World Bank, ClinicalTrials.gov and the extra WHO
  indicators** (about 140 MB).
  The CSVs in `clean/` contain the same values, and the scripts can download them
  again.
- **IHME Global Burden of Disease files.** IHME's terms limit redistribution, so
  they're kept privately (in the data pack zip). `clean/ctgov_vs_gbd_summary.csv`
  includes one figure calculated from GBD (women's share of DALYs per
  condition), credited to IHME.

## Source licences

| Source | Licence |
|---|---|
| World Bank | CC BY 4.0 |
| ABS | CC BY 4.0 |
| WHO | CC BY-NC-SA 3.0 IGO (non-commercial, credit WHO, share alike) |
| ClinicalTrials.gov, PubMed | US government public data |
| OECD | CC BY 4.0 |
