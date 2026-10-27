// E4 · LE BANC §12.36 PAR LE GESTE — la colonne de gauche de l'Atelier (contrat §12.36, relance du 27/10 23:12).
// A84 : chaque élément de l'image T259-01 cliqué par le geste, ce qu'il fait écrit et vérifié (aucun élément sans effet) ; la hauteur de la colonne
//       mesurée sur le chapitre 3e du faux hub.
// A85 : les deux poignées — à gauche : élargir, réduire, replier, rouvrir, retenue au rechargement ; à droite : élargir, retenue au rechargement (Paul 23:22) ;
//       aux quatre tailles ; dans l'Atelier et en répétition.
// usage : node banc-1236.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_TAILLES, MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres). Code 1 si un échec.
// Le harnais (faux hub, entrée prof, ouverture de l'Atelier, répétition) est celui d'E3 (banc-1228.mjs), repris tel quel.
// 49 : (13 · 49) « Créer ce chapitre » (le JSON collé, aucun chapitre de ce titre) → le titre du JSON tel quel au hub, sans « (proposition) ».
// usage : MJPC_HUB=AUDITS/INTEGRATION-DEROULE/hub node banc-1228.mjs <assemble/index.html> [sortie.txt]
//   MJPC_TAILLES (défaut les quatre), MJPC_CAPT=<dossier> MJPC_CAPT_SUFFIXE=avant|apres (1707 × 743 et 1920 × 1080). Code 1 si un échec.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const FICHIER = path.resolve(process.argv[2] || ''); const SORTIE = process.argv[3] || null;
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node banc-1236.mjs <fichier.html> [sortie.txt]'); process.exit(2); }
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
const etat = q => q.evaluate(() => { const col = document.getElementById('at-arbre'); const vis = e => !!(e && e.offsetParent !== null && e.getBoundingClientRect().height > 0);
  const vol = col && col.querySelector('.at-som-volet'); const v = document.getElementById('volet');
  return { vue: window.ATVUES && ATVUES.vue, snum: window.ATVUES && String(ATVUES.snum), di: window.S ? S.di : null, si: window.S ? S.si : null,
    titre: ((col && col.querySelector('.at-som-titre')) || {}).innerText || null, prog: ((col && col.querySelector('.at-som-prog')) || {}).innerText || null,
    its: col ? col.querySelectorAll('.ed2-it').length : -1, ins: col ? col.querySelectorAll('.ed2-inserer').length : -1,
    sea: col ? col.querySelectorAll('.at-chap .sea').length : -1, sea2: col ? col.querySelectorAll('.at-chap .sea2:not(.dr-react)').length : -1, aide: col ? col.querySelectorAll('.at-chap .aide').length : -1,
    voletVu: vis(vol), voletDansCol: !!(v && col && col.contains(v)), mur: ((document.getElementById('mur') || {}).innerText || '').slice(0, 80),
    fr: col ? Array.from(col.querySelectorAll('.at-chap .fr')).map(f => ({ t: f.innerText.replace(/\s+/g, ' ').trim(), hdi: f.dataset.atHdi })) : [],
    dd: col ? Array.from(col.querySelectorAll('.at-chap .dr-d')).map(d => ({ n: (d.querySelector('.dr-n') || {}).innerText, di: d.dataset.atDi, title: d.title })) : [],
    react: ((col && col.querySelector('[data-dr-react]')) || {}).innerText || null,
    hCol: col ? (col.querySelector('.ed2-som') || col).scrollHeight : 0, hVis: col ? (col.querySelector('.ed2-som') || col).clientHeight : 0,
    larg: col && vis(col) ? Math.round(col.getBoundingClientRect().width) : 0, repliee: document.documentElement.classList.contains('at-gauche-repliee'),
    poignee: vis(document.getElementById('at-arbre-poignee')), zone: (() => { const z = document.getElementById('at-vues-zone'); return z ? Math.round(z.getBoundingClientRect().width) : 0; })() }; });
const clicSel = (q, sel, k) => q.evaluate(({ sel, k }) => { const l = Array.from(document.querySelectorAll(sel)).filter(e => e.offsetParent !== null); const e = l[k || 0]; if (!e) return false; e.click(); return true; }, { sel, k });
const allerAtelier = async q => { await q.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]:not([hidden])') || document.getElementById('ong-atelier'); try { atVuesAller('atelier', true); } catch (e) { if (b) b.click(); } }); await p(q, 1500); };

/* ═════ A84 — chaque élément de la colonne (1707 × 743, l'horloge du lundi 14/09 à 9 h) ═════ */
if (fait('A84')) { const { ctx, pg, errs } = await ouvrirCtx(1707, 743);
  await entrerProf(pg); const okA = await ouvrirAtelier(pg); await p(pg, 1500);
  let e0 = await etat(pg); verif('A84', okA && e0.vue === 'atelier', 'l\'Atelier ouvert sur le premier chapitre 3e du faux hub', JSON.stringify({ vue: e0.vue, snum: e0.snum }));
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A84-1707-' + SUFF + '.png') });
  const titreCh = await pg.evaluate(() => { const c = (chapitresData[AT.edChap.level] || {})[AT.edChap.chnum] || {}; return c.title || c.titre || ''; });
  info('A84', 'colonne : ' + e0.hCol + ' px de haut pour ' + e0.hVis + ' visibles (la ⑥ : 2 646 pour 675) ; ' + e0.fr.length + ' lignes d\'heure, ' + e0.dd.length + ' diapos');
  verif('A84', e0.titre === titreCh && titreCh && e0.its === 0 && e0.ins === 0 && e0.sea === 0 && e0.sea2 === 0 && e0.aide === 0,
    '(1)(2)(3)(6) en haut le titre du chapitre ; ni documents, ni attendus, ni « + insérer », ni « Chapitre · … », ni « Séance n — … », ni la ligne d\'aide', JSON.stringify({ titre: e0.titre, attendu: titreCh, its: e0.its, ins: e0.ins, sea: e0.sea, sea2: e0.sea2, aide: e0.aide }));
  // 1 · le titre → Structure sur ce chapitre
  await clicSel(pg, '#at-arbre .at-som-titre'); await p(pg, 1500); let e = await etat(pg); const structOk1 = await pg.evaluate(t => ATVUES.vue === 'structure' && document.body.innerText.indexOf(t) >= 0, titreCh);
  verif('A84', structOk1, '① le titre du chapitre : ouvre Structure sur ce chapitre', JSON.stringify({ vue: e.vue })); await allerAtelier(pg);
  // 2 · « n documents sur m attendus → Structure »
  e = await etat(pg); verif('A84', /documents? sur \d+ attendus? → Structure/.test(e.prog || ''), '② « n documents sur m attendus → Structure » écrit', e.prog);
  await clicSel(pg, '#at-arbre .at-som-prog'); await p(pg, 1500); e = await etat(pg); verif('A84', e.vue === 'structure', '② un clic ouvre Structure sur ce chapitre', JSON.stringify({ vue: e.vue })); await allerAtelier(pg);
  // 9 · le réglage de réactivation
  e0 = await etat(pg); await clicSel(pg, '#at-arbre [data-dr-react]'); await p(pg, 900); e = await etat(pg); verif('A84', e0.react && e.react && e0.react !== e.react, '⑨ « Ouvrir chaque heure par la réactivation » : un clic bascule', JSON.stringify([e0.react, e.react]));
  await clicSel(pg, '#at-arbre [data-dr-react]'); await p(pg, 900);
  // 12 · une diapo : son heure prévue, son infobulle, le clic, le clic droit
  e0 = await etat(pg); const d3 = e0.dd[2]; await clicSel(pg, '#at-arbre .at-chap .dr-d', 2); await p(pg, 900); e = await etat(pg);
  verif('A84', e0.dd.every(d => /^\d\d:\d\d$|^\+\d+′$/.test(d.n)) && /^Clic : ouvre cette diapo · clic droit : dupliquer, insérer, déplacer, envoyer vers une autre séance, supprimer$/.test(d3.title) && String(e.di) === String(d3.di),
    '⑫ chaque diapo dit son heure prévue (« 08:57 ») ; l\'infobulle ; un clic ouvre la diapo', JSON.stringify({ heures: e0.dd.slice(0, 4).map(d => d.n), di: e.di, attendu: d3.di }));
  const menu = await pg.evaluate(() => { const d = Array.from(document.querySelectorAll('#at-arbre .at-chap .dr-d')).filter(x => x.offsetParent)[1]; const r = d.getBoundingClientRect(); d.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.x + 20, clientY: r.y + 5 })); const m = Array.from(document.querySelectorAll('.on')).find(x => x.querySelector('button.it[data-a]') && x.getBoundingClientRect().height > 0); return m ? m.innerText.replace(/\s+/g, ' ').slice(0, 160) : null; });
  verif('A84', !!menu && /Dupliquer/i.test(menu), '⑫ clic droit sur une diapo : le menu (dupliquer, insérer, déplacer…)', menu); await pg.keyboard.press('Escape'); await p(pg, 300); await pg.mouse.click(5, 5); await p(pg, 300);
  // 10 · 11 · la ligne d'heure : sa date, sa case, ses minutes ; un clic ouvre sa première diapo (sur H2, puis sur le « +n » de H1)
  e0 = await etat(pg); const f1 = e0.fr[0] || {}, f2 = e0.fr[1] || {};
  const src = await pg.evaluate(() => [1, 2, 3].map(h => { const v = dr_heureAVenir(h); return v ? { debut: v.debut, fin: v.fin } : null; }));
  verif('A84', e0.fr.every((f, k) => src[k] ? new RegExp('^H' + (k + 1) + ' · \\S+ \\d\\d/\\d\\d · ' + src[k].debut + ' → ' + src[k].fin).test(f.t) : new RegExp('^H' + (k + 1) + ' · pas encore à l’emploi du temps').test(f.t)) && e0.fr.every(f => /\d+ min prévues pour \d+ utiles/.test(f.t)),
    '⑩ la ligne d\'heure dit ce que la source de l\'heure (E1) donne — sa date et sa case, ou « pas encore à l\'emploi du temps » ; « … min prévues pour 50 utiles »', JSON.stringify({ lignes: e0.fr.map(f => f.t), source: src }));
  /* la source d'E1 (§12.38 (1)) n'est pas encore codée : la classe proposée à 9 h est 3 DYLAN Bob, sans case. On simule ce qu'elle donnera (la prochaine case de la séance : 3E Charles de Gaulle) — la colonne affiche, sans recalculer. */
  await pg.evaluate(() => { window.dr_classeProposee = () => '3E Charles de Gaulle'; try { DR_MEM.heuresAVenir = {}; } catch (e) {} delete document.getElementById('volet').dataset.atelier; dr_tout(); }); await p(pg, 900);
  const eS = await etat(pg); const sS = eS.fr.map(f => f.t);
  verif('A84', /^H1 · lun\. 14\/09 · 08:57 → 09:52 57 min prévues pour 50 utiles \+7/.test(sS[0] || '') && /^H2 · mar\. 15\/09 · 15:07 → 16:02/.test(sS[1] || '') && /^H3 · ven\. 18\/09 · 10:07 → 11:02/.test(sS[2] || '') && JSON.stringify(eS.dd.slice(0, 3).map(d => d.n)) === '["08:57","09:00","09:06"]',
    '⑩ ⑥ avec la source qui donne la case (3E Charles de Gaulle) : « H1 · lun. 14/09 · 08:57 → 09:52 · 57 min prévues pour 50 utiles +7 », H2 mar. 15/09, H3 ven. 18/09 ; les diapos à 08:57, 09:00, 09:06', JSON.stringify({ lignes: sS, diapos: eS.dd.slice(0, 3).map(d => d.n) }));
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A84-1707-' + SUFF + '-source-cdg.png') });
  await clicSel(pg, '#at-arbre .at-chap .fr', 1); await p(pg, 900); e = await etat(pg); verif('A84', String(e.di) === String(f2.hdi), '⑩ un clic sur la ligne d\'heure H2 ouvre sa première diapo', JSON.stringify({ di: e.di, attendu: f2.hdi }));
  const plus = await pg.evaluate(() => { const s = document.querySelector('#at-arbre .at-chap .fr .plus'); if (!s) return null; s.click(); return s.closest('.fr').dataset.atHdi; }); await p(pg, 900); e = await etat(pg);
  verif('A84', plus == null || String(e.di) === String(plus), '⑪ « +n » : le clic ouvre la première diapo de son heure (il garde son infobulle)', JSON.stringify({ plus, di: e.di }));
  // 4 · 3 · la séance ouverte se replie (▾, puis son titre), le centre ne change pas ; un second clic la rouvre
  e0 = await etat(pg); await clicSel(pg, '#at-arbre .ed2-sce[data-seance="' + e0.snum + '"] .at-som-pli'); await p(pg, 900); e = await etat(pg);
  verif('A84', e0.voletVu && !e.voletVu && e.voletDansCol && e.snum === e0.snum && e.di === e0.di && e.mur === e0.mur, '④ le ▾ de la séance ouverte la replie ; le centre ne change pas (la même diapo)', JSON.stringify({ avant: e0.voletVu, apres: e.voletVu, dansCol: e.voletDansCol, di: [e0.di, e.di] }));
  await clicSel(pg, '#at-arbre .ed2-sce[data-seance="' + e0.snum + '"] .at-som-pli'); await p(pg, 900); e = await etat(pg); verif('A84', e.voletVu && e.di === e0.di, '④ un second clic la rouvre', JSON.stringify({ vu: e.voletVu }));
  await clicSel(pg, '#at-arbre .ed2-sce[data-seance="' + e0.snum + '"]'); await p(pg, 900); e = await etat(pg); const replieTitre = !e.voletVu && e.di === e0.di;
  await clicSel(pg, '#at-arbre .ed2-sce[data-seance="' + e0.snum + '"]'); await p(pg, 900); e = await etat(pg); verif('A84', replieTitre && e.voletVu, '③ le titre de la séance ouverte la replie, puis la rouvre', JSON.stringify({ replieTitre, rouverte: e.voletVu }));
  // 14 · une séance repliée : elle s'ouvre, l'autre se replie, sa diapo 1 au centre
  const autre = await pg.evaluate(s => { const l = Array.from(document.querySelectorAll('#at-arbre .ed2-sce')).map(x => x.dataset.seance).filter(x => x !== s); return l[0] || null; }, e0.snum);
  if (autre) { await clicSel(pg, '#at-arbre .ed2-sce[data-seance="' + autre + '"]'); await p(pg, 2200); e = await etat(pg);
    verif('A84', e.snum === autre && e.di === 0 && e.voletVu, '⑭ une séance repliée : un clic l\'ouvre, sa diapo 1 au centre, l\'autre se replie', JSON.stringify({ snum: e.snum, di: e.di }));
    await clicSel(pg, '#at-arbre .ed2-sce[data-seance="' + e0.snum + '"]'); await p(pg, 2200); }
  // 13 · la ligne d'aide partie, « Ctrl + molette : zoom » dans le « ? » de l'Atelier
  const aide = await pg.evaluate(async () => { const b = document.getElementById('aide-q'); if (!b) return null; b.click(); await new Promise(r => setTimeout(r, 400)); const t = (document.getElementById('aide-volet') || {}).innerText || ''; b.click(); return t; });
  verif('A84', /Ctrl \+ molette : zoom/.test(aide || '') && /Le chapitre · Atelier/.test(aide || ''), '⑬ « Ctrl + molette : zoom » et le clic droit dans le « ? » de l\'Atelier', (aide || '').slice(0, 120).replace(/\n/g, ' '));
  e = await etat(pg); info('A84', 'colonne après : ' + e.hCol + ' px de haut pour ' + e.hVis + ' visibles');
  if (CAPT) await pg.screenshot({ path: path.join(CAPT, 'A84-1707-' + SUFF + '-fin.png') });
  verif('A84', errs.length === 0, 'zéro erreur JS', JSON.stringify(errs.slice(0, 3))); await ctx.close(); }

/* ═════ A85 — la poignée, aux quatre tailles ; dans l'Atelier et en répétition ═════ */
if (fait('A85')) for (const [W, H] of TAILLES) { const { ctx, pg, errs } = await ouvrirCtx(W, H);
  await entrerProf(pg); await pg.evaluate(() => { try { localStorage.removeItem('mjpc_atelier_colonne_gauche'); } catch (e) {} }); await ouvrirAtelier(pg); await p(pg, 1200);
  const tire = async dx => { const b = await pg.evaluate(() => { const g = document.getElementById('at-arbre-poignee'); if (!g || !g.offsetParent) return null; const r = g.getBoundingClientRect(); return { x: r.x + r.width / 2, y: Math.min(r.y + r.height / 2, innerHeight / 2) }; }); if (!b) return false; await pg.mouse.move(b.x, b.y); await pg.mouse.down(); for (let k = 1; k <= 8; k++) { await pg.mouse.move(b.x + dx * k / 8, b.y); await p(pg, 30); } await pg.mouse.up(); await p(pg, 500); return true; };
  const e0 = await etat(pg); await tire(120); const e1 = await etat(pg); await tire(-80); const e2 = await etat(pg);
  verif('A85', e0.poignee && e1.larg >= e0.larg + 100 && e1.zone < e0.zone && e2.larg <= e1.larg - 60, W + ' × ' + H + ' : tirer la poignée élargit la colonne (le centre se resserre), puis la réduit', JSON.stringify({ l: [e0.larg, e1.larg, e2.larg], zone: [e0.zone, e1.zone] }));
  await tire(-e2.larg - 40); const e3 = await etat(pg);
  verif('A85', e3.repliee && e3.larg === 0 && e3.poignee && e3.zone > e2.zone, W + ' × ' + H + ' : tout à gauche, elle se replie en un liseré (le centre prend la place)', JSON.stringify({ repliee: e3.repliee, larg: e3.larg, zone: [e2.zone, e3.zone] }));
  await pg.evaluate(() => document.getElementById('at-arbre-poignee').dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 5, clientY: 200 }))); await pg.evaluate(() => document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))); await p(pg, 500); const e4 = await etat(pg);
  verif('A85', !e4.repliee && Math.abs(e4.larg - e2.larg) <= 2, W + ' × ' + H + ' : un clic sur le liseré la rouvre, à sa largeur d\'avant', JSON.stringify({ larg: [e2.larg, e4.larg] }));
  await pg.dblclick('#at-arbre-poignee'); await p(pg, 400); const e5 = await etat(pg); await pg.dblclick('#at-arbre-poignee'); await p(pg, 400); const e6 = await etat(pg);
  verif('A85', e5.repliee && !e6.repliee && Math.abs(e6.larg - e2.larg) <= 2, W + ' × ' + H + ' : double-clic : replie, puis rouvre', JSON.stringify({ r: [e5.repliee, e6.repliee] }));
  /* la poignée de droite (Paul 23:22, « Oui 697 ») : tirer vers la gauche élargit la colonne de droite ; sa largeur est retenue au rechargement */
  await pg.evaluate(() => { try { localStorage.removeItem('mjpc_atelier_colonne_droite'); } catch (e) {} });
  const ld0 = await pg.evaluate(() => ({ ld: S.ld, rep: !!S.sansDroite, w: Math.round(document.getElementById('droite').getBoundingClientRect().width) }));
  const bd = await pg.evaluate(() => { const g = document.getElementById('pd'); if (!g || !g.offsetParent) return null; const r = g.getBoundingClientRect(); return { x: r.x + r.width / 2, y: Math.min(r.y + r.height / 2, innerHeight / 2) }; });
  if (bd) { await pg.mouse.move(bd.x, bd.y); await pg.mouse.down(); for (let k = 1; k <= 8; k++) { await pg.mouse.move(bd.x - 90 * k / 8, bd.y); await p(pg, 30); } await pg.mouse.up(); await p(pg, 600); }
  const ld1 = await pg.evaluate(() => ({ ld: S.ld, rep: !!S.sansDroite, w: Math.round(document.getElementById('droite').getBoundingClientRect().width), garde: localStorage.getItem('mjpc_atelier_colonne_droite') }));
  verif('A85', !!bd && ld1.ld >= ld0.ld + 70 && ld1.w >= ld0.w + 60 && !!ld1.garde, W + ' × ' + H + ' : la poignée de droite élargit la colonne de droite, et la largeur est rangée', JSON.stringify({ avant: ld0, apres: ld1 }));
  await pg.reload({ waitUntil: 'load' }); await p(pg, 1800); await pg.evaluate(() => { try { if (!(TRACK.eleve && TRACK.eleve.is_prof)) loginAsProf(); } catch (e) {} }); await p(pg, 2000); await sansVoiles(pg); await ouvrirAtelier(pg); await p(pg, 1200); const e7 = await etat(pg);
  verif('A85', Math.abs(e7.larg - e2.larg) <= 2, W + ' × ' + H + ' : la largeur est retenue au rechargement (ce navigateur)', JSON.stringify({ larg: [e2.larg, e7.larg] }));
  const ld2 = await pg.evaluate(() => ({ ld: S.ld, w: Math.round(document.getElementById('droite').getBoundingClientRect().width) }));
  verif('A85', ld2.ld === ld1.ld && Math.abs(ld2.w - ld1.w) <= 2, W + ' × ' + H + ' : la largeur de la colonne de droite est retenue au rechargement', JSON.stringify({ avant: ld1.ld, apres: ld2.ld, w: [ld1.w, ld2.w] }));
  const rep = await entrerRepetition(pg); await p(pg, 1200); const e8 = await etat(pg); let e9 = null; if (rep && e8.poignee) { await tire(60); e9 = await etat(pg); }
  verif('A85', rep && e8.poignee && e9 && e9.larg >= e8.larg + 40, W + ' × ' + H + ' : en répétition, la colonne a la même poignée et la même largeur', JSON.stringify({ rep, poignee: e8.poignee, larg: [e8.larg, e9 && e9.larg] }));
  if (CAPT && W === 1707) await pg.screenshot({ path: path.join(CAPT, 'A85-1707-' + SUFF + '-repetition.png') });
  await pg.evaluate(() => { try { localStorage.removeItem('mjpc_atelier_colonne_gauche'); localStorage.removeItem('mjpc_atelier_colonne_droite'); } catch (e) {} });
  verif('A85', errs.length === 0, W + ' × ' + H + ' : zéro erreur JS', JSON.stringify(errs.slice(0, 3))); await ctx.close(); }

await nav.close();
dire(`— fin : ${nb} vérifications · ${echecs} échec(s) — ${echecs ? 'ROUGE' : 'VERT'} · ${path.basename(FICHIER)} md5 ${MD5}`);
fs.writeFileSync(path.join(OUT, 'banc-1236.txt'), R.join('\n') + '\n');
process.exit(echecs ? 1 : 0);
