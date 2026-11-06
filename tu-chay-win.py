# -*- coding: utf-8 -*-
"""POLY STORE - bộ canh hàng chờ Photoshop cho máy Windows KHÁC máy shop (cài Poly Dựng Bài bằng file .exe).
Bản Windows của poly-tu-chay-mac.py (cùng cách làm): mỗi 3 giây xem thư mục hàng chờ (mặc định ~\\Pictures\\PolySocial\\_tu-chay),
có file .jsx đã để yên >= 3 giây thì chuyển sang _da-chay/<giờ>-<tên>, đổi đường dẫn máy shop trong file (E:/Social Claude,
E:/Tool/poly-dung-bai, C:/Users/Dao/...) sang đường dẫn máy này, rồi bảo Photoshop chạy file đó qua COM (cscript, như
poly-tu-chay.vbs của máy shop: không bấm, không gõ, Photoshop đang tắt thì Windows tự mở).
Nhật ký nhat-ky.txt giống máy shop: "BAT DAU  <tên>", "XONG  <tên>", "LOI  <tên>  <lý do>" (code/chay_ps.py đọc dòng này).
dang-chay.txt cập nhật 3 giây/lần khi bộ canh còn sống, dang-lam.txt khi Photoshop đang chạy 1 file. Chỉ 1 bản chạy.
App Poly Dựng Bài tự bật bộ canh này (và bật lại nếu tắt). Máy shop KHÔNG dùng file này (đã có poly-tu-chay.vbs).
Tham số: --hang-cho <thư mục>  --goc <thư mục Social Claude>  --app <thư mục app>  --mot-lan
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
HOME = os.path.expanduser("~")
ap = argparse.ArgumentParser()
ap.add_argument("--hang-cho", default=os.environ.get("POLY_TU_CHAY") or os.path.join(HOME, "Pictures", "PolySocial", "_tu-chay"))
ap.add_argument("--goc", default=os.path.join(HOME, "Social Claude"), help="thư mục Social Claude của máy này")
ap.add_argument("--app", default=HERE, help="thư mục app Poly Dựng Bài (đổi E:/Tool/poly-dung-bai)")
ap.add_argument("--mot-lan", action="store_true", help="chạy hết hàng chờ 1 lượt rồi thoát (thử)")
ap.add_argument("--nghi", type=float, default=3.0)
a = ap.parse_args()
Q = os.path.abspath(a.hang_cho)
D = os.path.join(Q, "_da-chay")
HB = os.path.join(Q, "dang-chay.txt")
LAM = os.path.join(Q, "dang-lam.txt")
NK = os.path.join(Q, "nhat-ky.txt")
os.makedirs(D, exist_ok=True)
CREATE_NO_WINDOW = 0x08000000
# bảng đổi đường dẫn máy shop -> máy này (dài trước), giống mac_bang() trong server.py của app; ghi dấu / trong .jsx
_g = lambda p: os.path.abspath(p).replace("\\", "/")
BANG = [("C:/Users/Dao/Pictures/PolySocial/_tu-chay", _g(Q)), ("E:/Tool/poly-dung-bai", _g(a.app)),
        ("E:/Social Claude", _g(a.goc)), ("C:/Users/Dao", _g(HOME))]


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


VBS = os.path.join(Q, "_da-chay", ".chay-photoshop.vbs")
VBS_NOI = (
    'On Error Resume Next\r\n'
    'Dim ps\r\n'
    'Set ps = CreateObject("Photoshop.Application")\r\n'
    'If Err.Number <> 0 Then\r\n'
    '  WScript.StdErr.Write "khong mo duoc Photoshop (may chua cai Photoshop?): " & Err.Description\r\n'
    '  WScript.Quit 2\r\n'
    'End If\r\n'
    'ps.DoJavaScriptFile WScript.Arguments(0)\r\n'
    'If Err.Number <> 0 Then\r\n'
    '  WScript.StdErr.Write Err.Description\r\n'
    '  WScript.Quit 1\r\n'
    'End If\r\n'
    'WScript.Quit 0\r\n')


def chay_photoshop(f):
    """Photoshop chạy file f qua COM (như ps.DoJavaScriptFile của poly-tu-chay.vbs máy shop). Trả (ok, lý do)."""
    try:
        if not os.path.isfile(VBS) or open(VBS, encoding="ascii", errors="replace").read() != VBS_NOI.replace("\r\n", "\n"):
            with open(VBS, "w", encoding="ascii", newline="") as fh:
                fh.write(VBS_NOI)
        r = subprocess.run(["cscript.exe", "//nologo", "//B", VBS, f], capture_output=True, text=True, timeout=7300,
                           creationflags=CREATE_NO_WINDOW)
    except Exception as e:
        return False, str(e)
    if r.returncode == 0:
        return True, ""
    return False, re.sub(r"\s+", " ", (r.stderr or r.stdout or "cscript loi %d" % r.returncode)).strip()[:400]


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
    import msvcrt
    lk = open(os.path.join(Q, ".poly-tu-chay-win.lock"), "a+")
    try:
        msvcrt.locking(lk.fileno(), msvcrt.LK_NBLCK, 1)
    except OSError:
        print("Da co 1 bo canh hang cho dang chay, thoat.")
        return 0
    ghi(os.path.join(Q, "poly-tu-chay-win.pid"), str(os.getpid()))
    threading.Thread(target=nhip, daemon=True).start()
    ghi_log("BO TU CHAY (WINDOWS MAY MOI) DA BAT  pid %d" % os.getpid())
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
