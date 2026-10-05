/* PROPOSITION p8 — injectée pour la capture seulement (rien de déposé, rien dans la maquette) */
(() => {
  const st = document.createElement('style');
  st.textContent = `
  .mur .sch:has(.p8carte) > .sch-t{display:none}
  .mur .sch-dessin:has(.p8carte){flex:1;min-height:0;height:100%;position:relative}
  .mur .p8carte{position:absolute;inset:0}
  .mur .p8carte svg.p8t{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
  .mur .p8c{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:.3em 1em;border:2px solid #c99a4e;background:#fff2c7;border-radius:50%;font-weight:700;white-space:nowrap;line-height:1.15}
  .mur .p8b{position:absolute;transform:translate(-50%,-50%);text-align:center;white-space:nowrap;line-height:1.2}
  .mur .p8b .bt{font-weight:700}
  .mur .p8b .bs{font-size:.8125em}
  .mur .p8b.pas,.mur svg.p8t line.pas{opacity:.3}
  .tableau .p8b.pas,.tableau svg.p8t line.pas{display:none}`;
  document.head.appendChild(st);
  const dessin0 = window.dessinerSchema;
  window.dessinerSchema = function (forme, titre, lignes, cl) {
    if (forme !== 'carte') return dessin0(forme, titre, lignes, cl);
    const n = lignes.length;
    const br = lignes.map(l => { const m = /^(.+?)\s*:\s*(.*)$/.exec(l); return m ? { t: m[1].trim(), sous: m[2].split(',').map(x => x.trim()).filter(Boolean) } : { t: l, sous: [] }; });
    const start = -90 - 180 / n;
    return `<div class="p8carte"><svg class="p8t"></svg><div class="p8c">${esc(titre)}</div>${br.map((b, i) => { const a = (start + i * 360 / n) * Math.PI / 180; const x = 50 + 33 * Math.cos(a), y = 50 + 34 * Math.sin(a); return `<div class="p8b ${cl(i)}" data-k="${i}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"><div class="bt">${esc(b.t)}</div>${b.sous.length ? `<div class="bs">${b.sous.map(esc).join(' · ')}</div>` : ''}</div>`; }).join('')}</div>`;
  };
  /* les traits : du bord de l'ellipse au bord du libellé, mesurés sur les boîtes réelles */
  function bordEllipse(cx, cy, rx, ry, dx, dy) { const t = 1 / Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)); return [cx + dx * t, cy + dy * t]; }
  function bordRect(cx, cy, hw, hh, dx, dy) { const tx = dx ? hw / Math.abs(dx) : Infinity, ty = dy ? hh / Math.abs(dy) : Infinity; const t = Math.min(tx, ty); return [cx + dx * t, cy + dy * t]; }
  let enTrace = false;
  /* les autres couches de la diapo (étiquette d'activité, numéro de page, légende…) : ce qui a du texte, hors de la carte */
  window.couchesP8 = function (c) { const mur = document.querySelector('#mur'); return Array.from(mur.querySelectorAll('*')).filter(x => !c.contains(x) && !x.contains(c) && x.offsetParent && Array.from(x.childNodes).some(n => n.nodeType === 3 && n.textContent.trim())).map(x => x.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0); };
  /* le cadre réellement visible : la diapo, rognée par tout ancêtre qui coupe ce qui dépasse (le bloc du schéma, le corps de la diapo) */
  window.cadreP8 = function (c) { const mur = document.querySelector('#mur'); let r = mur.getBoundingClientRect(); let L = r.left, T = r.top, Ri = r.right, B = r.bottom; for (let x = c.parentElement; x && x !== mur; x = x.parentElement) { const s = getComputedStyle(x); if (s.overflow !== 'visible' || s.overflowX !== 'visible' || s.overflowY !== 'visible') { const q = x.getBoundingClientRect(); L = Math.max(L, q.left); T = Math.max(T, q.top); Ri = Math.min(Ri, q.right); B = Math.min(B, q.bottom); } } return { left: L, top: T, right: Ri, bottom: B, width: Ri - L, height: B - T }; };
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  /* les positions se choisissent par la mesure : on essaie des départs et des rayons, on garde le premier sans chevauchement ni débordement */
  function placer(c) {
    const bs = Array.from(c.querySelectorAll('.p8b')); const n = bs.length; if (!n) return; const M = cadreP8(c); const ce = c.querySelector('.p8c'); const couches = couchesP8(c);
    let meilleur = null;
    for (const [rx, ry] of [[38, 40], [36, 38], [35, 36], [33, 34], [31, 33], [29, 31]]) for (let k = 0; k < 24; k++) {
      const start = -90 - 180 / n + k * 15;
      bs.forEach((b, i) => { const a = (start + i * 360 / n) * Math.PI / 180; b.style.left = (50 + rx * Math.cos(a)).toFixed(2) + '%'; b.style.top = (50 + ry * Math.sin(a)).toFixed(2) + '%'; });
      const R = [ce, ...bs].map(e => e.getBoundingClientRect()); let pen = 0;
      for (let i = 0; i < R.length; i++) { for (let j = i + 1; j < R.length; j++) pen += inter(R[i], R[j]); couches.forEach(k2 => pen += inter(R[i], k2)); pen += Math.max(0, M.left - R[i].left) + Math.max(0, R[i].right - M.right) + Math.max(0, M.top - R[i].top) + Math.max(0, R[i].bottom - M.bottom); }
      if (!meilleur || pen < meilleur.pen) meilleur = { pen, rx, ry, start, pos: bs.map(b => [b.style.left, b.style.top]) };
      if (pen === 0) break;
    }
    bs.forEach((b, i) => { b.style.left = meilleur.pos[i][0]; b.style.top = meilleur.pos[i][1]; }); c.dataset.p8 = JSON.stringify({ pen: Math.round(meilleur.pen), rx: meilleur.rx, ry: meilleur.ry, start: meilleur.start });
  }
  window.traceP8 = function () {
    document.querySelectorAll('.p8carte').forEach(c => {
      const R = c.getBoundingClientRect(); if (!R.width) return; enTrace = true; placer(c); const sv = c.querySelector('svg.p8t'); const ce = c.querySelector('.p8c').getBoundingClientRect();
      const cx = ce.left + ce.width / 2 - R.left, cy = ce.top + ce.height / 2 - R.top; const m = parseFloat(getComputedStyle(c).fontSize) * 0.25;
      let h = '';
      c.querySelectorAll('.p8b').forEach(b => { const r = b.getBoundingClientRect(); const bx = r.left + r.width / 2 - R.left, by = r.top + r.height / 2 - R.top; const dx = bx - cx, dy = by - cy; const [x1, y1] = bordEllipse(cx, cy, ce.width / 2 + 2, ce.height / 2 + 2, dx, dy); const [x2, y2] = bordRect(bx, by, r.width / 2 + m, r.height / 2 + m, -dx, -dy); h += `<line class="${b.classList.contains('pas') ? 'pas' : ''}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#c99a4e" stroke-width="3"/>`; });
      sv.setAttribute('viewBox', `0 0 ${R.width.toFixed(1)} ${R.height.toFixed(1)}`);
      if (sv.innerHTML !== h) sv.innerHTML = h; setTimeout(() => { enTrace = false; }, 0);
    });
  };
  new MutationObserver(() => { if (!enTrace) requestAnimationFrame(window.traceP8); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  window.addEventListener('resize', () => requestAnimationFrame(window.traceP8));
})();
