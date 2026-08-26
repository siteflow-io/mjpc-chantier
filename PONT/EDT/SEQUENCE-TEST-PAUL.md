# SÉQUENCE DE TEST — L'EMPLOI DU TEMPS (lot 2bis), geste par geste

*Candidat `8.71.0` au sas. À jouer sur le site déployé, en tant que professeur.*
*Chaque étape dit ce que tu fais et ce que tu dois voir. Si ce que tu vois ne correspond pas, note le numéro : c'est tout ce dont j'ai besoin.*

---

## A · L'ARRIVÉE — celle de tous les matins

1. **Tu te connectes en prof.** → **Ta semaine s'ouvre par-dessus l'accueil**, en plein écran. L'en-tête dit le jour, le créneau en cours, la classe qui s'y trouve, et l'heure.
2. **Tu regardes la case de maintenant.** → Elle est **cerclée d'ambre**. Si tu n'as pas cours à cette minute, l'en-tête dit « aucun cours ».
3. **Tu essaies de faire défiler la page** (molette, barre d'espace). → **Rien ne bouge.** Tout tient à l'écran.
4. **Tu cliques sur « ✕ Fermer l'emploi du temps ».** → L'accueil est là, **intact**, exactement comme avant. La page redéfile normalement.
5. **Panneau prof → Emploi du temps → tu décoches « arriver sur l'emploi du temps en me connectant ».** Tu te reconnectes. → L'accueil s'ouvre **sans** l'EDT. Recoche pour la suite.

## B · CE QUE LA SEMAINE MONTRE

6. **Tu lis une case de classe.** → Le nom de la classe, le titre de la séance, et **« heure n/m »** — le nombre d'heures que sa préparation demande.
7. **Tu cherches une case verte.** → Une heure déjà jouée : liseré vert, « n activités · m reportées ».
8. **Tu cherches « X Français ».** → Présente, grisée, marquée **« hors MJPC »**. Elle ne compte jamais.
9. **Tu regardes le mercredi.** → Rien après 11h59. Et en **semaine A**, les créneaux de langue portent un liseré violet et le mot « fil langue » ; en semaine B, le mercredi 10:07 de 3 Franklin porte le chapitre principal.
10. **Tu regardes le bandeau du haut.** → La période en vigueur, puis ce qui tombe cette semaine : vacances, fériés, jalons, événements de classe.
11. **Tu regardes les cartes du bas.** → Une par classe : barre de progression, chapitre en cours, séances faites sur total, palier de divergence, et « expérimentale » sur la 3E Charles de Gaulle.

## C · UNE HEURE QUI SAUTE

12. **Tu cliques sur une case prévue.** → Une **modale** s'ouvre. **La grille reste lisible derrière**, il n'y a pas de voile.
13. **Tu la prends par son bandeau et tu la déplaces.** → Elle suit, ne sort jamais de l'écran, et descend jusqu'aux deux tiers.
14. **Tu ouvres « Ne plus compter cette séance dans la prévision horaire ».** → **Dix catégories, écrites en entier**, aucune complétion par début de mot.
15. **Tu choisis « Gestion de classe », tu écris une précision, tu enregistres.** → La case passe en ambre, **et la grille derrière glisse aussitôt** : la séance se reporte sur les créneaux suivants.
16. **Tu rouvres la case, tu cliques « ↶ Annuler cette décision ».** → Tout revient. Le journal, en bas de la modale, garde les deux gestes datés.
17. **Tu ouvres « Déplacer cette heure vers un autre créneau… ».** → La liste ne propose que **les prochains créneaux de cette classe**. Tu en choisis un : le départ se vide, l'arrivée porte 📌 et ne glisse plus.

## D · LE GESTE DE LA RENTRÉE — lancer une séance

18. **Tu cliques sur la case de ton prochain cours, puis « ▶ Ouvrir le pilotage et lancer ».** → Le déroulé s'ouvre sur **la bonne classe, la bonne séance, le bon créneau**, en régime **EN CLASSE**. C'est exactement l'état que tu obtenais en passant par Panneau prof → Atelier → Mes chapitres → Modifier → Déroulé → Lancer.
19. **Dans le bandeau du déroulé, tu cliques « 📅 Emploi du temps ».** → Ta semaine revient.
20. **Tu cliques une case d'une classe sans chapitre publié.** → Un message : « Aucune séance prête pour la … — ouvrir l'atelier pour en préparer une ? », avec le choix de rester. **Jamais de saut sans prévenir.**

## E · LES ABSENTS

21. **Tu cliques sur une heure déjà jouée.** → La liste de tes élèves, avec « Absents de cette heure (0 sur 29) ».
22. **Tu cliques deux noms.** → Ils se barrent et grisent. **Tu recliques l'un d'eux** → il revient. C'est le geste du QCM, à l'identique.
23. **Tu recharges la page et tu rouvres la case.** → Les absents sont toujours là : ils vivent dans la trace de l'heure.

## F · LES AUTRES VUES

24. **Tu cliques « Mois ».** → La même grille, condensée, une pastille par cours. Les flèches avancent de quatre semaines.
25. **Tu cliques « Année ».** → Une ligne par classe. Le **vert** est ce qui a été joué (première → dernière heure), le **gris** ce qui est prévu. En haut, les jalons en traits ambre, les vacances en blocs, aujourd'hui en trait rouge.
26. **Tu cliques « Calendrier de l'année… ».** → Trois colonnes : tes événements de classe avec la case **« justifié »**, les jalons communs, les jours sans cours.
27. **Tu coches « justifié » sur un séjour.** → Sur la carte de la classe concernée, le retard affiche « n h de retard dont m justifiées ». *Attention : un événement qui prend les heures des deux classes d'un même niveau ne justifie rien entre elles — c'est voulu.*
28. **Tu cliques « 📷 Photo du prévu ».** → Un message confirme le nombre de cases photographiées. La photo est datée ; le prévu, lui, n'est jamais figé.

## G · LES OBJETS, DANS LE PANNEAU PROF

29. **Panneau prof → Emploi du temps.** → Trois lignes d'état : le calendrier (52 semaines…), la grille (30 cases), les créneaux (8 horaires).
30. **Tu cliques « ⤓ Sortir le JSON — grille ».** → Le JSON réel est dans ton presse-papiers ; le message dit combien de caractères.
31. **Tu colles un JSON de grille volontairement fautif** (deux cours à la même heure, ou un cours le mercredi à 15h) puis « Vérifier ». → **Le refus est nommé, case par case.** Rien n'est enregistré.
32. **Tu colles le bon JSON, tu vérifies, tu injectes.** → Trois nœuds écrits d'un coup : les cases, les horaires, les périodes. L'aperçu t'avait dit ce que ça changerait aux périodes.
33. **Tu saisis les dates de P1.** → La grille se recale : les cases étiquetées P1 valent aux bonnes semaines.
34. **Tu renommes une période, tu en ajoutes une, tu en supprimes une.** → Tout suit. Deux périodes qui se chevauchent, ou deux du même nom : refus nommé.
35. **Tu modifies un créneau horaire** (par exemple 08:00 → 08:10). → Le site entier prend le nouvel horaire. **Les heures déjà jouées ne bougent pas** : leur trace porte le créneau d'alors.
36. **Tu apparies une classe de la grille à une classe du site.** → Toutes ses cases suivent d'un geste, et elles projettent enfin leurs séances.

---

## Ce qui n'est PAS dans ce lot, et qu'il ne faut pas chercher

« La dernière fois » (le lien vers la relecture d'une heure) — lot 7 · le profil de classe derrière les cartes — lot 7 · le bloc bilan — lot 5 · la vue téléphone soignée — lot 2 (ici elle s'affiche et défile, elle ne casse pas) · la règle « classe conservée » dans la purge — lot de la purge · le cockpit prof lui-même (ses données sont prêtes, pas sa vue).
