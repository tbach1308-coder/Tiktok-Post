# Bộ tự chạy Photoshop máy shop (poly-tu-chay.vbs + lam-moi-tu-chay.vbs) chạy thật trong wine (fen 17/11 "fix lại kết nối photoshop"):
# Photoshop tắt mà có bài -> tự mở (Photoshop giả), báo đúng ps=0/1/loi, mở không được thì LOI rõ lý do, không mở lại liên tục,
# chỉ 1 bản chạy, làm mới bộ tự chạy (tắt bản cũ, bật bản mới). COM thật không có trong wine: ProgID giả -> "không nối được".
# Chạy: python3 dev/test/tuchay.py   (cần wine 64-bit + x86_64-w64-mingw32-gcc; ~2 phút)
import os, shutil, subprocess, time, re
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TC = os.path.join(REPO, 'social-claude', '_bo-dung-design', 'tu-chay')
PFX = '/tmp/claude-0/tuchay/pfx'
ENV = dict(os.environ, WINEPREFIX=PFX, WINEDEBUG='-all')
C = PFX + '/drive_c'
P = C + '/polythu'; Q = P + '/_tu-chay'; NK = Q + '/nhat-ky.txt'; HB = Q + '/dang-chay.txt'
WQ = r'C:\polythu\_tu-chay'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else str(x)[:600])
def nk():
    return open(NK, encoding='latin-1').read() if os.path.exists(NK) else ''
def hb():
    return open(HB, encoding='latin-1').read() if os.path.exists(HB) else ''
def cho(dk, giay=40):
    t = time.time()
    while time.time() - t < giay:
        if dk(): return True
        time.sleep(0.5)
    return False
def jsx(ten):
    p = os.path.join(Q, ten)
    open(p, 'w').write('#target photoshop\n// thu\n')
def wine(*a, bg=False):
    if bg:
        return subprocess.Popen(['wine'] + list(a), env=ENV, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return subprocess.run(['wine'] + list(a), env=ENV, capture_output=True, timeout=120)

# máy giả: Photoshop giả 2025 + 2026 (phải chọn 2026), hàng chờ trống
if not os.path.isdir(C):
    os.makedirs(os.path.dirname(PFX), exist_ok=True)
    subprocess.run(['wineboot', '-i'], env=ENV, capture_output=True, timeout=300)
subprocess.run(['wineserver', '-k'], env=ENV, capture_output=True)
shutil.rmtree(P, ignore_errors=True); os.makedirs(Q)
exe = '/tmp/claude-0/ps-gia.exe'
subprocess.run(['x86_64-w64-mingw32-gcc', '-O2', '-mwindows', '-o', exe, os.path.join(REPO, 'dev/test/tuchay/ps-gia.c')], check=True)
for nam in ('2025', '2026'):
    d = C + '/Program Files/Adobe/Adobe Photoshop %s' % nam
    os.makedirs(d, exist_ok=True); shutil.copy(exe, d + '/Photoshop.exe')
for f in ('poly-tu-chay.vbs', 'lam-moi-tu-chay.vbs'):
    shutil.copy(os.path.join(TC, f), P + '/' + f)
for f in ('poly-tu-chay.vbs', 'lam-moi-tu-chay.vbs', 'lam-moi-tu-chay.bat', 'lam-moi-qua-hang-cho.jsx'):
    b = open(os.path.join(TC, f), 'rb').read()
    check('%s: chỉ chữ ASCII, xuống dòng CRLF' % f, all(c < 128 for c in b) and b.count(b'\n') == b.count(b'\r\n'), f)

# wine không đọc được giờ sửa file (File.DateLastModified) -> /tuoiloi:999: coi mọi file là cũ (nhặt .jsx ngay; phần
# "chỉ 1 bản chạy" dựa giờ sửa dang-chay.txt nên không thử được ở đây, phần đó giữ nguyên như bản cũ đã chạy thật trên máy shop)
THAM = ['/q:' + WQ, '/progid:PolyThu.KhongCo', '/cho:20', '/san:2', '/nghi:500', '/tuoiloi:999']
w1 = wine('wscript', r'C:\polythu\poly-tu-chay.vbs', *THAM, bg=True)
check('bật: ghi BO TU CHAY DA BAT', cho(lambda: 'BO TU CHAY DA BAT' in nk()), nk())
check('Photoshop đang tắt: dang-chay.txt dòng 2 ps=0', cho(lambda: 'ps=0' in hb(), 10), hb())
jsx('a.jsx')
check('có bài mà Photoshop tắt: tự mở bản Photoshop mới nhất (2026)',
      cho(lambda: 'PHOTOSHOP DANG TAT - TU MO  C:\\Program Files\\Adobe\\Adobe Photoshop 2026\\Photoshop.exe' in nk()), nk())
check('Photoshop giả đã chạy (đúng file 2026)', cho(lambda: os.path.exists(P + '/ps-mo.txt') and '2026' in open(P + '/ps-mo.txt').read(), 10))
check('chờ Photoshop lên rồi mới chạy bài', cho(lambda: 'PHOTOSHOP DA MO' in nk() and 'BAT DAU  a.jsx' in nk()), nk())
L = nk().splitlines()
ia = [i for i, x in enumerate(L) if 'BAT DAU  a.jsx' in x]; im = [i for i, x in enumerate(L) if 'PHOTOSHOP DA MO' in x]
check('thứ tự: mở Photoshop xong rồi mới BAT DAU', ia and im and im[0] < ia[0], L)
check('không nối được COM: LOI a.jsx có lý do (đã thử nối lại 1 lần)', cho(lambda: re.search(r'LOI  a\.jsx  khong noi duoc Photoshop: \S', nk()) is not None, 20), nk())
check('bài đã chuyển sang _da-chay', not os.path.exists(Q + '/a.jsx') and any(f.endswith('-a.jsx') for f in os.listdir(Q + '/_da-chay')))
check('Photoshop đang mở: ps=1', cho(lambda: 'ps=1' in hb(), 10), hb())
jsx('b.jsx')
check('Photoshop đang mở thì không mở thêm, chạy bài luôn', cho(lambda: 'LOI  b.jsx' in nk(), 20) and nk().count('TU MO') == 1, nk())
check('không còn dang-lam.txt sau bài', cho(lambda: not os.path.exists(Q + '/dang-lam.txt'), 5))

wine('taskkill', '/f', '/im', 'Photoshop.exe')
check('Photoshop bị tắt: ps=0 lại', cho(lambda: 'ps=0' in hb(), 15), hb())

# làm mới bộ tự chạy: tắt bản cũ, bật bản mới (bản mới thử đường Photoshop không có)
shutil.copy(os.path.join(TC, 'poly-tu-chay.vbs'), P + '/moi.vbs')
# wine không đọc được dòng lệnh tiến trình khác -> /tattheoten:1 (tắt mọi wscript.exe; file làm mới chạy bằng cscript)
r = wine('cscript', '//nologo', r'C:\polythu\lam-moi-tu-chay.vbs', '/tattheoten:1', '/q:' + WQ, r'/g:C:\polythu\moi.vbs', r'/c:C:\polythu\poly-tu-chay.vbs',
         '/progid:PolyThu.KhongCo', '/cho:6', '/san:2', '/nghi:500', '/tuoiloi:999', r'/exe:C:\khong\co\Photoshop.exe', bg=True)
r.wait(60)   # bản mới bật kèm giữ ống ra của wine: không đọc ra, chỉ chờ file làm mới thoát
check('làm mới: tắt 1 bản cũ, ghi dấu cho file .jsx', 'LAM MOI BO TU CHAY (tat 1 ban cu)' in nk() and os.path.exists(Q + '/_da-chay/.lam-moi-xong.txt'), nk()[-400:])
check('bản cũ đã tắt', cho(lambda: w1.poll() is not None, 10), w1.poll())
check('bật bản mới', cho(lambda: nk().count('BO TU CHAY DA BAT') == 2, 20), nk()[-400:])
jsx('c.jsx')
check('mở Photoshop không được: KHONG TU MO DUOC + LOI c.jsx rõ lý do',
      cho(lambda: 'KHONG TU MO DUOC PHOTOSHOP: khong thay C:\\khong\\co\\Photoshop.exe' in nk() and 'LOI  c.jsx  Photoshop dang tat, tu mo khong duoc' in nk(), 30), nk()[-600:])
check('ps=loi để app báo fen mở Photoshop', cho(lambda: 'ps=loi' in hb(), 10), hb())
jsx('d.jsx')
check('vừa mở không được (< 2 phút): báo lỗi ngay, không thử mở lại', cho(lambda: 'LOI  d.jsx  Photoshop dang tat, vua tu mo khong duoc' in nk(), 20) and nk().count('KHONG TU MO DUOC') == 1, nk()[-600:])
check('Photoshop giả không bị mở thêm lần nào', open(P + '/ps-mo.txt').read().count('\n') == 1)
subprocess.run(['wineserver', '-k'], env=ENV, capture_output=True)
print('ĐẠT %d / %d' % (ok[0], sum(ok)))
raise SystemExit(1 if ok[1] else 0)
