// (p8-3) un schéma par diapo : les gestes et leurs gardes — par la souris et le clavier : « Schéma… » sur une diapo pleine puis sur une diapo à schéma ;
// « Couper le schéma ici » sur la vraie carte, rejoué jusqu'à ce que chaque morceau tienne, et la mesure de chaque morceau ; tirer une bulle dans l'atelier
// (elle garde sa place, elle ne bouge pas au pilotage ni au tableau, on ne peut pas la tirer au pilotage) ; coller et dupliquer un schéma ; la taille grisée ;
// « À régler », puis « Couper la diapo ici » ; le panneau du schéma. Les captures de chaque morceau sont écrites avec leurs cinq chiffres (captures/MESURES-p8-3.txt).
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const boites = []; page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); });   /* aucune boîte système ne doit s'ouvrir : chacune est un défaut */
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a);
const MES = []; const cinq = m => `chevauchements ${m.chevauchements} · hors du cadre visible ${m.horsCadre} · traits à travers un mot ${m.traits} · libellés sur deux lignes ${m.deuxLignes} · polices sous 26 pt ${m.sousPlancher}`;
const mesurer = (pg, sel) => pg.evaluate(s => { const m = p8MesureLisible(document.querySelector(s)); return { chevauchements: m.chevauchements, horsCadre: m.horsCadre, traits: m.traits, deuxLignes: m.deuxLignes, sousPlancher: m.sousPlancher, total: m.total, details: m.details.slice(0, 6) }; }, sel);
const idx = q => ev(q => seance().ecrans.findIndex(e => e.eid === q || e.act === q), q);
const allerA = async i => { await page.click('#volet .at-chap .d[data-at-di="' + i + '"]'); await p(450); };
const allerEid = async eid => allerA(await idx(eid)); /* le rang n'est pas une identité : on retrouve la diapo par son identifiant à chaque fois */
const items = () => ev(() => Array.from(document.querySelectorAll('#menu .it')).map(b => ({ a: b.dataset.a, l: b.textContent, t: b.title, off: b.disabled })));
const toastTxt = () => ev(() => { const t = document.getElementById('at-toast'); return t && t.style.display !== 'none' ? t.textContent : ''; });
const droite = () => ev(() => document.getElementById('droite-atelier').textContent);
/* un point du dessin du schéma qui n'est sur aucune bulle (pour le clic droit sur le bloc) */
const coinDuSchema = () => ev(() => { const z = document.querySelector('#mur .p8-dessin'); const r = z.getBoundingClientRect(); for (const [fx, fy] of [[0.02, 0.97], [0.98, 0.97], [0.02, 0.03], [0.98, 0.03], [0.5, 0.97]]) { const x = r.left + r.width * fx, y = r.top + r.height * fy; const h = document.elementFromPoint(x, y); if (h && z.contains(h) && !h.closest('g.p8-n')) return { x, y }; } return null; });
/* le centre visible d'une bulle (son mot), là où la souris la prend vraiment */
const bulle = k => ev(k => { const g = document.querySelector('#mur .p8-dessin g.p8-n[data-k="' + k + '"]'); if (!g) return null; const r = g.querySelector('text').getBoundingClientRect(); for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85]) { const x = r.left + r.width * fx, y = r.top + r.height / 2; const h = document.elementFromPoint(x, y); if (h && h.closest('g.p8-n') === g) return { x, y, rx: +g.querySelector('rect:not(.p8-fond)').getAttribute('x'), ry: +g.querySelector('rect:not(.p8-fond)').getAttribute('y') }; } return null; }, k);
const cle = t => ev(t => p8Cle(t), t);
await page.goto(MAQUETTE); await p(600); await page.click('#edt-cases [data-atelier="1"]'); await p(500); await page.click('#at-aide .x'); await p(200);

// 1. « Schéma… » sur une diapo pleine (« Les hypothèses de la classe » : une consigne de trois étapes) : le schéma part dans une diapo nouvelle, juste après
const iH = await idx('Les hypothèses de la classe'); await allerA(iH);
const av1 = await ev(i => { const E = seance().ecrans; const e = E[i]; return { n: E.length, blocs: JSON.stringify(e.blocs), dur: e.dur, heure: e.heure, actId: e.actId, comp: JSON.stringify(e.comp || []), act: e.act }; }, iH);
await page.click('#at-bloc'); await p(300); ok(await ev(() => !document.querySelector('.choix-obj .c[data-t="schema"]').classList.contains('off')), '« Schéma… » est grisé sur une diapo sans schéma');
await page.click('.choix-obj .c[data-t="schema"]'); await p(300); await page.selectOption('#of-forme', 'frise'); await page.fill('#of-t', 'Les dates des hypothèses'); await page.fill('#of-src', '1820 = Lamartine\n1830 = Hernani'); await page.click('#of-ok'); await p(600);
const ap1 = await ev(i => { const E = seance().ecrans; const e = E[i], n = E[i + 1]; return { n: E.length, blocs: JSON.stringify(e.blocs), dur: e.dur, nAct: n.act, nHeure: n.heure, nActId: n.actId, nComp: JSON.stringify(n.comp || []), nDur: n.dur, nBlocs: n.blocs.map(b => b.t + ':' + b.forme + ':' + b.devoilerTout), di: S.di }; }, iH);
ok(ap1.n === av1.n + 1 && ap1.di === iH + 1, '« Schéma… » sur une diapo pleine ne crée pas la diapo suivante (ou ne s\'y place pas) : ' + JSON.stringify(ap1));
ok(ap1.nAct === av1.act + ' (suite)' && ap1.nHeure === av1.heure && ap1.nActId === av1.actId && ap1.nComp === av1.comp, 'la diapo nouvelle ne reprend pas l\'heure, l\'activité, les notions, ou son titre n\'est pas « … (suite) » : ' + JSON.stringify(ap1));
ok(ap1.dur + ap1.nDur === av1.dur && ap1.nDur > 0, 'la durée n\'est pas partagée : ' + av1.dur + ' → ' + ap1.dur + ' + ' + ap1.nDur);
ok(ap1.blocs === av1.blocs, 'le contenu de la diapo d\'origine a changé');
ok(JSON.stringify(ap1.nBlocs) === JSON.stringify(['schema:frise:false']), 'la diapo nouvelle ne porte pas le seul schéma, réglé « Un à un » (6 ter) : ' + JSON.stringify(ap1.nBlocs));
ok(/Schéma posé dans une diapo nouvelle, juste après/.test(await toastTxt()), 'le site ne dit pas où le schéma est parti (notice)');
// … puis sur une diapo à schéma : « Schéma… » grisé, avec la raison ; les autres ajouts grisés sauf l'unique consigne d'une ligne
await page.click('#at-bloc'); await p(300);
const c1 = await ev(() => { const c = t => document.querySelector('.choix-obj .c[data-t="' + t + '"]'); return { sch: c('schema').classList.contains('off'), schT: c('schema').title, img: c('image').classList.contains('off'), imgT: c('image').title, cons: c('consigne').classList.contains('off') }; });
ok(c1.sch && /une diapo n'a qu'un schéma/.test(c1.schT), '« Schéma… » n\'est pas grisé sur une diapo à schéma, ou sans la raison « une diapo n\'a qu\'un schéma » : ' + JSON.stringify(c1));
ok(c1.img && /^Cette diapo a son schéma : .*diapo suivante/.test(c1.imgT) /* (recalé en p8-3c §3 : l'infobulle dit ce qui empêche, puis quoi faire — plus « Grisé ») */ && !c1.cons, 'sur une diapo à schéma, « Image… » n\'est pas grisé avec sa raison, ou la consigne d\'une ligne est refusée : ' + JSON.stringify(c1));
const nb0 = await ev(() => ecran().blocs.length); await page.click('.choix-obj .c[data-t="schema"]'); await p(300); ok(await ev(nb => ecran().blocs.length === nb && !document.getElementById('of-ok'), nb0), 'un clic sur « Schéma… » grisé ouvre quand même le formulaire');
await page.click('.choix-obj .x'); await p(200);
const barre = await ev(() => ['at-etape', 'at-image', 'at-fiche', 'at-video', 'at-doc'].map(id => { const b = document.getElementById(id); return id + ':' + b.disabled + ':' + /^Cette diapo a son schéma : .*diapo suivante/.test(b.title); })); /* (recalé en p8-3c §3) */
ok(barre.every(x => /:true:true$/.test(x)), 'sur une diapo à schéma, « + étape » et les autres ajouts ne sont pas grisés avec leur raison : ' + barre.join(' '));
// une diapo libre (insérée : son titre et une consigne d'une ligne) : « Schéma… » s'y pose, sans diapo nouvelle ; ensuite la consigne n'est plus proposée (il y en a déjà une)
await allerA(iH); await page.keyboard.press('Control+Enter'); await p(500); const iL = await ev(() => S.di); const nL = await ev(() => seance().ecrans.length);
await page.click('#at-bloc'); await p(300); await page.click('.choix-obj .c[data-t="schema"]'); await p(300); await page.selectOption('#of-forme', 'cycle'); await page.fill('#of-t', 'Lire, dire'); await page.fill('#of-src', 'lire\ndire'); await page.click('#of-ok'); await p(500);
ok(await ev(([i, n]) => seance().ecrans.length === n && S.di === i && ecran().blocs.map(b => b.t).join(',') === 'consigne,schema', [iL, nL]), 'sur une diapo libre (une consigne d\'une ligne), le schéma ne s\'est pas posé sur la diapo même');
ok(await ev(() => { const b = document.getElementById('at-bloc'); return b.disabled && /^Cette diapo a son schéma : écris la suite dans la diapo suivante, ou coupe : clic droit sur le schéma → Couper la diapo ici\.$/.test(b.title); }), 'sur une diapo à schéma qui a déjà sa consigne d\'une ligne, « + bloc » n\'est pas grisé avec sa raison'); /* (recalé en p8-3c §3 : l'exemple du complément, mot pour mot) */

// 2. « Couper le schéma ici » sur la vraie carte (8 familles) — « Sur la forme » et « À régler » le proposent ; le banc rejoue le geste jusqu'à ce qu'il n'y ait plus rien à couper
let iV = await idx('e-sim-vraie-carte'); await allerA(iV); await p(400);
ok(/Schéma « Les figures de style » : il ne tient pas lisible — coupe-le : clic droit sur une famille → Couper le schéma ici/.test(await droite()), 'la vraie carte ne tient pas, et « Sur la forme » ne propose pas « Couper le schéma ici »');
await page.click('#at-regler'); await p(400); ok(await ev(() => /Schéma « Les figures de style » : il ne tient pas lisible — coupe-le/.test(document.querySelector('.choix-obj').textContent)), '« À régler » ne dit pas que la vraie carte ne tient pas'); await page.click('.choix-obj .x'); await p(200);
const famV = await ev(i => p8Lignes(seance().ecrans[i].blocs[0]), iV);
let q = await bulle(await cle('comparaison')); await page.mouse.click(q.x, q.y, { button: 'right' }); await p(300); let it = await items(); let cp = it.find(x => x.a === 'p8-couper');
ok(cp && cp.off && /bulle de tête/.test(cp.t), 'sur une notion, « Couper le schéma ici » n\'est pas grisé avec la raison : ' + JSON.stringify(cp)); await page.keyboard.press('Escape'); await p(150);

const morceaux = () => ev(() => seance().ecrans.map((e, i) => ({ i, e })).filter(x => x.e.eid === 'e-sim-vraie-carte' || (x.e.actId === 'a0-figures' && /\(suite\)$/.test(x.e.act))).map(x => ({ i: x.i, eid: x.e.eid, act: x.e.act, txt: x.e.blocs[0].txt, heure: x.e.heure, actId: x.e.actId, nb: x.e.blocs.length, fam: p8Lignes(x.e.blocs[0]), tot: (p8MesureDiapo(x.i).blocs[0] || {}).total })));
let coupes = 0;
for (let tour = 0; tour < 12; tour++) {
  const P = await morceaux(); const c = P.find(x => x.tot > 0 && x.fam.length >= 2); if (!c) break;
  await allerA(c.i); const cible = Math.floor(c.fam.length / 2);
  MES.push(`avant la coupe ${coupes + 1} : « ${c.act} » · ${c.fam.map(l => l.split(':')[0].trim()).join(', ')} · ne tient pas : ${cinq(await mesurer(page, '#mur'))}`);   /* (p8-3b) chaque coupe dit pourquoi elle a été faite */
  const pt = await ev(li => { const fam = p8Lignes(ecran().blocs[0]).map(l => l.split(':')[0].trim()); const ordre = [li].concat(fam.map((_, k) => k).filter(k => k >= 1 && k !== li)); for (const k of ordre) { const g = document.querySelector('#mur .p8-dessin g.p8-n[data-k="' + p8Cle(fam[k]) + '"]'); if (!g) continue; const r = g.querySelector('text').getBoundingClientRect(); for (const fx of [0.5, 0.25, 0.75, 0.1, 0.9]) { const x = r.left + r.width * fx, y = r.top + r.height / 2; const h = document.elementFromPoint(x, y); if (h && h.closest('g.p8-n') === g) return { x, y, k }; } } return null; }, cible);
  if (!pt) { D.push('morceau « ' + c.act + ' » : aucune famille visible à viser à la souris'); break; }
  await page.mouse.click(pt.x, pt.y, { button: 'right' }); await p(300); it = await items(); cp = it.find(x => x.a === 'p8-couper');
  ok(cp && !cp.off && /second schéma/.test(cp.t), 'sur une famille, « Couper le schéma ici » n\'est pas proposé avec son infobulle : ' + JSON.stringify(cp));
  const n0 = (await morceaux()).length; await page.click('#menu [data-a="p8-couper"]'); await p(700); coupes++;
  const P2 = await morceaux(); const suite = P2.find(x => x.i === c.i + 1);
  ok(P2.length === n0 + 1 && suite && suite.heure === 2 && suite.actId === 'a0-figures' && suite.txt === 'Les figures de style (suite)' && /\(suite\)$/.test(suite.act) && suite.nb === 1, 'coupe ' + coupes + ' : le second schéma n\'est pas sur une diapo nouvelle juste après (même heure, même activité, même titre suivi de « (suite) ») : ' + JSON.stringify(suite));
  ok(JSON.stringify(P2.flatMap(x => x.fam)) === JSON.stringify(famV), 'coupe ' + coupes + ' : des familles se sont perdues ou ont changé d\'ordre');
  ok(/Schéma coupé/.test(await toastTxt()), 'coupe ' + coupes + ' : la notice ne dit pas la coupe');
}
const finaux = await morceaux(); const restent = [];
{ const m0 = finaux.find(x => x.fam.length >= 2) || finaux[0]; await allerA(m0.i); const q0 = await bulle(await cle(m0.fam[0].split(':')[0].trim())); if (q0) { await page.mouse.click(q0.x, q0.y, { button: 'right' }); await p(300); it = await items(); cp = it.find(x => x.a === 'p8-couper'); ok(cp && cp.off && /rien avant : rien à couper/.test(cp.t), 'sur la première famille d\'un schéma, « Couper le schéma ici » n\'est pas grisé « rien avant : rien à couper » : ' + JSON.stringify(cp)); await page.keyboard.press('Escape'); await p(150); } else D.push('la première famille du morceau « ' + m0.act + ' » n\'est pas visible : le banc ne peut pas la viser à la souris'); }
for (const m of finaux) { await allerA(m.i); await p(300); const mm = await mesurer(page, '#mur'); const dit = /Schéma « [^»]*» : il ne tient pas lisible/.test(await droite()); const nom = 'p8-3-morceau-' + (finaux.indexOf(m) + 1) + '.png';
  await page.screenshot({ path: capture(nom) }); await page.locator('#murcadre').screenshot({ path: capture(nom.replace('.png', '-zoom.png')) }); MES.push(`${nom} (et -zoom) · « ${m.act} » · ${m.fam.map(l => l.split(':')[0].trim()).join(', ')} · dans l'atelier : ${cinq(mm)}`);
  ok(dit === (mm.total > 0), '« Sur la forme » et la mesure ne disent pas la même chose pour « ' + m.act + ' »');
  if (mm.total) restent.push(`« ${m.fam.map(l => l.split(':')[0].trim()).join(', ')} » (${m.fam.length === 1 ? 'une seule famille : plus rien à couper' : 'à couper encore'}) — ${cinq(mm)} — ${mm.details.join(' / ')}`); }
ok(!restent.length, 'après ' + coupes + ' coupes, ' + restent.length + ' morceau(x) de la vraie carte ne tien(nen)t toujours pas lisible(s) : ' + restent.join(' ; '));
MES.push('la vraie carte, après ' + coupes + ' coupes : ' + finaux.length + ' morceaux ; ' + (restent.length ? restent.length + ' ne tiennent pas : ' + restent.join(' ; ') : 'chacun tient'));
// constat (décision 7, pas une coupe) : un morceau qui ne tient pas, une bulle tirée à la main hors du trait qui la traverse le rend-il lisible ?
for (const m of (await morceaux()).filter(x => x.tot > 0)) { await allerA(m.i); const mm = await mesurer(page, '#mur'); const nom = ((mm.details.find(x => /trait à travers : /.test(x)) || '').split('trait à travers : ')[1] || '').trim(); if (!nom) continue; const qq = await bulle(await cle(nom)); if (!qq) continue;
  await page.mouse.move(qq.x, qq.y); await page.mouse.down(); for (let s2 = 1; s2 <= 10; s2++) { await page.mouse.move(qq.x - 25 * s2, qq.y + 12 * s2); await p(30); } await page.mouse.up(); await p(500); const m2 = await mesurer(page, '#mur');
  MES.push(`constat : « ${m.fam[0].split(':')[0].trim()} » — « ${nom} » tirée à la main (250 px à gauche, 120 px plus bas) : ${cinq(m2)}`); }

// 3. tirer une bulle dans l'atelier : elle garde sa place (« ✔ enregistré ») ; au pilotage et au tableau elle ne bouge pas ; au pilotage on ne peut pas la tirer
const opp = (await morceaux()).find(x => x.fam.length === 1 && /^Figures d'opposition/.test(x.fam[0])); ok(!!opp, 'pas de morceau « Figures d\'opposition » seul');
await allerEid(opp.eid); const kOx = await cle('oxymore'); const avOx = await bulle(kOx);
ok(await ev(k => /Tire pour la placer ; elle gardera cette place\. Si tu renommes la notion, elle reprendra une place calculée\./.test(document.querySelector('#mur .p8-dessin g.p8-n[data-k="' + k + '"] > title').textContent), kOx), 'la bulle n\'a pas son infobulle « Tire pour la placer… »');
await page.mouse.move(avOx.x, avOx.y); await page.mouse.down(); for (let s = 1; s <= 8; s++) { await page.mouse.move(avOx.x - 10 * s, avOx.y + 6 * s); await p(30); } await page.mouse.up(); await p(300);
const apOx = await ev(k => ({ pos: (ecran().blocs[0].pos || {})[k], save: document.getElementById('at-save').textContent }), kOx);
ok(apOx.pos && /modification en cours/.test(apOx.save), 'tirer la bulle ne lui donne pas de place (ou le témoin ne dit pas « modification en cours ») : ' + JSON.stringify(apOx));
const placeOx = await bulle(kOx); ok(placeOx && Math.abs(placeOx.rx - avOx.rx + 80) < 3 && Math.abs(placeOx.ry - avOx.ry - 48) < 3, 'la bulle n\'a pas suivi la souris : ' + JSON.stringify([avOx, placeOx]));
await p(4200); ok(/✔ enregistré/.test(await ev(() => document.getElementById('at-save').textContent)), 'la place donnée n\'est pas « ✔ enregistré »');
const iAutre = await idx('Le siècle des inventions'); await allerEid('Le siècle des inventions'); await allerEid(opp.eid); const reOx = await bulle(kOx); ok(reOx && Math.abs(reOx.rx - placeOx.rx) < 0.5 && Math.abs(reOx.ry - placeOx.ry) < 0.5, 'en revenant sur la diapo, la bulle n\'a pas gardé sa place');
ok(await ev(k => document.querySelector('#mur .p8-dessin g.p8-n[data-k="' + k + '"]').classList.contains('p8-bouge'), kOx), 'la bulle placée à la main n\'est pas marquée (pointillé de l\'ancien)');
const unite = (pg, sel, k) => pg.evaluate(([s, k]) => { const sv = document.querySelector(s + ' .p8-dessin svg.p8-svg'); const r = sv.querySelector('g.p8-n[data-k="' + k + '"] rect:not(.p8-fond)'); const W = +sv.dataset.w, H = +sv.dataset.h; return { x: Math.round((+r.getAttribute('x') + +r.getAttribute('width') / 2) / W * 1000), y: Math.round((+r.getAttribute('y') + +r.getAttribute('height') / 2) / H * 560) }; }, [sel, k]);
const posOx = await ev(k => ecran().blocs[0].pos[k], kOx); const uAt = await unite(page, '#mur', kOx);
ok(Math.abs(uAt.x - posOx.x) <= 1 && Math.abs(uAt.y - posOx.y) <= 1, 'dans l\'atelier, la bulle n\'est pas à sa place enregistrée (repère 1000 × 560) : ' + JSON.stringify([uAt, posOx]));
await page.click('#at-jouer'); await p(500); const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); tab.on('pageerror', e => errs.push('tableau : ' + e.message)); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(600);
const uPi = await unite(page, '#mur', kOx), uTa = await unite(tab, '#mur2', kOx);
ok(Math.abs(uPi.x - posOx.x) <= 1 && Math.abs(uPi.y - posOx.y) <= 1 && Math.abs(uTa.x - posOx.x) <= 1 && Math.abs(uTa.y - posOx.y) <= 1, 'au pilotage ou au tableau, la bulle n\'est pas à la place donnée dans l\'atelier : ' + JSON.stringify({ posOx, uPi, uTa }));
const piOx = await bulle(kOx); await page.mouse.move(piOx.x, piOx.y); await page.mouse.down(); for (let s = 1; s <= 6; s++) { await page.mouse.move(piOx.x + 15 * s, piOx.y - 8 * s); await p(30); } await page.mouse.up(); await p(300);
const apPi = await bulle(kOx); ok(apPi && Math.abs(apPi.rx - piOx.rx) < 0.5 && Math.abs(apPi.ry - piOx.ry) < 0.5 && JSON.stringify(await ev(k => ecran().blocs[0].pos[k], kOx)) === JSON.stringify(posOx), 'au pilotage, on a pu tirer la bulle');
ok(await ev(k => getComputedStyle(document.querySelector('#mur .p8-dessin g.p8-n[data-k="' + k + '"]')).cursor !== 'move', kOx), 'au pilotage, la bulle propose encore la main de déplacement');
await page.click('#rep-stop'); await p(500); await tab.close();

// 4. coller et dupliquer un schéma : sur une diapo qui a du contenu, il part dans une diapo nouvelle, juste après ; une consigne de plusieurs lignes ne se colle pas sur une diapo à schéma
await allerEid(opp.eid); let cn = await coinDuSchema(); await page.mouse.click(cn.x, cn.y, { button: 'right' }); await p(300); await page.click('#menu [data-a="b-copier"]'); await p(200);
await allerEid('Le siècle des inventions'); const avC = await ev(i => ({ n: seance().ecrans.length, blocs: JSON.stringify(seance().ecrans[i].blocs) }), iAutre);
await page.click('#mur [data-p="0.t"]', { button: 'right' }); await p(300); it = await items(); const col = it.find(x => x.a === 'b-coller'); ok(col && !col.off && /part dans une diapo nouvelle/.test(col.t), '« Coller ici » d\'un schéma sur une diapo pleine ne dit pas qu\'il part dans une diapo nouvelle : ' + JSON.stringify(col));
await page.click('#menu [data-a="b-coller"]'); await p(600);
ok(await ev(([i, av]) => { const E = seance().ecrans; return E.length === av.n + 1 && JSON.stringify(E[i].blocs) === av.blocs && E[i + 1].blocs.length === 1 && E[i + 1].blocs[0].t === 'schema' && /\(suite\)$/.test(E[i + 1].act) && E[i + 1].blocs[0].bid !== 'b-sim-vraie-carte'; }, [iAutre, avC]), 'coller un schéma sur une diapo pleine ne le pose pas dans une diapo nouvelle juste après (ou l\'origine a changé)');
ok(/Schéma collé dans une diapo nouvelle/.test(await toastTxt()), 'la notice ne dit pas où le schéma collé est parti');
await allerEid(opp.eid); const avD = await ev(() => seance().ecrans.length); cn = await coinDuSchema(); await page.mouse.click(cn.x, cn.y, { button: 'right' }); await p(300); it = await items(); const dup = it.find(x => x.a === 'b-dupliquer'); ok(dup && !dup.off && /diapo nouvelle/.test(dup.t), '« Dupliquer le bloc » sur un schéma ne dit pas qu\'il part dans une diapo nouvelle : ' + JSON.stringify(dup));
await page.click('#menu [data-a="b-dupliquer"]'); await p(600); ok(await ev(([i, n]) => { const E = seance().ecrans; return E.length === n + 1 && E[i].blocs.length === 1 && E[i + 1].blocs.length === 1 && E[i + 1].blocs[0].t === 'schema' && E[i + 1].blocs[0].bid !== E[i].blocs[0].bid; }, [await idx(opp.eid), avD]), 'dupliquer un schéma ne le pose pas dans une diapo nouvelle juste après, avec une nouvelle identité');
await allerEid('Le siècle des inventions'); await page.click('#mur [data-p="0.t"]', { button: 'right' }); await p(300); await page.click('#menu [data-a="b-copier"]'); await p(200);
await allerEid(opp.eid); cn = await coinDuSchema(); await page.mouse.click(cn.x, cn.y, { button: 'right' }); await p(300); it = await items(); const col2 = it.find(x => x.a === 'b-coller'); ok(col2 && col2.off && /^Cette diapo a son schéma : colle ce bloc dans la diapo suivante/.test(col2.t) /* (recalé en p8-3c §3) */, 'coller une consigne de plusieurs lignes sur une diapo à schéma n\'est pas grisé avec sa raison : ' + JSON.stringify(col2)); await page.keyboard.press('Escape'); await p(150);

// 5. la taille : « petit » grisé pour un schéma (normal ↔ grand)
const tailles = [];
for (let k = 0; k < 3; k++) { cn = await coinDuSchema(); await page.mouse.click(cn.x, cn.y, { button: 'right' }); await p(300); it = await items(); const ta = it.find(x => x.a === 'b-taille'); if (k === 0) ok(ta && !/petit/.test(ta.l) && /il n'a pas de taille « petit »/.test(ta.t) /* (recalé en p8-3c §3 : « petit » n'est plus proposé, l'infobulle dit pourquoi) */, 'la taille « petit » n\'est pas grisée pour un schéma, avec sa raison : ' + JSON.stringify(ta)); await page.click('#menu [data-a="b-taille"]'); await p(300); tailles.push(await ev(() => ecran().blocs[0].taille)); }
ok(tailles.join(',') === 'grand,normal,grand', 'la taille d\'un schéma ne tourne pas normal → grand → normal (jamais « petit ») : ' + tailles.join(','));

// 6. (recalé en p8-3c §2 : la trame d'avant la règle n'est plus dans ce que Paul joue — b-sim-schema est retirée. « À régler », « Schéma avec du texte », puis « Couper la diapo ici » et la ligne qui tombe sont éprouvés sur une COPIE de la maquette, dans test-p8-3c.mjs, partie 2)

// 7. le panneau du schéma (repris de l'existant) : la forme, « Un à un / Tout ensemble », le contenu, « ⌖ Réordonner » — chaque bouton avec son infobulle
await allerEid(opp.eid); const pan = await ev(() => { const z = document.getElementById('p8-panneau'); return z ? { titres: Array.from(z.querySelectorAll('button')).map(b => b.textContent + '=' + !!b.title), regle: z.querySelector('.p8-regle').textContent, reord: z.querySelector('#p8-reordonner').title } : null; });
ok(pan && pan.titres.length === 8 && pan.titres.every(x => /=true$/.test(x)) && /Une famille par ligne/.test(pan.regle) && /les places données à la main seront perdues/.test(pan.reord), 'le panneau du schéma n\'est pas complet (forme, Un à un / Tout ensemble, règle d\'écriture, Réordonner et ce qu\'il coûte) : ' + JSON.stringify(pan));
await page.click('#p8-panneau [data-p8dev="un"]'); await p(300); ok(await ev(() => ecran().blocs[0].devoilerTout === false && elements(ecran()).length === 4), '« Un à un » ne règle pas le schéma bulle par bulle');
await page.click('#p8-panneau [data-p8dev="tout"]'); await p(300); ok(await ev(() => ecran().blocs[0].devoilerTout === true && elements(ecran()).length === 0), '« Tout ensemble » ne fait pas paraître le schéma d\'un coup');
await page.click('#p8-src'); await page.keyboard.press('Control+End'); await page.keyboard.type('\nFigures nouvelles : essai'); await p(500);
ok(await ev(() => /Figures nouvelles : essai$/.test(ecran().blocs[0].src) && !!Array.from(document.querySelectorAll('#mur .p8-dessin g.p8-n')).find(g => g.textContent.includes('essai')) && document.activeElement && document.activeElement.id === 'p8-src'), 'écrire dans « Contenu » ne redessine pas le schéma, ou le curseur a quitté le champ');
ok(await ev(k => !!(ecran().blocs[0].pos || {})[k], kOx), 'la place donnée à la main a disparu avant « Réordonner »');
await page.click('#p8-reordonner'); await p(400); ok(await ev(() => Object.keys(ecran().blocs[0].pos || {}).length === 0) && /Réordonné/.test(await toastTxt()), '« ⌖ Réordonner » n\'efface pas les places données à la main');
await page.click('#p8-panneau [data-p8forme="frise"]'); await p(300); ok(await ev(() => ecran().blocs[0].forme === 'frise' && /Une date par ligne/.test(document.querySelector('#p8-panneau .p8-regle').textContent)), 'changer la forme ne change pas le dessin et sa règle d\'écriture'); await page.click('#p8-panneau [data-p8forme="carte"]'); await p(300);

fs.writeFileSync(capture('MESURES-p8-3.txt'), MES.join('\n') + '\n');
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
