import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const J = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const store = { classes: J('banc/hub/classes.json'), site: { '3e': J('banc/hub/site_3e.json'), config: J('banc/hub/site_config.json'),
  edt: { grille: { '2026-2027': J('banc/grille-appariee.json') }, calendrier: { '2026-2027': J('banc/calendrier.json') }, creneaux: { '2026-2027': J('banc/creneaux.json') } } } };
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const page = await ctx.newPage();
await page.clock.setFixedTime(new Date("2026-09-08T10:12:00+02:00"));
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
await page.goto('file:///home/claude/prod_index.html?n=3e', { waitUntil: 'load' }); await pause(1800);
await page.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; }); await pause(300);
await nettoyer(); await page.click('#tprof-btn'); await pause(500);
await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800);
await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
// choisir la classe et lancer la séance (régime classe)
const classes = await page.evaluate(() => Array.from(document.querySelectorAll('#at-dr-classe option')).map(o => o.value));
dit('classes proposées : '+JSON.stringify(classes));
await page.selectOption('#at-dr-classe', classes.find(c => /Charles/.test(c)) || classes[0]); await pause(300);
await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
dit('régime : '+await page.evaluate(() => AT_DR_REGIME)+' | cours_actif écrit : '+await page.evaluate(() => window.__ECR.filter(x => /cours_actif/.test(x)).length));
const W = () => page.frames().find(f => f.name() === 'at-dr-iframe') || page.frames()[1];
const fr = page.frameLocator('#at-dr-iframe');
await nettoyer(); await page.screenshot({ path: 'vis/vif-01-classe-lancee.png' });
// 1. ² depuis la page : le champ VIF prend le focus ?
await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '²', bubbles: true }))); await pause(200);
dit('après ² : élément actif dans le cadre = '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const a=d.activeElement; return a ? (a.tagName+'#'+a.id) : 'aucun'; }));
await page.keyboard.press('F2'); await pause(200);
dit('après F2 : élément actif = '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const a=d.activeElement; return a ? (a.tagName+'#'+a.id) : 'aucun'; }));
// 2. taper des initiales dans le VIF, voir la suggestion, poser 1
await page.keyboard.type('cj'); await pause(300);
dit('suggestion VIF : '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const s=d.getElementById('vif-sug')||d.querySelector('[id*=sug]'); return s? s.innerText.slice(0,120) : 'aucune'; }));
await page.keyboard.press('1'); await pause(300);
dit('PARTICIPATION après 1 : '+await page.evaluate(() => { const W=document.getElementById('at-dr-iframe').contentWindow; return JSON.stringify(W.PARTICIPATION).slice(0,300); }));
await nettoyer(); await page.screenshot({ path: 'vis/vif-02-apres-1.png' });
// 3. Maj+Espace depuis un élément de la diapo : la palette
await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const el=d.querySelector('#contenu li[data-p]'); if(el) el.focus(); });
await page.keyboard.press('Shift+ ' ); await pause(300);
dit('palette ouverte ? '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const p=d.getElementById('vif-palette'); return p? 'oui ('+(p.style.display||'affichée')+')' : 'non'; }));
await page.keyboard.type('ze'); await pause(300);
dit('suggestion palette : '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const s=d.getElementById('vif-pal-sug'); return s? s.innerText : 'aucune'; }));
await nettoyer(); await page.screenshot({ path: 'vis/vif-03-palette.png' });
await page.keyboard.press('2'); await pause(300);
dit('PARTICIPATION après palette 2 : '+await page.evaluate(() => { const W=document.getElementById('at-dr-iframe').contentWindow; return Object.keys(W.PARTICIPATION).map(k => k+':'+W.PARTICIPATION[k].length).join(' '); }));
dit('focus revenu ? '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const a=d.activeElement; return a ? (a.tagName+' '+(a.dataset&&a.dataset.p||'')) : 'aucun'; }));
// 4. le panneau participation : clic sur un nom → historique
const noms = await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; return Array.from(d.querySelectorAll('#part [onclick*=ouvrirPart]')).slice(0,5).map(x => x.innerText.trim().slice(0,20)); });
dit('noms cliquables dans le panneau : '+JSON.stringify(noms));
await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const x=d.querySelector('#part [onclick*=ouvrirPart]'); if(x) x.click(); }); await pause(300);
dit('historique ouvert : '+await page.evaluate(() => { const d=document.getElementById('at-dr-iframe').contentDocument; const p=d.getElementById('ppop'); return p? (p.classList.contains('on')+' | '+p.innerText.replace(/\s+/g,' ').slice(0,200)) : 'pas de ppop'; }));
await nettoyer(); await page.screenshot({ path: 'vis/vif-04-historique.png' });
// 5. qui a participé au tableau : ouvrir le tableau puis bqui
const [tab] = await Promise.all([ctx.waitForEvent('page').catch(() => null), page.evaluate(() => { const W=document.getElementById('at-dr-iframe').contentWindow; if (typeof W.tableau==='function') W.tableau(); })]);
await pause(1200);
dit('fenêtre du tableau : '+(tab ? 'ouverte' : 'aucune'));
await page.evaluate(() => { const W=document.getElementById('at-dr-iframe').contentWindow; if (typeof W.quiParle==='function') W.quiParle(); }); await pause(600);
if (tab) { dit('modale qui au tableau : '+await tab.evaluate(() => { const q=document.getElementById('qui'); return q? (q.classList.contains('on')+' | '+q.innerText.replace(/\s+/g,' ').slice(0,160)) : 'aucune'; })); await tab.screenshot({ path: 'vis/vif-05-qui-au-tableau.png' }); }
dit('écritures au faux hub : '+await page.evaluate(() => window.__ECR.length)+' — '+await page.evaluate(() => window.__ECR.filter(x => /prises|part|deroule_joue/.test(x)).slice(-4).join(' ; ')));
dit('erreurs JS : '+JSON.stringify(errs));
fs.writeFileSync('vis/vif-journal.txt', jrn.join('\n')); await nav.close();
