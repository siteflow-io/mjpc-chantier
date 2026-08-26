# LOT 2bis — EMPLOI DU TEMPS · RAPPORT FINAL

*Candidat `8.71.0` déposé au sas : `PONT/EDT/index.html`, 1 614 210 octets.*
*Base : 8.70.1, md5 `6c7560afa9e431f23f89aa6fe167bb6b`. Aucune promotion. Aucune écriture au vrai hub.*

---

## ① CE QUE ÇA CHANGE POUR LA CLASSE

Hier : Panneau prof → Atelier → Mes chapitres → Modifier → Déroulé → Lancer. Six gestes.
Aujourd'hui : **le professeur se connecte, sa semaine s'ouvre, il clique sur la case de maintenant, il lance.** Deux gestes.

Le reste du lot sert cette phrase : le prévu se calcule pour qu'il y ait quelque chose dans la case ; les décisions horaires existent pour que la case dise la vérité quand une heure saute ; la divergence alerte pour qu'un écart entre deux classes ne se découvre pas en juin.

## ② LE BLOC

Un seul bloc `/* ═══ EDT — début ═══ */ … /* ═══ EDT — fin ═══ */`, **108 fonctions `edt*`**, ses styles préfixés `.edt-` posés par lui-même, ses nœuds sous `/site/edt/`.

**Quatre lignes modifiées hors du bloc**, et pas une de plus :

| Où | Quoi |
|---|---|
| barre du panneau prof | le bouton « 📅 Emploi du temps » |
| `_renderProfSection` | une ligne → `edtSectionPanneau()` — **porte ②** |
| fin de `loginAsProf` | `edtArriveeProf()` — **porte ①** |
| bandeau du déroulé (`atDrMonter`) | le bouton « 📅 Emploi du temps » → `edtOuvrir()` — **porte ③** |

Plus le numéro de version.

## ③ LES SEPT OBJETS, ET LES TROIS EXCEPTIONS

Au hub, sous `/site/edt/<objet>/<annee>` : `calendrier` · `grille` · `creneaux` · `periodes` · `decisions` · `photos` · `reglages`. Aucun n'est obligatoire ; ce qui manque manque, et le site marche comme avant.

**Le prévu n'est écrit nulle part.** Il est recalculé à chaque affichage. Seules les photos sont écrites.

Trois écritures sortent de `/site/edt/`, **et trois seulement**, chacune nommée dans la garde :

1. `/site/config/brevetDates/<niveau>` — le premier jour du DNB, à l'injection du calendrier (décision de Paul, 26/08) ;
2. la variable `AT_EDT` — les créneaux du site, alimentés depuis l'objet, avec repli sur la valeur en dur ;
3. `absents[]` dans la trace d'une heure jouée — le chemin vient de `edtCheminTrace`, jamais fabriqué à la main.

## ④ LA GARDE — `verif_edt.py`

```
VERT — ① le bloc EDT n'appelle que le contrat
       ② rien hors du bloc n'appelle edt* sauf les portes déclarées
       ③ tous ses nœuds sont sous /site/edt/, hors les exceptions nommées
```

Elle refuse, vérifié à chaque livraison sur des copies du candidat : un appel hors contrat dans le bloc → ROUGE ① · un appel `edt*` ailleurs qu'aux trois portes → ROUGE ② · une écriture hors `/site/edt/` → ROUGE ③.

**Elle a servi cinq fois, et à chaque fois elle avait raison** : `atModaleChoix` et `atelierOuvrir` appelés sans être déclarés · `sanMJPC` de même · l'écriture des absents hors `/site/edt/` · `edtArriveeProf` appelé hors du bloc avant d'être déclaré comme porte. Le contrat n'a jamais été élargi en silence.

*Deux défauts de la garde elle-même, corrigés :* elle écartait d'abord commentaires et chaînes par un balayage qui se désynchronisait sur 1,5 Mo et **passait au vert après avoir perdu 58 % du fichier** — une garde aveugle qui se tait ; et elle comptait `classList.add(` comme un appel à une fonction `add` du site. Elle travaille maintenant sur le texte brut et ignore ce qui suit un point : l'erreur possible penche du côté strict.

## ⑤ LES INVARIANTS

| | base 8.70.1 | candidat 8.71.0 |
|---|---|---|
| moteur `AT_DR_B64` | 309 812 car., md5 `2ba70f9ef8aacb6f` | **identique** |
| `published` | 97 | **97** |
| double parseur (`new Function` + acorn ES2020) | — | **vert**, 2 scripts |
| taille | 1 522 853 o | 1 614 210 o (+91 357) |
| appels `edt*` hors du bloc | — | `edtArriveeProf`, `edtSectionPanneau`, `edtOuvrir` — les trois portes |

## ⑥ LES PREUVES — banc `tests/banc-2b.mjs`

Faux hub en mémoire amorcé par instantané réel, chaque écriture captée et comptée, **zéro sortie réseau**. Chrome 131.

| Ce qui est prouvé | Mesure |
|---|---|
| **la porte du pilotage** | six champs comparés à ceux du bouton d'aujourd'hui : **identiques** |
| porte ① — arrivée du prof | l'écran s'ouvre `position: fixed` par-dessus ; l'accueil reste dans le DOM, 3 690 caractères avant **et après** |
| réglage « arriver sur l'EDT » à non | l'écran ne s'ouvre plus ; `{arriverSurEdt:false}` au hub |
| élève, téléphone-pilote, vue tableau | l'EDT ne s'ouvre **jamais** (`false` dans les trois cas) |
| porte ③ | bouton « 📅 Emploi du temps » présent dans le bandeau du déroulé |
| sans scroll | 1366×768 et 1920×1080 : hauteur = fenêtre, **0** case qui déborde, `scrollY` **0** après une tentative à 4000 px |
| le prévu | 110 min → **3 heures**, la même séance sur trois cases successives, la séance jouée sautée |
| le réel | l'heure jouée colore sa case, indépendamment de ce qui reste à faire |
| une heure sans séance | la grille glisse en temps réel ; ↶ Annuler la remet ; le journal garde les deux gestes |
| une heure déplacée | départ vidé, arrivée épinglée, Annuler défait les deux côtés |
| la modale | sans voile, déplaçable, bornée à la fenêtre et à 72 % de la hauteur, Échap en deux temps |
| les dix catégories | présentes, **en entier** |
| divergence | 2 h → **léger** ; 2 h justifiées pour cette classe seule → **dans les temps** |
| classe expérimentale | étiquetée, sa mention exacte, **aucun interrupteur** |
| absence | 29 élèves, deux clics → 2 absents au hub, un clic → 1. Réversible |
| périodes | livrées telles qu'écrites, renommées, ajoutées, chevauchement refusé, objet vidé → une seule période |
| A/B | table lue ligne à ligne ; 178 concordances, 0 discordance entre les marqueurs et les couleurs du calendrier |
| téléphone 390×844 | s'affiche, 20 cases, aucune erreur — il ne casse pas |
| matrice actions × état | voir ci-dessous |

**Matrice actions × état**, sur une ardoise propre :

| état de la case | ce que la modale propose |
|---|---|
| prévu | ✕ · ▶ Ouvrir le pilotage et lancer · déplacer · ne plus compter (+ enregistrer) |
| jouée | ✕ · les absents — **aucune décision** : l'heure a eu lieu |
| sans séance | ✕ · ↶ Annuler *(quand la décision existe au hub)* |
| classe non importée | ✕ |
| hors MJPC | ✕ |
| aucune séance prête | ✕ · Ouvrir Mes chapitres… · ▶ lancer |

*« Jouée » proposait « Annuler cette décision » : trouvé par cette matrice, corrigé.*

Captures : `2b-1` à `2b-5` · `3a-1` à `3a-4` · `3b-semaine-1366x768`, `3b-semaine-1920x1080` · `4-1` à `4-6` · `5-1` à `5-5` · `6-1` à `6-3`.

## ⑦ CE QUE LES DÉFAUTS ONT APPRIS

Six défauts trouvés par les bancs, tous corrigés dans le lot. Trois se ressemblent, et c'est la leçon à transmettre :

- **l'EDT lisait `classesData`**, vide au moment où il s'ouvre → il lit `/classes` lui-même ;
- **le menu des classes du déroulé sortait vide** → `edtLancer` charge classes et chapitres avant de monter le bandeau ;
- **le lancement attendait 700 ms** → il attend le bandeau *et* le moteur, par sonde bornée.

**L'EDT ne doit jamais supposer qu'un autre bout du site a déjà chargé ce dont il a besoin, ni qu'un délai suffit.** Un lot suivant qui l'oubliera retrouvera ces trois bugs.

Les trois autres : le réel dépendait du prévu (l'historique d'une classe aurait disparu au chapitre fini) · une insertion de CSS avait échoué **en silence**, l'écran mesurait 684 px quelle que soit la fenêtre — chaque insertion est désormais suivie d'un contrôle de présence · la divergence effaçait un retard avec des heures perdues par les deux classes.

## ⑧ CE QU'UN LOT SUIVANT DOIT SAVOIR DE CE CODE

L'état vit dans `EDT` (sept objets, `charge`, `pannes`) et `EDT_CHAP` (les chapitres, **avec leurs clés d'index** `__cle` et `__i` — la porte du pilotage les exige). Tout chemin passe par `edtChemin`. `edtAppliquerCreneaux` se rappelle après toute écriture des créneaux. `edtProjeter(date, nbJours)` rend les cellules et ne touche à rien. `edtCheminTrace` retrouve une trace d'heure et **son chemin** — c'est par là que le lot 7 rangera le récit. Les cartes de classe appellent `edtCarteClic`, qui attend le profil de classe. Le banc expose `creerHub` et l'interception `fetch` : à reprendre tel quel.

## ⑨ AUCUNE DETTE

Tout ce qui a été découvert pendant le lot a été résolu dans le lot. Ce qui reste dehors est ce que le mandat exclut explicitement (§⑦) : la relecture par heure et le profil de classe (lot 7) · le bloc bilan (lot 5) · la règle « classe conservée » dans la purge · la vue téléphone soignée (lot 2) · le cockpit lui-même — ses données sont prêtes, pas sa vue.

Une seule question a été posée sans être comblée, et Paul l'a tranchée : la réinjection d'une grille face à une période ajoutée à la main → annonce du différentiel avant le geste, pas de garde supplémentaire (« non pas une dette, ça ne sert à rien. on oublie »).

## ⑩ LIVRABLES AU SAS

`PONT/EDT/` : `index.html` (candidat 8.71.0) · `rapport-phase0.md` · `rapport-2b.md` · `rapport-3a.md` · `rapport-3b.md` · `rapport-4.md` · `rapport-5.md` · `rapport-final.md` · `SEQUENCE-TEST-PAUL.md` · `outils/verif_edt.py` · `prompts/calendrier.md`, `prompts/grille.md` · `json/calendrier-2026-2027.json`, `json/grille-2026-2027.json`, `json/creneaux-2026-2027.json` · `tests/` (banc, journal, relevé, instantané du hub, 22 captures).

**STOP. Je ne promeus pas.**
