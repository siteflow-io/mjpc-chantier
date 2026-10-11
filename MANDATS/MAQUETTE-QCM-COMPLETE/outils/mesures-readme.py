# Écrit mesures/README.md d'après mesures/limites.json (complément 1, étape C) : le tableau, l'étalon et le texte de {{LIMITES}}.
#   python3 outils/mesures-readme.py mesures/limites.json mesures/README.md
import json,sys
d=json.load(open(sys.argv[1]))
L=d['par_choix']
rows="\n".join("| %d | %s | %s | %s |"%(L['4'][i]['enonce'],*(str(L[n][i]['limite']) if L[n][i]['limite'] else "ne tient pas" for n in '456')) for i in range(len(L['4'])))
q=d['q3_reel']; ql=d['q3_longueurs']
lim6=[x for x in L['6'] if x['enonce']>=ql['enonce']][0]
txt=f'''# Les mesures (mandat §5, refaites au complément 1, défaut 3)

*Script : `node mesures/mesurer.js maquette-qcm-v6.html mesures/limites.json` (la mesure elle-même : `mesures/mesure-page.js`, que la garde 4 du banc rejoue sur un échantillon). Sortie brute : `limites.json`. Sur une vraie demi-tablette (tablette 1280 × 800, chaque moitié 640 px de large), avec le CSS de la maquette.*

## 1. Les limites de longueur (464)

**Pourquoi la mesure est refaite.** Dans la v5, à énoncé court, 5 choix tenaient 410 caractères et 6 choix 480, et la limite de 6 choix tombait de 480 à 120 entre 120 et 150 caractères d'énoncé. La mesure gardait, à 5 choix, le plus long choix de la question 3, et répartissait les longueurs autrement à chaque nombre de choix : les limites se contredisaient.

**La règle, la même pour 4, 5 et 6 choix.**
1. Tous les choix à la même longueur : c'est aussi ce que le prompt demande à l'instance (règle 4 : « Les choix sont homogènes en longueur et en construction »).
2. La limite est **la longueur d'un choix** : la plus longue qui tient sur les trois écrans qui montrent les choix, chacun à son état le plus chargé : la réponse (tous les choix cliqués, « ✅ Réponse enregistrée »), B (« dit-elle la même chose que ton clic ? », le clic figé) et la lecture de la feuille du voisin (les choix cliqués, « ✅ Réponse enregistrée », « 👀 Écoute le prof — la correction sera révélée. »).
3. L'énoncé va de 40 à 300 caractères, par pas de 20 ; la longueur d'un choix avance par pas de 5, depuis 5. La limite est la dernière longueur avant le premier échec : **toutes les longueurs plus courtes tiennent aussi** (la limite est suffisante), et la suivante, limite + 5, ne tient plus sur au moins un écran (`limites.json` donne les restes des deux, écran par écran).
4. Une moitié tient tant que le reste, du bas de la carte au bas de la moitié, couvre la marge du bas de la page ({d['marge_px']} px).

**Le tableau : la longueur d'un choix, en caractères, espaces comprises.** La limite vaut pour tout énoncé de la tranche (jusqu'à la longueur de la ligne).

| Énoncé (caractères, au plus) | 4 choix ou moins | 5 choix | 6 choix |
| --- | --- | --- | --- |
{rows}

**Elle ne croît jamais**, ni quand l'énoncé s'allonge, ni quand le nombre de choix augmente : chaque colonne descend, et chaque ligne descend de 4 à 6 choix. Les paliers viennent de la mise en page des choix : courts, ils vont deux par ligne ; au-delà de 40 caractères, un par ligne. La garde 4 du banc relit ce tableau et refuse une limite qui croît, une limite qui ne tient pas, une limite + 5 qui tient encore ; elle rejoue dans la maquette un échantillon (la limite, la moitié de la limite, 5 caractères, à l'énoncé du point et à 40 caractères).

**L'étalon.** La vraie question 3 de l'évaluation de 3e (énoncé de {ql['enonce']} caractères, 6 choix de {min(ql['choix'])} à {ql['plus_long']} caractères) garde **{d['etalon_q3_reste_px']} px de reste** sur l'écran de réponse (`t-annexe`), la mesure du tour 610. Sur les trois écrans, au-delà de la marge : {q['reponse']} px (réponse), {q['b']} px (B), {q['lecture']} px (lecture du voisin) : elle tient partout. **Elle ne respecte pas la nouvelle limite** : à 6 choix et {ql['enonce']} caractères d'énoncé, la limite est {lim6['limite']} caractères par choix, et son plus long choix en fait {ql['plus_long']}. Elle tient parce que ses autres choix sont courts ; la limite, elle, suppose tous les choix à la même longueur. Une limite suffisante est prudente : une question qui la respecte tient toujours ; une question qui la dépasse peut tenir, et l'app la mesure de toute façon au collage (464).

### Le texte exact qui remplace `{{{{LIMITES}}}}` dans le prompt (`MANDATS/PROMPT-QCM-CREATION/README.md`, règle 12, qui continue par « Si une question dépasse et que je te dis que j'assume sa longueur… »)

> {d['texte_limites']}

Il est dans `limites.json` (« texte_limites ») ; `build.py` le met dans la maquette, et le prompt affiché et copié dans Réglages (`c-reglages-prompt`) le porte (garde 3).

## 2. Le débordement

Chaque scène de tablette, chaque moitié, à 1280 × 800 : **0 débordement** (banc final, vérification 2), y compris la lecture de la vraie question 3 de 3e (`x610-3-a-correction`, resserrée pour garder « 👀 Écoute le prof ») et la tablette d'un élève seul (`t-corr-seul`). Aucune question n'est marquée « longueur assumée » dans les scènes de tablette ; la marque se voit dans l'éditeur et au collage (`x627-3-editeur`, `c-collage`).

## 3. Les tailles d'écran

La console à 1366 × 768, 1536 × 864 et 1920 × 1080 ; le téléphone à 390 × 844 ; le tableau à 1280 × 800 ; l'élève hors séance à 1280 × 800 et 390 × 844. À chaque taille : pas de défilement horizontal, aucun chevauchement, aucun texte coupé (banc final, vérifications 2 et 8).

## 4. Les chevauchements

Tout allumé (fenêtres ouvertes, infobulles ouvertes là où la scène les ouvre) : aucun chevauchement entre couches, à toutes les tailles (banc final, vérification 8).
'''
open(sys.argv[2],"w").write(txt)
