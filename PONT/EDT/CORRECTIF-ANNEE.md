# LOT 2bis — CORRECTIF DE LA VUE ANNÉE (relevé de Paul, 26/08)

## ④ter LA VUE ANNÉE — DEUX DÉFAUTS VUS PAR PAUL SUR TA CAPTURE, ET VÉRIFIÉS DANS TON CODE
Paul, en regardant `5-2-annee` : « pourquoi y a-t-il des grandes barres jaunes verticales ? et où sont tous les événements prévus ? »
**Mesuré par la conscience :**
1. **Les barres jaunes sont tes jalons.** `.edt-an-jalon` est un trait ambre de 1 px avec `top:0;bottom:0` : il **traverse toute la hauteur de l'écran**, coupe chaque piste de classe, et comme trente jalons se pressent par endroits, ils forment des paquets de barreaux. Sur ta propre capture on ne lit plus rien d'autre.
2. **Les événements ne sont pas là du tout.** Ni `etablissement` (59 entrées : pré-rentrée, photos, conseils, réunions, portes ouvertes…), ni `evenementsClasse` (15 : Séjour Verdun 3e, stages 3e, tribunaux 4e, forums, séjour Pays-Bas 4e) n'apparaissent une seule fois dans `edtPeindreAnnee`. Or **ce sont eux qui décalent une classe** — c'est précisément ce qu'une vue d'année doit montrer.
**Ce qu'il faut :**
- **Une bande des temps de l'année, en haut, hors des pistes** — comme la semaine a déjà la sienne : les jalons y sont des repères courts (trait + libellé quand la place le permet), les vacances des bandes nommées, « aujourd'hui » un trait franc. **Aucun trait ne traverse les pistes de classes** ; au plus une graduation discrète pour situer les mois.
- **Les événements de classe sur la piste de LEUR classe** : un séjour, un stage, un tribunal est un segment sur la ligne de la 3e ou de la 4e concernée, avec son libellé quand la place le permet et au survol sinon, et une marque « écart justifié » quand il l'est. C'est ce qui explique visuellement pourquoi une classe prend du retard.
- **Les événements d'établissement dans la bande du haut** (ils concernent tout le monde), regroupés quand ils tombent le même jour, lisibles au survol et au clic.
- **Quand deux repères se touchent**, ils se regroupent (« 3 le 14/11 ») plutôt que de se superposer.
**Preuves exigées** : capture de la vue Année sur le calendrier réel — on doit **lire** les mois, les vacances nommées, les jalons sans qu'ils barrent l'écran, et **voir les 15 événements de classe sur leurs pistes** ; compte affiché : jalons, événements d'établissement, événements de classe effectivement représentés (aucun perdu en silence) ; et le pourcentage de surface utile occupé, comme au §④bis.

*Ce texte s'ajoute au complément déjà livré : il ne remet rien en cause de ce qui est prouvé, il corrige la vue Année. Livraison courte, arrêt à la fin, mot à attendre : **continuer**.*
