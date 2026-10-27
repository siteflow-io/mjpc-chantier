# Rédaction universelle — complément « le panneau commun » (13 · 60) · E4 · 27/10/2026

## Ce que ça change pour la classe
Paul retrouve dans la Rédaction le même panneau que dans la correction de dictée : le même accueil, les mêmes onglets, les mêmes gestes. Une rédaction, c'est un sujet pour une classe ; pour la deuxième classe, il la duplique, comme une dictée.

## Mots de Paul
- 27/10 17:45 : « Normalement les apps ont toutes le même panneau de configuration et de contrôle. Le modele est correction dictée. Vérifie en quoi on peut adapter rédac universelle pour ça »
- 27/10 17:59 : « Une rédac pour plusieurs classes non: actuellement en dictée je duplique une dictée pour la deuxième classe. on doit faire pareil pour la rédac. »
- Le reste de la proposition de la conscience (points 623-626 du transcript C13, tour 250) est acquis : Paul ne l'a pas commenté.

## Le modèle
`correction_dictee.html` en production (6.7.0-L17-1q3) : l'accueil (`screen==="config"`, l. 3453 et suivantes), la navigation à deux niveaux (`NAV2_GROUPES`, l. 3622), l'en-tête d'une dictée ouverte, `dupliquerDicteeEntiere` (l. 8158), `supprimerDicteeAvecCorbeille` (l. 8174), `snapshotExport` / `renderSnapshotPanel` (l. 2311-2356), l'aide contextuelle, la carte « Mode test ». Images : `TRANSCRIPTS/C13/pieces/T250-01`, `T250-02` (le modèle en haut, la Rédaction d'aujourd'hui en bas) ; le script qui les fait : `TRANSCRIPTS/C13/pieces/T250-banc/cap.py`.
La Rédaction reste en JavaScript sans React : on reproduit la structure, l'aspect et les gestes du modèle, pas son code React.

## Ce qui est à faire
1. **Une rédaction = un sujet pour une classe.** La classe se choisit à la création (« ＋ Nouvelle rédaction » : le JSON collé, « Vérifier », puis la classe, puis « Créer ») ; elle est rangée dans le sujet (sa clé interne). « ⧉ Dupliquer », comme `dupliquerDicteeEntiere` : la grille, l'énoncé, les phrases déjà lues (les validations), un nouvel id interne, le titre « Copie de … », aucune copie d'élève ; « ✏️ » réaffecte le titre et la classe, comme le crayon du modèle. Le nom court reste unique.
2. **Ce qui est déjà au hub n'est jamais déplacé.** Un sujet qui porte des copies de plusieurs classes (la forme du 1.0.0-RU) s'affiche en une ligne par classe, chacune ouvrant ses copies ; aucune donnée ne bouge.
3. **L'accueil « Mes rédactions »**, comme « Mes dictées » : rangé par niveau (6e, 5e, 4e, 3e, repliable) ; chaque ligne : le titre, la classe, « sur 40 », « créée le … », la barre des copies corrigées sur les élèves de la classe, ✏️ ⧉ 🗑️ (la corbeille MJPC et l'export JSON, comme le modèle) et « Ouvrir → » ; en pied « ＋ Nouvelle rédaction » ; la carte « Mode test » ; le « ? » d'aide. Pas de coche « publiée » ni de « Rendre les copies » : l'élève ne reçoit rien en ligne (R7).
4. **Une rédaction ouverte**, comme une dictée ouverte : l'en-tête (le titre, la classe · n/N · %, la barre), « 📸 Snapshot », « 📤 Restaurer », « ← Retour » ; trois onglets. Pilotage : « Préparation » (« Préparer le sujet » et l'énoncé), « Correction » (la grille des élèves, le paquet, la copie). Données : « Bilan » (les statistiques d'aujourd'hui, « Stats prof »), « Fiches élèves » (l'aperçu, « Exporter tous HTML »). Réglages : la grille du sujet (critères, seuils du compteur) telle qu'elle se lit et se règle aujourd'hui. Pas d'onglet sans rien derrière (« Rapide », « Copies », « Suivi », « Exercices »).
5. **Ce qui part** : « Auto-sauvegarde » (un fichier téléchargé à chaque copie ; le site enregistre chaque geste) ; « Exporter JSON » et « Importer JSON » deviennent « Snapshot » et « Restaurer » (le patron du modèle). Mesure ce qu'ils faisaient que « Snapshot » ne ferait pas, et dis-le au JOURNAL avant de les retirer (règle du 21/10 : rien de ce qui marchait ne se perd).
6. **L'aspect** : celui du modèle (blanc, bleu) pour le panneau ; toute la largeur et toute la hauteur de l'écran (règle du 26/10) — pas la colonne centrée du modèle (13 · 61). La fiche de l'élève garde le sien.
7. **Rien d'autre ne bouge** : la correction (classique, interrogatif, le compteur, les citations, le marquage), la fiche mot pour mot (RU8), les objets (RU15), le mode test, l'abonnement ; RU0-RU15 restent verts.

## Gardes
- **RU16** : l'accueil par niveau ; une ligne par sujet et par classe (avec un sujet de la forme 1.0.0-RU qui porte deux classes : deux lignes, aucune écriture) ; « Nouvelle rédaction » avec sa classe ; « Dupliquer » (validations copiées, aucune copie, nouvel id interne, « Copie de … ») ; « ✏️ » change la classe ; « 🗑️ » (corbeille, export).
- **RU17** : une rédaction ouverte — l'en-tête, les trois onglets et leurs sous-onglets, « Snapshot » / « Restaurer » (un aller-retour qui rend la même rédaction), « ← Retour », le « ? » sur chaque écran, la carte « Mode test ».
- RU9 aux quatre tailles. Captures **avant** (la production 1.0.0-RU) et **après** du même parcours, à 1707 × 743, regardées ; exemples réalistes (la lettre de la Grande Guerre pour 3 FRANKLIN Aretha, sa copie pour 3 DYLAN Bob).
- **Mission 0** : relis ce complément contre le modèle et contre `redaction.html` ; dis au JOURNAL ce qui y est faux avant de coder.
