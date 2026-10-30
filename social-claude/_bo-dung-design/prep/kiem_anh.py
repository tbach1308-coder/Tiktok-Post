# Tự soi ảnh TRƯỚC khi dựng Photoshop (bớt vòng duyệt) và soi slide SAU khi dựng.
# 1) Soi tài nguyên:  python3 prep/kiem_anh.py tai-nguyen  <thu-muc-anh>  <file-slides.jsx>  [soi-vien.png]
#    - mọi file gọi trong shot("f", w, l, t, h) phải đúng w x h, placeAt/nền phải có thật
#    - độ nét: ảnh gốc ~0.78-0.90; < 0.70 là MỀM (đã bị phóng to ~1.2x trở lên) -> tìm ảnh nguồn to hơn
#    - ra soi-vien.png: cắt phóng 2x mép trên + mép đáy từng ảnh máy p-*.png để soi viền lem / dải bóng xám
# 2) Soi slide:  python3 prep/kiem_anh.py slide <thu-muc-co-slide-0N.png> <ra.png>
#    - ra 1 ảnh ghép các slide cỡ nhỏ để nhìn tổng thể, in độ nét vùng ảnh từng slide
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, os, re
import numpy as np
from PIL import Image
from scipy import ndimage

def net(im):
    # tỉ lệ chi tiết mịn / chi tiết vừa. Ảnh gốc không phóng: ~0.78-0.90. Phóng 1.2x: ~0.70. Phóng 1.6x: ~0.55.
    a = np.asarray(im.convert('L')).astype(float)
    b1 = ndimage.gaussian_filter(a, 0.8); b2 = ndimage.gaussian_filter(a, 2.0)
    return float(np.abs(a - b1).mean() / (np.abs(b1 - b2).mean() + 1e-6))

mode = sys.argv[1]
if mode == 'tai-nguyen':
    d, js = sys.argv[2], sys.argv[3]
    src = open(js, encoding='utf-8').read()
    loi = 0; seen = set()
    def chk(f, w=None, h=None):
        global loi
        seen.add(f); p = os.path.join(d, f)
        if not os.path.exists(p): print('THIEU', f); loi += 1; return
        im = Image.open(p); n = net(im); ok = (w is None) or im.size == (int(w), int(h))
        print('%-22s %-10s %s net %.2f%s%s' % (f, '%dx%d' % im.size, ('can %sx%s' % (w, h)) if w else '          ', n,
              '' if ok else '  <- SAI CO', '  <- MEM (anh bi phong to, tim nguon to hon)' if (n < 0.70 and not f.startswith('bg-')) else ''))
        loi += (not ok)
    for f, w, h in re.findall(r'shot\(\s*"([^"]+)"\s*,\s*(\d+)\s*,\s*\d+\s*,\s*\w+\s*,\s*(\d+)', src): chk(f, w, h)
    tpl = re.search(r'shot\(\s*img\s*,\s*(\d+)\s*,\s*\d+\s*,\s*\w+\s*,\s*(\d+)', src)
    nslide = len(re.search(r'var FN = \[([^\]]*)\]', src).group(1).split(',')) - 1
    for f in sorted(set(re.findall(r'"([^"]+\.png)"', src)) - seen):
        if f.startswith('bg-'): chk(f); continue
        chk(f, *(tpl.groups() if tpl else (None, None)))
    if '"bg-" + n' in src:
        for k in range(2, nslide + 1):
            if 'bg-%d.png' % k not in seen: chk('bg-%d.png' % k)
    ps = sorted(x for x in os.listdir(d) if x.startswith('p-') and x.endswith('.png'))
    if ps:
        rows = []
        for f in ps:
            im = Image.open(os.path.join(d, f)).convert('RGB'); W, H = im.size
            top = im.crop((W // 8, 0, W * 7 // 8, H // 5)); top = top.resize((top.width * 2, top.height * 2))
            bot = im.crop((W // 8, H * 3 // 4, W * 7 // 8, H)); bot = bot.resize((bot.width * 2, bot.height * 2))
            rows += [top, bot]
        S = Image.new('RGB', (max(r.width for r in rows), sum(r.height + 8 for r in rows)), 'white'); y = 0
        for r in rows: S.paste(r, (0, y)); y += r.height + 8
        sv = sys.argv[4] if len(sys.argv) > 4 else 'soi-vien.png'; S.save(sv); print('->', sv, '(mo bang Read, soi vien lem / dai bong xam / vet trang)')
    print('LOI' if loi else 'OK', loi)
elif mode == 'slide':
    d, out = sys.argv[2], sys.argv[3]
    fs = sorted(x for x in os.listdir(d) if re.match(r'slide-\d+\.png$', x))
    ims = [Image.open(os.path.join(d, f)).convert('RGB') for f in fs]
    for f, im in zip(fs, ims): print(f, im.size, 'net vung anh %.2f' % net(im.crop((98, 380, 982, 900))))
    tw = 270; c = Image.new('RGB', (len(ims) * (tw + 6), 360), 'white')
    for i, im in enumerate(ims): c.paste(im.resize((tw, 360)), (i * (tw + 6), 0))
    c.save(out); print('->', out)
