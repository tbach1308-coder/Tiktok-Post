# Luật dựng bài bằng theme Photoshop (kho chung app Poly Dựng Bài)

Fen 12/11/2026: "thiết kế template kho chung bằng photoshop", "thiết kế đừng 3d quá", "cho thêm theme kiểu glass". Theme = bộ phong cách: màu, font, nền, thẻ — **phẳng** (nền màu đặc) hoặc **glass** (ảnh nền mờ + thẻ kính), đều không bóng đổ.
Mỗi theme ở `theme-ps/<id>/` (thư mục app): `theme.json` (bảng màu, font), `theme.jsx` (tự tạo bằng `theme-ps/tao.py`), `xem/slide-01..03.png` (ảnh xem trước).

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

## Khi viết slide
- Theme phẳng: không đặt ảnh phủ kín trang (ảnh nền mờ, `bg-thumb.png`, `lopBia` có nền): nền phẳng của theme là nền. Theme glass: xem mục trên (dùng `bgPhoto`, không dùng `bg-thumb` / `lopBia` có nền). Bìa: `newDoc` → "POLY STORE" → tiêu đề → ảnh máy tách nền (`devIn` / `placeAt`), không khung, không bóng.
- Màu: chỉ dùng biến (`C.WHITE` chữ thường, `YEL2` iPad / `YEL` Laptop cho chữ nhấn, `C.GREEN_L` tên máy / số nổi bật, `C.GREEN` nhãn, `MINT` + `NAVY` ô ghi chú). Không ghi mã màu cứng trong slide.
- Font: chỉ `F.T` (tiêu đề, giá, câu hỏi cuối), `F.B` (thân, nhãn). Không gọi tên font cụ thể.
- Không tự thêm hiệu ứng nổi khối: bóng đổ, phát sáng, kính mờ, vát, gradient. Phẳng, màu đặc.
- Bố cục, nội dung, ảnh máy, câu móc, slide cuối (1 thẻ câu hỏi): vẫn theo luật kênh. Chữ trong lề 96–984, tránh vùng hình trang trí ở góc.

## Agent thiết kế / agent duyệt
- Chấm màu, font, nền theo theme này (đọc `theme.json` của theme), **không** theo theme kênh: không bắt lỗi "nền 1 màu trơn", "thiếu nền ảnh mờ", "thiếu glow / bóng", "font khác UTM-Cookies / Source Serif".
- Vẫn chấm: chữ tràn / đè / lệch, khoảng trống, ảnh đúng máy, chính tả, số liệu, giá, caption.
