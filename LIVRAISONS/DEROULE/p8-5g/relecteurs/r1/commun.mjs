import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
const ici = path.dirname(fileURLToPath(import.meta.url));
export const R1 = ici;
export const URL = 'file://' + path.join(ici, '..', 'maquette-pilotage-ordi-v9c15p8-manipulable.html');
export const pause = ms => new Promise(r => setTimeout(r, ms));

const LIGNES = [
  'Première longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Deuxième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Troisième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Quatrième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Cinquième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Sixième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Septième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
  'Huitième longue ligne tapée par Paul pour remplir la diapo et la faire passer en pages au tableau',
];

export async function demarrer({ w = 1280, h = 800, lancer = true, lignes = true, pilotage = true } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on('pageerror', e => erreurs.push('pilote: ' + e.message));
  page.on('dialog', d => d.accept());
  await page.goto(URL);
  await pause(500);
  if (lignes) {
    await page.click('#edt-cases [data-atelier="1"]');
    await pause(500);
    if (await page.locator('#at-aide .x').isVisible().catch(() => false)) await page.click('#at-aide .x');
    await pause(200);
    await page.locator('#mur .p8-ecrire').first().click();
    await pause(200);
    for (let i = 0; i < LIGNES.length; i++) {
      await page.keyboard.type(LIGNES[i]);
      if (i < LIGNES.length - 1) await page.keyboard.press('Enter');
    }
    await page.keyboard.press('Escape');
    await pause(300);
    if (pilotage) { await page.click('#ong-pilotage');
    await pause(400); }
  }
  if (lancer) {
    await page.locator('[data-lancer="1"]').first().click();
    await pause(600);
  }
  return { browser, ctx, page, erreurs };
}

export async function ouvrirEcran2(page, erreurs) {
  const [pop] = await Promise.all([page.waitForEvent('popup'), page.click('#bvideoproj')]);
  pop.on('pageerror', e => erreurs && erreurs.push('tableau: ' + e.message));
  await pop.waitForLoadState();
  return pop;
}

// état lisible d'un mur : compteur, lignes visibles (texte), hors cadre
export async function etatMur(p, sel) {
  return p.evaluate(sel => {
    const m = document.querySelector(sel);
    if (!m) return null;
    const r = m.getBoundingClientRect();
    const pg = m.querySelector('.page');
    const corps = m.querySelector('.corpsd');
    const els = corps ? Array.from(corps.querySelectorAll('li, .rep')) : [];
    const vis = els.filter(e => { const cs = getComputedStyle(e); return !e.classList.contains('hors') && cs.display !== 'none' && cs.visibility !== 'hidden' && e.offsetHeight > 0; });
    const hors = [];
    m.querySelectorAll('*').forEach(e => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const b = e.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) return;
      // ignore elements inside a hidden ancestor
      if (e.closest('.hors')) return;
      if (b.top < r.top - 1 || b.bottom > r.bottom + 1 || b.left < r.left - 1 || b.right > r.right + 1) {
        // clipped by overflow ancestor?
        let a = e.parentElement, clip = false;
        while (a && a !== m) { const c = getComputedStyle(a); if (c.overflow !== 'visible' || c.overflowY !== 'visible') { const ab = a.getBoundingClientRect(); if (b.top >= ab.top - 1 && b.bottom <= ab.bottom + 1) {} else if (ab.top >= r.top - 1 && ab.bottom <= r.bottom + 1) clip = true; } a = a.parentElement; }
        hors.push({ tag: e.tagName, cls: e.className && String(e.className).slice(0, 40), top: Math.round(b.top - r.top), bot: Math.round(b.bottom - r.top), H: Math.round(r.height), clip, txt: (e.textContent || '').trim().slice(0, 30) });
      }
    });
    return {
      compteur: pg ? pg.textContent.replace(/[‹›]/g, '').trim() : null,
      nVis: vis.length,
      vis: vis.map(e => (e.textContent || '').trim().slice(0, 25)),
      dev: vis.filter(e => !e.classList.contains('pas')).map(e => (e.textContent || '').trim().slice(0, 25)),
      police: corps ? getComputedStyle(corps).fontSize : null,
      titre: (m.querySelector('h1,h2,.titre') || {}).textContent?.trim().slice(0, 40),
      hors,
    };
  }, sel);
}

// visibles pour la classe au tableau (dévoilés) : comparer aux visibles au pilote non pâles
export async function comparer(page, pop, etiquette) {
  const a = await etatMur(page, '#mur');
  const b = await etatMur(pop, '#mur2');
  const memes = a && b && JSON.stringify(a.dev) === JSON.stringify(b.vis);
  const ok = a && b && a.compteur === b.compteur && memes && b.hors.length === 0;
  console.log(`[${etiquette}] pilote: «${a?.compteur}» vis=${a?.nVis} police=${a?.police} | tableau: «${b?.compteur}» vis=${b?.nVis} police=${b?.police} hors=${b?.hors.length}${ok ? '' : '  <<< ÉCART' + (memes ? '' : ' lignes pilote-dév=' + JSON.stringify(a?.dev.map(t=>t.slice(0,12))) + ' tableau=' + JSON.stringify(b?.vis.map(t=>t.slice(0,12))))}`);
  if (b && b.hors.length) console.log('   hors cadre tableau:', JSON.stringify(b.hors.slice(0,5)));
  return { a, b, ok };
}
