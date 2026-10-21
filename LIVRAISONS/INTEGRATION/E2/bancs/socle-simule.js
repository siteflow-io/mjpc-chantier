/* LE SOCLE SIMULÉ — E2, pour éprouver `dr/dr-classe.js` sur la maquette p8-5g AVANT la poussée E1-a.
   Ce n'est PAS le socle : ce sont les quelques fonctions du site que mon module appelle, prises telles quelles de la production
   (les clés d'heure, l. 15334-15358) ou réduites à leur geste (les interfaces du contrat §5 : `dr_lire`/`dr_ecrire` par le faux hub,
   `dr_cheminC`/`dr_cheminH`). Il tombe dès E1-a : le banc joue alors `assemble/index.html`. */
var FIREBASE_BASE = 'https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app';
var AT_EDT = ['08:00-08:55','08:57-09:52','10:07-11:02','11:04-11:59','13:00-13:55','13:57-14:52','15:07-16:02','16:04-16:59'];
var AT = { edChap: { level: '3e', chnum: '0' } }, ATVUES = { snum: '0', vue: 'pilotage' }, AT_DR_COURS = null, AT_DR_REGIME = 'prep', SES = { id: 'ap_banc', ctx: null, actif: false };
var classesData = { '3E Charles de Gaulle': { nom: '3E Charles de Gaulle', eleves: [] } };
var M8_TEST = false;
function atInfo(m){ (window.__INFO = window.__INFO || []).push(String(m)); }
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
function chChargerTaxo(cb){ cb(null); }
function edtHeuresPour(){ return 2; }   /* la maquette joue deux heures */
function _lvlClasses(){ return [{ slug: '3E Charles de Gaulle', nom: '3E Charles de Gaulle' }]; }
function dr_lire(chemin, cb){ fetch(FIREBASE_BASE + chemin + '.json').then(r => r.json()).then(v => cb(v)).catch(() => cb(undefined)); }
function dr_ecrire(chemin, valeur, libelle, cb){ if (M8_TEST) { if (cb) cb(); return; } fetch(FIREBASE_BASE + chemin + '.json', { method: 'PUT', body: JSON.stringify(valeur) }).then(() => { if (cb) cb(); }); }
function dr_cheminB(){ return '/site/' + AT.edChap.level + '/chapitres/' + AT.edChap.chnum + '/seances/' + ATVUES.snum; }
function dr_cheminC(){ return AT_DR_COURS ? dr_cheminB() + '/deroule_joue/' + AT_DR_COURS.classeSlug : null; }
function dr_cheminH(){ return AT_DR_COURS ? dr_cheminC() + '/heures/' + _drCleHeureDe(AT_DR_COURS) : null; }
function atDrJouer(slug, nom){ const c = { classe: nom, demarreLe: Date.now(), ecrans: JSON.parse(JSON.stringify(seance().ecrans)) }; dr_ecrire(dr_cheminB() + '/deroule_joue/' + slug, c, 'Démarrage', () => {}); return c; }
function _drCreneauDe(c){
  if(!c)return null;
  var fin=String(c.fin||'');
  for(var k=0;k<AT_EDT.length;k++){ if(AT_EDT[k].split('-')[1]===fin)return AT_EDT[k]; }
  return String(c.debut||'')+'-'+fin;   /* hors emploi du temps : le cr\u00e9neau reste ce qu'il est */
}
function _drCleHeureDe(c,ts){
  if(!c)return null;
  var d=new Date(ts||Date.now()), p=function(n){return (n<10?'0':'')+n;};
  var jour=d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());
  var cls=String(c.classeSlug||c.classeNom||'').replace(/[.#$\[\]\/\s]/g,'_');
  return jour+'_'+String(_drCreneauDe(c)||'').replace(/:/g,'h').replace(/[.#$\[\]\/\s]/g,'')+'_'+cls;
}
function _drBaseHeureDe(c,ts){
  if(!c||!c.niveau||!c.chapitre||!c.seance||!c.classeSlug)return null;
  var cle=_drCleHeureDe(c,ts); if(!cle)return null;
  return FIREBASE_BASE+'/site/'+c.niveau+'/chapitres/'+c.chapitre+'/seances/'+c.seance
    +'/deroule_joue/'+c.classeSlug+'/heures/'+cle;
}
/* la SIGNATURE d'une heure : ce qui la distingue de toute autre. Elle sert au
   compare-et-efface du pointeur (\u2460) et \u00e0 la banni\u00e8re (\u2461). */
function _drSignatureCours(c){
  if(!c)return '';
  return [c.niveau,c.chapitre,c.seance,c.classeSlug,c.debut,c.fin].join('|');
}
