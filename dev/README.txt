POLY DỰNG BÀI - bộ để sửa app (dành cho Claude / lead agent)
====================================================================
Đọc PROJECT.md ở thư mục gốc app trước.

_index.src.html   nguồn giao diện (1 file HTML + CSS + JS thuần). Sửa ở đây.
fonts.css         10 dòng @font-face Be Vietnam Pro (chèn vào chỗ /*FONTS*/).
build_ui.py       python dev/build_ui.py  -> ui/index.html (kiểm cú pháp JS bằng node).
                  Trang app đang mở tự tải lại khi ui/index.html đổi (fen không đang gõ).
fake_claude.py    CLI giả để thử app không tốn lượt Claude. Trong brief/prompt có chữ:
                    CHAM      chạy chậm (slide 3 chờ 15 phút)   -> thử trang "đang chạy"
                    KHONGTASK không gửi task list              -> thử ô Tiến độ khi không có bước
                    LOI       chết giữa chừng "Not logged in"   -> thử trang lỗi
                    THUHOI    câu cuối có "Đã đổi so với brief" + 2 dòng HOI_FEN -> thử ô Claude hỏi fen
                  Có 2 sự kiện "result" như CLI thật (Claude chờ agent nền).
phan-tich-bai.py  python dev/phan-tich-bai.py jobs/<id> [--chi-tiet]
                  -> thời gian từng lệnh, Photoshop, agent, bị chặn quyền, chi phí.

THỬ APP TRONG SANDBOX (máy Claude, không đụng app thật)
1. Chép server.py, ui/, prompts/, dev/fake_claude.py sang 1 thư mục trống.
2. config.json trong đó: {"port": 8778, "lenh_claude": ["python3", "<đường dẫn>/fake_claude.py"],
   "thu_muc_lam_viec": "<thư mục>", "them_thu_muc": ["<thư mục>/ws"],
   "thu_muc_bai": {"laptop": "<thư mục>/ws/Laptop", "ipad": "<thư mục>/ws/iPad"}}
3. python3 server.py & ; tạo bài: POST /api/run {"kenh":"ipad","ten_bai":"thu","brief":"Slide 1: ...\nCHAM"}
4. Chụp bằng Playwright 1440x900, 1200x800, 900x800; bắt pageerror.
   Tắt server bằng pid (kill $(cat srv.pid)), không dùng pkill -f.

THỬ THƯ VIỆN PHOTOSHOP (trước khi thay poly-lib.jsx / make-mac-vs-win.jsx)
- Dựng 2 slide của 1 bài cũ bằng bản cũ và bản mới, lưu ra out\_do-toc-do-* (KHÔNG lưu đè thư mục bài),
  đo giờ từng hàm (bọc $.global[tên hàm]) rồi so ảnh PNG từng điểm ảnh. Lệch > vài trăm điểm là phải xem.
- make-mac-vs-win.jsx: build.py Laptop lấy đúng 223 dòng đầu -> sửa phần đầu phải giữ nguyên số dòng.

PHÁT HÀNH LÊN MÁY SHOP (từ chat có liên kết máy)
- device_commit_files các file đã đổi vào E:\Tool\poly-dung-bai\...
- Đổi server.py: thả 1 file .jsx tên MỚI vào C:\Users\Dao\Pictures\PolySocial\_tu-chay\ gọi
  new File("E:/Tool/poly-dung-bai/lam-moi-app-v3.bat").execute() -> xem kiem-app.log phải còn đúng 1 dòng LISTENING.
  Bài đang chạy không bị ảnh hưởng (claude.exe chạy riêng, server mới đọc tiếp stream).
- Chỉ đổi ui/ hoặc prompts/: không cần khởi động lại (đọc lại mỗi lần).
