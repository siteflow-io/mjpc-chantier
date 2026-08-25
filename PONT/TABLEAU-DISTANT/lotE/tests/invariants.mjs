/* LES INTOUCHÉS — prouvés à l'octet, base contre candidat. */
import fs from 'fs'; import crypto from 'crypto';
/* [correctif 25/08] LES TAILLES SE COMPTENT EN OCTETS. Cet outil affichait
   `String.length`, c'est-à-dire des unités UTF-16 : chaque caractère accentué en
   valait UNE au lieu de DEUX. Le sceau du LOT E annonçait ainsi 1 481 565 o pour un
   fichier de 1 502 894 o — 21 329 o d'écart, tous les accents du fichier. */
const OCTETS_A = fs.statSync(process.argv[2]).size, OCTETS_B = fs.statSync(process.argv[3]).size;
const A = fs.readFileSync(process.argv[2],'utf8'), B = fs.readFileSync(process.argv[3],'utf8');
const md5 = s => crypto.createHash('md5').update(s).digest('hex');
const b64 = s => (s.match(/var AT_DR_B64="([^"]+)"/)||[])[1] || '';
const sha = s => (s.match(/var AT_DR_SHA256="([^"]+)"/)||[])[1] || '';
console.log('moteur AT_DR_B64  :', b64(A)===b64(B) ? 'IDENTIQUE à l\'octet ('+b64(A).length+' signes, md5 '+md5(b64(A)).slice(0,12)+'…)' : '⚠ DIVERGENT');
console.log('AT_DR_SHA256      :', sha(A)===sha(B) ? 'identique ('+sha(A).slice(0,16)+'…)' : '⚠ DIVERGENT');
/* les 29 secu* : corps comparés */
const corps = (s,nom) => { const i = s.indexOf('function '+nom+'('); if(i<0) return null;
  let p=s.indexOf('{',i), n=0, k=p;
  for(; k<s.length; k++){ if(s[k]==='{')n++; else if(s[k]==='}'){n--; if(!n)break;} }
  return s.slice(i,k+1); };
const noms = [...new Set([...A.matchAll(/function (secu[A-Za-z0-9_]*)\(/g)].map(m=>m[1]))];
let div = noms.filter(n => corps(A,n) !== corps(B,n));
console.log('fonctions secu*   :', noms.length, '·', div.length ? '⚠ DIVERGENTES : '+div.join(', ') : 'toutes identiques');
const pub = s => (s.match(/published/g)||[]).length;
console.log('published         :', pub(A), '→', pub(B), pub(A)===pub(B)?'(inchangé)':'⚠');
/* fonctions supprimées ou renommées */
const fns = s => new Set([...s.matchAll(/function ([A-Za-z0-9_$]+)\(/g)].map(m=>m[1]));
const fa = fns(A), fb = fns(B);
const perdues = [...fa].filter(x=>!fb.has(x)), neuves = [...fb].filter(x=>!fa.has(x));
console.log('fonctions perdues :', perdues.length ? '⚠ '+perdues.join(', ') : '0');
console.log('fonctions neuves  :', neuves.length ? neuves.join(', ') : '0');
/* le diff, ligne à ligne */
const la = A.split('\n'), lb = B.split('\n');
let zones = 0, k = 0;
for(let i=0, j=0; i<la.length || j<lb.length; ){
  if(la[i] === lb[j]){ i++; j++; continue; }
  zones++;
  /* on resynchronise sur la première ligne commune suivante */
  let trouve = false;
  for(let d=1; d<600 && !trouve; d++){
    if(lb[j+d] === la[i]){ j += d; trouve = true; }
    else if(la[i+d] === lb[j]){ i += d; trouve = true; }
  }
  if(!trouve){ i++; j++; }
  if(++k > 50) break;
}
console.log('zones de diff     :', zones);
console.log('taille (OCTETS)   :', OCTETS_A, '→', OCTETS_B, '(+'+(OCTETS_B-OCTETS_A)+' o)');
console.log('  (unités UTF-16) :', A.length, '→', B.length, '— à ne PAS confondre avec des octets)');
console.log('md5 candidat      :', crypto.createHash('md5').update(fs.readFileSync(process.argv[3])).digest('hex'));
