#!/usr/bin/env python3
# Génère les deux documents papier du procès : grille d'oral (une page par classe)
# et fiches d'évaluation du dossier (deux fiches par A4, une par groupe).
import json, html, sys, os

UP = "/mnt/user-data/uploads/Chapitre sur la ville de paris, le procès/Séance 6, je cherche mes preuves/"
OUT = os.path.dirname(os.path.abspath(__file__))
FONTS = "/tmp/claude-0/-home-claude/bba5caa8-ef11-5d6d-b339-0c3da0ce644c/scratchpad/banc/node_modules/@fontsource/eb-garamond/files/"

CAMPS = {
    # Hugo 6 à 10 : Paul ne connaît plus leurs numéros (5/11) ; camp laissé en blanc
    "Hugo":   {1: "L", 2: "L", 3: "L", 4: "O", 5: "L", 6: None, 7: None, 8: None, 9: None, 10: None},
    "Turing": {1: "L", 2: "O", 3: "L", 4: "O", 5: "L", 6: "O", 7: "O", 8: "O", 9: "L", 10: "L"},
}
CAMP_MOT = {"L": "Défense", "O": "Accusation", None: "Camp : …………"}

AUTO = {}
def groupes(fichier, classe):
    d = json.load(open(UP + fichier, encoding="utf-8"))
    for g in d["groupes"]:
        for el in g["eleves"]:
            AUTO[(classe, el["prenom"])] = None if el.get("absent") else el.get("autonomie")
    return {g["numero"]: [el["prenom"] for el in g["eleves"]] for g in d["groupes"]}

def point_autonomie(niveau):
    # niveau 3 ou 4 : 1 point ; 2 : 0,5 ; 1 ou 0 : 0 (point 154, 4/11)
    if niveau is None: return None
    return "1" if niveau >= 3 else ("0,5" if niveau == 2 else "0")

G = {
    "Turing": groupes("Point-groupes-4e-Turing-2026-10-13-11h19.json", "Turing"),
    "Hugo": groupes("Point-groupes-4e-Hugo-2026-10-14-08h09.json", "Hugo"),
}
# Hugo, groupes 6 à 10 : donnés de tête par Paul le 5/11 (09:29 et 09:33), numérotés dans son ordre
for n, noms in zip(range(6, 11), [["Amauri", "Jules P.", "Gabin"], ["Anna", "Elya", "Candice"],
                                   ["Axel", "Nawel", "Lucas"], ["Evan", "Maël", "Nolan"], ["Camille", "Jules G.", "Tom"]]):
    G["Hugo"][n] = noms
LISTE_HUGO = ['Adèle','Amauri','Anna','Avah','Axel','Camille','Candice','Chloé','Elya','Evan','Gabin','Heidi',
              'Hortense','Jules G.','Jules P.','Lisa B.','Lisa O.','Lola','Lou','Lucas','Maël','Mélinda','Nawel',
              'Nina','Nolan','Philippine','Thais','Tom','Zoé','Zélie']
places = {p for g in G["Hugo"].values() for p in g}
NON_PLACES_HUGO = [p for p in LISTE_HUGO if p not in places]

ORAL = [
    ("Posture", "Silence", "Attend le silence avant de commencer."),
    ("Posture", "Face aux jurés", "Face aux jurés, pas face au juge."),
    ("Posture", "Yeux levés", "Lève les yeux vers les jurés à chaque fin de phrase."),
    ("Posture", "Voix au fond", "On l’entend du fond de la salle."),
    ("Fluidité", "Sans hésiter", "Aucune hésitation, aucune phrase reprise."),
    ("Fluidité", "Arrêt aux points", "Un arrêt à chaque point."),
    ("Fluidité", "Citation lente", "Ralentit sur la citation."),
    ("Conviction", "Connecteurs", "Appuie sur les connecteurs."),
    ("Conviction", "Citation", "Appuie sur la citation."),
    ("Conviction", "Ton varié", "Le ton varie : pas une récitation."),
]

DOSSIER = [
    ("Pièces", "La n°1 est complète : le soulignement est fait."),
    ("", "La n°2 (Bel-Ami) est complète."),
    ("", "Au moins trois textes (T) sont complets."),
    ("", "Au moins deux preuves (P) sont complètes."),
    ("", "La n°3 a son tableau rempli : trois arguments, leurs preuves, leurs connecteurs."),
    ("", "La n°3 a ses trois cases de vérification cochées."),
    ("Tenue du dossier", "Toutes les pièces faites sont dans l’enveloppe."),
    ("Niveau général", "Langue"),
    ("", "Qualité des réponses"),
    ("Point en classe", "Autonomie de chacun"),
]

def e(s): return html.escape(s)

def fontes():
    out = []
    for w in (400, 600, 700):
        for s in ("normal", "italic"):
            out.append(f"@font-face{{font-family:'EB Garamond';font-weight:{w};font-style:{s};"
                       f"src:url('file://{FONTS}eb-garamond-latin-{w}-{s}.woff2') format('woff2');}}")
    return "\n".join(out)

BASE_CSS = fontes() + """
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'EB Garamond',Georgia,serif;color:#111;background:#fff}
h1{font-size:15pt;font-weight:700}
.sous{font-style:italic;font-size:10.5pt;color:#333}
table{border-collapse:collapse;width:100%}
th,td{border:0.6pt solid #444}
"""

def page_oral(classe):
    camps = CAMPS[classe]
    lignes = []
    for n in range(1, 11):
        noms = G[classe].get(n)
        if not noms:
            noms = ["", "", ""]
        for i, nom in enumerate(noms):
            premier = i == 0
            cls = ' class="g1"' if premier else ''
            gr = f'<td class="gr" rowspan="{len(noms)}">{n}</td><td class="camp" rowspan="{len(noms)}">{CAMP_MOT[camps[n]]}</td>' if premier else ''
            cases = "".join('<td class="c"></td>' for _ in ORAL)
            lignes.append(f'<tr{cls}>{gr}<td class="nom">{e(nom)}</td><td class="c tout"></td>{cases}<td class="tot"></td></tr>')
    ent1 = '<th rowspan="2" class="gr">Gr.</th><th rowspan="2" class="camp">Camp</th><th rowspan="2" class="nom">Élève</th><th rowspan="2" class="tout">Toute sa plai&shy;doirie</th>'
    fam = []
    for f in ("Posture", "Fluidité", "Conviction"):
        k = sum(1 for o in ORAL if o[0] == f)
        fam.append(f'<th colspan="{k}" class="fam">{f}</th>')
    ent1 += "".join(fam) + '<th rowspan="2" class="tot">/10</th>'
    ent2 = "".join(f'<th class="c">{i+1}<br><span>{e(o[1])}</span></th>' for i, o in enumerate(ORAL))
    legende = " · ".join(f"<b>{i+1}</b> {e(o[2])}" for i, o in enumerate(ORAL))
    np = ""
    if classe == "Hugo" and NON_PLACES_HUGO:
        np = (f'<p class="np">Groupes 6 à 10 à compléter. Élèves à placer : '
              f'{e(", ".join(NON_PLACES_HUGO))}.</p>')
    return f"""<section class="page">
<h1>Paris à la barre — l’oral de la plaidoirie — 4e {classe}</h1>
<p class="sous">{"Vendredi 6 novembre" if classe == "Turing" else "Mardi 10 novembre"}</p>
<table class="oral"><thead><tr>{ent1}</tr><tr>{ent2}</tr></thead><tbody>{''.join(lignes)}</tbody></table>
<p class="leg">{legende}</p>{np}
</section>"""

def fiche_dossier(classe, n):
    camps = CAMPS[classe]
    noms = G[classe].get(n)
    noms_txt = e(", ".join(noms)) if noms else "……………………………………………………………………"
    ROWSPAN = {"Pièces": 6, "Tenue du dossier": 1, "Niveau général": 2, "Point en classe": 1}
    NIV = '<span class="niv">☐ 0</span><span class="niv">☐ 0,5</span><span class="niv">☐ 1</span>'
    lignes = []
    for i, (bloc, fait) in enumerate(DOSSIER):
        b = f'<td class="bloc" rowspan="{ROWSPAN[bloc]}">{bloc}</td>' if bloc else ""
        if bloc == "Point en classe":
            elts = []
            for nom in (noms or ["…………", "…………", "…………"]):
                pt = point_autonomie(AUTO.get((classe, nom)))
                elts.append(f'<span class="el"><b>{e(nom)}</b> {pt}</span>' if pt is not None
                            else f'<span class="el"><b>{e(nom)}</b> ☐ 0 ☐ 0,5 ☐ 1</span>')
            lignes.append(f'<tr>{b}<td class="n">{i+1}</td><td class="fait"><b class="lab">{e(fait)}</b><br>{"".join(elts)}</td><td class="pt">par élève</td></tr>')
        elif i >= 7:
            lignes.append(f'<tr>{b}<td class="n">{i+1}</td><td class="fait"><b class="lab">{e(fait)}</b>{NIV}</td><td class="pt"></td></tr>')
        else:
            lignes.append(f'<tr>{b}<td class="n">{i+1}</td><td class="fait">{e(fait)}</td><td class="pt"></td></tr>')
    notes = "".join(f'<span class="nel">{e(nom)} : ……… / 10</span>' for nom in (noms or ["…………", "…………", "…………"]))
    return f"""<div class="fiche">
<div class="tete"><h1>Paris à la barre — le dossier</h1><div class="note">Groupe ……… / 9</div></div>
<p class="id"><b>4e {classe} · groupe {n}</b> · {CAMP_MOT[camps[n]]} · {noms_txt}</p>
<table class="dos"><thead><tr><th></th><th></th><th class="fait">Ce qui est vérifié</th><th class="pt">Points</th></tr></thead>
<tbody>{''.join(lignes)}</tbody></table>
<p class="notes">{notes}</p>
</div>"""

def doc_oral():
    css = BASE_CSS + """
@page{size:A4 landscape;margin:8mm 10mm 7mm}
.page{page-break-after:always}
.page:last-child{page-break-after:auto}
h1{margin-bottom:1mm}
.sous{margin-bottom:2.5mm}
table.oral{table-layout:fixed;font-size:10pt}
table.oral th{background:#efeae0;font-weight:600;font-size:8.6pt;line-height:1.05;padding:1mm 0.5mm;text-align:center;vertical-align:middle}
table.oral th span{font-weight:400;font-size:7.6pt}
table.oral th.fam{font-size:9.5pt;letter-spacing:.3pt}
table.oral tbody tr{height:4.75mm}
table.oral td{height:4.75mm;line-height:1;padding:0 1.2mm;vertical-align:middle}
th.gr,td.gr{width:9mm;text-align:center;font-weight:700}
th.camp,td.camp{width:20mm;font-size:8.6pt;text-align:center}
th.nom,td.nom{width:30mm}
th.tout,td.tout{width:15mm}
th.tot,td.tot{width:13mm}
tr.g1 td{border-top:1.6pt solid #111}
td.c{background:#fff}
.leg{font-size:8.6pt;margin-top:2mm;line-height:1.3}
.np{font-size:9pt;margin-top:1.5mm;font-style:italic}
"""
    body = page_oral("Hugo") + page_oral("Turing")
    return f"<!doctype html><html lang=fr><head><meta charset=utf-8><style>{css}</style></head><body>{body}</body></html>"

def doc_dossier():
    css = BASE_CSS + """
@page{size:A4 portrait;margin:0}
.feuille{width:210mm;height:297mm;page-break-after:always;display:flex;flex-direction:column}
.feuille:last-child{page-break-after:auto}
.fiche{height:148.5mm;padding:11mm 14mm 8mm;border-bottom:0.6pt dashed #999}
.fiche:last-child{border-bottom:none}
.tete{display:flex;justify-content:space-between;align-items:baseline;border-bottom:0.8pt solid #111;padding-bottom:1.5mm;margin-bottom:2mm}
.note{font-size:15pt;font-weight:700}
.id{font-size:11pt;margin-bottom:1mm}
.lab{display:inline-block;width:42mm}
.el{display:inline-block;margin-right:7mm;margin-top:1mm}
.notes{margin-top:3mm;font-size:11pt}
.nel{display:inline-block;margin-right:9mm}
.niv{display:inline-block;width:22mm;font-size:11pt}
.id{margin-bottom:2.5mm !important}
table.dos{font-size:10.5pt}
table.dos th{background:#efeae0;font-size:9pt;font-weight:600;padding:1mm 1.5mm;text-align:left}
table.dos td{padding:1.15mm 1.5mm;vertical-align:middle}
td.bloc{width:16mm;font-weight:600;font-size:9.5pt;text-align:center}
td.n{width:7mm;text-align:center;font-size:9.5pt}
th.pt,td.pt{width:13mm;text-align:center}
"""
    feuilles = []
    for classe in ("Hugo", "Turing"):
        for n in range(1, 11, 2):
            feuilles.append(f'<div class="feuille">{fiche_dossier(classe, n)}{fiche_dossier(classe, n+1)}</div>')
    return f"<!doctype html><html lang=fr><head><meta charset=utf-8><style>{css}</style></head><body>{''.join(feuilles)}</body></html>"

open(os.path.join(OUT, "grille-oral-plaidoirie-4e.html"), "w", encoding="utf-8").write(doc_oral())
open(os.path.join(OUT, "fiches-dossier-4e.html"), "w", encoding="utf-8").write(doc_dossier())
places = {p for g in G["Hugo"].values() for p in g}
print("Hugo non placés :", [p for p in LISTE_HUGO if p not in places])
print("Sans niveau :", sorted(k for k in [(c, p) for c in G for g in G[c].values() for p in g] if AUTO.get(k) is None))
print("Turing :", sum(len(v) for v in G["Turing"].values()), "élèves ; Hugo placés :", len(places))
