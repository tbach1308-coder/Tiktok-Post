# Ảnh nền / ảnh trang trí 9:16 cho mẫu story theo kho theme Photoshop (fen 16/11 12h05 "theme glass nữa đi", 12h07 "theme pts story xóa
# làm lại cái mới"): vẽ lại phần nền tĩnh của trang bìa từng theme (theme-ps/<id>/theme.json + cách vẽ trong _dong-co.jsx) ở khổ
# 1080x1920, phần chữ / ảnh máy là lớp sửa được trong khung design. Chạy từ thư mục app: python3 story-mau/ps/tao-nen-ps.py [id ...]
#   Glass (nen_kieu kinh, bìa biaSanPham): nen-story.jpg = nền + đốm màu loang (themeDom, 100%), phu-kinh.png = lớp màu theme (anh_mau %)
#   + đốm (dom_tren %) phủ lên ảnh nền khi fen gắn ảnh nền, bong-may.png = bóng mờ dưới máy.
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


VE = {"kinh": glass}

if __name__ == "__main__":
    goc = os.path.join(APP, "theme-ps")
    ids = sys.argv[1:] or sorted(os.listdir(goc))
    for tid in ids:
        f = os.path.join(goc, tid, "theme.json")
        if not os.path.isfile(f):
            continue
        t = json.load(open(f, encoding="utf-8"))
        x = t.get("xem") or {}
        kieu = "kinh" if "bia_sp" in x and t.get("nen_kieu") == "kinh" else None
        if kieu not in VE:
            continue
        d = os.path.join(RA, tid)
        os.makedirs(d, exist_ok=True)
        VE[kieu](t, d)
        print("xong", tid, kieu)
