// (p8-5f) la diapo trop pleine se lit en pages, jamais hors du cadre — par la souris et le clavier, à 1280 et à 1920 px (dette n°13 · 16 ; complément p8-5f, point 8) :
// A atelier : diapo 1, huit lignes tapées sous le dernier bloc → « À régler » compte une ligne « trop pleine » de plus (règle 0.4), le mur dit « page 2 / 2 », la ligne tapée est sur la page affichée,
//   le curseur reste à la fin de la ligne tapée, rien n'est perdu de la frappe (la page a changé pendant qu'on tapait), aucun élément rendu ne dépasse le cadre ; Maj+← montre la page 1 ;
// B pilotage, heure lancée : la même diapo dit « page 1 / 2 » à 0 dévoilé ; ▶ jusqu'au premier élément de la page 2 → la page passe à 2 toute seule ; ◀ → page 1 ; la molette change de page ; rien hors du cadre à chaque étape ;
// C la fenêtre du tableau montre la même page que le pilote, et rien hors de son cadre ;
// D un seul bloc : des lignes ajoutées par Entrée dans l'unique bloc de la diapo 1, jusqu'à ce que la police au plancher ne le fasse plus tenir → en pages, comme avant, à l'atelier et au pilote
//   (la diapo 7 au curseur « texte au tableau » à 52 pt tient sans page : mesuré, voir la NOTE ; aucune diapo à un bloc de la maquette ne déborde) ;
// E la ligne seule trop haute : un paragraphe tapé de plus de quinze lignes sans Entrée → ancré en haut, coupé en bas, rien au-dessus du cadre, « À régler » le dit ;
// F la saisie tient : la frappe qui fait passer le bloc sur la page suivante n'efface rien et laisse le curseur dans la ligne (vérifié en A, en D et en E, à chaque largeur).
import { chromium, CHROMIUM, MAQUETTE, capture } from './env.mjs';
import fs from 'node:fs';
const nav = await chromium.launch({ executablePath: CHROMIUM, args: ['--no-sandbox','--allow-file-access-from-files'], headless: true });
const errs = []; const boites = []; const D = []; const MES = []; let N = 0; const ok = (c, m) => { N++; if (!c) D.push(m); };
const ouvrir = async W => { const ctx = await nav.newContext({ viewport: { width: W, height: W === 1920 ? 1080 : 800 } }); const pg = await ctx.newPage(); pg.on('pageerror', e => { errs.push(e.message); console.log('ERREUR JS :', e.message, (e.stack||'').split('\n')[1]); }); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss(); }); await pg.goto(MAQUETTE); await pg.waitForTimeout(600); return { ctx, pg }; };
const atelier = async pg => { await pg.click('#edt-cases [data-atelier="1"]'); await pg.waitForTimeout(500); if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); } };
const lancerDepuisAtelier = async pg => { await pg.click('#ong-pilotage'); await pg.waitForTimeout(300); await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(500); };
// « À régler » : la liste ouverte par son bouton ; on compte ses lignes « Diapo trop pleine »
const pleines = async pg => { await pg.click('#at-regler'); await pg.waitForTimeout(300); const t = await pg.textContent('.choix-obj'); await pg.click('.choix-obj .x'); await pg.waitForTimeout(150); return (t.match(/Diapo trop pleine/g) || []).length; };
// l'état du mur (lu, jamais modifié) : la page écrite, les éléments rendus et ceux qui sortent du cadre, le curseur
const mur = (pg, sel = '#mur') => pg.evaluate(sel => { const m = document.querySelector(sel); const R = m.getBoundingClientRect(); const c = m.querySelector('.corpsd'); const els = Array.from(c.querySelectorAll('[data-p]')).filter(e => { const b = e.getBoundingClientRect(); return b.height > 0 && b.width > 0; });
  const dessus = els.filter(e => e.getBoundingClientRect().top < R.top - 1).map(e => e.dataset.p); const dessous = els.filter(e => e.getBoundingClientRect().bottom > R.bottom + 1).map(e => e.dataset.p);
  const a = document.activeElement; const sel2 = getSelection(); const dansA = !!(a && a.dataset && a.dataset.p && sel2.rangeCount && a.contains(sel2.anchorNode));
  let finA = false; if (dansA) { const r = document.createRange(); r.selectNodeContents(a); r.setEnd(sel2.anchorNode, sel2.anchorOffset); finA = r.toString().length === a.textContent.length; }
  const ab = a && a.getBoundingClientRect ? a.getBoundingClientRect() : null;
  return { page: ((m.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), rendus: els.length, dessus, dessous, ancre: c.classList.contains('p85f-ancre'), scrollTop: c.scrollTop,
    focus: a && a.dataset ? a.dataset.p || null : null, focusVisible: !!(ab && ab.height > 0 && !a.closest('.hors') && ab.top >= R.top - 1 && ab.bottom <= R.bottom + 1), curseurDansLaLigne: dansA, curseurEnFin: finA,
    nDev: typeof S !== 'undefined' && S.mur !== undefined && typeof etatDiapo === 'function' ? etatDiapo().nDev : null }; }, sel);
const derniere = pg => pg.evaluate(() => { const e = ecran(); return { n: e.blocs.length, el: (e.blocs[e.blocs.length - 1].el || []).slice() }; });
const ligne = (W, i) => `Ligne ${i} tapée à ${W} px, assez longue pour prendre de la place dans la diapo.`;

for (const W of [1280, 1920]) {
  // A + B + C — atelier, puis pilotage heure lancée, puis la fenêtre du tableau
  { const { ctx, pg } = await ouvrir(W); await atelier(pg);
    const p0 = await pleines(pg); const a0 = await mur(pg);
    ok(a0.page === '' && !a0.dessus.length && !a0.dessous.length, `A ${W} · atelier, diapo 1 avant : une page, rien hors du cadre (« ${a0.page} »)`);
    await pg.click('#mur .p8-ecrire'); await pg.waitForTimeout(100);
    const tape = []; let pageMi = null;
    for (let i = 1; i <= 8; i++) { await pg.keyboard.type(ligne(W, i), { delay: 2 }); tape.push(ligne(W, i)); if (i === 3) pageMi = (await mur(pg)).page; if (i < 8) await pg.keyboard.press('Enter'); }
    await pg.waitForTimeout(300); const a1 = await mur(pg); const d1 = await derniere(pg);
    ok(/^page 2 \/ 2$/.test(a1.page), `A ${W} · atelier : le mur dit « page 2 / 2 » (« ${a1.page} »)`);
    ok(pageMi === '' , `A ${W} · atelier : la page a changé pendant la frappe (après 3 lignes : « ${pageMi} »)`);
    ok(a1.focus === (d1.n - 1) + '.7' && a1.focusVisible, `A ${W} · atelier : la ligne tapée (${a1.focus}) est sur la page affichée`);
    ok(a1.curseurDansLaLigne && a1.curseurEnFin, `A ${W} · atelier : le curseur reste à la fin de la ligne tapée`);
    ok(JSON.stringify(d1.el) === JSON.stringify(tape), `A ${W} · atelier : rien n'est perdu de la frappe (${d1.el.length} lignes, ${d1.el.join('').length} caractères pour ${tape.join('').length})`);
    ok(!a1.dessus.length && !a1.dessous.length && a1.scrollTop === 0, `A ${W} · atelier : aucun élément rendu ne dépasse le cadre (au-dessus : ${a1.dessus.join(',')} ; en dessous : ${a1.dessous.join(',')})`);
    const p1 = await pleines(pg);
    ok(p1 === p0 + 1, `A ${W} · « À régler » compte une ligne « trop pleine » de plus (${p0} → ${p1}) : le site ne coupe pas seul (règle 0.4)`);
    if (W === 1280) { await pg.click(`#mur [data-p="${d1.n - 1}.7"]`); await pg.keyboard.press('End'); await pg.waitForTimeout(200); await pg.screenshot({ path: capture('p8-5f-atelier-page-2-sur-2.png') }); }
    await pg.click('#numero'); await pg.waitForTimeout(150); await pg.keyboard.press('Shift+ArrowLeft'); await pg.waitForTimeout(300); const a2 = await mur(pg);
    ok(/^page 1 \/ 2$/.test(a2.page) && !a2.dessus.length && !a2.dessous.length, `A ${W} · atelier : Maj+← montre la page 1 (« ${a2.page} »), rien hors du cadre`);
    MES.push(`A ${W} · atelier : avant « ${a0.page || 'une page'} », ${a0.rendus} éléments ; 8 lignes tapées → « ${a1.page} », ${a1.rendus} éléments rendus, hors du cadre ${a1.dessus.length + a1.dessous.length}, curseur sur ${a1.focus} (fin de ligne : ${a1.curseurEnFin}) ; « trop pleine » ${p0} → ${p1} ; Maj+← → « ${a2.page} »`);

    await lancerDepuisAtelier(pg); const b0 = await mur(pg);
    ok(/^page 1 \/ 2$/.test(b0.page) && !b0.dessus.length && !b0.dessous.length, `B ${W} · pilotage : « page 1 / 2 » à 0 dévoilé (« ${b0.page} »), rien hors du cadre`);
    if (W === 1280) await pg.screenshot({ path: capture('p8-5f-pilote-page-1-sur-2.png') });
    let horsB = b0.dessus.length + b0.dessous.length; let clics = 0, avant = b0, b1 = b0; while (clics < 25) { await pg.click('#bdev'); await pg.waitForTimeout(120); clics++; avant = b1; b1 = await mur(pg); horsB = Math.max(horsB, b1.dessus.length + b1.dessous.length); ok(!b1.dessus.length && !b1.dessous.length, `B ${W} · pilotage : rien hors du cadre après ▶ n°${clics}`); if (/^page 2/.test(b1.page)) break; }
    const k2 = await pg.evaluate(() => S.pagesCourantes && S.pagesCourantes[1] ? S.pagesCourantes[1][0] : null);
    ok(/^page 2 \/ 2$/.test(b1.page) && /^page 1/.test(avant.page), `B ${W} · pilotage : ▶ jusqu'au premier élément de la page 2 → la page passe à 2 toute seule (au ▶ n°${clics} ; « ${avant.page} » → « ${b1.page} »)`);
    const vuSurPage = await pg.evaluate(() => { const n = etatDiapo().nDev; const l = document.querySelector(`#mur .corpsd [data-k="${n - 1}"]`); return !!l && !l.closest('.hors') && l.getBoundingClientRect().height > 0; });
    ok(vuSurPage, `B ${W} · pilotage : le dernier élément dévoilé est sur la page affichée`);
    if (W === 1280) await pg.screenshot({ path: capture('p8-5f-pilote-page-2-sur-2.png') });
    // C — la fenêtre du tableau, à la page 2 / 2 du pilote
    const [tab] = await Promise.all([ctx.waitForEvent('page'), pg.click('#bvideoproj')]); await tab.waitForLoadState(); await tab.setViewportSize({ width: 1280, height: 720 }); await tab.waitForTimeout(700);
    const t1 = await mur(tab, '#mur2');
    ok(t1.page === b1.page && !t1.dessus.length && !t1.dessous.length, `C ${W} · tableau : la même page que le pilote (« ${t1.page} » / « ${b1.page} »), rien hors de son cadre`);
    if (W === 1280) await tab.screenshot({ path: capture('p8-5f-tableau-page-2-sur-2.png') });
    await pg.click('#bprec'); await pg.waitForTimeout(300); const b2 = await mur(pg); await tab.waitForTimeout(400); const t2 = await mur(tab, '#mur2');
    ok(/^page 1 \/ 2$/.test(b2.page) && !b2.dessus.length && !b2.dessous.length, `B ${W} · pilotage : ◀ → page 1 (« ${b2.page} »), rien hors du cadre`);
    ok(t2.page === b2.page && !t2.dessus.length && !t2.dessous.length, `C ${W} · tableau : suit le pilote à la page 1 (« ${t2.page} »)`);
    const mc = await pg.$eval('#murcadre', e => { const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await pg.mouse.move(mc.x, mc.y); await pg.mouse.wheel(0, 120); await pg.waitForTimeout(300); const b3 = await mur(pg);
    ok(/^page 2 \/ 2$/.test(b3.page) && !b3.dessus.length && !b3.dessous.length, `B ${W} · pilotage : la molette change de page (« ${b3.page} »), rien hors du cadre`);
    await tab.waitForTimeout(400); const t3 = await mur(tab, '#mur2');
    ok(t3.page === b3.page && !t3.dessus.length && !t3.dessous.length, `C ${W} · tableau : suit la molette (« ${t3.page} »), rien hors de son cadre`);
    MES.push(`B ${W} · pilotage : 0 dévoilé « ${b0.page} » ; page 2 au ▶ n°${clics} (premier élément de la page 2 : k=${k2}) ; ◀ « ${b2.page} » ; molette « ${b3.page} » ; au plus ${Math.max(horsB, b2.dessus.length + b2.dessous.length, b3.dessus.length + b3.dessous.length)} élément(s) hors du cadre sur toutes les étapes`);
    MES.push(`C ${W} · tableau (1280 × 720) : « ${t1.page} », « ${t2.page} », « ${t3.page} » — les pages du pilote ; hors du cadre : ${[t1, t2, t3].map(t => t.dessus.length + t.dessous.length).join(', ')}`);
    await ctx.close(); }

  // D — un seul bloc qui ne tient plus : en pages, comme avant
  { const { ctx, pg } = await ouvrir(W); await atelier(pg);
    const n0 = await pg.evaluate(() => { const e = ecran(); return { blocs: e.blocs.length, el: (e.blocs[0].el || []).length }; });
    await pg.click(`#mur [data-p="0.${n0.el - 1}"]`); await pg.keyboard.press('End'); await pg.waitForTimeout(100);
    const tape = []; for (let i = 1; i <= 8; i++) { await pg.keyboard.press('Enter'); await pg.keyboard.type(ligne(W, i), { delay: 2 }); tape.push(ligne(W, i)); }
    await pg.waitForTimeout(300); const d1 = await mur(pg); const e1 = await pg.evaluate(() => { const e = ecran(); return { blocs: e.blocs.length, el: e.blocs[0].el.slice() }; });
    ok(e1.blocs === 1 && /^page \d \/ [2-9]$/.test(d1.page), `D ${W} · un seul bloc (${e1.blocs}) : en pages à l'atelier (« ${d1.page} »)`);
    ok(JSON.stringify(e1.el.slice(-8)) === JSON.stringify(tape) && d1.curseurDansLaLigne && d1.curseurEnFin && d1.focusVisible, `D ${W} · un seul bloc : la frappe tient (rien de perdu, curseur à la fin de la ligne, sur la page affichée)`);
    ok(!d1.dessus.length && !d1.dessous.length, `D ${W} · un seul bloc : rien hors du cadre à l'atelier`);
    await lancerDepuisAtelier(pg); const d2 = await mur(pg);
    ok(/^page 1 \/ [2-9]$/.test(d2.page) && !d2.dessus.length && !d2.dessous.length, `D ${W} · un seul bloc : en pages au pilote (« ${d2.page} »), rien hors du cadre`);
    MES.push(`D ${W} · un seul bloc de ${n0.el} → ${e1.el.length} éléments : atelier « ${d1.page} », pilote « ${d2.page} », hors du cadre : atelier ${d1.dessus.length + d1.dessous.length}, pilote ${d2.dessus.length + d2.dessous.length}`);
    await ctx.close(); }

  // E — la ligne seule plus haute que la diapo : ancrée en haut, coupée en bas
  { const { ctx, pg } = await ouvrir(W); await atelier(pg); const p0 = await pleines(pg);
    await pg.click('#mur .p8-ecrire'); await pg.waitForTimeout(100);
    const long = Array.from({ length: 30 }, (_, i) => `mot${i} et encore des mots pour faire une ligne qui ne finit pas`).join(' ');
    await pg.keyboard.type(long, { delay: 0 }); await pg.waitForTimeout(400);
    const e1 = await mur(pg); const d = await derniere(pg); const lignes = await pg.evaluate(f => { const l = document.querySelector(`#mur [data-p="${f}"]`); const lh = parseFloat(getComputedStyle(l).lineHeight) || parseFloat(getComputedStyle(l).fontSize) * 1.2; return Math.round(l.getBoundingClientRect().height / lh); }, e1.focus);
    ok(lignes >= 15 && d.el.length === 1 && d.el[0] === long, `E ${W} · un paragraphe de ${lignes} lignes, tapé sans Entrée, est entier (${d.el[0].length} caractères)`);
    ok(e1.ancre && !e1.dessus.length && e1.scrollTop === 0, `E ${W} · atelier : ancré en haut, coupé en bas, rien au-dessus du cadre (en dessous : ${e1.dessous.join(',')})`);
    ok(e1.curseurDansLaLigne && e1.curseurEnFin, `E ${W} · atelier : le curseur reste à la fin du paragraphe`);
    const p1 = await pleines(pg); ok(p1 === p0 + 1, `E ${W} · « À régler » le dit (« trop pleine » ${p0} → ${p1})`);
    if (W === 1280) await pg.screenshot({ path: capture('p8-5f-ligne-trop-haute.png') });
    await lancerDepuisAtelier(pg); let e2 = await mur(pg); let pire = e2.dessus.length; for (let i = 0; i < 12; i++) { await pg.click('#bdev'); await pg.waitForTimeout(100); e2 = await mur(pg); pire = Math.max(pire, e2.dessus.length); if (/^page (\d) \/ \1$/.test(e2.page)) break; }
    ok(pire === 0, `E ${W} · pilotage : rien au-dessus du cadre à aucune étape (« ${e2.page} », ancré : ${e2.ancre})`);
    MES.push(`E ${W} · paragraphe de ${lignes} lignes (${long.length} caractères) : atelier ancré=${e1.ancre}, scrollTop=${e1.scrollTop}, au-dessus ${e1.dessus.length}, coupé en dessous (${e1.dessous.length} élément) ; « trop pleine » ${p0} → ${p1} ; pilote : au plus ${pire} au-dessus`);
    await ctx.close(); }
}

fs.writeFileSync(capture('MESURES-p8-5f.txt'), MES.join('\n') + '\n'); console.log(MES.join('\n'));
if (boites.length) D.push('boîtes système ouvertes : ' + JSON.stringify(boites));
if (errs.length) D.push('erreurs JS : ' + JSON.stringify(errs)); console.log(N + ' vérifications'); console.log(D.length ? D.join('\n') : 'aucun défaut'); console.log('--- fin :', D.length, 'défaut(s)'); await nav.close();
