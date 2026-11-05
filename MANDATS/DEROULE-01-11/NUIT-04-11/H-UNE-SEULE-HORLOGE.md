# MANDAT H — LES CHRONOS DE PLUSIEURS APPAREILS, À LA MÊME SECONDE (㊵)
*Les règles communes : `REGLES-COMMUNES.md` (ce dossier). Branche : `nuit/h`, depuis `ba8d94797` (le dernier commit de `nuit/g` : toute la nuit). 30 minutes au plus.*

## 0 · CE QUI EST DIT
- ㊵ (Paul, 04/11 matin, rappelé en C16 347) : « à la télécommande, en répétition, un décalage entre les minuteurs. » ; registre : reste ouvert après la 8.85.0-⑱ ; lancé par Paul (22:22) et C16 710 (sans réponse : acquis).
- Mesuré (audit global I, C16 641) : « les appareils ne comptent pas sur la même horloge (3 s d'écart) ».

## 1 · CE QUE TU FAIS
Le chrono montre le même temps restant, à la seconde près, sur le pilote, la télécommande, un second pilote, le tableau et « Ce que voit la classe », même quand les horloges des appareils diffèrent de plusieurs secondes.

## 2 · LA SUPPOSITION (audit global I, `RAPPORT-I.md` §0.4 ; À VÉRIFIER dans le code de la 8.85.0-⑱, le chrono ayant changé)
La fin du chrono est posée à l'horloge de l'appareil qui le lance (`Date.now() + durée`) et part aux autres pilotes telle quelle ; seul le tableau se recale sur l'horloge du pilote. Une fin posée en temps restant (ou recalée par chaque appareil sur une même référence) supprime l'écart.

## 3 · LA PREUVE
Deux pilotes (ou pilote + télécommande) et le tableau, au faux hub, l'horloge d'un appareil avancée de 3 s puis retardée de 3 s : base → après, compté (l'écart entre les temps affichés, au départ, à mi-course, à la fin ; la fin, une seule fois partout) ; la sonde du chrono (sonde-10 v3, `banc/chrono-v3` `bc38d53fb`) verte ; le parcours vert.
