# NOTE — LA 8.77.1-⑩ REPREND UNE HEURE APRÈS UN RECHARGEMENT (dette ⑪, voie (b) de C16 79 ; et dette ⑰)
*Exécutant neuf, lancé par la conscience n°16 le 02/11/2026 à 06:26 (Paul, 06:26 : « Oui fais la correction. »). Mandat : `MANDATS/DEROULE-01-11/MANDAT-REPRISE-8771.md` (sas `8cf24bb`). Branche `reprise/8771`, partie de `main` (`a9a8755`). Le fichier : `LIVRAISONS/REPRISE-8771/index.html` = la 8.77.1-⑩ de la production (`monsieurjaipascompris/index.html`, md5 `db481a8725124c7782c031e9e6485e82`), corrigée à cet endroit seulement (md5 `f70b6661243038482c9b0280c379ca71`), la ligne `APP_VERSION` laissée à `8.77.1-⑩`. Ni la production, ni `main`, ni `redaction.html`, ni `correction_dictee.html`, ni `AUDITS/`, ni la branche `deroule/diapos-ouverture`, ni le vrai hub n'ont été touchés ou lus.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE
Paul, en pleine heure sur la version en ligne, recharge la page (F5), ou ferme l'onglet et rouvre le site, puis clique « Reprendre » : la diapo où il était revient, avec son compteur, ▶ et ce que voit la classe, comme avant le rechargement. Il peut ensuite continuer l'heure jusqu'à « Clore l'heure ». Le témoin « ● déroulé intègre » ne donne plus de fausse alerte parce que le hub a retiré des listes vides ou rangé les mots dans un autre ordre. Il dit toujours « à vérifier » quand la copie de la classe n'est vraiment pas au hub.

## 1 · MISSION 0 — CE QUE LE MANDAT A D'ERRONÉ, DE MANQUANT OU DE TÉLESCOPÉ (et ce que j'ai tranché)
1. **§2, la base.** Vérifié : l'assemblé de `fc036e8` (md5 `09a19419…`) et la production ne diffèrent que par la ligne 3138 (`APP_VERSION` : « 8.74.0-③ » dans l'assemblé, « 8.77.1-⑩ » en production). J'ai copié le fichier de la production, comme le demandait le message de lancement : la ligne `APP_VERSION` porte donc déjà « 8.77.1-⑩ », et je n'y ai pas touché.
2. **§3.1, « le diff tient en quelques lignes, toutes dans les lecteurs ».** Deux lignes sont hors des lecteurs, et elles sont nécessaires.
   - `DR_S_DEFAUT`, juste après la définition de `S`. L'état d'une heure neuve doit être pris avant qu'une heure ne le change ; dans un lecteur, `S` est déjà celui de l'heure.
   - Dans `dr_copieAuto`, le rappel du témoin reçoit aussi la copie écrite : `dr_temoinIntegre(em, ecr)` au lieu de `dr_temoinIntegre(em)`. L'écriture elle-même ne change pas : même adresse, même contenu, même moment, même rappel après acceptation.
   Tranché : je garde ces deux lignes. Rien d'autre n'est touché : ni texte, ni geste, ni écriture au hub.
3. **Les lecteurs de l'état d'une heure dans la 8.77.1-⑩.** Je les ai cherchés dans tout le fichier (`dr_duHub(`, `/etat`, `dr_restaurer(`, `dr_lireJoue`).
   - Corrigés : `dr_reprendre` (la reprise par le bandeau « Reprendre », après F5, l'onglet rouvert ou un autre navigateur) et `dr_lireJoue`, qui sert à l'heure n > 1 de la même classe (`dr_lancer`) et à la Relecture d'une autre classe (`dr_recitChargerClasse`).
   - Rien à changer dans `dr_jouerCopie` : il ne lit que `S.copie` dans l'état, avec une valeur par défaut (`Sv.copie || {}`).
   - Rien à changer non plus dans `dr_heureLocaleLire` : il lit la copie gardée dans le navigateur (`localStorage` garde les listes vides) et passe ensuite par `dr_reprendre`, qui est corrigé.
   - Les clés de `S` absentes de l'état neuf, posées par `lancerHeure` (`finFaites`, `paliers`, `palier`, `encart`…), sont relues avec une valeur par défaut aux endroits que j'ai lus (`S.finFaites = S.finFaites || {}`, `S.paliers = S.paliers || {}`). Je l'ai aussi mesuré par le geste : partie F, la reprise puis l'heure jouée jusqu'à « Clore l'heure ».
4. **Dette ⑰, la cause est plus large que ce que dit le mandat.** Le vrai hub retire bien les listes vides, mais il renvoie aussi les clés dans son ordre à lui, l'ordre alphabétique.
   - Mesuré sur le code de Firebase 8.10.1 sans réseau (`sonde/essai-ordre.js`) : j'écris `{"eid":"e1","act":"Ouverture","role":"ouverture","blocs":[…],"z":null}` et je relis `{"act":"Ouverture","blocs":[…],"eid":"e1","role":"ouverture"}`.
   - Sur la copie que la 8.77.1-⑩ a réellement écrite en classe (25 diapos, `sonde/copie-ecrite-en-classe-8771.json`), **18 diapos sur 25 ont leurs clés dans un autre ordre que l'alphabet, et 7 valeurs sont vides** (`comp: []`…). Comme l'ancienne empreinte porte sur le texte JSON, le témoin dirait « à vérifier » sur le vrai hub même sans aucune liste vide.
   - Tranché : avant l'empreinte, l'écrit et le relu sont rangés de la même façon (sans valeur nulle, sans liste ni objet vides, une liste notée par ses rangs, les clés triées).
   - Le faux hub « rangé comme le vrai » de la sonde garde l'ordre d'écriture et ne montre donc pas cette partie. Elle est prouvée par `sonde/essai-temoin-sdk.js` (§4).
5. **§3.1 bis, « une écriture refusée par le faux hub : « à vérifier » ».** Dans la 8.77.1-⑩, le témoin n'est recalculé qu'après une écriture de la copie *acceptée* (`dr_ecrire` → `mjpcPutJson`, rappel `onAccepte`). Une écriture refusée (401), ou la liaison coupée, n'appelle jamais le témoin : il garde ce qu'il disait, et c'est la liste des échecs du site qui la porte (`mjpcSignalerIssue`, qui retente).
   - Changer cela, c'est toucher au chemin d'échec de l'écriture : c'est hors des lecteurs, et le mandat dit « rien d'autre ne change ».
   - Tranché : je n'y touche pas. La preuve « à vérifier » est faite sur une **écriture perdue** (acceptée par le hub mais pas gardée), le cas pour lequel le témoin existe. L'écriture refusée est mesurée et rapportée (§4 et §5).
6. **Les gestes de la classe qui réécrivent la copie.** Pendant l'heure, la copie (`C/ecrans`) ne repart que si les diapos elles-mêmes changent (`DR_CL.empreinteEcrite`). ▶, une frappe dans la diapo (qui va dans l'état de la diapo) et la durée d'une activité ne la changent pas. Le témoin se recalcule au lancement et à la reprise. « Intègre après chaque geste » se vérifie donc en lisant le témoin après chaque geste ; l'écriture perdue est celle du lancement, et la copie se réécrit à la reprise (F5, « Reprendre »).
7. **Les libellés de la partie W de la conscience.** Elle écrit « la version en ligne (8.77.1-⑩) » quel que soit le fichier joué (`MJPC_ANCIENNE`). Dans la sortie « après », c'est la 8.77.1-⑩ corrigée qui est jouée (son md5 est dans l'en-tête de la sortie).
8. **§3.2, le compte « avant » du mandat se confirme** : 10 échecs en R, I et Z, et 2 en S. La partie W en ajoute 2. Au total, 59 vérifications et 14 échecs (§4).

## 2 · LE DIFF, EN ENTIER (contre la production ; aussi dans `diff-8771-production-vers-corrigee.diff`)
```diff
@@ -17456,6 +17456,7 @@
 const S = window.S = { si: 0, di: 0, heure: 1, taille: 1, page: null, pageManuelle: false, mode: null, gel: null, loupe: null, bandeau: '', ecoule: 0, vue: 1, blocActif: null,
   parts: [], cand: null, notesFil: [], comm: {}, appel: {}, decisions: {}, reserve: [], notionsImprevues: {}, travail: { terminer: [], preparer: [], apprendre: null, prevu: true, libre: '' }, echeance: null, motAbsents: '',
   cle: 'portable', tab: 'fenetre', doc: null, videoPos: {}, t5: false, close: false, versements: {}, mur: null, attente: null };
+const DR_S_DEFAUT = JSON.parse(JSON.stringify(S));   /* C16 (la reprise de la 8.77.1-⑩, dette ⑪) : l'état d'une heure neuve — ce qu'une liste vide, un objet vide ou une valeur nulle redevient à la relecture du vrai hub (dr_etatRempli) */
 
 const parDiapo = {};
  const vuMax = {};
@@ -19503,7 +19504,7 @@
     if (!dr_clPeutEcrire(true)) return;
     const ecr = JSON.parse(JSON.stringify(seance().ecrans)); const em = dr_empreinte(ecr);
     if (em === DR_CL.empreinteEcrite) return; DR_CL.empreinteEcrite = em;   /* la copie ne repart que si elle a changé (relecteur neuf n°2 : 14 écritures en 17 min sans rien éditer) */
-    dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — copie au fil de l’eau (' + AT_DR_COURS.classeNom + ')', () => { dr_temoinIntegre(em); });
+    dr_ecrire(dr_cheminC() + '/ecrans', ecr, 'Séance en classe — copie au fil de l’eau (' + AT_DR_COURS.classeNom + ')', () => { dr_temoinIntegre(em, ecr); });
   }, vite ? 0 : 900);
   dr_journalAuto(vite); dr_etatAuto(vite); dr_traceAuto(vite);
 }
@@ -19525,9 +19526,16 @@
 }
 /* le témoin « déroulé intègre » (R9) : l'empreinte de ce qui a été écrit, comparée à ce que le hub rend */
 function dr_empreinte(x){ const s = JSON.stringify(x); let h = 0; for (let j = 0; j < s.length; j++) h = ((h << 5) - h + s.charCodeAt(j)) | 0; return s.length + '-' + (h >>> 0).toString(36); }
-function dr_temoinIntegre(em){
-  dr_lire(dr_cheminC() + '/ecrans', v => { DR_CL.empreinte = em; DR_CL.relue = v ? dr_empreinte(v) : ''; const t = document.getElementById('dr-integre'); if (!t) return;
-    const ok = DR_CL.relue === em; t.textContent = ok ? '● déroulé intègre' : '● déroulé à vérifier'; t.className = ok ? 'dr-integre-ok' : 'dr-integre-ko';
+/* C16 (dette ⑰) : le vrai hub range la copie à sa façon — ni valeur nulle, ni liste ni objet vides (ni leur parent devenu vide), une liste rangée par ses rangs, les
+   clés dans son ordre (mesuré sur le code de Firebase 8.10.1 sans réseau : relu, `{eid, act, role, blocs}` revient `{act, blocs, eid, role}`). L'écrit et le relu
+   sont rangés de la même façon avant l'empreinte : ce que le hub retire ou réordonne n'est plus une alerte ; une vraie différence (une écriture perdue, la
+   liaison coupée) reste « à vérifier ». */
+function dr_commeLeHub(v){ if (v === null || v === undefined || typeof v === 'function' || (typeof v === 'number' && !isFinite(v))) return undefined; if (typeof v !== 'object') return v;
+  const o = {}; (Array.isArray(v) ? v.map((x, i) => String(i)) : Object.keys(v)).sort().forEach(k => { const r = dr_commeLeHub(v[k]); if (r !== undefined) o[k] = r; }); return Object.keys(o).length ? o : undefined; }
+function dr_empreinteHub(x){ const y = dr_commeLeHub(x); return y === undefined ? '' : dr_empreinte(y); }
+function dr_temoinIntegre(em, ecrit){
+  dr_lire(dr_cheminC() + '/ecrans', v => { DR_CL.empreinte = em; DR_CL.relue = v ? dr_empreinteHub(v) : ''; const t = document.getElementById('dr-integre'); if (!t) return;
+    const ok = DR_CL.relue === dr_empreinteHub(ecrit); em = DR_CL.relue || em; t.textContent = ok ? '● déroulé intègre' : '● déroulé à vérifier'; t.className = ok ? 'dr-integre-ok' : 'dr-integre-ko';
     t.title = ok ? 'Ce que la classe a vu est au hub, bit pour bit : la copie écrite et la copie relue ont la même empreinte (' + em + ').' : 'La copie relue au hub n’est pas celle qui vient d’être écrite : la liaison est lente ou coupée. Rien n’est perdu ici ; le site réessaie au prochain geste.'; });
 }
 
@@ -19708,6 +19716,20 @@
 
 /* ─── reprendre en pleine heure : `C/etat` + `C/journal` + `H` (la règle de `_drTraceReprendre`) ─── */
 function dr_lireTous(chemins, cb){ const r = new Array(chemins.length); let n = chemins.length; chemins.forEach((c, k) => dr_lire(c, v => { r[k] = v; if (--n === 0) cb(...r); })); }
+/* C16 (la reprise de la 8.77.1-⑩, dette ⑪) — LE VRAI HUB (Firebase Realtime Database) ne range ni une valeur nulle, ni une liste vide, ni un objet vide : relu,
+   l'état d'une heure n'a plus ses `lum: []`, `ecr: []`, `reps: {}`… (par diapo), ni ses `parts: []`, `travail.terminer: []`, `gel: null`… — mesuré par le geste
+   sur un faux hub rangé comme le vrai : la reprise s'arrêtait sur « Cannot read properties of undefined (reading 'slice') » (etatComplet0) et la diapo ne se
+   dessinait plus. Relu, l'état reprend ce qui manque : par diapo, l'état d'une diapo neuve (etatDiapo) ; pour S, l'état d'une heure neuve (DR_S_DEFAUT : les
+   listes, les objets et les valeurs nulles, jamais ce que l'écriture retire exprès — DR_ETAT_HORS). Le modèle : dr_etatRempli / dr_parDiapoRempli de la nouvelle version. */
+const dr_estObjet = x => !!x && typeof x === 'object' && !Array.isArray(x);
+function dr_etatRempli(s){ if (!dr_estObjet(s)) return s; const hors = DR_ETAT_HORS;
+  const rem = (d, o) => { Object.keys(d).forEach(k => { const v = d[k]; if (o[k] === undefined) { if (v === null || typeof v === 'object') o[k] = JSON.parse(JSON.stringify(v)); } else if (dr_estObjet(v) && dr_estObjet(o[k])) rem(v, o[k]); }); };
+  try { const d2 = {}; Object.keys(DR_S_DEFAUT).forEach(k => { if (hors.indexOf(k) < 0) d2[k] = DR_S_DEFAUT[k]; }); rem(d2, s); } catch (e) {} return s; }
+function dr_parDiapoRempli(pd){ if (!dr_estObjet(pd)) return {}; Object.keys(pd).forEach(k => { const x = dr_estObjet(pd[k]) ? pd[k] : {};
+  pd[k] = Object.assign({ nDev: 0, lum: [], ecr: [], reps: {}, tailles: {}, textes: {}, fsBloc: {} }, x);
+  ['lum', 'ecr'].forEach(n => { if (!Array.isArray(pd[k][n])) pd[k][n] = dr_estObjet(pd[k][n]) ? Object.keys(pd[k][n]).sort((a, b) => a - b).map(i => pd[k][n][i]).filter(v => v != null) : []; else pd[k][n] = pd[k][n].filter(v => v != null); });
+  ['reps', 'tailles', 'textes', 'fsBloc'].forEach(n => { if (pd[k][n] == null || typeof pd[k][n] !== 'object') pd[k][n] = {}; }); });
+  return pd; }
 function dr_reprendre(cb){
   const C = dr_cheminC(), ch = dr_cheminH(); if (!C || !ch) { if (cb) cb(false); return; }
   dr_lireTous([C + '/ecrans', C + '/etat', C + '/journal', ch], (copie, etat, jr, t) => {   /* les quatre lectures ensemble (contrôle n°68) — avant : l'une après l'autre */
@@ -19717,7 +19739,7 @@
     dr_finAvecCahier();
     if (!dr_appliquerHeures(dr_duHub(etat.heures || {}), etat.heuresParDurees, dr_duHub(etat.reactivations || {})) && !(etat.heures && Object.keys(etat.heures).length)) dr_partagerHeures(dr_utileCreneau(dr_creneauDuCours(AT_DR_COURS)));   /* réveil n°4, 3 : … */
     if (t && (t.clos || (t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS)))) { if (cb) cb(false); return; }
-    dr_restaurer({ S: dr_duHub(etat.S), parDiapo: dr_duHub(etat.parDiapo || {}), vuMax: dr_duHub(etat.vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub) });
+    dr_restaurer({ S: dr_etatRempli(dr_duHub(etat.S)), parDiapo: dr_parDiapoRempli(dr_duHub(etat.parDiapo || {})), vuMax: dr_duHub(etat.vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub) });
     DR_CL.sur = ((dr_heureJouee(S.heure) || {}).sur) || DR_CL.sur || 1;   /* N revient avec l'heure */
@@ -19776,7 +19798,7 @@
   dr_lire(C + '/ecrans', ecr => dr_lire(C + '/etat', et => dr_lire(C + '/journal', jr => {
     if (!et && !jr) { cb(null); return; }
-    cb({ ecrans: Array.isArray(ecr) ? ecr : null, S: dr_duHub((et || {}).S || {}), parDiapo: dr_duHub((et || {}).parDiapo || {}), vuMax: dr_duHub((et || {}).vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub), maj: (et || {}).maj || null, heures: … (inchangé)
+    cb({ ecrans: Array.isArray(ecr) ? ecr : null, S: dr_etatRempli(dr_duHub((et || {}).S || {})), parDiapo: dr_parDiapoRempli(dr_duHub((et || {}).parDiapo || {})), vuMax: dr_duHub((et || {}).vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub), maj: (et || {}).maj || null, heures: … (inchangé)
   })));
 }
```
*(Deux fins de ligne très longues et inchangées sont abrégées ici par « … » ; le fichier `.diff` les donne entières : 28 lignes ajoutées, 6 retirées.)*

## 3 · COMMENT C'EST CORRIGÉ
- **Les lecteurs (dette ⑪).** Je reprends le modèle de la nouvelle version (`dr_etatRempli`, `dr_parDiapoRempli`, NOTE des quatre dettes §2.2) à l'identique, à une différence près : la liste « hors » est `DR_ETAT_HORS`, celle que la 8.77.1-⑩ retire elle-même à l'écriture (`mur`, `attente`, `anim`, `coupure`, `di`, `ordres`, `repSnap`, `blocActif`, `cand`) ; ces clés ne sont donc jamais remises.
  - Chaque diapo reprend l'état d'une diapo neuve (`nDev: 0`, `lum: []`, `ecr: []`, `reps: {}`, `tailles: {}`, `textes: {}`, `fsBloc: {}`), en gardant tout ce que le hub a rendu. Pour `ecr`, la valeur reprise est `[]`, et non le « à écrire » de la trame (`dr_ecrDeLaTrame`) : le hub n'a retiré qu'une liste qui était vide.
  - `S` reprend, de l'état d'une heure neuve, les listes, objets et valeurs nulles qui manquent, à tous les niveaux (`travail.terminer`…). Ce que le hub a rendu n'est jamais écrasé.
  - Au faux hub ordinaire, rien ne manque : rien ne change.
- **Le témoin (dette ⑰).** `dr_commeLeHub` range une valeur comme le hub la garde, et l'empreinte compare l'écrit et le relu rangés de la même façon. L'infobulle montre l'empreinte comparée ; son texte est inchangé.

## 4 · LES VÉRIFICATIONS, COMPTÉES DANS LES SORTIES (`sorties/`)
Les sondes : `sonde/mesure-c16-reprise.mjs` est la sonde des quatre dettes avec la partie W de la conscience, copiée telle quelle. `sonde/sonde-reprise-8771.mjs` est la même sonde, avec mes parties V, F et N ajoutées et deux interrupteurs au faux hub (écriture perdue, écriture refusée), éteints par défaut. Les deux se jouent depuis un dossier de `deroule/diapos-ouverture` à `1cc67a1` (`LIVRAISONS/DEROULE-01-11/QUATRE-DETTES/`), en lecture seule ; ici, ce ne sont que des copies. La nouvelle version jouée à côté est l'assemblé de `1cc67a1` (md5 `14f17cc2014e21e0bf85e211f3297469`). Chaque partie a été jouée seule sur la machine, un navigateur à la fois.

%%VERIFS%%

## 5 · CE QUI RESTE OUVERT
%%OUVERT%%

## 6 · LES POUSSÉES (`reprise/8771`)
%%POUSSEES%%
