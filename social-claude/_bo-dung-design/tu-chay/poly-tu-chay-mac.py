# -*- coding: utf-8 -*-
"""POLY STORE - bộ canh hàng chờ Photoshop trên MAC (bản Mac của poly-tu-chay.vbs máy shop).

Mỗi 3 giây xem thư mục hàng chờ (mặc định ~/Pictures/PolySocial/_tu-chay): có file .jsx đã để yên >= 3 giây thì
chuyển sang _da-chay/<giờ>-<tên>, đổi đường dẫn máy shop trong file (E:/Social Claude, E:/Tool/poly-dung-bai,
C:/Users/Dao/...) sang đường dẫn Mac, rồi bảo Photoshop chạy file đó bằng AppleScript (do javascript, chạy nền:
không bấm, không gõ, không đưa Photoshop lên trước; Photoshop đang tắt thì macOS tự mở, như COM trên Windows).
Kết quả ghi nhat-ky.txt giống hệt bản Windows: "BAT DAU  <tên>", "XONG  <tên>", "LOI  <tên>  <lý do>"
(code/chay_ps.py đọc dòng này). dang-chay.txt cập nhật 3 giây/lần khi bộ canh còn sống, dang-lam.txt khi
Photoshop đang chạy 1 file. Chỉ 1 bản chạy (khoá file .poly-tu-chay-mac.lock).

App Poly Dựng Bài tự bật bộ canh này (và bật lại nếu tắt). Dùng Claude Code gõ tay không mở app thì chạy:
  python3 "<Social Claude>/_bo-dung-design/tu-chay/poly-tu-chay-mac.py"
Tham số: --hang-cho <thư mục>  --goc <thư mục Social Claude>  --app <thư mục app>  --photoshop "<tên app>"  --mot-lan
Lần đầu macOS hỏi "... muốn điều khiển Adobe Photoshop": bấm OK (Cài đặt hệ thống > Quyền riêng tư > Tự động hoá).
Chỉ dùng thư viện chuẩn Python 3.8+.
"""
import argparse
import os
import re
import subprocess
import sys
import threading
import time

HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument("--hang-cho", default=os.environ.get("POLY_TU_CHAY") or os.path.expanduser("~/Pictures/PolySocial/_tu-chay"))
ap.add_argument("--goc", default=os.path.dirname(os.path.dirname(HERE)), help="thư mục Social Claude (mặc định: 2 cấp trên file này)")
ap.add_argument("--app", default="", help="thư mục app Poly Dựng Bài (đổi E:/Tool/poly-dung-bai)")
ap.add_argument("--photoshop", default=os.environ.get("POLY_PHOTOSHOP") or "", help='vd "Adobe Photoshop 2025"; trống = app id com.adobe.Photoshop')
ap.add_argument("--mot-lan", action="store_true", help="chạy hết hàng chờ 1 lượt rồi thoát (thử)")
ap.add_argument("--nghi", type=float, default=3.0)
a = ap.parse_args()

Q = os.path.abspath(os.path.expanduser(a.hang_cho))
D = os.path.join(Q, "_da-chay")
HB = os.path.join(Q, "dang-chay.txt")
LAM = os.path.join(Q, "dang-lam.txt")
NK = os.path.join(Q, "nhat-ky.txt")
os.makedirs(D, exist_ok=True)

# bảng đổi đường dẫn máy shop -> Mac (dài trước), giống mac_bang() trong server.py của app
BANG = [("C:/Users/Dao/Pictures/PolySocial/_tu-chay", Q)]
if a.app:
    BANG.append(("E:/Tool/poly-dung-bai", os.path.abspath(os.path.expanduser(a.app))))
BANG += [("E:/Social Claude", os.path.abspath(os.path.expanduser(a.goc))), ("C:/Users/Dao", os.path.expanduser("~"))]


def ghi_log(s):
    with open(NK, "a", encoding="utf-8") as f:
        f.write(time.strftime("%d/%m/%Y %H:%M:%S") + "  " + s + "\n")


def ghi(p, s):
    with open(p, "w", encoding="utf-8") as f:
        f.write(s)


def js_chuoi(s):
    """Chuỗi JS an toàn trong file .jsx ASCII (build.py đổi chữ Việt sang \\uXXXX, ở đây cũng vậy)."""
    out = []
    for ch in s:
        o = ord(ch)
        if ch in "\\\"'":
            out.append("\\" + ch)
        elif 32 <= o < 127:
            out.append(ch)
        elif o > 0xFFFF:
            o -= 0x10000
            out.append("\\u%04X\\u%04X" % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
        else:
            out.append("\\u%04X" % o)
    return "".join(out)


_RE = []
for win, mac in BANG:
    p = win.split("/")
    sep = r"(?:\\\\|\\|/)+"      # trong file .jsx: "E:\\Social Claude" (\\ là 1 dấu \), "E:/Social Claude", "/e/Social Claude"
    goc = re.escape(p[0]) + sep + sep.join(re.escape(x) for x in p[1:])
    uri = "/" + re.escape(p[0][0]) + sep + sep.join(re.escape(x) for x in p[1:])
    _RE.append((re.compile(r"(?:(?<![\w/\\])%s|(?<=[\"'])%s)(?![\w-])([^\"'\r\n]*)" % (goc, uri), re.I), mac))


def doi_duong_dan(src):
    """Đổi gốc đường dẫn máy shop trong mã .jsx; phần sau gốc (tới hết chuỗi) đổi \\\\ thành /. Trả (mã mới, số chỗ đổi)."""
    n = [0]

    def thay(mac):
        def f(m):
            n[0] += 1
            return js_chuoi(mac.rstrip("/")) + m.group(1).replace("\\\\", "/")
        return f

    for r, mac in _RE:
        src = r.sub(thay(mac), src)
    return src, n[0]


AS = ['on run argv', 'with timeout of 7200 seconds',
      ('tell application %s to do javascript (item 1 of argv) show debugger never' %
       ('"%s"' % a.photoshop.replace('"', '') if a.photoshop else 'id "com.adobe.Photoshop"')),
      'end timeout', 'end run']


def chay_photoshop(f):
    """Photoshop chạy file f (như ps.DoJavaScriptFile của bản Windows). Trả (ok, lý do)."""
    # trả về 1 chuỗi: giá trị cuối của script là đối tượng Photoshop thì AppleScript có thể báo lỗi đổi kiểu dù script đã chạy xong
    js = '$.evalFile(new File("%s"));\n"XONG";' % js_chuoi(f)
    cmd = ["osascript"]
    for x in AS:
        cmd += ["-e", x]
    try:
        r = subprocess.run(cmd + [js], capture_output=True, text=True, timeout=7300)
    except Exception as e:
        return False, str(e)
    if r.returncode == 0:
        return True, ""
    loi = re.sub(r"\s+", " ", (r.stderr or r.stdout or "osascript loi %d" % r.returncode)).strip()
    if "-1743" in loi or "Not authorized" in loi:
        loi += " (chua cho phep dieu khien Photoshop: Cai dat he thong > Quyen rieng tu & Bao mat > Tu dong hoa)"
    return False, loi[:400]


def nhip():
    while True:
        try:
            ghi(HB, time.strftime("%d/%m/%Y %H:%M:%S") + " pid %d\n" % os.getpid())
        except Exception:
            pass
        time.sleep(a.nghi)


def file_cho():
    best = None
    for fn in os.listdir(Q):
        p = os.path.join(Q, fn)
        if not fn.lower().endswith(".jsx") or not os.path.isfile(p):
            continue
        mt = os.path.getmtime(p)
        if time.time() - mt >= 3 and (best is None or mt < best[0]):
            best = (mt, p, fn)
    return best


def chay_1(best):
    _, p, nm = best
    dest = os.path.join(D, time.strftime("%Y%m%d-%H%M%S") + "-" + nm)
    os.replace(p, dest)
    ghi_log("BAT DAU  " + nm)
    ghi(LAM, time.strftime("%d/%m/%Y %H:%M:%S") + "  " + nm + "\n")
    try:
        raw = open(dest, "rb").read()
        try:
            src, enc = raw.decode("utf-8"), "utf-8"
        except UnicodeDecodeError:
            src, enc = raw.decode("latin-1"), "latin-1"
        moi, n = doi_duong_dan(src)
        if n:
            with open(dest + ".goc", "wb") as f:   # bản gốc để soi khi cần (không xoá gì)
                f.write(raw)
            with open(dest, "w", encoding=enc, newline="") as f:
                f.write(moi)
        ok, loi = chay_photoshop(dest)
        ghi_log(("XONG  " + nm) if ok else ("LOI  " + nm + "  " + loi))
    except Exception as e:
        ghi_log("LOI  " + nm + "  " + re.sub(r"\s+", " ", str(e))[:300])
    finally:
        try:
            os.replace(LAM, os.path.join(D, ".dang-lam-cu.txt"))   # như bản Windows bỏ dang-lam.txt, nhưng không xoá hẳn
        except OSError:
            pass


def main():
    import fcntl
    lk = open(os.path.join(Q, ".poly-tu-chay-mac.lock"), "w")
    try:
        fcntl.flock(lk, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError:
        print("Da co 1 bo canh hang cho dang chay, thoat.")
        return 0
    ghi(os.path.join(Q, "poly-tu-chay-mac.pid"), str(os.getpid()))
    threading.Thread(target=nhip, daemon=True).start()
    ghi_log("BO TU CHAY (MAC) DA BAT  pid %d" % os.getpid())
    while True:
        best = file_cho()
        if best:
            chay_1(best)
            continue
        if a.mot_lan:
            return 0
        time.sleep(a.nghi)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        pass
