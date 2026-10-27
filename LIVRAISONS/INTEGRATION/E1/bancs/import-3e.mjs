// E1 (§12.21, dettes 13 · 30 et 13 · 31) — le chapitre JSON de test de l'import, tiré du chapitre 3e du FAUX hub
// (AUDITS/INTEGRATION-DEROULE/hub/site_3e.json : une copie, jamais le hub), mis au contrat de la pièce
// (MANDATS/PROMPT-INJECTION/PROMPT-INJECTION.md v0.2), et une mutation par refus de l'annexe, avec son motif mot pour mot.
const MEDIAS = 'https://siteflow-io.github.io/mjpc-medias/';
const rituel = e => /o[uù] en sommes[- ]nous|r[ée]activation/i.test(String(e.act || ''));

// une séance du faux hub → la séance que l'instance livrerait : les champs du contrat, rien du site (id, vues, eid, rev, h)
function seanceDuContrat(se, num0) {
  const E = (se.deroule.ecrans || []).filter(e => !rituel(e));   // pas de « Où en sommes-nous ? » (§12.22)
  const ecrans = E.map((e, i) => ({
    act: i < E.length - 1 ? String(e.act).replace(/bilan/gi, 'synthèse') : e.act,   // « jamais le mot bilan dans le titre d'une autre diapo »
    dur: e.dur, comp: (e.comp || []).slice(), remob: [],
    blocs: (e.blocs || []).map(b => {
      const x = JSON.parse(JSON.stringify(b)); delete x.id; delete x.vues;
      if (x.t === 'image') { x.ref = String(x.ref || '').replace(MEDIAS, ''); delete x.src; delete x.support; delete x.marques; }
      if (x.t === 'schema') { delete x.z; delete x.pos; }
      if (x.t === 'fiche') x.feuille = Object.keys(se.items || {}).find(k => /^fiche-/.test(k)) || 'fiche';
      if (x.t === 'question') x.reps = (x.reps || []).map(r => ({ i: '', r: r.r || 'réponse attendue' }));
      return x; }) }));
  // les heures par les durées (≤ 50 min utiles), une activité par heure ; le bilan, dernier
  let h = 1, cumul = 0; const activites = []; let num = num0;
  ecrans.forEach((e, i) => { if (i === ecrans.length - 1) { e.role = 'bilan'; delete e.remob;   // §12.24 (v0.7 §1.3) : trois blocs dans l'ordre, des mots-clés, ses notes présentateur
      const q = e.blocs.find(b => b.t === 'question') || { t: 'question', q: 'Que retiens-tu de cette séance ?' };
      e.blocs = [{ t: 'question', q: q.q, reps: [] }, { t: 'texte', txt: 'À mettre dans le bilan', el: ['le titre de la séance', 'la notion du jour', 'un exemple du texte', 'le mot juste'] }, { t: 'consigne', pic: '✎', txt: 'Rédige le bilan au brouillon.', etapes: ['Cinq à huit lignes, au présent.', 'Chaque mot-clé y est, dans une phrase à toi.', 'Souligne chaque mot-clé une fois placé.'] }];
      e.notes = '<ul><li><b>la notion du jour</b> (litt-036)</li></ul><p>La réponse validée s\'écrit dans la copie de la classe.</p>'; } if (cumul + e.dur > 50) { h++; cumul = 0; } cumul += e.dur; e.heure = h;
    if (e.role) return; let a = activites.find(x => x.h === h); if (!a) { a = { id: 'a' + num, num, titre: 'Activité de l\'heure ' + h, h }; activites.push(a); num++; } e.actId = a.id; });
  activites.forEach(a => delete a.h);
  return { s: { title: se.title, type: se.type, ordre: se.ordre, cle: se.cle, notions: se.notions || [], competences: se.competences || [], items: {},
    deroule: { ecrans, activites, travail: { 1: 'Relis la leçon.', [h]: 'Apprends la fiche.' } } }, num };
}

export function chapitreTest(store) {
  const ch = store.site['3e'].chapitres[0];
  const a = seanceDuContrat(ch.seances[0], 1), b = seanceDuContrat(ch.seances[1], a.num);
  return { produit: 'chapitre', niveau: '3e', chapitre: { title: ch.title, seances: [a.s, b.s] } };
}

// une mutation par refus : [clé, ce qu'on casse, le motif attendu (mot pour mot, sans l'élément cité), la mutation]
const s0 = j => j.chapitre.seances[0], s1 = j => j.chapitre.seances[1], E0 = j => s0(j).deroule.ecrans, E1 = j => s1(j).deroule.ecrans;
const blocDe = (E, t) => { for (const e of E) for (const b of e.blocs) if (b.t === t) return b; return null; };
export const MUTATIONS = [
  ['actId', 'une diapo d\'activité sans actId', ': une diapo d’activité sans activité (« actId ») — un chapitre dont les activités ne sont pas toutes numérotées est refusé (3.2 bis).', j => { delete E0(j)[1].actId; }],
  ['num', 'les activités non numérotées en continu sur le chapitre (la séance 2 repart à 1 : doublon)', ': les numéros d’activité ne vont pas de 1 à n (trou ou doublon).', j => { s1(j).deroule.activites[0].num = 1; }],
  ['numTrou', 'un trou dans les numéros d\'activité', ': les numéros d’activité ne vont pas de 1 à n (trou ou doublon).', j => { s1(j).deroule.activites.forEach(a => { a.num += 1; }); }],
  ['actSansDiapo', 'une activité sans diapo', ': une activité sans diapo.', j => { const A = s1(j).deroule.activites; A.push({ id: 'a99', num: A[A.length - 1].num + 1, titre: 'Orpheline' }); }],
  ['heureEntier', '« heure » non entière', ': « heure » n’est pas un nombre entier.', j => { E0(j)[1].heure = 1.5; }],
  ['schemaSansTitre', 'un schéma sans le champ « titre » (le « txt » de la v0.2)', 'un schéma sans « titre ».', j => { const b = blocDe(E1(j), 'schema'); b.txt = b.titre; delete b.titre; }],
  ['fil', 'un « fil » autre que « langue »', ': « fil » ne vaut que « langue », ou s’omet.', j => { j.chapitre.fil = 'grammaire'; }],
  /* §12.33 (5) : le refus « notes » hors du bilan est tombé — A64 vérifie qu'elles sont acceptées partout */
  ['bilanBlocs', 'un bilan à deux blocs (la consigne manque)', ': le bilan n’a pas ses trois blocs (question, texte « À mettre dans le bilan », consigne) — dans cet ordre.', j => { E0(j)[E0(j).length - 1].blocs.pop(); }],
  ['bilanOrdre', 'un bilan dont les blocs ne sont pas dans l\'ordre', ': le bilan n’a pas ses trois blocs (question, texte « À mettre dans le bilan », consigne) — dans cet ordre.', j => { const B = E0(j)[E0(j).length - 1].blocs; B.push(B.shift()); }],
  ['bilanPoint', 'une ligne « À mettre dans le bilan » qui finit par un point', ': une ligne « À mettre dans le bilan » finit par un point ou dépasse douze mots — des mots-clés, pas la réponse.', j => { E0(j)[E0(j).length - 1].blocs[1].el[0] = 'Le poète est comme l\'albatros.'; }],
  ['bilanLong', 'une ligne « À mettre dans le bilan » de treize mots', ': une ligne « À mettre dans le bilan » finit par un point ou dépasse douze mots — des mots-clés, pas la réponse.', j => { E0(j)[E0(j).length - 1].blocs[1].el[0] = 'un deux trois quatre cinq six sept huit neuf dix onze douze treize'; }],
  ['copieDeClasse', 'un texte vu par les élèves qui dit « copie de classe »', ': un texte vu par les élèves dit « copie de classe ».', j => { E0(j)[0].blocs[0].txt = 'Recopie la réponse de la copie de classe.'; }],
  ['feuilleInconnue', 'une fiche dont la feuille ne nomme aucun item du chapitre', ': une fiche sans feuille (« feuille ») — une fiche vit dans une feuille du chapitre (1.7).', j => { blocDe(E1(j), 'fiche').feuille = 'pas-un-item'; }],
  ['bilan2', 'deux bilans', ': deux bilans — le bilan est unique et dernier.', j => { E0(j)[2].role = 'bilan'; }],
  ['bilanDernier', 'le bilan n\'est pas la dernière diapo', ': le bilan n’est pas la dernière diapo de la séance.', j => { const E = E0(j); const x = E.pop(); E.splice(E.length - 1, 0, x); }],
  ['bilanTitre', 'le mot « bilan » dans le titre d\'une autre diapo (le site la lit comme un bilan)', ': deux bilans — le bilan est unique et dernier.', j => { E0(j)[3].act = 'Petit bilan des tableaux'; }],
  ['reactivation', 'rôle « reactivation »', ': rôle « reactivation » ou « fin » — le site pose ces diapos lui-même, retire-les.', j => { E0(j)[0].role = 'reactivation'; }],
  ['fin', 'rôle « fin »', ': rôle « reactivation » ou « fin » — le site pose ces diapos lui-même, retire-les.', j => { E0(j)[0].role = 'fin'; }],
  ['ouEnSommes', 'une diapo « Où en sommes-nous ? » (sans rôle)', ': rôle « reactivation » ou « fin » — le site pose ces diapos lui-même, retire-les.', j => { E0(j)[0].act = 'Où en sommes-nous ?'; }],
  ['schema2', 'deux schémas sur une diapo', ': deux schémas sur une diapo — un schéma par diapo.', j => { const e = E1(j).find(e => e.blocs.some(b => b.t === 'schema')); e.blocs.push(JSON.parse(JSON.stringify(e.blocs[0]))); }],
  ['schemaConsigne', 'un schéma avec une consigne de deux lignes', ': un schéma avec plus d’une consigne d’une ligne — donne-lui sa diapo.', j => { const e = E1(j).find(e => e.blocs.some(b => b.t === 'schema')); e.blocs.push({ t: 'consigne', txt: 'Observe la carte.', etapes: ['Choisis une famille.'] }); }],
  ['feuille', 'une fiche sans feuille', ': une fiche sans feuille (« feuille ») — une fiche vit dans une feuille du chapitre (1.7).', j => { delete blocDe(E1(j), 'fiche').feuille; }],
  ['heure50', 'une heure de plus de 50 minutes', ': l’heure 1 dépasse 50 minutes (', j => { E0(j)[0].dur += 30; }],
  ['remob', '« remob » absent d\'une diapo d\'activité', ': « remob » manque sur une diapo d’activité.', j => { delete E0(j)[1].remob; }],
  ['type', 'un type inconnu', 'type inconnu (« tableur ») — les dix types : texte, consigne, question, fiche, schema, image, video, page, doc, cahier.', j => { E0(j)[0].blocs.push({ t: 'tableur' }); }],
  ['reps', 'une question sans réponse attendue', 'Refus : la réponse attendue manque — elle vit à part, c’est le contrat.', j => { blocDe(E0(j), 'question').reps = [{ i: '', r: '' }]; }],
  ['ficheTitre', 'une fiche sans titre', 'Refus : une fiche a un titre.', j => { blocDe(E1(j), 'fiche').titre = ''; }],
  ['ficheDef', 'une fiche sans définition', 'Refus : une fiche a sa définition (la phrase à retenir).', j => { blocDe(E1(j), 'fiche').def = ''; }],
  ['schemaTitre', 'un schéma sans titre', 'Refus : un schéma a un titre.', j => { const b = blocDe(E1(j), 'schema'); b.titre = ''; delete b.txt; }],
  ['schemaLigne', 'un schéma sans ligne', 'Refus : un schéma a au moins un élément (une ligne).', j => { blocDe(E1(j), 'schema').src = '\n  \n'; }],
  ['imageComplete', 'une image à l\'adresse complète', 'Refus : l’adresse doit être relative dans mjpc-medias, jamais complète (3.2).', j => { const b = blocDe(E0(j), 'image'); b.ref = MEDIAS + b.ref; }],
  ['video', 'une vidéo sans légende', 'Refus : une vidéo a une légende.', j => { E0(j)[0].blocs.push({ t: 'video', txt: '', fichier: 'radeau.mp4', duree: 185, reperes: [{ t: 0, l: 'l\'ouverture' }] }); }],
  ['page', 'une page sans fichier', 'Refus : un fichier et un titre.', j => { E0(j)[0].blocs.push({ t: 'page', txt: 'Le jeu des rimes', src: '', contrat: true, etapes: 4 }); }],
  ['notion', 'une notion inexistante dans « comp »', 'utilise une notion qui n’existe pas (« zz-999 »). Reprends un identifiant de la liste du prompt.', j => { E0(j)[0].comp.push('zz-999'); }],
];
// ce qui doit PASSER (aucun refus) : les dix types, chacun à son contrat
export const ACCEPTES = j => { const e = E0(j)[0]; e.blocs.push(
  { t: 'texte', txt: 'Le siècle des inventions', el: ['La photographie (1839).'] },
  { t: 'video', txt: 'Le Radeau de la Méduse', fichier: 'radeau.mp4', duree: 185, reperes: [{ t: 80, l: 'le monologue' }, { t: 0, l: 'l\'ouverture' }] },
  { t: 'page', txt: 'Le jeu des rimes', src: 'pages/jeu-des-rimes.html', contrat: true, etapes: 4 },
  { t: 'doc', doc: 'tableaux', txt: 'Les tableaux' }); return j; };
