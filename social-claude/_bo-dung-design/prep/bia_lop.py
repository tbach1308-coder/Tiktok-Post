# -*- coding: utf-8 -*-
"""Ghép LỚP ẢNH BÌA (thumbnail) cho Photoshop: 1 file PNG 1080x1440 nền trong suốt, đặt vào là khớp khung.
Bố cục làm ở đây (nhanh, xem trước được), Photoshop chỉ đặt lớp này lên nền bg-thumb rồi viết chữ đè lên.
Fen 29/10: "mấy dạng hình ảnh thumbnail làm sáng tạo vô, căn chỉnh bố cục, to nhỏ phù hợp, đừng kiểu gắn vô cho có".

Dùng (máy shop):
  python "E:/Social Claude/_bo-dung-design/prep/bia_lop.py" "<bài>/tai-nguyen/bia-lop.png" MỤC [MỤC ...]
      [--xem "<bài>/log/bia-xem.jpg"] [--nen "<bài>/tai-nguyen/bg-thumb.png"] [--kenh laptop|ipad] [--chu 470]

MỤC (vẽ theo thứ tự: mục trước nằm dưới):
  may=<png nền trong>@cx,cy,w[,xoay=-10][,lat][,bong=0.5][,sang=22C55E][,sangop=0.45]
      máy / đồ vật ĐÃ TÁCH NỀN (prep/tach_nen.py, code/tach_nen_ps.py): tâm (cx,cy), rộng w px (trước khi xoay),
      xoay độ (dương = nghiêng theo chiều kim đồng hồ), lat = lật ngang, bong = bóng đổ mềm dưới máy (0 = tắt),
      sang = vệt sáng màu dưới chân máy (hex), sangop = độ đậm vệt sáng.
  anh=<ảnh>@l,t,w[,crop=x0:y0:x1:y1][,mo=tren:220:duoi:0:trai:0:phai:0][,toi=0.2][,xoay=0]
      ảnh thường (cầm tay, cận chi tiết, cảnh ở shop) TRÀN KHUNG, không khung viền: góc trái trên (l,t), rộng w,
      mo = mờ dần viền vào nền (px mỗi cạnh), toi = phủ tối 0..1.
  sang=cx,cy,w,h[,hex=22C55E][,op=0.5]      vệt sáng tự do (sau lưng máy, sau tiêu đề…)

In ra: % khung ảnh chiếm, khung chứa ảnh, khoảng trống tới câu móc / đáy, phần bị tràn khỏi khung.
Mã thoát 0 = đạt luật bìa (mục 17c), 3 = có cảnh báo (đọc dòng CANH BAO rồi chỉnh số).
"""
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try:
        _f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass
import argparse, os, re
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1440
HOOK = {"laptop": 1320, "ipad": None}     # tâm câu móc bìa (iPad bìa không câu móc)


def hex2rgb(h):
    h = h.strip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def tach_so(s):
    """'540,700,980,xoay=-8,lat' -> ([540,700,980], {'xoay':'-8','lat':'1'})"""
    so, kv = [], {}
    for p in [x.strip() for x in s.split(",") if x.strip()]:
        if "=" in p:
            k, v = p.split("=", 1)
            kv[k.strip().lower()] = v.strip()
        elif re.fullmatch(r"-?\d+(\.\d+)?", p):
            so.append(float(p))
        else:
            kv[p.lower()] = "1"
    return so, kv


DAC = Image.new("L", (W, H), 0)     # chỉ phần máy / ảnh (không tính bóng, vệt sáng) để đo % khung


def dan(canvas, im, x, y, dac=False):
    """alpha_composite cho phép toạ độ âm / tràn khung."""
    x, y = int(round(x)), int(round(y))
    lop = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    lop.paste(im, (x, y), im)
    canvas.alpha_composite(lop)
    if dac:
        global DAC
        DAC = Image.fromarray(np.maximum(np.asarray(DAC), np.asarray(lop.getchannel("A"))))


def phan_tran(im, x, y):
    """% điểm ảnh (alpha > 40) nằm ngoài khung 1080x1440."""
    a = np.asarray(im.getchannel("A")) > 40
    tong = int(a.sum())
    if not tong:
        return 0.0
    y0, x0 = max(0, -y), max(0, -x)
    y1, x1 = min(a.shape[0], H - y), min(a.shape[1], W - x)
    trong = int(a[y0:y1, x0:x1].sum()) if y1 > y0 and x1 > x0 else 0
    return 100.0 * (tong - trong) / tong


def mo_vien(im, tren=0, duoi=0, trai=0, phai=0):
    """mờ dần các cạnh ảnh vào nền (alpha theo đường cong mượt)."""
    im = im.convert("RGBA")
    h, w = im.height, im.width
    k = np.ones((h, w), dtype=np.float32)
    yy = np.arange(h, dtype=np.float32)[:, None]
    xx = np.arange(w, dtype=np.float32)[None, :]
    if tren:
        k = np.minimum(k, np.clip(yy / tren, 0, 1))
    if duoi:
        k = np.minimum(k, np.clip((h - yy) / duoi, 0, 1))
    if trai:
        k = np.minimum(k, np.clip(xx / trai, 0, 1))
    if phai:
        k = np.minimum(k, np.clip((w - xx) / phai, 0, 1))
    k = k * k * (3 - 2 * k)
    a = np.asarray(im.getchannel("A"), dtype=np.float32) * k
    im.putalpha(Image.fromarray(a.clip(0, 255).astype("uint8")))
    return im


def ve_may(canvas, file, so, kv, bao):
    cx, cy, w = so[0], so[1], so[2]
    m = Image.open(file).convert("RGBA")
    bb = m.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    if not bb:
        raise SystemExit("LOI: %s không có phần nào không trong suốt (chưa tách nền?)" % file)
    m = m.crop(bb)
    if m.getchannel("A").getextrema()[0] == 255:
        bao.append("CANH BAO %s: ảnh không có nền trong suốt, sẽ thành mảng chữ nhật dán lên nền. Tách nền trước (prep/tach_nen.py) hoặc dùng anh=… có mo=" % os.path.basename(file))
    if "lat" in kv:
        m = m.transpose(Image.FLIP_LEFT_RIGHT)
    h = round(m.height * w / m.width)
    m = m.resize((int(w), int(h)), Image.LANCZOS)
    xoay = float(kv.get("xoay", 0))
    if xoay:
        m = m.rotate(-xoay, resample=Image.BICUBIC, expand=True)
    x0, y0 = cx - m.width / 2, cy - m.height / 2
    # vệt sáng dưới chân máy
    if kv.get("sang"):
        op = float(kv.get("sangop", 0.45))
        g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        r, gg, b = hex2rgb(kv["sang"])
        a = m.getchannel("A").getbbox()
        day = y0 + a[3]
        ImageDraw.Draw(g).ellipse((cx - w * 0.48, day - w * 0.10, cx + w * 0.48, day + w * 0.07), fill=(r, gg, b, int(255 * op)))
        g = g.filter(ImageFilter.GaussianBlur(w * 0.06))
        canvas.alpha_composite(g)
    # bóng đổ mềm
    bong = float(kv.get("bong", 0.5))
    if bong > 0:
        a = m.getchannel("A").point(lambda v: int(v * bong))
        sh = Image.new("RGBA", m.size, (0, 0, 0, 0))
        sh.putalpha(a)
        pad = int(w * 0.08)
        shb = Image.new("RGBA", (m.width + 2 * pad, m.height + 2 * pad), (0, 0, 0, 0))
        shb.paste(sh, (pad, pad), sh)
        shb = shb.filter(ImageFilter.GaussianBlur(max(6, w * 0.03)))
        dan(canvas, shb, x0 - pad, y0 - pad + w * 0.035)
    dan(canvas, m, x0, y0, True)
    tr = phan_tran(m, int(x0), int(y0))
    return [x0, y0, x0 + m.width, y0 + m.height], tr


def ve_anh(canvas, file, so, kv, bao):
    l, t, w = so[0], so[1], so[2]
    im = Image.open(file).convert("RGBA")
    if kv.get("crop"):
        c = [int(float(v)) for v in kv["crop"].split(":")]
        im = im.crop(tuple(c))
    h = round(im.height * w / im.width)
    im = im.resize((int(w), int(h)), Image.LANCZOS)
    toi = float(kv.get("toi", 0))
    if toi > 0:
        den = Image.new("RGBA", im.size, (0, 0, 0, int(255 * toi)))
        im = Image.alpha_composite(im, den)
    mo = {"tren": 0, "duoi": 0, "trai": 0, "phai": 0}
    if kv.get("mo"):
        p = kv["mo"].split(":")
        for i in range(0, len(p) - 1, 2):
            mo[p[i]] = int(float(p[i + 1]))
    if any(mo.values()):
        im = mo_vien(im, **mo)
    xoay = float(kv.get("xoay", 0))
    if xoay:
        im = im.rotate(-xoay, resample=Image.BICUBIC, expand=True)
    dan(canvas, im, l, t, True)
    return [l, t, l + im.width, t + im.height], phan_tran(im, int(l), int(t))


def ve_sang(canvas, so, kv):
    cx, cy, w, h = so[:4]
    r, g, b = hex2rgb(kv.get("hex", "22C55E"))
    op = float(kv.get("op", 0.5))
    lop = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(lop).ellipse((cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2), fill=(r, g, b, int(255 * op)))
    canvas.alpha_composite(lop.filter(ImageFilter.GaussianBlur(min(w, h) * 0.25)))


def main():
    ap = argparse.ArgumentParser(description="Ghép lớp ảnh bìa 1080x1440 nền trong suốt")
    ap.add_argument("out")
    ap.add_argument("muc", nargs="+")
    ap.add_argument("--xem", default="", help="ảnh xem trước (ghép lên nền + vạch vùng chữ)")
    ap.add_argument("--nen", default="", help="nền để xem trước, vd bg-thumb.png")
    ap.add_argument("--kenh", default="laptop", choices=["laptop", "ipad"])
    ap.add_argument("--chu", type=int, default=470, help="đáy khối tiêu đề (px) để xem trước / báo")
    ap.add_argument("--vung", action="append", default=[], help='"l,t,r,b" ô chữ / sticker / VS sẽ đặt thêm trong Photoshop (tính vào khoảng trống, không tính % ảnh)')
    a = ap.parse_args()

    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bao, khung, tran = [], [], []
    for m in a.muc:
        if "=" not in m:
            raise SystemExit("LOI mục '%s': phải là may=…@…, anh=…@… hoặc sang=…" % m)
        loai, rest = m.split("=", 1)
        loai = loai.strip().lower()
        if loai == "sang":
            so, kv = tach_so(rest)
            ve_sang(canvas, so, kv)
            continue
        if "@" not in rest:
            raise SystemExit("LOI mục '%s': thiếu @toạ độ" % m)
        file, tham = rest.rsplit("@", 1)
        so, kv = tach_so(tham)
        if not os.path.isfile(file):
            raise SystemExit("LOI: không thấy file %s" % file)
        if loai == "may":
            if len(so) < 3:
                raise SystemExit("LOI may=…@cx,cy,w")
            k, t = ve_may(canvas, file, so, kv, bao)
        elif loai == "anh":
            if len(so) < 3:
                raise SystemExit("LOI anh=…@l,t,w")
            k, t = ve_anh(canvas, file, so, kv, bao)
        else:
            raise SystemExit("LOI loại mục '%s'" % loai)
        khung.append(k)
        tran.append((os.path.basename(file), t))

    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    canvas.save(a.out, dpi=(72, 72))

    # ---- đo + báo theo luật 17c ----
    al = DAC.point(lambda v: 255 if v > 60 else 0)
    pct = 100.0 * float((np.asarray(al) > 0).mean())
    bb = al.getbbox() or (0, 0, 0, 0)
    for v in a.vung:
        q = [int(float(x)) for x in v.split(",")]
        bb = (min(bb[0], q[0]), min(bb[1], q[1]), max(bb[2], q[2]), max(bb[3], q[3])) if bb[3] else tuple(q)
    print("LOP BIA %s" % a.out)
    print("anh chiem %.0f%% khung, khung chua anh x %d-%d, y %d-%d" % (pct, bb[0], bb[2], bb[1], bb[3]))
    for ten, t in tran:
        if t > 0.5:
            print("tran khoi khung: %s %.0f%%" % (ten, t))
        if t > 30:
            bao.append("CANH BAO %s tràn ra ngoài %.0f%% (> 30%%): mất phần nhận diện máy, kéo vào trong bớt" % (ten, t))
    can = 35 if len(khung) <= 1 else 20          # 1 máy: ≥ 35% khung; 2–3 máy (đối đầu, xòe quạt): cả cụm ≥ 20% (2 laptop đặt cạnh nhau không chồng chỉ được ~23%)
    if pct < can:
        bao.append("CANH BAO ảnh chỉ chiếm %.0f%% khung (< %d%%): máy nhỏ, nhìn như dán cho có. Tăng w hoặc cho tràn mép" % (pct, can))
    if pct > 62:
        bao.append("CANH BAO ảnh chiếm %.0f%% khung (> 62%%): lấn hết chỗ chữ, thu nhỏ hoặc đẩy bớt ra mép" % pct)
    hook = HOOK[a.kenh]
    day = (hook - 40) if hook else 1386
    if bb[3] and day - bb[3] > 160:
        bao.append("CANH BAO trống %dpx từ đáy ảnh (y %d) tới %s (y %d): hạ ảnh xuống / phóng to / cho tràn đáy" % (day - bb[3], bb[3], "câu móc" if hook else "đáy an toàn", day))
    if bb[1] and bb[1] - a.chu > 160:
        bao.append("CANH BAO trống %dpx giữa tiêu đề (đáy y %d) và ảnh (y %d): kéo ảnh lên hoặc cho ảnh lấn sau tiêu đề" % (bb[1] - a.chu, a.chu, bb[1]))
    # khung chữ nhật cứng: ảnh đục kín cả 1 hình chữ nhật nhỏ (dán nguyên khối)
    if khung and pct > 0:
        cw, ch = bb[2] - bb[0], bb[3] - bb[1]
        dac = 100.0 * float((np.asarray(al)[bb[1]:bb[3], bb[0]:bb[2]] > 0).mean())
        if dac > 92 and cw < W - 20 and ch < H * 0.7:
            bao.append("CANH BAO ảnh là 1 mảng chữ nhật đặc (%.0f%% khung chứa đục), nhìn như ảnh dán vào giữa nền. Tách nền máy hoặc mờ viền (mo=) cho tràn khung" % dac)

    if a.xem:
        nen = Image.open(a.nen).convert("RGBA").resize((W, H)) if a.nen and os.path.isfile(a.nen) else Image.new("RGBA", (W, H), (12, 28, 20, 255))
        nen.alpha_composite(canvas)
        d = ImageDraw.Draw(nen, "RGBA")
        d.rectangle((96, 140, 984, a.chu), outline=(255, 214, 10, 200), width=3)
        d.text((104, 146), "vung tieu de", fill=(255, 214, 10, 230))
        if hook:
            d.rounded_rectangle((300, hook - 30, 780, hook + 30), 30, outline=(255, 255, 255, 200), width=3)
            d.text((310, hook - 26), "cau moc", fill=(255, 255, 255, 230))
        for v in a.vung:
            q = [int(float(x)) for x in v.split(",")]
            d.rectangle(q, outline=(74, 222, 128, 220), width=3)
        d.rectangle((950, 620, 1080, 1320), outline=(239, 68, 68, 140), width=2)
        d.rectangle((0, 1386, 1080, 1440), outline=(239, 68, 68, 140), width=2)
        os.makedirs(os.path.dirname(os.path.abspath(a.xem)), exist_ok=True)
        nen.convert("RGB").resize((540, 720), Image.LANCZOS).save(a.xem, quality=88)
        print("xem truoc:", a.xem)
    for b in bao:
        print(b)
    print("DAT luat bia 17c" if not bao else "CON %d canh bao" % len(bao))
    sys.exit(3 if bao else 0)


if __name__ == "__main__":
    import sys
    main()
