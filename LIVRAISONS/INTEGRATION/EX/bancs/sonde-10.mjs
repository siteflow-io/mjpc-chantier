// EX · LA SONDE DE LA ⑩ PAR LE GESTE — ce que Paul joue lundi (contrat §12.74, §12.70, §12.71, §12.68 ; registre 13 · 92, 93, 94).
// Deux navigateurs sur le même faux hub : le PILOTE (le site) et le TABLEAU DISTANT (`?vue=tableau`, l'ordinateur du vidéoprojecteur), qui ÉCOUTE
// le hub par le flux (EventSource, simulé ici comme Firebase le fait : à chaque écriture, la valeur sous le chemin écouté repart). Le faux hub
// se comporte comme Firebase pour ce qui compte ici : une liste vide, un objet vide, une valeur nulle ne sont pas gardés.
// La montre part du lundi 14/09 à 09:00 et AVANCE (le minuteur compte) ; la case 3E Charles de Gaulle, 08:57-09:52.
// A · MODE TEST (la pastille du panneau prof) :
//   A1 la répétition (« ▶ Jouer en avance ») : l'étiquette d'activité se corrige en direct au pilote, et le tableau distant la montre corrigée ;
//   A2 l'heure lancée par la case : une feuille du site (« Documents de la séance » → « Projeter au tableau ») paraît au tableau distant ;
//   A3 l'étiquette porte « Activité n — » au tableau distant, fond plein, gras, au-dessus de l'image ;
//   A4 le minuteur : « au tableau » coché → la durée paraît, immobile, avant « Départ » ; il court ; jaune au premier tiers ; ⏸ Pause → les
//      chiffres s'arrêtent ; ▶ Reprendre ; rouge clignotant sur le dernier dixième ; cinq bips et un ding au pilote ; le retard pilote → tableau
//      distant mesuré à chaque geste (sous 0,5 s) et l'écart des deux comptes ;
//   A5 « 👥 » à 0 élève : « 0 élève sur N » au tableau distant ;
//   A6 « Annuler cette heure » : rien au hub hors de /site/tableau_test, l'image du mode test retirée, le tableau distant à l'horloge.
// B · HEURE RÉELLE (le faux hub reçoit tout) : la feuille, l'étiquette, le minuteur (retards), la participation à 0, puis « Annuler cette heure » :
//   le faux hub est, à l'octet près, celui d'avant le lancement (hors l'état de la clé USB du tableau, §12.44) ; le tableau distant à l'horloge.
// usage : node sonde-10.mjs <assemble/index.html> [sortie.txt]   (MJPC_CAPT=<dossier> : captures). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-10.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..', '..');
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const p = (pg, ms) => pg.waitForTimeout(ms);
const dort = ms => new Promise(r => setTimeout(r, ms));
const attendre = async (pg, f, max = 10000, pas = 200) => { const t0 = Date.now(); let v; while (Date.now() - t0 < max) { v = await f(); if (v) return v; await dort(pas); } return v; };

/* ── le faux hub : les données de sonde-1262, plus une feuille du site réelle (PONT/RENAISSANCE, la fiche méthode de Paul) liée à chaque séance du chapitre ── */
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const HUBN = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const FEUILLE = 'feuille_methode_paragraphe', ITEM = 'feuille-paragraphe';
const feuille = JSON.parse(fs.readFileSync(path.join(RACINE, 'PONT', 'RENAISSANCE', 'fiche-methode-paragraphe.json'), 'utf8'));
HUBN.site.atelier = { documents: { [FEUILLE]: Object.assign({}, feuille, { dates: { creeLe: 1757600000000, modifieLe: 1757600000000 } }) } };
const TITRE_F = feuille.titre;
(HUBN.site['3e'].chapitres[0].seances || []).forEach(s => { if (s && s.items) s.items[ITEM] = { title: TITRE_F, source: 'atelier', ref: FEUILLE, kind: 'atelier', ordre: 0, published: false };
  /* les activités déclarées, comme dans le chapitre réel de Paul (« Activité n — titre ») : trois diapos par activité, le titre de la première */
  const E = s && s.deroule && Array.isArray(s.deroule.ecrans) ? s.deroule.ecrans : null; if (!E) return; const acts = []; let n = 0;
  E.forEach(e => { if (!e || e.role) return; if (n % 3 === 0) acts.push({ id: 'act' + (acts.length + 1), num: acts.length + 1, titre: e.act || '' }); e.actId = acts[acts.length - 1].id; n++; }); s.deroule.activites = acts; });
/* Firebase ne garde ni null, ni liste vide, ni objet vide */
const fbNorm = v => { if (v === null || v === undefined) return null; if (Array.isArray(v)) { const a = v.map(fbNorm); return a.every(x => x === null) ? null : a; }
  if (typeof v === 'object') { const o = {}; Object.keys(v).forEach(k => { const x = fbNorm(v[k]); if (x !== null) o[k] = x; }); return Object.keys(o).length ? o : null; } return v; };
const ECR = [];   // { qui, m, c } : chaque écriture arrivée au hub
const lire = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const pos = (c, v) => { const q = c.split('/').filter(Boolean); if (!q.length) return; let n = HUBN; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } v = fbNorm(v); if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
let TAB_PG = null; const NOTIF = [];
const hubRepondre = (qui, m, c, corps) => { if (m === 'GET') return JSON.stringify(fbNorm(lire(c))); let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {} ECR.push({ qui, m, c, t: Date.now() });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd);
  if (TAB_PG) TAB_PG.evaluate(ch => { try { window.__fluxNotifier && window.__fluxNotifier(ch); } catch (e) {} }, c).catch(() => {});   /* le flux : la valeur écoutée repart */
  return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => new Response(t, { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); };
  /* le flux REST de Firebase (EventSource) : à l'ouverture, `put` du chemin entier ; à chaque écriture dessous ou dessus, de nouveau */
  window.__flux = []; window.__fluxN = 0;
  window.EventSource = function (url) { const es = this; const s2 = String(url); es.url = s2; es.readyState = 0; es._l = {}; es.onerror = null;
    es.chemin = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''));
    es.addEventListener = (t, f) => { (es._l[t] = es._l[t] || []).push(f); }; es.close = () => { es.readyState = 2; const i = window.__flux.indexOf(es); if (i >= 0) window.__flux.splice(i, 1); };
    es._envoyer = () => window.__hubN('GET', es.chemin, null).then(t => { if (es.readyState === 2) return; es.readyState = 1; window.__fluxN++; const ev = { data: JSON.stringify({ path: '/', data: JSON.parse(t) }) }; (es._l.put || []).forEach(f => f(ev)); });
    window.__flux.push(es); setTimeout(es._envoyer, 0); };
  window.EventSource.CLOSED = 2;
  window.__fluxNotifier = ch => { (window.__flux || []).forEach(es => { const e = es.chemin; if (ch === e || ch.indexOf(e + '/') === 0 || e.indexOf(ch + '/') === 0 || ch === '/') es._envoyer(); }); }; };

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
const ouvrir = async (qui, W, H, q) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); });
  await pg.clock.install({ time: HORLOGE });   /* la montre avance (le minuteur compte) */
  await pg.goto(URL0 + q, { waitUntil: 'load' }); return { ctx, pg, errs, boites }; };
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const gardes = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (m && m.getBoundingClientRect().height > 0) m.querySelectorAll('button').forEach(x => { if (/^(Compris|OK)$/.test(x.textContent.trim())) x.click(); }); const g = document.getElementById('garde'); if (g && g.classList.contains('on')) { const d = document.getElementById('garde-devant'); if (d) d.click(); } }).catch(() => {});
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const horsTest = k => ECR.slice(k).filter(e => e.qui === 'pilote' && !/^\/site\/tableau_test(\/|$)/.test(e.c)).map(e => e.m + ' ' + e.c);
const sansCle = o => { const x = JSON.parse(JSON.stringify(o)); if (x.site) delete x.site.cle_vue; delete x.presence; return JSON.stringify(fbNorm(x)); };   /* le tableau distant n'écrit que l'état de sa clé USB (§12.44) ; `/presence/<prof>` est le battement du site (toutes les pages du prof, heure ou pas), pas l'heure */
const diffChemins = (a, b, pre = '') => { const o = []; if (JSON.stringify(a) === JSON.stringify(b)) return o; if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return [pre || '/'];
  new Set(Object.keys(a).concat(Object.keys(b))).forEach(k => o.push(...diffChemins(a[k], b[k], pre + '/' + k))); return o; };

dire('sonde ⑩ · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5 + ' · la montre part de 09:00 (lundi 14/09), la case des De Gaulle 08:57-09:52 · la feuille « ' + TITRE_F + ' » liée aux séances');

/* ── le tableau distant ── */
const T = await ouvrir('tableau', 1280, 720, '?vue=tableau'); const tb = T.pg; TAB_PG = tb; await p(tb, 2000);
const tabEtat = () => tb.evaluate(() => { const m = (typeof DR_TAB !== 'undefined' && DR_TAB.montre) || null; const a = document.getElementById('ses-tab-att'); const act = document.querySelector('#mur2 .act'); const mi = document.getElementById('dr-tab-minut');
  const f = document.querySelector('#mur2 iframe.dr-doc-feuille'); let ft = null; try { ft = f && f.contentDocument ? (f.contentDocument.body.innerText || '').replace(/\s+/g, ' ') : null; } catch (e) {}
  const q = document.querySelector('#mur2 .quiw .quit'); const cs = act ? getComputedStyle(act) : null;
  return { eid: m && m.eid, nDev: m && m.nDev, doc: !!(m && m.doc), att: !!(a && a.style.display !== 'none'), act: act ? act.textContent.trim() : null, actFond: cs ? cs.backgroundColor : null, actGras: cs ? +cs.fontWeight : null, actZ: cs ? cs.zIndex : null,
    minut: mi && mi.style.display !== 'none' ? { t: mi.textContent, c: mi.className } : null, feuille: f ? { titre: f.title, texte: ft } : null, qui: q ? q.textContent.trim() : null, flux: (window.__flux || []).map(e => e.chemin), fluxN: window.__fluxN || 0, sonde: !!(DR_TAB && DR_TAB.sondeT) }; });
const surTableau = async (cond, max = 3000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await tb.evaluate(cond).catch(() => false)) return Date.now() - t0; await dort(10); } return null; };
const RETARDS = [];
/* un geste au pilote, puis le temps jusqu'à ce que le tableau distant le montre (le clic compris) */
const mesurer = async (nom, geste, cond, max = 3000) => { const t0 = Date.now(); await geste(); let ms = null; while (Date.now() - t0 < max) { if (await tb.evaluate(cond).catch(() => false)) { ms = Date.now() - t0; break; } await dort(10); } RETARDS.push({ nom, ms }); return ms; };

/* ── le pilote ── */
let P = null, pg = null;
const entrer = async (test) => { P = await ouvrir('pilote', 1707, 860, '?n=3e'); pg = P.pg; await p(pg, 1800);
  await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg);
  if (test) { await pg.evaluate(() => { try { openProfPanel(); } catch (e) {} }); await p(pg, 800); await pg.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (b) b.click(); }); await p(pg, 800); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await sansVoiles(pg); }
  return pg.evaluate(() => typeof m8TestOn === 'function' && m8TestOn()); };
const ouvrirAtelier = async titre => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1200); await sansVoiles(pg);
  if (await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await pg.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(pg, 900); await clicTexte(pg, 'button', '← Mes chapitres'); await p(pg, 900); }
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900);
  const ok = await pg.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c.filter(x => (x.innerText || '').split('\n').some(l => l.trim() === t)).pop() || c[c.length - 1]; if (!e) return false; Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')).click(); return true; }, titre);
  await p(pg, 1800); await sansVoiles(pg); await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 2500); await gardes(pg);
  return ok && pg.evaluate(() => !!(window.S && S.atelier)); };
const lancerCase = async () => { await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 1800); await sansVoiles(pg);
  const k = ECR.length; const avant = JSON.parse(JSON.stringify(HUBN));
  const caseOk = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (!c) return false; c.click(); return true; }); await p(pg, 800);
  const ok = caseOk && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(pg, 3500); await gardes(pg); await p(pg, 500);
  const l = await pg.evaluate(() => ({ lancee: !!(S.lancee && !S.close), cours: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeNom : null, C: DR_CL.ouverte && DR_CL.ouverte.C, H: DR_CL.ouverte && DR_CL.ouverte.H }));
  return Object.assign(l, { ok, k, avant }); };
const pilMur = () => pg.evaluate(() => ({ eid: S.mur && S.mur.eid, nDev: S.mur && S.mur.nDev, etiq: S.mur ? dr_etiquetteDe(S.mur) : null, num: (() => { try { return numDe(ecran()); } catch (e) { return null; } })() }));
const suit = async () => { const a = await pilMur(); const b = await attendre(tb, async () => { const t = await tabEtat(); return (t.eid === a.eid && t.nDev === a.nDev && !t.att) ? t : null; }, 9000, 150); return { a, b: b || await tabEtat() }; };
const bdev = async () => { await pg.evaluate(() => document.getElementById('bdev').click()); await p(pg, 250); await gardes(pg); };

/* la feuille du site, par « ⋯ » → « Documents de la séance… » → « Projeter au tableau » ; le tableau distant la rend */
const feuilleAuTableau = async (K) => {
  await pg.click('#bplus'); await p(pg, 300); const menu = await pg.evaluate(() => { const b = document.querySelector('#menuplus [data-a="docs"]'); if (!b) return false; b.click(); return true; }); await p(pg, 600);
  const pan = await pg.evaluate(it => { const b = document.querySelector('#fdocs-l [data-doc="' + it + '"]'); const l = b && b.closest('.dr-c'); return b ? { dis: b.disabled, t: b.textContent.trim(), title: b.title, ligne: l ? l.innerText.replace(/\s+/g, ' ') : '' } : null; }, ITEM);
  verif(K, menu && pan && !pan.dis && pan.t === 'Projeter au tableau' && /feuille du site/.test(pan.ligne), '« Documents de la séance » : la feuille du site se projette (plus de « n’a pas d’adresse », bouton actif)', pan ? '« ' + pan.ligne + ' » · ' + pan.title : 'pas de ligne pour la feuille');
  const ms = await mesurer('feuille', () => pg.click('#fdocs-l [data-doc="' + ITEM + '"]'), () => { const f = document.querySelector('#mur2 iframe.dr-doc-feuille'); try { return !!(f && f.contentDocument && /citation-justification/.test(f.contentDocument.body.innerText || '')); } catch (e) { return false; } }, 6000);
  const t = await tabEtat(); const pil = await pg.evaluate(() => { const f = document.querySelector('#mur iframe.dr-doc-feuille'); let x = null; try { x = f && f.contentDocument ? (f.contentDocument.body.innerText || '').replace(/\s+/g, ' ') : null; } catch (e) {} return { doc: !!(S.doc && S.doc.feuille), texte: x }; });
  verif(K, ms != null && t.feuille && /citation-justification/.test(t.feuille.texte || '') && pil.doc && /citation-justification/.test(pil.texte || ''), 'la feuille du site paraît au tableau distant, rendue comme dans Structure (en ' + ms + ' ms), et au pilote', t.feuille ? '« ' + (t.feuille.texte || '').replace(/^.*?(Fiche méthode)/, '$1').slice(0, 90) + '… »' : 'rien au tableau distant');
  await capt(tb, K + '-feuille-tableau');
  await pg.click('#fdocs-l [data-doc="' + ITEM + '"]'); await p(pg, 300); await pg.evaluate(() => { const x = document.getElementById('fdocs-x'); if (x) x.click(); const f = document.getElementById('fdocs'); if (f) f.classList.remove('on'); });
  const ferme = await surTableau(() => !document.querySelector('#mur2 iframe.dr-doc-feuille'), 4000);
  verif(K, ferme != null, '« ✕ Fermer » : le tableau distant revient à la diapo', ferme + ' ms');
};
/* l'étiquette : ▶ jusqu'à une diapo d'activité ; le tableau distant porte « Activité n — titre », fond plein, gras, au-dessus de l'image */
const etiquetteAuTableau = async (K) => {
  let a = await pilMur(); for (let n = 0; n < 40 && !(a.num > 0); n++) { await bdev(); a = await pilMur(); }
  const s = await suit(); const t = s.b;
  verif(K, a.num > 0 && /^Activité \d+ — \S/.test(t.act || '') && t.act === s.a.etiq, 'au tableau distant, l’étiquette porte « Activité n — » et le titre, celle du pilote', 'tableau « ' + t.act + ' » · pilote « ' + s.a.etiq + ' »');
  verif(K, t.actFond && !/rgba\(0, 0, 0, 0\)|transparent/.test(t.actFond) && t.actGras >= 700 && +t.actZ >= 8, 'fond plein, texte gras, au-dessus de tout autre élément', JSON.stringify({ fond: t.actFond, gras: t.actGras, z: t.actZ }));
  const role = await pg.evaluate(() => { const h = ((document.getElementById('numero') || {}).textContent || '') + ' ' + ((document.getElementById('dtitre') || {}).textContent || ''); return /problematique|presentation-|reactivation\b/.test(h) ? h : ''; });
  verif(K, !role, 'l’en-tête du pilote ne montre aucun nom interne de rôle', role);
};
/* le minuteur : retard de chaque geste, l'écart des deux comptes */
const ecart = async () => { let m = 0; for (let i = 0; i < 5; i++) { const [a, b] = await Promise.all([pg.evaluate(() => dr_minutReste()), tb.evaluate(() => dr_tabMinutReste())]); m = Math.max(m, Math.abs(a - b)); await dort(120); } return m; };
const minuteurBase = async (K, duree) => {
  await pg.click('#bchrono'); await p(pg, 300);
  const pan = await pg.evaluate(() => { const p2 = document.getElementById('dr-minut-p'); const ids = ['dr-minut-in', 'dr-minut-go', 'dr-minut-pause', 'dr-minut-tab', 'dr-minut-stop']; return { ouvert: !!(p2 && p2.style.display !== 'none'), titres: ids.every(i => { const e = document.getElementById(i); const l = e && (e.title || (e.closest('label') || {}).title); return !!l; }), haut: !!document.getElementById('dr-minut-b'), bchrono: (document.getElementById('bchrono') || {}).title || '' }; });
  verif(K, pan.ouvert && pan.titres && !pan.haut && /minuteur/i.test(pan.bchrono), 'le ⏱ sous la diapo ouvre LE minuteur (durée, Départ, Pause, au tableau, ■), chaque geste avec son infobulle ; plus de ⏱ dans l’en-tête', JSON.stringify(pan));
  await pg.fill('#dr-minut-in', duree);
  const t0 = await tabEtat(); const avantRien = !t0.minut;
  const ms1 = await mesurer('au tableau', () => pg.click('#dr-minut-tab'), () => { const m = document.getElementById('dr-tab-minut'); return !!(m && m.style.display !== 'none' && m.textContent === '00:' + document.documentElement.dataset.x); }, 3000).catch(() => null);
  return { avantRien, ms1 };
};

/* ════════════════ A · MODE TEST ════════════════ */
dire(''); dire('A · le mode test (la pastille du panneau prof) : rien n’est écrit pour la classe ; l’image du tableau part à /site/tableau_test');
const testOn = await entrer(true); verif('A', testOn, 'le mode test est posé par la pastille du panneau prof');
const titreCh = HUBN.site['3e'].chapitres[0].title;
/* A1 · la répétition : l'étiquette se corrige en direct */
dire(''); dire('A1 — la répétition (« ▶ Jouer en avance ») : l’étiquette d’activité se corrige en direct');
const atOk = await ouvrirAtelier(titreCh);
if (atOk) {
  await pg.evaluate(() => { const b = document.getElementById('at-jouer'); if (b) b.click(); }); await p(pg, 1500);
  /* la première diapo d'activité, par sa vignette (la répétition part de la diapo ouverte dans l'Atelier) */
  const kAct = await pg.evaluate(() => seance().ecrans.findIndex(e => numDe(e) > 0)); await pg.click('#volet .vig[data-i="' + kAct + '"]').catch(() => {}); await p(pg, 600); await gardes(pg);
  let a = await pilMur(); for (let n = 0; n < 40 && !(a.num > 0); n++) { await bdev(); a = await pilMur(); }
  const r1 = await attendre(tb, async () => { const t = await tabEtat(); return (t.eid === a.eid && !t.att && t.act) ? t : null; }, 12000, 200);
  verif('A1', a.num > 0 && r1 && r1.act === a.etiq, 'en répétition, le tableau distant (mode test) montre la diapo et son étiquette entière', r1 ? '« ' + r1.act + ' »' : 'rien au tableau distant');
  const ed = await pg.evaluate(() => { const e = document.querySelector('#mur .act [data-p="-1.act"]'); if (!e) return null; e.click(); return { ce: e.isContentEditable || e.getAttribute('contenteditable') === 'true' }; }); await p(pg, 300);
  const ed2 = await pg.evaluate(() => { const e = document.querySelector('#mur .act [data-p="-1.act"]'); return e ? { ce: e.isContentEditable, focus: document.activeElement === e } : null; });
  verif('A1', !!(ed && ed2 && ed2.ce), 'au pilote, en répétition, l’étiquette est un champ qui s’écrit, au clic', JSON.stringify({ ed, ed2 }));
  if (ed2 && ed2.ce) {
    await pg.focus('#mur .act [data-p="-1.act"]'); await pg.keyboard.press('Control+A'); await pg.keyboard.type('Observer le tableau en silence'); await p(pg, 200);
    const ms = await surTableau(() => /— Observer le tableau en silence$/.test(((document.querySelector('#mur2 .act') || {}).textContent || '').trim()), 5000);
    verif('A1', ms != null, 'la correction paraît aussitôt au tableau distant, le numéro gardé (« Activité n — Observer le tableau en silence »)', ms + ' ms · « ' + ((await tabEtat()).act) + ' »');
    await pg.keyboard.press('Escape'); await pg.mouse.click(5, 400);
  }
  await capt(tb, 'A1-repetition-etiquette');
  await pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b) b.click(); }); await p(pg, 1500);
  const r2 = await attendre(tb, async () => { const t = await tabEtat(); return t.att ? t : null; }, 8000);
  verif('A1', !!r2, '« ■ Arrêter » : le tableau distant revient à l’horloge', JSON.stringify({ attente: (r2 || {}).att }));
} else verif('A1', false, 'l’Atelier du chapitre s’ouvre (« ' + titreCh + ' »)', '');

/* A2-A6 · l'heure en mode test */
dire(''); dire('A2 — l’heure des De Gaulle, lancée par la case, en mode test');
const kA = ECR.length; const LA = await lancerCase();
verif('A2', LA.ok && LA.lancee && /Charles de Gaulle/.test(LA.cours || ''), 'la case de l’emploi du temps lance l’heure', JSON.stringify({ lancee: LA.lancee, cours: LA.cours }));
const sA = await suit(); verif('A2', sA.b.eid === sA.a.eid && !sA.b.att, 'le tableau distant suit l’heure', JSON.stringify({ pilote: sA.a.eid, tableau: sA.b.eid }));
const fluxA = await tabEtat(); verif('A2', fluxA.flux.some(c => /^\/site\/tableau_test\/scene$/.test(c)) && !fluxA.sonde && fluxA.fluxN > 0, 'le tableau distant écoute le hub (le flux de la scène), il ne le relit plus toutes les 0,9 s', JSON.stringify({ flux: fluxA.flux, envois: fluxA.fluxN, lecture: fluxA.sonde }));
await feuilleAuTableau('A2');
dire(''); dire('A3 — l’étiquette d’activité au tableau distant');
await etiquetteAuTableau('A3'); await capt(tb, 'A3-etiquette');

dire(''); dire('A4 — le minuteur (9 s) : au tableau avant Départ, jaune au tiers, pause, reprise, rouge au dernier dixième, le son');
await tb.evaluate(() => { document.documentElement.dataset.x = '09'; });
const mb = await minuteurBase('A4', '00:09');
const tP = await tabEtat();
verif('A4', mb.avantRien && mb.ms1 != null && tP.minut && tP.minut.t === '00:09' && /m-pret/.test(tP.minut.c), '« au tableau » coché avant « Départ » : la durée paraît aussitôt au tableau distant, en haut à droite', mb.ms1 + ' ms · ' + JSON.stringify(tP.minut));
const geo = await tb.evaluate(() => { const m = document.getElementById('dr-tab-minut').getBoundingClientRect(), r = document.getElementById('mur2').getBoundingClientRect(); const cs = getComputedStyle(document.getElementById('dr-tab-minut')); return { haut: m.top - r.top, droite: r.right - m.right, fond: cs.backgroundColor, txt: document.getElementById('dr-tab-minut').textContent }; });
verif('A4', geo.haut >= 0 && geo.haut < 60 && geo.droite >= 0 && geo.droite < 60 && /rgb\(0, 0, 0\)/.test(geo.fond) && /^\d\d:\d\d$/.test(geo.txt), 'en haut à droite du tableau, chiffres sur fond noir, aucun mot ; plus de bandeau', JSON.stringify(geo));
await p(pg, 1300); const imm = await tabEtat(); verif('A4', imm.minut && imm.minut.t === '00:09', 'avant « Départ », immobile', JSON.stringify(imm.minut));
const msGo = await mesurer('Départ', () => pg.click('#dr-minut-go'), () => /m-court/.test((document.getElementById('dr-tab-minut') || {}).className || ''), 3000);
const tGo = Date.now();
verif('A4', msGo != null, '« Départ » : il court au tableau distant', msGo + ' ms');
const msJ = await surTableau(() => /m-jaune/.test((document.getElementById('dr-tab-minut') || {}).className || ''), 6000); const ecJ = Date.now() - tGo;
verif('A4', msJ != null && ecJ >= 2400 && ecJ <= 3700, 'il passe au jaune au premier tiers (3 s sur 9)', ecJ + ' ms après Départ');
const ec1 = await ecart(); verif('A4', ec1 < 500, 'le pilote et le tableau distant comptent ensemble (horloge recalée sur le pilote)', 'écart ' + Math.round(ec1) + ' ms');
const msPause = await mesurer('Pause', () => pg.click('#dr-minut-pause'), () => /m-pause/.test((document.getElementById('dr-tab-minut') || {}).className || ''), 3000);
const g1 = await tabEtat(); await p(pg, 1500); const g2 = await tabEtat(); const pb = await pg.evaluate(() => ({ t: document.getElementById('dr-minut-pause').textContent, aff: document.getElementById('dr-minut-aff').textContent }));
verif('A4', msPause != null && g1.minut && g2.minut && g1.minut.t === g2.minut.t && pb.t === '▶ Reprendre', '« ⏸ Pause » : les chiffres s’arrêtent au tableau distant (1,5 s plus tard, les mêmes) ; le bouton dit « ▶ Reprendre »', msPause + ' ms · ' + g1.minut.t + ' → ' + (g2.minut || {}).t + ' · pilote ' + pb.aff);
const msRep = await mesurer('Reprendre', () => pg.click('#dr-minut-pause'), () => /m-court/.test((document.getElementById('dr-tab-minut') || {}).className || ''), 3000);
const ec2 = await ecart(); verif('A4', msRep != null && ec2 < 500, '« ▶ Reprendre » : il repart au tableau distant, là où il était', msRep + ' ms · écart ' + Math.round(ec2) + ' ms');
const msR = await surTableau(() => { const m = document.getElementById('dr-tab-minut'); return /m-rouge/.test(m.className) && /m-court/.test(m.className) && getComputedStyle(m).animationName === 'drMinutClig'; }, 9000);
verif('A4', msR != null, 'rouge clignotant sur le dernier dixième', msR + ' ms');
const fin = await attendre(pg, () => pg.evaluate(() => (DR_CL.sons || 0) >= 6 ? { sons: DR_CL.sons, m: DR_CL.minut && DR_CL.minut.etat } : null), 6000, 150);
verif('A4', !!fin, 'le son sort du pilote : cinq bips sur les cinq dernières secondes, un ding à 0', JSON.stringify(fin || await pg.evaluate(() => ({ sons: DR_CL.sons || 0 }))));
await capt(tb, 'A4-minuteur');
const parti = await surTableau(() => { const m = document.getElementById('dr-tab-minut'); return m && m.style.display === 'none'; }, 7000);
verif('A4', parti != null, 'fini, il quitte le tableau distant (4 s après 0)', parti + ' ms');

dire(''); dire('A5 — « 👥 » : la participation à 0 élève au tableau distant');
const msQ = await mesurer('participation', () => pg.click('#bqui'), () => /^0 élève sur \d+ ont participé$/.test(((document.querySelector('#mur2 .quiw .quit') || {}).textContent || '').trim()), 4000);
verif('A5', msQ != null, '« 0 élève sur N ont participé » paraît au tableau distant', msQ + ' ms · « ' + ((await tabEtat()).qui) + ' »');
await pg.click('#bqui'); await p(pg, 500);

dire(''); dire('A6 — « Annuler cette heure » en mode test');
const ann = await pg.evaluate(() => { const b = document.getElementById('dr-annul'); return b ? { vis: b.offsetParent !== null, title: b.title } : null; });
verif('A6', ann && ann.vis && /oublie/.test(ann.title), '« Annuler cette heure » est au Pilotage, avec son infobulle', ann ? '« ' + ann.title.slice(0, 90) + '… »' : 'absent');
await pg.click('#dr-annul'); await p(pg, 400);
const conf = await pg.evaluate(() => { const g = document.getElementById('garde-annul'); return g && g.classList.contains('on') ? (g.innerText || '').replace(/\s+/g, ' ') : null; });
verif('A6', conf && /oublie tout ce que cette heure a écrit/.test(conf) && /emploi du temps ne la compte pas/.test(conf), 'la confirmation dit ce qui sera oublié', conf ? '« ' + conf.slice(0, 120) + '… »' : 'pas de confirmation');
await pg.click('#gannul-oui'); await p(pg, 3500);
const apA = await pg.evaluate(() => { const e = document.querySelector('#edt-ecran'); return { lancee: !!S.lancee, regime: AT_DR_REGIME, edt: !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0), bande: ((document.getElementById('dr-clos-conf-t') || {}).textContent || ''), relire: ((document.getElementById('dr-clos-relire') || {}).style || {}).display }; });
verif('A6', !apA.lancee && apA.regime !== 'classe' && apA.edt && /est annulée/.test(apA.bande) && apA.relire === 'none', 'l’heure est annulée : l’emploi du temps, « L’heure des … est annulée », sans « Relire »', JSON.stringify(apA));
const retA = await attendre(tb, async () => { const t = await tabEtat(); return t.att ? t : null; }, 8000);
verif('A6', !!retA, 'le tableau distant revient à l’horloge', JSON.stringify({ attente: (retA || {}).att }));
const ttA = { ptr: lire('/site/tableau_test/pointeur'), sc: lire('/site/tableau_test/scene') }; const horsA = horsTest(kA);
verif('A6', !ttA.ptr && !ttA.sc && horsA.length === 0, 'au faux hub : rien de l’heure (le pilote n’a écrit qu’à /site/tableau_test, et l’image du mode test est retirée)', JSON.stringify(ttA).slice(0, 80) + ' · ' + horsA.slice(0, 4).join(' ; '));
await capt(pg, 'A6-annulee');
const errA = P.errs.slice(), boA = P.boites.slice(); await P.ctx.close();

/* ════════════════ B · HEURE RÉELLE ════════════════ */
dire(''); dire('B · l’heure réelle, sur le faux hub (il reçoit tout)');
const testB = await entrer(false); verif('B', !testB, 'le mode test n’est pas posé');
const LB = await lancerCase(); const kB = LB.k;
verif('B', LB.ok && LB.lancee && /Charles de Gaulle/.test(LB.cours || '') && !!lire('/site/cours_actif'), 'la case lance l’heure ; le cours est annoncé au hub', JSON.stringify({ lancee: LB.lancee, cours: LB.cours }));
const sB = await suit(); const fluxB = await tabEtat();
verif('B', sB.b.eid === sB.a.eid && !sB.b.att && fluxB.flux.some(c => /\/deroule_joue\/[^/]+\/scene$/.test(c)) && !fluxB.sonde, 'le tableau distant suit, par le flux de la scène de la classe', JSON.stringify({ flux: fluxB.flux }));
await feuilleAuTableau('B');
await etiquetteAuTableau('B');
await tb.evaluate(() => { document.documentElement.dataset.x = '30'; });
const mbB = await minuteurBase('B', '00:30');
verif('B', mbB.avantRien && mbB.ms1 != null, '« au tableau » : la durée paraît au tableau distant avant « Départ »', mbB.ms1 + ' ms');
const msGoB = await mesurer('Départ (heure réelle)', () => pg.click('#dr-minut-go'), () => /m-court/.test((document.getElementById('dr-tab-minut') || {}).className || ''), 3000);
await p(pg, 1200); const ecB = await ecart();
const msPauseB = await mesurer('Pause (heure réelle)', () => pg.click('#dr-minut-pause'), () => /m-pause/.test((document.getElementById('dr-tab-minut') || {}).className || ''), 3000);
verif('B', msGoB != null && msPauseB != null && ecB < 500, '« Départ » puis « ⏸ Pause » arrivent au tableau distant ; les deux comptes ensemble', msGoB + ' ms · ' + msPauseB + ' ms · écart ' + Math.round(ecB) + ' ms');
const stopB = await mesurer('■ (heure réelle)', () => pg.click('#dr-minut-stop'), () => { const m = document.getElementById('dr-tab-minut'); return m && m.style.display === 'none'; }, 3000);
verif('B', stopB != null, '« ■ » : le minuteur quitte le tableau distant', stopB + ' ms');
const msQB = await mesurer('participation (heure réelle)', () => pg.click('#bqui'), () => /^0 élève sur \d+ ont participé$/.test(((document.querySelector('#mur2 .quiw .quit') || {}).textContent || '').trim()), 4000);
const scQ = lire(LB.C + '/scene') || {};
verif('B', msQB != null && scQ.quiOn === true && !('qui' in scQ), 'la participation à 0 arrive au tableau distant, alors que le hub ne garde pas la liste vide (le drapeau la porte)', msQB + ' ms · scène au hub : quiOn ' + scQ.quiOn + ', qui ' + JSON.stringify(scQ.qui));
await pg.click('#bqui'); await p(pg, 600);
const ecritsB = [...new Set(ECR.slice(kB).filter(e => e.qui === 'pilote').map(e => e.c.replace(/\/heures\/[^/]+/, '/heures/<clé>').replace(LB.C || '§', 'C')))];
dire('  info   B · l’heure a écrit au hub : ' + ecritsB.join(' · '));
await pg.click('#dr-annul'); await p(pg, 400); await pg.click('#gannul-oui'); await p(pg, 4500);
const apB = await pg.evaluate(() => ({ lancee: !!S.lancee, bande: ((document.getElementById('dr-clos-conf-t') || {}).textContent || '') }));
const dif = diffChemins(JSON.parse(sansCle(LB.avant)), JSON.parse(sansCle(HUBN)));
verif('B', !apB.lancee && /est annulée/.test(apB.bande) && dif.length === 0, '« Annuler cette heure » : le faux hub est celui d’avant le lancement — rien de ce que l’heure avait écrit ne reste (copie, journal, état, récit, scène, trace de l’heure, cours annoncé)', dif.length ? dif.slice(0, 6).join(' · ') : ecritsB.length + ' adresse(s) écrite(s) pendant l’heure, toutes revenues');
const retB = await attendre(tb, async () => { const t = await tabEtat(); return t.att ? t : null; }, 8000);
verif('B', !!retB, 'le tableau distant revient à l’horloge', JSON.stringify({ attente: (retB || {}).att }));
await capt(tb, 'B-tableau-horloge');

dire('');
const ret = RETARDS.filter(x => x.ms != null).map(x => x.ms); const max = ret.length ? Math.max(...ret) : null;
dire('  info   retards pilote → tableau distant (le clic compris) : ' + RETARDS.map(x => x.nom + ' ' + (x.ms == null ? '—' : x.ms + ' ms')).join(' · '));
verif('Δ', ret.length === RETARDS.length && max < 500, 'le retard pilote → tableau distant, mesuré à chaque geste, reste sous 0,5 s', 'le plus long : ' + max + ' ms');
verif('JS', errA.length === 0 && P.errs.length === 0 && T.errs.length === 0, 'aucune erreur JS (pilote A, pilote B, tableau distant)', errA.concat(P.errs, T.errs).join(' ; '));
verif('JS', boA.length === 0 && P.boites.length === 0 && T.boites.length === 0, 'aucune boîte système', boA.concat(P.boites, T.boites).join(' ; '));
const finTxt = 'sonde ⑩ · ' + nb + ' vérifications · ' + (echecs ? echecs + ' échec(s) · ROUGE' : '0 échec · VERT');
dire(''); dire(finTxt);
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
