# M14 — RAPPORT DE LIVRAISON · `applause_meter.html` « passe + code »

`[exécutant M14]` · 27/07/2026 · **PROVISOIRE (pt 21)** — rien n'est réputé fini tant que Paul ne l'a pas déclaré. **Je ne promeus jamais.** M14bis (dénonciation-arbitrage) est hors périmètre et n'a pas été touché : aucun bouton de dénonciation, aucune zone de pénalités.

---

## 0. DEUX CHOSES À LIRE AVANT LE RESTE

### 0.1 Le sas est inaccessible en écriture depuis le container — constat, pas excuse

```
git push --dry-run → remote: No anonymous write access.
                     fatal: Authentication failed for 'https://github.com/siteflow-io/mjpc-chantier.git/'
```

Aucun token, aucun `.git-credentials`, aucun `gh` dans l'environnement. La lecture publique fonctionne (les deux dépôts ont été clonés et lus), l'écriture non. **Les captures d'office ne peuvent donc pas être poussées au sas par l'exécutant** ; elles sont livrées en fichiers de sortie, à charge pour la conscience de les pousser. C'est très probablement la cause réelle du manquement reproché à LOT-COUTURES : non pas une négligence, mais une impossibilité. À trancher : fournir un token, ou acter que la livraison passe par les fichiers.

Chromium et Playwright, eux, fonctionnent : **22 captures produites**, aux deux tailles, écrans professeur compris, mode test légendé.

### 0.2 Travail trouvé dans le container et non produit par moi

En reprise de session, le fichier de travail portait **445 lignes et ~30 Ko** que je n'avais pas écrites : métas anti-cache, bloc CSS tactile, pastille `2.0.0`, shunt §8, portail à code, dictionnaire de textes, Q7, mouchard côté prof, « Mes lectures ». J'ai figé une copie de l'état trouvé avant d'y toucher, je l'ai **vérifié** au lieu de m'en attribuer le mérite, et je l'ai complété. Deux artefacts préexistants sont à écarter :

- `parcours.js` et ses 8 captures : **le rapport d'état les contredit**. `02-prof-mode-test-1440.png` est légendée « mode test » mais montre l'écran d'accueil, avec `ecritures: []` et `classeTest: null`. Illustration exacte de « une capture n'est pas une preuve ». Ces captures ne doivent pas être versées.
- Le fichier livré ici a été revérifié intégralement de mon côté (invariants, parseurs, socle bit à bit, parcours joués).

---

## 1. MESURES — AVANT / APRÈS

| | Base (production) | Livré |
|---|---|---|
| Taille | 565 216 o | **623 213 o** |
| Lignes | 3 944 | **4 836** |
| md5 | `11a8971573b6e27bdde8722fc726f5ec` | **`e58ce3ec8f2a7831103ef7a18453b3a2`** |
| Socle | MJPC-CORE **1.0.0** | MJPC-CORE **1.1.0**, embarqué verbatim |
| Version d'app | aucune | **`APP_VERSION = "2.0.0"`**, pastille affichée |
| Blocs `<script>` | 7 | 7 |
| Diff | — | **40 hunks, +972 / −105** (`M14-diff.patch`) |

**Correction à porter au cadrage** : le §1 annonçait « 6 blocs `<script>` » — le fichier en porte **7**. Et les tailles de fonctions du §7 étaient comptées en caractères, non en octets UTF-8 (d'où l'écart sur les fonctions accentuées) ; **les md5, eux, concordent tous exactement**.

---

## 2. LES HUIT ARBITRAGES, TENUS

| | Arbitrage | Ce qui est livré |
|---|---|---|
| **Q1** | Code élève exigé pour chaque occupant de zone | `FormConnexion` : NOM + Prénom + **code personnel**, vérifié contre `/codes/<clé>` par lecture **ciblée** (le nœud entier n'est jamais lu : l'accueil est public). Occupant enregistré avec `atteste:true`. Aucune liste de prénoms exposée, aucun code fabriqué par l'app. Chaque zone porte le **nom de son occupant** et sa couleur : l'élève voit qu'il tape dans son espace. |
| **Q2** | Mode test au patron du QCM, sans ses noms réels | 24 noms réels → **6 fictifs canoniques**. Garde `clesFictivesLibres()` **sur la clé**, refus motivé, rien d'écrit en cas de collision. Purge **exhaustive et vérifiée** (`Promise.allSettled`, refus collectés et affichés, « terminé » seulement si tout a réussi). Drapeau `test:true` sur séances, passages et remontée MJPC. Nettoyage **au montage** du panneau. Codes fictifs `1001→1006` fournis par la session : **aucun code réel n'entre dans le mode test**. |
| **Q3** | Mouchard côté professeur seulement (voie C) | Bandeau rouge plein écran et `ErrorBoundary` public **supprimés**. Journalisation conservée (mémoire + `applaudimetre/diagnostic`), alerte en **pastille discrète sur écran prof uniquement**. Mesuré : visible côté prof `true`, visible au tableau `false`. |
| **Q4** | Corbeille format A | Une entrée **par chemin** (1 séance + N passages), format canonique `{_meta:{chemin,app,motif,ts,annee}, data}` — champ `data`, jamais `contenu`. **Abandon complet si une seule archive échoue** ; retour chiffré au professeur. |
| **Q5** | Les deux textes cardinaux | Au dictionnaire, mot pour mot : `eleve_attente_classe` et `eleve_attente_demarrage`. Le professeur n'est plus l'acteur d'une attente. |
| **Q6** | — | (voir Q5, textes validés) |
| **Q7** | Critères affichés avant le passage | Fait, dans M14. |
| **Q8** | « Mes lectures » + remontée MJPC | Écran hors séance à portail de code (patron `dictee_universelle` M9), atteignable par bouton **et par URL** (`?mode=mesLectures`, pour l'ouverture depuis le site). Remontée `mjpcProfils/<classe>/<élève>/lectures/<passage>`, non bloquante. |

---

## 3. LE DANGER MESURÉ AU CADRAGE, ET CE QUE J'AI TROUVÉ EN CODANT

**Confirmé sur pièces (GET seuls)** : les noms retirés étaient des élèves **réels** — `audebert_elise`, `cesbron_lili`, `jamin_noe`, `rolland_gabriel`, `xavier_capucine` sont tous dans `/codes` **et** dans le roster de `3E Charles de Gaulle`. Chaque séance de test jouée jusqu'ici a bien incrémenté leur compteur d'équité.

**Les six clés fictives** sont absentes des 122 `/codes`. Deux d'entre elles — `bernard_emma`, `petit_thomas` — figurent dans le roster de `CLASSE TEST`, zombie hérité que `estClasseTest()` du socle reconnaît : la garde les écarte donc à bon droit.

**Danger découvert en codant, et corrigé** : « MARTIN Lucas », « PETIT Thomas » sont des noms parfaitement plausibles pour de vrais élèves. Une purge qui se fierait à la clé fictive seule détruirait le compteur d'équité, la file ou les passages d'un homonyme réel — exactement le sinistre à prévenir. La purge ne se fie désormais à une clé **que si la garde a prouvé qu'aucun élève réel ne la porte** ; sinon elle se limite aux données marquées et **le dit**.

**Deuxième trouvaille** : la remontée `mjpcProfils` semée en test échappait à la purge. Ajoutée : `mjpcProfils/<classe fictive>` est retirée à l'entrée comme à la sortie (mesuré).

---

## 4. PREUVES

### 4.1 Invariants et intégrité

- **Invariants du §7 : 17/17 intacts**, aucun n'a bougé d'un octet.
- **Constat notable** : les 9 fonctions du socle sont **identiques** entre 1.0.0 et 1.1.0 — l'apport de 1.1.0 est purement additif (§8). Le cadrage annonçait qu'elles « deviendraient » celles de 1.1.0 : elles l'étaient déjà.
- **Socle 1.1.0 bit à bit** : bloc extrait = 10 887 o, md5 `1b106b4082ee5b44154027c5a0a6552c` — **identique** à `mjpc-core.js`. Embarqué, jamais importé.
- **Double parseur** : 7/7 blocs valides (`node --check` **et** acorn ES2020).
- **Blocs vendorisés 1 à 5 : tous intacts** (React, React-DOM, Firebase compat, init).
- **Charte CSS propre : INTOUCHÉE**, md5 identiques. Le tactile vit dans un bloc **séparé et additif** `<style id="mjpc-tactile-480">`.

### 4.2 Le tactile, mesuré et non supposé

Le bloc avait d'abord été placé **avant** la charte : mesure faite, `min-height` passait mais `padding` et `font-size` étaient écrasés par la charte qui suivait. Bloc déplacé après la charte, dans le `<head>`. Attention pour la suite : le fichier contient d'autres `</style>` **à l'intérieur de chaînes JavaScript** (le récap imprimable) — une insertion naïve sur le dernier `</style>` casse le script.

| à 390 px | avec le bloc | sans le bloc |
|---|---|---|
| `.tab` | 42 px de haut, padding 9/6, 12,5 px | 38 px, padding 10/16, 14,7 px |
| `.card` | padding 12/11 | padding 18 |
| `.hdr` | padding 8/10 | padding 14/18 |
| débordement horizontal | **aucun** | aucun |

**À 1280 px : mesures identiques avec et sans le bloc.** Le rendu ordinateur est inchangé au-dessus du seuil.

### 4.3 Harnais en lecture seule stricte

Mini-Realtime-Database **en mémoire**, amorcée par des **fixtures GET réelles** du hub. Réseau coupé (`route().abort()` sur `http` et `https`), `sendBeacon` intercepté et journalisé, jamais émis. **Zéro écriture au hub** sur toute la campagne. Deux états initiaux : hub réel, et mode test déjà actif.

### 4.4 Parcours joués — état mesuré à chaque geste (`captures_m14/etat-mesure.json`)

| Parcours | État mesuré |
|---|---|
| Garde sur la clé (clés fictives présentes dans `/codes`) | refus motivé affiché, **0 écriture** |
| Semis du mode test | roster fictif exact · `session.modeTest:true` · `codesTest` 1001→1006 · `remove mjpcProfils/_test_applause_meter` |
| Sortie du mode test | `classes/_test_applause_meter` → `null` · séance de test → `null` · écritures listées une à une |
| Portail élève, code faux | refus, et `tablettes/t3` reste **`null`** : aucune entrée |
| Portail élève, code juste | `{nom:"MARTIN Lucas", slug:"martin_lucas", atteste:true}` |
| Présence élève | `{display, classe, niveau, is_prof:false, app, version, vue:"tablette", seance, table:"t3", cle, current_url, last_seen}` |
| Présence prof | même contrat, clé `prof`, `is_prof:true` |
| Erreur simulée, vue tableau | pastille d'incident **absente** (`false`) |
| Erreur simulée, écran prof | pastille **présente** (`true`), incident journalisé au nœud |
| « Mes lectures » | l'élève identifié par code retrouve son passage, sa séance et son statut |
| Erreurs JS | **aucune** sur l'ensemble des parcours |

Une erreur React réelle a été captée en cours de campagne (`ref.onDisconnect is not a function`) : c'était un **manque de mon harnais**, pas un défaut de l'app — et cela prouve au passage que la chaîne de journalisation fonctionne de bout en bout.

---

## 5. CE QUE JE VERSE, ET NE TRAITE PAS

- **M-SÉCU (6-10/08)** : `PROF_CODES` en clair (constaté à l'usage : `3141` ouvre le panneau) · aucune règle Firebase sur `/classes` ni `applaudimetre/*` · **le bouton « Mode test » est accessible sans code sur un écran public** — un élève peut donc semer une classe fictive.
- **Présence** : livrée dans un nœud propre `applaudimetre/presence/<clé>`, **pas** dans le `/presence` racine, qui est indexé par **UUID**. Y écrire une clé `sanMJPC` mêlerait deux conventions de clés dans un nœud partagé — le mélange même qui a détruit des codes réels ailleurs. **Branchement au nœud racine : à trancher, non tranché ici.**
- **CHANTIER L13 à corriger** : `applause_meter` y figure parmi les modes test « déjà conformes, à ne pas retoucher ». Les mesures le contredisent.
- **REGISTRE à rectifier** : ~3 474 lignes → **3 944** (base) · `critereIdx` ne se reproduit pas dans les données actuelles · 4 passages fantômes → **5**.
- **Cadrage à amender** : 7 blocs `<script>` ; tailles du §7 en caractères et non en octets.
- **Zombies du hub** : `CLASSE TEST` (4), `_TEST` (30), `_test_pilotage_debat_s3` (6), `applaudimetre/classes` (2 rosters), 5 `qrScans`.
- **Point 23b** (bilan HTML autonome de l'élève à serrure de code) : chantier à part entière, hors périmètre.
- **Points 4 et 13 de la grille** : navigation à deux niveaux, renommer/dupliquer une séance, concordance des notions — non faits, périmètre non confirmé.

---

## 6. ANNONCE ÉLÈVES — SOUMISE, NON DÉCIDÉE

> **L'applaudimètre demande maintenant ton code.**
> Quand tu t'installes à une tablette, tu tapes ton nom, ton prénom et ton code personnel — le même que pour les dictées. Ta zone porte alors ton nom : tu vois tout de suite que tu es au bon endroit.
> Avant chaque passage, tu vois aussi les critères sur lesquels tu vas voter. On écoute mieux quand on sait ce qu'on écoute.
> Et depuis l'écran d'accueil, « Mes lectures » te permet de retrouver tes passages précédents.

---

## 7. À FAIRE APRÈS CE RAPPORT

1. Déployer sur **GitHub Pages** (CORS bloque depuis `file://`).
2. Vérifier la pastille `v2.0.0` à l'écran ; si elle diffère, rouvrir avec `?v=N`.
3. Contrôler `applaudimetre/presence` et `applaudimetre/diagnostic` au hub après la première séance réelle.
4. Trancher : branchement de la présence au `/presence` racine ; token pour le sas ; périmètre des points 4 et 13.

**Mention PROVISOIRE (pt 21). Je ne promeus jamais.**
