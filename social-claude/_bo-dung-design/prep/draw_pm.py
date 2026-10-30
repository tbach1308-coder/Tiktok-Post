from PIL import Image, ImageDraw, ImageFont, ImageFilter
K=2
F='/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
f=lambda s: ImageFont.truetype(F, s*K)
Wd,Hd=470,500
im=Image.new('RGB',(Wd*K,Hd*K),(240,240,240)); d=ImageDraw.Draw(im)
def R(x0,y0,x1,y1,**kw): d.rectangle((x0*K,y0*K,x1*K,y1*K),**kw)
def T(x,y,s,sz,fill=(0,0,0)): d.text((x*K,y*K),s,font=f(sz),fill=fill)
# title bar
R(0,0,Wd,30,fill=(255,255,255)); T(12,8,'Intel(R) Wi-Fi 6 AX201 160MHz Properties',12)
T(Wd-26,5,'×',16,(60,60,60))
R(0,0,Wd-1,Hd-1,outline=(160,160,160),width=K)
# tabs
tabs=['General','Advanced','Driver','Details','Events','Power Management']
x=10; y=40
for t in tabs:
    w=int(d.textlength(t,font=f(12))/K)+14
    sel=t=='Power Management'
    if sel: R(x-2,y-3,x+w+2,y+20,fill=(255,255,255),outline=(173,173,173),width=K)
    else: R(x,y,x+w,y+20,fill=(240,240,240),outline=(200,200,200),width=K)
    T(x+7,y+3,t,12); x+=w+2
R(8,61,Wd-9,Hd-50,fill=(255,255,255),outline=(173,173,173),width=K)
R(x-2-int(d.textlength('Power Management',font=f(12))/K)-16, 60, x-2, 62, fill=(255,255,255))
# icon placeholder line (network card) - simple glyph
R(22,78,48,98,fill=(70,130,200)); R(26,82,44,94,fill=(160,200,240))
T(60,82,'Intel(R) Wi-Fi 6 AX201 160MHz',12)
def cb(y,label,checked,enabled=True):
    R(22,y,35,y+13,fill=(255,255,255),outline=(51,51,51) if enabled else (180,180,180),width=K)
    if checked: d.line([(24*K,(y+7)*K),(28*K,(y+11)*K),(34*K,(y+3)*K)],fill=(0,0,0),width=2*K)
    T(44,y-1,label,12,(0,0,0) if enabled else (150,150,150))
cb(130,'Allow the computer to turn off this device to save power',True)
cb(160,'Allow this device to wake the computer',True)
cb(190,'Only allow a magic packet to wake the computer',False)
# buttons
for i,(lab) in enumerate(['OK','Cancel']):
    bx=Wd-176+i*86; R(bx,Hd-38,bx+76,Hd-14,fill=(253,253,253),outline=(0,120,215) if i==0 else (173,173,173),width=K)
    T(bx+38-int(d.textlength(lab,font=f(12))/K/2),Hd-33,lab,12)
im.save('pm_dialog_2x.png'); im=im.resize((Wd,Hd),Image.LANCZOS)
im.save('pm_dialog.png')
