# Nhắc bài chờ đăng (fen 15/11 10h chọn "Nhắc bài chờ đăng"): mỗi sáng 8h (mở máy muộn thì lúc mở, trước 12h) gửi 1 lần
# album ảnh bìa + danh sách bài hẹn đăng hôm nay + bài xong chờ quá 1 ngày, nút bấm nhận slide + caption; không có gì thì im.
# Chạy hàm của server.py trực tiếp (thư mục bài giả, tg_call ghi lại thay vì gửi).
import json, os, sys, time, shutil, importlib, tempfile
GOC = '/home/claude/bug3/tgl'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
sys.path.insert(0, GOC); os.chdir(GOC)
srv = importlib.import_module('server')
from PIL import Image
T = tempfile.mkdtemp(prefix='nhac-'); srv.JOBS = T + '/jobs'; srv.NHAC_CHO_FILE = T + '/nhac.json'; os.makedirs(srv.JOBS)
GOI = []
srv.tg_call = lambda meth, f=None, files=None, timeout=0: (GOI.append((meth, dict(f or {}), sorted((files or {}).keys()))), {"message_id": len(GOI)})[1]
srv.CFG.update(telegram_token='x', tg_lenh_chat=-100, telegram_chat=-200, nhac_cho_dang=True)
LUC = time.mktime((2026, 11, 15, 8, 0, 30, 0, 0, -1))
def bai(jid, ten, kenh='ipad', xong_truoc=0, hen=None, **k):
    d = os.path.join(srv.JOBS, jid); os.makedirs(d)
    tm = os.path.join(T, 'bai', jid); os.makedirs(tm)
    Image.new('RGB', (108, 135), (20, 90, 60)).save(os.path.join(tm, 'slide-01.png'))
    j = dict(id=jid, kenh=kenh, status='xong', tieu_de=ten, ten_bai=ten, created=LUC - xong_truoc - 600, thu_muc_bai=tm,
             runs=[{'started': LUC - xong_truoc - 500, 'ended': LUC - xong_truoc}], **k)
    if hen: j['hen_dang'] = hen
    json.dump(j, open(os.path.join(d, 'job.json'), 'w'), ensure_ascii=False)
# ---------- không có gì để nhắc ----------
bai('20261115-070000-aaaa', 'Bài mới xong sáng nay', xong_truoc=3600)
check('chỉ có bài mới xong (< 1 ngày): không nhắc, không gửi gì', srv.nhac_cho_dang(LUC) == 0 and not GOI, GOI)
# ---------- có bài ----------
bai('20261113-100000-bbbb', 'Xếp hạng iPad dưới 10 triệu', xong_truoc=2 * 86400 + 100)
bai('20261110-100000-cccc', 'Laptop văn phòng', kenh='laptop', xong_truoc=5 * 86400)
bai('20261114-200000-dddd', 'Pencil không viết được', xong_truoc=3600, hen=time.mktime((2026, 11, 15, 19, 30, 0, 0, 0, -1)))
bai('20261112-100000-eeee', 'Đã đăng rồi', xong_truoc=3 * 86400, da_dang={'t': LUC - 86400})
bai('20261112-110000-ffff', 'Bài máy Phú', xong_truoc=3 * 86400, khach={'id': 'k1', 'ten': 'phupoly'})
bai('20261112-120000-gggg', 'Bài đang lỗi', xong_truoc=3 * 86400, status_x=1)
json.load(open(os.path.join(srv.JOBS, '20261112-120000-gggg', 'job.json')))
j = json.load(open(os.path.join(srv.JOBS, '20261112-120000-gggg', 'job.json'))); j['status'] = 'loi'; json.dump(j, open(os.path.join(srv.JOBS, '20261112-120000-gggg', 'job.json'), 'w'))
hen, lau = srv.nhac_cho_ds(LUC)
check('hẹn hôm nay: bài hẹn 19:30', [x['id'] for x in hen] == ['20261114-200000-dddd'], [x['id'] for x in hen])
check('chờ quá 1 ngày: cũ nhất trước; bỏ bài đã đăng, bài máy dùng chung, bài lỗi, bài mới xong', [x['id'] for x in lau] == ['20261110-100000-cccc', '20261113-100000-bbbb'], [x['id'] for x in lau])
n = srv.nhac_cho_dang(LUC)
check('nhắc 3 bài', n == 3, n)
alb = [g for g in GOI if g[0] == 'sendMediaGroup']
check('album 3 ảnh bìa (slide 1) gửi về chat Remote', len(alb) == 1 and alb[0][1]['chat_id'] == -100 and alb[0][2] == ['f0', 'f1', 'f2'] and len(json.loads(alb[0][1]['media'])) == 3, alb)
tin = [g for g in GOI if g[0] == 'sendMessage']
chu = tin[-1][1]['text'] if tin else ''
check('tin nhắc: hẹn hôm nay kèm giờ, chờ lâu kèm số ngày', '⏰ Hẹn đăng hôm nay (1)' in chu and 'Pencil không viết được · 19:30' in chu and '🕰 Xong rồi, chờ quá 1 ngày chưa đăng (2)' in chu
      and 'Laptop văn phòng · 5 ngày' in chu and 'Xếp hạng iPad dưới 10 triệu · 2 ngày' in chu and 'Bài máy Phú' not in chu, chu)
nut = json.loads(tin[-1][1].get('reply_markup') or '{}').get('inline_keyboard', []) if tin else []
check('nút bấm từng bài -> nhận slide + caption (xem:<mã>)', [r[0]['callback_data'] for r in nut] == ['xem:20261114-200000-dddd', 'xem:20261110-100000-cccc', 'xem:20261113-100000-bbbb'], nut)
# ---------- lịch: 1 lần / ngày, trong khung giờ ----------
GOI.clear()
srv.CFG.pop('tg_lenh_chat')
n = srv.nhac_cho_dang(LUC)
tin = [g for g in GOI if g[0] == 'sendMessage']
check('chưa nối Remote: gửi vào nhóm nhận slide, không có nút', n == 3 and tin and tin[-1][1]['chat_id'] == -200 and 'reply_markup' not in tin[-1][1], tin)
srv.CFG['tg_lenh_chat'] = -100
# chạy 1 vòng lịch với giờ giả
def vong(gio, ngay=15):
    lt = time.localtime(time.mktime((2026, 11, ngay, gio, 5, 0, 0, 0, -1)))
    goc_lt, goc_sleep = srv.time.localtime, srv.time.sleep
    dem = [0]
    def ngu(s):
        dem[0] += 1
        if dem[0] > 2: raise KeyboardInterrupt
    srv.time.localtime = lambda *a: lt if not a else goc_lt(*a)
    srv.time.sleep = ngu
    try: srv.nhac_cho_lich()
    except KeyboardInterrupt: pass
    finally: srv.time.localtime, srv.time.sleep = goc_lt, goc_sleep
    return srv.read_json(srv.NHAC_CHO_FILE, {}) or {}
GOI.clear()
check('7h: chưa tới giờ, không nhắc', not vong(7).get('ngay') and not GOI)
st = vong(10)
check('10h (máy shop mở muộn): nhắc 1 lần, nhớ ngày', st.get('ngay') == '2026-11-15' and st.get('bai') == 3 and any(g[0] == 'sendMessage' for g in GOI), st)
GOI.clear(); vong(11)
check('cùng ngày không nhắc lại', not GOI, GOI)
GOI.clear(); vong(13, 16)
check('ngày mới mà quá 12h: không nhắc muộn', not GOI and (srv.read_json(srv.NHAC_CHO_FILE, {}) or {}).get('ngay') == '2026-11-15', GOI)
srv.CFG['nhac_cho_dang'] = False; GOI.clear(); vong(8, 17)
check('tắt (config nhac_cho_dang: false): không nhắc', not GOI)
src = open(os.path.join(GOC, 'server.py'), encoding='utf-8').read()
check('lệnh /nhac + dòng hướng dẫn bot', 'lenh == "/nhac"' in src and '/nhac → bài hẹn hôm nay' in src)
shutil.rmtree(T, ignore_errors=True)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
