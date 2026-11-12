# Đóng gói app Mac "Poly Dung Bai (dung chung).app" thành zip (giữ quyền chạy) -> dist/Poly-Dung-Bai-dung-chung-Mac.zip
# Chạy: python3 packaging/mac-chung/build.py  (cần Pillow để làm icon từ ui/poly.png)
import io, os, struct, zipfile, time
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
GOC = os.path.dirname(os.path.dirname(D))
APP = "Poly Dung Bai (dung chung).app"
OUT = os.path.join(GOC, "dist", "Poly-Dung-Bai-dung-chung-Mac.zip")


def icns(png):
    im = Image.open(png).convert("RGBA")
    khoi = b""
    for loai, n in ((b"ic07", 128), (b"ic08", 256), (b"ic09", 512)):
        b = io.BytesIO()
        im.resize((n, n), Image.LANCZOS).save(b, "PNG")
        d = b.getvalue()
        khoi += loai + struct.pack(">I", len(d) + 8) + d
    return b"icns" + struct.pack(">I", len(khoi) + 8) + khoi


def them(z, ten, data, quyen):
    zi = zipfile.ZipInfo(ten, time.localtime(time.time())[:6])
    zi.create_system = 3          # unix: Archive Utility giữ quyền chạy
    zi.external_attr = (quyen & 0xFFFF) << 16
    zi.compress_type = zipfile.ZIP_DEFLATED
    z.writestr(zi, data)


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sh = open(os.path.join(D, "poly-chung"), "rb").read().replace(b"\r\n", b"\n")
    with zipfile.ZipFile(OUT, "w") as z:
        for thu_muc in (APP + "/", APP + "/Contents/", APP + "/Contents/MacOS/", APP + "/Contents/Resources/"):
            zi = zipfile.ZipInfo(thu_muc, time.localtime(time.time())[:6])
            zi.create_system = 3
            zi.external_attr = (0o40755 << 16) | 0x10
            z.writestr(zi, b"")
        them(z, APP + "/Contents/Info.plist", open(os.path.join(D, "Info.plist"), "rb").read(), 0o100644)
        them(z, APP + "/Contents/PkgInfo", b"APPL????", 0o100644)
        them(z, APP + "/Contents/MacOS/poly-chung", sh, 0o100755)
        them(z, APP + "/Contents/Resources/poly.icns", icns(os.path.join(GOC, "ui", "poly.png")), 0o100644)
        them(z, "HUONG-DAN.txt", open(os.path.join(D, "HUONG-DAN.txt"), "rb").read(), 0o100644)
    print(OUT, os.path.getsize(OUT))


if __name__ == "__main__":
    main()
