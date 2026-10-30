# -*- coding: utf-8 -*-
"""Nghiem thu ca bo trong MOT lenh.

Dung:  python nghiem-thu.py "<thu muc bai>" [ten-log.txt]   (chay thang tren may shop)
In ra: log (canh bao khoang cach am / thieu XONG), loi le-vung an toan tung slide,
clipping vo tinh trong PSD (neu PSD da stage ve + co psd-tools), va duong dan bang anh tong.
"""
import sys, os, glob, re, importlib.util, warnings
from PIL import Image, ImageDraw

D = sys.argv[1].rstrip("/") + "/"
here = os.path.dirname(os.path.abspath(__file__))
loi = 0

# 1) log
logs = sorted(glob.glob(D + "log/*.txt"), key=os.path.getmtime)
if len(sys.argv) > 2:
    logs = [D + "log/" + sys.argv[2]]
if logs:
    t = open(logs[-1], encoding="utf-8").read()
    print("== LOG", os.path.basename(logs[-1]))
    print(t.strip())
    if "XONG" not in t:
        print("!! log chua co XONG - script chua chay xong hoac da loi"); loi += 1
    for m in re.finditer(r"(\d\d) khoang cach deu: (-?\d+)px", t):
        if int(m.group(2)) < 20:
            print("!! slide %s khoang cach %spx - khoi do sai (dung o y=0? anh bi clipping?)" % m.groups()); loi += 1

# 2) le, vung an toan, khoang cach
spec = importlib.util.spec_from_file_location("kt", os.path.join(here, "kiem-tra-slide.py"))
kt = importlib.util.module_from_spec(spec); spec.loader.exec_module(kt)
fs = sorted(glob.glob(D + "slide-*.png"))
print("\n== VUNG AN TOAN")
for f in fs:
    l, c = kt.check(f)
    loi += len(l)
    tag = "OK  " if not l else "LOI "
    print(tag, os.path.basename(f), " | ".join(l + c) if (l or c) else "")

# 3) clipping vo tinh trong PSD
psds = sorted(glob.glob(D + "slide-*.psd"))
if psds:
    try:
        warnings.filterwarnings("ignore")
        from psd_tools import PSDImage
        print("\n== CLIPPING TRONG PSD")
        for p in psds:
            bad = [l.name for l in PSDImage.open(p) if l.clipping]
            print(("OK  " if not bad else "LOI "), os.path.basename(p), ", ".join(bad))
            loi += bool(bad)
    except ImportError:
        print("(bo qua kiem PSD: chua cai psd-tools -> pip install --break-system-packages psd-tools)")

# 4) bang anh tong
if fs:
    cw, ch = 300, 400
    s = Image.new("RGB", (len(fs) * (cw + 10) + 10, ch + 34), (22, 22, 22)); d = ImageDraw.Draw(s)
    for i, f in enumerate(fs):
        s.paste(Image.open(f).convert("RGB").resize((cw, ch)), (10 + i * (cw + 10), 28))
        d.text((10 + i * (cw + 10), 9), os.path.basename(f), fill=(190, 255, 190))
    out = os.path.join(D, "log", "bang-anh-tong.png")   # ghi canh bai (may shop khong co /tmp)
    s.save(out)
    print("\nBang anh tong:", out)
print("\nTONG: %d loi" % loi)
