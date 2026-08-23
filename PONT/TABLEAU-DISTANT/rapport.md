# RAPPORT — PHASE 1 : LA SESSION DE COURS MULTI-APPAREILS (candidat v8.60.0)
Exécutant TABLEAU-DISTANT · 23/08/2026 · même exécutant que la phase 0.

## ⓪ BASE
Production re-téléchargée : **v8.59.5, md5 `29d07d7456a8b2c8c07e5ded3c37ff8f` = attendu** (1 392 229 o). Candidat : `PONT/TABLEAU-DISTANT/index.html` — **1 427 989 o, md5 `0aeaa2f4655d41e5960746c8d012f552`**. Double parseur (node --check + acorn ES2020) : vert. Le moteur `AT_DR_B64` : intouché à l'octet.

## ① LE DIFF — 6 zones, toutes classées, ZÉRO fonction supprimée
1 bloc CSS `.ses-*` (L704-764) · version (L2802) · **3 coutures d'une ligne** : `atDrCloreFin` (+97 o : `sesCoursFermer()`), `atDrJouerClic` (+118 o : `sesCoursEcrire()`), `atDrMonter` (+105 o : re-branchement `'chaud'/'froid'` à la reconstruction du cadre) · **le bloc [SESSION]** (L15767-16297, 531 lignes) : **31 fonctions neuves, 26 438 o** (détail des tailles au tableau du diff ci-dessus, reproduit dans ce dossier). `published` : 97 → 97 (aucune écriture nouvelle). La fenêtre tableau locale (Win+K) : pas un octet du moteur ni de son enveloppe pont n'a changé — le stub `W.open` n'existe QUE dans le boot `?vue=tableau`.

## ② L'ARCHITECTURE LIVRÉE (les arbitrages appliqués)
- **Canal = compteurs** : `…/deroule_joue/<classe>/scene.json` léger `{ecran, rev, vues, gele, fiche, chrono{visible,txt}, quiOn, qui?, trameMaj, origine, ts}` + la copie jouée `ecrans.json` (source unique de trame, l'existant `_drCopieAuto`) + `part.json` (participation, entre pilotes seulement). **La photo de scène est l'équivalent exact d'`envoie()` côté données** : sous gel elle n'est plus renouvelée (drapeau seul) — le tableau garde son image, les pilotes naviguent.
- **Polling 900 ms partout**, jamais de stream. Débounce d'émission 250 ms ; **l'annonce `trameMaj` part 950 ms après `sauve()`** (après la poussée réelle de `_drCopieAuto`, débounce 900) et s'émet sans délai : jamais une annonce avant la marchandise (course mesurée et corrigée au banc).
- **`/site/cours_actif.json`** : pointeur écrit au lancement (`atDrJouerClic`), effacé à la clôture. Au lancement, **la scène du cours précédent du même couple séance×classe est purgée** (écrite à neuf avant le premier poll de quiconque).
- **N pilotes synchrones** : anti-écho par `origine` (id d'appareil) + garde `SES.applique` ; trois branchements : neuf (émet d'abord), **froid** (reprise : lit d'abord, n'écrase jamais — bug trouvé et corrigé au banc), chaud (cadre reconstruit).
- **Adressage** : ordi de classe = favori fixe `?vue=tableau` (« Aucun cours en cours » + horloge sinon) · téléphone = **QR au pattern d'evaluation-qcm à l'identique** (nonce `qr_<ts>_<aléa>`, URL `?vue=tel&qr=<nonce>`, image api.qrserver.com, poll `qrScans/<nonce>`, fermeture auto + DELETE) · portable = bannière « Reprendre le cours » (`cours_actif` < 4 h, profil professeur).
- **La vue n'écrit JAMAIS** : garde posée avant tout (wrapper `fetch` : toute non-GET comptée et rejetée) + harnais externe qui compte — double zéro prouvé.
- **Le téléphone** (maquettes validées, respectées — captures) : bandeau classe·séance + chrono or ; « ÉCRAN n/N · ACTIVITÉ » ; cartes dévoilées nettes / à-venir grisées « · À VENIR » ; ligne « Écran suivant → "…" » ; palette 64 px (replier/dévoiler sombres · écrans · gel · stylo · chrono · qui a participé) ; barre or « ＋ PARTICIPATION AU VIF » (liste de la classe, un appui = +1 via `partAjoute` existant) ; **édition au doigt** : question/initiales/réponses éditables, sentinelle « réponse à venir — appuyer pour taper », frappe → trame du moteur → `W.sauve()` routé ; palette réduite pendant la saisie (`focusin`/`focusout`).

## ③ LES BANCS — trois pages simultanées (pilote 1440 · vue 1360 · tel 390×844), hub simulé, chiffres du run final
| Preuve exigée | Mesure |
|---|---|
| Dévoilement suit partout < 2 s | vue **1 046 ms** · tel **1 049 ms** |
| Navigation depuis le TEL | pilote **633 ms** · vue **836 ms** (l'écran suivant non dévoilé = tableau vide : cloisonnement vérifié) |
| Réponse tapée au tel → partout | pilote **1 647 ms** · vue **1 851 ms** (trame par `ecrans.json`) |
| Gel | vue **figée** (image conservée pendant que le pilote navigue) · pilote **libre** · **rattrapage au dégel** ✓ |
| Grisé dans la vue | **0** marqueur `apres` dans le DOM du tableau ✓ |
| « Qui a participé » | avant activation : modale fermée, **aucun prénom** ; après `quiParle()` : « Amel » visible côté vue ; le +1 du tel vu au pilote ✓ |
| Écritures depuis la vue | **0** (compteur externe) et **0** (garde interne) |
| Handshake QR | `qrScans/<nonce>` écrit au montage du tel ✓ (la modale se ferme par le poll pilote + DELETE) |
| Reprise (pilote fermé-rouvert) | bannière ✓ · état retrouvé **identique** `{i:1, rev:1}` · la scène du hub **jamais écrasée** (même ts) ✓ |
| pageerrors | 0 sur les trois pages |

Trois défauts réels trouvés PAR le banc et corrigés : ① l'annonce de trame précédait la poussée (course de 650 ms → lecteurs sur trame périmée) ; ② la reprise émettait sa photo vierge avant de lire (écrasement de scène) ; ③ le rebranchement `atDrMonter` écrasait de même (sémantique chaud/froid introduite).

## ④ CAPTURES (regardées) — `tests/cap-s-*.png`
`cap-s-pilote` (EN CLASSE, ● session, bouton 📱 Téléphone, participation AG×1) · `cap-s-vue` (le tableau distant : activité, consigne, question, réponse AG — aucun grisé) · `cap-s-tel` (prompteur conforme maquette : cartes, à-venir grisé, sentinelle, palette) · `cap-s-tel-saisie` (palette réduite) · `cap-s-tel-part` (liste de la classe) · `cap-s-pilote-qr` (modale QR ; l'image QR est coupée par le harnais hors-ligne — en réel elle s'affiche, l'URL en fait foi).

## ⑤ QUESTIONS OUVERTES
1. Le chrono par défaut du moteur (« 07:00 ») transite dans la scène même éteint (champ `txt`) : affiché seulement si `visible` — sans effet, signalé.
2. `cours_actif` est UNIQUE (un professeur, un cours à la fois) — deux cours simultanés se voleraient le pointeur ; conforme à l'usage (un seul Paul), à garder en tête.
3. La vue boote le site entier en dessous (masqué) : aucun effet mesuré (0 écriture), mais un boot dédié allégé reste possible plus tard.

## ⑥ SÉQUENCE DE TEST MANUELLE DU PROFESSEUR — geste par geste, trois appareils réels, URL de production
**Préparation (une fois)** : sur l'ORDI DE CLASSE, ouvrir `https://…/index.html?vue=tableau` et le mettre en FAVORI de démarrage. Attendu : plein écran sombre, horloge, « Aucun cours en cours ».

**Scénario P (portable pilote + ordi de classe au vidéoprojecteur)**
1. PORTABLE : ouvrir le site, atelier → chapitre → séance → Déroulé, choisir la classe, « ▶ Lancer la séance ». Attendu : bandeau EN CLASSE + « ● session » vert + bouton « 📱 Téléphone ».
2. ORDI DE CLASSE (le favori était ouvert) : en ≤ 2 s, l'attente laisse place au tableau (écran 1, rien de dévoilé). Attendu : jamais de grisé, jamais de barre d'outils.
3. PORTABLE : dévoiler (▶) trois fois. Attendu à l'ordi de classe : l'activité, la consigne, la question apparaissent une à une, < 2 s chacune.
4. PORTABLE : « ❄ Gel » puis naviguer d'un écran. Attendu : l'ordi de classe NE BOUGE PAS ; dégel → il rattrape l'écran courant.
5. PORTABLE : « 📱 Téléphone » → scanner le QR avec le TÉLÉPHONE. Attendu : la modale se ferme seule ; le téléphone affiche « 3e … · S… », le prompteur, la palette.
6. TÉLÉPHONE : ▶ dévoiler, ⏭ écran suiv. Attendu : le portable ET l'ordi de classe suivent < 2 s.
7. TÉLÉPHONE : appuyer sur une réponse vide (« appuyer pour taper »), saisir initiales + texte, valider (quitter le champ). Attendu : la palette s'était réduite pendant la frappe ; la réponse apparaît au tableau ET sur le portable < 2 s.
8. TÉLÉPHONE : « ＋ PARTICIPATION » → appuyer sur un prénom. Attendu : compteur ×1 ; au portable, la participation à droite reflète le +1.
9. PORTABLE : « qui a participé ». Attendu : la modale au tableau, avec le prénom du +1 ; la refermer → elle disparaît du tableau.
10. PORTABLE : fermer complètement le navigateur, le rouvrir sur le site. Attendu : bannière « Un cours est en cours avec … — Reprendre » ; reprendre → le déroulé revient À L'ÉCRAN COURANT (pas au début), la session repart.
11. PORTABLE : « ■ Clore la séance ». Attendu : l'ordi de classe revient à l'attente « Aucun cours en cours » (≤ 4 s) ; le téléphone affiche la fin au prochain geste.

**Scénario K (portable seul + Windows+K)**
1. PORTABLE : lancer la séance (comme P-1), puis « Ouvrir le tableau » (le bouton existant). Attendu : la fenêtre tableau LOCALE s'ouvre et se comporte EXACTEMENT comme avant (dévoilement, gel, qui, chrono) — rien n'a changé.
2. Projeter cette fenêtre en Windows+K. Vérifier : gel, « qui a participé », chrono au tableau. Attendu : identiques à la version précédente.
3. (Optionnel) Le téléphone peut rejoindre par QR même en scénario K : les gestes du téléphone se reflètent dans la fenêtre locale via le moteur partagé du portable.
