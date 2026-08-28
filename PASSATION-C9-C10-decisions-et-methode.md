# PARTIE V — LES DÉCISIONS DE PAUL, DANS SES MOTS (ne les rouvre pas)
- **Le tableau** : « que le tableau survive à la fermeture d'une session classe — si je ferme l'atelier, si je ferme
  la page, que le tableau continue à tenir, le temps que je me reconnecte ». **Ne code aucun retour automatique à
  l'attente** : c'est un contresens qui a coûté un lot.
- **Adressage du tableau** : au patron du QCM — **un bouton qui ouvre une fenêtre**, pas un favori d'URL.
- **La trace** : « c'est l'horaire qui tranche… l'horaire doit être mentionné, aussi simple que ça : heure de tant
  à tant, puis heure de tant à tant ». Une trace = classe + jour + créneau. Deux heures dans la journée = deux traces.
- **Le bilan** atteste **la séance**, pas l'heure. Le système doit porter **les deux cas** : une séance sur plusieurs
  heures aujourd'hui, une heure = une séance demain.
- **Les fils du zoom** : « ils n'ont pas d'autre identité qu'une identité liée à l'écran père, et pas d'autre
  existence que celle de porter le zoom ». Jamais d'identité stable pour un fils.
- **Un écran dupliqué** : « devient un écran neuf par nature. Il obtient donc un nouvel id, c'est évident. »
- **La pulsation** : une seule, une couleur, dernier mot, dix secondes, saute au mot suivant dès la reprise.
  Couleurs successives, marques figées, défilement du tableau : **écartés**.
- **Le mur ajuste en direct** pendant la frappe — « l'élève peut voir rétrécir le texte sous ses yeux, à condition
  que le dernier mot tapé pulse ».
- **Réponse longue d'élève** : Paul **ouvre un second champ**. Le dézoom automatique et la coupure automatique sont
  **abandonnés**.
- **L'anticipation** : « il faut faire en sorte que ça n'arrive jamais ». Corollaire : ce qui pourrait se tromper de
  classe ou d'heure se vérifie **à l'écriture**, jamais à la lecture.
- **Aucun chemin ne doit laisser deux états coexister — par construction, pas par vigilance.**
- **Pas de création quand quelque chose existe déjà.** La règle la plus enfreinte du chantier.
- **Vérifier, ce n'est pas** « le chapitre n'a pas bougé », **c'est** « ce qui le porte n'a pas bougé et fait que le
  chapitre fonctionne ».

---

# PARTIE VI — CE QUE PAUL ATTEND DE TOI, MÉTHODE
- **Tu ne promeus jamais sans son mot**, isolé, portant sur la promotion.
- **Tu ne tranches pas à sa place** — mais quand il ne sait pas, **tu l'aides à trancher** : options nommées, ce que
  chacune coûte, ton avis motivé. Ne le laisse pas avec une question ouverte de plus : il y en a déjà trop.
- **Verdicts nets.** Soit ça va, soit ça ne va pas, soit tu ne sais pas.
- **Cahier vivant à chaque fin de message** : ce qui est en cours + la file exhaustive, jamais « inchangée ».
- **MEMO**, dernier mot, seul sur sa ligne.
- **Tests manuels** à la fin de chaque livraison, geste par geste, avec l'adresse complète.
- Français partout, y compris dans tes raisonnements.
- **R/A** = réponds et attends.

## Le banc — le parcours qui fonctionne, ne le cherche pas
Sers `index.html` en local : `document.body.classList.add('admin-mode')` · `SECU.valide=true` · masquer
`#page-validation` · `loadPublished('3e')` · puis **CLIQUER** : Panneau prof → Atelier → Mes chapitres → Modifier →
Déroulé.
**Pièges déjà payés** : garde `if(window.__hubPose)return` contre le double enveloppement de `fetch` · le cadre doit
être **visible et dimensionné**, sinon aucun débordement n'est mesuré · un viewport large ne déborde jamais :
travailler en **900×600**, les conditions de Paul · les gestes du menu contextuel s'appuient sur `ctxBloc` /
`ctxEcran`, à poser avant l'appel.

## Les dépôts
- Production : `siteflow-io/monsieurjaipascompris` — jeton fourni par Paul :
  `<<JETON — Paul te le donne au premier message>>`
- Sas : `siteflow-io/mjpc-chantier` — jeton (deux moitiés)
  `<<JETON — Paul te le donne au premier message>>` ⊕ `jcxiFfdUdVHciewRjiRS107u[JETON RETIRÉ — révoqué le 27/08/2026, voir la consigne de révocation]`
- Hub : `https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app` — **GET seulement**.
- Trame réelle de Paul : `/site/3e/chapitres/0/seances/0/deroule/ecrans.json`

## À lire, dans cet ordre, avant tout geste de fond
`docs/MJPC6-0-INDEX.md` · `docs/MJPC6-1-DISPOSITIF.md` · `docs/MJPC6-2-DOCTRINE.md` ·
**`docs/MJPC6-3-CHANTIER.md`** (le morceau « LE TEMPS DU COURS », décisions de Paul du 07/08) ·
`docs/MJPC6-journal.md` · **`OU-EST-CE-DEJA-ECRIT.md`** au sas · `PASSATION-C6-C7.md` §⑦ (la matrice actions × état,
pièce obligatoire de tout mandat) · `DEROULE/CADRAGE-TEMPS.md` · et **`docs/MJPC6-LECTURES.md`**, la dette de lecture
(25 / 111 à ma mort).

---
*Conscience n°9 — 24-25 août 2026. Sept promotions, une restauration, un inventaire complet de l'atelier, et plus
de trente fautes. Ne refais pas les miennes : elles sont toutes en Partie I.*
