# DICTÉE — L15.1b-1 (PREMIÈRE PARTIE) — l'analyse des erreurs dans la dictée : le commentaire par l'écart

*Exécutant du complément L15, livraison **L15.1b-1, première partie** (dettes n°12 · 107, 136 ; relecture des rapports à blanc par la conscience, `MANDATS/RELECTURE-L15.1a-ET-L15h-1.md`, valant ok de Paul). **Pour la séance du 06/10.** Ce qui manque pour que L15.1b-1 soit complète est dit plus bas, jamais caché. Rien n'est promu.*

## Ce que ça change pour la classe
- **Le commentaire sous chaque erreur recopiée se déduit de l'écart** entre ce que l'élève a écrit et le mot attendu : « Tu as écrit « naturelement » : attention au l, simple ou double : « naturellement ». » ; « Tu as écrit « centres » : le -s est en trop, ici le mot est au singulier : « centre ». » ; plusieurs écarts sont nommés ensemble (« attention à la consonne double, et à la marque du pluriel »). **Jamais hors sujet** : un écart non reconnu, ou d'une famille qui ne va pas avec le type posé, reçoit le commentaire prudent « Compare lettre à lettre avec le mot juste : « … ». ». **Une forme acceptée (L11) n'a pas de commentaire.** Sans recopie : le commentaire d'avant, par type.
- **« Mot long » = trois syllabes ou plus, la vraie césure** (dette 136 : plus de « 7 lettres découpées par 3 ») : « Mot long — décompose-le en syllabes : na·tu·rel·lement. »
- Les lecteurs : **la copie rendue** (le fichier de la famille, l'aperçu de l'onglet Copies) et **l'analyse des erreurs de l'élève** (son écran) — les deux appels de `gramComment`, mesurés.
- **Réglages → « Les commentaires de l'analyse »** : les catégories présentes dans les erreurs de cette dictée (les autres repliées), **leur commentaire modifiable, commun à toutes les dictées** (enregistré en quittant le champ, écouté en direct) ; **« Ajouter une paire d'homophones »** (a, b, la règle que lira l'élève). Infobulles, aide « ? ».
- **Bilan** : « 🔎 Analyse : n erreurs sans commentaire reconnu sur m recopiées », repliée, avec la liste (forme → mot, fois, élèves) — côté professeur seulement ; côté élève ce cas s'appelle « autre ».

## La relecture appliquée (vérifiée cas par cas)
« travaille / travailles » → **Verbe à la place du nom** ; « Beaucoups », « loins » → **Mot invariable** ; « exhumes », « tombes » → **la personne du verbe** (le mot d'avant décide : un pronom → verbe, un déterminant → nom) ; « étais » → « (2e personne) ; le sujet est « ils / elles », au pluriel » ; « quelque » (L) → le commentaire du pluriel ; « demandes → demander » → terminaison ; la césure : lo·yers, a·ris·to·cra·tique, puan·teur, d'ou·vri·ers, et « consonne + r/l puis i + voyelle = deux syllabes » (ou·bli·er, san·gli·er).

## La donnée (dans l'esprit de la doctrine : des objets, un lieu unique, un seed)
- **41 catégories, des objets au hub** `site/analyses/categories/<id>` (`id, nom, famille, competence, motifs, court, commentaire, exemples, actif, origine: "livré", version, creeLe, modifieLe`), **écrites à la première ouverture par le professeur** ; **les paires d'homophones** `site/analyses/homophones/<id>` (la table du code reste ; ce/ceux ajoutée) ; **le seed embarqué** les porte aussi (l'app tient si le hub manque) ; **écoute en direct**, professeur et élève.
- **Chaque erreur recopiée porte `categorie`** (calculée à la correction, à chaque enregistrement de la copie), **et l'objet forme de L10 aussi**.
- **Le moteur** : un interpréteur générique de motifs (`casse, tiret, collage, apostrophe, chiffre, cedille, homophone, accent, double, suffixe, terminaisons, lettre, inversion, omise, ajoutee, changee, regex, ajout` + `sauf`, `siVerbe`, `siNom`, `siMot`, et un commentaire par motif) ; `syllabes(mot, {vers:false})`.

## Ce qui n'est PAS dans cette première partie (seconde partie, après la séance)
Le bouton « 🤖 Prompt IA — catégories (JSON) », « Vérifier », « Injecter » avec archive et le reclassement des erreurs déjà corrigées ; les alias proposés dans `/taxonomie/alias/tables/correction_dictee` (statut `propose`) et `MJPC_MANIFESTE.notions` ; le lien vers le Panneau prof → Correspondances ; **l'événement du profil** (`/profil/<clé>/events/…`) ; au Bilan, le cumul « toutes dictées » ; les notes de grammaire importées (L15e) et l'indice du mode C comme commentaire. **Puis L15h-2** (les 25 reclassements en C).

## Observé, hors de cette livraison
La phrase « À recopier sur la copie » (le moteur d'avant, `phraseARecopier`) peut viser à côté : sur la copie de la capture (« centres », « préocupation », « naturelement »), elle dit « vérifier la terminaison des verbes à l'imparfait ». Elle pourra s'appuyer sur les catégories (seconde partie) — à trancher par Paul.

## Le fichier
- Base **6.7.0-L15h-b en ligne** (903 883 o, md5 `1a154f3810fa5c9a1ba7ca411f3c9a78`, vérifiée à la commande) → **6.7.0-L15.1b-1** : **941,445 o** (+37,562), md5 `178cbb58dea607d72a363638bffd5f12`.
- Ajoutés : le moteur (`syllabes`, `cesureL151`, `motifL151`, `analyserEcartL151`, `motLongL151`, `CATEGORIES_L151`, …), `ANALYSES_L151`, `categoriesL151`, `ecouterAnalysesL151`, `homophonesL151`, `motAvantL151`, `analyseErreurL151`, `erreursAnalyseesL151`, `CommentairesAnalyseL151`, `NonReconnusL151` ; modifiés : `gramComment` (le premier chemin ; le mot long), ses deux appels, `formesSynchroniser`, `AppProf`, `AppEleveCoeurL15f`, `Reglages`, `Bilan`, l'aide. Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L151b1_geste.py`** (par le geste, 10 vérifications) : les 41 objets au hub à la première ouverture (+ ce/ceux) ; **la copie téléchargée** : les commentaires de « naturelement » (consonne double) et de « centres » (pluriel en trop), « Mot long — … na·tu·rel·lement. », la forme acceptée sans commentaire ; **Réglages** : les catégories présentes, un commentaire réécrit → au hub → **la copie suivante le reprend, sans rechargement** ; une paire « peint / pain » ajoutée → au hub ; **la catégorie posée à la correction** (une G recopiée « préoccupation » → `cat-pluriel-manquant`) ; **le Bilan** ; **la césure relue : 150 / 150** (`cesure_relue_L151.json` : la liste du rapport L15.1a avec les 4 corrections de la relecture) ; 0 erreur.
**Accordé** (la version d'avant jointe) : `banc_L11_geste.py` — les commentaires de la feuille viennent maintenant de l'écart (ils changent) ; il vérifie en plus que la forme acceptée n'a pas de commentaire (un défaut trouvé par lui et corrigé : je lisais le mauvais marqueur).
**Banc unique sur L15.1b-1 : VERT, 0 échec, 37 étapes** (`sorties/`).

## Captures (`captures/`)
`A1-reglages.png` (« Les commentaires de l'analyse ») ; `A2-copie-eleve.png` (la copie rendue : les commentaires de l'écart, le mot long).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une dictée corrigée avec recopies → Données → Copies → un élève : sous chaque erreur, « Tu as écrit « … » : … ».
2. Réglages → « Les commentaires de l'analyse » : réécris un commentaire, quitte le champ ; rouvre la copie : il a changé.
3. Bilan : « 🔎 Analyse : n erreurs sans commentaire reconnu ».
4. Côté élève (séance) : l'analyse de ses erreurs montre les mêmes commentaires.
