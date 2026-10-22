// E4 · la preuve sur pièce (réveil n°19 suite, Paul 13:40 ; contrat §12.21) : le chapitre 3e réécrit au contrat du prompt
// d'injection (MANDATS/PROMPT-INJECTION/PROMPT-INJECTION.md v0.3 ; §12.22 : ni réactivation ni fin d'heure dans le fichier), SANS UNE PHRASE NOUVELLE VUE PAR L'ÉLÈVE — seulement la structure.
// Rejouable : node au-contrat.mjs [source.json] [sortie.json] [taxonomie.json]
// Sorties : le chapitre au contrat, la table avant / après par séance (avant-apres.md), la liste du §3 point 5 avec son compte.
import fs from 'node:fs';
import path from 'node:path';

const ICI = path.dirname(new URL(import.meta.url).pathname);
const RACINE = path.resolve(ICI, '..', '..', '..', '..');
const SRC = process.argv[2] || path.join(RACINE, 'CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json');
const OUT = process.argv[3] || path.join(ICI, 'chapitre-3e-au-contrat.json');
const TAXO = process.argv[4] || path.join(RACINE, 'AUDITS/INTEGRATION-DEROULE/hub/taxonomie.json');
const UTILE = 50;   // une heure = 55 min ; 50 utiles, la fin d'heure en prend 5 (§1.2, §1.3)

const src = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const taxo = JSON.parse(fs.readFileSync(TAXO, 'utf8'));
const out = JSON.parse(JSON.stringify(src));

// ── la taxonomie : la famille de chaque notion (domaines → familles → notions) ; les compétences n'ont pas de famille ──
const familleDe = {}; const connus = new Set();
(taxo.domaines || []).forEach(d => (d.familles || []).forEach(f => (f.notions || []).forEach(n => { familleDe[n.id] = f.id; connus.add(n.id); })));
const compet = taxo.competences; (Array.isArray(compet) ? compet : Object.values(compet || {})).forEach(c => { if (c && c.id) connus.add(c.id); else if (c && typeof c === 'object') Object.values(c).forEach(x => x && x.id && connus.add(x.id)); });
const listeIds = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(listeIds); if (typeof o.id === 'string') connus.add(o.id); Object.values(o).forEach(listeIds); };
listeIds(taxo.competences);

// ── les choix de structure, déclarés (aucun n'écrit une phrase : ils rangent ce qui existe) ──
const REACTIVATION = act => /^Où en sommes-nous\s*\?$/.test(act);
const AVANT = act => /^Avant de se quitter/.test(act);
const BILAN = act => /^Question-bilan/.test(act);
// les activités de plusieurs diapos (la diapo n'est pas l'activité, §1.6) : [clé de séance, titres des diapos, titre de l'activité ou null = le titre de la première diapo]
const GROUPES = [
  ['intro-peinture', ['Tableau 1', 'Tableau 2', 'Tableau 3', 'Tableau 4', 'Tableau 5', 'Les hypothèses de la classe'], 'Les cinq tableaux à analyser'],   // le titre de l'item « tableaux » de la séance (relance n°19)
  ['etude-albatros', ['Le e muet dans le vers', 'Compter les syllabes : le e muet'], null],
  ['etude-albatros', ['Le champ lexical', 'Le champ lexical de la moquerie'], null],
  ['etude-albatros', ['La famille des images', 'Les figures de style'], null],
  ['dictee-reecriture', ['La dictée se prépare : le paratexte', 'La dictée se prépare : les pièges'], null],
  ['atelier-paragraphe', ['Trois questions à ne pas confondre', 'Forme, registre, mouvement : ne pas confondre'], null],
];
// la feuille de chaque fiche (§1.4, `feuille` = la clé de l'item de la séance qui porte la fiche)
const FEUILLES = {
  'etude-albatros|Le registre lyrique': 'fiche-registres',
  'interro-analyse|P.I et P.P': 'fiche-notion-propositions',
  'interro-analyse|La PSR': 'fiche-notion-propositions',
  'interro-analyse|« Que » et la PSCc': 'fiche-notion-propositions',
  'interro-analyse|La PSCci': 'fiche-notion-propositions',
  'atelier-paragraphe|Le sonnet': 'fiche-versification',   // [à vérifier] : la fiche « rappel sur la versification » de la séance porte-t-elle le sonnet ?
};
const FAMILLES_PAR_CARTE = +(process.env.E4_FAMILLES || 1);   // mesuré par « À régler » du site après import (1366 et 1280) : 3 familles par diapo → 2 diapos sur 3 refusées (4 chevauchements / 3 traits ; 1 / 2) ; 2 familles → 3 sur 4 refusées ; 1 famille → 0. Le réveil n°23 demandait 3 (selon E3) : écart dit au journal

const journal = []; const avantApres = [];
const chap = out.chapitre; let numAct = 0; const vuesAvant = [];   // les notions travaillées plus tôt dans le chapitre, dans l'ordre

chap.seances.forEach((s, si) => {
  const E0 = (s.deroule && s.deroule.ecrans) || [];
  const avant = { diapos: E0.length, min: E0.reduce((t, e) => t + (e.dur || 0), 0) };
  // 1 · la carte trop pleine coupée en diapos qui tiennent (même titre, « (suite) ») ; un schéma : devoilerTout false, son titre en `titre` (v0.3)
  const E = [];
  E0.forEach(e0 => {
    const e = JSON.parse(JSON.stringify(e0));
    const sch = (e.blocs || []).filter(b => b.t === 'schema');
    sch.forEach(b => { if (b.txt != null && b.titre == null) { b.titre = b.txt; delete b.txt; } b.devoilerTout = false; });   /* pièce v0.3 §1.4 : « `titre`, pas `txt` : un schéma écrit avec `txt` arrive sans titre » */
    const b = sch[0]; const lignes = b ? String(b.src || '').split('\n').filter(x => x.trim()) : [];
    if (b && b.forme === 'carte' && lignes.length > FAMILLES_PAR_CARTE) {
      const parts = []; for (let i = 0; i < lignes.length; i += FAMILLES_PAR_CARTE) parts.push(lignes.slice(i, i + FAMILLES_PAR_CARTE));
      const dur = e.dur || parts.length; const base = Math.floor(dur / parts.length), reste = dur - base * parts.length;
      parts.forEach((p, k) => { const c = JSON.parse(JSON.stringify(e)); c.act = k === 0 ? e.act : e.act + ' (suite)'; c.dur = Math.max(1, base + (k < reste ? 1 : 0)); c.blocs = c.blocs.map(x => x.t === 'schema' ? Object.assign({}, x, { src: p.join('\n') }) : x); c.__carte = e.act; E.push(c); });
      journal.push(`${s.cle} · « ${e.act} » : la carte de ${lignes.length} familles coupée en ${parts.length} diapos de ${FAMILLES_PAR_CARTE} familles au plus (« (suite) »)`);
    } else E.push(e);
  });
  // 2 · §12.22 (Paul, 13:59-14:13) : « Où en sommes-nous ? » est retirée, pas transformée (le site construit la réactivation en classe, au choix) ;
  //     le seul rituel écrit est le bilan (s'il est la dernière diapo de la séance)
  for (let i = E.length - 1; i >= 0; i--) if (REACTIVATION(E[i].act)) { journal.push(`${s.cle} · « ${E[i].act} » (${E[i].dur} min) retirée (§12.22) — avant : ${E[i].blocs.map(b => b.t).join(', ')}`); E[i].__retireeAvant = true; E.splice(i, 1, Object.assign(E[i], { __coupe: true })); }
  const coupes = new Set(E.map((e, i) => e.__coupe ? i : -1).filter(i => i >= 0));
  const last = E[E.length - 1]; if (last && BILAN(last.act)) last.role = 'bilan';
  E.forEach((e, i) => { if (BILAN(e.act) && !e.role) journal.push(`${s.cle} · « ${e.act} » (diapo ${i + 1}) : un bilan au milieu de la séance — ni déplacé ni renommé (pas de phrase nouvelle) ; à trancher (§1.3 : jamais « bilan » dans le titre d'une autre diapo)`); });
  // 3 · les heures : d'abord les repères de la trame (une heure se ferme après « Avant de se quitter », s'ouvre à une réactivation) ;
  //     un segment de 60 min au plus (la trame a été écrite pour des heures de 55 min) reste une heure — l'étape 4 rend l'excès ;
  //     un segment plus long se coupe par les durées (50 min utiles), comme le site le propose
  const segs = []; let cur = [];
  E.forEach((e, i) => { if (i > 0 && (e.__coupe || AVANT(E[i - 1].act)) && cur.length) { segs.push(cur); cur = []; } if (!e.__coupe) cur.push(e); }); if (cur.length) segs.push(cur);
  for (let i = E.length - 1; i >= 0; i--) if (E[i].__coupe) E.splice(i, 1);
  let h = 0;
  segs.forEach(sg => {
    const tot = sg.reduce((a, e) => a + (e.dur || 0), 0);
    if (tot <= UTILE + 10) { h++; sg.forEach(e => { e.heure = h; }); return; }
    h++; let somme = 0;
    sg.forEach((e, j) => { if (j > 0 && somme + (e.dur || 0) > UTILE && !AVANT(e.act) && e.role !== 'bilan') { h++; somme = 0; } e.heure = h; somme += e.dur || 0; });
    journal.push(`${s.cle} · un segment de ${tot} min sans repère d'heure, coupé par les durées (50 min utiles)`);
  });
  // 4 · une heure qui dépasse 50 min : la diapo d'activité la plus longue de l'heure rend l'excès (déclaré, [PROPOSITION] à Paul)
  const nH = h;
  for (let k = 1; k <= nH; k++) {
    const dH = E.filter(e => e.heure === k); const t = dH.reduce((a, e) => a + (e.dur || 0), 0);
    if (t > UTILE) { const cand = dH.filter(e => !e.role && !AVANT(e.act)).sort((a, b) => (b.dur || 0) - (a.dur || 0))[0];
      if (cand) { const ex = t - UTILE; const av = cand.dur; cand.dur = Math.max(1, av - ex); journal.push(`${s.cle} · heure ${k} : ${t} min > 50 — « ${cand.act} » passe de ${av} à ${cand.dur} min [PROPOSITION]`); } }
  }
  // 5 · les activités : numérotées en continu sur le chapitre ; un groupe déclaré = une activité ; une diapo seule = une activité
  const acts = []; const parTitre = {};
  GROUPES.filter(g => g[0] === s.cle).forEach(g => g[1].forEach(t => { parTitre[t] = g; }));
  E.forEach((e, i) => {
    if (e.role) return;
    if (AVANT(e.act)) { const prec = [...E.slice(0, i)].reverse().find(z => !z.role && z.actId); if (prec) { e.actId = prec.actId; journal.push(`${s.cle} · « ${e.act} » (heure ${e.heure}) : ferme l'activité « ${acts.find(a => a.id === prec.actId).titre} » (même actId) — ni un rituel du contrat (§1.3), ni une activité à part`); return; } }
    const cleGroupe = e.__carte || e.act; const g = parTitre[cleGroupe];
    let a = g ? acts.find(x => x.__g === g) : null;
    if (!a) { numAct++; a = { id: 'a' + numAct, num: numAct, titre: g && g[2] ? g[2] : (g ? g[1][0] : (e.__carte || e.act)), __g: g || null }; acts.push(a); }
    e.actId = a.id;
  });
  // 6 · comp et remob : remob = les notions de la même famille de la taxonomie, travaillées plus tôt dans le chapitre (§1.2) ; les compétences ne se remobilisent pas
  E.forEach(e => {
    e.comp = Array.isArray(e.comp) ? e.comp : [];
    if (!e.role) { const fams = new Set(e.comp.map(id => familleDe[id]).filter(Boolean)); e.remob = [...new Set(vuesAvant.filter(id => fams.has(familleDe[id]) && !e.comp.includes(id)))]; }
    e.comp.forEach(id => { if (familleDe[id] && !vuesAvant.includes(id)) vuesAvant.push(id); });
  });
  // 7 · la fiche nomme sa feuille
  E.forEach(e => (e.blocs || []).forEach(b => { if (b.t === 'fiche') { const f = FEUILLES[s.cle + '|' + b.titre]; if (f) b.feuille = f; else journal.push(`${s.cle} · fiche « ${b.titre} » : aucune feuille déclarée (à lier)`); } }));
  // 8 · le travail à faire prévu, par heure : la consigne « pour la prochaine fois / heure » qui existe déjà (mot pour mot)
  const travail = {};
  E.forEach(e => { if (!(AVANT(e.act) || e.role === 'bilan')) return; (e.blocs || []).forEach(b => { if (b.t === 'consigne' && /prochaine (fois|heure)/i.test(b.txt || '')) travail[String(e.heure)] = b.txt; }); });
  // 9 · §12.22 : pas de fin d'heure dans le fichier (le site la pose, dernière de chaque heure)
  const E2 = []; for (let k = 1; k <= nH; k++) E.filter(e => e.heure === k).forEach(e => E2.push(e));
  E2.forEach(e => { delete e.__carte; delete e.__coupe; delete e.__retireeAvant; });
  s.deroule = { ecrans: E2, activites: acts.map(a => ({ id: a.id, num: a.num, titre: a.titre })), travail };
  avantApres.push({ cle: s.cle, titre: s.title, avant, apres: { diapos: E2.length, heures: nH, minParHeure: Array.from({ length: nH }, (_, k) => E2.filter(e => e.heure === k + 1).reduce((a, e) => a + e.dur, 0)), activites: acts.map(a => a.num + ' ' + a.titre), retirees: E0.filter(e => REACTIVATION(e.act)).length, bilan: E2.some(e => e.role === 'bilan'), travail: Object.keys(travail) } });
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');

// ── la liste du §3 point 5, appliquée au chapitre réécrit ──
const v = []; const R = (ok, regle, ou) => { if (!ok) v.push(`${regle} — ${ou}`); };
const itemsDuChap = new Set(); chap.seances.forEach(s => Object.keys(s.items || {}).forEach(k => itemsDuChap.add(k)));
let attenduNum = 1;
chap.seances.forEach(s => {
  const E = s.deroule.ecrans; const A = s.deroule.activites; const nH = Math.max(...E.map(e => e.heure));
  A.forEach(a => { R(a.num === attenduNum, 'activités numérotées en continu', `${s.cle} · activité ${a.num} (attendu ${attenduNum})`); attenduNum = a.num + 1; R(E.some(e => e.actId === a.id), 'une activité a au moins une diapo', `${s.cle} · ${a.titre}`); });
  E.forEach((e, i) => {
    const ou = `${s.cle} · diapo ${i + 1} « ${e.act} »`;
    if (!e.role) { R(!!e.actId && A.some(a => a.id === e.actId), 'toute diapo d\'activité a son actId', ou); R(Array.isArray(e.comp) && Array.isArray(e.remob), 'comp et remob sur chaque diapo d\'activité', ou); }
    if (!e.role) R(!/bilan/i.test(e.act), 'jamais « bilan » dans le titre d\'une autre diapo', ou);
    const sch = (e.blocs || []).filter(b => b.t === 'schema'); R(sch.length <= 1, 'un schéma par diapo', ou);
    sch.forEach(b => { R(b.devoilerTout === false, 'schéma devoilerTout: false', ou); R(!!b.titre && !b.txt, 'un schéma a un titre (« titre », pas « txt »)', ou); });
    if (sch.length) { const cons = (e.blocs || []).filter(b => b.t === 'consigne'); R(cons.length <= 1 && cons.every(c => !(c.etapes || []).length), 'au plus une consigne d\'une ligne avec le schéma', ou); R((e.blocs || []).every(b => b.t === 'schema' || b.t === 'consigne'), 'la diapo d\'un schéma : le schéma et au plus une consigne', ou); }
    (e.blocs || []).forEach(b => {
      if (b.t === 'fiche') R(!!b.feuille && itemsDuChap.has(b.feuille), 'chaque fiche nomme sa feuille', `${ou} · « ${b.titre} »`);
      if (b.t === 'image') R(!!b.ref && !/^[a-z]+:\/\//i.test(b.ref), 'image : adresse relative', ou);
      if (b.t === 'question') R((b.reps || []).length > 0 && (b.reps || []).every(r => String(r.r || '').trim()), 'aucune réponse attendue vide (reps)', `${ou} · « ${String(b.q).slice(0, 50)}… »`);
    });
    (e.comp || []).concat(e.remob || []).forEach(id => R(connus.has(id), 'les notions existent dans la taxonomie', `${ou} · ${id}`));
  });
  R(E.filter(e => e.role === 'bilan').length <= 1, 'un seul bilan', s.cle);
  const bi = E.findIndex(e => e.role === 'bilan'); if (bi >= 0) R(bi === E.length - 1, 'le bilan est la dernière diapo de la séance', s.cle);
  E.forEach((e, i) => { R(!e.role || e.role === 'bilan', 'aucun rôle « reactivation » ni « fin » (§12.22)', `${s.cle} · diapo ${i + 1} « ${e.act} » : ${e.role}`); R(!REACTIVATION(e.act), 'aucune diapo « Où en sommes-nous ? » (§12.22)', `${s.cle} · diapo ${i + 1}`); });
  for (let k = 1; k <= nH; k++) { const t = E.filter(e => e.heure === k).reduce((a, e) => a + e.dur, 0); R(t <= UTILE, 'la somme des dur par heure ≤ 50', `${s.cle} · heure ${k} : ${t} min`); }
});

// la table avant / après, pour le journal
let md = `| séance | avant | après | heures (min utiles) | activités (num titre) | « Où en sommes-nous ? » retirées | bilan | travail (heures) |\n|---|---|---|---|---|---|---|---|\n`;
avantApres.forEach(x => { md += `| ${x.cle} | ${x.avant.diapos} diapos · ${x.avant.min} min | ${x.apres.diapos} diapos | ${x.apres.heures} (${x.apres.minParHeure.join(' / ')}) | ${x.apres.activites.join(' ; ')} | ${x.apres.retirees} | ${x.apres.bilan ? 'oui' : '—'} | ${x.apres.travail.join(', ') || '—'} |\n`; });
fs.writeFileSync(path.join(ICI, 'avant-apres.md'), md + '\n### Choix déclarés\n' + journal.map(l => '- ' + l).join('\n') + '\n\n### La liste du §3 point 5 — ' + v.length + ' écart(s)\n' + v.map(l => '- ' + l).join('\n') + '\n');
console.log(`chapitre au contrat : ${path.relative(RACINE, OUT)} · ${numAct} activités · ${chap.seances.reduce((t, s) => t + s.deroule.ecrans.length, 0)} diapos`);
console.log(`choix déclarés : ${journal.length}`); journal.forEach(l => console.log('  · ' + l));
console.log(`liste du §3 point 5 : ${v.length} écart(s)`); v.forEach(l => console.log('  ✗ ' + l));
