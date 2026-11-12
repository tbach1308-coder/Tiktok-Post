# Tạo máy thử (sandbox Linux) cho app Poly Dựng Bài, để session Claude khác (tài khoản khác) cũng thử được như máy shop.
#   python3 dev/test/tao-may-thu.py                 -> tạo ở /home/claude/bug3 (đường dẫn các script thử đang dùng)
#   python3 dev/test/tao-may-thu.py /tmp/maythu     -> tạo chỗ khác (script thử được chép sang và đổi đường dẫn)
# Sau đó:
#   cd <đích> && (nohup python3 tglfake.py > tglfake.out 2>&1 &)          # Telegram giả, cổng 8798
#   cd <đích>/tgl && (nohup python3 server.py > srv.out 2>&1 &)          # app thử, cổng 8790 (cổng khách dùng chung 8791)
#   cd <đích> && python3 tgltest.py ; python3 tglnhom.py ; python3 chungtest.py ; node chungui.js ...
# App thử dùng Claude giả (fake_claude.py), Telegram giả, cloudflared giả: không tốn lượt Claude, không ra mạng.
# Tắt app thử: kill theo pid (đừng dùng pkill -f / pgrep -f). Không đưa config.json thật / token thật vào đây.
import json
import os
import shutil
import sys

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEST = os.path.join(REPO, "dev", "test")
GOC = "/home/claude/bug3"


def main():
    dich = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else GOC
    app = os.path.join(dich, "tgl")
    os.makedirs(app, exist_ok=True)
    # mã app (bản trong repo)
    for f in ("server.py", "_index.src.html", "HUONG-DAN.txt", "PROJECT.md"):
        shutil.copy2(os.path.join(REPO, f), app)
    for d in ("ui", "prompts", "dev"):
        shutil.copytree(os.path.join(REPO, d), os.path.join(app, d), dirs_exist_ok=True,
                        ignore=shutil.ignore_patterns("test", "__pycache__"))
    shutil.copy2(os.path.join(TEST, "fake_claude.py"), app)
    # thư mục giả: kho bài, quy tắc, plugin, Chrome, Drive, tự chạy
    for d in ("ws/Laptop", "ws/iPad", "qt", "fakeplug/poly-carousel/.claude-plugin", "fakechrome/ud", "tuchay", "dist"):
        os.makedirs(os.path.join(app, d), exist_ok=True)
    os.makedirs(os.path.join(dich, "gdrive", "My Drive", "POLY Kho Theme"), exist_ok=True)
    os.makedirs(os.path.join(dich, "chung"), exist_ok=True)
    os.makedirs(os.path.join(dich, "shots"), exist_ok=True)
    viet = lambda p, s: open(p, "w", encoding="utf-8").write(s)
    viet(os.path.join(app, "qt", "a.md"), "# Quy tắc test\n## 12. Nhật ký\n### Logic rút ra\n")
    viet(os.path.join(app, "qt", "b.md"), "# Quy tắc test 2\n")
    viet(os.path.join(app, "fakeplug/poly-carousel/.claude-plugin/plugin.json"), '{"name":"poly-carousel","version":"1.1.0"}')
    viet(os.path.join(app, "fakechrome", "chrome.exe"), '#!/bin/sh\necho "$@" >> "%s"\n' % os.path.join(app, "fakechrome", "args.log"))
    os.chmod(os.path.join(app, "fakechrome", "chrome.exe"), 0o755)
    viet(os.path.join(app, "EMAIL"), "thu@poly.test\n")
    # cloudflared giả + app Mac / Windows để thử trang tải (nếu đã build: packaging/*/build)
    shutil.copy2(os.path.join(TEST, "fake-cf.py"), os.path.join(dich, "chung", "fake-cf.py"))
    os.chmod(os.path.join(dich, "chung", "fake-cf.py"), 0o755)
    for f in ("Poly-Dung-Bai-dung-chung-Mac.zip", "Poly-Dung-Bai-dung-chung.exe"):
        if os.path.isfile(os.path.join(REPO, "dist", f)):
            shutil.copy2(os.path.join(REPO, "dist", f), os.path.join(app, "dist"))
    cfg = {
        "port": 8790, "lenh_claude": ["python3", os.path.join(app, "fake_claude.py")],
        "thu_muc_lam_viec": app, "them_thu_muc": [os.path.join(app, "ws")],
        "thu_muc_bai": {"laptop": os.path.join(app, "ws", "Laptop"), "ipad": os.path.join(app, "ws", "iPad")},
        "telegram_api": "http://127.0.0.1:8798", "telegram_token": "123456:THU-GIA", "telegram_bot": "poly_dung_bai_bot",
        "telegram_chat": 123456, "telegram_ten": "Bách",
        "plugin_dir": os.path.join(app, "fakeplug", "poly-carousel"),
        "quy_tac": [os.path.join(app, "qt", "a.md"), os.path.join(app, "qt", "b.md")],
        "tu_chay": os.path.join(app, "tuchay"),
        "chrome_user_data": os.path.join(app, "fakechrome", "ud"), "chrome_path": os.path.join(app, "fakechrome", "chrome.exe"),
        "chrome_profile": "Default", "chrome_profile_kenh": {"laptop": "Profile 2"}, "tiktok_upload": "",
        "theo_doi_giay": 3, "tg_lenh": True, "tg_lenh_offset": 0,
        "canva_mau": {"ipad": "https://www.canva.com/design/DAHN2oXXTHw/edit", "laptop": ""},
        "kho_chung_dir": os.path.join(dich, "gdrive", "My Drive", "POLY Kho Theme"),
        "chung_cf": os.path.join(dich, "chung", "fake-cf.py"), "chung_bat": False, "chung_may": {},
    }
    if not os.path.isfile(os.path.join(app, "config.json")):
        json.dump(cfg, open(os.path.join(app, "config.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # script thử: chép ra gốc máy thử, đổi đường dẫn nếu không phải /home/claude/bug3
    for f in os.listdir(TEST):
        p = os.path.join(TEST, f)
        if os.path.isfile(p) and f.endswith((".py", ".js")) and f not in ("tao-may-thu.py", "fake_claude.py"):
            s = open(p, encoding="utf-8").read()
            if dich != GOC:
                s = s.replace(GOC, dich)
            open(os.path.join(dich, f), "w", encoding="utf-8").write(s)
    shutil.copytree(os.path.join(TEST, "macgia"), os.path.join(dich, "macgia"), dirs_exist_ok=True)
    for f in os.listdir(os.path.join(dich, "macgia", "bin")):
        os.chmod(os.path.join(dich, "macgia", "bin", f), 0o755)
    if dich != GOC:
        for f in ("thu.py", "thu2.py"):
            p = os.path.join(dich, "macgia", f)
            open(p, "w", encoding="utf-8").write(open(p, encoding="utf-8").read().replace(GOC, dich))
    print("Máy thử ở", dich, "· app thử:", app)


if __name__ == "__main__":
    main()
