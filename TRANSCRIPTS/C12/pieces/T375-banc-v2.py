import json,time
from playwright.sync_api import sync_playwright
ok=[]
def check(n,c,d): ok.append(c); print(('OK  ' if c else 'ÉCHEC ')+n+' — '+json.dumps(d,ensure_ascii=False)[:170])
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',args=['--no-sandbox']); pg=b.new_page(viewport={'width':1366,'height':768}); err=[]; pg.on('pageerror',lambda e:err.append(str(e)))
    pg.goto('file:///home/claude/MAQ2/T374-maquette-forme-acceptee-aide-v2.html'); time.sleep(.4)
    pave=lambda c: pg.locator('#touches button',has_text=c).first.click()
    # A. même texte (coché) : G, pavé 1 (« cadavre ») → acceptée d'office : note reste 20, l'élève lit « forme acceptée », la liste dit « acceptée (… même texte) »
    pg.keyboard.press('g'); time.sleep(.2); t=pg.locator('#liste').inner_text(); pave('1'); time.sleep(.3)
    check('même texte : « cadavre » acceptée d\'office — note 20, l\'élève lit « forme acceptée », la liste le dit avec le titre de la dictée', pg.locator('#noteV').inner_text()=='20' and 'forme acceptée' in pg.locator('#vueEleve').inner_text() and 'même texte' in t and 'lettre de Fritz' in t and 'chez les' not in t, [pg.locator('#noteV').inner_text(), t[:70].replace('\n','|')])
    pg.screenshot(path='/home/claude/MAQ2/capture-v2-meme-texte.png')
    # B. autre texte (décoché) : la même prise coûte 1 ; la liste dit « acceptée dans « … » — 0 l'accepte ici »
    pg.locator('#memeTexte').click(); time.sleep(.2); pg.keyboard.press('g'); time.sleep(.2); t2=pg.locator('#liste').inner_text(); pave('1'); time.sleep(.3)
    check('autre texte : la même forme coûte 1 (note 19) ; la liste la propose « acceptée dans « … » — 0 l\'accepte ici »', pg.locator('#noteV').inner_text()=='19' and '0 l\'accepte ici' in t2, [pg.locator('#noteV').inner_text(), t2[:80].replace('\n','|')])
    # C. autre texte : G puis 0 SEUL → la forme acceptée ailleurs est prise et acceptée ici : note 20, Réglages la liste
    pg.keyboard.press('g'); time.sleep(.2); pave('0'); time.sleep(.3); lg=pg.locator('#log li').all_inner_texts()
    check('0 seul prend la forme acceptée ailleurs et l\'accepte ici (note 20)', pg.locator('#noteV').inner_text()=='20' and any('0 seul' in x for x in lg) and 'FORME ACCEPTÉE' in lg[-1], [pg.locator('#noteV').inner_text(), lg[-2][:80]])
    pg.screenshot(path='/home/claude/MAQ2/capture-v2-zero-seul.png')
    check('0 erreur JS', not err, err); b.close()
print('BANC MAQUETTE 374 v2 : '+('VERT' if all(ok) else 'ROUGE'))
