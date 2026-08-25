/* DOUBLE PARSEUR — on extrait les scripts du HTML puis on les passe à node --check
   et à acorn ES2020. Le moteur base64 n'est pas du script de page : il est vérifié
   par son empreinte, pas par le parseur. */
import fs from 'fs'; import { execSync } from 'child_process'; import * as acorn from 'acorn';
const f = process.argv[2];
const html = fs.readFileSync(f,'utf8');
const bouts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
console.log('blocs <script> :', bouts.length, '· signes :', bouts.reduce((n,b)=>n+b.length,0));
let ko = 0;
bouts.forEach((b,k)=>{
  const tmp = '/tmp/bout'+k+'.js';
  fs.writeFileSync(tmp, b);
  try{ execSync('node --check '+tmp, {stdio:'pipe'}); }
  catch(e){ ko++; console.log('  node --check KO bloc '+k+' :', String(e.stderr).slice(0,200)); }
  try{ acorn.parse(b, {ecmaVersion:2020}); }
  catch(e){ ko++; console.log('  acorn KO bloc '+k+' :', e.message.slice(0,200)); }
});
console.log(ko===0 ? 'DOUBLE PARSEUR : VERT' : 'DOUBLE PARSEUR : '+ko+' ÉCHECS');
