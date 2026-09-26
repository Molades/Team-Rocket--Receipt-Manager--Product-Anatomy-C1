# Assembles www/index.html from the shared web sources plus the native layer.
import os
d=os.path.dirname(os.path.abspath(__file__))
r=lambda f:open(os.path.join(d,'src',f),encoding='utf8').read()
html=('<!doctype html><html lang="en"><head><meta charset="utf-8">'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
 '<meta name="theme-color" content="#FFFDF4" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#FFFDF4" media="(prefers-color-scheme: dark)">'
 '<title>Receipt Keeper</title><style>:root{color-scheme:light}body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>'
 '<style>'+r('wf.css')+r('extra.css')+r('native.css')+r('pastel.css').replace('@@MANROPE@@','data:font/woff2;base64,'+__import__('base64').b64encode(open(os.path.join(d,'src','manrope.woff2'),'rb').read()).decode())+'</style></head><body>\n'+r('body.html')+
 '\n<script src="shim.js"></script>\n<script>\n'+r('app.js').replace('/*@@UI@@*/',r('ui.js'))+'</script>\n</body></html>\n')
open(os.path.join(d,'www','index.html'),'w',encoding='utf8').write(html)
print('www/index.html',len(html))
