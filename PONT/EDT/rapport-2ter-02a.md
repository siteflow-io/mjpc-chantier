# RAPPORT — LOT 2ter · livraison ②a · LA COCHE SORT DE L'OBJET INJECTÉ
Version **8.73.0-②a**. Écrit pour une conscience qui n'a pas vu la conversation.

## Base et candidat — mesurés sur les fichiers réellement poussés
| | octets | md5 | version |
|---|---|---|---|
| Base du mandat ② | 1 662 507 | `cb20546e7abe9b4c32e322a5b03f7c60` | 8.73.0-①ter |
| **Candidat ②a** | **1 667 148** | **`64908545b78f0749f87c225d10e072be`** | **8.73.0-②a** |

md5 de la base vérifié avant d'écrire une ligne : conforme. md5 du candidat **relu au sas après le push** : identique, garde VERTE sur le fichier relu.

## LA PREUVE QUI COMPTE — le geste de Paul, mesuré côte à côte
Même banc, même clic réel sur la case « Séjour Verdun 3e » dans la vue *Calendrier de l'année*, même faux hub :

| | AVANT (8.73.0-①ter) | APRÈS (8.73.0-②a) |
|---|---|---|
| ce que le clic écrit | **`/site/edt/calendrier/2026-2027`** — la coche entre dans l'objet que Paul réinjecte | **`/site/edt/decisions/2026-2027`**, et **rien d'autre** : 0 écriture du calendrier |
| ce qui est écrit | `justifie:true` sur l'événement | 2 décisions d'heure : `2026-10-14_10h07-11h02_3E_Charles_de_Gaulle` et `2026-10-16_…`, valeur `{ecartJustifie:true, evenement:'evc:dqzc47', libelle:'Séjour Verdun 3e', pose:…}` |
| la case reste cochée à l'écran | oui (lue dans l'objet) | **oui** (lue dans le magasin) |
| heures justifiées de la classe | 0 → **2** | 0 → **2** — *même compte* |
| écart de progression | `{ecart:0, brut:0, justifieEcart:0}` | **identique** |

La coche ne vit plus dans le fichier qu'on remplace. Elle porte **les deux choses** que le mandat demande : la clé heure (date + créneau + classe) **et** l'`id` de l'événement qui l'a causée.

## Preuves — §⑥ du mandat
Banc : `tests/banc-coche-02a.mjs`, faux hub REST (`fetch` détourné, aucune requête ne sort), session prof par `admin-mode`, voile `fi-overlay` retiré, écran ouvert. Commande : `node tests/banc-coche-02a.mjs index.html`

**⑥.1 — `justifie` à zéro.** Le **champ** (`.justifie`, `justifie:`) : **7 → 0** dans `index.html`. Dans `json/calendrier-2026-2027.json` : **15 → 0**. Dans `prompts/calendrier.md` : les deux mentions retirées, remplacées par la consigne **« Ne produis JAMAIS de champ `justifie` »** (une occurrence subsiste, c'est l'interdit lui-même). Dans `prompts/grille.md` : 0 avant, 0 après.
Il reste **11 occurrences de la suite de lettres** dans `index.html`, aucune n'est le champ : quatre `justifieEcart` (une valeur **calculée** par `edtDivergence`, jamais stockée), deux commentaires français (« ce qui justifie un écart… »), une phrase du prompt de l'atelier sans rapport, et la consigne. **Détail signalé** : la propriété de résultat `justifie:` que `edtDivergence` rendait a été renommée `heuresJustifiees:` — elle n'était lue nulle part (mesuré : 0 lecture), et deux noms voisins pour deux choses différentes étaient exactement l'ambiguïté à supprimer.

**⑥.2 — la coche va dans le magasin** : voir le tableau ci-dessus. **1 écriture, 0 écriture du calendrier.** Une seule écriture même quand l'événement couvre plusieurs heures.

**⑥.6 — aucun compte ne change** : heures justifiées **2 = 2**, écart **{0,0,0} = {0,0,0}**, vue Année lue au magasin (`edtEvenementJustifie`), case à cocher idem. Sur le calendrier réel, avec la grille appariée du sas.

**⑥.7 — une heure, une clé, un seul motif** : cocher l'écart, puis marquer la même heure « ne plus compter cette séance ».
- **AVANT** : aucune modale (`modale: null`), écriture immédiate, et le total passe de **2 à 3** — la même heure comptée deux fois, une fois par l'événement, une fois par la décision.
- **APRÈS** : le site **dit avant** — « Cette heure est déjà marquée « écart justifié » — Séjour Verdun 3e. La sortir de la prévision remplace ce motif. L'heure ne sera comptée qu'une fois. » avec *Annuler* / *Remplacer le motif* — **aucune écriture avant la réponse**. Après « Remplacer » : la valeur devient `{sansSeance:true, …}`, le `journal[]` porte `avant:[ecartJustifie, evenement, libelle, pose]` et `apres:[sansSeance, categorie, precision, pose]`, et le total reste **2**. Jamais de refus, jamais en silence, jamais deux fois.

**⑥.9 — non-régression** : `function secu*` **29** · `published` **97** · `EDT_ANNEE` **12** · `AT_DR_B64` **309 812 caractères, md5 `2ba70f9ef8aacb6f81962ea4e1b62944`** · trois portes inchangées · correctif du mode test intact · **`edtApparier` 0 appel** · **`edtMettreANiveau` 1 appel** · **node --check** et **acorn ES2020** VERTS · calendrier réel **122 identifiants, 15 evc · 30 jal · 59 eta · 11 fer · 7 vac, 0 collision**.
**`function edt*` : 149 → 152.** Trois fonctions ajoutées, nommées comme le §⑤ l'exige, aucune disparue :
- `edtHeuresDeLEvenement(ev)` — les heures qu'un événement recouvre (une décision est une décision **d'heure**) ;
- `edtEvenementJustifie(ev)` — l'événement est-il marqué, **lu au magasin** (vue Année, case à cocher) ;
- `edtEcrireDecisionsGroupe(entrees, quoi, libelle)` — plusieurs heures, **une seule écriture**, une ligne de journal par heure.

**Les trois bancs de ① rejoués sur ce candidat** : `banc-mise-a-niveau-01bis-a.mjs` → hub vide **0** · hub complet **0** · hub sans `id` **1 archive puis 1 écriture** · archivage en échec **0** + message · abandon global **0** · concurrents **1**. `banc-periodes-01bis-b.mjs` → A **3/3** · B **3/3** · C **3/3** · D **3/3** · E **4/4** · F **5 distincts** · G **2 neufs**. `banc-grille-datee-01ter.mjs` → pose datée **6** · 30 distincts par version · doublon réparé · déplacé garde `crn:1a22nwk` · neuf reçoit `crn:ajmk4z`.

**⑥.10 — garde** : VERTE sur le candidat et sur le fichier relu ; **ROUGE sur trois contrôles négatifs** — `mjpcSucces()` dans `edtJustifier` → « ① le bloc EDT appelle hors contrat » · `edtEcrireDecisionsGroupe()` appelée hors du bloc → « ② appelé hors du bloc sans être une porte » · écriture des décisions vers `/site/ailleurs/` → « ③ écriture hub hors de /site/edt/ ».

## Un trou trouvé et fermé pendant le travail
**La garde a refusé une première version du candidat** : ma variable locale s'appelait `poser`, et `function poser(` existe déjà **hors du bloc** (L4022) — la garde ne peut pas distinguer les deux et compte l'appel comme hors contrat. Elle a eu raison de refuser : renommée `edtAppliquer`, garde verte. Déclaré parce que c'est un piège pour la suite : **un nom de variable locale du bloc ne doit pas coïncider avec une fonction du site**.

## Écarts signalés, jamais ajustés
1. **Les mesures du mandat sur `justifie` sont à corriger, comme il le demandait lui-même.** Le champ n'était pas lu à huit endroits mais à **quatre** : `edtHeuresJustifiees` (le compte), la vue Année (deux fois : la pastille et son infobulle), la case à cocher du calendrier. Les autres occurrences étaient `justifieEcart` et des commentaires. Les quatre lectures suivent bien le magasin.
2. **Le calendrier de référence ne portait aucun `justifie:true`.** Ses 15 occurrences valaient toutes **`false`**. Le §⑥.3 attend « un calendrier hérité portant les 15 `justifie:true` » : il faudra le **fabriquer** pour la preuve de migration. J'ai gardé l'original comme pièce de banc — `tests/calendrier-herite-justifie.json`, 15 événements portant le champ — et je poserai les `true` en ②b.
3. **La décision de décocher retire uniquement ce que cet événement avait posé** : une heure qui porte `sansSeance` (motif remplacé par un geste ultérieur) n'est pas effacée quand on décoche l'événement. C'est la conséquence directe de « une heure, une clé, un seul motif » — je le dis plutôt que de le taire.
4. **Rien de la migration n'est fait ici** : un calendrier hérité portant le champ garde ses coches dans l'objet, elles ne sont pas encore reprises. C'est la livraison ②b, et le mandat le découpe ainsi.

## Ce que je n'ai pas pu mesurer
- **Le geste sur le site réel** : tout tourne sur un faux hub, le sas n'est pas publié.
- Une preuve est **un appel de fonction et non un clic**, déclaré comme tel : `edtSansSeance(cle)` au §⑥.7 (le clic passe par la modale d'une case ; il sera fait aux captures de la livraison ②). Le reste — la coche, la lecture, l'affichage — passe par des clics réels.

## Livrables poussés au sas (`PONT/EDT/`)
`index.html` (**8.73.0-②a**) · `json/calendrier-2026-2027.json` (sans le champ) · `prompts/calendrier.md` (avec l'interdit) · `tests/banc-coche-02a.mjs` · `tests/calendrier-herite-justifie.json` · `rapport-2ter-02a.md` (ce rapport).

## ARRÊT
La coche est sortie de l'objet, le magasin porte clé heure et `id` d'événement, les quatre lectures suivent, le champ est à zéro partout. **Aucune dette ouverte dans le périmètre.** La suite est **②b** : la migration, son ordre (`decisions` d'abord, `calendrier` ensuite), son idempotence et sa reprise. Paul relance par « continuer ».
