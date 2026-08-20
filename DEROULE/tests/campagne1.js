// CAMPAGNE 1 — inventaire + tableau + dévoilement intégral, invariants après CHAQUE action
const { boot, inv } = require('./harnais');

(async () => {
  const { browser, page, journal } = await boot();
  const pb = [];
  const note = (ctx, arr) => { for (const p of arr) pb.push('[' + ctx + '] ' + p); };

  // ── inventaire des 11 écrans : type de blocs, état de dévoilement
  const inventaire = await page.evaluate(() =>
    ECRANS.map((e, i) => ({
      i,
      grp: e.grp || null, suite: !!e.suite,
      blocs: e.blocs.map(b => b.t || b.type || Object.keys(b).slice(0, 3).join('|')),
      rev: e.rev,
    }))
  );

  // ── ouvrir la fenêtre Tableau (window.open) — la capturer
  const cible = new Promise(res => browser.once('targetcreated', t => res(t)));
  await page.evaluate(() => tableau());
  let tabPage = null;
  try {
    const t = await Promise.race([cible, new Promise(r => setTimeout(() => r(null), 4000))]);
    tabPage = t ? await t.page() : null;
  } catch (e) { pb.push('[tableau] ouverture: ' + e.message); }
  await new Promise(r => setTimeout(r, 600));
  note('après tableau()', await inv(page));
  if (!tabPage) pb.push('[tableau] la fenêtre Tableau ne s\'est PAS ouverte (window.open bloqué ou non appelé)');

  await page.screenshot({ path: '/home/claude/cap-01-pilotage.png' });
  if (tabPage) { try { await tabPage.screenshot({ path: '/home/claude/cap-02-tableau.png' }); } catch(e){ pb.push('[tableau] capture: '+e.message);} }

  // ── dévoilement intégral de l'écran courant, cran par cran, invariant à chaque ▶
  const devoileTout = async (ctx) => {
    for (let k = 0; k < 80; k++) {
      const avant = await page.evaluate(() => JSON.stringify([i, ECRANS[i].rev, ECRANS[i].blocs.map(b => b.vues || 0)]));
      await page.evaluate(() => devoile(1));
      await new Promise(r => setTimeout(r, 60));
      const apres = await page.evaluate(() => JSON.stringify([i, ECRANS[i].rev, ECRANS[i].blocs.map(b => b.vues || 0)]));
      const probs = await inv(page);
      if (probs.length) { note(ctx + ' cran ' + k, probs); break; }
      if (avant === apres) break; // plus rien à dévoiler
    }
  };

  // ── parcours des 11 écrans : aller, dévoiler tout, replier une fois, invariants
  for (let n = 0; n < inventaire.length; n++) {
    await page.evaluate(k => va(k), n);
    await new Promise(r => setTimeout(r, 120));
    note('va(' + n + ')', await inv(page));
    await devoileTout('écran ' + n + ' devoile');
    await page.evaluate(() => devoile(-1));
    await new Promise(r => setTimeout(r, 60));
    note('écran ' + n + ' replie', await inv(page));
  }
  await page.screenshot({ path: '/home/claude/cap-03-dernier-ecran-plein.png' });
  if (tabPage) { try { await tabPage.screenshot({ path: '/home/claude/cap-04-tableau-fin.png' }); } catch(e){} }

  // ── gel : geler, tenter 3 commandes, dégeler, invariants
  const gelOk = await page.evaluate(() => { try { gel(); return typeof gele !== 'undefined' ? gele : 'gele absent'; } catch (e) { return 'gel() KO: ' + e.message; } });
  await page.evaluate(() => { va(2); devoile(1); });
  await new Promise(r => setTimeout(r, 150));
  const pendantGel = await page.evaluate(() => (typeof gele !== 'undefined' ? gele : null));
  if (tabPage) { try { await tabPage.screenshot({ path: '/home/claude/cap-05-tableau-pendant-gel.png' }); } catch(e){} }
  note('pendant gel', await inv(page));
  await page.evaluate(() => { try { gel(); } catch (e) {} });
  await new Promise(r => setTimeout(r, 150));
  note('après dégel', await inv(page));

  console.log(JSON.stringify({
    inventaire,
    gel: { retourGel: gelOk, resteGeleApresCommandes: pendantGel },
    problemes: pb,
    journal: { erreurs: journal.erreurs, console: journal.console.slice(0, 10), dialogues: journal.dialogues, reseau: journal.reseau },
  }, null, 1));
  await browser.close();
})().catch(e => { console.error('CAMPAGNE KO:', e.message); process.exit(1); });
