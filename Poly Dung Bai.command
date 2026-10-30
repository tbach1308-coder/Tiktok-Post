#!/bin/bash
# POLY STORE - mở app Poly Dựng Bài trên MacBook: nhấp đúp file này trong Finder (bản Mac của "Poly Dung Bai.vbs").
# Chạy máy chủ nhỏ server.py (chỉ trên máy này) ở http://127.0.0.1:8777 rồi mở app trong cửa sổ Chrome riêng
# (hồ sơ riêng _chrome, tiếng Việt, tắt tự dịch). Không có Chrome thì mở bằng trình duyệt mặc định.
# Máy chủ chạy ngầm: đóng cửa sổ Terminal này được, bài đang chạy vẫn chạy. Tắt hẳn: nhấp đúp "Tat Poly Dung Bai.command".
# Lần đầu: app tự chép bộ luật thành ~/Social Claude, tự tạo hàng chờ Photoshop ~/Pictures/PolySocial/_tu-chay.
# Thiếu Python / thư viện ảnh / Claude Code thì hỏi rồi chạy bộ cài cai-dat-mac.command.
# LƯU Ý: file này phải xuống dòng kiểu LF và có quyền chạy (chmod +x), không thì Finder không mở được.

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR" || exit 1
mkdir -p "$DIR/_mac"
LOG="$DIR/_mac/server-out.log"
PIDF="$DIR/_mac/server.pid"
CAI="$DIR/social-claude/_bo-dung-design/plugin/poly-carousel/cai-dat/cai-dat-mac.command"
[ -f "$CAI" ] || CAI="$HOME/Social Claude/_bo-dung-design/plugin/poly-carousel/cai-dat/cai-dat-mac.command"

# Hộp thông báo của Mac (chữ truyền qua tham số để không vỡ dấu). In ra nút được bấm.
dialog() {
  osascript -e 'on run argv' \
    -e 'set r to display dialog (item 1 of argv) with title "Poly Dựng Bài" buttons (rest of argv) default button (count of (rest of argv)) with icon caution' \
    -e 'return button returned of r' -e 'end run' "$@" 2>/dev/null
}

# python3 dùng được (3.8 trở lên): PATH, Homebrew, python.org, của Apple
find_python() {
  local c list
  if [ -n "${POLY_PYTHON+x}" ]; then list="$POLY_PYTHON"
  else list="$(command -v python3 2>/dev/null) /opt/homebrew/bin/python3 /usr/local/bin/python3 /Library/Frameworks/Python.framework/Versions/Current/bin/python3 /usr/bin/python3"
  fi
  for c in $list; do
    [ -x "$c" ] || continue
    # /usr/bin/python3 của Apple khi chưa cài Command Line Tools chỉ bật hộp cài: bỏ qua, tự báo bên dưới
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

PY="$(find_python)"
if [ -z "$PY" ]; then
  echo "Chưa có Python 3."
  b="$(dialog "Máy Mac này chưa có Python 3 (app Poly Dựng Bài cần, cài 1 lần).

Bấm \"Cài Python\": Mac hiện hộp cài Command Line Tools, bấm Cài đặt (Install) và chờ xong (vài phút). Xong thì nhấp đúp lại Poly Dung Bai.command." "Để sau" "Cài Python")"
  if [ "$b" = "Cài Python" ]; then xcode-select --install >/dev/null 2>&1; fi
  exit 1
fi

PORT="$("$PY" -c 'import json, sys
try:
    print(int(json.load(open(sys.argv[1], encoding="utf-8-sig")).get("port") or 8777))
except Exception:
    print(8777)' "$DIR/config.json" 2>/dev/null)"
[ -n "$PORT" ] || PORT=8777
URL="http://127.0.0.1:$PORT"

app_up() {
  curl --noproxy '*' -fsS -m 2 -o /dev/null "$URL/api/ping" 2>/dev/null
}

# cửa sổ app: Chrome --app với hồ sơ riêng (như Edge --app + _edge trên máy shop), không có Chrome thì trình duyệt mặc định
open_app() {
  local ch=""
  for c in "/Applications/Google Chrome.app" "$HOME/Applications/Google Chrome.app"; do
    if [ -d "$c" ]; then ch="$c"; break; fi
  done
  if [ -n "$ch" ] && [ -z "$POLY_KHONG_CHROME" ]; then
    open -na "$ch" --args --app="$URL" --user-data-dir="$DIR/_chrome" --lang=vi --disable-features=Translate \
      --no-first-run --no-default-browser-check >/dev/null 2>&1 || open "$URL"
  else
    open "$URL"
  fi
}

if app_up; then
  echo "App đang chạy, mở cửa sổ app: $URL"
  open_app
  exit 0
fi

# thiếu thư viện ảnh / Claude Code: hỏi cài (bộ cài chạy ngay trong cửa sổ này)
thieu="$("$PY" -c "import importlib.util as u; print(' '.join(m for m in ('PIL', 'numpy', 'scipy', 'cv2') if u.find_spec(m) is None))" 2>/dev/null)"
cl="$(find_claude)"
if { [ -n "$thieu" ] || [ -z "$cl" ]; } && [ -f "$CAI" ]; then
  ghi=""
  [ -n "$thieu" ] && ghi="- thư viện ảnh cho Python: Claude cần để soi ảnh, tách nền, dò trùng ảnh
"
  [ -z "$cl" ] && ghi="$ghi- Claude Code: chưa có thì app không dựng bài được
"
  b="$(dialog "Máy còn thiếu:
$ghi
Bấm \"Cài\": cài ngay trong cửa sổ Terminal này (vài phút, cần mạng). Xong app tự mở." "Để sau" "Cài")"
  if [ "$b" = "Cài" ]; then bash "$CAI" --tu-app; fi
fi

echo "Đang mở app Poly Dựng Bài (python: $PY)..."
# os.setsid: tách khỏi cửa sổ Terminal (đóng cửa sổ không tắt máy chủ); exec giữ nguyên số tiến trình để ghi pid
nohup "$PY" -c 'import os, sys
try:
    os.setsid()
except Exception:
    pass
os.execv(sys.argv[1], sys.argv[1:])' "$PY" "$DIR/server.py" </dev/null >>"$LOG" 2>&1 &
SPID=$!
echo "$SPID" > "$PIDF"
up=0
for _ in $(seq 1 60); do
  if app_up; then up=1; break; fi
  kill -0 "$SPID" 2>/dev/null || break
  sleep 0.25
done

if [ "$up" = 1 ]; then
  echo "App đang chạy tại $URL (tắt hẳn: nhấp đúp Tat Poly Dung Bai.command). Đóng cửa sổ này được rồi."
  open_app
  exit 0
fi

echo "Không mở được máy chủ app. Nhật ký:"
tail -n 20 "$LOG" 2>/dev/null
why="$(grep -v '^ *$' "$LOG" 2>/dev/null | tail -n 1)"
dialog "Không mở được app Poly Dựng Bài${why:+:
$why}

Chụp cửa sổ Terminal này gửi Claude." "OK" >/dev/null
exit 1
