# Nén log bài cũ (fen 14/11 12h13 "nén log bài cũ", chọn "Bỏ bản gốc, giữ bản nén"):
#  - bài xong / lỗi / dừng, lượt cuối xong quá N ngày: stream-N.jsonl -> stream-N.jsonl.gz, giải ra khớp từng byte, bản gốc bỏ
#  - bài mới xong / đang chạy: không đụng
#  - trang bài đọc lại y như trước (cả khi app còn nhớ bài, cả khi vừa khởi động lại); sổ hạn mức đọc đuôi log nén được
import json, time, urllib.request, urllib.error, os, gzip, subprocess, sys
APP = 'http://127.0.0.1:8790'
GOC = '/home/claude/bug3/tgl'; JOBS = GOC + '/jobs'
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
def cho_xong(jid):
    for _ in range(120):
        v = req('/api/job/' + jid)[1]
        if (v.get('job') or {}).get('status') in ('xong', 'loi', 'dung'): return v
        time.sleep(1)
    return v
def gon(v):      # phần trang bài đọc từ log (bỏ giờ đọc)
    return [(e['k'], e['x'], e['r']) for e in v.get('events') or []], v.get('final'), v.get('cost'), v.get('tasks')
def khoi_dong_lai():
    pid = int(open(GOC + '/srv.pid').read())
    try: os.kill(pid, 15)
    except OSError: pass
    time.sleep(1.5)
    p = subprocess.Popen([sys.executable, 'server.py'], cwd=GOC, stdout=open(GOC + '/srv.out', 'a'), stderr=subprocess.STDOUT, start_new_session=True)
    open(GOC + '/srv.pid', 'w').write(str(p.pid))
    for _ in range(40):
        try:
            if req('/api/ping')[1].get('ok'): return
        except Exception: pass
        time.sleep(0.3)

# 2 bài thật (Claude giả): 1 bài làm cũ đi 30 ngày, 1 bài để mới
a = req('/api/run', {"kenh": "laptop", "brief": "Bìa: NÉN LOG BÀI CŨ\nSlide 2: x"})[1]['id']
b = req('/api/run', {"kenh": "ipad", "brief": "Bìa: NÉN LOG BÀI MỚI\nSlide 2: y"})[1]['id']
va, vb = cho_xong(a), cho_xong(b)
check('2 bài thử xong', va['job']['status'] == 'xong' and vb['job']['status'] == 'xong', (va['job']['status'], vb['job']['status']))
truoc = gon(va)
check('trang bài có nội dung từ log', len(truoc[0]) > 3 and truoc[1], truoc[:2])
pj = os.path.join(JOBS, a, 'job.json')
j = json.load(open(pj, encoding='utf-8'))
for r in j['runs']:
    r['started'] -= 30 * 86400; r['ended'] -= 30 * 86400
json.dump(j, open(pj, 'w', encoding='utf-8'), ensure_ascii=False)
fa = os.path.join(JOBS, a, 'stream-1.jsonl'); fb = os.path.join(JOBS, b, 'stream-1.jsonl')
goc_a = open(fa, 'rb').read()
mt = os.stat(fa).st_mtime

# bài đang chạy (cũ cũng không nén)
c = req('/api/run', {"kenh": "laptop", "brief": "Bìa: CHAM bài đang chạy\nSlide 2: z"})[1]['id']

s, r = req('/api/nen-log', {"ngay": 20})
check('POST /api/nen-log nhận lệnh', s == 200 and r.get('bat'), r)
for _ in range(60):
    st = req('/api/nen-log')[1]
    if not st.get('dang') and st.get('kq'): break
    time.sleep(0.5)
kq = st.get('kq') or {}
check('nén xong, có kết quả', kq.get('file', 0) >= 1 and kq.get('loi') == 0, st)
check('bài cũ: còn bản .gz, bỏ bản gốc', os.path.exists(fa + '.gz') and not os.path.exists(fa))
check('không sót file tạm', not os.path.exists(fa + '.gz.tam'))
check('bản .gz giải ra khớp từng byte', gzip.open(fa + '.gz').read() == goc_a)
check('bản .gz giữ giờ sửa của log gốc', abs(os.stat(fa + '.gz').st_mtime - mt) < 1)
check('bản nén nhỏ hơn', os.path.getsize(fa + '.gz') < len(goc_a), (os.path.getsize(fa + '.gz'), len(goc_a)))
check('bài mới xong: không nén', os.path.exists(fb) and not os.path.exists(fb + '.gz'))
check('bài đang chạy: không nén', not any(x.endswith('.gz') for x in os.listdir(os.path.join(JOBS, c))))
lg = open(GOC + '/app-log.txt', encoding='utf-8', errors='replace').read().splitlines()
check('app-log ghi dòng nén log', any('nen log:' in x for x in lg[-30:]), lg[-5:])

# trang bài: app còn nhớ bài (đọc tới cuối file cũ) -> đọc bản nén không lặp sự kiện
sau1 = gon(req('/api/job/' + a)[1])
check('trang bài (app còn nhớ) y như trước nén', sau1 == truoc, (len(sau1[0]), len(truoc[0])))
check('job.json không đổi trạng thái', req('/api/job/' + a)[1]['job']['status'] == 'xong')

# khởi động lại: đọc từ bản nén
khoi_dong_lai()
sau2 = gon(req('/api/job/' + a)[1])
check('trang bài sau khởi động lại y như trước nén', sau2 == truoc, (len(sau2[0]), len(truoc[0]), sau2[1], truoc[1]))
check('danh sách bài vẫn có bài đã nén', any(x['id'] == a for x in req('/api/jobs')[1]['jobs']))

# chạy lại lần nữa: không nén lại / không lỗi
s, r = req('/api/nen-log', {"ngay": 20})
for _ in range(60):
    st = req('/api/nen-log')[1]
    if not st.get('dang') and st.get('t', 0) > time.time() - 30: break
    time.sleep(0.5)
check('chạy lại: không còn gì để nén', (st.get('kq') or {}).get('file') == 0 and (st.get('kq') or {}).get('loi') == 0, st)

# hàm đọc log (sổ hạn mức đọc đuôi log nén) + bài tiếp tục sau khi nén (lượt mới ghi file mới)
sys.path.insert(0, GOC)
os.chdir(GOC)
import importlib; srv = importlib.import_module('server')
duoi = srv.log_luot_duoi(fa, 5000)
check('log_luot_duoi đọc đuôi bản nén', duoi is not None and duoi == goc_a[-5000:].decode('utf-8', 'replace'))
check('log_luot_doc đọc bản nén', srv.log_luot_doc(fa) == goc_a)
check('log_luot_doc không có file -> None', srv.log_luot_doc(fa + '.khong') is None)
s, r = req('/api/job/%s/sua' % a, {"text": "đổi chữ bìa", "slides": [], "anh": []})
check('gửi sửa bài đã nén', s == 200, r)
if s == 200:
    time.sleep(1); v = cho_xong(a)
    check('bài đã nén sửa tiếp được (lượt mới)', v['job']['status'] == 'xong' and os.path.exists(os.path.join(JOBS, a, 'stream-2.jsonl')), v['job']['status'])
    check('trang bài có cả lượt cũ (nén) + lượt mới', len(gon(v)[0]) > len(truoc[0]))
req('/api/job/%s/dung' % c, {})
print('\n%d đạt, %d lỗi' % tuple(ok))
