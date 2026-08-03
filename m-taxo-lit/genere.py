# -*- coding: utf-8 -*-
"""M-TAXO-LIT — génération du pan littéraire. UNE seule source, DEUX destinations."""
import json,copy,hashlib
t=json.load(open('taxo.hub.json'))
assert len(t['domaines'])==5 and sum(len(f['notions']) for d in t['domaines'] for f in d['familles'])==154

# ── A = prescrit (source verbatim) · B = choix de progression de Paul ──
def N(i,lp,le,ex,niv,src):return {'id':i,'libelleProf':lp,'libelleEleve':le,'exemple':ex,'niveaux':niv,'actif':True,'source':src}
A=lambda s:'ATTENDU — '+s
B='CHOIX DE PROGRESSION DE PAUL (aucun texte officiel ne nomme cette notion)'

LITT=[
 ('fam-41','Genres et formes littéraires','Les grandes familles de textes',[
   ('litt-001','Les caractéristiques des genres littéraires','Reconnaître à quelle famille appartient un texte','Un texte avec des répliques et des didascalies est du théâtre.','5e-3e',A('5e : « Il distingue les principales caractéristiques des différents genres littéraires »')),
   ('litt-002','La tragédie','Une pièce où le héros ne peut pas échapper à son malheur','Dans Antigone, l\u2019héroïne sait qu\u2019elle va mourir et avance quand même.','4e-3e',A('4e : « À la lecture d\u2019un passage de tragédie »')),
   ('litt-003','Le merveilleux, le réalisme et le fantastique','Savoir si le récit accepte l\u2019impossible, l\u2019imite le réel, ou hésite','Dans un conte, une fée est normale ; dans un récit fantastique, elle inquiète.','4e-3e',A('4e : « Il distingue le merveilleux du réalisme, repère dans un récit le glissement propre au fantastique »')),
   ('litt-004','La nouvelle à chute','Une histoire courte dont la fin retourne tout','La dernière phrase révèle que le narrateur était le coupable.','3e',A('3e : « Il formule des hypothèses sur la fin d\u2019une nouvelle à chute »')),
   ('litt-005','Le poème en prose','Un poème écrit sans vers','Le Parti pris des choses de Francis Ponge.','3e',A('3e : « Il rédige des poèmes en prose, à la manière de Francis Ponge »')),
   ('litt-006','Le sonnet','Un poème de quatorze vers, en quatre strophes','Deux quatrains puis deux tercets.','5e-3e',A('5e : « il récite un poème court, par exemple un sonnet »')),
 ]),
 ('fam-42','Énonciation et voix narrative','Qui parle dans le texte',[
   ('litt-007','La situation d\u2019énonciation','Repérer qui parle, à qui, où et quand','« Je t\u2019attendrai ici demain » : qui est « je » ? qui est « tu » ? où est « ici » ?','5e-3e',A('5e : « Il identifie et interprète les éléments de la situation d\u2019énonciation : qui parle à qui ? où ? quand ? »')),
   ('litt-008','Les voix narratives','Plusieurs personnes racontent dans le même texte','Un roman où chaque chapitre est raconté par un personnage différent.','3e',A('3e : « textes longs impliquant plusieurs voix narratives »')),
   ('litt-009','Les énonciations imbriquées','Un récit dans le récit','Un personnage raconte une histoire à l\u2019intérieur de l\u2019histoire.','3e',A('3e : « ou plusieurs situations d\u2019énonciation imbriquées »')),
   ('litt-010','La modalisation','Les mots qui montrent si l\u2019auteur est sûr, ou doute','« Il viendrait peut-être » : le doute s\u2019entend.','3e',A('3e : « Il repère et interprète des marques de modalisation »')),
   ('litt-011','La focalisation (interne, externe, omnisciente)','Par les yeux de qui on voit l\u2019histoire','En focalisation interne, on ne sait que ce que le personnage sait.','4e-3e',B),
 ]),
 ('fam-43','La construction du récit','Comment l\u2019histoire est bâtie',[
   ('litt-012','L\u2019ellipse narrative','Un moment que le récit saute','« Dix ans plus tard… » : ces dix ans ne sont pas racontés.','4e-3e',A('4e : « Il comble l\u2019ellipse narrative »')),
   ('litt-013','L\u2019anticipation','Deviner la suite à partir d\u2019indices','Un objet montré au début servira à la fin.','4e-3e',A('4e : « il formule des hypothèses… (anticipation) »')),
 ]),
 ('fam-44','Les registres','L\u2019effet que le texte cherche à produire',[
   ('litt-014','Les procédés du comique','Ce qui fait rire, et comment','Répétition, quiproquo, mot d\u2019esprit.','5e-3e',A('5e : « il est sensible… aux différents modes de l\u2019expression du comique dont il repère certains procédés »')),
   ('litt-015','Le registre comique','Un texte qui cherche à faire rire','Une scène de farce chez Molière.','5e-3e',B),
   ('litt-016','Le registre tragique','Un texte où le malheur est inévitable','Le héros lutte contre un destin plus fort que lui.','4e-3e',B),
   ('litt-017','Le registre pathétique','Un texte qui cherche à émouvoir','La mort d\u2019un enfant racontée en détail.','4e-3e',B),
   ('litt-018','Le registre lyrique','Un texte qui dit les sentiments de celui qui parle','Un poème d\u2019amour à la première personne.','4e-3e',B),
   ('litt-019','Le registre satirique','Un texte qui se moque pour critiquer','Une fable qui ridiculise les puissants.','3e',B),
 ]),
 ('fam-45','Les figures de style','Les images et les jeux de la langue',[
   ('litt-020','La comparaison','Rapprocher deux choses avec un mot de comparaison','« Il est fort comme un lion. »','3e',A('3e : « Il a recours à la comparaison et à la métaphore pour enrichir un écrit »')),
   ('litt-021','La métaphore','Rapprocher deux choses sans mot de comparaison','« Ce lion s\u2019est jeté dans la bataille » (pour un homme).','3e',A('3e : « …et à la métaphore pour enrichir un écrit »')),
   ('litt-022','L\u2019ironie','Dire le contraire de ce qu\u2019on pense pour critiquer','« Quel beau travail ! » devant un devoir bâclé.','3e',A('3e : « il identifie l\u2019ironie en relevant les techniques employées par Voltaire »')),
   ('litt-023','Les figures d\u2019opposition','Mettre deux idées contraires côte à côte','« Je vis, je meurs. »','4e-3e',A('4e : « des indices textuels tels que les figures d\u2019opposition »')),
   ('litt-024','L\u2019antithèse','Opposer deux mots ou deux idées dans la même phrase','« Le jour succède à la nuit. »','4e-3e',B+" \u2014 les « figures d\u2019opposition » sont attendues en 4e ; l\u2019antithèse en est UN cas, que le texte ne nomme pas"),
   ('litt-025','Les images du poème (continuité, discontinuité)','Suivre comment les images se répondent dans un poème','Toutes les images parlent de la mer, puis soudain du feu.','4e-3e',A('4e : « il repère et interprète, dans un poème d\u2019amour, la continuité ou la discontinuité des images »')),
   ('litt-026','La personnification','Faire agir une chose comme une personne','« Le vent hurlait. »','5e-3e',B),
   ('litt-027','L\u2019hyperbole','Exagérer pour frapper','« Je meurs de faim. »','4e-3e',B),
   ('litt-028','La litote','Dire moins pour faire entendre plus','« Ce n\u2019est pas mauvais » pour « c\u2019est très bon ».','3e',B),
   ('litt-029','L\u2019oxymore','Réunir deux mots qui se contredisent','« Un silence assourdissant. »','3e',B),
   ('litt-030','L\u2019anaphore','Répéter le même mot en début de phrase ou de vers','« Rien n\u2019est plus… Rien n\u2019est mieux… »','4e-3e',B),
   ('litt-031','La gradation','Ranger les mots du plus faible au plus fort','« C\u2019est un roc, un pic, un cap. »','4e-3e',B),
   ('litt-032','La métonymie','Nommer une chose par une autre qui lui est liée','« Boire un verre. »','3e',B),
 ]),
 ('fam-46','L\u2019argumentation','Défendre une idée',[
   ('litt-033','Les formes argumentatives','Reconnaître les différentes façons de défendre une idée','Une fable, un discours, un article peuvent tous argumenter.','3e',A('3e : « Il identifie différentes formes argumentatives »')),
   ('litt-034','Thèse, arguments et exemples','Distinguer l\u2019idée défendue, les raisons et les preuves','La thèse : il faut lire. Un argument : cela enrichit. Un exemple : ce roman.','3e',A('3e : « il identifie la thèse défendue, les arguments et les exemples »')),
   ('litt-035','Persuader et convaincre','Toucher le cœur ou toucher la raison','Convaincre par des preuves, persuader par l\u2019émotion.','3e',A('3e : « distingue dans l\u2019argumentation le fait de persuader ou de convaincre »')),
 ]),
 ('fam-47','L\u2019analyse de l\u2019image','Lire une image comme un texte',[
   ('litt-036','Décrire une image fixe ou mobile','Dire ce qu\u2019on voit, avec les mots justes','Une photographie en noir et blanc, cadrée serré.','5e-3e',A('5e : « Il décrit des images fixes et mobiles »')),
   ('litt-037','Les plans et le cadrage','Savoir si l\u2019on voit de près ou de loin, et ce qui est choisi','Un gros plan sur un visage ; un plan large sur un paysage.','4e-3e',A('4e et 3e : « vocabulaire adapté (formes, couleurs, contrastes, plans, cadrage et point de vue) »')),
   ('litt-038','Le point de vue dans l\u2019image','D\u2019où l\u2019on regarde la scène','En plongée, on regarde d\u2019en haut : le personnage paraît écrasé.','4e-3e',A('4e et 3e : « …plans, cadrage et point de vue »')),
   ('litt-039','Le hors champ','Ce que l\u2019image ne montre pas, mais fait deviner','Un regard tourné vers quelque chose qu\u2019on ne voit pas.','3e',A('3e : « Il comprend le hors champ et l\u2019implicite »')),
 ]),
]
VERS=[
 ('fam-48','Le vers et le mètre','Compter et dire le vers',[
   ('vers-001','Le décompte des syllabes','Compter les syllabes d\u2019un vers','« Je fais souvent ce rêve » : six syllabes.','5e-3e',B),
   ('vers-002','Le rythme du vers','Dire un vers en respectant ses temps','On marque une pause au milieu de l\u2019alexandrin.','5e-3e',A('5e : « il récite un poème court… en en respectant le rythme »')),
   ('vers-003','L\u2019alexandrin','Un vers de douze syllabes','« Demain, dès l\u2019aube, à l\u2019heure où blanchit la campagne. »','5e-3e',B),
   ('vers-004','L\u2019octosyllabe','Un vers de huit syllabes','« Je me souviens des jours anciens. »','5e-3e',B),
   ('vers-005','Le décasyllabe','Un vers de dix syllabes','Fréquent dans la poésie du Moyen Âge.','4e-3e',B),
   ('vers-006','Le e muet','Un « e » qui se compte ou non selon la place','« Une rose » : le e final ne se compte pas devant une consonne.','5e-3e',B),
   ('vers-007','La césure','La coupe qui partage le vers','L\u2019alexandrin se coupe souvent après la sixième syllabe.','4e-3e',B),
   ('vers-008','L\u2019enjambement','Une phrase qui continue au vers suivant','La phrase ne s\u2019arrête pas à la fin du vers.','4e-3e',B),
   ('vers-009','Le rejet et le contre-rejet','Un mot isolé au début ou à la fin du vers','Un seul mot passe au vers suivant : il frappe.','3e',B),
 ]),
 ('fam-49','Les rimes','Les sons qui se répondent en fin de vers',[
   ('vers-010','Les mots à la rime','Relier les mots qui riment pour comprendre le poème','« Amour » rime avec « toujours » : le poème lie les deux idées.','4e-3e',A('4e : « il est capable de relier avec pertinence… dans un poème les mots à la rime »')),
   ('vers-011','La disposition des rimes (plates, croisées, embrassées)','L\u2019ordre dans lequel les rimes reviennent','AABB : plates. ABAB : croisées. ABBA : embrassées.','4e-3e',B),
   ('vers-012','La richesse des rimes (pauvre, suffisante, riche)','Combien de sons les mots ont en commun','« Ami / fourmi » : deux sons communs, rime suffisante.','4e-3e',B),
 ]),
 ('fam-50','Strophes et formes','Comment le poème est découpé',[
   ('vers-013','La strophe (distique, tercet, quatrain)','Les groupes de vers','Un quatrain a quatre vers.','5e-3e',B),
   ('vers-014','Le vers libre','Un poème sans mètre ni rime réguliers','Les vers ont des longueurs différentes.','3e',B),
 ]),
 ('fam-51','Les sonorités','Les sons qui font sens',[
   ('vers-015','Les sonorités du poème','Entendre les sons qui reviennent','Les sons durs peuvent traduire la colère.','5e-3e',A('5e : « Dans un poème, il perçoit les éléments (images, rythmes, sonorités) »')),
   ('vers-016','L\u2019allitération','La répétition d\u2019un même son de consonne','« Pour qui sont ces serpents qui sifflent sur nos têtes ? »','5e-3e',B),
   ('vers-017','L\u2019assonance','La répétition d\u2019un même son de voyelle','« Les sanglots longs des violons. »','5e-3e',B),
 ]),
]
def domaine(did,lp,le,ordre,fams):
    return {'id':did,'libelleProf':lp,'libelleEleve':le,'ordre':ordre,'actif':True,
            'familles':[{'id':fid,'libelleProf':flp,'libelleEleve':fle,'ordre':i+1,'actif':True,
                         'notions':[N(*n) for n in ns]} for i,(fid,flp,fle,ns) in enumerate(fams)]}
t['domaines'].append(domaine('dom-litterature','Le texte et ses formes','Comprendre comment un texte est fait',6,LITT))
t['domaines'].append(domaine('dom-versification','Le vers et les sons','Lire et dire la poésie',7,VERS))
t['meta']['version']='1.4.0'
t['meta']['date']='2026-08-02'
notes=t['meta'].get('notes',[])
notes.append("M-TAXO-LIT (02/08/2026) : ajout du pan littéraire — 2 domaines (dom-litterature, dom-versification), 11 familles (fam-41 à fam-51), 54 notions. Sources : « 5e/4e/3e Français — ATTENDUS de fin d'année », Éduscol, lus en entier ; programme du cycle 4 (BO 2015), applicable aux 3e et 4e en 2026-2027. Chaque notion porte un champ `source` : soit la citation verbatim de l'attendu (colonne A, 26 notions), soit « CHOIX DE PROGRESSION DE PAUL » (colonne B, 28 notions). Les niveaux de la colonne B sont des PROPOSITIONS graduées, à trancher par Paul. Aucune notion existante n'a été renommée, déplacée ni supprimée.")
t['meta']['notes']=notes
s=json.dumps(t,ensure_ascii=False,indent=1)
open('taxonomie_atelier.json','w',encoding='utf-8').write(s)
open('taxonomie.hub.json','w',encoding='utf-8').write(s)   # MÊME chaîne : identité garantie par construction
nd=len(t['domaines']);nf=sum(len(d['familles']) for d in t['domaines']);nn=sum(len(f['notions']) for d in t['domaines'] for f in d['familles'])
a=sum(1 for d in t['domaines'] for f in d['familles'] for n in f['notions'] if str(n.get('source','')).startswith('ATTENDU'))
b=sum(1 for d in t['domaines'] for f in d['familles'] for n in f['notions'] if str(n.get('source','')).startswith('CHOIX'))
print(f"{nd} domaines · {nf} familles · {nn} notions (154 + {nn-154})")
print(f"colonne A (prescrit) : {a} · colonne B (choix de Paul) : {b}")
print("md5 :",hashlib.md5(s.encode()).hexdigest(),"·",len(s.encode()),"o")
