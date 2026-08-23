# PHASE 0 — INSTRUCTION SUR PIÈCES : LA VUE TABLEAU ENTRE DEUX APPAREILS
Exécutant · 23/08/2026 · base v8.59.4 lue (1 392 070 o, md5 `0b4ad1c5752b3188190269a62ee0b064` = attendu) · moteur embarqué décodé depuis `AT_DR_B64` (229 960 o, 2 683 lignes) · hub lu en GET seul (0 écriture).

## ① COMMENT LA FENÊTRE TABLEAU ACTUELLE FONCTIONNE — STRICTEMENT LOCALE
- Ouverture : `tableau()` (moteur L2527) → `win=window.open('','TableauMJPC',…)` (L2533). La fenêtre est un document ÉCRIT par le pilote (`win.document.write(…)`, L2535+) : **une référence `win` du même navigateur, même session, même machine**. Ni postMessage, ni BroadcastChannel, ni URL : rien n'est adressable de l'extérieur.
- Synchronisation : `envoie()` (moteur L2624) — commentaire du moteur : *« POINT DE SORTIE UNIQUE vers le tableau. Toute commande nouvelle doit passer par ici, sinon elle contournerait le gel. »* Elle PEINT `win.document` directement (`t.innerHTML=html(n,true)`), affiche la participation (`peintQui()`), le chrono si le témoin est actif.
- **Le moteur annonce lui-même la cible** (en tête de `tableau()`, L2528-2531) : *« ⚠ ÉCART MAQUETTE / SITE n°1 : ici la fenêtre est PEINTE par le pilotage. Dans le site, ce doit être une PAGE AUTONOME (paramètre de vue, comme evaluation-qcm.html) qui garde son état et écoute le pilotage — condition pour survivre à une actualisation et pour vivre sur un autre appareil. »* L'architecture distante était prévue, jamais construite.
- Le site enveloppe `W.tableau` (index L14804-14820) uniquement pour compléter le bandeau d'attente (classe · chapitre · séance) — rien de distant.

## ② CE QUE `deroule_joue` CONTIENT EXACTEMENT (lu au code ; hub : AUCUN exemplaire réel — 3e/4e sans copie jouée, 5e/6e à l'ancien format liste)
Chemin : `/site/<niveau>/chapitres/<ch>/seances/<s>/deroule_joue/<classeSlug>`. Trois écrivains, trois moments :
1. **Au démarrage du cours** — `atDrJouer(classeSlug,classeNom)` (index L14509-14520) : `{ classe, demarreLe, ecrans:[copie de la trame] }` — une copie par classe, jamais réécrite par une trame modifiée ensuite.
2. **Pendant le cours, sur GESTE D'ÉDITION seulement** — crochet `W.sauve` (L14803) → `_drCopieAuto()` (L14456+) : ré-écrit `…/ecrans.json` = `DR.dr_exporterTrame()` (débounce 900 ms). ⚠ `sauve()` du moteur est la pile d'ANNULATION (L1508) : elle n'est appelée QUE par les gestes d'édition (ajouter, marquer, scinder…).
3. **À la clôture** — `atVecuEcrire()` (index L14440+) : `…/vecu.json` = `{classe, creneau, debutReel, finReel, minutesJouees, activites:[{n,act,prevu,reel,passages,comp}], decisions}`.
Et `dr_exporterTrame` (L14849) passe par `_drRefusionner` : *« l'artifice ne doit pas fuir dans la donnée »* — les écrans-fragments de projection sont RECOLLÉS à l'export.

## ③ CE QUI MANQUE POUR RECONSTITUER LA SCÈNE À DISTANCE — l'essentiel
**L'état de scène est 100 % mémoire locale du moteur, rien n'en sort jamais :**
- **l'écran courant `i`** : `va()`/`pas()` (L1446+) font `rendre()` — aucun `sauve()`, donc aucune écriture hub (le pont garde `AT_PONT.dernierEcran` en mémoire locale, L14799) ;
- **le dévoilement** : `devoile()`/`replie()` (L1516+) modifient `e.rev`/`b.vues` puis `rendre()` — jamais `sauve()` ;
- **le gel** : `gel()` (L1544) bascule `gele` local — `envoie()` s'arrête net si `gele` (*« le tableau garde son image »*) ;
- **la fiche ouverte** (`ficheOuverte=[écran,bloc]`), **le chrono** (`t`, témoin `bmon`), **la réglette** (`PT[iz]`) : locaux ;
- **la participation projetée** : `quiParle()` (L2505) bascule `quiOn` local ; `peintQui()` peint les PRÉNOMS (`prenom(o.i)` + compte `histoire(x).length`) dans la fenêtre — depuis `ELEVES` local.
Une page distante lisant `deroule_joue` seul n'aurait donc que la trame de départ et le vécu de clôture : **aucun jeu en cours**. Le chaînon manquant est un CANAL D'ÉTAT DE SCÈNE écrit par le pilote pendant le jeu.

## ④ LES INVARIANTS DE CLOISONNEMENT À PRÉSERVER (mesurés)
- **Le grisé professeur n'existe pas au tableau** : `html(n,pourClasse)` (L1512+) — la classe `apres` (éléments non dévoilés, grisés côté pilote) n'est ajoutée que si `!pourClasse` ; côté tableau, `rev`/`vues` BORNENT ce qui sort : le non-dévoilé est ABSENT, pas grisé. Réciproquement le tableau a ses habits propres (bandeau d'attente, animations d'arrivée) inconnus du pilote.
- **Rien de nominatif hors geste volontaire** : les prénoms n'atteignent le tableau QUE par la bascule `quiParle()` (bouton `bqui`), et `peintQui()` refuse si `gele`. Corollaire distant : la liste nominative ne doit transiter par le canal de scène QUE lorsque `quiOn` est vrai — jamais en continu.
- **Le gel est un contrat du point de sortie unique** : toute voie distante doit passer par l'équivalent d'`envoie()` (état gelé → l'image ne bouge pas), sinon elle contourne le gel.

## ⑤ MATIÈRE POUR L'ARBITRAGE (je ne code rien avant lui)
**Le canal d'écriture (côté pilote)** — le crochet existe déjà : `W.rendre` est enveloppé (L14794) et chaque geste de scène (va, pas, devoile, replie, gel→rendre) y passe. Un `_drSceneAuto()` jumeau de `_drCopieAuto` peut écrire un nœud LÉGER `…/deroule_joue/<slug>/scene.json` : `{i, rev, vues:{j:n}, gele, fiche:[n,j]|null, qui:(quiOn? {on:true, liste agrégée}:null), chrono:{on,txt}, ts}` (débounce ~300 ms ; latence cible tenue). Choix à trancher : la scène porte-t-elle la TRAME entière (autonomie totale de la vue, plus lourd) ou seulement les compteurs (la vue lit `ecrans` de la copie jouée + `scene` — deux lectures, léger) ?
**Le canal de lecture (côté ordi de classe)** — deux voies : ① **SSE natif RTDB** (`Accept: text/event-stream` sur l'URL REST — push serveur, latence quasi nulle, zéro SDK) ; ② **polling** 800-1000 ms (simple, < 2 s ✓). Les deux sont LECTURE SEULE strictes.
**L'adresse de la vue** — dans l'esprit du moteur (« comme evaluation-qcm.html ») : `index.html?vue=tableau&n=<niveau>&ch=<ch>&s=<s>&classe=<slug>` (aucun fichier nouveau, un boot conditionnel très tôt) — OU se caler sur `AT_DR_DERNIER`/un pointeur `coursEnCours` au hub pour une URL SANS paramètres (l'ordi de classe ouvre une adresse fixe, la vue trouve seule le cours actif : moins de frappe pour le professeur en début d'heure). Verrou de classe : le pointeur du cours actif (unique par professeur) règle « quel appareil lit quoi ».
**Dégradation** : hub muet → la vue AFFICHE « liaison perdue à HH:MM » sur l'image conservée (jamais un état périmé silencieux) ; scène absente → l'écran d'attente actuel (horloge + classe/chapitre/séance).
**Écritures pendant l'instruction : 0** (tout en GET).

**J'attends l'arbitrage de la conscience** (scène complète ou compteurs · SSE ou polling · URL paramétrée ou pointeur de cours · sort de la fenêtre locale K : inchangée dans tous les cas).
