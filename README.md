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

## MacBook (macOS)
Chạy đủ như máy shop (viết brief, Photoshop qua hàng chờ, Telegram, tiện ích TikTok). Hướng dẫn cho fen: `HUONG-DAN-MAC.txt`.

| Trên Mac | Tương đương máy shop |
|---|---|
| Thư mục app (vd `~/Tool/poly-dung-bai`), mở bằng `Poly Dung Bai.command`, tắt bằng `Tat Poly Dung Bai.command` | `E:\Tool\poly-dung-bai`, `Poly Dung Bai.vbs` |
| `~/Social Claude` (lần đầu app tự chép từ `social-claude/`) | `E:\Social Claude` |
| `~/Pictures/PolySocial/_tu-chay`, bộ canh `social-claude/_bo-dung-design/tu-chay/poly-tu-chay-mac.py` (app tự bật) | `C:\Users\Dao\Pictures\PolySocial\_tu-chay`, `poly-tu-chay.vbs` |
| `plugin/poly-carousel/cai-dat/cai-dat-mac.command`, `kiem-may-mac.command` | `cai-dat.bat/.ps1`, `kiem-may.bat` |

`server.py` có `IS_MAC`: nhánh Windows giữ nguyên từng byte lệnh giao Claude; trên Mac đường dẫn máy shop trong lệnh mẫu / luật chung được đổi sang đường dẫn Mac, luật chung thêm đoạn "TRÊN MÁY NÀY". 2 thư mục gốc ghi trong `config.json` (`thu_muc_lam_viec`, `tu_chay`). Thư mục chạy `_mac/`, `_chrome/` không đưa lên repo.
