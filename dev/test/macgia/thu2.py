# App Mac tải từ link máy chủ (zip có Resources/link.txt): lần đầu chỉ hỏi mã + tên; trang /tai; exe có POLYLINK
import json, os, subprocess, time, urllib.request, shutil, zipfile, io
MG='/home/claude/bug3/macgia'; APP='http://127.0.0.1:8790'; K='http://127.0.0.1:8791'
ok=[0,0]
def check(n,c,x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def api(p,d=None):
    r=urllib.request.Request(APP+p,data=json.dumps(d).encode() if d is not None else None,headers={'Content-Type':'application/json'})
    return json.loads(urllib.request.urlopen(r,timeout=20).read())
def get(path, host):
    r=urllib.request.Request(K+path, headers={'Host': host})
    with urllib.request.urlopen(r, timeout=20) as f: return f.status, f.read(), dict(f.headers)
r=api('/api/chung',{"bat":True})
for _ in range(30):
    if r['chay']: break
    time.sleep(0.5); r=api('/api/chung')
url=r['url']; host=url.split('//')[1]
s,b,h=get('/tai', host); check('trang /tai không cần mã, có 2 nút', s==200 and b'/tai-app-win' in b and b'/tai-app-mac' in b, s)
s,b,h=get('/tai-app-win', host); check('exe tải về có gắn link', s==200 and b[:2]==b'MZ' and b.endswith(('\nPOLYLINK:%s\n' % url).encode()) and 'attachment' in h.get('Content-Disposition',''), (s, b[-80:]))
s,b,h=get('/tai-app-mac', host)
z=zipfile.ZipFile(io.BytesIO(b)); names=z.namelist()
lk=[n for n in names if n.endswith('Resources/link.txt')]
check('zip Mac có link.txt + giữ quyền chạy', lk and z.read(lk[0]).decode().strip()==url and any(n.endswith('MacOS/poly-chung') and (z.getinfo(n).external_attr>>16)&0o111 for n in names), names)
d=MG+'/app'; shutil.rmtree(d, ignore_errors=True); z.extractall(d)
sh=[os.path.join(d,n) for n in names if n.endswith('MacOS/poly-chung')][0]; os.chmod(sh, 0o755)
HOME=MG+'/home2'; shutil.rmtree(HOME, ignore_errors=True); os.makedirs(HOME)
ma=api('/api/chung',{"ma_moi":True})['ma']
open(MG+'/hang','w').write(ma+'\nMac Kho\n'); open(MG+'/nhatky','w').write(''); open(MG+'/map','w').write('%s 8791\n' % host)
env=dict(os.environ, HOME=HOME, MG=MG, PATH=MG+'/bin:'+os.environ['PATH'], POLY_OSA=MG+'/bin/osascript', POLY_CURL=MG+'/bin/curl')
subprocess.run(['bash', sh], env=env, timeout=120)
nk=open(MG+'/nhatky').read()
check('app Mac tải từ link: không hỏi link, chỉ mã + tên', 'Dán link' not in nk and nk.count('HOI')==2 and ('--app=' + url + '/#vao=') in nk, nk)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
