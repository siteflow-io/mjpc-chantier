// Montage : les mêmes boutons de mise en forme pour le tableau ET les notes de présentateur, plus la couleur du texte (points 7-8)
import { chromium } from 'playwright';
import path from 'path';

const file = 'file://' + path.resolve('./maquette.html');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
page.on('pageerror', e => console.log('PAGE EXCEPTION:', e.message));

await page.goto(file);
await page.waitForTimeout(600);
await page.click('[data-atelier]'); await page.waitForTimeout(300);
await page.click('#at-jouer'); await page.waitForTimeout(400);

// Le bandeau de répétition validé (tours 35-36)
await page.evaluate(() => {
  ['rep-bandeau', 'rep-etat'].forEach(id => { const x = document.getElementById(id); if (x) x.remove(); });
  const haut = document.querySelector('.haut'); haut.classList.add('mock-repetition');
  const pre = document.createElement('span'); pre.textContent = 'RÉPÉTITION ·';
  pre.style.cssText = 'color:#c99a4e;font-weight:700;letter-spacing:.03em;margin-right:10px;align-self:center';
  haut.insertBefore(pre, haut.querySelector('.onglets'));
  const bfin = document.getElementById('bfin'); bfin.style.display = 'none';
  const btn = document.createElement('button'); btn.className = 'btn or'; btn.textContent = '■ Arrêter'; bfin.insertAdjacentElement('afterend', btn);
  const st = document.createElement('style'); st.textContent = `.haut.mock-repetition{background:#241c10!important;border-bottom:1.6px solid #c99a4e!important}`; document.head.appendChild(st);
});

// Trois éléments dévoilés
const info = await page.evaluate(() => { devoiler(); devoiler(); devoiler(); return { n: elements(ecran()).length, nDev: etatDiapo().nDev }; });
await page.waitForTimeout(300);
await page.evaluate((info) => {
  const h = document.getElementById('heure'); const s = document.createElement('span'); s.style.cssText = 'margin-left:8px;color:#c99a4e';
  s.textContent = `· répét. 00:41 · diapo 1, dévoilée ${info.nDev} / ${info.n}`; h.insertAdjacentElement('afterend', s);
}, info);

// Au tableau : un surlignage jaune (existant) et une couleur de texte (nouveau) sur l'étape 3
await page.evaluate(() => {
  const li = document.querySelector('#mur li[data-k="2"]');
  li.innerHTML = li.innerHTML
    .replace('tableau à trois colonnes', '<mark style="background:#ffe94a">tableau à trois colonnes</mark>')
    .replace('Au moins trois lignes par colonne', '<span style="color:#c0392b;font-weight:600">Au moins trois lignes par colonne</span>');
});

// La barre : deux boutons, « surligner » et « couleur du texte » ; le clic ouvre la palette (comme dans Word)
await page.evaluate(() => {
  const st = document.createElement('style');
  st.textContent = `
.rond.mf{position:relative;flex-direction:column;gap:2px;font-family:"EB Garamond",Garamond,serif}
.rond.mf .lettre{font-weight:800;font-size:1.05rem;line-height:1}
.rond.mf .lettre.ab{background:#ffe94a;color:#1f1a14;border-radius:2px;padding:0 3px;font-size:.78rem;font-weight:700}
.rond.mf .trait{width:18px;height:4px;border-radius:2px}
.palette{position:absolute;left:50%;top:46px;transform:translateX(-50%);background:var(--carte2);border:1px solid var(--bord2);border-radius:8px;padding:6px;display:flex;gap:6px;align-items:center;z-index:20;box-shadow:0 6px 18px rgba(0,0,0,.45)}
.palette .p{width:24px;height:24px;border-radius:5px;border:1px solid var(--bord2);cursor:pointer}
.palette .p.aucune{background:var(--carte2);color:var(--texte2);font-size:.8rem;display:flex;align-items:center;justify-content:center}`;
  document.head.appendChild(st);
  const c = document.querySelector('.couleurs');
  const bSurl = document.createElement('button'); bSurl.className = 'rond mf'; bSurl.id = 'bsurl';
  bSurl.title = 'Surligner le texte sélectionné (dans la diapo : au tableau ; dans les notes : pour toi) — clic : choisir la couleur · Ctrl+H : jaune';
  bSurl.innerHTML = '<span class="lettre ab">ab</span><span class="trait" style="background:#ffe94a"></span>';
  const bTxt = document.createElement('button'); bTxt.className = 'rond mf'; bTxt.id = 'btxt';
  bTxt.title = 'Couleur du texte sélectionné (dans la diapo : au tableau ; dans les notes : pour toi) — clic : choisir la couleur';
  bTxt.innerHTML = '<span class="lettre">A</span><span class="trait" style="background:#ff7b6b"></span>';
  // la palette de la couleur du texte, ouverte pour la capture
  const pal = document.createElement('span'); pal.className = 'palette';
  [['rouge', '#ff7b6b'], ['vert', '#7ddc9a'], ['bleu', '#8ab8ff'], ['or', '#e3b94e']].forEach(([n, h]) => { const p = document.createElement('button'); p.className = 'p'; p.style.background = h; p.title = n; pal.appendChild(p); });
  const x = document.createElement('button'); x.className = 'p aucune'; x.textContent = '✕'; x.title = 'Sans couleur'; pal.appendChild(x);
  bTxt.appendChild(pal);
  c.replaceWith(bSurl); bSurl.insertAdjacentElement('afterend', bTxt);
});
// Le panneau de notes (tour 38), avec une mise en forme dans la note vive
await page.evaluate((nDev) => {
  const st = document.createElement('style');
  st.textContent = `
.notes .mn{position:relative;padding:5px 0 5px 36px;color:var(--sourd);line-height:1.45;font-size:.95rem}
.notes .mn .k{position:absolute;left:0;top:6px;width:24px;height:24px;border-radius:50%;border:1px solid var(--bord);font-size:.74rem;display:flex;align-items:center;justify-content:center;color:var(--sourd)}
.notes .mn.fait{opacity:.5}
.notes .mn.vif{color:#f1e7d2;font-size:1.08rem}
.notes .mn.vif .k{border-color:#c99a4e;color:#c99a4e;background:#2a2114;font-weight:700}
.notes .mn.vif::before{content:'';position:absolute;left:-12px;top:4px;bottom:4px;width:3px;background:#c99a4e;border-radius:2px}
.notes{padding-left:18px}
.notes mark{color:#1f1a14;border-radius:2px;padding:0 2px}`;
  document.head.appendChild(st);
  const notes = [
    { k: null, t: 'Laisser le silence s’installer. Ne rien commenter des tableaux : ils découvrent.' },
    { k: 1, t: '5 min montre en main. Si ça parle, rappeler : on regarde, on ne dit rien.' },
    { k: 3, t: '<mark style="background:#ffe94a">Tableau à trois colonnes</mark> au brouillon — passer dans les rangs, <span style="color:#ff7b6b;font-weight:600">repérer deux ou trois formulations à reprendre à l’oral</span>.' },
    { k: 5, t: 'Attendu : <span style="color:#7ddc9a;font-weight:600">« nature », « solitude », « sublime »</span> — ne pas les donner. Noter qui les trouve (VIF).' },
    { k: 6, t: 'Trois ou quatre élèves à l’oral, pas plus. Enchaîner sur la diapo 2 sans conclure.' }
  ];
  let vif = -1; notes.forEach((n, i) => { if (n.k == null || n.k <= nDev) vif = i; });
  document.getElementById('notesd').innerHTML = notes.map((n, i) => `<div class="mn${i === vif ? ' vif' : i < vif ? ' fait' : ''}"><span class="k">${n.k == null ? '⌂' : n.k}</span>${n.t}</div>`).join('');
}, info.nDev);

await page.waitForTimeout(200);
const mes = await page.evaluate(() => { const sc = document.querySelector('.scene').getBoundingClientRect(); const d = document.getElementById('bdev').getBoundingClientRect(); const p = document.getElementById('bprec').getBoundingClientRect(); const cpt = document.getElementById('compte').getBoundingClientRect(); return { scene: Math.round(sc.right), prec: Math.round(p.right), dev: Math.round(d.right), compte: Math.round(cpt.right), devVisible: d.right <= sc.right && d.width > 0 }; });
console.log('cadre de la scène (droite) :', mes.scene, '· ◀ :', mes.prec, '· ▶ Dévoiler :', mes.dev, '· compteur :', mes.compte, '· ▶ dans le cadre :', mes.devVisible);
await page.screenshot({ path: 'couleurs-ecran.png' });
// Zoom : la barre et le panneau de notes
const barre = await page.$eval('.outils', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
const notes = await page.$eval('.notes', e => { const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
await page.screenshot({ path: 'couleurs-zoom.png', clip: { x: Math.min(barre.x, notes.x) - 4, y: barre.y - 4, width: Math.max(barre.w, notes.w) + 8, height: (notes.y + notes.h) - barre.y + 8 } });
console.log('couleurs-ecran.png, couleurs-zoom.png capturés');
await browser.close();
