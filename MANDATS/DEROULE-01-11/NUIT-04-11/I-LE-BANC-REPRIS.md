# MANDAT I — LES SONDES DU BANC QUI LISENT L'ANCIEN GESTE ; LES PARTIES ROUGES REJOUÉES (C16 740)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). **30 minutes au plus.** Le site ne change pas : le candidat est l'assemblé de `cd88b59f9` (`nuit/h`), md5 `3e8a46c998bfdb456542fe648b19452f`. Ici, tu travailles sur les sondes du banc : une branche `banc/nuit` depuis `origin/banc/vraie-horloge`, où tu poses aussi les deux fichiers de `banc/chrono-v3` `bc38d53fb` (`LIVRAISONS/INTEGRATION/EX/bancs/sonde-10.mjs`, `LIVRAISONS/DEROULE-01-11/SESSION-PARTOUT/sonde-session.mjs`). Jamais dans `AUDITS/`.*

## 0 · CE QUI EST DIT
- Paul, 04/11 21:40 : « Tu me rajoutes des demi heures à chaque fois » ; C16 691 : les sondes qui lisent ce qu'un morceau change se mettent à jour avec lui.
- Paul : un banc passe par le geste ; un exemple de banc est toujours réaliste ; aucune vérification affaiblie.
- C16 717 (acquis) : une réponse ne se valide qu'avec son élève (en classe, Paul tape les initiales, puis la réponse).
- Mandat H (㊵) : chaque appareil écrit l'heure du hub à `/site/horloge`, la relit, puis l'efface ; rien n'y reste.

## 1 · LE BANC DE LA NUIT (`…/scratchpad/banc-nuit.sh`, sorties `…/scratchpad/banc-nuit-out/`) : CE QUI EST ROUGE
1. Banc 1-12, la sonde du bloc question (`LIVRAISONS/DEROULE-01-11/QUESTION-ORDRE/`, appelée par `AUDITS/INTEGRATION-DEROULE/banc.sh` l. 27) : Q4, S1, S2, S3, S4 — « le pas n'a pas abouti — pas de ligne libre ».
2. Étape 13, la frappe au tableau (`FRAPPE-TABLEAU/sonde-frappe-tableau.mjs`) : 163 lettres sur 244 jamais vues ; une seule réponse sur trois entière.
3. Étape 15, l'appel (`APPEL/sonde-…`) : P2H, Q, X, RPH, Z — « aucune écriture hors des chemins permis » : `PUT /site/horloge` ×3 et `DELETE /site/horloge`.
4. Les sondes de la nuit, à éclaircir : le réseau lent (`RESEAU-LENT/sonde-f.mjs`, Q4) dit « clique: false » (le ▶ pendant l'attente n'a pas été pressé dans le banc ; 0 / 3) ; le chrono (`NUIT-04-11-H/sonde-h-horloge.mjs`, Q2D, Q2R) n'a vu 00:00 sur aucun écran (null), alors que l'écart pendant la course est de 0 s.

## 2 · LA SUPPOSITION (À VÉRIFIER)
- 1 et 2 : ces sondes tapent une réponse sans élève (clic direct dans la réponse) ; depuis C2, Entrée ne la valide plus : pas de nouvelle ligne. Correction réaliste : elles tapent d'abord les initiales d'un élève de la classe, comme Paul, puis la réponse ; toutes leurs vérifications restent.
- 3 : `/site/horloge` manque à la liste des chemins permis de la sonde de l'appel ; correction : le permettre, avec une vérification de plus : à la fin, rien ne reste à `/site/horloge`.
- 4 : un temps ou un sélecteur du banc (la vraie horloge, `MJPC_HORLOGE=date`) ; rejoue chacune comme son mandat l'a jouée et avec `MJPC_HORLOGE=date`, et dis d'où vient l'écart. Si c'est le site, dis-le, ne le corrige pas.

## 3 · LA PREUVE
Un script `…/scratchpad/banc-reprise.sh` sur le modèle de `…/scratchpad/banc-trois.sh` (le même `wt-banc`, `MACHINE-CONSCIENCE`, la vraie horloge, les sondes de `banc/nuit`) qui rejoue sur le candidat : la sonde du bloc question, l'étape 13, l'étape 15, et les deux sondes du point 4. Chacune verte, compté ; ce que chaque sonde changée vérifie, dit ; rien d'affaibli. Tu pousses `banc/nuit` et les sorties dans `LIVRAISONS/DEROULE-01-11/NUIT-04-11/I/`.
