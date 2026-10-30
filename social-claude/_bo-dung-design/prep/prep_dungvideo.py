from PIL import Image, ImageFilter, ImageDraw
import numpy as np
exec(open('prep_nganh2.py').read().split("cfg={")[0])
S='/mnt/user-data/outputs/dungvideo/src/'; O='/mnt/user-data/outputs/dungvideo/assets/'
W,H=1080,1440
# ---------- bìa: ảnh thật P1 Gen 4 ở shop, màn hình hiện phần mềm dựng video (Kdenlive, GPL) ----------
def persp_coeffs(dst, src):
    A=[];B=[]
    for (x,y),(u,v) in zip(dst,src):
        A.append([x,y,1,0,0,0,-u*x,-u*y]); B.append(u)
        A.append([0,0,0,x,y,1,-v*x,-v*y]); B.append(v)
    return np.linalg.solve(np.array(A,float),np.array(B,float)).tolist()
ph=Image.open(S+'shop-p1g4.png').convert('RGB')
ui=Image.open(S+'kdenlive-19.04.2-commons.png').convert('RGB'); ui=ui.crop((8,3,ui.width-6,ui.height-8))
uw,uh=ui.size; th=round(uw/1.6)
scr=Image.new('RGB',(uw,th),(35,38,41)); scr.paste(ui,(0,0))
# thanh tác vụ Windows tối dưới cùng
d=ImageDraw.Draw(scr); d.rectangle((0,uh+18,uw,th),fill=(28,30,33))
SS=3
quad=[(277,145),(787,94),(798,401),(316,462)]
big=(ph.width*SS,ph.height*SS)
qb=[(x*SS,y*SS) for x,y in quad]
src=[(0,0),(uw,0),(uw,th),(0,th)]
warp=scr.transform(big,Image.PERSPECTIVE,persp_coeffs(qb,src),Image.BICUBIC)
m=Image.new('L',big,0); ImageDraw.Draw(m).polygon(qb,fill=255)
base=ph.resize(big,Image.LANCZOS)
comp=Image.composite(warp,base,m).resize(ph.size,Image.LANCZOS)
# màn hình thật hơi sáng hơn: lớp phản quang nhẹ
comp.save(O+'cv-full.png')
cv=comp.crop((114,85,1080,785)).resize((884,640),Image.LANCZOS); cv.save(O+'cv-p1g4.png')
# ---------- máy: tách nền, đặt nền studio ----------
cut={}
im=Image.open(S+'cut-xps15.png'); cut['xps']=fit(trim(main_blob(im)),1800)
for k,f in [('p1g4','psref-p1g4-02.png'),('p1g8','psref-p1g8-01.png')]:
    im=Image.open(S+f).convert('RGB')
    c=clean(im,222,16,200,True); a=np.asarray(c).copy()
    from scipy import ndimage as _nd
    lum=a[:,:,:3].astype(int).mean(axis=2); inside=a[:,:,3]>10
    dist=_nd.distance_transform_edt(inside)
    ys=np.where(inside.any(axis=1))[0]; y0_,y1_=ys.min(),ys.max()
    zone=np.zeros_like(inside); zone[int(y1_-(y1_-y0_)*0.12):,:]=True
    a[zone&inside&(lum>112)&(dist<16),3]=0
    a[(dist<4)&(lum>150),3]=0
    cut[k]=fit(trim(main_blob(Image.fromarray(a))),1800)
for k,c in cut.items(): c.save(O+'cut-'+k+'.png'); print(k,c.size)
def panel(k,PW,PH,name,sc_w=0.80,sc_h=0.84):
    bg=studio(PW,PH); lap=cut[k]; sc=min(PW*sc_w/lap.width, PH*sc_h/lap.height)
    lap=lap.resize((round(lap.width*sc),round(lap.height*sc)),Image.LANCZOS)
    x0=(PW-lap.width)//2; y0=PH-lap.height-round(PH*0.07)
    sh=Image.new('L',(PW,PH),0); ImageDraw.Draw(sh).ellipse((x0+lap.width*0.06,y0+lap.height-14,x0+lap.width*0.94,y0+lap.height+16),fill=160)
    bg=Image.composite(Image.new('RGBA',(PW,PH),(0,0,0,255)),bg,sh.filter(ImageFilter.GaussianBlur(16)))
    bg.alpha_composite(lap,(x0,y0)); bg.convert('RGB').save(O+name)
for k in cut: panel(k,884,560,f'p-{k}.png')
# ---------- nền slide trong: ảnh thật dựng video, làm mờ + phủ tối ----------
def fitcrop(im,fx=0.5,fy=0.5,w=W,h=H):
    sc=max(w/im.width,h/im.height); im=im.resize((round(im.width*sc),round(im.height*sc)),Image.LANCZOS)
    x0=min(max(round(im.width*fx-w/2),0),im.width-w); y0=min(max(round(im.height*fy-h/2),0),im.height-h)
    return im.crop((x0,y0,x0+w,y0+h))
s1=Image.open(S+'unsplash-bg-3.png').convert('RGB'); w3=s1.width//3
s2=Image.open(S+'unsplash-bg-2.png').convert('RGB'); w2=s2.width//2
src_bg={2:s1.crop((2*w3,0,3*w3,s1.height)),3:s2.crop((0,0,w2,s2.height)),4:s1.crop((0,0,w3,s1.height)),
        5:Image.open(S+'kdenlive-19.04.2-commons.png').convert('RGB'),6:s2.crop((w2,0,2*w2,s2.height))}
for k,im in src_bg.items():
    im=fitcrop(im).filter(ImageFilter.GaussianBlur(22))
    a=np.asarray(im).astype(float); mm=a.mean()
    f_=min(0.62,44/max(mm,1)) if mm>=40 else 0.62
    yy=np.mgrid[0:H,0:W][0]; g=np.clip(yy/(H*0.28),0,1)*0.3+0.7
    Image.fromarray(np.clip(a*f_*g[...,None],0,255).astype('uint8')).save(O+f'bg-{k}.png')
# ảnh khung slide 2: Premiere trên laptop (ảnh thật)
fr=s1.crop((w3,0,2*w3,s1.height)); print('frame src',fr.size)
fr=fitcrop(fr,0.5,0.38,884,380); fr.save(O+'f2-premiere.png')
# tờ xem nhanh
sh=Image.new('RGB',(3*450,2*600),'white')
for i,f in enumerate(['cv-p1g4.png','p-xps.png','p-p1g4.png','p-p1g8.png','f2-premiere.png','bg-2.png']):
    t=Image.open(O+f).convert('RGB'); t.thumbnail((444,594)); sh.paste(t,((i%3)*450,(i//3)*600))
sh.save('dv_assets_sheet.jpg')
