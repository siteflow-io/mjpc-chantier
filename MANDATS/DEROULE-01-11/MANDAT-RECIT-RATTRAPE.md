# MANDAT — LE RÉCIT DIT CE QUI S'EST PASSÉ EN CLASSE (C16 512-515)
*Conscience n°16, 04/11/2026 (lancé à 07:40). L'ordre : Paul, 04/11 07:40 : « ok mais le mot diapos c'est un peu moche dans un récit. Pour le reste oui ok. » sur C16 511-518. Un seul exécutant, neuf, court. L'audit qui fonde ce mandat : C16 503-510 (transcript `TRANSCRIPTS/C16/TRANSCRIPT-C16.md`, 07:25) ; registre `docs/MJPC6-DETTES.md` (production), l'entrée « LE RÉCIT DE L'HEURE RATTRAPÉE DES 3 DYLAN ».*

## 0 · CE QUE PAUL A DIT (ses mots)
- **04/11 03:51** : « Le récit ne doit pas mentir. »
- **04/11 07:36** : « quelles modifications faire pour que le récit dise réellement ce qui se passe en classe ? »
- **04/11 07:40** : « le mot diapos c'est un peu moche dans un récit. Pour le reste oui ok. »
- **04/11 03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU FAIS (C16 512-515, acceptés ; rien d'autre)
1. **(512) Une heure rattrapée** : « au début / au milieu / à la fin de l'heure » ne se compte plus au rang des paragraphes, mais au **temps prévu dans le plan** (la durée de chaque diapo jouée) : chaque paragraphe se place selon le temps prévu de ce qui a été joué avant lui, rapporté au temps utile de l'heure (50 minutes). L'ordre des paragraphes reste celui de l'heure.
2. **(513) Dans toutes les heures**, la phrase de ce qui n'a pas été fait : plus « n activités n'ont pas été faites » ; **ni « activités » ni « diapos »** (Paul, 07:40). La conscience propose : « Ce qu'on n'a pas fait cette heure-ci : « … », qu'on fera à la prochaine séance ; … » (le reste de chaque élément, inchangé). Et **dans l'ordre du plan**.
3. **(514) Dans toutes les heures**, l'ouverture du bilan : « En fin d'heure, » retiré des formules ; restent « Au total, », « Pour résumer, », « En tout, ».
4. **(515) Une heure rattrapée** (et une heure reprise un autre jour) : l'horloge de sa case ne sert plus qu'aux alertes et au chrono ; tout ce qui s'affiche ou s'enregistre comme une heure (« Enregistré à », « close · … » dans l'entête, la Relecture, « Ce qui s'est passé ») reprend **l'heure réelle**. **Mesure d'abord** ce que montrent aujourd'hui la Relecture et « Ce qui s'est passé » pour une heure rattrapée. La classe d'essai (3E Charles de Gaulle, ses créneaux fictifs) : inchangée.
Ce que tu crois utile en plus : tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION DE LA CONSCIENCE (lue dans le code de la production 8.83.0 ; À VÉRIFIER avant de changer quoi que ce soit)
- 512 : `recitHtml0` (dr-recit.js) : `DR_RECIT_PARTS`, `rg = k => Math.round(k * 2 / (N - 1))`, `partDe` ; la durée prévue d'une diapo : le champ `dur` de chaque écran de la séance (vu au hub : `ecrans/9/dur` = 2) ; le temps utile : `tempsUtilePrevu` de l'heure (50).
- 513 : `recitHtml0` : `nonFaites = Object.keys(S.decisions)…`, la phrase `… activités n'ont pas été faites …`, `tourn` ; les décisions reviennent du hub triées par l'identifiant de la diapo (clé) : l'ordre du plan est le rang de la diapo dans `seance().ecrans`.
- 514 : les connecteurs `bilan: ["Au total, ","En fin d'heure, ","Pour résumer, ","En tout, "]` (deux listes, assemblé l. 22130 et 22141).
- 515 : `now()` = `Date.now()` + le décalage de `dr_horlogeCase` (dr-socle.js) ; le témoin `#dr-enr` écrit `new Date(now())` ; l'entête « close · » lit `dr_heureCase(S.finReel)` ; le journal `J` (les gestes) est daté par `now()` (à vérifier) ; `dr_ecouleS` (le chrono) et les alertes (T-5, dépassement) doivent garder l'horloge de la case.

## 3 · LA PREUVE (par le geste, au faux hub rangé comme le vrai ; courte ; comptée ; base `82255e7a2` → après)
1. Une heure rattrapée (comme celle des Dylan : l'ouverture, une activité longue, une mise en commun, des diapos reportées) : chaque paragraphe à sa part selon le plan (compté) ; « Ce qu'on n'a pas fait cette heure-ci : » dans l'ordre du plan ; pas « En fin d'heure » ; « Enregistré à », « close · », la Relecture, « Ce qui s'est passé » à l'heure réelle ; aucune alerte au lancement, le chrono comme avant.
2. Une heure ordinaire : seuls 513 et 514 changent (compté) ; ses heures inchangées.
3. La classe d'essai : inchangée (ses heures de case).
4. Le parcours P0-P12 (`AUDITS/INTEGRATION-DEROULE/parcours.mjs`) : vert.

## 4 · LES RÈGLES
- Ta base : `82255e7a2` (sas, branche `deroule/lot2-promo` ; la production 8.83.0-⑯ en est l'assemblé `857838e1` plus la ligne de version). Les sondes de `LIVRAISONS/DEROULE-01-11/LOT2A/`, `LOT2B/`, `LOT2C/` te servent de départ. Ton dossier : `git worktree add -b deroule/recit-rattrape <dossier> 82255e7a2` ; tu pousses sur `deroule/recit-rattrape` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est prouvé, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr_classe`. Aucun nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas prouvé n'entre pas dans le commit.
