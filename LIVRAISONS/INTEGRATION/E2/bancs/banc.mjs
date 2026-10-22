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
async function lancerParLaCase(s, iso) {
  const p = s.page; if (!s.site) return null;
  await p.click('#tprof-btn'); await s.attendre(600); await p.evaluate(() => edtOuvrir()); await s.attendre(1500);
  const t = await p.evaluate(iso => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (!iso || (e.getAttribute('onclick') || '').indexOf(iso) >= 0)); if (!c) return null; const x = c.innerText.replace(/\s+/g, ' '); c.click(); return x; }, iso || null);
  await s.attendre(800); return t;
}
const etat = p => p.evaluate(() => ({ lancee: !!(window.S && S.lancee), close: !!(window.S && S.close), heure: window.S && S.heure, ecoule: window.S && S.ecoule, palier: window.S && S.palier,
  hou: (document.getElementById('hou') || {}).textContent || '', J: (window.J || []).map(x => x.type), cours: window.AT_DR_COURS || null, regime: window.AT_DR_REGIME || null }));
const devoiler = async (s, n) => { for (let i = 0; i < n; i++) { await s.page.click('#bdev'); await s.attendre(150); } };
const parole = async s => { await s.page.keyboard.press('F2'); await s.attendre(200); await s.page.keyboard.type('AE'); await s.attendre(150); await s.page.keyboard.type('1'); await s.attendre(100); await s.page.keyboard.press('Enter'); await s.attendre(300); await s.page.keyboard.press('Escape'); await s.attendre(150); };   /* le champ du VIF garde le curseur : Échap le rend */
const H = (hub, sk) => { const h = ((((hub.site['3e'].chapitres[0].seances[sk] || {}).deroule_joue || {})[CLASSE] || {}).heures) || {}; const k = Object.keys(h).find(x => x.startsWith('2026-09-14')); return k ? Object.assign({ __cle: k }, h[k]) : null; };

// ── B1 · la case EDT : « ▶ Ouvrir le pilotage et lancer » et « Préparer » ──
dire(''); dire('B1 — la case de l\'emploi du temps');
{ const s = await session(); const p = s.page;
  if (!s.site) pas('B1', 'absent', 'la case EDT (le fichier joué n\'est pas le site)');
  else { const t = await lancerParLaCase(s); pas('B1', t && /heure 2\/3/.test(t) ? 'ok' : 'ÉCHEC', 'la case de 3E Charles de Gaulle (lun. 14/09, 08:57-09:52) dit « heure 2/3 » de la séance 0 (F2, dette 13 · 26)', t);
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
      pas('B1', e.cours && e.cours.fin === '09:52' && await p2.evaluate(c => _drCreneauDe(c), e.cours) === '08:57-09:52' ? 'ok' : 'ÉCHEC', 'le créneau 08:57-09:52', JSON.stringify(e.cours));
      pas('B1', (await visible(p2, '#mur')) && (await visible(p2, '#volet')) ? 'ok' : 'ÉCHEC', 'le Pilotage se voit (dette 12 · 05 : le cours tournait derrière le panneau prof)', '');
      { const ecr = await s2.ecrits(); pas('B1', ecr.some(x => x === 'PUT /site/cours_actif') ? 'ok' : 'ÉCHEC', 'le pointeur /site/cours_actif est écrit (la bannière de reprise en dépend)', ''); }
      pas('B1', !s2.errs.length ? 'ok' : 'ÉCHEC', 'lancer depuis la case : aucune erreur JS', s2.errs.join(' ; '));
      pas('B1', e.heure === 2 && /heure 2(\/| sur )3/.test(e.hou) && (await p2.evaluate(() => ATVUES.snum)) === '0' ? 'ok' : 'ÉCHEC', 'la séance 0, heure 2/3 de la case (F2 tranché : la séance jouée une heure le 07/09 continue ; S.heure, l\'entête)', e.hou); }
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
    const e2 = await etat(p); { const k = e2.J.indexOf('lancement'); const apres = e2.J.slice(k + 1); pas('B2', apres.filter(x => x === 'devoile' || x === 'diapo').length >= 3 && apres.includes('parole') ? 'ok' : 'ÉCHEC', '▶ ×3 (dévoiler, puis la diapo suivante) et une parole sont au journal', e2.J.join(' ')); }
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
    if (s.site) { const v = await p.evaluate(() => ({ titre: ((document.querySelector('#volet h5') || {}).innerText || ''), total: seance().ecrans.filter(e => e.role !== 'fin').length, opts: Array.from((document.getElementById('f-ech') || { options: [] }).options).map(o => o.text) }));
      const k = +((/(\d+) DIAPOS/i.exec(v.titre) || [])[1] || 0); pas('B4', k > 0 && k < v.total ? 'ok' : 'ÉCHEC', 'la frontière d\'heure par les durées : « HEURE n · k DIAPOS », k < le total de la séance (12 · 07, réveil n°3)', v.titre + ' / ' + v.total + ' diapos');
      pas('B4', v.opts.length > 1 ? 'ok' : 'ÉCHEC', 'étape 1 : l\'échéance propose la prochaine heure de la classe', v.opts.join(' | ').slice(0, 120));
      await p.click('#f-suivante'); await s.attendre(200); const c2 = await p.evaluate(() => Array.from(document.querySelectorAll('#fin .carte[data-act]')).map(x => (x.querySelector('b') || {}).innerText || ''));
      pas('B4', c2.length > 0 ? 'ok' : 'ÉCHEC', 'étape 2 : une carte par diapo restante, à décider (réveil n°3, 3)', c2.length + ' cartes · ' + c2.slice(0, 2).join(' | '));
      await p.click('#f-precedente'); await s.attendre(200); }
    for (let i = 1; i < 7; i++) { await p.click('#f-suivante'); await s.attendre(200); }
    const t7 = await p.evaluate(() => (document.querySelector('#fin .pp-tete') || {}).innerText || ''); pas('B4', /étape 7 sur 7/.test(t7) ? 'ok' : 'ÉCHEC', 'les sept étapes se parcourent', t7.replace(/\s+/g, ' ').slice(0, 70));
    const n1 = (await s.ecrits()).length;
    await p.click('#f-clore'); await s.attendre(300); if (await visible(p, '#garde-clore.on, #garde-clore')) { if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) { await p.click('#gclore-oui'); await s.attendre(300); } }
    await s.attendre(2500); const ef = await etat(p); await cap(p, 'B4-close');
    pas('B4', ef.close && ef.J.includes('cloture') ? 'ok' : 'ÉCHEC', 'l\'étape 7 clôt l\'heure (S.close, journal « cloture »)', '');
    if (s.site) { const hub = await s.hub(); const h = H(hub, skLance);
      pas('B4', h && h.clos === true && h.finReel ? 'ok' : 'ÉCHEC', 'le paquet H est clos (clos, finReel)', h && JSON.stringify({ clos: h.clos, finReel: h.finReel }));
      pas('B4', hub.site.cours_actif == null ? 'ok' : 'ÉCHEC', 'cours_actif est effacé', JSON.stringify(hub.site.cours_actif));
      { const t2 = await p.evaluate(() => { try { edtOuvrir(); } catch (e) {} return 1; }); await s.attendre(1500);
        const mardi = await p.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-15|15:07') >= 0); return c ? c.innerText.replace(/\s+/g, ' ') : null; });
        pas('B4', mardi && /Poésie et peinture/.test(mardi) && /heure 3\/3/.test(mardi) ? 'ok' : 'ÉCHEC', 'après la clôture (quelques diapos jouées), la case du mardi garde la séance : « heure 3/3 » (F2, réveil n°3, 1)', mardi);
        await p.evaluate(() => { try { edtFermer(); } catch (e) {} }); await s.attendre(300); }
      dire('      écritures de la clôture : ' + [...new Set(depuis(await s.ecrits(), n1))].join(' · '));
      await p.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]'); if (b) b.click(); }); await s.attendre(800);
      await s.attendre(1500); const bt = await p.evaluate(() => { const b = document.getElementById('dr-lancer'); return b ? { vis: b.offsetParent !== null, dis: b.disabled, txt: b.textContent, title: b.title } : null; }); const n2 = (await s.ecrits()).length;
      await p.evaluate(() => { const b = document.getElementById('dr-lancer'); if (b) b.click(); }); await s.attendre(1500); const e2b = depuis(await s.ecrits(), n2);
      pas('B4', bt && bt.vis && bt.dis && /close/.test(bt.txt + bt.title) && e2b.length === 0 ? 'ok' : 'ÉCHEC', 'après la clôture, « ▶ Lancer » reste à l\'écran, grisé avec sa raison (l\'heure de ce créneau est close) ; le cliquer n\'écrit rien (C1 12, réveil n°3)', JSON.stringify(bt) + ' · ' + e2b.length + ' écriture(s)');
      const n3 = (await s.ecrits()).length; await p.evaluate(() => { try { const b = document.getElementById('bdev'); if (b) b.click(); } catch (e) {} }); await s.attendre(1500);
      pas('B4', (await p.evaluate(() => J.filter(x => x.type === 'devoile' && x.h === S.heure && x.t > (S.closes || {})[S.heure]).length)) === 0 ? 'ok' : 'ÉCHEC', 'après la clôture, ▶ n\'écrit plus dans le journal de l\'heure close', '');
      await s.attendre(11 * 60000); const bt2 = await p.evaluate(() => { const b = document.getElementById('dr-lancer'); const g = new Set(); try { (edtProchainesDe('3E Charles de Gaulle', 20) || []).filter(x => String(x.iso).slice(0, 10) === '2026-09-14').forEach(x => g.add(x.creneau)); } catch (e) {} return b ? { h: hhmm(), dis: b.disabled, txt: b.textContent, title: b.title, grille: [...g] } : null; });
      const hors = bt2 ? ((bt2.txt + ' ' + bt2.title).match(/\d\d:\d\d-\d\d:\d\d/g) || []).filter(c => c !== '08:57-09:52' && !bt2.grille.includes(c)) : ['?'];
      pas('B4', bt2 && bt2.dis && /close|prochaine heure/.test(bt2.txt + bt2.title) && !hors.length ? 'ok' : 'ÉCHEC', 'après la fin du créneau clos (09:53), « ▶ Lancer » reste gris avec sa raison et ne propose aucun créneau hors de la grille de la classe (réveil n°5, A4-6)', JSON.stringify({ bt2, hors })); } }
  else pas('B4', 'absent', 'pas d\'heure lancée');
  dire('      erreurs JS : ' + (s.errs.join(' ; ') || 'aucune')); pas('JS', s.errs.length ? 'ÉCHEC' : 'ok', 'B2-B4 : aucune erreur JS', s.errs.join(' ; '));
  await s.ctx.close(); }

// ── B3 · la reprise : recharger en pleine heure ──
dire(''); dire('B3 — la reprise (recharger en pleine heure, mêmes écritures relues)');
{ const s = await session(); const v = await lancerUnClic(s);
  if (v === 'absent' || !s.site) pas('B3', 'absent', 'la reprise se joue sur le site intégré (la maquette perd tout au rechargement)');
  else { await devoiler(s, 2); await parole(s); await s.page.keyboard.press('n'); await s.attendre(200); await s.page.keyboard.type('note de reprise'); await s.page.keyboard.press('Enter'); await s.attendre(400);
    await s.page.click('#dr-clore'); await s.attendre(600); await s.page.evaluate(() => { const e = document.querySelector('#fin .pp-liste [data-sec="6"]'); if (e) e.click(); }); await s.attendre(400); await s.page.evaluate(() => { const b = document.getElementById('f-copie-contenu'); if (b) b.click(); }); await s.attendre(300); await s.page.evaluate(() => { const b = document.getElementById('f-fermer'); if (b) b.click(); }); await s.attendre(300);
    const cop = await s.page.evaluate(() => { const c = window.DR_RECIT_DERNIERE_COPIE || null; return c ? { lignes: String(c.texte).split(/\n+/).filter(x => x.trim()).length, colle: (String(c.texte).match(/[a-zà-ÿ][?.!»][A-ZÀ-Ý]/g) || []).slice(0, 3), p: (String(c.html).match(/<p[\s>]/g) || []).length, debut: String(c.texte).slice(0, 120) } : null; });
    pas('B3', cop && cop.lignes >= 2 && !cop.colle.length && cop.p >= 2 ? 'ok' : 'ÉCHEC', 'étape 6, « Copier le contenu de séance » : le texte simple garde ses paragraphes (aucune phrase collée à la suivante), le HTML ses <p> — l\'outil d\'E4, comme la Relecture (réveil n°5, A4-1)', JSON.stringify(cop));
    const heuresDe = p => p.evaluate(() => ({ h: S.heure, sur: (dr_heureJouee(S.heure) || {}).sur, heures: seance().ecrans.map(e => (e.role === 'fin' ? 'F' : '') + e.heure).join(' '), titre: (document.querySelector('#volet h5') || {}).textContent || '', hou: (document.getElementById('hou') || {}).textContent || '', copies: J.filter(x => x.type === 'copie-ed').length, acts: activitesDeLHeure().map(a => a.num + ' ' + a.titre).join(' | '), vigH: Array.from(document.querySelectorAll('#volet .vig:not(.hors) .dr-h')).map(x => x.textContent).join(',') }));
    await s.page.evaluate(() => { const e = seance().ecrans[S.di]; e.act = e.act + ' — retouché en classe (B3)'; try { dr_copieAuto(true); } catch (x) {} }); await s.attendre(1500);
    await s.attendre(60000); const avant = await s.page.evaluate(() => ({ di: S.di, eid: (() => { try { return eidDe(S.di); } catch (e) { return null; } })(), parts: S.parts.length, notes: S.notesFil.length, ecoule: S.ecoule })); const hAvant = await heuresDe(s.page); const secA = await s.page.evaluate(() => { const a = actDe(ecran()) || dr_pseudoAct(ecran(), S.di, true); return a ? Math.round(tempsActiviteSec(a)) : -1; });
    const hub = await s.hub(); await s.ctx.close();
    const s2 = await session({ store: hub, quand: '2026-09-14T09:01:05+02:00' }); const p2 = s2.page; await s2.attendre(7000);
    const ban = await p2.evaluate(() => { const b = document.getElementById('ses-reprise'); return b ? b.innerText.replace(/\s+/g, ' ') : null; });   /* la bannière est en position fixe : offsetParent est nul, on teste sa présence */
    pas('B3', ban ? 'ok' : 'ÉCHEC', 'la bannière « un cours est en cours » (celle d\'aujourd\'hui)', ban);
    if (ban) { await p2.evaluate(() => { const b = Array.from(document.querySelectorAll('#ses-reprise button')).find(x => /Reprendre/.test(x.innerText)); if (b) b.click(); }); await s2.attendre(9000); }
    const ap = await p2.evaluate(() => window.S ? ({ lancee: S.lancee, di: S.di, eid: (() => { try { return eidDe(S.di); } catch (e) { return null; } })(), parts: S.parts.length, notes: S.notesFil.length, ecoule: S.ecoule }) : null); await cap(p2, 'B3-reprise');
    pas('B3', ap && ap.lancee && ap.eid === avant.eid ? 'ok' : 'ÉCHEC', 'la diapo courante est revenue', JSON.stringify({ avant: avant.eid, apres: ap && ap.eid }));
    const hApres = await heuresDe(p2); const secB = await p2.evaluate(() => { const a = actDe(ecran()) || dr_pseudoAct(ecran(), S.di, true); return a ? Math.round(tempsActiviteSec(a)) : -1; });
    pas('B3', secB >= secA - 2 ? 'ok' : 'ÉCHEC', 'la reprise garde le temps de l\'activité en cours (relecteur neuf n°3, 4 : la coupure part de la dernière trace de vie, l\'état battu chaque minute)', secA + ' s → ' + secB + ' s');
    pas('B3', hAvant.h === 2 && hApres.h === hAvant.h && hApres.sur === hAvant.sur && hApres.heures === hAvant.heures && hApres.titre === hAvant.titre && hApres.hou === hAvant.hou && hApres.acts === hAvant.acts && hApres.vigH === hAvant.vigH && !/H1/.test(hApres.vigH) ? 'ok' : 'ÉCHEC', 'la reprise remonte l\'heure telle qu\'elle était : heure 2/3, les frontières de chaque diapo, le volet et ses « H2 », l\'entête, les activités de l\'heure et leurs numéros (réveil n°4, point 3 ; E4 ligne 129, le geste A5 : lancer, dévoiler, recharger, « Reprendre le cours »)', JSON.stringify({ avant: hAvant, apres: hApres }));
    const retouche = await p2.evaluate(() => seance().ecrans.some(e => /retouché en classe \(B3\)/.test(e.act || '')));
    pas('B3', retouche ? 'ok' : 'ÉCHEC', 'la reprise relit la copie de la classe (C/ecrans) telle qu\'elle est au hub : ce qui a été changé en classe revient (réveil n°6, E4 ligne 110, ma part)', String(retouche));
    pas('B3', hAvant.copies === 1 && hApres.copies === 1 ? 'ok' : 'ÉCHEC', 'une copie pour École Directe avant le rechargement = un seul « copie-ed » au journal après la reprise (réveil n°4, point 7)', hAvant.copies + ' → ' + hApres.copies);
    const dr0 = (H(hub, await p2.evaluate(() => ATVUES.snum)) || {}).debutReel; const att = Math.round((await p2.evaluate(() => Date.now()) - dr0) / 1000);
    pas('B3', ap && dr0 && Math.abs(ap.ecoule - att) <= 2 ? 'ok' : 'ÉCHEC', 'le chrono (± 2 s) : le temps écoulé depuis le début réel au hub', JSON.stringify({ apres: ap && ap.ecoule, attendu: att }));
    pas('B3', ap && ap.parts === avant.parts && ap.notes === avant.notes ? 'ok' : 'ÉCHEC', 'la parole et les notes sont là', JSON.stringify({ avant, ap }));
    await s2.ctx.close(); } }

// ── B3b · la reprise par la case de l'EDT, sur une séance dont la trame du hub n'a pas d'identités (séance 1) ──
dire(''); dire('B3b — lancer par la case (séance 1, sans eid au hub), recharger, « ▶ Reprendre le cours » dans la case');
{ const s = await session(); if (!s.integre) { pas('B3b', 'absent', 'le site intégré'); await s.ctx.close(); }
  else { const p = s.page; await lancerParLaCase(s); await clicTexte(p, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s.attendre(6000);
    await devoiler(s, 2); await parole(s); await p.keyboard.press('n'); await s.attendre(200); await p.keyboard.type('note B3b'); await p.keyboard.press('Enter'); await s.attendre(300); await p.keyboard.press('Escape');
    await s.attendre(4000); const av = await p.evaluate(() => ({ eid: eidDe(S.di), compte: (document.getElementById('compte') || {}).textContent, parts: S.parts.length, notes: S.notesFil.length, sk: ATVUES.snum }));
    const hub = await s.hub(); await s.ctx.close();
    const s2 = await session({ store: hub, quand: '2026-09-14T09:02:00+02:00' }); const p2 = s2.page; await lancerParLaCase(s2);
    const rb = await visible(p2, '#edt-modale [data-reprendre]'); pas('B3b', rb ? 'ok' : 'ÉCHEC', 'la case de l\'heure lancée propose « ▶ Reprendre le cours »', '');
    if (rb) { await p2.click('#edt-modale [data-reprendre]'); await s2.attendre(9000); }
    const ap = await p2.evaluate(() => { try { return { lancee: S.lancee, eid: eidDe(S.di), compte: (document.getElementById('compte') || {}).textContent, parts: S.parts.length, notes: S.notesFil.length, sk: ATVUES.snum }; } catch (e) { return { err: e.message }; } });
    pas('B3b', ap.lancee && ap.sk === av.sk && ap.eid === av.eid && ap.compte === av.compte ? 'ok' : 'ÉCHEC', 'la même séance, la même diapo (même identité), les mêmes dévoilements', JSON.stringify({ avant: av, apres: ap }));
    pas('B3b', ap.parts === av.parts && ap.notes === av.notes ? 'ok' : 'ÉCHEC', 'la parole et la note', '');
    pas('B3b', !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s2.errs.join(' ; ')); await s2.ctx.close(); } }

// ── B7 · l'heure suivante d'une séance commencée : la copie de la classe FUSIONNÉE avec la trame du jour (contrat §12.8, relance C6) ──
dire(''); dire('B7 — lundi heure 2/3 par la case, clore ; la trame change ; mardi 15:07 la case dit « heure 3/3 » → la copie fusionnée');
{ const s = await session(); if (!s.integre) { pas('B7', 'absent', 'le site intégré'); await s.ctx.close(); }
  else { const p = s.page; await lancerParLaCase(s); await clicTexte(p, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s.attendre(6000);
    await devoiler(s, 2); await s.attendre(2000); await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300);
    if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    const hub = await s.hub(); await s.ctx.close();
    const E = hub.site['3e'].chapitres[0].seances[0].deroule.ecrans; const cible = E[6]; const ancien = cible.act; cible.act = 'Titre changé dans la trame (B7)';   /* un écran pas encore joué, modifié dans la trame */
    E.splice(8, 0, { eid: 'ecran-ajoute-b7', act: 'Écran ajouté dans la trame (B7)', dur: 2, comp: [], blocs: [{ t: 'consigne', txt: 'Ajouté après l\'heure 2.' }] });
    const s2 = await session({ store: hub, quand: '2026-09-15T15:08:00+02:00' }); const p2 = s2.page; const t = await lancerParLaCase(s2, '2026-09-15|15:07');
    pas('B7', t && /heure 3\/3/.test(t) ? 'ok' : 'ÉCHEC', 'la case du mardi 15:07 dit « heure 3/3 » de la même séance', t);
    const n0 = (await s2.ecrits()).length; await clicTexte(p2, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s2.attendre(6000);
    const ouv = await p2.evaluate(() => (document.getElementById('fin') || {}).innerText || ''); if (await visible(p2, '#o-lancer')) { await p2.click('#o-lancer'); await s2.attendre(3000); }
    const r = await p2.evaluate(() => ({ heure: S.heure, lancee: S.lancee, acts: seance().ecrans.map(e => e.act), eids: seance().ecrans.map(e => e.eid) }));
    const ec = (await s2.ecrits()).slice(n0).map(x => x.replace(/\/site\/3e\/chapitres\/0\/seances\/0\/deroule_joue\/3E Charles de Gaulle/, 'C'));
    pas('B7', /Où en est la/.test(ouv) && r.lancee && r.heure === 3 ? 'ok' : 'ÉCHEC', 'l\'écran d\'ouverture, puis l\'heure 3 lancée', ouv.replace(/\s+/g, ' ').slice(0, 90));
    pas('B7', !ec.includes('PUT C') ? 'ok' : 'ÉCHEC', 'la copie de la classe n\'est pas remplacée par la trame (pas de PUT C)', ec.filter(x => x === 'PUT C').length + ' × PUT C');
    pas('B7', r.eids.includes('ecran-ajoute-b7') && r.acts.includes('Titre changé dans la trame (B7)') && !r.acts.includes(ancien) ? 'ok' : 'ÉCHEC', 'la fusion : l\'écran ajouté à la trame arrive, l\'écran modifié dans la trame (pas touché en classe) prend la trame', JSON.stringify({ ajoute: r.eids.includes('ecran-ajoute-b7'), change: r.acts.includes('Titre changé dans la trame (B7)') }));
    const u = await p2.evaluate(() => { const tr = [{ eid: 'a', act: 'A trame' }, { eid: 'b', act: 'B trame' }, { eid: 'n', act: 'N nouveau' }]; const co = [{ eid: 'a', act: 'A classe' }, { eid: 'b', act: 'B copie' }, { eid: 'x', act: 'X retiré, joué' }, { eid: 'y', act: 'Y retiré, pas joué' }];
      const jj = [{ type: 'reponse', eid: 'a' }, { type: 'diapo', eid: 'x' }]; return dr_fusionCopie(tr, co, jj).map(e => e.act); });
    pas('B7', JSON.stringify(u) === JSON.stringify(['A classe', 'B trame', 'X retiré, joué', 'N nouveau']) ? 'ok' : 'ÉCHEC', 'les quatre règles : modifié en classe → la copie ; modifié dans la trame → la trame ; retiré mais joué → reste ; nouveau → s\'ajoute', JSON.stringify(u));
    pas('B7', !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s2.errs.join(' ; ')); await s2.ctx.close(); } }

// ── B8 · l'appel : un absent coché dans la case de l'EDT pendant l'heure est absent au Pilotage (dette 12 · 17, C1 11b.1) ──
dire(''); dire('B8 — pendant l\'heure, un absent coché dans la case de l\'EDT arrive dans l\'appel du Pilotage');
{ const s = await session(); if (!s.integre) { pas('B8', 'absent', 'le site intégré'); await s.ctx.close(); }
  else { const p = s.page; await lancerParLaCase(s); await clicTexte(p, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s.attendre(6000);
    await p.evaluate(() => edtOuvrir()); await s.attendre(1500); await p.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-14|08:57') >= 0); if (c) c.click(); }); await s.attendre(800);
    const coche = await p.evaluate(() => { const b = Array.from(document.querySelectorAll('#edt-modale .edt-el')).find(x => /AUDEBERT/.test(x.innerText)); if (!b) return false; b.click(); return true; }); await s.attendre(1500);
    await p.evaluate(() => { try { edtFermer(); edtModaleFermer(); } catch (e) {} }); await s.attendre(16000);
    const ap = await p.evaluate(() => ({ seg: (S.appel['AUDEBERT Elise'] || []).map(x => x.type + ':' + x.raison), absent: absentA('AUDEBERT Elise') }));
    pas('B8', coche && ap.absent && ap.seg.some(x => /case/.test(x)) ? 'ok' : 'ÉCHEC', 'Élise Audebert, cochée absente dans la case, est absente dans l\'appel (et pas proposée à la parole)', JSON.stringify({ coche, ap }));
    pas('B8', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); await s.ctx.close(); } }

// ── B9 · le réveil n°3 (relecture continue d'E4) : le VIF tapé vite, les suffixes, « sur 7 », le chrono après la clôture, les infobulles ──
dire(''); dire('B9 — F2 « EB1 » tapé d\'un trait pose ; pas de « LC2 » à l\'écran ; « sur 7 » ; la fiche ne couvre pas la fin de l\'heure ; le chrono s\'arrête à la clôture');
{ const s = await session(); const p = s.page; const v = await lancerUnClic(s);
  if (v === 'absent' || !s.integre) { pas('B9', 'absent', 'le Lancer du site intégré'); }
  else { const d0 = await p.evaluate(() => { const E = seance().ecrans, f = E.filter(e => e.role === 'fin').map(e => e.eid); const o0 = ordreHeure(S.heure)[0]; const rang = i => E.slice(0, i + 1).filter(e => !e.role).length; return { h: S.heure, premier: rang(o0), premierAct: E[o0].act, second: rang(ordreHeure(S.heure)[1]), di: rang(S.di), jouees: Array.from(document.querySelectorAll('#volet .vig.jouee')).map(v => +v.dataset.i), fins: f, uniques: new Set(f).size === f.length && f.every(x => !/-sx$/.test(x)) }; });
    pas('B9', d0.h === 2 && /Où en sommes-nous/.test(d0.premierAct) && d0.di === d0.premier && d0.second === 4 && JSON.stringify(d0.jouees) === '[0,1,2]' && d0.uniques ? 'ok' : 'ÉCHEC', 'heure 2/3 : le paquet du 07/09 a joué trois diapos → l\'heure 2 s\'ouvre sur son rituel (« Où en sommes-nous ? », diapo 9 de la trame, §12.16) puis la diapo 4, les trois jouées marquées au volet (réveil n°4, point 2 ; CADRAGE-TEMPS §1), aucun « Cahier de textes » doublé, tous à la clé de la séance (banc.sh 13:56, K6-K11)', JSON.stringify(d0));
    const poses = () => p.evaluate(() => S.parts.map(x => x.nom + ':' + x.m + ':' + x.note));
    const oe = await p.evaluate(() => ({ h0: ((document.querySelector('.dur-h') || {}).textContent || ''), lance: hhmm(S.debutReel) }));
    pas('B9', oe.h0 === oe.lance ? 'ok' : 'ÉCHEC', '« Où on en est » : la première ligne est à l\'heure du lancement, pas du début du créneau (relecteur neuf n°3, 2 ; C1 6.2)', JSON.stringify(oe));
    await p.keyboard.press('F2'); await s.attendre(200); await p.keyboard.type('EB1'); await s.attendre(400); const avant = await poses(); await p.keyboard.type('au tableau'); await p.keyboard.press('Enter'); await s.attendre(400);
    const apres1 = await poses(); const champ = await p.evaluate(() => (document.activeElement || {}).id);
    pas('B9', !avant.length && apres1.length === 1 && apres1[0] === 'BOIVIN Eden:participe:au tableau' ? 'ok' : 'ÉCHEC', 'F2, « EB1 » d\'un trait, la note, Entrée : UNE pose, « participe » pour Eden Boivin avec la note — le chiffre choisit, Entrée pose (réveil n°4, point 4)', JSON.stringify({ avant, apres1, champ }));
    await p.keyboard.press('F2'); await s.attendre(200); await p.keyboard.type('EA'); await s.attendre(300); for (let k = 0; k < 20 && (await p.evaluate(() => (document.activeElement || {}).id)) !== 'dr-pnote'; k++) await s.attendre(100); await p.keyboard.type('au fond ');   /* la note a le curseur (60 ms après les initiales) — sous charge, le banc tapait plus vite que lui */ await p.keyboard.type('2'); await s.attendre(100); await p.keyboard.type('bis'); await p.keyboard.press('Enter'); await s.attendre(400);
    const apres2 = (await poses()).slice(1); const m2 = await p.evaluate(() => (MOTIFS_PART[1] || {}).c);
    pas('B9', apres2.length === 1 && /^AUDEBERT Elise:/.test(apres2[0]) && apres2[0].split(':')[1] === m2 && /au fond bis/.test(apres2[0]) ? 'ok' : 'ÉCHEC', 'la note avant le motif : « EA », « au fond », « 2 », « bis », Entrée → une pose, le 2e motif pour Élise Audebert, la note gardée (le premier chiffre de la note choisit le motif)', JSON.stringify(apres2));
    await p.keyboard.press('Escape'); await s.attendre(200);
    const vu = await p.evaluate(() => ({ dup: Object.values(INI).filter(x => /\d$/.test(x)), aff: Array.from(document.querySelectorAll('#part span[data-ini]')).map(x => x.firstChild ? x.firstChild.textContent : '').filter(x => /\d$/.test(x)) }));
    pas('B9', !vu.aff.length ? 'ok' : 'ÉCHEC', 'la participation n\'affiche aucun suffixe chiffré (C1 4b.4)' + (vu.dup.length ? ' — ' + vu.dup.length + ' doublon(s) dans la classe' : ' — la classe n\'a pas de doublon : garde sans prise'), JSON.stringify(vu));
    pas('B9', await p.evaluate(() => !!document.getElementById('dr-vif-x') && !!document.getElementById('dr-vif-x').title) && await p.evaluate(() => !!(document.getElementById('garde-devant') || {}).title) ? 'ok' : 'ÉCHEC', 'infobulles : le ✕ de la parole, « Y aller devant la classe »');
    await devoiler(s, 2); await p.click('#dr-clore'); await s.attendre(600);
    const sur = await p.evaluate(() => (document.getElementById('fin').innerText.match(/étapes? faites? sur \d/) || [''])[0]);
    pas('B9', /sur 7/.test(sur) ? 'ok' : 'ÉCHEC', 'la liste de contrôle compte sur 7 étapes', sur);
    await p.evaluate(() => ouvrirPart('EB')); await s.attendre(300);
    const rec = await p.evaluate(() => { const pp = document.getElementById('ppop').getBoundingClientRect(); const zf = document.getElementById('droite-fin'), zd = document.getElementById('droite'); const A = zf.getBoundingClientRect(), D = zd.getBoundingClientRect(); const vis = { t: Math.max(A.top, D.top), b: Math.min(A.bottom, D.bottom) };
      const bts = Array.from(document.querySelectorAll('#fin button')).filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2; if (y < vis.t || y > vis.b || y > innerHeight) return null; const e = document.elementFromPoint(x, y); return { id: b.id || b.textContent.slice(0, 16), ok: !!e && (e === b || b.contains(e)) }; }).filter(Boolean);
      return { a: [pp.left, pp.top, pp.right, pp.bottom].map(Math.round), w: innerWidth, h: innerHeight, boutons: bts.length, couverts: bts.filter(b => !b.ok).map(b => b.id) }; });
    pas('B9', rec.boutons > 0 && !rec.couverts.length && rec.a[0] >= 0 && rec.a[2] <= rec.w && rec.a[3] <= rec.h ? 'ok' : 'ÉCHEC', 'la fiche de l\'élève ne couvre aucun bouton visible de la fin de l\'heure et reste dans l\'écran', JSON.stringify(rec)); await p.keyboard.press('Escape'); await s.attendre(200);
    await p.click('#f-clore'); await s.attendre(400); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(1500);
    const c1 = await p.evaluate(() => document.getElementById('chr').textContent); await s.attendre(4000); const c2 = await p.evaluate(() => document.getElementById('chr').textContent);
    const bf = await p.evaluate(() => { const b = document.getElementById('bfin'); return b ? { dis: b.disabled, title: b.title } : null; });
    pas('B9', bf && bf.dis && /close/.test(bf.title) && /^close · \d\d:\d\d$/.test(c2) ? 'ok' : 'ÉCHEC', 'après la clôture : « Fin de l\'heure » gris avec sa raison, le chrono dit « close · hh:mm » (réveil n°12, E4 ligne 107)', JSON.stringify({ bf, c2 }));
    pas('B9', c1 === c2 ? 'ok' : 'ÉCHEC', 'après la clôture, le chrono de la tête ne court plus', c1 + ' → ' + c2);
    pas('B9', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B10 · à 1280 × 768 : la boîte T-5 entière au-dessus des notes ; pendant la fin de l'heure, la participation reste (réveil n°4, point 5) ──
dire(''); dire('B10 — à 1280 × 768 : la boîte T-5 dans l\'écran, ses boutons cliquables ; la fin de l\'heure laisse la participation et « Où on en est »');
{ const s = await session({ vue: { width: 1280, height: 768 } }); const p = s.page; const v = await lancerUnClic(s);
  if (v === 'absent' || !s.integre) pas('B10', 'absent', 'le Lancer du site intégré');
  else { await p.keyboard.press('F2'); await s.attendre(200); await p.keyboard.type('EB1'); await s.attendre(300); await p.keyboard.press('Enter'); await s.attendre(500);
    const vd = await p.evaluate(() => { const r = id => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; }; return { vif: r('vif'), dernier: r('vif-dernier'), txt: (document.getElementById('vif-dernier') || {}).innerText || '', part: r('part'), h: innerHeight }; });
    pas('B10', vd.dernier && /posé/.test(vd.txt) && vd.dernier[1] <= vd.h && vd.vif[0] >= 0 && vd.part && vd.part[0] < vd.h - 20 ? 'ok' : 'ÉCHEC', 'F2, une parole posée : le VIF, « posé : … ✕ (Ctrl+Z) » et le haut de la liste des paroles se voient sans défiler (réveil n°5, A4-3 ; C1 4b.1, 5.4 bis)', JSON.stringify(vd));
    await p.keyboard.press('Escape'); await s.attendre(200);
    await p.evaluate(() => { S.palier = 't5'; alerteOuvrir(); }); await s.attendre(500);
    const a = await p.evaluate(() => { const r = el => { const b = el.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)]; }; const al = document.getElementById('al-boite'), mur = document.getElementById('murcadre'), no = document.querySelector('.scene > .notes');
      const bt = ['al-aller', 'al-tard', 'al-preparer'].map(id => { const e = document.getElementById(id); const q = r(e); const c = document.elementFromPoint((q[0] + q[2]) / 2, (q[1] + q[3]) / 2); return { id, q, dessus: !!c && (c === e || e.contains(c)) }; });
      return { al: r(al), mur: r(mur), notes: r(no), bt, h: innerHeight }; });
    const altx = await p.evaluate(() => (document.getElementById('al-txt') || {}).textContent || '');
    pas('B10', /L.activité en cours : (Diapo|Activité) \d+ — /.test(altx) ? 'ok' : 'ÉCHEC', 'la T-5 nomme l\'activité (ou la diapo) en cours et son état (relecteur neuf n°3, 8 ; C1 6.3)', altx.slice(0, 160));
    pas('B10', a.al[3] <= a.h && a.al[1] >= a.mur[3] && a.al[3] <= a.notes[1] + 1 && a.bt.every(b => b.dessus && b.q[3] <= a.h) ? 'ok' : 'ÉCHEC', 'la boîte T-5 est entière dans l\'écran, sous la diapo (sans la couvrir), au-dessus des notes ; « Aller au cahier », « Plus tard », « Préparer » cliquables (C1 6.3)', JSON.stringify(a));
    await p.click('#dr-clore'); await s.attendre(600);
    const tit = await p.evaluate(() => { const d = document.getElementById('droite'), f = document.getElementById('fin'); const h = f && Array.from(f.querySelectorAll('*')).find(x => /^Fin de l.heure — étape/.test((x.textContent || '').trim()) && x.children.length < 3); if (!h) return null; const r = h.getBoundingClientRect(), R = d.getBoundingClientRect(); return { top: Math.round(r.top), dTop: Math.round(R.top), scroll: d.scrollTop, txt: h.textContent.trim().slice(0, 40) }; });
    pas('B10', tit && tit.top >= tit.dTop - 1 && tit.top < 400 ? 'ok' : 'ÉCHEC', 'la fin de l\'heure s\'ouvre avec son titre en vue, même après un F2 qui a fait défiler la colonne (réveil n°7)', JSON.stringify(tit));
    const nav = await p.evaluate(() => { const b = document.getElementById('f-suivante'); if (!b) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); const e = document.elementFromPoint((r.left + r.right) / 2, (r.top + r.bottom) / 2); const e2 = document.elementFromPoint((r.left + r.right) / 2, r.bottom - 3); return { q: [r.top, r.bottom].map(Math.round), dessus: !!e && (e === b || b.contains(e)), bas: !!e2 && (e2 === b || b.contains(e2)) }; });
    pas('B10', nav && nav.dessus && nav.bas ? 'ok' : 'ÉCHEC', 'pendant la fin de l\'heure, « Étape suivante ▶ » est entier et cliquable (rien ne le recouvre ; la colonne défile) — réveil n°6, P9', JSON.stringify(nav));
    const d = await p.evaluate(() => { const vis = sel => { const e = document.querySelector(sel); return !!(e && e.offsetParent); }; return { fin: vis('#droite-fin'), part: vis('#part'), suivi: vis('#droite > .suivi'), tableau: vis('#droite > .suivante') }; });
    pas('B10', d.fin && d.part && d.suivi && d.tableau ? 'ok' : 'ÉCHEC', 'pendant la fin de l\'heure, la colonne de droite garde la participation, « Où on en est » et le tableau (C1 7.0 ter : la classe continue)', JSON.stringify(d));
    pas('B10', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B11 · la case close garde le titre de sa séance et ouvre la Relecture de cette heure (réveil n°5, A4-4 ; C1 6.5, 8.6) ──
dire(''); dire('B11 — après la clôture, la case de l\'heure garde le titre de sa séance ; « Relire cette heure » ouvre sa Relecture');
{ const s = await session(); const p = s.page; const v = await lancerUnClic(s);
  if (v === 'absent' || !s.integre) pas('B11', 'absent', 'le Lancer du site intégré');
  else { const titre = await p.evaluate(() => seance().titre || seance().title || ''); const h0 = await p.evaluate(() => S.heure);
    await devoiler(s, 2); await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    await p.evaluate(() => edtOuvrir()); await s.attendre(1500);
    const cas = await p.evaluate(() => { const c = Array.from(document.querySelectorAll('.edt-clic')).find(e => e.offsetParent !== null && /Charles/i.test(e.innerText || '') && (e.getAttribute('onclick') || '').indexOf('2026-09-14|08:57') >= 0); if (!c) return null; const x = c.innerText.replace(/\s+/g, ' '); c.id = 'b11-case'; return x; }); if (cas) { await p.click('#b11-case'); } await s.attendre(800);   /* un vrai clic de souris (appui, relâche) : l'appui sur une case jouée ne doit pas dire « on ne déplace pas » (E4 ligne 109) */
    const info = await p.evaluate(() => { const i = document.body.innerText.indexOf('on ne déplace pas'); return i >= 0 ? document.body.innerText.slice(Math.max(0, i - 80), i + 40) : ''; });
    pas('B11', !/on ne déplace pas/.test(info) && await p.evaluate(() => !!document.querySelector('#edt-modale [data-relire]')) ? 'ok' : 'ÉCHEC', 'un clic de souris sur la case close ouvre sa fenêtre (« Relire cette heure »), sans le refus du glissé (réveil n°12, E4 ligne 109)', info.slice(0, 200));
    pas('B11', cas && titre && cas.indexOf(titre.slice(0, 20)) >= 0 ? 'ok' : 'ÉCHEC', 'la case close du lundi 08:57 garde le titre de sa séance', JSON.stringify({ cas, titre }));
    const bt = await p.evaluate(() => { const b = document.querySelector('#edt-modale [data-relire]'); if (!b) return null; const r = { txt: b.innerText, title: b.title }; b.click(); return r; }); await s.attendre(6000);
    const rel = await p.evaluate(() => ({ vis: typeof dr_relectureVisible === 'function' ? dr_relectureVisible() : null, faceH: S.faceH, face: S.face, faces: ((document.getElementById('faces') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 120) }));
    pas('B11', bt && rel.vis && rel.faceH === h0 ? 'ok' : 'ÉCHEC', '« Relire cette heure » (avec son infobulle) ouvre la Relecture sur l\'heure ' + h0 + ' de cette classe', JSON.stringify({ bt: !!bt && !!bt.title, rel }));
    pas('B11', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B12 · l'ordre de l'heure suivante (contrat §12.16, réveil n°6 ; C1 6.5-6.6 ; E4 lignes 130 et 135) ──
dire(''); dire('B12 — l\'heure 2 s\'ouvre sur son rituel ; les décisions de sa fin : « non fait » et « pas le temps » sortent, « à l\'heure suivante » ouvre l\'heure 3');
{ const s = await session(); if (!s.integre) { pas('B12', 'absent', 'le site intégré'); await s.ctx.close(); }
  else { const p = s.page; await lancerParLaCase(s); await clicTexte(p, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s.attendre(6000);
    const o2 = await p.evaluate(() => { const E = seance().ecrans; return ordreHeure(S.heure).map(i => E[i].act + (E[i].role ? '[' + E[i].role + ']' : '')); });
    pas('B12', /Où en sommes-nous/.test(o2[0]) && o2[1] === 'Tableau 3' && /\[fin\]$/.test(o2[o2.length - 1]) ? 'ok' : 'ÉCHEC', 'heure 2 : (a) « Où en sommes-nous ? » d\'abord, (c) puis le programme depuis la diapo 4 (« Tableau 3 »), (d) le cahier de textes en dernier', o2.join(' | '));
    await devoiler(s, 2); await s.attendre(1000);
    await p.evaluate(() => { const E = seance().ecrans; try { aller(E.findIndex(e => e.act === 'Question-bilan')); } catch (e) {} }); await s.attendre(400); if (await p.evaluate(() => document.getElementById('garde').classList.contains('on'))) { await p.click('#garde-devant'); await s.attendre(300); }   /* E4 ligne 138 : la classe s'arrête sur la question-bilan, montrée, rien de dévoilé */
    const qb2 = await p.evaluate(() => { const E = seance().ecrans; const i = E.findIndex(e => e.act === 'Question-bilan'); return { di: S.di === i, vu: vuMax[K(i)] || 0 }; }); await s.attendre(1500);
    await p.evaluate(() => { const E = seance().ecrans; const eid = a => (E.find(e => e.act === a) || {}).eid; const d = (a, choix) => { S.decisions[eid(a)] = { choix, moment: 'fin', h: hhmm(), heure: S.heure, motif: '' }; journal('decision', { act: eid(a), choix }); };
      d('Question-bilan', 'suivante'); d('Tableau 5', 'nonfait'); d('Les hypothèses de la classe', 'pastemps'); d('Les règles héritées', 'terminer'); });
    await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    const hub = await s.hub(); await s.ctx.close(); const H2 = H(hub, '0') || {}; const trv = (H2.travail || {}).terminer || [];
    pas('B12', Array.isArray(trv) && trv.some(x => /Les règles héritées/.test(x.titre || '')) ? 'ok' : 'ÉCHEC', 'le paquet de l\'heure 2 : `H.travail.terminer` porte la diapo décidée « terminer à la maison » (relecteur neuf n°3, 1 ; contrat §12.9)', JSON.stringify(H2.travail || null).slice(0, 300));
    const s2 = await session({ store: hub, quand: '2026-09-15T15:08:00+02:00' }); const p2 = s2.page; await lancerParLaCase(s2, '2026-09-15|15:07');
    await clicTexte(p2, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s2.attendre(6000);
    const ouv = await p2.evaluate(() => ((document.getElementById('fin') || {}).innerText || '').replace(/\s+/g, ' '));
    if (await visible(p2, '#o-lancer')) { await p2.click('#o-lancer'); await s2.attendre(3000); }
    const o3 = await p2.evaluate(() => { const E = seance().ecrans; const oh = ordreHeure(S.heure); const iq = E.findIndex(e => e.act === 'Question-bilan'); return { h: S.heure, mur: (E[S.di] || {}).act, o: oh.map(i => E[i].act + (E[i].role ? '[' + E[i].role + ']' : '')), rejoue: oh.filter(i => vuMax[K(i)] && !glisseeDe(E[i])).map(i => E[i].act), qbVu: vuMax[K(iq)] || 0 }; });
    const nums = await p2.evaluate(() => Array.from(document.querySelectorAll('.dur-t')).map(x => (/^A(\d+)/.exec(x.textContent.trim()) || [])[1]).filter(Boolean));
    pas('B12', nums.length > 2 && new Set(nums).size === nums.length && nums.every((n, k) => +n === k + 1) ? 'ok' : 'ÉCHEC', '« Où on en est » de l\'heure 3 : un numéro par ligne, 1, 2, 3… dans l\'ordre de l\'heure (relecteur neuf n°3, 3)', nums.join(','));
    const hh = await p2.evaluate(() => ({ t: Array.from(document.querySelectorAll('.dur-h')).map(x => x.textContent.trim()), lig: (document.getElementById('al-ligne') || {}).textContent || '' }));
    const ca = hh.t[hh.t.length - 1] || ''; pas('B12', hh.t.length > 2 && hh.t.slice(0, -1).every(x => x <= ca) && !/undefined/.test(hh.lig) ? 'ok' : 'ÉCHEC', '« Où on en est » de l\'heure 3 : chaque ligne avant le cahier de textes (le rituel et les reports comptent dans l\'heure) ; aucun « T-undefined » (réveil n°9, E4 lignes 143 et 145)', JSON.stringify(hh));
    const sans = o3.o.filter(x => /^(Tableau 5|Les hypothèses de la classe)$/.test(x));
    const iR = o3.o.indexOf('Les règles héritées'), iT = o3.o.findIndex(x => /^Tableau [34]$/.test(x));
    pas('B12', qb2.di && /Lancer ouvre l'heure 3 sur « Question-bilan »/.test(ouv) && ouv.indexOf('Question-bilan') < ouv.indexOf('Les règles héritées') && /à reprendre/.test(ouv) ? 'ok' : 'ÉCHEC', 'l\'ouverture de l\'heure 3 annonce ce que le lancement jouera : « sur « Question-bilan » », elle d\'abord, « Les règles héritées » fléchée « à reprendre » (E4 lignes 137-138, §12.17 b2)', ouv.slice(0, 400));
    pas('B12', o3.qbVu === qb2.vu && iR > 0 && (iT < 0 || iT < iR) ? 'ok' : 'ÉCHEC', '« Question-bilan », montrée à 0 dévoilé puis décidée « à l\'heure suivante », reprend où la classe en était (C1 6.6) ; (b1) les reports « à l\'heure suivante » avant (b2) « terminer à la maison » (§12.17)', JSON.stringify({ avant: qb2, apres: o3.qbVu, iR, iT }));
    pas('B12', o3.h === 3 && o3.o[0] === 'Question-bilan' && o3.mur === 'Question-bilan' && !sans.length && !o3.rejoue.length && !o3.o.some(x => /Où en sommes-nous/.test(x)) && /\[fin\]$/.test(o3.o[o3.o.length - 1]) ? 'ok' : 'ÉCHEC', 'heure 3 : (b1) « Question-bilan » (« à l\'heure suivante », la diapo où la classe s\'était arrêtée) en premier et au tableau — E4 ligne 138 ; (b3) « non fait » (Tableau 5) et « pas le temps » (les hypothèses) n\'y sont pas ; rien de joué ne revient ; le cahier de textes en dernier', JSON.stringify(o3));
    pas('B12', !s.errs.length && !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.concat(s2.errs).join(' ; ')); await s2.ctx.close(); } }

// ── B13 · les décisions provisoires suivent ce qui se joue ; l'étape 3 lit les décisions (réveil n°5, A4-2 ; réveil n°6, E4 lignes 122 et 134) ──
dire(''); dire('B13 — décider à la fin de l\'heure puis jouer : la décision tombe ; l\'étape 3 nomme ce qui part à la maison');
{ const s = await session(); const p = s.page; const v = await lancerUnClic(s);
  if (v === 'absent' || !s.integre) pas('B13', 'absent', 'le Lancer du site intégré');
  else { const cib = await p.evaluate(() => { const E = seance().ecrans, o = ordreHeure(S.heure).filter(i => !E[i].role); const a = E[o[1]], b = E[o[3]]; S.decisions[a.eid] = { choix: 'preparer', moment: 'fin', h: hhmm(), heure: S.heure, t: now() }; S.decisions[b.eid] = { choix: 'pastemps', moment: 'fin', h: hhmm(), heure: S.heure, t: now() }; return { a: a.eid, aAct: a.act, b: b.eid, bAct: b.act, iA: o[1] }; });
    await p.click('#dr-clore'); await s.attendre(500); await p.evaluate(() => { const e = document.querySelector('#fin .pp-liste [data-sec="1"]'); if (e) e.click(); }); await s.attendre(400);
    const ech = await p.evaluate(() => { const sel = document.getElementById('f-ech'); const l1 = document.querySelector('#fin .pp-liste [data-sec="1"]'); const p0 = ((dr_classe() || {}).prochaines || [])[0]; return sel ? { aff: sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].text : '', val: sel.value, p0: p0 ? p0.iso : null, faite: !!(l1 && l1.classList.contains('faite')), lib: l1 ? l1.innerText.replace(/\s+/g, ' ') : '' } : null; });
    pas('B13', ech && ech.p0 && ech.val === ech.p0 && !/aucune/.test(ech.aff) && ech.faite && /proposée/.test(ech.lib) ? 'ok' : 'ÉCHEC', 'étape 1 : la prochaine heure de la classe est affichée et posée par défaut, « aucune » reste un choix ; l\'étape est cochée « proposée : … » — ce qui est posé est ce qui est dit (réveil n°8, C1 7.6 ; réveil n°11, E4 ligne 150)', JSON.stringify(ech));
    await p.evaluate(() => { const e = document.querySelector('#fin .pp-liste [data-sec="3"]'); if (e) e.click(); }); await s.attendre(400);
    const e3 = await p.evaluate(() => ((document.getElementById('fin') || {}).innerText || '').replace(/\s+/g, ' '));
    const l2 = await p.evaluate(() => { const e = document.querySelector('#fin .pp-liste [data-sec="2"]'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; }); const nR = await p.evaluate(() => { try { const E = seance().ecrans; return activitesDeLHeure().filter(a => !(a.pseudo && E[a.diapos[0]] && E[a.diapos[0]].role)).length; } catch (e) { return -1; } });   /* le rituel a sa ligne dans « Où on en est », il ne se décide pas */
    pas('B13', +((/\((\d+) à décider\)/.exec(l2) || [])[1]) === nR - 2 ? 'ok' : 'ÉCHEC', 'la liste : « ce qui reste (n à décider) » compte ce que Paul n\'a pas décidé — les deux diapos décidées en moins (E4 ligne 122, A4-5)', l2 + ' · ' + nR + ' activités dans l\'heure');
    pas('B13', e3.indexOf(cib.bAct) >= 0 && /à faire :/.test(e3) && !/rien choisi au-dessus/.test(e3) ? 'ok' : 'ÉCHEC', 'étape 3 : « à faire : » nomme la diapo partie à la maison par son titre (« ' + cib.bAct + ' »), plus « rien choisi »', e3.slice(e3.indexOf('Travail à faire'), e3.indexOf('Travail à faire') + 200));
    await p.evaluate(() => { const b = document.getElementById('f-fermer'); if (b) b.click(); }); await s.attendre(300);
    await p.evaluate(i => { try { aller(i); } catch (e) {} }, cib.iA); await s.attendre(400); if (await p.evaluate(() => document.getElementById('garde').classList.contains('on'))) { await p.click('#garde-devant'); await s.attendre(300); }   /* la diapo décidée est retirée de ▶ : Paul y revient par le volet */
    for (let k = 0; k < 40 && !(await p.evaluate(i => { const E = seance().ecrans; return S.di === i && finie(E[i], i); }, cib.iA)); k++) { await p.click('#bdev'); await s.attendre(120); }
    await s.attendre(2500);
    const apres = await p.evaluate(c => ({ dec: !!S.decisions[c.a], tt: texteTravail(), lev: J.filter(x => x.type === 'decision-levee').length, b: !!S.decisions[c.b] }), cib);
    pas('B13', !apres.dec && apres.lev >= 1 && !/Préparer « /.test(apres.tt) && apres.b ? 'ok' : 'ÉCHEC', 'la décision « préparer » prise à la fin de l\'heure tombe quand sa diapo est jouée jusqu\'au bout (journal « decision-levee »), le travail à faire ne la garde pas ; l\'autre décision reste (C1 7.0 ter)', JSON.stringify(apres));
    await p.click('#dr-clore'); await s.attendre(500); await p.evaluate(() => { const b = document.getElementById('f-preparer'); if (b) b.click(); }); await s.attendre(800);
    const pr = await p.evaluate(() => ({ prep: !!S.preparation, mini: Array.from(document.querySelectorAll('#volet .vig .mini')).some(m => m.offsetParent !== null), ou: ((document.querySelector('#ou > span') || {}).textContent || ''), gel: S.preparation ? seance().ecrans[S.preparation.di].act : '', mur: ((document.getElementById('mur') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 160), nDev: etatDiapo().nDev }));
    pas('B13', /Cahier de textes/i.test(pr.mur) && /agendas/i.test(pr.mur) && pr.nDev >= 4 ? 'ok' : 'ÉCHEC', 'en préparation, le cahier de textes s\'affiche entier chez Paul (ses quatre éléments), la classe gelée sur sa diapo (réveil n°12, E4 ligne 162 ; C1 6.4 bis, 7.0 ter)', JSON.stringify({ mur: pr.mur, nDev: pr.nDev }));
    pas('B13', pr.prep && !pr.mini && pr.gel && pr.ou.indexOf(pr.gel) === 0 && /gelée/.test(pr.ou) ? 'ok' : 'ÉCHEC', '« Préparer le cahier de textes » : le volet réduit à ses numéros, « Où on en est » dit la diapo où la classe est gelée (réveil n°11, E4 ligne 152 ; C1 7.0 ter)', JSON.stringify(pr));
    pas('B13', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B14 · relecteur neuf n°3 : l'absent au VIF, les mêmes initiales, « Lancer » dans une page neuve après la clôture ──
dire(''); dire('B14 — F2 sur un absent ; deux élèves aux mêmes initiales ; « Lancer » après la clôture, page rechargée');
{ const s = await session(); const p = s.page; const v = await lancerUnClic(s);
  if (v === 'absent' || !s.integre) pas('B14', 'absent', 'le Lancer du site intégré');
  else { const tb = await p.evaluate(() => { const n = ELEVES.find(x => iniDe(x).replace(/\d+$/, '') === 'TB'); if (!n) return null; S.appel[n] = (S.appel[n] || []).concat([{ type: 'absent', t: now(), raison: 'B14' }]); participation(); return n; });
    if (!tb) pas('B14', 'absent', 'pas d\'élève « TB » dans la classe');
    else { await p.keyboard.press('F2'); await s.attendre(200); await p.keyboard.type('T'); await s.attendre(300); const apresT = await p.evaluate(() => ({ pop: document.getElementById('ppop').classList.contains('on'), act: (document.activeElement || {}).id }));
      await p.keyboard.type('B'); await s.attendre(300); await p.keyboard.type('1'); await p.keyboard.press('Enter'); await s.attendre(400);
      const r = await p.evaluate(() => ({ parts: S.parts.map(x => x.nom), sug: (document.getElementById('vif-sug') || {}).innerText || '' })); await p.keyboard.press('Escape'); await s.attendre(200);
      pas('B14', !apresT.pop && apresT.act === 'vif' && !r.parts.length && /absent/.test(r.sug) ? 'ok' : 'ÉCHEC', 'F2, « T » n\'ouvre aucune fiche ; « TB » (élève absent) le dit, et rien n\'est posé sur un autre élève (relecteur neuf n°3, 5 ; C1 4b.4)', JSON.stringify({ apresT, r })); }
    const rd = await p.evaluate(() => { const g = ELEVES.filter(n => iniDe(n).replace(/\d+$/, '') === 'RD'); if (g.length < 2) return null; const lab = g.map(n => { const sp = document.querySelector('#part span[data-ini="' + iniDe(n) + '"]'); return sp ? sp.firstChild.textContent + (sp.querySelector('.dr-ini-p') || {}).textContent : ''; }); return { lab, cands: dr_candidats('RD').length }; });
    if (!rd) pas('B14', 'absent', 'pas deux « RD » dans la classe');
    else pas('B14', new Set(rd.lab).size === rd.lab.length && rd.cands === 2 ? 'ok' : 'ÉCHEC', 'deux élèves « RD » : deux étiquettes différentes, et « RD » les propose tous les deux (relecteur neuf n°3, 6 ; C1 4b.4)', JSON.stringify(rd));
    await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    const hub = await s.hub(); await s.ctx.close();
    const s2 = await session({ store: hub, quand: '2026-09-14T09:43:00+02:00' }); const p2 = s2.page; await p2.click('#tprof-btn'); await s2.attendre(500); await p2.evaluate(() => atelierOuvrir()); await s2.attendre(1000); await clicTexte(p2, 'button,[onclick]', "atOnglet('chapitres')"); await s2.attendre(800);
    if (!(await clicTexte(p2, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(p2, 'button,[onclick]', 'Modifier'); await s2.attendre(1500); await p2.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]') || document.getElementById('ong-pilotage'); if (b) b.click(); });   /* le chemin de lancerUnClic, sans le clic sur « Lancer » */
    await s2.attendre(2500); const bt = await p2.evaluate(() => { const b = document.getElementById('dr-lancer'); return b ? { dis: b.disabled, txt: b.textContent, title: b.title } : null; });
    pas('B14', bt && bt.dis && /close/.test(bt.txt + bt.title) && !/heure \d+\/1\b/.test(bt.txt) ? 'ok' : 'ÉCHEC', 'page rechargée après la clôture : « ▶ Lancer » gris avec sa raison (la case de l\'EDT dit l\'heure close), jamais « heure 2/1 » (relecteur neuf n°3, 7)', JSON.stringify(bt));
    pas('B14', !s.errs.length && !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.concat(s2.errs).join(' ; ')); await s2.ctx.close(); }
  if (v === 'absent' || !s.integre) await s.ctx.close(); }

// ── B15 · en classe, une retouche par l'onglet Atelier part dans la copie de la classe (réveil n°10, E4 ligne 149) ──
dire(''); dire('B15 — en classe, retoucher dans l\'onglet Atelier : la copie de la classe part au hub, l\'état et le journal attendent le Pilotage');
{ const s = await session(); const p = s.page; const v = await lancerUnClic(s);
  if (v === 'absent' || !s.integre) pas('B15', 'absent', 'le Lancer du site intégré');
  else { await s.attendre(2000); await p.click('#ong-atelier'); await s.attendre(600); if (await p.$('#at-aide .x')) { await p.click('#at-aide .x'); await s.attendre(200); }
    const n0 = (await s.ecrits()).length; const at = await p.evaluate(() => !!S.atelier);
    await p.evaluate(() => { const e = seance().ecrans.find(x => !x.role); e.act = e.act + ' — retouché dans l\'Atelier (B15)'; if (typeof dr_copieAuto === 'function') dr_copieAuto(); }); await s.attendre(2500);
    const ec = depuis(await s.ecrits(), n0).map(x => x.replace(/\/site\/3e\/chapitres\/0\/seances\/0\/deroule_joue\/3E Charles de Gaulle/, 'C'));
    const hub = await s.hub(); const copie = ((((hub.site['3e'].chapitres[0].seances[0].deroule_joue || {})[CLASSE] || {}).ecrans) || []);
    pas('B15', at && ec.includes('PUT C/ecrans') && copie.some(e => /retouché dans l'Atelier \(B15\)/.test(e.act || '')) && !ec.some(x => /^PUT C\/(etat|journal)$/.test(x)) ? 'ok' : 'ÉCHEC', 'l\'onglet Atelier ouvert en classe : la retouche part dans `C/ecrans` en moins de 3 s ; ni `C/etat` ni `C/journal` pendant l\'Atelier (son `S` n\'est pas celui de la classe)', JSON.stringify({ atelier: at, ec }));
    if (await p.$('#mur .p8-ecrire')) { await p.click('#mur .p8-ecrire'); await p.keyboard.type('Retouche de l Atelier (B15).'); await p.keyboard.press('Escape'); await s.attendre(800); }   /* le geste d'E4 (ligne 150) : un texte écrit dans l'Atelier, en classe */
    await p.evaluate(() => { const b = document.getElementById('ong-pilotage'); if (b) b.click(); }); await s.attendre(1200);
    await p.click('#dr-clore'); await s.attendre(500); await p.evaluate(() => { const e = document.querySelector('#fin .pp-liste [data-sec="5"]'); if (e) e.click(); }); await s.attendre(400);
    const l5 = await p.evaluate(() => ((document.getElementById('fin') || {}).innerText || '').replace(/\s+/g, ' '));
    pas('B15', /Retouche de l Atelier \(B15\)/.test(l5) && /Verser dans la trame/.test(l5) ? 'ok' : 'ÉCHEC', 'étape 5 : la retouche écrite dans l\'onglet Atelier pendant l\'heure est proposée au versement, diapo par diapo (réveil n°12, E4 ligne 150 ; C1 8.4 — avec `S.copie[h]` posé par E1)', l5.slice(l5.indexOf('Diapos modifiées'), l5.indexOf('Diapos modifiées') + 260));
    const ord = await p.evaluate(() => { const E = seance().ecrans, o = ordreHeure(S.heure).filter(i => (E[i].blocs || []).some(b => b.bid && b.t !== 'image')); const h = S.heure; S.copie = S.copie || {}; S.copie[h] = S.copie[h] || {}; const pris = o.slice(0, 2).reverse();   /* deux retouches posées dans l'ordre inverse de l'heure */
      pris.forEach(i => { const b = E[i].blocs.find(x => x.bid && x.t !== 'image'); S.copie[h][E[i].eid] = Object.assign(S.copie[h][E[i].eid] || {}, { [b.bid]: { t: (b.txt || '') + ' (B15 ordre)' } }); }); ['4', '5'].forEach(k => { const e = document.querySelector('#fin .pp-liste [data-sec="' + k + '"]'); if (e) e.click(); }); const vu = Array.from(document.querySelectorAll('#fin .p8-verse')).map(x => o.indexOf(indexDe(x.dataset.p8eid))); return { vu, n: Object.keys(S.copie[h]).length, d: pris.map(i => p8DiffCopie(h, E[i]).length), sec: S.finSection, l: document.querySelectorAll('#fin .p8-verse-liste').length }; });
    pas('B15', ord.vu.length >= 2 && ord.vu.every((v, k) => k === 0 || v >= ord.vu[k - 1]) ? 'ok' : 'ÉCHEC', 'étape 5 : les diapos modifiées dans l\'ordre de l\'heure (réveil n°13, E4 ligne 165)', JSON.stringify(ord));
    pas('B15', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B16 · hors d'une case de la classe, « Lancer » ne prend jamais le créneau d'une autre classe (réveil n°13, E4 lignes 167, 170) ──
dire(''); dire('B16 — lundi 10:00 et mercredi 08:30, sans case de la 3E : « Lancer » gris, la prochaine heure de la classe');
for (const [quand, attendu] of [['2026-09-14T10:00:00+02:00', /mardi 15 septembre/], ['2026-09-16T08:30:00+02:00', /vendredi 18 septembre/]]   /* réveil n°16 (E4 ligne 177) : le mercredi, la prochaine heure de la séance (vendredi 18) — avant « mercredi 16 », la case du fil « langue » */) {
  const s = await session({ quand }); const p = s.page;
  if (!s.integre) { pas('B16', 'absent', 'le site intégré'); await s.ctx.close(); continue; }
  await p.click('#tprof-btn'); await s.attendre(500); await p.evaluate(() => atelierOuvrir()); await s.attendre(1000); await clicTexte(p, 'button,[onclick]', "atOnglet('chapitres')"); await s.attendre(800);
  if (!(await clicTexte(p, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(p, 'button,[onclick]', 'Modifier'); await s.attendre(1500);
  await p.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]') || document.getElementById('ong-pilotage'); if (b) b.click(); }); await s.attendre(8000);
  const bt = await p.evaluate(() => { const b = document.getElementById('dr-lancer'); return b ? { dis: b.disabled, txt: b.textContent, title: b.title } : null; });
  pas('B16', bt && bt.dis && attendu.test(bt.txt) && !/08:00-08:55|10:07-11:02 · heure/.test(bt.txt) ? 'ok' : 'ÉCHEC', quand.slice(0, 16) + ' : « Lancer » gris, il nomme la prochaine heure de la 3E, jamais le créneau d\'une autre classe', JSON.stringify(bt));
  pas('B16', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); await s.ctx.close(); }

{ const s = await session({ quand: '2026-09-14T09:00:00+02:00' }); const p = s.page;   /* B16 bis — réveil n°14 (E4 ligne 176) : dans la case de la 3E, l'infobulle de « Lancer » le dit */
  if (s.integre) { await p.click('#tprof-btn'); await s.attendre(500); await p.evaluate(() => atelierOuvrir()); await s.attendre(1000); await clicTexte(p, 'button,[onclick]', "atOnglet('chapitres')"); await s.attendre(800);
    if (!(await clicTexte(p, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(p, 'button,[onclick]', 'Modifier'); await s.attendre(1500);
    await p.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]') || document.getElementById('ong-pilotage'); if (b) b.click(); }); await s.attendre(8000);
    const bt = await p.evaluate(() => { const b = document.getElementById('dr-lancer'); const hx = (dr_heuresDeLaClasse('3E Charles de Gaulle') || []).find(x => x.iso === '2026-09-14'); return b ? { dis: b.disabled, txt: b.textContent, title: b.title, hx } : null; });
    pas('B16', bt && !bt.dis && /08:57-09:52 · heure 2\/3/.test(bt.txt) && /la case de ton emploi du temps/.test(bt.title) && bt.hx && bt.hx.n === 2 ? 'ok' : 'ÉCHEC', 'lundi 09:00, dans la case de la 3E : « Lancer … heure 2/3 », l\'infobulle dit « la case de ton emploi du temps » ; l\'heure n est celle de `dr_heuresDeLaClasse` (réveil n°14, E4 ligne 176 ; §12.18)', JSON.stringify(bt));
    pas('B16', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B17 · une seule suite (§12.18) : l'EDT, l'Atelier (`dr_heuresDeLaClasse`) et « Lancer » (réveil n°16, E4 lignes 177-181) ──
dire(''); dire('B17 — une seule suite : les cases passées sans heure jouée ne prennent rien ; « Lancer » vise la case de la séance ; l\'heure close est jouée tout de suite');
const ouvrirPilotage = async (s, snum) => { const p = s.page; await p.click('#tprof-btn'); await s.attendre(500); await p.evaluate(() => atelierOuvrir()); await s.attendre(1000); await clicTexte(p, 'button,[onclick]', "atOnglet('chapitres')"); await s.attendre(800);
  if (!(await clicTexte(p, 'button,[onclick]', 'Éditer dans l’atelier'))) await clicTexte(p, 'button,[onclick]', 'Modifier'); await s.attendre(1500); if (snum) await p.evaluate(n => { ATVUES.snum = n; }, snum);
  await p.evaluate(() => { const b = document.querySelector('.at-onglet[data-vue="pilotage"]') || document.getElementById('ong-pilotage'); if (b) b.click(); }); await s.attendre(8000); };
const mesurer = p => p.evaluate(() => { const b = document.getElementById('dr-lancer'); const cel = edtProjeter(edtLundiDe(edtAujourdhui()), 5); const c = {}; Object.values(cel).filter(x => x.classeMjpc === '3E Charles de Gaulle').forEach(x => { c[x.iso.slice(5)] = x.nature + (x.titre ? ' ' + x.titre.slice(0, 12) : '') + (x.heure ? ' ' + x.heure + '/' + x.sur : ''); });
  return { dis: b && b.disabled, txt: b && b.textContent, title: b && b.title, h: dr_heuresDeLaClasse('3E Charles de Gaulle').map(x => ({ n: x.n, iso: x.iso, jouee: !!x.jouee, clos: !!x.clos })), c }; });
{ const s = await session({ quand: '2026-09-16T08:30:00+02:00' });
  if (!s.integre) pas('B17', 'absent', 'le site intégré');
  else { await ouvrirPilotage(s, 0); const m = await mesurer(s.page); const h2 = m.h.find(x => !x.jouee) || {};
    pas('B17', /passee/.test(m.c['09-14']) && /passee/.test(m.c['09-15']) && /Poésie.* 2\/3/.test(m.c['09-18']) && h2.iso === '2026-09-18' && h2.n === 2 && m.dis && /vendredi 18 septembre/.test(m.txt) ? 'ok' : 'ÉCHEC', 'mercredi 08:30, hub frais : l\'EDT dit le lundi 14 et le mardi 15 « passée », la Poésie 2/3 au vendredi 18 ; l\'Atelier H2 au vendredi 18 ; « Lancer » gris vers le vendredi 18 (E4 lignes 177, 179, 181)', JSON.stringify(m));
    pas('B17', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }
{ const s = await session({ quand: '2026-09-14T09:00:00+02:00' });
  if (s.integre) { await ouvrirPilotage(s, 1); const m = await mesurer(s.page); const h1 = m.h[0] || {};
    pas('B17', m.dis && /vendredi 18 septembre/.test(m.txt) && /La case de maintenant \(08:57-09:52\)/.test(m.title) && !/Aucune case/.test(m.title) && h1.iso === '2026-09-18' && h1.n === 1 && /Albatros|L'Albatros|Étude de text/.test(m.c['09-18']) ? 'ok' : 'ÉCHEC', 'lundi 09:00, la séance « L\'Albatros » montrée : « Lancer » gris vers sa case (vendredi 18, heure 1/3, la même que l\'EDT), l\'infobulle nomme la séance de la case de maintenant, jamais « aucune case » (E4 ligne 180)', JSON.stringify(m));
    pas('B17', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }
{ const s = await session({ quand: '2026-09-14T09:00:00+02:00' });
  if (s.integre && (await lancerUnClic(s)) === 'ok') { await devoiler(s, 2); await s.page.click('#dr-clore'); await s.attendre(400); await s.page.click('#f-clore'); await s.attendre(300); if (await s.page.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) { await s.page.click('#gclore-oui'); } await s.attendre(2500);
    const h = await s.page.evaluate(() => dr_heuresDeLaClasse('3E Charles de Gaulle').map(x => ({ n: x.n, iso: x.iso, jouee: !!x.jouee, clos: !!x.clos })));
    const x = h.find(y => y.iso === '2026-09-14') || {};
    pas('B17', x.jouee && x.clos && x.n === 2 && h.filter(y => y.iso === '2026-09-14').length === 1 ? 'ok' : 'ÉCHEC', 'lundi 09:00, l\'heure lancée puis close : `dr_heuresDeLaClasse` la dit « H2 · jouée, close » sans rechargement, une seule fois (E4 ligne 178)', JSON.stringify(h));
    pas('B17', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

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
    else { const m1 = await s.page.evaluate(() => { const st = M8_TEST_STORE, k = Object.keys(st).find(x => /\/heures\/[^/]+$/.test(x) && st[x] && st[x].classe);   /* la clé de l'heure jouée (une lecture « l'heure proposée est-elle close ? » met aussi un nul en magasin) */ return { ca: st['/site/cours_actif'] || null, H: k ? st[k] : null }; });
      await s.attendre(1500); const pil = await s.page.evaluate(() => { const x = document.getElementById('dr-test'); return x ? { vu: !!x.offsetParent, txt: x.innerText, zone: (document.getElementById('dr-zone') || {}).dataset.modeTest || null } : null; });
      pas('B6', pil && pil.vu && pil.zone === '1' ? 'ok' : 'ÉCHEC', 'mode test : la pastille « Mode test » dans l\'entête du pilotage, `data-mode-test` posé (C1 11t.3, réveil n°4, 5)', JSON.stringify(pil));
      pas('B6', m1.ca && m1.ca.classeSlug === '3E Charles de Gaulle' && m1.H && !m1.H.clos ? 'ok' : 'ÉCHEC', 'mode test, après le lancement : le magasin de test porte cours_actif, et l\'heure n\'est PAS close (relance du 21/10 12:58)', JSON.stringify({ ca: !!m1.ca, clos: m1.H && m1.H.clos }));
      await devoiler(s, 2); await s.page.click('#dr-clore'); await s.attendre(400); await s.page.click('#f-clore'); await s.attendre(300); if (await s.page.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) { await s.page.click('#gclore-oui'); } await s.attendre(2500);   /* « ■ Clore l'heure » → l'étape 7 → « Clore l'heure » → la garde → « Clore quand même », comme Paul */
      const ec = depuis(await s.ecrits(), n0); pas('B6', ec.length === 0 ? 'ok' : 'ÉCHEC', 'mode test : zéro écriture au hub', ec.length + ' : ' + ec.join(' · '));
      const m2 = await s.page.evaluate(() => { const st = M8_TEST_STORE, k = Object.keys(st).find(x => /\/heures\/[^/]+$/.test(x) && st[x] && st[x].classe);   /* la clé de l'heure jouée (une lecture « l'heure proposée est-elle close ? » met aussi un nul en magasin) */ return { ca: st['/site/cours_actif'], H: k ? st[k] : null }; });
      pas('B6', !m2.ca && m2.H && m2.H.clos === true ? 'ok' : 'ÉCHEC', 'mode test, après la clôture : dans le magasin, l\'heure est close et le pointeur effacé', JSON.stringify({ ca: m2.ca || null, clos: m2.H && m2.H.clos })); }
    await s.ctx.close(); } }

await nav.close();
dire(''); dire(r.echecs() === 0 ? 'BANC E2 VERT' : 'BANC E2 ROUGE — ' + r.echecs() + ' échec(s)');
if (OUT) fs.writeFileSync(OUT, r.R.join('\n') + '\n');
process.exit(r.echecs() ? 1 : 0);
