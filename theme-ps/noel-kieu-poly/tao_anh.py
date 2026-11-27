# Anh trang tri theme "Noel · Kiểu Poly" (fen 27/11 14h51 "tạo concept mới cho noel", chọn "Kiểu bài shop + Noel"):
# giữ nguyên kiểu bài shop (nền ảnh mờ tối, chữ trắng, khung xanh lá), chỉ thêm 1 cụm thông + 2 châu ở góc phải trên và lớp tuyết mỏng ở đáy.
#   python3 tao_anh.py            -> anh/goc-thong.png, anh/tuyet-mong.png
import math, os, random, sys
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, "anh")
os.makedirs(OUT, exist_ok=True)
S = 3


def hexc(h, a=255):
    h = h.lstrip("#"); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def nhanh(dr, x0, y0, goc, dai, mau, kim, day, cong, rnd, nhanh_con=True):
    """1 cành thông: thân mảnh + kim dày 2 bên (góc, độ dài lệch ngẫu nhiên), kim ngắn dần về ngọn, vài cành con."""
    n = max(8, int(dai / (3.2 * S))); pts = []
    for i in range(n + 1):
        t = i / n
        px = x0 + math.cos(goc) * dai * t + math.cos(goc + math.pi / 2) * cong * dai * 0.25 * t * t
        py = y0 + math.sin(goc) * dai * t + math.sin(goc + math.pi / 2) * cong * dai * 0.25 * t * t
        pts.append((px, py))
    dr.line(pts, fill=hexc("2A2016"), width=int(day * S))
    for i in range(1, n + 1):
        t = i / n
        px, py = pts[i]
        g = math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])
        L0 = kim * S * (1.0 - 0.5 * t)
        for sd in (-1, 1):
            for _ in range(2):
                a = g + sd * math.radians(rnd.uniform(38, 72))
                L = L0 * rnd.uniform(0.75, 1.1)
                c = mau if rnd.random() > 0.25 else tuple(min(255, int(v * 1.18)) for v in mau[:3]) + (255,)
                dr.line([(px, py), (px + math.cos(a) * L, py + math.sin(a) * L)], fill=c, width=max(2, int(day * S * 0.8)))
    if nhanh_con:
        for t in (0.35, 0.6):
            i = int(n * t); px, py = pts[i]
            g = math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0])
            for sd in (-1, 1):
                if rnd.random() < 0.7:
                    nhanh(dr, px, py, g + sd * math.radians(rnd.uniform(28, 40)), dai * rnd.uniform(0.22, 0.32), mau, kim * 0.8, day * 0.8, 0, rnd, False)
    return pts


def chau(im, cx, cy, r, mau, sang, toi, day_tu):
    """châu tròn phẳng: màu chính + mảng tối nửa dưới + 1 đốm sáng, nắp vàng, dây treo mảnh."""
    d = ImageDraw.Draw(im)
    d.line([day_tu, (cx, cy - r - r * 0.28)], fill=hexc("C9A24A"), width=2 * S)
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
    lop = Image.new("RGBA", im.size, (0, 0, 0, 0)); dl = ImageDraw.Draw(lop)
    dl.ellipse([cx - r, cy - r, cx + r, cy + r], fill=hexc(mau))
    dl.pieslice([cx - r, cy - r, cx + r, cy + r], 20, 160, fill=hexc(toi))
    dl.ellipse([cx - r * 0.98, cy - r * 0.55, cx + r * 0.98, cy + r * 0.45], fill=hexc(mau))
    dl.ellipse([cx - r * 0.55, cy - r * 0.62, cx - r * 0.22, cy - r * 0.3], fill=hexc(sang))
    im.paste(Image.alpha_composite(im, lop), (0, 0), m)
    cw, ch = r * 0.46, r * 0.28
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([cx - cw / 2, cy - r - ch + 3 * S, cx + cw / 2, cy - r + 5 * S], radius=3 * S, fill=hexc("C9A24A"))


def goc_thong(w=420, h=250, seed=11):
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    gx, gy = w * S + 10 * S, -10 * S          # gốc ở ngoài góc phải trên
    # lớp sau (xanh đậm) rồi lớp trước (xanh hơn)
    cay = [(math.radians(170), 430, "1B5232", 24, 0.30), (math.radians(142), 300, "1B5232", 22, -0.2), (math.radians(116), 200, "1B5232", 20, 0.2),
           (math.radians(160), 360, "2B7746", 21, -0.25), (math.radians(132), 240, "2B7746", 19, 0.3)]
    tr = []
    for g, dai, mau, kim, cong in cay:
        tr.append(nhanh(dr, gx, gy, g, dai * S, hexc(mau), kim, 2.4, cong, rnd))
    # vài kim sáng điểm (tuyết đọng nhẹ) trên lớp trước
    for _ in range(14):
        p = rnd.choice(tr[3] + tr[4]); r = rnd.uniform(2.2, 3.6) * S
        dr.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=hexc("EEF4F1", 230))
    # 2 châu treo dưới cành: đỏ to, vàng nhỏ
    p1 = tr[3][int(len(tr[3]) * 0.62)]; p2 = tr[4][int(len(tr[4]) * 0.8)]
    chau(im, p1[0] - 6 * S, p1[1] + 66 * S, 34 * S, "D63A32", "F08A7E", "9E2219", p1)
    chau(im, p2[0], p2[1] + 52 * S, 25 * S, "D9A93B", "F6DD95", "9C7420", p2)
    im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(OUT, "goc-thong.png"))


def tuyet_mong(w=1080, h=120, seed=5):
    """lớp tuyết mỏng ở đáy: mép lượn nhẹ, trắng ngà, bóng xám xanh mờ ở mép trên."""
    rnd = random.Random(seed)
    im = Image.new("RGBA", (w * S, h * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    pts = [(0, h * S)]
    for i in range(81):
        x = w * S * i / 80
        y = h * S * (0.46 + 0.12 * math.sin(i / 80 * 6.28 * 2 + ph[0]) + 0.06 * math.sin(i / 80 * 6.28 * 5 + ph[1]) + 0.03 * math.sin(i / 80 * 6.28 * 13 + ph[2]))
        pts.append((x, y))
    pts.append((w * S, h * S))
    d.polygon(pts, fill=hexc("F4F7F6"))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0)); ImageDraw.Draw(sh).polygon([(x, y + 16 * S) for (x, y) in pts[1:-1]] + [(w * S, h * S), (0, h * S)], fill=hexc("CFDBDA", 170))
    sh = sh.filter(ImageFilter.GaussianBlur(8 * S))
    m = Image.new("L", im.size, 0); ImageDraw.Draw(m).polygon(pts, fill=255)
    im = Image.composite(Image.alpha_composite(im, sh), im, m)
    im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, "tuyet-mong.png"))


goc_thong()
tuyet_mong()
print("xong", sorted(os.listdir(OUT)))
