const fs=require('fs');
eval(fs.readFileSync('bloc_identite.js','utf8'));
const cal=JSON.parse(fs.readFileSync('cal.json','utf8'));
const clone=o=>JSON.parse(JSON.stringify(o));

console.log("── PREUVE 1 · pose des id sur le calendrier réel");
let c=clone(cal), tot=0;
[['evenementsClasse','evenementsClasse'],['jalons','jalons'],['etablissement','etablissement'],['feries','feries'],['vacances','vacances']]
 .forEach(([cle,fam])=>{ const r=edtPoserIds(c[cle],fam,null);
   console.log(`   ${cle.padEnd(18)} ${String(c[cle].length).padStart(3)} éléments → ${r.poses} id posés, ${r.collisions.length} collision(s)`);
   tot+=r.poses; });
console.log("   TOTAL id posés :",tot,"| tous uniques :",
  (()=>{const v=[].concat(c.evenementsClasse,c.jalons,c.etablissement,c.feries,c.vacances).map(e=>e.id);
        return new Set(v).size===v.length;})());

console.log("\n── id JAMAIS recalculé : seconde passe sur le même objet");
const r2=edtPoserIds(c.evenementsClasse,'evenementsClasse',null);
console.log("   id posés à la 2e passe :",r2.poses,"(attendu 0)");

console.log("\n── déterminisme : même entrée, deux machines → même id");
const a=edtPoserIds(clone(cal).evenementsClasse,'evenementsClasse',null);
const A=edtPoserIds(clone(cal).evenementsClasse,'evenementsClasse',null);
console.log("   identiques :", JSON.stringify(a)===JSON.stringify(A));

console.log("\n── PREUVE 3 · la coche ne se trompe plus (insertion en tête)");
const cible=c.evenementsClasse[4], idCible=cible.id;
const apres=clone(c.evenementsClasse);
apres.unshift({libelle:"Événement inséré en tête",niveau:"6e",debut:"2026-09-01",fin:"2026-09-01",classes:[]});
edtPoserIds(apres,'evenementsClasse',null);
const trouve=apres.find(e=>e.id===idCible);
console.log(`   coche posée sur « ${cible.libelle} » (5e rang) → après insertion, elle est sur « ${trouve.libelle} » au rang ${apres.indexOf(trouve)+1}`);
console.log("   même événement :", trouve.libelle===cible.libelle);

console.log("\n── PREUVE 15 · biunivocité, 4 homonymes dont 2 permutés + 1 identique");
const h=[{libelle:"Conseil de classe",niveau:"3e",debut:"2026-11-16"},
         {libelle:"Conseil de classe",niveau:"3e",debut:"2026-11-17"},
         {libelle:"Conseil de classe",niveau:"3e",debut:"2026-11-18"},
         {libelle:"Conseil de classe",niveau:"3e",debut:"2026-11-19"}];
const ex=clone(h); edtPoserIds(ex,'evenementsClasse',null);
const ent=[clone(h[1]),clone(h[0]),clone(h[3]),clone(h[2])].map(e=>{delete e.id;return e;});
const ap=edtApparier(ent,ex,'evenementsClasse');
console.log("   forts :",ap.fort.length,"| faibles :",ap.faible.length,"| ambigus :",ap.ambigus.length);
console.log("   aucune permutation :", ap.fort.every(p=>p.entrant.debut===p.existant.debut));
const ex5=clone(ex); ex5.push(Object.assign({},h[0])); edtPoserIds(ex5,'evenementsClasse',null);
const ap5=edtApparier([{libelle:"Conseil de classe",niveau:"3e",debut:"2026-11-16"}],ex5,'evenementsClasse');
console.log("   5e strictement identique → ambiguïtés nommées :",ap5.ambigus.length,"| rien d'appliqué :",ap5.fort.length===0);

console.log("\n── PREUVE 4 · différentiel, deux bancs opposés");
const base=clone(c.evenementsClasse);
const mod=clone(base).map(e=>({...e}));
mod[0].libelle+=" (retouché)"; mod[1].libelle+=" bis"; mod[2].libelle=mod[2].libelle.replace(/e/,'é');
mod[3].debut="2026-11-17"; mod[3].fin="2026-11-17";
mod.splice(5,1);
mod.push({libelle:"Nouvel événement",niveau:"4e",debut:"2027-03-02",fin:"2027-03-02",classes:[]});
const avecId=edtApparier(clone(mod),base,'evenementsClasse');
console.log(`   (a) AVEC id  → forts ${avecId.fort.length} (silencieux) · faibles ${avecId.faible.length} · arrivent ${avecId.arrivent.length} · disparaissent ${avecId.disparaissent.length}`);
const sansId=edtApparier(clone(mod).map(e=>{const o={...e};delete o.id;return o;}),base,'evenementsClasse');
console.log(`   (b) SANS id  → forts ${sansId.fort.length} · faibles ${sansId.faible.length} (proposés) · arrivent ${sansId.arrivent.length} · disparaissent ${sansId.disparaissent.length}`);
console.log("   les 4 retouchés/déplacés sont proposés, pas appliqués :", sansId.faible.length===4);

console.log("\n── férié renommé : pas d'appariement faible (critère unique)");
const fe=clone(cal.feries); edtPoserIds(fe,'feries',null);
const fen=clone(fe).map(x=>{const o={...x};delete o.id;o.nom=(o.nom||o.libelle||'')+" X";return o;});
const fa=edtApparier(fen,fe,'feries');
console.log("   faibles :",fa.faible.length,"(attendu 0) | forts par date :",fa.fort.length);
