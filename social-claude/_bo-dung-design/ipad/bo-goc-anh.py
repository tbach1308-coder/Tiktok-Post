# -*- coding: utf-8 -*-
"""Cat anh vua dung khung the + bo goc san (trong suot) -> dat vao Photoshop KHONG can clipping.

Dung:  python3 bo-goc-anh.py <anh vao> <anh ra.png> <rong> <cao> <bo goc> [cx cy]
  rong/cao/bo goc tinh theo PIXEL TREN CANVAS; file ra dung o 2x cho net.
  cx, cy (0..1): diem giu lai khi cat, mac dinh 0.5 0.5 (giua).
Vd the 348x312 bo goc 24:  python3 bo-goc-anh.py a.jpg a-r.png 348 312 24
"""
import sys
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
W, H, R = (int(x) * 2 for x in sys.argv[3:6])
cx = float(sys.argv[6]) if len(sys.argv) > 6 else 0.5
cy = float(sys.argv[7]) if len(sys.argv) > 7 else 0.5
im = Image.open(src).convert("RGB")
s = max(W / im.width, H / im.height)
im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
x, y = round((im.width - W) * cx), round((im.height - H) * cy)
im = im.crop((x, y, x + W, y + H))
m = Image.new("L", (W * 4, H * 4), 0)
ImageDraw.Draw(m).rounded_rectangle((0, 0, W * 4 - 1, H * 4 - 1), radius=R * 4, fill=255)
r = im.convert("RGBA"); r.putalpha(m.resize((W, H), Image.LANCZOS)); r.save(out)
print("OK", out, r.size)
