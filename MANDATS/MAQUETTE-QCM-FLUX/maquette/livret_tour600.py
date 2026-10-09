# Écrit README.md (pour le sas) et livret.html (pour le PDF) à partir des captures, dans l'ordre du flux.
import os, html
D = os.path.dirname(os.path.abspath(__file__))
CAP = sorted(f for f in os.listdir(os.path.join(D, "captures")) if f.endswith(".png"))

SECTIONS = {
 "c-lancer": "Avant l'heure, sur ta console",
 "t-combien": "L'entrée",
 "t-q1-reflexion": "Question 1 — Julien commence",
 "t-q2-reflexion": "Question 2 — Michel commence",
 "t-q3-tour1": "Question 3 — Julien commence",
 "t-estim": "L'estimation",
 "c-corr-q2-avant": "La correction, avec la saisie de la feuille (proposition 360)",
 "t-bilan": "La fin",
 "c-resultats": "Le soir",
 "t-annexe": "Annexe : la demi-tablette (364)",
}
L = {
 "c-lancer": "« Pilotage classe », avant l'heure. Tu choisis la classe et l'évaluation : la durée est comptée tout de suite (58), et les binômes sont proposés d'après le QCM précédent (39, 109). Tu glisses un nom sur un autre pour échanger deux élèves (72). Au premier QCM d'une classe, il n'y a pas de proposition : placement libre.",
 "c-appel": "« 🚀 Lancer la session » ouvre l'appel. Adam est absent : Théo, son binôme, est mis avec Lou, qui était seule (42, 109). L'heure de fin se règle ici (64).",
 "t-combien": "Julien et Michel s'assoient et cliquent sur « 👥 2 élèves » (88). J'ai retiré la phrase de la dictée « Si ton binôme est absent, choisis « 1 élève » » : chez toi, un élève seul choisit aussi 2.",
 "t-login": "Chaque moitié a son clavier (12), et il n'y a plus « Choisis ta classe » (13). Julien tape son code, son prénom et son nom.",
 "t-binome": "Julien est entré : sa moitié passe à l'attestation. L'autre moitié attend son binôme : « Ton binôme : DUVERNAY Michel » (15), comme dans la dictée. Michel tape son code.",
 "t-attest": "L'attestation, sur chaque moitié (234). Tout le texte est provisoire : je l'ai écrit d'après ton message de 14:24 (577), la règle 288 à 290 et le rapprochement (377). Julien a coché ; Michel lit.",
 "t-pret": "Les deux ont coché : ils attendent le départ, avec l'heure de l'attestation, comme dans la dictée.",
 "c-pret": "Ta console avant la question 1 : les 12 tablettes, qui est assis où, et qui a coché (14, 16). Enzo n'a pas coché, Lou n'est pas encore entrée. Le gros bouton : « ▶️ Lancer Q1 ».",
 "t-q1-reflexion": "Réflexion : les deux moitiés montrent l'énoncé sans les choix, et le chrono (20). Chacun écrit sur sa feuille. La pastille dit « 1 pt » (296).",
 "c-q1-reflexion": "Ta console pendant la réflexion. Les deux temps viennent de la question (56). La case « ✋ Réponse », les « Durées des niveaux » et les pastilles pour changer le niveau en direct ont disparu (327). « ✋ Autoriser la réponse » coupe la réflexion.",
 "t-q1-passage1": "Fin de la réflexion : « POSE TON STYLO » sur les deux moitiés (99), et 3 s pour passer la tablette (26). Michel est déjà voilé (98).",
 "t-q1-tour1": "1er tour : Julien répond, dans l'ordre de l'évaluation (74). Les choix n'ont plus de lettre (334, à trancher). Michel ne voit rien.",
 "c-q1-tour1": "Ta console au 1er tour : à la question 1, ce sont les moitiés de gauche qui répondent (25), celles de droite sont voilées. Les couleurs sont celles d'aujourd'hui. « ⏭️ Tour suivant » coupe le tour (327) ; « +5 s » vaut pour le tour en cours.",
 "t-q1-passage2": "Le passage, dans l'autre sens.",
 "t-q1-tour2": "2e tour : Michel répond, avec les choix mélangés : Rome n'est plus à la même place (74, 329). Il clique sur Venise par erreur ; sa feuille dit Rome.",
 "c-q1-tour2": "Ta console au 2e tour : « 🔒 Clore la question ».",
 "t-q1-attente": "Les deux tours sont finis : « Attends la prochaine question », sans aucune réponse affichée (24).",
 "c-q1-close": "Question close. Nouveau : un gros « ▶️ Lancer Q2 ». « 🔓 Rouvrir pour tous » ne rouvre que pour ceux qui n'ont pas répondu, une fois (331, à trancher).",
 "t-q2-reflexion": "Question 2 : deux bonnes réponses, en tout ou rien.",
 "t-q2-tour1": "Alternance (25) : Michel répond le premier. Il clique sur Madrid, Genève et Berlin.",
 "t-q2-tour2": "Julien répond en second, dans un autre ordre : les deux bonnes réponses ont changé de place (329). Sur sa feuille, il a écrit « Madrid » seulement ; au dernier moment, il clique sur Madrid et Berlin.",
 "c-q2-tour2": "Ta console : à la question 2, ce sont les moitiés de gauche qui répondent au 2e tour.",
 "t-q3-tour1": "Julien clique sur 6 ; c'est aussi ce que dit sa feuille.",
 "t-q3-tour2": "Michel voit 4, 10, 8, 6. Il clique sur 10 ; sur sa feuille, il a écrit « 16 pattes ».",
 "c-q3-close": "Dernière question close : « 📊 Lancer l'autoévaluation ».",
 "t-estim": "L'estimation, sur les deux moitiés en même temps, sans voile (32). Les quatre couleurs portent les mots du socle (313, 339, à trancher). Julien a choisi ; Michel choisit.",
 "c-estim": "Ta console pendant l'estimation, avec les mêmes mots.",
 "c-corr-q2-avant": "La correction commence par la question la plus ratée sur les tablettes, comme aujourd'hui : la question 2. Chacun clique d'abord sur ce que dit sa feuille (360). Le temps pour cliquer est le temps de réponse de la question, ici 20 s : orange à la moitié, rouge les 5 dernières secondes (378). « 🔒 Révéler » reste fermé tant qu'il manque un élève présent, et les noms qui manquent sont en rouge. « 🚫 Départ d'un élève » est maintenant visible ici, pour une tablette en panne (379). L'infobulle, ouverte sur la capture, dit que tu commentes après la révélation (381).",
 "t-corr-q2-decl": "« Qu'as-tu écrit sur ta feuille ? » La consigne dit le rapprochement, sans négation (376, 377). Chacun voit les choix dans l'ordre qu'il avait (79), rien n'est prérempli (344), et « Ma feuille ne dit aucun de ces choix » vaut aussi pour une feuille vide (173, 380). Le chrono est orange : 7 s sur 20. Julien a cliqué sur Madrid, ce que dit sa feuille ; Michel pas encore.",
 "t-corr-q2-attente": "Les deux ont cliqué ; ils peuvent encore changer jusqu'à la révélation. Le chrono est rouge : 3 s.",
 "c-corr-q2-apres": "Tous ont cliqué, tu as révélé. Ton Suivi montre le résultat d'après la feuille. Julien et Zoé : « ＋ Trouvée ». Camille : saisie juste, tablette fausse ; elle va dans « À lire sur les feuilles, ce soir » (180, 362).",
 "t-corr-q2-apres": "La tablette corrige d'après la feuille (361). Julien : « ＋ Trouvée au dernier moment » en vert ; sa feuille est fausse, donc il barre en rouge et écrit en vert. Michel : faux.",
 "t-corr-q3-decl": "Question 3 : Julien clique sur 6 ; Michel clique sur « Ma feuille ne dit aucun de ces choix ». Le chrono est vert : 11 s sur 15.",
 "c-corr-q3-apres": "Après la révélation : Michel « aucun de ces choix », Lou « saisie juste, tablette fausse », Théo « Trouvée ». Plus personne n'est sans saisie : la révélation attend que tous aient cliqué (378).",
 "t-corr-q3-apres": "Julien et Michel ont faux. Le compteur se remplit d'après la feuille.",
 "t-corr-q1-apres": "Question 1 : juste pour les deux, d'après leur feuille. Michel avait cliqué sur Venise, mais sa feuille dit Rome : il a son point, et tu le vérifieras sur sa feuille (180).",
 "c-corr-q1-apres": "Dernière question : « Question suivante → » mène au bilan, comme aujourd'hui.",
 "t-bilan": "La note s'affiche à la fin (223). Julien : 2/3, 13,3/20 ; Michel : 1/3, 6,7/20. Chaque question dit sa ou ses compétences, et chaque compétence dit les questions qui font son niveau, par exemple « Q2 ＋ · Q3 ✗ → 1/2 » (382, 383). Puis l'estimation comparée. J'ai retiré le bloc « Par rapport à la classe » d'aujourd'hui : il ne tient pas sur une demi-tablette.",
 "c-bilan": "Ton bilan de classe : la répartition de la note, puis la répartition par compétence (383), et les feuilles à lire ce soir. Le tableau donne, pour chaque élève, la note et le niveau de chaque compétence, avec ses questions. Puis « 🛑 Terminer la session ».",
 "t-fin": "Tu as terminé : la tablette oublie ses deux élèves et revient à « Combien êtes-vous ? » (64).",
 "c-resultats": "Données → Résultats : ✓, ✗ ou ＋ par question, sans lettre (334), la note et sa maîtrise, puis une colonne par compétence : l'en-tête dit ses questions, chaque case donne le niveau et les questions qui le font (383). « À lire sur la feuille » est à droite (351, 362). C'est ce tableau que sort « 📄 PDF notes et compétences », à créer (310, 318).",
 "c-fiche": "La fiche de Michel : pour chaque question, ses compétences, sa feuille, sa tablette, la bonne réponse et les points ; en bas, ses deux compétences, avec les questions qui font chaque niveau.",
 "c-que-dit-la-feuille": "Tu lis sa feuille : « 16 pattes ». « Que dit la feuille ? » (168, 174, 338) : tu laisses « Aucun des choix », ou tu cliques sur ce qu'elle dit.",
 "t-annexe": "Ta vraie question 3 de demain (6 choix longs), sur une demi-tablette. En une colonne, elle tient dans l'écran : la carte s'arrête à 733 px sur 800, avec des choix en 14,7 px au lieu de 16.",
}
INTRO = [
 ("Ce que c'est", "La séance entière, telle qu'elle est cadrée au 08/10 au soir, pour un binôme : Julien ABRIAL à gauche, Michel DUVERNAY à droite, sur une évaluation inventée de 3 questions, en tout ou rien. Les écrans de ta console sont pris au même moment, avec la classe de la fausse classe (« 3 ESSAI », 24 présents, Adam absent). C'est une maquette à part, construite sur le CSS de l'app 7.7.1 : rien n'est codé dans l'app."),
 ("Comment lire", "Les tablettes sont en 1280 × 800, l'écran entier. La console est en 1440 de large, toute la page. Tout texte vu par l'élève souligné en pointillés orange est provisoire : ce sont des mots que tu n'as pas encore donnés. Toute la console est une proposition (73), à corriger sur ces captures."),
 ("Montré sans être tranché", "La saisie dans la correction (360), les choix sans lettre (334), les mots du socle et l'estimation sur la même échelle (313, 339), les temps et « Tour suivant » (327), la réouverture (331), les binômes d'après le QCM précédent (323), l'heure de fin (64), le + vert sur la seule question qui compte (332). Retenus au tour 600 : 375 à 384 (« clique », le rapprochement, la saisie forcée, les compétences fines)."),
 ("Les deux feuilles", "Julien : Q1 « Rome » (juste), Q2 « Madrid » seulement (faux, mais il clique sur Madrid et Berlin : Trouvée au dernier moment), Q3 « 6 » (faux). Michel : Q1 « Rome » (juste, mais il clique sur Venise), Q2 « Madrid, Genève, Berlin » (faux), Q3 « 16 pattes » (aucun de ces choix)."),
]
PROV = [
 "L'attestation : les six phrases et le bouton « Je commence » (captures 5 et 6).",
 "« Qu'as-tu écrit sur ta feuille ? » et « Clique sur le ou les choix qui disent la même chose que ta feuille. Les mots ne sont pas forcément les mêmes : c'est à toi de faire le rapprochement. » (capture 29).",
 "« Ma feuille ne dit aucun de ces choix » (captures 29 et 33).",
 "Sous « Trouvée au dernier moment » : « Ta feuille disait autre chose, mais tu as cliqué sur la bonne réponse : la question compte. Cela n'arrive qu'une fois par évaluation. », puis « Sur la tablette, tu avais cliqué sur : … » (capture 32).",
 "Le bilan : « Ta note : », « Question par question », « juste », « faux », « ta feuille ne dit aucun de ces choix », « → 1 point », « Tes compétences » ; sous chaque question et chaque compétence, les libellés du hub coupés et les questions (capture 38).",
 "Les mots du socle sous les quatre couleurs (captures 26 et 38).",
 "Si 334 est retenu, une phrase d'aujourd'hui parle encore de lettres : « 💡 Clique sur la (ou les) lettre(s) qui correspond(ent) à ta réponse ». Elle n'apparaît pas sur ces captures, mais elle est à redonner.",
]

def idde(f): return f[3:-4]
def numde(f): return int(f[:2])

# ── README.md
md = ["# Le flux en classe, pour un binôme — maquette du QCM (tour 598)", "",
      "*Conscience n°12, 08/10/2026, mise à jour au tour 600 (points 375 à 384). Demande de Paul (tour 598) : « je veux toutes les captures d'écran de ce que ça donne pour deux élèves en binôme, tout au long de la séance. pour ne pas multiplier les captures, on part sur une évaluation de 3 questions bidons. et je veux mes cpatures de console. et je veux que ce soit dans l'ordre du flux. »*", "",
      "Le même contenu en un seul PDF : [LIVRET-FLUX-BINOME.pdf](LIVRET-FLUX-BINOME.pdf).", ""]
for t, x in INTRO: md += ["**" + t + ".** " + x, ""]
md += ["**Les textes provisoires, à remplacer par tes mots.**", ""]
for i, x in enumerate(PROV): md += [str(i+1) + ". " + x]
md += [""]
for f in CAP:
    i = idde(f)
    if i in SECTIONS: md += ["---", "", "## " + SECTIONS[i], ""]
    quoi = "Tablette" if i.startswith("t-") else "Console"
    md += ["**Capture " + str(numde(f)) + " — " + quoi + ".** " + L[i], "", "![Capture " + str(numde(f)) + "](captures/" + f + ")", ""]
md += ["---", "", "## Pour rejouer", "", "La maquette est dans `maquette/` : `maquette.html` s'ouvre dans un navigateur (`#scene=t-q1-tour1`, par exemple), et `capture.js` refait toutes les captures avec Playwright, qu'il prend dans `../banc/node_modules` (celui du banc de la fausse classe, https://github.com/siteflow-io/mjpc-chantier/tree/main/AUDITS/QCM-FAUSSE-CLASSE-3E-08-10/banc, après `npm install`). La version du tour 598 reste dans `maquette_tour598.js` et `maquette_tour598.css`. Elle repose sur le CSS de `evaluation-qcm.html` 7.7.1, recopié tel quel, et sur React 17 en local.", ""]
open(os.path.join(D, "README.md"), "w", encoding="utf-8").write("\n".join(md))

# ── livret.html (une capture par page, A4 paysage)
e = html.escape
pages = []
intro = "".join("<p><b>" + e(t) + ".</b> " + e(x) + "</p>" for t, x in INTRO)
prov = "<p><b>Les textes provisoires, à remplacer par tes mots.</b></p><ol>" + "".join("<li>" + e(x) + "</li>" for x in PROV) + "</ol>"
pages.append('<section class="pg intro"><h1>Le flux en classe, pour un binôme</h1><div class="sous">Maquette du QCM — conscience n°12 — 08/10/2026, mise à jour du tour 600 — 44 captures, dans l\'ordre de la séance</div>' + intro + prov + "</section>")
for f in CAP:
    i = idde(f)
    sec = SECTIONS.get(i)
    quoi = "Tablette" if i.startswith("t-") else "Console"
    pages.append('<section class="pg">' + ('<div class="sec">' + e(sec) + '</div>' if sec else '<div class="sec vide">&nbsp;</div>') +
                 '<div class="cap"><b>Capture ' + str(numde(f)) + ' — ' + quoi + '.</b> ' + e(L[i]) + '</div>' +
                 '<div class="img"><img src="captures/' + f + '"></div></section>')
H = """<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Livret flux binôme</title><style>
@page{size:A4 landscape;margin:9mm 10mm}
*{box-sizing:border-box}
body{margin:0;font-family:'Trebuchet MS',Verdana,sans-serif;color:#1A1A2E}
.pg{page-break-after:always;height:190mm;display:flex;flex-direction:column}
.pg:last-child{page-break-after:auto}
.intro h1{color:#6A4CE0;margin:0 0 2mm;font-size:22pt}
.intro .sous{color:#64748B;margin-bottom:5mm}
.intro p,.intro li{font-size:10.5pt;line-height:1.45;margin:0 0 2.5mm}
.intro ol{margin:0;padding-left:6mm}
.sec{font-size:13pt;font-weight:900;color:#6A4CE0;margin-bottom:1.5mm}
.sec.vide{font-size:6pt}
.cap{font-size:10.5pt;line-height:1.4;margin-bottom:2.5mm}
.img{flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-start}
.img img{max-width:100%;max-height:100%;object-fit:contain;border:1px solid #CBD5E1;border-radius:4px}
</style></head><body>""" + "".join(pages) + "</body></html>"
open(os.path.join(D, "livret.html"), "w", encoding="utf-8").write(H)
print(len(CAP), "captures ;", len(md), "lignes de README")
