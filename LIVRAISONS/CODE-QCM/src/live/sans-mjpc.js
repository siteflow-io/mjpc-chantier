/* QCM-1 · SOCLE — les écrans de MJPC (src/mjpc.js) n'entrent pas dans l'app (COMMUN §1). Quelques morceaux de la maquette les nomment
   en se chargeant (l'emploi du temps de complement2.js, la clé de c3-base.js) : ils trouvent ici des valeurs vides, et les écrans de MJPC
   ne sont jamais montrés par l'app. */
var MJPC_INCHANGE = "", MJPC_MENU = [], MJPC_VERS = {}, SECU_BILAN_AUTO = "", SECU_BILAN_RELANCE = "", SECU_APPAREILS = [], CODES_ESSAI = {}, NOMS_ESSAI_MJPC = [],
    FLECHES_ESSAI = {}, ELF_PAP = [], FICHES_ESSAI = {}, TAXO_JOUR = new Date().toISOString().slice(0, 10), COMP_CATEGORIES = [["Français — cycle 4", "francaisC4"], ["Compétences transversales", "transversales"]];
function PanneauMJPC(){ return null; }
function BoiteConsole(){ return null; }
function BoiteAlerte(){ return null; }
function confirmeMJPC(){ return null; }
function ficheDe(){ return null; }
function taxoTotal(){ return 0; }
