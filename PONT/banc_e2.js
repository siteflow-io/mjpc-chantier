/* ═══ BANC É2 — la fusion cadre n°7 + pont, sur écrans RENDUS ═══ */
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const path = require('path');
const OK = [], PB = [], J = { err: [], dial: [], put: [] };
const t = (nom, v) => (v ? OK : PB).push(nom);

(async () => {
  const b = await puppeteer.launch({ args: [...chromium.args, '--disable-popup-blocking'],
    executablePath: await chromium.executablePath(), headless: 'shell',
    defaultViewport: { width: 1500, height: 980 } });
  const p = await b.newPage();
  p.on('pageerror', e => J.err.push(String(e).slice(0, 160)));
  p.on('dialog', d => { J.dial.push(d.message().slice(0, 60)); d.dismiss(); });
  await p.setRequestInterception(true);
  p.on('request', r => {
    const u = r.url();
    if (u.startsWith('file://') || u.startsWith('data:') || u.startsWith('about:')) return r.continue();
    if (u.includes('firebasedatabase.app')) {
      if (!['GET', 'OPTIONS'].includes(r.method())) J.put.push(r.method() + ' ' + u.slice(40, 110));
      return r.respond({ status: 200, contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' }, body: 'null' });
    }
    r.abort();
  });

  await p.goto('file://' + path.resolve('livraison-E2.html') + '?n=3e', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1300));

  /* chapitre de banc 3e/10 avec 5 séances vides + classes → le décor de la coiffe se pose */
  await p.evaluate(() => {
    chapitresData['3e'] = chapitresData['3e'] || {};
    chapitresData['3e']['10'] = { title: 'Poésie et peinture au XIXe', seances: {
      s1: { title: 'S1 — Cours suivi', ordre: 1 }, s2: { title: 'S2 — L’Albatros', ordre: 2 },
      s3: { title: 'S3 — Interro et analyse logique', ordre: 3 }, s4: { title: 'S4 — Dictée', ordre: 4 },
      s5: { title: 'S5 — Correction', ordre: 5 } } };
    classesData = window.classesData || {};
    classesData['_test_deroule'] = { niveau: '3e', nom: '3e Banc (test)' };
    window.__poserDecor && __poserDecor();
    AT = window.AT || {}; AT.flux = 'chapitre';
    atEditerChapitre('3e', '10');
    var n = document.getElementById('at-zone');
    while (n && n.style) { n.style.display = 'block'; n.style.opacity = '1'; n.style.visibility = 'visible'; n = n.parentElement; }
  });
  await new Promise(r => setTimeout(r, 500));

  const decor = await p.evaluate(() => (chapitresData['3e']['10'].seances.s1.deroule || {}).ecrans?.length || 0);
  t('coiffe: décor posé sur s1 (' + decor + ' écrans)', decor >= 5);

  /* ① Structure enveloppée : barre + éditeur intact dedans */
  const st = await p.evaluate(() => ({
    barre: [...document.querySelectorAll('.at-vues-barre .at-onglet')].map(b => b.dataset.vue).join(','),
    editeur: !!document.querySelector('.at-vues-cadre .ed2-grille'),
    police: getComputedStyle(document.querySelector('.at-vues-barre .at-onglet')).fontFamily
  }));
  t('Structure: 4 onglets (' + st.barre + '), éditeur enveloppé intact', st.barre === 'structure,deroule,relecture,papier' && st.editeur);
  t('Garamond sur les onglets: ' + st.police.slice(0, 24), /Garamond/i.test(st.police));
  await p.screenshot({ path: 'caps/e2-01-structure.png' });

  /* ② PRÉPARATION : tête bleue, sélecteurs, suivi masqué, cadre intègre, décor S1 rendu */
  await p.evaluate(() => atVuesAller('deroule'));
  await p.waitForFunction(() => window.AT_PONT && AT_PONT.pret === true, { timeout: 20000 });
  await new Promise(r => setTimeout(r, 900));
  const frame = await (await p.$('#at-dr-iframe')).contentFrame();
  const prep = await p.evaluate(() => ({
    regime: AT_DR_REGIME, integ: AT_PONT.ecart,
    tete: (document.querySelector('.at-dr-tete .at-dr-lib') || {}).textContent || '',
    arbre: !!document.getElementById('at-arbre'),
    minis: document.querySelectorAll('#at-arbre .at-ecr').length
  }));
  const jeu = await frame.evaluate(() => ({ nb: ECRANS.length, prem: ECRANS[0].act,
    bqui: (document.getElementById('bqui') || {}).disabled,
    note: !!document.querySelector('.pilote .at-dr-suivi-note') }));
  t('PRÉPARATION: régime=' + prep.regime + ', intègre=' + (prep.integ === null), prep.regime === 'prep' && prep.integ === null);
  t('trame S1 du décor rendue dans le jeu: ' + jeu.nb + ' écrans (' + jeu.prem + ')', jeu.nb === 6 && /Plan de la séance/.test(jeu.prem));
  t('suivi en préparation: bqui GRISÉ (règle É88, jamais disparu)=' + jeu.bqui + ', note=' + jeu.note, jeu.bqui === true && jeu.note === true);
  t('miniatures dans le sommaire natif: ' + prep.minis, prep.minis === 6);
  await p.screenshot({ path: 'caps/e2-02-preparation.png' });

  /* ③ le temps au canon : créneau 10:07-11:02, début 10:14 → 43 min utiles */
  const temps = await p.evaluate(() => {
    document.getElementById('at-dr-creneau').value = '10:07-11:02';
    var d = document.getElementById('at-dr-debut'); d.value = '10:14'; atDrMajUtile();
    return (document.getElementById('at-dr-utile') || {}).textContent || '';
  });
  t('temps utile 10:14→11:02 : « ' + temps.trim() + ' »', /43/.test(temps));

  /* ④ enregistrement automatique : un geste d'édition du moteur → sauve() → PUT (bloqué-compté) */
  const putAvant = await p.evaluate(() => {
    var n = 0; return n; });
  await frame.evaluate(() => { ctxBloc = 0; cbDup(); });   /* geste réel : dupliquer un bloc */
  await new Promise(r => setTimeout(r, 1400));
  const enr = await p.evaluate(() => (document.getElementById('at-dr-etat') || {}).textContent || '');
  t('autosave après geste réel (cbDup): « ' + enr + ' »', /enregistr/i.test(enr));

  /* ⑤ LANCER LA SÉANCE : copie par classe, régime classe, suivi visible, vécu démarré */
  await p.evaluate(() => {
    document.getElementById('at-dr-classe').value = '_test_deroule';
    atDrJouerClic();
  });
  await new Promise(r => setTimeout(r, 900));
  const cls = await p.evaluate(() => ({
    regime: AT_DR_REGIME, cours: AT_DR_COURS,
    copie: !!chapitresData['3e']['10'].seances.s1.deroule_joue?._test_deroule,
    vecu: !!AT_DR_VECU
  }));
  const jeu2 = await frame.evaluate(() => ({ bqui: (document.getElementById('bqui') || {}).disabled }));
  t('EN CLASSE: régime=' + cls.regime + ', copie horodatée=' + cls.copie + ', vécu démarré=' + cls.vecu,
    cls.regime === 'classe' && cls.copie && cls.vecu);
  t('suivi actif en classe (bqui grisé=' + jeu2.bqui + ')', jeu2.bqui === false);
  await p.screenshot({ path: 'caps/e2-03-en-classe.png' });

  /* ⑥ navigation → vécu par activité (l'enveloppe de rendre capte va ET pas) */
  await frame.evaluate(() => { va(1); });
  await new Promise(r => setTimeout(r, 400));
  await frame.evaluate(() => { pas(1); });
  await new Promise(r => setTimeout(r, 400));
  const vecu = await p.evaluate(() => ({
    act: Object.keys(AT_DR_VECU.activites), courant: AT_DR_VECU.courant && AT_DR_VECU.courant.n,
    halo: [...document.querySelectorAll('#at-arbre .at-ecr')].findIndex(e => e.classList.contains('at-ecr-sel'))
  }));
  t('vécu: activités visitées=[' + vecu.act + '], courant=' + vecu.courant, vecu.courant === 2 && vecu.act.includes('0') && vecu.act.includes('1'));
  t('[LOT1-①] le halo de la colonne suit (écran ' + vecu.halo + ')', vecu.halo === 2);

  /* ⑦ T-5 : fin forcée à +4 min → appel dans la tête + modale nommant les notions */
  await p.evaluate(() => {
    var n = new Date(); var f = new Date(n.getTime() + 4 * 60000);
    AT_DR_COURS.fin = String(f.getHours()).padStart(2, '0') + ':' + String(f.getMinutes()).padStart(2, '0');
    atT5Appliquer();
  });
  await new Promise(r => setTimeout(r, 500));
  const t5 = await p.evaluate(() => ({
    appel: (document.getElementById('at-dr-t5-appel') || {}).textContent || '',
    modale: document.body.innerText.includes('ne seront pas travaill') || document.body.innerText.includes('Aucune notion'),
    notions: /c4-culture-02|c4-oral-02|c4-langue-01/.test(document.body.innerText)
  }));
  t('T-5: appel discret « ' + t5.appel.slice(0, 40) + '… »', /décider/.test(t5.appel));
  t('T-5: la modale nomme les notions non travaillées', t5.modale && t5.notions);
  await p.screenshot({ path: 'caps/e2-04-t5-modale.png' });
  await p.evaluate(() => { var f = document.querySelector('.cm-fond,.cm-modale,#cm-fond'); if (f) f.remove(); });

  /* ⑧ modification en classe puis CLÔTURE : la modale propose la reprise, empreinte signifiante */
  await frame.evaluate(() => { ECRANS[0].blocs[0].txt = 'Texte modifié PENDANT le cours.'; });
  await p.evaluate(() => atDrClore());
  await new Promise(r => setTimeout(r, 600));
  const clot = await p.evaluate(() => ({
    reprise: document.body.innerText.includes('reprendre certaines dans ta pr'),
    detail: document.body.innerText.includes('modifié PENDANT le cours')
  }));
  t('clôture: « Reprendre dans ma préparation » proposé, détail avant→après montré', clot.reprise && clot.detail);
  await p.screenshot({ path: 'caps/e2-05-cloture-reprise.png' });
  /* valider sans rien cocher → rien repris, vécu écrit (PUT compté), retour préparation */
  await p.evaluate(() => { var ok = [...document.querySelectorAll('button')].find(b => /Oui, continuer|Confirmer/i.test(b.textContent.trim())); if (ok) ok.click(); });
  await new Promise(r => setTimeout(r, 800));
  const fin = await p.evaluate(() => ({ regime: AT_DR_REGIME, vecu: AT_DR_VECU }));
  t('après clôture: retour PRÉPARATION, vécu refermé', fin.regime === 'prep' && fin.vecu === null);
  const bandeau = await p.evaluate(() => (document.getElementById('bac-bandeau') || {}).textContent || '');
  const nb = +(bandeau.match(/(\d+) écriture/) || [0, 0])[1];
  t('coiffe: écritures bloquées EN AMONT (bandeau: « ' + bandeau.slice(0, 70) + ' »)', nb >= 2);
  t('aucune écriture n’a atteint le réseau: ' + J.put.length, J.put.length === 0);

  /* ⑨ survie : Structure (re-rendu) puis retour — le jeu reprend, pas de rechargement */
  await p.evaluate(() => { atVuesAller('structure'); });
  await new Promise(r => setTimeout(r, 400));
  await p.evaluate(() => { atVuesAller('deroule'); });
  await new Promise(r => setTimeout(r, 600));
  const f2 = await (await p.$('#at-dr-iframe')).contentFrame();
  const sur = await f2.evaluate(() => ({ nb: ECRANS.length, env: window.__pontEnv }));
  t('SURVIE: cadre non rechargé après aller-retour (enveloppe en place, ' + sur.nb + ' écrans)', sur.env === true);
  await p.screenshot({ path: 'caps/e2-06-retour.png' });

  console.log(JSON.stringify({ VERTS: OK, PROBLEMES: PB, erreursJS: J.err, dialogues: J.dial, ecrituresBloquees: J.put }, null, 1));
  await b.close();
  process.exit(PB.length || J.err.length ? 1 : 0);
})().catch(e => { console.error('KO:', e.message); process.exit(2); });
