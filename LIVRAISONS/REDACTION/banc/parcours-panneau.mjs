// Le parcours du panneau (13 · 60), le même pour l'avant (production 1.0.0-RU) et l'après : captures à 1707 × 743.
// usage : node parcours-panneau.mjs <redaction.html> <dossier> <prefixe>
import { hubDeDepart, installer, sessionProf } from './fauxhub.mjs'; import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module';
const pw = createRequire(import.meta.url)('/opt/node22/lib/node_modules/playwright');
const [F, OUT, PRE] = [path.resolve(process.argv[2]), path.resolve(process.argv[3]), process.argv[4] || 'x']; fs.mkdirSync(OUT, { recursive: true });
export function hubPanneau() {
  const h = hubDeDepart({ avecDugain: false }); const ICI = path.dirname(new URL(import.meta.url).pathname);
  const lettre = JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'lettre-grande-guerre.json'), 'utf8'));
  const dug = JSON.parse(fs.readFileSync(path.join(ICI, '..', 'sujets', 'dugain.json'), 'utf8'));
  const L = Object.assign({}, lettre, { id: 'sujet_mh2a1x_k3p9qz', idInterne: 'sujet_mh2a1x_k3p9qz', nomCourt: 'lettre-grande-guerre-3e', classe: '3_franklin_aretha', creeLe: '2026-10-27T11:40:00.000Z', modifieLe: '2026-10-27T15:10:00.000Z' });
  const L2 = Object.assign({}, lettre, { id: 'sujet_mh2b7c_w8d2rt', idInterne: 'sujet_mh2b7c_w8d2rt', nomCourt: 'lettre-grande-guerre-3e-copie', titre: 'Copie de ' + lettre.titre, classe: '3_dylan_bob', creeLe: '2026-10-27T16:02:00.000Z', modifieLe: '2026-10-27T16:02:00.000Z' });
  // la copie d'une élève de 3 FRANKLIN Aretha, commencée (réaliste : le thème tenu, sa citation)
  const cp = { sujet: 'unique', echelons: { theme_tenu: 2, trois_paragraphes: 2 }, sousEchelons: { theme_tenu: 2, trois_paragraphes: 2 }, citationsPar: { theme_tenu: "moi qui rabotais encore des portes à Tulle l'été dernier" }, sousEditesPar: {}, erreursCitation: {}, compteurOrthoGram: 0, meilleureCitation: '', meilleureCitationCommentaire: '', id: 'copie_mh2c0d_a1b2c3', eleve: 'audebert_elise', classe: '3_franklin_aretha', sujetId: L.idInterne, creeLe: '2026-10-27T15:20:00.000Z', modifieLe: '2026-10-27T15:24:00.000Z', nom: 'AUDEBERT Elise' };
  h.redactions[L.idInterne] = { config: L, copies: { '3_franklin_aretha': { audebert_elise: cp } } };
  h.redactions[L2.idInterne] = { config: L2 };
  // un sujet de la forme 1.0.0-RU : sans classe rangée, des copies de deux classes (aucune donnée ne bouge)
  const cd = { sujet: 'imagination', echelons: { orthographe: 2 }, sousEchelons: { orthographe: 1 }, citationsPar: {}, sousEditesPar: {}, erreursCitation: {}, compteurOrthoGram: 9, nom: 'BOIVIN Eden' };
  h.redactions.dugain = { config: dug, copies: { '3_franklin_aretha': { boivin_eden: cd }, '3E Charles de Gaulle': { boivin_eden: cd } } };
  return h;
}
if (process.argv[1] && process.argv[1].endsWith('parcours-panneau.mjs')) {
  const nav = await pw.chromium.launch({ args: ['--no-sandbox'] }); const ctx = await nav.newContext({ viewport: { width: 1707, height: 743 } });
  await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  const pg = await ctx.newPage(); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => d.accept());
  await pg.addInitScript(installer, hubPanneau()); await pg.addInitScript(sessionProf);
  const cap = n => pg.screenshot({ path: path.join(OUT, PRE + '-' + n + '.png') });
  await pg.goto('file://' + F + '?mode=prof'); await pg.waitForTimeout(1500); await cap('1-accueil');
  await pg.goto('file://' + F + '?mode=prof&id=sujet_mh2a1x_k3p9qz&classe=3_franklin_aretha'); await pg.waitForTimeout(2000); await cap('2-redaction-ouverte');
  if (await pg.$('#ruOnglets')) { for (const [o, s, n] of [['pilotage', 'preparation', '3-preparation'], ['donnees', 'bilan', '4-bilan'], ['donnees', 'fiches', '5-fiches'], ['reglages', null, '6-reglages']]) { await pg.evaluate(([o, s]) => ruOnglet(o, s || undefined), [o, s]); await pg.waitForTimeout(500); await cap(n); } await pg.evaluate(() => ruOnglet('pilotage', 'correction')); await pg.waitForTimeout(400); }
  await pg.evaluate(() => ouvrirCopie(eleveId('AUDEBERT Elise'))); await pg.waitForTimeout(700); await cap('7-une-copie');
  console.log('erreurs', errs); await nav.close();
}
