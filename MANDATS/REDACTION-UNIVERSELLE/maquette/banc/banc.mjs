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
await pg.setInputFiles('#scanEcran input[type=file]', path.join(DIR, 'paquet-essai.pdf')); await pg.waitForFunction(() => Object.keys(SC.pages).length >= 8, null, { timeout: 60000 }); await att(800);
const blanches = await pg.evaluate(() => Object.values(SC.pages).filter(p => p.blanche).length); verif('8 pages lues, la page blanche reconnue (' + blanches + ')', blanches === 1);
const lig = await pg.evaluate(() => scPagesOrdre().map(p => p.lignes.n)); verif('lignes trouvées par page : ' + lig.join(','), lig[0] >= 20);
await cap('01-initiales');
for (const ini of ['ec', 'la', 'mb', '', 'tb', 'gc', 'rb']) { await pg.keyboard.type(ini); await att(150); await pg.keyboard.press('Enter'); await att(250); }
const cps = await pg.evaluate(() => SC.copies.map(k => nomEleveDe(k) + ':' + scPagesDe(k).length)); verif('6 copies dans l\'ordre du paquet : ' + cps.join(' · '), cps.length === 6 && cps[2].endsWith(':2'));
verif('la dernière page donnée, la correction commence d\'elle-même (passe 1, copie 1)', await pg.evaluate(() => !SC.attrib && SC.passe === 0 && SC.ic === 0)); await att(300);
// passe 1, la langue : souligner « écrit » (ligne 3), taper la bonne forme ; une deuxième faute reprise par son numéro sur la copie suivante
const boite = async () => pg.locator('.sc-page').first().boundingBox();
const tracer = async (x0, y0, x1, y1) => { const r = await boite(); await pg.mouse.move(r.x + x0 * r.width, r.y + y0 * r.height); await pg.mouse.down(); await pg.mouse.move(r.x + x1 * r.width, r.y + y1 * r.height, { steps: 6 }); await pg.mouse.up(); await att(250); };
await tracer(0.25, 0.175, 0.33, 0.185); await pg.keyboard.type('écris'); await att(100); await cap('02-langue-faute'); await pg.keyboard.press('Enter'); await att(200);
await pg.click('text=★ La phrase qui t\'a touché'); await tracer(0.14, 0.28, 0.6, 0.33);
const m1 = await pg.evaluate(() => Object.values(scCopie(scK()).marques).map(m => m.forme + ':' + (m.bonne || '') + ':' + m.l0 + '-' + m.l1));
verif('une faute soulignée avec sa bonne forme, une phrase dorée sur deux lignes : ' + m1.join(' '), m1.some(x => x.startsWith('faute:écris')) && m1.some(x => x.startsWith('etoile')));
await pg.keyboard.press('Enter'); await att(150); await pg.keyboard.press('Enter'); await pg.keyboard.press('n'); await pg.keyboard.press('Enter'); await att(400);
verif('après la langue, la copie suivante arrive', await pg.evaluate(() => SC.ic === 1));
await tracer(0.25, 0.175, 0.33, 0.185); await pg.keyboard.type('1'); await pg.keyboard.press('Enter'); await att(200);
verif('le numéro 1 reprend « écris »', await pg.evaluate(() => scFautes(scK())[0].bonne === 'écris'));
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
verif('deux verbes encadrés : la case se compte (' + cp + ')', /^3 · 1 Plusieurs de tes verbes/.test(cp));
// les copies vierges : la fenêtre d'impression
const pop = ctx.waitForEvent('page'); await pg.click('text=🖨 Copies vierges'); const fen = await pop; await fen.waitForLoadState(); await att(400);
verif('les copies vierges : ' + await fen.locator('.p svg').count() + ' pages à imprimer, quatre repères chacune', await fen.locator('.p svg').count() >= 30 && await fen.locator('.p').first().locator('rect[fill="#000"]').count() === 4); await fen.close();
// le rechargement : les marques reviennent par leur identité, le paquet est resté dans le navigateur
const avant = await pg.evaluate(() => SC.copies.map(k => Object.values(scCopie(k).marques).map(m => m.forme).join('+')).join(' | ')); await att(1500); console.log((await pg.evaluate(() => window.__LOG)).join('\n')); console.log('HUB ARNAUD : ' + await pg.evaluate(() => fetch(ruUrl(ruCheminCopies().concat(SC.copies[1]))).then(r => r.json()).then(v => JSON.stringify(v && v.scan && Object.keys(v.scan.marques || {}).length) + ' · état : ' + Object.keys(scCopie(SC.copies[1]).marques).length + ' · sig ' + !!RU.sig[SC.copies[1]] + ' · test ' + RU.test))); await pg.reload(); await att(2500); await pg.click('#btnScan'); await att(1500);
const n2 = await pg.evaluate(() => ({ m: SC.copies.reduce((a, k) => a + Object.keys(scCopie(k).marques).length, 0), img: Object.keys(SC.imgs).length, man: scManquantes().length }));
const apresR = await pg.evaluate(() => SC.copies.map(k => Object.values(scCopie(k).marques).map(m => m.forme).join('+')).join(' | ')); console.log('avant : ' + avant + '\naprès : ' + apresR);
verif('après rechargement : ' + n2.m + ' marques, ' + n2.img + ' images gardées par le navigateur, ' + n2.man + ' manquante', n2.m >= 6 && n2.img >= 8 && n2.man === 0);
// le fichier de l'élève
await pg.click('text=📨 Fichiers École Directe'); await att(400); await cap('05-fichiers-ed');
const dl = pg.waitForEvent('download'); await pg.click('.sc-table tr >> nth=1 >> text=Télécharger'); const d = await dl; const f = path.join(OUT, 'fichier-eleve.html'); await d.saveAs(f);
const html = fs.readFileSync(f, 'utf8'); verif('le fichier élève porte sa photo (' + Math.round(html.length / 1024) + ' Ko) et ne joint jamais le vrai hub en maquette', /data:image\/jpeg;base64/.test(html) && /"test":true/.test(html));
const popE = ctx.waitForEvent('page'); await pg.click('.sc-table tr >> nth=1 >> text=Tester comme l\'élève'); const el = await popE; await el.waitForLoadState(); await el.setViewportSize({ width: 1536, height: 864 }); await att(1500);
const fr = el; await el.screenshot({ path: path.join(OUT, '06-eleve-traversee.png') }); await fr.locator('#passer').click(); await att(600);
await fr.locator('#rep').fill('écrit'); await fr.locator('#ok').click(); await att(300); const ko = await fr.locator('#msg').innerText();
await fr.locator('#rep').fill('écris'); await fr.locator('#ok').click(); await att(500);
verif('l\'élève corrige sa faute dans son onglet de test : faux puis juste', ko.includes('✗'));
await el.screenshot({ path: path.join(OUT, '07-eleve-parcours.png') });
let pap = 0; let questions = 0; for (let i = 0; i < 30; i++) { if (!(await fr.locator('#ok').count())) break; if (await fr.locator('#rq').count()) { if (!questions) await el.screenshot({ path: path.join(OUT, '07b-eleve-question.png') }); await fr.locator('#rq').fill('Je suis Pierre, dans la tranchée, et j\'écris à Louise.'); questions++; await fr.locator('#ok').click(); await att(250); continue; } const t = fr.locator('#pap'); if (await t.count()) { await t.fill('Je suis dans la tranchée de Vauquois depuis le mois de février, avec les hommes de ma compagnie.'); pap++; } await fr.locator('#ok').click(); await att(250); }
await el.screenshot({ path: path.join(OUT, '08-eleve-papillon.png') });
verif('l\'élève répond à la question avant de voir chaque case (' + questions + ') et écrit ses papillons (' + pap + ')', questions >= 3 && pap >= 1);
await pg.bringToFront(); await att(500); await pg.click('.sc-passe >> nth=4'); await att(500); await cap('09-retours');
verif('les retours de l\'onglet de test arrivent sans recharger (' + await pg.evaluate(() => scRetoursListe().length) + ')', await pg.evaluate(() => scRetoursListe().length) >= 1);
const nr = await pg.evaluate(() => scRetoursListe().length);
await pg.fill('#scARefaire', 'Relis ta tâche, et écris-la de nouveau.'); await pg.click('.sc-nom'); await att(300);
verif('ta phrase de « à refaire » s\'enregistre au sujet', await pg.evaluate(() => fetch(ruUrl(["redactions", RU.id, "config", "aRefaire"])).then(r => r.json())) === 'Relis ta tâche, et écris-la de nouveau.');
await pg.keyboard.press('n'); await att(500);
verif('ton « à refaire » arrive dans l\'onglet de l\'élève, avec ta phrase', (await el.locator('.ko').count()) >= 1 && (await el.locator('#pan').innerText()).includes('Relis ta tâche'));
await el.screenshot({ path: path.join(OUT, '09b-eleve-a-refaire.png') });
const et = await pg.evaluate(() => Object.values(SC.retours).reduce((a, R) => a.concat(Object.values(R)), []).filter(r => r.etat === 'arefaire').length);
verif('les retours arrivent chez Paul (' + nr + ') ; N : à refaire', nr >= 1 && et === 1);
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
await pt.click('#btnScan'); await att(1500); if (await pt.evaluate(() => SC.attrib)) { await pt.keyboard.type('rc'); await att(150); await pt.keyboard.press('1'); await att(400); }
await pt.click('.sc-vig >> nth=0'); await att(400);
const r2 = await pt.locator('.sc-page').first().boundingBox(); await pt.mouse.move(r2.x + 0.3 * r2.width, r2.y + 0.5 * r2.height); await pt.mouse.down(); await pt.mouse.move(r2.x + 0.38 * r2.width, r2.y + 0.51 * r2.height, { steps: 4 }); await pt.mouse.up(); await att(200); await pt.keyboard.type('essai'); await pt.keyboard.press('Enter'); await att(1600);
const t2 = await pt.evaluate(() => ({ test: RU.test, ecrits: RU.ecritsTest.length, temoin: (document.getElementById('ruTemoin') || {}).textContent || '' }));
const apresT = await pg.evaluate(() => fetch(ruUrl(["redactions", "sujet_mvtd85g7_ycxjq3", "copies", "3_franklin_aretha"])).then(r => r.json()).then(v => JSON.stringify(v).length));
verif('mode test de MJPC : la faute posée reste dans la page (' + t2.ecrits + ' écritures gardées, témoin « ' + t2.temoin.slice(0, 28) + ' »), rien au hub', t2.test && t2.ecrits >= 1 && apresT === avantT);
await pt.close();
verif('aucune écriture sur une classe entière (une clé de copie vide)', !(await pg.evaluate(() => window.__LOG || [])).some(l => /^\w+ [^/]+\.json/.test(l)));
verif('aucune erreur, aucune boîte, aucun appel au vrai hub', err.length === 0);
} catch (e) { console.log(ok.join('\n')); console.log('ARRÊT : ' + String(e.message).split('\n')[0]); console.log(err.join('\n')); await cap('zz-arret'); process.exit(1); }
console.log(ok.join('\n')); if (err.length) console.log('ERREURS\n' + err.join('\n'));
console.log(ok.filter(x => x.startsWith('✗')).length ? 'BANC : ÉCHEC' : 'BANC : ' + ok.length + ' vérifications, 0 défaut'); await b.close();
