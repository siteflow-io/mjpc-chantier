// Le banc de la maquette « corriger sur les scans » : tout par le geste (souris, clavier, fichier choisi), à 1536 × 864.
import { createRequire } from 'node:module'; import path from 'node:path'; import fs from 'node:fs';
const req = createRequire(import.meta.url); let pw; for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright']) { try { pw = req(c); break; } catch (e) {} }
const DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); const MAQ = path.join(DIR, process.argv[2] || 'T399-maquette-redaction-scans-v1.html');
const OUT = process.argv[3] || path.join(DIR, 'banc', 'captures'); fs.mkdirSync(OUT, { recursive: true });
const b = await pw.chromium.launch({ args: ['--allow-file-access-from-files'] }); const ctx = await b.newContext({ viewport: { width: 1536, height: 864 }, acceptDownloads: true });
const pg = await ctx.newPage(); const err = []; pg.on('pageerror', e => err.push(e.message)); pg.on('dialog', d => { err.push('boîte ' + d.message()); d.dismiss(); });
await ctx.route(u => /firebasedatabase|firebaseio/.test(String(u)), r => { err.push('RÉSEAU HUB ' + r.request().url()); r.abort(); });
const PDFJS = process.env.PDFJS || '/tmp/claude-0/-home-claude/fbedd388-7b0c-5f43-87ab-077e6ae1db43/scratchpad/reperes/node_modules/pdfjs-dist/build/';   // le banc n'a pas internet : pdf.js 3.11.174 servi d'une copie locale
await ctx.route(u => String(u).includes('cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/'), r => { const f = String(r.request().url()).split('/').pop(); r.fulfill({ path: PDFJS + f, contentType: 'application/javascript' }); });
const ok = []; const verif = (n, c) => { ok.push((c ? '✓ ' : '✗ ') + n); };
const att = ms => pg.waitForTimeout(ms); const cap = async n => { await pg.screenshot({ path: path.join(OUT, n + '.png') }); };
process.on('uncaughtException', async e => { console.log(ok.join('\n')); console.log('ARRÊT : ' + String(e.message).split('\n')[0]); console.log(err.join('\n')); try { await cap('zz-arret'); } catch (x) {} process.exit(1); });
try {
await pg.goto('file://' + MAQ); await att(1500);
await pg.getByText('Rédaction 1', { exact: false }).first().click(); await att(1800);
verif('le tableau des élèves s\'ouvre sur la classe', await pg.locator('#btnScan').isVisible());
await pg.evaluate(() => { const f0 = window.fetch; window.__LOG = []; window.fetch = function (u, o) { if (o && o.method && /copies/.test(String(u))) { let n = '?'; try { const v = JSON.parse(o.body); n = v && v.scan ? Object.keys(v.scan.marques || {}).length : 'sans scan'; } catch (e) {} window.__LOG.push(o.method + ' ' + String(u).split('copies/')[1] + ' ' + n); } return f0(u, o); }; });
await pg.click('#btnScan'); await att(600);
await pg.keyboard.press('?'); await att(300); const aide = await pg.evaluate(() => { const a = document.getElementById('ruAide'); return a && !a.hidden ? a.innerText.slice(0, 40) : ''; });
await pg.keyboard.press('Escape'); await att(200); verif('« ? » : l\'aide de l\'app, pour cet écran (' + aide.split('\n')[0] + '), Échap la ferme', /Corriger sur les scans/.test(aide) && await pg.evaluate(() => document.getElementById('ruAide').hidden));
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-essai.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 8, null, { timeout: 60000 }); await att(800);
const blanches = await pg.evaluate(() => Object.values(SC.pages).filter(p => p.blanche).length); verif('8 pages lues, la page blanche reconnue (' + blanches + ')', blanches === 1);
const lig = await pg.evaluate(() => scPagesOrdre().map(p => p.lignes.n)); verif('lignes trouvées par page : ' + lig.join(','), lig[0] >= 20);
await cap('01-initiales');
for (const ini of ['ec', 'la', 'mb', '', 'tb', 'gc', 'rb']) { await pg.keyboard.type(ini); await att(150); await pg.keyboard.press('Enter'); await att(250); }
const cps = await pg.evaluate(() => SC.copies.map(k => nomEleveDe(k) + ':' + scPagesDe(k).length)); verif('6 copies dans l\'ordre du paquet : ' + cps.join(' · '), cps.length === 6 && cps[2].endsWith(':2'));
verif('la dernière page donnée, la correction commence d\'elle-même (passe 1, copie 1)', await pg.evaluate(() => !SC.attrib && SC.passe === 0 && SC.ic === 0)); await att(300);
// 1451 : les lignes écrites d'abord : le champ attend, et tant qu'il est vide la copie ne se quitte pas
const ligFocus = await pg.evaluate(() => (document.activeElement || {}).id === 'scLig' && !!document.querySelector('.sc-lig-manque'));
await pg.evaluate(() => document.activeElement.blur()); await pg.keyboard.press('Enter'); await att(200); await pg.keyboard.press('ArrowRight'); await att(300);
const reste = await pg.evaluate(() => ({ ic: SC.ic, pt: (scPt() || {}).id, focus: (document.activeElement || {}).id }));
await pg.keyboard.type('24'); await pg.keyboard.press('Enter'); await att(300);
const ligOk = await pg.evaluate(() => scLignesCopie(scK()) === 24 && !document.querySelector('.sc-lig-manque'));
verif('les lignes d\'abord : le champ attend (' + ligFocus + ') ; vide, ni Entrée ni → ne quittent la copie (' + reste.ic + ', ' + reste.pt + ') ; 24 tapé, Entrée : rangé', ligFocus && reste.ic === 0 && reste.pt === 'orthographe' && reste.focus === 'scLig' && ligOk);
await att(4800); verif('le bandeau d\'alerte des lignes disparaît seul (4,5 s)', await pg.evaluate(() => { const a = document.getElementById('scAlerte'); return !!a && a.hidden; }));
// passe 1, la langue : souligner « écrit » (ligne 3), taper la bonne forme ; une deuxième faute reprise par son numéro sur la copie suivante
const boite = async () => pg.locator('.sc-page').first().boundingBox();
const tracer = async (x0, y0, x1, y1) => { const r = await boite(); await pg.mouse.move(r.x + x0 * r.width, r.y + y0 * r.height); await pg.mouse.down(); await pg.mouse.move(r.x + x1 * r.width, r.y + y1 * r.height, { steps: 6 }); await pg.mouse.up(); await att(250); };
// 1509 (Paul, 30/10 12:59 : « le trait rouge n'apparaît pas au fur et à mesure de mon tiré ») : pendant le tracé, le trait se dessine sous la main, avant de lâcher
{ const r = await boite(), largeur = () => pg.evaluate(() => { const t = document.querySelector('.sc-page svg .sc-trace'); return t ? Math.round(t.getBoundingClientRect().width) : 0; });
  await pg.mouse.move(r.x + 0.25 * r.width, r.y + 0.175 * r.height); await pg.mouse.down(); await pg.mouse.move(r.x + 0.29 * r.width, r.y + 0.18 * r.height, { steps: 4 }); await att(60); const v1 = await largeur();
  await pg.mouse.move(r.x + 0.33 * r.width, r.y + 0.185 * r.height, { steps: 4 }); await att(60); const v2 = await largeur(); await cap('02a-trait-en-cours'); await pg.mouse.up(); await att(250);
  verif('pendant le tracé, le trait rouge se dessine sous la main (' + v1 + ' puis ' + v2 + ' points), avant de lâcher', v1 > 15 && v2 > v1 + 15); }
await pg.keyboard.type('écris'); await att(100); await cap('02-langue-faute'); await pg.keyboard.press('Enter'); await att(200);
await pg.click('text=★ La phrase qui t\'a touché'); await tracer(0.14, 0.28, 0.6, 0.33);
const m1 = await pg.evaluate(() => Object.values(scCopie(scK()).marques).map(m => m.forme + ':' + (m.bonne || '') + ':' + m.l0 + '-' + m.l1));
verif('une faute soulignée avec sa bonne forme, une phrase dorée sur deux lignes : ' + m1.join(' '), m1.some(x => x.startsWith('faute:écris')) && m1.some(x => x.startsWith('etoile')));
await pg.keyboard.press('Enter'); await att(150); await pg.keyboard.press('Enter'); await pg.keyboard.press('n'); await pg.keyboard.press('Enter'); await att(400);
verif('après la langue, la copie suivante arrive', await pg.evaluate(() => SC.ic === 1));
await att(200); await pg.keyboard.type('22'); await pg.keyboard.press('Enter'); await att(250);
await tracer(0.25, 0.175, 0.33, 0.185); await pg.keyboard.type('1'); await pg.keyboard.press('Enter'); await att(200);
verif('le numéro 1 reprend « écris »', await pg.evaluate(() => scFautes(scK())[0].bonne === 'écris'));
// 1436 : une faute posée sans bonne forme ; un clic sur elle rouvre son champ, la bonne forme s'y tape ; Suppr au bout du champ efface la faute, Ctrl+Z la remet
await tracer(0.40, 0.175, 0.47, 0.185); await pg.keyboard.press('Enter'); await att(250);
const sansB = async () => pg.evaluate(() => { const m = Object.values(scCopie(scK()).marques).find(m => m.forme === 'faute' && !m.bonne); return m ? [m.id, (m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2] : null; });
const fx = await sansB(); const rb = await boite(); await pg.mouse.click(rb.x + fx[1] * rb.width, rb.y + fx[2] * rb.height); await att(300);
const ouvert = await pg.evaluate(() => (document.activeElement || {}).id === 'scChampIn');
await pg.keyboard.type('quelques'); await pg.keyboard.press('Enter'); await att(250);
const rangee = await pg.evaluate(id => (scCopie(scK()).marques[id] || {}).bonne, fx[0]);
verif('un clic sur une faute sans bonne forme rouvre son champ (' + ouvert + '), la bonne forme s\'y range (« ' + rangee + ' »)', ouvert && rangee === 'quelques');
await pg.mouse.click(rb.x + fx[1] * rb.width, rb.y + fx[2] * rb.height); await att(300);
const relu = await pg.evaluate(() => (document.getElementById('scChampIn') || {}).value);
await pg.keyboard.press('Delete'); await att(250); const effacee = await pg.evaluate(id => !scCopie(scK()).marques[id], fx[0]);
await pg.keyboard.press('Control+z'); await att(250); const remise = await pg.evaluate(id => (scCopie(scK()).marques[id] || {}).bonne, fx[0]);
verif('rouverte, elle montre sa bonne forme (« ' + relu + ' ») ; Suppr au bout du champ l\'efface, Ctrl+Z la remet', relu === 'quelques' && effacee && remise === 'quelques');
// 1485-1487 (Paul, 30/10 12:08) : un clic sur le mot d'une faute (au-dessus du trait) ou juste sous le trait rouvre CETTE faute, sans poser de nouvelle marque ; les poignées tiennent ; jamais de cadre retourné
await pg.keyboard.press('Escape'); await att(200);
const nbM = () => pg.evaluate(() => Object.keys(scCopie(scK()).marques).length);
const geo = id => pg.evaluate(id => { const m = scCopie(scK()).marques[id], E = SC.encres && SC.encres[m.page]; return { x0: m.x0, x1: m.x1, y0: m.y0, y1: m.y1, pas: E && E.pas ? E.pas / E.H : 0.027 }; }, id);
const champDe = () => pg.evaluate(() => SC.champ && SC.champ.id);
let g0 = await geo(fx[0]), n0 = await nbM(), rb2 = await boite();
await pg.mouse.click(rb2.x + (g0.x0 + g0.x1) / 2 * rb2.width, rb2.y + (g0.y1 - g0.pas * 0.55) * rb2.height); await att(300);
const surMot = (await champDe()) === fx[0] && (await nbM()) === n0; await pg.keyboard.press('Escape'); await att(200);
await pg.mouse.click(rb2.x + (g0.x0 + g0.x1) / 2 * rb2.width, rb2.y + g0.y1 * rb2.height + 6); await att(300);
const sousTrait = (await champDe()) === fx[0] && (await nbM()) === n0; await pg.keyboard.press('Escape'); await att(200);
verif('un clic sur le mot d\'une faute, au-dessus du trait (' + surMot + '), ou juste dessous (' + sousTrait + '), rouvre cette faute, sans nouvelle marque', surMot && sousTrait);
await pg.mouse.click(rb2.x + (g0.x0 + g0.x1) / 2 * rb2.width, rb2.y + (g0.y0 + g0.y1) / 2 * rb2.height); await att(300);
const poi = await pg.evaluate(() => { const q = document.querySelector('.sc-poignee[data-p="b"][fill="#fff"]'); if (!q) return null; const r = q.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const h = document.elementFromPoint(cx + 12, cy + 10); return { w: r.width, cx, cy, prise: !!(h && h.closest('.sc-poignee')) }; });
await pg.mouse.move(poi.cx + 12, poi.cy + 10); await pg.mouse.down(); await pg.mouse.move(poi.cx + 52, poi.cy + 10, { steps: 8 }); await pg.mouse.up(); await att(300);
const g1 = await geo(fx[0]); const tire = Math.round((g1.x1 - g0.x1) * rb2.width);
verif('les poignées : ' + Math.round(poi.w) + ' points à l\'écran, prises à 12 points de leur centre (' + poi.prise + ') ; tirée de 40 points, la fin du trait suit (' + tire + ' points), sans nouvelle marque', poi.w >= 14 && poi.w <= 18 && poi.prise && Math.abs(tire - 40) <= 6 && (await nbM()) === n0);
const pa = await pg.evaluate(() => { const q = document.querySelector('.sc-poignee[data-p="a"][fill="#fff"]'); const r = q.getBoundingClientRect(); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; });
await pg.mouse.move(pa.cx, pa.cy); await pg.mouse.down(); await pg.mouse.move(pa.cx + (g1.x1 - g1.x0) * rb2.width + 30, pa.cy, { steps: 8 }); await pg.mouse.up(); await att(300);
const g2 = await geo(fx[0]); verif('le début tiré au-delà de la fin : le trait se remet à l\'endroit (' + g2.x0.toFixed(3) + ' < ' + g2.x1.toFixed(3) + ')', g2.x0 < g2.x1 && g2.y0 <= g2.y1);
await pg.keyboard.press('Escape'); await pg.keyboard.press('Control+z'); await att(150); await pg.keyboard.press('Control+z'); await att(250);
const g3 = await geo(fx[0]); verif('Ctrl+Z deux fois : la faute revient à sa place', Math.abs(g3.x0 - g0.x0) < 1e-6 && Math.abs(g3.x1 - g0.x1) < 1e-6);
// 1444 : le champ de la bonne forme au-dessus du mot, relié à lui ; tiré ailleurs, il garde cette place pour le champ suivant
await tracer(0.55, 0.30, 0.62, 0.31); await att(250);
const champPos = async () => pg.evaluate(() => { const d = document.querySelector('.sc-champ'); if (!d) return null; const P = d.parentNode, m = scCopie(scK()).marques[SC.champ.id]; const r = d.getBoundingClientRect(), q = P.getBoundingClientRect(); return { haut: r.top, bas: r.bottom, gauche: r.left, motHaut: q.top + m.y0 * q.height, motGauche: q.left + m.x0 * q.width, lien: !!P.querySelector('.sc-lien line') }; });
const ch1 = await champPos(); verif('le champ de la bonne forme se pose au-dessus du mot, relié à lui par un trait : la suite de la copie reste visible', ch1 && ch1.bas < ch1.motHaut && ch1.lien);
const ti = await pg.locator('.sc-champ .sc-tire').boundingBox(); await pg.mouse.move(ti.x + 6, ti.y + 6); await pg.mouse.down(); await pg.mouse.move(ti.x + 206, ti.y - 34, { steps: 6 }); await pg.mouse.up(); await att(250);
const ch2 = await champPos(); await pg.keyboard.type('mots'); await pg.keyboard.press('Enter'); await att(250);
await tracer(0.30, 0.40, 0.37, 0.41); await att(250); const ch3 = await champPos(); await pg.keyboard.press('Enter'); await att(200);
verif('tiré par ⠿, le champ se déplace (' + Math.round(ch2.gauche - ch1.gauche) + ' points) et le suivant reprend cette place près de son mot', Math.abs((ch2.gauche - ch2.motGauche) - (ch3.gauche - ch3.motGauche)) < 3 && Math.abs((ch2.haut - ch2.motHaut) - (ch3.haut - ch3.motHaut)) < 3 && ch2.gauche - ch1.gauche > 150);
await pg.evaluate(() => { SC.champDecal = null; try { localStorage.removeItem('mjpc_scan_champ'); } catch (e) {} });
// 1483-1484 (Paul, 30/10 11:57) : la copie sans infobulle ; un clic dans le blanc, hors de la page, relâche l'outil et ferme le champ (gardé)
const blanc = async () => { const z = await pg.locator('#scCopie').boundingBox(), p = await pg.locator('.sc-page').first().boundingBox(); await pg.mouse.click(z.x + Math.max(4, (p.x - z.x) / 2), p.y + 40); await att(300); };
await pg.locator('#scPanneau button', { hasText: 'Remarque' }).click({ timeout: 8000 }); await att(200); const arme = await pg.evaluate(() => SC.outil); await blanc(); const relache = await pg.evaluate(() => SC.outil);
await tracer(0.70, 0.243, 0.78, 0.249); await att(200); await pg.keyboard.type('vu'); await blanc(); const ch = await pg.evaluate(() => ({ ouvert: !!document.querySelector('.sc-champ'), bonne: (Object.values(scCopie(scK()).marques).find(m => m.bonne === 'vu') || {}).bonne, titre: document.getElementById('scCopie').hasAttribute('title') }));
await pg.evaluate(() => { const m = Object.values(scCopie(scK()).marques).find(m => m.bonne === 'vu'); if (m) scEffacer(m.id); });   /* la marque d'essai retirée : les vérifications suivantes comptent les marques */
verif('un clic dans le blanc relâche l\'outil (' + arme + ' → ' + relache + ') et ferme le champ en gardant la forme (« ' + ch.bonne + ' ») ; la copie n\'a plus d\'infobulle (' + !ch.titre + ')', arme === 'remarque' && relache === null && !ch.ouvert && ch.bonne === 'vu' && !ch.titre);
// 1445 : retoucher la page comme une photo — rotation degré par degré, cadre ; les marques restent sur leurs mots ; le cadre ne coupe pas une marque ; tout se défait
const pidR = await pg.evaluate(() => scPagesDe(scK())[0].id);
const etatR = async () => pg.evaluate(pid => { const p = SC.pages[pid], o = SC.origs[pid], A = { rot: p.rot || 0, angle: p.angle || 0, recadre: p.recadre || null };
  const ms = Object.values(scCopie(scK()).marques).filter(m => m.page === pid).sort((a, b) => a.id < b.id ? -1 : 1); return { w: p.w, h: p.h, angle: p.angle || 0, recadre: p.recadre || null, m: ms.map(m => [m.x0, m.y0, m.x1, m.y1]), o: ms.map(m => o ? scVue2Orig(A, o.w, o.h, (m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2) : null) }; }, pidR);
const rt0 = await etatR(); await pg.click('text=✂ Page 1'); await att(900);
const ouverte = await pg.evaluate(() => !!SC.rt && !document.getElementById('scRetouche').hidden);
for (let i = 0; i < 3; i++) { await pg.keyboard.press('ArrowRight'); await att(80); }
const scn = await pg.locator('#scRtScene').boundingBox(); const se = await pg.locator('.sc-rt-p.se').boundingBox();
await pg.mouse.move(se.x + 9, se.y + 9); await pg.mouse.down(); await pg.mouse.move(se.x + 9 - 0.12 * scn.width, se.y + 9 - 0.15 * scn.height, { steps: 6 }); await pg.mouse.up(); await att(200);
const wv = await pg.locator('.sc-rt-p.w').boundingBox(); await pg.mouse.move(wv.x + 9, wv.y + 9); await pg.mouse.down(); await pg.mouse.move(wv.x + 9 + 0.7 * scn.width, wv.y + 9, { steps: 6 }); await pg.mouse.up(); await att(200);
const cad = await pg.evaluate(() => ({ c: SC.rt.cadre.slice(), b: scRtBoite() }));
await cap('13-retouche');
verif('✂ ouvre la retouche ; tiré par-dessus une marque, le cadre s\'arrête à elle', ouverte && cad.b && cad.c[0] <= cad.b[0] + 1e-9 && cad.c[2] >= cad.b[2] - 1e-9);
await pg.keyboard.press('Enter'); await att(1800); const rt1 = await etatR();
const ecart = rt1.o.reduce((a, p, i) => Math.max(a, Math.hypot(p[0] - rt0.o[i][0], p[1] - rt0.o[i][1])), 0);
verif('retouchée (3°, recadrée : ' + rt0.w + '×' + rt0.h + ' → ' + rt1.w + '×' + rt1.h + '), ses ' + rt1.m.length + ' marques restent sur leurs mots (écart ' + ecart.toFixed(2) + ' point)', rt1.angle === 3 && rt1.recadre && rt1.w < rt0.w && rt1.m.length >= 2 && ecart < 1.5);
await cap('14-apres-retouche');
const vuToast = await pg.evaluate(() => { const t = document.getElementById('toast'); const r = t.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return t.classList.contains('show') && (e === t || t.contains(e)) ? t.textContent : ''; });
verif('le message de l\'appli se lit par-dessus l\'écran des scans (« ' + vuToast.slice(0, 40) + ' »)', /retouchée/.test(vuToast));
await pg.click('text=✂ Page 1'); await att(900); for (let i = 0; i < 3; i++) { await pg.keyboard.press('ArrowLeft'); await att(80); } await pg.click('text=Toute la photo'); await att(200); await pg.keyboard.press('Enter'); await att(1800);
const rt2 = await etatR(); const dm = rt2.m.reduce((a, m, i) => Math.max(a, ...m.map((v, j) => Math.abs(v - rt0.m[i][j]))), 0);
verif('rien n\'est perdu : 0° et toute la photo, la page et ses marques reviennent comme avant (écart ' + dm.toFixed(4) + ')', rt2.w === rt0.w && rt2.h === rt0.h && rt2.angle === 0 && !rt2.recadre && dm < 0.003);
// 1443 : la question en cours se répond aussi à la souris, et entoure la case qu'elle décide
await pg.click('.sc-pts span >> nth=0').catch(() => {}); await pg.keyboard.press('Enter'); await att(300);
await pg.click('.sc-q >> nth=2'); await att(300);
const lie = await pg.evaluate(() => ({ si: (document.querySelector('.sc-case.si span') || {}).textContent || '', bout: !!document.querySelector('.sc-q.on .sc-q-rep') }));
await pg.click('.sc-q.on >> text=Non · N'); await att(300);
const rep3 = await pg.evaluate(() => { const L = Object.values(scCopie(SC.copies[1]).rep.lexique || {}); return L.join(','); });
verif('la question en cours entoure la case qu\'elle décide (« ' + lie.si.slice(0, 30) + '… ») et se répond au bouton Non', lie.bout && /14-18/.test(lie.si) && rep3.includes('n'));
await cap('03-langue-banque');
// passe 2, le thème : Entrée, N, une marque « marge » qui répond oui
await pg.click('.sc-passe >> nth=1'); await att(400); await pg.click('.sc-vig >> nth=0'); await att(300);
for (let i = 0; i < 4; i++) await pg.keyboard.press('Enter');
await pg.keyboard.press('n'); await att(100); await pg.keyboard.press('Enter'); await pg.keyboard.press('Enter'); await att(300);
const c1 = await pg.evaluate(() => { const pt = SC.grille.criteres[0].points[0]; const r = scCase(pt, SC.copies[0]); return r && r.c.niveau + ' ' + r.txt; });
verif('« depuis quand ? » non : la case se calcule seule (' + c1 + ')', /^3 On ne sait pas depuis quand/.test(c1 || ''));
await pg.keyboard.press('Enter'); await att(200); await tracer(0.1, 0.17, 0.1, 0.44); await att(200);
const mg = await pg.evaluate(() => Object.values(scCopie(SC.copies[0]).marques).filter(m => m.forme === 'marge').length); verif('le pinceau trace un trait dans la marge pour un paragraphe', mg === 1);
await cap('04-theme-case');
// Suppr, Ctrl+Z
await pg.keyboard.press('Delete'); await att(150); const apres = await pg.evaluate(() => Object.values(scCopie(SC.copies[0]).marques).filter(m => m.forme === 'marge').length);
await pg.keyboard.press('Control+z'); await att(150); const remis = await pg.evaluate(() => Object.values(scCopie(SC.copies[0]).marques).filter(m => m.forme === 'marge').length);
verif('Suppr efface la marque choisie, Ctrl+Z la remet', apres === 0 && remis === 1);
// 1304 : les cases comptées par les marques — passe 4, « la 1re personne », deux verbes encadrés
await pg.click('.sc-passe >> nth=3'); await att(300); await pg.click('.sc-vig >> nth=0'); await att(300);
for (let i = 0; i < 9; i++) { await pg.keyboard.press('Enter'); await att(60); }
await tracer(0.45, 0.30, 0.52, 0.31); await tracer(0.45, 0.40, 0.52, 0.41); await pg.keyboard.press('Escape'); await att(200);
const cp = await pg.evaluate(() => { const pt = SC.grille.criteres[2].points[1]; const r = scCase(pt, SC.copies[0]); return SC.iq + ' · ' + (r && r.c.niveau + ' ' + r.txt); });
verif('deux verbes encadrés : la case se compte (' + cp + ')', /^personne\.les-temps\S* · 1 Plusieurs de tes verbes/.test(cp));
// les copies vierges : la fenêtre d'impression
const pop = ctx.waitForEvent('page'); await pg.click('text=🖨 Copies vierges'); const fen = await pop; await fen.waitForLoadState(); await att(400);
verif('les copies vierges : ' + await fen.locator('.p svg').count() + ' pages à imprimer, quatre repères chacune', await fen.locator('.p svg').count() >= 30 && await fen.locator('.p').first().locator('rect[fill="#000"]').count() === 4); await fen.close();
// le rechargement : les marques reviennent par leur identité, le paquet est resté dans le navigateur
const avant = await pg.evaluate(() => SC.copies.map(k => Object.values(scCopie(k).marques).map(m => m.forme).join('+')).join(' | ')); await att(1500); console.log((await pg.evaluate(() => window.__LOG)).join('\n')); console.log('HUB ARNAUD : ' + await pg.evaluate(() => fetch(ruUrl(ruCheminCopies().concat(SC.copies[1]))).then(r => r.json()).then(v => JSON.stringify(v && v.scan && Object.keys(v.scan.marques || {}).length) + ' · état : ' + Object.keys(scCopie(SC.copies[1]).marques).length + ' · sig ' + !!RU.sig[SC.copies[1]] + ' · test ' + RU.test))); const ou = await pg.evaluate(() => scP().id + ' · ' + scK() + ' · ' + (scPt() || {}).id + ' · ' + SC.iq);
const horo = () => pg.evaluate(() => { const H = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('mjpc_maquette_T399_hub_')))); const c = H.redactions.sujet_mvtd85g7_ycxjq3.copies || {}; const t = {}; Object.keys(c).forEach(cl => Object.keys(c[cl] || {}).forEach(e => { t[cl + '/' + e] = c[cl][e].modifieLe; })); return t; });
const horoAvant = await horo();
await pg.reload(); await att(3500);
const horoApres = await horo(); const bouges = Object.keys(horoApres).filter(k => horoApres[k] !== horoAvant[k]);
verif('rouvrir la classe ne réécrit aucune copie (' + Object.keys(horoApres).length + ' copies, ' + bouges.length + ' horodatage changé)', Object.keys(horoApres).length >= 3 && bouges.length === 0);   /* les 3 copies jouées par le banc ; une copie jamais touchée ne s'écrit pas */
const ou2 = await pg.evaluate(() => SC.ouvert ? scP().id + ' · ' + scK() + ' · ' + (scPt() || {}).id + ' · ' + SC.iq : 'écran fermé');
verif('reprise exacte : rechargée, la page rouvre la correction sur les scans au même endroit (' + ou2 + ')', ou2 === ou);
/* 1.2.3 (C14, Paul 30/10 15:19 « le site a refusé l'enregistrement ») : les réponses aux questions arrivent au site et en reviennent ; le faux hub refuse, comme le site, un nom avec . # $ / [ ] */
{ const r = await pg.evaluate(() => { const H = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('mjpc_maquette_T399_hub_')))); const c = H.redactions.sujet_mvtd85g7_ycxjq3.copies || {}; const cl = Object.keys(c)[0]; const au = ((((c[cl] || {})[SC.copies[1]] || {}).scan || {}).rep || {}).lexique || {}; return { refus: +(localStorage.getItem('mjpc_faux_hub_refus') || 0), cles: Object.keys(au).join(','), lu: Object.values(scCopie(SC.copies[1]).rep.lexique || {}).join(','), luCles: Object.keys(scCopie(SC.copies[1]).rep.lexique || {}).join(','), temoin: (document.getElementById('ruTemoin') || {}).textContent || '' }; });
  verif('les réponses aux questions sont au site (' + r.cles.slice(0, 40) + '…), relues avec leur nom (' + r.luCles.slice(0, 30) + '…, ' + r.lu + ') ; écritures refusées pendant tout le banc : ' + r.refus, r.refus === 0 && /%2E/.test(r.cles) && !/\./.test(r.cles) && /^lexique\./.test(r.luCles) && r.lu.includes('n') && !/refusé/.test(r.temoin)); }
const n2 = await pg.evaluate(() => ({ m: SC.copies.reduce((a, k) => a + Object.keys(scCopie(k).marques).length, 0), img: Object.keys(SC.imgs).length, man: scManquantes().length, orig: Object.keys(SC.origs).length }));
const apresR = await pg.evaluate(() => SC.copies.map(k => Object.values(scCopie(k).marques).map(m => m.forme).join('+')).join(' | ')); console.log('avant : ' + avant + '\naprès : ' + apresR);
verif('après rechargement : ' + n2.m + ' marques, ' + n2.img + ' images gardées par le navigateur (et ' + n2.orig + ' photos entières, pour retoucher), ' + n2.man + ' manquante', n2.m >= 6 && n2.img >= 8 && n2.orig >= 8 && n2.man === 0);
// le fichier de l'élève
await pg.click('text=📨 Fichiers École Directe'); await att(400); await cap('05-fichiers-ed');
const dl = pg.waitForEvent('download'); await pg.click('.sc-table tr >> nth=1 >> text=Télécharger'); const d = await dl; const f = path.join(OUT, 'fichier-eleve.html'); await d.saveAs(f);
const html = fs.readFileSync(f, 'utf8'); verif('le fichier élève porte sa photo (' + Math.round(html.length / 1024) + ' Ko) et ne joint jamais le vrai hub en maquette', /data:image\/jpeg;base64/.test(html) && /"test":true/.test(html));
// 1463 : le fichier de l'élève en lecture seule : il clique tes marques et sa grille, il n'écrit rien ; la coche de la correction par l'élève est grisée
const coche = await pg.evaluate(() => { const c = document.querySelector('.sc-coche input'); return c ? { off: c.disabled && !c.checked, dit: c.closest('label').textContent.replace(/\s+/g, ' ').trim() } : null; });
verif('la coche « Ouvrir la correction par l\'élève » est là, grisée, décochée, et dit pourquoi (« ' + (coche && coche.dit.slice(0, 60)) + '… »)', coche && coche.off && /pas encore codée/.test(coche.dit));
const popE = ctx.waitForEvent('page'); await pg.click('.sc-table tr >> nth=1 >> text=Tester comme l\'élève'); const el = await popE; await el.waitForLoadState(); await el.setViewportSize({ width: 1536, height: 864 }); await att(1500);
await el.screenshot({ path: path.join(OUT, '06-eleve-traversee.png') }); await el.locator('#passer').click(); await att(600);
const lg = await el.evaluate(() => ({ lignes: document.querySelectorAll('#pan .ligne[data-p]').length, champs: document.querySelectorAll('input,textarea').length, note: (document.querySelector('.note') || {}).textContent || '' }));
await el.screenshot({ path: path.join(OUT, '07-eleve-grille.png') });
// 1488 (Paul, 30/10 12:16 : des soulignés décalés en hauteur dans le fichier de l'élève) : le trait rouge de l'élève est à la même hauteur que le tien, sous le mot (le bas de la marque), jamais dedans
const hauteurs = await el.evaluate(() => { const out = []; document.querySelectorAll('#col .pg').forEach((P, i) => { const q = P.getBoundingClientRect(); D.fautes.filter(f => f.page === i).forEach(f => { const e = P.querySelector('.mk.f[data-v="f:' + D.fautes.indexOf(f) + '"]'); if (!e) return; const r = e.getBoundingClientRect(), a = getComputedStyle(e, '::after'); const haut = r.bottom - parseFloat(a.bottom || 0) - parseFloat(a.height); out.push(Math.round((haut - (q.top + f.y1 * q.height)) * 10) / 10); }); }); return out; });
verif('le trait d\'une faute, dans le fichier de l\'élève, commence au bas du mot, comme chez toi (écarts : ' + hauteurs.join(' ; ') + ' points)', hauteurs.length >= 1 && hauteurs.every(v => Math.abs(v) <= 1));
await el.locator('#pan .ligne[data-p] >> nth=0').click(); await att(500); const det = await el.evaluate(() => ({ ech: !!document.querySelector('#pan .ech span.on'), marque: document.querySelectorAll('#col .on').length }));
await el.screenshot({ path: path.join(OUT, '08-eleve-point.png') });
await el.locator('#gr').click(); await att(300); await el.locator('#col .num >> nth=0').click(); await att(400); const fa = await el.evaluate(() => (document.querySelector('#pan h3') || {}).textContent || '');
await el.screenshot({ path: path.join(OUT, '09-eleve-faute.png') }); await el.locator('#gr').click(); await att(300); const retourGrille = await el.evaluate(() => document.querySelectorAll('#pan .ligne[data-p]').length);
verif('l\'élève lit sa copie corrigée : sa grille (' + lg.lignes + ' points, note « ' + lg.note + ' »), un point cliqué montre son échelle et ses marques (' + det.marque + '), une faute cliquée (« ' + fa + ' »), il revient à sa grille quand il veut ; aucun champ (' + lg.champs + ')', lg.lignes >= 1 && lg.champs === 0 && det.ech && det.marque >= 1 && /^Faute 1 sur/.test(fa) && retourGrille === lg.lignes);
const passes = await pg.evaluate(() => Array.from(document.querySelectorAll('.sc-passe')).map(b => b.textContent.trim()));
verif('pas de passe « Les retours des élèves » tant que la correction par l\'élève est fermée (' + passes.length + ' passes)', passes.length === 4 && !passes.some(t => /retours/.test(t)));
await pg.bringToFront(); await pg.keyboard.press('Escape'); await att(300);
// les copies vierges de l'appli : scannées de travers, remises droites, lignes connues
await pg.click('.sc-passe >> nth=0'); await att(200);
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-reperes.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 10, null, { timeout: 60000 }); await att(600);
const rp = await pg.evaluate(() => scPagesOrdre().slice(-2).map(p => (p.lignes.reperes ? 'repères' : 'sans') + ':' + p.lignes.n + ':' + p.w + 'x' + p.h));
verif('les copies à repères se remettent droites, lignes connues : ' + rp.join(' · '), rp.length === 2 && rp.every(x => x.startsWith('repères')) && /:24:/.test(rp[0]) && /:17:/.test(rp[1]));
verif('les initiales reprennent à la première page sans élève', await pg.evaluate(() => SC.attrib && !scPagesOrdre()[SC.ia].eleve)); await cap('11-copie-a-reperes');
await pg.keyboard.type('tb'); await pg.keyboard.press('Enter'); await att(200); await pg.keyboard.type('rc'); await pg.keyboard.press('Enter'); await att(400);
for (const [w, h] of [[1366, 768], [1920, 1080]]) { await pg.setViewportSize({ width: w, height: h }); await att(400); await cap('12-ecran-' + w + 'x' + h); }
await pg.setViewportSize({ width: 1536, height: 864 });
// sans interactivité (un téléphone qui n'exécute pas la pièce jointe) : la copie et les marques se voient
const p2 = await (await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } })).newPage(); await p2.goto('file://' + f); await att(500);
verif('sans interactivité, la copie et ses marques se voient (' + await p2.locator('.mk').count() + ' marques)', await p2.locator('#statique img').count() >= 1 && await p2.locator('.mk').count() >= 2);
await p2.screenshot({ path: path.join(OUT, '10-eleve-sans-interactivite.png') });
// le mode test de MJPC (?test=1, comme l'ouvre le portail en mode test) : la correction et les retours restent dans la page, rien au hub
const pt = await ctx.newPage(); pt.on('pageerror', e => err.push('test : ' + e.message));
await pt.goto('file://' + MAQ + '?mode=prof&id=sujet_mvtd85g7_ycxjq3&classe=3_franklin_aretha&test=1'); await att(2500);
const avantT = await pt.evaluate(() => JSON.stringify(window.__hubTest = null) && fetch(ruUrl(ruCheminCopies())).then(r => r.json()).then(v => JSON.stringify(v).length));
if (!(await pt.evaluate(() => SC.ouvert))) { await pt.click('#btnScan'); } await att(1500); if (await pt.evaluate(() => SC.attrib)) { await pt.keyboard.type('rc'); await att(150); await pt.keyboard.press('1'); await att(400); }
await pt.click('.sc-vig >> nth=0'); await att(400);
const r2 = await pt.locator('.sc-page').first().boundingBox(); await pt.mouse.move(r2.x + 0.3 * r2.width, r2.y + 0.5 * r2.height); await pt.mouse.down(); await pt.mouse.move(r2.x + 0.38 * r2.width, r2.y + 0.51 * r2.height, { steps: 4 }); await pt.mouse.up(); await att(200); await pt.keyboard.type('essai'); await pt.keyboard.press('Enter'); await att(1600);
const t2 = await pt.evaluate(() => ({ test: RU.test, ecrits: RU.ecritsTest.length, temoin: (document.getElementById('ruTemoin') || {}).textContent || '' }));
const apresT = await pg.evaluate(() => fetch(ruUrl(["redactions", "sujet_mvtd85g7_ycxjq3", "copies", "3_franklin_aretha"])).then(r => r.json()).then(v => JSON.stringify(v).length));
verif('mode test de MJPC : la faute posée reste dans la page (' + t2.ecrits + ' écritures gardées, témoin « ' + t2.temoin.slice(0, 28) + ' »), rien au hub', t2.test && t2.ecrits >= 1 && apresT === avantT);
await pt.close();
// les couches ne se chevauchent pas : le « ? » de l'app, son témoin, et l'écran des scans, aux trois tailles
const chev = []; for (const [w, h] of [[1366, 768], [1536, 864], [1920, 1080]]) { await pg.setViewportSize({ width: w, height: h }); await att(300);
  chev.push(...await pg.evaluate(({ w, h }) => { const R = e => e && e.getBoundingClientRect(); const x = (a, b) => a && b && a.width && b.width && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const app = [document.querySelector('.rp-aide-btn'), document.getElementById('ruTemoin')].map(R); const moi = Array.from(document.querySelectorAll('#scanEcran .sc-haut button, #scanEcran .sc-haut label, #scanEcran .sc-passe, #scanEcran .sc-bloc, #scChrono')).map(R);
    const L = []; app.forEach((a, i) => moi.forEach((b, j) => { if (x(a, b)) L.push(w + 'x' + h + ' ' + ['?', 'témoin'][i] + '/' + j); })); return L; }, { w, h })); }
await pg.setViewportSize({ width: 1536, height: 864 }); verif('aucun chevauchement avec le « ? » et le témoin de l\'app, à 1366, 1536 et 1920 (' + (chev.join(', ') || 'aucun') + ')', chev.length === 0);
// le fichier réel, celui d'École Directe : il ne joint jamais le site (lecture seule), et se lit sans recharger
const reel = await pg.evaluate(() => { const fh = window.__FAUX_HUB; window.__FAUX_HUB = false; const t = RU.test; RU.test = false; const p = scEleveFichier(SC.copies[0], false); window.__FAUX_HUB = fh; RU.test = t; return p.then(f => f.html); });
const fr2 = path.join(OUT, 'fichier-eleve-reel.html'); fs.writeFileSync(fr2, reel);
const ctx2 = await b.newContext({ viewport: { width: 1536, height: 864 } }); const appels = []; ctx2.on('request', q => { if (!/^(file|data|blob):/.test(q.url())) appels.push(q.url()); });
const pr = await ctx2.newPage(); await pr.goto('file://' + fr2); await att(900); await pr.locator('#passer').click(); await att(400);
const vuR = await pr.evaluate(() => ({ lignes: document.querySelectorAll('#pan .ligne[data-p]').length, test: /Mode test/.test(document.body.innerText) }));
verif('le fichier réel de l\'élève se lit seul : sa grille (' + vuR.lignes + ' points), aucun appel au site ni ailleurs (' + appels.length + ')', vuR.lignes >= 1 && !vuR.test && appels.length === 0);
await ctx2.close();
// 1450 : une copie passée en entier, le récapitulatif s'ouvre seul : la note, la grille, le bilan, « À reprendre »
await pg.bringToFront(); if (await pg.evaluate(() => SC.attrib)) { await pg.click('#scInit'); await pg.keyboard.press('1'); await att(500); }   // la page à repères laissée en suspens plus haut : « rc » désigne deux élèves, le chiffre 1 choisit
let recapOuvert = false;
for (const ip of [0, 1, 2, 3]) { await pg.click('.sc-passe >> nth=' + ip); await att(300); await pg.click('.sc-vig >> nth=0'); await att(300); const k0 = await pg.evaluate(() => scK());
  let nE = 0; for (; nE < 90; nE++) { const st = await pg.evaluate(k0 => ({ r: !!SC.recap, autre: scK() !== k0 }), k0); if (st.r) { recapOuvert = true; break; } if (st.autre) break; await pg.keyboard.press('Enter'); await att(50); }
  if (!recapOuvert) console.log('  recap, passe ' + ip + ' après ' + nE + ' Entrée : ' + await pg.evaluate(k0 => { const a = document.activeElement; return 'copie ' + k0 + ' → ' + scK() + ' · pt ' + (scPt() || {}).id + ' · q ' + SC.iq + ' · focus ' + (a && (a.id || a.tagName)) + ' · lignes ' + scLignesCopie(k0) + ' · ' + SC.grille.criteres.map(c => c.points.map(pt => { const r = scCase(pt, k0); return r ? (r.complet ? r.c.niveau : 'i') : '-'; }).join('')).join('|'); }, k0));
  if (recapOuvert) break; }
const rc = await pg.evaluate(() => { const E = document.getElementById('scRecap'); return E && !E.hidden ? { note: E.querySelector('.sc-rc-note').textContent, lignes: E.querySelectorAll('.sc-rc-grille tr:not(.sc-rc-crit)').length, pas: E.querySelectorAll('.sc-rc-pas').length, paras: E.querySelectorAll('.sc-rc-col:last-child > p').length, suite: !!E.querySelector('.sc-rt-ok') } : null; });
await cap('18-recapitulatif');
const icAvant = await pg.evaluate(() => SC.ic); await pg.keyboard.press('Enter'); await att(400); const apresRc = await pg.evaluate(() => ({ ferme: !SC.recap, ic: SC.ic }));
verif('copie passée en entier : le récapitulatif s\'ouvre seul (note « ' + (rc && rc.note) + ' », ' + (rc && rc.lignes) + ' points, ' + (rc && rc.paras) + ' paragraphes de bilan) ; Entrée : la copie suivante', rc && /\/ 40/.test(rc.note) && rc.lignes === 12 && rc.pas === 0 && rc.paras >= 1 && rc.suite && apresRc.ferme && apresRc.ic !== icAvant);
verif('aucune écriture sur une classe entière (une clé de copie vide)', !(await pg.evaluate(() => window.__LOG || [])).some(l => /^\w+ [^/]+\.json/.test(l)));
verif('aucune erreur, aucune boîte, aucun appel au vrai hub', err.length === 0);
} catch (e) { console.log(ok.join('\n')); console.log('ARRÊT : ' + String(e.message).split('\n')[0]); console.log(err.join('\n')); await cap('zz-arret'); process.exit(1); }
console.log(ok.join('\n')); if (err.length) console.log('ERREURS\n' + err.join('\n'));
const echec = ok.some(x => x.startsWith('✗')) || err.length > 0;
console.log(echec ? 'BANC : ÉCHEC' : 'BANC : ' + ok.length + ' vérifications, 0 défaut'); await b.close();
if (echec) process.exitCode = 1;
