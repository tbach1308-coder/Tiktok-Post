# fen 21/11 14h03 "bấm vô ô xóa thì file trên window xóa luôn": nút 🗑 / ⋯ Xoá bài -> bài vào _to_delete của app + thư mục slide
# vào Thùng rác (máy thử: Thùng rác giả = thư mục POLY_THUNG_RAC). Chạy trên app thử vừa khởi động lại có biến này:
#   cd /home/claude/bug3 && POLY_THUNG_RAC=/home/claude/bug3/thungrac bash reset.sh && python3 xoabai.py
import json, os, time, urllib.request
A = 'http://127.0.0.1:8790'; G = '/home/claude/bug3/tgl'; J = G + '/jobs'; TR = '/home/claude/bug3/thungrac'
DD = G + '/_bo-dung-design/noi-dung/danh-sach-content-da-don.md'
ok = [0, 0]


def check(n, c, x=''):
    ok[0 if c else 1] += 1
    print(('✓ ' if c else '✗ ') + n, '' if c else x)


def req(p, d=None):
    r = urllib.request.Request(A + p, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type': 'application/json'})
    try:
        return json.loads(urllib.request.urlopen(r, timeout=60).read())
    except urllib.error.HTTPError as e:
        return dict(json.loads(e.read() or b'{}'), _code=e.code)


def lam(br):
    jid = req('/api/run', {"kenh": "ipad", "brief": br})['id']
    for _ in range(90):
        j = req('/api/job/' + jid).get('job') or {}
        if j.get('status') in ('xong', 'loi', 'dung'):
            return jid, j.get('thu_muc_bai')
        time.sleep(1)
    return jid, None


def trong_tr(ten):
    return any(x.startswith(ten + '-') for x in (os.listdir(TR) if os.path.isdir(TR) else []))


M = 'X%d' % (int(time.time()) % 100000)
dd0 = open(DD, encoding='utf-8').read() if os.path.exists(DD) else ''
# 1) bài đã đăng: xoá -> thư mục vào Thùng rác + ghi tên vào DS đã dọn
a, fa = lam("Bìa: iPAD CHO NGƯỜI LỚN TUỔI " + M + "\nSlide 2: chữ to")
check('bài dựng xong có thư mục slide', fa and os.path.isdir(fa), fa)
req('/api/job/%s/da-dang' % a, {})
r = req('/api/job/%s/xoa' % a, {})
check('xoá bài đã đăng: báo đang vào Thùng rác', r.get('ok') and r.get('thung_rac'), r)
time.sleep(2)
check('thư mục slide không còn trong thư mục kênh, nằm trong Thùng rác', not os.path.exists(fa) and trong_tr(os.path.basename(fa)), fa)
check('bài trong app dời vào _to_delete (không xoá hẳn)', os.path.isdir(os.path.join(G, '_to_delete', a)) and not os.path.isdir(os.path.join(J, a)))
dd = open(DD, encoding='utf-8').read() if os.path.exists(DD) else ''
check('bài đã đăng ghi tên vào danh-sach-content-da-don.md', ('NGƯỜI LỚN TUỔI ' + M).lower() in dd.lower() and dd.startswith(dd0), dd[-300:])
# 2) bài chưa đăng: vào Thùng rác, không ghi DS đã dọn
b, fb = lam("Bìa: iPAD CHO BÉ HỌC ONLINE " + M + "\nSlide 2: khoá app")
r = req('/api/job/%s/xoa' % b, {})
time.sleep(2)
dd2 = open(DD, encoding='utf-8').read()
check('bài chưa đăng: thư mục vào Thùng rác, không ghi DS đã dọn', r.get('thung_rac') and not os.path.exists(fb) and 'BÉ HỌC ONLINE ' + M not in dd2.upper(), r)
# 3) 2 bài dùng chung 1 thư mục: xoá 1 bài thì giữ thư mục
c, fc = lam("Bìa: iPAD CHO DÂN VĂN PHÒNG " + M + "\nSlide 2: Office")
d, _ = lam("Bìa: iPAD CHO DÂN THIẾT KẾ " + M + "\nSlide 2: Procreate")
jf = os.path.join(J, d, 'job.json')


def doi_tm(tm):
    # app còn ghi job.json vài giây sau khi bài xong (ảnh nhỏ, caption…): ghi lại tới khi giữ được
    for _ in range(8):
        jd = json.load(open(jf, encoding='utf-8')); jd['thu_muc_bai'] = tm
        json.dump(jd, open(jf, 'w', encoding='utf-8'), ensure_ascii=False)
        time.sleep(3.2)
        if json.load(open(jf, encoding='utf-8')).get('thu_muc_bai') == tm:
            return


doi_tm(fc)
r = req('/api/job/%s/xoa' % c, {})
check('thư mục bài khác còn dùng: giữ, báo lý do', not r.get('thung_rac') and 'bài khác' in (r.get('giu') or '') and os.path.isdir(fc), r)
# 4) thư mục bài là chính thư mục kênh (lỗi dữ liệu): không đụng
doi_tm(G + '/ws/iPad')
r = req('/api/job/%s/xoa' % d, {})
check('thư mục kênh: không đưa vào Thùng rác', not r.get('thung_rac') and r.get('giu') and os.path.isdir(G + '/ws/iPad'), r)
# 5) bài đang chạy: không xoá
e = req('/api/run', {"kenh": "ipad", "brief": "Bìa: iPAD CHƠI GAME " + M + "\nSlide 2: x"})['id']
r = req('/api/job/%s/xoa' % e, {})
check('bài đang chạy: báo Dừng trước', r.get('_code') == 400 and 'Dừng' in (r.get('err') or '') and os.path.isdir(os.path.join(J, e)), r)
for _ in range(90):
    if (req('/api/job/' + e).get('job') or {}).get('status') in ('xong', 'loi', 'dung'):
        break
    time.sleep(1)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
