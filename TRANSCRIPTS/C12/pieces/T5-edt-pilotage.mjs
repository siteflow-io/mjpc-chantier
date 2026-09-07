import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const store = { classes: J('banc/hub/classes.json'), site: { '3e': J('banc/hub/site_3e.json'), config: J('banc/hub/site_config.json'),
  edt: { grille: { '2026-2027': J('banc/grille-appariee.json') }, calendrier: { '2026-2027': J('banc/calendrier.json') }, creneaux: { '2026-2027': J('banc/creneaux.json') } } } };
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date('2026-09-08T15:10:00+02:00'));
const errs = []; page.on('pageerror', e => errs.push(String(e.message).slice(0,160)));
await page.addInitScript(s => {
  window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = [];
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB;
    for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; }
    if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u);
    if (s2.indexOf('firebasedatabase.app') >= 0) {
      const c = s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '');
      const m = ((o && o.method) || 'GET').toUpperCase();
      if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 }));
      let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {}
      window.__ECR.push(m+' '+c); pos(c, bd);
      return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 }));
    }
    return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function(){ throw new Error('websocket bloqué'); };
}, store);
const pause = ms => new Promise(r => setTimeout(r, ms));
const nettoyer = () => page.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); });
const shot = async n => { await page.screenshot({ path: 'vis/'+n+'.png' }); };
const cliquerTexte = async (sel, txt) => page.evaluate(({s, t}) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent!==null && ((x.innerText||'')+(x.getAttribute('onclick')||'')).indexOf(t)>=0)[0]; if(!el) return false; el.click(); return true; }, {s: sel, t: txt});
const jrn = []; const dit = t => { jrn.push(t); console.log(t); };
const modales = () => page.evaluate(() => Array.from(document.querySelectorAll('.at-modale, #edt-modale, #edt-ecran, #tprof, .tprof, #at-zone, #doc-viewer')).filter(e => e.offsetParent!==null).map(e => (e.id||e.className)+' ['+((e.innerText||'').trim().replace(/\s+/g,' ').slice(0,70))+']'));
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
dit('heure vue par la page : '+await page.evaluate(() => new Date().toString()));
await page.evaluate(() => document.body.classList.add('admin-mode')); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(600);
await cliquerTexte('.tprof-section-btn', "showProfSection('edt')"); await pause(1500);
await shot('p01-section-edt');
dit('① panneau prof → Emploi du temps ; bouton ouvrir présent : '+await cliquerTexte('#edt-panneau [onclick]', 'edtOuvrir')); await pause(1800);
await shot('p02-grille');
dit('② grille ouverte, semaine : '+await page.evaluate(() => (window.EDT_VUE||{}).ancre));
// la case du lundi 08:57 de la semaine affichée
const cases = await page.evaluate(() => Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).map(n => { const oc=n.getAttribute('onclick')||''; const cle=(oc.match(/edtCaseClic\((?:"|&quot;|')([^"']+)/)||[])[1]||''; return {cle, txt:(n.innerText||'').trim().replace(/\s+/g,' ').slice(0,40)}; }));
dit('   cases occupées : '+JSON.stringify(cases.slice(0,8)));
const cible = cases.filter(c => c.cle.startsWith('2026-09-08|15:07') && c.cle.indexOf('FRANKLIN')>=0)[0];
dit('③ case visée : '+JSON.stringify(cible));
await page.evaluate(k => edtCaseClic(k), cible.cle); await pause(900);
await shot('p03-case-ouverte');
dit('   voile du site présent par-dessus : '+await page.evaluate(() => { const o=document.getElementById('fi-overlay'); return o? (o.innerText||'').trim().replace(/\s+/g,' ').slice(0,80) : 'non'; }));
await nettoyer(); await pause(300); await shot('p03b-case-sans-voile');
dit('   boutons de la modale : '+JSON.stringify(await page.evaluate(() => Array.from(document.querySelectorAll('#edt-modale button, .at-modale button')).filter(b=>b.offsetParent!==null).map(b => b.innerText.trim()))));
dit('④ clic « Ouvrir le pilotage et lancer » : '+await cliquerTexte('#edt-modale button, .at-modale button', 'edtLancer')); await pause(2500); await shot('p04-apres-lancer-2s'); await pause(4000);
await shot('p04-apres-lancer');
dit('   ce qui est visible : '+JSON.stringify(await modales()));
dit('   régime : '+await page.evaluate(() => ({regime: window.AT_DR_REGIME, cours: !!window.AT_DR_COURS, pret: window.AT_PONT&&AT_PONT.pret, tete: ((document.getElementById('at-dr-tete')||{}).innerText||'').replace(/\s+/g,' ').slice(0,160)})));
dit('   éléments au-dessus (z-index) sous le centre de l\'écran : '+JSON.stringify(await page.evaluate(() => { const st=document.elementsFromPoint(683,384).slice(0,6); return st.map(e => (e.id||e.className||e.tagName).toString().slice(0,40)); })));
dit('   sous le panneau prof : '+JSON.stringify(await page.evaluate(() => { const z=document.getElementById('at-zone'); const t=document.querySelector('.tprof-box'); const at=document.getElementById('atelier')||document.querySelector('.at-cadre, #at-ecran'); 
  const vis=e=>e&&e.offsetParent!==null; return { atZone: !!z, atZoneVisible: vis(z), atZoneTexte: z? (z.innerText||'').replace(/\s+/g,' ').slice(0,120):'', tprofVisible: vis(t), tprofZ: t? getComputedStyle(t.closest('#tprof')||t).zIndex:'', atelierZ: z? getComputedStyle(z.closest('.atelier, #atelier')||z).zIndex:'' , cadre: !!document.getElementById('at-dr-iframe'), cadreVisible: vis(document.getElementById('at-dr-iframe')) }; })));
dit('   ⑤ clic sur la croix du panneau prof : '+await page.evaluate(() => { const b=Array.from(document.querySelectorAll('button')).filter(x => x.offsetParent!==null && /^\s*[✕×]\s*$/.test(x.innerText) && x.closest('.tprof-box'))[0]; if(!b) return false; b.click(); return true; })); await pause(1200); await shot('p05-panneau-prof-ferme');
dit('   ce qui est visible après : '+JSON.stringify(await page.evaluate(() => { const vis=e=>e&&e.offsetParent!==null; return { atZone: vis(document.getElementById('at-zone')), cadre: vis(document.getElementById('at-dr-iframe')), tprof: vis(document.querySelector('.tprof-box')), centre: document.elementsFromPoint(683,384).slice(0,4).map(e => (e.id||e.className||e.tagName).toString().slice(0,40)) }; })));
dit('écritures au faux hub : '+JSON.stringify(await page.evaluate(() => window.__ECR)));
dit('erreurs JS : '+JSON.stringify(errs));
fs.writeFileSync('vis/edt-pilotage-journal.txt', jrn.join('\n'));
await nav.close();
