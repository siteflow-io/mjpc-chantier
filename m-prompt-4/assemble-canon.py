#!/usr/bin/env python3
# ══ M-PROMPT-4 — canon 1.4.0 → 1.5.0 : la présentation de MJPC ══
s=open('canon.js',encoding='utf-8').read()
def sub(a,n,c=1):
    global s
    k=s.count(a)
    assert k==c, f"ANCRE {k}x : {a[:90]!r}"
    s=s.replace(a,n)

BLOC = r'''
/* ── LA PRÉSENTATION DE MJPC (v1.5.0) — une pièce commune, écrite UNE FOIS.
   Motif mesuré : les 12 prompts de l'écosystème ne portaient AUCUNE mention de
   MJPC. Une IA qui ignore où son travail atterrit conseille dans le vide — elle
   propose « une activité d'expression orale » à un professeur qui a une
   application de débat qui tourne. Un conseil hors sol fait perdre du temps et
   donne l'illusion d'une réponse.
   Elle se place EN TÊTE : l'IA doit savoir où elle est avant qu'on lui dise quoi
   faire. Deux formes : le tronc complet (là où l'IA conçoit) et une forme brève
   (là où le prompt est très ciblé — un prompt de 208 caractères ne se noie pas
   sous 2 000 de contexte).
   LA LISTE DES OUTILS EST GÉNÉRÉE depuis ce que les apps DÉCLARENT (MJPC_APP,
   remonté au hub par publierManifeste) : une liste écrite à la main mentirait à
   la première app modifiée. Une app sans `usage` paraît quand même, en le disant. ── */
var MJPC_OUTILS_CACHE=null;   /* rempli par mjpcChargerOutils ; jamais inventé */

/* La liste, GÉNÉRÉE. entrees : {id:{nom,usage,quandPas}} — telles que les apps les déclarent. */
function mjpcPromptOutils(entrees){
  var ids=Object.keys(entrees||{});
  if(!ids.length)return "  (la liste de mes applications n\u2019a pas pu \u00eatre lue : demande-la-moi avant de me conseiller une activit\u00e9.)";
  var out=[];
  ids.sort().forEach(function(id){
    var e=entrees[id]||{};
    var nom=e.nom||id;
    if(!e.usage){
      out.push("  \u2022 "+nom+" \u2014 (usage \u00e0 d\u00e9crire : cette application existe mais personne n\u2019a dit quand la proposer)");
      return;
    }
    var l="  \u2022 "+nom+" : "+e.usage;
    if(e.quandPas)l+=" \u2014 "+e.quandPas;
    out.push(l);
  });
  return out.join("\n");
}
/* Le tronc commun. {{OUTILS}} est remplacé par la liste générée. */
var MJPC_PRESENTATION=
  "O\u00d9 TON TRAVAIL ATTERRIT. Tu travailles pour MJPC (monsieurjaipascompris.fr), le site de cours d\u2019un "+
  "professeur de fran\u00e7ais en coll\u00e8ge. Les \u00e9l\u00e8ves l\u2019ouvrent surtout sur leur t\u00e9l\u00e9phone. Il est organis\u00e9 en "+
  "niveaux \u2192 chapitres \u2192 s\u00e9ances \u2192 \u00e9l\u00e9ments, et chaque \u00e9tage se publie s\u00e9par\u00e9ment : c\u2019est LE PROFESSEUR "+
  "qui publie, rien ne s\u2019ouvre aux \u00e9l\u00e8ves sans son geste, et la classe avance au fil qu\u2019il d\u00e9roule.\n\n"+
  "LES OUTILS DONT IL DISPOSE \u2014 quand tu proposes une activit\u00e9, propose-la AVEC CES OUTILS-L\u00c0, jamais dans l\u2019abstrait :\n"+
  "{{OUTILS}}\n\n"+
  "CE QUI COMMANDE.\n"+
  "  \u2022 Jamais le professeur n\u2019est mis en cause devant l\u2019\u00e9l\u00e8ve. Aucun texte destin\u00e9 \u00e0 un \u00e9l\u00e8ve ne doit dire "+
  "ou laisser entendre qu\u2019il manque quelque chose de la part du professeur : pas de \u00ab ton professeur n\u2019a pas "+
  "encore\u2026 \u00bb. On \u00e9crit de fa\u00e7on impersonnelle : \u00ab ce code sera renouvel\u00e9 en classe \u00bb.\n"+
  "  \u2022 Le papier reste premier pour ce que l\u2019\u00e9l\u00e8ve produit ; le num\u00e9rique sert au retour, au suivi et \u00e0 l\u2019entra\u00eenement.\n"+
  "  \u2022 \u00ab La m\u00e9canique me permet de d\u00e9velopper l\u2019humain \u00bb : ce qui est r\u00e9p\u00e9titif se m\u00e9canise pour lib\u00e9rer du temps d\u2019enseignement.\n"+
  "  \u2022 C\u2019est le professeur qui d\u00e9cide. Tu proposes, tu signales, tu argumentes \u2014 tu ne tranches pas, et tu ne "+
  "combles jamais un manque en l\u2019inventant sans le dire.\n\n"+
  "TU PEUX \u00caTRE CONSULT\u00c9 EN COURS DE ROUTE. S\u2019il te demande conseil \u2014 combler un trou de progression, choisir "+
  "une activit\u00e9, r\u00e9partir un travail \u2014, r\u00e9ponds AVEC LES OUTILS CI-DESSUS et avec sa taxonomie, en nommant ce "+
  "qui existe d\u00e9j\u00e0. Un conseil hors sol lui fait perdre du temps.";
/* La forme brève : pour les prompts très ciblés, où le tronc noierait la tâche. */
var MJPC_PRESENTATION_BREVE=
  "O\u00d9 TON TRAVAIL ATTERRIT. Tu travailles pour MJPC (monsieurjaipascompris.fr), le site de cours d\u2019un professeur "+
  "de fran\u00e7ais en coll\u00e8ge, que les \u00e9l\u00e8ves ouvrent surtout sur leur t\u00e9l\u00e9phone. C\u2019est LE PROFESSEUR qui publie : "+
  "rien ne s\u2019ouvre aux \u00e9l\u00e8ves sans son geste.\n"+
  "CE QUI COMMANDE. Jamais le professeur n\u2019est mis en cause devant l\u2019\u00e9l\u00e8ve (pas de \u00ab ton professeur n\u2019a pas "+
  "encore\u2026 \u00bb : on \u00e9crit de fa\u00e7on impersonnelle). Le papier reste premier pour ce que l\u2019\u00e9l\u00e8ve produit. "+
  "C\u2019est le professeur qui d\u00e9cide : tu proposes, tu ne tranches pas.\n"+
  "SI TU DOIS ME CONSEILLER AU-DEL\u00c0 DE CETTE T\u00c2CHE, demande-moi d\u2019abord la liste de mes applications : je "+
  "travaille avec des outils pr\u00e9cis, et un conseil qui les ignore me fait perdre du temps.";

/* La pièce assemblée. NE MODIFIE JAMAIS le texte persisté d'un prompt : elle se
   place devant, à la composition. */
function mjpcPromptPresentation(options){
  var o=options||{};
  if(o.breve)return MJPC_PRESENTATION_BREVE;
  return MJPC_PRESENTATION.replace('{{OUTILS}}',mjpcPromptOutils(o.outils||MJPC_OUTILS_CACHE||{}));
}
/* Le texte d'un prompt, précédé de la présentation. Un seul point d'entrée pour
   les neuf apps et le site : la pièce ne se recopie nulle part. */
function mjpcPromptAvecPresentation(texte,options){
  var p=mjpcPromptPresentation(options);
  return p+"\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\n"+String(texte==null?'':texte);
}
/* La source : ce que les apps DÉCLARENT, publié au hub par publierManifeste.
   Rien n'est inventé : une app absente du hub n'apparaît pas, une app sans usage
   apparaît en le disant. */
function mjpcChargerOutils(base,cb){
  try{
    fetch(String(base)+'/manifestes.json').then(function(r){return r.ok?r.json():null;}).then(function(v){
      var out={};
      Object.keys(v||{}).forEach(function(k){
        var e=(v[k]&&v[k].app)||null;
        if(!e||!e.id)return;
        if(e.id==='index'||e.id==='taxonomie')return;      /* le site et la taxonomie ne sont pas des outils d'élève */
        out[e.id]={nom:e.nom||e.id,usage:e.usage||'',quandPas:e.quandPas||''};
      });
      MJPC_OUTILS_CACHE=out;if(cb)cb(out);
    },function(){if(cb)cb(null);});
  }catch(e){if(cb)cb(null);}
}
'''
sub('var MJPC_CORE_VERSION="1.4.0";',BLOC+'\nvar MJPC_CORE_VERSION="1.5.0";')
sub('// v1.4.0 : + §12 zone prompt IA','// v1.5.0 : + §12 présentation de MJPC (pièce commune en tête de tous les prompts) —\n// v1.4.0 : + §12 zone prompt IA')
sub("// MJPC-CORE v1.4.0 (2026-08-01) — socle commun de l'écosystème MJPC",
    "// MJPC-CORE v1.5.0 (2026-08-01) — socle commun de l'écosystème MJPC")
# la présentation en TÊTE dans le composeur
sub("""  var bouts=[];
  if(p.directives)bouts.push(p.directives);""",
"""  var bouts=[];
  /* v1.5.0 : la présentation D'ABORD — l'IA doit savoir où elle est avant qu'on
     lui dise quoi faire. p.presentation===false la retire explicitement. */
  if(p.presentation!==false)bouts.push(mjpcPromptPresentation(p.presentation||{}));
  if(p.directives)bouts.push(p.directives);""")
open('mjpc-core.staging.js','w',encoding='utf-8').write(s)
print(f"canon 1.5.0 : {len(s)} car.")
