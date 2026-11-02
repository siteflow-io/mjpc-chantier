import { eprouverRecopie } from "./recopie.mjs";
import { eprouverAccueil, eprouverAutreOrdinateur, eprouverDossierMele } from "./accueil.mjs";
import { eprouverAbsent } from "./absent.mjs";
import { eprouverDettes115 } from "./dettes115.mjs";
import { eprouverStickers, eprouverStickersReglages } from "./stickers.mjs";
import { eprouverSauvegarde } from "./sauvegarde.mjs";
import { eprouverBilan } from "./bilan.mjs";
import { eprouverEffacer } from "./effacer.mjs";
import { eprouverEnlever } from "./enlever.mjs";
import { eprouverEcho } from "./echo.mjs";
import { eprouverReprendre, eprouverBandeSuite } from "./reprendre.mjs";
import { eprouverPoints } from "./points.mjs";
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
const att = ms => pg.waitForTimeout(ms); const cap = async (n, p) => { await (p || pg).screenshot({ path: path.join(OUT, n + '.png') }); };
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
// [C14 404] (C14 400 : « il n'y a plus qu'un seul flux » ; 404) la dernière page donnée, l'écran montre le paquet : ses pages en vignettes, rangées par élève, avec son nom et ses étapes ; plus de passes ni de pinceau
await att(500);
const pq0 = await pg.evaluate(() => { const E = document.getElementById('scanEcran'), S = Array.from(document.querySelectorAll('#scCopie .sc-pq-el:not(.sc-pq-sans)')), vis = s => Array.from(document.querySelectorAll(s)).filter(e => e.offsetParent).length;
  return { vue: E.classList.contains('sc-vue-paquet') && !SC.attrib, eleves: S.map(s => s.querySelector('.sc-pq-nom b').textContent + ':' + s.querySelectorAll('.sc-pq-vig').length), attendu: SC.copies.map(k => nomEleveDe(k) + ':' + scPagesDe(k).length),
    anciens: vis('#scPasses .sc-passe') + vis('#scPanneau') + vis('#scZero') + vis('#scChrono'), titres: Array.from(document.querySelectorAll('.sc-pq-vig')).every(b => (b.title || '').length > 20), img: document.querySelectorAll('.sc-pq-vig img').length }; });
await cap('C14-404-1-le-paquet');
verif('le paquet (C14 404) : la dernière page donnée, l\'écran montre le paquet en vignettes, rangées par élève avec son nom (' + pq0.eleves.join(' · ') + '), ' + pq0.img + ' photos, chaque vignette son infobulle ; plus de passes, de panneau, de chrono ni de remise à zéro (' + pq0.anciens + ')',
  pq0.vue && JSON.stringify(pq0.eleves) === JSON.stringify(pq0.attendu) && pq0.anciens === 0 && pq0.titres && pq0.img >= 7);
{ const k2 = await pg.evaluate(() => SC.copies.find(k => scPagesDe(k).length === 2));
  await pg.locator('#scCopie .sc-pq-el[data-k="' + k2 + '"] .sc-pq-vig').nth(1).click(); await att(900);
  const o4 = await pg.evaluate(k => { const b = rcBloc(RC.page), z = document.getElementById('rcDefile').getBoundingClientRect(), r = b ? b.getBoundingClientRect() : null; return { rc: RC.ouvert, copie: RC.copie === k, page: RC.page === scPagesDe(k)[1].id, vue: !!r && r.top < z.top + z.height / 2 && r.bottom > z.top, nom: nomEleveDe(k) }; }, k2);
  await cap('C14-404-2-recopie-a-sa-page'); await pg.keyboard.press('Escape'); await att(500);
  const o5 = await pg.evaluate(k => ({ rc: RC.ouvert, vue: document.getElementById('scanEcran').classList.contains('sc-vue-paquet'), cour: !!document.querySelector('#scCopie .sc-pq-el.cour[data-k="' + k + '"]') }), k2);
  await pg.keyboard.press('Enter'); await att(300); const o6 = await pg.evaluate(() => ({ rc: RC.ouvert, passe: SC.passe, rep: JSON.stringify(scCopie(scK()).rep || {}) }));
  /* un redessin du paquet (une photo arrivée, le site qui change) ne touche pas au focus : la vignette qui l'avait le garde */
  await pg.locator('#scCopie .sc-pq-el[data-k="' + k2 + '"] .sc-pq-vig').nth(1).focus(); await pg.evaluate(() => { document.getElementById("scCopie").dataset.pq = ""; scRendre(); }); await att(150);
  const foc404 = await pg.evaluate(k => { const a = document.activeElement; return !!a && a.classList.contains("sc-pq-vig") && a.closest(".sc-pq-el").dataset.k === k && Array.from(a.parentNode.children).indexOf(a) === 1; }, k2);
  verif('le paquet (C14 404) : un clic sur la page 2 de ' + o4.nom + ' ouvre sa recopie à cette page (' + [o4.rc, o4.copie, o4.page, o4.vue].join(', ') + ') ; Échap revient au paquet, sa ligne marquée (' + o5.cour + ') ; Entrée n\'y répond à aucune question (' + o6.rep + ') ; un redessin garde le focus sur la vignette (' + foc404 + ')',
    o4.rc && o4.copie && o4.page && o4.vue && !o5.rc && o5.vue && o5.cour && !o6.rc && o6.rep === '{}' && foc404); }
// les copies vierges : la fenêtre d'impression
const pop = ctx.waitForEvent('page'); await pg.click('#scanEcran .sc-haut >> text=🖨 Copies vierges'); const fen = await pop; await fen.waitForLoadState(); await att(400);
verif('les copies vierges : ' + await fen.locator('.p svg').count() + ' pages à imprimer, quatre repères chacune', await fen.locator('.p svg').count() >= 30 && await fen.locator('.p').first().locator('rect[fill="#000"]').count() === 4); await fen.close();
// le rechargement : les marques reviennent par leur identité, le paquet est resté dans le navigateur
const avant = await pg.evaluate(() => SC.copies.map(k => Object.values(scCopie(k).marques).map(m => m.forme).join('+')).join(' | ')); await att(1500); console.log((await pg.evaluate(() => window.__LOG)).join('\n')); console.log('HUB ARNAUD : ' + await pg.evaluate(() => fetch(ruUrl(ruCheminCopies().concat(SC.copies[1]))).then(r => r.json()).then(v => JSON.stringify(v && v.scan && Object.keys(v.scan.marques || {}).length) + ' · état : ' + Object.keys(scCopie(SC.copies[1]).marques).length + ' · sig ' + !!RU.sig[SC.copies[1]] + ' · test ' + RU.test)));
const horo = () => pg.evaluate(() => { const H = JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('mjpc_maquette_T399_hub_')))); const c = H.redactions.sujet_mvtd85g7_ycxjq3.copies || {}; const t = {}; Object.keys(c).forEach(cl => Object.keys(c[cl] || {}).forEach(e => { t[cl + '/' + e] = c[cl][e].modifieLe; })); return t; });
const horoAvant = await horo();
await pg.reload(); await att(3500);
const horoApres = await horo(); const bouges = Object.keys(horoApres).filter(k => horoApres[k] !== horoAvant[k]);
verif('rouvrir la classe ne réécrit aucune copie (' + Object.keys(horoApres).length + ' copies, ' + bouges.length + ' horodatage changé)', bouges.length === 0);   /* [C14 404] une copie jamais touchée ne s'écrit pas */
const ou2 = await pg.evaluate(() => SC.ouvert ? (document.getElementById('scanEcran').classList.contains('sc-vue-paquet') ? 'le paquet' : 'les initiales') : 'écran fermé');
verif('reprise exacte : rechargée, la page rouvre l\'écran des scans, sur le paquet (' + ou2 + ')', ou2 === 'le paquet');
const n2 = await pg.evaluate(() => ({ m: SC.copies.reduce((a, k) => a + Object.keys(scCopie(k).marques).length, 0), img: Object.keys(SC.imgs).length, man: scManquantes().length, orig: Object.keys(SC.origs).length }));
const apresR = await pg.evaluate(() => SC.copies.map(k => Object.values(scCopie(k).marques).map(m => m.forme).join('+')).join(' | ')); console.log('avant : ' + avant + '\naprès : ' + apresR);
verif('après rechargement : ' + n2.img + ' images gardées par le navigateur (et ' + n2.orig + ' photos entières, pour retoucher), ' + n2.man + ' manquante', n2.img >= 8 && n2.orig >= 8 && n2.man === 0);
// le fichier de l'élève
await pg.click('#scanEcran .sc-haut >> text=📨 Fichiers École Directe'); await att(400); await cap('05-fichiers-ed');
const dl = pg.waitForEvent('download'); await pg.click('.sc-table tr >> nth=1 >> text=Télécharger'); const d = await dl; const f = path.join(OUT, 'fichier-eleve.html'); await d.saveAs(f);
const html = fs.readFileSync(f, 'utf8'); verif('le fichier élève porte sa photo (' + Math.round(html.length / 1024) + ' Ko) et ne joint jamais le vrai hub en maquette', /data:image\/jpeg;base64/.test(html) && /"test":true/.test(html));
// 1463 : le fichier de l'élève en lecture seule : il clique tes marques et sa grille, il n'écrit rien ; la coche de la correction par l'élève est grisée
const coche = await pg.evaluate(() => { const c = document.querySelector('.sc-coche input:not(#scNoteEleve)'); return c ? { off: c.disabled && !c.checked, dit: c.closest('label').textContent.replace(/\s+/g, ' ').trim() } : null; });
verif('la coche « Ouvrir la correction par l\'élève » est là, grisée, décochée, et dit pourquoi (« ' + (coche && coche.dit.slice(0, 60)) + '… »)', coche && coche.off && /pas encore codée/.test(coche.dit));
await pg.bringToFront(); await pg.keyboard.press('Escape'); await att(300);
// les copies vierges de l'appli : scannées de travers, remises droites, lignes connues
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-reperes.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 10, null, { timeout: 60000 }); await att(600);
const rp = await pg.evaluate(() => scPagesOrdre().slice(-2).map(p => (p.lignes.reperes ? 'repères' : 'sans') + ':' + p.lignes.n + ':' + p.w + 'x' + p.h));
verif('les copies à repères se remettent droites, lignes connues : ' + rp.join(' · '), rp.length === 2 && rp.every(x => x.startsWith('repères')) && /:24:/.test(rp[0]) && /:17:/.test(rp[1]));
verif('les initiales reprennent à la première page sans élève', await pg.evaluate(() => SC.attrib && !scPagesOrdre()[SC.ia].eleve)); await cap('11-copie-a-reperes');
await pg.keyboard.type('tb'); await pg.keyboard.press('Enter'); await att(200); await pg.keyboard.type('rc'); await pg.keyboard.press('Enter'); await att(400);
for (const [w, h] of [[1366, 768], [1920, 1080]]) { await pg.setViewportSize({ width: w, height: h }); await att(400); await cap('12-ecran-' + w + 'x' + h); }
await pg.setViewportSize({ width: 1536, height: 864 });
// sans interactivité (un téléphone qui n'exécute pas la pièce jointe) : la copie et les marques se voient
const p2 = await (await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } })).newPage(); await p2.goto('file://' + f); await att(500);
verif('sans interactivité, la copie se voit (' + await p2.locator('#statique img').count() + ' page)', await p2.locator('#statique img').count() >= 1);
await p2.screenshot({ path: path.join(OUT, '10-eleve-sans-interactivite.png') });
// le mode test de MJPC (?test=1, comme l'ouvre le portail en mode test) : la correction et les retours restent dans la page, rien au hub
const pt = await ctx.newPage(); pt.on('pageerror', e => err.push('test : ' + e.message));
await pt.goto('file://' + MAQ + '?mode=prof&id=sujet_mvtd85g7_ycxjq3&classe=3_franklin_aretha&test=1'); await att(2500);
const avantT = await pt.evaluate(() => JSON.stringify(window.__hubTest = null) && fetch(ruUrl(ruCheminCopies())).then(r => r.json()).then(v => JSON.stringify(v).length));
if (!(await pt.evaluate(() => SC.ouvert))) { await pt.click('#btnScan'); } await att(1500); if (await pt.evaluate(() => SC.attrib)) { await pt.keyboard.type('rc'); await att(150); await pt.keyboard.press('1'); await att(400); }
await pt.locator('#scCopie .sc-pq-vig').first().click(); await att(900);   /* [C14 404] une ligne recopiée, en mode test */
await pt.locator('.rc-saisie').first().click(); await pt.keyboard.type('essai'); await pt.keyboard.press('Enter'); await att(1600);
const t2 = await pt.evaluate(() => ({ test: RU.test, ecrits: RU.ecritsTest.length, temoin: (document.getElementById('ruTemoin') || {}).textContent || '' }));
const apresT = await pg.evaluate(() => fetch(ruUrl(["redactions", "sujet_mvtd85g7_ycxjq3", "copies", "3_franklin_aretha"])).then(r => r.json()).then(v => JSON.stringify(v).length));
verif('mode test de MJPC : la ligne recopiée reste dans la page (' + t2.ecrits + ' écritures gardées, témoin « ' + t2.temoin.slice(0, 28) + ' »), rien au hub', t2.test && t2.ecrits >= 1 && apresT === avantT);
await pt.close();
// les couches ne se chevauchent pas : le « ? » de l'app, son témoin, et l'écran des scans, aux trois tailles
await pg.mouse.move(700, 400); await pg.mouse.wheel(0, -20000); await att(300);   /* [C14 404] le paquet en haut : en défilant, les cartes passent sous le témoin, qui reste fixe */
const chev = []; for (const [w, h] of [[1366, 768], [1536, 864], [1920, 1080]]) { await pg.setViewportSize({ width: w, height: h }); await att(300);
  chev.push(...await pg.evaluate(({ w, h }) => { const R = e => e && e.getBoundingClientRect(); const x = (a, b) => a && b && a.width && b.width && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    const app = [document.querySelector('.rp-aide-btn'), document.getElementById('ruTemoin')].map(R); const moi = Array.from(document.querySelectorAll('#scanEcran .sc-haut button, #scanEcran .sc-haut label, #scanEcran .sc-passe, #scanEcran .sc-bloc, #scChrono, #scCopie .sc-pq-el')).map(R);
    const L = []; app.forEach((a, i) => moi.forEach((b, j) => { if (x(a, b)) L.push(w + 'x' + h + ' ' + ['?', 'témoin'][i] + '/' + j + ' [' + [a, b].map(r => Math.round(r.left) + ',' + Math.round(r.top) + '-' + Math.round(r.right) + ',' + Math.round(r.bottom)).join(' ') + ']'); })); return L; }, { w, h })); }
await pg.setViewportSize({ width: 1536, height: 864 }); verif('aucun chevauchement avec le « ? » et le témoin de l\'app, à 1366, 1536 et 1920 (' + (chev.join(', ') || 'aucun') + ')', chev.length === 0);
// le fichier réel, celui d'École Directe : il ne joint jamais le site (lecture seule), et se lit sans recharger
const reel = await pg.evaluate(() => { const fh = window.__FAUX_HUB; window.__FAUX_HUB = false; const t = RU.test; RU.test = false; const p = scEleveFichier(SC.copies[0], false); window.__FAUX_HUB = fh; RU.test = t; return p.then(f => f.html); });
const fr2 = path.join(OUT, 'fichier-eleve-reel.html'); fs.writeFileSync(fr2, reel);
const ctx2 = await b.newContext({ viewport: { width: 1536, height: 864 } }); const appels = []; ctx2.on('request', q => { if (!/^(file|data|blob):/.test(q.url())) appels.push(q.url()); });
const pr = await ctx2.newPage(); await pr.goto('file://' + fr2); await att(900); await pr.locator('#passer').click(); await att(400);
const vuR = await pr.evaluate(() => ({ img: document.querySelectorAll('#col img, #statique img').length, test: /Mode test/.test(document.body.innerText) }));   /* [C14 404] sa grille arrive avec les stickers (éprouvée plus loin) */
verif('le fichier réel de l\'élève se lit seul : sa copie (' + vuR.img + ' page), aucun appel au site ni ailleurs (' + appels.length + ')', vuR.img >= 1 && !vuR.test && appels.length === 0);
await ctx2.close();
await pg.bringToFront(); if (await pg.evaluate(() => SC.attrib)) { await pg.click('#scInit'); await pg.keyboard.press('1'); await att(500); }   // la page à repères laissée en suspens plus haut : « rc » désigne deux élèves, le chiffre 1 choisit
{ const k1 = await pg.evaluate(() => SC.copies[1]); await pg.locator('#scCopie .sc-pq-el[data-k="' + k1 + '"] .sc-pq-vig').first().click(); await att(600); await pg.keyboard.press('Escape'); await att(400); }   // la suite part de la 2e copie, comme avant (là où l'ancien récapitulatif laissait l'écran)
verif('aucune écriture sur une classe entière (une clé de copie vide)', !(await pg.evaluate(() => window.__LOG || [])).some(l => /^\w+ [^/]+\.json/.test(l)));
await eprouverStickersReglages({ pg, verif, cap, att, dir: DIR });   // [C14 1.4.18] (C14 565) le sujet complet avant tout export
await eprouverRecopie({ pg, verif, cap, att, dir: DIR, out: OUT });
await eprouverDettes115({ pg, verif, cap, att });
await eprouverAccueil({ pg, verif, cap, att });
await eprouverAutreOrdinateur({ pg, verif, cap, att, dir: DIR });
await eprouverDossierMele({ pg, verif, cap, att, dir: DIR });   // [C14 1.4.28] (Paul 18:45, C14 55) une classe mêlée : des feuilles d'avant la 1.4.13 retrouvées par leur image
await eprouverAbsent({ pg, verif, cap, att });
await eprouverStickers({ pg, verif, cap, att, dir: DIR, out: OUT });
await eprouverBilan({ pg, verif, cap, att });   // [C14 406] après les stickers : des copies corrigées avec eux
await eprouverSauvegarde({ pg, verif, cap, att });
await eprouverEcho({ pg, verif, cap, att });   // [C14 1.4.27] (Paul 16:53) l'écho du site
await eprouverEnlever({ pg, verif, cap, att });   // [C14 710] (Paul 14:09) un sticker enlevé de la grille
await eprouverEffacer({ pg, verif, cap, att });   // [C14 669] (Paul 12:46) la classe vidée de ses corrigés, la recopie intacte   // [C14] (Paul 13:12) la sauvegarde, plus haut, marque absents tous les élèves sauf un
await eprouverReprendre({ pg, verif, cap, att });   // [C14 1.4.28] (Paul 20:37, C14 66-71) après un changement, seul ce qui a changé repart et s'arrête
await eprouverBandeSuite({ pg, verif, cap, att });   // [C14 1.4.28] (Paul 20:37, C14 72-73) « ▶ La bande », copie après copie
await eprouverPoints({ pg, verif, cap, att });   // [C14 1.4.29] (Paul 22:33, 22:41 ; C14 80-81) les points de la grille, la note dans les fichiers des élèves
verif('aucune erreur, aucune boîte, aucun appel au vrai hub', err.length === 0);
} catch (e) { console.log(ok.join('\n')); console.log('ARRÊT : ' + String(e.message).split('\n')[0]); console.log(err.join('\n')); await cap('zz-arret'); process.exit(1); }
console.log(ok.join('\n')); if (err.length) console.log('ERREURS\n' + err.join('\n'));
const echec = ok.some(x => x.startsWith('✗')) || err.length > 0;
console.log(echec ? 'BANC : ÉCHEC' : 'BANC : ' + ok.length + ' vérifications, 0 défaut'); await b.close();
if (echec) process.exitCode = 1;
