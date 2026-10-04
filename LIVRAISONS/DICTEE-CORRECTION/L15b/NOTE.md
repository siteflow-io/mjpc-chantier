# DICTÉE — L'ÉCRAN DE CORRECTION · L15b — la dictée, l'onglet et la copie tenus au rechargement

*Exécutant du complément L15, livraison L15b (dette n°12 · 103). Rien n'est promu.*

## Ce que ça change pour toi
- **L'adresse porte où tu es** : `?dictee=<id>&onglet=<preparation|correction|rapide|donnees|reglages>` (pour les Données, `&vue=<bilan|copies|fiches|suivi|exercices>`), et la copie ouverte `&copie=<clé>` (en Correction et en Rapide). Elle se met à jour **à chaque changement, sans recharger** ; les autres paramètres (`mode`, `v`…) sont gardés.
- **F5 rouvre exactement là** : la dictée, l'onglet, la copie, son mode (texte ou rapide) et sa position (L1, L15-0b).
- **« ← Retour »** (vers « Dictées existantes ») **nettoie l'adresse**. **Un lien copié** ouvre au même endroit. **Une dictée qui n'existe pas** → l'accueil, l'adresse nettoyée. **Côté élève, rien ne change** (son lien `?dictee=…&eleveKey=…` reste le sien).
- **Ta connexion au rechargement — à valider :** aujourd'hui, F5 te déconnecte : il faut redonner ton code. Avec L15b :
  - si ce navigateur **garde déjà ta clé de professeur** (il la garde depuis M-SÉCU-3 pour le coffre, quand tu entres ta clé), F5 sur une adresse de dictée te rouvre **directement** au même endroit ;
  - sinon (code plutôt que clé), tu redonnes ton code et tu arrives **au même endroit**.
  Rien de nouveau n'est gardé dans le navigateur. Si tu préfères redonner ton code à chaque F5, c'est une ligne à retirer.

## Le fichier
- Base **6.7.0-L13b en ligne** (837 270 o, md5 `1f1593e42222d7ded743b1c0a984bf2f`, vérifiée à la commande) → **6.7.0-L15b** : **840,104 o** (+2,834), md5 `b4df61131ce844895f31588407a4f9eb`.
- Ajoutées : `ONGLETS_DONNEES_L15B`, `ongletVersUrlL15b`, `urlVersOngletL15b`, `adresseProfL15b`, `lireAdresseProfL15b` ; `App` (la réouverture au rechargement), `AppProf` (rouvrir l'endroit de l'adresse une fois les classes lues ; la garde ; « ← Retour » nettoie), `CorrScreen` (l'onglet et la copie de départ ; l'adresse suit). Syntaxe : 1 bloc, `node --check` 0 erreur, `acorn --ecma2020` 0 erreur.

## Les bancs (`bancs/`) — le kit anonymisé, faux hub, ZZTEST
**`banc_L15b_geste.py`** (par le geste, **avec un vrai rechargement de la page**, 10 vérifications) : la dictée ouverte → `dictee=…&onglet=correction` ; **F5 sur Préparation, sur Données → Suivi (`onglet=donnees&vue=suivi`), sur Réglages** → le même écran, la même adresse ; **F5 sur une copie en mode texte** (`copie=zztest_kilo`) → la même copie, en texte ; **⇧R puis F5** → la même copie, **en rapide** ; **« ← Retour »** → l'adresse ne garde que `mode=prof` ; **une adresse tapée** (`onglet=reglages`) → Réglages ; **une dictée inexistante** → l'accueil, l'adresse nettoyée ; 0 erreur.
**Non joué au banc** : la réouverture sans `mode=prof`, par la clé gardée dans le navigateur (le banc n'a pas de vraie clé de professeur).
**Accordé** (la version d'avant jointe) : `banc_L1_geste.py` — après F5, la copie est déjà rouverte (avant : retour à la liste).
**Banc unique sur L15b : VERT, 0 échec** (`sorties/`) : S1/S3, S2, fuzz ×3, grille, bancs L1 → L14, L15-0, L15-0b, L15a, L13b, L15b, vue élève identique à la 6.6.3.

## Captures (`captures/`)
`B1-avant.png` (L13b : F5 sur une copie → la liste des dictées) ; `B2-apres.png` (L15b : la même copie).

## Tes tests, après promotion
1. https://siteflow-io.github.io/monsieurjaipascompris/correction_dictee.html?v=6.7.0 → une dictée → une copie → F5 : la même copie (au même mot).
2. ⇧R, F5 : le mode rapide, la même copie.
3. Données → Suivi → F5 : le Suivi. Copie l'adresse dans un autre onglet : le même endroit.
4. « ← Retour » : l'adresse redevient celle de l'accueil.
