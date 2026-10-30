# Poly Dựng Bài

App trên máy shop Poly Store (DESKTOP-FMBNEET) để Claude dựng bài carousel TikTok (Laptop @polystorelaptop, iPad @poly.store) bằng Photoshop chạy nền, rồi gửi Telegram / mở TikTok qua tiện ích Chrome.

| Thư mục repo | Trên máy shop | Là gì |
|---|---|---|
| `/` (server.py, ui/, dev/, prompts/) | `E:\Tool\poly-dung-bai` | App: máy chủ Python + giao diện + lệnh mẫu cho Claude |
| `tiktok-ext/` | `E:\Tool\poly-dung-bai\tiktok-ext` | Tiện ích Chrome Poly TikTok (điền ảnh, caption; không tự bấm Post) |
| `social-claude/` | `E:\Social Claude` | Bộ luật làm content, bộ dựng design (code Photoshop), plugin poly-carousel |

Đọc trước: `PROJECT.md` (hồ sơ dự án, nhật ký), `HUONG-DAN.txt` (cách dùng cho fen), `social-claude/_bo-dung-design/SO-DO-LUAT.md` (luật nào ở file nào).

Không có trong repo (cố ý): `config.json` (token Telegram, cài đặt máy), `jobs/` (bài đã làm), nhật ký, ảnh bài, dữ liệu trình duyệt. Cài lại máy mới: chép repo về đúng 2 thư mục trên, mở app, cài lại Telegram trong app.

Giao diện sửa ở `dev/_index.src.html`, build ra `ui/index.html` bằng `python3 dev/build_ui.py`.
