# Scénario de la fausse classe : pour chaque élève et chaque question,
# ce que dit sa FEUILLE, ce qu'il TOUCHE sur la tablette, ce qu'il SAISIT après.
# Les cas qui illustrent les deux règles sont posés à la main (CAS) ;
# le reste suit le niveau de l'élève, tiré au sort (graine fixe).
import json, random, sys

ev = json.load(open(sys.argv[1]))['eval_1791393134857']
Q = ev['questions']
noms = json.load(open(sys.argv[2]))
rng = random.Random(20261009)
DIFF = {'facile': 1.1, 'standard': 1.0, 'approfondi': 0.8, 'expert': 0.65}

def bonnes(q): return sorted(Q[q]['bonnes'])
def faux_au_hasard(q):
    b = bonnes(q); n = len(Q[q]['choix'])
    autres = [i for i in range(n) if i not in b]
    if len(b) == 1:
        return [rng.choice(autres)]
    k = rng.random()
    if k < 0.45:   # une bonne case oubliée
        x = b[:]; x.remove(rng.choice(b)); return sorted(x)
    if k < 0.75:   # une bonne remplacée par une fausse
        x = b[:]; x.remove(rng.choice(b)); x.append(rng.choice(autres)); return sorted(x)
    return sorted(b + [rng.choice(autres)])   # une case en trop
def erreur_de_toucher(q):
    b = bonnes(q); n = len(Q[q]['choix'])
    if len(b) == 1:
        v = b[0] + (1 if b[0] + 1 < n else -1); return [v]
    x = b[:]; x.remove(b[-1]); return sorted(x)   # la dernière bonne case oubliée

niveaux = [0.92, 0.80, 0.62, 0.55, 0.74, 0.58, 0.85, 0.66, 0.70, 0.78, 0.60, 0.48,
           0.88, 0.35, 0.72, 0.64, 0.82, 0.52, 0.68, 0.45, 0.76, 0.42, 0.57, 0.50, 0.63]

# CAS posés à la main : (élève, question 1-based) -> genre
CAS = {
  # bénéfice du doute : la feuille est fausse, la lettre touchée en classe est juste
  (2, 9): 'extremis', (5, 4): 'extremis', (10, 11): 'extremis', (18, 1): 'extremis',
  (13, 2): 'extremis', (13, 6): 'extremis', (13, 7): 'extremis', (13, 8): 'extremis',
  (3, 10): 'extremis',                         # élève sans saisie (DUVERNAY Michel)
  # la feuille ne dit aucun des choix ; à la saisie la question reste vide
  (7, 11): 'aucun_tab_juste', (19, 3): 'aucun_tab_faux', (21, 10): 'aucun_tab_faux',
  # erreur de toucher : feuille juste, lettre touchée fausse
  (1, 3): 'toucher', (4, 9): 'toucher', (9, 7): 'toucher', (12, 1): 'toucher', (16, 8): 'toucher', (20, 2): 'toucher',
  # rien touché à temps
  (15, 5): 'vide_feuille_juste', (22, 10): 'vide_feuille_faux',
  # saisie arrangée en juste alors que la feuille est fausse
  (23, 7): 'arrangee_tab_faux', (24, 3): 'arrangee_tab_juste',
}
SANS_SAISIE = {3, 11}      # index 0-based : DUVERNAY Michel, MAILLARD Noah
# CAS utilise des index d'élève 0-based et des questions 1-based

eleves = []
for i, nom in enumerate(noms):
    rows = []
    for q in range(len(Q)):
        cas = CAS.get((i, q + 1))
        p = min(0.97, niveaux[i] * DIFF[Q[q]['niveau']])
        juste = rng.random() < p
        b = bonnes(q)
        if cas in ('toucher', 'vide_feuille_juste'): juste = True
        if cas in ('extremis', 'vide_feuille_faux', 'arrangee_tab_faux', 'arrangee_tab_juste'): juste = False
        feuille = b[:] if juste else faux_au_hasard(q)
        tablette = feuille[:]
        saisie = feuille[:]
        if cas == 'extremis': tablette = b[:]
        elif cas == 'aucun_tab_juste': feuille = 'aucun'; tablette = b[:]; saisie = []
        elif cas == 'aucun_tab_faux': feuille = 'aucun'; tablette = faux_au_hasard(q); saisie = []
        elif cas == 'toucher': tablette = erreur_de_toucher(q)
        elif cas in ('vide_feuille_juste', 'vide_feuille_faux'): tablette = None
        elif cas == 'arrangee_tab_faux': saisie = b[:]
        elif cas == 'arrangee_tab_juste': tablette = b[:]; saisie = b[:]
        rows.append({'feuille': feuille, 'tablette': tablette, 'saisie': saisie, 'cas': cas})
    nom_, *pr = nom.split(' ')
    eleves.append({'nomComplet': nom, 'nom': nom_, 'prenom': ' '.join(pr),
                   'saisie_faite': i not in SANS_SAISIE, 'questions': rows})

json.dump({'eleves': eleves, 'bonnes': [bonnes(q) for q in range(len(Q))],
           'niveaux': [Q[q]['niveau'] for q in range(len(Q))]},
          open(sys.argv[3], 'w'), ensure_ascii=False, indent=1)
print('écrit', sys.argv[3], len(eleves), 'élèves')
