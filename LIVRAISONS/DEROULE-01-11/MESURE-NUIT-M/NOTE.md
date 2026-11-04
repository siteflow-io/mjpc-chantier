# MESURE M — LA NUIT DU 04/11 (C16 633, 634) — mesuré, rien corrigé

Le site de la nuit : `dbe59dc88`, assemblé `68ee03b0050fc73c15d0bc9f15ae7924`. Pour comparer : le site d'avant le correctif ㉙ (`3d2815886^`, assemblé `1a16c98fb84d3b410b0357014c636543`). Faux hub rangé comme le vrai, à 1536×864. La sonde : `sonde-mesure-m.mjs`. Les sorties : `sorties/`. Aucune ligne du site n'a changé.

## 1 · (633) D'où viennent « BLOC 1 · QUESTION · 1 ÉLÉMENT… » dans une consigne
1. **Ce qui dessine les mots** : la barre du bloc, `dr-atelier.js:643` (`poserBarreBloc` : `BLOC ${b.bi + 1} · … · ${n} ÉLÉMENT…`, puis `conteneur.appendChild(barre)`). Elle se pose au clic dans un texte, seulement dans l'Atelier (`dr-atelier.js:629`, `if (!S.atelier) return`).
2. **Le geste qui les faisait ranger : cliquer dans la question d'un bloc question, puis écrire.** Avant ㉙, le bloc où se pose la barre était cherché avec `x.closest('ul, ol, .bloc, p')` (ancien `dr-atelier.js:592`). Or la question est elle-même un `<p>` : la barre se posait donc DANS le texte, et la frappe suivante l'enregistrait avec lui. Compté sur le site d'avant ㉙ :
   - geste 1 (l'Atelier, hors de l'heure, on écrit « Et vous ? ») : la barre est dans la question ; les mots de la barre entrent 1 fois dans la trame (1 écriture sur 4, à `…/deroule/ecrans/7`) ;
   - geste 2 (l'heure lancée par la case de l'emploi du temps, l'onglet Atelier ouvert pendant l'heure, la même frappe) : ils entrent 1 fois dans **la copie de la classe** (1 écriture sur 11, à `…/deroule_joue/<la classe>/etat`). C'est le cas de Paul ;
   - geste 3 (on glisse depuis la barre, ou du début de la question jusque sous le bloc, puis Ctrl+C et Ctrl+V) : la sélection et le presse-papiers ne portent jamais les mots de la barre (0 sur 2) ; ils entrent quand même 1 fois, parce que le geste commence par un clic dans la question.
3. **Le site de la nuit** : avec les mêmes gestes, les mots entrent **0 fois** (0 dans la trame, 0 dans la copie de la classe, 0 au copier-coller ; chaque frappe « Et vous ? » est bien enregistrée 1 fois). Ce qui l'empêche :
   - `dr-atelier.js:629` cherche le bloc au-dessus du texte (`x.parentElement.closest(…)`) ;
   - `dr-atelier.js:607` (`dr_texteEcrit`) retire la barre de ce qui s'écrit, et `dr-atelier.js:403` (la copie de la classe) passe par lui ;
   - un clic enfoncé sur la barre ne commence pas de sélection (`mousedown` → `preventDefault`, `dr-atelier.js:643`).
4. **Un texte déjà sali** n'est pas réparé tout seul : « À régler » le signale (`dr-atelier.js:194-198`, `DR_MOTS_BARRE`).
5. Je ne sais pas quand la copie de Paul a été salie : ce n'est pas mesuré. Le correctif ㉙ date du 02/11 12:40 (`3d2815886`).

## 2 · (634) Le tableau distant, le double clic, la taille
1. **Le tableau distant `?vue=tableau`** : il n'a pas d'écouteur de double clic. C'est le **premier** clic, toucher ou touche qui demande le plein écran du navigateur : `dr-tableau.js:346` (sur `pointerdown`, `keydown` et `touchstart`, posé seulement hors de la fenêtre locale), puis `dr-tableau.js:324-328` (`dr_tabPleinEcran`). Compté :
   - double clic : 2 demandes, le navigateur passe en plein écran ;
   - Échap : on sort du plein écran ;
   - ensuite un seul clic : 3e demande, retour au plein écran ;
   - Échap puis une touche : 4e demande, retour au plein écran.

   Donc, dès que Paul clique ou tape dans la page, le tableau repasse en plein écran, c'est-à-dire à la taille de tout l'écran.
2. **Hors du plein écran, le tableau suit la taille de la fenêtre** (`dr-tableau.js:367` : il se redessine quand la fenêtre change de taille). Compté :
   - fenêtre réduite à 900×500 : tableau 889×500, rien ne dépasse ;
   - fenêtre remise à 1280×720 : tableau 1280×720.

   Le code n'impose aucune taille à cette page : on n'y trouve ni `resizeTo` ni `moveTo`.
3. **La fenêtre « Ouvrir le tableau »** (`?vue=tableau&local=1`, ouverte en 1100×640 par `dr-tableau.js:48`) : le double clic fait 0 demande de plein écran. Réduite à 800×450, le tableau fait 800×450 et rien ne dépasse.
4. Ce que je ne sais pas (non mesuré, le navigateur de la sonde n'a pas de fenêtre réelle) : le geste d'attraper un bord de la fenêtre avec la souris. Ce geste n'est pas un événement de la page, donc le code ne le reçoit pas.
5. Utile en plus (non codé) : déborder d'une image mal calibrée ne se règle pas en réduisant la fenêtre, puisque chaque geste remet le plein écran. Une marge (ou un zoom) du tableau réglée depuis le pilotage le réglerait, et cela suit la règle « le tableau est figé, il se pilote depuis le pilotage ».
