import json, sys, copy
o = json.load(open('/home/claude/mjpc-chantier/CONSULTANT/CHAPITRE-1/chapitre-3e-poesie-peinture-final.json'))
c = o['chapitre']; c['title'] = "Chapitre d'essai du banc"
n = 0
for s in c['seances']:
    d = s.get('deroule') or {'ecrans': []}
    ec = [e for e in d.get('ecrans', []) if 'bilan' not in (e.get('act') or '').lower() and e.get('role') not in ('bilan', 'fin', 'reactivation') and not __import__('re').search(r'o[uù] en sommes[- ]nous|r[ée]activation', e.get('act') or '', __import__('re').I)]
    for e in ec: e['blocs'] = [b for b in e.get('blocs', []) if b.get('t') != 'fiche'] or [{'t': 'texte', 'txt': e.get('act') or 'Diapo'}]
    # heures : 50 min utiles
    h, tot = 1, 0
    n += 1; aid = 'a%d' % n
    acts = [{'id': aid, 'num': n, 'titre': (s.get('title') or 'Activité')[:60]}]
    for e in ec:
        e.pop('role', None); e.pop('notes', None)
        for k in ('rev', 'vues', 'eid', 'id', 'h'): e.pop(k, None)
        dur = int(e.get('dur') or 5) or 5; e['dur'] = dur
        if tot + dur > 50: h += 1; tot = 0
        tot += dur; e['heure'] = h; e['actId'] = aid
        e['remob'] = list(e.get('comp') or []) or list(s.get('notions') or [])[:1]
    d['ecrans'] = ec; d['activites'] = acts; d.pop('travail', None)
    s['deroule'] = d
json.dump(o, open(sys.argv[1], 'w'), ensure_ascii=False)
print('séances', len(c['seances']), 'activités', n)
