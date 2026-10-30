# Soi MỌI THỨ sau khi dựng trong 1 lệnh (thay 3–4 lệnh riêng, bớt lượt và bớt bị chặn quyền).
# Dùng:  python prep/soi_tat_ca.py "<thư mục bài>" [vN] [--them "<thư mục ảnh khác>" ...]
#   vN       : tên log Photoshop vừa dựng (vd v2) để nghiệm thu đúng lượt; bỏ trống = log mới nhất
#   --them   : thư mục ảnh khác cần dò trùng (vd ảnh nền mờ ở "E:/Social Claude/Anh tai ve/tai-ve-29-10")
# Chạy lần lượt: kiem_anh slide (ảnh ghép log/tong.png), kiem_bo_cuc (log/bo-cuc.png),
#   iPad: ipad/nghiem-thu.py, rồi trung_anh kiem (ảnh của bài + thư mục --them).
# In từng phần rút gọn + dòng TỔNG cuối. Mã thoát 0 = không lỗi, 1 = có lỗi phải xem.
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import os, re, subprocess, sys

K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
them = []
while '--them' in args:
    i = args.index('--them'); them.append(args[i + 1]); del args[i:i + 2]
if not args:
    sys.exit('Dùng: python prep/soi_tat_ca.py "<thư mục bài>" [vN] [--them "<thư mục ảnh>"]')
bai = args[0].rstrip('/\\'); ver = args[1] if len(args) > 1 else ''
ten = os.path.basename(bai); ipad = '/ipad/' in bai.replace('\\', '/').lower()
log = os.path.join(bai, 'log'); os.makedirs(log, exist_ok=True)


def chay(tieu_de, cmd, giu):
    """Chạy 1 công cụ, in các dòng khớp mẫu `giu` (dòng lỗi/tổng), trả (mã, toàn bộ chữ)."""
    print('\n== ' + tieu_de)
    try:
        r = subprocess.run([sys.executable] + cmd, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=600)
    except Exception as e:
        print('!! không chạy được:', e); return 1, ''
    out = (r.stdout or '') + (r.stderr or '')
    lines = [l for l in out.splitlines() if l.strip()]
    keep = [l for l in lines if re.search(giu, l)]
    for l in (keep or lines[-6:])[:40]:
        print('  ' + l)
    if r.returncode not in (0, 1) and 'Traceback' in out:
        print('  !! công cụ lỗi:', lines[-1] if lines else r.returncode)
    return r.returncode, out


tong = {}
# độ nét vùng ảnh trên slide chỉ để xem (slide có nền mờ nên thấp hơn ảnh gốc), không tính lỗi
chay('Ảnh ghép + độ nét (kiem_anh slide)', [os.path.join(K, 'prep', 'kiem_anh.py'), 'slide', bai, os.path.join(log, 'tong.png')],
     r'->|LOI|Traceback')
_, o = chay('Bố cục (kiem_bo_cuc)', [os.path.join(K, 'prep', 'kiem_bo_cuc.py'), bai, os.path.join(log, 'bo-cuc.png')],
            r'^slide-\d+\.png: (?!OK)|vượt|LOI BO CUC|->|Traceback')
m = re.search(r'LOI BO CUC (\d+)', o); tong['bố cục'] = int(m.group(1)) if m else '?'
if ipad:
    cmd = [os.path.join(K, 'ipad', 'nghiem-thu.py'), bai] + ([ver + '.log'] if ver else [])
    _, o = chay('Nghiệm thu iPad (nghiem-thu)', cmd, r'!!|LOI|TONG|Bang anh|XONG|Traceback')
    m = re.search(r'TONG: (\d+) loi', o); tong['nghiệm thu'] = int(m.group(1)) if m else '?'
anh = os.path.join(bai, 'tai-nguyen', 'anh-that') if os.path.isdir(os.path.join(bai, 'tai-nguyen', 'anh-that')) else os.path.join(bai, 'tai-nguyen')
trung = 0
for d in [anh] + them:
    if not os.path.isdir(d):
        print('\n!! không có thư mục', d); continue
    _, o = chay('Dò trùng ảnh: ' + d, [os.path.join(K, 'prep', 'trung_anh.py'), 'kiem', d, ten], r'TRUNG|GAN|Traceback')
    m = re.search(r'TRUNG (\d+)', o); trung += int(m.group(1)) if m else 0
tong['trùng ảnh'] = trung
print('\nTỔNG: ' + ', '.join('%s %s' % kv for kv in tong.items()) + '  (ảnh ghép: log/tong.png, bố cục: log/bo-cuc.png — mở bằng Read)')
sys.exit(1 if any(isinstance(v, int) and v for v in tong.values()) or '?' in tong.values() else 0)
