# MANDAT S3 — LA MISE EN COMMUN : UNE HEURE DÉJÀ JOUÉE, LE REPORT, LA RÉPÉTITION, LA RELECTURE — POUR DEMAIN
*Les règles communes : `MANDATS/DEROULE-01-11/NUIT-04-11/REGLES-COMMUNES.md`, sauf la base et la durée. Branche : `deroule/bilan` (tu continues `2cc514c07`). **25 minutes au plus, le plus économe possible.** Les points dans l'ordre ; chacun poussé dès qu'il est prouvé.*

## 0 · CE QUI EST DIT
- Le mandat S (acquis 799, 803, 808) : une heure déjà jouée ne change pas ; si le bilan est reporté, la mise en commun part avec lui ; pareil en répétition (rien écrit pour la classe) ; la Relecture et le récit lisent la mise en commun et gardent la marque. Paul : une nouvelle version lit toujours les anciennes copies ; jamais de perte silencieuse.
- L'exécutant S2 (`2cc514c07`) : « une copie de classe d'avant S (une activité, le bilan, sans mise en commun), relue par le site actuel, reçoit une mise en commun (2 → 4 diapos). Ça ne va pas […] La correction à faire est que le site ne pose pas la mise en commun dans une heure déjà jouée dont le bilan a été vu. Où mettre ce garde-fou : dans `dr_reactNormaliserCopie` (dr-classe.js), mais pas sur la seule heure du bilan, sinon un bilan reporté arriverait sans sa mise en commun (`ordreHeureCalc0`). »

## 1 · CE QUE TU FAIS
1. La copie d'une classe reçoit la mise en commun seulement si son bilan n'a pas encore été montré à cette classe ; une copie dont le bilan a déjà été montré ne change pas. Preuve : une copie « d'avant S » au faux hub, une fois avec le bilan déjà vu (inchangée : le nombre de diapos, la Relecture, « Le chapitre », le récit), une fois avec le bilan pas encore vu (la mise en commun posée après lui) ; compté.
2. Le bilan reporté à la fin d'une heure : la mise en commun part avec lui ; la case suivante les propose ensemble ; compté.
3. En répétition : la mise en commun, Alt + B, 🅱️ marchent ; aucune écriture pour la classe ; compté.
4. La Relecture et le récit d'une heure avec une mise en commun marquée : les réponses, la participation, la marque ; compté.
Ce qui ne va pas : tu le corriges et tu le prouves. La sonde : `LIVRAISONS/DEROULE-01-11/BILAN/sonde-bilan.mjs`, complétée ; le parcours P0-P12, la case et le gel verts.
