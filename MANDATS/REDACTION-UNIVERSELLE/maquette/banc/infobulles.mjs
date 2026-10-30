// Infobulles : tout ce qui se clique, se tape ou se tient sur l'écran des scans porte une explication écrite pour Paul (un title), état par état.
import { createRequire } from 'node:module'; import path from 'node:path';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const MAQ = path.join(DIR, process.argv[2] || 'T399-maquette-redaction-scans-v10.html');
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 } });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => err.push(e.message)); pg.on('dialog', d => { err.push('boîte ' + d.message()); d.dismiss(); });
await ctx.route(u => /firebasedatabase|firebaseio/.test(String(u)), r => { err.push('RÉSEAU HUB ' + r.request().url()); r.abort(); });
const PDFJS = process.env.PDFJS || '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/reperes/node_modules/pdfjs-dist/build/';
await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const att = ms => pg.waitForTimeout(ms); const manque = new Map(); let vus = 0;
const releve = async etat => { const L = await pg.evaluate(() => { const S = 'button, a[href], input:not([type=hidden]), select, textarea, label, [onclick], [onpointerdown], [role=button], .sc-vig, .sc-passe, #scCopie svg [data-id]';
  const vis = e => { const r = e.getBoundingClientRect(); if (!r.width || !r.height) return false; const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[hidden]'); };
  const ecrit = e => { if (e.namespaceURI !== 'http://www.w3.org/2000/svg') return !!(e.getAttribute('title') || (e.tagName === 'INPUT' && e.closest('label[title]')) || (e.tagName !== 'LABEL' && e.closest('button[title], label[title]'))); for (let x = e; x && x !== document.body; x = x.parentElement) { if (x.getAttribute && x.getAttribute('title')) return true; if (x.querySelector && x.namespaceURI === 'http://www.w3.org/2000/svg' && x.querySelector(':scope > title')) return true; if (x.id === 'scCopie' || x.id === 'scPanneau') break; } return false; };
  const zone = document.querySelectorAll('#scanEcran, #scModale, .sc-maq, #scLoupe, #scRetouche'); const T = []; zone.forEach(z => z.querySelectorAll(S).forEach(e => { if (!vis(e)) return; if (e.tagName === 'LABEL' && !e.querySelector('input') && !e.onclick) return; T.push({ ok: ecrit(e), txt: ((e.innerText || e.value || e.placeholder || e.getAttribute('data-id') || e.tagName) + '').replace(/\s+/g, ' ').trim().slice(0, 50), id: e.id || e.className.baseVal || e.className || e.tagName }); })); return T; });
  vus += L.length; L.filter(t => !t.ok).forEach(t => { const k = t.txt + ' [' + t.id + ']'; if (!manque.has(k)) manque.set(k, etat); }); };
try {
await pg.goto('file://' + MAQ); await att(1500); await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(1800);
await pg.click('#btnScan'); await att(600); await releve('écran vide');
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-essai.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 8, null, { timeout: 60000 }); await att(800); await releve('les initiales');
for (const ini of ['ec', 'la', 'mb', '', 'tb', 'gc', 'rb']) { await pg.keyboard.type(ini); await att(150); await pg.keyboard.press('Enter'); await att(250); }
await att(300); await releve('passe 1');
const r = await pg.locator('.sc-page').first().boundingBox(); const tr = async (x0, y0, x1, y1) => { await pg.mouse.move(r.x + x0 * r.width, r.y + y0 * r.height); await pg.mouse.down(); await pg.mouse.move(r.x + x1 * r.width, r.y + y1 * r.height, { steps: 6 }); await pg.mouse.up(); await att(250); };
await tr(0.25, 0.175, 0.33, 0.185); await pg.keyboard.type('éc'); await att(200); await releve('la bonne forme qu\'on tape'); await pg.keyboard.press('Escape'); await att(200);
await pg.click('text=💬 Remarque'); await att(200); await tr(0.4, 0.3, 0.6, 0.33); await att(200); await releve('une remarque'); await pg.keyboard.press('Escape'); await att(200);
await pg.mouse.click(r.x + 0.29 * r.width, r.y + 0.18 * r.height); await att(200); await releve('une marque choisie');
await pg.click('text=✂ Page 1'); await att(900); await releve('la retouche'); await pg.keyboard.press('Escape'); await att(300);
for (let i = 1; i < 4; i++) { await pg.click('.sc-passe >> nth=' + i); await att(400); await releve('passe ' + (i + 1)); }
await pg.click('.sc-passe >> nth=1'); await att(300); await pg.click('text=Replier'); await att(300); await releve('panneau replié'); await pg.click('text=Déplier'); await att(300);
await pg.click('text=📨 Fichiers École Directe'); await att(400); await releve('fichiers École Directe'); await pg.keyboard.press('Escape'); await att(300);
const mq = pg.locator('text=⚙ Maquette'); if (await mq.count()) { await mq.first().click(); await att(300); await releve('⚙ Maquette'); await pg.keyboard.press('Escape'); }
} catch (e) { console.log('ARRÊT : ' + String(e.message).split('\n')[0]); }
console.log(vus + ' éléments vus, ' + manque.size + ' sans infobulle'); for (const [k, v] of manque) console.log('  ✗ ' + v + ' : ' + k); if (err.length) console.log('ERREURS\n' + err.join('\n'));
await b.close();
