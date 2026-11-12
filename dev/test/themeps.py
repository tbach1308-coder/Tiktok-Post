# Thử kho theme Photoshop (fen 12/11 "thiết kế template kho chung bằng photoshop"): danh sách, ảnh xem trước,
# Chạy bài với theme -> lệnh Claude có dòng theme (đường dẫn theme.jsx, luật), sửa slide cũng mang theme, máy dùng chung thấy theme.
import json, time, urllib.request, urllib.error, os
APP = 'http://127.0.0.1:8790'; K = 'http://127.0.0.1:8791'
TGL = '/home/claude/bug3/tgl'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def req(base, path, d=None, h=None, raw=False):
    r = urllib.request.Request(base + path, data=json.dumps(d).encode() if d is not None else None, headers=dict({'Content-Type': 'application/json'}, **(h or {})))
    try:
        with urllib.request.urlopen(r, timeout=30) as f:
            b = f.read(); return f.status, (b if raw else json.loads(b) if b[:1] in (b'{', b'[') else b), dict(f.headers)
    except urllib.error.HTTPError as e:
        b = e.read()
        try: return e.code, json.loads(b), dict(e.headers)
        except Exception: return e.code, b, dict(e.headers)
    except Exception as e:
        return 0, str(e), {}
def cho_xong(jid, n=90):
    for _ in range(n):
        j = (req(APP, '/api/job/' + jid)[1] or {}).get('job') or {}
        if j.get('status') in ('xong', 'loi', 'dung'): return j
        time.sleep(1)
    return j
def prompt():
    return open(os.path.join(TGL, 'last-prompt.txt'), encoding='utf-8').read()

s, b, _ = req(APP, '/api/theme-ps')
ds = b.get('ds', []) if s == 200 else []
ids = [t['id'] for t in ds]
check('GET /api/theme-ps: 4 theme kho chung (2 phẳng, 2 glass)', s == 200 and ids == ['glass-tim-hong', 'glass-xanh-ngoc', 'phang-than-xanh-duong', 'phang-xanh-dem'] and all(t['kc'] for t in ds), (s, b))
check('kiểu theme: glass / phẳng', [t['kieu'] for t in ds] == ['glass', 'glass', 'phẳng', 'phẳng'], [t.get('kieu') for t in ds])
check('mỗi theme 3 ảnh xem trước + tên + màu', all(len(t['anh']) == 3 and t['ten'] and len(t['mau']) == 3 for t in ds), ds)
s, b, h = req(APP, ds[0]['anh'][0].split('?')[0], raw=True) if ds else (0, b'', {})
check('ảnh xem trước tải được (png)', s == 200 and b[:8] == b'\x89PNG\r\n\x1a\n' and h.get('Content-Type') == 'image/png', (s, h))
for p in ['/api/theme-ps/anh/phang-xanh-dem/4', '/api/theme-ps/anh/khong-co/1', '/api/theme-ps/anh/..%2Fui/1', '/api/theme-ps/anh/_dong-co/1']:
    check('ảnh sai đường dẫn: 404 (%s)' % p, req(APP, p, raw=True)[0] == 404)

# Chạy bài Photoshop với theme
s, b, _ = req(APP, '/api/run', {"kenh": "ipad", "brief": "Bìa: THEME PHẲNG\nSlide 2: thử theme", "theme_ps": "phang-xanh-dem"})
check('Chạy với theme Photoshop: tạo bài', s == 200 and b.get('id'), (s, b))
jid = b.get('id')
j = cho_xong(jid)
check('bài ghi theme_ps', (j.get('theme_ps') or {}).get('id') == 'phang-xanh-dem' and j.get('theme_ps', {}).get('ten') == 'Phẳng · Xanh lá đêm', j.get('theme_ps'))
check('bài vẫn là Photoshop (không dung_bang canva)', j.get('dung_bang') != 'canva', j.get('dung_bang'))
pr = prompt()
check('lệnh dựng có dòng Theme Photoshop + tên theme + kiểu', 'Theme Photoshop: "Phẳng · Xanh lá đêm" (kho chung, phẳng:' in pr, pr[:600])
check('lệnh dựng có --theme đúng file theme.jsx', '--theme "%s/theme-ps/phang-xanh-dem/theme.jsx"' % TGL in pr, pr[:900])
check('lệnh dựng dặn đọc luật theme + agent chấm theo theme', '%s/theme-ps/luat-theme.md' % TGL in pr and 'agent duyệt' in pr, pr[:900])
s, b, _ = req(APP, '/api/jobs')
it = next((x for x in b.get('jobs', []) if x['id'] == jid), {})
check('danh sách bài có theme_ps (nhãn 🖌)', (it.get('theme_ps') or {}).get('id') == 'phang-xanh-dem', it)

# sửa slide: lệnh sửa cũng mang theme
s, b, _ = req(APP, '/api/job/%s/sua' % jid, {"text": "đổi chữ slide 2", "slides": [2]})
check('Sửa slide bài có theme: chạy được', s == 200, (s, b))
cho_xong(jid)
pr = prompt()
check('lệnh sửa slide có theme của bài + --theme', 'Theme Photoshop của bài: "Phẳng · Xanh lá đêm"' in pr and '--theme' in pr, pr[:700])

# bài không theme
s, b, _ = req(APP, '/api/run', {"kenh": "laptop", "brief": "Bìa: KHÔNG THEME\nSlide 2: x"})
jid2 = b.get('id'); j2 = cho_xong(jid2)
pr = prompt()
check('bài không theme: lệnh ghi "(không, dựng theo theme của kênh…)"', 'Theme Photoshop: (không, dựng theo theme của kênh' in pr and '--theme' not in pr, pr[:600])
check('bài không theme: không có theme_ps', not j2.get('theme_ps'), j2.get('theme_ps'))

# theme sai / Canva
s, b, _ = req(APP, '/api/run', {"kenh": "ipad", "brief": "Bìa: x\nSlide 2: y", "theme_ps": "khong-co"})
check('theme không có trong kho: 400 báo chọn lại', s == 400 and 'Không thấy theme Photoshop' in b.get('err', ''), (s, b))
s, b, _ = req(APP, '/api/run', {"kenh": "ipad", "brief": "Bìa: x\nSlide 2: y", "theme_ps": "../ui"})
check('theme id lạ: 400', s == 400, (s, b))

# máy dùng chung thấy kho theme Photoshop
r = req(APP, '/api/chung', {"bat": True})[1]
for _ in range(20):
    r = req(APP, '/api/chung')[1]
    if r.get('chay'): break
    time.sleep(0.5)
HOST = r['url'].split('//')[1]; ma = req(APP, '/api/chung', {"ma_moi": True})[1]['ma']
TOK = req(K, '/api/chung/vao', {"ma": ma, "ten": "Máy thử theme"}, h={'Host': HOST})[1].get('token')
T = {'Host': HOST, 'X-Poly-Khach': TOK}
s, b, _ = req(K, '/api/theme-ps', h=T)
check('máy dùng chung: thấy 4 theme Photoshop kho chung', s == 200 and len(b.get('ds', [])) == 4, (s, b))
s, b, _ = req(K, '/api/theme-ps/anh/phang-xanh-dem/2', h=T, raw=True)
check('máy dùng chung: xem ảnh theme', s == 200 and b[:4] == b'\x89PNG', s)
s, b, _ = req(K, '/api/run', {"kenh": "ipad", "brief": "Bìa: MÁY KHÁC\nSlide 2: x", "theme_ps": "phang-than-xanh-duong"}, h=T)
check('máy dùng chung: chạy bài với theme Photoshop', s == 200 and b.get('id'), (s, b))
jk = cho_xong(b.get('id'))
check('bài máy khác ghi theme + khách', (jk.get('theme_ps') or {}).get('id') == 'phang-than-xanh-duong' and (jk.get('khach') or {}).get('ten') == 'Máy thử theme', jk)
req(APP, '/api/chung', {"bat": False})

# file theme.jsx đúng dạng (THEME + động cơ)
for i in ids:
    js = open(os.path.join(TGL, 'theme-ps', i, 'theme.jsx'), encoding='utf-8').read()
    check('theme.jsx %s: có THEME + nền phẳng + bỏ bóng' % i, js.startswith('// theme.jsx tự tạo') and 'var THEME = {' in js and 'function themeNen()' in js and 'fxGlow = function () {};' in js)
s, b, _ = req(APP, '/api/run', {"kenh": "ipad", "brief": "Bìa: GLASS\nSlide 2: x", "theme_ps": "glass-tim-hong"})
cho_xong(b.get('id')); pr = prompt()
check('chạy theme glass: lệnh ghi kiểu glass + --theme glass', '(kho chung, glass:' in pr and 'glass-tim-hong/theme.jsx' in pr, pr[:700])
js = open(os.path.join(TGL, 'theme-ps', 'glass-tim-hong', 'theme.jsx'), encoding='utf-8').read()
check('theme glass có nền ảnh mờ + thẻ kính + bìa kiểu quảng cáo', '"nen_kieu": "kinh"' in js and 'function themeAnhMo' in js and 'function biaSanPham' in js)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
