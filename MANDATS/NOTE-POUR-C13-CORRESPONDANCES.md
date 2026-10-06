# Pour la conscience n°13 (le déroulé, `index.html`) — de la part de la n°12, 06/10/2026
*Transmis par Paul. Rien n'est à faire par la n°12 dans `index.html`.*

**Mesuré le 06/10** (index.html 8.74.0-③, lecture seule) : le bouton « ↗ Correspondances » de la dictée ouvre `index.html?panneau=taxonomie&onglet=correspondances&app=correction_dictee` dans un nouvel onglet → « Lien invalide — Utilise le lien fourni par M. Meney ». Deux causes :
1. `restoreSession()` ne lit la session du professeur que dans `sessionStorage` ; un nouvel onglet ne l'a pas. (La dictée, elle, garde la session prof dans `sessionStorage` **et** `localStorage` — clé `mjpc_eleve`, `is_prof:true`, et depuis le 06/10 elle la fait glisser à chaque ouverture.)
2. Le site ne lit pas `panneau=` / `onglet=` / `app=` et n'a pas l'onglet « Correspondances » de l'éditeur de taxonomie (valider / refuser les rattachements proposés : `/taxonomie/alias/tables/correction_dictee`, statut `propose` → `valide` ; c'était **L15.1b-2**, confié à ton couple).
**Ce que la dictée attend du site** : reconnaître le professeur dans un nouvel onglet (la même clé que la dictée) ; ouvrir le Panneau prof → Taxonomie → Correspondances, filtré sur l'app, d'après ces trois paramètres. Le jour où c'est en ligne, la dictée rebascule son bouton (une constante).
