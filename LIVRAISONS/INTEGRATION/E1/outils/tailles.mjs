// E1 — les fonctions de mes modules (dr-gabarit, dr-socle, dr-atelier, et ma part de dr-classe), leur taille dans la maquette p8-5g et dans le site (toString().length, comme E4)
// usage : node tailles.mjs [sortie.md] — lit la maquette (bancs/.cache) et assemble/index.html sur le faux hub
import fs from 'fs'; import path from 'path';
import * as E from '../bancs/env.mjs';
const DR = path.join(E.RACINE, 'LIVRAISONS/INTEGRATION/dr');
const noms = new Map();   // nom → module
const lire = (f, debut, fin) => { let t = fs.readFileSync(path.join(DR, f), 'utf8'); if (debut) { const i = t.indexOf(debut); const j = fin ? t.indexOf(fin, i + 1) : -1; t = t.slice(i < 0 ? 0 : i, j < 0 ? undefined : j); } return t; };
const ramasser = (t, m) => { for (const r of [/^function\s+([\w$]+)\s*\(/gm, /^(?:const|let|var)\s+([\w$]+)\s*=\s*(?:\([^)]*\)|[\w$]+)\s*=>/gm]) { let x; while ((x = r.exec(t))) if (!noms.has(x[1])) noms.set(x[1], m); } };
ramasser(lire('dr-gabarit.js'), 'dr-gabarit'); ramasser(lire('dr-socle.js'), 'dr-socle'); ramasser(lire('dr-atelier.js'), 'dr-atelier');
{ const c = lire('dr-classe.js'); const fin = c.indexOf('/* ═══ dr-classe.js — E2'); ramasser(fin > 0 ? c.slice(0, fin) : c, 'dr-classe (part E1)'); }
const cache = path.join(E.ICI, '.cache'); const maq = fs.readdirSync(cache).filter(f => /maquette.*\.html$/.test(f)).map(f => path.join(cache, f))[0];
const b = await E.nav();
const tailles = async (fichier, pre) => { const ctx = await b.newContext(); await ctx.route(u => !String(u).startsWith('file:'), r => r.abort()); const pg = await ctx.newPage(); if (pre) await pg.addInitScript(E.fauxHub, E.store());
  await pg.goto('file://' + fichier + (pre ? '?n=3e' : ''), { waitUntil: 'load' }); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(ns => { const o = {}; ns.forEach(n => { try { const f = (0, eval)(n); if (typeof f === 'function') o[n] = f.toString().length; } catch (e) {} }); return o; }, [...noms.keys()]); await ctx.close(); return r; };
const avant = maq ? await tailles(maq, false) : {}; const apres = await tailles(E.FICHIER, true); await b.close();
const L = [...noms.entries()].sort((a, c) => a[1].localeCompare(c[1]) || a[0].localeCompare(c[0])).map(([n, m]) => { const a = avant[n], p = apres[n]; const quoi = a == null ? 'nouveau (E1)' : a === p ? 'repris tel quel' : 'repris, changé'; return { n, m, a, p, quoi }; });
const compte = q => L.filter(x => x.quoi === q).length;
const md = ['| module | nom | avant (maquette) | après (site) | |', '|---|---|---|---|---|', ...L.map(x => `| ${x.m} | \`${x.n}\` | ${x.a == null ? '—' : x.a} | ${x.p == null ? '(non global)' : x.p} | ${x.quoi} |`)].join('\n');
const tete = `${L.length} fonctions nommées dans mes modules — ${compte('repris tel quel')} reprises telles quelles, ${compte('repris, changé')} reprises et changées, ${compte('nouveau (E1)')} nouvelles. Maquette : ${maq ? path.basename(maq) : 'absente du cache'}.`;
if (process.argv[2]) fs.writeFileSync(process.argv[2], tete + '\n\n' + md + '\n'); console.log(tete);
