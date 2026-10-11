# patch-p8-3.py — (p8-3) un schéma par diapo : les gestes et leurs gardes (mandat p8, version 3)
# usage : python3 patch-p8-3.py <gabarit p8-2> <p8-3-gestes.js> <gabarit p8 en sortie>
# Chaque remplacement est exigé UNE fois exactement (sinon arrêt) ; les tailles avant / après de chaque fonction touchée sont écrites.
import sys, re
src, gestes, out = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8').read(); G = open(gestes, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi):
    global s
    n = s.count(avant)
    if n != 1: sys.exit('ARRÊT : « %s » trouvé %d fois' % (quoi, n))
    s = s.replace(avant, apres); journal.append('%s : %d → %d o' % (quoi, len(avant.encode()), len(apres.encode())))
def fonction(nom):
    i = s.index('function ' + nom + '(')
    fins = [s.find(x, i + 1) for x in ('\nfunction ', '\n/*', '\nconst ', '\nlet ', '\n$(', '\ndocument.', '\nwindow.', '\nsetInterval')]
    return s[i:min(x for x in fins if x > 0)]
for nom in re.findall(r'function (p8\w+)', G) + ['P8_FORMES', 'P8_REGLES', 'P8_UNE', 'p8-grise', 'p8-panneau', 'p8-rgl', 'p8-regle', 'p8-reord', 'p8-src', 'e-sim-vraie-carte', 'a0-figures']:
    if nom in s: sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % nom)
TOUCHEES = ['choixObjet', 'formulaireObjet', 'menuAtelierMur', 'alertesForme', 'droiteAtelier0', 'rendreDroiteAtelier', 'brancherAtelier', 'poserBarreBloc', 'tout']
avant_t = {f: len(fonction(f).encode()) for f in TOUCHEES}

# 0. la simulation (déclarée) : la vraie carte « Les figures de style » du chapitre 3e, sur une diapo à elle, en H2 avant le bilan, activité « 10 ter »
VRAIE = "Figures d'analogie : personnification, comparaison, métaphore, allégorie\\nFigures d'opposition : antithèse, oxymore, antiphrase\\nFigures de substitution : métonymie, synecdoque, périphrase, ironie\\nFigures d'insistance : anaphore, répétition, pléonasme\\nFigures d'amplification : hyperbole, accumulation, gradation\\nFigures d'atténuation : euphémisme, litote\\nFigures syntaxiques : parallélisme, chiasme, ellipse\\nProcédés sonores : allitération, assonance, onomatopée, homophone"
SIM = "/* (p8-3) simulation de la donnée : la vraie carte « Les figures de style » du chapitre 3e (CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json : 8 familles, 26 notions, sans réglage de dévoilement), sur une diapo à elle, en H2 juste avant le bilan, activité « 10 ter » — une diapo qu'aucun banc existant n'exerce (n°12 · 71) */ (function(){ const se = DATA.seances[0]; if (se.ecrans.some(e => e.eid === 'e-sim-vraie-carte')) return; let k = se.ecrans.findIndex(e => e.heure === 2 && e.role === 'bilan'); if (k < 0) k = se.ecrans.length; se.ecrans.splice(k, 0, { eid: 'e-sim-vraie-carte', act: 'Les figures de style', heure: 2, dur: 6, actId: 'a0-figures', comp: [], blocs: [{ t: 'schema', bid: 'b-sim-vraie-carte', txt: 'Les figures de style', forme: 'carte', src: \"" + VRAIE + "\" }] }); DATA.activites['0'] = DATA.activites['0'] || []; DATA.activites['0'].push({ id: 'a0-figures', num: '10 ter', titre: 'Les figures de style', diapos: [] }); })(); "
un("DATA.seances.forEach(se => se.ecrans.forEach(e => (e.blocs || []).forEach(b => { if (b.t === 'schema' && !b.src)",
   SIM + "DATA.seances.forEach(se => se.ecrans.forEach(e => (e.blocs || []).forEach(b => { if (b.t === 'schema' && !b.src)", 'simulation : la vraie carte')

# 1. les gestes p8-3, à part (après la préhension de p8-2)
un("function blocDe(el){", G.rstrip('\n') + "\nfunction blocDe(el){", 'insertion des gestes p8-3')

# 2. « Schéma… » : sur une diapo pleine, une diapo nouvelle juste après (décision 1)
un("ajouterBloc({ t: 'schema', txt: tt, forme: $('of-forme').value, echelle: 'plein', src: lignes.join('\\n'), el: lignes.map(x => x.trim()), devoilerTout: false /* (p8-2) décision 6 ter : créé par « Schéma… », il part « Un à un » */ }, false);",
   "p8PoserSchema({ t: 'schema', txt: tt, forme: $('of-forme').value, echelle: 'plein', src: lignes.join('\\n'), el: lignes.map(x => x.trim()), devoilerTout: false /* (p8-2) décision 6 ter : créé par « Schéma… », il part « Un à un » */ }); /* (p8-3) décision 1 : sur une diapo qui a déjà du contenu, il part dans une diapo nouvelle, juste après */",
   'formulaire schéma : p8PoserSchema')

# 3. « + bloc » : chaque carte grisée dit pourquoi (« une diapo n'a qu'un schéma »…)
un("${OBJETS.map(o => `<div class=\"c${o.dernier ? ' dernier' : ''}${o.off ? ' off' : ''}\" data-t=\"${o.t}\" title=\"${esc(o.d)}\"><b>${o.l}</b><span>${esc(o.d)}</span></div>`).join('')}",
   "${OBJETS.map(o => { const g8 = p8GardeObjet(o.t, e); /* (p8-3) */ return `<div class=\"c${o.dernier ? ' dernier' : ''}${o.off || g8 ? ' off' : ''}\" data-t=\"${o.t}\" title=\"${esc(g8 ? 'Grisé : ' + g8 + '.' : o.d)}\"><b>${o.l}</b><span>${esc(g8 ? 'grisé : ' + g8 : o.d)}</span></div>`; }).join('')}",
   'choixObjet : les cartes grisées')

# 4. la barre de l'atelier : « + bloc », « + étape », « + image »… grisés sur une diapo à schéma, avec la raison
un("function tout(){ setTimeout(brancherDocs, 0); if (S.atelier) { observerMur(); setTimeout(brancherAtelier, 0);",
   "function tout(){ setTimeout(brancherDocs, 0); if (S.atelier) { observerMur(); setTimeout(brancherAtelier, 0); p8GardesBarre(); /* (p8-3) les gestes grisés d'une diapo à schéma */",
   'tout : les gardes de la barre')
# la barre du bloc : « + étape » grisé sur une diapo à schéma
un("<button data-bb=\"etape\" title=\"Ajoute un élément à la fin de ce bloc (Entrée en fin de ligne fait pareil)\">+ étape</button>",
   "<button data-bb=\"etape\" ${p8DiapoASchema(e) ? 'disabled title=\"Grisé : ' + P8_UNE + ' : pas d\\'étape en plus (un schéma par diapo).\"' : 'title=\"Ajoute un élément à la fin de ce bloc (Entrée en fin de ligne fait pareil)\"'}>+ étape</button>",
   'poserBarreBloc : + étape')
# Entrée en fin de ligne crée un élément : pas sur une diapo à schéma (le même geste que « + étape »)
un("const bloc = e.blocs[b.bi]; bloc.el = bloc.el || []; bloc.el.splice(b.ei + 1, 0, '');",
   "if (p8DiapoASchema(e)) { toast('Pas d\\'élément en plus : ' + P8_UNE + '.'); return; } /* (p8-3) */ const bloc = e.blocs[b.bi]; bloc.el = bloc.el || []; bloc.el.splice(b.ei + 1, 0, '');",
   'brancherAtelier : Entrée')

# 5. le clic droit : sur une bulle, « Couper le schéma ici » ; sur le bloc schéma, dupliquer / coller / taille gardés
un("function menuAtelierMur(ev){ const li = ev.target.closest('li[data-p]');",
   "function menuAtelierMur(ev){ const g8 = ev.target.closest && ev.target.closest('#mur .p8-dessin g.p8-n, #mur .p8-dessin .p8-grille tr'); if (g8) { p8MenuBulle(g8, ev); return; } /* (p8-3) décision 5 */ const li = ev.target.closest('li[data-p]');",
   'menuAtelierMur : la bulle')
un("{ a: 'b-dupliquer', l: 'Dupliquer le bloc', t: 'juste après, nouvelle identité' }",
   "{ a: 'b-dupliquer', l: 'Dupliquer le bloc', off: b.t !== 'schema' && p8DiapoASchema(e), t: b.t === 'schema' ? 'une diapo n\\'a qu\\'un schéma : la copie part dans une diapo nouvelle, juste après (même heure, même activité, mêmes notions, la durée partagée), nouvelle identité' : p8DiapoASchema(e) ? 'grisé : ' + P8_UNE : 'juste après, nouvelle identité' }",
   'menu du bloc : dupliquer')
un("{ a: 'b-taille', l: `Taille : ${b.taille === 'petit' ? '[petit]' : 'petit'} · ${!b.taille || b.taille === 'normal' ? '[normal]' : 'normal'} · ${b.taille === 'grand' ? '[grand]' : 'grand'}`, t: 'tourne : petit → normal → grand ; la classe le verra à cette taille' }",
   "(b.t === 'schema' ? { a: 'b-taille', l: `Taille : petit (grisé) · ${b.taille === 'grand' ? 'normal' : '[normal]'} · ${b.taille === 'grand' ? '[grand]' : 'grand'}`, t: '« petit » est grisé pour un schéma : ses libellés restent à 32 et 26 pt, lisibles du fond ; tourne : normal → grand' } : { a: 'b-taille', l: `Taille : ${b.taille === 'petit' ? '[petit]' : 'petit'} · ${!b.taille || b.taille === 'normal' ? '[normal]' : 'normal'} · ${b.taille === 'grand' ? '[grand]' : 'grand'}`, t: 'tourne : petit → normal → grand ; la classe le verra à cette taille' })",
   'menu du bloc : taille')
un("{ a: 'b-coller', l: 'Coller ici', off: !S.pressePapiers, t: S.pressePapiers ? 'Ctrl + V — coller donne toujours une nouvelle identité : le bloc est neuf jusqu\\'à sa première apparition' : 'rien dans le presse-papiers' }",
   "{ a: 'b-coller', l: 'Coller ici', off: !S.pressePapiers || !!p8GardeColler(S.pressePapiers, e), t: !S.pressePapiers ? 'rien dans le presse-papiers' : p8GardeColler(S.pressePapiers, e) ? 'grisé : ' + p8GardeColler(S.pressePapiers, e) : S.pressePapiers.t === 'schema' && !p8DiapoLibre(e) ? 'un schéma a sa diapo : il part dans une diapo nouvelle, juste après (même heure, même activité, mêmes notions, la durée partagée), nouvelle identité' : 'Ctrl + V — coller donne toujours une nouvelle identité : le bloc est neuf jusqu\\'à sa première apparition' }",
   'menu du bloc : coller')
un("if (act === 'b-dupliquer') { e.blocs.splice(bi + 1, 0, cloneBloc(b));",
   "if (act === 'b-dupliquer' && b.t === 'schema') { if (e.role === 'bilan') { toast('Rien ne s\\'insère après le bilan.'); return; } const n = p8DiapoApres(S.di, [cloneBloc(b)]); apresTrame({ di: S.di, dupliqueSchema: n.eid }); toast('Schéma dupliqué dans une diapo nouvelle, juste après : « ' + n.act + ' » — une diapo n\\'a qu\\'un schéma.'); tout(); return; } /* (p8-3) */ if (act === 'b-dupliquer') { e.blocs.splice(bi + 1, 0, cloneBloc(b));",
   'menu du bloc : dupliquer un schéma')
un("if (act === 'b-taille') { b.taille = b.taille === 'petit' ? 'normal' : (!b.taille || b.taille === 'normal') ? 'grand' : 'petit';",
   "if (act === 'b-taille') { b.taille = b.t === 'schema' ? (b.taille === 'grand' ? 'normal' : 'grand') /* (p8-3) « petit » grisé pour un schéma */ : b.taille === 'petit' ? 'normal' : (!b.taille || b.taille === 'normal') ? 'grand' : 'petit';",
   'menu du bloc : la taille d\'un schéma')
un("if (act === 'b-coller') { e.blocs.splice(bi + 1, 0, cloneBloc(S.pressePapiers));",
   "if (act === 'b-coller' && S.pressePapiers && S.pressePapiers.t === 'schema' && !p8DiapoLibre(e)) { if (e.role === 'bilan') { toast('Rien ne s\\'insère après le bilan.'); return; } const n = p8DiapoApres(S.di, [cloneBloc(S.pressePapiers)]); apresTrame({ di: S.di, colleSchema: n.eid }); toast('Schéma collé dans une diapo nouvelle, juste après : « ' + n.act + ' » — un schéma a sa diapo ; celle-ci n\\'a pas changé.'); tout(); return; } /* (p8-3) */ if (act === 'b-coller') { e.blocs.splice(bi + 1, 0, cloneBloc(S.pressePapiers));",
   'menu du bloc : coller un schéma')

# 6. « À régler » : la trame d'avant la règle — un schéma avec du texte
un("if (S.atelier && !S.repetition) { E.forEach((e2, i2) =>",
   "E.forEach((e2, i2) => { if (!p8AvecTexte(e2) || e2.role === 'fin') return; const bi2 = e2.blocs.findIndex(b => b.t === 'schema'); out.push({ di: i2, bi: bi2, k: 'texte', l: 'Schéma avec du texte : donne-lui sa diapo — clic droit sur le bloc → Couper la diapo ici', ou: `diapo ${i2 + 1} · « ${e2.act} » · bloc ${bi2 + 1}`, faire: 'un schéma par diapo : ' + P8_UNE + ' (cadrage 4, 3.2)', copier: `Diapo « ${e2.act} » : le schéma « ${e2.blocs[bi2].txt || ''} » doit avoir sa diapo (son titre, le schéma, au plus une consigne d'une ligne).` }); }); /* (p8-3) la trame d'avant la règle */ if (S.atelier && !S.repetition) { E.forEach((e2, i2) =>",
   'alertesForme : schéma avec du texte')

# 7. le panneau du schéma dans la colonne de droite de l'atelier (décision 6 bis), jamais reconstruit pendant qu'on y écrit
un("/* pour la classe : le temps et les notions */ const alertes = [];",
   "x += p8Panneau(e); /* (p8-3) le panneau du schéma */ /* pour la classe : le temps et les notions */ const alertes = [];",
   'droiteAtelier0 : le panneau')
un("const hd = droiteAtelier(); if (da.innerHTML !== hd) { da.innerHTML = hd;",
   "const hd = droiteAtelier(); const ecrit8 = document.activeElement && document.activeElement.id === 'p8-src' && da.contains(document.activeElement); /* (p8-3) on n'efface pas le champ où Paul écrit */ if (da.innerHTML !== hd && !ecrit8) { da.innerHTML = hd; p8BrancherPanneau(da);",
   'rendreDroiteAtelier : le panneau')

# 7 bis. la fenêtre « À régler » (et le choix d'objet) ne dépasse plus de l'écran : avec les lignes nouvelles, sa croix passait sous la barre du haut — elle défile, sa tête reste en vue
un(".choix-obj{position:absolute;left:12px;right:12px;bottom:60px;", ".choix-obj{position:absolute;left:12px;right:12px;bottom:60px;max-height:calc(100% - 80px);overflow-y:auto;", 'choix-obj : hauteur bornée')
un(".choix-obj h4{margin:0 0 8px;", ".choix-obj h4{position:sticky;top:-12px;background:#fbfaf5;padding-top:4px;z-index:1;margin:0 0 8px;", 'choix-obj : la tête reste en vue')

# 8. le style : classes préfixées p8- (n°12 · 40, 48)
CSS = ".p8-panneau .p8-rgl{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}.p8-panneau .p8-rgl button{background:#191411;color:var(--texte2);border:1px solid var(--bord);border-radius:4px;padding:3px 7px;font:inherit;font-size:.8rem;cursor:pointer}.p8-panneau .p8-rgl button.on{border-color:var(--or);color:var(--or)}.p8-panneau label{display:block;font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;color:var(--texte2);margin:8px 0 3px}.p8-panneau textarea{width:100%;box-sizing:border-box;background:#191411;color:var(--texte);border:1px solid var(--bord);border-radius:4px;padding:6px;font:inherit;font-size:.8rem;resize:vertical}.p8-panneau .p8-regle{font-size:.75rem;color:var(--texte2);margin:3px 0 6px;font-style:italic}.p8-panneau .p8-reord{background:#191411;color:var(--texte2);border:1px solid var(--bord);border-radius:4px;padding:3px 9px;font:inherit;font-size:.8rem;cursor:pointer}.btn.p8-grise,.btn.p8-grise:hover{opacity:.45;cursor:not-allowed}\n</style></head><body>"
un("\n</style></head><body>", "\n" + CSS, 'le style p8-3')

open(out, 'w', encoding='utf-8').write(s)
print('écrit', out, len(s.encode()), 'o')
for l in journal: print(' ·', l)
for f in TOUCHEES: print(' · fonction %s : %d → %d o' % (f, avant_t[f], len(fonction(f).encode())))
