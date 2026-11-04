# MANDAT E — DEUX DÉFAUTS DU BANC, À RÉGLER AVANT LA PROMOTION (C16 636)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/e`, depuis le dernier commit de la nuit (la conscience te le donne). **20 minutes au plus.** Ici, exceptionnellement, tu travailles sur les sondes du banc ; jamais dans `AUDITS/` : un patch, comme `banc/chrono-v3` `bc38d53fb` l'a fait pour K11.*

## 0 · CE QUI EST DIT
- C16 636 (Paul, 22:22 : « maintenant tout le reste » ; C16 708 : « à régler avant toute promotion ») : « Mon banc : deux défauts déjà là avant aujourd'hui, une sonde du récit qui ne lit pas la liste (R1c) et une écriture vers une adresse de test du tableau ; à régler avant une promotion. »
- Paul : jamais de promotion sur dette ; un banc unique rejoue tous les bancs et échoue si un seul échoue.
- C16 715 : deux contrôles de la sonde de la Relecture (A4, A6) ont été écrits sans oral ; un oral qui remplace une activité la compte « faite à l'oral » (la règle de 609) et les fait échouer : il leur faut le cas de l'oral, à part.

## 1 · CE QUE TU FAIS
1. R1c (`LIVRAISONS/DEROULE-01-11/RECIT-RATTRAPE/sonde-recit.mjs`) : il échoue déjà sur la base. Mesure pourquoi (la sonde, ou le site) ; si c'est la sonde qui lit mal, corrige la sonde ; si c'est le site, dis-le, ne le corrige pas.
2. L'écriture vers l'adresse de test du tableau (`/site/tableau_test`) dans le banc : trouve quelle étape l'écrit et si elle a le droit (K15-test permet 0 écriture hors de `/site/tableau_test`) ; même règle : la sonde se corrige, le site se dit.
3. La sonde de la Relecture (`MESURE-RELECTURE/sonde-relecture.mjs`) : A4 et A6 avec un oral qui remplace une activité, en cas à part, juste selon la règle de 609.

## 2 · LA SUPPOSITION (À VÉRIFIER)
Les sorties du dernier banc : `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/banc-chrono/` (`banc.txt`, `R-*.txt`, `sonde-1266.txt`, `etape13/`, `etape16/`) et `…/scratchpad/banc-trois/` ; le banc : `…/scratchpad/banc-sans-temoin.sh`. Je ne sais pas où est l'écriture vers l'adresse de test.

## 3 · LA PREUVE
Chaque sonde changée, rejouée sur la base de la nuit et sur le dernier commit de la nuit : verte, et ce qu'elle vérifie dit, compté ; rien d'affaibli (une vérification n'est jamais retirée pour passer au vert).
