# Women's health data pack – source register

Collected 3 November 2026. Everything in `raw/` is exactly as downloaded from the
original publisher. Everything in `clean/` is a reshaped copy of that raw data
(same numbers, tidier layout). Nothing has been estimated, filled in or merged
across sources.

> **In this repo:** `raw/worldbank/`, `raw/clinicaltrials/` and all IHME files
> (`raw/ihme/`, `clean/ihme_gbd2023_selected_causes.csv`) are left out. See
> README.md. Everything else listed below is here.

**Rule for the site:** each chart uses one source. Don't put World Bank/UN figures
and ABS/AIHW figures for Australia side by side in one comparison, because they
use different methods. Example: the World Bank shows Australian women's life
expectancy in 2024 as 85.1 years, but AIHW says 85.5.

---

## 1. World Bank – World Development Indicators and Gender Statistics (Global)

- **Where from:** World Bank API, `https://api.worldbank.org/v2/country/all/indicator/<CODE>?format=json`
- **Who made the numbers:** mostly WHO, UN Population Division, UNICEF and UNAIDS.
  The World Bank republishes them. The original agency for each indicator is in
  `clean/wb_indicator_metadata.json`. Cite as "WHO via World Bank" (etc.).
- **Licence:** CC BY 4.0. Free to use with credit.
- **Coverage:** 217 countries plus regional and income-group totals, 1990–2025
  (latest year differs by indicator).
- **Files:**
  - `clean/wb_indicators_long.csv`: one row per indicator, country and year
  - `clean/wb_countries.csv`: each country's region and income group (use for filters)
  - `clean/summary_by_region_latest.csv`: latest value by region (quick reference)
  - `raw/worldbank/*.json`: original API responses

| Code | What it measures | Latest year | Original source |
|---|---|---|---|
| SP.DYN.LE00.FE.IN / .MA.IN | Life expectancy at birth, female / male | 2024 | UN World Population Prospects |
| SP.DYN.LE60.FE.IN / .MA.IN | Life expectancy at 60, female / male | see file | UN WPP 2022 |
| SP.DYN.AMRT.FE / .MA | Adult mortality rate, female / male | see file | UN WPP |
| SH.STA.MMRT | Maternal deaths per 100,000 live births | 2023 | WHO, Trends in Maternal Mortality |
| SH.MMR.RISK | Lifetime risk of maternal death (1 in N) | 2023 | WHO / UNICEF |
| SH.DYN.NCOM.FE.ZS / .MA.ZS | Chance of dying aged 30–70 from heart disease, cancer, diabetes or chronic lung disease | 2021 | WHO GHO |
| SH.STA.SUIC.FE.P5 / .MA.P5 | Suicide rate, female / male | 2021 | WHO GHO |
| SH.ANM.ALLW.ZS | Anaemia in women aged 15–49 | 2023 | WHO GHO |
| SH.STA.BRTC.ZS | Births attended by skilled health staff | see file | UNICEF |
| SH.STA.ANVC.ZS | Pregnant women receiving prenatal care | see file | UNICEF |
| SH.FPL.SATM.ZS | Family planning demand met by modern methods | see file | DHS surveys (patchy coverage) |
| SP.ADO.TFRT | Adolescent birth rate | see file | UN WPP |
| SH.HIV.INCD.FE.P3 | New HIV infections, women 15–49 | see file | UNAIDS |
| SH.PRV.SMOK.FE / .MA | Tobacco use, female / male | see file | WHO GHO |
| SH.STA.OWAD.FE.ZS / .MA.ZS | Overweight, female / male | see file | WHO GHO |

**Region codes for filters:** EAS East Asia & Pacific, ECS Europe & Central Asia,
LCN Latin America & Caribbean, MEA Middle East & North Africa, NAC North America,
SAS South Asia, SSF Sub-Saharan Africa, WLD World. **Income groups:** XD high,
XT upper-middle, XN lower-middle, XM low.

**Caveats:**
- Many of these are modelled estimates, not direct counts. That matters most in
  countries with weak death registration. Say "estimated" on the site.
- World Bank regions are not continents. For example, "Middle East & North Africa"
  cuts across Africa and Asia. Label the filter "Region", not "Continent".

---

## 2. Australian Bureau of Statistics – Causes of Death, Australia, 2025 (AU)

- **Where from:** https://www.abs.gov.au/statistics/health/causes-death/causes-death-australia/latest-release
- **Released:** latest release as of 3 Nov 2026, covering deaths registered in 2025.
- **Licence:** CC BY 4.0. Cite "ABS, Causes of Death, Australia, 2025".
- **Files:**
  - `raw/abs/2025_01 Underlying causes of death (Australia).xlsx`
  - `raw/abs/2025_11 Intentional self-harm (suicide)(Australia).xlsx`
  - `raw/abs/2025_12 Deaths of Aboriginal and Torres Strait Islander people.xlsx`
  - `clean/abs_cod_2025_by_cause_sex.csv`: every ICD-10 cause, by sex: deaths,
    crude and age-standardised death rates, years of potential life lost (Table 1.1)
  - `clean/abs_cod_2016_2025_deaths_by_cause_sex.csv`: deaths by cause, sex and
    year, 2016–2025 (Table 1.2)
  - `clean/abs_cod_2025_leading_causes_by_age.csv`: leading causes by age group and sex (Table 1.3)
  - `clean/abs_atsi_table_12_3_raw.csv`: top 20 causes of death for Aboriginal and
    Torres Strait Islander vs non-Indigenous women (Table 12.3)
  - `clean/abs_atsi_table_12_16_raw.csv`: median age at death, Indigenous vs
    non-Indigenous, 1997–2025 (Table 12.16)

**Caveats:**
- The figures are by year of *registration*, not year of death.
- Aboriginal and Torres Strait Islander tables cover NSW, Qld, SA, WA and NT only.
  Say so wherever the figures are used. Present this data with context, following
  Indigenous data sovereignty principles (Maiam nayri Wingara). Don't use it as a
  dropdown option.
- Recent years may be revised upwards as coroner cases close (ABS notes this).

---

## 3. WHO Global Health Estimates: life expectancy and healthy life expectancy (HALE) by sex (Global)

- **Where from:** WHO data API, `https://xmart-api-public.who.int/DATA_/RELAY_WHS`
  - indicator `WHOSIS_000001`: life expectancy at birth
  - indicator `WHOSIS_000002`: healthy life expectancy (HALE) at birth
  - This is the same feed that powers https://data.who.int.
- **Licence:** WHO open data, CC BY-NC-SA 3.0 IGO. Free for non-commercial use with credit.
  Cite "WHO Global Health Estimates 2021".
- **Coverage:** 183 countries, 6 WHO regions, World Bank income groups and the world,
  by sex, 2000–2021.
- **Files:**
  - `raw/who/C64284DWHOSIS_000002.csv`: HALE, as downloaded
  - `raw/who/90E2E48WHOSIS_000001.csv`: life expectancy, as downloaded
  - `clean/who_le_hale_by_sex.csv`: the two joined, plus years in ill health
    (life expectancy minus HALE) and the share of life spent in ill health

**Caveats:**
- The latest year is 2021, which includes COVID-19 effects. Check the 2019 values
  as well before choosing a headline.
- WHO's own Australian figures differ from AIHW's (WHO 2021: women 13.8 vs men 11.2
  years in ill health; AIHW 2024: 11.7 vs 9.9). Use AIHW for Australia and WHO for
  the global comparison. Never put the two in one chart.
- WHO regions (Africa, Americas, Eastern Mediterranean, Europe, South-East Asia,
  Western Pacific) are not the same as World Bank regions. Pick one set for the
  explorer's region filter and stick to it.

---

## 4. IHME Global Burden of Disease 2023: selected causes (Global and AU)

- **Where from:** GBD Results tool, https://vizhub.healthdata.org/gbd-results/,
  downloaded by Tom on 3 Nov 2026 (three requests: `72c937da`, `f4f0bb18`, `8eb87543`)
- **Cite as:** Global Burden of Disease Collaborative Network. Global Burden of
  Disease Study 2023 (GBD 2023) Results. Seattle, United States: Institute for
  Health Metrics and Evaluation (IHME), 2024. (Wording from the `citation.txt`
  file in the download.)
- **Licence:** free for non-commercial use with credit. **Commercial use needs a
  licence.** Don't use these figures for the FemTech venture without one. Check
  IHME's terms before publishing the raw files in the public repo.
- **Coverage:** Global and Australia, female and male, 1990, 2010 and 2023.
  Five age groupings: all ages, age-standardised, 15–49, 50–69 and 70+. Four
  measures: deaths, DALYs, YLDs and YLLs, as counts and as rates per 100,000.
  Every value comes with a 95% uncertainty range (`lower`/`upper`).
- **Causes (26):**
  - Broad groups: cardiovascular diseases; neoplasms (cancers); mental disorders;
    musculoskeletal disorders; gynaecological diseases; communicable, maternal,
    neonatal and nutritional diseases
  - Heart and stroke: ischaemic heart disease, stroke
  - Cancers: breast, cervical, ovarian, uterine
  - Gynaecological: endometriosis, polycystic ovarian syndrome (PCOS), premenstrual
    syndrome, uterine fibroids, female infertility, genital prolapse, other
    gynaecological diseases
  - Other: Alzheimer's and other dementias, anxiety disorders, depressive disorders,
    migraine, low back pain, osteoarthritis, rheumatoid arthritis
- **Files:**
  - `raw/ihme/72c937da/`, `raw/ihme/f4f0bb18/`, `raw/ihme/8eb87543/`: as downloaded. Your four uploads
    were two pairs of identical files, so one copy of each is kept.
  - `clean/ihme_gbd2023_selected_causes.csv`: all three files combined, in tidy form

**Caveats:**
- Use age-standardised rates when comparing women and men or comparing places.
- Check the uncertainty ranges before claiming a difference. For 2023 YLDs, the
  female and male ranges do **not** overlap for migraine (Global and AU),
  rheumatoid arthritis (Global and AU) and low back pain (AU only). For anxiety,
  depression, osteoarthritis, dementia and global low back pain, women's central
  estimate is higher but the ranges overlap. Describe those as "estimated higher",
  not as a definite gap.
- The estimates for the gynaecological conditions are very small. Uterine fibroids
  in Australia, for example, come to 0.4 YLDs per 100,000. Don't build a headline
  on those numbers without a second source.
- GBD's Australian death counts differ from the ABS figures (e.g. female ischaemic
  heart disease: GBD 2023 estimates 9,315 deaths; ABS recorded 5,965 in 2025). GBD
  reassigns deaths with vague causes on the death certificate. Use ABS for
  Australian death counts and GBD for burden and global comparisons. Never put
  the two in one chart.
- Endometriosis and PCOS figures are low, and endometriosis's rate even falls
  from 1990 to 2023. These estimates depend on diagnosed cases, so they may be
  affected by the very diagnostic delays the site describes. Get that checked
  before using the figures.
- Still missing: maternal disorders as a separate cause. Only the broad group it
  belongs to is in this download.

---

## 5. ClinicalTrials.gov: women's share of trial participants (Global)

- **Where from:** ClinicalTrials.gov API v2, https://clinicaltrials.gov/api/v2/studies
  (data timestamp 2026-11-02), downloaded 3 Nov 2026
- **Licence:** US government public data, free to use. Cite "ClinicalTrials.gov,
  US National Library of Medicine; analysis by Women's Health Gaps".
- **What was selected:** interventional trials that started 2010–2025, were open to
  all sexes, and have posted results with participant counts by sex. Nine
  conditions, searched by condition name. 5,578 trials, about 2.7 million
  participants.
- **Files:**
  - `raw/clinicaltrials/*.json`: API responses, one file per condition
  - `clean/ctgov_trials_sex_by_condition.csv`: one row per trial: female and male
    participants, start year, sponsor type
  - `clean/ctgov_vs_gbd_summary.csv`: per condition: women's share of
    participants (pooled, and in the median trial) vs women's share of global
    DALYs (GBD 2023)

**Caveats:**
- This is our own analysis. Describe it as "our analysis of ClinicalTrials.gov",
  not as a published study. Rivera et al. (JAMA Netw Open 2025) is the
  peer-reviewed reference to cite alongside it.
- Only trials that posted results are included. That's mostly US-regulated trials
  and skews towards industry-funded drug trials.
- Some trials are counted under more than one condition (e.g. depression and
  anxiety).
- The comparison is with women's share of **DALYs** (total health lost). Published
  studies often compare with share of **prevalence** (how many people have the
  condition) instead, so the two methods give different answers. Say which one
  the site uses.
- Very large trials can skew the pooled figure. In low back pain, one trial is 86%
  of all participants, so the median trial is the safer number to quote.
- Pairing ClinicalTrials.gov with GBD here is deliberate: both are global and the
  chart shows the ratio. Label both sources on the chart.

---

## 6. Not collected yet

| Source | Why not | What's needed |
|---|---|---|
| ABS data API | `api.data.abs.gov.au` refused the connection | Not needed for now. The spreadsheets above cover it. |
| AIHW (burden of disease, women's health reports) | `www.aihw.gov.au` returns 403 (the site blocks automated downloads) | Download the files yourself in a browser and upload them here |
| IHME GBD: maternal disorders | Not requested yet | One small GBD Results request (Global + Australia) |
