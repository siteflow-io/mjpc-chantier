// C16 639 · MANDAT N (N-AUDIT-UNE-AUTRE-SEANCE.md) — mesure seule, aucune ligne du site ne change.
// Le vrai code de l'assemblé (edtProjeter, edtSeanceEtat, edtSeanceJouee, edtFileDAttente, dr_ouvTerminee, dr_reactivationCheminAvant…) est appelé
// dans la page, SANS AUCUN RÉSEAU (toute requête hors file:// est coupée : ni le vrai hub, ni la production). La classe est inventée (« 5 ESSAI »),
// le chapitre aussi (5 séances) ; seuls la grille (3 cases par semaine), l'heure du jour et le contexte du pilote (dr_chapitre, dr_cles, dr_ctx) sont posés
// à la main. Ce n'est PAS la preuve par le geste (aucun clic) : c'est la lecture, par le code réel, des traces qu'un lancement écrit.
// usage : node sonde-autre-seance.mjs <assemblé index.html> <sortie.txt>
import fs from 'fs'; import { createRequire } from 'module';
const req = createRequire(import.meta.url); const pw = req('/opt/node22/lib/node_modules/playwright');
const [, , FICHIER, OUT] = process.argv; const L = []; const dire = s => { L.push(s); console.log(s); };
const b = await pw.chromium.launch(); const pg = await (await b.newContext()).newPage();
let coupees = 0; await pg.route('**/*', r => { if (r.request().url().startsWith('file:')) return r.continue(); coupees++; return r.abort(); });
await pg.goto('file://' + FICHIER, { waitUntil: 'domcontentloaded' }).catch(e => dire('goto : ' + e.message));
await pg.waitForTimeout(1500);
const res = await pg.evaluate(() => {
  const out = []; const W = window; const NOM = '5 ESSAI', SL = '5_essai', CR = '08:00-09:00';
  W.EDT_CLASSES = { [SL]: { nom: NOM, niveau: '5e' } }; W.EDT = W.EDT || {}; W.EDT.decisions = {};
  W.isPubFor = () => true; W.edtJourSansCours = () => null; W.edtHorsAnnee = () => null;
  let AUJ = '2026-11-09', HC = '07:00'; W.edtAujourdhui = () => AUJ; W.edtHeureCourante = () => HC;
  W.edtCasesDuJour = iso => { const j = W.edtNomDuJour(iso); return ['lundi', 'mardi', 'jeudi'].includes(j) ? [{ jour: j, creneau: CR, semaine: 'AB', classe: NOM, classeMjpc: NOM, mjpc: true }] : []; };
  const seance = (i, deuxHeures) => ({ __i: String(i), ordre: i, title: 'Séance ' + i, deroule: { ecrans: deuxHeures ? [{ dur: 40, heure: 1 }, { dur: 40, heure: 2 }] : [{ dur: 40 }] } });
  const poser = (sep4) => { const S = {}; for (let i = 1; i <= 5; i++) S[i] = seance(i, i === 4 && sep4); W.EDT_CHAP = { '5e': [{ __cle: '0', title: 'Chapitre essai', seances: S }] }; return S; };
  const jouer = (S, i, iso, h, reporte) => { const k = W.edtClesHeureTrace(iso, CR, NOM)[0]; const se = S[i]; se.deroule_joue = se.deroule_joue || {}; const p = se.deroule_joue[SL] = se.deroule_joue[SL] || { classe: NOM, heures: {} };
    p.heures[k] = { heure: h, clos: true, activites: [{ eid: 'e1' }], decisionsParEcran: reporte ? { e1: { choix: 'reporter', heure: h } } : {} }; return k; };
  const proj = () => { const c = W.edtProjeter(AUJ, 12); return Object.keys(c).sort().map(k => { const x = c[k]; return x.iso.slice(5) + ' ' + x.nature + (x.titre ? ' « ' + x.titre + ' »' : '') + (x.heure ? ' h' + x.heure + '/' + x.sur : '') + (x.suite ? ' suite(reste ' + x.reste + ')' : '') + (x.pasFinie ? ' pasFinie' : '') + (x.rat ? ' rattraper « ' + x.rat.titre + ' »' : ''); }); };
  const lecteurs = (S) => { const cl = { nom: NOM, slug: SL }; const r = {};
    r.seanceFinie = [1, 2, 3, 4, 5].map(i => i + ':' + W.edtSeanceJouee(S[i], NOM)).join(' ');
    r.etat4 = JSON.stringify(W.edtSeanceEtat(S[4], NOM));
    const f = W.edtFileDAttente(NOM, null); r.file = f ? f.seances.map(s => s.__i).join(',') + ' faites(tête)=' + f.faites : 'null';
    try { r.parcoursFaite = [1, 2, 3, 4, 5].map(i => i + ':' + W.dr_ouvTerminee(S[i], cl)).join(' '); } catch (e) { r.parcoursFaite = 'ERR ' + e.message; }
    try { r.heuresJouees = [1, 2, 3, 4, 5].map(i => i + ':' + W.dr_ouvHeuresJouees(S[i], cl)).join(' '); } catch (e) { r.heuresJouees = 'ERR ' + e.message; }
    try { const ch = W.EDT_CHAP['5e'][0]; W.dr_chapitre = () => ch; W.dr_cles = () => Object.keys(ch.seances); W.dr_cheminBDe = sk => 'B(séance ' + sk + ')';
      r.ouEnSommesNous = [1, 2, 4, 5].map(i => { W.dr_ctx = () => ({ snum: String(i), classeSlug: SL }); return i + '←' + W.dr_reactivationCheminAvant(); }).join(' · '); } catch (e) { r.ouEnSommesNous = 'ERR ' + e.message; }
    try { W.dr_seance = sk => S[sk]; r.relectureClasses = [1, 4].map(i => { W.dr_recitSnum = () => String(i); return i + ':' + JSON.stringify((W.dr_recitClassesJouees() || []).map(x => x.slug)); }).join(' '); } catch (e) { r.relectureClasses = 'ERR ' + e.message; }
    try { W.EDT.charge = true; W.dr_nomClasse = () => NOM; r.echeanceProposee = JSON.stringify(W.edtProchainesDe(SL, 3)).slice(0, 220); } catch (e) { r.echeanceProposee = 'ERR ' + e.message; }
    return r; };
  const etat = (nom, S) => { out.push('— ' + nom + ' (aujourd’hui ' + AUJ + ' ' + HC + ')'); proj().forEach(l => out.push('   case ' + l)); const r = lecteurs(S); Object.keys(r).forEach(k => out.push('   ' + k + ' : ' + r[k])); };
  let S = poser(false); etat('E0 · base, rien de joué', S);
  jouer(S, 4, '2026-11-09', 1); HC = '10:00'; etat('E1 · lundi 09 : la séance 4 jouée dans la case de la séance 1', S);
  AUJ = '2026-11-10'; HC = '10:00'; etat('E1b · mardi 10 passé sans heure jouée', S);
  jouer(S, 1, '2026-11-10', 1); etat('E2 · mardi 10 : la séance 1 jouée à la fois suivante', S);
  AUJ = '2026-11-09'; HC = '10:00'; S = poser(true); jouer(S, 4, '2026-11-09', 1); etat('E3 · séance 4 en DEUX heures : son heure 1 jouée lundi 09 à la place de la 1', S);
  S = poser(false); jouer(S, 4, '2026-11-09', 1, true); etat('E4 · séance 4 (une heure) jouée lundi 09, une diapo reportée', S);
  return out; });
res.forEach(dire); dire('requêtes coupées (aucune n’est partie) : ' + coupees);
await b.close(); fs.writeFileSync(OUT, L.join('\n') + '\n');
