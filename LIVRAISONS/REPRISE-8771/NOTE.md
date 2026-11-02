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
--- a/index.html (la production, 8.77.1-⑩, md5 db481a8725124c7782c031e9e6485e82)
+++ b/LIVRAISONS/REPRISE-8771/index.html (la 8.77.1-⑩ corrigée, md5 f70b6661243038482c9b0280c379ca71)
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
     if (!dr_appliquerHeures(dr_duHub(etat.heures || {}), etat.heuresParDurees, dr_duHub(etat.reactivations || {})) && !(etat.heures && Object.keys(etat.heures).length)) dr_partagerHeures(dr_utileCreneau(dr_creneauDuCours(AT_DR_COURS)));   /* réveil n°4, 3 : les frontières de l'heure telles qu'elles étaient (avant : recalculées, la diapo 7 repassait à l'heure 1) */
     if (t && (t.clos || (t.classe && t.classe !== AT_DR_COURS.classeNom) || (t.creneau && t.creneau !== dr_creneauDuCours(AT_DR_COURS)))) { if (cb) cb(false); return; }
-    dr_restaurer({ S: dr_duHub(etat.S), parDiapo: dr_duHub(etat.parDiapo || {}), vuMax: dr_duHub(etat.vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub) });
+    dr_restaurer({ S: dr_etatRempli(dr_duHub(etat.S)), parDiapo: dr_parDiapoRempli(dr_duHub(etat.parDiapo || {})), vuMax: dr_duHub(etat.vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub) });
     DR_CL.sur = ((dr_heureJouee(S.heure) || {}).sur) || DR_CL.sur || 1;   /* N revient avec l'heure */
     const hc = dr_heureJouee(S.heure); if (hc && typeof HEURES_SIM === 'object') HEURES_SIM[S.heure] = hc; else dr_heurePoser(S.heure, AT_DR_COURS, t && t.debutReel);
     S.debutReel = (t && t.debutReel) || S.debutReel || Date.now();
@@ -19776,7 +19798,7 @@
   const C = chemin || (typeof dr_cheminC === 'function' ? dr_cheminC() : null); if (!C) { cb(null); return; }
   dr_lire(C + '/ecrans', ecr => dr_lire(C + '/etat', et => dr_lire(C + '/journal', jr => {
     if (!et && !jr) { cb(null); return; }
-    cb({ ecrans: Array.isArray(ecr) ? ecr : null, S: dr_duHub((et || {}).S || {}), parDiapo: dr_duHub((et || {}).parDiapo || {}), vuMax: dr_duHub((et || {}).vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub), maj: (et || {}).maj || null, heures: dr_duHub((et || {}).heures || {}), reactivations: dr_duHub((et || {}).reactivations || {}), heuresParDurees: (et || {}).heuresParDurees || 0 });
+    cb({ ecrans: Array.isArray(ecr) ? ecr : null, S: dr_etatRempli(dr_duHub((et || {}).S || {})), parDiapo: dr_parDiapoRempli(dr_duHub((et || {}).parDiapo || {})), vuMax: dr_duHub((et || {}).vuMax || {}), J: (Array.isArray(jr) ? jr : []).map(dr_duHub), maj: (et || {}).maj || null, heures: dr_duHub((et || {}).heures || {}), reactivations: dr_duHub((et || {}).reactivations || {}), heuresParDurees: (et || {}).heuresParDurees || 0 });
   })));
 }
 
```
*(Le diff entier, tel que `diff -u` le donne contre la production : 28 lignes ajoutées, 6 retirées ; le même dans `diff-8771-production-vers-corrigee.diff`.)*

## 3 · COMMENT C'EST CORRIGÉ
- **Les lecteurs (dette ⑪).** Je reprends le modèle de la nouvelle version (`dr_etatRempli`, `dr_parDiapoRempli`, NOTE des quatre dettes §2.2) à l'identique, à une différence près : la liste « hors » est `DR_ETAT_HORS`, celle que la 8.77.1-⑩ retire elle-même à l'écriture (`mur`, `attente`, `anim`, `coupure`, `di`, `ordres`, `repSnap`, `blocActif`, `cand`) ; ces clés ne sont donc jamais remises.
  - Chaque diapo reprend l'état d'une diapo neuve (`nDev: 0`, `lum: []`, `ecr: []`, `reps: {}`, `tailles: {}`, `textes: {}`, `fsBloc: {}`), en gardant tout ce que le hub a rendu. Pour `ecr`, la valeur reprise est `[]`, et non le « à écrire » de la trame (`dr_ecrDeLaTrame`) : le hub n'a retiré qu'une liste qui était vide.
  - `S` reprend, de l'état d'une heure neuve, les listes, objets et valeurs nulles qui manquent, à tous les niveaux (`travail.terminer`…). Ce que le hub a rendu n'est jamais écrasé.
  - Au faux hub ordinaire, rien ne manque : rien ne change.
- **Le témoin (dette ⑰).** `dr_commeLeHub` range une valeur comme le hub la garde, et l'empreinte compare l'écrit et le relu rangés de la même façon. L'infobulle montre l'empreinte comparée ; son texte est inchangé.

## 4 · LES VÉRIFICATIONS, COMPTÉES DANS LES SORTIES (`sorties/`)
Les sondes : `sonde/mesure-c16-reprise.mjs` est la sonde des quatre dettes avec la partie W de la conscience, copiée telle quelle. `sonde/sonde-reprise-8771.mjs` est la même sonde, avec mes parties V, F et N ajoutées et deux interrupteurs au faux hub (écriture perdue, écriture refusée), éteints par défaut. Les deux se jouent depuis un dossier de `deroule/diapos-ouverture` à `1cc67a1` (`LIVRAISONS/DEROULE-01-11/QUATRE-DETTES/`), en lecture seule ; ici, ce ne sont que des copies. La nouvelle version jouée à côté est l'assemblé de `1cc67a1` (md5 `14f17cc2014e21e0bf85e211f3297469`). Mes sondes ont tourné l'une après l'autre, avec un navigateur à la fois, sauf trois essais de mise au point de V (après seulement) que j'ai lancés pendant la sonde « après » R à W, entre 06:43 et 06:48. La machine était partagée : l'autre exécutant d'abord, puis le banc de la conscience à partir de 06:51. Je n'ai fait aucune mesure de temps.

1. **Avant : la 8.77.1-⑩ de la production, au faux hub rangé comme le vrai, parties R, I, T, B, X, Z, S, W** (`1-avant-production-db481a87-vrai-hub-R-I-T-B-X-Z-S-W.txt`) — **59 vérifications, 14 échecs** : R 7 (R2 ×5, R3 ×2), I 2 (I3 ×2), Z 1, S 2, W 2 ; T 11, B 6 et X 4 passent. Chaque fois c'est la même erreur : « Cannot read properties of undefined (reading 'slice') ». Dans W, après « Reprendre », la page montre « Diapo 1 sur 12 · présentation du chapitre » et « 0 / 3 dévoilés » au lieu de « Diapo 5 sur 12 » et « 2 / 6 dévoilés » ; ensuite →, la vignette, → : rien ne bouge, et chaque geste lève une erreur.
2. **Après : la 8.77.1-⑩ corrigée, mêmes parties, même hub** (`2-apres-corrigee-f70b6661-vrai-hub-R-I-T-B-X-Z-S-W.txt`) — **59 vérifications, 0 échec** : R 23 / 0, I 8 / 0, T 11 / 0, B 6 / 0, X 4 / 0, Z 1 / 0, S 4 / 0, W 2 / 0. Dans W, après F5 et « Reprendre », la page montre « Diapo 5 sur 12 · heure 1 » et « 2 / 6 dévoilés » ; → donne « 3 / 6 », la vignette ramène à la diapo 5, → donne « 4 / 6 », sans aucune erreur JS. Le témoin est vert (« ● déroulé intègre », capture `W-enligne-3-apres-reprendre.png`).
3. **V, F et N au faux hub rangé comme le vrai, avant / après** (`3-V-F-N-vrai-hub-avant-db481a87-apres-f70b6661.txt`) — 20 vérifications, 6 échecs. Pour V et F : **avant 8 vérifications et 5 échecs, après 8 et 0**. Pour N : 4 vérifications et 1 échec brut, qui tombe à 0 différence une fois recompté (point N ci-dessous).
   - **V, le témoin (dette ⑰).** Avant : « ● déroulé à vérifier » dès le lancement et à chacun des 24 gestes relevés (▶ dans tout le début de séance, une frappe dans la diapo, la durée d'une activité changée), alors que rien n'est perdu ; c'est la dette ⑰ mesurée. Après : « ● déroulé intègre » aux 24 gestes. Quand la copie écrite au lancement est perdue par le hub (acceptée, pas gardée), les deux versions disent « ● déroulé à vérifier ». Après F5 et « Reprendre », la copie se réécrit et elle est gardée : la version corrigée revient à « ● déroulé intègre » sans erreur ; l'avant tombe sur « reading 'slice' ». Quand la copie du lancement est refusée (401), c'est mesuré et rapporté : dans les deux versions, le témoin reste vide (il n'a jamais été posé) et la liste des échecs du site en compte 1 (§5).
   - **F, le geste de la classe jusqu'au bout.** On fait F5 en pleine heure (diapo 5, « 2 / 6 dévoilés »), puis « Reprendre », ▶ jusqu'à « Fin de l'heure » et « Clore l'heure ». Avant : la page revient à la diapo 1 (« 0 / 3 »), ▶ ne bouge plus, et les erreurs « reading 'slice' » s'enchaînent. Après : la page revient à la diapo 5 (« 2 / 6 »), 15 gestes mènent à la diapo 12, l'heure est close au hub, sans aucune erreur JS ni boîte système.
   - **N, ce que la correction ne doit pas casser.** Une heure neuve en mode test, lancée par la case de l'emploi du temps, ▶ jusqu'à la fin, « Clore l'heure », jouée avec chaque version seule. Résultat : **37 / 37 écrans identiques** (le numéro, le compteur, le texte de la diapo) et **42 / 42 écritures au faux hub** aux mêmes adresses, dans le même ordre (`/site/tableau_test/scene`, `/ecrans`, `/pointeur`), avec le même hub à la fin et aucune erreur JS. 36 de ces écritures ne diffèrent que par deux champs de la scène du tableau : `origine` (l'identité de la page, tirée au hasard à chaque ouverture) et `ts` (l'instant de l'écriture, à quelques millisecondes près). Recomptées sans ces deux champs : **0 différence** (`5-N-vrai-hub-recompte-hors-origine-ts.txt`). La sonde les met désormais à part elle-même et les compte (le passage au hub ordinaire, point 7).
4. **Le témoin contre le code même de Firebase 8.10.1, sans réseau** (`4-essai-temoin-sdk-firebase-8.10.1.txt`, `4-essai-ordre-sdk-firebase-8.10.1.txt`). La copie que la 8.77.1-⑩ a écrite en classe pendant V (25 diapos, 12 989 caractères) est relue avec 12 919 caractères. Le témoin d'avant (le texte JSON tel quel) dit « à vérifier » ; le témoin corrigé dit « intègre ». Avec une lettre changée dans la copie relue, ou sans rien au hub, il dit « à vérifier ». Sur le même SDK, les clés reviennent triées (`{eid, act, role, blocs}` → `{act, blocs, eid, role}`) et les `null` et `[]` disparaissent.
5. **Au faux hub ordinaire, S et W, la version corrigée** (`6-apres-corrigee-f70b6661-hub-ordinaire-S-W.txt`) — **6 vérifications, 0 échec** (S 4 / 0, W 2 / 0).
6. **La sonde du retour sûr, avec la version corrigée en guise de 8.77.1-⑩** (`7-retour-sur-corrigee-f70b6661-R-I-T-B-X-G.txt`, faux hub ordinaire) — **61 vérifications, 0 échec** : R 23, I 8, T 11, B 6, X 4, G 9. C'est le compte de la NOTE des quatre dettes (61 / 0).
7. **Les deux lecteurs ajoutés, essayés seuls** (`4-essai-remplissage.txt`, tirés tels quels du fichier). Sur un `S` relu sans ses vides, `parts`, `gel`, `travail.terminer`, `travail.preparer`, `travail.apprendre` et `comm` reviennent ; `mur`, `cand`, `attente`, `di` et `ordres` ne sont jamais remis ; ce que le hub a rendu reste tel quel. Chaque diapo reprend `lum`, `ecr`, `reps`, `tailles`, `textes` et `fsBloc`, et une liste rangée en objet (`{"0":3,"2":5}`) redevient une liste.
8. **V et N au faux hub ordinaire, avant / après** (`8-V-N-hub-ordinaire-avant-db481a87-apres-f70b6661.txt`) — **14 vérifications, 0 échec**. Sur ce hub, le témoin dit déjà « ● déroulé intègre » avant la correction, aux 24 gestes : la fausse alerte ne vient que de la façon de ranger du vrai hub. La copie perdue donne « à vérifier », puis « intègre » après F5 et « Reprendre », dans les deux versions ; la copie refusée laisse le témoin vide, avec 1 échec dans la liste du site, dans les deux versions. Pour N : 37 / 37 écrans identiques, 42 / 42 écritures identiques une fois `origine` et `ts` de la scène mis à part (36 écritures ne diffèrent que par ces deux champs, comptés par la sonde), le même hub à la fin, aucune erreur JS.
- **Aucune erreur JS ni aucune boîte système** pour la 8.77.1-⑩ corrigée, dans aucune des sorties ci-dessus. La seule boîte comptée est « Quitter le site ? » du navigateur au F5, que Paul accepte ; la sonde la compte à part, comme dans la NOTE des quatre dettes.
- **Les captures** (jamais poussées) sont dans `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/c16-reprise-8771/` : `avant-vrai/` et `apres-vrai/` (R à W), `vfn-vrai/` (V, F, N), `apres-ordinaire/` (S, W), `retour/`, `vn-ordinaire/`.

## 5 · CE QUI RESTE OUVERT
1. **Une écriture de la copie refusée par le hub (401), ou la liaison coupée.** Le témoin n'est pas recalculé : seule une écriture acceptée l'appelle (mission 0, point 5 ; c'était déjà le cas avant, et c'est hors des lecteurs). Mesuré : quand la copie du lancement est refusée, le témoin reste vide et la liste des échecs du site en compte 1, à l'identique dans les deux versions. Un refus en pleine heure n'est pas mesuré par le geste : dans la 8.77.1-⑩, aucun geste de classe ne réécrit la copie avant la reprise ou la clôture. D'après le code, le témoin garderait alors ce que disait la dernière écriture acceptée ; je ne sais pas ce que Paul voit dans ce cas. Pour qu'il dise « à vérifier » sur un refus, il faudrait brancher le chemin d'échec de `dr_ecrire` : c'est un mandat à part, si Paul le veut.
2. **Le vrai hub lui-même n'est ni lu ni écrit** (c'est interdit). Sa façon de ranger est rejouée de deux manières : par le faux hub de la sonde (les `null` et les vides retirés, les listes rangées par rangs) et par le code de Firebase 8.10.1 sans réseau. Le faux hub garde l'ordre des clés : la part « clés triées » du témoin n'est donc prouvée que sur le SDK, avec la copie réellement écrite en classe, et pas par un geste dans une page.
3. **La copie (`C/ecrans`) et le journal (`C/journal`), relus du vrai hub, perdent aussi leurs listes vides** (par exemple `comp: []` sur 6 diapos de la copie). Le mandat vise l'état de l'heure, et je n'y ai rien ajouté. Mesuré par le geste : R, I, S, W et F passent avec la copie et le journal tels que ce hub les rend. Je ne sais pas si un geste plus rare, hors de ces parties, en lit un sans valeur par défaut.
4. **Les clés de `S` que pose `lancerHeure` sans qu'elles soient dans l'état neuf** (`finFaites`, `paliers`, `palier`, `encart`…). Elles sont lues avec une valeur par défaut aux endroits que j'ai lus, et F mène l'heure reprise jusqu'à « Clore l'heure » sans erreur. Les étapes de « Fin de l'heure » une à une (l'échéance, le cahier de textes, la copie pour ED) ne sont pas rejouées après une reprise : pas mesuré.
5. **La partie N compare les écritures sans `origine` ni `ts` de la scène du tableau** (l'identité de la page, l'instant). Ces deux champs changent d'une page à l'autre, même avec le même fichier ; ils sont comptés à part dans la sortie.

## 6 · LES POUSSÉES (`reprise/8771`)
- `9809147` : le fichier corrigé et le diff contre la production (06:36).
- `1f10aa6` : les sorties avant / après au faux hub rangé comme le vrai (R à W) et les sondes jouées.
- `c1ea18c` : V, F et N au faux hub rangé comme le vrai ; les essais sur le SDK.
- `99609c1` : le hub ordinaire (S, W), le retour sûr, l'essai du remplissage.
- La dernière poussée : V et N au hub ordinaire, et cette NOTE complète.
