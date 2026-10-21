// L'ASSEMBLEUR — un seul fichier à partir d'`index.html` et de ses modules `dr/*`.
// usage : node assembler.mjs [LIVRAISONS/INTEGRATION/index.html] [LIVRAISONS/INTEGRATION/assemble/index.html]
// Chaque <link rel="stylesheet" href="dr/X.css"> devient <style>…</style>, chaque <script src="dr/X.js"></script> devient <script>…</script>,
// dans l'ordre où index.html les charge. Rien d'autre n'est touché. Un module qui contient « </script> » en clair fait échouer l'assemblage
// (il casserait la page) : on l'écrit « <\/script> » dans le module. Sortie : les tailles, le md5 de l'assemblé, code 1 si un module manque.
import fs from 'fs'; import path from 'path'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname);
const racine = path.resolve(ici, '..', '..');
const SRC = path.resolve(process.argv[2] || path.join(racine, 'LIVRAISONS/INTEGRATION/index.html'));
const DST = path.resolve(process.argv[3] || path.join(path.dirname(SRC), 'assemble', 'index.html'));
if (!fs.existsSync(SRC)) { console.log('assembler : introuvable', SRC); process.exit(2); }
let html = fs.readFileSync(SRC, 'utf8'); const base = path.dirname(SRC); let n = 0, ko = 0; const journal = [];
const lire = rel => { const p = path.join(base, rel); if (!fs.existsSync(p)) { ko++; journal.push('  MANQUE  ' + rel); return null; } const t = fs.readFileSync(p, 'utf8'); if (/<\/script/i.test(t)) { ko++; journal.push('  REFUSÉ  ' + rel + ' contient « </script> » en clair'); return null; } journal.push('  inline  ' + rel + ' (' + t.length + ' o)'); n++; return t; };
html = html.replace(/<link\s+rel="stylesheet"\s+href="(dr\/[^"]+\.css)"\s*\/?>/g, (m, rel) => { const t = lire(rel); return t === null ? m : '<style>\n/* ═══ ' + rel + ' ═══ */\n' + t + '\n</style>'; });
html = html.replace(/<script\s+src="(dr\/[^"]+\.js)"\s*><\/script>/g, (m, rel) => { const t = lire(rel); return t === null ? m : '<script>\n/* ═══ ' + rel + ' ═══ */\n' + t + '\n</script>'; });
fs.mkdirSync(path.dirname(DST), { recursive: true }); fs.writeFileSync(DST, html);
const md5 = createHash('md5').update(fs.readFileSync(DST)).digest('hex');
console.log('assemblé : ' + DST + '\n' + journal.join('\n') + '\n  modules : ' + n + ' · manquants/refusés : ' + ko + ' · taille : ' + html.length + ' o · md5 ' + md5);
process.exit(ko ? 1 : 0);
