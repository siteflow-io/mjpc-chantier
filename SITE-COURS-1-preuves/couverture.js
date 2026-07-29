/* TABLE DE COUVERTURE MÉCANIQUE — SITE-COURS-1 (complément ③ du feu vert)
   Le code testé est EXTRAIT d'index.staging.html (la livraison, au caractère près),
   entre les marqueurs de section de l'atelier. Pour chaque composante non réservée :
   OFF → le marqueur data-c (ou l'effet déclaré) est ABSENT ; ON → PRÉSENT.
   Écran et impression sont le même document (une seule chaîne HTML + @media print) :
   la présence du marqueur vaut pour les deux, sauf effets print testés à part. */
const fs=require('fs');
const vm=require('vm');
const staging=fs.readFileSync('/home/claude/build/index.staging.html','utf8');
const DEB='/* ══════════════════════════════════════════════════════════════════════════\n   ATELIER DE COMPOSITION — SITE-COURS-1 · § SCHÉMA DES COMPOSANTES';
const FIN='/* ═══ fin ATELIER DE COMPOSITION ═══ */';
const i0=staging.indexOf(DEB), i1=staging.indexOf(FIN);
if(i0<0||i1<0){console.error('SECTION INTROUVABLE');process.exit(1);}
const code=staging.slice(i0,i1+FIN.length);
/* preuve d'identité avec les sources de build */
const attendu=fs.readFileSync('/home/claude/build/atelier-schema.js','utf8')+'\n'+fs.readFileSync('/home/claude/build/atelier-ui.js','utf8');
console.log('IDENTITÉ tranche livrée == sources de build :',code.trim()===attendu.trim()?'OUI':'NON — ARRÊT');
if(code.trim()!==attendu.trim())process.exit(1);

const ctx={console};vm.createContext(ctx);
vm.runInContext(code,ctx); /* le générateur est pur : aucune exécution au chargement */
const C=ctx.ATELIER_COMPOSANTES, gen=ctx.atelierDocumentHTML, page=ctx.atelierPageHTML;

function docNu(){return {titre:'T',cases:{},valeurs:{},reformulations:{},contenu:[],
  rattachement:{niveau:'3e',classe:'3e_test',classeNom:'3e Test',eleve:'MARTIN Lucas'},
  dates:{creeLe:1,modifieLe:1,dateEdition:'2026-07-29',versionDoc:3},versionAtelier:'1.0.0'};}
const ELEVE={nom:'MARTIN Lucas',code:'AB12',rang:3,total:28};
function demo(ch){
  if(ch.k==='paires')return 'sujet = ce qui fait l\u2019action\nverbe = l\u2019action';
  if(ch.k==='lignes')return 'Nature | Fonction\nnom | sujet';
  if(ch.kind==='list')return 'Premier \u00e9l\u00e9ment\nSecond \u00e9l\u00e9ment';
  if(ch.kind==='area')return 'Ligne d\u2019exemple une\nLigne d\u2019exemple deux';
  if(ch.kind==='date')return '2026-09-01';
  if(ch.k==='url')return 'https://exemple.fr/img.png';
  if(ch.k==='hauteur'||ch.k==='lignes'||ch.k==='total')return '5';
  return 'Exemple';
}
function docAvec(id){
  const d=docNu();const c=C[id];
  d.cases[id]=true;
  if(c.multiple){
    const b={id:id,valeurs:{},reformulations:{}};
    (c.champs||[]).forEach(ch=>{b.valeurs[ch.k]=demo(ch);});
    if(c.reforme)b.reformulations.texte='Version reformul\u00e9e simple';
    if(c.allegeable)b.reformulations.allege='Variante [all\u00e9g\u00e9e]';
    d.contenu=[b];
  }else{
    d.valeurs[id]={};(c.champs||[]).forEach(ch=>{d.valeurs[id][ch.k]=demo(ch);});
  }
  return d;
}
/* effets spécifiques des composantes 'rendu' et cas particuliers */
const EFFETS={
  police_adaptee:h=>h.includes('r-dys'),interligne:h=>h.includes('r-interligne'),
  colonne_etroite:h=>h.includes('r-etroite'),contraste:h=>h.includes('r-contraste'),
  sans_italique:h=>h.includes('r-sans-ital'),format_demi:h=>h.includes('r-demi'),
  deux_par_page:h=>h.includes('r-deux'),marges_larges:h=>h.includes('r-marges'),
  pointilles:h=>h.includes('r-pointilles'),ecran_seul:h=>h.includes('r-ecran-seul'),
  impression_seule:h=>h.includes('r-impression-seule'),orientation_paysage:h=>h.includes('r-paysage')
};
/* montages particuliers : la composante agit SUR autre chose */
const MONTAGES={
  consignes_reformulees:{prep:d=>{d.cases.consigne=true;d.contenu=[{id:'consigne',valeurs:{texte:'TEXTE-PRINCIPAL'},reformulations:{texte:'TEXTE-REFORMULE'}}];},
    off:h=>h.includes('TEXTE-PRINCIPAL')&&!h.includes('TEXTE-REFORMULE'),
    on:h=>h.includes('TEXTE-REFORMULE')&&!h.includes('TEXTE-PRINCIPAL')},
  une_consigne_par_ligne:{prep:d=>{d.cases.consigne=true;d.contenu=[{id:'consigne',valeurs:{texte:'Phrase une.\nPhrase deux.'},reformulations:{}}];},
    off:h=>!h.includes('f-cons-l'),on:h=>h.includes('f-cons-l')},
  reduction_items:{prep:d=>{d.cases.texte_a_trous=true;d.contenu=[{id:'texte_a_trous',valeurs:{texte:'Complet [a] [b] [c]'},reformulations:{allege:'ALLEGE [a]'}}];},
    off:h=>h.includes('Complet')&&!h.includes('ALLEGE'),on:h=>h.includes('ALLEGE')&&!h.includes('Complet')},
  numerotation_lignes:{prep:d=>{d.cases.extrait_numerote=true;d.contenu=[{id:'extrait_numerote',valeurs:{texte:'l1\nl2\nl3'},reformulations:{}}];},
    off:h=>!h.includes('f-ext-n'),on:h=>h.includes('f-ext-n')},
  verbe_action:{prep:d=>{d.cases.consigne=true;d.contenu=[{id:'consigne',valeurs:{texte:'Fais ceci.'},reformulations:{}}];},
    off:h=>!h.includes('f-verbe'),on:h=>h.includes('f-verbe')},
  mots_cles:{prep:d=>{d.cases.consigne=true;d.contenu=[{id:'consigne',valeurs:{texte:'Fais ceci.'},reformulations:{}}];},
    off:h=>!h.includes('data-c="mots_cles"'),on:h=>h.includes('data-c="mots_cles"')},
  date_edition:{off:h=>h.includes('f-de-ecran-off'),  /* décochée : masquée à l'écran, jamais au papier */
    on:h=>!h.includes('f-de-ecran-off')&&h.includes('data-c="date_edition"')},
  numerotation_lot:{off:h=>!h.includes('f-num-lot'),on:h=>h.includes('f-num-lot')}
};

let lignes=[],ok=0,ko=0,reserves=0;
Object.keys(C).forEach(id=>{
  const c=C[id];
  if(c.reserve){reserves++;lignes.push([id,'—','—','RÉSERVÉE (déclarée, mention à l\u2019éditeur)']);return;}
  const m=MONTAGES[id];
  let dOff=docNu(),dOn=docAvec(id);
  if(m&&m.prep){m.prep(dOff);m.prep(dOn);}
  if(id==='date_edition'){dOff.cases.date_edition=false;}
  const hOff=gen(dOff,ELEVE,{}),hOn=gen(dOn,ELEVE,{});
  let offOk,onOk,mode;
  if(m){offOk=m.off(hOff);onOk=m.on(hOn);mode='effet spécifique';}
  else if(EFFETS[id]){offOk=!EFFETS[id](hOff);onOk=EFFETS[id](hOn);mode='classe de rendu';}
  else{const mk='data-c="'+id+'"';offOk=!hOff.includes(mk);onOk=hOn.includes(mk);mode='marqueur data-c';}
  const different=hOff!==hOn;
  const verdict=(offOk&&onOk&&different)?'OK':'ÉCHEC';
  if(verdict==='OK')ok++;else ko++;
  lignes.push([id,onOk?'apparaît':'N\u2019APPARAÎT PAS',offOk?'disparaît':'NE DISPARAÎT PAS',mode+(different?'':' · HTML IDENTIQUES')+' → '+verdict]);
});
/* effets print structurels (le même document porte son @media print) */
const css=ctx.atelierCharteCSS();
const printOk=[
  ['@media print présent',css.includes('@media print{')],
  ['date d\u2019édition forcée au print (.f-de-forcee display inline!important)',css.includes('.f-de-forcee{display:inline!important}')],
  ['date d\u2019édition : masque écran seulement (@media screen .f-de-ecran-off)',css.includes('@media screen{.f-de-ecran-off{display:none}}')],
  ['écran seul masqué au print',css.includes('.r-ecran-seul{display:none}')],
  ['demi-A4 : 148mm + saut toutes les 2',css.includes('height:148mm')&&css.includes('.r-demi:nth-of-type(2n){page-break-after:always')],
  ['saut de page (.f-saut page-break-before)',css.includes('.f-saut{page-break-before:always')],
  ['page A4 : feuille par page (page-break-after)',css.includes('.feuille{max-width:none;margin:0;border:none;box-shadow:none;padding:10mm 12mm;page-break-after:always}')]
];
let out='COMPOSANTE | COCHÉE → | DÉCOCHÉE → | MÉTHODE ET VERDICT\n';
out+=lignes.map(l=>l.join(' | ')).join('\n');
out+='\n\nEFFETS D\u2019IMPRESSION (CSS du document, vérifiés dans la charte livrée) :\n';
out+=printOk.map(p=>p[0]+' : '+(p[1]?'OK':'ÉCHEC')).join('\n');
out+='\n\nBILAN : '+ok+' composantes vérifiées OK · '+ko+' en échec · '+reserves+' réservées (déclarées) · total '+lignes.length;
fs.writeFileSync('/home/claude/build/table-couverture.txt',out);
console.log(out.split('\n').slice(-8).join('\n'));
if(ko>0||printOk.some(p=>!p[1]))process.exit(1);
console.log('\nTABLE DE COUVERTURE : VERTE');
