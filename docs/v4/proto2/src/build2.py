import os
import os
HERE=os.path.dirname(os.path.abspath(__file__))
F=os.path.join(HERE,'frag2')+'/'
O=os.path.dirname(HERE)+'/'
head=open(F+'head.html').read()
PAGES=[('index','Teacher Bek — English makes sense when someone tells you why','Thầy Bek — Tiếng Anh dễ hiểu khi có người giải thích why',True,'','story.css'),
       ('classes','English classes in Phú Nhuận for ages 5–17 — Teacher Bek','Lớp tiếng Anh ở Phú Nhuận cho 5–17 tuổi — Thầy Bek',False,'cls','pages.css'),
       ('approach','Why-first teaching — Teacher Bek','Dạy học theo hướng why — Thầy Bek',False,'app','pages.css')]
langs=['en']+(['vi'] if os.path.exists(F+'chrome.vi.html') else [])
for lang in langs:
    sfx='' if lang=='en' else '.vi'
    chrome=open(F+f'chrome{sfx}.html').read(); foot=open(F+f'foot{sfx}.html').read()
    for name,t_en,t_vi,loader,cur,css in PAGES:
        if not os.path.exists(F+f'{name}.body{sfx}.html'): continue
        other=f'{name}.vi.html' if lang=='en' else f'{name}.html'
        age='<p class="age-chip" aria-hidden="true">%s <b id="age">5</b><span>/ 17</span></p>'%('Age' if lang=='en' else 'Tuổi') if name=='index' else '<span></span>'
        ch=chrome.replace('%AGE%',age).replace('%CLS%','aria-current="page"' if cur=='cls' else '').replace('%APP%','aria-current="page"' if cur=='app' else '').replace('%VI%',other).replace('%EN%',other)
        b=open(F+f'{name}.body{sfx}.html').read().replace('%CHROME%',ch).replace('%FOOT%',foot)
        if lang=='vi': b=b.replace('<script src="js/core.js"></script>','<script src="js/i18n.vi.js"></script><script src="js/core.js"></script>')
        open(O+f'{name}{sfx}.html','w',encoding='utf-8').write(f'''<!doctype html>
<html lang="{lang}"{' data-loader' if loader else ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{t_en if lang=='en' else t_vi}</title>
<link rel="alternate" hreflang="{'vi' if lang=='en' else 'en'}" href="{other}">
<link rel="preload" href="../../../public/fonts/archivo-vf.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/brand.css"><link rel="stylesheet" href="css/{css}"><link rel="stylesheet" href="css/notebook.css">
{head}</head>
<body>
{b}
</body>
</html>
''')
print('built',langs)
