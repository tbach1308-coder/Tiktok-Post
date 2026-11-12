#!/bin/bash
# Đóng gói "Poly Dung Bai Setup.exe" cho máy Windows khác máy shop (fen 6/11). Chạy trên Linux:
#   apt-get install -y nsis mingw-w64     (1 lần)
#   bash packaging/build.sh               -> dist/PolyDungBai-Setup-<bản>.exe
# Gói gồm: Python 3.12 cho Windows (python-build-standalone, bản chính thức của Astral trên GitHub) + thư viện ảnh
# (pillow, numpy, scipy, opencv) mà bộ dựng dùng, mã app lấy từ git (file đã commit), file mở app "Poly Dung Bai.exe".
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(dirname "$HERE")"
VERSION="${VERSION:-$(date +%Y.%-m.%-d)}"
CACHE="${CACHE:-$HERE/.cache}"
OUT="${OUT:-$REPO/dist}"
WORK="$(mktemp -d)"
B="$WORK/build"
PYV=3.12.7
PBS=20241016
PYURL="https://github.com/astral-sh/python-build-standalone/releases/download/$PBS/cpython-$PYV+$PBS-x86_64-pc-windows-msvc-install_only.tar.gz"
mkdir -p "$CACHE/wheels" "$OUT" "$B/app"

echo "== Python $PYV cho Windows"
[ -s "$CACHE/python-$PYV.tar.gz" ] || curl -fsSL -o "$CACHE/python-$PYV.tar.gz" "$PYURL"
tar -xzf "$CACHE/python-$PYV.tar.gz" -C "$B"
[ -f "$B/python/python.exe" ] && [ -f "$B/python/pythonw.exe" ] || { echo "Thieu python.exe / pythonw.exe"; exit 1; }

echo "== Thu vien anh (ban cho Windows, Python 3.12)"
python3 -m pip download -q --only-binary=:all: --platform win_amd64 --python-version 3.12 --implementation cp --abi cp312 \
  -d "$CACHE/wheels" -r "$HERE/requirements-win.txt"
for w in "$CACHE"/wheels/*.whl; do
  python3 -m zipfile -e "$w" "$B/python/Lib/site-packages/"
done
rm -rf "$B/python/Lib/test" "$B/python/Lib/idlelib" "$B/python/Lib/tkinter" "$B/python/tcl" 2>/dev/null || true
find "$B/python" -name "__pycache__" -type d -prune -exec rm -rf {} +

echo "== Ma app (file da commit)"
cd "$REPO"
git ls-files -z | while IFS= read -r -d '' f; do
  case "$f" in
    packaging/*|dev/*|.git*|*.command|lam-moi-app-v3.bat|_index.src.html|PROJECT.md|README.md|HUONG-DAN-MAC.txt) continue ;;
  esac
  mkdir -p "$B/app/$(dirname "$f")"
  cp -p "$f" "$B/app/$f"
done
echo "$VERSION" > "$B/app/PHIEN-BAN.txt"

echo "== File mo app (Poly Dung Bai.exe)"
x86_64-w64-mingw32-windres "$HERE/launcher.rc" -O coff -o "$WORK/launcher.res"
x86_64-w64-mingw32-gcc -municode -mwindows -O2 -s -o "$B/Poly Dung Bai.exe" "$HERE/launcher.c" "$WORK/launcher.res"

echo "== Danh sach go cai (chi file cua app, giu du lieu may nay)"
(
  cd "$B/app"
  find . -type f | sed 's|^\./||' | sort | while IFS= read -r f; do
    printf 'Delete "$INSTDIR\\app\\%s"\n' "$(printf '%s' "$f" | sed 's|/|\\|g; s|\$|$$|g')"
  done
  find . -mindepth 1 -type d | sed 's|^\./||' | awk '{ print length($0) "\t" $0 }' | sort -rn | cut -f2- | while IFS= read -r d; do
    printf 'RMDir "$INSTDIR\\app\\%s"\n' "$(printf '%s' "$d" | sed 's|/|\\|g; s|\$|$$|g')"
  done
) > "$B/go-cai-app.nsh"

echo "== Bo cai"
cp "$REPO/ui/poly.ico" "$WORK/poly.ico"
SETUP="$OUT/PolyDungBai-Setup-$VERSION.exe"
makensis -V2 -DVERSION="$VERSION" -DBUILD="$B" -DOUTFILE="$SETUP" "$HERE/installer.nsi"
ls -la "$SETUP"
sha256sum "$SETUP" | tee "$SETUP.sha256"
du -sh "$B/python" "$B/app"
rm -rf "$WORK"
