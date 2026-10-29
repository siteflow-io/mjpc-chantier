// Banc de la page « Test des repères » : par le geste (charger un fichier, cliquer sur le scan), contre la vérité de terrain.
import { createRequire } from 'node:module'; import fs from 'node:fs';
const req = createRequire(import.meta.url);
let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const D = process.argv[2], V = JSON.parse(fs.readFileSync(D + '/verite.json', 'utf8'));
const PDFJS = D + '/node_modules/pdfjs-dist/build/';
const ap = (H, x, y) => { const w = H[2][0] * x + H[2][1] * y + H[2][2]; return [(H[0][0] * x + H[0][1] * y + H[0][2]) / w, (H[1][0] * x + H[1][1] * y + H[1][2]) / w]; };
let ok = 0, ko = 0; const dire = (b, m) => { b ? ok++ : ko++; console.log((b ? 'ok    ' : 'ÉCHEC ') + m); };
const b = await pw.chromium.launch(); const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
const erreurs = []; pg.on('pageerror', e => erreurs.push(String(e)));
await pg.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await pg.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/pdf\.js\/3\.11\.174\/(.+)$/, r => { const f = r.request().url().split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
await pg.goto('file://' + D + '/local.html');
// 1. le scan en PDF (le chemin du photocopieur)
await pg.setInputFiles('#fScan', D + '/scan.pdf');
await pg.waitForFunction(() => window.__reperes.scan, null, { timeout: 30000 });
let s = await pg.evaluate(() => window.__reperes.scan);
dire(s.ok, `scan PDF : quatre repères trouvés (${s.ms} ms)`);
const cs = s.croix.filter(x => x != null);
dire(cs.length === 10 && Math.max(...cs) < 0.6, `scan PDF : 10 croix mesurées, au plus ${Math.max(...cs)} mm (attendu < 0,6)`);
// 2. le scan en image, jugé contre la vérité de terrain
await pg.evaluate(() => { window.__reperes.scan = null; });
await pg.setInputFiles('#fScan', D + '/scan.jpg');
await pg.waitForFunction(() => window.__reperes.scan);
s = await pg.evaluate(() => window.__reperes.scan);
const essais = [[60, 52], [120, 84], [170, 116], [45, 150], [165, 250]];
let pire = 0;
for (const [X, Y] of essais) { const t = ap(V.scan.H, X, Y).map(v => v * s.k), m = ap(s.H, X, Y); pire = Math.max(pire, Math.hypot(t[0] - m[0], t[1] - m[1]) / (s.k * 200 / 25.4)); }
dire(s.ok && pire < 0.5, `scan image : la page place chaque point à ${pire.toFixed(2)} mm au plus de sa vraie place (attendu < 0,5)`);
// 3. trois cercles, posés par trois clics sur trois mots
const mots = [[62, 52], [118, 84], [168, 116]];
for (const [X, Y] of mots) {
  const p = ap(s.H, X, Y), box = await pg.locator('#cScan').boundingBox();
  await pg.locator('#cScan').click({ position: { x: p[0] / s.w * box.width, y: p[1] / s.h * box.height } });
}
const c = await pg.evaluate(() => window.__reperes.cercles());
const ecart = Math.max(...c.map((q, i) => Math.hypot(q[0] - mots[i][0], q[1] - mots[i][1])));
dire(c.length === 3 && ecart < 0.5, `trois clics, trois cercles, chacun à ${ecart.toFixed(2)} mm au plus du mot visé`);
const code = await pg.inputValue('#iCodeScan');
dire(/^R:[\d.]+,[\d.]+;[\d.]+,[\d.]+;[\d.]+,[\d.]+$/.test(code) && await pg.isVisible('#zCodeScan'), `sans le site (hors claude.ai), le code des cercles s'affiche : ${code}`);
await pg.screenshot({ path: D + '/banc-1-scan.png', fullPage: true });
// 4. la photo à plat : les cercles retombent-ils sur les mêmes mots ?
await pg.setInputFiles('#fPhoto', D + '/photo.jpg');
await pg.waitForFunction(() => window.__reperes.photo);
let p = await pg.evaluate(() => window.__reperes.photo);
dire(p.ok, `photo à plat : quatre repères trouvés (${p.ms} ms)`);
let pc = 0; c.forEach(([X, Y], i) => { const t = ap(V.photo.H, X, Y).map(v => v * p.k), m = p.cercles[i], e = ap(V.photo.H, X + 1, Y).map(v => v * p.k), mmpx = Math.hypot(e[0] - t[0], e[1] - t[1]); pc = Math.max(pc, Math.hypot(t[0] - m[0], t[1] - m[1]) / mmpx); });
dire(pc < 1, `photo à plat : chaque cercle tombe à ${pc.toFixed(2)} mm au plus de son mot (attendu < 1)`);
const cp = p.croix.filter(x => x != null);
dire(cp.length >= 9 && Math.max(...cp) < 1, `photo à plat : ${cp.length} croix mesurées, au plus ${Math.max(...cp)} mm`);
const verdict = await pg.textContent('#verdict');
dire(/ça va/.test(verdict), `photo à plat : le verdict dit « ${verdict.trim()} »`);
await pg.screenshot({ path: D + '/banc-2-photo.png', fullPage: true });
// 5. la photo de la feuille pliée : la page voit-elle le décalage ?
await pg.evaluate(() => { window.__reperes.photo = null; });
await pg.setInputFiles('#fPhoto', D + '/photo-pliee.jpg');
await pg.waitForFunction(() => window.__reperes.photo);
p = await pg.evaluate(() => window.__reperes.photo);
const cb = p.croix.filter(x => x != null), mx = Math.max(...cb);
dire(p.ok && Math.abs(mx - V.bosse_mm) < 0.6, `feuille pliée de ${V.bosse_mm} mm : la page mesure ${mx} mm au plus (attendu ${V.bosse_mm} à 0,6 près)`);
await pg.screenshot({ path: D + '/banc-3-pliee.png', fullPage: true });
// 6. une photo sans repères (l'an dernier) : la page le dit, sans casser
if (fs.existsSync(D + '/../scan-prive/page-q85.jpg')) {
  await pg.evaluate(() => { window.__reperes.photo = null; });
  await pg.setInputFiles('#fPhoto', D + '/../scan-prive/page-q85.jpg');
  await pg.waitForFunction(() => window.__reperes.photo);
  p = await pg.evaluate(() => window.__reperes.photo);
  const t = await pg.textContent('#ePhoto');
  dire(!p.ok && /quatre repères/.test(t) && await pg.isHidden('#verdict'), `copie de l'an dernier, sans repères : « ${t.trim().slice(0, 60)}… »`);
}
// 7. la reconnaissance du cadre, assez rapide pour un viseur vivant ?
const t7 = [];
for (let i = 0; i < 5; i++) { await pg.evaluate(() => { window.__reperes.photo = null; }); await pg.setInputFiles('#fPhoto', D + '/video.jpg'); await pg.waitForFunction(() => window.__reperes.photo); const r = await pg.evaluate(() => window.__reperes.photo); t7.push(r.ok ? r.ms : -1); }
const ms = t7.includes(-1) ? -1 : t7.sort((a, b) => a - b)[2];
dire(ms > 0 && ms < 250, `une image vidéo 1280 × 720 : cadre reconnu en ${ms} ms (médiane de 5 ; attendu < 250, soit 4 images par seconde au moins)`);
// 8. le téléphone : la page tient à 390 de large, sans défilement de côté
await pg.setViewportSize({ width: 390, height: 844 });
const large = await pg.evaluate(() => document.documentElement.scrollWidth);
dire(large <= 390, `au téléphone (390) : largeur de la page ${large}`);
await pg.screenshot({ path: D + '/banc-4-telephone.png', fullPage: false });
dire(!erreurs.length, `aucune erreur de script${erreurs.length ? ' : ' + erreurs.join(' | ') : ''}`);
await b.close();
console.log(`\n${ok} ok / ${ko} échec`); process.exit(ko ? 1 : 0);
