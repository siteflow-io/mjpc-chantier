# Audit final — la maquette complète du QCM (10/10/2026, conscience n°12)

Branche auditée : `maquette-qcm` du sas (commit `50b1efee`, 10/10 10:54 UTC ; `claude/bold-bohr-zxodms` est le même commit). Mandat : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/MANDAT-MAQUETTE-QCM-COMPLETE.md. Livraison : `MANDATS/MAQUETTE-QCM-COMPLETE/` sur la branche, `maquette-qcm-v5.html` (md5 `940531e53cb7163c35eeaa4df3c562ef`, vérifié).

## Verdict : ça ne va pas encore

Le travail est sérieux (159 scènes dans l'ordre de la séance, 35 défauts trouvés et corrigés par l'exécutant, tableau « point → scène », mesures, livret). Son banc, rejoué ici, passe : **15 712 vérifications, 0 échec** (`sorties/banc-audit.txt`). Mais il reste **quatre défauts que ce banc ne voit pas**. La livraison n'est pas à donner à Paul pour validation tant qu'ils y sont.

Ce qui a été vérifié : la branche n'écrit que dans `MANDATS/MAQUETTE-QCM-COMPLETE/` (aucun autre fichier du sas touché) ; le md5 de la maquette ; le banc rejoué ; les textes visibles et les infobulles de toutes les scènes, relevés dans Chromium (`scripts/meta.js`, `scripts/meta-tips.js`) ; les écrans de MJPC comparés à `index.html` de la production (md5 `ac792b28…`) et au hub (lecture seule, 10/10 08:55) ; dix captures regardées (console en question, attestation, bilan, fiche, Réglages, MJPC).

## Les défauts

**1. Les deux écrans de MJPC ne partent pas de l'existant** (mandat §1.8 et §3 ; protocole maquette, règle du 03/10).
- « Élèves & codes » (`m-classe-exclusions`) : la ligne réelle (`index.html`, l. 5529) porte le nom cliquable qui ouvre la fiche de l'élève (sexe, dispositif, cases PAP : là où sont les aménagements), le code, **↻** « Régénérer le code » et **✕** « Retirer l'élève » ; au-dessus, la zone d'import et « + Importer / compléter » (l. 5518), la barre d'outils (l. 5522). La scène n'a que le nom, le code masqué et « 🚫 Jamais avec… ».
- « Taxonomie » (`m-taxonomie-competences`) : l'écran réel (`_blocTaxonomie`, l. 2605) a « Ouvrir l'éditeur » et l'arbre Domaine › Famille › Notion. La scène n'a ni l'un ni l'autre, et affiche **« Version 3.2 · 10/10/2026 · 5 domaines · 142 notions »**, des chiffres inventés : le hub dit version 1.4.0 (02/08/2026), 7 domaines, 51 familles, 210 notions.
- Le menu du panneau prof : seules « Élèves & codes » et « Taxonomie » sont des boutons ; les autres entrées ont l'air cliquables et ne font rien (protocole §2 : aucun bouton inerte).

**2. Des renvois au cadrage à l'écran** (protocole §2 : aucune phrase méta). Textes visibles : « Le prompt du cadrage (tour 630). … » et « … aucune note ne tombe entre deux (340). » (`c-reglages`, `c-reglages-prompt`). Infobulles : « Ouvre le mode d'emploi du QCM, réécrit d'après le cadrage : … » (sur « 📖 Mode d'emploi », dans toutes les scènes de console) et « Remet le prompt du cadrage (tour 630) à la place du tien. … ». Relevé complet : `sorties/meta.txt`, `sorties/meta-infobulles.txt`.

**3. Les limites de longueur se contredisent** (`mesures/README.md`). À énoncé court, 5 choix tiendraient 410 caractères et 6 choix 480 : la mesure à 5 choix garde la répartition des 5 premiers choix de la question 3, dont le plus long (137 caractères). Le texte pour `{{LIMITES}}` donnerait à l'instance une règle absurde (moins de choix, moins de texte). Les limites doivent être mesurées avec la même règle de répartition, et décroître avec le nombre de choix.

**4. Une phrase d'élève de la 7.7.1 retirée sans cadrage** (défaut n°19 du journal de l'exécutant). « 👀 Écoute le prof — la correction sera révélée. » existe dans la 7.7.1 ; elle a été remplacée parce que le banc interdit tout « le prof » côté élève. La règle de Paul vise « va voir ton professeur » (l'élève lève la main) et ce qui met le professeur en cause : cette phrase n'est ni l'un ni l'autre. Elle revient, et le banc cesse d'interdire « le prof » en soi.

## Les gardes qui manquaient au banc

1. **L'existant** : pour chaque scène dont l'écran existe en production (la 7.7.1 sur le faux hub du banc, `index.html` pour MJPC), la liste de ses boutons, champs et entrées de menu relevée dans le vrai écran ; le banc refuse une scène qui en perd un.
2. **Le méta** : aucun numéro de point ou de tour, aucun « cadrage », « mandat », « maquette » (hors ⚙) dans un texte visible ni dans une infobulle.
3. **Les chiffres** : un chiffre affiché qui décrit une donnée réelle (version, nombre de notions…) vient de la donnée réelle, relue.
4. **Les mesures** : les limites décroissent avec le nombre de choix.

## Une tension de cadrage, vue pendant l'audit (pas un défaut de l'exécutant)

Dans le bilan de Michel (`t-bilan`), le bloc « 🎯 Ton estimation » dit « Tu as un peu surestimé ce que tu avais réussi » (la phrase de la 7.7.1, écart vert → orange), pendant que son bilan général (`c-fiche`) dit « tu as nettement surestimé ce que tu avais réussi » (point 657). Proposé à Paul : le bloc suit la même règle.

## Ajout du 10/10, 14:00 (tour 639) : un cinquième défaut, manqué à l'audit

**5. L'écran du PDF porte les marques de validation** (`x632-pdf`). On y voit l'encadré « Exemple de la maquette. Dans les commentaires, souligné en pointillés orange : une phrase proposée, pas encore validée par toi. … » et 121 soulignés orange. Ce sont les marques que `gen632.js` mettait pour la relecture de Paul au tour 632 ; tout est acquis depuis (point 659).

La cause est double, et elle est de la conscience : le mandat demandait le PDF de `gen632.js` « mot pour mot » sans exclure ces marques, et le relevé de l'audit (`scripts/meta.js`) ne lisait pas l'intérieur des cadres (`iframe`).

Le défaut a été trouvé en écrivant le complément, par un relevé neuf des 159 scènes, cadres compris :
- textes et infobulles : `scripts/meta-cadres.js`, sortie `sorties/meta-cadres.txt`. Les autres lignes de cette sortie sont soit les défauts déjà relevés, soit de faux positifs : « Proposition Principale », « Binômes proposés », « 👥 Classe (25) », et le sommaire ⚙, qui est permis ;
- soulignés : `scripts/soulignes.js`.

La correction et sa garde sont dans le complément : https://github.com/siteflow-io/mjpc-chantier/blob/main/MANDATS/COMPLEMENT-MAQUETTE-QCM-COMPLETE-1.md (défaut 5, garde 2).
