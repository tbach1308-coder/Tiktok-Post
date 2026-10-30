# -*- coding: utf-8 -*-
"""Build giao dien app: dev/_index.src.html + dev/fonts.css -> ui/index.html, roi kiem cu phap JS bang node (neu co).

Dung:  python dev/build_ui.py            (chay o thu muc goc app, hoac goi tu bat ky dau)
Sua giao dien thi sua dev/_index.src.html, KHONG sua tay ui/index.html (lan build sau se de mat).
Trang dang mo tu tai lai khi ui/index.html doi (server tra "ui" = mtime trong /api/jobs).
"""
import io, os, re, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
src = io.open(os.path.join(HERE, "_index.src.html"), encoding="utf-8").read()
fonts = io.open(os.path.join(HERE, "fonts.css"), encoding="utf-8").read()
if "/*FONTS*/" not in src:
    sys.exit("LOI: _index.src.html phai co dong /*FONTS*/ (cho chen @font-face)")
out = src.replace("/*FONTS*/", fonts, 1)

js = "\n".join(re.findall(r"<script>(.*?)</script>", out, re.S))
node = shutil.which("node")
if node:
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as t:
        t.write(js)
    r = subprocess.run([node, "--check", t.name], capture_output=True, text=True)
    os.unlink(t.name)
    if r.returncode:
        sys.exit("LOI cu phap JS, chua ghi ui/index.html:\n" + r.stderr[-2000:])
else:
    print("(khong co node, bo qua kiem cu phap)")

dst = os.path.join(APP, "ui", "index.html")
io.open(dst, "w", encoding="utf-8", newline="\n").write(out)
print("OK", dst, len(out), "byte")
