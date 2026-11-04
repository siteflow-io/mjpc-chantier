# MANDAT — LA MAQUETTE DU MINUTEUR : LE PILOTE ET LE TABLEAU, LE ZOOM (C16 660)
*Conscience n°16, 04/11/2026 (lancé à 17:01). L'ordre : Paul, 04/11 17:00 : « ok fais une maquette juste pour ces deux écrans zoom. Fais attention à reprendre exactemement le site comme maquette de base. » Un seul exécutant, neuf, court. Le protocole : `PROTOCOLE-MAQUETTE.md` (racine de la production), à lire d'abord, en entier (70 lignes).*

## 0 · CE QUE ÇA CHANGE POUR LA CLASSE, ET CE QUE PAUL A DIT (ses mots)
- Aujourd'hui, au tableau, le minuteur couvre du texte (7 diapos sur 26) ; au pilote, son panneau couvre la diapo (audit global I, sas `audit/global-I`, `RAPPORT-I.md` §2).
- **16:54** : « au tableau, ça doit donner P4. au pilotage, ça doit RESTER en dessous de la diapo centrale, mais au dessus de la zone commentaire. Par ailleurs, au clic sur le bouton chrono, ça ouvre le paramétrage chrono. Une fois lancé, les paramètres se cachent derrière le bouton. Si je reclique sur le bouton, je retrouve mon paramétrage et ainsi de suite. Tu vois l'idée? Enfin, vu que le chrono je le vois sur ma diapo de pilotage et sur la vue tableau, je dois pouvoir le glisser au pilotage (il serait alors en modale) et qu'il glisse aussi au tableau. Ainsi, c'est moi qui adapte sa place, surtout si quelque chose est écrit dessous. Enfin, dans ses réglages, il doit avoir un zoom. »
- **C16 658, acceptée (17:00 « ok »)** : « la pastille se pose d'elle-même dans un coin libre, et tu la déplaces si besoin ; le zoom change sa taille au tableau et au pilote ensemble, pour que ta diapo montre exactement ce que voit la classe. »
- **17:00** : « fais une maquette juste pour ces deux écrans zoom. Fais attention à reprendre exactemement le site comme maquette de base. »
- La référence visuelle validée : les captures `P4B-pilote.png`, `P4B-tableau.png` (sas `captures/minuteur-p4b` `392434e64`, `LIVRAISONS/DEROULE-01-11/CAPTURES-MINUTEUR/`) : P4 = une pastille ronde or sur brun (#e4b45c sur #3a2c14, « EB Garamond »), un anneau qui se vide, posée dans un coin de la diapo sans texte ; au pilote, le réglage en rangée sous la barre d'outils de la diapo, au-dessus de « Notes pour cette diapo », le zoom à droite.

## 1 · CE QUE TU FAIS
La maquette des deux écrans du minuteur, **le pilote et le tableau**, selon le protocole : **le fichier de production 8.84.0-⑰ lui-même**, la nouveauté **écrite dans son code, à l'endroit où elle vivra** (le minuteur : `dr_minuteurPanneau`, `dr_minuteurAfficher`, `dr_minuteurDepart`… dans `LIVRAISONS/INTEGRATION/dr/` ; au tableau `#dr-tab-minut`), servi sur un **faux hub anonymisé** (celui des sondes : `LIVRAISONS/DEROULE-01-11/DIAPOS-OUVERTURE/hub-ouverture.mjs`), **embarqué dans un seul fichier HTML** que Paul ouvre chez lui. Paul y joue, par ses gestes :
1. une vraie heure de la classe d'essai, sur la diapo 12 « Chaque groupe présente… » (celle des captures) ;
2. un clic sur le bouton chrono (sous la diapo) : le réglage s'ouvre sous la diapo, au-dessus des notes ; une durée ; le départ : le réglage se cache derrière le bouton ; la pastille paraît au tableau et sur la diapo du pilote, au même endroit, dans un coin libre ;
3. un nouveau clic sur le bouton : le réglage revient ; et ainsi de suite ; pause, arrêt ;
4. le zoom du réglage : la pastille change de taille au tableau et au pilote ensemble ;
5. la pastille glissée sur la diapo du pilote : elle glisse au tableau, au même endroit ;
6. la dernière minute : le rouge du site (#e8484c).
**Les deux écrans** : le tableau s'ouvre comme dans le site (« Ouvrir le tableau ») dans un second onglet, à jour sans rechargement par le faux hub embarqué ; si ce n'est pas faisable dans le temps, le tableau dans un cadre à côté du pilote, **déclaré**. Rien d'autre ; ce que tu crois utile en plus, tu le dis, tu ne le fais pas.

## 2 · LA SUPPOSITION (À VÉRIFIER)
- Le minuteur et son panneau : dr-classe (`dr_minuteurPanneau`, `#dr-minut-p`, `#dr-minut-aff`, le bouton `#bchrono` dans la barre sous la diapo) ; au tableau : dr-tableau (`#dr-tab-minut`) ; l'état passe au tableau par `dr_minuteurEnvoyer`.
- Le faux hub des sondes intercepte `fetch` et `EventSource` dans la page (`fauxFetch`, `fauxFlux` des sondes, p. ex. `CAPTURES-MINUTEUR/captures-minuteur.mjs`) et range l'état côté Node : pour la maquette, ce magasin doit vivre dans la page (et être partagé avec l'onglet du tableau, même origine).

## 3 · LA PREUVE (protocole §4, en court)
Un banc par le geste (clic, souris, clavier ; jamais un appel de fonction), qui joue 1 à 6 dans la maquette elle-même, à 1536 × 864 et 1920 × 1080, et compte : le réglage jamais sur la diapo ; la pastille ne couvre aucun texte au départ ; même place et même taille relatives au pilote et au tableau après le zoom et après le glisser ; aucune requête hors de la page. Des captures regardées de l'écran entier (pilote et tableau, après 2, 4 et 5).

## 4 · LES RÈGLES
- Ta base : `46d140ab6` (la 8.84.0-⑰ en ligne = son assemblé `8d17922b` plus la ligne de version). Ton dossier : `git worktree add -b maquette/minuteur <dossier> 46d140ab6`, puis `git checkout 392434e64 -- LIVRAISONS/DEROULE-01-11/CAPTURES-MINUTEUR/` ; tu pousses sur `maquette/minuteur` seulement : le code changé, le générateur, la maquette (`MANDATS/DEROULE-01-11/MAQUETTE-MINUTEUR/C16-maquette-minuteur-v1.html`, moins de 16 Mo), le banc, les captures.
- **30 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début ; à 30 minutes, tu pousses ce qui est fait et prouvé, tu t'arrêtes et tu dis ce qui manque). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub (la maquette n'écrit ni ne lit rien au réseau), ni `redaction.html`, `/redactions`, `correction_dictee.html`, ni `dr_classe`. Aucun vrai nom d'élève. Aucun mot de plomberie à l'écran ; chaque geste nouveau porte son infobulle écrite pour Paul.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Le disque : propre ; ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`), avec le chemin absolu de la maquette copiée dans `/tmp/claude-0/-home-claude/5386bee0-0c20-5c03-b624-b1f4dfc9a259/scratchpad/maquette-minuteur/` et son md5.
