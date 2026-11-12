# Tạo theme.jsx cho từng theme Photoshop trong theme-ps/ (fen 12/11): THEME = <theme.json> + động cơ _dong-co.jsx.
#   python theme-ps/tao.py            (chạy lại mỗi khi sửa theme.json hoặc _dong-co.jsx)
import io
import json
import os

D = os.path.dirname(os.path.abspath(__file__))
dong_co = io.open(os.path.join(D, "_dong-co.jsx"), encoding="utf-8").read()
for ten in sorted(os.listdir(D)):
    p = os.path.join(D, ten, "theme.json")
    if not os.path.isfile(p):
        continue
    t = json.load(io.open(p, encoding="utf-8"))
    js = "// theme.jsx tự tạo bằng theme-ps/tao.py - sửa theme.json / _dong-co.jsx rồi chạy lại, đừng sửa tay\n"
    js += "var THEME = " + json.dumps(t, ensure_ascii=False, indent=1) + ";\n" + dong_co
    io.open(os.path.join(D, ten, "theme.jsx"), "w", encoding="utf-8", newline="\n").write(js)
    print("ok", ten)
