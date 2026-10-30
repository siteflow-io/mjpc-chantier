# La grille de la lettre (gen3.py, cadrage du 29/10) rendue lisible par l'appli : chaque question a son id, ce qui la saute,
# la forme de sa marque et ce que dit une marque ; chaque case a sa condition. Écrit pour la maquette C13 (tour 399).
import json, math, sys
src = open('../captures-29-10/gen3.py', encoding='utf8').read()
i = src.index('CRIT = ['); j = src.index('\n]\n', i) + 3
ns = {}; exec(src[:i], ns); exec(src[i:j], ns); CRIT = ns['CRIT']
def bareme(p): return {3: float(p), 2: math.floor(p * 2 / 3 * 2) / 2, 1: math.floor(p / 3 * 2) / 2, 0: 0.0}
# par point : (saute : {q: cond}, marques : {q: (forme, sens)}, étiquettes : {q: texte}, conditions des cases dans l'ordre)
# cond : 'tout' · 'n:3' · 'o:1' · 'k>=2:2,3,4,5' · 'k=1:0,1,2,3' · 'calc:lignes:a-b' · 'calc:fautes:<=x'
E, S, M = 'encadre', 'surligne', 'marge'
SPEC = [
 [  # Le thème et l'invention
  ({1: 'n:0', 2: 'n:0', 3: 'n:0', 4: 'n:0', 5: 'n:0', 6: 'n:0'}, {6: (E, 'non')}, {2: 'où tu es', 3: 'à qui tu écris', 4: 'depuis quand vous êtes séparés', 5: 'ton âge ou ton métier d’avant'},
   ['tout', 'n:4', 'n:5', 'n:2', 'n:3', 'n:1', 'n:6', 'k>=2:2,3,4,5', 'n:0']),
  ({3: 'n:2', 5: 'n:4'}, {1: (M, 'oui'), 2: (M, 'oui'), 3: (S, 'lieu'), 4: (M, 'oui')}, {1: 'où tu es et ce que tu vois', 2: 'ce qui est le plus difficile à vivre', 4: 'ton inquiétude pour l’autre'},
   ['tout', 'n:6', 'n:3', 'n:5', 'n:0', 'n:1', 'n:2', 'n:4', 'k>=2:1,2,4']),
  ({1: 'n:0', 2: 'n:0'}, {0: (S, 'oui')}, {}, ['tout', 'n:1', 'n:2', 'n:0']),
  ({1: 'n:0', 2: 'n:0', 3: 'n:0'}, {0: (S, 'oui'), 1: (S, 'non'), 3: (S, 'non')}, {}, ['tout', 'n:2', 'n:1', 'n:3', 'n:0']),
 ],
 [  # La construction des phrases
  ({1: 'o:0', 2: 'o:1'}, {0: (S, 'non'), 3: (S, 'non'), 4: (E, 'non')}, {}, ['tout', 'n:4', 'o:1', 'n:3', 'o:2', 'n:2']),
  ({}, {0: (S, 'oui'), 1: (S, 'oui'), 2: (S, 'oui'), 3: (S, 'oui'), 4: (S, 'oui'), 6: (S, 'non')}, {0: '1', 1: '2', 2: '3', 3: '4', 4: '5'},
   ['tout', 'n:5', 'n:7', 'n:6', 'k=1:0,1,2,3,4', 'k>=2:0,1,2,3,4']),
  ({1: 'n:0', 3: 'n:2'}, {0: (E, 'oui'), 2: (S, 'oui')}, {}, ['tout', 'n:1', 'n:3', 'n:2', 'n:0', 'k>=2:0,2']),
 ],
 [  # L'organisation et la lettre
  ({5: 'n:1'}, {0: (E, 'oui'), 1: (E, 'oui'), 2: (E, 'oui'), 3: (E, 'oui'), 4: (E, 'non')}, {0: 'le lieu', 1: 'la date', 2: 'la formule d’adresse', 3: 'la signature'},
   ['tout', 'n:4', 'k=1:0,1,2,3', 'n:5', 'k=2:0,1,2,3', 'k>=3:0,1,2,3']),
  ({1: 'n:0'}, {1: (E, 'non'), 3: (E, 'non')}, {}, ['tout', 'n:3', 'n:2', 'n:1', 'n:0']),
  ({}, {}, {}, ['calc:lignes:1-1.3334', 'calc:lignes:0.8-0.9999', 'calc:lignes:0.6-0.7999', 'calc:lignes:1.3334-99', 'calc:lignes:0-0.5999']),
 ],
 [  # La langue
  ({}, {}, {}, ['calc:fautes:0-0.1', 'calc:fautes:0.1001-0.23', 'calc:fautes:0.2301-0.47', 'calc:fautes:0.4701-99']),
  ({}, {0: (E, 'non'), 1: (E, 'non'), 2: (E, 'oui')}, {}, ['tout', 'n:2', 'n:1', 'n:0']),
 ],
]
QE = {'theme': "Relis le début de ta lettre : qui es-tu, d'où écris-tu, à qui, et depuis quand êtes-vous séparés ?",
      'paragraphes': "Quels sont tes trois paragraphes, et que dit chacun ?",
      'lectures': "Quel détail de ta lettre vient des textes lus en classe ?",
      'tait': "Que caches-tu à l'autre dans ta lettre, et pourquoi ?",
      'complexes': "Combien de verbes conjugués compte chacune de tes phrases ?",
      'architectures': "Où sont tes cinq architectures ? Retrouve leurs numéros dans ta marge.",
      'modalisation': "Où sont ta modalisation et ta litote ?",
      'codes': "Où sont le lieu, la date, la formule pour t'adresser à l'autre et ta signature ?",
      'personne': "Qui dit « je » dans ta lettre, et à qui parle-t-il ?",
      'lignes': "Combien de lignes as-tu écrites ?",
      'orthographe': "Combien d'erreurs as-tu trouvées et corrigées sur ta copie ?",
      'lexique': "Quels mots de 14-18 emploies-tu ?"}
SEUL = ('Ajoute', 'Dis ', 'Nomme', 'Va à la ligne', 'Remets', 'Choisis une date', 'Écris le numéro', 'Corrige tes erreurs')   # une tâche qui se vérifie d'un coup d'œil : l'élève la valide seul (1295)
PTS_SEUL = ('theme', 'paragraphes', 'architectures', 'codes', 'orthographe')   # ailleurs, toute tâche est une écriture : tu la relis
COMPTE = {   # 1304 : des cases comptées par les marques, posées avant les cases de la question (la plus sévère l'emporte)
  'personne': [(2, "Un de tes verbes change de temps sans raison au milieu d'un passage.", 'une marque sur « les temps ? »', "Garde le même temps dans ce passage.", 1, 'm:3:1-1'),
               (1, "Plusieurs de tes verbes changent de temps sans raison au milieu d'un passage.", 'deux marques ou plus sur « les temps ? »', "Garde le même temps dans chacun de ces passages.", 1, 'm:3:2-99')],
  'complexes': [(2, "Une ou deux de tes phrases sont simples : un seul verbe conjugué.", 'une ou deux phrases simples marquées', "Ajoute-leur une proposition subordonnée relative.", 1, 'm:0:1-2'),
                (1, "Plusieurs de tes phrases sont simples : un seul verbe conjugué.", 'trois phrases simples marquées ou plus', "Transforme-les en phrases complexes, avec une relative.", 1, 'm:0:3-99')]}
ids = [['theme', 'paragraphes', 'lectures', 'tait'], ['complexes', 'architectures', 'modalisation'], ['codes', 'personne', 'lignes'], ['orthographe', 'lexique']]
out = {'version': 1, 'source': 'sujet lettre 30 lignes 3e — réécrite le 29/10', 'criteres': []}
for ci, (nom, poids, pts) in enumerate(CRIT):
    cr = {'id': ['theme', 'construction', 'organisation', 'langue'][ci], 'nom': nom, 'poids': poids, 'points': []}
    for pi, (titre, p, qs, cs) in enumerate(pts):
        saute, marq, etiq, conds = SPEC[ci][pi]
        assert len(conds) == len(cs), (titre, len(conds), len(cs))
        b = bareme(p)
        pt = {'id': ids[ci][pi], 'titre': titre, 'poids': p, 'bareme': {str(k): v for k, v in b.items()}, 'questions': [], 'cases': [], 'questionEleve': QE[ids[ci][pi]]}
        for qi, (g, q, sk) in enumerate(qs):
            if g == 'calculé': pt['calcul'] = 'lignes' if 'lignes' in q.lower() and 'part des 30' in q else 'fautes'; continue
            d = {'id': qi, 'texte': q, 'moment': g}
            if qi in saute: d['saute'] = saute[qi]; d['sauteDit'] = sk
            if qi in marq: d['marque'] = {'forme': marq[qi][0], 'sens': marq[qi][1]}
            if qi in etiq: d['etiquette'] = etiq[qi]
            pt['questions'].append(d)
        for niv, fait, quand, rep, cite, cond in COMPTE.get(pt['id'], []):
            pt['cases'].append({'niveau': niv, 'fait': fait, 'quand': quand, 'tache': rep, 'cite': bool(cite), 'si': cond, 'relire': not (pt['id'] in PTS_SEUL and rep.startswith(SEUL))})
        for (niv, fait, quand, rep, cite), cond in zip(cs, conds):
            pt['cases'].append({'niveau': niv, 'fait': fait, 'quand': quand, 'tache': rep, 'cite': bool(cite), 'si': cond, 'relire': bool(rep) and not (pt['id'] in PTS_SEUL and rep.startswith(SEUL))})
        cr['points'].append(pt)
    out['criteres'].append(cr)
print(json.dumps(out, ensure_ascii=False, indent=0)[:600], file=sys.stderr)
json.dump(out, open('grille2.json', 'w', encoding='utf8'), ensure_ascii=False)
print('points', sum(len(c['points']) for c in out['criteres']), 'questions', sum(len(p['questions']) for c in out['criteres'] for p in c['points']), 'cases', sum(len(p['cases']) for c in out['criteres'] for p in c['points']))
