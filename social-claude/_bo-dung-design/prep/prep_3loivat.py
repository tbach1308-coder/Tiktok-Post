from PIL import Image, ImageFilter, ImageDraw, ImageFont, ImageEnhance
import numpy as np
S='/mnt/user-data/outputs/3loivat/src/'; O='/mnt/user-data/outputs/3loivat/assets/'
W,H=1080,1440
def persp_coeffs(dst, src):
    A=[];B=[]
    for (x,y),(u,v) in zip(dst,src):
        A.append([x,y,1,0,0,0,-u*x,-u*y]); B.append(u)
        A.append([0,0,0,x,y,1,-v*x,-v*y]); B.append(v)
    return np.linalg.solve(np.array(A,float),np.array(B,float)).tolist()
def fitcrop(im,fx=0.5,fy=0.5,w=W,h=H):
    sc=max(w/im.width,h/im.height); im=im.resize((round(im.width*sc),round(im.height*sc)),Image.LANCZOS)
    x0=min(max(round(im.width*fx-w/2),0),im.width-w); y0=min(max(round(im.height*fy-h/2),0),im.height-h)
    return im.crop((x0,y0,x0+w,y0+h))
# ảnh chụp thật trang Cài đặt > Trợ năng > Bàn phím (máy shop), bỏ cột trái có tên tài khoản
st=Image.open(S+'settings-keyboard-shop-pc.jpg').convert('RGB')
pane=st.crop((300,40,995,700))   # Accessibility > Keyboard, Filter keys
# ---- bìa: Dell Precision 5560 ở shop, màn hiện trang Cài đặt Bàn phím ----
ph=Image.open(S+'shop-dell5560.jpg').convert('RGB')
quad=[(610,35),(1192,127),(1033,634),(511,430)]
scr=Image.new('RGB',(1600,1000),(32,32,32))
win=Image.open(S+'settings-keyboard-snip.png').convert('RGB').crop((553,97,1238,1017)); sc=940/win.height; win=win.resize((round(win.width*sc),940),Image.LANCZOS)
scr.paste(win,((1600-win.width)//2,8)); ImageDraw.Draw(scr).rectangle((0,952,1600,1000),fill=(24,24,24))
SS=3; big=(ph.width*SS,ph.height*SS); qb=[(x*SS,y*SS) for x,y in quad]
warp=scr.transform(big,Image.PERSPECTIVE,persp_coeffs(qb,[(0,0),(1600,0),(1600,1000),(0,1000)]),Image.BICUBIC)
m=Image.new('L',big,0); ImageDraw.Draw(m).polygon(qb,fill=255)
comp=Image.composite(warp,ph.resize(big,Image.LANCZOS),m.filter(ImageFilter.GaussianBlur(1.2))).resize(ph.size,Image.LANCZOS)
comp.save(O+'cv-full.png')
cw=1180; ch=round(cw/1.381); cx0=90; cy0=0
comp.crop((cx0,cy0,cx0+cw,cy0+ch)).resize((884,640),Image.LANCZOS).save(O+'cv-dell.png')
# ---- slide 2: trang Bàn phím (ảnh chụp thật) trên nền tối ----
def screen_on_dark(im,w,h,pad=30):
    bg=Image.new('RGB',(w,h),(18,22,28)); sc=min((w-2*pad)/im.width,(h-2*pad)/im.height)
    r=im.resize((round(im.width*sc),round(im.height*sc)),Image.LANCZOS)
    x=(w-r.width)//2; y=(h-r.height)//2
    sh=Image.new('L',(w,h),0); ImageDraw.Draw(sh).rectangle((x+6,y+10,x+r.width+6,y+r.height+10),fill=150)
    bg=Image.composite(Image.new('RGB',(w,h),(0,0,0)),bg,sh.filter(ImageFilter.GaussianBlur(12)))
    bg.paste(r,(x,y)); return bg,(x,y,sc)
import sys
snip=Image.open(S+'settings-keyboard-snip.png').convert('RGB').crop((540,140,1240,500))
f2,(x2,y2,s2)=screen_on_dark(snip,884,515)
d=ImageDraw.Draw(f2)
d.rounded_rectangle((x2+24*s2,y2+216*s2,x2+680*s2,y2+290*s2),radius=14,outline=(255,214,10),width=6)
f2.save(O+'f2-filterkeys.png')
# ---- slide 3: touchpad thật (Aorus ở shop) ----
fitcrop(Image.open(S+'shop-aorus-keys.jpg').convert('RGB'),0.30,0.62,884,515).save(O+'f3-touchpad.png')
# ---- slide 5: mặt C ThinkPad ở shop ----
fitcrop(Image.open(S+'shop-13-44-44.jpg').convert('RGB'),0.55,0.45,884,570).save(O+'f5-matc.png')
# ---- slide 4: hộp Properties > Power Management (dựng lại đúng bố cục Windows) ----
pm=Image.open('pm_dialog_2x.png').convert('RGB').crop((0,0,940,464))
f4,(x4,y4,s4)=screen_on_dark(pm,884,570)
d=ImageDraw.Draw(f4); d.rounded_rectangle((x4+28*s4,y4+244*s4,x4+800*s4,y4+304*s4),radius=12,outline=(255,214,10),width=6)
f4.save(O+'f4-powermgmt.png')
# ---- nền ----
for k,f,fx in [(2,'shop-13-44-40.jpg',0.5),(3,'shop-aorus.jpg',0.5),(4,'shop-dell5560-b.jpg',0.5),(5,'shop-13-44-38.jpg',0.5),(6,'shop-3may.jpg',0.5)]:
    im=fitcrop(Image.open(S+f).convert('RGB'),fx).filter(ImageFilter.GaussianBlur(22))
    a=np.asarray(im).astype(float); yy=np.mgrid[0:H,0:W][0]; g=np.clip(yy/(H*0.28),0,1)*0.3+0.7
    Image.fromarray(np.clip(a*0.40*g[...,None],0,255).astype('uint8')).save(O+f'bg-{k}.png')
sh=Image.new('RGB',(3*450,2*330),'white')
for i,f in enumerate(['cv-dell.png','f2-filterkeys.png','f3-touchpad.png','f5-matc.png','bg-3.png','cv-full.png']):
    t=Image.open(O+f).convert('RGB'); t.thumbnail((444,324)); sh.paste(t,((i%3)*450,(i//3)*330))
sh.save('lv_sheet.jpg')
