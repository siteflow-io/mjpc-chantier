// E1 (§12.28-5, dette 13 · 43) — les mots du « ? » de chaque écran : MANDATS/CINQ-DETTES/AIDE-PAR-ECRAN.md → le bloc AIDE_ECRANS d'index.html,
// MOT POUR MOT (le gras, les guillemets, la ponctuation) : seule la forme change (**x** → <b>x</b>, « 1. » → <li>). Rejouable à chaque version du fichier.
// usage : node aide-ecrans.mjs [index.html]   (depuis n'importe où ; écrit entre /* AIDE-ECRANS:debut */ et /* AIDE-ECRANS:fin */)
import fs from 'fs'; import path from 'path'; import { createHash } from 'crypto';
const ICI = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ICI, '../../../..');
const MD = path.join(RACINE, 'MANDATS/CINQ-DETTES/AIDE-PAR-ECRAN.md'); const IDX = path.resolve(process.argv[2] || path.join(RACINE, 'LIVRAISONS/INTEGRATION/index.html'));
const src = fs.readFileSync(MD, 'utf8');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ligne = s => esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const blocs = {}; let fil = null;
const parts = src.split(/^### /m).slice(1);
for (const p of parts) {
  const L = p.replace(/\n---[\s\S]*$/, '').replace(/\nMEMO[\s\S]*$/, '').split('\n'); const tete = L.shift();
  const m = /^(\S+) — (.*?)(?: \((fil-\d)\))?\s*$/.exec(tete); if (!m) throw new Error('tête illisible : ' + tete);
  const corps = L.map(x => x.replace(/\s+$/, '')).filter(x => x.trim());
  let html = '', ol = false;
  for (const x of corps) { const n = /^(\d+)\. (.*)$/.exec(x);
    if (n) { if (!ol) { html += '<ol>'; ol = true; } html += '<li>' + ligne(n[2]) + '</li>'; }
    else { if (ol) { html += '</ol>'; ol = false; } html += '<p>' + ligne(x) + '</p>'; } }
  if (ol) html += '</ol>';
  if (m[1] === 'fil') fil = { titre: m[2], items: corps.map(x => ligne(x.replace(/^\d+\. /, ''))) };
  else blocs[m[1]] = { titre: m[2], fil: m[3] ? +m[3].slice(4) : 0, html };
}
const md5 = createHash('md5').update(src).digest('hex');
const js = '/* AIDE-ECRANS:debut */\n/* E1 (§12.28-5) : produit par E1/outils/aide-ecrans.mjs depuis MANDATS/CINQ-DETTES/AIDE-PAR-ECRAN.md (md5 ' + md5 + ') — mot pour mot ; ne pas éditer à la main */\nvar AIDE_ECRANS=' + JSON.stringify(blocs) + ';\nvar AIDE_FIL=' + JSON.stringify(fil) + ';\n/* AIDE-ECRANS:fin */';
let idx = fs.readFileSync(IDX, 'utf8'); const re = /\/\* AIDE-ECRANS:debut \*\/[\s\S]*?\/\* AIDE-ECRANS:fin \*\//;
if (!re.test(idx)) throw new Error('marques AIDE-ECRANS absentes de ' + IDX);
idx = idx.replace(re, () => js); fs.writeFileSync(IDX, idx);
console.log('aide-ecrans : ' + Object.keys(blocs).length + ' écrans + le fil (' + (fil ? fil.items.length : 0) + ' étapes) · md5 du fichier ' + md5);
