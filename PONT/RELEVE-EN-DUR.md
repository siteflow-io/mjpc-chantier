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
