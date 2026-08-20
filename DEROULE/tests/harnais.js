// Harnais de test deroule86.html — LECTURE SEULE STRICTE
// - la maquette est servie en file:// local, AUCUN accès au hub autorisé
// - tout dialogue est journalisé et REFUSÉ par défaut (règle du 19/07)
// - toute requête réseau sortante est journalisée et BLOQUÉE
const c = require('@sparticuz/chromium');
const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const INV = fs.readFileSync('/home/claude/harnais-invariants-v2.py', 'utf8')
  .split('INV = r"""')[1].split('"""')[0];

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

  await page.goto('file:///home/claude/DEROULE/deroule86.html', { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));
  // injection des invariants
  await page.evaluate(INV);
  return { browser, page, journal };
}

async function inv(page) {
  return page.evaluate(() => { try { return window.__inv(); } catch (e) { return ['__inv en échec: ' + e.message]; } });
}

module.exports = { boot, inv };

// exécution directe : boot + état des lieux
if (require.main === module) {
  (async () => {
    const { browser, page, journal } = await boot();
    const etat = await page.evaluate(() => ({
      titre: document.title,
      ecrans: typeof ECRANS !== 'undefined' ? ECRANS.length : 'ECRANS absent',
      fnCles: ['dessine','devoile','tableau','gel','zoom','recit','ouvre'].map(f => f + ':' + (typeof window[f])).join(' '),
      onglets: [...document.querySelectorAll('.ong, [class*=ong]')].slice(0,10).map(e => e.textContent.trim().slice(0,20)),
      corps: document.body ? document.body.children.length + ' enfants body' : 'pas de body',
    }));
    const invariants = await inv(page);
    console.log(JSON.stringify({ etat, invariants, journal }, null, 1));
    await page.screenshot({ path: '/home/claude/cap-00-boot.png' });
    await browser.close();
  })().catch(e => { console.error('HARNAIS KO:', e.message); process.exit(1); });
}
