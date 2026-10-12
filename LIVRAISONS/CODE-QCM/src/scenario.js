/* ═══════════════ Le scénario (QCM-1 · SOCLE : remplacé) ═══════════════
   Le scénario écrit d'avance de la maquette (la classe de 24 élèves, Julien et Michel, les 3 questions, les moments) n'est plus :
   SCN est désormais la séance réelle, lue dans la base (src/live/base.js, chargé avant ce fichier). Les écrans gardent leurs appels
   (SCN.compteurs, SCN.note, SCN.presents, SCN.moment…), qui se calculent sur la vraie séance ; les tables du scénario (RT, LU, TABL,
   FEUI, ESTIM, CO, DIT_B, ORD, PREMIER, ORDRE_CORR, NOMS, SEXE, PAIRES) sont vides et remplacées par des fonctions :
   SCN.reponse(eleve, qi), SCN.lecture(eleve, qi), SCN.ditB(eleve, qi), SCN.estimationDe(eleve), SCN.coevalDe(eleve),
   SCN.ordreChoix(eleve, qi), SCN.ordreCorr(), SCN.eleves(), SCN.sexe(eleve), SCN.places(), SCN.paires().
   Un élève se désigne par son eleveSlug ; SCN.nomDe(slug) donne « NOM Prénom », SCN.pre(slug) le prénom.
   Le moment courant est « LIVE » (MO()), et SCN.moment("LIVE") l'état de la séance au format des moments de la maquette. */
if(typeof SCN === "undefined") throw new Error("src/live/base.js doit être chargé avant src/scenario.js");
