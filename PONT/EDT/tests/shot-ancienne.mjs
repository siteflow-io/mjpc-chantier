import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import fs from 'fs'; import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const store = { classes: J('hub-classes.json'), site: { '3e': J('hub-site3e.json'),
  config: J('hub-siteconfig.json'), edt: { grille: { '2026-2027': J('grille-deux-classes.json') },
    calendrier: { '2026-2027': J('calendrier-2026-2027.json') },
    creneaux: { '2026-2027': J('creneaux-2026-2027.json') } } } };
const faux = s => { window.__HUB = JSON.parse(JSON.stringify(s));
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n ?? null; };
  window.fetch = (u, o) => { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      if (((o && o.method) || 'GET').toUpperCase() === 'GET')
        return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      return Promise.resolve(new Response('null', { status: 200 })); }
    return Promise.resolve(new Response('null', { status: 200 })); }; };
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
await page.evaluateOnNewDocument(faux, store);
await page.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
await page.evaluate(() => document.body.classList.add('admin-mode'));
await page.evaluate(() => new Promise(r => edtChargerClasses(() => edtCharger(r))));
await new Promise(r => setTimeout(r, 1600));
await page.evaluate(() => { edtOuvrir(); const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
await new Promise(r => setTimeout(r, 900));
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-ecran button'))
  .filter(x => x.innerText.trim() === 'Année')[0]; if (b) b.click(); });
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: process.argv[3] });
console.log(JSON.stringify(await page.evaluate(() => ({
  version: APP_VERSION,
  elements: { pistes: document.querySelectorAll('.edt-an-piste').length,
    frises: document.querySelectorAll('.edt-an-frise,.edt-an-bar').length,
    reperes: document.querySelectorAll('.edt-an-rep').length,
    texte: (document.querySelector('#edt-ecran .edt-annee') || {}).innerText?.slice(0, 200) || '(pas de .edt-annee)' } }))));
await nav.close();
