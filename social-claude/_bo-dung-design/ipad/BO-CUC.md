# Bố cục trang trong iPad – mỗi slide 1 kiểu (fen 27/11 19h23)

Fen 27/11: "làm cho phần trình bày và bố cục mấy slide này sinh động hơn", chọn **"Mỗi slide 1 bố cục khác"**.
Trước đây cả bài 1 khuôn: tiêu đề giữa → ảnh chữ nhật → thẻ ý → câu móc. Từ nay:

- **Slide nội dung (2 → áp chót) mỗi slide 1 kiểu dưới đây, không 2 slide liền nhau cùng kiểu**; cả bài dùng ít nhất 3 kiểu khác nhau.
- Đầu trang đổi xen kẽ: `headTrai` (căn trái) và đầu căn giữa (`headC` / đầu riêng của bài), không 3 slide liền nhau cùng 1 kiểu đầu.
- Giữ nhận diện shop: nền ảnh mờ tối, "POLY STORE", nhãn xanh, chữ tiêu đề UTM Cookies trắng viền navy, thẻ kính tối viền xanh, câu móc 👉 ở y 1266. Chỉ đổi cách xếp.
- Chữ, số liệu, ảnh vẫn theo brief đã chốt + luật kênh (chữ trong lề 96–984, ảnh đúng máy, không bịa). Chia 1 câu dài thành 2–3 ý ngắn được, không thêm ý mới.
- Hàm nằm sẵn trong `poly-lib.jsx` (mục "BỐ CỤC TRANG TRONG SINH ĐỘNG"); mẫu đủ 5 kiểu: `ipad/vi-du-bo-cuc.part.jsx`.

## Menu kiểu (chọn theo nội dung slide)

| Kiểu | Hợp khi | Cách dựng |
|---|---|---|
| **A. So sánh 2 cột + VS** | 2 máy / 2 bản / 2 lựa chọn | ảnh ngang tràn lề `bcAnh(file, BC_L, TOP0, BC_R, TOP0+330, 30, tên)` + `bcHaiCot({l: BC_L, r: 522, ten, mau: YEL2, vien: YEL2, y}, {l: 558, r: BC_R, ten, mau: C.GREEN_L, y})` → `bodyFit` → `bcVs(CXc, giữa ảnh và 2 cột)` |
| **B. Chia đôi + chữ to** | 1 thông số đinh (chip, RAM, pin, giá…) | trái: ảnh dán nghiêng `bcAnh(file, 120, t, 500, t+540, 16, tên, {vien: 14, xoay: -4, tam: [x, y]})`; phải: nhãn `pill(...)`, `bcSo("M1", 554, y, {co: 230})`, dòng phụ chữ to, `bcThe({l: 560, r: BC_R, y})` |
| **C. Máy nghiêng + 2 thẻ nhãn gài** | 1 máy / 1 món + 2 nhóm ý (2 bút, 2 bản, nên / không) | `placeAt` máy nền trong rộng ~600, xoay ±6, bóng; dưới: 2 `bcThe({l, r, nhan, nhanKieu: "pill", y})` cạnh nhau (thẻ phải `mauVien: YEL2` nếu là ý cảnh báo) |
| **D. Chữ rất to + ảnh tròn** | 1 câu chốt ngắn ("WIFI LÀ ĐỦ", "2 NĂM VẪN MƯỢT") | `bcSo("WIFI", BC_L, y, {co: 200, xoay: -4})` + `bcSo("LÀ ĐỦ", …, {co: 100, mau: C.WHITE, xoay: -4})` bên trái, `bcAnhTron(file, 790, y, 180, tên, {tam})` bên phải, dưới 1 `bcThe` rộng `BC_L..BC_R` |
| **E. Hàng thẻ** | 3–4 lựa chọn theo nhóm (ngành, ngân sách, nhu cầu) | `headTrai(..., {maxW: 520})` + ảnh máy nền trong nhỏ nghiêng góc phải đầu trang; mỗi lựa chọn 1 `bcHang({t, kind, nhan, chinh, phu})` (nhãn nhỏ xanh, dòng chính chữ to, dòng phụ), cách nhau 22 |
| F. Ảnh + thẻ (cũ) | ảnh chụp màn hình có khoanh, cần to rõ | `cardShot` / `cardPhoto` + `the` / `liGroup` như trước: tối đa 1 slide / bài |

## Hàm (toạ độ px trên 1080×1440, `BC_L = 96`, `BC_R = 984`)
- `headTrai(n, bg, pill, [dòng 1, dòng 2], phụ?, {maxW?, co?, mau?: [màu từng dòng]})`: đầu trang căn trái, cỡ chữ theo dòng dài nhất (≤ 96), đặt `BODY_TOP2` / `TOP0`.
- `bcAnh(file, l, t, r, b, rad, tên, {vien?, xoay?, tam?: [x, y] 0..1})`: ảnh phủ kín khung bo góc (cắt bằng mặt nạ, không clipping); `vien` viền trắng kiểu ảnh dán; `xoay` nghiêng (±3…6°).
- `bcAnhTron(file, cx, cy, r, tên, {tam?, vien?})`: ảnh tròn viền trắng.
- `bcSo(chữ, x, y, {co?, mau?, can?: "trai"|"giua"|"phai", xoay?})`: chữ / số rất to, viền navy.
- `bcThe({l, r, t, nhan?, nhanKieu?: "pill"|"chu", y: [[kind, chữ]], co?, mauVien?})`: thẻ ý; nhãn `pill` gài mép trên.
- `bcHang({l?, r?, t, kind, nhan?, chinh, phu?})`: 1 hàng thẻ có dấu tròn trái.
- `bcCot({...})` / `bcHaiCot(trái, phải)`: cột so sánh (2 cột cao bằng nhau); `bcVs(cx, cy, r?)`: huy hiệu VS.
- `bcSticker(chữ, cx, cy, xoay, kieu: "xanh"|"vang"|"trang"|"do", cỡ?)`: nhãn dán nghiêng (không gom nhóm).
- `bcGop([khối…])`: gộp nhiều khối xếp cạnh nhau thành 1 khối cho `bodyFit`.

## Lưu ý dựng
- Xếp dọc vẫn dùng `bodyFit(khối, khe)` (khối cạnh nhau gộp bằng `bcGop`); câu móc `hook()` như cũ.
- Ảnh cho `bcAnh` / `bcAnhTron` là ảnh chụp (không cần cắt sẵn đúng tỉ lệ: hàm tự phủ kín + mặt nạ); chọn `tam` để chủ thể nằm giữa khung.
- Ảnh máy nền trong (png tách nền) đặt bằng `placeAt` + xoay + bóng, không cho vào khung.
- Agent thiết kế: **Phải sửa** khi 2 slide nội dung liền nhau cùng kiểu, hoặc cả bài chỉ 1–2 kiểu.
