# RAPPORT D'AUDIT INDÉPENDANT — candidat v8.59.3
Auditeur : exécutant-auditeur PONT · 23/08/2026. Je n'ai rien modifié, rien poussé en production.

## ⓪ MATIÈRE VÉRIFIÉE
- Production : md5 mesuré `7058c286bcd7e4a4e195dbd59c058201` = attendu (v8.59.2, 1 378 414 o).
- Candidat `PONT/index-8593-candidat.html` : md5 mesuré `9ce948ca247b996fc3a6893a1acb8ecc` = attendu (1 391 496 o, +13 082).
- Gouvernance relue (DISPOSITIF + DOCTRINE re-téléchargés : md5 identiques à ma lecture intégrale de prise de fonction).

## ① LE DIFF RÉEL = LE PÉRIMÈTRE ANNONCÉ — CONFORME, et plus propre que l'annonce
Extraction des fonctions par ACCOLADES APPARIÉES (chaînes et commentaires sautés — pas de regex naïve) sur les deux fichiers : 958 fonctions en prod, 959 au candidat.
- **Modifiées : 3** — `atIACopier` (797→1 204 o), `atBlocEdition` (796→1 278 o), `atImprimerSelection` (1 308→812 o). **La « 4e à élucider » de l'annonce n'existe pas : c'était un artefact de borne** de l'outillage de l'auteur ; mon extracteur n'en voit que trois.
- **Neuve : 1** — `atImprimerSelection2` (1 859 o). **Supprimée : 0.**
- **29 fonctions `secu*` : md5 identiques à l'octet.**
- **`published`** : 25 motifs en prod, 25 au candidat ; aucune des 8 zones du diff ligne à ligne ne touche ce mot — **aucune écriture nouvelle**.
- **`APP_VERSION` = "8.59.3"** ✓.
- Diff ligne à ligne complet : **8 zones** — version (L2741) · SEED (prod L7148-7237 → cand L7148, une ligne JSON) · atIACopier ×2 (L7267-7274) · atBlocEdition ×1 (L7730) · atImprimerSelection/2 ×3 (L9625-9656). **Rien hors périmètre.**

## ② PARSEURS — VERTS
`node --check` + acorn ES2020 sur les 2 blocs `<script>` extraits : aucun rouge.

## ③ BANCS (miens, navigateur headless, LECTURE SEULE STRICTE)
Compteur de requêtes non-GET vers le hub : **0 sur tous les scénarios** (`nonGET:0` partout). `pageerrors:[]` partout. Bancs livrés : `PONT/tests/banc_audit2.js` (un scénario par lancement).

**a. Vue intacte, hub disponible** (prompt v3 servi par fixture) : champ présent ; **copié === champ à l'octet** (`copieIdentiqueAuChamp:true`) ; **préambule « TON TRAVAIL ATTERRIT » : 1 occurrence** ; texte du hub bien affiché ; flash « Prompt copié. » ✓

**b. Champ modifié** (ligne ajoutée) : copié === champ modifié tel quel (finit par « LIGNE AJOUTEE PAR PAUL ») ; **toujours 1 seul préambule** ✓

**c. Hub muet** — mesure honnête des deux sens :
- Requête qui PEND : **aucun écran ne se rend** (tous les chemins — `atIAOuvrir`, `atNouvelleFeuilleIA`, `chOuvrir`, `edIA…` — attendent `atIAChargerPrompt` avant de rendre) ; la branche « chargement » d'`atBlocEdition` est donc un FILET : appelée directement pendant l'attente, elle dit bien « Le prompt se charge depuis le hub… » et **ne contient aucun vieux texte** (`blocSansVieuxTexte:true`) ✓
- Panne franche (échec immédiat) : `_siteGet` → `cb(null,true)` → `AT_IA.charge=true` → l'écran se rend sur le **SEED v3** (repli voulu), 1 préambule ✓
- Verdict B : conforme — le danger d'origine (un texte affiché qui ne partira pas) n'existe plus dans AUCUN flux : soit on attend, soit on affiche le seed v3 qui EST ce qui partira.

**d. Liasse contre mémoire périmée** (hub simulé M8 : `f1` version fraîche, `f2` supprimée ; mémoire d'onglet : `f1` ancienne + `f2` fantôme ; tout coché) : la liasse contient **LA VERSION HUB**, **ni l'ancienne ni la fantôme** (`ancienneVersion:false, fantome:false`) ✓ — et comme une seule fiche survit, le titre bascule correctement en titre de fiche unique.

**e. Hub injoignable à l'impression** : **aucune liasse ne part** (`e_liassePartie:false`), message visible « Impossible de vérifier les feuilles au hub — impression annulée (jamais de liasse périmée). » ✓

**f. Non-régression impression unique** : titre du PDF = « Fiche VERSION HUB » ; `document.title` = ce titre PENDANT l'impression ; **restauré après** (`f_restaure:true` — un premier `false` de mon banc était un artefact de mesure à +1 600 ms, la restauration tombe à ~1 700 ms ; re-mesuré à +2 100 ms : vert). ✓

## ④ CHASSE AUX EFFETS DE BORD — appelants et signatures
- `atIACopier` : 1 seul appelant — le bouton d'`atBlocEdition` (onclick, L7742). Signature inchangée (0 arg). `atPromptComplet`/`atPromptTexte`/`atPromptDirectives` : présentes en prod ET candidat (rien d'inventé) ; **`atPromptComplet()` ≡ `atPromptTexte()`** (avec repli) — la vue affiche donc EXACTEMENT ce que « Copier » donne sur vue intacte : la promesse « une seule vérité » est structurelle.
- `atBlocEdition` : 2 appelants (`atIARendre` L7216, `chRendre` L8051), tous deux APRÈS `atIAChargerPrompt`. Signature inchangée.
- `atImprimerSelection` : 1 appelant — le bouton de la barre (onclick, L9715). Devenue asynchrone : sans effet, rien n'attendait son retour. `atImprimerSelection2` : appelée uniquement par elle (L9638).
- **`atSiteGetDocs(cb)` — signature réelle vérifiée** : mode test → `cb(docs)` depuis `M8_TEST_STORE` ; sinon `_siteGet(AT_NOEUD, cb)` dont le contrat est `cb(v, err)` — **panne → `cb(null, true)` ; nœud VIDE → `cb(null)` sans err**. `atImprimerSelection` ne lit que le 1er argument : un hub joignable mais SANS AUCUNE feuille est traité comme une panne (message « Impossible de vérifier… »). Refus SÛR, message inexact ; cas quasi théorique (il faut des cartes affichées d'une liste périmée ET un nœud totalement vidé entre-temps). **Observation mineure, non bloquante** — le 2e argument `err` permettrait de distinguer.

## ⑤ ANOMALIE TROUVÉE — C2 : `#at-imp-note` n'existe nulle part dans le DOM
Les deux messages de C ciblent `document.getElementById('at-imp-note')` — **la barre d'impression rendue (L9713-9716) ne contient AUCUN élément de cet id**, et il n'existe nulle part ailleurs (2 seules occurrences du fichier : les deux lectures, L9632 et L9644). Conséquences réelles :
- Cas « hub injoignable » : `_n` absent → **repli `alert()`** — le refus EST déclaré (banc e : passé via ma note injectée ; en usage réel ce sera l'alert). Fonctionnel, hors charte maison (`atInfo` existe).
- Cas « les feuilles cochées n'existent plus au hub » (L9644) : `if(_n)` échoue → **AUCUN message** ; seul `atRendreListe()` rafraîchit l'écran. C'est une ignorance silencieuse partielle (doctrine : « refus déclarés plutôt qu'ignorances silencieuses ») — atténuée : aucune liasse fausse ne part et l'écran montre l'état vrai.
**Gravité : mineure.** La SÉCURITÉ annoncée (jamais de liasse périmée, refus effectif) est intégralement tenue ; c'est la DÉCLARATION qui est amputée dans un cas rare. Correctif d'une ligne : rendre `<div id="at-imp-note" class="at-imp-note" aria-live="polite"></div>` dans la barre (ou remplacer les deux replis par `atInfo`).

## ⑥ VERDICT PAR OBJET
| Objet | Verdict |
|---|---|
| **A · atIACopier** | **CONFORME** — plus de doublon (1 occurrence du préambule, bancs a/b) ; champ modifié copié tel quel. |
| **B · atBlocEdition** | **CONFORME** — message de chargement en filet ; aucun flux n'affiche plus un texte qui ne partirait pas ; vue ≡ copie par construction. |
| **C · atImprimerSelection(2)** | **CONFORME sur le fond** (re-lecture hub prouvée, refus effectif, encart d'échec de rendu présent dans le code L9650-9656) — **1 anomalie mineure** : `#at-imp-note` jamais rendue → un message sur deux passe par `alert`, l'autre est muet (⑤). |
| **D · ATELIER_PROMPT_SEED** | **CONFORME** — JSON pur sur une ligne, zéro code, zéro balise ; **identique à l'octet aux textes v3 du hub** (`/site/atelier/prompts` : chapitre ✓ fiche_seance ✓ deroule ✓, lecture GET seule). |

## ⑦ VÉRIFIÉ SANS RIEN TROUVER
Fonctions supprimées (0) · `secu*` (29/29 intactes) · écritures `published` (aucune nouvelle) · zones CSS (aucune touchée entre 8.59.2 et 8.59.3) · pageerrors sur tous les bancs (0) · requêtes non-GET des bancs (0) · helpers appelés par le code neuf (tous préexistants) · signatures des appelants (toutes compatibles).

## ⑧ PRÉCONISATION FINALE
**Promotion possible.** L'anomalie ⑤ n'est pas bloquante (sécurité tenue, dégradation d'un message seulement) ; je recommande le micro-correctif d'une ligne (`at-imp-note` dans la barre, ou replis en `atInfo`) — à la promotion suivante ou en micro, au choix de la conscience.
