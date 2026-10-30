---
description: Dựng 1 hoặc nhiều bài carousel Poly Store (laptop hoặc iPad) từ brief: biên tập, kiểm thông tin, dựng, duyệt chạy song song
argument-hint: <brief dán vào, hoặc đường dẫn file brief; nhiều bài thì ngăn bằng dòng ---; ghi rõ kênh nếu có>
---

Fen giao bài. Brief (hoặc đường dẫn file brief):

$ARGUMENTS

Làm theo skill `poly-carousel` (đọc SKILL.md của nó trước, rồi đọc `E:\Social Claude\POLY-quy-tac-lam-content.md` mục 12 và `E:\Social Claude\_bo-dung-design\BAT-DAU-TU-DAY-DESIGN.md`: phần chung + phần riêng kênh).

1. Tách các bài (ngăn bởi dòng `---` hoặc nhiều file). Mỗi bài xác định: **kênh** (dòng "Kênh:" trong brief; không có thì đoán theo máy trong bài: iPad → iPad, laptop/MacBook → Laptop, ghi lại chỗ tự quyết), ngày đăng, tên thư mục `T10_<TenBai>_<dd-mm>` trong `E:\Social Claude\Laptop\` hoặc `E:\Social Claude\iPad\`. Câu đầu tiên: báo fen làm mấy bài, bài nào, kênh nào. Tạo task list các bước.
2. **Một lượt gọi song song** cho mọi bài: agent `poly-carousel:bien-tap` và agent `poly-carousel:kiem-thong-tin` (đưa brief gốc + kênh, không đưa ý mình).
3. Gộp kết quả 2 agent thành brief đã chốt. Thiếu ảnh shop thì ghi 1 dòng ngay, làm tiếp bằng ảnh tạm. Ảnh fen gửi kèm (đường dẫn trong brief) luôn dùng trước.
4. 1 bài: tự dựng bước 3–8 theo đúng làn của kênh (Laptop: `KIT/code/build.py` + `KIT/slides`; iPad: `KIT/ipad/build.py` + `poly-lib.jsx`). Nhiều bài: **một lượt gọi song song** agent `poly-carousel:dung-slide` cho từng bài.
5. Bản dựng đầu xong: soi 1 lệnh `soi_tat_ca.py`, rồi **một lượt gọi song song** agent `poly-carousel:thiet-ke` + agent `poly-carousel:duyet-bai` (mới) cho từng bài, đưa kênh. Sửa gộp mọi lỗi, build lại 1 lần chỉ slide lỗi. Không duyệt vòng 2 (luật làm nhanh, mục 1b sổ dựng).
6. Giao 1 lần: mỗi bài 1 bảng final gọn + đường dẫn thư mục (chạy từ app: theo lời giao của app, không bảng final). Chạy `trung_anh.py them` cho thư mục kênh để cập nhật sổ ảnh.
Lệnh Python chờ Photoshop (`chay_ps.py`) chạy với timeout 600000 ms. Không hỏi fen giữa chừng; chỗ mơ hồ tự chọn và ghi vào bảng final (app: dòng `HOI_FEN:`). Giá chỉ ghi khi brief có giá hoặc fen nhắn cần.
Bài giao từ app Poly Dựng Bài: in `THU_MUC_BAI=<đường dẫn đầy đủ thư mục bài>` ngay khi tạo thư mục và ở dòng cuối cùng (nhiều bài thì mỗi bài 1 dòng).
