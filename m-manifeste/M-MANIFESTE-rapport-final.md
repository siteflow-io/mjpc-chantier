# M-MANIFESTE — RAPPORT FINAL : l'écran d'écart, et la correction de mon §8.3
**02/08 · complète `M-MANIFESTE-rapport.md` et `M-MANIFESTE-rapport-adresses.md`**

## 1. ⚠ MON §8.3 ÉTAIT FAUX — corrigé, avec la mesure des octets
J'avais écrit que le gabarit `var APP_VERSION = "…"` **écrase** la pastille de `reecriture` et `reecriture_bb4e`. **C'est faux, et ma propre mesure le confirme** :
| fichier | gabarit `"…"` | vraie pastille | qui l'emporte |
|---|---|---|---|
| `reecriture` | octet **13 819** | octet **265 585** = `2.2.0` | **la VRAIE** — rien n'est écrasé |
| `reecriture_bb4e` | octet **12 393** | octet **135 948** = `2.2.0` | **la VRAIE** — rien n'est écrasé |
| `evaluation-qcm` (avant M-DOC-1) | après la vraie | — | le gabarit écrasait — **corrigé** |
**En JavaScript la dernière déclaration exécutée l'emporte : l'ordre décide, pas la présence.** J'ai reconnu un motif au lieu de mesurer un ordre. **Le gabarit reste une question d'HYGIÈNE — il prête à confusion et a déjà induit trois erreurs — pas un bug.** Versé à M16-0, non retiré.
**Et une seconde fois dans la même mesure** : ma regex a d'abord signalé un `"…"` résiduel dans `evaluation-qcm` — **c'était dans le texte de mon propre commentaire de correction M-DOC-1**. Le piège de l'exemple commenté, dans mon propre commentaire. `evaluation-qcm` est sain.

## 2. L'ÉCRAN D'ÉCART — livré
`index.html` **8.16.0 → 8.17.0** · **686 469 o · `9bece4613e318590b51705a3a50f9260`** · parse **VERT**.
Section nommée **`§ MANIFESTES : L'ÉCART`**, ancrée **par contexte** (le marqueur de fin existe en double), **le socle n'est pas touché**. Accès par un bouton « 📡 Fiches des applications… » dans la zone prompt.
**Ce qu'il montre**, pour les neuf apps : le **nom déclaré**, **la date de publication en clair et en jours** (« 17/07/2026 — il y a 16 jours »), le **socle déclaré**, et **l'état** : à jour · à jour mais sans description d'usage · en retard · jamais publiée.
**Il dit combien et quoi faire** : « **3 applications ont une fiche en retard.** Pour chacune : **ouvre-la une fois**, elle republiera toute seule. Tu n'as rien d'autre à faire. »
**Et il parle aussi quand tout va bien** : « **Tout est à jour.** Les neuf applications ont publié leur fiche avec la version du socle en cours. » — un écran qui ne parle qu'en cas de problème laisse croire qu'il n'a pas regardé.
**IL LIT, IL N'ÉCRIT RIEN** : prouvé au journal réseau (delta du geste `ecartOuvrir()` = **0 écriture**).

## 3. Le banc navigateur — 6/8, et les deux échecs sont instruits
**VERTS** : les 5 fonctions **sur `window`** · les **9 lignes rendues avec les dates réelles** · le compte des retards et la conduite à tenir · une app jamais publiée nommée comme telle · **l'écran n'écrit rien** · **NON-PUBLICATION prouvée en `once` Firebase v8 réel : hub à jour → aucune écriture**.
**ÉCHEC 1 — la publication réelle d'une app périmée n'est pas prouvée** : `correction_dictee` s'arrête sur `React is not defined`. **C'est mon banc**, pas le code : je n'ai servi React qu'après coup et le rechargement suivant a trouvé le hub déjà à jour. **Non prouvé au navigateur ; prouvé au banc mémoire (verdict ①).**
**ÉCHEC 2 — le 390 px de l'écran d'écart n'est pas mesuré** : mon banc appelle `ecartOuvrir()` dans la même passe que l'ouverture de la zone, avant que `#at-zone` existe ; le tableau n'était pas rendu. **Le CSS porte ses règles** (`@media (max-width:480px)` : tableau en paires libellé/valeur, `data-ent` sur chaque cellule, ⓘ à 44 px) — **mais rien n'est mesuré à l'écran.**
**Aucun de ces deux échecs n'est écarté : ils sont déclarés non prouvés.**

## 4. DÉCLARATION DE RELECTURE — les textes de l'écran d'écart
**Relus mot à mot** : le titre, l'intro, les deux bilans (à jour / en retard), les quatre états, les en-têtes du tableau, et le texte de l'infobulle ⓘ (4 paragraphes).
**Corrections faites pendant la rédaction** : « il a une fiche en retard » / « ont une fiche en retard » — **accord au singulier et au pluriel géré** (`enRetard.length>1?'s ont':' a'`), sans quoi l'écran aurait écrit « 1 applications ont ».
**Relu, aucune autre correction.** L'infobulle explique **pourquoi** une fiche périmée est un problème (« l'IA travaille alors avec une information périmée sans que rien ne le montre ») et dit explicitement que **l'écran ne modifie rien**.

## 5. DÉCLARATION DE COUVERTURE
**Testé** : §2 et §3 (verts), plus le banc mémoire 7/7 du rapport principal.
**NON TESTÉ, ET JE LE DIS SANS L'ATTÉNUER** : **la publication réelle d'une app périmée dans un navigateur** (échec 1) · **le 390 px de l'écran d'écart** (échec 2) · le hub réel (aucune écriture faite) · Chrome Windows · la lecture de Paul.
**Ce que cela veut dire pour la promotion** : la partie « publication conditionnelle » est prouvée en mémoire et **sa non-écriture est prouvée en navigateur réel** ; l'écran est prouvé **sauf sur mobile**. **Deux mesures manquent, elles sont nommées.**

## 6. Reste à faire
1. Banc navigateur : la publication d'une app périmée (servir React dès la première passe) · **le 390 px de l'écran** (ouvrir la zone, attendre, puis appeler).
2. La décision de Paul sur le domaine (14 occurrences localisées, dont `MJPC_BASE_URL`).
3. Le gabarit `"…"` : hygiène, versé à M16-0.
