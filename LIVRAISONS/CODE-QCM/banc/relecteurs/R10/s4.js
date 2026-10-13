const R=require("./relecteur-outils.js");const info=JSON.parse(require("fs").readFileSync("info.json"));
const fs=require("fs");const T=(m)=>fs.appendFileSync("log4.txt",m+"\n");
const btns=async p=>(await p.locator("button:visible").allInnerTexts()).map(s=>s.trim().replace(/\s+/g," ")).filter(Boolean).join(" | ");
const txt=async p=>(await p.evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n");
const tryc=async(p,re,ms=1500)=>{try{await p.getByRole("button",{name:re}).last().click({timeout:ms});await p.waitForTimeout(400);T("  click "+re);return true}catch(e){return false}};
(async()=>{fs.writeFileSync("log4.txt","");const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
const c=await R.ouvrir(nav,info,"?mode=prof",1536,864);await c.waitForTimeout(800);
if(await tryc(c,/Terminer définitivement/)){await c.waitForTimeout(500);T("modal "+await btns(c));await tryc(c,/Terminer|Confirmer|Oui/);}
await c.waitForTimeout(500);
const s=c.locator("select");for(let i=0;i<await s.count();i++){try{await s.nth(i).selectOption({label:"Évaluation d'essai — 3 questions"},{timeout:500})}catch(e){}}
await tryc(c,/Lancer la séance/);await tryc(c,/ZELLER Lou/);await c.getByTitle("Démarrer la séance avec les absents marqués").click({timeout:3000}).catch(()=>T("no demarrer"));
await c.waitForTimeout(1000);T("C "+await btns(c));await c.screenshot({path:"cap/s4-console-lance.png"});
const tabs=[];for(const k of [0,1]){const t=await R.ouvrir(nav,info,"?mode=eleve",1280,800);await t.waitForTimeout(800);await tryc(t,/2 élèves/);
 T("T"+k+" "+await btns(t)+" || "+(await txt(t)).slice(0,300).replace(/\n/g," / "));await t.screenshot({path:`cap/s4-tab${k}-login.png`});tabs.push(t);}

const codes=[["2101","2108"],["2115","2122"]];
const pressCode=async(t,half,code)=>{const b=t.locator("button:visible");for(const d of code){await b.filter({hasText:new RegExp("^"+d+"$")}).nth(half).click();}
 await b.filter({hasText:/Entrer/}).nth(half).click().catch(()=>b.filter({hasText:/^✓$/}).nth(half).click());await t.waitForTimeout(400);};
for(const k of [0,1]){for(const h of [0,1]){try{await pressCode(tabs[k],h,codes[k][h]);}catch(e){T("code err "+e.message.slice(0,80))}}
 T("T"+k+" after codes "+await btns(tabs[k])+" || "+(await txt(tabs[k])).slice(0,300).replace(/\n/g," / "));await tabs[k].screenshot({path:`cap/s4-tab${k}-in.png`});}
const ph=await R.ouvrir(nav,info,"?mode=prof&view=phone",390,844);const bd=await R.ouvrir(nav,info,"?mode=prof&view=board",1536,864);
let ecarte=false;
const prio=[/Commencer la correction/,/Révéler/,/Trouvée au dernier/,/Lancer Q\d/,/Question suivante|Suivante|passe à la suivante/,/Clore|Fermer la question|Terminer la question/,/Estimation|estimer/i,/Attest|J'atteste/,/Lancer la co-?évaluation|co-évaluation/i,/Bilan/,/Continuer|Valider|OK/];
for(let i=0;i<45;i++){
 for(const [k,t] of tabs.entries()){const bt=await btns(t);if(i%3==0)T(" t"+k+": "+bt.slice(0,250));
  if(await tryc(t,/Oui, la même chose/,300))continue;
  const ch=t.locator("button:visible").filter({hasText:/^[A-D]\b/});if(await ch.count()){await ch.first().click({timeout:500}).catch(()=>{});await tryc(t,/Valider|Envoyer|Confirmer/,300);}
 }
 const bc=await btns(c);T(`[${i}] C: `+bc.replace(/^.*?Pilotage classe \| /,"").slice(0,500));
 await c.screenshot({path:`cap/s4-c${String(i).padStart(2,"0")}.png`});
 if(!ecarte && /Lancer Q2/.test(bc)){ // écarter Q3
  if(await tryc(c,/Écarter/)){await c.waitForTimeout(400);T("ecart modal "+(await btns(c)).slice(-200));await c.screenshot({path:"cap/s4-ecarter.png"});await tryc(c,/^❌ Écarter$|Écarter la question|Confirmer/);ecarte=true;
   T("after ecart "+(await txt(c)).slice(0,1500).replace(/\n/g," / "));await c.screenshot({path:"cap/s4-ecartee.png"});continue;}}
 let done=false;for(const r of prio){if(await tryc(c,r,400)){done=true;await c.screenshot({path:`cap/s4-c${String(i).padStart(2,"0")}-apres.png`});break;}}
 if(!done){await c.waitForTimeout(3000);}
 if(i%5==0){await ph.screenshot({path:`cap/s4-ph${i}.png`});await bd.screenshot({path:`cap/s4-bd${i}.png`});}
 if(/Terminer.*bilan|Fin de la séance|Bilan/.test(bc) && i>30)break;
}
T("FINAL C "+(await txt(c)).slice(0,2500).replace(/\n/g," / "));T("PH "+(await txt(ph)).slice(0,600).replace(/\n/g," / "));T("BD "+(await txt(bd)).slice(0,600).replace(/\n/g," / "));
T("ERR "+JSON.stringify([c.__erreurs,tabs[0].__erreurs,ph.__erreurs,bd.__erreurs]));
await nav.close();})();
