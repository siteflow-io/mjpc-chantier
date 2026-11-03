# AUDIT GLOBAL — PARTIE I : LES SESSIONS EN DIRECT (auditeur I, conscience n°16, 03/11/2026)

*Mandat : `MANDATS/DEROULE-01-11/MANDAT-AUDIT-GLOBAL.md` §2. Rien n'est changé au site. Le fichier mesuré : la production 8.81.1-⑭-micro (`promo-8812/index.html`, md5 `c21ddbb656b9028cf11b0d70f7b18318`, 28 628 lignes). Les numéros de ligne ci-dessous sont ceux de ce fichier.*

*La sonde : `LIVRAISONS/DEROULE-01-11/AUDIT-GLOBAL/sonde-audit-I.mjs` (ce dossier). Le harnais de `SESSION-PARTOUT/sonde-session.mjs` (le faux hub rangé comme le vrai, qui refuse les clés interdites et pousse son flux), avec la montre du navigateur (`MJPC_HORLOGE=date` de la frappe au tableau : seule la date est décalée au 14/09 09:00 ; les minuteries sont celles du navigateur, jamais `page.clock`). Plusieurs appareils = plusieurs contextes de navigateur séparés (l'ordinateur du pilote 1536 × 864, un second ordinateur 1366 × 768, le tableau distant `?vue=tableau` 1280 × 720, le téléphone 390 × 844 tactile) ; « même appareil » = deux onglets d'un même contexte. Les résultats bruts : `sorties/audit-I.jsonl` et `sorties/sonde-audit-I-*.txt`. Les captures (écran entier) sont dans le scratchpad de la conscience, `c16-audit-I/captures/` (pas au dépôt). Aucun nom d'élève ici : « ÉLÈVE n » = le n-ième de la liste de la classe.*

*Dans le faux hub, la classe de MJPC des « 3 FRANKLIN Aretha » s'appelle « 3E Charles de Gaulle » (la grille la range ainsi : `classeMjpc`) — c'est elle qui joue le rôle des 3 FRANKLIN ARETHA ici. Les cases des « 3 DYLAN Bob » sont rattachées, en mémoire, à « CLASSE TEST » (une classe de 3e du faux hub) pour avoir « une autre classe ».*

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

## 3 · LA PARTICIPATION (Paul, 12:42) — mesuré le 03/11 vers 13:05

*Par le geste : un ordinateur (1536 × 864) lance la session ; il va à « Question-bilan » ; dans une ligne de réponse, il tape deux lettres dans la case des initiales, puis soit **Entrée** (comme Paul en classe), soit un **clic dans la réponse** ; il tape la réponse, Entrée. Chaque cas est fait sur un élève différent, pour que les verts se distinguent. `sorties/audit-I.jsonl`, partie Q3 ; captures `Q3-*-pilote.png` (scratchpad, elles portent des noms).*

### 3.1 Quelle liste montrent les pastilles, et d'où elle vient
| Session | La liste des pastilles | Le compteur | D'où (le code) |
|---|---|---|---|
| Répétition (de la copie de « 3E Charles de Gaulle », la classe des 3 FRANKLIN Aretha au faux hub) | les **29 élèves de « 3E Charles de Gaulle »** | « 0 sur 29 présents » | `dr_classe` l. 17320 : en répétition, `dr_classeTest()` (l. 17314) |
| Essai en mode test (3E Charles de Gaulle) | les 29 élèves de « 3E Charles de Gaulle » | « 0 sur 29 présents » | `dr_classe` l. 17316 : la classe de l'heure (`AT_DR_COURS.classeSlug`) |
| Vraie heure (3E Charles de Gaulle) | les 29 élèves de « 3E Charles de Gaulle » | « 0 sur 29 présents » | idem |

- **En répétition, la liste n'est jamais celle de la classe répétée** : c'est toujours celle de la « classe test » — la classe dont la clé (ou le nom) est « 3E Charles de Gaulle » (l. 17314), sinon le nœud « CLASSE TEST ». Au faux hub, cette clé est la classe des 3 FRANKLIN Aretha (la grille : `classe: '3 FRANKLIN Aretha'`, `classeMjpc: '3E Charles de Gaulle'`). Le cas de Paul : une répétition lancée de la copie des 3 FRANKLIN ARETHA, pour faire l'heure des 3 DYLAN → les pastilles sont celles des 3 FRANKLIN.
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
