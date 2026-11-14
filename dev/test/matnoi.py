# Báo Telegram khi mất nối (fen 14/11 12h13): Claude Code / Canva trên máy shop mất nối thì nhắn 1 lần mỗi đợt, nối lại thì nhắn 1 tin.
#  - Claude: lệnh auth status (kiểm mỗi 20 phút / ô Kiểm máy) hoặc lượt chạy báo lỗi đăng nhập; lượt chạy xong = nối lại
#  - mất nối do lượt chạy: auth status báo đã đăng nhập chưa tính là nối lại (token hết hạn vẫn hiện loggedIn)
#  - Canva: kiểm Canva / lượt dùng Canva báo chưa nối; nhớ đợt trong mat-noi.json (khởi động lại không báo lặp)
import json, time, urllib.request, urllib.error, os, subprocess, sys
APP = 'http://127.0.0.1:8790'
GOC = '/home/claude/bug3/tgl'; TGLOG = '/home/claude/bug3/tglfake.log'; MN = GOC + '/mat-noi.json'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
def req(path, d=None):
    r = urllib.request.Request(APP + path, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r, timeout=90) as f:
            return f.status, json.loads(f.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b'{}')
def tin(chua):
    out = []
    for l in open(TGLOG, encoding='utf-8'):
        o = json.loads(l)
        if o['meth'] in ('sendMessage', 'sendPhoto') and chua in (o['vals'].get('text') or o['vals'].get('caption') or ''):
            out.append(o['vals'])
    return out
def cho_tin(chua, n=1, s=8):
    for _ in range(int(s * 10)):
        if len(tin(chua)) >= n: break
        time.sleep(0.1)
    return tin(chua)
def khoi_dong_lai():
    pid = int(open(GOC + '/srv.pid').read())
    try: os.kill(pid, 15)
    except OSError: pass
    time.sleep(1.5)
    p = subprocess.Popen([sys.executable, 'server.py'], cwd=GOC, stdout=open(GOC + '/srv.out', 'a'), stderr=subprocess.STDOUT, start_new_session=True)
    open(GOC + '/srv.pid', 'w').write(str(p.pid))
    for _ in range(40):
        try:
            if req('/api/ping')[1].get('ok'): return
        except Exception: pass
        time.sleep(0.3)
def cho_xong(jid):
    for _ in range(120):
        v = req('/api/job/' + jid)[1]
        if (v.get('job') or {}).get('status') in ('xong', 'loi', 'dung'): return v
        time.sleep(1)
    return v
def mn():
    try: return json.load(open(MN))
    except Exception: return {}
for f in ('NOLOGIN', 'FAKE_CANVA_LOI'):
    if os.path.exists(os.path.join(GOC, f)): os.remove(os.path.join(GOC, f))
if os.path.exists(MN): os.remove(MN)
khoi_dong_lai()
open(TGLOG, 'w').close()
MAT_CL, LAI_CL = 'Claude Code trên máy shop bị đăng xuất', '✅ Claude Code trên máy shop chạy lại rồi'
MAT_CV, LAI_CV = 'Canva trên máy shop mất nối', '✅ Canva trên máy shop nối lại rồi'

# ---------- Claude: đăng xuất (auth status) ----------
req('/api/health?force=1')
time.sleep(1)
check('đang đăng nhập: không nhắn gì', not tin('Claude Code') and not mn().get('claude'), tin('Claude Code'))
open(GOC + '/NOLOGIN', 'w').close()
h = req('/api/health?force=1')[1]
check('auth status báo chưa đăng nhập', h.get('login') is False, h)
t1 = cho_tin(MAT_CL)
check('nhắn Telegram 1 tin mất nối Claude', len(t1) == 1, t1)
check('tin gửi đúng chat nhận tin (telegram_chat)', t1 and str(t1[0].get('chat_id')) == '123456', t1)
check('tin chỉ cách làm (bấm Đăng nhập)', t1 and 'bấm Đăng nhập' in t1[0]['text'], t1)
check('mat-noi.json nhớ đợt mất nối', mn().get('claude') and mn().get('claude_tu') == 'auth', mn())
req('/api/health?force=1'); time.sleep(1)
check('kiểm lại vẫn mất: không nhắn lặp', len(tin(MAT_CL)) == 1, len(tin(MAT_CL)))
khoi_dong_lai(); req('/api/health?force=1'); time.sleep(1.5)
check('khởi động lại app: không nhắn lặp', len(tin(MAT_CL)) == 1, len(tin(MAT_CL)))
os.remove(GOC + '/NOLOGIN')
req('/api/health?force=1')
t2 = cho_tin(LAI_CL)
check('đăng nhập lại: nhắn 1 tin nối lại', len(t2) == 1, t2)
check('tin nối lại có giờ bắt đầu mất', t2 and 'lỗi từ' in t2[0]['text'], t2)
check('mat-noi.json bỏ đợt Claude', not mn().get('claude') and 'claude_tu' not in mn(), mn())
req('/api/health?force=1'); time.sleep(1)
check('đang nối: không nhắn lặp tin nối lại', len(tin(LAI_CL)) == 1)

# ---------- Claude: lượt chạy báo lỗi đăng nhập ----------
a = req('/api/run', {"kenh": "ipad", "brief": "Bìa: LOI đăng nhập\nSlide 2: x"})[1]['id']
v = cho_xong(a)
check('lượt lỗi đăng nhập: bài báo lỗi', v['job']['status'] == 'loi', v['job']['status'])
t3 = cho_tin('hết phiên đăng nhập')
check('lượt lỗi đăng nhập: nhắn mất nối', len(t3) == 1, t3)
check('mat-noi.json nhớ nguồn = lượt chạy', mn().get('claude_tu') == 'luot', mn())
req('/api/health?force=1'); time.sleep(1)
check('auth status vẫn báo đăng nhập: chưa báo nối lại (chờ lượt chạy được)', len(tin(LAI_CL)) == 1 and mn().get('claude'), (len(tin(LAI_CL)), mn()))
b = req('/api/run', {"kenh": "ipad", "brief": "Bìa: CHẠY ĐƯỢC LẠI\nSlide 2: y"})[1]['id']
v = cho_xong(b)
check('lượt sau chạy được', v['job']['status'] == 'xong', v['job']['status'])
check('lượt chạy được: nhắn nối lại', len(cho_tin(LAI_CL, 2)) == 2, len(tin(LAI_CL)))

# ---------- Canva ----------
open(GOC + '/FAKE_CANVA_LOI', 'w').close()
req('/api/canva-tt', {"kiem": True})
for _ in range(60):
    c = req('/api/canva-tt')[1]
    if c.get('tt') not in ('dang',): break
    time.sleep(0.5)
check('kiểm Canva: chưa nối', c.get('tt') == 'chua', c)
t4 = cho_tin(MAT_CV)
check('nhắn 1 tin mất nối Canva', len(t4) == 1, t4)
check('tin Canva chỉ cách nối lại (Connectors)', t4 and 'Connectors' in t4[0]['text'], t4)
time.sleep(61)            # app bỏ qua trạng thái trùng trong 60 giây; quá 60 giây kiểm lại vẫn chưa nối
req('/api/canva-tt', {"kiem": True})
for _ in range(60):
    c = req('/api/canva-tt')[1]
    if c.get('tt') not in ('dang',): break
    time.sleep(0.5)
time.sleep(1)
check('kiểm lại vẫn chưa nối: không nhắn lặp', len(tin(MAT_CV)) == 1, len(tin(MAT_CV)))
os.remove(GOC + '/FAKE_CANVA_LOI')
req('/api/canva-tt', {"kiem": True})
t5 = cho_tin(LAI_CV, 1, 30)
check('nối lại Canva: nhắn 1 tin', len(t5) == 1, t5)
check('mat-noi.json trống', not mn().get('canva') and not mn().get('claude'), mn())
lg = open(GOC + '/app-log.txt', encoding='utf-8', errors='replace').read()
check('app-log ghi mất nối / nối lại', 'mat noi canva: MAT' in lg and 'mat noi canva: noi lai' in lg and 'mat noi claude: MAT' in lg)
print('\n%d đạt, %d lỗi' % tuple(ok))
