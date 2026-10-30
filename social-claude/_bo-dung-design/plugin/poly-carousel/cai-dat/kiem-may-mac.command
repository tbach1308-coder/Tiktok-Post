#!/bin/bash
# Kiểm MacBook cho plugin poly-carousel + app Poly Dựng Bài (bản Mac của kiem-may.bat + kiem-sau-cai.ps1).
# Nhấp đúp file này. Ghi kiem-may-mac.log cạnh file này (gửi Claude xem khi cần). Không cài, không sửa gì ngoài:
# thả 1 script kiểm font vào hàng chờ Photoshop (Photoshop chỉ đọc danh sách font, ghi kết quả ra kiem-font.txt)
# và dựng thử 1 script ra _bo-dung-design/out/ (chuyển vào _to_delete sau khi kiểm, không xoá).
# LƯU Ý: file này phải xuống dòng kiểu LF và có quyền chạy (chmod +x).

HERE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cd "$HERE/../../.." && pwd)"
GOC="${POLY_GOC:-$HOME/Social Claude}"
Q="${POLY_TU_CHAY:-$HOME/Pictures/PolySocial/_tu-chay}"
LOG="$HERE/kiem-may-mac.log"
exec > >(tee "$LOG") 2>&1
echo "=== KIEM MAY MAC $(date) ==="
echo "--- may"
sw_vers 2>/dev/null; uname -m
echo "--- python"
PY="$(command -v python3)"
echo "python3: $PY"
if [ -n "$PY" ] && { [ "$PY" != /usr/bin/python3 ] || xcode-select -p >/dev/null 2>&1; }; then
  "$PY" --version
  "$PY" -c "import PIL, numpy, scipy, cv2; print('thu vien anh ok')" 2>&1 | tail -n 1
else
  echo "chua co python3 (xcode-select --install)"; PY=""
fi
echo "--- node / git"
command -v node && node --version
command -v git && git --version
echo "--- claude"
CL="$(command -v claude)"
for c in "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" /opt/homebrew/bin/claude /usr/local/bin/claude; do
  [ -z "$CL" ] && [ -x "$c" ] && CL="$c"
done
echo "claude: ${CL:-khong thay}"
if [ -n "$CL" ]; then "$CL" --version 2>&1 | head -n 1; "$CL" plugin list 2>&1 | head -n 20; fi
echo "--- photoshop"
ls -d /Applications/Adobe\ Photoshop* 2>/dev/null || echo "khong thay Photoshop trong /Applications"
echo "--- thu muc"
for d in "$GOC" "$GOC/_bo-dung-design" "$GOC/_bo-dung-design/plugin/poly-carousel" "$GOC/Laptop" "$GOC/iPad" "$Q"; do
  if [ -d "$d" ]; then echo "co    $d"; else echo "THIEU $d"; fi
done
[ -f "$GOC/POLY-quy-tac-lam-content.md" ] && echo "co    file quy tac" || echo "THIEU $GOC/POLY-quy-tac-lam-content.md"
echo "--- hang cho Photoshop"
song=0
if [ -f "$Q/dang-chay.txt" ] && [ -n "$PY" ]; then
  tuoi="$("$PY" -c 'import os, sys, time; print(int(time.time() - os.path.getmtime(sys.argv[1])))' "$Q/dang-chay.txt")"
  echo "dang-chay.txt cap nhat $tuoi giay truoc"
  [ "$tuoi" -lt 30 ] && song=1
else
  echo "chua co dang-chay.txt"
fi
[ "$song" = 1 ] && echo "bo canh hang cho: DANG BAT" || echo "bo canh hang cho: CHUA BAT (mo app Poly Dung Bai la tu bat)"
[ -f "$Q/nhat-ky.txt" ] && tail -n 5 "$Q/nhat-ky.txt"

if [ -n "$PY" ] && [ -f "$KIT/code/build.py" ]; then
  echo "--- dung thu 1 script Laptop (khong chay Photoshop)"
  ( cd "$KIT" && "$PY" code/build.py slides/top5_25tr_slides.jsx T10_Top5Duoi25Tr_28-10 thu-kiem-may v0 1 2>&1 | tail -n 2 )
  if [ -f "$KIT/out/thu-kiem-may-v0.jsx" ]; then
    mkdir -p "$KIT/_to_delete"
    mv -f "$KIT/out/thu-kiem-may-v0.jsx" "$KIT/_to_delete/thu-kiem-may-v0.jsx"
  fi
fi

if [ "$song" = 1 ] && [ -n "$PY" ]; then
  echo "--- font trong Photoshop (cho toi da 3 phut, Photoshop dang tat thi tu mo)"
  KQ="$Q/kiem-font.txt"
  [ -f "$KQ" ] && mv -f "$KQ" "$Q/_da-chay/kiem-font-cu.txt"
  "$PY" - "$Q" "$KQ" <<'PYEOF'
import os, sys
q, kq = sys.argv[1], sys.argv[2]
def js(s):
    return "".join(c if 32 <= ord(c) < 127 and c not in '\\"' else ("\\" + c if c in '\\"' else "\\u%04X" % ord(c)) for c in s)
can = ["UTM-Cookies", "UTMAvoBold", "UTM-Avo", "UTMAvo-BoldItalic", "UTM-Alberta-Heavy", "SourceSerifRoman-Black",
       "SourceSerifRoman-Bold", "SourceSerifItalic-SemiboldItalic", "SourceSerifItalic-BoldItalic", "AppleColorEmoji"]
src = """#target photoshop
(function () {
  var CAN = %s, co = {};
  for (var i = 0; i < app.fonts.length; i++) { try { co[app.fonts[i].postScriptName] = 1; } catch (e) {} }
  var out = ["Photoshop " + app.version + " | " + $.os];
  for (var k = 0; k < CAN.length; k++) out.push((co[CAN[k]] ? "co     " : "THIEU  ") + CAN[k]);
  var f = new File("%s"); f.encoding = "UTF-8"; f.open("w"); f.write(out.join("\\n")); f.close();
})();
""" % ("[" + ", ".join('"%s"' % x for x in can) + "]", js(kq))
tmp = os.path.join(q, "kiem-font-mac.jsx.tmp")
open(tmp, "w", encoding="ascii").write(src)
os.replace(tmp, os.path.join(q, "kiem-font-mac.jsx"))
PYEOF
  for _ in $(seq 1 90); do [ -f "$KQ" ] && break; sleep 2; done
  if [ -f "$KQ" ]; then cat "$KQ"; echo; else echo "Photoshop chua tra ket qua. Xem $Q/nhat-ky.txt (dong LOI kiem-font-mac.jsx)."; tail -n 3 "$Q/nhat-ky.txt"; fi
  echo "(THIEU UTM / SourceSerif: cai font roi mo lai Photoshop. UTM-Alberta-Heavy, *-Bold, *-BoldItalic la font du phong, thieu cung duoc.)"
fi
echo "=== XONG === (nhat ky: $LOG)"
read -r -p "Bấm Enter để đóng cửa sổ này..." _
