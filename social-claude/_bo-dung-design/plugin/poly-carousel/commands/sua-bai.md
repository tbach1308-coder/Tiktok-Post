---
description: Sửa bài đã dựng (laptop hoặc iPad) theo ý fen, dựng lại đúng slide cần sửa và ghi luật rút ra vào file quy tắc
argument-hint: <tên/đường dẫn thư mục bài> <fen muốn sửa gì>
---

Fen yêu cầu sửa: $ARGUMENTS

1. Tìm thư mục bài trong `E:\Social Claude\Laptop\` hoặc `E:\Social Claude\iPad\` (khớp gần đúng tên). Phần slide của bài:
   - Laptop: `E:\Social Claude\_bo-dung-design\slides\<bai>_slides.jsx`;
   - iPad: `<bai>\tai-nguyen\script\*.part.jsx` (bản mới nhất; bài cũ trước 28/10 có thể là `slidesNN.part.jsx` ghép với `headNN/helpersNN/baseNN` cùng thư mục).
   Phiên bản mới nhất xem trong `<bai>\log\`.
2. Sửa đúng chỗ fen nói (ảnh thì làm lại tài nguyên, chạy `kiem_anh.py tai-nguyen` (laptop) + `trung_anh.py kiem`; chữ thì sửa phần slide).
3. Build phiên bản mới chỉ với slide bị ảnh hưởng (Laptop: `code/build.py ... vN+1 <ds slide>`; iPad: `ipad/build.py "<bai>" "<part>" "out/<ten>-vN+1.jsx" --only <ds slide>`), chạy `code/chay_ps.py`, soi 1 lệnh `prep/soi_tat_ca.py "<bai>" vN+1` rồi xem `log\tong.png` (1 lần Read). Không gọi lại agent duyệt nếu chỉ sửa đúng chỗ fen nói.
4. Ghi vào `E:\Social Claude\POLY-quy-tac-lam-content.md`: thêm 1 dòng vào đầu bảng **Lịch sử sửa** (ngày | bài | fen sửa gì | luật số mấy; mới nhất trên cùng) và, nếu là luật mới dùng được cho bài sau, thêm 1 mục vào **Logic rút ra** (đã có ý tương tự thì sửa luật đó, không thêm trùng; luật chỉ của 1 kênh thì ghi [Laptop] / [iPad]). Luật đổi hay thêm thì sửa luôn các file con mà `E:\Social Claude\_bo-dung-design\SO-DO-LUAT.md` ghi cho chủ đề đó (thêm luật / đổi nơi chứa thì cập nhật sơ đồ). Đọc file trước, sửa bằng Edit, không ghi đè cả file.
5. Trả fen: slide đã sửa (đường dẫn), 1 dòng luật đã ghi. Nhắc: bản quy tắc trong Project claude.ai cần đồng bộ khi mở chat Claude. Bài sửa từ app Poly Dựng Bài: dòng cuối `THU_MUC_BAI=<đường dẫn>`.
