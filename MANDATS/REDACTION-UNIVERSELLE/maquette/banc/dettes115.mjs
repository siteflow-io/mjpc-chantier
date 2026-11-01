// [C14 1.4.15] (Paul 01/11 13:12) les dettes de la recopie : la phrase qui m'a marqué (s'ouvre seule au bout de la recopie, bloque la copie suivante, se choisit sans peinture au hasard)
// et le cadre de la bande (double clic : deux poignées pour sa longueur). Seulement des gestes ; les évaluations lisent l'état et le DOM.
export async function eprouverDettes115({ pg, verif, cap, att }) {
  await pg.bringToFront();
  if (!(await pg.evaluate(() => SC.ouvert))) { await pg.click("#btnScan"); await att(1200); }
  if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(500); }
  // aller sur une copie par le menu « Copie » ; si la phrase est demandée d'abord, « Pas de phrase » (le geste de Paul), puis la copie change seule
  const aller = async k => { if (await pg.evaluate(k => RC.copie === k, k)) return; await pg.selectOption("#rcCopie", k); await att(400);
    if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(500); } };
  // 1. le choix de la phrase : le premier mot s'écrit dessous, le dernier écrit toute la phrase d'un coup
  const k1 = await pg.evaluate(() => SC.copies.find(k => rcLignesEcrites(k).length >= 2)); await aller(k1);
  await pg.click("#rcPhraseOuvrir"); await att(250);
  const mots = await pg.locator("#rcPhraseTexte [data-j]").count(), j2 = Math.min(mots - 1, 6), deja = await pg.evaluate(() => RC.phrase.a >= 0 ? Math.abs(RC.phrase.b - RC.phrase.a) + 1 : 0);   // une phrase déjà gardée se montre en or
  const lit = () => pg.evaluate(() => ({ or: document.querySelectorAll("#rcPhraseTexte .or").length, debut: document.querySelectorAll("#rcPhraseTexte .debut").length, choix: document.getElementById("rcPhraseChoix").textContent, oui: !document.getElementById("rcPhraseOui").disabled }));
  const vide = await lit();
  await pg.click("#rcPhraseTexte [data-j] >> nth=2"); await att(120); const un = await lit();
  await pg.click("#rcPhraseTexte [data-j] >> nth=" + j2); await att(120); const deux = await lit();
  const attendu = await pg.evaluate(([a, b]) => "« " + RC.phrase.W.slice(a, b + 1).map(w => w.g.eleve).join(" ") + " »", [2, j2]), premier = await pg.evaluate(() => RC.phrase.W[2].g.eleve);
  await cap("C14-55-phrase-choix"); await pg.click("#rcPhraseFermer"); await att(200);
  verif("dettes (1.4.15) : la phrase qui m'a marqué : à l'ouverture, seule la phrase déjà gardée est en or (" + vide.or + " sur " + deja + ") ; clic sur le 3e mot : lui seul en or (" + un.or + "), écrit dessous (« " + un.choix + " ») ; clic sur le " + (j2 + 1) + "e : toute la phrase d'un coup, " + deux.or + " mots en or, écrite dessous (« " + deux.choix + " ») ; « ✓ C'est elle » ne s'allume qu'alors (" + (!un.oui && deux.oui) + ")",
    vide.or === deja && un.or === 1 && un.debut === 1 && un.choix.startsWith("« " + premier + " …") && deux.or === j2 - 1 && deux.debut === 0 && deux.choix === attendu && !un.oui && deux.oui);
  // 2. au bout de la recopie, la phrase s'ouvre seule ; sans elle, on ne passe pas à la copie suivante
  const k2 = await pg.evaluate(() => { const L = SC.copies.filter(k => !(scCopie(k).recopie || {}).phrase && SC.copies.indexOf(k) < SC.copies.length - 1); return L[0] || null; });
  await aller(k2);
  const der = await pg.evaluate(() => { const P = scPagesDe(RC.copie); return P[P.length - 1].id; });
  if (await pg.evaluate(p => RC.page !== p, der)) { await pg.selectOption("#rcPage", der); await att(400); }
  const nChamps = await pg.locator("#rcFeuille .rc-saisie").count(); await pg.locator("#rcFeuille .rc-saisie").nth(nChamps - 1).click(); await att(120);
  await pg.keyboard.press("End"); await pg.keyboard.type(" Je t'embrasse fort."); await att(150);
  const ouvre0 = await pg.evaluate(() => !!RC.phrase); await pg.keyboard.press("Enter"); await att(400);
  const seule = await pg.evaluate(() => !!RC.phrase && !document.getElementById("rcPhrase").hidden);
  await cap("C14-56-phrase-seule"); await pg.keyboard.press("Escape"); await att(200);
  const suivante = await pg.evaluate(() => SC.copies[SC.copies.indexOf(RC.copie) + 1]);
  await pg.click("#rcCopieSuite"); await att(400);
  const bloque = await pg.evaluate(k => ({ phrase: !!RC.phrase, copie: RC.copie === k, menu: document.getElementById("rcCopie").value === k }), k2);
  const n = await pg.locator("#rcPhraseTexte [data-j]").count(); await pg.click("#rcPhraseTexte [data-j] >> nth=0"); await att(100); await pg.click("#rcPhraseTexte [data-j] >> nth=" + Math.min(n - 1, 3)); await att(100); await pg.click("#rcPhraseOui"); await att(600);
  const passe = await pg.evaluate(([k, s]) => ({ ici: RC.copie === s, phrase: !!((scCopie(k).recopie || {}).phrase || {}).texte, ferme: !RC.phrase }), [k2, suivante]);
  verif("dettes (1.4.15) : au bout de la recopie (Entrée sur la dernière ligne de la dernière page), la phrase s'ouvre seule (" + (!ouvre0 && seule) + ") ; « Copie → » sans phrase : la phrase est demandée, la copie ne change pas (" + (bloque.phrase && bloque.copie && bloque.menu) + ") ; la phrase choisie, la copie suivante vient seule (" + (passe.ici && passe.phrase && passe.ferme) + ")",
    !ouvre0 && seule && bloque.phrase && bloque.copie && bloque.menu && passe.ici && passe.phrase && passe.ferme);
  // 3. la bande : double clic sur le cadre, deux poignées ; la poignée de droite raccourcit le cadre, le bord gauche ne bouge pas
  let k3 = await pg.evaluate(() => SC.copies.find(k => rcArrets(k).length > 0));
  if (!k3) {   // le banc de la recopie a tout effacé : le corrigé de l'IA d'une copie, collé par le geste (une faute d'accord sur un mot de sa première ligne)
    k3 = await pg.evaluate(() => SC.copies.find(k => rcLignesEcrites(k).some(x => /\b[a-zéèàù]{4,}\b/i.test(x.l.texte)))); await aller(k3);
    const re = await pg.evaluate(k => { const o = { format: "mjpc-recopie-ia-3", lignes: {} }; let fait = false; rcLignesEcrites(k).forEach(x => { let t = x.l.texte; if (!fait) { const m = t.match(/\b[a-zéèàù]{4,}\b/i); if (m) { t = t.slice(0, m.index) + m[0] + "s{G}" + t.slice(m.index + m[0].length); fait = true; } } o.lignes[x.id] = t; }); return o; }, k3);
    await pg.click("#rcImportIA"); await att(150); await pg.locator("#rcIATexte").fill(JSON.stringify(re)); await pg.click("#rcIAValider"); await att(500); await pg.keyboard.press("Escape"); await att(200);
  }
  await aller(k3);
  await pg.click("#rcBandeOuvrir"); await att(500); if (await pg.evaluate(() => RC.bd && RC.bd.attente)) { await pg.keyboard.press("Enter"); await att(400); }
  const geo = () => pg.evaluate(() => { const cv = document.getElementById("rcBandePhoto"), r = cv.getBoundingClientRect(), b = RC.bd.boite, a = rcBandeCible(), q = rcPlaceSeg(a), f = r.width / cv.width;
    return { g: r.left + b.g * f, d: r.left + b.d * f, y: r.top + b.ym * f, redim: !!b.redim, x0: q.x0, x1: q.x1, place: !!((a.l.places || {})[a.cle]) }; });
  const g0 = await geo(); await pg.mouse.dblclick((g0.g + g0.d) / 2, g0.y); await att(250); const g1 = await geo(); await cap("C14-57-cadre-poignees");
  await pg.mouse.move(g1.d, g1.y); await pg.mouse.down(); for (let i = 1; i <= 6; i++) { await pg.mouse.move(g1.d - i * 5, g1.y); await att(30); } await pg.mouse.up(); await att(300);
  const g2 = await geo(); await pg.mouse.dblclick((g2.g + g2.d) / 2, g2.y); await att(250); const g3 = await geo();
  await pg.click("#rcBandeRetour"); await att(200); await pg.click("#rcFermer"); await att(200);
  verif("dettes (1.4.15) : dans la bande, un double clic sur le cadre montre ses deux poignées (" + (!g0.redim && g1.redim) + ") ; la poignée de droite tirée de 30 points vers la gauche raccourcit le cadre (" + g1.x1.toFixed(4) + " → " + g2.x1.toFixed(4) + "), le bord gauche ne bouge pas (" + (Math.abs(g2.x0 - g1.x0) < 1e-6) + "), gardé (" + g2.place + ") ; encore un double clic, plus de poignées (" + !g3.redim + ")",
    !g0.redim && g1.redim && g2.x1 < g1.x1 - 0.005 && Math.abs(g2.x0 - g1.x0) < 1e-6 && g2.place && !g3.redim);
}
