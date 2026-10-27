import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs';
import { hubDeDepart } from './fauxhub.mjs'; import { COPIES, corriger, pageProd, pageRU } from './nonreg.mjs';
const pw = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const PROD = '/home/claude/monsieurjaipascompris/redaction_dugain_v3.html', RUF = path.resolve('../redaction.html');
const nav = await pw.chromium.launch({ args: ['--no-sandbox'] }); const ctx = await nav.newContext({ viewport: { width: 1707, height: 743 } });
await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
const hub = hubDeDepart(); const noms = hub.classes['3_franklin_aretha'].eleves;
const a = await pageProd(ctx, PROD, noms), b = await pageRU(ctx, RUF, hub);
const S = '/tmp/claude-0/-home-claude/49074318-5479-574b-8e93-e5acfd8e5fc3/scratchpad/';
for (const cp of COPIES) {
  const fa = await corriger(a.pg, cp, await a.pg.evaluate(n => eleveId(n), cp.eleve));
  const fb = await corriger(b.pg, cp, await b.pg.evaluate(n => eleveId(n), cp.eleve));
  const fa2 = fa.split('3e De Gaulle').join('3 FRANKLIN Aretha');
  fs.writeFileSync(S + 'f-prod-' + cp.eleve.split(' ')[0] + '.html', fa2); fs.writeFileSync(S + 'f-ru-' + cp.eleve.split(' ')[0] + '.html', fb);
  console.log(cp.eleve, fa2 === fb ? 'IDENTIQUE' : 'DIFFÉRENT', fa.length, fb.length);
}
console.log('erreurs', a.errs, b.errs); await nav.close();
