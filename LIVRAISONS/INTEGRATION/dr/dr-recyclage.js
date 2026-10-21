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
function dr_mkChanger(f, bi){ const o = dr_mkBloc(bi); if (!o) return; if (typeof dr_annulerEmpiler === 'function') dr_annulerEmpiler('marques'); dr_mkRendreEnregistrable(o.b); f(o.b); if (typeof dr_sauve === 'function') dr_sauve(); if (typeof journal === 'function') journal('atelier-modif', { quoi: 'marques', di: S.di }); dr_tout(); dr_mkPanneau(); }
function dr_setSupport(v){ dr_mkChanger(b => { b.support = v; if (!v) b.marques = []; }); }
function dr_setDev(v){ dr_mkChanger(b => { b.devoilerTout = v; }); }
function dr_armeMk(o){ DR_MK.outil = (DR_MK.outil === o) ? null : o; document.body.classList.toggle('dr-pose-mk', !!DR_MK.outil); dr_mkPanneau(); }
function dr_supMk(k, bi){ DR_MK.sel = null; dr_mkChanger(b => { b.marques.splice(k, 1); }, bi); }
function dr_poseMk(ev, sup){ const blocEl = sup.closest('[data-bi]'); const bi = blocEl ? +blocEl.dataset.bi : null; const r = sup.getBoundingClientRect(); const outil = DR_MK.outil;
  dr_mkChanger(b => { const n = b.marques.filter(m => m.t === 'pt').length + 1; b.marques.push({ t: outil, x: Math.round((ev.clientX - r.left) / r.width * 1000) / 10, y: Math.round((ev.clientY - r.top) / r.height * 1000) / 10, txt: outil === 'pt' ? String(n) : (outil === 'fl' ? '' : 'à écrire'), w: 18, h: 14 }); }, bi);
  DR_MK.outil = null; document.body.classList.remove('dr-pose-mk'); dr_mkPanneau(); }   /* l'ancien gardait l'outil armé : le panneau le réarme d'un clic */
function dr_editeMarque(mk){ const sp = mk.querySelector('span'); if (!sp) return; const k = +mk.dataset.mk, bi = +mk.dataset.bi;
  sp.setAttribute('contenteditable', 'true'); sp.focus(); try { const r = document.createRange(); r.selectNodeContents(sp); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
  let fini = false; const fin = annule => { if (fini) return; fini = true; sp.removeAttribute('contenteditable'); const t = sp.textContent.trim(); if (!annule) dr_mkChanger(b => { if (b.marques[k]) b.marques[k].txt = t; }, bi); else dr_tout(); };
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
document.addEventListener('keydown', ev => { try { if (typeof S === 'undefined' || !S.atelier) return; const a = document.activeElement; if (a && (a.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(a.tagName))) return;
  if (ev.key === 'Escape' && (DR_MK.outil || DR_MK.sel)) { DR_MK.outil = null; DR_MK.sel = null; document.body.classList.remove('dr-pose-mk'); dr_tout(); dr_mkPanneau(); }
  if (ev.key === 'Delete' && DR_MK.sel) { ev.preventDefault(); ev.stopImmediatePropagation(); dr_supMk(DR_MK.sel.k, DR_MK.sel.bi); } } catch (e) {} }, true);
/* après chaque rendu (pilote, atelier, tableau, vignettes) : calibrer ; le panneau suit la diapo de l'atelier */
(function(){ let attente = false; const apres = () => { attente = false; dr_calibreMarques(document); dr_mkPanneau(); };
  const obs = new MutationObserver(ms => { if (attente) return; if (ms.every(m => m.target && m.target.closest && m.target.closest('#dr-mk-panneau'))) return; attente = true; requestAnimationFrame(apres); });
  const brancher = () => { obs.observe(document.body, { childList: true, subtree: true }); window.addEventListener('resize', () => dr_calibreMarques(document)); };
  if (document.body) brancher(); else document.addEventListener('DOMContentLoaded', brancher); })();
