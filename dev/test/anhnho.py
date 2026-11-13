# Ảnh thu nhỏ (fen 13/11 "tối ưu"): /file?...&w=96|160|400 -> JPEG nhỏ; link có &t= thì trình duyệt nhớ 1 ngày (chỉ 1 dòng Cache-Control)
import json, time, urllib.request, urllib.error, urllib.parse, os, shutil, io
APP='http://127.0.0.1:8790'; K='http://127.0.0.1:8791'
ok=[0,0]
def check(n, c, x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def req(base, path, d=None, h=None, raw=True):
    r = urllib.request.Request(base+path, data=json.dumps(d).encode() if d is not None else None, headers=dict({'Content-Type':'application/json'}, **(h or {})))
    try:
        with urllib.request.urlopen(r, timeout=60) as f:
            b=f.read(); return f.status, (b if raw else json.loads(b)), f.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read(), e.headers
jobs=json.loads(req(APP,'/api/jobs')[1])['jobs']
bia=[x['bia'] for x in jobs if x.get('bia')]
check('ảnh bìa trong danh sách bài là ảnh nhỏ (&w=96)', bia and all(b.endswith('&w=96') for b in bia), bia[:2])
u=bia[0]; P=urllib.parse.unquote(u.split('p=')[1].split('&')[0])
t0=time.time(); s,b,h=req(APP,u); t1=time.time()-t0
check('bìa nhỏ: JPEG, dưới 15KB', s==200 and h['Content-Type']=='image/jpeg' and len(b)<15000 and b[:2]==b'\xff\xd8', (s,h['Content-Type'],len(b)))
check('bìa nhỏ: nhớ 1 ngày, chỉ 1 dòng Cache-Control', h.get_all('Cache-Control')==['max-age=86400'], h.get_all('Cache-Control'))
t0=time.time(); s,b2,h=req(APP,u); t2=time.time()-t0
check('lần 2 lấy từ bộ nhớ (nhanh, giống hệt)', b2==b and t2<=max(t1,0.05), (t1,t2))
s,g,h=req(APP,u.replace('&w=96',''))
check('ảnh gốc (bấm xem to) vẫn nguyên PNG', s==200 and g[:4]==b'\x89PNG' and len(g)==os.path.getsize(P), (s,len(g)))
check('ảnh gốc có &t= cũng nhớ 1 ngày', h.get_all('Cache-Control')==['max-age=86400'], h.get_all('Cache-Control'))
s,m,h=req(APP,u.replace('&w=96','&w=400'))
from PIL import Image
im=Image.open(io.BytesIO(m))
check('lưới slide: rộng 400, đúng tỉ lệ', im.width==400 and abs(im.height/im.width - Image.open(P).height/Image.open(P).width)<0.01, im.size)
s,x,h=req(APP,u.replace('&w=96','&w=1234'))
check('cỡ lạ: trả ảnh gốc', s==200 and x[:4]==b'\x89PNG', s)
s,x,h=req(APP,u.split('&t=')[0])
check('không có &t=: chỉ nhớ 5 giây như cũ', h.get_all('Cache-Control')==['max-age=5'], h.get_all('Cache-Control'))
s,x,h=req(APP,'/api/jobs'); check('API vẫn no-store', h.get_all('Cache-Control')==['no-store'], h.get_all('Cache-Control'))
s,x,h=req(APP,'/file?p='+urllib.parse.quote('/etc/passwd')+'&w=96'); check('file ngoài thư mục bài: chặn', s==404, s)
# sửa slide (Photoshop dựng lại) -> ảnh nhỏ ra theo ảnh mới
d='/home/claude/bug3/_anhnho'; os.makedirs(d, exist_ok=True); bk=os.path.join(d,'goc.png'); shutil.copy2(P,bk)
try:
    a=Image.open(P).convert('RGBA'); a.paste((255,0,0,128),(0,0,a.width,a.height)); a.save(P)
    os.utime(P,(time.time()+5,time.time()+5))
    s,n,h=req(APP,u); c=Image.open(io.BytesIO(n)).convert('RGB').getpixel((10,10))
    check('slide sửa lại: ảnh nhỏ làm lại theo ảnh mới (ảnh trong suốt nền trắng)', n!=b and c[0]>200 and 100<c[1]<160, c)
finally:
    shutil.copy2(bk,P)
s,n,h=req(APP,u); check('trả slide cũ: ảnh nhỏ như ban đầu', n==b, len(n))
# 30 ảnh khác nhau gọi cùng lúc: không lỗi
import concurrent.futures as cf
us=[x.replace('&w=96','&w=400') for x in bia[:30]]
with cf.ThreadPoolExecutor(10) as ex: rs=list(ex.map(lambda v: req(APP,v)[0], us))
check('30 ảnh lưới slide cùng lúc: đều 200', all(r==200 for r in rs), rs)
print('ĐẠT %d / %d' % (ok[0], sum(ok)))
raise SystemExit(1 if ok[1] else 0)
