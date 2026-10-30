#!/bin/bash
# POLY STORE - tắt app Poly Dựng Bài trên MacBook (đã mở bằng Poly Dung Bai.command): nhấp đúp file này trong Finder.
# Tắt máy chủ app. Bộ canh hàng chờ Photoshop cũng tắt, trừ khi còn bài đang chạy / Photoshop đang dựng dở
# (bài đó làm tiếp cho xong, mở lại app là thấy).
# LƯU Ý: file này phải xuống dòng kiểu LF và có quyền chạy (chmod +x).

DIR="$(cd "$(dirname "$0")" && pwd)"
PIDF="$DIR/_mac/server.pid"
PY="$(command -v python3 2>/dev/null)"

PORT=8777
if [ -n "$PY" ] && [ -f "$DIR/config.json" ]; then
  PORT="$("$PY" -c 'import json, sys
try:
    print(int(json.load(open(sys.argv[1], encoding="utf-8-sig")).get("port") or 8777))
except Exception:
    print(8777)' "$DIR/config.json" 2>/dev/null)"
  [ -n "$PORT" ] || PORT=8777
fi
URL="http://127.0.0.1:$PORT"

is_app() {   # tiến trình $1 có đúng là máy chủ app này không (số tiến trình có thể đã bị dùng lại)
  ps -p "$1" -o command= 2>/dev/null | grep -qF "$DIR/server.py"
}
is_canh() {
  ps -p "$1" -o command= 2>/dev/null | grep -qF "poly-tu-chay-mac.py"
}
cho_tat() {   # chờ tiến trình $1 tắt (tối đa 4 giây), còn thì giết hẳn
  for _ in $(seq 1 20); do kill -0 "$1" 2>/dev/null || return 0; sleep 0.2; done
  kill -9 "$1" 2>/dev/null
}

# còn bài đang chạy (Claude chạy riêng, không tắt theo app)?
dang=0
if [ -n "$PY" ]; then
  dang="$(curl --noproxy '*' -fsS -m 3 "$URL/api/jobs" 2>/dev/null | "$PY" -c 'import json, sys
try:
    print(sum(1 for j in json.load(sys.stdin).get("jobs", []) if j.get("status") == "dang-chay"))
except Exception:
    print(0)' 2>/dev/null)"
  [ -n "$dang" ] || dang=0
fi

p=""
if [ -f "$PIDF" ]; then
  p="$(tr -cd '0-9' < "$PIDF")"
  if [ -n "$p" ] && ! is_app "$p"; then p=""; fi
fi
if [ -n "$p" ]; then
  curl --noproxy '*' -fsS -m 3 -X POST -H 'Content-Type: application/json' -d '{}' "$URL/api/tat" >/dev/null 2>&1 || kill "$p" 2>/dev/null
  cho_tat "$p"
  rm -f "$PIDF"
  echo "Đã tắt app Poly Dựng Bài."
elif curl --noproxy '*' -fsS -m 2 -o /dev/null "$URL/api/ping" 2>/dev/null; then
  # app chạy mà không có file pid (mở bằng tay): nhờ app tự tắt
  curl --noproxy '*' -fsS -m 3 -X POST -H 'Content-Type: application/json' -d '{}' "$URL/api/tat" >/dev/null 2>&1
  echo "Đã tắt app Poly Dựng Bài."
else
  rm -f "$PIDF"
  echo "App chưa chạy."
fi

# bộ canh hàng chờ Photoshop
Q="$(head -n 1 "$DIR/_mac/hang-cho.txt" 2>/dev/null)"
[ -n "$Q" ] || Q="$HOME/Pictures/PolySocial/_tu-chay"
w=""
[ -f "$Q/poly-tu-chay-mac.pid" ] && w="$(tr -cd '0-9' < "$Q/poly-tu-chay-mac.pid")"
if [ -n "$w" ] && is_canh "$w"; then
  if [ "$dang" != 0 ] || [ -f "$Q/dang-lam.txt" ] || ls "$Q"/*.jsx >/dev/null 2>&1; then
    echo "Còn $dang bài đang chạy / Photoshop đang dựng: để hàng chờ Photoshop chạy tiếp cho xong. Mở lại app là thấy bài."
  else
    kill "$w" 2>/dev/null
    cho_tat "$w"
    echo "Đã tắt hàng chờ Photoshop."
  fi
fi
echo "Muốn dùng lại thì nhấp đúp Poly Dung Bai.command. Đóng cửa sổ này được rồi."
osascript -e 'display notification "Đã tắt app Poly Dựng Bài" with title "Poly Dựng Bài"' >/dev/null 2>&1
exit 0
