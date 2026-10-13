const fs=require("fs");const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");const info=require("./info.json");
global.R=R;global.info=info;global.P={};
global.txt=async(k,n=2500)=>(await P[k].evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n").slice(0,n);
global.cap=async(k,f)=>P[k].screenshot({path:"cap/"+f+".png",fullPage:true});
global.clic=async(k,t,i=0)=>{const l=P[k].getByText(t,{exact:false});await l.nth(i).click({timeout:3000});await P[k].waitForTimeout(700);};
(async()=>{global.nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
let n=0;for(;;){if(fs.existsSync("cmd.js")){const c=fs.readFileSync("cmd.js","utf8");fs.unlinkSync("cmd.js");let out;
try{out=await eval("(async()=>{"+c+"})()");}catch(e){out="ERR "+e.message;}
fs.writeFileSync("out.txt",String(out===undefined?"ok":out));}await new Promise(r=>setTimeout(r,100));}})();
