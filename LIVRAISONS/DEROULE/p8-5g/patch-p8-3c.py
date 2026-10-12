# patch-p8-3c.py — (p8-3c) trois corrections avant que la maquette p8 serve de référence, et le bloc question au tableau
# (complément MANDATS/COMPLEMENT-DEROULE-P8-3c.md, C13 tours 20 à 24)
# usage : python3 patch-p8-3c.py <gabarit p8-3b> <gabarit p8-3c en sortie>
# Chaque remplacement est exigé le nombre de fois dit (sinon arrêt) ; les tailles avant / après de chaque fonction touchée sont écrites.
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi, n=1):
    global s
    c = s.count(avant)
    if c != n: sys.exit('ARRÊT : « %s » trouvé %d fois (attendu %d)' % (quoi, c, n))
    s = s.replace(avant, apres); journal.append('%s : %d → %d o%s' % (quoi, len(avant.encode()), len(apres.encode()), ' (×%d)' % n if n > 1 else ''))
def fonction(nom):
    i = s.index('function ' + nom + '(')
    fins = [s.find(x, i + 1) for x in ('\nfunction ', '\n/*', '\nconst ', '\nlet ', '\n$(', '\ndocument.', '\nwindow.', '\nsetInterval')]
    return s[i:min(x for x in fins if x > 0)]
for nom in ['e-sim-schema-plausible', 'b-sim-plausible']:
    if nom in s: sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % nom)   # n°12 · 40
TOUCHEES = ['rendre', 'alertesForme', 'elements', 'p8GardeObjet', 'p8GardeColler', 'p8GardesBarre', 'p8MenuBulle', 'menuAtelierMur', 'poserBarreBloc', 'choixObjet', 'ouvrirFin', 'recitHtml0']
TOUCHEES = [f for f in TOUCHEES if ('function ' + f + '(') in s]
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHEES}

# ── 1 · le cahier de textes : la cause, pas l'alerte. La diapo « Cahier de textes » a son propre rendu (branche « b0.t === 'cahier' » de rendre) :
#        « cahier » entre dans la liste des objets connus, au rendu de la diapo et dans « À régler ».
L0 = "const TYPES = ['consigne', 'texte', 'question', 'fiche', 'schema', 'image', 'video', 'page', 'doc'];"
L1 = "const TYPES = ['consigne', 'texte', 'question', 'fiche', 'schema', 'image', 'video', 'page', 'doc', 'cahier']; /* (p8-3c) le cahier de textes a son rendu */"
un(L0, L1, 'TYPES : « cahier » parmi les objets connus (rendre et alertesForme)', 2)

# ── 2 · la diapo 6 de l'heure 2 : la simulation b-sim-schema (p7) est retirée ; à sa place, une diapo nouvelle juste après,
#        même heure, même activité : une consigne d'une ligne prise telle quelle dans le chapitre, puis une carte de trois familles de la vraie carte.
SIM_P7 = "(function(){ const E = DATA.seances[0].ecrans; const m = E.find(e => e.act === 'Les mouvements du siècle'); if (m && !(m.blocs || []).some(b => b.t === 'schema')) m.blocs = (m.blocs || []).concat([{ t: 'schema', bid: 'b-sim-schema', txt: 'Les figures de style', forme: 'carte' }]); })();"
SIM_P8 = ("/* (p8-3c) retirée : la simulation b-sim-schema (une consigne de quatre lignes et un schéma sur « Les mouvements du siècle ») — un état que l'import refusera (décision 1). "
          "Simulation de la donnée, à sa place (Paul, C13 tours 23-24 : « schéma qui rentre dans une diapo normale, et schéma précédé d'une phrase de consigne ») : une diapo nouvelle juste après « Les mouvements du siècle », "
          "même heure, même activité, mêmes notions, la durée partagée ; la consigne est prise telle quelle dans le chapitre (CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json, séance 2, « La famille des images ») ; "
          "la carte : trois familles de la vraie carte, avec leurs notions */ "
          "(function(){ const E = DATA.seances[0].ecrans; const k = E.findIndex(e => e.act === 'Les mouvements du siècle'); if (k < 0 || E.some(e => e.eid === 'e-sim-schema-plausible')) return; const m = E[k]; const d2 = Math.floor((m.dur || 0) / 2); m.dur = (m.dur || 0) - d2; "
          "E.splice(k + 1, 0, { eid: 'e-sim-schema-plausible', act: m.act + ' (suite)', heure: m.heure, dur: d2, actId: m.actId, comp: (m.comp || []).slice(), blocs: [{ t: 'consigne', bid: 'b-sim-plausible-consigne', txt: 'Les figures, elles, rapprochent des idées.' }, "
          "{ t: 'schema', bid: 'b-sim-plausible', txt: 'Les figures de style', forme: 'carte', src: \"Figures d'analogie : personnification, comparaison, métaphore, allégorie\\nFigures d'opposition : antithèse, oxymore, antiphrase\\nFigures d'insistance : anaphore, répétition, pléonasme\" }] }); })();")
un(SIM_P7, SIM_P8, 'simulation : b-sim-schema retirée, la diapo plausible juste après')

# ── 3 · les infobulles des gestes grisés (p8-3) : jamais « Grisé » ; ce qui empêche, puis ce qu'il faut faire, dans les mots de Paul
un("function p8GardeObjet(t, e){ if (!p8DiapoASchema(e)) return ''; if (t === 'schema') return 'une diapo n\\'a qu\\'un schéma'; if (t === 'consigne' && !(e.blocs || []).some(b => b.t !== 'schema')) return ''; return P8_UNE + ' : donne à ce contenu sa diapo'; }",
   "function p8GardeObjet(t, e){ if (!p8DiapoASchema(e)) return ''; if (t === 'schema') return 'Cette diapo a déjà son schéma, et une diapo n\\'a qu\\'un schéma : pose le nouveau dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) et pose-le là'; if (t === 'consigne' && !(e.blocs || []).some(b => b.t !== 'schema')) return ''; return 'Cette diapo a son schéma : écris ce contenu dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour lui'; }",
   'p8GardeObjet : les raisons, écrites pour Paul')
un("return P8_UNE + ' : ce bloc n\\'y entre pas'; }",
   "return 'Cette diapo a son schéma : colle ce bloc dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour lui'; }",
   'p8GardeColler : la raison, écrite pour Paul')
P8B = "const SUITE = 'Cette diapo a son schéma : '; [['at-bloc', reste ? '' : SUITE + 'écris la suite dans la diapo suivante, ou coupe : clic droit sur le schéma → Couper la diapo ici'], ['at-etape', SUITE + 'une étape de plus va dans la diapo suivante — écris-la là, ou insère une diapo (Ctrl + Entrée)'], ['at-image', SUITE + 'pose l\\'image dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour elle'], ['at-fiche', SUITE + 'pose la fiche dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour elle'], ['at-video', SUITE + 'pose la vidéo dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour elle'], ['at-doc', SUITE + 'pose le document dans la diapo suivante, ou insère une diapo (Ctrl + Entrée) pour lui']]"
un("[['at-bloc', reste ? '' : P8_UNE], ['at-etape', P8_UNE + ' : pas d\\'étape en plus'], ['at-image', P8_UNE], ['at-fiche', P8_UNE], ['at-video', P8_UNE], ['at-doc', P8_UNE]]", P8B, 'p8GardesBarre : les raisons, écrites pour Paul')
un("bt.title = grise ? 'Grisé : ' + raison + ' (un schéma par diapo).' :", "bt.title = grise ? raison + '.' :", 'p8GardesBarre : sans « Grisé »')
un("title=\"${esc(g8 ? 'Grisé : ' + g8 + '.' : o.d)}\"><b>${o.l}</b><span>${esc(g8 ? 'grisé : ' + g8 : o.d)}</span>",
   "title=\"${esc(g8 ? g8 + '.' : o.d)}\"><b>${o.l}</b><span>${esc(g8 || o.d)}</span>", 'choixObjet : la carte grisée dit quoi faire')
un("'disabled title=\"Grisé : ' + P8_UNE + ' : pas d\\'étape en plus (un schéma par diapo).\"'",
   "'disabled title=\"Cette diapo a son schéma : une étape de plus va dans la diapo suivante — écris-la là, ou insère une diapo (Ctrl + Entrée).\"'",
   'poserBarreBloc : « + étape », sans « Grisé »')
un("p8DiapoASchema(e) ? 'grisé : ' + P8_UNE : 'juste après, nouvelle identité' }",
   "p8DiapoASchema(e) ? 'Cette diapo a son schéma : un second bloc n\\'y entre pas — copie ce bloc (Ctrl + C) et colle-le dans la diapo suivante' : 'juste après, nouvelle identité' }",
   'menuAtelierMur : « Dupliquer le bloc », sans « grisé »')
un("{ a: 'b-taille', l: `Taille : petit (grisé) · ${b.taille === 'grand' ? 'normal' : '[normal]'} · ${b.taille === 'grand' ? '[grand]' : 'grand'}`, t: '« petit » est grisé pour un schéma : ses libellés restent à 32 et 26 pt, lisibles du fond ; tourne : normal → grand' }",
   "{ a: 'b-taille', l: `Taille : ${b.taille === 'grand' ? 'normal' : '[normal]'} · ${b.taille === 'grand' ? '[grand]' : 'grand'}`, t: 'Un schéma garde ses libellés à 32 et 26 pt pour être lu du fond : il n\\'a pas de taille « petit » — ce geste passe de normal à grand, et retour' }",
   'menuAtelierMur : la taille d\'un schéma, sans « grisé »')
un("p8GardeColler(S.pressePapiers, e) ? 'grisé : ' + p8GardeColler(S.pressePapiers, e) :", "p8GardeColler(S.pressePapiers, e) ? p8GardeColler(S.pressePapiers, e) :", 'menuAtelierMur : « Coller ici », sans « grisé »')
un("t: !t.tete || t.li < 0 ? 'Clic droit sur une bulle de tête (une famille, un repère, un nœud de premier niveau, une étape, une rangée) : c\\'est là que le schéma se coupe' : premiere ? 'rien avant : rien à couper' :",
   "t: !t.tete || t.li < 0 ? 'Cette bulle n\\'est pas une bulle de tête : le schéma se coupe sur une famille, un repère, un nœud de premier niveau, une étape ou une rangée — fais le clic droit sur l\\'une d\\'elles' : premiere ? 'rien avant : rien à couper — fais le clic droit sur une famille plus loin : elle et la suite partiront dans un second schéma' :",
   'p8MenuBulle : « Couper le schéma ici », ce qui empêche puis quoi faire')

# ── 4 · le bloc question au tableau (dettes n°13 · 4 et 5)
# 4a. chaque question se dévoile à son tour (▶), jamais avant : la question est un élément, avant ses lignes
un("/* (p8-2) une bulle = un élément, dans l'ordre de la source ; « Tout ensemble » : aucun */ (b.el || []).forEach(",
   "/* (p8-2) une bulle = un élément, dans l'ordre de la source ; « Tout ensemble » : aucun */ if (b.t === 'question') out.push({ b: bi, e: 'q', txt: b.txt || '', t: 'question', q: true }); /* (p8-3c) la question se dévoile à son tour, avant ses lignes */ (b.el || []).forEach(",
   'elements : la question est un élément')
un("else if (b.t === 'question') { h += `<p class=\"q${marqBloc}${lumBloc}\" data-p=\"${bi}.t\" data-bloc=\"${bi}\">${surligne(esc(titre), bi + '.t', et)}</p>`;",
   "else if (b.t === 'question') { const kq = k; const qPas = kq >= et.nDev; /* (p8-3c) la question se dévoile à son tour ; ses lignes la suivent */ h += `<p class=\"q${marqBloc}${lumBloc}${qPas ? ' pas' : ''}${et.neuf === kq ? ' neuf-vu' : ''}\" data-k=\"${kq}\" data-p=\"${bi}.t\" data-bloc=\"${bi}\">${surligne(esc(titre), bi + '.t', et)}</p>`; k++;",
   'rendre : la question porte son élément')
un("const rs = reps[bi] || []; rs.forEach((r, ri) => { if (!et.pilote && !r.r) return; /* la classe ne voit jamais une ligne vide */ h += `<div class=\"rep\"",
   "const rs = reps[bi] || []; rs.forEach((r, ri) => { if (!et.pilote && !r.r) return; /* la classe ne voit jamais une ligne vide */ if (!et.pilote && qPas) return; /* (p8-3c) ni la réponse d'une question pas encore dévoilée */ h += `<div class=\"rep${qPas ? ' pas' : ''}\"",
   'rendre : les réponses suivent leur question')
un("h += `<div class=\"rep libre\" data-r=\"${ri}\"", "h += `<div class=\"rep libre${qPas ? ' pas' : ''}\" data-r=\"${ri}\"", 'rendre : la ligne de réponse libre suit sa question')
# 4b. le récit : la réponse attendue vue en classe se compte sur les lignes de la question, plus sur tous les éléments de la diapo
un("const att = (b.el || []).slice(0, Math.max(0, vu)).map(x => esc(String(x).replace(/\\.$/, '')));",
   "const att = elsB.filter(o => !o.x.q).map(o => esc(String(o.x.txt).replace(/\\.$/, ''))); /* (p8-3c) la question est un élément : ses lignes vues seulement */",
   'récit : la réponse attendue vue, sans la question')
# 4c. les cartes de fin d'heure : ce qui n'a pas été dévoilé est pâle, question comprise
un("inner.querySelectorAll('li[data-k]').forEach(li => { if (+li.dataset.k >= st.nDev) li.classList.add('pas'); });",
   "inner.querySelectorAll('[data-k]').forEach(li => { if (+li.dataset.k >= st.nDev) li.classList.add('pas'); }); /* (p8-3c) la question comprise */",
   'ouvrirFin : la question pâle si elle n\'a pas été dévoilée')
# 4d. le style : la question non dévoilée est pâle au pilote, absente au tableau ; une ligne vide garde sa hauteur (son chevron n'est plus recouvert)
un(".mur ul.etapes li::before{content:\"›\";position:absolute;left:.15em;color:#c99a4e;font-weight:700}",
   ".mur ul.etapes li::before{content:\"›\";position:absolute;left:.15em;color:#c99a4e;font-weight:700}\n"
   "/* (p8-3c) une ligne vide garde la hauteur d'une ligne : son chevron n'est plus recouvert par la question suivante ; la question non dévoilée, et ses réponses, pâles au pilote, absentes au tableau */\n"
   ".mur ul.etapes li:empty{min-height:calc(1lh + .24em)}\n.mur.pilote .q.pas,.mur.pilote .rep.pas{opacity:.45}\n.mur.tableau .q.pas,.mur.tableau .rep.pas{display:none}",
   'style : ligne vide, question non dévoilée')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHEES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f, avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
