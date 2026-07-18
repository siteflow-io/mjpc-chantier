# SPEC VIVANTE M6 — Souche (correction_dictee) · découpage du re-rangement
*Exécutant M6 — tour 2, aucun code écrit. Base de travail : `correction_dictee.html` production, 7 317 lignes, 499 648 octets, md5 `e6f44978c9eaccc7aeb8230c29239c87` (backup local fait). Périmètre resserré appliqué (navette conscience : Q1-Q6 tranchées).*

## A. État réel constaté (lecture profonde, références de lignes)

- **App racine** (L1486) : choix Mode élève / Accès prof (`PROF_CODES=[3141,1312]` L1485 ; URL `?mode=prof|eleve`). Un seul chemin de montage d'`AppProf` → `publierManifeste` au montage (L1532) couvre tout ✔.
- **AppProf** (L1518) : `screen="config"` = **accueil d'instances** (liste + badges Publiée/Aménagée + ✏️ édition inline `editForm` L1673-1741 + ⧉ dupliquer + 🗑️ suppression avec export JSON auto + création + bouton « 🧪 Créer dictée test » L1754-1787) → `screen="correct"` = **CorrScreen**.
- **CorrScreen** (L1905) : barre plate **7 onglets** (L2123-2131 : Correction · ⚡Rapide(⇧R) · Bilan · 📄Copies · 🎯Exercices · Fiches élèves · Suivi🟢) + barre d'actions transverses (🔄M→P, 📸Snapshot, 📤Restaurer, ←Retour) + `container-wide` (L2027). Les onglets sont des **composants autonomes** : `RapideGlobal` L2212, `CorrEleve` L2451, `Bilan` L3085, `Suivi` L3166, `Fiches` L3687, `Copies` L4614, `ExercicesAdmin` ~L5410 — le re-rangement sans rouvrir est confirmé faisable.
- **AppEleve** (L5174) : login **nom + prénom en texte libre** (aucun code, L5241-5287), profil test « MENEY Monsieur », **auto-login par URL** `?dictee=&eleveKey=&screen=` (L5190-5218 — canal des liens de copies envoyés aux familles via `buildCopieHtml`/`appUrl`). Écrans : login → `EleveCorrection` (autocorrection) / `MaCopie` (L5079) / `ExercicesEleve`.
- **Socle embarqué : v1.0.0** (L234, L392) — **sans le §8** (`lireSessionMJPC`/`validerEleveMJPC` absents, vérifié par grep exhaustif). Le pt 7 exige la mise à niveau du bloc vers v1.1.0 (recopie verbatim depuis `mjpc-core.js` du dépôt).
- **Manifeste** (L396-414) : nœuds `correction_dictee` + `classes_amenages`. **Découverte n°1** : la souche écrit aussi `dictee_settings/promptIaBanque|promptDirectives|promptFormat` (L3026, L3045, L6255-6282) — **nœud hors manifeste et hors contrat de purge** → dette D3.
- **Découverte n°2 (pt 7)** : la souche **a** un accès élève — en texte libre, usurpable en deux clics (le trou transversal du §9 du plan). Le pt 7 n'est donc pas « préparer le shunt sans portail » : il s'agit de **sécuriser un portail existant** (code MJPC + shunt), sur le modèle du débat.
- **Mode test : embryon existant** (L1754-1787) : classe `_test_correction_dictee` via `ecrireClasse` ✔ convention, 5 élèves fictifs, results pré-remplis — mais **ni purge de sortie, ni nettoyage des zombies, ni incarnation** ; reload manuel. Conforme au verdict Q3 : analyse faite, création complète = dette D1.
- **Réglages candidats existants** : options de copie (`getCopyOptions` L4331, localStorage `mjpc_copy_options`) ; vitesse TTS + audio mode rapide (localStorage L1469-1483) ; prompts IA (`dictee_settings`).
- **Aucun « ? »** (seulement les ⓘ/`ifo` L1055). **Aucune pastille de version app**. **Aucune media query app** (les `@media` présentes sont du print dans les HTML générés).
- « Présence temps réel » du Suivi = listeners sur `autocorrection`/`exercices`, fenêtre RECENT 60 s (L3166-3199) — pas un heartbeat séparé : rien à toucher.
- Suppression de dictée (accueil) : export JSON local automatique puis `remove()` sec — pas de corbeille hub → dette D4.

## B. Le re-rangement, geste par geste

1. **Accueil d'instances** (`screen="config"`) — INCHANGÉ (c'est l'étalon). Seuls ajouts : pastille de version (coin discret) + meta anti-cache dans le `<head>`.
2. **CorrScreen — nav deux niveaux** : la barre plate devient `Pilotage{Préparation·Correction·Rapide}` · `Données{Bilan·Copies·Fiches·Suivi·Exercices}` · `Réglages` + « ? ». Mécanique : un état `groupe` s'ajoute au-dessus de l'état `tab` existant ; **les 7 composants d'onglets sont montés à l'identique** (mêmes props, zéro réécriture interne) ; atterrissage `Pilotage→Correction` ; raccourci ⇧R et barre d'actions transverses inchangés. Exercices rangé en Données (Q1), zéro couplage nouveau.
3. **Préparation (sous-onglet)** : extraction du bloc d'édition inline `editForm` (L1673-1741) en composant `PreparationDictee`, monté **aux deux endroits** (le ✏️ de l'accueil continue de marcher à l'identique ; le sous-onglet le monte sur la dictée courante). Geste minimal honorant « édition complète d'une instance créée » sans duplication. → **N2**.
4. **Réglages (onglet à créer, principe « doter »)** — v1 proposée : vitesse de lecture TTS + audio du mode rapide (déplacement des contrôles localStorage existants) + options de copie par défaut **si** le panneau d'options de `Copies` s'extrait proprement (à confirmer en lecture fine de `Copies` au tour de code ; sinon TTS seul + dette). Stockage localStorage comme l'existant : **aucun nœud Firebase nouveau**. → **N3**.
5. **« ? »** : bouton en bout de nav → modale « Aide » (raccourcis, les 3 modes, wording collégien côté élève) + section « Nouveautés » lisant `site/annonces` filtré sur l'app, **tolérante à l'absence du nœud** (Q2 : chemin figé, M8 remplira, la souche ne sera pas retouchée).
6. **Connexion élève (pt 7)** : mise à niveau du **bloc socle embarqué** v1.0.0→v1.1.0 (recopie verbatim, prérequis → **N4**) puis portail élève = code MJPC + nom + prénom (`validerEleveMJPC` contre `/codes`) + **shunt** `lireSessionMJPC` (session site 12 h) — modèle du débat. **Conservés tels quels** : l'auto-login URL (workflow des copies envoyées aux familles — le casser romprait un usage réel → **N1**) et le profil test MENEY.
7. **« Mes dictées »** : nouveau composant élève, **lecture seule** (aucune écriture, manifeste intact) : après connexion, liste des dictées publiées où l'élève a une copie (titre · classe · note si `showNote`) → ouvre `MaCopie`/parcours. Wording collégien. → **N5**.
8. **Responsive 390 px** : nav deux niveaux repliable en colonne sous ~480 px ; login élève, Mes dictées, Réglages, « ? » vérifiés en 390 px. Tableaux denses existants (Suivi, Bilan) : hors périmètre (précédent Z du plan).
9. **Manifeste** : inchangé (aucun nœud nouveau créé par M6). La dette `dictee_settings` est consignée, pas traitée (trancher la propriété du nœud serait une rallonge).
10. **Doc K0** : pendant la lecture fine de `CorrEleve`/`RapideGlobal` au tour de code, repérage du mécanisme de mutualisation des décisions de correction → 5-10 lignes livrées pour le plan (doc, pas code).

## C. Questions N1-N5 (réponses attendues avant code)

- **N1 — Auto-login URL** (`?dictee&eleveKey`) : bypass d'identité assumé (lien nominatif distribué par le prof aux familles). Proposition : le CONSERVER tel quel, portail MJPC pour l'entrée manuelle seulement. Confirmer ?
- **N2 — Préparation** par extraction du bloc `editForm` en composant réutilisé aux deux endroits : validé ?
- **N3 — Réglages v1** (TTS + audio + options de copie si extraction propre, localStorage, zéro nœud Firebase) : validé ?
- **N4 — Socle embarqué** : recopie verbatim v1.1.0 depuis `mjpc-core.js` du dépôt dans la souche (prérequis du §8/pt 7). Je lis « ne touche pas mjpc-core.js » comme « pas d'évolution du socle », pas comme l'interdiction de cette recopie standard. Confirmer ?
- **N5 — « Mes dictées »** : entrée directe conservée quand l'élève n'a qu'une seule dictée, liste dès deux (zéro friction sur le cas courant) — ou liste systématique ? Je penche pour la première.

## D. Registre M6 (spec vivante — état)

**À faire (après validation)** : nav 2 niveaux · Préparation (N2) · Réglages v1 (N3) · « ? » + `site/annonces` · portail élève MJPC + shunt (N1/N4) · « Mes dictées » (N5) · pastille de version en dur + anti-cache · responsive 390 des nouveaux écrans · wording collégien · doc K0.

**Dettes consignées** :
- **D1** — Mode test souche : embryon existant sans purge de sortie / nettoyage zombies / incarnation → passe dédiée courte type M5ter, à dater.
- **D2** — Amélioration K.1 (l'élève formule une action en fin d'autocorrection) : après M15 (verdict Q4).
- **D3** — Nœud `dictee_settings/*` hors manifeste et hors contrat de purge (propriété à clarifier : souche vs dictee_universelle ; prompts = travail de conception → `preserver` probable).
- **D4** — Suppression de dictée sans corbeille hub (export fichier local seul).
- **D5** — Alias Concordance (26 alias en attente d'arbitrage de Paul — connue, hors M6, verdict Q6).

**Fait** : plan lu (v50, md5 `6c8d4ee9a1dc91ded64b5575db8fe7cc`) · note de cadrage poussée (`c19831e`) et validée · souche téléchargée et lue (md5 `e6f44978c9eaccc7aeb8230c29239c87`) · spec vivante livrée (ce fichier).

**STOP** — à l'arrêt jusqu'aux réponses N1-N5.
