# MANDAT L — MESURER, SANS RIEN CORRIGER : LE TABLEAU DISTANT, UNE SESSION À LA FOIS, ET « JAMAIS BLOQUÉ » (㊶, C16 640, 720)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`. Base : sas `deroule/fermer-lancement` `1a60c142b` (la 8.86.0-⑲ en ligne + 721). Branche : `mesure/une-session`. **20 minutes au plus.** Mesure seulement : aucune ligne du site ne change.*

## 0 · CE QUE PAUL A DIT (ses mots)
- 03/11 12:26 : « Je me demande aussi s'il n'y a pas des télescopages dans tous les sens entre le mode test le tableau, la répétition, etc. Ça me semble être un sacré bazar. En fait c'est assez simple: l'adresse du tableau distant, quand elle est occupée, ne peut JAMAIS être utilisée par une autre session ou autre chose. C'est une session à la fois, que ce soit répétition, séance en mode test ou séance en vraie classe. »
- 03/11 12:42 : « 352. attention au "jamais bloqué". tu proposes sans mesurer le télescopage!! […] IL FAUT MESURER. Pas de proposition en l'air de ta part! »
- C16 720 (05/11) : ce qui n'est pas tranché : qui libère le tableau tenu par un appareil disparu.

## 1 · CE QUE TU MESURES (sur la base ; par le geste ; compté)
1. Ce qui a changé depuis l'audit global I (03/11, 8.81) : rejoue sa partie ㊶ (`LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/sonde-audit-I.mjs`, §1.1 à 1.3, 26 combinaisons) ; pour chacune, qui prend le tableau, et si le second le dit à Paul.
2. Les cas où une règle stricte (« occupé = refusé ») bloquerait Paul : un appareil qui disparaît en tenant le tableau (onglet fermé, ordinateur éteint, réseau coupé), une vraie heure abandonnée sans « Clore », une répétition laissée ouverte, le mode test laissé ouvert ; pour chacun, combien de temps le tableau reste tenu, ce que voit Paul sur un autre appareil, et ce qu'il peut faire aujourd'hui pour reprendre.
3. Les écritures qui marquent qu'une session tient le tableau (les chemins, leur « fraîcheur », qui les efface).
Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le proposes pas.

## 2 · LA SUPPOSITION (audit global I, `RAPPORT-I.md` §0.2, §1 ; À VÉRIFIER)
Le tableau distant suit la session la plus haute de l'ordre « vraie heure > répétition > mode test », relu toutes les 3 s (`dr_tabLirePointeur`) ; rien ne réserve le tableau ; un appareil disparu le garde 4 h ; depuis ㉞, le mode test écrit à `/site/tableau_test`.

## 3 · CE QUE TU LIVRES
`git fetch -q origin +refs/heads/audit/global-I:refs/remotes/origin/audit/global-I`, puis `git checkout origin/audit/global-I -- LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/` dans ton dossier. `LIVRAISONS/DEROULE-01-11/MESURE-UNE-SESSION/` : la sonde (ou la partie ajoutée), ses sorties, une NOTE courte : pour 1, le tableau des combinaisons (avant 03/11 → aujourd'hui) ; pour 2, une ligne par cas ; pour 3, les chemins.
