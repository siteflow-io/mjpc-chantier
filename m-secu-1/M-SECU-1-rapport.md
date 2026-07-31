# M-SÉCU-1 — RAPPORT D'EXÉCUTION (31/07/2026)

## LIVRÉ
- `index.staging.html` — site v**8.8.0**, 522 914 o, md5 au sas. Base : production 8.7.1
  (508 257 o, `8122689e00c615728ab77a71b045d387`), re-téléchargée à l'instant de l'édition.
- `mjpc-core.js` — canon **1.3.0** (+§11 coffre : dérivation PBKDF2 310 000, AES-GCM,
  empreinte PBKDF2 100 000 à sel par entrée). **Verbatim canon/embarqué : 23/23 fonctions
  identiques à l'octet, constantes comprises** (l'écart de bloc §9→§11 est l'intercalation
  historique DIAGNOSTIC+pastille de l'embarqué, antérieure à ce morceau).
- Invariants : 491 fonctions communes, **7 modifiées** (`_putCode`, les 3 gestes de codes,
  `_printCodesClasse`, `_profSectionEleves`, `doLogin`) + boot, **32 ajoutées, 0 supprimée**.
  Diff : 13 hunks, 12−/371+ ; chaque ligne retirée est l'ancien corps d'une des 7.

## CE QUE FAIT LE MORCEAU
Clé saisie une fois par appareil (localStorage, jamais envoyée), validée par **canari**
AES-GCM en `/site/config/coffreCanari` (clé fausse rejetée avant tout affichage ; canari
absent → la clé saisie fait foi et le pose — Q2). **Migration** non destructive par PATCH
par élève (Q7) : `chiffre`+`sel`+`empreinte` ajoutés, clair conservé (les apps le lisent
jusqu'à M-SÉCU-3). Affichage **déchiffré prioritaire, repli clair** (Q4) ; sans clé :
✻✻✻✻ et gestes de génération/régénération/impression **bloqués avec explication** (Q5, Q6).
Fiches d'appareils avec l'avertissement « poste partagé » en clair (Q3). **Porte prof** :
`PROF_CODES` continue (jusqu'à M-SÉCU-3) **et la clé ouvre** (validée par canari EXISTANT
uniquement — la première pose ne se fait jamais au login). **Empreintes des codes prof
posées** en `/site/config/profEmpreintes` (sel+empreinte, recalcul vérifié concordant),
idempotent — prêtes pour M-SÉCU-2. Bloc DIAGNOSTIC enrichi (`MJPC_COFFRE_DIAG`).

## PREUVES — banc en mémoire (Node, WebCrypto natif) : **29/29 verts**
Fonctions **extraites du fichier livré**, fetch stubbé 3 issues + journal. Élèves fictifs :
dérivés des six canoniques suffixés T-nnn (collision jugée sur `sanMJPC` — aucune clé réelle).
Points saillants : première pose + revalidation · migration 118 codes (dénombrement avant,
verdicts TOUS collectés, compte rendu, vestiges ELIO-* intacts) · **idempotence prouvée par
seconde exécution (0 écriture)** · déchiffré==clair et empreinte recalculée concordante ·
**rechargement sans ressaisie joué** (nouveau contexte, même localStorage) · clé fausse
rejetée · oubli→masqué→retour · régénération APRÈS migration : cinq champs, `_allCodesTaken`
120 valeurs · garde sans clé : zéro écriture · refus et panne : bilans exacts + échecs
signalés nommés, reprise répare · **mode test : zéro requête réseau, magasin muté** ·
crypto absente déclarée (`raison:'crypto'` → message https) · **LA CLÉ NE SORT JAMAIS :
134 requêtes inspectées, secret absent en clair et en base64**.

## NAVIGATEUR (headless — il a tenu cette fois) : captures PRÉSENTES au sas
img-01 verrouillé (✻✻✻✻ + encart de saisie) · img-02 déverrouillé (bilan + codes) ·
img-03 mobile 390 (**mesures** : 3 cibles, zéro <44 px, zéro débordement) · img-04 après
reload (codes revenus sans ressaisie). Incident instruit, **prouvé artefact** : au reload
sous interception puppeteer la validation prend 13,2 s ; le même code, même page, hors
navigation : **1,9 s** ; banc mémoire : <0,6 s. C'est la latence d'interception en
navigation (parent de la « frame détachée » du 30/07), pas le code. Autre défaut trouvé
par le navigateur et **corrigé** : l'encart était inséré après le `return` « aucune classe
active » — il est désormais en tête, visible même sans classe (la clé se pose toujours).

## DÉCISIONS D'EXÉCUTION (contestables)
- **Hors https aujourd'hui** : coffre déclaré indisponible (message français, pas d'écran
  blanc), voie clé absente, mais `PROF_CODES` en dur **continue d'ouvrir** — le clair
  existe encore à ce morceau et le retirer localement mettrait Paul dehors. L'exigence ①
  (« pas de porte professeur hors https ») devient totale à M-SÉCU-3 avec le retrait du dur.
- **Longueur de clé ≥ 8** : discrimine la clé d'un code élève à la porte de login.

## CEINTURE LOCALE — ce que ma section exigera d'elle (instruit, non codé)
Le coffre n'entrave rien : clés `localStorage` propres (`mjpc_coffre_*`), aucun
`beforeunload`, aucune écoute réseau. Quand la ceinture viendra : ① ses dépôts JSON ne
doivent **jamais contenir ni la clé ni un code déchiffré** (déposer le chiffré tel quel) ;
② son déclencheur « absence de confirmation » lira les mêmes verdicts trois-issues que ma
migration collecte déjà — rien à adapter ; ③ la pastille `.info/connected` est indépendante
du coffre. **Vérifié et confirmé** : toutes les apps sont servies depuis
`siteflow-io.github.io` (même origine exacte) → la clé posée sur le site sera lisible par
les neuf apps sans ressaisie (M-SÉCU-2 y accédera par les mêmes clés localStorage).

## COUVERTURE — testé / non testé
**Testé** : tout le parcours de la clé (banc 29 points sur code livré) + rendu réel des
deux régimes, mobile mesuré, reload navigateur. **Non testé** : hub réel (aucune écriture
de production — mocks et magasin seulement) · clics humains réels (les gestes sont joués
par `evaluate`) · la couche bandeau/`mjpcSignalerIssue` stubbée en collecteurs (éprouvée à
M-ÉCHECS-1, non rejouée) · impression papier (garde vérifiée, rendu print non ouvert) ·
Chrome Windows réel (headless Linux seulement — recette de Paul souhaitable avant promotion).

## DETTES / RESTES
- M-SÉCU-2 (apps : empreintes + session) puis M-SÉCU-3 (retrait du clair — codes ET
  `PROF_CODES` des HUIT fichiers + surcharges Firebase de 3 apps).
- Doublon §8/§8 du canon : signalé, non renuméroté (consigne).
- Index inversé code→élève : instruit non codé (Q8 : décision prise — clé prof remplace).
- Vestiges `ELIO-1381`/`ELIO-8378` : intacts, purge à décider.
- Chantier ceinture locale : 4 apps `navigator.onLine`→`.info/connected` ; inventaire
  15 fichiers (5 hors chantier) à instruire.
- CHANTIER À REPRENDRE : refonte multi-classes `pilotage_debat_s3.html`.
