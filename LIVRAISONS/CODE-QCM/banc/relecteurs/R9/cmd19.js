const c=P.console; let r="";
let ct=await txt(c); r+="AVANT:"+ct.slice(ct.indexOf("QUESTION\n"),ct.indexOf("QUESTION\n")+200).replace(/\n/g," ");
r+="\nBT:"+(await btns(c)).slice(200,700);
return r;
