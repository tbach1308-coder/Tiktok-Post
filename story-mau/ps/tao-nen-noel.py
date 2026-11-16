# Nền story 9:16 (1080x1920) cho các theme Noel trong kho theme Photoshop (fen 16/11 11h23 "story theme same kho pts" + "tạo theme christmas").
# Dùng đúng hàm vẽ nền của theme (theme-ps/noel-poly-christmas/tao_anh.py và theme-ps/noel-tao-anh.py), chỉ đổi khung 1080x1440 -> 1080x1920
# (lá thông góc, quầng sáng, hạt tuyết, sao vẽ lại cho khung dọc, không kéo giãn ảnh 3:4).
# Chạy từ thư mục app: python3 story-mau/ps/tao-nen-noel.py  -> story-mau/ps/<theme id>/nen-story.jpg
import os, sys

APP = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
RA = os.path.join(APP, "story-mau", "ps")


def nap(f, cat, doi=()):
    src = open(f, encoding="utf-8").read()
    src = src[:src.index(cat)]
    for a, b in doi:
        assert a in src, a
        src = src.replace(a, b)
    ns = {"__name__": "nen_story", "__file__": f}
    sys.argv = [f, os.path.join(RA, "_tam")]
    exec(compile(src, f, "exec"), ns)
    return ns


def ra(tid, ten_tam):
    d = os.path.join(RA, tid)
    os.makedirs(d, exist_ok=True)
    os.replace(os.path.join(RA, "_tam", ten_tam), os.path.join(d, "nen-story.jpg"))
    print("xong", tid)


# Poly Christmas: lá thông xanh đậm (W, H khai báo trong hàm nen)
pc = nap(os.path.join(APP, "theme-ps", "noel-poly-christmas", "tao_anh.py"), 'nen("nen-1.jpg"', [("W, H = 1080, 1440", "W, H = 1080, 1920")])
pc["nen"]("p.jpg", False, 11)
ra("noel-poly-christmas", "p.jpg")

# Đỏ nhung / Trắng tuyết / Đêm xanh: W, H toàn cục của noel-tao-anh.py
nt = nap(os.path.join(APP, "theme-ps", "noel-tao-anh.py"), "# Do nhung:", [("W, H = 1080, 1440", "W, H = 1080, 1920")])
W, H = 1080, 1920
nt["nen"]("d.jpg", "5A0A15", ("8E1B2A", 210), [("0A2A1A", 235, 8, 9, 1.0), ("123A25", 225, 3.5, 7, 1.1), ("1A4A30", 210, 1.4, 5, 1.2)], ("5A0A15", 140),
          ("FFFFFF", 60), ["F5C542", "FFFFFF", "F5C542"], guong=False, seed=31, nhung=30)
ra("noel-do-nhung", "d.jpg")
nt["nen"]("s.jpg", "F7F3EC", ("FFFFFF", 0), [("D3DED5", 210, 2.2, 5, 0.95), ("BACDBF", 230, 0.7, 4, 1.0)], ("F7F3EC", 0), ("A9BCC4", 50),
          ["E0B54A", "D8433A", "E0B54A"], guong=False, seed=53, bong=13,
          goc=[(-60, -40, 35), (W + 50, -50, 145), (-70, H * 0.42, 5), (W + 60, H * 0.5, 185)], so_nhanh=2, dai=(240, 400))
ra("noel-trang-tuyet", "s.jpg")
nt["nen"]("x.jpg", "0B1631", ("22406F", 210), [], ("0B1631", 120), ("FFFFFF", 130), ["F5C542", "FFFFFF", "F5C542", "F5C542"], guong=False, seed=71,
          rang="09122A", bong=16)
ra("noel-dem-xanh", "x.jpg")
try:
    os.rmdir(os.path.join(RA, "_tam"))
except OSError:
    pass
