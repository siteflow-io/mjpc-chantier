const fs=require('fs'); eval(fs.readFileSync('bloc_identite.js','utf8'));
const cal=JSON.parse(fs.readFileSync('cal.json','utf8'));
const clone=o=>JSON.parse(JSON.stringify(o));
const base=clone(cal.evenementsClasse); edtPoserIds(base,'evenementsClasse',null);
const mod=clone(base);
mod[0].libelle+=" (retouché)";
mod[1].libelle+=" bis";
mod[2].libelle="Séjour à "+mod[2].libelle;          // vraie retouche, pas un accent
mod[3].debut="2026-11-17"; mod[3].fin="2026-11-17"; // déplacé d'un jour
const supprime=mod.splice(5,1)[0];
mod.push({libelle:"Nouvel événement",niveau:"4e",debut:"2027-03-02",fin:"2027-03-02",classes:[]});
const sansId=edtApparier(clone(mod).map(e=>{const o={...e};delete o.id;return o;}),base,'evenementsClasse');
console.log("── PREUVE 4(b) refaite · SANS id");
console.log(`   forts ${sansId.fort.length} · faibles ${sansId.faible.length} · arrivent ${sansId.arrivent.length} · disparaissent ${sansId.disparaissent.length}`);
sansId.faible.forEach(p=>console.log(`   FAIBLE proposé : « ${p.existant.libelle} » (${p.existant.debut}) → « ${p.entrant.libelle} » (${p.entrant.debut})`));
sansId.disparaissent.forEach(e=>console.log(`   DISPARAÎT : « ${e.libelle} » — nommé, jamais supprimé en silence`));
sansId.arrivent.forEach(e=>console.log(`   ARRIVE : « ${e.libelle} »`));
console.log("   4 modifiés proposés, aucun appliqué seul :", sansId.faible.length===4);
console.log("\n── note du banc précédent : remplacer un 'e' par 'é' ne fait PAS un faible.");
console.log("   Le libellé normalisé retire les accents → appariement FORT silencieux. Comportement conforme au §① ; c'est mon banc qui était faux, pas le code.");
