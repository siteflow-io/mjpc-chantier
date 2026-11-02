# redaction 1.4.27-RU — candidate du 02/11/2026 (conscience n°14)

*Sur les mots de Paul (02/11) : 16:53 « pourquoi systématiquement après une relecture de bande j'ai encore des choses non validées? […] le principe devrait être presqu'en gardant le doigt appuyé sur entrée je puisse valider l'intégralité de la correction. mesure et réponds moi » ; 17:10 « 43 ok. en attendant je recomplète les arrêts manquants mais c'est pénible. » Rien n'est en ligne : la mise en ligne attend son promeus.*

- Fichier : `redaction-1.4.27-RU-candidat.html`, 910 528 o, md5 `adbb4bec3369579857d2eea60a4e5ec3`. Base en ligne : 1.4.26-RU, md5 `b17dbb81a64ea67c8b670ee30674aac3`. Maquette : branche `c14-poignees`, commit `c0b8e26f`.

## La cause, mesurée
- Le site renvoie chaque copie enregistrée, ses champs rangés par ordre alphabétique. L'app gardait la signature de son écriture dans son ordre à elle : elle ne reconnaissait jamais son propre écho (vrai site, lu sans rien écrire : 24 copies sur 24). Elle le prenait pour un changement venu d'ailleurs.
- Pire : à chaque message du site, elle revoyait toutes les copies, et remettait chacune comme le site l'avait avant que son écho à elle n'arrive. Une décision prise dans la bande pendant cet aller-retour disparaissait de la copie enregistrée ; la page ouverte la gardait à l'écran : « ✓ Copie corrigée » dans la bande, la carte incomplète.

## Ce qui change
- La signature est celle du site (`scFb` : champs triés, comme il les renvoie) : vrai site, 1.4.27, 24 copies sur 24 reconnues.
- L'écho d'une écriture d'ici plus ancienne que la dernière est ignoré (`ruEchoAncien`) ; celui de la dernière remet la copie comme au site si elle a bougé entre-temps.
- Un message du site ne revoit que les copies qu'il touche.
- La copie ouverte n'est jamais remplacée tant qu'elle porte une décision pas encore enregistrée (`ruGarderLocal`) : elle part d'abord.

## Les preuves
- Banc : le faux hub renvoie maintenant chaque écriture comme le vrai site (un flux, les champs triés, 300 ms plus tard). Nouvelle épreuve : huit décisions dans la bande, une par seconde, chacune pendant l'aller-retour de la précédente. Sur l'ancien code (contrôle) : voulues « oonnnn », la copie « oonono » : deux décisions perdues, la perte de Paul reproduite. Sur la 1.4.27 : « oonnnn » au site, dans la copie, et la copie rouverte.
- Les épreuves suivantes (enlever un sticker, « Tout effacer ») se jouent avec cet écho, comme au vrai site.
- Une attente du banc récrite (1.4.5) : une place de cadre d'un arrêt d'avant, gardée sur la ligne, ne compte plus ; elle n'était perdue que par l'écho jamais reconnu.
- Banc complet : **170 vérifications, 0 défaut**.
- Vrai site, en lecture seule : l'export et le tableau sans erreur ; l'écho reconnu sur 24 copies sur 24 (la 1.4.26 : 0).
