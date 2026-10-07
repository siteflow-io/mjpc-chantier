"""Prépare, en lecture seule, les copies locales du hub réel dont ont besoin les bancs des micros de la conscience (trait d'union) :
/tmp/dylan.json (la dictée des Dylan et le registre de sa classe), /tmp/formes.json, /tmp/textes.json. Rien n'est écrit au hub ; rien n'est déposé."""
import json, urllib.request
H='https://mjpc-hub-default-rtdb.europe-west1.firebasedatabase.app'
g=lambda c: json.load(urllib.request.urlopen(H+'/'+c+'.json'))
DID='dictee_n_1_type_brevet_avec_revisions_extrait_de_la_lettre_de_fritz-3_dylan_bob'
json.dump({'id':DID,'dictee':g('correction_dictee/'+DID),'classe':g('classes/3_dylan_bob')},open('/tmp/dylan.json','w'))
json.dump(g('correction_dictee_erreurs') or {},open('/tmp/formes.json','w')); json.dump(g('correction_dictee_textes') or {},open('/tmp/textes.json','w'))
print('copies locales prêtes (lecture seule)')
