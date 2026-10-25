// LE BANC UNIQUE D'E2 — la classe et l'heure, par le geste, sur le faux hub (mandat E2, « BANCS PAR LE GESTE »).
// usage : node banc.mjs <fichier.html> [sortie.txt] [dossier-captures]
//   <fichier.html> = `assemble/index.html` (le site intégré) ou, avant E1-a, la maquette p8-5g.
// Le banc reconnaît son entrée : le site (il a `edtOuvrir`) ou la maquette seule. Un pas qui n'a pas d'entrée dans le fichier joué est
// « absent » (pas un échec) ; un pas qui trouve son entrée et n'aboutit pas est un ÉCHEC ; le code de sortie est 1 au premier échec.
// L'horloge : lundi 14/09/2026 09:00 sur le site (créneau 08:57-09:52 de 3E Charles de Gaulle) ; 15:07 sur la maquette (son heure simulée).
// T-5 = cinq minutes avant le cahier de textes = fin − 10 min (C1 6.3 ; audit E2, F7).
import fs from 'fs'; import path from 'path'; import { ouvrir, rapport, playwright, magasin } from './hub.mjs';
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
    pas('B9', d0.h === 2 && d0.premier === 4 && d0.premierAct === 'Tableau 3' && d0.di === d0.premier && d0.second === 5 && JSON.stringify(d0.jouees) === '[0,1,2]' && d0.uniques ? 'ok' : 'ÉCHEC', 'heure 2/3 : le paquet du 07/09 a joué trois diapos → l\'heure 2 s\'ouvre sur la diapo 4 (« Tableau 3 » — le rituel de la trame n\'est plus reconnu à son titre, §12.25-6 ; la réactivation construite est B18), les trois jouées marquées au volet (réveil n°4, point 2 ; CADRAGE-TEMPS §1), aucun « Cahier de textes » doublé, tous à la clé de la séance (banc.sh 13:56, K6-K11)', JSON.stringify(d0));
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
    pas('B12', o2[0] === 'Tableau 3' && !o2.some(x => /\[reactivation\]/.test(x)) && /\[fin\]$/.test(o2[o2.length - 1]) ? 'ok' : 'ÉCHEC', 'heure 2 : (a) sans réactivation construite (E4 absente : rien n\'est reconnu au titre, §12.25-6), (c) le programme depuis la diapo 4 (« Tableau 3 »), (d) le cahier de textes en dernier', o2.join(' | '));
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
    if (await visible(p2, '#o-react-non')) { await p2.click('#o-react-non'); await s2.attendre(500); }   /* 25/10 : E4 construit la réactivation depuis l'heure 2 jouée — B12 mesure l'ordre b1/b2/b3 SANS elle (« non ») ; avec elle : B18, B20 */
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
    pas('B12', o3.h === 3 && o3.o[0] === 'Question-bilan' && o3.mur === 'Question-bilan' && !sans.length && !o3.rejoue.length && !o3.o.some(x => /\[reactivation\]/.test(x)) && /\[fin\]$/.test(o3.o[o3.o.length - 1]) ? 'ok' : 'ÉCHEC', 'heure 3 : (b1) « Question-bilan » (« à l\'heure suivante », la diapo où la classe s\'était arrêtée) en premier et au tableau — E4 ligne 138 ; (b3) « non fait » (Tableau 5) et « pas le temps » (les hypothèses) n\'y sont pas ; rien de joué ne revient ; le cahier de textes en dernier', JSON.stringify(o3));
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
    const l2 = await p.evaluate(() => { const e = document.querySelector('#fin .pp-liste [data-sec="2"]'); return e ? e.innerText.replace(/\s+/g, ' ') : ''; }); const nR = await p.evaluate(() => { try { const E = seance().ecrans; return activitesDeLHeure().filter(a => !(a.pseudo && E[a.diapos[0]] && E[a.diapos[0]].role) && a.diapos.some(i => !finie(E[i], i))).length; } catch (e) { return -1; } });   /* le rituel a sa ligne dans « Où on en est », il ne se décide pas ; une diapo sans élément déjà montrée (« Tableau 3 », première de l'heure 2 depuis §12.25-6) est finie, elle ne se décide pas non plus */
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
    const sem = await s.page.evaluate(() => { const f = o => { const r = {}; Object.values(o).filter(x => x.classeMjpc === '3E Charles de Gaulle' && x.iso >= '2026-09-21' && x.iso <= '2026-09-25').forEach(x => { r[x.iso + ' ' + x.creneau] = x.nature + ' ' + (x.titre || '') + ' ' + (x.heure || '') + '/' + (x.sur || ''); }); return r; };
      const a = f(edtProjeter('2026-09-21', 5)), b = f(edtProjeter(edtAujourdhui(), 14)); return { a, b, egal: JSON.stringify(a) === JSON.stringify(b) && Object.keys(a).length > 0 }; });
    pas('B17', sem.egal && /Poésie.* 3\/3/.test(sem.a['2026-09-21 08:57-09:52'] || '') ? 'ok' : 'ÉCHEC', 'mercredi 08:30 : la semaine prochaine vue seule (depuis son lundi) = la même projection que depuis aujourd\'hui — la Poésie 3/3 le lundi 21 (§12.19, une seule source)', JSON.stringify(sem));
    pas('B17', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }
{ const s = await session({ quand: '2026-09-14T09:00:00+02:00' });
  if (s.integre) { await ouvrirPilotage(s, 1); const m = await mesurer(s.page); const h1 = m.h[0] || {};
    pas('B17', m.dis && /vendredi 18 septembre/.test(m.txt) && /La case de maintenant \(08:57-09:52\)/.test(m.title) && !/Aucune case/.test(m.title) && h1.iso === '2026-09-18' && h1.n === 1 && /Étude de tex.* 1\/3/.test(m.c['09-18']) ? 'ok' : 'ÉCHEC', 'lundi 09:00, la séance « L\'Albatros » montrée : « Lancer » gris vers sa case (vendredi 18, heure 1/3, la même que l\'EDT), l\'infobulle nomme la séance de la case de maintenant, jamais « aucune case » (E4 ligne 180)', JSON.stringify(m));
    pas('B17', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }
{ const s = await session({ quand: '2026-09-14T09:00:00+02:00' });
  if (s.integre && (await lancerUnClic(s)) === 'ok') { await devoiler(s, 2); await s.page.click('#dr-clore'); await s.attendre(400); await s.page.click('#f-clore'); await s.attendre(300); if (await s.page.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) { await s.page.click('#gclore-oui'); } await s.attendre(2500);
    const h = await s.page.evaluate(() => dr_heuresDeLaClasse('3E Charles de Gaulle').map(x => ({ n: x.n, iso: x.iso, jouee: !!x.jouee, clos: !!x.clos })));
    const x = h.find(y => y.iso === '2026-09-14') || {};
    pas('B17', x.jouee && x.clos && x.n === 2 && h.filter(y => y.iso === '2026-09-14').length === 1 ? 'ok' : 'ÉCHEC', 'lundi 09:00, l\'heure lancée puis close : `dr_heuresDeLaClasse` la dit « H2 · jouée, close » sans rechargement, une seule fois (E4 ligne 178)', JSON.stringify(h));
    await s.page.clock.fastForward(58 * 60 * 1000); await s.attendre(3000);   /* E4 ligne 182 : 09:58, le créneau de l'heure close est fini, la même page */
    const m2 = await s.page.evaluate(() => { const b = document.getElementById('dr-lancer'); const c = {}; Object.values(edtProjeter(edtAujourdhui(), 5)).filter(x => x.classeMjpc === '3E Charles de Gaulle').forEach(x => { c[x.iso.slice(5)] = x.nature + ' ' + (x.heure || '') + '/' + (x.sur || ''); });
      return { txt: b && b.textContent, h: dr_heuresDeLaClasse('3E Charles de Gaulle').map(x => x.n + '/' + x.sur + ' ' + x.iso + (x.jouee ? ' jouée' : '')), c }; });
    pas('B17', m2.h.join('|') === '1/3 2026-09-07 jouée|2/3 2026-09-14 jouée|3/3 2026-09-15' && /^jouee/.test(m2.c['09-14'] || '') && /prevu 3\/3/.test(m2.c['09-15'] || '') && !/heure 2\/3/.test(m2.txt || '') ? 'ok' : 'ÉCHEC', 'lundi 09:58, l\'heure close dans la même page, son créneau fini : H1 et H2 jouées, H3 au mardi 15 (3/3) — l\'EDT, `dr_heuresDeLaClasse` et « Lancer » d\'accord, trois heures pour trois (E4 ligne 182, §12.19)', JSON.stringify(m2));
    pas('B17', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); }
  await s.ctx.close(); }

// ── B18-B26 · la réactivation construite (contrat §12.22, §12.25, §12.26 ; 23/10 ; rejoués SANS BOUCHON le 25/10 ; §12.26 le 25/10 : construite à la clôture, vue et modifiée avant le lancement) — E4 construit le contenu
//    (`dr_reactivationConstruire(h)` / `dr_reactivationPreparer(h, cb)`, dr-recit.js, poussées 93-94) : mes gardes jouent contre SA fonction, enveloppée
//    d'un compteur qui ne change rien à ce qu'elle rend ; le bouchon (le même contrat : l'écran ou null) ne sert plus que si elle manque dans le fichier joué.
//    E4 lit `C/heures` de la classe sous sa clé actuelle (`3E Charles de Gaulle`) : le faux hub n'a l'heure du 07/09 que sous l'ancien slug — rien à réactiver,
//    « Lancer » direct (P5 inchangé). Le prélude B18-0 joue donc l'heure 1 (lundi 07/09, 08:57) sous la clé actuelle, et B18-B21 partent de ce hub. ──
const bouchon = (p, nul) => p.evaluate(nul => { window.__reactCalls = 0; window.dr_reactivationPreparer = undefined; window.dr_reactivationConstruire = h => { window.__reactCalls++; if (nul) return null; return { act: 'Où en sommes-nous ?', dur: 3, construite: { depuis: 'bouchon-h' + (h - 1), t: Date.now() }, blocs: [{ t: 'texte', txt: 'La dernière fois', el: ['Activité 1 — Tableau 1', 'Activité 2 — Tableau 2'] }, { t: 'texte', txt: 'Les notions', el: ['le registre lyrique'] }] }; }; }, !!nul);
const compteur = p => p.evaluate(() => { window.__reactCalls = 0; const f = window.dr_reactivationConstruire; if (typeof f === 'function' && !f.__compte) { const g = function () { window.__reactCalls++; return f.apply(this, arguments); }; g.__compte = true; window.dr_reactivationConstruire = g; } });
const absence = p => p.evaluate(() => { window.__reactCalls = 0; window.dr_reactivationConstruire = undefined; window.dr_reactivationPreparer = undefined; });
const reelle = p => p.evaluate(() => typeof dr_reactivationConstruire === 'function' && typeof dr_reactivationPreparer === 'function');
/* la construction en place pour un pas : la vraie (E4, comptée) ; le bouchon seulement si elle manque */
const brancher = async p => { if (await reelle(p)) { await compteur(p); return 'E4'; } await bouchon(p); return 'bouchon'; };
const sansCopie = () => { const st = magasin(); try { delete st.site['3e'].chapitres[0].seances[0].deroule_joue; } catch (e) {} return st; };
const ouvertureParLaCase = async (s, iso) => { await lancerParLaCase(s, iso); await clicTexte(s.page, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s.attendre(6000); };
const ecranOuverture = p => p.evaluate(() => ({ on: document.getElementById('ecran-fin').classList.contains('on'), oui: !!document.getElementById('o-react-oui'), ouiCoche: !!(document.getElementById('o-react-oui') || {}).checked, nonCoche: !!(document.getElementById('o-react-non') || {}).checked, desact: !!(document.getElementById('o-react-oui') || {}).disabled, reg: (document.getElementById('o-react-reg') || {}).value, txt: ((document.getElementById('fin') || {}).innerText || '').replace(/\s+/g, ' '), lancee: !!(window.S && S.lancee), close: !!(window.S && S.close) }));
const ordreVu = p => p.evaluate(() => { const E = seance().ecrans; return { h: S.heure, lancee: S.lancee, o: ordreHeure(S.heure).map(i => E[i].act + (E[i].role ? '[' + E[i].role + ']' : '')), eid0: (E[ordreHeure(S.heure)[0]] || {}).eid, di: (E[S.di] || {}).act, nReact: E.filter(e => e.role === 'reactivation').map(e => e.eid + '@' + e.heure), calls: window.__reactCalls, J: J.filter(x => x.type === 'reactivation').map(x => x.heure + ':' + x.choix + ':' + x.eid), choix: (S.reactChoix || {}) }; });
const blocsDe = (p, eid) => p.evaluate(eid => { const e = seance().ecrans.find(x => x.eid === eid); return e ? (e.blocs || []).map(b => (b.txt || '') + ':' + (b.el || []).length).join('|') : null; }, eid);
const copieReact = (hub, h) => { try { const C = (((hub.site['3e'].chapitres[0].seances[0] || {}).deroule_joue || {})[CLASSE]) || {}; return (C.ecrans || []).find(e => e && e.role === 'reactivation' && +e.heure === +h) || null; } catch (e) { return null; } };
const sansReact = (hub, h) => { const st = JSON.parse(JSON.stringify(hub)); try { const C = st.site['3e'].chapitres[0].seances[0].deroule_joue[CLASSE]; C.ecrans = (C.ecrans || []).filter(e => !(e && e.role === 'reactivation' && +e.heure === +h)); } catch (e) {} return st; };   /* la copie sans sa construite : une clôture d'avant §12.26 (clôture manquée, cas 7) */
const apercu = p => p.evaluate(() => { const vis = el => !!(el && el.getBoundingClientRect().height > 0); const mur = document.getElementById('mur'); return { ecranOn: document.getElementById('ecran-fin').classList.contains('on'), act: mur ? ((mur.querySelector('.act') || {}).textContent || '').trim() : '', lignes: mur ? Array.from(mur.querySelectorAll('li')).filter(vis).map(l => l.textContent.trim().slice(0, 40)) : [], heure: S.heure, lancee: S.lancee, close: S.close, vue: !!(window.DR_CL && DR_CL.reactVue), avant: typeof dr_reactAvantLancement === 'function' && dr_reactAvantLancement(), retour: vis(document.getElementById('react-retour')), mention: Array.from(document.querySelectorAll('.ta-version')).filter(vis).length, fleche: Array.from(document.querySelectorAll('[title^="Réafficher la version calculée"]')).filter(vis).length, mentionTableau: document.querySelectorAll('#mur2 .ta-version, #mur .ta-version').length, jDiapo: J.filter(x => x.type === 'diapo' && x.eid === 'react-h2-s0').length, jDev: J.filter(x => x.type === 'devoile' && x.eid === 'react-h2-s0').length, mur: S.mur ? (S.mur.di + '') : null, editable: mur ? mur.querySelectorAll('[contenteditable]').length : 0 }; });
const heuresDe = (hub, sk) => ((((hub.site['3e'].chapitres[0].seances[sk] || {}).deroule_joue || {})[CLASSE] || {}).heures) || {};
const CLE_H1 = '2026-09-07_08h57-09h52_3E_Charles_de_Gaulle';   /* la clé de l'heure 1 jouée au prélude (= celle du 07/09 de l'ancien slug) */
const TITRES = { faites: 'La dernière fois', reprendre: 'À reprendre', notions: 'Les notions', travail: 'Le travail' };   /* DR_REACT_TITRES d'E4 (§12.25-8 : proposés à Paul) ; le bouchon n'a que les deux premiers */
dire(''); dire('B18-0 — le prélude : l\'heure 1 de la séance jouée sous la clé actuelle de la classe (lundi 07/09, 08:57) — trois ▶, « Tableau 2 » décidé « à l\'heure suivante », close ; E4 lira ce paquet');
let hubH1 = null, voie = null;
{ const s = await session({ store: sansCopie(), quand: '2026-09-07T09:00:00+02:00' }); if (!s.integre) { pas('B18', 'absent', 'le site intégré'); await s.ctx.close(); }
  else { const p = s.page; voie = await brancher(p); dire('    (la construction jouée : ' + (voie === 'E4' ? 'la vraie fonction d\'E4, comptée' : 'le BOUCHON — la fonction d\'E4 manque dans le fichier joué') + ')');
    const t = await lancerParLaCase(s, '2026-09-07|08:57'); await clicTexte(p, '#edt-modale button', 'Ouvrir le pilotage et lancer'); await s.attendre(6000);
    const e0 = await ecranOuverture(p); const o0 = await ordreVu(p); await cap(p, 'B18-0-heure1');
    pas('B18', /heure 1\/3/.test(t || '') && !e0.on && o0.lancee && o0.h === 1 && !o0.nReact.length && o0.o[0] === 'Analyse d\'images : la routine' ? 'ok' : 'ÉCHEC', 'prélude : la case du lundi 07/09 dit « heure 1/3 » ; « Lancer » est direct (première séance : rien à réactiver, §12.25-2) ; l\'heure 1 s\'ouvre sur la première diapo, sans réactivation', JSON.stringify({ t, on: e0.on, h: o0.h, lancee: o0.lancee, calls: o0.calls, o: o0.o.slice(0, 3) }));
    await devoiler(s, 3); await s.attendre(1500);
    await p.evaluate(() => { const E = seance().ecrans; const e = E.find(x => x.act === 'Tableau 2'); if (e) { S.decisions[e.eid] = { choix: 'suivante', moment: 'fin', h: hhmm(), heure: S.heure, motif: '' }; journal('decision', { act: e.eid, choix: 'suivante' }); } });
    await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    hubH1 = await s.hub(); const hs = heuresDe(hubH1, '0'); const H1 = hs[CLE_H1] || null; const c23 = copieReact(hubH1, 2); const j23 = await p.evaluate(() => ({ diapo: J.filter(x => x.type === 'diapo' && x.eid === 'react-h2-s0').length, dev: J.filter(x => x.type === 'devoile' && x.eid === 'react-h2-s0').length, trame: (() => { try { const o = dr_derouleDe('0'); return (o.ecrans || []).filter(e => e && e.role === 'reactivation').length; } catch (e) { return -1; } })(), calls: window.__reactCalls }));
    pas('B23', c23 && c23.eid === 'react-h2-s0' && +c23.heure === 2 && (c23.blocs || []).length >= 1 && c23.construite && c23.construite.calculee && JSON.stringify(c23.construite.calculee.map(b => b.txt)) === JSON.stringify(c23.blocs.map(b => b.txt)) && c23.construite.depuis === CLE_H1 && j23.diapo === 0 && j23.dev === 0 ? 'ok' : 'ÉCHEC', 'la clôture de l\'heure 1 construit la diapo de l\'heure 2 et l\'écrit dans la copie de la classe (`C/ecrans` : `react-h2-s0`, rôle, heure 2, `construite.calculee` = ses blocs, `depuis` = la clé de l\'heure 1) ; rien au journal (ni « diapo » ni « devoile ») — §12.26 (1), (2)', JSON.stringify({ c: c23 ? { eid: c23.eid, heure: c23.heure, nb: (c23.blocs || []).length, calc: c23.construite && c23.construite.calculee ? c23.construite.calculee.length : null, depuis: c23.construite && c23.construite.depuis } : null, j: j23 }));
    pas('B23', j23.trame === 0 ? 'ok' : 'absent', 'la trame du chapitre (`dr_derouleDe`, ce que l\'Atelier écrirait) ne porte aucun écran de réactivation (§12.26-2 : jamais dans le déroulé de l\'Atelier — le filtre est à E1, A36)' + (j23.trame === 0 ? '' : ' — ABSENT : `dr_derouleDe` rend encore la construite (E1 pas encore poussé)'), 'écrans reactivation dans dr_derouleDe : ' + j23.trame);
    pas('B18', H1 && H1.clos && +H1.heure === 1 && (H1.activites || []).some(a => a.passages > 0) && (H1.decisionsParActivite || Object.keys(H1).length) ? 'ok' : 'ÉCHEC', 'prélude : au hub, le paquet de l\'heure 1 sous la clé actuelle (`' + CLE_H1 + '`) : close, `heure: 1`, des diapos vues (`passages`)', JSON.stringify({ cles: Object.keys(hs), clos: H1 && H1.clos, heure: H1 && H1.heure, vues: H1 && (H1.activites || []).filter(a => a.passages > 0).map(a => a.act), dec: H1 && Object.keys(H1.decisionsParActivite || {}).length }));
    pas('B18', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS (prélude)', s.errs.join(' ; ')); await s.ctx.close(); if (!H1) hubH1 = null; } }

dire(''); dire('B18 — « Ouvrir par la réactivation » oui : l\'heure 2 s\'ouvre sur la diapo construite par E4 depuis l\'heure 1 jouée, en tête, dévoilée avec ▶, dans la copie de la classe, hors des activités');
let hubB18 = null;
{ if (!hubH1) pas('B18', 'absent', 'le prélude n\'a pas joué');
  else { const s = await session({ store: hubH1 }); const p = s.page; await brancher(p); await ouvertureParLaCase(s);
    const e1 = await ecranOuverture(p); await cap(p, 'B18-ouverture'); const depuisCle = voie === 'E4' ? CLE_H1 : 'bouchon-h1';
    const c0 = await p.evaluate(() => window.__reactCalls);
    pas('B18', e1.on && e1.oui && e1.ouiCoche && !e1.desact && e1.reg === 'oui' && /Lancer ouvre l'heure 2 sur la réactivation/.test(e1.txt) && e1.txt.indexOf(depuisCle) >= 0 && (!e1.lancee || e1.close) && (voie !== 'E4' || c0 === 0) ? 'ok' : 'ÉCHEC', 'l\'écran « Où en est la classe » paraît (heure 2, l\'heure 1 close au hub : l\'état relu est le sien, close), « oui » proposé (défaut, §12.25-1), le réglage de la séance « oui », l\'ouverture annonce la réactivation construite depuis l\'heure 1 (sa clé) — relue de la copie, AUCUN appel à E4 (§12.26 : construite à la clôture) ; l\'heure 2 n\'est pas lancée', JSON.stringify({ on: e1.on, oui: e1.oui, ouiCoche: e1.ouiCoche, desact: e1.desact, reg: e1.reg, lancee: e1.lancee, close: e1.close, calls: c0, txt: e1.txt.slice(0, 260) }));
    /* B24 · voir sans lancer (§12.26-3) */
    const n24 = (await s.ecrits()).length; const murAvant = (await apercu(p)).mur; const puce = await p.evaluate(() => { const el = document.getElementById('o-react-voir'); if (!el || !el.offsetParent) return false; el.click(); return true; }); await s.attendre(1200); let a = await apercu(p); await cap(p, 'B24-apercu');
    pas('B24', puce && !a.ecranOn && /Où en sommes-nous/.test(a.act) && a.lignes.length >= 1 && a.heure === 1 && a.close && a.vue && a.avant && a.retour && a.mention === 0 && a.jDiapo === 0 && a.jDev === 0 && a.mur === murAvant && (await s.ecrits()).length === n24 ? 'ok' : 'ÉCHEC', 'la puce « 1. Où en sommes-nous ? » ouvre la diapo construite dans le pilote (#mur : son titre, ses lignes, toutes), sans lancer (l\'heure 1 reste close, rien n\'est poussé au tableau, rien au journal, zéro écriture) ; « ↶ Où en est la classe » dans l\'entête ; `dr_reactAvantLancement()` vrai (le geste d\'E1 s\'arme dessus) ; pas de mention « ta version »', JSON.stringify(a));
    /* B25 · la modification de Paul s'écrit dans la copie ; « ta version » + ↩ au pilotage, jamais au tableau (§12.26-4, -5) */
    const NEUF = 'Ligne changée par Paul (banc E2 §12.26)'; const geste = await p.evaluate(txt => { const mur = document.getElementById('mur'); const z = Array.from(mur.querySelectorAll('li [contenteditable], li[contenteditable]')).filter(x => x.getBoundingClientRect().height > 0)[0]; if (z) { z.focus(); z.textContent = txt; z.dispatchEvent(new Event('input', { bubbles: true })); z.blur(); z.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); return 'E1'; } const e = seance().ecrans.find(x => x.eid === 'react-h2-s0'); if (!e || !e.blocs[0] || !e.blocs[0].el) return 'absent'; const l = e.blocs[0].el[0]; if (typeof l === 'string') e.blocs[0].el[0] = txt; else l.txt = txt; dr_reactModifiee(); return 'simulé'; }, NEUF); await s.attendre(2500); a = await apercu(p); const h25 = await s.hub(); const c25 = copieReact(h25, 2); const e25 = depuis(await s.ecrits(), n24); await cap(p, 'B25-ta-version');
    dire('    (le geste d\'écriture : ' + (geste === 'E1' ? 'celui du socle (E1), une ligne contenteditable au pilote' : geste === 'simulé' ? 'SIMULÉ — le geste d\'E1 n\'est pas armé au pilote avant le lancement : la ligne est changée dans le bloc et dr_reactModifiee() appelée' : geste) + ')');
    pas('B25', geste !== 'absent' && c25 && JSON.stringify(c25.blocs).indexOf(NEUF) >= 0 && a.mention >= 1 && a.fleche >= 1 && a.mentionTableau === 0 && a.jDiapo === 0 && a.jDev === 0 && a.mur === murAvant && e25.length >= 1 && e25.every(x => /\/deroule_joue\/3E Charles de Gaulle\/ecrans$/.test(x)) && (await p.evaluate(() => JSON.stringify(Array.from(document.getElementById('mur').querySelectorAll('li')).map(l => l.textContent)))).indexOf(NEUF) >= 0 ? 'ok' : 'ÉCHEC', 'une ligne changée : la copie de la classe la porte (`C/ecrans`, même eid — la seule écriture), « ta version » et ↩ paraissent dans l\'entête du pilote, jamais au tableau (rien n\'est poussé) ; le pilote montre la ligne changée', JSON.stringify({ geste, porte: !!(c25 && JSON.stringify(c25.blocs).indexOf(NEUF) >= 0), a, ecr: e25 }));
    /* B26 · ↩ : la version calculée revient, la copie est réécrite, la mention tombe (§12.26-5) */
    const fl = await p.evaluate(() => { const b = document.getElementById('react-calculee'); if (!b) return false; b.click(); return true; }); await s.attendre(2500); a = await apercu(p); const h26 = await s.hub(); const c26 = copieReact(h26, 2);
    pas('B26', fl && c26 && JSON.stringify(c26.blocs).indexOf(NEUF) < 0 && JSON.stringify(c26.blocs.map(b => [b.txt, b.el])) === JSON.stringify((c26.construite.calculee || []).map(b => [b.txt, b.el])) && a.mention === 0 && a.fleche === 0 && a.jDiapo === 0 ? 'ok' : 'ÉCHEC', '↩ réaffiche la version calculée (les blocs = `construite.calculee`, sans recalcul), la copie est réécrite, la mention tombe', JSON.stringify({ fl, a: { mention: a.mention, fleche: a.fleche, lignes: a.lignes.slice(0, 3) }, porte: !!(c26 && JSON.stringify(c26.blocs).indexOf(NEUF) >= 0) }));
    /* la modification refaite, puis le retour à l'écran d'ouverture : le lancement ouvre sur SA version */
    await p.evaluate(txt => { const e = seance().ecrans.find(x => x.eid === 'react-h2-s0'); const l = e.blocs[0].el[0]; if (typeof l === 'string') e.blocs[0].el[0] = txt; else l.txt = txt; dr_reactModifiee(); }, NEUF); await s.attendre(1500);
    const ret = await p.evaluate(() => { const b = document.getElementById('react-retour'); if (!b) return false; b.click(); return true; }); await s.attendre(800); const e2 = await ecranOuverture(p); a = await apercu(p);
    pas('B24', ret && e2.on && e2.oui && e2.ouiCoche && /ta version/.test(e2.txt) && !a.vue && !a.avant ? 'ok' : 'ÉCHEC', '« ↶ Où en est la classe » : l\'écran d\'ouverture revient (« oui » toujours proposé, il dit « ta version »), l\'aperçu est fermé', JSON.stringify({ ret, on: e2.on, ouiCoche: e2.ouiCoche, vue: a.vue, txt: e2.txt.slice(0, 200) }));
    await p.click('#o-lancer'); await s.attendre(4000); const o = await ordreVu(p); await cap(p, 'B18-lancee'); const bl = await blocsDe(p, 'react-h2-s0'); const lv = await p.evaluate(() => { const e = seance().ecrans.find(x => x.eid === 'react-h2-s0'); const l = e && e.blocs[0] && e.blocs[0].el ? e.blocs[0].el[0] : null; return typeof l === 'string' ? l : (l && l.txt) || null; }); const jm = await p.evaluate(() => { const x = J.filter(y => y.type === 'reactivation').pop(); return x ? !!x.modifiee : null; });
    pas('B18', o.h === 2 && o.lancee && o.o[0] === 'Où en sommes-nous ?[reactivation]' && o.eid0 === 'react-h2-s0' && o.di === 'Où en sommes-nous ?' && o.o.length > 1 && !/\[/.test(o.o[1]) && o.nReact.join() === 'react-h2-s0@2' && (voie !== 'E4' || o.calls === 0) && o.J[o.J.length - 1] === '2:oui:react-h2-s0' && o.choix[2] === 'oui' && lv === NEUF && jm === true ? 'ok' : 'ÉCHEC', 'lancée : la construite (`react-h2-s0`, rôle reactivation, heure 2) est la première diapo de l\'heure et au tableau, puis le programme ; aucun appel à E4 (relue de la copie) ; c\'est SA version qui s\'ouvre (la ligne changée), le journal le dit (« reactivation », modifiee) ; le choix au journal et dans S.reactChoix', JSON.stringify({ o, lv, jm }));
    const l1 = await p.evaluate(() => { const e = seance().ecrans.find(x => x.eid === 'react-h2-s0'); return e && e.blocs && e.blocs[0] && e.blocs[0].el ? String(e.blocs[0].el[0] || '') : ''; });
    const l1c = await p.evaluate(() => { const e = seance().ecrans.find(x => x.eid === 'react-h2-s0'); const c = e && e.construite && e.construite.calculee && e.construite.calculee[0] ? e.construite.calculee[0].el[0] : ''; return typeof c === 'string' ? c : (c && c.txt) || ''; });
    pas('B18', (voie === 'E4' ? (bl && bl.startsWith(TITRES.faites + ':1|') && /Analyse d'images/.test(l1c) && !/Tableau/.test(l1c)) : bl === 'La dernière fois:2|Les notions:1') ? 'ok' : 'ÉCHEC', 'le contenu calculé est celui d\'E4 depuis l\'heure 1 jouée : « ' + TITRES.faites + ' » en premier bloc, une ligne — la seule diapo vue à l\'heure 1 (« Analyse d\'images »), rien d\'inventé (§12.22 b) ; puis les notions et le travail (la ligne montrée est celle de Paul)', JSON.stringify({ blocs: bl, l1, l1c }));
    const rep = new RegExp('(^|\\|)' + TITRES.reprendre + ':1(\\||$)').test(bl || '');
    pas('B18', rep ? 'ok' : 'absent', '« ' + TITRES.reprendre + ' » : « Tableau 2 », décidé « à l\'heure suivante » à la fin de l\'heure 1 (§12.22 b : ce qui a été décidé)' + (rep ? '' : ' — ABSENT du contenu d\'E4 : sur une trame sans activités déclarées, la décision est dans `decisionsParEcran` (par eid) du paquet, et `dr_reactivationConstruire` ne lit que `decisionsParActivite` (à E4, signalé au JOURNAL) ; l\'heure 2 la joue bien en premier (b1)'), JSON.stringify({ blocs: bl }));
    await devoiler(s, 2); await s.attendre(2500);
    const d = await p.evaluate(() => ({ dev: J.filter(x => x.type === 'devoile').slice(-2).map(x => x.eid), mur: (document.getElementById('mur').innerText || '').replace(/\s+/g, ' ').slice(0, 200), lignes: Array.from(document.querySelectorAll('.dur-in[data-a="react-h2-s0"]')).map(i => (i.closest('.dur-l').querySelector('.dur-t') || {}).textContent.trim()) }));
    pas('B18', d.dev.join() === 'react-h2-s0,react-h2-s0' && d.mur.indexOf(TITRES.faites) >= 0 && d.mur.indexOf('Ligne changée par Paul') >= 0 && d.lignes.length === 1 && /^↺/.test(d.lignes[0]) ? 'ok' : 'ÉCHEC', '▶ dévoile la construite élément par élément (journal `devoile` à son eid), ses lignes au tableau (« ' + TITRES.faites + ' », puis la ligne de Paul) ; « Où on en est » la liste sans numéro d\'activité (RC15)', JSON.stringify(d));
    const nums = await p.evaluate(() => Array.from(document.querySelectorAll('.dur-t')).map(x => x.textContent.trim()).filter(x => !/^↺/.test(x)).map(x => (/^A(\d+)/.exec(x) || [])[1]).filter(Boolean));
    pas('B18', nums.length > 2 && nums.every((n, k) => +n === k + 1) ? 'ok' : 'ÉCHEC', '« Où on en est » : les activités de l\'heure sont numérotées 1, 2, 3… après la ligne « ↺ » — la construite ne prend pas de numéro (RC15 ; relecteur neuf n°3, 3)', nums.join(','));
    for (let k = 0; k < 12 && (await p.evaluate(() => (seance().ecrans[S.di] || {}).eid === 'react-h2-s0')); k++) { await p.click('#bdev'); await s.attendre(150); }   /* jusqu'à la diapo suivante : l'heure 2 a joué une activité (B20 : l'heure 3 aura quelque chose à réactiver) */
    await s.attendre(1500); const d2 = await p.evaluate(() => (seance().ecrans[S.di] || {}).act);
    hubB18 = await s.hub(); const C = ((((hubB18.site['3e'].chapitres[0].seances[0] || {}).deroule_joue || {})[CLASSE]) || {}); const ec = C.ecrans || []; const r = ec.filter(e => e.role === 'reactivation'); const Hh = H(hubB18, '0') || {}; const pa = Hh.parActivite || []; const acts = Array.isArray(Hh.activites) ? Hh.activites : [];
    pas('B18', r.length === 1 && r[0].eid === 'react-h2-s0' && +r[0].heure === 2 && (r[0].blocs || []).length >= 2 && r[0].construite && r[0].construite.depuis === depuisCle && !(Array.isArray(pa) ? pa : Object.values(pa)).some(a => /sommes/.test(a.titre || '')) && d2 && d2 !== 'Où en sommes-nous ?' ? 'ok' : 'ÉCHEC', 'la copie de la classe (`C/ecrans`) porte la construite telle quelle (eid, heure, ses blocs, `construite.depuis` = la clé de l\'heure 1), figée (§12.22 d) ; le paquet ne la compte pas dans `parActivite[]` ; ▶ au bout de la construite passe au programme', JSON.stringify({ r: r.map(x => ({ eid: x.eid, heure: x.heure, nb: (x.blocs || []).length, c: x.construite })), pa: (Array.isArray(pa) ? pa : Object.values(pa)).map(a => a.titre), ecrans: acts.map(a => a.eid).filter(x => /react/.test(x)), apres: d2 }));
    pas('B18', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); await s.ctx.close(); } }

dire(''); dire('B20 — construite une fois : la reprise la relit de la copie (même eid, même contenu), jamais une seconde ; l\'heure 3 a la sienne (depuis l\'heure 2 jouée), celle de l\'heure 2 reste');
{ if (!hubB18) pas('B20', 'absent', 'B18 n\'a pas joué');
  else { const s = await session({ store: hubB18 }); const p = s.page; await brancher(p); await lancerParLaCase(s); await clicTexte(p, '#edt-modale button', 'Reprendre le cours'); await s.attendre(9000); const modale = await p.evaluate(() => { const m = document.getElementById('at-modale'); const txt = m ? (m.innerText || '').replace(/\s+/g, ' ').slice(0, 200) : ''; if (m) { const b = m.querySelector('button'); if (b) b.click(); } return txt; }); await s.attendre(500);
    const o = await ordreVu(p); dire('    (modale après la reprise : ' + (modale || 'aucune') + ')'); const bl = await blocsDe(p, 'react-h2-s0'); const blAvant = await p.evaluate(() => { const C = ((window.__HUB.site['3e'].chapitres[0].seances[0].deroule_joue || {})['3E Charles de Gaulle']) || {}; const e = (C.ecrans || []).find(x => x.eid === 'react-h2-s0'); return e ? (e.blocs || []).map(b => (b.txt || '') + ':' + (b.el || []).length).join('|') : null; });
    pas('B20', o.h === 2 && o.lancee && o.nReact.join() === 'react-h2-s0@2' && /^Où en sommes-nous \?\[reactivation\]$/.test(o.o[0]) && bl && bl === blAvant && o.calls === 0 ? 'ok' : 'ÉCHEC', 'recharger puis « Reprendre le cours » : la construite revient de `C/ecrans` (même eid, mêmes blocs que la copie au hub), première de l\'heure 2, sans aucun appel à la construction', JSON.stringify({ o, bl, blAvant }));
    await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    const hub2 = await s.hub(); pas('B20', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS (reprise, clôture)', s.errs.join(' ; ')); await s.ctx.close();
    const s3 = await session({ store: hub2, quand: '2026-09-15T15:08:00+02:00' }); const p3 = s3.page; await brancher(p3); await ouvertureParLaCase(s3, '2026-09-15|15:07');
    const e3 = await ecranOuverture(p3); await cap(p3, 'B20-ouverture-h3'); const cle2 = Object.keys(heuresDe(hub2, '0')).find(x => x.startsWith('2026-09-14')) || '';
    pas('B20', e3.on && e3.oui && e3.ouiCoche && !e3.desact && /Lancer ouvre l'heure 3 sur la réactivation/.test(e3.txt) && (voie !== 'E4' || e3.txt.indexOf(cle2) >= 0) ? 'ok' : 'ÉCHEC', 'l\'heure 3 (état au hub) : l\'écran « Où en est la classe » entier porte le bouton, « oui » proposé, l\'ouverture annonce la réactivation construite depuis l\'heure 2 (sa clé)', JSON.stringify({ on: e3.on, oui: e3.oui, ouiCoche: e3.ouiCoche, cle2, txt: e3.txt.slice(0, 200) }));
    if (e3.on) { await p3.click('#o-lancer'); await s3.attendre(4000); }
    const o3 = await ordreVu(p3); const bl3 = await blocsDe(p3, 'react-h3-s0');
    const c3 = copieReact(hub2, 3);
    pas('B20', o3.h === 3 && o3.lancee && o3.eid0 === 'react-h3-s0' && o3.nReact.slice().sort().join() === 'react-h2-s0@2,react-h3-s0@3' && (voie !== 'E4' || o3.calls === 0) && bl3 && bl3.startsWith(TITRES.faites + ':') && c3 && c3.eid === 'react-h3-s0' ? 'ok' : 'ÉCHEC', 'l\'heure 3 s\'ouvre sur SA construite (`react-h3-s0`, « ' + TITRES.faites + ' » depuis l\'heure 2 — construite à la clôture de l\'heure 2, dans la copie avant l\'ouverture, zéro appel à l\'ouverture), celle de l\'heure 2 reste à l\'heure 2', JSON.stringify({ o3, bl3, c3: !!c3 }));
    pas('B20', !s3.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s3.errs.join(' ; ')); await s3.ctx.close(); } }

dire(''); dire('B19 / B21 — « non » : l\'heure s\'ouvre sur le programme, rien de construit ni d\'écrit ; le réglage de la séance (`B/deroule/reactivation`) est proposé à l\'heure suivante ; mode test étanche');
{ if (!hubH1) pas('B19', 'absent', 'le prélude n\'a pas joué');
  else { const s = await session({ store: hubH1 }); const p = s.page; await brancher(p); await ouvertureParLaCase(s); const n0 = (await s.ecrits()).length;
    await p.click('#o-react-non'); await s.attendre(400); const e1 = await ecranOuverture(p);
    pas('B19', e1.on && e1.nonCoche && !e1.ouiCoche && /Lancer ouvre l'heure 2 sur « Tableau 2 »/.test(e1.txt) && !/sur la réactivation/.test(e1.txt) ? 'ok' : 'ÉCHEC', '« non » coché : l\'ouverture annonce le programme — « Tableau 2 », décidé « à l\'heure suivante » à l\'heure 1 (b1, §12.17) —, plus la réactivation', JSON.stringify({ nonCoche: e1.nonCoche, txt: e1.txt.slice(0, 260) }));
    await p.selectOption('#o-react-reg', 'non'); await s.attendre(1200); const e2 = await ecranOuverture(p); const ecr = depuis(await s.ecrits(), n0);
    pas('B21', e2.reg === 'non' && ecr.length === 1 && /\/seances\/0\/deroule\/reactivation$/.test(ecr[0]) ? 'ok' : 'ÉCHEC', 'le réglage de la séance « non » : une seule écriture, `B/deroule/reactivation` (K15), rien d\'autre', JSON.stringify({ reg: e2.reg, ecr }));
    await p.click('#o-lancer'); await s.attendre(4000); const o = await ordreVu(p);
    pas('B19', o.h === 2 && o.lancee && o.o[0] === 'Tableau 2' && !o.nReact.length && o.J[o.J.length - 1] === '2:non:null' && o.choix[2] === 'non' ? 'ok' : 'ÉCHEC', 'lancée avec « non » : l\'heure 2 s\'ouvre sur « Tableau 2 » (ce qui glisse), aucune réactivation dans la trame jouée, le choix « non » au journal et dans S.reactChoix', JSON.stringify(o));
    const hub = await s.hub(); const sce = hub.site['3e'].chapitres[0].seances[0]; const C = (((sce.deroule_joue || {})[CLASSE]) || {}); const r = (C.ecrans || []).filter(e => e.role === 'reactivation');
    pas('B19', !r.length && (sce.deroule || {}).reactivation === 'non' ? 'ok' : 'ÉCHEC', 'au hub : aucune réactivation dans `C/ecrans` ; `B/deroule/reactivation` = « non »', JSON.stringify({ r: r.length, reg: (sce.deroule || {}).reactivation }));
    pas('B19', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); await devoiler(s, 2); await s.attendre(1000); await p.click('#dr-clore'); await s.attendre(400); await p.click('#f-clore'); await s.attendre(300); if (await p.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await p.click('#gclore-oui'); await s.attendre(2500);
    const hubC = await s.hub(); await s.ctx.close();   /* l'heure 2 close : l'heure 3 (mardi 15/09) a quelque chose à réactiver — le réglage « non » doit l'emporter sur le défaut */
    const s2 = await session({ store: hubC, quand: '2026-09-15T15:08:00+02:00' }); const p2 = s2.page; await brancher(p2); await ouvertureParLaCase(s2, '2026-09-15|15:07'); const e3 = await ecranOuverture(p2);
    pas('B21', e3.on && e3.oui && !e3.desact && e3.nonCoche && !e3.ouiCoche && e3.reg === 'non' && /Lancer ouvre l'heure 3 sur « /.test(e3.txt) && !/sur la réactivation/.test(e3.txt) ? 'ok' : 'ÉCHEC', 'l\'heure suivante (quelque chose à réactiver, le bouton actif) : le réglage « non » de la séance est la réponse proposée (relu de la trame), l\'ouverture annonce le programme', JSON.stringify({ on: e3.on, oui: e3.oui, desact: e3.desact, nonCoche: e3.nonCoche, reg: e3.reg, txt: e3.txt.slice(0, 220) }));
    await p2.selectOption('#o-react-reg', 'oui'); await s2.attendre(600); const e4 = await ecranOuverture(p2);
    pas('B21', e4.ouiCoche && e4.reg === 'oui' && /sur la réactivation/.test(e4.txt) ? 'ok' : 'ÉCHEC', 'le réglage remis à « oui » : la proposition suit (le choix de l\'heure n\'avait pas été fait à la main), l\'ouverture annonce la réactivation', JSON.stringify({ ouiCoche: e4.ouiCoche, reg: e4.reg }));
    pas('B21', !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s2.errs.join(' ; ')); await s2.ctx.close();
    const st = await session({ store: hubH1 }); if (st.integre) { const pt = st.page; await pt.evaluate(() => { M8_TEST = true; }); await brancher(pt); const nt = (await st.ecrits()).length; await ouvertureParLaCase(st); await pt.selectOption('#o-react-reg', 'non'); await st.attendre(800); await pt.click('#o-lancer'); await st.attendre(4000);
      const ot = await ordreVu(pt); const ect = depuis(await st.ecrits(), nt); const mt = await pt.evaluate(() => (M8_TEST_STORE || {})['/site/3e/chapitres/0/seances/0/deroule/reactivation']);
      pas('B21', ot.lancee && ot.h === 2 && ect.length === 0 && mt === 'non' ? 'ok' : 'ÉCHEC', 'mode test : le réglage va au magasin de test, zéro écriture au hub ; l\'heure se lance', JSON.stringify({ h: ot.h, lancee: ot.lancee, ecr: ect, mt }));
      await devoiler(st, 2); await st.attendre(1000); await pt.click('#dr-clore'); await st.attendre(400); await pt.click('#f-clore'); await st.attendre(300); if (await pt.evaluate(() => document.getElementById('garde-clore').classList.contains('on'))) await pt.click('#gclore-oui'); await st.attendre(2500);
      const m3 = await pt.evaluate(() => { const st = M8_TEST_STORE || {}; const k = Object.keys(st).find(x => /\/deroule_joue\/3E Charles de Gaulle\/ecrans$/.test(x)); const E = k ? st[k] : null; const r = Array.isArray(E) ? E.find(e => e && e.role === 'reactivation' && +e.heure === 3) : null; return { k: !!k, r: r ? { eid: r.eid, calc: !!(r.construite && r.construite.calculee) } : null, enMemoire: !!dr_reactEcran(3) }; }); const ect2 = depuis(await st.ecrits(), nt);
      pas('B23', m3.r && m3.r.eid === 'react-h3-s0' && m3.r.calc && m3.enMemoire && ect2.length === 0 ? 'ok' : 'ÉCHEC', 'mode test, l\'heure 2 close : la diapo de l\'heure 3 est construite depuis le paquet local (E4, poussée 102 : le hub ne le portera jamais en mode test) et la copie va au magasin de test, zéro écriture au hub', JSON.stringify({ m3, ecr: ect2 })); }
    await st.ctx.close(); } }

dire(''); dire('B22 — rien à réactiver (la construction rend null, ou n\'est pas dans le site) : « Lancer » reste direct, aucune réactivation');
{ const s = await session(); if (!s.integre) { pas('B22', 'absent', 'le site intégré'); await s.ctx.close(); }
  else { const p = s.page; const v = await reelle(p); if (v) await compteur(p); else await bouchon(p, true); await ouvertureParLaCase(s); const e1 = await ecranOuverture(p); const o = await ordreVu(p); const raison = await p.evaluate(() => (window.DR_CL && DR_CL.react && DR_CL.react.raison[2]) || null);
    pas('B22', !e1.on && o.lancee && o.h === 2 && o.o[0] === 'Tableau 3' && !o.nReact.length && o.calls === 1 ? 'ok' : 'ÉCHEC', (v ? 'le faux hub tel quel (l\'heure du 07/09 sous l\'ancien slug seulement) : la vraie fonction d\'E4 rend null (rien de joué sous la clé de la classe)' : 'la construction rend null') + ' : pas d\'écran d\'ouverture, l\'heure 2 est lancée directement sur « Tableau 3 », sans réactivation (§12.25-2) — le parcours P5 de la conscience ne change pas', JSON.stringify({ on: e1.on, raison, o }));
    pas('B22', !s.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s.errs.join(' ; ')); await s.ctx.close();
    const s2 = await session(); const p2 = s2.page; await absence(p2); await ouvertureParLaCase(s2); const e2 = await ecranOuverture(p2); const o2 = await ordreVu(p2);
    pas('B22', !e2.on && o2.lancee && o2.h === 2 && !o2.nReact.length ? 'ok' : 'ÉCHEC', 'sans la fonction de construction dans le site (retirée pour le pas ; le faux hub tel quel, sans état) : « Lancer » direct, comme avant', JSON.stringify({ on: e2.on, h: o2.h, lancee: o2.lancee, o: o2.o.slice(0, 2) }));
    pas('B22', !s2.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s2.errs.join(' ; ')); await s2.ctx.close();
    if (hubH1) { const s3 = await session({ store: sansReact(hubH1, 2) }); const p3 = s3.page; await absence(p3); await ouvertureParLaCase(s3); const e3 = await ecranOuverture(p3);
      pas('B22', e3.on && e3.oui && e3.desact && /pas encore dans le site/.test(e3.txt) && !/sur la réactivation/.test(e3.txt) ? 'ok' : 'ÉCHEC', 'sans la fonction, l\'heure 1 close au hub sans construite dans la copie (clôture d\'avant §12.26) : l\'écran « Où en est la classe » entier (l\'état relu) porte le bouton grisé avec la raison (contrat §8.6), l\'ouverture annonce le programme', JSON.stringify({ on: e3.on, oui: e3.oui, desact: e3.desact, txt: e3.txt.slice(0, 300) }));
      await p3.click('#o-lancer'); await s3.attendre(4000); const o3 = await ordreVu(p3);
      pas('B22', o3.lancee && o3.h === 2 && o3.o[0] === 'Tableau 2' && !o3.nReact.length && o3.J[o3.J.length - 1] === '2:non:null' ? 'ok' : 'ÉCHEC', '« Lancer l\'heure 2 » : l\'heure s\'ouvre sur ce qui glisse (« Tableau 2 »), sans réactivation, le choix « non » au journal', JSON.stringify({ h: o3.h, lancee: o3.lancee, o: o3.o.slice(0, 3), J: o3.J }));
      pas('B22', !s3.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s3.errs.join(' ; ')); await s3.ctx.close();
      /* (7) la clôture manquée : la copie sans construite, la vraie fonction → construite à l'ouverture de l'écran, écrite dans la copie avant le lancement */
      const s4 = await session({ store: sansReact(hubH1, 2) }); const p4 = s4.page; const v4 = await brancher(p4); const n4 = (await s4.ecrits()).length; await ouvertureParLaCase(s4); const e4 = await ecranOuverture(p4); const h4 = await s4.hub(); const c4 = copieReact(h4, 2); const ecr4 = depuis(await s4.ecrits(), n4); const calls4 = await p4.evaluate(() => window.__reactCalls);
      pas('B23', e4.on && e4.oui && !e4.desact && /sur la réactivation/.test(e4.txt) && c4 && c4.eid === 'react-h2-s0' && c4.construite && c4.construite.calculee && ecr4.some(x => /\/ecrans$/.test(x)) && (v4 !== 'E4' || calls4 === 1) ? 'ok' : 'ÉCHEC', 'clôture manquée (§12.26-7 : la copie sans construite) : à l\'ouverture de l\'écran, la diapo est construite (un appel) et écrite dans la copie (`C/ecrans`, `calculee`) avant le lancement ; le bouton est actif, l\'ouverture annonce la réactivation', JSON.stringify({ on: e4.on, desact: e4.desact, c4: !!c4, ecr: ecr4, calls: calls4 }));
      pas('B23', !s4.errs.length ? 'ok' : 'ÉCHEC', 'aucune erreur JS', s4.errs.join(' ; ')); await s4.ctx.close(); } } }

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
