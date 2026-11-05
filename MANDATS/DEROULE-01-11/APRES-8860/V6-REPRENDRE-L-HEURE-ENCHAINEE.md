# MANDAT V6 — « ▶ REPRENDRE L'HEURE » PENDANT LA SÉANCE ENCHAÎNÉE (vraie heure)
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/enchainer`, tu continues `447fd83f5`. **30 minutes au plus** ; à la limite, tu pousses ce qui est prouvé et tu dis ce qui reste. Lis d'abord le mandat V (§0, §1), le mandat V5 et la NOTE-V5.*

## 0 · CE QUI EST DIT
- Règle permanente de Paul : « jamais de perte silencieuse : enregistrement à chaque geste, reprise exacte à la réouverture ».
- NOTE-V5, mesuré par le geste en vraie heure : la séance 2 enchaînée, deux réponses tapées, une ligne dévoilée, l'onglet du pilotage fermé puis rouvert, la case, « ▶ Reprendre l'heure » : « Le pilotage ne reprend rien : aucune séance, aucune diapo, les deux réponses absentes, pas d'horloge de la case, et 2 erreurs de page (« reading 'ecrans' ») » ; piste : `dr_edtReprendre`, laquelle des deux traces du même créneau `edtCheminTrace` renvoie, où `ecrans` est lu sur une séance introuvable (`MJPC_PILE=4`).

## 1 · CE QUE TU FAIS
1. D'abord la comparaison, par le geste : une heure ordinaire (non enchaînée) rouverte par « ▶ Reprendre l'heure » sur la base `46ce703a1` et sur ta branche — pour dire si le défaut vient de l'enchaînement.
2. Supposition forte : avec deux traces sur le même créneau (la séance 1 close, la séance 2 qui tourne), la reprise prend la première trouvée (la séance 1, close) au lieu de l'heure qui tourne. « ▶ Reprendre l'heure » reprend l'heure qui tourne : la séance 2, à sa diapo, ses réponses, son dévoilement ; la séance 1 reste close et intacte.
3. Par le geste, `sonde-enchainer.mjs` `MJPC_ROUV=1` en vraie heure : vert, 0 erreur de page ; puis la sonde rejouée en entier (vh, test, deux heures, répétition, témoin, T-5) et le parcours P0-P12 : verts. Le mode test ne se reprend pas après fermeture, pour toute heure (NOTE-V5, lu dans le code) : tu n'y touches pas.
