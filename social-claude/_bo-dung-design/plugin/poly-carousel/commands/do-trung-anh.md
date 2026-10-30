---
description: Dò trùng ảnh của 1 bài (laptop hoặc iPad) với mọi bài đã làm (luật 16d), hoặc cập nhật sổ ảnh
argument-hint: <tên thư mục bài> | cap-nhat
---

Yêu cầu: $ARGUMENTS

- Nếu là `cap-nhat`: chạy `python "E:/Social Claude/_bo-dung-design/prep/trung_anh.py" them "E:/Social Claude/Laptop"` rồi `... them "E:/Social Claude/iPad"`, báo số ảnh trong sổ (sổ chung 2 kênh từ 28/10).
- Nếu là tên bài: tìm thư mục bài (Laptop hoặc iPad), chạy `python "E:/Social Claude/_bo-dung-design/prep/trung_anh.py" kiem "<bai>/tai-nguyen" <TenThuMucBai>` (iPad: `<bai>/tai-nguyen/anh-that`). Với mỗi dòng TRUNG / GAN GIONG: mở 2 ảnh bằng Read để xác nhận, rồi trả fen bảng Ảnh · Trùng với bài nào · Mức · Đề xuất thay (ảnh shop chưa dùng, góc chụp khác, hoặc nhờ fen chụp máy thật).
