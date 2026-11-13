# fen 13/11 15h22 "máy con sẽ ưu tiên chọn model làm nhanh": bài máy dùng chung để mặc định chạy Sonnet (cả agent duyệt), tự chọn Opus thì theo
import json, os, time, urllib.request
A='http://127.0.0.1:8790'; K='http://127.0.0.1:8791'; J='/home/claude/bug3/tgl/jobs'
ok=[0,0]
def check(n,c,x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def req(base,p,d=None,h=None):
    r=urllib.request.Request(base+p,data=json.dumps(d).encode() if d is not None else None,headers=dict({'Content-Type':'application/json'},**(h or {})))
    try: return json.loads(urllib.request.urlopen(r,timeout=30).read())
    except urllib.error.HTTPError as e: return json.loads(e.read() or b'{}')
r=req(A,'/api/chung',{"bat":True})
for _ in range(30):
    if r.get('chay'): break
    time.sleep(0.5); r=req(A,'/api/chung')
ma=req(A,'/api/chung',{"ma_moi":True})['ma']
v=req(K,'/api/chung/vao',{"ma":ma,"ten":"Mac Model"},{'Host':'poly-thu.example'})
H={'Host':'poly-thu.example','X-Poly-Khach':v['token']}
def args_cua(jid):
    for _ in range(120):
        f=os.path.join(J,jid,'job.json')
        if os.path.exists(f):
            jb=json.load(open(f))
            rs=jb.get('runs') or []
            if rs: return jb, rs[0]
        time.sleep(1)
    return None, None
def model_run(jid):
    jb, r0 = args_cua(jid)
    return (r0 or {}).get('model'), open(os.path.join(J,jid,'prompt-1.txt'),encoding='utf-8').read() if r0 else ''
k1=req(K,'/api/run',{"kenh":"laptop","brief":"Bìa: MODEL MẶC ĐỊNH MÁY KHÁCH\nSlide 2: x"},H)['id']
m1,p1=model_run(k1)
check('máy khách, Model mặc định: dựng bằng Sonnet', m1=='sonnet', m1)
check('máy khách: agent duyệt cũng Sonnet', 'model "sonnet"' in p1 or 'AGENT' not in p1, p1[-400:])
k2=req(K,'/api/run',{"kenh":"laptop","brief":"Bìa: MÁY KHÁCH CHỌN OPUS\nSlide 2: x","model":"opus"},H)['id']
m2,_=model_run(k2)
check('máy khách tự chọn Opus: theo lựa chọn', m2=='opus', m2)
s1=req(A,'/api/run',{"kenh":"laptop","brief":"Bìa: MÁY SHOP MẶC ĐỊNH\nSlide 2: x"})['id']
m3,_=model_run(s1)
check('máy shop mặc định: vẫn theo Kiểm máy (Opus)', m3=='opus', m3)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
