# La synthèse des gardes jouées sur la v5 (complément 1, étape A) : pour chaque défaut connu du §3, la garde qui le trouve
# et les lignes de la sortie du banc qui le montrent. Écrit sorties/gardes-sur-v5.txt (la synthèse, puis la sortie entière).
#   python3 banc/synthese-gardes.py <sortie du banc, GARDES=seules, sur la v5> sorties/gardes-sur-v5.txt
import re, sys, collections
src, dst = sys.argv[1], sys.argv[2]
txt = open(src, encoding="utf-8").read()
lignes = [re.sub(r"^\d+\. ", "", l) for l in txt.split("\n") if re.match(r"^\d+\. garde", l)]
CONNUS = [
  ("D1 — les écrans de MJPC ne partent pas de l'existant", "garde 1", [r"garde 1\. la scène « m-fiche-eleve »", r"\(de « eleves-codes »\) : structure « secu-encart »", r"\(de « panneau-menu »\) : bouton « 🏠Tableau de bord »", r"garde 1\. la scène « m-taxonomie »"]),
  ("D1 — la taxonomie inventée", "garde 3", [r"garde 3\. m-taxonomie-competences : l'état du référentiel"]),
  ("D2 — des renvois au cadrage à l'écran", "garde 2", [r"garde 2\. c-reglages : « tour N » dans texte", r"garde 2\. c-reglages : un nombre entre parenthèses \(340\)", r"garde 2\. c-evals : « cadrage » dans infobulle", r"garde 2\. c-reglages : « cadrage » dans infobulle"]),
  ("D2 — l'infobulle de « 📖 Mode d'emploi » n'est pas celle de la 7.7.1", "garde 1", [r"garde 1\. c-lancer \(de « console-lancer »\) : l'infobulle de « 📖 Mode d'emploi »"]),
  ("D3 — les limites de longueur se contredisent", "garde 4", [r"garde 4\."]),
  ("D4 — « 👀 Écoute le prof — la correction sera révélée. » a disparu", "garde 1", [r"phrase « 👀 Écoute le prof"]),
  ("D5 — le PDF garde les marques de validation", "garde 2", [r"garde 2\. x632-pdf : « maquette »", r"garde 2\. x632-pdf : « souligné en pointillés »", r"garde 2\. x632-pdf : une marque de validation"]),
  ("D6 — le bloc « 🎯 Ton estimation » ne suit pas com632", "garde 5", [r"garde 5\."]),
]
out = ["Les cinq gardes du complément 1, jouées sur maquette-qcm-v5.html (GARDES=seules node banc/banc.js maquette-qcm-v5.html 5)", ""]
tous_trouves = True
for nom, garde, motifs in CONNUS:
    vus = []
    for m in motifs:
        l = next((x for x in lignes if re.search(m, x)), None)
        if l: vus.append(l)
    ok = len(vus) == len(motifs)
    tous_trouves &= ok
    out.append(("✔ " if ok else "✘ ") + nom + " — trouvé par la " + garde + " (" + str(len(vus)) + " / " + str(len(motifs)) + " signes cherchés)")
    for l in vus: out.append("    " + l[:260])
out.append("")
par = collections.Counter(re.match(r"(garde \d)", l).group(1) for l in lignes)
out.append("Échecs par garde : " + " · ".join(k + " : " + str(par[k]) for k in sorted(par)))
out.append("Chaque défaut connu du §3 est trouvé par sa garde." if tous_trouves else "UN DÉFAUT CONNU N'EST PAS TROUVÉ.")
out += ["", "──────── La sortie entière du banc ────────", "", txt]
open(dst, "w", encoding="utf-8").write("\n".join(out))
print("\n".join(out[:40]))
sys.exit(0 if tous_trouves else 1)
