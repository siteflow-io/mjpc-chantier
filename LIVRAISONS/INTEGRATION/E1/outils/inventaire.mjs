// inventaire des déclarations de premier niveau des <script> d'un fichier html
import fs from 'fs'; import { createRequire } from 'module';
const req = createRequire(import.meta.url); const acorn = req('/opt/node-tools/node_modules/acorn');
const f = process.argv[2]; const html = fs.readFileSync(f, 'utf8');
const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g; let m; const out = [];
while ((m = re.exec(html))) { const code = m[1]; const off = m.index + m[0].indexOf(code);
  let ast; try { ast = acorn.parse(code, { ecmaVersion: 'latest', sourceType: 'script', allowReturnOutsideFunction: true }); } catch (e) { console.error('parse KO @', off, e.message); continue; }
  for (const n of ast.body) { const ligne = html.slice(0, off + n.start).split('\n').length; const fin = html.slice(0, off + n.end).split('\n').length;
    if (n.type === 'FunctionDeclaration') out.push({ k: 'function', nom: n.id.name, ligne, fin, taille: n.end - n.start, start: off + n.start, end: off + n.end });
    else if (n.type === 'VariableDeclaration') for (const d of n.declarations) { const noms = []; const w = p => { if (!p) return; if (p.type === 'Identifier') noms.push(p.name); else if (p.type === 'ObjectPattern') p.properties.forEach(q => w(q.value || q.argument)); else if (p.type === 'ArrayPattern') p.elements.forEach(w); }; w(d.id); noms.forEach(x => out.push({ k: n.kind, nom: x, ligne, fin, taille: d.end - d.start, start: off + d.start, end: off + d.end, fn: d.init && /Function/.test(d.init.type) })); }
    else out.push({ k: 'stmt:' + n.type, nom: '', ligne, fin, taille: n.end - n.start, start: off + n.start, end: off + n.end }); } }
fs.writeFileSync(process.argv[3], JSON.stringify(out));
console.log(out.length, 'déclarations ;', out.filter(x => x.k === 'function').length, 'fonctions');
