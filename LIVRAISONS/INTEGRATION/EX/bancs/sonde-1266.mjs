// EX · LA SONDE §12.66 PAR LE GESTE — le tableau distant en mode test, la fin de l'heure, la clé USB (Paul, 28/10 18:32 et 18:33).
// Deux navigateurs sur le même faux hub : le PILOTE (le site, en mode test — la pastille du panneau prof) et le TABLEAU DISTANT (`?vue=tableau`,
// l'ordinateur du vidéoprojecteur). L'heure : la case 3E Charles de Gaulle du lundi 14/09 (08:57-09:52), « ▶ Ouvrir le pilotage et lancer »,
// la montre arrêtée à 09:00 (l'horloge de la case dit donc 08:57).
// 1 : l'écran d'attente — la ligne de la clé en bas à droite, petite et pâle, cliquable ; l'horloge seule au centre.
// 2 : le tableau distant suit les diapos et le dévoilement ; son horloge pendant l'heure est celle de la case ; rien n'est écrit pour la classe
//     (au hub : seulement /site/tableau_test) ; le témoin « mode test — rien n'est enregistré pour la classe ».
// 3 : la clôture (« ■ Clore l'heure », l'étape 7, la garde) → l'emploi du temps, la confirmation « L'heure des … est close à 08:57 » et « Relire l'heure » ;
//     « close · 08:57 » ; « Relire l'heure » à la place de « Fin de l'heure » ; le tableau distant revient à l'horloge (pointeur et scène retirés).
// 4 : « Relire l'heure » (la confirmation) ouvre la Relecture de cette heure.
// Le faux hub : les données de sonde-1262 (AUDITS/INTEGRATION-DEROULE/hub), tenues ici dans le banc (Node) pour que les deux navigateurs le partagent.
// usage : node sonde-1266.mjs <assemble/index.html> [sortie.txt]   (MJPC_CAPT=<dossier> : captures). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-1266.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
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
const attendre = async (pg, f, max = 10000) => { const t0 = Date.now(); let v; while (Date.now() - t0 < max) { v = await f(); if (v) return v; await p(pg, 300); } return v; };

/* ── le faux hub (les données de sonde-1262), partagé par les deux navigateurs : il vit dans le banc ── */
const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const HUBN = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
const ECR = [];   // { qui, m, c } : chaque écriture arrivée au hub
const lire = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = HUBN; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
const hubRepondre = (qui, m, c, corps) => { if (m === 'GET') return JSON.stringify(lire(c)); let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {} ECR.push({ qui, m, c });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => new Response(t, { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async (qui, W, H, q) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); await pg.clock.setFixedTime(HORLOGE);
  await pg.goto(URL0 + q, { waitUntil: 'load' }); return { ctx, pg, errs, boites }; };
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const gardes = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (m && m.getBoundingClientRect().height > 0) m.querySelectorAll('button').forEach(x => { if (/^(Compris|OK)$/.test(x.textContent.trim())) x.click(); }); const g = document.getElementById('garde'); if (g && g.classList.contains('on')) { const d = document.getElementById('garde-devant'); if (d) d.click(); } }).catch(() => {});
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const ecritsDepuis = k => ECR.slice(k).map(e => e.qui + ' ' + e.m + ' ' + e.c);
const horsTest = k => ECR.slice(k).filter(e => e.qui === 'pilote' && !/^\/site\/tableau_test(\/|$)/.test(e.c)).map(e => e.qui + ' ' + e.m + ' ' + e.c);   // le pilote ; le tableau distant n'écrit que l'état de sa clé (/site/cle_vue, §12.44), dit à part
const duTableau = k => ECR.slice(k).filter(e => e.qui === 'tableau').map(e => e.m + ' ' + e.c);

dire('sonde §12.66 · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5 + ' · la montre à 09:00 (lundi 14/09), la case des De Gaulle 08:57-09:52');

/* ── le tableau distant (l'ordinateur du vidéoprojecteur) ── */
const T = await ouvrir('tableau', 1280, 720, '?vue=tableau'); const tb = T.pg; await p(tb, 2500);
dire(''); dire('1 — l\'écran d\'attente du tableau distant (la clé USB, l\'horloge)');
const att = await tb.evaluate(() => { const r = id => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return { x: b.left, y: b.top, r: b.right, b: b.bottom, w: b.width, h: b.height, fs: parseFloat(cs.fontSize), op: +cs.opacity, pe: cs.pointerEvents, t: (e.textContent || '').trim(), vis: b.width > 0 && b.height > 0 && cs.visibility !== 'hidden' }; };
  const W = innerWidth, H = innerHeight, cle = r('ses-tab-cle'); let auCentreCle = null; if (cle) { const e = document.elementFromPoint((cle.x + cle.r) / 2, (cle.y + cle.b) / 2); auCentreCle = !!(e && e.closest && e.closest('#ses-tab-cle')); }
  const centre = document.elementFromPoint(W / 2, H / 2); const centreId = centre ? (centre.id || (centre.closest('[id]') || {}).id || centre.className) : null;
  const colonne = Array.from(document.querySelectorAll('#ses-tab-att > *')).filter(e => e.id !== 'ses-tab-cle' && e.getBoundingClientRect().height > 0).map(e => e.id || e.className);
  return { W, H, cle, auCentreCle, h: r('ses-tab-h'), d: r('ses-tab-d'), centreId, colonne }; });
verif('1', !!(att.cle && att.cle.vis && att.cle.t), 'la ligne de la clé est là, sur l\'écran d\'attente', att.cle ? '« ' + att.cle.t + ' »' : 'absente');
if (att.cle) {
  verif('1', att.cle.r >= att.W - 0.06 * att.W && att.cle.b >= att.H - 0.08 * att.H && att.cle.x > att.W / 2 && att.cle.y > att.H * 0.8, 'elle est en bas à droite', 'boîte ' + [att.cle.x, att.cle.y, att.cle.r, att.cle.b].map(Math.round).join(',') + ' sur ' + att.W + '×' + att.H);
  verif('1', att.cle.fs < 0.022 * att.H && att.cle.op <= 0.6, 'petite et pâle', 'police ' + att.cle.fs.toFixed(1) + ' px (avant : 2,2 vh = ' + (0.022 * att.H).toFixed(1) + ' px), opacité ' + att.cle.op);
  verif('1', att.auCentreCle && att.cle.pe !== 'none', 'toujours cliquable (rien ne la couvre)', 'pointer-events ' + att.cle.pe);
  const sep = (a, b) => !a || !b || a.r <= b.x || b.r <= a.x || a.b <= b.y || b.b <= a.y;
  verif('1', /ses-tab-h/.test(String(att.centreId)) && sep(att.cle, att.h) && sep(att.cle, att.d) && att.colonne.indexOf('ses-tab-cle') < 0, 'l\'horloge seule au centre (la date dessous) ; la clé n\'est plus dans la colonne du centre', 'au centre : ' + att.centreId + ' · colonne : ' + att.colonne.join(' '));
}
verif('1', (att.h || {}).t === '09:00', 'avant l\'heure, l\'horloge d\'attente est celle de la montre', (att.h || {}).t);
await capt(tb, '1-attente');

/* ── le pilote : le site, le panneau prof, le mode test (la pastille), la case de l'emploi du temps ── */
const P = await ouvrir('pilote', 1707, 743, '?n=3e'); const pg = P.pg; await p(pg, 1800);
await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg);
dire(''); dire('2 — l\'heure des De Gaulle en mode test : le tableau distant suit, rien n\'est écrit pour la classe');
await pg.evaluate(() => { try { openProfPanel(); } catch (e) {} }); await p(pg, 800);
const pill = await pg.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (!b) return false; b.click(); return true; }); await p(pg, 800);
const testOn = await pg.evaluate(() => typeof m8TestOn === 'function' && m8TestOn());
verif('2', pill && testOn, 'le mode test est posé par la pastille du panneau prof', 'pastille ' + pill + ', m8TestOn ' + testOn);
await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await sansVoiles(pg);
const k0 = ECR.length; const classe0 = JSON.stringify(lire('/site/3e')); const coursActif0 = JSON.stringify(lire('/site/cours_actif'));
await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 1800);
const caseOk = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (!c) return false; c.click(); return true; }); await p(pg, 800);
const lanceOk = caseOk && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(pg, 3500); await gardes(pg); await p(pg, 500);
const l = await pg.evaluate(() => ({ lancee: !!(S.lancee && !S.close), cours: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeNom : null, enClasse: document.documentElement.classList.contains('dr-en-classe'), enr: (document.getElementById('dr-enr') || {}).textContent || '', hcase: (document.getElementById('dr-hcase') || {}).textContent || '' }));
verif('2', l.lancee && /Charles de Gaulle/.test(l.cours || '') && l.enClasse, 'la case de l\'emploi du temps lance l\'heure des De Gaulle, dans l\'écran de la classe', JSON.stringify({ lancee: l.lancee, cours: l.cours, enClasse: l.enClasse }));
verif('2', l.enr === 'mode test — rien n\'est enregistré pour la classe', 'le témoin de l\'en-tête', '« ' + l.enr + ' » · ' + l.hcase);
const pilMur = () => pg.evaluate(() => ({ eid: S.mur && S.mur.eid, di: S.di, nDev: S.mur && S.mur.nDev }));
const tabMur = () => tb.evaluate(() => { const m = (typeof DR_TAB !== 'undefined' && DR_TAB.montre) || null; const a = document.getElementById('ses-tab-att'); return { eid: m && m.eid, nDev: m && m.nDev, att: !!(a && a.style.display !== 'none'), texte: ((document.getElementById('mur2') || {}).innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80), h: (document.getElementById('ses-tab-h') || {}).textContent || '' }; });
const suit = async () => { const a = await pilMur(); const b = await attendre(tb, async () => { const t = await tabMur(); return (t.eid === a.eid && t.nDev === a.nDev && !t.att && t.texte) ? t : null; }, 9000); return { a, b: b || await tabMur() }; };
let s1 = await suit();
verif('2', s1.b.eid === s1.a.eid && s1.b.nDev === s1.a.nDev && !s1.b.att && !!s1.b.texte, 'le tableau distant montre la diapo de l\'heure (la même diapo, le même dévoilement)', 'pilote ' + JSON.stringify(s1.a) + ' · tableau ' + JSON.stringify({ eid: s1.b.eid, nDev: s1.b.nDev, att: s1.b.att }) + ' « ' + s1.b.texte.slice(0, 50) + ' »');
verif('2', s1.b.h === '08:57', 'pendant l\'heure, l\'horloge du tableau distant est celle de la case (08:57), pas la montre (09:00)', s1.b.h);
await capt(tb, '2-tableau-heure');
/* le dévoilement : ▶ jusqu'à une ligne dévoilée (une diapo d'image se passe d'un ▶) */
const bdev = async () => { await pg.evaluate(() => document.getElementById('bdev').click()); await p(pg, 300); await gardes(pg); };
let a2 = null; for (let n = 0; n < 25; n++) { await bdev(); a2 = await pilMur(); if (a2.nDev > 0) break; }
let s2 = await suit();
verif('2', a2 && a2.nDev > 0 && s2.b.nDev === s2.a.nDev && s2.b.eid === s2.a.eid && !!s2.b.texte, '▶ : le tableau distant suit le dévoilement', 'pilote ' + JSON.stringify(s2.a) + ' · tableau ' + JSON.stringify({ eid: s2.b.eid, nDev: s2.b.nDev }));
await bdev(); let s2b = await suit();
verif('2', s2b.a.eid === s2.a.eid && s2b.a.nDev === s2.a.nDev + 1 && s2b.b.nDev === s2b.a.nDev, '▶ encore : une ligne de plus au tableau distant', 'pilote ' + s2.a.nDev + ' → ' + s2b.a.nDev + ' · tableau ' + s2b.b.nDev);
/* la diapo suivante : ▶ jusqu'au changement de diapo */
for (let n = 0; n < 25; n++) { const a = await pilMur(); if (a.eid !== s2.a.eid) break; await bdev(); }
let s3 = await suit();
verif('2', s3.a.eid !== s2.a.eid && s3.b.eid === s3.a.eid && s3.b.nDev === s3.a.nDev, 'la diapo suivante : le tableau distant suit', 'pilote ' + JSON.stringify(s3.a) + ' · tableau ' + JSON.stringify({ eid: s3.b.eid, nDev: s3.b.nDev }));
const hors = horsTest(k0); const tous = ecritsDepuis(k0);
verif('2', hors.length === 0 && tous.some(x => /^pilote PUT \/site\/tableau_test\//.test(x)), 'rien n\'est écrit pour la classe : le pilote n\'écrit au hub qu\'à /site/tableau_test (l\'image du tableau)', tous.length + ' écriture(s), dont ' + hors.length + ' ailleurs' + (hors.length ? ' : ' + hors.slice(0, 5).join(' ; ') : ' — ' + [...new Set(tous.map(x => x.replace(/^(\S+ \S+) /, '$1 ')))].join(' · ')));
const hub1 = { ptr: lire('/site/tableau_test/pointeur'), caInchange: JSON.stringify(lire('/site/cours_actif')) === coursActif0, classeInchangee: JSON.stringify(lire('/site/3e')) === classe0 };
verif('2', !!(hub1.ptr && hub1.ptr.test && /Charles de Gaulle/.test(hub1.ptr.classeNom || '')) && hub1.caInchange && hub1.classeInchangee, 'au hub : le pointeur du mode test ; /site/cours_actif et le niveau 3e (copies, journaux, récits) inchangés', JSON.stringify({ pointeur: hub1.ptr ? { test: hub1.ptr.test, classe: hub1.ptr.classeNom, quoi: hub1.ptr.quoi } : null, cours_actif_inchange: hub1.caInchange, site_3e_inchange: hub1.classeInchangee }));

/* ── la clôture : « ■ Clore l'heure » → l'étape 7 → « Clore l'heure » → la garde ── */
dire(''); dire('3 — la clôture : l\'emploi du temps, la confirmation, « close · », « Relire l\'heure », le tableau distant à l\'horloge');
const k1 = ECR.length;
await pg.evaluate(() => document.getElementById('dr-clore').click()); await p(pg, 900);
await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(pg, 600);
await pg.evaluate(() => { const g = document.getElementById('garde-clore'); if (g && g.classList.contains('on')) document.getElementById('gclore-oui').click(); }); await p(pg, 2500); await gardes(pg);
const c = await pg.evaluate(() => { const e = document.querySelector('#edt-ecran'); const b = document.getElementById('dr-clos-conf'); const rb = b ? b.getBoundingClientRect() : null; const re = document.getElementById('dr-clos-relire'); const x = document.getElementById('dr-clos-x'); const bf = document.getElementById('bfin');
  return { close: !!(S.lancee && S.close), edt: !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0), edtHaut: e ? Math.round(e.getBoundingClientRect().top) : null, bande: !!(rb && rb.height > 0 && b.style.display !== 'none'), bandeHaut: rb ? Math.round(rb.top) : null, texte: b ? (document.getElementById('dr-clos-conf-t') || {}).textContent : '',
    relire: re ? { t: re.textContent.trim(), title: re.title, vis: re.getBoundingClientRect().height > 0 } : null, croix: x ? { t: x.textContent.trim(), title: x.title } : null,
    chr: (document.getElementById('chr') || {}).textContent || '', bfin: bf ? { t: bf.textContent.trim(), dis: bf.disabled, title: bf.title } : null, classeEcran: document.documentElement.classList.contains('dr-en-classe') }; });
verif('3', c.close && c.edt && !c.classeEcran, 'l\'heure est close et le site emmène à l\'emploi du temps', JSON.stringify({ close: c.close, edt: c.edt, ecranDeLaClasse: c.classeEcran }));
verif('3', c.bande && c.bandeHaut === 0 && c.edtHaut >= 40 && c.texte === 'L’heure des 3E Charles de Gaulle est close à 08:57', 'en haut, la confirmation, à l\'heure de la case', '« ' + c.texte + ' » · bande en haut ' + c.bandeHaut + ' px, emploi du temps dessous à ' + c.edtHaut + ' px');
verif('3', !!(c.relire && c.relire.vis && c.relire.t === 'Relire l’heure' && c.relire.title && c.croix && c.croix.title), '« Relire l’heure » dans la confirmation, avec son infobulle (et « ✕ »)', c.relire ? '« ' + c.relire.title + ' »' : 'absent');
verif('3', c.chr === 'close · 08:57', '« close · » donne l\'heure de la case (08:57), pas la montre (09:00)', '« ' + c.chr + ' »');
verif('3', !!(c.bfin && c.bfin.t === 'Relire l’heure' && !c.bfin.dis && c.bfin.title), 'sur l\'heure close, « Relire l’heure » remplace « Fin de l’heure » (plus de bouton grisé)', c.bfin ? JSON.stringify(c.bfin) : 'pas de #bfin');
await capt(pg, '3-cloture-edt');
const retour = await attendre(tb, async () => { const t = await tabMur(); return (t.att && !t.texte && !t.eid && t.h === '09:00') ? t : null; }, 9000);
const tR = retour || await tabMur();
verif('3', !!retour && tR.h === '09:00', 'le tableau distant revient à l\'horloge (celle de la montre, l\'heure finie)', JSON.stringify({ attente: tR.att, mur: tR.texte.slice(0, 30), horloge: tR.h }));
const hub2 = { ptr: lire('/site/tableau_test/pointeur'), sc: lire('/site/tableau_test/scene') };
verif('3', !hub2.ptr && !hub2.sc && horsTest(k1).length === 0, 'à la clôture, le pointeur et la scène du mode test sont retirés ; toujours rien d\'écrit pour la classe', JSON.stringify(hub2) + ' · ' + ecritsDepuis(k1).join(' ; '));
await capt(tb, '3-tableau-horloge');

/* ── « Relire l'heure » : la Relecture de cette heure ── */
dire(''); dire('4 — « Relire l’heure » ouvre la Relecture de cette heure');
const h0 = await pg.evaluate(() => S.heure);
await pg.evaluate(() => document.getElementById('dr-clos-relire').click()); await p(pg, 3500); await gardes(pg);
const r4 = await pg.evaluate(() => { const e = document.querySelector('#edt-ecran'); const b = document.getElementById('dr-clos-conf'); return { vue: (typeof ATVUES !== 'undefined' && ATVUES) ? ATVUES.vue : null, relecture: document.body.classList.contains('vue-relecture'), face: S.face, faceH: S.faceH, edt: !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0), bande: !!(b && b.style.display !== 'none'), texte: ((document.getElementById('ecran-relecture') || {}).innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90) }; });
verif('4', r4.vue === 'relecture' && r4.face === 'recit' && r4.faceH === h0 && !r4.edt && !r4.bande && !!r4.texte, 'la Relecture de l\'heure close s\'ouvre (son récit) ; l\'emploi du temps et la confirmation se referment', JSON.stringify(Object.assign({}, r4, { heure: h0 })));
await capt(pg, '4-relecture');
verif('4', horsTest(k0).length === 0 && JSON.stringify(lire('/site/3e')) === classe0 && JSON.stringify(lire('/site/cours_actif')) === coursActif0, 'sur tout le parcours, le pilote n\'a rien écrit au hub hors de /site/tableau_test (niveau 3e et cours_actif inchangés)', horsTest(k0).slice(0, 5).join(' ; '));
dire('  info   4 · le tableau distant, lui, n\'écrit que l\'état de sa clé USB (§12.44) : ' + ([...new Set(duTableau(0))].join(' · ') || 'rien'));

dire('');
verif('JS', P.errs.length === 0 && T.errs.length === 0, 'aucune erreur JS (pilote, tableau distant)', P.errs.concat(T.errs).join(' ; '));
verif('JS', P.boites.length === 0 && T.boites.length === 0, 'aucune boîte système', P.boites.concat(T.boites).join(' ; '));
const fin = 'sonde §12.66 · ' + nb + ' vérifications · ' + (echecs ? echecs + ' échec(s) · ROUGE' : '0 échec · VERT');
dire(''); dire(fin);
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
