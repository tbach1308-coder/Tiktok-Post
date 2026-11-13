# Poly Dựng Bài · ghi chú cho Claude (mọi tài khoản)

Chủ shop (gọi **"fen"**, Claude xưng **"mình"**) dùng app này trên máy shop Windows để Claude dựng bài carousel TikTok
(Laptop @polystorelaptop, iPad @poly.store) bằng Photoshop / Canva. Trả lời **tiếng Việt, ngắn, đúng việc**, không thuật ngữ lập trình.
Cần fen quyết thì hỏi bằng lựa chọn (AskUserQuestion), có 1 lựa chọn "(Recommended)".

Đọc trước khi làm: `README.md` (bố cục repo, Mac), `PROJECT.md` (hồ sơ + nhật ký từng yêu cầu của fen, mới nhất ở ĐẦU mục 7. Nhật ký),
`HUONG-DAN.txt` (cách dùng cho fen). Mỗi lần sửa: ghi 1 dòng nhật ký vào `PROJECT.md` + cập nhật `HUONG-DAN.txt` nếu fen thấy khác.

## Máy shop
- App ở `E:\Tool\poly-dung-bai` (máy DESKTOP-FMBNEET), bài / luật ở `E:\Social Claude` (= `social-claude/` trong repo).
- Mở app: `Poly Dung Bai.vbs`; khởi động lại: bấm đúp `lam-moi-app-v3.bat` trong thư mục app. Nhật ký: `app-log.txt`.
- `config.json` trên máy (token Telegram, cài đặt) **không bao giờ** đưa lên repo / chat; không in token.

## Phát hành lên máy shop (cần session nối được máy shop qua app Claude desktop)
1. Sửa trong repo; giao diện sửa ở `dev/_index.src.html` rồi `python3 dev/build_ui.py && cp dev/_index.src.html _index.src.html`.
2. Thử trên máy thử (dưới). 3. Commit + push.
4. Chép file lên máy: chép vào `/mnt/user-data/outputs/<thư mục>/` → `device_list_dir` lấy mtime → `device_commit_files`
   (có `expectedMtimeMs`) → `device_stage_files` lại, so sha256.
5. Đổi `server.py` thì phải khởi động lại app: **luôn hỏi fen trước** (Claude bấm giúp / fen tự bấm / để sau), kiểm không có bài
   đang chạy (`/api/jobs` không có `dang-chay`, theme không đang sửa) rồi mới bấm. Bấm giúp = computer use File Explorer (chỉ click):
   New Volume (E:) → Tool → poly-dung-bai → bấm đúp `lam-moi-app-v3.bat`; xem `app-log.txt` có dòng `mo app cong 8777` giờ mới.
   Đọc / gọi API app trên máy shop: khung trình duyệt trong app Claude (built-in browser) mở `http://127.0.0.1:8777`.

## Luật của fen (giữ nguyên)
- **Update GitHub liên tục** (fen 13/11 11h56 "update liên tục để khi cần mình làm tiếp dc", fen hay đổi tài khoản Claude):
  mỗi lần sửa xong 1 việc (kể cả việc nhỏ / chỉ sửa Canva) là ghi 1 dòng nhật ký `PROJECT.md` (mã thiết kế Canva, id theme, việc còn dở)
  rồi commit + push ngay, không gom để cuối buổi. Script máy thử sửa ở `/home/claude/bug3` thì chép lại vào `dev/test/` trước khi commit.
- Cài / chạy / cập nhật công cụ gì trên máy fen: hỏi trước. Mỗi lần khởi động lại app: hỏi trước.
- Soát lỗi xong: báo danh sách lỗi cho fen trước rồi mới sửa.
- Không xoá hẳn file: dời vào `_to_delete`. Không nhập mật khẩu / token / API key. Không vượt captcha. Không đổi cài đặt hệ thống.
- Kho Polysto: chỉ thông tin máy + giá bán (không giá vốn, HH, ghi chú, tên / SĐT khách); POLY chỉ đọc; không dùng `tim_anh` (ảnh khách).
- Canva: không sửa / xoá thiết kế của fen khi fen chưa bảo; bài mới vào thư mục "POLY Dựng Bài", theme ở "POLY Theme", bản cũ "POLY Theme cũ".
- Telegram Remote: chỉ tài khoản đã nối; không chạy lệnh máy; không tự đăng TikTok. Không dùng Claude in Chrome trên máy shop để đăng bài.
- Không đóng file fen đang mở trong Photoshop. Không ghi vào `.claude` của máy shop.
- Máy thử Linux: không `pkill -f` / `pgrep -f` (tắt theo pid).

## Máy thử (sandbox) — tài khoản Claude nào cũng dựng lại được
```
python3 dev/test/tao-may-thu.py                  # tạo /home/claude/bug3 (Claude giả, Telegram giả, cloudflared giả)
cd /home/claude/bug3 && (nohup python3 tglfake.py > tglfake.out 2>&1 & echo $! > tglfake.pid)
cd /home/claude/bug3/tgl && (nohup python3 server.py > srv.out 2>&1 & echo $! > srv.pid)    # app thử: http://127.0.0.1:8790
cd /home/claude/bug3 && python3 tgltest.py && python3 tglnhom.py && python3 tglmig.py && python3 tglrieng.py && python3 chungtest.py
# mỗi script nên chạy trên app thử vừa khởi động lại: cd /home/claude/bug3 && bash reset.sh (tg_lenh_offset 0, chưa nối, tắt dùng chung)
node chungui.js ; node khotheme.js                # Playwright (Chromium có sẵn)
```
- `themeps.py` kho theme Photoshop (26) + `themepsui.js` giao diện (33); `tgltest.py` Remote chat riêng (49), `tglnhom.py` Remote trong nhóm (26), `tglmig.py` nhóm lên supergroup, `tglrieng.py` bài gửi riêng từng người (14), `chungtest.py` dùng chung
  (máy khác, quyền, bài / theme riêng từng máy, 83), `chungui.js` / `khotheme.js` giao diện, `mayxem.js` hộp xem 1 máy dùng chung, `quytacchung.js` quy tắc chỉ máy shop đổi (7), `modelkhach.py` máy khách mặc định Sonnet (4), `uimoi.js` máy khách có bản mới hiện nút Cập nhật (4), `trungmay.py` dò trùng / 1 bài mỗi ngày theo từng máy (6). `tglquyen.py` cho người trong nhóm quyền như fen (15). `anhnho.py` ảnh bìa / lưới slide thu nhỏ + nhớ lâu (14). Script ghi đường dẫn `/home/claude/bug3`;
  tạo chỗ khác thì `tao-may-thu.py <thư mục>` tự đổi. Repo nên clone ở `/home/claude/tiktok-post` (script app Mac / Windows trỏ vào đó).
- App Mac / Windows "dùng chung": `packaging/mac-chung/build.py`, `packaging/win-chung/build.sh` (mingw) → `dist/`; thử:
  `macgia/thu.py`, `macgia/thu2.py` (lệnh macOS giả), `winthu.py` (wine). Bộ cài app đầy đủ: `packaging/build.sh` (NSIS).

## Tính năng lớn gần đây (chi tiết trong PROJECT.md)
- Remote Telegram: chat riêng hoặc 1 nhóm (fen + nhân viên + bot, nhóm thật: "POLY Dựng Bài"); trong nhóm ai cũng ra lệnh, bật / tắt + quy tắc chỉ người nối;
  bài ai bấm Chạy gửi riêng người đó (mỗi người bấm Start bot 1 lần).
- Dùng chung: máy shop làm máy chủ (cổng khách 8778 + đường nối Cloudflare tạm), máy khác vào bằng mã 6 số 1 lần; mỗi máy chỉ thấy bài,
  nháp, theme, mẫu Canva của mình; máy shop (admin) thấy / quản lý hết; theme chung = theme fen bấm ☆ Vào kho chung.
- Kho theme Canva (Chỉnh chữ trên slide, Nhân bản, kho chung Drive), hạn mức dùng Claude theo bài + tuần, model theo việc.
- Kho theme Photoshop (`theme-ps/`, luật `theme-ps/luat-theme.md`): theme phẳng = `theme.json` + `_dong-co.jsx` → `theme.jsx` (`python3 theme-ps/tao.py`),
  bộ dựng ghép bằng `--theme`; ảnh xem trước dựng trên Photoshop máy shop: `ipad/build.py "E:/Tool/poly-dung-bai/theme-ps/<id>/xem" theme-ps/xem-mau.part.jsx <out> --theme ...`
  rồi chép .jsx vào `C:\Users\Dao\Pictures\PolySocial\_tu-chay\` (Photoshop tự chạy). Đổi `social-claude/_bo-dung-design/*/build.py` thì chép cả sang `E:\Social Claude\_bo-dung-design`.
