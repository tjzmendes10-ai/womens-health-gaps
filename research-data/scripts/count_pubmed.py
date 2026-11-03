"""Count PubMed papers per condition (MeSH term), 2015-2024, and save to CSV.
Usage: python3 count_pubmed.py OUTPUT.csv"""
import json, sys, time, urllib.parse, urllib.request, datetime, csv
TERMS = {
    "Endometriosis": '"Endometriosis"[mh]',
    "Polycystic ovarian syndrome": '"Polycystic Ovary Syndrome"[mh]',
    "Premenstrual syndrome": '"Premenstrual Syndrome"[mh]',
    "Uterine fibroids": '"Leiomyoma"[mh] AND "Uterine Neoplasms"[mh]',
    "Female infertility": '"Infertility, Female"[mh]',
    "Genital prolapse": '"Pelvic Organ Prolapse"[mh]',
    "Migraine": '"Migraine Disorders"[mh]',
    "Low back pain": '"Low Back Pain"[mh]',
    "Rheumatoid arthritis": '"Arthritis, Rheumatoid"[mh]',
    "Osteoarthritis": '"Osteoarthritis"[mh]',
    "Depressive disorders": '"Depressive Disorder"[mh]',
    "Anxiety disorders": '"Anxiety Disorders"[mh]',
    "Alzheimer's disease and other dementias": '"Dementia"[mh]',
    "Ischemic heart disease": '"Myocardial Ischemia"[mh]',
    "Stroke": '"Stroke"[mh]',
    "Breast cancer": '"Breast Neoplasms"[mh]',
    "Cervical cancer": '"Uterine Cervical Neoplasms"[mh]',
    "Ovarian cancer": '"Ovarian Neoplasms"[mh]',
    "Uterine cancer": '"Endometrial Neoplasms"[mh]',
}
DATES = ' AND ("2015/01/01"[dp] : "2024/12/31"[dp])'
rows = []
for name, term in TERMS.items():
    q = urllib.parse.urlencode({"db": "pubmed", "term": term + DATES, "rettype": "count", "retmode": "json", "tool": "womens-health-gaps"})
    d = json.load(urllib.request.urlopen("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?" + q, timeout=60))
    rows.append([name, term + DATES, int(d["esearchresult"]["count"]), datetime.date.today().isoformat()])
    print(rows[-1][0], rows[-1][2], flush=True)
    time.sleep(0.5)
with open(sys.argv[1], "w", newline="") as f:
    w = csv.writer(f); w.writerow(["condition", "pubmed_query", "papers_2015_2024", "retrieved"]); w.writerows(rows)
