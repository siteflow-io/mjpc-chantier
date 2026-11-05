// C16 mandat T · LE TABLEAU EN ATTENDANT UNE HEURE (MANDATS/DEROULE-01-11/APRES-8860/T-L-ECRAN-D-ATTENTE-DU-TABLEAU.md) — le harnais de EX/bancs/sonde-1266.mjs (lignes 13-51, reprises telles quelles).
// Le tableau seul (`?vue=tableau`, 1920×1080), aucune heure lancée, la montre à 09:00:50 (lundi 14/09) : ce qu'il montre, l'animation (écart moyen entre images),
// l'heure qui change à la minute, les écritures au hub pendant l'attente, la clé USB cliquable, les anneaux sur l'heure quand la fenêtre change de taille.
// usage : MJPC_CAPT=<dossier> MJPC_DSF=2 node sonde-attente.mjs <assemble/index.html> [sortie.txt]. Code 1 si un échec. Aucun nom d'élève.
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
  const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); await pg.clock.setFixedTime(HORLOGE);
  await pg.goto(URL0 + q, { waitUntil: 'load' }); return { ctx, pg, errs, boites }; };
const sansVoiles = pg => pg.evaluate(() => { ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }).catch(() => {});
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const gardes = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (m && m.getBoundingClientRect().height > 0) m.querySelectorAll('button').forEach(x => { if (/^(Compris|OK)$/.test(x.textContent.trim())) x.click(); }); const g = document.getElementById('garde'); if (g && g.classList.contains('on')) { const d = document.getElementById('garde-devant'); if (d) d.click(); } }).catch(() => {});
const capt = async (pg, nom) => { if (CAPT) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const ecritsDepuis = k => ECR.slice(k).map(e => e.qui + ' ' + e.m + ' ' + e.c);

const DSF = +process.env.MJPC_DSF || 1;
const T0 = new Date('2026-09-14T09:00:50+02:00');
const ctx = await nav.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: DSF, timezoneId: 'Europe/Paris' }); const errs = [];
await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre('tableau', m, c, corps)); await ctx.addInitScript(fauxFetch);
const tb = await ctx.newPage(); tb.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); await tb.clock.setFixedTime(T0);
dire('sonde de l\'écran d\'attente (mandat T) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5 + ' · la montre à 09:00:50 (lundi 14/09) · 1920×1080');
await tb.goto(URL0 + '?vue=tableau', { waitUntil: 'load' });
/* MJPC_FONTE=<dossier des woff2 d'EB Garamond> : pour la capture seulement, la police du site (Google Fonts, coupé ici) servie en local, comme la maquette v3 */
if (process.env.MJPC_FONTE) { const F = process.env.MJPC_FONTE; await tb.addStyleTag({ content: "@font-face{font-family:'EB Garamond';src:url('file://" + F + "/eb-garamond-latin-400-normal.woff2') format('woff2');font-weight:400}@font-face{font-family:'EB Garamond';src:url('file://" + F + "/eb-garamond-latin-500-normal.woff2') format('woff2');font-weight:500 700}" }); }
await p(tb, 3000);
const k0 = ECR.length, t0 = Date.now(); dire('écritures du tableau au chargement (avant l\'attente mesurée) : ' + (ecritsDepuis(0).join(' ; ') || 'aucune'));
const lireAtt = () => tb.evaluate(() => { const q = s => document.querySelector(s), t = s => { const e = q(s); return e ? (e.textContent || '').trim() : null; }, fs = s => { const e = q(s); return e ? parseFloat(getComputedStyle(e).fontSize) : null; };
  const att = q('#ses-tab-att'), h = q('#ses-tab-h'), hr = h.getBoundingClientRect(); const an = Array.from(document.querySelectorAll('#anim-calme .anneau')).map(r => { const b = r.getBoundingClientRect(); return Math.round(Math.hypot(b.left + b.width / 2 - (hr.left + hr.width / 2), b.top + b.height / 2 - (hr.top + hr.height / 2))); });
  const cle = q('#ses-tab-cle'); let cleClic = null; if (cle) { const b = cle.getBoundingClientRect(); const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); cleClic = !!(e && e.closest && e.closest('#ses-tab-cle')); }
  const c = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  return { vis: !!(att && att.getBoundingClientRect().height > 0 && getComputedStyle(att).display !== 'none'), n: t('#ses-tab-att .n'), sous: t('#ses-tab-att .sous'), h: t('#ses-tab-h'), d: t('#ses-tab-d'), c: t('#ses-tab-c'), bas: t('#mjpc-bas'),
    fsN: fs('#ses-tab-att .n'), fsSous: fs('#ses-tab-att .sous'), fsH: fs('#ses-tab-h'), coulSous: q('#ses-tab-att .sous') ? getComputedStyle(q('#ses-tab-att .sous')).color : null, an, cleClic, centre: c ? (c.id || (c.closest('[id]') || {}).id) : null,
    ligneS: (() => { const i = q('#ses-tab-att .ligne i'), an = i && i.getAnimations ? i.getAnimations()[0] : null; const pr = an && an.effect ? an.effect.getComputedTiming().progress : null; return pr === null ? null : Math.round(pr * 600) / 10; })(), nAnim: document.getAnimations().filter(a => a.effect && a.effect.target && a.effect.target.closest && a.effect.target.closest('#ses-tab-att')).length, W: innerWidth, H: innerHeight }; });
dire(''); dire('1 — le tableau ouvert, aucune heure lancée');
const a1 = await lireAtt(); dire('  lu : ' + JSON.stringify(a1));
verif('1', a1.vis && a1.n === 'MJPC' && a1.sous === 'Cours de français - M. Meney' && a1.bas === 'monsieurjaipascompris', 'l\'écran d\'attente : « MJPC », « Cours de français - M. Meney », « monsieurjaipascompris » en bas', [a1.n, a1.sous, a1.bas].join(' | '));
verif('1', a1.fsN < a1.fsSous && a1.fsSous < a1.fsH, '« MJPC » plus petit que « Cours de français - M. Meney », l\'heure la plus grande', 'polices ' + [a1.fsN, a1.fsSous, a1.fsH].map(x => (x || 0).toFixed(1)).join(' < ') + ' px');
verif('1', /^\d\d:\d\d$/.test(a1.h || '') && !!a1.d, 'l\'heure et la date', a1.h + ' · ' + a1.d + ' · classe : ' + a1.c);
verif('1', a1.an.length === 2 && a1.an.every(x => x <= 1), 'les deux anneaux sur le centre de l\'heure', 'écart ' + a1.an.join(' et ') + ' px');
verif('1', a1.cleClic !== false, 'la ligne de la clé USB reste cliquable (rien ne la couvre)', String(a1.cleClic));
verif('1', /ses-tab-h/.test(String(a1.centre)), 'l\'heure au centre de l\'écran', String(a1.centre));
const couvre = await tb.evaluate(() => { const b = document.getElementById('mjpc-bas'), c = document.getElementById('ses-tab-cle'); if (!b || !c) return null; b.style.pointerEvents = 'auto'; const r = c.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); b.style.pointerEvents = ''; return e ? (e.id || e.className) : null; });
dire('  (la maquette v3 telle quelle, « monsieurjaipascompris » prenant les clics : au centre de la ligne de la clé, ' + couvre + ' — d\'où #mjpc-bas{pointer-events:none})');
verif('1', a1.ligneS !== null && Math.abs(a1.ligneS - 50) <= 2, 'la ligne de la minute suit les secondes de la montre (09:00:50)', 'remplie à ' + a1.ligneS + ' s sur 60');
if (CAPT) await tb.screenshot({ path: path.join(CAPT, 'attente.png') });
dire(''); dire('2 — l\'animation bouge (écart moyen entre images, 6 images à 1 s, écran entier en 960×540)');
const imgs = []; for (let k = 0; k < 6; k++) { imgs.push(await tb.screenshot({ type: 'png', scale: 'css', clip: { x: 0, y: 0, width: 1920, height: 1080 } })); await p(tb, 1000); }
const dos = path.join(path.dirname(SORTIE || '.'), 'images-' + MD5.slice(0, 8)); fs.mkdirSync(dos, { recursive: true }); imgs.forEach((b, k) => fs.writeFileSync(path.join(dos, 'i' + k + '.png'), b));
const { execFileSync } = await import('node:child_process');
const ecart = +execFileSync('python3', ['-I', '-c', 'import sys,glob\nfrom PIL import Image,ImageChops,ImageStat\nf=sorted(glob.glob(sys.argv[1]+"/i*.png"));im=[Image.open(x).convert("RGB").resize((960,540)) for x in f]\nv=[sum(ImageStat.Stat(ImageChops.difference(im[k],im[k+1])).mean)/3 for k in range(len(im)-1)]\nprint(round(sum(v)/len(v),2))', dos]).toString().trim();
verif('2', ecart > 1, 'l\'animation bouge', 'écart moyen entre images : ' + ecart + ' (la v3 : 4,8 ; un écran fixe : 0)');
dire(''); dire('3 — l\'heure change à la minute');
const h0 = (await lireAtt()).h; await tb.clock.setFixedTime(new Date(T0.getTime() + 12000)); await p(tb, 1600); const h1 = (await lireAtt()).h;
const l1 = (await lireAtt()).ligneS; verif('3', h0 === '09:00' && h1 === '09:01', 'la montre passe 09:01 : l\'heure du tableau suit', h0 + ' → ' + h1);
verif('3', l1 !== null && l1 <= 4, 'la ligne de la minute repart avec la nouvelle minute (09:01:02)', 'remplie à ' + l1 + ' s sur 60');
dire(''); dire('4 — les écritures au hub pendant l\'attente');
await p(tb, Math.max(0, 31000 - (Date.now() - t0)));   /* 31 s d'attente au moins : deux fois le pas de la clé USB (15 s) */
const ec = ecritsDepuis(k0), cle = ec.filter(x => x === 'tableau PUT /site/cle_vue'), autres = ec.filter(x => x !== 'tableau PUT /site/cle_vue');
verif('4', autres.length === 0, 'l\'écran d\'attente n\'écrit rien au hub', autres.length + ' écriture(s) en ' + Math.round((Date.now() - t0) / 1000) + ' s' + (autres.length ? ' : ' + autres.join(' ; ') : ''));
dire('  (à part, comme avant : la clé USB du tableau dit ce qu\'elle voit toutes les 15 s, /site/cle_vue, §12.44 — ' + cle.length + ' fois en ' + Math.round((Date.now() - t0) / 1000) + ' s ; jamais en mode test)');
dire(''); dire('5 — la fenêtre réduite puis agrandie : les anneaux restent sur l\'heure');
await tb.setViewportSize({ width: 1280, height: 720 }); await p(tb, 800); const a5 = await lireAtt();
await tb.setViewportSize({ width: 1920, height: 1080 }); await p(tb, 800); const a6 = await lireAtt();
verif('5', a5.an.length === 2 && a5.an.every(x => x <= 1) && a6.an.every(x => x <= 1), 'les anneaux sur le centre de l\'heure, réduite et agrandie', '1280×720 : ' + a5.an.join(' et ') + ' px · 1920×1080 : ' + a6.an.join(' et ') + ' px');
verif('5', errs.length === 0, 'aucune erreur de la page', errs.join(' | '));
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
if (SORTIE) fs.writeFileSync(SORTIE, R.join('\n') + '\n'); await nav.close(); process.exit(echecs ? 1 : 0);
