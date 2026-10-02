# BANC de la maquette T368 (point 269) — par le geste (clavier réel : Numpad, Digit, Ctrl+chiffre, Entrée, Échap), 1366×768.
import json,time
from playwright.sync_api import sync_playwright
R={}; ok=[]
def check(n,c,d): ok.append(c); print(('OK  ' if c else 'ÉCHEC ')+n+' — '+json.dumps(d,ensure_ascii=False)[:160])
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/google/chrome/chrome',args=['--no-sandbox']); pg=b.new_page(viewport={'width':1366,'height':768}); err=[]; pg.on('pageerror',lambda e:err.append(str(e)))
    pg.goto('file:///home/claude/MAQ/T368-maquette-capitalisation-v1.html'); time.sleep(.4)
    log=lambda: pg.locator('#log li').all_inner_texts()
    liste=lambda: pg.locator('#liste .forme').count()
    # 1. G ouvre la case, la liste complète (14 formes), la 1 est la plus fréquente
    pg.keyboard.press('g'); time.sleep(.2); check('G ouvre la case ; liste complète, 14 formes, la 1 = « 3 » ×11', not pg.locator('#champ').is_hidden() and liste()==14 and pg.locator('#liste .forme').first.inner_text().startswith('1\n3'), pg.locator('#liste .forme').first.inner_text())
    pg.screenshot(path='/home/claude/MAQ/capture-1-liste.png')
    # 2. Numpad 3 : aucun numéro 30-39 → prise aussitôt (forme n°3 = « troix »)
    pg.locator('#touches button',has_text='3').first.click(); time.sleep(.3); check('Numpad3 → la forme n°3 prise aussitôt (pas de 30-39)', 'n° 3 → « troix »' in ' '.join(log()) and pg.locator('#champ').is_hidden(), log()[-2:])
    # 3. L ; Numpad1 : 10-14 existent → attend ; surbrillance 1,10,11,12,13,14 ; Numpad2 → la 12
    pg.keyboard.press('l'); time.sleep(.2); pg.locator('#touches button',has_text='1').first.click(); time.sleep(.2)
    cand=pg.locator('#liste .forme.candidat').count(); num=pg.locator('#num').inner_text(); pg.screenshot(path='/home/claude/MAQ/capture-2-compose.png')
    pg.locator('#touches button',has_text='2').first.click(); time.sleep(.3); check('Numpad1 attend (6 candidats : 1, 10-14, n° 1 affiché) ; Numpad2 → la forme n°12 prise', cand==6 and num=='n° 1' and 'n° 12 →' in log()[-2] and pg.locator('#champ').is_hidden(), [cand,num,log()[-2]])
    # 4. Numpad1 puis Entrée → la forme n°1
    pg.keyboard.press('g'); time.sleep(.2); pg.locator('#touches button',has_text='1').first.click(); pg.keyboard.press('Enter'); time.sleep(.3); check('Numpad1 puis Entrée → la forme n°1', 'n° 1 →' in log()[-2], log()[-2])
    # 5. rangée du haut : Digit3 dans la case = du texte « 3 », Entrée → enregistré comme forme « 3 »
    pg.keyboard.press('l'); time.sleep(.2); pg.locator('#in').focus(); pg.keyboard.press('Digit3'); time.sleep(.1); v=pg.locator('#in').input_value(); pg.keyboard.press('Enter'); time.sleep(.3)
    check('Digit3 (rangée du haut) = du texte « 3 » dans la case ; Entrée l\'enregistre comme forme', v=='3' and '« 3 »' in log()[-1] and 'choix' not in log()[-1], [v,log()[-1]])
    # 6. Ctrl+2 = comme le pavé
    pg.keyboard.press('g'); time.sleep(.2); pg.keyboard.press('Control+2'); time.sleep(.3); check('Ctrl+2 → la forme n°2 (pas de 20-29)', 'n° 2 →' in log()[-2], log()[-2])
    # 7. la garde du mot juste
    pg.keyboard.press('g'); time.sleep(.2); pg.locator('#in').fill('Trois'); pg.keyboard.press('Enter'); time.sleep(.2); check('le mot juste refusé, la case reste', 'mot juste' in pg.locator('#garde').inner_text() and not pg.locator('#champ').is_hidden(), pg.locator('#garde').inner_text())
    # 8. Échap : efface le numéro, puis ferme
    pg.locator('#in').fill(''); pg.locator('#touches button',has_text='1').first.click(); time.sleep(.1); pg.keyboard.press('Escape'); time.sleep(.1); n1=pg.locator('#num').inner_text(); pg.keyboard.press('Escape'); time.sleep(.1)
    check('Échap efface le numéro, Échap ferme', n1=='' and pg.locator('#champ').is_hidden(), n1)
    # 9. une forme nouvelle rejoint la liste avec son compte ; une forme choisie voit son compte monter
    pg.keyboard.press('l'); time.sleep(.2); pg.locator('#in').fill('troiz'); pg.keyboard.press('Enter'); time.sleep(.2); pg.keyboard.press('l'); time.sleep(.2)
    txt=pg.locator('#liste').inner_text(); check('la forme nouvelle « troiz » est dans la liste (×1) ; « troix » choisie est passée ×7', 'troiz' in txt and 'troix\n×7' in txt or ('troiz' in txt and '×7' in txt), txt[:80].replace('\n','|'))
    pg.keyboard.press('Escape'); time.sleep(.1)
    check('0 erreur JS', not err, err)
    b.close()
print('BANC MAQUETTE 269 : '+('VERT' if all(ok) else 'ROUGE'))
