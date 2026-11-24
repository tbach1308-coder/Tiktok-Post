# fen 24/11 "kiểm tra app có lỗi gì ko" → chọn "Giữ POLYTool, app tự lo": hàng chờ Photoshop máy shop do POLYTool canh (không ghi ps=)
# -> app tự hỏi Photoshop có chạy không để ô Kiểm máy báo đúng; Photoshop tắt mà có bài (bắt đầu dựng / có .jsx chờ) thì app tự mở.
# Máy thử: Photoshop giả = file psgia/chay (có = đang chạy), chương trình mở giả psgia/mo-ps.sh. Chạy trên app thử vừa khởi động lại:
#   cd /home/claude/bug3 && POLY_PS_GIA=/home/claude/bug3/psgia/chay POLY_PS_EXE=/home/claude/bug3/psgia/mo-ps.sh POLY_PS_CHO=8 \
#     POLY_PS_LAI=20 bash reset.sh && python3 psmo.py
import json, os, stat, time, urllib.request
A = 'http://127.0.0.1:8790'; G = '/home/claude/bug3/tgl'; Q = G + '/tuchay'; P = '/home/claude/bug3/psgia'
CHAY, MOLOG, HONG = P + '/chay', P + '/mo.log', P + '/hong'
ok = [0, 0]


def check(n, c, x=''):
    ok[0 if c else 1] += 1
    print(('✓ ' if c else '✗ ') + n, '' if c else x)


def req(p, d=None):
    r = urllib.request.Request(A + p, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    try:
        return json.loads(urllib.request.urlopen(r, timeout=60).read())
    except urllib.error.HTTPError as e:
        return dict(json.loads(e.read() or b'{}'), _code=e.code)


def nhip(polytool=True, ps=None):
    os.makedirs(Q, exist_ok=True)
    with open(Q + '/dang-chay.txt', 'w', encoding='utf-8') as f:
        f.write(time.strftime('%d/%m/%Y %H:%M:%S') + (' polytool pid 4242\n' if polytool else '\n') + ('ps=%s\n' % ps if ps else ''))


def o_ps():
    return next((x for x in req('/api/health').get('san_sang') or [] if x.get('ma') == 'ps'), {})


def so_mo():
    return len(open(MOLOG).read().split()) if os.path.exists(MOLOG) else 0


def log_co(chu, tu):
    for l in open(G + '/app-log.txt', encoding='utf-8', errors='replace').read().splitlines()[-400:]:
        if chu in l and l[:19] >= tu:
            return l
    return ''


def cho(dk, n):
    for _ in range(n):
        if dk():
            return True
        time.sleep(1)
    return dk()


os.makedirs(P, exist_ok=True)
for f in (CHAY, MOLOG, HONG):
    if os.path.exists(f):
        os.remove(f)
for f in os.listdir(Q) if os.path.isdir(Q) else []:
    if f.endswith('.jsx'):
        os.remove(os.path.join(Q, f))
with open(P + '/mo-ps.sh', 'w') as f:
    f.write('#!/bin/sh\ndate +%%s >> %s\nsleep 2\n[ -e %s ] || touch %s\n' % (MOLOG, HONG, CHAY))
os.chmod(P + '/mo-ps.sh', 0o755)
# bài thử lần chạy trước dời ra chỗ khác (không thì bài mới bị giữ vì trùng tiêu đề bài cũ cùng máy)
import shutil
CU = G + '/_to_delete/psmo'
os.makedirs(CU, exist_ok=True)
for jid in os.listdir(G + '/jobs'):
    try:
        b = json.load(open(os.path.join(G, 'jobs', jid, 'job.json'), encoding='utf-8')).get('brief') or ''
    except Exception:
        continue
    if 'THỬ MỞ PHOTOSHOP' in b:
        shutil.move(os.path.join(G, 'jobs', jid), os.path.join(CU, jid))
t0 = time.strftime('%Y-%m-%d %H:%M:%S')

# 1) POLYTool + Photoshop đang chạy
open(CHAY, 'w').close(); nhip()
o = o_ps()
check('POLYTool + Photoshop mở: "đang bật (POLYTool) · Photoshop đang mở"', o.get('ok') and o.get('ghi') == 'đang bật (POLYTool) · Photoshop đang mở', o)
check('ô Kiểm máy ghi file app sẽ mở Photoshop (để soát)', o.get('exe') == P + '/mo-ps.sh', o)
# 2) Photoshop tắt (app nhớ 15 giây)
os.remove(CHAY); time.sleep(16); nhip()
o = o_ps()
check('POLYTool + Photoshop tắt: báo tắt, có bài là tự mở', o.get('ok') and 'Photoshop đang tắt, có bài là tự mở lên' in o.get('ghi', '') and 'POLYTool' in o.get('ghi', ''), o)
check('chưa có bài: app không tự mở Photoshop', so_mo() == 0)
# 3) bắt đầu dựng bài (Photoshop): mở Photoshop ngay, không chờ file .jsx
r = req('/api/run', {"kenh": "ipad", "brief": "Bìa: iPAD THỬ MỞ PHOTOSHOP %d\nSlide 2: x" % (time.time() % 100000)})
check('bắt đầu dựng bài: app tự mở Photoshop', r.get('id') and not r.get('cho_admin') and cho(lambda: so_mo() == 1, 10), (r, so_mo()))
check('Photoshop lên: nhật ký "app tu mo" + "da len sau"', cho(lambda: log_co('photoshop: da len sau', t0), 15) and log_co('-> app tu mo ' + P + '/mo-ps.sh', t0),
      log_co('photoshop:', t0))
time.sleep(16); nhip()
check('sau khi mở: ô Kiểm máy báo Photoshop đang mở', o_ps().get('ghi') == 'đang bật (POLYTool) · Photoshop đang mở', o_ps())
for _ in range(90):
    if (req('/api/job/' + r['id']).get('job') or {}).get('status') in ('xong', 'loi', 'dung'):
        break
    time.sleep(1)
# 4) có file .jsx chờ mà Photoshop tắt (vd tách nền bài Canva): vòng lịch 15 giây mở Photoshop
cho(lambda: False, max(0, 21 - 0))       # qua PS_LAI (20 giây) kể từ lần mở trước
os.remove(CHAY); nhip()
open(Q + '/thu-ps.jsx', 'w').write('// thu\n')
check('có .jsx chờ + Photoshop tắt: app mở Photoshop (vòng lịch)', cho(lambda: so_mo() == 2, 25), so_mo())
check('lý do trong nhật ký: có file .jsx chờ', log_co('photoshop: dang tat ma co bai (co file .jsx cho trong hang cho)', t0))
# 5) mở không lên (hộp đăng nhập Adobe…): không mở lại liên tục, báo lỗi rõ
cho(lambda: os.path.exists(CHAY), 10)
open(HONG, 'w').close(); os.remove(CHAY)
time.sleep(16)
check('trong 20 giây sau lần mở trước: không mở lại', so_mo() == 2, so_mo())
check('qua 20 giây: mở lại 1 lần', cho(lambda: so_mo() == 3, 20), so_mo())
time.sleep(12); nhip()
o = o_ps()
check('mở rồi mà không lên: ô Kiểm máy báo đỏ + lý do', not o.get('ok') and 'tự mở không được (đã mở Photoshop nhưng 1 phút chưa thấy lên' in o.get('ghi', ''), o)
check('nhật ký: chưa thấy lên', log_co('photoshop: mo roi ma 8 giay chua thay len', t0))
os.remove(Q + '/thu-ps.jsx'); os.remove(HONG)
# 6) bộ tự chạy cũ (poly-tu-chay.vbs) ghi ps=: app báo theo dòng đó, không tự đoán
open(CHAY, 'w').close(); nhip(polytool=False, ps='0')
o = o_ps()
check('bộ tự chạy cũ ghi ps=0: báo theo bộ đó (không tên POLYTool)', o.get('ghi') == 'đang bật · Photoshop đang tắt, có bài là tự mở lên', o)
nhip(polytool=False, ps='1')
check('bộ tự chạy cũ ghi ps=1: "đang bật"', o_ps().get('ghi') == 'đang bật', o_ps())
# 7) không có bộ canh hàng chờ (nhịp cũ): như cũ
os.utime(Q + '/dang-chay.txt', (time.time() - 300, time.time() - 300))
check('bộ canh hàng chờ chết: báo chưa mở như cũ', not o_ps().get('ok'), o_ps())
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
