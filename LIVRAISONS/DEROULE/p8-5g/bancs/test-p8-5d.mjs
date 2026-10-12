// (p8-5d) les notes suivent toujours la diapo, et le premier caractère — par la souris et le clavier (complément p8-5d, point 5) :
// 1 le panneau suit : heure lancée, dix caractères dans la note ⌂ de la diapo 1, ▶ jusqu'à la diapo 2, puis ◀ ;
// 2 la même chose par une vignette du volet (avec la garde « Y aller devant la classe »), et par ◀ depuis le début d'une diapo ;
// 3 dans l'atelier, un clic sur une autre diapo du volet pendant la frappe ;
// 4 le premier caractère : sur trois diapos, Entrée puis la frappe sans attente, trois fois ; le premier paragraphe d'une diapo sans note.
// Remplace le banc « taper pendant l'animation accélérée » de test-p8-5c (retiré : l'animation est une simulation, pas un cas de classe).
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const errs = []; const boites = []; const D = []; const MES = []; const ok = (c, m) => { if (!c) D.push(m); };
const ouvrir = async () => { const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await ctx.newPage(); pg.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); }); await pg.goto(MAQUETTE); await pg.waitForTimeout(600); return { ctx, pg }; };
const lancer = async pg => { await pg.click('#edt-cases [data-lancer="1"]'); await pg.waitForTimeout(500); };
const atelier = async pg => { await pg.click('#edt-cases [data-atelier="1"]'); await pg.waitForTimeout(500); if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); } };
const garde = async pg => { if (await pg.evaluate(() => document.getElementById('garde').classList.contains('on'))) { await pg.click('#garde-devant'); await pg.waitForTimeout(300); return true; } return false; };
// ce que montre le panneau : la clé de la diapo rendue (portée par chaque paragraphe), la diapo du moment, le focus, le texte
const panneau = pg => pg.evaluate(() => ({ cles: Array.from(document.querySelectorAll('#notesd .p8-mt')).map(x => x.dataset.p8key), cle: cle(), di: S.di, focus: !!(document.activeElement && document.activeElement.closest && document.activeElement.closest('#notesd')), texte: document.getElementById('notesd').textContent }));
const noteDe = (pg, k) => pg.evaluate(k => { const v = DATA.notes[k]; return v == null ? '' : typeof v === 'string' ? v : v.map(n => n.html.replace(/<[^>]+>/g, '')).join(' ¶ '); }, k);
const cleDe = (pg, i) => pg.evaluate(i => S.si + '|' + seance().ecrans[i].eid, i);
const taper = async (pg, sel, txt) => { await pg.click(sel); await pg.keyboard.press('Control+End'); await pg.keyboard.type(txt, { delay: 20 }); await pg.waitForTimeout(150); };
const DIX = 'Xàéèùç1234';

// ═══ 1. le panneau suit : ▶ jusqu'à la diapo 2, puis ◀
{ const { ctx, pg } = await ouvrir(); await lancer(pg); const k1 = await cleDe(pg, 0), k2 = await cleDe(pg, 1);
  await taper(pg, '#notesd .p8-mt', DIX); ok(await pg.evaluate(() => document.activeElement && document.activeElement.classList.contains('p8-mt')), '1 · la note ⌂ de la diapo 1 n\'a pas le focus pendant la frappe');
  let n = 0; while ((await pg.evaluate(() => S.di)) === 0 && n < 12) { await pg.click('#bdev'); await pg.waitForTimeout(150); await garde(pg); n++; }
  let P = await panneau(pg); const t1 = await noteDe(pg, k1);
  ok(P.di === 1 && P.cle === k2 && P.cles.length && P.cles.every(k => k === k2), '1 · après ▶ jusqu\'à la diapo 2, le panneau ne montre pas la diapo 2 : ' + JSON.stringify(P));
  ok(!P.focus, '1 · après ▶, un paragraphe des notes a encore le focus');
  ok(t1.includes(DIX) && !P.texte.includes(DIX), '1 · la note de la diapo 1 n\'a pas les dix caractères entiers, ou ils s\'affichent sur la diapo 2 : ' + JSON.stringify(t1.slice(-40)));
  await pg.screenshot({ path: capture('p8-5d-diapo2-apres-dev.png') }); MES.push('p8-5d-diapo2-apres-dev.png · ' + n + ' clics sur ▶ : diapo 2 (' + k2 + '), le panneau rend ' + P.cles.length + ' paragraphe(s) de ' + P.cles[0] + ', focus dans les notes : ' + P.focus + ' ; la note de la diapo 1 finit par « …' + t1.slice(-30) + ' »');
  await pg.click('#bprec'); await pg.waitForTimeout(250); await garde(pg); P = await panneau(pg);
  ok(P.di === 0 && P.cles.every(k => k === k1) && P.texte.includes(DIX), '1 · ◀ : le panneau ne remontre pas la diapo 1 avec les dix caractères : ' + JSON.stringify({ di: P.di, cles: P.cles }));
  await pg.screenshot({ path: capture('p8-5d-diapo1-retour.png') }); MES.push('p8-5d-diapo1-retour.png · ◀ : diapo 1, la note ⌂ finit par « …' + P.texte.slice(P.texte.indexOf(DIX) - 20, P.texte.indexOf(DIX) + DIX.length) + ' »');
  await ctx.close(); }

// ═══ 2. par une vignette du volet (garde « Y aller devant la classe »), puis par ◀ depuis le début d'une diapo
{ const { ctx, pg } = await ouvrir(); await lancer(pg); const k1 = await cleDe(pg, 0), k2 = await cleDe(pg, 1);
  await taper(pg, '#notesd .p8-mt', DIX);
  await pg.click('#volet .vig[data-i="1"]'); await pg.waitForTimeout(300); const g = await garde(pg);
  let P = await panneau(pg); let t1 = await noteDe(pg, k1);
  ok(g, '2 · la vignette n\'a pas ouvert la garde « Y aller devant la classe »');
  ok(P.di === 1 && P.cles.length && P.cles.every(k => k === k2) && !P.focus && t1.includes(DIX) && !P.texte.includes(DIX), '2 · par la vignette : le panneau ne suit pas, ou la note de la diapo 1 n\'est pas entière : ' + JSON.stringify({ P, t1: t1.slice(-30) }));
  // ◀ depuis le début de la diapo 2, en ayant écrit dans sa note
  const nDev2 = await pg.evaluate(() => etatDiapo().nDev); await taper(pg, '#notesd .p8-mt', 'Ici la deux');
  await pg.click('#bprec'); await pg.waitForTimeout(250); await garde(pg); P = await panneau(pg); const t2 = await noteDe(pg, k2);
  ok(nDev2 === 0, '2 · la diapo 2 n\'était pas à son début (dévoilée ' + nDev2 + ')');
  ok(P.di === 0 && P.cles.every(k => k === k1) && !P.focus && P.texte.includes(DIX) && t2.includes('Ici la deux') && !P.texte.includes('Ici la deux'), '2 · ◀ depuis le début de la diapo 2 : le panneau ne remontre pas la diapo 1, ou la note de la diapo 2 est perdue : ' + JSON.stringify({ di: P.di, cles: P.cles, t2 }));
  MES.push('2 · vignette 2 (garde ouverte : ' + g + ') puis ◀ depuis le début de la diapo 2 : diapo 1 rendue, la note de la diapo 2 dit « ' + t2 + ' »');
  await ctx.close(); }

// ═══ 3. dans l'atelier : un clic sur une autre diapo du volet pendant la frappe
{ const { ctx, pg } = await ouvrir(); await atelier(pg); const k1 = await cleDe(pg, 0), k2 = await cleDe(pg, 1);
  await pg.click('#notesd .p8-mt'); await pg.keyboard.press('Control+End'); await pg.keyboard.type(DIX, { delay: 20 });
  await pg.click('#volet .at-chap .d[data-at-di="1"]'); await pg.waitForTimeout(450); const P = await panneau(pg); const t1 = await noteDe(pg, k1);
  ok(P.di === 1 && P.cles.length && P.cles.every(k => k === k2) && !P.focus && t1.includes(DIX) && !P.texte.includes(DIX), '3 · atelier, clic sur la diapo 2 du volet pendant la frappe : ' + JSON.stringify({ P, t1: t1.slice(-30) }));
  MES.push('3 · atelier : diapo 2 rendue (' + P.cles[0] + '), la note de la diapo 1 finit par « …' + t1.slice(-20) + ' »');
  await ctx.close(); }

// ═══ 4. le premier caractère : Entrée puis la frappe sans attente
{ const { ctx, pg } = await ouvrir(); await atelier(pg); const R = [];
  for (const di of [0, 6, 12]) { await pg.click('#volet .at-chap .d[data-at-di="' + di + '"]'); await pg.waitForTimeout(450); const k = await pg.evaluate(() => cle());
    const lis = await pg.$$eval('#mur li[data-p]', l => l.map(x => x.dataset.p)); ok(lis.length >= 3, '4 · la diapo ' + (di + 1) + ' n\'a pas trois éléments');
    for (let i = 0; i < 3; i++) { await pg.click('#mur li[data-p="' + lis[i] + '"]'); await pg.waitForTimeout(80); const n = await pg.$$eval('#notesd .p8-mt', l => l.length); await pg.click('#notesd .p8-mt[data-p8n="' + (n - 1) + '"]'); await pg.keyboard.press('Control+End');
      await pg.keyboard.press('Enter'); await pg.keyboard.type('Xyz ' + di + '.' + i); await pg.waitForTimeout(150);
      const L = await pg.evaluate(k => (DATA.notes[k] || []).map(n => n.html), k); const attendu = 'Xyz ' + di + '.' + i; R.push(L.includes(attendu) ? attendu : '✗ ' + JSON.stringify(L.slice(-2)));
      ok(L.includes(attendu), '4 · diapo ' + (di + 1) + ', Entrée puis frappe sans attente : « ' + attendu + ' » n\'est pas entier : ' + JSON.stringify(L)); } }
  // le premier paragraphe d'une diapo sans note : la frappe dès le clic, puis Entrée et la frappe sans attente
  const sans = await pg.evaluate(() => seance().ecrans.findIndex((e, i) => i > 12 && DATA.notes[S.si + '|' + e.eid] == null && elements(e).length >= 2)); await pg.click('#volet .at-chap .d[data-at-di="' + sans + '"]'); await pg.waitForTimeout(450); const ks = await pg.evaluate(() => cle());
  ok(await pg.$$eval('#notesd .p8-mt', l => l.length === 1 && l[0].classList.contains('p8-vide')), '4 · la diapo ' + (sans + 1) + ' a déjà une note');
  await pg.click('#notesd .p8-mt'); await pg.keyboard.type('Premier'); await pg.keyboard.press('Enter'); await pg.keyboard.type('Deuxième'); await pg.keyboard.press('Enter'); await pg.keyboard.type('Troisième'); await pg.waitForTimeout(200);
  const Ls = await pg.evaluate(k => (DATA.notes[k] || []).map(n => n.html), ks);
  ok(JSON.stringify(Ls) === '["Premier","Deuxième","Troisième"]', '4 · le premier paragraphe d\'une diapo sans note, puis Entrée et la frappe sans attente : ' + JSON.stringify(Ls));
  MES.push('4 · Entrée puis frappe sans attente, sur les diapos 1, 7 et 13 : ' + R.join(' · ') + ' ; diapo ' + (sans + 1) + ' sans note : ' + JSON.stringify(Ls));
  await ctx.close(); }

fs.writeFileSync(capture('MESURES-p8-5d.txt'), MES.join('\n') + '\n'); console.log(MES.join('\n'));
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
