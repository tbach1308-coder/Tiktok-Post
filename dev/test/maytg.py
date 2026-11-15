# Máy ↔ Telegram (fen 15/11 11h30 "cần có chỗ quản lý máy nào link với telegram nào", chọn "Cả 2 chiều"): trang 📊 Số bài gán
# 1 người Telegram cho từng máy (máy shop + máy dùng chung, gộp theo tên). Người gán máy dùng chung ra lệnh trong nhóm (viết brief,
# Chạy) thì bài tính là của máy đó; bài máy đó xong gửi riêng người đó. Người gán máy shop: bài máy shop như cũ (không thành máy khách).
import json, time, sys, re, urllib.request, urllib.error
sys.argv = [sys.argv[0]]
exec(open('/home/claude/bug3/tgltest.py').read().split("n=len(logs())\nr=req(APP")[0])
G = -1003000000778; K = 'http://127.0.0.1:8791'
def cfg(): return json.load(open('/home/claude/bug3/tgl/config.json'))
def gm(text, uid, name):
    return push({"message": {"message_id": int(time.time()*1000) % 10**7, "date": int(time.time()), "chat": {"id": G, "type": "supergroup", "title": "POLY Dựng Bài"},
                             "from": {"id": uid, "first_name": name, "is_bot": False}, "text": text}})
def pm(text, uid, name): return push({"message": {"message_id": int(time.time()*1000) % 10**7, "date": int(time.time()), "chat": {"id": uid, "type": "private", "first_name": name}, "from": {"id": uid, "first_name": name, "is_bot": False}, "text": text}})
def gcb(data, uid): return push({"callback_query": {"id": "cb%d" % time.time_ns(), "from": {"id": uid, "first_name": {111: 'Hoài', 222: 'Quân'}.get(uid, 'X')}, "message": {"message_id": 5, "chat": {"id": G, "type": "supergroup"}}, "data": data}})
def kreq(path, d=None, h=None):
    r = urllib.request.Request(K + path, data=json.dumps(d).encode() if d is not None else None, headers=dict({'Content-Type': 'application/json'}, **(h or {})))
    try:
        with urllib.request.urlopen(r, timeout=30) as f: return f.status, json.loads(f.read())
    except urllib.error.HTTPError as e: return e.code, json.loads(e.read() or b'{}')
def brief_chay(uid, ten, chu_de):
    """Người uid viết brief trong nhóm rồi bấm Chạy: (brief job, bài job)."""
    n = len(logs()); gm('bài: ' + chu_de, uid, ten)
    x = wait_for(n, lambda x: 'chay:' in json.dumps(x['vals'].get('reply_markup') or ''), 60)
    jb = re.search(r'chay:([\w-]+)', x['vals'].get('reply_markup') or '').group(1) if x else None
    if not jb: return None, None
    bj = json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json' % jb, encoding='utf-8'))
    n = len(logs()); gcb('chay:' + jb, uid); wait_for(n, lambda x: 'Đang dựng' in txt(x) or 'Xếp hàng' in txt(x), 20)
    for _ in range(40):
        bj2 = json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json' % jb, encoding='utf-8'))
        if (bj2.get('tg') or {}).get('chay') not in (None, 'dang'):
            return bj, json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json' % bj2['tg']['chay'], encoding='utf-8'))
        time.sleep(0.5)
    return bj, None

open('/home/claude/bug3/tglfake.admin', 'w').write('administrator')
# máy dùng chung "Mac Quân TG"
r = req(APP + '/api/chung', {"bat": True})
for _ in range(30):
    if r.get('chay'): break
    time.sleep(0.5); r = req(APP + '/api/chung')
H = {'Host': r['url'].split('//')[1]}
ma = req(APP + '/api/chung', {"ma_moi": True})['ma']
s, b = kreq('/api/chung/vao', {"ma": ma, "ten": "Mac Quân TG"}, H); MID = b.get('id') or [m['id'] for m in req(APP + '/api/chung')['may'] if m['ten'] == 'Mac Quân TG'][-1]
KQ = 't:mac quân tg'
tk = req(APP + '/api/thong-ke')
check('chưa nối Telegram: trang Số bài báo chưa gán được', tk.get('tg_noi') is False and tk.get('nguoi') == [], {k: tk.get(k) for k in ('tg_noi', 'nguoi')})
# nối nhóm + Quân bấm Start
req(APP + '/api/tg-lenh', {"bat": True}); mn = req(APP + '/api/tg-lenh', {"ma_nhom": True})['ma']
n = len(logs()); gm('/start@poly_dung_bai_bot ' + mn, 111, 'Hoài'); wait_for(n, lambda x: 'gửi riêng cho người đó' in txt(x))
n = len(logs()); pm('/start', 222, 'Quân'); wait_for(n, lambda x: 'Đã nối' in txt(x) and x['vals'].get('chat_id') == '222')
tk = req(APP + '/api/thong-ke')
check('nối rồi: danh sách người có Quân + fen', tk.get('tg_noi') and {'111', '222'} <= {str(x['id']) for x in tk.get('nguoi', [])}, tk.get('nguoi'))
e = req(APP + '/api/thong-ke', {"tg": {"may": KQ, "nguoi": "999"}})
check('gán người chưa bấm Start: báo lỗi', 'Start' in (e.get('err') or ''), e)
tk = req(APP + '/api/thong-ke', {"tg": {"may": KQ, "nguoi": "222"}})
check('gán Quân cho máy Mac Quân TG', (tk.get('tg') or {}).get(KQ) == '222' and str(cfg()['chung_may'][MID].get('tg')) == '222', tk.get('tg'))
check('cùng dữ liệu với ô 📩 trong 💻 Máy khác', [m['tg'] for m in req(APP + '/api/chung')['may'] if m['id'] == MID] == ['222'])
s, b = kreq('/api/thong-ke', None, dict(H, **{'X-Poly-Khach': 'x'}))
check('máy dùng chung không gọi được /api/thong-ke', s in (401, 403, 404), s)
# chiều 2: Quân ra lệnh trong nhóm → bài của máy Mac Quân TG, xong gửi riêng Quân
n0 = len(logs()); bj, job = brief_chay(222, 'Quân', 'laptop cho dân kiến trúc 2026')
check('Quân viết brief trong nhóm: brief tính máy Mac Quân TG (dò trùng theo máy đó)', bj and (bj.get('khach') or {}).get('id') == MID, bj and bj.get('khach'))
check('máy Quân chưa dùng theme nào: Chạy báo cần chọn theme 1 lần (không chạy bằng theme shop)', job is None and [x for x in sent(n0) if 'chưa dùng theme Photoshop' in txt(x)], [txt(x) for x in sent(n0)][-3:])
# máy đó từng làm 1 bài theme Photoshop (cùng tên máy, mã cũ)
import os, glob
TH = [t['id'] for t in req(APP + '/api/theme-ps').get('ds', [])][0]
d = '/home/claude/bug3/tgl/jobs/20261101-090000-tgmq'; os.makedirs(d, exist_ok=True)
json.dump({"id": "20261101-090000-tgmq", "kenh": "laptop", "status": "xong", "created": time.time() - 86400 * 14, "runs": [], "brief": "x", "tieu_de": "Bài cũ máy Quân",
           "khach": {"id": "mcu000001", "ten": "Mac Quân TG"}, "theme_ps": {"id": TH, "ten": TH}}, open(d + '/job.json', 'w'), ensure_ascii=False)
bj, job = brief_chay(222, 'Quân', 'laptop cho dân kiến trúc 2027')
check('Quân bấm Chạy: bài là của máy Mac Quân TG, gửi riêng Quân, theme máy đó dùng gần nhất', job and (job.get('khach') or {}).get('id') == MID and (job.get('tg_nguoi') or {}).get('id') == 222 and (job.get('theme_ps') or {}).get('id') == TH,
      job and (job.get('khach'), job.get('tg_nguoi'), job.get('theme_ps')))
# fen gán máy shop: fen ra lệnh vẫn là bài máy shop
tk = req(APP + '/api/thong-ke', {"tg": {"may": "chu", "nguoi": "111"}})
check('gán fen cho máy shop', (tk.get('tg') or {}).get('chu') == '111' and str(cfg().get('tg_may_chu')) == '111', tk.get('tg'))
bj, job = brief_chay(111, 'Hoài', 'ipad cho sinh viên y 2026')
check('fen ra lệnh: bài máy shop (không gắn máy khách)', job and not job.get('khach'), job and job.get('khach'))
# bỏ gán
tk = req(APP + '/api/thong-ke', {"tg": {"may": KQ, "nguoi": ""}}); req(APP + '/api/thong-ke', {"tg": {"may": "chu", "nguoi": ""}})
check('bỏ gán: hết nối', not (req(APP + '/api/thong-ke').get('tg') or {}) and not cfg().get('tg_may_chu'), req(APP + '/api/thong-ke').get('tg'))
e = req(APP + '/api/thong-ke', {"tg": {"may": "t:may khong co", "nguoi": "222"}})
check('máy không còn dùng chung: báo lỗi', 'không còn' in (e.get('err') or ''), e)
import shutil; shutil.move(d, '/home/claude/bug3/tgl/_to_delete_tgmq') if os.path.isdir(d) and not os.path.exists('/home/claude/bug3/tgl/_to_delete_tgmq') else None
req(APP + '/api/chung', {"bo": MID}); req(APP + '/api/chung', {"bat": False}); req(APP + '/api/tg-lenh', {"bo_noi": True})
import os; os.remove('/home/claude/bug3/tglfake.admin')
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
