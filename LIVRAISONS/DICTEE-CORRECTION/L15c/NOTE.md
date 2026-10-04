# DICTÉE — L'ÉCRAN DE CORRECTION · L15c — l'accueil rangé (visuel C1)

*Exécutant du complément L15, livraison L15c (dette n°12 · 109). Rien n'est promu.*

## Ce que ça change pour toi
- **« Mes dictées »**, puis **3e, 4e, 5e, 6e** ; un niveau vide : « vide pour l'instant » ; une dictée sans l'un de ces niveaux irait dans un groupe « Autres » en bas (aucune au hub aujourd'hui). Dans chaque niveau, **les dictées par date de création** (la plus ancienne d'abord, comme sur C1).
- **La date de création** est posée **une fois** au hub pour les dictées qui n'en avaient pas (aucune n'en avait) : la date de la copie la plus ancienne, sinon le moment de l'ouverture de l'accueil.
- **Chaque ligne** : le titre ; **la classe lisible** · « créée le jj/mm/aaaa » · « 📘 n mots à compléter » s'il y en a (plus d'« Aménagée » ni du barème en étiquette) ; la ligne « heure fermée seule » (L13b) ; **le taux de correction** (barre + %, sur les copies attendues — les absents ne comptent pas ; infobulle « 28 copies corrigées sur 30 attendues ») ; **le statut des copies** : « copies non rendues » (gris) tant que toutes les copies attendues ne sont pas corrigées ; **« rendre les copies ▸ » qui pulse dès 100 %** — le clic ouvre l'onglet **Données → Copies**, son bouton « Rendre les copies » **prêt (il pulse, il a le focus)** ; un second clic là les rend (avec la vérification d'aujourd'hui) ; « copies rendues le jj/mm » ensuite (clic → l'onglet Copies) ; **la coche « publiée »** à côté de ✏️ ⧉ 🗑️ Ouvrir : décocher dépublie **au hub, sur-le-champ** (et l'étiquette devient « non publiée ») ; cocher publie. (La disparition chez l'élève sans rechargement vient avec L15f.)
- **La classe lisible — mesuré au hub** : tes classes ont un libellé dans le registre MJPC, mais **en capitales** (« 3 DYLAN BOB », « 3 FRANKLIN ARETHA », « 4 HUGO », « 4 TURING ») ; je les rends lisibles : « 3e Dylan Bob », « 3e Franklin Aretha », « 4e Hugo », « 4e Turing ». Un libellé que tu as écrit avec des minuscules (« 3E Charles de Gaulle ») est gardé tel quel. **Pour choisir toi-même le nom affiché, nomme tes classes dans MJPC avec des minuscules.**
- **En pied** : **« ＋ Nouvelle dictée »** ouvre (ou referme) le formulaire, replié par défaut. (« 📄 Importer depuis un PDF » viendra avec L15e.)
- **Le mode test** : une ligne repliée en bas, « 🧪 Mode test — bac à sable actif · Ouvrir ▾ », qui déplie l'atelier. **« Éprouver les mécanismes livrés » disparaît** : ses trois boutons restent dans l'atelier, nommés par ce qu'ils vérifient : « ✓ Vérifier les 4 états de copie », « ✏️ Tester l'éditeur de textes », « 🧹 Tester la corbeille ».
- L'aide « ? » de l'accueil le dit (la coche, « rendre les copies ▸ », « ＋ Nouvelle dictée », le mode test replié).

## Le fichier
- Base **6.7.0-L15b en ligne** (840 104 o, md5 `b4df61131ce844895f31588407a4f9eb`, vérifiée à la commande) → **6.7.0-L15c** : **846,361 o** (+6,257), md5 `681911171bc92fa07862f61c2713585a`.
- Ajoutées : `NIVEAUX_L15C`, `nomClasseLisibleL15c`, `dateCourteL15c` ; `chargerDictees` (niveau, classe lisible, date posée une fois, copies corrigées / attendues, copies rendues) ; l'accueil (la liste par niveaux, la ligne C1, le pied, le mode test replié) ; `OutilsTestSouche` (le titre « Éprouver… » retiré, un bouton renommé) ; `Copies` (le bouton prêt quand on vient de l'accueil) ; une animation ; quatre lignes d'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15c_geste.py`** (par le geste, 12 vérifications) : les niveaux dans l'ordre 3e, 4e, 5e, 6e ; « vide pour l'instant » (6e) ; le tri par date (la plus ancienne d'abord) ; la classe lisible (« 3_zz_test_alpha », libellé « 3 ZZ TEST ALPHA » → « 3e Zz Test Alpha ») et « créée le » ; **la date posée au hub une fois** (la copie la plus ancienne ; une date déjà là n'est pas touchée) ; le taux (**93 %** : 28 sur 30 attendues) ; les statuts (non rendues / rendre ▸ qui pulse / rendues le 02/10) ; **la coche décochée → `published: false` au hub et « non publiée »** ; « ＋ Nouvelle dictée » ouvre le formulaire replié ; le mode test replié puis déplié, « Éprouver… » absent ; **« rendre les copies ▸ » → l'onglet Copies, son bouton qui pulse et a le focus** ; 0 erreur.
**Accordé** (la version d'avant jointe) : `banc_L15b_geste.py` — l'accueil s'intitule « Mes dictées ».
**Banc unique sur L15c : VERT, 0 échec** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`C1-accueil.png` (l'accueil rangé) ; `C2-copies.png` (après « rendre les copies ▸ »).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → l'accueil : « Mes dictées », 3e, 4e, 5e, 6e ; tes classes en « 3e Dylan Bob »…
2. Décoche « publiée » sur une dictée : l'étiquette passe à « non publiée » (recoche-la ensuite).
3. Une dictée corrigée à 100 % : « rendre les copies ▸ » pulse ; clic → l'onglet Copies, le bouton prêt ; un second clic les rend.
4. En bas : « ＋ Nouvelle dictée » ; « 🧪 Mode test · Ouvrir ▾ ».
