// Montages pour la proposition 96 : la barre unique Structure · Atelier · Pilotage · Relecture (Papier = face de la Relecture).
// Même faux hub que capturer.mjs ; les écrans sont réels, seule la barre est retouchée dans la page avant la capture (montage visuel, pas du code).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const ici = path.dirname(new URL(import.meta.url).pathname);
const J = f => JSON.parse(fs.readFileSync(path.join(ici, 'hub', f), 'utf8'));
const store = { classes: J('classes.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const nav = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-10-20T15:07:00+02:00'));
await page.addInitScript(s => { window.__HUB = JSON.parse(JSON.stringify(s)); const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} pos(c, bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; }, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const cap = async (pg, n) => { await pg.screenshot({ path: path.join(ici, 'vis', n + '.png') }); console.log('capture', n); };
const cliquerTexte = async (sel, txt) => page.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });

await page.goto('file://' + path.join(ici, 'index.html') + '?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
// M1 — l'arborescence : « Modifier » devient « Éditer dans l'atelier » (cadrage 4 §0.3), sur le chapitre comme sur une séance
await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#at-zone button')).find(x => x.innerText.trim() === 'Modifier'); if (b) b.innerText = 'Éditer dans l\'atelier'; });
await nettoyer(); await cap(page, 'M1-arborescence-editer-dans-l-atelier');
await cliquerTexte('button,[onclick]', 'Modifier') || await cliquerTexte('button,[onclick]', 'Éditer dans'); await pause(1500);
// M2 — la vue Structure du site, avec la barre unique
const barre = (active) => `const defs=[['structure','Structure'],['atelier','Atelier'],['pilotage','Pilotage'],['relecture','Relecture']]; const b=document.querySelector('.at-vues-barre'); if(b){ b.innerHTML = defs.map(d => '<button class="at-onglet'+(d[0]==='${active}'?' at-onglet-actif':'')+'" data-vue="'+d[0]+'">'+d[1]+'</button>').join(''); }`;
await page.evaluate(barre('structure')); await nettoyer(); await cap(page, 'M2-structure-barre-unique');
// M5 — ce que ça donnerait sans fusion : la maquette dans la vue Déroulé du site, sous la barre du site (deux barres, deux Relecture)
await page.evaluate(() => { const defs = [['structure', 'Structure'], ['deroule', 'Déroulé'], ['relecture', 'Relecture'], ['papier', 'Papier']]; const b = document.querySelector('.at-vues-barre'); b.innerHTML = defs.map(d => '<button class="at-onglet' + (d[0] === 'deroule' ? ' at-onglet-actif' : '') + '" data-vue="' + d[0] + '">' + d[1] + '</button>').join(''); });
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]'));
await page.evaluate(() => { const z = document.getElementById('at-zone'); const corps = z.querySelector('.at-vues-corps'); if (corps) { corps.innerHTML = '<iframe id="maq" src="maquette-p8-5g.html" style="width:100%;height:640px;border:0;background:#111"></iframe>'; corps.style.display = 'block'; } });
await pause(1500);
const fr = page.frames().find(f => f.url().includes('maquette-p8-5g'));
if (fr) { try { await fr.click('[data-atelier]'); await pause(500); if (await fr.$('#at-aide .x')) await fr.click('#at-aide .x'); } catch (e) { console.log('maquette dans le cadre :', e.message.slice(0, 80)); } }
await pause(500); await nettoyer(); await cap(page, 'M5-sans-fusion-deux-barres');

// M3 / M4 — la maquette avec la barre unique en tête (Atelier actif, puis Relecture avec la face Papier)
const pm = await ctx.newPage(); await pm.goto('file://' + path.join(ici, 'maquette-p8-5g.html')); await pause(800);
const barreMaquette = (active) => pm.evaluate((active) => { const h = document.querySelector('.haut'); if (!h) return; const ongs = Array.from(h.querySelectorAll('[id^=ong-]')); const pil = document.getElementById('ong-pilotage'); const rel = document.getElementById('ong-relecture'); const at = document.getElementById('ong-atelier');
  let st = document.getElementById('ong-structure'); if (!st) { st = document.createElement('button'); st.id = 'ong-structure'; st.className = pil.className.replace(/\bon\b/, '').trim(); st.textContent = 'Structure'; st.style.cssText = pil.style.cssText;
  pil.parentNode.insertBefore(st, pil); pil.parentNode.insertBefore(at, pil); } /* ordre : Structure · Atelier · Pilotage · Relecture */
  [st, at, pil, rel].forEach(b => { b.classList.toggle('on', b.id === 'ong-' + active); });
}, active);
await pm.click('[data-atelier]'); await pause(500); if (await pm.$('#at-aide .x')) await pm.click('#at-aide .x'); await pause(300);
await barreMaquette('atelier'); await cap(pm, 'M3-atelier-barre-unique');
await pm.click('#ong-pilotage'); await pause(300); await pm.click('[data-lancer="1"]'); await pause(600); for (let i = 0; i < 3; i++) { await pm.click('#bdev'); await pause(120); }
await barreMaquette('pilotage'); await cap(pm, 'M3b-pilotage-barre-unique');
await pm.click('#ong-relecture'); await pause(600); await barreMaquette('relecture');
await pm.evaluate(() => { const faces = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'Le chapitre'); if (faces) { const p = faces.cloneNode(true); p.textContent = 'Papier'; p.classList.remove('on'); faces.parentNode.insertBefore(p, faces.nextSibling); } });
await cap(pm, 'M4-relecture-face-papier');
await nav.close();
