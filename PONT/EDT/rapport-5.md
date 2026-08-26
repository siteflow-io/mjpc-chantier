# LOT 2bis — LIVRAISON ⑤ · MOIS, ANNÉE, DIVERGENCE, CLASSE EXPÉRIMENTALE, ABSENCE

*Candidat `8.71.0` au sas, 1 611 833 o. Aucune promotion. Faux hub, zéro sortie réseau.*

---

## ① QUATRE VUES, UNE SEULE TÊTE

Semaine · Mois · Année · Calendrier de l'année… Les quatre partagent la même barre : les vues, les flèches, « Aujourd'hui », « Photo du prévu » (semaine seulement), « ✕ Fermer l'emploi du temps ». Les flèches avancent d'une semaine ou d'un mois selon la vue.

**Aucune ne défile**, mesuré sur les trois nouvelles : `scrollY` reste à 0 après une tentative à 4000 px, la hauteur de l'écran égale celle de la fenêtre.

**Le mois** — la même grille, condensée : cinq colonnes, six semaines, une pastille par cours avec sa couleur (jouée, sans séance, prévue, autre) et le nom de la classe. Un jour sans cours porte son motif.

**L'année** — une ligne par classe : son nom, son étiquette, son palier, puis une piste où chaque chapitre publié pose sa barre. **Le réel** (verte) va de la première à la dernière heure jouée ; **le prévu** (grise) est une projection. Au-dessus, une règle fixe : les jalons communs en traits ambre, les périodes sans cours en blocs gris, aujourd'hui en trait rouge.

**Le calendrier de l'année** — trois colonnes : les événements de classe (avec la case « justifié »), les jalons communs, les périodes sans cours et les fériés.

## ② LA DIVERGENCE — et une erreur que le banc a rendue visible

Paliers progressifs, jamais un blocage : **0-1 h → dans les temps · 2 → léger · 3 → marqué · 4+ → critique**.

**Mesuré avec deux classes de 3e d'avance différente** (3E CDG : 2 séances jouées ; CLASSE TEST : 0) :

| Classe | retard brut | justifié | palier |
|---|---|---|---|
| 3E Charles de Gaulle | 0 | — | dans les temps |
| CLASSE TEST | **2 h** | 0 | **léger** |

Puis, deux heures sorties de la prévision **pour CLASSE TEST seule** : `2 h de retard dont 2 justifiées` → retour à **dans les temps**.

**L'erreur trouvée.** Mon premier calcul retirait du retard **toutes** les heures justifiées de la classe. Le banc l'a montré : un séjour qui prend les heures des **deux** classes du même niveau effaçait un écart de 2 h qui n'avait rien à voir avec lui.

*Correction d'attribution (Paul, 26/08).* J'avais présenté cet exemple comme s'il illustrait une phrase de Paul sur les 3e. Vérifié au transcript C10, tour 71, et au registre `MJPC6-DETTES.md` L195 : sa phrase — « un retard de progression dû à un voyage scolaire que fait une classe et pas l'autre » — **ne nomme aucun niveau**, et son tour entier n'en nomme aucun. L'exemple des 3e vient du banc, pas de lui. La règle qu'il énonce est générale : *une classe et pas l'autre*.

La justification porte donc désormais sur le **différentiel** : on compare les heures perdues par cette classe à celles de la classe de référence, et on ne retient que l'écart. Un événement qui touche tout le niveau ne justifie plus rien entre deux classes du niveau — vérifié : `justifieEcart: 0` malgré 3 heures justifiées de chaque côté.

La carte dit maintenant ce qu'elle compte : « léger · 2 h de retard dont 2 justifiées ».

## ③ LA CLASSE EXPÉRIMENTALE — présente partout, étiquetée, jamais masquée

`experimentale: true` sur la classe. Mesuré :

```
marquée      : true
sur la carte : « 3E Charles de Gaulle expérimentale | dans les temps | Poésie et peinture… 2/9 »
mention      : « classe expérimentale — si cette classe était réelle, voilà ce que ça donnerait »
interrupteur : false
```

Ses chiffres comptent partout, ils se déclarent eux-mêmes. **Aucun rideau, aucun interrupteur** — la décision de Paul, à la lettre. `conservee: true` est lu et gardé ; la règle de purge reste hors de ce lot, comme le mandat le dit.

## ④ L'ABSENCE — le geste du QCM, dans la trace de l'heure

Dans la modale d'une heure **jouée**, la liste des élèves de la classe. Un clic marque, un clic défait — le geste réversible de `evaluation-qcm.html`, repris tel quel (barré, grisé). Écrit dans `absents[]` de la trace de cette heure, avec la clé-élève canonique `sanMJPC`.

Mesuré sur le lundi 7 septembre 08:57 : 29 élèves, « Absents de cette heure (0 sur 29) » ; deux clics → `["audebert_elise","boivin_eden"]` au hub ; un clic inverse → `["boivin_eden"]`. **Réversible.**

Jamais montré à la classe : ces boutons ne vivent que dans la modale du professeur.

## ⑤ UNE TROISIÈME EXCEPTION, DÉCLARÉE

La garde a refusé l'écriture des absents : elle sort de `/site/edt/`. C'est prévu par le mandat (« écrite dans la trace de l'heure »), donc elle entre dans `verif_edt.py` comme **exception ③**, avec sa raison — et avec la précision que le chemin n'est jamais fabriqué à la main : il vient de `edtCheminTrace`, qui le retrouve depuis la classe, la date et le créneau. `sanMJPC` entre au contrat pour la même raison.

Les trois exceptions, et rien d'autre : `brevetDates` · la variable `AT_EDT` · `absents[]` dans la trace d'une heure jouée.

## ⑥ INVARIANTS

| | |
|---|---|
| Candidat | 8.71.0, 1 611 833 o |
| Double parseur | vert |
| Garde `verif_edt.py` | **VERT**, rouge sur les trois contrôles négatifs |
| Moteur `AT_DR_B64` | intact |
| `published` | 97 → 97 |
| Appels `edt*` hors du bloc | `edtSectionPanneau` seul |
| Porte du pilotage | les six champs toujours identiques |

Captures : `5-1-mois` · `5-2-annee` · `5-3-calendrier` · `5-4-absents` · `5-5-divergence-deux-classes`.

## ⑦ CE QUI VIENT — ⑥, la dernière

Les portes ① (l'arrivée du professeur) et ③ (le bandeau du déroulé) · le réglage « arriver sur l'emploi du temps » · le téléphone qui ne casse pas · les bancs complets et la matrice actions × état · `SEQUENCE-TEST-PAUL.md`, geste par geste · le rapport final.

*Mot à attendre : **continuer**.*
