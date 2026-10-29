# La grille de la lettre, réécrite depuis le sujet (Sujet-ecriture-lettre-30-lignes-3e.pdf) et les règles du cadrage du 29/10 —
# jamais depuis la grille du site. Captures 5 à 9 (C13, tour 376). Palette de redaction.html.
import html, math
E = html.escape
COUL = {0: ('#f4b0b0', '#c54040', '#5a1010', 'Insuffisant'), 1: ('#f5c98a', '#c47820', '#5a3010', 'Fragile'),
        2: ('#a8d088', '#5a8a32', '#1f3a10', 'Satisfaisant'), 3: ('#7eb55c', '#3a6e1c', '#122a08', 'Très satisfaisant')}
def chip(n, w=96):
    b, bo, t, l = COUL[n]
    return '<span class="chip" style="background:%s;border-color:%s;color:%s;min-width:%dpx">%s</span>' % (b, bo, t, w, l)
def num(x): return ('%g' % x).replace('.', ',')
def bareme(p): return {3: float(p), 2: math.floor(p * 2 / 3 * 2) / 2, 1: math.floor(p / 3 * 2) / 2, 0: 0.0}
OEIL, LIRE, FIN, AUTO = "d'un coup d'œil", 'en lisant', 'à la fin', 'calculé'

# point : (titre, poids, [questions (groupe, texte, sautée si…)], [cases (niveau, fait, quand, à reprendre, cite)])
CRIT = [
 ("Le thème et l'invention", 14, [
  ("Le thème tenu", 6,
   [(LIRE, "Est-ce une lettre de la Grande Guerre ?", ''), (LIRE, "Sait-on si la lettre vient du front ou de la maison ?", 'sans Grande Guerre'),
    (LIRE, "Sait-on où est exactement le personnage ?", 'sans Grande Guerre'), (LIRE, "Sait-on qui est le destinataire ?", 'sans Grande Guerre'),
    (LIRE, "Sait-on depuis quand ils sont séparés ?", 'sans Grande Guerre'), (LIRE, "Le personnage a-t-il une vie d'avant (âge, métier) ?", 'sans Grande Guerre'),
    (LIRE, "Tout ce que raconte la lettre est-il possible en 14-18 ?", 'sans Grande Guerre')],
   [(3, "Le thème est tenu : on sait qui tu es, d'où tu écris, à qui, depuis quand.", 'tout est « oui »', '', 0),
    (3, "On ne sait pas depuis quand vous êtes séparés.", '« depuis quand ? » non', "Dis depuis quand vous êtes séparés.", 0),
    (2, "On ne sait rien de ta vie d'avant la guerre.", '« vie d\'avant ? » non', "Dis ton âge et ton métier d'avant la guerre.", 0),
    (2, "On ne sait pas où tu es exactement.", '« où exactement ? » non', "Nomme le lieu d'où tu écris.", 0),
    (2, "On ne sait pas qui est la personne à qui tu écris.", '« à qui ? » non', "Dis qui elle est pour toi.", 0),
    (1, "On ne sait pas si tu écris du front ou de la maison.", '« front ou maison ? » non', "Montre d'où tu écris dès les premières lignes.", 0),
    (1, "Un détail de ta lettre n'existe pas en 14-18.", '« possible en 14-18 ? » non', "Remplace ce détail par un objet de l'époque.", 1),
    (1, "Plusieurs choses manquent pour savoir qui tu es.", 'deux « non » ou plus parmi où, qui, depuis quand, vie d\'avant', "Reprends ton brouillon d'idées : qui tu es, où, à qui, depuis quand.", 0),
    (0, "Ta lettre ne parle pas de la Grande Guerre.", '« Grande Guerre ? » non', "Relis le sujet : la lettre est écrite en 14-18.", 0)]),
  ("Les trois paragraphes", 4,
   [(OEIL, "Les paragraphes sont-ils séparés (alinéas) ?", ''), (LIRE, "Un paragraphe dit-il où est le personnage et ce qu'il voit ?", ''),
    (LIRE, "Un paragraphe dit-il ce qui est le plus dur ?", ''), (LIRE, "Ce plus dur est-il ce qu'on n'attend pas ?", 'sans le plus dur'),
    (LIRE, "Un paragraphe dit-il l'inquiétude pour l'autre ?", ''), (LIRE, "Le personnage demande-t-il des nouvelles à l'autre ?", "sans l'inquiétude"),
    (OEIL, "Sont-ils dans l'ordre du sujet ?", '')],
   [(3, "Tes trois paragraphes sont là : le concret, le plus dur, l'inquiétude pour l'autre.", 'tout est « oui »', '', 0),
    (3, "Tes trois paragraphes ne sont pas dans l'ordre du sujet.", '« dans l\'ordre ? » non', "Remets-les dans l'ordre : le concret, le plus dur, l'inquiétude.", 0),
    (2, "Ton plus dur est celui qu'on attend.", '« inattendu ? » non', "Cherche un plus dur qui surprend, comme la boue chez Jean Déléage.", 1),
    (2, "Tu ne demandes pas de nouvelles à l'autre.", '« des nouvelles ? » non', "Ajoute ce que tu lui demandes.", 0),
    (2, "Tes trois moments ne sont pas séparés en paragraphes.", '« alinéas ? » non', "Va à la ligne et fais un alinéa à chaque moment.", 0),
    (1, "Le paragraphe du concret manque.", '« où tu es, ce que tu vois ? » non', "Écris où tu es et ce que tu vois.", 0),
    (1, "Le paragraphe du plus dur manque.", '« le plus dur ? » non', "Écris ce qui est le plus dur pour toi.", 0),
    (1, "Le paragraphe de l'inquiétude pour l'autre manque.", '« l\'inquiétude ? » non', "Écris ton inquiétude pour l'autre.", 0),
    (0, "Deux de tes trois paragraphes manquent.", 'deux de ces trois « non »', "Écris les deux paragraphes qui manquent.", 0)]),
  ("Les lectures reprises", 2,
   [(LIRE, "Un détail concret vient-il des lectures du chapitre ?", ''), (LIRE, "Est-il précis (un objet, un geste, un lieu) ?", 'sans détail'),
    (LIRE, "Est-il écrit avec les mots de l'élève ?", 'sans détail')],
   [(3, "Un détail de tes lectures revient, précis, écrit avec tes mots.", 'tout est « oui »', '', 0),
    (2, "Ton détail reste général : on ne le voit pas.", '« précis ? » non', "Remplace-le par un objet, un geste ou un lieu.", 1),
    (1, "Ton détail est recopié du texte lu.", '« avec tes mots ? » non', "Réécris ce détail avec tes mots.", 1),
    (0, "Aucun détail de tes lectures n'apparaît.", '« un détail ? » non', "Reprends un détail de la lettre de Jean Déléage ou du chapitre.", 0)]),
  ("Ce qu'on tait", 2,
   [(FIN, "La lettre tait-elle quelque chose ?", ''), (FIN, "Le silence se sent-il sans être annoncé ?", 'sans silence'),
    (FIN, "Devine-t-on pourquoi le personnage se tait ?", 'sans silence'), (FIN, "Le silence tient-il jusqu'au bout ?", 'sans silence')],
   [(3, "On sent ce que tu tais, et on devine pourquoi.", 'tout est « oui »', '', 0),
    (2, "On ne devine pas pourquoi tu te tais.", '« pourquoi ? » non', "Fais deviner pourquoi tu te tais.", 0),
    (1, "Tu annonces ce que tu tais au lieu de le faire sentir.", '« sans être annoncé ? » non', "Retire l'annonce : laisse le silence parler.", 1),
    (1, "Ce que tu tais, tu le dis plus loin.", '« jusqu\'au bout ? » non', "Retire le passage qui dit ce que tu taisais.", 1),
    (0, "Ta lettre ne tait rien : tu dis tout.", '« tait-elle ? » non', "Choisis une chose à taire, et pourquoi.", 0)])]),
 ("La construction des phrases", 14, [
  ("Toutes les phrases sont complexes", 5,
   [(LIRE, "Toutes les phrases sont-elles complexes ?", ''), (LIRE, "Les phrases simples sont-elles deux au plus ?", 'si toutes complexes'),
    (LIRE, "La plupart des phrases sont-elles complexes ?", 'si deux au plus'), (LIRE, "Chaque subordonnée a-t-elle sa principale ?", ''),
    (LIRE, "Chaque relatif est-il le bon ?", '')],
   [(3, "Toutes tes phrases sont complexes, et chacune tient.", 'tout est « oui »', '', 0),
    (3, "Un relatif n'est pas le bon.", '« le bon relatif ? » non', "Corrige le relatif (qui, que, dont, où).", 1),
    (2, "Une ou deux de tes phrases sont simples.", '« deux au plus ? » oui', "Transforme-les en phrases complexes.", 1),
    (1, "Une subordonnée reste sans principale.", '« sa principale ? » non', "Ajoute la principale qui manque.", 1),
    (1, "Plusieurs de tes phrases sont simples.", '« la plupart ? » oui', "Transforme tes phrases simples en phrases complexes.", 0),
    (0, "La plupart de tes phrases sont simples.", '« la plupart ? » non', "Reprends tes phrases une à une avec l'analyse logique.", 0)]),
  ("Les cinq architectures, valorisées au-delà", 7,
   [(OEIL, "L'architecture 1 est-elle là ?", ''), (OEIL, "L'architecture 2 est-elle là ?", ''), (OEIL, "L'architecture 3 est-elle là ?", ''),
    (OEIL, "L'architecture 4 est-elle là ?", ''), (OEIL, "L'architecture 5 est-elle là ?", ''), (OEIL, "Leurs numéros sont-ils dans la marge ?", ''),
    (LIRE, "Chacune suit-elle son modèle ?", ''), (FIN, "Reviennent-elles plusieurs fois ?", '')],
   [(3, "Tes cinq architectures sont là, et elles reviennent : ta copie dépasse le strict minimum.", 'tout est « oui »', '', 0),
    (3, "Les numéros des architectures ne sont pas dans la marge.", '« numéros ? » non', "Écris le numéro de chaque architecture dans la marge.", 0),
    (2, "Chaque architecture n'apparaît qu'une fois.", '« plusieurs fois ? » non', "Reprends une architecture une deuxième fois.", 0),
    (1, "Une de tes architectures ne suit pas son modèle.", '« son modèle ? » non', "Refais son analyse logique et corrige-la.", 1),
    (1, "Il manque l'architecture {n}.", 'un « non » parmi les cinq', "Écris l'architecture {n}.", 0),
    (0, "Il manque plusieurs architectures : {n}.", 'deux « non » ou plus parmi les cinq', "Écris les architectures {n}.", 0)]),
  ("Modalisation et litote", 2,
   [(FIN, "Y a-t-il au moins une modalisation ?", ''), (FIN, "Chaque paragraphe a-t-il la sienne ?", 'sans modalisation'),
    (FIN, "Y a-t-il une litote ?", ''), (FIN, "La litote fait-elle entendre plus qu'elle ne dit ?", 'sans litote')],
   [(3, "Chaque paragraphe a sa modalisation, et ta litote fait entendre plus qu'elle ne dit.", 'tout est « oui »', '', 0),
    (2, "Un de tes paragraphes n'a pas de modalisation.", '« chaque paragraphe ? » non', "Ajoute une modalisation à ce paragraphe.", 0),
    (2, "Ta litote dit la chose au lieu de la faire entendre.", '« faire entendre ? » non', "Récris-la : dis moins pour faire entendre plus.", 1),
    (1, "Ta lettre n'a pas de litote.", '« une litote ? » non', "Écris une litote.", 0),
    (1, "Ta lettre n'a aucune modalisation.", '« une modalisation ? » non', "Ajoute une modalisation dans chaque paragraphe.", 0),
    (0, "Aucun des deux procédés n'apparaît.", 'les deux « non »', "Écris une modalisation par paragraphe et une litote.", 0)])]),
 ("L'organisation et la lettre", 6, [
  ("Les codes de la lettre", 2,
   [(OEIL, "Y a-t-il un lieu ?", ''), (OEIL, "Y a-t-il une date ?", ''), (OEIL, "Y a-t-il une formule d'adresse ?", ''),
    (OEIL, "Y a-t-il une signature ?", ''), (OEIL, "Chaque code est-il à sa place ?", ''), (OEIL, "La date est-elle dans la guerre ?", 'sans date')],
   [(3, "Ta lettre a ses quatre codes : le lieu, la date, l'adresse, la signature.", 'tout est « oui »', '', 0),
    (3, "Un code n'est pas à sa place.", '« à sa place ? » non', "Remets-le à sa place.", 0),
    (2, "Il manque {le lieu, la date, l'adresse ou la signature}.", 'un « non » parmi les quatre', "Ajoute-le.", 0),
    (2, "Ta date n'est pas dans la guerre.", '« dans la guerre ? » non', "Choisis une date entre 1914 et 1918.", 0),
    (1, "Il manque deux codes : {…}.", 'deux « non » parmi les quatre', "Ajoute-les.", 0),
    (0, "Il manque trois codes ou plus.", 'trois « non » ou plus', "Ajoute le lieu, la date, l'adresse et la signature.", 0)]),
  ("La 1re personne et le destinataire", 2,
   [(LIRE, "La lettre est-elle écrite à la 1re personne ?", ''), (LIRE, "Ce « je » tient-il jusqu'au bout ?", 'sans « je »'),
    (LIRE, "Le personnage s'adresse-t-il à l'autre (tu, vous, des questions) ?", ''), (LIRE, "Les temps sont-ils cohérents ?", '')],
   [(3, "Tu écris à la première personne, à quelqu'un, et tes temps tiennent.", 'tout est « oui »', '', 0),
    (2, "Tes temps ne sont pas cohérents.", '« les temps ? » non', "Corrige le temps qui glisse.", 1),
    (1, "Ta lettre ne s'adresse jamais à la personne qui la lira.", '« t\'adresses-tu ? » non', "Parle-lui : tu, vous, des questions.", 0),
    (1, "Ton « je » devient un récit à la troisième personne.", '« jusqu\'au bout ? » non', "Garde le « je » d'un bout à l'autre.", 1),
    (0, "Ta lettre n'est pas écrite à la première personne.", '« 1re personne ? » non', "Récris ta lettre avec « je ».", 0)]),
  ("Trente lignes", 2,
   [(AUTO, "Les lignes écrites, que tu déclares avant de corriger : en part des 30 lignes du sujet", '')],
   [(3, "Ta lettre fait {n} lignes : la longueur demandée.", 'de 100 % à 133 % (30 à 40 lignes)', '', 0),
    (2, "Ta lettre fait {n} lignes sur les 30 demandées.", 'de 80 % à 99 % (24 à 29)', "Ajoute ce qui manque pour atteindre trente lignes.", 0),
    (1, "Ta lettre fait {n} lignes sur les 30 demandées.", 'de 60 % à 79 % (18 à 23)', "Ajoute ce qui manque pour atteindre trente lignes.", 0),
    (1, "Ta lettre fait {n} lignes : plus de dix lignes de trop.", 'plus de 133 % (plus de 40)', "Resserre ta lettre à quarante lignes au plus.", 0),
    (0, "Ta lettre fait {n} lignes sur les 30 demandées.", 'moins de 60 % (moins de 18)', "Ajoute ce qui manque pour atteindre trente lignes.", 0)])]),
 ("La langue", 6, [
  ("Orthographe et grammaire", 4,
   [(AUTO, "Tes « + » au fil des lignes : en part des lignes écrites", '')],
   [(3, "{e} erreurs sur tes {n} lignes : une toutes les dix lignes au plus.", "jusqu'à 10 %", "Corrige tes erreurs, ligne par ligne.", 0),
    (2, "{e} erreurs sur tes {n} lignes : une toutes les quatre lignes au plus.", "jusqu'à 23 %", "Corrige tes erreurs, ligne par ligne.", 0),
    (1, "{e} erreurs sur tes {n} lignes : une toutes les deux lignes au plus.", "jusqu'à 47 %", "Corrige tes erreurs, ligne par ligne.", 0),
    (0, "{e} erreurs sur tes {n} lignes : plus d'une toutes les deux lignes.", 'au-delà de 47 %', "Corrige tes erreurs, ligne par ligne.", 0)]),
  ("Lexique", 2,
   [(FIN, "Les mots sont-ils justes ?", ''), (FIN, "Le vocabulaire est-il varié ?", ''), (FIN, "Y a-t-il des mots de 14-18 (poilu, tranchée, permission…) ?", '')],
   [(3, "Tes mots sont justes et variés, et ce sont ceux de 14-18.", 'tout est « oui »', '', 0),
    (2, "Les mots de 14-18 sont absents.", '« mots de 14-18 ? » non', "Ajoute des mots de l'époque.", 0),
    (2, "Les mêmes mots reviennent.", '« varié ? » non', "Remplace les mots répétés.", 1),
    (1, "Des mots ne disent pas ce que tu veux dire.", '« justes ? » non', "Remplace ces mots par le mot juste.", 1)])]),
]

CSS = '''*{box-sizing:border-box}body{margin:0;background:#f5f1ea;color:#2b2520;font:13.5px/1.3 "EB Garamond",Georgia,"Liberation Serif",serif}
.top{background:linear-gradient(to bottom,#c08a4a,#a67a44);color:#fff;display:flex;align-items:center;gap:12px;padding:8px 16px}
.top b{font-size:19px;letter-spacing:.03em}.pill{background:rgba(255,255,255,.18);border-radius:8px;padding:4px 10px}.esp{flex:1}
.tag{background:#fff3d6;border:1px solid #d4b87a;color:#5a3010;border-radius:6px;padding:1px 8px;font-size:12px}
.cols{display:flex;gap:10px;padding:10px 12px;align-items:stretch}
.col{flex:1;background:#fdfbf7;border:1px solid #d6cfc1;border-radius:10px;padding:8px 10px}
.cr{display:flex;justify-content:space-between;font-weight:bold;color:#6b1a2a;border-bottom:1px solid #ede4d3;font-size:15.5px;margin-bottom:4px}
h3{margin:6px 0 3px;font-size:11.5px;letter-spacing:.12em;text-transform:uppercase;color:#6b1a2a}
.q{display:flex;gap:6px;padding:1px 0;border-bottom:1px dashed #ede4d3}.q .t{flex:1}.q .gr{font-size:11px;color:#9a8a72;width:84px;text-align:right}
.q .sk{font-size:11px;color:#b8ab95;font-style:italic}
.chip{display:inline-block;text-align:center;border-radius:5px;padding:1px 4px;font-size:11.5px;border:1px solid;flex:none}
.case{border:1px solid #ede4d3;border-radius:7px;padding:3px 6px;margin:3px 0;background:#fff}
.case .h{display:flex;gap:6px;align-items:flex-start}.case .f{flex:1}.case .n{font-weight:bold;width:30px;text-align:right}
.case .w{font-size:11.5px;color:#8a7a62;margin-left:102px}.case .r{font-size:12px;color:#5a3010;margin-left:102px}
.cit{color:#6b1a2a;font-weight:bold}
.m{color:#8a7a62;font-size:12.5px}
table.b{border-collapse:collapse;font-size:13.5px}table.b td,table.b th{border:1px solid #d6cfc1;padding:3px 8px;text-align:center}table.b td:first-child{text-align:left}
ol.reg{margin:4px 0 0 0;padding-left:22px}ol.reg li{margin:3px 0;font-size:14.5px}'''

def page(tete, corps):
    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>' + CSS + '</style></head><body>' + tete + corps + '</body></html>'

def ecran_regles():
    t = '<div class="top"><b>La grille de la lettre — réécrite depuis le sujet</b><span class="tag">à corriger</span><span class="esp"></span><span class="pill">Une case = un seul fait · une seule couleur · un seul point</span></div>'
    h = '<div class="cols"><div class="col" style="flex:1.25"><h3>Les règles appliquées (cadrage du 29/10)</h3><ol class="reg">'
    for r in ["Je pars du sujet, jamais de la grille du site : chaque question vient d'une consigne du sujet.",
              "Une case = un seul fait, une seule couleur, un seul point, fixés d'avance. La présence et la place sont deux cases.",
              "La case dit exactement ce qu'il y a dans la copie.",
              "Rouge, vraiment négatif ; orange, un peu moins ; vert, un peu mieux ; vert foncé, très bien, à la portée d'une bonne copie de 3e : une case vert foncé peut nommer une petite erreur.",
              "Une question = un fait. Tout est « oui » d'avance ; un « non » ouvre sa case ; une question sans objet est sautée.",
              "Deux « non » dans un point : la case la plus sévère donne la couleur et le point ; les autres sont nommées dans le bilan et dans « À reprendre ». Un cumul du même genre a sa case (« Il manque deux codes »).",
              "Chaque case a sa tâche « À reprendre », pour que l'élève se corrige seul.",
              "❝ : la case reçoit ta citation, recopiée telle que l'élève l'a écrite, après sa phrase, avec la ligne.",
              "Longueur et erreurs en part des lignes, jamais en nombre fixe ; les lignes déclarées avant de corriger ; dix lignes de plus permises.",
              "Le prénom n'est dans aucune case : deux fois au plus, dans le bilan.",
              "Gardés du cadrage du 27/10 : les quatre critères et leurs poids (le thème et les phrases pèsent 28 sur 40).",
              "Les questions s'adressent à toi : elles parlent de la lettre et du personnage, et leur seul « tu », c'est toi. Les cases s'adressent à l'élève : leur « tu », c'est l'élève, qui écrit en son personnage, comme dans le sujet."]:
        h += '<li>%s</li>' % E(r)
    h += '</ol></div><div class="col"><h3>Proposé : le point de chaque couleur</h3><div class="m" style="margin-bottom:6px">Rouge 0 ; orange, le tiers du point ; vert, les deux tiers ; vert foncé, le point entier (arrondis au demi-point inférieur).</div>'
    h += '<table class="b"><tr><th>Point</th><th>sur</th>' + ''.join('<th>%s</th>' % chip(n, 88) for n in (0, 1, 2, 3)) + '</tr>'
    tot = {0: 0, 1: 0, 2: 0, 3: 0}
    for cr, mx, P in CRIT:
        h += '<tr><td colspan="6" style="background:#ede4d3;font-weight:bold;color:#6b1a2a">%s — %d</td></tr>' % (E(cr), mx)
        for tit, p, qs, cs in P:
            b = bareme(p)
            for k in tot: tot[k] += b[k]
            h += '<tr><td>%s</td><td>%d</td>%s</tr>' % (E(tit), p, ''.join('<td>%s</td>' % num(b[n]) for n in (0, 1, 2, 3)))
    h += '<tr><td><b>Une copie toute de cette couleur</b></td><td>40</td>%s</tr></table></div></div>' % ''.join('<td><b>%s</b></td>' % num(tot[n]) for n in (0, 1, 2, 3))
    return page(t, h)

def ecran_critere(cr, mx, P, ajout=''):
    t = '<div class="top"><b>%s — sur %d</b><span class="tag">phrases à corriger</span><span class="esp"></span><span class="pill">❝ reçoit ta citation · « sautée » : la question n\'a plus d\'objet</span></div>' % (E(cr), mx)
    h = '<div class="cols">'
    for tit, p, qs, cs in P:
        b = bareme(p)
        h += '<div class="col"><div class="cr"><span>%s</span><span>sur %d</span></div><h3>Les questions</h3>' % (E(tit), p)
        for g, q, sk in qs:
            h += '<div class="q"><span class="t">%s%s</span><span class="gr">%s</span></div>' % (E(q), ' <span class="sk">· sautée %s</span>' % E(sk) if sk else '', E(g))
        h += '<h3 style="margin-top:8px">Les cases</h3>'
        for n, fait, quand, rep, cite in cs:
            h += '<div class="case"><div class="h">%s<span class="f">%s%s</span><span class="n">%s</span></div><div class="w">%s</div>%s</div>' % (
                chip(n), E(fait), ' <span class="cit">❝</span>' if cite else '', num(b[n]), E(quand), '<div class="r">À reprendre : %s</div>' % E(rep) if rep else '')
        h += '</div>'
    h += ajout + '</div>'
    return page(t, h)

TOUCHE = ('<div class="col" style="flex:.9"><div class="cr"><span>Après les points</span><span></span></div><h3>La phrase qui t\'a touché</h3>'
          '<div class="q"><span class="t">Une phrase t\'a-t-elle touché ?</span><span class="gr">à la fin</span></div>'
          '<div class="m" style="margin-top:6px">« oui » : tu la recopies telle que l\'élève l\'a écrite, avec sa ligne, puis tu choisis une raison. Les raisons sont générales, valables pour n\'importe quel élève ; la conversation qui crée le sujet en donne les mots (1161).</div></div>')

open('vue-e.html', 'w', encoding='utf8').write(ecran_regles())
for i, (cr, mx, P) in enumerate(CRIT):
    open('vue-%s.html' % 'fghi'[i], 'w', encoding='utf8').write(ecran_critere(cr, mx, P, TOUCHE if i == 3 else ''))
nq = sum(len(qs) for _, _, P in CRIT for _, _, qs, _ in P if qs[0][0] != AUTO)
nc = sum(len(cs) for _, _, P in CRIT for _, _, _, cs in P)
print('points', sum(len(P) for _, _, P in CRIT), 'questions', nq, 'cases', nc, 'poids', sum(p for _, _, P in CRIT for _, p, _, _ in P))
