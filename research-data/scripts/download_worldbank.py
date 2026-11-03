import json, urllib.request, csv, sys, os, datetime
D=sys.argv[1]; ids=sys.argv[2:]
def get(url):
    return json.load(urllib.request.urlopen(url, timeout=120))
meta={}
# countries metadata
c=get("https://api.worldbank.org/v2/country?format=json&per_page=400")
json.dump(c, open(f"{D}/raw/worldbank/countries.json","w"))
with open(f"{D}/clean/wb_countries.csv","w",newline="") as f:
    w=csv.writer(f); w.writerow(["iso3","name","region","income_level","is_aggregate"])
    for r in c[1]:
        w.writerow([r["id"],r["name"],r["region"]["value"].strip(),r["incomeLevel"]["value"],r["region"]["id"]=="NA"])
rows=[]
for i in ids:
    m=get(f"https://api.worldbank.org/v2/indicator/{i}?format=json")[1][0]
    meta[i]={"name":m["name"],"source_db":m["source"]["value"],"source_org":m.get("sourceOrganization"),"note":m.get("sourceNote")}
    d=get(f"https://api.worldbank.org/v2/country/all/indicator/{i}?format=json&per_page=20000&date=1990:2025")
    json.dump(d, open(f"{D}/raw/worldbank/{i}.json","w"))
    n=0
    for r in d[1] or []:
        if r["value"] is None: continue
        rows.append([i,r["countryiso3code"] or r["country"]["id"],r["country"]["value"],r["date"],r["value"]]); n+=1
    print(i, n, "values", "pages", d[0]["pages"])
with open(f"{D}/clean/wb_indicators_long.csv","w",newline="") as f:
    w=csv.writer(f); w.writerow(["indicator","iso3","country","year","value"]); w.writerows(rows)
meta["_retrieved"]=datetime.date.today().isoformat()
json.dump(meta, open(f"{D}/clean/wb_indicator_metadata.json","w"), indent=1)
