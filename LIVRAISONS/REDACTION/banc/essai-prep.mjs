import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs'; import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module';
const pw = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const F = path.resolve('../redaction.html'); const S = '/tmp/claude-0/-home-claude/49074318-5479-574b-8e93-e5acfd8e5fc3/scratchpad/';
const nav = await pw.chromium.launch({ args: ['--no-sandbox'] }); const ctx = await nav.newContext({ viewport: { width: 1707, height: 743 } });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => { console.log('BOÎTE', d.message().slice(0, 400)); d.accept(); });
await pg.addInitScript(installer, hubDeDepart()); await pg.addInitScript(sessionProf);
await pg.goto('file://' + F + '?mode=prof&id=dugain&vue=preparer'); await pg.waitForTimeout(1200);
await pg.click('#ruPrepValider'); await pg.waitForTimeout(400);
console.log('après communes :', await pg.textContent('#ruPrepCompteur'), await pg.evaluate(() => RU.prep.k));
await pg.screenshot({ path: S + 'prep-point.png' });
// corriger une case
const t = pg.locator('.ru-case').nth(1); await t.fill('TEXTE CORRIGÉ PAR PAUL {CIT}?'); await pg.mouse.click(900, 200); await pg.waitForTimeout(600);
console.log('ecr', await pg.evaluate(() => window.__ECR.slice(-4)));
await pg.click('#ruPrepValider'); await pg.waitForTimeout(400); console.log(await pg.textContent('#ruPrepCompteur'));
// une réponse cassée
const o = JSON.parse(fs.readFileSync('../sujets/dugain.json', 'utf8')); o.id = 'essai'; o.published = true; const ind = o.variantes[0].criteres[0].indicateurs[0]; ind.competences = ['c4-inconnu']; ind.descripteurs[1] = 'sans prénom'; ind.sous[2].pop(); o.variantes[0].criteres[0].indicateurs[1].poids = 9; delete o.variantes[1].criteres[2].indicateurs[0].descripteurs[3]; o.variantes[1].criteres[2].indicateurs[0].descripteurs.length = 3;
await pg.goto('file://' + F + '?mode=prof'); await pg.waitForTimeout(800);
await pg.click('text=➕ Nouveau sujet'); await pg.fill('#ruNvColler', JSON.stringify(o)); await pg.click('#modalNouveau button:has-text("Vérifier")'); await pg.waitForTimeout(600);
console.log((await pg.innerText('#ruNvMsg')));
await pg.fill('#ruNvColler', '{ "id": "x", '); await pg.click('#modalNouveau button:has-text("Vérifier")'); await pg.waitForTimeout(300); console.log(await pg.innerText('#ruNvMsg'));
console.log('erreurs', errs); await nav.close();
