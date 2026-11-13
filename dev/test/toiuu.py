# Tối ưu app (fen 13/11 18h50 "tối ưu app", 19h02 "đảm bảo máy admin và máy con chạy trơn"):
#  - máy chủ nhớ job.json theo giờ sửa: danh sách bài / hàng chờ chỉ đọc lại bài vừa đổi, bài dời đi thì biến mất
#  - kho theme chung: không đổi thì không ghi lại lên Drive, log đúng số "mới"
#  - cổng máy con: nén gzip chữ / JSON (trình duyệt nhận gzip), ảnh / font gửi nguyên; font, icon nhớ 1 ngày
import json, time, urllib.request, urllib.error, os, shutil, gzip, glob
APP = 'http://127.0.0.1:8790'; K = 'http://127.0.0.1:8791'
GOC = '/home/claude/bug3/tgl'; JOBS = GOC + '/jobs'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def req(base, path, d=None, h=None):
    r = urllib.request.Request(base + path, data=json.dumps(d).encode() if d is not None else None, headers=dict({'Content-Type': 'application/json'}, **(h or {})))
    try:
        with urllib.request.urlopen(r, timeout=60) as f:
            return f.status, f.read(), f.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read(), e.headers
J = lambda b: json.loads(b)

# ---------- 1. nhớ job.json ----------
jobs = J(req(APP, '/api/jobs')[1])['jobs']
if not any(x.get('status') == 'xong' for x in jobs):     # máy thử mới: dựng 1 bài (Claude giả)
    jid = J(req(APP, '/api/run', {"kenh": "laptop", "brief": "Bìa: BÀI THỬ TỐI ƯU\nSlide 2: x"})[1])['id']
    for _ in range(90):
        if (J(req(APP, '/api/job/' + jid)[1]).get('job') or {}).get('status') == 'xong': break
        time.sleep(1)
    jobs = J(req(APP, '/api/jobs')[1])['jobs']
goc = next(x for x in jobs if x.get('status') == 'xong')
p = os.path.join(JOBS, goc['id'], 'job.json')
j0 = json.load(open(p, encoding='utf-8'))
def ghi(j):
    tmp = p + '.tmp'; json.dump(j, open(tmp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); os.replace(tmp, p)
def ten_trong_ds():
    return next((x['tieu_de'] for x in J(req(APP, '/api/jobs')[1])['jobs'] if x['id'] == goc['id']), None)
try:
    ghi(dict(j0, ten_bai='Tên thử AAAA'))
    check('sửa job.json: danh sách bài thấy ngay', ten_trong_ds() == 'Tên thử AAAA', ten_trong_ds())
    time.sleep(3.5)
    ghi(dict(j0, ten_bai='Tên thử BBBB'))           # cùng cỡ file, giờ sửa mới
    check('sửa lần 2 (cùng cỡ file, sau 3 giây): vẫn thấy ngay', ten_trong_ds() == 'Tên thử BBBB', ten_trong_ds())
    time.sleep(3.5)
    check('không sửa gì: vẫn đúng tên (lấy từ bộ nhớ)', ten_trong_ds() == 'Tên thử BBBB', ten_trong_ds())
    ghi(dict(j0, ten_bai='Tên thử BBBB', status='hen', hen_luc=time.time() + 3600))
    st = next((x['status'] for x in J(req(APP, '/api/jobs')[1])['jobs'] if x['id'] == goc['id']), None)
    check('đổi trạng thái (hẹn): danh sách thấy ngay', st == 'hen', st)
finally:
    ghi(j0)
check('trả lại job.json cũ: đúng tên cũ', ten_trong_ds() == goc['tieu_de'], (ten_trong_ds(), goc['tieu_de']))

# bài dời khỏi thư mục jobs (vd dọn tháng cũ) -> biến mất; trả lại -> hiện lại
tam = '/home/claude/bug3/_toiuu_tam'; os.makedirs(tam, exist_ok=True)
shutil.move(os.path.join(JOBS, goc['id']), os.path.join(tam, goc['id']))
try:
    ids = [x['id'] for x in J(req(APP, '/api/jobs')[1])['jobs']]
    check('dời bài đi: không còn trong danh sách', goc['id'] not in ids)
finally:
    shutil.move(os.path.join(tam, goc['id']), os.path.join(JOBS, goc['id']))
ids = [x['id'] for x in J(req(APP, '/api/jobs')[1])['jobs']]
check('trả bài lại: hiện lại', goc['id'] in ids)

# nhiều bài: lần đầu đọc hết, các lần sau nhanh hơn (chỉ xem giờ sửa)
them = []
for i in range(150):
    jid = '20990101-%06d-tt%02d' % (i, i % 100)
    d = os.path.join(JOBS, jid); os.makedirs(d, exist_ok=True)
    json.dump(dict(j0, id=jid, ten_bai='Bài nhiều %d' % i, created=time.time() - 9e6), open(os.path.join(d, 'job.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    them.append(d)
try:
    time.sleep(3.5)          # quá 3 giây: bộ nhớ được dùng
    t0 = time.time(); s, b, _ = req(APP, '/api/jobs'); t1 = time.time() - t0
    ds = J(b)['jobs']
    check('150 bài thêm: danh sách có đủ (tối đa 200 bài mới nhất)', s == 200 and sum(1 for x in ds if x['tieu_de'].startswith('Bài nhiều')) == 150, len(ds))
    ts = []
    for _ in range(5):
        t0 = time.time(); req(APP, '/api/jobs'); ts.append(time.time() - t0)
    check('các lần hỏi sau nhanh hơn lần đầu (nhớ job.json)', min(ts) < t1, (round(t1, 4), [round(x, 4) for x in ts]))
    print('   (lần đầu %.1f ms, sau %.1f ms)' % (t1 * 1000, min(ts) * 1000))
finally:
    for d in them:
        shutil.rmtree(d, ignore_errors=True)
ids = [x['id'] for x in J(req(APP, '/api/jobs')[1])['jobs']]
check('xoá bài thử: danh sách sạch', not any(i.startswith('20990101-') for i in ids))

# ---------- 2. kho theme chung không đổi thì không ghi lại ----------
KC = '/home/claude/bug3/gdrive/My Drive/POLY Kho Theme/kho-theme-canva.json'
LOG = GOC + '/app-log.txt'
s, b, _ = req(APP, '/api/kho-chung', {"dua": True})
check('đưa kho chung lần 1: được', s == 200 and os.path.isfile(KC), (s, b[:200]))
m1 = os.stat(KC).st_mtime_ns; n_log = len(open(LOG, encoding='utf-8').read().splitlines())
time.sleep(1.1)
s, b, _ = req(APP, '/api/kho-chung', {"dua": True})
moi = open(LOG, encoding='utf-8').read().splitlines()[n_log:]
check('đưa lần 2 không đổi gì: KHÔNG ghi lại file trên Drive', s == 200 and os.stat(KC).st_mtime_ns == m1, moi)
check('log ghi "khong doi" (trước báo sai "10 moi")', any('khong doi' in x for x in moi), moi)
check('trạng thái kho: 0 mới', (J(b).get('dua') or {}).get('moi') == 0, J(b).get('dua'))
tc = GOC + '/theme-canva.json'; tc0 = open(tc, encoding='utf-8').read()
try:
    d = json.loads(tc0); kc = [t for t in d['ds'] if t.get('kc') and not t.get('may')]
    if kc:
        kc[0]['ten'] = kc[0]['ten'] + ' (đổi tên thử)'
        open(tc, 'w', encoding='utf-8').write(json.dumps(d, ensure_ascii=False, indent=1))
        time.sleep(1.1); n_log = len(open(LOG, encoding='utf-8').read().splitlines())
        s, b, _ = req(APP, '/api/kho-chung', {"dua": True})
        moi = open(LOG, encoding='utf-8').read().splitlines()[n_log:]
        k2 = json.load(open(KC, encoding='utf-8'))
        check('đổi tên 1 theme: ghi lại, có tên mới', os.stat(KC).st_mtime_ns != m1 and any('(đổi tên thử)' in x['ten'] for x in k2['ds']), moi)
        check('đổi tên (không thêm theme): log "0 moi"', any('(0 moi)' in x for x in moi), moi)
    else:
        print('   (máy thử chưa có theme Canva kho chung: bỏ qua thử đổi tên)')
finally:
    open(tc, 'w', encoding='utf-8').write(tc0)
req(APP, '/api/kho-chung', {"dua": True})

# ---------- 3. cổng máy con: gzip, font nhớ 1 ngày ----------
r = J(req(APP, '/api/chung', {"bat": True})[1])
for _ in range(20):
    r = J(req(APP, '/api/chung')[1])
    if r['chay']: break
    time.sleep(0.5)
HOST = r['url'].split('//')[1]
ma = J(req(APP, '/api/chung', {"ma_moi": True})[1])['ma']
s, b, _ = req(K, '/api/chung/vao', {"ma": ma, "ten": "Máy thử tối ưu"}, h={'Host': HOST})
TOK = J(b)['token']; T = {'Host': HOST, 'X-Poly-Khach': TOK}; TG = dict(T, **{'Accept-Encoding': 'gzip, deflate, br'})
s, thuong, h1 = req(K, '/', h={'Host': HOST})
s2, nen, h2 = req(K, '/', h={'Host': HOST, 'Accept-Encoding': 'gzip, deflate, br'})
check('máy con GET / có nhận gzip: trả gzip', s2 == 200 and h2.get('Content-Encoding') == 'gzip' and 'Accept-Encoding' in (h2.get('Vary') or ''), dict(h2))
check('giải nén ra đúng trang app', gzip.decompress(nen) == thuong, (len(nen), len(thuong)))
check('trang app nhỏ hơn ít nhất 3 lần', len(nen) * 3 < len(thuong), (len(nen), len(thuong)))
print('   (trang app %d KB -> %d KB)' % (len(thuong) // 1024, len(nen) // 1024))
check('máy con không nhận gzip: gửi nguyên như cũ', h1.get('Content-Encoding') is None and thuong[:15].lower().startswith(b'<!doctype'), dict(h1))
s, b, h = req(K, '/api/jobs', h=TG)
dj = gzip.decompress(b) if h.get('Content-Encoding') == 'gzip' else b
check('máy con /api/jobs: đọc được (lớn hơn 1,4KB thì nén)', s == 200 and 'jobs' in J(dj) and ((len(dj) > 1400) == (h.get('Content-Encoding') == 'gzip')), (s, len(dj), dict(h)))
s, b, h = req(K, '/api/theme-ps', h=TG)
check('máy con /api/theme-ps (~4KB): gzip, giải nén đúng 7 theme', s == 200 and h.get('Content-Encoding') == 'gzip' and len(J(gzip.decompress(b))['ds']) == 7, (s, dict(h)))
check('API vẫn no-store', h.get_all('Cache-Control') == ['no-store'], h.get_all('Cache-Control'))
s, b, h = req(K, '/api/chung/toi', h=TG)
check('trả lời nhỏ (< 1,4KB): không nén', s == 200 and h.get('Content-Encoding') is None and J(b)['khach'], (s, dict(h)))
font = sorted(glob.glob(GOC + '/ui/fonts/*.woff2'))[0].split('/ui/')[1]
s, b, h = req(K, '/ui/' + font, h=TG)
check('font qua cổng máy con: không nén lại, nhớ 1 ngày', s == 200 and h.get('Content-Encoding') is None and h.get_all('Cache-Control') == ['max-age=86400'], dict(h))
s, b, h = req(APP, '/ui/' + font)
check('font máy shop: nhớ 1 ngày', s == 200 and h.get_all('Cache-Control') == ['max-age=86400'], h.get_all('Cache-Control'))
s, b, h = req(APP, '/', h={'Accept-Encoding': 'gzip'})
check('máy shop (tại chỗ): trang app không nén, no-store như cũ', s == 200 and h.get('Content-Encoding') is None and h.get_all('Cache-Control') == ['no-store'], dict(h))
s, b, h = req(K, '/api/jobs', h={'Host': HOST, 'Accept-Encoding': 'gzip'})
check('máy con chưa vào (không mã): vẫn 401', s == 401, s)
req(APP, '/api/chung', {"bat": False})

print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
