# Dettes vivantes du chantier PONT — consignées le 21/08/2026 (rapport extension instruit)

## Issues du rapport d'essai réel (extension Claude, 18h20-18h55)
1. **Graine d'image morte** (moteur, `ajoute('image')`) : `chapitres/3e-ch01/img-01.webp`
   ne correspond à rien dans mjpc-medias (seul `worktrack/ch07/` existe). Le circuit est
   SAIN (URL bien fabriquée, vraie adresse → photo à l'écran ET au tableau, prouvé) ;
   seule la graine pointe dans le vide. → candidat au correctif moteur 90.
2. **Miniature d'image blanche** (moteur) : dans la vignette, `.img-sup` est calculé à
   height:0/overflow:hidden — l'image chargée (1280×720) ne s'y voit jamais.
   Le défaut le plus net de la série. → candidat 90.
3. **Bloc image sans menu contextuel** (moteur, cloisonnement par régime) : le clic droit
   de bloc est coupé sur les écrans visuels alors que l'aide le promet ; une image posée
   ne peut être ni supprimée ni déplacée AU BLOC (l'écran entier, si : menu MJPC des
   diapos). Angle mort de conception à trancher (au minimum « Supprimer »).
4. **Resynchronisation différée** : après déplacement/durée, la colonne chapitre garde
   les anciens horaires un rendu de retard (la colonne de vignettes est juste).
5. **Lien d'aide du champ d'adresse** non rafraîchi avant le re-rendu du panneau (moteur).
6. **À confirmer à la main humaine** (gestes synthétiques) : dépôt ignoré dans la zone
   haute/interstice final ; premier clic parfois avalé sur « + Fiche ».
7. **Documenté, pas un défaut** : la fenêtre tableau reste vide avant le premier ▶
   (mode prompteur) ; métas de fiche/papier en dur (déjà au 90 pressenti).

## Déjà corrigé dans la livraison courante (l'extension a testé une version antérieure)
- Étiquette de colonne figée « ÉCRANS · SÉANCE 3 » → contextualisée (commit 8967ae0).
- Navigation : cliquer un titre de séance ouvre sa trame en vue Déroulé (commit 5c6ca57).

## Verdict de couverture
Les deux trous déclarés (« images dans le cadre » · « glisser-déposer des vignettes »)
sont COMBLÉS par l'essai réel : images VERTES (scène + tableau, adresse réelle),
drag & drop VERT (ordre, horaires cumulés justes, scène suit, autosave à chaque dépôt),
verdict ⚖ utilisé avec succès (graine = moteur, pas le pont).
