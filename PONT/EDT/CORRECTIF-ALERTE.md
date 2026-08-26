# LOT 2bis — CORRECTIF · L'ALERTE MENSUELLE ET CE QUE LA RÉINJECTION NE DOIT PAS EFFACER (décision de Paul, 26/08)
Paul : « on remplace par quelque chose de purement mécanique mais d'aveugle, et qui ne coûte pas cher : une alerte automatique, tous les mois (pense à réinjecter le calendrier annuel). en revanche, il faut voir ce qui se passe après la réinjection. »
*La connexion au Drive est abandonnée (jeton et données publiques). Rien à lire à l'extérieur.*

## ① L'ALERTE MENSUELLE — aveugle, mécanique, sans réseau
Le nœud `calendrier` porte la date de sa dernière injection. **Un mois après**, l'EDT affiche dans son bandeau, une ligne discrète et non bloquante : « Le calendrier de l'année a été injecté il y a un mois — pense à le réinjecter s'il a bougé. » Un bouton « Réinjecter maintenant… » ouvre la voie d'injection, un bouton « Plus tard » repousse d'un mois. Le site **ne lit rien à l'extérieur** et ne prétend pas savoir si le document a changé : il compte les jours, rien de plus. Même mécanique pour la grille, sans alerte (elle bouge rarement) : la date de dernière injection est simplement affichée dans la section.

## ② CE QUE LA RÉINJECTION EFFACE AUJOURD'HUI — un trou mesuré
`edtInjInjecter` écrit l'objet reçu **à la place de l'ancien**, en entier. Conséquence sur le calendrier : **toutes les coches « justifié » posées par Paul disparaissent**, sans un mot. Il aurait coché quinze événements en octobre, réinjecté en novembre, tout serait à refaire — et il ne le saurait qu'en voyant sa divergence changer.
**Ce qu'il faut :**
- **Les décisions de Paul survivent.** À la réinjection du calendrier, un événement de classe **du même libellé et de la même date de début** garde son `justifie`. Même règle pour toute marque que Paul aura posée à la main sur un objet injecté.
- **L'écran de vérification annonce le différentiel avant le geste**, comme il le fait déjà pour les périodes : combien d'événements arrivent, combien disparaissent, combien changent de date, **et combien de coches sont conservées**. Exemple attendu : « 3 événements ajoutés · 1 déplacé (Stages 3e : 16/11 → 17/11) · 1 retiré · **5 coches « heures perdues » conservées sur 5** ».
- **Un événement qui disparaît de la feuille et qui portait une coche est signalé nommément** avant l'injection : c'est une décision de Paul qui s'en va.

## ③ L'ÉCRAN S'APPELLE « HEURES PERDUES » — et il dit ce que ça coûte
Paul : « heures perdues c'est pas mal. c'est un sujet récurrent en salle des profs, et là j'aurai une mesure précise. »
L'entrée « Calendrier de l'année… » devient **« Heures perdues »**. Chaque ligne dit **le coût** puis **l'effet**, au lieu de demander un jugement dans le vide :
> « Séjour Verdun 3e · 14-16 octobre · **la 3e Franklin perd 3 heures, les autres classes zéro** → cocher : ces 3 heures ne compteront pas dans son retard. »
**Le site propose la coche** quand un événement retire des heures à une classe et pas aux autres (c'est mécaniquement un écart qui ne dépend pas du professeur) ; Paul confirme ou refuse. **Un événement qui ne coûte aucune heure n'a pas de case** : rien à décider. En tête de l'écran, le total : « cette année, X heures perdues, dont Y déclarées justifiées », par classe.

## ④ PREUVES
Injection du calendrier, cinq coches posées, **réinjection du même calendrier** → **les cinq coches sont toujours là** (relues au hub) · réinjection d'un calendrier où un événement coché a changé de date → coche conservée, différentiel annoncé · où un événement coché a disparu → **signalé nommément avant le geste** · l'alerte apparaît à J+30 de la dernière injection et pas avant (date forcée au banc), « Plus tard » la repousse de 30 jours · l'écran « Heures perdues » sur le calendrier réel : le coût par classe affiché pour chaque événement, les cases proposées seulement là où une classe est seule à perdre des heures, le total en tête · **aucune lecture réseau ajoutée** (compté au banc : zéro requête sortante de plus).
**Non-régression** : porte du pilotage six champs · sans scroll · garde VERTE et rouge sur les trois contrôles négatifs · moteur intact · `published` 97 · `secu*` inchangé · double parseur vert · contrat inchangé.
*Livraison courte, arrêt à la fin. Mot à attendre : **continuer**.*
