"""Deux navigateurs sur le même faux hub (règle de Paul, 04/10 : « un html doit toujours s'actualiser en interne ») : chaque écriture de l'un
est rejouée dans l'autre, comme Firebase la propagerait. Usage : relier(pA, pB) après les deux b.ouvrir(...), puis synchroniser(attente) après
chaque geste (les écritures en attente sont rejouées dans l'autre navigateur)."""
FILE=[]
PAGES=[]
def relier(*pages):
    PAGES[:]=list(pages)
    for p in pages:
        p.expose_binding('__RELAIS__', lambda source, op, path, js, p=p: FILE.append((p, op, path, js)))
def synchroniser(attente=600):
    for _ in range(4):
        while FILE:
            src, op, path, js = FILE.pop(0)
            for q in PAGES:
                if q is src: continue
                try: q.evaluate("(a)=>window.__appliquerDistant&&window.__appliquerDistant(a[0],a[1],a[2])",[op,path,js])
                except Exception: pass
        for q in PAGES: q.wait_for_timeout(attente//4)
