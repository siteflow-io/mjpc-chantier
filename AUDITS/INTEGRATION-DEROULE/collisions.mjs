// LES COLLISIONS — entre le code du déroulé (les modules dr/*) et le reste d'index.html : ids, classes CSS, globales.
// usage : node collisions.mjs [LIVRAISONS/INTEGRATION/index.html]   (lit index.html ET les modules dr/* qu'il charge)
// Attendu : 0 collision (contrat §7). Code 1 sinon. Les 8 globales, 14 classes et 15 ids mesurés le 21/10 sur la maquette p8-5g
// contre la production 8.74.0-③ sont dans collisions.json (la référence de départ).
import fs from 'fs'; import path from 'path';
const ici = path.dirname(new URL(import.meta.url).pathname); const racine = path.resolve(ici, '..', '..');
const SRC = path.resolve(process.argv[2] || path.join(racine, 'LIVRAISONS/INTEGRATION/index.html'));
if (!fs.existsSync(SRC)) { console.log('collisions : introuvable', SRC); process.exit(2); }
const html = fs.readFileSync(SRC, 'utf8'); const base = path.dirname(SRC);
const modules = [...html.matchAll(/(?:href|src)="(dr\/[^"]+)"/g)].map(m => m[1]).filter(r => fs.existsSync(path.join(base, r)));
const DR = modules.map(r => fs.readFileSync(path.join(base, r), 'utf8')).join('\n');
const SITE = html;   // tout ce qui n'est pas dans dr/ (les modules ne sont pas inlinés dans la version de chantier)
const ids = t => new Set([...t.matchAll(/id="([A-Za-z][\w-]*)"/g)].map(m => m[1]).concat([...t.matchAll(/getElementById\(['"]([\w-]+)['"]\)/g)].map(m => m[1])));
const classes = t => new Set([...[...t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n').matchAll(/\.([A-Za-z_][\w-]*)/g)].map(m => m[1]));
const classesCss = t => new Set([...t.matchAll(/(?:^|[\s,}])\.([A-Za-z_][\w-]*)/g)].map(m => m[1]));
const globales = t => new Set([...t.matchAll(/^(?:const|let|var|function)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]));
const inter = (a, b) => [...a].filter(x => b.has(x));
const cssDr = modules.filter(r => r.endsWith('.css')).map(r => fs.readFileSync(path.join(base, r), 'utf8')).join('\n');
const cId = inter(ids(DR), ids(SITE)), cCl = inter(classesCss(cssDr), classes(SITE)), cGl = inter(globales(DR), globales(SITE));
const tolerees = new Set(['S', 'J']);   // exposés volontairement par le socle (window.dr les porte aussi)
const cGl2 = cGl.filter(x => !tolerees.has(x));
console.log('modules lus : ' + modules.join(' ') + '\n  ids en collision : ' + cId.length + (cId.length ? ' → ' + cId.join(' ') : '') + '\n  classes CSS en collision : ' + cCl.length + (cCl.length ? ' → ' + cCl.join(' ') : '') + '\n  globales en collision : ' + cGl2.length + (cGl2.length ? ' → ' + cGl2.join(' ') : ''));
process.exit(cId.length + cCl.length + cGl2.length ? 1 : 0);
