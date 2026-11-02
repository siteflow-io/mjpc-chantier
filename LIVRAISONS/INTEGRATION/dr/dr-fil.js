/* ═══ dr-fil.js — LE FIL DE LA SÉANCE ; LES FLÈCHES DE LA COLONNE ET LA MOLETTE COMME DANS POWERPOINT (mandat C16 « fil et navigation », C16 61 à 66) ═══
   Ce que ça change en classe (Paul, 01/11 23:24) : « Sur la diapo tu vois un point qui descend le long d'une ligne. Dans mon diapo d'origine ce point indique où on
   en est dans la séance. Il faudrait qu'il y ait ça sur toutes les diapos et que ça descende au fur et à mesure des diapos. Par ailleurs dans la colonne de gauche,
   les flèches du clavier doivent avoir le même comportement que dans diaporama (passer d'une diapo à l'autre). Même chose quand on Scroll les diapos dans la vue
   centrale : le Scroll doit faire défiler les diapos. »
   1. LE FIL (C16 62, 63) : sur chaque diapo de la séance, un trait vertical et son point, à gauche, dans la marge (le dessin du canon 4, qui devient celui de toutes
      les diapos). Le point se place au rang de la diapo parmi celles que la classe voit dans la séance — toutes ses heures, le cahier de textes compris, ni
      masquées ni retirées — tout en haut à la première, tout en bas à la dernière. Il glisse d'un cran d'une diapo à l'autre : la seule animation permanente
      (dr.css) ; un dévoilement ne le bouge pas. Le rang se calcule au pilote et part avec l'état (`et.fil`) : la fenêtre du tableau et le tableau distant
      n'ont pas la séance, ils dessinent ce qu'ils reçoivent (la même fonction `rendre`, dr-socle.js).
   2. LA COLONNE A LA MAIN (C16 64) : dès que Paul a cliqué dans la colonne de gauche, ← → ↑ ↓ passent à l'entrée précédente ou suivante de la colonne (en classe :
      les vignettes, une par page ; dans l'Atelier : les diapos), jusqu'à ce qu'il clique ailleurs. Espace et « ▶ Dévoiler » dévoilent toujours ; Alt + ↑ ↓
      déplace toujours la diapo dans l'Atelier (dr-socle.js, l'écoute de l'Atelier, avant celle-ci).
   3. LA MOLETTE (C16 65) : sur la vue centrale, un cran = une diapo ; un geste continu (un pavé tactile qui glisse) = une seule diapo ; une diapo à plusieurs
      pages passe d'abord ses pages. Ctrl + molette reste le zoom ; le cahier de textes fait défiler sa carte ; la loupe garde la sienne (dr-socle.js).
   4. EN CLASSE (C16 66, la règle de Paul du 17/09 : seul ▶ est le fil) : le premier saut (flèche de la colonne, cran, vignette) demande « La classe te suivrait » ;
      une fois accepté, Paul passe d'une diapo à l'autre sans qu'elle redemande, jusqu'à ce qu'il clique sur la diapo ou reprenne ▶ (dr_garde, dr-socle.js).
   ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

var DR_FIL = { main: false, libre: null, mol: { t: -1e9, acc: 0, pris: false } };

/* ── 1 · le rang : les diapos que la classe voit dans la séance, heure après heure (l'ordre de chaque heure, `ordreHeure`, figé à son lancement) ;
   une diapo masquée ne compte pas (l'Atelier la montre, la classe jamais) ; une diapo retirée en classe ne compte plus dans son heure, et une diapo
   glissée compte dans l'heure où elle passe (sa première place après son heure) ── */
function dr_filOrdre(){ const E = seance().ecrans; const hs = [...new Set(E.map(e => e && e.heure).filter(h => h != null))].sort((a, b) => a - b); const L = [], vu = new Set();
  hs.forEach(h => { let o = []; try { o = ordreHeure(h); } catch (x) {} o.forEach(i => { const e = E[i]; if (!e || vu.has(i)) return; if (e.masquee && e.role !== 'fin') return;
    if (e.heure === h && e.role !== 'fin' && typeof retiree === 'function' && retiree(e)) return; vu.add(i); L.push(i); }); });
  return L; }
/* { r, n, y } : le rang (0 = la première), le nombre de diapos, la hauteur du point (0 en haut, 1 en bas) ; une diapo qui ne compte pas (masquée, retirée)
   montre le point de la diapo qui compte juste avant elle dans son heure — il ne bouge pas pour elle */
function dr_filDe(si, di){ try { if (typeof S === 'undefined' || !S || si !== S.si) return null; const E = seance().ecrans; if (!E[di]) return null; const L = dr_filOrdre(); const n = L.length; if (!n) return null;
  let r = L.indexOf(di); if (r < 0) { let o = []; try { o = ordreHeureCalc0(E[di].heure); } catch (x) {} const k = o.indexOf(di); for (let j = k - 1; j >= 0 && r < 0; j--) r = L.indexOf(o[j]); if (r < 0) r = 0; }
  return { r, n, y: n > 1 ? Math.round(r / (n - 1) * 10000) / 10000 : 0 }; } catch (e) { return null; } }
/* le dessin : sur le bleu nuit, les couleurs du canon 4 ; sur une diapo claire, le bleu nuit — les deux dans la charte (DR_CHARTES, dr-ouverture.js) */
function dr_filHtml(fil, sombre){ if (!fil || typeof fil.y !== 'number') return ''; const ch = typeof dr_ouvCharte === 'function' ? dr_ouvCharte() : null; if (!ch) return '';
  const c = sombre ? [ch.fil, ch.point, ch.carreOn] : [ch.filClair, ch.pointClair, ch.bordClair];
  return `<div class="dr-fil${sombre ? ' dr-fil-sombre' : ''}" aria-hidden="true" data-fil="${(+fil.r || 0) + 1}/${+fil.n || 1}" style="--fil-y:${fil.y};--fil-c:${c[0]};--fil-p:${c[1]};--fil-b:${c[2]}"><i></i></div>`; }
/* le fil d'un rendu (`rendre`, dr-socle.js) : celui que l'état apporte (le pilote l'y met ; la fenêtre du tableau et le tableau distant le reçoivent) ;
   sans lui, au pilote seulement (une vignette, la diapo suivante, une mesure de pages), il se calcule ici ; la fenêtre du tableau ne le calcule jamais */
function dr_filPour(et, sombre){ if (!et) return ''; let f = et.fil; if (f === undefined) { if (typeof dr_estTableau === 'function' && dr_estTableau()) return ''; f = dr_filDe(et.si, et.di); } return dr_filHtml(f, sombre); }
/* l'infobulle de la colonne (une vignette, son en-tête), écrite pour Paul : ce que fait le geste, ce qu'il coûte en classe */
var DR_FIL_BULLE = ' · avant de lancer l’heure, après un clic dans la colonne, ↑ ↓ ← → passent à la vignette d’au-dessus ou d’en dessous, comme dans PowerPoint, et la molette sur la diapo fait défiler les diapos ; dès que l’heure est lancée (ou la répétition jouée), ni la molette ni les flèches de la colonne ne changent de diapo : tu avances par → ou ▶ (dévoiler) ; pour aller ailleurs, un clic sur une vignette, puis « ❄ Geler, puis y aller »';
/* C16 (les dernières dettes, ⑱ ; MANDAT-DERNIERES-DETTES §3.7, Paul 02/11 07:48 : « Dès qu'un diapo est lancé, la façon d'avancer c'est soit dévoiler, soit gel.
   pas de scroll ou autre, qui sert en préparation, jamais en jeu en classe, ni en répétition. ») — EN JEU (l'heure lancée et pas close, ou la répétition jouée ;
   jamais dans l'Atelier) : la molette sur la vue centrale et les flèches de la colonne ne changent ni de diapo ni de page. → et ▶ dévoilent (et passent à la
   diapo suivante quand tout est dévoilé : le fil) ; ← revient ; un clic sur une vignette ouvre la garde (« ❄ Geler, puis y aller »), inchangée. Dans l'Atelier
   et avant le lancement, rien ne change. Ctrl + molette (le zoom), le cahier de textes et la loupe ne passent pas par ici (dr-socle.js) : inchangés. */
function dr_filEnJeu(){ try { return !S.atelier && (!!S.repetition || (!!S.lancee && !S.close)); } catch (e) { return false; } }

/* ── 2 · la colonne a la main : un clic dedans la lui donne, un clic ailleurs la lui reprend (la garde « La classe te suivrait » n'est pas « ailleurs » :
   c'est elle qui laisse passer la flèche) ; un clic sur la diapo rend aussi la garde au prochain saut (C16 66) ── */
function dr_filMarquer(){ const v = document.getElementById('volet'); if (v) { v.classList.toggle('dr-fil-main', !!DR_FIL.main && !dr_filEnJeu()); } }   /* C16 (⑱) : en jeu, la colonne n'a pas la main : pas de trait d'or qui promettrait des flèches */
document.addEventListener('pointerdown', ev => { const t = ev.target; if (!t || !t.closest) return;
  if (t.closest('#volet')) { if (!DR_FIL.main) { DR_FIL.main = true; dr_filMarquer(); } return; }
  if (t.closest('#garde, #garde2')) return;
  if (DR_FIL.main) { DR_FIL.main = false; dr_filMarquer(); }
  if (t.closest('#mur, #murcadre')) DR_FIL.libre = null; }, true);
/* les flèches ne vont pas à la colonne quand un menu, une palette ou une fenêtre du déroulé les prend, ni après la clôture de l'heure (dr-classe.js bloque
   alors ← → : la classe n'est plus là) */
function dr_filBloque(){ try { const on = id => { const x = document.getElementById(id); return !!(x && x.classList.contains('on')); };
  if (['menu', 'menuplus', 'ppop', 'vif-palette', 'vtoutes', 'fraison', 'garde', 'garde2'].some(on)) return true; if (document.querySelector('.choix-obj')) return true;
  if (S.lancee && S.close && !S.atelier) return true; return false; } catch (e) { return true; } }
/* l'écoute du clavier du déroulé (dr-socle.js) la consulte avant →, ← : rend vrai si la flèche est pour la colonne */
function dr_filColonneTouche(ev){ if (!DR_FIL.main || !/^Arrow(Up|Down|Left|Right)$/.test(ev.key) || ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return false;
  if (dr_filEnJeu()) { if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') { ev.preventDefault(); return true; } return false; }   /* C16 (⑱) : en jeu, ↑ ↓ de la colonne ne font rien ; ← → gardent leur sens de la classe (revenir, dévoiler) */
  if (!document.getElementById('volet') || dr_filBloque()) return false; ev.preventDefault(); dr_filPas(ev.key === 'ArrowDown' || ev.key === 'ArrowRight' ? 1 : -1, 'fleche'); return true; }
/* la vignette ou la ligne courante reste visible dans la colonne (au plus près : rien ne bouge si elle se voit déjà) */
function dr_filMontrer(){ try { const v = document.getElementById('volet'); const c = v && v.querySelector('.vig.cour, .dr-d.on'); if (!c) return; const r = c.getBoundingClientRect(), R = v.getBoundingClientRect(); let d = 0;
  if (r.top < R.top) d = r.top - R.top - 6; else if (r.bottom > R.bottom) d = r.bottom - R.bottom + 6; if (d) { if (typeof DR_VOLET !== 'undefined') DR_VOLET.auto = true; v.scrollTop += d; } } catch (e) {} }
/* un pas dans la colonne (`sens` : +1 la suivante, -1 la précédente) ; `source` : 'fleche' ou 'molette' (la molette passe d'abord les pages de la diapo) */
function dr_filPas(sens, source){
  const a = document.activeElement; if (a && a.isContentEditable && a.closest && a.closest('#mur')) a.blur();   /* ce que Paul écrivait dans la diapo s'enregistre avant qu'elle change, comme quand il clique dans la colonne */
  if (S.atelier) {   /* l'Atelier : une ligne par diapo, toutes les heures ; le geste d'un clic sur la ligne (dr-atelier.js, dr_colEcouter) */
    if (source === 'molette') { const P = S.pagesCourantes, pg = S.page || 0; if (P && P.length > 1 && ((sens > 0 && pg < P.length - 1) || (sens < 0 && pg > 0))) { pageMain(sens); return; } }
    const L = Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => +d.dataset.atDi); const k = L.indexOf(S.di), j = k + sens; if (k < 0 || j < 0 || j >= L.length) return;
    const i = L[j]; const e = seance().ecrans[i]; if (!e) return; if (typeof DR_COL !== 'undefined') { DR_COL.sel = []; DR_COL.ancre = e.eid; }
    S.di = i; S.page = null; S.pageManuelle = false;
    if (source === 'molette' && sens < 0) { const n = ((p85hPages(i) || {}).pages || [0]).length; if (n > 1) { S.page = n - 1; S.pageManuelle = true; } }   /* en remontant : la dernière page de la diapo d'avant */
    journal('atelier-diapo', { di: S.di }); dr_tout(); dr_filMontrer(); return; }
  /* en classe (et en répétition, et avant le lancement) : les vignettes, une par page, dans l'ordre de la colonne */
  const V = Array.from(document.querySelectorAll('#volet .vig[data-i]')).map(v => ({ i: +v.dataset.i, pg: v.dataset.pg != null && v.dataset.pg !== '' ? +v.dataset.pg : null, cour: v.classList.contains('cour') }));
  let k = V.findIndex(v => v.cour); if (k < 0) k = V.findIndex(v => v.i === S.di); if (k < 0) return; const c = V[k], d = V[k + sens]; if (!d) return;
  if (d.i === c.i) { pageMain(sens); dr_filMontrer(); return; }   /* la page d'à côté de la même diapo : ce n'est pas un saut, pas de garde (comme Maj + ← →) */
  p85hAllerPage(d.i, d.pg); dr_filMontrer(); }

/* ── 3 · la molette sur la vue centrale (l'écoute de #murcadre, dr-socle.js, la lui passe hors du cahier de textes, de la loupe et de Ctrl) : un pas par geste —
   un cran de souris (un coup d'au moins 50 px, après 90 ms sans molette) en est un ; un pavé tactile qui glisse envoie des dizaines de petits coups sans pause :
   ils s'additionnent, font un pas à 40 px, puis plus rien jusqu'à ce que le geste s'arrête (220 ms sans molette) ── */
function dr_filMolette(ev){ ev.preventDefault(); if (dr_filEnJeu()) return;   /* C16 (⑱) : en jeu, la molette ne change ni de diapo ni de page */ const on = id => { const x = document.getElementById(id); return !!(x && x.classList.contains('on')); }; if (on('garde') || on('garde2')) return;
  const M = DR_FIL.mol; const t = ev.timeStamp || Date.now(); const gap = t - M.t; M.t = t; let d = +ev.deltaY || 0; if (ev.deltaMode === 1) d *= 40; else if (ev.deltaMode === 2) d *= 800; if (!d) return;
  if (gap >= 220 || (Math.abs(d) >= 50 && gap >= 90)) { M.acc = 0; M.pris = false; } if (M.pris) return;
  M.acc += d; if (Math.abs(M.acc) < 40) return; const sens = M.acc > 0 ? 1 : -1; M.acc = 0; M.pris = true;
  if (dr_filBloque()) return; dr_filPas(sens, 'molette'); }

/* ── 4 · la garde (dr-socle.js, dr_garde) : acceptée une fois — « ❄ Geler, puis y aller » ou « Y aller devant la classe » — elle laisse passer les sauts
   suivants de la même heure, dans le même état (gelé ou non), jusqu'au prochain clic sur la diapo ou au prochain ▶ ── */
function dr_filGardeAcceptee(){ DR_FIL.libre = { si: S.si, h: S.heure, gel: !!S.gel }; }
function dr_filGardeLibre(){ const l = DR_FIL.libre; return !!(l && l.si === S.si && l.h === S.heure && l.gel === !!S.gel); }
