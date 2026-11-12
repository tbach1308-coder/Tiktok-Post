# Thử app Windows dùng chung (.exe) trong wine: POLY_THU=1 -> câu trả lời lấy từ POLY_TRA_LOI, in HOI/BAO/MO ra màn hình
import json, os, subprocess, time, urllib.request, shutil
APP='http://127.0.0.1:8790'; EXE='/home/claude/tiktok-post/dist/Poly-Dung-Bai-dung-chung.exe'
PFX='/tmp/claude-0/winthu/pfx'; LAD=PFX+'/drive_c/users/root/AppData/Local/PolyDungBaiChung'
ok=[0,0]
def check(n,c,x=''):
    ok[0 if c else 1]+=1; print(('✓ ' if c else '✗ ')+n, '' if c else x)
def api(p,d=None):
    r=urllib.request.Request(APP+p,data=json.dumps(d).encode() if d is not None else None,headers={'Content-Type':'application/json'})
    return json.loads(urllib.request.urlopen(r,timeout=20).read())
def chay(tra_loi, exe=EXE):
    env=dict(os.environ, WINEPREFIX=PFX, WINEDEBUG='-all', POLY_THU='1', POLY_TRA_LOI='|'.join(tra_loi))
    r=subprocess.run(['wine', exe], env=env, capture_output=True, timeout=120)
    return r.returncode, r.stdout.decode('utf-8','replace')
shutil.rmtree(LAD, ignore_errors=True)
r=api('/api/chung',{"bat":True})
for _ in range(30):
    if r['chay']: break
    time.sleep(0.5); r=api('/api/chung')
ma=api('/api/chung',{"ma_moi":True})['ma']
L='http://127.0.0.1:8791'
rc,o=chay([L+'/abc?x=1', '000000', 'PC Quầy', ma, 'PC Quầy Thu Ngân'])
check('lần đầu: mã sai báo, mã đúng vào, mở trình duyệt kèm #vao=', 'BAO: Sai mã' in o and 'MO: ' in o and '#vao=' in o, o)
f=open(LAD+'/may.txt',encoding='utf-8',newline='').read()
check('lưu link gọn + token', ('url=%s\r\n' % L) in f and len(f.split('token=')[1].strip())>30, f)
check('máy shop thấy tên tiếng Việt', any(m['ten']=='PC Quầy Thu Ngân' for m in api('/api/chung')['may']))
rc,o=chay([])
check('lần 2: không hỏi gì, mở luôn', 'HOI' not in o and 'MO: ' in o, o)
mid=[m['id'] for m in api('/api/chung')['may'] if m['ten']=='PC Quầy Thu Ngân'][-1]
api('/api/chung',{"bo":mid}); ma=api('/api/chung',{"ma_moi":True})['ma']
rc,o=chay([ma,'PC Quầy Thu Ngân'])
check('bị bỏ: báo + hỏi mã mới rồi vào', 'đã bị fen bỏ' in o and 'MO: ' in o, o)
# link chết -> hỏi link mới
f=open(LAD+'/may.txt',encoding='utf-8').read().replace(L,'http://127.0.0.1:9'); open(LAD+'/may.txt','w',encoding='utf-8',newline='').write(f)
rc,o=chay([L])
check('link chết: hỏi link mới, không hỏi mã', o.count('HOI')==1 and 'Không mở được link cũ' in o and 'MO: ' in o, o)
rc,o=chay([]) ; check('sau khi đổi link: lần sau mở luôn', 'HOI' not in o and 'MO: ' in o, o)
# file tải có gắn sẵn link: lần đầu chỉ hỏi mã + tên
shutil.rmtree(LAD, ignore_errors=True)
g='/tmp/claude-0/winthu/gan.exe'; open(g,'wb').write(open(EXE,'rb').read()+b'\nPOLYLINK:'+L.encode()+b'\n')
ma=api('/api/chung',{"ma_moi":True})['ma']
rc,o=chay([ma,'PC Kho'], exe=g)
check('file gắn link: không hỏi link, chỉ hỏi mã + tên', 'Dán link' not in o and o.count('HOI')==2 and 'MO: ' in o, o)
rc,o=chay(['__HUY__'], exe=EXE) if False else (0,'')
shutil.rmtree(LAD, ignore_errors=True)
rc,o=chay(['__HUY__'])
check('bấm Huỷ: thoát, không mở', 'MO:' not in o, o)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
