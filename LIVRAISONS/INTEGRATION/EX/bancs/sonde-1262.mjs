// EX · LA SONDE §12.62 PAR LE GESTE (A110) — la ⑨ : l'Atelier (Paul 28/10, « 93 à 96 oui »).
// 1 : « Ce que la diapo déclare » ouverte par défaut, seule en haut de la colonne de droite (l'aide dessous) ; chaque champ a un cadre (et le curseur de texte) ;
//     « — hors activité » choisi : aucune ligne de plus dans « À régler » ; l'import accepte une diapo hors activité à 0 minute ; « réactivation » reste dans la liste, grisée, avec sa raison.
// 2 : « Insérer une diapo après » / « Insérer une diapo avant » (clic droit) : une diapo vierge — aucun texte au mur, hors activité, 0 minute, l'heure ne bouge pas ;
//     avant la première diapo de H2 ; une durée donnée compte ; Ctrl + Z défait.
// 3 : les quatre diapos invariables : séance 1 = présentation du chapitre, plan, présentation de la séance, problématique ; séance 2 = les deux dernières ; remplies avec les mots de
//     la feuille sommaire (« Entrée du programme : », « Compétence(s) principale(s) : », le plan, « Notre question ») ; hors activité, 0 minute, pas au hub tant qu'intactes ;
//     « Retirer » → retenu (deroule/retraits, et après rechargement) ; Ctrl + Z la remet.
// 4 : la colonne : renommer (double-clic ; clic droit), la colonne attend pendant le renommage (3,5 s, la relecture du hub passe), masquer (jamais jouée : la répétition la saute),
//     glisser-déposer (et refus devant les diapos d'ouverture), sélection (Maj / Ctrl + clic : supprimer, glisser, envoyer), copier / coller vers une autre séance et un autre chapitre ;
//     chaque geste passe par Ctrl + Z ; chaque entrée de menu a son infobulle, chaque entrée grisée dit pourquoi.
// Le faux hub vit dans localStorage (un rechargement le garde, comme banc-1228). Le chapitre : E4/prompt/chapitre-3e-au-contrat.json, collé dans « 📚 Nouveau chapitre » (le geste
// de Paul), avec une diapo hors activité à 0 minute en tête de la séance 2 (le tableau de Friedrich, revu en entrant). Un double du chapitre (« Créer un double ») sert d'autre chapitre.
// usage : node sonde-1262.mjs <assemble/index.html> [sortie.txt]   (MJPC_TAILLES, défaut 1707x743 ; MJPC_CAPT=<dossier>). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-1262.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..', '..');
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const TAILLES = String(process.env.MJPC_TAILLES || '1707x743').split(',').map(t => t.split('x').map(Number));
const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const info = (k, quoi) => dire('  info   ' + k + ' · ' + quoi);
const p = (pg, ms) => pg.waitForTimeout(ms);

/* ── le faux hub (celui de banc-1228 : il vit dans localStorage, un rechargement le garde) ── */
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const hubStore = () => ({ classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } });
const fauxHub = s => { let sv = null; try { sv = localStorage.getItem('__EX62HUB'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { localStorage.setItem('__EX62HUB', JSON.stringify(window.__HUB)); } catch (e) {} };
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const compris = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (!m || !(m.getBoundingClientRect().height > 0)) return null; const t = m.innerText.replace(/\s+/g, ' ').trim().slice(0, 240); const b = Array.from(m.querySelectorAll('button')).find(x => /^(Compris|OK|Fermer)$/.test(x.textContent.trim())); if (b) b.click(); return t; });
const modaleBouton = (pg, re) => pg.evaluate(src => { const m = document.getElementById('at-modale'); if (!m || !(m.getBoundingClientRect().height > 0)) return null; const t = m.innerText.replace(/\s+/g, ' ').trim().slice(0, 240); const b = Array.from(m.querySelectorAll('button')).find(x => new RegExp(src).test(x.textContent.trim())); if (!b) return null; b.click(); return t; }, re.source);
const capt = async (pg, W, H, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, W + 'x' + H + '-' + nom + '.png') }).catch(() => {}); };

/* ── le chapitre au contrat, et la diapo hors activité de Paul en tête de la séance 2 (0 minute, sans activité) ── */
const CH = JSON.parse(fs.readFileSync(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'E4', 'prompt', 'chapitre-3e-au-contrat.json'), 'utf8'));
CH.chapitre.seances.forEach(se => ((se.deroule || {}).ecrans || []).forEach(e => { if (e && e.role === 'bilan') (e.blocs || []).forEach(b => { if (b && Array.isArray(b.el)) b.el = b.el.map(x => { x = String(x).replace(/\.$/, ''); return x.length > 45 ? x.split(' : ')[0].slice(0, 45) : x; }); }); }));   /* le fichier date du 22/10 (comme sonde-1265, banc-1228 42i) */
const HORS = { act: 'Le Voyageur contemplant une mer de nuages', dur: 0, horsActivite: true, comp: [], heure: 1, blocs: [{ t: 'image', ref: 'poesie-peinture-xixe/tableau-5-friedrich-voyageur.webp', legende: 'Le Voyageur contemplant une mer de nuages, Caspar David Friedrich, vers 1818' }] };
CH.chapitre.seances[1].deroule.ecrans.unshift(HORS);
const TITRE = CH.chapitre.title; const PROB = CH.chapitre.problematique;

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async (W, H) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, hubStore());
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); await pg.clock.setFixedTime(HORLOGE);
  await entrer(pg); return { ctx, pg, errs, boites }; };
const entrer = async pg => { await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); };
/* « 📚 Nouveau chapitre » : le JSON collé, « Vérifier », la voie (Remplacer, Créer un double), la confirmation */
const importer = async (pg, json, voie) => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1000); await sansVoiles(pg);
  if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(pg, 900); await clicTexte(pg, 'button', '← Mes chapitres'); await p(pg, 900); }
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 800);
  await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.at-porte-ch')).find(x => x.offsetParent !== null); if (b) b.click(); }); await p(pg, 1500);
  await pg.fill('#ch-coller', JSON.stringify(json)); await p(pg, 400); await clicTexte(pg, 'button', 'Vérifier'); await p(pg, 1800);
  const refus = await pg.evaluate(() => { const t = document.body.innerText; const m = t.match(/(refus|n’a pas de durée|sans activité|actId)[^\n]{0,160}/ig); return m ? m.slice(0, 4) : []; });
  const bouton = await pg.evaluate(v => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && b.innerText.trim() === v); if (!b) return null; b.click(); return v; }, voie); await p(pg, 1500);
  await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && m.getBoundingClientRect().height > 0 && Array.from(m.querySelectorAll('button')).find(x => /Créer|Remplacer|Mettre à jour|Réinjecter|Continuer|double/i.test(x.textContent)); if (b) b.click(); }); await p(pg, 3500);
  await compris(pg); return { bouton, refus }; };
/* ouvrir un chapitre (par son titre) dans l'Atelier */
const ouvrirAtelier = async (pg, titre) => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1200); await sansVoiles(pg);
  if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(pg, 900); await clicTexte(pg, 'button', '← Mes chapitres'); await p(pg, 900); }
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900);
  const ok = await pg.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c.filter(x => (x.innerText || '').split('\n').some(l => l.trim() === t)).pop() || c[c.length - 1];   /* la carte du chapitre, pas la zone qui les contient toutes (un titre préfixe d'un autre : « … (proposition) ») */ if (!e) return false; Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')).click(); return true; }, titre);
  await p(pg, 1800); await sansVoiles(pg); await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 2500); await compris(pg);
  return ok && pg.evaluate(() => !!(window.S && S.atelier)); };
/* la séance (par sa clé) : le clic sur son titre dans la colonne */
const seanceAtelier = async (pg, cle) => { const ouverte = () => pg.evaluate(c => { const v = document.querySelector('#volet [data-at-di]'); if (String(ATVUES.snum) !== c || !(window.S && S.atelier) || !(v && v.getBoundingClientRect().height > 0)) return false; try { if (typeof dr_cleSeance === 'function' && String(dr_cleSeance(S.si)) !== c) return false; const E = seance().ecrans; return Array.from(document.querySelectorAll('#volet [data-at-di]')).every(d => E.some(e => e && e.eid === d.dataset.eid)); } catch (e) { return false; } }, cle);   /* vraiment ouverte : la clé, la séance du socle, et la colonne qui montre ses diapos */   /* un clic sur le titre d'une séance déjà dépliée la replie : on ne clique que si elle n'est pas ouverte */
  for (let n = 0; n < 3 && !(await ouverte()); n++) { await pg.evaluate(c => { const d = document.querySelector('.ed2-sce[data-seance="' + c + '"]'); if (d) { d.scrollIntoView({ block: 'center' }); d.click(); } }, cle); for (let w = 0; w < 10 && !(await ouverte()); w++) await p(pg, 300); }
  return pg.evaluate(() => (typeof ATVUES !== 'undefined' && ATVUES.snum != null) ? String(ATVUES.snum) : null); };
/* l'état de la séance ouverte : les lignes de la colonne (dans l'ordre affiché) et la trame */
const etat = pg => pg.evaluate(() => { const E = seance().ecrans; return { snum: String(ATVUES.snum), si: S.si, di: S.di, cur: (E[S.di] || {}).eid,
  lignes: Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ eid: d.dataset.eid, t: (() => { const t = d.querySelector('.t'); if (!t) return ''; const c = t.cloneNode(true); c.querySelectorAll('.p85h-pages').forEach(x => x.remove()); return c.textContent; })(), cls: d.className, txt: d.innerText.replace(/\s+/g, ' ').trim(), drag: d.getAttribute('draggable') === 'true' })),
  E: E.map(e => ({ eid: e.eid, act: e.act, role: e.role || null, dur: e.dur, heure: e.heure, hors: !!e.horsActivite, masq: !!e.masquee, actId: e.actId || null, nBlocs: (e.blocs || []).length, blocs: JSON.stringify(e.blocs || []).slice(0, 400) })),
  heures: Array.from(document.querySelectorAll('#volet .dr-fr-l2')).map(x => x.textContent.replace(/\s+/g, ' ').trim()), aRegler: ((document.getElementById('at-regler') || {}).textContent || '').trim(), pile: (typeof DR_PILE !== 'undefined') ? DR_PILE.l.length : null }; });
const ligneDe = (st, titre) => (st.lignes.find(l => l.t.trim() === titre) || {}).eid || null;
const ligneSel = eid => '#volet [data-eid="' + eid + '"]';
const voir = async (pg, eid) => { await pg.evaluate(s => { const d = document.querySelector(s); if (d) d.scrollIntoView({ block: 'center' }); }, ligneSel(eid)); await p(pg, 250); };
const clicLigne = async (pg, eid, mod) => { await voir(pg, eid); await pg.click(ligneSel(eid) + ' .t', mod ? { modifiers: [mod] } : {}); await p(pg, 700); };
/* clic droit sur une ligne : le menu (chaque entrée : son geste, son libellé, grisée ou non, son infobulle) */
const menuDe = async (pg, eid) => { await voir(pg, eid); await pg.click(ligneSel(eid) + ' .t', { button: 'right' }); await p(pg, 400); return pg.evaluate(() => Array.from(document.querySelectorAll('#menu.on [data-a]')).map(b => ({ a: b.dataset.a, l: b.textContent.trim(), off: b.disabled, t: b.getAttribute('title') || '' }))); };
const choisir = async (pg, a) => { const ok = await pg.evaluate(a => { const b = document.querySelector('#menu.on [data-a="' + a + '"]'); if (!b || b.disabled) return false; b.click(); return true; }, a); await p(pg, 900); return ok; };
const fermerMenu = async pg => { await pg.keyboard.press('Escape'); await p(pg, 200); await pg.evaluate(() => { const m = document.getElementById('menu'); if (m) m.classList.remove('on'); }); };
const annuler = async pg => { await pg.mouse.click(5, 300); await pg.evaluate(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p(pg, 1200); await pg.keyboard.press('Control+z'); await p(pg, 1200); };   /* hors d'un champ : le Ctrl + Z de l'Atelier (la rafale de 900 ms close avant) */
const hubDeroule = (pg, titre, cle) => pg.evaluate(({ t, k }) => { const L = window.__hubLire; const ch = L('/site/3e/chapitres') || {}; const c = Object.keys(ch).find(x => ch[x] && ch[x].title === t); if (c == null) return null; const se = (ch[c].seances || {})[k]; const d = (se && se.deroule) || {}; const ecr = Array.isArray(d.ecrans) ? d.ecrans : Object.values(d.ecrans || {}); return { ecrans: ecr.filter(Boolean).map(e => ({ eid: e.eid, act: e.act, dur: e.dur, hors: !!e.horsActivite, masq: !!e.masquee, actId: e.actId || null, role: e.role || null })), retraits: d.retraits || null }; }, { t: titre, k: cle });
const minutesH = st => st.heures.map(x => +((x.match(/^(\d+) min/) || [])[1] || 0));
const lireMur = pg => pg.evaluate(() => { const m = document.getElementById('mur'); if (!m) return null; const c = m.querySelector('.corpsd') || m; const clone = c.cloneNode(true); clone.querySelectorAll('.p8-ecrire, .bloc-barre, .p85h-defile-ind, .page').forEach(x => x.remove()); return { act: ((m.querySelector('.act') || {}).textContent || '').trim(), texte: clone.innerText.replace(/\s+/g, ' ').trim(), lignes: Array.from(c.querySelectorAll('li[data-p]')).map(l => l.textContent.trim()), blocs: c.querySelectorAll('.bloc').length }; });
const bullesOk = items => items.filter(x => x.a !== 'titre' && x.a !== 'note').every(x => x.t && x.t.trim().length > 8 && (!x.off || x.t.trim() !== x.l.trim()));

dire('EX · sonde §12.62 par le geste (A110) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5);
for (const [W, H] of TAILLES) { const T = W + '×' + H; dire(''); dire('══ ' + T + ' ══');
  const o = await ouvrir(W, H); const pg = o.pg;
  try {
    /* ── 0 · l'import : la diapo hors activité à 0 minute passe ── */
    const imp = await importer(pg, CH, 'Remplacer');
    const hub1 = await hubDeroule(pg, TITRE, '1'); const hd = hub1 && hub1.ecrans.find(e => e.act === HORS.act);
    verif('1', imp.bouton === 'Remplacer' && !imp.refus.some(r => /Voyageur|hors activité|durée/.test(r)) && hd && hd.hors && hd.dur === 0 && !hd.actId, T + ' · l’import accepte une diapo « hors activité » à 0 minute (sans activité, sans refus) et la garde telle quelle au hub', JSON.stringify({ voie: imp.bouton, refus: imp.refus.slice(0, 2), auHub: hd }));
    const okA = await ouvrirAtelier(pg, TITRE); await seanceAtelier(pg, '0'); let st = await etat(pg);
    verif('0', okA && st.snum === '0' && st.lignes.length > 10, T + ' · le chapitre au contrat s’ouvre dans l’Atelier, séance 1', st.lignes.length + ' lignes');

    /* ── 3 · les quatre diapos invariables ── */
    const tete = st.lignes.slice(0, 4);
    verif('3', JSON.stringify(tete.map(l => l.eid)) === JSON.stringify(['inv-presentation-chapitre-s0', 'inv-plan-s0', 'inv-presentation-seance-s0', 'inv-problematique-s0']) && tete[0].t === TITRE && tete[1].t === 'Le plan du chapitre' && tete[2].t === CH.chapitre.seances[0].title && tete[3].t === 'Notre question', T + ' · séance 1 : présentation du chapitre, plan, présentation de la séance, problématique — en tête, posées par le site', JSON.stringify(tete.map(l => l.t)));
    const invE = st.E.slice(0, 4); verif('3', invE.every(e => e.dur === 0 && !e.actId) && tete.every(l => /0 min$/.test(l.txt) && !l.drag), T + ' · hors activité, 0 minute, elles ne glissent pas', JSON.stringify(invE.map(e => e.role + ':' + e.dur)));
    await clicLigne(pg, tete[0].eid); const m0 = await lireMur(pg); await capt(pg, W, H, '3-presentation-du-chapitre');
    verif('3', m0.act === TITRE && /Ce que nous travaillons/.test(m0.texte) && m0.lignes.includes('Entrée du programme : Poésie') && m0.lignes.some(l => /^Compétence\(s\) principale\(s\) : Élaborer une interprétation de textes littéraires$/.test(l)) && m0.lignes.some(l => /^Aussi travaillées : /.test(l)), T + ' · la présentation du chapitre, avec les mots de la feuille sommaire (entrée, compétences)', JSON.stringify(m0.lignes.map(l => l.slice(0, 70))));
    await clicLigne(pg, tete[1].eid); const m1 = await lireMur(pg);
    verif('3', m1.act === 'Le plan du chapitre' && m1.lignes.length === CH.chapitre.seances.length && m1.lignes[0].startsWith('1. ' + CH.chapitre.seances[0].title) && m1.lignes[8].startsWith('9. ' + CH.chapitre.seances[8].title), T + ' · le plan : les neuf séances, dans l’ordre', JSON.stringify(m1.lignes.slice(0, 3)));
    await clicLigne(pg, tete[2].eid); const m2 = await lireMur(pg);
    verif('3', m2.act === CH.chapitre.seances[0].title && m2.lignes.some(l => /^Notions rencontrées : /.test(l)) && !m2.lignes.some(l => /litt-\d|c4-|tr-/.test(l)), T + ' · la présentation de la séance : son titre, ses notions (libellé élève), ses compétences — aucun identifiant', JSON.stringify(m2.lignes.map(l => l.slice(0, 80))));
    await clicLigne(pg, tete[3].eid); const m3 = await lireMur(pg); await capt(pg, W, H, '3-problematique');
    verif('3', m3.act === 'Notre question' && m3.lignes.length === 1 && m3.lignes[0] === PROB, T + ' · la problématique : « Notre question », la problématique du chapitre', m3.lignes[0]);
    /* la carte d'une diapo d'ouverture */
    const carteInv = await pg.evaluate(() => { const c = document.querySelector('#droite-atelier .at-declare'); return c ? c.innerText.replace(/\s+/g, ' ').slice(0, 700) : null; });
    verif('3', /posée par le site/.test(carteInv || '') && /Retirer/.test(carteInv || '') && /suit le chapitre/.test(carteInv || ''), T + ' · sa carte dit d’où elle vient et qu’elle se retire', carteInv);

    /* ── 1 · « Ce que la diapo déclare » ── */
    const t1 = ligneDe(st, 'Tableau 1'); await clicLigne(pg, t1);
    const carte = await pg.evaluate(() => { const da = document.getElementById('droite-atelier'); const c = da && da.querySelector('.at-d'); const aide = document.getElementById('at-aide'); if (!c) return null; const r = c.getBoundingClientRect(), rd = da.getBoundingClientRect();
      const champ = id => { const e = document.getElementById(id); if (!e) return null; const s = getComputedStyle(e); const b = ['Top', 'Right', 'Bottom', 'Left'].map(k => parseFloat(s['border' + k + 'Width'])); return { cadre: b.every(x => x >= 1) && s.borderTopStyle !== 'none' && s.borderLeftStyle !== 'none', curseur: s.cursor, visible: e.getBoundingClientRect().width > 20 && e.getBoundingClientRect().bottom <= innerHeight }; };
      return { premiere: c.classList.contains('at-declare') && /CE QUE LA DIAPO DÉCLARE/.test(c.innerText), ouverte: !!c.querySelector('#dc-act'), enHaut: Math.abs(r.top - rd.top) < 30, aideDessous: !aide || !!(c.compareDocumentPosition(aide) & Node.DOCUMENT_POSITION_FOLLOWING), basVisible: r.bottom <= innerHeight + 1, h: Math.round(r.height),
        champs: { act: champ('dc-act'), atitre: champ('dc-atitre'), titre: champ('dc-titre'), dur: champ('dc-dur'), role: champ('dc-role'), leg: champ('dc-leg') } }; });
    await capt(pg, W, H, '1-la-carte-ouverte');
    verif('1', carte && carte.premiere && carte.ouverte && carte.enHaut && carte.aideDessous, T + ' · « Ce que la diapo déclare » ouverte sans clic, seule en haut de la colonne de droite, l’aide dessous', JSON.stringify(carte && { premiere: carte.premiere, ouverte: carte.ouverte, enHaut: carte.enHaut, aideDessous: carte.aideDessous, hauteur: carte.h }));
    const ch = carte ? carte.champs : {}; const tous = Object.keys(ch).every(k => ch[k] && ch[k].cadre);
    verif('1', tous && ['atitre', 'titre', 'leg'].every(k => ch[k].curseur === 'text'), T + ' · chaque champ se voit comme un champ : un cadre (activité, titre de l’activité, titre, durée, rôle, légende) et le curseur de texte', JSON.stringify(ch));
    const aR0 = st.aRegler; await pg.selectOption('#dc-act', ''); await p(pg, 1500); let st1 = await etat(pg); const e1 = st1.E.find(e => e.eid === t1);
    const actsLigne = await pg.evaluate(() => (document.getElementById('droite-atelier') || {}).innerText || '');
    verif('1', e1 && e1.hors && !e1.actId && st1.aRegler === aR0 && !/Tableau 1\s*sans numéro/.test(actsLigne), T + ' · « — hors activité » choisi : la diapo n’a plus d’activité, et « À régler » ne bouge pas (' + aR0 + ' → ' + st1.aRegler + ')', JSON.stringify(e1));
    const rea = await pg.evaluate(() => { const o = document.querySelector('#dc-role option[value="reactivation"]'); return o ? { off: o.disabled, l: o.textContent } : null; });
    verif('1', rea && rea.off && /copie de la classe/.test(rea.l) && /Ouvrir par la réactivation/.test(rea.l), T + ' · « réactivation » reste dans la liste des rôles, grisée, et dit pourquoi et où la choisir', rea && rea.l);
    await pg.selectOption('#dc-act', st.E.find(e => e.eid === t1).actId); await p(pg, 1200);   /* rendue à son activité */

    /* ── 2 · la diapo vierge ── */
    st = await etat(pg); const t2 = ligneDe(st, 'Tableau 2'); const h0 = minutesH(st); const n0 = st.E.length;
    const mA = await menuDe(pg, t2); const itA = mA.find(x => x.a === 'inserer'); await capt(pg, W, H, '2-le-clic-droit');
    verif('4', bullesOk(mA) && ['renommer', 'inserer-avant', 'inserer', 'masquer', 'copier', 'coller'].every(a => mA.some(x => x.a === a)), T + ' · le clic droit d’une diapo : Renommer, Insérer avant, Insérer après, Masquer, Copier, Coller — chaque entrée a son infobulle, chaque entrée grisée dit pourquoi', mA.map(x => x.l + (x.off ? ' (grisé : ' + x.t.slice(0, 50) + ')' : '')).join(' · '));
    await choisir(pg, 'inserer'); st = await etat(pg); const iT2 = st.E.findIndex(e => e.eid === t2); const nv = st.E[iT2 + 1]; const murV = await lireMur(pg); await capt(pg, W, H, '2-la-diapo-vierge');
    verif('2', itA && !itA.off && st.E.length === n0 + 1 && nv && nv.act === '' && nv.nBlocs === 0 && nv.hors && nv.dur === 0 && !nv.actId && nv.heure === st.E[iT2].heure && st.cur === nv.eid, T + ' · « Insérer une diapo après » : une diapo vierge — sans titre, sans bloc, hors activité, 0 minute, dans la même heure, ouverte', JSON.stringify(nv));
    verif('2', murV && murV.act === '' && murV.blocs === 0 && murV.texte === '', T + ' · au mur : aucun texte (plus de « Nouvelle diapo »)', JSON.stringify(murV));
    verif('2', JSON.stringify(minutesH(st)) === JSON.stringify(h0) && st.aRegler === aR0, T + ' · l’heure ne bouge pas (' + h0.join(', ') + ' min) et « À régler » non plus', JSON.stringify({ heures: minutesH(st), aRegler: st.aRegler }));
    const premH2 = await pg.evaluate(() => { const E = seance().ecrans; return E[ordreHeure(2)[0]].eid; }); const mB = await menuDe(pg, premH2); const itB = mB.find(x => x.a === 'inserer-avant'); await choisir(pg, 'inserer-avant'); st = await etat(pg);
    const nvB = await pg.evaluate(() => { const E = seance().ecrans; const e = E[ordreHeure(2)[0]]; return { eid: e.eid, act: e.act, heure: e.heure, dur: e.dur, hors: !!e.horsActivite, cur: E[S.di].eid }; });
    verif('2', itB && !itB.off && nvB.eid !== premH2 && nvB.act === '' && nvB.heure === 2 && nvB.hors && nvB.dur === 0 && nvB.cur === nvB.eid, T + ' · « Insérer une diapo avant » la première diapo de H2 : la diapo vierge devient la première de l’heure', JSON.stringify(nvB));
    await pg.fill('#dc-dur', '4'); await pg.press('#dc-dur', 'Tab'); await p(pg, 1500); st = await etat(pg); const h1 = minutesH(st);
    verif('2', h1[1] === h0[1] + 4 && h1[0] === h0[0], T + ' · une durée donnée (4 min) compte : H2 passe de ' + h0[1] + ' à ' + h1[1] + ' min', JSON.stringify(h1));
    await annuler(pg); st = await etat(pg); const dApres = (st.E.find(e => e.eid === nvB.eid) || {}).dur; await annuler(pg); st = await etat(pg); const parti = !st.E.some(e => e.eid === nvB.eid);
    verif('2', dApres === 0 && parti, T + ' · Ctrl + Z : la durée revient à 0, puis la diapo insérée part', JSON.stringify({ dureeApres1: dApres, partieApres2: parti }));
    const hub0 = await hubDeroule(pg, TITRE, '0'); await p(pg, 2500); const hub0b = await hubDeroule(pg, TITRE, '0');
    verif('3', hub0b && !hub0b.ecrans.some(e => /^inv-/.test(e.eid || '')) && hub0b.ecrans.some(e => e.eid === nv.eid), T + ' · au hub : les diapos d’ouverture intactes ne s’écrivent pas (elles suivent le chapitre) ; la diapo vierge, si', JSON.stringify((hub0b || { ecrans: [] }).ecrans.slice(0, 3)));

    /* ── 4 · renommer ── */
    st = await etat(pg); const t3 = ligneDe(st, 'Tableau 3'); await voir(pg, t3); await pg.dblclick(ligneSel(t3) + ' .t'); await p(pg, 400);
    const ren = await pg.evaluate(s => { const t = document.querySelector(s + ' .t'); const a = document.activeElement; window.__renNoeud = t; return { edit: !!t && t.isContentEditable, focus: a === t, sel: String(getSelection()) }; }, ligneSel(t3));
    await p(pg, 3600); const tient = await pg.evaluate(() => ({ connecte: !!(window.__renNoeud && window.__renNoeud.isConnected), focus: document.activeElement === window.__renNoeud }));
    verif('4', ren.edit && ren.focus && ren.sel === 'Tableau 3' && tient.connecte && tient.focus, T + ' · double-clic : le titre s’écrit à sa place dans la colonne ; 3,6 s plus tard (la relecture du hub est passée), le même champ, toujours là, le curseur dedans', JSON.stringify({ ren, tient }));
    await pg.keyboard.type('Tableau 3 : Turner, la tempête'); await pg.keyboard.press('Enter'); await p(pg, 1000); st = await etat(pg);
    const carteT = await pg.evaluate(() => ((document.getElementById('dc-titre') || {}).textContent || '').trim()); const murT = await lireMur(pg);
    verif('4', (st.E.find(e => e.eid === t3) || {}).act === 'Tableau 3 : Turner, la tempête' && ligneDe(st, 'Tableau 3 : Turner, la tempête') === t3, T + ' · Entrée : renommée, même identité', JSON.stringify(st.E.find(e => e.eid === t3)));
    await clicLigne(pg, t3); const carteT2 = await pg.evaluate(() => ((document.getElementById('dc-titre') || {}).textContent || '').trim()); const murT2 = await lireMur(pg);
    verif('4', carteT2 === 'Tableau 3 : Turner, la tempête' && /Tableau 3 : Turner, la tempête/.test(murT2.act), T + ' · le même titre dans la carte et en haut de la diapo', JSON.stringify({ carte: carteT2, etiquette: murT2.act }));
    await annuler(pg); st = await etat(pg); verif('4', (st.E.find(e => e.eid === t3) || {}).act === 'Tableau 3', T + ' · Ctrl + Z : le titre revient', (st.E.find(e => e.eid === t3) || {}).act);
    const t4 = ligneDe(st, 'Tableau 4'); const mR = await menuDe(pg, t4); await choisir(pg, 'renommer'); await pg.keyboard.type('n’importe quoi'); await pg.keyboard.press('Escape'); await p(pg, 800); st = await etat(pg);
    verif('4', mR.some(x => x.a === 'renommer' && !x.off) && (st.E.find(e => e.eid === t4) || {}).act === 'Tableau 4', T + ' · clic droit → « Renommer », puis Échap : rien ne change', (st.E.find(e => e.eid === t4) || {}).act);

    /* ── 4 · masquer : jamais jouée ── */
    const h2 = minutesH(st); const dur4 = (st.E.find(e => e.eid === t4) || {}).dur; await menuDe(pg, t4); await choisir(pg, 'masquer'); st = await etat(pg); const l4 = st.lignes.find(l => l.eid === t4); await capt(pg, W, H, '4-masquee');
    verif('4', (st.E.find(e => e.eid === t4) || {}).masq && /dr-masq/.test(l4.cls) && /masquée/.test(l4.txt) && minutesH(st)[0] === h2[0] - dur4, T + ' · « Masquer » : la ligne grisée dit « masquée », la diapo reste dans la trame, ses ' + dur4 + ' min ne comptent plus (H1 ' + h2[0] + ' → ' + minutesH(st)[0] + ')', l4 && l4.txt);
    await clicLigne(pg, t3); const rep = await pg.evaluate(() => { const b = document.getElementById('at-jouer'); if (!b) return false; b.click(); return true; }); await p(pg, 2000);
    const vigs = await pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).map(v => seance().ecrans[+v.dataset.i].eid)); const dAv = await pg.evaluate(() => seance().ecrans[S.di].eid);
    await pg.mouse.click(5, 300); await pg.keyboard.press('PageDown'); await p(pg, 900); const dAp = await pg.evaluate(() => seance().ecrans[S.di].eid); const t5 = ligneDe(st, 'Tableau 5');
    verif('4', rep && vigs.length > 5 && !vigs.includes(t4) && dAv === t3 && dAp === t5, T + ' · en répétition (« ▶ Jouer en avance ») : la diapo masquée n’est pas dans la colonne, et la suivante de « Tableau 3 » est « Tableau 5 » — elle n’est jamais jouée', JSON.stringify({ vignettes: vigs.length, masqueeDedans: vigs.includes(t4), apres: dAp === t5 ? 'Tableau 5' : dAp }));
    await pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b) b.click(); }); await p(pg, 1500);
    st = await etat(pg); await menuDe(pg, t4); await choisir(pg, 'masquer'); st = await etat(pg); verif('4', !(st.E.find(e => e.eid === t4) || {}).masq && JSON.stringify(minutesH(st)) === JSON.stringify(h2), T + ' · « Ne plus masquer » : elle revient, ses minutes comptent', JSON.stringify(minutesH(st)));

    /* ── 4 · glisser-déposer ── */
    st = await etat(pg); const ord = () => etat(pg).then(s => s.lignes.map(l => l.eid)); let o0 = await ord(); const t1b = ligneDe(st, 'Tableau 1'); const t5b = ligneDe(st, 'Tableau 5');
    await voir(pg, t1b); await pg.locator(ligneSel(t5b)).dragTo(pg.locator(ligneSel(t1b)), { targetPosition: { x: 30, y: 2 } }); await p(pg, 1200); let o1 = await ord();
    verif('4', o1.indexOf(t5b) === o1.indexOf(t1b) - 1 && o1.length === o0.length, T + ' · glisser « Tableau 5 » sur le haut de « Tableau 1 » : elle passe juste avant, même identité', JSON.stringify(o1.slice(4, 11).map(e => (st.E.find(x => x.eid === e) || {}).act)));
    await annuler(pg); o1 = await ord(); verif('4', JSON.stringify(o1) === JSON.stringify(o0), T + ' · Ctrl + Z : l’ordre revient');
    const inv4 = 'inv-problematique-s0'; await voir(pg, inv4); await pg.locator(ligneSel(t1b)).dragTo(pg.locator(ligneSel(inv4)), { targetPosition: { x: 30, y: 2 } }); await p(pg, 900); const dit = await compris(pg); o1 = await ord();
    verif('4', JSON.stringify(o1) === JSON.stringify(o0) && /tête de la séance/.test(dit || ''), T + ' · glissée devant une diapo d’ouverture : refusé, le site dit pourquoi', dit);

    /* ── 4 · plusieurs diapos ── */
    await clicLigne(pg, t1b); const t2b = ligneDe(st, 'Tableau 2'), t3b = ligneDe(st, 'Tableau 3'); await clicLigne(pg, t3b, 'Shift'); let s3 = await pg.evaluate(() => dr_colSel());
    await clicLigne(pg, t2b, 'Control'); let s2 = await pg.evaluate(() => dr_colSel()); st = await etat(pg); const marques = st.lignes.filter(l => /dr-sel-d/.test(l.cls)).map(l => l.eid);
    verif('4', s3.length >= 3 && [t1b, t2b, t3b].every(x => s3.includes(x)) && s2.length === s3.length - 1 && !s2.includes(t2b) && JSON.stringify(marques.sort()) === JSON.stringify(s2.slice().sort()), T + ' · Maj + clic : de « Tableau 1 » à « Tableau 3 » ; Ctrl + clic retire « Tableau 2 » ; les lignes choisies se voient', JSON.stringify({ maj: s3.length, ctrl: s2.length }));
    const mL = await menuDe(pg, t3b); await capt(pg, W, H, '4-plusieurs-diapos');
    verif('4', bullesOk(mL) && ['l-supprimer', 'l-envoyer', 'l-copier', 'l-masquer'].every(a => mL.some(x => x.a === a && !x.off)) && mL.some(x => x.l === 'Supprimer les ' + s2.length), T + ' · le clic droit sur la sélection (' + s2.length + ' diapos : « Tableau 1 », la diapo vierge, « Tableau 3 ») : Supprimer, Envoyer, Copier, Masquer les ' + s2.length + ' — avec leurs infobulles', mL.map(x => x.l).join(' · '));
    await choisir(pg, 'l-supprimer'); const conf = await modaleBouton(pg, new RegExp('^Supprimer les ' + s2.length + ' diapos$')); await p(pg, 1000); st = await etat(pg);
    verif('4', conf && !st.E.some(e => e.eid === t1b || e.eid === t3b) && st.E.some(e => e.eid === t2b), T + ' · « Supprimer les ' + s2.length + ' » (confirmé) : elles partent, « Tableau 2 » reste', conf);
    await annuler(pg); st = await etat(pg); verif('4', st.E.some(e => e.eid === t1b) && st.E.some(e => e.eid === t3b), T + ' · Ctrl + Z : les deux reviennent, mêmes identités');
    o0 = await ord(); await clicLigne(pg, t1b); await clicLigne(pg, t2b, 'Control'); const hyp = ligneDe(st, 'Les hypothèses de la classe'); await voir(pg, hyp);
    await pg.locator(ligneSel(t2b)).dragTo(pg.locator(ligneSel(hyp)), { targetPosition: { x: 30, y: 14 } }); await p(pg, 1200); o1 = await ord();
    verif('4', o1.indexOf(t1b) === o1.indexOf(hyp) + 1 && o1.indexOf(t2b) === o1.indexOf(hyp) + 2, T + ' · les deux choisies glissées après « Les hypothèses de la classe » : elles suivent, dans l’ordre', JSON.stringify(o1.slice(4, 12).map(e => (st.E.find(x => x.eid === e) || {}).act)));
    await annuler(pg); o1 = await ord(); verif('4', JSON.stringify(o1) === JSON.stringify(o0), T + ' · Ctrl + Z : l’ordre revient');
    /* envoyer la sélection vers la séance 3 (« Interro de cours… ») */
    await clicLigne(pg, t1b); await clicLigne(pg, t2b, 'Control'); await menuDe(pg, t2b); await choisir(pg, 'l-envoyer'); await p(pg, 600);
    const vers = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('.choix-obj [data-si]')).find(x => +x.dataset.si === 2 && +x.dataset.h === 1); if (!b) return null; b.click(); return b.textContent.trim().slice(0, 60); }); await p(pg, 1500); st = await etat(pg);
    await seanceAtelier(pg, '2'); const st2 = await etat(pg);
    verif('4', vers && !st.E.some(e => e.eid === t1b || e.eid === t2b) && st2.E.some(e => e.eid === t1b) && st2.E.some(e => e.eid === t2b), T + ' · « Envoyer les 2 vers une autre séance… » : elles quittent la séance 1 et arrivent dans la séance 3, identités inchangées', vers);

    /* ── 4 · copier / coller ── */
    await seanceAtelier(pg, '0'); st = await etat(pg); const t3c = ligneDe(st, 'Tableau 3'); await menuDe(pg, t3c); await choisir(pg, 'copier');
    await seanceAtelier(pg, '2'); let sc = await etat(pg); const cible = sc.E.find(e => !e.role && e.act && !/^Tableau/.test(e.act)); const n2 = sc.E.length;
    const mC = await menuDe(pg, cible.eid); const itC = mC.find(x => x.a === 'coller'); await choisir(pg, 'coller'); sc = await etat(pg); const iC = sc.E.findIndex(e => e.eid === cible.eid); const colle = sc.E[iC + 1];
    const src = st.E.find(e => e.eid === t3c);
    const memeBlocs = (a, b) => { try { const x = JSON.parse(a), y = JSON.parse(b); return x.length === y.length && x.every((k, i) => k.t === y[i].t && (k.ref || '') === (y[i].ref || '') && k.id !== y[i].id); } catch (e) { return false; } };
    verif('4', itC && !itC.off && sc.E.length === n2 + 1 && colle && colle.act === 'Tableau 3' && colle.eid !== t3c && memeBlocs(colle.blocs, src.blocs), T + ' · « Copier » dans la séance 1, « Coller après » dans la séance 3 : la diapo arrive juste après, nouvelle identité (ses blocs aussi), mêmes blocs', JSON.stringify({ colle: colle && { eid: colle.eid, act: colle.act, actId: colle.actId }, cible: cible.act }));
    await annuler(pg); sc = await etat(pg); verif('4', !sc.E.some(e => e.eid === colle.eid), T + ' · Ctrl + Z : la diapo collée part');   /* la pile d'annulation est celle de la séance ouverte (dr-recyclage) */
    await seanceAtelier(pg, '0'); st = await etat(pg); verif('4', st.E.some(e => e.eid === t3c), T + ' · « Tableau 3 » reste dans la séance 1 (copier ne la retire pas)');
    /* un autre chapitre : le double du chapitre (« Créer un double »), puis « Coller après » dans sa séance 1 */
    const imp2 = await importer(pg, CH, 'Créer un double'); const titreB = await pg.evaluate(t => { const ch = window.__hubLire('/site/3e/chapitres') || {}; return Object.values(ch).map(c => c && c.title).filter(x => x && x !== t)[0] || null; }, TITRE);
    const okB0 = titreB && await ouvrirAtelier(pg, titreB); const okB = okB0 && await pg.evaluate(t => { const ch = window.__hubLire('/site/3e/chapitres') || {}; const k = Object.keys(ch).find(x => ch[x] && ch[x].title === t); return k != null && String(AT.edChap.chnum) === k; }, titreB); await seanceAtelier(pg, '0');   /* c'est bien le double qui est ouvert */ let sb = await etat(pg); const cibleB = sb.E.find(e => e.act === 'Analyse d\'images : la routine'); const nB = sb.E.length;
    await menuDe(pg, cibleB.eid); await choisir(pg, 'coller'); sb = await etat(pg); const iB = sb.E.findIndex(e => e.eid === cibleB.eid); await capt(pg, W, H, '4-colle-dans-un-autre-chapitre');
    verif('4', okB && sb.E.length === nB + 1 && sb.E[iB + 1].act === 'Tableau 3' && sb.E[iB + 1].eid !== t3c, T + ' · dans un autre chapitre (« ' + titreB + ' », créé par « Créer un double ») : « Coller après » pose la diapo copiée', JSON.stringify({ voie: imp2.bouton, colle: sb.E[iB + 1] && sb.E[iB + 1].act }));
    await p(pg, 2500); const hubB = await hubDeroule(pg, titreB, '0'); verif('4', hubB && hubB.ecrans.some(e => e.eid === sb.E[iB + 1].eid), T + ' · enregistrée au hub dans le chapitre d’arrivée');

    /* ── 3 · retirer une diapo d'ouverture, retenu ── */
    await ouvrirAtelier(pg, TITRE); await seanceAtelier(pg, '1'); let s1 = await etat(pg);
    verif('3', JSON.stringify(s1.lignes.slice(0, 2).map(l => l.eid)) === JSON.stringify(['inv-presentation-seance-s1', 'inv-problematique-s1']) && s1.lignes[0].t === CH.chapitre.seances[1].title && !s1.lignes.some(l => /presentation-chapitre|inv-plan/.test(l.eid)) && s1.lignes[2].t === HORS.act, T + ' · séance 2 : présentation de la séance, problématique (pas de présentation du chapitre ni de plan), puis la diapo hors activité de Paul', JSON.stringify(s1.lignes.slice(0, 3).map(l => l.t)));
    const lHors = s1.lignes[2]; await clicLigne(pg, lHors.eid); const reg = await pg.evaluate(() => { try { return alertesChapitre().filter(a => /Voyageur/.test(a.ou || '') || /Voyageur/.test(a.l || '')).map(a => a.l); } catch (e) { return ['?']; } });
    verif('1', /0 min$/.test(lHors.txt) && !reg.length, T + ' · la diapo hors activité importée : 0 min, aucune ligne dans « À régler »', JSON.stringify(reg));
    const mI = await menuDe(pg, 'inv-problematique-s1'); const itI = mI.find(x => x.a === 'supprimer'); await choisir(pg, 'supprimer'); const confI = await modaleBouton(pg, /^Retirer$/); await p(pg, 3200); s1 = await etat(pg); let hub2 = await hubDeroule(pg, TITRE, '1');
    verif('3', itI && itI.l === 'Retirer' && !itI.off && /ne la remettra pas/.test(itI.t) && confI && !s1.E.some(e => e.eid === 'inv-problematique-s1') && hub2 && JSON.stringify(hub2.retraits) === '["problematique"]', T + ' · clic droit → « Retirer » la problématique de la séance 2 : partie, retenue au hub (deroule/retraits)', JSON.stringify({ menu: itI && itI.t, retraits: hub2 && hub2.retraits }));
    await annuler(pg); await p(pg, 2500); s1 = await etat(pg); hub2 = await hubDeroule(pg, TITRE, '1');
    verif('3', s1.lignes[1] && s1.lignes[1].eid === 'inv-problematique-s1' && hub2 && !hub2.retraits && !hub2.ecrans.some(e => /^inv-/.test(e.eid || '')), T + ' · Ctrl + Z : elle revient, à sa place ; plus rien de retiré au hub (et toujours rien d’écrit pour elle)', JSON.stringify({ retraits: hub2 && hub2.retraits }));
    await menuDe(pg, 'inv-problematique-s1'); await choisir(pg, 'supprimer'); await modaleBouton(pg, /^Retirer$/); await p(pg, 3200);
    await entrer(pg); await ouvrirAtelier(pg, TITRE); await seanceAtelier(pg, '1'); s1 = await etat(pg); await seanceAtelier(pg, '0'); const s0 = await etat(pg); await capt(pg, W, H, '3-apres-rechargement');
    verif('3', !s1.lignes.some(l => l.eid === 'inv-problematique-s1') && s1.lignes[0].eid === 'inv-presentation-seance-s1' && s0.lignes.slice(0, 4).every(l => /^inv-/.test(l.eid)), T + ' · après rechargement : la problématique de la séance 2 reste retirée ; la séance 1 garde ses quatre', JSON.stringify(s1.lignes.slice(0, 2).map(l => l.t)));

    /* ── 1 · la carte repliée, puis rouverte ── */
    await clicLigne(pg, ligneDe(s0, 'Tableau 3')); await pg.click('[data-declare="replier"]'); await p(pg, 600); const rep1 = await pg.evaluate(() => !document.getElementById('dc-act') && !!document.querySelector('[data-declare="ouvrir"]'));
    await pg.click('[data-declare="ouvrir"]'); await p(pg, 600); const rep2 = await pg.evaluate(() => !!document.getElementById('dc-act'));
    verif('1', rep1 && rep2, T + ' · « replier » la referme en quatre lignes, « ouvrir » la rouvre');
  } catch (e) { verif('Z', false, T + ' · la sonde n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
  verif('Z', !o.errs.length, T + ' · 0 erreur JS', o.errs.slice(0, 3).join(' ; ')); verif('Z', !o.boites.length, T + ' · aucune boîte système', o.boites.slice(0, 3).join(' ; ')); await o.ctx.close(); }
await nav.close();
dire(''); dire('BILAN : ' + (nb - echecs) + '/' + nb + ' ok' + (echecs ? ' · ' + echecs + ' ÉCHEC(S)' : '') + ' · ' + (echecs ? 'ROUGE' : 'VERT'));
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
