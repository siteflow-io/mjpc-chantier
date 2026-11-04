// LA SONDE DE LA MESURE M (MANDATS/DEROULE-01-11/NUIT-04-11/M-DEUX-MESURES-633-634.md) — mesurer, rien corriger. Le harnais (le faux hub rangé comme le
// vrai, qui refuse les clés interdites ; aucune adresse réelle) est repris de CORRECTIFS/sonde-correctifs.mjs ; ajouté : le compte des demandes de plein écran.
//  M1 · (633) « Question-bilan » (un bloc question) : geste 1 la frappe dans l'Atelier ; geste 2 la frappe dans l'Atelier ouvert pendant l'heure (la copie de
//       la classe) ; geste 3 un glisser depuis la barre du bloc jusqu'à la fin de la question, Ctrl+C, Ctrl+V : les mots de la barre comptés au faux hub.
//  M2 · (634) le tableau distant `?vue=tableau` et la fenêtre « Ouvrir le tableau » : double clic, Échap, clic, touche, fenêtre réduite : comptés.
// usage : node sonde-mesure-m.mjs <index.html assemblé> [dossier-de-sortie] · MJPC_PARTIES (défaut M1,M2)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-mesure-m.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1400) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'M1,M2').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1920x1080').split(',').map(t => t.split('x').map(Number));
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const MEDIAS = process.env.MJPC_MEDIAS && fs.existsSync(process.env.MJPC_MEDIAS) ? process.env.MJPC_MEDIAS : null;
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
dire('C16 · sonde de la mesure M (633, 634) · faux hub rangé comme le vrai, qui refuse les clés interdites (HTTP 400) · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · md5 ' + md5(FICHIER) + (MEDIAS ? ' · images de 3e : un dossier local' : ' · images : celle du canon'));

/* ── la séance 1 du faux hub (comme sonde-fin.mjs) : dans l'heure 1, « Tableau 2 » devient un schéma (un tableau, une carte) si demandé ── */
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const store = (src = null, retouche = null, forme = 'tableau') => { const st = storeOuverture(RACINE, { champs: true }); const ch = st.site['3e'].chapitres[0];
  const E = ch.seances[sk0(st)[0]].deroule.ecrans; const t2 = E.find(e => e && e.act === 'Tableau 2');
  if (t2 && src) { t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme, id: 'bsonde-tab', titre: 'Les cinq tableaux', src }]; }
  if (retouche) retouche(E, st); return st; };

/* ── le faux hub partagé (Node), RANGÉ COMME LE VRAI (la règle de QUATRE-DETTES/sonde-dettes.mjs et de DERNIERES-DETTES/sonde-fin.mjs : une valeur nulle,
   une liste ou un objet vides ne sont pas rangés ; une liste est rangée en objet aux clés « 0 », « 1 »… et relue en liste selon la règle de Firebase ; les
   clés d'un objet relues triées) ET QUI REFUSE LES CLÉS INTERDITES, COMME LE VRAI (documentation de Firebase Realtime Database, « Structure your data » :
   « keys … cannot contain ., $, #, [, ], /, or ASCII control characters 0-31 or 127 » ; le SDK 8.10.1 refuse aussi la clé vide — `INVALID_KEY_REGEX_`) :
   HTTP 400 et rien n'est rangé. ── */
let HUBN = null; let ECR = []; const REFUSES = []; let REFUSER = true;   /* REFUSER = false : rangé comme le vrai, sans le refus des clés (la partie K, « sans ») */
const CLE_KO = /[.#$\[\]\/\u0000-\u001F\u007F]/;
const cleFautive = (v, ch) => { if (v && typeof v === 'object') for (const k of Object.keys(v)) { if (k === '' || CLE_KO.test(k)) return ch + '/' + k; const r = cleFautive(v[k], ch + '/' + k); if (r) return r; } return null; };
const refusDe = (m, c, bd) => { const segs = c.split('/').filter(Boolean); const s = segs.find(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x)); if (s) return 'adresse « ' + c + ' »';
  if (m === 'PATCH' && bd && typeof bd === 'object') { for (const k of Object.keys(bd)) { const q = k.split('/'); if (q.some(x => x === '' && q.length > 1) || q.some(x => /[.#$\[\]\u0000-\u001F\u007F]/.test(x))) return 'clé de tête « ' + k + ' »'; const r = cleFautive(bd[k], c + '/' + k); if (r) return r; } return null; }
  return cleFautive(bd, c); };
const ranger = v => { if (v === null || v === undefined) return undefined; if (typeof v === 'number' && !isFinite(v)) return undefined; if (typeof v !== 'object') return v;
  const o = {}; (Array.isArray(v) ? v.map((x, i) => [String(i), x]) : Object.entries(v)).forEach(([k, x]) => { const r = ranger(x); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; };
const relire = v => { if (v === null || v === undefined || typeof v !== 'object') return v; const K = Object.keys(v).sort(); const o = {}; K.forEach(k => { o[k] = relire(v[k]); });
  if (K.length && K.every(k => /^(0|[1-9]\d*)$/.test(k))) { const max = Math.max(...K.map(Number)); if (K.length * 2 > max + 1) { const a = new Array(max + 1).fill(null); K.forEach(k => { a[+k] = o[k]; }); return a; } } return o; };
const lireH0 = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const lireH = c => { const n = lireH0(c); return n == null ? null : relire(n); };
const posH = (c, v) => { const q = c.split('/').filter(Boolean); v = ranger(v); if (v === undefined) v = null; let n = HUBN; const pile = [n]; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) { if (v === null) return; n[q[k]] = {}; } n = n[q[k]]; pile.push(n); }
  if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v;
  if (v === null) for (let k = q.length - 2; k >= 0; k--) { if (pile[k + 1] && typeof pile[k + 1] === 'object' && !Object.keys(pile[k + 1]).length) delete pile[k][q[k]]; else break; } };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') return JSON.stringify(lireH(c)); let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {}
  const ko = REFUSER ? refusDe(m, c, bd) : null; if (ko) { REFUSES.push({ qui, m, c, ko, t: Date.now() }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; couldn\'t parse key beginning at ' + ko + '. Keys must not contain \'/\', \'.\', \'#\', \'$\', \'[\', or \']\'' }); }
  ECR.push({ qui, m, c, t: Date.now(), bd });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; if (MEDIAS) { const f = path.join(MEDIAS, m[2]); if (fs.existsSync(f)) return f; } return IMG_OUV[m[2]] || IMG_DEFAUT; };
const typeDe = f => /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00', jour = '2026-09-14' }) => {
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch); await ctx.addInitScript(() => { window.__PE = 0; const o0 = Element.prototype.requestFullscreen; if (o0) Element.prototype.requestFullscreen = function () { window.__PE++; return o0.apply(this, arguments); }; }); /* M2 : chaque demande de plein écran, comptée */
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(new Date(jour + 'T' + h + ':00+02:00'));
  await pg.goto('file://' + fichier + q, { waitUntil: 'load' }); await p(1800);
  if (prof) await profPrep(pg, test);
  return { ctx, pg, errs, boites, qui }; };
const profPrep = async (pg, test) => { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
  await pg.click('#tprof-btn').catch(() => {}); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; }); };
const capt = async (pg, nom) => { if (CAPT && pg) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const lancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return false; x.click(); return true; }, jour); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
const reprendre = async o => { const pg = o.pg; const b = await pg.waitForSelector('#ses-reprise-oui', { state: 'visible', timeout: 9000 }).then(() => pg.click('#ses-reprise-oui')).then(() => true).catch(() => false);
  if (!b) return false; await p(3500); await pg.keyboard.press('Escape'); await p(400); return true; };
const ouvrirTableau = async (o, W = 1280, H = 720) => { if (!(await o.pg.isVisible('#bvideoproj').catch(() => false))) return null; const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
const ouvrirAtelier = async o => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'atelierOuvrir()'))) await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(3000); };
const ici_ = pg => pg.evaluate(() => { const c = document.getElementById('compte'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {} return { eid, di: typeof S !== 'undefined' ? S.di : null, compte: c ? c.textContent.trim() : '', numero: ((document.getElementById('numero') || {}).textContent || '').replace(/\s+/g, ' ').trim() }; });
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, role: e.role || '', act: e.act, heure: e.heure, types: (e.blocs || []).map(b => b && b.t) })); } catch (e) { return []; } });
const lignesX = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: ((d.querySelector('.t') || d).textContent || '').replace(/\s+/g, ' ').trim() })));
const garde = async pg => { if (await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on')))) { await pg.click('#garde-devant').catch(() => {}); await p(900); } };
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); await garde(pg);
  for (let k = 0; k < 20 && (await ici_(pg)).eid !== eid; k++) await p(200); return (await ici_(pg)).eid === eid; };
const toutDevoiler = async (pg, eid) => { await pg.click('#numero').catch(() => {}); for (let k = 0; k < 14; k++) { const s2 = await ici_(pg); if (s2.eid !== eid || /^(\d+) \/ \1 dévoilés|rien à dévoiler|vidéo/.test(s2.compte)) break; await pg.keyboard.press('ArrowRight'); await p(300); } await p(900); };
const sansErreur = (k, errs, quoi) => verif(k, !errs.length, quoi + ' : aucune erreur JS, aucune boîte système', errs.join(' ; '));
const texteDe = (pg, sel) => pg ? pg.evaluate(sel => { const m = document.querySelector(sel); return m ? (m.innerText || '').replace(/\s+/g, ' ').trim() : null; }, sel).catch(() => null) : Promise.resolve(null);
const temoins = pg => pg.evaluate(() => { const s = document.getElementById('dr-session'); const b = document.getElementById('mjpc-echecs-bandeau');
  return { session: s ? s.textContent.trim() : null, sessionKo: !!(s && s.classList.contains('dr-session-ko')), bandeau: !!(b && b.style.display !== 'none' && b.classList.contains('mjpc-bandeau-echec')), bandeauT: b ? (b.innerText || '').replace(/\s+/g, ' ').slice(0, 160) : '' }; });
/* écrire en direct dans un texte de la diapo du pilote : un clic, la fin du texte, la frappe, Échap */
const corriger = async (pg, sel, ajout) => { const x = await pg.$('#mur ' + sel); if (!x) return false; await x.click(); await p(300); await pg.keyboard.press('Control+End'); await pg.keyboard.type(ajout, { delay: 20 }); await p(300); await pg.keyboard.press('Escape'); await p(400); return true; };
/* attendre qu'une condition tienne (jusqu'à `ms`) */
const attendre = async (f, ms = 6000) => { const t0 = Date.now(); let v = null; while (Date.now() - t0 < ms) { v = await f(); if (v) return v; await p(300); } return v; };

const lignesSur = (t, re) => t.split(/(?=Schéma « |Tableau « |Diapo « |Diapo trop pleine|Des mots de l’écran)/).filter(x => re.test(x) && !/sans numéro d’activité|sans numéro d'activité/.test(x)).map(x => x.slice(0, 420));
const QB = 'emt9v3yqo6pvd5', AN = 'emt9v3yqoecf9d';   /* « Question-bilan » (un bloc question) ; « Analyse d'images : la routine » (une consigne) */
const BARRE = 'BLOC 1 · QUESTION · 1 ÉLÉMENT▲▼+ étape✕';
const trameQB = () => { const k = sk0(HUBN)[0]; const E = (lireH('/site/3e/chapitres/0/seances/' + k + '/deroule') || {}).ecrans || []; const L = Array.isArray(E) ? E : Object.values(E); const e = L.find(x => x && x.eid === QB) || {}; const b = (e.blocs || [])[0] || {}; return String(b.txt != null ? b.txt : (b.q || '')); };
const allerAtelier = async (pg, re) => { const L = await lignesX(pg); const y = L.find(e => re.test(e.t)); if (!y) return false; await (await pg.$('#volet [data-eid="' + y.eid + '"] .t')).click(); await p(1200); return true; };
const aRegler = async pg => { await pg.click('#at-regler').catch(() => {}); await p(1800); const t = await pg.evaluate(() => { const z = Array.from(document.querySelectorAll('.choix-obj, #at-regler-liste, .at-regler, [id*="regler"]')).filter(x => x.offsetParent !== null).map(x => x.innerText || '').join(' ‖ '); return z.replace(/\s+/g, ' '); }); await pg.keyboard.press('Escape').catch(() => {}); await p(300); return t; };

/* ═══ M1 · (633) d'où viennent les mots de la barre du bloc dans un texte rangé : trois gestes, comptés au faux hub ═══ */
const BR = /BLOC \d+ · [A-ZÀ-ÖØ-Ý]+ · \d+ ÉLÉM/; const BRG = new RegExp(BR.source, 'g');
const compteHub = () => (JSON.stringify(HUBN).match(BRG) || []).length;
const ecrSalies = () => ECR.filter(w => w.m !== 'GET' && BR.test(JSON.stringify(w.bd))).map(w => w.c.replace(/\/site\/3e\/chapitres\/0\/seances\/[^/]+/, '/…séance 1').slice(0, 90));
const bilanM1 = (nom, avant) => { const n = compteHub(); const ch = [...new Set(ecrSalies())]; dire('      M1 · ' + nom + ' : au hub, ' + n + ' fois les mots de la barre (avant le geste : ' + avant + ') ; écritures qui les portent : ' + ecrSalies().length + ' ; écritures en tout : ' + ECR.filter(w => w.m !== 'GET').length + ', dont « Et vous ? » : ' + ECR.filter(w => w.m !== 'GET' && /Et vous \?/.test(JSON.stringify(w.bd))).length + (ch.length ? ' — ' + ch.join(' · ') : '')); return n - avant; };
const taperQuestion = async pg => { const q = await pg.$('#mur p.q[data-p$=".t"]'); if (!q) return false; await q.click(); await p(500); await pg.keyboard.press('End'); await pg.keyboard.type(' Et vous ?', { delay: 25 }); await p(3500);
  const dans = await pg.evaluate(() => { const q = document.querySelector('#mur p.q[data-p$=".t"]'); return !!(q && q.querySelector('.bloc-barre')); }); await pg.keyboard.press('Escape').catch(() => {}); await pg.mouse.click(5, 5).catch(() => {}); await p(2500); return { dans }; };
if (joue('M1')) { dire(''); dire('══ M1 · (633) 1536×864 · « Question-bilan » (un bloc question) : la frappe dans l’Atelier, la frappe dans l’Atelier pendant l’heure, le copier-coller depuis la barre ══');
  /* geste 1 : l'Atelier hors de l'heure, un clic dans la question, la frappe → la trame */
  { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; const a0 = compteHub(); const o = await ouvrir({}); await ouvrirAtelier(o); const ok = await allerAtelier(o.pg, /Question-bilan$/); const r = ok ? await taperQuestion(o.pg) : null;
    const d = bilanM1('geste 1 (Atelier, hors de l’heure, frappe « Et vous ? »)', a0); dire('      M1 · geste 1 : barre posée DANS la question pendant la frappe : ' + (r && r.dans) + ' ; la trame lue : « ' + trameQB().slice(-120) + ' »');
    verif('M1', ok && r, 'geste 1 joué', ''); dire('      M1 · RÉSULTAT geste 1 : ' + d + ' fois de plus'); sansErreur('M1', o.errs.concat(o.boites), 'geste 1'); await o.ctx.close(); }
  /* geste 2 : l'heure lancée (la case de l'emploi du temps), l'onglet Atelier ouvert pendant l'heure, la même frappe → la copie de la classe */
  { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; const a0 = compteHub(); const o = await ouvrir({}); const l = await lancerClasse(o);
    await o.pg.evaluate(() => { const b = document.getElementById('ong-atelier'); window.__ong = b ? (b.offsetParent !== null ? 'visible' : 'caché') : 'absent'; if (b && b.offsetParent !== null) b.click(); else if (typeof voir === 'function') voir('atelier'); }); await p(3000);
    const enC = await o.pg.evaluate(() => 'onglet ' + window.__ong + ', S.atelier ' + S.atelier + ', régime ' + AT_DR_REGIME + ', en classe ' + dr_atelierEnClasse()).catch(e => String(e));
    const ok = await allerAtelier(o.pg, /Question-bilan$/); const r = ok ? await taperQuestion(o.pg) : null;
    const d = bilanM1('geste 2 (heure lancée, onglet Atelier pendant l’heure, frappe « Et vous ? »)', a0); dire('      M1 · geste 2 : heure lancée ' + l + ' · l’Atelier en classe : ' + enC + ' · barre DANS la question : ' + (r && r.dans));
    verif('M1', l && ok && r, 'geste 2 joué', ''); dire('      M1 · RÉSULTAT geste 2 : ' + d + ' fois de plus'); sansErreur('M1', o.errs.concat(o.boites), 'geste 2'); await o.ctx.close(); }
  /* geste 3 : l'Atelier, la barre visible, un glisser de la souris depuis « BLOC 1 » jusqu'à la fin de la question, Ctrl+C, un clic à la fin de la question, Ctrl+V */
  for (const mode of ['barre', 'dessous']) { HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; const a0 = compteHub(); const o = await ouvrir({}); await o.ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {}); await ouvrirAtelier(o); const pg = o.pg; const ok = await allerAtelier(pg, /Question-bilan$/);
    const q = await pg.$('#mur p.q[data-p$=".t"]'); if (q) { await q.click(); await p(600); }
    const bx = await pg.evaluate(() => { const n = document.querySelector('#mur .bloc-barre .nom'); const q = document.querySelector('#mur p.q[data-p$=".t"]'); if (!n || !q) return null; const a = n.getBoundingClientRect(), b = q.getBoundingClientRect(); const c = (q.closest('.bloc-edit') || q.parentElement).getBoundingClientRect(); return { x0: a.left + 2, y0: a.top + a.height / 2, x1: b.right - 3, y1: b.bottom - 6, xq: b.left + 1, yq: b.top + 4, xs: c.left + 40, ys: c.bottom + 14 }; });
    if (bx && mode === 'dessous') { bx.x0 = bx.xq; bx.y0 = bx.yq; bx.x1 = bx.xs; bx.y1 = bx.ys; }   /* depuis le début de la question jusque sous le bloc : la barre est le dernier enfant du bloc */
    let sel = '', presse = '', colle = false;
    if (bx) { await pg.mouse.move(bx.x0, bx.y0); await pg.mouse.down(); await pg.mouse.move(bx.x1, bx.y1, { steps: 12 }); await pg.mouse.up(); await p(300); sel = await pg.evaluate(() => String(getSelection())); await pg.keyboard.press('Control+C'); await p(300);
      presse = await pg.evaluate(() => navigator.clipboard.readText().catch(e => 'illisible : ' + e)).catch(e => 'illisible'); const q2 = await pg.$('#mur p.q[data-p$=".t"]'); if (q2) { await q2.click(); await p(300); await pg.keyboard.press('End'); await pg.keyboard.press('Control+V'); colle = true; await p(3500); }
      await pg.keyboard.press('Escape').catch(() => {}); await pg.mouse.click(5, 5).catch(() => {}); await p(2500); }
    dire('      M1 · geste 3 (' + mode + ') : la barre trouvée ' + !!bx + ' · la sélection porte les mots de la barre : ' + BR.test(sel) + ' (« ' + sel.replace(/\s+/g, ' ').slice(0, 90) + ' ») · le presse-papiers : ' + BR.test(presse) + ' (« ' + String(presse).replace(/\s+/g, ' ').slice(0, 90) + ' »)');
    const d = bilanM1('geste 3 (' + mode + ' : ' + (mode === 'barre' ? 'glisser depuis « BLOC 1 » jusqu’à la fin de la question' : 'glisser du début de la question jusque sous le bloc') + ', Ctrl+C, Ctrl+V à la fin de la question)', a0); dire('      M1 · geste 3 (' + mode + ') : la trame lue : « ' + trameQB().slice(-160) + ' »');
    verif('M1', ok && bx && colle, 'geste 3 (' + mode + ') joué', ''); dire('      M1 · RÉSULTAT geste 3 (' + mode + ') : ' + d + ' fois de plus'); sansErreur('M1', o.errs.concat(o.boites), 'geste 3'); await o.ctx.close(); } }

/* ═══ M2 · (634) la fenêtre du tableau et le tableau distant : le double clic, le plein écran, la taille ═══ */
const etatT = pg => pg.evaluate(() => { const m = document.querySelector('.mur.tableau') || document.querySelector('#mur2') || document.querySelector('.mur'); const r = m ? m.getBoundingClientRect() : null; const de = document.documentElement;
  return { demandes: window.__PE || 0, plein: !!(document.fullscreenElement || document.webkitFullscreenElement), fen: innerWidth + '×' + innerHeight, mur: r ? Math.round(r.width) + '×' + Math.round(r.height) + ' (droite ' + Math.round(r.right) + ', bas ' + Math.round(r.bottom) + ')' : 'aucun', deborde: !!r && (r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || de.scrollWidth > innerWidth + 1 || de.scrollHeight > innerHeight + 1) }; }).catch(e => ({ err: String(e).slice(0, 120) }));
const ligneT = (qui, quoi, e) => dire('      M2 · ' + qui + ' · ' + quoi + ' : demandes de plein écran ' + e.demandes + ' · plein écran ' + e.plein + ' · fenêtre ' + e.fen + ' · tableau ' + e.mur + ' · déborde ' + e.deborde + (e.err ? ' · ' + e.err : ''));
if (joue('M2')) { dire(''); dire('══ M2 · (634) « Ouvrir le tableau » et le tableau distant `?vue=tableau` : double clic, Échap, clic, puis la fenêtre réduite ══');
  HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0;
  const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1200);
  const o = await ouvrir({}); const l = await lancerClasse(o); const fen = await ouvrirTableau(o, 1100, 640); await p(2500);
  dire('      M2 · heure lancée ' + l + ' · fenêtre « Ouvrir le tableau » : ' + (fen ? fen.url().replace(/^.*\//, '…/') : 'aucune'));
  /* le tableau distant (l'ordi du vidéoprojecteur) */
  const T0 = await etatT(T.pg); ligneT('distant', 'ouvert', T0);
  await T.pg.mouse.dblclick(640, 360); await p(900); const T1 = await etatT(T.pg); ligneT('distant', 'double clic', T1);
  await T.pg.evaluate(() => document.exitFullscreen && document.fullscreenElement ? document.exitFullscreen() : null).catch(() => {}); await p(600); const T2 = await etatT(T.pg); ligneT('distant', 'sorti du plein écran (Échap)', T2);
  await T.pg.mouse.click(640, 360); await p(900); const T3 = await etatT(T.pg); ligneT('distant', 'un seul clic ensuite', T3);
  await T.pg.evaluate(() => document.exitFullscreen && document.fullscreenElement ? document.exitFullscreen() : null).catch(() => {}); await p(400); await T.pg.keyboard.press('a'); await p(900); const T4 = await etatT(T.pg); ligneT('distant', 'Échap puis une touche', T4);
  await T.pg.evaluate(() => document.exitFullscreen && document.fullscreenElement ? document.exitFullscreen() : null).catch(() => {}); await p(400);
  await T.pg.setViewportSize({ width: 900, height: 500 }); await p(1500); const T5 = await etatT(T.pg); ligneT('distant', 'fenêtre réduite à 900×500', T5);
  await T.pg.setViewportSize({ width: 1280, height: 720 }); await p(1500); const T6 = await etatT(T.pg); ligneT('distant', 'fenêtre remise à 1280×720', T6);
  verif('M2', T1.demandes >= 1 && T1.plein, 'distant : le double clic met le navigateur en plein écran (une demande dès le premier clic)', T1);
  verif('M2', T3.demandes > T1.demandes, 'distant : sorti par Échap, le clic suivant redemande le plein écran', { avant: T1.demandes, apres: T3.demandes, plein: T3.plein });
  verif('M2', !T5.deborde && T5.mur !== T0.mur, 'distant : hors plein écran, le tableau suit la taille de la fenêtre (900×500)', T5);
  /* la fenêtre « Ouvrir le tableau » (sur l'ordi du professeur) */
  if (fen) { const F0 = await etatT(fen); ligneT('fenêtre', 'ouverte', F0); await fen.mouse.dblclick(550, 320); await p(900); const F1 = await etatT(fen); ligneT('fenêtre', 'double clic', F1);
    await fen.setViewportSize({ width: 800, height: 450 }); await p(1500); const F2 = await etatT(fen); ligneT('fenêtre', 'réduite à 800×450', F2);
    verif('M2', F1.demandes === 0 && !F1.plein, 'fenêtre « Ouvrir le tableau » : le double clic ne demande pas le plein écran', F1);
    verif('M2', !F2.deborde && F2.mur !== F0.mur, 'fenêtre « Ouvrir le tableau » : le tableau suit la taille de la fenêtre (800×450)', F2); }
  sansErreur('M2', T.errs.concat(T.boites, o.errs, o.boites), 'M2'); await T.ctx.close(); await o.ctx.close(); }

dire(''); dire('BILAN · ' + nb + ' vérifications · ' + echecs + ' échec(s)'); fs.writeFileSync(path.join(OUT, 'sonde-mesure-m-' + path.basename(path.dirname(FICHIER)) + '-' + path.basename(FICHIER, '.html') + '.txt'), R.join('\n') + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
