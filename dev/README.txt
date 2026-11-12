POLY DỰNG BÀI - bộ để sửa app (dành cho Claude / lead agent)
====================================================================
Đọc PROJECT.md ở thư mục gốc app trước.

_index.src.html   nguồn giao diện (1 file HTML + CSS + JS thuần). Sửa ở đây.
fonts.css         10 dòng @font-face Be Vietnam Pro (chèn vào chỗ /*FONTS*/).
build_ui.py       python dev/build_ui.py  -> ui/index.html (kiểm cú pháp JS bằng node).
                  Trang app đang mở tự tải lại khi ui/index.html đổi (fen không đang gõ).
test/fake_claude.py  CLI giả để thử app không tốn lượt Claude. Trong brief/prompt có chữ:
                    CHAM      chạy chậm (slide 3 chờ 15 phút)   -> thử trang "đang chạy"
                    KHONGTASK không gửi task list              -> thử ô Tiến độ khi không có bước
                    LOI       chết giữa chừng "Not logged in"   -> thử trang lỗi
                    THUHOI    câu cuối có "Đã đổi so với brief" + 2 dòng HOI_FEN -> thử ô Claude hỏi fen
                  Có 2 sự kiện "result" như CLI thật (Claude chờ agent nền).
phan-tich-bai.py  python dev/phan-tich-bai.py jobs/<id> [--chi-tiet]
                  -> thời gian từng lệnh, Photoshop, agent, bị chặn quyền, chi phí.

THỬ APP TRONG MÁY THỬ (máy Claude, không đụng app thật)
Xem CLAUDE.md ở thư mục gốc: python3 dev/test/tao-may-thu.py dựng máy thử (Claude / Telegram / cloudflared giả) + các script thử.
