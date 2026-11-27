# fen 27/11 14h50 "bấm nút này folder hiện lên trước luôn": nút 📂 Mở thư mục mở File Explorer rồi đưa đúng cửa sổ lên trước.
# Phần chọn cửa sổ thử được trên máy thử (danh sách cửa sổ giả); phần Windows (đưa lên trước) chỉ thử được trên máy shop.
#   cd /home/claude/bug3 && python3 mothumuc.py
import json, os, sys, urllib.request
T = '/home/claude/bug3/tgl'
os.chdir(T); sys.path.insert(0, T); sys.argv = ['x']
import server as S
ok = bad = 0
def check(n, c, x=None):
    global ok, bad
    ok += bool(c); bad += (not c)
    print(('✓ ' if c else '✗ ') + n + ('' if c else ' ' + json.dumps(x, ensure_ascii=False, default=str)[:300]))
T1 = 'T11_XepHangChip_27-11'
cu = [(101, 'Downloads'), (102, 'poly-dung-bai')]
check('mở cửa sổ mới: chọn cửa sổ mới có tên thư mục', S._chon_cua_so(cu, cu + [(103, T1)], T1) == 103)
check('Windows 11 mở tab mới trong cửa sổ cũ: chọn cửa sổ cũ đổi tên', S._chon_cua_so(cu, [(101, 'Downloads'), (102, T1 + ' - File Explorer')], T1) == 102)
check('đã mở sẵn thư mục này + mở thêm 1 cửa sổ: chọn cửa sổ mới', S._chon_cua_so(cu + [(104, T1)], cu + [(104, T1), (105, T1)], T1) == 105)
check('tiêu đề ghi đường dẫn đầy đủ: vẫn khớp', S._chon_cua_so(cu, cu + [(106, 'E:\\Social Claude\\Laptop\\' + T1)], T1) == 106)
check('chưa thấy cửa sổ: không chọn bừa', S._chon_cua_so(cu, cu + [(107, 'Pictures')], T1) is None)
check('tên trống: không chọn', S._chon_cua_so(cu, cu, '') is None)
check('không phải Windows / Mac: không làm gì, không lỗi', S.mo_thu_muc('/tmp') is None)
# app thử: bấm nút (API mở thư mục) vẫn trả ok
js = json.loads(urllib.request.urlopen('http://127.0.0.1:8790/api/jobs', timeout=30).read())['jobs']
j = next(x for x in js if x['status'] == 'xong')
r = json.loads(urllib.request.urlopen(urllib.request.Request('http://127.0.0.1:8790/api/job/%s/mo' % j['id'], data=b'{}', headers={'Content-Type': 'application/json'}), timeout=30).read())
check('app thử: API mở thư mục bài trả ok', r.get('ok'), r)
print('KẾT QUẢ: %d đạt, %d lỗi' % (ok, bad))
