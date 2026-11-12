// theme.jsx tự tạo bằng theme-ps/tao.py - sửa theme.json / _dong-co.jsx rồi chạy lại, đừng sửa tay
var THEME = {
 "id": "glass-tim-hong",
 "ten": "Glass · Tím hồng",
 "kenh": "",
 "nen_kieu": "kinh",
 "mo_ta": "Glass tông tối: ảnh thật làm mờ, phủ tím than đậm + đốm tím, đỏ rượu, xanh đậm; thẻ kính trong viền trắng mảnh, nhãn tím, chữ nhấn cam. Không bóng đổ.",
 "nen": "110C26",
 "nen2": "110C26",
 "the": "FFFFFF",
 "dom": [
  [
   "5B21B6",
   860,
   260,
   420
  ],
  [
   "831843",
   120,
   820,
   380
  ],
  [
   "1E3A8A",
   900,
   1260,
   360
  ]
 ],
 "dom_mo": 170,
 "kinh_op": 10,
 "kinh_vien": 40,
 "nhan": "7C3AED",
 "nhan_dam": "6D28D9",
 "nhan_nhat": "F0ABFC",
 "vang": "FDE047",
 "ghi_nen": "F3E8FF",
 "ghi_chu": "2E1065",
 "do": "F43F5E",
 "font_tieu_de": [
  "UTMNeoSansIntelBold",
  "UTM-Neo-Sans-IntelBold",
  "UTMAvoBold"
 ],
 "font_than": [
  "UTMAvoBold",
  "UTMNeoSansIntelBold"
 ],
 "co_tieu_de": 0.9,
 "giu_vien": false,
 "trang_tri": "khong",
 "anh_mo": 14,
 "anh_toi": 58,
 "anh_mau": 58,
 "dom_tren": 28,
 "xem": {
  "t1": "IPAD GEN 11",
  "t2": "CHO HỌC SINH?",
  "nho": "Rẻ, nhẹ, đủ học online",
  "pill": "MẸO 1",
  "tieu": "GIỚI HẠN APP GIẢI TRÍ",
  "phu": "Con học tập trung hơn",
  "ten": "iPad Gen 11",
  "cau": "Chip A16 · 128GB",
  "gia": "7.290.000đ",
  "y": [
   [
    "check",
    "Cài đặt > Thời gian sử dụng"
   ],
   [
    "check",
    "Đặt giới hạn cho game, video"
   ],
   [
    "x",
    "Đừng quên đặt mật mã riêng"
   ]
  ],
  "ghi": [
   "Cần chọn iPad cho con?",
   "Ghé POLY thử máy tận tay"
  ],
  "moc": "Xem mẹo 2",
  "hoi": "Con bạn đang\rhọc lớp mấy?",
  "nen": [
   [
    "unsplash-hoc-online-4FwEuaWFxgE.jpg",
    1600,
    430,
    0,
    740
   ],
   [
    "unsplash-ghi-chu-pencil-KxVlKiqQObU.jpg",
    1600,
    400,
    0,
    800
   ],
   [
    "unsplash-be-gai-ipad-qESmLLXAmWs.jpg",
    1600,
    400,
    0,
    800
   ]
  ],
  "bia_sp": {
   "dong": "iPad",
   "ten": "GEN 11",
   "sl1": "Rẻ, nhẹ, bền",
   "sl2": "Đủ cho con học online",
   "may": [
    "may.png",
    "may2.png",
    "may3.png"
   ],
   "trai": [
    "A16",
    "Chip mạnh"
   ],
   "phai": [
    "128GB",
    "Bộ nhớ"
   ],
   "chan": "Máy likenew, có sẵn tại POLY STORE"
  }
 },
 "font_bia": [
  "UTM-Futura-Extra",
  "UTMFuturaExtra",
  "UTM Futura Extra"
 ],
 "bia_mau": "FB923C"
};
// ===================================================================================
// THEME PHOTOSHOP (kho chung app Poly Dung Bai, fen 12/11/2026 "thiet ke template kho chung bang photoshop", "dung 3d qua")
// Ghep NGAY SAU thu vien dung (ipad/poly-lib.jsx hoac code/make-mac-vs-win + top5_body), TRUOC phan slide cua bai:
//   iPad:   python ipad/build.py "<bai>" "<part>" "<out>" --theme "<thu muc app>/theme-ps/<id>/theme.jsx"
//   Laptop: python code/build.py slides/<x>.jsx <thu muc bai> <ten> vN [1,2] --theme "<...>/theme.jsx"
// Theme chi doi MAU, FONT, NEN, THE, HIEU UNG (phang: bo bong do, phat sang, nen anh mo). Bo cuc, anh may, chu van theo bai.
// Bien THEME (mau, font, trang tri) duoc chen phia tren boi theme-ps/tao.py.
// ===================================================================================
var THEME_N = 0;
var THEME_LOG = "";
(function () {
  if (typeof C != "undefined") {
    C.GREEN = THEME.nhan; C.GREEN_D = THEME.nhan_dam; C.GREEN_L = THEME.nhan_nhat;
    C.GREEN_SOFT = THEME.ghi_nen; C.GREEN_PALE = THEME.nhan_nhat; C.INK = THEME.ghi_chu;
  }
})();
if (typeof NAVY != "undefined") NAVY = THEME.ghi_chu;        // chu trong o ghi chu + vien tieu de
if (typeof MINT != "undefined") MINT = THEME.ghi_nen;        // nen o ghi chu
if (typeof YEL != "undefined") YEL = THEME.vang;
if (typeof YEL2 != "undefined") YEL2 = THEME.vang;
if (typeof TAG != "undefined") TAG = THEME.vang;
if (typeof INKBG != "undefined") INKBG = THEME.nen;
if (typeof RED != "undefined" && THEME.do) RED = THEME.do;
if (typeof RANKC != "undefined") RANKC = THEME.nhan_dam;

// ---------- font: thu lan luot danh sach cua theme, khong co thi giu font cu ----------
(function () {
  var t = pick(THEME.font_tieu_de.concat([F.T])), b = pick(THEME.font_than.concat([F.B]));
  F.T = t; F.B = b;
  if (THEME.font_thuong) F.R = pick(THEME.font_thuong.concat([F.R]));
  if (typeof FS != "undefined") { FS.T = t; FS.I = THEME.font_nghieng ? pick(THEME.font_nghieng.concat([b])) : b; }
  THEME_LOG = "Theme " + THEME.ten + ": T=" + F.T + " B=" + F.B + "\n";
})();

// ---------- chu tieu de: font theme hep / rong hon font cu thi nhan co chu cho bang (co_tieu_de) ----------
var THEME_TEXT0 = text;
text = function (str, font, size, h, x, y, o) {
  if (font == F.T && THEME.co_tieu_de && THEME.co_tieu_de != 1) {
    var k = THEME.co_tieu_de, o2 = {};
    if (o) for (var p in o) o2[p] = o[p];
    if (o2.lead) o2.lead = Math.round(o2.lead * k);
    size = Math.round(size * k); o = o2;
  }
  return THEME_TEXT0(str, font, size, h, x, y, o);
};

// ---------- phang: bo bong do + phat sang; giu vien mong (<= 3px: vien the, chip), vien chu day chi khi theme cho (giu_vien) ----------
var THEME_FX0 = fx;
fx = function (L, o) {
  if (!o || !o.stroke) return;
  if (o.stroke.size > 3 && !THEME.giu_vien) return;
  THEME_FX0(L, { stroke: o.stroke });
};
fxGlow = function () {};

// ---------- nen phang + trang tri hinh khoi o goc (moi slide doi goc cho do lap) ----------
function themeTron(cx, cy, r, h, op, name) {
  var L = oval(cx - r, cy - r, cx + r, cy + r, h, name || "Trang trí");
  if (op && op < 100) L.opacity = op;
  return L;
}
function themeCham(x0, y0, cot, hang, buoc, r, h, name) {
  for (var i = 0; i < hang; i++) for (var j = 0; j < cot; j++)
    oval(x0 + j * buoc - r, y0 + i * buoc - r, x0 + j * buoc + r, y0 + i * buoc + r, h, (name || "Chấm") + " " + (i * cot + j + 1));
}
// nen kinh (glass, fen 12/11 21h26 "cho them theme kieu glass"): cac dom mau loang mo phia sau, the kinh trong phia truoc
function themeDom(opK) {
  var ds = THEME.dom || [], chan = THEME_N % 2 == 0;
  for (var i = 0; i < ds.length; i++) {
    var c = ds[i][0], cx = chan ? W - ds[i][1] : ds[i][1], cy = ds[i][2], r = ds[i][3];
    var L = oval(cx - r, cy - r, cx + r, cy + r, c, "Đốm màu " + (i + 1));
    L.rasterize(RasterizeType.ENTIRELAYER);
    app.activeDocument.activeLayer = L;
    gblur(THEME.dom_mo || 160);
    L.opacity = Math.round((ds[i][4] || 100) * (opK || 100) / 100);
  }
}
function themeNen() {
  THEME_N++;
  rect(0, 0, W, H, 0, THEME.nen, "Nền - " + THEME.ten);
  var k = THEME_N % 2, tt = THEME.trang_tri || "tron";
  if (THEME.nen_kieu == "kinh") themeDom();
  if (tt == "tron") {
    if (k) { themeTron(W + 40, 120, 340, THEME.nen2, 100, "Trang trí - tròn lớn"); themeTron(-60, H - 90, 210, THEME.nen2, 100, "Trang trí - tròn nhỏ"); }
    else { themeTron(-40, 150, 300, THEME.nen2, 100, "Trang trí - tròn lớn"); themeTron(W + 70, H - 140, 260, THEME.nen2, 100, "Trang trí - tròn nhỏ"); }
    rect(96, 64, 160, 72, 4, THEME.nhan, "Trang trí - gạch nhấn");
  } else if (tt == "cham") {
    if (k) { themeCham(W - 214, 64, 5, 4, 36, 5, THEME.nen2, "Chấm góc"); themeTron(-120, H + 40, 380, THEME.nen2, 100, "Trang trí - nửa tròn"); }
    else { themeCham(70, H - 186, 5, 4, 36, 5, THEME.nen2, "Chấm góc"); themeTron(W + 120, -40, 380, THEME.nen2, 100, "Trang trí - nửa tròn"); }
    rect(0, 0, 14, H, 0, THEME.nhan, "Trang trí - sọc nhấn");
  }
}
var THEME_NEWDOC0 = newDoc;
newDoc = function (name) {
  var d = THEME_NEWDOC0(name);
  themeNen();
  return d;
};
// nen anh mo cua thu vien: theme phang -> bo (nen phang da ve luc tao trang).
// Theme kinh (fen 12/11 21h26 "blur background"): anh that cua bai lam mo manh + lop mau theme + dom mau mo, the kinh dat len tren.
var THEME_BG0 = bgPhoto, THEME_BGR0 = background;
function themeAnhMo(goc, args) {
  if (THEME.nen_kieu != "kinh" || !args[0]) return;
  try { goc(args); } catch (e) { THEME_LOG += "Theme: khong dat duoc anh nen " + args[0] + " (" + e.message + "), giu nen dom mau\n"; return; }
  var T = rect(0, 0, W, H, 0, THEME.nen, "Lớp màu theme"); T.opacity = THEME.anh_mau || 45;
  themeDom(THEME.dom_tren || 55);
}
bgPhoto = function (file, imgW, cropL, cropT, cropW, blur, op) {
  themeAnhMo(function (a) { THEME_BG0(a[0], a[1], a[2], a[3], a[4], THEME.anh_mo || 30, THEME.anh_toi || 30); }, [file, imgW, cropL, cropT, cropW]);
};
background = function (file, imgW, cropL, cropT, cropW, blurR) {
  themeAnhMo(function (a) { THEME_BGR0(a[0], a[1], a[2], a[3], a[4], THEME.anh_mo || 30); }, [file, imgW, cropL, cropT, cropW]);
};
// the: theme phang -> the dac; theme kinh -> the trang trong + vien mong (khong bong)
glass = function (l, t, r, b, rad, name) {
  if (THEME.nen_kieu != "kinh") return rect(l, t, r, b, rad, THEME.the, name || "Thẻ");
  var G = rect(l, t, r, b, rad, "FFFFFF", name || "Thẻ kính");
  G.fillOpacity = THEME.kinh_op || 14;
  THEME_FX0(G, { stroke: { hex: "FFFFFF", size: 2, op: THEME.kinh_vien || 45, inside: true } });
  return G;
};

// ---------- bia kieu quang cao san pham (fen 12/11 21h32 gui anh mau + "cover anh nay lam thumbnail") ----------
// Dong nho (dong may) + TEN MAY RAT TO o tren, slogan 2 dong giua, 1-3 may xoe quat giua trang, 2 thong so 2 ben (so to + nhan vien trang), dong chu nho cuoi.
// o = { dong: "iPad", ten: "GEN 11", sl1: "...", sl2: "...", may: ["file.png", ...] (anh nen trong trong thu muc anh cua bai),
//       trai: ["A16", "Chip mạnh"], phai: ["128GB", "Bộ nhớ"], chan: "..." }. Goi ngay sau newDoc (+ bgPhoto neu theme glass).
function themeDat(file, l, t, r, b, xoay, name) {
  var L = placeSO(file, name), q = bb(L);
  var s = Math.min((r - l) / (q[2] - q[0]), (b - t) / (q[3] - q[1])) * 100;
  L.resize(s, s, AnchorPosition.MIDDLECENTER); q = bb(L);
  L.translate((l + r) / 2 - (q[0] + q[2]) / 2, (t + b) / 2 - (q[1] + q[3]) / 2);
  if (xoay) L.rotate(xoay, AnchorPosition.MIDDLECENTER);
  return L;
}
function themeGiua(L, cx) { var q = bb(L); L.translate(cx - (q[0] + q[2]) / 2, 0); return bb(L); }
function themeDuoi(L, y) { var q = bb(L); L.translate(0, y - q[1]); return bb(L); }
function biaSanPham(o) {
  var AA = typeof A != "undefined" ? A : (typeof TN != "undefined" ? TN : "");    // thu muc anh cua bai: iPad A, Laptop TN
  var cx = W / 2, TF = THEME.font_bia ? pick(THEME.font_bia.concat([F.T])) : F.T, mau = THEME.bia_mau || THEME.vang;
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  var y = 150, q;
  if (o.dong) { var D = text(o.dong, F.B, 50, C.WHITE, cx, 200, { align: Justification.CENTER, name: "Dòng máy" }); themeGiua(D, cx); q = themeDuoi(D, y); y = q[3] + 6; }
  var T = text(o.ten, TF, 200, mau, cx, 420, { align: Justification.CENTER, maxW: 960, name: "Tên máy" });
  themeGiua(T, cx); q = themeDuoi(T, y); y = q[3] + 44;
  if (o.sl1) { var S1 = text(o.sl1, F.R || F.B, 46, C.WHITE, cx, 600, { align: Justification.CENTER, maxW: 900, name: "Slogan 1" }); themeGiua(S1, cx); q = themeDuoi(S1, y); y = q[3] + 14; }
  if (o.sl2) { var S2 = text(o.sl2, F.B, 56, C.WHITE, cx, 680, { align: Justification.CENTER, maxW: 900, name: "Slogan 2" }); themeGiua(S2, cx); q = themeDuoi(S2, y); y = q[3]; }
  // 2 thong so (so to + nhan vien trang) thanh 1 hang duoi slogan, 2 ben; may nam ngang rong nen khong dat de len may
  function so(arr, x, cy, name) {
    if (!arr) return;
    var V = text(arr[0], TF, 60, C.WHITE, x, cy, { align: Justification.CENTER, maxW: 300, name: name + " - số" });
    themeGiua(V, x); var qv = themeDuoi(V, cy);
    var Lb = text(arr[1], F.B, 26, C.WHITE, x, qv[3] + 54, { align: Justification.CENTER, maxW: 260, name: name + " - nhãn" });
    var ql = themeGiua(Lb, x), w = ql[2] - ql[0], h0 = 52, cyl = qv[3] + 18 + h0 / 2;
    Lb.translate(0, cyl - (ql[1] + ql[3]) / 2);
    var P = rect(x - w / 2 - 24, cyl - h0 / 2, x + w / 2 + 24, cyl + h0 / 2, h0 / 2, "FFFFFF", name + " - viền");
    P.fillOpacity = THEME.nen_kieu == "kinh" ? 12 : 0;
    THEME_FX0(P, { stroke: { hex: "FFFFFF", size: 2, op: 90, inside: true } });
    P.move(Lb, ElementPlacement.PLACEAFTER);
    return cyl + h0 / 2;
  }
  var y2 = y;
  if (o.trai || o.phai) { y2 = Math.max(so(o.trai, 290, y + 50, "Thông số trái") || 0, so(o.phai, W - 290, y + 50, "Thông số phải") || 0); }
  // may xoe quat: 2 may ben nghieng ra (dat truoc, nam duoi), may giua thang nam tren
  var top = y2 + 50, bot = o.chan ? 1310 : 1350, ds = o.may || [], n = ds.length;
  var bong = oval(cx - 340, bot - 30, cx + 340, bot + 30, "000000", "Bóng dưới máy");
  bong.rasterize(RasterizeType.ENTIRELAYER); app.activeDocument.activeLayer = bong; gblur(28); bong.opacity = 45;
  if (n >= 3) {
    themeDat(AA + ds[1], 40, top + 70, cx + 40, bot - 30, -8, "Máy trái");
    themeDat(AA + ds[2], cx - 40, top + 70, W - 40, bot - 30, 8, "Máy phải");
  } else if (n == 2) {
    themeDat(AA + ds[1], cx - 80, top + 50, W - 30, bot - 20, 8, "Máy phải");
  }
  if (n) themeDat(AA + ds[0], n >= 2 ? 150 : 60, top, n >= 2 ? W - 150 : W - 60, bot, 0, "Máy giữa");
  if (o.chan) { var Cn = text(o.chan, F.B, 24, C.WHITE, cx, 1380, { align: Justification.CENTER, maxW: 880, name: "Dòng nhỏ cuối" }); Cn.opacity = 80; themeGiua(Cn, cx); }
}

// ---------- bia kieu tinh nang (fen 12/11 21h34 gui anh mau thu 2 + "cover thumnail") ----------
// Nen toi cua theme, 2 dong tieu de giua (dong 1 mau nhan, dong 2 trang), 2 dong mo ta, SO / CHU RAT TO mo phia sau,
// 1-2 may to nghieng tran mep duoi (may 1 ben trai, may 2 ben phai).
// o = { t1: "Màn 120Hz mượt", t2: "iPad Pro M2", mo: "dòng 1\rdòng 2", so: "M2", may: ["a.png", "b.png"] }
function biaTinhNang(o) {
  var AA = typeof A != "undefined" ? A : (typeof TN != "undefined" ? TN : "");
  var cx = W / 2, TF = THEME.font_bia ? pick(THEME.font_bia.concat([F.T])) : F.T, mau = THEME.bia_mau || THEME.vang, q, y = 170;
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  if (o.so) {
    var So = text(o.so, TF, 760, "FFFFFF", cx, 1300, { align: Justification.CENTER, name: "Số to mờ" });
    So.opacity = THEME.so_mo || 7; themeGiua(So, cx); themeDuoi(So, 560);
  }
  var T1 = text(o.t1, TF, 92, mau, cx, 300, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề - dòng 1" });
  themeGiua(T1, cx); q = themeDuoi(T1, y); y = q[3] + 14;
  var T2 = text(o.t2, TF, 92, C.WHITE, cx, 420, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề - dòng 2" });
  themeGiua(T2, cx); q = themeDuoi(T2, y); y = q[3] + 34;
  if (o.mo) { var M = text(o.mo, F.B, 38, C.WHITE, cx, 560, { align: Justification.CENTER, maxW: 860, lead: 52, name: "Mô tả" }); M.opacity = 92; themeGiua(M, cx); q = themeDuoi(M, y); y = q[3]; }
  var ds = o.may || [], top = Math.max(y + 70, 600);
  if (ds.length >= 2) {
    themeDat(AA + ds[0], -330, top + 40, 600, H + 260, -14, "Máy trái");
    themeDat(AA + ds[1], 330, top + 140, W + 360, H + 330, 16, "Máy phải");
  } else if (ds.length) {
    themeDat(AA + ds[0], -40, top + 20, W + 260, H + 220, -10, "Máy");
  }
}
