# Ve anh trang tri cho 4 theme Photoshop Noel them (fen 14/11 21h "thêm theme christmas": Đỏ nhung, Trắng tuyết, Ảnh thật, Đêm xanh).
# Ve bang PIL, to gap 3 roi thu nho. Ra thu muc: python3 noel-tao-anh.py <thu muc ra>
# Anh chung (chau do / xanh / trang, keo gay, day den, phieu, tem, dau, soc) lay tu noel-poly-christmas/anh; file nay ve them:
#   nen-do-1/2.jpg (do nhung + la thong xanh dam o goc), nen-sang-1/2.jpg (kem trang + la thong xanh xam nhat),
#   nen-dem-1/2.jpg (xanh dem + tuyet roi + sao vang + rang thong xa), chau-vang.png, soc-hong.png, soc-xanh-duong.png, tuyet-sang.png
import math, random, sys, os
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else "anh-noel"
os.makedirs(OUT, exist_ok=True)
S = 3
W, H = 1080, 1440


def hexc(h, a=255):
    h = h.lstrip("#"); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def nho(im, w, h):
    return im.resize((w, h), Image.LANCZOS)


def nhanh_thong(dr, x0, y0, goc, dai, mau, kim=58, day=4, cong=0.0, rnd=None):
    rnd = rnd or random
    n = int(dai / (7 * S)); pts = []
    for i in range(n + 1):
        t = i / n
        px = x0 + math.cos(goc) * dai * t + math.cos(goc + math.pi / 2) * cong * 60 * S * t * t
        py = y0 + math.sin(goc) * dai * t + math.sin(goc + math.pi / 2) * cong * 60 * S * t * t
        pts.append((px, py, goc + cong * t))
    dr.line([(p[0], p[1]) for p in pts], fill=mau, width=int(day * S * 1.3))
    for i, (px, py, g) in enumerate(pts):
        t = i / n
        L = kim * S * (0.45 + 0.55 * math.sin(math.pi * min(1, t * 1.15))) * (0.85 + 0.3 * rnd.random())
        for sd in (-1, 1):
            a = g + sd * math.radians(58 + rnd.uniform(-10, 10))
            dr.line([(px, py), (px + math.cos(a) * L, py + math.sin(a) * L)], fill=mau, width=int(day * S))


def sao(d, cx, cy, r, mau):
    pts = []
    for i in range(8):
        a = i * math.pi / 4 - math.pi / 2
        rr = r if i % 2 == 0 else r * 0.22
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    d.polygon(pts, fill=mau)


def bong_tuyet(d, cx, cy, r, mau, w):
    # bong tuyet 6 canh net manh
    for k in range(6):
        a = k * math.pi / 3
        x2, y2 = cx + math.cos(a) * r, cy + math.sin(a) * r
        d.line([(cx, cy), (x2, y2)], fill=mau, width=w)
        for f in (0.55,):
            bx, by = cx + math.cos(a) * r * f, cy + math.sin(a) * r * f
            for s in (-1, 1):
                b = a + s * math.radians(40)
                d.line([(bx, by), (bx + math.cos(b) * r * 0.3, by + math.sin(b) * r * 0.3)], fill=mau, width=w)


def nen(ten, goc_mau, quang, lop, toi_giua, hat, sao_mau, guong=False, seed=1, nhung=0, tuyet_roi=0, rang=None, bong=0, goc=None, so_nhanh=4, dai=(380, 640)):
    rnd = random.Random(seed)
    base = Image.new("RGBA", (W * S, H * S), hexc(goc_mau))
    q = Image.new("RGBA", base.size, (0, 0, 0, 0)); d = ImageDraw.Draw(q)
    d.ellipse([W * S * 0.05, -H * S * 0.15, W * S * 1.0, H * S * 0.75], fill=hexc(quang[0], quang[1]))
    q = q.filter(ImageFilter.GaussianBlur(320))
    base = Image.alpha_composite(base, q)
    if rang:          # rang thong xa o day (dem xanh): tam giac xep tang, mo nhe
        R = Image.new("RGBA", base.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(R)
        x = -40
        while x < W + 40:
            h = rnd.uniform(160, 330); w = h * rnd.uniform(0.42, 0.55); yb = H - rnd.uniform(40, 120)
            for t in range(4):
                tt = t / 4
                dr.polygon([((x) * S, (yb - h * (1 - tt)) * S), ((x - w * (0.35 + tt * 0.5)) * S, (yb - h * (0.62 - tt * 0.55)) * S), ((x + w * (0.35 + tt * 0.5)) * S, (yb - h * (0.62 - tt * 0.55)) * S)], fill=hexc(rang, 255))
            x += rnd.uniform(70, 130)
        R = R.filter(ImageFilter.GaussianBlur(3 * S))
        base = Image.alpha_composite(base, R)
    goc_ds = goc or [(-40, -60, 30), (W + 40, -40, 150), (-60, H * 0.55, -10), (W + 60, H * 0.45, 190), (W * 0.3, H + 60, -70), (W * 0.85, H + 40, -110), (W * 0.55, -80, 100)]
    for k, (mau, a, mo, day, kim) in enumerate(lop):
        L = Image.new("RGBA", base.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        for j in range(so_nhanh + k * 2):
            x, y, g = goc_ds[rnd.randrange(len(goc_ds))]
            x += rnd.uniform(-160, 160); y += rnd.uniform(-160, 160)
            g = math.radians(g + rnd.uniform(-25, 25))
            nhanh_thong(d, x * S, y * S, g, rnd.uniform(dai[0], dai[1]) * S, hexc(mau, a), kim=46 * kim, day=day, cong=rnd.uniform(-0.6, 0.6), rnd=rnd)
            for c in range(2):
                t = rnd.uniform(0.3, 0.7)
                nhanh_thong(d, (x + math.cos(g) * 500 * t) * S, (y + math.sin(g) * 500 * t) * S, g + rnd.choice([-1, 1]) * math.radians(rnd.uniform(35, 55)), rnd.uniform(160, 300) * S, hexc(mau, a), kim=34 * kim, day=day * 0.85, rnd=rnd)
        L = L.filter(ImageFilter.GaussianBlur(mo * S))
        base = Image.alpha_composite(base, L)
    v = Image.new("RGBA", base.size, (0, 0, 0, 0)); d = ImageDraw.Draw(v)
    d.ellipse([W * S * 0.12, H * S * 0.12, W * S * 0.88, H * S * 0.88], fill=hexc(toi_giua[0], toi_giua[1]))
    v = v.filter(ImageFilter.GaussianBlur(120 * S))
    base = Image.alpha_composite(base, v)
    im = nho(base, W, H)
    if nhung:          # van nhung: hat min + van doc rat nhe
        n = Image.effect_noise((W, H), 28).convert("L")
        hn = Image.merge("RGBA", (n, n, n, Image.new("L", (W, H), nhung)))
        im = Image.alpha_composite(im, hn)
    d = ImageDraw.Draw(im)
    for i in range(hat[1]):
        x, y, r = rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(1.4, 3.8)
        d.ellipse([x - r, y - r, x + r, y + r], fill=hexc(hat[0], int(rnd.uniform(110, 220))))
    if tuyet_roi or bong:
        big = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); db = ImageDraw.Draw(big)
        for i in range(bong):
            bong_tuyet(db, rnd.uniform(20, W - 20) * S, rnd.uniform(20, H - 200) * S, rnd.uniform(9, 20) * S, hexc(hat[0], int(rnd.uniform(90, 170))), int(1.6 * S))
        big = nho(big, W, H)
        im = Image.alpha_composite(im, big)
    d = ImageDraw.Draw(im)
    big = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); db = ImageDraw.Draw(big)
    for i in range(14):
        x, y = rnd.uniform(30, W - 30), rnd.uniform(30, H - 30)
        sao(db, x * S, y * S, rnd.uniform(8, 16) * S, hexc(rnd.choice(sao_mau), 230))
    im = Image.alpha_composite(im, nho(big, W, H))
    im = im.convert("RGB")
    if guong: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im.save(os.path.join(OUT, ten), quality=92)


def chau(ten, mau, sang, toi, size=260):
    Wc = Hc = size
    im = Image.new("RGBA", (Wc * S, int(Hc * 1.18) * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    top = int(Hc * 0.18) * S
    cx, cy, r = Wc * S / 2, top + Hc * S / 2, Hc * S / 2 - 2 * S
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=hexc(mau))
    t = Image.new("RGBA", im.size, (0, 0, 0, 0)); dt = ImageDraw.Draw(t)
    dt.ellipse([cx - r * 0.9, cy - r * 0.15, cx + r * 1.15, cy + r * 1.2], fill=hexc(toi, 200))
    t = t.filter(ImageFilter.GaussianBlur(r * 0.22))
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    im = Image.composite(Image.alpha_composite(im, t), im, m)
    s = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(s)
    ds.ellipse([cx - r * 0.85, cy - r * 0.9, cx + r * 0.2, cy - r * 0.05], fill=hexc(sang, 150))
    s = s.filter(ImageFilter.GaussianBlur(r * 0.18))
    im = Image.composite(Image.alpha_composite(im, s), im, m)
    d = ImageDraw.Draw(im)
    d.ellipse([cx - r * 0.55, cy - r * 0.62, cx - r * 0.25, cy - r * 0.38], fill=(255, 255, 255, 200))
    cw, ch = r * 0.42, r * 0.26
    d.rounded_rectangle([cx - cw / 2, cy - r - ch + 4 * S, cx + cw / 2, cy - r + 6 * S], radius=4 * S, fill=hexc("C9A24A"))
    for k in range(4):
        x = cx - cw / 2 + cw * (k + 0.5) / 4
        d.line([(x, cy - r - ch + 8 * S), (x, cy - r + 2 * S)], fill=hexc("A8842F"), width=2 * S)
    d.ellipse([cx - r * 0.1, cy - r - ch - r * 0.16, cx + r * 0.1, cy - r - ch + r * 0.04], outline=hexc("C9A24A"), width=3 * S)
    nho(im, Wc, int(Hc * 1.18)).save(os.path.join(OUT, ten))


def soc(ten, mau, a, w=1200, h=300, b=26, khoang=58):
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for k in range(-20, int(w / khoang) + 20):
        x0 = k * khoang * S
        d.polygon([(x0, h * S), (x0 + b * S, h * S), (x0 + b * S + h * S, 0), (x0 + h * S, 0)], fill=hexc(mau, a))
    nho(im, w, h).save(os.path.join(OUT, ten))


def tuyet(ten, w=1080, h=190, seed=3, mau="F4F7F6", bong_m="D9E4E2", vien=None):
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(0, h * S)]; n = 60
    ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    for i in range(n + 1):
        x = w * S * i / n
        y = h * S * (0.42 + 0.10 * math.sin(i / n * 6.28 * 2 + ph[0]) + 0.06 * math.sin(i / n * 6.28 * 5 + ph[1]) + 0.03 * math.sin(i / n * 6.28 * 11 + ph[2]))
        pts.append((x, y))
    pts.append((w * S, h * S))
    d.polygon(pts, fill=hexc(mau))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); dsh = ImageDraw.Draw(sh)
    dsh.polygon([(x, y + 22 * S) for (x, y) in pts[1:-1]] + [(w * S, h * S), (0, h * S)], fill=hexc(bong_m, 170))
    sh = sh.filter(ImageFilter.GaussianBlur(10 * S))
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    im = Image.composite(Image.alpha_composite(im, sh), im, m)
    d = ImageDraw.Draw(im)
    if vien:
        d.line(pts[1:-1], fill=hexc(vien), width=3 * S)
    for i in range(40):
        x, y, r = rnd.uniform(0, w), rnd.uniform(h * 0.55, h), rnd.uniform(1.5, 3)
        d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=hexc("C9D6D4", 200))
    nho(im, w, h).save(os.path.join(OUT, ten))


# Do nhung: do ruou vang, la thong xanh dam o goc, van nhung, sao vang
for i, (sd, g) in enumerate([(31, False), (47, True)]):
    nen("nen-do-%d.jpg" % (i + 1), "5A0A15", ("8E1B2A", 210), [("0A2A1A", 235, 8, 9, 1.0), ("123A25", 225, 3.5, 7, 1.1), ("1A4A30", 210, 1.4, 5, 1.2)], ("5A0A15", 140), ("FFFFFF", 60), ["F5C542", "FFFFFF", "F5C542"], guong=g, seed=sd, nhung=30)
# Trang tuyet: kem sang, la thong xanh xam rat nhat, bong tuyet xam xanh, sao vang + do
for i, (sd, g) in enumerate([(53, False), (61, True)]):
    nen("nen-sang-%d.jpg" % (i + 1), "F7F3EC", ("FFFFFF", 0), [("D3DED5", 210, 2.2, 5, 0.95), ("BACDBF", 230, 0.7, 4, 1.0)], ("F7F3EC", 0), ("A9BCC4", 50), ["E0B54A", "D8433A", "E0B54A"], guong=g, seed=sd, bong=10,
        goc=[(-60, -40, 35), (W + 50, -50, 145), (-70, H * 0.42, 5), (W + 60, H * 0.5, 185)], so_nhanh=2, dai=(240, 400))
# Dem xanh: navy, quang sang tren, rang thong xa o day, tuyet roi + bong tuyet, sao vang
for i, (sd, g) in enumerate([(71, False), (83, True)]):
    nen("nen-dem-%d.jpg" % (i + 1), "0B1631", ("22406F", 210), [], ("0B1631", 120), ("FFFFFF", 130), ["F5C542", "FFFFFF", "F5C542", "F5C542"], guong=g, seed=sd, rang="09122A", bong=12)
chau("chau-vang.png", "C99A33", "F6DD95", "7A5814")
chau("chau-xanh-duong.png", "2D5FB8", "8FB4F0", "142F66")
soc("soc-hong.png", "FFC9CF", 255)
soc("soc-xanh-duong.png", "C8DAF7", 255)
soc("soc-vang.png", "FFFFFF", 110)
tuyet("tuyet-sang.png", mau="FFFFFF", bong_m="C9D5DC", vien="D6DEE2")
print("xong", sorted(os.listdir(OUT)))
