# Dò TRÙNG ẢNH với các bài đã làm (luật 16d, 27/10: hạn chế trùng ảnh giữa các post).
# Sổ ảnh: anh-da-dung.json (cùng thư mục bộ code). Mỗi dòng: bài, file, 2 mã băm (cả ảnh + vùng vật thể).
#   Tạo/cập nhật sổ từ thư mục đã stage:   python3 prep/trung_anh.py them <thu-muc-Laptop-da-stage>
#   Dò 1 bài mới trước khi dựng:           python3 prep/trung_anh.py kiem <thu-muc-tai-nguyen> <TenThuMucBai>
# Hai cách dò, cái nào báo cũng tính:
#   - mã băm dHash (bắt ảnh nền đã làm mờ/phủ tối): khoảng cách <= 40/256 là TRÙNG, 41-60 GẦN GIỐNG
#   - điểm khớp ORB (bắt ảnh máy đã cắt/thu phóng/đặt lên nền khác): >= 250 điểm là TRÙNG, 60-249 GẦN GIỐNG
#     (GẦN GIỐNG thường là cùng hình nền Windows trên màn máy -> mở 2 ảnh ra xem, khác góc chụp là được)
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, os, json, re
import numpy as np
import cv2
from PIL import Image, ImageOps
SO = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'anh-da-dung.json')
BO_QUA = re.compile(r'(^bg-thumb|^bg\.png$|^thumb-nen|^ic-|^icon-|^cut-)', re.I)   # nền chung theo luật / icon

def dh(im, n=16):
    g = ImageOps.autocontrast(im.convert('L').resize((n + 1, n), Image.LANCZOS))
    a = np.asarray(g).astype(int); return (a[:, 1:] > a[:, :-1]).flatten()

def vat_the(im):
    # vùng vật thể: ảnh có alpha thì theo alpha (đặt lên nền tối như khung studio), không thì theo cạnh rõ
    if im.mode in ('RGBA', 'LA') or 'transparency' in im.info:
        im = im.convert('RGBA'); bb = im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
        bg = Image.new('RGBA', im.size, (40, 44, 52, 255)); bg.alpha_composite(im); im = bg.convert('RGB')
        return im.crop(bb) if bb else im
    g = np.asarray(im.convert('L')).astype(float)
    gx = np.abs(np.diff(g, axis=1))[:-1, :]; gy = np.abs(np.diff(g, axis=0))[:, :-1]
    m = (gx + gy) > 40; ys, xs = np.where(m)
    if len(xs) < 200: return im
    x0, x1 = np.percentile(xs, [1, 99]).astype(int); y0, y1 = np.percentile(ys, [1, 99]).astype(int)
    if (x1 - x0) < 20 or (y1 - y0) < 20: return im
    return im.crop((x0, y0, x1 + 1, y1 + 1))

def bam(p):
    im0 = Image.open(p); im = im0.convert('RGB')
    return {'ca': ''.join('1' if b else '0' for b in dh(im)), 'vt': ''.join('1' if b else '0' for b in dh(vat_the(im0)))}

ORB_SO = SO.replace('.json', '-orb.npz')
_orb = cv2.ORB_create(800); _bf = cv2.BFMatcher(cv2.NORM_HAMMING)
def orb_desc(p):
    im = Image.open(p)
    if im.mode in ('RGBA', 'LA') or 'transparency' in im.info:
        im = im.convert('RGBA'); bg = Image.new('RGBA', im.size, (40, 44, 52, 255)); bg.alpha_composite(im); im = bg
    g = np.asarray(im.convert('L')); s = 900 / max(g.shape)
    if s < 1: g = cv2.resize(g, None, fx=s, fy=s)
    k, d = _orb.detectAndCompute(g, None)
    return (np.float32([x.pt for x in k]) if k else np.zeros((0, 2), np.float32)), (d if d is not None else np.zeros((0, 32), np.uint8))
def orb_khop(A, B):
    (pa, da), (pb, db) = A, B
    if len(da) < 8 or len(db) < 8: return 0
    m = _bf.knnMatch(da, db, k=2); good = [x for x in m if len(x) == 2 and x[0].distance < 0.75 * x[1].distance]
    if len(good) < 8: return len(good)
    H, mask = cv2.findHomography(pa[[x[0].queryIdx for x in good]], pb[[x[0].trainIdx for x in good]], cv2.RANSAC, 5.0)
    return int(mask.sum()) if mask is not None else 0

def kc(a, b): return sum(x != y for x, y in zip(a, b))
def gan(h1, h2): return min(kc(h1['ca'], h2['ca']), kc(h1['vt'], h2['vt']))

def doc():
    return json.load(open(SO, encoding='utf-8')) if os.path.exists(SO) else []

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'them':
        root = sys.argv[2]; so = {(x['bai'], x['file']): x for x in doc()}; orb_moi = {}
        for dp, _, fs in os.walk(root):
            if 'tai-nguyen' not in dp.replace('\\', '/').split('/'): 
                if not any(s == 'tai-nguyen' for s in dp.replace('\\', '/').split('/')): continue
            bai = os.path.relpath(dp, root).replace('\\', '/').split('/')[0]
            for f in fs:
                if not re.search(r'\.(png|jpe?g|webp)$', f, re.I) or BO_QUA.search(f): continue
                rel = os.path.relpath(os.path.join(dp, f), os.path.join(root, bai)).replace('\\', '/')
                so[(bai, rel)] = dict(bai=bai, file=rel, **bam(os.path.join(dp, f)))
                orb_moi[bai + '|' + rel] = orb_desc(os.path.join(dp, f))
        json.dump(sorted(so.values(), key=lambda x: (x['bai'], x['file'])), open(SO, 'w', encoding='utf-8'), ensure_ascii=False)
        cu = dict(np.load(ORB_SO, allow_pickle=True)) if os.path.exists(ORB_SO) else {}
        for k, (p, d) in orb_moi.items(): cu['p::' + k] = p; cu['d::' + k] = d
        np.savez_compressed(ORB_SO, **cu)
        print('so anh:', len(so), 'dong ->', SO)
    elif cmd == 'kiem':
        d, bai = sys.argv[2], sys.argv[3]; so = [x for x in doc() if x['bai'] != bai]; n = 0
        Z = np.load(ORB_SO, allow_pickle=True) if os.path.exists(ORB_SO) else {}
        keys = [k[3:] for k in getattr(Z, 'files', []) if k.startswith('p::') and not k[3:].startswith(bai + '|')]
        for f in sorted(os.listdir(d)):
            if not re.search(r'\.(png|jpe?g)$', f, re.I) or BO_QUA.search(f): continue
            p = os.path.join(d, f); h = bam(p); o = orb_desc(p); kq = []
            for x in so:
                dist = gan(h, x)
                if dist <= 60: kq.append(('TRUNG' if dist <= 40 else 'GAN GIONG', '%s / %s' % (x['bai'], x['file']), 'dhash %d' % dist))
            for k in keys:
                sc = orb_khop(o, (Z['p::' + k], Z['d::' + k]))
                if sc >= 60: kq.append(('TRUNG' if sc >= 250 else 'GAN GIONG', k.replace('|', ' / '), 'orb %d' % sc))
            seen = set()
            for lv, ten, why in sorted(kq):
                if ten in seen: continue
                seen.add(ten); n += lv == 'TRUNG'
                print('%-14s %-9s %s  (%s)' % (f, lv, ten, why))
        print('TRUNG', n)
