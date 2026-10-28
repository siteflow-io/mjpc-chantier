# Taxonomie — les mouvements littéraires et artistiques · proposition v2, appuyée sur les programmes · conscience n°13 · 28/10/2026 07:16

**Pourquoi la v2** : Paul, 28/10 07:12 : « La taxo doit s'appuyer sur eduscol, va voir là bas pour les dénominations. » La v1 (27/10, plus bas, gardée) nommait cinq mouvements « par choix de progression ». Relu ce matin :
- le programme du cycle 4 **en vigueur pour la 4e et la 3e en 2026-2027** (cycle 4 de 2015, ajusté en 2020) : introduction de la culture littéraire et artistique : « tel ou tel mouvement littéraire et artistique » ; **4e**, « La fiction pour interroger le réel » : « l'esthétique réaliste ou naturaliste », « du roman réaliste ou naturaliste au XIXème siècle », corpus « un roman ou des nouvelles réalistes ou naturalistes » ; **3e**, « Visions poétiques du monde » : « la poésie lyrique du romantisme à nos jours » ;
- **aucun autre mouvement n'y est nommé** : ni le Parnasse, ni le symbolisme, ni le surréalisme ;
- le **nouveau programme** (arrêté du 18 février 2026, BO n° 10 du 5 mars 2026 : 5e en 2026, 4e en 2027, 3e en 2028) dit « périodes et courants » (« Identifier quelques caractéristiques majeures de périodes et de courants », 3e) et ne nomme aucun mouvement.

**Statut** : PROPOSÉ — les phrases « pour l'élève » attendent le mot de Paul, mot pour mot.

| id | pour toi (libelleProf) — la dénomination du programme | pour l'élève (libelleEleve) — à valider | niveaux | source |
|---|---|---|---|---|
| fam-52 | Les mouvements littéraires et artistiques | Les grands mouvements de l'art et des lettres | | programme cycle 4, culture littéraire et artistique, introduction |
| litt-040 | Le romantisme | Un art qui place l'émotion, la nature et le « je » au premier plan | 3e | programme cycle 4, 3e, « Visions poétiques du monde » : « la poésie lyrique du romantisme à nos jours » |
| litt-041 | L'esthétique réaliste ou naturaliste | Un récit ou un tableau qui montre la société telle qu'elle est | 4e | programme cycle 4, 4e, « La fiction pour interroger le réel » |

Le Parnasse, le symbolisme et le surréalisme ne sont pas proposés : le programme ne les nomme pas. Quand la 3e passera au nouveau programme (2028), la famille pourra prendre son mot : « Les périodes et courants littéraires et artistiques ».

---

## v1 (27/10, remplacée par la v2 ci-dessus) — Taxonomie — les mouvements littéraires et artistiques · proposition de la conscience n°13 · 27/10/2026 07:16

**Pourquoi** : registre 13 · 71 — la taxonomie (`/taxonomie`, lue en GET le 27/10) n'a aucune notion pour les mouvements (« romantisme », « parnasse », « symbolisme », « mouvement » : 0) ; une diapo sur le Romantisme ne peut déclarer aucune notion juste ; les notes du bilan de la séance 1 du chapitre 3e le signalent. Point 641 du transcript C13.

**Statut** : PROPOSÉ — **rien n'entre au site sans le mot de Paul** : la phrase « pour l'élève » est lue par l'élève (règle : aucune phrase vue par l'élève que Paul n'a pas donnée). Paul valide, corrige ou retire chaque ligne.

**Où** : le domaine « Le texte et ses formes » (`dom-litterature`), une famille neuve après « L'analyse de l'image » (`fam-47`). Ids neufs, jamais réutilisés : la famille `fam-52` (la dernière est `fam-51`), les notions `litt-040` à `litt-044` (la dernière est `litt-039`). Source : « CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion) », comme les registres.

| id | pour toi (libelleProf) | pour l'élève (libelleEleve) — à valider | niveaux | exemple |
|---|---|---|---|---|
| fam-52 | Les mouvements littéraires et artistiques | Les grands mouvements de l'art et des lettres | | |
| litt-040 | Le romantisme | Un art qui place l'émotion, la nature et le « je » au premier plan | 4e-3e | Le Voyageur contemplant une mer de nuages, de Friedrich ; « Le Lac », de Lamartine. |
| litt-041 | Le Parnasse | Une poésie qui cherche la beauté parfaite de la forme, sans dire ses sentiments | 3e | « Les Conquérants », de Heredia. |
| litt-042 | Le symbolisme | Une poésie qui suggère par des images et des sons plutôt que de dire | 3e | « Correspondances », de Baudelaire ; « Chanson d'automne », de Verlaine. |
| litt-043 | Le réalisme et le naturalisme | Un récit ou un tableau qui montre la société telle qu'elle est | 4e-3e | « Aux champs », de Maupassant ; Un enterrement à Ornans, de Courbet. |
| litt-044 | Le surréalisme | Un art qui laisse parler le rêve et le hasard | 3e | « La courbe de tes yeux », d'Éluard ; La Trahison des images, de Magritte. |

**Comment ça entre au site** : le référentiel ne sait aujourd'hui qu'éditer une notion existante (`_taxoGesteEditer`, l. 2405 de la ⑤) ; il ne sait ni ajouter une famille, ni ajouter une notion. Deux voies, à trancher par Paul : (a) E1 ajoute « ＋ Ajouter une notion » (et une famille) à l'écran de la taxonomie ; (b) la conscience prépare l'écriture et Paul la lance. Le fragment JSON, prêt, une fois les phrases validées :

```json
{ "id": "fam-52", "libelleProf": "Les mouvements littéraires et artistiques", "libelleEleve": "Les grands mouvements de l'art et des lettres",
  "notions": [
    { "id": "litt-040", "actif": true, "libelleProf": "Le romantisme", "libelleEleve": "Un art qui place l'émotion, la nature et le « je » au premier plan", "niveaux": "4e-3e", "exemple": "Le Voyageur contemplant une mer de nuages, de Friedrich ; « Le Lac », de Lamartine.", "source": "CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion)" },
    { "id": "litt-041", "actif": true, "libelleProf": "Le Parnasse", "libelleEleve": "Une poésie qui cherche la beauté parfaite de la forme, sans dire ses sentiments", "niveaux": "3e", "exemple": "« Les Conquérants », de Heredia.", "source": "CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion)" },
    { "id": "litt-042", "actif": true, "libelleProf": "Le symbolisme", "libelleEleve": "Une poésie qui suggère par des images et des sons plutôt que de dire", "niveaux": "3e", "exemple": "« Correspondances », de Baudelaire ; « Chanson d'automne », de Verlaine.", "source": "CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion)" },
    { "id": "litt-043", "actif": true, "libelleProf": "Le réalisme et le naturalisme", "libelleEleve": "Un récit ou un tableau qui montre la société telle qu'elle est", "niveaux": "4e-3e", "exemple": "« Aux champs », de Maupassant ; Un enterrement à Ornans, de Courbet.", "source": "CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion)" },
    { "id": "litt-044", "actif": true, "libelleProf": "Le surréalisme", "libelleEleve": "Un art qui laisse parler le rêve et le hasard", "niveaux": "3e", "exemple": "« La courbe de tes yeux », d'Éluard ; La Trahison des images, de Magritte.", "source": "CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion)" }
  ] }
```
