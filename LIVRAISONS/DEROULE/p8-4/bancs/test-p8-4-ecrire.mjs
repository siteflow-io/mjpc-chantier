// (p8-4) écrire directement dans la diapo — par la souris et le clavier :
// atelier : sous le dernier bloc, deux lignes avec Entrée → un bloc « texte » de deux éléments, son identité dès la première lettre, enregistré ;
// atelier : corriger un mot dans une consigne → enregistré ; « + bloc » sans « Texte » ; « Changer de type » → question (structure et classes comparées
// à une question créée par le menu ; une question par ligne ; ▶ les dévoile une à une) ; « À régler » dit une diapo trop pleine, rien ne se coupe seul ;
// répétition : corriger un mot, le voir au tableau, « ■ Arrêter » → la trame est identique ; la saisie tient pendant le redessin (le tableau qui suit la frappe) ;
// heure lancée : le texte des blocs reste fermé, les réponses s'écrivent.
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const boites = []; page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a); const MES = [];
const idx = q => ev(q => seance().ecrans.findIndex(e => e.eid === q || e.act === q), q);
const allerA = async i => { await page.click('#volet .at-chap .d[data-at-di="' + i + '"]'); await p(450); };
const items = () => ev(() => Array.from(document.querySelectorAll('#menu .it')).map(b => ({ a: b.dataset.a, l: b.textContent, t: b.title, off: b.disabled })));
const toastTxt = () => ev(() => { const t = document.getElementById('at-toast'); return t && t.style.display !== 'none' ? t.textContent : ''; });
const save = () => ev(() => document.getElementById('at-save').textContent);
const attendreEnregistre = async () => { for (let k = 0; k < 12; k++) { if (/✔ enregistré/.test(await save())) return true; await p(500); } return false; };
/* le centre d'un mot dans un texte de la diapo : la souris le prend là (double-clic : le mot sélectionné) */
const mot = (sel, m) => ev(([sel, m]) => { const el = document.querySelector(sel); const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const k = n.textContent.indexOf(m); if (k >= 0) { const r = document.createRange(); r.setStart(n, k); r.setEnd(n, k + m.length); const b = r.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; } } return null; }, [sel, m]);
const fin = sel => ev(sel => { const el = document.querySelector(sel); const r = document.createRange(); r.selectNodeContents(el); const rs = r.getClientRects(); const b = rs[rs.length - 1]; return { x: b.right - 2, y: b.top + b.height / 2 }; }, sel);
await page.goto(MAQUETTE); await p(600); await page.click('#edt-cases [data-atelier="1"]'); await p(500); await page.click('#at-aide .x'); await p(200);

// 1. atelier : sous le dernier bloc, on clique et on écrit (décisions 2 et 5)
const iS = await idx('Le siècle des inventions'); await allerA(iS); const nb0 = await ev(() => ecran().blocs.length);
const zone = await ev(() => { const z = document.querySelector('#mur .p8-ecrire'); if (!z) return null; const r = z.getBoundingClientRect(); return { x: r.left + 40, y: r.top + r.height / 2, t: z.title, ed: z.isContentEditable }; });
ok(zone && zone.ed && /Clique ici et écris/.test(zone.t), 'pas de zone où écrire sous le dernier bloc, ou sans infobulle : ' + JSON.stringify(zone));
await page.mouse.click(zone.x, zone.y); await p(150); await page.keyboard.type('P'); await p(400);
const id1 = await ev(nb => { const b = ecran().blocs[nb]; return b ? { t: b.t, bid: b.bid, el: b.el, txt: b.txt } : null; }, nb0);
ok(id1 && id1.t === 'texte' && /^b/.test(id1.bid || '') && JSON.stringify(id1.el) === '["P"]', 'la première lettre ne crée pas un bloc « texte » avec son identité : ' + JSON.stringify(id1));
await page.keyboard.type('remière ligne', { delay: 30 }); await page.keyboard.press('Enter'); await p(300); await page.keyboard.type('Seconde ligne', { delay: 30 }); await p(300);
const b1 = await ev(nb => { const b = ecran().blocs[nb]; return { t: b.t, bid: b.bid, el: b.el, n: elements(ecran()).filter(x => x.b === nb).length, li: Array.from(document.querySelectorAll('#mur [data-p^="' + nb + '."]')).map(x => x.textContent) }; }, nb0);
ok(b1.t === 'texte' && b1.bid === id1.bid && JSON.stringify(b1.el) === '["Première ligne","Seconde ligne"]' && b1.n === 2, 'deux lignes tapées avec Entrée ne font pas un bloc « texte » de deux éléments (même identité) : ' + JSON.stringify(b1));
ok(await attendreEnregistre(), 'le bloc tapé n\'est pas « ✔ enregistré »'); await page.screenshot({ path: capture('p8-4-bloc-tape.png') });
MES.push('p8-4-bloc-tape.png · « ' + await ev(() => ecran().act) + ' » : le bloc tapé sous la consigne, ' + JSON.stringify(b1.el) + ', identité ' + b1.bid + ', « ✔ enregistré »');

// 2. atelier : corriger un mot dans une consigne existante (double-clic sur le mot, puis la frappe)
const m1 = await mot('#mur [data-p="0.t"]', 'troisième'); await page.mouse.dblclick(m1.x, m1.y); await p(200); await page.keyboard.type('deuxième', { delay: 30 }); await p(300);
const c1 = await ev(() => ecran().blocs[0].txt); ok(/^Regarde la deuxième bande de la frise/.test(c1), 'le mot corrigé n\'est pas dans la trame : ' + c1);
ok(await attendreEnregistre(), 'la correction n\'est pas « ✔ enregistré »');

// 3. « + bloc » ne propose plus le texte libre (décision 3)
await page.click('#at-bloc'); await p(300); const cartes = await ev(() => Array.from(document.querySelectorAll('.choix-obj .c')).map(c => c.dataset.t)); await page.click('.choix-obj .x'); await p(200);
ok(!cartes.includes('texte') && cartes.includes('consigne') && cartes.includes('question'), '« + bloc » propose encore « Texte », ou plus la consigne et la question : ' + cartes.join(','));
ok(/le texte, lui, s'écrit directement/.test(await ev(() => document.getElementById('at-bloc').title)), 'l\'infobulle de « + bloc » ne dit pas que le texte s\'écrit dans la diapo');

// 4. « Changer de type » → question (décision 4), comparé à une question créée par le menu
await page.click('#at-bloc'); await p(300); await page.click('.choix-obj .c[data-t="question"]'); await p(300); await page.fill('#of-q', 'Que change le télégraphe ?'); await page.fill('#of-r', 'La vitesse des nouvelles.'); await page.click('#of-ok'); await p(500);
const iMenu = await ev(() => ecran().blocs.length - 1);
let q0 = await mot('#mur [data-p="' + nb0 + '.0"]', 'Première'); await page.mouse.click(q0.x, q0.y, { button: 'right' }); await p(300);
let it = await items(); const ct = it.find(x => x.a === 'p8-type'); ok(ct && !ct.off && /disposition du type choisi/.test(ct.t), '« Changer de type… » n\'est pas dans le menu du bloc, avec son infobulle : ' + JSON.stringify(ct));
await page.click('#menu [data-a="p8-type"]'); await p(300); it = await items();
ok(['p8t-texte', 'p8t-consigne', 'p8t-question', 'p8t-schema'].every(a => it.some(x => x.a === a && x.t)) && it.find(x => x.a === 'p8t-texte').off && /déjà son type/.test(it.find(x => x.a === 'p8t-texte').t), 'le choix du type n\'a pas ses quatre types avec leur infobulle (le type actuel grisé, avec sa raison) : ' + JSON.stringify(it));
await page.click('#menu [data-a="p8t-question"]'); await p(600);
const q1 = await ev(([nb, im]) => { const E = ecran().blocs; const sig = bi => { const z = document.querySelector('#mur .bloc[data-bi="' + bi + '"]'); const etat = /^(pas|neuf-vu|spot-on|aecrire|deja|bloc-edit)$/; return z ? Array.from(z.querySelectorAll('*')).filter(x => !x.closest('.bloc-barre')).map(x => x.tagName.toLowerCase() + '.' + Array.from(x.classList).filter(c => !etat.test(c)).sort().join('.')).join(' ') : ''; }; const cles = b => Object.keys(b).sort().join(',') + ':' + typeof b.txt + ':' + Array.isArray(b.el); return { a: E[nb], b: E[nb + 1], sigA: sig(nb), sigB: sig(nb + 1), sigM: sig(im + 1), clesA: cles(E[nb]), clesM: cles(E[im + 1]), n: E.length }; }, [nb0, iMenu]);
ok(q1.a.t === 'question' && q1.b.t === 'question' && q1.a.txt === 'Première ligne' && q1.b.txt === 'Seconde ligne' && q1.a.bid === id1.bid && q1.b.bid !== id1.bid, 'les deux lignes ne sont pas deux questions, à leur place (la première garde l\'identité) : ' + JSON.stringify([q1.a, q1.b]));
ok(q1.clesA === q1.clesM && q1.sigA === q1.sigM && q1.sigB === q1.sigM, 'la question changée de type n\'a pas la structure ou les classes d\'une question créée par le menu — données ' + q1.clesA + ' / ' + q1.clesM + ' ; rendu « ' + q1.sigA + ' » / « ' + q1.sigM + ' »');
MES.push('« Changer de type » → question : structure ' + q1.clesA + ' ; rendu « ' + q1.sigA + ' » — identiques à la question créée par le menu');
await page.screenshot({ path: capture('p8-4-change-question.png') });
// au pilote (répétition), ▶ les dévoile une à une ; au tableau aussi
await page.click('#at-jouer'); await p(500); const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); tab.on('pageerror', e => errs.push('tableau : ' + e.message)); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(700);
const EL = await ev(() => elements(ecran()).map(x => (x.q ? 'Q:' : '') + x.b)); const N = EL.length; const vusQ = []; let deux = 0;
for (let s = 0; s <= N; s++) { const vt = await tab.evaluate(() => Array.from(document.querySelectorAll('#mur2 .q')).filter(x => getComputedStyle(x).display !== 'none').map(x => x.textContent.trim())); const vp = await ev(() => Array.from(document.querySelectorAll('#mur .q:not(.pas)')).map(x => x.textContent.trim())); vusQ.push(vt.length); if (JSON.stringify(vt) !== JSON.stringify(vp)) deux++; if (s === N) { await page.screenshot({ path: capture('p8-4-questions-pilote.png') }); await tab.screenshot({ path: capture('p8-4-questions-tableau.png') }); } if (s < N) { await page.keyboard.press('ArrowRight'); await p(350); } }
ok(vusQ.every((v, k) => !k || v - vusQ[k - 1] <= 1) && vusQ[N] === 3 && vusQ.indexOf(1) >= 0 && vusQ.indexOf(2) > vusQ.indexOf(1), 'au tableau, ▶ ne dévoile pas les questions une à une : ' + vusQ.join(','));
ok(deux === 0, 'le pilote et le tableau ne montrent pas les mêmes questions à ' + deux + ' ▶');
MES.push('p8-4-questions-pilote.png / p8-4-questions-tableau.png · les questions vues au tableau à chaque ▶ (' + EL.join(' ') + ') : ' + vusQ.join(','));
await page.click('#rep-stop'); await p(500);

// 5. « À régler » : un bloc tapé qui ne tient plus — rien ne se coupe seul, la liste le dit
await allerA(iS); const zf = await ev(() => { const z = document.querySelector('#mur .p8-ecrire'); const r = z.getBoundingClientRect(); return { x: r.left + 40, y: r.top + r.height / 2 }; }); await page.mouse.click(zf.x, zf.y); await page.keyboard.type('U'); await p(400);
for (let k = 0; k < 9; k++) { await page.keyboard.press('Enter'); await p(150); await page.keyboard.type('une ligne de plus, la ' + (k + 2) + 'e', { delay: 5 }); } await p(500);
const nB = await ev(() => ecran().blocs.length); await page.click('#at-regler'); await p(400); const reg = await ev(() => document.querySelector('.choix-obj').innerText); await page.click('.choix-obj .x'); await p(200);
ok(/Diapo trop pleine/.test(reg) && /Couper la diapo ici/.test(reg) && await ev(n => ecran().blocs.length === n, nB), 'un bloc tapé qui ne tient plus : « À régler » ne le dit pas, ou la diapo s\'est coupée seule');

// 6. répétition : corriger un mot, le voir au tableau ; « ■ Arrêter » → la trame est identique à ce qu'elle était avant
const iR = await idx('Les règles héritées'); await allerA(iR); await p(300);
const trame0 = await ev(() => JSON.stringify(seance().ecrans));
await page.click('#at-jouer'); await p(600); await tab.bringToFront(); await page.bringToFront(); await p(300);
for (let k = 0; k < 3; k++) { await page.keyboard.press('ArrowRight'); await p(300); }
const m2 = await mot('#mur [data-p="0.0"]', 'fixe'); await page.mouse.dblclick(m2.x, m2.y); await p(200); await page.keyboard.type('libre', { delay: 40 }); await p(500);
ok(/Une forme libre : le sonnet/.test(await ev(() => document.querySelector('#mur [data-p="0.0"]').textContent)) && /Une forme libre : le sonnet/.test(await tab.evaluate(() => document.querySelector('#mur2').textContent)), 'en répétition, le mot corrigé ne se voit pas au tableau');
// la saisie tient : chaque frappe redessine le pilote et le tableau (le tableau suit la frappe) ; le texte qui a le focus n'est jamais effacé, le curseur reste
const f1 = await fin('#mur [data-p="0.1"]'); await page.mouse.click(f1.x, f1.y); await p(200); const sc0 = await ev(() => document.getElementById('murcadre') ? document.getElementById('murcadre').scrollTop : 0);
const avantT = await ev(() => document.querySelector('#mur [data-p="0.1"]').textContent); let redessins = 0; const ajout = ' — à retenir';
for (const ch of ajout) { const r0 = await tab.evaluate(() => document.querySelector('#mur2').textContent); await page.keyboard.type(ch); await p(120); const r1 = await tab.evaluate(() => document.querySelector('#mur2').textContent); if (r1 !== r0) redessins++; }
const tient = await ev(() => { const a = document.activeElement; const s = getSelection(); return { p: a && a.dataset ? a.dataset.p : null, txt: a ? a.textContent : '', off: s.anchorOffset, nd: s.anchorNode && (s.anchorNode === a || a.contains(s.anchorNode)) }; });
ok(tient.p === '0.1' && tient.txt === avantT + ajout && tient.nd && tient.off === (tient.txt.length) && redessins >= ajout.trim().length, 'la saisie ne tient pas pendant les redessins : ' + JSON.stringify(tient) + ', redessins du tableau ' + redessins + ' sur ' + ajout.length + ' frappes');
ok(await ev(() => document.getElementById('murcadre') ? document.getElementById('murcadre').scrollTop : 0) === sc0, 'le défilement a bougé pendant la saisie');
MES.push('la saisie tient : ' + ajout.length + ' frappes en répétition, ' + redessins + ' redessins du tableau constatés (le tableau suit la frappe : à chaque frappe, le pilote et le tableau sont redessinés) ; le texte et le curseur restent');
await page.screenshot({ path: capture('p8-4-repetition-pilote.png') }); await tab.screenshot({ path: capture('p8-4-repetition-tableau.png') });
// en répétition, sous le dernier bloc aussi
const zr = await ev(() => { const z = document.querySelector('#mur .p8-ecrire'); if (!z) return null; const r = z.getBoundingClientRect(); return { x: r.left + 40, y: r.top + r.height / 2 }; }); ok(!!zr, 'en répétition, pas de zone où écrire sous le dernier bloc');
if (zr) { await page.mouse.click(zr.x, zr.y); await page.keyboard.type('R'); await p(400); await page.keyboard.type('épétition', { delay: 20 }); await p(300); ok(await ev(() => ecran().blocs.some(b => b.t === 'texte' && (b.el || [])[0] === 'Répétition')), 'en répétition, écrire sous le dernier bloc ne crée pas le bloc'); }
await page.click('#rep-stop'); await p(700);
ok(await ev(t0 => JSON.stringify(seance().ecrans) === t0, trame0), 'après « ■ Arrêter », la trame n\'est pas identique à ce qu\'elle était avant la répétition');
ok(await ev(() => !S.repetition && S.atelier), '« ■ Arrêter » ne revient pas à l\'atelier');

// 7. heure lancée : le texte des blocs reste fermé (p8-5), les réponses s'écrivent
await tab.close(); const pg2 = await ctx.newPage(); pg2.on('pageerror', e => errs.push('heure lancée : ' + e.message)); pg2.on('dialog', d => { boites.push(d.message()); d.dismiss(); }); await pg2.goto(MAQUETTE); await pg2.waitForTimeout(600); await pg2.click('#edt-cases [data-lancer="1"]'); await pg2.waitForTimeout(400);
const cons = await pg2.evaluate(() => { const t = document.querySelector('#mur [data-p="0.t"]'); return { ed: t.isContentEditable, txt: ecran().blocs[0].txt, zone: !!document.querySelector('#mur .p8-ecrire') }; });
const pc = await pg2.evaluate(() => { const r = document.querySelector('#mur [data-p="0.t"]').getBoundingClientRect(); return { x: r.left + 30, y: r.top + r.height / 2 }; }); await pg2.mouse.click(pc.x, pc.y); await pg2.keyboard.type('zz'); await pg2.waitForTimeout(300);
ok(!cons.ed && !cons.zone && await pg2.evaluate(t => ecran().blocs[0].txt === t, cons.txt), 'heure lancée : le texte d\'un bloc s\'écrit, ou la zone sous le dernier bloc est là : ' + JSON.stringify(cons));
const qb = await pg2.evaluate(() => seance().ecrans.findIndex(e => e.act.includes('Question-bilan'))); await pg2.click('#volet .vig[data-i="' + qb + '"]'); await pg2.waitForTimeout(200); if (await pg2.evaluate(() => document.getElementById('garde').classList.contains('on'))) { await pg2.click('#garde-devant'); await pg2.waitForTimeout(200); }
await pg2.keyboard.press('ArrowRight'); await pg2.waitForTimeout(200); await pg2.click('#mur .rep.libre .ini'); await pg2.keyboard.type('ga'); await pg2.keyboard.press('Enter'); await pg2.keyboard.type('Une nature immense.'); await pg2.keyboard.press('Enter'); await pg2.waitForTimeout(300); await pg2.keyboard.press('Escape');
ok(await pg2.evaluate(() => Array.from(document.querySelectorAll('#mur .rep .dit')).some(x => /Une nature immense/.test(x.textContent))), 'heure lancée : la réponse ne s\'écrit plus');
await pg2.screenshot({ path: capture('p8-4-heure-lancee.png') }); MES.push('p8-4-heure-lancee.png · heure lancée : le texte de la consigne n\'est pas écrivable, pas de zone sous le dernier bloc ; la réponse « Une nature immense. » s\'écrit');
await pg2.close();

fs.writeFileSync(capture('MESURES-p8-4.txt'), MES.join('\n') + '\n');
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
