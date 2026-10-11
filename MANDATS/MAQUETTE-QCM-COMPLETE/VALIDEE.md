# La maquette complète du QCM — validée par Paul

**Validée le 11/10/2026 à 13:15** (Paul : « Promeus »), après :
- l'audit final du complément 2 (https://github.com/siteflow-io/mjpc-chantier/blob/main/AUDITS/MAQUETTE-QCM-COMPLEMENT-2-11-10/README.md) ;
- les quatre tests joués par la conscience (même rapport, section du tour 646).

## La version qui fait foi

| Fichier | md5 |
| --- | --- |
| `maquette-qcm-v7.html` | `6be84ea1fb636017ce7225bfa3556082` |
| `livret-maquette-qcm-v7.pdf` | `458459dd5f05d14982fc8933604339df` |

Elle a 169 scènes. Son banc final, rejoué par la conscience, compte 19 222 vérifications et 0 échec (`sorties/banc-final-v7.txt`). Elle est fusionnée dans `main` du sas depuis la branche `maquette-qcm` (commit `c6611fb3`).

Les v1 à v6 restent dans ce dossier comme histoire : elles ne font plus foi.

## Ce qui suit

Le mandat de code part de cette maquette, geste par geste (protocole maquette, §6) :
- la partie QCM (`evaluation-qcm.html`) ;
- la partie MJPC (`index.html`), qui part d'`index.html` tel qu'il sera après la promotion du déroulé (point 677).

Ce que la maquette change dans MJPC est listé écart par écart dans le README (section « Complément 2 ») et dans `banc/existant/ecarts-mjpc.json`.

Rien n'a changé dans le vrai site. Les dettes n°12 · 87, 88 et 212 s'y règleront avec le code.
