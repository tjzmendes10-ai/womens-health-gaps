import json, urllib.request, urllib.parse, sys, time
out=sys.argv[1]
conds={
 "Ischaemic heart disease":"coronary artery disease OR myocardial infarction OR acute coronary syndrome OR ischemic heart disease",
 "Stroke":"stroke",
 "Depressive disorders":"depression OR depressive disorder",
 "Anxiety disorders":"anxiety disorder OR generalized anxiety disorder OR panic disorder",
 "Migraine":"migraine",
 "Rheumatoid arthritis":"rheumatoid arthritis",
 "Osteoarthritis":"osteoarthritis",
 "Low back pain":"low back pain",
 "Alzheimer's disease and other dementias":"alzheimer disease OR dementia",
}
fields="NCTId,Condition,StudyType,EligibilityModule,StartDate,BaselineCharacteristicsModule,LeadSponsorClass"
adv="AREA[HasResults]true AND AREA[StudyType]INTERVENTIONAL AND AREA[Sex]ALL AND AREA[StartDate]RANGE[2010-01-01,2025-12-31]"
for name,q in conds.items():
    studies=[]; tok=None
    while True:
        p={"query.cond":q,"filter.advanced":adv,"fields":fields,"pageSize":1000,"format":"json"}
        if tok: p["pageToken"]=tok
        url="https://clinicaltrials.gov/api/v2/studies?"+urllib.parse.urlencode(p)
        for a in range(4):
            try: d=json.load(urllib.request.urlopen(url,timeout=180)); break
            except Exception as e: print("retry",e); time.sleep(2**a)
        studies+=d.get("studies",[]); tok=d.get("nextPageToken")
        if not tok: break
    json.dump(studies,open(f"{out}/{name.replace(' ','_').replace(chr(39),'')}.json","w"))
    print(name,len(studies),flush=True)
