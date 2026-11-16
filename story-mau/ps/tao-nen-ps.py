# Ảnh nền / ảnh trang trí 9:16 cho mẫu story theo kho theme Photoshop (fen 16/11 12h05 "theme glass nữa đi", 12h07 "theme pts story xóa
# làm lại cái mới"): vẽ lại phần nền tĩnh của trang bìa từng theme (theme-ps/<id>/theme.json + cách vẽ trong _dong-co.jsx) ở khổ
# 1080x1920, phần chữ / ảnh máy là lớp sửa được trong khung design. Chạy từ thư mục app: python3 story-mau/ps/tao-nen-ps.py [id ...]
#   Glass (nen_kieu kinh, bìa biaSanPham): nen-story.jpg = nền + đốm màu loang (themeDom, 100%), phu-kinh.png = lớp màu theme (anh_mau %)
#   + đốm (dom_tren %) phủ lên ảnh nền khi fen gắn ảnh nền, bong-may.png = bóng mờ dưới máy.
#   Tính năng (bia_tn): nen-story.jpg = nền + quầng sáng (toa) + trang trí tròn / chấm / sọc nhấn như trang bìa Photoshop.
import json, os, sys
from PIL import Image, ImageDraw, ImageFilter

APP = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
RA = os.path.join(APP, "story-mau", "ps")
W, H, H0 = 1080, 1920, 1440          # trang bìa Photoshop 1080x1440 -> story 1080x1920 (toạ độ dọc nhân H / H0)


def hexc(v, a=255):
    v = str(v).lstrip("#")
    return (int(v[0:2], 16), int(v[2:4], 16), int(v[4:6], 16), a)


def dom(ds, mo, op, n=4):
    """Đốm màu loang (oval mờ gblur): vẽ ở 1/n cỡ cho nhanh rồi phóng to."""
    L = Image.new("RGBA", (W // n, H // n), (0, 0, 0, 0))
    for c in ds:
        r = c[3] / n
        cx, cy = c[1] / n, c[2] * H / H0 / n
        o = Image.new("RGBA", L.size, (0, 0, 0, 0))
        ImageDraw.Draw(o).ellipse((cx - r, cy - r, cx + r, cy + r), fill=hexc(c[0], int(255 * (c[4] if len(c) > 4 else 100) / 100 * op / 100)))
        L = Image.alpha_composite(L, o.filter(ImageFilter.GaussianBlur(mo / n)))
    return L.resize((W, H), Image.BICUBIC)


def glass(t, d):
    nen = Image.new("RGBA", (W, H), hexc(t["nen"]))
    nen = Image.alpha_composite(nen, dom(t.get("dom") or [], t.get("dom_mo") or 160, 100))
    nen.convert("RGB").save(os.path.join(d, "nen-story.jpg"), quality=92)
    phu = Image.new("RGBA", (W, H), hexc(t["nen"], int(255 * (t.get("anh_mau") or 45) / 100)))
    phu = Image.alpha_composite(phu, dom(t.get("dom") or [], t.get("dom_mo") or 160, t.get("dom_tren") or 55))
    phu.resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(d, "phu-kinh.png"))
    b = Image.new("RGBA", (780, 160), (0, 0, 0, 0))
    ImageDraw.Draw(b).ellipse((50, 50, 730, 110), fill=(0, 0, 0, 115))
    b.filter(ImageFilter.GaussianBlur(28)).save(os.path.join(d, "bong-may.png"))


def toa(ds, n=4):
    """Quầng sáng mờ (THEME.toa: [màu, cx, cy, rx, ry, mờ, đậm %]) như themeNen."""
    L = Image.new("RGBA", (W // n, H // n), (0, 0, 0, 0))
    for a in ds or []:
        cx, cy, rx, ry = a[1] / n, a[2] * H / H0 / n, a[3] / n, a[4] * H / H0 / n
        o = Image.new("RGBA", L.size, (0, 0, 0, 0))
        ImageDraw.Draw(o).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=hexc(a[0], int(255 * (a[6] if len(a) > 6 else 100) / 100)))
        L = Image.alpha_composite(L, o.filter(ImageFilter.GaussianBlur((a[5] if len(a) > 5 else 180) / n)))
    return L.resize((W, H), Image.BICUBIC)


def phang(t, d):
    """Nền phẳng của bìa (themeNen trang 1): màu nền + quầng sáng (toa) + trang trí "tron" / "cham" (hình tròn nen2, chấm, gạch / sọc nhấn).
    Hình sát mép trên giữ toạ độ, hình sát mép dưới tính từ đáy story."""
    im = Image.new("RGBA", (W, H), hexc(t["nen"]))
    if t.get("toa"):
        im = Image.alpha_composite(im, toa(t["toa"]))
    dr = ImageDraw.Draw(im)
    n2, nhan, tt = hexc(t.get("nen2") or t["nen"]), hexc(t.get("nhan") or "22C55E"), t.get("trang_tri") or "tron"
    tron = lambda cx, cy, r: dr.ellipse((cx - r, cy - r, cx + r, cy + r), fill=n2)
    if tt == "tron":
        tron(W + 40, 120, 340)
        tron(-60, H - 90, 210)
        dr.rectangle((96, 64, 160, 72), fill=nhan)
    elif tt == "cham":
        for i in range(4):
            for j in range(5):
                x, y = W - 214 + j * 36, 64 + i * 36
                dr.ellipse((x - 5, y - 5, x + 5, y + 5), fill=n2)
        tron(-120, H + 40, 380)
        dr.rectangle((0, 0, 14, H), fill=nhan)
    im.convert("RGB").save(os.path.join(d, "nen-story.jpg"), quality=92)


def hat(im, amt):
    """Hạt giấy / sáp màu (Add Noise đơn sắc amt %) như themeHat."""
    n = Image.effect_noise(im.size, 64).convert("L").point(lambda v: 128 + (v - 128) * amt / 20)
    g = Image.merge("RGBA", (n, n, n, Image.new("L", im.size, int(255 * 0.35))))
    return Image.blend(im.convert("RGBA"), Image.alpha_composite(im.convert("RGBA"), g), 0.6)


TIEM_BOT, TIEM_R = 1260, 26


def tiem(t, d):
    """Tiệm vẽ tay (bia_tiem): nen-story.jpg = giấy be hạt sáp màu; tiem-<loại>.png = ảnh tiệm đúng loại máy, mép dưới lượn như mái hiên,
    viền nâu (themeVungLuon + stroke 4) — mỗi loại 1 file, mẫu dùng loại của trang bìa xem (fen đổi ảnh được)."""
    nen = hat(Image.new("RGB", (W, H), hexc(t["nen"])[:3]), t.get("hat") or 6)
    nen.convert("RGB").save(os.path.join(d, "nen-story.jpg"), quality=92)
    nau = hexc(t.get("vien_nau") or "4A3631")
    for loai, a in (t.get("tiem") or {}).items():
        f = os.path.join(APP, "theme-ps", t["id"], "anh", a[0])
        if not os.path.isfile(f):
            continue
        src = Image.open(f).convert("RGB")
        k = W / src.width
        src = src.resize((W, round(src.height * k)), Image.LANCZOS)
        off = round(a[1] * k)
        hh = TIEM_BOT + 8
        anh = src.crop((0, off, W, off + hh))
        mk = Image.new("L", (W, hh), 0)
        dm = ImageDraw.Draw(mk)
        dm.rectangle((0, 0, W, TIEM_BOT - TIEM_R), fill=255)
        x = 0
        while x - TIEM_R < W:
            dm.ellipse((x, TIEM_BOT - 2 * TIEM_R, x + 2 * TIEM_R, TIEM_BOT), fill=255)
            x += 2 * TIEM_R
        vien = mk.filter(ImageFilter.MaxFilter(9))          # viền nâu 4px ngoài mép
        out = Image.new("RGBA", (W, hh), (0, 0, 0, 0))
        out.paste(Image.new("RGBA", (W, hh), nau), (0, 0), vien)
        out.paste(anh.convert("RGBA"), (0, 0), mk)
        out.save(os.path.join(d, "tiem-%s.png" % loai))


def bang(t, d):
    """Bảng xanh (bia_bang): nền bảng phấn kẻ ô + khung trắng mảnh vẽ lại khổ dọc bằng chính hàm nen() của bang-xanh-tao-anh.py."""
    f = os.path.join(APP, "theme-ps", "bang-xanh-tao-anh.py")
    src = open(f, encoding="utf-8").read()
    src = src[:src.index('nen("nen-1.jpg"')].replace("W, H, S = 1080, 1350, 2", "W, H, S = 1080, 1920, 2")
    tam = os.path.join(RA, "_tam")
    os.makedirs(tam, exist_ok=True)
    argv = sys.argv
    sys.argv = [f, tam]
    ns = {"__name__": "nen_story", "__file__": f}
    exec(compile(src, f, "exec"), ns)
    sys.argv = argv
    ns["nen"]("b.jpg", (14, 22), 11)
    os.replace(os.path.join(tam, "b.jpg"), os.path.join(d, "nen-story.jpg"))
    try:
        os.rmdir(tam)
    except OSError:
        pass


# ---------- Ảnh thật · Chú thích tay (bia_ct): nét vẽ tay (gạch chân, mũi tên cong) như tayNet / tayMuiTen của _ve-tay.jsx ----------
_RAND = [11]


def trand():
    _RAND[0] = (_RAND[0] * 9301 + 49297) % 233280
    return _RAND[0] / 233280


def cong(S, K, E, n):
    return [((1 - t) ** 2 * S[0] + 2 * (1 - t) * t * K[0] + t * t * E[0], (1 - t) ** 2 * S[1] + 2 * (1 - t) * t * K[1] + t * t * E[1]) for t in (i / n for i in range(n + 1))]


def net(p, w, thon=(0.6, 0.6), rung=1.2):
    import math
    n, L, R = len(p), [], []
    ph, f = trand() * 6.28, 0.6 + trand() * 1.2
    for i in range(n):
        a, b = p[max(0, i - 1)], p[min(n - 1, i + 1)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        dd = math.hypot(dx, dy) or 1
        nx, ny, t = -dy / dd, dx / dd, i / (n - 1)
        k = thon[0] + (1 - thon[0]) * min(1, t / 0.2) if t < 0.5 else thon[1] + (1 - thon[1]) * min(1, (1 - t) / 0.2)
        o = rung * math.sin(math.pi * t) * math.sin(ph + f * 6.2832 * t)
        cx, cy, ww = p[i][0] + nx * o, p[i][1] + ny * o, w * k / 2
        L.append((cx + nx * ww, cy + ny * ww))
        R.append((cx - nx * ww, cy - ny * ww))
    out = [L + R[::-1]]
    for (x, y), r in ((p[0], w * thon[0] / 2), (p[-1], w * thon[1] / 2)):
        if r >= 1:
            out.append(("tron", x, y, r))
    return out


def ve_net(ps, mau, S=3):
    """Vẽ các nét (đa giác + chấm tròn) lên lớp trong suốt cỡ W x H (vẽ to gấp S rồi thu nhỏ), cắt sát nét -> (ảnh, x, y)."""
    im = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    for p in ps:
        if p and p[0] == "tron":
            _, x, y, r = p
            dr.ellipse(((x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S), fill=mau)
        else:
            dr.polygon([(x * S, y * S) for x, y in p], fill=mau)
    im = im.resize((W, H), Image.LANCZOS)
    bb = im.getbbox()
    if not bb:
        return None, 0, 0
    bb = (max(0, bb[0] - 2), max(0, bb[1] - 2), min(W, bb[2] + 2), min(H, bb[3] + 2))
    return im.crop(bb), bb[0], bb[1]


def gach(l, r, y, w, mot=True):
    n = max(10, round((r - l) / 10))
    ps = net(cong((l - 6, y + 3), ((l + r) / 2, y + 6 - trand() * 8), (r + 10, y - 2), n), w, (0.55, 0.4), 0.8)
    if not mot:
        ps += net(cong((l + 10, y + 16), ((l + r) / 2, y + 18 + trand() * 4), (r - 2, y + 11), n), w * 0.88, (0.5, 0.35), 0.8)
    return ps


def mui_ten(S0, E, w, huong="ngang"):
    import math
    dx, dy = E[0] - S0[0], E[1] - S0[1]
    dd = math.hypot(dx, dy) or 1
    mx, my = (S0[0] + E[0]) / 2, (S0[1] + E[1]) / 2
    G = (S0[0], E[1]) if huong == "doc" else (E[0], S0[1])
    K = (mx + (G[0] - mx) * 0.7, my + (G[1] - my) * 0.7)
    ps = net(cong(S0, K, E, max(16, round(dd / 7))), w, (0.5, 0.95), min(2, dd / 120))
    tx, ty = E[0] - K[0], E[1] - K[1]
    tl = math.hypot(tx, ty) or 1
    tx, ty, hl = tx / tl, ty / tl, max(22, w * 5.5)
    for sg in (-1, 1):
        g = sg * (26 + trand() * 8) * math.pi / 180
        bx, by, ln = -tx, -ty, hl * (1 if sg < 0 else 0.82)
        hx, hy = bx * math.cos(g) - by * math.sin(g), bx * math.sin(g) + by * math.cos(g)
        A2 = (E[0] + hx * ln, E[1] + hy * ln)
        ps += net(cong(E, ((E[0] + A2[0]) / 2 + hy * 2, (E[1] + A2[1]) / 2 - hx * 2), A2, 6), w * 0.95, (0.95, 0.45), 0)
    return ps


CT_DY = 206          # bìa 1440 -> story: nội dung dời xuống (dưới vùng chữ / nút TikTok phía trên)


def chu_thich(t, d):
    """Chú thích tay (bia_ct): nen-story.jpg = nền xám tối + quầng sáng (toa) + hạt giấy; tính chỗ đặt tiêu đề / chú thích như biaChuThich +
    chuThich1 (font viết tay = Patrick Hand của thư viện chữ), vẽ gạch chân / mũi tên vẽ tay thành PNG; ghi chu-thich.json cho server."""
    from PIL import ImageFont
    _RAND[0] = 11
    im = Image.new("RGBA", (W, H), hexc(t["nen"]))
    if t.get("toa"):
        im = Image.alpha_composite(im, toa(t["toa"]))
    if t.get("hat_nen"):
        im = hat(im, t["hat_nen"])
    im.convert("RGB").save(os.path.join(d, "nen-story.jpg"), quality=92)
    b = (t.get("xem") or {}).get("bia_ct") or {}
    mau = hexc(b.get("mau") or t.get("tay_mau") or "FFFFFF")
    ff = os.path.join(APP, "story-mau", "fonts", "tv-patrick.ttf")
    F = lambda co: ImageFont.truetype(ff, co)
    out = {"dy": CT_DY, "tieu": {}, "nhan": [], "png": []}
    x0, co = t.get("bia_x") or 72, b.get("co_tieu") or t.get("bia_co") or 96
    y = 272 + 22
    out["tieu"]["t1"] = {"x": x0, "tren": y, "co": co}
    hb = F(co).getbbox(b.get("t1") or "H")
    y += hb[3] - F(co).getbbox("H")[1] + round(co * 0.14)
    if b.get("t2"):
        f2 = F(co)
        out["tieu"]["t2"] = {"x": x0, "tren": y, "co": co}
        h2 = f2.getbbox(b["t2"])
        top = f2.getbbox("H")[1]
        base = y + (h2[3] - top)
        ps = gach(x0 + h2[0], x0 + h2[2], base + 10, max(4, co / 15), True)
        a, gx, gy = ve_net(ps, mau)
        if a:
            a.save(os.path.join(d, "ct-gach-tieu.png"))
            out["png"].append({"k": "gach_t2", "ten": "ct-gach-tieu.png", "x": gx, "y": gy, "w": a.width, "h": a.height, "nhom": "tieu"})
        y = base + 30
    if b.get("nho"):
        out["tieu"]["nho"] = {"x": x0, "tren": y, "co": t.get("bia_co_phu") or 34}
    for i, it in enumerate(b.get("ds") or []):
        c = it.get("co") or t.get("tay_co") or 46
        f = F(c)
        top = f.getbbox("H")[1]
        lead = round(c * 1.22)
        rows = [r for r in str(it.get("chu") or "").replace("\r", "\n").split("\n") if r]
        gia = ("%s%s" % (it.get("gia_chu") if it.get("gia_chu") is not None else "giá: ", it["gia"])) if it.get("gia") else ""
        ws = [f.getlength(r) for r in rows] + ([f.getlength(gia)] if gia else [])
        wmax = max(ws or [0])
        can = it.get("can") or "trai"
        ox, oy = it["o"][0], it["o"][1] + CT_DY
        l = ox - wmax if can == "phai" else (ox - wmax / 2 if can == "giua" else ox)
        n = {"k": "ct%d" % (i + 1), "can": can, "x": round(l), "w": round(wmax) + 4, "tren": oy, "co": c, "chu": "\n".join(rows), "gia": gia}
        nhom = "ct%d" % (i + 1)
        gb = [l, oy, l + wmax, oy + lead * (len(rows) + (1 if gia else 0)) - (lead - (f.getbbox("Hg")[3] - top))]
        hb = None
        if gia:
            gy0 = oy + lead * len(rows)
            n["gia_tren"] = gy0
            wg = f.getlength(gia)
            gl = l + (wmax - wg if can == "phai" else ((wmax - wg) / 2 if can == "giua" else 0))
            px = gl + f.getlength(gia[:len(gia) - len(str(it["gia"]))])
            pb = f.getbbox(str(it["gia"]))
            base = gy0 + (f.getbbox("H")[3] - top)
            ps = gach(px + pb[0], px + pb[2], base + 7, max(3, c / 11), False)
            a, gx, gy = ve_net(ps, mau)
            if a:
                a.save(os.path.join(d, "ct-gach-%d.png" % (i + 1)))
                out["png"].append({"k": "gach_ct%d" % (i + 1), "ten": "ct-gach-%d.png" % (i + 1), "x": gx, "y": gy, "w": a.width, "h": a.height, "nhom": nhom})
                hb = [gx, gy, gx + a.width, gy + a.height]
        if it.get("toi"):
            E = (it["toi"][0], it["toi"][1] + CT_DY)
            cx, cy = (gb[0] + gb[2]) / 2, (gb[1] + gb[3]) / 2
            ex, ey = E[0] - cx, E[1] - cy
            tu = it.get("tu") or (("duoi" if ey > 0 else "tren") if abs(ey) > abs(ex) * 0.7 else ("phai" if ex > 0 else "trai"))
            h0, cach = hb or gb, it.get("cach") or 18
            if tu == "duoi":
                S0 = (h0[0] + (h0[2] - h0[0]) * (0.72 if ex > 0 else 0.28), h0[3] + cach)
            elif tu == "tren":
                S0 = (gb[0] + (gb[2] - gb[0]) * (0.72 if ex > 0 else 0.28), gb[1] - cach)
            elif tu == "phai":
                S0 = (max(gb[2], h0[2]) + cach, (h0[1] + h0[3]) / 2 - (10 if hb else 0))
            else:
                S0 = (min(gb[0], h0[0]) - cach, (h0[1] + h0[3]) / 2 - (10 if hb else 0))
            a, gx, gy = ve_net(mui_ten(S0, E, it.get("day") or max(3.5, c / 9.5), it.get("huong") or "ngang"), mau)
            if a:
                a.save(os.path.join(d, "ct-mui-%d.png" % (i + 1)))
                out["png"].append({"k": "mui_ct%d" % (i + 1), "ten": "ct-mui-%d.png" % (i + 1), "x": gx, "y": gy, "w": a.width, "h": a.height, "nhom": nhom})
        out["nhan"].append(n)
    json.dump(out, open(os.path.join(d, "chu-thich.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


VE = {"kinh": glass, "phang": phang, "tiem": tiem, "bang": bang, "ct": chu_thich}

if __name__ == "__main__":
    goc = os.path.join(APP, "theme-ps")
    ids = sys.argv[1:] or sorted(os.listdir(goc))
    for tid in ids:
        f = os.path.join(goc, tid, "theme.json")
        if not os.path.isfile(f):
            continue
        t = json.load(open(f, encoding="utf-8"))
        x = t.get("xem") or {}
        kieu = "kinh" if "bia_sp" in x and t.get("nen_kieu") == "kinh" else ("phang" if "bia_tn" in x else ("tiem" if "bia_tiem" in x else (
            "bang" if "bia_bang" in x else ("ct" if "bia_ct" in x else None))))
        if kieu not in VE:
            continue
        d = os.path.join(RA, tid)
        os.makedirs(d, exist_ok=True)
        VE[kieu](t, d)
        print("xong", tid, kieu)
