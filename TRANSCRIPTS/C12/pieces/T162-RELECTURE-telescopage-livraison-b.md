# RELECTURE DE TÉLESCOPAGE — avant la livraison (b) de la v9c.14 : l'alerte T-5 et la séquence de fin d'heure (21/09/2026)
*Ce que (b) va faire (cadrage 1 · 6.3 et 7.0, validé) : le chrono du bandeau devient un compte à rebours vers l'heure du cahier de textes à T-5 et pulse de plus en plus (T-3 : couleur et pulsation, T-1 : critique) ; une alerte au pilotage, au-dessus de la zone de notes, déplaçable à la souris, non bloquante, qui dit le palier, l'activité en cours et son état, et propose « Aller au cahier de textes » (→ la garde du cahier, déjà livrée en (a)) ou « Plus tard » ; « Plus tard » ou un clic à côté la replie, elle revient à T-3, T-1, puis à l'heure du cahier de textes (« c'est l'heure du cahier de textes », ne se replie plus) ; ensuite le compte à rebours affiche le dépassement du cahier. La colonne de droite en fin d'heure devient une séquence de quatre sections repliées qui s'empilent (l'échéance → ce qui reste et les notions → avant de clore → Clore), une flèche de dévoilement entre chaque, les sections faites repliées sur une ligne-résumé ; un seul mécanisme pour l'alerte, « Fin de l'heure » et le rattrapage. Trois verdicts : ✔ rien à faire · ⚠ télescopage → la solution · ⏳ reporté et dit.*

## 1. Le temps et le chrono
| Mécanisme de la maquette | Ce qui se passe avec (b) | Verdict · solution |
|---|---|---|
| Le tick (chaque seconde) : `S.ecoule++`, « mm:ss » écoulé ; à `fin − 5 min` il appelle `t5()` | Le repère change : **l'heure du cahier de textes = fin − 5 min** ; T-5 = cahier − 5 = fin − 10 | ⚠ → le tick calcule `cahier = fin − 5 min` ; à `cahier − 5` le chrono **devient un compte à rebours** (« −5:00 ») ; T-3, T-1, zéro ; après zéro « +m:ss » (le dépassement du cahier) jusqu'à Clore. Un seul élément `#chr`, qui change de sens et de classe |
| `S.ecoule` (le temps écoulé) sert à « Où on en est » (« utile ») | Rien ne change : l'heure court jusqu'à Clore (6.3) | ✔ |
| La coupure simulée (⚙) avance l'horloge de 3 min (`DECALAGE`) | Les paliers d'alerte se calculent sur `now()` : une coupure peut faire sauter un palier | ✔ voulu (la vraie horloge ne s'arrête pas) ; les paliers manqués sont déclenchés au premier tick suivant, dans l'ordre, sans doublon |
| `t5()` (aujourd'hui : va au cahier par la garde, provisoire de (a)) | Devient l'alerte seulement | ⚠ → `t5()` n'ouvre que l'alerte ; **le geste vers le cahier est celui de l'alerte** (« Aller au cahier de textes » → la garde de (a)) ; le journal note `t5`, `t3`, `t1`, `cahier-heure` |
| ⚙ « Faire arriver T-5 » (simulation : avance l'horloge à fin − 5) | Faux repère depuis 6.3 | ⚠ → la simulation avance à **cahier − 5** (15 h 52) ; trois boutons de plus : « T-3 », « T-1 », « l'heure du cahier de textes » ; tous nommés « simulation » |
| Le temps de l'activité en cours s'arrête au passage au cahier (6.3) | Le journal `diapo` date déjà chaque passage | ✔ mécanique existante ; le verdict en (d) ; le compte « fin d'heure » dans « Où on en est » en (c) |

## 2. L'alerte
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| La classe `.alerte` **existe déjà** dans la maquette (une bulle d'aide masquée) | Collision de nom — la cinquième si je ne la vois pas | ⚠ → la boîte s'appelle `al-boite`, ses parties `al-*` (règle du registre n°12 · 40 : préfixer et chercher avant d'écrire) |
| Le centre : `.outils` puis la zone de notes | La boîte s'insère **entre les deux, dans le flux** (6.3) ; repliée, elle tient sur une ligne au même endroit | ✔ ; à 1366 px la zone de notes perd la hauteur de la boîte (l'audit d'affichage le mesure) |
| Déplaçable : les poignées de colonnes ont déjà un glisser (`tirer()`) sur `document mousemove/mouseup` | Deux glissers sur le même document | ⚠ → la poignée `⠿` de l'alerte a son propre `mousedown` et ses propres écouteurs, posés au début du glisser et retirés à la fin ; la boîte passe en `position:fixed` pendant le glisser ; relâchée dans le tiers bas de l'écran, elle revient dans le flux ; **elle reste dans la fenêtre** (bornée) |
| Le clic à côté replie l'alerte | Il existe déjà des « clic à côté » : la fiche d'élève (garde de 400 ms), la palette, les menus | ⚠ → un seul écouteur `document click` pour l'alerte, qui ignore les clics dans la boîte, dans une garde ouverte, dans la palette et la fiche ; il ne replie que si l'alerte est dépliée ; à zéro, il ne replie plus |
| Les gardes (modales, `z-index` 30) et la palette (99000) | L'alerte n'est pas modale : elle passe sous les gardes | ✔ (`z-index` 25, sous les gardes, au-dessus du mur) |
| La relecture, l'ouverture de l'heure suivante (voiles) | Le pilotage est couvert : l'alerte avec lui ; le bandeau (compte à rebours) reste visible | ✔ |
| Le gel | L'alerte ne concerne pas la classe : indépendante du gel | ✔ |
| « Aller au cahier de textes » pendant que la garde ordinaire est ouverte | Deux gardes ne se superposent pas | ⚠ → le bouton est inactif tant qu'une garde est ouverte |
| Les raccourcis clavier | Aucune touche pour l'alerte (elle se manie à la souris) ; Échap ne la touche pas | ✔ |

## 3. La séquence de la colonne de droite
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| `ouvrirFin(cloture)` : un seul écran (titre, prévu / pas fait, cartes par activité, travail, notions, échéance, avant de clore, barre Annuler / Clore), rendu par `poserHtml` dans `#droite-fin` | Devient **quatre sections** dans le même conteneur : 1 échéance · 2 ce qui reste et notions (les cartes, les cases) · 3 avant de clore · 4 Clore | ⚠ → le même `ouvrirFin` compose les quatre sections ; l'état `S.finSection` (la section ouverte) et `S.finFaites` ; les ids existants (`f-ech`, `f-libre`, les `[data-c]`, `f-mot`, `f-clore`, `f-fermer`) sont conservés — les bancs de (a) et la non-régression continuent de marcher |
| `#f-ok` (« Garder ces décisions », T-5 sans clôture) | La séquence a un seul bouton de sortie « Reprendre le cours » (= fermer la colonne) et « Clore » en section 4 | ⚠ → `#f-fermer` reste (« Reprendre le cours ») ; `#f-ok` disparaît ; le banc « tout cliquer » l'exclut déjà par absence |
| La flèche entre les sections | Nouveau : `▼` cliquable ; grise tant que la section précédente n'est pas faite | ✔ « faite » = l'échéance choisie / au moins une décision par activité restante (ou aucune restante) / la section 3 vue |
| Une section faite se replie sur une ligne-résumé | Le résumé se calcule de l'état (la date ; « 2 à l'heure suivante, 1 à la maison » ; « notes gardées, mot aux absents ») | ✔ |
| Le rattrapage (6.7) : `ouvrirOuverture` → `ouvrirFin(true)` si l'heure n'est pas close | Même séquence, sans classe | ✔ |
| La colonne repliée | `ouvrirFin` la rouvre (déjà fait en v9c.13) | ✔ |
| L'échéance choisie → la date du cahier au tableau ; les cases → le texte | Déjà mesuré en (a) | ✔ |
| Le champ École Directe | Retiré en (a) | ✔ |
| La barre « Annuler / Clore » en bas (sticky) | Devient la section 4 ; « Reprendre le cours » en tête de colonne | ⚠ → l'audit d'affichage remesure la colonne aux trois tailles |

## 4. Les bancs
| Mécanisme | Ce qui se passe | Verdict · solution |
|---|---|---|
| `test-a-cahier` (clique `#bfin` puis `#f-ech`, `#f-clore`) | Les ids sont conservés ; `#f-ech` est dans la section 1 (ouverte d'abord) ; `#f-clore` en section 4 : le banc devra ouvrir les sections | ⚠ → le banc clique les flèches (par le geste) avant `#f-clore` |
| `regression-a`, `tout-cliquer-a`, `test-a0-insertion` | Idem pour la clôture ; l'alerte n'apparaît pas dans leurs parcours (l'horloge simulée n'atteint pas T-5) | ✔ après le même recalage |
| `audit-affichage-a` | L'écran « fin d'heure » et un nouvel écran « alerte dépliée » aux trois tailles | ✔ à étendre |
| Le nouveau banc (b) | Par le geste : ⚙ T-5 → la boîte au-dessus des notes, le compte à rebours « −5:00 » ambre qui pulse ; « Plus tard » → repliée ; ⚙ T-3 → revient orange, pulsation plus vite ; clic à côté → repliée ; ⚙ T-1 → critique ; ⚙ heure du cahier → « c'est l'heure du cahier de textes », clic à côté sans effet ; déplacer par ⠿ à la souris (la boîte suit, reste dans l'écran, revient en bas) ; « Aller au cahier de textes » → la garde (a) → « Y aller » → le cahier, le chrono continue (« +0:xx » après zéro), le temps de l'activité arrêté au journal ; la séquence : section 1 → échéance → tableau ; flèche → section 2 (cartes, cases → tableau) ; flèche → 3 ; flèche → 4 → Clore ; les résumés | ✔ |

## Ce qui reste à trancher par Paul
**Rien qui bloque.** Deux libellés que je prends sauf contre-ordre : le bouton qui referme la colonne s'appelle **« Reprendre le cours »** (à la place de « Annuler ») ; l'alerte repliée se lit sur une ligne **« T-5 · le cahier de textes attend — ▸ »** au même endroit, au-dessus des notes.
