// MANDAT J (nuit du 04/11, C16 742) — les captures avant / après de la promotion 8.86.0-⑲. Aucune ligne du site ne change.
// Les harnais des sondes de la nuit, repris tels quels : une copie provisoire de chaque sonde, posée à côté d'elle (le temps du passage, puis effacée),
// où l'on change seulement la taille de l'écran (1920 × 1080, deviceScaleFactor 2) et où l'on ajoute les prises de vue J1-J7 aux bons gestes.
// usage : node j-captures.mjs <avant/index.html> <après/index.html> <dossier brut> — puis python3 -I j-assembler.py <dossier brut> <dossier des images>
import fs from 'fs'; import path from 'path'; import { spawnSync, execSync } from 'child_process';
const ici = path.dirname(new URL(import.meta.url).pathname); const D = path.resolve(ici, '..', '..');   /* LIVRAISONS/DEROULE-01-11 */
const [AV, AP, BRUT] = process.argv.slice(2).map(x => path.resolve(x)); fs.mkdirSync(BRUT, { recursive: true });
const ECRAN = ['viewport: { width: W, height: H }', 'viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2'];
const BAS = "await pg2.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(x => /analyse IA/i.test(x.innerText || '')); if (b) { b.scrollIntoView({ block: 'center' }); return; } let el = document.getElementById('rel'); while (el) { el.scrollTop = el.scrollHeight; el = el.parentElement; } window.scrollTo(0, document.body.scrollHeight); }); await p(500);";
const SONDES = [
  { nom: 'ci', f: 'CASE-INITIALES/sonde-case-initiales.mjs', env: { MJPC_PARTIES: 'L' }, r: [ECRAN,
    [', [LISTE[25], LISTE[26]]);', ', [LISTE[25], LISTE[26]]).catch(() => [{}, {}]);'],
    ["n => n ? dr_prenomTableau(n) : ''", "n => n && typeof dr_prenomTableau === 'function' ? dr_prenomTableau(n) : ''"],
    ['dr_caseSeul(INI[n]) === n', "(typeof dr_caseSeul === 'function' ? dr_caseSeul(INI[n]) === n : true)"],
    ["e = await tape('m');", "e = await tape('m'); await capt(pg, 'J1');"],
    ['  /* E · filtre et initiales inconnues */', "  await capt(T.pg, 'J3'); /* E · filtre et initiales inconnues */"],
    ["verif('Q1', ", "await capt(pg, 'J2'); verif('Q1', "]] },
  { nom: 'rd', f: 'RELECTURE-D/sonde-relecture-d.mjs', env: { MJPC_PARTIES: 'B,D' }, r: [ECRAN,
    ["    dire('  [B' + (k + 1) + '] ' + c.quoi + ' · bouton '", "    if (k === 0) await capt(pg2, 'J4a');\n    dire('  [B' + (k + 1) + '] ' + c.quoi + ' · bouton '"],
    ["const liste = await pg2.evaluate(() => { const Lc = document.getElementById('dr-case-liste');", "if (k === 0) await capt(pg2, 'J4'); const liste = await pg2.evaluate(() => { const Lc = document.getElementById('dr-case-liste');"],
    ['  const E0 = await etatB(pg2, CAS);', "  await capt(pg2, 'J4base'); const E0 = await etatB(pg2, CAS);"],
    ["  await pg2.keyboard.press('Escape'); await p(500); const g1f", "  await capt(pg2, 'J5'); await pg2.keyboard.press('Escape'); await p(500); const g1f"],
    ['  const nonT = c3.lignes.filter', "  await capt(pg2, 'J6a'); " + BAS + " await capt(pg2, 'J6b');\n  const nonT = c3.lignes.filter"]] },
  { nom: 'rl', f: 'RESEAU-LENT/sonde-f.mjs', env: { MJPC_PARTIES: 'Q4', MJPC_Q4: 'un-clic' }, r: [ECRAN] }];
const seule = process.env.J_SONDES ? process.env.J_SONDES.split(',') : null;
for (const s of SONDES) { if (seule && !seule.includes(s.nom)) continue;
  const src = path.join(D, s.f); let t = fs.readFileSync(src, 'utf8');
  for (const [a, b] of s.r) { const n = t.split(a).length - 1; if (n < 1) { console.log('introuvable dans ' + s.f + ' : ' + a.slice(0, 60)); process.exit(1); } t = t.split(a).join(b); }
  const tmp = path.join(path.dirname(src), '.j-provisoire.mjs'); fs.writeFileSync(tmp, t);
  try { for (const [qui, fich] of [['avant', AV], ['apres', AP]].filter(([q]) => !process.env.J_QUI || process.env.J_QUI === q)) {
    let nb = 1; for (let k = 0; k < 30 && nb; k++) { nb = +execSync("ps -eo comm | grep -cE '^(chrom|headless)' || true").toString().trim(); if (nb) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000); }   /* le navigateur du passage d'avant a le temps de se fermer */
    if (nb) { console.log('un navigateur tourne déjà : arrêt'); process.exit(1); }
    const capt = path.join(BRUT, qui + '-' + s.nom); const t0 = Date.now();
    const r = spawnSync('node', [tmp, fich, path.join(BRUT, 'sorties-' + qui + '-' + s.nom)], { env: Object.assign({}, process.env, s.env, { MJPC_CAPT: capt }), encoding: 'utf8', timeout: 420000 });
    const lignes = String(r.stdout || '').split('\n'); console.log(s.nom + ' ' + qui + ' · ' + Math.round((Date.now() - t0) / 1000) + ' s · ' + (lignes.filter(l => /--- fin/.test(l))[0] || 'sans fin ' + String(r.stderr || '').slice(0, 200)) + ' · images ' + (fs.existsSync(capt) ? fs.readdirSync(capt).filter(x => /^J|^Q4/.test(x)).join(' ') : '—'));
  } } finally { fs.rmSync(tmp, { force: true }); } }
