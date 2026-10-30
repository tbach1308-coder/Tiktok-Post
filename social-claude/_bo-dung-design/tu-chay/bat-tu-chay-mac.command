#!/bin/bash
# POLY STORE - bật bộ canh hàng chờ Photoshop trên MacBook bằng tay (bản Mac của lam-moi-tu-chay.bat).
# Thường không cần: app Poly Dựng Bài tự bật. Chỉ dùng khi gõ Claude Code tay mà không mở app.
# Chạy ngầm (đóng cửa sổ này được). Đang có 1 bản chạy thì bản mới tự thoát. Nhật ký: <hàng chờ>/nhat-ky.txt.
# LƯU Ý: file này phải xuống dòng kiểu LF và có quyền chạy (chmod +x).

HERE="$(cd "$(dirname "$0")" && pwd)"
Q="${POLY_TU_CHAY:-$HOME/Pictures/PolySocial/_tu-chay}"
PY="$(command -v python3)"
if [ -z "$PY" ] || { [ "$PY" = /usr/bin/python3 ] && ! xcode-select -p >/dev/null 2>&1; }; then
  echo "Chưa có Python 3: mở Terminal gõ  xcode-select --install  rồi chạy lại file này."
  exit 1
fi
mkdir -p "$Q/_da-chay"
nohup "$PY" -c 'import os, sys
try:
    os.setsid()
except Exception:
    pass
os.execv(sys.argv[1], sys.argv[1:])' "$PY" "$HERE/poly-tu-chay-mac.py" --hang-cho "$Q" </dev/null >>"$Q/poly-tu-chay-mac.log" 2>&1 &
sleep 2
tail -n 2 "$Q/nhat-ky.txt" 2>/dev/null
echo "Đã bật hàng chờ Photoshop: $Q. Đóng cửa sổ này được rồi."
