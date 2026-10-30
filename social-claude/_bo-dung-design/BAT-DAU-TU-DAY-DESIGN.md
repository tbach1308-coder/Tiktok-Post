# BẮT ĐẦU TỪ ĐÂY (Design) – Dựng slide TikTok Poly Store, cả 2 kênh

Sổ này tóm tắt + trích số luật; luật đủ ở `E:\Social Claude\POLY-quy-tac-lam-content.md` mục 12 (file đó thắng khi lệch). Luật nào ở file nào, đổi 1 luật phải sửa file nào: `SO-DO-LUAT.md` cùng thư mục.

Cập nhật: 30/10/2026 (đồng bộ luật theo `SO-DO-LUAT.md`: slide cuối 16h theo kênh, Photoshop 11b, ảnh minh họa 16i/16j; 13h20 fen chốt: ngoại lệ chụp màn hình 11b/18, cấm Claude in Chrome 19, không duyệt vòng 2, bìa 16g/17c, tin hot iPad 1d). 28/10/2026 19h40 (thêm mục 1b Luật làm nhanh; Photoshop dựng nhanh gấp ~2 lần; duyệt 1 vòng; giá chỉ ghi khi fen cần). **Gom tab "Design - Photoshop - Laptop" và tab "Design - Photoshop - iPad" về 1 quy trình, 1 bộ code, 1 bộ luật**; thêm app **Poly Dựng Bài**. Claude mới nhận việc **dựng slide** (kênh nào cũng vậy) thì đọc hết file này, rồi nói ngắn với chủ shop là đã nắm việc và làm tiếp như người cũ.
Viết nội dung (chủ đề, chữ từng slide, caption) là việc của chat content: xem `BAT-DAU-TU-DAY.md`.

Bản này nằm 2 chỗ, giữ giống nhau: Project "Makerting - Poly" (`claude/BAT-DAU-TU-DAY-DESIGN.md`) và máy shop `E:\Social Claude\_bo-dung-design\BAT-DAU-TU-DAY-DESIGN.md`.

---

## 0. Dựng bằng gì (theo thứ tự ưu tiên)
1. **App Poly Dựng Bài** (icon "Poly Dung Bai" ngoài Desktop máy shop, code `E:\Tool\poly-dung-bai`). Fen chọn kênh, dán brief, kéo ảnh, bấm Chạy. App gọi Claude Code + plugin `poly-carousel` chạy ngầm ngay trên máy: biên tập, kiểm thông tin, dựng, soi, duyệt. App hiện tiến độ từng bước, nhật ký, slide, dòng "Đã đổi so với brief" và ô "Claude hỏi fen" (nút bấm chọn); có ô Sửa (chọn slide, gõ yêu cầu). Không có bảng final. Chạy nhiều bài cùng lúc được. Cần đăng nhập Claude Code 1 lần (nút Đăng nhập trên app). Hướng dẫn: `E:\Tool\poly-dung-bai\HUONG-DAN.txt`.
2. **Claude Code gõ tay** trên máy shop: `/poly-carousel:dung-bai`, `/poly-carousel:sua-bai`, `/poly-carousel:do-trung-anh` (`_bo-dung-design\plugin\HUONG-DAN.md`).
3. **Chat claude.ai** (tab Design): chỉ dùng khi 2 cách trên không chạy được. Làm đúng quy trình mục 2 với bộ code trên ổ E (chép vào container, build, đẩy `.jsx` vào hàng chờ `_tu-chay`).

Cả 3 cách dùng chung luật (mục 3–5), chung bộ code (mục 7) và cùng ghi luật mới vào 1 file quy tắc.

## 1. Cách làm việc fen muốn
- Gọi chủ shop là **"fen"**, trả lời tiếng Việt, ngắn.
- Fen gửi brief từng slide → **tự làm hết, không hỏi giữa chừng**. Chỗ chưa rõ thì tự chọn phương án hợp lý nhất và ghi vào bảng final.
- **Agent:** biên tập + kiểm thông tin (chạy song song, trước khi dựng) → dựng (phiên chính, hoặc 1 agent mỗi bài khi làm nhiều bài) → thiết kế + duyệt (song song, agent mới, chưa thấy quá trình dựng; trả "ĐẠT" hoặc danh sách lỗi).
- Thường duyệt 1 vòng, sửa lỗi rồi giao **1 lần** kèm ảnh slide và bảng final (Slide · Nội dung · Ảnh dùng (nguồn) · Câu móc · Đã sửa / tự quyết / cần fen xác nhận).
- Fen sửa gì thì ghi vào **mục 12 "Logic rút ra" + bảng Lịch sử sửa** của file quy tắc (`E:\Social Claude\POLY-quy-tac-lam-content.md` = Project `claude/quy-tac-lam-content-poly.md`). Luật chỉ cho 1 kênh thì ghi [Laptop] / [iPad]. Rồi sửa các file con theo `SO-DO-LUAT.md`.
- Fen nói "stop" hay "mai làm tiếp" là dừng ngay, ghi lại chỗ đang dở.

## 1b. Luật làm nhanh (đo từ bài mini 8 ngày 28/10: 31 phút; mục tiêu ≤ 15 phút/bài)
Áp cho cả app, Claude Code gõ tay và chat. Mỗi dòng ghi chỗ đã tốn thời gian.
1. **Đọc ít, đọc đúng chỗ.** Đọc sổ này (mục 1b, 2, 3 + mục kênh) và mục 12 file quy tắc. Viết slide thì đọc `ipad/API.md` hoặc `code/API-laptop.md`, kèm 1 bài gần nhất cùng kiểu. **Không đọc lại cả thư viện** (`poly-lib.jsx` 40KB; bài mini 8 đọc 3 lần).
2. **Song song ngay từ đầu.** Gọi agent biên tập + kiểm thông tin xong là đi tìm ảnh luôn, không ngồi chờ.
3. **Xem nhiều ảnh trong 1 lần.** `python prep/xem_nhanh.py "<ra.jpg>" "<thư mục hoặc ảnh>" ...` ghép thành 1 bảng có tên file + cỡ gốc, rồi Read 1 lần. Bài mini 8 Read 34 ảnh từng cái, mỗi lần là 1 lượt chờ.
4. **Gom lệnh.** Tải mọi ảnh trong 1 file Python (danh sách URL). Tách nền mọi ảnh trong 1 lệnh `tach_nen_ps.py`. Dò trùng 1 lệnh trước khi dựng. Soi 1 lệnh `soi_tat_ca.py` sau khi dựng.
5. **Dựng 1 lần đủ bài**, lệnh chờ Photoshop thì chạy nền. Photoshop từ 28/10: iPad ~15 giây/slide, Laptop ~10 giây/slide.
6. **Duyệt 1 vòng.** Bản đầu xong là gọi ngay thiết kế + duyệt song song, chưa tự sửa và dựng lại trước. Có kết quả thì sửa gộp, dựng lại 1 lần đúng slide lỗi. Không duyệt vòng 2, không dựng lại chỉ vì mục "nên sửa" sau khi đã ĐẠT. Bài mini 8 mất thêm ~6 phút vì 1 vòng dựng + 1 vòng duyệt thừa.
7. **Viết lệnh để không bị chặn quyền** (chạy ngầm không ai bấm cho phép; bài mini 8 bị chặn 12 lần):
   - Mỗi lệnh 1 việc, đường dẫn đầy đủ trong ngoặc kép.
   - Không dùng biến `$B`, `{a,b}`, vòng `for`, `\ `, không ghi ra `/tmp`.
   - Python dài thì ghi ra file `.py` rồi chạy.
   - Không dùng PowerShell có biến hay khối `{ }`.
   - Không đọc trong `C:\Users\Dao\.claude`.
8. **Giao việc cho agent con gọn:** đưa đủ đường dẫn tuyệt đối và những gì đã chốt, để agent khỏi đi tìm lại. Dặn agent trả bảng lỗi ngắn, không viết lại cả bài.
9. **Không hỏi giữa chừng.** Việc chỉ fen quyết được thì để cuối bài. Chạy từ app: dòng `HOI_FEN:` hiện thành nút cho fen bấm. Chat: hỏi bằng lựa chọn.
10. **Câu cuối ngắn.** Chạy từ app: 1–3 câu + `Đã đổi so với brief: …` nếu có + `THU_MUC_BAI=`. Chat / Claude Code tay: bảng final gọn, không kể lại quá trình.
11. **Giá:** chỉ ghi khi brief có giá hoặc fen nhắn cần giá. Không tự thêm, không tự đổi chữ giá fen viết (fen chốt 28/10).

## 2. Quy trình 1 bài (chung 2 kênh)
Mục tiêu: **1 lần dựng đủ, 1 vòng duyệt, 1 lần giao.** Lỗi ảnh phải bắt TRƯỚC khi chạy Photoshop.

| Bước | Việc |
|---|---|
| 1 | Câu đầu báo fen đang làm bài gì, kênh nào. Tạo task list. Tạo thư mục bài. |
| 2 | Gọi song song agent **biên tập** + **kiểm thông tin** (đưa brief gốc + kênh). |
| 3 | **Kê ảnh từng slide**: ảnh fen gửi kèm trước, rồi ảnh shop (mục 6). Slide nào cần ảnh shop mà **không có** → nói 1 dòng "chưa có ảnh X, dùng tạm Y, fen có thì gửi" rồi làm tiếp, **không chờ** (ảnh tạm không ghi chữ "ảnh minh họa" trên hình, chỉ ghi log / bảng final, luật 16i, 16k; xoá chữ / logo thương hiệu trên ảnh minh họa, luật 16j). |
| 4 | Lấy ảnh hãng **đúng độ phân giải gốc** (mục 8), không phải phóng to. |
| 5 | Tách nền bằng Photoshop (`code/tach_nen_ps.py`, gom mọi ảnh 1 lệnh) hoặc ngưỡng (`prep/tach_nen.py --thr 242`, máy đen `--thr 150 --bong 90`). Tỉ lệ in ra > 1.0 là đang phóng to → quay lại bước 4. |
| 6 | Nhận brief đã biên tập, viết phần slide từ mẫu gần nhất của kênh (mục 4 / 5). |
| 7 | **Tự soi trước khi dựng**: Laptop `prep/kiem_anh.py tai-nguyen ...` → `OK 0` + xem `soi-vien.png`; iPad ghép mọi ảnh máy đã cắt bằng `prep/xem_nhanh.py` rồi soi viền nhôm, mép cắt trong 1 lần Read. |
| 7b | **Dò trùng ảnh (luật 16d), cả 2 kênh**: `prep/trung_anh.py kiem <thư mục ảnh> <TenThuMucBai>` → không còn "TRUNG" (trừ ảnh fen gửi, ghi vào bảng final). Sổ ảnh có cả bài Laptop và iPad (440 ảnh, 28/10). |
| 8 | Build (mục 4 / 5) → đưa `.jsx` vào `_tu-chay` (`code/chay_ps.py` tự đưa và chờ, chạy nền). Từ 28/10 18h: Laptop ~10 giây/slide, iPad ~15 giây/slide (trước 22 và 40). Chờ **1 lần** rồi đọc `log\vN.log`. |
| 9 | Bản dựng đầu xong: soi bằng **1 lệnh** `python prep/soi_tat_ca.py "<thư mục bài>" vN --them "<thư mục ảnh tải về>"` (chạy `kiem_anh slide` → `log/tong.png`, `kiem_bo_cuc` phải 0, iPad `nghiem-thu`, dò trùng cả nền mờ; in dòng TỔNG, mã 0 = sạch; từ 28/10 `kiem_bo_cuc` không báo lệch tâm ở bìa vì bìa căn trái), rồi gọi **ngay, song song** agent **thiết kế** và agent **duyệt** (mới). **Không tự sửa rồi dựng lại trước khi 2 agent trả** (bài 29/10 mini 8 mất thêm 1 vòng dựng vì vậy): lỗi công cụ báo thì sửa sẵn trong file slide, chờ gộp. Đưa agent: kênh, đường dẫn slide, file phần slide, nguồn + cỡ gốc từng ảnh, quyết định đã chốt. |
| 10 | Sửa gộp mọi lỗi (công cụ + thiết kế + duyệt) → build lại **1 lần, chỉ slide lỗi** → soi lại bằng `soi_tat_ca.py`. **Không duyệt vòng 2**; có đổi số liệu thì tự tra lại đúng chỗ đó. Đã ĐẠT thì không làm thêm mục "nên sửa" nào phải dựng lại Photoshop. |
| 11 | Giao 1 lần: slide + bảng final (bài chạy từ app Poly Dựng Bài: chỉ 1–3 câu, app không hiện bảng final). Chạy `prep/trung_anh.py them "E:/Social Claude/<Laptop hoặc iPad>"` thêm ảnh bài mới vào sổ. |

## 3. Luật dựng chung 2 kênh (bản đủ là mục 12 file quy tắc)
- **Khổ:** 1080x1440, 150 dpi, lưu PNG + PSD (`slide-01` … `slide-0N`).
- **Bìa (thumbnail):**
  - Nền xanh lá tối `bg-thumb.png` (có sẵn trong `tai-nguyen` các bài gần đây; bản gốc `E:\Social Claude\iPad\T10_3iPadDangMua_11-10\tai-nguyen\anh-that\bg-thumb.png`).
  - "POLY STORE" nhỏ góc trên trái; tiêu đề vàng Source Serif Black, VIẾT HOA, **căn trái** thẳng "POLY STORE"; dòng phụ nghiêng trắng, không icon/emoji cuối.
  - **Ngắn gọn, gây tò mò, vào thẳng vấn đề (luật 17b, 29/10, 30/10):** chữ đầu là đúng chủ đề / máy / vấn đề, không dạo đầu; để hở 1 điều cho slide trong trả lời. Tiêu đề tối đa 6 chữ (1–2 dòng), dòng phụ tối đa 6 chữ hoặc bỏ, câu móc bìa laptop tối đa 5 chữ, cả bìa khoảng 12 chữ; ý dài để slide 2. Tiêu đề ngắn thì dùng cỡ to trong khung 90–104.
  - **1 ảnh đại diện** ([Laptop] luật 16, 18c; [iPad] so sánh thì 2 máy, xòe quạt 3 máy), khớp đúng chữ trong tiêu đề (bài app thì máy mở app, bài pin thì màn pin). Có người thì ưu tiên người Việt/châu Á.
  - **Bố cục bìa (luật 17c, 29/10): sáng tạo, to nhỏ phù hợp, không "gắn ảnh vô cho có".** Không đặt ảnh máy trong khung viền trắng / mảng studio xám giữa nền. Máy tách nền đặt thẳng lên bg-thumb + bóng mềm + vệt sáng màu ý bài; 1 máy chiếm 35–62% khung (2–3 máy ≥ 20%); trống trên / dưới ảnh ≤ 160px (mọi bìa, kể cả so sánh iPad); nghiêng 4–14° hoặc góc 3/4; được lấn sau tiêu đề, tràn mép ≤ 30% máy ([Laptop] ≤ 10%, 1 mép, thấy gần trọn máy, fen 30/10 15h15). Chọn 1 bố cục, khác 2 bìa gần nhất cùng kênh (sổ `noi-dung/bia-da-lam.md`); riêng bìa so sánh 2 máy [iPad] được lặp A, đổi kiểu bên trong (17c):

    | Bố cục | Hợp bài | Đặt thế nào (khung 1080x1440, tiêu đề y ~140–480) |
    |---|---|---|
    | B Hero tràn | 1 máy: giới thiệu, so sánh (Laptop chọn 1 máy đại diện, luật 18c) | máy rộng 950–1150 ([Laptop] 850–980, ra ngoài khung ≤ 10%, luật 17c), tâm x 560–640 y 880–960, nghiêng -6…-12°, tràn mép phải / đáy ít; tiêu đề căn trái; 1 sticker trắng nghiêng nói ý chính |
    | C Cận chi tiết | mẹo, lỗi, linh kiện (phím, cổng, pin, card) | đúng thứ bài nói (bàn phím tô phím, card, màn pin) to 900–1100, nghiêng 8–15°, lấn sau tiêu đề được; sticker xanh nói ý |
    | D Cầm tay / đời thật | dùng thực tế, sinh viên, chụp ở shop | ảnh thường `anh=…@0,520,1080,mo=tren:220` tràn ngang, mờ viền trên vào nền, đáy ra mép; người Việt / châu Á |
    | F Sticker chú thích | nhiều ý / ngành / app trên 1 máy | máy giữa rộng 760–900 + 3–4 sticker nghiêng ±4–8° quanh máy, không che màn hình chính, không vào cột nút TikTok |
    | G Số to | top N, ngân sách, bảng giá tháng | `soTo("5", 720, 900, 640, 18)` mờ phía sau, máy tách nền đè lên |
    | A Đối đầu [iPad] | so sánh 2 máy (luật 16g); được lặp, nhưng đổi kiểu so với 2 bìa gần nhất (góc nghiêng, vị trí 2 máy, màu vệt sáng) | 2 máy cùng cỡ, nghiêng đối xứng, không chồng, vệt sáng 2 màu; **không huy hiệu VS** (fen bỏ 30/10, 16g) |
    | E Xòe quạt [iPad] | 3 máy (tầm tiền, bảng giá) | máy giữa thẳng to nằm trên, 2 bên nghiêng ±10–14° cùng cỡ ×0,85 |

    Cách làm: tách nền (bước 5) → `python "KIT/prep/bia_lop.py" "<bài>/tai-nguyen/bia-lop.png" "may=<máy.png>@600,920,1020,xoay=-8,sang=EF4444" --nen "<bg-thumb.png>" --xem "<bài>/log/bia-xem.jpg" --kenh laptop --chu <đáy tiêu đề> [--vung l,t,r,b cho sticker / VS]` → Read `bia-xem.jpg` (có vạch vùng tiêu đề, câu móc, cột nút TikTok), chỉnh số tới khi ra `DAT luat bia 17c` → trong slide bìa: `$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));` rồi nền bg-thumb → `soTo()` (nếu có) → `lopBia(TN + "bia-lop.png")` (iPad `lopBia(A + "bia-lop.png")`) → chữ tiêu đề → `sticker(chữ, cx, cy, xoay, "trang"|"xanh"|"vang"|"do"|"xanhduong")`, `vsBadge(cx, cy, r, xoay)` ([iPad] không dùng trên bìa, fen bỏ 30/10, 16g), `muiTen(x1, y1, x2, y2)` → câu móc. Mẫu chạy được: `slides/_bia_mau_slides.jsx` (ra `Laptop\_bia-mau`). Xong bài ghi 1 dòng vào `noi-dung/bia-da-lam.md`.
  - Không giá, không huy hiệu/icon trang trí trên ảnh máy, không pill.
- **Slide trong:** nền ảnh thật đúng chủ đề làm mờ (Gaussian 22) + phủ tối (×0,62; ảnh chụp ở shop ×0,40). Mỗi slide 1 ảnh khác nhau, chưa dùng ở bài cũ. Không nền 1 màu trơn, không nền đốm tự vẽ. Ảnh máy to, rõ, là nhân vật chính; chữ phụ không cần to.
- **Câu móc:** đáy mọi slide trừ slide cuối, dẫn đúng sang slide kế. Không ghi 👉 trong chữ (pill tự có).
- **Slide cuối (luật 16h, 30/10):** chỉ chữ, không ảnh, không địa chỉ; câu hỏi chọn ngắn ≤ 2 dòng, giữ đúng chữ fen viết, không tự thêm dòng khác ("COMMENT TÊN MÁY", dòng xanh… đã bị fen bắt bỏ); không dòng kêu gọi comment kiểu "Comment kèm ngân sách, Poly chọn máy 👇" / "Comment, Poly tư vấn 👇" (fen bỏ 30/10 11h; brief có dòng đó thì bỏ khi dựng).
  - Cả 2 kênh: chỉ 1 thẻ kính câu hỏi căn giữa slide (y ~520–920), **không `khoiFollow`, không dòng "Follow để …", không nút Follow, không mũi tên, không dòng "Bấm dấu + ở avatar bên phải", không gộp Follow vào thẻ câu hỏi** ([iPad] fen chốt 30/10 12h30, [Laptop] fen bỏ 30/10 15h22, nhắc lần 3 17h22, luật 16h). Soi PNG slide cuối trước khi giao: còn chữ "Follow" / nút xanh / mũi tên thì dựng lại. Mẫu `slides/_bia_mau_slides.jsx` hàm `t4` còn khối Follow, không làm theo. Mục 4, 5.
- **Giá:** chỉ ghi ở bài báo giá (nhỏ, chữ xanh, không có chữ "Giá"). Bài nhiều máy (top, gaming, theo nghề) không ghi giá. Gọi tên máy thật, không "máy A/B/C".
- **Ảnh máy:** ưu tiên ảnh fen gửi / ảnh chụp ở shop; không có thì ảnh hãng. Các máy trong 1 bài cùng kiểu ảnh (cùng góc, cùng nền studio tối, cùng cỡ). Tách nền giữ đúng tỉ lệ (từng có lỗi ZBook bị bóp méo), bỏ bóng xám dưới đế, soi viền trắng lem.
- **Không được có:** logo Apple; logo hay watermark shop khác; serial, mã QR; tên tài khoản trên ảnh chụp màn hình; ảnh AI; tên, số điện thoại khách; chữ in, tem, ký hiệu, logo thương hiệu trên ảnh minh họa (xoá bằng script Photoshop qua `_tu-chay`, luật 16j); chữ "ảnh minh họa" trên hình (fen bỏ 30/10, luật 16k).
- **Vùng an toàn:** chữ quan trọng trong x 98–982, y 120–1386; không chữ ở x > 950 trong y 620–1320 (cột nút TikTok). Ảnh được ra sát lề hơn chữ nhưng không tràn khung (trừ bìa: luật 17c cho tràn mép ≤ 30% máy, [Laptop] ≤ 10%).
- **Chữ:** UTM Avo Bold **không có ký tự ← → ✓**: dùng ">" trong chữ, dấu tích vẽ bằng hình. Ngắt dòng thủ công để không chữ mồ côi. Tên màu máy viết tiếng Anh (Sky Blue, Space Gray).
- **Photoshop chỉ chạy bằng script nền (luật 11b, 30/10):** qua hàng chờ `_tu-chay`, **không** dùng điều khiển màn hình / computer use / Cowork để thao tác Photoshop hay app nào trên máy shop, kể cả Chrome thật của fen (fen đang làm việc trên máy). Ngoại lệ duy nhất: chụp màn hình bài mẹo khi fen không dùng máy và đồng ý trước (mục 4, luật 18). Hàng chờ không chạy thì báo fen mở Photoshop, không tự mở bằng điều khiển màn hình.
- **Photoshop:** không đóng file fen đang mở (build 2 kênh chỉ đóng file do script tạo). Script không gọi `app.bringToFront()`: Photoshop chạy nền, không bật lên che việc fen đang làm (đã bỏ khỏi `make-mac-vs-win.jsx` và `ipad/poly-lib.jsx` ngày 28/10). Từ 28/10, `text()` của 2 thư viện tạo lớp chữ bằng 1 lệnh ActionManager (trước gán từng thuộc tính, mỗi chữ ~2 giây; giờ ~0,3 giây), iPad dời cả khối bằng 1 lệnh; lỗi thì tự quay về cách cũ. Viết slide vẫn gọi `text()` như cũ. Bản trước khi đổi: `code/_cu/*-truoc-nhanh-28-10.jsx`.

## 4. Riêng Laptop (@polystorelaptop)
- **Style chuẩn:** bài "MacBook hay Windows" (`Laptop\T10_MacHayWindows_15-10`).
- **Slide trong:** tiêu đề Source Serif Black vàng #FFD60A có glow, phụ đề Source Serif Italic trắng; ảnh khung viền trắng rộng 884; ô kính 1–2 dòng; ô xanh "Hợp với…"; câu móc pill tâm y 1320.
- **Bìa:** có câu móc ở đáy (luật 21/10), tối đa 5 chữ (17b); 1 ảnh đại diện (16, 18c); máy tràn mép ≤ 10%, thấy gần trọn máy (17c, fen 30/10 15h15).
- **So sánh linh kiện / 2 loại máy:** ảnh linh kiện thật cho từng bên (18b); slide kết luận có ảnh minh hoạ từng bên, ảnh card ghi "ảnh card rời" (18c; không chữ "minh họa" trên hình, 16k).
- **Build:** `python code/build.py slides/<bai>_slides.jsx <TenThuMucBai> <ten-script> vN [1,2,4]` (tham số cuối là slide cần dựng lại), rồi `python code/chay_ps.py out/<ten-script>-vN.jsx "<thư mục bài>" vN`.
- **Mẫu slide** (`slides/`):
  - `loivat_slides.jsx`, `khoa3_slides.jsx`, `thaotac5_slides.jsx`: bài mẹo. `headT` (pill, tiêu đề vàng, phụ đề nghiêng), `trickSlide(n, pill, tiêu đề, phụ đề, ảnh, [[loại, chữ]…], câu móc, chiều cao ảnh)`; loại "!" (chấm cam), "ok" (tích xanh), "1/2/3" (số bước).
  - `dungvideo_slides.jsx`, `gaming_slides.jsx`: giới thiệu máy (hãng nhỏ, tên máy vàng, ảnh 884x540, 3 dòng cấu hình, ô "Hợp với").
  - `nganh_slides.jsx`: theo ngành (chip tên app, ô Cần / Sinh viên, ô Máy hợp). `phimtat_slides.jsx`: phím tắt.
  - `top5_25tr_slides.jsx`: top nhiều máy (bìa ảnh shop 884x699, `productSlide` ảnh 884x510 + 3 dòng cấu hình + ô "Hợp với").
  - Khung ảnh `shot(file, 884, 98, top, cao)`: file đúng **884 x cao**, không thì hở.
- **Bài mẹo / phím tắt:** ảnh chụp màn hình thật trên Windows của shop (tiếng Anh, Windows 11, dark mode), **Snipping Tool chế độ Full screen**, PNG 1920x1200 tự lưu vào `C:\Users\Dao\Pictures\Screenshots`. Ai chụp (ngoại lệ 11b, luật 18, fen chốt 30/10): Claude tự chụp CHỈ khi fen không dùng máy và đồng ý trước. Chat: hỏi fen bằng lựa chọn trước khi chụp. App: không tự chụp; dùng ảnh fen gửi, chưa có thì ảnh tạm / vẽ lại (16i), cuối bài `HOI_FEN:` hỏi có để Claude chụp lúc fen rời máy không. Không dùng ảnh zoom của công cụ điều khiển máy (nén JPEG, mờ). Cắt đúng vùng, không phóng quá 1,2 lần. Cửa sổ không chụp được (Device Manager quyền admin, Win+P) thì vẽ lại đúng bố cục ở 2x rồi thu nhỏ, ghi rõ trong bảng final. Cắt bỏ cột "Dao / Local Account" của Settings.
- **Ảnh hãng:** Lenovo PSREF, Dell/HP qua Icecat.
- **Series bảng giá** ("Cập nhật bảng giá laptop tại Poly"): ảnh máy giữa nền đen, tiêu đề trong hộp trắng, thông số sticker trắng không che máy, giá nhỏ xanh; thumbnail chỉ chữ.
- **Slide cuối:** chỉ 1 thẻ kính câu hỏi căn giữa slide (y ~520–920), **không khối Follow** (không `khoiFollow`, không dòng "Follow để …", không nút, không mũi tên, không "Bấm dấu + ở avatar bên phải", không gộp vào thẻ câu hỏi; fen bỏ 30/10 15h22, nhắc lại 17h22), không dòng "Comment …, Poly … 👇", luật 16h. Brief Laptop không có dòng "Follow:".

## 5. Riêng iPad (@poly.store)
- **Style chuẩn:** bài 14 "A16 hay AIR 5?" (`iPad\T10_A16vsAir5_14-10`). Thông số style đủ ở `E:\Social Claude\_template_chuan\README-template-chuan.md`.
- **Thư viện dựng:** `_bo-dung-design\ipad\poly-lib.jsx` + `ipad\build.py` (chuyển từ `_cong-cu` ngày 28/10; đọc `ipad\README.md`). Phần slide của bài để ở `<bai>\tai-nguyen\script\bai.part.jsx`, mẫu `ipad\vi-du-bai-pin.part.jsx`; mỗi slide `if (want(n)) {…}`, cuối file `ketThuc("vN.log")`.
- **Build:** `python ipad/build.py "<bai>" "<bai>/tai-nguyen/script/bai.part.jsx" out/<ten>-vN.jsx --only 3,4`, rồi `python code/chay_ps.py out/<ten>-vN.jsx "<bai>" vN`. Không chép head/helpers sang từng bài nữa (mỗi bài 1 bản thư viện riêng, sửa ở bài này bài khác không có; bài 29/10 chạy tới v13).
- **Slide trong:** `headC`/`head30`: nền ảnh thật mờ + đen 62%, "POLY STORE" (84,112), pill xanh tâm (540,158), tiêu đề UTM-Cookies trắng viền đen (100, dài thì 92/84), phụ đề UTMAvoBold 31; thẻ `glass` (máy shop đẩy viền xanh nhạt), dòng ✓ ✗ ! bằng `li`, ô ghi chú nền #DCFCE7 chữ tối, giá UTM-Cookies; câu móc pill tâm y 1266.
- **Bìa:** không câu móc. So sánh 2 máy: tiêu đề + 1 ảnh 2 máy + tối đa 1 dòng trắng nhỏ ≤ 6 chữ ngay dưới tiêu đề (hoặc bỏ), luật 16g; được lặp bố cục A nhưng đổi kiểu bên trong (17c). Tin hot (máy mới, iPadOS mới): bìa vẫn là câu hỏi chọn máy, không kiểu bản tin (luật 1d). Nhiều máy thì xòe quạt cân đối (máy giữa thẳng nằm trên, 2 bên nghiêng ra cùng góc, cùng cỡ, chỉ mặt trước).
- **Ảnh iPad:**
  - Ảnh Apple trang "Identify your iPad model" (support.apple.com/en-us/108043, ảnh cdsassets.apple.com). Ảnh gốc gộp nhiều màu chồng nhau → cắt đúng màu đang bán; mặt lưng bo góc theo máy ngoài cùng; **đổi tông viền nhôm mặt trước** cho khớp màu thân (xám cho Space Gray, kem cho Starlight…).
  - Kiểm đúng đời máy: số camera, cảm biến, nút Home, viền. Màn hiện ảnh người / nội dung lạ thì thay wallpaper gốc đúng đời.
  - Ảnh chụp màn hình iPad phải đúng thông số (bài 64GB thì máy 64GB), không lộ thông tin cá nhân.
- **Thông tin hay sai:** Air 4 và Pro 12.9" 2020 bản SIM chỉ 4G (5G từ Pro M1); dùng tên Apple "iPad Air 13\" M3", "iPad Air 11\" M4" (không ghi Air 7, Air 8); ghi "chống phản chiếu"; shop bán bản Wifi thì không khoe bản 5G. Shop bán chủ yếu likenew: không viết làm máy likenew lép vế máy mới.
- **Bảng giá iPad:** 2 máy mỗi slide, giá thấp → cao; ảnh thật bên trái, tên máy nhãn trắng, thông số nhãn dán nhỏ (bộ nhớ · màu · Wifi/SIM, ngoại hình, pin, bảo hành), giá xanh không chữ "Giá".
- **Slide cuối:** chỉ 1 thẻ kính câu hỏi UTM-Cookies căn giữa slide (y ~520–920), **không `khoiFollow`, không mũi tên** (fen chốt 30/10 12h30), không dòng "Comment …, Poly … 👇", luật 16h. Brief iPad không có dòng "Follow:". Mẫu: `iPad\T10_iPadOS27NongMay_30-10\tai-nguyen\script\bai.part.jsx` slide 7.

## 6. Máy shop và thư mục
- Máy Windows `DESKTOP-FMBNEET`, màn 1920x1200 (công cụ điều khiển: khung 1389x868; chỉ dùng cho ngoại lệ chụp màn hình bài mẹo, luật 11b, 18), taskbar bên phải. Hồ sơ máy: Project `claude/may-shop-DESKTOP-FMBNEET.md`.
- **Bài mới:** `E:\Social Claude\Laptop\T10_<TenBai>_<dd-mm>` hoặc `E:\Social Claude\iPad\T10_<TenBai>_<dd-mm>` (tháng 11: `T11_`). Trong có `tai-nguyen\` (iPad: `tai-nguyen\anh-that\`, `tai-nguyen\script\`), `log\vN.log`, `slide-0N.png/.psd`.
- **Script Photoshop đã build:** `_bo-dung-design\out\<ten>-vN.jsx` (không rải file `.jsx` ra gốc `E:\Social Claude` hay `PolySocial` nữa; bản cũ để nguyên, dọn thì chuyển `_to_delete`, **không xóa hẳn**).
- **Ảnh tải về:** `E:\Social Claude\Anh tai ve\tai-ve-<dd-mm>`. Không để rác trong Downloads.
- **Ảnh thật ở shop:** `C:\Users\Dao\Downloads\Telegram Desktop\photo_2026-10-*.jpg`; `E:\Tool\Anh\<Loại>\<seri - tên máy>\`; ảnh fen gửi qua app nằm trong `E:\Tool\poly-dung-bai\jobs\<bài>\anh-fen-gui\`. Kho ảnh shop gần cạn (27/10): đầu bài nhắc fen gửi thêm.
- **Photoshop tự chạy** (không cần bấm): ghi file `.jsx` vào `C:\Users\Dao\Pictures\PolySocial\_tu-chay\`. Khoảng 5 giây sau Photoshop tự chạy, xong thì file chuyển sang `_tu-chay\_da-chay\`, kết quả ghi `_tu-chay\nhat-ky.txt` ("BAT DAU / XONG / LOI").
  - Bộ canh `poly-tu-chay.vbs` bật cùng Windows + scheduled task "POLY tu chay Photoshop" bật lại mỗi 5 phút; Photoshop tắt thì COM tự mở.
  - Không thấy tự chạy (nhật ký không có dòng mới, `dang-chay.txt` cũ hơn 30 giây): báo fen 1 câu "Photoshop chưa bật hàng chờ, fen mở Photoshop giúp" rồi chờ (luật 11b); fen mở lại Photoshop, hoặc chạy tay `poly-tu-chay.jsx` 1 lần qua File > Scripts > Browse. Claude không tự mở bằng điều khiển màn hình.
  - Cần chạy lệnh trên máy mà không có shell (chat claude.ai): viết `.bat`, thả 1 `.jsx` gọi `new File("...bat").execute()` vào `_tu-chay`, ghi kết quả ra file log.

## 7. Bộ code `E:\Social Claude\_bo-dung-design\` (KIT)
| Thư mục | Có gì |
|---|---|
| `code/` | Laptop: `build.py` (danh sách hàm: `API-laptop.md`), `make-mac-vs-win.jsx` (223 dòng đầu: font, màu, `text`, `rect`, `fx`, `newDoc`), `top5_body.jsx` (`pillC`, `fxGlow`, `glass`, `hookPill`, `photoFrame`, `shot`, `save5`, `placeAt`, `bullet`). Chung: `chay_ps.py` (đưa vào hàng chờ + chờ xong + in log), `tach_nen_ps.py` (tách nền Photoshop nhiều ảnh 1 lệnh). `code/_cu/`: bản cũ, bỏ qua. |
| `slides/` | Mẫu slide Laptop (mục 4). |
| `ipad/` | Thư viện iPad `poly-lib.jsx` (danh sách hàm: `API.md`; có sẵn `hook`, `devIn`, `lineEmoji` từ 28/10), `build.py`, `nghiem-thu.py`, `kiem-tra-slide.py`, `bo-goc-anh.py`, mẫu `vi-du-bai-pin.part.jsx` (mục 5). |
| `prep/` | Chung: `tach_nen.py` (đặt ảnh đã tách lên khung studio, báo phóng to), `ghep_o.py` (ghép ô ảnh chụp từ trình duyệt), `kiem_anh.py` (soi tài nguyên / slide; độ nét ảnh gốc ~0.78–0.90, dưới 0.70 là bị phóng to), `kiem_bo_cuc.py` (khoảng trống, lệch tâm, tràn lề), `trung_anh.py` (dò trùng ảnh, sổ `anh-da-dung.json` + `anh-da-dung-orb.npz`), `soi_tat_ca.py` (4 công cụ soi sau khi dựng trong 1 lệnh), `xem_nhanh.py` (ghép nhiều ảnh thành 1 bảng để xem 1 lần). Mẫu riêng từng bài: `prep_*.py`, `draw_pm.py` (sửa biến `S`, `O` trước khi chạy). |
| `plugin/` | Plugin Claude Code `poly-carousel` (lệnh, agent, skill). |
| `out/` | Script đã build, file `.bat` chạy việc trên máy. |
Chạy trong chat claude.ai: container bị xóa sau mỗi phiên → chép cả thư mục cần dùng vào container rồi chạy; xong ghi kết quả về ổ E.

## 8. Lấy ảnh trên mạng
- **Claude Code trên máy (app, plugin):** tải thẳng bằng `curl -L -o` vào `Anh tai ve`. Trang chặn bot/captcha (Icecat) thì bỏ, không vượt.
- **Chat claude.ai:** shell container không tải được ảnh. Dùng trình duyệt trong app Claude mở ảnh rồi chụp vùng (`zoom`, tối đa 685x600 mỗi lần; trang xem ảnh tự thu nhỏ → đặt ảnh cỡ gốc rồi chụp từng ô, ghép bằng `prep/ghep_o.py`). **Không dùng Chrome thật của fen (Claude in Chrome)** trên máy shop (luật 19, 11b, fen chốt 30/10). Không dùng tải xuống của trình duyệt trong app (bật bảng Save bắt fen bấm).
- **Nguồn:** Lenovo PSREF `psrefstuff.lenovo.com/syspool/Sys/Image/ThinkPad/<Model>/<Model>_CT1_0x.png` (chọn góc 3/4, đời cũ thường 1000x600, đời mới 2000x2000); Apple support (ảnh iPad); Microsoft Support (ảnh BitLocker…); Unsplash, Pexels (chỉ ảnh miễn phí, tránh Unsplash+, tránh ảnh có logo Apple); Wikimedia Commons (ghi giấy phép CC BY-SA vào bảng final).

## 9. Bài đã dựng
**Laptop** (`E:\Social Claude\Laptop\`)
| Ngày đăng | Bài | Thư mục | Ghi chú |
|---|---|---|---|
| 22/10 | Laptop gaming | `T10_LaptopGaming_22-10` | xong |
| 23/10 | 5 phím tắt laptop | `T10_5PhimTatLaptop_23-10` | xong (slide 5 Win+P vẽ lại) |
| 24/10 | Ngành bạn cài app gì? | `T10_NganhCaiAppGi_24-10` | bìa laptop HP mở Start + 4 sticker ngành |
| 25/10 | Dựng video cần laptop gì? | `T10_DungVideoLaptop_25-10` | bìa P1 Gen 4 ở shop, màn ghép Kdenlive |
| 26/10 | 3 lỗi vặt laptop tự sửa tại nhà | `T10_3LoiVatLaptop_26-10` | xong; slide 4 hộp Power Management vẽ lại |
| 28/10 | Top 5 laptop dưới 25 triệu | `T10_Top5Duoi25Tr_28-10` | xong (v4); bìa ảnh HP EliteBook fen gửi |
| (chưa xếp) | 5 thao tác laptop ít ai biết | `T10_5ThaoTacLaptop_28-10` | xong (v6); bìa ảnh Unsplash tạm, chờ ảnh shop |
| (chưa xếp) | Mua laptop văn phòng cũ coi chừng 3 cái khóa | `T10_3KhoaLaptopCu_26-10` | xong; slide 5 chờ fen xác nhận quy trình kiểm |
| — | 5 thói quen làm hỏng laptop | `T10_5ThoiQuenHongLaptop_27-10` | dừng giữa chừng; brief ở `claude/bai-5-thoi-quen-26-10-dang-lam.md` |

**iPad** (`E:\Social Claude\iPad\`): bài gần nhất `T10_Tam10TrieuiPad_29-10` (Tầm 10 triệu, 7 slide), `T10_iPad11hay13inch_29-10`, `T10_iPadWifiHay5G_28-10`, `T10_PinTutNhanh_26-10`, `T10_5CachDungiPadDiHoc_24-10`, `T10_MuaNhamPencil_23-10`, `T11_SinhVienNganhiPad_02-11`. Danh sách chủ đề kênh iPad để dò trùng: Project `claude/lich-su-kenh-ipad.md`.

## 10. Đang chờ / nhắc fen
- Đăng nhập Claude Code trên máy shop 1 lần để app chạy (nút Đăng nhập trên app).
- Ngày đăng bài 3 cái khóa và bài 5 thói quen.
- Slide 5 bài 3 cái khóa: Poly có kiểm BIOS, tài khoản công ty, BitLocker trước mặt khách không.
- Ảnh shop mới (kho ảnh gần cạn).

## 11. Không làm
- Không nhập mật khẩu, không giải CAPTCHA, không xóa hẳn file (chỉ chuyển sang `_to_delete`), không đổi cài đặt hệ thống (mở Settings chỉ để xem/chụp, và chỉ theo ngoại lệ chụp màn hình của luật 11b, 18).
- Không bấm Đăng trên TikTok khi fen chưa đồng ý, không upload Google Drive.
- Chỉ vào kho Polysto khi fen yêu cầu.
- Không trộn nội dung laptop và iPad trong 1 bài.
