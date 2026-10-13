# Trouvailles R10 — l'heure, de l'estimation au bilan, puis le soir

Script : s4.js (pages gardées ouvertes du début à la fin), journal : log4.txt, captures : cap/s4-*.png.

1. Tableau (`?view=board`), question close Q2/2 — aucun geste, ZELLER Lou marquée absente à l'appel. La console compte 24 élèves (« 0/24 CONNECTÉS »), mais le tableau affiche « 👥 Classe (25) » avec « Lou ZELLER » dans la liste. Maquette : scène du tableau pendant la séance non vérifiée faute de temps. Captures : cap/s4-bd*.png. À confirmer : la maquette garde peut-être les absents sur le tableau.

Observé et conforme (pas une trouvaille) :
- Console, « ❌ Écarter » sur Q3 après la clôture de Q1. Une confirmation s'ouvre avec « Annuler » et « ❌ Écarter la question 3 ». Après confirmation, l'écran passe à « 1/2 QUESTION », « 🔮 À venir — Q 2 / 2 », et dans la liste « Q3 … ❌ Écartée — pas posée » avec « ↩️ Remettre ». C'est la même chose que la maquette c-ecarter → c-ecartee (1/3 → 1/2). Captures : cap/s4-ecarter.png, cap/s4-ecartee.png.
- Téléphone, après la dernière question close : il affiche « Phase : question close — Q 2/2 » et « 📊 Lancer l'autoévaluation », comme la console, sans recharger. Capture : cap/s4-ph*.png.

Nombre de trouvailles : 1 (à confirmer).

Ce que je n'ai pas pu jouer, et pourquoi :
- Aucun élève n'est entré sur les tablettes. Sur le pavé « 👋 Identifie-toi » (mode 2 élèves), mon script a tapé les codes 2101/2108 et 2115/2122 puis « Entrer → », mais la tablette est restée sur le pavé avec « Renseigne ton prénom et ton nom. ». La console affiche donc « 0/24 CONNECTÉS » et « 0/0 justes » sur toutes les questions. Je ne sais pas si l'écran attendait un autre geste ou si c'est un défaut : non tranché, faute de temps. Captures : cap/s4-tab0-in.png, cap/s4-tab1-in.png.
- Ensuite, tout mon périmètre est resté non joué. Mon script attendait un bouton d'estimation après la dernière question ; la console proposait « 📊 Lancer l'autoévaluation », que je n'ai pas cliqué. Je n'ai donc joué ni l'estimation (c-estim), ni la seconde attestation (c-attest2), ni « ▶️ Commencer la correction », ni la correction et « 💡 Révéler » (c-corr-*). Pas joué non plus : « Trouvée au dernier moment », les deux alertes de co-évaluation et leurs boutons (c-coeval-*), le bilan (c-bilan), « 🛑 Terminer » (c-terminer), et le soir (Données → Résultats c-resultats, fiche c-fiche, « Que dit la feuille ? » c-feuille). Raison : la limite de temps (11:11).
- Note de lecture : la console affiche « Fin de l'heure : 9:55 » alors qu'il était environ 11:06 à Paris. Le navigateur de test est sans doute à l'heure UTC ; je ne le compte pas comme trouvaille.
- La séance de 3 ESSAI est restée ouverte sur le hub, bloquée à « Lancer l'autoévaluation ». À la fermeture du navigateur, elle passe sans doute en « interrompue » (c'est ce que montrait ma relance précédente).
