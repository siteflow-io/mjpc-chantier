# CHANTIER OUVERT — reboot du cadre en pleine séance (NON PROUVÉ, ne pas promouvoir)
Racine confirmée : la trame de DÉMONSTRATION embarquée dans le moteur reprend la main
quand le cadre reboote (iframe détachée/rattachée). Conséquences : écran incohérent ou
noir au retour d atelier + bilan de clôture racontant des modifications fantômes
(« Analyse logique : exercice en autonomie » → « analyse logique » = démo ↔ décor).
Correctifs posés dans adaptateur-pont.TRAVAIL-NON-PROUVE.js :
 · garde à dr_ouvrir : reboot détecté (marqueur __pontCharge absent) → reconstruction ;
 · _drVerifier : un cadre vérifié affiche l écran de départ, jamais la démo.
BANC ENCORE ROUGE : après reboot violent + retour, 11 écrans « Rituel d entrée ».
Cause restante identifiée : en régime CLASSE le retour ne repasse pas par dr_ouvrir
(atDrMonter branche classe) → étendre le FILET CONTINU au marqueur (!__pontCharge)
et recharger LA COPIE de classe après reconstruction. Banc décisif : reboot → retour
→ trame de la séance (≈6, « Plan de la séance ») + clôture « rien modifié ».
