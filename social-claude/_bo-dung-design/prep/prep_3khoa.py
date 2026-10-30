from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
import numpy as np
S='/mnt/user-data/outputs/3khoa/src/'; O='/mnt/user-data/outputs/3khoa/assets/'
W,H=1080,1440
def persp_coeffs(dst, src):
    A=[];B=[]
    for (x,y),(u,v) in zip(dst,src):
        A.append([x,y,1,0,0,0,-u*x,-u*y]); B.append(u)
        A.append([0,0,0,x,y,1,-v*x,-v*y]); B.append(v)
    return np.linalg.solve(np.array(A,float),np.array(B,float)).tolist()
def bil(q,u,v):
    (x0,y0),(x1,y1),(x2,y2),(x3,y3)=q
    tx=x0+(x1-x0)*u; ty=y0+(y1-y0)*u; bx=x3+(x2-x3)*u; by=y3+(y2-y3)*u
    return (tx+(bx-tx)*v, ty+(by-ty)*v)
# ---- bìa: ThinkPad thật ở shop, màn hiện BIOS (ảnh chụp BIOS ThinkPad thật, Commons CC BY-SA 4.0) ----
ph=Image.open(S+'shop-13-44-34.jpg').convert('RGB')
lid=[(674,18),(1173,234),(988,655),(570,372)]
U0,U1,V0,V1=0.03,0.975,0.055,0.955
quad=[bil(lid,U0,V0),bil(lid,U1,V0),bil(lid,U1,V1),bil(lid,U0,V1)]
bios=Image.open(S+'bios-t470-commons.png').convert('RGB').crop((86,66,699,412))
bios=ImageEnhance.Brightness(bios).enhance(0.92)
SS=3; big=(ph.width*SS,ph.height*SS); qb=[(x*SS,y*SS) for x,y in quad]
bw,bh=bios.size
warp=bios.transform(big,Image.PERSPECTIVE,persp_coeffs(qb,[(0,0),(bw,0),(bw,bh),(0,bh)]),Image.BICUBIC)
m=Image.new('L',big,0); ImageDraw.Draw(m).polygon(qb,fill=255)
comp=Image.composite(warp,ph.resize(big,Image.LANCZOS),m.filter(ImageFilter.GaussianBlur(1.2))).resize(ph.size,Image.LANCZOS)
comp.save(O+'cv-full.png')
# crop khung bìa 884x640 (tỉ lệ 1.381) quanh máy
cx0,cy0,cw=330,0,1280-330; ch=round(cw/1.381)
cv=comp.crop((cx0,cy0,cx0+cw,cy0+ch)).resize((884,640),Image.LANCZOS); cv.save(O+'cv-bios.png'); print('cover crop',cw,ch)
# ---- ảnh khung slide trong ----
def fitcrop(im,fx=0.5,fy=0.5,w=W,h=H):
    sc=max(w/im.width,h/im.height); im=im.resize((round(im.width*sc),round(im.height*sc)),Image.LANCZOS)
    x0=min(max(round(im.width*fx-w/2),0),im.width-w); y0=min(max(round(im.height*fy-h/2),0),im.height-h)
    return im.crop((x0,y0,x0+w,y0+h))
def framed(im,w,h,fx=0.5,fy=0.5,bg=None):
    return fitcrop(im,fx,fy,w,h)
FH=440
framed(Image.open(S+'bios-t470-commons.png').convert('RGB'),884,570,0.5,0.40).save(O+'f2-bios.png')
# màn hình chụp: đặt giữa nền tối, không cắt chữ
def screen_on_dark(im,w,h,pad=34):
    bg=Image.new('RGB',(w,h),(18,22,28)); sc=min((w-2*pad)/im.width,(h-2*pad)/im.height)
    r=im.resize((round(im.width*sc),round(im.height*sc)),Image.LANCZOS)
    sh=Image.new('L',(w,h),0); x=(w-r.width)//2; y=(h-r.height)//2
    ImageDraw.Draw(sh).rectangle((x+6,y+10,x+r.width+6,y+r.height+10),fill=150)
    bg=Image.composite(Image.new('RGB',(w,h),(0,0,0)),bg,sh.filter(ImageFilter.GaussianBlur(12)))
    bg.paste(r,(x,y)); return bg
screen_on_dark(Image.open(S+'oobe-work-signin-ms.png').convert('RGB'),884,515).save(O+'f3-oobe.png')
screen_on_dark(Image.open(S+'bitlocker-recovery-ms.png').convert('RGB'),884,570).save(O+'f4-bitlocker.png')
framed(Image.open(S+'shop-dell5560.jpg').convert('RGB'),884,495,0.5,0.0).save(O+'f5-shop.png')
# ---- nền: ảnh thật ở shop làm mờ + phủ tối (x0.40) ----
for k,f,fx in [(2,'shop-13-44-44.jpg',0.6),(3,'shop-13-44-38.jpg',0.5),(4,'shop-aorus.jpg',0.5),(5,'shop-3may.jpg',0.5),(6,'shop-13-44-40.jpg',0.5)]:
    im=fitcrop(Image.open(S+f).convert('RGB'),fx).filter(ImageFilter.GaussianBlur(22))
    a=np.asarray(im).astype(float); yy=np.mgrid[0:H,0:W][0]; g=np.clip(yy/(H*0.28),0,1)*0.3+0.7
    Image.fromarray(np.clip(a*0.40*g[...,None],0,255).astype('uint8')).save(O+f'bg-{k}.png')
sh=Image.new('RGB',(3*450,2*330),'white')
for i,f in enumerate(['cv-bios.png','f2-bios.png','f3-oobe.png','f4-bitlocker.png','f5-shop.png','bg-2.png']):
    t=Image.open(O+f).convert('RGB'); t.thumbnail((444,324)); sh.paste(t,((i%3)*450,(i//3)*330))
sh.save('k3_sheet.jpg')
