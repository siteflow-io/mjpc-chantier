# M12 — LE SITE (`index.html`) : corbeille lisible, modales, genres, autonomie
**[exécutant M12]** · 22/07/2026 · `index.html` 8.4.3 → **8.5.0** · ⚠ **VERSION PROVISOIRE — non promue, ne pas utiliser en classe** (point 21)

Livré : `index.staging.html` (391 962 o ; base 365 082 o ; diff intégral 448 lignes, classé ci-dessous). Feu vert conscience n°3 intégralement appliqué, y compris les cinq ajouts.

---

## 1 · Ce qui a été fait (dans l'ordre du plan §8 validé)

**Socles UI.** `_modalePrompt` (saisie, Entrée = valider) et `_modaleConfirme` (confirmation, avec re-frappe optionnelle d'un mot) construites sur `_showConsoleModal` existant — charte cm-box, aucune nouvelle infrastructure. `_corbeilleRestaure` : canal d'écriture UNIQUE de la restauration, qui respecte le mode test M8 (`M8_TEST_STORE`) — cf. capture, la restauration en mode test n'émet rien au réseau.

**A · Écran corbeille** (S5-⑥). Nouvelle section prof « 🗑 Corbeille » : liste par jour, étiquette lisible par motif, détail (élève/classe/dictée/nœud), horodatage, source, taille, mention « ancien format » pour les archives brutes legacy. Trois gestes : **Consulter** (contenu + verdict de restaurabilité), **Exporter** (JSON local), **Restaurer** quand un plan sûr existe. Les trois formes de données tolérées (canonique `{_meta,data}` · variantes d'apps `le`/`dictee` · brut legacy).

**Restauration — stricte (Q4).** Plan de restauration = liste de nœuds ENTIERS uniquement :
- `_meta.chemin` non vide → `data` entier PUT à ce chemin (réservé aux futurs écrivains mono-nœud) ;
- sinon table par motif : `orphelin-<n>` → `/<n>` ; `suppression-classe` → `classes/<slug>` + `codes/*` (les archives contiennent les nœuds entiers) ; `suppression-dictee` → `dictees/<id>` ;
- sinon **consultation + export seulement, et l'écran dit pourquoi en clair** : `retrait-eleve` est une archive PARTIELLE (l'élève seul, pas la classe — un PUT détruirait la liste) ; `purge-rentree` est multi-emplacements (restauration globale par Importer) ; legacy = ancien format. Rien n'est jamais reconstruit par déduction.
Avant toute écriture : GET de chaque cible ; **cible occupée → re-frappe `RESTAURER` obligatoire** (capture 11 : « results — 249 élément(s) actuels ») ; cibles vides → confirmation simple. Le refus sans re-frappe est prouvé (capture 12 : la modale tient). Après restauration, **l'archive RESTE en corbeille** (rétention 1 an, jamais de suppression automatique).

**Q1 · `_meta.chemin`.** Champ ajouté au format W chez les 5 écrivains d'index. Après lecture des extracts réels, il est posé VIDE partout : aucun des 5 n'archive un mono-nœud entier pur (`retrait-eleve` est partiel, `suppression-classe` est multi, `orphelin` enveloppe `{noeud:contenu}`). La sémantique est documentée en tête de bloc : `chemin` non vide = « data est LE nœud entier de ce chemin ». C'est le contrat pour les écrivains futurs et pour la propagation aux apps (dette déclarée).

**B · Modales.** **7/7 `prompt`** convertis (chapitre, séance, item, renommages ×2, image, classe) et **14/14 `confirm`** du périmètre (dates brevet, annonce, purge chapitres, chapitre, séance, item, délier, image galerie, notion, document, régén. codes, retrait élève, archivage classe, suppression classe). Trois passent en **re-frappe** : purge de tous les chapitres d'un niveau (`EFFACER`), régénération de tous les codes (`CODES`), suppression de classe (le **nom exact** de la classe — l'ancien duo confirm+prompt natifs fusionné en une modale). La boîte native de `_corbeillePuis` (garde-fou de dernier recours) reste native comme arbitré ; celle du socle (`renvoyerVersMJPC`) intouchée.

**C · Genres.** `analyse_logique` (nœud `analyse_logique/travaux` — collé au hub, zéro migration), `applaudimetre` (`applaudimetre/seances`, libellé + date), `worktrack` (`plan_de_travail/chapitres`, libellé = œuvre + niveau, formes réelles relevées au hub). Modale de liaison : trois nouvelles sections ; `openItem` : ouvertures câblées (`applause_meter.html?n=`, `worktrack.html?n=` ; `analyse_logique.html` sans paramètre — M11 a supprimé `?role=`, l'élève shunté arrive sur « Mes analyses » ; **deep-link vers un travail précis = dette de l'app**, à sa passe). Au passage : **réparation du genre `tache`** qui existait dans les données mais tombait sur « type non supporté ».

**D · Autonomie** (S5). Marqueur 🚀 par item côté admin (toggle, écrit `autonomie:true` via `_sitePut` → couvert par le mode test), chip 🚀 visible sur l'item, et l'onglet élève « Zone autonomie » passe de coquille à vue réelle : les items marqués sont **rassemblés par chapitre d'origine**, tous chapitres confondus. **Publication souveraine prouvée** : la collecte passe par `_visiblePourSession` à chaque niveau (chapitre, séance, item) — le marqueur n'outrepasse jamais `isPubFor`, dont le md5 est inchangé.

## 2 · Les cinq ajouts du feu vert

**① Séance publiée toujours visible.** Le `return` qui masquait les séances sans item visible est retiré (commentaire datant la décision de Paul). Vérité mesurée au hub : le ch. 1 de 3e compte **8 séances publiées, toutes à 0 item** — aucune n'apparaissait avant M12 ; toutes s'affichent désormais (capture 08).

**② Champ texte par séance** (`noteEleve`). Bouton 📝 dans les actions de séance (allumé si un texte existe), saisie par `_modalePrompt`, vide = retiré, écriture via `_sitePut` (mode test couvert). Côté élève : le texte s'affiche en tête de séance, style discret bordure accent. Séance publiée vide SANS texte : mention par défaut **« Séance faite en classe — pas de document sur le site. »** — **SOUMISE**, remplaçable par un mot. La liaison au cahier de référence est inscrite au plan, non traitée (Paul : « pour plus tard »).

**③ Deux graphies de clés de publication.** Vérité prouvée par test unitaire : **`isPubFor` reconnaît DÉJÀ les deux graphies** — elle slugifie la classe demandée ET les clés stockées (`3E Charles de Gaulle` ≡ `3e_charles_de_gaulle`). Aucun élève ne perd l'accès, aucun code à changer en lecture. **Le risque réel est ailleurs** : si les DEUX graphies coexistaient un jour sous un même nœud avec des valeurs contradictoires, le résultat dépendrait de l'ordre d'énumération des clés (indéterminisme). État mesuré : ch. 1 en graphie slug (écrit par `_markPub` post-M8), ch. 2+ en graphie verbeuse (antérieurs). **Mise en conformité proposée, NON exécutée** : passer toutes les clés `published` du site en graphie slug (un script d'une passe, ou re-cliquer les toggles de publication depuis la console qui réécrivent en slug). À ton arbitrage.

**④ Pastille 8.5.0** + date. La leçon M11 (Analyse logique livré sans incrément → Paul a cru à un cache) est actée : la pastille suit toujours.

**⑤ Point 23 · bloc DIAGNOSTIC** posé en tête de script au patron `docs/MJPC6-bloc-diagnostic.md`, §3 véridique pour le site : **aucune bibliothèque de script externe** (seules dépendances réseau : Firebase, polices Google cosmétiques, Drive pour les documents), et la mention que **c'est CE site qui porte l'alerte règles Firebase** (l'overlay compte les jours). Dette d'écosystème déclarée §5. **Point 12 · fondement pédagogique** : l'écran corbeille et la zone autonomie servent la même conviction — les systèmes mécaniques (archives lisibles, activités rassemblées) libèrent le professeur pour l'interaction directe, et donnent à l'élève un espace d'initiative borné par la publication.

## 3 · Preuves
- **Syntaxe** : double parseur (node --check + acorn ES2020) ✅ sur le bloc script intégral.
- **Invariants md5 §7** : 21/21 identiques avant/après (`isPubFor`, `_markPub`, `_visiblePourSession`, `renderChapitres`, socle session/MJPC, canal corbeille d'écriture, console modale…). 5 fonctions modifiées, toutes déclarées : `renderItem`, `renderSeance`, `renderChapterCard`, `openItem`, `switchTab`.
- **Captures d'office 15/15** (`captures-m12/`) : harnais Puppeteer **LECTURE SEULE STRICTE** — interception réseau, toute écriture (PUT/POST/PATCH/DELETE) avortée et journalisée : **0 écriture n'a atteint le hub** ; le marquage autonomie a été incarné via le mode test M8. Parcours : admin séances · modale prompt · modale suppression · re-frappe purge · liaison nouveaux genres (listes du hub réel) · marqueur 🚀 · zone autonomie élève · séances publiées vides · corbeille (données réelles) · consulter · confirmation cible occupée (« 249 éléments actuels », capture du 22/07 16h) · branche cibles vides (11bis) · **refus sans re-frappe** (modale tient + bordure rouge, prouvé en mode test avec cible semée localement) · corbeille 480px · autonomie 480px. Note d'honnêteté : entre les deux passes de capture, `/results` est passé de 249 éléments à absent au hub (le hub vit) — les DEUX branches de la confirmation sont donc documentées sur données réelles, et le refus a été re-prouvé mécaniquement via `M8_TEST_STORE` sans toucher au hub. Un crash de l'environnement d'exécution entre codage et push a imposé une reconstitution : le staging poussé a été re-prouvé intégralement après reconstitution (double parseur, invariants 21/21).
- **État du hub inspecté** (lecture seule) : corbeille 3 jours d'archives (14, 17, 19/07 — orphelin-results, formats pré-M9 sans `source`, affichés « (inconnue) » honnêtement) ; publications ch1 slug / ch2-3 verbeux (③) ; ch1 3e : 8 séances publiées à 0 item (①).
- **Bit à bit local↔sas** : vérifié après push (sha256).

## 4 · Sécurité — constats versés à M-SÉCU (aucun traité)
- Écritures chapitres/classes du site en `fetch` direct non authentifié (héritées, comme partout : règles ouvertes du hub).
- `noteEleve` et titres sont échappés à l'affichage (`escapeHtml`) — pas d'injection ajoutée par M12.
- La corbeille expose en consultation les codes élèves archivés au professeur seul (section prof) ; l'accès à la section prof repose sur le régime d'authentification existant du site — même périmètre que « Élèves & codes ».

## 5 · Vivant — dettes et restes (dans l'ordre)
1. **Propagation `_meta.chemin` aux apps** (Q1) : chaque écrivain d'app pose le chemin quand il archive un nœud entier — aux passes des apps.
2. **Mise en conformité des graphies `published`** (③) : décision de Paul requise, script ou re-clics.
3. **Deep-link analyse_logique** : ouvrir directement le travail lié (paramètre à recréer côté app, M11 l'a retiré) — passe app.
4. **Couverture mode test des 46 écritures préexistantes** du site (chapitres/classes en fetch direct) : déclarée, hors M12 (cœur des chapitres).
5. **`TAB_LABELS`/`PUBLISHABLE_TABS`** : dictionnaire de textes limité aux vues touchées ; migration complète = lot suivant (Q3).
6. **Bloc DIAGNOSTIC dans les autres apps** de l'écosystème (⑤) — à chaque passe.
7. **Liaison `noteEleve` ↔ cahier de référence** (② — « pour plus tard »).
8. **Formulation du texte par défaut de séance vide** : soumise, en attente du mot de Paul.
9. **Boîte native `_corbeillePuis`** : garde-fou volontairement natif (fonctionne même DOM cassé) — assumé, documenté ici.
10. **Nettoyage `?v=` anti-cache** : rappeler `?v=` aux élèves si la pastille ne suit pas après promotion.

## 6 · Annonce élèves (pour le champ « annonces nouveautés » — à la promotion seulement)
> Le site s'améliore : toutes les séances faites en classe apparaissent maintenant dans vos chapitres, même quand il n'y a pas de document à consulter. Et dans l'onglet 🚀 Zone autonomie, je rassemble des activités que vous pouvez faire seuls, dans l'ordre que vous voulez.

*(soumise, jamais décidée)*

— [exécutant M12] · **provisoire** · promotion : Paul seul.
