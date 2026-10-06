# SITE — L15.1b-2 — Panneau prof › Taxonomie › « Correspondances » (valider / refuser les rattachements proposés, app par app)

*Exécutant du complément L15, livraison **L15.1b-2** (le site ; dette n°12 · 107). Fichier : **`index.html`** — **sa promotion reste le geste de Paul**. Rien n'est promu.*
*Paul, 06/10 : **« OUI »** à la question 489/522 (la copie aménagée n° 21 des Hugo, 5/10 → 15/20) — la chaîne L15h-2 → L15.1b-1c → L15.1b-1d peut être promue.*

## Ce que ça change
- **L'éditeur de taxonomie a deux onglets** : « Arbre » (l'éditeur d'aujourd'hui, inchangé) et **« Correspondances »**.
- **Correspondances** : le choix de l'app (le nombre de rattachements en attente : « correction_dictee — 3 proposés ») ; la table **terme · cibles (avec leur libellé : domaine, famille ou notion ; une cible inconnue en rouge) · relation · statut** (la date, la raison d'un refus), **les « proposés » en tête**.
- **« Valider »** : relit la taxonomie fraîche, résout l'entrée **par son terme** (jamais un indice mémorisé), refuse **une cible inconnue**, **« egal » à plusieurs cibles**, **une partition cassée** (« Partition cassée : « fam-07 » est déjà rattachée à « D1.4 Accords » dans cette app. Refuse l'un des deux, ou change la cible. ») ; sinon **une seule écriture ciblée** (l'entrée : `statut: "valide"`, `valide_le`) puis la version de la taxonomie (`/meta`), comme les autres gestes de l'éditeur ; **le mode test est respecté** (le magasin du mode test, rien au hub).
- **« Refuser »** : ta raison (elle reste visible), `statut: "refuse"`, `refuse_le` ; le rattachement ne compte jamais.
- **Le lien profond des apps** (« ↗ Correspondances » de la dictée, L15.1b-1d) : `index.html?panneau=taxonomie&onglet=correspondances&app=<app>` ouvre le Panneau prof, Taxonomie, l'onglet, l'app — **seulement en session de professeur** (il attend la session jusqu'à 10 s) ; pour un élève, rien ne s'ouvre.

## Le fichier
- Base **`index.html` en ligne** (1 838 175 o, md5 `ac792b28f40d3a0510e725fc4a6b6985`, vérifiée à la commande) → **1,846,683 o** (+8,508), md5 `af232774403ffc8193a15a8039c7ff6d`.
- Ajoutés : `_taxoLibelleCible`, `_taxoEstFine`, `_taxoCorrespHtml`, `taxoCorrApp`, `taxoOnglet`, `_taxoCorrGeste`, `_taxoCorrMsg`, `taxoCorrValider`, `taxoCorrRefuser`, `lienProfondPanneauL151`, `_lienProfondAttendreL151` ; modifiés : `TAXO_UI` (`onglet`, `app`), `_taxoHtml` (les onglets). Syntaxe : les 2 blocs, `node --check` 0 erreur.
- **Un défaut trouvé par le banc, corrigé avant de livrer** : `_taxoJourISO` attend une date ; appelée sans, l'exception faisait rappeler le chargement avec un document vide (« La table de l'app est introuvable »). Les deux appels lui passent `new Date()`.

## Le banc (`bancs/`) — **le banc du site est NEUF** (il n'existait pas pour index.html)
**`banc_site.py`** : la page servie en local (`http://localhost`, contexte sécurisé) ; **le hub est un arbre en mémoire dans la page** : toutes les requêtes REST du site vers le hub (GET, PUT, PATCH, DELETE ; `shallow`) y sont servies par un relais — **rien ne sort du navigateur** ; tout autre hôte est bloqué et compté ; la session du professeur est celle que le site pose après sa connexion (`sessionStorage.mjpc_eleve`, `is_prof`).
**`banc_L151b2_geste.py`** (par le geste, 10 vérifications) : **le lien profond** (le Panneau ouvert, l'onglet, la table de correction_dictee, les proposés en tête) ; **la liste des apps** (« correction_dictee — 3 proposés ») ; **Valider** → seule l'entrée change (les trois autres identiques), la version passe 3.0.0 → 3.0.1 ; **la partition** → refusée avec le message, rien d'écrit ; **Refuser** (raison « hors sujet ») ; **une autre app** (reecriture) ; **l'onglet Arbre** ; **les écritures** : 4, toutes ciblées (`PUT /taxonomie/alias/tables/correction_dictee/<i>` et `/taxonomie/meta`) ; **sans session de professeur, le lien n'ouvre rien** ; 0 erreur, aucune requête vers le hub réel. Sortie : `sortie_banc_L151b2.txt`.
**Le banc versionné du site (`mjpc-bench.js`)** : **il s'arrête déjà sur la version EN LIGNE**, au 5ᵉ test (« "undefined" is not valid JSON ») — il n'est pas à jour avec le site ; je ne l'ai pas utilisé comme preuve (à dire à la conscience).

## Captures (`captures/`)
`K1-correspondances.png` (l'onglet, ouvert par le lien de la dictée) ; `K2-apres.png` (après Valider, Refuser et la partition refusée). *Deux alertes du site (« 9 fiches d'applications ne sont pas à jour », « Vérifier les règles Firebase »), dues au faux hub du banc, sont masquées pour la capture seulement.*

## Tes tests, après ta promotion d'`index.html`
1. Panneau prof → Taxonomie → « Ouvrir l'éditeur » → onglet « Correspondances » → app correction_dictee : les rattachements proposés par l'IA (après une injection dans la dictée) sont en tête.
2. « Valider » sur l'un : statut « valide », la date ; « Refuser » sur un autre : ta raison.
3. Dans la dictée, Réglages → « ↗ Correspondances » : le Panneau s'ouvre directement sur cet onglet.
