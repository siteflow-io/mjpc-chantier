// (p8-5e) la poignée des notes, en permanence — par la souris (dette n°13 · 15 ; filière micro, conscience n°13, 11/10) :
// 1 la poignée est visible et sous la barre des outils, en atelier, en classe et en répétition (avant p8-5e : seulement pendant la préparation du cahier) ;
// 2 tirée vers le haut, les notes grandissent et la diapo rétrécit ; tirée vers le bas, l'inverse ; la barre « ▶ Dévoiler » reste dans le cadre ;
// 3 la hauteur choisie reste d'une diapo à l'autre, de l'atelier au pilotage, et après « ■ Arrêter » la répétition ;
// 4 double-clic : la diapo reprend toute sa place ;
// 5 pendant la préparation du cahier, rien ne change : la poignée donne la place à la préparation, les notes restent réduites ;
// 6 en relecture, la poignée n'est pas à l'écran.
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const errs = []; const boites = []; const D = []; const MES = []; const ok = (c, m) => { if (!c) D.push(m); };
const ouvrir = async () => { const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await ctx.newPage(); pg.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); }); await pg.goto(MAQUETTE); await pg.waitForTimeout(600); return { ctx, pg }; };
const lancer = async pg => { await pg.click('#edt-cases [data-lancer="1"]'); await pg.waitForTimeout(500); };
const atelier = async pg => { await pg.click('#edt-cases [data-atelier="1"]'); await pg.waitForTimeout(500); if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); } };
const garde = async pg => { if (await pg.evaluate(() => document.getElementById('garde').classList.contains('on'))) { await pg.click('#garde-devant'); await pg.waitForTimeout(300); return true; } return false; };
// la géométrie : la poignée, la diapo, les notes, la barre, le cadre
const geo = pg => pg.evaluate(() => { const r = id => { const e = document.querySelector(id); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), visible: b.width > 0 && b.height > 0 && getComputedStyle(e).display !== 'none' }; }; return { poignee: r('#poignee-mur'), mur: r('#mur'), notes: r('.notes'), outils: r('.outils'), dev: r('#bdev'), compte: r('#compte'), scene: r('.scene'), part: Math.round((S.murPart || 1) * 100), reduites: !!document.querySelector('.notes.reduites') }; });
// tirer la poignée de dy pixels (négatif : vers le haut)
const tirer = async (pg, dy) => { const p = await pg.$eval('#poignee-mur', e => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await pg.mouse.move(p.x, p.y); await pg.mouse.down(); await pg.mouse.move(p.x, p.y + dy / 2, { steps: 4 }); await pg.mouse.move(p.x, p.y + dy, { steps: 4 }); await pg.mouse.up(); await pg.waitForTimeout(250); };

// 1 + 2 + 3 + 4 — atelier → pilotage (heure lancée) → répétition
{ const { ctx, pg } = await ouvrir(); await atelier(pg);
  const a0 = await geo(pg);
  ok(a0.poignee && a0.poignee.visible, '1 · atelier : la poignée est visible');
  ok(a0.poignee && a0.outils && a0.poignee.y >= a0.outils.y + a0.outils.h - 2 && a0.notes && a0.poignee.y <= a0.notes.y, '1 · atelier : la poignée est entre la barre des outils et les notes');
  await tirer(pg, -150); const a1 = await geo(pg);
  ok(a1.notes.h > a0.notes.h + 60 && a1.mur.h < a0.mur.h - 60 && a1.part < a0.part, '2 · atelier : tirée vers le haut, les notes grandissent et la diapo rétrécit');
  MES.push(`1-2 · atelier : poignée y=${a0.poignee.y} (outils ${a0.outils.y}+${a0.outils.h}, notes ${a0.notes.y}) ; tirée de 150 px vers le haut : diapo ${a0.mur.h} → ${a1.mur.h} px, notes ${a0.notes.h} → ${a1.notes.h} px, part ${a0.part} → ${a1.part} %`);
  await pg.click('#volet [data-at-di="1"]'); await pg.waitForTimeout(300); const a2 = await geo(pg);
  ok(a2.mur.h === a1.mur.h && a2.part === a1.part, '3 · atelier : la hauteur reste en changeant de diapo (diapo ' + a1.mur.h + ' → ' + a2.mur.h + ' px, part ' + a1.part + ' → ' + a2.part + ' %)'); /* les notes, elles, gagnent ou perdent la ligne que prend le titre de la diapo (une ou deux) : ce n'est pas la poignée */
  await pg.click('#ong-pilotage'); await pg.waitForTimeout(300); await lancer(pg); const c0 = await geo(pg);
  ok(c0.poignee.visible && c0.part === a1.part && c0.notes.h > a0.notes.h + 40, '3 · pilotage, heure lancée : la poignée est là et la hauteur de l\'atelier est gardée');
  ok(c0.dev.x + c0.dev.w <= c0.scene.x + c0.scene.w && c0.compte.x + c0.compte.w <= c0.scene.x + c0.scene.w + 1, '2 · pilotage : ▶ Dévoiler et le compteur restent dans le cadre');
  await tirer(pg, 300); const c1 = await geo(pg);
  ok(c1.part > c0.part && c1.mur.h > c0.mur.h + 60 && c1.notes.h < c0.notes.h - 60, '2 · pilotage : tirée vers le bas, la diapo grandit et les notes rétrécissent');
  await tirer(pg, -400); const c2 = await geo(pg);
  ok(c2.part === 30, '2 · pilotage : la diapo ne descend pas sous 30 % (tirée très haut : ' + c2.part + ' %)');
  const pgn = await pg.$eval('#poignee-mur', e => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
  await pg.mouse.dblclick(pgn.x, pgn.y); await pg.waitForTimeout(300); const c3 = await geo(pg);
  ok(c3.part === 100 && Math.abs(c3.mur.h - (await (async () => c3.mur.h)())) === 0 && c3.notes.h < c2.notes.h, '4 · pilotage : double-clic, la diapo reprend toute sa place (part ' + c3.part + ' %)');
  await pg.screenshot({ path: capture('p8-5e-classe-avant.png') }); await tirer(pg, -150); await pg.screenshot({ path: capture('p8-5e-classe-notes-agrandies.png') }); const c4 = await geo(pg);
  ok(c4.part < 100 && c4.notes.h > c3.notes.h + 60, '2 · pilotage : après le double-clic, tirée à nouveau de 150 px : les notes grandissent (' + c3.notes.h + ' → ' + c4.notes.h + ' px)');
  MES.push(`2-4 · pilotage : gardée de l'atelier part ${c0.part} % ; vers le bas → ${c1.part} % (diapo ${c0.mur.h} → ${c1.mur.h}) ; très haut → ${c2.part} % ; double-clic → ${c3.part} % (notes ${c2.notes.h} → ${c3.notes.h}) ; tirée de 150 px → ${c4.part} % (notes ${c4.notes.h}) ; ▶ à ${c0.dev.x + c0.dev.w} pour un cadre à ${c0.scene.x + c0.scene.w}`);
  // répétition : la poignée est là, un réglage fait en répétition reste après « ■ Arrêter »
  await pg.click('#ong-atelier'); await pg.waitForTimeout(300); await pg.click('#at-jouer'); await pg.waitForTimeout(400); const r0 = await geo(pg);
  ok(r0.poignee.visible, '1 · répétition : la poignée est visible');
  await tirer(pg, -120); const r1 = await geo(pg);
  ok(r1.part < r0.part && r1.notes.h > r0.notes.h + 40, '2 · répétition : tirée vers le haut, les notes grandissent');
  await pg.click('#rep-stop'); await pg.waitForTimeout(400); const r2 = await geo(pg);
  ok(r2.part === r1.part, '3 · après « ■ Arrêter », la hauteur réglée en répétition reste (' + r1.part + ' → ' + r2.part + ' %)');
  MES.push(`1-3 · répétition : part ${r0.part} → ${r1.part} % ; après Arrêter : ${r2.part} %`);
  await ctx.close(); }

// 5 — la préparation du cahier : rien ne change
{ const { ctx, pg } = await ouvrir(); await lancer(pg);
  await pg.click('#bsimu'); await pg.waitForTimeout(150); await pg.click('#s-t5'); await pg.waitForTimeout(500);
  if (await pg.$eval('#al-boite', b => getComputedStyle(b).display !== 'none')) { await pg.click('#al-preparer'); await pg.waitForTimeout(400); }
  const p0 = await geo(pg); const prep = await pg.evaluate(() => document.getElementById('corps').classList.contains('prep'));
  ok(prep && p0.poignee.visible && p0.reduites, '5 · préparation du cahier : la poignée est là, les notes sont réduites');
  await tirer(pg, 120); const p1 = await geo(pg);
  ok(p1.part > p0.part && p1.reduites && p1.notes.h === p0.notes.h, '5 · préparation : la poignée donne la place à la préparation, les notes restent réduites (' + p0.notes.h + ' → ' + p1.notes.h + ' px)');
  MES.push(`5 · préparation : part ${p0.part} → ${p1.part} %, notes réduites ${p0.notes.h} → ${p1.notes.h} px`);
  await ctx.close(); }

// 6 — la relecture
{ const { ctx, pg } = await ouvrir(); await lancer(pg);
  await pg.click('#ong-relecture'); await pg.waitForTimeout(400);
  const vis = await pg.$eval('#poignee-mur', e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; });
  ok(!vis, '6 · relecture : la poignée n\'est pas à l\'écran');
  MES.push('6 · relecture : poignée à l\'écran = ' + vis);
  await ctx.close(); }

fs.writeFileSync(capture('MESURES-p8-5e.txt'), MES.join('\n') + '\n'); console.log(MES.join('\n'));
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
