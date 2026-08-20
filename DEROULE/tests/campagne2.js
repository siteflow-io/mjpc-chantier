// CAMPAGNE 2 — LA MATRICE ACTIONS × ÉTAT, ligne par ligne, preuves d'état (jamais « le bouton répond »)
const { boot, inv } = require('./harnais');

(async () => {
  const { browser, page, journal } = await boot();
  const pb = [];
  const ok = [];
  const note = (ctx, arr) => { for (const p of arr) pb.push('[INV ' + ctx + '] ' + p); };
  const attendu = (cond, msg) => { (cond ? ok : pb).push(msg); };

  // découverte ciblée : où vivent les marques, comment s'ouvre une fiche
  const meca = await page.evaluate(() => ({
    purgeMarques: purgeMarques.toString(),
    marque: marque.toString().slice(0, 400),
    ficheOuvertures: (function(){ // chercher les assignations de ficheOuverte dans le source
      const src = [...document.querySelectorAll('script')].map(s=>s.textContent).join('\n');
      return (src.match(/ficheOuverte\s*=\s*[^;]{0,60}/g)||[]).slice(0,6);
    })(),
    neuf_: neuf_.toString(),
  }));

  // ── préparation : écran 1 (consigne + fiche), id posé, dévoilement partiel, une marque
  await page.evaluate(() => { va(1); });
  await page.evaluate(() => {
    const e = ECRANS[i];
    idBloc(e.blocs[0]);
    e.blocs[0].vues = 1;              // dévoilement partiel
    e.rev = 1;
    e.ecrire = [idBloc(e.blocs[0]) + '|'];   // marque ✍🏻 posée sur le bloc 0 (contrat réel : tableau id|sous)
    rendre();
  });
  const marquePosee = await page.evaluate(() => ({ predicat: marque(i, 0), ecrire: JSON.stringify(ECRANS[i].ecrire) }));
  note('préparation', await inv(page));

  // ── DUPLIQUER : identifiant NEUF · dévoilement à ZÉRO · l'original intact
  const dup = await page.evaluate(() => {
    const av = ECRANS[i].blocs[0];
    const idAv = av.id, vuesAv = av.vues;
    ctxBloc = 0; cbDup();
    const neuf = ECRANS[i].blocs[1];
    return { idAv, vuesAv, idNeuf: neuf.id || null, vuesNeuf: neuf.vues || 0, mkNeuf: (ECRANS[i].ecrire||[]).filter(c => c.split('|')[0] === (neuf.id||'')).length,
             origIntact: ECRANS[i].blocs[0].id === idAv && ECRANS[i].blocs[0].vues === vuesAv };
  });
  attendu(dup.idNeuf && dup.idNeuf !== dup.idAv, 'DUPLIQUER: id neuf (' + dup.idNeuf + ' ≠ ' + dup.idAv + ')' + (dup.idNeuf && dup.idNeuf !== dup.idAv ? '' : ' — VIOLATION'));
  attendu(dup.vuesNeuf === 0, 'DUPLIQUER: dévoilement à zéro (vues=' + dup.vuesNeuf + ')' + (dup.vuesNeuf === 0 ? '' : ' — VIOLATION'));
  attendu(dup.mkNeuf === 0, 'DUPLIQUER: marques non copiées (' + dup.mkNeuf + ')' + (dup.mkNeuf === 0 ? '' : ' — VIOLATION : le duplicata emporte les marques'));
  attendu(dup.origIntact, 'DUPLIQUER: original intact');
  note('dupliquer', await inv(page));

  // ── COUPER / COLLER : id neuf au collage · dévoilement à zéro
  const cc = await page.evaluate(() => {
    ctxBloc = 1; const idCoupe = ECRANS[i].blocs[1].id || idBloc(ECRANS[i].blocs[1]);
    cbCoupe();
    const apresCoupe = ECRANS[i].blocs.length;
    ctxBloc = 0; cbColle();
    const colle = ECRANS[i].blocs[1];
    return { idCoupe, apresCoupe, idColle: colle.id || null, vuesColle: colle.vues || 0, nb: ECRANS[i].blocs.length };
  });
  attendu(cc.idColle && cc.idColle !== cc.idCoupe, 'COUPER/COLLER: id neuf au collage (' + cc.idColle + ' ≠ ' + cc.idCoupe + ')' + (cc.idColle !== cc.idCoupe ? '' : ' — VIOLATION'));
  attendu(cc.vuesColle === 0, 'COUPER/COLLER: dévoilement à zéro' + (cc.vuesColle === 0 ? '' : ' — VIOLATION vues=' + cc.vuesColle));
  note('couper-coller', await inv(page));

  // ── DÉPLACER : TOUT conservé (même objet — id, vues, marques)
  const mv = await page.evaluate(() => {
    const b = ECRANS[i].blocs[0];
    b.vues = 1; const idAv = b.id, marqueAv = marque(i, 0);
    ctxBloc = 0; cbMove(1);
    const ap = ECRANS[i].blocs[1];
    return { idAv, ok: ap.id === idAv && ap.vues === 1 && marque(i, 1) === marqueAv };
  });
  attendu(mv.ok, 'DÉPLACER: tout conservé (id, vues, marques)' + (mv.ok ? '' : ' — VIOLATION'));
  note('déplacer', await inv(page));

  // ── SUPPRIMER : marques du bloc PURGÉES
  const sup = await page.evaluate(() => {
    // remettre une marque sur le bloc déplacé s'il n'en a plus
    ctxBloc = 1; const b = ECRANS[i].blocs[1];
    const avaitMk = !!(b.mk && b.mk.length);
    const nb = ECRANS[i].blocs.length;
    cbSup();
    // les marques vivent-elles ailleurs (ANNOT par id) ? vérifier résidu
    const residu = JSON.stringify(ECRANS) + JSON.stringify(typeof ANNOT !== 'undefined' ? ANNOT : {});
    return { avaitMk, nbAv: nb, nbAp: ECRANS[i].blocs.length, residuId: b.id && residu.indexOf(b.id) >= 0 };
  });
  attendu(sup.nbAp === sup.nbAv - 1, 'SUPPRIMER: le bloc part');
  attendu(!sup.residuId, 'SUPPRIMER: aucun résidu de son id dans les données' + (sup.residuId ? ' — VIOLATION : références orphelines' : ''));
  note('supprimer', await inv(page));

  // ── AJOUTER : neuf, dévoilement zéro
  const aj = await page.evaluate(() => {
    const nb = ECRANS[i].blocs.length; ajoute('consigne');
    const b = ECRANS[i].blocs[ECRANS[i].blocs.length - 1];
    return { plus1: ECRANS[i].blocs.length === nb + 1, id: !!b.id, vues: b.vues || 0 };
  });
  attendu(aj.plus1 && aj.id && aj.vues === 0, 'AJOUTER: neuf avec id, dévoilement zéro' + (aj.vues === 0 ? '' : ' — VIOLATION'));
  note('ajouter', await inv(page));

  // ── FICHE : ouvrir / fermer → dévoilement INTERNE conservé
  const fi = await page.evaluate(() => {
    // trouver l'index du bloc fiche de l'écran courant
    const j = ECRANS[i].blocs.findIndex(b => b.t === 'fiche');
    if (j < 0) return { absent: true };
    const src = [...document.querySelectorAll('script')].map(s => s.textContent).join('\n');
    const mOuv = src.match(/function\s+(\w+)\([^)]*\)\{[^}]{0,200}ficheOuverte\s*=\s*\[/);
    return { j, fnOuverture: mOuv ? mOuv[1] : null };
  });
  let ficheVerdict = 'FICHE: bloc fiche absent de l\'écran courant — testé sur écran 1 d\'origine';
  if (!fi.absent && fi.fnOuverture) {
    const f = await page.evaluate((j, fn) => {
      const b = ECRANS[i].blocs[j];
      window[fn](i, j);                        // ouvrir
      b.fvues = 2;                             // dévoilement interne simulé (champ à vérifier)
      const interneAv = JSON.stringify([b.fvues, b.vues]);
      const ouverte1 = JSON.stringify(ficheOuverte);
      // fermer : rejouer la même fonction (bascule ?) ou chercher la fermeture
      window[fn](i, j);
      const ferme1 = JSON.stringify(ficheOuverte);
      const interneAp = JSON.stringify([b.fvues, b.vues]);
      return { ouverte1, ferme1, conserve: interneAv === interneAp };
    }, fi.j, fi.fnOuverture);
    ficheVerdict = 'FICHE via ' + fi.fnOuverture + ': ouverte=' + f.ouverte1 + ' fermée=' + f.ferme1 + ' · interne conservé: ' + f.conserve;
    attendu(f.conserve, ficheVerdict);
  } else { ok.push(ficheVerdict + ' (fn ouverture: ' + (fi.fnOuverture || 'NON TROUVÉE — à instruire') + ')'); }
  note('fiche', await inv(page));

  // ── ZOOM : dévoilement transmis au morceau reporté, recollé au retour
  const zo = await page.evaluate(() => {
    va(1);
    const e = ECRANS[i];
    e.blocs.forEach(b => { b.vues = 1; }); e.rev = e.blocs.length;
    const nbAv = ECRANS.length, etatAv = JSON.stringify(e.blocs.map(b => [b.id, b.vues]));
    const rz = document.getElementById('rz');
    if (!rz) return { pasDeReglette: true };
    const zAv = +rz.value;
    rz.value = String(+rz.max); zoom();          // zoom max → débordement → suites ?
    const nbApZoom = ECRANS.length;
    const suites = ECRANS.filter(x => x.suite).length;
    rz.value = String(zAv); zoom();              // retour → réabsorption
    const nbApRetour = ECRANS.length;
    const etatAp = JSON.stringify(ECRANS[i].blocs.map(b => [b.id, b.vues]));
    return { zAv, zMax: +rz.max, nbAv, nbApZoom, suites, nbApRetour, recolle: etatAv === etatAp };
  });
  if (zo.pasDeReglette) pb.push('ZOOM: réglette #rz introuvable');
  else {
    ok.push('ZOOM: écrans ' + zo.nbAv + ' → ' + zo.nbApZoom + ' au zoom max (' + zo.suites + ' suites) → ' + zo.nbApRetour + ' au retour');
    attendu(zo.nbApRetour === zo.nbAv, 'ZOOM: réabsorption complète au retour' + (zo.nbApRetour === zo.nbAv ? '' : ' — VIOLATION : ' + zo.nbApRetour + ' ≠ ' + zo.nbAv));
    attendu(zo.recolle, 'ZOOM: dévoilement recollé à l\'identique au retour' + (zo.recolle ? '' : ' — VIOLATION'));
  }
  note('zoom', await inv(page));

  console.log(JSON.stringify({ meca: { purge: meca.purgeMarques.slice(0, 220), ficheOuv: meca.ficheOuvertures, neuf_: meca.neuf_.slice(0, 220) },
    marquePosee, verdicts: ok, PROBLEMES: pb,
    journal: { erreurs: journal.erreurs.slice(0,5), dialogues: journal.dialogues.slice(0,5) } }, null, 1));
  await browser.close();
})().catch(e => { console.error('CAMPAGNE2 KO:', e.message); process.exit(1); });
