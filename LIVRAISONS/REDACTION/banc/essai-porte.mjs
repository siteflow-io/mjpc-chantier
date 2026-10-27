import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs'; import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module';
const pw = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const F = path.resolve('../redaction.html'); const S = '/tmp/claude-0/-home-claude/49074318-5479-574b-8e93-e5acfd8e5fc3/scratchpad/';
const nav = await pw.chromium.launch({ args: ['--no-sandbox'] }); const ctx = await nav.newContext({ viewport: { width: 1707, height: 743 } });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => { console.log('BOÎTE', d.message().slice(0, 300)); d.dismiss(); });
await pg.addInitScript(installer, hubDeDepart()); await pg.addInitScript(sessionProf);
await pg.goto('file://' + F + '?mode=prof'); await pg.waitForTimeout(1000); await pg.screenshot({ path: S + 'liste.png' });
for (const f of ['lettre-grande-guerre.json', 'dugain.json']) {
  await pg.click('text=➕ Nouveau sujet'); await pg.waitForTimeout(200);
  await pg.fill('#ruNvColler', fs.readFileSync('../sujets/' + f, 'utf8')); await pg.click('#modalNouveau button:has-text("Vérifier")'); await pg.waitForTimeout(800);
  console.log(f, '→', (await pg.textContent('#ruNvMsg')).slice(0, 1500), '| créer actif :', await pg.isEnabled('#ruNvCreer'));
  await pg.screenshot({ path: S + 'verif-' + f + '.png' });
  if (await pg.isEnabled('#ruNvCreer')) { await pg.click('#ruNvCreer'); await pg.waitForTimeout(1500); console.log('après créer :', pg.url().split('?')[1]); await pg.screenshot({ path: S + 'prep.png' }); break; }
  await pg.click('#modalNouveau button:has-text("Annuler")');
}
console.log('écritures', await pg.evaluate(() => window.__ECR), 'erreurs', errs); await nav.close();
