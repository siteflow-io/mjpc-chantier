
// ───────── le moteur du récit, repris tel quel de l'ancien déroulé (moteur.html L1146-1230), sauf « M. Meney » → « M. Meney » (cadrage 2, 1.2) ─────────
var VERBES={"ouvrez":"on a ouvert","relisez":"on a relu","gardez":"on a gardé","collez":"on a collé",
 "découpez":"on a découpé","surlignez":"on a surligné","connectez-vous":"on s'est connecté",
 "rédigez":"on a rédigé","écrivez":"on a écrit","répondez":"on a répondu","lisez":"on a lu",
 "notez":"on a noté","recopiez":"on a recopié","cherchez":"on a cherché","complétez":"on a complété",
 "prenez":"on a pris","ouvrez-le":"on l'a ouvert","corrigez":"on a corrigé","justifiez":"on a justifié",
 "entourez":"on a entouré","soulignez":"on a souligné","classez":"on a classé","comparez":"on a comparé"};
var PRESENT_IMPARFAIT=[
 [/\bon ne revient pas\b/gi,"on ne revenait pas"],[/\bon ne revient\b/gi,"on ne revenait"],
 [/\bon revient\b/gi,"on revenait"],[/\bon est\b/gi,"on était"],[/\bon peut\b/gi,"on pouvait"],[/\bon doit\b/gi,"on devait"],
 [/\bon fait\b/gi,"on faisait"],[/\bon prend\b/gi,"on prenait"],[/\bon garde\b/gi,"on gardait"],
 [/\bil faut\b/gi,"il fallait"],[/\bc'est\b/gi,"c'était"],[/\bil y a\b/gi,"il y avait"],
 [/\bon y revient\b/gi,"on y revenait"],[/\bon revient\b/gi,"on revenait"],
 [/\bon écrit\b/gi,"on écrivait"],[/\bon note\b/gi,"on notait"],[/\bon lit\b/gi,"on lisait"],
 [/\bon travaille\b/gi,"on travaillait"],[/\bon commence\b/gi,"on commençait"],
 [/\bon termine\b/gi,"on terminait"],[/\bon corrige\b/gi,"on corrigeait"]
];
function imparfait(s){ var t=String(s); PRESENT_IMPARFAIT.forEach(function(p){ t=t.replace(p[0],p[1]); }); return t; }
var PERSONNE=[[/\bvous avez\b/gi,"on avait"],[/\bvous devez\b/gi,"on devait"],[/\bvous pouvez\b/gi,"on pouvait"],
 [/\bvotre\b/gi,"son"],[/\bvos\b/gi,"ses"],[/\bvous\b/gi,"on"],[/\bton\b/gi,"son"],[/\bta\b/gi,"sa"],
 [/\btes\b/gi,"ses"],[/\btu sauras\b/gi,"on saurait"],[/\btu\b/gi,"on"]];
var CONNECTEURS={
  succession:["Ensuite, ","Puis, ","On a alors ","Après quoi, "],
  ajout:["De plus, ","Par ailleurs, ","D'ailleurs, "],
  retour:["Pour finir, ","Avant de conclure, ","En dernier lieu, "],
  bilan:["Au total, ","En fin d'heure, ","Pour résumer, ","En tout, "]
};
function empreinte(s){ var x=0; for(var k=0;k<s.length;k++)x=(x*31+s.charCodeAt(k))>>>0; return x; }
function connecteur(type,graine){ var l=CONNECTEURS[type]; return l[empreinte(graine)%l.length]; }
var PERSONNE=[[/\bvous avez\b/gi,"on avait"],[/\bvous devez\b/gi,"on devait"],[/\bvous pouvez\b/gi,"on pouvait"],
 [/\bvotre\b/gi,"son"],[/\bvos\b/gi,"ses"],[/\bvous\b/gi,"on"],[/\bton\b/gi,"son"],[/\bta\b/gi,"sa"],
 [/\btes\b/gi,"ses"],[/\btu sauras\b/gi,"on saurait"],[/\btu\b/gi,"on"]];
var CONNECTEURS={
  succession:["Ensuite, ","Puis, ","On a alors ","Après quoi, "],
  ajout:["De plus, ","Par ailleurs, ","D'ailleurs, "],
  retour:["Pour finir, ","Avant de conclure, ","En dernier lieu, "],
  bilan:["Au total, ","En fin d'heure, ","Pour résumer, ","En tout, "]
};
function empreinte(s){ var x=0; for(var k=0;k<s.length;k++)x=(x*31+s.charCodeAt(k))>>>0; return x; }
function connecteur(type,graine){ var l=CONNECTEURS[type]; return l[empreinte(graine)%l.length]; }
function personne(t){ var s=String(t); PERSONNE.forEach(function(p){ s=s.replace(p[0],p[1]); }); return s; }
function recit(t){
  var d=document.createElement('div'); d.innerHTML=String(t||'');
  var s=d.textContent.trim(); if(!s)return '';
  var m=s.match(/^([A-Za-zÀ-ÿ'-]+)/);
  if(m){ var v=m[1].toLowerCase();
    if(VERBES[v]) return personne(VERBES[v])+imparfait(personne(s.slice(m[1].length)));
    /* la queue d'une consigne peut rester au présent : « …, on y revient à la fin » */
    if(/ez$/.test(v)&&v.length>3) return "on a "+v.replace(/ez$/,'é')+imparfait(personne(s.slice(m[1].length)));
  }
  if(/^je\b/i.test(s)) return "M. Meney "+personne(s.replace(/^je\s+/i,'')).replace(/^passe\b/,'est passé').replace(/^([a-zà-ÿ]+)e\b/,'$1é');
  if(/^(le|la|les|un|une|c'est|il|elle|on)\b/i.test(s)&&!/^on (a|est|s')/i.test(s))
    return imparfait(personne(s.charAt(0).toLowerCase()+s.slice(1)));
  if(/^on ne\b/i.test(s)) return imparfait(s.charAt(0).toLowerCase()+s.slice(1));
  if(/^[A-ZÀ-Þ][^.!?]{0,60}:/.test(s)){
    var t=s.split(':'); var tete=t.shift().trim(), suite=t.join(':').trim();
    if(/^aujourd/i.test(tete)) return "au programme : "+suite;
    return "on a abordé "+tete.charAt(0).toLowerCase()+tete.slice(1)+" : "+suite;
  }
  return "la consigne était : « "+s+" »";      /* une citation ne se transpose pas */
}
