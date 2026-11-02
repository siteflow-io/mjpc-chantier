// Le témoin « déroulé intègre » de la 8.77.1-⑩ (avant / corrigé) joué contre le code même de Firebase 8.10.1 (le SDK du site), sans réseau :
// la copie de la classe écrite, relue ; l'empreinte d'avant (le texte JSON tel quel) et celle d'après (rangée comme le hub).
// usage : node essai-temoin-sdk.js <node_modules du SDK> <index.html corrigé> <ecrans.json>
const [M, HTML, ECR] = process.argv.slice(2); const fs = require('fs');
const src = fs.readFileSync(HTML, 'utf8');
const pris = ['dr_empreinte', 'dr_commeLeHub', 'dr_empreinteHub'].map(n => { const l = src.split('\n').findIndex(x => x.startsWith('function ' + n + '(')); let t = src.split('\n')[l]; if (n === 'dr_commeLeHub') t += '\n' + src.split('\n')[l + 1]; return t; }).join('\n');
const { dr_empreinte, dr_empreinteHub } = new Function(pris + '\nreturn { dr_empreinte, dr_empreinteHub };')();
const firebase = require(M + '/firebase/app'); require(M + '/firebase/database');
firebase.initializeApp({ databaseURL: 'https://essai-local-sans-reseau.firebaseio.com' }); const db = firebase.database(); db.goOffline();
const ecrit = JSON.parse(fs.readFileSync(ECR, 'utf8'));
const ref = db.ref('site/3e/chapitres/0/seances/s1/deroule_joue/3a/ecrans'); ref.set(ecrit);
ref.once('value', s => { const relu = s.val();
  const avant = dr_empreinte(relu) === dr_empreinte(ecrit), apres = dr_empreinteHub(relu) === dr_empreinteHub(ecrit);
  const abime = JSON.parse(JSON.stringify(relu)); const e0 = (Array.isArray(abime) ? abime : Object.values(abime)).find(e => e && e.act); if (e0) e0.act = e0.act + ' ';
  const perdue = dr_empreinteHub(abime) === dr_empreinteHub(ecrit);
  const vide = dr_empreinteHub(null) === dr_empreinteHub(ecrit);
  console.log('la copie écrite : ' + (Array.isArray(ecrit) ? ecrit.length : '?') + ' diapos, ' + JSON.stringify(ecrit).length + ' caractères ; relue : ' + JSON.stringify(relu).length + ' caractères (le hub a retiré ou réordonné ' + (JSON.stringify(relu) === JSON.stringify(ecrit) ? 'rien' : 'quelque chose') + ')');
  console.log('le témoin d’avant (le texte JSON tel quel) : ' + (avant ? '« intègre »' : '« à vérifier »'));
  console.log('le témoin corrigé (rangé comme le hub)      : ' + (apres ? '« intègre »' : '« à vérifier »'));
  console.log('une lettre changée dans la copie relue      : ' + (perdue ? '« intègre » — FAUX' : '« à vérifier »'));
  console.log('rien au hub (la copie absente)               : ' + (vide ? '« intègre » — FAUX' : '« à vérifier »'));
  process.exit(!avant && apres && !perdue && !vide ? 0 : 1); });
setTimeout(() => { console.log('pas de relecture'); process.exit(2); }, 5000);
