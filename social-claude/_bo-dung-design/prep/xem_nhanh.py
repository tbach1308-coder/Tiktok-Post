# Xem NHIỀU ẢNH trong 1 lần Read: ghép thành 1 bảng có tên file + cỡ gốc dưới mỗi ô.
# Bài mini 8 (28/10) đọc 34 ảnh từng cái một -> mỗi lần Read là 1 lượt Claude chờ. Ghép lại thì 1 lượt.
# Dùng:  python prep/xem_nhanh.py "<ra.jpg>" "<ảnh hoặc thư mục>" ["<ảnh hoặc thư mục>" ...] [--o 360] [--cot 4]
#   --o   : cạnh ô (px), mặc định 360;  --cot : số cột, mặc định 4
#   Thư mục: lấy mọi .jpg .jpeg .png .webp (không vào thư mục con). Ảnh có nền trong được đặt trên nền ca rô để soi viền.
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import os, sys
from PIL import Image, ImageDraw, ImageFont

a = sys.argv[1:]
def lay(flag, mac):
    if flag in a:
        i = a.index(flag); v = int(a[i + 1]); del a[i:i + 2]; return v
    return mac
O, COT = lay('--o', 360), lay('--cot', 4)
if len(a) < 2:
    sys.exit('Dùng: python prep/xem_nhanh.py "<ra.jpg>" "<ảnh hoặc thư mục>" ...')
ra, nguon = a[0], a[1:]
fs = []
for x in nguon:
    if os.path.isdir(x):
        fs += sorted(os.path.join(x, f) for f in os.listdir(x) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')))
    elif os.path.isfile(x):
        fs.append(x)
if not fs:
    sys.exit('Không có ảnh nào')
try:
    font = ImageFont.truetype('arial.ttf', 15)
except Exception:
    try:   # Mac: Arial.ttf (chữ hoa) trong /System/Library/Fonts/Supplemental
        font = ImageFont.truetype('Arial.ttf', 15)
    except Exception:
        font = ImageFont.load_default()
CH = 40
hang = (len(fs) + COT - 1) // COT
bang = Image.new('RGB', (COT * O, hang * (O + CH)), (24, 24, 24))
d = ImageDraw.Draw(bang)
ca = Image.new('RGB', (O, O), (200, 200, 200))
dc = ImageDraw.Draw(ca)
for y in range(0, O, 20):
    for x in range(0, O, 20):
        if (x // 20 + y // 20) % 2: dc.rectangle([x, y, x + 19, y + 19], fill=(150, 150, 150))
for i, f in enumerate(fs):
    x, y = (i % COT) * O, (i // COT) * (O + CH)
    try:
        im = Image.open(f); w, h = im.size
        trong = im.mode in ('RGBA', 'LA', 'P')
        im = im.convert('RGBA'); im.thumbnail((O - 8, O - 8))
        o = ca.copy() if trong else Image.new('RGB', (O, O), (40, 40, 40))
        o.paste(im, ((O - im.width) // 2, (O - im.height) // 2), im)
        bang.paste(o, (x, y)); nhan = '%s  %dx%d' % (os.path.basename(f)[:34], w, h)
    except Exception as e:
        nhan = '%s  LỖI %s' % (os.path.basename(f)[:30], e)
    d.text((x + 6, y + O + 4), '%d. %s' % (i + 1, nhan), fill=(235, 235, 235), font=font)
bang.save(ra, quality=88)
print('->', ra, '(%d ảnh, mở bằng Read)' % len(fs))
