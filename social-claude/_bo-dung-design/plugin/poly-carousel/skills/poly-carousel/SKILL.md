---
name: poly-carousel
description: Quy trình dựng bài carousel TikTok Poly Store (laptop @polystorelaptop, iPad @poly.store) bằng Photoshop ngay trên máy shop. Dùng khi chủ shop dán brief từng slide và bảo làm, dựng, sửa bài, hoặc dò trùng ảnh; cũng là việc app Poly Dựng Bài giao.
---

# Dựng carousel Poly Store trên máy shop (Claude Code)

Chủ shop là **Bách**, gọi là **"fen"**, trả lời tiếng Việt, ngắn. Fen gửi brief từng slide → **tự làm hết, không hỏi giữa chừng**, giao **1 lần** khi đã duyệt xong. Hai kênh dùng **chung 1 quy trình, 1 bộ công cụ**; khác nhau ở theme và thư viện dựng (mục 3).

Bài giao từ app **Poly Dựng Bài** (`E:\Tool\poly-dung-bai`): fen chỉ xem tiến độ + nhật ký trên app, không trả lời được câu hỏi giữa chừng. Làm đúng lời giao của app (thắng skill này ở chỗ khác nhau về cách chạy, cách trả lời; luật nội dung / thiết kế vẫn theo mục 12 file quy tắc): tạo task list; in `THU_MUC_BAI=<đường dẫn>` ngay khi tạo thư mục bài và ở dòng cuối; câu cuối 1–3 câu, **không bảng final**; việc chỉ fen quyết được thì để dòng `HOI_FEN:` (app hiện thành nút bấm).

## 0. Đọc trước mỗi bài (bắt buộc)
1. `E:\Social Claude\POLY-quy-tac-lam-content.md`: bộ luật đủ, nhất là **mục 12 "Logic rút ra" + Lịch sử sửa**. Luật này thắng mọi chỗ khác (skill này chỉ tóm tắt + trích số luật). Luật nào ở file nào: `E:\Social Claude\_bo-dung-design\SO-DO-LUAT.md` (đọc khi sửa / ghi luật).
2. `E:\Social Claude\_bo-dung-design\BAT-DAU-TU-DAY-DESIGN.md`: phần chung + phần riêng kênh của bài đang làm.
3. Bài iPad thêm `E:\Social Claude\_bo-dung-design\ipad\README.md` + `ipad\API.md` (danh sách hàm thư viện); bài Laptop đọc `code\API-laptop.md`. **Không đọc lại cả thư viện dựng.**
4. Làm đúng **mục 1b "Luật làm nhanh"** trong `BAT-DAU-TU-DAY-DESIGN.md` (xem nhiều ảnh bằng `prep/xem_nhanh.py`, gom lệnh, duyệt 1 vòng, viết lệnh không bị chặn quyền, giá chỉ ghi khi fen cần).

## 1. Đường dẫn
| Thứ | Ở đâu |
|---|---|
| Bộ code (KIT) | `E:/Social Claude/_bo-dung-design` |
| Thư viện dựng Laptop | `KIT/code` (build.py) + mẫu `KIT/slides/*.jsx` |
| Thư viện dựng iPad | `KIT/ipad` (poly-lib.jsx + build.py), phần slide của bài ở `<bai>\tai-nguyen\script\bai.part.jsx` |
| Thư mục bài | `E:\Social Claude\Laptop\T10_<TenBai>_<dd-mm>` hoặc `E:\Social Claude\iPad\T10_<TenBai>_<dd-mm>` (tháng 11 là `T11_`), trong có `tai-nguyen\`, `log\`, `slide-0N.png/.psd` |
| Ảnh tải về | `E:\Social Claude\Anh tai ve\tai-ve-<dd-mm>\` |
| Ảnh thật ở shop | `C:\Users\Dao\Downloads\Telegram Desktop\`, `E:\Tool\Anh\<Loại>\<seri - tên máy>\`, ảnh fen gửi qua app (đường dẫn ghi trong brief) |
| Hàng chờ Photoshop | `C:\Users\Dao\Pictures\PolySocial\_tu-chay\` (tự chạy, xem nhat-ky.txt) |

Lệnh chạy trong Git Bash (hoặc PowerShell), **luôn để đường dẫn trong ngoặc kép** (có dấu cách). Gọi `python`; nếu `python` mở Microsoft Store hoặc báo không có thì dùng `py -3`. Lệnh `chay_ps.py` chờ Photoshop nên chạy với timeout 600000 ms. Không xoá file: file thừa chuyển vào `_to_delete`.

## 2. Quy trình 1 bài (nhiều bài thì chạy song song từng bước)
Mục tiêu: 1 lần dựng đủ, 1 vòng duyệt, 1 lần giao. Lỗi ảnh bắt TRƯỚC khi chạy Photoshop.

| Bước | Ai | Việc |
|---|---|---|
| 1 | phiên chính | Câu đầu báo đang làm bài gì, kênh nào. Task list các bước. Tạo thư mục bài. |
| 2 | agent `poly-carousel:bien-tap` + `poly-carousel:kiem-thong-tin` **chạy song song** | Biên tập brief đúng gu; kiểm thông số, mẹo. Đưa brief gốc + kênh, không đưa ý mình. |
| 3 | phiên chính (hoặc agent `poly-carousel:dung-slide` nếu nhiều bài) | **Kê ảnh từng slide.** Ảnh fen gửi kèm và ảnh shop trước. Brief đòi ảnh shop mà không có → ghi ngay 1 dòng "chưa có ảnh X, dùng tạm Y", làm tiếp, không chờ (nhãn "ảnh minh họa", luật 16i; ảnh minh họa có chữ / tem / logo thương hiệu thì xoá bằng script Photoshop, luật 16j). |
| 4 | như trên | Ảnh hãng **cỡ gốc**, tải thẳng bằng `curl -L -o` vào `Anh tai ve`. Laptop: PSREF `https://psrefstuff.lenovo.com/syspool/Sys/Image/ThinkPad/<Model>/<Model>_CT1_0x.png`, góc **3/4**, thân máy rộng ≥ 710px. iPad: ảnh Apple trang "Identify your iPad model" (support.apple.com/en-us/108043, ảnh cdsassets.apple.com), cắt đúng màu (mục 3). Trang chặn bot/captcha thì bỏ, không vượt. |
| 5 | như trên | Tách nền **bằng Photoshop** (Select Subject): `python "KIT/code/tach_nen_ps.py" "<anh1>" "<ra1.png>" [...]`, gom mọi ảnh của bài vào **1 lệnh**. Xem lại mọi ảnh cắt trong 1 lần: `python "KIT/prep/xem_nhanh.py" "<ra.jpg>" "<thư mục ảnh>"`. Đặt lên nền studio: `python "KIT/prep/tach_nen.py" ra1.png khung.png` (tỉ lệ > 1.0 là phóng to → tìm ảnh to hơn). Ảnh nền trắng: `tach_nen.py goc.png khung.png --thr 242` (máy đen `--thr 150 --bong 90`). Nền mờ slide trong: ảnh **chưa dùng**, Gaussian 22, phủ tối ×0.62 (ảnh chụp ở shop ×0.40). |
| 6 | như trên | Viết phần slide từ mẫu gần nhất của kênh (mục 3). |
| 6b | như trên | **Bìa sáng tạo (luật 17c):** chọn bố cục khác 2 bìa gần nhất cùng kênh ([iPad] so sánh 2 máy được lặp Đối đầu nhưng đổi kiểu bên trong) (`KIT/noi-dung/bia-da-lam.md`, menu ở `KIT/BAT-DAU-TU-DAY-DESIGN.md` mục 3), ghép lớp ảnh bìa `python "KIT/prep/bia_lop.py" ...` tới khi ra `DAT luat bia 17c`, Read `bia-xem.jpg`; dựng bằng `lopBia` + `sticker` / `vsBadge` / `soTo` / `muiTen` (`$.evalFile` file `KIT/code/bia-lib.jsx`). Không ảnh trong khung viền giữa nền. Xong bài ghi 1 dòng vào sổ bìa. |
| 7 | như trên | **Tự soi tài nguyên** (Laptop): `python "KIT/prep/kiem_anh.py" tai-nguyen "<bai>\tai-nguyen" "KIT/slides/<bai>_slides.jsx" "<bai>\log\soi-vien.png"` → `OK 0`; mở soi-vien.png bằng Read soi viền lem, dải bóng xám, vệt trắng. iPad: ghép mọi ảnh máy đã cắt bằng `prep/xem_nhanh.py` rồi Read 1 lần, soi viền nhôm đúng màu, mép cắt. |
| 7b | như trên | **Dò trùng ảnh (luật 16d), cả 2 kênh:** `python "KIT/prep/trung_anh.py" kiem "<bai>\tai-nguyen" <TenThuMucBai>` (iPad: thư mục `tai-nguyen\anh-that`) → không còn "TRUNG" (trừ ảnh fen gửi: ghi vào bảng final). "GAN GIONG" thì mở 2 ảnh xem. |
| 8 | như trên | Build + chạy Photoshop (mục 3), chờ tới khi xong, mã 0 = mọi slide ok. Đọc log. |
| 9 | phiên chính | Soi **1 lệnh**: `python "KIT/prep/soi_tat_ca.py" "<bai>" vN --them "<thư mục ảnh tải về>"` (ảnh ghép `log\tong.png`, bố cục, nghiệm thu iPad, dò trùng; mã 0 = sạch), xem `log\tong.png`. Gọi **ngay, song song** (chưa tự sửa + dựng lại trước) agent `poly-carousel:thiet-ke` và agent **`poly-carousel:duyet-bai` mới** (chưa thấy quá trình dựng): đưa kênh, đường dẫn slide, file phần slide, brief đã chốt, nguồn + cỡ gốc từng ảnh, quyết định đã chốt. |
| 10 | phiên chính | Sửa gộp mọi lỗi (công cụ + thiết kế + duyệt), build lại **1 lần, chỉ slide lỗi**, soi lại bằng `soi_tat_ca.py`. **Không duyệt vòng 2**; có đổi số liệu thì tự tra lại đúng chỗ đó. Đã ĐẠT thì không dựng lại vì mục "nên sửa". |
| 11 | phiên chính | Giao 1 lần. Chat / Claude Code gõ tay: đường dẫn thư mục + **bảng final gọn** (Slide · Nội dung · Ảnh dùng (nguồn) · Câu móc · Đã sửa so với brief / tự quyết / cần fen xác nhận). Chạy từ app: theo lời giao của app (không bảng final). Thêm ảnh bài mới vào sổ: `python "KIT/prep/trung_anh.py" them "E:/Social Claude/Laptop"` hoặc `.../iPad` theo kênh. |

Nhiều bài cùng lúc: bước 2 gọi `bien-tap` + `kiem-thong-tin` cho mọi bài trong **một lượt**; bước 3–8 mỗi bài 1 agent `poly-carousel:dung-slide` trong **một lượt**; Photoshop tự xếp hàng. Bước 9 gọi các `duyet-bai` song song.

## 3. Riêng từng kênh
### Laptop (@polystorelaptop) — style chuẩn bài "MacBook hay Windows" (`Laptop\T10_MacHayWindows_15-10`)
- **Build:** `python "KIT/code/build.py" slides/<bai>_slides.jsx <TenThuMucBai> <ten-script> vN [ds slide]` rồi `python "KIT/code/chay_ps.py" "KIT/out/<ten-script>-vN.jsx" "<thu-muc-bai>" vN`.
- **Mẫu slide** (`KIT/slides`): `loivat_slides.jsx`, `khoa3_slides.jsx`, `thaotac5_slides.jsx` (mẹo: `trickSlide`, "!" cam, "ok" tích xanh, "1/2/3" bước); `top5_25tr_slides.jsx` (top nhiều máy, `productSlide` ảnh 884x510 + 3 dòng cấu hình + ô "Hợp với"); `dungvideo_slides.jsx`, `gaming_slides.jsx` (giới thiệu máy, ảnh 884x540); `nganh_slides.jsx` (theo ngành); `phimtat_slides.jsx` (phím tắt). Khung ảnh `shot(file, 884, 98, top, cao)`: file đúng 884 x cao.
- **Theme slide trong:** tiêu đề Source Serif Black vàng #FFD60A có glow, phụ đề Source Serif Italic trắng, ảnh khung viền trắng rộng 884, ô kính 1–2 dòng, câu móc pill tâm y 1320.
- **Bìa:** có câu móc ở đáy (luật 21/10), tối đa 5 chữ (17b); 1 ảnh đại diện (16, 18c).
- **Bài mẹo:** ảnh chụp màn hình Windows thật của shop (tiếng Anh, Windows 11, dark mode), Snipping Tool Full screen PNG 1920x1200, không phóng quá 1.2x; cửa sổ admin không chụp được thì vẽ lại 2x và ghi rõ. Ai chụp (ngoại lệ 11b, luật 18): Claude tự chụp chỉ khi fen không dùng máy và đã đồng ý trước. Chạy từ app: không tự chụp; dùng ảnh fen gửi, chưa có thì ảnh tạm / vẽ lại (16i), cuối bài thêm dòng `HOI_FEN: Slide N cần ảnh chụp màn hình thật? | Giữ ảnh tạm | Claude chụp, fen rời máy | Fen tự chụp gửi`.
- **Slide cuối:** 2 thẻ kính bằng nhau: câu hỏi / `khoiFollow("@polystorelaptop", lợi ích, 960)` (luật 16h), không dòng "Comment …, Poly … 👇" (fen bỏ 30/10).

### iPad (@poly.store) — style chuẩn bài 14 "A16 hay AIR 5?" (`iPad\T10_A16vsAir5_14-10`)
- **Build:** `python "KIT/ipad/build.py" "<bai>" "<bai>/tai-nguyen/script/bai.part.jsx" "KIT/out/<ten>-vN.jsx" [--only 3,4]` rồi `python "KIT/code/chay_ps.py" "KIT/out/<ten>-vN.jsx" "<bai>" vN`. Phần slide kết thúc bằng `ketThuc("vN.log");`.
- **Mẫu:** `KIT/ipad/vi-du-bai-pin.part.jsx` + bài iPad gần nhất cùng dạng. Tài nguyên chung (`bg-thumb.png`, `ic-check.png`, `ic-x.png`) lấy từ `tai-nguyen\anh-that\` của bài iPad gần nhất.
- **Theme slide trong:** `headC`/`head30`: nền ảnh thật mờ + đen 62%, "POLY STORE" (84,112), pill xanh tâm (540,158), tiêu đề UTM-Cookies trắng viền đen, phụ đề UTMAvoBold 31; thẻ `glass` (máy shop đẩy viền xanh nhạt), dòng ✓ ✗ ! bằng `li`, ô ghi chú nền #DCFCE7 chữ tối, câu móc pill tâm y 1266.
- **Bìa:** không câu móc, không pill. So sánh 2 máy: tiêu đề + 1 ảnh 2 máy + tối đa 1 dòng trắng nhỏ ≤ 6 chữ dưới tiêu đề (hoặc bỏ), luật 16g. Tin hot: bìa vẫn là câu hỏi chọn máy (luật 1d). Nhiều máy thì xòe quạt cân đối (máy giữa thẳng, 2 bên nghiêng cùng góc, cùng cỡ).
- **Ảnh iPad Apple:** ảnh gốc gộp nhiều màu chồng nhau → cắt đúng màu đang bán; đổi tông viền nhôm mặt trước cho khớp màu thân; kiểm đúng đời máy (số camera, nút Home, viền). Màn hiện ảnh người/nội dung lạ thì thay wallpaper gốc đúng đời.
- **Thông tin hay sai:** Air 4 và Pro 12.9" 2020 bản SIM chỉ 4G (5G từ Pro M1); tên "iPad Air 13\" M3", "iPad Air 11\" M4"; ghi "chống phản chiếu"; tên màu tiếng Anh (Sky Blue, Space Gray).
- **Slide cuối:** chỉ 1 thẻ kính câu hỏi căn giữa slide (y ~520–920), **không khối Follow, không mũi tên** (fen chốt 30/10 12h30), không dòng "Comment …, Poly … 👇" (luật 16h).

## 4. Luật chung hay bị bắt (bản đủ ở file quy tắc)
- **Trùng thì không làm (luật 1b):** agent biên tập báo brief trùng chủ đề bài đã làm (cùng câu hỏi chính, cùng cặp máy, cùng bộ mẹo) mà fen không ghi "làm lại" → không dựng, báo bài trùng + 2–3 chủ đề chưa làm (chạy từ app: dòng `HOI_FEN:`). Ý slide đã dùng ở bài trước thì biên tập thay ý khác.
- **Có ích, có giá trị (luật 1c, 30/10):** mỗi slide giữa có ít nhất 1 thông tin cụ thể dùng được (số có nguồn, thao tác làm theo được, máy + việc chạy được, cách kiểm / xử lý); không slide chỉ có câu khen chung hay ý ai cũng biết; so sánh phải chốt ai lấy máy nào.
- Khổ 1080x1440. **Bìa:** nền `bg-thumb.png` xanh lá tối; tiêu đề vàng Source Serif Black **căn trái** thẳng "POLY STORE"; **ngắn gọn (luật 17b)**: tiêu đề tối đa 6 chữ (1–2 dòng), dòng phụ nghiêng tối đa 6 chữ hoặc bỏ, không emoji, câu móc bìa laptop tối đa 5 chữ; **1 ảnh** khớp đúng chữ tiêu đề ([Laptop] 1 máy đại diện, luật 16, 18c; [iPad] được 2 máy đối đầu / 3 máy xòe quạt) (người thì ưu tiên người Việt/châu Á); **sáng tạo, to nhỏ phù hợp (luật 17c)**: máy tách nền đặt thẳng lên nền + bóng + vệt sáng, chiếm 35–62% khung, nghiêng / tràn mép, không khung viền, không trống > 160px; không giá, không huy hiệu.
- **Slide trong:** nền ảnh thật mờ, mỗi slide 1 ảnh khác nhau, **không trùng bài cũ**. Câu móc ở đáy mọi slide trừ slide cuối, dẫn đúng slide sau, không ghi 👉 trong chữ (pill tự có).
- **Slide cuối (luật 16h, 30/10):** chỉ chữ, không ảnh, **không địa chỉ**; câu hỏi chọn ngắn (chữ fen viết), không có dòng kêu gọi comment kiểu "Comment kèm ngân sách, Poly chọn máy 👇" / "Comment, Poly tư vấn 👇" (fen bỏ 30/10 11h: câu hỏi tự kéo comment; brief có dòng đó thì bỏ khi dựng). [Laptop] thẻ dưới `khoiFollow("@polystorelaptop", lợi ích, 960)` (lợi ích follow ≤ 8 chữ + nút Follow to + mũi tên chỉ dấu + ở avatar TikTok). [iPad] chỉ 1 thẻ câu hỏi giữa slide, không Follow, không mũi tên. Không tự thêm dòng khác.
- Giá chỉ ghi khi brief có giá hoặc fen nhắn cần giá; không tự thêm, không tự đổi chữ giá fen viết (fen chốt 28/10). Bài nhiều máy không ghi giá; bài báo giá thì giá nhỏ, xanh, không chữ "Giá". Gọi tên máy thật, không "máy A/B/C".
- Không logo Apple, logo/watermark shop khác, serial, tên tài khoản, ảnh AI; ảnh minh họa không lộ chữ / tem / logo thương hiệu, nhãn chỉ "ảnh minh họa" (luật 16j). Mọi thông số đúng bản shop bán; không số liệu không nguồn.
- Font UTM Avo không có ← → ✓: dùng ">" trong chữ, dấu tích vẽ bằng hình/icon. Chữ quan trọng trong x 98–982, y 120–1386; không chữ ở x > 950 trong y 620–1320.
- Không đóng file fen đang mở trong Photoshop (build của 2 kênh chỉ đóng file do script tạo).
- Script Photoshop tự viết (tách nền, sửa lẻ) không gọi `app.bringToFront()`: Photoshop chạy nền để fen làm việc khác.

## 5. Fen sửa bài
Dùng `/poly-carousel:sua-bai`. Sửa xong luôn ghi vào **mục 12 + Lịch sử sửa** của `E:\Social Claude\POLY-quy-tac-lam-content.md` (ngày | bài | fen sửa gì | logic rút ra; luật chỉ của 1 kênh thì ghi rõ [Laptop] / [iPad]), rồi sửa các file con theo `E:\Social Claude\_bo-dung-design\SO-DO-LUAT.md`. Nhắc: bản trong Project claude.ai (`claude/quy-tac-lam-content-poly.md`) cần đồng bộ lại khi mở chat Claude.

## 6. Không làm
- **Không dùng điều khiển màn hình / computer use / Cowork** (chụp màn hình, bấm, gõ) để thao tác Photoshop hay app nào trên máy shop: Photoshop chỉ chạy bằng script nền qua hàng chờ `_tu-chay` (luật 11b, 30/10). Hàng chờ không chạy thì báo fen mở Photoshop. Ngoại lệ duy nhất: chụp màn hình bài mẹo khi fen không dùng máy và đã đồng ý (mục 3 Laptop, luật 18).
- Không nhập mật khẩu, không vượt captcha/chặn bot, không xoá hẳn file (chuyển vào `_to_delete`), không đổi cài đặt hệ thống.
- Không bấm Đăng TikTok khi fen chưa duyệt, không upload Google Drive.
- Không dùng Chrome thật của fen (Claude in Chrome); tải ảnh bằng `curl` (luật 19, fen chốt 30/10). Chỉ vào kho Polysto khi fen yêu cầu.
- Không trộn nội dung laptop và iPad trong 1 bài. Không ghi tên, số điện thoại khách.
