# MANDAT C2 — UNE RÉPONSE NE SE VALIDE QU'AVEC SON ÉLÈVE (C16 717)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/c2`, depuis le dernier commit de `nuit/d` (la conscience te le donne). **20 minutes au plus.***

## 0 · CE QUE PAUL A DIT (ses mots)
- 04/11 07:36 : « le site ne devrait jamais mettre "un élève", parce que la participation doit être enregistrée absolument, sinon ce n'est pas juste pour l'élève. Si je tape des initiales qui n'existent pas dans la classe, le site devrait me le dire. »
- C16 717 (proposé à 23:12, sans réponse de Paul : acquis) : « une réponse ne se valide qu'avec son élève ; Entrée dans une réponse sans élève ne valide pas, la case des initiales demande « Qui a répondu ? » et le curseur y retourne ; la réponse reste telle que tu l'as tapée. Les heures déjà jouées se corrigent dans la Relecture (B). »
- L'exécutant C (`122d2d565`) : « une réponse tapée avec la case des initiales vide, ou après un clic direct dans la réponse avec des initiales inconnues, reste « à personne », et le récit écrit encore « un élève ». »

## 1 · CE QUE TU FAIS
1. En classe, Entrée dans une réponse dont l'élève n'est pas trouvé (case vide ou initiales inconnues) ne valide pas : la case des initiales dit « Qui a répondu ? », le curseur y retourne, la réponse reste telle quelle (rien d'effacé) ; dès que l'élève est désigné (lettres, liste, chiffre — la case de C), Entrée valide comme aujourd'hui.
2. Mesure seulement (ne code rien) : après une correction de la Relecture (mandat B), le résumé de l'heure écrit à la clôture (`dr_partsHeure`, `heures/<clé>/parts`) garde-t-il l'élève saisi en classe, et qui le lit encore ; compté.

## 2 · LA SUPPOSITION (À VÉRIFIER)
La validation d'une réponse : `dit.onkeydown` (Entrée) dans dr-classe ; l'élève trouvé : la case de C (`dr_iniExact`, `dr_iniListe`, dr-socle) ; la participation exige un élève (`r.eleve`).

## 3 · LA PREUVE
La sonde de la case (`LIVRAISONS/DEROULE-01-11/CASE-INITIALES/`), reprise, par le geste, à vitesse humaine : base → après, compté (case vide + Entrée ; initiales inconnues + clic dans la réponse + Entrée : aucune réponse validée sans élève, la réponse gardée, le curseur dans la case ; puis l'élève désigné, Entrée : validée, au journal une fois, la participation au vert) ; la case 24 sur 24, le gel, la Relecture et la correction après l'heure toujours verts ; le parcours vert.
