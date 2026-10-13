import sys, json; sys.path.insert(0, ".")
from releve import cherche
C = [
 ("Le papier de l'élève", [("feuille", r"\bfeuilles?\b"), ("copie", r"\bcopies?\b"), ("papier", r"\bpapiers?\b")]),
 ("Ce que l'élève fait sur la tablette", [("clic (nom)", r"\b(ton|son|tes|ses|leur|leurs|du|le|les|un) clics?\b"), ("réponse (ta, sa, leur)", r"\b(ta|sa|leur) reponse\b"), ("choix (nom)", r"\b(ton|son|tes|ses|leur|leurs) choix\b"), ("cliquer", r"\bcliqu\w*\b"), ("toucher", r"\btouch\w*\b"), ("répondre", r"\brepond\w*\b")]),
 ("Ce que fait le voisin", [("lire / lecture", r"\b(lire|lecture|lectures|lu|lue|lus|lues|lis|lit|lisent)\b"), ("relire / relecture", r"\b(relire|relis|relit|relu|relue|relecture)\b"), ("vérifier", r"\bverifi\w*\b")]),
 ("Celui qui lit", [("voisin", r"\bvoisin\w*\b"), ("binôme", r"\bbinomes?\b"), ("camarade", r"\bcamarades?\b"), ("lecteur", r"\blect(eur|rice)s?\b"), ("partenaire", r"\bpartenaires?\b")]),
 ("Ce que l'élève dit de sa feuille", [("« dire si sa feuille… »", r"\b(dit|dis|dire|disent) si (sa|ta|leur) feuille\b"), ("« la même chose que son clic »", r"\bla meme chose que (son|ton|leur) clic\b"), ("« disait son clic »", r"\bdisait (son|ton) clic\b"), ("déclarer", r"\bdeclar\w*\b")]),
 ("La tablette partagée", [("moitié", r"\bmoities?\b"), ("tablette", r"\btablettes?\b"), ("place", r"\bplaces?\b")]),
 ("Ce qu'on fait passer", [("évaluation", r"\bevaluations?\b"), ("éval", r"\bevals?\b"), ("QCM", r"\bqcm\b"), ("séance", r"\bseances?\b"), ("interro", r"\binterros?\b"), ("contrôle", r"\bcontrole\b"), ("devoir", r"\bdevoirs?\b")]),
 ("Les moments", [("réflexion", r"\breflexion\b"), ("réponse (le moment)", r"\b(la|en|de) reponse\b"), ("correction", r"\bcorrection\b"), ("co-évaluation", r"\bco-?evaluation\b"), ("bilan", r"\bbilans?\b"), ("révéler", r"\brevel\w*\b"), ("recopie", r"\brecopi\w*\b")]),
 ("Ce qu'on tire d'une question", [("écarter", r"\becart\w*\b"), ("annuler (une question)", r"\b(question|questions) annulees?\b|\bannuler la question\b"), ("neutraliser", r"\bneutralis\w*\b")]),
 ("Redonner du temps", [("rouvrir", r"\b(rouvr\w*|reouverture)\b"), ("1er / 2e tour", r"\b(1er|2e) tour\b"), ("tour suivant", r"\btour suivant\b"), ("relancer", r"\brelanc\w*\b")]),
 ("L'engagement avant", [("attestation", r"\battestations?\b"), ("« je m'engage »", r"\bje m'engage\b|\bengagement\w*\b")]),
 ("Le désaccord", [("alerte", r"\balertes?\b"), ("désaccord", r"\bdesaccords?\b"), ("trancher", r"\btranch\w*\b"), ("signaler", r"\bsignal\w*\b"), ("litige", r"\blitiges?\b"), ("contester", r"\bcontest\w*\b")]),
 ("Le soir", [("à lire", r"\ba lire\b"), ("à relire", r"\ba relire\b"), ("à vérifier", r"\ba verifier\b")]),
 ("La note", [("note", r"\bnotes?\b"), ("point(s)", r"\bpoints?\b"), ("score", r"\bscores?\b"), ("résultat(s)", r"\bresultats?\b")]),
 ("Donner les résultats", [("rendre (les copies)", r"\brend\w*\b"), ("publier", r"\bpubli\w*\b"), ("masquer", r"\bmasqu\w*\b")]),
 ("Le professeur, vu par l'élève", [("professeur / prof", r"\b(professeur|prof)\b"), ("M. Meney", r"\bm\. meney\b|\bmeney\b")]),
]
out = []
for titre, vs in C:
    rows = []
    for nom, p in vs:
        ecr, ex = cherche(p, ctx=80, nex=1)
        P = set().union(*[v for (c, w), v in ecr.items() if c == "Paul"]) if any(c == "Paul" for c, w in ecr) else set()
        L = set().union(*[v for (c, w), v in ecr.items() if c == "élèves"]) if any(c == "élèves" for c, w in ecr) else set()
        exP = next((x for (c, w), xs in ex.items() if c == "Paul" for x in xs), None); exL = next((x for (c, w), xs in ex.items() if c == "élèves" for x in xs), None)
        rows.append({"variante": nom, "paul": len(P), "eleves": len(L), "exP": exP, "exL": exL})
    out.append({"concept": titre, "rows": rows})
json.dump(out, open("table.json", "w"), ensure_ascii=False, indent=1)
for c in out:
    print("\n##", c["concept"])
    for r in c["rows"]: print("  ", r["variante"], "| Paul", r["paul"], "| élèves", r["eleves"], "|", (r["exL"] or ["", ""])[1][:110] if r["eleves"] else (r["exP"] or ["", ""])[1][:110])
