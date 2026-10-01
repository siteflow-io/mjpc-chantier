# ELEVE-1 · LIVRAISON ① — lire le fichier de classe et montrer l'aperçu (rien n'est écrit)

*Exécutante : l'instance relectrice (mandat « L'ÉLÈVE — 1 » v4). 01/10/2026. Rien n'est promu : la livraison attend l'audit de la conscience puis ton « promeus ».*

## Ce que ça change pour toi
En haut d'« Élèves & codes » (même quand tu n'as encore aucune classe) : **« Importer la liste d'une classe »**. Tu déposes le fichier .xlsx du logiciel de vie scolaire, ou tu cliques pour le choisir, ou tu colles le tableau copié dans Excel (Ctrl + V) n'importe où sur la page. Le site te montre un **aperçu** : la classe lue et celle de tes classes qui lui correspond (tu confirmes toujours), les comptes, les doublons (l'import est alors refusé), les anomalies une à une, le tableau des élèves. **« Valider » ne fait encore rien** : il dit que l'écriture arrive à la livraison ②. Le cadre « un élève par ligne » reste dessous, comme voie de secours.

## Le fichier
- Base : `index.html` **8.74.0-⓪ promue** (1 775 768 o, md5 `c54b1c332b7191ffe0e1383b4195cedf`, re-téléchargée et vérifiée à la commande) → livrée **8.74.0-①** : **1,796,109 o** (+20,341), md5 `c9af8e31c6d93d3651095b9600d665e3` ; `APP_VERSION_DATE` 2026-10-01.
- Ajouté : 22 fonctions (`eliSectionHtml`, `eliChoisirFichier`, `eliSurvol`, `eliDepot`, `eliFichierChoisi`, `eliMessage`, `eliChargerSheetJS`, `eliLireFichier`, `eliSurCollage`, `eliDate`, `eliDateAff`, `eliNom`, `eliMots`, `eliMemeClasse`, `eliApparier`, `eliAnalyser`, `eliRendre`, `eliChoisirClasse`, `eliAnnuler`, `eliValider`, `eliApercuHtml`, `_m8Superposer`), 4 variables (`ELI_SHEETJS_URL`, `ELI_ETAT`, `_eliSheetJS`, `ELI_ENTETES_LOGICIEL`), 1 écoute du collage sur la page, les styles `eli-*`, les ids `eli-bloc`, `eli-zone`, `eli-fichier`, `eli-apercu`, `eli-valider`, `eli-annuler`, `eli-pas-encore`. **Relevé de collisions avant ajout : 0** (aucun `eli…`, `_eli…`, `ELI_…`, id ou classe `eli-` dans la base ; `XLSX` n'y apparaît que dans un commentaire).
- Modifié : `_profSectionEleves` 3 706 → 3 813 o (le bloc d'import, avant tout) ; `loadClasses` 265 → 324 o et `loadCodes` 190 → 247 o (le complément ci-dessous). `_importEleves` intouchée (773 o).
- Syntaxe : 2 blocs de script, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.
- La lecture : SheetJS 0.18.5 (Apache-2.0), chargé depuis `cdnjs` **seulement quand un fichier arrive** ; s'il ne se charge pas, l'aperçu le dit et propose le Ctrl + V, qui marche sans lui. Feuille « Les élèves » (sinon la première) ; lignes d'en-tête du logiciel sautées ; la ligne des colonnes reconnue par ses mots (Nom, naissance, Sexe, Dispositifs — casse et accents ignorés, `edtNormaliser`) ; la colonne Classe lue pour vérifier ; les autres nommées « ignorées ». Dates : JJ/MM/AAAA, AAAA-MM-JJ ou date Excel ; illisible → vide, comptée. Clé de chaque élève : `sanMJPC(nom)`.
- L'appariement : les mots du nom lu et ceux de chaque classe, nettoyés par `edtNormaliser`, comparés **sans l'ordre**, « 3 » valant « 3e » (4, 5, 6 de même) : « 3 DYLAN BOB » = « 3e Bob Dylan ». Une correspondance → proposée ; aucune ou plusieurs → tu choisis dans la liste (ou « nouvelle classe ») ; la liste est toujours là pour confirmer.

## Une dette déjà là, rencontrée au banc, réglée dans cette livraison (n°12 · nouvelle entrée au registre)
En mode test, une classe créée disparaissait dès qu'« Élèves & codes » rechargeait les classes (« Aucune classe active ») : `loadClasses` et `loadCodes` relisaient le vrai hub sans voir le magasin de test. Maintenant, en mode test, ce qui a été écrit au magasin se superpose à la lecture (`_m8Superposer`) ; hors mode test, rien ne change. Prouvé au banc : base — la classe disparaît ; livrée — elle reste.

## Les bancs (`bancs/`) — par le geste, en mode test, hub SIMULÉ, données `ZZTEST`
Classes créées par la fenêtre « Nouvelle classe » (ZZTEST 4e, ZZTEST 3e). Fichiers fictifs à la forme du logiciel (`fichiers/`) : 6 lignes d'en-tête + 1 vide, 7 colonnes, 25 élèves (12 F, 12 M, 1 sexe vide), 1 « oui », 1 date impossible (31/02), 1 date en texte, 1 ligne sans nom ; le même avec un doublon et un « x » ; le même tableau à coller.
Hors geste, déclaré : l'identité prof posée par la session ; le presse-papiers rempli par le banc avant le Ctrl + V (comme quand tu copies dans Excel) ; SheetJS servi depuis la copie npm de la même version.
**Banc unique `banc_unique_1.py` : VERT, 18 vérifications, 0 échec** (`sortie_banc_unique_1.txt`) — dont : 25 élèves · 12 F · 12 M · 1 sans sexe · 1 dispositif · Age et Régime ignorés · 1 ligne sans nom · 1 date illisible ; « 3 ZZTEST » → « déjà présente : ZZTEST 3e » ; déjà présents 1 · nouveaux 24 ; 1 absent du fichier ; « pas de la classe ouverte » dit ; doublon refusé (lignes 8 et 33 nommées, « Valider » grisé) ; « x » lu comme oui ; Ctrl + V du tableau = même aperçu ; Ctrl + V de noms = « un nom par ligne » ; « Valider » : rien d'écrit (magasin et hub identiques) ; **0 écriture au hub, 0 hors hub, 0 erreur JS** ; vue élève : 0 erreur, aucun mot interdit, seul écart la pastille de version ; vrai hub inchangé (classes 9, codes 128, eleves 3, eleves_index 3, corbeille 25, manifestes 11).

## Infobulles ajoutées (pour toi)
- la zone : « Dépose ou choisis le fichier de la classe : il est lu ici, dans ton navigateur. Rien n'est écrit tant que tu n'as pas validé l'aperçu. »
- la liste « classe visée » : « La classe où la liste ira. Le site propose celle qui porte les mêmes mots ; c'est toi qui confirmes. »
- « Valider l'import » : « Écrit la liste et, pour chaque élève, son profil, dans la classe visée. Rien n'est enlevé. (À cette livraison, le bouton ne fait encore rien : l'écriture arrive à la suivante.) »
- « Annuler » : « Efface cet aperçu. Rien n'a été écrit. »

## Attendus hub
Aucun : ① n'écrit rien.

## Captures (`captures/`)
Pour toi, légendées : `Q1-avant.png` / `Q2-apres.png` (même parcours en mode test : la classe perdue / la classe là et le bloc d'import) ; `Q3-apercu.png` (l'aperçu photographié en entier, après « Valider ») ; `Q4-doublon.png`. Écran entier pour l'audit : `livree-1` à `livree-6`, `base-0`/`livree-0`, vues élève.

## Tes tests, geste par geste, après promotion
1. Ouvre https://siteflow-io.github.io/monsieurjaipascompris/?n=3e&v=8.74.0 : pastille **V8.74.0-①**.
2. Connexion professeur → Panneau prof → **🧪 Mode test** → Élèves & codes : le bloc « Importer la liste d'une classe » est en haut.
3. Dépose le fichier .xlsx d'une de tes classes : l'aperçu dit « déjà présente : <ta classe> (à compléter) » ; vérifie le nombre d'élèves, F · M, les dispositifs contre ton fichier.
4. Clique « Valider l'import » : « L'écriture arrive à la livraison suivante : rien n'a été écrit. »
5. Dans Excel, copie le tableau (de la ligne « Nom » à la dernière) puis Ctrl + V sur la page : le même aperçu.
6. Classes → « + Nouvelle classe » (un nom d'essai) → Élèves & codes : elle est là. Puis « Quitter le mode test » : elle disparaît (rien n'est parti).
