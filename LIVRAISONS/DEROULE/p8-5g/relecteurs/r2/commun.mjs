import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const ici = path.dirname(fileURLToPath(import.meta.url));
export const URL = 'file://' + path.resolve(ici, '../maquette-pilotage-ordi-v9c15p8-manipulable.html');
export const R2 = ici;
export const pause = ms => new Promise(r => setTimeout(r, ms));

export async function ouvrir(w = 1280, h = 800) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') erreurs.push('console: ' + m.text()); });
  await page.goto(URL);
  await pause(500);
  return { browser, ctx, page, erreurs };
}

export async function versAtelier(page) {
  await page.click('#edt-cases [data-atelier="1"]');
  await pause(400);
  const x = await page.$('#at-aide .x');
  if (x && await x.isVisible()) { await x.click(); await pause(200); }
}

export const LIGNES = [
  'Première longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Deuxième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Troisième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Quatrième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Cinquième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Sixième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Septième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
  'Huitième longue ligne tapée par Paul pour remplir la diapo jusqu au bord du cadre',
];

export async function taperHuit(page, lignes = LIGNES) {
  await page.click('#mur .p8-ecrire');
  await pause(200);
  for (let i = 0; i < lignes.length; i++) {
    await page.keyboard.type(lignes[i], { delay: 2 });
    if (i < lignes.length - 1) await page.keyboard.press('Enter');
  }
  await pause(200);
  await page.keyboard.press('Escape');
  await pause(400);
}

// état d'une page (pilote ou tableau) : compteur, éléments hors cadre, lignes visibles
export async function etat(p, sel = '#mur') {
  return p.evaluate((sel) => {
    const mur = document.querySelector(sel);
    if (!mur) return { absent: true };
    const rm = mur.getBoundingClientRect();
    const txt = (mur.innerText || '');
    const m = txt.match(/page\s+(\d+)\s*\/\s*(\d+)/i);
    // compteur : chercher élément contenant "page i / n" n'importe où dans la page
    const pg = mur.querySelector('.page'); const cpt = pg ? (pg.textContent.replace(/[‹›]/g,'').trim() || null) : 'pas de .page';
    const corps = mur.querySelector('.corpsd');
    const lignes = corps ? Array.from(corps.querySelectorAll('li, .rep')).filter(l => !l.classList.contains('hors') && getComputedStyle(l).display !== 'none').map(l => (l.dataset.k ?? '-') + ':' + l.className.replace(/\s+/g,'.') + ':' + l.textContent.trim().slice(0, 12)) : [];
    const police = corps ? getComputedStyle(corps).fontSize : null;
    const visibles = [], hors = [];
    for (const el of mur.querySelectorAll('*')) {
      if (el.children.length) continue;
      const t = (el.textContent || '').trim(); if (!t) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      // opacité cumulée
      let op = 1, x = el; while (x && x !== document.body) { const o = parseFloat(getComputedStyle(x).opacity); op *= o; if (getComputedStyle(x).display === 'none') { op = -1; break; } x = x.parentElement; }
      if (op <= 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const item = { t: t.slice(0, 40), top: Math.round(r.top - rm.top), bas: Math.round(r.bottom - rm.top) };
      if (r.top < rm.top - 1 || r.bottom > rm.bottom + 1 || r.left < rm.left - 1 || r.right > rm.right + 1) hors.push(item); else visibles.push(item);
    }
    return { cpt, police, lignes, mur: { h: Math.round(rm.height), w: Math.round(rm.width) }, nVis: visibles.length, visibles: visibles.map(v => v.t), hors };
  }, sel);
}

// comparaison pilote / tableau
export async function comparer(page, pop, etiquette) {
  const a = await etat(page, '#mur');
  const b = pop && !pop.isClosed() ? await etat(pop, '#mur2') : { absent: true };
  const dv = ls => (ls || []).filter(l => !/(^|\.)pas(\.|$)/.test(l.split(':')[1])).map(l => l.split(':')[0]).join(' ');
  const la = dv(a.lignes), lb = dv(b.lignes);
  const ok = !b.absent && a.cpt === b.cpt && la === lb && !(a.hors || []).length && !(b.hors || []).length;
  console.log(`${ok ? 'OK ' : 'KO '} ${etiquette} | pilote: ${a.cpt} [${la}] police ${a.police} hors ${(a.hors||[]).length} | tableau: ${b.cpt} [${lb}] police ${b.police} hors ${(b.hors||[]).length}`);
  if ((b.hors || []).length) console.log('   tableau hors:', JSON.stringify(b.hors.slice(0, 4)));
  if ((a.hors || []).length) console.log('   pilote hors:', JSON.stringify(a.hors.slice(0, 4)));
  return { ok, a, b };
}
export async function ouvrirEcran2(ctx, page) {
  const [pop] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]);
  await pause(700);
  return pop;
}
