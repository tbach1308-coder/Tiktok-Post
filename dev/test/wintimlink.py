# App Windows dùng chung (.exe trong wine) đọc link mới máy shop ghi trên Google Drive (fen 15/11 "Link cố định cho máy kia").
# POLY_THU=1: link Drive thay bằng máy chủ file thử (POLY_TIM_LINK), cho phép http://127.0.0.1. Chạy: PATH có lệnh wine.
import json, os, subprocess, time, urllib.request, shutil, threading, http.server, functools
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
APP = 'http://127.0.0.1:8790'; L = 'http://127.0.0.1:8791'; EXE = REPO + '/dist/Poly-Dung-Bai-dung-chung.exe'
PFX = '/tmp/claude-0/winthu/pfx'; LAD = PFX + '/drive_c/users/root/AppData/Local/PolyDungBaiChung'; KHO = '/tmp/claude-0/wintl'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def api(p, d=None):
    r = urllib.request.Request(APP + p, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(r, timeout=20).read())
def chay(tra_loi, tim=True):
    env = dict(os.environ, WINEPREFIX=PFX, WINEDEBUG='-all', POLY_THU='1', POLY_TRA_LOI='|'.join(tra_loi))
    if tim: env['POLY_TIM_LINK'] = 'http://127.0.0.1:8797/poly-link.json?id=abc&export=download'
    r = subprocess.run(['wine', EXE], env=env, capture_output=True, timeout=180)
    return r.returncode, r.stdout.decode('utf-8', 'replace')
def may_txt(): return open(LAD + '/may.txt', encoding='utf-8', newline='').read()
shutil.rmtree(KHO, ignore_errors=True); os.makedirs(KHO); shutil.rmtree(LAD, ignore_errors=True)
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8797), functools.partial(http.server.SimpleHTTPRequestHandler, directory=KHO))
srv.RequestHandlerClass.log_message = lambda *a: None
threading.Thread(target=srv.serve_forever, daemon=True).start()
json.dump({"chung_url": L, "t": 1}, open(KHO + '/poly-link.json', 'w'))
r = api('/api/chung', {"bat": True})
for _ in range(30):
    if r['chay']: break
    time.sleep(0.5); r = api('/api/chung')
ma = api('/api/chung', {"ma_moi": True})['ma']
rc, o = chay([ma, 'PC Tìm Link'])
check('lần đầu không có link: lấy link trên Drive (link có ?id=…), chỉ hỏi mã + tên', 'Dán link' not in o and o.count('HOI') == 2 and ('MO: ' in o and L + '/#vao=' in o), o)
tok = may_txt().split('token=')[1].strip()
open(LAD + '/may.txt', 'w', encoding='utf-8', newline='').write('url=http://127.0.0.1:9\r\ntoken=%s\r\n' % tok)
rc, o = chay([])
check('link cũ chết: tự lấy link mới trên Drive, không hỏi gì', 'HOI' not in o and L + '/#vao=' in o, o)
check('lưu link mới', ('url=%s\r\n' % L) in may_txt(), may_txt())
json.dump({"chung_url": "https://lua-dao.example.com"}, open(KHO + '/poly-link.json', 'w'))
open(LAD + '/may.txt', 'w', encoding='utf-8', newline='').write('url=http://127.0.0.1:9\r\ntoken=%s\r\n' % tok)
rc, o = chay(['__HUY__'])
check('link lạ trên Drive (không phải trycloudflare.com): không dùng, hỏi fen', 'lua-dao' not in o and 'Không mở được link cũ' in o, o)
srv.shutdown(); api('/api/chung', {"bat": False})
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
