// Les contrôles de la conscience n°13 pour la maquette du déroulé (p8) — protocole de l'audit du 12/10/2026, obligation 1.
// Ils disent ce qui doit être vrai, par le geste (un clic, une touche, puis l'écran où ça mène), et les attendus ne viennent
// pas de la version contrôlée : ils viennent du cadrage et des compléments validés par Paul (la source est donnée à chaque K).
// L'exécutant ne les modifie jamais : un contrôle qui échoue, c'est la maquette qu'on corrige (s'il le croit faux, il l'écrit dans la NOTE et s'arrête).
//
// usage : node controles.mjs <maquette-pilotage-ordi-v9c15p8-manipulable.html> [sortie.txt]
//   code de sortie 1 si un seul contrôle échoue, 2 si Playwright est introuvable.
//   MJPC_PLAYWRIGHT : le module Playwright (facultatif ; sinon le Playwright global de la machine, puis node_modules/ à côté de la maquette)
//   MJPC_CHROMIUM   : l'exécutable de Chromium (facultatif ; sinon celui de Playwright)
//
// K1  la répétition propre (dette n°13 · 9 ; complément p8-5c, points 3, 4, 15)                       — éprouvé sur p8-5 (échoue), p8-5c (passe)
// K2  les notes de présentateur, par étape, en classe et en atelier (n°13 · 10 ; p8-5c, points 5-9)    — éprouvé sur p8-5, p8-5c
// K3  la mise en forme à deux boutons « ab » / « A » + palette, sans pousser ▶ hors du cadre (n°13 · 11 ; p8-5c, 10-14) — éprouvé sur p8-5, p8-5c
// K4  le panneau des notes suit toujours la diapo ; le premier caractère après Entrée n'est pas perdu (n°13 · 13, 13 · 14 ; p8-5d) — éprouvé sur p8-5c, p8-5d
// K5  la poignée des notes, en permanence (n°13 · 15 ; p8-5e, décisions 1-3)                           — éprouvé sur p8-5d, p8-5e
// K6  la diapo trop pleine se lit en pages, jamais hors du cadre, avec plusieurs blocs (n°13 · 16 ; p8-5f, points 2-5) — éprouvé sur p8-5e, p8-5f
// K7  la fenêtre du tableau reçoit les pages dès son ouverture (n°13 · 17 ; p8-5g, point 1)           — éprouvé sur p8-5f, p8-5g
// K8  une vignette par page dans la colonne de gauche (n°13 · 18 ; p8-5h, points 1-5)                  — éprouvé sur p8-5g (échoue : p8-5h n'est pas livrée)
// K10 après « ■ Arrêter », la fenêtre du tableau revient à ce qu'elle montrait avant la répétition (n°13 · 19 ; p8-5h, point 11) — éprouvé sur p8-5g (échoue)
// K11 la vue « ⧉ Tableau » porte le compteur de page et montre la même page (n°13 · 20 ; p8-5h, point 12) — éprouvé sur p8-5g (échoue)
// K12 dans l'atelier, le curseur reste visible dans un paragraphe plus haut que la diapo (n°13 · 21 ; p8-5h, point 13) — éprouvé sur p8-5g (échoue)
// K13 dans l'atelier, Échap sort de la ligne et Maj+← change de page (n°13 · 22 ; p8-5h, point 14) — éprouvé sur p8-5g (échoue)
// K9  le parcours fixe, le même à chaque audit : atelier → écrire → note → lancer l'heure → dévoiler → changer de diapo → Écran 2 → mise en forme → répétition → arrêt → Fin de l'heure
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';

const MAQ = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(MAQ)) { console.log('usage : node controles.mjs <maquette.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url);
let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(MAQ), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable (MJPC_PLAYWRIGHT, le module global, node_modules/ à côté de la maquette)'); process.exit(2); }
const FILE = 'file://' + MAQ;

const R = []; let nb = 0, echecs = 0;
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; R.push((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null ? ' — ' + detail : '')); return !!ok; };
const dire = s => { R.push(s); };
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });

// --- les gestes communs ---
// ── v3 (26/10, contrat §12.28 (3a)) : l'heure se lance par la case de l'emploi du temps ; la répétition se joue depuis l'Atelier, jamais pendant l'heure (K1, K2, K5, K9, K10).
// ── v2 (21/10, intégration) : MJPC_ENTREE=site joue les MÊMES contrôles sur index.html intégré, par l'entrée du site (faux hub, gestes réels
//    jusqu'à l'onglet Atelier) ; sans la variable, l'entrée est la maquette seule, comme avant (contrat des quatre, §7-§8).
const ENTREE_SITE = process.env.MJPC_ENTREE === 'site';
const HUB = path.resolve(process.env.MJPC_HUB || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'INTEGRATION-DEROULE', 'hub'));
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } }; try { st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {}
  /* v2.2 (21/10, 16:33) : les contrôles jouent l'HEURE 1 d'une séance jamais jouée (comme la maquette) — le faux hub porte une heure du 07/09 pour la séance 0,
     qui ferait lancer l'heure 2 (F2, 13 · 26) là où la classe s'est arrêtée ; cette heure jouée est retirée de la copie du hub que les contrôles lisent */
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {}
  return st; };
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const ouvrir = async (w = 1280, h = 800) => { const ctx = await nav.newContext({ viewport: { width: w, height: h }, timezoneId: 'Europe/Paris' }); if (ENTREE_SITE) await ctx.route(u => !String(u).startsWith('file:'), r => r.abort()); const pg = await ctx.newPage(); const errs = [], boites = [];
  pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
  if (!ENTREE_SITE) { await pg.goto(FILE); await pg.waitForTimeout(600); return { ctx, pg, errs, boites }; }
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, hubStore());
  await pg.goto(FILE + '?n=3e', { waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.addStyleTag({ content: '#fi-overlay{display:none!important}' });   /* v2.1 (21/10, 12:50) : le voile de présentation du site revient après certains rendus et interceptait tous les clics des contrôles (E4, journal 10:12 ; E1, audit F15) — il n'est pas un geste du déroulé, il est tenu hors du chemin */
  await pg.click('#tprof-btn'); await pg.waitForTimeout(500); await pg.evaluate(() => atelierOuvrir()); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l\u2019atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await pg.waitForTimeout(2500);
  return { ctx, pg, errs, boites }; };
const atelier = async pg => { await pg.click('[data-atelier]'); await pg.waitForTimeout(400); if (await pg.$('#at-aide .x')) { await pg.click('#at-aide .x'); await pg.waitForTimeout(200); } };
/* v3 (26/10, contrat §12.28 (3a), P1 validé par Paul) : l'heure d'une classe se lance par la case de l'emploi du temps — « ▶ Ouvrir le pilotage et lancer » — et se joue
   dans l'écran « la classe en cours » (sans Atelier ni répétition) ; l'Atelier ne lance plus. Sur la maquette seule (sans MJPC_ENTREE=site), l'ancien bouton. */
const lancer = async pg => { if (!ENTREE_SITE) { await pg.click('[data-lancer="1"]'); await pg.waitForTimeout(500); return; }
  await pg.evaluate(() => edtOuvrir()); await pg.waitForTimeout(1500);
  const ok = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (!c) return false; c.click(); return true; });
  if (!ok) throw new Error('aucune case de la 3E Charles de Gaulle dans l\'emploi du temps'); await pg.waitForTimeout(700);
  if (!(await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'))) throw new Error('« ▶ Ouvrir le pilotage et lancer » absent de la case'); await pg.waitForTimeout(3500);
  if (await pg.$eval('#garde', g => g.classList.contains('on')).catch(() => false)) { await pg.click('#garde-devant').catch(() => {}); await pg.waitForTimeout(300); } };
/* v5 (27/10, contrat §12.33 (2), Paul 14:27 : « les onglets pilotage et relecture n'ont rien à faire dans l'atelier ») : l'onglet « Pilotage » sort de l'Atelier ;
   l'heure se lance par la case (`lancer`) — on ne clique l'onglet que s'il est encore montré (la maquette seule). */
const ongPilotage = async pg => { await pg.evaluate(() => { const b = document.getElementById('ong-pilotage'); if (b && b.offsetParent !== null && !b.hidden) b.click(); }); };
const garde = async pg => { if (await pg.$eval('#garde', g => g.classList.contains('on')).catch(() => false)) { await pg.click('#garde-devant'); await pg.waitForTimeout(300); return true; } return false; };
const huitLignes = async pg => { await pg.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await pg.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 2 }); if (i < 8) await pg.keyboard.press('Enter'); } await pg.keyboard.press('Escape'); await pg.waitForTimeout(500); };
const ecrireNote = async (pg, k, texte) => { await pg.click(`#mur li[data-k="${k}"]`); await pg.waitForTimeout(120); const p = await pg.$$('#notesd [contenteditable]'); if (!p.length) throw new Error('aucun paragraphe de notes éditable (#notesd [contenteditable])'); await p[p.length - 1].click(); await pg.keyboard.press('End'); await pg.keyboard.press('Enter'); await pg.keyboard.type(texte); await pg.waitForTimeout(150); };
const noteDe = (pg, k) => pg.evaluate(k => { const v = ((window.dr && typeof dr.notes === 'function') ? (dr.notes() || {}) : (DATA.notes || {}))[k];   /* v2 : le site intégré expose dr.notes() (contrat §5), même clé que DATA.notes */ return v == null ? '' : typeof v === 'string' ? v.replace(/<[^>]+>/g, '') : v.map(n => (n.p || '') + ' | ' + String(n.html || '').replace(/<[^>]+>/g, '')).join(' ¶ '); }, k);
const ouvrirTableau = async pg => { const [fen] = await Promise.all([pg.waitForEvent('popup'), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.waitForTimeout(900); return fen; };
// ce que montre une diapo : son compteur de page, ses lignes visibles (ni hors, ni pas), celles qui sortent du cadre, sa police — au pilote (#mur) ou dans la fenêtre du tableau (.mur.tableau)
const lireMur = ctx => ctx.evaluate(() => { const mur = document.getElementById('mur') || document.querySelector('.mur.tableau'); if (!mur) return { page: '', lignes: [], hors: -1, police: '' }; const mb = mur.getBoundingClientRect(); const c = mur.querySelector('.corpsd') || mur;
  const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0');
  const hors = els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; });
  return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)), hors: hors.length, police: getComputedStyle(c).fontSize }; });
const pareil = (a, b) => a.page === b.page && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
const rect = (pg, sel) => pg.$eval(sel, e => { const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height), visible: b.width > 0 && b.height > 0 && getComputedStyle(e).display !== 'none' }; }).catch(() => ({ x: 0, y: 0, w: 0, h: 0, visible: false }));
const finK = (k, o) => { verif(k, !o.errs.length, 'aucune erreur JS', o.errs.join(' ; ') || undefined); verif(k, !o.boites.length, 'aucune boîte système', o.boites.join(' ; ') || undefined); return o.ctx.close(); };
const K = async (k, titre, f) => { dire(''); dire(k + ' — ' + titre); try { await f(); } catch (e) { verif(k, false, 'le contrôle n\'a pas pu aller au bout', e.message.split('\n')[0]); } };

// K1 — la répétition propre (p8-5c, points 3-4 : « Fin de l'heure » disparaît, « ■ Arrêter » à sa place ; « ⧉ Tableau » et « 🖥 Écran 2 » restent et fonctionnent ;
//      point 15 : aucun élément position:fixed ajouté, elementFromPoint au centre des trois boutons rend le bouton lui-même ; à l'arrêt tout revient) — à 1280 et à 1920
await K('K1', 'la répétition propre (n°13 · 9)', async () => { for (const W of [1280, 1920]) { const o = await ouvrir(W, 800); const pg = o.pg; /* v3 : la répétition se joue depuis l'Atelier, jamais pendant une heure lancée (§12.28 (3a)) */ await atelier(pg);
  const fixes = () => pg.$$eval('body *', l => l.filter(x => getComputedStyle(x).position === 'fixed').length);
  const avant = await fixes(); await pg.click('#at-jouer'); await pg.waitForTimeout(1200); /* le temps que le chrono de la répétition s'écrive dans l'entête */ const pendant = await fixes();
  const centre = id => pg.$eval('#' + id, b => { const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { visible: r.width > 0, lui: !!(e && (e === b || b.contains(e))) }; }).catch(() => ({ visible: false, lui: false }));
  const t = await centre('btableau'), e2 = await centre('bvideoproj'), st = await centre('rep-stop'); const finCache = !(await rect(pg, '#bfin')).visible; const deborde = await pg.$eval('.haut', h => h.scrollWidth > h.clientWidth + 1);
  verif('K1', pendant === avant, `${W} px · en répétition, rien de posé en position:fixed`, `${avant} → ${pendant}`);
  verif('K1', t.visible && t.lui && e2.visible && e2.lui && st.visible && st.lui, `${W} px · « ⧉ Tableau », « 🖥 Écran 2 » et « ■ Arrêter » sont visibles et atteignables au clic (rien ne les recouvre)`, `Tableau ${t.lui} · Écran 2 ${e2.lui} · Arrêter ${st.lui}`);
  const horsCadre = await pg.$$eval('.haut *', l => { const R = l[0] ? l[0].closest('.haut').getBoundingClientRect().right : 0; return l.filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().right > R + 0.5).map(e => (e.textContent || '').trim().slice(0, 12) + ' → ' + Math.round(e.getBoundingClientRect().right)); });
  verif('K1', finCache && !deborde && !horsCadre.length, `${W} px · « Fin de l'heure » n'est pas là pendant la répétition, l'entête ne déborde pas (chrono de répétition écrit)`, `Fin cachée ${finCache} · déborde ${deborde}${horsCadre.length ? ' · hors du cadre : ' + horsCadre.join(', ') : ''}`);
  await pg.click('#btableau'); await pg.waitForTimeout(200); const bascule = await pg.evaluate(() => !!S.vueTableau); await pg.click('#btableau'); await pg.waitForTimeout(150);
  await pg.click('#rep-stop'); await pg.waitForTimeout(400); const stopParti = !(await rect(pg, '#rep-stop')).visible; const apres = await fixes();
  verif('K1', bascule && stopParti && apres === avant, `${W} px · « ⧉ Tableau » bascule la vue ; après « ■ Arrêter », « ■ Arrêter » est parti, rien ne reste`, `bascule ${bascule} · Arrêter parti ${stopParti} · fixes ${apres}`);
  await finK('K1', o); } });

// K2 — les notes de présentateur (p8-5c : un paragraphe de notes s'accroche à une étape de la diapo ; en classe, ▶ fait avancer le « vif » dans le panneau, ◀ le ramène ;
//      point 9 : écriture ouverte dans l'atelier et à l'heure lancée ; en répétition, lecture seule ; aucune entrée de journal pour les notes)
await K('K2', 'les notes de présentateur, par étape (n°13 · 10)', async () => { const o = await ouvrir(); const pg = o.pg; await atelier(pg);
  await ecrireNote(pg, 0, 'Note pour la première étape.'); await ecrireNote(pg, 2, 'Note pour la troisième étape.'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
  const notes = await noteDe(pg, await pg.evaluate(() => cle()));
  verif('K2', notes.includes('0.0 | ') && notes.includes('0.2 | ') && notes.includes('première') && notes.includes('troisième'), 'atelier : deux paragraphes écrits, accrochés aux étapes 1 et 3', notes.slice(0, 120));
  await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg);
  const vifs = () => pg.$$eval('#notesd > *', l => l.map(x => ({ vif: /vif/.test(x.className), fait: /fait/.test(x.className), rep: ((x.querySelector('button, .k, [class*=rep]') || {}).textContent || '').trim() })));
  for (let i = 0; i < 3; i++) { await pg.click('#bdev'); await pg.waitForTimeout(150); } const v3 = await vifs(); await pg.click('#bprec'); await pg.waitForTimeout(150); await garde(pg); const v2 = await vifs();
  const i3 = v3.findIndex(x => x.vif), i2 = v2.findIndex(x => x.vif);
  verif('K2', i3 >= 0 && /3/.test(v3[i3].rep) && v3.slice(0, i3).every(x => x.fait) && i2 >= 0 && /1/.test(v2[i2].rep), 'classe, heure lancée : ▶ ×3 → le paragraphe vif est celui de l\'étape 3 (ceux d\'avant sont faits) ; ◀ → celui de l\'étape 1', `à 3 : ${JSON.stringify(v3.map(x => x.rep + (x.vif ? '*' : '')))} · à 2 : ${JSON.stringify(v2.map(x => x.rep + (x.vif ? '*' : '')))}`);
  const edClasse = await pg.$$eval('#notesd [contenteditable="true"], #notesd [contenteditable="plaintext-only"]', l => l.length); const jNotes = await pg.evaluate(() => (typeof J !== 'undefined' ? J : []).filter(x => /note/.test(x.type)).length);
  verif('K2', edClasse > 0 && jNotes === 0, 'classe : les notes s\'écrivent (éditables), sans entrée de journal', `éditables ${edClasse} · journal ${jNotes}`);
  await finK('K2', o);
  /* v3 : la répétition se joue depuis l'Atelier (§12.28 (3a)) */ const o2 = await ouvrir(); const pg2 = o2.pg; await atelier(pg2); await pg2.click('#at-jouer'); await pg2.waitForTimeout(400);
  const edRep = await pg2.$$eval('#notesd [contenteditable="true"], #notesd [contenteditable="plaintext-only"]', l => l.length);
  verif('K2', edRep === 0, 'répétition (depuis l\'Atelier) : les notes sont en lecture seule', `éditables ${edRep}`);
  await finK('K2', o2); });

// K3 — la mise en forme (Paul, tour 43 : « un bouton pour le surlignage, un bouton pour le texte couleur, et quand je clique dessus, je sélectionne la couleur » ;
//      les flèches de dévoilement ne bougent pas : ▶ et le compteur restent dans le cadre ; p8-5c points 10-14 : palette, teinte foncée au tableau, journal, Échap ferme)
await K('K3', 'la mise en forme à deux boutons et palette (n°13 · 11)', async () => { const o = await ouvrir(); const pg = o.pg; await lancer(pg);
  const bs = await rect(pg, '#bsurl'), bt = await rect(pg, '#btxt'), dev = await rect(pg, '#bdev'), cpt = await rect(pg, '#compte'), sc = await rect(pg, '.scene');
  verif('K3', bs.visible && bt.visible, 'heure lancée : les deux boutons « ab » (#bsurl) et « A » (#btxt) sont dans la barre', `ab ${bs.visible} · A ${bt.visible}`);
  verif('K3', dev.visible && dev.x + dev.w <= sc.x + sc.w && cpt.x + cpt.w <= sc.x + sc.w + 1, '1280 px : « ▶ Dévoiler » et le compteur restent dans le cadre', `▶ finit à ${dev.x + dev.w}, compteur à ${cpt.x + cpt.w}, cadre à ${sc.x + sc.w}`);
  await pg.evaluate(() => { const li = document.querySelector('#mur li[data-k="1"]'); const tn = Array.from(li.childNodes).find(n => n.nodeType === 3 && n.textContent.trim().length > 8); const r = document.createRange(); r.setStart(tn, 2); r.setEnd(tn, 10); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await pg.click('#btxt'); await pg.waitForTimeout(150); const palOuverte = (await rect(pg, '#pal-txt')).visible;
  await pg.click('#pal-txt .p8-p[data-c="rouge"]'); await pg.waitForTimeout(250); const palFermee = !(await rect(pg, '#pal-txt')).visible;
  const couleurs = await pg.$$eval('#mur li[data-k="1"] span[data-coul], #mur li[data-k="1"] .p8-ct', l => l.map(s => getComputedStyle(s).color)); const jCT = await pg.evaluate(() => (typeof J !== 'undefined' ? J : []).filter(x => x.type === 'couleur-texte').length);
  verif('K3', palOuverte && palFermee && couleurs.some(c => /192, 57, 43/.test(c)) && jCT === 1, 'tableau : « A » ouvre la palette ; rouge → le texte prend la teinte foncée (192,57,43), la palette se ferme, une entrée de journal', `ouverte ${palOuverte} → fermée ${palFermee} · ${JSON.stringify(couleurs)} · journal ${jCT}`);
  await pg.click('#bsurl'); await pg.waitForTimeout(100); const surlOuverte = (await rect(pg, '#pal-surl')).visible; await pg.keyboard.press('Escape'); await pg.waitForTimeout(150); const surlFermee = !(await rect(pg, '#pal-surl')).visible;
  verif('K3', surlOuverte && surlFermee, '« ab » ouvre sa palette ; Échap la ferme', `ouverte ${surlOuverte} → fermée ${surlFermee}`);
  await finK('K3', o); });

// K4 — le panneau des notes suit toujours la diapo (Paul, tour 20 : « une note suit sa diapo, toujours ») : frappe dans les notes de la diapo 1 puis ▶ aussitôt jusqu'à la diapo 2 →
//      le panneau rend la diapo 2, sans « FIN-UN », le texte est gardé dans la note de la diapo 1, ◀ le remontre ; et le premier caractère après Entrée n'est pas perdu (n°13 · 14)
await K('K4', 'le panneau des notes suit la diapo ; le premier caractère après Entrée (n°13 · 13, 13 · 14)', async () => { const o = await ouvrir(); const pg = o.pg; await lancer(pg);
  const cle1 = await pg.evaluate(() => cle()); await pg.click('#notesd .p8-mt'); await pg.keyboard.press('End'); await pg.keyboard.type(' FIN-UN', { delay: 30 }); await pg.waitForTimeout(100);
  let n = 0; while ((await pg.evaluate(() => cle())) === cle1 && n < 12) { await pg.click('#bdev'); await pg.waitForTimeout(120); n++; } const cle2 = await pg.evaluate(() => cle());
  const panneau = await pg.evaluate(() => ({ cles: [...new Set(Array.from(document.querySelectorAll('#notesd .p8-mt')).map(x => x.dataset.p8key))], focus: !!(document.activeElement && document.activeElement.closest('#notesd')), texte: document.getElementById('notesd').textContent }));
  const note1 = await noteDe(pg, cle1); await pg.click('#bprec'); await pg.waitForTimeout(200); await garde(pg); const cleRetour = await pg.evaluate(() => cle()); const texteRetour = await pg.$eval('#notesd', d => d.textContent);
  verif('K4', cle2 !== cle1 && panneau.cles.length && panneau.cles.every(k => k === cle2) && !panneau.focus && !panneau.texte.includes('FIN-UN') && note1.includes('FIN-UN') && cleRetour === cle1 && texteRetour.includes('FIN-UN'), 'frappe puis ▶ aussitôt → le panneau rend la diapo 2 sans le texte, gardé dans la note de la diapo 1 ; ◀ (garde « Y aller ») le remontre', `▶ ×${n} · panneau sur la 2 : ${panneau.cles.every(k => k === cle2)} · focus notes ${panneau.focus} · FIN-UN sur la 2 : ${panneau.texte.includes('FIN-UN')} · gardé : ${note1.includes('FIN-UN')} · retour ${cleRetour === cle1} / ${texteRetour.includes('FIN-UN')}`);
  await finK('K4', o);
  const o2 = await ouvrir(); const pg2 = o2.pg; await atelier(pg2); const res = [];
  for (let i = 0; i < 3; i++) { await pg2.click(`#mur li[data-k="${i}"]`); await pg2.waitForTimeout(80); const p = await pg2.$$('#notesd [contenteditable]'); if (!p.length) throw new Error('aucun paragraphe de notes éditable'); await p[p.length - 1].click(); await pg2.keyboard.press('End'); await pg2.keyboard.press('Enter'); await pg2.keyboard.type('Xyz ' + i); await pg2.waitForTimeout(120); const d = (await noteDe(pg2, await pg2.evaluate(() => cle()))).split(' ¶ '); res.push((d[d.length - 1] || '').split(' | ').pop()); }
  verif('K4', res.every((t, i) => t === 'Xyz ' + i), 'atelier : Entrée puis frappe immédiate, trois fois → le premier caractère est là', JSON.stringify(res));
  await finK('K4', o2); });

// K5 — la poignée des notes (p8-5e : visible partout, dès le premier pixel, vers le haut les notes grandissent et la diapo rétrécit ; la hauteur reste de l'atelier au pilotage ; double-clic = toute la place)
await K('K5', 'la poignée des notes, en permanence (n°13 · 15)', async () => { const o = await ouvrir(); const pg = o.pg; await atelier(pg);
  const geo = async () => ({ poignee: await rect(pg, '#poignee-mur'), mur: await rect(pg, '#mur'), notes: await rect(pg, '.notes'), part: await pg.evaluate(() => Math.round((S.murPart || 1) * 100)) });
  const tirer = async dy => { const p = await rect(pg, '#poignee-mur'); const x = p.x + p.w / 2, y = p.y + p.h / 2; await pg.mouse.move(x, y); await pg.mouse.down(); await pg.mouse.move(x, y + dy / 2, { steps: 4 }); await pg.mouse.move(x, y + dy, { steps: 4 }); await pg.mouse.up(); await pg.waitForTimeout(250); };
  const a0 = await geo(); verif('K5', a0.poignee.visible, 'atelier : la poignée est visible', `${JSON.stringify(a0.poignee)}`);
  await tirer(-150); const a1 = await geo(); verif('K5', a1.notes.h > a0.notes.h + 60 && a1.mur.h < a0.mur.h - 60, 'atelier : tirée de 150 px vers le haut, les notes grandissent et la diapo rétrécit', `diapo ${a0.mur.h} → ${a1.mur.h} px, notes ${a0.notes.h} → ${a1.notes.h} px, part ${a0.part} → ${a1.part} %`);
  /* v3 : la répétition depuis l'Atelier, avant le lancement (§12.28 (3a)) */ await pg.click('#at-jouer'); await pg.waitForTimeout(400); const r0 = await geo(); verif('K5', r0.poignee.visible, 'répétition (depuis l\'Atelier) : la poignée est visible'); await pg.click('#rep-stop'); await pg.waitForTimeout(400);
  await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg); const c0 = await geo(); verif('K5', c0.poignee.visible && c0.part === a1.part, 'pilotage, heure lancée : la poignée est là et la hauteur de l\'atelier est gardée', `part ${a1.part} → ${c0.part} %`);
  const p = await rect(pg, '#poignee-mur'); await pg.mouse.dblclick(p.x + p.w / 2, p.y + p.h / 2); await pg.waitForTimeout(300); const c1 = await geo(); verif('K5', c1.part === 100 && c1.mur.h > c0.mur.h + 60, 'double-clic : la diapo reprend toute sa place', `part ${c0.part} → ${c1.part} %, diapo ${c0.mur.h} → ${c1.mur.h} px`);
  await finK('K5', o); });

// K6 — la diapo trop pleine se lit en pages (cadrage 1, 5.2 ; cadrage 4, 0.4 : le site ne coupe jamais seul ; p8-5f points 2-5 : avec plusieurs blocs, dans l'atelier aussi, jamais hors du cadre,
//      la page suit le dernier élément dévoilé, le tableau montre la même page) — à 1280 et à 1920
await K('K6', 'la diapo trop pleine se lit en pages, jamais hors du cadre (n°13 · 16)', async () => { for (const W of [1280, 1920]) { const o = await ouvrir(W, W === 1280 ? 800 : 1080); const pg = o.pg; await atelier(pg); const nbAvant = await pg.$$eval('#volet [data-at-di]', l => l.length); await huitLignes(pg);
  const a = await lireMur(pg); const nbDiapos = await pg.$$eval('#volet [data-at-di]', l => l.length);
  verif('K6', /page 2 \/ 2/.test(a.page) && a.hors === 0, `${W} px · atelier : huit lignes tapées sous le dernier bloc → « page 2 / 2 », rien hors du cadre`, `compteur « ${a.page} », hors ${a.hors}`);
  verif('K6', nbDiapos === nbAvant, `${W} px · atelier : aucune diapo créée (le site ne coupe jamais seul)`, `${nbAvant} → ${nbDiapos} diapos`);
  await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg); const p0 = await lireMur(pg);
  verif('K6', /page 1 \/ 2/.test(p0.page) && p0.hors === 0, `${W} px · pilote, heure lancée : « page 1 / 2 » à 0 dévoilé`, `« ${p0.page} », hors ${p0.hors}`);
  let horsMax = 0, pageA13 = ''; for (let i = 0; i < 13; i++) { await pg.click('#bdev'); await pg.waitForTimeout(80); const l = await lireMur(pg); horsMax = Math.max(horsMax, l.hors); pageA13 = l.page; }
  verif('K6', /page 2 \/ 2/.test(pageA13) && horsMax === 0, `${W} px · ▶ ×13 : la page suit le dernier dévoilé (« page 2 / 2 »), rien hors du cadre à aucune étape`, `« ${pageA13} », hors max ${horsMax}`);
  const fen = await ouvrirTableau(pg); await pg.click('#bprec'); await pg.waitForTimeout(400); const pp = await lireMur(pg), tt = await lireMur(fen);
  verif('K6', pareil(pp, tt) && tt.hors === 0, `${W} px · la fenêtre du tableau montre la même page que le pilote après un geste`, `pilote « ${pp.page} » ${pp.lignes.length} l. · tableau « ${tt.page} » ${tt.lignes.length} l., hors ${tt.hors}`);
  await fen.close(); await finK('K6', o); } });

// K7 — la fenêtre du tableau reçoit les pages dès son ouverture (p8-5g, point 1 : à l'ouverture comme à chaque ▶, même page, même compteur, aussitôt ; page suivie ou choisie à la molette)
await K('K7', 'la fenêtre du tableau reçoit les pages dès son ouverture (n°13 · 17)', async () => { for (const cas of [{ nDev: 0 }, { nDev: 9 }, { nDev: 13 }, { nDev: 9, molette: true }]) { const o = await ouvrir(); const pg = o.pg; await atelier(pg); await huitLignes(pg);
  await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg); for (let i = 0; i < cas.nDev; i++) { await pg.click('#bdev'); await pg.waitForTimeout(60); }
  if (cas.molette) { const m = await rect(pg, '#mur'); await pg.mouse.move(m.x + m.w / 2, m.y + m.h / 2); await pg.mouse.wheel(0, 300); await pg.waitForTimeout(500); } await pg.waitForTimeout(300);
  const pil = await lireMur(pg); const fen = await ouvrirTableau(pg); const t0 = await lireMur(fen); const nom = `ouvert à ${cas.nDev} dévoilés${cas.molette ? ', page 2 choisie à la molette' : ''}`;
  if (cas.molette) verif('K7', /page 2/.test(pil.page), 'la molette a choisi la page 2 au pilote', `« ${pil.page} »`);
  verif('K7', pareil(pil, t0) && t0.hors === 0, `${nom} : dans la seconde, même compteur et mêmes lignes que le pilote, rien hors du cadre`, `pilote « ${pil.page} » ${pil.lignes.length} l. · tableau « ${t0.page} » ${t0.lignes.length} l., hors ${t0.hors}`);
  await pg.click('#bdev'); await pg.waitForTimeout(500); const p1 = await lireMur(pg), t1 = await lireMur(fen);
  verif('K7', pareil(p1, t1), `${nom}, puis un ▶ : toujours la même page des deux côtés`, `pilote « ${p1.page} » · tableau « ${t1.page} »`);
  await fen.close(); await finK('K7', o); } });

// K8 — une vignette par page (Paul, tour 59 : « je ne peux pas avoir un écran sans le voir dans mon déroulé » ; p8-5h points 1-5 : « 1 · 1/2 », « 1 · 2/2 », la page au tableau marquée courante,
//      chaque vignette montre ce que sa page projette, pas un écran de plus, « · 2 pages » dans l'atelier)
await K('K8', 'une vignette par page dans la colonne de gauche (n°13 · 18)', async () => { const o = await ouvrir(); const pg = o.pg; await atelier(pg); await huitLignes(pg);
  const ligneAtelier = await pg.$eval('#volet [data-at-di="0"]', e => e.textContent.replace(/\s+/g, ' ').trim()); verif('K8', /2 pages/.test(ligneAtelier), 'atelier : la ligne de la diapo 1 dit « · 2 pages »', `« ${ligneAtelier.slice(0, 80)} »`);
  await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg);
  const vigs = () => pg.$$eval('#volet .vig', l => l.map(v => ({ i: v.dataset.i, cour: /\bcour\b/.test(v.className), etiq: (v.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 12), lignes: Array.from(v.querySelectorAll('li')).filter(x => !x.classList.contains('hors')).map(x => x.getAttribute('data-p')) })));
  const v0 = await vigs(); const d1 = v0.filter(v => v.i === '0'); const norm = s => s.replace(/\s/g, '');
  verif('K8', d1.length === 2 && /^1·1\/2/.test(norm(d1[0].etiq)) && /^1·2\/2/.test(norm(d1[1].etiq)), 'classe : la diapo 1 a deux vignettes, « 1 · 1/2 » puis « 1 · 2/2 »', `${d1.length} vignette(s) pour la diapo 1 : ${JSON.stringify(d1.map(v => v.etiq))}`);
  verif('K8', d1.length === 2 && d1[0].cour && !d1[1].cour, 'classe : « 1 · 1/2 » est la courante, « 1 · 2/2 » ne l\'est pas', JSON.stringify(d1.map(v => v.cour)));
  /* v2.1 : les comptes viennent de la trame jouée (23 diapos, 9 dans l'heure 1 sur la maquette ; 19 et 19 sur la séance 0 réelle de 3e), jamais d'un nombre en dur */
  const compte = await pg.evaluate(() => { const E = (window.dr && typeof dr.trame === 'function') ? (dr.trame() || []) : (DATA.seances[S.si].ecrans || []); const h = S.heure; return { total: E.length, heure: E.filter(e => e.heure === undefined || e.heure === null || e.heure === h).length, h }; });
  verif('K8', v0.length === compte.total + 1 && v0.filter(v => v.i === '1').length === 1, `classe : ${compte.total} + 1 vignettes en tout, une seule pour une diapo d'une page`, `${v0.length} vignettes`);
  const texte = await pg.evaluate(() => document.body.innerText.replace(/\s+/g, ' ')); verif('K8', new RegExp('Diapo 1 sur ' + compte.heure + '\\b').test(texte) && new RegExp('HEURE ' + compte.h + ' · ' + compte.heure + ' DIAPOS').test(texte), `classe : pas un écran de plus — « Diapo 1 sur ${compte.heure} », « HEURE ${compte.h} · ${compte.heure} DIAPOS »`, texte.match(/Diapo \d+ sur \d+/) + ' · ' + texte.match(/HEURE \d+ · \d+ DIAPOS/));
  let n = 0; while (!/page 2 \/ 2/.test((await lireMur(pg)).page) && n < 15) { await pg.click('#bdev'); await pg.waitForTimeout(80); n++; } const mur2 = await lireMur(pg); const v2 = await vigs(); const e1 = v2.filter(v => v.i === '0');
  verif('K8', e1.length === 2 && !e1[0].cour && e1[1].cour, '▶ jusqu\'à la page 2 → « 1 · 2/2 » devient la courante', JSON.stringify(e1.map(v => v.cour)));
  const page2 = await pg.$$eval('#mur .corpsd li:not(.hors)', l => l.map(x => x.getAttribute('data-p')));
  verif('K8', e1.length === 2 && JSON.stringify(e1[1].lignes) === JSON.stringify(page2), '« 1 · 2/2 » montre les lignes de la page 2 du mur (mêmes data-p, non hors)', `vignette ${JSON.stringify(e1[1] && e1[1].lignes)} · mur ${JSON.stringify(page2)}`);
  await pg.click('#volet .vig[data-i="0"]'); await pg.waitForTimeout(300); const gardee = await garde(pg); const retour = await lireMur(pg);
  verif('K8', gardee && /page 1 \/ 2/.test(retour.page), 'clic sur « 1 · 1/2 » → la garde « La classe te suivrait », « Y aller » → le mur dit « page 1 / 2 »', `garde ${gardee} · « ${retour.page} »`);
  await finK('K8', o); });

// K10 — à « ■ Arrêter » la répétition, la fenêtre du tableau revient à ce qu'elle montrait avant (p8-5h, point 11 ; cadrage 4, 1.5 : « à l'arrêt, tout ce qui a été joué est oublié » ;
//       p8-5c, point 4 : « rien ne reste ») : rien au mur avant → la fenêtre redevient vide ; la diapo 1 à 3 dévoilés au mur avant → la fenêtre la remontre, même compteur, mêmes lignes
await K('K10', 'après « ■ Arrêter », la fenêtre du tableau revient à ce qu\'elle montrait avant la répétition (n°13 · 19)', async () => {
  const videTableau = fen => fen.evaluate(() => { const mur = document.querySelector('.mur.tableau'); if (!mur) return { lis: 0, page: '' }; return { lis: Array.from(mur.querySelectorAll('li')).filter(l => l.getBoundingClientRect().height > 0).length, page: ((mur.querySelector('.page') || {}).textContent || '').trim() }; });
  { const o = await ouvrir(); const pg = o.pg; await atelier(pg); await huitLignes(pg); await pg.click('#at-jouer'); await pg.waitForTimeout(500); const fen = await ouvrirTableau(pg);
    for (let i = 0; i < 10; i++) { await pg.click('#bdev'); await pg.waitForTimeout(60); } await pg.waitForTimeout(400); const r = await lireMur(fen);
    await pg.click('#rep-stop'); await pg.waitForTimeout(700); const v = await videTableau(fen);
    verif('K10', r.lignes.length >= 1 && v.lis === 0 && v.page === '', 'rien au mur avant la répétition : après « ■ Arrêter », la fenêtre ne montre plus rien de la répétition (aucune ligne, aucun compteur)', `en répétition « ${r.page} » ${r.lignes.length} l. · après l'arrêt ${v.lis} ligne(s) visible(s), compteur « ${v.page} »`);
    await fen.close(); await finK('K10', o); }
  /* v3 (26/10, §12.28 (3a)) : le second cas — une heure lancée, puis la répétition dans le même écran — n'existe plus : l'écran « la classe en cours » n'a ni Atelier
     ni répétition. Ce qui reste à craindre — la répétition d'un AUTRE onglet (« ↗ Le site dans un nouvel onglet » → Atelier → « Jouer en avance ») qui toucherait
     la fenêtre du tableau de la classe — est mesuré par E3 (banc-1228, relance du contrôle n°62). */ });

// K11 — la vue « ⧉ Tableau » de la colonne de droite porte le compteur « page i / n » et montre la même page que le mur (p8-5h, point 12 ; p8-5f, point 5 : le tableau montre la même page que le pilote)
await K('K11', 'la vue « ⧉ Tableau » porte le compteur de page et montre la même page (n°13 · 20)', async () => { const o = await ouvrir(); const pg = o.pg; await atelier(pg); await huitLignes(pg); await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg);
  await pg.click('#btableau'); await pg.waitForTimeout(400);
  const lireVue = () => pg.evaluate(() => { const mur = Array.from(document.querySelectorAll('.mur.tableau')).find(m => !m.closest('#volet') && m.id !== 'p8-banc' && m.getBoundingClientRect().width > 0); if (!mur) return null; const c = mur.querySelector('.corpsd') || mur; return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), lignes: Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0).map(l => l.getAttribute('data-p')) }; });
  const v0 = await lireVue(), m0 = await lireMur(pg);
  verif('K11', !!v0 && /page 1 \/ 2/.test(v0.page) && v0.page === m0.page, 'à 0 dévoilé : la vue dit « page 1 / 2 », comme le mur', `vue « ${v0 && v0.page} » · mur « ${m0.page} »`);
  let n = 0; while (!/page 2 \/ 2/.test((await lireMur(pg)).page) && n < 15) { await pg.click('#bdev'); await pg.waitForTimeout(80); n++; } await pg.waitForTimeout(300); const v2 = await lireVue(), m2 = await lireMur(pg);
  verif('K11', !!v2 && /page 2 \/ 2/.test(v2.page) && v2.page === m2.page && v2.lignes.length > 0 && JSON.stringify(v2.lignes) === JSON.stringify(m2.lignes), '▶ jusqu\'à la page 2 : la vue dit « page 2 / 2 » et montre les mêmes lignes que le mur', `vue « ${v2 && v2.page} » ${JSON.stringify(v2 && v2.lignes)} · mur « ${m2.page} » ${JSON.stringify(m2.lignes)}`);
  await finK('K11', o); });

// K12 — dans l'atelier, Paul voit toujours où il écrit (p8-5h, point 13) : un paragraphe de quinze lignes tapé sans Entrée → le curseur reste dans le cadre de la diapo,
//       la zone « ✎ » et le compteur ne recouvrent pas la ligne active ; « À régler » dit « trop pleine » (cadrage 4, 0.4) ; rien ne sort par le haut (p8-5f, point 3)
await K('K12', 'dans l\'atelier, le curseur reste visible dans un paragraphe plus haut que la diapo (n°13 · 21)', async () => { const o = await ouvrir(); const pg = o.pg; await atelier(pg);
  const nbAvant = await pg.$$eval('#volet [data-at-di]', l => l.length); await pg.click('#mur .p8-ecrire');
  const mesure = () => pg.evaluate(() => { const mb = document.getElementById('mur').getBoundingClientRect(); const sel = getSelection(); const r = sel.rangeCount ? sel.getRangeAt(0).getBoundingClientRect() : null; const a = document.activeElement; const lb = a && a.closest('#mur') ? a.getBoundingClientRect() : null; const ab = lb && r ? { left: lb.left, right: lb.right, top: r.top, bottom: r.bottom } : null; /* la bande de la ligne où le curseur est */
    const chev = (x) => { if (!x || !ab) return false; const b = x.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.left < ab.right && b.right > ab.left && b.top < ab.bottom && b.bottom > ab.top; };
    const corps = document.querySelector('#mur .corpsd'); const premier = corps ? Array.from(corps.querySelectorAll('li')).find(l => !l.classList.contains('hors') && l.getBoundingClientRect().height > 0) : null;
    return { curseurDedans: !!r && r.height > 0 && r.top >= mb.top - 1 && r.bottom <= mb.bottom + 1, curseur: r && [Math.round(r.top), Math.round(r.bottom)], mur: [Math.round(mb.top), Math.round(mb.bottom)], chevZone: chev(document.querySelector('#mur .p8-ecrire')), chevCompteur: chev(document.querySelector('#mur .page')), sortHaut: !!premier && premier.getBoundingClientRect().top < mb.top - 1 }; });
  let pire = null; for (let i = 1; i <= 15; i++) { await pg.keyboard.type(`Segment ${i} du long paragraphe tapé sans Entrée, qui finit par dépasser la hauteur de la diapo. `, { delay: 1 }); await pg.waitForTimeout(120); const m = await mesure(); if (!m.curseurDedans || m.chevZone || m.chevCompteur || m.sortHaut) { pire = { i, ...m }; break; } }
  const nbApres = await pg.$$eval('#volet [data-at-di]', l => l.length); const regler = await pg.evaluate(() => document.body.innerText.replace(/\s+/g, ' ')).then(t => /trop pleine/i.test(t));
  verif('K12', !pire, 'quinze segments tapés sans Entrée : à chaque segment, le curseur est dans le cadre, la zone « ✎ » et le compteur ne recouvrent pas la ligne du curseur, rien ne sort par le haut', pire ? `au segment ${pire.i} : curseur ${JSON.stringify(pire.curseur)} pour un cadre ${JSON.stringify(pire.mur)} · zone ✎ chevauche ${pire.chevZone} · compteur chevauche ${pire.chevCompteur} · sort par le haut ${pire.sortHaut}` : undefined);
  verif('K12', nbApres === nbAvant && regler, 'aucune diapo créée, « À régler » dit « trop pleine »', `${nbAvant} → ${nbApres} diapos · trop pleine ${regler}`);
  await finK('K12', o); });

// K13 — dans l'atelier, Échap fait sortir de la ligne (p8-5h, point 14) : le curseur quitte le texte, le texte reste ; Maj+← change alors de page
await K('K13', 'dans l\'atelier, Échap sort de la ligne et Maj+← change de page (n°13 · 22)', async () => { const o = await ouvrir(); const pg = o.pg; await atelier(pg);
  await pg.click('#mur .p8-ecrire'); for (let i = 1; i <= 8; i++) { await pg.keyboard.type(`Ligne ajoutée numéro ${i}, assez longue pour prendre de la place dans la diapo.`, { delay: 2 }); if (i < 8) await pg.keyboard.press('Enter'); } await pg.keyboard.type(' FIN-HUIT'); await pg.waitForTimeout(300);
  const avant = await pg.evaluate(() => ({ dansTexte: !!(document.activeElement && document.activeElement.closest('#mur') && document.activeElement.getAttribute('contenteditable')), page: ((document.querySelector('#mur .page') || {}).textContent || '').replace(/[‹›]/g, '').trim() }));
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(300);
  const apres = await pg.evaluate(() => ({ dansTexte: !!(document.activeElement && document.activeElement.closest('#mur') && document.activeElement.getAttribute('contenteditable')), texte: document.getElementById('mur').textContent.includes('FIN-HUIT'), selection: String(getSelection()).length }));
  verif('K13', avant.dansTexte && !apres.dansTexte && apres.texte && apres.selection === 0, 'Échap : le curseur quitte la ligne, le texte reste, aucune sélection', `avant : dans le texte ${avant.dansTexte} · après : dans le texte ${apres.dansTexte}, texte intact ${apres.texte}, sélection ${apres.selection} caractère(s)`);
  await pg.keyboard.press('Shift+ArrowLeft'); await pg.waitForTimeout(300); const page = await pg.evaluate(() => ((document.querySelector('#mur .page') || {}).textContent || '').replace(/[‹›]/g, '').trim());
  verif('K13', /page 2 \/ 2/.test(avant.page) && /page 1 \/ 2/.test(page), 'puis Maj+← : la page 1', `« ${avant.page} » → « ${page} »`);
  await finK('K13', o); });

// K9 — le parcours fixe (protocole du 12/10, obligation 4) : le même à chaque audit, par le geste, à 1280 × 800
await K('K9', 'le parcours fixe', async () => { const o = await ouvrir(); const pg = o.pg;
  await atelier(pg); await pg.click('#volet [data-at-di="0"]'); await pg.waitForTimeout(300);
  await pg.click('#mur .p8-ecrire'); await pg.keyboard.type('Ligne du parcours fixe.'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
  verif('K9', await pg.$eval('#mur', m => m.textContent.includes('Ligne du parcours fixe.')), '1 · atelier : une ligne écrite dans la diapo 1 y est');
  await ecrireNote(pg, 0, 'Note du parcours fixe.'); await pg.keyboard.press('Escape'); await pg.waitForTimeout(400);
  verif('K9', (await noteDe(pg, await pg.evaluate(() => cle()))).includes('Note du parcours fixe.'), '2 · atelier : une note écrite sur l\'étape 1 est gardée');
  await ongPilotage(pg); await pg.waitForTimeout(300); await lancer(pg); const c0 = await pg.$eval('#compte', e => e.textContent.trim());
  verif('K9', /^0 \/ 7 dévoilés/.test(c0) && /\d\d:\d\d/.test(await pg.$eval('.haut', h => h.textContent)), '3 · l\'heure lancée : « 0 / 7 dévoilés » (6 éléments + la ligne écrite), le chrono tourne', `« ${c0} »`);
  for (let i = 0; i < 3; i++) { await pg.click('#bdev'); await pg.waitForTimeout(150); } const c3 = await pg.$eval('#compte', e => e.textContent.trim()); const notes3 = await pg.$eval('#notesd', d => d.textContent);
  verif('K9', /^3 \/ 7/.test(c3) && notes3.includes('Note du parcours fixe.'), '4 · ▶ ×3 : « 3 / 7 dévoilés », le panneau montre la note de la diapo 1', `« ${c3} »`);
  await pg.keyboard.press('PageDown'); await pg.waitForTimeout(300); const g1 = await garde(pg); const cour = await pg.$eval('#volet .vig.cour', v => v.dataset.i).catch(() => '?'); const notes2 = await pg.$eval('#notesd', d => d.textContent);
  verif('K9', g1 && cour === '1' && !notes2.includes('Note du parcours fixe.'), '5 · PageDown → la garde, « Y aller » → la diapo 2 est courante, le panneau ne montre plus la note de la 1', `garde ${g1} · courante ${cour}`);
  const fen = await ouvrirTableau(pg); const tTexte = await fen.evaluate(() => document.body.innerText.replace(/\s+/g, ' ')); await fen.close();
  verif('K9', /Voyageur/.test(tTexte), '6 · « 🖥 Écran 2 » : la fenêtre du tableau montre la diapo 2 (« Le Voyageur… »)', tTexte.slice(0, 80));
  await pg.keyboard.press('PageUp'); await pg.waitForTimeout(300); await garde(pg);
  await pg.evaluate(() => { const li = document.querySelector('#mur li[data-k="1"]'); const tn = Array.from(li.childNodes).find(n => n.nodeType === 3 && n.textContent.trim().length > 8); const r = document.createRange(); r.setStart(tn, 2); r.setEnd(tn, 10); const s = getSelection(); s.removeAllRanges(); s.addRange(r); });
  await pg.click('#btxt'); await pg.waitForTimeout(100); await pg.click('#pal-txt .p8-p[data-c="rouge"]'); await pg.waitForTimeout(250);
  verif('K9', (await pg.$$eval('#mur li[data-k="1"] span[data-coul], #mur li[data-k="1"] .p8-ct', l => l.map(s => getComputedStyle(s).color))).some(c => /192, 57, 43/.test(c)), '7 · retour sur la diapo 1, « A » rouge sur l\'étape 2 → le texte est rouge');
  /* v3 (§12.28 (3a)) : l'écran de la classe n'a ni Atelier ni répétition */ const ecranClasse = await pg.evaluate(() => ({ classe: document.documentElement.classList.contains('dr-en-classe'), atelier: !!Array.from(document.querySelectorAll('.at-onglet[data-vue="atelier"], .at-onglet[data-vue="structure"], #ong-atelier, #at-jouer')).find(b => b.offsetParent !== null) }));
  verif('K9', ecranClasse.classe && !ecranClasse.atelier && (await rect(pg, '#bfin')).visible, '8 · l\'heure lancée se joue dans l\'écran de la classe : ni Atelier, ni « Jouer en avance » ; « Fin de l\'heure » est là', JSON.stringify(ecranClasse));
  await pg.click('#bfin'); await pg.waitForTimeout(800); const fin = await pg.$eval('#fin', f => ({ visible: f.getBoundingClientRect().width > 0, texte: f.innerText.replace(/\s+/g, ' ').slice(0, 60) })).catch(() => ({ visible: false, texte: '' }));
  verif('K9', fin.visible && /étape 1 sur 7/.test(fin.texte), '10 · « Fin de l\'heure » : le panneau de fin, « étape 1 sur 7 : l\'échéance »', `« ${fin.texte} »`);
  await finK('K9', o); });

await nav.close();
R.push(''); R.push(`${nb} vérifications, ${echecs} échec(s)`); R.push(`--- fin : ${echecs} défaut(s)`);
const md5 = createHash('md5').update(fs.readFileSync(MAQ)).digest('hex'); const md5Ctl = createHash('md5').update(fs.readFileSync(new URL(import.meta.url))).digest('hex');
const texte = `contrôles de la conscience n°13 (déroulé) · v2 · entrée ${ENTREE_SITE ? 'site (faux hub)' : 'maquette'} · controles.mjs md5 ${md5Ctl} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · maquette : ${MAQ} · md5 ${md5}\n` + R.join('\n') + '\n';
console.log(texte); if (SORTIE) fs.writeFileSync(SORTIE, texte);
process.exit(echecs ? 1 : 0);
