#!/usr/bin/env python3
"""
verif_edt.py — LA GARDE DU BLOC EDT.

Trois questions, une réponse chacune, rejouée à chaque promotion :

  ① le bloc EDT n'appelle QUE les fonctions du contrat ;
  ② rien hors du bloc n'appelle `edt*`, sauf les trois portes déclarées ;
  ③ tous les nœuds que l'EDT écrit au hub sont sous `/site/edt/`,
     sauf les deux exceptions nommées (brevetDates, et la variable AT_EDT
     qui n'est pas un nœud).

Usage :  python3 verif_edt.py <chemin/vers/index.html>
Sortie :  VERT si les trois passent, ROUGE sinon (code de retour 1).

À côté de `docs/outils/index_fonctions.py`, dont il reprend l'analyse
« qui appelle qui » : un balayage du texte, sans exécuter le site.
"""
import re, sys

DEBUT = 'EDT — début'
FIN   = 'EDT — fin'

# ── ① ce que le bloc a le droit d'appeler, et rien d'autre ──────────────────
CONTRAT = {
    # lecture / écriture du hub
    'secuLire', '_siteGet', 'mjpcPutJson',
    # [LOT 2ter ①] l'archivage AVANT écrasement : la mise à niveau et toute
    # écriture destructive du bloc archivent d'abord (§①, §④.2). Le modèle est
    # celui de chInjecterConfirme ; ces deux appels en sont la mécanique.
    'secuEcrire', 'atCorbeilleCle',
    # affichage du site
    'escapeHtml', 'atInfo', 'atModaleChoix', 'showProfSection', 'openProfPanel',
    # l'ouverture de l'atelier (contrat §③ : « l'ouverture d'un chapitre dans l'atelier »)
    'atelierOuvrir',
    # publication
    'isPubFor',
    # la clé-élève canonique du socle (l'absence reprend le modèle du QCM)
    'sanMJPC',
    # le pilotage (voie A — posé avec l'écran, autorisé dès maintenant)
    'atEditerChapitre', 'atVuesAller', 'atDrMonter', 'atDrJouerClic',
    'atChargerChapitres', 'loadClasses',
}
# Ce qui est mesuré en ① : parmi les appels du bloc, ceux qui désignent une
# FONCTION DU SITE (déclarée hors du bloc). Le langage, le DOM, les variables
# locales et les rappels ne sont pas des fonctions du site : ils ne sont pas
# concernés. C'est la question du contrat, posée exactement.
# ── ② les portes : les seuls appels `edt*` autorisés hors du bloc ───────────
PORTES = {
    'edtArriveeProf',      # porte ① — l'arrivée du professeur (fin de loginAsProf)
    'edtSectionPanneau',   # porte ② — le panneau prof
    'edtOuvrir',           # porte ③ — le bouton du bandeau du déroulé
}
# ── ③ les exceptions nommées, hors de /site/edt/ ───────────────────────────
#  ① le jour du DNB, écrit à l'injection du calendrier (décision de Paul, 26/08) ;
#  ② les absents d'une heure JOUÉE, écrits dans la trace de cette heure
#     (mandat §⑥ : « écrite dans la trace de l'heure (absents[]) »). Le chemin
#     n'est jamais fabriqué à la main : il vient de `edtCheminTrace`, qui le
#     retrouve à partir de la classe, de la date et du créneau.
#  ③ [LOT 2ter ①] l'ARCHIVE à la corbeille commune du site, écrite AVANT toute
#     écriture destructive du bloc (§①, §④.2). Ce n'est pas un nœud de l'EDT :
#     c'est le filet du site, déjà utilisé par chInjecterConfirme. Le chemin
#     vient de `atCorbeilleCle`, jamais fabriqué à la main.
EXCEPTIONS = {'/site/config/brevetDates/', "t.chemin+'/absents.json'", "atCorbeilleCle("}


def bloc(src):
    """Les deux bornes sont écrites DANS un commentaire : on découpe au `/*`
    qui ouvre la borne de début et au `*/` qui ferme celle de fin, sinon le
    balayage démarrerait au milieu d'un commentaire et prendrait ses
    apostrophes françaises pour des chaînes."""
    i, j = src.find(DEBUT), src.find(FIN)
    if i < 0 or j < 0:
        return None, src
    d = src.rfind('/*', 0, i)
    f = src.find('*/', j)
    if d < 0 or f < 0:
        return None, src
    f += 2
    return src[d:f], src[:d] + src[f:]


# NOTE DE MÉTHODE — on travaille sur le TEXTE BRUT, sans chercher à écarter
# commentaires et chaînes. Un balayage « intelligent » se désynchronise sur ce
# fichier (regex littérales, apostrophes françaises) et devient aveugle sans le
# dire : une garde muette est pire qu'une garde bavarde. Ici, un identifiant cité
# dans un commentaire élargit l'ensemble des « fonctions du site » — donc rend la
# garde PLUS stricte, jamais plus laxiste. L'erreur possible penche du bon côté.


def appels(txt):
    # `(?<![.\w$])` : un appel précédé d'un point est une MÉTHODE (`classList.add(`),
    # jamais une fonction globale du site. Sans ce garde-fou, la garde confond
    # `.add(` avec une éventuelle `function add(` déclarée ailleurs.
    return set(re.findall(r'(?<![.\w$])([A-Za-z_][A-Za-z0-9_]*)\s*\(', txt))


def fonctions_du_site(txt):
    """Les fonctions globales déclarées hors du bloc EDT."""
    n = set(re.findall(r'\bfunction\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(', txt))
    n |= set(re.findall(r'\bvar\s+([A-Za-z_][A-Za-z0-9_]*)\s*=\s*function\b', txt))
    return n


def verifier(chemin):
    src = open(chemin, encoding='utf-8').read()
    dedans, dehors = bloc(src)
    fautes = []

    if dedans is None:
        return ['Le bloc EDT est introuvable : les bornes « ' + DEBUT + ' » / « ' + FIN + ' » manquent.']

    # ① ce que le bloc appelle : parmi les fonctions DU SITE, seules celles du contrat
    duSite = fonctions_du_site(dehors)
    interdits = sorted(
        n for n in appels(dedans)
        if not n.startswith('edt') and n in duSite and n not in CONTRAT
    )
    if interdits:
        fautes.append('① le bloc EDT appelle hors contrat : ' + ', '.join(interdits))

    # ② qui appelle edt* hors du bloc
    dehorsAppels = sorted(n for n in appels(dehors) if n.startswith('edt') and n not in PORTES)
    if dehorsAppels:
        fautes.append('② appelé hors du bloc sans être une porte : ' + ', '.join(dehorsAppels))

    # ③ les chemins hub écrits par le bloc
    for m in re.finditer(r"mjpcPutJson\(\s*FIREBASE_BASE\s*\+\s*([^,]+),", dedans):
        expr = m.group(1)
        if 'edtChemin(' in expr:
            continue
        if any(e in expr for e in EXCEPTIONS):
            continue
        fautes.append("③ écriture hub hors de /site/edt/ et hors exception : " + expr.strip()[:90])

    # les nœuds nommés en dur dans le bloc
    for m in re.finditer(r"'(/site/[^']+)'", dedans):
        chem = m.group(1)
        if chem.startswith('/site/edt/'):
            continue
        if any(chem.startswith(e) for e in EXCEPTIONS):
            continue
        fautes.append('③ chemin hub en dur hors de /site/edt/ : ' + chem)

    return fautes


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('usage : python3 verif_edt.py <index.html>'); sys.exit(2)
    f = verifier(sys.argv[1])
    if f:
        print('ROUGE — la garde du bloc EDT refuse :')
        for x in f:
            print('  ·', x)
        sys.exit(1)
    print('VERT — ① le bloc EDT n\u2019appelle que le contrat')
    print('       ② rien hors du bloc n\u2019appelle edt* sauf les portes déclarées')
    print('       ③ tous ses nœuds sont sous /site/edt/, hors les exceptions nommées')
    sys.exit(0)
