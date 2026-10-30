# -*- coding: utf-8 -*-
"""Giai ma anh lay tu trinh duyet (doan JS trong skill tra ve ###ten###WxH###base64).

Dung:  python3 giai-ma.py <file ket qua tool da luu> <thu muc ra>
Cau noi gioi han ~200k ky tu moi lan tra ve: lay 2 anh/lan, nen WebP 0.86-0.93.
"""
import json, base64, re, sys, os

src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
raw = open(src, encoding="utf-8").read()
try:
    txt = "".join(x.get("text", "") for x in json.loads(raw) if isinstance(x, dict))
except Exception:
    txt = raw
if "too large for the device bridge" in txt:
    print("CANH BAO: cau noi da cat bot - lay it anh hon moi lan")
n = 0
for m in re.finditer(r"###([A-Za-z0-9\-_]+)###(\d+x\d+)###([A-Za-z0-9+/=]+)", txt):
    name, size, b = m.groups()
    try:
        d = base64.b64decode(b)
    except Exception as e:
        print("LOI  %s: %s" % (name, e)); continue
    ext = ".webp" if d[:4] == b"RIFF" else ".png" if d[:4] == b"\x89PNG" else ".jpg"
    open(os.path.join(outdir, name + ext), "wb").write(d)
    print("OK   %s%s  %s  %d byte" % (name, ext, size, len(d))); n += 1
print("tong %d anh" % n)
