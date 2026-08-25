/* BANC ZOOM LOCAL — la fenêtre tableau du scénario Windows+K (peinte par le moteur
   du pilote) suit-elle la réglette, alors que la vue distante ne la suit pas ? */
import { nouvelleScene, amorcer } from './socle.mjs';
import { cliquerTexte, cliquerSel, attendre } from './gestes.mjs';
import { brancher } from './hub-faux.mjs';
import fs from 'fs';

const s = await nouvelleScene(process.argv[2], +process.argv[3], '/home/claude/mjpc/hub');
const journal = []; const dire=(...a)=>{const t=a.join(' ');journal.push(t);console.log(t);};

const pilote = await s.page('', 'pilote', {width:1440, height:900});
await attendre(1400); await amorcer(pilote);
await cliquerSel(pilote,'#tprof-btn',900);
await cliquerTexte(pilote,'button.tprof-section-btn','Atelier',2200);
await cliquerTexte(pilote,'button.at-onglet','Mes chapitres',1300);
await cliquerTexte(pilote,'button','Modifier',2200);
await cliquerTexte(pilote,'button.at-onglet','Déroulé',2500);
await cliquerTexte(pilote,'button','Lancer la séance',3000);
await attendre(1500);

await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
  for(let k=0;k<2;k++) W.devoile(); });
await attendre(1200);

/* on ouvre la fenêtre tableau LOCALE, par la fonction du moteur (scénario Win+K) */
const attenteFenetre = new Promise(r => s.nav.once('targetcreated', async t => r(await t.page())));
await pilote.evaluate(()=>{ document.getElementById('at-dr-iframe').contentWindow.tableau(); });
const local = await attenteFenetre;
await brancher(local, s.hub, 'tableau-local');
await attendre(1500);
dire('fenêtre tableau LOCALE ouverte :', await local.title());

const mesure = async (cran) => {
  await pilote.evaluate((c)=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
    const rz=W.document.getElementById('rz'); rz.value=String(c);
    rz.dispatchEvent(new W.Event('input',{bubbles:true})); }, cran);
  await attendre(1600);
  const P = await pilote.evaluate(()=>{ const W=document.getElementById('at-dr-iframe').contentWindow;
    return {iz:W.iz, pt:W.PT[W.iz], nb:W.ECRANS.length}; });
  const L = await local.evaluate(()=>{ const t=document.getElementById('t');
    const cons=document.querySelector('.cons .txt');
    return {px:t?+getComputedStyle(t).fontSize.replace('px',''):null,
            pxConsigne:cons?+getComputedStyle(cons).fontSize.replace('px',''):null,
            h:Math.round(document.documentElement.clientHeight)}; });
  dire('  cran '+(cran+1)+' ('+P.pt+' pt) : tableau LOCAL → '+(L.px===null?'—':L.px.toFixed(1)+' px')
     +' · consigne '+(L.pxConsigne===null?'—':L.pxConsigne.toFixed(1)+' px')
     +' (fenêtre '+L.h+' px) | écrans pilote : '+P.nb);
  return {cran:cran+1, pt:P.pt, local:L, ecrans:P.nb};
};

dire('— la fenêtre tableau LOCALE, cran par cran —');
const crans = [];
for(const c of [0,1,2,3,4]) crans.push(await mesure(c));

const px = [...new Set(crans.map(c=>c.local.px))];
dire('');
dire('═══ VERDICT ═══');
dire('  tailles de police au tableau LOCAL : '+JSON.stringify(px));
dire(px.length>1
  ? '  → LE TABLEAU LOCAL SUIT LA RÉGLETTE ('+px.length+' tailles distinctes).'
  : '  → le tableau local ne suit pas non plus.');
fs.writeFileSync('zoom-local-releve.json', JSON.stringify(crans,null,1));
fs.writeFileSync('zoom-local-journal.txt', journal.join('\n'));
await s.fermer();
