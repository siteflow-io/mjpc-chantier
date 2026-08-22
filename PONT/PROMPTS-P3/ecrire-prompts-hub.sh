#!/bin/bash
# P3 — écriture des prompts au hub. À EXÉCUTER À LA PROMOTION DU PONT, PAS AVANT :
# le prompt chapitre v2 produit des JSON à trames que seule la production PROMUE sait jouer.
HUB="https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/site/atelier/prompts"
DIR="$(dirname "$0")"
python3 - << 'PY'
import json,urllib.request,pathlib
HUB="https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app/site/atelier/prompts"
ici=pathlib.Path(__file__).resolve().parent if "__file__" in dir() else pathlib.Path(".")
for prod in ("chapitre","fiche_seance","deroule"):
    t=(ici/f"site-{prod}.txt").read_text(encoding="utf-8") if (ici/f"site-{prod}.txt").exists() else pathlib.Path(f"PONT/PROMPTS-P3/site-{prod}.txt").read_text(encoding="utf-8")
    r=urllib.request.Request(f"{HUB}/{prod}.json",data=json.dumps(t).encode("utf-8"),method="PUT",headers={"Content-Type":"application/json"})
    print(prod,"→",urllib.request.urlopen(r).status)
PY
