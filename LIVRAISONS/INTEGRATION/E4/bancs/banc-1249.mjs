// E4 · LE BANC §12.49 + §12.50 PAR LE GESTE — « Déposer en ligne » par le relais ; le Drive retiré du site.
// Un FAUX RELAIS du banc (jamais le vrai) : l'adresse du relais (MJPC_RELAIS_URL) est posée sur une fausse adresse script.google.com servie par le banc —
// une page qui dit « prêt », reçoit le paquet, le vérifie comme le vrai (types par les premiers octets, 25 Mo), « l'écrit » (en mémoire du banc) et répond
// le chemin ; mjpc-medias est servi par le banc depuis cette mémoire.
// A100 : « + image » → « ⇪ Déposer en ligne… » avec une image réaliste (2414 px) : le chemin s'écrit, l'image arrive réduite à 1920 px, la diapo la montre en ligne ;
//        un PDF réaliste glissé sur une séance : la ligne créée s'ouvre sur le PDF en ligne ; un .exe et un fichier de 60 Mo refusés en le disant ;
//        sans réseau, le bouton dit pourquoi ; aucune clé GitHub ni du relais dans le navigateur ni la page (la clé du coffre est permise).
// A101 : le fichier glissé part par le relais, jamais vers le Drive ; « Lier » accepte une adresse web et refuse un lien Drive en le disant ;
//        la visionneuse ouvre un PDF et une page ; aucun mot « Drive » sur les écrans du prof aux quatre tailles ; aucune demande vers drive.google.com
//        ni googleusercontent.com.
// usage : node banc-1249.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_TAILLES, MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1249.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..', '..');
const HUB = path.resolve(process.env.MJPC_HUB || path.join(RACINE, 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1707x743,1920x1080').split(',').map(t => t.split('x').map(Number));
const CAPT = process.env.MJPC_CAPT || null; const SUFF = process.env.MJPC_CAPT_SUFFIXE || 'apres'; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const AIDE = path.join(RACINE, 'MANDATS', 'CINQ-DETTES', 'AIDE-PAR-ECRAN.md');
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const info = (k, quoi) => dire('  info   ' + k + ' · ' + quoi);
const p = (pg, ms) => pg.waitForTimeout(ms);
/* MJPC_CAS=29,41 : ne jouer que ces cas (39, 41 — avec 40 et 43 —, 43, 46, 29, 30, R, 42, 51, 50, 49, 33, 32, 34, 35 ; 63 seulement s'il est nommé) */
const SEUL = process.env.MJPC_CAS ? process.env.MJPC_CAS.split(',') : null; const fait = k => !SEUL || SEUL.includes(k);

/* ── le faux hub (celui de banc-1227), plus la classe « 3 DYLAN Bob » appariée à ses six cases (mission 0, M1) ── */
const hubStore = () => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {}
  if (!st.classes['3 DYLAN Bob']) { st.classes['3 DYLAN Bob'] = { nom: '3 DYLAN Bob', niveau: '3e', archivee: false, eleves: JSON.parse(JSON.stringify((st.classes['CLASSE TEST'] || {}).eleves || [])) };
    ((st.site.edt.grille['2026-2027'] || {}).creneaux || []).forEach(x => { if (x.classe === '3 DYLAN Bob' && !x.classeMjpc) x.classeMjpc = '3 DYLAN Bob'; }); }
  return st; };
const fauxHub = s => { let sv = null; try { sv = localStorage.getItem('__E3HUB28'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { localStorage.setItem('__E3HUB28', JSON.stringify(window.__HUB)); } catch (e) {} };
  /* le hub vit dans localStorage : deux onglets d'un même navigateur (un même contexte) lisent le même hub, comme le vrai */
  const lire = c => { try { const sv2 = localStorage.getItem('__E3HUB28'); if (sv2) window.__HUB = JSON.parse(sv2); } catch (e) {} const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { try { const sv2 = localStorage.getItem('__E3HUB28'); if (sv2) window.__HUB = JSON.parse(sv2); } catch (e) {} const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrirCtx = async (W, H, st, zoom) => { const z = zoom || 1; const ctx = await nav.newContext({ viewport: { width: Math.round(W / z), height: Math.round(H / z) }, deviceScaleFactor: z, timezoneId: 'Europe/Paris' });   /* zoom du navigateur z : la page voit W/z × H/z pixels CSS (comme Ctrl + / Ctrl -) */ const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort()); await ctx.addInitScript(fauxHub, st || hubStore());
  ctx.on('page', q => { q.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); q.on('dialog', d => { if (d.type() === 'beforeunload') { q.__beforeunload = (q.__beforeunload || 0) + 1; d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(HORLOGE);
  /* un second onglet lit le même hub : une page file:// neuve voit parfois un localStorage vide (3 fois sur 16 mesurées) — on lui donne le hub du premier à sa création */
  const np = ctx.newPage.bind(ctx); ctx.newPage = async () => { const q = await np(); const v = await pg.evaluate(() => localStorage.getItem('__E3HUB28')).catch(() => null); if (v) await q.addInitScript(x => { try { if (!localStorage.getItem('__E3HUB28')) localStorage.setItem('__E3HUB28', x); } catch (e) {} }, v); return q; };
  return { ctx, pg, errs, boites }; };
const entrerProf = async pg => { await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2200); await sansVoiles(pg); };
const edtOuvert = pg => pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); });
/* lancer par la case de l'emploi du temps (la case des De Gaulle « heure 1/3 ») : « ▶ Ouvrir le pilotage et lancer » */
const lancerParLaCase = async pg => { if (!(await edtOuvert(pg))) { await pg.evaluate(() => { try { edtOuvrir(); } catch (e) {} }); await p(pg, 1800); } await pg.evaluate(() => { try { edtVue('semaine'); } catch (e) {} }); await p(pg, 600);
  const ok = await pg.evaluate(() => { const cs = Array.from(document.querySelectorAll('#edt-ecran .edt-clic')).filter(e => e.offsetParent && /Charles/.test(e.innerText)); const c = cs.find(e => /heure 1\//.test(e.innerText)) || cs[0]; if (!c) return false; c.click(); return true; }); await p(pg, 900);
  const l = ok && await pg.evaluate(() => { const b = Array.from(document.querySelectorAll('button')).find(b => b.offsetParent && /Ouvrir le pilotage et lancer/.test(b.innerText)); if (!b) return false; b.click(); return true; }); await p(pg, 3500); await sansVoiles(pg); await pg.keyboard.press('Escape'); await p(pg, 400);
  return !!l && await pg.evaluate(() => !!(window.S && S.lancee)); };
/* la répétition : depuis l'Atelier, « ▶ Jouer en avance » (§12.33 : la seule entrée) ; l'onglet « Pilotage » de l'Atelier, s'il existe encore (la ⑤) */
const entrerRepetition = async q => { await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1200);
  const j = await q.evaluate(() => { const b = document.getElementById('at-jouer'); if (!b || !b.offsetParent) return false; b.click(); return true; }); if (!j) await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(q, 1800); return q.evaluate(() => !!(window.S && S.repetition)); };
/* ouvrir le chapitre (le premier, ou celui dont le titre est donné) dans l'Atelier */
const ouvrirAtelier = async (q, titre) => { await q.evaluate(() => { try { edtFermer(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(q, 1200); await sansVoiles(q); if (await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); return !!(b && b.offsetParent); })) { await q.evaluate(() => document.querySelector('.at-onglet[data-vue="structure"]').click()); await p(q, 900); await clicTexte(q, 'button', '← Mes chapitres'); await p(q, 900); }   /* l'Atelier rouvre le dernier chapitre : revenir à la liste */ await clicTexte(q, 'button,[onclick]', "atOnglet('chapitres')"); await p(q, 900);
  if (titre) { const ok = await q.evaluate(t => { const c = Array.from(document.querySelectorAll('body *')).filter(e => e.offsetParent && e.children.length < 40 && (e.innerText || '').indexOf(t) >= 0 && Array.from(e.querySelectorAll('button,[onclick]')).some(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || ''))); const e = c[c.length - 1]; if (!e) return false; const b = Array.from(e.querySelectorAll('button,[onclick]')).find(b => /Éditer dans l’atelier|Modifier/.test(b.innerText || '')); b.click(); return true; }, titre); if (!ok) return false; }
  else if (!(await clicTexte(q, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(q, 'button,[onclick]', 'Modifier');
  await p(q, 1800); await sansVoiles(q); await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(q, 1500); return q.evaluate(() => !!(window.S && S.atelier)); };
const dev = async (pg, n) => { for (let i = 0; i < n; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); } };
const OUT = SORTIE || '.'; fs.mkdirSync(OUT, { recursive: true });
/* la séance 1 du chapitre 3e : sa « Question-bilan » (heure 1, la dernière diapo avant le cahier de textes) déclarée de rôle bilan, comme Paul le fait dans « Ce que la diapo déclare » */
const stBilan = () => { const st = hubStore(); const ch = st.site['3e'].chapitres; const c0 = Array.isArray(ch) ? ch[0] : ch[Object.keys(ch)[0]]; const se = Array.isArray(c0.seances) ? c0.seances[0] : c0.seances['0']; const E = se.deroule.ecrans; const k = E.map(e => e.act).indexOf('Question-bilan'); E[k].role = 'bilan'; /* la classe proposée à 9 h (3 DYLAN Bob, §12.38 (1) pas encore codé) reçoit, dans ce banc, la liste d'une vraie classe — chez E3 elle porte celle de « CLASSE TEST », et le banc ne verrait rien */ if (st.classes['3 DYLAN Bob'] && st.classes['3E Charles de Gaulle']) st.classes['3 DYLAN Bob'].eleves = JSON.parse(JSON.stringify(st.classes['3E Charles de Gaulle'].eleves)); return st; };
const aller = async (q, titre) => { const ok = await q.evaluate(t => { const E = seance().ecrans; const i = E.findIndex(e => e.act === t || e.role === t); if (i < 0) return -1; const v = document.querySelector('#volet .vig[data-i="' + i + '"]') || document.querySelector('[data-at-di="' + i + '"]'); if (v && v.offsetParent) v.click(); else { S.di = i; dr_tout(); } return i; }, titre); await p(q, 700); await q.evaluate(() => { const g = document.getElementById('garde'); if (g && g.classList.contains('on')) document.getElementById('garde-devant').click(); }); await p(q, 500);
  await q.evaluate(() => { const d = etatDiapo(); const n = elements(ecran()).length; while (d.nDev < n) { const b = document.getElementById('bdev'); if (!b) break; const av = d.nDev; b.click(); if (etatDiapo().nDev === av) break; } }).catch(() => {}); await p(q, 500); return ok; };
const TEST = ['DURAND Alice', 'BERNARD Emma', 'PETIT Thomas', 'ROBERT Chloé'];
const VRAIS = (() => { const c = JSON.parse(fs.readFileSync(path.join(HUB, 'classes.json'), 'utf8')); const out = new Set(); Object.entries(c).forEach(([k, v]) => { if (k === 'CLASSE TEST') return; (v.eleves || []).forEach(e => { const n = typeof e === 'string' ? e : (e.nomComplet || ''); if (/^[A-ZÉÈ][A-ZÉÈ' -]+ [A-ZÉÈ][a-zéèëïîôç-]+/.test(n)) out.add(n); }); }); return [...out]; })();
const FAUX = 'https://script.google.com/macros/s/FAUX-RELAIS-DU-BANC/exec';
const IMG = fs.readFileSync(path.join(RACINE, 'PONT', 'TABLEAU-DISTANT', 'lotE', 'tests', 'E-deux-murs.png'));
const PDF = fs.readFileSync(path.join(RACINE, 'MANDATS', 'MAQUETTE-QCM-COMPLETE', 'livret-maquette-qcm-v5.pdf'));
const STOCK = new Map(); const RESEAU = []; let APPELS = 0;
const typeDe = b => b[0] === 0xFF && b[1] === 0xD8 && b[2] === 0xFF ? 'jpg' : b[0] === 0x89 && b.slice(1, 4).toString() === 'PNG' ? 'png' : /^GIF8[79]a/.test(b.slice(0, 6).toString()) ? 'gif' : b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP' ? 'webp' : b.slice(0, 5).toString() === '%PDF-' ? 'pdf' : null;
const nettoyer = n => String(n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'fichier';
const relaisFaux = paquet => { APPELS++; const niv = ['6e', '5e', '4e', '3e'].includes(paquet.niveau) ? paquet.niveau : 'divers'; const out = [];
  for (const f of paquet.fichiers || []) { const b = Buffer.from(f.b64 || '', 'base64'); const t = typeDe(b); if (!t) return { ok: false, raison: '« ' + f.nom + ' » refusé par le relais (type).' }; if (b.length > 25 * 1048576) return { ok: false, raison: 'trop lourd' };
    let n = '2026-09-14-' + nettoyer(f.nom), c = 'depots/' + niv + '/' + n + '.' + t, k = 2; while (STOCK.has(c)) c = 'depots/' + niv + '/' + n + '-' + (k++) + '.' + t; STOCK.set(c, { b, t }); out.push({ chemin: c, nom: f.nom, taille: b.length }); }
  return { ok: true, depots: out }; };
const PAGE_RELAIS = `<!doctype html><meta charset="utf-8"><body>faux relais du banc<script>var op=window.opener;window.addEventListener('message',function(ev){if(!ev.data||ev.data.mjpcRelais!=='paquet')return;window.__relaisFaux(ev.data.paquet).then(function(r){op.postMessage(r.ok?{mjpcRelais:'fait',depots:r.depots}:{mjpcRelais:'refus',raison:r.raison},'*');});});op.postMessage({mjpcRelais:'pret'},'*');</script></body>`;
const MIME = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', pdf: 'application/pdf' };
const brancher = async ctx => { await ctx.exposeFunction('__relaisFaux', relaisFaux);
  ctx.on('request', r => RESEAU.push(r.url()));
  await ctx.route(u => String(u).startsWith(FAUX), r => r.fulfill({ status: 200, contentType: 'text/html', body: PAGE_RELAIS }));
  await ctx.route(u => String(u).startsWith('https://siteflow-io.github.io/mjpc-medias/'), r => { const c = decodeURIComponent(r.request().url().replace('https://siteflow-io.github.io/mjpc-medias/', '').split('?')[0]); const s = STOCK.get(c); if (!s) return r.fulfill({ status: 404, body: 'absent' }); return r.fulfill({ status: 200, contentType: MIME[s.t], headers: { 'access-control-allow-origin': '*' }, body: s.b }); });
  await ctx.route(u => String(u).startsWith('https://exemple-de-page.fr/'), r => r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Une page</title><h1>Une page web</h1>' })); };
const relaisPose = pg => pg.evaluate(f => { try { MJPC_RELAIS_URL = f; return MJPC_RELAIS_URL === f; } catch (e) { return false; } }, FAUX);
const toast = pg => pg.evaluate(() => ((document.getElementById('mjpc-upload-toast') || {}).textContent || ''));
const attendreToast = async (pg, re) => { for (let k = 0; k < 40; k++) { const t = await toast(pg); if (re.test(t)) return t; await p(pg, 250); } return await toast(pg); };
const W0 = 1707, H0 = 743;
{ const { ctx, pg, errs, boites } = await ouvrirCtx(W0, H0, stBilan()); await brancher(ctx); await entrerProf(pg);
  const pose = await relaisPose(pg); verif('A100', pose, 'le faux relais du banc est posé (MJPC_RELAIS_URL)', String(pose));
  /* ── A100 (1) « + image » → « ⇪ Déposer en ligne… » ── */
  await ouvrirAtelier(pg); await p(pg, 1000); await relaisPose(pg);
  await pg.evaluate(() => { const b = document.getElementById('at-image'); if (b) b.click(); }); await p(pg, 700);
  const aBouton = await pg.evaluate(() => !!(document.getElementById('of-depot') && document.getElementById('of-depot').offsetParent));
  let chemin = '', msg = '';
  if (aBouton) { const [fc] = await Promise.all([pg.waitForEvent('filechooser', { timeout: 5000 }).catch(() => null), pg.click('#of-depot')]); if (fc) await fc.setFiles({ name: 'Les deux murs.png', mimeType: 'image/png', buffer: IMG });
    for (let k = 0; k < 40 && !chemin; k++) { await p(pg, 250); chemin = await pg.evaluate(() => (document.getElementById('of-src') || {}).value || ''); } msg = await pg.evaluate(() => (document.getElementById('of-err') || {}).textContent || ''); }
  const s = STOCK.get(chemin); const dim = s ? { w: s.b.readUInt32BE(16), h: s.b.readUInt32BE(20) } : null;
  verif('A100', aBouton && /^depots\/3e\/2026-09-14-les-deux-murs\.png$/.test(chemin) && dim && dim.w === 1920, '« ⇪ Déposer en ligne… » dans « + image » : l’image (2414 px) part par le relais, réduite à 1920 px, son chemin s’écrit (« ' + chemin + ' »)', JSON.stringify({ bouton: aBouton, chemin, dim, msg }));
  await pg.evaluate(() => { const b = document.getElementById('of-ok'); if (b) b.click(); }); await p(pg, 1500);
  const vue = await pg.evaluate(c => { const im = Array.from(document.querySelectorAll('#mur img')).find(i => (i.currentSrc || i.src).indexOf(c) >= 0); return im ? { src: im.currentSrc || im.src, w: im.naturalWidth } : null; }, chemin);
  verif('A100', vue && vue.src === 'https://siteflow-io.github.io/mjpc-medias/' + chemin && vue.w === 1920, 'la diapo montre l’image à son adresse en ligne (mjpc-medias), chargée', JSON.stringify(vue));
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A100-' + SUFF + '-image-deposee.png') });
  /* ── A100 (2) le PDF glissé sur une séance (A101 : par le relais, jamais vers le Drive) ── */
  await pg.evaluate(() => { try { atelierFermer(true); } catch (e) {} try { edtFermer(); } catch (e) {} }); await p(pg, 900);
  for (let k = 0; k < 2; k++) { await pg.evaluate(() => { const c = document.querySelector('[data-level="3e"]'); if (c) c.click(); }); await p(pg, 900); } await relaisPose(pg);
  const glisser = (nom, type, b64, taille) => pg.evaluate(({ nom, type, b64, taille }) => { const sb = document.querySelector('#chapters-dynamic .seance-block[data-seance-num]'); if (!sb) return false; let octets; if (b64) { const bin = atob(b64); octets = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) octets[i] = bin.charCodeAt(i); } else { octets = new Uint8Array(taille); octets.set([0x25, 0x50, 0x44, 0x46, 0x2D]); } const dt = new DataTransfer(); dt.items.add(new File([octets], nom, { type })); sb.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); return true; }, { nom, type, b64, taille });
  const a0 = APPELS; const g1 = await glisser('Livret QCM.pdf', 'application/pdf', PDF.toString('base64')); const t1 = await attendreToast(pg, /Nouvel item créé|⚠/);
  const item = await pg.evaluate(() => { const c = window.__hubLire('/site/3e/chapitres'); const out = []; JSON.stringify(c, (k, v) => { if (v && typeof v === 'object' && v.source === 'external' && /mjpc-medias\/depots\//.test(v.ref || '')) out.push(v); return v; }); return out[0] || null; });
  verif('A100', g1 && APPELS === a0 + 1 && /Nouvel item créé/.test(t1) && item && /\/depots\/3e\/2026-09-14-livret-qcm\.pdf$/.test(item.ref) && STOCK.get('depots/3e/2026-09-14-livret-qcm.pdf').b.length === PDF.length, 'le PDF réaliste glissé sur une séance part par le relais : une ligne « Livret QCM » liée à son adresse en ligne, le PDF intact', JSON.stringify({ toast: t1, item }));
  if (item) { await pg.evaluate(u => openViewer('Livret QCM', u), item.ref); await p(pg, 1200); }
  const v1 = await pg.evaluate(() => { const f = document.getElementById('doc-viewer-frame'); return { vis: document.getElementById('doc-viewer').classList.contains('visible'), src: f.src }; });
  verif('A101', item && v1.vis && v1.src === item.ref, 'la visionneuse ouvre le PDF en ligne', JSON.stringify(v1));
  await pg.evaluate(() => { try { closeViewer(); } catch (e) { document.getElementById('doc-viewer').classList.remove('visible'); } }); await p(pg, 400);
  await pg.evaluate(() => openViewer('Une page', 'https://exemple-de-page.fr/page.html')); await p(pg, 1000);
  const v2 = await pg.evaluate(() => { const f = document.getElementById('doc-viewer-frame'); let t = ''; try { t = f.contentDocument.body.innerText; } catch (e) { t = '(autre origine)'; } return { vis: document.getElementById('doc-viewer').classList.contains('visible'), src: f.src, t }; });
  verif('A101', v2.vis && v2.src === 'https://exemple-de-page.fr/page.html', 'la visionneuse ouvre une page web', JSON.stringify(v2));
  await pg.evaluate(() => { try { closeViewer(); } catch (e) { document.getElementById('doc-viewer').classList.remove('visible'); } }); await p(pg, 400);
  /* ── A100 (3) refusés en le disant : un .exe, un fichier de 60 Mo ── */
  const a1 = APPELS; await glisser('outil.exe', 'application/octet-stream', Buffer.from('MZ\x90\x00\x03\x00\x00\x00 programme').toString('base64')); const t2 = await attendreToast(pg, /⚠/);
  verif('A100', /n’est ni une image .* ni un PDF/.test(t2) && APPELS === a1, 'un .exe glissé : refusé en le disant, rien n’est parti', t2);
  await p(pg, 2700); const a2 = APPELS; await glisser('enorme.pdf', 'application/pdf', null, 60 * 1048576); const t3 = await attendreToast(pg, /⚠/);
  verif('A100', /trop lourd \(60 Mo\) : 25 Mo au plus/.test(t3) && APPELS === a2, 'un fichier de 60 Mo glissé : refusé en le disant (25 Mo au plus), rien n’est parti', t3);
  /* ── A100 (4) sans réseau, le bouton dit pourquoi ── */
  await p(pg, 2700); await ctx.setOffline(true); await p(pg, 300); const a3 = APPELS; await glisser('Livret QCM.pdf', 'application/pdf', PDF.toString('base64')); const t4 = await attendreToast(pg, /⚠/);
  await ouvrirAtelier(pg); await p(pg, 800); await pg.evaluate(() => { const b = document.getElementById('at-image'); if (b) b.click(); }); await p(pg, 600); await pg.evaluate(() => { const b = document.getElementById('of-depot'); if (b) b.click(); }); await p(pg, 400);
  const t5 = await pg.evaluate(() => (document.getElementById('of-err') || {}).textContent || ''); await ctx.setOffline(false);
  verif('A100', /Pas de connexion internet/.test(t4) && /Pas de connexion internet/.test(t5) && APPELS === a3, 'sans réseau : le glisser et le bouton « ⇪ Déposer en ligne… » disent pourquoi, rien ne part', JSON.stringify({ glisser: t4, bouton: t5 }));
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A100-' + SUFF + '-sans-reseau.png') });
  await pg.evaluate(() => { try { atelierFermer(true); } catch (e) {} }); await p(pg, 800);
  /* ── A100 (5) aucune clé GitHub ni du relais dans le navigateur ni dans la page ── */
  const cles = await pg.evaluate(() => { const re = /ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gho_[A-Za-z0-9]{20,}|GITHUB_CLE\s*[:=]\s*['"][^'"]+/; const out = []; for (const st of [localStorage, sessionStorage]) for (let i = 0; i < st.length; i++) { const k = st.key(i), v = st.getItem(k) || ''; if (re.test(k + ' ' + v)) out.push(k); } if (re.test(document.documentElement.outerHTML)) out.push('la page'); return out; });
  const fichierCles = /ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}/.test(fs.readFileSync(FICHIER, 'utf8')) || /ghp_[A-Za-z0-9]{20,}|github_pat_/.test(fs.readFileSync(path.join(RACINE, 'LIVRAISONS', 'INTEGRATION', 'E4', 'relais', 'depot.gs'), 'utf8'));
  verif('A100', !cles.length && !fichierCles, 'aucune clé GitHub ni du relais dans le stockage du navigateur, la page, le fichier du site, le relais .gs', JSON.stringify({ navigateur: cles, fichiers: fichierCles }));
  /* ── A101 « Lier » : une adresse web acceptée, un lien Drive refusé en le disant ── */
  const it = await pg.evaluate(() => { const c = chapitresData['3e']; for (const ch of Object.keys(c || {})) for (const sk of Object.keys((c[ch] || {}).seances || {})) for (const ik of Object.keys(c[ch].seances[sk].items || {})) { const x = c[ch].seances[sk].items[ik]; if (x && !x.ref && x.kind !== 'gallery') return [ch, sk, ik]; } return null; });
  let lier = {};
  if (it) { await pg.evaluate(a => linkItem('3e', a[0], a[1], a[2]), it); await p(pg, 700); const txt = await pg.evaluate(() => document.getElementById('link-modal').innerText);
    await pg.fill('#link-modal-url', 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz012345/view'); await pg.evaluate(() => linkModalApplyUrl()); await p(pg, 500);
    const refus = await pg.evaluate(() => (document.getElementById('at-modale') || {}).innerText || ''); await pg.evaluate(() => { const m = document.getElementById('at-modale'); if (m) m.remove(); });
    const hub1 = await pg.evaluate(a => (window.__hubLire('/site/3e/chapitres/' + a[0] + '/seances/' + a[1] + '/items/' + a[2]) || {}).ref || '', it);
    await pg.evaluate(a => { const m = document.getElementById('link-modal'); if (!m || getComputedStyle(m).display === 'none' || !m.offsetParent && !m.classList.contains('visible')) linkItem('3e', a[0], a[1], a[2]); document.getElementById('link-modal-url').value = 'https://exemple-de-page.fr/page.html'; }, it); await pg.evaluate(() => linkModalApplyUrl()); await p(pg, 1200);
    const hub2 = await pg.evaluate(a => window.__hubLire('/site/3e/chapitres/' + a[0] + '/seances/' + a[1] + '/items/' + a[2]) || {}, it);
    lier = { refus, hub1, hub2: { source: hub2.source, ref: hub2.ref }, motDrive: /\bDrive\b/.test(txt) }; }
  verif('A101', it && /vient du Drive : le site ne lie plus le Drive/.test(lier.refus) && !lier.hub1, '« Lier » refuse un lien Drive en le disant ; rien n’est écrit', JSON.stringify(lier));
  verif('A101', it && lier.hub2.source === 'external' && lier.hub2.ref === 'https://exemple-de-page.fr/page.html' && !lier.motDrive, '« Lier » accepte une adresse web ; la fenêtre « Lier » ne dit plus « Drive »', JSON.stringify(lier));
  verif('A101', errs.length === 0 && !boites.length, 'zéro erreur JS, aucune boîte du navigateur', JSON.stringify({ errs: errs.slice(0, 3), boites })); await ctx.close(); }
/* ── A101 aucun mot « Drive » sur les écrans du prof, aux quatre tailles ── */
for (const [W, H] of TAILLES) { const T = W + ' × ' + H; const { ctx, pg, errs } = await ouvrirCtx(W, H, stBilan()); await brancher(ctx); const vus = [];
  const regarder = async nom => { const t = await pg.evaluate(() => document.body.innerText); const m = t.match(/.{0,40}\bDrive\b.{0,40}/); vus.push(nom + (m ? ' ✘ « ' + m[0].replace(/\s+/g, ' ') + ' »' : '')); return !m; };
  try { await entrerProf(pg); let ok = true; ok = await regarder('emploi du temps') && ok;
    await pg.evaluate(() => { try { edtFermer(); } catch (e) {} }); await p(pg, 600); ok = await regarder('accueil') && ok;
    for (let k = 0; k < 2; k++) { await pg.evaluate(() => { const c = document.querySelector('[data-level="3e"]'); if (c) c.click(); }); await p(pg, 900); } ok = await regarder('page du niveau') && ok;
    await pg.evaluate(() => { const b = document.getElementById('tprof-btn'); if (b) b.click(); }); await p(pg, 900); await sansVoiles(pg); ok = await regarder('panneau prof') && ok;
    await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} try { atelierOuvrir(); } catch (e) {} }); await p(pg, 1200); await sansVoiles(pg); ok = await regarder('Atelier') && ok;
    await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900); ok = await regarder('Mes chapitres') && ok;
    await ouvrirAtelier(pg); await p(pg, 900); ok = await regarder('chapitre, vue Atelier') && ok;
    await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="structure"]'); if (b) b.click(); }); await p(pg, 900); ok = await regarder('chapitre, vue Structure') && ok;
    await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 900); await pg.evaluate(() => { const b = document.getElementById('at-image'); if (b) b.click(); }); await p(pg, 600); ok = await regarder('« + image »') && ok;
    verif('A101', ok, T + ' · aucun mot « Drive » sur les écrans du prof', vus.join(' · '));
  } catch (e) { verif('A101', false, T + ' · le parcours n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
  await ctx.close(); }
const versDrive = RESEAU.filter(u => /drive\.google\.com|googleusercontent\.com/.test(u));
verif('A101', !versDrive.length, 'aucune demande vers drive.google.com ni googleusercontent.com dans le réseau du banc (' + RESEAU.length + ' demandes)', versDrive.slice(0, 3).join(' '));
await nav.close();
dire(`— fin : ${nb} vérifications · ${echecs} échec(s) — ${echecs ? 'ROUGE' : 'VERT'} · ${path.basename(FICHIER)} md5 ${MD5}`);
fs.writeFileSync(path.join(OUT, 'banc-1249.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
