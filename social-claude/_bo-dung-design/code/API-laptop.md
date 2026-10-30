# API thư viện Laptop – đọc file này, KHÔNG đọc lại cả `make-mac-vs-win.jsx` / `top5_body.jsx`

Tự sinh 28/10. `code/build.py` ghép: 223 dòng đầu `make-mac-vs-win.jsx` (phần 1) + helper `top5_body.jsx` (phần 2) + file slide của bài (`slides/<bai>_slides.jsx`: `t1..tN`, `var FN = [null, t1, ...]`, vòng chạy, ghi log). Toạ độ px khung 1080x1440. Biến có sẵn: `W, H, C` (màu), `F` (font UTM), `FS` (Source Serif: `FS.T` đậm, `FS.I` nghiêng), `YEL`, `OUT5`, `TN` (= `<bài>/tai-nguyen/`), `LOGN`, `ONLY_M`. Mẫu theo kiểu bài: mục 4 `BAT-DAU-TU-DAY-DESIGN.md` (bài mẹo: `thaotac5_slides.jsx`, giới thiệu máy: `gaming_slides.jsx`, top: `top5_25tr_slides.jsx`…). Chép từ bài gần nhất cùng kiểu, chỉ đổi chữ + ảnh.

## Phần 1 – make-mac-vs-win.jsx (đầu file)
- `writeFile(name, s)`
- `pick(a)`
- `rect(l, t, r, b, rad, h, name)`
- `oval(l, t, r, b, h, name)`
- `poly(pts, h, name)`
- `check(cx, cy, k, h)`
- `spark(ax, ay, angDeg, r0, len, th, h)`
- `arrowH(x1, x2, y, th, hl, hw, h, name)`
- `bb(L)`
- `text(str, font, size, h, x, y, o)`
- `centerY(L, cy)`
- `pill(str, x, cy, size, txtH, fillH, padX, hgt, font, track, name)`
- `fx(L, o)` — layer style: stroke + bóng đổ
- `placeSO(file, name)`
- `fitSO(L, imgW, cropL, cropT, cropW, dstL, dstT, dstW)` — ảnh: vùng cắt (cropL, cropT, cropW trên ảnh gốc rộng imgW) đặt vào (dstL, dstT) rộng dstW
- `gblur(r)`
- `background(file, imgW, cropL, cropT, cropW, blurR)`
- `photoCard(file, imgW, cropL, cropT, cropW, l, t, w, h, rad, name)`
- `newDoc(name)`
- `save(doc, n)`

## Phần 2 – top5_body.jsx (helper)
- `pillC(str, cx, cy, size, txtH, fillH, padX, hgt, font, track, name)`
- `emojiC(ch, size, cx, cy, name)`
- `fxGlow(L, o)`
- `bgPhoto(file, imgW, cropL, cropT, cropW, blur, op)` — nền: ảnh thật làm mờ + lớp tối
- `head(n, pillTxt, t, sub)` — đầu slide: POLY STORE + nhãn xanh + tiêu đề Cookies + phụ đề
- `glass(l, t, r, b, rad, name)`
- `checkDot(cx, cy, r)`
- `bullet(str, x, y, size)`
- `note(t, h, emo, str)` — ô phân tích (nền xanh nhạt)
- `hookPill(str, cy)` — câu móc cuối slide
- `labelChipDown(cx, cy, label, fillH, name)`
- `photoFrame(file, imgW, cropL, cropT, cropW, l, t, w, h, name)` — ảnh thật trong khung bo góc viền trắng
- `photoCircle(file, imgW, cropL, cropT, cropW, cx, cy, r, name)` — ảnh thật trong khung tròn
- `save5(doc, n)`
- `ring(l, t, r, b, rad, hex, name)` — vòng khoanh + số thứ tự
- `centerText(T, cx, cy)`
- `badge(n, cx, cy, hex, name)`
- `dotText(x, y, size, hex, ch, name)`
- `lineText(str, x, y, size)`
- `bulletN(n, hex, str, x, y, size)`
- `bulletW(str, x, y, size)`
- `shot(file, w, l, t, h, name)` — ảnh đã cắt sẵn đúng kích thước hiển thị: đặt 100%, khung bo góc viền trắng
- `litKey(k, name)`
- `headN(n, pillTxt, t, sub)` — đầu slide kiểu chữ có chân (đồng bộ với ảnh bìa)
- `placeAt(file, l, t, name)`

## Bìa sáng tạo (luật 17c, 29/10) – `code/bia-lib.jsx`
Nạp trong slide bìa: `$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));`. Lớp ảnh bìa ghép trước bằng `python "E:/Social Claude/_bo-dung-design/prep/bia_lop.py" ...` (mục 3 BAT-DAU-TU-DAY-DESIGN.md).
- `lopBia(TN + "bia-lop.png", name)` — PNG 1080x1440 nền trong: đặt vào là khớp, không đo
- `sticker(str, cx, cy, xoay, kieu, size)` — kieu "trang" / "xanh" / "vang" / "do" / "xanhduong", nghiêng xoay độ
- `vsBadge(cx, cy, r, xoay)` — huy hiệu VS tròn vàng
- `soTo(str, cx, cy, size, op, hex)` — số / chữ rất to mờ phía sau máy (gọi TRƯỚC lopBia)
- `muiTen(x1, y1, x2, y2, hex)` — mũi tên chỉ chi tiết
