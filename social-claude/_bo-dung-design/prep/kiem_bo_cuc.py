# Soi BỐ CỤC slide đã dựng (PNG 1080x1440) theo luật thiết kế Poly (agent plugin thiet-ke). Dùng cho cả Laptop và iPad.
# Dùng:  python3 prep/kiem_bo_cuc.py "<thu-muc-bai>" [ra.png]
# Báo: khoảng trống dọc lớn (bố cục dồn trên/dưới), nội dung tràn lề an toàn, chữ/ảnh sát mép,
#      khối nội dung lệch tâm ngang, slide cuối không cân giữa. Ảnh ra: khung đỏ chỗ lỗi.
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, os, re
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
W, H = 1080, 1440; SAFE_L, SAFE_R, SAFE_T, SAFE_B = 98, 982, 120, 1386; HOOK_TOP = 1290
def ban(im):
    g = np.asarray(im.convert('L')).astype(float)
    e = np.abs(ndimage.sobel(g, 0)) + np.abs(ndimage.sobel(g, 1))
    return (e > 60) & (g > 90)   # nền mờ gần như không có cạnh; hoa văn chấm tối của bg-thumb bị loại vì tối
d = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else None
fs = sorted(x for x in os.listdir(d) if re.match(r'slide-\d+\.png$', x)); n = len(fs); loi = 0; tiles = []
for i, f in enumerate(fs):
    im = Image.open(os.path.join(d, f)).convert('RGB'); m = ban(im)
    rows = m.sum(1) > 6; cols = m[SAFE_T:HOOK_TOP].sum(0) > 30
    ghi = []; dr = ImageDraw.Draw(im)
    # 1. khoảng trống dọc lớn nhất giữa header và câu móc
    ys = np.where(rows[180:HOOK_TOP])[0] + 180
    if len(ys):
        gaps = np.diff(ys); k = int(np.argmax(gaps)) if len(gaps) else 0
        g = int(gaps[k]) if len(gaps) else 0
        last = int(ys.max())
        cuoi = (i == n - 1)
        if not cuoi and HOOK_TOP - last > 200:
            ghi.append('trống %dpx dưới khối nội dung (y %d→%d): giãn đều hoặc hạ khối xuống' % (HOOK_TOP - last, last, HOOK_TOP)); dr.rectangle([60, last, 1020, HOOK_TOP], outline=(255, 0, 0), width=6)
        if g > 160 and not cuoi:
            ghi.append('khoảng trống %dpx giữa y %d và %d' % (g, ys[k], ys[k + 1])); dr.rectangle([60, ys[k], 1020, ys[k + 1]], outline=(255, 120, 0), width=6)
        if cuoi:
            top, bot = int(ys.min()), last; c = (top + bot) / 2
            if abs(c - 720) > 90: ghi.append('slide cuối: khối chữ lệch tâm dọc (tâm y %d, nên ~720)' % c)
    # 2. tràn lề an toàn / sát mép
    xs = np.where(cols)[0]
    if len(xs):
        if xs.min() < SAFE_L - 8 or xs.max() > SAFE_R + 8:
            ghi.append('nội dung tràn lề an toàn x %d–%d (chuẩn %d–%d)' % (xs.min(), xs.max(), SAFE_L, SAFE_R))
        if i == n - 1:
            # slide cuối căn giữa: xét TỪNG DÒNG (cột lọc >30 bỏ sót nét chữ mảnh, emoji nét dày làm lệch giả)
            lab, k = ndimage.label(rows[SAFE_T:HOOK_TOP]); worst = 0
            for j in range(1, k + 1):
                yy = np.where(lab == j)[0] + SAFE_T
                if len(yy) < 16: continue   # dải mỏng = đuôi chữ / dấu của dòng trên, bỏ
                xx = np.where(m[yy.min():yy.max() + 1].sum(0) > 2)[0]   # bỏ chấm lẻ của nền bg-thumb ở mép
                if not len(xx): continue
                c = (xx.min() + xx.max()) / 2 - 540
                if abs(c) > abs(worst): worst = c
            lech = worst
        elif i == 0:
            lech = 0   # bìa căn trái theo luật (tiêu đề thẳng lề POLY STORE), không xét lệch tâm
        else:
            lech = (xs.min() + xs.max()) / 2 - 540
        if abs(lech) > 24: ghi.append('khối nội dung lệch tâm ngang %+dpx' % lech)
    if m[SAFE_B:, :].sum() > 400: ghi.append('có chi tiết dưới y %d (vùng nút TikTok)' % SAFE_B)
    print('%s: %s' % (f, 'OK' if not ghi else ' | '.join(ghi))); loi += len(ghi)
    tiles.append(im.resize((270, 360)))
if out:
    c = Image.new('RGB', (len(tiles) * 276, 360), 'white')
    for i, t in enumerate(tiles): c.paste(t, (i * 276, 0))
    c.save(out); print('->', out)
# 3. Đọc log dựng: hộp chữ tiêu đề phải nằm trong lề an toàn
lg = os.path.join(d, 'log'); 
if os.path.isdir(lg):
    lf = sorted((os.path.getmtime(os.path.join(lg, x)), x) for x in os.listdir(lg) if x.endswith('.log'))
    if lf:
        for line in open(os.path.join(lg, lf[-1][1]), encoding='utf-8', errors='replace'):
            for q in re.findall(r'(?<!anh )(\d+),(\d+),(\d+),(\d+)', line):   # bỏ khung ảnh máy (log iPad ghi 'anh l,t,r,b'): ảnh được ra sát lề hơn chữ
                x0, y0, x1, y1 = map(int, q)
                if x0 < SAFE_L or x1 > SAFE_R:
                    print('log: %s -> hộp chữ x %d–%d vượt lề an toàn %d–%d (giảm cỡ chữ / maxW 884)' % (line.split()[0], x0, x1, SAFE_L, SAFE_R)); loi += 1
print('LOI BO CUC', loi)
