# AUDIT — les dispositifs de l'ancien déroulé, un par un, contre la maquette (16/09/2026)
*Sur les mots de Paul : « il y a énormément d'éléments que tu as recopiés en moins bien, et de loin. C'est ce genre d'audit que j'attendais. » Pour chaque dispositif : ce que l'ancien fait exactement (où dans le code), ce que la v9c.4 faisait, ce que la v9c.5 fait, et la mesure. Verdicts : ✔ repris tel quel · ✘ était en moins bien · — hors de l'ancien.*

## 1 · La participation
| Caractéristique de l'ancien | Où | v9c.4 | v9c.5 | Mesuré |
|---|---|---|---|---|
| **Le panneau : les initiales de la classe en pastilles** (pas les prénoms) ; vert = a répondu au tableau, pointillé bleu = a parlé sans réponse ; **le petit compteur** (bleu ; vert si réponse) ; l'historique complet au survol | moteur L770-779, L243-251 | ✘ une liste de prénoms, sans compteur, sans couleur | ✔ | `T126-test-v9c5.mjs` |
| **Les muets d'abord**, en ambre ; ceux qui ont parlé passent à la fin | pont L16471-16479 | ✘ | ✔ (Zélia passe en 29e après sa prise) | ✔ |
| **Clic sur une pastille → la fiche de l'élève** (ppop) : « INI — n prises de parole », l'historique ligne par ligne (réponse : « … », reformulée, → aller à la réponse ; parole : motif, note, ✎ corriger, ✕ retirer), « Noter une prise de parole ici », les trois motifs, la note « pourquoi (facultatif — pour toi seul) », « Ces notes ne partent jamais au tableau. Elles rejoignent le profil de l'élève. » ; positionnée sous la pastille ; **un clic ailleurs la ferme** (garde de 400 ms) ; 1..9 = motif, Entrée dans la note = « a participé » avec la note, Échap | moteur ouvrirPart, corrigePart, posePart, supPart, allerRep ; pont L16481-16497 | ✘ une fenêtre à moi (liste, select, boutons) | ✔ | ✔ |
| **Le VIF** « ⌨ initiales — puis 1/2/3, note, Entrée » : **initiales dans n'importe quel ordre dès deux lettres** (« TM » trouve « MT »), sinon **début des initiales ou du prénom** ; jamais un absent ; les pastilles candidates s'allument ; **un seul élève trouvé ouvre sa fiche et met le curseur dans la note** ; plusieurs → liens prénom + initiales ; aucun → « Aucun élève avec ces initiales. » ; Entrée ouvre la fiche du premier ; Échap vide ; « posé : INI ✕ (Ctrl+Z) » pendant six secondes ; ² / F2 y amènent le curseur | pont L16417-16498, L16499-16510 | ✘ un champ avec trois boutons 1·2·3 et ↶, la recherche par accents sans l'anagramme | ✔ | ✔ (ae / ea, ze → fiche, 2, Ctrl+Z) |
| **La palette Maj + Espace** : voile sombre, boîte, initiales en grand, suggestions (10, prénom + initiales), motifs en boutons « 1 · a participé », la note, « dernières : INI · motif · h ✕ » (5), **un clic à côté annule**, Échap, **le curseur revient exactement où il était** (même dans une réponse au tableau reconstruite, retrouvée par son repère), 1/2/3 ou Entrée = motif 1, Tab → note | pont L16517-16621 | ✘ une boîte à moi : pas d'historique, pas de clic à côté, pas de curseur-retour garanti | ✔ | ✔ (le curseur revient dans « Le sublime ») |
| Les motifs : `participe` « a participé », `piste` « a proposé une piste », `revenir` « on y reviendra avec lui » | moteur L1071 | ◐ (1/2/3) | ✔ (les codes de l'ancien) | ✔ |
| **Ce que l'ancien n'a pas et que le cadrage ajoute** (greffé à côté, jamais à la place) : l'appel au clic droit sur une pastille (absent · arrivé · parti · revenu, l'heure prise, la raison), l'absent barré, le parti en italique, jamais proposés | cadrage 1, 11 bis | ✔ | ✔ | ✔ |

## 2 · Le tableau et ses outils
| Caractéristique de l'ancien | Où | v9c.4 | v9c.5 | Mesuré |
|---|---|---|---|---|
| **La loupe par cadre** : je trace un cadre, **cette zone remplit le tableau** | la v9a (tour 44), perdue en v9c | ✘ un grossissement ×2 centré sur un point | ✔ échelle = le cadre | ✔ (cadre 10-60 % → ×2) |
| Mettre en lumière (dix pulsations, puis rien, l'outil se repose) · à écrire · surlignage quatre couleurs · qui a participé (la boîte) · l'attente · la fiche en page · l'arrivée en fondu | T124 | ✔ (v9c.4) | ✔ | 34/34 (T124) |
| **Les quatre défauts de l'ancien, corrigés sur l'ordre de Paul** : l'image support en plein écran avec sa légende en bandeau (le CSS cassé de l'ancien ne l'affichait pas) ; le ✍ visible au pilote ; la lumière qui survit à un re-rendu ; la police qui suit le redimensionnement | moteur L2545, L133/L144, allume(), calePilote() | — | ✔ | ✔ (plein-img, ::after ✍) — la mesure des visuels signale un écart **voulu** sur la légende d'image (bandeau) |

## 3 · L'écran
| Caractéristique | v9c.4 | v9c.5 | Mesuré |
|---|---|---|---|
| **Les poignées comme PowerPoint** : une barre entre les colonnes, qu'on tire ; la colonne suit la souris en continu, ses miniatures grossissent ou rétrécissent d'autant, le centre se réajuste ; tirée jusqu'au bord, elle se replie ; double-clic replie ou rouvre à la largeur d'avant | ✘ un bouton replier/rouvrir | ✔ | ✔ (+120 px → miniatures +80 px ; −400 → repliée ; double-clic → 306 px) |

## 4 · Ce qui est propre à la maquette, et ce qu'il en advient au mandat (les mots de Paul : « énormément d'éléments relatifs à la maquette, qu'on ne peut pas intégrer tels quels »)
| Dans la maquette | Pourquoi c'est là | Dans le site (mandat) |
|---|---|---|
| **L'entrée par l'emploi du temps** (v9c.5) : deux cases, « Lancer », rien ne tourne avant | la porte réelle du site (cadrage 4, 0.3) — remplace le chrono qui « se lançait tout seul » à l'ouverture (v9c.4 et avant) | l'EDT existant ; le lancement depuis la case ; le chrono démarre au lancement |
| **L'enchaînement lundi → mardi** par la case de mardi, « Où en est la classe », Lancer | c'est le mécanisme cadré (6.5-6.7) ; la maquette le joue sans hub | identique, la copie de classe lue au hub |
| **Le T-5 « avancé » par ⚙** | l'heure simulée avance en temps réel ; attendre 50 minutes n'est pas testable | il n'y a plus de ⚙ : l'heure vient de l'EDT et de la vraie horloge ; le T-5 surgit à cinq minutes de la fin (l'existant le fait déjà : atT5Modale) |
| **La clé USB et le tableau réglés par ⚙** | il n'y a pas de clé ni d'ordi de classe dans une page | la garde lit l'appareil qui projette et le dossier désigné (cadrage 4, 4b) |
| **Le journal, le récit, la relecture** composés dans la page | c'est l'objet de la maquette : montrer la composition | le journal au hub, le récit calculé du journal (le même moteur, repris), la relecture dans l'onglet ; **la « fausse relecture » : question posée à Paul** (composée d'un journal simulé, ou visuels de l'onglet Relecture du site non repris ?) |
| L'état par rang, le rendu du tableau par injection de code dans la fenêtre | commodités de maquette | abolis (identités partout ; le tableau reçoit l'état par le hub) |

## Ce que cet audit a changé
La v9c.5 remplace **tout** le dispositif de participation par celui de l'ancien (code et CSS recopiés du moteur et du pont, adaptés à la maquette), rétablit la loupe par cadre, remplace les boutons de colonne par des poignées qu'on tire, corrige les quatre défauts de l'ancien et ouvre sur l'emploi du temps. Bancs : `T126-test-v9c5.mjs` (29 vérifications par le geste), et tous les bancs antérieurs adaptés et rejoués — 0 défaut.
