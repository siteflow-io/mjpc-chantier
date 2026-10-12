# patch-p8-5f.py — (p8-5f) la diapo trop pleine se lit en pages, jamais hors du cadre (dette n°13 · 16 ; Paul, 11/10 : « quand j'écris dans une diapo, le texte sort par le haut » ; complément p8-5f, validé le 12/10, tour 53)
# usage : python3 patch-p8-5f.py <gabarit p8-5e> <gabarit p8-5f en sortie>
# Chaque remplacement est exigé une fois exactement (sinon arrêt) ; les tailles avant / après des fonctions touchées sont écrites.
# Les noms nouveaux sont préfixés p85f et ont été cherchés dans le gabarit avant d'être écrits (absents) : p85fHaut, p85fSuivreFrappe, p85fCle, la classe p85f-ancre.
import sys
src, out = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi):
    global s
    n = s.count(avant)
    if n != 1: sys.exit('ARRÊT : « %s » trouvé %d fois' % (quoi, n))
    s = s.replace(avant, apres); journal.append('%s : %d → %d o' % (quoi, len(avant.encode()), len(apres.encode())))
def fonction(debut):
    # une fonction du gabarit : de son en-tête jusqu'à la ligne qui commence la définition suivante
    i = s.index(debut); j = i
    while True:
        j = s.index('\n', j + 1)
        nxt = s[j + 1:j + 40]
        if nxt.startswith(('function ', 'const ', 'let ', 'var ', '// ', '$(', 'document.', 'window.', 'mur.', 'setInterval')): return s[i:j]
TOUCHES = ['function rendre(', 'function paginer(', 'function pageDeSuivi(', 'function appliquerPages(', 'function ecrireDansDiapo(', 'function focaliser(']
avant_t = {f: (len(fonction(f).encode()), fonction(f).count('\n') + 1) for f in TOUCHES}
for n in ['p85fHaut', 'p85fSuivreFrappe', 'p85fCle', 'p85f-ancre']:
    if n in s: sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % n)

# 1. (point 2) paginer mesure chaque ligne par rapport au corps de la diapo, plus jamais par rapport à son bloc :
#    `.mur .bloc{position:relative}` (et `.bloc-edit` dans l'atelier) fait du bloc l'offsetParent de ses lignes, dont les offsetTop repartaient de zéro à chaque bloc.
un("const top0 = els.length ? els[0].offsetTop : 0; const pages = []; let cur = [], debut = 0;\n  els.forEach((l, i) => { const bas = l.offsetTop + l.offsetHeight - top0; if (bas - debut > H - base && cur.length) { pages.push(cur); cur = []; debut = l.offsetTop - top0; } cur.push(i); }); pages.push(cur);",
   "const top0 = els.length ? p85fHaut(els[0], corps) : 0; const pages = []; let cur = [], debut = 0; /* (p8-5f) la hauteur de chaque ligne dans le corps, quel que soit son bloc */\n  els.forEach((l, i) => { const y = p85fHaut(l, corps); const bas = y + l.offsetHeight - top0; if (bas - debut > H - base && cur.length) { pages.push(cur); cur = []; debut = y - top0; } cur.push(i); }); pages.push(cur);\n  { const pageAvant = et.page; const limite = H - (parseFloat(getComputedStyle(corps).paddingBottom) || 0); for (let pi = 0; pi < pages.length && pi < 60; pi++) { et.pages = pages; et.page = pi; appliquerPages(mur, et); const p = pages[pi]; const k = p.findIndex(i => p85fHaut(els[i], corps) + els[i].offsetHeight > limite + 1); if (k > 0) { const suite = pages[pi + 1]; pages.splice(pi, suite ? 2 : 1, p.slice(0, k), p.slice(k).concat(suite || [])); } } et.page = pageAvant; } /* (p8-5f) chaque page est montrée et mesurée sur ses boîtes réelles (titres, consignes, écarts entre blocs compris) : une ligne qui passe la marge du bas ouvre la page suivante, qui reprend la suite et se mesure à son tour ; une ligne seule trop haute reste (ancrée en haut, coupée en bas) */",
   'paginer : la mesure par rapport au corps, chaque page vérifiée sur ses boîtes réelles')
# la mesure : le cumul des offsetTop jusqu'au corps (insensible au zoom du tableau et au défilement) ; si la chaîne ne passe pas par le corps, les boîtes rendues, ramenées à l'échelle
un("function loupeSur(mur, et){",
   "function p85fHaut(l, corps){ let y = 0, n = l; while (n && n !== corps) { y += n.offsetTop; n = n.offsetParent; } if (n === corps) return y; const r = corps.getBoundingClientRect(); const k = r.height && corps.offsetHeight ? corps.offsetHeight / r.height : 1; return (l.getBoundingClientRect().top - r.top) * k + corps.scrollTop; } /* (p8-5f) la hauteur d'une ligne dans le corps de la diapo, où qu'elle soit */\n"
   "function p85fSuivreFrappe(el){ const c = $('mur').querySelector('.corpsd'); if (!c || !el || !c.contains(el)) return; const rb = el.getBoundingClientRect(), cb = c.getBoundingClientRect(); const deborde = c.scrollHeight > c.clientHeight + 2; if (rb.bottom > cb.bottom + 1 || rb.top < cb.top - 1 || deborde !== !!c._p85fDeborde) { c._p85fDeborde = deborde; S.pageManuelle = false; tout(); if (document.activeElement === el && el.isConnected) { const z = el.closest('ul, ol, .bloc, p') || el.parentElement; if (z && !z.classList.contains('bloc-edit')) { $('mur').querySelectorAll('.bloc-edit').forEach(y => y.classList.remove('bloc-edit')); z.classList.add('bloc-edit'); poserBarreBloc(z, blocDe(el)); } } } } /* (p8-5f) dans l'atelier, la frappe qui fait passer la ligne sous le cadre redessine : la page suit la ligne tapée (le redessin ne touche pas l'élément qui a le focus ; le cadre et la barre du bloc en cours d'édition sont remis, comme au focus) */\n"
   "document.addEventListener('scroll', ev => { const c = ev.target; if (c && c.classList && c.classList.contains('corpsd') && !c.classList.contains('cahier') && c.scrollTop) c.scrollTop = 0; }, true); /* (p8-5f) le navigateur fait défiler le corps pour montrer le curseur : il revient en haut, rien ne sort par le haut (la mesure du corps, elle, ne change pas) */\n"
   "function loupeSur(mur, et){",
   'p85fHaut, p85fSuivreFrappe et l\'écoute du défilement (nouvelles)')

# 2. (point 4) dans l'atelier, la page suit la ligne où Paul écrit ; sans curseur dans la diapo, la page affichée reste (sinon la première)
un("function pageDeSuivi(et, els, pages){ let cible = -1; els.forEach((l, i) => { if (l.classList.contains('libre') && et._blocActif != null && +l.dataset.bi === et._blocActif) cible = i; });",
   "function pageDeSuivi(et, els, pages){ let cible = -1; els.forEach((l, i) => { if (l.classList.contains('libre') && et._blocActif != null && +l.dataset.bi === et._blocActif) cible = i; });\n  if (et.atelier) { const f = (S._p85fCible != null && $('mur').querySelector(`[data-p=\"${S._p85fCible}\"]`)) || document.activeElement; const fi = f ? els.findIndex(l => l === f || l.contains(f)) : -1; if (fi < 0) return et.page != null && et.page < pages.length ? et.page : 0; cible = fi; } /* (p8-5f) l'atelier : la page de la ligne qui a le curseur, ou de celle qui va le recevoir */",
   'pageDeSuivi : l\'atelier suit le curseur')

# 3. (point 4) dans l'atelier, rendre travaille sur une copie de l'état (tout dévoilé) : les pages qu'il calcule reviennent à l'état du pilote, pour le compteur, la molette et Maj+←/→
un("function rendre(mur, et){ if (et && et.atelier && et.pilote) { et = Object.assign({}, et, { nDev: elements(DATA.seances[et.si].ecrans[et.di]).length }); }",
   "function rendre(mur, et){ const et0 = et; /* (p8-5f) */ if (et && et.atelier && et.pilote) { et = Object.assign({}, et, { nDev: elements(DATA.seances[et.si].ecrans[et.di]).length }); }",
   'rendre : garder l\'état reçu (1/3)')
# 4. (point 3) rien ne sort jamais du cadre : le corps n'est plus défilé jusqu'en bas ; une page qui déborde encore (une ligne seule plus haute que la diapo) est ancrée en haut et coupée en bas
un("const corpsF = mur.querySelector('.corpsd'); if (corpsF && et._blocActif != null && corpsF.scrollHeight > corpsF.clientHeight + 2) corpsF.scrollTop = corpsF.scrollHeight;\n",
   "const corpsF = mur.querySelector('.corpsd'); if (corpsF && !corpsF.classList.contains('cahier')) { corpsF.scrollTop = 0; corpsF.classList.toggle('p85f-ancre', !corpsF.classList.contains('plein-img') && corpsF.scrollHeight > corpsF.clientHeight + 2); corpsF._p85fDeborde = corpsF.scrollHeight > corpsF.clientHeight + 2; } /* (p8-5f) jamais défilé : ancré en haut, coupé en bas */\n",
   'rendre : ancré en haut, jamais défilé (2/3)')
un("  loupeSur(mur, et);\n}\nfunction surligne(",
   "  loupeSur(mur, et);\n  if (et0 && et0 !== et) { et0.pages = et.pages; et0.page = et.page; et0.policeReduite = et.policeReduite; et0.policeRatio = et.policeRatio; } /* (p8-5f) les pages de l'atelier reviennent au pilote */\n}\nfunction surligne(",
   'rendre : les pages reviennent à l\'état reçu (3/3)')
un(".mur .ecran{position:absolute;inset:0;padding:3.2% 3.6%;display:flex;flex-direction:column;gap:1.2%;overflow:hidden;box-sizing:border-box;background:#fffdf9;color:#22303f}",
   ".mur .ecran{position:absolute;inset:0;padding:3.2% 3.6%;display:flex;flex-direction:column;gap:1.2%;overflow:hidden;box-sizing:border-box;background:#fffdf9;color:#22303f}\n.mur .corpsd.p85f-ancre{justify-content:flex-start}",
   'CSS : ancré en haut quand une page déborde')

# 4 bis. (règle du redessin) le curseur qui passe à une ligne d'une autre page (Entrée, Tab, Échap) : la page de cette ligne s'affiche d'abord, puis le curseur s'y pose — sinon il tombait sur une ligne cachée et la frappe allait dans la ligne d'avant (trouvé au premier passage : « Ligne 6…Ligne 5… » dans le même élément)
un("function focaliser(el, fin){ if (!el) return; if (!el.getAttribute('contenteditable')) brancherAtelier(); /* le rendu du mur est différé : on branche avant de mettre le curseur */ el.focus();",
   "function focaliser(el, fin){ if (!el) return; if (S.atelier && el.closest('.hors') && el.dataset.p) { S._p85fCible = el.dataset.p; S.pageManuelle = false; tout(); el = $('mur').querySelector(`[data-p=\"${S._p85fCible}\"]`) || el; S._p85fCible = null; } /* (p8-5f) la page de la ligne d'abord */ if (!el.getAttribute('contenteditable')) brancherAtelier(); /* le rendu du mur est différé : on branche avant de mettre le curseur */ el.focus();",
   'focaliser : la page de la ligne d\'abord')

# 5. (point 4 et règle du redessin) dans l'atelier, la frappe suit sa page
un("marquerModif({ di: S.di, bi: b.bi, ei: b.ei, n: txt.length }); if (S.repetition) tout();",
   "marquerModif({ di: S.di, bi: b.bi, ei: b.ei, n: txt.length }); if (S.repetition) tout(); else if (S.atelier) p85fSuivreFrappe(el); /* (p8-5f) */",
   'ecrireDansDiapo : la frappe suit sa page')

# 5 bis. (point 5) le tableau montre la même page que le pilote, à la même police : il reçoit les pages du pilote (et.pages) et les applique sans repasser par paginer, donc sans réduire sa police ;
#    le pilote lui passe la police qu'il a trouvée, en part de la hauteur de la diapo (et.policeRatio), que le tableau rapporte à sa propre hauteur (trouvé au banc : 3 lignes sous le cadre à la page 1 du tableau)
un("et.policeReduite = px < policePx(murH, pt0) - 0.1 ? Math.round(px / policePx(murH, 32) * 32) : null; } else et.policeReduite = null;",
   "et.policeReduite = px < policePx(murH, pt0) - 0.1 ? Math.round(px / policePx(murH, 32) * 32) : null; } else et.policeReduite = null; et.policeRatio = corps.style.fontSize && murH ? parseFloat(corps.style.fontSize) / murH : null; /* (p8-5f) la police de la diapo, en part de sa hauteur : le tableau la reprend */",
   'paginer : la police passe au tableau')
un("else if (et.pages) appliquerPages(mur, et); else paginer(mur, et);",
   "else if (et.pages) { const cP = mur.querySelector('.corpsd'); if (cP && et.policeRatio) cP.style.fontSize = (et.policeRatio * (mur.clientHeight || 616)).toFixed(2) + 'px'; appliquerPages(mur, et); } /* (p8-5f) les pages du pilote, à sa police rapportée à la hauteur du tableau */ else paginer(mur, et);",
   'rendre : le tableau applique les pages du pilote à sa police')

# 5 ter. (point 5) au pilote, la page suit le dernier élément dévoilé : un champ de réponse (data-r) ne compte que dévoilé, comme les autres éléments
#    (dans la base, tout champ de réponse comptait, dévoilé ou non : à 0 dévoilé, le pilote montrait la page du dernier champ ; trouvé par test-p8-4-ecrire)
un("if (l.dataset.k != null && +l.dataset.k < et.nDev) last = i; if (l.dataset.r != null) last = i; });",
   "if (l.dataset.k != null && +l.dataset.k < et.nDev) last = i; if (l.dataset.r != null && !l.classList.contains('pas')) last = i; }); /* (p8-5f) un champ de réponse ne compte que dévoilé */",
   'pageDeSuivi : un champ de réponse ne compte que dévoilé')
# 5 quater. (point 5) le tableau ne rend pas les champs de réponse non dévoilés : il reçoit les pages du pilote par identité (data-p, ou bloc et réponse), plus par position
#    (par position, les indices du pilote tombaient sur d'autres lignes du tableau, qui cachait tout ; trouvé par test-p8-4-ecrire)
un("et.pages = pages; if (!et._pageManuelle || et.page == null || et.page >= pages.length) et.page = pageDeSuivi(et, els, pages); appliquerPages(mur, et);",
   "et.pages = pages; et.pagesP = pages.map(p => p.map(i => p85fCle(els[i]))); /* (p8-5f) les pages par identité, pour le tableau */ if (!et._pageManuelle || et.page == null || et.page >= pages.length) et.page = pageDeSuivi(et, els, pages); appliquerPages(mur, et);",
   'paginer : les pages par identité')
un("{ const cP = mur.querySelector('.corpsd'); if (cP && et.policeRatio) cP.style.fontSize = (et.policeRatio * (mur.clientHeight || 616)).toFixed(2) + 'px'; appliquerPages(mur, et); }",
   "{ const cP = mur.querySelector('.corpsd'); if (cP && et.policeRatio) cP.style.fontSize = (et.policeRatio * (mur.clientHeight || 616)).toFixed(2) + 'px'; if (cP && et.pagesP) { const cles = Array.from(cP.querySelectorAll('li, .rep')).map(p85fCle); et.pages = et.pagesP.map(p => p.map(c => cles.indexOf(c)).filter(i => i >= 0)); } appliquerPages(mur, et); }",
   'rendre : le tableau retrouve les pages du pilote par identité')
un("function p85fHaut(l, corps){", "function p85fCle(l){ return l.dataset.p || ('r' + l.dataset.bi + '.' + l.dataset.r + '.' + (l.dataset.k || '')); } /* (p8-5f) l'identité d'une ligne de page, la même au pilote et au tableau */\nfunction p85fHaut(l, corps){", 'p85fCle (nouvelle)')

# 6. toute fonction que le rendu appelle passe au tableau (n°12 · 75)
un("paginer, pageDeSuivi, appliquerPages,", "paginer, p85fHaut, p85fCle, pageDeSuivi, appliquerPages,", 'tableau : p85fHaut et p85fCle passent')

open(out, 'w', encoding='utf-8').write(s)
for j in journal: print(j)
for f in TOUCHES:
    a = fonction(f); print('%s : %d o / %d lignes → %d o / %d lignes' % (f.replace('function ', '').strip('('), avant_t[f][0], avant_t[f][1], len(a.encode()), a.count('\n') + 1))
for f in ['function p85fHaut(', 'function p85fSuivreFrappe(', 'function p85fCle(']:
    a = fonction(f); print('%s (nouvelle) : %d o / %d lignes' % (f.replace('function ', '').strip('('), len(a.encode()), a.count('\n') + 1))
