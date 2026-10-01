# MICRO — correction_dictee 6.6.2 — « la duplication est totale » (dette n°12 · 92)

*Conscience n°12, 01/10/2026, filière micro (Paul : « fais-le directement, pas besoin d'exécutant »). Rien n'est promu : attend le « promeus » de Paul.*

## Ce que ça change pour toi
Le bouton ⧉ d'une dictée copie maintenant **tous ses réglages** — la configuration (titre « Copie de … », non publiée), **la version aménagée entière** (trous, modes, base, consigne), les options de copie, les exercices et leur page, les binômes, l'heure — et **jamais ce que les élèves ont fait** (copies corrigées, absents, choix d'aménagement pour cette dictée, autocorrection, copies effacées, résultats d'exercices, date de remise). Le message dit ce qu'il a copié (« 7 réglages copiés, version aménagée comprise ; aucune copie d'élève ») ; l'infobulle du bouton dit ce qu'il copie et ce qu'il laisse.

## Le fichier
- Base `correction_dictee.html` 6.6.1 (736 690 o, md5 `ebf6fdc82bf032eb5f98fe54f9ea3fde`, blob `f3abec79b8c3`, re-téléchargée et vérifiée) → **6.6.2** : 738 095 o (+1 405), md5 `0aeb77123b356a2529dbe3751a3911c6`.
- Édition ciblée : le `onClick` et le `title` du bouton ⧉ (2 lignes retirées) ; `DUP_REGLAGES`, `DUP_ETAT_ELEVES`, `dupliquerDicteeEntiere(d, cb)` ajoutés avant `supprimerDicteeAvecCorbeille` (23 lignes) ; `APP_VERSION` 6.6.2. Relevé de collisions : 0. `node --check` : 0 erreur.

## Le banc (`bancs/banc_micro_dup.py`) — par le geste (le bouton ⧉), base EN MÉMOIRE (faux Firebase), données ZZTEST, 0 sortie du navigateur
Une dictée semée avec tous les nœuds (7 réglages, 9 nœuds d'état d'élèves). VERT, 11 vérifications, 0 échec : 6.6.1 — la copie n'a que `config` ; 6.6.2 — la copie a exactement les 7 réglages, la version aménagée entière (2 lacunes, A et C, base 10, consigne), rien de l'état des élèves, titre « Copie de … » non publiée, le reste de la config identique ; l'original comparé nœud à nœud : intact ; une seule écriture de dictée (sous la copie) ; le message et l'infobulle ; 0 erreur JS.

## Captures
`captures/base-2-apres-dup.png` (6.6.1 : la copie sans badge « Aménagée ») / `captures/livree-2-apres-dup.png` (6.6.2 : la copie porte « 📘 Aménagée · 2 », non publiée).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.6.2 → Accès professeur.
2. Dans la liste, sur ta dictée de 3 Dylan Bob (elle a sa version aménagée) : ⧉ → le message « Dictée dupliquée : Copie de … (7 réglages copiés, version aménagée comprise ; aucune copie d'élève) ».
3. La copie apparaît avec le badge « 📘 Aménagée », « Non publiée » ; ouvre-la → Préparation → « Paramétrer une version aménagée » : les trous sont là.
