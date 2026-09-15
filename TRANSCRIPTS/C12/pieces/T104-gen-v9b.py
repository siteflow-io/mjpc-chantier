import json, re, hashlib
hub = json.load(open('banc/hub/site_3e.json'))
ch = hub['chapitres'][0]
seances_src = ch['seances']; seances_src = list(seances_src.values()) if isinstance(seances_src, dict) else seances_src
eleves = json.load(open('banc/hub/classes.json'))['3E Charles de Gaulle']['eleves']
if isinstance(eleves, dict): eleves = list(eleves.values())
def eid(si, di, act): return 'e' + hashlib.md5(f"{si}|{di}|{act}".encode()).hexdigest()[:8]
seances = []
for si, s in enumerate(seances_src):
    ecrans = []
    src = s['deroule']['ecrans']; n = len(src)
    for di, e in enumerate(src):
        blocs = []
        for bi, b in enumerate(e['blocs']):
            t = b['t']
            base = {'t': t, 'bid': f"b{si}{di}{bi}"}
            if t == 'consigne': base.update({'txt': b.get('txt', ''), 'el': list(b.get('etapes') or [])})
            elif t == 'question': base.update({'txt': b.get('q', ''), 'el': [r.get('r', '') for r in (b.get('reps') or []) if r.get('r')]})
            elif t == 'fiche': base.update({'txt': b.get('titre', ''), 'el': [z for z in [b.get('def', ''), b.get('corps', '')] if z]})
            elif t == 'image': base.update({'txt': b.get('legende', ''), 'ref': b.get('ref') or b.get('src') or '', 'el': []})
            elif t == 'schema': base.update({'txt': b.get('titre', '') or 'Schéma', 'el': []})
            blocs.append(base)
        act = e.get('act', '')
        # frontière d'heure (cadrage 1, 6.1) : dans la trame test, la diapo « Question-bilan » (8) fermait H1 ; base saine : H1 = 1..8, H2 = 9..n ; d9 = réactivation ; la dernière = bilan de séance
        heure = 1 if di < 8 else 2
        role = 'reactivation' if di == 8 else ('bilan' if di == n - 1 else None)
        ecrans.append({'eid': eid(si, di, act), 'act': act, 'dur': e.get('dur', 0) or 0, 'heure': heure, 'role': role, 'comp': list(e.get('comp') or []), 'blocs': blocs})
    # séance 1 : une légende de surlignage sur la diapo 10 ; une diapo vidéo (simulée) avant le bilan
    if si == 0:
        for e in ecrans:
            if e['act'].startswith('Les règles'): e['legende'] = {'jaune': 'à retenir', 'rose': 'un piège'}
        ecrans.insert(n - 1, {'eid': 'e-video-radeau', 'act': 'Vidéo : le Radeau de la Méduse (extrait)', 'dur': 6, 'heure': 2, 'role': None, 'comp': ['litt-036'],
                              'blocs': [{'t': 'video', 'bid': 'bvid', 'txt': 'Le Radeau de la Méduse, Géricault — extrait commenté', 'fichier': 'le-radeau.mp4', 'duree': 245,
                                         'reperes': [{'t': 0, 'l': "l'ouverture"}, {'t': 80, 'l': 'la composition'}, {'t': 125, 'l': "le sublime"}, {'t': 200, 'l': 'la fin'}], 'el': []}]})
    seances.append({'titre': s.get('titre') or s.get('title') or '', 'ecrans': ecrans})
notes = {"0|0": "Dire que le tableau des trois colonnes est au brouillon, pas au propre — rassurer sur l'orthographe. Insister : « ce que je me demande » est la colonne qui compte, c'est elle qui fera l'hypothèse. Ne pas dévoiler l'étape 4 avant que tout le monde ait trois lignes.",
         "0|6": "Un groupe par tableau. Chronomètre visible. Si un groupe n'a pas d'hypothèse, poser la question du point de vue : qui regarde, d'où ?"}
travail_prevu = {"0|1": "Apprendre la définition du Romantisme (fiche notion).", "0|2": "Relire les cinq tableaux et retenir un titre et un peintre."}
documents = {0: [{'id': 'doc-methode', 'titre': 'Fiche méthode : décrire une image', 'type': 'pdf', 'pages': 3}, {'id': 'doc-frise', 'titre': 'La frise du XIXe siècle', 'type': 'page', 'etapes': 17}]}
taxo = json.load(open('vis/taxo.json'))
classe = {'nom': '3E Charles de Gaulle', 'espaceED': 2, 'lienED': 'https://www.ecoledirecte.com/P/94/EspacesTravail/2/cloud',
          'prochaines': [{'iso': '2026-09-09', 'l': 'mercredi 9 septembre, 10:07'}, {'iso': '2026-09-10', 'l': 'jeudi 10 septembre, 16:04'}, {'iso': '2026-09-11', 'l': 'vendredi 11 septembre, 10:07'}]}
DATA = {'chapitre': ch.get('titre') or ch.get('title') or '', 'seances': seances, 'notes': notes, 'travailPrevu': travail_prevu, 'documents': {str(k): v for k, v in documents.items()}, 'taxo': taxo, 'classe': classe}
E = sorted([e if isinstance(e, str) else (e.get('nom', '') + ' ' + e.get('prenom', '')).strip() for e in eleves])
tpl = open('vis/v9b-template.html', encoding='utf-8').read()
out = tpl.replace('/*__DATA__*/', 'const DATA = ' + json.dumps(DATA, ensure_ascii=False).replace('</', '<\\/') + ';').replace('/*__ELEVES__*/', 'const ELEVES = ' + json.dumps(E, ensure_ascii=False) + ';')
open('C12/T104-maquette-pilotage-ordi-v9b-manipulable.html', 'w', encoding='utf-8').write(out)
print('ok', len(out), 'octets,', sum(len(s['ecrans']) for s in seances), 'diapos,', len(E), 'élèves')
