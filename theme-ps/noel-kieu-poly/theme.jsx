// theme.jsx tự tạo bằng theme-ps/tao.py - sửa theme.json / _dong-co.jsx rồi chạy lại, đừng sửa tay
var THEME = {
 "id": "noel-kieu-poly",
 "ten": "Noel · Kiểu Poly",
 "kieu": "kiểu bài shop",
 "kenh": "",
 "dong_co": false,
 "them": [
  "_noel-poly.jsx"
 ],
 "mo_ta": "Giữ nguyên kiểu bài shop (nền ảnh mờ tối, chữ trắng viền, nhãn + khung xanh lá, bìa tự làm như mọi bài), chỉ thêm Noel nhẹ: cụm thông + châu đỏ, châu vàng ở góc phải trên, lớp tuyết mỏng ở đáy. Trang trí nằm ngay trên nền, dưới chữ / thẻ / ảnh máy. Đừng đặt chữ ở góc phải trên (x > 760, y < 230) và dưới y 1380.",
 "nen": "111111",
 "nhan": "22C55E",
 "vang": "FFD200",
 "do": "D63A32",
 "pill": [
  "22C55E",
  "FFFFFF"
 ],
 "font_tieu_de": [
  "UTM-Cookies",
  "UTM-Alberta-Heavy",
  "SegoeUIBlack"
 ],
 "font_than": [
  "UTMAvoBold",
  "SegoeUI-Bold"
 ],
 "np_goc": "goc-thong.png",
 "np_goc_rong": 420,
 "np_tuyet": "tuyet-mong.png",
 "xem": {
  "t1": "iPAD NÀO",
  "t2": "ĐÁNG MUA NOEL?",
  "nho": "3 máy chạy ngon, giá dễ thở",
  "pill": "QUÀ NOEL",
  "tieu": "LÊN ĐỜI ĐÓN NOEL",
  "phu": "Máy ngon giá mềm cho mùa lễ",
  "ten": "iPad Pro 11 M4",
  "cau": "Chip M4 · 256GB",
  "gia": "25.990.000đ",
  "y": [
   [
    "check",
    "Pin còn tốt, máy zin đẹp"
   ],
   [
    "check",
    "Bảo hành tại shop"
   ],
   [
    "bang",
    "Ghé shop xem máy tận tay"
   ]
  ],
  "ghi": [
   "125/16/26 Bùi Đình Túy, P. Bình Thạnh",
   "Hotline 0902.96.0804"
  ],
  "moc": "Xem máy đang có",
  "hoi": "Noel này bạn\rlên đời máy gì?",
  "nen": [
   null,
   [
    "unsplash-goi-video-ipad-10tr.jpg",
    2000,
    700,
    0,
    1000
   ],
   [
    "unsplash-doc-ipad-quan-10tr.jpg",
    2000,
    0,
    300,
    2000
   ]
  ]
 }
};

// _noel-poly.jsx: theme "Noel · Kiểu Poly" (fen 27/11 14h51 "tạo concept mới cho noel" + ảnh bài "iPad của bạn nên đổi chưa?", chọn "Kiểu bài shop + Noel").
// Theme có "dong_co": false: tao.py KHÔNG ghép _dong-co.jsx -> giữ nguyên kiểu bài shop (font, màu, nền ảnh mờ tối, khung xanh lá, viền + bóng chữ, bìa tự làm).
// Chỉ thêm 2 chi tiết Noel, nằm ngay trên lớp nền (dưới chữ, thẻ, ảnh máy): cụm thông + châu đỏ, châu vàng ở góc phải trên (anh/goc-thong.png),
// lớp tuyết mỏng ở đáy (anh/tuyet-mong.png). Ảnh vẽ bằng theme-ps/noel-kieu-poly/tao_anh.py.
// Nền ảnh đặt sau newDoc (bgPhoto / background / placeSO tên "Nền…") thì nhóm trang trí tự đưa lên trên ảnh nền.
var THEME_N = 0;
var THEME_LOG = "Theme " + THEME.ten + ": T=" + F.T + " B=" + F.B + " (giu kieu bai shop, them thong + tuyet)\n";
var NP_DIR = (typeof THEME_DIR != "undefined" ? THEME_DIR : "") + "/anh/";
var NP_LS = [], NP_TRANG = "";
var NP_PLACE0 = placeSO;
function npAnh(ten, name, rong) {
  var f = new File(NP_DIR + ten);
  if (!f.exists) { RUN += "   noel: thieu anh " + ten + "\n"; return null; }
  var L = NP_PLACE0(f.fsName, name);
  var q = bb(L), s = rong / (q[2] - q[0]) * 100;
  L.resize(s, s, AnchorPosition.TOPLEFT);
  return L;
}
// vẽ 2 lớp trang trí ở trang đang mở; trang này đã có thì đưa 2 lớp lên trên cùng (ngay trên ảnh nền vừa đặt).
// Không gom nhóm: lớp trên cùng là lớp đang chọn, chữ / thẻ / ảnh vẽ sau nằm trên trang trí.
function npVe() {
  var doc = app.activeDocument;
  if (NP_LS.length && NP_TRANG == doc.name) {
    try {
      for (var i = NP_LS.length - 1; i >= 0; i--) NP_LS[i].move(doc, ElementPlacement.PLACEATBEGINNING);
      doc.activeLayer = NP_LS[0];
      return;
    } catch (e) {}
  }
  var T = npAnh(THEME.np_tuyet || "tuyet-mong.png", "Noel - tuyết đáy", W + 8);
  if (T) { var q2 = bb(T); T.translate(-4 - q2[0], H - q2[3]); }
  var G = npAnh(THEME.np_goc || "goc-thong.png", "Noel - thông + châu góc", THEME.np_goc_rong || 420);
  if (G) { var q = bb(G); G.translate(W - q[2], -q[1]); }
  NP_LS = []; if (G) NP_LS.push(G); if (T) NP_LS.push(T);
  NP_TRANG = doc.name;
  if (NP_LS.length) doc.activeLayer = NP_LS[0];
}
var NP_NEWDOC0 = newDoc;
newDoc = function (name) {
  var d = NP_NEWDOC0(name);
  THEME_N++;
  NP_LS = [];
  npVe();
  return d;
};
if (typeof bgPhoto == "function") {
  var NP_BG0 = bgPhoto;
  bgPhoto = function (file, imgW, cropL, cropT, cropW, blur, op) {      // thiếu độ mờ / độ tối (vd slide mẫu kho theme) thì lấy như headC: 16 / 70
    var r = NP_BG0(file, imgW, cropL, cropT, cropW, blur || 16, op || 70); npVe(); return r;
  };
}
if (typeof background == "function") {
  var NP_BGR0 = background;
  background = function () { var r = NP_BGR0.apply(this, arguments); npVe(); return r; };
}
placeSO = function (file, name) {
  var L = NP_PLACE0(file, name);
  if (/^Nền/.test(name || "")) npVe();
  return L;
};
