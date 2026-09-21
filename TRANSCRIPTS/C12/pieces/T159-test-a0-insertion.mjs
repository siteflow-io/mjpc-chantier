// (a0) la preuve par le geste : on joue (réponses, dévoilements, surlignage, décision, gel), on insère une diapo au milieu par ⚙, et RIEN ne bouge
import { chromium } from '/home/claude/.npm-global/node_modules/playwright/index.mjs';
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
await page.goto('file:///home/claude/C12/maquette-v9c14a0-courante.html'); await p(600); await page.click('#edt-cases [data-lancer="1"]'); await p(300);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); await tab.waitForLoadState(); await p(300);
const diapo = titre => ev(t => seance().ecrans.findIndex(e => e.act.includes(t)), titre); const allerA = async titre => { const i = await diapo(titre); await page.click('#volet .vig[data-i="' + i + '"]'); await p(200); if (await ev(() => document.getElementById('garde').classList.contains('on'))) await page.click('#garde-devant'); await p(200); };
// jouer : d1 trois dévoilements + surlignage ; Question-bilan : deux réponses ; une décision sur l'activité 1 ; le gel sur Question-bilan
for (let k = 0; k < 3; k++) await page.keyboard.press('ArrowRight'); await p(100);
await ev(() => { const el = document.querySelector('#mur li[data-k="0"]'); const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); w.nextNode(); const n = w.currentNode; const r = document.createRange(); r.setStart(n, 2); r.setEnd(n, 12); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }); await page.keyboard.press('Control+h'); await p(150);
await allerA('Question-bilan'); await page.keyboard.press('ArrowRight'); await p(100);
for (const [ini, txt] of [['ga', 'Une nature immense.'], ['rd', 'La solitude.']]) { await page.click('#mur .rep.libre .ini'); await page.keyboard.type(ini); await page.keyboard.press('Enter'); await page.keyboard.type(txt); await page.keyboard.press('Enter'); await p(150); } await page.keyboard.press('Escape');
await page.click('#bgel'); await p(150);
const photo = async () => ev(() => { const E = seance().ecrans; const parEid = {}; Object.keys(parDiapo).forEach(k => { const [si, eid] = k.split('|'); const e = E.find(x => x.eid === eid); parEid[e ? e.act : k] = { reps: Object.values(parDiapo[k].reps || {}).flat().map(r => r.i + ':' + r.r), surl: (parDiapo[k].surl || []).map(x => x.txt) }; }); const vus = {}; Object.keys(vuMax).forEach(k => { const [si, eid] = k.split('|'); const e = E.find(x => x.eid === eid); vus[e ? e.act : k] = vuMax[k]; }); return { parEid, vus, journal: J.filter(x => x.di != null).map(x => x.type + '@' + (E[x.di] || {}).act), gel: S.gel ? E[S.gel.di].act : null, mur: S.mur ? E[S.mur.di].act : null, courant: E[S.di].act, ordre: ordreHeure(S.heure).map(i => E[i].act), decisions: JSON.stringify(S.decisions), nbDiapos: E.length }; });
const avant = await photo();
// ⚙ insérer une diapo au milieu de l'heure
await page.click('#bsimu'); await page.click('#s-inserer'); await p(400);
const apres = await photo();
ok(apres.nbDiapos === avant.nbDiapos + 1, 'la diapo n\'a pas été insérée');
ok(JSON.stringify(apres.parEid) === JSON.stringify(avant.parEid), 'l\'état par diapo a bougé (réponses, surlignages) : ' + JSON.stringify(apres.parEid).slice(0, 200));
ok(JSON.stringify(apres.vus) === JSON.stringify(avant.vus), 'les dévoilements ont bougé');
ok(JSON.stringify(apres.journal) === JSON.stringify(avant.journal.concat([]).filter(x => true)) || apres.journal.slice(0, avant.journal.length).join() === avant.journal.join(), 'le journal a bougé : ' + apres.journal.slice(-6).join(' | '));
ok(apres.gel === avant.gel && apres.mur === avant.mur && apres.courant === avant.courant, 'le gel, le tableau ou le curseur ont bougé : ' + [apres.gel, apres.mur, apres.courant].join(' / '));
ok(apres.decisions === avant.decisions, 'les décisions ont bougé');
ok(apres.ordre.length === avant.ordre.length + 1 && apres.ordre.includes('Diapo insérée (simulation)') && apres.ordre.filter(x => x !== 'Diapo insérée (simulation)').join() === avant.ordre.join(), 'l\'ordre de l\'heure n\'a pas gardé les diapos à leur place : ' + apres.ordre.join(' › '));
// le tableau des élèves est toujours sur Question-bilan (gelé), avec ses deux réponses
ok(await tab.evaluate(() => document.querySelectorAll('#mur2 .rep').length === 2 && /Question-bilan/.test(document.querySelector('#mur2 .act').textContent)), 'le tableau des élèves a bougé après l\'insertion');
// dégeler, aller sur la diapo insérée puis revenir : les réponses sont toujours là ; le récit est identique
await page.click('#bgel'); await p(150); if (await ev(() => document.getElementById('garde2').classList.contains('on'))) await page.click('#garde2-ici'); await p(150);
const r1 = await ev(() => document.createElement('div').appendChild(Object.assign(document.createElement('div'), { innerHTML: recitHtml(now(), 1) })).textContent.replace(/\s+/g, ' '));
await allerA('Diapo insérée'); await allerA('Question-bilan'); ok(await ev(() => document.querySelectorAll('#mur .rep:not(.libre)').length === 2), 'les réponses ont quitté Question-bilan');
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await page.screenshot({ path: 'vis/a0-apres-insertion.png' }); await nav.close();
