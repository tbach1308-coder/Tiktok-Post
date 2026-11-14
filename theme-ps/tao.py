# Tạo theme.jsx cho từng theme Photoshop trong theme-ps/ (fen 12/11): THEME = <theme.json> + động cơ _dong-co.jsx (+ _ve-tay.jsx nếu "ve_tay": true).
#   python theme-ps/tao.py            (chạy lại mỗi khi sửa theme.json hoặc _dong-co.jsx)
import io
import json
import os

D = os.path.dirname(os.path.abspath(__file__))
dong_co = io.open(os.path.join(D, "_dong-co.jsx"), encoding="utf-8").read()
ve_tay = io.open(os.path.join(D, "_ve-tay.jsx"), encoding="utf-8").read()     # chu thich ve tay: chi theme co "ve_tay": true (fen 14/11 15h24)
for ten in sorted(os.listdir(D)):
    p = os.path.join(D, ten, "theme.json")
    if not os.path.isfile(p):
        continue
    t = json.load(io.open(p, encoding="utf-8"))
    js = "// theme.jsx tự tạo bằng theme-ps/tao.py - sửa theme.json / _dong-co.jsx rồi chạy lại, đừng sửa tay\n"
    js += "var THEME = " + json.dumps(t, ensure_ascii=False, indent=1) + ";\n" + dong_co
    if t.get("ve_tay"):
        js += "\n" + ve_tay
    io.open(os.path.join(D, ten, "theme.jsx"), "w", encoding="utf-8", newline="\n").write(js)
    print("ok", ten)
