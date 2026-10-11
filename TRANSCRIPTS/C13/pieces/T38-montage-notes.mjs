import { chromium } from 'playwright';
import path from 'path';

const file = 'file://' + path.resolve('./maquette.html');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('pageerror', e => console.log('PAGE EXCEPTION:', e.message));

await page.goto(file);
await page.waitForTimeout(600);
await page.click('[data-atelier]');
await page.waitForTimeout(300);
await page.click('#at-jouer');
await page.waitForTimeout(400);

// Le bandeau de répétition tel que validé ce matin (ok de Paul)
await page.evaluate(() => {
  ['rep-bandeau', 'rep-etat'].forEach(id => { const x = document.getElementById(id); if (x) x.remove(); });
  const haut = document.querySelector('.haut');
  haut.classList.add('mock-repetition');
  const onglets = haut.querySelector('.onglets');
  const pre = document.createElement('span'); pre.textContent = 'RÉPÉTITION ·';
  pre.style.cssText = 'color:#c99a4e;font-weight:700;letter-spacing:.03em;margin-right:10px;align-self:center';
  haut.insertBefore(pre, onglets);
  const bfin = document.getElementById('bfin'); bfin.style.display = 'none';
  const btn = document.createElement('button'); btn.className = 'btn or'; btn.textContent = '■ Arrêter';
  bfin.insertAdjacentElement('afterend', btn);
  const st = document.createElement('style');
  st.textContent = `.haut.mock-repetition{background:#241c10!important;border-bottom:1.6px solid #c99a4e!important}`;
  document.head.appendChild(st);
});

// Trois dévoilements, par la fonction du pilote
const info = await page.evaluate(() => { devoiler(); devoiler(); devoiler(); return { n: elements(ecran()).length, nDev: etatDiapo().nDev, act: ecran().act }; });
console.log('diapo :', info);
await page.waitForTimeout(300);

// Chrono dans la bande de titre, cohérent avec l'état
await page.evaluate((info) => {
  const h = document.getElementById('heure');
  const s = document.createElement('span'); s.style.cssText = 'margin-left:8px;color:#c99a4e';
  s.textContent = `· répét. 00:41 · diapo 1, dévoilée ${info.nDev} / ${info.n}`;
  h.insertAdjacentElement('afterend', s);
}, info);

// Le panneau « Notes pour cette diapo » : la proposition
await page.evaluate((nDev) => {
  const st = document.createElement('style');
  st.textContent = `
.notes .mn{position:relative;padding:5px 0 5px 36px;color:var(--sourd);line-height:1.45;font-size:.95rem}
.notes .mn .k{position:absolute;left:0;top:6px;width:24px;height:24px;border-radius:50%;border:1px solid var(--bord);font-size:.74rem;display:flex;align-items:center;justify-content:center;color:var(--sourd)}
.notes .mn.fait{opacity:.5}
.notes .mn.vif{color:#f1e7d2;font-size:1.08rem}
.notes .mn.vif .k{border-color:#c99a4e;color:#c99a4e;background:#2a2114;font-weight:700}
.notes .mn.vif::before{content:'';position:absolute;left:-12px;top:4px;bottom:4px;width:3px;background:#c99a4e;border-radius:2px}
.notes{padding-left:18px}`;
  document.head.appendChild(st);
  const notes = [
    { k: null, t: 'Laisser le silence s’installer. Ne rien commenter des tableaux : ils découvrent.' },
    { k: 1, t: '5 min montre en main. Si ça parle, rappeler : on regarde, on ne dit rien.' },
    { k: 3, t: 'Tableau à trois colonnes au brouillon — passer dans les rangs, repérer deux ou trois formulations à reprendre à l’oral.' },
    { k: 5, t: 'Attendu : « nature », « solitude », « sublime » — ne pas les donner. Noter qui les trouve (VIF).' },
    { k: 6, t: 'Trois ou quatre élèves à l’oral, pas plus. Enchaîner sur la diapo 2 sans conclure.' }
  ];
  // la note vive = la dernière dont l'ancre est dévoilée (k ≤ nDev) ; sans ancre = à l'arrivée sur la diapo
  let vif = -1; notes.forEach((n, i) => { if (n.k == null || n.k <= nDev) vif = i; });
  const d = document.getElementById('notesd');
  d.innerHTML = notes.map((n, i) => `<div class="mn${i === vif ? ' vif' : i < vif ? ' fait' : ''}"><span class="k">${n.k == null ? '⌂' : n.k}</span>${n.t}</div>`).join('');
}, info.nDev);

await page.waitForTimeout(200);
await page.screenshot({ path: 'notes-proposition.png' });
console.log('notes-proposition.png capturé');
await browser.close();
