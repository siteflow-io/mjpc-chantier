/* ═══ BANC É4 — LE VÉCU : le paquet complet, prouvé ligne à ligne ═══
   Scénario réel minuté : lancer avec une classe · naviguer (retours compris) ·
   temps réels simulés en reculant l'horloge d'ENTRÉE (jamais en trafiquant le résultat) ·
   décision T-5 · clôture. Le paquet est capté à la source (mjpcPutJson enveloppé au banc)
   ET relu en mémoire — les deux doivent coïncider. */
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core'); const path = require('path');
const OK = [], PB = [], J = { err: [] }; const t = (n, v) => (v ? OK : PB).push(n);
(async () => {
  const b = await puppeteer.launch({ args: [...chromium.args, '--disable-popup-blocking'],
    executablePath: await chromium.executablePath(), headless: 'shell', defaultViewport: { width: 1500, height: 980 } });
  const p = await b.newPage();
  p.on('pageerror', e => J.err.push(String(e).slice(0, 140)));
  p.on('dialog', async d => { try { await d.dismiss(); } catch (e) {} });
  await p.setRequestInterception(true);
  p.on('request', r => { const u = r.url();
    if (u.startsWith('file://') || u.startsWith('data:') || u.startsWith('about:')) return r.continue();
    if (u.includes('firebasedatabase.app')) return r.respond({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: 'null' });
    r.abort(); });
  await p.goto('file://' + path.resolve('livraison-E2.html') + '?n=3e', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1300));
  await p.evaluate(() => {
    chapitresData['3e'] = chapitresData['3e'] || {};
    chapitresData['3e']['10'] = { title: 'Poésie', seances: { s1: { title: 'S1', ordre: 1 } } };
    classesData = window.classesData || {}; classesData['_test_deroule'] = { niveau: '3e', nom: '3e Banc (test)' };
    window.__poserDecor && __poserDecor();
    /* le capteur du banc : toute écriture passe par mjpcPutJson — on note l'adresse et le corps */
    window.__ecrits = [];
    const vrai = window.mjpcPutJson;
    window.mjpcPutJson = function (url, donnees, motif, cb) {
      __ecrits.push({ url: String(url), donnees: JSON.parse(JSON.stringify(donnees)), motif: String(motif || '') });
      return vrai.apply(this, arguments);
    };
    AT = window.AT || {}; AT.flux = 'chapitre'; atEditerChapitre('3e', '10');
    var n = document.getElementById('at-zone');
    while (n && n.style) { n.style.display = 'block'; n.style.opacity = '1'; n.style.visibility = 'visible'; n = n.parentElement; }
    atVuesAller('deroule');
  });
  await p.waitForFunction(() => window.AT_PONT && AT_PONT.pret === true, { timeout: 20000 });
  await new Promise(r => setTimeout(r, 900));

  /* ── LANCER ── */
  await p.evaluate(() => { document.getElementById('at-dr-classe').value = '_test_deroule'; atDrJouerClic(); });
  await new Promise(r => setTimeout(r, 800));
  const frame = await (await p.$('#at-dr-iframe')).contentFrame();
  /* simulation cohérente des DEUX horloges : la séance a « commencé » il y a 8 min */
  await p.evaluate('AT_DR_VECU.debutReel -= 8*60000; undefined');
  const lance = await p.evaluate(() => ({ regime: AT_DR_REGIME, deb: !!AT_DR_VECU && !!AT_DR_VECU.debutReel }));
  t('séance lancée, vécu démarré', lance.regime === 'classe' && lance.deb);

  /* ── NAVIGUER avec retours : écran 0 (2 min simulées) → 1 (3 min) → retour 0 (1 min) → 2 ── */
  const recule = (min) => p.evaluate('AT_DR_VECU.courant.depuis -= ' + (min * 60000) + '; undefined');
  await recule(2); await frame.evaluate('va(1)'); await new Promise(r => setTimeout(r, 300));
  await recule(3); await frame.evaluate('va(0)'); await new Promise(r => setTimeout(r, 300));
  await recule(1); await frame.evaluate('pas(2)'); await new Promise(r => setTimeout(r, 300));
  const minutes = await p.evaluate(() => ({ e0: atVecuMinutes(0), e1: atVecuMinutes(1), pass0: (AT_DR_VECU.activites[0] || {}).passages }));
  t('temps réels mesurés par le vrai calcul : écran0=' + minutes.e0 + ' min (2 passages=' + minutes.pass0 + '), écran1=' + minutes.e1 + ' min',
    minutes.e0 === 3 && minutes.e1 === 3 && minutes.pass0 === 2);

  /* ── le panneau « Temps par activité » du moteur porte le réel ── */
  await p.evaluate(() => atVecuAfficher());
  const badge = await frame.evaluate(() => [...document.querySelectorAll('#durees .at-vecu')].map(e => e.textContent.trim()).slice(0, 3));
  t('badges « réel » dans le panneau du moteur : ' + JSON.stringify(badge), badge.some(x => /réel 3 min/.test(x)));

  /* ── T-5 : une décision ── */
  await p.evaluate(() => { var n = new Date(); var f = new Date(n.getTime() + 3 * 60000);
    AT_DR_COURS.fin = String(f.getHours()).padStart(2, '0') + ':' + String(f.getMinutes()).padStart(2, '0');
    AT_T5_VU = false; atT5Appliquer(); });
  await new Promise(r => setTimeout(r, 500));
  await p.evaluate(() => { var b2 = [...document.querySelectorAll('button')].find(x => /donner à la maison/.test(x.textContent)); if (b2) b2.click(); });
  await new Promise(r => setTimeout(r, 400));
  await p.evaluate(() => { var ok = [...document.querySelectorAll('button')].find(x => /Oui, continuer|Annuler/.test(x.textContent)); if (ok) ok.click();
    AT_T5_VU = true; clearInterval(AT_T5_TIMER); });
  await new Promise(r => setTimeout(r, 300));

  /* ── CLORE sans rien reprendre ── */
  await p.evaluate(() => atDrClore());
  await new Promise(r => setTimeout(r, 500));
  await p.evaluate(() => { var ok = [...document.querySelectorAll('button')].find(x => /Oui, continuer/.test(x.textContent)); if (ok) ok.click(); });
  await new Promise(r => setTimeout(r, 900));

  /* ── LE PAQUET : capté à la source ET relu en mémoire ── */
  const v = await p.evaluate(() => {
    const ecrit = __ecrits.filter(e => /vecu\.json$/.test(e.url)).pop() || null;
    const mem = ((chapitresData['3e']['10'].seances.s1.deroule_joue || {})._test_deroule || {}).vecu || null;
    return { ecrit, mem, regime: AT_DR_REGIME };
  });
  t('un PUT vécu unique, à l\'adresse canonique', !!v.ecrit && /\/site\/3e\/chapitres\/10\/seances\/s1\/deroule_joue\/_test_deroule\/vecu\.json$/.test(v.ecrit.url));
  const q = v.ecrit && v.ecrit.donnees;
  if (q) {
    t('classe et créneau portés : ' + q.classe + ' · ' + q.creneau, q.classe === '3e Banc (test)' && /^\d\d:\d\d-\d\d:\d\d$/.test(q.creneau));
    t('début/fin réels cohérents (durée jouée ' + q.minutesJouees + ' min)', q.finReel > q.debutReel && q.minutesJouees === Math.round((q.finReel - q.debutReel) / 60000) && q.minutesJouees >= 6 && q.minutesJouees <= 10);
    t('temps utile prévu porté : ' + q.tempsUtilePrevu + ' min', typeof q.tempsUtilePrevu === 'number');
    const a0 = (q.activites || []).find(a => a.n === 0), a1 = (q.activites || []).find(a => a.n === 1), a2 = (q.activites || []).find(a => a.n === 2);
    t('activité 0 : réel=' + (a0 && a0.reel) + ' min · passages=' + (a0 && a0.passages) + ' · prévu=' + (a0 && a0.prevu),
      !!a0 && a0.reel === 3 && a0.passages === 2 && typeof a0.prevu === 'number');
    t('activité 1 : réel=' + (a1 && a1.reel) + ' min · 1 passage', !!a1 && a1.reel === 3 && a1.passages === 1);
    t('activité 2 visitée présente, écrans jamais visités ABSENTS',
      !!a2 && (q.activites || []).every(a => [0, 1, 2].includes(a.n)));
    t('notions en CODES sur les lignes (doctrine id opaque) : ' + JSON.stringify((a1 || {}).comp),
      Array.isArray((a1 || {}).comp) && (a1.comp.length === 0 || /^c\d/.test(a1.comp[0])));
    t('décision T-5 dans le paquet : ' + JSON.stringify(q.decisions), /donnée à la maison/.test(JSON.stringify(q.decisions)));
    t('mémoire == écrit (même paquet aux deux endroits)', JSON.stringify(v.mem) === JSON.stringify(q));
  }
  t('après clôture : retour préparation, vécu refermé', v.regime === 'prep');

  console.log(JSON.stringify({ VERTS: OK, PROBLEMES: PB, erreursJS: J.err }, null, 1));
  await b.close(); process.exit(PB.length || J.err.length ? 1 : 0);
})().catch(e => { console.error('KO:', e.message); process.exit(2); });
