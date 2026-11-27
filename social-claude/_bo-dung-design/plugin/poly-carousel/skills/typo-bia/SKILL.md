---
name: typo-bia
description: Typography chữ tiêu đề bìa (thumbnail, slide 1) theo theme mặc định của shop (máy shop, lệnh ghi "Theme Photoshop - (không)") cả 2 kênh - ngắt dòng, cỡ chữ, từ khoá trắng, chữ nghiêng, khoảng dòng, căn lề, hiệu ứng, cách kiểm; đặt chữ bằng hàm tieuDeBia trong code/bia-lib.jsx. Bài có theme Photoshop (máy con / máy dùng chung) không dùng skill này.
---

# Typography tiêu đề bìa (thumbnail) · Poly Store

Skill này lo **cách đặt chữ** trên bìa: ngắt dòng, cỡ, màu, khoảng cách, hiệu ứng. **Chữ gì** vẫn theo luật: chữ fen viết giữ đúng từng chữ, cả hoa thường và dấu câu (17d); Claude tự viết thì theo 17b (ngắn, gây tò mò, vào thẳng vấn đề, 1 câu dễ hiểu). Luật trong `E:\Social Claude\POLY-quy-tac-lam-content.md` (mục 12) thắng skill này khi khác. Áp cho cả 2 kênh; chỗ khác nhau ghi [Laptop] / [iPad].

`KIT` = `E:\Social Claude\_bo-dung-design`.

## 0. Áp cho bài nào (đọc trước)
- **Chỉ bài theme mặc định của shop**: lệnh dựng / sửa ghi `Theme Photoshop: (không)` (bài máy shop). Vàng Source Serif trên nền xanh lá tối là nhận diện riêng của shop.
  Theme **giữ kiểu bài shop** (lệnh ghi "Theme này GIỮ NGUYÊN kiểu bài của kênh", vd "Noel · Kiểu Poly" 27/11) tính như theme mặc định: dùng skill này + `tieuDeBia` như thường, chỉ chừa góc phải trên cho trang trí của theme (xem luật theme).
- **Bài có theme Photoshop** (lệnh ghi `Theme Photoshop: <tên theme>`; máy con / máy dùng chung luôn có theme — fen 13/11 "máy con không sài chung theme shop", fen 21/11 "máy con không sài kiểu theme này"): **không dùng skill này, không gọi `tieuDeBia`**, không đặt chữ vàng Source Serif, không thêm "POLY STORE" kiểu shop. Bìa dựng bằng hàm bìa của theme (`theme-ps/luat-theme.md`, `theme.json` mục `xem`), màu / font / cỡ theo theme. Chỉ giữ 3 ý chung: đúng từng chữ fen (17d), ngắt dòng theo nghĩa (mục 2), dấu tiếng Việt không chạm dòng khác.

## 1. Bộ nhận diện (giữ nguyên, không sáng tạo ở đây)
- Nền `bg-thumb.png` xanh lá tối; "POLY STORE" UTM AvoBold 22 trắng, tracking 200, góc trên trái, tên lớp `Thương hiệu`.
- Tiêu đề: **Source Serif Black** (`FS.T`), **VIẾT HOA**, vàng `#FFD60A`, **căn trái**: mép trái nét chữ thẳng mép trái nét chữ "POLY STORE" (căn theo nét chữ, không theo điểm đặt chữ). iPad / iPhone viết `iPAD`, `iPHONE` (chữ i thường) như các bìa đã làm.
- **Từ khoá trắng** (luật 17b 09/11): 1 cụm 1–2 chữ, cùng font, cùng cỡ dòng đó, màu trắng, glow trắng nhẹ.
- **Chữ phụ nghiêng**: Source Serif Italic (`FS.I`), trắng, viết thường. "tại Poly" ~48 cùng dòng cuối, hoặc ngay dưới khi fen nói "phía dưới" ([Laptop] bài top nhiều máy); dòng phụ ≤ 6 chữ cỡ 40–44 ngay dưới tiêu đề ([iPad] bìa so sánh: 40, luật 16g).
- Hiệu ứng: vàng = glow vàng 42% cỡ 30 + bóng 60% lệch 6 mờ 14; trắng = glow trắng 30% cỡ 26 + bóng như trên; nghiêng = chỉ bóng 78% lệch 3 mờ 8.
- Không: viền (stroke) quanh chữ, gradient, chữ 3D, chữ cong, bóp ngang / dãn chữ, tracking âm, font thứ 3, màu chữ thứ 3 (xanh lá chỉ dùng ở sticker, pill), emoji trong tiêu đề.

## 2. Ngắt dòng theo nghĩa
1 dòng nếu cỡ ≥ 96 vẫn vừa; không thì 2 dòng; 3 dòng chỉ khi chữ fen viết dài (17d: giữ chữ, chỉ xuống dòng, cuối bài `HOI_FEN:` gợi ý bản ngắn). Ngắt ở chỗ người đọc tự ngắt hơi:
- **Không tách**: tên máy + đời (MACBOOK AIR M2, PRECISION 5560), số + đơn vị (25 TRIỆU, 16GB, 13 INCH), "TOP N" + thứ được xếp, cụm từ khoá trắng, động từ + bổ ngữ ngắn (NÂNG RAM), từ 2 tiếng (KỸ SƯ, SINH VIÊN, KIẾN TRÚC).
- **Ngắt trước chữ nối**: CHO, HAY, VÀ, DƯỚI, Ở, KHI, NÊN, CỦA, VỚI, ĐỂ đứng đầu dòng sau. Câu so sánh ngắt ở "HAY" (16g).
  - "TOP 5 MÁY TRẠM / DELL CHO KỸ SƯ" · "PRO M2 / HAY AIR M2?" · "TOP 3 iPAD / CHO SINH VIÊN" · "LAPTOP CHẬM / DO Ổ CỨNG?"
  - Sai: "TOP 5 / MÁY TRẠM DELL CHO KỸ SƯ" (dòng 1 cụt), "LAPTOP DƯỚI 25 / TRIỆU" (tách số), "PRO M2 HAY / AIR M2?" (chữ nối cuối dòng).
- Không dòng mồ côi (1 chữ ngắn đứng riêng), trừ khi chữ đó là từ khoá được nhấn cố ý (kiểu B mục 6). Không dòng chỉ có chữ nối.
- Dấu ? ! dính chữ cuối, không rớt dòng; giữ đúng khoảng trắng fen gõ ("iPAD LAG ?").
- 2 dòng: dài gần bằng nhau, hoặc lệch rõ (1 dòng ngắn nhấn + 1 dòng dài); tránh lệch 1–2 chữ cái nhìn như canh lỗi (hàm tự cho bằng cỡ, xem mục 4).

## 3. Từ khoá trắng
- Đúng **1 cụm 1–2 chữ** trên cả bìa = thứ người xem nhận ra mình: tên máy / hãng (DELL, MACBOOK), con số chính (25 TRIỆU, 16GB), đối tượng (SINH VIÊN, KẾ TOÁN), việc / vấn đề (AI, PIN).
- Không tô trắng chữ nối, "TOP N", dấu câu; không 2 cụm trắng rời nhau; không tô trắng cả dòng dài.
- Từ khoá đầu hoặc cuối dòng nhìn gọn nhất; giữa dòng cũng được.
- Bìa không có từ khoá rõ (hiếm) thì để cả tiêu đề vàng, ghi lý do ở log.

## 4. Cỡ chữ (hàm tự tính, tự làm tay thì theo đúng số này)
- Khung chữ: từ mép trái POLY STORE tới x 982 (~880px). Mỗi dòng lấp tối đa ~92% (~810px).
- Cỡ từng dòng theo độ dài (luật 16f 14/11, "to nhỏ phù hợp"): dòng ngắn to, dòng dài nhỏ cho vừa, trong khoảng **84–112**; dòng **chỉ có** từ khoá trắng (vd "DELL", "AI") tới **124**.
- Cỡ lớn nhất ≤ 1,3 × cỡ nhỏ nhất. 2 dòng chênh < 8% thì để bằng nhau (lệch ít nhìn như lỗi).
- **Cỡ theo vai trò** (fen 20/11, bài 4 loại iPad: "title to nhỏ phù hợp, câu nhấn đang bị đều với bự quá"): dòng là ý chính / câu nhấn to nhất, dòng liệt kê / dẫn nhỏ hơn rõ (vd tên loại 74, câu nhấn ~119 vừa 884px). Hàm tự tính theo độ dài; khi vai trò ngược độ dài thì đặt tay `co: [74, 74, 0]` (0 = tự tính).
- Dòng phải < 84 mới vừa: ngắt lại theo mục 2. Hàm có ngắt dự phòng (gần giữa, trước chữ nối, không tách số + đơn vị) nhưng không hiểu từ 2 tiếng: thấy log "tu ngat dong" thì tự ngắt lại cho đúng nghĩa rồi dựng lại.
- Chữ < 26px không có trên bìa (chữ phụ nhỏ nhất 40).

## 5. Khoảng dòng, vị trí
- Đỉnh chữ hoa dòng 1 cách đáy POLY STORE ~64px (dấu mũ, dấu sắc được nhô lên trên).
- Khoảng 2 chân chữ ≈ 1,2 × cỡ (dòng trên to hơn thì cộng thêm). Dấu tiếng Việt (Ố, Ặ, Ữ, dấu nặng Ạ Ộ) không chạm dòng trên / dưới: hở ≥ 8px.
- Chữ nghiêng phụ cách đáy tiêu đề ~26px, căn trái cùng mép.
- Ảnh máy / câu móc dưới khối chữ, trống ≤ 160px (17c). [Laptop] chữ không đè máy: `yMax` = đỉnh máy − 24 (đọc từ `bia-xem.jpg` / log `prep/bia_lop.py`). [iPad] máy được lấn sau tiêu đề nhưng không che chữ.
- Không vào vùng nút TikTok (x > 950, y 620–1320); toàn bộ chữ trong lề an toàn y 120–1386.

## 6. Kiểu nhấn (đổi giữa các bài, vẫn đúng nhận diện)
Mỗi bìa chọn 1 kiểu hợp chữ; cố không trùng kiểu của 2 bìa gần nhất cùng kênh (ghi kiểu vào cột ghi chú sổ `KIT/noi-dung/bia-da-lam.md`, vd "chữ: B").

| Kiểu | Cách đặt | Hợp với |
|---|---|---|
| A Khối đều | 2 dòng cùng cỡ (`deu: true`) | 2 dòng dài gần bằng |
| B Nhịp to nhỏ | 1 dòng chỉ có từ khoá trắng to (≤ 124), dòng kia nhỏ | từ khoá rất ngắn: DELL, AI, PIN, M4 |
| C Từ khoá cuối câu | "CHẠY *AI*", "CHO *KẾ TOÁN*" | câu hỏi / câu có đối tượng |
| D Đuôi nghiêng | "_tại Poly_" cùng dòng cuối | bài giá, bài tại shop (17b 09/11) |
| E Dòng phụ dưới | `duoi:` cỡ 40–48 | so sánh iPad (16g), top nhiều máy "phía dưới" |
| F 1 dòng to | 1 dòng 100–112 | tiêu đề ≤ 3–4 chữ |

**Bố cục bìa H Typography** [iPad] (fen thêm 20/11, mẫu `iPad\T11_4LoaiiPad_20-11`): chữ là nhân vật chính, bài phân loại / liệt kê tên. Đây là bố cục cả bìa (BAT-DAU mục 3), không phải kiểu nhấn ở trên: mỗi tên 1 dòng cỡ 150–190, so le trái / phải (cách A) hoặc khối căn đều 884px (cách B), xen vàng – trắng, câu nhấn cuối vàng ~124 vừa 884px, máy nhỏ ở dưới. Dựng bằng `typoBia(dong, y0, gap)` (không dùng `tieuDeBia`); mục 1 (font, màu), 2 (ngắt theo nghĩa, giữ chữ fen), 5 (dấu không chạm, lề) vẫn áp, mục 4 (khoảng cỡ) không áp.

## 7. Code (`KIT/code/bia-lib.jsx`, cả 2 kênh)
```js
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
// thứ tự: nền -> soTo -> lopBia -> POLY STORE -> tieuDeBia -> sticker -> câu móc
text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });   // đặt TRƯỚC: hàm lấy mép trái + đáy lớp này
var T = tieuDeBia(["TOP 5 MÁY TRẠM", "*DELL* CHO KỸ SƯ"], { duoi: "tại Poly", yMax: 600 });
LOG += T.log;      // "tieu de bia: co 93/93, ..., rong 807(92%) ..." ; có "CANH BAO" là chưa đạt
// T.box = [trái, trên, phải, dưới] cả khối chữ -> đặt câu móc, đo trống tới máy
```
- Trong dòng: `*…*` = từ khoá trắng, `_…_` = chữ nghiêng trắng cùng dòng. Hàm **không đổi chữ** (không tự viết hoa, không bỏ dấu câu).
- Tuỳ chọn: `deu`, `co` ([cỡ từng dòng], 0 = tự tính), `nho` (84), `lon` (112), `lonNhan` (124), `lap` (0.92), `nhip` (1.3), `cachDong` (1.2), `nghieng` (48), `duoi`, `duoiCo` (48; [iPad] so sánh 40), `duoiCach` (26), `yMax`, `x`, `top`, `maxW`, `nhom` (mặc định gom các lớp vào nhóm "Tiêu đề bìa"), `ten`.
- Bìa có bố cục chữ đặc biệt (chữ chen giữa 2 máy, chữ trên thẻ) vẫn được tự đặt bằng `text()`, nhưng phải đạt đủ mục 1–5 và ghi log `bb()` từng dòng.

## 8. Kiểm trước khi giao (agent thiet-ke chấm "Chữ bìa N/5")
1. Log có dòng `tieu de bia:` và không có `CANH BAO`; có thì sửa, hoặc ghi lý do ở bảng final / `HOI_FEN:` khi do chữ fen dài.
2. Xem bìa thu nhỏ 1/4 (`python "KIT/prep/xem_nhanh.py" <ra.jpg> <slide-01.png> --o 270`): đọc hết tiêu đề trong 1 giây, từ khoá trắng nổi lên trước.
3. Soát tay: đúng từng chữ fen; mép trái thẳng POLY STORE; ngắt dòng đúng nghĩa, không mồ côi; dấu không chạm; không đè máy, không vào cột nút TikTok; chỉ vàng + trắng; cỡ các dòng hài hoà (không dòng ngắn lọt thỏm, không lệch nhau vài %).
Sai 1 ý là **Phải sửa** (ghi cách sửa bằng số: "dòng 2 cỡ 96 -> 104", "ngắt trước CHO", "yMax 610").
