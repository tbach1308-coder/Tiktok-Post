# Thử app Mac (bash) bằng osascript / curl / open giả, nối vào cổng khách máy thử
import json, os, subprocess, time, urllib.request, shutil
MG='/home/claude/bug3/macgia'; APP='http://127.0.0.1:8790'; SH='/home/claude/tiktok-post/packaging/mac-chung/poly-chung'
HOME=MG+'/home'
ok=[0,0]
def check(n,c,x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def api(p,d=None):
    r=urllib.request.Request(APP+p,data=json.dumps(d).encode() if d is not None else None,headers={'Content-Type':'application/json'})
    return json.loads(urllib.request.urlopen(r,timeout=20).read())
def chay(hang, map_):
    open(MG+'/hang','w').write(''.join(x+'\n' for x in hang)); open(MG+'/nhatky','w').write('')
    open(MG+'/map','w').write(''.join('%s %d\n' % kv for kv in map_.items()))
    env=dict(os.environ, HOME=HOME, MG=MG, PATH=MG+'/bin:'+os.environ['PATH'], POLY_OSA=MG+'/bin/osascript', POLY_CURL=MG+'/bin/curl')
    r=subprocess.run(['bash', SH], env=env, capture_output=True, text=True, timeout=120)
    return r.returncode, open(MG+'/nhatky').read(), open(MG+'/hang').read()
shutil.rmtree(HOME, ignore_errors=True); os.makedirs(HOME)
r=api('/api/chung',{"bat":True})
for _ in range(30):
    if r['chay']: break
    time.sleep(0.5); r=api('/api/chung')
host=r['url'].split('//')[1]; M={host: 8791}
ma=api('/api/chung',{"ma_moi":True})['ma']
rc,nk,con=chay(['https://%s/xyz?a=1' % host, '000000', 'MacBook Thu', ma, 'MacBook Thử Quân'], M)
check('lần đầu: mã sai thì báo, nhập lại mã đúng là vào', 'BAO: Sai mã' in nk and 'OPEN: ' in nk and rc==0, nk)
f=open(HOME+'/Library/Application Support/PolyDungBaiChung/may.txt').read()
tok=f.split('token=')[1].strip()
check('lưu link gọn + token, quyền 600', ('url=https://%s\n' % host) in f and len(tok)>30 and oct(os.stat(HOME+'/Library/Application Support/PolyDungBaiChung/may.txt').st_mode)[-3:]=='600', f)
check('mở Chrome app kèm #vao=token', ('--app=https://%s/#vao=%s' % (host, tok)) in nk or ('https://%s/#vao=%s' % (host, tok)) in nk, nk)
check('máy shop có máy tên tiếng Việt', any(m['ten']=='MacBook Thử Quân' for m in api('/api/chung')['may']))
os.makedirs(HOME+'/Applications/Google Chrome.app', exist_ok=True)
rc,nk,con=chay([], M)
check('lần 2: không hỏi gì, mở luôn bằng cửa sổ Chrome riêng', 'HOI' not in nk and 'OPEN: -na '+HOME+'/Applications/Google Chrome.app --args --app=https://' in nk and '--user-data-dir='+HOME+'/Library/Application Support/PolyDungBaiChung/chrome' in nk, nk)
M2={'link-moi-thu.trycloudflare.com': 8791}
rc,nk,con=chay(['https://link-moi-thu.trycloudflare.com'], M2)
check('link đổi: hỏi link mới, không hỏi mã', nk.count('HOI')==1 and 'Không mở được link cũ' in nk and 'link-moi-thu' in nk.split('OPEN')[-1], nk)
mid=[m['id'] for m in api('/api/chung')['may'] if m['ten']=='MacBook Thử Quân'][-1]
api('/api/chung',{"bo":mid}); ma=api('/api/chung',{"ma_moi":True})['ma']
rc,nk,con=chay([ma, 'MacBook Thử Quân'], M2)
check('bị bỏ: báo + hỏi mã mới rồi vào', 'đã bị fen bỏ' in nk and 'OPEN' in nk, nk)
rc,nk,con=chay(['__HUY__'], {})
check('link chết + bấm Huỷ: thoát êm, không mở', rc==0 and 'OPEN' not in nk, (rc, nk))
# 13/11 fen: Mac mở thành tab Chrome (Chrome không ở /Applications) -> tìm Chrome theo tên app, không có thì Edge / Brave, hết thì trình duyệt mặc định
shutil.rmtree(HOME+'/Applications/Google Chrome.app', ignore_errors=True)
rc,nk,con=chay([], M2)
check('Chrome không ở thư mục Ứng dụng: hỏi macOS theo tên, vẫn mở cửa sổ riêng', 'OPEN: -Ra Google Chrome' in nk and 'OPEN: -na Google Chrome --args --app=https://link-moi-thu' in nk, nk)
open(MG+'/khong_chrome','w').write('1')
try:
    rc,nk,con=chay([], M2)
finally:
    os.remove(MG+'/khong_chrome')
check('không có Chrome / Edge / Brave: mở bằng trình duyệt mặc định', 'OPEN: -Ra Brave Browser' in nk and 'OPEN: https://link-moi-thu' in nk and '--app' not in nk, nk)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
