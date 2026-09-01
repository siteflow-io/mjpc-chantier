# RAPPORT — LOT 2ter · livraison ⑤ (finale) · L'ALERTE MENSUELLE ET LA CINQUIÈME QUESTION
Version **8.73.0-⑤**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ⑤ | 1 711 939 | `8736d113d9f92827ba46d73b3fa4a6e1` | 8.73.0-④ |
| **Candidat ⑤** | **1 729 825** | **`b0be8f4d62dbb7b53d3f6f0579ec702c`** | **8.73.0-⑤** |

md5 **relu au sas après le push** : identique. Garde VERTE sur ses **cinq** questions.

## §⑤ — L'ALERTE MENSUELLE, AVEUGLE ET NON BLOQUANTE
Trois fonctions ajoutées, nommées — **`function edt*` 187 → 190** : `edtJoursDepuis(iso)`, `edtAlerteInjection()`, `edtRappelPlusTard()`. Plus une charge de mise à niveau, `dateInjection`, et une ligne dans `edtInjInjecter` qui pose `injecteLe` au moment du geste.

**⑧.9, mesuré** (`tests/banc-alerte-05.mjs`, panneau prof ouvert par clics) :
- **Calendrier sans date** — le cas d'aujourd'hui : la date du jour est posée au premier chargement (`injecteLe: 2026-09-01`) et **aucune alerte ne paraît** (« (aucune ligne) »). Paul n'est jamais accueilli par un reproche le jour où il ouvre le site.
- **La date est affichée pour chaque objet**, sur son bouton : « ⤓ Sortir le JSON — calendrier — injecté le mardi 1 septembre », idem grille et créneaux.
- **À J+31** : la ligne paraît — « Le calendrier de l'année a été injecté il y a un mois — pense à le réinjecter s'il a bougé. » avec **« Réinjecter maintenant… »** et **« Plus tard »**. Elle ne bloque rien : c'est un bloc du panneau, pas une modale.
- **« Plus tard », par clic réel** : `rappelCalendrierLe: 2026-10-01` (+30 jours), **1 écriture** (les réglages), la ligne disparaît, et `edtAlerteInjection()` rend `null`.
- **Aucune requête sortante** : le banc journalise tout ce que le site demande au réseau. Hors hub, **rien d'autre que les pages du site lui-même** (`GET correction_dictee.html`, `worktrack.html`, … — le catalogue des applications, sans rapport avec l'alerte). Le site compte les jours, il ne lit rien dehors.

## §⑥ — LA CINQUIÈME QUESTION DE LA GARDE
`outils/verif_edt.py` compare désormais **`EDT_PROMPTS` aux fichiers `prompts/*.md`**, en lisant le fichier tel que le navigateur lit la chaîne. Elle annonce cinq lignes :
> ① le bloc n'appelle que le contrat · ② rien hors du bloc n'appelle edt* sauf les portes · ③ tous ses nœuds sont sous /site/edt/ · ④ l'écriture centrale n'écrit que là où le site l'envoie · **⑤ les consignes du site et les fichiers prompts/ disent la même chose**

**⑧.10 — contrôle négatif, posé et retiré** : un seul caractère changé dans `prompts/calendrier.md` (« Reconduis » → « Reconduit ») →
> ROUGE — ⑤ la consigne « calendrier » diffère : prompts/calendrier.md fait 8273 caractères, EDT_PROMPTS en fait 8273 — premier écart au caractère 6523 : fichier « t l'`id` de tout c », site « s l'`id` de tout c »

Elle ne dit pas seulement « ça diffère » : elle dit **où** et **quoi**. Fichier remis, garde VERTE.

## LE BANC UNIQUE — 23 bancs, tous verts sur ce candidat
`node tests/banc-tout.mjs index.html` — le banc de l'alerte y a été ajouté (23e).

| | banc | durée | repères |
|---|---|---|---|
| ✔ | ①bis-a mise à niveau · ①bis-b périodes | 35 · 23 s | 3/3 · 3/3 |
| ✔ | ①ter grille datée · ②a la coche · ②b la migration | 7 · 9 · 46 s | 3/3 |
| ✔ | ② les coches qui bougent · ③a appariement · ③b différentiel | 47 · 44 · 46 s | 3/3 |
| ✔ | ③ archivage par clics · ③bis-a classe d'essai · ③bis-b identifiant | 32 · 12 · 30 s | 3/3 |
| ✔ | ④a un seul collage · ④ bout en bout | 37 · 106 s | 3/3 |
| ✔ | ⑤a écran · ⑤b motifs · ⑤c banaliser · ⑤c-bis · ⑤c-ter | 11 · 18 · 18 · 10 · 14 s | 3/3 (2/2 pour ⑤c-bis) |
| ✔ | audits adverses ② · ③ · ③bis | 36 · 52 · 31 s | 2/2 |
| ✔ | **⑤ l'alerte mensuelle** · les 122 identifiants | 30 · 3 s | 3/3 |

**23 bancs, 65 repères, aucun échec.**

## Non-régression — §⑦
`function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 1 appel** · **`edtMettreANiveau` 2 appels** · les **dix catégories** inchangées · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision** · la classe d'essai invisible hors mode test (7 classes sur 7 aux comptes identiques).
**Garde** : VERTE sur cinq questions ; **ROUGE sur quatre contrôles négatifs** — `mjpcSucces()` dans `edtAlerteInjection` → ① · `edtAlerteInjection()` hors du bloc → ② · l'écriture centrale vers `/site/ailleurs/` → ③ · un chemin écrit à la main → ④ — **plus le cinquième**, ci-dessus.

## Écarts signalés, jamais ajustés
1. **Les captures par clics de la livraison ⑤ ne sont pas faites**, et l'audit adverse du §⑧.14 non plus (un événement sans heure, un événement sur des vacances, deux événements sur la même heure, une catégorie inconnue, une heure déplacée puis banalisée, le calendrier réinjecté pendant qu'une fiche est ouverte). J'ai préféré livrer l'alerte et la garde **prouvées** plutôt que cinq choses à moitié : le contexte de travail de ce tour ne permettait pas les deux. **C'est une dette de cette livraison, je la déclare au lieu de la taire, et elle reste à faire.**
2. **L'objet injecté porte un champ de plus, `injecteLe`.** C'est ce que le §⑤ demande (« le nœud calendrier porte la date de sa dernière injection »), mais cela veut dire que le JSON copié par « Copier le prompt » le contient désormais : l'IA le verra. Les consignes lui interdisent d'inventer des champs, pas de recopier celui-là. À surveiller.
3. **La charge `dateInjection` pose la date sur TOUS les objets**, pas seulement le calendrier — c'est ce qui permet d'afficher « injecté le … » sur chaque bouton. Seul le calendrier déclenche l'alerte.
4. **Le mois est compté en jours**, pas en mois calendaires : 30 jours et plus. La ligne dit « il y a un mois » jusqu'à 59 jours, puis « il y a N mois ».
5. **`edtRappelPlusTard` écrit dans les réglages** : c'est une écriture au hub pour un geste d'affichage. C'est le seul moyen que le report survive à un rechargement — je le dis parce que c'est une écriture que Paul ne voit pas venir.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel de Paul** : tous les bancs tournent sur un faux hub ; le sas n'est pas publié en Pages.
- **Les 23 bancs d'affilée dans un seul processus** : mon environnement coupe toute commande au-delà d'environ 90 secondes. Joué en huit tranches, chacune par `banc-tout`, sur ce candidat. Chez Paul, une seule commande suffit.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-⑤**) · `outils/verif_edt.py` (cinquième question) · `tests/banc-alerte-05.mjs` · `tests/banc-tout.mjs` (23 bancs) · `rapport-2ter-05.md` (ce rapport).

## ARRÊT
L'alerte compte les jours sans rien lire dehors, ne crie jamais le premier jour, et se laisse repousser d'un clic ; la garde vérifie elle-même que les deux exemplaires des consignes disent la même chose. **Une dette déclarée : les captures et l'audit adverse du §⑧.14 restent à faire.** Paul relance par « continuer ».
