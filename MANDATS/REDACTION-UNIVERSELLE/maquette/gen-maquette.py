# Le générateur de la maquette « corriger sur les scans » (C13, tour 399) : le fichier de production redaction.html,
# servi sur un faux hub (une copie anonymisée de la vraie base, lue en GET), la nouveauté écrite dedans, là où elle vivra.
# Usage : python3 gen-maquette.py <redaction.html de prod> <dossier des lectures du hub> <sortie.html>
import json, sys, random, re, hashlib
prod, lec, out = sys.argv[1], sys.argv[2], sys.argv[3]
H = open(prod, encoding='utf8').read()
assert 'RU-SCAN : corriger' not in H, "ce fichier porte déjà la correction sur les scans : partir de la base d'avant (sas SAUVEGARDES/redaction-1.1.0-RU-avant-scans-2026-10-30.html), jamais du fichier en ligne"
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
(function(){const CLE=%s;const BASE0=%s;const fb=v=>{if(v===null||v===undefined)return null;if(Array.isArray(v))v=Object.assign({},v);if(typeof v!=="object")return v;const o={};Object.keys(v).forEach(k=>{const y=fb(v[k]);if(y!==null)o[k]=y;});const K=Object.keys(o);if(!K.length)return null;if(K.every(k=>/^(0|[1-9]\\d*)$/.test(k))){const mx=Math.max.apply(null,K.map(Number));if(mx<2*K.length){const a=[];for(let i=0;i<=mx;i++)a.push(i in o?o[i]:null);return a;}}return o;};let H=null;try{H=JSON.parse(localStorage.getItem(CLE)||"null");}catch(e){}if(!H)H=fb(JSON.parse(JSON.stringify(BASE0)));
window.__FAUX_HUB=true;const seg=c=>c.split("/").filter(Boolean).map(decodeURIComponent);
const lire=c=>{let n=H;for(const k of seg(c)){if(n==null||typeof n!=="object"||!(k in n))return null;n=n[k];}return n===undefined?null:n;};
const poser=(c,v)=>{const q=seg(c);if(!q.length){H=v||{};return;}let n=H;for(let i=0;i<q.length-1;i++){if(n[q[i]]==null||typeof n[q[i]]!=="object"){if(v==null)return;n[q[i]]={};}n=n[q[i]];}if(v==null)delete n[q[q.length-1]];else{const y=fb(JSON.parse(JSON.stringify(v)));if(y===null)delete n[q[q.length-1]];else n[q[q.length-1]]=y;}};
const garder=()=>{try{localStorage.setItem(CLE,JSON.stringify(H));}catch(e){}};const vrai=window.fetch.bind(window);
const f=function(u,o){const s=String(u);const i=s.indexOf("firebasedatabase.app");if(i<0)return vrai(u,o);let c=s.slice(i+20).split("?")[0].replace(/\\.json$/,"");const q=s.split("?")[1]||"";const m=((o&&o.method)||"GET").toUpperCase();
if(m==="GET"){let v=lire(c);if(/shallow=true/.test(q)&&v&&typeof v==="object"){const w={};Object.keys(v).forEach(k=>w[k]=true);v=w;}return Promise.resolve(new Response(JSON.stringify(v),{status:200,headers:{"Content-Type":"application/json"}}));}
let b=null;try{b=JSON.parse((o&&o.body)||"null");}catch(e){}const cleOk=v=>{if(v===null||typeof v!=="object")return true;return Object.keys(v).every(k=>k!==""&&!/[.#$\\/\\[\\]]/.test(k)&&cleOk(v[k]));};if(m!=="DELETE"&&b&&!(m==="PATCH"?Object.values(b).every(cleOk):cleOk(b))){try{localStorage.setItem("mjpc_faux_hub_refus",String(+(localStorage.getItem("mjpc_faux_hub_refus")||0)+1));}catch(e){}return Promise.resolve(new Response(JSON.stringify({error:"Invalid data; Key value can't be empty or contain $ # [ ] / or ."}),{status:400}));}/* 1.2.3 : comme le site, le faux hub refuse un nom avec . # $ / [ ] */if(m==="PATCH"&&b)Object.keys(b).forEach(k=>poser(c+"/"+k,b[k]));else poser(c,m==="DELETE"?null:b);garder();return Promise.resolve(new Response(JSON.stringify(b),{status:200}));};
window.fetch=f;window.__FAUX_HUB_FETCH=f;window.EventSource=undefined;
try{localStorage.setItem("mjpc_eleve",JSON.stringify({is_prof:true,display:"Professeur",ts:Date.now()}));}catch(e){}
window.__fauxHubRemettre=()=>{try{localStorage.removeItem(CLE);}catch(e){}indexedDB.deleteDatabase("mjpc_scans");location.href=location.pathname;};})();
</script>''' % (json.dumps(cle), json.dumps(arbre, ensure_ascii=False).replace('</', '<\\/'))
PROD = os.environ.get('PROD') == '1'   # la mise en ligne : le même fichier, sans le faux hub ni le réglage de la simulation, au vrai site
t = '<head>\n<meta charset="UTF-8">'; assert H.count(t) == 1
if not PROD:
    H = H.replace(t, t + '\n' + shim, 1)
    if os.environ.get('VERSION'): H = H.replace('var APP_VERSION = \"1.1.0-RU\";', 'var APP_VERSION = \"' + os.environ['VERSION'] + '\";')
else:
    v0 = 'var APP_VERSION = "1.1.0-RU";'; assert H.count(v0) == 1; H = H.replace(v0, 'var APP_VERSION = "' + os.environ.get('VERSION', '1.2.0-RU') + '";')
# la nouveauté, là où elle vivra : le bouton au tableau des élèves, l'écran, son code
a = '''      📋 Classer le paquet
    </button>'''
assert H.count(a) == 1
H = H.replace(a, a + '''
    <button id="btnScan" onclick="scOuvrir()" title="Corriger sur les copies scannées : un critère à la fois, les copies défilent, le pinceau marque la copie. Le paquet reste dans ce navigateur.">📄 Corriger sur les scans</button>''')
v = '!c.telemetry); }'; assert H.count(v) == 1; H = H.replace(v, '!c.telemetry && !scPlein(c.scan)); }')   # une copie qui a des marques ou des réponses est une copie touchée (une partie scan vide ne compte pas)
v = 'const corps = Object.assign({}, cp); RU_IDENTITE.forEach(f => delete corps[f]);'; assert H.count(v) == 1; H = H.replace(v, v + ' if (!scPlein(corps.scan)) delete corps.scan;')   # une partie scan vide (le site ne l'enregistre pas) n'est pas un changement : pas de réécriture à l'ouverture
v = 'const sgCorps = JSON.stringify(corps);'; assert H.count(v) == 1; H = H.replace(v, 'const sgCorps = JSON.stringify(scFb(corps));')   # comparer sous la forme du site (scFb) : rouvrir la classe ne réécrit plus les copies (1.2.0 : 28 écritures)
v = 'RU.sigCorps = RU.sigCorps || {}; RU.sigCorps[k] = JSON.stringify(corps); }'; assert H.count(v) == 1; H = H.replace(v, 'RU.sigCorps = RU.sigCorps || {}; RU.sigCorps[k] = JSON.stringify(scFb(corps)); }')
v = 'RU.sigCorps = RU.sigCorps || {}; RU.sigCorps[e] = JSON.stringify(corps); });'; assert H.count(v) == 1; H = H.replace(v, 'RU.sigCorps = RU.sigCorps || {}; RU.sigCorps[e] = JSON.stringify(scFb(corps)); });')
v = 'const RU_SUIVI = ["tri", "paquetOrdre", "interroBookmark", "current", "modeOuvert"];'; assert H.count(v) == 1; H = H.replace(v, 'const RU_SUIVI = ["tri", "paquetOrdre", "interroBookmark", "current", "modeOuvert", "scanCurseur", "scanRecopie"];')   # l'endroit exact de la correction sur les scans
v = 'function ruReprendre() {   // la reprise exacte (l\'INIT de l\'app d\'origine, inchangé)'; assert H.count(v) == 1; H = H.replace(v, v + '\n  if (state.modeOuvert === "scan") { showDashboard(); setTimeout(() => scOuvrir(), 0); return; }   // la correction sur les scans rouverte là où tu en étais')
# 1.2.3 (C14) : les noms des réponses (l'identité d'une question porte un point) s'écrivent au site sous une forme qu'il accepte, et se relisent tels quels
v = 'const sg = JSON.stringify(v); if (RU.sig[k] === sg) return; RU.sig[k] = sg;'; assert H.count(v) == 1; H = H.replace(v, 'const sg = JSON.stringify(scCles(v, true)); if (RU.sig[k] === sg) return; RU.sig[k] = sg;')
v = 'const v = ruCopie(cp[e]); delete v.nom; state.copies[e] = v;'; assert H.count(v) == 1; H = H.replace(v, 'const v = scCles(ruCopie(cp[e]), false); delete v.nom; state.copies[e] = v;')
v = 'const v = ruCopie(RU.miroir[k]); delete v.nom; state.copies[k] = v;'; assert H.count(v) == 1; H = H.replace(v, 'const v = scCles(ruCopie(RU.miroir[k]), false); delete v.nom; state.copies[k] = v;')
# 59a : lire les scans au tableau, avec le même calcul de case et sans écrire une copie.
v = 'function progressionPct(id) {'; assert H.count(v) == 1
H = H.replace(v, v + '\n  const av = scAvancement(id); if (av) return av.pct;')
v = '    const { total, complete } = noteTotale(id);\n    const pct = progressionPct(id);'; assert H.count(v) == 1
H = H.replace(v, '    const suiviScan = scAvancement(id);\n    const { total, complete } = suiviScan ? { total: 0, complete: false } : noteTotale(id);\n    const pct = progressionPct(id);')
v = '${pct === 0 ? "Non commencé" : pct === 100 ? "Corrigé" : "En cours"}'; assert H.count(v) == 1
H = H.replace(v, '${pct === 0 && !suiviScan ? "Non commencé" : pct === 100 ? "Corrigé" : "En cours"}')
v = 'title="Pourcentage d\'avancement de la correction"'; assert H.count(v) == 1
H = H.replace(v, 'title="${suiviScan ? escapeAttr(suiviScan.fait + \' rubriques corrigées sur \' + suiviScan.total + \'. Une faute posée commence la correction ; elle ne termine pas seule une rubrique.\') : \'Pourcentage d’avancement de la correction\'}"')
MQ = '''<div class="mq-reglage" onclick="if(document.getElementById('mqR').style.display==='block'){document.getElementById('mqR').style.display='none'}else{document.getElementById('mqR').style.display='block'}" title="Réglages de la simulation (n'existe pas dans le site).">⚙ Maquette</div>
<div id="mqR" style="display:none;position:fixed;left:8px;bottom:36px;z-index:999;background:#fdfbf7;border:1px solid #d4b87a;border-radius:9px;padding:10px 12px;max-width:380px;font:13.5px system-ui;box-shadow:0 6px 18px rgba(0,0,0,.2)"><b>Réglages de la simulation</b><p>Le site est simulé par un faux hub gardé dans ce navigateur : une copie de la vraie base, élèves aux noms inventés. Rien ne part au vrai site.</p><button class="sc-btn" onclick="window.__fauxHubRemettre()" title="Effacer tout ce qui a été fait dans la maquette (marques, réponses, pages chargées) et repartir de la base.">Tout remettre à zéro</button></div>
'''
ecran = '''
<!-- RU-SCAN : corriger sur la copie scannée -->
<div id="scanEcran" class="sc-ecran hidden">
  <div class="sc-haut"><b>Corriger sur les scans</b><button class="sc-btn" id="btnRecopier" onclick="rcOuvrir()" title="Recopier à côté de la photo, ligne par ligne, avec une reprise enregistrée.">✍ Recopier</button><nav id="scPasses" class="sc-passes"></nav><span class="sc-esp"></span><span id="scCharge"></span><span id="scChrono" class="sc-pill" title="Le temps passé sur cette copie dans cette passe (une minute sans geste ne compte pas)."></span>
    <button class="sc-btn" id="scZoom" onclick="scZoomLargeur()" title="Le zoom de la copie : Ctrl + molette pour grossir ou réduire, sous la souris. Clique ici pour revenir à la largeur de l'écran. Maj tenue : la loupe. Alt tenue : la copie sans les marques.">↔ Largeur</button>
    <label class="sc-btn" title="Charger ton paquet scanné (un PDF, ou des photos) depuis ta clé : il reste dans ce navigateur, jamais au site. Une page déjà connue retrouve ses marques.">📄 Charger le paquet<input type="file" accept="application/pdf,.pdf,image/*" multiple onchange="scCharger(event)" hidden></label>
    <button class="sc-btn" onclick="scImprimerVierges()" title="Imprimer des copies vierges de l'appli : quatre repères aux coins, les lignes à leur place. Scannées, elles se remettent droites d'elles-mêmes et leurs lignes sont connues d'avance.">🖨 Copies vierges</button>
    <button class="sc-btn" onclick="SC.attrib=true;SC.ia=0;scRendre()" title="Revoir, page par page, l'élève de chaque page (ses initiales).">🔤 Les initiales</button>
    <button class="sc-btn" onclick="scFichiersED()" title="Fabriquer le fichier de chaque élève, à déposer sur École Directe : sa copie scannée et tes marques.">📨 Fichiers École Directe</button>
    <button class="sc-btn" onclick="scFermer()" title="Revenir au tableau des élèves : tout est déjà enregistré.">✕ Fermer</button></div>
  <div id="scManque" class="sc-manque"></div>
  <div id="scBande" class="sc-bande" hidden></div>
  <div class="sc-corps"><div id="scCopie" class="sc-copie" onpointerdown="scPointeur(event)"></div><div id="scPanneau" class="sc-panneau"></div></div>
  <div id="scPaquet" class="sc-paquet"></div>
</div>
<div id="scLoupe" class="sc-loupe" hidden></div>
<div id="scModale" class="sc-modale" onclick="if(event.target===this)scModaleFermer()"><div class="sc-modale-c"></div></div>
''' + ('' if PROD else MQ) + '''<style>''' + open('scan.css', encoding='utf8').read() + '\n' + open('recopie.css', encoding='utf8').read() + '''</style>
<script>''' + open('scan.js', encoding='utf8').read() + '\n' + open('eleve.js', encoding='utf8').read() + '\n' + open('recopie.js', encoding='utf8').read() + '\n' + open('avancement.js', encoding='utf8').read() + ('\n' + open('stickers.js', encoding='utf8').read() if os.environ.get('STICKERS') == '1' and not PROD else '') + '''</script>
'''
i = H.rindex('</body>'); H = H[:i] + ecran + H[i:]
open(out, 'w', encoding='utf8').write(H)
print(('MISE EN LIGNE ' if PROD else 'maquette ') + out, len(H), 'octets' + ('' if PROD else ' · ' + str(n) + ' élèves inventés · clé ' + cle))
