// LA SONDE DU RETOUR SÛR À LA 8.77.1-⑩ EN PLEINE HEURE (MANDATS/DEROULE-01-11/MANDAT-RETOUR-SUR.md §5.1) — par le geste.
// usage : node sonde-retour.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_CAPT=<dossier> : les captures, jamais poussées ; MJPC_ANCIENNE=<fichier> : la
//         8.77.1-⑩, sinon l'assemblé de fc036e8 tiré par git ; MJPC_PARTIES : R,I,T,B,X,G par défaut)
// Le modèle : la partie X de FIL-NAVIGATION/sonde-fil.mjs. Ici, le faux hub vit dans la sonde (Node) et tous les navigateurs le partagent — la nouvelle version,
// la 8.77.1-⑩ (le point de retour), le tableau distant (`?vue=tableau`) — comme sonde-1266. Faux hub : AUDITS/INTEGRATION-DEROULE/hub (jamais modifié),
// complété en mémoire par hub-ouverture.mjs (les phrases d'élève, la séance 1 jouable à son heure 1, les champs des diapos d'ouverture).
//  R · (§3.1) la nouvelle version lance l'heure 1 de la séance 1 HORS mode test (la case du 14/09 08:57), la fenêtre du tableau et le tableau distant ouverts ;
//      ▶ jusqu'à la première activité ; la classe écrit dans le parcours (l'objectif de la séance 1). La 8.77.1-⑩ reprend la même heure (la même case) : là où
//      Paul en était, aucune « Objet non lisible », les textes des diapos d'ouverture au pilote et à la fenêtre du tableau, le compteur, ce que la classe a écrit ;
//      la classe y écrit à son tour (l'objectif de la séance 2) ; ▶ continue. La nouvelle version revient : là où la 8.77.1-⑩ en était, le canon au pilote, à la
//      fenêtre du tableau, au tableau distant, le compteur juste, les deux écritures de la classe à leur place.
//  I · (§3.1, le sens inverse) la 8.77.1-⑩ lance l'heure, ▶ jusqu'à la première activité ; la nouvelle version la reprend : là où Paul en était, rien d'illisible,
//      les textes, le compteur ; ▶ continue ; la 8.77.1-⑩ relit.
//  T · (§3.2) les retraits : la nouvelle version retire les compétences du chapitre et le parcours ; la 8.77.1-⑩ fait des gestes ordinaires dans l'Atelier
//      (Alt + ↓ / Alt + ↑ sur une diapo ordinaire, une frappe dans une diapo) ; la nouvelle relit : les deux toujours retirées ; la 8.77.1-⑩ remet le parcours
//      (« ↶ ») : la nouvelle le voit remis, les compétences toujours retirées.
//  B · (§3.3) les compétences du chapitre en bilan (la dernière séance) : la nouvelle version y écrit (« ta version ») ; la 8.77.1-⑩ relit (un texte lisible,
//      les mots de Paul) ; la nouvelle relit (le canon, les mots de Paul).
//  X · (§3.4) la taxonomie retardée au faux hub : une diapo d'ouverture intacte marquée (renommée) ne part jamais au hub avec des libellés manquants.
//  G · (§3.5) le schéma « tableau » : les cinq œuvres aux cellules d'une phrase, aux trois tailles, tout dévoilé, au pilote et à la fenêtre du tableau : aucun
//      débord, aucun texte coupé ; un tableau aux cellules courtes identique avant / après (MJPC_AVANT=<assemblé d'avant> pour la comparaison).
// Aucune erreur JS, aucune boîte système, dans chaque cas. Code 1 si un échec.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto'; import { execSync } from 'child_process';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-retour.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; const dire = s => { R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + (typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 900) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'R,I,T,B,X,G').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');

/* la 8.77.1-⑩ : l'assemblé de fc036e8 (la production à APP_VERSION près) */
let ANC = process.env.MJPC_ANCIENNE || null; let ancTiree = false;
if (!ANC) { try { ANC = path.join(OUT, '_ancienne-8.77.1.html'); fs.writeFileSync(ANC, execSync('git -C "' + RACINE + '" show fc036e8:LIVRAISONS/INTEGRATION/assemble/index.html', { maxBuffer: 1e8 })); ancTiree = true; } catch (e) { ANC = null; } }
dire('C16 · sonde du retour sûr à la 8.77.1-⑩ · parties ' + PARTIES.join(' ') + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · nouvelle version md5 ' + md5(FICHIER) + ' · 8.77.1-⑩ md5 ' + (ANC && fs.existsSync(ANC) ? md5(ANC) : '—'));

/* ── la séance 1 du faux hub, réaliste (comme sonde-fil.mjs) : dans l'heure 1, « Tableau 2 » devient le tableau des cinq œuvres ── */
const LONG = 'Tableau | Peintre | Ce qu’on voit\n'
  + 'Le Radeau de la Méduse (1819) | Théodore Géricault | des naufragés perdus sur une mer immense, entassés sur un radeau, un seul agite un tissu vers un bateau minuscule à l’horizon\n'
  + 'Le lac (1863) | Albert Bierstadt | des montagnes immenses dans une lumière dorée, et les hommes ne sont que des points au bord de l’eau\n'
  + 'Pêcheurs en mer (1796) | William Turner | une barque prise dans la tempête, la nuit, sous un ciel noir que la lune perce à peine\n'
  + 'Cathédrale gothique au bord de l’eau (1813) | Karl Friedrich Schinkel | une cathédrale au soleil couchant, comme un rêve du Moyen Âge au-dessus d’une ville\n'
  + 'Le Voyageur contemplant une mer de nuages (1818) | Caspar David Friedrich | un homme de dos, seul sur un rocher, qui regarde une mer de nuages et des sommets';
const COURT = 'Tableau | Peintre | Ce qu’on voit\nLe Radeau de la Méduse | Géricault | des naufragés\nLe lac | Bierstadt | des montagnes immenses\nPêcheurs en mer | Turner | une tempête la nuit\nLa ville au bord de l’eau | Schinkel | une cathédrale\nLe Voyageur | Friedrich | un homme de dos';
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const store = (src = LONG) => { const st = storeOuverture(RACINE, { champs: true }); const ch = st.site['3e'].chapitres[0];
  const E = ch.seances[sk0(st)[0]].deroule.ecrans; const t2 = E.find(e => e && e.act === 'Tableau 2');
  if (t2) { t2.act = 'Les cinq tableaux'; t2.blocs = [{ t: 'schema', forme: 'tableau', id: 'bsonde-tab', titre: 'Les cinq tableaux', src }]; }
  return st; };

/* ── le faux hub partagé (Node) : chaque navigateur y lit et y écrit ; `RETARD` retarde une adresse (la taxonomie, §3.4) ── */
let HUBN = null; let ECR = []; const RETARD = {};
const lireH = c => { const q = c.split('/').filter(Boolean); let n = HUBN; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; };
const posH = (c, v) => { const q = c.split('/').filter(Boolean); let n = HUBN; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
const hubRepondre = async (qui, m, c, corps) => { if (m === 'GET') { const d = Object.keys(RETARD).find(x => c === x || c.startsWith(x + '/')); if (d) await p(RETARD[d]); return JSON.stringify(lireH(c)); }
  let bd = null; try { bd = JSON.parse(corps || 'null'); } catch (e) {} ECR.push({ qui, m, c, t: Date.now(), bd });
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ouvrir = async ({ qui = 'pilote', fichier = FICHIER, W = 1536, H = 864, q = '?n=3e', test = false, prof = true, h = '09:00' }) => {   /* h : l'heure de la montre (le temps passe d'une reprise à l'autre) */
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' }); const errs = [], boites = [];
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const m = /mjpc-medias\/.*\/([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (m) return r.fulfill({ path: IMG_OUV[m[1]] || IMG_DEFAUT, contentType: 'image/png' }); return r.abort(); });
  await ctx.exposeFunction('__hubN', (m, c, corps) => hubRepondre(qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  ctx.on('page', pg => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); });
  const pg = await ctx.newPage(); await pg.clock.setFixedTime(new Date('2026-09-14T' + h + ':00+02:00'));
  await pg.goto('file://' + fichier + q, { waitUntil: 'load' }); await p(1800);
  if (prof) { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
    await pg.click('#tprof-btn'); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; }); }
  return { ctx, pg, errs, boites, qui }; };
const capt = async (pg, nom) => { if (CAPT && pg) await pg.screenshot({ path: path.join(CAPT, nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const sansErreur = (k, o, quoi) => verif(k, !o.errs.length && !o.boites.length, quoi + ' : aucune erreur JS, aucune boîte système', o.errs.concat(o.boites).join(' ; '));
/* l'heure de la classe, par la case de l'emploi du temps (le bouton « Emploi du temps », la case, « ▶ Ouvrir le pilotage et lancer ») ; la fenêtre du tableau */
const lancerClasse = async (o, jour = '2026-09-14') => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'edtOuvrir()'))) await pg.evaluate(() => edtOuvrir()); await p(1500);
  const ok = await pg.evaluate(j => { const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); const c = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!c) return false; c.click(); return true; }, jour); await p(800);
  const l = ok && await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'); await p(3500); await pg.keyboard.press('Escape'); await p(400); return !!l; };
/* Paul recharge la page : le bandeau « Heure en cours avec les 3E Charles de Gaulle — Reprendre » (sinon la case de l'emploi du temps) */
const reprendre = async o => { const pg = o.pg; const b = await pg.waitForSelector('#ses-reprise-oui', { state: 'visible', timeout: 9000 }).then(() => pg.click('#ses-reprise-oui')).then(() => true).catch(() => false);
  if (!b) return { par: 'case', ok: await lancerClasse(o) }; await p(3500); await pg.keyboard.press('Escape'); await p(400); return { par: 'bandeau', ok: true }; };
const ouvrirTableau = async (o, W = 1280, H = 720) => { if (!(await o.pg.isVisible('#bvideoproj').catch(() => false))) return null; const [fen] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), o.pg.click('#bvideoproj')]); await p(1500); if (fen) await fen.setViewportSize({ width: W, height: H }); await o.pg.bringToFront(); return fen; };
const ouvrirAtelier = async o => { const pg = o.pg; if (!(await clicTexte(pg, 'button', 'atelierOuvrir()'))) await pg.evaluate(() => atelierOuvrir()); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(3000); };
/* ce que la page montre */
const ici_ = pg => pg.evaluate(() => { const v = document.querySelector('#volet .vig.cour'); const c = document.getElementById('compte'); const m = document.getElementById('mur'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {}
  return { vig: v ? v.dataset.i : null, eid, compte: c ? c.textContent.trim() : '', numero: ((document.getElementById('numero') || {}).textContent || '').replace(/\s+/g, ' ').trim(), garde: !!(document.getElementById('garde') || { classList: { contains: () => false } }).classList.contains('on'),
    texte: m ? (m.innerText || '').replace(/\s+/g, ' ').trim() : '', ouv: m && m.querySelector(':scope > .ouv') ? m.querySelector(':scope > .ouv').className : '', illisible: /Objet non lisible/.test((document.body.innerText || '')) }; });
const murDe = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); if (!m) return null; const o = m.querySelector('.ouv'); return { texte: (m.innerText || '').replace(/\s+/g, ' ').trim(), ouv: o ? o.className : '', illisible: /Objet non lisible/.test(m.innerText || '') }; }, sel);
const vignettes = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet .vig')).map(v => ({ i: v.dataset.i, pg: v.dataset.pg, t: (v.innerText || '').replace(/\s+/g, ' ').trim() })));
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, role: e.role || '', act: e.act })); } catch (e) { return []; } });
/* aller à une diapo par sa vignette (la garde : « Y aller devant la classe ») */
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(500); if (await pg.evaluate(() => document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))) { await pg.click('#garde-devant'); await p(900); } return true; };
const copieDe = (sk, slug = null) => { const se = lireH('/site/3e/chapitres/0/seances/' + sk) || {}; const dj = se.deroule_joue || {}; const k = slug || Object.keys(dj)[0]; return k ? Object.assign({ slug: k }, dj[k]) : null; };
const ROLES_OUV = ['presentation-chapitre', 'competences-chapitre', 'plan', 'presentation-seance', 'problematique', 'competences-bilan'];

/* ═══ R · (§3.1) une heure commencée avec la nouvelle version, reprise dans la 8.77.1-⑩, puis de nouveau dans la nouvelle ═══ */
if (joue('R') && ANC) { dire(''); dire('══ R · 1536×864 · hors mode test · la nouvelle version commence l’heure, la 8.77.1-⑩ la reprend, la nouvelle revient ══');
  HUBN = store(); ECR = []; const k0 = sk0(HUBN)[0];
  /* R1 · la nouvelle version : le tableau distant attend, l'heure se lance, ▶ jusqu'à la première activité */
  let T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(1500);
  let o = await ouvrir({}); verif('R', await lancerClasse(o), 'R1 · la nouvelle version : l’heure se lance par la case de l’emploi du temps (« ▶ Ouvrir le pilotage et lancer »), hors mode test');
  let fen = await ouvrirTableau(o); await o.pg.click('#numero'); await p(300);
  const vus = {}; const tabVus = {}; let n = 0, ecritK = false;
  while (n++ < 60) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role;
    if (!ROLES_OUV.includes(role)) break;
    vus[role] = { compte: s.compte, ouv: s.ouv, texte: s.texte, eid: s.eid };
    const fini = /^(\d+) \/ \1 dévoilés/.test(s.compte);
    if (fini) { await p(1500); tabVus[role] = await murDe(T.pg, 'body'); const f2 = await murDe(fen, '#mur2'); vus[role].fen = f2;
      if (role === 'plan' && !ecritK) { /* la classe écrit dans le parcours : l'objectif de la séance 1 (un clic sur son texte, la frappe, Échap) */
        const x = await o.pg.$('#mur > .ouv [data-p="0.1"]'); if (x) { await x.click(); await p(300); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (à revoir ensemble)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(800); ecritK = true; }
        vus[role].apres = (await ici_(o.pg)).texte; await o.pg.click('#numero').catch(() => {}); await p(200); }
      await capt(o.pg, 'R1-nouvelle-' + role + '-pilote'); if (fen) await capt(fen, 'R1-nouvelle-' + role + '-tableau'); await capt(T.pg, 'R1-nouvelle-' + role + '-distant'); }
    await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(2500); const posN = await ici_(o.pg); await capt(o.pg, 'R1-nouvelle-premiere-activite');
  const rolesVus = Object.keys(vus); const C1 = copieDe(k0); const E1 = (C1 && C1.ecrans) || [];
  verif('R', rolesVus.length >= 5 && rolesVus.every(r => /^ouv /.test(vus[r].ouv)) && !ROLES_OUV.includes(((await eidsDe(o.pg)).find(e => e.eid === posN.eid) || {}).role), 'R1 · ▶ passe les diapos d’ouverture au canon (' + rolesVus.join(', ') + ') jusqu’à la première activité (« ' + posN.numero.slice(0, 60) + ' »)', rolesVus.map(r => r + ' ' + vus[r].compte));
  verif('R', ecritK && /\(à revoir ensemble\)/.test(vus.plan && vus.plan.apres || ''), 'R1 · la classe écrit dans le parcours, en classe (un clic sur l’objectif de la séance 1) : « (à revoir ensemble) » au pilote', (vus.plan || {}).apres ? vus.plan.apres.slice(0, 200) : '');
  verif('R', rolesVus.every(r => vus[r].fen && /^ouv /.test(vus[r].fen.ouv) && !vus[r].fen.illisible) && rolesVus.every(r => tabVus[r] && /\bouv\b/.test(tabVus[r].ouv) && !tabVus[r].illisible), 'R1 · chaque diapo d’ouverture au canon à la fenêtre du tableau ET au tableau distant (la copie relue du hub : le canon)', rolesVus.map(r => r + ' fen:' + (vus[r].fen || {}).ouv + ' distant:' + (tabVus[r] || {}).ouv));
  const ouvAuHub = E1.filter(e => (e.blocs || []).some(b => b && b.t === 'ouverture')).map(e => e.role); const lis = E1.filter(e => ROLES_OUV.includes(e.role) && e.ouvCanon && (e.blocs || [])[0] && e.blocs[0].t === 'texte');
  verif('R', E1.length && !ouvAuHub.length && lis.length >= 5, 'R1 · au hub, la copie de la classe (' + E1.length + ' diapos) : aucun bloc « ouverture » (ce que la 8.77.1-⑩ dit « Objet non lisible ») ; ' + lis.length + ' diapos d’ouverture en un bloc de texte lisible, le canon sous « ouvCanon »', { ouverture: ouvAuHub, lisibles: lis.map(e => e.role + ' ' + e.blocs[0].el.length + ' ligne(s)') });
  const S1 = ((C1 || {}).etat || {}).S || {}; const cp1 = JSON.stringify(S1.copie || {}); verif('R', /à revoir ensemble/.test(cp1) && /ouvEl/.test(cp1), 'R1 · au hub, l’état de l’heure : ce que la classe a écrit dans le parcours, en ligne lisible (« titre — objectif ») et en textes sous « ouvEl »', cp1.slice(0, 400));
  sansErreur('R', o, 'R1 · la nouvelle version'); sansErreur('R', T, 'R1 · le tableau distant'); await o.ctx.close(); await T.ctx.close();
  /* R2 · la 8.77.1-⑩ remise en ligne : Paul recharge et reprend la même heure */
  o = await ouvrir({ fichier: ANC, h: '09:03' }); const rA = await reprendre(o); const lanceA = rA.ok && rA.par === 'bandeau'; await capt(o.pg, 'R2-ancienne-apres-lancer'); fen = await ouvrirTableau(o); await p(1500);
  const posA = await ici_(o.pg); const vigA = await vignettes(o.pg); await capt(o.pg, 'R2-ancienne-reprise'); if (fen) await capt(fen, 'R2-ancienne-reprise-tableau');
  verif('R', lanceA && posA.eid === posN.eid && posA.compte === posN.compte, 'R2 · Paul recharge : la 8.77.1-⑩ reprend l’heure (« Reprendre », le bandeau « Heure en cours ») là où Paul en était : la même diapo, le même compteur', { nouvelle: [posN.eid, posN.compte], ancienne: [posA.eid, posA.compte] });
  verif('R', !posA.illisible && !vigA.some(v => /non lisible/i.test(v.t)), 'R2 · aucune « Objet non lisible » au pilote (la diapo, les ' + vigA.length + ' vignettes)', vigA.filter(v => /non lisible/i.test(v.t)).map(v => v.i));
  const lusA = {}; for (const r of rolesVus) { await allerA(o.pg, vus[r].eid); await p(600); const s = await ici_(o.pg); const f = fen ? await murDe(fen, '#mur2') : null; lusA[r] = { s, f }; await capt(o.pg, 'R2-ancienne-' + r + '-pilote'); if (fen) await capt(fen, 'R2-ancienne-' + r + '-tableau'); }
  const att = { 'presentation-chapitre': /Poésie|poésie/, 'competences-chapitre': / : /, plan: /\(à revoir ensemble\)/, 'presentation-seance': /Observer cinq tableaux/, problematique: /\?/ };
  verif('R', rolesVus.every(r => lusA[r].s.texte && !lusA[r].s.illisible && !lusA[r].s.ouv && (!att[r] || att[r].test(lusA[r].s.texte)) && lusA[r].f && !lusA[r].f.illisible && lusA[r].f.texte.length > 10), 'R2 · les diapos d’ouverture déjà montrées : leurs textes au pilote et à la fenêtre du tableau (en texte, la 8.77.1-⑩ n’a pas le canon), dont ce que la classe a écrit dans le parcours', rolesVus.map(r => r + ' « ' + lusA[r].s.texte.slice(0, 90) + ' » | tableau « ' + ((lusA[r].f || {}).texte || '').slice(0, 50) + ' »'));
  verif('R', rolesVus.every(r => lusA[r].s.compte === vus[r].compte), 'R2 · le compteur de chaque diapo d’ouverture : le même que dans la nouvelle version (ce qui est dévoilé se relit juste)', rolesVus.map(r => r + ' ' + vus[r].compte + ' | ' + lusA[r].s.compte));
  /* la classe écrit dans le parcours de la 8.77.1-⑩ : la ligne de la séance 2 */
  await allerA(o.pg, vus.plan.eid); const l2 = await o.pg.$$('#mur [data-p]'); let ecritA = false; { const cand = await o.pg.$$eval('#mur [data-p]', xs => xs.map(x => x.getAttribute('data-p'))); const h = await o.pg.$('#mur [data-p="0.1"]'); if (h) { await h.click(); await p(300); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (avec Friedrich)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(1200); ecritA = /\(avec Friedrich\)/.test((await ici_(o.pg)).texte); } dire('      R2 · le parcours dans la 8.77.1-⑩ : ses textes ' + JSON.stringify(cand)); }
  verif('R', ecritA, 'R2 · la classe écrit dans le parcours de la 8.77.1-⑩ (la ligne de la séance 2) : « (avec Friedrich) »');
  await allerA(o.pg, posA.eid); await o.pg.click('#numero').catch(() => {}); for (let k = 0; k < 3; k++) { await o.pg.keyboard.press('ArrowRight'); await p(400); } await p(2500); const posA2 = await ici_(o.pg); await capt(o.pg, 'R2-ancienne-continue');
  verif('R', posA2.compte !== posA.compte || posA2.eid !== posA.eid, 'R2 · ▶ continue dans la 8.77.1-⑩', { avant: [posA.eid, posA.compte], apres: [posA2.eid, posA2.compte] });
  const C2 = copieDe(k0); verif('R', (C2.ecrans || []).filter(e => e.ouvCanon).length === lis.length, 'R2 · la 8.77.1-⑩ réécrit la copie au hub en gardant « ouvCanon » (sans le lire)', (C2.ecrans || []).filter(e => e.ouvCanon).map(e => e.role));
  sansErreur('R', o, 'R2 · la 8.77.1-⑩'); await o.ctx.close();
  /* R3 · la nouvelle version revient */
  T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false, h: '09:06' }); await p(1500);
  o = await ouvrir({ h: '09:06' }); const rN = await reprendre(o); const lanceN = rN.ok && rN.par === 'bandeau'; fen = await ouvrirTableau(o); await p(1500); const posN2 = await ici_(o.pg); await capt(o.pg, 'R3-nouvelle-reprise');
  verif('R', lanceN && posN2.eid === posA2.eid && posN2.compte === posA2.compte && !posN2.illisible, 'R3 · la nouvelle version reprend là où la 8.77.1-⑩ en était (la même diapo, le même compteur)', { ancienne: [posA2.eid, posA2.compte], nouvelle: [posN2.eid, posN2.compte] });
  const lusN = {}; for (const r of rolesVus) { await allerA(o.pg, vus[r].eid); await p(1800); lusN[r] = { s: await ici_(o.pg), f: fen ? await murDe(fen, '#mur2') : null, t: await murDe(T.pg, 'body') }; await capt(o.pg, 'R3-nouvelle-' + r + '-pilote'); if (fen) await capt(fen, 'R3-nouvelle-' + r + '-tableau'); await capt(T.pg, 'R3-nouvelle-' + r + '-distant'); }
  verif('R', rolesVus.every(r => lusN[r].s.ouv === vus[r].ouv && lusN[r].f && lusN[r].f.ouv === vus[r].fen.ouv && lusN[r].t && /\bouv\b/.test(lusN[r].t.ouv) && !lusN[r].t.illisible), 'R3 · le canon de chaque diapo d’ouverture au pilote, à la fenêtre du tableau et au tableau distant', rolesVus.map(r => r + ' ' + lusN[r].s.ouv + ' | ' + ((lusN[r].f || {}).ouv) + ' | ' + ((lusN[r].t || {}).ouv)));
  verif('R', rolesVus.every(r => lusN[r].s.compte === vus[r].compte), 'R3 · le compteur de chaque diapo d’ouverture, juste', rolesVus.map(r => r + ' ' + vus[r].compte + ' | ' + lusN[r].s.compte));
  const pl = await (async () => { await allerA(o.pg, vus.plan.eid); await p(800); return o.pg.evaluate(() => ({ s1: ((document.querySelector('#mur > .ouv [data-p="0.1"]') || {}).textContent || ''), s2: ((document.querySelector('#mur > .ouv [data-p="0.3"]') || {}).textContent || ''), t: (document.getElementById('mur').innerText || '').replace(/\s+/g, ' ') })); })();
  const plT = await murDe(T.pg, 'body'); await capt(o.pg, 'R3-nouvelle-parcours-ecrit'); await capt(T.pg, 'R3-nouvelle-parcours-ecrit-distant');
  verif('R', /\(à revoir ensemble\)$/.test(pl.s1.trim()) && /\(avec Friedrich\)$/.test(pl.s2.trim()) && !/à revoir ensemble \(avec|Friedrich\).*Friedrich/.test(pl.t) && /\(avec Friedrich\)/.test(plT.texte), 'R3 · ce que la classe a écrit, dans les deux versions, à sa place dans le canon : l’objectif de la séance 1 (nouvelle version), celui de la séance 2 (8.77.1-⑩) ; au tableau distant aussi', { s1: pl.s1, s2: pl.s2 });
  await allerA(o.pg, posN2.eid); await o.pg.click('#numero').catch(() => {}); await o.pg.keyboard.press('ArrowRight'); await p(2500); const C3 = copieDe(k0);
  verif('R', !(C3.ecrans || []).some(e => (e.blocs || []).some(b => b && b.t === 'ouverture')) && (C3.ecrans || []).filter(e => e.ouvCanon).length === lis.length, 'R3 · réécrite par la nouvelle version, la copie reste lisible par la 8.77.1-⑩ (aucun bloc « ouverture » au hub)');
  sansErreur('R', o, 'R3 · la nouvelle version'); sansErreur('R', T, 'R3 · le tableau distant'); await o.ctx.close(); await T.ctx.close(); }

/* ═══ I · le sens inverse : une heure commencée dans la 8.77.1-⑩, reprise dans la nouvelle version ═══ */
if (joue('I') && ANC) { dire(''); dire('══ I · 1536×864 · hors mode test · la 8.77.1-⑩ commence l’heure, la nouvelle version la reprend ══');
  HUBN = store(); ECR = []; const k0 = sk0(HUBN)[0];
  let o = await ouvrir({ fichier: ANC }); verif('I', await lancerClasse(o), 'I1 · la 8.77.1-⑩ lance l’heure (la case du 14/09)'); let fen = await ouvrirTableau(o); await o.pg.click('#numero'); await p(300);
  const vus = {}; let n = 0; while (n++ < 60) { const s = await ici_(o.pg); const L = await eidsDe(o.pg); const role = (L.find(e => e.eid === s.eid) || {}).role; if (!ROLES_OUV.includes(role)) break; vus[role] = { compte: s.compte, texte: s.texte, eid: s.eid }; await o.pg.keyboard.press('ArrowRight'); await p(350); }
  await p(2500); const posA = await ici_(o.pg); await capt(o.pg, 'I1-ancienne-premiere-activite'); sansErreur('I', o, 'I1 · la 8.77.1-⑩'); await o.ctx.close();
  o = await ouvrir({ h: '09:03' }); const rI = await reprendre(o); const l2 = rI.ok && rI.par === 'bandeau'; fen = await ouvrirTableau(o); await p(1500); const posN = await ici_(o.pg); const vigN = await vignettes(o.pg); await capt(o.pg, 'I2-nouvelle-reprise');
  verif('I', l2 && posN.eid === posA.eid && posN.compte === posA.compte && !posN.illisible && !vigN.some(v => /non lisible/i.test(v.t)), 'I2 · la nouvelle version reprend là où la 8.77.1-⑩ en était (la même diapo, le même compteur), rien d’illisible', { ancienne: [posA.eid, posA.compte], nouvelle: [posN.eid, posN.compte] });
  const lus = {}; for (const r of Object.keys(vus)) { await allerA(o.pg, vus[r].eid); await p(700); lus[r] = { s: await ici_(o.pg), f: fen ? await murDe(fen, '#mur2') : null }; }
  verif('I', Object.keys(vus).length >= 3 && Object.keys(vus).every(r => lus[r].s.compte === vus[r].compte && lus[r].s.texte === vus[r].texte && lus[r].f && !lus[r].f.illisible && lus[r].f.texte.length > 10), 'I2 · les diapos d’ouverture montrées par la 8.77.1-⑩ (' + Object.keys(vus).join(', ') + ') : les mêmes textes et le même compteur au pilote, et leurs textes à la fenêtre du tableau (ce qui a été joué ne change plus)', Object.keys(vus).map(r => r + ' ' + vus[r].compte + '|' + lus[r].s.compte + ' ' + (lus[r].s.texte === vus[r].texte ? '=' : '≠ « ' + lus[r].s.texte.slice(0, 60) + ' »')));
  await allerA(o.pg, posN.eid); await o.pg.click('#numero').catch(() => {}); for (let k = 0; k < 3; k++) { await o.pg.keyboard.press('ArrowRight'); await p(400); } await p(2500); const posN2 = await ici_(o.pg);
  verif('I', posN2.compte !== posN.compte || posN2.eid !== posN.eid, 'I2 · ▶ continue dans la nouvelle version'); sansErreur('I', o, 'I2 · la nouvelle version'); await o.ctx.close();
  o = await ouvrir({ fichier: ANC, h: '09:06' }); const rI3 = await reprendre(o); const l3 = rI3.ok && rI3.par === 'bandeau'; await p(1000); const posA3 = await ici_(o.pg); const vigA = await vignettes(o.pg); await capt(o.pg, 'I3-ancienne-relit');
  verif('I', l3 && posA3.eid === posN2.eid && posA3.compte === posN2.compte && !posA3.illisible && !vigA.some(v => /non lisible/i.test(v.t)), 'I3 · la 8.77.1-⑩ reprend de nouveau : la même diapo, le même compteur, rien d’illisible', { nouvelle: [posN2.eid, posN2.compte], ancienne: [posA3.eid, posA3.compte] });
  sansErreur('I', o, 'I3 · la 8.77.1-⑩'); await o.ctx.close(); }

/* ═══ T · (§3.2) les retraits que la 8.77.1-⑩ ne voit pas ═══ */
const lignesX = pg => pg.evaluate(() => Array.from(document.querySelectorAll('#volet [data-at-di]')).map(d => ({ di: +d.dataset.atDi, eid: d.dataset.eid, t: ((d.querySelector('.t') || d).textContent || '').replace(/\s+/g, ' ').trim() })));
const retirer = async (pg, eid) => { const sel = '#volet [data-eid="' + eid + '"] .t'; if (!(await pg.$(sel))) return false; await pg.evaluate(s2 => { const d = document.querySelector(s2); if (d) d.scrollIntoView({ block: 'center' }); }, sel); await p(300);
  await pg.click(sel, { button: 'right' }); await p(400); await pg.evaluate(() => { const b = document.querySelector('#menu.on [data-a="supprimer"]'); if (b) b.click(); }); await p(700);
  await pg.evaluate(() => { const m = document.getElementById('at-modale'); const b = m && Array.from(m.querySelectorAll('button')).find(x => /^Retirer$/.test(x.textContent.trim())); if (b) b.click(); }); await p(3000); return !(await pg.$(sel)); };
const derouleDe = k => lireH('/site/3e/chapitres/0/seances/' + k + '/deroule') || {};
if (joue('T') && ANC) { dire(''); dire('══ T · 1536×864 · les retraits : la nouvelle version retire, la 8.77.1-⑩ fait ses gestes ordinaires dans l’Atelier, la nouvelle relit ══');
  HUBN = store(); ECR = []; const k0 = sk0(HUBN)[0]; const eK = 'inv-competences-chapitre-s' + k0, eP = 'inv-plan-s' + k0, eS = 'inv-presentation-seance-s' + k0;
  /* T1 · la nouvelle version retire les compétences du chapitre et le parcours */
  let o = await ouvrir({}); await ouvrirAtelier(o); const r1 = await retirer(o.pg, eK), r2 = await retirer(o.pg, eP); await p(1500); const d1 = derouleDe(k0); await capt(o.pg, 'T1-nouvelle-retire');
  verif('T', r1 && r2 && (d1.retraits || []).includes('competences-chapitre') && (d1.retraits || []).includes('plan') && (d1.retraits || []).includes('canon') && d1.ouvRetraits && (d1.ouvRetraits.r || []).includes('competences-chapitre'), 'T1 · la nouvelle version « Retire » les compétences du chapitre et le parcours : au hub, « retraits » ' + JSON.stringify(d1.retraits) + ' et « ouvRetraits » ' + JSON.stringify(d1.ouvRetraits));
  sansErreur('T', o, 'T1 · la nouvelle version'); await o.ctx.close();
  /* T2 · la 8.77.1-⑩ : Alt + ↓ / Alt + ↑ sur une diapo ordinaire, une frappe dans une diapo */
  o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); let L = await lignesX(o.pg); const ord = L.find(l => !/^inv-|^fin-/.test(l.eid));
  await (await o.pg.$('#volet [data-eid="' + ord.eid + '"] .t')).click(); await p(600); await o.pg.keyboard.press('Alt+ArrowDown'); await p(1500); await o.pg.keyboard.press('Alt+ArrowUp'); await p(2000);
  const tx = await o.pg.$('#mur [data-p="0.0"]'); let frappe = false; if (tx) { await tx.click(); await p(300); await o.pg.keyboard.press('Control+End'); await o.pg.keyboard.type(' (en silence)', { delay: 15 }); await o.pg.keyboard.press('Escape'); await p(2500); frappe = true; }
  const d2 = derouleDe(k0); const ecA = ECR.filter(e => e.qui === 'pilote' && /\/deroule(\/|$)/.test(e.c)).length; await capt(o.pg, 'T2-ancienne-gestes');
  verif('T', frappe && ecA > 0 && /\(en silence\)/.test(JSON.stringify(d2.ecrans || [])), 'T2 · la 8.77.1-⑩ fait ses gestes ordinaires dans l’Atelier (Alt + ↓, Alt + ↑ sur « ' + ord.t.slice(0, 40) + ' », une frappe « (en silence) ») et réécrit le déroulé (' + ecA + ' écriture(s)) : au hub, « retraits » ' + JSON.stringify(d2.retraits || null) + ', « ouvRetraits » ' + JSON.stringify(d2.ouvRetraits || null));
  sansErreur('T', o, 'T2 · la 8.77.1-⑩'); await o.ctx.close();
  /* T3 · la nouvelle version relit */
  o = await ouvrir({}); await ouvrirAtelier(o); L = await lignesX(o.pg); await capt(o.pg, 'T3-nouvelle-relit');
  verif('T', L.length > 10 && !L.some(l => l.eid === eK) && !L.some(l => l.eid === eP) && L.some(l => l.eid === eS), 'T3 · la nouvelle version relit : les compétences du chapitre et le parcours toujours retirés (le début de séance est là)', L.filter(l => /^inv-/.test(l.eid)).map(l => l.eid));
  sansErreur('T', o, 'T3 · la nouvelle version'); await o.ctx.close();
  /* T4 · la 8.77.1-⑩ retire le parcours et le remet (Ctrl + Z : son seul geste pour remettre une diapo d'ouverture), retire le début de séance ; la nouvelle relit */
  HUBN = store(); ECR = [];
  o = await ouvrir({}); await ouvrirAtelier(o); const r4 = await retirer(o.pg, eK); await p(1500); sansErreur('T', o, 'T4 · la nouvelle version retire les compétences du chapitre'); await o.ctx.close();
  o = await ouvrir({ fichier: ANC }); await ouvrirAtelier(o); const r5 = await retirer(o.pg, eP); await o.pg.keyboard.press('Control+z'); await p(2500); L = await lignesX(o.pg); const remis = L.some(l => l.eid === eP); const r6 = await retirer(o.pg, eS); await p(2000);
  const d4 = derouleDe(k0); await capt(o.pg, 'T4-ancienne-remet');
  verif('T', r4 && r5 && remis && r6 && !(d4.retraits || []).includes('plan') && (d4.retraits || []).includes('presentation-seance'), 'T4 · la 8.77.1-⑩ retire le parcours puis le remet (Ctrl + Z), retire le début de séance : au hub, « retraits » ' + JSON.stringify(d4.retraits || null) + ', « ouvRetraits » ' + JSON.stringify(d4.ouvRetraits || null));
  sansErreur('T', o, 'T4 · la 8.77.1-⑩'); await o.ctx.close();
  o = await ouvrir({}); await ouvrirAtelier(o); L = await lignesX(o.pg); await capt(o.pg, 'T5-nouvelle-relit');
  verif('T', !L.some(l => l.eid === eK) && L.some(l => l.eid === eP) && !L.some(l => l.eid === eS), 'T5 · la nouvelle version relit : les compétences du chapitre toujours retirées, le parcours remis, le début de séance retiré (les quatre rôles de la 8.77.1-⑩ se lisent dans « retraits »)', L.filter(l => /^inv-/.test(l.eid)).map(l => l.eid));
  sansErreur('T', o, 'T5 · la nouvelle version'); await o.ctx.close(); }

dire(''); dire('— fin : ' + nb + ' vérifications, ' + echecs + ' échec(s) · ' + (echecs ? 'ROUGE' : 'VERT'));
fs.writeFileSync(path.join(OUT, 'sonde-retour.txt'), R.join('\n') + '\n'); if (ancTiree) try { fs.unlinkSync(ANC); } catch (e) {}
await nav.close(); process.exit(echecs ? 1 : 0);
