# Luật dựng bài bằng theme Photoshop (kho chung app Poly Dựng Bài)

Fen 12/11/2026: "thiết kế template kho chung bằng photoshop", "thiết kế đừng 3d quá", "cho thêm theme kiểu glass". Theme = bộ phong cách: màu, font, nền, thẻ — **phẳng** (nền màu đặc) hoặc **glass** (ảnh nền mờ + thẻ kính), đều không bóng đổ.
Mỗi theme ở `theme-ps/<id>/` (thư mục app): `theme.json` (bảng màu, font), `theme.jsx` (tự tạo bằng `theme-ps/tao.py`), `xem/slide-01..03.png` (ảnh xem trước).

## Đẹp mà không sến (fen 14/11 12h15 "có cách nào làm theme đẹp mà ko bị sến không") — áp dụng mọi theme mới, cả Canva lẫn Photoshop
- 1 màu nền + 1 màu nhấn, còn lại đen / trắng / xám. Màu nhấn chỉ 1–2 chỗ mỗi trang (vạch tô dưới chữ, con số, nút, nhãn VS).
- Tối đa 2 font: 1 tiêu đề chữ hẹp đậm, 1 nội dung dễ đọc. Không viền chữ dày, không bóng chữ, không trộn nghiêng lung tung.
- Ảnh thật (máy thật, tay cầm, bàn sửa trong tiệm) làm chính; không icon / clip-art cho có.
- Mỗi trang tối đa 1 chi tiết trang trí. Không sao nổ, chấm tròn rải rác, vòng tròn mờ góc, bóng lệch màu sau thẻ / nút, viền dày, emoji 👉.
- Nhiều khoảng trống, lề đều, thẳng hàng; chữ to nhưng ít chữ.
- Theme mùa chỉ gợi nhẹ: màu mùa + 1 chi tiết nhỏ cố định 1 góc (Tết: 1 cụm mai nhỏ góc trên phải; Black Friday: đen + vàng, không hoạ tiết).
- Mẫu đã duyệt: Canva "Theme Black Friday · Đen vàng (POLY)" DAHa28Dee4w, "Theme Tết · Đỏ vàng (POLY)" DAHa3IEPgQ8 (bản tối giản 14/11), "Theme Ảnh thật · Nền sáng (POLY)" DAHa3BQfW98.

## Ghép theme khi build (mọi lần build, cả lần dựng lại vài slide)
- iPad: `python "E:/Social Claude/_bo-dung-design/ipad/build.py" "<bài>" "<part>" "<out>" [--only 3,4] --theme "<thư mục app>/theme-ps/<id>/theme.jsx"`
- Laptop: `python "E:/Social Claude/_bo-dung-design/code/build.py" slides/<x>.jsx <thư mục bài> <tên> vN [1,2] --theme "<…>/theme.jsx"`
- Log bài có dòng `Theme <tên>: T=<font> B=<font>`: không có dòng đó là quên --theme, build lại.

## Theme tự làm (không cần viết)
- `newDoc()` vẽ nền phẳng màu theme + hình khối trang trí ở góc (slide lẻ / chẵn đổi góc).
- Theme phẳng: `bgPhoto()`, `background()` không vẽ gì (không nền ảnh mờ), `glass()` = thẻ phẳng màu đặc.
- `fx()` bỏ bóng đổ, chỉ giữ viền mỏng ≤ 3px; `fxGlow()` không làm gì.
- Màu `C.GREEN*`, `YEL`/`YEL2`, `MINT`/`NAVY` (ô ghi chú), font `F.T` / `F.B` / `FS.T` / `FS.I` đã đổi theo theme; chữ tiêu đề (F.T) tự nhân cỡ cho vừa font theme.

## Theme glass (`nen_kieu: "kinh"`, fen 12/11 21h26 "cho thêm theme kiểu glass", "blur background")
- `newDoc()` vẽ nền màu theme + đốm màu loang mờ (dự phòng khi slide không có ảnh nền).
- `bgPhoto()` / `background()` **vẫn dùng**: ảnh thật của bài (đúng chủ đề, mỗi slide 1 ảnh khác) được làm mờ mạnh + lớp màu theme + đốm màu mờ. Slide glass nên có ảnh nền (cả bìa: gọi `bgPhoto(...)` ngay sau `newDoc`).
- `glass()` = thẻ kính: trắng trong (~14%) + viền trắng mảnh, không bóng đổ. Khung ý (`liGroup`), chip câu móc giữ kiểu kính của thư viện.
- Vẫn không bóng đổ, không phát sáng.

## Bìa kiểu quảng cáo sản phẩm `biaSanPham(o)` (fen 12/11 21h32 gửi ảnh mẫu iPhone + "cover ảnh này làm thumbnail")
- Theme nào cũng gọi được (glass hợp nhất). Bố cục: dòng máy nhỏ + TÊN MÁY RẤT TO (font bìa, màu `bia_mau` của theme) ở trên, slogan 2 dòng giữa,
  1–3 máy xòe quạt giữa trang (máy giữa thẳng nằm trên, 2 máy bên nghiêng ±9°), 2 thông số 2 bên (số to + nhãn viền trắng), dòng chữ nhỏ cuối.
- Gọi: `var d = newDoc("Slide 01"); bgPhoto(<ảnh nền>...); biaSanPham({dong: "iPad", ten: "GEN 11", sl1: "...", sl2: "...", may: ["a.png", "b.png", "c.png"], trai: ["A16", "Chip mạnh"], phai: ["128GB", "Bộ nhớ"], chan: "..."}); save(d, 1);`
  `may` là ảnh máy đã tách nền trong thư mục ảnh của bài (iPad `A`, Laptop `TN`). Tên máy ≤ 8 ký tự cho to; số / nhãn 2 bên ngắn (≤ 6 / ≤ 12 ký tự). Chữ là của shop, không chép chữ mẫu.
- Theme glass: bìa nên dùng bố cục này.

## Bìa kiểu tính năng `biaTinhNang(o)` và bìa tối giản `biaToiGian(o)` (fen 12/11 21h34–21h52, ảnh mẫu fen gửi)
- `biaTinhNang({t1, t2, mo: "dòng 1\rdòng 2", so: "M2", may: ["a.png", "b.png"], kieu: "nho-to"?, xoay?})`: 2 dòng tiêu đề giữa, chữ / số rất to mờ phía sau, 1–2 máy to nghiêng tràn mép dưới.
  `kieu: "nho-to"`: dòng 1 nhỏ trắng, dòng 2 rất to màu nhấn (chuyển sắc nếu theme có `bia_sac`). Theme phẳng / tối dùng kiểu này.
- `biaToiGian({ten, mo: ["dòng 1", "dòng 2", "dòng 3"], may: "a.png", hop: [trái, trên, rộng]})`: nền đen, tên máy chữ mảnh căn trái, 2 gạch ngắn kẹp mô tả, ảnh cận 1 góc máy (cụm camera) phóng rất to tràn góc dưới phải. Theme "Tối giản · Đen" dùng kiểu này.
- Bìa mặc định của từng theme: xem `theme.json` mục `xem` (`bia_sp` / `bia_tn` / `bia_tg` / `bia_tiem` / `bia_anh`).

## Theme "Tiệm Poly · Vẽ tay" (`tiem-ve-tay`, fen 13/11 18h01 gửi 5 ảnh tiệm Poly Store vẽ tay + "tạo theme pts")
- Bìa **luôn** dùng `biaTiem(o)` ngay sau `newDoc`: ảnh tiệm vẽ tay ~2/3 trên (mép dưới lượn như mái hiên), dưới là giấy be ghi tiêu đề chữ tròn xanh lá viền kem + nâu, 1 dòng nhỏ nâu.
  `biaTiem({loai: "ipad" | "iphone" | "laptop" | "macbook" | "chung", t1: "dòng 1", t2: "dòng 2", nho: "dòng nhỏ"})`. Chọn `loai` theo máy chính của bài:
  iPad → `ipad`, iPhone → `iphone`, MacBook → `macbook`, laptop Windows (ThinkPad, Dell…) → `laptop`, bài chung / nhiều loại → `chung`. Ảnh ở `theme-ps/tiem-ve-tay/anh/` (build.py tự gắn `THEME_DIR`).
  Bìa không thêm ảnh máy, không "POLY STORE" (biển hiệu đã có trong ảnh). t1 / t2 mỗi dòng ≤ 16 ký tự cho to; dòng nhỏ ≤ 40 ký tự.
- Trang trong: `newDoc` tự vẽ tường giấy be hạt sáp màu + mái hiên xanh mép lượn trên cùng + bảng xanh lá (như biển hiệu, viền nâu) phủ gần kín trang: chữ, thẻ, ô ghi chú đặt trên bảng như mọi theme tối (chữ `C.WHITE`).
  Không đặt gì ra ngoài bảng (lề 36px, trên 62px). Màu nhấn: `YEL2`/`YEL` vàng đèn, `C.GREEN_L` xanh trời (tên máy, số), nhãn `C.GREEN` đỏ ngói.

## Theme "Ảnh thật · Chữ vàng" (`anh-that-chu-vang`, fen 14/11 gửi ảnh mẫu TikTok + "style kiểu có ảnh thật r thumbnail")
- Bìa **luôn** dùng `biaAnhThat(o)` ngay sau `newDoc` (không gọi `bgPhoto` trước): ảnh thật của bài phủ kín trang, không làm mờ, không thêm ảnh máy tách nền, chữ thumbnail đè lên ảnh.
  `biaAnhThat({anh: "ten-anh.jpg", cat: [rộngẢnh, cắtTrái, cắtTrên, cắtRộng]?, tam: [x, y]?, t1: "iPad lag?", t2: "dòng 2"?, nho: "Thử ngay mẹo này.", vi_tri: "giua" | "tren" | "duoi"?})`.
  `anh`: ảnh chụp thật hợp chủ đề (tay cầm máy, người dùng máy ở quán / bàn học, máy trên bàn…), tìm theo thứ tự: thư mục ảnh của bài (iPad `A`, Laptop `TN`) rồi "E:/Social Claude/Anh tai ve/"; đường dẫn đầy đủ cũng được.
  `cat` giống `bgPhoto` (khung dọc 3:4: cắtRộng × 4/3 ≤ cao ảnh); không có `cat` thì tự cắt phủ kín, `tam` (0..1) là điểm giữ ở giữa trang. Chọn khung để máy / tay / người nằm ngoài chỗ đặt chữ.
  `vi_tri`: đặt chữ vào chỗ trống của ảnh (mặc định ở giữa). Không có ảnh thật hợp thì tìm tải ảnh (Unsplash / Pexels) rồi mới dựng, không dùng ảnh máy tách nền làm bìa.
  t1 ngắn như câu hỏi / vấn đề (≤ 16 ký tự), `nho` ≤ 30 ký tự (gợi tò mò: "Thử ngay mẹo này."). "POLY STORE" nhỏ tự ghi trên cùng.
  t1 vàng rất to chữ hẹp giãn chữ viền tối mảnh, t2 (nếu có) trắng, `nho` nghiêng có chân trắng.
- Trang trong: nền là ảnh thật của bài làm mờ + tối lại (`bgPhoto` / `headC` như theme glass, mỗi slide 1 ảnh hợp nội dung, nên dùng lại ảnh bìa hoặc ảnh cùng bối cảnh). Thẻ `glass()` = khung đen trong (không viền, không bóng).
  Tiêu đề (`F.T`) vàng viền tối mảnh; dòng "Phụ đề" tự đổi sang chữ nghiêng có chân trắng. Nhãn vàng chữ đen, dấu tích vàng.
  Ô ghi chú nền vàng chữ đen. Chữ thường `C.WHITE`, chữ nhấn `YEL2` / `YEL`, tên máy / số `C.GREEN_L` (vàng).

## 3 theme ảnh thật thêm (fen 14/11 13h30 gửi lại ảnh mẫu "iPhone lag?" + "xoay quanh style này làm 3 theme cho photoshop")
Trang trong cả 3 như "Ảnh thật · Chữ vàng" (ảnh thật làm mờ + tối, khung đen trong, nhãn vàng chữ đen, dấu tích vàng), tiêu đề trắng. Bìa:
- **"Ảnh thật · Đáy tối"** (`anh-that-day-toi`): `biaAnhThat({anh, tam?, t1, t2?, nho})` — ảnh phủ kín, lớp tối mờ dần ở đáy (`bia_day: [cao, độ đậm]`),
  chữ căn trái góc dưới (`bia_can: "trai"`, `bia_vi_tri: "duoi"`): t1 trắng, t2 vàng (để từ khoá: "iPad" / "chậm hẳn?"), `nho` nghiêng trắng. Chọn ảnh có chỗ trống / nền tối ở 1/3 dưới.
- **"Ảnh thật · Nền sáng"** (`anh-that-nen-sang`): bìa **gọi `biaAnhKhung(o)`** (không phải biaAnhThat): nền kem, ảnh thật trong ô bo góc phía trên (y 150–860),
  `biaAnhKhung({anh, tam?, t1, t2?, nho, vach?: 1 | 2})`: tiêu đề chữ hẹp đen căn trái dưới ảnh, vạch vàng tô nửa dưới dòng `vach` (mặc định dòng cuối), `nho` nghiêng xám.
  Ảnh nên ngang (vùng ảnh 960×710). Trang trong: ảnh mờ nằm trong khung kem (`trang_tri: "khung"`), nội dung giữ trong lề 36 / 62 px như thường.
- **"Ảnh thật · Chữ nghiêng"** (`anh-that-chu-nghieng`): `biaAnhThat({anh, tam?, tren: "MẸO IPAD", t1, nho})` — kiểu bìa tạp chí: ảnh tối lại 38%,
  `tren` = dòng nhỏ chữ hẹp vàng giãn chữ trên tiêu đề (≤ 14 ký tự), t1 chữ nghiêng có chân trắng rất to (≤ 16 ký tự), `nho` chữ thường trắng. Tiêu đề trang trong cũng chữ nghiêng có chân.
- Động cơ (dùng được cho theme khác): `themeDayToi(cao, op)` lớp tô chuyển sắc đen → trong (lỗi thì vẽ 24 dải), `themeKhungSang(l, t, r, b, rad, màu)` khung màu có ô bo góc,
  `biaAnhThat` nhận `tren` (font `F.K` = `font_kicker`), `THEME.bia_can` / `bia_x` / `bia_day`.

## Chú thích vẽ tay `anhChuThich(o)` / `chuThich(ds, o)` (fen 14/11 13h48 gửi ảnh mẫu iPad Pro M5 + phím + Pencil + sạc có chữ viết tay, mũi tên, giá gạch chân)
Theme Photoshop nào cũng gọi được. Dùng cho slide ảnh thật có món đồ cần chỉ: "trong hộp có gì", combo máy + phụ kiện, các màu / bản dung lượng kèm giá, chi tiết trên máy (cổng, camera, nút).
Chữ viết tay (font `FTAY`: Ink Free, có dấu tiếng Việt; theme đổi bằng `font_tay`), mũi tên cong vẽ tay, giá có 2 gạch chân, tuỳ chọn viền quanh món đồ như cắt dán sticker.
- Cả trang: `newDoc` → `anhChuThich({ anh, tam?, thu?, cy?, toi?, vien?, mau, co?, ds: [...] })`.
  `anh` tìm như bìa ảnh thật (thư mục ảnh của bài rồi "Anh tai ve"). `thu: 1` ảnh phủ kín trang (`tam` giữ điểm ở giữa); `thu` 0.7–0.85 thu nhỏ ảnh cho rộng chỗ ghi chữ,
  nền trang tự lấy màu góc ảnh, mép ảnh mờ dần (chỉ dùng khi ảnh nền trơn: nền đen, nền trắng, phông studio). `cy` tâm ảnh theo chiều dọc khi thu nhỏ.
  `vien: true` = viền quanh món đồ (Photoshop tự chọn chủ thể): chỉ bật khi món đồ nằm trên nền trơn, ảnh rối thì để tắt. `toi` 0–40 làm tối ảnh nếu chữ trắng khó đọc.
  `mau`: ảnh tối → "FFFFFF", ảnh sáng → "1C1C1C" (chữ, mũi tên, gạch chân, viền cùng 1 màu).
- Mỗi mục `ds`: `{ chu: "iPad Pro M5 11\"\r256GB", gia: "24tr500", o: [x, y], toi: [x, y], can?, xoay?, tu?, huong?, co? }`
  - Toạ độ `o` (góc trên trái cụm chữ; `can: "phai"` góc trên phải, `"giua"` giữa trên) và `toi` (đầu mũi tên): số ≤ 1 là tỉ lệ trên **ảnh gốc** (x / rộng ảnh, y / cao ảnh),
    số > 1 là px trên trang 1080×1440. Cách làm: mở ảnh gốc (Read) xem món đồ nằm đâu, ước tỉ lệ; đặt `o` vào chỗ trống của ảnh, `toi` ngay mép món đồ (không giữa món đồ).
  - `gia` tự thêm "giá: " phía trước (đổi bằng `gia_chu`, `""` = bỏ). Giá viết kiểu "24tr500", "2tr", "1tr500". Không có giá thì bỏ `gia`.
  - `xoay` mặc định nghiêng −2…−4° như viết tay; `tu` (`"duoi"` | `"tren"` | `"trai"` | `"phai"`) cạnh mũi tên đi ra, mặc định tự chọn; `huong: "doc"` nếu muốn mũi tên cắm ngang.
- Trên trang đã có ảnh (bìa ảnh thật, `bgPhoto`...): `chuThich(ds, { mau, co })`, toạ độ px trên trang.
- Luật: tối đa 4 chú thích / trang, mỗi cái ≤ 3 dòng, ≤ 18 ký tự / dòng. Chữ nằm trên chỗ trống của ảnh, không đè lên món đồ, không đè lên nhau; mũi tên không cắt qua chữ khác.
  Cỡ chữ mặc định 46 (`co`), tối thiểu 38. Không thêm khung, bóng, emoji quanh chữ. Giá phải đúng giá bài (không bịa); bài không nói giá thì bỏ `gia`.
- Agent duyệt chấm thêm: chữ viết tay đọc rõ (tương phản với ảnh), mũi tên chỉ đúng món, không đè, dấu tiếng Việt đủ.

## Khi viết slide
- Theme phẳng: không đặt ảnh phủ kín trang (ảnh nền mờ, `bg-thumb.png`, `lopBia` có nền): nền phẳng của theme là nền. Theme glass và theme ảnh thật: xem mục trên (dùng `bgPhoto`, không dùng `bg-thumb` / `lopBia` có nền; bìa theme ảnh thật là `biaAnhThat`). Bìa: `newDoc` → "POLY STORE" → tiêu đề → ảnh máy tách nền (`devIn` / `placeAt`), không khung, không bóng.
- Màu: chỉ dùng biến (`C.WHITE` chữ thường, `YEL2` iPad / `YEL` Laptop cho chữ nhấn, `C.GREEN_L` tên máy / số nổi bật, `C.GREEN` nhãn, `MINT` + `NAVY` ô ghi chú). Không ghi mã màu cứng trong slide.
- Font: chỉ `F.T` (tiêu đề, giá, câu hỏi cuối), `F.B` (thân, nhãn). Không gọi tên font cụ thể.
- Không tự thêm hiệu ứng nổi khối: bóng đổ, phát sáng, kính mờ, vát, gradient. Phẳng, màu đặc.
- Bố cục, nội dung, ảnh máy, câu móc, slide cuối (1 thẻ câu hỏi): vẫn theo luật kênh. Chữ trong lề 96–984, tránh vùng hình trang trí ở góc.

## Agent thiết kế / agent duyệt
- Chấm màu, font, nền theo theme này (đọc `theme.json` của theme), **không** theo theme kênh: không bắt lỗi "nền 1 màu trơn", "thiếu nền ảnh mờ", "thiếu glow / bóng", "font khác UTM-Cookies / Source Serif".
- Vẫn chấm: chữ tràn / đè / lệch, khoảng trống, ảnh đúng máy, chính tả, số liệu, giá, caption.
