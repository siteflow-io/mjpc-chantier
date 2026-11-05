# AUDIT GLOBAL — PARTIE I : LES SESSIONS EN DIRECT (auditeur I, conscience n°16, 03/11/2026)

*Mandat : `MANDATS/DEROULE-01-11/MANDAT-AUDIT-GLOBAL.md` §2. Rien n'est changé au site. Le fichier mesuré : la production 8.81.1-⑭-micro (`promo-8812/index.html`, md5 `c21ddbb656b9028cf11b0d70f7b18318`, 28 628 lignes). Les numéros de ligne ci-dessous sont ceux de ce fichier.*

*La sonde : `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/sonde-audit-I.mjs` (ce dossier). Le harnais de `SESSION-PARTOUT/sonde-session.mjs` (le faux hub rangé comme le vrai, qui refuse les clés interdites et pousse son flux), avec la montre du navigateur (`MJPC_HORLOGE=date` de la frappe au tableau : seule la date est décalée au 14/09 09:00 ; les minuteries sont celles du navigateur, jamais `page.clock`). Plusieurs appareils = plusieurs contextes de navigateur séparés (l'ordinateur du pilote 1536 × 864, un second ordinateur 1366 × 768, le tableau distant `?vue=tableau` 1280 × 720, le téléphone 390 × 844 tactile) ; « même appareil » = deux onglets d'un même contexte. Les résultats bruts : `sorties/audit-I.jsonl` et `sorties/sonde-audit-I-*.txt`. Les captures (écran entier) sont dans le scratchpad de la conscience, `c16-audit-I/captures/` (pas au dépôt). Aucun nom d'élève ici : « ÉLÈVE n » = le n-ième de la liste de la classe.*

*Dans le faux hub, la classe de MJPC des « 3 FRANKLIN Aretha » s'appelle « 3E Charles de Gaulle » (la grille la range ainsi : `classeMjpc`) — c'est elle qui joue le rôle des 3 FRANKLIN ARETHA ici. Les cases des « 3 DYLAN Bob » sont rattachées, en mémoire, à « CLASSE TEST » (une classe de 3e du faux hub) pour avoir « une autre classe ».*

---

## LES RÉPONSES, EN UNE PHRASE CHACUNE (mesurées ; le détail suit)

1. **Les télescopages (㊶)** : le tableau distant ne réserve rien ; il suit toujours la session la plus haute de l'ordre « vraie heure > répétition > mode test », relu toutes les 3 s. Sur 16 couples même séance (deux appareils), **5 prennent le tableau à la session qui jouait sans rien lui dire**, 2 se mêlent sur la même adresse (essai et répétition en mode test) avant de laisser le tableau à l'horloge pendant que l'autre joue encore, 3 jouent sans tableau sans le savoir, 2 sont refusés en le disant (« tableau distant pris »), 4 rejoignent la même session. Une autre séance ou une autre classe de la même sorte ouvre **une modale aux trois boutons « undefined » qui ne lance ni ne rejoint rien (4 sur 4 : Paul est bloqué)**. Un onglet fermé ou un ordinateur en veille **ne libère jamais le tableau avant 4 h**, et une vraie heure abandonnée garde son image pour toujours.
2. **Le minuteur (㉔ ㉕ ㉖ ㉗ ㊵)** : « Ce que voit la classe » ne le montre pas. Au tableau, il couvre du texte sur 7 des 26 diapos·crans de l'heure 1. Il est en monospace vert-jaune-rouge sur noir, quand le site est en Garamond or sur brun. Son panneau se pose entier sur la diapo du pilote (13 661 px², 3 sessions sur 3). À montres égales, les quatre affichages sont d'accord à 25 ms près ; **à montres différentes, pilote et télécommande diffèrent exactement de l'écart des montres (3 s mesurées)**, et la fenêtre du tableau et le tableau distant n'affichent pas le même chiffre.
3. **La participation (Paul, 12:42)** : en répétition, les pastilles sont toujours celles de la « classe test » (la clé « 3E Charles de Gaulle »), quelle que soit la classe répétée. Dans les trois sessions, des initiales absentes de la liste vont, à Entrée, au premier élève qui a les mêmes lettres (même inversées) ou dont le prénom commence ainsi, et cet élève passe au vert. Sur de vraies listes, cela touche 17 à 36 % des élèves d'une autre classe.
4. **Le réseau très lent (C16 303)** : pendant 30 à 36 s, rien ne dit à Paul que l'heure part. Il voit le Panneau prof « aucune session », puis un écran noir, puis le pilote « aucune heure lancée ». Un second clic sur le bouton est impossible (le bouton a disparu) ; un ▶ pendant l'attente est perdu au lancement ; « Fermer l'atelier » lance l'heure sans pilote à l'écran.

---

## 0 · LES RÈGLES DU CODE (lues avant de mesurer)

### 0.1 Où vit chaque session au hub
| Session | L'annonce (« le pointeur ») | L'image du tableau (scène, copie) | L'état vivant (`vif`, le repilotage) | Écrit par |
|---|---|---|---|---|
| Vraie heure | `/site/cours_actif` (l. 20474, `dr_coursEcrire`) | `C/scene`, `C/ecrans` (C = `/site/3e/chapitres/<ch>/seances/<s>/deroule_joue/<classe>`) (l. 21603, 23052) | `C/vif` (l. 22983) | `dr_ecrire` (le transport du site) |
| Essai en mode test | `/site/tableau_test/pointeur`, `quoi:'heure'` (l. 21634-21636) | `/site/tableau_test/scene`, `/ecrans` (l. 21639-21651) | `/site/tableau_test/vif` (l. 22982) | `dr_ttEcrire` (un `fetch` direct, l. 21617) |
| Répétition | `/site/repetition/pointeur` (l. 19627) | `/site/repetition/scene`, `/ecrans` (l. 19629-19631) | `/site/repetition/vif` (l. 22979) | `dr_repEcrire` (l. 19612) |
| Répétition en mode test | `/site/tableau_test/pointeur`, `quoi:'repetition'` (l. 19624 → 21628) | `/site/tableau_test/scene`, `/ecrans` — **les mêmes que l'essai** | `/site/tableau_test/vif` — **le même que l'essai** | `dr_ttEcrire` |

### 0.2 Ce que suit le tableau distant (`?vue=tableau`)
- `dr_tabLirePointeur` (l. 21884-21886) lit, dans cet ordre : `/site/cours_actif`, puis `/site/repetition/pointeur`, puis `/site/tableau_test/pointeur`, et prend **le premier « frais »** (`ts` de moins de 4 h, `4 * 3600 * 1000`). Il relit toutes les 3 s (`sesTabVeillePointeur`, l. 24369, posé par `dr_tabMonter` l. 21907) et change de cours dès que la clé change (`sesTabCle`, l. 24368).
- Donc, au tableau distant : **une vraie heure passe toujours devant ; une répétition (hors mode test) passe devant l'essai et la répétition en mode test.** Aucune session ne « réserve » le tableau : c'est un ordre de priorité, relu toutes les 3 s.
- Un pointeur n'a pas de battement : son `ts` est posé une fois au lancement (l. 20474, 19623, 21634). Rien ne le rafraîchit tant que la session joue ; rien ne le retire quand l'onglet se ferme (l. 23285-23286 : « fermer l'onglet sans clore ne l'écrit jamais : l'heure reste déclarée et le tableau garde son image (LOT B ③) »).
- Le pointeur retiré ou périmé : pour une vraie heure, **l'image reste** au tableau (l. 24371 : « plus de cours : l'image RESTE (relance C3) ») ; pour une répétition (ou le mode test), le tableau revient à l'horloge (même ligne, `SES.ctx.repetition`).
- Une scène n'est montrée que si elle est plus récente que la dernière montrée (l. 21931) : deux appareils qui écrivent la même scène se relaient au tableau, le plus récent gagne.

### 0.3 Ce que vérifie chaque lancement avant de partir
| Lancement | Ce qu'il lit avant | Ce qu'il fait si quelque chose joue |
|---|---|---|
| Vraie heure (`dr_lancer`, enveloppe l. 23312-23328) | `/site/cours_actif` seulement (l. 23323) | une autre heure fraîche, pas la même, pas close → la modale `dr_sesDemander` (l. 23325) ; **ni la répétition ni l'essai ne sont lus** |
| Essai en mode test (même enveloppe, l. 23317-23321) | `/site/tableau_test/pointeur`, seulement s'il dit `quoi:'heure'` | le même essai → il le rejoint ; un autre essai → la modale ; **une répétition en mode test (`quoi:'repetition'`) n'est pas vue : l'essai part et réécrit le même pointeur (l. 21636)** ; ni `cours_actif` ni `/site/repetition` ne sont lus |
| Répétition (`lancerRepetition`, enveloppe l. 23391-23402 ; puis `dr_repTableauDebut` l. 19616-19628) | son pointeur à elle (`/site/repetition/pointeur`, ou en mode test `/site/tableau_test/pointeur` s'il dit `quoi:'repetition'`), puis `/site/cours_actif` | la même séance (niveau, chapitre, séance — **la classe n'est pas comparée**, l. 23394) → il la rejoint ; une autre répétition → la modale ; une vraie heure fraîche → « tableau distant pris : … est en cours » dans l'en-tête et **aucun pointeur écrit** (l. 19621) ; **un essai en mode test n'est pas vu** |
- La modale `dr_sesDemander` (l. 23329-23335) passe ses trois boutons à `atModaleChoix` sous la forme `{ label, title, prim, action }` ; `atModaleChoix` (l. 14654-14672, sa seule définition) lit `b.lib` et `b.fn`. Mesuré au §1 : ce que Paul voit et ce que fait un clic.

### 0.4 Le minuteur (lu)
- La fin (`fin`) est posée à l'horloge de l'appareil qui fait « Départ » (`dr_minuteurDepart`, l. 20747 : `fin: Date.now() + d`) ; elle part aux autres pilotes dans l'état vivant (`dr_sesPhoto`, l. 22999) et chaque pilote (la télécommande comprise) affiche `fin − Date.now()` **à sa propre montre** (l. 20707 ; télécommande l. 23596 de `dr_tcMaj`). Aucun recalage entre deux montres de pilotes.
- Le tableau distant, lui, se recale sur l'horloge du pilote (`dr_tabMinutRecevoir`, l. 21980-21983 : l'écart le plus grand vu entre l'heure du pilote à l'envoi et l'heure du tableau à la réception).
- Au tableau : `#dr-tab-minut`, en position absolue en haut à droite du cadre 16:9, `z-index:20`, police `ui-monospace, Menlo, Consolas, monospace` en gras, 5 % de la largeur, fond noir `#000`, chiffres or `#d4a017`, coins `.14em` (l. 21781-21783). Il ne connaît pas le texte de la diapo.
- « Le tableau, en ce moment » au pilote (`vueDroite`, l. 18308-18310) rend la diapo seule (`rendre(inner, copie)`) : le minuteur n'y est pas (il n'existe que dans la page du tableau, l. 21770).
- Le panneau du ⏱ au pilote (`dr_minuteurPanneau`, l. 20738-20743) : `position:fixed; z-index:9000` (l. 16558), posé 8 px au-dessus du bouton ⏱.

### 0.5 La participation (lu)
- La liste des pastilles est `ELEVES`, remplie par `dr_classe()` (l. 17315-17323). **En répétition, c'est la liste de la « classe test » (`dr_classeTest`, l. 17314 : la classe dont la clé ou le nom est « 3E Charles de Gaulle », sinon le nœud « CLASSE TEST »), quelle que soit la classe de la séance répétée.** Hors répétition : la classe de l'heure (`AT_DR_COURS.classeSlug`), sinon la classe proposée.
- Les initiales tapées dans une ligne de réponse (`brancherAjout`, l. 19663-19669) : à la frappe, l'élève est pris s'il n'y a **qu'un** candidat dans la liste ; à **Entrée ou Tab**, le **premier** candidat est pris (l. 19667). Les candidats (`dr_candidats`, l. 19694-19698, la définition qui l'emporte) : les initiales exactes ; sinon les mêmes lettres dans un autre ordre (« TM » trouve « MT ») ; sinon le début des initiales ou du prénom.
- Le vert (`participation`, l. 19716-19723) : un élève de la liste à qui une réponse est attribuée (`r.eleve`), ou dont les initiales (`r.i`) sont celles de la réponse (`histoire`, l. 19704).

*(Les mesures suivent, partie par partie.)*

---

## 1 · LES TÉLESCOPAGES (㊶) — mesuré le 03/11 de 13:08 à 13:45

*Par le geste, à chaque fois sur un faux hub neuf : le tableau distant ouvert d'abord (`?vue=tableau`, un autre appareil) ; **A** lance sa session (une vraie heure par la case de l'emploi du temps « ▶ Ouvrir le pilotage et lancer » ; un essai = la même chose en mode test ; une répétition = l'Atelier, l'onglet « Pilotage » ; en mode test, pareil) et dévoile deux fois ; **B** (un autre ordinateur, ou un autre onglet du même navigateur) ouvre le site, puis lance la sienne par le même geste et dévoile deux fois ; A dévoile deux fois ; B s'arrête (« ■ Arrêter » ou « Clore l'heure ») ; A dévoile deux fois ; A s'arrête. À chaque étape : qui le tableau distant suit (l'identité de l'appareil dans la scène montrée, `origine`), ce que dit chaque appareil, ce qui s'écrit au hub (chemins comptés). « Même séance » : la case 14/09 08:57 des 3E Charles de Gaulle, séance 1 ; « autre classe » : la case des 3 DYLAN (CLASSE TEST) le même jour ; « autre séance » : la répétition de la séance 2. H = vraie heure, T = essai en mode test, R = répétition, RT = répétition en mode test. Brut : `sorties/audit-I.jsonl` (partie Q1), `sorties/sonde-audit-I-q1b.txt`.*

### 1.1 Deux appareils, même séance, même classe (16 combinaisons, A puis B)
| A puis B | Le geste de B (sur la case, ou l'onglet « Pilotage ») | Le tableau distant suit | Ce que disent A et B | Quand B s'arrête | B écrit au hub |
|---|---|---|---|---|---|
| H + H | la case dit « ▶ Reprendre l'heure » : B **rejoint** la même heure | le dernier qui agit (B, puis A) | « Un autre ordinateur a la main » chez celui qui ne l'a pas | B clôt : clos partout, tableau à l'horloge | les chemins de l'heure (`C/…`, `/site/cours_actif`) |
| H + T | en mode test, la case dit « ▶ Reprendre l'heure » : **B devient un essai qui copie l'heure** (« Heure reprise ») | A | A et B : « ● session » ; rien ne dit à B que son essai n'est pas au tableau | A garde le tableau | `/site/tableau_test/{pointeur, scene, ecrans, vif}` |
| H + R | répétition | A | B : « tableau distant pris : 3E Charles de Gaulle est en cours » | A | rien |
| H + RT | répétition en mode test | A | B : « tableau distant pris : … est en cours » | A | rien |
| **T + H** | « Ouvrir le pilotage et lancer », **sans modale** | **B — l'essai de A perd le tableau** | **rien chez A** (« ● session ») | le tableau **revient à l'essai de A** | les chemins de l'heure |
| T + T | « Ouvrir le pilotage et lancer » : B **rejoint** l'essai (« Heure reprise ») | le dernier qui agit | « Un autre ordinateur a la main » | clos partout, horloge | `/site/tableau_test/*` |
| **T + R** | répétition, sans modale | **B — l'essai de A perd le tableau** | **rien chez A, rien chez B** | revient à l'essai de A | `/site/repetition/*` |
| **T + RT** | répétition en mode test, sans modale : **elle réécrit l'annonce de l'essai** (`/site/tableau_test/pointeur`) | **les deux, mêlés** : la scène de B, puis celle de A au geste de A, sous l'annonce de B | rien chez A ni chez B | **l'horloge — alors que l'essai de A continue** (A dévoile, le tableau reste à l'horloge) | `/site/tableau_test/*` (les mêmes chemins que A) |
| **R + H** | « Ouvrir le pilotage et lancer », sans modale | **B — la répétition de A perd le tableau** | rien chez A | revient à la répétition de A | les chemins de l'heure |
| R + T | « Ouvrir le pilotage et lancer », sans modale | A | **rien chez B** : son essai n'est pas au tableau, son témoin dit « ● session » | A | `/site/tableau_test/*` |
| R + R | répétition : B **rejoint** | le dernier qui agit | « Un autre ordinateur a la main » | arrêtée partout, horloge | `/site/repetition/*` |
| R + RT | répétition en mode test, sans modale | A | **rien chez B** | A | `/site/tableau_test/*` |
| **RT + H** | « Ouvrir le pilotage et lancer », sans modale | **B** | rien chez A | revient à A | les chemins de l'heure |
| **RT + T** | essai, sans modale : **il réécrit l'annonce de la répétition** | **les deux, mêlés** (B, puis A au geste de A) | rien | **l'horloge — la répétition de A continue** | `/site/tableau_test/*` |
| **RT + R** | répétition, sans modale | **B** | rien chez A | revient à A | `/site/repetition/*` |
| RT + RT | répétition en mode test : B **rejoint** | le dernier qui agit | « Un autre ordinateur a la main » | arrêtée partout, horloge | `/site/tableau_test/*` |

**Compté (16)** : 4 rejoignent la même session (H+H, T+T, R+R, RT+RT) ; 2 refusent le tableau en le disant (H+R, H+RT : « tableau distant pris ») ; **5 prennent le tableau à la session qui jouait, sans rien lui dire** (T+H, T+R, R+H, RT+H, RT+R) ; **2 se mêlent sur la même adresse, puis le tableau tombe à l'horloge pendant que l'autre joue encore** (T+RT, RT+T) ; **3 jouent sans le tableau, sans le savoir** (H+T devenu essai, R+T, R+RT). Pendant ce temps, le témoin « ● session » de la session qui a perdu le tableau reste vert (il dit seulement que ses écritures passent, l. 21662-21665).

### 1.2 Deux appareils, une autre séance ou une autre classe (4 combinaisons) : LA MODALE
| A puis B | Ce que B voit | Les boutons | Un clic |
|---|---|---|---|
| H + H, autre classe | « Une heure joue déjà sur un autre appareil : les 3E Charles de Gaulle (09:16-09:52). La lancer ici la clôt. Que veux-tu faire ? » | **trois boutons « undefined »** | la modale se ferme ; **rien n'est lancé ni rejoint** (B : « aucune heure lancée ») ; A continue, le tableau le suit |
| T + T, autre classe | « Un essai (mode test) joue déjà sur un autre appareil : 3E Charles de Gaulle · séance 0. Que veux-tu faire ? » (« séance 0 » : la clé, pas le numéro que voit Paul) | trois « undefined » | rien n'est lancé ni rejoint |
| R + R, autre séance | « Une répétition joue déjà sur un autre appareil (séance 1). Que veux-tu faire ? » | trois « undefined » | rien n'est lancé ni rejoint |
| RT + RT, autre séance | la même | trois « undefined » | rien n'est lancé ni rejoint |
- Le code : `dr_sesDemander` (l. 23329-23335) donne `{ label, title, prim, action }` ; `atModaleChoix` (l. 14654-14672) écrit `b.lib` (« undefined ») et appelle `b.fn` (absent) : le clic ne fait que retirer la modale. **Dans ces quatre cas, Paul est bloqué** : ni « Rejoindre », ni « Lancer quand même », ni l'autre heure. Captures : `Q1-H+H·autre-B-dialogue.png` et suivantes.
- Ces quatre modales ne paraissent que pour une session **de la même sorte** (heure/heure, essai/essai, répétition/répétition) : entre deux sortes différentes, aucune modale (1.1).

### 1.3 Un même appareil (deux onglets du même navigateur, 6 combinaisons)
| A puis B | Le tableau distant | Ce qui change par rapport à deux appareils |
|---|---|---|
| H + R | A ; B « tableau distant pris » | le bandeau « Heure en cours… Reprendre » ne paraît pas dans le second onglet (l. 23359 : l'heure est tenue par un autre onglet) |
| R + H | **B** ; la répétition de A ne le sait pas | rien |
| H + T | A ; B (mode test) « Reprendre l'heure » → un essai qui copie l'heure | pas de bandeau dans le second onglet |
| T + H | **B** ; l'essai de A ne le sait pas | rien |
| R + T | A ; l'essai de B n'est pas au tableau, sans le savoir | rien |
| T + R | **B** ; l'essai de A ne le sait pas | rien |

### 1.4 Trois sessions (3 combinaisons)
| A, puis B, puis C | Le tableau distant |
|---|---|
| H, puis R, puis T | A (l'heure) tout du long ; B « tableau distant pris » ; C (mode test) « Reprendre l'heure » → un essai qui copie l'heure, pas au tableau |
| T, puis RT, puis R | B prend l'annonce de A (mêlés), puis **C prend le tableau aux deux** ; quand B s'arrête, C le garde ; A ne voit rien |
| R, puis T, puis H | A ; l'essai de B jamais au tableau ; **C (l'heure) prend le tableau à A** ; A ne voit rien |
- La règle mesurée, la même que le code (§0.2) : **le tableau distant suit la session la plus haute de l'ordre « vraie heure > répétition > mode test (essai et répétition en mode test, à égalité : le dernier qui écrit) »**, relue toutes les 3 s, quel que soit l'ordre des lancements. Aucune session ne garde le tableau parce qu'elle l'a eu la première.

### 1.5 Avec la télécommande
| A (avec sa télécommande) puis B | Ce que la télécommande montre et fait |
|---|---|
| H, puis R | la télécommande pilote l'heure de A, le tableau la suit (« 3E Charles de Gaulle ● en direct · Diapo 2 sur 13 · heure 1 ») ; B « tableau distant pris » |
| T, puis RT | la télécommande pilote l'essai de A ; la répétition en mode test de B réécrit l'annonce : le tableau montre B, puis A (à l'ordinateur ou à la télécommande) sous l'annonce de B ; B s'arrête : **le tableau tombe à l'horloge**, l'essai de A et sa télécommande continuent sans tableau, sans le savoir |
| R, puis T | la télécommande pilote la répétition de A, le tableau la suit ; l'essai de B n'y est jamais |
- La télécommande ne dit rien du tableau distant : elle dit la diapo de sa session (« ● en direct · Diapo n sur N »), même quand le tableau montre une autre session.

### 1.6 Un appareil qui disparaît (l'onglet fermé, l'ordinateur en veille) — 5 cas
*A joue, A disparaît (le contexte du navigateur fermé ; ou la page gelée par le protocole de Chrome, `Page.setWebLifecycleState: frozen`, ce que fait un ordinateur en veille ou un onglet mis en sommeil) ; 6 s et 30 s après, ce que fait le tableau ; un autre appareil B ouvre le site et lance une session ; B s'arrête ; puis l'annonce de A est vieillie au hub de 4 h 01 (le seuil `frais` du code).*
| A joue puis disparaît | Le tableau, 6 s et 30 s après | L'annonce de A au hub | B ouvre le site | B lance… | Quand B s'arrête | L'annonce de A vieillie de 4 h 01 |
|---|---|---|---|---|---|---|
| H, onglet fermé | **garde l'image de A** | **reste** (fraîche 4 h) | bandeau « Heure en cours avec les 3E Charles de Gaulle — Reprendre » | une répétition : **« tableau distant pris : 3E Charles de Gaulle est en cours »** | l'image de A | **le tableau garde l'image de A (pour toujours)** |
| T, onglet fermé | garde l'image de A | reste | « Essai en cours (mode test) — Reprendre » | une répétition : **elle prend le tableau** | **le tableau revient à l'essai mort de A** | l'horloge |
| R, onglet fermé | garde l'image de A | reste | « Répétition en cours — Reprendre » | une vraie heure : elle prend le tableau | revient à la répétition morte de A | l'horloge |
| RT, onglet fermé | garde l'image de A | reste | « Répétition en cours (mode test) — Reprendre » | une vraie heure : elle prend le tableau | revient à la répétition morte de A | l'horloge |
| H, veille (20 s gelée) | garde l'image de A | reste | « Heure en cours… — Reprendre » | une répétition : « tableau distant pris » | l'image de A ; A réveillé dévoile : le tableau le suit | garde l'image |
- **Le tableau ne se libère jamais de lui-même avant 4 h** : aucune annonce n'a de battement (§0.2), fermer l'onglet n'écrit rien (l. 23285-23286). Après 4 h : l'horloge pour une répétition ou un essai ; **l'image reste pour toujours pour une vraie heure** (l. 24371).
- Une vraie heure abandonnée sans « Clore » tient le tableau distant **4 h** contre toute répétition et tout essai : la répétition le dit (« tableau distant pris »), l'essai en mode test ne le dit pas (1.1, H + T).
- Pour lancer une autre heure pendant ces 4 h : le même chemin que 1.2 (une heure fraîche, pas la même, pas close) → la modale aux trois boutons « undefined ». Mesuré avec A vivant (1.2) ; avec A disparu : pas mesuré à part (le code passe par la même ligne, l. 23324-23325). La seule sortie mesurée : rouvrir la même case (« ▶ Reprendre l'heure »), puis « Clore l'heure » (1.1, H + H).

---

## 2 · LE MINUTEUR (㉔ ㉕ ㉖ ㉗, ㊵) — mesuré le 03/11 de 13:55 à 14:19

*Par le geste, à la montre du navigateur, sans l'autre auditeur (aucune sonde de la partie II en cours de 13:47 à la fin des mesures : relevé toutes les 30 s, `ps`). Quatre appareils : l'ordinateur du pilote (1536 × 864) avec sa fenêtre du tableau (« ⧉ Ouvrir le tableau », 1280 × 720), le tableau distant (`?vue=tableau`, un autre appareil, 1280 × 720), le téléphone (390 × 844, tactile) devenu télécommande par le QR. La session lancée, l'ordinateur va à la diapo la plus remplie de l'heure 1 et la dévoile entière ; il ouvre le panneau du ⏱ (mesuré), le referme ; puis **à la télécommande** : « Départ » (5:00), à 1 min et 5 min les quatre affichages lus au même instant (et le reste en millisecondes de chaque appareil), « Pause », 8 s, « Pause » de nouveau (= reprendre : `dr_tcMinut` l. 23631 appelle `dr_minuteurPause`, qui fait repartir un minuteur en pause, l. 20752). Même montre sur tous les appareils (comme des appareils réglés sur l'heure du réseau) ; puis montres décalées (2.6).*

### 2.1 Le temps affiché, à la télécommande (㊵) — même montre partout
| Moment | Répétition (pilote · télécommande · tableau distant · fenêtre) | Mode test | Vraie heure |
|---|---|---|---|
| 1,5 s après « Départ » | 04:58 · 04:59 · 04:59 · 04:59 (reste : 297 972 · 297 979 · 297 997 ms) | 04:59 ×4 (298 390 · 298 390 · 298 398) | 04:59 ×4 (298 466 · 298 466 · 298 474) |
| 1 min | 04:01 ×4 (240 056 · 240 056 · 240 077) | 04:01 ×4 (240 057 · 240 057 · 240 067) | 04:01 ×4 (240 083 · 240 084 · 240 091) |
| 5 min moins 2 s | 00:03 ×4 (2 060 · 2 061 · 2 081) | 00:03 ×4 (2 057 · 2 057 · 2 060) | 00:03 ×4 (2 081 · 2 080 · 2 089) |
| « Pause » + 1,5 s, puis + 9,5 s | 00:02 ×4, immobile (1 995 partout) | 00:02 ×4, immobile (1 980 partout) | 00:03 ×4, immobile (2 015 partout) |
| « Reprendre » + 1,5 s | 00:01 ×4 (452 · 451 · 456) | 00:01 ×4 (449 · 450 · 456) | 00:01 ×4 (496 · 496 · 500) |
- **Avec la même montre, l’écart est de 0 à 25 ms dans les trois sessions** (le tableau distant 3 à 25 ms derrière le pilote ; la télécommande à 0 à 7 ms) ; l'affichage diffère au plus d'une seconde, à l'instant où la seconde change (1,5 s : le pilote 04:58, les autres 04:59 — chaque écran redessine ses chiffres à son rythme). La pause fige les quatre au même chiffre ; la reprise repart du même reste.
- Le décalage que Paul a vu le matin ne se reproduit donc pas avec des montres égales : voir 2.6 (montres décalées).

### 2.2 Le panneau du ⏱ au pilote couvre-t-il la diapo (㉗) — rectangles mesurés, 1536 × 864
| Session | Le panneau (x, y, largeur × hauteur) | La diapo du pilote | Recouvrement |
|---|---|---|---|
| Répétition | 616, 632 · 350 × 40 | 294, 179 · 876 × 492 (bas à 671) | **13 661 px² = le panneau entier est posé sur la diapo** (son bas) |
| Mode test | 538, 676 · 350 × 40 | 216, 179 · 954 × 536 (bas à 715) | **13 661 px², le panneau entier sur la diapo** |
| Vraie heure | 538, 676 · 350 × 40 | 216, 179 · 954 × 536 | **13 661 px², le panneau entier sur la diapo** |
- Le code : `position:fixed; z-index:9000` (l. 16558), posé 8 px **au-dessus** du bouton ⏱ (`dr_minuteurPanneau`, l. 20742 : `top = r.top - h - 8`) ; le ⏱ est dans la barre juste sous la diapo, donc le panneau monte sur la diapo. Sur la diapo mesurée (« Les compétences du chapitre 1 »), il ne couvre aucune ligne de texte (il est sur le bas, à côté de la légende) ; sur une diapo dont le texte descend jusqu'en bas, il le couvrirait : pas mesuré diapo par diapo. Capture `Q2-R-1-pilote-panneau.png` (scratchpad).

### 2.3 « Ce que voit la classe » montre-t-il le minuteur (㉔)
- Sans clic, la colonne de droite dit « Diapo suivante ». **Avec « ⧉ Ce que voit la classe » cliqué** (répétition, minuteur parti et montré au tableau, le pilote à 04:58) : la colonne dit « Le tableau, en ce moment », **sans minuteur** (aucun élément du minuteur, aucun « mm:ss » dans la vue), alors que le tableau distant et la fenêtre l'affichent au même instant (captures `Q2R-ce-que-voit-la-classe.png`, `Q2R-tableau-meme-moment.png`, scratchpad).
- Le code : `vueDroite` (l. 18308-18310) rend la diapo seule dans la colonne (`rendre(inner, copie)`) ; le minuteur du tableau (`#dr-tab-minut`) n'existe que dans la page du tableau (l. 21770).

### 2.4 Son allure, comparée au site (㉖) — styles calculés par le navigateur
| | Au tableau (`#dr-tab-minut`) | Le site (le pilote : son minuteur, ses boutons, la page) |
|---|---|---|
| Police | **`ui-monospace, Menlo, Consolas, monospace`**, gras, 64 px à 1280 de large | **« EB Garamond », Georgia, serif** (le chiffre du minuteur du pilote 15 px gras ; les boutons ; la page) |
| Couleur des chiffres | **vert `#3ddc84`** au départ, puis jaune, orange, rouge selon le temps écoulé (l. 21782) ; or `#d4a017` par défaut | or `#e4b45c` (rgb 228, 180, 92) |
| Fond | **noir pur `#000`**, ombre portée | brun très sombre (page `#0d0b0a`, boutons `#3a2c14`) |
| Coins, bord | coins 9 px, **sans bord** | coins 8 px, **bord or de 1 px** |
- Côte à côte (sans nom d'élève) : `allure-minuteur.png` (ce dossier) — le minuteur du tableau, le panneau du pilote et ses boutons, le minuteur de la télécommande.

### 2.5 Au tableau, le minuteur passe-t-il par-dessus le texte (㉕) — toutes les diapos de l'heure 1
*Répétition, minuteur parti et « au tableau » ; chaque diapo de l'heure 1 (13), entièrement dévoilée, au cran 1 (« texte au tableau » par défaut) puis au cran 4 (le plus grand) ; à chaque fois, au tableau distant et dans la fenêtre du tableau (1280 × 720) : le rectangle du minuteur (1020, 23 · 237 × 79, le même à tous les crans) contre le rectangle de chaque ligne de texte affichée.*
- **Le minuteur couvre du texte sur 7 des 26 diapos·crans mesurés**, identiquement au tableau distant et dans la fenêtre : cran 1 — « Séance 1 sur 9 » (le plan, 2 825 px²), la consigne « Observe, discute, fa… » (1 712 px²), « Chaque groupe présente son tableau et son hypothèse en… » (2 681 px² : « hypothèse en » caché) ; cran 4 — les mêmes trois (2 825, 1 928, 1 430 px²) et le titre du cahier de textes (6 944 px²). Image (sans nom d'élève) : `minuteur-recouvre-texte.png` (ce dossier).
- Il ne change ni de place ni de taille avec le texte (l. 21781 : position fixe en haut à droite du cadre, 5 % de la largeur) ; le texte ne s'écarte pas de lui.

### 2.6 Le décalage des minuteurs (㊵) — montres décalées, en répétition, « Départ » à la télécommande
*La même mesure, avec la montre du téléphone **3 s en avance** sur celle de l'ordinateur, et celle du tableau distant 2 s en retard (des écarts ordinaires entre un téléphone et un ordinateur d'établissement ; ceux des appareils de Paul : je ne sais pas). Relevés à 1,5 s et 20 s après « Départ », puis « Pause » et « Pause » de nouveau.*
| Moment | Pilote (l'ordinateur) | Fenêtre du tableau (sur l'ordinateur) | Télécommande (le téléphone) | Tableau distant |
|---|---|---|---|---|
| 1,5 s après « Départ » | **05:02** (301 412 ms) | **05:02** | 04:59 (298 408) | 04:59 (298 411) |
| 20 s | **04:42** | **04:42** | 04:39 | 04:39 |
| « Pause » + 1,5 s et + 9,5 s | 04:38 | 04:38 | 04:38 | 04:38 (tous à 277 986 ms) |
| « Reprendre » + 1,5 s | **04:40** | **04:40** | 04:37 | 04:37 |
| « Reprendre » + 11,5 s | **04:30** | **04:30** | 04:27 | 04:27 |
- **Le décalage se reproduit, et il vaut exactement l'écart des deux montres (3 s ici)** : le téléphone pose la fin du minuteur à sa montre (`dr_minuteurDepart`, l. 20747, appelé par la télécommande, l. 23630) ; l'ordinateur la compte à la sienne (l. 20707). Le tableau distant se recale sur l'écart le plus grand vu pendant l'heure entre l'heure des scènes reçues et la sienne (`dr_tabMinutRecevoir`, l. 21981) — ici la montre du téléphone, la plus en avance, qui écrit les scènes quand la télécommande a la main — et montre donc le même chiffre que la télécommande ; **la fenêtre du tableau, sur l'ordinateur, montre celui du pilote** : la classe ne voit pas le même chiffre selon le tableau qu'elle regarde. En pause, les quatre sont d'accord (le reste figé part tel quel) ; à la reprise, l'écart revient.
- Avec la même montre partout (2.1) : aucun écart. La version jouée par Paul ce matin et l'écart de ses montres : je ne sais pas.

---

## 3 · LA PARTICIPATION (Paul, 12:42) — mesuré le 03/11 vers 13:05

*Par le geste : un ordinateur (1536 × 864) lance la session ; il va à « Question-bilan » ; dans une ligne de réponse, il tape deux lettres dans la case des initiales, puis soit **Entrée** (comme Paul en classe), soit un **clic dans la réponse** ; il tape la réponse, Entrée. Chaque cas est fait sur un élève différent, pour que les verts se distinguent. `sorties/audit-I.jsonl`, partie Q3 ; captures `Q3-*-pilote.png` (scratchpad, elles portent des noms).*

### 3.1 Quelle liste montrent les pastilles, et d'où elle vient
| Session | La liste des pastilles | Le compteur | D'où (le code) |
|---|---|---|---|
| Répétition (de la copie de « 3E Charles de Gaulle », la classe des 3 FRANKLIN Aretha au faux hub) | les **29 élèves de « 3E Charles de Gaulle »** | « 0 sur 29 présents » | `dr_classe` l. 17320 : en répétition, `dr_classeTest()` (l. 17314) |
| Essai en mode test (3E Charles de Gaulle) | les 29 élèves de « 3E Charles de Gaulle » | « 0 sur 29 présents » | `dr_classe` l. 17316 : la classe de l'heure (`AT_DR_COURS.classeSlug`) |
| Vraie heure (3E Charles de Gaulle) | les 29 élèves de « 3E Charles de Gaulle » | « 0 sur 29 présents » | idem |

- **En répétition, la liste n'est jamais celle de la classe répétée** : c'est toujours celle de la « classe test » — la classe dont la clé (ou le nom) est « 3E Charles de Gaulle » (l. 17314), sinon le nœud « CLASSE TEST ». Au faux hub, cette clé est la classe des 3 FRANKLIN Aretha (la grille : `classe: '3 FRANKLIN Aretha'`, `classeMjpc: '3E Charles de Gaulle'`). Le cas de Paul : une répétition lancée de la copie des 3 FRANKLIN ARETHA, pour faire l'heure des 3 DYLAN → les pastilles sont celles des 3 FRANKLIN.
- **Mesuré aussi : la répétition « pour » une autre classe** (le nom de la classe dans l'en-tête cliqué, le menu propose « 3E Charles de Gaulle » et « CLASSE TEST », CLASSE TEST choisie) : la liste reste **les 29 élèves de « 3E Charles de Gaulle »** (« 0 sur 29 présents ») ; les quatre cas d'initiales donnent les mêmes résultats qu'en 3.2.
- Au vrai hub, quelle classe est la « classe test » : je ne sais pas (le vrai hub n'est pas lu ici). La capture de Paul (« 5 SUR 29 PRÉSENTS » sous l'en-tête « 3 FRANKLIN ARETHA ») va avec une classe des 3 FRANKLIN dont la clé est encore « 3E Charles de Gaulle » : à lire au vrai hub (`/classes`, la clé et le `nom`).

### 3.2 Des initiales tapées qui ne sont pas celles de la liste — compté, les trois sessions (mêmes résultats dans les trois)
| Ce qui est tapé (deux lettres) | Puis **Entrée** | Puis un **clic dans la réponse** (sans Entrée) |
|---|---|---|
| (a) les initiales exactes d'un élève de la liste (« EB », l'ÉLÈVE 3) | gardées « EB », la réponse **à l'ÉLÈVE 3, qui passe au vert** ; « 1 sur 29 » | gardées « EB », la réponse à l'ÉLÈVE 3 (un seul candidat à la frappe) |
| (b) ces lettres à l'envers, initiales de personne (« AE ») | **réécrites « EA »**, la réponse **à l'ÉLÈVE 1 (initiales EA), qui passe au vert** ; « 2 sur 29 » | réécrites « EA », la réponse à l'ÉLÈVE 1 (un seul candidat à la frappe) |
| (c) le début d'un prénom de la liste, initiales de personne (« EL ») | **réécrites « EA »**, la réponse **à l'ÉLÈVE 1** (son prénom commence par ces lettres) | gardées « EL », à personne |
| (d) des initiales de personne, début d'aucun prénom (« AA ») | gardées « AA », à personne, aucun vert, le compteur ne bouge pas | gardées « AA », à personne |

- Le code : `ini.oninput` (l. 19666) prend l'élève quand il n'y a qu'un candidat ; `ini.onkeydown` (l. 19667) prend **le premier candidat** à Entrée ou Tab ; les candidats (`dr_candidats`, l. 19694-19698) : les initiales exactes, sinon les mêmes lettres dans un autre ordre, sinon le début des initiales ou d'un prénom. Le vert (l. 19717-19723) suit la réponse attribuée.
- **Combien d'élèves d'une autre classe tombent sur un élève de la liste**, mesuré avec la fonction que la touche Entrée appelle (`dr_candidats`), sur les vraies listes de classe du faux hub, la liste montrée étant celle de « 3E Charles de Gaulle » : **4E BANKSY 5 sur 29 · 4E PYTHAGORE 10 sur 28 · 5e HERGÉ 8 sur 31** (de 17 % à 36 % des élèves). Les autres restent « à personne ».
- Le cas de Paul (capture de 12:04, « cinq pastilles en vert » alors que les initiales tapées étaient celles des 3 DYLAN) : c'est ce mécanisme — en répétition, la liste est celle des 3 FRANKLIN ; chaque initiale des 3 DYLAN qui a les mêmes lettres (dans un ordre ou dans l'autre) qu'un élève des 3 FRANKLIN, ou qui commence un prénom des 3 FRANKLIN, donne la réponse à cet élève et le met en vert. Les cinq de la capture : je ne sais pas lesquels (pas mesuré sur le vrai hub).
- « J'espère que c'est uniquement le cas de la répétition » : **non pour le mécanisme, oui pour la liste**. En mode test et en vraie heure, la liste est celle de la classe de l'heure : des initiales de cette classe tombent juste. Mais le même mécanisme (Entrée prend le premier candidat, même par lettres inversées ou début de prénom) vaut dans les trois sessions, mesuré à l'identique : une faute de frappe ou des lettres inversées donnent la réponse à un autre élève de la classe.
- Ce que ça télescope (tout ce qui lit `r.eleve` / `r.i`) : les pastilles et le compteur « n sur N présents » (`participation`), la fiche d'élève (`histoire`, l. 19702), « qui a participé » au tableau (`quiAParticipe`, l. 19726, envoyé dans la scène par `dr_versMur` l. 21507-21508), le journal (`journal('parole', …)` à Entrée dans la réponse, l. 19670) et donc le récit et la Relecture de l'heure (les paroles par élève, `dr_partsHeure`, l. 20461). En répétition, ce qui est écrit est oublié à « ■ Arrêter » (`arreterRepetition`, l. 19117) ; en mode test, cela reste au magasin du mode test ; en vraie heure, cela part au hub.

---

## 4 · LE LANCEMENT SUR UN RÉSEAU TRÈS LENT (registre, C16 303) — mesuré le 03/11 à 13:48

*Par le geste, à la montre du navigateur, l'autre auditeur sans navigateur ouvert (0 processus `chrom` à 13:47:54, aucune sonde de la partie II en cours pendant la mesure) : l'ordinateur (1536 × 864) ouvre l'emploi du temps, clique la case des 3E Charles de Gaulle du 14/09 08:57 ; puis le faux hub rend **chaque lecture de cet ordinateur 3 s plus tard** (comme la mesure du registre) et l'ordinateur clique « ▶ Ouvrir le pilotage et lancer ». Ce qui est à l'écran est relevé à 0,5 · 1 · 2 · 3 · 4 · 6 · 8 · 10 · 12 · 14 · 16 · 20 · 25 · 30 · 36 s ; captures écran entier `Q4-*-NNs.png`.*

### 4.1 Ce que Paul voit (un seul clic)
| Après le clic | À l'écran | Un signe que ça charge ? |
|---|---|---|
| 0,5 s → 6 s | l'emploi du temps s'est **fermé aussitôt** (`edtLancer` l. 27138 : `edtFermer(); edtModaleFermer();`, avant toute lecture) ; derrière, le **Panneau prof, « Tableau de bord », « Session : aucune session »** | **aucun** : pas de message, pas d'indicateur, curseur normal |
| 8 s → 10 s | **un écran noir**, avec seulement « ✕ Fermer l'atelier » en haut à droite (l'Atelier qui se monte) | aucun |
| 12 s → 30 s | **le pilote, « 3E Charles de Gaulle · aucune heure lancée »**, la diapo 1 grisée, « ▶ Dévoiler » actif, « Où on en est » (« l'heure dépasse de 7 min »), la participation « 0 sur 29 présents » | aucun : rien ne dit que l'heure est en train de partir |
| entre 30 et 36 s | l'heure est lancée (`S.lancee`) | — |
- Les mêmes temps que le registre (12,6 s puis 33,7 s) à l'échelle près de ces relevés : le pilote paraît vers 12 s, l'heure part entre 30 et 36 s.
- Au hub, pour un clic : `/site/cours_actif` posé **1 fois**, une seule heure dans la copie (`heures/2026-09-14_08h57-09h52_…`), **1** « lancement » au journal ; 11 écritures en tout ; aucune erreur.

### 4.2 Ce que fait un second clic
- **Sur le même bouton : impossible.** À 3 s, « ▶ Ouvrir le pilotage et lancer » n'est plus à l'écran, ni la case (l'emploi du temps est fermé dès le premier clic) : le second clic de la sonde ne trouve rien (`clique: false, case: false`). Résultat au hub identique au clic seul (1 `cours_actif`, 1 heure, 1 lancement).

- **« ▶ Dévoiler » sur le pilote « aucune heure lancée » (à 16 s, trois clics)** : les trois clics passent, le pilote dit « 3 / 3 dévoilés » ; l'heure part ensuite (entre 30 et 36 s) et **revient à « 0 / 3 dévoilés »** : ce que Paul a dévoilé pendant l'attente est perdu. Au hub, un seul lancement.
- **« ✕ Fermer l'atelier » sur l'écran noir (à 8 s)** : Paul revient au Panneau prof (« Session : aucune session ») ; **l'heure part quand même, en arrière-plan, sans pilote à l'écran** (à 36 s : `S.lancee` vrai, `/site/cours_actif` posé, l'Atelier fermé ; capture `Q4-fermer-36s.png` : le Panneau prof, « aucune session »). Le tableau distant suivrait cette heure (§0.2).
- **Rouvrir l'emploi du temps et relancer (à 3 s)** : mesuré en 4.3.

### 4.3 Rouvrir l'emploi du temps pendant l'attente (à 3 s)
- Le Panneau prof est à l'écran : « 📅 Emploi du temps » (`showProfSection('edt')`, l. 1644) ouvre sa page, qui dit **« Lecture des objets de l'année… »** (capture `Q4-rouvrir-edt.png`) ; en 16 s, **aucune case n'y paraît** (chaque lecture prend 3 s), puis le pilote du premier clic passe devant. Un second lancement par ce chemin : **pas possible pendant l'attente** (mesuré : aucune case trouvée en 16 s). Au hub : un seul `cours_actif`, une seule heure, un seul lancement (13 écritures, aucune erreur).
- **Compté (4 gestes possibles pendant l'attente)** : aucun ne lance une seconde heure ; **deux font perdre quelque chose ou cachent l'heure** (« ▶ Dévoiler » : le dévoilement perdu ; « ✕ Fermer l'atelier » : l'heure lancée sans pilote, le Panneau prof disant « aucune session ») ; rien, pendant 30 à 36 s, ne dit à Paul que l'heure est en train de partir.

---

## 5 · POUR CHAQUE CHOSE QUE PAUL VEUT (partie I) : CE QUE L'EXISTANT FAIT, CE QUI MANQUE, CE QUE ÇA TÉLESCOPE — mesuré, sans proposition

### 5.1 « L'adresse du tableau distant, quand elle est occupée, ne peut JAMAIS être utilisée par une autre session » (12:26)
- **Ce que l'existant fait déjà** (mesuré, §1) : une vraie heure passe devant tout (`dr_tabLirePointeur`, l. 21884) ; une répétition lancée pendant une vraie heure n'écrit rien et le dit (« tableau distant pris », l. 19621) ; la même session relancée ailleurs est rejointe (4 sur 4) ; une session de la même sorte, autre séance ou autre classe, ouvre une modale (l. 23325, 23320, 23400).
- **Ce qui manque** (mesuré) : 5 couples sur 16 prennent le tableau sans rien dire, 2 se mêlent sur `/site/tableau_test`, 3 jouent sans le tableau sans le savoir (§1.1) ; aucun lancement ne lit les annonces des autres sortes (§0.3 : l'heure ne lit pas la répétition ni l'essai ; l'essai ne lit ni l'heure ni la répétition en mode test ; la répétition ne lit pas l'essai) ; l'essai et la répétition en mode test partagent les mêmes chemins (`/site/tableau_test/{pointeur, scene, ecrans, vif}`) ; aucune annonce n'a de battement, rien ne libère le tableau quand l'appareil disparaît (4 h ; une vraie heure garde son image pour toujours, §1.6) ; le témoin « ● session » reste vert quand la session a perdu le tableau.
- **Ce que ça télescope** (tout ce qui lit ou écrit les mêmes annonces) : `/site/cours_actif` est lu par le tableau distant (l. 21885), le bandeau « Reprendre » de tous les appareils (`dr_sesVeilleDemarrer`/`dr_sesBandeau`, l. 23338-23367), la reprise (`sesReprendre`, l. 24331-24350, puis `dr_reprendreCours`), la modale de lancement (l. 23323-23326), la répétition (« tableau distant pris », l. 19620-19621), la clôture certaine de l'heure d'avant (`dr_cloreHeureRestee`, l. 20483-20489 : lancer une autre heure **clôt** l'heure annoncée), l'effacement du pointeur à la clôture (`dr_coursActifEffacerSi`, l. 20481) ; `/site/repetition/pointeur` et `/site/tableau_test/pointeur` sont lus par le tableau distant, le bandeau (l. 23340-23342), le lancement d'une répétition (l. 23395-23400) et d'un essai (l. 23318-23320), retirés à l'arrêt seulement « s'ils sont encore les nôtres » (l. 19633, 21656) ; la télécommande lit l'état vivant de sa session (`vif`) et ne dit rien du tableau (§1.5).

### 5.2 « Attention au "jamais bloqué" » (12:42)
- **Mesuré** : la seule modale qui propose « Rejoindre / Lancer quand même / Annuler » (`dr_sesDemander`) montre trois boutons « undefined » et ne fait rien (§1.2, 4 sur 4) ; une vraie heure abandonnée tient le tableau 4 h contre toute répétition (« tableau distant pris ») et tout essai (sans le dire) (§1.6) ; pendant ces 4 h, lancer une autre heure passe par la même modale (le code, l. 23324-23325 ; mesuré avec l'heure vivante). La sortie mesurée : la même case, « Reprendre l'heure », puis « Clore l'heure ».

### 5.3 Le chrono (12:16) : la modale sur le pilotage (㉗), l'allure au tableau (㉖), le décalage à la télécommande (㊵) ; et ㉔ ㉕
- **Mesuré** : §2.2 (le panneau entier sur la diapo), §2.4 (monospace vert-noir contre Garamond or-brun), §2.6 (l'écart des montres, entier, entre pilote et télécommande, et entre la fenêtre et le tableau distant), §2.3 (absent de « Ce que voit la classe »), §2.5 (7 diapos·crans sur 26 où il couvre du texte).
- **Ce que ça télescope** (tout ce qui lit ou écrit le minuteur) : l'état vivant (`dr_sesPhoto`, l. 22999 : `minut`, fusionné à trois voies, l. 23135, posé l. 23143, 23197), la scène du tableau (`dr_scene`, l. 21589 : `sc.minut`), la fenêtre du tableau (`postMessage`, l. 21521, 20759), le recalage du tableau distant (`dr_tabMinutRecevoir`, l. 21980-21983), la télécommande (`dr_tcMaj` l. 23596, `dr_tcMinut` l. 23628-23637), le journal (`journal('minuteur', …)`, l. 20748, 20751-20752, 20755, 20778) et donc ce qui relit le journal de l'heure.

### 5.4 Les noms en vert qui ne correspondent pas aux initiales tapées (12:42)
- **Mesuré** : §3 (la liste de la classe test en répétition ; Entrée prend le premier candidat, même par lettres inversées ou début de prénom ; dans les trois sessions).
- **Ce que ça télescope** : §3.2, dernier point (les pastilles, le compteur, la fiche d'élève, « qui a participé » au tableau, le journal, le récit et la Relecture).

*Fin de la partie I. Auditeur I, 03/11/2026.*
