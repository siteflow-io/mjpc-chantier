// LE BANC D'E4 — le récit et le papier, par le geste. Banc unique : il rejoue tout le lot et échoue (code 1) si un seul échoue.
// usage : node banc.mjs <fichier.html> [dossier-de-sortie]
//   le fichier : LIVRAISONS/INTEGRATION/assemble/index.html (le site intégré : MJPC_ENTREE=site, faux hub, horloge au lundi 14/09 09:00)
//                ou une maquette p8-5g où dr-recit.js est injecté (avant E1-a : MJPC_ENTREE absent).
//   MJPC_PLAYWRIGHT, MJPC_CHROMIUM, MJPC_HUB : comme les outils de la conscience (AUDITS/INTEGRATION-DEROULE/README.md).
// Les attendus viennent du mandat E4 et du cadrage 2, jamais de la version jouée. Un pas qu'on ne peut pas jouer sur cette entrée
// est « absent » (dit, pas compté vert) ; un pas absent du territoire d'E4 sur le site est un ÉCHEC.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const F = path.resolve(process.argv[2] || ''); if (!process.argv[2] || !fs.existsSync(F)) { console.log('usage : node banc.mjs <fichier.html> [sortie]'); process.exit(2); }
const OUT = path.resolve(process.argv[3] || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'sorties', new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'))); fs.mkdirSync(OUT, { recursive: true });
const CAP = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'captures'); fs.mkdirSync(CAP, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(F), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const SITE = process.env.MJPC_ENTREE === 'site', SIMULE = process.env.MJPC_ENTREE === 'simule', HUBBE = SITE || SIMULE;   /* simule : la maquette + E4/bancs/socle-simule.js (un hub en mémoire, la séance 0 du faux hub) */
const HUB = path.resolve(process.env.MJPC_HUB || path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const md5 = createHash('md5').update(fs.readFileSync(F)).digest('hex');
const L = []; let nbOk = 0, nbEchec = 0, nbAbsent = 0;
const dire = s => { L.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { if (ok === null) { nbAbsent++; dire('  absent ' + k + ' · ' + quoi + (detail ? ' — ' + detail : '')); return false; } if (ok) nbOk++; else nbEchec++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && !ok ? ' — ' + String(detail).slice(0, 400) : '')); return !!ok; };
dire(`banc E4 · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · ${SITE ? 'entrée du site (faux hub)' : SIMULE ? 'maquette + socle simulé + dr-recit.js' : 'maquette + dr-recit.js'} · ${path.basename(F)} · md5 ${md5}`);

// ── le faux hub (le même dispositif que parcours.mjs et controles.mjs v2) ──
const J_ = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const store = () => { const st = { classes: J_('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J_('taxonomie.json') : null, site: { '3e': J_('site_3e.json'), config: J_('site_config.json'), edt: { grille: { '2026-2027': J_('grille-appariee.json') }, calendrier: { '2026-2027': J_('calendrier.json') }, creneaux: J_('creneaux.json') } } };
  if (process.env.E4_SANS_ED !== '1') { try { st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {} } return st; };
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else if (m === 'DELETE') pos(c, null); else pos(c, bd); window.__ECR.push({ m, c, t: Date.now() }); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('{}', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
let HUB_PERSISTANT = null;   /* entre deux ouvertures (le rechargement), le faux hub garde ce qui a été écrit */
async function ouvrir(o = {}) {
  const ctx = await nav.newContext({ viewport: { width: 1366, height: 768 }, timezoneId: 'Europe/Paris' }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  if (SITE) await ctx.route(u => !String(u).startsWith('file:'), r => r.abort());
  const pg = await ctx.newPage(); const errs = [], boites = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
  if (SIMULE) { const se = store().site['3e'].chapitres; const s0 = (Array.isArray(se) ? se[0] : se['0']).seances; await pg.addInitScript(([h, sc]) => { window.__E4HUB_INIT = h; window.__E4SEANCE = sc; }, [o.frais ? null : HUB_PERSISTANT, Array.isArray(s0) ? s0[0] : s0['0']]); }
  if (!SITE) { await pg.goto('file://' + F); await pg.waitForTimeout(600); return { ctx, pg, errs, boites }; }
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, o.hub || (o.frais ? null : HUB_PERSISTANT) || store());
  /* le voile #fi-overlay du site (« Aucune fiche n'existe pour cette application ») : le faux hub n'a pas /manifestes (audit E1, F15, à la conscience) — écarté ici à chaque apparition, comme une lacune du faux hub, pas du site */
  await pg.addInitScript(() => { const ot = () => { const v = document.getElementById('fi-overlay'); if (v) v.remove(); }; document.addEventListener('DOMContentLoaded', () => { ot(); new MutationObserver(ot).observe(document.body, { childList: true, subtree: true }); }); });
  if (o.modeTest) await pg.addInitScript(() => { try { localStorage.setItem('mjpc_mode_test', '1'); } catch (e) {} });
  await pg.goto('file://' + F + '?n=3e', { waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.click('#tprof-btn').catch(() => {}); await pg.waitForTimeout(500); await pg.evaluate(() => { if (typeof atelierOuvrir === 'function') atelierOuvrir(); }); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(2000);
  return { ctx, pg, errs, boites };
}
const p = (pg, ms) => pg.waitForTimeout(ms);
const cap = async (pg, nom) => { try { await pg.screenshot({ path: path.join(CAP, nom + '.png'), fullPage: false }); } catch (e) {} };
const garde = async pg => { for (let i = 0; i < 3; i++) { const g = await pg.$('#garde.on, #garde-devant.on'); if (!g) return; await pg.keyboard.press('Escape'); await p(pg, 150); } };
async function lancer(pg) { await pg.click('[data-lancer="1"]'); await p(pg, 700); }
async function devoiler(pg, n) { for (let i = 0; i < n; i++) { await pg.click('#bdev'); await p(pg, 90); } }
async function parole(pg, ini) { await pg.keyboard.press('F2'); await p(pg, 100); await pg.keyboard.type(ini); await p(pg, 150); await pg.keyboard.press('1'); await p(pg, 80); await pg.keyboard.press('Enter'); await p(pg, 250); }
async function jusquA(pg, cond, max = 90) { let n = 0; while (!(await pg.evaluate(cond)) && n < max) { if (await pg.$('.garde.on')) break; /* une garde (le cahier, un saut) : on ne force rien */ await pg.click('#bdev', { timeout: 3000 }).catch(() => {}); await p(pg, 60); n++; } return await pg.evaluate(cond); }
async function reponse(pg, ini, txt) { await pg.click('#mur .rep .ini'); await pg.keyboard.type(ini); await p(pg, 100); await pg.click('#mur .rep .dit'); await pg.keyboard.type(txt); await pg.keyboard.press('Enter'); await p(pg, 300); }
async function relecture(pg) { const v = await pg.$('.at-onglet[data-vue="relecture"]'); if (v) await v.click(); else if (await pg.$('.voile.on')) await pg.evaluate(() => voir('relecture')); /* la maquette rechargée s'ouvre sur son emploi du temps simulé */ else await pg.click('#ong-relecture'); await p(pg, 900); }
async function face(pg, debut) { const ok = await pg.evaluate(t => { const b = Array.from(document.querySelectorAll('#faces [data-f]')).find(x => x.textContent.trim().startsWith(t)); if (!b) return false; b.click(); return true; }, debut); await p(pg, 500); return ok; }
const texteRel = pg => pg.evaluate(() => (document.querySelector('#rel') || {}).innerText || '');
const ecritures = pg => pg.evaluate(() => (window.__ECR || []).map(x => x.m + ' ' + x.c));
const DIT = 'Ils montrent tous la nature plus grande que l’homme';
const PHRASE = 'Phrase corrigée par M. Meney pour le banc E4.';

// ═════ R1 · le récit d'une heure jouée : la diapo, l'heure, le prénom, la réponse (mandat, bancs ; cadrage 2 · 1.2, 1.3, 1.5 bis) ═════
{ const o = await ouvrir(); const pg = o.pg; await lancer(pg);
  await devoiler(pg, 3); await parole(pg, 'ZP');
  const q = await jusquA(pg, () => ecran().blocs.some(b => b.t === 'question')); await pg.click('#bdev'); await p(pg, 150); await garde(pg);
  if (q) await reponse(pg, 'GA', DIT);
  await relecture(pg); await cap(pg, 'E4-R1-le-recit');
  const t = await texteRel(pg); const act = await pg.evaluate(() => ecran().act);
  verif('R1', q, 'une diapo à question est atteinte en dévoilant', null);
  verif('R1', /Ce qu'on a fait aujourd'hui/.test(t), 'la face « Le récit » s\'ouvre sur « Ce qu\'on a fait aujourd\'hui »', t.slice(0, 200));
  verif('R1', t.includes(act), 'le récit porte la diapo jouée (son activité)', act);
  verif('R1', /À \d{1,2} h \d{2}, /.test(t), 'le récit porte l\'heure réelle (« À hh h mm, »)', t.slice(0, 300));
  verif('R1', /Gatien/.test(t) && t.includes(DIT), 'le récit porte le prénom (Gatien, pas ses initiales) et sa réponse', t.slice(0, 1200));
  verif('R1', !/\bGA\b a répondu/.test(t), 'aucune initiale à la place d\'un prénom', null);
  verif('R1', o.errs.length === 0, 'zéro erreur JS', JSON.stringify(o.errs));

  // ═════ R2 · ma version : une phrase corrigée survit au rechargement (C/recit/1.texte, version 'moi') ; « relu » (C/recit/1.relu) ═════
  await pg.click('#rel [data-rv="moi"]'); await p(pg, 400);
  const edit = await pg.$('#rel .recit.ma-version'); if (edit) { await edit.click(); await pg.keyboard.press('Control+End'); await pg.keyboard.type(' ' + PHRASE); await p(pg, 1400); }
  verif('R2', !!edit && (await pg.evaluate(ph => ((S.recitMoi || {})[1] || '').includes(ph), PHRASE)), '« ma version (modifier) » : la phrase corrigée est dans ma version', null);
  // le récit relu : l'étape 4 de la fin de l'heure (E2 la pose ; ici par son geste s'il existe)
  const relu = await pg.evaluate(() => { const b = document.getElementById('f-relu'); if (b) { b.click(); return 'geste'; } if (typeof S !== 'undefined') { return null; } });
  if (HUBBE) { await p(pg, 2200); const ecr = await ecritures(pg); const chem = x => x.slice(x.indexOf(' ') + 1); const recits = ecr.filter(x => /\/deroule_joue\/[^/]+\/recit\/\d+$/.test(chem(x)));
    verif('R2', recits.length > 0, 'C/recit/1 est écrit au hub (débounce 900 ms, par dr_ecrire)', JSON.stringify(ecr.slice(-12)));
    const auHub = await pg.evaluate(() => { const c = (typeof dr_cheminC === 'function') ? dr_cheminC() : ''; const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q.concat(['recit', '1'])) { if (!n || typeof n !== 'object') return null; n = n[k]; } return n || null; });
    verif('R2', auHub && auHub.version === 'moi' && String(auHub.texte || '').includes(PHRASE), 'au hub : C/recit/1 = {version:"moi", texte: la phrase corrigée, versions[]}', JSON.stringify(auHub).slice(0, 300));
    HUB_PERSISTANT = await pg.evaluate(() => window.__HUB);
    // K15 (E4) : de mon fait, seul C/recit/<h>
    const miennes = ecr.filter(x => /recit/.test(x)); verif('K15-E4', miennes.every(x => /\/deroule_joue\/[^/]+\/recit\/\d+$/.test(chem(x))), 'K15 : ce qu\'E4 écrit, c\'est C/recit/<heure> et rien d\'autre', JSON.stringify(miennes));
  } else verif('R2', null, 'C/recit/1 au hub', 'la maquette n\'a pas de hub : se mesure sur le site');

  // ═════ P1 · la face Papier : le récit relu, l'entête, le travail, le pied ; ce qu'on colle ═════
  const okF = await face(pg, 'Papier'); await p(pg, 300); await cap(pg, 'E4-P1-le-papier');
  const pap = await pg.evaluate(() => { const d = document.querySelector('#rel .dr-papier'); return d ? d.innerText : ''; });
  verif('P1', okF && !!pap, 'la face « Papier » existe dans la Relecture (proposition 96)', null);
  verif('P1', /CLASSE|Classe/.test(pap) && /CHAPITRE|Chapitre/.test(pap) && /SÉANCE|Séance/.test(pap), 'l\'entête du papier : classe · chapitre · séance', pap.slice(0, 200));
  verif('P1', /Ce qu'on a fait aujourd'hui/.test(pap) && /À relire — \S+/.test(pap), '« Ce qu\'on a fait aujourd\'hui », « À relire — <date> »', pap.slice(0, 300));
  verif('P1', pap.includes(PHRASE), 'le papier est composé depuis le récit relu (ma version, la phrase corrigée y est)', pap.slice(0, 600));
  verif('P1', /MJPC · monsieurjaipascompris/.test(pap) && /À relire\./.test(pap), 'le pied « MJPC · monsieurjaipascompris » / « À relire. »', null);
  const trav = await pg.evaluate(() => typeof texteTravail === 'function' ? (texteTravail() || '') : ''); verif('P1', !trav || /Pour la prochaine séance/.test(pap), 'le travail à faire est sur le papier quand il y en a un', trav.slice(0, 120));
  // l'impression : seule la feuille
  await pg.emulateMedia({ media: 'print' }); await p(pg, 200); await cap(pg, 'E4-P1-impression');
  const imp = await pg.evaluate(() => { const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; }; const z = document.getElementById('dr-impression'); const hors = Array.from(document.body.children).filter(x => x !== z && vis(x)).map(x => x.tagName + '#' + x.id + '.' + x.className).slice(0, 5); return { feuille: !!z && vis(z) && /Ce qu'on a fait aujourd'hui/.test(z.innerText), hors }; });
  await pg.emulateMedia({ media: 'screen' });
  verif('P1', imp.feuille && imp.hors.length === 0, '@media print : la feuille, et rien d\'autre du site', JSON.stringify(imp));

  // ═════ ED · « Copier pour École Directe » : le HTML propre (R22) et le texte de la maquette ═════
  await face(pg, 'Le récit'); await p(pg, 300); await pg.click('#rel [data-rv="site"]').catch(() => {}); await p(pg, 300);
  await pg.click('#r-copie-contenu'); await p(pg, 500);
  const cp = await pg.evaluate(() => window.DR_RECIT_DERNIERE_COPIE || null);
  verif('ED', cp && /font-family:Georgia/.test(cp.html) && !/class=|data-cle|contenteditable/.test(cp.html), 'la copie « contenu de séance » est un HTML propre (ancien copierED : Georgia, sans classes ni repères)', cp ? cp.html.slice(0, 200) : 'rien');
  verif('ED', cp && /Gatien/.test(cp.texte) && !/Pour la prochaine séance/.test(cp.texte), 'le texte copié : le récit, sans le travail à faire', cp ? cp.texte.slice(-200) : '');
  const presse = await pg.evaluate(async () => { try { const it = await navigator.clipboard.read(); return it.length ? it[0].types : []; } catch (e) { return 'illisible : ' + e.message; } });
  verif('ED', Array.isArray(presse) ? presse.includes('text/html') && presse.includes('text/plain') : null, 'le presse-papier reçoit text/html et text/plain', JSON.stringify(presse));
  verif('ED', await pg.evaluate(() => (S.copieED || {})[1] && J.some(x => x.type === 'copie-ed')), 'la copie est notée (S.copieED, journal copie-ed : la garde après copie s\'en sert)', null);
  await o.ctx.close();
}

// ═════ R3 · le rechargement : ma version revient (site) ═════
if (HUBBE && HUB_PERSISTANT) { const o = await ouvrir(); const pg = o.pg; if (process.env.E4_DEBUG) console.log('DEBUG', JSON.stringify(await pg.evaluate(() => { const c = dr_cheminC(); const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) n = n && n[k]; return { c, lancee: S.lancee, heure: S.heure, J: J.map(x => x.type + ':' + x.h + ':' + x.di).join(' '), hubJ: n && n.journal ? JSON.stringify(n.journal).slice(0, 600) : null, etatS: n && n.etat ? Object.keys(n.etat).join(',') + ' / S:' + Object.keys(n.etat.S || {}).length : null, hubKeys: n ? Object.keys(n) : null, cours: window.__HUB.site && window.__HUB.site.cours_actif }; })).slice(0, 1500)); await relecture(pg); await p(pg, 400); await relecture(pg); const t = await texteRel(pg);
  verif('R3', t.includes(PHRASE), 'rechargé : la phrase corrigée (ma version) est là, relue au hub', t.slice(0, 400));
  if (SITE) { await pg.click('#rel [data-rv="site"]').catch(() => {}); await p(pg, 500); const t2 = await texteRel(pg); const jHub = await pg.evaluate(() => { const q = dr_cheminC().split('/').filter(Boolean); let n = window.__HUB; for (const k of q) n = n && n[k]; const j = n && n.journal; return JSON.stringify(j || []); }); const aRep = /"type":"reponse"/.test(jHub); verif('R3', aRep ? (/Gatien/.test(t2) && t2.includes(DIT)) : null, aRep ? 'rechargé, « composé par le site » : le récit se recompose depuis le journal relu au hub (C/journal, C/etat d\'E2)' : 'rechargé, le récit recomposé depuis C/journal', aRep ? t2.slice(0, 600) : 'C/journal au hub ne contient pas la réponse écrite (E2 : le journal n\'est poussé qu\'au lancement) — ' + jHub.length + ' o'); } await cap(pg, 'E4-R3-apres-rechargement'); await o.ctx.close(); }
else verif('R3', null, 'le rechargement', HUBBE ? 'R2 n\'a rien laissé au hub' : 'la maquette n\'a pas de hub');

// ═════ R4 · le rappel d'une fiche (R2 du recyclage) et ses citations (R15) ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg; await lancer(pg);
  /* la séance 0 du faux hub n'a aucune fiche (audit M7) et le geste du rappel est celui de l'Atelier (E1) : la fiche est posée dans la copie
     de la diapo jouée, telle qu'E1 la posera ({t:'fiche', txt, el, rappel:{motif}}) — c'est l'écriture du récit qu'on mesure ici */
  await pg.evaluate(() => { const e = ecran(); e.blocs.push({ t: 'fiche', bid: 'b-e4-fiche', txt: 'Le registre lyrique', el: ['Le lyrique exprime des sentiments personnels.'], rappel: { motif: 'reviser', libre: '' } }); tout(); });
  await devoiler(pg, 2); await relecture(pg); const t = await texteRel(pg);
  verif('R4', /on a repris la fiche Le registre lyrique — pour réviser avant l'évaluation/i.test(t), 'le rappel s\'écrit dans le récit : « on a repris la fiche … — pour réviser avant l\'évaluation »', t.slice(0, 900));
  verif('R4', /repris une fiche déjà vue/.test(t), 'le bilan dit « repris une fiche déjà vue »', t.slice(-300));
  await face(pg, 'Papier'); const pap = await pg.evaluate(() => (document.querySelector('#rel .dr-papier') || {}).innerText || '');
  verif('R4', /à coller dans le cahier/i.test(pap) && /Le registre lyrique/.test(pap) && /Rappel — pour réviser avant l'évaluation/.test(pap), 'le papier « ce qu\'on colle » : la fiche montrée, son rappel, « à coller dans le cahier » (ancien papier, R16)', pap.slice(-400)); await cap(pg, 'E4-R4-fiche-a-coller');
  await o.ctx.close(); }

// ═════ D1 · un document de Structure dans l'écran, par référence (site) ═════
if (HUBBE) { const o = await ouvrir({ frais: true }); const pg = o.pg; await lancer(pg);
  await pg.evaluate(() => ouvrirDocs()); await p(pg, 400); const okD = await clicTexte(pg, '#fdocs-l button', 'Projeter'); await p(pg, 600); await cap(pg, 'E4-D1-document');
  const d = await pg.evaluate(() => { const f = document.querySelector('#mur .dr-doc-cadre'); const m = document.querySelector('#mur .dr-doc-ref'); return { src: f ? f.getAttribute('src') : '', txt: m ? m.innerText : '' }; });
  verif('D1', okD && /^https:\/\/drive\.google\.com\/file\/d\/1NJgOv-C6AqMDKTuOd9yNO5I_pq3n4mhc\/preview$/.test(d.src), 'l\'item Drive de la séance s\'ouvre dans l\'écran en /preview', JSON.stringify(d));
  verif('D1', /vient de Structure · Séance \d+/.test(d.txt), '« cette fiche vient de Structure · Séance N »', d.txt.slice(0, 120));
  await o.ctx.close(); }
else verif('D1', null, 'les documents par référence', 'la maquette simule ses documents : se mesure sur le site');

// ═════ 13·8 · le récit se fonde sur ce que la classe a vu dans sa copie : une phrase corrigée en classe apparaît corrigée ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg; await lancer(pg); await devoiler(pg, 1);
  const cons = await pg.$('#mur [data-p="0.t"]'); let corrige = false;
  if (cons) { await cons.click(); await pg.keyboard.press('Control+A'); await pg.keyboard.type('Regardez les tableaux et dites ce que vous voyez.'); await p(pg, 400); await pg.keyboard.press('Escape'); await p(pg, 300); corrige = true; }
  await relecture(pg); const t = await texteRel(pg);
  verif('13·8', corrige ? /on a regardé les tableaux et dit ce qu'on voyait|Regardez les tableaux|on a regardé les tableaux/i.test(t) : null, 'la consigne corrigée en classe (la copie) est celle que raconte le récit', t.slice(0, 500));
  await o.ctx.close(); }

// ═════ P0 · avant tout lancement, il n'y a ni récit ni papier (relecteur neuf 2 ; cadrage 2 · 1.4) ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg; await relecture(pg);
  const f = await pg.evaluate(() => Array.from(document.querySelectorAll('#faces [data-f]')).map(b => b.textContent.trim()));
  verif('P0', !f.some(t => /^Papier|^Le récit ·/.test(t)), 'aucune heure lancée : aucune face « Le récit » ni « Papier » à imprimer', JSON.stringify(f));
  await o.ctx.close(); }

// ═════ T · la transposition et la langue (relecteur neuf 1) : les mots accentués, « un élève », la copie sans repère pour Paul ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg;
  const t = await pg.evaluate(() => [recit('Placez les poètes sur la frise, devant vous.'), recit('Regardez le cinéma de ta ville.'), personne('Les poètes et tes amis')]);
  verif('T', !/poèses|cinénotre|poè ses/.test(t.join(' ')) && /poètes/.test(t[0]) && /ses amis/.test(t[2]), 'les mots accentués ne sont pas coupés par la transposition (« poètes », pas « poèses »)', JSON.stringify(t));
  await lancer(pg); const q = await jusquA(pg, () => ecran().blocs.some(b => b.t === 'question')); await pg.click('#bdev'); await p(pg, 150); await garde(pg);
  if (q) await reponse(pg, 'ZZ', 'une réponse sans élève reconnu');
  await relecture(pg); const r = await texteRel(pg);
  verif('T', q ? /[Uu]n élève a répondu : « une réponse sans élève reconnu/.test(r) && !/\bZZ a répondu/.test(r) : null, 'un élève non identifié : « un élève a répondu », jamais ses initiales (cadrage 2 · 1.5 bis)', r.slice(0, 900));
  await pg.click('#rel [data-rv="moi"]'); await p(pg, 400); const r2 = await texteRel(pg);
  verif('T', /Ce qu'on a fait aujourd'hui/.test(r2) && /Cette heure a commencé à/.test(r2), '« ma version » garde l\'entête et le cadre de l\'heure', r2.slice(0, 300));
  await pg.click('#r-copie-contenu'); await p(pg, 400); const cp = await pg.evaluate(() => window.DR_RECIT_DERNIERE_COPIE || null);
  verif('T', cp && /Ce qu'on a fait aujourd'hui/.test(cp.texte) && !/tu la reprendras|composée par le site depuis/.test(cp.texte) && /<b>[^<]+<\/b><br>/.test(cp.html) /* le titre du paragraphe (« Activité N — … », ou le nom de la diapo quand la trame n'a pas d'activités) */, 'la copie ED de ma version : avec l\'entête, sans repère pour Paul, le titre d\'activité en titre', cp ? cp.texte.slice(0, 200) : '');
  const ed = await pg.$('#rel .recit.ma-version'); if (ed) { await ed.click(); await p(pg, 300); }
  verif('T', await pg.evaluate(() => document.getElementById('garde-copie').classList.contains('on')), 'après une copie ED, corriger ma version passe par la garde (cadrage 2 · 3.8)', null);
  await o.ctx.close(); }

await nav.close();
dire(`— fin : ${nbOk} ok · ${nbEchec} échec(s) · ${nbAbsent} absent(s) — ${nbEchec ? 'ROUGE' : 'VERT'}`);
fs.writeFileSync(path.join(OUT, 'banc-E4.txt'), L.join('\n') + '\n');
process.exit(nbEchec ? 1 : 0);
