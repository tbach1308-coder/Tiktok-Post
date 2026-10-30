from PIL import Image, ImageFilter, ImageDraw
import numpy as np
from scipy import ndimage
exec(open('prep_mt5.py').read().split("out={}")[0].replace("S='/mnt/user-data/outputs/mt5/src/'; O='/mnt/user-data/outputs/mt5/assets/'",""))
exec(open('prep_air3.py').read().split("cut = {")[0].split("def studio")[1].join(["def studio",""]) if False else "")
S='/mnt/user-data/outputs/nganh/src/'; O='/mnt/user-data/outputs/nganh/assets/'
def studio(PW, PH, glow_y=0.6):
    y = np.linspace(0, 1, PH)[:, None]
    top = np.array([58, 64, 76]); bot = np.array([16, 19, 25])
    g = top * (1 - y) ** 1.2 + bot * (1 - (1 - y) ** 1.2)
    base = np.repeat(g[:, None, :], PW, axis=1)
    yy, xx = np.mgrid[0:PH, 0:PW]
    r = np.sqrt(((xx - PW / 2) / (PW * 0.58)) ** 2 + ((yy - PH * glow_y) / (PH * 0.55)) ** 2)
    base = base + (np.clip(1 - r, 0, 1) ** 1.8)[..., None] * np.array([44, 50, 60])
    return Image.fromarray(np.clip(base, 0, 255).astype('uint8')).convert('RGBA')
def main_blob(a_img):
    a=np.asarray(a_img).copy(); m=a[:,:,3]>12
    lab,n=ndimage.label(m)
    if n>1:
        sizes=ndimage.sum(m,lab,range(1,n+1)); keep=1+int(np.argmax(sizes)); a[(lab!=keep)&(lab>0),3]=0
    return Image.fromarray(a)
def clean(im, thr, sat, fmn=200, band_on=True):
    o=cut_neutral(im,thr=thr,sat=sat)
    a=np.asarray(o).copy()
    al=Image.fromarray(a[:,:,3]).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(1.0))
    a[:,:,3]=np.asarray(al)
    rgb=a[:,:,:3].astype(int); mn=rgb.min(axis=2); sat=rgb.max(axis=2)-mn
    inside=a[:,:,3]>0
    dist=ndimage.distance_transform_edt(inside)
    fr=(dist<12)&(mn>fmn)&(sat<20)
    a[fr,3]=0
    ys=np.where(inside.any(axis=1))[0]; y1=ys.max(); hh=y1-ys.min()
    if not band_on:
        op=Image.fromarray((a[:,:,3]>128).astype('uint8')*255).filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MaxFilter(15))
        a[:,:,3]=np.minimum(a[:,:,3],np.asarray(op))
        from scipy.spatial import ConvexHull
        m=a[:,:,3]>128; ys,xs=np.where(m); ymin,ymax=ys.min(),ys.max(); ycut=int(ymin+(ymax-ymin)*0.55)
        sel=ys>=ycut; pts=np.stack([xs[sel],ys[sel]],1)[::7]
        hull=ConvexHull(pts); poly=[tuple(map(int,pts[v])) for v in hull.vertices]
        hm=Image.new('L',(a.shape[1],a.shape[0]),0); ImageDraw.Draw(hm).polygon(poly,fill=255)
        hm=np.asarray(hm)>0
        a[hm&(a[:,:,3]<255),3]=255
        a[:,:,3]=np.asarray(Image.fromarray(a[:,:,3]).filter(ImageFilter.GaussianBlur(0.8))); return main_blob(Image.fromarray(a))
    band=np.zeros_like(inside); band[int(y1-hh*0.04):,:]=True
    a[band&(mn>170)&(sat<22),3]=0
    a[:,:,3]=np.asarray(Image.fromarray(a[:,:,3]).filter(ImageFilter.GaussianBlur(0.8)))
    return main_blob(Image.fromarray(a))
cfg={'hp':('icecat-hp1040-1.jpg',241,8,238,False),'dell':('icecat-d5570-1.jpg',222,16,200,True),'p1':('icecat-thinkpad-p1-gen5-1.jpg',222,16,200,True),'x13':('icecat-thinkpad-x13-gen3-1.png',222,16,200,True)}
cut={}
for k,(f,t,s_,fm,bo) in cfg.items():
    im=Image.open(S+f).convert('RGB')
    if im.width>2400: im=im.resize((2400,round(im.height*2400/im.width)),Image.LANCZOS)
    c=fit(trim(clean(im,t,s_,fm,bo)),1800); cut[k]=c; c.save(O+'cut-'+k+'.png'); print(k,c.size,round(c.width/c.height,2))
def panel(k,PW,PH,name):
    bg=studio(PW,PH); lap=cut[k]; sc=min(PW*0.78/lap.width, PH*0.84/lap.height)
    lap=lap.resize((round(lap.width*sc),round(lap.height*sc)),Image.LANCZOS)
    x0=(PW-lap.width)//2; y0=PH-lap.height-round(PH*0.07)
    sh=Image.new('L',(PW,PH),0); ImageDraw.Draw(sh).ellipse((x0+lap.width*0.06,y0+lap.height-14,x0+lap.width*0.94,y0+lap.height+16),fill=160)
    bg=Image.composite(Image.new('RGBA',(PW,PH),(0,0,0,255)),bg,sh.filter(ImageFilter.GaussianBlur(16)))
    bg.alpha_composite(lap,(x0,y0)); bg.convert('RGB').save(O+name)
for k in ['hp','x13','dell','p1']: panel(k,884,430,f'p-{k}.png')
sh=Image.new('RGB',(2*890,2*440),'white')
for i,k in enumerate(['hp','x13','dell','p1']): sh.paste(Image.open(O+f'p-{k}.png'),((i%2)*890,(i//2)*440))
sh.save('nganhpanels2.jpg'); Image.open(O+'p-hp.png').crop((150,200,750,430)).save('hpzoom.png')
