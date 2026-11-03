// LA SONDE DU LOT 1 (MANDATS/DEROULE-01-11/MANDAT-LOT1.md §2) — 359, 360, 361, par le geste, sous le faux hub RANGÉ COMME LE VRAI, qui REFUSE (HTTP 400) les
// clés interdites et qui POUSSE son flux (EventSource). Le harnais : celui de l'auditeur I (AUDIT-GLOBAL/sonde-audit-I.mjs, branche audit/global-I), repris
// tel quel, avec la MONTRE DU NAVIGATEUR (seule `Date` est décalée au jour voulu ; les minuteries sont celles du navigateur, jamais `page.clock`) ; les gestes
// et le faux hub de la partie K/M de l'auditeur II (AUDIT-GLOBAL/sonde-II.mjs, branche audit/global-II : la trame de Paul, « 3 DYLAN Bob » appariée à
// « CLASSE TEST », le paquet de la forme lue au vrai hub). Aucune écriture ni lecture du vrai hub. Aucun nom d'élève dans ce qui sort (« ÉLÈVE n »).
// usage : node sonde-lot1.mjs <assemble/index.html> [dossier-de-sortie]   (MJPC_PARTIES=K,M,W,P ; MJPC_CAPT=<captures> ; MJPC_TAG=<nom de la passe>)
//  K  359 · un paquet `deroule_joue/<clé>` SANS `classe` (la forme exacte de lundi) puis AVEC : la case de CLASSE TEST (rien joué), « heure n/N », les
//     cartes, « Le parcours du chapitre », le bilan des compétences, l'heure proposée hors de l'emploi du temps ; la classe du paquet a sa séance jouée
//  M  359 · le mode test pendant un essai : la pastille (M1) ; la page rechargée et « Reprendre » (M2) ; un autre onglet du même navigateur, l'onglet de
//     l'essai fermé, puis l'annonce d'essai retirée par une répétition en mode test arrêtée ailleurs (M3) — ce qui part au vrai `deroule_joue`, compté
//  W  360 · la fenêtre « … joue déjà sur un autre appareil » : les quatre cas de l'auditeur I §1.2 × les trois boutons (nom, infobulle, ce que fait le clic)
//  P  361 · la participation : la liste en répétition (la classe répétée + la classe d'essai) ; des initiales exactes, inversées, début de prénom, de personne,
//     pendant la frappe, à Entrée, à Tab, au clic dans la réponse ; le VIF et la palette ; dans les trois sessions (répétition, mode test, vraie heure)
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { createHash } from 'crypto';
const ici = path.dirname(new URL(import.meta.url).pathname); const RACINE = path.resolve(ici, '..', '..', '..');
const { storeOuverture } = await import(path.join(RACINE, 'LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs'));
const FICHIER = path.resolve(process.argv[2] || ''); const OUT = path.resolve(process.argv[3] || path.join(ici, 'sorties'));
if (!process.argv[2] || !fs.existsSync(FICHIER)) { console.log('usage : node sonde-lot1.mjs <index.html> [dossier]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true }); const CAPT = process.env.MJPC_CAPT || null; if (CAPT) fs.mkdirSync(CAPT, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const R = []; let nb = 0, echecs = 0; let anonF = s => s; const dire = s => { s = anonF(String(s)); R.push(s); console.log(s); };
const verif = (k, ok, quoi, det) => { nb++; if (!ok) echecs++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (det != null && det !== '' ? ' — ' + anonF(typeof det === 'string' ? det : JSON.stringify(det)).slice(0, 1200) : '')); return !!ok; };
const p = ms => new Promise(r => setTimeout(r, ms));
const PARTIES = String(process.env.MJPC_PARTIES || 'K,M,W,P').split(',').map(x => x.trim()); const joue = k => PARTIES.includes(k);
const IMG_DEFAUT = path.join(RACINE, 'MANDATS/CANONS-DIAPOS/1-presentation-du-chapitre.png');
const IMG_OUV = { 'chapitre.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-chapitre.png'), 'seance-1.png': path.join(RACINE, 'MANDATS/CANONS-DIAPOS/captures-29-10/img-seance.png') };
const md5 = f => createHash('md5').update(fs.readFileSync(f)).digest('hex');
const TAG = process.env.MJPC_TAG || md5(FICHIER).slice(0, 8);
dire('C16 · lot 1 (359, 360, 361) · ' + new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC · ' + path.basename(path.dirname(FICHIER)) + '/' + path.basename(FICHIER) + ' md5 ' + md5(FICHIER) + ' · parties ' + PARTIES.join(' ') + ' · la montre du navigateur (seule la date est décalée)');

/* ── le faux hub ── */
const sk0 = st => { const S0 = st.site['3e'].chapitres[0].seances; return Object.keys(S0).filter(k => S0[k] && S0[k].type !== 'sommaire').sort((a, b) => (+S0[a].ordre || 0) - (+S0[b].ordre || 0)); };
const PAIRE = st => { try { (st.site.edt.grille['2026-2027'].creneaux || []).forEach(c => { if (c && /^3 DYLAN/i.test(String(c.classe || ''))) c.classeMjpc = 'CLASSE TEST'; }); } catch (e) {} };
const GR = [['Le Radeau de la Méduse', 'tableau-1-gericault-radeau.webp', 'Le Radeau de la Méduse, Théodore Géricault, 1819'], ['Le lac', 'tableau-2-bierstadt-lac.webp', 'Le lac, Albert Bierstadt, 1863'], ['Pêcheurs en mer', 'tableau-3-turner-pecheurs.webp', 'Pêcheurs en mer, William Turner, 1796'], ['Cathédrale gothique au bord de l’eau', 'tableau-4-schinkel-ville.webp', 'Cathédrale gothique au bord de l’eau, Karl Friedrich Schinkel, 1813'], ['Le Voyageur contemplant une mer de nuages', 'tableau-5-friedrich-voyageur.webp', 'Le Voyageur contemplant une mer de nuages, Caspar David Friedrich, vers 1818']];
/* la trame de Paul en séance 1 (l'auditeur II, `trame(null)`, repris tel quel) */
const tramePaul = st => { const k = sk0(st)[0]; const d = st.site['3e'].chapitres[0].seances[k].deroule; const E = d.ecrans; const N = [];
  const ec = (eid, act, actId, dur, blocs, role) => { const e = { eid, act, dur, blocs, comp: ['c4-lire-02'], rev: 0, vues: 0 }; if (actId) e.actId = actId; if (role) e.role = role; N.push(e); return e; };
  ec('aud-a1-analyse', 'Analyse d’images', 'act1', 5, [{ t: 'consigne', id: 'baud1', pic: '•', txt: 'Observe, discute, fais une hypothèse sur le Romantisme.', etapes: ['J’observe le tableau de mon groupe en silence.', 'Je discute en groupe de ce que je vois.', 'Au brouillon : ce que je vois, ce que je ressens, ce que je me demande.', 'Je fais une hypothèse sur ce que peut être le Romantisme.'], vues: 0 }]);
  ec('aud-a1-consigne', 'Consigne pour le passage à l’oral', 'act1', 3, [{ t: 'consigne', id: 'baud2', pic: '🗣️', txt: 'Chaque groupe présente son tableau puis son hypothèse.', etapes: ['Un élève montre le tableau et dit ce qu’on y voit.', 'Un autre élève lit l’hypothèse du groupe.', 'La classe écrit l’hypothèse au tableau.'], vues: 0 }]);
  GR.forEach(([t, f, leg], g) => { ec('aud-g' + (g + 1) + '-img', 'Groupe ' + (g + 1) + ' : ' + t, 'act2', 3, [{ t: 'image', id: 'baudi' + g, devoilerTout: true, legende: leg, ref: 'https://siteflow-io.github.io/mjpc-medias/poesie-peinture-xixe/' + f, src: '', support: true, vues: 0 }]);
    ec('aud-g' + (g + 1) + '-hyp', 'Groupe ' + (g + 1) + ' : l’hypothèse', 'act2', 3, [{ t: 'question', id: 'baudq' + g, q: 'Quelle hypothèse le groupe ' + (g + 1) + ' tire-t-il de son tableau ?', reps: [], vues: 0 }]); });
  ec('aud-bilan', 'Le bilan', null, 5, [{ t: 'question', id: 'baudb', q: 'Qu’est-ce que le Romantisme, d’après nos cinq hypothèses ?', reps: [], vues: 0 }], 'bilan');
  E.length = 0; N.forEach(e => E.push(e));
  d.activites = [{ id: 'act1', num: 1, titre: 'Analyse d’images', diapos: ['aud-a1-analyse', 'aud-a1-consigne'] }, { id: 'act2', num: 2, titre: 'Mise en commun', diapos: N.filter(e => e.actId === 'act2').map(e => e.eid) }]; };
/* le paquet de lundi (l'auditeur II, `paquetCharles`) : clés heures, etat, journal, ecrans, scene ; une heure close, 9 diapos, aucune décision ; `avec` : plus `classe` */
const paquetCharles = avec => st => { const k = sk0(st)[0]; const se = st.site['3e'].chapitres[0].seances[k]; const E = se.deroule.ecrans.filter(e => e && e.eid);
  const t0 = Date.parse('2026-09-14T12:08:53+02:00'), t1 = Date.parse('2026-09-14T14:42:50+02:00');
  const H = { classe: '3E Charles de Gaulle', clos: true, heure: 1, sur: 1, debutReel: t0, finReel: t1, lanceA: '12:08', creneau: '08:00-08:55', activites: E.slice(0, 9).map((e, i) => ({ eid: e.eid, titre: e.act, reel: 1, rang: i + 1 })) };
  const b = { heures: { '2026-09-14_08h00-08h55_3E_Charles_de_Gaulle': H }, etat: { maj: t1 }, journal: [{ t: t0, type: 'lancement', h: 1, heure: 1 }], ecrans: E.slice(0, 3), scene: { maj: t1, di: 2 } };
  if (avec) b.classe = '3E Charles de Gaulle'; se.deroule_joue = { '3E Charles de Gaulle': b }; };
const store = ({ trame = false, retouches = [] } = {}) => { const st = storeOuverture(RACINE, { champs: true }); PAIRE(st); if (trame) tramePaul(st); retouches.forEach(f => f && f(st)); return st; };

let HUBN = null; let ECR = []; const REFUSES = [];
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
const resoudreSv = v => { if (v && typeof v === 'object' && !Array.isArray(v)) { const K = Object.keys(v); if (K.length === 1 && K[0] === '.sv' && v['.sv'] === 'timestamp') return Date.now(); const o = {}; K.forEach(k => { o[k] = resoudreSv(v[k]); }); return o; } if (Array.isArray(v)) return v.map(resoudreSv); return v; };
const hubRepondre = async (qui, m, c, corps) => {
  if (m === 'GET') return JSON.stringify(lireH(c)); let bd = null; try { bd = resoudreSv(JSON.parse(corps || 'null')); } catch (e) {}
  const ko = refusDe(m, c, bd); if (ko) { REFUSES.push({ qui, m, c, ko, t: Date.now() }); ECR.push({ qui, m, c, t: Date.now(), refus: true }); return '§400§' + JSON.stringify({ error: 'Invalid data; couldn\'t parse key beginning at ' + ko }); }
  ECR.push({ qui, m, c, t: Date.now(), bd }); setTimeout(() => pousserFlux(c), 0);
  if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => posH(c + '/' + k, bd[k])); else posH(c, m === 'DELETE' ? null : bd); return JSON.stringify(bd); };
const fauxFetch = () => { window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase();
    return window.__hubN(m, c, (o && o.body) || null).then(t => /^§400§/.test(t) ? new Response(t.slice(5), { status: 400 }) : new Response(t, { status: 200 })); } return Promise.resolve(new Response('null', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };
const imageDe = u => { const m = /mjpc-medias\/(.*\/)?([^/?]+\.(png|jpe?g|webp))$/i.exec(u); if (!m) return null; return IMG_OUV[m[2]] || IMG_DEFAUT; };
const typeDe = f => /\.webp$/i.test(f) ? 'image/webp' : /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const ABOS = []; const NOMS = new Map();
const pousserFlux = c => { const cc = c.replace(/\/+$/, ''); ABOS.forEach(a => { if (!(cc === a.ch || cc.startsWith(a.ch + '/') || a.ch.startsWith(cc + '/'))) return; if (a.pg.isClosed()) return;
  a.pg.evaluate(([id, d]) => { try { window.__esPousser && window.__esPousser(id, d); } catch (e) {} }, [a.id, JSON.stringify(lireH(a.ch))]).catch(() => {}); }); };
const fauxFlux = () => { const ES = {}; let n = 0;
  window.__esPousser = (id, d) => { const e = ES[id]; if (!e || e.ferme) return; const ev = { data: JSON.stringify({ path: '/', data: JSON.parse(d) }) }; (e.l.put || []).forEach(f => { try { f(ev); } catch (x) {} }); };
  window.EventSource = function (u) { const id = 'es' + (++n); const self = this; this.l = {}; this.ferme = false; ES[id] = this; const s2 = String(u);
    this.addEventListener = (t, f) => { (self.l[t] = self.l[t] || []).push(f); }; this.close = () => { self.ferme = true; }; this.onerror = null;
    if (s2.indexOf('firebasedatabase.app') < 0) { setTimeout(() => { if (self.onerror) self.onerror({}); }, 0); return; }
    const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, ''));
    window.__hubEcoute(id, c).then(d => setTimeout(() => window.__esPousser(id, d), 0)); }; };
/* la montre du navigateur : seule `Date` est décalée (au jour et à l'heure de la scène), elle avance ; les minuteries restent celles du navigateur */
const fauxDate = off => { const RD = Date; function FD(...a) { if (!(this instanceof FD)) return new RD(RD.now() + off).toString(); return a.length ? new RD(...a) : new RD(RD.now() + off); }
  FD.prototype = RD.prototype; FD.now = () => RD.now() + off; FD.parse = RD.parse; FD.UTC = RD.UTC; try { Object.defineProperty(FD, 'name', { value: 'Date' }); } catch (e) {} window.Date = FD; };
let OFF = 0; const scene = (jour, h) => { OFF = new Date(jour + 'T' + h + ':00+02:00').getTime() - Date.now(); };   /* une scène : tous ses appareils à la même montre */
const nouveauCtx = async ({ qui, W, H }) => {
  const ctx = await nav.newContext({ viewport: { width: W, height: H }, timezoneId: 'Europe/Paris' });
  await ctx.exposeBinding('__hubEcoute', (src, id, ch) => { ABOS.push({ pg: src.page, id, ch: ch.replace(/\/+$/, '') }); return JSON.stringify(lireH(ch)); }); await ctx.addInitScript(fauxFlux);
  await ctx.route(u => !String(u).startsWith('file:') && !String(u).startsWith('about:'), r => { const u = r.request().url(); const f = imageDe(u); if (f) return r.fulfill({ path: f, contentType: typeDe(f) }); return r.abort(); });
  await ctx.exposeBinding('__hubN', (src, m, c, corps) => hubRepondre(NOMS.get(src.page) || qui, m, c, corps)); await ctx.addInitScript(fauxFetch);
  await ctx.addInitScript(fauxDate, OFF);
  await ctx.addInitScript(() => { const st = document.createElement('style'); st.textContent = '#fi-overlay{display:none!important}'; document.addEventListener('DOMContentLoaded', () => document.head.appendChild(st)); });
  return ctx; };
const suivre = (pg, qui, errs, boites) => { NOMS.set(pg, qui); pg.on('pageerror', e => errs.push(String(e.message).slice(0, 200))); pg.on('dialog', d => { if (d.type() === 'beforeunload') { d.accept().catch(() => {}); return; } boites.push(d.type() + ' : ' + d.message().slice(0, 100)); d.dismiss().catch(() => {}); }); };
const pageDans = async (ctx, { qui, q = '?n=3e', test = false, prof = true }) => { const errs = [], boites = []; const pg = await ctx.newPage(); suivre(pg, qui, errs, boites);
  await pg.goto('file://' + FICHIER + q, { waitUntil: 'load' }); await p(1800); if (prof) await profPrep(pg, test); return { ctx, pg, errs, boites, qui }; };
const ouvrir = async ({ qui = 'pilote', W = 1536, H = 864, q = '?n=3e', test = false, prof = true }) => { const ctx = await nouveauCtx({ qui, W, H }); return pageDans(ctx, { qui, q, test, prof }); };
const profPrep = async (pg, test) => { await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; ['fi-overlay', 'm8-regles-overlay'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); }); await p(300);
  await pg.click('#tprof-btn').catch(() => {}); await p(600); if (test) await pg.evaluate(() => { window.M8_TEST = true; try { sessionStorage.setItem('mjpc_m8_test', '1'); } catch (e) {} }); };
const capt = async (pg, nom) => { if (CAPT && pg && !pg.isClosed()) await pg.screenshot({ path: path.join(CAPT, TAG + '-' + nom + '.png') }).catch(() => {}); };
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const garde = async pg => { if (await pg.evaluate(() => !!(document.getElementById('garde') && document.getElementById('garde').classList.contains('on'))).catch(() => false)) { await pg.click('#garde-devant').catch(() => {}); await p(900); } };
const gesteClic = async pg => { if (!(await pg.isVisible('#bdev').catch(() => false))) return false; return pg.locator('#bdev').click({ timeout: 1500 }).then(() => true).catch(() => false); };
const texteDe = (pg, sel) => pg.evaluate(sel => { const m = document.querySelector(sel); return m ? (m.innerText || '').replace(/\s+/g, ' ').trim() : null; }, sel).catch(() => null);
const modaleDe = pg => pg.evaluate(() => { const m = document.getElementById('at-modale'); if (!m) return null; return { texte: ((m.querySelector('.at-modale-m') || m).innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300), boutons: Array.from(m.querySelectorAll('button[data-i]')).map(b => ({ t: (b.innerText || '').trim(), bulle: b.title || '' })) }; }).catch(() => null);
const bandeauDe = pg => pg.evaluate(() => { const b = document.getElementById('ses-reprise'); if (!b) return null; const r = b.getBoundingClientRect(); return r.height > 0 && getComputedStyle(b).display !== 'none' ? (b.innerText || '').replace(/\s+/g, ' ').trim() : null; }).catch(() => null);
const tabEtat = T => T.pg.evaluate(() => { const a = document.getElementById('ses-tab-att'); const m = (typeof DR_TAB === 'object' && DR_TAB.montre) || null; return { attente: !!(a && a.style.display !== 'none'), origine: m ? m.origine || null : null }; }).catch(e => ({ err: String(e).slice(0, 80) }));
const devEtat = d => d.pg.isClosed() ? { ferme: true } : d.pg.evaluate(() => { const t = id => ((document.getElementById(id) || {}).textContent || '').replace(/\s+/g, ' ').trim();
  return { sesId: (typeof SES === 'object' && SES) ? SES.id : null, lancee: !!S.lancee && !S.close, rep: !!S.repetition, test: typeof m8TestOn === 'function' && m8TestOn(), sorte: DR_SES.ici ? DR_SES.ici.sorte : null, base: DR_SES.ici ? DR_SES.ici.base : null, sig: DR_SES.ici ? DR_SES.ici.sig : null,
    seance: (typeof ATVUES === 'object' && ATVUES) ? String(ATVUES.snum) : null, classe: t('hclasse'), cours: (typeof AT_DR_COURS !== 'undefined' && AT_DR_COURS) ? AT_DR_COURS.classeSlug : null }; }).catch(e => ({ err: String(e).slice(0, 80) }));
const ecritsDepuis = (e0, re, qui) => [...new Set(ECR.slice(e0).filter(x => !x.refus && (!qui || x.qui === qui) && (!re || re.test(x.c))).map(x => x.m + ' ' + x.c.replace(/\/heures\/[^/]+/, '/heures/<clé>').replace(/\/(appel|presence)\/.*$/, '/$1/…')))];
const horsTest = (e0, qui) => ecritsDepuis(e0, null, qui).filter(x => !/ \/site\/tableau_test(\/|$)/.test(x));
const ERRS = []; const finir = (k, o, quoi) => { const e = o.errs.concat(o.boites); ERRS.push(...e); verif(k, !e.length, quoi + ' : aucune erreur JS, aucune boîte système', e.join(' ; ')); };
const norm = s => String(s || '').replace(/[’']/g, '’').replace(/\s+/g, ' ').trim();

/* ── l'emploi du temps (l'auditeur II) ── */
const SE = k => '/site/3e/chapitres/0/seances/' + k;
const ORDRE = k => { try { return +HUBN.site['3e'].chapitres[0].seances[k].ordre; } catch (e) { return null; } };
const fermerEdt = async pg => { await pg.evaluate(() => { try { edtModaleFermer(); } catch (e) {} try { edtFermer(); } catch (e) {} }); await p(700); };
const projeter = async (pg, debut = '2026-09-14', jours = 28) => { await pg.evaluate(() => edtOuvrir()); await p(2600);
  const P = await pg.evaluate(([d, n]) => { const c = edtProjeter(d, n); return Object.keys(c).sort().map(k => { const x = c[k]; return { k, iso: x.iso, cr: x.creneau, nature: x.nature, titre: x.titre || '', heure: x.heure || null, sur: x.sur || null, suite: !!x.suite, snum: x.snum != null ? String(x.snum) : null, classe: x.classeMjpc || x.classe || '' }; }); }, [debut, jours]);
  await fermerEdt(pg); return P; };
const DYL = /CLASSE TEST/, CHA = /Charles/;
const premiere = (P, re) => P.find(x => re.test(x.classe) && x.nature === 'prevu') || null;
const seanceDe = x => x && x.snum != null ? ORDRE(x.snum) : null;
const dirCase = x => x ? (x.iso + ' ' + x.cr + ' · ' + x.nature + (x.titre ? ' « ' + x.titre.slice(0, 48) + ' »' + (x.snum != null ? ' (séance ' + ORDRE(x.snum) + ')' : '') : '') + (x.heure ? ' heure ' + x.heure + (x.suite ? ' suite' : ' sur ' + x.sur) : '')) : '— (aucune)';
const caseDe = async (pg, iso, cr, re) => { await pg.evaluate(() => edtOuvrir()); await p(2400);
  const ok = await pg.evaluate(([j, h, rs]) => { const re = new RegExp(rs); const cs = Array.from(document.querySelectorAll('.edt-clic')).filter(e => e.offsetParent !== null && re.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j + (h ? '|' + h : '')) >= 0); if (!x) return false; x.click(); return true; }, [iso, cr || null, re.source]); await p(1100);
  return { ok, t: norm(await texteDe(pg, '#edt-modale')) }; };
const lancerIci = async (pg, iso, cr, re) => { const c = await caseDe(pg, iso, cr, re); const l = await clicTexte(pg, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await p(4000);
  const ouv = await pg.evaluate(() => { const b = document.getElementById('o-lancer'); return !!(b && b.offsetParent !== null && !b.disabled); }); if (ouv) { await pg.click('#o-lancer').catch(() => {}); await p(3500); }
  await pg.keyboard.press('Escape').catch(() => {}); await p(500); await garde(pg); return { c, l, ouv }; };
const cartes = async pg => { await pg.evaluate(() => edtOuvrir()); await p(2400); const t = await pg.evaluate(() => Array.from(document.querySelectorAll('.edt-carte')).map(x => (x.innerText || '').replace(/\s+/g, ' ').trim())); await fermerEdt(pg); return t; };
const eidsDe = pg => pg.evaluate(() => { try { return seance().ecrans.map((e, i) => ({ i, eid: e.eid, role: e.role || '', act: e.act })); } catch (e) { return []; } });
const ici_ = pg => pg.evaluate(() => { const c = document.getElementById('compte'); let eid = null; try { eid = seance().ecrans[S.di].eid; } catch (e) {} return { eid, compte: c ? c.textContent.trim() : '' }; });
const allerA = async (pg, eid) => { const L = await eidsDe(pg); const x = L.find(e => e.eid === eid); if (!x) return false; const v = await pg.$('#volet .vig[data-i="' + x.i + '"]'); if (!v) return false;
  await v.scrollIntoViewIfNeeded().catch(() => {}); await v.click(); await p(600); await garde(pg); for (let k = 0; k < 20 && (await ici_(pg)).eid !== eid; k++) await p(200); return (await ici_(pg)).eid === eid; };
const jouerJusqua = async (pg, eid) => { await pg.click('#numero').catch(() => {}); for (let k = 0; k < 80; k++) { const s2 = await ici_(pg); const x = (await eidsDe(pg)).find(e => e.eid === s2.eid) || {}; if (x.eid === eid || x.role === 'fin') break; await pg.keyboard.press('ArrowRight'); await p(330); await garde(pg); } };
const clore = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-clore'); if (b) b.click(); }); await p(900); await pg.evaluate(() => { const x = document.getElementById('f-clore'); if (x) x.click(); }); await p(800);
  const g = await pg.evaluate(() => { const g = document.getElementById('garde-clore'); return g && g.classList.contains('on'); }); if (g) { await pg.evaluate(() => document.getElementById('gclore-oui').click()); await p(2500); await garde(pg); } return pg.evaluate(() => !!S.close); };
const allerT5 = async pg => { await pg.evaluate(() => { const b = document.getElementById('dr-t5'); if (b) b.click(); }); await p(2500); if (!(await pg.evaluate(() => !!document.querySelector('#fin .pp-tete')))) { await pg.evaluate(() => { const b = document.getElementById('bfin'); if (b) b.click(); }); await p(1500); } };
const finSansDecider = async pg => { await allerT5(pg); await pg.evaluate(() => { const l = document.querySelector('#fin .pp-liste [data-sec="7"]'); if (l) l.click(); }); await p(900); return clore(pg); };
const paquets = () => { const out = []; sk0(HUBN).forEach(k => { const d = lireH(SE(k) + '/deroule_joue') || {}; Object.keys(d).forEach(sl => { const b = d[sl] || {}; out.push('séance ' + ORDRE(k) + ' · paquet « ' + sl + ' » {' + Object.keys(b).sort().join(', ') + '}' + (b.classe ? ' classe « ' + b.classe + ' »' : ' SANS classe')); }); }); return out; };
/* la pastille « mode test » du Panneau prof, par le geste (le Panneau prof ouvert par « 🛠 Panneau prof » s'il est à l'écran) ; sinon sa fonction, et la sonde le dit */
const pastille = async pg => { let ouvert = await pg.isVisible('#tprof-testpill').catch(() => false); let par = 'clic sur la pastille';
  if (!ouvert && await pg.isVisible('#tprof-btn').catch(() => false)) { await pg.click('#tprof-btn').catch(() => {}); await p(900); ouvert = await pg.isVisible('#tprof-testpill').catch(() => false); par = '« 🛠 Panneau prof », puis clic sur la pastille'; }
  if (ouvert) await pg.click('#tprof-testpill').catch(() => {}); else { await pg.evaluate(() => m8BasculerModeTest()); par = 'm8BasculerModeTest() — la fonction de la pastille (le Panneau prof n’est pas à cet écran)'; }
  await p(900); return { par, test: await pg.evaluate(() => m8TestOn()), modale: await modaleDe(pg) }; };
const fermerPanneau = async pg => { await pg.evaluate(() => { try { closeProfPanel(); } catch (e) {} }); await p(500); };
const compris = async pg => { await pg.evaluate(() => { const b = document.querySelector('#at-modale button[data-i="0"]'); if (b) b.click(); }); await p(400); };

/* ══ K · 359 : le paquet sans `classe` ══ */
const partieK = async () => {
  for (const avec of [false, true]) {
    HUBN = ranger(store({ trame: true, retouches: [paquetCharles(avec)] })) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; scene('2026-09-15', '08:00');
    const nomK = avec ? 'AVEC' : 'SANS'; dire('  [K] le paquet de la séance 1 ' + nomK + ' `classe` : ' + paquets().join(' | '));
    const o = await ouvrir({ qui: 'pilote' }); const P = await projeter(o.pg); const d = premiere(P, DYL), c = premiere(P, CHA);
    dire('  [K]   la prochaine case de CLASSE TEST (rien joué) : ' + dirCase(d) + ' · de 3E Charles de Gaulle (la classe du paquet) : ' + dirCase(c));
    verif('K1', seanceDe(d) === 1 && d.heure === 1 && d.sur === 1, nomK + ' `classe` : la case de CLASSE TEST (rien joué) propose la séance 1, « heure 1 sur 1 »', dirCase(d));
    verif('K2', seanceDe(c) === 2, nomK + ' `classe` : la classe du paquet (3E Charles de Gaulle) a sa séance 1 jouée — sa prochaine case propose la séance 2', dirCase(c));
    const ca = await cartes(o.pg); const cT = ca.find(x => /CLASSE TEST/.test(x)) || '', cC = ca.find(x => /Charles/.test(x)) || ''; dire('  [K]   les cartes : « ' + cT + ' » ‖ « ' + cC + ' »');
    verif('K3', /\b0\/9\b/.test(cT) && /\b1\/9\b/.test(cC), nomK + ' `classe` : les cartes — CLASSE TEST « 0/9 », 3E Charles de Gaulle « 1/9 »', { cT, cC });
    const m = await caseDe(o.pg, '2026-09-15', '10:07-11:02', DYL); await capt(o.pg, 'K-' + nomK + '-case-classe-test'); dire('  [K]   la fenêtre de la case de CLASSE TEST, mardi 10:07 : « ' + m.t.slice(0, 200) + ' »');
    verif('K4', m.ok && /Poésie et peinture/.test(m.t) && /heure 1 sur 1/.test(m.t), nomK + ' `classe` : la fenêtre de la case de CLASSE TEST dit la séance 1, « heure 1 sur 1 »', m.t.slice(0, 200));
    await fermerEdt(o.pg); const L = await lancerIci(o.pg, '2026-09-15', '10:07-11:02', DYL);
    const sn = await o.pg.evaluate(() => { try { return { snum: String(ATVUES.snum), titre: seance().title || '', heure: S.heure, entete: ((document.getElementById('hou') || {}).textContent || '').replace(/\s+/g, ' ').trim() }; } catch (e) { return { err: e.message }; } });
    verif('K5', sn.snum === sk0(HUBN)[0], nomK + ' `classe` : « ▶ Ouvrir le pilotage et lancer » de CLASSE TEST ouvre la séance 1', sn);
    const term = await o.pg.evaluate(() => { try { const ch = chapitresData['3e'][AT.edChap.chnum]; const k = Object.keys(ch.seances).sort((a, b) => (+ch.seances[a].ordre) - (+ch.seances[b].ordre))[0]; const se = ch.seances[k];
      return { testFinie: !!dr_ouvTerminee(se, { nom: 'CLASSE TEST', slug: 'CLASSE TEST' }), testH: dr_ouvHeuresJouees(se, { nom: 'CLASSE TEST', slug: 'CLASSE TEST' }), chaFinie: !!dr_ouvTerminee(se, { nom: '3E Charles de Gaulle', slug: '3E Charles de Gaulle' }), chaH: dr_ouvHeuresJouees(se, { nom: '3E Charles de Gaulle', slug: '3E Charles de Gaulle' }),
        propose: (() => { if (typeof dr_heureProposee !== 'function') return null; const s0 = ATVUES.snum; ATVUES.snum = k; try { return dr_heureProposee('CLASSE TEST', '10:07-11:02'); } finally { ATVUES.snum = s0; } })() }; } catch (e) { return { err: e.message }; } });   /* l'heure proposée pour la SÉANCE 1 (lue par la fonction, la séance 1 posée le temps de la lecture) */
    verif('K6', term.testFinie === false && term.testH === 0 && term.chaFinie === true && term.chaH === 1, nomK + ' `classe` : « Le parcours du chapitre » et le bilan des compétences (dr_ouvTerminee, dr_ouvHeuresJouees) — séance 1 : CLASSE TEST pas faite, 0 h ; 3E Charles de Gaulle faite, 1 h', term);
    verif('K7', term.propose === 1, nomK + ' `classe` : l’heure proposée hors de l’emploi du temps (dr_heureProposee) pour CLASSE TEST, séance 1 : heure 1', term.propose);
    const E = await eidsDe(o.pg); const plan = E.find(e => /parcours/i.test(e.act || '') || e.role === 'plan');
    if (plan) { await allerA(o.pg, plan.eid); await p(800); const t = norm(await texteDe(o.pg, '#mur')); await capt(o.pg, 'K-' + nomK + '-parcours-classe-test'); dire('  [K]   « ' + plan.act + ' » au pilote : « ' + t.slice(0, 300) + ' »');
      verif('K8', /Séance 1 sur 9/.test(t) && !/1\s*✓/.test(t), nomK + ' `classe` : « Le parcours du chapitre » de l’heure de CLASSE TEST dit « Séance 1 sur 9 », la séance 1 sans coche', t.slice(0, 200)); }
    else verif('K8', false, nomK + ' `classe` : la diapo « Le parcours du chapitre » est dans l’heure', E.map(e => e.act).slice(0, 6));
    finir('K9', o, 'K ' + nomK); await o.ctx.close(); } };

/* ══ M · 359 : le mode test pendant un essai ══ */
const partieM = async () => {
  /* M1 : la pastille pendant l'essai */
  { HUBN = ranger(store({ trame: true })) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; scene('2026-09-14', '09:00');
    const o = await ouvrir({ qui: 'pilote' }); const pg = o.pg; const a = await pastille(pg); dire('  [M1] mode test : ' + a.par + ' → m8TestOn() = ' + a.test);
    await fermerPanneau(pg); const e0 = ECR.length; const L = await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(2000);
    dire('  [M1] l’essai lancé (' + L.l + '), 7 diapos : écritures hors de /site/tableau_test : ' + (horsTest(e0).join(', ') || 'aucune'));
    const b = await pastille(pg); await capt(pg, 'M1-pastille-pendant-essai'); dire('  [M1] PENDANT l’essai, quitter le mode test : ' + b.par + ' → m8TestOn() = ' + b.test + ' · la fenêtre : ' + JSON.stringify(b.modale));
    verif('M1', b.test === true, 'pendant l’essai, quitter le mode test est refusé : le mode test reste actif', b.test);
    verif('M2', !!b.modale && /Un essai joue en mode test : clos-le d’abord/.test(norm(b.modale.texte)), 'le refus le dit : « Un essai joue en mode test : clos-le d’abord »', b.modale && b.modale.texte);
    await compris(pg);
    /* le clic sur la pastille elle-même, et sur « Quitter le mode test » de la console : le Panneau prof ouvert par sa fonction (son bouton n'est pas à l'écran du pilotage) */
    const dessus = await pg.evaluate(() => { try { openProfPanel(); } catch (e) {} const b = document.getElementById('tprof-testpill'); if (!b) return null; const r = b.getBoundingClientRect(); const x = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!(x && (x === b || b.contains(x))); }); await p(600);
    await pg.evaluate(() => { const b = document.getElementById('tprof-testpill'); if (b) b.click(); }); await p(900);   /* le clic de la pastille elle-même (son gestionnaire) : à l'écran du pilotage, elle est sous l'écran de l'Atelier */
    const b2 = { test: await pg.evaluate(() => m8TestOn()), modale: await modaleDe(pg) }; await compris(pg);
    dire('  [M1] la pastille, le Panneau prof ouvert par sa fonction : atteignable au pointeur ' + dessus + ' ; son clic (gestionnaire) → m8TestOn() = ' + b2.test + ' · la fenêtre : « ' + (b2.modale ? b2.modale.texte.slice(0, 60) : '—') + ' »');
    verif('M1', b2.test === true && !!b2.modale && /Un essai joue en mode test : clos-le d’abord/.test(norm(b2.modale.texte)), 'le clic de la pastille pendant l’essai : refusé, avec sa phrase ; le mode test reste actif', b2);
    const bq = await pg.evaluate(() => { const x = Array.from(document.querySelectorAll('button.m8-btn')).find(b => /Quitter le mode test/.test(b.innerText || '')); if (!x) return false; x.click(); return true; }); await p(900);
    const b3 = { bouton: bq, test: await pg.evaluate(() => m8TestOn()), modale: await modaleDe(pg) }; await compris(pg);
    dire('  [M1] « Quitter le mode test » de la console du Panneau prof : ' + (bq ? 'cliqué → m8TestOn() = ' + b3.test + ' · « ' + (b3.modale ? b3.modale.texte.slice(0, 60) : '—') + ' »' : 'absent de la page (sa section n’est pas dessinée)'));
    if (bq) verif('M1', b3.test === true && !!b3.modale, '« Quitter le mode test » de la console, pendant l’essai : refusé, avec la même phrase', b3);
    await fermerPanneau(pg); await jouerJusqua(pg, 'aud-g1-hyp'); await p(20000);
    const w2 = horsTest(e0); dire('  [M1] ensuite, 3 diapos et 20 s : ' + w2.length + ' chemins hors de /site/tableau_test : ' + w2.join(', '));
    const cl = await finSansDecider(pg); await p(2500); const w3 = horsTest(e0);
    verif('M3', w3.length === 0, 'l’essai entier, la pastille cliquée au milieu, jusqu’à « Clore » : aucune écriture hors de /site/tableau_test (K15-test) — ' + ECR.slice(e0).length + ' écritures', w3);
    verif('M4', !paquets().length, 'au « vrai » hub, aucun paquet dans deroule_joue', paquets());
    const c2 = await pastille(pg); dire('  [M1] l’essai clos (' + cl + ') : ' + c2.par + ' → m8TestOn() = ' + c2.test);
    verif('M5', cl === true && c2.test === false && !c2.modale, 'l’essai clos, la pastille quitte le mode test comme avant, sans fenêtre', { clos: cl, test: c2.test, modale: c2.modale });
    finir('M9', o, 'M1'); await o.ctx.close(); }
  /* M2 : la page rechargée pendant l'essai, puis « Reprendre » */
  { HUBN = ranger(store({ trame: true })) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; scene('2026-09-14', '09:00');
    const o = await ouvrir({ qui: 'pilote' }); const pg = o.pg; await pastille(pg); await fermerPanneau(pg); await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(2000);
    const e2 = ECR.length; await pg.reload({ waitUntil: 'load' }).catch(() => {}); await p(2500); await profPrep(pg, false); await p(2500);
    const rep = await bandeauDe(pg); dire('  [M2] l’essai, la page rechargée : m8TestOn() = ' + await pg.evaluate(() => m8TestOn()) + ' · le bandeau : « ' + (rep || '—') + ' »');
    let apres = null; if (rep) { await pg.click('#ses-reprise-oui').catch(() => {}); await p(8000); apres = await pg.evaluate(() => m8TestOn()); }
    const w = horsTest(e2); dire('  [M2] « Reprendre » : m8TestOn() = ' + apres + ' · écritures hors de /site/tableau_test : ' + (w.join(', ') || 'aucune'));
    verif('M6', w.length === 0 && !paquets().length, 'l’essai, la page rechargée, « Reprendre » : aucune écriture hors de /site/tableau_test, aucun paquet', { w, paquets: paquets() });
    finir('M9', o, 'M2'); await o.ctx.close(); }
  /* M3 : un autre onglet du même navigateur ; l'onglet de l'essai fermé ; l'annonce d'essai retirée (une répétition en mode test, ailleurs, lancée puis arrêtée) */
  { HUBN = ranger(store({ trame: true })) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; scene('2026-09-14', '09:00');
    const o = await ouvrir({ qui: 'A' }); const pg = o.pg; await pastille(pg); await fermerPanneau(pg); await lancerIci(pg, '2026-09-14', '08:57-09:52', CHA); await jouerJusqua(pg, 'aud-a1-consigne'); await p(2000);
    let B = null; const [nv] = await Promise.all([o.ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null), clicTexte(pg, 'button,a', 'Le site dans un nouvel onglet')]);
    if (nv) { const errs = [], boites = []; suivre(nv, 'B', errs, boites); await nv.waitForLoadState('load').catch(() => {}); await p(2500); await profPrep(nv, false); B = { ctx: o.ctx, pg: nv, errs, boites, qui: 'B' }; }
    else B = await pageDans(o.ctx, { qui: 'B' });
    dire('  [M3] le second onglet : ' + (nv ? '« ↗ Le site dans un nouvel onglet »' : 'un onglet ouvert à la main') + ' · m8TestOn() = ' + await B.pg.evaluate(() => m8TestOn()));
    const e1 = ECR.length; await pg.close({ runBeforeUnload: true }).catch(() => {}); const vus = [];
    for (let k = 0; k < 14; k++) { await p(250); const t = await bandeauDe(B.pg); if (t) vus.push(t); }
    dire('  [M3] l’onglet de l’essai fermé : le bandeau du second onglet, 3,5 s : ' + ([...new Set(vus)].map(x => '« ' + x + ' »').join(' puis ') || 'aucun'));
    const C = await ouvrir({ qui: 'C', test: true, W: 1366, H: 768 }); await C.pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(1000);
    await clicTexte(C.pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800); if (!(await clicTexte(C.pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(C.pg, 'button,[onclick]', 'Modifier'); await p(1500);
    await C.pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await p(3500); const rC = await C.pg.evaluate(() => !!S.repetition);
    await C.pg.evaluate(() => { const b = document.getElementById('rep-stop'); if (b) b.click(); }); await p(3500); await C.ctx.close();
    dire('  [M3] un autre appareil, en mode test : une répétition lancée (' + rC + ') puis arrêtée · l’annonce d’essai au hub : ' + JSON.stringify(lireH('/site/tableau_test/pointeur')));
    const vus2 = []; for (let k = 0; k < 12; k++) { await p(250); const t = await bandeauDe(B.pg); if (t) vus2.push(t); }
    dire('  [M3] puis, le bandeau du second onglet, 3 s : ' + ([...new Set(vus2)].map(x => '« ' + x + ' »').join(' puis ') || 'aucun'));
    const comme = [...vus, ...vus2].filter(x => /Heure en cours/.test(x));
    let clic = false; if (await B.pg.isVisible('#ses-reprise-oui').catch(() => false)) { await B.pg.click('#ses-reprise-oui').catch(() => {}); clic = true; await p(9000); }
    const w = horsTest(e1, 'B'); await capt(B.pg, 'M3-second-onglet');
    dire('  [M3] « Reprendre » cliqué : ' + clic + ' · m8TestOn() = ' + await B.pg.evaluate(() => m8TestOn()) + ' · le second onglet a écrit hors de /site/tableau_test : ' + (w.join(', ') || 'rien') + ' · ' + (paquets().join(' | ') || 'aucun paquet'));
    verif('M7', comme.length === 0, 'le second onglet ne propose jamais l’essai comme une heure (« Heure en cours avec les … ») — ' + (vus.length + vus2.length) + ' relevés', [...new Set(comme)]);
    verif('M8', w.length === 0 && !paquets().length, 'le second onglet n’écrit rien hors de /site/tableau_test ; aucun paquet au « vrai » deroule_joue', { w, paquets: paquets() });
    finir('M9', B, 'M3'); await o.ctx.close().catch(() => {}); } };

/* ══ W · 360 : la fenêtre « … joue déjà sur un autre appareil » ══ */
const lancerCase = async (d, jour, re) => { const pg = d.pg; await pg.evaluate(() => edtOuvrir()); await p(1800);
  const cas = await pg.evaluate(([j, rs]) => { const rx = new RegExp(rs, 'i'); const cs = Array.from(document.querySelectorAll('.edt-case .edt-clic, .edt-clic')).filter(e => e.offsetParent !== null && rx.test(e.innerText || '')); const x = cs.find(e => (e.getAttribute('onclick') || '').indexOf(j) >= 0); if (!x) return null; x.click(); return true; }, [jour, re]); await p(800);
  if (cas) { if (!(await clicTexte(pg, 'button', 'Ouvrir le pilotage et lancer'))) if (!(await clicTexte(pg, 'button', 'Reprendre l’heure'))) await clicTexte(pg, 'button', 'Reprendre le cours'); }
  let dialogue = null; for (let k = 0; k < 20 && !dialogue; k++) { await p(200); dialogue = await modaleDe(pg); }
  if (!dialogue) { await p(2000); await pg.keyboard.press('Escape').catch(() => {}); await p(400); await garde(pg); } return { cas, dialogue }; };
const repeter = async (d, snum) => { const pg = d.pg; await pg.evaluate(() => { try { atelierOuvrir(); } catch (e) {} }); await p(1000); await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await p(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await p(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(2500);
  if (snum != null) { await pg.evaluate(s => { try { atSomAllerEcran(0, s); } catch (e) {} }, String(snum)); await p(1800); }
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); let dialogue = null; for (let k = 0; k < 20 && !dialogue; k++) { await p(200); dialogue = await modaleDe(pg); } if (!dialogue) await p(2200);
  return { dialogue }; };
const demarrer = (d, k, autre) => (k === 'H' || k === 'T') ? lancerCase(d, '2026-09-14', autre ? 'DYLAN|CLASSE TEST' : 'Charles') : repeter(d, autre ? '1' : null);
const estTest = k => k === 'T' || k === 'RT';
const NOMK = { H: 'vraie heure', T: 'essai en mode test', R: 'répétition', RT: 'répétition en mode test' };
const LIBS = ['Rejoindre la séance en cours', 'Lancer celle-ci quand même', 'Annuler'];
const heuresDe = slug => { const C = SE(sk0(HUBN)[0]) + '/deroule_joue/' + slug; const b = lireH(C) || {}; return b.heures || {}; };
const partieW = async () => {
  for (const k of ['H', 'T', 'R', 'RT']) for (const i of [0, 1, 2]) {
    HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; scene('2026-09-14', '09:00'); const nom = k + '+' + k + ' · ' + LIBS[i];
    const T = await ouvrir({ qui: 'tableau', q: '?vue=tableau', W: 1280, H: 720, prof: false }); await p(600);
    const a = await ouvrir({ qui: 'A', test: estTest(k) }); await demarrer(a, k, false); await garde(a.pg); for (let n = 0; n < 2; n++) { await gesteClic(a.pg); await p(350); } await p(1500);
    const A0 = await devEtat(a); const idA = A0.sesId;
    const b = await ouvrir({ qui: 'B', test: estTest(k), W: 1366, H: 768 }); const rB = await demarrer(b, k, true); await p(600);
    const dlg = rB.dialogue; await capt(b.pg, 'W-' + k + '-' + i + '-fenetre');
    if (i === 0) dire('\n  [W] ' + NOMK[k] + ' ' + (k === 'H' || k === 'T' ? '(autre classe)' : '(autre séance)') + ' · la fenêtre : « ' + (dlg ? dlg.texte : '— pas de fenêtre') + ' » · boutons ' + JSON.stringify(dlg && dlg.boutons));
    const libsOk = !!dlg && dlg.boutons.length === 3 && dlg.boutons.every((x, j) => x.t === LIBS[j]); const bullesOk = !!dlg && dlg.boutons.every(x => x.bulle && !/undefined/.test(x.bulle));
    verif('W1', libsOk, nom + ' : les trois boutons disent leur nom (« Rejoindre la séance en cours », « Lancer celle-ci quand même », « Annuler »)', dlg && dlg.boutons.map(x => x.t));
    verif('W2', bullesOk, nom + ' : chaque bouton a son infobulle', dlg && dlg.boutons.map(x => x.bulle));
    const hA0 = Object.keys(heuresDe('3E Charles de Gaulle')).length;
    await b.pg.evaluate(j => { const x = document.querySelector('#at-modale button[data-i="' + j + '"]'); if (x) x.click(); }, i).catch(() => {}); await p(4500); await garde(b.pg);
    const encore = await modaleDe(b.pg); for (let n = 0; n < 2; n++) { await gesteClic(i === 2 ? a.pg : b.pg); await p(350); } await p(2500);
    const A1 = await devEtat(a), B1 = await devEtat(b); const te = await tabEtat(T); const idB = B1.sesId;
    const suit = te.attente ? 'l’horloge' : te.origine === idA ? 'A' : te.origine === idB ? 'B' : '?';
    dire('  [W]   ' + LIBS[i] + ' → A : ' + JSON.stringify({ sorte: A1.sorte, lancee: A1.lancee, rep: A1.rep, seance: A1.seance, cours: A1.cours }) + ' · B : ' + JSON.stringify({ sorte: B1.sorte, lancee: B1.lancee, rep: B1.rep, seance: B1.seance, cours: B1.cours, test: B1.test }) + ' · le tableau distant suit : ' + suit + (encore ? ' · une fenêtre reste : « ' + encore.texte + ' »' : ''));
    if (i === 0) { verif('W3', !!B1.sig && B1.sig === A1.sig && B1.sorte === A0.sorte, nom + ' : B pilote la séance qui joue (la même session que A) — rien n’est créé', { A: A1.sig, B: B1.sig });
      if (k === 'H') verif('W3', Object.keys(heuresDe('CLASSE TEST')).length === 0, nom + ' : aucune heure créée pour l’autre classe', Object.keys(heuresDe('CLASSE TEST'))); }
    if (i === 1) { const lanceB = (k === 'H' || k === 'T') ? (B1.lancee && B1.cours === 'CLASSE TEST') : (B1.rep && B1.seance === '1');
      verif('W4', lanceB && !!B1.sig && B1.sig !== A1.sig, nom + ' : B a lancé la séance choisie (' + ((k === 'H' || k === 'T') ? 'CLASSE TEST' : 'la séance 2') + ')', B1);
      verif('W4', suit === 'B', nom + ' : le tableau distant suit B', suit);
      if (k === 'H') { const H = heuresDe('3E Charles de Gaulle'); const cle = Object.keys(H)[0]; verif('W4', !!cle && H[cle].clos === true, nom + ' : l’heure de A (3E Charles de Gaulle) est close, sa trace enregistrée (« La lancer ici la clôt »)', cle ? { cle, clos: H[cle].clos, closPar: H[cle].closPar } : 'aucune heure'); }
      else verif('W4', (k === 'T' ? A1.lancee : A1.rep) && A1.sig === A0.sig, nom + ' : la session de A continue (elle n’a plus le tableau distant)', A1); }
    if (i === 2) { verif('W5', !encore && !B1.sig && !B1.lancee && !B1.rep, nom + ' : la fenêtre se ferme, B ne lance rien', B1);
      verif('W5', A1.sig === A0.sig && suit === 'A' && Object.keys(heuresDe('3E Charles de Gaulle')).length === hA0, nom + ' : la séance de A continue, le tableau distant la suit', { suit, A: A1.sig }); }
    finir('W9', a, nom + ' A'); finir('W9', b, nom + ' B');
    await b.ctx.close().catch(() => {}); await a.ctx.close().catch(() => {}); await T.ctx.close().catch(() => {}); } };

/* ══ P · 361 : la participation ══ */
const QB = 'emt9v3yqo6pvd5';
const etatPart = pg => pg.evaluate(() => ({ verts: Array.from(document.querySelectorAll('#part span[data-ini].dr-ok')).map(s => s.dataset.ini), oraux: Array.from(document.querySelectorAll('#part span[data-ini].oral')).map(s => s.dataset.ini),
  presents: ((document.getElementById('presents') || {}).textContent || '').trim(), parts: S.parts.map(x => x.nom), paroles: J.filter(x => x && x.type === 'parole').length, fiche: (document.getElementById('ppop') || { classList: { contains: () => false } }).classList.contains('on') ? partEleve : null }));
const rangDe = (L, n) => n ? 'ÉLÈVE ' + (L.indexOf(n) + 1) : 'personne';
const partieP = async () => {
  for (const k of ['R', 'T', 'H']) {
    HUBN = ranger(store()) || {}; ECR = []; REFUSES.length = 0; ABOS.length = 0; scene('2026-09-14', '09:00');
    const cls = lireH('/classes'); const Lcl = n => (cls[n] && Array.isArray(cls[n].eleves)) ? cls[n].eleves.filter(x => typeof x === 'string') : [];
    const a = await ouvrir({ qui: 'A', test: k === 'T' }); await demarrer(a, k, false); await garde(a.pg); await p(1200);
    const lst0 = await a.pg.evaluate(() => ({ eleves: ELEVES.slice(), presents: ((document.getElementById('presents') || {}).textContent || '').trim(), classe: ((document.getElementById('hclasse') || {}).textContent || '').trim() }));
    const CHA0 = Lcl('3E Charles de Gaulle'), CT0 = Lcl('CLASSE TEST'); const egal = (x, y) => x.length === y.length && x.every((v, j) => v === y[j]);
    if (k === 'R') {
      const lire = () => a.pg.evaluate(() => ({ eleves: ELEVES.slice(), presents: ((document.getElementById('presents') || {}).textContent || '').trim(), classe: ((document.getElementById('hclasse') || {}).textContent || '').trim() }));
      const juger = (l, quand) => { const ct = /CLASSE TEST/.test(l.classe); const att = ct ? CT0.concat(CHA0.filter(x => !CT0.includes(x))) : CHA0;
        dire('  [P] répétition, ' + quand + ' : l’en-tête « ' + l.classe + ' », ' + l.eleves.length + ' pastilles, « ' + l.presents + ' »');
        verif('P1', egal(l.eleves, att), 'répétition (' + quand + ') de la séance de ' + (ct ? 'CLASSE TEST' : '3E Charles de Gaulle') + ' : les pastilles sont ' + (ct ? 'ses ' + CT0.length + ' élèves, puis les ' + CHA0.length + ' de la classe d’essai (' + att.length + ')' : 'ses ' + CHA0.length + ' élèves — elle est la classe d’essai, une seule fois'), { classe: l.classe, n: l.eleves.length });
        verif('P1', new RegExp('sur ' + att.length + ' présents').test(l.presents), 'répétition (' + quand + ') : le compteur dit « … sur ' + att.length + ' présents »', l.presents); };
      juger(lst0, 'la classe proposée');
      const autre = /CLASSE TEST/.test(lst0.classe) ? '3E Charles de Gaulle' : 'CLASSE TEST';
      await a.pg.click('#hclasse').catch(() => {}); await p(600); await a.pg.evaluate(c => { const b = document.querySelector('#dr-classes-choix [data-cl="' + c + '"]'); if (b) b.click(); }, autre).catch(() => {}); await p(1800);
      juger(await lire(), 'l’autre classe choisie dans l’en-tête (' + autre + ')');
      if (autre !== 'CLASSE TEST') { await a.pg.click('#hclasse').catch(() => {}); await p(600); await a.pg.evaluate(() => { const b = document.querySelector('#dr-classes-choix [data-cl="CLASSE TEST"]'); if (b) b.click(); }).catch(() => {}); await p(1800); }
      await capt(a.pg, 'P-R-liste-classe-test'); }
    else verif('P1', /Charles/.test(lst0.classe) && egal(lst0.eleves, CHA0), NOMK[k] + ' (3E Charles de Gaulle) : les pastilles sont les ' + CHA0.length + ' élèves de la classe de l’heure, comme avant', { classe: lst0.classe, n: lst0.eleves.length });
    await allerA(a.pg, QB);
    const L = await a.pg.evaluate(() => ELEVES.slice()); const INI = await a.pg.evaluate(() => Object.assign({}, INI)); const PRE = await a.pg.evaluate(() => Object.assign({}, PRENOMS));
    const tous = Object.values(INI); const base = x => String(x).replace(/\d+$/, ''); const tri = s => s.split('').sort().join(''); const plat = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const seuls = tous.filter(x => /^[A-Z]{2}$/.test(x) && tous.filter(y => base(y) === x).length === 1);
    const exact = seuls[2] || seuls[0]; const nomEx = Object.keys(INI).find(n => INI[n] === exact);
    const ana = seuls.filter(x => x !== exact).map(x => x.split('').reverse().join('')).find(x => x[0] !== x[1] && !tous.some(y => base(y) === x) && !Object.values(PRE).some(pp => plat(pp).indexOf(x.toLowerCase()) === 0));
    const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; let pref = null; for (const x of Object.values(PRE)) { const c2 = plat(x).slice(0, 2).toUpperCase(); if (/^[A-Z]{2}$/.test(c2) && !tous.some(y => base(y) === c2 || tri(base(y)) === tri(c2))) { pref = c2; break; } }
    let rien = null; for (const x of AZ) { for (const y of AZ) { const c2 = x + y; if (!tous.some(z => base(z) === c2 || tri(base(z)) === tri(c2) || base(z).indexOf(c2) === 0) && !Object.values(PRE).some(pp => plat(pp).indexOf(c2.toLowerCase()) === 0)) { rien = c2; break; } } if (rien) break; }
    const CAS = [['a', 'les initiales exactes d’un élève', exact], ['b', 'ces lettres inversées (initiales de personne)', ana], ['c', 'le début d’un prénom (initiales de personne)', pref], ['d', 'des initiales de personne, début d’aucun prénom', rien]].filter(x => x[2]);
    dire('  [P] ' + NOMK[k] + ' · ' + L.length + ' pastilles · les cas : ' + CAS.map(x => '(' + x[0] + ') « ' + x[2] + ' »').join(' ') + ' · les initiales exactes (a) : ' + rangDe(L, nomEx));
    /* la ligne de réponse : pendant la frappe, puis Entrée, Tab, ou un clic dans la réponse */
    let n = 0;
    for (const [id, quoi, ini] of CAS) for (const valider of ['Entrée', 'Tab', 'clic dans la réponse']) {
      const champs = await a.pg.$$('#mur .rep[data-r] .ini'); const champ = champs[champs.length - 1]; if (!champ) { verif('P2', false, 'une ligne de réponse libre', null); continue; }
      const pos = await champ.evaluate(el => { const r = el.closest('.rep'); return { bi: +r.dataset.bi, ri: +r.dataset.r }; }); const av = await etatPart(a.pg);
      await champ.click(); await p(150); await a.pg.keyboard.type(ini, { delay: 70 }); await p(450);
      const fr = await a.pg.evaluate(({ bi, ri }) => { const d = etatDiapo(); const r = ((d.reps || {})[bi] || [])[ri] || null; return r ? { eleve: r.eleve, i: r.i } : null; }, pos); const vf = await etatPart(a.pg);
      if (valider === 'Entrée') await a.pg.keyboard.press('Enter'); else if (valider === 'Tab') await a.pg.keyboard.press('Tab'); else { const dit = await a.pg.$$('#mur .rep[data-r] .dit'); await dit[dit.length - 1].click(); }
      await p(300); const rep = 'Le peintre montre ' + ['la nature immense', 'la peur du naufrage', 'l’homme tout petit', 'le ciel en colère', 'la solitude', 'la mer déchaînée', 'un voyageur rêveur', 'la lumière', 'le froid', 'l’espoir', 'le silence', 'la tempête'][n++ % 12] + '.';
      await a.pg.keyboard.type(rep, { delay: 12 }); await p(150); await a.pg.keyboard.press('Enter'); await p(900);
      const ap = await a.pg.evaluate(({ bi, ri }) => { const d = etatDiapo(); const r = ((d.reps || {})[bi] || [])[ri] || null; return r ? { eleve: r.eleve, i: r.i, r: r.r } : null; }, pos); const va = await etatPart(a.pg);
      const neufsF = vf.verts.filter(x => !av.verts.includes(x)), neufsA = va.verts.filter(x => !av.verts.includes(x));
      const dit = '« ' + ini + ' », ' + valider + ' : pendant la frappe ' + rangDe(L, fr && fr.eleve) + ', ' + neufsF.length + ' vert(s) neuf(s) ; après, gardées « ' + (ap && ap.i) + ' », à ' + rangDe(L, ap && ap.eleve) + ', vert(s) neuf(s) : ' + (neufsA.map(x => rangDe(L, Object.keys(INI).find(m => INI[m] === x))).join(', ') || 'aucun') + ' ; « ' + va.presents + ' »';
      if (id === 'a') { verif('P3', fr && fr.eleve === nomEx && ap && ap.eleve === nomEx && ap.i === exact && va.verts.includes(exact), NOMK[k] + ' · (a) ' + quoi + ' — ' + dit, null); }
      else { verif('P2', fr && !fr.eleve && !neufsF.length, NOMK[k] + ' · (' + id + ') ' + quoi + ', pendant la frappe : personne n’est désigné, personne ne passe au vert', { fr, neufsF });
        verif('P2', ap && !ap.eleve && ap.i === ini && !neufsA.length && va.presents === av.presents, NOMK[k] + ' · (' + id + ') ' + quoi + ' — ' + dit, null); } }
    /* le VIF (F2) et la palette (Maj + Espace) : une suggestion qui ne compte pas */
    for (const [id, quoi, ini] of CAS) {
      const av = await etatPart(a.pg); await a.pg.keyboard.press('Escape').catch(() => {}); await p(200); await a.pg.click('#vif').catch(() => {}); await p(200);
      await a.pg.keyboard.type(ini, { delay: 70 }); await p(500); const vf = await etatPart(a.pg); const sug = norm(await texteDe(a.pg, '#vif-sug'));
      await a.pg.keyboard.press('Enter'); await p(500); const fi = await etatPart(a.pg); if (fi.fiche) { await a.pg.keyboard.press('Enter'); await p(700); }
      const va = await etatPart(a.pg); await a.pg.evaluate(() => { const z = document.getElementById('vif'); if (z) { z.value = ''; z.blur(); } const pp = document.getElementById('ppop'); if (pp) pp.classList.remove('on'); }); await p(300);
      const posees = va.parts.slice(av.parts.length); const dit = 'VIF « ' + ini + ' » : la suggestion « ' + sug.slice(0, 120) + ' » ; pendant la frappe ' + (vf.parts.length - av.parts.length) + ' parole(s), fiche : ' + rangDe(L, vf.fiche && Object.keys(INI).find(m => INI[m] === vf.fiche)) + ' ; après Entrée, posée(s) : ' + (posees.map(x => rangDe(L, x)).join(', ') || 'aucune');
      if (id === 'a') verif('P5', posees.length === 1 && posees[0] === nomEx, NOMK[k] + ' · (a) ' + quoi + ' — ' + dit, null);
      else verif('P4', vf.parts.length === av.parts.length && !posees.length && va.verts.length === av.verts.length && va.oraux.length === av.oraux.length && va.paroles === av.paroles, NOMK[k] + ' · (' + id + ') ' + quoi + ' — ' + dit + ' (rien ne compte)', null);
      const av2 = await etatPart(a.pg); await a.pg.keyboard.press('Shift+Space'); await p(500); const pal = await a.pg.isVisible('#dr-vif-pal-in').catch(() => false);
      if (pal) { await a.pg.keyboard.type(ini, { delay: 70 }); await p(500); const sg2 = norm(await texteDe(a.pg, '#dr-vif-pal-sug')); const pf = await etatPart(a.pg); await a.pg.keyboard.press('Enter'); await p(800); const pa = await etatPart(a.pg);
        if (await a.pg.isVisible('#dr-vif-pal-in').catch(() => false)) { await a.pg.keyboard.press('Escape'); await p(400); }
        const pos2 = pa.parts.slice(av2.parts.length); const dit2 = 'palette « ' + ini + ' » : « ' + sg2.slice(0, 120) + ' » ; pendant la frappe ' + (pf.parts.length - av2.parts.length) + ' parole(s) ; après Entrée, posée(s) : ' + (pos2.map(x => rangDe(L, x)).join(', ') || 'aucune');
        if (id === 'a') verif('P5', pos2.length === 1 && pos2[0] === nomEx, NOMK[k] + ' · (a) ' + quoi + ' — ' + dit2, null);
        else verif('P4', pf.parts.length === av2.parts.length && !pos2.length && pa.verts.length === av2.verts.length && pa.oraux.length === av2.oraux.length, NOMK[k] + ' · (' + id + ') ' + quoi + ' — ' + dit2 + ' (rien ne compte)', null); }
      else verif('P4', false, NOMK[k] + ' · la palette s’ouvre (Maj + Espace)', null); }
    await capt(a.pg, 'P-' + k + '-pilote'); await p(2500);
    if (k === 'H') { const C = SE(sk0(HUBN)[0]) + '/deroule_joue/3E Charles de Gaulle'; const jr = lireH(C + '/journal'); const Lj = Array.isArray(jr) ? jr : Object.values(jr || {}); const par = Lj.filter(x => x && x.type === 'parole').map(x => x.nom);
      verif('P6', par.length > 0 && par.every(x => x === nomEx), 'vraie heure · au hub, le journal de la classe : ' + par.length + ' parole(s), toutes de l’élève aux initiales exactes (' + rangDe(L, nomEx) + ')', [...new Set(par.map(x => rangDe(L, x)))]); }
    if (k === 'T') verif('P6', horsTest(0).length === 0, 'mode test · aucune écriture hors de /site/tableau_test (K15-test) — ' + ECR.length + ' écritures', horsTest(0));
    if (k === 'R') verif('P6', ecritsDepuis(0, /deroule_joue/).length === 0, 'répétition · rien d’écrit dans la copie d’une classe', ecritsDepuis(0, /deroule_joue/));
    finir('P9', a, 'P ' + k); await a.ctx.close().catch(() => {}); } };

const NOMS0 = (() => { const st = storeOuverture(RACINE, { champs: true }); const el = []; const aj = v => { if (v == null) return; if (typeof v === 'string') el.push(v); else if (typeof v === 'object') Object.values(v).forEach(aj); }; Object.values(st.classes || {}).forEach(c => aj(c && c.eleves)); return [...new Set(el.join(' ').split(/\s+/).filter(x => x.length >= 3))].sort((a, b) => b.length - a.length); })();
const anon = t => { let x = String(t); NOMS0.forEach(n => { x = x.split(n).join('«nom»'); }); return x.replace(/«nom»(\s+«nom»)+/g, '«nom»').replace(/«nom»/g, 'un élève'); };
anonF = anon;
for (const [k, f] of [['K', partieK], ['M', partieM], ['W', partieW], ['P', partieP]]) { if (!joue(k)) continue; dire(''); dire('— partie ' + k + ' · ' + new Date().toISOString().slice(11, 16) + ' UTC'); try { await f(); } catch (e) { verif(k, false, 'la partie ' + k + ' a levé', String(e && e.stack || e).slice(0, 600)); } }
dire(''); dire('--- fin : ' + nb + ' vérifications, ' + echecs + ' échec(s)');
fs.writeFileSync(path.join(OUT, 'sonde-lot1-' + TAG + '-' + PARTIES.join('') + '.txt'), anon(R.join('\n')) + '\n');
await nav.close(); process.exit(echecs ? 1 : 0);
