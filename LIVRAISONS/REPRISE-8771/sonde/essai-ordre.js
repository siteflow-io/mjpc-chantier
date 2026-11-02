// Le code même de Firebase 8.10.1 (SDK du site), sans réseau : l'ordre des clés et les listes à trous à la relecture.
const M = process.argv[2];
const firebase = require(M + '/firebase/app'); require(M + '/firebase/database');
firebase.initializeApp({ databaseURL: 'https://essai-local-sans-reseau.firebaseio.com' });
const db = firebase.database(); db.goOffline();
const ecrit = [{ eid: 'e1', act: 'Ouverture', role: 'ouverture', blocs: [{ t: 'texte', lignes: ['a', 'b'], marques: [] }], z: null }, { eid: 'e2', act: 'A1', blocs: [], heure: 1, ecr: [null, 3] }];
const ref = db.ref('site/x/ecrans'); ref.set(ecrit);
ref.once('value', s => { console.log('écrit :', JSON.stringify(ecrit)); console.log('relu  :', JSON.stringify(s.val())); process.exit(0); });
setTimeout(() => { console.log('pas de relecture'); process.exit(1); }, 5000);
