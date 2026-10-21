import sys
src, mod, dst = sys.argv[1:4]
h=open(src,encoding='utf-8').read(); m=open(mod,encoding='utf-8').read()
i=h.index('<script>', h.index('<body>'))
h=h[:i]+'<script>\n'+m+'\n</script>\n'+h[i:]
open(dst,'w',encoding='utf-8').write(h)
