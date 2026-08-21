# OÙ EST-CE DÉJÀ ÉCRIT — carte de lecture pour ne PAS faire répéter Paul
*Conscience n°7 → n°8, 21/08/2026. Chaque point ci-dessous, Paul a dû me le réexpliquer alors qu'il était **déjà** documenté. Avant toute question de fond, chercher ICI.*

---

## LES POINTS SUR LESQUELS J'AI FAIT RÉPÉTER PAUL (ne pas recommencer)

**① « L'éditeur du déroulé et le déroulé en classe ne sont pas la même chose. »**
→ `PASSATION-C6-C7.md` §« Architecture à trois objets » : *trame de référence au niveau · séance jouée par classe (copie au démarrage) · remontée par geste explicite. **Rien ne circule entre classes.*** Et `DEROULE/CADRAGE-TEMPS.md` (même formulation).
**Conséquence** : en PRÉPARATION on édite la trame et on peut voir le rendu tableau (l'équivalent du F5 de PowerPoint) ; le suivi (participation, temps, récit) **n'existe qu'en classe** ; on peut éditer **en direct** pendant le cours, et ces modifications restent attachées à cette classe.

**② Le temps — le canon worktrack.**
→ `DEROULE/CADRAGE-TEMPS.md` §2 : cours = **objet partagé `{debut,fin}`** écrit au lancement · la clôture gèle les chronos et **ne touche pas au statut des séances** · la séance porte son statut (`à faire · en cours · terminée`) · **chrono accumulé et pausable** (`accumMs`+`runSince`) · **quatre états** (dans les temps · il te reste peu, 80 % · tu dépasses · terminée) · **alerte T-5 non bloquante**, réarmée à chaque cours.
**Écart avec worktrack** : ici la **fin est connue de l'EDT et ne bouge pas** (donc pas de règle de vraisemblance). **Temps utile = fin − lancement − 5 min** (les cinq dernières appartiennent à l'agenda). Exemple du document : lancée **10h14** pour une fin à **11h02** → **43 minutes**. Le retard recalcule tout ; le site **montre le débordement, ne le résorbe jamais**.
**EDT 2026-27** : 08:00-08:55 · 08:57-09:52 · 10:07-11:02 · 11:04-11:59 · 13:00-13:55 · 13:57-14:52 · 15:07-16:02 · 16:04-16:59 (deux minutes entre certaines : le déroulé de l'une ne doit pas contaminer l'autre).

**③ Le T-5 et ses quatre choix.**
→ `DEROULE/CADRAGE-TEMPS.md` §5 : le bandeau **ne coupe rien** ; par activité restante : **reporter · donner à la maison · annuler · ne rien donner**, chacun avec son coût. **Ne pas confondre** : *reporter une activité* (progression modifiée) ≠ *ne pas avoir fini* (la séance reste ouverte).
**Correction de Paul (21/08)** : ne **jamais** loger ce bandeau dans la scène (il l'écrase) → appel discret + **modale**, qui **nomme l'activité, en donne un extrait et NOMME les notions** qui ne seront pas travaillées. « coût : 2 compétences » est **obscur** : proscrit.

**④ Le rendu complet qui fait perdre sa place — c'est écrit DANS le code de production.**
→ `index.html`, marqueurs `[LOT1-①]` : « **sélection seule — plus de rendu complet ici** » · « un défilement POSÉ ne vaut pas un suivi » · « pas de suivi juste après un geste ».
**Règle** : un clic dans une colonne **déplace le halo**, ne reconstruit jamais. **Se prouve** par l'identité du nœud DOM avant/après le geste (mesure, pas estimation). Paul a affronté ce problème « régulièrement » : ne pas le lui refaire vivre.

**⑤ Le tableau.**
→ En-tête de `deroule86.html`, **écart n°1** : *« la fenêtre tableau est peinte par le pilotage ; dans le site, ce doit être une PAGE AUTONOME (paramètre de vue, comme `evaluation-qcm.html`) qui garde son état et écoute le pilotage — condition pour survivre à une actualisation et pour vivre sur un second appareil. »*
**Vocabulaire vérifié avec Paul** : *écran de pilotage* = ce que lui seul voit (privé, mode **prompteur** : il montre l'écran suivant) ; *tableau* = la surface projetée au mur (public) ; *tableau autonome* = qui tient debout seul → permet le **gel total**. En préparation, « voir en grand » **est** la vue tableau, en aperçu.

**⑥ Ce que Paul veut de la rétro-ingénierie.**
→ `PASSATION-C6-C7.md` (chaîne activité → temps → alerte → profil) et décision du 21/08 : le moteur calcule `h` depuis les durées **prévues** — il ne dit **rien** du vécu. Il faut donc enregistrer à part, dans `deroule_joue/<classe>/vecu` : **début et fin réels**, **temps réel par activité**, passages, notions, **décisions du T-5**. Sans cela l'IA ne comparerait que du prévu à du prévu et ne pourrait jamais dire « cette séance était trop chargée ».
**Notions stockées en CODE** (`c4-culture-02`), **jamais en libellé** → doctrine « **id opaque immuable / libellé séparé** » (`MJPC6-2-DOCTRINE.md`) : l'historique survit aux réformes de programmes. Les libellés se résolvent à l'affichage, en lisant `taxonomie_atelier.json`.

**⑦ Les écrans sont des OBJETS, jamais du code en dur.**
Un écran vit dans `seances[<n>].deroule.ecrans`, en **JSON pur**. C'est **exactement** là que l'IA écrira, au chantier des prompts. Tout décor d'essai doit être posé au même endroit, dans la coiffe jetable — **jamais** écrit dans le code du site.

**⑧ Le principe directeur des applications.**
→ `MJPC6-2-DOCTRINE.md` : **souplesse + usage épuré** ; la **décharge cognitive** prime sur la richesse fonctionnelle apparente. Et pour le pilotage : **le professeur a TOUS les droits, il ne doit JAMAIS être bloqué** — on avertit, on ne refuse pas (règle née de `pilotage_debat_s3`).

---

## OÙ CHERCHER, PAR SUJET
| Sujet | Document |
|---|---|
| Le dispositif du trio, les règles de livraison, la navette | `docs/MJPC6-1-DISPOSITIF.md` |
| Doctrine du site, taxonomie, id opaque, halo, notation | `docs/MJPC6-2-DOCTRINE.md`, `docs/MJPC6-doctrine-du-site.md` |
| État des chantiers, lots | `docs/MJPC6-3-CHANTIER.md` |
| Ce qui s'est passé, jour par jour | `docs/MJPC6-journal.md` |
| Bugs connus et corrigés | `docs/MJPC6-registre-bugs.md` |
| Le temps, l'EDT, le T-5, la chaîne des compétences | `DEROULE/CADRAGE-TEMPS.md` (sas) |
| L'architecture de l'intégration (4 vues, colonne, 2 couches) | `DEROULE/CADRAGE-INTEGRATION.md` (sas) |
| Ce qui a échoué et pourquoi | `PASSATION-C7-C8.md` + `T1/⛔-ABANDONNE-NE-PAS-UTILISER.md` (sas) |
| La maquette du déroulé, ses écarts déclarés | en-tête de `DEROULE/deroule86.html` (sas) |

---

## OUTILLAGE — CE QUI M'A FAIT PERDRE DU TEMPS

**Le banc navigateur fonctionne sans autoriser aucun domaine** : Chromium est déjà présent.
```js
const c = require('@sparticuz/chromium'); const chromium = c.default || c;
const puppeteer = require('puppeteer-core');
const b = await puppeteer.launch({
  args:[...chromium.args,'--disable-popup-blocking'],
  executablePath: await chromium.executablePath(),
  headless:'shell', defaultViewport:{width:1450,height:950}
});
```
**Pièges, tous rencontrés** :
- intercepter les requêtes : laisser passer `file://` et `data:`, répondre 200 `null` à `firebasedatabase.app`, abandonner le reste ;
- `page.on('dialog', d=>d.dismiss())` — sinon les modales figent le banc ;
- **ajouter `?n=3e` à l'URL**, sinon l'écran de garde « Lien invalide » (le code lit `n` dans `location.search`) ;
- l'entrée prof se vérifie par **empreinte lue au hub** : si on bloque les lectures, on obtient « aucune empreinte prof posée » — bloquer **les écritures seules** ;
- `#at-zone` est **cachée** : remonter ses parents et forcer `display`/`opacity`/`visibility` avant toute capture, sinon **on photographie la page d'accueil** (m'est arrivé) ;
- masquer les bandeaux « lien invalide » qui recouvrent l'écran ;
- injecter `chapitresData['3e']['10']` et `window._lvlClasses` **avant** `atEditerChapitre` ;
- un écran valide porte `{act,h,dur,comp,blocs}` et chaque bloc son type : `consigne{txt,pic,etapes,vues}` · `question{q,reps[{i,r,refo}]}` · `fiche{tt,titre,def,corps}` · `schema{forme,titre,src,pos,z}` · `image{support,ref,legende,marques}`. Un bloc mal formé fait planter `dr_chargerTrame`.

**L'OUTIL QUI M'A LE PLUS MANQUÉ** — un **banc COMPARATIF** : jouer la **même séquence de gestes** sur `deroule86.html` d'origine ET sur le montage, puis comparer les **données** (écrans, blocs, dévoilements) et les **classes du DOM** normalisées. Il a prouvé en une fois ce que dix correctifs n'avaient pas montré : le moteur était sain, l'écart était ailleurs. **À écrire AVANT le premier correctif, pas après le dixième.**

**Contrôles mécaniques à garder** (ils ont attrapé de vraies fautes) :
- toute fonction appelée par un gestionnaire du HTML **doit** être exportée (comparer les `DR.x(` du DOM aux clés de `window.DR`) ;
- aucun gestionnaire ne doit appeler une fonction du bloc **sans** son préfixe ;
- les ids **écrits** (`el.id='…'`) doivent suivre la même convention que les ids **lus** ;
- le CSS d'une fenêtre secondaire doit utiliser les **mêmes classes** que le HTML qu'on y écrit.

MEMO
