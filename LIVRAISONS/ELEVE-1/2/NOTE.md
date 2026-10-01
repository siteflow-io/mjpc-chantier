# ELEVE-1 · LIVRAISON ② — écrire la liste, la fiche, l'aménagement ; la reprise ; le QCM

*Exécutante : l'instance relectrice (mandat « L'ÉLÈVE — 1 » v4). 01/10/2026. Rien n'est promu : la livraison attend l'audit de la conscience puis ton « promeus ».*

## Ce que ça change pour toi
**« Valider l'import » écrit, pour de bon** : la liste de la classe (comme avant, sans jamais doubler), et pour chaque élève nouveau sa fiche — le sexe en clair, la date de naissance et le dispositif chiffrés avec ta clé — plus ce que les apps liront (le sexe, « dictée aménagée ») et le nombre de dispositifs de la classe (un nombre, aucun nom). Après l'écriture, l'aperçu laisse la place à un **compte rendu** (« Import fait ») et à « Fermer ».
- Classe absente : la fenêtre « Nouvelle classe » s'ouvre pré-remplie (nom lu, niveau, année) ; l'import continue dès qu'elle est créée. Classe sans année scolaire : la même fenêtre la demande (nom verrouillé), puis l'import continue.
- **Réimport** : ta fiche l'emporte — dispositif, cases, remarques, synthèse déjà écrits ne sont jamais touchés ; seul le vide est complété ; personne n'est enlevé.
- **Sans ta clé** : la liste et le sexe s'écrivent ; date de naissance et dispositif attendent **dans la page**, jamais en clair dans la base ; dès que tu saisis ta clé dans l'encart, ils se chiffrent et s'écrivent ; si tu fermes la page avant, une ligne te dit de réimporter le fichier avec ta clé.
- **Reprise, au premier import de chaque classe** : les aménagements de dictée deviennent la case pap-15 de la fiche (et « dictée aménagée » pour les apps) ; les sexes notés dans le QCM sont repris là où le fichier n'en donne pas (le fichier officiel fait foi). L'aperçu compte tout avant que tu valides.
- **Les restes de l'an dernier** (sexes du QCM et aménagements de dictée des classes supprimées) partent en corbeille (motif `restes-eleve-1`), comptés, puis sont effacés ; l'aperçu les annonce.
- **Retirer un élève** emporte sa fiche et son aménagement en corbeille ; avec ta clé, le nombre de dispositifs suit (sans ta clé, il se recompte à ta prochaine saisie de clé). « Supprimer / archiver des élèves » efface aussi la fiche ; **l'archive enregistrée chez toi (transmissible) ne la contient jamais** — la corbeille, si.
- Un fichier « un nom par ligne » n'écrit que la liste, sans fiche.
- **Le QCM (7.7.0)** lit le sexe dans ce que la console écrit (`/classes/<classe>/amenagements/<élève>/sexe`), la classe trouvée par sa clé ; il ne lit plus et n'écrit plus `qcm/eleveSexes` ; son bac à sable pose les sexes fictifs dans l'aménagement de sa classe de test (effacés avec elle). Le QCM n'affiche le sexe nulle part (mesuré : aucun affichage) ; le sexe se choisira dans la fiche (③). Accepté par toi : la 3E Charles de Gaulle perd ses sexes dans le QCM.

## Les fichiers
- `index.html` : base **8.74.0-① promue** (1 796 109 o, md5 `c9af8e31c6d93d3651095b9600d665e3`, vérifiée à la commande) → **8.74.0-②** : **1,813,946 o** (+17,837), md5 `80d454863a1b1ae4a741222b7cfdf1eb`.
  Ajouté (bloc `[ELEVE-1 ②]`) : `eliChargerSources`, `eliNomCible`, `eliPremier`, `eliReprise`, `eliRestes`, `eliChipsEcriture`, `eliValider` (réécrite), `eliModaleClasse`, `_eliPut`, `eliEcrire`, `eliRestesEnCorbeille`, `eliFini`, `eliChiffrerEnAttente`, `eliRecompterDispositifs`, `eliOpsRetrait`, `eliAttenteHtml` ; variables `ELI_SOURCES`, `ELI_ATTENTE`, `ELI_SUITE`. Relevé de collisions : préfixe `eli` / `_eli` déjà vérifié libre à ①.
  Modifié (tailles avant → après) : `eliApercuHtml` 6 753 → 7 364 · `eliAnalyser` 2 473 → 2 493 · `eliSectionHtml` 1 145 → 1 162 · `submitCreateClass` 915 → 1 752 · `closeCreateClassModal` 105 → 310 · `secuPoserCle` 2 046 → 2 157 · `_deleteEleveCls` 1 159 → 1 690 · `_eleveFootprint` 3 825 → 4 278 · `_b2BuildExtract` 723 → 782 · `_b2DoSave` 936 → 1 016 · `_b2Label` 518 → 591.
- `evaluation-qcm.html` : 7.6.0 (549 568 o, md5 `e6820219…`) → **7.7.0** : **550,410 o** (+842), md5 `9d6df9f4f349172f210e23d9c8da6f55`. `surveillerClassesAvecSexes` 1 083 → 1 534 · `migrerClassesUneFois` 3 410 → 3 370 · le bac à sable (sexes fictifs → aménagement de la classe de test). Le contrat de purge du QCM garde `qcm/eleveSexes` : le nœud n'est pas vide (les classes vivantes y restent) — comme le mandat le dit.
- Syntaxe : `index.html` 2 blocs, `evaluation-qcm.html` 1 bloc — `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.
- Contrat écrit (cadrage 6 · 1.2) : `profils/<clé>` = sexe, naissance (paquet de « AAAA-MM-JJ »), dispositif (paquet de true/false), pap (paquet de ["pap-15"] si repris), majLe (vide), attente ; `amenagements/<clé>` = sexe, dicteeAmenagee ; `nbDispositifs` (entier). Paquet = `mjpcChiffrer(SECU.cle, JSON.stringify(valeur))`. Toutes les écritures passent par `mjpcLot` (une par chemin), `_corbeillePuis`, `_fbDeletePath` : en mode test, le magasin.

## Les bancs (`bancs/`) — par le geste, en mode test, hub SIMULÉ, données `ZZTEST`
Page servie en local (`127.0.0.1`) : le navigateur n'y permet le chiffrement que dans un contexte sûr, comme l'adresse https du site. Clé de test saisie par le geste dans l'encart (et confirmée, première clé). Hors geste, déclaré : l'identité prof posée par la session ; la **lecture** du magasin de test et le déchiffrement avec la clé de test pour prouver ce qui a été écrit ; le QCM joué **par la fonction** (`qcm_harnais.js`, ses vraies fonctions chargées depuis le fichier) car il n'affiche le sexe nulle part — ce n'est pas atteignable par un clic.
**Banc unique `banc_unique_2.py` : VERT, 21 vérifications, 0 échec** (`sortie_banc_unique_2.txt`) :
- A (avec clé) : aperçu « reprise : 1 sexe du QCM · 1 aménagement de dictée », « restes : 2 sexes + 1 aménagement → corbeille » ; écrit 25 dans la liste, 25 fiches, 2 dispositifs ; fiche d'Anna : naissance déchiffrée « 2012-01-01 », dispositif « false », en clair seulement sexe / attente / majLe ; Bruno (repris de la dictée) : dispositif « true », case « pap-15 », dictée aménagée ; date impossible (31/02) : pas de naissance ; sexe repris du QCM pour Ines (le fichier n'en donnait pas), le fichier l'emporte pour Anna ; restes en corbeille puis effacés ; réimport : 0 doublé, fiches identiques ; retrait de Delta (dispositif) : fiche en corbeille avec lui, compte 2 → 1.
- B (classe sans année, sans clé) : « Compléter la classe : son année scolaire », nom verrouillé, puis import ; 25 fiches « en attente », aucune date dans la base ; clé saisie → les 25 chiffrées (Anna « 2012-01-01 »).
- C (aucune classe) : fenêtre pré-remplie « 3 ZZTEST » · 3e · 2026-2027 ; la classe créée avec ses 25 élèves.
- D (archiver un élève qui a une fiche) : l'archive enregistrée = `{"classes":{"zztest_arch":{"eleves":["ZZTEST ARCH Ada"]}}}` — ni fiche ni aménagement ; la corbeille garde la fiche ; fiche et aménagement effacés de la classe.
- **0 écriture vers la base, 0 hors base, 0 erreur JS** (A à D).
- QCM 7.6.0 : écoute `classes` + `qcm/eleveSexes`, lit le vieux nœud, y écrit ; **7.7.0 : n'écoute que `classes`, sexes = ceux de la console, rien du vieux nœud, 0 écriture**.
- Vue élève : 0 erreur, aucun mot interdit, mêmes écritures, seul écart la pastille. Vrai hub inchangé (classes 9, codes 128, eleves 3, eleves_index 3, corbeille 25, manifestes 11, classes_amenages 1, qcm/eleveSexes 9).

## Infobulles (pour toi)
- « Valider l'import » (réécrite) : « Écrit la liste dans la classe visée et, pour chaque élève nouveau, sa fiche (sexe ; date de naissance et dispositif chiffrés avec ta clé). Rien n'est enlevé ; ce que tu as déjà saisi dans une fiche n'est jamais écrasé. »
- « Fermer » (compte rendu) : « Ferme ce compte rendu. Ce qui est écrit reste écrit. »

## Attendus hub (après tes imports réels)
`/classes/<slug>/eleves` = [« NOM Prénom », …] ; `/classes/<slug>/profils/<clé>` = { sexe: "f", naissance: "v1.…", dispositif: "v1.…", attente: false } ; `/classes/<slug>/amenagements/<clé>` = { sexe: "f" } (et `dicteeAmenagee: true` pour un élève repris) ; `/classes/<slug>/nbDispositifs` = un entier ; la corbeille `restes-eleve-1` au premier import ; `qcm/eleveSexes` des classes supprimées (Banksy, Pythagore, Hergé) et `classes_amenages/5e HERGÉ` effacés après corbeille.

## Captures (`captures/`)
Pour toi, légendées : `S1-avant.png` (en ligne : « Valider » ne fait rien) / `S2-apres.png` (« Valider » a écrit : le compte rendu) ; `S3-annee.png` (classe sans année) ; `S4-sans-cle.png` (import sans clé : les fiches attendent). Pour l'audit : `el-A-apercu.png` (l'aperçu avec reprise et restes), `el-B-*`, vues élève base / livrée.

## Tes tests, geste par geste, après promotion (`index.html` ET `evaluation-qcm.html`)
1. Ouvre https://siteflow-io.github.io/monsieurjaipascompris/?n=3e&v=8.74.0 : pastille **V8.74.0-②**.
2. **D'abord en mode test** : Panneau prof → 🧪 Mode test → Élèves & codes → saisis ta clé dans l'encart → dépose le fichier d'une de tes classes : l'aperçu montre la reprise et les restes de l'an dernier → « Valider l'import » → le compte rendu « Import fait » → les noms apparaissent dans la liste → « Quitter le mode test » : rien n'est parti.
3. **Pour de vrai** (mode test quitté, clé saisie) : dépose le fichier de chacune de tes classes → vérifie l'aperçu → « Valider l'import » → le compte rendu. La première fois, les restes de l'an dernier partent en corbeille (annoncés et comptés).
4. Retire un élève d'essai en mode test : sa fiche part en corbeille avec lui.
5. Ouvre https://siteflow-io.github.io/monsieurjaipascompris/evaluation-qcm.html?v=7.7.0 : le QCM s'ouvre et tes classes y sont, avec leurs élèves.
