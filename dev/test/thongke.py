# Trang 📊 Số bài theo máy (fen 15/11 10h53 "thêm 1 tab để quản lý số lượng bài đăng của từng máy", chọn "Thống kê + chỉ tiêu"):
# /api/thong-ke trả bài 62 ngày (máy gộp theo tên: 1 máy vào lại dùng chung có mã mới vẫn 1 dòng), danh sách máy, chỉ tiêu / ngày.
import json, os, sys, time, shutil, importlib, tempfile, re
GOC = '/home/claude/bug3/tgl'
ok = [0, 0]
def check(n, c, x=''):
    ok[0 if c else 1] += 1; print(('✓ ' if c else '✗ ') + n, '' if c else x)
sys.path.insert(0, GOC); os.chdir(GOC)
srv = importlib.import_module('server')
T = tempfile.mkdtemp(prefix='tk-'); srv.JOBS = T + '/jobs'; os.makedirs(srv.JOBS)
LUU = []
srv.save_cfg_keys = lambda d: (LUU.append(dict(d)), srv.CFG.update(d))
srv.CFG['chung_may'] = {'mNEW': {'ten': 'phupoly’s Mac mini', 't': 1}, 'mQ': {'ten': 'Mac Quân', 't': 2}}
srv.CFG['chi_tieu_may'] = {}
N = time.time()
def bai(jid_t, ten=None, kid=None, st='xong', dang=None, kenh='ipad', an=False, loai=None):
    jid = time.strftime('%Y%m%d-%H%M%S', time.localtime(jid_t)) + '-%04x' % (len(os.listdir(srv.JOBS)))
    os.makedirs(os.path.join(srv.JOBS, jid))
    j = dict(id=jid, kenh=kenh, status=st, created=jid_t, runs=[{'started': jid_t, 'ended': jid_t + 300}])
    if kid: j['khach'] = {'id': kid, 'ten': ten}
    if dang: j['da_dang'] = {'t': dang}
    if an: j['an'] = True
    if loai: j['loai'] = loai
    json.dump(j, open(os.path.join(srv.JOBS, jid, 'job.json'), 'w'), ensure_ascii=False)
    return jid
bai(N - 3600)                                                         # máy shop, chờ đăng
bai(N - 7200, dang=N - 600, kenh='laptop')                            # máy shop, đăng hôm nay
bai(N - 5 * 86400, 'phupoly’s Mac mini', 'mOLD', dang=N - 4 * 86400)   # Phú mã cũ
bai(N - 1800, "phupoly's  Mac Mini", 'mNEW')                          # Phú mã mới, tên gõ hơi khác
bai(N - 1700, 'Máy đã bỏ', 'mGONE')
bai(N - 1600, 'Mac Quân', 'mQ', st='dang-chay')
bai(N - 100 * 86400, 'Rất cũ', 'mX')                                   # quá cũ: không tính
bai(N - 1500, an=True); bai(N - 1400, loai='brief')                    # bài đã dọn / việc viết brief: không tính
r = srv.thong_ke_bai()
mk = {b['id'][-4:]: b['may'] for b in r['bai']}
check('6 bài trong 62 ngày (bỏ bài quá cũ, bài đã dọn, việc viết brief)', len(r['bai']) == 6, len(r['bai']))
check('gộp máy theo tên: Phú mã cũ + mã mới (khác hoa thường, dấu nháy, khoảng trắng) là 1 máy', srv.may_khoa('phupoly’s Mac mini') == srv.may_khoa("phupoly's  Mac Mini")
      and len({b['may'] for b in r['bai'] if 'phupoly' in b['may']}) == 1, mk)
ten = [(m['id'], m['ten'], m['con']) for m in r['may']]
check('danh sách máy: máy shop đầu, máy đang dùng chung trước, máy đã bỏ sau (con=False)', ten[0] == ('chu', 'Máy shop', True) and [x[2] for x in ten] == [True, True, True, False]
      and ten[-1][1] == 'Máy đã bỏ' and not any('Rất cũ' in x[1] for x in ten), ten)
dd = [b for b in r['bai'] if b['dang']]
check('ngày đăng + kênh + trạng thái có đủ', len(dd) == 2 and {b['kenh'] for b in dd} == {'laptop', 'ipad'} and any(b['st'] == 'dang-chay' for b in r['bai']), dd)
# ---------- chỉ tiêu ----------
k = srv.may_khoa('phupoly’s Mac mini')
r = srv.chi_tieu_cai({'may': k, 'so': 4})
check('đặt chỉ tiêu 4 bài / ngày cho máy Phú: lưu config chi_tieu_may', r['chi_tieu'].get(k) == 4 and LUU and LUU[-1]['chi_tieu_may'].get(k) == 4, (r['chi_tieu'], LUU))
r = srv.chi_tieu_cai({'may': 'chu', 'so': '3'})
check('chỉ tiêu máy shop', r['chi_tieu'] == {k: 4, 'chu': 3}, r['chi_tieu'])
r = srv.chi_tieu_cai({'may': k, 'so': 0})
check('0 = bỏ chỉ tiêu', r['chi_tieu'] == {'chu': 3}, r['chi_tieu'])
for bad, d in [('mã máy lạ', {'may': '../x', 'so': 2}), ('số không phải số', {'may': 'chu', 'so': 'abc'})]:
    try: srv.chi_tieu_cai(d); check('báo lỗi: ' + bad, False)
    except ValueError: check('báo lỗi: ' + bad, True)
check('chỉ tiêu tối đa 200', srv.chi_tieu_cai({'may': 'chu', 'so': 9999})['chi_tieu']['chu'] == 200)
# ---------- máy dùng chung không xem / đặt được ----------
cam = srv.CHUNG_CAM
check('máy dùng chung bị chặn GET + POST /api/thong-ke', any(re.fullmatch(x, '/api/thong-ke') for x in cam['GET']) and any(re.fullmatch(x, '/api/thong-ke') for x in cam['POST']))
shutil.rmtree(T, ignore_errors=True)
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
