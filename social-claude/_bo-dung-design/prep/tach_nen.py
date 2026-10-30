# Đặt ảnh máy lên nền studio tối, ra khung đúng cỡ cho shot().
# - Ảnh chụp thật: tách nền bằng PHOTOSHOP trước (code/tach_nen_ps.py, Select Subject) rồi đưa PNG nền trong vào đây.
# - Ảnh hãng nền trắng (PSREF...): tách luôn ở đây bằng ngưỡng (--thr/--bong).
# Dùng:
#   python3 prep/tach_nen.py goc.png ra.png [--thr 242] [--bong 90] [--w 884] [--h 510]
#   --thr : điểm ảnh có kênh thấp nhất < thr là thân máy (máy bạc/xám: 240-245; máy đen: 150)
#   --bong: bỏ bóng đổ xám DƯỚI đáy máy. Đáy máy lấy theo ngưỡng này (máy đen: 90). Bỏ trống = không lọc bóng.
#   Ảnh vào đã có nền trong suốt (vd tách bằng Photoshop: code/tach_nen_ps.py) thì chỉ đặt lên nền studio.
# In ra tỉ lệ co giãn: > 1.0 là ảnh bị PHÓNG TO -> tìm ảnh nguồn to hơn (luật 18: không phóng quá 1.0 với ảnh máy).
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, argparse
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage

def studio(PW, PH, glow_y=0.6):
    y = np.linspace(0, 1, PH)[:, None]
    top = np.array([58, 64, 76]); bot = np.array([16, 19, 25])
    g = top * (1 - y) ** 1.2 + bot * (1 - (1 - y) ** 1.2)
    base = np.repeat(g[:, None, :], PW, axis=1)
    yy, xx = np.mgrid[0:PH, 0:PW]
    r = np.sqrt(((xx - PW / 2) / (PW * 0.58)) ** 2 + ((yy - PH * glow_y) / (PH * 0.55)) ** 2)
    base = base + (np.clip(1 - r, 0, 1) ** 1.8)[..., None] * np.array([44, 50, 60])
    return Image.fromarray(np.clip(base, 0, 255).astype('uint8')).convert('RGBA')

def _mask(mn, thr):
    m = mn < thr
    m = ndimage.binary_opening(m, iterations=2)
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n == 0: raise SystemExit('Không thấy máy: thử tăng --thr')
    s = ndimage.sum(m, lab, range(1, n + 1))
    return lab == (1 + int(np.argmax(s)))

def tach(im, thr=242, bong=None):
    im = im.convert('RGB'); mn = np.asarray(im).astype(int).min(2)
    m = _mask(mn, thr)
    if bong:
        md = _mask(mn, bong); H = mn.shape[0]
        bot = np.where(md.any(0), H - 1 - np.argmax(md[::-1], axis=0), -1)
        m = m & (np.arange(H)[:, None] <= bot[None, :] + 1)
    m = ndimage.binary_erosion(m, iterations=1)
    al = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.9))
    o = im.convert('RGBA'); o.putalpha(al)
    return o.crop(o.getbbox())

def panel(lap, PW=884, PH=510, sw=0.80, sh=0.86):
    bg = studio(PW, PH); sc = min(PW * sw / lap.width, PH * sh / lap.height)
    lap = lap.resize((round(lap.width * sc), round(lap.height * sc)), Image.LANCZOS)
    x0 = (PW - lap.width) // 2; y0 = PH - lap.height - round(PH * 0.07)
    s = Image.new('L', (PW, PH), 0)
    ImageDraw.Draw(s).ellipse((x0 + lap.width * 0.06, y0 + lap.height - 14, x0 + lap.width * 0.94, y0 + lap.height + 16), fill=160)
    bg = Image.composite(Image.new('RGBA', (PW, PH), (0, 0, 0, 255)), bg, s.filter(ImageFilter.GaussianBlur(16)))
    bg.alpha_composite(lap, (x0, y0))
    return bg.convert('RGB'), sc

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('vao'); ap.add_argument('ra')
    ap.add_argument('--thr', type=int, default=242); ap.add_argument('--bong', type=int)
    ap.add_argument('--w', type=int, default=884); ap.add_argument('--h', type=int, default=510)
    a = ap.parse_args()
    im = Image.open(a.vao)
    if im.mode in ('RGBA', 'LA') and im.getchannel('A').getextrema()[0] < 128:
        c = im.convert('RGBA'); c = c.crop(c.getbbox())          # ảnh đã tách nền (vd Photoshop Select Subject)
    else:
        c = tach(im, a.thr, a.bong)
    p, sc = panel(c, a.w, a.h); p.save(a.ra)
    print(a.ra, p.size, 'may', c.size, 'ti le %.2f' % sc, '-> PHONG TO, tim anh to hon!' if sc > 1.02 else 'ok')
