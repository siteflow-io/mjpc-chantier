// Visualiser le déroulé du site (8.74.0-③) par le geste, sur le faux hub : les portes (EDT), la préparation, la classe, le tableau, la fin d'heure, la relecture, le papier.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs'; import path from 'path';
const ici = path.dirname(new URL(import.meta.url).pathname);
const J = f => JSON.parse(fs.readFileSync(path.join(ici, 'hub', f), 'utf8'));
const store = { classes: J('classes.json'), site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const nav = await chromium.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage(); await page.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00'));
const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
await page.addInitScript(s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); pos(c, bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; }, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const cap = async n => {};
const cliquerTexte = async (sel, txt) => page.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const D = () => page.evaluate(() => document.getElementById('at-dr-iframe').contentDocument);
const dans = (f, ...a) => page.evaluate(([src, args]) => { const W = document.getElementById('at-dr-iframe').contentWindow; return (new Function('W', 'd', 'args', 'return (' + src + ')(W, d, ...args)'))(W, W.document, args); }, [f.toString(), a]);

await page.goto('file://' + path.join(ici, 'index.html') + '?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(600);
await page.evaluate(() => { M8_TEST = true; }); console.log('mode test :', await page.evaluate(() => m8TestOn()));
await cap('00-panneau-prof');
// 1. l'emploi du temps : la case d'une heure, Préparer / Lancer
await page.evaluate(() => { try { edtOuvrir(); } catch (e) { console.log('edtOuvrir', e.message); } }); await pause(1500);
await cap('01-emploi-du-temps');
console.log('EDT boutons :', await page.evaluate(() => Array.from(document.querySelectorAll('#edt-modale button, #edt-ecran button, .edt-case button, [class*=edt] button')).filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(Boolean).slice(0, 30).join(' | ')));
const cases = await page.evaluate(() => Array.from(document.querySelectorAll('[class*=edt-case], [data-crn], [data-heure]')).filter(e => e.offsetParent !== null).slice(0, 8).map(e => e.className + ' | ' + (e.innerText || '').replace(/\s+/g, ' ').slice(0, 60)));
console.log('cases :', cases);
// cliquer la première case qui mentionne la 3E / lundi
const ok1 = await page.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); if (c) { c.click(); return (c.innerText || '').replace(/\s+/g, ' ').slice(0, 80); } return null; });
console.log('case cliquée :', ok1); await pause(1200); await cap('02-case-de-l-heure');
console.log('boutons de la case :', await page.evaluate(() => Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null && /Préparer|Lancer|Pilot/i.test(b.innerText)).map(b => b.innerText.trim()).join(' | ')));
console.log('EDT fermé par son bouton :', await cliquerTexte('button', 'Fermer l\u2019emploi du temps')); await pause(400);
// 2. l'atelier → le chapitre → la vue Déroulé (préparation)
await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await cap('03-preparation');
console.log('tête du déroulé :', await page.evaluate(() => (document.getElementById('at-dr-tete') || {}).innerText.replace(/\s+/g, ' ').slice(0, 300)));
console.log('outils du moteur :', await dans((W, d) => Array.from(d.querySelectorAll('button')).filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(Boolean).slice(0, 40).join(' | ')));
console.log('écrans :', await dans((W) => ({ n: W.ECRANS.length, i: W.i, premier: Object.keys(W.ECRANS[0]).join(',') , blocs: W.ECRANS[0].blocs.map(b => b.t).join(',') })));
// clic droit dans la préparation
await dans((W, d) => { const li = d.querySelector('#contenu li[data-p]'); if (li) li.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 })); }); await pause(400);
console.log('clic droit (préparation) :', await dans((W, d) => { const m = d.querySelector('#ctx, .ctx, .menu, [class*=menu]'); return m && m.offsetParent !== null ? m.innerText.replace(/\s+/g, ' ').slice(0, 300) : 'aucun'; }));
await cap('04-clic-droit-preparation');
// fermer le menu par le geste réel : un clic ailleurs dans la scène
await nettoyer(); await page.frameLocator('#at-dr-iframe').locator('body').click({ position: { x: 8, y: 8 } }); await pause(300);
console.log('menu fermé :', await dans((W, d) => { const m = d.querySelector('#ctx, .ctx, .menu, [class*=menu]'); return !(m && m.offsetParent !== null); }));
// 3. lancer la séance : le régime classe
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await page.evaluate(() => { const cr = document.getElementById('at-dr-creneau'); for (let j = 0; j < cr.options.length; j++) if (cr.options[j].text.startsWith('08:57')) cr.selectedIndex = j; cr.dispatchEvent(new Event('change')); const d = document.getElementById('at-dr-debut'); if (d) d.value = '08:57'; }); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000); await page.keyboard.press('Escape'); await pause(300);
await cap('05-classe-lancee');
console.log('tête en classe :', await page.evaluate(() => (document.getElementById('at-dr-tete') || {}).innerText.replace(/\s+/g, ' ').slice(0, 400)));
console.log('écritures au hub (lancement) :', await page.evaluate(() => window.__ECR.slice(0, 12)));
console.log('écritures au hub en mode test (lancement) :', await page.evaluate(() => window.__ECR));
console.log('erreurs JS :', errs); await nav.close();
