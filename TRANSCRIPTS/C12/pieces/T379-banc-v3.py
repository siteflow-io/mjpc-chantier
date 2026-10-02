import json,time
from playwright.sync_api import sync_playwright
ok=[]
def check(n,c,d): ok.append(c); print(('OK  ' if c else 'ECHEC ')+n+' — '+json.dumps(d,ensure_ascii=False)[:160])
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',args=['--no-sandbox']); pg=b.new_page(viewport={'width':1366,'height':768}); err=[]; pg.on('pageerror',lambda e:err.append(str(e)))
    pg.goto('file:///home/claude/MAQ2/T374-maquette-forme-acceptee-aide-v3.html'); time.sleep(.4)
    pave=lambda c: pg.locator('#touches button',has_text=c).first.click()
    # décocher « même texte » pour partir sans tolérance héritée
    pg.locator('#memeTexte').click(); time.sleep(.1)
    # A. Préparation : clic sur « cadavres » → fenêtre ; ajouter « cadavre » → souligné vert 1 ; journal « D'avance »
    pg.locator('.onglets button',has_text='Préparation').click(); time.sleep(.2)
    pg.locator('#texteMots span',has_text='cadavres').first.click(); time.sleep(.2); pg.locator('#fenIn').fill('cadavre'); pg.keyboard.press('Enter'); time.sleep(.2)
    sous=pg.locator('#texteMots span',has_text='cadavres').first.inner_html(); lg=pg.locator('#log li').all_inner_texts()[-1]
    pg.screenshot(path='/home/claude/MAQ2/capture-v3-prepa.png')
    check('Préparation : « cadavre » ajoutée d\'avance pour « cadavres » (souligné, compte 1, journal « D\'avance »)', 'sup' in sous and "D'avance" in lg, lg[:90])
    # B. le mot juste refusé dans la fenêtre
    pg.locator('#fenIn').fill('Cadavres'); pg.keyboard.press('Enter'); time.sleep(.1); check('la fenêtre refuse le mot juste', 'mot juste' in pg.locator('#fenGarde').inner_text(), pg.locator('#fenGarde').inner_text())
    pg.keyboard.press('Escape'); time.sleep(.1)
    # C. correction : G, pavé 1 (« cadavre ») → ne coûte rien (note 20), l'élève lit « forme acceptée »
    pg.locator('.onglets button',has_text='rapide').click(); time.sleep(.2); pg.keyboard.press('g'); time.sleep(.2); t=pg.locator('#liste').inner_text(); pave('1'); time.sleep(.3)
    check('en correction, « cadavre » prise ne coûte rien (note 20), marquée « acceptée » dans la liste, l\'élève lit « forme acceptée »', pg.locator('#noteV').inner_text()=='20' and 'acceptée' in t and 'forme acceptée' in pg.locator('#vueEleve').inner_text(), [pg.locator('#noteV').inner_text(), t[:40].replace('\n','|')])
    # D. Réglages : la règle « de ce texte » ; retirer → coûte à nouveau (19) ; Préparation : plus de soulignement
    pg.locator('.onglets button',has_text='Réglages').click(); time.sleep(.2); rg=pg.locator('#reglListe').inner_text(); pg.locator('#reglListe button',has_text='retirer').first.click(); time.sleep(.2)
    pg.locator('.onglets button',has_text='Préparation').click(); time.sleep(.2); sous2=pg.locator('#texteMots span',has_text='cadavres').first.inner_html()
    check('Réglages : « pour toutes les dictées de ce texte » ; retirer → note 19 ; Préparation : plus de soulignement', 'toutes les dictées de ce texte' in rg and pg.locator('#noteV').inner_text()=='19' and 'sup' not in sous2, [rg[:60].replace('\n','|'), pg.locator('#noteV').inner_text()])
    # E. 0 du pavé en correction → la règle apparaît dans Préparation (souligné) et le journal dit « dans cette dictée et dans « Dictée n°1 … » »
    pg.locator('.onglets button',has_text='rapide').click(); time.sleep(.2); pg.keyboard.press('g'); time.sleep(.2); pg.locator('#in').fill('cadavre'); pave('0'); time.sleep(.3); lg2=pg.locator('#log li').all_inner_texts()[-1]
    pg.locator('.onglets button',has_text='Préparation').click(); time.sleep(.2); sous3=pg.locator('#texteMots span',has_text='cadavres').first.inner_html()
    check('0 en correction → règle du texte : Préparation la montre, journal « dans cette dictée et dans « Dictée n°1 … » (même texte) »', 'sup' in sous3 and 'même texte' in lg2 and 'recalculées, ici et là-bas' in lg2, lg2[-120:])
    # F. l'aide suit : Préparation
    pg.keyboard.press('?'); time.sleep(.1); c=pg.locator('#aideOu').inner_text(); pg.keyboard.press('Escape'); check('l\'aide suit (« Préparation — formes acceptées »)', 'Préparation' in c, c)
    check('0 erreur JS', not err, err); b.close()
print('BANC MAQUETTE v3 : '+('VERT' if all(ok) else 'ROUGE'))
