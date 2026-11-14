# Tao anh trang tri cho theme Photoshop "Noel · Poly Christmas" (fen 14/11 17h59 gui banner POLY CHRISTMAS + "theme style nay")
# Ve bang PIL, ve to gap 3 roi thu nho cho min. Chay: python3 tao_anh.py <thu muc ra>
import math, random, sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = sys.argv[1] if len(sys.argv) > 1 else "anh"
os.makedirs(OUT, exist_ok=True)
S = 3  # ve to gap 3

def hexc(h, a=255):
    h = h.lstrip("#"); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)

def nho(im, w, h):
    return im.resize((w, h), Image.LANCZOS)

# ---------- la thong ----------
def nhanh_thong(dr, x0, y0, goc, dai, mau, kim=58, day=4, cong=0.0, rnd=None):
    rnd = rnd or random
    n = int(dai / (7 * S))
    px, py = x0, y0
    pts = []
    for i in range(n + 1):
        t = i / n
        g = goc + cong * t
        px = x0 + math.cos(goc) * dai * t + math.cos(goc + math.pi / 2) * cong * 60 * S * t * t
        py = y0 + math.sin(goc) * dai * t + math.sin(goc + math.pi / 2) * cong * 60 * S * t * t
        pts.append((px, py, g))
    dr.line([(p[0], p[1]) for p in pts], fill=mau, width=int(day * S * 1.3))
    for i, (px, py, g) in enumerate(pts):
        t = i / n
        L = kim * S * (0.45 + 0.55 * math.sin(math.pi * min(1, t * 1.15))) * (0.85 + 0.3 * rnd.random())
        for sd in (-1, 1):
            a = g + sd * math.radians(58 + rnd.uniform(-10, 10))
            dr.line([(px, py), (px + math.cos(a) * L, py + math.sin(a) * L)], fill=mau, width=int(day * S))

def nen(ten, guong=False, seed=1):
    W, H = 1080, 1440
    rnd = random.Random(seed)
    base = Image.new("RGBA", (W * S, H * S), hexc("0F2A1C"))
    # quang sang mo giua tren
    q = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d = ImageDraw.Draw(q)
    d.ellipse([W * S * 0.05, -H * S * 0.15, W * S * 1.0, H * S * 0.75], fill=hexc("1B4430", 200))
    q = q.filter(ImageFilter.GaussianBlur(160 * S / 3 * 2))
    base = Image.alpha_composite(base, q)
    # 3 lop la thong: xa (mo nhieu, toi), giua, gan (sang hon, net hon)
    lop = [("0B2318", 230, 9, 9, 1.0), ("143826", 210, 4, 7, 1.1), ("1C4A32", 190, 1.6, 5, 1.2)]
    goc_ds = [(-40, -60, 30), (W + 40, -40, 150), (-60, H * 0.55, -10), (W + 60, H * 0.45, 190), (W * 0.3, H + 60, -70), (W * 0.85, H + 40, -110), (W * 0.55, -80, 100)]
    for k, (mau, a, mo, day, kim) in enumerate(lop):
        L = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        for j in range(5 + k * 2):
            x, y, g = goc_ds[rnd.randrange(len(goc_ds))]
            x += rnd.uniform(-160, 160); y += rnd.uniform(-160, 160)
            g = math.radians(g + rnd.uniform(-25, 25))
            nhanh_thong(d, x * S, y * S, g, rnd.uniform(380, 640) * S, hexc(mau, a), kim=46 * kim, day=day, cong=rnd.uniform(-0.6, 0.6), rnd=rnd)
            # nhanh con
            for c in range(2):
                t = rnd.uniform(0.3, 0.7)
                nhanh_thong(d, (x + math.cos(g) * 500 * t) * S, (y + math.sin(g) * 500 * t) * S, g + rnd.choice([-1, 1]) * math.radians(rnd.uniform(35, 55)), rnd.uniform(160, 300) * S, hexc(mau, a), kim=34 * kim, day=day * 0.85, rnd=rnd)
        L = L.filter(ImageFilter.GaussianBlur(mo * S))
        base = Image.alpha_composite(base, L)
    # mo nhe vung giua cho chu de doc (lop toi mem o giua)
    v = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0)); d = ImageDraw.Draw(v)
    d.ellipse([W * S * 0.12, H * S * 0.12, W * S * 0.88, H * S * 0.88], fill=hexc("0F2A1C", 150))
    v = v.filter(ImageFilter.GaussianBlur(120 * S))
    base = Image.alpha_composite(base, v)
    # hat tuyet + lap lanh
    d = ImageDraw.Draw(base)
    for i in range(70):
        x, y, r = rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(1.6, 4.2)
        d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=(255, 255, 255, int(rnd.uniform(110, 220))))
    for i in range(12):
        x, y = rnd.uniform(30, W - 30), rnd.uniform(30, H - 30)
        sao(d, x * S, y * S, rnd.uniform(9, 16) * S, hexc(rnd.choice(["F5C542", "FFFFFF", "F5C542"]), 230))
    im = nho(base, W, H).convert("RGB")
    if guong: im = im.transpose(Image.FLIP_LEFT_RIGHT)
    im.save(os.path.join(OUT, ten), quality=92)

def sao(d, cx, cy, r, mau):
    pts = []
    for i in range(8):
        a = i * math.pi / 4 - math.pi / 2
        rr = r if i % 2 == 0 else r * 0.22
        pts.append((cx + math.cos(a) * rr, cy + math.sin(a) * rr))
    d.polygon(pts, fill=mau)

# ---------- chau Noel ----------
def chau(ten, mau, sang, toi, size=260):
    W = H = size
    im = Image.new("RGBA", (W * S, int(H * 1.18) * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    top = int(H * 0.18) * S
    cx, cy, r = W * S / 2, top + H * S / 2, H * S / 2 - 2 * S
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=hexc(mau))
    # toi day (mem)
    t = Image.new("RGBA", im.size, (0, 0, 0, 0)); dt = ImageDraw.Draw(t)
    dt.ellipse([cx - r * 0.9, cy - r * 0.15, cx + r * 1.15, cy + r * 1.2], fill=hexc(toi, 200))
    t = t.filter(ImageFilter.GaussianBlur(r * 0.22))
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    im = Image.composite(Image.alpha_composite(im, t), im, m)
    # sang tren trai
    s = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(s)
    ds.ellipse([cx - r * 0.85, cy - r * 0.9, cx + r * 0.2, cy - r * 0.05], fill=hexc(sang, 150))
    s = s.filter(ImageFilter.GaussianBlur(r * 0.18))
    im = Image.composite(Image.alpha_composite(im, s), im, m)
    d = ImageDraw.Draw(im)
    d.ellipse([cx - r * 0.55, cy - r * 0.62, cx - r * 0.25, cy - r * 0.38], fill=(255, 255, 255, 200))
    # nap vang + khoen
    cw, ch = r * 0.42, r * 0.26
    d.rounded_rectangle([cx - cw / 2, cy - r - ch + 4 * S, cx + cw / 2, cy - r + 6 * S], radius=4 * S, fill=hexc("C9A24A"))
    for k in range(4):
        x = cx - cw / 2 + cw * (k + 0.5) / 4
        d.line([(x, cy - r - ch + 8 * S), (x, cy - r + 2 * S)], fill=hexc("A8842F"), width=2 * S)
    d.ellipse([cx - r * 0.1, cy - r - ch - r * 0.16, cx + r * 0.1, cy - r - ch + r * 0.04], outline=hexc("C9A24A"), width=3 * S)
    nho(im, W, int(H * 1.18)).save(os.path.join(OUT, ten))

# ---------- keo gay ----------
def keo_gay(ten, w=170, h=420):
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0))
    m = Image.new("L", im.size, 0); dm = ImageDraw.Draw(m)
    day = 30 * S
    x = w * S * 0.68
    r = w * S * 0.33
    cy = r + day
    # than thang
    dm.line([(x, cy), (x, h * S - day)], fill=255, width=day)
    dm.ellipse([x - day / 2, h * S - day - day / 2, x + day / 2, h * S - day + day / 2], fill=255)
    # moc cong (nua tron sang trai)
    cx = x - r
    dm.arc([cx - r, cy - r, cx + r, cy + r], 180, 360, fill=255, width=day)
    ex = cx - r
    dm.line([(ex, cy - 2 * S), (ex, cy + r * 0.45)], fill=255, width=day)
    dm.ellipse([ex - day / 2, cy + r * 0.45 - day / 2, ex + day / 2, cy + r * 0.45 + day / 2], fill=255)
    trang = Image.new("RGBA", im.size, hexc("FBF6EE"))
    soc = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(soc)
    b = 26 * S
    for k in range(-40, 60):
        x0 = k * b * 1.6
        ds.polygon([(x0, 0), (x0 + b, 0), (x0 + b + h * S * 0.9, h * S), (x0 + h * S * 0.9, h * S)], fill=hexc("E23B32"))
    soc = soc.transform(soc.size, Image.AFFINE, (1, 0, 0, 0, 1, 0))
    keo = Image.alpha_composite(trang, soc)
    # sang mem 1 ben
    out = Image.new("RGBA", im.size, (0, 0, 0, 0)); out.paste(keo, (0, 0), m)
    nho(out, w, h).save(os.path.join(OUT, ten))

# ---------- soc ke de lot chu (sọc chéo) ----------
def soc(ten, mau, a, w=1200, h=300, b=26, khoang=58):
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for k in range(-20, int(w / khoang) + 20):
        x0 = k * khoang * S
        d.polygon([(x0, h * S), (x0 + b * S, h * S), (x0 + b * S + h * S, 0), (x0 + h * S, 0)], fill=hexc(mau, a))
    nho(im, w, h).save(os.path.join(OUT, ten))

# ---------- phieu uu dai (vien thu may bay soc do / xanh, giay kem) ----------
def phieu(ten, w=480, h=280):
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    r = 10 * S
    d.rounded_rectangle([0, 0, w * S - 1, h * S - 1], radius=r, fill=hexc("F4EBDD"))
    # soc vien
    v = 16 * S
    st = Image.new("RGBA", im.size, (0, 0, 0, 0)); ds = ImageDraw.Draw(st)
    b, kh = 14 * S, 42 * S
    mau = ["D63A32", "F4EBDD", "1F6B45", "F4EBDD"]
    k = 0
    for x0 in range(-h * S, w * S + h * S, int(kh / 2)):
        ds.polygon([(x0, h * S), (x0 + b, h * S), (x0 + b + h * S, 0), (x0 + h * S, 0)], fill=hexc(mau[k % 4]))
        k += 1
    m = Image.new("L", im.size, 0); dm = ImageDraw.Draw(m)
    dm.rounded_rectangle([0, 0, w * S - 1, h * S - 1], radius=r, fill=255)
    dm.rectangle([v, v, w * S - v, h * S - v], fill=0)
    im.paste(st, (0, 0), m)
    d = ImageDraw.Draw(im)
    d.rectangle([v, v, w * S - v, h * S - v], fill=hexc("F4EBDD"))
    d.line([(v, v), (w * S - v, v), (w * S - v, h * S - v), (v, h * S - v), (v, v)], fill=hexc("E2D5C0"), width=2 * S)
    nho(im, w, h).save(os.path.join(OUT, ten))

# ---------- tem (rang cua) ----------
def tem(ten, mau, w=104, h=124):
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, w * S, h * S], fill=hexc("FFFFFF"))
    rr = 5 * S; buoc = 13 * S
    for x in range(int(buoc / 2), w * S, buoc):
        d.ellipse([x - rr, -rr, x + rr, rr], fill=(0, 0, 0, 0)); d.ellipse([x - rr, h * S - rr, x + rr, h * S + rr], fill=(0, 0, 0, 0))
    for y in range(int(buoc / 2), h * S, buoc):
        d.ellipse([-rr, y - rr, rr, y + rr], fill=(0, 0, 0, 0)); d.ellipse([w * S - rr, y - rr, w * S + rr, y + rr], fill=(0, 0, 0, 0))
    m = 11 * S
    d.rectangle([m, m, w * S - m, h * S - m], fill=hexc(mau))
    d.rectangle([m + 4 * S, m + 4 * S, w * S - m - 4 * S, h * S - m - 4 * S], outline=hexc("F5C542"), width=2 * S)
    nho(im, w, h).save(os.path.join(OUT, ten))

# ---------- dau buu dien (vong tron xam) ----------
def dau(ten, size=110):
    im = Image.new("RGBA", (size * S, size * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    c = size * S / 2
    d.ellipse([2 * S, 2 * S, size * S - 2 * S, size * S - 2 * S], outline=hexc("8A8F8A", 200), width=3 * S)
    d.ellipse([12 * S, 12 * S, size * S - 12 * S, size * S - 12 * S], outline=hexc("8A8F8A", 200), width=2 * S)
    nho(im, size, size).save(os.path.join(OUT, ten))

# ---------- tuyet day ----------
def tuyet(ten, w=1080, h=190, seed=3):
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = [(0, h * S)]
    n = 60
    ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    for i in range(n + 1):
        x = w * S * i / n
        y = h * S * (0.42 + 0.10 * math.sin(i / n * 6.28 * 2 + ph[0]) + 0.06 * math.sin(i / n * 6.28 * 5 + ph[1]) + 0.03 * math.sin(i / n * 6.28 * 11 + ph[2]))
        pts.append((x, y))
    pts.append((w * S, h * S))
    d.polygon(pts, fill=hexc("F4F7F6"))
    # bong xanh nhat duoi mep
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); dsh = ImageDraw.Draw(sh)
    dsh.polygon([(x, y + 22 * S) for (x, y) in pts[1:-1]] + [(w * S, h * S), (0, h * S)], fill=hexc("D9E4E2", 160))
    sh = sh.filter(ImageFilter.GaussianBlur(10 * S))
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    im = Image.composite(Image.alpha_composite(im, sh), im, m)
    d = ImageDraw.Draw(im)
    for i in range(40):
        x, y, r = rnd.uniform(0, w), rnd.uniform(h * 0.55, h), rnd.uniform(1.5, 3)
        d.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=hexc("C9D6D4", 200))
    nho(im, w, h).save(os.path.join(OUT, ten))

# ---------- day den ----------
def day_den(ten, w=760, h=150, seed=5):
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    pts = []
    n = 80
    for i in range(n + 1):
        t = i / n
        x = w * S * t
        y = h * S * (0.22 + 0.28 * math.sin(t * math.pi * 2.0) ** 2)
        pts.append((x, y))
    d.line(pts, fill=hexc("2A3B2F"), width=3 * S)
    mau = ["E23B32", "F5C542", "3FA66A", "4FA3E0", "F08A3C", "E23B32", "F5C542", "3FA66A", "F08A3C"]
    k = 0
    for i in range(4, n, 9):
        x, y = pts[i]
        c = mau[k % len(mau)]; k += 1
        a = math.radians(rnd.uniform(-20, 20))
        bw, bh = 18 * S, 30 * S
        bulb = Image.new("RGBA", (int(bw * 2), int(bh * 2)), (0, 0, 0, 0)); db = ImageDraw.Draw(bulb)
        db.rectangle([bw - 6 * S, 0, bw + 6 * S, 10 * S], fill=hexc("6B7A70"))
        db.ellipse([bw - bw / 2, 8 * S, bw + bw / 2, 8 * S + bh], fill=hexc(c))
        db.ellipse([bw - bw / 4, 12 * S, bw - 1 * S, 22 * S], fill=(255, 255, 255, 150))
        bulb = bulb.rotate(math.degrees(a), resample=Image.BICUBIC, center=(bw, 0))
        im.alpha_composite(bulb, (int(x - bw), int(y)))
    nho(im, w, h).save(os.path.join(OUT, ten))

nen("nen-1.jpg", False, 11)
nen("nen-2.jpg", True, 23)
chau("chau-do.png", "D8322B", "FF7B6E", "8E1712")
chau("chau-xanh.png", "1E7A4A", "5FC08A", "0E4428")
chau("chau-trang.png", "E9EDEF", "FFFFFF", "A9B3B8")
keo_gay("keo-gay.png")
soc("soc-trang.png", "FFFFFF", 95)
soc("soc-xanh.png", "BFE3CF", 255)
phieu("phieu.png")
tem("tem-xanh.png", "1F6B45")
tem("tem-do.png", "C62E27")
dau("dau-buu-dien.png")
tuyet("tuyet.png")
day_den("day-den.png")
print("xong", sorted(os.listdir(OUT)))
