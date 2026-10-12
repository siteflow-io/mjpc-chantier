# La synthèse des gardes 6, 7 et 8 jouées sur la v6 et sur les témoins (complément 2, étape A) : pour chaque défaut connu du §5,
# la garde qui le trouve et les lignes qui le montrent. Écrit sorties/gardes-6-7-8-sur-v6.txt (la synthèse, puis les sorties entières).
#   python3 banc/synthese-gardes2.py <sortie GARDES=c2 sur la v6> <sortie de banc/temoins.js> sorties/gardes-6-7-8-sur-v6.txt
import re, sys
c2, tem, dst = sys.argv[1], sys.argv[2], sys.argv[3]
T = open(c2, encoding="utf-8").read(); W = open(tem, encoding="utf-8").read()
L = [re.sub(r"^\d+\. ", "", l) for l in T.split("\n") if re.match(r"^\d+\. garde", l)]
MENU = ["Tableau de bord", "Classes", "Profil test", "Architecture", "Archives", "Corbeille", "Annonces aux élèves", "Dates de l’année", "Emploi du temps", "Atelier", "Configuration & Firebase", "Présence live", "Code professeur"]
SCENES9 = ["m-classe-exclusions", "m-exclusion-refusee", "m-fiche-eleve", "m-taxonomie", "m-taxonomie-editeur", "m-taxonomie-domaine", "m-taxonomie-notion", "m-taxonomie-competences", "m-taxonomie-competence"]
out = ["Les gardes 6, 7 et 8 du complément 2, jouées sur maquette-qcm-v6.html (GARDES=c2 node banc/banc.js maquette-qcm-v6.html 5) et sur les témoins (node banc/temoins.js maquette-qcm-v6.html)", ""]
ok_tout = True
def bilan(nom, garde, ok, preuves):
    global ok_tout
    ok_tout = ok_tout and ok
    out.append(("✔ " if ok else "✘ ") + nom + " — " + ("trouvé par la " if ok else "PAS trouvé par la ") + garde)
    out.extend("    " + p for p in preuves[:6])
# garde 6 : les 13 boutons du §2, dans les 9 scènes
g6 = [l for l in L if l.startswith("garde 6.")]
trouves = {}
for l in g6:
    m = re.match(r"garde 6\. (\S+) : « (.+?) » \(fermé\)", l)
    nom = m and re.sub(r"^[^\w«]+ ", "", m.group(2))   # sans l'icône du menu
    if m and nom in MENU: trouves.setdefault(nom, set()).add(m.group(1))
attendu = {b: set(SCENES9) if b != "Code professeur" else {"m-classe-exclusions", "m-exclusion-refusee", "m-fiche-eleve"} for b in MENU}
manque = [b + " (" + ", ".join(sorted(attendu[b] - trouves.get(b, set()))) + ")" for b in MENU if not attendu[b] <= trouves.get(b, set())]
bilan("Défaut 7 — les 13 boutons fermés de MJPC (12 entrées du menu et « Code professeur ») ne se voient pas fermés, dans les 9 scènes", "garde 6",
      not manque, ["%d boutons trouvés, dans %d scènes" % (len(trouves), len(set().union(*trouves.values())) if trouves else 0)] + [l for l in g6 if "Tableau de bord" in l][:3] + [l for l in g6 if "Code professeur" in l][:3] + (["manquent : " + "; ".join(manque)] if manque else []))
g87 = [l for l in L if "dette 87" in l]
sc87 = set(re.match(r"garde 7\. (\S+)", l).group(1) for l in g87)
bilan("Dette 87 — le panneau borné à 1 100 px, avec sa marge", "garde 7, partie 1", len(sc87) >= 9 and any("@1920×1080" in l for l in g87), ["%d mesures, dans %d scènes" % (len(g87), len(sc87))] + g87[:3])
g88 = [l for l in L if l.startswith("garde 7.") and "el-row" in l]
bilan("Dette 88 — la grille de la ligne d'élève changée sans raison inscrite", "garde 7, partie 3", bool(g88), g88)
tem88 = [l for l in W.split("\n") if "hors de la carte sur" in l]
bilan("Dette 88 — sur le témoin (la grille d'index.html remise), ↻ ✕ hors de la carte sur chaque ligne", "garde 7, partie 2", len(tem88) == 2 and all("(chaque ligne) ✔" in l for l in tem88), tem88 + [l.strip() for l in W.split("\n") if "sortent de la carte" in l][:2])
tem212 = [l for l in W.split("\n") if "défilement de côté :" in l]
bilan("Rangée de l'emploi du temps (n°12 · 212) — sur le témoin (la vraie rangée), le défilement de côté et des boutons sur plus de deux lignes", "garde 8", bool(tem212) and "oui ✔" in tem212[0] and "lignes : 0" not in tem212[0], tem212 + [l.strip() for l in W.split("\n") if "garde 8." in l][:4])
autres = [l for l in L if l.startswith("garde 6.") and not any(("« " + b + " »") in l or (" " + b + " » (fermé)") in l for b in MENU)]
out += ["", "Ce que les gardes trouvent d'autre sur la v6 (des défauts, corrigés à l'étape B) : %d" % len(autres)] + ["    " + l for l in sorted(set(autres))]
out += ["", "Chaque défaut connu du §5 est trouvé par sa garde." if ok_tout else "UNE GARDE NE TROUVE PAS SON DÉFAUT CONNU.", "", "════════ La sortie du banc (GARDES=c2, v6) ════════", T, "════════ La sortie des témoins ════════", W]
open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")
print("\n".join(out[:40]))
sys.exit(0 if ok_tout else 1)
