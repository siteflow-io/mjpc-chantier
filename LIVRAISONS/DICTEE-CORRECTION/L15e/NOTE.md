# DICTÉE — L'ÉCRAN DE CORRECTION · L15e — l'import depuis n'importe quel PDF

*Exécutant du complément L15, livraison L15e (dette n°12 · 108 ; visuels E1 et B2). Validée par la conscience (C12 tour 447), avec la règle du crochet sur plusieurs mots. Rien n'est promu.*

## Ce que ça change pour toi
- **« 📄 Importer depuis un PDF »** au pied de l'accueil, à côté de « ＋ Nouvelle dictée ».
- **Deux zones de dépôt** : le PDF adapté (avec ses propositions) et le PDF classique — ou un seul PDF, n'importe lequel. **Le texte est lu dans ton navigateur** par pdf.js (Mozilla, libre, chargé depuis unpkg comme React ; une copie du module de travail est faite dans le navigateur) : rien de payant, rien n'est envoyé ailleurs.
- **Ce qui est reconnu** : les crochets « [a / b / c] », les parenthèses « (a / b / c) », les barres « a / b / c », « sur n points » (la note de la version aménagée). La consigne, le formulaire (« Nom Prénom », « Date ») et « Douze choix, sur 10 points » sont écartés du texte. **Le gras et le souligné ne sont pas reconnus** (pdf.js ne les donne pas de façon sûre) — conforme à E1, « si le PDF le dit ».
- **Chaque zone dit ce qu'elle a lu** : « ✓ texte lu · 12 groupes « [a / b / c] » reconnus » ; pour le PDF classique : « ✓ texte lu · le texte classique : il donne les bonnes formes et les notes » ; seul et sans groupe : « texte lu · rien de reconnu → tu choisis les mots à la main » ; une image : « je n'ai trouvé aucun texte dans ce PDF (sans doute une image scannée) : il me faut un PDF avec du texte, ou tu recopies le texte à la main ».
- **La bonne forme** = celle du texte classique (mot à mot) ; sans classique, la première du groupe. **Un crochet qui couvre plusieurs mots** prend la première forme et l'écran le dit (« Le crochet « [l'a vu / la vue] » couvre plusieurs mots : j'ai pris la première forme (« l'a vu »), sans en faire un mot à compléter — vérifie-le. »).
- **Les notes de grammaire** du PDF classique deviennent l'indice (mode C) **du mot qu'elles nomment** : « couchés : … », « amenés → … », ou la liste après « : » (« … avec avoir : entendu, vu, passé → … »).
- **Le texte, tel que lu** : les mots à compléter surlignés ; « ✎ modifier le texte » ; **un clic sur un mot** ouvre la fenêtre de L15a (la bonne cochée, les trois propositions modifiables, « Proposer d'autres formes », le mode du mot, « 🗑 Retirer ce mot », Entrée / Échap).
- **Titre** (la première ligne si c'est un titre, sinon le nom du fichier), **classe**, **barème** (« Type brevet » si le PDF le dit), **version aménagée** (n mots · mode A · sur N) : pré-remplis, modifiables.
- **Rien ne s'écrit avant « Enregistrer la dictée »** ; ce bouton crée la dictée et sa version aménagée, puis l'ouvre sur Préparation.
- Deux règles de plus aux propositions (L15a), pour qu'un mot ordinaire n'ait jamais de case vide : le pluriel en -aux, le -e final.

## Le fichier
- Base **6.7.0-L15d-b en ligne** (848 699 o, md5 `dfde1522b3e7f7cec144aea892bc10c6`, vérifiée à la commande) → **6.7.0-L15e** : **872,364 o** (+23,665), md5 `1c8de1e3be1b395939c2c192eb757be0`.
- Ajoutés : `chargerPdfjsL15e`, `lirePdfL15e`, `groupesL15e`, `analyserPdfL15e`, `assemblerL15e`, `normMotL15e`, `ImportPdfL15e` ; `reglesCibleesL15a` (deux règles) ; le pied de l'accueil (le bouton), une ligne d'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub ; de vrais PDF déposés dans le navigateur
**`banc_L15e_geste.py`** (par le geste, 19 vérifications) — **tes deux PDF (03/10, au sas)** : **12 groupes « [a / b / c] » reconnus** ; **les bonnes formes du classique** : entendu, venu, amenés, pouvez, vu, trouvions, passé, **couchés** (2e du crochet), recouvre, exhume, veut, tombe ; le texte propre (ni consigne, ni « Douze choix… », ni formulaire, ni ligne de notes ; « trois jours couchés », pas « jourscouchés ») ; **sur 10** ; les notes en indices ; la fenêtre de « couchés » (couchés ✓ / couché / couchée) ; **enregistrée : 12 mots à compléter, « couchés » en tête de ses propositions, son indice « couchés : participe employé comme adjectif… »** — **des PDF de test** (`pdfs/`) : un adapté + un classique (3 groupes, les bonnes formes du classique, le titre, une note), rien d'écrit au hub avant « Enregistrer », la fenêtre d'un mot reconnu et d'un mot ordinaire (aucune case vide), la dictée créée (4 mots, sur 10) et ouverte sur Préparation ; **un PDF sans crochets** → « rien de reconnu » ; **un PDF image** → le message honnête ; **un crochet sur plusieurs mots** → la première forme, dite à l'écran ; 0 erreur.
**Le kit** : `banc.py` sert pdf.js depuis une copie locale (comme React) — la version d'avant jointe (`banc_avant_L15e.py`).
**Banc unique sur L15e : VERT, 0 échec, 31 étapes** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, L15c, L15c-b, L15c-c, L15c-d, L15d, L15e, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`E1-tes-pdf.png` (tes deux PDF importés) ; `E2-couches.png` (la fenêtre de « couchés ») ; `E3-image.png` (un PDF image).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → « 📄 Importer depuis un PDF ».
2. Dépose ta « Dictée adaptée » puis ta « Dictée classique » : 12 groupes, les mots surlignés, « couchés » en bonne forme ; clique « couchés » : ses trois formes.
3. Choisis la classe, corrige le titre, « Enregistrer la dictée » : elle s'ouvre sur Préparation, sa version aménagée a 12 mots.
4. Dépose un PDF scanné (une image) : le message dit qu'il n'y a pas de texte.
