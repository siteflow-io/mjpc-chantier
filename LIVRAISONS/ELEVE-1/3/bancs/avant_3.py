import sys,os,time,subprocess
from banc_3 import *
SRV=subprocess.Popen(['python3','-m','http.server','8765','--bind','127.0.0.1'],cwd='/home/claude/work2',stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL); time.sleep(1)
with sync_playwright() as pw:
    hub=hub0(); b,pg,err,ext=ouvrir(pw,'http://127.0.0.1:8765/index-8.74.0-2.html',hub,'2026-09-16'); eleves(pg); cle(pg); importer_nouvelle(pg,'ZZTEST-4e.xlsx')
    pg.clock.set_fixed_time(jour('2026-09-16')); section(pg,'classes',2.5); pg.locator('#tprof-content').screenshot(path='/home/claude/work3/captures3/el-classes-0916-avant.png'); b.close()
SRV.terminate()
