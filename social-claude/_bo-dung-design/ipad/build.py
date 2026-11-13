# -*- coding: utf-8 -*-
"""Ghep thu vien + phan slide cua bai thanh 1 file .jsx chay duoc trong Photoshop.

Dung (tren may shop):
  python "E:/Social Claude/_bo-dung-design/ipad/build.py" "<thu muc bai>" "<bai>/tai-nguyen/script/bai.part.jsx" "E:/Social Claude/_bo-dung-design/out/<ten>-vN.jsx" [--only 3,4] [--theme "<app>/theme-ps/<id>/theme.jsx"]
  roi: python "E:/Social Claude/_bo-dung-design/code/chay_ps.py" "<file .jsx>" "<thu muc bai>" vN   (ketThuc("vN.log") de chay_ps doc dung log)

- Thu vien poly-lib.jsx nam canh file nay.
- File nguon viet chu Viet binh thuong; o day doi het sang \\uXXXX (quy tac 4c).
- --only de dung lai rieng vai slide (nhanh hon nhieu so voi ca bo).
"""
import io, os, sys, argparse, shutil, subprocess, tempfile

ap = argparse.ArgumentParser()
ap.add_argument("bai", help='vd: "E:/Social Claude/iPad/T10_PinTutNhanh_26-10"')
ap.add_argument("part")
ap.add_argument("out")
ap.add_argument("--only", default="", help="vd: 3,4")
ap.add_argument("--theme", default="", help="theme Photoshop (app Poly Dung Bai: theme-ps/<id>/theme.jsx), ghep sau thu vien")
a = ap.parse_args()

here = os.path.dirname(os.path.abspath(__file__))
lib = io.open(os.path.join(here, "poly-lib.jsx"), encoding="utf-8").read()
part = io.open(a.part, encoding="utf-8").read()

bai = a.bai.replace("\\", "/").rstrip("/")
only = "[" + ", ".join(x.strip() for x in a.only.split(",") if x.strip()) + "]"
for bad in ("var ONLY", "var BAI", "#target"):
    if bad in part:
        sys.exit("LOI: file slide khong duoc tu khai '%s' - build.py lo phan nay" % bad)
if "ketThuc(" not in part:
    sys.exit("LOI: file slide phai ket thuc bang ketThuc(\"ten-log.txt\")")

theme = ""
if a.theme:
    if not os.path.isfile(a.theme):
        sys.exit("LOI: khong thay file theme: " + a.theme)
    # THEME_DIR: thu muc theme (anh rieng cua theme, vd anh tiem ve tay: <theme>/anh/*.jpg) - fen 13/11
    theme = 'var THEME_DIR = "%s";\n' % os.path.dirname(os.path.abspath(a.theme)).replace("\\", "/") + io.open(a.theme, encoding="utf-8").read() + "\nRUN += THEME_LOG;\n"
jsx = '#target photoshop\nvar BAI = "%s";\nvar ONLY = %s;\n' % (bai, only) + lib + "\n" + theme + "\n" + part


def esc(s):
    out = []
    for ch in s:
        o = ord(ch)
        if o < 128:
            out.append(ch)
        elif o > 0xFFFF:
            o -= 0x10000
            out.append("\\u%04X\\u%04X" % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
        else:
            out.append("\\u%04X" % o)
    return "".join(out)


jsx = esc(jsx)
assert all(ord(c) < 128 for c in jsx)
io.open(a.out, "w", encoding="ascii").write(jsx)

# kiem cu phap bang node neu co (bo dong #target)
if shutil.which("node"):
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as t:
        t.write(jsx.split("\n", 1)[1])
    r = subprocess.run(["node", "--check", t.name], capture_output=True, text=True)
    os.unlink(t.name)
    if r.returncode:
        sys.exit("LOI CU PHAP:\n" + r.stderr[-1500:])
print("OK  %s  (%d ky tu, ONLY=%s%s)" % (a.out, len(jsx), only, ", theme " + os.path.basename(os.path.dirname(a.theme)) if a.theme else ""))
