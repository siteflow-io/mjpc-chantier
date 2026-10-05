const A=require('./analyse_l151.js'),fs=require('fs');
const R=JSON.parse(fs.readFileSync('/tmp/l151a.json','utf8')),D=JSON.parse(fs.readFileSync('/tmp/hub_l15h.json','utf8')).cd;
const nomCat={},comCat={},exCat={},famCat={};A.CATEGORIES_L151.forEach(c=>{nomCat[c.id]=c.nom;comCat[c.id]=c.commentaire;exCat[c.id]=c.exemples[0];famCat[c.id]=c.famille;});nomCat['cat-autre']='Autre';comCat['cat-autre']="Compare lettre à lettre avec le mot juste : « {mot} ».";famCat['cat-autre']='autre';
let L=[];const p=x=>L.push(x);
p("# L15.1a — l'analyse des erreurs, À BLANC (rien n'est changé dans l'app ni au hub)");p("");
p("*Calculé le 05/10 par le moteur de L15.1 (`analyse_l151.js`, joint) sur les copies du hub, lues en lecture seule. Aucun nom : les copies sont numérotées dans l'ordre de leurs clés. Seules les erreurs G, L et C **avec recopie** ont un écart à analyser (sans recopie : le commentaire honnête par type, comme aujourd'hui).*");p("");
p("## Ce que tu fais ce soir");p("1. **Les commentaires par catégorie** (tableau 2) : ce sont mes propositions ; réécris-les dans tes mots (les trous {forme}, {mot}, {lettre}… sont remplis automatiquement). Ils iront au hub, éditables ensuite dans Réglages.");p("2. **Les lignes** (tableau 4) : raye celles où le commentaire est **hors sujet** ; dis-le, la règle sera corrigée (cible : 0 hors sujet).");p("3. **La césure** (tableau 5) : corrige les mots mal coupés ; la fonction doit donner 100 % de la liste relue.");p("4. Dis « ok » : L15.1b-1 (la dictée) code ce que tu as validé.");p("");
p("## 1. Les taux, dictée par dictée");p("| Dictée | Erreurs G/L/C | Recopiées | **Reconnues** | Commentaire honnête (« autre ») | dont : écart reconnu mais d'une famille qui ne va pas avec le type posé |");p("|---|---|---|---|---|---|");
let T={n:0,r:0,a:0,h:0};R.dictees.forEach(x=>{p(`| ${x.lib} — ${x.titre} | ${x.n} | ${x.nRec} | **${x.reconnus} (${Math.round(100*x.reconnus/x.nRec)} %)** | ${x.nAutre} | ${x.nHors} |`);T.n+=x.nRec;T.r+=x.reconnus;T.a+=x.nAutre;T.h+=x.nHors;});
p(`| **Total** | | **${T.n}** | **${T.r} (${Math.round(100*T.r/T.n)} %)** | **${T.a}** | ${T.h} |`);p("");
p("*Les « 514 erreurs des 3E » du complément : 254 (Dylan) + 260 (Franklin), tous types ; 460 sont des G/L/C recopiées, ce sont elles qui ont un écart. Côté élève, la catégorie de repli s'appellera « autre » ; « non reconnu » n'existera que côté professeur.*");p("");
p("## 2. Les catégories (des objets : id, famille, compétence, motifs, commentaire) — leur commentaire proposé, à réécrire");p("| Catégorie (id) | Famille | Compétence | Erreurs | Commentaire proposé | Exemple |");p("|---|---|---|---|---|---|");
const cats=A.CATEGORIES_L151.map(c=>c.id).concat(['cat-autre']);
cats.forEach(id=>{const v=R.categories[id]||{n:0};const c=A.CATEGORIES_L151.find(x=>x.id===id)||{competence:'',exemples:[]};const ex=(c.exemples||[])[0];p(`| ${nomCat[id]} (\`${id}\`) | ${famCat[id]} | ${c.competence||''} | ${v.n} | ${comCat[id].replace(/\|/g,'/')} | ${ex?'« '+ex.forme+' » → « '+ex.mot+' »':''} |`);});p("");
p("*« Mot long » (trois syllabes ou plus, jamais un nombre de lettres) : la ligne « Mot long — décompose-le en syllabes : dé·com·po·sé. » s'ajoute au commentaire (tes mots).*");p("");
p("## 3. Ce qui reste en « autre » (le commentaire honnête) — trié par fréquence");p("| Forme → mot | Fois |");p("|---|---|");
Object.entries(R.autres).sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>p(`| ${k} | ${n} |`));p("");
p("## 4. Les erreurs, une ligne chacune");p("| Dictée | Copie | Type | Forme → mot | Catégorie | Commentaire proposé | Mot long |");p("|---|---|---|---|---|---|---|");
R.lignes.forEach(l=>p(`| ${l.d} | n° ${l.copie} | ${l.type} | « ${l.forme} » → « ${l.mot} » | ${l.reconnu?nomCat[l.cat]+(l.ecarts.length>1?' + '+nomCat[l.ecarts[1]]:''):'**autre**'+(l.hors?' (écart '+nomCat[l.cat]+', pas pour un '+l.type+')':'')} | ${l.com.replace(/\|/g,'/')} | ${l.long?'oui':''} |`));p("");
/* 5. la césure : 150 mots des textes des 3E, 4E, Hugo, et le brevet blanc 3E */
const vus={},mots=[];Object.values(D).forEach(d=>{const t=(d.config||{}).text||'';t.split(/[^A-Za-zÀ-ÿœæŒÆ'’-]+/).forEach(w=>{w=w.replace(/^['’-]+|['’-]+$/g,'');const k=w.toLowerCase();if(w.length>=4&&!vus[k]){vus[k]=1;mots.push(w);}})});
const choisis=[];const parN={};mots.forEach(w=>{const n=A.syllabes(w).length;(parN[n]=parN[n]||[]).push(w);});
[1,2,3,4,5,6].forEach(n=>{(parN[n]||[]).slice(0,{1:20,2:45,3:45,4:25,5:10,6:5}[n]).forEach(w=>choisis.push(w));});
while(choisis.length<150&&mots.length){const w=mots.find(x=>choisis.indexOf(x)<0);if(!w)break;choisis.push(w);}
p("## 5. La césure — 150 mots des dictées (3E, 4E, Hugo), la césure proposée, à corriger");p("*Règle (tes mots du 05/10) : la langue parlée ; le -e muet final ne fait pas de syllabe (« belle » = 1, « charmante » = char·mante) ; « mot long » = 3 syllabes ou plus.*");p("");p("| Mot | Césure proposée | Syllabes | Mot long |");p("|---|---|---|---|");
choisis.slice(0,150).forEach(w=>{const s=A.syllabes(w);p(`| ${w} | ${A.cesureL151(w)} | ${s.length} | ${s.length>=3?'oui':''} |`)});
fs.writeFileSync('RAPPORT-A-BLANC-L15.1a.md',L.join("\n"));console.log('lignes',L.length,'| mots césure',Math.min(150,choisis.length));
