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
