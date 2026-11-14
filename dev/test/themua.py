# Theme theo mùa (fen 14/11 12h13): theme Canva có mùa (Black Friday, Christmas, Tết, Valentine, Halloween) đoán theo tên hoặc fen chọn
# ở Thông tin; ngoài mùa thì app không tự chọn (Bài mới, Telegram) và Kho theme ẩn mặc định; mùa fen chọn tay đi theo kho chung.
import json, time, urllib.request, urllib.error, os, sys, datetime, random, string
APP = 'http://127.0.0.1:8790'
GOC = '/home/claude/bug3/tgl'
KC = '/home/claude/bug3/gdrive/My Drive/POLY Kho Theme/kho-theme-canva.json'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def req(path, d=None):
    r = urllib.request.Request(APP + path, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r, timeout=60) as f:
            return f.status, json.loads(f.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b'{}')
D = datetime.date
sys.path.insert(0, GOC); os.chdir(GOC)
import importlib; srv = importlib.import_module('server')

# ---------- đoán mùa theo tên ----------
for ten, k in [("Theme Black Friday · Đen vàng (POLY)", "black-friday"), ("Theme Christmas · Đỏ tuyết (POLY)", "christmas"),
               ("Theme Tết · Đỏ vàng (POLY)", "tet"), ("TET SALE 2027", "tet"), ("Noel ấm áp", "christmas"), ("Giáng sinh an lành", "christmas"),
               ("Xmas đỏ", "christmas"), ("Valentine hồng", "valentine"), ("Halloween cam", "halloween"), ("Cyber Monday", "black-friday"),
               ("Chi tiết máy · nền tối", None), ("Theme 2D · Kem cam (POLY)", None), ("Theme School · Vở học trò (POLY)", None),
               ("Tết phân rã", "tet")]:
    check('đoán mùa "%s" -> %s' % (ten, k), srv._doan_mua(ten) == k, srv._doan_mua(ten))

# ---------- khoảng ngày ----------
check('Black Friday 2026: 10/11 – 02/12', srv.mua_khoang('black-friday', D(2026, 11, 14)) == (D(2026, 11, 10), D(2026, 12, 2)))
check('Christmas 2026: 01/11 – 26/12 (fen 14/11 chọn Noel từ 1/11)', srv.mua_khoang('christmas', D(2026, 11, 14)) == (D(2026, 11, 1), D(2026, 12, 26)))
check('qua Christmas: mùa năm sau', srv.mua_khoang('christmas', D(2026, 12, 27)) == (D(2027, 11, 1), D(2027, 12, 26)))
check('Tết 2027 (mùng 1 = 06/02): 02/01 – 15/02', srv.mua_khoang('tet', D(2026, 11, 14)) == (D(2027, 1, 2), D(2027, 2, 15)), srv.mua_khoang('tet', D(2026, 11, 14)))
check('Tết 2028 (mùng 1 = 26/01): bắt đầu 22/12/2027', srv.mua_khoang('tet', D(2027, 3, 1)) == (D(2027, 12, 22), D(2028, 2, 4)), srv.mua_khoang('tet', D(2027, 3, 1)))
check('Tết quá bảng âm lịch: không biết -> coi như cả năm', srv.mua_khoang('tet', D(2034, 6, 1)) is None and not srv.theme_ngoai_mua({"ten": "Tết"}, D(2034, 6, 1)))
xm = {"ten": "Theme Christmas · Đỏ tuyết"}
for d, ngoai in [(D(2026, 10, 31), True), (D(2026, 11, 1), False), (D(2026, 11, 14), False), (D(2026, 12, 26), False), (D(2026, 12, 27), True)]:
    check('Christmas ngày %s: %s' % (d.strftime('%d/%m'), 'hết mùa' if ngoai else 'đang mùa'), srv.theme_ngoai_mua(xm, d) == ngoai)
check('Tết 14/11: hết mùa', srv.theme_ngoai_mua({"ten": "Theme Tết"}, D(2026, 11, 14)))
check('Tết mùng 9 (14/02/2027): đang mùa', not srv.theme_ngoai_mua({"ten": "Theme Tết"}, D(2027, 2, 14)))
check('fen chọn "cả năm": không bao giờ hết mùa', not srv.theme_ngoai_mua({"ten": "Theme Christmas", "mua": ""}, D(2026, 7, 1)))
check('fen chọn mùa tay thắng tên', srv.mua_cua({"ten": "Theme 2D", "mua": "tet"}) == "tet" and srv.mua_cua({"ten": "Theme Tết", "mua": ""}) is None)

# ---------- API kho theme ----------
hom = D.today()
def trong(k):
    w = srv.mua_khoang(k, hom)
    return bool(w) and w[0] <= hom <= w[1]
R = lambda: 'D' + ''.join(random.choice(string.ascii_letters) for _ in range(10))
s, r = req('/api/theme-canva', {"them": {"link": "https://www.canva.com/design/%s/edit" % R(), "ten": "Mẹo thường (thử mùa)", "kenh": "", "dang": ["meo"]}})
check('thêm theme thường', s == 200, r)
time.sleep(1.1)
s, r = req('/api/theme-canva', {"them": {"link": "https://www.canva.com/design/%s/edit" % R(), "ten": "Christmas · Thử mùa", "kenh": "", "dang": ["meo"]}})
time.sleep(1.1)
s, r = req('/api/theme-canva', {"them": {"link": "https://www.canva.com/design/%s/edit" % R(), "ten": "Black Friday · Thử mùa", "kenh": "", "dang": ["gia"]}})
ds = {t['ten']: t for t in r['ds']}
th, xmas, bf = ds["Mẹo thường (thử mùa)"], ds["Christmas · Thử mùa"], ds["Black Friday · Thử mùa"]
check('GET có danh sách mùa để chọn', [x[0] for x in r.get('mua_ds') or []] == list(srv.MUA), r.get('mua_ds'))
check('theme thường: không mùa', th['mua'] == '' and th['ngoai_mua'] is False and th['mua_tu'] == '', th)
check('Christmas: mùa tự đoán theo tên', xmas['mua'] == 'christmas' and xmas['mua_ten'] == 'Christmas' and xmas['mua_chon'] is False, xmas)
check('Christmas: ngoài / trong mùa đúng theo hôm nay', xmas['ngoai_mua'] == (not trong('christmas')), xmas)
check('Christmas: có ngày từ / đến (dd/mm)', xmas['mua_tu'] == srv.mua_khoang('christmas', hom)[0].strftime('%d/%m') and xmas['mua_den'] == '26/12', xmas)
check('Black Friday: ngoài / trong mùa đúng theo hôm nay', bf['mua'] == 'black-friday' and bf['ngoai_mua'] == (not trong('black-friday')), bf)

# app tự chọn theme theo dạng bài (Telegram dựng Canva): theme hết mùa không được chọn
g = srv.theme_goi_y('ipad', 'Mẹo giữ pin iPad bền')
check('tự chọn theme: %s' % ('bỏ qua Christmas hết mùa' if not trong('christmas') else 'Christmas đang mùa, chọn theme mới nhất'),
      g and g['ten'] == ("Christmas · Thử mùa" if trong('christmas') else "Mẹo thường (thử mùa)"), g and g['ten'])

# fen chọn mùa ở Thông tin
s, r = req('/api/theme-canva', {"sua": {"id": xmas['id'], "ten": xmas['ten'], "kenh": "", "dang": ["meo"], "mua": ""}})
x2 = next(t for t in r['ds'] if t['id'] == xmas['id'])
check('chọn "cả năm": hết ẩn', s == 200 and x2['mua'] == '' and x2['mua_chon'] is True and x2['ngoai_mua'] is False, x2)
g = srv.theme_goi_y('ipad', 'Mẹo giữ pin iPad bền')
check('cả năm: app tự chọn lại được (mới nhất)', g and g['ten'] == "Christmas · Thử mùa", g and g['ten'])
s, r = req('/api/theme-canva', {"sua": {"id": th['id'], "ten": th['ten'], "kenh": "", "dang": ["meo"], "mua": "valentine"}})
t2 = next(t for t in r['ds'] if t['id'] == th['id'])
check('chọn mùa tay cho theme thường (Valentine)', t2['mua'] == 'valentine' and t2['mua_chon'] and t2['ngoai_mua'] == (not trong('valentine')), t2)
s, r = req('/api/theme-canva', {"sua": {"id": th['id'], "ten": th['ten'], "kenh": "", "dang": ["meo"], "mua": "auto"}})
t3 = next(t for t in r['ds'] if t['id'] == th['id'])
check('chọn "tự theo tên": về không mùa', t3['mua'] == '' and t3['mua_chon'] is False, t3)
s, r = req('/api/theme-canva', {"sua": {"id": th['id'], "ten": "Đổi tên không được lưu", "kenh": "", "dang": ["meo"], "mua": "mua-la"}})
check('mùa lạ: báo lỗi, không đổi gì', s == 400 and 'Mùa' in (r.get('err') or ''), (s, r))
check('mùa lạ: tên theme giữ nguyên', any(t['ten'] == "Mẹo thường (thử mùa)" for t in req('/api/theme-canva')[1]['ds']))
s, r = req('/api/theme-canva', {"sua": {"id": th['id'], "ten": th['ten'], "kenh": "", "dang": ["meo"]}})
check('lưu Thông tin không gửi mùa: giữ mùa cũ', s == 200)

# kho chung: mùa fen chọn tay đi theo (máy khác tính cùng 1 cách), mùa đoán theo tên thì máy khác tự đoán
req('/api/theme-canva', {"kc": xmas['id'], "bat": True}); req('/api/theme-canva', {"kc": bf['id'], "bat": True})
for _ in range(40):
    kc = {x['ma']: x for x in (json.load(open(KC, encoding='utf-8')).get('ds') or [])} if os.path.exists(KC) else {}
    if xmas['ma'] in kc and bf['ma'] in kc: break
    time.sleep(0.5)
check('kho chung: theme mùa chọn tay có "mua"', kc.get(xmas['ma'], {}).get('mua') == '', kc.get(xmas['ma']))
check('kho chung: theme mùa đoán theo tên không ghi "mua"', bf['ma'] in kc and 'mua' not in kc[bf['ma']], kc.get(bf['ma']))

# dọn: bỏ 3 theme thử khỏi kho (ẩn, không xoá)
for t in (th, xmas, bf):
    req('/api/theme-canva', {"kc": t['id'], "bat": False})
    req('/api/theme-canva', {"xoa": t['id']})
print('\n%d đạt, %d lỗi' % tuple(ok))
