# -*- coding: utf-8 -*-
"""
POLY DUNG BAI - app nhap brief, bam Chay, Claude Code (plugin poly-carousel) tu dung slide.

Chay: pythonw server.py  (hoac bam icon "Poly Dung Bai" ngoai Desktop)
Mo:   http://127.0.0.1:8777  (cong 8765 la cua tool dang bai, khong dung chung)

Chi dung thu vien co san cua Python 3.12, khong can cai them gi.
Moi bai = 1 thu muc trong jobs/<id>/ : job.json, brief, anh fen gui, stream-N.jsonl (log Claude).
Trang thai luon doc lai tu file log, nen tat app giua chung roi mo lai van xem tiep duoc.
"""
import base64
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import threading
import time
import traceback
import uuid
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, unquote, urlparse

APP = os.path.dirname(os.path.abspath(__file__))
JOBS = os.path.join(APP, "jobs")
UI = os.path.join(APP, "ui")
PROMPTS = os.path.join(APP, "prompts")
mimetypes.add_type("font/woff2", ".woff2")
IS_WIN = os.name == "nt"
IS_MAC = sys.platform == "darwin"   # MacBook của fen (30/10): chạy đủ như máy shop; mọi nhánh Windows giữ nguyên
CREATE_NO_WINDOW = 0x08000000
CREATE_NEW_PROCESS_GROUP = 0x00000200

DEFAULT_CFG = {
    "port": 8777,
    "thu_muc_lam_viec": "E:\\Social Claude",
    "them_thu_muc": [
        "C:\\Users\\Dao\\Pictures\\PolySocial",
        "C:\\Users\\Dao\\Pictures\\Screenshots",
        "C:\\Users\\Dao\\Downloads",
        "E:\\Tool\\Anh",
    ],
    "che_do_quyen": "acceptEdits",
    # lenh duoc chay khong hoi (ngoai danh sach trong E:\Social Claude\.claude\settings.json); khong co lenh xoa
    "cho_phep_them": [
        "Bash(python *)", "Bash(python3 *)", "Bash(py *)", "Bash(node *)", "Bash(curl *)", "Bash(ls *)",
        "Bash(mkdir *)", "Bash(cp *)", "Bash(mv *)", "Bash(cat *)", "Bash(head *)", "Bash(tail *)",
        "Bash(wc *)", "Bash(find *)", "Bash(grep *)", "Bash(cd *)", "Bash(echo *)", "Bash(sleep *)",
        "Bash(stat *)", "Bash(du *)", "Bash(file *)", "Bash(sort *)", "Bash(diff *)",
        "PowerShell(python *)", "PowerShell(py *)", "PowerShell(Get-ChildItem *)", "PowerShell(Copy-Item *)",
        "PowerShell(Move-Item *)", "PowerShell(New-Item *)", "PowerShell(Test-Path *)",
        "PowerShell(Get-Content *)", "PowerShell(Start-Sleep *)", "WebSearch", "WebFetch",
    ],
    "model": "",
    "lenh_claude": [],
    # tài khoản Claude nào đăng nhập cũng làm được: mỗi lượt chạy app tự nạp plugin dựng bài + luật chung,
    # không phụ thuộc plugin đã cài theo user Windows hay CLAUDE.md riêng của máy
    "plugin_dir": "E:\\Social Claude\\_bo-dung-design\\plugin\\poly-carousel",
    "quy_tac": [
        "E:\\Social Claude\\POLY-quy-tac-lam-content.md",
        "E:\\Social Claude\\_bo-dung-design\\BAT-DAU-TU-DAY-DESIGN.md",
        "E:\\Social Claude\\_bo-dung-design\\noi-dung\\quy-tac-xay-kenh.md",
        "E:\\Social Claude\\_bo-dung-design\\noi-dung\\tep-nguoi-xem.md",
        "E:\\Social Claude\\_bo-dung-design\\hashtag-tiktok.md",
    ],
    "tu_chay": "C:\\Users\\Dao\\Pictures\\PolySocial\\_tu-chay",
    "thu_muc_bai": {"laptop": "E:\\Social Claude\\Laptop", "ipad": "E:\\Social Claude\\iPad"},
    "kenh": {
        "laptop": {"ten": "Laptop", "handle": "@polystorelaptop"},
        "ipad": {"ten": "iPad", "handle": "@poly.store"},
    },
}

# ---------------------------------------------------------------- máy Mac: thư mục (fen 30/10 "set tự cài đặt trong máy khỏi hỏi")
# Mac không có ổ E / user Dao: ~/Social Claude = E:\Social Claude (Laptop/, iPad/, _bo-dung-design/ …),
# ~/Pictures/PolySocial/_tu-chay = hàng chờ Photoshop, thư mục chứa server.py = E:\Tool\poly-dung-bai.
# Lần đầu mở app thì ghi 2 thư mục gốc vào config.json (mac_chuan_bi); muốn đổi thì sửa config.json rồi mở lại app.
MAC_GOC = os.path.join(os.path.expanduser("~"), "Social Claude")
MAC_HANG_CHO = os.path.join(os.path.expanduser("~"), "Pictures", "PolySocial", "_tu-chay")
_WIN_DD = re.compile(r"^\s*(?:[A-Za-z]:[\\/]|\\\\)")


def la_duong_dan_win(p):
    """Đường dẫn của máy Windows (E:\\..., C:/..., \\\\máy\\...): trên Mac không dùng được."""
    return isinstance(p, str) and bool(_WIN_DD.match(p))


def _nfc(s):
    """Mac hay lưu tên file tiếng Việt dạng NFD: chuẩn hoá NFC trước khi so đường dẫn / tên thư mục."""
    import unicodedata
    return unicodedata.normalize("NFC", s) if isinstance(s, str) else s


def mac_bang(goc, hang_cho):
    """Bảng đổi đường dẫn máy shop -> máy này (dài trước ngắn sau). Luật, plugin, lệnh mẫu ghi đường dẫn máy shop."""
    return [
        ("C:/Users/Dao/Pictures/PolySocial/_tu-chay", hang_cho),
        ("E:/Tool/poly-dung-bai", APP),
        ("E:/Social Claude", goc),
        ("C:/Users/Dao", os.path.expanduser("~")),
    ]


_MAC_RE = {}


def mac_doi(text, bang):
    """Đổi gốc đường dẫn máy shop trong 1 đoạn chữ (lệnh giao Claude, luật chung, dòng THU_MUC_BAI=) sang đường dẫn máy này.
    Nhận cả \\ lẫn /, ổ đĩa hoa / thường; phần đường dẫn ngay sau gốc (tới dấu cách / ngoặc) đổi \\ thành /."""
    if not text:
        return text
    for win, mac in bang:
        r = _MAC_RE.get(win)
        if r is None:
            p = win.split("/")
            r = _MAC_RE[win] = re.compile(r"(?<![\w/\\])" + re.escape(p[0]) + r"[\\/]+" + r"[\\/]+".join(re.escape(x) for x in p[1:])
                                          + r"(?![\w-])((?:[\\/][^\s\"'`<>|*?\\/]*)*)", re.I)
        text = r.sub(lambda m: mac.rstrip("/") + m.group(1).replace("\\", "/"), text)
    return text


def mac_cfg(cfg):
    """Máy Mac: đổi các đường dẫn máy shop trong cấu hình (mặc định của app, hay config.json chép từ máy shop) sang thư mục
    trên Mac. Fen tự ghi đường dẫn Mac trong config.json thì giữ. Đường dẫn máy shop không có trên Mac (E:\\Tool\\Anh) thì bỏ."""
    goc = cfg.get("thu_muc_lam_viec")
    goc = os.path.expanduser(goc) if goc and not la_duong_dan_win(goc) else MAC_GOC
    q = cfg.get("tu_chay")
    q = os.path.expanduser(q) if q and not la_duong_dan_win(q) else MAC_HANG_CHO
    cfg["thu_muc_lam_viec"], cfg["tu_chay"] = goc, q
    bang = mac_bang(goc, q)

    def doi(v):
        if not isinstance(v, str) or not v:
            return v
        if not la_duong_dan_win(v):
            return os.path.expanduser(v)
        m = mac_doi(v, bang)
        return None if la_duong_dan_win(m) else m

    cfg["plugin_dir"] = doi(cfg.get("plugin_dir")) or ""
    cfg["quy_tac"] = [x for x in (doi(x) for x in cfg.get("quy_tac") or []) if x]
    cfg["thu_muc_bai"] = {k: doi(v) or "" for k, v in (cfg.get("thu_muc_bai") or {}).items()}
    tm = [x for x in (doi(x) for x in cfg.get("them_thu_muc") or []) if x]
    if not any((q + "/").startswith(x.rstrip("/") + "/") for x in tm):
        tm.append(q)
    cfg["them_thu_muc"] = tm
    for k in ("chrome_path", "chrome_user_data"):
        if la_duong_dan_win(cfg.get(k)):
            cfg.pop(k, None)
    if any(la_duong_dan_win(x) for x in cfg.get("lenh_claude") or []):
        cfg["lenh_claude"] = []
    return cfg


LOCK = threading.RLock()
STATE = {}  # job_id -> parsed state cache
WATCHERS = {}  # job_id -> thread


# ---------------------------------------------------------------- tien ich
def load_cfg():
    cfg = json.loads(json.dumps(DEFAULT_CFG))
    p = os.path.join(APP, "config.json")
    if os.path.exists(p):
        try:
            with open(p, "r", encoding="utf-8-sig") as f:
                user = json.load(f)
            for k, v in user.items():
                if isinstance(v, dict) and isinstance(cfg.get(k), dict):
                    cfg[k].update(v)
                else:
                    cfg[k] = v
        except Exception as e:  # config hong thi dung mac dinh
            log("config.json loi: %s" % e)
    if IS_MAC:
        cfg = mac_cfg(cfg)
    return cfg


CFG = load_cfg()


def log(s):
    try:
        with open(os.path.join(APP, "app-log.txt"), "a", encoding="utf-8") as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S ") + str(s) + "\n")
    except Exception:
        pass


def now():
    return time.time()


def read_json(p, default=None):
    for k in range(5):
        try:
            with open(p, "r", encoding="utf-8-sig") as f:  # -sig: file fen sửa bằng Notepad có BOM vẫn đọc được
                return json.load(f)
        except PermissionError:  # Windows: file đang bị ghi đè (os.replace) -> thử lại
            time.sleep(0.05)
        except Exception:
            return default
    return default


def write_json(p, data):
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    for k in range(20):  # Windows: luồng khác đang mở đọc file -> os.replace lỗi quyền, chờ chút thử lại
        try:
            os.replace(tmp, p)
            return
        except PermissionError:
            time.sleep(0.05)
    os.replace(tmp, p)


def job_dir(jid):
    if not re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", jid or ""):
        raise ValueError("id sai")
    return os.path.join(JOBS, jid)


def load_job(jid):
    return read_json(os.path.join(job_dir(jid), "job.json"))


def save_job(job):
    write_json(os.path.join(job_dir(job["id"]), "job.json"), job)


def proc_start(pid):
    """Gio (epoch) tien trinh pid duoc tao, None neu khong doc duoc."""
    try:
        if IS_WIN:
            import ctypes

            k = ctypes.windll.kernel32
            h = k.OpenProcess(0x1000, False, int(pid))
            if not h:
                return None

            class FT(ctypes.Structure):
                _fields_ = [("lo", ctypes.c_uint32), ("hi", ctypes.c_uint32)]

            c, e, kk, u = FT(), FT(), FT(), FT()
            ok = k.GetProcessTimes(h, ctypes.byref(c), ctypes.byref(e), ctypes.byref(kk), ctypes.byref(u))
            k.CloseHandle(h)
            if not ok:
                return None
            return ((c.hi << 32) | c.lo) / 1e7 - 11644473600
        if IS_MAC:   # Mac không có /proc
            return mac_proc_start(pid)
        with open("/proc/%d/stat" % int(pid)) as f:
            ticks = int(f.read().rsplit(")", 1)[1].split()[19])
        with open("/proc/stat") as f:
            btime = next(int(l.split()[1]) for l in f if l.startswith("btime"))
        return btime + ticks / os.sysconf("SC_CLK_TCK")
    except Exception:
        return None


def pid_alive(pid, started=None):
    """started = gio app bat luot chay. PID con song nhung tao luc khac (lech > 60 giay) = tien trinh khac
    (Windows cap lai PID sau khi tat may) -> coi nhu luot da ket thuc."""
    if not pid:
        return False
    if started:
        t = proc_start(pid)
        if t and abs(t - started) > 60:
            return False
    if IS_WIN:
        import ctypes

        k = ctypes.windll.kernel32
        h = k.OpenProcess(0x1000, False, int(pid))  # PROCESS_QUERY_LIMITED_INFORMATION
        if not h:
            return False
        code = ctypes.c_ulong()
        ok = k.GetExitCodeProcess(h, ctypes.byref(code))
        k.CloseHandle(h)
        return bool(ok) and code.value == 259  # STILL_ACTIVE
    try:
        os.kill(int(pid), 0)
    except OSError:
        return False
    try:  # zombie (linux, khi chay thu) coi nhu da xong
        with open("/proc/%d/stat" % int(pid)) as f:
            if f.read().split(")")[-1].split()[0] == "Z":
                return False
    except Exception:
        pass
    return True


def kill_tree(pid):
    if not pid:
        return
    if IS_WIN:
        subprocess.call(
            ["taskkill", "/PID", str(pid), "/T", "/F"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=CREATE_NO_WINDOW,
        )
    elif IS_MAC:
        mac_kill_cay(pid)
    else:
        try:
            os.killpg(int(pid), 15)
        except Exception:
            try:
                os.kill(int(pid), 15)
            except Exception:
                pass


# ---------------------------------------------------------------- máy Mac: tiến trình
def _ps(*a):
    try:
        return subprocess.run(["ps"] + list(a), capture_output=True, text=True, timeout=10).stdout
    except Exception:
        return ""


def mac_proc_start(pid):
    """Giờ tiến trình được tạo = bây giờ - thời gian đã chạy (ps etime: [[dd-]hh:]mm:ss). None nếu không còn."""
    s = _ps("-o", "etime=", "-p", str(int(pid))).strip()
    m = re.fullmatch(r"(?:(\d+)-)?(?:(\d+):)?(\d+):(\d+)", s)
    if not m:
        return None
    d, h, mi, se = (int(x or 0) for x in m.groups())
    return time.time() - (((d * 24 + h) * 60 + mi) * 60 + se)


def mac_kill_cay(pid):
    """Dừng Claude + mọi tiến trình con (như taskkill /T của Windows): lấy cả cây con trước (cha chết thì con bị
    chuyển sang launchd, mất dấu), dừng cả nhóm tiến trình, rồi từng con; 3 giây sau còn sống thì giết hẳn."""
    pid = int(pid)
    con = {}
    for ln in _ps("-A", "-o", "pid=,ppid=").splitlines():
        x = ln.split()
        if len(x) == 2 and x[0].isdigit() and x[1].isdigit():
            con.setdefault(int(x[1]), []).append(int(x[0]))
    cay, i = [pid], 0
    while i < len(cay):
        cay += [c for c in con.get(cay[i], []) if c not in cay]
        i += 1
    try:
        os.killpg(pid, 15)
    except Exception:
        pass
    for p in cay:
        try:
            os.kill(p, 15)
        except Exception:
            pass
    for _ in range(30):
        time.sleep(0.1)
        if not any(_con_song(p) for p in cay):
            return
    for p in cay:
        try:
            os.kill(p, 9)
        except Exception:
            pass


def _con_song(p):
    try:
        os.kill(p, 0)
        return True
    except OSError:
        return False


# ---------------------------------------------------------------- tim Claude Code
_CLAUDE = {"cmd": None, "version": None, "err": None, "t": 0}


def resolve_claude():
    """Tra ve lenh goi Claude Code (list). Khong di qua cmd.exe neu tranh duoc."""
    if CFG.get("lenh_claude"):
        return list(CFG["lenh_claude"])
    home = os.path.expanduser("~")
    cands = []
    if IS_WIN:
        cands += [
            os.path.join(home, ".local", "bin", "claude.exe"),
            os.path.join(os.environ.get("LOCALAPPDATA", ""), "Programs", "claude", "claude.exe"),
        ]
    elif IS_MAC:
        cands += mac_cho_claude(home)
    for c in cands:
        if c and os.path.isfile(c):
            return [c]
    exe = shutil.which("claude.exe") if IS_WIN else None
    if exe:
        return [exe]
    # npm global: doc package.json de lay file chay that (cli.js hoac .exe)
    roots = []
    if IS_WIN and os.environ.get("APPDATA"):
        roots.append(os.path.join(os.environ["APPDATA"], "npm", "node_modules"))
    try:
        npm_root = subprocess.run(
            ["npm.cmd" if IS_WIN else "npm", "root", "-g"],
            capture_output=True, text=True, timeout=20,
            creationflags=CREATE_NO_WINDOW if IS_WIN else 0,
        ).stdout.strip()
        if npm_root:
            roots.append(npm_root)
    except Exception:
        pass
    node = shutil.which("node")
    for r in roots:
        pkg = os.path.join(r, "@anthropic-ai", "claude-code")
        pj = read_json(os.path.join(pkg, "package.json"), {}) or {}
        b = pj.get("bin")
        if isinstance(b, dict):
            b = b.get("claude") or next(iter(b.values()), None)
        cand = [b] if b else []
        cand += ["cli.js", "bin/claude.exe", "bin/claude"]
        for rel in cand:
            fp = os.path.normpath(os.path.join(pkg, rel))
            if not os.path.isfile(fp):
                continue
            if fp.lower().endswith((".js", ".mjs", ".cjs")):
                if node:
                    return [node, fp]
            elif fp.lower().endswith(".exe") or not IS_WIN:
                return [fp]
    c = shutil.which("claude")
    if c:
        if IS_WIN and c.lower().endswith((".cmd", ".bat")):
            # chi truyen co dinh qua cmd.exe; brief di qua stdin nen khong lo ky tu dac biet
            return [os.environ.get("COMSPEC", "cmd.exe"), "/d", "/c", c]
        return [c]
    return None


def mac_cho_claude(home):
    """Chỗ Claude Code hay nằm trên Mac (bản cài chính thức, Homebrew, npm, nvm): app mở từ Finder có thể thiếu PATH."""
    import glob
    ds = [os.path.join(home, ".local", "bin", "claude"), os.path.join(home, ".claude", "local", "claude"),
          "/opt/homebrew/bin/claude", "/usr/local/bin/claude", os.path.join(home, ".npm-global", "bin", "claude")]
    ds += sorted(glob.glob(os.path.join(home, ".nvm", "versions", "node", "*", "bin", "claude")), reverse=True)
    return [x for x in ds if os.access(x, os.X_OK)]


# ---------------------------------------------------------------- model từng việc (fen 29/10 19h31 "trong app khi làm fen tự chuyển model cần thiết")
MODEL_OK = ("", "opus", "sonnet", "haiku")        # "" = model mặc định của tài khoản
MODEL_VIEC = {   # khoá config: (mặc định, các model cho chọn). Fen chốt 29/10 19h47: "chọn opus mặc định đi, chậm xíu mà kĩ"
    "model_dung": ("opus", ("", "opus", "sonnet")),       # dựng bài, sửa bài, chạy tiếp, trả lời câu hỏi
    "model_brief": ("opus", ("", "opus", "sonnet")),      # Viết brief
    "model_chat": ("opus", ("", "opus", "sonnet", "haiku")),     # Chat sửa brief
    "model_caption": ("opus", ("", "opus", "sonnet", "haiku")),  # Viết caption
    "model_duyet": ("opus", ("", "opus", "sonnet")),      # agent duyệt + thiết kế ("" = theo phiên chính)
    "model_quytac": ("opus", ("", "opus", "sonnet")),     # nút Quy tắc: ghi luật mới vào file quy tắc (30/10)
}
VIEC_AN = ("brief", "quy-tac")   # việc ẩn, không phải bài: Viết brief / Chat brief, Ghi quy tắc


def model_viec(k):
    mac, cho = MODEL_VIEC[k]
    if k in CFG:
        v = CFG.get(k)
    elif k == "model_dung" and CFG.get("model"):
        v = CFG.get("model")               # khoá cũ
    else:
        v = mac
    return v if v in cho else mac


def model_cai(data=None):
    """Kiểm máy > Model: model mặc định từng việc."""
    data = data or {}
    keys = {}
    for k, (mac, cho) in MODEL_VIEC.items():
        if k in data:
            v = (data.get(k) or "").strip().lower()
            if v not in cho:
                raise ValueError("Model không hợp lệ cho " + k)
            keys[k] = v
    if keys:
        save_cfg_keys(keys)
        CFG.update(keys)
    return {k: model_viec(k) for k in MODEL_VIEC}


AGENT_OPUS = 'luôn gọi với model "opus" (tham số model của Agent), kể cả khi phiên này chạy model khác.'


def cau_model_duyet(m):
    return ('luôn gọi với model "%s" (tham số model của Agent), kể cả khi phiên này chạy model khác.' % m) if m else \
        "gọi theo model của phiên này (không ghi tham số model của Agent)."


def env_claude():
    """Môi trường chạy Claude Code: luôn dùng tài khoản Claude đang đăng nhập (gói Pro / Max). Máy có biến ANTHROPIC_API_KEY /
    ANTHROPIC_AUTH_TOKEN thì Claude Code dùng key đó thay cho tài khoản (tính tiền API) -> app bỏ đi, trừ khi config "dung_api_key": true."""
    env = dict(os.environ)
    if CFG.get("dung_api_key") is not True:
        for k in ("ANTHROPIC_API_KEY", "ANTHROPIC_AUTH_TOKEN"):
            env.pop(k, None)
    return env


def claude_info(force=False):
    if not force and _CLAUDE["t"] and now() - _CLAUDE["t"] < (300 if _CLAUDE.get("login") else 20):
        return _CLAUDE
    cmd = resolve_claude()
    _CLAUDE.update(cmd=cmd, version=None, err=None, t=now())
    if not cmd:
        _CLAUDE["err"] = "Không tìm thấy Claude Code trên máy (lệnh claude)."
        return _CLAUDE
    try:
        out = subprocess.run(
            cmd + ["--version"], capture_output=True, timeout=60,
            creationflags=CREATE_NO_WINDOW if IS_WIN else 0,
        )
        v = (out.stdout or b"").decode("utf-8", "replace").strip() or (out.stderr or b"").decode("utf-8", "replace").strip()
        _CLAUDE["version"] = v.splitlines()[0] if v else "?"
    except Exception as e:
        _CLAUDE["err"] = "Gọi Claude Code lỗi: %s" % e
    _CLAUDE["login"] = None
    _CLAUDE["tk"] = {}
    try:
        out = subprocess.run(
            cmd + ["auth", "status"], capture_output=True, timeout=60, env=env_claude(),
            creationflags=CREATE_NO_WINDOW if IS_WIN else 0,
        )
        txt = (out.stdout or b"").decode("utf-8", "replace")
        m = re.search(r"\{.*\}", txt, re.S)
        if m:
            st = json.loads(m.group(0))
            _CLAUDE["login"] = bool(st.get("loggedIn"))
            # tài khoản đang đăng nhập (chỉ hiện trong app trên máy này)
            _CLAUDE["tk"] = {k: st.get(k2) for k, k2 in (("email", "email"), ("goi", "subscriptionType"), ("to_chuc", "orgName"), ("kieu", "authMethod"))
                             if st.get(k2)} if _CLAUDE["login"] else {}
        else:
            _CLAUDE["login"] = out.returncode == 0
    except Exception:
        pass
    return _CLAUDE


# ---------------------------------------------------------------- prompt
def read_prompt(name):
    with open(os.path.join(PROMPTS, name), "r", encoding="utf-8") as f:
        return f.read()


def fill(tpl, data):
    def rep(m):
        return str(data.get(m.group(1), ""))
    return re.sub(r"\{([a-z_]+)\}", rep, tpl)


def build_prompt_dung(job):
    k = CFG["kenh"].get(job["kenh"], {})
    anh = job.get("anh") or []
    data = {
        "kenh": job["kenh"],
        "kenh_ten": "%s (%s)" % (k.get("ten", job["kenh"]), k.get("handle", "")),
        # fen hay gõ ngày vào ô Tên bài: coi là ngày đăng, tên bài để Claude đặt theo brief
        "ten_bai": (job.get("ten_bai") if job.get("ten_bai") and not _LA_NGAY.match(job["ten_bai"]) else "") or "(tự đặt theo brief)",
        "ngay_dang": ten_hien(job)[1] or "(chưa có, ghi ngày làm bài)",
        "anh_list": "\n".join("- " + a for a in anh) if anh else "- (không có)",
        "brief": job.get("brief", "").strip(),
        "ghi_chu": job.get("ghi_chu") or "(không)",
        "thu_muc_kenh": CFG["thu_muc_bai"].get(job["kenh"], ""),
        "job_dir": job_dir(job["id"]),
    }
    return fill(read_prompt("dung-bai.txt"), data)


HOI_RE = re.compile(r"^[\s*_`-]*(?:\d+[.)]\s*)?[*_`]*HOI_FEN[*_`]*\s*:\s*(.+?)\s*$", re.M)


def tach_hoi(text):
    """Dòng HOI_FEN: câu hỏi | lựa chọn đang dùng | lựa chọn khác [| ...] -> [{q, opts}] (tối đa 3 câu, 4 lựa chọn)."""
    hoi = []
    for m in HOI_RE.finditer(text or ""):
        parts = [x.strip(" *_`") for x in m.group(1).split("|")]
        parts = [x for x in parts if x]
        if len(parts) >= 3 and len(hoi) < 3:
            hoi.append({"q": parts[0], "opts": parts[1:5]})
    return hoi, HOI_RE.sub("", text or "").strip()


def build_prompt_tra_loi(job, hoi, chon):
    dong = []
    for i, h in enumerate(hoi):
        c = chon.get(str(i))
        if c is None:
            continue
        o = h["opts"][int(c)] if str(c).isdigit() and int(c) < len(h["opts"]) else str(c)
        dong.append("- %s → %s%s" % (h["q"], o, " (giữ như đang làm)" if str(c) == "0" else ""))
    return fill(read_prompt("tra-loi.txt"), {"thu_muc_bai": job.get("thu_muc_bai") or "", "tra_loi": "\n".join(dong)})


def build_prompt_sua(job, text, slides, anh, resumed):
    data = {
        "kenh": job["kenh"],
        "yeu_cau": text.strip(),
        "slides": ", ".join("slide %s" % s for s in slides) if slides else "(fen không chọn, tự xác định)",
        "anh_list": "\n".join("- " + a for a in anh) if anh else "- (không có)",
        "thu_muc_bai": job.get("thu_muc_bai") or "(chưa biết, tìm theo tên bài)",
        "ten_bai": ten_hien(job)[0],
        "brief": job.get("brief", "").strip(),
    }
    tpl = read_prompt("sua-bai.txt" if resumed else "sua-bai-moi.txt")
    return fill(tpl, data)


# ---------------------------------------------------------------- doc log Claude
TOOL_VI = {
    "Read": "Đọc", "Write": "Ghi", "Edit": "Sửa", "MultiEdit": "Sửa", "NotebookEdit": "Sửa",
    "Glob": "Tìm file", "Grep": "Tìm trong file", "WebSearch": "Tìm trên mạng",
    "WebFetch": "Mở trang", "Skill": "Dùng skill", "ToolSearch": "Nạp công cụ",
}


def short(s, n=110):
    s = re.sub(r"\s+", " ", str(s or "")).strip()
    return s if len(s) <= n else s[: n - 1] + "…"


def base(p):
    return os.path.basename(str(p).replace("\\", "/").rstrip("/")) or str(p)


def humanize(name, inp):
    inp = inp or {}
    if name in ("Agent", "Task"):
        d = inp.get("description") or inp.get("subagent_type") or "agent"
        t = inp.get("subagent_type")
        return "agent", "Giao việc: %s" % (inp.get("description") or (t or "agent").split(":")[-1])
    if name == "Bash" or name.endswith("device_bash") or name == "PowerShell":
        return "tool", "Chạy lệnh: " + short(inp.get("description") or inp.get("command"), 90)
    if name in ("Read", "Write", "Edit", "MultiEdit", "NotebookEdit"):
        return "tool", "%s %s" % (TOOL_VI[name], base(inp.get("file_path") or inp.get("notebook_path") or ""))
    if name in ("Glob", "Grep"):
        return "tool", "%s: %s" % (TOOL_VI[name], short(inp.get("pattern"), 60))
    if name == "WebSearch":
        return "tool", "Tìm trên mạng: " + short(inp.get("query"), 80)
    if name == "WebFetch":
        u = urlparse(str(inp.get("url", "")))
        return "tool", "Mở trang: " + (u.netloc or short(inp.get("url"), 60))
    if name == "Skill":
        return "tool", "Dùng skill " + str(inp.get("skill") or inp.get("command") or "")
    if "claude-in-chrome" in name or "Claude_Browser" in name:
        act = inp.get("action") or name.split("__")[-1]
        extra = inp.get("url") or inp.get("text") or ""
        return "tool", "Trình duyệt: %s %s" % (act, short(extra, 60))
    if name.startswith("mcp__"):
        return "tool", "Công cụ: " + name.split("__")[-1]
    if name in ("TaskOutput", "TaskGet", "TaskList", "ToolSearch"):
        return None, None
    return "tool", TOOL_VI.get(name, name)


SUB_VI = {
    "error_max_turns": "Claude làm quá nhiều bước nên tự dừng. Bấm Chạy tiếp để làm nốt.",
    "error_during_execution": "Claude gặp lỗi giữa chừng. Bấm Chạy tiếp để làm nốt.",
    "error_max_budget_usd": "Hết hạn mức của lượt này. Bấm Chạy tiếp để làm nốt.",
}

# thư mục bài: E:\Social Claude\<Laptop|iPad>\T<tháng>_<Tên>_<dd-mm> (chấp nhận / hoặc \, có/không dấu cách quanh)
PATH_RE = re.compile(r"(?:[A-Za-z]:|/[A-Za-z])[\\/]+Social Claude[\\/]+(?:Laptop|iPad)[\\/]+T\d{1,2}_[^\\/\"'`\s<>|*?]+", re.I)
MARK_RE = re.compile(r"THU_MUC_BAI[*_`\s]*=[*_`'\"\s]*([^\r\n]+)")


def new_state():
    return {
        "events": [], "tasks": {}, "task_order": [], "pending_tasks": {},
        "session_id": None, "results": [], "folder": None, "offsets": {},
        "agents": {}, "model": None, "last_new": now(), "gen": "%x" % int(time.time() * 1000),
    }


def add_event(st, kind, text, run, sub=False, t=None):
    st["events"].append({"i": len(st["events"]), "k": kind, "x": text, "r": run, "s": bool(sub), "t": t or now()})
    st["last_new"] = now()


def note_folder(st, s):
    """Dòng THU_MUC_BAI=<đường dẫn> (Claude in ra khi tạo thư mục và ở câu cuối) là chắc nhất: có rồi thì giữ."""
    if not s:
        return
    if IS_MAC:
        return mac_note_folder(st, s)
    for m in MARK_RE.finditer(s):
        rest = m.group(1)
        k = PATH_RE.search(rest)  # đường dẫn thư mục bài chuẩn (E:\ hoặc /e/), bỏ chữ đứng sau
        if k:
            p = k.group(0).replace("/", "\\").rstrip(".,;:)\\")
            p = re.sub(r"^\\([A-Za-z])\\", lambda x: x.group(1).upper() + ":\\", p)
        else:  # máy thử (đường dẫn Linux): lấy tới dấu ngoặc / khoảng trắng + chữ
            p = re.split(r"[`*'\"]| \(| [-–] |\. ", rest.strip())[0].strip().rstrip(".,;:)\\/ ")
            if not re.match(r"([A-Za-z]:|/)", p):
                continue
        if p:
            st["folder"], st["folder_chac"] = p, True


def note_folder_tool(st, name, inp):
    """Chưa có THU_MUC_BAI= thì đoán từ lệnh TẠO / GHI vào thư mục bài (mkdir, Write, Edit),
    không lấy từ lệnh đọc (Read, Grep, Glob, ls) vì Claude hay đọc bài cũ làm mẫu."""
    if st.get("folder_chac"):
        return
    if name in ("Write", "Edit", "MultiEdit", "NotebookEdit"):
        src = inp.get("file_path") or ""
    elif name in ("Bash", "PowerShell"):
        # chỉ lấy đường dẫn nằm ngay trong lệnh tạo thư mục (cùng lệnh có thể cp từ bài cũ)
        segs = re.findall(r"(?:^|[;&|(]|\s)(?:mkdir|md|New-Item)\s([^;&|\n]*)", inp.get("command") or "", re.I)
        if not segs:
            return
        src = " ".join(segs)
    else:
        return
    if IS_MAC:
        m = mac_bai_re().search(_nfc(mac_doi(src, mac_bang_cfg())))
        if m:
            st["folder"] = m.group(0).rstrip(".,;:)/")
        return
    m = PATH_RE.search(src)
    if m:
        p = m.group(0).replace("/", "\\").rstrip(".,;:)\\")
        p = re.sub(r"^\\([A-Za-z])\\", lambda x: x.group(1).upper() + ":\\", p)   # /e/Social Claude -> E:\Social Claude
        st["folder"] = p


def mac_bang_cfg():
    return mac_bang(CFG.get("thu_muc_lam_viec") or MAC_GOC, CFG.get("tu_chay") or MAC_HANG_CHO)


def mac_bai_re():
    """Máy Mac: thư mục bài = <thư mục kênh trong config>/T<tháng>_<Tên>_<dd-mm> (đường dẫn POSIX, có dấu cách trong gốc)."""
    goc = sorted({_nfc(v).rstrip("/") for v in (CFG.get("thu_muc_bai") or {}).values() if v}, key=len, reverse=True)
    if not goc:
        return re.compile(r"(?!)")
    return re.compile("(?:%s)/+T\\d{1,2}_[^\\\\/\"'`\\s<>|*?]+" % "|".join(re.escape(x) for x in goc))


def mac_note_folder(st, s):
    """Như note_folder, đường dẫn Mac. Claude lỡ ghi đường dẫn máy shop (E:\\Social Claude\\iPad\\...) thì đổi sang Mac."""
    for m in MARK_RE.finditer(s):
        rest = _nfc(mac_doi(m.group(1), mac_bang_cfg()))
        k = mac_bai_re().search(rest)
        if k:
            p = k.group(0).rstrip(".,;:)/")
        else:   # thư mục ngoài thư mục kênh: lấy tới dấu ngoặc / khoảng trắng + chữ như máy thử
            p = re.split(r"[`*'\"]| \(| [-–] |\. ", rest.strip())[0].strip().rstrip(".,;:)\\/ ")
            if not p.startswith("/"):
                continue
        if p:
            st["folder"], st["folder_chac"] = p, True


def handle_line(st, obj, run):
    typ = obj.get("type")
    sub = bool(obj.get("parent_tool_use_id"))
    if typ in ("assistant", "user") and not sub:
        st.setdefault("sau_kq", {})[run] = True  # còn làm sau result -> result đó chưa phải câu cuối
    if typ == "system":
        if obj.get("subtype") == "init":
            st["session_id"] = obj.get("session_id") or st["session_id"]
            st["model"] = obj.get("model") or st["model"]
            if run not in st.setdefault("init_luot", set()):
                st["init_luot"].add(run)
                add_event(st, "info", "Claude bắt đầu làm", run)
        elif obj.get("subtype") in ("api_retry", "api_error"):
            add_event(st, "warn", "Mạng / API lỗi, Claude thử lại…", run)
        elif obj.get("subtype") == "compact_boundary":
            add_event(st, "info", "Claude gọn lại bộ nhớ hội thoại", run)
        return
    if typ == "assistant":
        msg = obj.get("message") or {}
        for b in msg.get("content") or []:
            bt = b.get("type")
            if bt == "text":
                txt = b.get("text") or ""
                if not sub:
                    note_folder(st, txt)
                show = re.sub(r"^[\s`*]*THU_MUC_BAI\s*=.*$", "", txt, flags=re.M).strip()
                if show and not sub:
                    add_event(st, "text", show, run)
            elif bt == "tool_use":
                name = b.get("name") or ""
                inp = b.get("input") or {}
                try:
                    note_folder_tool(st, name, inp)
                except Exception:
                    pass
                if name in ("TodoWrite", "TaskCreate") and not sub and st.get("task_run") != run:
                    # luot moi tu lap task list -> bo list cua luot truoc
                    st["tasks"], st["task_order"], st["task_run"] = {}, [], run
                if name == "TodoWrite" and not sub:
                    st["tasks"], st["task_order"] = {}, []
                    for i, td in enumerate(inp.get("todos") or []):
                        k = "td%d" % i
                        st["tasks"][k] = {"x": td.get("content") or td.get("activeForm") or "", "st": td.get("status", "pending")}
                        st["task_order"].append(k)
                    continue
                if name == "TaskCreate" and not sub:
                    st["pending_tasks"][b.get("id")] = inp.get("subject") or ""
                    continue
                if name == "TaskUpdate" and not sub:
                    tid = str(inp.get("taskId", ""))
                    t = st["tasks"].get(tid)
                    if t is None:
                        t = st["tasks"][tid] = {"x": inp.get("subject") or ("Việc " + tid), "st": "pending"}
                        if tid not in st["task_order"]:
                            st["task_order"].append(tid)
                    if inp.get("status"):
                        t["st"] = inp["status"]
                    if inp.get("subject"):
                        t["x"] = inp["subject"]
                    continue
                kind, text = humanize(name, inp)
                if kind:
                    if kind == "agent":
                        st["agents"][b.get("id")] = text
                    add_event(st, kind, text, run, sub)
        return
    if typ == "user":
        msg = obj.get("message") or {}
        content = msg.get("content")
        if not isinstance(content, list):
            return
        for b in content:
            if b.get("type") != "tool_result":
                continue
            tuid = b.get("tool_use_id")
            res = b.get("content")
            if isinstance(res, list):
                res = " ".join(x.get("text", "") for x in res if isinstance(x, dict))
            res = str(res or "")
            if tuid in st["pending_tasks"]:
                subj = st["pending_tasks"].pop(tuid)
                m = re.search(r"#(\d+)", res)
                tid = m.group(1) if m else "p%d" % len(st["tasks"])
                st["tasks"][tid] = {"x": subj, "st": "pending"}
                if tid not in st["task_order"]:
                    st["task_order"].append(tid)
            elif tuid in st["agents"] and not sub:
                add_event(st, "agentdone", "Xong: " + st["agents"][tuid].replace("Giao việc: ", ""), run)
            if b.get("is_error") and not sub:
                add_event(st, "info", "Công cụ báo lỗi, Claude tự xử lý: " + short(res, 140), run)
        return
    if typ == "result":
        r = {
            "run": run, "ok": not obj.get("is_error") and obj.get("subtype") == "success",
            "subtype": obj.get("subtype"), "text": obj.get("result") or "",
            "ms": obj.get("duration_ms"), "turns": obj.get("num_turns"),
            "session_id": obj.get("session_id"),
        }
        st["session_id"] = obj.get("session_id") or st["session_id"]
        note_folder(st, r["text"])
        den = obj.get("permission_denials") or []
        if den:
            names = []
            for x in den:
                nm = x.get("tool_name") or x.get("name") or "?"
                cmdx = (x.get("tool_input") or {}).get("command")
                names.append(nm + (": " + short(cmdx, 60) if cmdx else ""))
            add_event(st, "info", "Claude bị chặn %d lệnh (thường không ảnh hưởng bài): %s" % (len(den), "; ".join(names[:3])), run)
        st["results"].append(r)
        st.setdefault("sau_kq", {})[run] = False
        # 1 lượt có thể ra nhiều "result" (Claude chờ agent nền rồi chạy tiếp): dòng "Xong lượt này"
        # chỉ thêm khi tiến trình đã kết thúc (parse_job / _danh_dau_xong), không thêm ở đây
        if not r["ok"]:
            add_event(st, "error", SUB_VI.get(r["subtype"]) or ("Claude dừng vì lỗi: " + short(explain_err(r["text"] or r["subtype"] or ""), 200)), run)


def _luot_xong(st, run):
    """Lượt đã kết thúc có tính là XONG không: result cuối ok, sau result đó Claude không làm gì thêm
    (CLI có thể ra result giữa chừng khi chờ agent nền), mã thoát 0 nếu biết, fen không bấm Dừng."""
    n = run["n"]
    res = [r for r in st["results"] if r["run"] == n]
    if not res or not res[-1]["ok"] or st.setdefault("sau_kq", {}).get(n):
        return False
    if run.get("exit") not in (None, 0) or run.get("ket_qua") == "dung":
        return False
    return True


def _danh_dau_ket(st, run):
    """Dòng kết lượt (Xong / Fen đã dừng / dừng giữa chừng), mỗi lượt 1 lần, thêm lại được khi đọc lại từ đầu."""
    n = run["n"]
    dm = st.setdefault("ket_luot", set())
    if n in dm:
        return
    kq = run.get("ket_qua") or ("xong" if _luot_xong(st, run) else None)
    if kq == "xong":
        add_event(st, "done", "Xong lượt này", n)
    elif kq == "dung":
        add_event(st, "warn", "Fen đã dừng bài này", n)
    elif kq == "loi" and run.get("ly_do"):
        add_event(st, "error", run["ly_do"], n)
    else:
        return
    dm.add(n)


def _doc_luot(st, p, n):
    """Đọc tiếp phần mới của stream-n.jsonl (chỉ tới dòng hoàn chỉnh cuối)."""
    if not os.path.exists(p):
        return
    off = st["offsets"].get(n, 0)
    size = os.path.getsize(p)
    if size <= off:
        return
    with open(p, "rb") as f:
        f.seek(off)
        chunk = f.read()
    last_nl = chunk.rfind(b"\n")
    if last_nl < 0:
        return
    body = chunk[: last_nl + 1]
    st["offsets"][n] = off + len(body)
    for line in body.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line.decode("utf-8", "replace"))
        except Exception:
            continue
        try:
            handle_line(st, obj, n)
        except Exception:
            log("parse loi: " + traceback.format_exc())


def parse_job(jid):
    """Doc tiep phan log moi cua moi luot chay, cap nhat cache.
    Doc job.json TRONG LOCK: 2 luong cung luc (trang hoi + Dung) khong ghi de len nhau."""
    with LOCK:
        job = load_job(jid)
        if not job:
            return None, None
        st = STATE.get(jid)
        if st is None:
            st = STATE[jid] = new_state()
        for run in job.get("runs", []):
            n = run["n"]
            _doc_luot(st, os.path.join(job_dir(jid), "stream-%d.jsonl" % n), n)
            if run.get("ended"):
                _danh_dau_ket(st, run)
        changed = False
        if st["folder"] and job.get("thu_muc_bai") != st["folder"]:
            job["thu_muc_bai"] = st["folder"]
            changed = True
        if st["session_id"] and job.get("session_id") != st["session_id"]:
            job["session_id"] = st["session_id"]
            changed = True
        # luot chay cuoi da ket thuc?
        runs = job.get("runs", [])
        if runs and job.get("status") == "dang-chay":
            last = runs[-1]
            if not pid_alive(last.get("pid"), last.get("started")):
                time.sleep(0.2)
                parse_tail(jid, st, job)
                res = [r for r in st["results"] if r["run"] == last["n"]]
                last["ended"] = last.get("ended") or now()
                if job.get("stop_req"):
                    job["status"] = last["ket_qua"] = "dung"
                elif _luot_xong(st, last):
                    job["status"] = last["ket_qua"] = "xong"
                else:
                    job["status"] = last["ket_qua"] = "loi"
                    if not res or res[-1]["ok"]:
                        err = read_text(os.path.join(job_dir(jid), "stderr-%d.txt" % last["n"]))[-800:]
                        last["ly_do"] = "Claude dừng giữa chừng. " + short(explain_err(err), 300)
                _danh_dau_ket(st, last)
                job.pop("stop_req", None)
                changed = True
        if changed:
            save_job(job)
        return job, st


def parse_tail(jid, st, job):
    # doc not phan con lai (dong cuoi khong co \n)
    for run in job.get("runs", []):
        n = run["n"]
        p = os.path.join(job_dir(jid), "stream-%d.jsonl" % n)
        if not os.path.exists(p):
            continue
        off = st["offsets"].get(n, 0)
        with open(p, "rb") as f:
            f.seek(off)
            rest = f.read()
        st["offsets"][n] = off + len(rest)
        for line in rest.splitlines():
            try:
                handle_line(st, json.loads(line.decode("utf-8", "replace")), n)
            except Exception:
                pass


def read_text(p):
    try:
        with open(p, "rb") as f:
            return f.read().decode("utf-8", "replace")
    except Exception:
        return ""


def explain_err(err):
    e = err or ""
    low = e.lower()
    if "not logged in" in low or "/login" in low or "api key" in low or "authenticat" in low or "401" in low:
        return "Claude Code trên máy chưa đăng nhập. Bấm Đăng nhập, chọn tài khoản Claude của fen 1 lần là xong."
    if "rate limit" in low or "usage limit" in low or "limit reached" in low:
        return "Hết lượt dùng Claude tạm thời, chờ một lúc rồi bấm Chạy lại."
    if "not found" in low and "command" in low:
        return "Không tìm thấy lệnh plugin poly-carousel. Kiểm tra plugin đã cài: claude plugin list."
    return e.strip() or "Không có thông báo lỗi."


# ---------------------------------------------------------------- san sang
def plugin_dir():
    d = CFG.get("plugin_dir") or ""
    return d if d and os.path.isfile(os.path.join(d, ".claude-plugin", "plugin.json")) else ""


def san_sang():
    """Kiểm máy có đủ đồ để tài khoản Claude nào đăng nhập cũng dựng được bài (hiện ở ô Kiểm máy)."""
    ds = []
    pd = plugin_dir()
    pj = read_json(os.path.join(pd, ".claude-plugin", "plugin.json"), {}) if pd else {}
    ds.append({"ma": "plugin", "ten": "Plugin dựng bài poly-carousel", "ok": bool(pd), "can": True,
               "ghi": ("bản %s" % pj.get("version")) if pd and pj.get("version") else ("" if pd else "không thấy " + (CFG.get("plugin_dir") or "(chưa đặt)"))})
    lc = os.path.isfile(os.path.join(PROMPTS, "luat-chung.md"))
    ds.append({"ma": "luat", "ten": "Luật chung của shop", "ok": lc, "can": False, "ghi": "" if lc else "thiếu prompts\\luat-chung.md"})
    qt = list(CFG.get("quy_tac") or [])
    thieu = [os.path.basename(x) for x in qt if not os.path.isfile(x)]
    ds.append({"ma": "quytac", "ten": "File quy tắc, cách làm", "ok": not thieu, "can": False,
               "ghi": ("đủ %d file" % len(qt)) if not thieu else "thiếu " + ", ".join(thieu)})
    ch, hs = tim_chrome(), CFG.get("chrome_profile") or ""
    ten_hs = next((x["ten"] + (" · " + x["email"] if x["email"] else "") for x in chrome_ho_so() if x["dir"] == hs), hs)
    ds.append({"ma": "chrome", "ten": "Chrome đăng TikTok", "ok": bool(ch), "can": False,
               "ghi": ("hồ sơ " + ten_hs if hs else "hồ sơ Chrome mở gần nhất") if ch else "không thấy Chrome, bấm Đăng TikTok bên dưới để chọn"})
    hb = os.path.join(CFG.get("tu_chay") or "", "dang-chay.txt")
    try:
        tuoi = now() - os.path.getmtime(hb)
    except OSError:
        tuoi = None
    ds.append({"ma": "ps", "ten": "Photoshop tự chạy", "ok": tuoi is not None and tuoi < 90, "can": False,
               "ghi": "đang bật" if tuoi is not None and tuoi < 90 else "chưa mở Photoshop (mở lên là tự bật, bài chờ được)"})
    if IS_MAC:
        mac_san_sang(ds, tuoi)
    return ds


def doi_tai_khoan():
    """Mở cửa sổ đăng xuất tài khoản Claude cũ rồi đăng nhập tài khoản khác (fen tự chọn trong trình duyệt)."""
    with LOCK:   # cả việc ẩn (Viết brief) và Viết caption: đăng xuất giữa chừng là lượt đó hỏng
        for jid in (os.listdir(JOBS) if os.path.isdir(JOBS) else []):
            if (read_json(os.path.join(JOBS, jid, "job.json")) or {}).get("status") == "dang-chay":
                raise ValueError("Đang có bài chạy (dựng, viết brief hay caption), chờ xong rồi đổi tài khoản.")
    cmd = resolve_claude()
    if not cmd:
        raise ValueError("Không tìm thấy Claude Code")
    if IS_MAC:   # cửa sổ Terminal thay cửa sổ đen
        mac_mo_terminal("doi-tai-khoan", ['echo "Đăng xuất tài khoản Claude cũ..."', mac_lenh(cmd + ["auth", "logout"]), "echo",
                                          'echo "Đăng nhập tài khoản mới: trình duyệt tự mở, chọn tài khoản Claude cần dùng."',
                                          mac_lenh(cmd + ["auth", "login"]), "echo", 'echo "Xong. Đóng cửa sổ này, quay lại app Poly Dựng Bài."',
                                          'read -n 1 -s -r -p "Bấm phím bất kỳ để đóng..."'])
        _CLAUDE["t"] = 0
        return {"ok": True}
    c = cmd[-1] if len(cmd) > 1 and cmd[0].lower().endswith("cmd.exe") else None
    lenh = ('call "%s"' % c) if c else " ".join('"%s"' % x for x in cmd)
    bat = os.path.join(APP, "doi-tai-khoan.bat")
    with open(bat, "w", encoding="utf-8", newline="") as f:     # tự ghi \r\n, không để Windows đổi thành \r\r\n
        f.write("@echo off\r\nchcp 65001 >nul\r\n"
                "echo Dang xuat tai khoan Claude cu...\r\n%s auth logout\r\n"
                "echo.\r\necho Dang nhap tai khoan moi: trinh duyet tu mo, chon tai khoan Claude can dung.\r\n%s auth login\r\n"
                "echo.\r\necho Xong. Dong cua so nay, quay lai app Poly Dung Bai.\r\npause\r\n" % (lenh, lenh))
    if IS_WIN:
        comspec = os.environ.get("COMSPEC", "cmd.exe")
        subprocess.Popen([comspec, "/c", "start", "Doi tai khoan Claude", comspec, "/c", bat], creationflags=CREATE_NO_WINDOW)
    _CLAUDE["t"] = 0
    return {"ok": True}


# ---------------------------------------------------------------- chay Claude
def start_run(job, prompt, kind, resume=None, label=None, model=None, them_dir=None):
    cmd = resolve_claude()
    if not cmd:
        raise RuntimeError("Không tìm thấy Claude Code trên máy.")
    n = len(job.get("runs", [])) + 1
    d = job_dir(job["id"])
    if AGENT_OPUS in prompt:      # agent duyệt + thiết kế: theo lựa chọn của bài, không có thì theo Kiểm máy > Model
        md = job.get("model_duyet")
        prompt = prompt.replace(AGENT_OPUS, cau_model_duyet(md if md in MODEL_VIEC["model_duyet"][1] and md is not None else model_viec("model_duyet")))
    if IS_MAC:   # lệnh mẫu ghi đường dẫn máy shop (E:/Social Claude/...): đổi sang thư mục trên Mac
        prompt = mac_doi(prompt, mac_bang_cfg())
    with open(os.path.join(d, "prompt-%d.txt" % n), "w", encoding="utf-8") as f:
        f.write(prompt)
    args = cmd + ["-p", "--output-format", "stream-json", "--verbose"]
    mode = CFG.get("che_do_quyen") or ""
    if mode:
        args += ["--permission-mode", mode]
    if model is None:
        if kind == "caption":
            model = model_viec("model_caption")
        elif kind == "brief":
            model = job.get("model") if job.get("model") is not None else model_viec("model_brief")
        elif kind == "quy-tac":
            model = model_viec("model_quytac")
        else:
            model = job.get("model") or model_viec("model_dung")
    if model not in MODEL_OK:
        model = ""
    if model:
        args += ["--model", model]
    if CFG.get("cho_phep_them"):
        args += ["--allowedTools"] + list(CFG["cho_phep_them"])
    if resume:
        args += ["--resume", resume]
    pd = plugin_dir()
    if pd:
        args += ["--plugin-dir", pd]          # chung tên plugin đã cài thì bản này thay (cùng thư mục nguồn)
    lc = os.path.join(PROMPTS, "luat-chung.md")
    if os.path.isfile(lc):
        if IS_MAC:   # bản cho Mac: đường dẫn Mac + bảng đổi đường dẫn, lệnh macOS (ghi kèm lượt chạy)
            lc = mac_luat_chung(lc, os.path.join(d, "luat-chung-%d.md" % n))
        args += ["--append-system-prompt-file", lc]
    # --add-dir nhan nhieu thu muc sau 1 co; de cuoi cung (brief di qua stdin nen khong bi nuot)
    dirs = [x for x in (CFG.get("them_thu_muc") or []) + list(them_dir or []) if os.path.isdir(x)] + [d]
    args += ["--add-dir"] + dirs
    cwd = CFG.get("thu_muc_lam_viec")
    if not cwd or not os.path.isdir(cwd):
        cwd = APP
    out = open(os.path.join(d, "stream-%d.jsonl" % n), "ab")
    err = open(os.path.join(d, "stderr-%d.txt" % n), "ab")
    env = env_claude()
    env["POLY_APP"] = "1"
    # chay ngam (-p) Claude Code tat cong cu danh sach viec; bat lai de app hien tien do tung buoc
    env["CLAUDE_CODE_ENABLE_TODO_TOOLS"] = "1"
    # trước nằm trong E:\Social Claude\.claude\settings.json (cần tin thư mục); app tự đặt để tài khoản / user nào cũng như nhau
    env.setdefault("PYTHONUTF8", "1")
    env.setdefault("CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS", "8")
    if IS_MAC:
        mac_env(env)
    kw = {}
    if IS_WIN:
        kw["creationflags"] = CREATE_NO_WINDOW | CREATE_NEW_PROCESS_GROUP
    else:
        kw["start_new_session"] = True
    # prompt đã ghi ra prompt-N.txt: mở file đó làm stdin (không ghi vào pipe lúc đang giữ LOCK,
    # claude.exe chậm đọc thì app cũng không đứng)
    pin = open(os.path.join(d, "prompt-%d.txt" % n), "rb")
    try:
        p = subprocess.Popen(args, cwd=cwd, stdin=pin, stdout=out, stderr=err, env=env, **kw)
    finally:
        pin.close()
        out.close()
        err.close()
    job.setdefault("runs", []).append({"n": n, "kind": kind, "label": label or {"dung": "Dựng bài", "sua": "Sửa bài", "tiep": "Chạy tiếp"}.get(kind, kind), "pid": p.pid, "started": now(), "resume": resume, "model": model or "mặc định"})
    job["status"] = "dang-chay"
    save_job(job)
    log("chay %s %s luot %d pid %d" % (kind, job["id"], n, p.pid))
    threading.Thread(target=_reap, args=(p, job["id"]), daemon=True).start()
    return n


def _reap(p, jid):
    try:
        code = p.wait()
    except Exception:
        code = None
    time.sleep(0.5)
    try:
        with LOCK:
            job = load_job(jid)
            for r in (job or {}).get("runs", []):
                if r.get("pid") == p.pid and "exit" not in r:
                    r["exit"] = code
                    save_job(job)
    except Exception:
        log(traceback.format_exc())
    try:
        parse_job(jid)
    except Exception:
        log(traceback.format_exc())
    try:
        _chay_lich()     # bài vừa xong: bài xếp hàng kế tiếp chạy luôn, không chờ vòng 15 giây
    except Exception:
        log(traceback.format_exc())


def save_images(d, images, sub="anh-fen-gui"):
    saved = []
    if not images:
        return saved
    folder = os.path.join(d, sub)
    os.makedirs(folder, exist_ok=True)
    for i, im in enumerate(images):
        name = re.sub(r"[^\w.\-]+", "_", im.get("name") or "anh-%d.jpg" % (i + 1), flags=re.U)[:80]
        data = im.get("data") or ""
        if "," in data[:100]:
            data = data.split(",", 1)[1]
        raw = base64.b64decode(data)
        if len(raw) > 40 * 1024 * 1024:
            continue
        stem, ext = os.path.splitext(name)
        if not ext:
            ext = ".jpg"
        fp = os.path.join(folder, "%02d-%s%s" % (len(os.listdir(folder)) + 1, stem, ext))
        with open(fp, "wb") as f:
            f.write(raw)
        saved.append(fp)
    return saved


def _dem_hang():
    """(số bài đang dựng / sửa, số bài đang chờ lượt: hẹn đã tới giờ hoặc xếp hàng). Không tính việc ẩn (brief, quy tắc)."""
    dang = cho = 0
    for jid in (os.listdir(JOBS) if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j or j.get("loai") in VIEC_AN:
            continue
        if j.get("status") == "dang-chay":
            r = (j.get("runs") or [{}])[-1]
            if pid_alive(r.get("pid"), r.get("started")):
                dang += 1
        elif j.get("status") == "hen" and (j.get("hen_luc") or 0) <= now():
            cho += 1
    return dang, cho


def create_job(data):
    kenh = data.get("kenh") if data.get("kenh") in CFG["kenh"] else "laptop"
    brief = (data.get("brief") or "").strip()
    if len(brief) < 5:
        raise ValueError("Brief trống")
    if not resolve_claude():
        raise ValueError("Không tìm thấy Claude Code trên máy. Bấm Kiểm lại ở góc trên, hoặc cài lại Claude Code.")
    jid = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:4]
    d = job_dir(jid)
    os.makedirs(d, exist_ok=True)
    first = next((l.strip(" #*-\t") for l in brief.splitlines() if l.strip(" #*-\t")), "Bài mới")
    first = re.sub(r"^(slide\s*0?1|bìa|bia|thumbnail|thumb|tiêu đề|tieu de|title)\s*[:.\-–]\s*", "", first, flags=re.I) or first
    job = {
        "id": jid, "kenh": kenh, "brief": brief,
        "ten_bai": (data.get("ten_bai") or "").strip(),
        "tieu_de": (data.get("ten_bai") or "").strip() or short(first, 70),
        "ngay_dang": (data.get("ngay_dang") or "").strip(),
        "ghi_chu": (data.get("ghi_chu") or "").strip(),
        "created": now(), "status": "moi", "runs": [],
        # model fen chọn ở Bài mới ("" = theo Kiểm máy > Model); bản cũ "Chạy nhanh" = sonnet
        "model": (data.get("model") if data.get("model") in MODEL_VIEC["model_dung"][1] else ("sonnet" if data.get("nhanh") else "")),
    }
    if data.get("tu_tg"):      # fen bấm Chạy trên chat lệnh Telegram: xong / lỗi thì báo cả về chat đó
        job["tu_tg"] = True
    with open(os.path.join(d, "brief.txt"), "w", encoding="utf-8") as f:
        f.write(brief)
    job["anh"] = save_images(d, data.get("anh") or [])
    hen = data.get("hen_luc")
    if hen:   # "Hẹn làm": chưa chạy, luồng lich() tự bắt đầu khi tới giờ (làm dần từng bài)
        try:
            job["hen_luc"] = float(hen)
        except Exception:
            raise ValueError("Giờ hẹn không đúng")
        job["status"] = "hen"
        with LOCK:
            save_job(job)
        log("hen %s luc %s" % (jid, time.strftime("%d/%m %H:%M", time.localtime(job["hen_luc"]))))
        return job
    # fen 30/10 15h30 "bấm chạy liên tục thì tự xếp hàng chờ không bị chồng lên": đang có bài dựng (hoặc còn bài đang
    # chờ lượt) thì bài này xếp hàng (status hen, hen_luc = lúc bấm, xep_hang), luồng lich() chạy lần lượt, mỗi lúc tối đa hen_toi_da bài
    with LOCK:
        dang, cho = _dem_hang()
        if dang >= int(CFG.get("hen_toi_da") or 1) or cho:
            job["status"], job["hen_luc"], job["xep_hang"] = "hen", now(), True
            save_job(job)
            log("xep hang %s (dang chay %d, cho %d)" % (jid, dang, cho))
            job["thu"] = cho + 1
            return job
        save_job(job)
        try:
            start_run(job, build_prompt_dung(job), "dung")
        except Exception as e:
            job["status"], job["loi_chay"] = "loi", str(e)
            save_job(job)
            log("khong bat duoc Claude: %s" % e)
            raise ValueError(str(e))
    return job


NHAP_KHOA = ("id", "kenh", "ten", "ngay", "brief", "note", "chude", "briefJob", "briefT", "briefNote", "nhanh", "t",
             "chat", "chatJob", "chatT", "briefTruoc", "kb", "model", "briefCd", "briefCdGui", "briefMay")


def _sach_nhap(x):
    if not isinstance(x, dict):
        return None
    o = {k: x.get(k) for k in NHAP_KHOA if x.get(k) not in (None, "")}
    for k in ("ten", "ngay", "chude", "briefJob"):
        if k in o:
            o[k] = str(o[k])[:300]
    for k in ("brief", "note", "briefNote", "briefTruoc"):
        if k in o:
            o[k] = str(o[k])[:30000]
    if "chatJob" in o:
        o["chatJob"] = str(o["chatJob"])[:64]
    if "chat" in o:
        o["chat"] = [{"ai": bool(x.get("ai")), "text": str(x.get("text") or "")[:3000], "doi": bool(x.get("doi")), "t": x.get("t")}
                     for x in (o["chat"] if isinstance(o["chat"], list) else []) if isinstance(x, dict)][-30:]
    o["id"] = re.sub(r"[^\w-]", "", str(x.get("id") or ""))[:40] or uuid.uuid4().hex[:8]
    o["kenh"] = x.get("kenh") if x.get("kenh") in CFG["kenh"] else "laptop"
    if o.get("kb") not in CFG["kenh"]:
        o.pop("kb", None)
    return o


def _kenh_brief(x):
    """Kênh của việc Viết brief / Chat sửa brief đã ghi vào nháp (khớp theo giờ bắt đầu briefT / chatT, lệch < 2 phút).
    Nháp cũ (trước 29/10 18h) chưa có "kb": bấm đổi kênh là đổi luôn kênh của nháp, brief Laptop bị dính sang iPad."""
    if x.get("kb") or not (x.get("brief") or "").strip():
        return x.get("kb")
    moc = [t / 1000.0 for t in (x.get("chatT"), x.get("briefT")) if isinstance(t, (int, float)) and t > 0]
    if not moc:
        return None
    k = tuple(moc)
    if k in _KB:
        return _KB[k]
    kq = None
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:200] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if j and j.get("loai") == "brief" and any(abs((j.get("created") or 0) - m) < 120 for m in moc):
            kq = j.get("kenh") if j.get("kenh") in CFG["kenh"] else None
            break
    _KB[k] = kq
    return kq


_KB = {}


def _sua_kenh_nhap(ds):
    """Nháp mà brief viết cho kênh khác kênh đang chọn: trả về đúng kênh của brief (fen 29/10 18h16 "ipad bị dính bài laptop")."""
    doi = 0
    for x in ds:
        kb = _kenh_brief(x)
        if kb:
            x["kb"] = kb
            if x.get("kenh") != kb:
                x["kenh"] = kb
                x["t"] = int(now() * 1000)      # mới hơn bản trong trình duyệt -> trang tải lại lấy bản này
                doi += 1
    return doi


def nhap_doc():
    d = read_json(os.path.join(APP, "nhap.json"), {}) or {}
    ds = [x for x in (d.get("ds") or []) if isinstance(x, dict)]
    if _sua_kenh_nhap(ds):
        with LOCK:
            write_json(os.path.join(APP, "nhap.json"), {"ds": ds, "cur": d.get("cur") or "", "t": now()})
    return {"ds": ds, "cur": d.get("cur") or "", "co": bool(d)}


def nhap_luu(data):
    """Các nháp ở Bài mới (mỗi nháp 1 brief riêng). Trang gửi cả danh sách mỗi lần sửa (chờ 0,6 giây)."""
    ds = [y for y in (_sach_nhap(x) for x in (data.get("ds") or [])[:30]) if y]
    _sua_kenh_nhap(ds)
    with LOCK:
        write_json(os.path.join(APP, "nhap.json"), {"ds": ds, "cur": str(data.get("cur") or "")[:40], "t": now()})
    return {"ok": True, "n": len(ds)}


def nhap_bo(data):
    """Fen bỏ 1 nháp: không xoá, cất vào nhap-bo.json (100 cái gần nhất), xem lại ở Lịch sử brief."""
    x = _sach_nhap(data.get("nhap") or {})
    if not x or not ((x.get("brief") or "").strip() or (x.get("chude") or "").strip()):
        return {"ok": True}
    with LOCK:
        p = os.path.join(APP, "nhap-bo.json")
        ds = read_json(p, []) or []
        x["bo_luc"] = now()
        ds.append(x)
        write_json(p, ds[-100:])
    return {"ok": True}


def _chuan(t):
    return re.sub(r"\s+", " ", t or "").strip().lower()


def lich_su_brief():
    """Nút "Lịch sử brief": brief của mọi bài đã chạy, các lần bấm "Viết brief" (cả lần báo trùng) và nháp đã bỏ."""
    import difflib
    ds = []
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:400] if os.path.isdir(JOBS) else []):
        job = read_json(os.path.join(JOBS, jid, "job.json"))
        if not job or job.get("loai") == "quy-tac":
            continue
        if job.get("loai") == "brief":
            txt = read_text(os.path.join(JOBS, jid, "brief-viet.txt")).replace("\ufeff", "").strip()
            trung, goi_y = "", []
            if not txt and job.get("status") == "xong":
                try:
                    _, st = parse_job(jid)
                    fin = next((r["text"] for r in reversed(st["results"]) if r["ok"] and r["text"].strip()), "")
                except Exception:
                    fin = ""
                for l in fin.splitlines():
                    m = re.match(r"\s*TRUNG\s*:\s*(.+)", l, re.I)
                    if m and not trung:
                        trung = m.group(1).strip()
                    m = re.match(r"\s*GOI_Y\s*:\s*(.+)", l, re.I)
                    if m:
                        goi_y.append(m.group(1).strip())
            if not txt and not trung:      # đang viết / dừng / lỗi giữa chừng: không có gì để xem
                continue
            ds.append({"id": jid, "loai": "viet", "kenh": job.get("kenh"), "ten": job.get("chu_de") or job.get("tieu_de") or "",
                       "t": job.get("created"), "trang_thai": job.get("status"), "brief": txt, "trung": trung, "goi_y": goi_y[:3],
                       "chude": job.get("chu_de") or ""})
        else:
            b = (job.get("brief") or "").strip()
            if not b:                      # bài có sẵn (mở từ thư mục, không có brief)
                continue
            ten, ngay = ten_hien(job)
            ds.append({"id": jid, "loai": "bai", "kenh": job.get("kenh"), "ten": ten, "ngay": ngay, "t": job.get("created"),
                       "trang_thai": job.get("status"), "brief": b, "hen_luc": job.get("hen_luc")})
    for x in reversed(read_json(os.path.join(APP, "nhap-bo.json"), []) or []):
        if isinstance(x, dict) and ((x.get("brief") or "").strip() or (x.get("chude") or "").strip()):
            ds.append({"id": "nhap-%s-%d" % (x.get("id"), int(x.get("bo_luc") or 0)), "loai": "nhap", "kenh": x.get("kenh"),
                       "ten": x.get("ten") or x.get("chude") or "", "t": x.get("bo_luc") or x.get("t"), "trang_thai": "bo",
                       "brief": (x.get("brief") or "").strip(), "chude": x.get("chude") or ""})
    ds.sort(key=lambda x: -(x.get("t") or 0))
    # bản Claude viết đã đem đi dựng (fen có sửa ít nhiều): ghi tên bài đó
    bai = sorted([x for x in ds if x["loai"] == "bai"], key=lambda x: x["t"] or 0)
    for x in ds:
        if x["loai"] != "viet" or not x["brief"]:
            continue
        a = _chuan(x["brief"])[:600]
        for b in bai:
            if b["kenh"] == x["kenh"] and 0 <= (b["t"] or 0) - (x["t"] or 0) < 3 * 86400 and \
                    difflib.SequenceMatcher(None, a, _chuan(b["brief"])[:600]).ratio() >= 0.6:
                x["bai"], x["bai_ten"] = b["id"], b["ten"]
                break
    return {"ds": ds}


def viet_brief(data):
    """Nút "Viết brief" ở form Bài mới: 1 lượt Claude viết brief từng slide từ chủ đề fen gõ (dò trùng bài cũ).
    Tạo 1 việc ẩn (loai=brief, không hiện ở danh sách bài); xong thì app đổ brief vào ô Brief cho fen sửa."""
    kenh = data.get("kenh") if data.get("kenh") in CFG["kenh"] else "laptop"
    chu_de = (data.get("chu_de") or "").strip()
    if len(chu_de) < 3:
        raise ValueError("Gõ chủ đề bài trước (vd: iPad cho sinh viên y)")
    if not resolve_claude():
        raise ValueError("Không tìm thấy Claude Code trên máy. Bấm Kiểm lại ở góc trên.")
    jid = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:4]
    d = job_dir(jid)
    os.makedirs(d, exist_ok=True)
    k = CFG["kenh"].get(kenh, {})
    out = os.path.join(d, "brief-viet.txt")
    # 30/10 fen "nhận biết nội dung text gõ": cho Claude biết brief trong ô là của ai, viết cho chủ đề nào,
    # để chủ đề mới (vd "tìm chủ đề hot mẹo ipad") không bị kẹt lại bài cũ trong ô
    bcu = (data.get("brief") or "").strip()
    cd_cu = (data.get("chu_de_cu") or "").strip()
    if not bcu:
        nguon = "ô Brief trống"
    elif data.get("brief_cua") == "claude":
        nguon = 'Claude viết lần trước cho chủ đề "%s"%s' % (short(cd_cu, 120) or "?", ", fen có sửa thêm" if data.get("fen_sua") else ", fen chưa sửa")
    elif data.get("brief_cua") == "fen":
        nguon = "fen tự gõ / dán"
    else:
        nguon = "không rõ ai viết"
    prompt = fill(read_prompt("viet-brief.txt"), {
        "kenh_ten": "%s (%s)" % (k.get("ten", kenh), k.get("handle", "")),
        "chu_de": chu_de, "ngay": (data.get("ngay_dang") or "").strip() or "(chưa có)",
        "hom_nay": time.strftime("%d/%m/%Y"), "nguon_brief": nguon, "chu_de_cu": short(cd_cu, 120) or "(không có)",
        "ghi_chu": (data.get("ghi_chu") or "").strip() or "(không)",
        "brief_cu": bcu or "(trống)",
        "thu_muc_kenh": (CFG["thu_muc_bai"].get(kenh, "") or "").replace("\\", "/"),
        "out": out.replace("\\", "/"),
    })
    job = {"id": jid, "kenh": kenh, "loai": "brief", "brief": "", "ten_bai": "", "tieu_de": "Viết brief: " + short(chu_de, 60),
           "chu_de": chu_de, "ngay_dang": "", "ghi_chu": "", "created": now(), "status": "moi", "runs": []}
    with LOCK:
        save_job(job)
        try:
            start_run(job, prompt, "brief", None, "Viết brief")
        except Exception as e:
            job["status"], job["loi_chay"] = "loi", str(e)
            save_job(job)
            raise ValueError(str(e))
    return {"id": jid}


def chat_brief(data):
    """Ô chat dưới Brief (fen 29/10 17h23 "có thêm phần chat sửa idea"): 1 lượt Claude ngắn sửa brief theo tin fen gõ.
    Việc ẩn loai=brief (như Viết brief): sửa thì ghi brief-viet.txt, chỉ hỏi / góp ý thì không ghi, câu trả lời ở final."""
    kenh = data.get("kenh") if data.get("kenh") in CFG["kenh"] else "laptop"
    tin = (data.get("tin") or "").strip()
    if len(tin) < 2:
        raise ValueError("Gõ tin nhắn trước đã")
    if not resolve_claude():
        raise ValueError("Không tìm thấy Claude Code trên máy. Bấm Kiểm lại ở góc trên.")
    jid = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:4]
    d = job_dir(jid)
    os.makedirs(d, exist_ok=True)
    k = CFG["kenh"].get(kenh, {})
    ls = []
    for x in (data.get("lich_su") or [])[-8:]:
        if isinstance(x, dict) and (x.get("text") or "").strip():
            ls.append(("Claude: " if x.get("ai") else "Fen: ") + short(str(x.get("text")).replace("\n", " "), 300))
    out = os.path.join(d, "brief-viet.txt")
    prompt = fill(read_prompt("chat-brief.txt"), {
        "kenh_ten": "%s (%s)" % (k.get("ten", kenh), k.get("handle", "")),
        "chu_de": (data.get("chu_de") or "").strip() or "(chưa gõ)",
        "brief": (data.get("brief") or "").strip()[:20000] or "(trống)",
        "lich_su": "\n".join(ls) or "(chưa có)", "tin": tin[:2000],
        "out": out.replace("\\", "/"),
    })
    job = {"id": jid, "kenh": kenh, "loai": "brief", "chat": True, "brief": "", "ten_bai": "", "tieu_de": "Chat brief: " + short(tin, 60),
           "chu_de": (data.get("chu_de") or "").strip(), "ngay_dang": "", "ghi_chu": "", "created": now(), "status": "moi", "runs": [],
           "model": model_viec("model_chat")}       # chat cần nhanh: mặc định Sonnet (đổi ở Kiểm máy > Model)
    with LOCK:
        save_job(job)
        try:
            start_run(job, prompt, "brief", None, "Chat sửa brief")
        except Exception as e:
            job["status"], job["loi_chay"] = "loi", str(e)
            save_job(job)
            raise ValueError(str(e))
    return {"id": jid}


# ---------- nút "Quy tắc" (fen 30/10 11h04 "có chỗ nào trong app cho mình update các quy tắc mới"): ghi luật mới, không đụng bài
QT_PHAM_VI = {
    "chung": "Chung cả 2 kênh (Laptop @polystorelaptop và iPad @poly.store)",
    "laptop": "Chỉ kênh Laptop (@polystorelaptop): luật ghi [Laptop]",
    "ipad": "Chỉ kênh iPad (@poly.store): luật ghi [iPad]",
}


def ghi_quy_tac(data):
    text = (data.get("text") or "").strip()
    if len(text) < 3:
        raise ValueError("Gõ quy tắc muốn thêm trước đã")
    pv = data.get("pham_vi") if data.get("pham_vi") in QT_PHAM_VI else "chung"
    if not resolve_claude():
        raise ValueError("Không tìm thấy Claude Code trên máy. Bấm Kiểm lại ở góc trên.")
    jid = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:4]
    d = job_dir(jid)
    os.makedirs(d, exist_ok=True)
    anh = save_images(d, data.get("anh") or [], "anh-quy-tac")
    prompt = fill(read_prompt("ghi-quy-tac.txt"), {
        "pham_vi": QT_PHAM_VI[pv], "text": text[:4000],
        "anh": ", ".join('"%s"' % a.replace("\\", "/") for a in anh) or "(không có)",
        "ngay": time.strftime("%d/%m/%Y %H:%M"),
    })
    job = {"id": jid, "kenh": pv if pv in CFG["kenh"] else "laptop", "loai": "quy-tac", "pham_vi": pv, "brief": "", "ten_bai": "",
           "tieu_de": "Quy tắc: " + short(text, 60), "qt_text": text, "anh": anh, "ngay_dang": "", "ghi_chu": "",
           "created": now(), "status": "moi", "runs": []}
    with LOCK:
        save_job(job)
        try:
            start_run(job, prompt, "quy-tac", None, "Ghi quy tắc", them_dir=[PROMPTS])
        except Exception as e:
            job["status"], job["loi_chay"] = "loi", str(e)
            save_job(job)
            raise ValueError(str(e))
    return {"id": jid}


def _lich_su_quy_tac(n=8):
    """Dòng đầu bảng "Lịch sử sửa" của file quy tắc (mới nhất trên cùng) để fen xem luật vừa thêm."""
    f = (CFG.get("quy_tac") or [""])[0]
    out = []
    try:
        s = read_text(f).replace("\r\n", "\n")
    except Exception:
        return out
    i = s.find("### Lịch sử sửa")
    if i < 0:
        return out
    for ln in s[i:].split("\n")[1:]:
        ln = ln.strip()
        if not ln.startswith("|"):
            if out:
                break
            continue
        o = [c.strip() for c in ln.strip("|").split("|")]
        if len(o) < 4 or set(o[0]) <= set("-: ") or o[0].lower() == "ngày":
            continue
        out.append({"ngay": o[0], "bai": o[1], "sua": " | ".join(o[2:-1]), "luat": o[-1]})
        if len(out) >= n:
            break
    return out


def quy_tac_ds():
    viec = []
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:150] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j or j.get("loai") != "quy-tac":
            continue
        st = None
        if j.get("status") == "dang-chay":
            try:
                j, st = parse_job(jid)
            except Exception:
                pass
        final, loi = "", j.get("loi_chay") or ""
        if j.get("status") in ("xong", "loi", "dung"):
            if st is None:
                try:
                    _, st = parse_job(jid)
                except Exception:
                    st = None
            for r in reversed((st or {}).get("results") or []):
                if r.get("ok") and (r.get("text") or "").strip():
                    final = r["text"].strip()
                    break
            run = (j.get("runs") or [{}])[-1]
            if j.get("status") == "loi" and not loi:
                loi = run.get("ly_do") or "Claude dừng giữa chừng"
        viec.append({"id": jid, "t": j.get("created"), "pham_vi": j.get("pham_vi") or "chung", "text": j.get("qt_text") or "",
                     "n_anh": len(j.get("anh") or []), "status": j.get("status"), "final": final[:1500], "loi": loi[:400]})
        if len(viec) >= 10:
            break
    return {"viec": viec, "lich_su": _lich_su_quy_tac(), "file": ((CFG.get("quy_tac") or [""])[0]).replace("\\", "/"), "now": now()}


def fix_job(jid, data):
    with LOCK:
        return _fix_job(jid, data)


def _fix_job(jid, data):
    job, st = parse_job(jid)
    if not job:
        raise ValueError("Không thấy bài")
    if job.get("status") == "dang-chay":
        raise ValueError("Bài đang chạy, chờ xong hoặc bấm Dừng trước")
    text = (data.get("text") or "").strip()
    if not text:
        raise ValueError("Chưa ghi cần sửa gì")
    slides = [int(s) for s in data.get("slides") or [] if str(s).isdigit()]
    anh = save_images(job_dir(jid), data.get("anh") or [], "anh-sua-%d" % (len(job.get("runs", [])) + 1))
    sid = job.get("session_id")
    resumed = bool(sid) and data.get("moi") is not True
    if "model" in data and (data.get("model") or "") in MODEL_VIEC["model_dung"][1]:
        job["model"] = data.get("model") or ""          # fen đổi model ở ô Sửa bài: giữ cho các lượt sau của bài
    job.setdefault("sua", []).append({"t": now(), "text": text, "slides": slides, "anh": anh})
    lab = "Sửa" + (" slide " + ", ".join(str(x) for x in slides) if slides else "") + ": " + short(text, 50)
    start_run(job, build_prompt_sua(job, text, slides, anh, resumed), "sua", sid if resumed else None, lab)
    return job


def tra_loi_job(jid, data):
    """Fen bấm chọn ở ô "Claude hỏi fen". Toàn chọn "đang dùng" thì chỉ ghi nhận; có đổi thì chạy tiếp phiên cũ để sửa."""
    with LOCK:
        v = job_view(jid)
        if not v:
            raise ValueError("Không thấy bài")
        job, hoi = load_job(jid), v.get("hoi") or []
        if job.get("status") == "dang-chay":
            raise ValueError("Bài đang chạy, chờ xong rồi trả lời")
        if not hoi:
            raise ValueError("Không còn câu hỏi nào")
        chon = {str(k): str(x) for k, x in (data.get("chon") or {}).items()}
        job.setdefault("da_tra_loi", {})[str(v.get("hoi_luot"))] = chon
        doi = any(c != "0" for c in chon.values())
        if not doi:
            save_job(job)
            return {"ok": True, "chay": False}
        sid = job.get("session_id")
        job.setdefault("sua", []).append({"t": now(), "text": "Trả lời Claude: " + "; ".join(
            "%s → %s" % (h["q"], h["opts"][int(chon[str(i)])] if chon.get(str(i), "0").isdigit() and int(chon[str(i)]) < len(h["opts"]) else chon.get(str(i)))
            for i, h in enumerate(hoi) if chon.get(str(i), "0") != "0"), "slides": [], "anh": []})
        start_run(job, build_prompt_tra_loi(job, hoi, chon), "sua", sid, "Fen trả lời câu hỏi")
        return {"ok": True, "chay": True}


def stop_job(jid):
    with LOCK:
        job = load_job(jid)
        if not job or job.get("status") != "dang-chay":
            return job
        job["stop_req"] = True
        save_job(job)
        last = job["runs"][-1]
    if pid_alive(last.get("pid"), last.get("started")):
        kill_tree(last.get("pid"))
    time.sleep(0.8)
    parse_job(jid)
    return load_job(jid)


def list_slides(folder):
    if not folder or not os.path.isdir(folder):
        return []
    out = []
    for fn in os.listdir(folder):
        m = re.fullmatch(r"slide-?0*(\d+)\.png", fn, re.I)
        if m:
            fp = os.path.join(folder, fn)
            out.append({"n": int(m.group(1)), "name": fn, "path": fp, "mt": os.path.getmtime(fp)})
    out.sort(key=lambda x: x["n"])
    return out


# ---------------------------------------------------------------- đăng bài: caption, Telegram (Laptop), TikTok web (iPad)
# Fen chốt 28/10: kênh iPad đăng từ TikTok web (extension Poly TikTok điền sẵn, fen tự bấm Đăng);
# kênh Laptop chỉ làm ảnh, gửi slide + caption qua Telegram về điện thoại fen để đăng bằng app.
def caption_file(job):
    f = job.get("thu_muc_bai")
    return os.path.join(f, "caption.txt") if f else None


def _norm_cap(t):
    """Giữ đúng cấu trúc dòng (dòng 1 caption, dòng 2 ghim): bỏ BOM, đổi CRLF -> LF, chỉ bỏ khoảng trắng cuối file."""
    return (t or "").replace("\ufeff", "").replace("\r\n", "\n").replace("\r", "\n").rstrip()


# ---------- Your brand (Tiết lộ nội dung → Thương hiệu của bạn) theo từng bài. Fen chốt 30/10 12h54: mặc định TẮT như cài đặt
# gốc của TikTok cho mọi bài; bài nào cần thì fen bấm Bật ở ô Đăng bài -> job["brand_fen"]. Claude không tự xét.
def brand_bai(job):
    if job.get("brand_fen") in (True, False):
        return {"bat": job["brand_fen"], "nguon": "fen"}
    return {"bat": False, "nguon": "mac-dinh"}


def doi_brand(jid, data):
    v = data.get("bat")
    if v not in (True, False, None):
        raise ValueError("Giá trị không đúng")
    with LOCK:
        job = load_job(jid)
        if not job:
            raise ValueError("Không thấy bài")
        if v is None:
            job.pop("brand_fen", None)
        else:
            job["brand_fen"] = v
        save_job(job)
    return {"ok": True, "brand": brand_bai(job)}


def read_caption(job):
    p = caption_file(job)
    return _norm_cap(read_text(p)) if p and os.path.isfile(p) else ""


def tach_caption(text):
    """-> (caption dòng 1, câu ghim không kèm chữ 'Comment ghim:')."""
    ls = _norm_cap(text).split("\n")
    cap = ls[0].strip()
    ghim = "\n".join(x.strip() for x in ls[1:] if x.strip())
    ghim = re.sub(r"^(?:comment\s*ghim|ghim|cmt\s*ghim)\s*[:：-]\s*", "", ghim, flags=re.I).strip()
    return cap, ghim


def save_caption(jid, data):
    job = load_job(jid)
    if not job:
        raise ValueError("Không thấy bài")
    p = caption_file(job)
    if not p or not os.path.isdir(os.path.dirname(p)):
        raise ValueError("Bài chưa có thư mục, chưa lưu caption được")
    t = _norm_cap(data.get("text"))
    if t == read_caption(job):
        return {"ok": True, "doi": False}
    with open(p, "w", encoding="utf-8", newline="\n") as f:  # newline: Windows không đổi thành CRLF
        f.write(t + "\n")
    return {"ok": True, "doi": True}


def save_cfg_keys(keys):
    """Ghi vài khoá vào config.json của máy (giữ nguyên các khoá fen đã có)."""
    p = os.path.join(APP, "config.json")
    with LOCK:
        user = {}
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8-sig") as f:
                    user = json.load(f)
            except Exception as e:  # file fen tự sửa bị lỗi cú pháp: KHÔNG ghi đè (mất cấu hình fen thêm)
                log("config.json lỗi khi lưu %s: %s" % (list(keys), e))
                raise ValueError("File config.json của app đang sai cú pháp (thường do thừa/thiếu dấu phẩy) nên chưa lưu được. Fen mở file sửa lại hoặc gửi Claude xem.")
            if not isinstance(user, dict):
                raise ValueError("File config.json của app đang sai dạng nên chưa lưu được. Fen gửi Claude xem.")
        user.update(keys)
        write_json(p, user)
        CFG.update(keys)


def _multipart(fields, files):
    b = "----poly" + uuid.uuid4().hex
    out = []
    for k, v in fields.items():
        out += [("--" + b).encode(), ('Content-Disposition: form-data; name="%s"' % k).encode(), b"", str(v).encode("utf-8")]
    for k, (fn, data) in files.items():
        out += [("--" + b).encode(), ('Content-Disposition: form-data; name="%s"; filename="%s"' % (k, fn)).encode(),
                b"Content-Type: application/octet-stream", b"", data]
    out += [("--" + b + "--").encode(), b""]
    return b"\r\n".join(out), "multipart/form-data; boundary=" + b


def tg_call(method, fields=None, files=None, timeout=120):
    import urllib.request
    token = CFG.get("telegram_token")
    if not token:
        raise ValueError("Chưa cài Telegram")
    url = (CFG.get("telegram_api") or "https://api.telegram.org").rstrip("/") + "/bot%s/%s" % (token, method)
    gui = {k: v for k, v in (fields or {}).items() if not k.startswith("_")}
    if files:   # có file: multipart
        body, ctype = _multipart(gui, files)
    else:       # chỉ chữ: form thường (multipart rỗng bị máy chủ Telegram trả 400)
        from urllib.parse import urlencode
        body, ctype = urlencode({k: str(v) for k, v in gui.items()}).encode("utf-8"), "application/x-www-form-urlencoded"
    req = urllib.request.Request(url, data=body, headers={"Content-Type": ctype, "User-Agent": "PolyDungBai/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            res = json.loads(r.read().decode("utf-8"))
    except Exception as e:
        raw = b""
        try:
            raw = e.read() if hasattr(e, "read") else b""
        except Exception:
            pass
        try:
            res = json.loads(raw.decode("utf-8")) if raw else None
        except Exception:
            res = None
        if not res:
            code = getattr(e, "code", None)
            log("telegram %s: %s | %s" % (method, e, raw[:300].decode("utf-8", "replace").replace("\n", " ")))
            if code:   # có trả lời từ máy chủ nhưng không phải dạng Telegram
                raise ValueError("Telegram trả lỗi %s khi %s (chi tiết trong app-log.txt). Chụp màn hình gửi Claude." % (code, method))
            raise ValueError("Không gửi được Telegram, fen kiểm mạng rồi bấm lại.")
    if not res.get("ok"):
        # nhóm thường được Telegram nâng lên siêu nhóm (vd cho bot làm admin) -> đổi mã chat mới, gửi lại 1 lần
        moi = (res.get("parameters") or {}).get("migrate_to_chat_id")
        if moi and fields and str(fields.get("chat_id")) == str(CFG.get("telegram_chat")) and not fields.get("_lai"):
            log("telegram: nhóm đổi mã %s -> %s" % (CFG.get("telegram_chat"), moi))
            save_cfg_keys({"telegram_chat": moi})
            return tg_call(method, dict(fields, chat_id=moi, _lai=1), files, timeout)
        raise ValueError(tg_loi(res.get("description") or "?", method))
    return res.get("result")


def tg_loi(desc, method=""):
    """Lỗi Telegram -> câu tiếng Việt. Lỗi do cài đặt (token, chat) thì mở lại hộp Cài Telegram (CAI_TELEGRAM|...)."""
    log("telegram %s báo: %s" % (method, desc))
    d = desc.lower()
    if "unauthorized" in d:
        return "CAI_TELEGRAM|Telegram không nhận token của bot (bot bị xoá hoặc đã đổi token). Fen dán lại token mới."
    if "chat not found" in d or "user not found" in d:
        return "CAI_TELEGRAM|Bot chưa nối với Telegram của fen. Nhắn 1 tin cho bot rồi bấm Kiểm."
    if "blocked" in d or "deactivated" in d:
        return "CAI_TELEGRAM|Fen đang chặn bot trên Telegram. Mở bot, bấm Bỏ chặn (Restart) rồi gửi lại."
    if "too large" in d or "too big" in d:
        return "Slide quá nặng cho Telegram (tối đa 50MB 1 file)."
    if "too many requests" in d or "retry after" in d:
        return "Telegram đang giới hạn, chờ 1 phút rồi bấm lại."
    return "Telegram báo lỗi: %s" % short(desc, 160)


def tg_cai(data):
    """Bước 1: lưu token bot (fen dán, chỉ lưu trên máy này). Bước 2 (kiem): tìm chat của fen sau khi fen nhắn bot 1 tin."""
    if data.get("token"):
        tok = data["token"].strip()
        if not re.fullmatch(r"\d{5,}:[\w-]{20,}", tok):
            raise ValueError("Token không đúng dạng (vd 123456789:ABC...)")
        old = CFG.get("telegram_token")
        CFG["telegram_token"] = tok
        try:
            me = tg_call("getMe", timeout=20)
        except ValueError as e:
            CFG["telegram_token"] = old
            if str(e).startswith("CAI_TELEGRAM|"):
                raise ValueError("Telegram không nhận token này. Fen copy lại đúng dòng token BotFather gửi (dạng 123456789:ABC...).")
            raise
        except Exception:
            CFG["telegram_token"] = old
            raise
        try:
            # bot mới: chat lệnh Remote ghép với bot cũ không dùng được nữa, ghép lại
            save_cfg_keys({"telegram_token": tok, "telegram_bot": me.get("username"), "telegram_chat": None, "telegram_ten": None,
                           "tg_lenh_chat": None, "tg_lenh_nguoi": None, "tg_lenh_ten": None, "tg_lenh_offset": 0, "tg_lenh_bang": None})
        except Exception:
            CFG["telegram_token"] = old  # chưa ghi được file thì giữ cài đặt cũ, không dở dang
            raise
        return {"ok": True, "bot": me.get("username")}
    if data.get("kiem"):
        TGL["tam_dung"] = now() + 25     # luồng Remote tạm ngừng đọc tin (2 nơi cùng đọc getUpdates thì Telegram báo lỗi)
        time.sleep(0.3 if not (TGL["luong"] and TGL["luong"].is_alive()) else 1.5)
        try:
            ups = tg_call("getUpdates", timeout=20) or []
        finally:
            TGL["tam_dung"] = now() + 2
        try:
            log("telegram getUpdates: %d tin %s" % (len(ups), [(k, (u[k].get("chat") or {}).get("type")) for u in ups[-8:] for k in u if k != "update_id" and isinstance(u[k], dict)]))
        except Exception:
            pass
        for u in reversed(ups):
            # tin nhắn riêng, lệnh /start trong nhóm, hoặc tin "bot được thêm vào nhóm"
            m = u.get("message") or u.get("edited_message") or u.get("my_chat_member") or {}
            c = m.get("chat") or {}
            if c.get("id"):
                nhom = c.get("type") in ("group", "supergroup")
                ten = c.get("title") if nhom else (c.get("first_name") or c.get("username") or "")
                ten = ten or ""
                save_cfg_keys({"telegram_chat": c["id"], "telegram_ten": ten})
                tg_call("sendMessage", {"chat_id": c["id"], "text": "Đã nối Poly Dựng Bài với %s. Bài Laptop xong bấm Gửi Telegram là slide + caption về đây." % (("nhóm " + ten) if nhom else ("Telegram của " + ten))}, timeout=20)
                return {"ok": True, "ten": ten}
        if not ups:
            try:  # bot đang có webhook (vd từng gắn với dịch vụ khác) thì getUpdates không nhận tin
                wh = tg_call("getWebhookInfo", timeout=20) or {}
                log("telegram webhook: %s, chờ %s" % (bool(wh.get("url")), wh.get("pending_update_count")))
            except Exception as e:
                log("telegram getWebhookInfo lỗi: %s" % e)
        b = CFG.get("telegram_bot") or "tên_bot"
        raise ValueError("Bot chưa nhận được tin nào. Gửi vào nhóm: gõ /start@%s trong nhóm. Gửi riêng: nhắn 1 tin cho @%s. Rồi bấm Kiểm lại." % (b, b))
    if "bao" in data:
        save_cfg_keys({"telegram_bao": bool(data.get("bao"))})
    return {"bot": CFG.get("telegram_bot"), "ten": CFG.get("telegram_ten"), "xong": bool(CFG.get("telegram_token") and CFG.get("telegram_chat")),
            "bao": CFG.get("telegram_bao") is not False}


GUI_DANG = set()  # bài đang gửi Telegram / mở TikTok: chặn bấm 2 lần ra 2 bộ ảnh


def chia_nhom(n, toi_da=10):
    """Chia n slide thành các nhóm đều nhau, mỗi nhóm <= 10 (Telegram: 1 nhóm ảnh 2–10 file). 11 -> [6, 5]."""
    if n <= 0:
        return []
    k = -(-n // toi_da)
    a, b = divmod(n, k)
    return [a + 1] * b + [a] * (k - b)


def _ghi_da_gui(jid, muc):
    with LOCK:
        j2 = load_job(jid)
        if j2:
            j2.setdefault("da_gui", []).append(muc)
            save_job(j2)


def gui_telegram(jid):
    with LOCK:
        if jid in GUI_DANG:
            raise ValueError("Đang gửi bài này, chờ chút.")
        GUI_DANG.add(jid)
    try:
        return _gui_telegram(jid)
    finally:
        with LOCK:
            GUI_DANG.discard(jid)


def _gui_telegram(jid):
    job = load_job(jid)
    if not job:
        raise ValueError("Không thấy bài")
    if not (CFG.get("telegram_token") and CFG.get("telegram_chat")):
        raise ValueError("CAI_TELEGRAM")
    sl = list_slides(job.get("thu_muc_bai"))
    if not sl:
        raise ValueError("Bài chưa có slide")
    chat = CFG["telegram_chat"]
    ten, _ = ten_hien(job)
    cap, ghim = tach_caption(read_caption(job))
    # Fen chốt 28/10 21h: gửi dạng ALBUM ẢNH như fen gửi tay (xem trước được trong nhóm), album không kèm chú thích.
    # Ảnh > 9,5MB (Telegram giới hạn ảnh 10MB) hoặc config "telegram_file": true thì gửi dạng file gốc.
    file_goc = bool(CFG.get("telegram_file")) or any(os.path.getsize(x["path"]) > 9.5e6 for x in sl)
    kieu = "document" if file_goc else "photo"
    da, i = 0, 0
    try:
        for c in chia_nhom(len(sl)):
            nhom = sl[i:i + c]
            i += c
            if len(nhom) == 1:   # 1 nhóm phải 2–10 món: còn lẻ 1 thì gửi riêng
                x = nhom[0]
                with open(x["path"], "rb") as f:
                    data = f.read()
                tg_call("sendDocument" if file_goc else "sendPhoto", {"chat_id": chat}, {kieu: (x["name"], data)}, timeout=300)
            else:
                media, files = [], {}
                for k, x in enumerate(nhom):
                    key = "f%d" % k
                    with open(x["path"], "rb") as f:
                        files[key] = (x["name"], f.read())
                    media.append({"type": kieu, "media": "attach://" + key})
                tg_call("sendMediaGroup", {"chat_id": chat, "media": json.dumps(media)}, files, timeout=300)
            da += len(nhom)
        # caption và câu ghim mỗi cái 1 tin riêng: fen giữ tin để copy thì không dính chữ "Comment ghim"
        if cap:
            tg_call("sendMessage", {"chat_id": chat, "text": cap}, timeout=30)
        if ghim:
            tg_call("sendMessage", {"chat_id": chat, "text": ghim}, timeout=30)
    except (ValueError, OSError) as e:
        m = str(e).split("|")[-1] if isinstance(e, ValueError) else "không đọc được file slide (vừa bị xoá hoặc đổi tên?)"
        if da:  # gửi được phần nào ghi phần đó, báo rõ cho fen
            _ghi_da_gui(jid, {"t": now(), "kieu": "telegram", "n": da, "tong": len(sl), "thieu": True})
            raise ValueError("Đã gửi %d/%d slide thì lỗi: %s" % (da, len(sl), m))
        if isinstance(e, OSError):
            raise ValueError("Chưa gửi được: " + m)
        raise
    _ghi_da_gui(jid, {"t": now(), "kieu": "telegram", "n": len(sl)})
    return {"ok": True, "n": len(sl)}


def kenh_thu_muc(f):
    """Kênh suy ra từ thư mục bài (nằm trong E:/Social Claude/Laptop hay /iPad), None nếu không rõ."""
    if not f:
        return None
    a = f.replace("/", "\\").lower().rstrip("\\") + "\\"
    if IS_MAC:
        a = _nfc(a)
    for k, r in (CFG.get("thu_muc_bai") or {}).items():
        r = (r or "").replace("/", "\\").lower().rstrip("\\")
        if IS_MAC:
            r = _nfc(r)
        if r and k in CFG["kenh"] and a.startswith(r + "\\"):
            return k
    return None


def doi_kenh(jid, data):
    """Fen đổi kênh của bài (iPad <-> Laptop): nút đăng đổi theo (iPad: TikTok web, Laptop: Telegram). Thư mục bài giữ nguyên.
    Chặn bấm nhầm (30/10: bài laptop bị gắn iPad): chuyển sang kênh khác thư mục bài thì phải xác nhận (ep=true)."""
    kenh = data.get("kenh")
    if kenh not in CFG["kenh"]:
        raise ValueError("Kênh không đúng")
    with LOCK:
        job = load_job(jid)
        if not job:
            raise ValueError("Không thấy bài")
        if job.get("status") == "dang-chay":
            raise ValueError("Bài đang chạy, chờ xong rồi đổi kênh")
        kt = kenh_thu_muc(job.get("thu_muc_bai"))
        if job.get("kenh") != kenh and kt and kt != kenh and not data.get("ep"):
            return {"ok": False, "hoi": True, "kenh_thu_muc": kt}
        if job.get("kenh") != kenh:
            job.setdefault("doi_kenh", []).append({"t": now(), "tu": job.get("kenh"), "sang": kenh})
            job["kenh"] = kenh
            save_job(job)
    return {"ok": True, "kenh": kenh}


def viet_caption(jid, data=None):
    """Nút "Viết caption": 1 lượt Claude ngắn đọc slide (ảnh ghép) + luật hashtag, ghi caption.txt. Không đụng slide."""
    with LOCK:
        job, st = parse_job(jid)
        if not job:
            raise ValueError("Không thấy bài")
        if job.get("status") == "dang-chay":
            raise ValueError("Bài đang chạy, chờ xong rồi viết caption")
        f = job.get("thu_muc_bai")
        if not f or not list_slides(f):
            raise ValueError("Bài chưa có slide")
        if not resolve_claude():
            raise ValueError("Không tìm thấy Claude Code trên máy. Bấm Kiểm lại ở góc trên.")
        k = CFG["kenh"].get(job["kenh"], {})
        prompt = fill(read_prompt("viet-caption.txt"), {
            "kenh_ten": "%s (%s)" % (k.get("ten", job["kenh"]), k.get("handle", "")),
            "ten_bai": ten_hien(job)[0], "thu_muc_bai": f.replace("\\", "/"),
            "brief": (job.get("brief") or "").strip() or "(bài có sẵn, không có brief: đọc chữ trên slide)",
            "caption_cu": read_caption(job) or "(chưa có)",
        })
        sau = (data or {}).get("sau")
        if sau in ("tiktok", "telegram"):
            job["sau_caption"] = sau      # viết xong thì luồng lich() tự mở TikTok / gửi Telegram
        else:
            job.pop("sau_caption", None)
        start_run(job, prompt, "caption", None, "Viết caption")
    return {"ok": True, "sau": job.get("sau_caption")}


# ---------- báo vào Telegram khi bài xong / lỗi / đứng lâu (fen không phải ngồi canh máy) ----------
BAT_DAU = time.time()
DOI_RE = re.compile(r"^\s*[-*_]*\s*[*_]*Đã đổi so với brief[*_]*\s*:[*_\s]*(.+)$", re.M | re.I)


def _bao_tg(text, anh=None, chats=None, jid=None):
    """Báo 1 tin (kèm ảnh bìa nếu có) vào nhóm nhận slide, hoặc vào các chat trong `chats` (nhóm / chat lệnh Remote).
    jid: bài xong, chat lệnh Remote có thêm nút xem đủ slide + caption."""
    ok = False
    data = None
    for chat in (chats if chats is not None else [CFG.get("telegram_chat")]):
        f2 = {"chat_id": chat}
        if jid and chat == CFG.get("tg_lenh_chat"):
            f2["reply_markup"] = json.dumps({"inline_keyboard": [[{"text": "📷 Xem đủ slide + caption", "callback_data": "xem:" + jid}]]}, ensure_ascii=False)
        try:
            if anh and os.path.isfile(anh) and os.path.getsize(anh) < 9.5e6:
                if data is None:
                    with open(anh, "rb") as f:
                        data = f.read()
                tg_call("sendPhoto", dict(f2, caption=short(text, 1000)), {"photo": (os.path.basename(anh), data)}, timeout=120)
            else:
                tg_call("sendMessage", dict(f2, text=text), timeout=30)
            ok = True
        except Exception as e:
            log("bao telegram loi: %s" % e)
    return ok


def _noi_bao(job):
    """Chat nhận báo bài xong / lỗi: nhóm (nếu bật báo), cộng chat lệnh Remote khi bài do fen bấm Chạy trên Telegram."""
    ds = []
    if CFG.get("telegram_chat") and CFG.get("telegram_bao") is not False:
        ds.append(CFG["telegram_chat"])
    if job.get("tu_tg") and CFG.get("tg_lenh_chat") and CFG["tg_lenh_chat"] not in ds:
        ds.append(CFG["tg_lenh_chat"])
    return ds


def _danh_dau_run(jid, n, key):
    """Ghi cờ đã báo vào lượt n (đọc lại job trong LOCK). Trả False nếu đã có cờ (luồng khác báo rồi)."""
    with LOCK:
        j = load_job(jid)
        for r in (j or {}).get("runs", []):
            if r.get("n") == n:
                if r.get(key):
                    return False
                r[key] = now()
                save_job(j)
                return True
    return False


def _bao_mot_bai(jid):
    job = read_json(os.path.join(JOBS, jid, "job.json"))
    if not job or not job.get("runs") or job.get("loai") in VIEC_AN:
        return
    st = None
    if job.get("status") == "dang-chay":
        job, st = parse_job(jid)            # Claude đã thoát thì parse_job chốt xong/lỗi
        if not job:
            return
    run = job["runs"][-1]
    if run.get("kind") == "caption":
        return
    noi = _noi_bao(job)
    if not noi:
        return
    ten, _ = ten_hien(job)
    kenh = CFG["kenh"].get(job["kenh"], {}).get("ten", job["kenh"])
    if job.get("status") == "dang-chay":
        idle = now() - ((st or {}).get("last_new") or now())
        if idle > (CFG.get("bao_dung_lau_giay") or 600) and _danh_dau_run(jid, run["n"], "bao_dung_lau"):
            _bao_tg("⏳ Bài %s (%s): %d phút chưa thấy tiến triển. Photoshop có thể đang treo hoặc mở hộp thoại, fen xem máy shop." % (ten, kenh, idle // 60), None, noi)
        return
    kq = run.get("ket_qua")
    if kq not in ("xong", "loi") or run.get("da_bao") or (run.get("ended") or 0) < BAT_DAU - 120:
        return
    if not _danh_dau_run(jid, run["n"], "da_bao"):
        return
    v = job_view(jid) or {}
    phut = max(1, round(((run.get("ended") or now()) - run.get("started", now())) / 60))
    if kq == "xong":
        sl = v.get("slides") or []
        ls = ["✅ Xong: %s" % ten, "%s · %d slide · %d phút%s" % (kenh, len(sl), phut, "" if run.get("kind") == "dung" else " (" + (run.get("label") or "sửa") + ")")]
        m = DOI_RE.search(v.get("final") or "")
        if m:
            ls.append("Đã đổi so với brief: " + re.sub(r"[*_`]+", "", m.group(1)).strip())
        if v.get("hoi"):
            ls.append("Claude có %d câu hỏi, fen trả lời trong app." % len(v["hoi"]))
        ls.append("Mở app Poly Dựng Bài để xem và " + ("Gửi Telegram." if job["kenh"] == "laptop" else "Đăng TikTok."))
        _bao_tg("\n".join(ls), sl[0]["path"] if sl else None, noi, jid if sl else None)
    else:
        _bao_tg("⚠️ Bài %s (%s) dừng giữa chừng sau %d phút: %s\nMở app bấm Chạy tiếp." % (ten, kenh, phut, short(v.get("ly_do") or "không rõ lý do", 300)), None, noi)


def theo_doi():
    while True:
        time.sleep(CFG.get("theo_doi_giay") or 30)
        if not CFG.get("telegram_token") or not ((CFG.get("telegram_chat") and CFG.get("telegram_bao") is not False) or CFG.get("tg_lenh_chat")):
            continue
        try:
            for jid in sorted(os.listdir(JOBS), reverse=True)[:30]:
                try:
                    _bao_mot_bai(jid)
                except Exception:
                    log(traceback.format_exc())
        except Exception:
            log(traceback.format_exc())


# ---------- Chat lệnh Telegram, "Remote" (fen 30/10 16h15: "cần 1 chat mới để nhắn yêu cầu làm việc"; fen chọn: nhắn riêng với
# bot; viết brief từ chủ đề rồi bấm Chạy trên Telegram, ghi quy tắc mới, hỏi tình hình; "có nút bật remote control khi nào cần
# bật lên mới sài"). Chỉ nghe khi fen bật (config tg_lenh). Chỉ nhận tin nhắn RIÊNG từ đúng tài khoản Telegram đã ghép bằng mã
# hiện trong app (tg_lenh_chat + tg_lenh_nguoi); tin từ người khác, từ nhóm: bỏ qua. Chỉ làm việc app có sẵn (viết brief / chat
# sửa brief, dựng bài, ghi quy tắc, xem tình hình), không chạy lệnh máy, không đăng TikTok.
TGL = {"luong": None, "ma": "", "ma_luc": 0, "loi": "", "loi_luc": 0, "tam_dung": 0, "cho": {}, "album": {}, "lan_cuoi": 0, "bo_cu": False}
TGL_KHOA = threading.Lock()
TGL_KHOA_BANG = threading.Lock()
TGL_MA_HAN = 900          # mã ghép dùng được 15 phút
TGL_HELP = (   # fen 30/10 18h05 "giao diện gọn thôi nha": tin ngắn
    "📖 Cách dùng\n"
    "• Nhắn chủ đề → brief + nút ▶️ Chạy\n"
    "• Reply tin brief → sửa brief\n"
    "• quy tắc: … → ghi luật (kèm ảnh được)\n"
    "• /cho → coi slide + caption bài chờ đăng\n"
    "• /tinhhinh · /bang · /tat · /bat")
TGL_PV = {"chung": "chung 2 kênh", "laptop": "chỉ Laptop", "ipad": "chỉ iPad"}


def _bo_dau(s):
    import unicodedata
    s = unicodedata.normalize("NFD", s or "")
    return "".join(c for c in s if unicodedata.category(c) != "Mn").replace("đ", "d").replace("Đ", "D").lower().strip()


def tgl_noi():
    return bool(CFG.get("tg_lenh_chat") and CFG.get("tg_lenh_nguoi"))


def tgl_trang_thai():
    ma = TGL["ma"] if TGL["ma"] and now() - TGL["ma_luc"] < TGL_MA_HAN else ""
    return {"bat": bool(CFG.get("tg_lenh")), "co_bot": bool(CFG.get("telegram_token")), "bot": CFG.get("telegram_bot") or "",
            "noi": tgl_noi(), "ten": CFG.get("tg_lenh_ten") or "", "ma": ma, "ma_con": max(0, int(TGL_MA_HAN - (now() - TGL["ma_luc"]))) if ma else 0,
            "chay": bool(TGL["luong"] and TGL["luong"].is_alive()),
            "loi": TGL["loi"] if TGL["loi"] and now() - TGL["loi_luc"] < 90 else "", "lan_cuoi": TGL["lan_cuoi"]}


def tgl_cai(data):
    """POST /api/tg-lenh: {bat: true|false} bật / tắt nhận lệnh; {bo_noi: true} bỏ ghép tài khoản; {ma_moi: true} mã ghép mới."""
    if data.get("bo_noi"):
        if tgl_noi():
            tgl_gui("Đã bỏ nối app Poly Dựng Bài với Telegram này. Muốn dùng lại: bật Remote trong app, nhắn mã mới.")
        save_cfg_keys({"tg_lenh_chat": None, "tg_lenh_nguoi": None, "tg_lenh_ten": None, "tg_lenh_bang": None})
        TGL["ma"] = ""
        log("tg lenh: bo noi")
    if "bat" in data:
        bat = bool(data.get("bat"))
        if bat and not CFG.get("telegram_token"):
            raise ValueError("CAI_TELEGRAM|Chưa cài bot Telegram. Cài bot trước rồi bật Remote.")
        doi = bat != bool(CFG.get("tg_lenh"))
        dang_nghe = bool(TGL["luong"] and TGL["luong"].is_alive())
        save_cfg_keys({"tg_lenh": bat})
        if doi and bat and not dang_nghe:
            TGL["bo_cu"] = now()     # tin nằm sẵn lúc không ai nghe (chưa nối / app tắt): bỏ, không tự làm việc cũ
        if doi:
            log("tg lenh: %s" % ("bat" if bat else "tat"))
        tgl_khoi()        # tắt mà đã nối thì vẫn nghe (chỉ nhận /bat); chưa nối mà tắt thì luồng tự dừng
        if doi and tgl_noi():
            threading.Thread(target=tgl_bang, kwargs={"ep": True}, daemon=True).start()
        if bat:
            if doi and tgl_noi():
                threading.Thread(target=tgl_gui, args=("🟢 Đã bật Remote.",), daemon=True).start()
        elif doi and tgl_noi():
            threading.Thread(target=tgl_gui, args=("⚪ Đã tắt Remote. Nhắn /bat để bật lại.",), daemon=True).start()
    if CFG.get("tg_lenh") and not tgl_noi() and (data.get("ma_moi") or not TGL["ma"] or now() - TGL["ma_luc"] >= TGL_MA_HAN):
        import secrets
        TGL["ma"], TGL["ma_luc"], TGL["sai"] = "%06d" % secrets.randbelow(10 ** 6), now(), 0
    return tgl_trang_thai()


def tgl_gui(text, nut=None, tra_loi=None, markup=None):
    """Gửi 1 tin vào chat lệnh. Trả message_id (None nếu lỗi / chưa nối)."""
    chat = CFG.get("tg_lenh_chat")
    if not chat or not CFG.get("telegram_token"):
        return None
    f = {"chat_id": chat, "text": text[:4000], "disable_web_page_preview": "true"}
    if nut or markup:
        f["reply_markup"] = json.dumps(markup or {"inline_keyboard": nut}, ensure_ascii=False)
    if tra_loi:
        f["reply_to_message_id"], f["allow_sending_without_reply"] = tra_loi, "true"
    try:
        return (tg_call("sendMessage", f, timeout=30) or {}).get("message_id")
    except Exception as e:
        log("tg lenh gui loi: %s" % e)
        return None


def tgl_gui_dai(text):
    """Brief dài: chia nhiều tin (Telegram tối đa 4096 ký tự / tin), cắt ở chỗ xuống dòng."""
    ids, phan = [], ""
    for ln in text.split("\n"):
        if len(phan) + len(ln) + 1 > 3800 and phan:
            ids.append(tgl_gui(phan))
            phan = ""
        phan += ln[:3800] + "\n"
    if phan.strip():
        ids.append(tgl_gui(phan))
    return [x for x in ids if x]


def tgl_khoi():
    with TGL_KHOA:
        if TGL["luong"] and TGL["luong"].is_alive():
            return
        t = threading.Thread(target=tgl_vong, daemon=True)
        TGL["luong"] = t
        t.start()


def tgl_vong():
    log("tg lenh: bat dau nghe")
    off = int(CFG.get("tg_lenh_offset") or 0)
    try:
        tgl_xem_lai()
    except Exception:
        log(traceback.format_exc())
    tgl_menu()
    # fen 30/10 17h17 "lỡ quên bật remote trên pc": tắt mà đã nối thì vẫn nghe, chỉ nhận lệnh /bat từ Telegram của fen
    while CFG.get("telegram_token") and (CFG.get("tg_lenh") or tgl_noi()):
        if TGL["tam_dung"] > now():        # hộp Cài Telegram đang tìm chat (cũng đọc getUpdates)
            time.sleep(1)
            continue
        # vừa bật Remote: lấy ngay (không chờ) các tin đã nằm sẵn từ lúc tắt rồi bỏ hết; app mở lại khi Remote đang bật thì vẫn làm
        bo_cu = TGL.pop("bo_cu", False)
        try:
            ups = tg_call("getUpdates", {"offset": off, "timeout": 0 if bo_cu else 25, "allowed_updates": json.dumps(["message", "callback_query"])}, timeout=40) or []
            TGL["loi"] = ""
        except Exception as e:
            if bo_cu:
                TGL["bo_cu"] = bo_cu
            if TGL["tam_dung"] > now():
                continue
            s = str(e).split("|")[-1]
            if "conflict" in s.lower():
                s = "Bot đang bị chương trình khác đọc tin (webhook, hoặc app khác cùng token bot) nên chưa nhận lệnh được."
            TGL["loi"], TGL["loi_luc"] = s, now()
            time.sleep(15)
            continue
        bo = 0
        for u in ups:
            off = max(off, int(u.get("update_id") or 0) + 1)
            if bo_cu:
                m = u.get("message") or {}
                cu = bool(u.get("callback_query")) or (m.get("date") or 0) < int(bo_cu)   # tin gửi sau lúc bật thì vẫn làm
                if cu:
                    m = m or (u.get("callback_query") or {}).get("message") or {}
                    bo += (m.get("chat") or {}).get("id") == CFG.get("tg_lenh_chat")
                    continue
            try:
                if u.get("callback_query"):
                    tgl_bam(u["callback_query"])
                elif u.get("message"):
                    tgl_tin(u["message"])
            except Exception:
                log(traceback.format_exc())
        if ups:
            try:
                save_cfg_keys({"tg_lenh_offset": off})
            except Exception:
                pass
        if bo and tgl_noi():
            tgl_gui("Bỏ qua %d tin nhắn lúc Remote tắt, cần thì nhắn lại." % bo)
        try:
            tgl_bang()            # bảng ghim: sửa khi tình hình đổi
        except Exception:
            log(traceback.format_exc())
    log("tg lenh: dung nghe")


def tgl_menu():
    """Menu lệnh của bot trong chat lệnh (nút / cạnh ô nhắn)."""
    if not tgl_noi():
        return
    try:
        tg_call("setMyCommands", {"commands": json.dumps([{"command": "tinhhinh", "description": "Bài đang dựng, xếp hàng, chờ đăng"},
                                                          {"command": "cho", "description": "Bài chờ đăng: xem slide + caption"},
                                                          {"command": "bat", "description": "Bật Remote"},
                                                          {"command": "tat", "description": "Tắt Remote (vẫn nghe /bat)"},
                                                          {"command": "bang", "description": "Gửi lại bảng điều khiển (ghim)"},
                                                          {"command": "help", "description": "Xem việc nhắn được"}], ensure_ascii=False),
                                  "scope": json.dumps({"type": "chat", "chat_id": CFG["tg_lenh_chat"]})}, timeout=20)
    except Exception:
        pass


def tgl_xem_lai():
    """App vừa mở lại: brief / quy tắc nhờ từ Telegram mà chưa báo kết quả thì theo dõi tiếp."""
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:60] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if j and j.get("loai") in VIEC_AN and isinstance(j.get("tg"), dict) and not j["tg"].get("bao") and now() - (j.get("created") or 0) < 6 * 3600:
            threading.Thread(target=tgl_cho_viec, args=(jid,), daemon=True).start()


def tgl_lay_anh(m):
    """Ảnh fen gửi kèm (ảnh thường hoặc file ảnh) -> [{name, data(base64)}] như ô dán ảnh của app."""
    import urllib.request
    ids = []
    if m.get("photo"):
        ids.append((m["photo"][-1]["file_id"], "anh-telegram.jpg"))
    dc = m.get("document") or {}
    if dc.get("file_id") and str(dc.get("mime_type") or "").startswith("image/"):
        ids.append((dc["file_id"], dc.get("file_name") or "anh-telegram.png"))
    out = []
    for fid, ten in ids:
        try:
            f = tg_call("getFile", {"file_id": fid}, timeout=30) or {}
            url = (CFG.get("telegram_api") or "https://api.telegram.org").rstrip("/") + "/file/bot%s/%s" % (CFG["telegram_token"], f["file_path"])
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "PolyDungBai/1.0"}), timeout=60) as r:
                raw = r.read(25 * 1024 * 1024)
            out.append({"name": ten, "data": base64.b64encode(raw).decode("ascii")})
        except Exception as e:
            log("tg lenh: tai anh loi %s" % type(e).__name__)   # không ghi lỗi gốc: đường dẫn có token bot
    return out


def tgl_cho_them(x):
    k = uuid.uuid4().hex[:8]
    x["t"] = now()
    TGL["cho"][k] = x
    for kk in [kk for kk, v in list(TGL["cho"].items()) if now() - v["t"] > 86400]:
        TGL["cho"].pop(kk, None)
    for g in [g for g, kk in list(TGL["album"].items()) if kk not in TGL["cho"]]:
        TGL["album"].pop(g, None)
    return k


def tgl_doan_kenh(s):
    t = _bo_dau(s)
    ip = bool(re.search(r"\bipad|\bipados|\bapple pencil\b", t))
    lt = bool(re.search(r"\blaptop|\bmacbook|\bthinkpad|\bwindows\b|\bdell\b|\bhp\b|\basus\b|\blenovo\b|\bacer\b|\bmsi\b|\bmay tram\b|\bgaming\b", t))
    return "ipad" if ip and not lt else "laptop" if lt and not ip else ""


def tgl_tin(m):
    c, fr = m.get("chat") or {}, m.get("from") or {}
    if c.get("type") != "private" or fr.get("is_bot"):
        return
    text = (m.get("text") or m.get("caption") or "").strip()
    if not tgl_noi():
        ma = TGL["ma"] if TGL["ma"] and now() - TGL["ma_luc"] < TGL_MA_HAN else ""
        so = re.sub(r"\D", "", text)
        if ma and so != ma and len(so) == 6:              # đoán mã: sai 10 lần thì huỷ mã, fen bấm Mã mới trong app
            TGL["sai"] = TGL.get("sai", 0) + 1
            if TGL["sai"] >= 10:
                TGL["ma"], TGL["sai"] = "", 0
                log("tg lenh: sai ma 10 lan, huy ma")
            return
        if ma and so == ma:          # "/start 123456" (bấm link trong app) hoặc gõ "123456"
            ten = " ".join(x for x in (fr.get("first_name"), fr.get("last_name")) if x).strip() or fr.get("username") or "fen"
            save_cfg_keys({"tg_lenh_chat": c["id"], "tg_lenh_nguoi": fr["id"], "tg_lenh_ten": ten})
            TGL["ma"] = ""
            log("tg lenh: da ghep tai khoan %s" % fr.get("id"))
            tgl_menu()
            tgl_gui("✅ Đã nối app Poly Dựng Bài.\n\n" + TGL_HELP)
            tgl_bang(moi=True)
        return
    if c.get("id") != CFG.get("tg_lenh_chat") or fr.get("id") != CFG.get("tg_lenh_nguoi"):
        log("tg lenh: bo qua tin tu tai khoan la %s" % fr.get("id"))
        return
    TGL["lan_cuoi"] = now()
    t0 = _bo_dau(text)
    lenh = (t0.split() or [""])[0].split("@")[0]
    la_bat = lenh in ("/bat", "/on") or t0 in ("bat", "bat remote", "mo remote", "bat lenh", "on")
    if lenh in ("/bang", "/menu", "/start") or t0 in ("bang", "bang dieu khien", "menu"):
        return tgl_bang(moi=True)
    if lenh in ("/cho", "/chodang") or t0 in ("cho dang", "bai cho dang"):
        return tgl_ds_cho()
    if not CFG.get("tg_lenh"):            # Remote đang tắt: chỉ nhận lệnh bật
        if la_bat:
            tgl_cai({"bat": True})
        elif now() - TGL.get("ngu_bao", 0) > 300:
            TGL["ngu_bao"] = now()
            tgl_gui("⚪ Remote đang tắt, nhắn /bat để bật.")
        return
    if la_bat:
        return tgl_gui("🟢 Remote đang bật rồi.")
    anh = tgl_lay_anh(m) if (m.get("photo") or m.get("document")) else []
    g = m.get("media_group_id")
    if anh and g and not text and g in TGL["album"]:          # album nhiều ảnh: ảnh sau không có chữ, gộp vào việc của ảnh đầu
        p = TGL["cho"].get(TGL["album"][g])
        if p is not None:
            p.setdefault("anh", []).extend(anh)
            return
    if (m.get("photo") or m.get("document")) and not text:
        if g:
            return
        return tgl_gui("Ảnh dùng khi ghi quy tắc: gửi lại kèm chữ \"quy tắc: …\".")
    if lenh in ("/help", "/huongdan", "help") or t0 in ("?", "huong dan", "giup", "lenh"):
        return tgl_gui(TGL_HELP)
    if lenh in ("/tinhhinh", "/status") or re.match(r"(tinh hinh|tinh trang|status)\b", t0):
        return tgl_gui(tgl_tinh_hinh())
    if lenh == "/tat" or t0 in ("tat", "tat remote", "tat lenh", "dung remote"):
        tgl_cai({"bat": False})
        return
    mq = re.match(r"^\s*(?:/quytac(?:@\w+)?|quy\s*t[aắ]c(?:\s*m[oớ]i)?|lu[aậ]t(?:\s*m[oớ]i)?)\s*[:\-–]?\s*", text, re.I)
    hoi_qt = TGL.get("hoi_qt") and (m.get("reply_to_message") or {}).get("message_id") == TGL.get("hoi_qt")
    if mq or hoi_qt:
        nd = (text[mq.end():] if mq else text).strip()
        if len(nd) < 3:
            return tgl_gui("Gõ luật sau chữ quy tắc, vd: quy tắc: slide cuối không ghi địa chỉ")
        # fen 30/10 17h32 "luật mới đã update thì làm không cần hỏi": ghi luôn, không hỏi phạm vi. Chữ chỉ nhắc 1 kênh
        # (laptop / iPad) thì ghi cho kênh đó, còn lại ghi chung 2 kênh. Album nhiều ảnh: chờ 3 giây gom đủ ảnh rồi mới ghi.
        pv = tgl_doan_kenh(nd) or "chung"
        k = tgl_cho_them({"loai": "qt", "text": nd, "anh": anh})
        if g:
            TGL["album"][g] = k
            threading.Timer(3, lambda: tgl_bat_qt(TGL["cho"].pop(k, None), pv)).start()
            return
        return tgl_bat_qt(TGL["cho"].pop(k), pv)
    rep = (m.get("reply_to_message") or {}).get("message_id")
    if rep:
        bj = tgl_tim_brief(rep)
        if bj:
            return tgl_sua_brief(bj, text)
    mb = re.match(r"^\s*/brief(?:@\w+)?\s*", text, re.I)
    if lenh.startswith("/") and not mb:
        return tgl_gui("Lệnh lạ.\n\n" + TGL_HELP)
    chu_de = (text[mb.end():] if mb else text).strip()
    if len(chu_de) < 3:
        return tgl_gui("Gõ chủ đề bài, vd: laptop cho dân kiến trúc")
    kenh = tgl_doan_kenh(chu_de)
    if kenh:
        return tgl_bat_brief(kenh, chu_de)
    k = tgl_cho_them({"loai": "brief", "text": chu_de})
    tgl_gui("✍ Kênh nào? “%s”" % short(chu_de, 200),
            [[{"text": "💻 Laptop", "callback_data": "br:%s:laptop" % k}, {"text": "📱 iPad", "callback_data": "br:%s:ipad" % k}],
             [{"text": "✖ Bỏ", "callback_data": "huy:%s" % k}]])


def tgl_bam(q):
    fr, msg = q.get("from") or {}, q.get("message") or {}

    def tra(t=""):
        try:
            tg_call("answerCallbackQuery", {"callback_query_id": q["id"], "text": t[:190]}, timeout=15)
        except Exception:
            pass

    def bo_nut():
        try:
            tg_call("editMessageReplyMarkup", {"chat_id": (msg.get("chat") or {}).get("id"), "message_id": msg.get("message_id"),
                                               "reply_markup": json.dumps({"inline_keyboard": []})}, timeout=15)
        except Exception:
            pass

    if not tgl_noi() or fr.get("id") != CFG.get("tg_lenh_nguoi") or (msg.get("chat") or {}).get("id") != CFG.get("tg_lenh_chat"):
        return tra()
    TGL["lan_cuoi"] = now()
    loai, _, du = (q.get("data") or "").partition(":")
    if loai == "bg":
        return tgl_bam_bang(du, tra)
    if loai == "xem" and re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", du):     # chỉ xem: lúc Remote tắt vẫn xem được
        tra("Đang gửi slide…")
        return tgl_xem(du)
    if not CFG.get("tg_lenh"):
        return tra("Remote đang tắt, nhắn /bat để bật rồi bấm lại")
    if loai in ("br", "qt", "gy"):
        k, _, gt = du.partition(":")
        p = TGL["cho"].pop(k, None)
        if not p:
            tra("Hết hạn rồi, fen nhắn lại nha")
            return bo_nut()
        tra()
        bo_nut()
        if loai == "br" and gt in CFG["kenh"]:
            return tgl_bat_brief(gt, p["text"])
        if loai == "qt" and gt in QT_PHAM_VI:
            return tgl_bat_qt(p, gt)
        if loai == "gy":
            try:
                return tgl_bat_brief(p["kenh"], p["goi_y"][int(gt)])
            except (ValueError, IndexError, KeyError):
                return
        return
    if loai == "huy":
        TGL["cho"].pop(du, None)
        tra("Đã bỏ")
        return bo_nut()
    if loai == "dd" and re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", du):
        try:
            danh_dau_dang(du, {})
        except ValueError as e:
            return tra(str(e))
        tra("Đã chuyển sang Đã đăng")
        bo_nut()
        tgl_gui("✅ Đã đăng: %s" % ten_hien(load_job(du) or {})[0])
        return tgl_bang(ep=True)
    if loai == "cap" and re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", du):
        try:
            viet_caption(du, {})
        except ValueError as e:
            return tra(str(e).split("|")[-1])
        tra("Claude đang viết caption…")
        bo_nut()
        tgl_gui("✍ Đang viết caption…")
        return threading.Thread(target=tgl_cho_caption, args=(du,), daemon=True).start()
    if loai in ("chay", "lai", "bo") and re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", du):
        if loai == "bo":
            with LOCK:
                j = load_job(du)
                if j:
                    j.setdefault("tg", {})["bo"] = now()
                    save_job(j)
            tra("Đã bỏ brief này")
            return bo_nut()
        if loai == "lai":
            tra("Viết lại…")
            bo_nut()
            return tgl_viet_lai(du)
        return tgl_chay(du, tra, bo_nut)
    tra()


def tgl_bat_brief(kenh, chu_de, them=None):
    d = {"kenh": kenh, "chu_de": chu_de}
    d.update(them or {})
    try:
        r = viet_brief(d)
    except ValueError as e:
        return tgl_gui("⚠️ Chưa viết brief được: " + str(e).split("|")[-1])
    tk = CFG["kenh"].get(kenh, {}).get("ten", kenh)
    mid = tgl_gui("✍ Đang viết brief %s: “%s”…" % (tk, short(chu_de, 150)))
    tgl_gan(r["id"], {"cho": mid})
    threading.Thread(target=tgl_cho_viec, args=(r["id"],), daemon=True).start()


def tgl_gan(jid, x):
    with LOCK:
        j = load_job(jid)
        if j:
            j.setdefault("tg", {}).update(x)
            save_job(j)


def tgl_brief_cua(jid):
    return read_text(os.path.join(job_dir(jid), "brief-viet.txt")).replace("\ufeff", "").strip()


def tgl_tim_brief(mid):
    """Tin fen trả lời (reply) thuộc brief nào (tin brief hoặc tin tóm tắt có nút Chạy)."""
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:80] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        tg = (j or {}).get("tg") if (j or {}).get("loai") == "brief" else None
        if isinstance(tg, dict) and tg.get("chat") == CFG.get("tg_lenh_chat") and (tg.get("msg") == mid or mid in (tg.get("msgs") or [])):
            return jid
    return None


def tgl_viet_lai(jid):
    j = load_job(jid)
    if not j or j.get("loai") != "brief":
        return tgl_gui("Không thấy brief đó nữa, fen nhắn lại chủ đề nha.")
    bv = tgl_brief_cua(jid)
    tgl_bat_brief(j.get("kenh"), j.get("chu_de") or j.get("tieu_de") or "", {
        "brief": bv, "brief_cua": "claude" if bv else "", "chu_de_cu": j.get("chu_de") or "",
        "ghi_chu": "Fen bấm Viết lại trên Telegram: viết bản khác (góc khác, bìa khác), vẫn đúng chủ đề này."})


def tgl_sua_brief(jid, tin):
    """Fen reply tin brief: 1 lượt Chat sửa brief như ô chat dưới Brief trong app."""
    j = load_job(jid)
    if not j:
        return tgl_gui("Không thấy brief đó nữa.")
    tgl_gan(jid, {"bo": now()})        # bản cũ thôi dùng, nút Chạy đi theo bản sửa
    ls = list((j.get("tg") or {}).get("lich_su") or [])
    try:
        r = chat_brief({"kenh": j.get("kenh"), "tin": tin, "chu_de": j.get("chu_de") or "", "brief": tgl_brief_cua(jid), "lich_su": ls})
    except ValueError as e:
        return tgl_gui("⚠️ Chưa sửa được: " + str(e).split("|")[-1])
    mid = tgl_gui("✏️ Đang sửa brief…")
    tgl_gan(r["id"], {"cho": mid, "goc": jid, "brief_goc": tgl_brief_cua(jid), "lich_su": (ls + [{"text": tin}])[-8:]})
    threading.Thread(target=tgl_cho_viec, args=(r["id"],), daemon=True).start()


def tgl_chay(jid, tra, bo_nut):
    with LOCK:
        j = load_job(jid)
        if not j or j.get("loai") != "brief":
            return tra("Không thấy brief này")
        tg = j.get("tg") or {}
        if tg.get("chay"):
            return tra("Brief này đã chạy rồi")
        if tg.get("bo"):
            return tra("Brief này đã bỏ / đã có bản sửa")
        bv = tgl_brief_cua(jid) or (tg.get("brief_goc") or "")
        if len(bv) < 5:
            return tra("Brief trống")
        j.setdefault("tg", {})["chay"] = "dang"
        save_job(j)
    tra("Bắt đầu dựng…")
    bo_nut()
    try:
        job = create_job({"kenh": j.get("kenh"), "brief": bv, "tu_tg": True})
    except ValueError as e:
        tgl_gan(jid, {"chay": None})
        return tgl_gui("⚠️ Chưa chạy được: " + str(e).split("|")[-1])
    tgl_gan(jid, {"chay": job["id"]})
    ten, tk = ten_hien(job)[0], CFG["kenh"].get(job.get("kenh"), {}).get("ten", job.get("kenh"))
    if job.get("status") == "hen" and job.get("xep_hang"):
        tgl_gui("⏳ Xếp hàng thứ %d: %s (%s)" % (job.get("thu") or 1, ten, tk))
    else:
        tgl_gui("▶️ Đang dựng: %s (%s)" % (ten, tk))
    log("tg lenh: chay bai %s tu brief %s" % (job["id"], jid))
    tgl_bang(ep=True)


def tgl_bat_qt(p, pv):
    if not p:
        return
    try:
        r = ghi_quy_tac({"text": p["text"], "pham_vi": pv, "anh": p.get("anh") or []})
    except ValueError as e:
        return tgl_gui("⚠️ Chưa ghi được quy tắc: " + str(e).split("|")[-1])
    na = len(p.get("anh") or [])
    mid = tgl_gui("📏 Đang ghi quy tắc (%s%s): “%s”" % (TGL_PV.get(pv, pv), ", %d ảnh" % na if na else "", short(p["text"], 150)))
    tgl_gan(r["id"], {"cho": mid})
    threading.Thread(target=tgl_cho_viec, args=(r["id"],), daemon=True).start()


def tgl_cho_viec(jid, han=2400):
    """Chờ việc ẩn (brief / chat sửa brief / quy tắc) xong rồi báo kết quả về chat lệnh (1 lần)."""
    bd = now()
    while True:
        time.sleep(4)
        try:
            j, _ = parse_job(jid)          # Claude đã thoát mà chưa chốt thì parse_job chốt xong / lỗi
        except Exception:
            j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j:
            return
        if j.get("status") not in ("dang-chay", "moi"):
            break
        if now() - bd > han:
            return tgl_gui("⏳ Việc \"%s\" chạy quá %d phút chưa xong, fen mở app xem nha." % (short(j.get("tieu_de") or "", 60), han // 60))
    with LOCK:
        j = load_job(jid)
        if not j or (j.get("tg") or {}).get("bao"):
            return
        j.setdefault("tg", {})["bao"] = now()
        save_job(j)
    try:
        (tgl_bao_qt if j.get("loai") == "quy-tac" else tgl_bao_brief)(jid)
    except Exception:
        log(traceback.format_exc())


def _tgl_dong(ls, key):
    return [re.sub(r"[*_`]+", "", re.sub(r"^\W*%s\s*:\s*" % key, "", x, flags=re.I)).strip() for x in ls if re.match(r"^\W*%s\s*:" % key, x, re.I)]


def tgl_bao_brief(jid):
    v = job_view(jid) or {}
    j = v.get("job") or {}
    jj = load_job(jid) or {}
    tg = jj.get("tg") or {}
    tk = CFG["kenh"].get(j.get("kenh"), {}).get("ten", j.get("kenh"))
    ls = [x.strip() for x in (v.get("final") or "").splitlines() if x.strip()]
    bv, st = v.get("brief_viet") or "", j.get("status")
    if jj.get("chat") and (v.get("final") or "").strip():     # nhớ câu Claude trả lời cho lần fen reply sửa tiếp
        tgl_gan(jid, {"lich_su": (list(tg.get("lich_su") or []) + [{"ai": True, "text": short(v["final"], 300)}])[-8:]})
    if st == "dung":
        return tgl_gui("Đã dừng việc viết brief.")
    if st != "xong":
        return tgl_gui("⚠️ Chưa viết được brief: %s" % short(v.get("ly_do") or "Claude dừng giữa chừng", 300),
                       [[{"text": "🔄 Viết lại", "callback_data": "lai:" + (tg.get("goc") or jid)}]])
    if jj.get("chat") and not bv:      # chat sửa brief mà Claude chỉ trả lời / góp ý: bản gốc dùng tiếp
        goc = tg.get("goc")
        if goc:
            tgl_gan(goc, {"bo": None})
        return tgl_gui("💬 " + re.sub(r"[*_`]+", "", v.get("final") or "Claude không đổi brief.").strip()[:3000],
                       [[{"text": "▶️ Chạy bản đang có", "callback_data": "chay:" + goc}]] if goc else None)
    trung, goi_y = _tgl_dong(ls, "TRUNG"), _tgl_dong(ls, "GOI_Y")
    if not bv and trung:
        k = tgl_cho_them({"loai": "gy", "kenh": j.get("kenh"), "goi_y": goi_y[:4]})
        nut = [[{"text": "✍ " + short(x, 45), "callback_data": "gy:%s:%d" % (k, i)}] for i, x in enumerate(goi_y[:4])]
        return tgl_gui("⚠️ Trùng bài cũ: %s\nClaude không viết. %s" % (short(trung[0], 200), "Chủ đề chưa làm, bấm để viết:" if nut else "Fen gõ chủ đề khác nha."), nut or None)
    if not bv:
        return tgl_gui("⚠️ Claude chạy xong nhưng không ra brief: %s" % short(v.get("final") or "?", 300),
                       [[{"text": "🔄 Viết lại", "callback_data": "lai:" + jid}]])
    msgs = tgl_gui_dai("📝 Brief %s%s:\n\n%s" % (tk, " (đã sửa)" if jj.get("chat") else "", bv))
    hieu = next((re.sub(r"[*_`]+", "", x).strip() for x in ls if re.match(r"^\W*Chủ đề\s*:", x, re.I)), "")
    li, cn = _tgl_dong(ls, "LOI_ICH"), (_tgl_dong(ls, "CAN_NHAC") or [""])[0]
    ts = ["✓ " + (hieu or ("Đã sửa: " + short(re.sub(r"[*_`]+", "", v.get("final") or ""), 300) if jj.get("chat") else "Brief xong"))]
    ts += ["• " + x for x in li]
    if cn and not re.match(r"^không có\.?$", cn, re.I):
        ts.append("⚠️ " + cn)
    ts.append("↩️ Reply tin này để sửa")
    mid = tgl_gui("\n".join(ts), [[{"text": "▶️ Chạy dựng bài", "callback_data": "chay:" + jid}],
                                  [{"text": "🔄 Viết lại", "callback_data": "lai:" + jid}, {"text": "✖ Bỏ", "callback_data": "bo:" + jid}]])
    tgl_gan(jid, {"msg": mid, "msgs": msgs, "chat": CFG.get("tg_lenh_chat")})


def tgl_bao_qt(jid):
    v = job_view(jid) or {}
    st = (v.get("job") or {}).get("status")
    if st == "xong" and (v.get("final") or "").strip():
        return tgl_gui("📏 " + re.sub(r"[*_`]+", "", v["final"]).strip()[:3500])
    if st == "dung":
        return tgl_gui("Đã dừng ghi quy tắc.")
    tgl_gui("⚠️ Chưa ghi được quy tắc: " + short(v.get("ly_do") or "Claude dừng giữa chừng", 300))


def _tgl_so_lieu(chi_tiet=True):
    """Số liệu cho /tinhhinh và bảng điều khiển ghim: bài đang dựng, xếp hàng, hẹn, chờ / đã đăng theo kênh."""
    ic = {"laptop": "💻", "ipad": "📱"}
    tenk = lambda k: "%s %s" % (ic.get(k, ""), CFG["kenh"].get(k, {}).get("ten", k))
    d = {"dang": [], "xep": [], "hen": [], "viet": [], "loi": 0, "cho_dang": {}, "da_dang": {}, "da_nay": 0, "ic": ic, "tenk": tenk}
    hom_nay = time.strftime("%Y-%m-%d")
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:300] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j:
            continue
        k, s = j.get("kenh"), j.get("status")
        if j.get("loai") in VIEC_AN:
            if s == "dang-chay" and now() - (j.get("created") or 0) < 3600:
                d["viet"].append("%s %s" % (ic.get(k, ""), short(j.get("tieu_de") or "", 60)))
            continue
        ten = ten_hien(j)[0]
        if s == "dang-chay":
            r = (j.get("runs") or [{}])[-1]
            if not pid_alive(r.get("pid"), r.get("started")):
                continue
            ev = ""
            if chi_tiet:
                try:
                    v = job_view(jid, 0) or {}
                    ev = next((e.get("x") or "" for e in reversed(v.get("events") or []) if not e.get("s") and e.get("k") != "text"), "")
                except Exception:
                    pass
            d["dang"].append({"ten": ten, "k": k, "phut": max(1, int(now() - (r.get("started") or now())) // 60), "ev": ev})
        elif s == "hen":
            d["xep" if j.get("xep_hang") else "hen"].append((j.get("hen_luc") or 0, "%s %s" % (ic.get(k, ""), short(ten, 50))))
        elif s in ("loi", "dung"):
            if now() - (j.get("created") or 0) < 86400:
                d["loi"] += 1
        elif s == "xong":
            dd = j.get("da_dang")
            if dd:
                d["da_dang"][k] = d["da_dang"].get(k, 0) + 1
                t = dd.get("lich") or dd.get("t")
                if t and time.strftime("%Y-%m-%d", time.localtime(t)) == hom_nay:
                    d["da_nay"] += 1
            else:
                d["cho_dang"][k] = d["cho_dang"].get(k, 0) + 1
    return d


def tgl_tinh_hinh():
    d = _tgl_so_lieu()
    tenk = d["tenk"]
    ls = ["📊 Tình hình lúc %s" % time.strftime("%H:%M %d/%m")]
    ls += ["▶️ %s (%s · %d phút%s)" % (short(x["ten"], 60), tenk(x["k"]), x["phut"], " · " + short(x["ev"], 50) if x["ev"] else "") for x in d["dang"]] \
        or ["Không có bài nào đang dựng."]
    if d["xep"]:
        ls.append("⏳ Xếp hàng (%d): %s" % (len(d["xep"]), " · ".join(x for _, x in sorted(d["xep"]))))
    if d["hen"]:
        ls.append("🗓 Hẹn làm (%d): %s" % (len(d["hen"]), " · ".join("%s lúc %s" % (x, time.strftime("%H:%M %d/%m", time.localtime(t))) for t, x in sorted(d["hen"]))))
    if d["viet"]:
        ls.append("✍ Đang viết: " + " · ".join(d["viet"]))
    if d["loi"]:
        ls.append("⚠️ %d bài dừng giữa chừng trong 24 giờ qua, mở app bấm Chạy tiếp." % d["loi"])
    ls.append("📮 Chờ đăng: " + " · ".join("%s %d" % (tenk(k), d["cho_dang"].get(k, 0)) for k in CFG["kenh"]))
    ls.append("✅ Đã đăng: " + " · ".join("%s %d" % (tenk(k), d["da_dang"].get(k, 0)) for k in CFG["kenh"]) + (" (hôm nay %d)" % d["da_nay"] if d["da_nay"] else ""))
    ci = claude_info()
    ls.append("Claude trên máy shop: " + ("đã đăng nhập ✓" if ci.get("login") else "CHƯA đăng nhập, mở app bấm Đăng nhập" if ci.get("login") is False else "chưa rõ"))
    return "\n".join(ls)


# ---------- bảng điều khiển ghim đầu chat lệnh (fen 30/10 17h22 "tạo giao diện điều khiển rồi ghi ở telegram", chọn "bảng điều khiển
# ghim đầu chat"): 1 tin có nút, app tự sửa tin đó khi tình hình đổi (bài chạy / xếp hàng / xong, bật tắt Remote)
def tgl_bang_nut():
    bat = bool(CFG.get("tg_lenh"))
    return [[{"text": "⚪ Tắt" if bat else "🟢 Bật", "callback_data": "bg:tat" if bat else "bg:bat"},
             {"text": "🔄", "callback_data": "bg:moi"}, {"text": "❓", "callback_data": "bg:help"}],
            [{"text": "✍ Brief", "callback_data": "bg:brief"}, {"text": "📏 Quy tắc", "callback_data": "bg:qt"}],
            [{"text": "📮 Chờ đăng", "callback_data": "bg:cho"}, {"text": "📊 Tình hình", "callback_data": "bg:th"}]]


def tgl_bang_chu():
    """(chữ bảng, dấu để biết tình hình đổi chưa: không tính số phút, giờ)."""
    d = _tgl_so_lieu(chi_tiet=False)
    ic = d["ic"]
    bat = bool(CFG.get("tg_lenh"))
    ls = ["🎛 Poly Dựng Bài · " + ("🟢 Remote bật" if bat else "⚪ Remote tắt")]
    ls += ["▶️ Đang dựng: %s (%s %d')" % (short(x["ten"], 45), ic.get(x["k"], ""), x["phut"]) for x in d["dang"]] \
        or ["▶️ Không có bài đang dựng"]
    phu = []
    if d["xep"]:
        phu.append("⏳ Xếp hàng %d" % len(d["xep"]))
    if d["hen"]:
        phu.append("🗓 Hẹn %d" % len(d["hen"]))
    if d["viet"]:
        phu.append("✍ Đang viết %d" % len(d["viet"]))
    if d["loi"]:
        phu.append("⚠️ Dừng %d" % d["loi"])
    if phu:
        ls.append(" · ".join(phu))
    ls.append("📮 Chờ đăng %s · ✅ Đã đăng %s" % (" ".join("%s%d" % (ic.get(k, k), d["cho_dang"].get(k, 0)) for k in CFG["kenh"]),
                                                " ".join("%s%d" % (ic.get(k, k), d["da_dang"].get(k, 0)) for k in CFG["kenh"])))
    ci = _CLAUDE.get("login")
    if ci is False:
        ls.append("⚠️ Claude máy shop CHƯA đăng nhập")
    dau = json.dumps([bat, [(x["ten"], x["k"]) for x in d["dang"]], len(d["xep"]), len(d["hen"]), len(d["viet"]), d["loi"],
                      d["cho_dang"], d["da_dang"], ci], ensure_ascii=False, sort_keys=True)
    ls.append("🕒 %s" % time.strftime("%H:%M %d/%m"))
    return "\n".join(ls), dau


def tgl_bang(moi=False, ep=False):
    """Gửi bảng mới + ghim (moi), hoặc sửa bảng đang ghim khi tình hình đổi / có bài đang dựng thì 5 phút 1 lần (ep: sửa luôn)."""
    if not tgl_noi():
        return
    with TGL_KHOA_BANG:
        chu, dau = tgl_bang_chu()
        mid, chat = CFG.get("tg_lenh_bang"), CFG["tg_lenh_chat"]
        if not moi and mid and not ep and dau == TGL.get("bang_dau") and (now() - TGL.get("bang_luc", 0) < 300 or "Đang dựng:" not in chu):
            return
        nut = json.dumps({"inline_keyboard": tgl_bang_nut()}, ensure_ascii=False)
        if mid and not moi:
            try:
                tg_call("editMessageText", {"chat_id": chat, "message_id": mid, "text": chu, "reply_markup": nut}, timeout=20)
                TGL["bang_dau"], TGL["bang_luc"] = dau, now()
                return
            except Exception as e:
                l = str(e).lower()
                if "not modified" in l:
                    TGL["bang_dau"], TGL["bang_luc"] = dau, now()
                    return
                if "not found" not in l and "can't be edited" not in l:
                    TGL["bang_luc"] = now()       # lỗi mạng: thử lại lượt sau, không gửi bảng mới
                    return
        moi_id = tgl_gui(chu, tgl_bang_nut())
        if not moi_id:
            return
        try:
            tg_call("pinChatMessage", {"chat_id": chat, "message_id": moi_id, "disable_notification": "true"}, timeout=20)
        except Exception as e:
            log("tg lenh: ghim bang loi %s" % e)
        if mid and mid != moi_id:
            try:
                tg_call("unpinChatMessage", {"chat_id": chat, "message_id": mid}, timeout=20)
            except Exception:
                pass
        save_cfg_keys({"tg_lenh_bang": moi_id})
        TGL["bang_dau"], TGL["bang_luc"] = dau, now()


def tgl_ds_cho():
    """Nút 📮 Bài chờ đăng: danh sách bài xong chưa đăng (mới trước), bấm bài là gửi slide + caption về chat."""
    ic = {"laptop": "💻", "ipad": "📱"}
    ds = []
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:300] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if j and j.get("loai") not in VIEC_AN and j.get("status") == "xong" and not j.get("da_dang"):
            ds.append(j)
    if not ds:
        return tgl_gui("📮 Không có bài chờ đăng.")
    nut = [[{"text": "%s %s" % (ic.get(j.get("kenh"), ""), short(ten_hien(j)[0], 48)), "callback_data": "xem:" + j["id"]}] for j in ds[:15]]
    tgl_gui("📮 Chờ đăng (%d%s):" % (len(ds), ", 15 bài mới nhất" if len(ds) > 15 else ""), nut)


def tgl_xem(jid):
    """Gửi đủ slide (album như nút Gửi Telegram) + caption + câu ghim của 1 bài về chat lệnh, kèm nút Đã đăng."""
    j = load_job(jid)
    if not j:
        return tgl_gui("Không thấy bài này nữa.")
    chat = CFG.get("tg_lenh_chat")
    sl = list_slides(j.get("thu_muc_bai"))
    ten = ten_hien(j)[0]
    tk = CFG["kenh"].get(j.get("kenh"), {}).get("ten", j.get("kenh"))
    if not sl:
        return tgl_gui("Bài %s chưa có slide." % ten)
    tgl_gui("📷 %s · %d slide" % (ten, len(sl)))
    file_goc = bool(CFG.get("telegram_file")) or any(os.path.getsize(x["path"]) > 9.5e6 for x in sl)
    kieu = "document" if file_goc else "photo"
    i = 0
    try:
        for c in chia_nhom(len(sl)):
            nhom = sl[i:i + c]
            i += c
            if len(nhom) == 1:
                with open(nhom[0]["path"], "rb") as f:
                    tg_call("sendDocument" if file_goc else "sendPhoto", {"chat_id": chat}, {kieu: (nhom[0]["name"], f.read())}, timeout=300)
            else:
                media, files = [], {}
                for k, x in enumerate(nhom):
                    with open(x["path"], "rb") as f:
                        files["f%d" % k] = (x["name"], f.read())
                    media.append({"type": kieu, "media": "attach://f%d" % k})
                tg_call("sendMediaGroup", {"chat_id": chat, "media": json.dumps(media)}, files, timeout=300)
    except (ValueError, OSError) as e:
        return tgl_gui("⚠️ Gửi được %d/%d slide thì lỗi: %s" % (i - c if i else 0, len(sl), (str(e).split("|")[-1] if isinstance(e, ValueError) else "không đọc được file slide")))
    cap, ghim = tach_caption(read_caption(j))
    if cap:            # mỗi cái 1 tin riêng để giữ tin copy
        tgl_gui(cap)
    if ghim:
        tgl_gui(ghim)
    nut = [[{"text": "✅ Đã đăng xong", "callback_data": "dd:" + jid}, {"text": "📮 Bài khác", "callback_data": "bg:cho"}]]
    if not cap:
        nut.insert(0, [{"text": "✍ Viết caption", "callback_data": "cap:" + jid}])
    tgl_gui("Giữ tin để copy. Đăng xong bấm ✅." if cap else "Chưa có caption.", nut)


def tgl_cho_caption(jid, han=900):
    bd = now()
    while now() - bd < han:
        time.sleep(4)
        try:
            j, _ = parse_job(jid)
        except Exception:
            j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j or j.get("status") != "dang-chay":
            break
    j = load_job(jid) or {}
    cap, ghim = tach_caption(read_caption(j))
    if not cap:
        return tgl_gui("⚠️ Chưa viết được caption, fen mở app bấm Viết caption.")
    tgl_gui(cap)
    if ghim:
        tgl_gui(ghim)
    tgl_gui("Giữ tin để copy. Đăng xong bấm ✅.", [[{"text": "✅ Đã đăng xong", "callback_data": "dd:" + jid}, {"text": "📮 Bài khác", "callback_data": "bg:cho"}]])


def tgl_bam_bang(viec, tra):
    if viec == "bat":
        tra("Đã bật Remote")
        return tgl_cai({"bat": True})
    if viec == "tat":
        tra("Đã tắt Remote")
        return tgl_cai({"bat": False})
    if viec == "moi":
        tra("Đã làm mới")
        return tgl_bang(ep=True)
    if viec == "help":
        tra()
        return tgl_gui(TGL_HELP)
    if viec == "th":
        tra()
        return tgl_gui(tgl_tinh_hinh())
    if viec == "cho":               # chỉ xem: lúc Remote tắt vẫn xem được
        tra()
        return tgl_ds_cho()
    if not CFG.get("tg_lenh"):
        return tra("Remote đang tắt, bấm 🟢 Bật Remote trước")
    tra()
    if viec == "brief":
        return tgl_gui("✍ Nhắn chủ đề bài:",
                       markup={"force_reply": True, "input_field_placeholder": "Chủ đề bài…"})
    if viec == "qt":
        mid = tgl_gui("📏 Nhắn quy tắc mới (kèm ảnh được):",
                      markup={"force_reply": True, "input_field_placeholder": "Quy tắc mới…"})
        if mid:
            TGL["hoi_qt"] = mid


def hen_job(jid, data):
    """Bài đã hẹn: đổi giờ (hen_luc), sửa brief, hoặc làm ngay (lam_ngay)."""
    with LOCK:
        job = load_job(jid)
        if not job:
            raise ValueError("Không thấy bài")
        if job.get("status") != "hen":
            raise ValueError("Bài này không còn ở trạng thái hẹn")
        if data.get("brief") is not None:
            b = (data.get("brief") or "").strip()
            if len(b) < 5:
                raise ValueError("Brief trống")
            job["brief"] = b
            with open(os.path.join(job_dir(jid), "brief.txt"), "w", encoding="utf-8") as f:
                f.write(b)
        if data.get("hen_luc"):
            job["hen_luc"] = float(data["hen_luc"])
            job.pop("xep_hang", None)     # bài xếp hàng mà fen đặt giờ thì thành bài hẹn
        if data.get("lam_ngay"):
            if not resolve_claude():
                raise ValueError("Không tìm thấy Claude Code trên máy. Bấm Kiểm lại ở góc trên.")
            job.pop("hen_bao", None)
            job["hen_chay"] = now()
            start_run(job, build_prompt_dung(job), "dung", None, "Dựng bài")
            return {"ok": True, "chay": True}
        save_job(job)
    return {"ok": True}


# ---------- lịch: bài hẹn tới giờ thì dựng (lần lượt từng bài), viết caption xong thì đăng tiếp ----------
_LICH_KHOA = threading.Lock()


def _chay_lich():
    # luồng lich() 15 giây/lần và _reap (bài vừa xong) cùng gọi: chỉ 1 luồng xét hàng chờ mỗi lúc, không chạy trùng / quá giới hạn
    if not _LICH_KHOA.acquire(blocking=False):
        return
    try:
        _chay_lich_1()
    finally:
        _LICH_KHOA.release()


def _chay_lich_1():
    jobs = []
    for jid in sorted(os.listdir(JOBS)) if os.path.isdir(JOBS) else []:
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if j:
            jobs.append(j)
    # a) viết caption xong -> mở TikTok / gửi Telegram như fen đã bấm
    for j in jobs:
        if j.get("sau_caption") and j.get("status") in ("xong", "loi", "dung"):
            with LOCK:
                jj = load_job(j["id"])
                act = jj.pop("sau_caption", None) if jj else None
                if jj:
                    save_job(jj)
            if not act or jj.get("status") != "xong":
                continue
            if not tach_caption(read_caption(jj))[0]:
                log("sau caption %s: van chua co caption" % jj["id"])
                continue
            try:
                (mo_tiktok if act == "tiktok" else gui_telegram)(jj["id"])
                log("sau caption %s: da %s" % (jj["id"], act))
            except Exception as e:
                log("sau caption %s loi: %s" % (jj["id"], e))
                if CFG.get("telegram_token") and CFG.get("telegram_chat"):
                    _bao_tg("⚠️ Bài %s: viết caption xong nhưng chưa %s được: %s" % (ten_hien(jj)[0], "mở TikTok" if act == "tiktok" else "gửi Telegram", str(e).split("|")[-1]))
    # (a2 tự mở TikTok để hẹn đã bỏ 29/10 17h50: điều khoản TikTok cấm script tự động; fen tự mở bài, tự bấm Schedule)
    # b) bài hẹn tới giờ: làm dần, mỗi lúc tối đa `hen_toi_da` bài đang chạy (mặc định 1)
    den = sorted([j for j in jobs if j.get("status") == "hen" and (j.get("hen_luc") or 0) <= now()], key=lambda j: j.get("hen_luc") or 0)
    if not den:
        return
    dang = [j for j in jobs if j.get("status") == "dang-chay" and j.get("loai") not in VIEC_AN]
    if len(dang) >= int(CFG.get("hen_toi_da") or 1):
        return
    info = claude_info()
    if not resolve_claude() or info.get("login") is False:
        j = den[0]
        if not j.get("hen_bao"):   # báo 1 lần
            with LOCK:
                jj = load_job(j["id"])
                if jj:
                    jj["hen_bao"] = now()
                    save_job(jj)
            if CFG.get("telegram_token") and CFG.get("telegram_chat"):
                _bao_tg("⏰ Tới giờ dựng bài %s nhưng Claude Code trên máy shop %s. Mở app Poly Dựng Bài bấm Đăng nhập, bài sẽ tự chạy." % (ten_hien(j)[0], "chưa đăng nhập" if resolve_claude() else "không chạy được"))
        return
    with LOCK:
        jj = load_job(den[0]["id"])
        if not jj or jj.get("status") != "hen":
            return
        jj.pop("hen_bao", None)
        jj["hen_chay"] = now()
        try:
            start_run(jj, build_prompt_dung(jj), "dung", None, "Dựng bài (xếp hàng)" if jj.get("xep_hang") else "Dựng bài (hẹn %s)" % time.strftime("%H:%M %d/%m", time.localtime(jj["hen_luc"])))
            log("lich: bat dau bai %s %s" % ("xep hang" if jj.get("xep_hang") else "hen", jj["id"]))
        except Exception as e:
            jj["status"], jj["loi_chay"] = "loi", str(e)
            save_job(jj)
            log("lich: khong chay duoc %s: %s" % (jj["id"], e))


def lich():
    while True:
        time.sleep(CFG.get("lich_giay") or 15)
        try:
            _chay_lich()
        except Exception:
            log(traceback.format_exc())


TIKTOK_LINK = "https://www.tiktok.com/tiktokstudio/upload?from=webapp&tab=photo"   # fen chốt 29/10


def chrome_ho_so():
    """Các hồ sơ (profile) Chrome trên máy: [{dir, ten, email}] đọc từ Local State (chỉ đọc, không sửa gì của Chrome)."""
    if IS_MAC:
        goc = CFG.get("chrome_user_data") or os.path.expanduser("~/Library/Application Support/Google/Chrome")
    else:
        goc = CFG.get("chrome_user_data") or os.path.join(os.environ.get("LOCALAPPDATA", ""), r"Google\Chrome\User Data")
    ls = read_json(os.path.join(goc, "Local State"), {}) or {}
    info = ((ls.get("profile") or {}).get("info_cache") or {})
    ds = [{"dir": k, "ten": (v.get("name") or k), "email": v.get("user_name") or ""} for k, v in info.items() if isinstance(v, dict)]
    return sorted(ds, key=lambda x: (x["dir"] != "Default", x["dir"]))


def tiktok_cai(data=None):
    """Ô "Đăng TikTok" trong Kiểm máy: chọn Chrome / hồ sơ Chrome + link đăng (qua máy khác không mở nhầm)."""
    data = data or {}
    if data:
        keys = {}
        if "link" in data:
            link = (data.get("link") or "").strip()
            if link and not re.match(r"^https://(www\.)?tiktok\.com/", link):
                raise ValueError("Link đăng phải bắt đầu bằng https://www.tiktok.com/")
            keys["tiktok_upload"] = link
        if "ho_so" in data:
            hs = (data.get("ho_so") or "").strip()
            if hs and hs not in [x["dir"] for x in chrome_ho_so()]:
                raise ValueError("Không thấy hồ sơ Chrome này trên máy")
            keys["chrome_profile"] = hs
        if "chrome" in data:
            c = (data.get("chrome") or "").strip().strip('"')
            if IS_MAC:
                c = c.strip("'").rstrip("/")
                if c and not mac_chrome_ok(c):
                    raise ValueError("Không thấy Google Chrome ở đường dẫn này (vd /Applications/Google Chrome.app)")
            elif c and not (os.path.isfile(c) and c.lower().endswith(".exe")):
                raise ValueError("Không thấy file chrome.exe ở đường dẫn này")
            keys["chrome_path"] = c
        if keys:
            save_cfg_keys(keys)
            CFG.update(keys)
        if data.get("thu"):
            mo_chrome(CFG.get("tiktok_upload") or TIKTOK_LINK)
    return {"link": CFG.get("tiktok_upload") or "", "link_mac_dinh": TIKTOK_LINK, "chrome": tim_chrome() or "",
            "chrome_tu_chon": CFG.get("chrome_path") or "", "ho_so": chrome_ho_so(), "ho_so_chon": CFG.get("chrome_profile") or ""}


def mo_chrome(url):
    ch = tim_chrome()
    if not ch:
        raise ValueError(MAC_KHONG_CHROME if IS_MAC else "Không thấy Chrome trên máy. Mở Kiểm máy > Đăng TikTok, dán đường dẫn chrome.exe.")
    if IS_MAC:
        return mac_mo_chrome(ch, url)
    args = [ch] + (["--profile-directory=" + CFG["chrome_profile"]] if CFG.get("chrome_profile") else []) + [url]
    subprocess.Popen(args, creationflags=CREATE_NO_WINDOW if IS_WIN else 0)


def tim_chrome():
    if IS_MAC:
        return mac_tim_chrome()
    c = CFG.get("chrome_path")
    if c and os.path.isfile(c):
        return c
    for p in [os.path.join(os.environ.get(k, ""), r"Google\Chrome\Application\chrome.exe") for k in ("PROGRAMFILES", "PROGRAMFILES(X86)", "LOCALAPPDATA")]:
        if os.path.isfile(p):
            return p
    return shutil.which("chrome") or shutil.which("google-chrome")


def mo_tiktok(jid):
    job = load_job(jid)
    if not job:
        raise ValueError("Không thấy bài")
    if not list_slides(job.get("thu_muc_bai")):
        raise ValueError("Bài chưa có slide")
    # fen chốt 29/10: đăng bằng link này (mở thẳng tab Photos); Chrome / hồ sơ Chrome chọn ở Kiểm máy > Đăng TikTok
    goc = CFG.get("tiktok_upload") or TIKTOK_LINK
    url = goc + ("&" if "?" in goc else "?") + "poly=" + jid
    if not tim_chrome():
        raise ValueError(MAC_KHONG_CHROME if IS_MAC else "Không thấy Chrome trên máy. Mở Kiểm máy > Đăng TikTok, dán đường dẫn chrome.exe.")
    with LOCK:
        # bấm đúp trong 5 giây chỉ mở 1 tab
        cu = [x for x in ((load_job(jid) or job).get("da_gui") or []) if x.get("kieu") == "tiktok"]
        if cu and now() - cu[-1].get("t", 0) < 5:
            return {"ok": True, "trung": True}
        mo_chrome(url)
        _ghi_da_gui(jid, {"t": now(), "kieu": "tiktok"})
    return {"ok": True}


# gu fen chốt 29/10: hip hop. Kênh shop (tài khoản doanh nghiệp) chỉ có nhạc thương mại của TikTok, tên bài tiếng Anh,
# nên từ khoá tiếng Anh; "rap việt" gần như không có bài. Tiện ích lấy Favorites (fen thả tim) trước, rồi mới tìm.
NHAC_TU_KHOA = ["hip hop", "hip hop beat", "boom bap", "lofi hip hop", "trap beat"]


def nhac_so():
    return read_json(os.path.join(APP, "nhac-da-dung.json"), []) or []


def tiktok_nhac(data):
    """Tiện ích báo bài nhạc vừa chọn -> sổ nhac-da-dung.json (lần sau không chọn lại)."""
    ten = short(str(data.get("ten") or "").strip(), 120)
    if not ten:
        raise ValueError("thiếu tên nhạc")
    with LOCK:
        jid0 = str(data.get("id") or "")
        # mỗi bài chỉ giữ 1 bài nhạc: bấm Điền lại chọn bài khác thì bỏ bài cũ (chưa đăng) khỏi sổ, không "chiếm" bài đó
        so = [x for x in nhac_so() if not (jid0 and x.get("bai") == jid0 and not x.get("dang"))]
        so.append({"t": now(), "ten": ten, "tacgia": short(str(data.get("tacgia") or "").strip(), 80),
                   "tu_khoa": short(str(data.get("tu_khoa") or ""), 40), "bai": str(data.get("id") or "")[:64]})
        write_json(os.path.join(APP, "nhac-da-dung.json"), so[-1000:])
        jid = str(data.get("id") or "")
        if re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", jid):
            j = load_job(jid)
            if j:
                j["nhac"] = {"ten": ten, "tacgia": data.get("tacgia") or "", "t": now()}
                save_job(j)
    return {"ok": True}


def hen_dang_job(jid, data):
    """Hẹn giờ đăng TikTok: giờ này hiện sẵn trên nút ⏰ Hẹn giờ của tiện ích; fen bấm nút -> tiện ích chọn Schedule + ngày giờ,
    fen tự bấm Schedule (fen chốt 29/10 17h50). Trùng ngày với bài khác thì trả "trung" để app báo (luật 1 bài/ngày)."""
    with LOCK:
        j = load_job(jid)
        if not j:
            raise ValueError("Không thấy bài")
        if j.get("kenh") != "ipad":
            raise ValueError("Hẹn giờ đăng chỉ cho bài iPad (đăng bằng TikTok web). Bài Laptop đăng bằng app điện thoại.")
        if data.get("huy"):
            j.pop("hen_dang", None); j.pop("hen_dang_mo", None)
        else:
            try:
                luc = float(data.get("luc"))
            except Exception:
                raise ValueError("Giờ hẹn không đúng")
            if luc < now() + 20 * 60:
                raise ValueError("Hẹn đăng phải sau ít nhất 20 phút (TikTok cần tối thiểu 15 phút)")
            if luc > now() + 10 * 86400:
                raise ValueError("TikTok chỉ cho hẹn trong vòng 10 ngày")
            j["hen_dang"] = luc
            j.pop("hen_dang_mo", None)
        save_job(j)
    log("hen dang %s: %s" % (jid, "huy" if data.get("huy") else time.strftime("%H:%M %d/%m", time.localtime(j["hen_dang"]))))
    trung = _bai_theo_ngay(j.get("kenh"), jid).get(time.strftime("%Y-%m-%d", time.localtime(j["hen_dang"])), []) if j.get("hen_dang") else []
    return {"ok": True, "hen_dang": j.get("hen_dang"), "trung": trung}


def danh_dau_dang(jid, data):
    """Fen đánh dấu đã đăng tay (bài Laptop đăng bằng điện thoại, hoặc bài fen tự đăng)."""
    with LOCK:
        j = load_job(jid)
        if not j:
            raise ValueError("Không thấy bài")
        if data.get("bo"):
            j.pop("da_dang", None)
        else:
            j["da_dang"] = {"t": now(), "kenh": j.get("kenh"), "tay": True}
        save_job(j)
    return {"ok": True}


def quan_ly():
    """Trang Quản lý bài: chờ đăng / đã hẹn / đã đăng."""
    ds = []
    base = "/file?p="
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:300] if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j or j.get("loai") in VIEC_AN:
            continue
        sl = list_slides(j.get("thu_muc_bai")) if j.get("status") == "xong" else []
        ten, ngay = ten_hien(j)
        gui = [x for x in (j.get("da_gui") or []) if x.get("kieu") in ("tiktok", "telegram")]
        ds.append({"id": jid, "kenh": j.get("kenh"), "ten": ten, "ngay": ngay, "status": j.get("status"), "created": j.get("created"),
                   "hen_luc": j.get("hen_luc"), "hen_dang": j.get("hen_dang"), "da_dang": j.get("da_dang"), "dang_loi": j.get("dang_loi"),
                   "nhac": j.get("nhac"), "gui": gui[-1] if gui else None, "n": len(sl),
                   "bia": (base + quote(sl[0]["path"]) + "&t=%d" % sl[0]["mt"]) if sl else ""})
    return {"ds": ds, "now": now()}


def _bai_theo_ngay(kenh, tru=""):
    """Ngày "YYYY-MM-DD" -> ["20:00 Tên bài", ...] các bài của kênh đã hẹn / đã đăng (luật kênh 1 bài/ngày, fen chốt 29/10)."""
    out = {}
    for jid in (sorted(os.listdir(JOBS), reverse=True)[:300] if os.path.isdir(JOBS) else []):
        if jid == tru:
            continue
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if not j or j.get("kenh") != kenh or j.get("loai") in VIEC_AN:
            continue
        dd = j.get("da_dang") or {}
        t = dd.get("lich") or dd.get("t") or j.get("hen_dang")
        if not t or t < now() - 2 * 86400:
            continue
        out.setdefault(time.strftime("%Y-%m-%d", time.localtime(t)), []).append(
            "%s %s" % (time.strftime("%H:%M", time.localtime(t)), ten_hien(j)[0]))
    return out


def goi_y_hen(job):
    """Giờ gợi ý cho nút Hẹn giờ của tiện ích: giờ hẹn trong app (còn ≥ 16 phút), không có thì 20:00 / 21:00 / 21:30 / 22:00
    của ngày đầu tiên chưa có bài (giờ đăng kênh 19–22h, 1 bài/ngày)."""
    h = job.get("hen_dang") or 0
    if h and h >= now() + 16 * 60:
        return h
    co = _bai_theo_ngay(job.get("kenh"), job.get("id"))
    for d in range(0, 10):
        lt = time.localtime(now() + d * 86400)
        if time.strftime("%Y-%m-%d", lt) in co:
            continue
        for hh, mm in ((20, 0), (21, 0), (21, 30), (22, 0)):
            ts = time.mktime((lt.tm_year, lt.tm_mon, lt.tm_mday, hh, mm, 0, 0, 0, -1))
            if ts >= now() + 20 * 60:
                return ts
    return 0


def tiktok_dang(data):
    """Tiện ích báo đã bấm Đăng trên TikTok (hoặc đăng không được) -> ghi vào bài, báo Telegram nếu fen bật báo."""
    jid = str(data.get("id") or "")
    if not re.fullmatch(r"[0-9a-zA-Z_-]{6,64}", jid):
        raise ValueError("thiếu mã bài")
    ok, loi = bool(data.get("ok")), short(str(data.get("loi") or ""), 200)
    with LOCK:
        j = load_job(jid)
        if not j:
            raise ValueError("Không thấy bài")
        cu = j.get("da_dang") or {}
        bao = ok and now() - (cu.get("t") or 0) > 600      # tiện ích và lúc TikTok chuyển trang cùng báo: chỉ nhắn 1 lần
        if ok:
            gan = cu if now() - (cu.get("t") or 0) <= 600 else {}   # báo lần 2 (chuyển trang) thiếu lịch / brand thì giữ của lần 1
            j["da_dang"] = {"t": gan.get("t") or now(), "kenh": j.get("kenh"), "nhac": (j.get("nhac") or {}).get("ten", "")}
            try:
                if float(data.get("lich") or 0) > now():
                    j["da_dang"]["lich"] = float(data.get("lich"))     # TikTok giữ bài, tự đăng lúc này
                elif gan.get("lich"):
                    j["da_dang"]["lich"] = gan["lich"]
            except Exception:
                pass
            if "brand" in data or "brand" in gan:
                j["da_dang"]["brand"] = bool(data.get("brand")) if "brand" in data else gan.get("brand")   # đã bật Thương hiệu của bạn chưa
            so = nhac_so()
            for x in so:
                if x.get("bai") == jid:
                    x["dang"] = True          # bài nhạc này đã lên TikTok: Điền lại bài khác cũng không bỏ khỏi sổ
            write_json(os.path.join(APP, "nhac-da-dung.json"), so)
            if bao:
                lg = [t for t in (read_json(os.path.join(APP, "tiktok-da-dang.json"), []) or []) if now() - t < 86400]
                write_json(os.path.join(APP, "tiktok-da-dang.json"), lg + [now()])
        else:
            j["dang_loi"] = {"t": now(), "loi": loi}
        save_job(j)
    log("tiktok dang %s: %s" % (jid, "ok" if ok else "loi " + loi))
    if bao and CFG.get("telegram_token") and CFG.get("telegram_chat") and CFG.get("telegram_bao", True) is not False:
        lich = (j.get("da_dang") or {}).get("lich")
        threading.Thread(target=_bao_tg, args=(("🗓 Đã hẹn đăng TikTok %s: %s" % (time.strftime("%H:%M %d/%m", time.localtime(lich)), ten_hien(j)[0])) if lich else ("✅ Đã đăng TikTok: %s" % ten_hien(j)[0]),), daemon=True).start()
    return {"ok": True}


def tiktok_data(jid):
    """Extension Poly TikTok lấy slide + caption của bài để điền vào TikTok Studio."""
    job = load_job(jid)
    if not job:
        raise ValueError("Không thấy bài")
    k = CFG["kenh"].get(job["kenh"], {})
    base = "http://127.0.0.1:%d" % CFG["port"]
    return {
        "id": jid, "kenh": job["kenh"], "handle": k.get("handle", ""), "ten": ten_hien(job)[0],
        "caption": tach_caption(read_caption(job))[0],
        "brand": brand_bai(job)["bat"],   # Tiết lộ nội dung → Your brand: mặc định tắt, chỉ bật khi fen bấm Bật ở ô Đăng bài (30/10 12h54)
        # chọn nhạc: gu hip hop, xoay vòng từ khoá, bỏ bài đã dùng
        "nhac_tim": (lambda ds, k: ds[k:] + ds[:k])(list(CFG.get("nhac_tu_khoa") or NHAC_TU_KHOA), len(nhac_so()) % max(1, len(CFG.get("nhac_tu_khoa") or NHAC_TU_KHOA))),
        # fen chốt 29/10 17h50: tiện ích KHÔNG tự bấm Post/Schedule (điều khoản TikTok cấm script tự động); nút Hẹn giờ trong khung Poly
        # chỉ chọn Schedule + ngày giờ, fen tự bấm Schedule. Giờ gợi ý: giờ hẹn trong app, không có thì 19–22h ngày còn trống (1 bài/ngày).
        "hen_dang": job.get("hen_dang") or 0, "goi_y_hen": goi_y_hen(job),
        "ngay_co_bai": _bai_theo_ngay(job.get("kenh"), jid),
        "nhac_da_dung": [re.sub(r"\s+", " ", "%s · %s" % (x.get("ten", ""), x.get("tacgia", ""))).strip().lower() for x in nhac_so()[-300:] if x.get("dang")],   # fen chốt 29/10 17h02: chỉ bài nhạc đã ĐĂNG mới tính là trùng
        "files": [{"name": x["name"], "url": base + "/file?p=" + quote(x["path"]) + "&t=%d" % x["mt"]} for x in list_slides(job.get("thu_muc_bai"))],
    }


def tiktok_soi(data):
    """Tiện ích Poly TikTok gửi cấu trúc trang Tải lên (chỉ tên nút / tab / ô nhập, chữ ngắn) -> _soi/*.json."""
    d = os.path.join(APP, "_soi")
    os.makedirs(d, exist_ok=True)
    nhan = re.sub(r"[^\w-]", "", str(data.get("nhan") or "trang"))[:20] or "trang"
    fn = os.path.join(d, "tiktok-%s-%s.json" % (time.strftime("%m%d-%H%M%S"), nhan))
    items = data.get("items") or []
    if not isinstance(items, list):
        raise ValueError("sai dạng")
    write_json(fn, {"t": now(), "nhan": nhan, "url": str(data.get("url") or "")[:200], "ban": str(data.get("ban") or ""), "items": items[:3000]})
    cu = sorted(f for f in os.listdir(d) if f.startswith("tiktok-"))
    for f in cu[:-30]:          # giữ 30 bản mới nhất (chuyển bản cũ vào _to_delete, không xoá hẳn)
        try:
            os.makedirs(os.path.join(APP, "_to_delete", "_soi"), exist_ok=True)
            os.replace(os.path.join(d, f), os.path.join(APP, "_to_delete", "_soi", f))
        except Exception:
            pass
    return {"ok": True}


def job_view(jid, since=0):
    job, st = parse_job(jid)
    if not job:
        return None
    with LOCK:
        ev = st["events"][since:]
        tasks = [dict(id=k, **st["tasks"][k]) for k in st["task_order"] if k in st["tasks"]]
        last_n = (job.get("runs") or [{}])[-1].get("n")
        if st.get("task_run") is not None and st.get("task_run") != last_n:
            tasks = []
        results = list(st["results"])
    final = ""
    for r in reversed(results):
        if r["ok"] and r["text"].strip():
            final = r["text"]
            break
    hoi = []
    if final:
        final = re.sub(r"^\s*THU_MUC_BAI\s*=.*$", "", final, flags=re.M).strip()
        hoi, final = tach_hoi(final)
    # câu hỏi chỉ hiện khi lượt cuối là lượt có câu hỏi và fen chưa trả lời lượt đó
    run_hoi = next((r["run"] for r in reversed(results) if r["ok"] and r["text"].strip()), None)
    if hoi and (job.get("da_tra_loi") or {}).get(str(run_hoi)):
        hoi = []
    run = job["runs"][-1] if job.get("runs") else None
    ly_do = ""
    if job.get("status") in ("loi", "dung"):
        with LOCK:
            for e in reversed(st["events"]):
                if e["k"] == "error":
                    ly_do = re.sub(r"^Claude dừng giữa chừng\.\s*", "", e["x"]) or e["x"]
                    break
        if not ly_do and job.get("status") == "loi" and run:
            err = read_text(os.path.join(job_dir(jid), "stderr-%d.txt" % run["n"]))[-800:]
            if err.strip():
                ly_do = short(explain_err(err), 300)
        if not ly_do and job.get("loi_chay"):
            ly_do = job["loi_chay"]
    return {
        "ly_do": ly_do,
        "job": dict({k: job.get(k) for k in ("id", "kenh", "tieu_de", "ten_bai", "ngay_dang", "brief", "ghi_chu", "status", "created", "thu_muc_bai", "session_id", "anh", "sua", "model", "hen_luc", "sau_caption", "hen_bao", "nhac", "da_dang", "dang_loi", "hen_dang", "xep_hang")},
                    **dict(zip(("tieu_de", "ngay_dang"), ten_hien(job)))),
        "run": run and {"n": run["n"], "kind": run["kind"], "started": run["started"], "ended": run.get("ended")},
        "runs": len(job.get("runs", [])),
        "run_list": [{"n": r["n"], "kind": r["kind"], "label": r.get("label") or r["kind"], "started": r["started"], "ended": r.get("ended"), "model": r.get("model") or ""} for r in job.get("runs", [])],
        "idle": round(now() - st.get("last_new", now())),
        "events": ev, "next": since + len(ev), "tasks": tasks, "gen": st.get("gen"),
        "final": final, "hoi": hoi, "hoi_luot": run_hoi, "slides": list_slides(job.get("thu_muc_bai")),
        "caption": read_caption(job), "da_gui": job.get("da_gui") or [], "brand": brand_bai(job),
        "telegram": bool(CFG.get("telegram_token") and CFG.get("telegram_chat")), "telegram_ten": CFG.get("telegram_ten") or "",
        "loai": job.get("loai") or "", "brief_viet": read_text(os.path.join(job_dir(jid), "brief-viet.txt")).replace("\ufeff", "").strip() if job.get("loai") == "brief" else "",
        "now": now(),
    }


# ---------- tên bài hiện ở danh sách: tiêu đề bìa, không phải ngày ----------
_LA_NGAY = re.compile(r"^\s*(t\d{1,2}\s*)?\d{1,2}\s*[/.\-]\s*\d{1,2}(\s*[/.\-]\s*\d{2,4})?\s*$", re.I)
_NHAN_SLIDE = re.compile(r"^(slide\s*0?\d+|s\d+|bìa|bia|thumbnail|thumb|cover|tiêu đề(\s*bìa)?|tieu de(\s*bia)?|title|slide cuối|phụ đề|phu de)"
                         r"(\s*[\(\[–-]?\s*(bìa|bia|thumbnail|cover)\s*[\)\]]?)?\s*([:.\-–]\s*|$)", re.I)
_TEN_RIENG = {"ipad": "iPad", "iphone": "iPhone", "macbook": "MacBook", "imac": "iMac", "thinkpad": "ThinkPad",
              "zbook": "ZBook", "elitebook": "EliteBook", "probook": "ProBook", "tiktok": "TikTok", "poly": "Poly",
              "apple": "Apple", "windows": "Windows", "dell": "Dell", "hp": "HP", "asus": "Asus", "acer": "Acer",
              "lenovo": "Lenovo", "rtx": "RTX", "ssd": "SSD", "ram": "RAM", "oled": "OLED", "wifi": "Wifi", "gb": "GB",
              "air": "Air", "pro": "Pro", "max": "Max", "gen": "Gen", "pencil": "Pencil", "surface": "Surface"}


def _bot_hoa(s, dau=True):
    """Câu VIẾT HOA (tiêu đề bìa) -> chữ thường dễ đọc, giữ tên riêng (iPad, MacBook...)."""
    chu = [c for c in s if c.isalpha()]
    if not chu or sum(c.isupper() for c in chu) < 0.6 * len(chu):
        return s
    t = s.lower()
    t = re.sub(r"[a-z]+", lambda m: _TEN_RIENG.get(m.group(0), m.group(0)), t)
    t = re.sub(r"\b(m\d|a\d{2}|\d+g)\b", lambda m: m.group(0).upper(), t)  # M4, A16, 5G
    if dau and not re.match(r"i[A-Z]", t):
        t = t[:1].upper() + t[1:]
    return t


def ten_tu_brief(brief):
    """Tiêu đề bìa = dòng đầu brief (bỏ nhãn "Slide 1:", "Bìa:"); dòng 2 ngắn, không phải nhãn slide thì ghép."""
    ls = [l.strip(" #*-•\t") for l in (brief or "").splitlines()]
    ls = [l for l in ls if l]
    while ls and not _NHAN_SLIDE.sub("", ls[0]).strip():  # dòng chỉ có nhãn "SLIDE 1" / "Bìa:"
        ls = ls[1:]
    if not ls:
        return ""
    a = _bot_hoa(_NHAN_SLIDE.sub("", ls[0]))
    if (len(ls) > 1 and len(a) <= 30 and a.rstrip()[-1:] not in "?!" and not _NHAN_SLIDE.match(ls[1])
            and len(ls[1]) <= 40 and not _LA_NGAY.match(ls[1])):
        a = a.rstrip() + ("" if a.rstrip()[-1:] in ",.:;" else ",") + " " + _bot_hoa(ls[1], dau=False)
    return short(a, 70)


def ten_hien(job):
    """(tên hiện, ngày đăng). Fen hay gõ ngày vào ô Tên bài: khi đó lấy tiêu đề bìa làm tên, ngày làm ngày đăng."""
    ten, ngay = (job.get("ten_bai") or "").strip(), (job.get("ngay_dang") or "").strip()
    if ten and _LA_NGAY.match(ten):
        ngay = ngay or ten
        ten = ""
    m = re.search(r"(\d{1,2})\s*[/.\-]\s*(\d{1,2})", ngay)
    if m:
        ngay = "%d/%02d" % (int(m.group(1)), int(m.group(2)))   # "29.10", "t10 29/10" -> "29/10"
    return (ten or ten_tu_brief(job.get("brief")) or job.get("tieu_de") or "Bài mới"), ngay


def list_jobs():
    out = []
    if not os.path.isdir(JOBS):
        return out
    for jid in sorted(os.listdir(JOBS), reverse=True)[:200]:
        job = read_json(os.path.join(JOBS, jid, "job.json"))
        if not job or job.get("loai") in VIEC_AN:   # việc "Viết brief", "Ghi quy tắc" không phải bài
            continue
        if job.get("status") == "dang-chay":
            try:
                job, _ = parse_job(jid)
            except Exception:
                pass
        it = {k: job.get(k) for k in ("id", "kenh", "tieu_de", "status", "created", "ngay_dang", "hen_luc", "hen_dang", "hen_dang_mo", "da_dang", "xep_hang")}
        it["tieu_de"], it["ngay_dang"] = ten_hien(job)
        lr = (job.get("runs") or [{}])[-1]
        it["started"], it["ended"] = lr.get("started"), lr.get("ended")
        gui = [x for x in (job.get("da_gui") or []) if x.get("kieu") in ("tiktok", "telegram")]
        it["gui"] = gui[-1] if gui else None
        it["bia"] = bia_bai(job) if job.get("status") == "xong" else ""
        out.append(it)
    return out


_BIA = {}


def bia_bai(job):
    """Ảnh bìa nhỏ cho cột trái (slide 1). Nhớ theo giờ sửa thư mục bài để không đọc thư mục mỗi 5 giây."""
    f = job.get("thu_muc_bai")
    if not f:
        return ""
    try:
        mt = os.path.getmtime(f)
    except OSError:
        return ""
    c = _BIA.get(f)
    if c and c[0] == mt:
        return c[1]
    sl = list_slides(f)
    url = ("/file?p=" + quote(sl[0]["path"]) + "&t=%d" % sl[0]["mt"]) if sl else ""
    _BIA[f] = (mt, url)
    return url


# ---------- mở bài có sẵn (làm trước khi có app / làm ở tab Design): để gửi Telegram, đăng TikTok, sửa ----------
_TU = re.compile(r"iPad|iPhone|MacBook|ThinkPad|EliteBook|ZBook|[A-Z]\d+(?:GB|TB)?|\d+(?:GB|TB|inch|Tr(?![a-z])|G(?![a-z]))?|[A-Z]?[a-z]+?(?=iPad|iPhone|[^a-z]|$)|[A-Z]+(?![a-z])")


def ten_thu_muc(fn):
    """T10_5ThaoTacLaptop_28-10 -> ("5 Thao Tac Laptop", "28/10")."""
    ps = fn.split("_")
    ngay = ""
    if len(ps) >= 3 and re.fullmatch(r"\d{1,2}-\d{1,2}", ps[-1]):
        a, b = ps[-1].split("-")
        ngay, ps = "%d/%02d" % (int(a), int(b)), ps[:-1]
    if ps and re.fullmatch(r"T\d{1,2}", ps[0]):
        ps = ps[1:]
    giua = " ".join(ps)
    ten = " ".join(_TU.findall(giua)) or giua
    return ten, ngay


def bai_co_san():
    da = {}
    for jid in (os.listdir(JOBS) if os.path.isdir(JOBS) else []):
        j = read_json(os.path.join(JOBS, jid, "job.json"))
        if j and j.get("thu_muc_bai"):
            da[khoa_thu_muc(j["thu_muc_bai"])] = jid
    out = []
    for kenh, root in (CFG.get("thu_muc_bai") or {}).items():
        if kenh not in CFG["kenh"] or not root or not os.path.isdir(root):
            continue
        for fn in os.listdir(root):
            f = os.path.join(root, fn)
            if not re.match(r"^T\d{1,2}_", fn) or not os.path.isdir(f):
                continue
            sl = list_slides(f)
            if not sl:
                continue
            ten, ngay = ten_thu_muc(_nfc(fn) if IS_MAC else fn)
            out.append({"kenh": kenh, "ten": ten, "ngay": ngay, "thu_muc": fn, "n": len(sl),
                        "mt": max(x["mt"] for x in sl), "job": da.get(khoa_thu_muc(f))})
    out.sort(key=lambda x: -x["mt"])
    return out[:60]


def mo_bai_co_san(data):
    kenh, fn = data.get("kenh"), data.get("thu_muc") or ""
    root = (CFG.get("thu_muc_bai") or {}).get(kenh)
    if not root or not re.fullmatch(r"T\d{1,2}_[^\\/:*?\"<>|]+", fn):
        raise ValueError("Không thấy thư mục bài")
    f = os.path.join(root, fn)
    if not os.path.isdir(f) or not list_slides(f):
        raise ValueError("Thư mục này chưa có slide (slide-01.png …)")
    with LOCK:
        for x in bai_co_san():
            if x["kenh"] == kenh and x["thu_muc"] == fn and x["job"]:
                return {"id": x["job"]}
        ten, ngay = ten_thu_muc(_nfc(fn) if IS_MAC else fn)
        jid = time.strftime("%Y%m%d-%H%M%S-") + uuid.uuid4().hex[:4]
        os.makedirs(job_dir(jid), exist_ok=True)
        save_job({"id": jid, "kenh": kenh, "brief": "", "ten_bai": ten, "tieu_de": ten, "ngay_dang": ngay,
                  "ghi_chu": "", "created": now(), "status": "xong", "runs": [], "co_san": True, "thu_muc_bai": f})
    return {"id": jid}


def khoa_thu_muc(f):
    """Khoá so 2 đường dẫn thư mục bài (Mac: thêm chuẩn hoá NFC, tên tiếng Việt Finder lưu NFD)."""
    if IS_MAC:
        return _nfc(os.path.realpath(f))
    return os.path.normcase(os.path.realpath(f))


def allowed_path(p):
    if IS_MAC:
        return mac_allowed_path(p)
    try:
        rp = os.path.realpath(p)
    except Exception:
        return False
    roots = [JOBS, CFG.get("thu_muc_lam_viec") or ""] + list(CFG.get("thu_muc_bai", {}).values())
    for r in roots:
        if r and os.path.isdir(r):
            rr = os.path.realpath(r)
            if os.path.normcase(rp).startswith(os.path.normcase(rr + os.sep)) or os.path.normcase(rp) == os.path.normcase(rr):
                return True
    return False


# ---------------------------------------------------------------- máy Mac: Terminal, Chrome, luật chung, hàng chờ Photoshop
# (fen 30/10: Mac chạy đủ như máy shop: viết brief, dựng bài bằng Photoshop trên Mac, gửi Telegram, tiện ích TikTok)
MAC_KHONG_CHROME = ("Không thấy Google Chrome trên máy. Cài Chrome vào thư mục Ứng dụng (Applications), "
                    "hoặc mở Kiểm máy > Đăng TikTok, dán đường dẫn Google Chrome.app.")


def mac_dir(*a):
    """Thư mục _mac của app: file máy Mac tự tạo (lệnh python, cửa sổ đăng nhập, pid, nhật ký). Không đưa lên repo."""
    d = os.path.join(APP, "_mac", *a)
    os.makedirs(d, exist_ok=True)
    return d


def mac_lenh(args):
    import shlex
    return " ".join(shlex.quote(str(x)) for x in args)


def mac_mo_terminal(ten, dong):
    """Mở 1 cửa sổ Terminal chạy vài lệnh (thay cửa sổ đen của Windows): ghi _mac/<ten>.command rồi mở bằng Terminal."""
    f = os.path.join(mac_dir(), ten + ".command")
    bo = [] if CFG.get("dung_api_key") is True else ["unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN"]   # như env_claude()
    with open(f, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("#!/bin/bash\n# Poly Dung Bai tu tao luc %s\nclear\n%s\n" % (time.strftime("%d/%m %H:%M"), "\n".join(bo + list(dong))))
    os.chmod(f, 0o755)
    subprocess.Popen(["open", "-a", "Terminal", f], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


MAC_TEN_GOC = {
    "C:/Users/Dao/Pictures/PolySocial/_tu-chay": "hàng chờ Photoshop",
    "E:/Tool/poly-dung-bai": "app Poly Dựng Bài",
    "E:/Social Claude": "bộ luật, bộ dựng, bài Laptop / iPad, ảnh tải về",
    "C:/Users/Dao": "thư mục user (Downloads, Pictures, .claude)",
}
MAC_GHI_CHU = """

TRÊN MÁY NÀY: MacBook của fen (macOS). App Poly Dựng Bài tự thêm đoạn này, máy shop Windows không có.
Luật, plugin poly-carousel, sổ dựng và lệnh mẫu viết cho máy shop Windows. Đường dẫn trên máy này:
%s
- Thư mục khác của máy shop (E:\\Tool\\Anh, ảnh Telegram Desktop, Screenshots của Windows…) không có trên máy này: bỏ qua, không đi tìm.
File nào ghi đường dẫn E:/… hay C:\\Users\\Dao\\… thì hiểu theo bảng trên; trong lệnh và dòng THU_MUC_BAI= luôn ghi đường dẫn thật của máy này (dấu /).
- Sửa file luật, sổ dựng, plugin, lệnh mẫu của app (nút Quy tắc, "Chung", ghi luật rút ra): đường dẫn viết trong các file đó giữ kiểu máy shop (E:/Social Claude/…), không ghi đường dẫn Mac vào (các file này dùng chung với máy shop).
- Lệnh: Bash của macOS, không cmd, không PowerShell. Gõ python "…" như luật được (app trỏ lệnh python sang python3 của app).
- Photoshop: vẫn chỉ qua hàng chờ (chay_ps.py, tach_nen_ps.py tự biết hàng chờ của máy này qua biến POLY_TU_CHAY). Bộ canh hàng chờ trên Mac tự đổi đường dẫn E:/… trong file .jsx sang đường dẫn Mac. Không tự gọi osascript, không mở hay điều khiển Photoshop / app nào bằng tay (luật 11b).
- Hàng chờ không chạy (chay_ps.py báo CANH BAO hay QUA GIO): báo fen 1 câu "fen mở lại app Poly Dựng Bài và mở Photoshop", không tự xử lý.
- Chụp màn hình bài mẹo: máy này là Mac, không chụp màn hình máy này cho bài mẹo Windows hay iPad; dùng ảnh fen gửi hoặc ảnh tạm, hỏi fen bằng HOI_FEN (luật 11b, 18).
- Font: Mac không có Segoe UI. Log Photoshop ghi font đã dùng khác UTM-Cookies / UTMAvoBold / UTM-Avo / Source Serif thì máy này thiếu font: thêm 1 dòng cuối bài báo fen cài font.
"""


def mac_luat_chung(src, dst):
    """Luật chung cho lượt chạy trên Mac: đường dẫn máy shop đổi sang Mac + đoạn "TRÊN MÁY NÀY" (bảng đổi đường dẫn, lệnh macOS)."""
    bang = mac_bang_cfg()
    dong = "\n".join("- %s (%s) = %s : %s" % (w, w.replace("/", "\\"), m, MAC_TEN_GOC.get(w, "")) for w, m in bang)
    t = read_text(src).replace("\r\n", "\n")
    with open(dst, "w", encoding="utf-8", newline="\n") as f:
        f.write(mac_doi(t, bang).rstrip() + MAC_GHI_CHU % dong)
    return dst


def mac_env(env):
    """Môi trường Claude trên Mac: lệnh python (luật ghi python "…", Mac chỉ có python3), hàng chờ Photoshop của máy này,
    chỗ cài hay gặp của node / claude / Homebrew (app mở từ Finder có thể thiếu PATH)."""
    b = mac_dir("bin")
    py = os.path.join(b, "python")
    noi = '#!/bin/sh\n# Poly Dung Bai: may Mac khong co lenh python -> python3 cua app\nexec %s "$@"\n' % mac_lenh([sys.executable or "python3"])
    try:
        if read_text(py) != noi:
            with open(py, "w", encoding="utf-8", newline="\n") as f:
                f.write(noi)
        os.chmod(py, 0o755)
    except OSError as e:
        log("mac: khong ghi duoc lenh python: %s" % e)
    cu = [x for x in (env.get("PATH") or "/usr/bin:/bin:/usr/sbin:/sbin").split(os.pathsep) if x and x != b]
    them = [x for x in ("/opt/homebrew/bin", "/usr/local/bin", os.path.expanduser("~/.local/bin")) if os.path.isdir(x) and x not in cu]
    env["PATH"] = os.pathsep.join([b] + cu + them)
    env["POLY_TU_CHAY"] = CFG.get("tu_chay") or MAC_HANG_CHO
    env["POLY_PYTHON"] = sys.executable or "python3"
    return env


def mac_chrome_ok(c):
    c = os.path.expanduser(c or "")
    if c.endswith(".app"):
        return os.path.isdir(os.path.join(c, "Contents", "MacOS"))
    return os.path.isfile(c) and os.access(c, os.X_OK)


def mac_tim_chrome():
    c = CFG.get("chrome_path")
    if c and mac_chrome_ok(c):
        return os.path.expanduser(c)
    for p in ("/Applications/Google Chrome.app", os.path.expanduser("~/Applications/Google Chrome.app")):
        if mac_chrome_ok(p):
            return p
    return shutil.which("google-chrome") or shutil.which("chrome")


def mac_mo_chrome(ch, url):
    hs = ["--profile-directory=" + CFG["chrome_profile"]] if CFG.get("chrome_profile") else []
    if ch.endswith(".app"):
        # -n: Chrome đang mở vẫn nhận đúng hồ sơ + link (không có -n thì Mac bỏ --args khi Chrome đang chạy)
        args = ["open", "-na", ch, "--args"] + hs + [url]
    else:
        args = [ch] + hs + [url]
    subprocess.Popen(args, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)


def mac_allowed_path(p):
    """Như allowed_path, so sau khi chuẩn hoá NFC (Mac không phân biệt NFC / NFD khi mở file nhưng chuỗi khác nhau)."""
    try:
        rp = _nfc(os.path.realpath(p))
    except Exception:
        return False
    for r in [JOBS, CFG.get("thu_muc_lam_viec") or ""] + list(CFG.get("thu_muc_bai", {}).values()):
        if r and os.path.isdir(r):
            rr = _nfc(os.path.realpath(r)).rstrip("/")
            if rp == rr or rp.startswith(rr + "/"):
                return True
    return False


_MAC_TV = {"t": 0, "thieu": None}


def mac_thu_vien_thieu():
    """Thư viện ảnh các công cụ soi / tách nền cần (như cai-dat.ps1 máy shop): pillow, numpy, scipy, opencv-python."""
    if _MAC_TV["thieu"] is not None and now() - _MAC_TV["t"] < 120:
        return _MAC_TV["thieu"]
    ten = {"PIL": "pillow", "numpy": "numpy", "scipy": "scipy", "cv2": "opencv-python"}
    try:
        r = subprocess.run([sys.executable, "-c", "import importlib.util as u\nprint(' '.join(m for m in ('PIL', 'numpy', 'scipy', 'cv2') if u.find_spec(m) is None))"],
                           capture_output=True, text=True, timeout=30)
        thieu = [ten[m] for m in r.stdout.split() if m in ten] if r.returncode == 0 else ["?"]
    except Exception:
        thieu = ["?"]
    _MAC_TV.update(t=now(), thieu=thieu)
    return thieu


def mac_san_sang(ds, tuoi):
    """Ô Kiểm máy trên Mac: chữ đúng máy Mac + Python / thư viện ảnh + thư mục đang dùng."""
    home = os.path.expanduser("~")
    for x in ds:
        if x["ma"] == "ps":
            x["ten"] = "Photoshop tự chạy (hàng chờ)"
            if not x["ok"]:
                x["ghi"] = "hàng chờ chưa chạy: tắt app rồi mở lại bằng Poly Dung Bai. Có bài là Photoshop tự mở"
        elif x["ma"] == "chrome" and not x["ok"]:
            x["ghi"] = "không thấy Google Chrome: cài Chrome, hoặc dán đường dẫn ở Đăng TikTok bên dưới"
        elif x["ma"] == "plugin" and not x["ok"]:
            x["ghi"] = "không thấy %s: chép thư mục social-claude của app thành ~/Social Claude" % (CFG.get("plugin_dir") or "plugin").replace(home, "~")
    thieu = mac_thu_vien_thieu()
    ds.append({"ma": "python", "ten": "Python + thư viện ảnh", "ok": not thieu, "can": False,
               "ghi": ("Python %d.%d, đủ thư viện" % sys.version_info[:2]) if not thieu else
               "chưa cài thư viện ảnh (Claude cần để soi ảnh, tách nền): tắt app, mở lại bằng Poly Dung Bai, bấm Cài"})
    goc, q = CFG.get("thu_muc_lam_viec") or "", CFG.get("tu_chay") or ""
    ds.append({"ma": "thu_muc", "ten": "Thư mục trên máy Mac", "ok": os.path.isdir(os.path.join(goc, "_bo-dung-design")), "can": False,
               "ghi": "bộ luật + bài: %s · hàng chờ Photoshop: %s (đổi trong config.json)" % (goc.replace(home, "~", 1), q.replace(home, "~", 1))})


def mac_tu_chay_file():
    for g in (CFG.get("thu_muc_lam_viec") or "", os.path.join(APP, "social-claude")):
        f = os.path.join(g, "_bo-dung-design", "tu-chay", "poly-tu-chay-mac.py")
        if os.path.isfile(f):
            return f
    return ""


def mac_canh_hang_cho():
    """Như scheduled task 5 phút + Startup của máy shop: bộ canh hàng chờ Photoshop (poly-tu-chay-mac.py) chưa chạy / chết
    (dang-chay.txt cũ hơn 20 giây) thì bật lại. Bộ canh có khoá nên bật thừa cũng chỉ 1 bản chạy."""
    con = []
    while True:
        con = [p for p in con if p.poll() is None]      # dọn tiến trình con đã thoát (không để zombie)
        try:
            q = CFG.get("tu_chay") or MAC_HANG_CHO
            try:
                tuoi = now() - os.path.getmtime(os.path.join(q, "dang-chay.txt"))
            except OSError:
                tuoi = None
            f = mac_tu_chay_file()
            if f and (tuoi is None or tuoi > 20):
                os.makedirs(q, exist_ok=True)
                with open(os.path.join(q, "poly-tu-chay-mac.log"), "ab") as lg:
                    con.append(subprocess.Popen([sys.executable, f, "--hang-cho", q, "--goc", CFG.get("thu_muc_lam_viec") or MAC_GOC, "--app", APP],
                                                stdin=subprocess.DEVNULL, stdout=lg, stderr=lg, cwd=q, start_new_session=True))
                log("mac: bat bo canh hang cho Photoshop %s" % q)
        except Exception:
            log(traceback.format_exc())
        time.sleep(CFG.get("mac_canh_giay") or 30)


def mac_chuan_bi():
    """Mở app trên Mac (fen 30/10 "set tự cài đặt trong máy khỏi hỏi luôn"): lần đầu ghi 2 thư mục gốc vào config.json,
    chép bộ luật (social-claude của app) thành ~/Social Claude nếu chưa có, tạo Laptop / iPad / hàng chờ, bật bộ canh hàng chờ."""
    p = os.path.join(APP, "config.json")
    user = read_json(p, None) if os.path.exists(p) else {}
    if isinstance(user, dict):      # config.json sai cú pháp: không ghi đè (save_cfg_keys cũng chặn)
        keys = {k: CFG[k] for k in ("thu_muc_lam_viec", "tu_chay") if not user.get(k) or la_duong_dan_win(user.get(k))}
        if keys:
            try:
                save_cfg_keys(keys)
                log("mac: ghi thu muc vao config.json: %s" % keys)
            except Exception as e:
                log("mac: chua ghi duoc config.json: %s" % e)
    goc, q = CFG["thu_muc_lam_viec"], CFG["tu_chay"]
    nguon = os.path.join(APP, "social-claude")
    try:
        if not os.path.isdir(os.path.join(goc, "_bo-dung-design")) and os.path.isdir(os.path.join(nguon, "_bo-dung-design")) \
                and khoa_thu_muc(nguon) != khoa_thu_muc(goc):
            os.makedirs(goc, exist_ok=True)
            for fn in sorted(os.listdir(nguon)):      # chỉ chép cái chưa có, không ghi đè file nào
                s, dd = os.path.join(nguon, fn), os.path.join(goc, fn)
                if os.path.lexists(dd):
                    continue
                if os.path.isdir(s):
                    shutil.copytree(s, dd)
                else:
                    shutil.copy2(s, dd)
            log("mac: chep bo luat %s -> %s" % (nguon, goc))
        for sub in ("Laptop", "iPad", "Anh tai ve"):
            os.makedirs(os.path.join(goc, sub), exist_ok=True)
        os.makedirs(os.path.join(q, "_da-chay"), exist_ok=True)
        with open(os.path.join(mac_dir(), "hang-cho.txt"), "w", encoding="utf-8") as f:   # Tat Poly Dung Bai.command đọc
            f.write(q + "\n")
    except Exception:
        log(traceback.format_exc())
    threading.Thread(target=mac_canh_hang_cho, daemon=True).start()


# ---------------------------------------------------------------- HTTP
class H(BaseHTTPRequestHandler):
    server_version = "PolyDungBai/1.0"

    def log_message(self, *a):
        pass

    def send(self, code, body, ctype="application/json; charset=utf-8", extra=None):
        if isinstance(body, (dict, list)):
            body = json.dumps(body, ensure_ascii=False).encode("utf-8")
        elif isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    def body(self):
        n = int(self.headers.get("Content-Length") or 0)
        if n > 400 * 1024 * 1024:
            raise ValueError("Gửi quá lớn")
        raw = self.rfile.read(n) if n else b"{}"
        return json.loads(raw.decode("utf-8") or "{}")

    def local_only(self):
        # chi nhan tu chinh may nay; chan trang web khac goi vao
        host = (self.headers.get("Host") or "").split(":")[0]
        if host not in ("127.0.0.1", "localhost"):
            self.send(403, {"err": "chỉ mở trên máy này"})
            return False
        origin = self.headers.get("Origin")
        # extension Poly TikTok (Chrome) chỉ được đọc slide + caption của bài, không gọi lệnh khác
        if origin and origin.startswith("chrome-extension://") and self.command == "GET" and \
                re.match(r"^/(api/tiktok/[\w-]+|file)(\?|$)", self.path):
            return True
        # ... và gửi cấu trúc trang TikTok (tên nút, tab, ô nhập) để Claude soi giao diện thật
        if origin and origin.startswith("chrome-extension://") and self.command == "POST" and self.path in ("/api/tiktok-soi", "/api/tiktok-nhac", "/api/tiktok-dang"):
            return True
        if origin and not re.match(r"^http://(127\.0\.0\.1|localhost):%d$" % CFG["port"], origin):
            self.send(403, {"err": "origin lạ"})
            return False
        return True

    def do_GET(self):
        if not self.local_only():
            return
        u = urlparse(self.path)
        q = parse_qs(u.query)
        try:
            if u.path in ("/", "/index.html"):
                with open(os.path.join(UI, "index.html"), "rb") as f:
                    return self.send(200, f.read(), "text/html; charset=utf-8")
            if u.path.startswith("/ui/"):
                fp = os.path.normpath(os.path.join(UI, unquote(u.path[4:])))
                if not fp.startswith(UI) or not os.path.isfile(fp):
                    return self.send(404, {"err": "không có"})
                with open(fp, "rb") as f:
                    return self.send(200, f.read(), mimetypes.guess_type(fp)[0] or "application/octet-stream")
            if u.path == "/api/ping":
                return self.send(200, {"ok": True})
            if u.path == "/api/health":
                ci = claude_info(force=q.get("force") == ["1"])
                return self.send(200, {
                    "claude": ci.get("cmd") and " ".join(ci["cmd"]), "version": ci.get("version"),
                    "err": ci.get("err"), "login": ci.get("login"),
                    "cwd": CFG.get("thu_muc_lam_viec"), "cwd_ok": os.path.isdir(CFG.get("thu_muc_lam_viec") or ""),
                    "mode": CFG.get("che_do_quyen"), "kenh": CFG["kenh"],
                    "tk": ci.get("tk") or {}, "san_sang": san_sang(),
                    "os": "mac" if IS_MAC else "win" if IS_WIN else "khac",   # giao diện đổi chữ hướng dẫn theo máy (⌘, Terminal…)
                })
            m = re.fullmatch(r"/api/tiktok/([\w-]+)", u.path)
            if m:
                return self.send(200, tiktok_data(m.group(1)))
            if u.path == "/api/telegram":
                return self.send(200, tg_cai({}))
            if u.path == "/api/tg-lenh":
                return self.send(200, tgl_cai({}))
            if u.path == "/api/bai-co-san":
                return self.send(200, {"bai": bai_co_san()})
            if u.path == "/api/lich-su-brief":
                return self.send(200, lich_su_brief())
            if u.path == "/api/tiktok-cai":
                return self.send(200, tiktok_cai())
            if u.path == "/api/model-cai":
                return self.send(200, model_cai())
            if u.path == "/api/quy-tac":
                return self.send(200, quy_tac_ds())
            if u.path == "/api/quan-ly":
                return self.send(200, quan_ly())
            if u.path == "/api/nhap":
                return self.send(200, nhap_doc())
            if u.path == "/api/jobs":
                # "ui": ban giao dien hien tai, trang tu tai lai khi doi (fen khoi phai dong mo app)
                try:
                    uiv = int(os.path.getmtime(os.path.join(UI, "index.html")))
                except OSError:
                    uiv = 0
                return self.send(200, {"jobs": list_jobs(), "ui": uiv,
                                       "remote": {"bat": bool(CFG.get("tg_lenh")), "noi": tgl_noi(), "loi": bool(tgl_trang_thai()["loi"])}})
            m = re.fullmatch(r"/api/job/([\w-]+)", u.path)
            if m:
                v = job_view(m.group(1), int((q.get("since") or ["0"])[0]))
                return self.send(200 if v else 404, v or {"err": "không thấy bài"})
            if u.path == "/file":
                p = (q.get("p") or [""])[0]
                if not allowed_path(p) or not os.path.isfile(p):
                    return self.send(404, {"err": "không mở được file"})
                ctype = mimetypes.guess_type(p)[0] or "application/octet-stream"
                if not ctype.startswith(("image/", "text/")):
                    return self.send(403, {"err": "loại file không cho xem"})
                with open(p, "rb") as f:
                    return self.send(200, f.read(), ctype, {"Cache-Control": "max-age=5"})
            m = re.fullmatch(r"/api/job/([\w-]+)/log", u.path)
            if m:
                d = job_dir(m.group(1))
                parts = []
                for fn in sorted(os.listdir(d)):
                    if fn.startswith(("stderr-", "prompt-")):
                        parts.append("===== %s =====\n%s" % (fn, read_text(os.path.join(d, fn))[-20000:]))
                return self.send(200, "\n\n".join(parts) or "(trống)", "text/plain; charset=utf-8")
            return self.send(404, {"err": "không có"})
        except ValueError as e:  # lỗi đã viết sẵn câu cho fen (vd "Không thấy bài")
            return self.send(400, {"err": str(e)})
        except Exception as e:
            log(traceback.format_exc())
            return self.send(500, {"err": "Có lỗi trong app, chi tiết đã ghi vào app-log.txt. Thử lại, vẫn lỗi thì chụp màn hình gửi Claude."})

    def do_POST(self):
        if not self.local_only():
            return
        u = urlparse(self.path)
        try:
            data = self.body()
            if u.path == "/api/tat":
                # tat may chu app (de cap nhat ban moi); bai dang chay van chay tiep, mo lai app la thay
                self.send(200, {"ok": True})
                threading.Timer(0.3, lambda: os._exit(0)).start()
                return
            if u.path == "/api/login" and data.get("doi"):
                return self.send(200, doi_tai_khoan())
            if u.path == "/api/login":
                cmd = resolve_claude()
                if not cmd:
                    raise ValueError("Không tìm thấy Claude Code")
                if IS_WIN:
                    # mo 1 cua so dang nhap rieng; claude auth login tu mo trinh duyet
                    comspec = os.environ.get("COMSPEC", "cmd.exe")
                    subprocess.Popen([comspec, "/c", "start", "Dang nhap Claude Code", comspec, "/k"] + cmd + ["auth", "login"],
                                     creationflags=CREATE_NO_WINDOW)
                elif IS_MAC:   # mở 1 cửa sổ Terminal đăng nhập; claude auth login tự mở trình duyệt
                    mac_mo_terminal("dang-nhap", ['echo "Đăng nhập Claude Code: trình duyệt tự mở, chọn tài khoản Claude của fen rồi bấm cho phép."',
                                                  mac_lenh(cmd + ["auth", "login"]), "echo",
                                                  'echo "Xong. Đóng cửa sổ này, quay lại app Poly Dựng Bài (app tự nhận)."'])
                _CLAUDE["t"] = 0
                return self.send(200, {"ok": True})
            if u.path == "/api/tiktok-soi":
                return self.send(200, tiktok_soi(data))
            if u.path == "/api/tiktok-dang":
                return self.send(200, tiktok_dang(data))
            if u.path == "/api/tiktok-nhac":
                return self.send(200, tiktok_nhac(data))
            if u.path == "/api/viet-brief":
                return self.send(200, viet_brief(data))
            if u.path == "/api/chat-brief":
                return self.send(200, chat_brief(data))
            if u.path == "/api/quy-tac":
                return self.send(200, ghi_quy_tac(data))
            if u.path == "/api/nhap":
                return self.send(200, nhap_luu(data))
            if u.path == "/api/nhap/bo":
                return self.send(200, nhap_bo(data))
            if u.path == "/api/tiktok-cai":
                return self.send(200, tiktok_cai(data))
            if u.path == "/api/model-cai":
                return self.send(200, model_cai(data))
            if u.path == "/api/run":
                job = create_job(data)
                return self.send(200, {"id": job["id"], "xep_hang": bool(job.get("xep_hang") and job.get("status") == "hen"), "thu": job.get("thu") or 0})
            if u.path == "/api/telegram":
                return self.send(200, tg_cai(data))
            if u.path == "/api/tg-lenh":
                return self.send(200, tgl_cai(data))
            if u.path == "/api/bai-co-san":
                return self.send(200, mo_bai_co_san(data))
            m = re.fullmatch(r"/api/job/([\w-]+)/(caption|telegram|tiktok)", u.path)
            if m:
                jid, act = m.groups()
                return self.send(200, save_caption(jid, data) if act == "caption" else gui_telegram(jid) if act == "telegram" else mo_tiktok(jid))
            m = re.fullmatch(r"/api/job/([\w-]+)/viet-caption", u.path)
            if m:
                return self.send(200, viet_caption(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/hen-dang", u.path)
            if m:
                return self.send(200, hen_dang_job(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/da-dang", u.path)
            if m:
                return self.send(200, danh_dau_dang(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/hen", u.path)
            if m:
                return self.send(200, hen_job(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/kenh", u.path)
            if m:
                return self.send(200, doi_kenh(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/brand", u.path)
            if m:
                return self.send(200, doi_brand(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/tra-loi", u.path)
            if m:
                return self.send(200, tra_loi_job(m.group(1), data))
            m = re.fullmatch(r"/api/job/([\w-]+)/(sua|dung|chay-lai|mo|xoa)", u.path)
            if m:
                jid, act = m.groups()
                if act == "sua":
                    fix_job(jid, data)
                    return self.send(200, {"ok": True})
                if act == "dung":
                    stop_job(jid)
                    return self.send(200, {"ok": True})
                if act == "chay-lai":
                    with LOCK:
                        job = load_job(jid)
                        if job.get("status") == "dang-chay":
                            raise ValueError("Bài đang chạy")
                        STATE.pop(jid, None)
                        job.pop("loi_chay", None)
                        sid = job.get("session_id")
                        if sid and data.get("tiep") is not False:
                            start_run(job, read_prompt("chay-tiep.txt"), "tiep", sid)
                        else:
                            start_run(job, build_prompt_dung(job), "dung")
                    return self.send(200, {"ok": True})
                if act == "mo":
                    job = load_job(jid)
                    p = data.get("p") or job.get("thu_muc_bai") or job_dir(jid)
                    if not allowed_path(p):
                        raise ValueError("Không mở được thư mục này")
                    if IS_WIN:
                        os.startfile(p)  # noqa
                    elif IS_MAC:
                        subprocess.Popen(["open", p], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)   # mở bằng Finder
                    return self.send(200, {"ok": True})
                if act == "xoa":
                    # khong xoa han: chuyen vao jobs\_to_delete
                    job = load_job(jid)
                    if job and job.get("status") == "dang-chay":
                        raise ValueError("Bài đang chạy")
                    dst = os.path.join(APP, "_to_delete")
                    os.makedirs(dst, exist_ok=True)
                    shutil.move(job_dir(jid), os.path.join(dst, jid))
                    with LOCK:
                        STATE.pop(jid, None)
                    return self.send(200, {"ok": True})
            return self.send(404, {"err": "không có"})
        except ValueError as e:
            return self.send(400, {"err": str(e)})
        except Exception as e:
            log(traceback.format_exc())
            return self.send(500, {"err": "Có lỗi trong app, chi tiết đã ghi vào app-log.txt. Thử lại, vẫn lỗi thì chụp màn hình gửi Claude."})


class Srv(ThreadingHTTPServer):
    # Windows: SO_REUSEADDR cho nhieu ban cung nghe 1 cong -> chi cho 1 ban duy nhat
    allow_reuse_address = not IS_WIN

    def server_bind(self):
        if IS_WIN:
            import socket
            self.socket.setsockopt(socket.SOL_SOCKET, getattr(socket, "SO_EXCLUSIVEADDRUSE", -5), 1)
        super().server_bind()


def main():
    os.makedirs(JOBS, exist_ok=True)
    port = int(CFG.get("port") or 8777)
    try:
        srv = Srv(("127.0.0.1", port), H)
    except OSError:
        print("App da chay san o cong %d" % port)
        return
    srv.daemon_threads = True
    if IS_MAC:   # lần đầu: ghi thư mục vào config.json, chép bộ luật, bật bộ canh hàng chờ Photoshop
        mac_chuan_bi()
    log("mo app cong %d" % port)
    print("Poly Dung Bai: http://127.0.0.1:%d" % port)
    threading.Thread(target=claude_info, daemon=True).start()
    threading.Thread(target=theo_doi, daemon=True).start()
    threading.Thread(target=lich, daemon=True).start()
    if CFG.get("telegram_token") and (CFG.get("tg_lenh") or tgl_noi()):
        tgl_khoi()
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
