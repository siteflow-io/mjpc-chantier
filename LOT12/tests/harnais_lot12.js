// Harnais LOT12 — index.html 8.57.0 (nettoyage diaporama) — LECTURE SEULE STRICTE
// Adapté de DEROULE/tests/harnais.js : chemin file:// vers l'index de travail,
// injection __inv RETIRÉE (spécifique déroulé). Gardés : refus des dialogues,
// blocage réseau total (file:// et data: seuls autorisés).
const c = require('@sparticuz/chromium');
const chromium = c.default || c;
const puppeteer = require('puppeteer-core');

async function boot(opts = {}) {
  const execPath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--disable-web-security'],
    executablePath: execPath,
    headless: 'shell',
    defaultViewport: opts.viewport || { width: 1440, height: 900 },
  });
  const page = await browser.newPage();

  const journal = { console: [], erreurs: [], dialogues: [], reseau: [] };
  page.on('console', m => { const t = m.type(); if (t === 'error' || t === 'warning') journal.console.push(t + ': ' + m.text()); });
  page.on('pageerror', e => journal.erreurs.push(String(e)));
  page.on('dialog', async d => { journal.dialogues.push(d.type() + ': ' + d.message()); await d.dismiss(); });
  await page.setRequestInterception(true);
  page.on('request', r => {
    const u = r.url();
    if (u.startsWith('file://') || u.startsWith('data:')) return r.continue();
    journal.reseau.push(r.method() + ' ' + u);
    r.abort();
  });

  await page.goto('file:///home/claude/travail.html', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  return { browser, page, journal };
}

module.exports = { boot };
