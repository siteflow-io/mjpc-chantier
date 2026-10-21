/* ═══════════════════════════════════════════════════════════════════════════════════════════════════════
   dr-recyclage.js — E4, LE RECYCLAGE DE L'ANCIEN DÉROULÉ (relance E4-2, A : R1, R4, R2, R6, R5)
   Les gestes qui marchaient dans l'ancien moteur (deroule86, tel qu'il est embarqué dans la production 8.74.0-③ :
   AT_DR_B64 décodé) et que la maquette p8-5g ne faisait pas (MANDATS/INTEGRATION-DEROULE/RECYCLAGE-ANCIEN-DEROULE.md, table B).
   Chargé après dr-recit.js. Dans le socle et l'Atelier d'E1, seulement des crochets d'une ligne marqués « E4 ».
   ═══════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ══ R1 · LES MARQUES SUR UNE IMAGE ══
   L'ancien (moteur L605-650, L1602-1830) : un bloc image est « Document analysé » (b.support) ou « Illustration » ; sur un document
   analysé, Paul pose des marques (b.marques = [{t, x, y, txt, w, h, x2, y2}] : t = pt ① point numéroté · et étiquette · fl flèche ·
   cd cadre · lg légende ; x, y en % de l'image) ; il les édite en place (deux appuis rapprochés), les supprime (✕ ou Suppr) ; elles se
   dévoilent « une à une » (b.devoilerTout === false : chacune est un élément de la diapo, comme une étape) ou « toutes ensemble » ;
   elles se calent sur la largeur de l'image (calibreMarques : la même part de l'image au pilote et au tableau). */
const DR_OUTILS_MK = [['pt', '① Point'], ['et', 'Étiquette'], ['fl', '→ Flèche'], ['cd', '▭ Cadre'], ['lg', 'Légende']];
var DR_MK = { outil: null, sel: null, dernier: { k: -1, t: 0 } };
function dr_mkDe(b){ return b && Array.isArray(b.marques) ? b.marques : []; }
function dr_mkUneAUne(b){ return !!(b && b.support && b.devoilerTout === false); }
/* pour elements() du socle : une marque dévoilable = un élément, son libellé (le récit dit « où on a repéré « … » ») */
function dr_marquesElements(b){ return dr_mkUneAUne(b) ? dr_mkDe(b).map(m => m.txt || (m.t === 'fl' ? 'une flèche' : m.t === 'cd' ? 'un cadre' : '')) : []; }
function dr_marquesNb(b){ return dr_marquesElements(b).length; }
/* le rendu des marques dans .img-sup (crochet du socle, dans rendre) : k0 = le rang du premier élément de ce bloc dans la diapo */
function dr_marquesHtml(b, bi, k0, et){
  if (!b || !b.support) return ''; const une = dr_mkUneAUne(b), pilote = !!(et && (et.pilote || et.atelier)), nDev = (et && et.nDev) || 0;
  const sel = (et && et.atelier && DR_MK.sel && DR_MK.sel.bi === bi) ? DR_MK.sel.k : null;
  return dr_mkDe(b).map((m, j) => {
    const pas = une && (k0 + j) >= nDev; if (pas && !pilote) return '';   /* au tableau, ce qui n'est pas dévoilé n'existe pas */
    const cls = ' mk mk-' + m.t + (pas ? ' pas' : '') + (sel === j ? ' selmk' : '') + ((et && et.flash === k0 + j) ? ' spot-on' : '') + ((et && et.neuf === k0 + j) ? ' neuf-vu' : '');
    const x = +m.x || 0, y = +m.y || 0, att = ` data-mk="${j}" data-bi="${bi}"` + (et && et.atelier ? ' title="Deux appuis rapprochés : écrire sur la marque ; Suppr : la retirer"' : '');
    if (m.t === 'fl') { const x2 = m.x2 == null ? x + 14 : +m.x2, y2 = m.y2 == null ? y + 9 : +m.y2; const id = 'drfl' + bi + '_' + j;
      return `<svg class="dr-flsvg${pas ? ' pas' : ''}" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;pointer-events:none;width:100%;height:100%"><defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#d1495b"/></marker></defs><line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#d1495b" stroke-width="0.7" marker-end="url(#${id})" vector-effect="non-scaling-stroke"/></svg>`
        + (m.txt ? `<span class="mk mk-lg${pas ? ' pas' : ''}${sel === j ? ' selmk' : ''}"${att} style="left:${(x + x2) / 2}%;top:${(y + y2) / 2 - 5}%"><span>${dr_esc(m.txt)}</span></span>` : (et && et.atelier ? `<span class="mk mk-fl${sel === j ? ' selmk' : ''}"${att} style="left:${x}%;top:${y}%"><span>•</span></span>` : '')); }
    return `<span class="${cls.trim()}"${att} style="left:${x}%;top:${y}%${m.t === 'cd' ? `;width:${+m.w || 18}%;height:${+m.h || 14}%;transform:none` : ''}">${m.t === 'cd' ? '' : `<span>${dr_esc(m.txt || '')}</span>`}</span>`;
  }).join(''); }
/* calibreMarques : les marques se mesurent sur la LARGEUR DE L'IMAGE (au pilote, au tableau, dans les vignettes) */
function dr_calibreMarques(racine){ (racine || document).querySelectorAll('.img-sup').forEach(s => { const mk = s.querySelectorAll('.mk'); if (!mk.length) return; const L = s.getBoundingClientRect().width; if (!L) return; mk.forEach(m => { m.style.fontSize = (L * 0.042) + 'px'; }); }); }
/* le bloc image de la diapo de l'atelier, rangé : `marques` devient une propriété enregistrée (le socle la pose cachée tant qu'elle est vide) */
function dr_mkBloc(bi){ try { const e = ecran(); if (!e) return null; const i = bi != null ? bi : e.blocs.findIndex(b => b.t === 'image'); const b = e.blocs[i]; if (!b || b.t !== 'image') return null; return { b, bi: i }; } catch (e) { return null; } }
function dr_mkRendreEnregistrable(b){ const d = Object.getOwnPropertyDescriptor(b, 'marques'); if (!d || !d.enumerable) Object.defineProperty(b, 'marques', { value: Array.isArray(b.marques) ? b.marques.slice() : [], writable: true, enumerable: true, configurable: true }); }
function dr_mkChanger(f, bi, suite){ const o = dr_mkBloc(bi); if (!o) return; if (!suite && typeof dr_annulerCoupure === 'function') dr_annulerCoupure(); /* (E4 · relecteur continu B2) chaque marque posée, retirée, chaque réglage = un pas de ↶ (lisait : une rafale de 900 ms emportait trois marques d'un coup) */ dr_mkRendreEnregistrable(o.b); f(o.b); if (typeof dr_sauve === 'function') dr_sauve(); if (typeof journal === 'function') journal('atelier-modif', { quoi: 'marques', di: S.di }); dr_tout(); dr_mkPanneau(); }
function dr_setSupport(v){ dr_mkChanger(b => { b.support = v; if (!v) b.marques = []; }); }
function dr_setDev(v){ dr_mkChanger(b => { b.devoilerTout = v; }); }
function dr_armeMk(o){ DR_MK.outil = (DR_MK.outil === o) ? null : o; document.body.classList.toggle('dr-pose-mk', !!DR_MK.outil); dr_mkPanneau(); }
function dr_supMk(k, bi){ DR_MK.sel = null; dr_mkChanger(b => { b.marques.splice(k, 1); }, bi); }
function dr_poseMk(ev, sup){ const blocEl = sup.closest('[data-bi]'); const bi = blocEl ? +blocEl.dataset.bi : null; const r = sup.getBoundingClientRect(); const outil = DR_MK.outil;
  dr_mkChanger(b => { const n = b.marques.filter(m => m.t === 'pt').length + 1; b.marques.push({ t: outil, x: Math.round((ev.clientX - r.left) / r.width * 1000) / 10, y: Math.round((ev.clientY - r.top) / r.height * 1000) / 10, txt: outil === 'pt' ? String(n) : (outil === 'fl' ? '' : 'à écrire'), w: 18, h: 14 }); }, bi);
  DR_MK.outil = null; document.body.classList.remove('dr-pose-mk'); dr_mkPanneau();
  if (outil === 'et' || outil === 'lg') { const o = dr_mkBloc(bi); const k = o ? o.b.marques.length - 1 : -1; const ouvrir = n => { const mk = document.querySelector(`#mur .img-sup .mk[data-mk="${k}"][data-bi="${o ? o.bi : bi}"]`); if (mk) dr_editeMarque(mk, true); else if (n > 0) requestAnimationFrame(() => ouvrir(n - 1)); }; if (k >= 0) ouvrir(5); } }   /* (E4 · relecteur continu B2) une étiquette, une légende posées s'ouvrent à l'écriture : la frappe va dans la marque (lisait : Espace passait à la diapo suivante, « r » ouvrait la Relecture) */   /* l'ancien gardait l'outil armé : le panneau le réarme d'un clic */
function dr_editeMarque(mk, posee){ const sp = mk.querySelector('span'); if (!sp) return; const k = +mk.dataset.mk, bi = +mk.dataset.bi;
  sp.setAttribute('contenteditable', 'true'); sp.focus(); try { const r = document.createRange(); r.selectNodeContents(sp); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
  let fini = false; const fin = annule => { if (fini) return; fini = true; sp.removeAttribute('contenteditable'); const t = sp.textContent.trim(); if (!annule) dr_mkChanger(b => { if (b.marques[k]) b.marques[k].txt = t; }, bi, posee); else dr_tout(); };   /* le texte d'une marque qu'on vient de poser ne coupe pas une rafale en cours (la pose et son texte, tapé vite, font un pas) */
  sp.addEventListener('blur', () => fin(false), { once: true });
  sp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); sp.blur(); } if (e.key === 'Escape') { e.preventDefault(); fin(true); } }); }
/* le panneau des marques (l'ancien « réglages » du bloc image), dans l'atelier, sur une diapo qui a une image */
function dr_mkPanneau(){
  let z = document.getElementById('dr-mk-panneau'); const actif = (typeof dr_actif !== 'function' || dr_actif()) && typeof S !== 'undefined' && S.atelier; const o = actif ? dr_mkBloc() : null;
  if (!o) { if (z) z.remove(); DR_MK.outil = null; document.body.classList.remove('dr-pose-mk'); return; }
  const hote = document.getElementById('droite-atelier') || document.getElementById('droite') || (document.getElementById('mur') || {}).parentElement; if (!hote) return; if (!z || z.parentElement !== hote) { if (z) z.remove(); z = document.createElement('div'); z.id = 'dr-mk-panneau'; hote.insertBefore(z, hote.firstChild); }   /* en tête de la colonne de droite : jamais sur l'image */
  const b = o.b; let h = `<div class="dr-mk-t">Image · bloc ${o.bi + 1}</div><div class="dr-mk-l"><button class="btn${b.support ? ' on' : ''}" data-mk-a="support" title="Un document que la classe analyse : on y pose des marques (numéros, étiquettes, flèches, cadres, légendes)">Document analysé</button><button class="btn${b.support ? '' : ' on'}" data-mk-a="illustration" title="Une image qui illustre : pas de marques (passer en illustration retire les marques posées)">Illustration</button></div>`;
  if (b.support) {
    h += `<div class="dr-mk-s">Poser une marque${DR_MK.outil ? ' — <b>clique sur l’image</b>' : ''}</div><div class="dr-mk-l">${DR_OUTILS_MK.map(x => `<button class="btn${DR_MK.outil === x[0] ? ' on' : ''}" data-mk-o="${x[0]}" title="Arme l'outil « ${x[1]} » : le prochain clic sur l'image pose la marque à cet endroit">${x[1]}</button>`).join('')}</div>`
      + `<div class="dr-mk-l"><button class="btn${b.devoilerTout === false ? ' on' : ''}" data-mk-a="une" title="En classe, ▶ dévoile les marques une à une, comme les étapes d'une consigne">Marques une à une</button><button class="btn${b.devoilerTout === false ? '' : ' on'}" data-mk-a="toutes" title="Toutes les marques paraissent ensemble avec l'image">Toutes ensemble</button></div>`
      + `<div class="dr-mk-liste">${dr_mkDe(b).map((m, k) => `<div><b>${(DR_OUTILS_MK.find(x => x[0] === m.t) || ['', '?'])[1]}</b> ${dr_esc(m.txt || '')} <i>${Math.round(m.x)} % · ${Math.round(m.y)} %</i> <span class="dr-mk-x" data-mk-x="${k}" title="Retire cette marque">✕</span></div>`).join('') || '<i>aucune marque</i>'}</div>`;
  }
  if (z._h === h) return; z._h = h; z.innerHTML = h;   /* rien ne change : on ne touche à rien (le bouton survolé reste le même) */
  z.querySelectorAll('[data-mk-a]').forEach(x => x.onclick = () => { const a = x.dataset.mkA; if (a === 'support') dr_setSupport(true); if (a === 'illustration') dr_setSupport(false); if (a === 'une') dr_setDev(false); if (a === 'toutes') dr_setDev(true); });
  z.querySelectorAll('[data-mk-o]').forEach(x => x.onclick = () => dr_armeMk(x.dataset.mkO));
  z.querySelectorAll('[data-mk-x]').forEach(x => x.onclick = () => dr_supMk(+x.dataset.mkX, o.bi));
}
/* les gestes sur l'image, dans l'atelier : poser (outil armé), sélectionner, éditer (deux appuis), supprimer (Suppr), Échap */
document.addEventListener('click', ev => { try { if (!DR_MK.outil || typeof S === 'undefined' || !S.atelier) return; const sup = ev.target.closest && ev.target.closest('#mur .img-sup'); if (!sup) return; ev.preventDefault(); ev.stopPropagation(); dr_poseMk(ev, sup); } catch (e) {} }, true);
document.addEventListener('mousedown', ev => { try { if (typeof S === 'undefined' || !S.atelier || DR_MK.outil) return; const mk = ev.target.closest && ev.target.closest('#mur .img-sup .mk'); if (!mk || mk.querySelector('[contenteditable="true"]')) return; const k = +mk.dataset.mk, bi = +mk.dataset.bi, t = Date.now();
  if (DR_MK.dernier.k === k && t - DR_MK.dernier.t < 380) { DR_MK.dernier = { k: -1, t: 0 }; ev.preventDefault(); dr_editeMarque(mk); return; }
  DR_MK.dernier = { k, t }; DR_MK.sel = { k, bi }; ev.preventDefault(); ev.stopPropagation(); dr_tout(); } catch (e) {} }, true);
window.addEventListener('keydown', ev => { try { if (typeof S === 'undefined' || !S.atelier) return; const a = document.activeElement; if (a && (a.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(a.tagName))) return;   /* sur window : avant les gestes du socle sur document (Suppr y supprime la diapo — relecteur continu B) */
  if (ev.key === 'Escape' && (DR_MK.outil || DR_MK.sel)) { DR_MK.outil = null; DR_MK.sel = null; document.body.classList.remove('dr-pose-mk'); dr_tout(); dr_mkPanneau(); }
  if (ev.key === 'Delete' && DR_MK.sel) { ev.preventDefault(); ev.stopImmediatePropagation(); dr_supMk(DR_MK.sel.k, DR_MK.sel.bi); } } catch (e) {} }, true);
/* après chaque rendu (pilote, atelier, tableau, vignettes) : calibrer ; le panneau suit la diapo de l'atelier */
(function(){ let attente = false; const apres = () => { attente = false; dr_calibreMarques(document); dr_mkPanneau(); };
  const obs = new MutationObserver(ms => { if (attente) return; if (ms.every(m => m.target && m.target.closest && m.target.closest('#dr-mk-panneau'))) return; attente = true; requestAnimationFrame(apres); });
  const brancher = () => { obs.observe(document.body, { childList: true, subtree: true }); window.addEventListener('resize', () => dr_calibreMarques(document)); };
  if (document.body) brancher(); else document.addEventListener('DOMContentLoaded', brancher); })();

/* ══ R4 · ↶ ANNULER (Ctrl+Z) DANS L'ATELIER ══
   L'ancien (moteur L555-556) : sauve() empile l'état de la trame avant chaque modification (40 au plus), annuler() le dépile et redessine.
   Ici : toute modification de l'atelier passe par marquerModif() → dr_sauve() (E1) ; dr_sauve est enveloppée (rien n'est réécrit chez E1) :
   au premier appel d'une rafale, l'état d'AVANT (le dernier état posé) est empilé ; 900 ms sans modification, l'état courant devient
   le dernier état posé. ↶ (ou Ctrl+Z hors d'un champ) reprend l'état empilé : blocs, textes, ordre, marques — par identité (eid, bid).
   Dans un champ de texte, Ctrl+Z reste celui du navigateur. Rien en classe (la copie de la classe n'est pas la trame). */
var DR_PILE = { cle: null, l: [], dernier: null, rafale: null };
function dr_annulerCle(){ try { return String(dr_ctx().snum) + '|' + String(S.si); } catch (e) { return null; } }
function dr_photoTrame(){ const E = seance().ecrans; return JSON.stringify({ e: E.map(e => Object.assign(JSON.parse(JSON.stringify(e)), { __heure: e.heure })), di: S.di }); }
function dr_annulerSuivre(){ try { if (typeof S === 'undefined' || !S.atelier || S.repetition) return; const k = dr_annulerCle(); if (k !== DR_PILE.cle) { DR_PILE = { cle: k, l: [], dernier: dr_photoTrame(), rafale: null }; dr_annulerBouton(); } else if (DR_PILE.dernier == null && !DR_PILE.rafale) DR_PILE.dernier = dr_photoTrame(); } catch (e) {} }
if (typeof dr_sauve === 'function' && !dr_sauve.__dr4) { const dr_sauve0 = dr_sauve; window.dr_sauve = function () { try { if (typeof S !== 'undefined' && S.atelier && !S.repetition && !DR_PILE.restaure) { dr_annulerSuivre();
      if (!DR_PILE.rafale && DR_PILE.dernier) { DR_PILE.l.push(DR_PILE.dernier); if (DR_PILE.l.length > 40) DR_PILE.l.shift(); }
      clearTimeout(DR_PILE.rafale); DR_PILE.rafale = setTimeout(() => { DR_PILE.rafale = null; try { DR_PILE.dernier = dr_photoTrame(); } catch (e) {} dr_annulerBouton(); }, 900); } } catch (e) {} return dr_sauve0.apply(this, arguments); }; window.dr_sauve.__dr4 = true; }
function dr_annulerCoupure(){ /* clôt la rafale en cours : le geste qui suit s'empile seul */ try { if (DR_PILE.rafale) { clearTimeout(DR_PILE.rafale); DR_PILE.rafale = null; DR_PILE.dernier = dr_photoTrame(); } } catch (e) {} }
function dr_annuler(){ if (typeof S === 'undefined' || !S.atelier || !DR_PILE.l.length) return false; clearTimeout(DR_PILE.rafale); DR_PILE.rafale = null;
  const p = JSON.parse(DR_PILE.l.pop()); const E = seance().ecrans; S.di = Math.min(p.di, E.length - 1); const ecrAvant = typeof dr_ecrDeLaTrame === 'function' ? dr_ecrDeLaTrame() : [];
  const neufs = p.e.map(x => { const h = x.__heure; delete x.__heure; Object.defineProperty(x, 'heure', { value: h, writable: true, enumerable: false, configurable: true }); return x; });
  E.splice(0, E.length, ...neufs); S.di = Math.min(p.di, E.length - 1); if (typeof reindexer === 'function') { try { reindexer(); } catch (e) {} }
  DR_PILE.dernier = dr_photoTrame(); dr_ecrResynchro(ecrAvant);
  DR_PILE.restaure = true; try { window.dr_sauve(); } finally { DR_PILE.restaure = false; }   /* la trame d'avant s'enregistre (B/deroule), sans s'empiler */
  if (typeof journal === 'function') journal('atelier-annuler', { di: S.di }); DR_MK.sel = null; dr_tout(); dr_annulerBouton(); return true; }
/* (E4 · relecteur continu B2) ↶ après « Marquer à écrire » : l'écran suit la trame — les ✍ venus de la trame sont recalculés (lisait : la donnée annulée, les ✍ restés) */
function dr_ecrResynchro(avant){ try { if (typeof etatDiapo !== 'function') return; const d = etatDiapo(); const t = dr_ecrDeLaTrame(); d.ecr = (d.ecr || []).filter(x => !avant.includes(x) || t.includes(x)); t.forEach(x => { if (!d.ecr.includes(x)) d.ecr.push(x); }); } catch (e) {} }
/* le bouton ↶ dans la barre de l'atelier, grisé avec sa raison quand il n'y a rien à annuler */
function dr_annulerBouton(){ const bar = document.getElementById('at-bloc'); if (!bar || !bar.parentElement) return; let b = document.getElementById('dr-annuler');
  if (!b) { b = document.createElement('button'); b.id = 'dr-annuler'; b.className = 'btn'; b.textContent = '↶ Annuler'; b.onclick = () => dr_annuler(); bar.parentElement.insertBefore(b, bar); }
  const n = DR_PILE.l.length; b.disabled = !n; const t = n ? `Annule la dernière modification de la trame (${n} en mémoire, 40 au plus) — Ctrl+Z hors d'un champ de texte` : 'Rien à annuler : aucune modification de la trame depuis l’ouverture de cette séance dans l’atelier'; if (b.title !== t) b.title = t; }
window.addEventListener('keydown', ev => { try { if (typeof S === 'undefined' || !S.atelier || S.repetition) return; if (!(ev.ctrlKey || ev.metaKey) || ev.shiftKey || ev.altKey || (ev.key !== 'z' && ev.key !== 'Z')) return; const a = document.activeElement; if (a && (a.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(a.tagName))) return; /* dans un champ : le Ctrl+Z du navigateur */ ev.preventDefault(); ev.stopImmediatePropagation(); dr_annuler(); } catch (e) {} }, true);
(function(){ const t = () => { dr_annulerSuivre(); dr_annulerBouton(); }; const obs = new MutationObserver(() => { if (t._a) return; t._a = true; requestAnimationFrame(() => { t._a = false; t(); }); }); const go = () => obs.observe(document.body, { childList: true, subtree: true }); if (document.body) go(); else document.addEventListener('DOMContentLoaded', go); })();

/* ══ R2 · LE RAPPEL D'UNE FICHE ══
   L'ancien (moteur L1858-1882, L2246-2270, rendu L595-598) : quand une fiche déjà posée dans le chapitre est reposée (dejaPosee ≥ 1),
   le bloc reçoit b.rappel = {motif, libre} ; « Pourquoi ce rappel ? » propose quatre motifs (MOTIFS_RAPPEL) ou « dis-le autrement (les
   élèves le liront) » ; la diapo montre « ↻ Rappel — <motif> » (au tableau aussi) ; le récit et le papier disent « on a repris la fiche
   T — <motif> » (dr-recit.js). memeFeuille : on compare la feuille référencée, jamais le titre — sauf quand aucun des deux blocs n'a
   de référence (les fiches du site n'en ont pas encore : audit E1, F17) : alors le titre (et le genre, s'ils l'ont tous deux). */
const MOTIFS_RAPPEL = [{ c: 'reviser', l: 'pour réviser avant l\'évaluation' }, { c: 'acquis', l: 'parce que la notion n\'était pas encore acquise' }, { c: 'prerequis', l: 'parce qu\'on en a besoin pour la suite' }, { c: 'absents', l: 'pour ceux qui étaient absents' }];
function dr_memeFeuille(a, b){ if (a.feuille && a.fiche && b.feuille && b.fiche) return a.feuille === b.feuille && a.fiche === b.fiche; if (a.ref && b.ref) return a.ref === b.ref; if (a.ref || b.ref || (a.feuille && b.feuille)) return false;
  const ti = x => String(x.titre != null ? x.titre : (x.txt || '')).trim().toLowerCase(); return !!ti(a) && ti(a) === ti(b) && (!a.tt || !b.tt || a.tt === b.tt); }
function dr_dejaPosee(b){ let n = 0; try { (typeof dr_cles === 'function' ? dr_cles() : []).forEach(k => (dr_trameDe(k) || []).forEach(e => (e.blocs || []).forEach(x => { if (x !== b && x.t === 'fiche' && dr_memeFeuille(x, b)) n++; }))); } catch (e) {} return n; }
var DR_RAP = { cle: null, connus: new Set() };
function dr_rappelSuivre(){ const k = typeof dr_annulerCle === 'function' ? dr_annulerCle() : null; if (k === DR_RAP.cle) return false; DR_RAP = { cle: k, connus: new Set() }; try { seance().ecrans.forEach(e => e.blocs.forEach(b => { if (b.t === 'fiche') DR_RAP.connus.add(b); })); } catch (e) {} return true; }
/* après chaque modification de l'atelier : une fiche qui vient d'apparaître et qui est déjà dans le chapitre devient un rappel */
function dr_rappelDetecter(){ try { if (typeof S === 'undefined' || !S.atelier || S.repetition) return; if (dr_rappelSuivre()) return; let nouvelle = null;
  seance().ecrans.forEach((e, di) => e.blocs.forEach((b, bi) => { if (b.t !== 'fiche' || DR_RAP.connus.has(b)) return; DR_RAP.connus.add(b); if (!b.rappel && dr_dejaPosee(b) >= 1) { b.rappel = { motif: '', libre: '' }; nouvelle = { di, bi }; } }));
  if (nouvelle) setTimeout(() => { if (S.di === nouvelle.di) dr_rappelOuvrir(nouvelle.bi); }, 60); } catch (e) {} }
/* « ↻ Rappel — … » sur la fiche (crochet du rendu, dr-socle.js) ; au pilote et au tableau ; dans l'atelier, un clic ouvre la question */
function dr_rappelHtml(b, bi, et){ if (!b || !b.rappel) return ''; const r = b.rappel; const lib = r.motif ? (MOTIFS_RAPPEL.find(m => m.c === r.motif) || {}).l || '' : ''; const edit = !!(et && et.atelier);
  if (!lib && !r.libre && !edit) return '<div class="dr-rap">↻ Rappel</div>';
  return `<div class="dr-rap${edit ? ' edit' : ''}" data-rappel="${bi}"${edit ? ' title="Pourquoi ce rappel ? Un clic pour le dire (les élèves le liront dans la diapo et dans le récit)"' : ''}>↻ Rappel${lib ? ' — ' + dr_esc(lib) : ''}${r.libre ? ' (' + dr_esc(r.libre) + ')' : ''}${!lib && !r.libre && edit ? ' <i>· dis pourquoi</i>' : ''}</div>`; }
function dr_rappelOuvrir(bi){ const b = (ecran().blocs || [])[bi]; if (!b || !b.rappel) return; let p = document.getElementById('dr-rappel-pop'); if (!p) { p = document.createElement('div'); p.id = 'dr-rappel-pop'; document.body.appendChild(p); }
  p.innerHTML = `<h4>Pourquoi ce rappel ?</h4><div class="dr-rap-q">« ${dr_esc(b.txt || b.titre || '')} » est déjà dans le chapitre.</div>${MOTIFS_RAPPEL.map(m => `<button class="btn${b.rappel.motif === m.c ? ' on' : ''}" data-motif="${m.c}" title="Les élèves liront : « ${dr_esc(m.l)} »">${dr_esc(m.l)}</button>`).join('')}<input id="dr-rap-libre" placeholder="ou dis-le autrement (les élèves le liront)" value="${dr_esc(b.rappel.libre || '')}"><div class="dr-rap-a"><button class="btn" id="dr-rap-ok" title="Garde ce texte comme raison du rappel">valider ce texte</button><button class="btn" id="dr-rap-x" title="Ferme sans rien changer (la fiche reste un rappel, « dis pourquoi »)">plus tard</button></div>`;
  const ici = document.querySelector(`#mur .bloc[data-bi="${bi}"]`); const r = ici ? ici.getBoundingClientRect() : { left: 400, bottom: 200 }; p.style.left = Math.max(10, Math.min(window.innerWidth - 380, r.left)) + 'px'; p.style.top = Math.max(10, Math.min(window.innerHeight - 280, r.bottom + 6)) + 'px'; p.classList.add('on');
  const poser = (motif, libreSeul) => { const n = document.getElementById('dr-rap-libre'); if (typeof dr_sauve === 'function') { b.rappel = Object.assign({}, b.rappel, { libre: n ? n.value.trim() : '' }, libreSeul ? {} : { motif }); if (typeof marquerModif === 'function') marquerModif({ di: S.di, bi, rappel: b.rappel.motif || 'libre' }); else dr_sauve(); } p.classList.remove('on'); dr_tout(); };
  p.querySelectorAll('[data-motif]').forEach(x => x.onclick = () => poser(x.dataset.motif));
  document.getElementById('dr-rap-ok').onclick = () => poser('', true); document.getElementById('dr-rap-x').onclick = () => p.classList.remove('on');
  p.onkeydown = ev => { ev.stopPropagation(); if (ev.key === 'Escape') p.classList.remove('on'); if (ev.key === 'Enter' && ev.target.id === 'dr-rap-libre') poser('', true); }; }
document.addEventListener('click', ev => { try { if (typeof S === 'undefined' || !S.atelier) return; const t = ev.target.closest && ev.target.closest('#mur .dr-rap.edit[data-rappel]'); if (!t) return; ev.preventDefault(); ev.stopPropagation(); dr_rappelOuvrir(+t.dataset.rappel); } catch (e) {} }, true);
if (typeof window.dr_sauve === 'function' && !window.dr_sauve.__dr2) { const dr_sauveR = window.dr_sauve; window.dr_sauve = function () { dr_rappelDetecter(); return dr_sauveR.apply(this, arguments); }; window.dr_sauve.__dr2 = true; window.dr_sauve.__dr4 = true; }
(function(){ const obs = new MutationObserver(() => { try { if (typeof S !== 'undefined' && S.atelier) dr_rappelSuivre(); } catch (e) {} }); const go = () => obs.observe(document.body, { childList: true, subtree: true }); if (document.body) go(); else document.addEventListener('DOMContentLoaded', go); })();

/* ══ R5 · LA SÉLECTION MULTIPLE DANS L'ATELIER ══
   L'ancien (moteur L2185-2245 : SEL, selSup, selEcrire, selVide ; un lasso et son menu) : plusieurs éléments de la diapo à la fois →
   « Supprimer les N éléments », « ✍🏻 Marquer « à écrire » », « Annuler la sélection ». Ici, comme la relance E4-2 le dit : Ctrl+clic
   (Cmd+clic) sur une étape ou sur un bloc l'ajoute ou le retire ; le menu suit la sélection ; Échap la vide. Copier / couper restent
   ceux de l'atelier (un bloc à la fois). « À écrire » préparé dans l'atelier vit dans la trame par identité (e.aEcrire = ['<bid>',
   '<bid>.<étape>']) et devient, au lancement, le « ✍🏻 à écrire » de la classe (crochet d'une ligne dans etatDiapo, dr-socle.js). */
var DR_SEL = [];   /* [{bi, ei}] — ei null : le bloc entier */
function dr_selVide(){ DR_SEL = []; const m = document.getElementById('dr-sel-menu'); if (m) m.remove(); document.querySelectorAll('#mur .dr-sel').forEach(x => x.classList.remove('dr-sel')); }
function dr_selPeindre(){ document.querySelectorAll('#mur .dr-sel').forEach(x => x.classList.remove('dr-sel')); DR_SEL.forEach(x => { const el = x.ei == null ? document.querySelector(`#mur .bloc[data-bi="${x.bi}"]`) : document.querySelector(`#mur li[data-p="${x.bi}.${x.ei}"]`); if (el) el.classList.add('dr-sel'); }); }
function dr_selMenu(){ let m = document.getElementById('dr-sel-menu'); if (!DR_SEL.length) { if (m) m.remove(); return; } if (!m) { m = document.createElement('div'); m.id = 'dr-sel-menu'; document.body.appendChild(m); }
  const n = DR_SEL.length; m.innerHTML = `<button class="btn rouge" data-sel="sup" title="Retire de la trame les ${n} élément${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''} (↶ Annuler les remet)">Supprimer les ${n} élément${n > 1 ? 's' : ''}</button><button class="btn" data-sel="ecr" title="En classe, ces éléments seront « ✍🏻 à écrire » : les élèves les recopient">✍🏻 Marquer « à écrire »</button><button class="btn" data-sel="vide" title="Désélectionne tout (Échap)">Annuler la sélection</button>`;
  const der = DR_SEL[DR_SEL.length - 1]; const el = der.ei == null ? document.querySelector(`#mur .bloc[data-bi="${der.bi}"]`) : document.querySelector(`#mur li[data-p="${der.bi}.${der.ei}"]`); const r = el ? el.getBoundingClientRect() : { right: 500, top: 200 };
  m.style.left = Math.min(r.right + 8, window.innerWidth - 240) + 'px'; m.style.top = Math.max(8, Math.min(r.top, window.innerHeight - 140)) + 'px';
  m.querySelectorAll('[data-sel]').forEach(b => b.onclick = () => { const a = b.dataset.sel; if (a === 'sup') dr_selSup(); if (a === 'ecr') dr_selEcrire(); if (a === 'vide') dr_selVide(); }); }
function dr_selSup(){ const e = ecran(); const sous = DR_SEL.filter(x => x.ei != null && !DR_SEL.some(y => y.ei == null && y.bi === x.bi)), blocs = DR_SEL.filter(x => x.ei == null);
  sous.sort((a, b) => b.ei - a.ei).forEach(x => { const b = e.blocs[x.bi]; if (!b) return; const arr = b.t === 'question' ? b.reps : (Array.isArray(b.etapes) ? b.etapes : null); if (arr) arr.splice(x.ei, 1); });
  blocs.map(x => x.bi).sort((a, b) => b - a).forEach(bi => { if (e.blocs.length <= 1) return; e.blocs.splice(bi, 1); if (typeof p8NotesBloc === 'function') { try { p8NotesBloc(S.di, bi, 'supprimer'); } catch (er) {} } });
  const n = DR_SEL.length; dr_selVide(); if (typeof dr_annulerCoupure === 'function') dr_annulerCoupure(); if (typeof marquerModif === 'function') marquerModif({ di: S.di, selection: 'supprimer', n }); dr_tout(); }
function dr_selEcrire(){ if (typeof dr_annulerCoupure === 'function') dr_annulerCoupure(); const e = ecran(); const l = Array.isArray(e.aEcrire) ? e.aEcrire : []; DR_SEL.forEach(x => { const b = e.blocs[x.bi]; if (!b) return; const id = b.bid || b.id; const c = x.ei == null ? String(id) : id + '.' + x.ei; if (!l.includes(c)) l.push(c); }); e.aEcrire = l;
  try { const d = etatDiapo(); d.ecr = Array.from(new Set((d.ecr || []).concat(dr_ecrDeLaTrame(e)))); } catch (er) {}
  dr_selVide(); if (typeof marquerModif === 'function') marquerModif({ di: S.di, selection: 'a-ecrire' }); dr_tout(); }
/* pour etatDiapo() (crochet du socle) : « à écrire » préparé dans la trame, en éléments de la diapo ('b'+bi pour un bloc, k pour une étape) */
function dr_ecrDeLaTrame(e){ try { e = e || ecran(); const l = Array.isArray(e && e.aEcrire) ? e.aEcrire : []; if (!l.length) return []; const els = elements(e); const out = [];
  l.forEach(c => { const p = String(c).split('.'); const bi = e.blocs.findIndex(b => String(b.bid || b.id) === p[0]); if (bi < 0) return; if (p.length < 2) { out.push('b' + bi); return; } const k = els.findIndex(x => x.b === bi && String(x.e) === p[1]); if (k >= 0) out.push(k); }); return out; } catch (er) { return []; } }
document.addEventListener('mousedown', ev => { try { if (typeof S === 'undefined' || !S.atelier || !(ev.ctrlKey || ev.metaKey) || ev.button !== 0) return; const li = ev.target.closest && ev.target.closest('#mur li[data-p]'); const bloc = !li && ev.target.closest && ev.target.closest('#mur .bloc[data-bi]'); if (!li && !bloc) return;
  ev.preventDefault(); ev.stopImmediatePropagation(); const x = li ? { bi: +li.dataset.p.split('.')[0], ei: +li.dataset.p.split('.')[1] } : { bi: +bloc.dataset.bi, ei: null }; if (li && isNaN(x.ei)) return;
  const i = DR_SEL.findIndex(y => y.bi === x.bi && y.ei === x.ei); if (i >= 0) DR_SEL.splice(i, 1); else DR_SEL.push(x); dr_selPeindre(); dr_selMenu(); } catch (e) {} }, true);
document.addEventListener('click', ev => { try { if (DR_SEL.length && (ev.ctrlKey || ev.metaKey) && ev.target.closest && ev.target.closest('#mur')) { ev.preventDefault(); ev.stopImmediatePropagation(); } } catch (e) {} }, true);
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && DR_SEL.length) { dr_selVide(); } }, true);
/* (E4 · relecteur continu B2) avec une sélection de deux éléments ou plus : le clic droit sur l'un d'eux ouvre le menu de la sélection (lisait : le menu d'un seul élément) ; Suppr hors d'un champ supprime la sélection */
document.addEventListener('contextmenu', ev => { try { if (DR_SEL.length < 2 || typeof S === 'undefined' || !S.atelier) return; const el = ev.target.closest && ev.target.closest('#mur .dr-sel'); if (!el) return; ev.preventDefault(); ev.stopImmediatePropagation(); dr_selMenu(); const m = document.getElementById('dr-sel-menu'); if (m) { m.style.left = Math.min(ev.clientX, window.innerWidth - 240) + 'px'; m.style.top = Math.max(8, Math.min(ev.clientY, window.innerHeight - 140)) + 'px'; } } catch (e) {} }, true);
window.addEventListener('keydown', ev => { try { if (!DR_SEL.length || typeof S === 'undefined' || !S.atelier || ev.key !== 'Delete') return; const a = document.activeElement; if (a && (a.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(a.tagName))) return; ev.preventDefault(); ev.stopImmediatePropagation(); dr_selSup(); } catch (e) {} }, true);
(function(){ let k = null; const obs = new MutationObserver(() => { if (!DR_SEL.length) return; const c = (typeof S !== 'undefined') ? S.si + '|' + S.di + '|' + !!S.atelier : null; if (k && c !== k) { dr_selVide(); k = c; return; } k = c; dr_selPeindre(); }); const go = () => obs.observe(document.body, { childList: true, subtree: true }); if (document.body) go(); else document.addEventListener('DOMContentLoaded', go); })();
