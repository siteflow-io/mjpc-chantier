# M-SÉCU-4 — CADRAGE COURT (exécutant → conscience)
**31/07 · j'attends le feu vert**

## LE POINT À TRANCHER D'ABORD : la base
**M-SÉCU-3 n'est PAS promu** (production `index.html` = 537 198 o · `a1390f1d…` = 8.8.3 ; journal et état des lieux inchangés depuis mon dernier relevé, md5 `8d289056…` / `8edbc8d7…`). Le prompt dit « base = production », mais l'écran M-SÉCU-4 pose des empreintes que **seule la porte 8.9.0 lit côté site** — bâtir sur 8.8.3 recréerait deux lignées divergentes du même fichier au sas. **Je propose : base = `m-secu-3/index.staging.html` (545 789 o · md5 `939345b34af41af2cb0764b1f3772bb1`, bit à bit vérifié au sas), avec DÉPENDANCE DE PROMOTION déclarée : M-SÉCU-3 se promeut avant ou avec M-SÉCU-4.** À confirmer.

## La preuve que les DIX lisent `/site/config/profEmpreintes` — FAITE
Grep sur les neuf apps : `mjpcVerifierProf` lit le nœud dans les 9 **productions actuelles (v2, 1 réf.)** ET dans les 9 **stagings v3 (2 réf.)** — la rotation vaudra pour les neuf dès aujourd'hui. Le site : 8.9.0 le lit (5 réf. : porte du portail par code seul, `_estCodeProf`, constat) ; la production 8.8.3 ne le lit PAS pour sa porte (clé seule + clair) — un argument de plus pour la dépendance ci-dessus. Détail au rapport.

## L'écran « Code professeur »
Accès : un bouton « **Code professeur** » dans l'encart sécurité (branche clé-valide, garde `secuExigeCle`) → une sous-vue dédiée du panneau (entrée au dispatch `_renderProfSection`, sans bouton de menu — on y va depuis l'encart, retour vers « Élèves & codes »). L'écran montre : **N fiches actives, datées** (j'ajoute un champ `ts` aux fiches nouvelles ; les 2 fiches historiques sans date → « posée avant ce jour ») — **jamais aucun code**. Trois gestes nommés : **« Ajouter un code »** · **« Retirer ce code »** (par fiche, libellée « code n° k — posé le … ») · **« Remplacer tout par un nouveau code »**. Mobile 390 : boutons pleine largeur, ⓘ cliquable.

## La garantie zéro-fiche — LE CŒUR
1. **Retrait** : si la liste ne compte qu'UNE fiche → **REFUS** avec explication (jamais de liste vide).
2. **Remplacement** : ordre inviolable **écrire-d'abord-retirer-ensuite** — la nouvelle fiche est AJOUTÉE, relue, l'empreinte du code saisi recalculée et confrontée ; **tant que ce contrôle n'a pas passé, rien n'est retiré** et l'écran dit « changement NON effectif ». Puis seulement les anciennes se retirent (une écriture de liste = nouvelles seules). Un échec à mi-course laisse toujours ≥ 1 fiche valide.
3. **Chaque geste** : archive `{_meta:{chemin:'/site/config/profEmpreintes',app:'site',ts},data}` en `/corbeille` AVANT, **ABANDON si l'archive échoue**.
4. **Double saisie** ×2 concordante exigée AVANT tout réseau (refus local sinon).
5. Vérification après écriture : relecture du nœud + recalcul → statut « effectif » seulement si concorde.
6. Tout passe par `secuLire`/`secuEcrire` → **le mode test (M8_TEST_STORE) route par construction** (vérifié dans `_sitePut`).

## La double saisie de la première clé (dette M-SÉCU-1) — corrigée ici
`secuPoserCle` : quand `secuValiderSecret` répond `canari-absent` (toute première clé), un second champ de confirmation apparaît et les deux saisies doivent concorder AVANT `secuEcrireCanari`. Quand le canari existe, rien ne change (la validation par canari suffit). Jouée au banc, discordance refusée.

## Textes (soumis)
- Écran : « **Code professeur** — N code(s) actif(s). Un code s'ajoute, se retire ou se remplace ici, avec la clé de chiffrement. Aucun code n'est jamais affiché ni enregistré en clair : les données qui le vérifient sont illisibles sans lui. »
- Sous le remplacement : « **Après ce changement, l'ancien code cesse de fonctionner partout, immédiatement : sur tous tes appareils et dans les dix applications.** »
- Double saisie discordante : « Les deux saisies ne concordent pas. Rien n'a été modifié. »
- Refus dernière fiche : « Ce code est le dernier. Le retirer fermerait l'accès professeur partout — ajoute d'abord un nouveau code, retire ensuite l'ancien. »
- Non-effectif : « Le changement n'est pas encore effectif : la vérification n'a pas abouti. Rien d'ancien n'a été retiré. »
- Première clé (confirmation) : « Confirme la clé : c'est elle qui verrouillera toutes les données. Une faute de frappe ici ne se découvrirait qu'au prochain appareil. »
- Effectif : « Fait le <date>. Le nouveau code ouvre l'espace professeur des dix applications ; l'ancien ne fonctionne plus nulle part. »

## Parcours au banc (①→⑧ du mandat)
Hub simulé : état initial 2 fiches → discordance refusée → ajout écrit/relu/concordant → **l'ancien code passe encore** → retrait de l'ancien → l'ancien ne passe plus → **retrait de la dernière REFUSÉ** → archive avant modification (indices du journal) → archive KO = ABANDON. + banc navigateur (écran réel, mobile 390, captures) + les codes cherchés sous 4 formes au journal + première clé jouée.

## Questions (2)
**Q1** — La base 8.9.0 et la dépendance de promotion : confirmées ?
**Q2** — L'accès par l'encart sécurité (sous-vue du panneau, sans bouton de menu propre) : validé, ou tu préfères une entrée au menu du panneau ?
