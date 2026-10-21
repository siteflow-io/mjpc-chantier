// LE BANC UNIQUE D'E2 — la classe et l'heure, par le geste, sur le faux hub (mandat E2, « BANCS PAR LE GESTE »).
// usage : node banc.mjs <fichier.html> [sortie.txt] [dossier-captures]
//   <fichier.html> = `assemble/index.html` (le site intégré) ou, avant E1-a, la maquette p8-5g.
// Le banc reconnaît son entrée : le site (il a `edtOuvrir`) ou la maquette seule. Un pas qui n'a pas d'entrée dans le fichier joué est
// « absent » (pas un échec) ; un pas qui trouve son entrée et n'aboutit pas est un ÉCHEC ; le code de sortie est 1 au premier échec.
// L'horloge : lundi 14/09/2026 09:00 sur le site (créneau 08:57-09:52 de 3E Charles de Gaulle) ; 15:07 sur la maquette (son heure simulée).
// T-5 = cinq minutes avant le cahier de textes = fin − 10 min (C1 6.3 ; audit E2, F7).
import fs from 'fs'; import path from 'path'; import { ouvrir, rapport, playwright } from './hub.mjs';
const F = path.resolve(process.argv[2] || ''); const OUT = process.argv[3]; const CAP = process.argv[4];
if (!process.argv[2] || !fs.existsSync(F)) { console.log('usage : node banc.mjs <fichier.html> [sortie.txt] [captures]'); process.exit(2); }
if (CAP) fs.mkdirSync(CAP, { recursive: true });
const r = rapport('banc E2 — la classe et l\'heure', F); const { dire, pas } = r;
const nav = await playwright().chromium.launch({ executablePath: process.env.MJPC_CHROMIUM || undefined, args: ['--no-sandbox', '--allow-file-access-from-files'], headless: true });
const cap = async (p, n) => { if (CAP) await p.screenshot({ path: path.join(CAP, n + '.png') }).catch(() => {}); };
const visible = (p, sel) => p.evaluate(s => { const e = document.querySelector(s); return !!(e && e.offsetParent !== null); }, sel);
const clicTexte = (p, sel, txt) => p.evaluate(({ s, t }) => { const el = Array.from(document.querySelectorAll(s)).filter(x => x.offsetParent !== null && ((x.innerText || '') + (x.getAttribute('onclick') || '')).indexOf(t) >= 0)[0]; if (!el) return false; el.click(); return true; }, { s: sel, t: txt });
const C = '/site/3e/chapitres/0/seances/'; const CLASSE = '3E Charles de Gaulle';
const depuis = (e, n) => e.slice(n).map(x => x.replace(/\/heures\/[^/]+/, '/heures/<H>'));

// ── les deux entrées ──
async function session(o = {}) {
  const site = !/maquette/.test(path.basename(F));
  const s = await ouvrir(F, Object.assign({ nav, quand: site ? '2026-09-14T09:00:00+02:00' : '2026-09-14T15:07:00+02:00', vue: { width: 1366, height: 768 } }, o));
  s.site = await s.page.evaluate(() => typeof edtOuvrir === 'function');
  s.integre = await s.page.evaluate(() => typeof dr_lancer === 'function');
  return s;
}
// lancer « en un clic » : le Lancer du Pilotage ([data-lancer="1"]) — l'entrée des contrôles
async function lancerUnClic(s) {
  const p = s.page;
  if (s.site) {
    if (!s.integre) return 'absent';
    await p.click('#tprof-btn'); await s.attendre(500); await p.evaluate(() => atelierOuvrir()); await s.attendre(1000);
    await clicTexte(p, 'button,[onclick]', "atOnglet('chapitres')"); await s.attendre(800);
    if (!(await clicTexte(p, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(p, 'button,[onclick]', 'Modifier'); await s.attendre(1500);
    await p.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]') || document.getElementById('ong-pilotage'); if (b) b.click(); }); await s.attendre(800);
  }
  if (!(await visible(p, '[data-lancer="1"]'))) return 'absent';
  await p.click('[data-lancer="1"]'); await s.attendre(1500); return 'ok';
}
async function lancerParLaCase(s) {
  const p = s.page; if (!s.site) return null;
  await p.click('#tprof-btn'); await s.attendre(600); await p.evaluate(() => edtOuvrir()); await s.attendre(1500);
  const t = await p.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '')); if (!c) return null; const x = c.innerText.replace(/\s+/g, ' '); c.click(); return x; });
  await s.attendre(800); return t;
}
const etat = p => p.evaluate(() => ({ lancee: !!(window.S && S.lancee), close: !!(window.S && S.close), heure: window.S && S.heure, ecoule: window.S && S.ecoule, palier: window.S && S.palier,
  hou: (document.getElementById('hou') || {}).textContent || '', J: (window.J || []).map(x => x.type), cours: window.AT_DR_COURS || null, regime: window.AT_DR_REGIME || null }));
const devoiler = async (s, n) => { for (let i = 0; i < n; i++) { await s.page.click('#bdev'); await s.attendre(150); } };
const parole = async s => { await s.page.keyboard.press('F2'); await s.attendre(200); await s.page.keyboard.type('AE'); await s.attendre(150); await s.page.keyboard.type('1'); await s.attendre(100); await s.page.keyboard.press('Enter'); await s.attendre(300); };
const H = (hub, sk) => { const h = ((((hub.site['3e'].chapitres[0].seances[sk] || {}).deroule_joue || {})[CLASSE] || {}).heures) || {}; const k = Object.keys(h).find(x => x.startsWith('2026-09-14')); return k ? Object.assign({ __cle: k }, h[k]) : null; };

// ── B1 · la case EDT : « ▶ Ouvrir le pilotage et lancer » et « Préparer » ──
dire(''); dire('B1 — la case de l\'emploi du temps');
{ const s = await session(); const p = s.page;
  if (!s.site) pas('B1', 'absent', 'la case EDT (le fichier joué n\'est pas le site)');
  else { const t = await lancerParLaCase(s); pas('B1', t ? 'ok' : 'ÉCHEC', 'la case de 3E Charles de Gaulle (lun. 14/09, 08:57-09:52)', t);
    const prep = await visible(p, '[data-preparer]'); const n0 = (await s.ecrits()).length;
    if (!prep) pas('B1', 'absent', '« Préparer » sur la case (E2)');
    else { await p.click('[data-preparer]'); await s.attendre(3000); await cap(p, 'B1-preparer');
      const e = await etat(p); const ec = depuis(await s.ecrits(), n0).filter(x => !/\/site\/edt\/|\/corbeille\//.test(x));
      pas('B1', !e.lancee && (await visible(p, '#volet')) ? 'ok' : 'ÉCHEC', '« Préparer » ouvre l\'Atelier sur la séance, sans lancer', JSON.stringify({ lancee: e.lancee }));
      pas('B1', ec.length === 0 ? 'ok' : 'ÉCHEC', '« Préparer » : zéro écriture du déroulé', ec.join(' · ')); }
    await s.ctx.close(); }
  if (s.site) { const s2 = await session(); const p2 = s2.page; await lancerParLaCase(s2); const n1 = (await s2.ecrits()).length;
    const ok = await clicTexte(p2, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s2.attendre(6000); await cap(p2, 'B1-lancer');
    const e = await etat(p2);
    if (!s2.integre) pas('B1', ok && e.regime === 'classe' ? 'ok' : 'ÉCHEC', '« ▶ Ouvrir le pilotage et lancer » (production : l\'ancien moteur)', JSON.stringify(e.cours));
    else { pas('B1', e.lancee && e.cours && e.cours.classeNom === CLASSE ? 'ok' : 'ÉCHEC', 'le Pilotage s\'ouvre, la classe est 3E Charles de Gaulle', JSON.stringify(e.cours));
      pas('B1', e.cours && e.cours.fin === '09:52' && /08:57/.test(JSON.stringify(e.cours)) ? 'ok' : 'ÉCHEC', 'le créneau 08:57-09:52', JSON.stringify(e.cours));
      pas('B1', e.heure === 1 && /heure 1 sur 3/.test(e.hou) ? 'ok' : 'ÉCHEC', 'l\'heure 1/3 de la case (S.heure, l\'entête)', e.hou); }
    dire('      écritures : ' + depuis(await s2.ecrits(), n1).join(' · ')); await s2.ctx.close(); } }

// ── B2 · lancer en un clic, dévoiler, la parole ; le paquet ; K15 ──
dire(''); dire('B2 — lancer en un clic, dévoiler, faire parler ; le paquet de l\'heure ; les écritures (K15)');
let hubApres = null, skLance = null;
{ const s = await session(); const p = s.page; const n0 = (await s.ecrits()).length;
  const v = await lancerUnClic(s);
  if (v === 'absent') pas('B2', 'absent', 'aucun [data-lancer="1"] (le site avant E2)');
  else { const e = await etat(p); await cap(p, 'B2-lance');
    pas('B2', e.lancee && e.J.includes('lancement') ? 'ok' : 'ÉCHEC', 'l\'heure est lancée (S.lancee, journal « lancement »)', e.hou);
    await s.attendre(5000); const e5 = await etat(p); pas('B2', e5.ecoule >= 4 ? 'ok' : 'ÉCHEC', 'le chrono tourne', 'S.ecoule = ' + e5.ecoule);
    await devoiler(s, 3); await parole(s); await s.attendre(2500); await cap(p, 'B2-trois-devoilements-une-parole');
    const e2 = await etat(p); pas('B2', e2.J.filter(x => x === 'devoile').length === 3 && e2.J.includes('parole') ? 'ok' : 'ÉCHEC', '▶ ×3 et une parole sont au journal', e2.J.join(' '));
    if (s.site) { const hub = await s.hub(); skLance = await p.evaluate(() => ATVUES.snum); const h = H(hub, skLance);
      pas('B2', h && h.classe === CLASSE && h.creneau === '08:57-09:52' && h.debutReel ? 'ok' : 'ÉCHEC', 'le paquet H : classe, créneau, début réel', h && h.__cle);
      pas('B2', h && h.activites && h.activites[0] && h.activites[0].passages >= 1 ? 'ok' : 'ÉCHEC', 'le paquet H : activites[0].passages ≥ 1', h && JSON.stringify((h.activites || [])[0]));
      const cj = ((hub.site['3e'].chapitres[0].seances[skLance].deroule_joue || {})[CLASSE] || {});
      pas('B2', Array.isArray(cj.journal) && cj.journal.some(x => x.type === 'parole') ? 'ok' : 'ÉCHEC', 'C/journal au hub, la parole dedans', (cj.journal || []).length + ' entrées');
      pas('B2', Array.isArray(cj.journal) && !cj.journal.some(x => x.di != null) ? 'ok' : 'ÉCHEC', 'C/journal : aucun rang (di) écrit au hub', '');
      pas('B2', cj.etat && cj.etat.S && cj.etat.S.di == null ? 'ok' : 'ÉCHEC', 'C/etat au hub, sans rang', cj.etat ? Object.keys(cj.etat).join(',') : 'absent');
      const ec = [...new Set(depuis(await s.ecrits(), n0).filter(x => !/\/site\/edt\/|\/corbeille\//.test(x)).map(x => x.replace(C + skLance + '/deroule_joue/' + CLASSE, 'C')))];
      const attendu = ['PUT C', 'PUT /site/cours_actif', 'PUT C/ecrans', 'PUT C/journal', 'PUT C/etat', 'PUT C/heures/<H>'];
      const hors = ec.filter(x => !attendu.includes(x) && !/^PUT C\/(scene|part)$/.test(x)); const manque = attendu.filter(x => !ec.includes(x) && x !== 'PUT C/ecrans');
      pas('K15', !hors.length && !manque.length ? 'ok' : 'ÉCHEC', 'les écritures du lancement à la parole : C, cours_actif, C/journal, C/etat, H (+ C/ecrans, + scene/part d\'E3)', ec.join(' · ') + (hors.length ? ' — en trop : ' + hors.join(', ') : '') + (manque.length ? ' — manque : ' + manque.join(', ') : ''));
      hubApres = hub; } else pas('B2', 'absent', 'le paquet H et le hub (la maquette n\'écrit rien)'); }
  // ── B4 · la fin de l'heure : T-5 d'elle-même, les sept étapes, la clôture ──
  dire(''); dire('B4 — la fin de l\'heure (T-5 = fin − 10 min), les sept étapes, la clôture');
  if (v !== 'absent') { const t0 = await p.evaluate(() => Date.now());
    // le site : 08:57-09:52 → cahier 09:47 → T-5 09:42 ; la maquette : sa base simulée est le lancement (T0), cahier à T0 + 50 min → T-5 à T0 + 45 min
    const cible = s.site ? new Date('2026-09-14T09:42:00+02:00').getTime() : (await p.evaluate(() => T0)) + 45 * 60000;
    await s.attendre(Math.max(0, cible - t0 - 20000)); const avant = await etat(p); await s.attendre(25000); const e = await etat(p); await cap(p, 'B4-T5');
    const finTxt = await p.evaluate(() => (document.getElementById('fin').innerText || '').replace(/\s+/g, ' ').slice(0, 80));
    pas('B4', avant.palier == null && e.palier === 't5' && /étape 1 sur 7/.test(finTxt) ? 'ok' : 'ÉCHEC', 'à T-5 (cinq minutes avant le cahier de textes) l\'étape 1 s\'ouvre d\'elle-même', 'palier ' + avant.palier + ' → ' + e.palier + ' · ' + finTxt);
    for (let i = 1; i < 7; i++) { await p.click('#f-suivante'); await s.attendre(200); }
    const t7 = await p.evaluate(() => (document.querySelector('#fin .pp-tete') || {}).innerText || ''); pas('B4', /étape 7 sur 7/.test(t7) ? 'ok' : 'ÉCHEC', 'les sept étapes se parcourent', t7.replace(/\s+/g, ' ').slice(0, 70));
    const n1 = (await s.ecrits()).length;
    await p.click('#f-clore'); await s.attendre(300); if (await visible(p, '#garde-clore.on, #garde-clore')) { if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) { await p.click('#gclore-oui'); await s.attendre(300); } }
    await s.attendre(2500); const ef = await etat(p); await cap(p, 'B4-close');
    pas('B4', ef.close && ef.J.includes('cloture') ? 'ok' : 'ÉCHEC', 'l\'étape 7 clôt l\'heure (S.close, journal « cloture »)', '');
    if (s.site) { const hub = await s.hub(); const h = H(hub, skLance);
      pas('B4', h && h.clos === true && h.finReel ? 'ok' : 'ÉCHEC', 'le paquet H est clos (clos, finReel)', h && JSON.stringify({ clos: h.clos, finReel: h.finReel }));
      pas('B4', hub.site.cours_actif == null ? 'ok' : 'ÉCHEC', 'cours_actif est effacé', JSON.stringify(hub.site.cours_actif));
      dire('      écritures de la clôture : ' + [...new Set(depuis(await s.ecrits(), n1))].join(' · ')); } }
  else pas('B4', 'absent', 'pas d\'heure lancée');
  dire('      erreurs JS : ' + (s.errs.join(' ; ') || 'aucune')); pas('JS', s.errs.length ? 'ÉCHEC' : 'ok', 'B2-B4 : aucune erreur JS', s.errs.join(' ; '));
  await s.ctx.close(); }

// ── B3 · la reprise : recharger en pleine heure ──
dire(''); dire('B3 — la reprise (recharger en pleine heure, mêmes écritures relues)');
{ const s = await session(); const v = await lancerUnClic(s);
  if (v === 'absent' || !s.site) pas('B3', 'absent', 'la reprise se joue sur le site intégré (la maquette perd tout au rechargement)');
  else { await devoiler(s, 2); await parole(s); await s.page.keyboard.press('n'); await s.attendre(200); await s.page.keyboard.type('note de reprise'); await s.page.keyboard.press('Enter'); await s.attendre(400);
    await s.attendre(60000); const avant = await s.page.evaluate(() => ({ di: S.di, eid: S.eidCourant, parts: S.parts.length, notes: S.notesFil.length, ecoule: S.ecoule }));
    const hub = await s.hub(); await s.ctx.close();
    const s2 = await session({ store: hub, quand: '2026-09-14T09:01:05+02:00' }); const p2 = s2.page; await s2.attendre(7000);
    if (await visible(p2, '#ses-reprise')) { await clicTexte(p2, '#ses-reprise button', 'Reprendre'); await s2.attendre(6000); }
    const ap = await p2.evaluate(() => window.S ? ({ lancee: S.lancee, di: S.di, eid: S.eidCourant, parts: S.parts.length, notes: S.notesFil.length, ecoule: S.ecoule }) : null); await cap(p2, 'B3-reprise');
    pas('B3', ap && ap.lancee && ap.eid === avant.eid ? 'ok' : 'ÉCHEC', 'la diapo courante est revenue', JSON.stringify({ avant: avant.eid, apres: ap && ap.eid }));
    pas('B3', ap && Math.abs(ap.ecoule - (avant.ecoule + 7 + 6)) <= 3 ? 'ok' : 'ÉCHEC', 'le chrono (± 2 s, recalculé depuis le début réel)', JSON.stringify({ avant: avant.ecoule, apres: ap && ap.ecoule }));
    pas('B3', ap && ap.parts === avant.parts && ap.notes === avant.notes ? 'ok' : 'ÉCHEC', 'la parole et les notes sont là', JSON.stringify({ avant, ap }));
    await s2.ctx.close(); } }

// ── B5 · deux créneaux = deux clés ──
dire(''); dire('B5 — deux créneaux dans la journée = deux clés = deux traces');
{ const s = await session(); const ok = s.integre ? await s.page.evaluate(() => { const a = { niveau: '3e', chapitre: '0', seance: '0', classeSlug: '3E Charles de Gaulle', debut: '08:57', fin: '09:52' }, b = Object.assign({}, a, { debut: '10:07', fin: '11:02' }); return [_drCleHeureDe(a), _drCleHeureDe(b)]; }) : null;
  if (!ok) pas('B5', 'absent', 'le site intégré');
  else pas('B5', ok[0] !== ok[1] && /08h57-09h52/.test(ok[0]) && /10h07-11h02/.test(ok[1]) ? 'ok' : 'ÉCHEC', 'deux créneaux, deux clés', ok.join(' · '));
  await s.ctx.close(); }

// ── B6 · le mode test : lancer, dévoiler, clore → zéro écriture ──
dire(''); dire('B6 — le mode test (13 · 25) : lancer, dévoiler, clore → zéro écriture au hub');
{ const s = await session(); if (!s.site) { pas('B6', 'absent', 'le mode test est celui du site'); await s.ctx.close(); }
  else { await s.page.evaluate(() => { M8_TEST = true; }); const n0 = (await s.ecrits()).length; const v = await lancerUnClic(s);
    if (v === 'absent') pas('B6', 'absent', 'aucun [data-lancer="1"]');
    else { await devoiler(s, 2); await s.page.click('#bfin').catch(() => {}); await s.attendre(300); await s.page.click('#f-clore').catch(() => {}); await s.attendre(200); await s.page.click('#gclore-oui').catch(() => {}); await s.attendre(2500);
      const ec = depuis(await s.ecrits(), n0); pas('B6', ec.length === 0 ? 'ok' : 'ÉCHEC', 'mode test : zéro écriture au hub', ec.length + ' : ' + ec.join(' · ')); }
    await s.ctx.close(); } }

await nav.close();
dire(''); dire(r.echecs() === 0 ? 'BANC E2 VERT' : 'BANC E2 ROUGE — ' + r.echecs() + ' échec(s)');
if (OUT) fs.writeFileSync(OUT, r.R.join('\n') + '\n');
process.exit(r.echecs() ? 1 : 0);
