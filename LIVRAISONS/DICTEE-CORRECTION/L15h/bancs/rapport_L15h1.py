"""L15h-1 — le rapport à blanc du reclassement en C, calculé PAR L'APP (ses fonctions reclassableEnC, computeNote, marquerAmenage, lacunesDe)
sur les données du hub lues en lecture seule ; aucune écriture au hub ; aucun nom (les copies sont numérotées dans l'ordre de leurs clés)."""
import sys, json, os, copy; sys.argv=['x','a','b']; sys.path.insert(0,'.')
import banc_L1 as L
from banc import Banc
F=os.environ.get('FICHIER'); D=json.load(open('/tmp/hub_l15h.json'))
b=Banc(F,1366,900); p=b.ouvrir('?mode=prof',db=copy.deepcopy(L.BASE)); p.wait_for_timeout(1200)
R=p.evaluate('''(D)=>{PROFILS=D.profils||{};var out=[];Object.keys(D.cd).sort().forEach(function(id){var d=D.cd[id],cfg=d.config||{},res=d.results||{},lac=lacunesDe(d.amenagee),cles=Object.keys(res).sort(),lignes=[],nCopies=0;
  cles.forEach(function(k,n){var c=res[k];if(!c||typeof c!=="object")return;var errs=toArr(c.errors||[]).filter(function(e){return e}),ext=toArr(c.extras||[]).filter(function(e){return e});
    var cand=errs.filter(function(e){return e.type==="L"&&e.fautif&&reclassableEnC(e.fautif,e.word)});if(!cand.length)return;nCopies++;
    var amg=c.amenagee===true,base=amg?((d.amenagee&&d.amenagee.base)||c.base||10):(cfg.base||20);
    function note(es){var e2=es,x2=ext;if(amg){var m=marquerAmenage(es,ext,true,lac);e2=m.errs;x2=m.extras;}return computeNote(e2,x2,base,cfg.bareme).note;}
    var apres=errs.map(function(e){return cand.indexOf(e)>=0?Object.assign({},e,{type:"C"}):e});
    lignes.push({copie:n+1,erreurs:cand.map(function(e){return {mot:e.word,recopie:e.fautif,limite:(/-/.test(e.fautif)!==/-/.test(e.word))&&(signesCL15h(e.fautif)===signesCL15h(e.word))&&(e.fautif.replace(/-/g,"")!==e.word.replace(/-/g,""))}}),noteEnregistree:c.note,noteAvant:note(errs),noteApres:note(apres),amenagee:amg,base:base});});
  var nL=0;cles.forEach(function(k){var c=res[k];if(c&&c.errors)toArr(c.errors).forEach(function(e){if(e&&e.type==="L"&&e.fautif)nL++})});
  out.push({id:id,titre:cfg.title||id,classe:cfg.classe,bareme:cfg.bareme||"preparee",profil:profilDe(cfg.bareme).nom,reclassables:lignes.reduce(function(t,l){return t+l.erreurs.length},0),copies:nCopies,lAvecRecopie:nL,lignes:lignes});});return out;}''',D)
b.fermer()
json.dump(R,open('/tmp/rapport_l15h1.json','w'),ensure_ascii=False,indent=1)
for x in R: print(x['classe'],'|',x['titre'][:40],'|',x['profil'],'| L recopiées',x['lAvecRecopie'],'| reclassables',x['reclassables'],'sur',x['copies'],'copies','| notes qui changent',sum(1 for l in x['lignes'] if l['noteAvant']!=l['noteApres']),'| cas limites',sum(1 for l in x['lignes'] for e in l['erreurs'] if e['limite']))
