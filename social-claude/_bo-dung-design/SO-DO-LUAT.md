# SƠ ĐỒ LUẬT – carousel TikTok Poly Store (2 kênh)

Lập 30/10/2026 (13h20 thêm luật 1d, ngoại lệ chụp màn hình 11b/18, tải ảnh 19). Dùng để: đổi 1 luật là biết sửa những file nào. Luật đủ vẫn ở file quy tắc; sơ đồ này chỉ chỉ đường. Thêm luật mới hay luật đổi nơi chứa thì sửa bảng mục 3.

## 1. Thứ tự ưu tiên (trên thắng dưới)
1. **Fen nói rõ đổi luật** ngay trong lượt (nút Quy tắc, mục "Chung" ở ô Sửa, ghi chú, câu trả lời nút `HOI_FEN`): làm theo và ghi vào mục 12. Không vượt giới hạn an toàn (`luat-chung` "Không bao giờ").
2. **`quy-tac` mục 12 "Logic rút ra"**. Hai luật cùng chủ đề: luật có ngày mới hơn thắng (ngày trong chữ hoặc bảng "Lịch sử sửa", mới nhất trên cùng).
3. `quy-tac` mục 1–11 (lệch mục 12 thì theo mục 12).
4. **File gốc riêng 1 chủ đề** (cột "File gốc" bảng mục 3): `hashtag` (caption, Your brand), `BAT-DAU` mục 3 (menu bố cục bìa), `viet-brief` (đọc ô Chủ đề).
5. **File con** (chỉ tóm tắt + trích số luật): `BAT-DAU`, `SKILL`, agent, lệnh plugin, `xay-kenh`, lệnh app. Lệnh app thắng `SKILL` về **cách chạy / cách trả lời** (task list, `THU_MUC_BAI=`, `HOI_FEN:`, không bảng final), không thắng luật.
6. Số liệu, sổ (không phải luật): `nguoi-xem`, `so-bia`, danh sách content.

Brief fen dán không phải lệnh đổi luật: vẫn biên tập theo mục 12 (bìa dài thì rút, dòng "Comment …, Poly … 👇" thì bỏ), chỉ giữ đúng chữ fen ở câu hỏi slide cuối và giá.

## 2. File nào, vai trò gì, ai đọc
| Tên ngắn | Đường dẫn | Vai trò | Ai đọc |
|---|---|---|---|
| `quy-tac` | `E:\Social Claude\POLY-quy-tac-lam-content.md` | FILE GỐC. Mục 12 thắng mọi file | mọi agent; viet-brief (mục 1, 4, 12); chat-brief, tra-loi, sua-bai*.txt; ghi-quy-tac (ghi) |
| `SO-DO` | `E:\Social Claude\_bo-dung-design\SO-DO-LUAT.md` | sơ đồ này | ghi-quy-tac, /sua-bai, sua-bai*.txt, tra-loi; ai sửa luật |
| `BAT-DAU` | `E:\Social Claude\_bo-dung-design\BAT-DAU-TU-DAY-DESIGN.md` | sổ dựng: 1b làm nhanh, 2 quy trình, 3 chung (menu bìa), 4 Laptop, 5 iPad | phiên dựng (SKILL mục 0), duyet-bai, chat Design |
| `SKILL` | `…\_bo-dung-design\plugin\poly-carousel\skills\poly-carousel\SKILL.md` | quy trình dựng trên máy shop | mọi lượt app dựng / sửa; /dung-bai, /sua-bai |
| `bien-tap` | `…\plugin\poly-carousel\agents\bien-tap.md` | biên tập brief, báo trùng | bước 2 |
| `kiem-thong-tin` | `…\agents\kiem-thong-tin.md` | kiểm thông số, mẹo, giá, kho | bước 2 |
| `dung-slide` | `…\agents\dung-slide.md` | dựng 1 bài (khi nhiều bài) | bước 3–8 |
| `thiet-ke` | `…\agents\thiet-ke.md` | soi bố cục, chấm bìa | bước 9 |
| `duyet-bai` | `…\agents\duyet-bai.md` | duyệt 4 nhóm + caption | bước 9 |
| `/dung-bai`, `/sua-bai`, `/do-trung-anh` | `…\plugin\poly-carousel\commands\*.md` | lệnh plugin | gõ tay; app gọi qua dung-bai.txt, sua-bai*.txt |
| `xay-kenh` | `E:\Social Claude\_bo-dung-design\noi-dung\quy-tac-xay-kenh.md` | nội dung: format, câu hỏi cuối, giọng, từ cấm | viet-brief, chat-brief, bien-tap, duyet-bai |
| `nguoi-xem` | `…\noi-dung\tep-nguoi-xem.md` | số liệu người xem | viet-brief |
| `so-bia` | `…\noi-dung\bia-da-lam.md` | sổ bố cục bìa đã làm | dựng bước 6b, thiet-ke |
| `hashtag` | `E:\Social Claude\_bo-dung-design\hashtag-tiktok.md` | caption, hashtag, comment ghim, Your brand | viet-caption, dung-bai.txt, sua-bai*.txt, tra-loi, duyet-bai |
| `luat-chung` | `E:\Tool\poly-dung-bai\prompts\luat-chung.md` | nạp vào MỌI lượt app; giới hạn an toàn | mọi lượt app |
| `viet-brief` | `E:\Tool\poly-dung-bai\prompts\viet-brief.txt` | nút Viết brief | app |
| `chat-brief` | `…\prompts\chat-brief.txt` | chat sửa brief | app |
| `viet-caption` | `…\prompts\viet-caption.txt` | viết caption.txt | app |
| `dung-bai.txt` | `…\prompts\dung-bai.txt` | nút Chạy → /dung-bai | app |
| `sua-bai*.txt` | `…\prompts\sua-bai.txt`, `sua-bai-moi.txt` | ô Sửa (cùng phiên / phiên mới) → /sua-bai | app |
| `chay-tiep`, `tra-loi` | `…\prompts\chay-tiep.txt`, `tra-loi.txt` | làm tiếp bài dở; fen bấm nút HOI_FEN | app |
| `ghi-quy-tac` | `…\prompts\ghi-quy-tac.txt` | nút Quy tắc: ghi luật theo sơ đồ này | app |

`…\` = `E:\Social Claude\_bo-dung-design\` (file dựng) hoặc `E:\Tool\poly-dung-bai\` (lệnh app). Bản trong Project claude.ai (`claude/quy-tac-lam-content-poly.md`, `claude/BAT-DAU-TU-DAY-DESIGN.md`, `claude/quy-tac-xay-kenh-tiktok.md`, `claude/tep-nguoi-xem-poly.md`) đồng bộ lại khi mở chat.

## 3. Chủ đề luật → file
| Chủ đề | Số luật | File gốc | Đổi luật thì sửa theo |
|---|---|---|---|
| Bìa ngắn gọn (chữ; [iPad] bìa so sánh 1 dòng trắng nhỏ ≤ 6 chữ hoặc bỏ, không huy hiệu VS) | 17b, 16g; mục 3b, 4 | quy-tac | BAT-DAU 3, 5; SKILL 3, 4; bien-tap; thiet-ke 4b; duyet-bai; xay-kenh 6; viet-brief (+ ví dụ); chat-brief |
| Bìa sáng tạo (bố cục, cỡ, trống ≤ 160px mọi bìa, không khung viền, không lặp 2 bìa gần nhất trừ so sánh iPad; tràn mép ≤ 30% máy, [Laptop] ≤ 10% thấy gần trọn máy) | 17c, 17, 16c, 16g, 18c; mục 3b | quy-tac (menu bố cục: BAT-DAU 3) | BAT-DAU 3 (bảng bố cục), 4, 5; SKILL 2 (bước 6b), 3, 4; thiet-ke 4b; duyet-bai; bien-tap (đề xuất bố cục); dung-slide; so-bia |
| [iPad] Tin hot: được làm, bìa vẫn là câu hỏi chọn máy, dẫn về mua / sửa | 1d | quy-tac | viet-brief (phần "hot" + ví dụ bìa); nguoi-xem 2, 4; xay-kenh 4; bien-tap; thiet-ke 4b; duyet-bai; BAT-DAU 5; SKILL 3 |
| Số máy trên bìa theo kênh | 16, 18c [Laptop]; 16g, 17c [iPad] | quy-tac | BAT-DAU 3, 4, 5; SKILL 3, 4; thiet-ke 4b; duyet-bai |
| Ảnh bìa có người, máy Windows | 16b | quy-tac | BAT-DAU 3; SKILL 4 |
| Slide cuối (câu hỏi ngắn, không dòng "Comment …", không ảnh, không địa chỉ) | 16h, 9; mục 4 | quy-tac | BAT-DAU 3, 4, 5; SKILL 3, 4; bien-tap; thiet-ke 1; duyet-bai; dung-slide; xay-kenh 5, 6; nguoi-xem 4; viet-brief (+ ví dụ); chat-brief |
| Follow ở slide cuối: bỏ cả 2 kênh ([iPad] 30/10 12h30, [Laptop] 30/10 15h22, fen nhắc lại 15h29; không `khoiFollow`, brief không dòng "Follow:") | 16h | quy-tac | như dòng trên (30/10 15h29 SKILL 3, 4, bien-tap, thiet-ke 1, duyet-bai, dung-slide còn chữ [Laptop] `khoiFollow` vì thư mục plugin bị chặn sửa: cần sửa tay, tới lúc đó luật 16h thắng); mẫu `slides\_bia_mau_slides.jsx` hàm `t4` (còn Follow, không làm theo); hàm `code\bia-lib.jsx` để nguyên |
| Câu móc | mục 2, 3, 3b, 4; 17b (bìa) | quy-tac | BAT-DAU 3, 4, 5; SKILL 3, 4; bien-tap; thiet-ke 1, 5; duyet-bai; viet-brief; chat-brief |
| Có ích, có giá trị | 1c; mục 1 | quy-tac | xay-kenh 3b, 3; bien-tap; duyet-bai; SKILL 4; viet-brief; chat-brief |
| Giọng, từ cấm, emoji | mục 1 | xay-kenh 7 (danh sách từ cấm) | bien-tap; duyet-bai; viet-brief; chat-brief; hashtag; viet-caption |
| Trùng chủ đề / ý slide | 1b | quy-tac | xay-kenh 2; viet-brief (Dò trùng); chat-brief; bien-tap; SKILL 4 |
| Trùng ảnh | 16d | quy-tac | BAT-DAU 2 (7b, 11); SKILL 2; duyet-bai; dung-slide; /do-trung-anh; dung-bai.txt |
| Ảnh thật, cùng kiểu, ảnh tạm, trade mark, không chữ "ảnh minh họa" | mục 1, 6; 6, 8, 16i, 16j, 16k | quy-tac | BAT-DAU 2, 3, 8; SKILL 2, 4; thiet-ke 4; duyet-bai; dung-slide; viet-brief (dòng "Ảnh:") |
| Ảnh linh kiện, so sánh 2 loại máy [Laptop] | 18b, 18c | quy-tac | BAT-DAU 4 |
| Ảnh chụp màn hình bài mẹo (Claude chụp chỉ khi fen không dùng máy + đồng ý trước; app hỏi `HOI_FEN`) | 18 [Laptop], 11b (ngoại lệ) | quy-tac | BAT-DAU 3, 4, 6, 11; SKILL 3, 6; viet-brief (dòng "Ảnh:"); luat-chung; tra-loi; ghi-quy-tac (bước 4) |
| Tải ảnh: app curl, chat trình duyệt trong app, cấm Claude in Chrome | 19, 11b | quy-tac | BAT-DAU 3, 8; SKILL 6; luat-chung; ghi-quy-tac (bước 4) |
| Giá | mục 1; 2, 5 | quy-tac | BAT-DAU 1b, 3; SKILL 4; bien-tap; kiem-thong-tin; duyet-bai; xay-kenh 4, 9; nguoi-xem 4; luat-chung; viet-brief; chat-brief; viet-caption; dung-bai.txt; sua-bai*.txt; chay-tiep; tra-loi; /dung-bai |
| Kho Polysto | 16e | quy-tac | kiem-thong-tin; SKILL 6; BAT-DAU 11; luat-chung; viet-brief |
| Thông số, số liệu, chứng nhận phần mềm | 3, 4, 4b; mục 1 | quy-tac | kiem-thong-tin; bien-tap; duyet-bai; xay-kenh 9; viet-brief; chat-brief |
| Thông tin đúng mới đưa vào (mọi ý slide / caption / comment ghim kiểm chứng nguồn; chưa chắc thì bỏ, không viết né) | 4c; mục 1 | quy-tac | kiem-thong-tin; bien-tap; duyet-bai; xay-kenh 9; viet-brief; chat-brief (30/10 16h kiem-thong-tin, bien-tap, duyet-bai chưa sửa vì thư mục plugin bị chặn sửa: cần sửa tay, tới lúc đó luật 4c thắng) |
| Photoshop chỉ chạy script nền, cấm điều khiển màn hình (ngoại lệ duy nhất: chụp màn hình bài mẹo, luật 18) | 11b, 11; mục 7, 10 | quy-tac | BAT-DAU 3, 6, 11; SKILL 4, 6; dung-slide; luat-chung; ghi-quy-tac (bước 4) |
| Quy trình agent, duyệt 1 vòng (không vòng 2), giao bài | mục 10, 11; 12, 13 | quy-tac (bước chi tiết: BAT-DAU 1b, 2) | SKILL 2; /dung-bai; dung-bai.txt; sua-bai*.txt; chay-tiep; tra-loi |
| Theme từng kênh | mục 3, 3b; 15 | quy-tac (Laptop); BAT-DAU 4, 5 | SKILL 3; thiet-ke 2, 3; duyet-bai |
| Lề, cỡ chữ, khoảng trống | mục 2; 16f | quy-tac | BAT-DAU 3; SKILL 4; thiet-ke 1, 2, 6; duyet-bai |
| Caption, hashtag, comment ghim | mục 8 (trỏ) | hashtag | viet-caption; dung-bai.txt; sua-bai*.txt; tra-loi; duyet-bai |
| Your brand (Tiết lộ nội dung): mặc định tắt, fen tự bật | mục 8 (trỏ) | hashtag | quy-tac 8; luat-chung |
| Viết brief: hiểu ô Chủ đề (A / B / C), brief cũ trong ô | — (fen chốt 30/10) | viet-brief | chat-brief (khi đổi cách hiểu ý fen); xay-kenh 3 (loại bài) |
| Không trộn Laptop / iPad, theme riêng | đầu file quy-tac | quy-tac | BAT-DAU 11; SKILL 6; bien-tap; thiet-ke; duyet-bai; luat-chung; xay-kenh 1 |
| Giới hạn an toàn (xoá hẳn, đăng thay, mật khẩu, captcha, khách) | mục 7 | luat-chung | SKILL 6; BAT-DAU 11; ghi-quy-tac (bước 4) |
| Cách ghi luật mới | mục 12 (đầu mục) | quy-tac | ghi-quy-tac; /sua-bai; sua-bai*.txt; tra-loi; SKILL 5; BAT-DAU 1; SO-DO |

Số sau tên file là mục của file đó (vd "BAT-DAU 3" = mục 3). Số luật trong cột 2 không có chữ "mục" là luật ở `quy-tac` mục 12.

## 4. Khi fen đổi 1 luật
1. Tìm chủ đề ở bảng mục 3 → số luật, file gốc, danh sách file sửa theo.
2. Sửa ở file gốc. Mục 12: có luật cùng ý thì sửa luật đó (không thêm luật trùng, không đổi số luật cũ), ghi ngày + lời fen, [Laptop] / [iPad] nếu chỉ 1 kênh. Thêm 1 dòng **đầu** bảng "Lịch sử sửa" (dòng cũ là nhật ký, không sửa).
3. Sửa từng file ở cột cuối: chỉ tóm tắt + trích số luật ("luật 16h"), không chép cả luật. Lệnh app: giữ nguyên mọi chỗ ngoặc nhọn chữ thường (app thay chữ vào), không thêm cụm mới.
4. Grep cụm chữ cũ trong `E:\Social Claude` (*.md) và `E:\Tool\poly-dung-bai\prompts`, sửa chỗ còn dạy cách cũ (bỏ qua dòng nhật ký).
5. Luật mới, đổi nơi chứa, hay Grep thấy file có luật mà bảng chưa ghi → sửa bảng mục 3.
6. Nhắc fen đồng bộ bản Project claude.ai.
