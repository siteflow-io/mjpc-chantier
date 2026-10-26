// E3 · LE BANC §12.27 PAR LE GESTE — « tout l'écran, tout le temps » (contrat §12.27 (11), relance du 26/10 11:50).
// Le parcours fixe de la conscience (MANDATS/UI-PLEIN-ECRAN/mesure.mjs) : l'accueil, l'entrée du prof (loginAsProf), l'EDT, l'accueil
// des niveaux, la page du niveau, chaque section du panneau, l'Atelier et ses vues, l'heure lancée, la fin de l'heure, la fenêtre du
// tableau, la Relecture, la visionneuse — aux quatre tailles (1366 × 768, 1536 × 864, 1707 × 743 la fenêtre de Paul, 1920 × 1080).
// Vérifie : le panneau et la visionneuse aux bords de la fenêtre (1 px) ; .at-zone = largeur − 2 × 14 px ; aucun défilement de côté ;
// l'Atelier ne défile pas quand la zone du déroulé est montrée, la zone touche le bas (4 px) ; rien de ce qui se lit hors de l'écran
// sauf dans un conteneur qui défile ; « Fermer l'atelier » sur la rangée des onglets ; ↻ ✕ dans la carte (codes déverrouillés) ; la
// section EDT en trois groupes, le bouton fermé avec sa raison ; .home-inner, .rel, .recit sans borne ; #hclasse = la classe de l'heure
// (cas H, une classe d'essai dans le magasin du banc : audit C4) ; la fenêtre du tableau sans aucun écran du prof, règles forcées à
// J + 30 (13 · 44), et la page du prof qui les garde ; la diapo identique pilote / tableau (lire / pareil de banc-1226.mjs), et
// identique à la mesure « avant » si on la donne ; 0 erreur JS.
// usage : MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node banc-1227.mjs <assemble/index.html> [sortie.txt]
//   MJPC_TAILLES=1366x768,…  MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (captures écran entier à 1707 et 1920)
//   MJPC_DIAPO_OUT=<f.json> (écrit ce que montre la diapo)  MJPC_DIAPO_REF=<f.json> (compare à la mesure « avant »)
//   Code 1 si une seule vérification échoue.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1227.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const ici = path.dirname(new URL(import.meta.url).pathname);
const HUB = path.resolve(process.env.MJPC_HUB || path.join(ici, '..', '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const FONTS = path.join(ici, '..', 'outils', 'eb-garamond');
const TAILLES = String(process.env.MJPC_TAILLES || '1366x768,1536x864,1707x743,1920x1080').split(',').map(t => t.split('x').map(Number));
const CAPT = process.env.MJPC_CAPT || null; const SUFF = process.env.MJPC_CAPT_SUFFIXE || 'apres'; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const DREF = process.env.MJPC_DIAPO_REF && fs.existsSync(process.env.MJPC_DIAPO_REF) ? JSON.parse(fs.readFileSync(process.env.MJPC_DIAPO_REF, 'utf8')) : null; const DOUT = {};
const URL0 = 'file://' + FICHIER; const MD5 = createHash('md5').update(fs.readFileSync(FICHIER)).digest('hex');
const HORLOGE = new Date('2026-09-14T09:00:00+02:00');

const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && detail !== '' ? ' — ' + detail : '')); return !!ok; };
const info = (k, quoi) => dire('  info   ' + k + ' · ' + quoi);
const p = (pg, ms) => pg.waitForTimeout(ms);

/* ── le faux hub (le dispositif de mesure.mjs / banc-1226.mjs), règles forcées à J + 30 (13 · 44) ── */
const hubStore = (essai) => { const J = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8')); const st = { classes: J('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J('taxonomie.json') : null, site: { '3e': J('site_3e.json'), config: J('site_config.json'), edt: { grille: { '2026-2027': J('grille-appariee.json') }, calendrier: { '2026-2027': J('calendrier.json') }, creneaux: { '2026-2027': J('creneaux.json') } } } };
  try { Object.values(st.site['3e'].chapitres).forEach(ch => Object.values(ch.seances || {}).forEach(se => { delete se.deroule_joue; })); } catch (e) {}
  st.site.config.dernierControleRegles = HORLOGE.getTime() - 30 * 86400000;   /* J + 30 : l'alerte « Vérifier les règles Firebase » est due */
  /* audit C4 : au faux hub la première classe de 3e est celle des De Gaulle — une classe d'essai qui se trie avant elle, dans le magasin du banc seulement */
  if (essai) { const t = st.classes['CLASSE TEST'] || {}; st.classes['3A ESSAI'] = { nom: '3A ESSAI', niveau: '3e', archivee: false, eleves: JSON.parse(JSON.stringify(t.eleves || ['ESSAI Un', 'ESSAI Deux'])) }; }
  return st; };
const fauxHub = s => { let sv = null; try { sv = sessionStorage.getItem('__E3HUB27'); } catch (e) {} window.__HUB = sv ? JSON.parse(sv) : JSON.parse(JSON.stringify(s)); window.__ECR = []; const garder = () => { try { sessionStorage.setItem('__E3HUB27', JSON.stringify(window.__HUB)); } catch (e) {} };
  const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
  const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; garder(); };
  window.__hubLire = lire;
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} window.__ECR.push(m + ' ' + c); if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else pos(c, m === 'DELETE' ? null : bd); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.reject(new Error('hors du faux hub : ' + s2.slice(0, 60))); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansVoile = pg => pg.evaluate(() => { const o = document.getElementById('fi-overlay'); if (o) o.remove(); }).catch(() => {});
const police = async pg => { const css = [[400, 'normal'], [400, 'italic'], [500, 'normal'], [600, 'normal'], [700, 'normal'], [800, 'normal']].map(([w, st]) => `@font-face{font-family:'EB Garamond';font-weight:${w};font-style:${st};src:url('file://${path.join(FONTS, `eb-garamond-latin-${w}-${st}.woff2`)}') format('woff2'),url('file://${path.join(FONTS, `eb-garamond-latin-ext-${w}-${st}.woff2`)}') format('woff2');}`).join('\n'); await pg.addStyleTag({ content: css }).catch(() => {}); await pg.evaluate(() => document.fonts.ready).catch(() => {}); };

/* ── les mesures, dans la page ─────────────────────────────────────────────── */
/* (a) défilements de côté et texte hors de l'écran (audit C5) */
const geometrie = pg => pg.evaluate(() => {
  const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight;
  const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0); };
  const nom = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
  const de = document.scrollingElement; const cote = [];
  if (de && de.scrollWidth > de.clientWidth + 1) cote.push('la page (' + de.scrollWidth + ' > ' + de.clientWidth + ')');
  for (const el of Array.from(document.querySelectorAll('body *'))) { const s = getComputedStyle(el); if (s.overflowX !== 'auto' && s.overflowX !== 'scroll') continue; if (!vis(el)) continue; if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 40) { cote.push(nom(el) + ' (' + el.scrollWidth + ' > ' + el.clientWidth + ')'); if (cote.length > 6) break; } }
  /* un ancêtre qui permet d'atteindre le texte en défilant dans cet axe, ou qui le coupe */
  const atteint = (el, axe) => { let a = el.parentElement, fixe = false; while (a && a !== document.body && a !== document.documentElement) { const s = getComputedStyle(a); if (s.position === 'fixed') fixe = true; const ov = axe === 'x' ? s.overflowX : s.overflowY; if ((ov === 'auto' || ov === 'scroll') && (axe === 'x' ? a.scrollWidth > a.clientWidth : a.scrollHeight > a.clientHeight)) return 'defile'; if (ov === 'hidden' || ov === 'clip') return 'coupe'; a = a.parentElement; }
    if (!fixe && de && (axe === 'x' ? de.scrollWidth > de.clientWidth : de.scrollHeight > de.clientHeight)) { const sb = getComputedStyle(document.body)[axe === 'x' ? 'overflowX' : 'overflowY']; if (sb !== 'hidden') return 'defile'; } return 'non'; };
  const hors = [], coupes = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw.nextNode()) { const t = tw.currentNode; const txt = t.textContent.replace(/\s+/g, ' ').trim(); if (!txt) continue; const el = t.parentElement; if (!el || el.closest('script,style,noscript,option,select') || !vis(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(t); const rs = Array.from(rg.getClientRects()).filter(r => r.width >= 1 && r.height >= 1); if (!rs.length) continue;
    const dx = rs.some(r => r.right > W + 1 || r.left < -1), dy = rs.some(r => r.bottom > H + 1 || r.top < -1); if (!dx && !dy) continue;
    const ax = dx ? atteint(el, 'x') : 'defile', ay = dy ? atteint(el, 'y') : 'defile';
    if (ax === 'non' || ay === 'non') { if (hors.length < 6) hors.push('« ' + txt.slice(0, 40) + ' » (' + nom(el) + ')'); else if (hors.length === 6) hors.push('…'); }
    else if (ax === 'coupe' || ay === 'coupe') { const r0 = rs[0]; const top = document.elementFromPoint(Math.min(W - 1, Math.max(0, r0.left + r0.width / 2)), Math.min(H - 1, Math.max(0, r0.top + r0.height / 2))); if (top && (top === el || el.contains(top) || top.contains(el)) && coupes.length < 4) coupes.push('« ' + txt.slice(0, 30) + ' » (' + nom(el) + ')'); } }
  return { W, H, cote, hors, coupes };
});
/* (b) les bords d'une boîte (le panneau, la visionneuse) */
const bords = (pg, sel) => pg.evaluate(s => { const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight; const el = Array.from(document.querySelectorAll(s)).find(e => e.getBoundingClientRect().width > 0); if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { W, H, l: Math.round(r.left * 10) / 10, t: Math.round(r.top * 10) / 10, r: Math.round(r.right * 10) / 10, b: Math.round(r.bottom * 10) / 10, rayon: cs.borderTopLeftRadius }; }, sel);
const auxBords = b => !!b && Math.abs(b.l) <= 1 && Math.abs(b.t) <= 1 && Math.abs(b.r - b.W) <= 1 && Math.abs(b.b - b.H) <= 1;
const dB = b => b ? `${b.l},${b.t} → ${b.r},${b.b} dans ${b.W}×${b.H}, coins ${b.rayon}` : 'absente';
/* (c) l'Atelier : la zone, les onglets, « Fermer », le défilement */
const atelier = pg => pg.evaluate(() => { const W = document.documentElement.clientWidth, H = document.documentElement.clientHeight; const vis = el => !!el && el.getBoundingClientRect().width > 0 && getComputedStyle(el).visibility !== 'hidden';
  const z = document.getElementById('at-zone'); let zone = null; if (z && vis(z)) { const r = z.getBoundingClientRect(), s = getComputedStyle(z); zone = { g: Math.round((r.left + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth)) * 10) / 10, d: Math.round((r.right - parseFloat(s.paddingRight) - parseFloat(s.borderRightWidth)) * 10) / 10 }; }
  const ec = document.getElementById('atelier-ecran'); const de = document.scrollingElement;
  const defile = { ecran: ec ? ec.scrollHeight - ec.clientHeight : 0, page: de ? de.scrollHeight - de.clientHeight : 0, bodyCache: getComputedStyle(document.body).overflowY === 'hidden' };
  const dz = document.getElementById('dr-zone'); const drz = dz && vis(dz) && !dz.classList.contains('dr-parque') ? Math.round(dz.getBoundingClientRect().bottom * 10) / 10 : null;
  /* la rangée d'onglets qui existe à l'écran (§12.27 (12)) : Structure · Atelier · Pilotage · Relecture dans un chapitre, « Mes feuilles · Mes chapitres » à l'accueil */
  const vb = Array.from(document.querySelectorAll('.at-vues-barre')).find(vis) || null; const barre = vb || Array.from(document.querySelectorAll('#atelier-ecran .at-onglets')).find(vis) || null; const br = barre ? barre.getBoundingClientRect() : null;
  const fer = Array.from(document.querySelectorAll('#atelier-ecran button, #atelier-ecran [onclick]')).filter(e => vis(e) && /Fermer l.atelier/.test(e.textContent || '') && e.children.length < 3)[0] || null; const fr = fer ? fer.getBoundingClientRect() : null;
  const ongs = barre ? Array.from(barre.querySelectorAll('.at-onglet')).filter(vis) : []; const dern = ongs.length ? Math.max(...ongs.map(o => o.getBoundingClientRect().right)) : null;
  const ecTop = ec ? ec.getBoundingClientRect().top : 0;
  return { W, H, zone, defile, drz, vues: !!vb, barre: br ? { t: Math.round(br.top), b: Math.round(br.bottom), l: Math.round(br.left), r: Math.round(br.right) } : null, ecTop: Math.round(ecTop),
    fermer: fr ? { t: Math.round(fr.top), b: Math.round(fr.bottom), l: Math.round(fr.left), r: Math.round(fr.right), cy: Math.round(fr.top + fr.height / 2), dansEcran: fr.left >= 0 && fr.right <= W && fr.top >= 0 && fr.bottom <= H } : null, dernOnglet: dern != null ? Math.round(dern) : null }; });
/* (d) une boîte sans borne : sa largeur = la largeur de contenu de son parent */
const pleine = (pg, sel, racine) => pg.evaluate(({ s, rc }) => { const el = Array.from(document.querySelectorAll((rc ? rc + ' ' : '') + s)).find(e => e.getBoundingClientRect().width > 0); if (!el) return null; const pa = el.parentElement; const ps = getComputedStyle(pa); const pr = pa.getBoundingClientRect(); const dispo = pr.width - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight) - parseFloat(ps.borderLeftWidth) - parseFloat(ps.borderRightWidth); const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return { larg: Math.round(r.width), dispo: Math.round(dispo), maxw: cs.maxWidth, W: document.documentElement.clientWidth }; }, { s: sel, rc: racine || '' });

/* (e) un texte de la page recouvert par un élément fixe (un bouton flottant posé par-dessus quand la page s'élargit) */
const recouvert = (pg, racine) => pg.evaluate(rc => { const W = innerWidth, H = innerHeight; const R0 = document.querySelector(rc); if (!R0) return null; const ko = [];
  const fixe = e => { for (let a = e; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') return a; return null; };
  const tw = document.createTreeWalker(R0, NodeFilter.SHOW_TEXT); while (tw.nextNode()) { const t = tw.currentNode; const txt = t.textContent.replace(/\s+/g, ' ').trim(); if (!txt) continue; const el = t.parentElement; if (el.closest('.level-bg-num,[aria-hidden="true"]')) continue; /* le grand chiffre décoratif d'une carte de niveau ne se lit pas */ const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
    const rg = document.createRange(); rg.selectNodeContents(t); for (const r of Array.from(rg.getClientRects())) { if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
      for (const fx of [0.15, 0.5, 0.85]) { const x = r.left + r.width * fx, y = r.top + r.height / 2; if (x < 0 || x >= W || y < 0 || y >= H) continue; const top = document.elementFromPoint(x, y); if (!top || top === el || el.contains(top) || top.contains(el)) continue; const f = fixe(top); if (f && !f.contains(el)) { ko.push('« ' + txt.slice(0, 30) + ' » sous ' + top.tagName.toLowerCase() + (top.id ? '#' + top.id : '') + (typeof top.className === 'string' && top.className.trim() ? '.' + top.className.trim().split(/\s+/)[0] : '')); break; } } } if (ko.length > 4) break; }
  return ko; }, racine);
/* ce que montre une diapo : au pilote #mur, dans la fenêtre #mur2 (lire / pareil de banc-1226.mjs) */
const lire = (ctx, quel) => ctx.evaluate(q => { const mur = q === 'pilote' ? document.getElementById('mur') : (document.getElementById('mur2') || document.querySelector('.mur.tableau')); if (!mur) return null; const mb = mur.getBoundingClientRect(); const c = mur.querySelector('.corpsd') || mur;
  const els = Array.from(c.querySelectorAll('li')).filter(l => !l.classList.contains('hors') && !l.classList.contains('pas') && l.getBoundingClientRect().height > 0 && getComputedStyle(l).visibility !== 'hidden' && getComputedStyle(l).opacity !== '0');
  const act = (mur.querySelector('.act') || {}).textContent || '';
  return { page: ((mur.querySelector('.page') || {}).textContent || '').replace(/[‹›]/g, '').trim(), act: act.trim().slice(0, 60), lignes: els.map(l => l.getAttribute('data-p') || l.textContent.trim().slice(0, 24)), hors: els.filter(e => { const b = e.getBoundingClientRect(); return b.top < mb.top - 1 || b.bottom > mb.bottom + 1; }).length, police: Math.round(parseFloat(getComputedStyle(c).fontSize) * 10) / 10 }; }, quel);
const pareil = (a, b) => !!a && !!b && a.page === b.page && a.act === b.act && JSON.stringify(a.lignes) === JSON.stringify(b.lignes);
const dD = d => d ? `${d.act || '?'} · ${d.lignes.length} lignes · page « ${d.page} » · ${d.police} px` : 'absente';

/* les écrans du prof qui ne doivent jamais paraître dans la fenêtre du tableau (13 · 44 ; audit F2, F3) */
const ecransDuProf = pg => pg.evaluate(() => { const W = innerWidth, H = innerHeight; const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const s = getComputedStyle(el); return !(s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0); };
  const noms = ['#m8-regles-overlay', '.m8-overlay', '.fi-overlay', '.tprof-overlay', '#edt-ecran', '#atelier-ecran', '.doc-viewer-overlay', '#tprof-testpill', '.admin-banner', '#page-home', '#page-validation', '.lv-page.active'];
  const vus = []; noms.forEach(s => { let els = []; try { els = Array.from(document.querySelectorAll(s)); } catch (e) {} els.filter(vis).forEach(e => vus.push(s + (e.id && s.indexOf('#') < 0 ? '#' + e.id : ''))); });
  /* par la géométrie : tout élément fixe visible qui couvre plus d'un cinquième de la fenêtre et ne porte pas le tableau */
  const mur = document.getElementById('mur2') || document.querySelector('.mur.tableau'); const geo = [];
  Array.from(document.querySelectorAll('body *')).forEach(e => { const s = getComputedStyle(e); if (s.position !== 'fixed' || !vis(e)) return; const r = e.getBoundingClientRect(); const a = Math.max(0, Math.min(r.right, W) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)); if (a < W * H / 5) return; if (mur && (e.contains(mur) || mur.contains(e))) return; if (e.closest('#ses-tab, #dr-tableau')) return; const top = document.elementFromPoint(Math.min(W - 1, Math.max(0, r.left + r.width / 2)), Math.min(H - 1, Math.max(0, r.top + r.height / 2))); if (!top || !(e === top || e.contains(top))) return; geo.push(e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : '')); });
  return { vus, geo, admin: document.body.classList.contains('admin-mode'), titre: document.title, ecr: (window.SES && SES.ecrituresBloquees) || 0, refuses: (window.DR_TAB && DR_TAB.refuses) ? DR_TAB.refuses.slice() : null }; });

const NOMS_EDT = { calendrier: 'Calendrier de l’année', grille: 'Grille de l’emploi du temps', creneaux: 'Créneaux horaires', periodes: 'Découpage en périodes', photos: 'Photos du prévu', reglages: 'Réglages de l’emploi du temps', decisions: 'Décisions horaires' };

dire('E3 · banc §12.27 par le geste (tout l’écran, tout le temps) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · fichier md5 ' + MD5 + (DREF ? ' · diapo comparée à la mesure « ' + (DREF.__md5 || '?').slice(0, 8) + ' »' : ''));
DOUT.__md5 = MD5;
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });

const ouvrirCtx = async (W, H, essai) => { const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => r.abort());
  await ctx.addInitScript(fauxHub, hubStore(essai));   /* au contexte : la fenêtre du tableau lit le même faux hub (sinon l'alerte ne pourrait pas s'y ouvrir — fausse garde) */
  ctx.on('page', q => { q.on('pageerror', e => errs.push((q.url().indexOf('vue=tableau') >= 0 ? '[tableau] ' : '') + String(e.message).slice(0, 160))); q.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 80)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(HORLOGE); return { ctx, pg, errs, boites }; };

for (const [W, H] of TAILLES) { const T = W + '×' + H, TT = W + 'x' + H; const capt = CAPT && (W === 1707 || W === 1920);
  dire(''); dire('══ ' + T + ' ══');
  const { ctx, pg, errs, boites } = await ouvrirCtx(W, H, false); let n = 0;
  const ecran = async (nom, k, opts = {}) => { n++; const id = String(n).padStart(2, '0') + '-' + nom; await sansVoile(pg); await p(pg, 250);
    if (capt) await pg.screenshot({ path: path.join(CAPT, TT + '-' + id + '-' + SUFF + '.png') }).catch(() => {});
    const g = await geometrie(pg); verif(k, !g.cote.length, T + ' · ' + nom + ' · aucun défilement de côté', g.cote.join(', '));
    verif(k, !g.hors.length, T + ' · ' + nom + ' · rien de ce qui se lit hors de l’écran (hors d’un conteneur qui défile)', g.hors.join(' ; '));
    if (g.coupes.length) info(k, T + ' · ' + nom + ' · texte coupé par son cadre (overflow:hidden, sans échec) : ' + g.coupes.join(' ; '));
    return g; };
  try {
    /* A · l'accueil, avant toute entrée */
    await pg.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(pg, 2200); await police(pg); await ecran('accueil-connexion', 'A');
    /* B · l'entrée du professeur : l'EDT paraît (edtArriveeProf) ; l'alerte des règles, due à J + 30, paraît À LA PAGE DU PROF (13 · 44 : elle la garde) */
    await pg.evaluate(() => { try { loginAsProf(); } catch (e) {} }); await p(pg, 2500);
    const al = await pg.evaluate(() => { const o = document.getElementById('m8-regles-overlay'); return !!(o && o.getBoundingClientRect().height > 0); });
    verif('B', al, T + ' · la page du prof garde l’alerte « Vérifier les règles Firebase » (J + 30) — 13 · 44');
    if (capt) await pg.screenshot({ path: path.join(CAPT, TT + '-00-alerte-regles-page-du-prof-' + SUFF + '.png') }).catch(() => {});
    await pg.evaluate(() => { const o = document.getElementById('m8-regles-overlay'); if (o) o.remove(); });   /* retirée sans « J'ai vérifié » (qui écrirait) */
    await sansVoile(pg);
    const edtLa = await pg.evaluate(() => { const e = document.getElementById('edt-ecran'); return !!(e && e.style.display !== 'none' && e.getBoundingClientRect().height > 0); });
    verif('B', edtLa, T + ' · la page du prof garde l’arrivée sur l’EDT (edtArriveeProf)');
    if (!edtLa) { await pg.evaluate(() => edtOuvrir()); await p(pg, 1800); }
    await ecran('edt-semaine', 'B');
    for (const v of ['mois', 'annee', 'calendrier']) { await pg.evaluate(x => edtVue(x), v); await p(pg, 900); await ecran('edt-' + (v === 'calendrier' ? 'heures-perdues' : v), 'B'); }
    await pg.evaluate(() => edtVue('semaine')); await p(pg, 700);
    await pg.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/.test(e.innerText)); if (c) c.click(); }); await p(pg, 900); await ecran('edt-case-modale', 'B');
    await pg.keyboard.press('Escape'); await p(pg, 300);
    await pg.evaluate(() => edtFermer()); await p(pg, 600);
    /* C · l'accueil des niveaux, la page du niveau (côté prof) : .home-inner sans borne (12.27 (6)) */
    const g7 = await ecran('accueil-niveaux', 'C'); let hi = await pleine(pg, '.home-inner', '');
    const rcv = async nom => { const k = await recouvert(pg, '.page.active .home-inner, .home-inner'); verif('C', k && !k.length, T + ' · ' + nom + ' · aucun texte de la page sous un bouton fixe', k ? k.join(' ; ') : 'pas de .home-inner'); };
    await rcv('accueil des niveaux');
    verif('C', hi && hi.larg >= hi.W - 1, T + ' · accueil des niveaux · .home-inner à toute la largeur (les bords gardés dedans)', hi ? hi.larg + ' px sur ' + hi.W + ' (max-width ' + hi.maxw + ')' : 'absent');
    await pg.evaluate(() => openLevel('3e', '3ème', 'var(--3e)')); await p(pg, 1800); await ecran('niveau-3e', 'C'); await rcv('page du niveau');
    hi = await pleine(pg, '.home-inner', ''); verif('C', hi && hi.larg >= hi.W - 1, T + ' · page du niveau · .home-inner à toute la largeur', hi ? hi.larg + ' px sur ' + hi.W + ' (max-width ' + hi.maxw + ')' : 'absent');
    await pg.evaluate(() => { const h = Array.from(document.querySelectorAll('[onclick="toggleChapter(this)"]')).find(x => x.offsetParent !== null); if (h) h.click(); }); await p(pg, 900); await ecran('niveau-3e-chapitre-ouvert', 'C');
    /* la page du niveau vue comme un élève (« 👁 Voir comme un élève », basculerVue — audit C7 : le profil MENEY / MONSIEUR ne passe plus sans code) */
    await pg.evaluate(() => { try { basculerVue(); } catch (e) {} }); await p(pg, 1200); await sansVoile(pg); await ecran('niveau-3e-vue-eleve', 'C');
    hi = await pleine(pg, '.home-inner', ''); verif('C', hi && hi.larg >= hi.W - 1, T + ' · page du niveau, vue élève · .home-inner à toute la largeur', hi ? hi.larg + ' px sur ' + hi.W + ' (max-width ' + hi.maxw + ')' : 'absent');
    await pg.evaluate(() => { try { basculerVue(); } catch (e) {} }); await p(pg, 1200); await sansVoile(pg);
    /* D · le panneau prof, chaque section : bord à bord (12 · 87) ; ↻ ✕ dans la carte (12 · 88) ; la section EDT (12 · 212) */
    await pg.evaluate(() => openProfPanel()); await p(pg, 900); await sansVoile(pg);
    await pg.evaluate(() => { if (window.SECU) { SECU.valide = true; SECU.cacheFait = true; } });   /* les codes déverrouillés au faux hub (la clé n'y est pas) */
    for (const s of ['dashboard', 'classes', 'eleves', 'profil-test', 'archi', 'archives', 'corbeille', 'annonces', 'brevet', 'taxo', 'edt', 'config', 'presence']) {
      await pg.evaluate(id => { try { showProfSection(id); } catch (e) {} }, s); await p(pg, 900);
      if (s === 'eleves') { /* un code par élève de la classe montrée (en cache), puis la section redessinée ; un ◆ posé comme elfMarquerListe le pose */
        await pg.evaluate(() => { try { const sl = PROF_EL_CLASSE; const cl = classesData[sl]; const noms = (typeof extractEleves === 'function' ? extractEleves(cl) : cl.eleves) || []; noms.forEach((nm, i) => { const k = san(nm); codesData[k] = codesData[k] || { chiffre: 'e3-essai' }; SECU.cache[k] = String(1000 + i); }); showProfSection('eleves'); } catch (e) {} }); await p(pg, 700);
        await pg.evaluate(() => { const f = Array.from(document.querySelectorAll('.el-row .elf-flag')); if (f[1] && !f.some(x => x.textContent.trim())) { f[1].textContent = '◆'; f[1].title = 'élève à dispositif (posé par le banc)'; } const r = document.querySelector('.el-row'); if (r) r.scrollIntoView({ block: 'start' }); }); await p(pg, 300); }
      const g = await ecran('panneau-' + s, 'D'); const b = await bords(pg, '.tprof-box');
      verif('D', auxBords(b), T + ' · panneau ' + s + ' · .tprof-box aux bords de la fenêtre (1 px)', dB(b));
      if (s === 'dashboard') verif('D', b && (b.rayon === '0px' || b.rayon === ''), T + ' · panneau · sans coins arrondis', b ? b.rayon : '');
      if (s === 'eleves') { const el = await pg.evaluate(() => { const rows = Array.from(document.querySelectorAll('.el-row')).filter(r => r.getBoundingClientRect().height > 0); const ko = []; let codes = 0, losange = 0;
          rows.forEach((r, i) => { const rr = r.getBoundingClientRect(); const nm = r.querySelector('.el-name'); const nr = nm ? nm.getBoundingClientRect() : null; if (/^\d{4}$/.test(((r.querySelector('.el-code') || {}).textContent || '').trim())) codes++; if (((r.querySelector('.elf-flag') || {}).textContent || '').trim()) losange++;
            Array.from(r.querySelectorAll('.el-acts button')).forEach(bt => { const b = bt.getBoundingClientRect(); const cy = b.top + b.height / 2; const dedans = b.left >= rr.left - 1 && b.right <= rr.right + 1 && b.top >= rr.top - 1 && b.bottom <= rr.bottom + 1; const ligne = nr && cy >= nr.top - 1 && cy <= nr.bottom + 1; const droite = nr && b.left >= nr.right; if (!(dedans && ligne && droite) && ko.length < 4) ko.push('ligne ' + (i + 1) + ' « ' + bt.textContent.trim() + ' » ' + (!dedans ? 'hors de la carte' : !ligne ? 'pas sur la ligne du nom' : 'pas à droite du nom') + ' (' + Math.round(b.top) + '-' + Math.round(b.bottom) + ' / nom ' + (nr ? Math.round(nr.top) + '-' + Math.round(nr.bottom) : '?') + ')'); }); });
          return { n: rows.length, ko, codes, losange }; });
        verif('D', el.n > 0 && el.codes > 0, T + ' · élèves & codes · les lignes et les codes déverrouillés sont là', el.n + ' lignes, ' + el.codes + ' codes en clair, ' + el.losange + ' ◆');
        verif('D', el.n > 0 && !el.ko.length, T + ' · élèves & codes · ↻ ✕ dans la carte, à droite, sur la ligne du nom (avec et sans ◆)', el.ko.join(' ; ')); }
      if (s === 'edt') { const e = await pg.evaluate(NOMS => { const P = document.getElementById('edt-panneau') || document.getElementById('tprof-content'); const vis = el => !!el && el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden'; const tx = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
          const presents = (typeof EDT_OBJETS !== 'undefined' ? EDT_OBJETS : []).filter(o => typeof EDT === 'object' && EDT && !!EDT[o]);
          const boutons = Array.from(P.querySelectorAll('button')).filter(vis); const ouvrir = boutons.find(b => /Ouvrir l.emploi du temps/.test(tx(b)));
          const sortir = boutons.find(b => /Sortir les JSON coch/.test(tx(b))); const prompts = boutons.filter(b => /Copier le prompt/.test(tx(b)) || (b.getAttribute('onclick') || '').indexOf('edtCopierPrompt') >= 0);
          const anciens = boutons.filter(b => /Sortir le JSON —/.test(tx(b))).length;
          const cases = Array.from(P.querySelectorAll('input[type=checkbox]')).filter(c => vis(c) || vis(c.parentElement)).filter(c => (c.getAttribute('onchange') || '').indexOf('arriverSurEdt') < 0);
          const libCase = c => tx(c.closest('label') || c.parentElement || c);
          const nommes = presents.filter(o => cases.some(c => libCase(c).indexOf(NOMS[o]) >= 0)); const tout = Array.from(P.querySelectorAll('button,label,a,[onclick]')).filter(vis).find(x => /Tout cocher/.test(tx(x)));
          /* les petits titres : un texte qui n'est pas un bouton, au-dessus de chaque groupe */
          const feuilles = Array.from(P.querySelectorAll('*')).filter(x => vis(x) && !x.closest('button') && x.children.length === 0); const titre = re => feuilles.some(x => re.test(tx(x)) && tx(x).length < 40);
          const raison = sortir ? (sortir.disabled || sortir.getAttribute('aria-disabled') === 'true') && !!((sortir.getAttribute('title') || '').trim() || (sortir.parentElement && sortir.parentElement.getAttribute('title')) || '') : false;
          const tops = [ouvrir, sortir, prompts[0]].map(x => x ? Math.round(x.getBoundingClientRect().top) : null);
          return { presents, cases: cases.length, nommes: nommes.length, tout: !!tout, sortir: !!sortir, ferme: sortir ? !!(sortir.disabled || sortir.getAttribute('aria-disabled') === 'true') : null, raison, titreSortir: sortir ? (sortir.getAttribute('title') || '') : '', prompts: prompts.map(tx), anciens, tops, titres: [titre(/Sortir le JSON/), titre(/Copier le prompt/)] }; }, NOMS_EDT);
        verif('D', e.cases >= e.presents.length && e.nommes === e.presents.length && e.presents.length > 0, T + ' · EDT · une case par objet présent, nommée en clair', e.nommes + '/' + e.presents.length + ' (' + e.presents.join(', ') + ') ; ' + e.cases + ' cases ; ' + e.anciens + ' boutons « Sortir le JSON — objet » d’aujourd’hui');
        verif('D', e.tout, T + ' · EDT · « Tout cocher »');
        verif('D', e.sortir && e.ferme && e.raison, T + ' · EDT · un seul « ⤓ Sortir les JSON cochés », fermé tant que rien n’est coché, avec sa raison', e.sortir ? 'fermé ' + e.ferme + ', raison « ' + e.titreSortir.slice(0, 60) + ' »' : 'absent');
        verif('D', e.prompts.length === 2 && /Calendrier de l.année/.test(e.prompts.join('|')) && /Grille de l.emploi du temps/.test(e.prompts.join('|')), T + ' · EDT · « 📋 Copier le prompt » : un bouton par voie, nommé comme la voie (audit C3 : deux)', e.prompts.join(' | '));
        verif('D', e.tops.every(x => x != null) && e.tops[0] < e.tops[1] && e.tops[1] < e.tops[2] && e.titres.every(Boolean), T + ' · EDT · trois groupes l’un sous l’autre, chacun son petit titre', 'hauts ' + e.tops.join(' / ') + ' ; titres ' + e.titres.join(', '));
        if (e.sortir) { const ok = await pg.evaluate(() => { const P = document.getElementById('edt-panneau') || document.getElementById('tprof-content'); const c = Array.from(P.querySelectorAll('input[type=checkbox]')).find(x => (x.getAttribute('onchange') || '').indexOf('arriverSurEdt') < 0 && x.getBoundingClientRect().height > 0); if (!c) return null; c.click(); const b = Array.from(P.querySelectorAll('button')).find(x => /Sortir les JSON coch/.test(x.innerText || '')); const r = b ? !(b.disabled || b.getAttribute('aria-disabled') === 'true') : null; c.click(); return r; }); verif('D', ok === true, T + ' · EDT · une case cochée ouvre le bouton', String(ok)); } }
    }
    /* E · l'Atelier : l'accueil, Mes chapitres, puis les vues du chapitre (13 · 37) */
    await pg.evaluate(() => atelierOuvrir()); await p(pg, 1200); await sansVoile(pg);
    const vAt = async (nom, k, drMontre) => { await ecran(nom, k); const a = await atelier(pg);
      verif(k, a.zone && Math.abs(a.zone.g - 14) <= 1 && Math.abs(a.zone.d - (a.W - 14)) <= 1, T + ' · ' + nom + ' · .at-zone = largeur − 2 × 14 px', a.zone ? 'contenu ' + a.zone.g + ' → ' + a.zone.d + ' dans ' + a.W : 'absente');
      verif(k, a.fermer && a.fermer.dansEcran, T + ' · ' + nom + ' · « ✕ Fermer l’atelier » visible dans l’écran', a.fermer ? a.fermer.l + ',' + a.fermer.t : 'absent');
      if (a.barre) verif(k, a.fermer && a.fermer.cy >= a.barre.t && a.fermer.cy <= a.barre.b && a.dernOnglet != null && a.fermer.l >= a.dernOnglet, T + ' · ' + nom + ' · « Fermer l’atelier » sur la rangée des onglets, à droite', a.fermer ? 'bouton ' + a.fermer.t + '-' + a.fermer.b + ' x ' + a.fermer.l + ' ; rangée ' + a.barre.t + '-' + a.barre.b + ' ; dernier onglet → ' + a.dernOnglet : 'absent');
      if (a.barre && a.vues) verif(k, a.barre.t - a.ecTop < 40, T + ' · ' + nom + ' · plus de bande vide au-dessus des onglets', 'la rangée commence à ' + (a.barre.t - a.ecTop) + ' px du haut');
      if (drMontre) { verif(k, a.defile.ecran <= 0 && (a.defile.bodyCache || a.defile.page <= 0), T + ' · ' + nom + ' · l’Atelier ne défile pas (la zone du déroulé montrée)', '#atelier-ecran ' + a.defile.ecran + ' px' + (a.defile.bodyCache ? '' : ', la page ' + a.defile.page + ' px'));
        verif(k, a.drz != null && a.drz <= a.H + 0.5 && a.drz >= a.H - 4, T + ' · ' + nom + ' · la zone du déroulé touche le bas de la fenêtre (4 px)', a.drz != null ? 'bas ' + a.drz + ' pour ' + a.H : '#dr-zone absente'); }
      return a; };
    await vAt('atelier-accueil', 'E', false);
    await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(pg, 900); await vAt('atelier-mes-chapitres', 'E', false);
    if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(pg, 1800); await sansVoile(pg); await police(pg);
    for (const v of ['structure', 'atelier', 'pilotage']) { await pg.evaluate(x => { const b = document.querySelector('.at-onglet[data-vue="' + x + '"]'); if (b) b.click(); }, v); await p(pg, 1800); await vAt('chapitre-' + v + (v === 'pilotage' ? '-avant-lancement' : ''), 'E', v !== 'structure'); }
    /* F · l'heure lancée : le pilote, la fin de l'heure, la fenêtre du tableau (13 · 44 ; la diapo pareille) */
    if (await pg.$('[data-lancer="1"]')) { await pg.click('[data-lancer="1"]').catch(() => {}); await p(pg, 2500); await sansVoile(pg); await pg.keyboard.press('Escape'); await p(pg, 300);
      for (let i = 0; i < 4; i++) { await pg.click('#bdev').catch(() => {}); await p(pg, 120); }
      await vAt('pilote-heure-lancee', 'F', true);
      const hc = await pg.evaluate(() => ({ h: ((document.getElementById('hclasse') || {}).textContent || '').trim(), c: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug : null }));
      verif('F', !!hc.c && hc.h === hc.c, T + ' · #hclasse = la classe de l’heure lancée', '« ' + hc.h + ' » pour « ' + hc.c + ' »');
      if (await pg.$('#bfin')) { await pg.click('#bfin').catch(() => {}); await p(pg, 900); await vAt('pilote-fin-de-l-heure', 'F', true); await clicTexte(pg, 'button', 'Revenir au cours'); await p(pg, 500); }
      let fen = null; try { [fen] = await Promise.all([pg.waitForEvent('popup', { timeout: 6000 }), pg.click('#bvideoproj')]); await fen.waitForLoadState(); await fen.setViewportSize({ width: W, height: H }).catch(() => {}); await p(fen, 3500); } catch (e) { fen = null; }
      verif('G', !!fen, T + ' · « ⧉ Ouvrir le tableau » ouvre la fenêtre');
      if (fen) { n++; const id = String(n).padStart(2, '0') + '-fenetre-du-tableau'; if (capt) await fen.screenshot({ path: path.join(CAPT, TT + '-' + id + '-' + SUFF + '.png') }).catch(() => {});
        /* l'alerte s'ouvre après une lecture au hub : on regarde la fenêtre 8 s (toutes les 500 ms) ; un seul écran du prof vu suffit à échouer */
        let pr = await ecransDuProf(fen); for (let i = 0; i < 16 && !pr.vus.length && !pr.geo.length; i++) { await p(fen, 500); pr = await ecransDuProf(fen); }
        if (capt && (pr.vus.length || pr.geo.length)) await fen.screenshot({ path: path.join(CAPT, TT + '-' + id + '-' + SUFF + '.png') }).catch(() => {});
        verif('G', !pr.vus.length && !pr.geo.length, T + ' · fenêtre du tableau · aucun écran du prof (règles à J + 30) — 13 · 44', (pr.vus.concat(pr.geo.map(x => 'fixe ' + x))).join(', ') + (pr.admin ? ' · body.admin-mode' : ''));
        /* puis on PROVOQUE les chemins qui ouvrent un écran du prof dans cette page (l'atterrissage du prof, l'alerte, l'arrivée sur l'EDT,
           le panneau) : la garde ne dépend plus de l'ordre des lectures à l'ouverture */
        await fen.evaluate(() => { ['_atterrirProf', 'verifierAlerteRegles', 'edtArriveeProf', 'openProfPanel'].forEach(f => { try { if (typeof window[f] === 'function') window[f](); } catch (e) {} }); }); await p(fen, 2500);
        const pr2 = await ecransDuProf(fen); verif('G', !pr2.vus.length && !pr2.geo.length, T + ' · fenêtre du tableau · aucun écran du prof, même provoqué (_atterrirProf, verifierAlerteRegles, edtArriveeProf, openProfPanel)', (pr2.vus.concat(pr2.geo.map(x => 'fixe ' + x))).join(', '));
        if (capt && (pr2.vus.length || pr2.geo.length)) await fen.screenshot({ path: path.join(CAPT, TT + '-' + id + '-provoque-' + SUFF + '.png') }).catch(() => {});
        pr.refuses = pr2.refuses; pr.ecr = pr2.ecr;
        info('G', T + ' · fenêtre du tableau · gestes du prof refusés : ' + (pr.refuses ? (pr.refuses.join(', ') || 'aucun appelé') : 'pas de garde (DR_TAB.refuses absent)') + ' · écritures bloquées ' + pr.ecr);
        const gt = await geometrie(fen); verif('G', !gt.cote.length, T + ' · fenêtre du tableau · aucun défilement de côté', gt.cote.join(', '));
        const dp = await lire(pg, 'pilote'), dt = await lire(fen, 'tableau');
        verif('G', pareil(dp, dt), T + ' · la diapo identique pilote / tableau', 'pilote ' + dD(dp) + ' ; tableau ' + dD(dt));
        verif('G', dt && dt.hors === 0, T + ' · au tableau, aucune ligne hors du cadre', dt ? String(dt.hors) : '');
        DOUT[TT] = { pilote: dp, tableau: dt };
        if (DREF && DREF[TT]) { const a = DREF[TT];
          verif('G', pareil(a.tableau, dt), T + ' · la diapo du tableau = celle de la mesure « avant »', 'avant ' + dD(a.tableau) + ' ; tête ' + dD(dt));
          verif('G', pareil(a.pilote, dp), T + ' · la diapo du pilote = celle de la mesure « avant » (audit C2)', 'avant ' + dD(a.pilote) + ' ; tête ' + dD(dp)); }
        await fen.close().catch(() => {}); }
    } else verif('F', false, T + ' · le bouton « Lancer » est là');
    await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="relecture"]'); if (b) b.click(); }); await p(pg, 2000);
    await vAt('chapitre-relecture', 'E', true);
    const rel = await pleine(pg, '.rel', '#dr-zone'), rec = await pleine(pg, '.recit', '#dr-zone');
    verif('E', rel && rel.larg >= rel.dispo - 1, T + ' · Relecture · .rel à toute la largeur de sa colonne', rel ? rel.larg + ' / ' + rel.dispo + ' px (max-width ' + rel.maxw + ')' : 'absente');
    if (rec) verif('E', rec.larg >= rec.dispo - 1, T + ' · Relecture · .recit à toute la largeur de sa colonne', rec.larg + ' / ' + rec.dispo + ' px (max-width ' + rec.maxw + ')'); else info('E', T + ' · Relecture · pas de .recit à l’écran');
    /* H · la visionneuse, bord à bord */
    await pg.evaluate(() => { try { atelierFermer(); } catch (e) {} try { closeProfPanel(); } catch (e) {} }); await p(pg, 900);
    await pg.evaluate(() => { try { openViewer('Un document', 'about:blank'); } catch (e) {} }); await p(pg, 900); await ecran('visionneuse', 'H');
    const bv = await bords(pg, '.doc-viewer-box'); verif('H', auxBords(bv), T + ' · visionneuse · .doc-viewer-box aux bords de la fenêtre (1 px)', dB(bv));
    verif('H', bv && (bv.rayon === '0px' || bv.rayon === ''), T + ' · visionneuse · sans coins arrondis', bv ? bv.rayon : '');
  } catch (e) { verif('Z', false, T + ' · le parcours n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
  verif('Z', !errs.length, T + ' · 0 erreur JS (page du prof et fenêtre du tableau)', errs.slice(0, 4).join(' ; '));
  if (boites.length) info('Z', T + ' · boîtes système : ' + boites.slice(0, 3).join(' ; '));
  await ctx.close();

  /* H2 · #hclasse quand la première classe du niveau n'est pas celle de l'heure (audit C4 : une classe d'essai dans le magasin du banc) */
  { const o = await ouvrirCtx(W, H, true); const q = o.pg;
    try { await q.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(q, 1800); await q.evaluate(() => { try { loginAsProf(); } catch (e) {} }); await p(q, 2200); await q.evaluate(() => { ['m8-regles-overlay', 'fi-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); try { edtFermer(); } catch (e) {} }); await p(q, 500);
      await q.evaluate(() => atelierOuvrir()); await p(q, 1200); await sansVoile(q); await clicTexte(q, 'button,[onclick]', "atOnglet('chapitres')"); await p(q, 900);
      if (!(await clicTexte(q, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(q, 'button,[onclick]', 'Modifier'); await p(q, 1800); await sansVoile(q);
      await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(q, 2500); await sansVoile(q);
      const av = await q.evaluate(() => ({ h: ((document.getElementById('hclasse') || {}).textContent || '').trim(), prem: (typeof _lvlClasses === 'function' ? (_lvlClasses('3e')[0] || {}).nom : null), prop: typeof dr_proposer === 'function' ? (dr_proposer() || {}).classeNom : null }));
      verif('H2', !!av.prop && av.h === av.prop, T + ' · avant tout lancement, #hclasse = la classe proposée', '« ' + av.h + ' » ; proposée « ' + av.prop + ' » ; première du niveau « ' + av.prem + ' »');
      await q.click('[data-lancer="1"]').catch(() => {}); await p(q, 2500); await sansVoile(q); await q.keyboard.press('Escape'); await p(q, 300);
      const ap = await q.evaluate(() => ({ h: ((document.getElementById('hclasse') || {}).textContent || '').trim(), c: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeNom || AT_DR_COURS.classeSlug : null }));
      if (ap.c === '3A ESSAI') info('H2', T + ' · l’heure lancée est celle de la classe d’essai : la vérification ne discrimine pas ici');
      verif('H2', !!ap.c && ap.h === ap.c, T + ' · l’heure lancée, #hclasse = sa classe (la première du niveau est « ' + av.prem + ' »)', '« ' + ap.h + ' » pour « ' + ap.c + ' »');
    } catch (e) { verif('H2', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('H2', !o.errs.length, T + ' · 0 erreur JS', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }

  /* J · 13 · 45 (§12.27 (13)) : panneau ouvert → atelier → Mes chapitres → « Voir dans l'arborescence » → la carte du chapitre visible, dépliée, en haut, rien par-dessus */
  { const o = await ouvrirCtx(W, H, false); const q = o.pg;
    try { await q.goto(URL0 + '?n=3e', { waitUntil: 'load' }); await p(q, 1800); await q.evaluate(() => { try { loginAsProf(); } catch (e) {} }); await p(q, 2200); await q.evaluate(() => { ['m8-regles-overlay', 'fi-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); try { edtFermer(); } catch (e) {} }); await p(q, 500);
      await q.evaluate(() => openProfPanel()); await p(q, 900); await sansVoile(q); await q.evaluate(() => atelierOuvrir()); await p(q, 1200); await sansVoile(q); await clicTexte(q, 'button,[onclick]', "atOnglet('chapitres')"); await p(q, 1000);
      const bt = await q.evaluate(() => { const b = Array.from(document.querySelectorAll('#atelier-ecran button, #atelier-ecran [onclick]')).find(x => x.offsetParent !== null && (x.getAttribute('onclick') || '').indexOf('atVoirPanneau') >= 0); if (!b) return null; const m = /atVoirPanneau\(\s*['"]([^'"]+)['"]\s*,\s*['"]?(\d+)/.exec(b.getAttribute('onclick')); return { txt: (b.innerText || '').trim(), level: m ? m[1] : null, ch: m ? m[2] : null }; });
      verif('J', !!bt, T + ' · Mes chapitres · le bouton qui mène à l’arborescence est là', bt ? '« ' + bt.txt + ' »' : 'absent');
      if (bt) { verif('J', /Voir dans l.arborescence/.test(bt.txt), T + ' · le bouton dit « Voir dans l’arborescence »', '« ' + bt.txt + ' »');
        await q.evaluate(() => { const b = Array.from(document.querySelectorAll('#atelier-ecran button, #atelier-ecran [onclick]')).find(x => x.offsetParent !== null && (x.getAttribute('onclick') || '').indexOf('atVoirPanneau') >= 0); b.click(); }); await p(q, 2200); await sansVoile(q);   /* le voile des fiches du faux hub (/manifestes manque, audit E1 F15) n'est pas l'écran mesuré */
        if (capt) await q.screenshot({ path: path.join(CAPT, TT + '-34-voir-dans-l-arborescence-' + SUFF + '.png') }).catch(() => {});
        const r = await q.evaluate(ch => { const H = innerHeight, W = innerWidth; const vis = el => { if (!el) return false; const b = el.getBoundingClientRect(); const s = getComputedStyle(el); return b.width > 2 && b.height > 2 && s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0; };
          const dessus = ['.tprof-overlay', '#atelier-ecran', '.m8-overlay', '.fi-overlay', '.doc-viewer-overlay'].filter(s => Array.from(document.querySelectorAll(s)).some(e => vis(e) && (s !== '#atelier-ecran' || e.classList.contains('at-actif'))));
          const c = Array.from(document.querySelectorAll('.chapter-card[data-chapter="' + ch + '"]')).find(vis); if (!c) return { dessus, carte: false };
          const b = c.getBoundingClientRect(); const corps = c.querySelector('.chapter-body'); const hd = c.firstElementChild ? c.firstElementChild.getBoundingClientRect() : b;
          const top = document.elementFromPoint(Math.min(W - 1, Math.max(0, hd.left + hd.width / 2)), Math.min(H - 1, Math.max(0, hd.top + Math.min(hd.height, 40) / 2)));
          return { dessus, carte: true, ouverte: !!(corps && corps.classList.contains('open')), haut: Math.round(b.top), libre: !!(top && c.contains(top)), sur: top ? top.tagName.toLowerCase() + (top.id ? '#' + top.id : '') + (typeof top.className === 'string' && top.className ? '.' + top.className.split(' ')[0] : '') : '' }; }, bt.ch);
        verif('J', !r.dessus.length, T + ' · 13 · 45 · rien par-dessus la page (ni panneau, ni atelier)', r.dessus.join(', '));
        verif('J', r.carte && r.ouverte, T + ' · 13 · 45 · la carte du chapitre ' + bt.ch + ' est visible et dépliée', r.carte ? 'dépliée ' + r.ouverte : 'absente');
        verif('J', r.carte && r.haut >= -2 && r.haut < H * 0.35 && r.libre, T + ' · 13 · 45 · la carte en haut de l’écran, rien au-dessus d’elle', r.carte ? 'haut ' + r.haut + ' px, au point : ' + r.sur : ''); }
    } catch (e) { verif('J', false, T + ' · le cas n’a pas pu aller au bout', String(e.message).split('\n')[0]); }
    verif('J', !o.errs.length, T + ' · 0 erreur JS', o.errs.slice(0, 3).join(' ; ')); await o.ctx.close(); }
}
await nav.close();
if (process.env.MJPC_DIAPO_OUT) { let av = {}; try { av = JSON.parse(fs.readFileSync(process.env.MJPC_DIAPO_OUT, 'utf8')); if (av.__md5 !== MD5) av = {}; } catch (e) {} fs.writeFileSync(process.env.MJPC_DIAPO_OUT, JSON.stringify(Object.assign(av, DOUT), null, 1)); }
dire(''); dire('BILAN banc-1227 : ' + (nb - echecs) + '/' + nb + ' vérifications' + (echecs ? ' — ' + echecs + ' ÉCHEC(S) · ROUGE' : ' · VERT'));
if (SORTIE) { fs.mkdirSync(path.dirname(path.resolve(SORTIE)), { recursive: true }); fs.writeFileSync(SORTIE, R.join('\n') + '\n'); }
process.exit(echecs ? 1 : 0);
