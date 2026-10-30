# Lấy ảnh hãng ĐÚNG ĐỘ PHÂN GIẢI GỐC bằng trình duyệt trong app (mỗi lần zoom chỉ chụp được 685x600).
# B1. Mở link ảnh, chạy JS dựng khung (xem mục 6 BAT-DAU-TU-DAY-DESIGN.md), đặt <img id=z> đúng cỡ gốc.
# B2. Lên kế hoạch ô:   python3 prep/ghep_o.py ke-hoach x0 y0 x1 y1
#       (x0..y1 = vùng máy trong ảnh gốc) -> in danh sách (left, top) cho từng ô.
# B3. Mỗi ô: JS  z.style.left=left+'px'; z.style.top=top+'px'  rồi zoom [0,0,685,600] scale 1.
# B4. Ghép:  python3 prep/ghep_o.py ghep ra.png RONG CAO left,top,file.png left,top,file.png ...
#       (left/top là số âm như đã đặt ở B3; file là ảnh zoom trong thư mục tool-results)
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys
from PIL import Image
TW, TH = 685, 600
cmd = sys.argv[1]
if cmd == 'ke-hoach':
    x0, y0, x1, y1 = map(int, sys.argv[2:6])
    def steps(a, b, t):
        if b - a <= t: return [a]
        n = -(-(b - a) // (t - 20)); st = (b - a - t) / (n - 1) if n > 1 else 0
        return [round(a + i * st) for i in range(n)]
    xs = steps(x0, x1, TW); ys = steps(y0, y1, TH)
    print('%d o:' % (len(xs) * len(ys)), ' '.join('(%d,%d)' % (-x, -y) for y in ys for x in xs))
elif cmd == 'ghep':
    out, W, H = sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
    c = Image.new('RGB', (W, H), (255, 255, 255))
    for it in sys.argv[5:]:
        l, t, f = it.split(',', 2)
        c.paste(Image.open(f).convert('RGB'), (-int(l), -int(t)))
    c.save(out); print(out, c.size)
