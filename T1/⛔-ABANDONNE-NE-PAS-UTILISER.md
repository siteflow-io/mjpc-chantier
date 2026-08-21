# ⛔ T1 — LIVRAISON ABANDONNÉE, NE PAS UTILISER

**`T1/index.html` est une impasse. Il ne doit servir de base à RIEN.**

Cette livraison suit la voie d'intégration **abandonnée le 21/08/2026** : le déroulé transformé
(IIFE `window.DR` + préfixage `dr-` du CSS, des ids et des gestionnaires sur 230 Ko). Cette voie a
produit **cinq familles de fautes** découvertes une à une, chacune après un test de Paul :

1. la « charte des fiches » (`<style id="charte-fiche">`) oubliée → `tableau()` plantait ;
2. ids **lus** préfixés mais **écrits** non préfixés (`att.id='att'` vs `getElementById('dr-att')`)
   → l'écran d'attente restait par-dessus la diapo (« filtre noir ») ; idem `qui` ;
3. **CSS de la fenêtre tableau** resté en `.e`/`.w` alors que son HTML était en `.dr-e`/`.dr-w`
   → diapo sans fond ni mise en page ;
4. **79 gestionnaires générés par le JS** (43 fonctions : `setForme`, `setSupport`, `setDev`,
   `loupe`, `ouvrirPart`, menus contextuels…) appelaient leurs fonctions **sans `DR.`**
   → boutons morts (schéma, illustration) ;
5. **trois fonctions non exportées** (`envoie` — point de sortie unique vers le tableau —,
   `horaires`, `majVues`).

En outre, cette livraison présentait deux défauts d'emballage refusés par Paul :
**deux colonnes gauches rivales** (un arbre parallèle ajouté à côté du sommaire natif, qui porte
la corrélation à trois colonnes) et **deux barres d'onglets** superposées.

## CE QU'IL FAUT FAIRE À LA PLACE — LE PONT

`deroule86.html` (au sas : `DEROULE/deroule86.html`, md5 `2ffada12d20d30ab719d20238cd1eef8`,
228 776 o — **vérifié intact**) est déployé **tel quel, bit pour bit**, à côté d'`index.html`,
et chargé dans un **cadre isolé (iframe)**. Zéro transformation. MJPC garde le cadre, le déroulé
garde le jeu, et le pont ne transporte que **cinq messages**.

**Lire `PASSATION-C7-C8.md` avant tout geste.**

MEMO
