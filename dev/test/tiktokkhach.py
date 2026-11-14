# Thử Đăng TikTok (web) trên máy dùng chung (fen 14/11 18h07 "cho máy phú có chức năng này và file extion"):
# vé 12 giờ cho tiện ích, tiện ích chỉ đọc / báo đúng bài của vé qua cổng khách, ảnh lấy qua đường nối, tải file tiện ích.
import json, time, urllib.request, urllib.error, urllib.parse, os, zipfile, io, re
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
r=req(APP,'/api/chung',{"bat": True})[1]
for _ in range(20):
    r=req(APP,'/api/chung')[1]
    if r['chay']: break
    time.sleep(0.5)
check('đường nối giả chạy', r['chay'], r); URL=r['url']; HOST=URL.split('//')[1]
def vao(ten):
    ma=req(APP,'/api/chung',{"ma_moi": True})[1]['ma']
    s,b,_=req(K,'/api/chung/vao',{"ma":ma,"ten":ten},h={'Host':HOST}); return b.get('token')
TP=vao("phupoly’s Mac mini"); TQ=vao("MacQuân")
P={'Host':HOST,'X-Poly-Khach':TP}; Q={'Host':HOST,'X-Poly-Khach':TQ}
def dung(h, brief):
    s,b,_=req(K,'/api/run',{"kenh":"ipad","brief":brief,"theme_ps":"phang-xanh-dem"},h=h); jid=b.get('id')
    for _ in range(90):
        st=req(K,'/api/job/'+jid,h=h)[1]
        if (st.get('job') or {}).get('status') in ('xong','loi','dung'): break
        time.sleep(1)
    return jid, st
jp, stp = dung(P, "Bìa: TIKTOK MÁY PHÚ\nSlide 2: x")
jq, stq = dung(Q, "Bìa: TIKTOK MÁY QUÂN\nSlide 2: x")
check('2 máy khác dựng xong bài có slide', (stp.get('job') or {}).get('status')=='xong' and stp.get('slides') and (stq.get('job') or {}).get('status')=='xong', ((stp.get('job') or {}).get('status'), (stq.get('job') or {}).get('status')))
cap=(stp.get('caption') or '')
if not cap.strip():
    req(K,"/api/job/%s/caption"%jp,{"text":"Caption thử máy Phú #ipad\nComment ghim: hỏi gì cứ hỏi"},h=P)
# --- cấp vé
s,b,_=req(K,'/api/job/%s/tiktok-ve'%jp,{},h=P)
check('máy Phú bấm Đăng TikTok: có vé + link TikTok chỉ mang ?poly=<mã bài>', s==200 and len(b.get('ve',''))>=30 and b.get('url','').endswith('poly='+jp) and 'tiktokstudio/upload' in b.get('url','') and HOST not in b.get('url',''), (s,b))
VE=b.get('ve'); check('vé báo bản tiện ích mới', b.get('ban')=='0.11.0', b.get('ban'))
s,b2,_=req(K,'/api/job/%s/tiktok-ve'%jp,{},h=P); check('bấm đúp trong 5 giây: dùng lại vé', s==200 and b2.get('ve')==VE, b2)
s,b,_=req(K,'/api/job/%s/tiktok-ve'%jq,{},h=P); check('máy Phú xin vé bài máy Quân: không được', s in (403,404), (s,b))
oj=next((x['id'] for x in req(APP,'/api/jobs')[1]['jobs'] if not x.get('khach') and x.get('status')=='xong'), None)
if oj:
    s,b,_=req(K,'/api/job/%s/tiktok-ve'%oj,{},h=P); check('máy khác xin vé bài máy shop: không được', s in (403,404), (s,b))
s,b,_=req(K,'/api/job/%s/tiktok'%jp,{},h=P); check('máy khác vẫn không mở được Chrome trên máy shop', s==403, (s,b))
dg=req(APP,'/api/job/'+jp)[1].get('da_gui') or []
check('bài ghi đã mở TikTok (tên máy)', any(x.get('kieu')=='tiktok' and 'phupoly' in (x.get('may') or '') for x in dg), dg)
# --- tiện ích dùng vé
EXT='chrome-extension://abcdefghijklmnopabcdefghijklmnop'
V={'Host':HOST,'Origin':EXT,'X-Poly-Ve':VE}
s,b,_=req(K,'/api/tiktok/'+jp,h=V)
check('tiện ích đọc bài bằng vé: caption + slide', s==200 and b.get('caption','').startswith('Caption') and b.get('files'), (s,str(b)[:200]))
fl=b.get('files') or []
check('link ảnh slide đi qua đường nối (không phải 127.0.0.1 máy shop)', fl and all(f['url'].startswith(URL+'/file?p=') for f in fl), [f['url'][:60] for f in fl][:2])
if fl:
    pth=urllib.parse.urlparse(fl[0]['url']); 
    s,img,_=req(K, pth.path+'?'+pth.query, h=V, raw=True); check('tiện ích tải ảnh slide bằng vé', s==200 and img[:4]==b'\x89PNG', s)
    s,img,_=req(K, pth.path+'?'+pth.query, h={'Host':HOST,'Origin':EXT}, raw=True); check('ảnh không vé: 401', s==401, s)
s,b,_=req(K,'/api/tiktok/'+jq,h=V); check('vé bài Phú đọc bài Quân: chặn', s==403, (s,b))
sq=req(K,'/api/job/'+jq,h=Q)[1].get('slides') or []
if sq:
    s,b,_=req(K,'/file?p='+urllib.parse.quote(sq[0]['path']),h=V,raw=True); check('vé bài Phú lấy ảnh bài Quân: chặn', s==403, s)
for path in ['/api/jobs','/api/job/'+jp,'/api/telegram','/api/chung/toi','/api/nhap']:
    s,b,_=req(K,path,h=V); check('vé chỉ cho tiện ích: GET %s chặn' % path.replace(jp,'<bài>'), s==403, (s,b))
for path,d in [('/api/run',{"kenh":"ipad","brief":"x"}),('/api/job/%s/xoa'%jp,{}),('/api/job/%s/tiktok-ve'%jp,{}),('/api/telegram',{})]:
    s,b,_=req(K,path,d,h=V); check('vé: POST %s chặn' % path.replace(jp,'<bài>'), s==403, (s,b))
s,b,_=req(K,'/api/tiktok/'+jp,h={'Host':HOST,'Origin':EXT,'X-Poly-Ve':'x'*32}); check('vé bịa: 401', s==401, (s,b))
s,b,_=req(K,'/api/tiktok/'+jp,h={'Host':HOST,'Origin':EXT}); check('tiện ích không vé: 401', s==401, (s,b))
s,b,_=req(K,'/api/tiktok-nhac',{"id":jq,"ten":"Song","tacgia":"A"},h=V); check('vé bài Phú báo nhạc bài Quân: chặn', s==403, (s,b))
s,b,_=req(K,'/api/tiktok-nhac',{"id":jp,"ten":"Song Phu","tacgia":"Beat"},h=V); check('tiện ích báo nhạc đúng bài', s==200, (s,b))
s,b,_=req(K,'/api/tiktok-soi',{"nhan":"sau-khi-gan","items":[{"t":"btn"}]},h=V); check('tiện ích gửi cấu trúc trang', s==200, (s,b))
s,b,_=req(K,'/api/tiktok-dang',{"id":jq,"ok":True},h=V); check('vé bài Phú báo đã đăng bài Quân: chặn', s==403, (s,b))
check('bài Quân chưa bị đánh dấu đăng', not (req(APP,'/api/job/'+jq)[1].get('job') or {}).get('da_dang'))
s,b,_=req(K,'/api/tiktok-dang',{"id":jp,"ok":True,"lich":0},h=V); check('tiện ích báo đã đăng đúng bài', s==200, (s,b))
check('bài Phú: đã đăng', bool((req(APP,'/api/job/'+jp)[1].get('job') or {}).get('da_dang')))
s,b,_=req(K,'/api/jobs',h={'Host':HOST,'X-Poly-Khach':TP,'Origin':URL}); check('trang app máy khác vẫn chạy bình thường', s==200 and any(x['id']==jp for x in b['jobs']), s)
# --- máy bị bỏ: vé hết hiệu lực
mid=req(K,'/api/chung/toi',h=Q)[1]['id']
req(K,"/api/job/%s/caption"%jq,{"text":"Caption máy Quân"},h=Q)
s,b,_=req(K,'/api/job/%s/tiktok-ve'%jq,{},h=Q); VQ=b.get('ve'); check('máy Quân có vé', bool(VQ), (s,b))
req(APP,'/api/chung',{"bo": mid})
s,b,_=req(K,'/api/tiktok/'+jq,h={'Host':HOST,'Origin':EXT,'X-Poly-Ve':VQ}); check('fen bỏ máy Quân: vé của máy đó hết dùng', s==401, (s,b))
# --- file tiện ích
s,b,hd=req(K,'/tai-tien-ich',h=P,raw=True)
try: zz=zipfile.ZipFile(io.BytesIO(b)); names=sorted(zz.namelist())
except Exception as e: names=[str(e)]
check('máy khác tải file tiện ích (zip thư mục poly-tiktok)', s==200 and names==['poly-tiktok/app.js','poly-tiktok/background.js','poly-tiktok/manifest.json','poly-tiktok/tiktok.js'] and '0.11.0' in hd.get('Content-Disposition',''), (s,names,hd.get('Content-Disposition')))
if names and names[0].startswith('poly-tiktok/'):
    mf=json.loads(zz.read('poly-tiktok/manifest.json')); check('manifest trong zip: 0.11.0, có quyền đường nối + app.js', mf['version']=='0.11.0' and 'https://*.trycloudflare.com/*' in mf['host_permissions'] and any('app.js' in c['js'] for c in mf['content_scripts']), mf)
s,b,_=req(K,'/tai-tien-ich',h={'Host':HOST},raw=True); check('chưa vào dùng chung: không tải được', s==401, s)
s,b,_=req(APP,'/tai-tien-ich',raw=True); check('máy shop cũng tải được file tiện ích', s==200 and b[:2]==b'PK', s)
# --- máy shop như cũ
if oj:
    s,b,_=req(APP,'/api/tiktok/'+oj,h={'Origin':EXT}); check('máy shop: tiện ích đọc bài như cũ (127.0.0.1)', s==200 and all(f['url'].startswith('http://127.0.0.1:8790/file') for f in b.get('files',[])), (s,str(b)[:150]))
req(APP,'/api/chung',{"bat": False})
print('\nKẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
