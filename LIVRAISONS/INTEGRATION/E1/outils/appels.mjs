import fs from 'fs';
const html = fs.readFileSync('/home/user/prod/index.html', 'utf8'); const inv = JSON.parse(fs.readFileSync('inv-prod.json'));
const TOMBE_E1 = '_drAssurerCadre _drEnvelopper _drHabiller _drReconstruire _drPontEtat _drAfficher _drTailleCadre _drQuandPret _drSain _drVerifier drWin _drNormaliserTrame _drFlushTrame _drRechargerSi _drEntreesEcran _drTrameDe _drEcrireTrame _drLibelles _drTitrerColonne _drRecollerEtapes _drRefusionner _drMorceauDuDevoilement _drRangDuMorceau _drVueGroupe _drVuePere _drRatioEcran _drLargeurEcran _drPoserContexteMoteur _drCalerStructure atDrVueInterne _drTexteBloc _drEmpreinte _drCoupe atDrModifsDeLaSeance atDrEnrAuto atDrTrameEnregistrer atDrMonter atDrSynchroDebut atDrMajUtile atDrMaintenant atDrCompChange atDrTaxoOptions atDrBrancherSuivi AT_DR_B64'.split(' ');
const TOMBE_E2 = 'atVecuAfficher atVecuDemarrer atVecuEntrer atVecuSortir atVecuMinutes atVecuEcrire atT5Reste atT5Etat atT5Zone atT5Appliquer atT5Appel atT5Restantes atT5Modale atT5Choix atT5Veille AT_DR_VECU AT_T5_CHOIX AT_T5_TIMER atDrClotureModale atDrSuiviAppliquer _drVifInstaller _drVifAller _drPaletteOuvrir _drPaletteBrancher sesBrancherPilote sesAppliquer _sesRangLocal'.split(' ');
const TOMBE_E3 = 'sesTabChrono sesTabQui sesBootTel sesBrancherPiloteTel sesCurseurFin sesTelChercherCours sesTelGeste sesTelCranPas sesTelCran sesTelMajCran sesTelChrono sesTelPeindre sesTelPart sesTelPlus1'.split(' ');
const TOMBE = new Set([...TOMBE_E1, ...TOMBE_E2, ...TOMBE_E3]);
const decl = inv.filter(x => x.nom);
const existe = n => decl.some(d => d.nom === n);
console.log('INEXISTANTS (contrat §6, ligne « tombe ») :', [...TOMBE].filter(n => !existe(n)).join(' ') || 'aucun');
const corps = d => html.slice(d.start, d.end);
const out = {};
for (const n of TOMBE) { if (!existe(n)) continue; const re = new RegExp('(^|[^\\w$.])' + n.replace(/\$/g, '\\$') + '(?![\\w$])');
  const appelants = decl.filter(d => d.nom !== n && re.test(corps(d))).map(d => d.nom);
  const stmts = inv.filter(d => !d.nom && re.test(corps(d))).map(d => 'stmt@' + d.ligne);
  const html_hors_script = 0;
  const vivants = [...appelants.filter(a => !TOMBE.has(a)), ...stmts];
  out[n] = vivants; if (vivants.length) console.log(n.padEnd(26), '← appelé par (hors liste) :', vivants.join(', ')); }
// références dans les attributs onclick= du HTML statique / des chaînes : on compte toutes les occurrences hors des déclarations qui tombent
