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
await nettoyer(); await page.click('#tprof-btn'); await pause(500); await page.evaluate(() => atelierOuvrir()); await pause(1000);
await cliquerTexte('button,[onclick]', "atOnglet('chapitres')"); await pause(800); await cliquerTexte('button,[onclick]', 'Modifier'); await pause(1500);
await page.evaluate(() => document.querySelector('.at-onglet[data-vue="deroule"]').click()); await pause(3500);
await page.selectOption('#at-dr-classe', '3E Charles de Gaulle'); await pause(300); await nettoyer(); await page.evaluate(() => atDrJouerClic()); await pause(3000);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.tableau())]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await pause(1500);
const W = () => page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.location.href);
const dev = async n => { for (let k = 0; k < n; k++) await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.devoile()); await pause(250); };
for (let k = 0; k < 8; k++) { const n = await tab.evaluate(() => document.querySelectorAll('.e ul.etapes li').length); if (n >= 3) break; await dev(1); }
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; const e = W.ECRANS[W.i]; const b = e.blocs.find(x => x.t === 'consigne'); e.ecrire = [W.idBloc(b) + '|et:1']; W.rendre(); W.envoie(); }); await pause(400);
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.spot(); W.document.querySelectorAll('#contenu ul.etapes li')[0].dispatchEvent(new W.MouseEvent('click', { bubbles: true, cancelable: true })); }); await pause(900);
const PROPS = ['fontFamily', 'fontWeight', 'fontStyle', 'color', 'backgroundColor', 'borderTopStyle', 'borderTopColor', 'borderTopWidth', 'borderLeftWidth', 'borderLeftStyle', 'borderLeftColor', 'borderRadius', 'letterSpacing', 'textTransform', 'opacity', 'boxShadow', 'animationName', 'animationIterationCount', 'textAlign', 'paddingLeft'];
const mesure = (p, base, sels) => p.evaluate(([base, sels, PROPS]) => { const doc = document; const b = doc.querySelector(base); const H = parseFloat(getComputedStyle(b).fontSize); const out = {}; for (const [nom, sel] of sels) { const [s0, pseudo] = sel.split('::'); const el = s0 === '.' ? b : doc.querySelector(base + ' ' + s0); if (!el) { out[nom] = null; continue; } const cs = pseudo ? getComputedStyle(el, '::' + pseudo) : getComputedStyle(el); const o = {}; for (const k of PROPS) o[k] = cs[k]; if (pseudo) o.content = cs.content; o.fsRatio = (parseFloat(cs.fontSize) / H).toFixed(3); o.padTopPct = (parseFloat(cs.paddingTop) / b.getBoundingClientRect().height * 100).toFixed(2); out[nom] = o; } return out; }, [base, sels, PROPS]);
const SELS1 = [['corps', '.'], ['étiquette', '.act'], ['consigne', '.cons .txt'], ['pictogramme', '.cons .pic'], ['étape', 'ul.etapes li:not(.spot-on):not(.aecrire)'], ['étape › (avant)', 'ul.etapes li:not(.aecrire)::before'], ['étape en lumière', 'ul.etapes li.spot-on'], ['étape à écrire', 'ul.etapes li.aecrire']];
console.log('li du tableau :', await tab.evaluate(() => Array.from(document.querySelectorAll('.e ul.etapes li')).map(l => '[' + l.className + ']').join(' ')));
const r1 = await mesure(tab, '.e', SELS1);
// une question avec une réponse : diapo 8 (Question-bilan) ; une réponse GA reformulée
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.va(7); }); await pause(400); await dev(1);
console.log('écran 8 :', await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; return W.ECRANS.map((e, i) => i + ':' + e.act.slice(0, 14) + '[' + e.blocs.map(b => b.t).join(',') + ']').join(' '); }));
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; const n = W.ECRANS.findIndex(e => e.blocs.some(x => x.t === 'question')); W.va(n); const b = W.ECRANS[n].blocs.find(x => x.t === 'question'); b.reps = [{ i: 'GA', r: 'Une nature immense.', refo: true }, { i: 'CJ', r: 'La solitude.', refo: false }]; b.vues = 2; W.ECRANS[n].rev = W.ECRANS[n].blocs.length + 1; W.rendre(); W.envoie(); }); await pause(700);
const SELS2 = [['question', '.q'], ['réponse (ligne)', '.rep'], ['initiales', '.rep .ini:not(.refo)'], ['initiales reformulée', '.rep .ini.refo'], ['réponse (texte)', '.rep .dit']];
const r2 = await mesure(tab, '.e', SELS2);
// une image : diapo 2 (Tableau 1) ; une fiche : séance 2 n'est pas chargée → déclaré
await page.evaluate(() => { const W = document.getElementById('at-dr-iframe').contentWindow; W.va(2); W.envoie(); }); await pause(300); await dev(2); await pause(600);
console.log('tableau après va(2) :', await tab.evaluate(() => ({ cls: (document.querySelector('.e') || {}).className, texte: (document.body.innerText || '').replace(/\s+/g, ' ').slice(0, 120), img: !!document.querySelector('.e .img'), imgsup: !!document.querySelector('.img-sup') })), '| pilote i :', await page.evaluate(() => document.getElementById('at-dr-iframe').contentWindow.i));
console.log('règles sur la légende :', await tab.evaluate(() => { const el = document.querySelector('.e .img-lg'); const out = []; for (const ss of document.styleSheets) { let rules; try { rules = ss.cssRules; } catch (e) { continue; } for (const r of rules) { if (r.selectorText && el.matches(r.selectorText)) out.push(r.cssText.slice(0, 160)); } } return out; }), '| règles .e :', await tab.evaluate(() => { const el = document.querySelector('.e'); const out = []; for (const ss of document.styleSheets) { for (const r of ss.cssRules) { if (r.selectorText && el.matches(r.selectorText)) out.push(r.cssText.slice(0, 200)); } } return out; }));
console.log('détail légende :', await tab.evaluate(() => { const el = document.querySelector('.e .img-lg'); const out = { inline: el.getAttribute('style'), cls: el.className, fs: getComputedStyle(el).fontSize, parentFs: getComputedStyle(el.parentElement).fontSize, outer: el.outerHTML.slice(0, 120) }; const all = []; for (const ss of document.styleSheets) for (const r of ss.cssRules) { const walk = (rule, pref) => { if (rule.selectorText && /img-lg/.test(rule.selectorText)) all.push(pref + rule.selectorText + ' {' + rule.style.cssText.slice(0, 80) + '}'); if (rule.cssRules) for (const rr of rule.cssRules) walk(rr, pref + (rule.selectorText || '@') + ' > '); }; walk(r, ''); } out.regles = all; return out; }));
console.log('légende plein-img :', await tab.evaluate(() => { let el = document.querySelector('.e .img-lg'); const out = []; while (el && !el.classList.contains('e')) { out.push((el.className || el.tagName) + ':' + getComputedStyle(el).fontSize); el = el.parentElement; } return out.join(' < ') + ' < e:' + getComputedStyle(document.querySelector('.e')).fontSize + ' | html: ' + document.querySelector('.e').innerHTML.slice(0, 300); }));
const SELS3 = [['image (bloc)', '.img'], ['image (cadre)', '.img-sup'], ['légende d\'image', '.img-lg'], ['image absente', '.img-vide']];
const r3 = await mesure(tab, '.e', SELS3);
const res = Object.assign({}, r1, r2, r3); fs.writeFileSync('/home/claude/vis/visuels-tab-existant.json', JSON.stringify(res, null, 1));
console.log('tableau de l\'existant mesuré :', Object.keys(res).filter(k => res[k]).length, '/', Object.keys(res).length, '; absents :', Object.keys(res).filter(k => !res[k]).join(', ') || 'aucun', '; erreurs :', errs.length);
await tab.screenshot({ path: '/home/claude/vis/visuels-tab-existant.png' }); await nav.close();
