# fen 21/11 12h58–13h05: máy con gửi 1 bài 2 lần (2 bài giống hệt) -> (1) cùng máy gửi lại đúng bài trong 60 giây: không tạo bài mới;
# (2) "phát hiện giữa các app có bài trùng nhau là báo liền": bài trùng tiêu đề / brief bài máy khác -> nhắn Telegram fen + ⚠️ Trùng;
# (3) "có bài trùng là báo admin, chờ xử lý xong mới được chạy": bài trùng giữ lại (cho_admin), máy shop bấm Vẫn dựng mới chạy.
# Chạy trên app thử vừa khởi động lại: cd /home/claude/bug3 && bash reset.sh && python3 baitrung.py
import json, os, threading, time, urllib.request
A = 'http://127.0.0.1:8790'; K = 'http://127.0.0.1:8791'; J = '/home/claude/bug3/tgl/jobs'; TGLOG = '/home/claude/bug3/tglfake.log'
ok = [0, 0]


def check(n, c, x=''):
    ok[0 if c else 1] += 1
    print(('✓ ' if c else '✗ ') + n, '' if c else x)


def req(base, p, d=None, h=None):
    r = urllib.request.Request(base + p, data=json.dumps(d).encode() if d is not None else None,
                               headers=dict({'Content-Type': 'application/json'}, **(h or {})))
    try:
        return json.loads(urllib.request.urlopen(r, timeout=60).read())
    except urllib.error.HTTPError as e:
        return dict(json.loads(e.read() or b'{}'), _code=e.code)


def cho(jid, dk, n=90):
    for _ in range(n):
        j = req(A, '/api/job/' + jid).get('job') or {}
        if dk(j):
            return j
        time.sleep(1)
    return j


def xong(j):
    return j.get('status') in ('xong', 'loi', 'dung')


def tg_co(chu, tu):
    if not os.path.exists(TGLOG):
        return ''
    for l in open(TGLOG, encoding='utf-8'):
        o = json.loads(l)
        if o['t'] >= tu and o['meth'] in ('sendMessage', 'sendPhoto') and chu in (o['vals'].get('text') or o['vals'].get('caption') or ''):
            return o['vals'].get('text') or o['vals'].get('caption')
    return ''


# bài thử của lần chạy trước (máy thử) dời ra chỗ khác: không thì bài mới trùng bài cũ thật
import shutil
CU = '/home/claude/bug3/tgl/_to_delete/baitrung'
os.makedirs(CU, exist_ok=True)
for jid in os.listdir(J):
    try:
        b = json.load(open(os.path.join(J, jid, 'job.json'), encoding='utf-8')).get('brief') or ''
    except Exception:
        continue
    if any(x in b for x in ('KẾ TOÁN 2026', 'SINH VIÊN MỸ THUẬT', 'Air M4 hay Air M3?', 'Air M3 hay Air M4?', 'CHUỘT KHÔNG DÂY', 'MINI 7 ĐỌC SÁCH')):
        shutil.move(os.path.join(J, jid), os.path.join(CU, jid))
r = req(A, '/api/chung', {"bat": True})
for _ in range(30):
    if r.get('chay'):
        break
    time.sleep(0.5)
    r = req(A, '/api/chung')


def vao(ten):
    ma = req(A, '/api/chung', {"ma_moi": True})['ma']
    v = req(K, '/api/chung/vao', {"ma": ma, "ten": ten}, {'Host': 'poly-thu.example'})
    return {'Host': 'poly-thu.example', 'X-Poly-Khach': v['token']}


H1 = vao('Mac Trùng')
TH = "phang-xanh-dem"
M = 'LẦN%d' % (int(time.time()) % 100000)     # mỗi lần chạy 1 mã: bài lần chạy trước không tính trùng

# 1) cùng máy gửi đúng bài 2 lần chen nhau / cách 2 giây: 1 bài
kq = []
br1 = "Bìa: LAPTOP NÀO CHO KẾ TOÁN 2026 " + M + "\nSlide 2: Excel nặng cần RAM 16GB\nSlide 3: màn 15.6 inch đỡ mỏi mắt"
ts = [threading.Thread(target=lambda: kq.append(req(A, '/api/run', {"kenh": "laptop", "brief": br1}))) for _ in range(2)]
[t.start() for t in ts]
[t.join() for t in ts]
check('máy shop gửi 1 bài 2 lần cùng lúc: chỉ 1 bài', len({x.get('id') for x in kq}) == 1 and sum(1 for x in kq if x.get('trung_gui')) == 1, kq)
cho(kq[0]['id'], xong)
k1 = req(K, '/api/run', {"kenh": "ipad", "brief": "Bìa: iPAD VẼ CHO SINH VIÊN MỸ THUẬT " + M + "\nSlide 2: Pencil 2\nSlide 3: màn 120Hz", "theme_ps": TH}, H1)
time.sleep(2)
k2 = req(K, '/api/run', {"kenh": "ipad", "brief": "Bìa: iPAD VẼ CHO SINH VIÊN MỸ THUẬT " + M + "\nSlide 2: Pencil 2\nSlide 3: màn 120Hz", "theme_ps": TH}, H1)
check('máy con gửi lại đúng bài sau 2 giây: trả bài cũ, không tạo bài mới', k1.get('id') and k2.get('id') == k1.get('id') and k2.get('trung_gui'), (k1, k2))
cho(k1['id'], xong)
k3 = req(K, '/api/run', {"kenh": "ipad", "brief": "Bìa: iPAD VẼ CHO SINH VIÊN MỸ THUẬT " + M + "\nSlide 2: Pencil 2\nSlide 3: màn 120Hz", "theme_ps": TH,
                         "ghi_chu": "slide 3 thêm ảnh"}, H1)
check('khác ghi chú: là bài khác (không chặn gửi lại)', k3.get('id') and k3['id'] != k1['id'], k3)
j3 = req(A, '/api/job/' + k3['id'])
check('bài cùng máy, cùng tiêu đề trong 24 giờ: giữ chờ fen (cùng máy)', j3['job'].get('cho_admin') and j3['job']['status'] == 'hen'
      and any(x.get('cung_may') for x in j3.get('trung') or []), j3.get('trung'))
req(A, '/api/job/%s/xoa' % k3['id'], {})

# 2) máy shop làm "Air M4 hay Air M3?", máy con làm "Air M3 hay Air M4?" (brief khác): trùng tiêu đề giữa 2 máy
s1 = req(A, '/api/run', {"kenh": "ipad", "brief": "Bìa: Air M4 hay Air M3? " + M + "\nChênh ở đâu\nSlide 2: chip M4 nhanh hơn 30%\nSlide 3: giá chênh 3 triệu"})
cho(s1['id'], xong)
t0 = time.time()
k4 = req(K, '/api/run', {"kenh": "ipad", "brief": "Bìa: Air M3 hay Air M4? " + M + "\nSlide 2: màn hình giống nhau\nSlide 3: pin như nhau\nSlide 4: nên lấy con nào",
                         "theme_ps": TH}, H1)
check('máy con tạo bài trùng: trả cho_admin (bị giữ)', k4.get('cho_admin') and not k4.get('xep_hang'), k4)
time.sleep(20)
j4 = req(A, '/api/job/' + k4['id'])
check('bài trùng không tự dựng (qua 1 vòng lịch 15 giây)', j4['job']['status'] == 'hen' and j4['job'].get('cho_admin') and not (j4['job'].get('runs') or []), j4['job'].get('status'))
tr = j4.get('trung') or []
check('máy shop thấy chi tiết bài trùng: tiêu đề, máy shop, trùng tiêu đề', tr and tr[0].get('id') == s1['id'] and tr[0]['kieu'] == 'tiêu đề'
      and tr[0]['may'] == 'máy shop' and not tr[0]['cung_may'], tr)
jk = req(K, '/api/job/' + k4['id'], h=H1)
check('máy con chỉ biết có trùng, không thấy bài máy khác', (jk.get('trung') or [{}])[0].get('kieu') == 'tiêu đề'
      and not any(('td' in x or 'id' in x or 'may' in x) for x in jk.get('trung') or []), jk.get('trung'))
ls = req(A, '/api/jobs')['jobs']
it = next((x for x in ls if x['id'] == k4['id']), {})
check('danh sách: ⚠️ Trùng + đang giữ', it.get('trung') == 1 and it.get('cho_admin'), it)
msg = ''
for _ in range(10):
    msg = tg_co('Có bài trùng giữa các máy', t0)
    if msg:
        break
    time.sleep(1)
check('nhắn Telegram fen ngay: bài mới, máy, bài trùng, đang giữ', 'Air M3 hay Air M4? ' + M in msg and 'Mac Trùng' in msg and 'Air M4 hay Air M3? ' + M in msg
      and 'máy shop' in msg and 'GIỮ' in msg, msg)
e1 = req(K, '/api/job/%s/hen' % k4['id'], {"lam_ngay": True}, H1)
check('máy con không bấm Chạy ngay được bài đang giữ', e1.get('_code') == 400 and 'chờ fen' in (e1.get('err') or ''), e1)
e2 = req(K, '/api/job/%s/hen' % k4['id'], {"duyet_trung": True}, H1)
check('máy con không tự duyệt được', e2.get('_code') == 400, e2)
s2 = req(A, '/api/run', {"kenh": "laptop", "brief": "Bìa: CHUỘT KHÔNG DÂY NÀO BỀN " + M + "\nSlide 2: Logitech MX\nSlide 3: pin 70 ngày"})
check('bài đang giữ không chặn hàng: bài khác máy shop chạy ngay', s2.get('id') and not s2.get('xep_hang') and not s2.get('cho_admin'), s2)
cho(s2['id'], xong)
d = req(A, '/api/job/%s/hen' % k4['id'], {"duyet_trung": True})
check('máy shop bấm Vẫn dựng: hết giữ', d.get('ok') and not req(A, '/api/job/' + k4['id'])['job'].get('cho_admin'), d)
j4 = cho(k4['id'], lambda j: j.get('status') != 'hen', 40)
check('sau khi duyệt: bài tự vào hàng dựng', j4.get('status') in ('dang-chay', 'xong'), j4.get('status'))

# 3) bài khác hẳn: không trùng, không giữ
k5 = req(K, '/api/run', {"kenh": "ipad", "brief": "Bìa: iPAD MINI 7 ĐỌC SÁCH " + M + "\nSlide 2: màn 8.3 inch\nSlide 3: nhẹ 293g", "theme_ps": TH}, H1)
check('bài không trùng: chạy như thường', k5.get('id') and not k5.get('cho_admin'), k5)
jt = req(A, '/api/job/' + k5['id'])
check('bài không trùng: không có ⚠️', not jt.get('trung'), jt.get('trung'))
cho(k5['id'], xong)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
