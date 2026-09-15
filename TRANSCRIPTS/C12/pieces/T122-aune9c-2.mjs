import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const F = 'file:///home/claude/C12/maquette-v9c2-courante.html';
const src = fs.readFileSync('/home/claude/C12/maquette-v9c2-courante.html', 'utf8');
const R = []; const note = (k, v) => { R.push([k, v]); console.log(k, '→', typeof v === 'string' ? v.slice(0, 200) : JSON.stringify(v).slice(0, 200)); };
// (b) aucune écriture, aucun réseau
note('b. fetch/XMLHttpRequest/WebSocket dans la maquette', (src.match(/\bfetch\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/g) || []).length);
note('a. vérifications réelles dans le banc des gestes', (fs.readFileSync('/home/claude/vis/test-v9c-gestes.mjs', 'utf8').match(/\bok\(/g) || []).length);
const nav = await chromium.launch({ executablePath: '/opt/google/chrome/chrome', args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message)); 
const p = ms => page.waitForTimeout(ms); const ev = (f, a) => page.evaluate(f, a);
await page.goto(F); await p(400);
// (d) boutons sans infobulle
note('d. boutons visibles sans infobulle', await ev(() => Array.from(document.querySelectorAll('button')).filter(b => b.offsetParent !== null && !b.title && !b.closest('.menu') && !b.closest('#fin') && !b.closest('.rel')).map(b => b.textContent.trim().slice(0, 18))));
// (l) mots de plomberie ou méta à l'écran
const texteEcran = await ev(() => document.body.innerText);
note('l. plomberie/méta à l\'écran (eid, json, hub, maquette, simulation, playwright, iframe, DOM)', (texteEcran.match(/\b(eid|json|hub|maquette|simulation|playwright|iframe|DOM|prototype|mock)\b/gi) || []));
// (c) codes de notions affichés ?
note('c. codes de notions affichés à l\'ouverture', (texteEcran.match(/\b(litt|lex|gram|orth|conj|vers|c4|tr)-[a-z0-9-]+\b/g) || []));
// (f) le récit et le revoilé : dévoiler 3, revoiler 1 → le récit doit citer 2 étapes
await page.click('#bdev'); await page.click('#bdev'); await page.click('#bdev'); await page.click('#bprec'); await p(150);
await page.click('#volet .vig[data-i="1"]'); await p(120); await page.click('#garde-devant'); await p(200); await page.keyboard.press('r'); await p(300);
const recit1 = await ev(() => document.getElementById('rel').innerText);
const nEtapesRecit = (recit1.match(/« Étape|« J'observe|« Je discute|« Au brouillon/g) || []).length; note('f. étapes citées dans le récit après 3 dévoilées puis 1 revoilée (attendu 2)', nEtapesRecit);
await page.keyboard.press('r'); await p(200);
// (g) frappe longue dans une réponse : le curseur reste dans le champ, le texte est entier
await page.click('#volet .vig[data-i="7"]'); await p(120); await page.click('#garde-devant'); await p(300); await page.click('#bdev'); await p(100);
await page.click('#mur .ajout .ini'); await page.keyboard.type('CJ'); await page.keyboard.press('Enter'); await p(100);
const longue = 'Le voyageur est de dos, on ne voit pas son visage, et pourtant on sait ce qu\'il ressent parce que la mer de nuages est immense devant lui et qu\'il est tout petit sur son rocher. '.repeat(3);
await page.keyboard.type(longue, { delay: 2 }); await p(400);
note('g. après une longue frappe : le curseur est dans la réponse', await ev(() => document.activeElement && document.activeElement.classList.contains('txt')));
note('g. le texte de la réponse est entier', (await ev(() => document.activeElement.textContent.length)) === longue.length);
note('g. pages créées, texte non coupé', await ev(() => ({ pages: S.pagesCourantes ? S.pagesCourantes.length : 1, page: S.page, coupe: document.querySelector('#mur .corpsd').scrollHeight > document.querySelector('#mur .corpsd').clientHeight + 2 })));
await page.keyboard.press('Escape');
// (k) apostrophes et guillemets : une note avec « » et une réponse avec l'apostrophe typographique
await page.keyboard.press('n'); await p(100); await page.keyboard.type('L’élève a dit « c’est du sublime » — à retenir.'); await page.keyboard.press('Enter'); await p(100); await page.click('#fnotes [data-v="0"]'); await page.keyboard.press('Escape'); await p(100);
await page.keyboard.press('r'); await p(300); const recit2 = await ev(() => document.getElementById('rel').innerText);
note('k. la note avec « » et l’apostrophe typographique est intacte dans le récit', /L’élève a dit « c’est du sublime » — à retenir/.test(recit2));
await page.keyboard.press('r'); await p(200);
// (e) Échap : ne ferme pas l'écran de fin, n'annule pas une décision ; les fenêtres se ferment une à une
await page.click('#bfin'); await p(500); await page.click('#fin .carte:nth-child(1) [data-c="nonfait"]'); await p(300);
await page.keyboard.press('Escape'); await p(100); note('e. Échap laisse l\'écran de fin ouvert', await ev(() => document.getElementById('ecran-fin').classList.contains('on')));
note('e. la décision « non fait » a survécu à Échap', await ev(() => Object.values(S.decisions).some(d => d.choix === 'nonfait')));
// (h) à 1366×768 : le bandeau de clôture est visible sans défiler, et rien ne le recouvre
note('h. bandeau de clôture visible à 768 px', await ev(() => { const b = document.querySelector('.barre-fin'); const r = b.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width - 60, r.top + r.height / 2); return r.bottom <= innerHeight && !!top && !!top.closest('.barre-fin'); }));
note('h. bouton Clore cliquable (rien par-dessus)', await ev(() => { const b = document.getElementById('f-clore'); const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e === b; }));
await page.click('#f-fermer'); await p(200);
// (i) « seulement les nouvelles » : fait-il quelque chose de vrai ?
note('i. dejaVue() renvoie toujours false (faux vert) ?', await ev(() => { const f = String(typeof dejaVue === 'function' ? dejaVue : ''); return /&& false/.test(f); }));
// (j) le rang comme identité dans ce qui est enregistré
note('j. le journal des diapos porte l\'identité (eid) et pas seulement le rang', await ev(() => J.filter(x => x.type === 'diapo').every(x => !!x.eid)));
note('j. les prises de parole portent l\'identité de la diapo', await ev(() => S.parts.every(x => !!x.eid)));
note('j. les notes au fil de l\'eau portent l\'identité de la diapo', await ev(() => S.notesFil.every(x => !!x.eid)));
// (m) petit écran : 1280×720 — l'écran de fin, le bandeau
await page.setViewportSize({ width: 1280, height: 720 }); await page.click('#bfin'); await p(400);
note('m. 1280×720 : bandeau visible et cartes entières', await ev(() => { const b = document.querySelector('.barre-fin').getBoundingClientRect(); const c = document.querySelector('#fin .carte'); return { bandeau: b.bottom <= innerHeight, carteHaut: Math.round(c.getBoundingClientRect().height), rangeeDefile: document.querySelector('.rangee').scrollWidth > document.querySelector('.rangee').clientWidth }; }));
await page.click('#f-fermer');
note('erreurs JS', errs);
await nav.close();
