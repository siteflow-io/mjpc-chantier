# MANDAT — LE BLOC QUESTION : LA PARTICIPATION AVANT LA RÉPONSE PRÉPARÉE
*Conscience n°16, 01/11/2026 20:10 (C16 tour 2). Un seul exécutant, neuf, sur `index.html` (par ses modules `LIVRAISONS/INTEGRATION/dr/*`). Lancé seulement sur le « ok » de Paul aux captures de la maquette (C16 16 · 11 à 14). Paul joue en classe le lundi 02/11 : aucun test ne se fait au moment du cours, tout doit être prouvé ce soir.*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE (Paul, 01/11/2026 18:53, mot pour mot)
« dans le type "question": la participation des élèves doit être avant la réponse préparée par moi. Car c'est comme ça que ça se passe en classe. J'affiche la question, les élèves participent et je prends leur participation, PUIS seulement j'affiche la réponse académique. »
Aujourd'hui (8.77.0-⑩), au tableau, la réponse préparée dévoilée vient se placer **au-dessus** des réponses des élèves ; sur l'écran de Paul, sa ligne grisée est entre la question et les élèves dès le départ (sas `MANDATS/DEROULE-01-11/DETTES-MESUREES.md` §3.2).

## 1 · MISSION 0 — AUDITE CE MANDAT D'ABORD (Paul, 21/10 : « si tu t'es trompé, il faut qu'ils le signalent »)
Avant de coder, relis ce mandat contre le code et dis, dans ta NOTE, chaque erreur ou manque que tu y trouves. Tu ne t'arrêtes pas pour demander : tu tranches selon §4 et tu le dis.

## 2 · LA BASE — LA MAQUETTE EST LE CODE (`PROTOCOLE-MAQUETTE.md`, règle 00 et §0 point 4)
Sas `siteflow-io/mjpc-chantier`, branche **`deroule/question-ordre`** (sur `integration` `d40d567`, dont l'assemblé = la production 8.77.0-⑩ md5 `55694fe15bc27b5fb318eeb1e05910a1` à la seule ligne `APP_VERSION` près — vérifié par la conscience). La maquette est le commit `e076704` : tu la **finis et tu la prouves**, tu ne la réécris pas.
Ce qu'elle change, et rien d'autre :
1. `dr-socle.js`, `rendre`, branche `b.t === 'question'` : les lignes de la réponse préparée (`ul.etapes`, désormais `ul.etapes q-prep`) sont écrites **après** les réponses des élèves (`.rep`) et la ligne libre (`.rep.libre`). Le compteur `k` et le fil (`elements`) ne changent pas : ▶ dévoile la question, puis la réponse préparée.
2. `dr-atelier.js` : le formulaire « + Question » dit « La réponse préparée — elle s'affiche après la participation des élèves » (avec son infobulle), le refus « la réponse préparée manque — elle s'affiche après la participation des élèves », la carte de l'objet Question et la description du type « Question » disent l'ordre.
Ce que Paul a validé (C16 16 · 11 à 14, sur les captures) : l'ordre question → réponses des élèves au fil de la frappe → réponse préparée tout en bas, à la flèche ; une réponse tapée après reste avec les autres, au-dessus de la réponse préparée, le bloc ne change jamais d'ordre ; sur l'écran de Paul, la réponse préparée visible en gris pâle en bas dès le départ ; le récit et le papier ne bougent pas.

## 3 · CE QUE TU FAIS
1. **Ce que l'ordre ancien portait ailleurs** : cherche (en lisant les fonctions, pas en comptant des motifs — DISPOSITIF 01/08) tout ce qui suppose que `ul.etapes` précède `.rep` dans un bloc question : CSS (sélecteurs d'adjacence `+`, `~`, `:first-child`, `:last-child`), la pagination (pages, `policeReduite`, la page qui suit le dernier élément dévoilé), la loupe, la mise en lumière, `aecrire`, le surlignage, les vignettes, « ⧉ Ce que voit la classe », la fenêtre du tableau, le tableau distant (`dr_rendreMur`), le récit (`dr-recit.js`), le papier, la réserve, la diapo « Où en sommes-nous ? » construite (`dr_reactInserer`). Corrige ce qui casse, dans le même esprit ; écris la liste dans la NOTE, avec ce que tu as vu à chaque endroit.
2. **Le banc par le geste** `LIVRAISONS/INTEGRATION/EX/bancs/sonde-question.mjs`, sur le modèle de `sonde-10.mjs` et du script de captures de la conscience (`LIVRAISONS/DEROULE-01-11/QUESTION-ORDRE/cap-question.mjs`) : faux hub `AUDITS/INTEGRATION-DEROULE/hub`, horloge du 14/09 09:00, mode test, l'heure lancée par la case de l'emploi du temps, ▶ jusqu'à la diapo « Où en sommes-nous ? » (question : « Quel mot-bilan avons-nous écrit sur les cinq tableaux ? »), des réponses d'élèves réalistes tapées dans la ligne libre (initiales puis réponse, Entrée). Chaque vérification lit le DOM **au pilote et dans la fenêtre du tableau** (`#bvideoproj`). Il échoue si une seule vérification échoue. Les cas, tous :
   1. ▶ : la question au tableau, seule ;
   2. trois réponses : au tableau, la question puis les trois réponses, aucune réponse préparée ; au pilote, l'ordre question → élèves → ligne libre → réponse préparée grisée ;
   3. ▶ : la réponse préparée au tableau, **sous** les trois réponses ;
   4. une quatrième réponse tapée après : au tableau et au pilote, elle vient avec les autres, au-dessus de la réponse préparée ;
   5. ◀ : la réponse préparée revoilée au tableau, les réponses des élèves restent ;
   6. une question dont les réponses font passer le bloc sur une seconde page (assez de réponses réalistes pour déborder à 1366 × 768) : la réponse préparée sur la dernière page ; ▶ la dévoile et le tableau montre la page où elle est ;
   7. une diapo à deux blocs question (prends-en une du chapitre si elle existe, sinon dis-le) : chaque bloc garde son ordre, ▶ suit question 1, réponse 1, question 2, réponse 2 ;
   8. la question du bilan sans réponse préparée (`dr_qSansReponse`) : inchangée (aucune ligne vide sous elle, la participation directement sous la question) ;
   9. la répétition (« ▶ Jouer en avance ») : le même ordre ;
   10. l'Atelier : « + bloc » → Question, les deux libellés et l'infobulle ; ajouter une question, le refus sans réponse préparée ; le bloc dans l'Atelier montre la ligne de participation entre la question et la réponse préparée ; changer le type d'un texte en « Question » ;
   11. le récit de l'heure, après les mêmes gestes, est **identique** sur la production 8.77.0-⑩ et sur la branche (compare les deux textes) ;
   12. aucune erreur JS, aucune boîte système ; en mode test, aucune écriture au hub hors de `/site/tableau_test`.
   Les tailles : 1366 × 768, 1536 × 864 (l'écran de Paul à 125 %), 1920 × 1080.
3. **Le banc complet** : `sh AUDITS/INTEGRATION-DEROULE/banc.sh <sortie>` sur la branche → VERT, puis ta sonde → VERT. Tu ne modifies jamais `AUDITS/` : la conscience ajoute ta sonde au banc unique après son audit.
4. **Les captures**, écran entier, regardées une à une : les cas 2, 3, 4 et 6, au pilote et au tableau, à 1536 × 864. Elles restent dans ta session (le dossier de travail de la conscience, `…/scratchpad/c16-executant/`), **jamais poussées** : le faux hub porte les initiales de la classe test.

## 4 · CE QUI EST DÉJÀ TRANCHÉ (tu ne demandes pas)
1. Le fil de ▶ ne change pas ; aucune touche nouvelle, aucun bouton nouveau.
2. Les styles ne changent pas (la réponse préparée garde sa puce « › », les élèves leurs initiales) : Paul n'a rien demandé d'autre.
3. Le récit, le papier, la réserve, le cahier de textes ne changent pas de texte.
4. Une dette de l'ordre ancien trouvée en route (§3.1) se règle dans ce mandat ; une dette d'autre chose s'écrit dans la NOTE, elle n'est pas réglée ici (la dette ① du 01/11, « tout par un dévoiler », se cadre avec Paul après son cours).
5. `APP_VERSION` ne se touche pas : la conscience la pose à la promotion.

## 5 · CE QUE TU NE TOUCHES JAMAIS
La production (`siteflow-io/monsieurjaipascompris`) ; la branche `main` du sas ; `redaction.html`, `correction_dictee.html` ; le vrai hub ; `AUDITS/`. Aucune donnée d'élève poussée.

## 6 · CE QUE TU LIVRES
Sur la branche `deroule/question-ordre`, chaque morceau poussé dès qu'il est fait : le code, la sonde, `LIVRAISONS/DEROULE-01-11/QUESTION-ORDRE/NOTE.md` (mission 0 ; ce que tu as trouvé au §3.1 ; chaque défaut trouvé et corrigé, avec sa cause ; les vérifications comptées dans le fichier de sortie, pas annoncées) et les sorties des bancs. Tu ne livres jamais avec une dette de ce mandat.
