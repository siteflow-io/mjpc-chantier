const fs=require("fs");const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");
const info=JSON.parse(fs.readFileSync(__dirname+"/info.json"));
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
global.P={};global.R=R;global.info=info;global.nav=nav;
global.txt=async(p)=>(await p.innerText("body")).replace(/\n\s*\n/g,"\n");
global.btns=async(p)=>(await p.$$eval("button",bs=>bs.map(b=>(b.disabled?"[x]":"")+b.innerText.trim().replace(/\s+/g," ")).filter(Boolean))).join(" | ");
global.cap=async(p,n)=>{await p.screenshot({path:__dirname+"/cap/"+n+".png"});return "cap/"+n+".png";};
global.clic=async(p,t)=>{await p.getByText(t,{exact:false}).first().click();await p.waitForTimeout(700);};
let n=0;for(;;){const f=__dirname+"/cmd"+n+".js";if(fs.existsSync(f)){let out;try{out=await eval("(async()=>{"+fs.readFileSync(f,"utf8")+"})()");}catch(e){out="EXC "+e.message;}
fs.writeFileSync(__dirname+"/out"+n+".txt",String(out));n++;}else await new Promise(r=>setTimeout(r,150));}})();
