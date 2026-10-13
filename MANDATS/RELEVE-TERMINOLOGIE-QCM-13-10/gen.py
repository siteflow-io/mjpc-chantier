# Le relevé en Markdown, à partir de table.json (table.py)
import json
T = json.load(open("table.json"))
def coupe(t, plein):
    t = t.strip()
    if t == plein.strip(): return t
    m = t.split(" ")
    if not plein.strip().startswith(t) and len(m) > 2: m = m[1:]
    if not plein.strip().endswith(t) and len(m) > 2: m = m[:-1]
    return ("… " if not plein.strip().startswith(" ".join(m)) else "") + " ".join(m) + (" …" if not plein.strip().endswith(" ".join(m)) else "")
P = {
 "Le papier de l'élève": "1119 : « feuille » pour le papier, partout ; « copie » seulement dans « Rendre les copies » ; « dupliquer » pour le double d'une évaluation (c'est déjà son bouton, « 📋 Dupliquer ») ; ma maquette devient « 📄 Lire les feuilles ».",
 "Ce que l'élève fait sur la tablette": "1120 : le nom « clic » disparaît partout, on dit « sa réponse sur la tablette » ; le geste reste « cliquer ». « Toucher » n'apparaît que dans « toucher à une classe » (l'infobulle du mode test et celles du panneau des classes), jamais pour le geste.",
 "Celui qui lit": "1121 : « binôme » pour la paire (la grille, « Binômes proposés »), le prénom ou « ton voisin » pour la personne. « Lecteur » n'apparaît que dans l'intitulé d'une compétence (« devenir un lecteur autonome »).",
 "Ce que l'élève dit de sa feuille": "1105, 1115 et 1116 : la phrase de Paul (« Tom, tu as répondu Venise sur la tablette : avais-tu bien écrit … sur ta feuille ? »), et les lignes du soir, de 1111 à 1114.",
 "Le soir": "1122 : « à lire » partout (« ⚠️ À relire » et « 📌 Je relis ce soir » disent le même geste que « 📌 À lire sur les feuilles, ce soir »).",
 "Le désaccord": "1123 : « désaccord » des deux côtés (l'élève le lit déjà : « ☝️ Un désaccord, c'est sérieux »), et « réglé » au lieu de « tranché ».",
 "L'engagement avant": "1124 : « les consignes » sur la console ; l'élève lit « Avant de commencer » et « Avant la correction », jamais « attestation » (0 écran côté élèves).",
 "Ce qu'on fait passer": "1124 : « évaluation » partout, jamais « éval » ; « séance » pour une passation avec une classe.",
}
OK = {"La tablette partagée": "Rien à changer : « moitié » n'est jamais vu par l'élève.",
      "Les moments": "Rien à changer ; « recopie » n'est vu nulle part.",
      "Ce qu'on tire d'une question": "Rien à changer : « écarter » (pas encore posée) et « annuler » (posée, puis annulée) sont deux gestes différents (cadrage, 442).",
      "Redonner du temps": "Rien à changer : « 1er tour » et « 2e tour » sont les deux moitiés ; « rouvrir » et « relancer le chrono » ont chacun un seul sens.",
      "La note": "« Score » (1 écran, l'infobulle de l'estimation) devient « note ».",
      "Donner les résultats": "Rien à changer : « publiée » est la coche de « Mes évaluations », « masquées » l'état des copies rendues.",
      "Le professeur, vu par l'élève": "Rien à changer."}
L = ["# Relevé de la terminologie du QCM — conscience n°12, 13/10/2026 (tour 716)", "",
 "Paul, 16:42 : « et oui, le mot, et d'ailleurs LES mots: fais un relevé de la terminologie. »", "",
 "## Comment c'est relevé", "",
 "- **Les écrans** : les 169 écrans de la maquette v9 (`LIVRAISONS/CODE-QCM/banc/reference/maquette-v9.json` sur `code-qcm`, le relevé de QCM-4 : le texte, les boutons et les infobulles de chaque écran ; la 8.0.0 est le code de cette maquette), et les 26 écrans de l'app 8.0.0 relevés par QCM-4 pendant l'assemblage de 13:12 (`LIVRAISONS/CODE-QCM/sorties/2026-10-13_1312/releves-branches.json`).",
 "- **Les côtés** : « console » = la console et le téléphone (ce que Paul voit) ; « élèves » = la tablette, l'écran de l'élève et la vue tableau (ce que la classe voit).",
 "- **Le compte** : le nombre d'écrans où le mot paraît au moins une fois, sans accents ni majuscules. Un même texte répété d'écran en écran (une infobulle de la barre du haut) compte une fois par écran.",
 "- **Ce qui n'y est pas** : les écrans que ni la maquette ni le relevé de l'app n'atteignent. Je ne sais pas s'il y en a qui emploient d'autres mots.",
 "- **Rejouer** : `python3 table.py && python3 gen.py` dans ce dossier (le chemin `W` de `corpus.py` pointe vers une copie de `code-qcm`).", ""]
for c in T:
    L += ["## " + c["concept"], "", "| Mot | Écrans console | Écrans élèves | Exemple |", "| --- | ---: | ---: | --- |"]
    for r in c["rows"]:
        ex = r["exL"] if r["eleves"] else r["exP"]
        e = ("« " + coupe(ex[1], ex[3] if len(ex) > 3 else ex[1]).replace("|", "/") + " » (`" + ex[0] + "`, " + ("élèves" if r["eleves"] else "console") + ")") if ex else "—"
        L.append("| " + r["variante"] + " | " + str(r["paul"]) + " | " + str(r["eleves"]) + " | " + e + " |")
    L += ["", ("**Proposition** : " + P[c["concept"]]) if c["concept"] in P else ("**Constat** : " + OK.get(c["concept"], "Rien à changer.")), ""]
L += ["## Les phrases abstraites que Paul a relevées (16:19)", "",
 "« disait son clic » : 28 écrans de la console, aucun côté élèves. « la même chose que son clic » : 40 écrans de la console, 5 côté élèves. « dire si sa feuille… » : 58 écrans de la console, 2 côté élèves. Les lignes à lire du soir viennent d'un seul endroit du code (`S.aLireSeance`, `live/base.js` l. 368-399) ; les infobulles des cartes, de `c3-bulles.js` (l. 34, 49-51) ; la question de l'élève, de `c3-tablettes.js` (l. 386).", ""]
open("README.md", "w").write("\n".join(L) + "\n")
