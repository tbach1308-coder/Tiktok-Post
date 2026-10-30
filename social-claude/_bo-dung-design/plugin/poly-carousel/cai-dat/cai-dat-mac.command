#!/bin/bash
# Cài môi trường cho plugin poly-carousel + app Poly Dựng Bài trên MacBook (bản Mac của cai-dat.ps1 / cai-tu-dong.ps1).
# Nhấp đúp file này (Poly Dung Bai.command cũng tự gọi khi máy thiếu). Nhật ký: cai-dat-mac.log cạnh file này.
#  1. Python 3 (Command Line Tools của Apple) + thư viện ảnh pillow numpy scipy opencv-python (cài cho user, không hỏi mật khẩu)
#  2. Claude Code (hỏi trước khi cài, bản cài chính thức)
#  3. Bộ luật ~/Social Claude (chép từ thư mục chứa file này nếu chưa có) + hàng chờ Photoshop ~/Pictures/PolySocial/_tu-chay
#  4. Không bắt buộc, hỏi trước (mặc định Không): cài plugin vào Claude Code để gõ tay /poly-carousel:dung-bai trong Terminal.
#     App không cần bước này (app tự nạp plugin mỗi lượt). Bước này ghi vào ~/.claude theo cách cài plugin chuẩn của Claude Code.
# LƯU Ý: file này phải xuống dòng kiểu LF và có quyền chạy (chmod +x).

HERE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cd "$HERE/../../.." && pwd)"      # .../_bo-dung-design
SRC="$(cd "$KIT/.." && pwd)"             # thư mục Social Claude chứa file này
GOC="${POLY_GOC:-$HOME/Social Claude}"
Q="${POLY_TU_CHAY:-$HOME/Pictures/PolySocial/_tu-chay}"
LOG="$HERE/cai-dat-mac.log"
TU_APP=0
[ "$1" = "--tu-app" ] && TU_APP=1

exec > >(tee -a "$LOG") 2>&1
echo "=== CAI DAT MAC $(date) ==="

hoi() {   # hỏi c/k trong Terminal; $2 = c thì Enter là Có
  local tl
  printf "%s [c/k] " "$1"
  read -r tl
  case "$tl" in
    c|C|co|Co|có|Có|y|Y) return 0 ;;
    k|K|n|N|khong|không) return 1 ;;
    *) [ "$2" = c ] && return 0; return 1 ;;
  esac
}

find_python() {
  local c list
  if [ -n "${POLY_PYTHON+x}" ]; then list="$POLY_PYTHON"
  else list="$(command -v python3 2>/dev/null) /opt/homebrew/bin/python3 /usr/local/bin/python3 /Library/Frameworks/Python.framework/Versions/Current/bin/python3 /usr/bin/python3"
  fi
  for c in $list; do
    [ -x "$c" ] || continue
    if [ "$c" = /usr/bin/python3 ] && [ "$(uname)" = Darwin ] && ! xcode-select -p >/dev/null 2>&1; then continue; fi
    if "$c" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)' >/dev/null 2>&1; then
      echo "$c"; return 0
    fi
  done
  return 1
}

find_claude() {
  local c
  c="$(command -v claude 2>/dev/null)" && [ -n "$c" ] && { echo "$c"; return 0; }
  for c in "$HOME/.local/bin/claude" "$HOME/.claude/local/claude" /opt/homebrew/bin/claude /usr/local/bin/claude "$HOME/.npm-global/bin/claude"; do
    [ -x "$c" ] && { echo "$c"; return 0; }
  done
  return 1
}

ket_thuc() {
  echo "=== XONG $(date) ==="
  if [ "$TU_APP" = 0 ]; then read -r -p "Bấm Enter để đóng cửa sổ này..." _; fi
  exit "${1:-0}"
}

echo "== 1. Python =="
PY="$(find_python)"
if [ -z "$PY" ]; then
  echo "CHƯA CÓ PYTHON 3. Mac sẽ hiện hộp cài Command Line Tools: bấm Cài đặt (Install), chờ xong rồi nhấp đúp lại file này."
  xcode-select --install >/dev/null 2>&1
  ket_thuc 1
fi
"$PY" --version
# python trong môi trường ảo không cài --user được; Python của Homebrew chặn pip (externally-managed) -> thử lại có cờ
CO_USER="--user"
"$PY" -c 'import sys; sys.exit(0 if sys.prefix != getattr(sys, "base_prefix", sys.prefix) else 1)' && CO_USER=""
pip_cai() {
  local out code
  out="$("$PY" -m pip install $CO_USER --disable-pip-version-check "$@" 2>&1)"; code=$?
  if [ $code -ne 0 ] && echo "$out" | grep -q "externally-managed"; then
    out="$("$PY" -m pip install $CO_USER --break-system-packages --disable-pip-version-check "$@" 2>&1)"; code=$?
  fi
  echo "$out" | tail -n 3
  return $code
}
"$PY" -m pip --version >/dev/null 2>&1 || "$PY" -m ensurepip $CO_USER >/dev/null 2>&1
if "$PY" -c "import PIL, numpy, scipy, cv2" >/dev/null 2>&1; then
  echo "Thư viện ảnh: đã có"
else
  echo "Cài thư viện ảnh (vài phút)..."
  pip_cai --upgrade pip >/dev/null 2>&1
  pip_cai pillow numpy scipy opencv-python
fi
if "$PY" -c "import PIL, numpy, scipy, cv2; print('Thư viện ảnh: OK (pillow ' + PIL.__version__ + ', numpy ' + numpy.__version__ + ', opencv ' + cv2.__version__ + ')')"; then :
else
  echo "LỖI: chưa cài được thư viện ảnh. Chụp cửa sổ này gửi Claude."
fi

echo "== 2. Node.js (để kiểm cú pháp script Photoshop, không bắt buộc) =="
if command -v node >/dev/null 2>&1; then node --version; else echo "Chưa có Node.js: vẫn chạy được, chỉ bỏ qua bước kiểm cú pháp."; fi

echo "== 3. Claude Code =="
CL="$(find_claude)"
if [ -z "$CL" ]; then
  echo "Máy chưa có Claude Code (app cần Claude Code để viết brief, dựng bài)."
  if hoi "Cài Claude Code bản chính thức bây giờ (cần mạng, khoảng 1 phút)?" c; then
    curl -fsSL https://claude.ai/install.sh | bash
    CL="$(find_claude)"
  fi
fi
if [ -n "$CL" ]; then
  echo "Claude Code: $CL"
  "$CL" --version 2>&1 | head -n 1
  echo "Đăng nhập: mở app Poly Dựng Bài, bấm Đăng nhập ở góc trên (1 lần)."
else
  echo "CHƯA CÓ Claude Code. Cài theo hướng dẫn HUONG-DAN-MAC.txt rồi nhấp đúp lại file này."
fi

echo "== 4. Thư mục =="
if [ ! -d "$GOC/_bo-dung-design" ] && [ "$SRC" != "$GOC" ] && [ -d "$SRC/_bo-dung-design" ]; then
  mkdir -p "$GOC"
  for x in "$SRC"/*; do
    b="$(basename "$x")"
    [ -e "$GOC/$b" ] || cp -R "$x" "$GOC/"
  done
  echo "Đã chép bộ luật + bộ dựng vào $GOC"
fi
mkdir -p "$GOC/Laptop" "$GOC/iPad" "$GOC/Anh tai ve" "$Q/_da-chay"
if [ -d "$GOC/_bo-dung-design" ]; then echo "Bộ luật + bài: $GOC"; else echo "LỖI: $GOC chưa có _bo-dung-design"; fi
echo "Hàng chờ Photoshop: $Q"

echo "== 5. Photoshop =="
ps_app="$(ls -d /Applications/Adobe\ Photoshop*/Adobe\ Photoshop*.app 2>/dev/null | tail -n 1)"
if [ -n "$ps_app" ]; then echo "Có: $ps_app"; else echo "Chưa thấy Photoshop trong Ứng dụng (Applications): cài Photoshop bằng Creative Cloud."; fi
echo "Font cần cài (cài bằng Font Book hoặc bật trong Creative Cloud > Fonts): UTM Cookies, UTM Avo, UTM Avo Bold,"
echo "  Source Serif (Adobe Fonts: Roman Black, Italic Semibold). Kiểm trong Photoshop: nhấp đúp kiem-may-mac.command."

if [ "$TU_APP" = 0 ] && [ -n "$CL" ]; then
  echo "== 6. Plugin cho Claude Code gõ tay (không bắt buộc) =="
  echo "App Poly Dựng Bài không cần bước này. Chỉ cần khi fen muốn gõ /poly-carousel:dung-bai trong Terminal."
  if hoi "Cài plugin poly-carousel vào Claude Code (ghi vào ~/.claude)?" k; then
    "$CL" plugin marketplace add "$GOC/_bo-dung-design/plugin"
    "$CL" plugin install poly-carousel@poly-store
    "$CL" plugin list
  else
    echo "Bỏ qua."
  fi
fi
ket_thuc 0
