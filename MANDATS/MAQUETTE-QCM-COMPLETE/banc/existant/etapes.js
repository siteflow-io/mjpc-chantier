// Le parcours de la 7.7.1 pour le relevé : chaque écran dont une scène de la maquette part.
module.exports = async function(o){
  const {mk, btn, sleep, relever, etape} = o;
  const C = s => s;   // les scènes, telles que les nomme le sommaire
  // ── L'accueil, l'élève qui entre ──
  const el = await mk("");
  await relever(el, "accueil", ["c-accueil"], {phrases:true});
  await etape("choix de la classe", async () => { await btn(el, /Mode élève/).click(); await sleep(800); await relever(el, "eleve-classe", [], {phrases:true, comment:"Aucune scène n'en part : l'élève entre par « Combien êtes-vous sur cette tablette ? » (558)."}); });
  await etape("identification", async () => { await el.getByText("3 ESSAI").first().click(); await sleep(800); await relever(el, "eleve-login", ["t-login", "t-login-inconnu"], {phrases:true}); });
  // ── La console : en-tête, évaluations, préparation, données, réglages ──
  const prof = await mk("?mode=prof");
  await relever(prof, "console-lancer", ["c-lancer", "c-echange-refuse", "c-demo-lancer", "c-demo-faite", "c-papier-lancer", "c-reprendre", "c-rattrapage"]);
  await etape("mode d'emploi", async () => { await btn(prof, /Mode d'emploi/).click(); await sleep(800); await relever(prof, "mode-emploi", ["c-mode-emploi"], {racine:".help-modal"}); await prof.locator(".help-modal-back").click({position:{x:5, y:5}}); await sleep(400); });
  await etape("QR", async () => { await btn(prof, /QR pilotage/).click(); await sleep(800); await relever(prof, "qr", ["c-qr"], {racine:".modal"}); const x = prof.locator(".modal-close"); if(await x.count()) { await x.first().click(); await sleep(400); } });
  await etape("évaluations", async () => { await btn(prof, /^📝 Évaluations$/).click(); await sleep(800); await relever(prof, "evaluations", ["c-evals", "c-eval-corbeille"]); });
  await etape("prompt IA", async () => { await btn(prof, /Prompt IA/).click(); await sleep(800); await relever(prof, "prompt-ia", ["c-reglages-prompt"], {racine:".modal"});
    await btn(prof, /Modifier le prompt/).click(); await sleep(600); await relever(prof, "prompt-ia-edition", ["c-reglages-prompt"], {racine:".modal", comment:"Le prompt en modification : « 💾 Enregistrer », « ↩️ Annuler », « 🔄 Restaurer le prompt par défaut » (l. 6496–6500)."});
    await prof.locator(".modal-close").first().click(); await sleep(400); });
  await etape("nouvelle évaluation", async () => { await btn(prof, /Nouvelle évaluation/).click(); await sleep(800); await relever(prof, "nouvelle-evaluation", ["c-collage"], {racine:".modal"}); await prof.locator(".modal-close").first().click(); await sleep(400); });
  await etape("éditeur", async () => { await btn(prof, /Modifier/).first().click(); await sleep(1000); await relever(prof, "editeur", ["x627-3-editeur"], {racine:".modal"}); await prof.locator(".modal-close").first().click(); await sleep(400); });
  await etape("impression", async () => { await btn(prof, /Imprimer/).first().click(); await sleep(1000); await relever(prof, "impression", ["c-feuille"]); const f = prof.getByRole("button", {name:/Fermer/}); if(await f.count()){ await f.first().click(); await sleep(400); } });
  await etape("préparation", async () => { await btn(prof, /Préparation/).click(); await sleep(800); await relever(prof, "preparation", [], {comment:"Aucune scène n'en part : un seul onglet « 📝 Évaluations » (423)."}); });
  await etape("données", async () => { await btn(prof, /^Données$/).click(); await sleep(800); await relever(prof, "donnees-resultats-vide", []); });
  await etape("réglages", async () => { await btn(prof, /^Réglages$/).click(); await sleep(800); await relever(prof, "reglages", ["c-reglages", "c-reglages-prompt"]); });
  // ── La séance ──
  await etape("lancer", async () => {
    await btn(prof, /^Pilotage$/).click(); await sleep(500); await btn(prof, /Pilotage classe/).click(); await sleep(600);
    const sels = prof.locator("select"); await sels.nth(0).selectOption({label:"3 ESSAI (25 élèves)"}); await sleep(400); await sels.nth(1).selectOption({index:1}); await sleep(600);
    await btn(prof, /Lancer la session/).click(); await sleep(1000);
    await relever(prof, "checkin", ["c-appel"], {racine:".checkin-modal"});
    await prof.locator(".checkin-modal").getByRole("button", {name:/Lancer la session/}).click(); await sleep(2000);
    await relever(prof, "pilot-attente", ["c-pret"]);
  });
  await etape("élève connecté", async () => {
    await el.getByPlaceholder("Mon code (4 chiffres)").fill("2101"); await el.getByPlaceholder("Prénom").fill("Julien"); await el.getByPlaceholder("Nom", {exact:true}).fill("ABRIAL"); await btn(el, /Entrer/).click(); await sleep(2500);
    await relever(el, "eleve-attente-depart", ["t-pret", "t-attest-1", "t-attest-2", "t-binome"], {phrases:true});
  });
  await etape("réflexion", async () => {
    await btn(prof, /Lancer Q1/).click(); await sleep(1200);
    await relever(prof, "pilot-reflexion", ["c-q1-reflexion"]);
    await btn(prof, /Départ d'un élève/).click(); await sleep(800); await relever(prof, "depart", ["c-depart"], {racine:".checkin-modal"}); await prof.locator(".checkin-modal").getByRole("button", {name:"Annuler"}).click(); await sleep(300); await relever(el, "eleve-reflexion", ["t-q1-reflexion", "t-q2-reflexion", "t-demo-q", "t-q2-ecartee"], {phrases:true});
  });
  // La phase réponse se ferme seule à la fin du chrono court (7.7.1, l.7849) : le tableau et le téléphone sont ouverts avant.
  await etape("tableau et téléphone", async () => { o.board = await o.mk("?mode=prof&view=board"); o.tel = await o.mk("?mode=prof&view=phone", {width:390, height:844}); });
  await etape("réponse", async () => {
    await btn(prof, /Autoriser la réponse/).click(); await sleep(700);
    await relever(prof, "pilot-reponse", ["c-q1-tour1", "c-q1-tour2", "c-q2-tour2", "c-fin-prevue", "c-parti"]);
    await relever(el, "eleve-reponse", ["t-q1-tour1", "t-q1-tour2", "t-q2-tour1", "t-q2-tour2", "t-q3-tour1", "t-q3-tour2", "t-rouvrir-un"], {phrases:true});
    await el.locator(".eleve-choix-btn").nth(1).click({timeout:3000}); await sleep(400);
    await relever(el, "eleve-reponse-donnee", ["t-q1-tour1", "t-q2-tour2", "t-q3-tour2"], {phrases:true});
    await relever(o.board, "tableau-reponse", ["b-reponse"], {phrases:true});
  });
  await etape("question close", async () => {
    const c = btn(prof, /Clore la question/); if(await c.count()) await c.click({timeout:3000});
    await sleep(1500);
    await relever(prof, "pilot-close", ["c-q1-close", "c-q2-close", "c-ecartee", "c-annulee", "c-deplacer"]); await relever(el, "eleve-attente-question", ["t-q1-attente"], {phrases:true});
await relever(o.board, "tableau-close", [], {phrases:true, comment:"Aucune scène n’en part : le tableau entre deux questions est inchangé."});
  });
  await etape("dernière question", async () => {
    for(let i = 0; i < 9; i++){ await btn(prof, /Q suiv/).click(); await sleep(400); }
    await btn(prof, /Autoriser la réponse/).click(); await sleep(600); await el.locator(".eleve-choix-btn").nth(0).click({timeout:3000}); await sleep(300);
    const c = btn(prof, /Clore la question/); if(await c.count()) await c.click({timeout:3000}); await sleep(1500);
    await relever(prof, "pilot-derniere-close", ["c-q3-close"]);
  });
  await etape("autoévaluation", async () => {
    await btn(prof, /Lancer l'autoévaluation/).click(); await sleep(1500);
    await relever(prof, "pilot-autoeval", ["c-estim"]); await relever(el, "eleve-autoeval", ["t-estim", "t-papier-estim"], {phrases:true});
await relever(o.board, "tableau-autoeval", [], {phrases:true, comment:"Aucune scène n’en part."});
    await el.locator(".autoeval-fourchette").first().click(); await sleep(800);
    await relever(el, "eleve-autoeval-fait", ["t-estim"], {phrases:true});
  });
  await etape("correction avant", async () => {
    await btn(prof, /Lancer la correction/).click(); await sleep(1500);
    await relever(prof, "pilot-correction-avant", ["c-corr-q2-avant", "c-corr-q2-lu"]);
    o.vide(el, "eleve-correction-avant");
    await relever(o.board, "tableau-correction-avant", ["b-recopie"], {phrases:true});
  });
  await etape("correction après", async () => {
    await btn(prof, /Révéler/).click(); await sleep(1500);
    await relever(prof, "pilot-correction-apres", ["c-corr-q2-apres", "c-corr-q3-apres", "c-corr-q1-apres", "c-autonomie", "c-autonomie-garde", "c-autonomie-retiree"]);
    o.vide(el, "eleve-correction-apres");
    await relever(o.board, "tableau-correction-apres", ["b-correction"], {phrases:true});
  });
  const reconnecter = async () => { await el.reload(); await sleep(1500); await btn(el, /Mode élève/).click(); await sleep(600); await el.getByText("3 ESSAI").first().click(); await sleep(600);
    await el.getByPlaceholder("Mon code (4 chiffres)").fill("2101"); await el.getByPlaceholder("Prénom").fill("Julien"); await el.getByPlaceholder("Nom", {exact:true}).fill("ABRIAL"); await btn(el, /Entrer/).click(); await sleep(2500); };
  // La dernière « Question suivante → » de la correction passe la séance en « finie » (l.7596–7601) : bilan classe et bilan de l'élève.
  await etape("bilan", async () => {
    for(let i = 0; i < 10; i++){ await btn(prof, /Question suivante/).click(); await sleep(500); }
    await sleep(1000); await relever(prof, "pilot-bilan", ["c-bilan"]);
    await reconnecter(); await relever(el, "eleve-bilan", ["t-bilan", "t-bilan-annulee", "t-bilan-non-atteinte"], {phrases:true});
  });
  await etape("terminer", async () => {
    await btn(prof, /Terminer la session/).click(); await sleep(2000);
    await relever(prof, "pilot-fin", [], {comment:"Aucune scène n’en part : après « Terminer la session », la console de la 7.7.1 revient à l’écran de lancement, relevé dans « console-lancer »."}); await sleep(1000); await relever(el, "eleve-fin", ["t-fin"], {phrases:true});
  });
  await etape("résultats", async () => {
    await btn(prof, /^Données$/).click(); await sleep(800); await relever(prof, "donnees-resultats", ["c-seances", "c-seances-lues", "c-rendre", "c-copies-rendues", "c-corbeille"]);
  });
  await etape("résultats de la séance", async () => {
    await prof.getByText("→", {exact:true}).first().click(); await sleep(1200); await relever(prof, "resultats-seance", ["c-resultats", "c-resultats-rendues"]);
  });
  await etape("sauvegarde", async () => { await btn(prof, /^Données$/).click(); await sleep(600); await btn(prof, /Sauvegarde/).click(); await sleep(800); await relever(prof, "sauvegarde", ["c-sauvegarde", "c-importer", "c-purger"]); });
  await etape("mes évaluations", async () => { await btn(el, /Mes évaluations/).click(); await sleep(1200); await relever(el, "eleve-mes-evaluations", ["e-mes-evals", "e-mes-evals-rendue"], {phrases:true}); });
  // Le téléphone : la 7.7.1 l'éteint dès qu'un élève affiché a répondu (« mode is not defined », AUDITS/QCM-TELEPHONE-09-10).
  // Second passage, une nouvelle séance où personne ne répond.
  await etape("téléphone, second passage", async () => {
    await o.board.close(); await o.tel.close();
    await btn(prof, /^Pilotage$/).click(); await sleep(500); await btn(prof, /Pilotage classe/).click(); await sleep(600);
    const sels = prof.locator("select"); await sels.nth(0).selectOption({label:"3 ESSAI (25 élèves)"}); await sleep(400); await sels.nth(1).selectOption({index:1}); await sleep(600);
    await btn(prof, /Lancer la session/).click(); await sleep(1000); await prof.locator(".checkin-modal").getByRole("button", {name:/Lancer la session/}).click(); await sleep(2000);
    const tel = await o.mk("?mode=prof&view=phone", {width:390, height:844}); await sleep(1000);
    await relever(tel, "telephone-attente", ["p-eleve"]);
    await btn(prof, /Lancer Q1/).click(); await sleep(1000); await relever(tel, "telephone-reflexion", [], {comment:"Aucune scène n’en part : la maquette ne montre pas le téléphone pendant la réflexion."});
    await btn(prof, /Autoriser la réponse/).click(); await sleep(700); await relever(tel, "telephone-reponse", ["p-reponse"]);
    await sleep(6000); await relever(tel, "telephone-close", ["p-eleve"]);
    for(let i = 0; i < 9; i++){ await btn(prof, /Q suiv/).click(); await sleep(300); }
    await btn(prof, /Autoriser la réponse/).click(); await sleep(400); const c = btn(prof, /Clore la question/); if(await c.count()) await c.click({timeout:3000}); await sleep(1200);
    await btn(prof, /Lancer l'autoévaluation/).click(); await sleep(1200); await relever(tel, "telephone-autoeval", []);
    await btn(prof, /Lancer la correction/).click(); await sleep(1200); await relever(tel, "telephone-correction-avant", ["p-corr-avant"]);
    await btn(prof, /Révéler/).click(); await sleep(1200); await relever(tel, "telephone-correction-apres", ["p-corr-apres", "p-autonomie"]);
    await btn(prof, /Terminer la session/).click(); await sleep(1000);
  });
  await etape("mode test", async () => { await btn(prof, /Mode test/).click(); await sleep(2500); await relever(prof, "mode-test", ["x620-1-mode-test-ouverture", "x620-2-mode-test-reflexion", "x620-3-mode-test-en-grand"]); });
};
