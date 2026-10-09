# QCM 7.7.1 — le téléphone devient un écran vide dès qu'un élève répond (dette n°12 · 210)

*Conscience n°12, 09/10/2026, 06:30, tour 603. Mesuré sur la production : `evaluation-qcm.html` 7.7.1, md5 `ecae65624855a1a877708986a8e984e5` (identique au fichier en ligne de `siteflow-io/monsieurjaipascompris`, relu le 09/10 à 06:30), branchée sur le faux hub du banc (rien d'écrit au vrai hub).*

**Le geste.** Le poste lance la séance (classe « 3 ESSAI », 25 élèves, évaluation de 3e du 09/10, « Tout le monde présent ») ; le téléphone s'ouvre par l'adresse du QR (`#mode=prof&view=phone&qr=…`), en 390 × 844 ; « ▶️ Lancer Q1 », puis « ✋ Autoriser la réponse » ; un élève répond à Q1 (ABRIAL Julien, choix A).

**Ce que le banc a compté** (`phone.log`) :

1. Avant la réponse, en phase réponse : le téléphone affiche tout, 0 erreur de page (capture `2-telephone-reponse-sans-reponse.png`).
2. Juste après la réponse : `ReferenceError: mode is not defined`, ligne 5698 ; le téléphone n'affiche plus rien, 0 caractère (capture `3-telephone-apres-une-reponse.png`).
3. Téléphone rechargé : la même erreur, 0 caractère (capture `5-telephone-recharge.png`).
4. Le poste n'est pas touché : 3102 caractères affichés, 0 erreur (capture `4-poste-apres-une-reponse.png`).

**La cause.** Dans `VuePhone`, la liste des élèves appelle `calculerScoreQuestion(choix, qCible.bonnes||[], mode)` (l. 5698). La variable `mode` n'est déclarée que dans la fonction de la bande des questions, juste au-dessus (l. 5649) : hors de cette fonction, elle n'existe pas. L'erreur ne se produit que si l'élève affiché a une réponse à la question en cours : le téléphone marche jusqu'à la première réponse, puis reste vide.

**Rejouer.** `AUDITS/QCM-FAUSSE-CLASSE-3E-08-10/banc/banc_phone.js` (avec `server.js`, `fakefb.js`, `tree.js` du même dossier ; Playwright, Chromium) : `node banc_phone.js`.
