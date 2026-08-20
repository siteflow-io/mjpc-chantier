// Banc LOT12 final — items publiés (published:true), chapitre et séance publiés,
// vérification par sélecteurs précis + clic réel + capture.
const { boot } = require('./harnais_lot12.js');
(async () => {
  const { browser, page, journal } = await boot();
  await page.evaluate(() => {
    currentLevel = '4e';
    TRACK.eleve = { is_prof: true, nom: 'TEST', prenom: 'Banc', niveau: '4e' };
    chapitresData['4e'] = { '1': { title: 'Chapitre de banc', published: true, seances: { '1': { title: 'Séance de banc', published: true, items: {
      'itA': { kind: 'diaporama', ref: 'dp-historique-001', title: 'Ancien diaporama historique', source: 'firebase_app', published: true },
      'itB': { kind: 'doc', ref: 'doc-001', title: 'Document banc temoin', source: 'firebase_app', published: true } } } } } };
  });
  const res = {};
  res.arbo = await page.evaluate(() => {
    const out = {};
    document.getElementById('page-validation').classList.remove('active');
    document.getElementById('page-home').classList.add('active');
    renderChapitres('4e');
    // déplier chapitre et séance si repliés
    const titres = [...document.querySelectorAll('.chapter-card, .chapter-header')];
    titres.slice(0,2).forEach(t => { try { t.click(); } catch(e){} });
    const itemEls = [...document.querySelectorAll('[class*=item]')].filter(e => (e.textContent||'').indexOf('Ancien diaporama historique') >= 0);
    const temoinEls = [...document.querySelectorAll('[class*=item]')].filter(e => (e.textContent||'').indexOf('Document banc temoin') >= 0);
    out.itemDiapoVisible = itemEls.length > 0;
    out.itemTemoinVisible = temoinEls.length > 0;
    // clic réel sur l'élément de l'item diaporama
    const avant = document.body.children.length;
    const overlaysAvant = document.querySelectorAll('.doc-viewer-overlay[style*="flex"], .gallery-viewer-overlay').length;
    if (itemEls[0]) itemEls[0].click();
    out.domStable = (document.body.children.length === avant);
    out.aucunOverlayOuvert = (document.querySelectorAll('.doc-viewer-overlay[style*="flex"], .gallery-viewer-overlay').length === overlaysAvant);
    return out;
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'capture-2-arborescence.png' });
  res.dialoguesApresClic = [...journal.dialogues];
  res.pageerrors = [...journal.erreurs];
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
