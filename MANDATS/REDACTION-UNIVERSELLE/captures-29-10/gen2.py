# Captures construites (C13 1188-1193) : le mode général, une case = un fait, une couleur, un point.
# Données : la copie de Flavie — les oui / non de la capture 1 ; couleurs et points de chaque case = ceux que Paul lui a mis (hub, 29/10, total 19,5).
# Couleurs : la palette de redaction.html (ECHELON_COULEUR, :root).
import html
E = html.escape
COUL = {0: ('#f4b0b0', '#c54040', '#5a1010', 'Insuffisant'), 1: ('#f5c98a', '#c47820', '#5a3010', 'Fragile'),
        2: ('#a8d088', '#5a8a32', '#1f3a10', 'Satisfaisant'), 3: ('#7eb55c', '#3a6e1c', '#122a08', 'Très satisfaisant')}
def chip(n, w=118):
    b, bo, t, l = COUL[n]
    return '<span class="chip" style="background:%s;border-color:%s;color:%s;min-width:%dpx">%s</span>' % (b, bo, t, w, l)
def num(x): return ('%g' % x).replace('.', ',')

# ── les questions (groupe, question, réponse de Flavie : 1 oui, 0 non, None sautée, 'au' au-delà), par point ──
Q = [
 ('codes', 'oeil', [("Y a-t-il un lieu ?", 1), ("Y a-t-il une date ?", 0), ("Le destinataire est-il nommé ?", 1), ("La lettre est-elle signée ?", 1), ("Chaque code est-il à sa place ?", 1)]),
 ('architectures', 'oeil', [("Les numéros sont-ils dans la marge ?", 0)]),
 ('trois_paragraphes', 'lire', [("Le paragraphe du concret est-il écrit ?", 1), ("Le paragraphe du plus dur est-il écrit ?", 1), ("Le paragraphe de l'inquiétude pour l'autre est-il écrit ?", 0)]),
 ('theme_tenu', 'lire', [("Sait-on qui écrit ?", 1), ("Sait-on d'où ?", 1), ("Sait-on à qui ?", 1), ("Est-ce bien 14-18 ?", 1), ("Le personnage a-t-il une vie à lui ?", 0)]),
 ('lectures', 'lire', [("Fait-il voir le concret, comme Jean Déléage ?", 1), ("Les détails du chapitre sont-ils repris sans être recopiés ?", 0)]),
 ('phrases_complexes', 'lire', [("Toutes les phrases sont-elles complexes ?", 1), ("Chaque subordonnée a-t-elle sa principale ?", 1), ("Chaque relatif est-il le bon ?", 0)]),
 ('architectures', 'lire', [("Les cinq architectures sont-elles là ?", 1), ("Sont-elles construites correctement ?", 1)]),
 ('personne_destinataire', 'lire', [("Le « je » est-il tenu ?", 1), ("Écrit-il vraiment à quelqu'un ?", 1), ("Les temps sont-ils cohérents ?", 0)]),
 ('modalisation_litote', 'fin', [("Chaque paragraphe a-t-il sa modalisation ?", 1), ("La litote fait-elle entendre plus qu'elle ne dit ?", 0)]),
 ('ce_qu_on_tait', 'fin', [("La lettre tait-elle quelque chose ?", 0), ("Devine-t-on pourquoi ?", None), ("Le silence tient-il jusqu'au bout ?", None)]),
 ('lexique', 'fin', [("Le vocabulaire est-il juste ?", 1), ("Est-il varié ?", 1)]),
 ('theme_tenu', 'fin', [("On croit lire une vraie lettre de 14-18 ?", 'au')]),
 ('architectures', 'fin', [("Reviennent-elles plusieurs fois ?", 'au')]),
 ('lexique', 'fin', [("Un terme recherché ou imagé ?", 'au')]),
]
LIB = {'codes': 'Les codes de la lettre', 'trente_lignes': 'Trente lignes', 'personne_destinataire': 'La 1re personne et le destinataire',
       'trois_paragraphes': 'Les trois paragraphes', 'theme_tenu': 'Le thème tenu', 'lectures': 'Les lectures reprises', 'ce_qu_on_tait': "Ce qu'on tait",
       'phrases_complexes': 'Les phrases complexes', 'architectures': 'Les cinq architectures', 'modalisation_litote': 'Modalisation et litote',
       'orthographe': 'Orthographe et grammaire', 'lexique': 'Lexique'}
# ── la case où tombe Flavie : (point, poids, niveau, le fait, note) — niveau et note = ceux que Paul lui a mis ──
CRIT = [
 ("L'organisation et la lettre", 6, [('codes', 2, 1, "Il manque la date.", .5), ('personne_destinataire', 2, 1, "Les temps ne sont pas cohérents.", 1),
                                      ('trente_lignes', 2, 1, "Ta lettre fait 21 lignes sur 30.", .5)]),
 ("Le thème et l'invention", 14, [('trois_paragraphes', 4, 1, "Le paragraphe de l'inquiétude pour l'autre manque.", 1), ('theme_tenu', 6, 2, "Ton personnage n'a pas de vie à lui.", 4.5),
                                   ('lectures', 2, 2, "Un détail du chapitre est recopié, pas repris.", 1), ('ce_qu_on_tait', 2, 0, "Ta lettre ne tait rien.", 0)]),
 ("La construction des phrases", 14, [('phrases_complexes', 5, 2, "Un relatif n'est pas le bon.", 3.5), ('architectures', 7, 2, "Les numéros ne sont pas dans la marge.", 5),
                                       ('modalisation_litote', 2, 1, "Ta litote dit, au lieu de faire entendre.", 1)]),
 ("La langue", 6, [('orthographe', 4, 0, "14 erreurs sur 21 lignes.", 0), ('lexique', 2, 2, "Aucun terme recherché ou imagé.", 1.5)]),
]
TOT = sum(c[4] for _, _, L in CRIT for c in L)
ERR = [2, 2, 3, 5, 5, 7, 8, 9, 9, 11, 14, 15, 17, 19]
NON = sum(1 for _, _, qs in Q for q in qs if q[1] == 0)
GESTES = 3 + 3 + NON + len(ERR) + 3

CSS = '''*{box-sizing:border-box}body{margin:0;background:#f5f1ea;color:#2b2520;font:14px/1.3 "EB Garamond",Georgia,"Liberation Serif",serif}
.top{background:linear-gradient(to bottom,#c08a4a,#a67a44);color:#fff;display:flex;align-items:center;gap:12px;padding:8px 16px}
.top b{font-size:19px;letter-spacing:.03em}.pill{background:rgba(255,255,255,.18);border-radius:8px;padding:4px 10px}.esp{flex:1}
.cols{display:flex;gap:12px;padding:10px 14px;height:calc(100vh - 46px)}
.col{background:#fdfbf7;border:1px solid #d6cfc1;border-radius:10px;padding:8px 12px;overflow:hidden}
h3{break-after:avoid;margin:4px 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b1a2a;display:flex;align-items:center;gap:8px}
h3 .ok{font-size:11px;letter-spacing:0;text-transform:none;background:#e8f2df;border:1px solid #9cc27f;color:#3d6b26;border-radius:6px;padding:0 6px}
.q{break-inside:avoid;display:flex;align-items:center;gap:6px;padding:2px 0;border-bottom:1px dashed #ede4d3;font-size:13.5px}
.q .t{flex:1}.on{display:inline-block;min-width:46px;text-align:center;border-radius:6px;padding:0 5px;font-size:12.5px;border:1px solid #d6cfc1;color:#8a7a62}
.on.oui{background:#e8f2df;border-color:#9cc27f;color:#3d6b26}.on.non{background:#f4b0b0;border-color:#c54040;color:#5a1010;font-weight:bold}.on.saut{background:#fff;color:#b8ab95;font-style:italic}
.q .p{font-size:11px;color:#9a8a72;width:112px;text-align:right;line-height:1.1}
.chip{display:inline-block;text-align:center;border-radius:5px;padding:1px 4px;font-size:12px;border:1px solid}
.g{display:flex;align-items:center;gap:8px;margin:2px 0;font-size:13.5px}.g .l{width:205px}.g .f{flex:1;font-style:italic}.g .n{width:58px;text-align:right;font-weight:bold}
.cr{display:flex;justify-content:space-between;margin:6px 0 1px;font-weight:bold;color:#6b1a2a;border-bottom:1px solid #ede4d3}
.reg{display:flex;flex-wrap:wrap;gap:3px;margin-top:3px}.reg span{width:30px;height:24px;border:1px solid #d6cfc1;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:12px;position:relative;background:#fff}
.reg span.e{background:#f4b0b0;border-color:#c54040;font-weight:bold}.reg span i{position:absolute;top:-6px;right:-5px;background:#6b1a2a;color:#fff;border-radius:8px;font-size:9.5px;padding:0 3px;font-style:normal}
.m{color:#8a7a62;font-size:12.5px}.ges{font-size:20px;font-weight:bold;color:#4a7a3a}
.tag{background:#fff3d6;border:1px solid #d4b87a;color:#5a3010;border-radius:6px;padding:1px 8px;font-size:12px}'''

def vueC():
    h = '<div class="top"><b>CHEVALIER Flavie</b><span>Copie 7 sur 28</span><span class="pill">Copie suivante : CF ⏎</span><span class="pill">21 lignes écrites ⏎</span><span class="esp"></span>'
    h += '<span class="pill">Écrire une lettre de la Grande Guerre</span><span class="pill">⏱ le chrono de la copie</span><span class="pill" style="font-size:18px">%s / 40</span></div>' % num(TOT)
    h += '<div class="cols"><div class="col" style="flex:1.2;column-count:2;column-gap:20px">'
    for grp, tit in [('oeil', "D'un coup d'œil"), ('lire', 'En lisant'), ('fin', 'À la fin')]:
        h += '<h3>%s <span class="ok">✓ validé ⏎</span></h3>' % tit
        for pid, g, qs in Q:
            if g != grp: continue
            for txt, r in qs:
                if r == 'au': cls, lab, t = 'saut', 'non', E(txt) + ' <span class="m">· au-delà</span>'
                elif r is None: cls, lab, t = 'saut', 'sautée', E(txt)
                else: cls, lab, t = ('oui', 'oui', E(txt)) if r else ('non', 'NON', E(txt))
                h += '<div class="q"><span class="t">%s</span><span class="on %s">%s</span><span class="p">%s</span></div>' % (t, cls, lab, E(LIB[pid]))
    h += '<div class="m" style="margin-top:5px">Tout est « oui » d’avance ; tu cliques les « non ». Chaque groupe se valide d’une touche : aucun « oui » ne passe sans toi. « Trente lignes » ne se demande plus : il vient des 21 lignes déclarées.</div></div>'
    h += '<div class="col" style="flex:1"><h3>La case de chaque point <span class="tag">un fait · une couleur · un point</span></h3>'
    for cr, mx, L in CRIT:
        h += '<div class="cr"><span>%s</span><span>%s / %d</span></div>' % (E(cr), num(sum(c[4] for c in L)), mx)
        for pid, p, n, fait, nt in L:
            h += '<div class="g"><span class="l">%s <span class="m">/ %d</span></span>%s<span class="f">%s</span><span class="n">%s</span></div>' % (E(LIB[pid]), p, chip(n, 104), E(fait), num(nt))
    h += '<h3 style="margin-top:8px">La langue — les erreurs, par ligne écrite</h3><div class="reg">'
    for l in range(1, 22):
        c = ERR.count(l); h += '<span class="%s">%d%s</span>' % ('e' if c else '', l, '<i>%d</i>' % c if c > 1 else '')
    h += '</div><div style="margin-top:7px;display:flex;align-items:baseline;gap:10px"><span class="ges">%d gestes</span><span class="m">initiales 3 · lignes 3 · « non » %d · erreurs %d · groupes 3 — comptés, pas mesurés ; + tes 4 citations, tapées comme aujourd’hui</span></div>' % (GESTES, NON, len(ERR))
    h += '<div class="m">Le total, %s / 40 : la note que tu lui as mise, case par case.</div></div></div>' % num(TOT)
    return h

# ── la grille d'un point, case par case (phrases d'exemple, à corriger) ──
PTS = [
 ('Les codes de la lettre', 2,
  [("Y a-t-il un lieu ?", 1), ("Y a-t-il une date ?", 0), ("Le destinataire est-il nommé ?", 1), ("La lettre est-elle signée ?", 1), ("Chaque code est-il à sa place ?", 1)],
  [(3, "Ta lettre a ses quatre codes, chacun à sa place.", 2, '', 0), (2, "Un code n'est pas à sa place.", 1.5, "« à sa place ? » non", 0),
   (1, "Il manque le lieu.", .5, "« un lieu ? » non", 0), (1, "Il manque la date.", .5, "« une date ? » non", 1), (1, "Le destinataire n'est pas nommé.", .5, "« nommé ? » non", 0),
   (1, "Ta lettre n'est pas signée.", .5, "« signée ? » non", 0), (0, "Deux codes manquent.", 0, "deux « non » parmi les quatre premières", 0)],
  "La présence et la place sont deux cases : jamais dans la même."),
 ('Les trois paragraphes', 4,
  [("Le paragraphe du concret est-il écrit ?", 1), ("Le paragraphe du plus dur est-il écrit ?", 1), ("Le paragraphe de l'inquiétude pour l'autre est-il écrit ?", 0)],
  [(3, "Tes trois paragraphes sont là : le concret, le plus dur, l'inquiétude pour l'autre.", 4, '', 0),
   (1, "Le paragraphe du concret manque.", 1, "1re question non", 0), (1, "Le paragraphe du plus dur manque.", 1, "2e question non", 0),
   (1, "Le paragraphe de l'inquiétude pour l'autre manque.", 1, "3e question non", 1), (0, "Deux paragraphes manquent.", 0, "deux « non »", 0)],
  "Ce point n'a pas de case verte : une couleur n'existe que si un fait la justifie."),
 ("Ce qu'on tait", 2,
  [("La lettre tait-elle quelque chose ?", 0), ("Devine-t-on pourquoi ?", None), ("Le silence tient-il jusqu'au bout ?", None)],
  [(3, "Ta lettre tait quelque chose, et on devine pourquoi.", 2, '', 0), (2, "Ce que tu tais, tu le dis plus loin.", 1.5, "« jusqu'au bout ? » non", 0),
   (1, "On ne devine pas pourquoi tu te tais.", 1, "« pourquoi ? » non", 0), (0, "Ta lettre ne tait rien.", 0, "« tait-elle ? » non", 1)],
  "Sans silence, les deux questions suivantes sont sautées : une seule case s'ouvre."),
]
def vueD():
    h = '<div class="top"><b>La grille de la lettre, case par case</b><span class="tag" style="background:#fff3d6">phrases d’exemple, à corriger</span><span class="esp"></span><span class="pill">Une case = un seul fait · une seule couleur · un seul point</span></div>'
    h += '<div class="cols">'
    for tit, p, qs, cases, note in PTS:
        h += '<div class="col" style="flex:1;display:flex;flex-direction:column"><div class="cr" style="font-size:16px"><span>%s</span><span>sur %d</span></div>' % (E(tit), p)
        h += '<h3>Les questions — Flavie</h3>'
        for txt, r in qs:
            cls, lab = ('saut', 'sautée') if r is None else (('oui', 'oui') if r else ('non', 'NON'))
            h += '<div class="q"><span class="t">%s</span><span class="on %s">%s</span></div>' % (E(txt), cls, lab)
        h += '<h3 style="margin-top:10px">Les cases</h3>'
        for n, fait, nt, quand, fl in cases:
            st = 'border:2px solid #6b1a2a;background:#fff;' if fl else 'border:1px solid #ede4d3;'
            h += '<div style="%sborder-radius:7px;padding:4px 6px;margin:3px 0"><div class="g" style="margin:0">%s<span class="f" style="font-style:normal">%s</span><span class="n">%s</span></div>' % (st, chip(n, 104), E(fait), num(nt))
            h += '<div class="m" style="margin-left:112px">%s%s</div></div>' % (E(quand) if quand else 'tout est « oui »', ' &nbsp;<b style="color:#6b1a2a">← Flavie</b>' if fl else '')
        h += '<div class="m" style="margin-top:auto;padding-top:6px;font-size:13px;color:#5a3010">%s</div></div>' % E(note)
    h += '</div>'
    return h

for nom, b in [('c', vueC()), ('d', vueD())]:
    open('vue-%s.html' % nom, 'w', encoding='utf8').write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>' + CSS + '</style></head><body>' + b + '</body></html>')
print('total', TOT, 'non', NON, 'gestes', GESTES)
