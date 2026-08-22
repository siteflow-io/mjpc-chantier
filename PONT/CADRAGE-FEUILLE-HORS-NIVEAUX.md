# CADRAGE — LA FEUILLE HORS NIVEAUX (+ articulation strates)
Instruit sur pièces les 22/08 (incident fondateur raconté par Paul : 30 fiches
imprimées pour la 4e AVEC LA MENTION 3E, le jour de la rentrée — le rattachement
gravé à la naissance mentait, et rien ne le déclarait).

## LES CONSTATS DE CODE (sur pièces, index v8.58.0)
1. doc.rattachement={niveau,chapitre,seance,…} est GRAVÉ à la création depuis le
   contexte de naissance (3 sites) ; atDocNeuf() naît rattachement VIDE — l objet
   sait vivre sans niveau, c est le chemin contextuel qui le nivelle.
2. Les composantes classe/niveau sont exige (« se remplit tout seul ») : rendu
   depuis le rattachement gravé → l en-tête peut MENTIR hors du niveau d origine.
3. La carte « Déposée dans… » lit la NOTE depot (un seul lieu) + atItemPointant
   (une adresse précise) ; AUCUNE recherche globale des dépôts n existe → phrases
   vraies-mais-partielles (verte) ou trompeuses (orange « l item n y est plus »
   qui ne dit rien des autres dépôts).
4. atIAAppliquer applique une LISTE FERMÉE (titre, produit, cases, valeurs,
   blocs) : un JSON portant rattachement/niveau est ignoré SILENCIEUSEMENT ;
   les prompts marquent déjà les exige « ne mets pas de valeur ».
5. place_strates est RÉSERVÉ au schéma depuis SITE-COURS-1 (exigence
   d architecture) ; SITE-COURS-4 (morceau ④ du plan) porte déjà : strates par
   niveau, filtrage selon le niveau du connecté, impression « jusqu où on
   remonte » (spiralaire CUMULATIF), wording élève sans le mot « strate ».

## LE LOT (filière normale — SOCLE de SITE-COURS-4)
① VÉRITÉ DES DÉPÔTS : recherche des items pointants sur tous les niveaux
   chargés ; la carte dit TOUS les lieux réels ou « Aucun dépôt » ; la note
   depot meurt ou devient cache réparable.
② ANCRAGE CONTEXTUEL AU RENDU : niveau/classe/chapitre/séance de l EN-TÊTE
   résolus du contexte de la vue ; le rattachement gravé = repli (feuille nue)
   et mémoire d origine. C est LA CLÉ que le filtrage des strates réutilisera.
③ FIN DU GRAVAGE + GARDE DÉCLARÉE ET JOURNALISÉE (arbitrage Paul 22/08 :
   « sinon c est le genre de chose invisible que je ne vérifie pas ») :
   atIAAppliquer REFUSE NOMMÉMENT rattachement/niveau s ils apparaissent dans
   un JSON — refus visible dans le rapport d injection ET journalisé, jamais
   une ignorance silencieuse.

## LES STRATES (SITE-COURS-4, cadré au plan — questions résiduelles pour Paul)
Acquis du plan : strates 6e→3e portées par la même fiche ; filtrage par le
niveau du contexte/connecté ; impression réglable « jusqu où on remonte ».
À trancher par Paul au lancement de ④ :
a) La strate est-elle un EMPLACEMENT unique (place_strates : des blocs marqués
   par niveau insérés à un endroit) ou certaines composantes hors-contenu
   (objectif, exemples) se stratifient-elles aussi ?
b) Le tronc commun : qu est-ce qui est par nature indifférent au niveau
   (définition ?) et qu est-ce qui remonte/descend ?
c) Le prompt fiche_seance : extension de schéma pour produire les strates.

## ARBITRAGES DE PAUL — 22/08 soir (l ordre du plan INVERSÉ)
· PAS de duplication de fiches — jamais (la règle d hygiène transitoire est morte-née).
· Repart à neuf : toutes les fiches actuelles seront SUPPRIMÉES par Paul.
· Le flux de renaissance : EXTRACTION des fiches actuelles → données à une
  instance → RECRÉATION à l identique SANS référence de niveau → puis les
  chapitres se créent et s y réfèrent proprement.
· ORDRE : le LOT feuille-hors-niveaux passe AVANT la création des chapitres
  (argument : les chapitres appellent des fiches dans leur progression — sans
  le LOT, des trous dans les chapitres neufs).
## LIVRABLE AJOUTÉ AU LOT (le flux de Paul l exige)
④ EXPORT DE FEUILLE POUR L IA : un geste « exporter cette feuille » (JSON du
  document, symétrique du P3ter des chapitres) pour donner les fiches actuelles
  à l instance de recréation — l import repasse par le prompt fiche (liste
  fermée + garde ③ : le niveau ne peut pas renaître).
