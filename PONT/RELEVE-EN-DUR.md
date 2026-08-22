# RELEVÉ PERMANENT — ce qui est EN DUR dans le moteur et doit venir de MJPC
Créé le 22/08/2026 sur ordre de Paul (« ce fichier doit être tel que MJPC est conçu »).
Tenu à jour à CHAQUE découverte. Trois colonnes : quoi · source MJPC prévue · état.

1. PRENOMS (trombinoscope CV/TD/JR… en dur dans le moteur)
   → /classes/<slug>/eleves (extractEleves, la mutualisation du 3 juin)
   → ✅ BRANCHÉ (22/08 soir) : W.PRENOMS depuis extractEleves(classe), initiales dérivées « NOM Prénom », collisions suffixées. Prouvé.
2. DEBUT="10:07" (l'ancre de TOUS les horaires, constante de maquette)
   → le créneau choisi dans la tête (EDT réel)
   → ✅ BRANCHÉ : W.DEBUT depuis la tête (préparation) / le cours (classe), horaires re-ancrés partout (scène + colonne). Prouvé 14:30.
3. « À relire — mardi 2 septembre » (date de relecture du papier)
   → le PROCHAIN créneau EDT de la classe
   → ✅ BRANCHÉ (v1 : prochain jour ouvré, moteur 97 paramètre RELIRE ; l EDT hebdo par classe affinera quand il existera dans MJPC — noté).
4. Date du jour / classe / chapitre / séance / année scolaire
   → META contextuelle — ✅ COUVERT (moteur 90, prouvé au banc).
5. La copie jouée par classe (relecture/papier)
   → deroule_joue/<classe> — ✅ COUVERT (14e étendue : le sélecteur commande).
6. Chrono 7 min, tailles de police PT
   → réglages d'usage du professeur — EN DUR ASSUMÉ (pas des données MJPC).

Règle : toute nouvelle constante découverte dans le moteur qui représente une donnée
MJPC (élève, classe, créneau, date, chapitre) ENTRE dans ce relevé le jour même.

7. Tableau ELEVES=[GA,MX,…] (la PARTICIPATION du pilote — un SECOND en-dur,
   distinct de PRENOMS, documenté par le moteur lui-même : « données simulées »)
   → même source que PRENOMS (les initiales de la classe)
   → ✅ BRANCHÉ (22/08, découvert par Paul sur captures De Gaulle/Test) :
   W.ELEVES=Object.keys(PRENOMS de la classe) + re-rendu du pilote forcé ;
   classe sans élèves → panneau VIDE (honnête), jamais la maquette.

## PASSE DE RELECTURE COMPLÈTE — 22/08 soir (demandée par Paul, après le manqué ELEVES)
Méthode : le bloc d architecture du moteur EN ENTIER (il liste lui-même ses cinq
écarts assumés) + passe mécanique sur TOUTES les constantes globales majuscules
+ littéraux datés. Verdict exhaustif :

DONNÉES MJPC — toutes couvertes :
· DEBUT ✅ · PRENOMS ✅ · ELEVES ✅ (n°7) · RELIRE ✅ (moteur 97) ·
· META (classe/chapitre en dur) ✅ le littéral n est que le REPLI, la META
  contextuelle du pont fait foi (moteur 90, prouvé) ·
· ECRANS (trame de démonstration, heures 10:07→11:02 incluses) ✅ remplacée
  par chargerTrame à CHAQUE ouverture — par construction, jamais montrée.

RÉGLAGES ET LEXIQUES — en dur ASSUMÉ (pas des données MJPC) :
· CONNECTEURS, VERBES, PERSONNE, PRESENT_IMPARFAIT (la grammaire du récit) ·
· COUL, SCH_COUL, FORMES, OUTILS_MK, PT (palettes, formes, outils, tailles) ·
· MOTIFS_PART, MOTIFS_RAPPEL (libellés pédagogiques d usage).

8. AT_EDT (les 8 créneaux d établissement, dans la COUTURE) : réglage stable de
   l établissement, ASSUMÉ à court terme — deviendra l EDT réel par classe le
   jour où il existera dans MJPC (même chantier que RELIRE affiné).

Le bloc d architecture du moteur annonce aussi (écarts 1 et 4, chantiers connus) :
la fenêtre tableau à rendre autonome (second appareil) et les fiches à passer en
RÉFÉRENCE {source,ref,kind} + couche d annotation par classe — tous deux au plan,
pas des en-durs de données.

RÈGLE DE BANC AJOUTÉE (leçon du manqué ELEVES) : un branchement se prouve sur
L EFFET VISIBLE (le panneau rendu), jamais sur la variable interne seule.
