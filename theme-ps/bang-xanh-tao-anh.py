# -*- coding: utf-8 -*-
# Ve anh cho theme "Bảng xanh · Giấy xé" (fen 14/11 gui the san pham nen bang xanh ke o, dai giay xe trang ghi ten may,
# nhan co trang ghi dung luong / gia, dong khuyen mai trang + vang, bang ron trang ghi gia phu kien).
# Chay: python3 bang-xanh-tao-anh.py <thu muc ra>   (mac dinh theme-ps/bang-xanh-giay-xe/anh)
# Phang: khong bong, khong phat sang; chi vien giay xe sang hon (xo giay) va nep bang ron xam nhat.
import math, os, random, sys
from PIL import Image, ImageDraw, ImageFilter

RA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "bang-xanh-giay-xe", "anh")
os.makedirs(RA, exist_ok=True)
W, H, S = 1080, 1350, 2            # ve gap doi roi thu nho cho mem net


def hexc(h, a=255):
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def nen(ten, goc_o, seed):
    rnd = random.Random(seed)
    im = Image.new("RGBA", (W * S, H * S), hexc("1E5A3B"))
    # loang mau rat nhe (bang phan cu): vai vung sang / toi lon, mo
    lo = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(lo)
    for _ in range(7):
        x, y, r = rnd.uniform(0, W) * S, rnd.uniform(0, H) * S, rnd.uniform(220, 420) * S
        d.ellipse((x - r, y - r, x + r, y + r), fill=hexc(rnd.choice(["24663F", "1A5034"]), 70))
    lo = lo.filter(ImageFilter.GaussianBlur(160 * S / 2))
    im.alpha_composite(lo)
    # o ke: duong sang hon, net hoi run, do dam khac nhau (nhu ke phan)
    ke = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ke)
    buoc = 108
    for i in range(-1, W // buoc + 2):
        x = (goc_o[0] + i * buoc) * S
        a = rnd.randint(120, 175); lech = rnd.uniform(-1.5, 1.5) * S
        d.line((x, 0, x + lech, H * S), fill=hexc("5AA67E", a), width=int(3.6 * S))
    for j in range(-1, H // buoc + 2):
        y = (goc_o[1] + j * buoc) * S
        a = rnd.randint(120, 175); lech = rnd.uniform(-1.5, 1.5) * S
        d.line((0, y, W * S, y + lech), fill=hexc("5AA67E", a), width=int(3.6 * S))
    ke = ke.filter(ImageFilter.GaussianBlur(0.8 * S))
    im.alpha_composite(ke)
    # hat phan
    hat = Image.effect_noise(im.size, 26).convert("L")
    m = hat.point(lambda v: max(0, v - 150) * 2)
    tr = Image.new("RGBA", im.size, (255, 255, 255, 0)); tr.putalpha(m.point(lambda v: v // 6))
    im.alpha_composite(tr)
    # khung trang mong
    d = ImageDraw.Draw(im)
    k = 30 * S
    d.rectangle((k, k, W * S - k, H * S - k), outline=hexc("F4F1EA", 235), width=int(4 * S))
    im = im.resize((W, H), Image.LANCZOS).convert("RGB")
    im.save(os.path.join(RA, ten), quality=90)


def bien_xe(x0, x1, y, bien, rnd, buoc=7):
    # duong mep xe: lech ngau nhien quanh y, them rang nho
    ps = []; x = x0; yy = y
    while x <= x1:
        yy += rnd.uniform(-bien * 0.45, bien * 0.45)
        yy = max(y - bien, min(y + bien, yy))
        ps.append((x, yy + rnd.uniform(-bien * 0.25, bien * 0.25)))
        x += rnd.uniform(buoc * 0.5, buoc * 1.4)
    ps.append((x1, y))
    return ps


def giay_xe(ten, w, h, seed):
    rnd = random.Random(seed)
    ww, hh = w * S, h * S
    im = Image.new("RGBA", (ww, hh), (0, 0, 0, 0))
    # xo giay (trang hon, rong hon 1 chut) roi than giay
    for lop, (mau, a, bien, them) in enumerate([("FFFFFF", 235, 9, 10), ("F3F1EB", 255, 7, 0)]):
        tren = bien_xe(-10, ww + 10, (22 - them * 0.6) * S, bien * S, rnd, 9 * S)
        duoi = bien_xe(-10, ww + 10, hh - (22 - them * 0.6) * S, bien * S, rnd, 9 * S)
        poly = tren + list(reversed(duoi))
        m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(poly, fill=a)
        if lop == 0: m = m.filter(ImageFilter.GaussianBlur(1.2 * S))
        L = Image.new("RGBA", im.size, hexc(mau)); L.putalpha(m)
        im.alpha_composite(L)
    # van giay rat nhe
    hat = Image.effect_noise(im.size, 18).convert("L").point(lambda v: 128 + (v - 128) // 3)
    g = Image.merge("RGBA", (hat, hat, hat, im.split()[3].point(lambda v: v * 22 // 255)))
    im.alpha_composite(g)
    im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(RA, ten))


def co_trang(ten, w, h, seed):
    # nhan co (vet son trang quet ngang): than dac, mep tren / duoi so soi, hai dau xo le; vai vet son dam hon cho ra net co
    rnd = random.Random(seed)
    ww, hh = w * S, h * S
    m = Image.new("L", (ww, hh), 0); d = ImageDraw.Draw(m)
    tren, duoi = 0.16 * hh, 0.84 * hh
    n = 70
    for i in range(n):
        t = i / (n - 1.0)
        y = tren + (duoi - tren) * t + rnd.uniform(-1.5, 1.5) * S
        bien = abs(t - 0.5) * 2                       # 0 o giua, 1 o mep
        l = rnd.uniform(0, 22) * S + bien * rnd.uniform(10, 40) * S
        r = ww - rnd.uniform(0, 22) * S - bien * rnd.uniform(10, 40) * S
        a = 255 if bien < 0.85 or rnd.random() < 0.6 else rnd.randint(120, 220)
        d.line((l, y, r, y + rnd.uniform(-2, 2) * S), fill=a, width=int(hh * 0.03) + 2)
    for _ in range(18):                               # soi xo o hai dau
        y = rnd.uniform(tren, duoi)
        x = rnd.choice([rnd.uniform(-4, 18), ww / S - rnd.uniform(-4, 18)]) * S
        d.line((x, y, x + rnd.uniform(-26, 26) * S, y + rnd.uniform(-1.5, 1.5) * S), fill=rnd.randint(160, 240), width=int(1.6 * S))
    m = m.filter(ImageFilter.GaussianBlur(0.7 * S))
    im = Image.new("RGBA", (ww, hh), hexc("F7F5EF")); im.putalpha(m)
    vet = Image.new("RGBA", (ww, hh), (0, 0, 0, 0)); dv = ImageDraw.Draw(vet)
    for _ in range(9):                                # vet son nhat hon (net co), khong lam thung
        y = rnd.uniform(tren + 6 * S, duoi - 6 * S); l = rnd.uniform(30, 160) * S; r = ww - rnd.uniform(30, 160) * S
        dv.line((l, y, r, y + rnd.uniform(-2, 2) * S), fill=hexc("E2DED3", rnd.randint(90, 160)), width=int(1.4 * S))
    im.alpha_composite(Image.composite(vet, Image.new("RGBA", (ww, hh), (0, 0, 0, 0)), m))
    im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(RA, ten))


def ruy_bang(ten, w, h):
    # bang ron trang: dai giua + 2 duoi cat chu V gap ra sau (xam nhat), nep tam giac xam dam hon. Phang.
    ww, hh = w * S, h * S
    im = Image.new("RGBA", (ww, hh), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    dai_t, dai_b = 0.08 * hh, 0.80 * hh          # dai chinh
    duoi_t, duoi_b = 0.22 * hh, 0.98 * hh        # 2 duoi (thap hon)
    dw, vao = 0.13 * ww, 0.05 * ww               # rong duoi, khia chu V
    xam, nep = hexc("D9D6CE"), hexc("A9A69E")
    d.polygon([(0, duoi_t), (dw, duoi_t), (dw, duoi_b), (0, duoi_b), (vao, (duoi_t + duoi_b) / 2)], fill=xam)
    d.polygon([(ww, duoi_t), (ww - dw, duoi_t), (ww - dw, duoi_b), (ww, duoi_b), (ww - vao, (duoi_t + duoi_b) / 2)], fill=xam)
    l, r = dw * 0.62, ww - dw * 0.62
    d.polygon([(l, dai_b), (dw, dai_b), (dw, duoi_b)], fill=nep)
    d.polygon([(r, dai_b), (ww - dw, dai_b), (ww - dw, duoi_b)], fill=nep)
    d.rectangle((l, dai_t, r, dai_b), fill=hexc("F7F5F0"))
    im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(RA, ten))


nen("nen-1.jpg", (14, 22), 11)
nen("nen-2.jpg", (68, 76), 23)
giay_xe("giay-xe.png", 1140, 220, 5)
giay_xe("giay-xe-2.png", 1140, 220, 9)
co_trang("co-trang.png", 640, 120, 3)
ruy_bang("ruy-bang.png", 1000, 160)
print("xong", sorted(os.listdir(RA)))
