from PIL import Image, ImageFilter
import numpy as np
from collections import deque
S='/mnt/user-data/outputs/mt5/src/'; O='/mnt/user-data/outputs/mt5/assets/'
def cut_neutral(im, thr=236, sat=12):
    a=np.asarray(im.convert('RGB')).astype(int); h,w,_=a.shape
    bgc=(a.min(axis=2)>=thr)&((a.max(axis=2)-a.min(axis=2))<=sat)
    bg=np.zeros((h,w),bool); q=deque()
    for x in range(w):
        for y in (0,h-1):
            if bgc[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
    for y in range(h):
        for x in (0,w-1):
            if bgc[y,x] and not bg[y,x]: bg[y,x]=True; q.append((y,x))
    while q:
        y,x=q.popleft()
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny,nx=y+dy,x+dx
            if 0<=ny<h and 0<=nx<w and bgc[ny,nx] and not bg[ny,nx]: bg[ny,nx]=True; q.append((ny,nx))
    al=Image.fromarray(np.where(bg,0,255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    o=im.convert('RGBA'); o.putalpha(al); return o
def trim(im):
    a=np.asarray(im.split()[-1]); ys,xs=np.where(a>12)
    return im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1))
def fit(im, maxw=1800):
    if im.width>maxw: im=im.resize((maxw, round(im.height*maxw/im.width)), Image.LANCZOS)
    return im
out={}
def cut_below(im, y0):
    a=np.asarray(im).copy(); h=a.shape[0]
    g=np.asarray(im.convert('L')).astype(int)
    for x in range(a.shape[1]):
        col=g[y0-40:y0+12,x]
        idx=np.where(col<115)[0]
        yc=(y0-40+idx.max()+2) if len(idx) else y0
        a[yc:,x,3]=0
    return Image.fromarray(a)
for k,f,yc in [('d7670','dell-2.jpg',1416),('zb9','zbookg9-1.jpg',1896)]:
    im=Image.open(S+f).convert('RGB'); im=im.resize((2000,2000),Image.LANCZOS)
    out[k]=fit(trim(cut_below(cut_neutral(im),yc)))
for k,f in [('p1g7','p1g7.png'),('p1g4','p1g4-a.png'),('p15','p15-a.png')]:
    out[k]=fit(trim(Image.open(S+f).convert('RGBA')))
for k,v in out.items(): v.save(O+k+'.png'); print(k, v.size)
sh=Image.new('RGB',(5*360,260),(40,44,52)); x=0
for k in ['p1g7','d7670','p1g4','zb9','p15']:
    t=out[k].copy(); t.thumbnail((340,240)); sh.paste(t,(x+10,10),t); x+=360
sh.save('/tmp/claude-0/-home-claude/198efd24-7826-530f-b023-69f2a6cd32fb/scratchpad/mt5cut.jpg')
