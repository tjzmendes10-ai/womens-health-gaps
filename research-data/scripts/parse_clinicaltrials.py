import json, glob, csv, os, sys
rows=[]
for f in sorted(glob.glob(sys.argv[1]+"/*.json")):
    cond=os.path.basename(f)[:-5].replace("_"," ")
    for s in json.load(open(f)):
        b=s.get("resultsSection",{}).get("baselineCharacteristicsModule",{})
        groups=b.get("groups",[]); tot=[g["id"] for g in groups if g.get("title","").strip().lower()=="total"]
        fem=mal=None
        for m in b.get("measures",[]):
            if not m.get("title","").lower().startswith("sex"): continue
            if m.get("paramType")!="COUNT_OF_PARTICIPANTS": continue
            F=M=0; ok=False
            for c in m.get("classes",[]):
                for cat in c.get("categories",[]):
                    t=cat.get("title","").strip().lower()
                    if t not in ("female","male"): continue
                    for meas in cat.get("measurements",[]):
                        if tot and meas.get("groupId") not in tot: continue
                        try: v=float(meas["value"])
                        except: continue
                        ok=True
                        if t=="female": F+=v
                        else: M+=v
            if ok: fem,mal=F,M; break
        if fem is None or fem+mal==0: continue
        ps=s["protocolSection"]
        rows.append([cond,ps["identificationModule"]["nctId"],ps.get("statusModule",{}).get("startDateStruct",{}).get("date","")[:4],ps.get("sponsorCollaboratorsModule",{}).get("leadSponsor",{}).get("class",""),int(fem),int(mal)])
with open(sys.argv[2],"w",newline="") as f:
    w=csv.writer(f); w.writerow(["condition","nct_id","start_year","lead_sponsor_class","female_participants","male_participants"]); w.writerows(rows)
print(len(rows))
