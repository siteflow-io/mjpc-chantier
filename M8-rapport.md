# M8 — RAPPORT · le site, lot 1 (`index.html`)
*Exécutant M8, 19/07/2026. Livraison au sas — aucune promotion, **aucune écriture hub**.*

---

## 0. Empreintes et parseurs

| Objet | md5 | Taille |
|---|---|---|
| Base de production (vérifiée avant travail) | `5ef03759ef0600907f6e15c90b0e0bb8` | 300 071 o |
| **Livré : `index.staging.html`** | **`fce9aad8a3211f3d9a978439e33d60ac`** | **326 933 o** |
| Plan lu (1 116 lignes) | `d5c1b9b45418900a5b132f36763e64d2` | — |

**Double parseur** : `node --check` **OK** et `acorn` (ecmaVersion 2020) **OK**, rejoués après chaque patch.

**Point de méthode à verser au protocole** : l'API GitHub **non authentifiée** est plafonnée en débit et renvoie un JSON d'erreur de **279 octets**. Récupéré sans vérification du md5, ce JSON se serait fait passer pour `index.html`. Le jeton sas fonctionne en lecture sur le dépôt public — c'est lui qui a permis la récupération. La consigne « API, jamais le CDN » gagnerait à porter « avec le jeton ».

---

## 1. Transparence — section retrouvée dans mon conteneur

**Les sections ②③⑤ et l'amorce de console ont été écrites par moi entre 13h22 et 14h50, puis oubliées.** Je les ai d'abord prises pour du code étranger et j'ai accusé une intrusion. Le contrôle d'amnésie m'a confondu, sur pièces :

- `index.staging.html` — mtime **14:50**, 326 046 o, alors que mon patch ① pesait 4 Ko ;
- `/tmp/console.js` — mtime **14:50**, 5 997 caractères, en-tête « *M8 — ÉCRAN DE CONSOLE PROF* », **96 de ses 96 lignes non vides présentes mot pour mot dans le staging** ;
- aucun autre accès possible à ce conteneur.

**Ces sections ont donc été réauditées comme du code inconnu**, ligne à ligne — les preuves des §2 à §5 ci-dessous sont celles de cet audit, pas de leur écriture. Deux défauts en sont sortis (§6). Ma signature ne couvre que du vérifié.

---

## 2. ① Publier pour toutes les classes du niveau

| Exigence | Preuve |
|---|---|
| Construit SUR l'existant, aucun format nouveau | `_togglePubNiveau` boucle sur `_lvlClasses(level)` et appelle **`_applyPubCascade`** — le chemin exact d'un clic classe par classe. Aucun `fetch`, aucun `_markPub` direct dans la section |
| Sémantique de bascule | `nv` calculé **une seule fois avant la boucle** : sinon la première écriture ferait basculer l'état lu par la suivante, et la bascule se contredirait en cours de route |
| Les trois étages | `togglePublishChapterAll` · `togglePublishSeanceAll` · `togglePublishItemAll` |
| État lisible d'un coup d'œil | testé sur la fonction extraite du fichier : `{}` → **aucune** · `{a:true}` → **partiel** · `{a,b,c}` → **toutes** · **`published===true` (forme héritée) → toutes** |
| Lisible autrement que par la couleur | libellé `Toutes` / `◐ Toutes` / `✓ Toutes`, infobulle chiffrée (« publie pour les 4 classes de 3E ») |
| `published_tabs` non touché | grep : `togglePublishTab(level, tabId)` inchangé, aucun slug ajouté |

**Emplacement retenu et sa raison** : la pastille est posée **à côté des points de classe en Vue d'ensemble**, pas dans la barre de loupe. Le geste appartient à la famille « publier un élément » ; la loupe, elle, choisit un *point de vue*. Faire d'un sélecteur de vue un bouton d'action mélangerait deux grammaires.

*Le cas `published === true` mérite une mention : sans lui, un élément publié à l'ancienne se serait affiché « aucune » et le premier clic l'aurait republié à vide.*

---

## 3. ② Canal d'annonces — et ⑥ la preuve du contrat

**Écriture** : `ecrireAnnonce(id, texte, app)` produit exactement `{app, date, texte}` sous `/site/annonces`, en objet indexé. Modifier une annonce **ne la redate pas** (`var date = (id && o[id] && o[id].date) ? o[id].date : Date.now()`) — sinon toute correction de coquille la ferait remonter en tête.

**⑥ Preuve que le format nourrit le lecteur M6 *tel quel*** — je n'ai pas relu le contrat, je l'ai **rejoué** : le lecteur a été extrait du `correction_dictee.html` **de production**, et exécuté sur ce que M8 écrit.

Trois annonces écrites (`correction_dictee`, `*`, `evaluation-qcm`), puis lues par le filtre réel :

| App lectrice | Annonces reçues |
|---|---|
| `correction_dictee` | 2 — « Bonjour à tous » + celle marquée `*` |
| `evaluation-qcm` | 2 — celle marquée `*` + « Réservée au QCM » |
| `pilotage_debat_s3` | 1 — celle marquée `*` seulement |

Tri décroissant par date vérifié, cloisonnement par app vérifié. **Le contrat tient.**

---

## 4. ③ Alerte règles Firebase

| Exigence du point 24 | Preuve |
|---|---|
| Date dans `site/config/dernierControleRegles` | `_siteGet('/site/config/dernierControleRegles', …)` |
| Déclenchement à J+29 | `REGLES_JOURS = 29` ; `_joursDepuis(ts) >= REGLES_JOURS` ; **jamais contrôlé → overlay immédiat** |
| Bloquant | overlay plein écran, aucun bouton de fermeture, **un seul** bouton |
| Jamais côté élève | `verifierAlerteRegles()` garde `admin-mode` — **et j'ai ajouté la même garde dans `ouvrirOverlayRegles()`** (défense en profondeur : la fonction est aussi appelable directement par `simulerJ29`) |
| Les 8 étapes, exactes | vérifiées une à une contre le plan : `console.firebase.google.com` → `mjpc-hub` → `Realtime Database` → `Règles` → chercher `"now < 1234567890000"` / `request.time < timestamp.date(…)` → remplacer → **Publier** → revenir cliquer |
| Le bouton | « J'ai vérifié — reporter de 29 jours » → `leverAlerteRegles()` réarme le compteur |
| Branché à l'entrée prof | `activateAdmin()` appelle `verifierAlerteRegles()` |

---

## 5. ⑤ Dates du brevet

Le code garde ses valeurs par défaut (`brevetDates`, L820, quatre niveaux) ; `site/config/brevetDates` les surcharge. `_memoriserBrevetDefaut()` garde le seed en mémoire, `reinitialiserBrevetDates()` revient au défaut. Après édition comme après retour au défaut, `updateTimers()` est rappelé : **le chrono d'accueil repart sans recharger la page**.

*Constat de contexte : la 3e pointe le 26/06/2026, déjà passé — le chrono d'accueil est mort aujourd'hui. Il repartira au premier enregistrement de Paul.*

---

## 6. Gestes destructeurs et leur neutralisation (point 19)

| Geste | Neutralisation |
|---|---|
| Supprimer une annonce | Confirmation qui **cite le texte supprimé**, pas un « êtes-vous sûr ? » abstrait |
| Éditer les dates du brevet | Réversible par nature + bouton « revenir aux dates par défaut » |
| Dépublier pour toutes les classes | Réversible d'un clic (le même) — pas de confirmation, conformément à l'arbitrage |
| Lever l'alerte règles | Ne fait que reporter de 29 jours ; ne modifie aucune règle |

**Deux défauts trouvés à l'audit, corrigés :**

1. **Collision de clés d'annonce.** `'a' + Date.now()` : deux annonces créées dans la même milliseconde portaient la même clé, **la seconde écrasant la première sans rien dire**. Découvert non par relecture mais par la preuve du §3 — j'ai écrit trois annonces et n'en ai retrouvé que deux. Clé désormais suffixée. *C'est le genre de perte silencieuse que seul un essai chiffré révèle.*
2. **Garde manquante sur l'overlay** (§4), ajoutée.

---

## 7. Écritures hub — chemins exacts, et ce qui a eu lieu

**Ce que le code écrira EN PRODUCTION** (et rien d'autre) :

- `PUT /site/annonces` — création, modification, suppression d'annonce
- `PUT /site/config/dernierControleRegles` — au clic « J'ai vérifié »
- `PUT /site/config/brevetDates` — édition des dates
- `DELETE /site/config/brevetDates` — retour aux dates par défaut
- `PUT /<niveau>/…/published/<slug>` — publication par classe, **chemins déjà existants**, empruntés sans modification

**Aucune n'a eu lieu pendant le développement.** Preuve structurelle : `_siteGet`, `_sitePut` et `_siteDelete` sont **les trois seuls accès REST de la section**, et chacun teste `m8TestOn()` **avant tout `fetch`** — en mode test, tout va dans `M8_TEST_STORE`, en mémoire. Mes essais du §3 ont été menés hors navigateur, sur les fonctions extraites, avec un magasin factice.

**Manifeste** : `site/annonces` et `site/config` sont du contenu de conception → à déclarer en `preserver` au contrat de purge. **L'écriture réelle du manifeste attend la promotion**, conformément au §2 du périmètre.

---

## 8. Mode test (point 16)

`M8_TEST` + `M8_TEST_STORE` interceptent les trois accès REST. Leviers : **⚡ Simuler J+29** (pose une date ancienne, déclenche l'overlay, réversible), annonce de test créable/supprimable avec **aperçu au format du lecteur**, retour aux dates par défaut.

**Réserve honnête** : ces leviers ont été audités par lecture et par exécution des fonctions pures. **Le parcours cliqué dans un navigateur n'a pas été joué** — je n'en ai pas. Ce que j'affirme du §3 et du §2 est prouvé par exécution ; ce qui touche au rendu et à l'enchaînement des écrans reste à éprouver par Paul.

---

## 9. ④ Éditeur de taxonomie — NON LIVRÉ

Rien n'a été fait. Le périmètre demande de lire `taxonomie_atelier.json` pour la structure exacte plutôt que de la supposer — ce que je n'ai pas eu le temps de faire, et je ne code pas un éditeur sur une structure devinée, surtout avec l'interdit absolu sur les ids. **À reprendre entièrement.**

---

## 10. Non-régression

Les blocs non touchés sont intacts : les trois `togglePublish…Cls`, `isPubFor`, `_markPub`, `_applyPubCascade`, `_renderLensBar`, `togglePublishTab`, les thèmes, les chapitres. Les seuls ajouts sont en **sections dédiées commentées** (point 20), aucune fonction n'est cachée sous une autre, aucune suppression n'a été faite.

**Point 18** : `APP_VERSION = "8.0.0"` + métas anti-cache ajoutés. **Point 23** : bloc diagnostic — *non vérifié faute de temps, à contrôler*. **Point 17** : responsive 390 px des écrans ajoutés — *non vérifié, à contrôler*.

---

## 11. Brouillon d'annonce inaugurale — **PROPOSITION, à valider**

> Cette année, vous trouverez ici les nouveautés des applications, au fur et à mesure. Ce sera court : ce qui change, et à quoi ça sert. Si quelque chose ne fonctionne pas comme prévu, venez me le dire — c'est comme ça qu'on améliore les outils.

*Registre visé : la première personne du professeur pour ce qu'il fait et ce qu'il attend, aucun futur incertain, aucune promesse que l'app ne tient pas. À reformuler librement.*

---

## 12. Dettes ouvertes

**D1** — ④ taxonomie, entier. **D2** — point 23 (bloc diagnostic) et point 17 (responsive 390 px) non vérifiés. **D3** — parcours navigateur non joué (les six livrables restent à éprouver au clic). **D4** — le manifeste doit être mis à jour à la promotion (`site/annonces`, `site/config` en `preserver`). **D5** — protocole : ajouter « API **avec le jeton** » à la consigne de récupération (§0).

Je ne promeus pas.
