# patch-p8-2.py — (p8-2) le moteur des schémas de l'ancien déroulé, repris à part sous le préfixe p8 (mandat p8, version 3)
# usage : python3 patch-p8-2.py <gabarit p7> <moteur p8-moteur.js> <gabarit p8-2 en sortie>
# Chaque remplacement est exigé UNE fois exactement (sinon arrêt) ; les tailles avant / après de chaque fonction touchée sont écrites.
import sys, re
src, moteur, out = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src, encoding='utf-8').read(); M = open(moteur, encoding='utf-8').read()
journal = []
def un(avant, apres, quoi):
    global s
    n = s.count(avant)
    if n != 1: sys.exit('ARRÊT : « %s » trouvé %d fois' % (quoi, n))
    s = s.replace(avant, apres); journal.append('%s : %d → %d o' % (quoi, len(avant.encode()), len(apres.encode())))
def fonction(nom):
    i = s.index('function ' + nom + '(')
    j = s.find('\nfunction ', i + 1); k = s.find('\n/*', i + 1); l = s.find('\nconst ', i + 1); m = s.find('\nlet ', i + 1); n2 = s.find('\n$(', i + 1); o = s.find('\ndocument.', i + 1); p = s.find('\nwindow.', i + 1); q = s.find('\nsetInterval', i + 1)
    fin = min(x for x in (j, k, l, m, n2, o, p, q) if x > 0)
    return s[i:fin]
# les noms : cherchés dans le gabarit avant d'être écrits (n°12 · 40)
for nom in re.findall(r'function (p8\w+)', M) + ['P8_SCH_COUL', 'P8_COUL', 'P8_POLICE', 'P8_MEMO', 'P8_MESURES', 'p8-', 'p8Tir', 'p8Jal', 'P8_PRIS', 'P8_ALERTES', 'p8MesureDiapo', 'p8Redessiner', 'p8MarquePris', 'p8-banc', 'p8-mesureur']:
    if nom in s: sys.exit('ARRÊT : le nom « %s » existe déjà dans le gabarit' % nom)
tailles_avant = {f: len(fonction(f).encode()) for f in ['elements', 'rendre', 'alertesForme', 'formulaireObjet', 'dessinerSchema']}

# 1. le moteur repris, à part (après la loi de taille, dont il dépend : policePx)
un("const policePx = (hauteurDiapo, pt) => hauteurDiapo * 0.056 * (pt / 32);\n",
   "const policePx = (hauteurDiapo, pt) => hauteurDiapo * 0.056 * (pt / 32);\n" + M.rstrip('\n') + '\n', 'insertion du moteur p8')

# 2. elements() : un schéma se dévoile bulle par bulle (décision 6), ce n'est plus b.el (T10)
un("(b.el || []).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: b.t })); }); return out; }",
   "if (b.t === 'schema') { p8Elements(b).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: 'schema' })); return; } /* (p8-2) une bulle = un élément, dans l'ordre de la source ; « Tout ensemble » : aucun */ (b.el || []).forEach((t, ei) => out.push({ b: bi, e: ei, txt: t, t: b.t })); }); return out; }",
   'elements : le schéma par bulles')

# 3. rendre : le bloc schéma branché sur le moteur repris (T10 : dessinerSchema n'est plus appelé)
un("else if (b.t === 'schema') { const lignes = (b.el && b.el.length ? b.el : String(b.src || '').split('\\n').map(x => x.trim()).filter(Boolean)); const k0 = k; const cl = i2 => (k0 + i2 >= et.nDev ? 'el pas' : 'el') + (et.flash === k0 + i2 ? ' spot-on' : ''); h += `<div class=\"sch${marqBloc}${lumBloc}\" data-bloc=\"${bi}\"><div class=\"sch-t\" data-p=\"${bi}.t\">${esc(titre)}</div><div class=\"sch-dessin\">${dessinerSchema(b.forme || 'carte', titre, lignes, cl)}</div></div>`; k += lignes.length; }",
   "else if (b.t === 'schema') { /* (p8-2) le moteur de l'ancien déroulé ; la carte dit son titre au centre, une seule fois (décision 2) */ const k0 = k; const nS = p8Elements(b).length; const vu = nS ? Math.max(0, (et.nDev || 0) - k0) : Infinity; const fl = typeof et.flash === 'number' && et.flash >= k0 && et.flash < k0 + nS ? et.flash - k0 : null; const bx = (mur._p8 || {})[e.eid + '|' + bi] || {}; h += `<div class=\"sch p8-sch${marqBloc}${lumBloc}\" data-bloc=\"${bi}\">${(b.forme || 'carte') === 'carte' ? '' : `<div class=\"sch-t\" data-p=\"${bi}.t\">${esc(titre)}</div>`}<div class=\"sch-dessin p8-dessin\" data-p8=\"${bi}\" data-vu=\"${vu}\" data-fl=\"${fl == null ? '' : fl}\" data-titre=\"${esc(titre)}\">${p8Dessin(b, bx.W, bx.H, H, TAILLES[et.taille].pt, vu, fl, !!et.atelier, titre)}</div></div>`; k += nS; }",
   'rendre : le bloc schéma')
# 3 bis. après la pagination : le dessin se pose dans sa place réelle (p8Poser)
un("} else if (et.pages) appliquerPages(mur, et); else paginer(mur, et);\n  if (et.pilote && typeof brancherFin === 'function') brancherFin();",
   "} else if (et.pages) appliquerPages(mur, et); else paginer(mur, et);\n  p8Poser(mur, et); /* (p8-2) le schéma dans la place « plein » réellement disponible */\n  if (et.pilote && typeof brancherFin === 'function') brancherFin();",
   'rendre : p8Poser après la pagination')
# p8Poser range la place sous l'identité de la diapo et le rang du bloc
M2 = "    mur._p8[bi]={W:W,H:H};"
if M2 not in s: sys.exit('ARRÊT : p8Poser')
s = s.replace(M2, "    mur._p8[e.eid+'|'+bi]={W:W,H:H};")

# 4. dessinerSchema (p7) retiré (T10) ; à sa place, la préhension de l'ancien (tirSch, jalSch, PRIS), dans l'atelier seulement (T6)
i = s.index("/* ── (p7) les cinq formes, dessinées depuis la source texte"); j = s.index("function blocDe(el){")
avant4 = s[i:j]
PREHENSION = r"""/* ── (p8-2) la préhension de l'ancien déroulé (tirSch, jalSch, PRIS, le mousedown sur g.n / g.jal), reprise dans l'atelier seulement (T6) : pendant qu'on tire, seul le dessin du schéma est mis à jour ; au pilotage et au tableau, rien ne se déplace ── */
let P8_PRIS = {}, p8Tir = null, p8Jal = null;
function p8MarquePris(){ document.querySelectorAll('#mur .p8-sch g.p8-n').forEach(g => g.classList.toggle('p8-pris', !!P8_PRIS[g.dataset.k])); }
function p8Redessiner(bi){ const z = document.querySelector('#mur .p8-dessin[data-p8="' + bi + '"]'); const b = ecran().blocs[bi]; if (!z || !b) return; poserHtml(z, p8Dessin(b, z.clientWidth, z.clientHeight, $('mur').clientHeight || 616, TAILLES[S.taille].pt, Infinity, null, true, z.dataset.titre)); p8MarquePris(); }
document.addEventListener('mousedown', ev => { if (!S.atelier || S.repetition || ev.button !== 0) return; const z = ev.target.closest && ev.target.closest('#mur .p8-dessin'); if (!z) return; const bi = +z.dataset.p8; const b = ecran().blocs[bi]; if (!b || b.t !== 'schema') return; const sv = z.querySelector('svg.p8-svg');
  /* — un point de frise : sa date suit — */ const jl = ev.target.closest('g.p8-jal'); if (jl && sv) { p8Jal = { bi, i: +jl.dataset.i, min: +jl.dataset.min, max: +jl.dataset.max, W: +jl.dataset.w }; ev.preventDefault(); ev.stopPropagation(); return; }
  /* — une bulle — */ const g = ev.target.closest('g.p8-n'); if (g && sv) { const k = g.dataset.k; if (ev.ctrlKey || ev.metaKey) { if (P8_PRIS[k]) delete P8_PRIS[k]; else P8_PRIS[k] = 1; p8MarquePris(); ev.preventDefault(); ev.stopPropagation(); return; } if (!P8_PRIS[k]) { P8_PRIS = {}; P8_PRIS[k] = 1; p8MarquePris(); } const vb = sv.viewBox.baseVal, r2 = sv.getBoundingClientRect(), dep = {}; Object.keys(P8_PRIS).forEach(kk => { const gg = z.querySelector('g.p8-n[data-k="' + kk + '"]'); if (!gg) return; const rc = gg.querySelector('rect'); dep[kk] = { x: +rc.getAttribute('x') + +rc.getAttribute('width') / 2, y: +rc.getAttribute('y') + +rc.getAttribute('height') / 2 }; }); p8Tir = { bi, dep, sx: ev.clientX, sy: ev.clientY, kx: vb.width / r2.width, ky: vb.height / r2.height, W: +sv.dataset.w, H: +sv.dataset.h, bouge: false }; ev.preventDefault(); ev.stopPropagation(); return; }
  if (!ev.ctrlKey && !ev.metaKey) { P8_PRIS = {}; p8MarquePris(); } }, true);
document.addEventListener('mousemove', ev => { if (!S.atelier) { p8Tir = null; p8Jal = null; return; }
  if (p8Jal) { const z = document.querySelector('#mur .p8-dessin[data-p8="' + p8Jal.bi + '"]'); const sv = z && z.querySelector('svg.p8-svg'); if (!sv) return; const vb = sv.viewBox.baseVal, r = sv.getBoundingClientRect(); const u = vb.x + (ev.clientX - r.left) * (vb.width / r.width), W = p8Jal.W; const frac = Math.max(0, Math.min(1, (u - W * 0.07) / (W * 0.86))); let d = Math.round(p8Jal.min + frac * (p8Jal.max - p8Jal.min)); d = Math.max(p8Jal.min, Math.min(p8Jal.max, d)); const b = ecran().blocs[p8Jal.bi]; if (!b) return; const L = String(b.src || '').split('\n'); const autres = L.map((s2, n) => n === p8Jal.i ? null : parseInt(s2.replace(/\D/g, ''), 10)).filter(x => x !== null && !isNaN(x)); const pasMin = Math.max(1, Math.round((p8Jal.max - p8Jal.min) / 28)); autres.forEach(a => { if (Math.abs(d - a) < pasMin) d = (d > a ? a + pasMin : a - pasMin); }); const sep = L[p8Jal.i].indexOf(':') >= 0 ? ':' : '='; const p = L[p8Jal.i].split(sep); L[p8Jal.i] = d + ' ' + sep + (p.slice(1).join(sep) || ''); b.src = L.join('\n'); p8Jal.bouge = true; p8Redessiner(p8Jal.bi); return; }
  if (p8Tir) { const z = document.querySelector('#mur .p8-dessin[data-p8="' + p8Tir.bi + '"]'); const sv = z && z.querySelector('svg.p8-svg'); if (sv) { const vb = sv.viewBox.baseVal, r2 = sv.getBoundingClientRect(); p8Tir.kx = vb.width / r2.width; p8Tir.ky = vb.height / r2.height; } const dx = (ev.clientX - p8Tir.sx) * p8Tir.kx, dy = (ev.clientY - p8Tir.sy) * p8Tir.ky; if (!p8Tir.bouge && Math.hypot(dx, dy) < 2) return; const b = ecran().blocs[p8Tir.bi]; if (!b) return; b.pos = Object.assign({}, b.pos || {}); /* le repère 1000 × 560, étiré sur la place « plein » (T6) */ Object.keys(p8Tir.dep).forEach(k => { b.pos[k] = { x: Math.round((p8Tir.dep[k].x + dx) / (p8Tir.W / 1000) * 10) / 10, y: Math.round((p8Tir.dep[k].y + dy) / (p8Tir.H / 560) * 10) / 10 }; }); p8Tir.bouge = true; p8Redessiner(p8Tir.bi); } });
document.addEventListener('mouseup', () => { const t = p8Tir || p8Jal; if (t && t.bouge) { marquerModif(p8Tir ? { di: S.di, bi: t.bi, place: Object.keys(p8Tir.dep) } : { di: S.di, bi: t.bi, date: true }); tout(); setTimeout(p8MarquePris, 0); } p8Tir = null; p8Jal = null; });
"""
s = s[:i] + PREHENSION + s[j:]; journal.append('dessinerSchema (p7) retiré : %d o ; préhension p8 ajoutée : %d o' % (len(avant4.encode()), len(PREHENSION.encode())))

# 5. le tableau reçoit toutes les fonctions du dessin (n°12 · 75)
noms = re.findall(r'^function (p8\w+)', M, re.M)
un("surligne, numDe, actDe, dessinerSchema /* (p7) le tableau dessine aussi */ };",
   "surligne, numDe, actDe, " + ', '.join(noms) + " /* (p8-2) le tableau dessine avec le moteur repris : toutes ses fonctions passent */ };",
   'tableau : la liste des fonctions')
un("\\nvar COULEURS = ' + JSON.stringify(COULEURS) + ';",
   "\\nvar COULEURS = ' + JSON.stringify(COULEURS) + ';\\nvar P8_SCH_COUL = ' + JSON.stringify(P8_SCH_COUL) + ';\\nvar P8_COUL = ' + JSON.stringify(P8_COUL) + ';\\nvar P8_POLICE = ' + JSON.stringify(P8_POLICE) + ';\\nvar P8_MEMO = {}, P8_MESURES = {};",
   'tableau : les constantes du moteur')

# 5 bis. le tableau redessine le dernier état reçu quand sa fenêtre change de taille : le dessin du schéma dépend de sa place réelle (T7)
un('window.opener&&window.opener.postMessage({pret:true},"*");',
   'window.addEventListener("resize",function(){if(window._et)rendre(document.getElementById("mur2"),window._et);});window.opener&&window.opener.postMessage({pret:true},"*");',
   'tableau : redessin au redimensionnement')

# 6. « trop dense » : la mesure, et rien d'autre (décision 3) ; l'ancienne règle de la p7 (« moins de la moitié de la diapo ») est retirée
i = s.index("const c0 = document.querySelector('#mur .corpsd'); const svgs = document.querySelectorAll('#mur .sch-dessin svg, #mur .sch-dessin table');")
fin = "à mettre seul sur sa diapo.` }); } }); "
j = s.index(fin, i) + len(fin)
avant6 = s[i:j]
DENSE = "E.forEach((e2, i2) => (e2.blocs || []).forEach((b2, bi2) => { if (b2.t !== 'schema' || e2.role === 'fin') return; const r = (p8MesureDiapo(i2).blocs || {})[bi2]; if (!r || !r.total) return; out.push({ di: i2, bi: bi2, k: 'dense', l: `Schéma « ${b2.txt || ''} » : il ne tient pas lisible — coupe-le : clic droit sur une famille → Couper le schéma ici`, ou: `diapo ${i2 + 1} · « ${e2.act} » · bloc ${bi2 + 1}`, faire: `mesuré au tableau : ${r.chevauchements} chevauchement${r.chevauchements > 1 ? 's' : ''}, ${r.horsCadre} hors du cadre visible, ${r.traits} trait${r.traits > 1 ? 's' : ''} à travers un mot, ${r.deuxLignes} libellé${r.deuxLignes > 1 ? 's' : ''} sur deux lignes, ${r.sousPlancher} police${r.sousPlancher > 1 ? 's' : ''} sous 26 pt — la police ne descend jamais sous 26 pt : c'est le schéma qu'on coupe`, copier: `Schéma « ${b2.txt || ''} » (${e2.act}) : il ne tient pas lisible au tableau (${r.total} défaut${r.total > 1 ? 's' : ''} de lecture) ; à couper en deux schémas, chacun sur sa diapo.` }); })); "
s = s[:i] + DENSE + s[j:]; journal.append('alertesForme : la règle « moins de la moitié » (%d o) remplacée par la mesure (%d o)' % (len(avant6.encode()), len(DENSE.encode())))
# la mesure d'une diapo du chapitre, faite au tableau (hors de l'écran), mémorisée tant que la diapo ne change pas
MD = "function p8MesureDiapo(i){ /* (p8-2) la mesure d'une diapo du chapitre, rendue telle que la classe la voit (hors de l'écran, à la taille du tableau du pilote) */ const E = seance().ecrans; const e = E[i]; const m0 = $('mur'); const W = m0.clientWidth || 1096, H = m0.clientHeight || 616; const st = parDiapo[K(i)] || {}; const cle0 = JSON.stringify([S.si, e.eid, e.blocs, S.taille, W, H, st.reps || {}, st.textes || {}]); window.P8_ALERTES = window.P8_ALERTES || {}; if (P8_ALERTES[cle0]) return P8_ALERTES[cle0]; if (Object.keys(P8_ALERTES).length > 200) window.P8_ALERTES = {}; let z = $('p8-banc'); if (!z) { z = document.createElement('div'); z.id = 'p8-banc'; z.setAttribute('aria-hidden', 'true'); document.body.appendChild(z); } z.className = 'mur tableau'; z.style.cssText = 'position:fixed;left:-20000px;top:0;opacity:0;pointer-events:none;width:' + W + 'px;height:' + H + 'px'; rendre(z, { si: S.si, di: i, nDev: elements(e).length, lum: [], ecr: [], taille: S.taille, page: 0, reps: st.reps || {}, tailles: st.tailles || {}, textes: st.textes || {}, fsBloc: {}, pilote: false }); const r = p8MesureLisible(z); P8_ALERTES[cle0] = r; return r; }\n"
un("function ouvrirARegler(){", MD + "function ouvrirARegler(){", 'p8MesureDiapo ajoutée')

# 7. décision 6 ter : un schéma créé par « Schéma… » part réglé « Un à un »
un("ajouterBloc({ t: 'schema', txt: tt, forme: $('of-forme').value, echelle: 'plein', src: lignes.join('\\n'), el: lignes.map(x => x.trim()) }, false);",
   "ajouterBloc({ t: 'schema', txt: tt, forme: $('of-forme').value, echelle: 'plein', src: lignes.join('\\n'), el: lignes.map(x => x.trim()), devoilerTout: false /* (p8-2) décision 6 ter : créé par « Schéma… », il part « Un à un » */ }, false);",
   'formulaire schéma : Un à un (6 ter)')

# 8. le style : classes préfixées p8- (n°12 · 40, 48)
CSS = ".mur .sch-dessin.p8-dessin{position:relative;display:block}.mur .p8-dessin > svg.p8-svg{position:absolute;left:0;top:0;width:100%;height:100%;max-width:none;max-height:none;aspect-ratio:auto;overflow:visible}.mur .p8-pas{opacity:.3}.mur g.p8-n.p8-pas{opacity:1}.mur g.p8-n.p8-pas > :not(.p8-fond){opacity:.3}.tableau .p8-pas{display:none}.tableau .p8-grille tr.p8-pas{display:table-row;visibility:hidden}.mur .sch table.p8-grille{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:max-content;max-width:none;max-height:none;font-size:inherit;border-collapse:separate;border-spacing:0}.mur .sch .p8-grille th,.mur .sch .p8-grille td{border:0;border-right:1px solid #c99a4e;border-bottom:1px solid #c99a4e;padding:.15em .5em;text-align:left;vertical-align:top}.mur .sch .p8-grille tr > :first-child{border-left:1px solid #c99a4e}.mur .sch .p8-grille tr:first-child > *{border-top:1px solid #c99a4e}.mur .sch .p8-grille th{background:#fff2c7}body.vue-atelier #mur .p8-sch g.p8-n{cursor:move}body.vue-atelier #mur .p8-sch g.p8-jal{cursor:ew-resize}.mur .p8-sch g.p8-n.p8-bouge rect{stroke-dasharray:4 3}.mur .p8-sch g.p8-n.p8-pris rect{stroke:#0f8f53!important;stroke-width:3.4px!important}\n</style></head><body>"
un("\n</style></head><body>", "\n" + CSS, 'le style p8')

open(out, 'w', encoding='utf-8').write(s)
tailles_apres = {}
for f in ['elements', 'rendre', 'alertesForme', 'formulaireObjet']: tailles_apres[f] = len(fonction(f).encode())
print('écrit', out, len(s.encode()), 'o')
for l in journal: print(' ·', l)
for f in tailles_avant: print(' · fonction %s : %d → %s o' % (f, tailles_avant[f], tailles_apres.get(f, 'retirée')))
