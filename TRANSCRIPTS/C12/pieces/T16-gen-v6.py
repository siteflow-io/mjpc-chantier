import json, re
s = json.load(open('banc/hub/site_3e.json'))['chapitres'][0]
se = s['seances']; se = list(se.values()) if isinstance(se, dict) else se
seances = []
for x in se:
    ecrans = []
    for e in x['deroule']['ecrans']:
        blocs = []
        for b in e['blocs']:
            t = b['t']
            if t == 'consigne': blocs.append({'t': t, 'txt': b.get('txt', ''), 'el': list(b.get('etapes') or [])})
            elif t == 'question': blocs.append({'t': t, 'txt': b.get('q', ''), 'el': [r.get('r', '') for r in (b.get('reps') or []) if r.get('r')]})
            elif t == 'fiche': blocs.append({'t': t, 'txt': b.get('titre', ''), 'el': [z for z in [b.get('def', ''), b.get('corps', '')] if z]})
            elif t == 'image': blocs.append({'t': t, 'txt': b.get('legende', ''), 'ref': b.get('ref') or b.get('src') or '', 'el': []})
            elif t == 'schema': blocs.append({'t': t, 'txt': b.get('titre', '') or 'Schéma', 'el': []})
        ecrans.append({'act': e.get('act', ''), 'h': e.get('h', ''), 'dur': e.get('dur', 0) or 0, 'blocs': blocs})
    seances.append({'titre': x.get('title', ''), 'ecrans': ecrans})
eleves = json.load(open('banc/hub/classes.json'))['3E Charles de Gaulle']['eleves']
if isinstance(eleves, dict): eleves = list(eleves.values())
eleves = [e if isinstance(e, str) else (e.get('nom', '') + ' ' + e.get('prenom', '')).strip() for e in eleves]
notes = {"0|0": "Dire que le tableau des trois colonnes est au brouillon, pas au propre — rassurer sur l'orthographe. Insister : « ce que je me demande » est la colonne qui compte, c'est elle qui fera l'hypothèse. Ne pas dévoiler l'étape 4 avant que tout le monde ait trois lignes.",
         "0|1": "Laisser 30 secondes de silence avant de parler. Question à lancer si ça ne vient pas : « où est l'homme dans ce tableau ? »",
         "0|6": "Noter au tableau les mots qui reviennent (nature, seul, immense, orage). Ce sont eux qui serviront à la définition."}
DATA = json.dumps({'chapitre': s['title'], 'seances': seances, 'eleves': eleves, 'notes': notes}, ensure_ascii=False).replace('</', '<\\/')

html = open('vis/v6-template.html', encoding='utf-8').read().replace('/*DATA*/null', DATA)
open('C12/T16-maquette-pilotage-ordi-v6-manipulable.html', 'w', encoding='utf-8').write(html)
print('ok', len(html), 'octets,', sum(len(x['ecrans']) for x in seances), 'diapos')
