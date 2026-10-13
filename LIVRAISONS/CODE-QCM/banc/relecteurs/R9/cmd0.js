P.console = await R.ouvrir(nav, info, "?mode=prof", 1536, 864); await cap(P.console,"c0"); return (await txt(P.console)).slice(0,1500) + "\n" + (await btns(P.console));
