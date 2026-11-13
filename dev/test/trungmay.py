# fen 13/11 15h36 "bài máy nào tính trùng trên máy đó thôi, không tính tổng hết bài các máy": dò trùng chủ đề + luật 1 bài/ngày theo từng máy
import json, os, time, urllib.request
A='http://127.0.0.1:8790'; K='http://127.0.0.1:8791'; J='/home/claude/bug3/tgl/jobs'
ok=[0,0]
def check(n,c,x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def req(base,p,d=None,h=None):
    r=urllib.request.Request(base+p,data=json.dumps(d).encode() if d is not None else None,headers=dict({'Content-Type':'application/json'},**(h or {})))
    try: return json.loads(urllib.request.urlopen(r,timeout=30).read())
    except urllib.error.HTTPError as e: return json.loads(e.read() or b'{}')
def cho_prompt(jid, n=1):
    f=os.path.join(J,jid,'prompt-%d.txt' % n)
    for _ in range(120):
        if os.path.exists(f): return open(f,encoding='utf-8').read()
        time.sleep(1)
    return ''
def cho_xong(jid):
    for _ in range(120):
        j=req(A,'/api/job/'+jid).get('job') or {}
        if j.get('status') not in ('dang-chay','moi','hen'): return j
        time.sleep(1)
r=req(A,'/api/chung',{"bat":True})
for _ in range(30):
    if r.get('chay'): break
    time.sleep(0.5); r=req(A,'/api/chung')
def vao(ten):
    ma=req(A,'/api/chung',{"ma_moi":True})['ma']
    v=req(K,'/api/chung/vao',{"ma":ma,"ten":ten},{'Host':'poly-thu.example'})
    return {'Host':'poly-thu.example','X-Poly-Khach':v['token']}
H1=vao('Mac Trùng Một'); H2=vao('Mac Trùng Hai')
b1=req(K,'/api/run',{"kenh":"ipad","brief":"Bìa: BÀI RIÊNG MÁY MỘT\nSlide 2: x","theme_ps":"phang-xanh-dem"},H1)['id']; cho_xong(b1)
bs=req(A,'/api/run',{"kenh":"ipad","brief":"Bìa: BÀI RIÊNG MÁY SHOP\nSlide 2: x"})['id']; cho_xong(bs)
v1=req(K,'/api/viet-brief',{"kenh":"ipad","chu_de":"iPad cho sinh viên"},H1)['id']; p1=cho_prompt(v1)
check('máy 1 viết brief: chỉ dò trùng bài máy 1', 'chỉ tính trùng với bài MÁY NÀY' in p1 and 'RIÊNG MÁY MỘT' in p1.upper() and 'RIÊNG MÁY SHOP' not in p1.upper() and 'danh-sach-content-22-10.md' not in p1, p1[p1.find('Dò trùng'):][:600])
v2=req(K,'/api/viet-brief',{"kenh":"ipad","chu_de":"iPad cho sinh viên"},H2)['id']; p2=cho_prompt(v2)
check('máy 2 (chưa có bài) viết brief: không dò trùng bài máy khác', 'chưa làm bài nào' in p2 and 'RIÊNG MÁY MỘT' not in p2.upper(), p2[p2.find('Dò trùng'):][:400])
vs=req(A,'/api/viet-brief',{"kenh":"ipad","chu_de":"iPad cho sinh viên"})['id']; ps=cho_prompt(vs)
check('máy shop viết brief: dò như cũ + bỏ thư mục bài máy dùng chung', 'danh-sach-content-22-10.md' in ps and 'Không tính trùng với bài của máy dùng chung' in ps, ps[ps.find('Dò trùng'):][:700])
c1=req(K,'/api/chat-brief',{"kenh":"ipad","tin":"viết brief chủ đề iPad cho sinh viên"},H1)['id']; pc=cho_prompt(c1)
check('chat brief máy 1: phạm vi dò trùng chỉ máy 1', 'Phạm vi dò trùng' in pc and 'chỉ tính trùng với bài MÁY NÀY' in pc, pc[-800:])
# luật 1 bài/ngày theo máy
luc=time.time()+3*86400
h1=req(A,'/api/job/%s/hen-dang' % b1,{"luc":luc})
hs=req(A,'/api/job/%s/hen-dang' % bs,{"luc":luc+600})
check('hẹn đăng cùng ngày: bài máy shop không bị tính trùng với bài máy 1', hs.get('ok') and not any('máy một' in x.lower() for x in (hs.get('trung') or [])), hs)
h2=req(A,'/api/job/%s/hen-dang' % b1,{"luc":luc+1200})
check('bài máy 1 hẹn lại cùng ngày: không tính bài máy shop', h2.get('ok') and not any('máy shop' in x.lower() for x in (h2.get('trung') or [])), h2)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
