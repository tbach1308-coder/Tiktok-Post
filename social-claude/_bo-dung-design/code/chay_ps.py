# Đưa script .jsx vào hàng chờ Photoshop tự chạy rồi CHỜ tới khi xong, in log bài.
# Dùng (chạy trên máy shop):
#   python chay_ps.py "<duong-dan-file.jsx>" "<thu-muc-bai>" vN [--cho 300]
# - Chép .jsx vào C:\Users\Dao\Pictures\PolySocial\_tu-chay\ (bộ poly-tu-chay.vbs nhặt sau ~5 giây)
# - Theo dõi _tu-chay\nhat-ky.txt tới khi có dòng "XONG <ten>" hoặc "LOI"
# - In <thu-muc-bai>\log\vN.log; mã thoát 0 = mọi slide "ok", 1 = có lỗi, 2 = quá giờ
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, os, time, shutil, argparse, re
Q = os.environ.get("POLY_TU_CHAY", r"C:\Users\Dao\Pictures\PolySocial\_tu-chay")
ap = argparse.ArgumentParser()
ap.add_argument('jsx'); ap.add_argument('bai'); ap.add_argument('ver')
ap.add_argument('--cho', type=int, default=300, help='giây chờ tối đa')
a = ap.parse_args()
ten = os.path.basename(a.jsx)
nk = os.path.join(Q, 'nhat-ky.txt'); hb = os.path.join(Q, 'dang-chay.txt')
if not os.path.exists(hb) or time.time() - os.path.getmtime(hb) > 30:
    print('CANH BAO: bo tu chay co ve chua bat (dang-chay.txt cu hon 30 giay). Mo Photoshop hoac chay tay poly-tu-chay.jsx 1 lan.')
dau = os.path.getsize(nk) if os.path.exists(nk) else 0
log = os.path.join(a.bai, 'log', a.ver + '.log')
log_cu = os.path.getmtime(log) if os.path.exists(log) else 0
shutil.copy2(a.jsx, os.path.join(Q, ten + '.tmp')); os.replace(os.path.join(Q, ten + '.tmp'), os.path.join(Q, ten))
print('Da dua vao hang cho:', ten); t0 = time.time(); kq = None
while time.time() - t0 < a.cho:
    time.sleep(3)
    if os.path.exists(nk) and os.path.getsize(nk) > dau:
        with open(nk, encoding='utf-8', errors='replace') as f:
            f.seek(dau); moi = f.read()
        for line in moi.splitlines():
            if ten in line and ('XONG' in line or 'LOI' in line):
                kq = line
    if kq: break
if not kq:
    print('QUA GIO: %d giay chua thay "XONG %s" trong nhat-ky.txt. Kiem tra Photoshop co hop thoai dang mo khong.' % (a.cho, ten)); sys.exit(2)
print(kq.strip(), '(%.0f giay)' % (time.time() - t0))
for _ in range(10):
    if os.path.exists(log) and os.path.getmtime(log) > log_cu: break
    time.sleep(1)
err = os.path.join(a.bai, 'log', 'error.txt')
noi = open(log, encoding='utf-8', errors='replace').read() if os.path.exists(log) else ''
print(noi)
if os.path.exists(err) and os.path.getmtime(err) >= t0 - 5: print(open(err, encoding='utf-8', errors='replace').read()); sys.exit(1)
sys.exit(1 if ('LOI' in kq or re.search(r'\bLOI\b', noi)) else 0)
