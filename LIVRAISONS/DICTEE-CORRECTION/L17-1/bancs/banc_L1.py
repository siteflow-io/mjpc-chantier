"""Banc de la livraison 1 — tout passe par le geste élève (clic sur un mot masqué,
frappe, clic ✓). Compare l'ancien fichier (e440fa14) et le nouveau.
Usage : python3 banc_L1.py ANCIEN NOUVEAU [graine] [nb_sessions_fuzz]"""
import sys, json, random, copy
sys.path.insert(0, '.')
from banc import Banc, instantane

ANCIEN, NOUVEAU = sys.argv[1], sys.argv[2]
GRAINE = int(sys.argv[3]) if len(sys.argv) > 3 else 7
NFUZZ = int(sys.argv[4]) if len(sys.argv) > 4 else 20
BASE = instantane()
TEMOIN = {'zz_temoin': 'ne doit jamais disparaitre', 'bilan': 'bilan temoin'}


def classe_registre(cfg_classe):
    import unicodedata, re
    def s(x):
        x = unicodedata.normalize('NFD', x).encode('ascii', 'ignore').decode().lower()
        return re.sub(r'[^a-z0-9]+', '_', x).strip('_')
    for k in BASE['classes']:
        if s(k) == s(cfg_classe):
            return k
    return None


def nom_eleve(classe, ek):
    import unicodedata, re
    def s(x):
        x = unicodedata.normalize('NFD', x).encode('ascii', 'ignore').decode().lower()
        return re.sub(r'[^a-z0-9]+', '_', x).strip('_')
    el = BASE['classes'][classe]['eleves']
    el = el if isinstance(el, list) else list(el.values())
    for n in el:
        if s(n) == ek:
            return n
    return None


def erreurs(did, ek):
    e = BASE['correction_dictee'][did]['results'][ek].get('errors') or []
    e = e if isinstance(e, list) else [e[k] for k in sorted(e, key=int)]
    return [x for x in e if x is not None]


def ouvrir(b, did, ek, db):
    cfg = db['correction_dictee'][did]['config']
    cl = classe_registre(cfg.get('classe', ''))
    nom = nom_eleve(cl, ek)
    p = b.ouvrir('?mode=eleve&dictee=' + did, db=db, session={'display': nom, 'classe': cl})
    p.wait_for_timeout(1300)
    # Lot 2c : l'attestation se coche par le geste, comme un élève
    if p.query_selector('text=J’ai lu et compris'):
        p.get_by_text('J’ai lu et compris').click(); p.get_by_role('button', name='Commencer mon autocorrection').click(); p.wait_for_timeout(700)
    return p


def jouer(p, errs, plan, deja=()):
    """plan : {index_erreur: nb_ratés avant la bonne réponse, ou ('rates', n) laissés sans solution}"""
    ordre = sorted([i for i, e in enumerate(errs) if e.get('type') != 'A'], key=lambda i: (errs[i]['idx'], i))
    restants = [i for i in ordre if i not in deja]
    for i in ordre:
        action = plan.get(i)
        if action is None:
            continue
        rates, resout = (action[1], False) if isinstance(action, tuple) else (action, True)
        for n in range(rates + (1 if resout else 0)):
            if not p.query_selector('.popup-overlay input'):
                spans = p.query_selector_all('span.word-btn[style*="cursor: pointer"]')
                pos = restants.index(i)
                assert len(spans) == len(restants), 'mots masqués %d ≠ restants %d' % (len(spans), len(restants))
                spans[pos].click(); p.wait_for_timeout(150)
                lab = p.inner_text('.popup-overlay')
                assert ('Erreur n°%d' % (i + 1)) in lab, 'mauvaise erreur ouverte : %s (attendu n°%d)' % (lab[:40], i + 1)
            juste = resout and n == rates
            mot = errs[i]['word'] if juste else errs[i]['word'] + 'qx'
            p.fill('input[placeholder="Tape le mot correct…"]', mot)
            p.get_by_role('button', name='✓').click()
            p.wait_for_timeout(1400 if juste else 950)
        if not resout and p.query_selector('.popup-overlay'):
            bb = p.query_selector('.popup-overlay').bounding_box()
            p.mouse.click(bb['x'] + 6, bb['y'] + bb['height'] - 6); p.wait_for_timeout(250)
            assert not p.query_selector('.popup-overlay input'), 'la fenêtre de saisie ne se ferme pas'
        if resout:
            restants.remove(i)
    return ordre


def modele(errs, plan, ordre):
    att, res, rates_tot = {}, {}, 0
    for i in ordre:
        a = plan.get(i)
        if a is None:
            continue
        if isinstance(a, tuple):
            att[i] = a[1]; rates_tot += a[1]
        else:
            att[i] = a + 1; res[i] = True; rates_tot += a
    import os, math
    if os.environ.get('FORMULE') == 'a6':
        N = len([e for e in errs if e.get('type') != 'A'])
        c = max(0, rates_tot - 1); x = 5.0 if N <= 0 else max(0.0, 5 * (N - min(c, N)) / N)
        return att, res, math.floor(x * 100 + 0.5) / 100
    return att, res, round(max(0, 5 - rates_tot * 0.25), 2)


def as_dict(x):
    if x is None: return {}
    if isinstance(x, list): return {i: v for i, v in enumerate(x) if v is not None}
    return {int(k): v for k, v in x.items()}


def verifier(fiche, errs, plan, ordre, fini, nouveau, temoin):
    ko = []
    att, res, sc = modele(errs, plan, ordre)
    A, R, H = as_dict(fiche.get('attempts')), as_dict(fiche.get('results')), as_dict(fiche.get('history'))
    if {k: v for k, v in A.items()} != att: ko.append('essais %s ≠ attendu %s' % (A, att))
    if {k: bool(v) for k, v in R.items() if v} != res: ko.append('trouvées %s ≠ %s' % (R, res))
    for k, n in att.items():
        h = H.get(k) or []
        h = h if isinstance(h, list) else list(h.values())
        if len(h) != n: ko.append('mots tapés err%d : %d ≠ %d essais' % (k, len(h), n))
        if res.get(k) and not (h and h[-1].get('ok')): ko.append('err%d trouvée mais dernier mot pas juste' % k)
    if fiche.get('score') != sc: ko.append('note %s ≠ %s' % (fiche.get('score'), sc))
    tot = len([e for e in errs if e.get('type') != 'A'])
    if fiche.get('total') != tot: ko.append('total %s ≠ %s' % (fiche.get('total'), tot))
    if fiche.get('solved') != len(res): ko.append('trouvées %s ≠ %s' % (fiche.get('solved'), len(res)))
    if nouveau:
        if fini and fiche.get('status') != 'done': ko.append('statut %s ≠ done' % fiche.get('status'))
        if 'lastSeen' not in fiche: ko.append('lastSeen effacé')
        for k, v in temoin.items():
            if fiche.get(k) != v: ko.append('champ %s effacé' % k)
    return ko


def ecritures_hors(log, did, ek):
    pref = '/correction_dictee/%s/autocorrection/%s' % (did, ek)
    return [l['path'] for l in log if not l['path'].startswith(pref)]


def session(fichier, did, ek, plan, temoin=None, rouvrir=False, prefiche=None):
    db = copy.deepcopy(BASE)
    D = db['correction_dictee'][did]
    D['copyPublishedAt'] = D.get('copyPublishedAt') or 1790000000000
    D.setdefault('autocorrection', {})
    if prefiche is not None:
        D['autocorrection'][ek] = prefiche
    else:
        D['autocorrection'].pop(ek, None)
    if temoin:
        D['autocorrection'].setdefault(ek, {}).update(temoin)
    avant = json.dumps({k: v for k, v in db['correction_dictee'].items()}, sort_keys=True)
    b = Banc(fichier)
    errs = erreurs(did, ek)
    p = ouvrir(b, did, ek, db)
    ordre = jouer(p, errs, plan)
    p.wait_for_timeout(600)
    fiche = b.lire(p, 'correction_dictee/%s/autocorrection/%s' % (did, ek)) or {}
    log = b.log(p)
    apres_db = None
    statut_reouv = None
    if rouvrir:
        dbr = copy.deepcopy(db)
        dbr['correction_dictee'][did]['autocorrection'][ek] = copy.deepcopy(fiche)
        p2 = ouvrir(b, did, ek, dbr)
        p2.wait_for_timeout(1500)
        statut_reouv = (b.lire(p2, 'correction_dictee/%s/autocorrection/%s' % (did, ek)) or {}).get('status')
        log += b.log(p2)
    # tout le reste de la base doit être intact
    tout = b.lire(p, 'correction_dictee')
    tout[did]['autocorrection'].pop(ek, None)
    ref = json.loads(avant); ref[did]['autocorrection'].pop(ek, None)
    intact = (json.dumps(tout, sort_keys=True) == json.dumps(_canon(ref), sort_keys=True))
    res = dict(fiche=fiche, errs=errs, ordre=ordre, log=log, violations=list(b.violations), bloques=list(b.bloques),
               erreurs=list(b.erreurs), statut_reouv=statut_reouv, intact=intact, page=p)
    b.fermer()
    return res


def _canon(x):
    """Même forme que la relecture du simulacre (tableaux ↔ objets à clés entières)."""
    import subprocess
    return json.loads(subprocess.run(['node', '-e', CANON], input=json.dumps(x), capture_output=True, text=True).stdout)


CANON = r'''
let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{
function isObj(v){return v!==null&&typeof v==='object'}
function norm(v){if(v===undefined||v===null)return null;if(Array.isArray(v)){const o={};let n=0;v.forEach((x,i)=>{const c=norm(x);if(c!==null){o[i]=c;n++}});return n?o:null}
if(isObj(v)){const r={};let m=0;for(const k of Object.keys(v)){const c=norm(v[k]);if(c!==null){r[k]=c;m++}}return m?r:null}return v}
function toVal(v){if(!isObj(v))return v;const r={};let i=0,o=0,a=true;for(const k of Object.keys(v)){r[k]=toVal(v[k]);i++;if(a&&/^(0|[1-9]\d*)$/.test(k))o=Math.max(o,+k);else a=false}
if(a&&o<2*i){const t=[];for(const e in r)t[e]=r[e];return t}return r}
process.stdout.write(JSON.stringify(toVal(norm(JSON.parse(s)))))});
'''


def main():
    bilan = []
    def note(nom, ok, detail=''):
        bilan.append((nom, ok, detail)); print(('OK  ' if ok else 'KO  ') + nom + ('  — ' + detail if detail else ''), flush=True)

    import os
    DGD = 'dictee_preparee_5e_grandes_decouvertes-5e_herge'
    if os.environ.get('SANS_SCENARIOS'):
        return fuzz(note, bilan)
    # S1 — parcours complet : 2 ratés puis tout juste ; ancien vs nouveau
    plan = {0: 1, 1: 0, 2: 1, 3: 0, 4: 0, 5: 0}
    for nom, f, nouveau in (('ancien', ANCIEN, False), ('nouveau', NOUVEAU, True)):
        r = session(f, DGD, 'bzzinet_azzet', plan)
        ko = verifier(r['fiche'], r['errs'], plan, r['ordre'], True, nouveau, {})
        note('S1 %s — parcours complet par le geste' % nom, not ko, '; '.join(ko) or 'note %s, statut %s' % (r['fiche'].get('score'), r['fiche'].get('status')))
        if nouveau:
            note('S1 nouveau — aucune écriture hors de la fiche de l’élève', not ecritures_hors(r['log'], DGD, 'bzzinet_azzet'), str(ecritures_hors(r['log'], DGD, 'bzzinet_azzet'))[:200])
            note('S1 nouveau — reste de la base intact', r['intact'])
            note('S1 nouveau — réseau : 0 accès au vrai hub, 0 erreur de page', not r['violations'] and not r['erreurs'], str(r['violations'] + r['erreurs'])[:200])
            r['page']  # page déjà fermée avec le banc
    # S2 — réouverture d'une autocorrection terminée : le statut doit rester « terminé »
    for nom, f, nouveau in (('ancien', ANCIEN, False), ('nouveau', NOUVEAU, True)):
        r = session(f, DGD, 'bzzinet_azzet', {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0}, rouvrir=True)
        attendu = 'done'
        note('S2 %s — rouverte après la fin, statut « %s »' % (nom, r['statut_reouv']), (r['statut_reouv'] == attendu) if nouveau else True,
             '' if nouveau else '(constat de l’ancien code)')
    # S3 — champs témoins (futurs points regagnés, bilan) : un essai raté ne doit rien effacer
    for nom, f, nouveau in (('ancien', ANCIEN, False), ('nouveau', NOUVEAU, True)):
        r = session(f, DGD, 'bzzinet_azzet', {0: ('rates', 1)}, temoin=dict(TEMOIN))
        gardes = [k for k in TEMOIN if r['fiche'].get(k) == TEMOIN[k]]
        note('S3 %s — champs témoins gardés après 1 essai raté : %d/%d' % (nom, len(gardes), len(TEMOIN)), (len(gardes) == len(TEMOIN)) if nouveau else True,
             '' if nouveau else '(constat de l’ancien code)')
    # S4 — sauvetage : la fiche de Louka (mots restés en rouge) est rectifiée à l'ouverture
    DP = 'dictee_brevet_blanc_4e-4e_pythagore'; EK = 'azzinil_lzzek'
    pre = copy.deepcopy(BASE['correction_dictee'][DP]['autocorrection'][EK])
    for nom, f, nouveau in (('ancien', ANCIEN, False), ('nouveau', NOUVEAU, True)):
        r = session(f, DP, EK, {}, prefiche=copy.deepcopy(pre))
        h = as_dict(r['fiche'].get('history')).get(2) or []
        h = h if isinstance(h, list) else list(h.values())
        desc = '%d mot(s) tapé(s), dernier juste : %s ; essais %s ; note %s' % (len(h), bool(h and h[-1].get('ok')), as_dict(r['fiche'].get('attempts')).get(2), r['fiche'].get('score'))
        ok = (len(h) == 1 and h[-1].get('ok') and r['fiche'].get('score') == pre.get('score')) if nouveau else True
        note('S4 %s — Louka, erreur n°3 : %s' % (nom, desc), ok, '' if nouveau else '(constat de l’ancien code)')
        if nouveau:
            autres = {k: v for k, v in r['fiche'].items() if k not in ('history', 'lastSeen', 'status')}
            av = {k: v for k, v in _canon(pre).items() if k not in ('history', 'lastSeen', 'status')}
            note('S4 nouveau — rien d’autre ne change dans sa fiche', json.dumps(autres, sort_keys=True) == json.dumps(av, sort_keys=True))
            hs = as_dict(r['fiche'].get('history')); hp = as_dict(_canon(pre).get('history'))
            note('S4 nouveau — ses autres mots tapés intacts', all(json.dumps(hs.get(k)) == json.dumps(hp.get(k)) for k in hp if k != 2))
    return fuzz(note, bilan)


def fuzz(note, bilan):
    import os
    DEBUT = int(os.environ.get('DEBUT', '0'))
    # FUZZ — élèves tirés au hasard, plans au hasard (ratés, abandons, réouverture)
    rnd = random.Random(GRAINE)
    cands = []
    for did, D in BASE['correction_dictee'].items():
        for ek, c in (D.get('results') or {}).items():
            e = erreurs(did, ek); n = len([x for x in e if x.get('type') != 'A'])
            if 1 <= n <= 9 and classe_registre(D['config'].get('classe', '')) and nom_eleve(classe_registre(D['config']['classe']), ek):
                cands.append((did, ek))
    rnd.shuffle(cands)
    nko = 0
    for s in range(DEBUT, DEBUT + NFUZZ):
        did, ek = cands[s % len(cands)]
        errs = erreurs(did, ek)
        idx = [i for i, e in enumerate(errs) if e.get('type') != 'A']
        plan = {}
        for i in idx:
            t = rnd.random()
            if os.environ.get('TERMINER'): plan[i] = rnd.choice([0, 0, 1, 2, 4]); continue
            if t < 0.12: continue
            elif t < 0.22: plan[i] = ('rates', rnd.randint(1, 3))
            else: plan[i] = rnd.choice([0, 0, 0, 1, 1, 2, 4])
        fini = all(not isinstance(plan.get(i), tuple) and plan.get(i) is not None for i in idx)
        temoin = dict(TEMOIN) if rnd.random() < 0.5 else None
        r = session(NOUVEAU, did, ek, plan, temoin=temoin, rouvrir=fini)
        ko = verifier(r['fiche'], errs, plan, r['ordre'], fini, True, temoin or {})
        if fini and r['statut_reouv'] != 'done': ko.append('réouverture : statut %s' % r['statut_reouv'])
        hors = ecritures_hors(r['log'], did, ek)
        if hors: ko.append('écritures hors fiche %s' % hors[:3])
        if not r['intact']: ko.append('reste de la base modifié')
        if r['violations'] or r['erreurs']: ko.append('réseau/erreurs %s' % (r['violations'] + r['erreurs'])[:3])
        nko += bool(ko)
        print('   fuzz %02d %s/%s : %d erreurs, %d essais, %s%s' % (s + 1, did[:24], ek, len(idx), sum((v[1] if isinstance(v, tuple) else v + 1) for v in plan.values()),
              'terminée' if fini else 'inachevée', '' if not ko else '  KO ' + '; '.join(ko)), flush=True)
    note('FUZZ — sessions %d à %d, nouveau code, graine %d' % (DEBUT + 1, DEBUT + NFUZZ, GRAINE), nko == 0, '%d en échec' % nko)
    ok = all(x[1] for x in bilan)
    print('\nBILAN : %s (%d contrôles, %d en échec)' % ('TOUT PASSE' if ok else 'ÉCHEC', len(bilan), sum(1 for x in bilan if not x[1])))
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
