# Le générateur de la maquette « corriger sur les scans » (C13, tour 399) : le fichier de production redaction.html,
# servi sur un faux hub (une copie anonymisée de la vraie base, lue en GET), la nouveauté écrite dedans, là où elle vivra.
# Usage : python3 gen-maquette.py <redaction.html de prod> <dossier des lectures du hub> <sortie.html>
import json, sys, random, re, hashlib
prod, lec, out = sys.argv[1], sys.argv[2], sys.argv[3]
H = open(prod, encoding='utf8').read()
J = lambda f: json.load(open(lec + '/' + f, encoding='utf8'))
cfg, cl, val, taxo = J('cfg.json'), J('cl.json'), J('val.json'), J('taxo.json')
g2 = json.load(open('grille2.json', encoding='utf8'))
# la classe anonymisée : mêmes effectifs, noms inventés (aucun élève réel)
NOMS = ['ARNAUD', 'BESNARD', 'CHAUVIN', 'DUPRÉ', 'ÉTIENNE', 'FOUCHER', 'GAUTIER', 'HERVÉ', 'JOLY', 'LEBRUN', 'MARCHAND', 'NOËL', 'OLLIVIER', 'PASQUIER',
        'RENAUD', 'SAUVAGE', 'TESSIER', 'VALLÉE', 'BRUNEAU', 'CARRÉ', 'DELAUNAY', 'FERRAND', 'GUÉRIN', 'LAMBERT', 'MOREAU', 'PERROT', 'ROUSSEL', 'TANGUY', 'BOUCHER', 'COLAS']
PREN = ['Léa', 'Hugo', 'Inès', 'Noé', 'Zoé', 'Jules', 'Manon', 'Tom', 'Chloé', 'Léon', 'Jade', 'Louis', 'Lina', 'Gabriel', 'Emma', 'Arthur', 'Rose', 'Nathan',
        'Louise', 'Sacha', 'Alice', 'Paul', 'Anna', 'Raphaël', 'Lou', 'Adam', 'Mila', 'Ethan', 'Juliette', 'Maël']
n = len(cl['eleves'])
eleves = sorted(['%s %s' % (NOMS[i], PREN[(i * 7) % len(PREN)]) for i in range(n)])
import os
if os.environ.get('CLASSE_REELLE') == '1': eleves = list(cl['eleves'])   # la classe réelle, pour jouer les copies réelles : ce fichier-là ne quitte jamais l'ordinateur de Paul (jamais au sas)
classe = {'nom': cl['nom'], 'niveau': cl.get('niveau', '3e'), 'annee': cl.get('annee', ''), 'archivee': False, 'couleur': cl.get('couleur', '#FF4D4D'), 'eleves': eleves}
cfg = dict(cfg); cfg['grille2'] = g2
rid = 'sujet_mvtd85g7_ycxjq3'
arbre = {'classes': {cfg['classe']: classe}, 'redactions': {rid: {'config': cfg, 'validations': val}}, 'taxonomie': taxo}
cle = 'mjpc_maquette_T399_hub_' + hashlib.md5(json.dumps(arbre, sort_keys=True).encode()).hexdigest()[:8]
shim = '''<script>/* MAQUETTE — le faux hub : une copie anonymisée de la base, gardée dans ce navigateur. Le vrai hub n'est jamais joint. */
(function(){const CLE=%s;const BASE0=%s;let H=null;try{H=JSON.parse(localStorage.getItem(CLE)||"null");}catch(e){}if(!H)H=JSON.parse(JSON.stringify(BASE0));
window.__FAUX_HUB=true;const seg=c=>c.split("/").filter(Boolean).map(decodeURIComponent);
const lire=c=>{let n=H;for(const k of seg(c)){if(n==null||typeof n!=="object"||!(k in n))return null;n=n[k];}return n===undefined?null:n;};
const poser=(c,v)=>{const q=seg(c);if(!q.length){H=v||{};return;}let n=H;for(let i=0;i<q.length-1;i++){if(n[q[i]]==null||typeof n[q[i]]!=="object"){if(v==null)return;n[q[i]]={};}n=n[q[i]];}if(v==null)delete n[q[q.length-1]];else n[q[q.length-1]]=JSON.parse(JSON.stringify(v));};
const garder=()=>{try{localStorage.setItem(CLE,JSON.stringify(H));}catch(e){}};const vrai=window.fetch.bind(window);
const f=function(u,o){const s=String(u);const i=s.indexOf("firebasedatabase.app");if(i<0)return vrai(u,o);let c=s.slice(i+20).split("?")[0].replace(/\\.json$/,"");const q=s.split("?")[1]||"";const m=((o&&o.method)||"GET").toUpperCase();
if(m==="GET"){let v=lire(c);if(/shallow=true/.test(q)&&v&&typeof v==="object"){const w={};Object.keys(v).forEach(k=>w[k]=true);v=w;}return Promise.resolve(new Response(JSON.stringify(v),{status:200,headers:{"Content-Type":"application/json"}}));}
let b=null;try{b=JSON.parse((o&&o.body)||"null");}catch(e){}if(m==="PATCH"&&b)Object.keys(b).forEach(k=>poser(c+"/"+k,b[k]));else poser(c,m==="DELETE"?null:b);garder();return Promise.resolve(new Response(JSON.stringify(b),{status:200}));};
window.fetch=f;window.__FAUX_HUB_FETCH=f;window.EventSource=undefined;
try{localStorage.setItem("mjpc_eleve",JSON.stringify({is_prof:true,display:"Professeur",ts:Date.now()}));}catch(e){}
window.__fauxHubRemettre=()=>{try{localStorage.removeItem(CLE);}catch(e){}indexedDB.deleteDatabase("mjpc_scans");location.href=location.pathname;};})();
</script>''' % (json.dumps(cle), json.dumps(arbre, ensure_ascii=False).replace('</', '<\\/'))
t = '<head>\n<meta charset="UTF-8">'; assert H.count(t) == 1; H = H.replace(t, t + '\n' + shim, 1)
# la nouveauté, là où elle vivra : le bouton au tableau des élèves, l'écran, son code
a = '''      📋 Classer le paquet
    </button>'''
assert H.count(a) == 1
H = H.replace(a, a + '''
    <button id="btnScan" onclick="scOuvrir()" title="Corriger sur les copies scannées : un critère à la fois, les copies défilent, le pinceau marque la copie. Le paquet reste dans ce navigateur.">📄 Corriger sur les scans</button>''')
v = '!c.telemetry); }'; assert H.count(v) == 1; H = H.replace(v, '!c.telemetry && !c.scan); }')   # une copie qui n'a que des marques est une copie touchée
v = 'const RU_SUIVI = ["tri", "paquetOrdre", "interroBookmark", "current", "modeOuvert"];'; assert H.count(v) == 1; H = H.replace(v, 'const RU_SUIVI = ["tri", "paquetOrdre", "interroBookmark", "current", "modeOuvert", "scanCurseur"];')   # l'endroit exact de la correction sur les scans
v = 'function ruReprendre() {   // la reprise exacte (l\'INIT de l\'app d\'origine, inchangé)'; assert H.count(v) == 1; H = H.replace(v, v + '\n  if (state.modeOuvert === "scan") { showDashboard(); setTimeout(() => scOuvrir(), 0); return; }   // la correction sur les scans rouverte là où tu en étais')
ecran = '''
<!-- RU-SCAN : corriger sur la copie scannée -->
<div id="scanEcran" class="sc-ecran hidden">
  <div class="sc-haut"><b>Corriger sur les scans</b><nav id="scPasses" class="sc-passes"></nav><span class="sc-esp"></span><span id="scCharge"></span><span id="scChrono" class="sc-pill" title="Le temps passé sur cette copie dans cette passe (une minute sans geste ne compte pas)."></span>
    <label class="sc-btn" title="Charger ton paquet scanné (un PDF, ou des photos) depuis ta clé : il reste dans ce navigateur, jamais au site. Une page déjà connue retrouve ses marques.">📄 Charger le paquet<input type="file" accept="application/pdf,.pdf,image/*" multiple onchange="scCharger(event)" hidden></label>
    <button class="sc-btn" onclick="scImprimerVierges()" title="Imprimer des copies vierges de l'appli : quatre repères aux coins, les lignes à leur place. Scannées, elles se remettent droites d'elles-mêmes et leurs lignes sont connues d'avance.">🖨 Copies vierges</button>
    <button class="sc-btn" onclick="SC.attrib=true;SC.ia=0;scRendre()" title="Revoir, page par page, l'élève de chaque page (ses initiales).">🔤 Les initiales</button>
    <button class="sc-btn" onclick="scFichiersED()" title="Fabriquer le fichier de chaque élève, à déposer sur École Directe : sa copie scannée et tes marques.">📨 Fichiers École Directe</button>
    <button class="sc-btn" onclick="scFermer()" title="Revenir au tableau des élèves : tout est déjà enregistré.">✕ Fermer</button></div>
  <div id="scManque" class="sc-manque"></div>
  <div class="sc-corps"><div id="scCopie" class="sc-copie" onpointerdown="scPointeur(event)"></div><div id="scPanneau" class="sc-panneau"></div></div>
  <div id="scPaquet" class="sc-paquet"></div>
</div>
<div id="scModale" class="sc-modale" onclick="if(event.target===this)scModaleFermer()"><div class="sc-modale-c"></div></div>
<div class="mq-reglage" onclick="if(document.getElementById('mqR').style.display==='block'){document.getElementById('mqR').style.display='none'}else{document.getElementById('mqR').style.display='block'}" title="Réglages de la simulation (n'existe pas dans le site).">⚙ Maquette</div>
<div id="mqR" style="display:none;position:fixed;left:8px;bottom:36px;z-index:999;background:#fdfbf7;border:1px solid #d4b87a;border-radius:9px;padding:10px 12px;max-width:380px;font:13.5px system-ui;box-shadow:0 6px 18px rgba(0,0,0,.2)"><b>Réglages de la simulation</b><p>Le site est simulé par un faux hub gardé dans ce navigateur : une copie de la vraie base, élèves aux noms inventés. Rien ne part au vrai site.</p><button class="sc-btn" onclick="window.__fauxHubRemettre()" title="Effacer tout ce qui a été fait dans la maquette (marques, réponses, pages chargées) et repartir de la base.">Tout remettre à zéro</button></div>
<style>''' + open('scan.css', encoding='utf8').read() + '''</style>
<script>''' + open('scan.js', encoding='utf8').read() + '\n' + open('eleve.js', encoding='utf8').read() + '''</script>
'''
i = H.rindex('</body>'); H = H[:i] + ecran + H[i:]
open(out, 'w', encoding='utf8').write(H)
print('maquette', out, len(H), 'octets ·', n, 'élèves inventés · clé', cle)
