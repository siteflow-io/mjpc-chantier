# patch-p8-5e.py — (p8-5e) la poignée des notes, en permanence (dette n°13 · 15 ; Paul, 11/10, tour 49 : « avant j'avais une poignée en bas de l'écran pour me permettre de remonter la partie notes » ; tour 50 : « fais directement sur la maquette » — filière micro, conscience n°13)
# usage : python3 patch-p8-5e.py <gabarit p8-5d> <gabarit p8-5e en sortie>
# Sept remplacements, chacun exigé une fois exactement (sinon arrêt) ; les tailles avant / après des fonctions touchées sont écrites.
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi):
    global s
    n = s.count(avant)
    if n != 1: sys.exit('ARRÊT : « %s » trouvé %d fois' % (quoi, n))
    s = s.replace(avant, apres); journal.append('%s : %d → %d o' % (quoi, len(avant.encode()), len(apres.encode())))
def bloc(debut):
    i = s.index(debut); return s[i:s.index('\n', i)]
TOUCHES = ['(function poigneeMur(){', 'function arreterRepetition(', 'function dimensionner(']
avant_t = {f: (len(bloc(f).encode()), bloc(f).count('\n') + 1) for f in TOUCHES}

# 1. la poignée est visible partout (atelier, classe, répétition), plus seulement pendant la préparation du cahier ; la règle de la préparation devient inutile et s'en va
un(".poignee-mur{display:none;height:12px;cursor:row-resize;align-items:center;justify-content:center}",
   ".poignee-mur{display:flex;height:12px;cursor:row-resize;align-items:center;justify-content:center}",
   'CSS : la poignée visible partout')
un(".corps.prep .poignee-mur{display:flex}", "", 'CSS : la règle de la préparation retirée')
# 2. l'infobulle, pour Paul
un('title="Tire vers le haut pour agrandir la diapo, vers le bas pour donner la place à la préparation (comme PowerPoint)"',
   'title="Tire vers le haut pour agrandir tes notes (la diapo rétrécit), vers le bas pour agrandir la diapo — comme PowerPoint ; double-clic : la diapo reprend toute sa place. La hauteur choisie reste d\'une diapo à l\'autre et d\'un mode à l\'autre. Pendant la préparation du cahier, la même poignée donne la place à la préparation."',
   'infobulle de la poignée')
# 3. double-clic : retour à la hauteur de départ
un("journal('poignee-diapo', { part: Math.round((S.murPart || 1) * 100) }); tout(); }; document.addEventListener('mousemove', move); document.addEventListener('mouseup', up); }); })();",
   "journal('poignee-diapo', { part: Math.round((S.murPart || 1) * 100) }); tout(); }; document.addEventListener('mousemove', move); document.addEventListener('mouseup', up); }); pg.addEventListener('dblclick', ev => { ev.preventDefault(); S.murPart = 1; journal('poignee-diapo', { part: 100 }); tout(); }); /* (p8-5e) double-clic : la diapo reprend toute sa place */ })();",
   'poigneeMur : le double-clic')
# 4. la hauteur choisie survit à l'arrêt de la répétition (c'est un réglage d'affichage, pas du jeu)
un("function arreterRepetition(){ if (!S.repetition) return; clearInterval(S._repTick); const snap = S.repSnap; const di = S.di;",
   "function arreterRepetition(){ if (!S.repetition) return; clearInterval(S._repTick); const snap = S.repSnap; const di = S.di; const murPart = S.murPart; /* (p8-5e) la hauteur des notes n'est pas du jeu : elle reste */",
   'arreterRepetition : garder murPart (1/2)')
un("S.repetition = false; delete S.repSnap; S.di = di; document.querySelector('.haut').classList.remove('p8-rep');",
   "S.repetition = false; delete S.repSnap; S.di = di; if (murPart != null) S.murPart = murPart; document.querySelector('.haut').classList.remove('p8-rep');",
   'arreterRepetition : garder murPart (2/2)')

# 5. hors préparation, la poignée agit dès le premier pixel : à 1280 px de large, la diapo est bornée par la largeur, et une part de la hauteur disponible ne la faisait bouger qu'en dessous de ~70 % (zone morte mesurée au banc) ; la part s'applique donc à la hauteur obtenue. En préparation du cahier, la formule d'aujourd'hui ne change pas.
un("const hDispo = (sc.clientHeight - outils) * (S.murPart || 1); const part = S.vue || 1;\n  let w = Math.min(wDispo, hDispo * 16 / 9) * part; let h = w * 9 / 16; if (h > hDispo) { h = hDispo; w = h * 16 / 9; } cadre.style.width",
   "const hDispo = (sc.clientHeight - outils) * (S.preparation ? (S.murPart || 1) : 1); const part = S.vue || 1;\n  let w = Math.min(wDispo, hDispo * 16 / 9) * part; let h = w * 9 / 16; if (h > hDispo) { h = hDispo; w = h * 16 / 9; } if (!S.preparation && (S.murPart || 1) < 1) { h = h * S.murPart; w = h * 16 / 9; } /* (p8-5e) hors préparation, la part s'applique à la hauteur obtenue : la poignée agit dès le premier pixel */ cadre.style.width",
   'dimensionner : la poignée agit dès le premier pixel hors préparation')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHES:
    a = bloc(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f.strip('(').split('(')[0].replace('function ', ''), avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
