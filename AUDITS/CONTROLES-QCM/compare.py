# Compare deux relevés (releve.js) : les écrans dont le texte ou l'image a changé, ceux qui ont paru ou disparu,
# et leurs voisins (les écrans qui y mènent et ceux où ils mènent, dans l'une ou l'autre version).
# usage : python3 compare.py <relevé avant> <relevé après> <sortie.txt> [écrans qui devaient changer, séparés par des virgules]
import json, sys, os, difflib
from PIL import Image, ImageChops
A, B, OUT = sys.argv[1:4]
DEVAIENT = [x for x in (sys.argv[4] if len(sys.argv) > 4 else "").split(",") if x]
ta, tb = json.load(open(os.path.join(A, "textes.json"))), json.load(open(os.path.join(B, "textes.json")))
aa, ab = json.load(open(os.path.join(A, "aretes.json"))), json.load(open(os.path.join(B, "aretes.json")))
def img_diff(k):
    try:
        ia, ib = Image.open(os.path.join(A, "img", k + ".png")).convert("RGB"), Image.open(os.path.join(B, "img", k + ".png")).convert("RGB")
    except Exception:
        return None
    if ia.size != ib.size: return 1.0
    d = ImageChops.difference(ia, ib).convert("L").point(lambda v: 255 if v > 24 else 0)
    return sum(d.histogram()[255:]) / (ia.size[0] * ia.size[1])
change, lignes = [], []
for k in sorted(set(ta) | set(tb)):
    if k not in ta: change.append(k); lignes.append("+ paru : " + k); continue
    if k not in tb: change.append(k); lignes.append("- disparu : " + k); continue
    dt = ta[k] != tb[k]; di = img_diff(k)
    if dt or (di is not None and di > 0.0005):
        change.append(k)
        lignes.append("~ changé : " + k + " · texte " + ("changé" if dt else "identique") + " · image " + ("%.2f %%" % (100 * di) if di is not None else "?"))
        if dt:
            for l in difflib.unified_diff(ta[k].split("\n"), tb[k].split("\n"), lineterm="", n=0):
                if l.startswith(("+", "-")) and not l.startswith(("+++", "---")): lignes.append("      " + l[:200])
def base(k): return k.split("@")[0].split("&")[0].split("_")[0]   # les clés du relevé ont « & » remplacé par « _ » ; un id de scène n'a jamais « _ »
chg = set(base(k) for k in change)
voisins = set()
for ar in (aa, ab):
    for k, lst in ar.items():
        src = base(k)
        for _, d in lst:
            if not d: continue
            dst = d.split("&")[0]
            if src in chg and dst not in chg: voisins.add(dst)
            if dst in chg and src not in chg: voisins.add(src)
pas_bouge = [x for x in DEVAIENT if x not in chg]
tete = ["Relevés : %s (%d écrans) contre %s (%d écrans)" % (A, len(ta), B, len(tb)),
        "Écrans changés : %d · scènes touchées : %d · voisins à lire aussi : %d" % (len(change), len(chg), len(voisins)),
        "Devaient changer et n'ont pas bougé : " + (", ".join(pas_bouge) if pas_bouge else "aucun"),
        "Scènes touchées : " + ", ".join(sorted(chg)),
        "Voisins : " + ", ".join(sorted(voisins)), ""]
open(OUT, "w").write("\n".join(tete + lignes) + "\n")
print("\n".join(tete[:3]))
