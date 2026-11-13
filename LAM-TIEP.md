# Làm tiếp app Poly Dựng Bài (cho tài khoản Claude nào cũng được)

Fen (chủ shop POLY Store, gọi "fen", Claude xưng "mình") hay đổi tài khoản Claude nhưng vẫn làm trên **máy shop Windows (DESKTOP-FMBNEET)**.
Đọc file này xong là làm tiếp được ngay, không cần hỏi lại fen chuyện cũ.

## 1. Lấy repo (repo công khai)
```
git clone https://github.com/tbach1308-coder/Tiktok-Post /home/claude/tiktok-post
```
Muốn push (bắt buộc, xem mục 4): phiên cần quyền ghi GitHub (nối GitHub / thêm repo `tbach1308-coder/Tiktok-Post` với quyền push).
Chưa có quyền thì báo fen 1 câu: "fen nối GitHub cho tài khoản Claude này giúp mình".

## 2. Đọc trước khi làm (theo thứ tự)
1. `CLAUDE.md`: luật của fen, cách chép bản sửa lên máy shop, máy thử. **Luật cứng nằm ở đây.**
2. `PROJECT.md` mục **7. Nhật ký**: dòng **mới nhất ở trên cùng**; dòng đầu ghi việc còn dở / chờ fen (nếu có).
3. `HUONG-DAN.txt`: fen dùng app thế nào.

## 3. Nối máy shop + công cụ
- Chat phải được mở bằng app Claude trên máy shop và bấm "Link to this computer" (có các công cụ máy: đọc / chép file, trình duyệt trong app, điều khiển máy).
- App ở `E:\Tool\poly-dung-bai`, chạy ở `http://127.0.0.1:8777`: xem / gọi app bằng **trình duyệt trong app Claude** (built-in browser).
- Canva: nối đúng tài khoản Canva của fen (thư mục **POLY Theme** chứa theme, **POLY Dựng Bài** chứa bài).
- Máy thử để thử trước khi chép lên máy shop: `python3 dev/test/tao-may-thu.py` rồi làm theo mục "Máy thử" trong `CLAUDE.md`.

## 4. Mỗi lần làm xong 1 việc (fen dặn 13/11: "update liên tục để khi cần mình làm tiếp dc")
1. Thử trên máy thử → chép lên máy shop (cách trong `CLAUDE.md`, so sha256).
2. Ghi 1 dòng lên **đầu** mục 7. Nhật ký trong `PROJECT.md`: giờ, lời fen, đã làm gì, mã thiết kế Canva / id theme, việc còn dở.
3. Commit + push ngay (không gom cuối buổi).

## 5. Cách trả lời fen
Tiếng Việt, ngắn, đúng việc, không thuật ngữ lập trình. Cần fen chọn thì hỏi bằng lựa chọn, có 1 lựa chọn "(Recommended)".
Cài / chạy công cụ trên máy fen, khởi động lại app: **hỏi trước**. Soát ra lỗi: báo fen trước rồi mới sửa.
