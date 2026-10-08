# Recompte indépendant des deux règles, à partir de ce que le faux hub a
# réellement reçu (réponses des tablettes, saisies papier), comparé à ce que
# l'app a affiché. Mode strict de l'évaluation : une question est juste si
# l'élève a exactement les bonnes cases.
import json, sys
OUT = sys.argv[1]
S = json.load(open(OUT + '/../scenario.json'))
hub = json.load(open(OUT + '/hub_final.json'))
res_el = json.load(open(OUT + '/resultats_eleves.json'))
bilan = json.load(open(OUT + '/bilan_fin_seance.json'))
POIDS = {'facile': 1, 'standard': 2, 'approfondi': 3, 'expert': 4}
B = S['bonnes']; NIV = S['niveaux']; W = [POIDS[n] for n in NIV]; MAXP = sum(W)
sid = [k for k in hub['qcm']['sessions']][0]
sess = hub['qcm']['sessions'][sid]
L = 'ABCDEF'

def to_list(v):  # le hub stocke les tableaux en objets {"0":..}
    if v is None: return None
    if isinstance(v, dict): return [v[k] for k in sorted(v, key=int)]
    return v
def san(s):
    import unicodedata, re
    s = unicodedata.normalize('NFD', s); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'^_+|_+$', '', re.sub(r'[^a-z0-9]+', '_', s.lower()))
def juste(ch, q): return ch is not None and sorted(ch) == sorted(B[q])
def let(ch): return '—' if not ch else ''.join(L[i] for i in sorted(ch))

lignes = []
for e in S['eleves']:
    slug = san(e['nomComplet'])
    tab = []; pap = []
    for q in range(len(B)):
        r = ((sess.get('reponses') or {}).get(str(q)) or {}).get(slug)
        tab.append(to_list(r['choix']) if r else None)
    p = (sess.get('papier') or {}).get(slug)
    if p:
        ch = p['choix']
        if isinstance(ch, dict): pap = [to_list(ch.get(str(q))) for q in range(len(B))]
        else: pap = [to_list(ch[q]) if q < len(ch) else None for q in range(len(B))]
    else: pap = None
    app = [juste(tab[q], q) for q in range(len(B))]
    papj = [juste(pap[q], q) for q in range(len(B))] if pap else None
    feuille = [r['feuille'] for r in e['questions']]
    vrai = [feuille[q] != 'aucun' and juste(feuille[q], q) for q in range(len(B))]
    d = {'nom': e['nomComplet'], 'saisie': pap is not None,
         'app_n': sum(app), 'app_pts': sum(W[q] for q in range(len(B)) if app[q])}
    if pap is not None:
        avec = [app[q] or papj[q] for q in range(len(B))]
        d.update({'pap_n': sum(papj), 'pap_pts': sum(W[q] for q in range(len(B)) if papj[q]),
                  'avec_n': sum(avec), 'avec_pts': sum(W[q] for q in range(len(B)) if avec[q]),
                  'benef': [q + 1 for q in range(len(B)) if app[q] and not papj[q]],
                  'ecart': sum(1 for q in range(len(B)) if sorted(tab[q] or []) != sorted(pap[q] or [])),
                  'flag180': [q + 1 for q in range(len(B)) if papj[q] and not app[q]]})
    d['vrai_n'] = sum(vrai); d['vrai_pts'] = sum(W[q] for q in range(len(B)) if vrai[q])
    d['cas'] = [(q + 1, e['questions'][q]['cas']) for q in range(len(B)) if e['questions'][q]['cas']]
    d['detail'] = [(q + 1, let(feuille[q]) if feuille[q] != 'aucun' else 'aucun', let(tab[q]), let(pap[q]) if pap else None, let(B[q]), W[q]) for q in range(len(B))]
    # ce que l'app a affiché
    d['app_affiche'] = res_el.get(e['nomComplet'])
    d['bilan_fin'] = bilan.get(e['nomComplet'])
    lignes.append(d)

json.dump({'MAXP': MAXP, 'W': W, 'lignes': lignes}, open(OUT + '/recompte.json', 'w'), ensure_ascii=False, indent=1)

# Contrôle : l'app affiche-t-elle la même chose que le recompte ?
ko = 0
for d in lignes:
    bf = d['bilan_fin']
    if not bf or bf['bonnes'] != d['app_n'] or bf['points'] != d['app_pts']:
        ko += 1; print('ÉCART fin de séance', d['nom'], bf, d['app_n'], d['app_pts'])
    if d['saisie']:
        a = {k.capitalize(): v for k, v in (d['app_affiche'] or [])}
        def num(s): return int(s.split('/')[0].strip()) if s else None
        if num(a.get('Score officiel')) != d['avec_n'] or num(a.get('Score papier')) != d['pap_n'] or num(a.get('Score app')) != d['app_n']:
            ko += 1; print('ÉCART page résultats', d['nom'], a, d['avec_n'], d['pap_n'], d['app_n'])
print('contrôles en désaccord :', ko)
print('%-18s %5s %5s %5s %6s %6s %6s  %s' % ('élève', 'app', 'pap', 'avec', 'pts.app', 'pts.sans', 'pts.avec', 'bénéfice sur Q'))
for d in lignes:
    if d['saisie']:
        print('%-18s %5d %5d %5d %6d %6d %6d  %s %s' % (d['nom'], d['app_n'], d['pap_n'], d['avec_n'], d['app_pts'], d['pap_pts'], d['avec_pts'], d['benef'], '' if d['vrai_pts'] == d['pap_pts'] else '(feuille réelle %d pts)' % d['vrai_pts']))
    else:
        print('%-18s %5d   —     —  %6d      —      —   SANS SAISIE (feuille réelle %d pts)' % (d['nom'], d['app_n'], d['app_pts'], d['vrai_pts']))
