const fs=require("fs");const R=require("/home/user/mjpc-chantier/LIVRAISONS/CODE-QCM/banc/relecteur-outils.js");
const info=JSON.parse(fs.readFileSync(__dirname+"/info.json"));
const D=__dirname;let n=0;
(async()=>{const nav=await require("/opt/node22/lib/node_modules/playwright").chromium.launch({executablePath:"/opt/pw-browsers/chromium"});
global.nav=nav;global.R=R;global.info=info;
global.P={};
global.txt=async(p)=>(await p.evaluate(()=>document.body.innerText)).replace(/\n\s*\n/g,"\n");
global.cap=async(p,nom)=>{await p.screenshot({path:D+"/cap/"+nom+".png"});return nom;};
global.btns=async(p)=>p.evaluate(()=>[...document.querySelectorAll("button")].filter(b=>b.offsetParent).map(b=>(b.disabled?"[x]":"")+b.innerText.trim().replace(/\s+/g," ")).join(" | "));
fs.writeFileSync(D+"/cmd.js","");
while(true){const c=fs.readFileSync(D+"/cmd.js","utf8");
 if(c.trim()){fs.writeFileSync(D+"/cmd.js","");let out;try{out=await eval("(async()=>{"+c+"})()");}catch(e){out="EXC "+e.message;}
  fs.writeFileSync(D+"/out.txt",String(out===undefined?"ok":(typeof out==="string"?out:JSON.stringify(out,null,1))));fs.writeFileSync(D+"/done","1");}
 await new Promise(r=>setTimeout(r,200));}
})();
