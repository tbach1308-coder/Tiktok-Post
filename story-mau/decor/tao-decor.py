# Kho icon decor cho story (fen 17/11 10h45 "thêm story có icon decor như này, hình nền tự thêm", chọn "Cả 2" + 4 dịp):
# PNG nền trong, vẽ bằng PIL to gấp 4 rồi thu nhỏ (mép mịn). Noel lấy thêm ảnh có sẵn của theme Noel kho Photoshop.
# Chạy: python3 story-mau/decor/tao-decor.py   (ghi vào story-mau/decor/<bộ>/*.png, bộ: noel, sale, tet, thuong)
import math, os, random, shutil, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

G = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(G))
FONT = os.path.join(REPO, "story-mau", "fonts")
S = 4
rnd = random.Random(17)


def hx(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def moi(w, h):
    return Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0))


def luu(im, bo, ten, w=None, h=None):
    d = os.path.join(G, bo)
    os.makedirs(d, exist_ok=True)
    w, h = w or im.width // S, h or im.height // S
    im = im.resize((w, h), Image.LANCZOS)
    bb = im.getchannel("A").getbbox()       # cắt sát phần có hình (chừa 2px) cho dễ đặt
    if bb:
        im = im.crop((max(0, bb[0] - 2), max(0, bb[1] - 2), min(im.width, bb[2] + 2), min(im.height, bb[3] + 2)))
    im.save(os.path.join(d, ten), "PNG", optimize=True)
    print(bo, ten, im.size)


def font(ten, co):
    return ImageFont.truetype(os.path.join(FONT, ten), co)


def bong(im, r=6, dx=0, dy=4, a=90):
    """bóng đổ mềm dưới hình (như decor có sẵn): làm từ kênh alpha."""
    al = im.getchannel("A").point(lambda v: v * a // 255)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sh.putalpha(al.filter(ImageFilter.GaussianBlur(r * S)))
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.alpha_composite(sh, (dx * S, dy * S))
    out.alpha_composite(im)
    return out


def sang(im, box, a=150, mo=5):
    """vệt sáng mềm (ellipse trắng làm mờ) như chỗ phản chiếu."""
    lop = Image.new("RGBA", im.size, (255, 255, 255, 0))
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).ellipse(tuple(v * S for v in box), fill=a)
    lop.putalpha(ImageChops.multiply(m.filter(ImageFilter.GaussianBlur(mo * S)), im.getchannel("A")))
    im.alpha_composite(lop)


def sao_pts(cx, cy, R, r, n=5, goc=-90):
    pts = []
    for i in range(2 * n):
        rr = R if i % 2 == 0 else r
        a = math.radians(goc + i * 180 / n)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts


def chuyen_sac(w, h, tren, duoi):
    g = Image.linear_gradient("L").resize((w, h))
    a, b = Image.new("RGBA", (w, h), tren), Image.new("RGBA", (w, h), duoi)
    return Image.composite(b, a, g)


def to_mau(mask, w, h, tren, duoi):
    """tô vùng mask bằng màu chuyển dọc."""
    out = chuyen_sac(w, h, tren, duoi)
    out.putalpha(ImageChops.multiply(out.getchannel("A"), mask))
    return out


def chu_vien(d, xy, t, f, mau, vien, co_vien, canh="mm"):
    d.text(xy, t, font=f, fill=mau, anchor=canh, stroke_width=co_vien, stroke_fill=vien)


# ======================================================================== NOEL
def noel():
    bo = "noel"
    for ten, tu in (("day-den.png", "noel-poly-christmas"), ("chau-do.png", "noel-poly-christmas"), ("chau-xanh.png", "noel-poly-christmas"),
                    ("chau-trang.png", "noel-poly-christmas"), ("chau-vang.png", "noel-anh-that"), ("keo-gay.png", "noel-poly-christmas"),
                    ("tuyet.png", "noel-poly-christmas")):
        f = os.path.join(REPO, "theme-ps", tu, "anh", ten)
        if os.path.isfile(f):
            os.makedirs(os.path.join(G, bo), exist_ok=True)
            shutil.copy2(f, os.path.join(G, bo, ten))
            print(bo, ten, "(theme Noel)")
    # sao vàng
    W = 240; im = moi(W, W); m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).polygon(sao_pts(W * S / 2, W * S / 2 + 6 * S, 110 * S, 46 * S), fill=255)
    s = to_mau(m, *im.size, hx("FFE58A"), hx("E2A21B")); im.alpha_composite(s)
    d = ImageDraw.Draw(im)
    d.polygon(sao_pts(W * S / 2, W * S / 2 + 6 * S, 110 * S, 46 * S), outline=hx("B9800E"), width=3 * S)
    sang(im, (84, 62, 122, 100), 170, 6)
    luu(bong(im, 5, 0, 3, 70), bo, "sao-vang.png")
    # hộp quà đỏ nơ vàng
    W, H = 260, 280; im = moi(W, H); d = ImageDraw.Draw(im)
    d.rounded_rectangle((30 * S, 110 * S, 230 * S, 270 * S), 10 * S, fill=hx("C9252C"))
    d.rounded_rectangle((18 * S, 82 * S, 242 * S, 130 * S), 10 * S, fill=hx("E03A3F"))
    d.rectangle((30 * S, 130 * S, 230 * S, 142 * S), fill=hx("A81C22"))
    d.rectangle((116 * S, 82 * S, 144 * S, 270 * S), fill=hx("F5C542"))
    d.rectangle((116 * S, 82 * S, 124 * S, 270 * S), fill=hx("FFE08A"))
    for sd in (-1, 1):       # 2 tai nơ
        cx = 130 + sd * 46
        d.ellipse(((cx - 44) * S, 26 * S, (cx + 44) * S, 90 * S), fill=hx("F5C542"))
        d.ellipse(((cx - 24) * S, 44 * S, (cx + 24) * S, 76 * S), fill=hx("D9A21E"))
    d.ellipse((112 * S, 58 * S, 148 * S, 94 * S), fill=hx("E8B12B"))
    luu(bong(im, 6, 0, 5, 80), bo, "hop-qua.png")
    # bông tuyết trắng
    W = 240; im = moi(W, W); d = ImageDraw.Draw(im); c = W * S / 2
    for k in range(6):
        a = math.radians(k * 60 - 90)
        x2, y2 = c + math.cos(a) * 104 * S, c + math.sin(a) * 104 * S
        d.line((c, c, x2, y2), fill=(255, 255, 255, 255), width=12 * S)
        for t, L in ((0.45, 34), (0.72, 26)):
            px, py = c + math.cos(a) * 104 * S * t, c + math.sin(a) * 104 * S * t
            for sd in (-1, 1):
                b = a + sd * math.radians(45)
                d.line((px, py, px + math.cos(b) * L * S, py + math.sin(b) * L * S), fill=(255, 255, 255, 255), width=9 * S)
        d.ellipse((x2 - 9 * S, y2 - 9 * S, x2 + 9 * S, y2 + 9 * S), fill=(255, 255, 255, 255))
    d.ellipse((c - 20 * S, c - 20 * S, c + 20 * S, c + 20 * S), fill=(255, 255, 255, 255))
    luu(bong(im, 5, 0, 2, 60), bo, "bong-tuyet.png")
    # nhựa ruồi: 3 lá xanh + 3 quả đỏ
    W, H = 300, 220; im = moi(W, H); d = ImageDraw.Draw(im)

    def la(cx, cy, goc, dai, rong):
        pts = []
        for i in range(41):
            t = i / 40
            x = (t - 0.5) * dai
            y = rong / 2 * math.sin(math.pi * t) + 7 * math.sin(t * math.pi * 6) * math.sin(math.pi * t)
            pts.append((x, y))
        pts += [(x, -y) for x, y in reversed(pts)]
        ca, sa = math.cos(math.radians(goc)), math.sin(math.radians(goc))
        P = [((cx + x * ca - y * sa) * S, (cy + x * sa + y * ca) * S) for x, y in pts]
        d.polygon(P, fill=hx("1F7A3E"))
        d.line(((cx - dai / 2 * ca) * S, (cy - dai / 2 * sa) * S, (cx + dai / 2 * ca) * S, (cy + dai / 2 * sa) * S), fill=hx("145A2C"), width=4 * S)
    la(95, 100, -25, 170, 74); la(205, 100, 25, 170, 74); la(150, 150, 90, 130, 64)
    for cx, cy in ((140, 92), (172, 96), (156, 122)):
        d.ellipse(((cx - 22) * S, (cy - 22) * S, (cx + 22) * S, (cy + 22) * S), fill=hx("D7262E"))
    for cx, cy in ((140, 92), (172, 96), (156, 122)):
        sang(im, (cx - 15, cy - 16, cx - 3, cy - 5), 170, 2)
    luu(bong(im, 5, 0, 4, 70), bo, "nhua-ruoi.png")
    # mũ Noel
    W, H = 300, 260; im = moi(W, H); d = ImageDraw.Draw(im)
    d.polygon([(40 * S, 200 * S), (150 * S, 40 * S), (250 * S, 95 * S), (262 * S, 200 * S)], fill=hx("D7262E"))
    d.polygon([(150 * S, 40 * S), (250 * S, 95 * S), (262 * S, 200 * S), (205 * S, 200 * S)], fill=hx("B71C24"))
    d.rounded_rectangle((26 * S, 186 * S, 276 * S, 244 * S), 29 * S, fill=hx("F6F2EC"))
    d.ellipse((222 * S, 76 * S, 282 * S, 136 * S), fill=hx("F6F2EC"))
    for i in range(18):            # lông xù
        x, y = rnd.uniform(34, 268), rnd.uniform(192, 238)
        d.ellipse(((x - 9) * S, (y - 9) * S, (x + 9) * S, (y + 9) * S), fill=hx("FFFFFF"))
    luu(bong(im, 6, 0, 5, 70), bo, "mu-noel.png")


# ======================================================================== SALE / BLACK FRIDAY
def sale():
    bo = "sale"
    # nhãn SALE: sao nổ đỏ 18 cánh
    W = 320; im = moi(W, W); d = ImageDraw.Draw(im); c = W * S / 2
    d.polygon(sao_pts(c, c, 150 * S, 122 * S, 18, -90), fill=hx("E11D2E"))
    d.ellipse((c - 112 * S, c - 112 * S, c + 112 * S, c + 112 * S), outline=hx("FFD60A"), width=6 * S)
    chu_vien(d, (c, c - 4 * S), "SALE", font("tv-anton.ttf", 112 * S), hx("FFFFFF"), hx("9E0F1B"), 4 * S)
    luu(bong(im, 7, 0, 6, 90), bo, "nhan-sale.png")
    # BLACK FRIDAY: băng đen nghiêng
    W, H = 760, 260; im = moi(W, H); d = ImageDraw.Draw(im)
    d.rounded_rectangle((20 * S, 50 * S, 740 * S, 210 * S), 22 * S, fill=hx("111111"))
    d.rounded_rectangle((32 * S, 62 * S, 728 * S, 198 * S), 16 * S, outline=hx("FFD60A"), width=4 * S)
    chu_vien(d, (380 * S, 128 * S), "BLACK FRIDAY", font("tv-anton.ttf", 104 * S), hx("FFD60A"), hx("111111"), 0)
    im = im.rotate(-4, resample=Image.BICUBIC, expand=True)
    luu(bong(im, 8, 0, 8, 110), bo, "black-friday.png")
    # FLASH SALE: chữ vàng viền đen + tia sét
    W, H = 820, 300; im = moi(W, H); d = ImageDraw.Draw(im)
    chu_vien(d, (500 * S, 150 * S), "FLASH SALE", font("tv-anton.ttf", 130 * S), hx("FFE600"), hx("111111"), 9 * S)
    set_ = [(70, 20), (150, 20), (112, 120), (168, 120), (60, 290), (96, 160), (40, 160)]
    d.polygon([(x * S, y * S) for x, y in set_], fill=hx("FFE600"), outline=hx("111111"), width=7 * S)
    luu(bong(im, 7, 0, 6, 100), bo, "flash-sale.png")
    # tia sét
    W, H = 200, 330; im = moi(W, H); d = ImageDraw.Draw(im)
    P = [(110, 10), (190, 10), (140, 130), (196, 130), (60, 320), (96, 172), (30, 172)]
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon([(x * S, y * S) for x, y in P], fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("FFF27A"), hx("FFB800")))
    ImageDraw.Draw(im).polygon([(x * S, y * S) for x, y in P], outline=hx("C67A00"), width=4 * S)
    luu(bong(im, 6, 0, 5, 90), bo, "tia-set.png")
    # tag giá (trống, chữ giá đặt lên trên)
    W, H = 460, 240; im = moi(W, H); d = ImageDraw.Draw(im)
    P = [(110, 30), (430, 30), (430, 210), (110, 210), (30, 120)]
    d.polygon([(x * S, y * S) for x, y in P], fill=hx("FFD60A"))
    d.polygon([(x * S, y * S) for x, y in P], outline=hx("111111"), width=6 * S)
    d.ellipse((76 * S, 104 * S, 108 * S, 136 * S), fill=(0, 0, 0, 0), outline=hx("111111"), width=6 * S)
    im2 = Image.new("RGBA", im.size, (0, 0, 0, 0)); im2.alpha_composite(im)
    ImageDraw.Draw(im2).ellipse((80 * S, 108 * S, 104 * S, 132 * S), fill=(0, 0, 0, 0))
    m = im2.getchannel("A"); ImageDraw.Draw(m).ellipse((80 * S, 108 * S, 104 * S, 132 * S), fill=0); im2.putalpha(m)
    luu(bong(im2, 6, 0, 5, 90), bo, "tag-gia.png")
    # pháo giấy (dải ngang)
    W, H = 1080, 300; im = moi(W, H); d = ImageDraw.Draw(im)
    mau = ["FFD60A", "FF4D8D", "22C55E", "3B82F6", "F97316", "A855F7", "FFFFFF"]
    for i in range(110):
        x, y = rnd.uniform(10, W - 10), rnd.uniform(10, H - 10)
        c = hx(rnd.choice(mau))
        k = rnd.random()
        if k < 0.45:
            w, h, g = rnd.uniform(14, 26), rnd.uniform(6, 10), rnd.uniform(0, 180)
            p = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
            ca, sa = math.cos(math.radians(g)), math.sin(math.radians(g))
            d.polygon([((x + px * ca - py * sa) * S, (y + px * sa + py * ca) * S) for px, py in p], fill=c)
        elif k < 0.8:
            r = rnd.uniform(4, 8)
            d.ellipse(((x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S), fill=c)
        else:
            pts = [((x + t * 3) * S, (y + 8 * math.sin(t / 5)) * S) for t in range(0, 30, 2)]
            d.line(pts, fill=c, width=4 * S)
    luu(im, bo, "phao-giay.png")
    # túi mua sắm
    W, H = 260, 300; im = moi(W, H); d = ImageDraw.Draw(im)
    d.arc((80 * S, 20 * S, 180 * S, 130 * S), 180, 360, fill=hx("8F1D25"), width=12 * S)
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon([(40 * S, 80 * S), (220 * S, 80 * S), (240 * S, 290 * S), (20 * S, 290 * S)], fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("F0434D"), hx("C81E2A")))
    d = ImageDraw.Draw(im)
    d.ellipse((76 * S, 104 * S, 92 * S, 120 * S), fill=hx("7A1219")); d.ellipse((168 * S, 104 * S, 184 * S, 120 * S), fill=hx("7A1219"))
    chu_vien(d, (130 * S, 200 * S), "SALE", font("tv-anton.ttf", 56 * S), hx("FFFFFF"), hx("FFFFFF"), 0)
    luu(bong(im, 6, 0, 5, 80), bo, "tui-mua-sam.png")
    # nhãn HOT: viên thuốc đỏ cam + lửa
    W, H = 300, 150; im = moi(W, H); d = ImageDraw.Draw(im)
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).rounded_rectangle((10 * S, 25 * S, 290 * S, 125 * S), 50 * S, fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("FF7A1A"), hx("E11D2E")))
    d = ImageDraw.Draw(im)
    fl = [(62, 112), (40, 88), (48, 58), (60, 72), (66, 40), (84, 64), (92, 50), (96, 84), (84, 112)]
    d.polygon([(x * S, y * S) for x, y in fl], fill=hx("FFE14D"))
    chu_vien(d, (185 * S, 75 * S), "HOT", font("tv-anton.ttf", 76 * S), hx("FFFFFF"), hx("FFFFFF"), 0)
    luu(bong(im, 6, 0, 5, 80), bo, "nhan-hot.png")


# ======================================================================== TẾT
def tet():
    bo = "tet"
    # đèn lồng đỏ
    W, H = 220, 420; im = moi(W, H); d = ImageDraw.Draw(im)
    d.line((110 * S, 0, 110 * S, 60 * S), fill=hx("C9A24A"), width=4 * S)
    d.rounded_rectangle((70 * S, 52 * S, 150 * S, 82 * S), 6 * S, fill=hx("E2B33B"))
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).ellipse((14 * S, 70 * S, 206 * S, 300 * S), fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("F0434D"), hx("B5121B")))
    d = ImageDraw.Draw(im)
    for w in (34, 66):                       # gân đèn: nửa elip trái / phải, màu đỏ sẫm đặc
        d.arc(((110 - w) * S, 72 * S, (110 + w) * S, 298 * S), 90, 270, fill=hx("A3111A"), width=3 * S)
        d.arc(((110 - w) * S, 72 * S, (110 + w) * S, 298 * S), 270, 90, fill=hx("A3111A"), width=3 * S)
    d.line((110 * S, 74 * S, 110 * S, 296 * S), fill=hx("A3111A"), width=3 * S)
    sang(im, (44, 100, 84, 190), 120, 8)
    d.rounded_rectangle((70 * S, 288 * S, 150 * S, 316 * S), 6 * S, fill=hx("E2B33B"))
    for i in range(9):                       # tua
        x = 82 + i * 7
        d.line((x * S, 316 * S, x * S, 410 * S), fill=hx("E03A3F") if i % 2 else hx("C8202A"), width=4 * S)
    d.rectangle((78 * S, 316 * S, 142 * S, 330 * S), fill=hx("E2B33B"))
    luu(bong(im, 6, 0, 5, 70), bo, "den-long.png")
    # bao lì xì
    W, H = 220, 320; im = moi(W, H); d = ImageDraw.Draw(im)
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).rounded_rectangle((10 * S, 10 * S, 210 * S, 310 * S), 16 * S, fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("E7333B"), hx("BC1720")))
    d = ImageDraw.Draw(im)
    d.pieslice((10 * S, -100 * S, 210 * S, 120 * S), 0, 180, fill=hx("C51B24"))
    d.ellipse((70 * S, 150 * S, 150 * S, 230 * S), fill=hx("F5C542"))
    d.ellipse((80 * S, 160 * S, 140 * S, 220 * S), outline=hx("C9921E"), width=3 * S)
    for k in range(8):                      # hoa 8 cánh trong vòng vàng
        a = math.radians(k * 45)
        cx, cy = 110 + 17 * math.cos(a), 190 + 17 * math.sin(a)
        d.ellipse(((cx - 8) * S, (cy - 8) * S, (cx + 8) * S, (cy + 8) * S), fill=hx("D9A21E"))
    d.ellipse((102 * S, 182 * S, 118 * S, 198 * S), fill=hx("C51B24"))
    d.rounded_rectangle((10 * S, 10 * S, 210 * S, 310 * S), 16 * S, outline=hx("F5C542"), width=4 * S)
    luu(bong(im, 6, 0, 5, 70), bo, "li-xi.png")

    def canh(ten, mau_hoa, mau_nhuy, so_canh, la_xanh):
        W, H = 520, 420; im = moi(W, H); d = ImageDraw.Draw(im)
        nau = hx("5B3A26")

        def nhanh(x0, y0, x1, y1, day):
            n = 16; pts = []
            for i in range(n + 1):
                t = i / n
                pts.append(((x0 + (x1 - x0) * t + 8 * math.sin(t * 7)) * S, (y0 + (y1 - y0) * t + 6 * math.cos(t * 5)) * S))
            for i in range(n):
                w = max(2, day * (1 - i / n * 0.7))
                d.line((pts[i], pts[i + 1]), fill=nau, width=int(w * S))
            return [(x / S, y / S) for x, y in pts]
        p0 = nhanh(0, 40, 470, 300, 18)
        p1 = nhanh(150, 125, 260, 30, 9)
        p2 = nhanh(300, 205, 430, 120, 8)
        p3 = nhanh(360, 245, 330, 380, 6)
        cho = [p0[4], p0[7], p0[10], p0[13], p0[16], p1[8], p1[16], p1[12], p2[10], p2[16], p3[9], p3[16]]
        for i, (cx, cy) in enumerate(cho):
            r = rnd.uniform(26, 34) if i % 3 else 22
            for k in range(so_canh):
                a = math.radians(k * 360 / so_canh + rnd.uniform(-8, 8) + i * 17)
                px, py = cx + math.cos(a) * r * 0.55, cy + math.sin(a) * r * 0.55
                d.ellipse(((px - r * 0.5) * S, (py - r * 0.5) * S, (px + r * 0.5) * S, (py + r * 0.5) * S), fill=mau_hoa)
            d.ellipse(((cx - r * 0.26) * S, (cy - r * 0.26) * S, (cx + r * 0.26) * S, (cy + r * 0.26) * S), fill=mau_nhuy)
            for k in range(7):
                a = math.radians(k * 51)
                d.line(((cx) * S, (cy) * S, (cx + math.cos(a) * r * 0.42) * S, (cy + math.sin(a) * r * 0.42) * S), fill=mau_nhuy, width=2 * S)
        for cx, cy in (p0[2], p0[9], p1[4], p2[5], p3[5]):     # nụ
            d.ellipse(((cx - 9) * S, (cy - 11) * S, (cx + 9) * S, (cy + 7) * S), fill=mau_hoa)
        if la_xanh:
            for cx, cy in (p0[5], p0[12], p2[13]):
                d.ellipse(((cx - 18) * S, (cy - 6) * S, (cx + 14) * S, (cy + 10) * S), fill=hx("4C8C3A"))
        luu(bong(im, 5, 0, 4, 60), bo, ten)
    canh("canh-mai.png", hx("FFC62E"), hx("E07B00"), 5, True)
    canh("canh-dao.png", hx("F7A1BC"), hx("C2185B"), 5, False)
    # dây pháo
    W, H = 180, 520; im = moi(W, H); d = ImageDraw.Draw(im)
    d.line((90 * S, 0, 90 * S, 470 * S), fill=hx("C9A24A"), width=4 * S)
    for i in range(10):
        y = 40 + i * 44; sd = -1 if i % 2 else 1; x = 90 + sd * 26
        g = math.radians(sd * 18)
        p = [(-14, -30), (14, -30), (14, 30), (-14, 30)]
        ca, sa = math.cos(g), math.sin(g)
        P = [((x + px * ca - py * sa) * S, (y + 30 + px * sa + py * ca) * S) for px, py in p]
        d.polygon(P, fill=hx("D7262E"))
        d.line((P[0], P[1]), fill=hx("F5C542"), width=5 * S); d.line((P[2], P[3]), fill=hx("F5C542"), width=5 * S)
    d.ellipse((66 * S, 470 * S, 114 * S, 518 * S), fill=hx("F5C542"))
    luu(bong(im, 5, 0, 4, 70), bo, "day-phao.png")
    # đồng xu vàng
    W = 200; im = moi(W, W); c = W * S / 2
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).ellipse((10 * S, 10 * S, 190 * S, 190 * S), fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("FFE58A"), hx("D49A1B")))
    d = ImageDraw.Draw(im)
    d.ellipse((24 * S, 24 * S, 176 * S, 176 * S), outline=hx("B9800E"), width=5 * S)
    d.rectangle((c - 24 * S, c - 24 * S, c + 24 * S, c + 24 * S), fill=(0, 0, 0, 0))
    m = im.getchannel("A"); ImageDraw.Draw(m).rectangle((c - 22 * S, c - 22 * S, c + 22 * S, c + 22 * S), fill=0); im.putalpha(m)
    d = ImageDraw.Draw(im)
    d.rectangle((c - 26 * S, c - 26 * S, c + 26 * S, c + 26 * S), outline=hx("B9800E"), width=5 * S)
    luu(bong(im, 5, 0, 4, 70), bo, "dong-xu.png")
    # chữ Chúc Mừng Năm Mới
    W, H = 900, 220; im = moi(W, H); d = ImageDraw.Draw(im)
    chu_vien(d, (450 * S, 112 * S), "Chúc Mừng Năm Mới", font("tv-lobster.ttf", 104 * S), hx("FFD45A"), hx("9E0F1B"), 7 * S)
    luu(bong(im, 7, 0, 6, 90), bo, "chuc-mung.png")


# ======================================================================== NGÀY THƯỜNG
def thuong():
    bo = "thuong"
    # mũi tên cong vẽ tay (trắng, viền tối nhẹ)
    W, H = 360, 300; im = moi(W, H); d = ImageDraw.Draw(im)
    pts = [((40 + 270 * t) * S, (240 - 190 * math.sin(math.pi * t * 0.75)) * S) for t in [i / 30 for i in range(31)]]
    d.line(pts, fill=hx("FFFFFF"), width=14 * S, joint="curve")
    x2, y2 = pts[-1]; x1, y1 = pts[-4]
    a = math.atan2(y2 - y1, x2 - x1)
    for sd in (-1, 1):
        b = a + math.pi - sd * math.radians(32)
        d.line((x2, y2, x2 + math.cos(b) * 70 * S, y2 + math.sin(b) * 70 * S), fill=hx("FFFFFF"), width=14 * S)
    d.ellipse((x2 - 7 * S, y2 - 7 * S, x2 + 7 * S, y2 + 7 * S), fill=hx("FFFFFF"))
    luu(bong(im, 5, 0, 3, 120), bo, "mui-ten.png")
    # tia sáng 4 cánh (vàng nhạt) + 2 tia nhỏ
    W = 260; im = moi(W, W); d = ImageDraw.Draw(im)

    def tia(cx, cy, R, mau):
        p = []
        for k in range(8):
            a = math.radians(k * 45 - 90); r = R if k % 2 == 0 else R * 0.22
            p.append(((cx + r * math.cos(a)) * S, (cy + r * math.sin(a)) * S))
        d.polygon(p, fill=mau)
    tia(120, 140, 110, hx("FFE58A")); tia(210, 50, 40, hx("FFFFFF")); tia(40, 40, 26, hx("FFFFFF"))
    luu(bong(im, 4, 0, 2, 60), bo, "tia-sang.png")
    # tim đỏ
    W = 240; im = moi(W, W); m = Image.new("L", im.size, 0); dm = ImageDraw.Draw(m)
    p = []
    for i in range(200):
        t = 2 * math.pi * i / 200
        x = 16 * math.sin(t) ** 3
        y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
        p.append(((120 + x * 6.6) * S, (112 - y * 6.6) * S))
    dm.polygon(p, fill=255)
    im.alpha_composite(to_mau(m, *im.size, hx("FF5A6E"), hx("D3132C")))
    sang(im, (56, 46, 100, 82), 150, 7)
    luu(bong(im, 6, 0, 5, 80), bo, "tim.png")
    # sao vàng phẳng
    W = 220; im = moi(W, W); d = ImageDraw.Draw(im)
    d.polygon(sao_pts(110 * S, 118 * S, 100 * S, 44 * S), fill=hx("FFC83D"))
    d.polygon(sao_pts(110 * S, 118 * S, 100 * S, 44 * S), outline=hx("E59A00"), width=4 * S)
    luu(bong(im, 4, 0, 3, 60), bo, "sao.png")
    # nhãn MỚI VỀ
    W, H = 340, 130; im = moi(W, H); d = ImageDraw.Draw(im)
    d.rounded_rectangle((10 * S, 15 * S, 330 * S, 115 * S), 26 * S, fill=hx("FFD60A"))
    d.rounded_rectangle((10 * S, 15 * S, 330 * S, 115 * S), 26 * S, outline=hx("111111"), width=5 * S)
    chu_vien(d, (170 * S, 66 * S), "MỚI VỀ", font("BeVietnamPro-800.ttf", 62 * S), hx("111111"), hx("111111"), 0)
    im = im.rotate(-6, resample=Image.BICUBIC, expand=True)
    luu(bong(im, 6, 0, 5, 90), bo, "moi-ve.png")
    # vòng tròn vẽ tay (đỏ) để khoanh máy / giá
    W, H = 520, 360; im = moi(W, H); d = ImageDraw.Draw(im)
    pts = []
    for i in range(130):
        t = 2 * math.pi * 1.08 * i / 129 - 0.6
        rx, ry = 230 + 6 * math.sin(t * 3), 150 + 5 * math.cos(t * 2)
        pts.append(((260 + rx * math.cos(t)) * S, (180 + ry * math.sin(t) + 12 * (i / 129)) * S))
    d.line(pts, fill=hx("FF3B3B"), width=11 * S, joint="curve")
    luu(im, bo, "vong-tron.png")
    # gạch chân vẽ tay (vàng)
    W, H = 600, 90; im = moi(W, H); d = ImageDraw.Draw(im)
    pts = [((20 + 560 * t) * S, (52 - 14 * math.sin(math.pi * t) + 4 * math.sin(t * 13)) * S) for t in [i / 40 for i in range(41)]]
    d.line(pts, fill=hx("FFD60A"), width=16 * S, joint="curve")
    pts2 = [((90 + 420 * t) * S, (72 - 8 * math.sin(math.pi * t)) * S) for t in [i / 30 for i in range(31)]]
    d.line(pts2, fill=hx("FFD60A"), width=9 * S, joint="curve")
    luu(im, bo, "gach-chan.png")
    # bong bóng chat trắng (để chữ lên trên)
    W, H = 520, 340; im = moi(W, H); d = ImageDraw.Draw(im)
    d.rounded_rectangle((10 * S, 10 * S, 510 * S, 250 * S), 60 * S, fill=hx("FFFFFF"))
    d.polygon([(110 * S, 240 * S), (190 * S, 240 * S), (80 * S, 330 * S)], fill=hx("FFFFFF"))
    luu(bong(im, 8, 0, 6, 80), bo, "bong-chat.png")




# ======================================================================== NỀN MẪU (ảnh mờ bokeh, dùng khi fen chưa gắn ảnh nền)
def xem():
    d = os.path.join(G, "xem")
    os.makedirs(d, exist_ok=True)
    W, H = 1080, 1920
    for ten, tren, duoi, dom in (("noel", "0E2A1C", "071510", ["F5C542", "E23B32", "FFFFFF", "8FD18A"]),
                                 ("sale", "17171B", "050506", ["FFD60A", "FF4D8D", "3B82F6", "F97316"]),
                                 ("tet", "8E1B1F", "3D0708", ["FFD45A", "FF8A3D", "FFE9A8", "E23B32"]),
                                 ("thuong", "1E293B", "0B1120", ["93C5FD", "FDE68A", "C4B5FD", "FFFFFF"])):
        r = random.Random(ten)
        im = chuyen_sac(W, H, hx(tren), hx(duoi))
        lop = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        dl = ImageDraw.Draw(lop)
        for i in range(70):
            x, y, rr = r.uniform(0, W), r.uniform(0, H * 0.75), r.uniform(18, 90)
            c = hx(r.choice(dom), int(r.uniform(40, 120)))
            dl.ellipse((x - rr, y - rr, x + rr, y + rr), fill=c)
        lop = lop.filter(ImageFilter.GaussianBlur(10))
        im.alpha_composite(lop)
        im.convert("RGB").save(os.path.join(d, ten + ".jpg"), "JPEG", quality=82, optimize=True)
        print("xem", ten + ".jpg")


if __name__ == "__main__":
    for k in sys.argv[1:] or ["noel", "sale", "tet", "thuong", "xem"]:
        globals()[k]()
