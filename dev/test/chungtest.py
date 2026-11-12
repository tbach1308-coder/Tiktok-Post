# Thử chế độ dùng chung: cổng khách 8791 (cổng app 8790 + 1), cloudflared giả
import json, time, urllib.request, urllib.error, os, glob, zipfile, io, re
APP='http://127.0.0.1:8790'; K='http://127.0.0.1:8791'
ok=[0,0]
def check(n, c, x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def req(base, path, d=None, h=None, raw=False):
    r = urllib.request.Request(base+path, data=json.dumps(d).encode() if d is not None else None, headers=dict({'Content-Type':'application/json'}, **(h or {})))
    try:
        with urllib.request.urlopen(r, timeout=30) as f:
            b=f.read(); return f.status, (b if raw else json.loads(b) if b[:1] in (b'{', b'[') else b), dict(f.headers)
    except urllib.error.HTTPError as e:
        b=e.read()
        try: return e.code, json.loads(b), dict(e.headers)
        except Exception: return e.code, b, dict(e.headers)
    except Exception as e:
        return 0, str(e), {}
r=req(APP,'/api/chung',{"bat": True})[1]; check('bật -> có mã vì chưa có máy', r['bat'] and len(r['ma'])==6, r)
for _ in range(20):
    r=req(APP,'/api/chung')[1]
    if r['chay']: break
    time.sleep(0.5)
check('đường nối giả chạy, có link', r['chay'] and r['url'].endswith('.trycloudflare.com'), r); URL=r['url']; HOST=URL.split('//')[1]
H={'Host': HOST}
s,b,_=req(K,'/',h=H,raw=True); check('khách GET / chưa vào: trang app', s==200 and b'POLY D' in b, s)
s,b,_=req(K,'/api/jobs',h=H); check('khách /api/jobs chưa vào: 401', s==401 and b.get('chua_vao'), (s,b))
s,b,_=req(K,'/api/chung/vao',{"ma":"000000","ten":"x"},h=H); check('mã sai', s==400 and 'Sai mã' in b['err'], b)
ma=req(APP,'/api/chung',{"ma_moi": True})[1]['ma']
s,b,hd=req(K,'/api/chung/vao',{"ma":ma,"ten":"MacBook Quân"},h=H)
check('mã đúng: có token + cookie HttpOnly', s==200 and len(b.get('token',''))>30 and 'HttpOnly' in hd.get('Set-Cookie',''), (s,b,hd.get('Set-Cookie')))
TOK=b.get('token'); T={'Host':HOST,'X-Poly-Khach':TOK}
check('cookie không Secure khi http (máy thử)', 'Secure' not in hd.get('Set-Cookie',''))
s,b,hd=req(K,'/api/chung/vao',{"ma":ma,"ten":"y"},h=dict(H, **{'X-Forwarded-Proto':'https'})); check('mã dùng 1 lần', s==400, b)
s,b,_=req(K,'/api/chung/toi',h=T); check('toi: khach + tên', s==200 and b['khach'] and b['ten']=='MacBook Quân', b)
s,b,_=req(K,'/api/chung/toi',h={'Host':HOST,'Cookie':'a=1; pdb_k='+TOK}); check('cookie pdb_k cũng vào được', s==200, (s,b))
s,b,_=req(K,'/api/health',h=T); check('health khách: đầy đủ như máy chủ', s==200 and 'san_sang' in b, s)
s,b,_=req(K,'/api/jobs',h=T); check('jobs khách mới vào: chưa có bài nào (chỉ thấy bài của mình)', s==200 and b['jobs']==[], (s, len(b.get('jobs',[]))))
oj=req(APP,'/api/jobs')[1]['jobs']; ojid=next((x['id'] for x in oj if x.get('status')=='xong' and not x.get('loai')), None)
if not ojid:     # máy thử mới tạo: dựng 1 bài máy shop trước (Claude giả)
    ojid=req(APP,'/api/run',{"kenh":"laptop","brief":"Bìa: BÀI MÁY SHOP\nSlide 2: x"})[1]['id']
    for _ in range(90):
        if (req(APP,'/api/job/'+ojid)[1].get('job') or {}).get('status')=='xong': break
        time.sleep(1)
for path in ['/api/telegram','/api/tg-lenh','/api/kho-chung','/api/tiktok-cai','/api/model-cai']:
    s,b,_=req(K,path,h=T); check('GET %s: được (full chức năng)' % path, s==200, (s,str(b)[:120]))
for path in ['/api/job/%s' % ojid, '/api/job/%s/log' % ojid, '/api/job/%s/zip' % ojid, '/api/tiktok/%s' % ojid, '/api/bai-co-san']:
    s,b,_=req(K,path,h=T); check('GET %s (bài máy shop / bài có sẵn): chặn' % path.replace(ojid,'<bài shop>'), s in (403,404), (s,b))
ov=req(APP,'/api/job/'+ojid)[1]; osl=(ov.get('slides') or [{}])[0].get('path')
s,b,_=req(K,'/file?p='+urllib.parse.quote(osl or 'x'),h=T); check('file slide bài máy shop: chặn', s==404, s)
s,b,_=req(K,'/api/chung',h=T); check('GET /api/chung: chặn (chỉ máy chủ quản lý)', s==403, (s,b))
for path,d in [('/api/chung',{"bat":False}),('/api/job/%s/mo'%ojid,{}),('/api/job/%s/tiktok'%ojid,{}),('/api/job/%s/xoa'%ojid,{}),('/api/job/%s/sua'%ojid,{"yeu_cau":"x"}),
               ('/api/tat',{}),('/api/login',{}),('/api/cai-claude',{}),('/api/tiktok-soi',{}),('/api/bai-co-san',{})]:
    s,b,_=req(K,path,d,h=T); check('POST %s: chặn' % path.replace(ojid,'<bài shop>'), s in (403,404), (s,b))
check('bài máy shop còn nguyên', req(APP,'/api/job/'+ojid)[0]==200)
s,b,_=req(K,'/api/telegram',{},h=T); check('POST /api/telegram (xem cài đặt): được', s==200, (s,b))
s,b,_=req(K,'/api/quy-tac',{},h=T); check('POST /api/quy-tac: tới được hàm (không 403)', s!=403, (s,b))
check('app vẫn sống sau /api/tat bị chặn', req(APP,'/api/ping')[0]==200)
s,b,_=req(K,'/api/jobs',h={'Host':HOST,'X-Poly-Khach':TOK,'Origin':'https://evil.example'}); check('origin lạ: 403', s==403, (s,b))
s,b,_=req(K,'/api/jobs',h={'Host':HOST,'X-Poly-Khach':TOK,'Origin':URL}); check('origin đúng link: 200', s==200, (s,b))
s,b,_=req(K,'/api/jobs',h={'Host':HOST,'X-Poly-Khach':'x'*43}); check('token bịa: 401', s==401)
# nháp riêng
mid=req(K,'/api/chung/toi',h=T)[1]['id']
s,b,_=req(K,'/api/nhap',{"ds":[{"id":"n1","kenh":"laptop","brief":"nhap cua khach"}],"cur":"n1"},h=T)
check('nháp khách ghi file riêng', s==200 and os.path.exists('/home/claude/bug3/tgl/nhap-%s.json'%mid) and 'nhap cua khach' not in (open('/home/claude/bug3/tgl/nhap.json',encoding='utf-8').read() if os.path.exists('/home/claude/bug3/tgl/nhap.json') else ''), (s,b))
s,b,_=req(K,'/api/nhap',h=T); check('đọc nháp khách', s==200 and b['ds'] and b['ds'][0]['brief']=='nhap cua khach', b)
# theme: mỗi máy riêng + kho chung
import random, string
CV='https://www.canva.com/design/D%s/abc/edit'
RD=lambda: ''.join(random.choice(string.ascii_letters) for _ in range(10))
s,b,_=req(APP,'/api/theme-canva',{"them":{"link":CV % RD(),"ten":"Theme rieng shop","kenh":"laptop"}}); tsh=next(t['id'] for t in b['ds'] if t['ten']=='Theme rieng shop')
s,b,_=req(K,'/api/theme-canva',h=T); check('theme riêng máy shop: máy khác không thấy', not any(t['id']==tsh for t in b['ds']), [t['ten'] for t in b['ds']])
b=req(APP,'/api/theme-canva',{"kc":tsh,"bat":True})[1]; check('máy shop bấm Vào kho chung', next(t for t in b['ds'] if t['id']==tsh)['kc'])
s,b,_=req(K,'/api/theme-canva',h=T); check('theme kho chung: máy khác thấy', any(t['id']==tsh and t['kc'] for t in b['ds']), [t['ten'] for t in b['ds']])
for k,d in [('sua',{"sua":{"id":tsh,"ten":"doi"}}),('xoa',{"xoa":tsh}),('chinh',{"chinh":{"id":tsh,"ghi":"x"}}),('kc',{"kc":tsh,"bat":False})]:
    s,b,_=req(K,'/api/theme-canva',d,h=T)
    tt=next((t for t in req(APP,'/api/theme-canva')[1]['ds'] if t['id']==tsh), {})
    check('máy khác %s theme kho chung: không được' % k, tt.get('ten')=='Theme rieng shop' and tt.get('kc'), (s,b if s!=200 else '', tt))
s,b,_=req(K,'/api/theme-canva',{"them":{"link":CV % RD(),"ten":"Theme rieng Mac","kenh":"laptop"}},h=T); tmac=next((t['id'] for t in b.get('ds',[]) if t['ten']=='Theme rieng Mac'), None)
check('máy khác thêm theme riêng', tmac and next(t for t in b['ds'] if t['id']==tmac)['may']==mid, b)
check('máy shop không thấy theme riêng của máy khác', not any(t['id']==tmac for t in req(APP,'/api/theme-canva')[1]['ds']))
s,b,_=req(K,'/api/theme-canva',{"sua":{"id":tmac,"ten":"Theme Mac doi ten","kenh":"laptop"}},h=T); check('máy khác sửa theme của mình', any(t['ten']=='Theme Mac doi ten' for t in b.get('ds',[])), (s,b))
s,b,_=req(APP,'/api/theme-canva',{"xoa":tmac}); check('máy shop bỏ theme riêng máy khác: không ăn', any(t['id']==tmac for t in req(K,'/api/theme-canva',h=T)[1]['ds']))
s,b,_=req(K,'/api/theme-canva',{"them":{"link":CV % RD(),"ten":"x"}},h=T)
check('máy khác thêm được thiết kế máy shop đang để riêng (thành bản riêng)', s==200, (s,b))
s,b,_=req(K,'/api/theme-canva/anh/%s' % next(t['id'] for t in req(APP,'/api/theme-canva',{"them":{"link":CV % RD(),"ten":"Shop3"}})[1]['ds'] if t['ten']=='Shop3'),h=T)
check('ảnh theme riêng máy shop: máy khác không mở được', s==404, s)
# mẫu Canva của kênh: riêng
old=req(APP,'/api/canva-cai')[1]['mau']
s,b,_=req(K,'/api/canva-cai',{"mau_laptop":"https://www.canva.com/design/DAGmauMac/x/edit"},h=T)
check('máy khác lưu mẫu Canva riêng', b['mau']['laptop'].endswith('DAGmauMac/x/edit'), b)
check('mẫu Canva máy shop giữ nguyên', req(APP,'/api/canva-cai')[1]['mau']==old)
check('máy khác đọc lại mẫu của mình', req(K,'/api/canva-cai',h=T)[1]['mau']['laptop'].endswith('DAGmauMac/x/edit'))
# chạy bài
s,b,_=req(K,'/api/run',{"kenh":"laptop","brief":"Bìa: THỬ DÙNG CHUNG\nSlide 2: máy test","tu_tg":True,"_khach":{"id":"gia","ten":"gia"}},h=T)
check('khách Chạy: tạo bài', s==200 and b.get('id'), (s,b)); kj=b.get('id')
jj=json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json'%kj,encoding='utf-8')) if kj else {}
check('bài ghi tên máy khách, bỏ _khach / tu_tg trang gửi', (jj.get('khach') or {}).get('ten')=='MacBook Quân' and not jj.get('tu_tg'), jj.get('khach'))
s,b,_=req(K,'/api/jobs',h=T); check('danh sách máy khác: đúng bài của mình', [x['id'] for x in b['jobs']]==[kj], [x['id'] for x in b['jobs']])
check('máy shop thấy cả bài máy khác', any(x['id']==kj and (x.get('khach') or {}).get('ten')=='MacBook Quân' for x in req(APP,'/api/jobs')[1]['jobs']))
for _ in range(90):
    st=req(K,'/api/job/'+kj,h=T)[1]
    if (st.get('job') or {}).get('status') in ('xong','loi','dung'): break
    time.sleep(1)
sl=st.get('slides') or []
check('bài máy khác dựng xong có slide', (st.get('job') or {}).get('status')=='xong' and sl, (st.get('job') or {}).get('status'))
if sl:
    s,b,_=req(K,'/file?p='+urllib.parse.quote(sl[0]['path']),h=T,raw=True); check('file slide bài mình: được', s==200 and b[:4]==b'\x89PNG', s)
    s,b,_=req(K,'/api/job/%s/zip'%kj,h=T,raw=True)
    try: zz=zipfile.ZipFile(io.BytesIO(b)); names=zz.namelist()
    except Exception as e: names=[str(e)]
    check('tải zip: slide + caption.txt', s==200 and 'caption.txt' in names and any(n.startswith('slide-') for n in names), (s, names[:5]))
lb=req(K,'/api/lich-su-brief',h=T)[1]['ds']; check('lịch sử brief máy khác: chỉ của mình', lb and all(x['id']==kj for x in lb if x['loai']!='nhap'), [x['id'] for x in lb][:5])
check('lịch sử brief máy shop: có bài máy khác', any(x['id']==kj for x in req(APP,'/api/lich-su-brief')[1]['ds']))
s,b,_=req(K,'/api/run',{"kenh":"ipad","brief":"Bìa: x","dung_bang":"canva","theme_canva":tsh},h=T)
check('máy khác chạy Canva bằng theme kho chung: được', s==200, (s,b))
if s==200: req(K,'/api/job/%s/dung'%b['id'],{},h=T)
s,b,_=req(K,'/api/run',{"kenh":"ipad","brief":"Bìa: x","dung_bang":"canva","theme_canva":"t00000000"},h=T)
check('máy khác Canva không theme, chưa có mẫu iPad riêng: báo thiếu mẫu', s==400 and 'mẫu Canva' in b.get('err',''), (s,b))
time.sleep(1); s,b,_=req(K,'/api/job/%s/xoa'%kj,{},h=T); check('Xoá bài của mình (vào _to_delete): được', s==200, (s,b))
s,b,_=req(K,'/tai-app-mac',h=H,raw=True); check('tải app Mac (không cần vào)', s==200 and b[:2]==b'PK', s)
# bỏ máy
r=req(APP,'/api/chung')[1]; check('máy shop thấy máy + lần dùng', any(m['ten']=='MacBook Quân' and m.get('lan') for m in r['may']), r['may'])
req(APP,'/api/chung',{"bo": mid}); s,b,_=req(K,'/api/jobs',h=T); check('bỏ máy -> 401', s==401, s)
# đoán mã
ma=req(APP,'/api/chung',{"ma_moi": True})[1]['ma']
for i in range(10): req(K,'/api/chung/vao',{"ma":"%06d"%((int(ma)+1+i)%10**6)},h=H)
s,b,_=req(K,'/api/chung/vao',{"ma":ma,"ten":"z"},h=H); check('sai 10 lần: huỷ mã', s==400 and 'hết hạn' in b['err'], b)
for i in range(12): req(K,'/api/chung/vao',{"ma":"123456"},h=H)
s,b,_=req(K,'/api/chung/vao',{"ma":"123456"},h=H); check('quá 20 lần/phút: chặn', s==400 and 'quá nhiều' in b['err'], b)
check('máy shop: /api/chung/toi = không phải khách', req(APP,'/api/chung/toi')[1]=={"khach": False})
s,b,_=req(APP,'/api/jobs',h={'Host':HOST}); check('cổng gốc vẫn chỉ nhận 127.0.0.1', s==403, s)
# khởi động lại app: nhận lại đường nối cũ (link giữ nguyên)
import subprocess
pid=int(open('/home/claude/bug3/tgl/srv.pid').read()); os.kill(pid, 15); time.sleep(1.5)
p2=subprocess.Popen(['python3','server.py'], cwd='/home/claude/bug3/tgl', stdout=open('/home/claude/bug3/tgl/srv.out','a'), stderr=subprocess.STDOUT, start_new_session=True)
open('/home/claude/bug3/tgl/srv.pid','w').write(str(p2.pid))
for _ in range(30):
    time.sleep(0.5)
    try:
        r=req(APP,'/api/chung')[1]
        if isinstance(r, dict) and r.get('chay'): break
    except Exception: pass
check('mở lại app: giữ link cũ', r.get('url')==URL, (r, URL))
s,b,_=req(K,'/api/jobs',h={'Host':HOST}); check('mở lại app: cổng khách mở lại', s==401, s)
cf=json.load(open('/home/claude/bug3/tgl/_cf/cf.json'))
r=req(APP,'/api/chung',{"bat": False})[1]; time.sleep(1.5)
alive=os.path.exists('/proc/%d' % cf['pid']) and open('/proc/%d/stat' % cf['pid']).read().split(')')[-1].split()[0] != 'Z'
check('tắt: cloudflared tắt', not r['bat'] and not alive, (r, alive))
s,b,_=req(K,'/api/ping',h={'Host':HOST}); check('tắt: cổng khách đóng', s==0, (s,b))
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
