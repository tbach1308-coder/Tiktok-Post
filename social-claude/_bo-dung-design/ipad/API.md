# API thư viện iPad (poly-lib.jsx) – đọc file này, KHÔNG đọc lại cả thư viện

Tự sinh từ `poly-lib.jsx` ngày 28/10 (80 hàm). Toạ độ px trên khung 1080x1440. Biến có sẵn: `W, H, C` (màu), `F.T/F.B/F.R/F.E` (font Cookies / AvoBold / Avo / emoji), `FS.T` (Source Serif), `A` (= `<bài>/tai-nguyen/anh-that/`), `IMG` (= `E:/Social Claude/Anh tai ve/`), `CXc=540, LX=180, RX=900, CW=720`, `TOP0`, `BODY_TOP2`, `BODY_BOT`, `NAVY`, `MINT`. Mẫu 1 bài đủ 7 slide: `ipad/vi-du-bai-pin.part.jsx`, hoặc `tai-nguyen/script/bai.part.jsx` của bài iPad gần nhất cùng kiểu.
Mỗi slide: `if (want(n)) { var d = headC(n, [file nền, rộng ảnh, cropL, cropT, cropW], "PILL", "TIÊU ĐỀ", "phụ đề"); ...khối...; hook("câu móc"); RUN += ...bodyFit(B)...; save(d, n); d.close(SaveOptions.DONOTSAVECHANGES); }`, cuối file `ketThuc("vN.log");`.

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
- `pillC(str, cx, cy, size, txtH, fillH, padX, hgt, font, track, name)` — ---------- THUMBNAIL ----------
- `iconAt(cx, top)`
- `cutout(file, crop, maxW, target, name)` — mở ảnh, cắt vùng, tách nền, cắt sát, chép sang tài liệu đích
- `fitBox(L, l, t, r, b)` — đặt vừa khung (l,t,r,b), canh giữa
- `arrow(x1, y1, x2, y2, th, hl, hw, h, name)`
- `stepChip(cx, cy, num, label, fillH, numFill, numTxt, name)` — nhãn bước: [số trong vòng tròn] + chữ, có đuôi chỉ xuống
- `moveTo(src, dstDir)`
- `fxGlow(L, o)` — ---------- hiệu ứng phát sáng ----------
- `placeFull(file, name)` — ---------- đặt ảnh ---------- ảnh phủ kín khung hình (đúng 1080x1440): đặt vào là khớp, không đo bounds
- `placeAt(file, name, cx, cy, w)`
- `devicePic(file, name, l, t, r, b, sh)`
- `bgPhoto(file, imgW, cropL, cropT, cropW, blur, op)`
- `head30(n, bg, pillTxt, t, sub)` — ---------- chữ, nhãn ----------
- `emojiC(ch, size, cx, cy, name)`
- `checkDot(cx, cy, r)`
- `bullet(str, x, y, size, hex)`
- `priceTag(val, x, cy, lab)`
- `lifeCircle(file, cx, cy, r, name)`
- `labelChipUp(cx, cy, label, fillH, name)`
- `labelChipDown(cx, cy, label, fillH, name)`
- `glass(l, t, r, b, rad, name)`
- `want(n)`
- `blk(ls, m)` — Ảnh trong thẻ bị cắt bằng clipping nên khung layer của nó to hơn thẻ -> phải đo theo layer khung, không đo cả cụm.
- `blkBox(b)`
- `moveBlk(b, top)`
- `spread(blocks, TOP, BOT)` — chia đều phần trống giữa các khối trong dải TOP..BOT
- `centerGroup(blocks, gap, TOP, BOT)` — khoảng cách cố định rồi căn giữa cả cụm (dùng cho slide CTA)
- `crossMark(cx, cy, k, h)` — ---------- biểu tượng đầu dòng ----------
- `bangMark(cx, cy, k, h)`
- `dotIcon(kind, cx, cy, r)`
- `li(kind, str, x, y, size, maxW)` — một dòng ý: biểu tượng tròn + chữ
- `cardCover(file, l, t, r, b, rad, name)` — ---------- thẻ ảnh ---------- ảnh phủ kín khung, phần thừa bị cắt bằng clipping
- `markOn(Img, imgW, imgH, x0, y0, x1, y1, rad, name)` — Do THANG vung anh da ve tren canvas roi quy doi, khong tin so khai bao. x0,y0,x1,y1 tinh theo he toa do imgW x imgH cua chinh file anh do.
- `cardShot(file, cx, top, w, imgW, imgH, pad, rad, name, marks)`
- `badgeTop()` — Huy hieu tron o goc tren-trai cua the: so buoc (1, 2) hoac dau nen/khong nen. Tao tren CUNG cua tai lieu va go clipping, khong thi bi nhet vao nhom cat cua the ben canh.
- `unclip(ls)`
- `toTop(ls)` — Dua tung layer len dinh tai lieu theo thu tu (phan tu sau nam tren phan tu truoc), roi go clipping. Khong tin vao viec "tao phia tren layer dang chon" - da hong 1 lan: huy hieu bi nam duoi anh.
- `numBadge(Fr, n, off)` — off: tam huy hieu cach goc the (mac dinh 32 = nam trong the; ~6 = dan o goc, khong de len chu trong anh).
- `cornerIcon(Fr, kind)`
- `cardPhoto(file, l, t, r, b, rad, name)` — Anh da bo goc san bang Python, dung dung ti le khung -> dat vao la khop, KHONG clipping. (clipping lam cac layer tao sau bi "dinh" vao nhom cat cua the ben canh va bien mat)
- `shotDevice(file, cx, top, w, imgW, imgH, name, marks)` — Nguyen chiec may (anh nen trong suot) + vong khoanh, khong khung trang
- `photoRound(file, cx, cy, r, name)` — ảnh tròn có viền
- `chipLine(items, cx, cy, size, padX, hgt, gapX)` — ---------- hàng chip ----------
- `liGroup(items, top, name)`
- `bodyFit(blocks, gapMax)`
- `nextChip(cx, cy, label, name)` — ---------- chip "xem tiếp" ----------
- `noteBox(lines, cx, top, w, name)` — ---------- box ghi chú nền mint ----------
- `headC(n, bg, pillTxt, t, sub, op, blur)` — ---------- đầu slide nội dung ----------
- `ketThuc(tenLog)` — ================= KET THUC: ghi log, KHONG hien hop thoai ================= Claude doc log tim chu XONG thay vi chup man hinh + bam OK -> nhanh hon.

## Bìa sáng tạo (luật 17c, 29/10) – `code/bia-lib.jsx`
Nạp trong slide bìa: `$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));`. Lớp ảnh bìa ghép trước bằng `python "E:/Social Claude/_bo-dung-design/prep/bia_lop.py" ...` (mục 3 BAT-DAU-TU-DAY-DESIGN.md).
- `lopBia(A + "bia-lop.png", name)` — PNG 1080x1440 nền trong: đặt vào là khớp, không đo
- `sticker(str, cx, cy, xoay, kieu, size)` — kieu "trang" / "xanh" / "vang" / "do" / "xanhduong", nghiêng xoay độ
- `vsBadge(cx, cy, r, xoay)` — huy hiệu VS tròn vàng
- `soTo(str, cx, cy, size, op, hex)` — số / chữ rất to mờ phía sau máy (gọi TRƯỚC lopBia)
- `muiTen(x1, y1, x2, y2, hex)` — mũi tên chỉ chi tiết
