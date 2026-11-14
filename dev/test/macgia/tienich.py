# fen 14/11 21h29 "tiện ích có update đồng bộ dc không": app Mac dùng chung mỗi lần mở tải tiện ích Poly TikTok mới nhất của máy shop,
# chép đè vào thư mục Chrome của app đang nạp tiện ích (đọc Secure Preferences bằng JXA) + ~/PolyTikTok. osascript / curl / Chrome giả.
import json, os, subprocess, time, urllib.request, shutil
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MG = '/home/claude/bug3/macgia-ti'; APP = 'http://127.0.0.1:8790'; SH = REPO + '/packaging/mac-chung/poly-chung'
HOME = MG + '/home'; D = HOME + '/Library/Application Support/PolyDungBaiChung'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def api(p, d=None):
    r = urllib.request.Request(APP + p, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(r, timeout=20).read())
def chay(hang, map_):
    open(MG + '/hang', 'w').write(''.join(x + '\n' for x in hang)); open(MG + '/nhatky', 'w').write('')
    open(MG + '/map', 'w').write(''.join('%s %d\n' % kv for kv in map_.items()))
    env = dict(os.environ, HOME=HOME, MG=MG, PATH=MG + '/bin:' + os.environ['PATH'], POLY_OSA=MG + '/bin/osascript', POLY_CURL=MG + '/bin/curl')
    r = subprocess.run(['bash', SH], env=env, capture_output=True, text=True, timeout=120)
    return r.returncode, open(MG + '/nhatky').read()
def ban(p):
    try: return json.load(open(p + '/manifest.json')).get('version')
    except Exception: return None
shutil.rmtree(MG, ignore_errors=True); os.makedirs(HOME)
shutil.copytree(REPO + '/dev/test/macgia/bin', MG + '/bin')
for f in os.listdir(MG + '/bin'): os.chmod(MG + '/bin/' + f, 0o755)
moi = json.load(open(REPO + '/tiktok-ext/manifest.json'))['version']
r = api('/api/chung', {"bat": True})
for _ in range(30):
    if r['chay']: break
    time.sleep(0.5); r = api('/api/chung')
host = r['url'].split('//')[1]; M = {host: 8791}
ma = api('/api/chung', {"ma_moi": True})['ma']
rc, nk = chay(['https://%s' % host, ma, 'Mac Phú thử'], M)
check('lần đầu vào được + mở app', rc == 0 and ('OPEN: ' in nk or 'CHROME:' in nk), nk)
check('lần đầu: tải tiện ích vào ~/PolyTikTok (cài 1 lần từ thư mục này)', ban(HOME + '/PolyTikTok') == moi and os.path.isfile(HOME + '/PolyTikTok/background.js'), os.listdir(HOME) if os.path.isdir(HOME) else '')
check('không để rác (zip, thư mục giải nén)', not os.path.exists(D + '/tien-ich.zip') and not os.path.exists(D + '/tien-ich-moi'), os.listdir(D))
# Phú đã cài tiện ích từ ~/Downloads/poly-tiktok (bản cũ) trong Chrome của app + 1 tiện ích khác
cu = HOME + '/Downloads/poly-tiktok'; khac = HOME + '/Downloads/tien-ich-khac'
for p, ten, b in ((cu, 'Poly TikTok', '0.11.0'), (khac, 'Tiện ích khác', '1.0.0')):
    os.makedirs(p); json.dump({'name': ten, 'version': b}, open(p + '/manifest.json', 'w'))
os.makedirs(D + '/chrome/Default'); os.makedirs(D + '/chrome/Profile 1')
json.dump({'extensions': {'settings': {'aaa': {'path': cu, 'location': 4}, 'bbb': {'path': khac, 'location': 4}, 'ccc': {'path': 'tuong-doi', 'location': 1}}}}, open(D + '/chrome/Default/Secure Preferences', 'w'))
open(D + '/chrome/Profile 1/Preferences', 'w').write('{hỏng')
shutil.rmtree(HOME + '/PolyTikTok')
rc, nk = chay([], M)
check('mở lại: chép bản mới đè vào thư mục Chrome đang nạp Poly TikTok', ban(cu) == moi and os.path.isfile(cu + '/app.js'), ban(cu))
check('không đụng tiện ích khác, ~/PolyTikTok vẫn có bản mới, Preferences hỏng không làm lỗi', ban(khac) == '1.0.0' and not os.path.exists(khac + '/app.js') and ban(HOME + '/PolyTikTok') == moi and rc == 0, (ban(khac), rc))
check('vẫn mở app như thường, không hỏi gì', 'HOI' not in nk and ('OPEN: ' in nk or 'CHROME:' in nk), nk)
# máy shop tắt đường nối / tải lỗi: không chép gì, app vẫn mở
json.dump({'name': 'Poly TikTok', 'version': '0.11.0'}, open(cu + '/manifest.json', 'w'))
api('/api/chung', {"bat": False}); time.sleep(1)
rc, nk = chay(['__HUY__'], M)
check('tải không được: giữ nguyên thư mục cũ', ban(cu) == '0.11.0', ban(cu))
api('/api/chung', {"bat": True})
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
