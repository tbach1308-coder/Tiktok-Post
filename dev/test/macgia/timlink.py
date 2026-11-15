# fen 15/11 11h23 "Link cố định cho máy kia": máy shop ghi link dùng chung hiện tại vào poly-link.json trong thư mục Drive
# "POLY Kho Theme" (chỉ ghi đè file có sẵn, chỉ máy chính của kho chung); app Mac dùng chung mở link cũ không được thì đọc file đó
# (link Drive chia sẻ, ở đây thay bằng máy chủ file thử qua POLY_TIM_LINK) lấy link mới, không hỏi fen.
import json, os, subprocess, time, urllib.request, shutil, threading, http.server, functools
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
B = '/home/claude/bug3'; MG = B + '/macgia-tl'; APP = 'http://127.0.0.1:8790'; SH = REPO + '/packaging/mac-chung/poly-chung'
HOME = MG + '/home'; D = HOME + '/Library/Application Support/PolyDungBaiChung'
GD = B + '/gdrive-tl/My Drive'; KHO = GD + '/POLY Kho Theme'; LF = KHO + '/poly-link.json'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def api(p, d=None):
    r = urllib.request.Request(APP + p, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(r, timeout=20).read())
def cfg(**kv):
    p = B + '/tgl/config.json'; c = json.load(open(p)); c.update(kv); json.dump(c, open(p, 'w'), ensure_ascii=False, indent=1)
def chay(hang, map_, them=None):
    open(MG + '/hang', 'w').write(''.join(x + '\n' for x in hang)); open(MG + '/nhatky', 'w').write('')
    open(MG + '/map', 'w').write(''.join('%s %d\n' % kv for kv in map_.items()))
    env = dict(os.environ, HOME=HOME, MG=MG, PATH=MG + '/bin:' + os.environ['PATH'], POLY_OSA=MG + '/bin/osascript', POLY_CURL=MG + '/bin/curl',
               POLY_TIM_LINK='http://127.0.0.1:8799/poly-link.json'); env.update(them or {})
    r = subprocess.run(['bash', SH], env=env, capture_output=True, text=True, timeout=180)
    return r.returncode, open(MG + '/nhatky').read()
def cu_link():
    tok = may_txt().get('token', ''); open(D + '/may.txt', 'w').write('url=https://link-cu-da-chet.trycloudflare.com\ntoken=%s\n' % tok)
def may_txt():
    try: return dict(l.split('=', 1) for l in open(D + '/may.txt').read().split('\n') if '=' in l)
    except Exception: return {}

shutil.rmtree(MG, ignore_errors=True); os.makedirs(HOME); shutil.rmtree(B + '/gdrive-tl', ignore_errors=True); os.makedirs(KHO)
shutil.copytree(REPO + '/dev/test/macgia/bin', MG + '/bin')
for f in os.listdir(MG + '/bin'): os.chmod(MG + '/bin/' + f, 0o755)
# máy chủ file thử thay cho link Drive
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8799), functools.partial(http.server.SimpleHTTPRequestHandler, directory=KHO))
srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()

# --- máy shop: ghi link lên Drive
json.dump({"chung_url": "https://link-cu-da-chet.trycloudflare.com", "t": 1}, open(LF, 'w'))
kho_cu = KHO + '/kho-theme-canva.json'
cfg(kho_chung_chu=True, kho_chung_dir=KHO)          # app thử khởi động lại để đọc config
subprocess.run(['bash', '-c', 'kill $(cat %s/tgl/srv.pid); sleep 1; cd %s/tgl && (nohup python3 server.py > srv.out 2>&1 & echo $! > srv.pid); sleep 4' % (B, B)])
r = api('/api/chung', {"bat": True})
for _ in range(40):
    if r['chay']: break
    time.sleep(0.5); r = api('/api/chung')
url = r['url']; host = url.split('//')[1]
time.sleep(1)
lk = json.load(open(LF))
check('máy shop bật dùng chung: ghi link mới vào poly-link.json (ghi đè file có sẵn)', lk.get('chung_url') == url, lk)
check('trạng thái trong 💻 Máy khác: drive = ok', api('/api/chung').get('drive') == 'ok')
check('không tạo file khác trong thư mục Drive', sorted(os.listdir(KHO)) == ['poly-link.json'], os.listdir(KHO))

# --- app Mac: lần đầu (link gắn sẵn cũ) + lần sau link đổi
ma = api('/api/chung', {"ma_moi": True})['ma']
rc, nk = chay([ma, 'Mac Tìm Link'], {host: 8791})
check('lần đầu (không có link gắn sẵn): tự lấy link trên Drive, chỉ hỏi mã + tên', rc == 0 and 'Dán link' not in nk and nk.count('HOI') == 2 and ('--app=' + url) in nk, nk)
cu_link()
rc, nk = chay([], {host: 8791})
check('link cũ chết: tự lấy link mới trên Drive, không hỏi gì, mở app link mới', rc == 0 and 'HOI' not in nk and ('--app=' + url + '/#vao=') in nk, nk)
check('lưu link mới vào máy', may_txt().get('url') == url, may_txt())
# Drive cũng chỉ có link chết: hỏi như cũ
json.dump({"chung_url": "https://link-cu-da-chet.trycloudflare.com"}, open(LF, 'w'))
cu_link()
rc, nk = chay(['https://%s' % host], {host: 8791})
check('Drive cũng link chết: hỏi dán link như cũ, dán xong vào được', rc == 0 and 'Không mở được link cũ' in nk and ('--app=' + url) in nk, nk)
# Drive có link giả (không phải trycloudflare): bỏ qua
json.dump({"chung_url": "https://lua-dao.example.com"}, open(LF, 'w'))
cu_link()
rc, nk = chay(['__HUY__'], {host: 8791})
check('link trên Drive không phải trycloudflare.com: không dùng, hỏi fen', 'lua-dao' not in nk and 'Không mở được link cũ' in nk, nk)

# --- máy shop: mất file trên Drive thì không tự tạo
os.remove(LF)
api('/api/chung', {"bat": False}); time.sleep(1); api('/api/chung', {"bat": True})
for _ in range(40):
    r = api('/api/chung')
    if r['chay']: break
    time.sleep(0.5)
time.sleep(1)
check('không có poly-link.json: không tự tạo (tránh file khác mã), báo chua-co', not os.path.exists(LF) and r.get('drive') == 'chua-co', (os.listdir(KHO), r.get('drive')))
api('/api/chung', {"bat": False}); srv.shutdown()
cfg(kho_chung_chu=False, kho_chung_dir=None)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
