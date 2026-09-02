import puppeteer from 'puppeteer-core';
import chromiumMod from '@sparticuz/chromium';
import path from 'path';
const chromium = chromiumMod.default || chromiumMod;
const nav = await puppeteer.launch({ executablePath: await chromium.executablePath(),
  args: [...chromium.args, '--no-sandbox', '--allow-file-access-from-files'], headless: true });
const page = await nav.newPage();
await page.setViewport({ width: 1600, height: 900 });
page.on('pageerror', e => console.log('⚠ ' + String(e).slice(0, 120)));
await page.goto('file://' + path.resolve('T-7a-annee.html'), { waitUntil: 'load' });
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: 'tests/T-7a-annee-dezoome.png' });
const m = await page.evaluate(() => {
  const bandeaux = Array.from(document.querySelectorAll('.b'));
  const parNature = n => bandeaux.filter(b => b.classList.contains(n)).length;
  const j = Array.from(document.querySelectorAll('.j')).filter(x => x.style.visibility !== 'hidden');
  const plat = j.filter(x => x.classList.contains('plat'));
  const unSamedi = plat.find(x => x.querySelector('.d').textContent === 'S');
  const unMardi = j.find(x => !x.classList.contains('plat') && x.querySelector('.d').textContent === 'M');
  const verdun = bandeaux.find(b => (b.dataset.t || '').indexOf('Verdun') >= 0);
  const cheval = bandeaux.filter(b => b.textContent.indexOf('→') >= 0 || b.textContent.indexOf('←') >= 0);
  const pastilles = Array.from(document.querySelectorAll('.pas'));
  const max = Math.max(...pastilles.map(p => p.children.length));
  return { colonnes: document.querySelectorAll('.mois').length,
    bandeaux: bandeaux.length, etab: parNature('etab'), classe: parNature('classe'), jalon: parNature('jalon'),
    joursVac: j.filter(x => x.classList.contains('vac')).length,
    joursFer: j.filter(x => x.classList.contains('fer')).length,
    hauteurSamedi: unSamedi ? Math.round(unSamedi.getBoundingClientRect().height) : null,
    hauteurMardi: unMardi ? Math.round(unMardi.getBoundingClientRect().height) : null,
    numeroSamedi: unSamedi ? unSamedi.querySelector('.n').textContent + unSamedi.querySelector('.d').textContent : null,
    verdun: verdun ? { texte: verdun.textContent, jours: verdun.dataset.jours,
      hauteur: Math.round(verdun.getBoundingClientRect().height) } : null,
    aChevalSurDeuxMois: cheval.map(b => b.textContent).slice(0, 4),
    pastillesMax: isFinite(max) ? max : 0,
    pageHauteur: document.body.scrollHeight, fenetre: window.innerHeight,
    debordeVertical: document.body.scrollHeight > window.innerHeight + 2,
    debordeColonne: (() => { let d = 0; document.querySelectorAll('.mois').forEach(c => {
      const rc = c.getBoundingClientRect();
      c.querySelectorAll('.b').forEach(b => { const rb = b.getBoundingClientRect();
        if (rb.right > rc.right + 1 || rb.bottom > rc.bottom + 1) d++; }); }); return d; })(),
    traitsVerticaux: document.querySelectorAll('.barre,.trait,hr').length };
});
console.log('DÉZOOMÉ : ' + JSON.stringify(m, null, 1));
await page.evaluate(() => zoomer(true));
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: 'tests/T-7a-annee-zoome.png' });
const z = await page.evaluate(() => {
  const an = document.getElementById('an');
  const b = Array.from(document.querySelectorAll('.b')).find(x => (x.dataset.t || '').length > 25);
  return { defilementHorizontal: an.scrollWidth > an.clientWidth + 2,
    largeurContenu: an.scrollWidth, largeurVue: an.clientWidth,
    exempleLibelle: b ? b.textContent.slice(0, 60) : null,
    libelleEntier: b ? (b.scrollWidth <= b.clientWidth + 1) : null,
    hauteurBandeau: b ? Math.round(b.getBoundingClientRect().height) : null };
});
console.log('ZOOMÉ : ' + JSON.stringify(z));
await nav.close();
