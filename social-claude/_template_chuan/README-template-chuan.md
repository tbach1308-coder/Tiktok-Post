# TEMPLATE CHUẨN POLY STORE: bài 14 "A16 hay AIR 5?"

- Ảnh mẫu: `E:\Social Claude\iPad\T10_A16vsAir5_14-10` (slide-00-thumbnail, slide-02 ... slide-07).
- Code gốc: thư mục này (`E:\Social Claude\_template_chuan\`).
  - `head14.part.jsx`: khởi tạo, màu, font, hàm cơ bản (text, rect, fx, placeSO, fitBox, save).
  - `helpers14.part.jsx`: ảnh nền mờ, devicePic, glass, labelChip, lifeCircle...
  - `body14.part.jsx`: các thành phần của template (head14, hook, markRow, noteBox, score, specCard, useCircle, screenCard, penCard, priceRow, giftRow) và 7 slide mẫu.
  - `build14.py`: ghép 3 phần thành file .jsx, đổi tiếng Việt sang \uXXXX.

## Cách dùng cho bài mới
1. Chép 4 file về máy làm việc. Đổi tên thành headNN/helpersNN/bodyNN/buildNN.py.
2. Sửa trong `buildNN.py`:
   - đường dẫn `P` cho đúng thư mục làm việc;
   - tên file các phần cho khớp tên mới.
3. Sửa trong `headNN`:
   - `OUT` = thư mục bài mới (`E:/Social Claude/iPad/T10_<TenBai>_<ngày-tháng>`, ví dụ `T10_iPadHopBan_20-10`);
   - dòng chú thích tên bài.
4. Trong `bodyNN`:
   - giữ nguyên các hàm thành phần, chỉ viết lại các hàm slide s1...sN;
   - riêng `score()` có chữ "AIR 5" / "A16" viết cứng: đổi tên 2 máy, hoặc thêm tham số tên máy khi dùng cho cặp khác.
5. Build: `python3 buildNN.py <file.jsx> 'var ONLY_LIST = [..]; var LOG_NAME = "..";\n'`, rồi kiểm tra bằng `node --check`.

## Thông số style

### Màu
| Tên | Mã | Dùng cho |
|---|---|---|
| GREEN | `#22C55E` | pill |
| GREEN_D | `#16A34A` | chip máy shop đẩy, kết quả thắng |
| GREEN_L | `#4ADE80` | viền nổi bật, tỉ số, tên máy nổi bật |
| GREEN_SOFT | `#DCFCE7` | nền ô ghi chú |
| INK | `#111827` | viền chữ, chip máy thường |
| RED | `#EF4444` | dấu ✗ |
| AMBER | `#F59E0B` | dấu ! và dấu + |
| YEL | `#FFD60A` | tiêu đề thumbnail |
| — | `#BBF7D0` | dòng phụ trong thẻ giá |
| — | `#D1FAE5` | dòng phụ trong thẻ bút |

### Font
- **UTM-Cookies (F.T):** tiêu đề slide, chip, tỉ số, giá.
- **UTMAvoBold (F.B):** chữ thường.
- **NotoColorEmoji (F.E):** emoji.
- **Thumbnail:** SourceSerif Black (vàng) + SourceSerif SemiBold Italic.

### Thumbnail (`thumb14`)
- Nền `bg-thumb.png`.
- "POLY STORE": (84,100), F.B 22, giãn chữ 200.
- Tiêu đề: FS.T 132, vàng, glow vàng 40%, căn giữa, tâm y 292, maxW 960.
- Dòng phụ: FS.I 58, trắng, tại (tb[0]+10, tb[3]+44). Ngắn gọn.
- Ảnh máy:
  - 2 máy thật cỡ lớn ở nửa dưới (khung khoảng y 450–1260), bóng đổ op 70.
  - Chip có đuôi (`labelChipUp`) dưới mỗi máy, tâm y 1262. Máy shop đẩy dùng GREEN_D, máy còn lại dùng INK.
- Không có pill, không có câu móc.

### Slide nội dung (`head14`)
- **Nền:** ảnh thật làm mờ (blur 16) + lớp đen 62%. Không lộ logo Apple.
- **"POLY STORE":** (84,112).
- **Pill xanh:** GREEN, tâm (540,158), cao 56, F.B 26, giãn 40. Ví dụ "HIỆP 1".
- **Tiêu đề:** F.T 100, trắng, viền INK 10px + bóng, tâm x 540, y 312, maxW 900. Chữ dài thì giảm còn 92 hoặc 84.
- **Phụ đề:** F.B 31, trắng, y 384.
- Nội dung bắt đầu từ y ≈ 436.

### Thành phần
- **Thẻ kính (`glass`):**
  - nền trắng 11%, viền trắng 2px 40%, bo 30;
  - thẻ của máy shop đẩy: thêm viền GREEN_L 3px, tên máy màu GREEN_L.
- **`specCard`:** ảnh máy bên trái rộng khoảng 150, tên F.B 28, chip F.T 54 viền đen, thông số F.B 25.
- **`useCircle`:** ảnh đời thật trong vòng tròn bán kính 104, nhãn F.B 28, pill kết quả (GREEN_D nếu thắng, INK nếu hòa).
- **`screenCard`:** thẻ ngang full width, ảnh bên trái, tên F.B 32, các dòng ✓/✗ F.B 30.
- **`penCard`:** ảnh khung trắng ở trên, tên F.B 32, dòng phụ F.B 25 màu D1FAE5, các dòng ✓/✗/! F.B 26.
- **`markRow`:** chấm tròn có dấu, chữ trắng tự xuống dòng.
  - ✓: tròn xanh, `ic-check.png`.
  - ✗: tròn đỏ, `ic-x.png`.
  - !: tròn cam.
  - +: tròn cam.
- **`noteBox`:** nền GREEN_SOFT bo 26, chữ INK F.B 26, emoji bên trái.
- **`score`** (bài so sánh):
  - hộp 640×104, nền `#0B0F14` 90%, viền GREEN_L 3px;
  - tên 2 máy F.B 34 ở 2 bên, tỉ số F.T 70 màu GREEN_L viền đen;
  - tâm y 1238, hoặc 1150 khi có câu móc bên dưới;
  - nhãn "CHUNG CUỘC" là pill GREEN_D.
- **Câu móc (`hook`):** pill nền đen 62%, viền GREEN_L 2px, chữ F.B 26 + 👉, tâm y 1266.
- **Chip chỉ vào máy:** `labelChipUp` / `labelChipDown`, chip có đuôi tam giác.
- **Khoanh chi tiết trên ảnh:** vòng tròn viền GREEN_L 5px kèm chip chỉ xuống.

### Slide chốt (`s7`)
- **Đầu slide:**
  - nền `bg-thumb.png`;
  - pill "CHỐT KÈO" ở y 236;
  - tiêu đề 2 dòng: dòng 1 F.T 100 trắng, dòng 2 F.T 104 màu GREEN_L, cả hai viền đen.
- **`priceRow`:**
  - thẻ kính, ảnh máy bên trái (khoảng 216), tên F.B 31;
  - giá F.T 62 trắng viền đen, dòng phụ F.B 26 màu BBF7D0;
  - máy shop đẩy viền GREEN_L.
- **`giftRow`:** nhãn "Tặng kèm:" + các ô đen 55% có icon và chữ F.B 21.
- **Cuối slide:** pill #polystore.
- Theo quy tắc mới, slide cuối là "Ghé Poly tư vấn" + địa chỉ + #polystore.

### Vùng an toàn
- `SAFE_R = 940`.
- Không đặt chữ ở x > 950 trong khoảng y 620–1320.
- Không đặt chữ thấp hơn y 1300.
- Hàm `safeCheck` ghi cảnh báo vào log.
