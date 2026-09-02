/* cherche les identifiants ASSIGNÉS sans jamais être déclarés — les fuites globales
   que le mode non strict laisse passer. Parcours de l'AST, sans dépendance. */
import * as acorn from 'acorn';
import fs from 'fs';
const src = fs.readFileSync(process.argv[2] || 'bloc1.js', 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 2020, locations: true });
const declares = new Set(), assignes = new Map(), lus = new Set();
const visite = (n, p) => {
  if (!n || typeof n.type !== 'string') return;
  if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier') declares.add(n.id.name);
  if (n.type === 'FunctionDeclaration' && n.id) declares.add(n.id.name);
  if ((n.type === 'FunctionDeclaration' || n.type === 'FunctionExpression' || n.type === 'ArrowFunctionExpression'))
    (n.params || []).forEach(q => { if (q.type === 'Identifier') declares.add(q.name); });
  if (n.type === 'AssignmentExpression' && n.left.type === 'Identifier')
    assignes.set(n.left.name, n.left.loc.start.line);
  if (n.type === 'Identifier' && p && !(p.type === 'AssignmentExpression' && p.left === n)) lus.add(n.name);
  for (const k of Object.keys(n)) {
    const v = n[k];
    if (Array.isArray(v)) v.forEach(x => visite(x, n));
    else if (v && typeof v.type === 'string') visite(v, n);
  }
};
visite(ast, null);
const fuites = [...assignes.entries()].filter(([nom]) => !declares.has(nom));
console.log('identifiants assignés sans déclaration : ' + fuites.length);
fuites.forEach(([n, l]) => console.log('   ' + n + ' — ligne ' + l + ' du bloc script'));
