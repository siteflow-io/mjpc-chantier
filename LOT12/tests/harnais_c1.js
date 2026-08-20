// Harnais C1 — paramétré par fichier (C1 8.57.1 ou base 8.56.2) — LECTURE SEULE STRICTE
const c = require('@sparticuz/chromium');
const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
async function boot(fichier, opts = {}) {
  const execPath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, '--disable-web-security'],
    executablePath: execPath, headless: 'shell',
    defaultViewport: opts.viewport || { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  const journal = { erreurs: [], dialogues: [], reseau: [] };
  page.on('pageerror', e => journal.erreurs.push(String(e)));
  page.on('dialog', async d => { journal.dialogues.push(d.type() + ': ' + d.message()); await d.dismiss(); });
  await page.setRequestInterception(true);
  page.on('request', r => {
    const u = r.url();
    if (u.startsWith('file://') || u.startsWith('data:')) return r.continue();
    journal.reseau.push(u); r.abort();
  });
  await page.goto('file:///home/claude/' + fichier, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));
  return { browser, page, journal };
}
module.exports = { boot };
