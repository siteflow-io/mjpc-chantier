# E1 — AUDIT DU MANDAT (mission 0, contrat §11)

*E1, exécutant du socle et de l'Atelier, 21/10/2026. Confrontation du contrat (`CONTRAT.md`), du plan (`PLAN-INTEGRATION-DEROULE.md`) et du mandat E1 (`MANDAT-E1-SOCLE-ATELIER.md`) au code réel. Rien n'est réécrit ici : un verdict par point, la mesure qui le fonde. Ce qui est contesté attend la réponse de la conscience dans `RELANCES/E1.md` ; je continue sur le reste.*

## 0 · Les objets mesurés

| objet | où | md5 mesuré | taille | verdict |
|---|---|---|---|---|
| production | `siteflow-io/monsieurjaipascompris` → `index.html` (clone du 21/10) | `ac792b28f40d3a0510e725fc4a6b6985` | 1 838 175 o, 22 389 lignes | **tient** |
| maquette p8-5g | sas, `deroule/p8-5g` → `maquette-pilotage-ordi-v9c15p8-manipulable.html` | `62d9557ac8fedcfbdd8b157a2588cbee` | 605 996 o, 1 836 lignes | **tient** (294 fonctions de premier niveau, mesurées à l'analyseur `acorn`) |
| moteur embarqué | `AT_DR_B64` (l. 15842 de la production), décodé | `e7ceefa87d9bce00ebcf860cfa636d9f` | 229 975 o | **= `DEROULE/deroule97.html` octet pour octet** (voir F1) |

Outils de mesure (rejouables) : `E1/outils/inventaire.mjs` (déclarations de premier niveau de chaque `<script>`, par `acorn`), `E1/outils/appels.mjs` (qui appelle une fonction qui tombe), `E1/outils/plages.mjs` (les fonctions de la maquette par plage du contrat §6).

---

## 1 · CE QUI EST FAUX

**F1 — « les 157 fonctions de `deroule86` » (contrat §11.3, mandat E1 mission 0, plan 0.1).** `DEROULE/deroule86.html` (md5 `2ffada12…`) a **156** fonctions nommées. Le moteur réellement embarqué en production est **`deroule97`** (157 fonctions : `deroule86` + `function etat`). La relecture une à une porte donc sur `deroule97` (ce que Paul a réellement joué), section 6. Verdict : **faux, parce que** le nom du fichier est celui de l'ancêtre ; le compte (157) est celui de `deroule97`.

**F2 — « 8 globales en collision » (`collisions.json`, contrat §7, mandat E1 point 3).** Aucune des huit n'est une globale du site : `esc` (l. 5663 et 5937), `tout` (5121, 17201), `tirer` (5470), `presents` (5667), `garde` (12809), `prenom` (16984), `candidats` (17082), `palier` (21503) sont **des variables ou fonctions locales, indentées dans des fonctions** du site. Elles ne peuvent pas entrer en collision avec une globale de la maquette. Mesuré deux fois : (a) toutes les déclarations de premier niveau des scripts de la production (1 600, dont 1 304 fonctions) contre celles de la maquette (389 noms) → **0 nom commun** ; (b) la règle même de `collisions.mjs` (déclaration en début de ligne) sur la production contre la maquette brute → **0**. Verdict : **faux, parce que** la mesure de départ a compté des locales. Conséquence : le préfixe `dr_` de ces huit noms ne sert à rien ; il ne nuit pas non plus — **je l'applique quand même** (contrat §7, coût nul, et `tout`/`garde`/`palier` sont ainsi nommés sans ambiguïté), sauf contre-ordre.

**F3 — « 14 classes CSS en collision » (contrat §7).** Mesuré par la règle de `collisions.mjs` sur la maquette brute contre la production : **12** (`n h d page seq c pp ok g err chip warn`) ; `on` et `html` n'y sont pas (le site ne les a que dans des sélecteurs composés : `.tprof-testpill.on`, `.lens-pill.on`, `.ses-tab-perdu.on`, `.ses-incident.on`, `.elf-segb.on`, `.doc-icon.html`). Seules **deux** classes du site touchent réellement des éléments de la maquette : **`.page{display:none;position:relative;min-height:100vh}`** (globale : elle cacherait le compteur « page i / n ») et **`.chip{display:inline-flex…}`** ; les autres ne valent que sous des conteneurs du site (`.ses-tab-attente .d`, `.edt-an-j .n`, `.edt-an-b .ok`, `.edt-an-pas .pp`…) ou en composé. Verdict : **incomplet** : le vrai danger n'est pas le nom, c'est le CSS global de la maquette (F4) et la règle `.page` du site.

**F4 — ce que le contrat ne mesure pas : le CSS global de la maquette casserait le site.** La maquette pose `*{box-sizing:border-box}`, `html,body{height:100%}`, `body{margin:0;background:…;font-family:'EB Garamond'…;overflow:hidden}`, `button{font:inherit;cursor:pointer}`. Copié tel quel dans `dr.css`, le site entier perd son défilement (`overflow:hidden` sur `body`) et sa police. Et ses 839 sélecteurs (413 classes) s'appliqueraient à tout élément du site qui porte une de ces classes (`.btn`, `.menu`, `.corps`, `.titre`…), même sans collision **de règle**. Verdict : **manque** au contrat §7. Ce que je fais (non contesté, c'est la règle n°7 « bloc scellé ») : **tout le CSS de la maquette est circonscrit à `#dr-zone`** (chaque sélecteur préfixé ; `html`/`body` → `#dr-zone` ; `body.gel X` → `body.gel #dr-zone X`), les variables `:root` restent globales (aucune n'existe dans le site : 0 nom commun mesuré).

**F5 — contradiction dans le contrat §7 lui-même : `.page` « ne change pas de nom » ET fait partie des 14 « préfixées `dr-` ».** Les contrôles de la conscience lisent `#mur .page` (K6, K7, K8, K11 : `lireMur`), et `#garde.on` (le geste `garde()`, `classList.contains('on')`). Préfixer `page` ou `on` casserait les contrôles ; ne pas préfixer `page` laisse `collisions.mjs` à 1 et la règle `.page{display:none}` du site cacher le compteur. Verdict : **contradictoire**. Ce que je fais : les éléments portent **les deux classes** (`page dr-page`) ; `dr.css` n'écrit que `.dr-page` (donc `collisions.mjs` à 0) et neutralise la règle du site dans `#dr-zone` ; `on` **garde son nom** (aucune règle `.on` seule dans le site ; K lit `#garde.on`). Les onze autres sont renommées `dr-…` dans `dr.css`, le gabarit et le code. **À trancher par la conscience** si elle préfère autre chose.

**F6 — les plages de lignes du contrat §6 (maquette p8-5g, 1 836 lignes).** Mesurées déclaration par déclaration (`plages.mjs`) :
- « **le moteur du récit 382-623** » (E4) : faux. Le récit va de **382 à 443**. **444-446** sont trois mutations de `DATA` de simulation (remobilisées, feuilles, schéma simulé : tombent avec `DATA`). **447-455** sont le socle : `$`, `normaliserTrame` (rôle « fin » posé par heure, cadrage 4 · 2.6), `DECALAGE`, `HEURES_SIM`, `T0`/`now`, `esc`, `CRANS`, `TAILLES`, `policePx`. **456-623** sont **le moteur des schémas** (`P8_*`, `p8Lignes` … `p8Frise`), qui est à E1 (« schémas 624-778 » ne commence qu'à l'Arbre).
- « **schémas 624-778** » (E1) : incomplet : les schémas commencent à **456** ; et **774-778** sont la participation (`MOTIFS`, `prenom`, `PRENOMS`, `INI`, `iniDe`, `nomDe`, `MOTIFS_PART`, `prenomUnique`), calculée depuis `ELEVES` au chargement — elle dépend de `dr_classe()` (socle).
- « **raccourcis/horloge/démarrage 1816-1835** » (E1) et « **la fenêtre tableau 1804-1815** » (E3) : faux. Le gestionnaire de touches unique commence à **1814** et finit à **1827** (une seule instruction coupée en deux territoires) ; **1828-1832** sont `heureCahier` et `tick` (le compte à rebours T-5/T-3/T-1, `palier`) : c'est l'heure (E2) ; 1805-1810 sont le panneau ⚙ (tombe) ; **1813** est « ⊞ Toutes les diapos » (`btoutes`, navigation du socle). E3 n'a en propre que **1811-1812** (`bvideoproj`, l'écoute `message`).
- « **relecture 1639-1803** » (E4) : incomplet : **1640-1643** sont `voir(v)` (la bascule Pilotage / Relecture / Atelier : c'est `dr_onglet`, socle), les `onclick` des trois onglets et **les raccourcis de l'atelier** (Ctrl+D dupliquer, Ctrl+Entrée insérer, Suppr, Alt+↑/↓ déplacer) : socle et Atelier (E1).
- « **atelier 973-1251** » (E1) : tient, mais contient `palier` (le palier T-5 réécrit pour la répétition, l. 1030-1034) et le versement à la clôture (`p8Verser`, `p8ListeVersement`, 1115-1136) qu'E2 appellera.
- « **mise en commun 1323-1428** » (E2) : contient `libNotion`, `libNotionEleve` (lecture de la taxonomie, utilisées par tous).
- « **nav/gardes 1252-1322** » (E1) : contient `gardeCahier`, `preparerCahier`, `revenirAuCours`, l'oral (`ouvrirOral`, `validerOral`, 7.2), `notionsTravaillees`, `remobNonTravaillees` : c'est la fin d'heure (E2) dans une plage E1.
- « **surligner/clic droit 1450-1481** » (E1) : contient `basculerQui` (« qui a participé » au tableau) et `menuDiapo` (le clic droit **de classe** : retirer de l'heure, notion imprévue, commenter) : E2/E3 dans une plage E1.
- « **l'EDT simulé 1608-1613 tombe** » : tient pour le code ; **manque** : le gabarit porte aussi `#ecran-edt` (l'écran « Emploi du temps — 3E Charles de Gaulle », `class="voile on"` : il couvre tout au démarrage) et `#fsimu` ; ils tombent avec.
Verdict d'ensemble : **faux sur quatre plages** (récit, schémas, raccourcis/horloge, tableau), **incomplet sur cinq**. Ce que je fais (découpage mécanique, mandat point 2) : je découpe **par les frontières réelles** ci-dessus, chaque morceau dans le module de son propriétaire ; ce qui est dans une plage d'un autre territoire mais est du socle va dans `dr-socle.js` ; la table exacte (ligne → module) est dans `E1/decouper.mjs` et dans `JOURNAL.md`. Le propriétaire déplace ce qui lui revient (contrat §3).

**F7 — « la trame réelle de la séance 0 de 3e : 19 diapos dans le volet » (mandat point 7).** Le faux hub (`hub/site_3e.json`) a **18** écrans pour la séance 0 (95 sur 9 séances : 18·17·15·14·14·3·6·5·3). La maquette en a **19** parce que la n°12 y a ajouté la diapo vidéo de simulation `e-video-radeau`. Sur la trame réelle, `normaliserTrame` (cadrage 4 · 2.6) ajoute **une** diapo « fin d'heure » par heure : 18 + 1 = 19 si toutes les diapos sont dans la même heure. Verdict : **faux, parce que** 19 compte une diapo simulée ; la mesure tenable est « 18 diapos de la trame + 1 fin d'heure par heure ».

**F8 — le modèle d'écran du site (plan §3, contrat §5 `dr_trame`).** Mesuré sur le faux hub : les 95 écrans ont `act, blocs, comp, dur` ; **seuls les 18 de la séance 0** ont `eid, h, id, rev, vues` ; **aucun** n'a `heure`, `role` ni `actId` ; **aucune séance** n'a `deroule.activites`, `notes` ni `travail`. Les `eid` de la maquette (`e9fcd9fc2`…) **ne sont pas** ceux du hub (`emt9v3yqoecf9d`…). Tout ce que la maquette lit de l'heure prévue (H1/H2), des rôles (réactivation, bilan) et des activités est **de la donnée fabriquée par la n°12**. Verdict : **incomplet, il manque** la règle de lecture de ces champs absents (voir M3).

**F9 — les blocs (plan §0.2, contrat §5 `dr_blocLu`).** Le plan dit « mêmes comptes » : tient (consigne 59 · question 36 · image 6 · fiche 6 · schéma 1). Mais les correspondances sont plus que des renommages : `question.reps` est un tableau **d'objets** `{i, r, refo}` (la maquette lit des chaînes `el[]`) ; `fiche{titre, corps, def, tt}` → maquette `{txt: titre, el: [def, corps]}` ; `image{legende, ref, src, support, devoilerTout}` → `{txt: legende, ref, support, el: []}` ; les ids de bloc s'appellent `id` (10 consignes sur 59 en ont un), la maquette lit `bid`. Verdict : **tient sur le principe**, **incomplet** sur la forme (la conversion d'un tableau d'objets en un tableau de chaînes modifiable en place n'est pas un simple renommage).

**F10 — K15 « zéro écriture au hub tant qu'on n'a rien modifié » (mandat point 7).** Le parcours P1 ouvre l'emploi du temps : la production y écrit **déjà** `/corbeille/<date>/edt-mise-a-niveau-grille_<h>`, `/site/edt/grille/2026-2027`, `/site/edt/photos/2026-2027` (mesuré : `epreuves/parcours-sur-prod.txt`). L'EDT est intouchable (contrat §6). Verdict : **impossible tel quel** ; la mesure tenable : « aucune écriture `/site/<niveau>/chapitres/…` tant qu'on n'a rien modifié » (les écritures de l'EDT restent, sur leurs chemins permis).

**F11 — `AT_DR_DERNIER` (plan §2.5, « reprise »).** N'existe pas dans la production (0 occurrence). Verdict : **faux** (nom).

**F12 — `dr_lire` par `secuLire` (contrat §5).** `secuLire(chemin)` rend une **promesse** (l. 14268), pas un rappel ; l'interface `dr_lire(chemin, cb)` l'enveloppe. Verdict : **tient**, à la forme près.

## 2 · CE QUI EST CONTRADICTOIRE

**C1 — « `dr-zone` rempli par `dr_gabarit` sans la rangée `.haut` » (mandat point 4) contre le contrat §7 et K1.** La rangée `.haut` de la maquette ne porte pas que les onglets : elle porte **`#bfin`, `#btableau`, `#bvideoproj`, `#rep-stop`** (ids que le contrat §7 garde), `#bnotes`, le nom de la classe (`#hclasse`), l'heure (`#hou`), le témoin de connexion, le chrono (`#chr`, `#heure`), le chrono de la répétition, ⚙. **K1 mesure `.haut`** (`$eval('.haut')`, `$$eval('.haut *')` : l'entête tient dans le cadre, 13 · 23), et le mandat point 15 demande que « l'entête de la maquette tienne dans la zone du site ». Verdict : **contradictoire**. Ce que je fais : `.haut` reste, **sans ses onglets** (`.onglets` : ils sont ceux de la barre du site) **et sans ⚙** (`#bsimu`, simulation). À confirmer.

**C2 — la colonne : « la précédente se replie » (contrat §8.3, mandat point 13, cadrage n°7) contre le site.** `atSomPlier`/`atSomOuverte` (l. 14963-14979) sont écrits **exprès** pour que le pliage soit indépendant par séance (« le pliage est INDÉPENDANT par séance (AT_SOM_ETAT), il ne referme pas les autres » — commentaire de tête du pont, l. 14805). Verdict : **contradictoire** (le cadrage n°7 et le contrat tranchent contre un choix explicite du site). Je suis le contrat (une seule séance dépliée, l'active) en E1-b ; la conscience le confirme.

**C3 — `dr_sauve` en classe écrit `C/ecrans` (contrat §5, E1) contre `dr_copieAuto` (plan §2.3 et §3, « la copie jouée », E2).** Deux exécutants pour la même écriture. Verdict : **contradictoire**. Ce que je fais : `dr_sauve()` appelle `dr_copieAuto()` **si elle existe** (E2 l'écrit dans `dr-classe.js`) en régime classe ; sinon, en E1-a, rien n'est écrit en classe (aucune heure n'est lancée par le site avant E2).

**C4 — fonctions données à personne.** Dans la production, des fonctions qui vivent par le moteur ne sont dans **aucune** colonne du contrat §6 (ni « repris », ni « tombe ») : l'objet **`DR`** (l. 16395-16477, 5 772 o : la façade du pont, `DR.va`, `dr_exporterTrame`, `dr_ouvrir`…), **`AT_PONT`**, **`drDoc`**, `atEcranEnvoyer`/`atEcranDupliquer`/`atEcranSupprimer` (le clic droit des écrans dans la colonne, l. 16552-16582, et l'extension de table/routeur l. 16634-16665), `_sesTabComposer` (l. 17964, 4 496 o), `sesPollPilote`, `sesPartPeindre`/`sesPartMotifs`/`sesPartMotif`/`sesPartRetirer`, `sesGet`, `sesPut`, `sesArreter`, `_drCopieAuto`, `atVuesRetenir`/`atVuesRappeler`/`atVuesMonter`, `atSomEcransHtml`/`atSomAllerEcran`/`atSomOuverte`/`atSomPlier`/`atSomRafraichir`, `_drHeureCloseAu`, `_drCreneauHeure`, `_drCleHeure`, `_drBaseHeure`, `_drRangPere`, `_drEmpreinteTrame`, `atEditerChapitre*`, et le `<style id="pont-css">` (l. 22324 →). Verdict : **incomplet**. Ce que je prends (le pont, E1) : `DR`, `AT_PONT`, `drDoc`, `atEcran*` et l'extension l. 16634 (le clic droit des écrans : remplacé par celui du `#volet`), `atVues*`, `atSom*` ; à E2 : `_drCopieAuto`, `sesArreter`, `sesGet`/`sesPut` (`sesPut` tombe, 13 · 25) ; à E3 : `_sesTabComposer`, `sesPollPilote`, `sesPart*`.

**C5 — les fonctions qui restent mais qui vivent par le moteur.** `appels.mjs` : `drWin` (qui tombe) est appelé par **`_drEidDuRang`, `_drRangDeLEid`, `_drRangPere`** (gardés par le plan §4), `sesPartEmettre`, `sesTabVeillePointeur`, `sesTabPoll` (gardés, E3) ; `_drNormaliserTrame` (tombe) est appelé par **`atDrJouer`** (gardé, E2) ; `atDrMonter`/`atDrVueInterne` (tombent, E1) par `atVuesPoser` (E1, réécrit), **`atDrCloreFin`, `atDrJouerClic`** (E2) ; `atVecu*`, `atT5Veille`, `AT_DR_VECU`, `AT_T5_CHOIX` par `atDrCloreFin`, `_drPaquetHeure`, `_drTraceAuto`, `_drTraceReprendre`, `atDrJouerClic` (E2). Verdict : **contradictoire** dans le temps : si E1-a retire ce que sa colonne fait tomber, les fonctions gardées d'E2/E3 appellent du vide jusqu'à leur livraison. Ce que je fais : je retire ce qui est à moi ; **`_drEidDuRang`/`_drRangDeLEid`/`_drRangPere` sont rebranchés sur `dr_trame()`** (une ligne commentée chacune : elles lisaient `drWin().ECRANS`) ; les appels d'E2/E3 vers ce qui tombe sont laissés **gardés** (`typeof x === 'function'`) quand ils sont dans une fonction que je touche, sinon listés dans `JOURNAL.md` pour leur propriétaire.

**C6 — la plage de `voir`/onglets (E4) contre `dr_onglet` (E1, mandat point 4).** Voir F6. Verdict : **contradictoire** ; je prends `voir` (socle).

## 3 · CE QUI MANQUE

**M1 — les interfaces du socle (contrat §5) ne suffisent pas à E2-E4 :**
- **l'heure d'une heure passée** : la maquette lit `HEURES_SIM[h].{jour, debut, fin, base}` pour **chaque** heure jouée (relecture, chapitre, cahier, `now()`, `heureCahier()`) ; `dr_ctx()` ne rend que l'heure **courante**. Il manque `dr_heureDe(h)` (rendu par E1 depuis `dr_ctx()` pour l'heure courante ; les heures passées viennent des paquets `H`, E2 la complète). Je l'ajoute au socle, nommée.
- `dr_onglet(v)` et `dr_aller(i)` sont nommés au contrat (§2.2, §8.3) mais absents de la table §5 : je les écris.
- les sous-objets de la trame : `DATA.activites`, `DATA.notes`, `DATA.travailPrevu` → `B/deroule/{activites, notes, travail}` n'ont pas d'accesseur dans §5 (seul `window.dr.notes` est nommé) ; j'ajoute `dr_activites()`, `dr_notes()`, `dr_travail()` (mêmes formes que `DATA.*`).
- `DATA.classe{espaceED, lienED, prochaines}` : `dr_classe()` ne rend que `{slug, nom, eleves}` ; E4 (copie ED) et E2 (échéance) en ont besoin : `dr_classe()` rendra aussi `ed` (`/classes/<slug>/ed`) et `prochaines` (vide tant qu'E2 n'a pas `edtProchainesDe`).
- `DATA.feuilles` (les fiches liées du chapitre, p4a : « fiche non liée », « À régler ») : aucune interface, aucune source nommée dans le plan §3. **À la conscience** : où vivent les fiches d'un chapitre dans le hub (les items `doc` des séances ? les feuilles de l'atelier `/site/atelier/…` ?).
- `DATA.documents` (E4) : nommé au plan §2.5 (`sce.items`) mais sans interface ; E4 l'écrit.
- `DATA.chapitre` est **un titre** (chaîne) dans la maquette ; `dr_chapitre()` rend l'objet : chaque lecture devient `dr_chapitre().title`. `DATA.seances[si].titre` → `title` dans le site.

**M2 — `ELEVES`, `PRENOMS`, `INI` sont des `const` calculées une fois au chargement** (l. 380, 776) : changer de classe exige de les recalculer en place (contrat §5 : « recalculés par les fonctions de la maquette »). Je les garde en place (même objet, vidé puis rempli par `dr_classe()`).

**M3 — la lecture des champs d'écran absents du site** (F8) : `heure` absent → la diapo est de l'heure 1 ; `role` absent → aucun rôle (`normaliserTrame` ajoute la fin d'heure) ; `actId` absent et `activites` vide → aucune activité (la maquette rend déjà des diapos sans activité). **Rien de cela ne s'écrit au hub tant que Paul n'a rien modifié** (K15). Ce n'est écrit nulle part ; je l'applique et je le dis.

**M4 — la simulation de la maquette qui touche `DATA` au chargement** (l. 444-446 : remobilisées de démonstration, quatre feuilles et deux fiches liées/non liées, un objet inconnu et une page sans contrat sur « Trois mots pour la frise », un schéma simulé) : non listée au mandat point 2 ; elle tombe avec `DATA`.

**M5 — un geste de la maquette qui tombe sans qu'on le dise : « Lancer l'animation en accéléré »** (`s-anim`, cadrage 1 · 6.4 bis : « dans la maquette, un bouton qui joue l'heure toute seule ») est dans `#fsimu`, qui tombe. Le cadrage le dit « dans la maquette » : il tombe. **Je le signale** (Paul l'a nommé).

**M6 — la table B du recyclage** : section 6 ci-dessous (la relecture des 157 fonctions de `deroule97`).

## 4 · CE QUI EST IMPOSSIBLE À MESURER TEL QUE DEMANDÉ

**I1 — « 19 diapos dans le volet »** : voir F7 ; je mesure « 18 + une fin d'heure par heure », et la diapo 1 « Analyse d'images : la routine » au mur avec ses six étapes (mesuré au hub : `act` = « Analyse d'images : la routine », 6 `etapes` : tient).
**I2 — K15 « zéro écriture »** : voir F10 ; je mesure « zéro écriture sous `/site/3e/chapitres/` ».
**I3 — « le rendu ligne pour ligne identique à la maquette p8-5g » (mandat point 10)** sur la séance 0 : les deux trames **ne sont pas les mêmes données** (19 écrans contre 18, deux heures contre une, rôles réactivation/bilan dans la maquette, absents du hub ; les `eid` diffèrent). La comparaison tenable : **diapo par diapo, par titre (`act`), les lignes `li[data-p]` et leur texte**, sur les 18 diapos communes ; les diapos de rôle et la vidéo simulée sont hors comparaison. Je le mesure ainsi et je le dis.
**I4 — K2-K6, K12, K13 « verts » (mandat point 8)** : ils jouent par `[data-atelier]` et `[data-lancer="1"]` sur une maquette qui avait **deux heures et des activités** ; K2/K9 écrivent des notes sur `#mur li[data-k="1"]`. Mesurables, mais une différence de résultat peut venir de la donnée (F8), pas du code : je donnerai la sortie et la cause de chaque rouge.

## 5 · LE VERDICT, POINT PAR POINT DU MANDAT E1

| point | verdict |
|---|---|
| E1-a 1 (index.html, `AT_DR_B64` et le pont retirés, chargements `dr/*`) | **incomplet** : la liste « tombe » du contrat oublie `DR`, `AT_PONT`, `drDoc`, `atEcran*`, l'extension l. 16634, `pont-css` (C4) ; les fonctions gardées appellent `drWin`/`_drNormaliserTrame` (C5) |
| 2 (découpage mécanique par les plages §6) | **faux** sur quatre plages, **incomplet** sur cinq (F6) ; je découpe par les frontières mesurées |
| 3 (collisions) | **faux** pour les 8 globales (F2), **contradictoire** pour `page`/`on` (F5), **incomplet** pour le CSS global (F4) |
| 4 (barre fusionnée, `dr-zone` sans `.haut`) | barre : **tient** ; « sans `.haut` » : **contradictoire** (C1) |
| 5 (interfaces) | **incomplet** (M1, M2) |
| 6 (« Éditer dans l'atelier ») | **tient** (le parcours et K cherchent `Éditer dans l’atelier` avec l'apostrophe typographique U+2019) |
| 7 (parcours P0-P4, 19 diapos, K15 zéro) | **faux** sur 19 (F7) et sur zéro écriture (F10) ; le reste tient |
| 8 (K2-K6, K12, K13 verts) | **tient**, sous réserve I4 |
| 9 (assemblage) | **tient** |
| 10 (la trame complète, ligne pour ligne) | **incomplet** (F8, F9) et **impossible tel quel** (I3) |
| 11 (l'écriture `B/deroule`) | **tient** ; C3 pour la copie en classe |
| 12 (l'Atelier entier) | **tient** ; « envoyer vers une séance » écrit `B'/deroule` d'une séance qui n'est pas lue : la trame cible doit être lue d'abord (le site la lit dans `chapitresData`, déjà chargé : tient) |
| 13 (la colonne unique) | **contradictoire** avec le pliage indépendant du site (C2) |
| 14 (p8-5h) | **tient** ; K10/K11 dépendent d'E3 (dit au mandat) |
| 15 (la taille) | **tient** ; mesurable par K1 à 1280 |
| 16 (infobulles) | **tient** |
| 17 (recyclage R1, R2, R4, R5, R6) | **tient** ; table complétée section 6 |
| 18 (dettes) | **incomplet** : « 13 · 6 (vérifier qu'elle tient) » et « 12 · 14-19 » ne sont décrites dans aucun des fichiers à lire ; je les chercherai au registre |

## 6 · LA RELECTURE DES 157 FONCTIONS DE `deroule97` — complément de la table B

*Relues une à une (une ligne par fonction : ce qu'elle fait, le geste visible, repris ou non) : **`E1/AUDIT-157-deroule97.md`**, section 1 (157 lignes). Faite par un relecteur que j'ai lancé sur `deroule97`, la maquette et la table B ; j'ai vérifié par sondage (R13 : 0 occurrence de « gras », `bold`, `bgras` dans la maquette ; R17 : aucun gestionnaire Ctrl+V/C/X).*

**Neuf gestes qui marchaient, absents de la maquette ET de la table B — à ajouter (R13-R21)** :

| | le geste | où dans `deroule97` | territoire |
|---|---|---|---|
| **R13** | **G et S** (gras, souligné) à la souris — la table A les dit « repris » : **faux**, la maquette n'a que la couleur « A » et le surligneur ; et `ecrireDansDiapo` enregistre `textContent` : un gras serait perdu | `forme` (L2004), boutons L409 | E1 |
| **R14** | **la fiche ouverte se pilote comme une diapo** : ▶ la dévoile bloc à bloc, ✍🏻 sur un paragraphe, annotée par la classe dans une couche à part (`ANNOT`), « tu la prépares — la classe ne la voit pas encore » | `rendre` 677-699, `elems` 1470, `marqueFiche`, `lire` 1434, `corpsFiche`, `envoie` 2633 | E3 (tableau), E1 (le rendu commun) |
| **R15** | **le récit cite le surligné et le recopié** (« où on a surligné « … » », « On a recopié dans le cahier : … ») | `citations` 1204, `lisible` 1197, `majVues` 1297-1303 | E4 |
| **R16** | **le Papier = le récit + toutes les fiches annotées, « à coller dans le cahier »**, en A4 | `majVues` 1387-1406 | E4 |
| **R17** | **Ctrl/Cmd+V colle les blocs copiés** (le menu affiche « Ctrl + C », « Ctrl + X » sans aucun gestionnaire clavier) | keydown 2448-2453 | E1 |
| **R18** | **Ctrl+H bascule** : sur un passage surligné, il retire le surlignage | `forme` 2007, `dansSurligne` | E1 |
| **R19** | **⌫ (retour arrière) = ◀ replier** au pilotage | keydown 2463 | E2 |
| **R20** | **les raccourcis avec Cmd (Mac)** : Z, C, X, V, B, U, H | keydown 2442-2457 | E1 |
| **R21** | **changer l'adresse d'une image posée** (le lien suit la frappe) et « image absente de mjpc-medias · ref » au pilote | `reglages` 1642, `setRef` 1681, `urlMedia`, `html` 618 | E1 |

**Ce qui est faux ou imprécis dans la table B existante** (détail : section 3 du fichier joint) : **R6** cite `touche` (qui ne gère qu'Entrée/Échap sur une marque, L1819) — Ctrl+B/U sont dans le keydown L2454-2456 ; **R3** : le « Chrono au tableau » de la maquette est un bandeau figé « ⏱ 07:00 », pas l'heure écoulée ; **R11** : `zoom` est la réglette de taille du texte, **reprise** (le curseur « texte au tableau ») — seule la réabsorption des suites tombe ; **R7** : le compteur dévoilés/total existe aussi dans le moteur (`rendre`, L753-769) ; **R5** oublie `selCoupe`, `selCopie2`, Ctrl+C/X ; **R1** range `prendreImage` (importer une image du disque) parmi les marques et ne nomme pas déplacer/redimensionner une marque ; **attention** : dans l'atelier de la maquette, **Suppr supprime la diapo entière** — la même touche supprimait une marque ou une sélection dans l'ancien : deux sens pour une touche ; **R7-R11** citent des fonctions du pont, pas de `deroule97`.

**Ce que je prends (E1)** : R1, R2, R4, R5, R6 (mandat point 17) **et R13, R17, R18, R20, R21**, plus la couche commune de R14 ; à E2 : R19 ; à E3 : R14 au tableau ; à E4 : R15, R16. La conscience confirme l'attribution.

## 7 · ADDENDUM — ce que l'exécution d'E1-a a mesuré (21/10, 09:20 UTC)

**F13 — K8, K10, K11, K12, K13 ne peuvent pas être verts à E1-a (mandat point 8 les compte parmi « verts » pour K12, K13).** Ils mesurent les dettes 13 · 18 à 13 · 22, que **p8-5h** règle (mandat E1, point 14, E1-b). Sur la maquette p8-5g elle-même ils échouent (`AUDITS/CONTROLES-DEROULE/README.md`, table « échoue sur p8-5g »). Une intégration mécanique de p8-5g les a donc rouges. Verdict : **contradictoire** (point 8 contre point 14). Ils passeront avec p8-5h.

**F14 — K8 compte sur la donnée de la maquette.** « Diapo 1 sur 9 », « HEURE 1 · 9 DIAPOS », « 23 + 1 vignettes » : la maquette avait deux heures (9 diapos en H1) ; la trame réelle de la séance 0 n'a pas d'heure prévue (F8, M3) : 19 diapos en H1. Verdict : **impossible tel quel** sur la trame réelle (I4) : la mesure tenable compte « autant de vignettes que de pages » sur la diapo tapée, et « Diapo 1 sur n » avec n = les diapos de l'heure de la trame.

**F15 — les contrôles par l'entrée du site butent sur un voile du site.** `#fi-overlay` (« n fiches d'applications ne sont pas à jour », `fichesVerifierAlerte`, l. 9704 de la production : « l'overlay bloquant, à l'ouverture du panneau prof ») se pose quand `/manifestes` manque : le faux hub ne l'a pas. `controles.mjs` (v2) le retire **avant** `#tprof-btn`, il revient après ; ses clics réels (`page.click`) attendent alors 30 s et échouent : **13 contrôles sur 13 « n'ont pas pu aller au bout »**, sur n'importe quelle livraison. Le parcours ne le voit pas (il clique par l'élément et retire le voile avant chaque capture). Ce n'est ni le déroulé ni mon territoire, et le contrat §8.5 m'interdit d'inventer au faux hub. **À la conscience** : `/manifestes` au faux hub, ou le retrait du voile dans `ouvrir()` après l'Atelier. Mesuré avec une copie de `controles.mjs` qui retire le voile après l'Atelier (une ligne, dans `/home/user/work`, jamais poussée) : voir `JOURNAL.md`.

**F16 — les modules d'E2, E3, E4 existaient avant E1-a.** Le contrat §3 et le mandat E1 point 1 disent qu'E1-a les crée « remplis par le découpage ». E2, E3 et E4 les ont poussés avant (E4 avec le code de sa plage de la maquette ; E3 avec son nouveau code ; E2 avec son nouveau code mais **sans** les 64 fonctions de sa plage, que le socle appelle). Réglé selon le contrat §3 (« en faveur du propriétaire ») : leurs fichiers sont gardés **intacts** ; ma coupe de la plage d'E2 est posée **en tête** de `dr-classe.js` (bloc marqué, son code suit et l'emporte) ; mes coupes d'E3 et d'E4 sont gardées pour mémoire (`E1/decoupe/coupe/`), non chargées.

MEMO
