# Plugin poly-carousel: dựng bài TikTok Poly Store bằng Claude Code trên máy shop

Chạy thẳng trên máy shop: Claude đọc/ghi `E:\Social Claude`, gọi Photoshop qua hàng chờ `_tu-chay`, không phải chép file qua lại. Mở 2–3 cửa sổ Claude Code là làm 2–3 bài song song; trong 1 bài, agent biên tập + kiểm thông tin + dựng + duyệt cũng chạy song song.

## Đã cài sẵn (27/10)
Python 3.12 + thư viện ảnh, Claude Code 2.1.311, plugin `poly-carousel@poly-store` (bản 1.1.0 từ 28/10: chạy cả 2 kênh), file quyền `E:\Social Claude\.claude\settings.json`. Nhật ký: `poly-carousel\cai-dat\cai-tu-dong.log`, `kiem-sau-cai.log`.

**Fen chỉ còn làm 1 việc: đăng nhập Claude Code lần đầu** — mở thư mục `E:\Social Claude`, chuột phải → Open in Terminal → gõ `claude` → chọn đăng nhập bằng tài khoản Claude (trình duyệt tự mở) → bấm Trust thư mục.

## Cài lại trên máy khác (3 bước)
1. Bấm đúp `poly-carousel\cai-dat\cai-dat.bat`.
2. Mở Claude Code tại `E:\Social Claude` (chuột phải thư mục → Open in Terminal → gõ `claude`; lần đầu bấm Trust cho thư mục), rồi gõ:
   ```
   /plugin marketplace add "E:\Social Claude\_bo-dung-design\plugin"
   /plugin install poly-carousel@poly-store
   ```
3. Mở Photoshop (bộ tự chạy bật theo Photoshop).

## Dùng hằng ngày
**Cách nhanh nhất: app Poly Dựng Bài** (icon "Poly Dung Bai" ngoài Desktop, code ở `E:\Tool\poly-dung-bai`). Chọn kênh, dán brief, kéo ảnh, bấm Chạy; app gọi lệnh plugin bên dưới chạy ngầm, hiện tiến độ + slide + bảng final, có ô Sửa. Cần đăng nhập Claude Code 1 lần (nút Đăng nhập trên app, hoặc `claude auth login`).

Gõ tay trong Claude Code vẫn được:

| Gõ | Để làm gì |
|---|---|
| `/poly-carousel:dung-bai` + dán brief | Dựng 1 bài. Nhiều bài thì dán liền, ngăn bằng dòng `---` |
| `/poly-carousel:sua-bai T10_Top5Duoi25Tr_28-10 slide 5 thay hình khác` | Sửa bài, dựng lại đúng slide, ghi luật vào file quy tắc |
| `/poly-carousel:do-trung-anh T10_Top5Duoi25Tr_28-10` | Dò trùng ảnh với bài cũ |
| `/poly-carousel:do-trung-anh cap-nhat` | Cập nhật sổ ảnh đã dùng |

## Có gì trong plugin
- `commands/`: 3 lệnh trên.
- `agents/`: `bien-tap`, `kiem-thong-tin`, `dung-slide`, `duyet-bai` (agent duyệt chạy riêng, không thấy quá trình dựng).
- `skills/poly-carousel/SKILL.md`: quy trình 11 bước chung 2 kênh + phần riêng Laptop / iPad + luật hay bị bắt. Luật đủ vẫn ở `E:\Social Claude\POLY-quy-tac-lam-content.md`.
- Bộ code: Laptop dùng `_bo-dung-design\code` + `slides`, iPad dùng `_bo-dung-design\ipad` (poly-lib.jsx); công cụ soi `prep\` và sổ ảnh dùng chung (sổ có cả ảnh bài iPad từ 28/10).
- `cai-dat/`: file cài + mẫu quyền `settings.mau.json` (cho Claude Code chạy Python, đọc/ghi trong `E:\Social Claude` mà không hỏi từng lần).

## Sửa plugin
Plugin đọc thẳng từ thư mục này, sửa file xong trong Claude Code gõ `/reload-plugins` là có hiệu lực.

## Lưu ý
- Nên cài Git for Windows (https://git-scm.com) để Claude Code có Git Bash; không có vẫn chạy bằng PowerShell.
- Claude Code bản 2.1.214 trở lên (gõ `claude update`) để chữ tiếng Việt không lỗi.
- Tách nền dùng Photoshop (Select Subject), không cài thêm công cụ AI nào.
- Mỗi lần chạy nhiều agent song song sẽ tốn lượt dùng gói Claude nhanh hơn. Mặc định cho tối đa 8 agent cùng lúc (sửa trong `E:\Social Claude\.claude\settings.json`).
