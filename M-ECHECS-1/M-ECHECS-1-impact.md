# M-ÉCHECS-1 — RELEVÉ D'IMPACT
*Écritures sans silence — site MJPC (index.html), base 8.6.1 → 8.7.0 · 30/07/2026*

**La règle installée (socle MJPC-CORE 1.2.0, §9).** Une écriture n'a jamais deux
issues (« fait » / « erreur ») mais trois : **acceptée** · **refusée** (la base a
répondu non — définitif, réessayer ne changera rien) · **panne** (aucune réponse —
temporaire, la même écriture peut aboutir plus tard). L'écran ne dit jamais
« enregistré » avant le verdict ; un échec est un choix offert ou un signal nommé,
jamais un silence ; les échecs en rafale se regroupent en un seul bandeau daté.

---

## Volet ① — Ce qui échouait en silence, et ce que tu verras désormais

*58 écritures inventoriées ; 52 traitées, 6 laissées avec justification (volet ①-bis).
Datation par les versions embarquées et le journal MJPC 6 (méthode déclarée) ;
audit du hub réel en lecture le 30/07 : les traces constatées sont citées.*

**Éditeur d'arborescence — créer/renommer/supprimer/déplacer chapitres, séances,
items (12 écritures · depuis M8, v8.0.0, mi-juillet).**
AVANT : le geste s'affichait comme fait quel que soit le verdict ; un refus (le cas
bb4e : règles refermées → 401) laissait l'écran à jour et la base intacte, divergence
invisible jusqu'au prochain rechargement.
APRÈS : l'écran ne bouge que sur verdict accepté. Refus → bandeau « écriture refusée
par la base (HTTP n) — rien n'est enregistré… réessayer ne changera rien ». Panne →
« pas de liaison — rien n'est parti », bouton **Réessayer** (ré-émission ponctuelle,
valeur courante). Plusieurs échecs → un seul bandeau « N enregistrements n'ont pas
abouti depuis HH h MM », **Détail** (chaque geste daté et causé), **Tout réessayer**.

**Cascade de publication (`_applyPubCascade` — publier/dépublier par classe · M8).**
AVANT (défaut double) : chaque écriture de la cascade avalait son échec **et**
l'affichage se rafraîchissait sans attendre aucune réponse — tu publiais, l'écran
disait publié, les élèves ne voyaient rien.
APRÈS : l'affichage attend le verdict de **toutes** les écritures de la cascade ;
chaque échec est **nommé chemin par chemin** (« Publication — /site/3e/…/published/…
refusée ») avec ré-émission par élément. Preuve mesurée au banc : rendu 4 ms *après*
le dernier verdict, jamais avant.

**Bouton LIER (`applyLinkChanges`, 2-3 écritures liées · M8).**
AVANT : aucun `.catch` ; la modale se fermait et l'écran entérinait un lien que la
base avait pu refuser en tout ou partie (item mi-changé possible).
APRÈS : lot à verdicts — la modale ne se ferme et l'état ne suit que si **tout** est
accepté ; sinon échecs nommés (source / référence / type), état intact.

**Galerie d'images et items créés par upload (7 écritures Firebase · M8).**
AVANT : la panne était dite (toast) mais un **refus** passait pour un succès —
« ✅ Image ajoutée » sur un 401.
APRÈS : le refus rejette comme la panne, le toast dit la vraie cause en clair ;
renommer/retirer une image (avant : rien du tout) passent au bandeau commun.

**Écran Classes — créer, renommer, archiver, désarchiver, supprimer, publier
onglets/rubriques (8 écritures · M8/M12).**
AVANT : silences (rename/archive/delete/publish) ou alert technique isolée (création :
« Erreur : Firebase 401 »).
APRÈS : tout au bandeau commun, libellés en français nommant le geste (« Archivage de
la classe « 3e Franklin Aretha » … »). L'écran ne retire/renomme qu'après verdict.

**Écran Élèves — codes personnels, imports, retraits (4 écritures · M8).**
AVANT : catch vides. **Trace réelle constatée au hub le 30/07 :** 4 élèves de
CLASSE TEST (fictifs canoniques) sans code personnel — la démonstration vivante de
`_putCode` échouant sans un mot.
APRÈS : au bandeau commun. Le retrait d'un élève (2 écritures liées : liste + code)
passe en lot — l'écran ne le retire que sur verdicts.

**Corbeille cloud (`_fbPutPath`/`_corbeillePuis` · M12, 26/07).**
AVANT : un seul message pour deux réalités opposées.
APRÈS : refus → « la corbeille a été REFUSÉE par la base (HTTP n) — réessayer ne
changera rien. Continuer SANS archive ? » · panne → « la corbeille n'a pas répondu —
rien n'est parti. Continuer sans archive ? ». Dans les deux cas, annuler = rien n'est
détruit (inchangé).

**Portail élève (`ensureEleveUuid` · M8bis).**
AVANT, deux défauts silencieux : ① une panne de **lecture** de l'index valait « cet
élève n'existe pas » → création d'un **second** uuid au même élève ; ② un échec des
écritures de création laissait entrer l'élève avec un uuid jamais enregistré — toutes
ses données d'apps se rattachaient ensuite à une identité inconnue du hub.
APRÈS : dans les deux cas l'élève ne franchit pas le portail avec une identité
douteuse ; il lit, au flux impersonnel : « La connexion n'a pas abouti. Réessaie dans
un instant. » Le même geste, retenté, aboutit (joué au banc). *(Hub réel du 30/07 :
aucun doublon d'identité constaté — le défaut n'avait pas encore frappé.)*

**Atelier (`atSitePut`/`atSiteDelete`).** Le durcissement local de SITE-COURS-1 est
absorbé : délégation pure au socle réparé, l'indicateur d'atelier reçoit désormais
l'issue (refus/panne distingués).

**Uploads Drive via Apps Script (4 gestes).**
AVANT : contrairement à l'inventaire initial, ces gestes n'étaient **pas** muets
(réponse métier `error` affichée, panne alertée) — mais un refus HTTP franc tombait
dans `r.json()` et s'affichait « Erreur réseau », cause fausse.
APRÈS : le refus HTTP est testé et dit (« envoi refusé (HTTP n) — réessayer ne
changera rien ») ; « Erreur réseau » disparaît au profit de la vraie cause.

**Manifeste (`publierManifesteREST`).** Verdict silencieux à l'écran (Q3), compté et
consultable : `MJPC_ECRITURES_DIAG` en console (dernier verdict du manifeste, totaux
refus/pannes de la session). Le bloc DIAGNOSTIC commenté est intact.

## Volet ①-bis — Laissé inchangé, et pourquoi

- **Battement de présence** (15 s, vérifié) et **notifications ntfy/télémétrie** :
  best-effort assumé ; un raté est rattrapé au battement suivant ou sans conséquence
  pour toi. Un bandeau ici serait du bruit.
- **`loadDocsList_`** : une lecture (par POST) — une lecture en panne se répare par un
  état d'écran, pas par un classeur d'issues (constat au rapport, hors morceau).
- **Anti-doublon de session M12** : émission volontairement sans suite, documentée.

## Volet ② — Le jour où la base refuse tout : ce que tu verras, ce que tu peux faire

*Salve jouée au banc, tout le réseau en 401 (`impact-refusTout.json`).*

Aucune perte d'écran, aucun mensonge, aucun blocage : chaque geste répond. Renommer →
« refusée par la base (HTTP 401) — rien n'est enregistré… réessayer ne changera
rien ». Publier (cascade) → un bandeau groupé, chaque chemin nommé. Archiver une
classe → cause dite, écran intact. Annonce → « Annonce aux élèves : écriture
refusée… ». Conduite : un **refus généralisé** signifie règles de sécurité (le
scénario M-SÉCU : c'est le comportement attendu du site *après* la pose des règles,
tant que l'authentification prof n'est pas branchée) ; une **panne généralisée**
signifie liaison ou service — tout est ré-émettable d'un bouton quand elle cesse.
Côté élève : messages impersonnels, jamais de jargon, le travail affiché reste à
l'écran.

## Volet ③ — Ce que les élèves verront

En classe, sur un raté : rien d'anxiogène, pas de vocabulaire technique, jamais le
professeur impliqué. Connexion en échec : « La connexion n'a pas abouti. Réessaie
dans un instant. » — et le même geste, retenté, suffit. Les bandeaux de verdicts
sont un outil du panneau prof ; l'élève n'en voit aucun.

---

## LES TROIS FAMILLES D'ACTIONS (à lire avant de fermer)

**Ce que cette livraison répare** — tout le volet ① ci-dessus : 52 écritures sous
verdict, l'écran qui ne ment plus, les échecs nommés, regroupés, ré-émettables.

**Ce qui restera cassé, et attend quel morceau** — ① rien ne **persiste** : un échec
non ré-émis avant fermeture de l'onglet est perdu (la file d'attente durable est un
morceau futur, hors M-ÉCHECS-1 par décision de cadrage) ; ② les règles Firebase sont
toujours ouvertes — ce morceau rend l'échec **visible**, M-SÉCU le rendra **rare et
légitime** ; ③ la banque d'exercices et les autres apps gardent leurs écritures
d'avant-doctrine jusqu'à M-ÉCHECS-2 (diffusion du socle 1.2.0).

**Ce qui exige un geste de toi, qu'aucun code ne fera à ta place** — ① après toute
séance de publication ancienne dont tu doutes : ouvre l'écran Architecture et
vérifie l'état publié réel (le site montre désormais la vérité du hub ; une
publication partie dans le vide avant ce jour doit être **recliquée une fois**) ;
② les 4 codes manquants de CLASSE TEST : régénère-les depuis l'écran Élèves si tu
te sers encore de cette classe, sinon rien ; ③ au premier refus généralisé après la
pose de M-SÉCU : c'est la sécurité qui travaille, pas une panne — le bandeau te le
dira dans ces termes.
