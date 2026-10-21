// LE BANC D'E4 — le récit et le papier, par le geste. Banc unique : il rejoue tout le lot et échoue (code 1) si un seul échoue.
// usage : node banc.mjs <fichier.html> [dossier-de-sortie]
//   le fichier : LIVRAISONS/INTEGRATION/assemble/index.html (le site intégré : MJPC_ENTREE=site, faux hub, horloge au lundi 14/09 09:00)
//                ou une maquette p8-5g où dr-recit.js est injecté (avant E1-a : MJPC_ENTREE absent).
//   MJPC_PLAYWRIGHT, MJPC_CHROMIUM, MJPC_HUB : comme les outils de la conscience (AUDITS/INTEGRATION-DEROULE/README.md).
// Les attendus viennent du mandat E4 et du cadrage 2, jamais de la version jouée. Un pas qu'on ne peut pas jouer sur cette entrée
// est « absent » (dit, pas compté vert) ; un pas absent du territoire d'E4 sur le site est un ÉCHEC.
import path from 'node:path'; import fs from 'node:fs'; import { createRequire } from 'node:module'; import { createHash } from 'node:crypto';
const F = path.resolve(process.argv[2] || ''); if (!process.argv[2] || !fs.existsSync(F)) { console.log('usage : node banc.mjs <fichier.html> [sortie]'); process.exit(2); }
const OUT = path.resolve(process.argv[3] || path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'sorties', new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-'))); fs.mkdirSync(OUT, { recursive: true });
const CAP = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'captures'); fs.mkdirSync(CAP, { recursive: true });
const req = createRequire(import.meta.url); let pw = null;
for (const c of [process.env.MJPC_PLAYWRIGHT, '/opt/node22/lib/node_modules/playwright', path.join(path.dirname(F), 'node_modules', 'playwright'), 'playwright'].filter(Boolean)) { try { pw = req(c); break; } catch (e) {} }
if (!pw) { console.log('Playwright introuvable'); process.exit(2); }
const SITE = process.env.MJPC_ENTREE === 'site', SIMULE = process.env.MJPC_ENTREE === 'simule', HUBBE = SITE || SIMULE;   /* simule : la maquette + E4/bancs/socle-simule.js (un hub en mémoire, la séance 0 du faux hub) */
const HUB = path.resolve(process.env.MJPC_HUB || path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', '..', '..', 'AUDITS', 'INTEGRATION-DEROULE', 'hub'));
const md5 = createHash('md5').update(fs.readFileSync(F)).digest('hex');
const L = []; let nbOk = 0, nbEchec = 0, nbAbsent = 0;
const dire = s => { L.push(s); console.log(s); };
const verif = (k, ok, quoi, detail) => { if (ok === null) { nbAbsent++; dire('  absent ' + k + ' · ' + quoi + (detail ? ' — ' + detail : '')); return false; } if (ok) nbOk++; else nbEchec++; dire((ok ? '  ok     ' : '  ÉCHEC  ') + k + ' · ' + quoi + (detail != null && !ok ? ' — ' + String(detail).slice(0, 400) : '')); return !!ok; };
dire(`banc E4 · ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · ${SITE ? 'entrée du site (faux hub)' : SIMULE ? 'maquette + socle simulé + dr-recit.js' : 'maquette + dr-recit.js'} · ${path.basename(F)} · md5 ${md5}`);

// ── le faux hub (le même dispositif que parcours.mjs et controles.mjs v2) ──
const J_ = f => JSON.parse(fs.readFileSync(path.join(HUB, f), 'utf8'));
const store = () => { const st = { classes: J_('classes.json'), taxonomie: fs.existsSync(path.join(HUB, 'taxonomie.json')) ? J_('taxonomie.json') : null, site: { '3e': J_('site_3e.json'), config: J_('site_config.json'), edt: { grille: { '2026-2027': J_('grille-appariee.json') }, calendrier: { '2026-2027': J_('calendrier.json') }, creneaux: J_('creneaux.json') } } };
  if (process.env.E4_SANS_ED !== '1') { try { st.classes['3E Charles de Gaulle'].ed = { espace: 2, lien: 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud' }; } catch (e) {} } return st; };
const fauxHub = s => { window.__HUB = JSON.parse(JSON.stringify(s)); window.__ECR = []; const lire = c => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) { if (n === null || typeof n !== 'object' || !(k in n)) return null; n = n[k]; } return n === undefined ? null : n; }; const pos = (c, v) => { const q = c.split('/').filter(Boolean); let n = window.__HUB; for (let k = 0; k < q.length - 1; k++) { if (typeof n[q[k]] !== 'object' || n[q[k]] === null) n[q[k]] = {}; n = n[q[k]]; } if (v === null) delete n[q[q.length - 1]]; else n[q[q.length - 1]] = v; };
  window.fetch = function (u, o) { const s2 = String(u); if (s2.indexOf('firebasedatabase.app') >= 0) { const c = decodeURIComponent(s2.split('firebasedatabase.app')[1].split('?')[0].replace(/\.json$/, '')); const m = ((o && o.method) || 'GET').toUpperCase(); if (m === 'GET') return Promise.resolve(new Response(JSON.stringify(lire(c)), { status: 200 })); let bd = null; try { bd = JSON.parse((o && o.body) || 'null'); } catch (e) {} if (m === 'PATCH' && bd && typeof bd === 'object') Object.keys(bd).forEach(k => pos(c + '/' + k, bd[k])); else if (m === 'DELETE') pos(c, null); else pos(c, bd); window.__ECR.push({ m, c, t: Date.now() }); return Promise.resolve(new Response(JSON.stringify(bd), { status: 200 })); } return Promise.resolve(new Response('{}', { status: 200 })); };
  window.WebSocket = function () { throw new Error('websocket bloqué'); }; };

const nav = await pw.chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const clicTexte = (pg, sel, txt) => pg.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
let HUB_PERSISTANT = null;
/* le réseau est coupé (faux hub) : les images de mjpc-medias reçoivent une image locale 160 × 90, pour que la diapo ait une image où poser des marques */
import zlib from 'node:zlib';
const PNG = (() => { const w = 160, h = 90; const raw = Buffer.alloc((w * 3 + 1) * h, 0x99); for (let y = 0; y < h; y++) raw[y * (w * 3 + 1)] = 0; const T = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; T[n] = c >>> 0; } const crc = b => { let x = 0xffffffff; for (const v of b) x = T[(x ^ v) & 0xff] ^ (x >>> 8); return (x ^ 0xffffffff) >>> 0; }; const ch = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); }; const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2; return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', zlib.deflateSync(raw)), ch('IEND', Buffer.alloc(0))]); })();   /* entre deux ouvertures (le rechargement), le faux hub garde ce qui a été écrit */
async function ouvrir(o = {}) {
  const ctx = await nav.newContext({ viewport: { width: o.largeur || 1366, height: o.hauteur || 768 }, timezoneId: 'Europe/Paris' }); await ctx.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  if (SITE) { await ctx.route(u => !String(u).startsWith('file:'), r => r.abort()); await ctx.route(/mjpc-medias/, r => r.fulfill({ status: 200, contentType: 'image/png', body: PNG })); }
  const pg = await ctx.newPage(); const errs = [], boites = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('dialog', d => { boites.push(d.type() + ' : ' + d.message()); d.dismiss().catch(() => {}); });
  if (SIMULE) { const se = store().site['3e'].chapitres; const s0 = (Array.isArray(se) ? se[0] : se['0']).seances; await pg.addInitScript(([h, sc]) => { window.__E4HUB_INIT = h; window.__E4SEANCE = sc; }, [o.frais ? null : HUB_PERSISTANT, Array.isArray(s0) ? s0[0] : s0['0']]); }
  if (!SITE) { await pg.goto('file://' + F); await pg.waitForTimeout(600); return { ctx, pg, errs, boites }; }
  await pg.clock.setFixedTime(new Date('2026-09-14T09:00:00+02:00')); await pg.addInitScript(fauxHub, o.hub || (o.frais ? null : HUB_PERSISTANT) || store());
  /* le voile #fi-overlay du site (« Aucune fiche n'existe pour cette application ») : le faux hub n'a pas /manifestes (audit E1, F15, à la conscience) — écarté ici à chaque apparition, comme une lacune du faux hub, pas du site */
  await pg.addInitScript(() => { const ot = () => { const v = document.getElementById('fi-overlay'); if (v) v.remove(); }; document.addEventListener('DOMContentLoaded', () => { ot(); new MutationObserver(ot).observe(document.body, { childList: true, subtree: true }); }); });
  if (o.modeTest) await pg.addInitScript(() => { try { localStorage.setItem('mjpc_mode_test', '1'); } catch (e) {} });
  await pg.goto('file://' + F + '?n=3e', { waitUntil: 'load' }); await pg.waitForTimeout(1800);
  await pg.evaluate(() => { document.body.classList.add('admin-mode'); if (window.SECU) SECU.valide = true; const o = document.getElementById('fi-overlay'); if (o) o.remove(); }); await pg.waitForTimeout(300);
  await pg.click('#tprof-btn').catch(() => {}); await pg.waitForTimeout(500); await pg.evaluate(() => { if (typeof atelierOuvrir === 'function') atelierOuvrir(); }); await pg.waitForTimeout(1000);
  await clicTexte(pg, 'button,[onclick]', "atOnglet('chapitres')"); await pg.waitForTimeout(800);
  if (!(await clicTexte(pg, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(pg, 'button,[onclick]', 'Modifier'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await pg.waitForTimeout(2000);
  return { ctx, pg, errs, boites };
}
const p = (pg, ms) => pg.waitForTimeout(ms);
const cap = async (pg, nom) => { try { await pg.screenshot({ path: path.join(CAP, nom + '.png'), fullPage: false }); } catch (e) {} };
const garde = async pg => { for (let i = 0; i < 3; i++) { const g = await pg.$('#garde.on, #garde-devant.on'); if (!g) return; await pg.keyboard.press('Escape'); await p(pg, 150); } };
async function lancer(pg) { await pg.click('[data-lancer="1"]'); await p(pg, 700); }
async function devoiler(pg, n) { for (let i = 0; i < n; i++) { await pg.click('#bdev'); await p(pg, 90); } }
async function parole(pg, ini) { await pg.keyboard.press('F2'); await p(pg, 100); await pg.keyboard.type(ini); await p(pg, 150); await pg.keyboard.press('1'); await p(pg, 80); await pg.keyboard.press('Enter'); await p(pg, 250); }
async function jusquA(pg, cond, max = 90) { let n = 0; while (!(await pg.evaluate(cond)) && n < max) { if (await pg.$('.garde.on')) break; /* une garde (le cahier, un saut) : on ne force rien */ await pg.click('#bdev', { timeout: 3000 }).catch(() => {}); await p(pg, 60); n++; } return await pg.evaluate(cond); }
async function reponse(pg, ini, txt) { await pg.click('#mur .rep .ini'); await pg.keyboard.type(ini); await p(pg, 100); await pg.click('#mur .rep .dit'); await pg.keyboard.type(txt); await pg.keyboard.press('Enter'); await p(pg, 300); }
async function relecture(pg) { const v = await pg.$('.at-onglet[data-vue="relecture"]'); if (v) await v.click(); else if (await pg.$('.voile.on')) await pg.evaluate(() => voir('relecture')); /* la maquette rechargée s'ouvre sur son emploi du temps simulé */ else await pg.click('#ong-relecture'); await p(pg, 900); }
async function face(pg, debut) { const ok = await pg.evaluate(t => { const b = Array.from(document.querySelectorAll('#faces [data-f]')).find(x => x.textContent.trim().startsWith(t)); if (!b) return false; b.click(); return true; }, debut); await p(pg, 500); return ok; }
const texteRel = pg => pg.evaluate(() => (document.querySelector('#rel') || {}).innerText || '');
const ecritures = pg => pg.evaluate(() => (window.__ECR || []).map(x => x.m + ' ' + x.c));
const DIT = 'Ils montrent tous la nature plus grande que l’homme';
const PHRASE = 'Phrase corrigée par M. Meney pour le banc E4.';

// ═════ R1 · le récit d'une heure jouée : la diapo, l'heure, le prénom, la réponse (mandat, bancs ; cadrage 2 · 1.2, 1.3, 1.5 bis) ═════
{ const o = await ouvrir(); const pg = o.pg; await lancer(pg);
  await devoiler(pg, 3); await parole(pg, 'ZP');
  const q = await jusquA(pg, () => ecran().blocs.some(b => b.t === 'question')); await pg.click('#bdev'); await p(pg, 150); await garde(pg);
  if (q) await reponse(pg, 'GA', DIT);
  await relecture(pg); await cap(pg, 'E4-R1-le-recit');
  const t = await texteRel(pg); const act = await pg.evaluate(() => ecran().act);
  verif('R1', q, 'une diapo à question est atteinte en dévoilant', null);
  verif('R1', /Ce qu'on a fait aujourd'hui/.test(t), 'la face « Le récit » s\'ouvre sur « Ce qu\'on a fait aujourd\'hui »', t.slice(0, 200));
  verif('R1', t.includes(act), 'le récit porte la diapo jouée (son activité)', act);
  verif('R1', /À \d{1,2} h \d{2}, /.test(t), 'le récit porte l\'heure réelle (« À hh h mm, »)', t.slice(0, 300));
  verif('R1', /Gatien/.test(t) && t.includes(DIT), 'le récit porte le prénom (Gatien, pas ses initiales) et sa réponse', t.slice(0, 1200));
  verif('R1', !/\bGA\b a répondu/.test(t), 'aucune initiale à la place d\'un prénom', null);
  verif('R1', /Zélia a pris la parole/.test(t), 'une prise de parole hors d\'une question se raconte (« Zélia a pris la parole », cadrage 2 · 1.5)', t.slice(0, 700));
  verif('R1', o.errs.length === 0, 'zéro erreur JS', JSON.stringify(o.errs));

  // ═════ R2 · ma version : une phrase corrigée survit au rechargement (C/recit/1.texte, version 'moi') ; « relu » (C/recit/1.relu) ═════
  await pg.click('#rel [data-rv="moi"]'); await p(pg, 400);
  const edit = await pg.$('#rel .recit.ma-version'); if (edit) { await edit.click(); await pg.keyboard.press('Control+End'); await pg.keyboard.type(' ' + PHRASE); await p(pg, 1400); }
  verif('R2', !!edit && (await pg.evaluate(ph => ((S.recitMoi || {})[1] || '').includes(ph), PHRASE)), '« ma version (modifier) » : la phrase corrigée est dans ma version', null);
  // le récit relu : l'étape 4 de la fin de l'heure (E2 la pose ; ici par son geste s'il existe)
  const relu = await pg.evaluate(() => { const b = document.getElementById('f-relu'); if (b) { b.click(); return 'geste'; } if (typeof S !== 'undefined') { return null; } });
  if (HUBBE) { await p(pg, 2200); const ecr = await ecritures(pg); const chem = x => x.slice(x.indexOf(' ') + 1); const recits = ecr.filter(x => /\/deroule_joue\/[^/]+\/recit\/[^/]+$/.test(chem(x)));
    verif('R2', recits.length > 0, 'C/recit/1 est écrit au hub (débounce 900 ms, par dr_ecrire)', JSON.stringify(ecr.slice(-12)));
    const auHub = await pg.evaluate(() => { const c = (typeof dr_cheminC === 'function') ? dr_cheminC() : ''; const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q.concat(['recit'])) { if (!n || typeof n !== 'object') return null; n = n[k]; } return n ? Object.values(n)[0] || null : null; });
    verif('R2', auHub && auHub.version === 'moi' && String(auHub.moi || '').includes(PHRASE), 'au hub : C/recit/<clé> = {version:"moi", moi: la phrase corrigée, versions[]} (relance E4, F2)', JSON.stringify(auHub).slice(0, 300));
    HUB_PERSISTANT = await pg.evaluate(() => window.__HUB);
    // K15 (E4) : de mon fait, seul C/recit/<h>
    const miennes = ecr.filter(x => /recit/.test(x)); verif('K15-E4', miennes.every(x => /\/deroule_joue\/[^/]+\/recit\/\d{4}-\d\d-\d\d_[^/]+$/.test(chem(x))), 'K15 : ce qu\'E4 écrit, c\'est C/recit/<clé de l\'heure> (<iso>_<créneau>_<classe>, relance E4 I4) et rien d\'autre', JSON.stringify(miennes));
  } else verif('R2', null, 'C/recit/1 au hub', 'la maquette n\'a pas de hub : se mesure sur le site');

  // ═════ P1 · la face Papier : le récit relu, l'entête, le travail, le pied ; ce qu'on colle ═════
  const okF = await face(pg, 'Papier'); await p(pg, 300); await cap(pg, 'E4-P1-le-papier');
  const pap = await pg.evaluate(() => { const d = document.querySelector('#rel .dr-papier'); return d ? d.innerText : ''; });
  verif('P1', okF && !!pap, 'la face « Papier » existe dans la Relecture (proposition 96)', null);
  verif('P1', /CLASSE|Classe/.test(pap) && /CHAPITRE|Chapitre/.test(pap) && /SÉANCE|Séance/.test(pap), 'l\'entête du papier : classe · chapitre · séance', pap.slice(0, 200));
  verif('P1', /Ce qu'on a fait aujourd'hui/.test(pap) && /À relire — \S+/.test(pap), '« Ce qu\'on a fait aujourd\'hui », « À relire — <date> »', pap.slice(0, 300));
  verif('P1', pap.includes(PHRASE), 'le papier est composé depuis le récit relu (ma version, la phrase corrigée y est)', pap.slice(0, 600));
  verif('P1', /MJPC · monsieurjaipascompris/.test(pap) && /À relire\./.test(pap), 'le pied « MJPC · monsieurjaipascompris » / « À relire. »', null);
  const trav = await pg.evaluate(() => typeof texteTravail === 'function' ? (texteTravail() || '') : ''); verif('P1', !trav || /Pour la prochaine séance/.test(pap), 'le travail à faire est sur le papier quand il y en a un', trav.slice(0, 120));
  // l'impression : seule la feuille
  await pg.emulateMedia({ media: 'print' }); await p(pg, 200); await cap(pg, 'E4-P1-impression');
  const imp = await pg.evaluate(() => { const vis = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; }; const z = document.getElementById('dr-impression'); const hors = Array.from(document.body.children).filter(x => x !== z && vis(x)).map(x => x.tagName + '#' + x.id + '.' + x.className).slice(0, 5); return { feuille: !!z && vis(z) && /Ce qu'on a fait aujourd'hui/.test(z.innerText), hors }; });
  await pg.emulateMedia({ media: 'screen' });
  verif('P1', imp.feuille && imp.hors.length === 0, '@media print : la feuille, et rien d\'autre du site', JSON.stringify(imp));

  // ═════ ED · « Copier pour École Directe » : le HTML propre (R22) et le texte de la maquette ═════
  await face(pg, 'Le récit'); await p(pg, 300); await pg.click('#rel [data-rv="site"]').catch(() => {}); await p(pg, 300);
  await pg.click('#r-copie-contenu'); await p(pg, 500);
  const cp = await pg.evaluate(() => window.DR_RECIT_DERNIERE_COPIE || null);
  verif('ED', cp && /font-family:Georgia/.test(cp.html) && !/class=|data-cle|contenteditable/.test(cp.html), 'la copie « contenu de séance » est un HTML propre (ancien copierED : Georgia, sans classes ni repères)', cp ? cp.html.slice(0, 200) : 'rien');
  verif('ED', cp && /Gatien/.test(cp.texte) && !/Pour la prochaine séance/.test(cp.texte), 'le texte copié : le récit, sans le travail à faire', cp ? cp.texte.slice(-200) : '');
  const presse = await pg.evaluate(async () => { try { const it = await navigator.clipboard.read(); return it.length ? it[0].types : []; } catch (e) { return 'illisible : ' + e.message; } });
  verif('ED', Array.isArray(presse) ? presse.includes('text/html') && presse.includes('text/plain') : null, 'le presse-papier reçoit text/html et text/plain', JSON.stringify(presse));
  await pg.click('#r-copie-travail'); await p(pg, 400); const ct = await pg.evaluate(() => window.DR_RECIT_DERNIERE_COPIE || null); const lienAttendu = SITE && process.env.E4_SANS_ED !== '1';
  verif('ED', ct && !/ecoledirecte/.test(ct.texte) && !/<a href=/.test(ct.html), '« Copier — travail à faire » ne met pas de lien (relance E4, F8 tranché : ni aujourd\'hui ni dans la maquette)', ct ? ct.texte.slice(-200) : '');
  verif('ED', await pg.evaluate(() => (S.copieED || {})[1] && J.some(x => x.type === 'copie-ed')), 'la copie est notée (S.copieED, journal copie-ed : la garde après copie s\'en sert)', null);
  await o.ctx.close();
}

// ═════ R3 · le rechargement : ma version revient (site) ═════
if (HUBBE && HUB_PERSISTANT) { const o = await ouvrir(); const pg = o.pg; if (process.env.E4_DEBUG) console.log('DEBUG', JSON.stringify(await pg.evaluate(() => { const c = dr_cheminC(); const q = c.split('/').filter(Boolean); let n = window.__HUB; for (const k of q) n = n && n[k]; return { c, lancee: S.lancee, heure: S.heure, J: J.map(x => x.type + ':' + x.h + ':' + x.di).join(' '), hubJ: n && n.journal ? JSON.stringify(n.journal).slice(0, 600) : null, etatS: n && n.etat ? Object.keys(n.etat).join(',') + ' / S:' + Object.keys(n.etat.S || {}).length : null, hubKeys: n ? Object.keys(n) : null, cours: window.__HUB.site && window.__HUB.site.cours_actif }; })).slice(0, 1500)); await relecture(pg); await p(pg, 400); await relecture(pg); const t = await texteRel(pg);
  verif('R3', t.includes(PHRASE), 'rechargé : la phrase corrigée (ma version) est là, relue au hub', t.slice(0, 400));
  if (SITE) { await pg.click('#rel [data-rv="site"]').catch(() => {}); await p(pg, 500); const t2 = await texteRel(pg); const jHub = await pg.evaluate(() => { const q = dr_cheminC().split('/').filter(Boolean); let n = window.__HUB; for (const k of q) n = n && n[k]; const j = n && n.journal; return JSON.stringify(j || []); }); const aRep = /"type":"reponse"/.test(jHub); verif('R3', aRep ? (/Gatien/.test(t2) && t2.includes(DIT)) : null, aRep ? 'rechargé, « composé par le site » : le récit se recompose depuis le journal relu au hub (C/journal, C/etat d\'E2)' : 'rechargé, le récit recomposé depuis C/journal', aRep ? t2.slice(0, 600) : 'C/journal au hub ne contient pas la réponse écrite (E2 : le journal n\'est poussé qu\'au lancement) — ' + jHub.length + ' o'); } await cap(pg, 'E4-R3-apres-rechargement'); await o.ctx.close(); }
else verif('R3', null, 'le rechargement', HUBBE ? 'R2 n\'a rien laissé au hub' : 'la maquette n\'a pas de hub');

// ═════ R4 · le rappel d'une fiche (R2 du recyclage) et ses citations (R15) ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg; await lancer(pg);
  /* la séance 0 du faux hub n'a aucune fiche (audit M7) et le geste du rappel est celui de l'Atelier (E1) : la fiche est posée dans la copie
     de la diapo jouée, telle qu'E1 la posera ({t:'fiche', txt, el, rappel:{motif}}) — c'est l'écriture du récit qu'on mesure ici */
  await pg.evaluate(() => { const e = ecran(); e.blocs.push({ t: 'fiche', bid: 'b-e4-fiche', txt: 'Le registre lyrique', el: ['Le lyrique exprime des sentiments personnels.'], rappel: { motif: 'reviser', libre: '' } }); tout(); });
  await devoiler(pg, 2); await relecture(pg); const t = await texteRel(pg);
  verif('R4', /on a repris la fiche Le registre lyrique — pour réviser avant l'évaluation/i.test(t), 'le rappel s\'écrit dans le récit : « on a repris la fiche … — pour réviser avant l\'évaluation »', t.slice(0, 900));
  verif('R4', /repris une fiche déjà vue/.test(t), 'le bilan dit « repris une fiche déjà vue »', t.slice(-300));
  await face(pg, 'Papier'); const pap = await pg.evaluate(() => (document.querySelector('#rel .dr-papier') || {}).innerText || '');
  verif('R4', /à coller dans le cahier/i.test(pap) && /Le registre lyrique/.test(pap) && /Rappel — pour réviser avant l'évaluation/.test(pap), 'le papier « ce qu\'on colle » : la fiche montrée, son rappel, « à coller dans le cahier » (ancien papier, R16)', pap.slice(-400)); await cap(pg, 'E4-R4-fiche-a-coller');
  await o.ctx.close(); }

// ═════ D1 · un document de Structure dans l'écran, par référence (site) ═════
if (HUBBE) { const o = await ouvrir({ frais: true }); const pg = o.pg; await lancer(pg);
  await pg.evaluate(() => ouvrirDocs()); await p(pg, 400); const okD = await clicTexte(pg, '#fdocs-l button', 'Projeter'); await p(pg, 600); await cap(pg, 'E4-D1-document');
  const d = await pg.evaluate(() => { const f = document.querySelector('#mur .dr-doc-cadre'); const m = document.querySelector('#mur .dr-doc-ref'); return { src: f ? f.getAttribute('src') : '', txt: m ? m.innerText : '' }; });
  verif('D1', okD && /^https:\/\/drive\.google\.com\/file\/d\/1NJgOv-C6AqMDKTuOd9yNO5I_pq3n4mhc\/preview$/.test(d.src), 'l\'item Drive de la séance s\'ouvre dans l\'écran en /preview', JSON.stringify(d));
  verif('D1', /vient de Structure · Séance \d+/.test(d.txt), '« cette fiche vient de Structure · Séance N »', d.txt.slice(0, 120));
  const sansAdr = await pg.evaluate(() => Array.from(document.querySelectorAll('#fdocs-l .dr-c')).map(x => x.innerText).filter(t => /n.a pas d.adresse/.test(t)).length); verif('D1', sansAdr >= 1 && !(await pg.$('#mur .dr-doc-grand')), 'un document sans adresse le dit en clair ; pas de modale du site dans le déroulé (relance E4, F5)', String(sansAdr));
  await o.ctx.close(); }
else verif('D1', null, 'les documents par référence', 'la maquette simule ses documents : se mesure sur le site');

// ═════ 13·8 · le récit se fonde sur ce que la classe a vu dans sa copie : une phrase corrigée en classe apparaît corrigée ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg; await lancer(pg); await devoiler(pg, 1);
  const cons = await pg.$('#mur [data-p="0.t"]'); let corrige = false;
  if (cons) { await cons.click(); await pg.keyboard.press('Control+A'); await pg.keyboard.type('Regardez les tableaux et dites ce que vous voyez.'); await p(pg, 400); await pg.keyboard.press('Escape'); await p(pg, 300); corrige = true; }
  await relecture(pg); const t = await texteRel(pg);
  verif('13·8', corrige ? /on a regardé les tableaux et dit ce qu'on voyait|Regardez les tableaux|on a regardé les tableaux/i.test(t) : null, 'la consigne corrigée en classe (la copie) est celle que raconte le récit', t.slice(0, 500));
  await o.ctx.close(); }

// ═════ P0 · avant tout lancement, il n'y a ni récit ni papier (relecteur neuf 2 ; cadrage 2 · 1.4) ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg; await relecture(pg);
  const f = await pg.evaluate(() => Array.from(document.querySelectorAll('#faces [data-f]')).map(b => b.textContent.trim()));
  const relT = await texteRel(pg); verif('P0', /Aucune heure n.a encore été lancée/.test(relT) && !/Ce qu'on a fait aujourd'hui/.test(relT), 'aucune heure lancée : la Relecture le dit, sans récit', relT.slice(0, 200));
  verif('P0', !f.some(t => /^Papier|^Le récit ·/.test(t)), 'aucune heure lancée : aucune face « Le récit » ni « Papier » à imprimer', JSON.stringify(f));
  await o.ctx.close(); }

// ═════ T · la transposition et la langue (relecteur neuf 1) : les mots accentués, « un élève », la copie sans repère pour Paul ═════
{ const o = await ouvrir({ frais: true }); const pg = o.pg;
  const t = await pg.evaluate(() => [recit('Placez les poètes sur la frise, devant vous.'), recit('Regardez le cinéma de ta ville.'), personne('Les poètes et tes amis'), recitEtape('Regarde : la troisième bande de la frise.'), recitEtape('Date : 1820')]);
  verif('T', !/poèses|cinénotre|poè ses/.test(t.join(' ')) && /poètes/.test(t[0]) && /ses amis/.test(t[2]) && /devant nous/.test(t[0]) && /^on a regardé la troisième bande/.test(t[3]) && !/daté/.test(t[4]), 'la transposition : les mots accentués entiers (« poètes »), « devant nous », « Regarde : la… » → « on a regardé la… », « Date : 1820 » intact', JSON.stringify(t));
  await lancer(pg); const q = await jusquA(pg, () => ecran().blocs.some(b => b.t === 'question')); await pg.click('#bdev'); await p(pg, 150); await garde(pg);
  if (q) await reponse(pg, 'ZZ', 'une réponse sans élève reconnu');
  await relecture(pg); const r = await texteRel(pg);
  verif('T', !/[.!?]\s+un élève a répondu/.test(r) && !/\?\./.test(r), 'la ponctuation : une majuscule après le point même devant un nom en gras ; jamais « ?. » (relecteur continu B)', r.slice(0, 600));
  verif('T', q ? /[Uu]n élève a répondu : « une réponse sans élève reconnu/.test(r) && !/\bZZ a répondu/.test(r) : null, 'un élève non identifié : « un élève a répondu », jamais ses initiales (cadrage 2 · 1.5 bis)', r.slice(0, 900));
  await pg.click('#rel [data-rv="moi"]'); await p(pg, 400); const r2 = await texteRel(pg);
  verif('T', /Ce qu'on a fait aujourd'hui/.test(r2) && /Cette heure a commencé à/.test(r2), '« ma version » garde l\'entête et le cadre de l\'heure', r2.slice(0, 300));
  await pg.click('#r-copie-contenu'); await p(pg, 400); const cp = await pg.evaluate(() => window.DR_RECIT_DERNIERE_COPIE || null);
  verif('T', cp && /Ce qu'on a fait aujourd'hui/.test(cp.texte) && !/tu la reprendras|composée par le site depuis/.test(cp.texte) && /<b>[^<]+<\/b><br>/.test(cp.html) /* le titre du paragraphe (« Activité N — … », ou le nom de la diapo quand la trame n'a pas d'activités) */, 'la copie ED de ma version : avec l\'entête, sans repère pour Paul, le titre d\'activité en titre', cp ? cp.texte.slice(0, 200) : '');
  const ed = await pg.$('#rel .recit.ma-version'); if (ed) { await ed.click(); await p(pg, 300); }
  verif('T', await pg.evaluate(() => document.getElementById('garde-copie').classList.contains('on')), 'après une copie ED, corriger ma version passe par la garde (cadrage 2 · 3.8)', null);
  await o.ctx.close(); }

// ═════ RC1 · R1 du recyclage : les marques sur une image (relance E4-2) — poser, dévoiler une à une au pilote et au tableau, calibrer, garder ═════
if (SITE) { const o = await ouvrir({ frais: true }); const pg = o.pg;
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 1200); if (await pg.$('#at-aide .x')) await pg.click('#at-aide .x');
  await pg.evaluate(() => dr_aller(1)); await p(pg, 700);
  const pan = await pg.evaluate(() => { const z = document.getElementById('dr-mk-panneau'); return z ? { vis: !!z.offsetParent, titres: Array.from(z.querySelectorAll('button')).every(b => b.title) } : null; });
  verif('RC1', pan && pan.vis && pan.titres, 'Atelier, diapo « Tableau 1 » : le panneau des marques (Document analysé · Illustration · outils · une à une), chaque bouton avec son infobulle', JSON.stringify(pan));
  if (pan) { if (!(await pg.evaluate(() => ecran().blocs[0].support))) await pg.click('#dr-mk-panneau [data-mk-a="support"]'); await pg.click('#dr-mk-panneau [data-mk-a="une"]'); await p(pg, 300);
    for (const [x, y] of [[0.25, 0.3], [0.6, 0.5], [0.4, 0.75]]) { await pg.click('#dr-mk-panneau [data-mk-o="pt"]'); const r = await pg.evaluate(() => document.querySelector('#mur .img-sup').getBoundingClientRect().toJSON()); await pg.mouse.click(r.x + r.width * x, r.y + r.height * y); await p(pg, 300); }
    const mk = await pg.evaluate(() => ({ m: ecran().blocs[0].marques.map(m => m.t + ':' + m.txt), dom: document.querySelectorAll('#mur .img-sup .mk').length, une: ecran().blocs[0].devoilerTout === false }));
    verif('RC1', mk.m.join(',') === 'pt:1,pt:2,pt:3' && mk.dom === 3 && mk.une, 'trois points posés d\'un clic chacun (① 1, 2, 3), visibles sur l\'image, « une à une »', JSON.stringify(mk));
    const cal = await pg.evaluate(() => { const s = document.querySelector('#mur .img-sup'); const m = s.querySelector('.mk'); return { L: s.getBoundingClientRect().width, fs: parseFloat(m.style.fontSize) }; });
    { const n0 = await pg.evaluate(() => seance().ecrans.length); await pg.evaluate(() => { DR_MK.sel = { k: 2, bi: 0 }; dr_tout(); }); await p(pg, 200); let boite = null; pg.once('dialog', d => { boite = d.message(); d.dismiss().catch(() => {}); }); await pg.keyboard.press('Delete'); await p(pg, 600);
      const apres = await pg.evaluate(() => ({ n: seance().ecrans.length, m: ecran().blocs[0].marques.length }));
      verif('RC1', apres.n === n0 && apres.m === 2 && !boite, 'Suppr sur une marque sélectionnée ne retire que la marque — jamais la diapo (relecteur continu B)', JSON.stringify({ apres, boite }));
      for (const [x, y] of [[0.4, 0.75]]) { await pg.click('#dr-mk-panneau [data-mk-o="pt"]'); const r = await pg.evaluate(() => document.querySelector('#mur .img-sup').getBoundingClientRect().toJSON()); await pg.mouse.click(r.x + r.width * x, r.y + r.height * y); await p(pg, 300); } }
    verif('RC1', Math.abs(cal.fs - cal.L * 0.042) < 0.5, 'calibrées à la largeur de l\'image (calibreMarques : 4,2 % de la largeur) — 1366', JSON.stringify(cal));
    await cap(pg, 'E4-RC1-marques-atelier'); await p(pg, 1500);
    const hub = await pg.evaluate(() => { const e = window.__HUB.site['3e'].chapitres[0].seances[0].deroule.ecrans[1]; return e ? e.blocs[0] : null; });
    verif('RC1', hub && Array.isArray(hub.marques) && hub.marques.length === 3 && hub.devoilerTout === false && hub.support === true, 'enregistrées dans la trame au hub (B/deroule : marques, devoilerTout, support)', JSON.stringify(hub).slice(0, 300));
    HUB_PERSISTANT = await pg.evaluate(() => window.__HUB); }
  await o.ctx.close();
  if (HUB_PERSISTANT) { for (const W of [1280, 1366]) { const o2 = await ouvrir({ largeur: W, hauteur: W === 1280 ? 800 : 768 }); const pg2 = o2.pg;
    await pg2.click('[data-lancer="1"]').catch(() => {}); await p(pg2, 700); const atteint = await jusquA(pg2, () => ecran().act === 'Tableau 1'); await garde(pg2);
    const vus = async () => pg2.evaluate(() => ({ dev: document.querySelectorAll('#mur .img-sup .mk:not(.pas)').length, tout: document.querySelectorAll('#mur .img-sup .mk').length }));
    const v0 = await vus(); let tab = null; if (W === 1366) { try { [tab] = await Promise.all([o2.ctx.waitForEvent('page', { timeout: 8000 }), pg2.click('#bvideoproj')]); await tab.waitForLoadState(); await p(pg2, 1500); } catch (e) { tab = null; } }
    const etapes = [v0]; const tabs = []; for (let i = 0; i < 3; i++) { await pg2.click('#bdev'); await p(pg2, 600); etapes.push(await vus()); if (tab) tabs.push(await tab.evaluate(() => document.querySelectorAll('#mur2 .img-sup .mk').length).catch(() => -1)); }
    const cal2 = await pg2.evaluate(() => { const s = document.querySelector('#mur .img-sup'); const m = s && s.querySelector('.mk'); return m ? { L: s.getBoundingClientRect().width, fs: parseFloat(m.style.fontSize) } : null; });
    verif('RC1', atteint && etapes.map(x => x.dev).join(',') === '0,1,2,3' && etapes.every(x => x.tout === 3), `rechargé (${W}) : les trois marques sont là ; en classe, ▶ les dévoile une à une au pilote (0, 1, 2, 3)`, JSON.stringify(etapes));
    verif('RC1', cal2 && Math.abs(cal2.fs - cal2.L * 0.042) < 0.5, `calibrées à la largeur de l'image en classe — ${W}`, JSON.stringify(cal2));
    if (W === 1366) { verif('RC1', tab ? tabs.join(',') === '1,2,3' : null, 'dans la fenêtre du tableau (⧉ Écran 2, E3), les marques paraissent une à une avec le pilote', tab ? JSON.stringify(tabs) : 'la fenêtre du tableau ne s\'est pas ouverte'); await cap(pg2, 'E4-RC1-marques-en-classe'); if (tab) { await tab.screenshot({ path: path.join(CAP, 'E4-RC1-marques-au-tableau.png') }).catch(() => {}); } }
    verif('RC1', o2.errs.length === 0, `zéro erreur JS (${W})`, JSON.stringify(o2.errs)); await o2.ctx.close(); } }
  HUB_PERSISTANT = null; }
else verif('RC1', null, 'R1 les marques', 'se mesure sur le site');

// ═════ RC4 · R4 du recyclage : ↶ Annuler (Ctrl+Z) dans l'Atelier — trois gestes, trois ↶, à l'identique (eid, id, texte) ; Ctrl+Z dans un champ reste celui du navigateur ═════
if (SITE) { const o = await ouvrir({ frais: true }); const pg = o.pg;
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 1200); if (await pg.$('#at-aide .x')) await pg.click('#at-aide .x');
  const etat = () => pg.evaluate(() => JSON.stringify(seance().ecrans.map(e => e.eid + ':' + e.blocs.map(b => b.id + '=' + (b.txt || '') + '|' + (b.el || []).join('¦')).join('/'))));
  const b0 = await pg.evaluate(() => { const b = document.getElementById('dr-annuler'); return b ? { dis: b.disabled, t: b.title } : null; });
  verif('RC4', b0 && b0.dis && /Rien à annuler/.test(b0.t), '« ↶ Annuler » dans la barre de l\'atelier, grisé avec sa raison tant que rien n\'a changé', JSON.stringify(b0));
  const e0 = await etat();
  const t = await pg.$('#mur [data-p="0.t"]'); await t.click(); await pg.keyboard.press('End'); await pg.keyboard.type(' — ajout du banc'); await p(pg, 300);
  await pg.keyboard.type('X'); await pg.keyboard.press('Control+z'); await p(pg, 300); const champ = await pg.evaluate(() => ({ txt: document.querySelector('#mur [data-p="0.t"]').textContent, pile: DR_PILE.l.length }));
  await pg.keyboard.press('Escape'); await p(pg, 1200); const e1 = await etat();
  verif('RC4', !/ajout du bancX/.test(champ.txt) && /ajout du banc/.test(champ.txt), 'dans un champ de texte, Ctrl+Z est celui du navigateur (il retire la dernière frappe, pas un geste de la trame)', JSON.stringify(champ));
  await pg.evaluate(() => document.activeElement && document.activeElement.blur()); await pg.keyboard.press('Alt+ArrowDown'); await p(pg, 1200); const e2 = await etat();
  pg.removeAllListeners('dialog'); pg.on('dialog', d => d.accept()); await pg.keyboard.press('Delete'); await p(pg, 400); if (await pg.$('#at-modale .at-btn-prim')) await pg.click('#at-modale .at-btn-prim'); /* la modale du site (E1 : dr_confirmer), sinon la boîte native */ await p(pg, 1200); const e3 = await etat();
  verif('RC4', e0 !== e1 && e1 !== e2 && e2 !== e3, 'trois gestes de la trame : un texte modifié, un ordre changé (Alt+↓), une diapo supprimée (Suppr)', null);
  await pg.keyboard.press('Control+z'); await p(pg, 500); const u1 = await etat(); await pg.keyboard.press('Control+z'); await p(pg, 500); const u2 = await etat(); await pg.click('#dr-annuler'); await p(pg, 500); const u3 = await etat();
  verif('RC4', u1 === e2 && u2 === e1 && u3 === e0, 'trois ↶ (Ctrl+Z, Ctrl+Z, le bouton) : la diapo revient, l\'ordre revient, le texte revient — à l\'identique (eid, id, texte)', [u1 === e2, u2 === e1, u3 === e0].join(','));
  await p(pg, 1500); const hub = await pg.evaluate(() => JSON.stringify(window.__HUB.site['3e'].chapitres[0].seances[0].deroule.ecrans.map(e => e.eid)));
  verif('RC4', hub === JSON.stringify(JSON.parse(e0).map(x => x.split(':')[0])), 'la trame d\'avant est réenregistrée au hub (B/deroule)', hub.slice(0, 200));
  verif('RC4', o.errs.length === 0, 'zéro erreur JS', JSON.stringify(o.errs)); await cap(pg, 'E4-RC4-annuler'); await o.ctx.close(); }
else verif('RC4', null, 'R4 annuler', 'se mesure sur le site');

// ═════ RC2 · R2 du recyclage : le rappel d'une fiche — reposée, la question ; le motif sur la diapo, au hub, dans le récit et sur le papier ═════
if (SITE) { const o = await ouvrir({ frais: true }); const pg = o.pg;
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 1200); if (await pg.$('#at-aide .x')) await pg.click('#at-aide .x');
  /* « + fiche… » ne lie aucune fiche tant que les feuilles du site n'en ont pas (audit E1, F17) : la fiche est posée par l'Atelier lui-même (ajouterBloc, le geste de « + fiche » une fois la fiche choisie) */
  await pg.evaluate(() => ajouterBloc({ t: 'fiche', txt: 'Une fiche neuve du banc', el: ['Elle n’est nulle part ailleurs dans le chapitre.'] }, false)); await p(pg, 700);
  const neuve = await pg.evaluate(() => ({ pop: !!document.querySelector('#dr-rappel-pop.on'), rap: !!ecran().blocs[ecran().blocs.length - 1].rappel }));
  verif('RC2', !neuve.pop && !neuve.rap, 'une fiche posée pour la première fois dans le chapitre : pas de question, pas de rappel', JSON.stringify(neuve));
  await pg.evaluate(() => ajouterBloc({ t: 'fiche', txt: 'Le registre lyrique', el: ['Le registre d’un texte, c’est l’effet qu’il produit sur le lecteur.'] }, false)); await p(pg, 700);
  const q = await pg.evaluate(() => { const p = document.querySelector('#dr-rappel-pop.on'); return p ? { t: p.innerText, boutons: Array.from(p.querySelectorAll('button')).every(b => b.title) } : null; });
  verif('RC2', q && /Pourquoi ce rappel/.test(q.t) && /pour réviser avant l.évaluation/.test(q.t) && /pour ceux qui étaient absents/.test(q.t) && q.boutons, '« Le registre lyrique », déjà en séance 1, reposé : « Pourquoi ce rappel ? » et ses quatre motifs (chacun avec son infobulle)', q ? q.t.slice(0, 300) : 'pas de question');
  if (q) { await pg.click('#dr-rappel-pop [data-motif="reviser"]'); await p(pg, 500); }
  const tag = await pg.evaluate(() => { const b = ecran().blocs[ecran().blocs.length - 1]; const t = document.querySelector('#mur .dr-rap'); return { r: b.rappel, t: t ? t.textContent : '' }; });
  verif('RC2', tag.r && tag.r.motif === 'reviser' && /↻ Rappel — pour réviser avant l.évaluation/.test(tag.t), 'le motif choisi est sur la fiche de la diapo : « ↻ Rappel — pour réviser avant l\'évaluation »', JSON.stringify(tag));
  await cap(pg, 'E4-RC2-rappel-atelier'); await p(pg, 1500);
  const hub = await pg.evaluate(() => { const e = window.__HUB.site['3e'].chapitres[0].seances[0].deroule.ecrans[0]; const b = e.blocs.find(x => x.t === 'fiche' && /registre lyrique/.test(x.titre || '')); return b ? b.rappel : null; });
  verif('RC2', hub && hub.motif === 'reviser', 'enregistré dans la trame au hub (b.rappel = {motif, libre})', JSON.stringify(hub));
  HUB_PERSISTANT = await pg.evaluate(() => window.__HUB); await o.ctx.close();
  const o2 = await ouvrir(); const pg2 = o2.pg; await pg2.click('[data-lancer="1"]').catch(() => {}); await p(pg2, 700); await devoiler(pg2, 3);
  const tab = await pg2.evaluate(() => { const t = document.querySelector('#mur .dr-rap'); return t ? t.textContent : ''; });
  verif('RC2', /↻ Rappel — pour réviser avant l.évaluation/.test(tab), 'en classe, la classe voit « ↻ Rappel — pour réviser avant l\'évaluation » sur la fiche', tab);
  await relecture(pg2); const t = await texteRel(pg2); verif('RC2', /on a repris la fiche Le registre lyrique — pour réviser avant l.évaluation/.test(t), 'le récit : « on a repris la fiche Le registre lyrique — pour réviser avant l\'évaluation »', t.slice(0, 900));
  await face(pg2, 'Papier'); const pap = await pg2.evaluate(() => (document.querySelector('#rel .dr-papier') || {}).innerText || '');
  verif('RC2', /on a repris la fiche Le registre lyrique — pour réviser avant l.évaluation/.test(pap) && /Rappel — pour réviser avant l.évaluation/.test(pap), 'le papier : la phrase du récit, et la fiche « à coller » avec « Rappel — pour réviser avant l\'évaluation »', pap.slice(-500));
  await cap(pg2, 'E4-RC2-rappel-papier'); verif('RC2', o.errs.length + o2.errs.length === 0, 'zéro erreur JS', JSON.stringify(o.errs.concat(o2.errs))); await o2.ctx.close(); HUB_PERSISTANT = null; }
else verif('RC2', null, 'R2 le rappel', 'se mesure sur le site');

// ═════ RC5 · R5 du recyclage : la sélection multiple dans l'Atelier — Ctrl+clic, « Supprimer les N éléments », « ✍🏻 Marquer « à écrire » », Échap ═════
if (SITE) { const o = await ouvrir({ frais: true }); const pg = o.pg;
  await pg.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="atelier"]'); if (b) b.click(); }); await p(pg, 1200); if (await pg.$('#at-aide .x')) await pg.click('#at-aide .x');
  const et0 = await pg.evaluate(() => ecran().blocs[0].etapes.slice());
  await pg.click('#mur li[data-p="0.1"]', { modifiers: ['Control'] }); await pg.click('#mur li[data-p="0.3"]', { modifiers: ['Control'] }); await p(pg, 300);
  const m = await pg.evaluate(() => { const x = document.getElementById('dr-sel-menu'); return x ? { t: x.innerText, titres: Array.from(x.querySelectorAll('button')).every(b => b.title), sel: document.querySelectorAll('#mur .dr-sel').length } : null; });
  verif('RC5', m && /Supprimer les 2 éléments/.test(m.t) && /Marquer « à écrire »/.test(m.t) && /Annuler la sélection/.test(m.t) && m.titres && m.sel === 2, 'Ctrl+clic sur deux étapes : elles sont sélectionnées, le menu dit « Supprimer les 2 éléments », « ✍🏻 Marquer « à écrire » », « Annuler la sélection » (avec infobulles)', JSON.stringify(m));
  await cap(pg, 'E4-RC5-selection'); await pg.click('#dr-sel-menu [data-sel="sup"]'); await p(pg, 1200);
  const et1 = await pg.evaluate(() => ecran().blocs[0].etapes.slice());
  verif('RC5', et1.length === et0.length - 2 && !et1.includes(et0[1]) && !et1.includes(et0[3]), '« Supprimer les 2 éléments » retire exactement ces deux étapes de la trame', JSON.stringify(et1.map(x => x.slice(0, 20))));
  await pg.keyboard.press('Control+z'); await p(pg, 600); const et2 = await pg.evaluate(() => ecran().blocs[0].etapes.slice());
  verif('RC5', JSON.stringify(et2) === JSON.stringify(et0), '↶ (R4) les remet, à leur place', null);
  await pg.click('#mur li[data-p="0.0"]', { modifiers: ['Control'] }); await pg.keyboard.press('Escape'); await p(pg, 200); const vide = await pg.evaluate(() => !document.getElementById('dr-sel-menu') && !document.querySelector('#mur .dr-sel'));
  verif('RC5', vide, 'Échap vide la sélection', null);
  await pg.click('#mur li[data-p="0.0"]', { modifiers: ['Control'] }); await p(pg, 200); await pg.click('#dr-sel-menu [data-sel="ecr"]'); await p(pg, 1500);
  const ae = await pg.evaluate(() => ({ t: ecran().aEcrire, hub: window.__HUB.site['3e'].chapitres[0].seances[0].deroule.ecrans[0].aEcrire }));
  verif('RC5', Array.isArray(ae.t) && ae.t.length === 1 && /\.0$/.test(ae.t[0]) && JSON.stringify(ae.hub) === JSON.stringify(ae.t), '« Marquer « à écrire » » : gardé dans la trame par identité (<bid>.<étape>) et au hub', JSON.stringify(ae));
  HUB_PERSISTANT = await pg.evaluate(() => window.__HUB); await o.ctx.close();
  const o2 = await ouvrir(); const pg2 = o2.pg; await pg2.click('[data-lancer="1"]').catch(() => {}); await p(pg2, 700); await devoiler(pg2, 1);
  const cl = await pg2.evaluate(() => ({ li: !!document.querySelector('#mur li[data-p="0.0"].aecrire'), ecr: etatDiapo().ecr }));
  verif('RC5', cl.li, 'en classe, l\'étape préparée « à écrire » l\'est : ✍🏻 (et.ecr)', JSON.stringify(cl));
  verif('RC5', o.errs.length + o2.errs.length === 0, 'zéro erreur JS', JSON.stringify(o.errs.concat(o2.errs))); await o2.ctx.close(); HUB_PERSISTANT = null; }
else verif('RC5', null, 'R5 la sélection multiple', 'se mesure sur le site');

await nav.close();
dire(`— fin : ${nbOk} ok · ${nbEchec} échec(s) · ${nbAbsent} absent(s) — ${nbEchec ? 'ROUGE' : 'VERT'}`);
fs.writeFileSync(path.join(OUT, 'banc-E4.txt'), L.join('\n') + '\n');
process.exit(nbEchec ? 1 : 0);
