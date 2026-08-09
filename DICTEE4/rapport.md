# DICTEE4 — Le type « E — Élision » et les 15 positions arbitrées

**Exécutant, 09/08/2026 — pour la conscience n°5 et pour Paul.**
Base : ma livraison `DICTEE3/correction_dictee.html` 594 927 o, md5 `ddea259da4f29028c9f6570bb8a4c24a` (vérifiée).
Livrable : **596 956 o**, md5 `05f33fde6379fd15052e2b99f17005d1`. `node --check` : OK. **272 fonctions → 272, 0 supprimée, 0 ajoutée** — 36 zones de diff, toutes relues. Hub : lecture seule, aucune écriture réelle.

---

## ① Le type E, par le mécanisme de P

**E = −0,5 pt, domaine Orthographe, famille « Apostrophes et élisions », couleur vert canard `#0d9488`** (distincte du bleu des L). Sur un jeton apostrophe, les deux écrans de correction proposent d'emblée **« ' Élision (E) »**, exactement comme P sur une virgule — même ternaire, même chemin. Le clic est **direct, sans saisie** (`fastMark("E")` passe par la branche des types directs, comme P — c'était déjà le mécanisme, rien de construit à côté). Raccourci clavier **E** (gardé par `estApostrophe`, les deux écrans) ; aides clavier mises à jour (« E = élision »).

Ce qui en découle, tout traité : `TYPE_COST` (+E:0,5) · compteurs `counts` (+E partout, données de test comprises) · bilan général (nE compté au total ; phrase dédiée si ≥ 2 élisions) · badges (`badge-e`) et compteurs par mot · libellés (« Élision ») dans le détail de copie, la fiche élève et les tooltips · CSS des trois contextes (`.type-E .badge`, `.err-e`, `.fast-e`, `.word-btn.err-e`) · couleurs du mode Rapide (flash + bordure) · journal de la modale élève · résumé d'export (« … lexique · N élision · manquant … ») · `POINTS` (−0,5) · commentaire de copie (le commentaire d'élision de DICTEE3 couvre E) · prompt IA (énumération + palette). Le **convertisseur M→P** ne touche pas E : il ne convertit que des M, et l'apostrophe en est déjà exclue — vérifié, rien à faire.

**Défaut DICTEE3 découvert et traité** (aucune dette reportée) : le premier écran de correction séquentiel proposait encore le bouton P sur un jeton apostrophe (seul le raccourci clavier était gardé). Il propose désormais E, comme le mode Rapide.

**Geste prouvé au banc** (Puppeteer, données réelles, mock) : mode ⚡ Rapide → jeton « ’ » → boutons `→ Correct · G · L · **' Élision (E)** · ? · ⚠` → un clic, **aucune saisie demandée** → `{idx:44, type:"E", word:"’"}` enregistré → la copie affiche le trou numéroté avec **badge E vert canard −0,5** (capture `copie_apostrophe_trou.png`).

## ② Les 15 positions — arbitrées, vérifiées, 100 % partout

Outil `arbitre_positions.js` : les positions sont **lues dans les verdicts DICTEE3** (pas retapées — leçon du registre appliquée), la règle de Paul est appliquée à la lettre, chaque position **vérifiée `tokens[idx] === word`** à l'identique :

| Dictée | Arbitrages | Vérification | Résultat |
|---|---|---|---|
| 5e Utopie | 5 (qu'→', n'→' ×3, qu'→') | 547/547 | **100 %** ✓ (exigence tenue) |
| 3e Charles de Gaulle | 1 (P « ’ » → jeton ’) | 262/262 | **100 %** |
| 4e Banksy | 2 (M « ’ » → jetons ’ 32 et 44) | 358/358 | **100 %** |
| 4e Pythagore | 1 (M « ’ » → jeton ’ 44) | 353/353 | **100 %** |
| 5e Grandes découvertes | 6 (s'approchèrent→approchèrent ×5, d'une→') | 169/169 | **100 %** |

**Total : 1689/1689. Aucune position résistante.** Comparaison structurelle : seuls `errors/N/idx` et `errors/N/word` diffèrent (`champs hors idx/word : []` sur les cinq fichiers) ; le type n'a pas bougé dans ces fichiers ; notes, counts, fautifs intacts.

## ③ Requalification E des anciennes erreurs — proposé, séparé, réversible

**Ma proposition (dite ici avant d'être codée, appliquée en fichiers séparés)** : requalifier **uniquement à coût constant** — L→E et P→E (−0,5 → −0,5) — pour que les notes ne bougent pas d'un dixième sans ta décision. Résultat : **4 requalifications** (bouton_amauri et ragueneau_jules en 5e, deslin_lucas en 3e, guegnard_lysandre en GD), notes inchangées, counts ajustés. Fichiers `*_requalifie_E.json`, à injecter **à la place** des `*_arbitre.json` si tu valides — ou à ignorer.

**Six candidats te demandent une décision individuelle** (chiffrés dans `requalification_E_candidats.json`) : G bouton_amauri (+0,5 si E), I guegnard_lysandre (+0,5), A nouteau_quentin (−0,5), M cadiou_fourrier_louann ×2 (+0,5 ch.), M alligand_louka (+0,5). Je ne les ai pas touchés.

## Rien ne casse

Banc complet sur les snapshots arbitrés : trous 1→14 / 1→36, sans-faute, mixte, export, modale élève, aperçu — **tout vert, zéro erreur de page**. Précision de mesure : la « fuite `':7` » du scénario mixte est un faux positif du harnais — l'A de nouteau_quentin pointe désormais l'apostrophe, et le harnais compte les 7 *autres* apostrophes légitimes du texte ; rien ne fuit réellement.

## À l'injection (ordre impératif)

Les cinq `*_arbitre.json` (ou `*_requalifie_E.json` si tu valides la requalification) s'injectent **en même temps** que la promotion du HTML — HTML DICTEE4 + données arbitrées forment un tout : l'un sans l'autre désaligne les apostrophes.

## Contenu de la livraison

`DICTEE4/correction_dictee.html` · `arbitre_positions.js` · les cinq `*_arbitre.json` · les cinq `*_requalifie_E.json` + `requalification_E_candidats.json` · ce rapport · captures (`apostrophe_boutons.png` : bouton E et aide clavier ; `copie_apostrophe_trou.png` : badge E vert canard dans la copie).
