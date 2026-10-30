# -*- coding: utf-8 -*-
"""Kiem tra slide Poly theo bo quy tac. Dung: python3 kiem_tra_slide.py <thu muc hoac file png>"""
import sys, os, glob
from PIL import Image

W, H = 1080, 1440
CX = 540
SAFE_L, SAFE_R = 180, 900
BAND_T, BAND_B = 168, 1300
RAIL   = (903, 640, 1080, 1400)   # cot nut TikTok (chua 3px dung sai mep)
COUNT  = (950, 20, 1080, 80)      # o dem 1/N

def content_mask(im):
    """Pixel duoc coi la 'noi dung': sang ro hoac mang mau thuong hieu (xanh/vang/mint)."""
    px = im.convert('RGB').load()
    w, h = im.size
    mask = bytearray(w*h)
    for y in range(h):
        base = y*w
        for x in range(w):
            r, g, b = px[x, y]
            lum = (r*299 + g*587 + b*114)//1000
            brand = lum > 125 and ((g > 140 and g > r+45 and g > b+45) or (r > 170 and g > 150 and b < 110))
            if lum > 172 or brand:
                mask[base+x] = 1
    # bo qua o logo goc tren trai (nam ngoai dai noi dung theo thiet ke)
    for y in range(0, 150):
        base = y*w
        for x in range(0, 430):
            mask[base+x] = 0
    return mask, w, h

def rect_has(mask, w, box, min_px=60):
    x0, y0, x1, y1 = box
    n = 0
    for y in range(y0, y1):
        base = y*w
        for x in range(x0, x1):
            if mask[base+x]:
                n += 1
                if n >= min_px:
                    return n
    return n

def bbox(mask, w, h):
    l, t, r, b = w, h, -1, -1
    for y in range(h):
        base = y*w
        row = False
        for x in range(w):
            if mask[base+x]:
                row = True
                if x < l: l = x
                if x > r: r = x
        if row:
            if t > y: t = y
            b = y
    return (l, t, r, b) if r >= 0 else None

def row_density(mask, w, h):
    return [sum(mask[y*w:(y+1)*w]) for y in range(h)]

def gaps(dens, t, b, thresh=3, min_len=18):
    out, run = [], 0
    for y in range(t, b+1):
        if dens[y] <= thresh:
            run += 1
        else:
            if run >= min_len: out.append((y-run, run))
            run = 0
    if run >= min_len: out.append((b+1-run, run))
    return out

def check(path):
    la_bia = os.path.basename(path).startswith('slide-01')
    im = Image.open(path)
    loi, canh = [], []
    if im.size != (W, H):
        loi.append("Kich thuoc %dx%d, phai la %dx%d" % (im.size[0], im.size[1], W, H))
        return loi, canh
    mask, w, h = content_mask(im)

    n = rect_has(mask, w, RAIL)
    if n >= 60: loi.append("Noi dung lot vao cot nut TikTok (x>900, y 640-1400): ~%d px sang" % n)
    n = rect_has(mask, w, COUNT)
    if n >= 60: loi.append("Noi dung lot vao o dem 1/N (goc tren phai): ~%d px sang" % n)

    bb = bbox(mask, w, h)
    if not bb:
        loi.append("Khong thay noi dung")
        return loi, canh
    l, t, r, b = bb
    le_trai, le_phai = l, W-1-r
    lech = abs(le_trai - le_phai)
    if lech > 26:
        if la_bia:
            canh.append("Le trai %d / phai %d (bia can trai nen lech la binh thuong)" % (le_trai, le_phai))
        else:
            loi.append("Khong can giua: le trai %d, le phai %d (lech %d px)" % (le_trai, le_phai, lech))
    if t < BAND_T - 40:
        canh.append("Noi dung bat dau o y=%d, tren dai an toan (%d)" % (t, BAND_T))
    if b > BAND_B + 20:
        loi.append("Noi dung ket thuc o y=%d, duoi dai an toan (%d)" % (b, BAND_B))
    if b < BAND_B - 150:
        canh.append("Ho day %d px (noi dung het o y=%d, dai den %d)" % (BAND_B-b, b, BAND_B))

    g = gaps(row_density(mask, w, h), t, b)
    if len(g) >= 2:
        cao = [x[1] for x in g]
        if max(cao) > min(cao)*1.7:
            canh.append("Khoang cach khong deu: %s px" % ", ".join(str(c) for c in cao))
    return loi, canh

def main():
    arg = sys.argv[1] if len(sys.argv) > 1 else "."
    files = sorted(glob.glob(os.path.join(arg, "slide-*.png"))) if os.path.isdir(arg) else [arg]
    if not files:
        print("Khong tim thay file slide-*.png"); return
    tong = 0
    for f in files:
        loi, canh = check(f)
        tong += len(loi)
        ten = os.path.basename(f)
        if not loi and not canh:
            print("OK   %s" % ten)
        else:
            print("---- %s" % ten)
            for x in loi:  print("  LOI   %s" % x)
            for x in canh: print("  Luu y %s" % x)
    print("\nTong: %d loi can sua" % tong)

if __name__ == "__main__":
    main()
