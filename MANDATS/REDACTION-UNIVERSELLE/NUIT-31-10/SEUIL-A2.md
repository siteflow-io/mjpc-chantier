# Le seuil de ressemblance de l'A2, mesuré sur les vraies copies (conscience n°14, 31/10/2026 23:10)

Mesuré au vrai site en lecture seule (aucune écriture), sur la classe de 3e de Paul, dans le dossier privé de la conscience ; ici, seulement des nombres, aucun texte d'élève.

- 29 copies, toutes avec une identité interne `copie.id` ; 1 528 identités de lignes, **aucune en double** dans la classe ; 869 lignes écrites, toutes avec leur corrigé de l'IA.
- **La ressemblance en mots (part des mots de la ligne envoyée retrouvés dans la ligne rendue) ne convient pas** : au seuil 0,5, elle refuse 6 vraies lignes sur 869 et laisse passer 85 échanges sur 20 000 (surtout les lignes de 2 ou 3 mots).
- **Retenue : la ressemblance en lettres**, `r = 2 × (plus longue suite commune de lettres) / (longueur envoyée + longueur rendue)`, sur les deux textes en minuscules. Sur les vraies lignes : la plus basse vaut 0,638. Sur des lignes échangées au hasard (5 000 essais) : au seuil 0,6, 0 vraie ligne refusée sur 869, 5 échanges acceptés sur 5 000 (0,1 %).
- **Seuil : `RC_RESSEMBLANCE_IA = 0.6`**, ressemblance en lettres ; une ligne rendue sous ce seuil est refusée, comptée et dite à Paul. Le mandat A2 (point 4) est corrigé en ce sens : la mesure en mots est abandonnée.
- Le calcul se fait sur des lignes d'au plus quelques centaines de lettres : une table de programmation dynamique ligne par ligne suffit (869 lignes : instantané).
