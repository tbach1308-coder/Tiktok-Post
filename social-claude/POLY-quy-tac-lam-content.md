# BỘ QUY TẮC LÀM CONTENT – POLY STORE

Dùng cho cả 2 kênh TikTok: laptop **@polystorelaptop** ("POLY Store Laptop") và iPad **@poly.store** (từ 28/10 hai tab Design dùng chung bộ luật này). Nội dung 2 kênh không trộn trong 1 bài. Luật chỉ cho 1 kênh có ghi **[Laptop]** / **[iPad]**; theme riêng từng kênh ở `_bo-dung-design\BAT-DAU-TU-DAY-DESIGN.md` mục 4–5. **Mục 12 "Logic rút ra" thắng mọi mục khác** và thắng mọi file con (sổ dựng, plugin, agent, lệnh app). Luật nào nằm ở file nào, đổi 1 luật phải sửa file nào: `_bo-dung-design\SO-DO-LUAT.md`.
Địa chỉ shop: **POLY Store · 125/16/26 Bùi Đình Túy, Bình Thạnh**.

---

## 1. Nguyên tắc chung
- Viết tiếng Việt, ngắn gọn, vào thẳng vấn đề, giọng người bán hàng thật, không vòng vo.
- Nội dung có chiều sâu (phân tích, so sánh), mỗi slide đều có lý do để vuốt tiếp. Mỗi slide phải có thông tin có ích, có giá trị (luật 1c mục 12).
- Ảnh sản phẩm là nhân vật chính: to, rõ. Chữ phụ không cần to.
- Ưu tiên ảnh thật: máy thật, màn thật. Không dùng mockup vẽ.
- Thông tin phải đúng: chỉ đưa vào bài ý đã kiểm chứng có nguồn, chưa chắc thì bỏ (luật 4c mục 12). Thông số nào có nhiều phiên bản (màn, card) thì ghi đúng bản shop đang bán; chưa chắc bản nào thì hỏi fen ở cuối bài (bảng final / dòng `HOI_FEN:`), không dừng giữa chừng (mục 10).
- Không dùng con số không có nguồn (ví dụ "90% chọn sai"), luật 3.
- Không ghi giá nếu chủ shop chưa đưa giá, hoặc khi chủ shop nói không ghi.
- Không đưa lên ảnh: tên shop khác, logo Apple, số serial máy, pin chai (pin báo đỏ).
- Ảnh hoàn thiện lưu trên máy tính, gửi bản xem trước qua chat. Không cần up Google Drive.

## 2. Khung ảnh
- Kích thước 1080 × 1440 (tỉ lệ 3:4), 150 dpi, xuất PNG kèm PSD để sửa.
- Vùng an toàn: x từ 98 đến 982, y từ 120 đến 1386. Không đặt chữ quan trọng ngoài vùng này.
- Câu móc (hook) đặt ở đáy slide trên mọi slide, trừ slide cuối: tâm y ≈ 1320 [Laptop], ≈ 1266 [iPad]. Bìa iPad không có câu móc.

## 3. Theme carousel của kênh [Laptop] (theme iPad: bài 14, xem BAT-DAU-TU-DAY-DESIGN.md mục 5)
- Nền tối: ảnh thật làm mờ và tối đi (luật 15: không nền 1 màu trơn); bìa dùng nền `bg-thumb.png` (luật 17).
- Góc trên trái: chữ "POLY STORE" nhỏ, giãn chữ. Giữa trên: nhãn tròn xanh lá (#22C55E) ghi tên phần.
- Tiêu đề: font có chân Source Serif Black, màu vàng #FFD60A, có glow nhẹ.
- Phụ đề: Source Serif SemiBold Italic, màu trắng.
- Chữ nội dung: UTM Avo Bold. Emoji: Noto Color Emoji.
- Màu dùng thêm: xanh đậm #16A34A, xanh nhạt #4ADE80, nền ô ghi chú #DCFCE7, nền tối #0B1220, đỏ #EF4444.
- Ảnh slide trong đặt trong khung bo góc viền trắng (bìa thì không, luật 17c). Không gắn tag tên máy hay huy hiệu đè lên ảnh khi không cần.
- Câu móc: viên thuốc nền tối, viền xanh, chữ trắng kèm 👉.

## 3b. TEMPLATE CHUẨN
- [iPad] Style bài 14 "A16 hay AIR 5?" (thông số style: `E:\Social Claude\_template_chuan\README-template-chuan.md`), dựng bằng `E:\Social Claude\_bo-dung-design\ipad\poly-lib.jsx`.
- [Laptop] Style bài `E:\Social Claude\Laptop\T10_MacHayWindows_15-10`, dựng bằng `E:\Social Claude\_bo-dung-design\code` + `slides`.
Mọi bài carousel laptop dựng theo style và template của bài này (script mẫu `make-mac-vs-win-v6.jsx`):
- **Nền:** ảnh thật làm mờ, tối (bg-mac.png / bg-win-v2.png), không dùng nền gradient trơn.
- **Bìa:**
  - "POLY STORE" ở góc trên.
  - Tiêu đề tối đa 2 dòng rất to (tối đa 6 chữ, luật 17b), căn trái, chữ có chân màu vàng. Chèn 1 chữ nghiêng trắng ("hay").
  - Dòng phụ in nghiêng, tối đa 6 chữ hoặc bỏ.
  - Nền `bg-thumb.png` xanh lá tối (luật 17).
  - 1 ảnh máy tách nền đặt thẳng lên bg-thumb (bóng + vệt sáng, không khung viền, luật 17c), không dán nhãn tên máy lên ảnh (luật 8, 16).
  - Câu móc ở đáy, tối đa 5 chữ.
- **Slide nội dung:**
  - "POLY STORE"; tiêu đề VIẾT HOA chữ có chân màu vàng có glow; phụ đề nghiêng trắng.
  - Ảnh lớn 884×560, khung viền trắng.
  - Ô kính mờ 1–2 dòng chữ trắng căn giữa.
  - Khối nổi bật dạng "bảng tỉ số": viên tối viền xanh, số chữ có chân màu vàng. Bài báo giá dùng khối này để hiện giá.
  - Câu móc ở đáy.
- **Slide chốt / cuối:** cùng font và màu với các slide khác. Laptop không đặt ảnh ở slide cuối (luật 9).

## 4. Cấu trúc một bài carousel
1. **Bìa:** ngắn gọn (luật 17b): tiêu đề VIẾT HOA tối đa 6 chữ, bắt mắt, căn trái; dòng phụ tối đa 6 chữ gợi tò mò hoặc bỏ, không gắn emoji cuối.
2. **Các slide nội dung:** ảnh lớn, ô thông số ngắn, ô xanh "👉 Hợp với…", câu móc dẫn sang slide sau.
3. **Slide cuối (gọi hành động, bản đủ ở luật 16h):** chỉ chữ, không ảnh, không địa chỉ, câu hỏi chọn ngắn giữ đúng chữ fen viết, không dòng kêu gọi comment kiểu "Comment …, Poly … 👇" (fen bỏ 30/10). **Cả 2 kênh** chỉ 1 thẻ kính câu hỏi căn giữa slide (y ~520–920), không khối Follow (không dòng "Follow để …", không nút Follow, không mũi tên, không dòng "Bấm dấu + ở avatar bên phải"); brief không có dòng "Follow:" ([iPad] fen chốt 30/10 12h30, [Laptop] fen bỏ 30/10 15h22).
- **Thumbnail:** theo mẫu của chủ shop: tiêu đề ngắn (luật 17b), nền xanh lá tối `bg-thumb.png` (luật 17). Kiểu chỉ có chữ (thumbnail bảng giá, luật 10) gồm sticker trắng chữ đen, dòng nhấn mạnh nền xanh chữ trắng, có thể nghiêng nhẹ.

## 5. Series "Cập nhật bảng giá laptop tại Poly"
- Thư mục: `E:\Social Claude\Laptop\Cập nhật bảng giá laptop tại Poly\`.
- **Bố cục:** nền đen, ảnh máy đặt giữa (rộng 1080).
  - Tiêu đề: tên máy, chữ đen trong khung trắng bo góc, nằm ở dải đen phía trên.
  - Thông số: 5 dòng sticker (chữ đen, nền trắng bo góc, xếp sát nhau, căn giữa theo khối), theo thứ tự:
    `CPU` · `VGA : …` · `RAM : …` · `SSD : …` · `Màn: …inch , …`
  - Thông số tự chọn cỡ chữ và góc đặt (trái hoặc phải) sao cho che máy ít nhất.
  - Giá: nhỏ, tinh tế, chữ xanh #16A34A trong khung trắng nhỏ dưới ảnh. Không ghi chữ "Giá".
- **Không đưa lên ảnh:** tình trạng %, pin, màu, mã máy.
- **Kiểm tra trước khi làm:** thông số có khớp tên máy không (ví dụ máy bản "14" mà ghi màn 15.6 là sai). Nếu thấy sai thì báo lại.
- Thumbnail của series: chỉ có chữ "CẬP NHẬT BẢNG GIÁ / LAPTOP TẠI POLY".

## 6. Ảnh lấy trên mạng
- **Thứ tự ưu tiên:**
  1. Ảnh thật của shop.
  2. Ảnh có giấy phép dùng thương mại (Unsplash, Pexels), nhưng phải đúng model.
  3. Ảnh chính hãng: trang hãng, hoặc kho ảnh đại lý Icecat.
- Được tự tải, không cần xin phép (fen đã cho phép); ghi tên file và nguồn vào bảng final.
- Ảnh tải về lưu vào `E:\Social Claude\Anh tai ve\`.
- Ảnh render nền trắng thì tách nền, đặt lên nền studio tối kèm bóng đổ, cho đồng bộ với ảnh thật.

## 7. Cách làm kỹ thuật (Photoshop)
- Dựng slide bằng script Photoshop (.jsx) build từ bộ code `E:\Social Claude\_bo-dung-design` ([Laptop] `code\build.py` + `slides\`, [iPad] `ipad\build.py` + `poly-lib.jsx`); script ra `_bo-dung-design\out\`.
- Chạy: đưa `.jsx` vào hàng chờ `C:\Users\Dao\Pictures\PolySocial\_tu-chay\` (Photoshop tự chạy, `code\chay_ps.py` đưa vào và chờ xong). Không cần bấm File → Scripts.
- Chỉ chạy bằng script nền (luật 11b): không dùng điều khiển màn hình / computer use / Cowork để thao tác Photoshop hay app nào trên máy shop (ngoại lệ duy nhất: chụp màn hình bài mẹo khi fen không dùng máy và đồng ý trước, 11b, 18).
- Cách nhanh nhất: app Poly Dựng Bài (`E:\Tool\poly-dung-bai`) hoặc plugin Claude Code `poly-carousel` chạy ngay trên máy.
- Kết quả của từng bài lưu ở `E:\Social Claude\<Laptop hoặc iPad>\T10_<TenBai>_<ngày-tháng>\`:
  - `slide-01.png`/`.psd`, …
  - thư mục `tai-nguyen\` chứa ảnh đã cắt sẵn
  - thư mục `log\` chứa `vN.log`
- Mỗi lần sửa thì lưu script thành tên mới (`-v2`, `-v3`…) để không bị dùng lại bản cũ.
- **Không làm:**
  - đóng file đang mở của chủ shop trong Photoshop;
  - xóa file trên máy;
  - đổi cài đặt hệ thống.

## 8. Hashtag
- Khi cần hashtag: research hashtag đang trend trên TikTok (TikTok Creative Center, khu vực Việt Nam, xem lượt xem hashtag) bằng tài khoản TikTok của chủ shop.
- Luật caption, hashtag, comment ghim và Your brand ở `_bo-dung-design\hashtag-tiktok.md`. Your brand (Tiết lộ nội dung): **mặc định tắt** cho mọi bài như cài đặt gốc TikTok; fen tự bấm Bật ở ô Đăng bài của app khi cần; Claude không tự xét, không tự bật (fen chốt 30/10 12h54).

## 9. Các bài đã làm (để tham khảo style)
- Danh sách bài 2 kênh và thư mục: `_bo-dung-design\BAT-DAU-TU-DAY-DESIGN.md` mục 9. Tên thư mục cũ đổi ngày 20/10: tra `E:\Social Claude\_doi-ten-log.txt`.
- Mẫu chuẩn: [Laptop] `T10_MacHayWindows_15-10`, [iPad] `T10_A16vsAir5_14-10`.

## 10. Ba agent tự phối hợp khi chủ shop giao bài
- App Poly Dựng Bài và Claude Code dùng plugin `poly-carousel`: agent `bien-tap` + `kiem-thong-tin` (song song) → dựng (phiên chính hoặc `dung-slide`) → `thiet-ke` + `duyet-bai` (song song); thứ tự từng bước ở `BAT-DAU-TU-DAY-DESIGN.md` mục 2. Chat claude.ai dùng các skill ghi dưới.
- **Biên tập** (skill `polystore-bien-tap-noi-dung`): phân tích brief, chỉnh cho đúng gu chủ shop (ngắn, thẳng, mỗi slide một ý, câu móc khớp slide sau, bỏ chi tiết thừa, không bịa số). Kết quả gồm brief đã chỉnh và bảng Gốc → Mới → Lý do.
- **Dựng:** phản biện bản biên tập nếu không làm được hoặc sai sự thật, tối đa 2 lượt qua lại. Không thống nhất được thì chọn phương án bám brief gốc hơn. Sau đó dựng slide.
- **Duyệt** (skill `polystore-duyet-bai`): agent mới, chưa thấy quá trình làm; 1 vòng, không vòng 2 (luật 12). Góp ý nào đổi nội dung thì quay lại agent biên tập trước khi sửa.
- **Không hỏi chủ shop.**
  - Tự bật Photoshop, tự chạy script (chỉ qua hàng chờ `_tu-chay`, không điều khiển màn hình, luật 11b).
  - Gặp chỗ mơ hồ thì tự chọn phương án hợp lý nhất (ví dụ: chưa có giá thì không ghi giá), rồi ghi lại trong bảng final.
  - Tải ảnh từ web cũng tự làm, không hỏi. Ưu tiên ảnh fen gửi và ảnh có sẵn trên máy.
- Chủ shop chỉ nhận một kết quả cuối (mục 11).

## 11. Tự duyệt trước khi trả bài (bắt buộc)
- Làm xong bài thì không gửi ngay. Giao một agent duyệt riêng (skill `polystore-duyet-bai`), agent này chưa thấy quá trình làm.
- Agent kiểm 4 nhóm: thông tin, ảnh, theme và bố cục, chữ.
- Duyệt 1 vòng, không vòng 2 (luật 12): sửa gộp hết lỗi rồi soi lại bằng `prep/soi_tat_ca.py`.
- Chỉ trả cho chủ shop một lần (chạy từ app Poly Dựng Bài: theo lệnh của app, 1–3 câu + "Đã đổi so với brief" + `HOI_FEN:`, không bảng final), gồm:
  - preview tất cả slide final;
  - bảng final: Slide | Nội dung chính | Ảnh dùng (nguồn) | Câu móc | Đã sửa so với brief;
  - kết quả tự duyệt (số vòng, lỗi đã sửa, lỗi còn lại nếu có);
  - đường dẫn thư mục và nguồn kiểm chứng.
- Không dừng giữa chừng để hỏi.

## 12. Nhật ký sửa và logic rút ra (agent đọc trước mỗi bài)
Sau mỗi lần chủ shop sửa bài, agent dựng phải làm 3 việc:
- Thêm một dòng vào ĐẦU bảng "Lịch sử sửa" (mới nhất trên cùng; dòng cũ là nhật ký, không sửa).
- Gộp vào phần "Logic rút ra". Nếu đã có ý tương tự thì gộp chung, không ghi lặp.
- Sửa các file con mà `_bo-dung-design\SO-DO-LUAT.md` ghi cho chủ đề luật đó (file con chỉ tóm tắt + trích số luật); thêm luật mới hay đổi nơi chứa thì cập nhật luôn sơ đồ.

Agent biên tập và agent duyệt coi phần "Logic rút ra" là luật bắt buộc.

### Logic rút ra
**Nội dung**
1. Luôn gọi tên máy thật (MacBook Air M1…). Không đặt nhãn trừu tượng như "máy A/B/C", vì người xem khó hiểu.
1b. **Trùng thì không làm (29/10).** Chủ đề đã có bài (cùng câu hỏi chính, cùng cặp máy so sánh, cùng bộ mẹo), đăng bao lâu rồi cũng vậy: không viết, không dựng. Báo fen bài nào trùng + gợi ý 2–3 chủ đề chưa làm. Chỉ làm lại khi fen ghi rõ "làm lại". Bài định kỳ (bảng giá tháng, cập nhật bảng giá) mỗi kỳ là chủ đề mới. Ý slide đã dùng ở bài trước thì không dùng lại.
1c. **Bài phải có ích, có giá trị thật (30/10).** Fen: "thêm quy tắc chung viết bài, thông tin có ích, có giá trị". Người xem lướt xong phải mang về được điều dùng được ngay, hoặc điều giúp họ quyết định mua / sửa máy:
   - Mỗi slide giữa có ít nhất 1 thông tin cụ thể dùng được: con số có nguồn (thông số, giờ pin, cân nặng, giá fen đưa), đường dẫn menu / thao tác làm theo được, tên máy + việc chạy được, dấu hiệu tự kiểm tra, cách xử lý. Không slide nào chỉ có câu cảm thán, câu chuyển ý, câu khen chung chung ("máy ngon", "rất đáng mua", "mượt lắm").
   - Ưu tiên điều người xem chưa biết hoặc hay hiểu sai, điều chỉ người bán / thợ mới biết (máy likenew hay lỗi gì, mua cần kiểm gì, bản nào đáng tiền, nâng cấp được gì). Bỏ ý ai cũng biết (vd "iPad dùng để học", "RAM nhiều chạy nhanh hơn").
   - Mẹo phải làm theo được: ghi đúng đường dẫn menu theo bản iPadOS / Windows hiện hành và kết quả thấy được sau khi làm.
   - Bài so sánh, chọn máy phải chốt được "ai nên lấy máy nào, vì sao", không kết lửng.
   - Tự kiểm trước khi chốt: đọc từng slide, slide nào người xem không biết thêm được gì thì viết lại hoặc bỏ.
1d. **[iPad] Tin hot được làm, bìa vẫn là câu hỏi chọn máy (fen chốt 30/10 13h20).** Máy mới ra, iPadOS mới: được làm bài, nhưng bìa là câu hỏi chọn máy / nhu cầu người xem (vd "MINI 7 CÒN ĐÁNG MUA?" + dòng phụ "Mini 8 vừa ra"), không bìa kiểu bản tin ("MINI 8 RA RỒI"). Nội dung tin phải dẫn về nhu cầu mua / sửa ở shop (máy đang dùng còn đáng không, lên đời được gì, lỗi sau cập nhật xử lý sao). Tin đồn ghi rõ "tin đồn".
2. Bài giới thiệu nhiều máy làm theo dạng **báo giá**. Mỗi máy ghi đủ: tên máy, cấu hình, đối tượng phù hợp ("Hợp: …"); giá chỉ ghi khi bài là báo giá và fen đưa giá (luật 5, mục 1). Đủ thông tin là được, không thêm slide bảng giá tóm tắt (bị thừa), không kéo thành bài phân tích điểm yếu dài.
3. Không dùng con số không có nguồn (ví dụ "90% chọn sai máy").
4. Thông số phải khớp tên máy và đúng bản shop bán (EliteBook 8 G1i 14 thì màn 14 inch; Nitro 5 bản QHD 165Hz).
4b. Nói về chứng nhận/hỗ trợ của hãng phần mềm (29/10): chỉ khẳng định điều có nguồn chính hãng. Catia: Dassault ghi rõ không hỗ trợ cấu hình không nằm trong danh sách; SolidWorks: tính năng như RealView chỉ chạy với card được hỗ trợ, chưa có nguồn chính hãng nói "GeForce bị loại"; Revit từ 2023.1 không còn danh sách card chứng nhận. Vì vậy chỉ nói "card ngoài danh sách chứng nhận, lỗi hiển thị khó nhờ hãng hỗ trợ" và ghi rõ phần mềm (Catia, SolidWorks), không gộp Revit/AutoCAD.
4c. **Thông tin đúng mới đưa vào bài (30/10 16h, cả 2 kênh).** Fen: "đảm bảo thông tin đúng mới đưa vào nội dung nha". Mọi ý trong slide, caption, comment ghim (thông số, năm ra mắt, tính năng, đường dẫn menu, phím tắt, mẹo, tin máy mới / iPadOS, con số, so sánh) phải kiểm chứng được ở nguồn chính hãng hoặc nguồn tin cậy trước khi viết vào brief và trước khi dựng (agent `kiem-thong-tin` kiểm từng ý). Ý chưa kiểm chứng được thì bỏ khỏi bài, không viết né kiểu "có thể", "nghe nói"; ý sai thì sửa theo nguồn. Ngoại lệ: tin đồn ghi rõ "tin đồn" (1d); thông số nhiều bản chưa rõ bản shop bán thì hỏi fen cuối bài (mục 1). Ý bị bỏ / sửa ghi vào log / "Đã đổi so với brief".
5. Giá: nhỏ, tinh tế, chữ xanh, không có chữ "Giá". Chỉ ghi giá khi bài là báo giá; bài giới thiệu nhiều máy (top, gaming…) không ghi giá trên slide máy. Không bao giờ đưa giá lên bìa/thumbnail.

**Ảnh**
6. Các máy trong cùng một bài dùng cùng một kiểu ảnh. Ví dụ cả 3 máy đều là ảnh hãng chụp chính diện, cùng nền studio tối, cùng cỡ. Không được máy dùng ảnh thật, máy dùng ảnh hãng.
7. Bảng giá laptop: ảnh máy đặt giữa nền đen. Chữ thông số tự canh cỡ và vị trí để không che máy.
8. Không gắn tag, huy hiệu hay icon trang trí (🍎/🪟) lên ảnh sản phẩm. Slide báo giá từng máy không cần nhãn pill (kiểu "TẦM 13 TRIỆU"), vì bị thừa khi đã có tên máy và giá.

**Bố cục**
9. Slide cuối không có ảnh laptop. Mọi thứ căn giữa, bỏ chữ thừa, không ghi địa chỉ. Cả 2 kênh không khối Follow (luật 16h: [iPad] 30/10 12h30, [Laptop] 30/10 15h22).
10. Thumbnail bảng giá chỉ có chữ, phải bắt mắt: sticker nghiêng, dòng nhấn nền xanh.
15. Nền không dùng 1 màu trơn. Nền chuẩn là kiểu bài Mac vs Win: ảnh thật đúng chủ đề (vd góc máy chơi game, bàn làm việc) làm mờ + phủ tối, mỗi slide 1 ảnh khác nhau. Không dùng nền đốm màu tự vẽ.
16. Bìa: [Laptop] chỉ dùng 1 ảnh đại diện, không ghép 2–3 máy (18c); [iPad] được bố cục Đối đầu VS (2 máy, 16g) và Xòe quạt (3 máy) theo 17c. Ảnh bìa phải nói ngay chủ đề bài (vd bài phím tắt thì cận bàn phím có tô phím), không dùng ảnh laptop chung chung.
17. Thumbnail (bìa) luôn dùng nền xanh lá tối `bg-thumb.png` (bản gốc: `E:\Social Claude\iPad\T10_3iPadDangMua_11-10\tai-nguyen\anh-that\bg-thumb.png`). Nền ảnh mờ kiểu Mac vs Win chỉ dùng cho các slide trong.
17b. **Thumbnail (bìa) ngắn gọn, gây tò mò, vào thẳng vấn đề (29/10; 30/10 15h20 fen: "thumnail luôn đạt được yêu cầu: ngắn gọn, gây tò mò, vào thẳng vấn đề").** Mọi bìa 2 kênh phải đạt đủ 3 ý; thiếu 1 ý là viết lại. Người xem lướt chỉ đọc kịp vài chữ trên bìa:
   - **Vào thẳng vấn đề:** chữ đầu tiên đã là đúng chủ đề / máy / vấn đề người xem đang gặp (vd "PRO M2 HAY AIR M2?", "PIN TỤT NHANH?"). Không mở bằng chữ dạo đầu, chữ chung chung ("BẠN CÓ BIẾT", "CÙNG POLY TÌM HIỂU", "TỔNG HỢP", "REVIEW"), không vòng vo.
   - **Gây tò mò:** để hở 1 điều người xem muốn biết mà bìa không nói đáp án (câu hỏi chọn, "chênh ở đâu?", "đáng không?", con số có nguồn chưa giải thích, điều hay hiểu sai); đáp án nằm ở slide trong. Không giật tít sai sự thật, không con số bịa (luật 3), không lộ đáp án trên bìa.
   - Tiêu đề VIẾT HOA tối đa 6 chữ, ưu tiên 1 dòng, không quá 2 dòng. Bỏ chữ ảnh đã nói thay (vd "PRO M2 HAY AIR M2?" thay cho "iPAD PRO M2 HAY AIR M2? CÙNG CHIP, CHÊNH Ở ĐÂU?").
   - Dòng phụ tối đa 6 chữ, hoặc bỏ hẳn. Không câu giải thích trên bìa (vd "Cùng chip M2 mà giá khác nhau, coi có đáng không" là quá dài). [iPad] bìa so sánh 2 máy: dòng phụ chỉ được là 1 dòng trắng nhỏ ≤ 6 chữ ngay dưới tiêu đề vàng, hoặc bỏ (luật 16g, fen chốt 30/10).
   - [Laptop] câu móc đáy bìa tối đa 5 chữ. [iPad] bìa không câu móc.
   - Cả bìa tối đa khoảng 12 chữ (không tính "POLY STORE"). Ý dài, lý do, thông số để sang slide 2.
   - Brief fen gửi có bìa dài thì agent biên tập rút gọn theo luật này, ghi vào "Đã đổi so với brief".
17c. **Bìa sáng tạo, không "gắn ảnh vô cho có" (29/10).** Fen: "mấy dạng hình ảnh thumbnail làm sáng tạo vô, căn chỉnh bố cục, to nhỏ phù hợp, đừng kiểu gắn vô cho có".
   - Cấm trên bìa: ảnh máy nằm trong khung chữ nhật viền trắng hay mảng nền studio xám đặt giữa nền xanh (kiểu bìa Laptop gaming 22/10, Top 5 dưới 25tr 28/10, Máy trạm hay gaming 29/10). Khung viền chỉ dùng cho ảnh chụp màn hình khi chính màn hình là chủ đề.
   - Máy / đồ vật tách nền rồi đặt thẳng lên bg-thumb, có bóng đổ mềm + vệt sáng dưới chân (màu theo ý bài: xanh lá mặc định, đỏ gaming, xanh dương máy trạm / làm việc). Ảnh không tách được (cầm tay, chụp ở shop) thì tràn khung, mờ dần viền vào nền, không đóng khung.
   - To nhỏ: 1 máy chiếm 35–62% khung; 2–3 máy cả cụm ≥ 20%. Trống giữa tiêu đề và ảnh, giữa ảnh và câu móc (iPad: đáy y 1386) ≤ 160px, mọi bìa kể cả bìa so sánh iPad (fen chốt 30/10). Được cho máy lấn ra sau tiêu đề hoặc tràn mép (tối đa 30% máy ra ngoài khung), không cắt mất logo / chi tiết bài đang nói. **[Laptop] tràn ít (30/10 15h15, fen: "hình thumbnail đừng tràn viền mất quá nhiều"):** tối đa 10% máy ra ngoài khung, chỉ 1 mép, người xem vẫn thấy gần trọn máy (màn hình, bàn phím, bản lề); máy to thì thu nhỏ trong 35–62% chứ không đẩy ra mép. Ảnh thường tràn ngang (bố cục D, C) vẫn được ra mép, nhưng chủ thể (máy, tay, màn hình) không bị cắt.
   - Có nhịp: máy nghiêng 4–14° hoặc góc 3/4, không đứng thẳng cứng đơ chính giữa (trừ bìa so sánh iPad 2 máy: cùng cỡ, cùng tâm dọc, nghiêng đối xứng ≤ 5°, luật 16g).
   - Chọn 1 bố cục ở `_bo-dung-design/BAT-DAU-TU-DAY-DESIGN.md` mục 3 "Bố cục bìa": Hero tràn, Cận chi tiết, Cầm tay / đời thật, Sticker chú thích, Số to (cả 2 kênh; [Laptop] vẫn 1 ảnh đại diện theo luật 16, 18c); [iPad] thêm Đối đầu VS (2 máy) và Xòe quạt (3 máy). Không lặp bố cục của 2 bìa gần nhất cùng kênh: sổ `_bo-dung-design/noi-dung/bia-da-lam.md`, xong bài ghi 1 dòng. Ngoại lệ (fen chốt 30/10): [iPad] bài so sánh 2 máy được lặp Đối đầu, nhưng đổi kiểu bên trong (góc nghiêng, vị trí 2 máy, màu vệt sáng) cho khác 2 bìa gần nhất; không dùng huy hiệu VS (16g, fen bỏ 30/10).
   - Công cụ: ghép lớp ảnh bìa bằng `prep/bia_lop.py` (phải ra "DAT luat bia 17c", còn cảnh báo thì ghi lý do), đặt vào bằng `lopBia()`; sticker nghiêng, VS, số to, mũi tên bằng `code/bia-lib.jsx`. Mẫu đã chạy Photoshop: `Laptop\_bia-mau` (hero tràn ASUS TUF, cận card).
16b. Ảnh bìa có người thì ưu tiên người Việt/châu Á, bối cảnh gần gũi Việt Nam (sinh viên, dân văn phòng), không dùng ảnh người Tây kiểu stock. [Laptop] Máy trong ảnh bìa nên là Windows (HP, Dell, Lenovo), tránh MacBook nếu bài không nói về Mac.
16c. Ảnh bìa phải khớp đúng chữ trong tiêu đề, không chỉ cùng chủ đề chung. Vd tiêu đề "Ngành bạn cài app gì?" thì bìa là laptop mở màn hình app + sticker từng ngành kèm tên app; ảnh người ngồi dùng laptop là chưa đủ.
16d. Hạn chế trùng ảnh với các bài đã đăng (27/10). Trước khi dựng, chạy `prep/trung_anh.py kiem` dò cả bìa, ảnh máy, ảnh chụp màn hình và nền mờ với sổ ảnh `anh-da-dung.json`:
   - Bìa và ảnh máy chính: không dùng lại ảnh đã có ở bài trước (kể cả ảnh đã cắt, đổi nền, đổi cỡ). Cùng máy thì đổi góc chụp hoặc chụp máy thật ở shop.
   - Nền mờ: mỗi bài dùng ảnh nền chưa dùng; hết ảnh shop mới thì báo fen gửi thêm ngay đầu bài, vẫn làm tiếp bằng ảnh tạm.
   - Ảnh fen gửi kèm brief thì dùng theo fen, nhưng ghi "trùng bài X" vào bảng final.
   - Xong bài: chạy `prep/trung_anh.py them` để thêm ảnh bài mới vào sổ.
16e. Chỉ truy cập kho Polysto (tool POLY tim_may / du_lieu_may, app.polystorevn.com) khi chủ shop yêu cầu (28/10). Bài không nêu máy/giá cụ thể thì bỏ bước đối chiếu kho; bài cần giá/cấu hình kho thì ghi "chưa đối chiếu kho" vào bảng final và hỏi chủ shop.
16f. Thiết kế (28/10): mọi bài qua agent thiết kế (plugin `poly-carousel:thiet-ke`, ở chat là skill `polystore-soi-thiet-ke`) + `prep/kiem_bo_cuc.py` trước khi giao. Chữ trong lề x 98–982; khối ảnh + ô ý lấp vừa vùng giữa phụ đề và câu móc (trống ≤ 160–200px, không dồn trên); khối căn giữa; chữ ≥ 26px; tiêu đề ≤ 2 dòng trong 884px; tối đa 3 màu nhấn; khoanh nhấn cùng kiểu cả bài; viết thống nhất "Win + L".
16g. [iPad] Bìa bài so sánh 2 máy chỉ có tiêu đề + 1 ảnh 2 máy (29/10), thêm tối đa 1 dòng trắng nhỏ ≤ 6 chữ ngay dưới tiêu đề hoặc bỏ; không câu dài / câu giải thích (fen chốt 30/10). **Không huy hiệu VS** (`vsBadge`) trên bìa (fen bỏ 30/10, bài Pro 12.9 2020 hay 11 M1: "bỏ cái này đi"); đổi kiểu bìa Đối đầu bằng góc nghiêng, vị trí 2 máy, màu vệt sáng. Fen gửi ảnh chụp 1 phần chữ kèm "bỏ phần này" thì phần đó là thứ cần bỏ; bỏ xong dời ảnh lên sát tiêu đề, giữ trống ≤ 160px (17c, fen chốt 30/10). Câu hỏi/ý phụ của bìa so sánh (≤ 6 chữ, vd "CÙNG CHIP, CHÊNH Ở ĐÂU?") đặt thành chữ trắng nhỏ NGAY DƯỚI dòng tiêu đề vàng, không để cuối slide (Source Serif Italic `FS.I` cỡ 40, viết thường như "cùng tầm tiền, chọn đúng là đỡ tốn" của bìa Pro M1 vs Air M3, căn trái x 96, cách tiêu đề ~26px), ảnh máy nằm dưới dòng đó. Tiêu đề vàng bìa dài thì xuống 2 dòng cỡ 96 (cắt ở chỗ "HAY"), không ép 1 dòng nhỏ.
16h. Slide cuối là lời gọi hành động ngắn (29/10), **gọi follow (30/10, fen: "slide cuối kiểu action, kiểu gọi follow"; 11h fen bỏ dòng "Comment kèm ngân sách, Poly chọn máy 👇"; khối Follow nay đã bỏ cả 2 kênh, xem 2 ý dưới)**. Chung 2 kênh: chỉ chữ, không ảnh, không địa chỉ; câu hỏi chọn ngắn ≤ 2 dòng chữ lớn (vd "BẠN CHỌN / MÁY TRẠM HAY GAMING?"), giữ đúng chữ fen viết, không tự thêm dòng khác (luật 9); không có dòng kêu gọi comment kiểu "Comment kèm ngân sách, Poly chọn máy 👇" / "Comment, Poly tư vấn 👇" (fen bỏ 30/10 11h: câu hỏi tự kéo comment; brief có dòng đó thì bỏ khi dựng). Không viết dài, không liệt kê câu hỏi phụ (ngành, tầm tiền) trên slide; phần hỏi thêm để ở comment ghim.
   - **[Laptop] 30/10 15h22: fen bỏ khối Follow** ("slide cuối không cần mấy này", gửi ảnh chụp dòng "Follow để có thêm mẹo laptop" + "Bấm dấu + ở avatar bên phải"; 15h29 fen nhắc lại "mấy bài sau không hiện nữa", ảnh thẻ "Follow nhận mẹo giữ laptop chạy nhanh" + nút + mũi tên: mọi bài Laptop từ nay, kể cả bài sửa, đều bỏ; file plugin / agent còn dạy `khoiFollow` thì luật này thắng): slide cuối Laptop giống iPad, chỉ còn **1 thẻ kính câu hỏi căn giữa slide** (y ~520–920); không gọi `khoiFollow`, không dòng lợi ích follow, không nút "+ Follow @polystorelaptop", không mũi tên, không dòng "Bấm dấu + ở avatar bên phải". Brief Laptop không viết dòng "Follow:" (brief có thì bỏ khi dựng). Hàm `khoiFollow` trong `code/bia-lib.jsx` để nguyên, chỉ không dùng.
   - **[iPad] 30/10 12h20: fen xoá khối Follow** (gửi ảnh chụp thẻ Follow + mũi tên kèm "xóa", bài Lên iPadOS 27): slide cuối iPad chỉ còn **1 thẻ kính câu hỏi căn giữa slide** (y ~520–920), không thẻ Follow, không mũi tên. **Fen chốt 12h30: áp cho mọi bài iPad**. Brief iPad không viết dòng "Follow:".
16i. Brief ghi "Ảnh: … ở shop" (thợ Poly mở máy, máy thật) mà chưa có ảnh (30/10): dùng ảnh tạm đúng loại (mở đáy laptop, không lấy RAM máy bàn), **không ghi chữ "ảnh minh họa" trên hình** (fen bỏ 30/10, xem 16k), ghi "ảnh tạm" vào log / bảng final và hỏi fen ảnh shop. Fen gửi ảnh thì thay ngay cho đúng slide đó, cắt vừa khung 884 không phóng to.
16k. **Không ghi chữ "ảnh minh họa" trên hình (30/10, cả 2 kênh).** Fen: "bỏ mất chữ ảnh minh họa trên hình". Ảnh tạm, ảnh mạng, ảnh hãng, ảnh card / linh kiện đều không gắn nhãn "ảnh minh họa" (hay "minh họa") lên slide; nguồn và chuyện ảnh tạm chỉ ghi trong log / bảng final / dòng HOI_FEN. Bài cũ có nhãn thì khi sửa bỏ luôn.
16j. **Ảnh minh họa không để lộ trade mark (30/10).** Ảnh mạng / ảnh hãng / ảnh tạm có chữ in, ký hiệu, tem, logo thương hiệu (tem pin, ký hiệu CE/tái chế, logo hãng, watermark, tên nguồn như iFixit) thì **xoá bằng Photoshop** trước khi dựng: script nền qua hàng chờ `_tu-chay` (Content-Aware Fill vùng chữ, mẫu `iPad\T10_iPadOS27NongMay_30-10\tai-nguyen\script\xoa-ky-hieu-pin.jsx`), Read lại ảnh xem sạch chưa. Trên slide không ghi nhãn nào (không "ảnh minh họa", luật 16k; không tên thương hiệu nguồn); nguồn ghi trong log / bảng final.
18. [Laptop] Bài mẹo, phím tắt: ảnh ví dụ là ảnh chụp màn hình thật trên máy Windows của shop, không vẽ mockup. Ai chụp (fen chốt 30/10 13h20, ngoại lệ luật 11b): Claude tự chụp trên máy shop CHỈ khi fen không dùng máy và đồng ý trước. Chat claude.ai: hỏi fen bằng lựa chọn trước khi chụp. Chạy từ app Poly Dựng Bài: không tự chụp; dùng ảnh fen gửi (dòng "Ảnh: …" của brief), chưa có thì làm như 16i (ảnh tạm hoặc dựng lại đúng bố cục), cuối bài hỏi bằng dòng `HOI_FEN:` có để Claude chụp lúc fen rời máy không; fen chọn cho chụp thì lượt trả lời chụp rồi thay ảnh. Bảng nào Windows không cho chụp (vd Win+P) thì dựng lại đúng bố cục thật và ghi rõ trong bảng final. Ảnh chụp màn hình phải nét: chụp bằng Snipping Tool (chế độ Full screen, tự lưu PNG gốc 1920x1200 vào Pictures\Screenshots), không dùng ảnh zoom của công cụ điều khiển máy (bị nén JPEG mờ); cắt vùng cần dùng, không phóng to quá 1,2 lần. Hộp thoại dựng lại thì vẽ ở 2x rồi thu nhỏ.
18b. [Laptop] Slide so sánh loại linh kiện (card, RAM, ổ cứng…) phải có ảnh linh kiện thật cho từng bên, không chỉ chữ (29/10). Ảnh lấy từ hãng/nguồn không watermark trang khác (loại VideoCardz, TechPowerUp chặn bot thì bỏ), cắt cùng khung, không lấy mặt người; ghi trong bảng final là ảnh minh hoạ (card rời, không phải card hàn trên máy), trên slide không ghi chữ "minh họa" (16k).
18c. [Laptop] Bài so sánh 2 loại máy (29/10): bìa chỉ 1 máy, chọn máy đại diện rồi zoom to (to trong 35–62% khung, tràn mép ≤ 10% máy, luật 17c [Laptop] 30/10) (fen đã bỏ kiểu ảnh 2 máy cạnh nhau vì bố cục kỳ, vẫn theo luật 16 một ảnh); nếu bắt buộc 2 máy thì cùng góc chụp, cùng cỡ, cùng tâm dọc, trái/phải cân đối, không chồng lên nhau, không máy nằm ngửa/úp; mọi slide kết luận/tổng kết cũng phải có ảnh minh hoạ cho từng bên, không để thẻ chỉ có chữ. Ảnh card/linh kiện ghi chú nhỏ "ảnh card rời" để tên và hình khớp nhau (bỏ chữ "minh họa" trên hình từ 30/10, luật 16k).

**Quy trình**
11. Tự bật Photoshop (qua hàng chờ / COM, luật 11b), tự chạy script, không hỏi giữa chừng. Chỗ chưa rõ thì tự chọn phương án hợp lý nhất và ghi vào bảng final.
11b. **Photoshop chỉ chạy bằng script nền, không đụng màn hình fen (30/10).** Fen: "chạy photoshop bằng script để không [đụng] không gian mình làm việc, không xài Cowork". Mọi việc Photoshop (dựng, sửa, tách nền, xuất ảnh) đi qua hàng chờ `C:\Users\Dao\Pictures\PolySocial\_tu-chay` (`code/chay_ps.py`, `code/tach_nen_ps.py`). **Cấm** dùng điều khiển màn hình / computer use / Cowork (chụp màn hình, bấm chuột, gõ phím, mở cửa sổ) để thao tác Photoshop hay bất kỳ app nào trên máy shop khi làm bài: fen đang làm việc trên máy. Script không `app.bringToFront()`, không mở hộp thoại, chỉ đóng file do script tạo. Hàng chờ không chạy (`_tu-chay\dang-chay.txt` cũ hơn 30 giây) thì báo fen 1 câu "Photoshop chưa bật hàng chờ, fen mở Photoshop giúp" rồi chờ, không tự mở bằng điều khiển màn hình. Xem ảnh slide thì đọc file PNG (Read, `prep/xem_nhanh.py`), không chụp màn hình. Cấm luôn Chrome thật của fen (Claude in Chrome) trên máy shop khi làm bài (luật 19).
   - **Ngoại lệ duy nhất (fen chốt 30/10 13h20):** chụp ảnh màn hình bài mẹo / phím tắt [Laptop] (luật 18): Claude được mở cửa sổ, Snipping Tool, điều khiển màn hình CHỈ khi fen không dùng máy và fen đồng ý trước (chat: hỏi bằng lựa chọn trước khi chụp; app: không tự chụp, hỏi bằng `HOI_FEN:` cuối bài). Ngoài việc này 11b giữ nguyên.
12. Làm nhanh:
    - Biên tập brief và tìm ảnh cùng lúc.
    - Dồn hết chỗ sửa rồi chạy Photoshop 1 lần.
    - Duyệt 1 vòng, **không vòng 2** (fen chốt 30/10): sửa gộp mọi lỗi rồi soi lại bằng `prep/soi_tat_ca.py`, không gọi agent duyệt lần 2.
13. Tự duyệt xong mới gửi chủ shop, gửi một lần duy nhất, kèm bảng final (chạy từ app Poly Dựng Bài: theo lệnh của app, không bảng final).
14. Thư mục bài mới đặt tên `T10_<TenBai>_<ngày-tháng>` (vd `E:\Social Claude\Laptop\T10_BaoGia3MacBookAir_20-10`). Danh sách tên mới của bài cũ: `E:\Social Claude\_doi-ten-log.txt`.
19. Tải ảnh (fen chốt 30/10 13h20): **cấm dùng Chrome thật của fen (Claude in Chrome) trên máy shop khi làm bài** (luật 11b). App Poly Dựng Bài / Claude Code trên máy: tải bằng `curl` như cũ. Chat claude.ai: dùng trình duyệt trong app Claude, mở ảnh rồi chụp vùng ảnh (zoom) là lưu được; không dùng tải xuống của trình duyệt trong app (lần nào cũng bật bảng Save, chủ shop phải bấm). Có file nào rơi vào Downloads thì chuyển hết vào E:\Social Claude\Anh tai ve, không để rác trong Downloads.

### Lịch sử sửa
| Ngày | Bài | Chủ shop sửa | Logic rút ra |
|---|---|---|---|
| 30/10 | [iPad] Pro 12.9 2020 hay 11 M1 (`iPad\T10_Pro129vsPro11M1_30-10`) | Bìa: gửi ảnh chụp huy hiệu VS vàng kèm "bỏ cái này đi" | [iPad] Bìa so sánh 2 máy không dùng huy hiệu VS (`vsBadge`); 2 máy + tiêu đề tự nói là so sánh. Luật 16g, 17c. |
| 30/10 | (chung) | "đảm bảo thông tin đúng mới đưa vào nội dung nha" → thêm luật 4c: mọi ý (slide, caption, comment ghim) phải kiểm chứng nguồn chính hãng / tin cậy trước khi viết brief và dựng; chưa kiểm chứng thì bỏ, không viết né; tin đồn ghi rõ (1d) | 4c, mục 1 |
| 30/10 | (chung) | "update quy tắc này chưa mấy bài sau không hiện nữa" (ảnh thẻ "Follow nhận mẹo giữ laptop chạy nhanh" + nút "+ Follow @polystorelaptop" + mũi tên) → nhắc lại [Laptop] bỏ hẳn khối Follow ở slide cuối mọi bài (cả bài sửa); luật 16h thắng chỗ plugin / agent còn dạy `khoiFollow` | 16h [Laptop] |
| 30/10 | (chung) | "slide cuối không cần mấy này" (ảnh chụp dòng "Follow để có thêm mẹo laptop" + "Bấm dấu + ở avatar bên phải") → [Laptop] bỏ khối Follow ở slide cuối: chỉ 1 thẻ kính câu hỏi căn giữa slide như iPad, brief Laptop không dòng "Follow:" | 16h [Laptop], 9, mục 4 |
| 30/10 | (chung) | "thumnail luôn đạt được yêu cầu: ngắn gọn, gây tò mò, vào thẳng vấn đề" → 17b thêm 2 ý bắt buộc: vào thẳng vấn đề (chữ đầu là chủ đề, không dạo đầu) + gây tò mò (hở 1 điều, đáp án ở slide trong, không giật tít sai); mọi bìa đủ 3 ý, thiếu thì viết lại | 17b |
| 30/10 | (chung) | "Hình thumbnail đừng tràn viền mất quá nhiều" → [Laptop] bìa máy tràn mép tối đa 10% (thay 30%), 1 mép, thấy gần trọn máy; [iPad] giữ ≤ 30% | 17c [Laptop] |
| 30/10 | Laptop cho dân kiến trúc | "Bỏ mất chữ ảnh minh họa trên hình" (fen nhắc, ghi thành quy tắc) → slide 5, 6 bỏ nhãn "ảnh minh họa"; mọi bài 2 kênh không ghi nhãn "ảnh minh họa" trên hình, ảnh tạm / nguồn chỉ ghi log, bảng final | 16k (mới), 16i, 16j, 18b, 18c |
| 30/10 | (chung) | Fen chọn 8 ý agent soát luật hỏi (13h20): (1) ảnh chụp màn hình bài mẹo: Claude được tự chụp chỉ khi fen không dùng máy và đồng ý trước, app thì hỏi `HOI_FEN` cuối bài; (2) cấm Claude in Chrome trên máy shop, chat dùng trình duyệt trong app, app dùng curl; (3) không duyệt vòng 2, soi lại bằng `soi_tat_ca.py`; (4) [iPad] tin hot được làm, bìa vẫn là câu hỏi chọn máy; (5) trống tiêu đề ↔ ảnh 160px mọi bìa; (6) bìa so sánh iPad được 1 dòng trắng nhỏ ≤ 6 chữ hoặc bỏ; (7) bìa so sánh iPad được lặp Đối đầu VS, đổi kiểu bên trong; (8) giữ tràn mép ≤ 30% | 11b, 18, 19, 12, 1d (mới), 17c, 16g, 17b, mục 7, 10, 11 |
| 30/10 | (chung) | "Agent liên kết các luật quy tắc chặt chẽ logic với nhau" → soát mọi file luật, sửa chỗ còn dạy cách cũ (bìa khung viền, iPad dùng khoiFollow, nút Follow @poly.store, câu hỏi cuối dài ở tệp người xem, kiểm giá theo kho, hàng chờ 20 giây…); thêm `_bo-dung-design\SO-DO-LUAT.md` (luật nào ở file nào, đổi 1 luật sửa file nào); đầu mỗi file con trỏ về mục 12 | đầu file, mục 1, 3, 3b, 4, 8, 10, 11, 12 (2, 9, 11, 13, 16, 16b, 16h, 18) |
| 30/10 | (chung) | Claude hỏi "bỏ khối Follow áp cho Laptop luôn không?" → fen chọn "Mọi bài iPad": iPad bỏ Follow (slide cuối 1 thẻ câu hỏi giữa slide, brief không dòng Follow), Laptop giữ 2 thẻ | 16h [iPad], mục 4 |
| 30/10 | Lên iPadOS 27 nóng máy | Slide 7: fen gửi ảnh chụp thẻ Follow (lợi ích + nút Follow + mũi tên) kèm "xóa" → bỏ cả thẻ Follow, thẻ câu hỏi dời ra giữa slide | 16h [iPad] |
| 30/10 | Lên iPadOS 27 nóng máy | Slide 6 "ảnh minh họa có trade mark, xóa bằng pts" → xoá chữ + ký hiệu in trên viên pin (ảnh iFixit) bằng Content-Aware Fill trong Photoshop (script nền), nhãn bỏ chữ "iFixit" chỉ còn "ảnh minh họa" | 16j |
| 30/10 | (chung) | "Thêm quy tắc chung viết bài, thông tin có ích, có giá trị" → mỗi slide giữa có ≥ 1 thông tin cụ thể dùng được (số có nguồn, thao tác làm theo được, máy + việc chạy được, cách kiểm / xử lý); ưu tiên điều người xem chưa biết, điều chỉ người bán / thợ biết; bỏ câu khen chung, ý ai cũng biết; mẹo làm theo được; so sánh phải chốt ai lấy máy nào | 1c, mục 1 |
| 30/10 | (chung) | "Comment kèm ngân sách, Poly chọn máy 👇 bỏ câu dạng này đi, ghi trong quy tắc" → slide cuối bỏ hẳn dòng kêu gọi comment kiểu "Comment …, Poly … 👇": thẻ trên chỉ còn câu hỏi chọn ngắn (người xem tự trả lời ở comment), thẻ dưới khối Follow; brief có dòng đó thì bỏ khi dựng | 16h, mục 4 |
| 30/10 | Laptop cho dân code | Slide 6 "thay ảnh": fen gửi ảnh máy mở đáy thật ở shop thay ảnh tạm (ảnh mạng mở đáy laptop) → cắt vừa khung 884x500, bỏ nhãn "ảnh minh họa" | 16, 16i |
| 30/10 | (chung) | "Chạy photoshop bằng script để không [đụng] không gian mình làm việc, ko xài Cowork, update vào bộ quy tắc" → Photoshop chỉ chạy script nền qua hàng chờ, cấm điều khiển màn hình / computer use / Cowork khi làm bài | 11b, mục 7 |
| 30/10 | (chung) | "Quy tắc làm slide, slide cuối kiểu action, kiểu gọi follow" → fen chọn "Follow + comment ngang nhau": 2 thẻ kính bằng nhau, thẻ dưới khối Follow to (lợi ích + nút + mũi tên chỉ dấu + ở avatar) bằng `khoiFollow` | 16h, 9, mục 4 |
| 29/10 | (chung) | "Mấy dạng hình ảnh thumbnail làm sáng tạo vô, căn chỉnh bố cục, to nhỏ phù hợp, đừng kiểu gắn vô cho có" → bìa bỏ ảnh trong khung viền, máy tách nền + bóng + vệt sáng, cỡ 35–62% khung, nghiêng / tràn mép, chọn bố cục theo menu, không lặp 2 bìa gần nhất; công cụ `prep/bia_lop.py` + `code/bia-lib.jsx`; agent thiết kế chấm bìa /5 | 17c |
| 15/10 | Mac vs Win | Bỏ icon 🍎/🪟; đổi dòng phụ trên thumbnail | 3, 8 |
| 15–16/10 | Bảng giá laptop | Ảnh đặt giữa; thông số không che máy; giá nhỏ màu xanh, bỏ chữ "Giá"; thumbnail chỉ có chữ, làm bắt mắt hơn | 5, 7, 10 |
| 15/10 | EliteBook 8 G1i 14 | Màn ghi 15.6 inch, sửa lại thành 14 inch | 4 |
| 16/10 | Top 5 đồ họa | Bỏ tag xanh và huy hiệu #; slide cuối bỏ ảnh laptop, căn giữa, bỏ "FOLLOW POLY" | 8, 9 |
| 20/10 | 3 MacBook Air 13/20/27tr | Tự bật Photoshop, không hỏi; làm nhanh hơn | 11, 12 |
| 20/10 | 3 MacBook Air 13/20/27tr | Ảnh M1 phải cùng kiểu với M2 và M4 | 6 |
| 20/10 | 3 MacBook Air 13/20/27tr | Bỏ "máy A/B/C"; chuyển sang dạng báo giá (tên máy, cấu hình, giá, đối tượng phù hợp) | 1, 2 |
| 20/10 | Báo giá 3 MacBook Air | Bỏ slide bảng giá tóm tắt vì thừa; thông tin đủ là được | 2 |
| 20/10 | Báo giá 3 MacBook Air | Bìa bỏ giá, giá chỉ để trong slide từng máy | 5 |
| 20/10 | Báo giá 3 MacBook Air | Bỏ nhãn pill "TẦM xx TRIỆU" trên slide từng máy vì thừa | 8 |
| 20/10 | Báo giá 3 MacBook Air | Lấy style và template bài Mac vs Win làm chuẩn cho mọi bài | mục 3b |
| 21/10 | Top 5 máy trạm (agent duyệt bắt) | Slide từng máy phải dùng tiêu đề chữ có chân vàng + phụ đề nghiêng như bài Mac vs Win (không dùng chữ tròn trắng của head14); bìa bỏ nhãn tên máy dán lên ảnh, thêm câu móc đáy | mục 3b, 8 |
| 21/10 | Top 5 máy trạm | Slide cuối bỏ ô địa chỉ, chỉ giữ lời kêu gọi + Follow | 9 |
| 21/10 | Top 5 máy trạm | Ảnh HP ZBook bị bóp méo: bước cắt nền ép ảnh về khung vuông. Cắt nền phải giữ đúng tỉ lệ gốc, so dáng máy với ảnh gốc trước khi dựng | 3 |
| 22/10 | Laptop gaming | Nền 1 màu nhìn chán: làm nền sinh động, tùy biến theo từng slide như bên iPad (mỗi máy 1 tông màu riêng) | 15 |
| 22/10 | Laptop gaming | Nền đốm màu tự vẽ chưa đúng ý: lấy đúng style nền bài Mac vs Win (ảnh thật làm mờ, phủ tối) | 15 |
| 22/10 | Laptop gaming | Thumbnail luôn lấy nền xanh lá tối (bg-thumb) | 17 |
| 22/10 | 5 phím tắt laptop | Chụp màn hình thật để làm ví dụ chuẩn | 18 |
| 22/10 | 5 phím tắt laptop | Thumbnail ảnh laptop chung chung chưa hợp lý → đổi sang cận bàn phím ThinkPad tô phím Shift, Ctrl, Win | 16 |
| 22/10 | Ngành cài app gì | Tải ảnh bật bảng Save bắt chủ shop bấm → chuyển sang tải bằng Chrome, dọn Downloads sau khi dùng | 19 |
| 22/10 | Laptop gaming | Bìa chỉ cần 1 ảnh đại diện, không ghép nhiều máy | 16 |
| 22/10 | Laptop gaming | Không để giá trên slide từng máy (bài giới thiệu nhiều máy, giá để khách comment hỏi) | 5 |
| 22/10 | Ngành cài app gì | Ảnh bìa đổi 2 lần; chủ shop muốn "kiểu VN" → dùng ảnh sinh viên châu Á với laptop HP | 16b |
| 22/10 | Ngành cài app gì | Thumbnail chưa khớp tiêu đề → laptop HP mở Start menu + 4 sticker nghiêng (ngành · app) | 16c |
| 22/10 | 5 thói quen (dừng) | Mở cửa sổ Chrome mới liên tục để chụp ảnh làm phiền → bị dừng; chuyển sang chụp bằng trình duyệt trong app | 19 |
| 23/10 | 3 cái khóa (sau thay bằng 3 lỗi vặt) | Slide 5 ảnh 3 máy để bàn chung chung → đổi ảnh khác (1 máy cụ thể, màn sáng) | 16 |
| 23/10 | 3 lỗi vặt | Slide cuối tự thêm "COMMENT TÊN MÁY" + dòng xanh → bỏ. Slide cuối chỉ giữ đúng chữ chủ shop viết + nút Follow, không tự thêm dòng | 9 |
| 23/10 | 3 lỗi vặt | Ảnh chụp màn hình bị mờ → chụp lại bằng Snipping Tool (PNG gốc), không phóng to | 18 |
| 27/10 | Top 5 dưới 25 triệu | Chủ shop gửi ảnh HP EliteBook chụp ở shop → thay ảnh bìa (giữ nguyên khung ảnh, không cắt nắp máy). Ảnh chủ shop gửi luôn ưu tiên hơn ảnh tự tìm | 16 |
| 27/10 | (chung) | Hạn chế trùng ảnh với các post đã làm → thêm sổ ảnh + công cụ dò trùng, chạy trước khi dựng | 16d |
| 29/10 | (chung) | "Bổ sung quy tắc, thumbnail làm ngắn gọn thôi" → bìa tiêu đề ≤ 6 chữ, dòng phụ ≤ 6 chữ hoặc bỏ, câu móc bìa laptop ≤ 5 chữ, cả bìa ≤ ~12 chữ | 17b, mục 3b, 4 |
| 29/10 | (chung) | "Thêm quy tắc trùng thì không làm nữa" → chủ đề đã có bài thì không viết, không dựng; báo bài trùng + gợi ý chủ đề khác | 1b |
| 29/10 | Pro M2 vs Air M2 | Bìa: fen gửi ảnh chụp dòng phụ đề "Cùng chip M2 mà giá khác nhau, coi có đáng không?" và bảo "bỏ phần này" → bỏ phụ đề bìa, chỉ còn tiêu đề + ảnh 2 máy | 16g [iPad] |
| 29/10 | Pro M2 vs Air M2 | Bìa: dòng trắng nhỏ "CÙNG CHIP, CHÊNH Ở ĐÂU?" phải nằm ngay dưới dòng tiêu đề vàng (không để cuối slide) | 16g [iPad] |
| 29/10 | Pro M2 vs Air M2 | Bìa: dòng trắng nhỏ dưới tiêu đề phải dùng font như bìa Pro M1 vs Air M3 (Source Serif Italic, viết thường), không phải UTM Avo Bold in hoa | 16g [iPad] |
| 29/10 | Pro M2 vs Air M2 | Slide cuối viết dài ("Bạn học ngành gì, có tầm bao nhiêu, chọn…") → rút còn kiểu gọi hành động ngắn: "BẠN CHỌN / PRO M2 HAY AIR M2?" + "Comment, Poly chọn máy giúp 👇" + Follow | 16h |
| 29/10 | Pro M2 vs Air M2 | Bìa: tiêu đề vàng 1 dòng dài → xuống dòng thành 2 dòng ("iPAD PRO M2" / "HAY AIR M2?") | 16g [iPad] |
| 29/10 | Máy trạm hay gaming | Slide 2 chỉ chữ: "cho hình mấy cái card thực tế đi" → thêm ảnh card RTX A2000 và GeForce RTX 4060 mỗi bên | 18b [Laptop] |
| 29/10 | Máy trạm hay gaming | Slide 5 "check lại thông tin đúng chưa" → bỏ khẳng định "SolidWorks, Catia không chứng nhận GeForce" (SolidWorks chưa có nguồn chính hãng), viết "card ngoài danh sách hãng chứng nhận, lỗi hiển thị khó nhờ hãng hỗ trợ" + nhãn "chạy Catia, SolidWorks" | 4b |
| 29/10 | Máy trạm hay gaming | Bìa "chọn 1 máy zoom to ra" → bỏ ảnh 2 máy, dùng 1 máy (ASUS TUF A15 chính diện) phóng to chiếm gần hết khung, đúng luật 16 (1 ảnh/bìa) | 16, 18c [Laptop] |
| 29/10 | Máy trạm hay gaming | Bìa 2 máy: "vị trí 2 laptop nằm kì quá" (Dell nắp A chồng lên ASUS) → 2 máy cùng góc mở, cùng cỡ, cùng tâm dọc, đặt trái/phải cân đối, không chồng nhau | 18c [Laptop] |
| 29/10 | Máy trạm hay gaming | Slide 1 "cho loại laptop đi" → bìa 2 máy (Dell máy trạm + ASUS TUF); slide 2 "hình card đã đúng với tên chưa" → thêm ghi chú ảnh card rời; slide 6 "cho hình minh họa" → ảnh từng bên | 18c [Laptop] |
| 28/10 | (chung) | Chỉ truy cập kho Poly khi chủ shop yêu cầu | 16e |
| 28/10 | (chung) | Muốn có agent riêng lo bố cục, typography, hài hoà, không lỗi vặt → thêm skill thiết kế + công cụ soi bố cục | 16f |
| 28/10 | (chung) | Gom tab Design Laptop + iPad về 1 quy trình, 1 bộ code (`_bo-dung-design`, làn iPad `ipad\`), sổ ảnh chung 2 kênh; thêm app Poly Dựng Bài; dọn các dòng cũ mâu thuẫn mục 12 (bìa emoji, slide cuối có địa chỉ, xin phép tải ảnh, chạy Photoshop bằng tay) | đầu file, mục 2, 3b, 4, 6, 7, 10, 11 |
| 20/10 | Sắp xếp thư mục | Đặt tên thư mục bài theo dạng `T10_<TenBai>_<ngày-tháng>` | 14 |
