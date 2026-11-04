# MANDAT — LE CHRONO : TAPER LA DURÉE AU CLAVIER (C16 681)
*Conscience n°16, 04/11/2026 (lancé à 19:52). L'ordre : C16 681, non commenté par Paul (19:47 : « ok ça m'a l'air correct »), donc acquis ; sa règle : quand un nouveau code remplace un ancien, ce qui marchait est repris. Un seul exécutant, neuf, très court : 20 minutes au plus.*

## 0 · CE QUE PAUL A DIT ET ACCEPTÉ
- C16 681 : « la durée ne se tape plus au clavier, seulement avec les + et − : je propose de garder aussi la frappe (un clic sur un chiffre, puis le clavier), qui existe aujourd'hui. »
- 19:51 : « ne prends pas trop de temps […] ce n'est pas l'objet du travail. »

## 1 · CE QUE TU FAIS (ce point seulement)
Dans le réglage du chrono de la maquette v2 (sas `maquette/minuteur-v2` `b7bee8798`) : un clic sur un des quatre chiffres le désigne (visible) ; un chiffre tapé au clavier le remplace et passe au chiffre suivant ; Échap ou un clic ailleurs termine ; les + et − restent. La durée lue au départ est celle qui s'affiche. Rien d'autre.

## 2 · LA SUPPOSITION (À VÉRIFIER)
`dr_minuteurPoser` (dr-classe.js, l. 1086 environ) dessine les chiffres (`.dr-mr-dig b`, `.dr-mr-pm` avec `data-d`) ; `dr_minutDuree` (l. 1082) lit la durée dans `#dr-minut-in`.

## 3 · LA PREUVE
Par le geste (clic, clavier), à 1536 × 864 : taper 0, 0, 1, 5 donne 00:15 au réglage, et ▶ lance 15 s au tableau et dans « Ce que voit la classe » ; les + et − marchent encore ; le banc de la v2 (`banc-maquette-v2.mjs`) reste à 64/64 sur la maquette régénérée (`gen-maquette.mjs`).

## 4 · LES RÈGLES
- Ton dossier : `git worktree add -b maquette/minuteur-v3 <dossier> b7bee8798` ; tu pousses sur `maquette/minuteur-v3` seulement (le code, la maquette `C16-maquette-minuteur-v3.html`, le banc et sa sortie).
- **20 minutes au plus** (l'heure par `TZ=Europe/Paris date` au début). **Économe**.
- Tu ne touches ni `AUDITS/`, ni `APP_VERSION`, ni la production, ni le vrai hub, ni `dr_classe`. Aucun vrai nom d'élève. Chaque geste nouveau porte son infobulle écrite pour Paul.
- La machine : un seul navigateur ; …/scratchpad/MACHINE-CONSCIENCE posé = pas de navigateur de ton côté ; avant chaque passage, `ps -eo comm | grep -cE '^(chrom|headless)'` à 0. Ton dossier supprimé à la fin.
- À la fin, trois lignes à la conscience (`SendMessage`, `to: "main"`).
