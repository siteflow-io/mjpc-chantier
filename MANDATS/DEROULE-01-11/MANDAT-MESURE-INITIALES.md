# MANDAT — MESURER, SANS RIEN CORRIGER : LA CASE DES INITIALES, LE DÉVOILEMENT, LE GEL (C16 554)
*Conscience n°16, 04/11/2026 (lancé à 13:51). L'ordre : Paul, 04/11 13:50 : « Pour le reste, lance la mesure oui » ; 13:07 : « mesure, ne me crois pas sur parole » ; « Mesure aussi le moment du dévoilement ». Un seul exécutant, neuf, court. Mesure seulement : aucune ligne du site ne change.*

## 0 · CE QUE PAUL A DIT (ses mots ; les prénoms d'élèves retirés)
- **04/11 13:07** : « ce qui est pénible aujourd'hui c'est que le champ des initiales élève peut très bien accueillir du texte. Je me suis fait avoir plusieurs fois, j'ai tapé les initiales puis j'ai commencé à écrire et ça a écrit dans le champ élève. C'est dû à l'ordre de reconnaissance des initiales : actuellement ( mesure, ne me crois pas sur parole) je tape les initiales, puis je dois faire entrer et je passe au champ d'écriture et seulement quand je commence à taper, l'élève est reconnu ( s'affiche en vert en bas à droite ). […] Mesure aussi le moment du dévoilement. »
- **04/11 13:07** : « De plus après tes correctifs, je veux retrouver ma séance d'aujourd'hui avec son récit normal et que plus jamais ces cas n'arrivent. 544. Le gel: tu n'as pas donné de solution, si? »
- **04/11 13:50** : « 556. De ce fait je la reouvrirai, vu qu'elle est passée, et je ferai la même chose que ce matin sur la séance des Dylan. D'ailleurs, est ce que je devrai retaper toutes les réponses enregistrées ou pas? C'est un cas qui ne s'est pas présenté avec les Dylan vu qu'avec eux la séance n'avait même pas été jouée. Pour le reste, lance la mesure oui. Pour la tension mgc oui pour ta proposition. Le principe est que la case attend la totalité des initiales élève, quel que soit le mode de validation ( numérotation ou automatique une fois toutes les initiales tapées ). »
- **04/11 12:45** : « Pour tab d'ailleurs, quand je cliquais dessus le curseur allait dans le champ du titre d'activité. »
- **04/11 03:22, 03:30** : exécutants courts ; la supposition de la conscience se vérifie avant d'agir ; économe.

## 1 · CE QUE TU MESURES (sur la 8.84.0-⑰ en ligne ; par le geste, au clavier, à vitesse humaine : 120 à 200 ms entre deux touches)
Dans une vraie heure (pas une répétition) de la classe inventée des 3 Franklin, sur une diapo à question (« Groupe 1 : l'hypothèse »), au pilotage, la ligne de réponse :
1. **La case des initiales** : ce qu'elle accepte (minuscules, chiffres, une phrase) ; ce qu'elle fait d'initiales tapées en minuscules.
2. **L'ordre de reconnaissance** : après les initiales, Entrée puis Tab : où va le curseur ; quand l'élève est reconnu (le vert en bas à droite) : à la frappe des initiales, à Entrée, à la première lettre de la réponse ; ce qui arrive si Paul tape les initiales puis enchaîne la réponse sans Entrée (où va le texte).
3. **Le moment du dévoilement** : quand le tableau des élèves (le tableau distant) montre l'élève et sa réponse : à chaque lettre, à Entrée, au geste « dévoiler », au dégel ; ce qu'il montre de l'élève (initiales, prénom, nom).
4. **Le gel** : le tableau gelé, Paul passe à la diapo suivante au pilotage, y tape deux réponses, dégèle : ce qui arrive au tableau, au journal de l'heure (`reponse`), dans le récit.
5. **Une heure jouée et close, avec ses réponses (comme celle des Franklin)** : peut-on la rouvrir, ou la rattraper comme les 3 Dylan (« ▶ Rattraper cette heure ») ? Si oui, les réponses déjà tapées y sont-elles encore, ou faut-il les retaper ? Dans cette heure rouverte, ou dans la Relecture après l'heure, peut-on changer l'élève d'une réponse (une réponse donnée au mauvais MB, une réponse rattachée à personne) ? Comment, et ce que le récit en garde.
Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le codes pas.

## 2 · LA SUPPOSITION (lue par la conscience dans le code et au hub ; À VÉRIFIER)
- 1-2 : la ligne de réponse (dr-classe, `dit.onkeydown`, assemblé l. 19699 environ) ; `dr_iniExact`, `dr_iniSeul`, `dr_candidats` ; le `_garderFocus` après Entrée (`quoi: 'ini'`). Paul dit : l'élève n'est reconnu qu'à la première lettre de la réponse.
- 3-4 : le journal d'une réponse se fait dans `pousser(et)` (l. 18283 environ), seulement si le tableau était déjà sur la même diapo (`av.di === et.di`) ; au dégel, il arrive d'une autre diapo : rien n'est écrit (au vrai hub, l'heure des Franklin du 04/11 : 24 réponses dans les diapos, 2 au journal, les 22 autres tapées pendant un gel). Le récit lit les réponses dans le journal (`repsJ`).
- 5 : lu dans le code : une heure close « ne se rouvre pas » (`atInfo('L’heure de … est déjà close aujourd’hui : elle ne se rouvre pas…')`) ; « ▶ Rattraper cette heure » (`data-rattraper`) n'est proposé que pour une « Case passée sans heure jouée » (`c.nature==='passee'`, l'emploi du temps). Changer l'élève d'une réponse après l'heure : je ne sais pas.

## 3 · LA PREUVE (au faux hub rangé comme le vrai ; courte ; comptée)
Ta base : la 8.84.0-⑰ = l'assemblé de `deroule/heure-reelle` `46d140ab6` (md5 `8d17922b…`) avec la seule ligne de version `8.84.0-⑰` ; la production a le md5 `c6b75c7a8a4fd99de7b2d156f6af4944`. Pars de la sonde de la mesure précédente (`mesure/franklin` `f42fc52e9`, `LIVRAISONS/DEROULE-01-11/MESURE-FRANKLIN/sonde-franklin.mjs` : la classe inventée, deux MB) ; ajoute à la liste inventée deux élèves au nom de famille en deux mots (« NOM1 NOM2 Prénom »). Une sonde `LIVRAISONS/DEROULE-01-11/MESURE-INITIALES/sonde-initiales.mjs` et une NOTE courte : pour chacun des cinq points, ce qui se passe, compté, au temps près, et la ligne de code qui le fait.

## 4 · LES RÈGLES
- Ton dossier : `git worktree add -b mesure/initiales <dossier> 46d140ab6`, puis `git checkout f42fc52e9 -- LIVRAISONS/DEROULE-01-11/MESURE-FRANKLIN/` ; tu pousses sur `mesure/initiales` seulement.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est mesuré, tu t'arrêtes et tu le dis). **Économe**.
- Tu ne changes aucun fichier du site (`dr/*.js`, l'assemblé) ; tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `redaction.html`, `/redactions`, `correction_dictee.html`. Aucun vrai nom d'élève dans ce que tu pousses.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre (moins de 6 Go libres) ; ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`). Ce qui n'est pas mesuré n'entre pas dans la NOTE.
