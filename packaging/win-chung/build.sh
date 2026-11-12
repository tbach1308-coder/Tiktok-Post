#!/bin/bash
# Đóng gói app Windows "dùng chung" (mở app máy shop qua link): dist/Poly-Dung-Bai-dung-chung.exe
# Cần: apt-get install -y mingw-w64
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$(dirname "$(dirname "$HERE")")/dist"
mkdir -p "$OUT"
cd "$HERE"
x86_64-w64-mingw32-windres poly-chung.rc -O coff -o /tmp/poly-chung-res.o
x86_64-w64-mingw32-gcc -municode -mwindows -O2 -s -Wall -o "$OUT/Poly-Dung-Bai-dung-chung.exe" poly-chung.c /tmp/poly-chung-res.o \
  -lwinhttp -lole32 -luuid -lshell32 -lcomctl32
ls -l "$OUT/Poly-Dung-Bai-dung-chung.exe"
