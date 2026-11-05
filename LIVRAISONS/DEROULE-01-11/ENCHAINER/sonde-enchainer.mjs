// C16 mandat V · « ▶ SÉANCE SUIVANTE DANS CETTE HEURE » (MANDATS/DEROULE-01-11/APRES-8860/V-LA-SEANCE-SUIVANTE-DANS-CETTE-HEURE.md) — le harnais de EX/bancs/sonde-1266.mjs
// (lignes 13-51, reprises ; la montre installée à 09:00, elle avance). Le faux hub du banc, une seule retouche en mémoire : la séance 1 du chapitre 0 (« Poésie et peinture »)
// tient dans une heure (chaque diapo 2 min) et n'a encore rien de joué — la case des De Gaulle du lundi 14/09 (08:57-09:52) la propose, heure 1 sur 1.
// MJPC_MODE = vh (vraie heure, le faux hub) | test (la pastille du mode test) | rep (la répétition, « ▶ Jouer en avance ») | temoin (vraie heure, on clôt sans enchaîner).
// usage : MJPC_MODE=vh MJPC_CAPT=<dossier> MJPC_DSF=2 node sonde-enchainer.mjs <assemble/index.html> [sortie.txt]. Code 1 si un échec. Aucun nom d'élève écrit dans la sortie.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-1266.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
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
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); await pg.clock.install({ time: HORLOGE });
  await pg.goto(URL0 + q, { waitUntil: 'load' }); return { ctx, pg, errs, boites }; };
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const gardes = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (m && m.getBoundingClientRect().height > 0) m.querySelectorAll('button').forEach(x => { if (/^(Compris|OK)$/.test(x.textContent.trim())) x.click(); }); const g = document.getElementById('garde'); if (g && g.classList.contains('on')) { const d = document.getElementById('garde-devant'); if (d) d.click(); } }).catch(() => {});
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const ecritsDepuis = k => ECR.slice(k).map(e => e.qui + ' ' + e.m + ' ' + e.c);
const MODE = process.env.MJPC_MODE || 'vh'; let H2path = null, nS1 = null, nS2 = null, rS2 = null; const DSF = +process.env.MJPC_DSF || 1;
/* la retouche du faux hub : la séance 1 (index 0) d'une heure, rien de joué */
const DEUX = !!process.env.MJPC_DEUX;   /* V2 : la séance 1 prévue en deux heures (ses durées × 0,5 : 110 → 55 min ; au faux hub, 110 min = 3 heures), son heure 1 jouée le 07/09 (la trace du faux hub, gardée) : la case du 14/09 la propose heure 2/2 (le cas de Paul : 3E, séance 1 heure 2/2, puis la séance 2) */
if (DEUX) { const se = HUBN.site['3e'].chapitres[0].seances[0]; (se.deroule.ecrans || []).forEach(e => { if (e && e.role !== 'fin') e.dur = Math.max(1, Math.round((+e.dur || 0) * 0.5)); }); }
const T5 = !!process.env.MJPC_T5, T5ORD = !!process.env.MJPC_T5_ORD;   /* V3 (Paul, 05/11 22:38) : la séance 2 PAS finie — au T-5, le flux classique ; « Reporter » : l'activité en cours et les suivantes. T5ORD : l'heure ordinaire de comparaison (la séance 2 lancée par la case, la séance 1 jouée et close le 07/09) */
if (T5ORD) { const se = HUBN.site['3e'].chapitres[0].seances[0]; (se.deroule.ecrans || []).forEach(e => { if (e && e.role !== 'fin') e.dur = 2; }); Object.values(se.deroule_joue || {}).forEach(b => Object.values((b && b.heures) || {}).forEach(H => { if (H) { delete H.decisionsParEcran; delete H.decisionsParActivite; } })); }
if (!DEUX && !T5ORD) { const se = HUBN.site['3e'].chapitres[0].seances[0]; delete se.deroule_joue; (se.deroule.ecrans || []).forEach(e => { if (e && e.role !== 'fin') e.dur = 2; }); }
const S1 = String(HUBN.site['3e'].chapitres[0].seances[0].titre || HUBN.site['3e'].chapitres[0].seances[0].title), S2 = String(HUBN.site['3e'].chapitres[0].seances[1].titre || HUBN.site['3e'].chapitres[0].seances[1].title);
dire('sonde de l\'enchaînement (mandat V) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5 + ' · mode ' + MODE + (DEUX ? ' · la séance 1 en deux heures, enchaînée à sa 2e heure' : '') + ' · la montre part de 09:00 (lundi 14/09), la case des De Gaulle 08:57-09:52 · séance 1 « ' + S1 + ' », séance 2 « ' + S2 + ' »');

/* le tableau distant, puis le pilote (1920×1080) */
const T = await ouvrir('tableau', 1280, 720, '?vue=tableau'); const tb = T.pg; await p(tb, 2000);
const ctxP = await nav.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: DSF, timezoneId: 'Europe/Paris' }); const errsP = [];
await ctxP.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
await ctxP.exposeFunction('__hubN', (m, c, corps) => hubRepondre('pilote', m, c, corps)); await ctxP.addInitScript(fauxFetch);
const pg = await ctxP.newPage(); pg.on('pageerror', e => errsP.push('[après « ' + String(R[R.length - 1] || '').trim().slice(0, 50) + ' »] ' + String(e.message).slice(0, 120) + (process.env.MJPC_PILE ? ' @ ' + String(e.stack || '').split('\n').slice(1, +(process.env.MJPC_PILE) > 1 ? +process.env.MJPC_PILE : 3).join(' ').replace(/file:[^ )]*html[^:]*:/g, 'l.').slice(0, +(process.env.MJPC_PILE) > 3 ? 900 : 160) : ''))); pg.on('dialog', d => d.dismiss().catch(() => {})); await pg.clock.install({ time: HORLOGE });
await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800);
await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg);
if (MODE === 'test') { await pg.evaluate(() => { try { openProfPanel(); } catch (e) {} }); await p(pg, 800); await pg.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (b) b.click(); }); await p(pg, 800);
  verif('0', await pg.evaluate(() => typeof m8TestOn === 'function' && m8TestOn()), 'le mode test est posé par la pastille du panneau prof'); await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await sansVoiles(pg); }
const k0 = ECR.length; const site0 = JSON.stringify(lire('/site/3e'));
const etat = () => pg.evaluate(() => ({ lancee: !!S.lancee, close: !!S.close, rep: !!S.repetition, snum: String(ATVUES.snum), heure: S.heure, sur: typeof DR_CL === 'object' ? DR_CL.sur : null, di: S.di, der: (() => { try { const o = ordreHeure(S.heure); return o[o.length - 1]; } catch (e) { return null; } })(), bouton: (() => { const b = document.getElementById('dr-ench'); return !!(b && b.offsetParent !== null && b.style.display !== 'none'); })(), cours: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeNom : null, H: (() => { try { return dr_cheminH(); } catch (e) { return null; } })() }));
const bdev = async () => { await pg.click('#bdev', { timeout: 2000 }).catch(() => pg.evaluate(() => document.getElementById('bdev').click())); await p(pg, 160); await gardes(pg); };
const lireP = c => pg.evaluate(c => new Promise(r => { try { dr_lire(c, v => r(v === undefined ? null : v)); } catch (e) { r('?'); } setTimeout(() => r('délai'), 4000); }), c);

/* V3 — le T-5 d'une séance pas finie, puis « Reporter » (l'activité en cours et les suivantes), la clôture, la case suivante. Les lignes « T5 » se comparent, base → après. */
const t5Bloc = async quoi => {
  dire(''); dire('T — ' + quoi + ', pas finie : la montre au T-5 (09:42:30, le cahier de textes à 09:47, la case finit à 09:52), le flux de la fin d\'heure, puis « Reporter »');
  for (let i = 0; i < 4; i++) await bdev();
  const av = await pg.evaluate(() => { const E = seance().ecrans, o = ordreHeure(S.heure); const k = o.indexOf(S.di); const act = E[S.di] && E[S.di].actId; const reste = o.slice(k).filter(i => E[i] && !E[i].role && E[i].actId && !finie(E[i], i));
    return { snum: String(ATVUES.snum), heure: S.heure, eid: E[S.di] && E[S.di].eid, act, resteAct: reste.filter(i => E[i].actId === act).map(i => E[i].eid), resteApres: reste.filter(i => E[i].actId !== act).map(i => E[i].eid), actsApres: [...new Set(reste.filter(i => E[i].actId !== act).map(i => E[i].actId))].length, t5: !!S.t5, enFin: !!S.enFin }; });
  verif('T', av.snum === '1' && !av.t5 && !av.enFin && av.resteAct.length > 0 && av.actsApres > 0, 'avant le T-5 : la séance 2 (heure ' + av.heure + ') pas finie, rien d\'ouvert', JSON.stringify({ eid: av.eid, resteAct: av.resteAct.length, resteApres: av.resteApres.length, activitesApres: av.actsApres }));
  await pg.clock.setSystemTime(new Date('2026-09-14T09:42:30+02:00')); await p(pg, 4000);
  const lire5 = () => pg.evaluate(() => { const vis = el => !!(el && el.offsetParent !== null); const tete = document.querySelector('#fin .pp-tete');
    return { t5: !!S.t5, palier: S.palier, paliers: ['t5', 't3', 't1', 'zero'].filter(k => (S.paliers || {})[k]).join(','), enFin: !!S.enFin, prep: !!S.preparation, ecranFin: !!(document.getElementById('ecran-fin') && document.getElementById('ecran-fin').classList.contains('on')), chr: (document.getElementById('chr') || {}).className || '', tete: tete ? tete.innerText.replace(/\s+/g, ' ') : '',
      liste: Array.from(document.querySelectorAll('#fin .pp-liste [data-sec]')).map(x => x.dataset.sec + ':' + x.innerText.replace(/\s+/g, ' ').trim()).join(' | '), boutons: Array.from(document.querySelectorAll('#fin button')).filter(vis).map(b => b.id || b.innerText.replace(/\s+/g, ' ').trim().slice(0, 30)).join(' | '), journal: J.filter(x => /^(t5|t3|t1|cahier-heure)$/.test(x.type)).map(x => x.type).join(',') }; });
  const nz = t => String(t).replace(S2, 'SÉANCE').replace(S1, 'SÉANCE').replace(/\d{1,2}[:h ]\s?\d{2}/g, 'HH:MM').replace(/\d+/g, '#');
  const f = await lire5();
  dire('  T5 alerte : t5 ' + f.t5 + ' · palier ' + f.palier + ' · paliers ' + f.paliers + ' · chrono ' + f.chr + ' · journal ' + f.journal + ' · panneau ouvert ' + f.enFin + ' · préparation ' + f.prep);
  dire('  T5 panneau : ' + nz(f.tete)); dire('  T5 étapes : ' + nz(f.liste)); dire('  T5 boutons : ' + nz(f.boutons));
  verif('T', f.t5 && f.palier === 't5' && f.paliers === 't5' && /Préparer le cahier de textes/.test(f.tete), 'au T-5 : l\'alerte (le palier t5), « Préparer le cahier de textes », le panneau de fin d\'heure ouvert', f.tete.slice(0, 120));
  await capt(pg, 't5-' + (T5ORD ? 'ordinaire' : 'enchainee') + '-1-le-t5');
  await pg.click('#f-suivante').catch(() => {}); await p(pg, 1200);
  let nR = 0; for (let k = 0; k < 40; k++) { const ok = await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('#fin .carte .dec button[data-c="reporter"]')).find(x => !x.classList.contains('on') && !x.disabled && x.offsetParent !== null); if (!b) return false; b.click(); return true; }); if (!ok) break; nR++; await p(pg, 500); }
  const cartes = await pg.evaluate(() => Array.from(document.querySelectorAll('#fin .carte')).map(c => { const o = c.querySelector('.dec button.on'); return o ? o.dataset.c : '-'; }).join(','));
  dire('  T5 « ce qui n\'a pas été fait » : ' + nR + ' clic(s) sur « Reporter » · les cartes : ' + cartes);
  await capt(pg, 't5-' + (T5ORD ? 'ordinaire' : 'enchainee') + '-2-reporter');
  const Hp = (await etat()).H;
  await pg.evaluate(() => { const l = document.querySelector('#fin .pp-liste [data-sec="7"]'); if (l) l.click(); }); await p(pg, 900);
  await pg.evaluate(() => { const b = document.getElementById('dr-clore'); if (b) b.click(); }); await p(pg, 900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(pg, 900);
  if (await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return !!(g && g.classList.contains('on')); })) { await pg.click('#gclore-oui').catch(() => {}); await p(pg, 1500); }
  const z = await attendre(pg, async () => { const w = await etat(); return w.close || !w.lancee ? w : null; }, 8000) || await etat();
  const H = await lireP(Hp); const rep = Object.keys((H && H.decisionsParEcran) || {}).filter(k => (H.decisionsParEcran[k] || {}).choix === 'reporter');
  const okA = av.resteAct.filter(e => rep.includes(e)).length, okB = av.resteApres.filter(e => rep.includes(e)).length;
  dire('  T5 au hub : close ' + !!(H && H.clos) + ' · ' + rep.length + ' diapos reportées · de l\'activité en cours ' + okA + '/' + av.resteAct.length + ' · des activités suivantes ' + okB + '/' + av.resteApres.length + ' (' + av.actsApres + ' activités)');
  verif('T', H && H.clos === true && !(z.lancee && !z.close) && okA === av.resteAct.length && okB === av.resteApres.length && rep.length === av.resteAct.length + av.resteApres.length, '« Reporter » puis clore : les diapos restantes de l\'activité en cours ET les activités suivantes reportées, rien d\'autre', rep.length + ' reportées = ' + okA + ' + ' + okB);
  /* la case suivante : la séance 2 continue, les reportées en tête — l'emploi du temps (sa file) et l'ordre de l'heure suivante (`dr_ordreOuverture` lit la trace) */
  await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 2500);
  const cs = await pg.evaluate(() => Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).map(e => ({ o: (e.getAttribute('onclick') || '').match(/\d{4}-\d{2}-\d{2}/), t: (e.innerText || '').replace(/\s+/g, ' ') })).map(c => ({ iso: c.o ? c.o[0] : '', t: c.t })).sort((a, b) => a.iso.localeCompare(b.iso)));
  const sv = cs.find(c => c.iso > '2026-09-14') || {}; const c14 = cs.find(c => c.iso === '2026-09-14') || {};
  dire('  T5 case du jour : ' + nz(c14.t || '')); dire('  T5 case suivante : ' + nz(sv.t || ''));
  verif('T', (sv.t || '').indexOf(S2.slice(0, 15)) >= 0, 'la case suivante continue la séance 2', sv.iso + ' · ' + (sv.t || ''));
  await capt(pg, 't5-' + (T5ORD ? 'ordinaire' : 'enchainee') + '-3-la-case-suivante');
  const tete = await pg.evaluate(([n, r]) => { try { const f = edtFileDAttente(n, null); const se = f && f.seances && f.seances[0]; const H2 = edtSeanceEtat(se, n); return { snum: se && String(se.__i), suite: H2.suite, reportees: (H2.reportees || []).length, r0: (H2.reportees || []).slice(0, r.length).join(',') === r.join(',') }; } catch (e) { return 'ERR ' + e.message; } }, ['3E Charles de Gaulle', rep]);
  dire('  T5 la file : ' + JSON.stringify(tete));
  verif('T', tete && tete.snum === '1' && tete.suite === true && tete.reportees === rep.length, 'la file : la séance 2 en tête, « suite », ses reportées à reprendre en tête de l\'heure suivante', JSON.stringify(tete));
};

/* 1 — l'heure 1 : par la case (vh, test, temoin) ou « ▶ Jouer en avance » (rep) */
dire(''); dire('1 — la séance 1 lancée' + (MODE === 'rep' ? ' en répétition' : ' par la case de l\'emploi du temps'));
if (MODE === 'rep') {   /* V3 : la répétition lancée comme Paul la lance, et comme la sonde du bilan (BILAN/sonde-bilan.mjs, MJPC_BREP=1, l. 310-317) : la case de la classe → « Préparer » → « ▶ Jouer en avance » de l'Atelier */
  await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 2000);
  const cs = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (!c) return null; const t = (c.innerText || '').replace(/\s+/g, ' '); c.click(); return t; });
  verif('1', cs && cs.indexOf(S1.slice(0, 20)) >= 0, 'la case du lundi propose la séance 1', cs);
  await p(pg, 900); const pr = await clicTexte(pg, '#edt-modale button', 'Préparer'); await p(pg, 4000);
  const vj = await pg.isVisible('#at-jouer').catch(() => false); if (vj) await pg.click('#at-jouer'); await p(pg, 2500); await gardes(pg);
  dire('  « Préparer » ' + pr + ' · « ▶ Jouer en avance » visible ' + vj + ' · S.repetition ' + (await pg.evaluate(() => !!S.repetition)));
} else {
  await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 2000);
  const cs = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0) || cs[0]; if (!c) return null; const t = (c.innerText || '').replace(/\s+/g, ' '); c.click(); return t; });
  verif('1', cs && cs.indexOf((T5ORD ? S2 : S1).slice(0, 20)) >= 0 && (!DEUX || /heure 2\/2/.test(cs)), 'la case du lundi propose la séance ' + (T5ORD ? '2 (la séance 1 jouée et close le 07/09)' : '1') + (DEUX ? ', heure 2/2' : ''), cs);
  await p(pg, 900); await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(pg, 4000); await gardes(pg); await p(pg, 600);
}
let e1 = await attendre(pg, async () => { const x = await etat(); return (MODE === 'rep' ? x.rep : x.lancee) && !x.close ? x : null; }, 15000) || await etat();   /* V3 : en répétition, « tourne » = S.repetition (la répétition ne pose pas S.lancee, l'heure de classe) */
verif('1', (MODE === 'rep' ? e1.rep : e1.lancee) && !e1.close && e1.snum === (T5ORD ? '1' : '0') && (MODE === 'rep' ? e1.rep : /Charles de Gaulle/.test(e1.cours || '')), 'la séance ' + (T5ORD ? 2 : 1) + ' tourne', JSON.stringify({ snum: e1.snum, heure: e1.heure, sur: e1.sur, rep: e1.rep, cours: e1.cours }));
/* un absent marqué au clic droit pendant l'heure (pas en répétition : la classe test) */
let absent = null;
if (MODE !== 'rep') { absent = await pg.evaluate(() => (typeof ELEVES !== 'undefined' && ELEVES[2]) || null);
  const sel = '#part [data-e="' + String(absent).replace(/"/g, '\\"') + '"]'; await pg.click(sel, { button: 'right', timeout: 2500 }).catch(() => {}); await p(pg, 300); await pg.click('#menu [data-a="absent"]', { timeout: 1500 }).catch(() => {}); await p(pg, 400);
  verif('1', await pg.evaluate(n => { try { return dr_apAbsentDeLHeure(n, S.heure); } catch (e) { return null; } }, absent), 'un élève marqué absent au clic droit (le 3e de la liste)'); }

if (T5ORD) { await t5Bloc('l\'heure ordinaire (la séance 2 lancée par la case)'); await terminer(); }
/* 2 — ▶ jusqu'au bout : le bouton absent tant qu'une diapo n'est pas faite */
dire(''); dire('2 — ▶ jusqu\'à la dernière diapo de la séance 1 : le bouton n\'apparaît qu\'à la fin');
let vusAvant = 0, montresAvant = 0, n = 0, x = await etat();
let fige = 0, diAv = null; while (n < 400) { x = await etat(); if (x.di === x.der) break; vusAvant++; if (x.bouton) montresAvant++; fige = x.di === diAv ? fige + 1 : 0; diAv = x.di; if (fige >= 40) { dire('  (▶ ne fait plus avancer : la diapo ' + x.di + ' reste, la dernière de l\'heure est ' + x.der + ')'); break; } await bdev(); n++; }   /* V3 : la sonde s'arrête et le dit, au lieu de tourner jusqu'à sa limite */
verif('2', vusAvant > 10 && montresAvant === 0, 'avant la dernière diapo, le bouton n\'est jamais là', vusAvant + ' états lus, bouton montré ' + montresAvant + ' fois');
/* sur la dernière diapo (le cahier de textes) : une diapo laissée non faite (on revient sur la précédente sans tout dévoiler ? non : on lit la règle) */
x = await attendre(pg, async () => { const y = await etat(); return y.bouton ? y : null; }, 3000) || await etat();
const faite = await pg.evaluate(() => { try { return dr_enchSeanceFaite(); } catch (e) { return null; } });
if (faite === false) dire('  (pas faites : ' + JSON.stringify(await pg.evaluate(() => { const E = seance().ecrans, o = ordreHeure(S.heure); return E.map((e, i) => ({ i, h: e && e.heure, role: e && e.role, dans: o.indexOf(i) >= 0, finie: !!(e && finie(e, i)), d: e && (decisionDe(e) || {}).choix, n: e ? elements(e).length : 0, vu: vuMax[K(i)] })).filter(x => !(x.role === 'fin' || x.role === 'reactivation' || x.finie || x.d === 'passee' || (+x.h || 1) < S.heure && !x.dans)); })) + ' · heure ' + (await pg.evaluate(() => S.heure)) + ')');
verif('2', x.di === x.der && faite === true && x.bouton, 'sur la dernière diapo, la séance entièrement faite : « ▶ Séance suivante dans cette heure » paraît', JSON.stringify({ di: x.di, der: x.der, faite, bouton: x.bouton }));
if (!x.bouton) dire('  (le bouton absent : ' + JSON.stringify(await pg.evaluate(() => { try { const ec = (typeof AT !== 'undefined' && AT && AT.edChap) || null; const c = typeof dr_classe === 'function' ? dr_classe() : null; return { visible: dr_enchVisible(), suivante: dr_enchSuivante(), prep: !!S.preparation, atelier: !!S.atelier, enFin: !!S.enFin, edChap: ec && { level: ec.level, chnum: ec.chnum }, classe: c && c.nom, snum: ATVUES.snum, file: (() => { try { return edtFileDAttente(c.nom, null).seances.map(s => s.__i); } catch (e) { return 'ERR ' + e.message; } })(), pas: (() => { try { const niv = edtNiveauDe(c.nom); const l = EDT_CHAP[niv] || []; const ch = l.filter(x => x && String(x.__cle) === String(ec.chnum))[0]; const se = ch && edtListe(ch.seances).filter(x => x && String(x.__i) === String(ATVUES.snum))[0]; window.EDT_FAITE_ICI = se; let f = null; try { f = edtFileDAttente(c.nom, ch.fil || null); } finally { window.EDT_FAITE_ICI = null; } return { niv, nch: l.length, ch: !!ch, se: !!se, f0: f && f.seances && f.seances[0] && f.seances[0].__i, memeObjet: f && f.seances[0] === se, chS: f && f.chapitre && f.chapitre.__cle, hj: (() => { try { return edtHeuresJouees(f.seances[1], c.nom); } catch (e) { return 'ERR ' + e.message; } })(), hp: (() => { try { return edtHeuresPour(f.seances[1], null); } catch (e) { return 'ERR ' + e.message; } })() }; } catch (e) { return 'ERR ' + e.message; } })() }; } catch (e) { return 'ERR ' + e.message; } })) + ')');   /* V3 : ce qui manque, dit */
const bulle = await pg.evaluate(() => { const b = document.getElementById('dr-ench'); return b ? b.title : ''; });
verif('2', bulle.indexOf(S2.slice(0, 20)) >= 0 && (MODE === 'rep' ? /répétition/.test(bulle) && /rien n’est écrit/.test(bulle) : /Clore l’heure/.test(bulle)),   /* V3 : en répétition, rien ne se clôt — l'infobulle le dit */ 'son infobulle dit ce qu\'il fait et la séance qui suit', bulle.slice(0, 160) + '…');
/* la règle « une diapo pas faite → pas de bouton » : une diapo remise non faite en mémoire (vuMax), relue, puis rendue */
const regle = await pg.evaluate(() => { if (typeof dr_enchSeanceFaite !== 'function') return { base: 'pas de bouton dans cette version' }; const E = seance().ecrans; const o = ordreHeure(S.heure); const i = E.findIndex((e, k) => e && !e.role && elements(e).length > 0 && o.indexOf(k) >= 0);   /* V2 : une diapo de l'heure qui tourne */ const k = K(i); const M = S.repetition ? S.repVu : vuMax;   /* V3 : en répétition, ce qui a été montré est à part (S.repVu) */ const v0 = M[k]; M[k] = 0; const f = dr_enchSeanceFaite(); M[k] = v0; return { i, sans: f, avec: dr_enchSeanceFaite() }; });
await p(pg, 700); verif('2', regle.sans === false && regle.avec === true, 'une diapo non faite : la séance n\'est pas faite (pas de bouton) ; refaite : elle l\'est', JSON.stringify(regle));
await capt(pg, MODE + '-1-le-bouton');

/* 3 — le clic */
if (MODE === 'temoin') {
  dire(''); dire('3 — le témoin : on clôt par « ■ Clore l\'heure », sans enchaîner');
  const Ht = (await etat()).H;
  await pg.click('#dr-clore').catch(() => {}); await p(pg, 1200); await pg.click('#f-clore').catch(() => {}); await p(pg, 800);
  if (await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return !!(g && g.classList.contains('on')); })) { await pg.click('#gclore-oui').catch(() => {}); await p(pg, 1500); }
  const y = await attendre(pg, async () => { const z = await etat(); return z.close || !z.lancee ? z : null; }, 8000) || await etat();
  verif('3', !(y.lancee && !y.close), 'l\'heure est close, rien ne se lance', JSON.stringify({ lancee: y.lancee, close: y.close, snum: y.snum }));
  const H1 = Ht ? lire(Ht.slice(0, Ht.lastIndexOf('/'))) : null;   /* V2 : le chemin de l'heure jouée (avant : un slug écrit en dur, qui ne la trouvait pas) */ const k1 = H1 ? Object.keys(H1) : [];
  verif('3', k1.length === 1 && H1[k1[0]].clos === true && !H1[k1[0]].seanceFaite, 'la trace de la séance 1 : close, sans `seanceFaite`', k1.join(',') + ' · ' + JSON.stringify({ clos: k1.length && H1[k1[0]].clos, seanceFaite: k1.length ? H1[k1[0]].seanceFaite : '-' }));
  verif('3', !lire('/site/3e/chapitres/0/seances/1/deroule_joue'), 'la séance 2 : rien d\'écrit');
  /* V2 : le témoin, base → après — ce que Paul voit, imprimé tel quel pour la comparaison (« TÉMOIN ») : la case du jour, la case suivante, la case ouverte, le récit relu */
  await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 2500);
  const tc = await pg.evaluate(() => Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).map(e => ({ o: (e.getAttribute('onclick') || '').match(/\d{4}-\d{2}-\d{2}/), t: (e.innerText || '').replace(/\s+/g, ' ') })).map(c => ({ iso: c.o ? c.o[0] : '', t: c.t })).sort((a, b) => a.iso.localeCompare(b.iso)));
  const t14 = tc.find(c => c.iso === '2026-09-14') || {}, tsv = tc.find(c => c.iso > '2026-09-14') || {};
  dire('  TÉMOIN case du jour : ' + t14.t); dire('  TÉMOIN case suivante : ' + tsv.iso + ' · ' + tsv.t);
  await pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (c) c.click(); }); await p(pg, 900);
  dire('  TÉMOIN case ouverte : ' + (await pg.evaluate(() => (document.querySelector('.edt-modale, #edt-modale') || document.body).innerText.replace(/\s+/g, ' ').replace(/\d{2}:\d{2}:\d{2}/g, '').replace(/(Absents de cette heure \(\d+ sur \d+\)).*$/, '$1 [la liste des élèves retirée]').slice(0, 400))));   /* aucun nom d'élève dans la sortie */
  await clicTexte(pg, 'button', 'Relire cette heure'); await p(pg, 5000);
  const tr = await pg.evaluate(() => ({ vue: ATVUES.vue, snum: String(ATVUES.snum), t: ((document.getElementById('rel') || {}).innerText || '').replace(/\s+/g, ' '), suite: !!document.getElementById('dr-ench-suite') && document.getElementById('dr-ench-suite').style.display !== 'none' }));
  dire('  TÉMOIN Relecture : vue ' + tr.vue + ' · séance ' + tr.snum + ' · ' + tr.t.length + ' car. · md5 ' + createHash('md5').update(tr.t).digest('hex') + ' · « La suite de cette heure » : ' + tr.suite);
  verif('3', tr.vue === 'relecture' && tr.snum === '0' && tr.t.length > 200 && !tr.suite, 'le témoin : « Relire cette heure » ouvre le récit de la séance 1, seul');
} else {
  dire(''); dire('3 — le clic : la séance 1 close, la séance 2 lancée dans cette heure');
  const tabEtats = []; const tabT = setInterval(() => { tb.evaluate(() => { const a = document.getElementById('ses-tab-att'); const m = (typeof DR_TAB !== 'undefined' && DR_TAB.montre) || null; return { att: !!(a && a.style.display !== 'none' && a.getBoundingClientRect().height > 0), eid: m && m.eid, seance: (typeof SES === 'object' && SES && SES.ctx && SES.ctx.seance) || null }; }).then(v => tabEtats.push(v)).catch(() => {}); }, 120);
  const tab0 = await tb.evaluate(() => { const m = (typeof DR_TAB !== 'undefined' && DR_TAB.montre) || null; return m && m.eid; });
  const H1path = (await etat()).H;
  await pg.evaluate(() => { window.__tClic = Date.now(); window.__infos = []; const f = window.atInfo; if (typeof f === 'function') window.atInfo = function (m) { window.__infos.push(String(m).replace(/<[^>]+>/g, '').slice(0, 160)); return f.apply(this, arguments); }; if (window.MJPC_TRACER) {} ['dr_lancer', 'dr_lancerNeuf', 'dr_lancerSuite', 'lancerHeure', 'dr_ouvertureLegere', 'ouvrirOuverture', 'dr_reprendre', 'dr_cloreHeureRestee', 'dr_reactPreparerAsync', 'dr_enchRepetition', 'arreterRepetition', 'lancerRepetition', 'atVuesAller', 'atEditerChapitre'].forEach(n => { const g = window[n]; if (typeof g === 'function') window[n] = function () { if (n === 'dr_lancer') { const L = window.dr_lire; window.dr_lire = function (c, cb) { window.__infos.push('lire ' + c.slice(-60)); return L.call(this, c, v => { window.__infos.push('lu ' + c.slice(-40) + ' = ' + JSON.stringify(v === undefined ? 'undef' : v).slice(0, 80)); try { cb(v); } catch (e) { window.__infos.push('ERREUR ' + e.message); throw e; } }); }; } window.__infos.push(n + '(' + Array.from(arguments).map(x => typeof x === 'function' ? 'fn' : JSON.stringify(x)).join(',').slice(0, 120) + ')'); try { const r = g.apply(this, arguments); if (n === 'lancerRepetition' || n === 'atVuesAller') { window.__infos.push(n + ' → S.repetition ' + !!S.repetition); [50, 300, 1000, 2000].forEach(t => setTimeout(() => window.__infos.push('+' + t + 'ms S.repetition ' + !!S.repetition + ' vue ' + (ATVUES && ATVUES.vue)), t)); } return r; } catch (e) { window.__infos.push('ERREUR ' + n + ' : ' + e.message); throw e; } }; }); const M0 = window.M8_TEST_STORE; window.M8_TEST_STORE = new Proxy(M0, { set(t, k, v) { if (/seances\/0\/deroule_joue/.test(k)) window.__m8.push('PROXY ' + k.replace(/^.*deroule_joue/, '') + ' ' + (v && typeof v === 'object' ? Object.keys(v).join(',').slice(0, 80) : JSON.stringify(v)) + ' @' + (new Error().stack.split('\n')[2] || '').replace(/^.*html[^:]*:/, '').slice(0, 30)); M0[k] = v; return true; }, deleteProperty(t, k) { if (/seances\/0\/deroule_joue/.test(k)) window.__m8.push('PROXYDEL ' + k); delete M0[k]; return true; } }); });
  if (process.env.MJPC_DIAG) await pg.evaluate(() => { window.__m8 = []; ['ecrire', 'patch', 'suppr'].forEach(n => { const g = M8T[n]; M8T[n] = function (c, v) { if (/seances\/0\/deroule_joue/.test(c)) window.__m8.push(n + ' ' + c.replace(/^.*deroule_joue/, '') + ' ' + (v && typeof v === 'object' ? Object.keys(v).join(',').slice(0, 120) : JSON.stringify(v))); return g.apply(this, arguments); }; }); });
  const kc = ECR.length; await pg.click('#dr-ench', { timeout: 8000 }).catch(() => dire('  (le bouton ne se clique pas)')); await p(pg, 900);
  const garde = await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return g && g.classList.contains('on') ? (document.getElementById('gclore-corps') || {}).innerText || '' : null; });
  if (garde != null) { dire('  la garde de « ■ Clore l\'heure » : ' + garde.replace(/\s+/g, ' ').slice(0, 200)); await capt(pg, MODE + '-2-la-garde'); await pg.click('#gclore-oui').catch(() => {}); }
  const y = await attendre(pg, async () => { const z = await etat(); return (MODE === 'rep' ? z.rep : z.lancee) && !z.close && z.snum === '1' ? z : null; }, 20000) || await etat();
  await p(pg, 2500); await gardes(pg); const y2 = await etat();
  if (process.env.MJPC_INFOS) dire('  (messages au pilote après le clic : ' + (await pg.evaluate(() => (window.__infos || []).filter(x => !/^lu? /.test(x)).join(' | ').slice(0, 1500))) + ' · S.repetition ' + (await pg.evaluate(() => !!S.repetition)) + ')');
  verif('3', (MODE === 'rep' ? y2.rep : y2.lancee) && !y2.close && y2.snum === '1' && (MODE === 'rep' ? y2.rep :   /* V3 : en répétition, « tourne » = S.repetition */ /Charles de Gaulle/.test(y2.cours || '')), 'la séance 2 tourne, même classe' + (MODE === 'rep' ? ' (en répétition)' : ''), JSON.stringify({ lancee: y2.lancee, close: y2.close, snum: y2.snum, heure: y2.heure, sur: y2.sur, rep: y2.rep, cours: y2.cours }));
  if (MODE !== 'rep') {
    verif('3', y2.heure === 1 && /\/seances\/1\/deroule_joue\/[^/]+\/heures\/2026-09-14_08h57-09h52_/.test(y2.H || ''), 'heure 1 de la séance 2, sur le même créneau (sa clé : le même jour, le même créneau, la même classe)', (y2.H || '').replace(/^.*\/heures\//, '…/heures/'));
    const ch1 = H1path.slice(0, H1path.lastIndexOf('/')); const H1 = await lireP(ch1); const k1 = H1 && typeof H1 === 'object' ? Object.keys(H1) : []; const h1 = (H1 && H1[H1path.slice(H1path.lastIndexOf('/') + 1)]) || {}; nS1 = (h1.activites || []).length;
    const dec = Object.values(h1.decisionsParEcran || {}).filter(d => d && d.choix === 'reporter').length;
    verif('3', k1.indexOf(H1path.slice(H1path.lastIndexOf('/') + 1)) >= 0 && k1.length <= (DEUX ? 2 : 1) && h1.clos === true && h1.seanceFaite === true && !!h1.finReel, 'la séance 1 close (son paquet entier : clos, fin réelle) et marquée faite', JSON.stringify({ cles: k1.length, clos: h1.clos, seanceFaite: h1.seanceFaite, finReel: !!h1.finReel, activites: (h1.activites || []).length }));
    if (process.env.MJPC_DIAG) dire('  (M8T : ' + (await pg.evaluate(() => (window.__m8 || []).join(' | '))) + ')');
    verif('3', dec === 0, 'rien de reporté', dec + ' décision « reporter »');
    H2path = y2.H; const H2 = await lireP(y2.H); verif('3', H2 && H2.classe === '3E Charles de Gaulle' && H2.creneau === '08:57-09:52' && !H2.clos, 'la trace de la séance 2 : la classe, le créneau, ouverte', JSON.stringify({ classe: H2 && H2.classe, creneau: H2 && H2.creneau, heure: H2 && H2.heure, sur: H2 && H2.sur, clos: H2 && H2.clos }));
    const jv = await pg.evaluate(() => { const E = seance().ecrans; return { n: J.length, premier: J[0] && J[0].type, hors: J.filter(x => x.type === 'diapo' && (x.di >= E.length || x.si !== S.si)).length, lanc: J.filter(x => x.type === 'lancement').length }; });
    verif('3', jv.hors === 0 && jv.lanc === 1, 'le journal de la séance 2 : rien de la séance 1, un seul lancement (son récit part du lancement, au clic)', JSON.stringify(jv));
    const abs2 = await pg.evaluate(n => { try { return dr_apAbsentDeLHeure(n, S.heure); } catch (e) { return null; } }, absent);
    const ap = H2 && H2.absentsPar ? Object.keys(H2.absentsPar).length : 0;
    verif('3', abs2 === true && ap === 1, 'l\'absent de la séance 1 est absent de la séance 2 (au pilote, et dans l\'appel de l\'heure)', 'pilote ' + abs2 + ' · absentsPar ' + ap + ' élève');
  } else {
    const site1 = JSON.stringify(lire('/site/3e')); verif('3', site1 === site0, 'en répétition, rien n\'est écrit pour la classe (/site/3e inchangé)');
  }
  /* le tableau distant : jamais l'écran d'attente pendant le passage */
  await attendre(tb, async () => { const t = await tb.evaluate(() => { const m = (typeof DR_TAB !== 'undefined' && DR_TAB.montre) || null; return m && m.eid; }); return t && t !== tab0 ? t : null; }, 9000);
  await p(tb, 1200); clearInterval(tabT);
  const tabFin = await tb.evaluate(() => { const a = document.getElementById('ses-tab-att'); const m = (typeof DR_TAB !== 'undefined' && DR_TAB.montre) || null; return { att: !!(a && a.style.display !== 'none' && a.getBoundingClientRect().height > 0), eid: m && m.eid, texte: ((document.getElementById('mur2') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 80) }; });
  const pil = await pg.evaluate(() => ({ eid: S.mur && S.mur.eid }));
  const attVu = tabEtats.filter(t => t.att).length;
  verif('3', attVu === 0 && !tabFin.att && tabFin.eid === pil.eid, 'le tableau distant passe à la séance 2 sans écran d\'attente', tabEtats.length + ' images lues pendant le passage, attente vue ' + attVu + ' fois · tableau « ' + tabFin.texte + ' » · même diapo que le pilote : ' + (tabFin.eid === pil.eid));
  await capt(pg, MODE + '-3-la-seance-2'); await capt(tb, MODE + '-4-le-tableau-seance-2');

  /* 4 — la séance 2 close à la fin du créneau (« ■ Clore l'heure »), puis l'emploi du temps */
  if (T5) await t5Bloc('la séance 2 enchaînée');
  else if (MODE !== 'rep') {
    dire(''); dire('4 — la séance 2 close, la case du jour, « Relire cette heure », la case suivante');
    await bdev(); await bdev();
    await pg.click('#dr-clore').catch(() => {}); await p(pg, 1200); await pg.click('#f-clore').catch(() => {}); await p(pg, 900);
    if (await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return !!(g && g.classList.contains('on')); })) { await pg.click('#gclore-oui').catch(() => {}); await p(pg, 1500); }
    const z = await attendre(pg, async () => { const w = await etat(); return w.close || !w.lancee ? w : null; }, 8000) || await etat();
    { const H2c = await lireP(H2path); const a2 = (H2c && H2c.activites) || []; const nE2 = (HUBN.site['3e'].chapitres[0].seances[1].deroule.ecrans || []).length; nS2 = a2.length; rS2 = Object.values((H2c && H2c.decisionsParEcran) || {}).filter(d => d && /^(reporter|suivante)$/.test(d.choix)).length; verif('4', H2c && H2c.clos === true && a2.length > 0 && a2.length <= nE2, 'la trace de la séance 2 close ne compte que ses diapos', (a2.length) + ' lignes · la séance 2 a ' + nE2 + ' diapos'); }
    verif('4', !(z.lancee && !z.close), 'la séance 2 close', JSON.stringify({ lancee: z.lancee, close: z.close }));
    await pg.evaluate(() => { try { edtFermer(); } catch (e) {} edtOuvrir(); }); await p(pg, 2500);
    const cases = await pg.evaluate(() => Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')).map(e => ({ o: (e.getAttribute('onclick') || '').match(/\d{4}-\d{2}-\d{2}/), t: (e.innerText || '').replace(/\s+/g, ' ') })).map(c => ({ iso: c.o ? c.o[0] : '', t: c.t })).sort((a, b) => a.iso.localeCompare(b.iso)));
    const c14 = cases.find(c => c.iso === '2026-09-14') || {}; const suiv = cases.find(c => c.iso > '2026-09-14') || {};
    verif('4', c14.t && c14.t.indexOf(S1.slice(0, 15)) >= 0 && c14.t.indexOf(' puis ') >= 0 && c14.t.indexOf(S2.slice(0, 15)) > c14.t.indexOf(' puis '), 'la case du jour : « séance 1 puis séance 2 »', c14.t);
    { const m = (c14.t || '').match(/Séance (\d+) : (\d+) diapos? jouées?( · (\d+) reportées?)? ; puis Séance (\d+) : (\d+) diapos? jouées?( · (\d+) reportées?)?/);
      verif('4', !!m && m[1] === '1' && +m[2] === nS1 && !m[4] && m[5] === '2' && +m[6] === nS2 && (+m[8] || 0) === rS2, 'la case du jour dit ce que chaque séance a fait, ses vrais nombres (« Séance 1 : … ; puis Séance 2 : … »)', (m ? m[0] : 'absent') + ' · au hub : séance 1 ' + nS1 + ' diapos, 0 reportée ; séance 2 ' + nS2 + ' diapos, ' + rS2 + ' reportée(s)'); }
    verif('4', suiv.t && suiv.t.indexOf(S2.slice(0, 15)) >= 0, 'la case suivante : la séance 2 qui continue', suiv.iso + ' · ' + (suiv.t || ''));
    await capt(pg, MODE + '-5-la-case');
    await pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-14') >= 0); if (c) c.click(); }); await p(pg, 900);
    const mod = await pg.evaluate(() => (document.querySelector('.edt-modale, #edt-modale') || document.body).innerText.replace(/\s+/g, ' ').match(/Séances : [^\n]{0,200}/));
    verif('4', !!mod && mod[0].indexOf(' puis ') > 0, 'la case ouverte : « Séances : … puis … »', mod ? mod[0].slice(0, 160) : 'absent');
    await capt(pg, MODE + '-6-la-case-ouverte');
    const r1 = await clicTexte(pg, 'button', 'Relire cette heure'); await p(pg, 5000);
    const v1 = await pg.evaluate(() => ({ vue: ATVUES.vue, snum: String(ATVUES.snum), suite: (() => { const b = document.getElementById('dr-ench-suite'); return b && b.style.display !== 'none' ? b.textContent : null; })() }));
    verif('4', r1 && v1.vue === 'relecture' && v1.snum === '0' && v1.suite && v1.suite.indexOf(S2.slice(0, 15)) >= 0, '« Relire cette heure » : le récit de la séance 1, puis « ▶ La suite de cette heure »', JSON.stringify(v1));
    { const t1 = await pg.evaluate(() => ((document.getElementById('rel') || {}).innerText || '').replace(/\s+/g, ' ')); const n1 = (t1.match(/<h2|Ce qu'on a fait aujourd'hui/g) || []).length; verif('4', t1.indexOf(S1.slice(0, 20)) >= 0 && t1.indexOf(S2.slice(0, 20)) < 0, 'le récit relu est celui de la séance 1 (son titre, pas celui de la séance 2)', t1.slice(0, 140)); }
    await capt(pg, MODE + '-7-relire-seance-1');
    await pg.click('#dr-ench-suite').catch(() => {}); await p(pg, 5000);
    const v2 = await pg.evaluate(() => ({ vue: ATVUES.vue, snum: String(ATVUES.snum) }));
    { const t2 = await pg.evaluate(() => ((document.getElementById('rel') || {}).innerText || '').replace(/\s+/g, ' ')); verif('4', t2.indexOf(S2.slice(0, 20)) >= 0 && t2.indexOf(S1.slice(0, 20)) < 0, 'puis le récit de la séance 2 (son titre)', t2.slice(0, 140)); }
    verif('4', v2.vue === 'relecture' && v2.snum === '1', '« ▶ La suite de cette heure » : le récit de la séance 2 (chacun sous sa séance)', JSON.stringify(v2));
    await capt(pg, MODE + '-8-relire-seance-2');
  }
}
async function terminer() {
const hors = ECR.slice(k0).filter(e => e.qui === 'pilote' && /^\/site\/3e\//.test(e.c)).length; dire(''); dire('écritures du pilote sous /site/3e : ' + hors + (MODE === 'test' || MODE === 'rep' ? ' (attendu : 0)' : ''));
if (MODE === 'test' || MODE === 'rep') verif('5', hors === 0, 'mode ' + MODE + ' : rien n\'est écrit pour la classe au hub');
if (MODE === 'rep') { const W = ECR.slice(k0).filter(e => e.qui === 'pilote'); const ch = [...new Set(W.map(e => e.m + ' ' + e.c.split('/').slice(0, 4).join('/')))]; const cl = W.filter(e => /deroule_joue|journal|parts|\/recit|reponses|participation|\/appel/.test(e.c)).length;   /* V3 : comme la sonde du bilan (B30), et l'appel ; `/presence/prof` est la présence du professeur, pas la classe */
  dire('  écritures du pilote pendant la répétition : ' + W.length + ' (' + (ch.join(' | ') || 'rien').slice(0, 300) + ')'); verif('5', cl === 0, 'en répétition : aucune écriture pour la classe (ni copie jouée, ni journal, ni participation, ni récit, ni appel)', cl + ' écriture(s) pour la classe sur ' + W.length); }
verif('5', errsP.length === 0 && T.errs.length === 0, 'aucune erreur de page', errsP.concat(T.errs).slice(0, 3).join(' | '));
dire(''); dire('bilan : ' + (nb - echecs) + '/' + nb + (echecs ? ' — ' + echecs + ' échec(s)' : ''));
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
}
await terminer();
