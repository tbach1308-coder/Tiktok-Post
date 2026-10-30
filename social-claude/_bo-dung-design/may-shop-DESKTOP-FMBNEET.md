# Máy shop DESKTOP-FMBNEET (quét 27/10/2026)

Máy Windows ở shop dùng để dựng ảnh/video TikTok. Claude điều khiển qua app Claude (liên kết máy) và chạy Claude Code + plugin `poly-carousel` ngay trên máy.

## Phần cứng, hệ điều hành
- Windows 11 Home (build 26200), user `Dao`.
- CPU Intel Core i7-13700KF, RAM 16 GB, GPU NVIDIA RTX 3070.
- Màn 1920x1200 (trong công cụ điều khiển máy là khung 1389x868), taskbar bên phải.
- Ổ C: trống ~300 GB; ổ E: trống ~290 GB.

## Phần mềm đã có
- Adobe: Photoshop 2026 (27.8), Premiere Pro 2026, Illustrator 2026, Media Encoder 2026, Creative Cloud.
- Dựng/edit khác: CapCut.
- Lập trình: Python 3.12.10 (cài 27/10), Node.js 24, Git 2.56, GitHub CLI, Claude Code 2.1.311 (cài 27/10, npm), winget.
- Khác: Chrome, Edge, Telegram, Zalo, 3uTools, Apple Mobile Device Support, Radmin VPN, Lightshot, WinRAR, UniKey, POLYTool (chạy cùng Windows), Note Dao.
- Thư viện Python đã cài: pillow, numpy, scipy, opencv-python (thêm rembg + mô hình isnet trong `~/.rembg`, hiện không dùng).
- Font: bộ UTM đầy đủ (UTM Avo/AvoBold, UTM Cookies, UTM Bebas…), một số SVN. Font Source Serif dùng trong slide đến từ Adobe Fonts (không nằm trong thư mục Fonts của Windows).

## Thư mục quan trọng
| Thư mục | Dùng cho |
|---|---|
| `E:\Social Claude\Laptop\T10_<Bai>_<dd-mm>` | Bài laptop (slide PNG/PSD, `tai-nguyen`, `log`) |
| `E:\Social Claude\iPad\...` | Bài iPad |
| `E:\Social Claude\_bo-dung-design` | Bộ code dựng 2 kênh (Laptop `code\` + `slides\`, iPad `ipad\`) + plugin (`plugin\`) + sổ ảnh đã dùng (chung 2 kênh) |
| `E:\Social Claude\_template_chuan` | Thông số style iPad bài 14 (README); code dựng iPad nay ở `_bo-dung-design\ipad` |
| `E:\Social Claude\POLY-quy-tac-lam-content.md` | Bộ quy tắc (bản trên máy) |
| `E:\Social Claude\Anh tai ve` | Ảnh tải về |
| `E:\Social Claude\.claude\settings.json` | Quyền cho Claude Code trong thư mục này |
| `E:\Tool\` | Tool shop: `Anh` (ảnh máy theo seri), `poly-dung-bai` (app dựng bài), `poly-video`, `poly-premiere`, `san-bai-poly`, `dang-bai-ext`, `cat-video` |
| `C:\Users\Dao\Pictures\PolySocial\_tu-chay` | Hàng chờ Photoshop tự chạy (nhat-ky.txt, dang-chay.txt) |
| `C:\Users\Dao\Downloads\Telegram Desktop` | Ảnh shop fen gửi qua Telegram |

Thư mục đã nối với Claude: PolySocial, E:\Social Claude, Downloads, Screenshots, E:\Tool\Anh.

## Tự động hoá
- Photoshop tự chạy: `poly-tu-chay.jsx` gắn ở Script Events Manager → Start Application, bật `poly-tu-chay.vbs` canh `_tu-chay` mỗi 5 giây. **Photoshop tắt thì bộ tự chạy cũng tắt** (27/10 Photoshop bị đóng lúc 16h27 → phải mở lại). Kiểm: `dang-chay.txt` cập nhật trong 30 giây gần nhất.
- Chạy lệnh trên máy khi không có shell: viết `.bat`/`.ps1`, rồi thả `.jsx` gọi `File("...bat").execute()` vào `_tu-chay`, ghi kết quả ra file log.
- **App Poly Dựng Bài** (28/10): `E:\Tool\poly-dung-bai`, icon "Poly Dung Bai" ngoài Desktop, máy chủ nhỏ `pythonw server.py` cổng 8777 (cổng 8765 là tool đăng bài). Gọi `C:\Users\Dao\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe -p` tại `E:\Social Claude` với lệnh plugin `/poly-carousel:dung-bai` / `sua-bai`. Cần Claude Code CLI đăng nhập (`claude auth login`, khác với nút `</>` trong app Claude). Cập nhật server: chạy `lam-moi-app.bat`.
- Claude Code: dùng nút `</>` trong app Claude (cùng đăng nhập, gói Max) hoặc gõ `claude` trong terminal (cần đăng nhập riêng). Plugin `poly-carousel@poly-store` đã cài ở cấu hình chung `C:\Users\Dao\.claude`.
