// (p8-5c) la répétition propre, les notes de présentateur, la mise en forme — par la souris et le clavier (complément p8-5c, points 15 à 21) :
// 15 la répétition à 1280 et 1920 px (aucun position:fixed ajouté, Tableau / Écran 2 / Arrêter sous le doigt, « Fin de l'heure » absent, Tableau bascule, Arrêter rétablit) ;
// 16 les notes en lecture (heure lancée, ▶ ×3 puis ◀) ; 17 les notes en écriture (Entrée, réaccrocher, recharger, couper, supprimer, taper pendant le redessin) ;
// 18 la mise en forme au tableau ; 19 la mise en forme dans les notes ; 20 la barre tient ; 21 les 20 gestes de T39, portés sur « ab » et « A ».
// La référence « avant » (captures de la répétition, largeur de la barre) : la maquette p8-5, MJPC_AVANT (défaut ../p8-5/maquette-pilotage-ordi-v9c15p8-manipulable.html).
import { chromium, CHROMIUM, MAQUETTE, LIVRAISON, capture } from './env.mjs';
import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const AVANT_F = path.resolve(LIVRAISON, process.env.MJPC_AVANT || '../p8-5/maquette-pilotage-ordi-v9c15p8-manipulable.html'); const AVANT = pathToFileURL(AVANT_F).href;
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const errs = []; const boites = []; const D = []; const MES = []; const ok = (c, m) => { if (!c) D.push(m); };
const ouvrir = async (url, w = 1280, h = 800) => { const ctx = await nav.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage(); pg.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); }); await pg.goto(url); await pg.waitForTimeout(600); return { ctx, pg }; };
const atelier = async pg => { await pg.click('#edt-cases [data-atelier="1"]'); await pg.waitForTimeout(500); if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); } };
const lancer = async pg => { await pg.click('#edt-cases [data-lancer="1"]'); await pg.waitForTimeout(500); };
const allerA = async (pg, i) => { await pg.click('#volet .at-chap .d[data-at-di="' + i + '"]'); await pg.waitForTimeout(450); };
const fixes = pg => pg.evaluate(() => Array.from(document.querySelectorAll('*')).filter(x => getComputedStyle(x).position === 'fixed').map(x => x.id || x.className).sort().join(','));
const sousLeDoigt = (pg, id) => pg.evaluate(id => { const b = document.getElementById(id); const r = b.getBoundingClientRect(); if (!r.width) return false; const x = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!x && (x === b || b.contains(x)); }, id);
// sélectionner un mot (une plage de texte) dans un élément, comme à la souris
const selectionner = (pg, sel, mot) => pg.evaluate(([sel, mot]) => { const el = document.querySelector(sel); if (!el) return false; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const k = n.textContent.indexOf(mot); if (k >= 0) { const r = document.createRange(); r.setStart(n, k); r.setEnd(n, k + mot.length); const s = getSelection(); s.removeAllRanges(); s.addRange(r); return true; } } return false; }, [sel, mot]);
const former = async (pg, bouton, c) => { await pg.click('#' + bouton); await pg.waitForTimeout(120); await pg.click('#' + (bouton === 'bsurl' ? 'pal-surl' : 'pal-txt') + ' ' + (c ? '[data-c="' + c + '"]' : '.p8-aucune')); await pg.waitForTimeout(200); };
const rgb = hx => `rgb(${parseInt(hx.slice(1,3),16)}, ${parseInt(hx.slice(3,5),16)}, ${parseInt(hx.slice(5,7),16)})`;
// écrire un paragraphe de note : un clic sur l'élément de la diapo (le curseur y est), un clic au bout de la dernière note, Entrée, la frappe
const noteApres = async (pg, p, txt) => { if (p) { await pg.click('#mur [data-p="' + p + '"]'); await pg.waitForTimeout(150); } const n = await pg.$$eval('#notesd .p8-mt', l => l.length); await pg.click('#notesd .p8-mt[data-p8n="' + (n - 1) + '"]'); await pg.keyboard.press('Control+End'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(200); await pg.keyboard.type(txt, { delay: 8 }); await pg.waitForTimeout(150); };
const panneau = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#notesd .p8-mn')).filter(x => getComputedStyle(x).display !== 'none').map(x => ({ k: x.querySelector('.p8-k').textContent, vif: x.classList.contains('p8-vif'), fait: x.classList.contains('p8-fait'), op: getComputedStyle(x).opacity, coul: getComputedStyle(x).color, kc: getComputedStyle(x.querySelector('.p8-k')).color, txt: x.querySelector('.p8-mt').textContent })));
// le ⌂ de la diapo 1 : la note d'avant (une chaîne, rangée « 0|0 » dans les données), lue comme un paragraphe sans ancre
const AVANT0 = 'Dire que le tableau des trois colonnes est au brouillon';
const NOTES = [[null, AVANT0], ['0.0', '5 min montre en main. Si ça parle, rappeler : on regarde, on ne dit rien.'], ['0.2', 'Tableau à trois colonnes au brouillon — passer dans les rangs, repérer deux ou trois formulations.'], ['0.4', 'Attendu : « nature », « solitude », « sublime » — ne pas les donner. Noter qui les trouve.'], ['0.5', 'Trois ou quatre élèves à l’oral, pas plus. Enchaîner sur la diapo 2 sans conclure.']];

// ═══ 15. la répétition, à 1280 et à 1920 px
ok(fs.existsSync(AVANT_F), 'la maquette de référence « avant » (p8-5) est introuvable : ' + AVANT_F);
if (fs.existsSync(AVANT_F)) { const { ctx, pg } = await ouvrir(AVANT); await atelier(pg); await pg.click('#at-jouer'); await pg.waitForTimeout(600); await pg.click('#bdev'); await pg.waitForTimeout(150); await pg.screenshot({ path: capture('p8-5c-repetition-avant.png') });
  const t = await sousLeDoigt(pg, 'btableau'), e2 = await sousLeDoigt(pg, 'bvideoproj'); MES.push('p8-5c-repetition-avant.png · p8-5, 1280 px : le bandeau posé par-dessus l\'entête ; ⧉ Tableau sous le doigt : ' + t + ', 🖥 Écran 2 sous le doigt : ' + e2); await ctx.close(); }
for (const w of [1280, 1920]) {
  const { ctx, pg } = await ouvrir(MAQUETTE, w, w === 1280 ? 800 : 1080); await atelier(pg); const f0 = await fixes(pg); const h0 = await pg.evaluate(() => { const h = document.querySelector('.haut'); return getComputedStyle(h).backgroundColor + '|' + h.className; });
  await pg.click('#at-jouer'); await pg.waitForTimeout(600); await pg.click('#bdev'); await pg.waitForTimeout(1300);
  const f1 = await fixes(pg); ok(f1 === f0, w + ' px : la répétition ajoute un élément en position:fixed : ' + f0 + ' → ' + f1);
  const R = await pg.evaluate(() => { const h = document.querySelector('.haut'); const vis = id => { const x = document.getElementById(id); return !!x && x.getClientRects().length > 0 && getComputedStyle(x).display !== 'none'; }; const pre = h.querySelector('.p8-rep-pre'), chr = h.querySelector('.p8-rep-chr'); const ong = h.querySelector('.onglets'); return { classe: h.classList.contains('p8-rep'), fond: getComputedStyle(h).backgroundColor, filet: getComputedStyle(h).borderBottomColor, pre: pre && getComputedStyle(pre).display !== 'none' ? pre.textContent : null, avantOnglets: !!pre && pre.nextElementSibling === ong, chr: chr && getComputedStyle(chr).display !== 'none' ? chr.textContent.replace(/\s+/g, ' ').trim() : null, apresHeure: !!chr && chr.previousElementSibling && !!chr.previousElementSibling.querySelector('#heure'), bfin: vis('bfin'), stop: vis('rep-stop'), bandeau: !!document.getElementById('rep-bandeau') || !!document.getElementById('rep-etat'), enLigne: Array.from(document.querySelectorAll('.haut [style*="display"]')).map(x => x.id || x.className) }; });
  ok(R.classe && R.fond === 'rgb(36, 28, 16)' && R.filet === 'rgb(201, 154, 78)', w + ' px : l\'entête de répétition n\'a pas sa classe, son fond #241c10 et son filet #c99a4e : ' + JSON.stringify(R));
  ok(R.pre === 'RÉPÉTITION ·' && R.avantOnglets, w + ' px : « RÉPÉTITION · » n\'est pas devant les onglets');
  ok(/^· répét\. 00:0[0-9] · diapo 1, dévoilée 1 \/ 6$/.test(R.chr || '') && R.apresHeure, w + ' px : le chrono n\'est pas après l\'heure, au format « · répét. mm:ss · diapo X, dévoilée Y / Z » : ' + R.chr);
  ok(!R.bfin && R.stop && !R.bandeau && !R.enLigne.length, w + ' px : « Fin de l\'heure » visible, ou « ■ Arrêter » absent, ou un bandeau, ou un display en ligne : ' + JSON.stringify(R));
  const deb = await pg.evaluate(() => Math.round(Math.max(...Array.from(document.querySelector('.haut').children).map(x => x.getBoundingClientRect().right)) - innerWidth)); ok(deb <= 0, w + ' px : l\'entête de répétition déborde de ' + deb + ' px (⚙ rogné)');
  for (const id of ['btableau', 'bvideoproj', 'rep-stop']) ok(await sousLeDoigt(pg, id), w + ' px : elementFromPoint au centre de #' + id + ' ne rend pas le bouton');
  const v0 = await pg.evaluate(() => !!S.vueTableau); await pg.click('#btableau'); await pg.waitForTimeout(300); const v1 = await pg.evaluate(() => !!S.vueTableau); ok(v1 !== v0, w + ' px : en répétition, ⧉ Tableau ne bascule pas la vue');
  if (w === 1280) { await pg.screenshot({ path: capture('p8-5c-repetition-apres.png') }); MES.push('p8-5c-repetition-apres.png · p8-5c, 1280 px : ' + R.pre + ' … ' + R.chr + ' ; aucun bandeau ; ⧉ Tableau, 🖥 Écran 2, ■ Arrêter sous le doigt'); }
  await pg.click('#btableau'); await pg.waitForTimeout(200);
  const [fen] = await Promise.all([ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null), pg.click('#bvideoproj')]); ok(!!fen, w + ' px : en répétition, 🖥 Écran 2 n\'ouvre pas la fenêtre du tableau'); if (fen) await fen.close();
  await pg.click('#rep-stop'); await pg.waitForTimeout(600);
  const A = await pg.evaluate(() => { const h = document.querySelector('.haut'); return { rep: !!S.repetition, at: !!S.atelier, fond: getComputedStyle(h).backgroundColor + '|' + h.className, pre: getComputedStyle(h.querySelector('.p8-rep-pre')).display, chr: getComputedStyle(h.querySelector('.p8-rep-chr')).display, stop: getComputedStyle(document.getElementById('rep-stop')).display }; });
  ok(!A.rep && A.at && A.fond === h0 && A.pre === 'none' && A.chr === 'none' && A.stop === 'none', w + ' px : « ■ Arrêter » ne rétablit pas l\'entête : ' + JSON.stringify(A) + ' / avant : ' + h0);
  ok(await fixes(pg) === f0, w + ' px : après l\'arrêt, la liste des éléments en position:fixed a changé');
  MES.push('15 · ' + w + ' px : position:fixed avant = après (' + f0 + ') ; « Fin de l\'heure » caché ; ⧉ Tableau ' + v0 + ' → ' + v1 + ' ; « ■ Arrêter » rend « ' + A.fond.split('|')[0] + ' »');
  await ctx.close();
}

// ═══ 16. les notes en lecture : posées dans l'atelier (⌂, 1, 3, 5, 6), lues heure lancée
{ const { ctx, pg } = await ouvrir(MAQUETTE); await atelier(pg); const key = await pg.evaluate(() => cle());
  const P0 = await panneau(pg); ok(P0.length === 1 && P0[0].k === '⌂' && P0[0].txt.startsWith(AVANT0), 'la note d\'avant (une chaîne) ne se lit pas comme un paragraphe ⌂ : ' + JSON.stringify(P0));
  MES.push('16 · la note d\'avant de la diapo 1, une chaîne rangée « 0|0 » : lue comme le paragraphe ⌂ « ' + (P0[0] ? P0[0].txt.slice(0, 60) : '—') + '… »');
  for (const [p, t] of NOTES.slice(1)) await noteApres(pg, p, t);
  const L = await pg.evaluate(k => DATA.notes[k], key);
  ok(JSON.stringify((L || []).map(n => n.p)) === JSON.stringify(NOTES.map(n => n[0])) && (L || []).every((n, i) => i ? n.html.replace(/&amp;/g, '&') === NOTES[i][1] : n.html.replace(/&#39;/g, "'").startsWith(AVANT0)), 'les cinq notes posées dans l\'atelier ne sont pas dans la trame, accrochées à ⌂, 1, 3, 5, 6 : ' + JSON.stringify(L));
  ok(JSON.stringify((await panneau(pg)).map(x => x.k)) === '["⌂","1","3","5","6"]', 'le panneau de l\'atelier ne montre pas les repères ⌂, 1, 3, 5, 6');
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(400); await lancer(pg);
  const j0 = await pg.evaluate(() => J.length); const c0 = await pg.evaluate(() => JSON.stringify(S.copie || {}));
  for (let i = 0; i < 3; i++) { await pg.click('#bdev'); await pg.waitForTimeout(150); }
  let P = await panneau(pg); const foc = await pg.evaluate(() => document.getElementById('notesd').contains(document.activeElement));
  ok(P.length === 5 && P[2].vif && P[2].k === '3' && P.filter(x => x.vif).length === 1, 'heure lancée, ▶ ×3 : le paragraphe vif n\'est pas le 3 : ' + JSON.stringify(P));
  ok(P[0].fait && P[1].fait && +P[0].op < 1 && +P[1].op < 1, 'heure lancée, ▶ ×3 : les deux paragraphes d\'avant ne sont pas estompés');
  ok(!P[3].fait && !P[4].fait && +P[3].op === 1 && +P[4].op === 1 && !P[3].vif, 'heure lancée, ▶ ×3 : les deux paragraphes d\'après ne restent pas lisibles');
  ok(P[2].kc === 'rgb(201, 154, 78)', 'le repère 3 n\'est pas doré : ' + P[2].kc); ok(!foc, 'le dévoilement a pris le focus dans les notes');
  await pg.screenshot({ path: capture('p8-5c-notes-classe-3-6.png') }); MES.push('p8-5c-notes-classe-3-6.png · heure lancée, dévoilée 3 / 6 : ' + P.map(x => x.k + (x.vif ? ' vif' : x.fait ? ' estompé' : ' lisible')).join(' · '));
  await pg.click('#bprec'); await pg.waitForTimeout(150); P = await panneau(pg);
  ok(P[1].vif && P[1].k === '1' && P.filter(x => x.vif).length === 1 && P[0].fait && !P[2].fait, '◀ : le paragraphe vif n\'est pas le 1 : ' + JSON.stringify(P.map(x => x.k + (x.vif ? '*' : ''))));
  const jn = await pg.evaluate(j0 => J.slice(j0), j0); ok(!/note/i.test(JSON.stringify(jn)), 'la lecture des notes a écrit au journal : ' + JSON.stringify(jn));
  ok(await pg.evaluate(() => JSON.stringify(S.copie || {})) === c0, 'la lecture des notes a changé la copie de la classe');
  MES.push('16 · ◀ : ' + P.map(x => x.k + (x.vif ? ' vif' : x.fait ? ' estompé' : ' lisible')).join(' · ') + ' ; journal pendant la lecture : ' + jn.length + ' entrée(s), sans note ; copie inchangée');
  await ctx.close(); }

// ═══ 17. les notes en écriture
{ const { ctx, pg } = await ouvrir(MAQUETTE); await atelier(pg); const key = await pg.evaluate(() => cle());
  // Étape 3, puis les notes (au bout de la note ⌂ d'avant), Entrée → repère 3 ; taper, Entrée → repère 3 encore
  await pg.click('#mur [data-p="0.2"]'); await pg.waitForTimeout(150); await pg.click('#notesd .p8-mt'); await pg.keyboard.press('Control+End'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(250);
  let st = await pg.evaluate(() => ({ act: document.activeElement && document.activeElement.dataset.p8n, k: Array.from(document.querySelectorAll('#notesd .p8-k')).map(x => x.textContent) }));
  ok(st.act === '1' && st.k[0] === '⌂' && st.k[1] === '3', 'Étape 3 puis notes, Entrée : le nouveau paragraphe n\'a pas le focus et le repère 3 : ' + JSON.stringify(st));
  await pg.keyboard.type('Premier.', { delay: 10 }); await pg.keyboard.press('Enter'); await pg.waitForTimeout(250); await pg.keyboard.type('Second.', { delay: 10 }); await pg.waitForTimeout(150);
  // réaccrocher à l'étape 5 : le repère est un bouton, il ouvre la liste des éléments
  await pg.click('#notesd .p8-k[data-p8k="2"]'); await pg.waitForTimeout(250);
  const menu = await pg.evaluate(() => ({ on: document.getElementById('menu').classList.contains('on'), a: Array.from(document.querySelectorAll('#menu [data-a^="p8a-"]')).map(x => x.dataset.a + ' ' + x.textContent) }));
  ok(menu.on && menu.a.length === 7 && menu.a[0] === 'p8a- ⌂ à l\'arrivée sur la diapo' && menu.a.every((x, i) => !i || x.split(' ')[0] === 'p8a-0.' + (i - 1)) && menu.a.every(x => x.length < 60), 'le repère n\'ouvre pas la liste ⌂ + les six éléments (40 caractères) : ' + JSON.stringify(menu));
  await pg.screenshot({ path: capture('p8-5c-atelier-ancres.png') }); MES.push('p8-5c-atelier-ancres.png · atelier, le repère du 3ᵉ paragraphe cliqué : ' + menu.a.map(x => x.slice(4)).join(' | '));
  await pg.click('#menu [data-a="p8a-0.4"]'); await pg.waitForTimeout(250);
  let L = await pg.evaluate(k => DATA.notes[k], key); ok(L && L[2] && L[2].p === '0.4' && L[2].html === 'Second.' && L[1].p === '0.2' && L[1].html === 'Premier.' && L[0].p === null, 'réaccrocher à l\'étape 5 : ' + JSON.stringify(L));
  ok(await pg.$eval('#notesd .p8-k[data-p8k="2"]', x => x.textContent) === '5', 'le repère du paragraphe réaccroché ne dit pas 5');
  // recharger l'état, comme pour les blocs : « ✔ enregistré », puis quitter la diapo et y revenir (la maquette ne garde rien d'une page à l'autre — dit dans la NOTE)
  let enr = false; for (let k = 0; k < 12 && !enr; k++) { enr = /✔ enregistré/.test(await pg.evaluate(() => document.getElementById('at-save').textContent)); if (!enr) await pg.waitForTimeout(500); } ok(enr, 'les notes ne sont pas « ✔ enregistré »');
  await allerA(pg, 1); await allerA(pg, 0); let P = await panneau(pg);
  ok(JSON.stringify(P.slice(1).map(x => x.k + ' ' + x.txt)) === '["3 Premier.","5 Second."]' && P[0].k === '⌂' && P[0].txt.startsWith(AVANT0), 'après être revenu sur la diapo, les notes ne sont pas les mêmes : ' + JSON.stringify(P.map(x => x.k + ' ' + x.txt)));
  // supprimer l'étape 5 (clic droit, « Supprimer l'élément ») → la note revient à ⌂, texte intact
  await pg.click('#mur [data-p="0.4"]', { button: 'right' }); await pg.waitForTimeout(250); await pg.click('#menu [data-a="e-supprimer"]'); await pg.waitForTimeout(300);
  L = await pg.evaluate(k => DATA.notes[k], key); P = await panneau(pg);
  ok(L && L.length === 3 && L.some(n => n.p === null && n.html === 'Second.') && L.some(n => n.p === '0.2' && n.html === 'Premier.'), 'supprimer l\'étape 5 : la note ne revient pas à ⌂ texte intact : ' + JSON.stringify(L));
  ok(JSON.stringify(P.map(x => x.k)) === '["⌂","⌂","3"]' && P[1].txt === 'Second.', 'après la suppression, le panneau n\'est pas ⌂, ⌂ (« Second. »), 3 : ' + JSON.stringify(P.map(x => x.k)));
  MES.push('17 · Entrée après l\'étape 3 : repère ' + st.k[1] + ' ; réaccroché à 5 ; revenu sur la diapo : ' + P.length + ' paragraphes ; étape 5 supprimée : ' + JSON.stringify(L.map(n => ({ p: n.p, html: n.html.slice(0, 20) }))));
  // couper la diapo après l'étape 3 : la diapo 11 (« consigne » de trois étapes, puis une fiche) ; la note de la fiche suit dans « (suite) »
  await allerA(pg, 10); const k10 = await pg.evaluate(() => cle()); const n0 = await pg.evaluate(() => seance().ecrans.length);
  await pg.click('#mur [data-p="0.2"]'); await pg.waitForTimeout(150); await pg.click('#notesd .p8-mt'); await pg.keyboard.type('Trois.', { delay: 10 }); await pg.keyboard.press('Enter'); await pg.waitForTimeout(250); await pg.keyboard.type('Fiche.', { delay: 10 }); await pg.waitForTimeout(150);
  await pg.click('#notesd .p8-k[data-p8k="1"]'); await pg.waitForTimeout(250); await pg.click('#menu [data-a="p8a-1.0"]'); await pg.waitForTimeout(250);
  await pg.click('#mur .obj-nonlisible', { button: 'right' }); await pg.waitForTimeout(250); const coupe = await pg.$('#menu [data-a="b-couper-diapo"]'); ok(!!coupe, 'le clic droit sur la fiche ne propose pas « Couper la diapo ici »');
  if (coupe) { await coupe.click(); await pg.waitForTimeout(400); if (await pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) MES.push('17 · une garde s\'est ouverte à la coupe'); }
  const C = await pg.evaluate(([k10, n0]) => { const E = seance().ecrans; const i = E.findIndex(e => S.si + '|' + e.eid === k10); const s = E[i + 1]; return { n: E.length - n0, suite: s && s.act, avant: DATA.notes[k10], apres: s && DATA.notes[S.si + '|' + s.eid] }; }, [k10, n0]);
  ok(C.n === 1 && /\(suite\)/.test(C.suite || '') && JSON.stringify(C.avant) === '[{"p":"0.2","html":"Trois."}]' && JSON.stringify(C.apres) === '[{"p":"0.0","html":"Fiche."}]', 'couper après l\'étape 3 : la note de la fiche ne suit pas dans « (suite) » : ' + JSON.stringify(C));
  MES.push('17 · couper la diapo 11 après l\'étape 3 : « ' + C.suite + ' » ; reste ' + JSON.stringify(C.avant) + ' ; suit ' + JSON.stringify(C.apres));
  await ctx.close(); }
// taper pendant le redessin choisi : l'animation en accéléré (⚙ → « Animation accélérée »), qui dévoile toute seule toutes les 350 ms pendant l'heure lancée, puis change de diapo
{ const { ctx, pg } = await ouvrir(MAQUETTE); await lancer(pg); const key = await pg.evaluate(() => cle());
  await pg.click('#bsimu'); await pg.waitForTimeout(200); await pg.click('#s-anim'); await pg.waitForTimeout(100);
  await pg.click('#notesd .p8-mt'); await pg.keyboard.press('Control+End'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(100); const vus = new Set(); const TXT = 'Silence, puis on observe les tableaux sans commenter.';
  for (const ch of TXT) { await pg.keyboard.type(ch); await pg.waitForTimeout(45); vus.add(await pg.evaluate(() => cle() + ' ' + etatDiapo().nDev)); }
  const R = await pg.evaluate(k => ({ note: DATA.notes[k], act: document.activeElement && document.activeElement.classList.contains('p8-mt') ? document.activeElement.textContent : null, autres: Object.keys(DATA.notes).filter(x => x !== k && Array.isArray(DATA.notes[x])) }), key);
  ok(vus.size >= 4, 'pendant la frappe, l\'animation n\'a pas redessiné (états vus : ' + [...vus].join(' / ') + ')');
  ok(R.note && R.note.length === 2 && R.note[0].html.replace(/&#39;/g, "'").startsWith(AVANT0) && R.note[1].html === TXT && R.act === TXT && !R.autres.length, 'taper pendant le redessin : le texte n\'est pas intact, ou il a perdu le focus, ou il est allé dans une autre diapo : ' + JSON.stringify(R));
  await pg.click('.notes h4'); await pg.waitForTimeout(300); const sortie = await pg.evaluate(TXT => ({ cles: Array.from(document.querySelectorAll('#notesd .p8-mt')).map(x => x.dataset.p8key), cle: cle(), reste: document.getElementById('notesd').textContent.includes(TXT) }), TXT);
  ok(sortie.cles.length && sortie.cles.every(k => k === sortie.cle) && !sortie.reste, 'à la sortie du paragraphe, le panneau ne montre pas la diapo courante : ' + JSON.stringify(sortie));
  const diapos = new Set([...vus].map(x => x.split(' ')[0])); ok(diapos.size >= 2, 'pendant la frappe, l\'animation n\'a pas changé de diapo : le cas le plus dur n\'est pas joué'); MES.push('17 · taper pendant l\'animation accélérée : ' + vus.size + ' états vus, sur ' + diapos.size + ' diapo(s) (' + [...vus].join(', ') + ') ; le paragraphe neuf dit « ' + (R.note && R.note[1] ? R.note[1].html : '—') + ' », le focus est resté');
  await ctx.close(); }

// ═══ 18. la mise en forme au tableau ; la fenêtre du tableau montre la même chose
{ const { ctx, pg } = await ouvrir(MAQUETTE); await lancer(pg); for (let i = 0; i < 3; i++) { await pg.click('#bdev'); await pg.waitForTimeout(120); }
  const [tab] = await Promise.all([ctx.waitForEvent('page'), pg.click('#bvideoproj')]); tab.on('pageerror', e => errs.push('tableau : ' + e.message)); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await pg.waitForTimeout(600);
  const marques = (q, s) => q.evaluate(s => Array.from(document.querySelectorAll(s)).map(m => m.tagName + ':' + (m.tagName === 'MARK' ? m.style.background : getComputedStyle(m).color) + ':' + m.textContent), s);
  const j0 = await pg.evaluate(() => J.length);
  await selectionner(pg, '#mur [data-p="0.0"]', 'observe les images'); await former(pg, 'bsurl', 'jaune');
  let m = await marques(pg, '#mur [data-p="0.0"] mark'); ok(m.length === 1 && m[0] === 'MARK:' + rgb('#ffe94a') + ':observe les images', '« ab » jaune au tableau : ' + JSON.stringify(m));
  await selectionner(pg, '#mur [data-p="0.0"]', 'en silence'); await pg.click('#btxt'); await pg.waitForTimeout(150);
  const pal = await pg.evaluate(() => ({ on: document.getElementById('pal-txt').classList.contains('on'), n: document.querySelectorAll('#pal-txt .p8-p').length, sel: getSelection().toString() })); await pg.screenshot({ path: capture('p8-5c-palette.png') });
  ok(pal.on && pal.n === 5 && pal.sel === 'en silence', 'le clic sur « A » n\'ouvre pas la palette (4 pastilles + ✕) en gardant la sélection : ' + JSON.stringify(pal));
  MES.push('p8-5c-palette.png · heure lancée, « A » cliqué, la sélection « ' + pal.sel + ' » gardée, palette de ' + pal.n + ' boutons ouverte');
  await pg.click('#pal-txt [data-c="rouge"]'); await pg.waitForTimeout(250);
  m = await marques(pg, '#mur [data-p="0.0"] .p8-ct'); ok(m.length === 1 && m[0] === 'SPAN:' + rgb('#c0392b') + ':en silence', '« A » rouge au tableau, à la teinte du tableau #c0392b : ' + JSON.stringify(m));
  const ed = await pg.evaluate(() => ({ coul: etatDiapo().coulTxt, surl: etatDiapo().surl })); ok(ed.coul && ed.coul[0] && ed.coul[0].couleur === 'rouge' && ed.surl.some(x => x.couleur === 'jaune'), 'l\'état de la diapo ne garde pas le nom des couleurs : ' + JSON.stringify(ed));
  const jt = await pg.evaluate(j0 => J.slice(j0).map(x => JSON.stringify(x)), j0); ok(jt.some(x => /surligne/.test(x)) && jt.some(x => /couleur-texte/.test(x)), 'le journal ne dit pas « surligne » et « couleur-texte » : ' + JSON.stringify(jt));
  await tab.waitForTimeout(500); let t = { m: await marques(tab, '#mur2 mark'), c: await marques(tab, '#mur2 .p8-ct') };
  ok(t.m.some(x => x === 'MARK:' + rgb('#ffe94a') + ':observe les images') && t.c.some(x => x === 'SPAN:' + rgb('#c0392b') + ':en silence'), 'la fenêtre du tableau ne montre pas le surlignage et la couleur : ' + JSON.stringify(t));
  await tab.screenshot({ path: capture('p8-5c-tableau-forme.png') }); MES.push('p8-5c-tableau-forme.png · la fenêtre du tableau : ' + JSON.stringify(t));
  // ✕ : la couleur du texte retirée, puis le surlignage
  await selectionner(pg, '#mur [data-p="0.0"] .p8-ct', 'en silence'); await former(pg, 'btxt', null);
  await selectionner(pg, '#mur [data-p="0.0"] mark', 'observe les images'); await former(pg, 'bsurl', null);
  ok(!(await marques(pg, '#mur [data-p="0.0"] mark, #mur [data-p="0.0"] .p8-ct')).length, '✕ ne retire pas la couleur et le surlignage au tableau');
  // Ctrl+H : le jaune direct
  await selectionner(pg, '#mur [data-p="0.2"]', 'tableau à trois colonnes'); await pg.keyboard.press('Control+h'); await pg.waitForTimeout(250);
  m = await marques(pg, '#mur [data-p="0.2"] mark'); ok(m.length === 1 && m[0] === 'MARK:' + rgb('#ffe94a') + ':tableau à trois colonnes', 'Ctrl+H : ' + JSON.stringify(m));
  await tab.waitForTimeout(500); t = { m: await marques(tab, '#mur2 mark'), c: await marques(tab, '#mur2 .p8-ct') };
  ok(t.m.length === 1 && t.m[0] === 'MARK:' + rgb('#ffe94a') + ':tableau à trois colonnes' && !t.c.length, 'après ✕ et Ctrl+H, la fenêtre du tableau ne montre pas la même chose : ' + JSON.stringify(t));
  // une sélection ailleurs : le message, jamais le silence
  await selectionner(pg, '.haut', 'Pilotage'); await former(pg, 'bsurl', 'rose'); const msg = await pg.evaluate(() => Array.from(document.querySelectorAll('.toast, #dern')).map(x => x.textContent).join(' | '));
  ok(/sélectionne d'abord le texte à surligner/.test(msg), 'une sélection ailleurs ne dit rien : ' + msg);
  MES.push('18 · au tableau, étape 1 : « ab » jaune, « A » rouge, ✕ ; Ctrl+H jaune sur l\'étape 3 ; la fenêtre du tableau suit ; une sélection ailleurs : « ' + msg.split(' | ').pop() + ' »');
  await tab.close(); await ctx.close(); }

// ═══ 19. la mise en forme dans les notes (heure lancée : la trame des notes, ni journal ni tableau)
{ const { ctx, pg } = await ouvrir(MAQUETTE); await lancer(pg); const key = await pg.evaluate(() => cle());
  await pg.click('#notesd .p8-mt'); await pg.keyboard.press('Control+End'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(150); await pg.keyboard.type('Attendu : nature, solitude, sublime.', { delay: 8 }); await pg.waitForTimeout(200);
  const j0 = await pg.evaluate(() => J.length); const murH = () => pg.evaluate(() => document.getElementById('mur').innerHTML.replace(/ style=""/g, '')); /* un style vide, laissé par l'ajustement du texte, n'est pas un changement */ const mur0 = await murH(); const et0 = await pg.evaluate(() => JSON.stringify([etatDiapo().surl || [], etatDiapo().coulTxt || []]));
  await selectionner(pg, '#notesd .p8-mt[data-p8n="1"]', 'nature'); await former(pg, 'bsurl', 'vert');
  let L = await pg.evaluate(k => DATA.notes[k], key); let mk = await pg.evaluate(() => Array.from(document.querySelectorAll('#notesd mark')).map(x => x.dataset.coul + ':' + getComputedStyle(x).backgroundColor + ':' + x.textContent));
  ok(L && /<mark data-coul="vert">nature<\/mark>/.test(L[1].html) && mk[0] === 'vert:' + rgb('#b6f0c2') + ':nature', '« ab » vert dans les notes : la trame des notes ne change pas : ' + JSON.stringify(L) + ' ' + JSON.stringify(mk));
  await selectionner(pg, '#notesd .p8-mt[data-p8n="1"]', 'sublime'); await former(pg, 'btxt', 'bleu');
  L = await pg.evaluate(k => DATA.notes[k], key); mk = await pg.evaluate(() => Array.from(document.querySelectorAll('#notesd span[data-coul]')).map(x => x.dataset.coul + ':' + getComputedStyle(x).color + ':' + x.textContent));
  ok(/<span data-coul="bleu">sublime<\/span>/.test(L[1].html) && mk[0] === 'bleu:' + rgb('#8ab8ff') + ':sublime', '« A » bleu dans les notes, à la teinte des notes #8ab8ff : ' + JSON.stringify(mk));
  await pg.screenshot({ path: capture('p8-5c-notes-forme.png') }); MES.push('p8-5c-notes-forme.png · le paragraphe : ' + L[1].html);
  const jN = await pg.evaluate(j0 => J.slice(j0), j0); ok(!jN.length, 'la mise en forme des notes a écrit au journal : ' + JSON.stringify(jN));
  const mur1 = await murH(); ok(mur1 === mur0, 'la mise en forme des notes a touché le mur : ' + (() => { let k = 0; while (k < mur0.length && mur0[k] === mur1[k]) k++; return mur0.slice(k - 40, k + 80) + ' ⇒ ' + mur1.slice(k - 40, k + 80); })());
  ok(await pg.evaluate(() => JSON.stringify([etatDiapo().surl || [], etatDiapo().coulTxt || []])) === et0, 'la mise en forme des notes a touché l\'état de la diapo (surlignage, couleur)');
  await selectionner(pg, '#notesd .p8-mt[data-p8n="1"] mark', 'nature'); await former(pg, 'bsurl', null); await selectionner(pg, '#notesd .p8-mt[data-p8n="1"] span', 'sublime'); await former(pg, 'btxt', null);
  L = await pg.evaluate(k => DATA.notes[k], key); ok(L[1].html === 'Attendu : nature, solitude, sublime.', '✕ dans les notes : ' + L[1].html);
  MES.push('19 · dans les notes : vert, bleu, ✕ → « ' + L[1].html + ' » ; journal et mur inchangés');
  await ctx.close(); }

// ═══ 20. la barre tient : ▶ Dévoiler et le compteur restent dans la scène à 1280, la barre est plus étroite qu'avant
const barre = async url => { const { ctx, pg } = await ouvrir(url); await lancer(pg); const r = await pg.evaluate(() => { const sc = document.querySelector('.scene').getBoundingClientRect(); const b = id => document.getElementById(id).getBoundingClientRect(); const kids = Array.from(document.querySelector('.outils').children).filter(x => x.getClientRects().length); const g = Math.min(...kids.map(x => x.getBoundingClientRect().left)), d = Math.max(...kids.map(x => x.getBoundingClientRect().right)); return { scene: Math.round(sc.right), dev: Math.round(b('bdev').right), compte: Math.round(b('compte').right), largeur: Math.round(d - g) }; }); await ctx.close(); return r; };
{ const ap = await barre(MAQUETTE); const av = fs.existsSync(AVANT_F) ? await barre(AVANT) : null;
  ok(ap.dev <= ap.scene && ap.compte <= ap.scene, 'à 1280, ▶ Dévoiler ou le compteur sortent de la scène : ' + JSON.stringify(ap));
  ok(av && ap.largeur < av.largeur, 'la barre n\'est pas plus étroite qu\'avant : ' + JSON.stringify({ avant: av, apres: ap }));
  MES.push('20 · la barre à 1280 : avant ' + (av ? av.largeur : '—') + ' px, après ' + ap.largeur + ' px ; scène à ' + ap.scene + ', ▶ à ' + ap.dev + ', compteur à ' + ap.compte); }

// ═══ 21. les 20 gestes de T39 (C13, tour 39), portés sur « ab » et ses pastilles
{ const { ctx, pg: page } = await ouvrir(MAQUETTE); const R = []; const dire = (nom, b, detail) => { R.push({ nom, ok: b, detail }); MES.push('21 · ' + (b ? 'ça va      ' : 'ÇA NE VA PAS') + ' · ' + nom + (detail ? ' — ' + detail : '')); };
  await page.click('[data-lancer="1"]'); await page.waitForTimeout(400);
  for (let i = 0; i < 3; i++) { await page.click('#bdev'); await page.waitForTimeout(120); }
  let compte = await page.textContent('#compte'); dire('▶ Dévoiler (trois clics)', /^3 \/ 6/.test(compte.trim()), compte.trim());
  await page.click('#bprec'); await page.waitForTimeout(120); compte = await page.textContent('#compte'); dire('◀ (un clic)', /^2 \/ 6/.test(compte.trim()), compte.trim());
  await page.click('#bdev'); await page.waitForTimeout(120);
  await page.click('#blum'); const lumArme = await page.$eval('#blum', b => b.classList.contains('on')); await page.click('#mur li[data-k="0"]'); await page.waitForTimeout(150);
  const spot = await page.$$eval('#mur .spot-on', l => l.length); const lumRepose = await page.$eval('#blum', b => !b.classList.contains('on'));
  dire('✦ Mettre en lumière', lumArme && spot === 1 && lumRepose, `armé=${lumArme}, éléments allumés=${spot}, outil reposé=${lumRepose}`);
  await page.click('#becr'); await page.click('#mur li[data-k="1"]'); await page.waitForTimeout(150);
  const aecrire = await page.$$eval('#mur li.aecrire', l => l.map(x => x.dataset.k)); dire('✍ À écrire', aecrire.length === 1 && aecrire[0] === '1', `marqués=${JSON.stringify(aecrire)}`);
  await page.click('#becr'); await page.keyboard.press('Escape');
  await page.click('#btoutes'); await page.waitForTimeout(200); const toutesOn = await page.$eval('#vtoutes', v => v.classList.contains('on')); const nVig = await page.$$eval('#vtoutes .vig', l => l.length); const nDiapos = await page.evaluate(() => seance().ecrans.length);
  await page.keyboard.press('Escape'); await page.waitForTimeout(150); const toutesOff = await page.$eval('#vtoutes', v => !v.classList.contains('on'));
  dire('⊞ Toutes les diapos', toutesOn && nVig === nDiapos && toutesOff, `ouvert=${toutesOn}, vignettes=${nVig}/${nDiapos}, Échap ferme=${toutesOff}`);
  const sel1 = () => page.evaluate(() => { const li = document.querySelector('#mur li[data-k="0"]'); const tn = Array.from(li.childNodes).find(n => n.nodeType === 3 && n.textContent.trim().length > 8) || li.firstChild; const r = document.createRange(); r.setStart(tn, 2); r.setEnd(tn, 12); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
  const COUL = { jaune: '#ffe94a', vert: '#b6f0c2', rose: '#ffc9d6', bleu: '#bcd9ff' };
  for (const c of Object.keys(COUL)) { await sel1(); await former(page, 'bsurl', c);
    const marks = await page.$$eval('#mur li[data-k="0"] mark', l => l.map(m => m.style.background)); dire(`Surligner en ${c}`, marks.length >= 1 && marks.some(m => m === rgb(COUL[c])), `marques=${JSON.stringify(marks)}`);
    await page.evaluate(() => { const m = document.querySelector('#mur li[data-k="0"] mark'); if (!m) return; const r = document.createRange(); r.selectNodeContents(m); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); });
    await former(page, 'bsurl', null); const reste = await page.$$eval('#mur li[data-k="0"] mark', l => l.length); dire(`✕ retirer le surlignage ${c}`, reste === 0, `marques restantes=${reste}`); }
  await page.click('#bloupe'); const loupeArmee = await page.$eval('#bloupe', b => b.classList.contains('on')); const mr = await page.$eval('#mur', m => { const r = m.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; });
  await page.mouse.move(mr.x + mr.w * 0.2, mr.y + mr.h * 0.2); await page.mouse.down(); await page.mouse.move(mr.x + mr.w * 0.4, mr.y + mr.h * 0.4, { steps: 6 }); const cadreVisible = await page.$eval('#cadre-loupe', c => c.style.display === 'block');
  await page.mouse.move(mr.x + mr.w * 0.6, mr.y + mr.h * 0.6, { steps: 6 }); await page.mouse.up(); await page.waitForTimeout(200); const zoom = await page.$$eval('#mur *', l => l.some(x => /scale\(/.test(x.style.transform)));
  await page.click('#bloupe'); await page.waitForTimeout(200); const dezoom = await page.$$eval('#mur *', l => !l.some(x => /scale\(/.test(x.style.transform)));
  dire('🔍 Loupe', loupeArmee && cadreVisible && zoom && dezoom, `armée=${loupeArmee}, cadre pendant le tracé=${cadreVisible}, zone agrandie=${zoom}, second clic remet la diapo=${dezoom}`);
  await page.click('#bgel'); await page.waitForTimeout(150); const gelOn = await page.evaluate(() => document.body.classList.contains('gel') && document.getElementById('bgel').classList.contains('gelon')); await page.click('#bgel'); await page.waitForTimeout(150); const gelOff = await page.evaluate(() => !document.body.classList.contains('gel'));
  dire('❄ Gel', gelOn && gelOff, `gel=${gelOn}, dégel=${gelOff}`);
  await page.click('#bqui'); await page.waitForTimeout(150); const quiOn = await page.$$eval('#mur .quiw.on', l => l.length === 1); await page.click('#bqui'); await page.waitForTimeout(150); const quiOff = await page.$$eval('#mur .quiw', l => l.length === 0);
  dire('👥 Qui a participé', quiOn && quiOff, `affiché=${quiOn}, retiré=${quiOff}`);
  await page.click('#bplus'); await page.waitForTimeout(150); const menuOn = await page.$eval('#menuplus', m => m.classList.contains('on')); const items = await page.$$eval('#menuplus [data-a]', l => l.map(x => x.dataset.a));
  await page.click('#menuplus [data-a="chrono"]'); await page.waitForTimeout(150); const bandeauOn = await page.$eval('#mur', m => m.classList.contains('avec-bandeau'));
  await page.click('#bplus'); await page.click('#menuplus [data-a="chrono"]'); await page.waitForTimeout(150); const bandeauOff = await page.$eval('#mur', m => !m.classList.contains('avec-bandeau'));
  dire('⋯ Menu + Chrono au tableau', menuOn && items.length >= 5 && bandeauOn && bandeauOff, `menu=${menuOn}, entrées=${items.join(',')}, chrono posé=${bandeauOn}, retiré=${bandeauOff}`);
  await page.click('#volet .vig[data-i="7"]'); await page.waitForTimeout(250); const gardeOuverte = await page.$eval('#garde', g => g.classList.contains('on')); if (gardeOuverte) { await page.click('#garde-devant'); await page.waitForTimeout(250); }
  const act8 = await page.evaluate(() => ecran().act); const fs0 = await page.$eval('#mur .corpsd', c => getComputedStyle(c).fontSize); const l0 = await page.textContent('#taille-l');
  await page.locator('#taille').fill('3'); await page.waitForTimeout(200); const fs3 = await page.$eval('#mur .corpsd', c => getComputedStyle(c).fontSize); const l3 = await page.textContent('#taille-l'); await page.locator('#taille').fill('1'); await page.waitForTimeout(200);
  dire('Texte au tableau (curseur)', parseFloat(fs3) > parseFloat(fs0) && l3 !== l0, `diapo 8 « ${act8} » : ${l0} ${fs0} → ${l3} ${fs3}`);
  await page.click('#volet .vig[data-i="0"]'); await page.waitForTimeout(250); if (await page.$eval('#garde', g => g.classList.contains('on'))) { await page.click('#garde-devant'); await page.waitForTimeout(250); }
  dire('Garde « La classe te suivrait » au changement de diapo', gardeOuverte, `ouverte=${gardeOuverte}`);
  // les mêmes couleurs dans « Notes pour cette diapo » : un clic dans les notes, la frappe, la sélection, « ab » jaune (T39 posait le texte par le code : ici, par le clavier)
  await page.click('#notesd .p8-mt'); await page.keyboard.press('Control+End'); await page.keyboard.press('Enter'); await page.waitForTimeout(150); await page.keyboard.type('Note de présentateur pour le banc', { delay: 6 }); await page.waitForTimeout(150); await selectionner(page, '#notesd .p8-mt[data-p8n="1"]', 'Note de présentateur'); await former(page, 'bsurl', 'jaune');
  const markNotes = await page.$$eval('#notesd mark', l => l.length); const dern = await page.textContent('#dern').catch(() => '');
  dire('Surligner dans « Notes pour cette diapo »', markNotes > 0, `marques dans les notes=${markNotes}, message=« ${dern.trim()} »`);
  const nOk = R.filter(r => r.ok).length; ok(R.length === 20 && nOk === 20, 'T39 porté : ' + nOk + ' « ça va » sur ' + R.length + ' : ' + R.filter(r => !r.ok).map(r => r.nom + ' — ' + r.detail).join(' ; '));
  MES.push('21 · bilan : ' + nOk + ' ça va, ' + (R.length - nOk) + ' ça ne va pas, sur ' + R.length);
  await ctx.close(); }

fs.writeFileSync(capture('MESURES-p8-5c.txt'), MES.join('\n') + '\n'); console.log(MES.join('\n'));
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
