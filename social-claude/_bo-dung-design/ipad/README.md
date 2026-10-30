# Làn iPad trong bộ code (thêm 28/10/2026)

Bài iPad (@poly.store) dựng bằng thư viện `poly-lib.jsx` (gốc: bài 24/10 + bài pin 26/10, style chuẩn bài 14 "A16 hay AIR 5?").
Trước đây nằm ở `E:\Social Claude\_cong-cu`; giờ để chung bộ code để plugin, app Poly Dựng Bài và tab Design dùng 1 chỗ.

## Mỗi bài
1. Thư mục bài `E:\Social Claude\iPad\T10_<TenBai>_<dd-mm>\`, ảnh trong `tai-nguyen\anh-that\` (lấy `bg-thumb.png`, `ic-check.png`, `ic-x.png` từ bài iPad gần nhất).
2. Viết phần slide `<bai>\tai-nguyen\script\bai.part.jsx` từ `vi-du-bai-pin.part.jsx`: mỗi slide `if (want(n)) { ... save(dn, n); dn.close(...) }`, cuối file `ketThuc("vN.log");`. **Không** tự khai `var BAI`, `var ONLY`, `#target` (build.py chèn).
3. Build: `python "E:/Social Claude/_bo-dung-design/ipad/build.py" "<bai>" "<bai>/tai-nguyen/script/bai.part.jsx" "E:/Social Claude/_bo-dung-design/out/<ten>-vN.jsx" --only 3,4` (bỏ `--only` là dựng hết).
4. Chạy Photoshop: `python "E:/Social Claude/_bo-dung-design/code/chay_ps.py" "<file .jsx>" "<bai>" vN` (timeout 600000 ms).
5. Soi: `python "E:/Social Claude/_bo-dung-design/ipad/nghiem-thu.py" "<bai>" vN.log` + công cụ chung `prep/kiem_bo_cuc.py`, `prep/kiem_anh.py slide`, `prep/trung_anh.py kiem` (sổ ảnh có cả bài iPad từ 28/10).

## Hàm có sẵn (poly-lib.jsx)
`newDoc`, `save`, `text`, `pill/pillC`, `fx/fxGlow`, `placeSO/placeAt/placeFull`, `devicePic`, `bgPhoto`, `headC/head30` (nền mờ + POLY STORE + pill + tiêu đề), `glass`, `li` (dòng ✓ ✗ ! +), `labelChipUp/Down`, `priceTag`, `lifeCircle`, `cardCover`, `spread/centerGroup` (giãn khối đều), `cutout` (tách nền), `ketThuc`.
Thư viện chỉ đóng file do script tạo, không đụng file fen đang mở.

## Công cụ khác
- `bo-goc-anh.py`: cắt ảnh vừa khung + bo góc sẵn (khỏi clipping).
- `kiem-tra-slide.py`: lề, vùng nút TikTok, khoảng cách (nghiem-thu.py gọi luôn).
- `lay-anh.js` + `giai-ma.py`: lấy ảnh qua trình duyệt khi chạy ở chat (Claude Code trên máy thì tải thẳng bằng `curl`).
