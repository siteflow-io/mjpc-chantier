// Banc C1 — écrans RENDUS : atelier / éditeur de chapitre / modale de liaison.
// Exécuté sur les DEUX fichiers (C1 8.57.1 et base 8.56.2) pour captures côte à côte.
const { boot } = require('./harnais_c1.js');
const fichier = process.argv[2], tag = process.argv[3];
(async () => {
  const { browser, page, journal } = await boot(fichier);
  await page.evaluate(() => {
    currentLevel = '4e';
    TRACK.eleve = { is_prof: true, nom: 'TEST', prenom: 'Banc', niveau: '4e' };
    document.body.classList.add('admin-mode');
    chapitresData['4e'] = { '1': { title: 'Chapitre de banc', published: true, seances: { '1': { title: 'Séance de banc', published: true, ordre: 1, items: {
      'itB': { kind: 'doc', ref: 'doc-001', title: 'Document banc temoin', source: 'firebase_app', published: true, ordre: 1 } } } } } };
  });
  const res = { fichier, tag };
  // ── ÉCRAN 1 : ATELIER (onglets stylés) ──
  res.atelier = await page.evaluate(() => {
    atelierOuvrir(); atRendreListe();
    const ong = document.querySelector('.at-onglet');
    const cs = ong ? getComputedStyle(ong) : null;
    return {
      onglets: [...document.querySelectorAll('.at-onglet')].map(b => b.textContent.trim()),
      ongletStyle: cs ? { minHeight: cs.minHeight, borderRadius: cs.borderRadius, padding: cs.padding } : 'AUCUN ONGLET',
    };
  });
  await page.screenshot({ path: `c1-ecran1-atelier-${tag}.png` });
  // ── ÉCRAN 2 : ÉDITEUR DE CHAPITRE (panneau, boutons, champs) ──
  res.editeur = await page.evaluate(() => {
    atEditerChapitre('4e', '1');
    const sec = document.querySelector('.at-sec'), secT = document.querySelector('.at-sec-t');
    const inp = document.querySelector('.at-edch-in, .at-edch-ta');
    const btn = document.querySelector('.at-btn');
    const g = e => e ? (s => ({ border: s.borderTopWidth + ' ' + s.borderTopStyle, minHeight: s.minHeight, background: s.backgroundColor }))(getComputedStyle(e)) : 'ABSENT';
    return { sec: g(sec), secTitre: g(secT), champ: g(inp), bouton: g(btn),
             nbSections: document.querySelectorAll('.at-sec').length,
             nbChamps: document.querySelectorAll('.at-edch-in,.at-edch-ta').length };
  });
  await page.screenshot({ path: `c1-ecran2-editeur-${tag}.png` });
  // ── ÉCRAN 3 : MODALE DE LIAISON ──
  res.modale = await page.evaluate(() => {
    openLinkModal('4e', '1', '1', 'itB');
    const ov = document.getElementById('link-modal');
    const btn = document.querySelector('.link-modal-btn'), inp = document.querySelector('.link-modal-input'), sel = document.querySelector('.link-modal-select');
    const mh = e => e ? getComputedStyle(e).minHeight : 'ABSENT';
    return { visible: ov && ov.classList.contains('visible'),
             btnMinH: mh(btn), inputMinH: mh(inp), selectMinH: mh(sel) };
  });
  await page.screenshot({ path: `c1-ecran3-modale-${tag}.png` });
  res.pageerrors = journal.erreurs; res.dialogues = journal.dialogues;
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();
