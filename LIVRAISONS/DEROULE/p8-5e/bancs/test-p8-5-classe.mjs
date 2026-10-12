// (p8-5) écrire en classe, dans la copie de la classe — par la souris et le clavier :
// heure lancée : corriger un mot → la copie a changé, la trame non ; le pilote et le tableau montrent la copie ; Entrée ne change pas la structure ;
// « Fin de l'heure » → la liste propose la diapo (sans réponse, la trame ne change pas) ; « oui » → la trame a changé ;
// une seconde correction, puis « non » → la trame n'a pas changé ; la répétition ne laisse aucune copie. Aucune boîte système.
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const ctx = await nav.newContext({ viewport: { width: 1536, height: 864 } }); const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); });
const boites = []; page.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); });
const D = []; const p = ms => page.waitForTimeout(ms); const ok = (c, m) => { if (!c) D.push(m); }; const ev = (f, a) => page.evaluate(f, a); const MES = [];
const mot = (pg, sel, m) => pg.evaluate(([sel, m]) => { const el = document.querySelector(sel); const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const k = n.textContent.indexOf(m); if (k >= 0) { const r = document.createRange(); r.setStart(n, k); r.setEnd(n, k + m.length); const b = r.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; } } return null; }, [sel, m]);
const trame = () => ev(() => ecran().blocs[0].txt); const copie = () => ev(() => JSON.stringify(S.copie || {}));
const finOuverte = () => ev(() => document.getElementById('droite').classList.contains('fin') && !!document.querySelector('#fin .p8-verse-liste, #fin .travail'));
const ligneVerse = eid => ev(eid => { const z = document.querySelector('.p8-verse[data-p8eid="' + eid + '"]'); return z ? { txt: z.innerText, oui: !!z.querySelector('[data-p8verse="oui"]'), non: !!z.querySelector('[data-p8verse="non"]'), titres: Array.from(z.querySelectorAll('[data-p8verse]')).map(b => b.title) } : null; }, eid);

await page.goto(MAQUETTE); await p(600); await page.click('#edt-cases [data-lancer="1"]'); await p(400);
const [tab] = await Promise.all([ctx.waitForEvent('page'), page.click('#bvideoproj')]); tab.on('pageerror', e => errs.push('tableau : ' + e.message)); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await p(600);
const eid = await ev(() => ecran().eid); const t0 = await trame(); const struct0 = await ev(() => JSON.stringify(ecran().blocs.map(b => [b.bid, b.t, (b.el || []).length])));

// 1. heure lancée : corriger un mot (double-clic sur le mot, la frappe) → la copie a changé, la trame non ; le pilote et le tableau montrent la copie
let m = await mot(page, '#mur [data-p="0.t"]', 'discute'); await page.mouse.dblclick(m.x, m.y); await p(200);
ok(await ev(() => document.activeElement && document.activeElement.dataset.p === '0.t' && document.activeElement.isContentEditable), 'heure lancée : le texte de la consigne ne s\'écrit pas d\'un clic');
ok(/copie de la classe/.test(await ev(() => document.querySelector('#mur [data-p="0.t"]').title)), 'heure lancée : l\'infobulle du texte ne dit pas que la correction va dans la copie de la classe');
await page.keyboard.type('échange', { delay: 40 }); await p(400);
const c1 = await ev(e => { const c = ((S.copie || {})[S.heure] || {})[e] || {}; const b = ecran().blocs[0]; return { t: (c[b.bid] || {}).t, trame: b.txt }; }, eid);
ok(/^Observe, échange, fais une hypothèse/.test(c1.t || '') && c1.trame === t0, 'la correction en classe n\'est pas dans la copie seule : ' + JSON.stringify(c1));
ok(/Observe, échange/.test(await ev(() => document.querySelector('#mur [data-p="0.t"]').textContent)) && /Observe, échange/.test(await tab.evaluate(() => document.querySelector('#mur2').textContent)), 'le pilote et le tableau ne montrent pas la copie de la classe');
await page.keyboard.press('Enter'); await p(300); ok(await ev(() => JSON.stringify(ecran().blocs.map(b => [b.bid, b.t, (b.el || []).length]))) === struct0, 'en classe, Entrée a changé la structure de la diapo (un élément de plus)');
await page.screenshot({ path: capture('p8-5-classe-pilote.png') }); await tab.screenshot({ path: capture('p8-5-classe-tableau.png') });
MES.push('p8-5-classe-pilote.png / p8-5-classe-tableau.png · heure lancée : « Observe, échange, … » au pilote et au tableau ; la trame dit encore « ' + t0 + ' »');

// 2. « Fin de l'heure » → la liste propose la diapo ; sans réponse, la trame ne change pas
await page.click('#bfin'); await p(700); ok(await finOuverte(), '« Fin de l\'heure » n\'ouvre pas l\'écran de fin');
let L = await ligneVerse(eid); ok(L && L.oui && L.non && /la classe a vu « Observe, échange/.test(L.txt) && /Verser dans la trame \?/.test(L.txt) && L.titres.every(t => t), 'la liste ne propose pas la diapo modifiée, en clair, avec « oui » et « non » et leurs infobulles : ' + JSON.stringify(L));
await page.screenshot({ path: capture('p8-5-fin-liste.png') }); MES.push('p8-5-fin-liste.png · « Fin de l\'heure » : ' + (L ? L.txt.replace(/\n/g, ' / ') : '—'));
await page.click('#f-fermer'); await p(400); ok(await trame() === t0, 'sans réponse, la trame a changé');
// … « oui » → la trame a changé
await page.click('#bfin'); await p(700); await page.click('.p8-verse[data-p8eid="' + eid + '"] [data-p8verse="oui"]'); await p(300);
ok(/^Observe, échange, fais une hypothèse/.test(await trame()), '« oui » ne verse pas la copie dans la trame : ' + await trame());
L = await ligneVerse(eid); ok(L && /Versé dans la trame/.test(L.txt), 'la liste ne dit pas que c\'est versé');
await page.screenshot({ path: capture('p8-5-fin-oui.png') }); MES.push('p8-5-fin-oui.png · après « Oui, verser » : la trame dit « ' + await trame() + ' »');
await page.click('#f-fermer'); await p(400);

// 3. une seconde correction, puis « non » → la trame n'a pas changé
const t1 = await trame(); m = await mot(page, '#mur [data-p="0.t"]', 'hypothèse'); await page.mouse.dblclick(m.x, m.y); await p(200); await page.keyboard.type('idée', { delay: 40 }); await p(400);
ok(/fais une idée/.test(JSON.stringify(await copie())) && await trame() === t1, 'la seconde correction n\'est pas dans la copie seule');
await page.click('#bfin'); await p(700); L = await ligneVerse(eid); ok(L && /fais une idée/.test(L.txt), 'la liste ne propose pas la seconde correction : ' + JSON.stringify(L));
await page.click('.p8-verse[data-p8eid="' + eid + '"] [data-p8verse="non"]'); await p(300);
ok(await trame() === t1, '« non » a changé la trame : ' + await trame()); L = await ligneVerse(eid); ok(L && /La trame ne change pas/.test(L.txt), 'la liste ne dit pas que la trame ne change pas');
await page.screenshot({ path: capture('p8-5-fin-non.png') }); MES.push('p8-5-fin-non.png · après « Non, garder la trame » : la trame dit « ' + t1 + ' », la copie de la classe garde « … fais une idée … »');
await page.click('#f-fermer'); await p(300); await tab.close();

// 4. la répétition ne laisse aucune copie (et la trame est identique après « ■ Arrêter »)
const pr = await ctx.newPage(); pr.on('pageerror', e => errs.push('répétition : ' + e.message)); pr.on('dialog', d => { boites.push(d.message()); d.dismiss(); });
await pr.goto(MAQUETTE); await pr.waitForTimeout(600); await pr.click('#edt-cases [data-atelier="1"]'); await pr.waitForTimeout(500); await pr.click('#at-aide .x'); await pr.waitForTimeout(200);
const tr0 = await pr.evaluate(() => JSON.stringify(seance().ecrans)); await pr.click('#at-jouer'); await pr.waitForTimeout(600);
m = await mot(pr, '#mur [data-p="0.t"]', 'discute'); await pr.mouse.dblclick(m.x, m.y); await pr.waitForTimeout(200); await pr.keyboard.type('échange', { delay: 30 }); await pr.waitForTimeout(300);
ok(/Observe, échange/.test(await pr.evaluate(() => document.querySelector('#mur [data-p="0.t"]').textContent)), 'en répétition, la correction ne s\'écrit pas');
await pr.click('#rep-stop'); await pr.waitForTimeout(600);
const apR = await pr.evaluate(t => ({ copie: JSON.stringify(S.copie || {}), textes: Object.values(parDiapo).some(d => Object.keys(d.textes || {}).length), trame: JSON.stringify(seance().ecrans) === t }), tr0);
ok(apR.copie === '{}' && !apR.textes && apR.trame, 'la répétition laisse une copie, ou la trame a changé : ' + JSON.stringify(apR));
MES.push('la répétition : après « ■ Arrêter », copie ' + apR.copie + ', trame identique : ' + apR.trame);
await pr.close();

fs.writeFileSync(capture('MESURES-p8-5.txt'), MES.join('\n') + '\n');
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
