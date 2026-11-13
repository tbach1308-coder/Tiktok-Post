# Máy con bấm Đăng TikTok (web) (fen 13/11 17h05 "cho máy con full chức năng này"): khoá riêng cho tiện ích Poly TikTok trên Chrome máy con
# chạy trên app thử vừa reset: cd /home/claude/bug3 && bash reset.sh && python3 tiktokmay.py
import json, time, urllib.request, urllib.error, urllib.parse, os, io, zipfile
APP='http://127.0.0.1:8790'; K='http://127.0.0.1:8791'
ok=[0,0]
def check(n, c, x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def req(base, path, d=None, h=None, raw=False):
    r = urllib.request.Request(base+path, data=json.dumps(d).encode() if d is not None else None, headers=dict({'Content-Type':'application/json'}, **(h or {})))
    try:
        with urllib.request.urlopen(r, timeout=60) as f:
            b=f.read(); return f.status, (b if raw else json.loads(b) if b[:1] in (b'{', b'[') else b), dict(f.headers)
    except urllib.error.HTTPError as e:
        b=e.read()
        try: return e.code, json.loads(b), dict(e.headers)
        except Exception: return e.code, b, dict(e.headers)
def cho(base, jid, h=None, n=120):
    for _ in range(n):
        st=req(base,'/api/job/'+jid,h=h)[1]
        if (st.get('job') or {}).get('status') in ('xong','loi','dung'): return st
        time.sleep(1)
    return st
r=req(APP,'/api/chung',{"bat": True})[1]
for _ in range(20):
    r=req(APP,'/api/chung')[1]
    if r['chay']: break
    time.sleep(0.5)
HOST=r['url'].split('//')[1]; H={'Host':HOST}
def vao(ten):
    ma=req(APP,'/api/chung',{"ma_moi": True})[1]['ma']
    return req(K,'/api/chung/vao',{"ma":ma,"ten":ten},h=H)[1]['token']
T1={'Host':HOST,'X-Poly-Khach':vao('Mac Quan')}; T2={'Host':HOST,'X-Poly-Khach':vao('May Hai')}
oj=req(APP,'/api/run',{"kenh":"laptop","brief":"Bìa: BÀI MÁY SHOP TT\nSlide 2: x"})[1]['id']
j1=req(K,'/api/run',{"kenh":"laptop","brief":"Bìa: BÀI MÁY CON 1\nSlide 2: x","theme_ps":"phang-xanh-dem"},h=T1)[1]['id']
j2=req(K,'/api/run',{"kenh":"ipad","brief":"Bìa: BÀI MÁY CON 2\nSlide 2: x","theme_ps":"phang-xanh-dem"},h=T2)[1]['id']
v1=cho(K,j1,T1); cho(K,j2,T2); cho(APP,oj)
check('bài máy con dựng xong', (v1.get('job') or {}).get('status')=='xong' and v1.get('slides'), (v1.get('job') or {}).get('status'))
sl1=v1['slides']; sl2=req(K,'/api/job/'+j2,h=T2)[1]['slides']; slo=req(APP,'/api/job/'+oj)[1]['slides']
req(K,'/api/job/%s/caption'%j1,{"text":"Caption máy con 1 #laptop\nghim"},h=T1)
# --- nút Đăng TikTok (web) trên máy con ---
log0=open('/home/claude/bug3/tgl/app-log.txt',encoding='utf-8').read() if os.path.exists('/home/claude/bug3/tgl/app-log.txt') else ''
s,b,_=req(K,'/api/job/%s/tiktok-may'%j1,{},h=T1)
check('máy con bấm Đăng TikTok: có khoá + link TikTok Studio', s==200 and len(b.get('k',''))>=40 and b['url'].startswith('https://www.tiktok.com/') and b['url'].endswith('poly='+j1), (s,b))
KH=b.get('k','')
check('ghi "Đã mở TikTok" vào bài', any(x.get('kieu')=='tiktok' for x in req(K,'/api/job/'+j1,h=T1)[1].get('da_gui') or []))
s,b,_=req(K,'/api/job/%s/tiktok-may'%j2,{},h=T1); check('máy con bấm cho bài máy khác: chặn', s in (403,404), (s,b))
s,b,_=req(K,'/api/job/%s/tiktok-may'%oj,{},h=T1); check('máy con bấm cho bài máy shop: chặn', s in (403,404), (s,b))
s,b,_=req(K,'/api/job/%s/tiktok'%j1,{},h=T1); check('máy con vẫn không mở được Chrome máy shop (/tiktok)', s==403, (s,b))
# --- tiện ích dùng khoá ---
E={'Host':HOST,'X-Poly-TK':KH,'Origin':'chrome-extension://abcdefghijklmnop'}
s,b,_=req(K,'/api/tiktok/'+j1,h=E)
check('tiện ích lấy bài bằng khoá: caption + slide', s==200 and b.get('caption','').startswith('Caption máy con 1') and len(b.get('files',[]))==len(sl1), (s,str(b)[:200]))
check('link slide tương đối (ghép với link Cloudflare)', s==200 and all(f['url'].startswith('/file?p=') for f in b['files']), b.get('files',[])[:1])
if s==200:
    s2,bb,_=req(K,b['files'][0]['url'],h=E,raw=True); check('tiện ích tải slide bằng khoá: PNG gốc', s2==200 and bb[:4]==b'\x89PNG', s2)
s,b,_=req(K,'/api/tiktok/'+j1,h={'Host':HOST,'X-Poly-TK':KH}); check('khoá không có Origin (Chrome có thể bỏ): vẫn được', s==200, s)
s,b,_=req(K,'/api/tiktok/'+j1,h=dict(E, Origin='https://evil.example')); check('khoá gửi từ trang web lạ: chặn', s==403, (s,b))
s,b,_=req(K,'/api/tiktok/'+j2,h=E); check('khoá bài 1 lấy bài máy khác: chặn', s==403, (s,b))
s,b,_=req(K,'/api/tiktok/'+oj,h=E); check('khoá lấy bài máy shop: chặn', s==403, (s,b))
s,b,_=req(K,'/file?p='+urllib.parse.quote(sl2[0]['path']),h=E,raw=True); check('khoá lấy slide máy khác: chặn', s==404, s)
s,b,_=req(K,'/file?p='+urllib.parse.quote(slo[0]['path']),h=E,raw=True); check('khoá lấy slide máy shop: chặn', s==404, s)
for p in ['/api/jobs','/api/job/'+j1,'/api/health','/api/telegram','/','/api/chung/toi']:
    s,b,_=req(K,p,h=E); check('khoá chỉ dùng cho tiện ích: %s chặn' % p, s==403, (s,str(b)[:80]))
s,b,_=req(K,'/api/job/%s/xoa'%j1,{},h=E); check('khoá không xoá được bài', s==403, (s,b))
s,b,_=req(K,'/api/tiktok/'+j1,h=dict(E, **{'X-Poly-TK':'0'*48})); check('khoá bịa: 401', s==401, (s,b))
s,b,_=req(K,'/api/tiktok/'+j1,h=dict(E, **{'X-Poly-TK':'xyz'})); check('khoá sai dạng: 401', s==401, (s,b))
# báo nhạc / đã đăng
s,b,_=req(K,'/api/tiktok-nhac',{"id":j1,"ten":"Beat thu may con","tacgia":"Poly"},h=E); check('tiện ích báo nhạc bài mình: được', s==200, (s,b))
s,b,_=req(K,'/api/tiktok-nhac',{"id":j2,"ten":"x","tacgia":"y"},h=E); check('báo nhạc bài máy khác: chặn', s==404, (s,b))
s,b,_=req(K,'/api/tiktok-dang',{"id":oj,"ok":True},h=E); check('báo đã đăng bài máy shop: chặn', s==404, (s,b))
check('bài máy shop chưa bị đánh dấu', not req(APP,'/api/job/'+oj)[1]['job'].get('da_dang'))
s,b,_=req(K,'/api/tiktok-dang',{"id":j1,"ok":True,"lich":0,"brand":False},h=E); check('tiện ích báo đã đăng bài mình: được', s==200, (s,b))
check('bài máy con: đã đăng', bool(req(K,'/api/job/'+j1,h=T1)[1]['job'].get('da_dang')))
s,b,_=req(K,'/api/tiktok-dang',{"id":j2,"ok":True},h=T1); check('máy con (mã thiết bị) báo đăng bài máy khác: chặn', s==404, (s,b))
s,b,_=req(K,'/api/tiktok-soi',{"items":[]},h=E); check('soi giao diện TikTok: máy con vẫn chặn', s==403, (s,b))
# khoá cũ hết khi app mở lại (RAM); máy shop vẫn mở TikTok kiểu cũ
s,b,_=req(APP,'/api/tiktok/'+oj); check('máy shop: tiện ích lấy bài như cũ (link 127.0.0.1)', s==200 and b['files'][0]['url'].startswith('http://127.0.0.1:'), (s,str(b)[:120]))
# tải tiện ích
s,b,hd=req(K,'/tai-tiktok-ext',h=T1,raw=True)
names=zipfile.ZipFile(io.BytesIO(b)).namelist() if s==200 else []
check('máy con tải tiện ích (.zip thư mục Poly TikTok)', s==200 and 'Poly TikTok/manifest.json' in names and 'Poly TikTok/app.js' in names and 'Poly TikTok/background.js' in names, (s,names))
mf=json.loads(zipfile.ZipFile(io.BytesIO(b)).read('Poly TikTok/manifest.json')) if s==200 else {}
check('tiện ích trong zip: bản 0.11+, có quyền trycloudflare', mf.get('version','0')>='0.11' and 'https://*.trycloudflare.com/*' in mf.get('host_permissions',[]), mf.get('version'))
check('tên file zip có số bản', 'poly-tiktok-' in (hd.get('Content-Disposition') or ''), hd.get('Content-Disposition'))
s,b,_=req(K,'/tai-tiktok-ext',h=H,raw=True); check('chưa vào dùng chung: không tải được', s==401, s)
# viết caption xong (sau=tiktok) trên bài máy con: không mở Chrome máy shop
req(K,'/api/job/%s/caption'%j2,{"text":""},h=T2)
s,b,_=req(K,'/api/job/%s/viet-caption'%j2,{"sau":"tiktok"},h=T2); check('máy con viết caption rồi đăng', s==200, (s,b))
st=cho(K,j2,T2); time.sleep(4)
lg=open('/home/claude/bug3/tgl/app-log.txt',encoding='utf-8').read()[len(log0):]
check('viết caption xong: không mở Chrome máy shop cho bài máy con', ('sau caption %s: da tiktok' % j2) not in lg and not (req(K,'/api/job/'+j2,h=T2)[1]['job'].get('sau_caption')), lg[-300:])
check('không ghi "Đã mở TikTok" khi chưa bấm trên máy con', not any(x.get('kieu')=='tiktok' for x in req(K,'/api/job/'+j2,h=T2)[1].get('da_gui') or []))
print('KẾT QUẢ: %d đạt, %d lỗi' % (ok[0], ok[1]))
raise SystemExit(1 if ok[1] else 0)
