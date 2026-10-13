const c=P.console; const ct=await txt(c); const k=ct.indexOf("📱 Tablette 1");
return ct.slice(ct.indexOf("CONNECT")-6,ct.indexOf("CONNECT")+250).replace(/\n/g," ")+"\n"+ct.slice(k,k+200).replace(/\n/g," ")+"\nTEL:"+(await txt(P.tel)).slice(40,200).replace(/\n/g," ");
