# fen 24/11 13h45 "kiểm tra app có lỗi gì ko" -> "Sửa kho Polysto": đọc kho qua Chrome lỗi tạm (hết giờ, không thấy bảng, bảng trống)
# thì app tự thử lại tối đa 2 lần rồi mới báo lỗi; tiện ích báo "đã vào trang kho" + chẩn đoán cấu trúc trang -> nhật ký.
# Chạy trên app thử khởi động lại với giờ ngắn:
#   cd /home/claude/bug3 && POLY_KHO_HET=5 POLY_KHO_THU=3,4 bash reset.sh && python3 kholai.py
import json, os, re, time, urllib.request
A = 'http://127.0.0.1:8790'; T = '/home/claude/bug3/tgl'; ARGS = T + '/fakechrome/args.log'; LOG = T + '/app-log.txt'
ok = [0, 0]


def check(n, c, x=''):
    ok[0 if c else 1] += 1
    print(('✓ ' if c else '✗ ') + n, '' if c else x)


def req(p, d=None, ext=False):
    h = {'Content-Type': 'application/json'}
    if ext:
        h['Origin'] = 'chrome-extension://abcdefpolytiktok'
    r = urllib.request.Request(A + p, data=json.dumps(d).encode() if d is not None else None, headers=h)
    try:
        return json.loads(urllib.request.urlopen(r, timeout=60).read())
    except urllib.error.HTTPError as e:
        return dict(json.loads(e.read() or b'{}'), _code=e.code)


def toks():
    return re.findall(r'kho-mo\?tok=(\w+)', open(ARGS).read()) if os.path.exists(ARGS) else []


def cho_tok(n, s=20):
    for _ in range(s * 2):
        t = toks()
        if len(t) >= n:
            return t[n - 1]
        req('/api/goi-y')                 # app đang mở: hỏi trạng thái (như giao diện) -> kiểm hết giờ
        time.sleep(0.5)
    return None


def log_tu(n0):
    return open(LOG, encoding='utf-8').read()[n0:] if os.path.exists(LOG) else ''


for f in ('goi-y-kho.json', 'kho-web.json', 'poly-tt.json'):
    try:
        os.rename(os.path.join(T, f), '/tmp/_bo_%d_%s' % (time.time(), f))
    except OSError:
        pass
os.makedirs(T + '/fakechrome/ud/Profile 9', exist_ok=True)
json.dump({"profile": {"info_cache": {"Default": {"name": "Your Chrome"}, "Profile 9": {"name": "Kho POLY"}}}}, open(T + '/fakechrome/ud/Local State', 'w'))
json.dump({"extensions": {"settings": {"abcdefpoly": {"path": "E:\\Tool\\poly-dung-bai\\tiktok-ext", "location": 4, "state": 1}}}},
          open(T + '/fakechrome/ud/Profile 9/Secure Preferences', 'w'))
req('/api/tiktok-cai', {"ho_so": "Default"}); req('/api/goi-y', {"hs": ""})
req('/api/goi-y', {"cach": "web", "link": {"laptop": "https://app.polystorevn.com/kho-may", "ipad": ""}})
ROWS = [{"ten": "Dell Latitude 7420 i7 16GB", "gia": "12.900.000", "them": "i7 · 16GB", "tt": "Tồn kho"},
        {"ten": "iPad Air 5 64GB Wifi", "gia": "11.200.000", "them": "M1 · 64GB", "tt": "Tồn kho"}]

# 1) Chrome không gửi về (hết giờ) -> tự thử lại -> lần 2 gửi về được
open(ARGS, 'w').close(); n0 = len(log_tu(0))
r = req('/api/goi-y', {"quet": True})
t1 = cho_tok(1)
check('bấm Cập nhật kho: mở /kho-mo trong Chrome', bool(t1), r)
d = {}
for _ in range(30):
    d = req('/api/goi-y')
    if 'tự thử lại' in (d.get('buoc') or ''):
        break
    time.sleep(0.5)
check('hết giờ chưa gửi về: không báo lỗi, báo "tự thử lại (lần 2)"', d.get('dang') and not d.get('loi') and 'lần 2' in (d.get('buoc') or ''), d.get('buoc'))
t2 = cho_tok(2)
check('tự mở lại trang kho (mã mới)', t2 and t2 != t1, (t1, t2))
check('mã cũ hết hạn', req('/api/kho-web', {"tok": t1, "k": "ca", "tt": "ok", "rows": ROWS}, ext=True).get('_code') == 400)
v = req('/api/kho-web', {"tok": t2, "k": "ca", "tt": "vao", "url": "/kho-may"}, ext=True)
check('tiện ích báo đã vào trang kho: app không đóng tab', v.get('ok') and v.get('dong') is False, v)
v = req('/api/kho-web', {"tok": t2, "k": "ca", "tt": "ok", "cot": ["#", "TÊN MÁY & SERI", "GIÁ BÁN"], "rows": ROWS}, ext=True)
check('lần 2 gửi kho về: nhận', v.get('ok') and v.get('dong'), v)
kw = json.load(open(T + '/kho-web.json', encoding='utf-8')) if os.path.exists(T + '/kho-web.json') else {}
check('kho-web.json có 2 dòng máy mới', len(kw.get('may') or []) == 2, kw)
lg = log_tu(n0)
check('nhật ký: thử lại lần 2 + tiện ích đã vào trang kho', 'thu lai lan 2' in lg and 'tien ich da vao trang kho' in lg, lg[-600:])
for _ in range(120):
    d = req('/api/goi-y')
    if not d.get('dang'):
        break
    time.sleep(0.5)

# 2) 3 lần liền không thấy bảng -> báo lỗi rõ, nhật ký có chẩn đoán
open(ARGS, 'w').close(); n0 = len(log_tu(0))
req('/api/goi-y', {"quet": True})
CT = {"an": "hidden", "path": "/kho-may", "bang": [{"th": 11, "tr": 0, "an": False}], "hop": ["Thông báo"], "tai": False, "grid": 0}
ds = []
for lan in (1, 2, 3):
    t = cho_tok(lan)
    ds.append(t)
    req('/api/kho-web', {"tok": t, "k": "ca", "tt": "khong-thay", "cot": ["Kho máy", "#", "TÊN MÁY & SERI"], "ct": CT}, ext=True)
check('không thấy bảng: thử thêm 2 lần (3 mã khác nhau)', len(set(x for x in ds if x)) == 3, ds)
d = req('/api/goi-y')
check('lần 3 vẫn không thấy: báo lỗi, hết "đang cập nhật"', not d.get('dang') and 'Không thấy bảng máy' in (d.get('loi') or ''), d)
time.sleep(5)
check('không tự mở thêm lần 4', len(toks()) == 3, toks())
lg = log_tu(n0)
check('nhật ký có chẩn đoán trang (ẩn, bảng 0 dòng, hộp Thông báo)', 'chan doan' in lg and 'Thông báo' in lg and '"tr": 0' in lg, lg[-800:])
check('Kho Poly báo lỗi đọc web', req('/api/poly-tt').get('tt') == 'loi')
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
