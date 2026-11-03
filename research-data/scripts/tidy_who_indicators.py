"""Tidy WHO World Health Statistics downloads into one long CSV.
Download each indicator first from
https://xmart-api-public.who.int/DATA_/RELAY_WHS?$filter=IND_ID eq '<IND_ID>'&$format=csv
Usage: python3 tidy_who_indicators.py RAW_DIR OUTPUT.csv"""
import pandas as pd, glob, os, sys
out = []
for f in sorted(glob.glob(sys.argv[1] + "/*.csv")):
    d = pd.read_csv(f, low_memory=False)
    vcols = [x for x in d.columns if x.endswith("_N") and x != "TEXT_N"]
    d["value"] = d[vcols].bfill(axis=1).iloc[:, 0]
    d["value_type"] = d[vcols].notna().idxmax(axis=1)
    d["lower"] = d[[x + "L" for x in vcols if x + "L" in d]].bfill(axis=1).iloc[:, 0]
    d["upper"] = d[[x + "U" for x in vcols if x + "U" in d]].bfill(axis=1).iloc[:, 0]
    skip = {"DIM_TIME", "DIM_TIME_TYPE", "DIM_GEO_CODE_M49", "DIM_GEO_CODE_TYPE", "DIM_PUBLISH_STATE_CODE", "DIM_SEX"}
    dims = [x for x in d.columns if x.startswith("DIM_") and x not in skip and d[x].notna().any()]
    d["other_dims"] = d[dims].fillna("").astype(str).apply(lambda r: ";".join(f"{k[4:]}={v}" for k, v in r.items() if v), axis=1) if dims else ""
    out.append(d[["IND_CODE", "IND_NAME", "DIM_TIME", "DIM_GEO_CODE_M49", "DIM_GEO_CODE_TYPE", "GEO_NAME_SHORT", "DIM_SEX", "other_dims", "value_type", "value", "lower", "upper"]])
    print(os.path.basename(f), len(d), dims)
a = pd.concat(out)
a.columns = ["indicator", "indicator_name", "year", "m49_code", "geo_type", "area", "sex", "other_dims", "value_type", "value", "lower", "upper"]
a.to_csv(sys.argv[2], index=False)
