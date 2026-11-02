// [C14 1.4.27] (Paul 02/11 16:53 : « pourquoi systématiquement après une relecture de bande j'ai encore des choses non validées » ; « 43 ok », 17:10) :
// le faux hub renvoie chaque écriture comme le vrai site (un flux, les champs rangés par ordre alphabétique, 300 ms plus tard). Dans la bande, une décision par
// seconde, au rythme d'une relecture : chaque décision tombe pendant l'aller-retour de l'écriture d'avant. Aucune ne doit se perdre, ni au site, ni sur la carte.
// Seulement des gestes ; les évaluations lisent l'état et le faux site.
export async function eprouverEcho({ pg, verif, cap, att }) {
  await pg.bringToFront();
  await pg.evaluate(() => { try { localStorage.setItem("mjpc_faux_hub_echo", "300"); } catch (e) {} }); await pg.reload(); await att(6000);
  const ouvrir = async () => { if (await pg.evaluate(() => document.getElementById("scModale").classList.contains("show"))) { await pg.keyboard.press("Escape"); await att(200); }
    if (!(await pg.evaluate(() => typeof SC !== "undefined" && SC.ouvert))) { await pg.click('#ruOnglets [data-o="pilotage"]').catch(() => {}); await att(300); await pg.click('#ruSous [data-s="correction"]').catch(() => {}); await att(500); await pg.click("#btnScan"); await att(1500); }
    if (!(await pg.evaluate(() => typeof RC !== "undefined" && RC.ouvert))) { await pg.click("#btnRecopier"); await att(1000); } };
  await ouvrir();
  const abonne = await pg.evaluate(() => !!RU.flux);
  const k = await pg.evaluate(() => SC.copies.filter(k => rcArrets(k).length >= 2).sort((a, b) => rcArrets(b).length - rcArrets(a).length)[0]);
  if (!k) { verif("1.4.27 : une copie avec des fautes proposées", false); return; }
  if (await pg.evaluate(k => RC.copie !== k, k)) { await pg.selectOption("#rcCopie", k); await att(800); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } }
  if (await pg.evaluate(() => !RC.bd)) { await pg.click("#rcBandeOuvrir"); await att(800); }
  await pg.click('#rcBandeListe li[data-i="0"]'); await att(400);
  const voulu = [];
  const nF = await pg.evaluate(() => RC.bd.A.filter(a => !a.st).length);
  for (let i = 0; i < 8; i++) {   /* huit décisions sur les fautes de la copie, en revenant au début de la liste s'il le faut : le même arrêt peut changer d'avis */
    await pg.click('#rcBandeListe li[data-i="' + (i % nF) + '"]'); await att(60);
    const a = await pg.evaluate(i => { const a = RC.bd.A[i]; return { id: a.id, cle: a.cle, d: (a.l.decisions || {})[a.cle] || "" }; }, i % nF);
    const v = a.d === "n" ? "o" : "n"; const deja = voulu.find(x => x.id === a.id && x.cle === a.cle); if (deja) deja.v = v; else voulu.push(Object.assign(a, { v }));
    await pg.keyboard.press(v === "n" ? "n" : "Enter"); await att(940);   // une décision par seconde : l'écriture part 900 ms après la précédente, son écho revient 300 ms plus tard
  }
  await att(3500);
  const lire = () => pg.evaluate(([k, V]) => ruLire(["redactions", RU.id, "copies", RU.classe, k]).then(cp0 => { const cp = cp0 ? scCles(cp0, false) : null, P = ((((cp || {}).scan || {}).recopie || {}).pages) || {};
    const au = id => { for (const p of Object.values(P)) { const l = ((p || {}).lignes || {})[id]; if (l) return l; } return null; };
    return { site: V.map(x => ((au(x.id) || {}).decisions || {})[x.cle] || ""), etat: V.map(x => { let l = null; Object.values((((state.copies[k] || {}).scan || {}).recopie || {}).pages || {}).forEach(p => { if (p && p.lignes && p.lignes[x.id]) l = p.lignes[x.id]; }); return ((l || {}).decisions || {})[x.cle] || ""; }) }; }), [k, voulu]);
  const r1 = await lire();
  await pg.click("#rcBandeRetour"); await att(300); const autre = await pg.evaluate(k => SC.copies.find(x => x !== k && rcLignesEcrites(x).length), k);
  if (autre) { await pg.selectOption("#rcCopie", autre); await att(800); if (await pg.evaluate(() => !!RC.phrase)) { await pg.click("#rcPhraseAucune"); await att(400); } await pg.selectOption("#rcCopie", k); await att(800); }
  const r2 = await pg.evaluate(([k, V]) => { const A = rcArrets(k); return V.map(x => { const a = A.find(y => y.id === x.id && y.cle === x.cle); return a ? ((a.l.decisions || {})[a.cle] || "") : "?"; }); }, [k, voulu]);
  const v = voulu.map(x => x.v).join(""), ok = r1.site.join("") === v && r1.etat.join("") === v && r2.join("") === v;
  verif("1.4.27 : le faux site renvoie chaque écriture, ses champs triés, 300 ms plus tard (abonné : " + abonne + ") ; huit décisions, une par seconde, sur " + voulu.length + " fautes : voulues « " + v + " », au site « " + r1.site.join("") + " », dans la copie « " + r1.etat.join("") + " », la copie rouverte « " + r2.join("") + " »",
    abonne && ok);
}   /* le faux site garde son écho pour la suite du banc (enlever, effacer) : elle se joue comme au vrai site */
