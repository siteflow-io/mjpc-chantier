/* la mesure : 0 chevauchement, 0 hors de la diapo, 0 trait à travers un libellé, aucun libellé sur deux lignes, police >= 26 pt (loi : 32 pt = 5,6 % de la hauteur de la diapo) */
window.mesureP8 = function () {
  const mur = document.querySelector('#mur'); const M = mur.getBoundingClientRect(); const pt = px => +(px / (M.height * 0.056) * 32).toFixed(1);
  const c = document.querySelector('#mur .p8carte'); if (!c) return { erreur: 'pas de carte p8 au mur' };
  const boites = [c.querySelector('.p8c'), ...c.querySelectorAll('.p8b')].map(e => ({ e, r: e.getBoundingClientRect(), nom: e.textContent.trim().slice(0, 30) }));
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const chev = []; for (let i = 0; i < boites.length; i++) for (let j = i + 1; j < boites.length; j++) if (inter(boites[i].r, boites[j].r) > 0) chev.push(boites[i].nom + ' × ' + boites[j].nom);
  const V = cadreP8(c); const hors = boites.filter(b => b.r.left < V.left - 0.5 || b.r.right > V.right + 0.5 || b.r.top < V.top - 0.5 || b.r.bottom > V.bottom + 0.5).map(b => b.nom + ' (dépasse : g ' + Math.round(V.left - b.r.left) + ', d ' + Math.round(b.r.right - V.right) + ', h ' + Math.round(V.top - b.r.top) + ', b ' + Math.round(b.r.bottom - V.bottom) + ' px)');
  const textes = e => { const rg = document.createRange(); rg.selectNodeContents(e); return Array.from(rg.getClientRects()).filter(x => x.width > 1); };
  const couches = couchesP8(c); const chevCouches = []; couches.forEach(kr => boites.forEach(b => { if (inter(kr, b.r) > 0) chevCouches.push(b.nom); }));
  const S0 = c.getBoundingClientRect(); const traits = Array.from(c.querySelectorAll('svg.p8t line')).map(l => [+l.getAttribute('x1') + S0.left, +l.getAttribute('y1') + S0.top, +l.getAttribute('x2') + S0.left, +l.getAttribute('y2') + S0.top]);
  const coupe = (s, r) => { const N = 60; for (let k = 1; k < N; k++) { const x = s[0] + (s[2] - s[0]) * k / N, y = s[1] + (s[3] - s[1]) * k / N; if (x > r.left + 1 && x < r.right - 1 && y > r.top + 1 && y < r.bottom - 1) return true; } return false; };
  const traversent = []; traits.forEach((s, i) => boites.forEach(b => { if (textes(b.e).some(r => coupe(s, r))) traversent.push('trait ' + (i + 1) + ' × ' + b.nom); }));
  const lignes = Array.from(c.querySelectorAll('.p8c, .p8b .bt, .p8b .bs')).map(e => { const rg = document.createRange(); rg.selectNodeContents(e); const rects = Array.from(rg.getClientRects()).filter(x => x.width > 1); const tops = new Set(rects.map(x => Math.round(x.top))); return { t: e.textContent.trim(), lignes: tops.size, px: +parseFloat(getComputedStyle(e).fontSize).toFixed(1), pt: pt(parseFloat(getComputedStyle(e).fontSize)) }; });
  const sousPlancher = lignes.filter(l => l.pt < 26).map(l => l.t + ' (' + l.pt + ' pt)');
  const deuxLignes = lignes.filter(l => l.lignes > 1).map(l => l.t);
  const occ = boites.reduce((s, b) => s + b.r.width * b.r.height, 0) / (M.width * M.height);
  return { diapo: { l: Math.round(M.width), h: Math.round(M.height), police32pt: +(M.height * 0.056).toFixed(1) }, libelles: lignes, chevauchements: chev, horsDiapo: hors, chevauchementsCouches: chevCouches, couchesMesurees: couches.length, placement: c.dataset.p8, traitsAtraversUnLibelle: traversent, nTraits: traits.length, sousPlancher, surDeuxLignes: deuxLignes, occupation: +(occ * 100).toFixed(1) + ' %', cadreVisible: { l: Math.round(V.width), h: Math.round(V.height), g: Math.round(V.left - M.left), d: Math.round(M.right - V.right), haut: Math.round(V.top - M.top), bas: Math.round(M.bottom - V.bottom) } };
};
