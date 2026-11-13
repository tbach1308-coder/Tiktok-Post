// theme.jsx tự tạo bằng theme-ps/tao.py - sửa theme.json / _dong-co.jsx rồi chạy lại, đừng sửa tay
var THEME = {
 "id": "phang-xanh-dem",
 "ten": "Phẳng · Xanh lá đêm",
 "kenh": "",
 "mo_ta": "Nền xanh đêm phẳng, hình tròn ở góc, nhấn xanh lá, tiêu đề chữ cao gọn (Bebas). Không bóng đổ, không phát sáng.",
 "nen": "0E1A2B",
 "nen2": "15263D",
 "the": "1A2D47",
 "nhan": "16A34A",
 "nhan_dam": "15803D",
 "nhan_nhat": "4ADE80",
 "vang": "FFD60A",
 "ghi_nen": "DCFCE7",
 "ghi_chu": "0E1A2B",
 "do": "EF4444",
 "font_tieu_de": [
  "UTM-Bebas",
  "UTMBebas",
  "UTM Bebas"
 ],
 "font_than": [
  "UTMNeoSansIntelBold",
  "UTM-Neo-Sans-IntelBold",
  "UTMAvoBold"
 ],
 "co_tieu_de": 1.22,
 "giu_vien": false,
 "trang_tri": "tron",
 "xem": {
  "t1": "THINKPAD NÀO",
  "t2": "HỢP BẠN?",
  "nho": "Học, làm, đi lại đều bền",
  "pill": "MẸO 1",
  "tieu": "TẮT APP KHỞI ĐỘNG",
  "phu": "Mở máy nhanh hơn hẳn",
  "ten": "ThinkPad X1",
  "cau": "Core i7 · 16GB · 512GB",
  "gia": "12.490.000đ",
  "y": [
   [
    "check",
    "Ctrl + Shift + Esc mở Task Manager"
   ],
   [
    "check",
    "Vào Startup apps, tắt app thừa"
   ],
   [
    "x",
    "Đừng tắt driver âm thanh, touchpad"
   ]
  ],
  "ghi": [
   "Máy vẫn chậm?",
   "Ghé POLY vệ sinh, kiểm tra miễn phí"
  ],
  "moc": "Xem mẹo 2",
  "hoi": "Bạn đang xài\rlaptop gì?",
  "nen": [
   [
    "unsplash-may-tinh-ke-toan.jpg",
    2000,
    500,
    0,
    1000
   ],
   [
    "unsplash-ban-trang-ban-phim-HoEYgBL_Gcs.jpg",
    2400,
    600,
    0,
    1200
   ],
   [
    "unsplash-ban-trang-ca-phe-VieM9BdZKFo.jpg",
    2400,
    600,
    0,
    1200
   ]
  ],
  "bia_tn": {
   "t1": "Bền bỉ, gõ sướng",
   "t2": "ThinkPad X1",
   "mo": "Máy doanh nhân, pin khỏe,\rgiá chỉ bằng nửa máy mới",
   "so": "X1",
   "may": [
    "may.png"
   ]
  }
 },
 "font_bia": [
  "UTM-Futura-Extra",
  "UTMFuturaExtra",
  "UTM Futura Extra"
 ],
 "bia_mau": "FFD60A"
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
  // quang sang mo tren nen (fen 12/11 21h51 anh mau "Lifelike Visuals"): [mau, cx, cy, rx, ry, mo, do dam]
  var toa = THEME.toa || [];
  for (var i = 0; i < toa.length; i++) {
    var a = toa[i], Lt = oval(a[1] - a[3], a[2] - a[4], a[1] + a[3], a[2] + a[4], a[0], "Quầng sáng " + (i + 1));
    Lt.rasterize(RasterizeType.ENTIRELAYER); app.activeDocument.activeLayer = Lt; gblur(a[5] || 180); Lt.opacity = a[6] || 100;
  }
  if (tt == "tron") {
    if (k) { themeTron(W + 40, 120, 340, THEME.nen2, 100, "Trang trí - tròn lớn"); themeTron(-60, H - 90, 210, THEME.nen2, 100, "Trang trí - tròn nhỏ"); }
    else { themeTron(-40, 150, 300, THEME.nen2, 100, "Trang trí - tròn lớn"); themeTron(W + 70, H - 140, 260, THEME.nen2, 100, "Trang trí - tròn nhỏ"); }
    rect(96, 64, 160, 72, 4, THEME.nhan, "Trang trí - gạch nhấn");
  } else if (tt == "cham") {
    if (k) { themeCham(W - 214, 64, 5, 4, 36, 5, THEME.nen2, "Chấm góc"); themeTron(-120, H + 40, 380, THEME.nen2, 100, "Trang trí - nửa tròn"); }
    else { themeCham(70, H - 186, 5, 4, 36, 5, THEME.nen2, "Chấm góc"); themeTron(W + 120, -40, 380, THEME.nen2, 100, "Trang trí - nửa tròn"); }
    rect(0, 0, 14, H, 0, THEME.nhan, "Trang trí - sọc nhấn");
  } else if (tt == "tiem") themeTiemNen();
}

// ---------- theme "Tiem Poly ve tay" (fen 13/11 18h01 gui 5 anh tiem Poly Store ve tay + "tao theme pts") ----------
// hat sap mau / giay: them nhieu (Add Noise) don sac cho lop (lop hinh -> anh thuong truoc). Loi thi giu mau dac.
function themeHat(L, amt) {
  try {
    L.rasterize(RasterizeType.ENTIRELAYER);
    app.activeDocument.activeLayer = L;
    var d = new ActionDescriptor();
    d.putEnumerated(charIDToTypeID("Dstr"), charIDToTypeID("Dstr"), charIDToTypeID("Gsn "));
    d.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), amt || THEME.hat || 6);
    d.putBoolean(charIDToTypeID("Mnch"), true);
    d.putInteger(charIDToTypeID("FlRs"), Math.floor(Math.random() * 999999));
    executeAction(charIDToTypeID("AdNs"), d, DialogModes.NO);
  } catch (e) { THEME_LOG += "Theme: hat giay loi (" + e.message + "), giu mau dac\n"; }
  return L;
}
// vung mep duoi luon (nhu mai hien cua tiem trong anh): 1 lop anh thuong = hinh chu nhat y0..yb-r + hang nua tron o mep duoi
function themeVungLuon(y0, yb, r, mau, name) {
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.name = name;
  doc.selection.select([[0, y0], [W, y0], [W, yb - r], [0, yb - r]], SelectionType.REPLACE, 0, true);
  for (var x = 0; x - r < W; x += 2 * r) {
    var pts = [];
    for (var i = 0; i < 28; i++) { var g = i / 28 * 2 * Math.PI; pts.push([x + r + r * Math.cos(g), yb - r + r * Math.sin(g)]); }
    doc.selection.select(pts, SelectionType.EXTEND, 0, true);
  }
  doc.selection.fill(col(mau)); doc.selection.deselect();
  return L;
}
// mai hien xanh mep luon tren cung trang
function themeMaiHien(h, r) {
  var L = themeVungLuon(0, h + r, r, THEME.mai, "Mái hiên");
  themeHat(L, (THEME.hat || 6) - 1);
  return L;
}
// trang trong: tuong giay be hat sap mau + mai hien tren cung + bang xanh nhu bien hieu (vien nau), chu trang / kem nam tren bang
function themeTiemNen() {
  themeHat(app.activeDocument.activeLayer);                 // lop nen giay be vua ve trong themeNen
  var B = rect(36, 62, W - 36, H - 36, 30, THEME.bang, "Bảng xanh");
  themeHat(B);
  THEME_FX0(B, { stroke: { hex: THEME.vien_nau || "4A3631", size: 3, op: 100, inside: true } });
  themeMaiHien(30, 27);
}
// chu tron 2 lop vien (nhu chu "Macbook" trong anh): lop sau vien nau day, lop truoc vien kem
function themeChuBong(str, font, size, mau, cx, y, maxW, name) {
  var o = { align: Justification.CENTER, maxW: maxW, name: name + " - viền nâu" };
  var S = text(str, font, size, mau, cx, y, o);
  themeGiua(S, cx);
  THEME_FX0(S, { stroke: { hex: THEME.vien_nau || "4A3631", size: Math.round(LAST * 0.2), op: 100 } });
  var T = text(str, font, LAST, mau, cx, y, { align: Justification.CENTER, name: name });
  THEME_FX0(T, { stroke: { hex: THEME.kem || "F3EBDC", size: Math.round(LAST * 0.1), op: 100 } });
  var q = bb(S), q2 = bb(T);
  T.translate((q[0] + q[2]) / 2 - (q2[0] + q2[2]) / 2, (q[1] + q[3]) / 2 - (q2[1] + q2[3]) / 2);
  return [S, T];
}
// bia: anh tiem dung loai may o ~2/3 tren (mep duoi luon nhu mai hien), duoi la giay be: tieu de 2 dong chu tron + dong nho.
// o = { loai: "ipad" | "iphone" | "laptop" | "macbook" | "chung", t1: "dòng 1", t2: "dòng 2", nho: "dòng nhỏ" }. Goi ngay sau newDoc.
function biaTiem(o) {
  o = o || {};
  var ds = THEME.tiem || {}, k = ds[o.loai] ? o.loai : "chung", a = ds[k], dir = typeof THEME_DIR != "undefined" ? THEME_DIR : "";
  var BOT = o.bot || 1080, r = 26, s = W / 941, cx = W / 2, TF = THEME.font_bia ? pick(THEME.font_bia.concat([F.T])) : F.T;
  var P = rect(0, 0, W, H, 0, THEME.nen, "Giấy be");
  themeHat(P);
  if (a && dir) {
    // khung anh: mep duoi luon nhu mai hien (1 lop), anh tiem cat theo khung (clipping)
    var K = themeVungLuon(0, BOT, r, THEME.vien_nau || "4A3631", "Khung ảnh tiệm");
    try {
      var L = placeSO(dir + "/anh/" + a[0], "Ảnh tiệm - " + k), q = bb(L);
      var pct = W / (q[2] - q[0]) * 100;
      L.resize(pct, pct, AnchorPosition.TOPLEFT); q = bb(L);
      L.translate(-q[0], -a[1] * (q[2] - q[0]) / 941 - q[1]);
      L.grouped = true;
      THEME_FX0(K, { stroke: { hex: THEME.vien_nau || "4A3631", size: 4, op: 100 } });
    } catch (e) { THEME_LOG += "Theme: khong dat duoc anh tiem " + a[0] + " (" + e.message + ")\n"; }
  } else THEME_LOG += "Theme: thieu anh tiem (THEME_DIR / tiem." + k + ")\n";
  // tieu de: chu tron xanh la vien kem + nau, dong nho nau; ca cum can giua trong dai duoi anh
  var ls = [], y = BOT + 30, mau = THEME.bia_mau || THEME.bang;
  if (o.t1) { var A1 = themeChuBong(o.t1, TF, 88, mau, cx, y + 88, 960, "Tiêu đề - dòng 1"); ls = ls.concat(A1); y = bb(A1[0])[3] + 6; }
  if (o.t2) { var A2 = themeChuBong(o.t2, TF, 88, mau, cx, y + 88, 960, "Tiêu đề - dòng 2"); ls = ls.concat(A2); y = bb(A2[0])[3] + 6; }
  if (o.nho) { var N = text(o.nho, F.B, 38, THEME.vien_nau || "4A3631", cx, y + 52, { align: Justification.CENTER, maxW: 900, name: "Dòng nhỏ" }); ls.push(N); }
  if (ls.length) {
    var t = 1e9, b = -1e9;
    for (var i = 0; i < ls.length; i++) { var qq = bb(ls[i]); t = Math.min(t, qq[1]); b = Math.max(b, qq[3]); }
    var dy = (BOT + 12 + H - 30) / 2 - (t + b) / 2;
    for (var j = 0; j < ls.length; j++) ls[j].translate(0, dy);
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
    var So = text(o.so, TF, 760, THEME.so_mau || "FFFFFF", cx, 1300, { align: Justification.CENTER, name: "Số to mờ" });
    So.opacity = THEME.so_mo || 7; themeGiua(So, cx); themeDuoi(So, 560);
  }
  // kieu "nho-to" (anh mau "Lifelike Visuals"): dong 1 nho trang, dong 2 rat to mau nhan (chuyen sac neu theme co bia_sac)
  var nt = o.kieu == "nho-to";
  var T1 = text(o.t1, TF, nt ? 54 : 92, nt ? C.WHITE : mau, cx, 300, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề - dòng 1" });
  themeGiua(T1, cx); q = themeDuoi(T1, y); y = q[3] + (nt ? 18 : 14);
  var T2 = text(o.t2, TF, nt ? 128 : 92, nt ? mau : C.WHITE, cx, 420, { align: Justification.CENTER, maxW: 960, name: "Tiêu đề - dòng 2" });
  themeGiua(T2, cx); q = themeDuoi(T2, y); y = q[3] + 34;
  if (nt && THEME.bia_sac) themeChuyenSac(T2, THEME.bia_sac[0], THEME.bia_sac[1], 0);
  if (o.mo) { var M = text(o.mo, F.B, 38, C.WHITE, cx, 560, { align: Justification.CENTER, maxW: 860, lead: 52, name: "Mô tả" }); M.opacity = 92; themeGiua(M, cx); q = themeDuoi(M, y); y = q[3]; }
  var ds = o.may || [], top = Math.max(y + 70, 600);
  if (ds.length >= 2) {
    themeDat(AA + ds[0], -330, top + 40, 600, H + 260, -14, "Máy trái");
    themeDat(AA + ds[1], 330, top + 140, W + 360, H + 330, 16, "Máy phải");
  } else if (ds.length) {
    themeDat(AA + ds[0], o.may_trai || -40, top + 20, W + (o.may_phai || 260), H + 220, o.xoay == null ? -10 : o.xoay, "Máy");
  }
}

// chu chuyen sac 2 mau (gradient overlay cua layer, phang - khong noi khoi). Loi thi giu mau dac.
function themeChuyenSac(L, c1, c2, goc) {
  try {
    app.activeDocument.activeLayer = L;
    var c2t = charIDToTypeID, d = new ActionDescriptor(), r = new ActionReference();
    r.putProperty(c2t("Prpr"), c2t("Lefx"));
    r.putEnumerated(c2t("Lyr "), c2t("Ordn"), c2t("Trgt"));
    d.putReference(c2t("null"), r);
    var fe = new ActionDescriptor(); fe.putUnitDouble(c2t("Scl "), c2t("#Prc"), 100);
    var g = new ActionDescriptor();
    g.putBoolean(c2t("enab"), true);
    g.putEnumerated(c2t("Md  "), c2t("BlnM"), c2t("Nrml"));
    g.putUnitDouble(c2t("Opct"), c2t("#Prc"), 100);
    var gr = new ActionDescriptor();
    gr.putString(c2t("Nm  "), "Theme");
    gr.putEnumerated(c2t("GrdF"), c2t("GrdF"), c2t("CstS"));
    gr.putDouble(c2t("Intr"), 4096);
    var cl = new ActionList();
    function stop(hex, loc) { var x = new ActionDescriptor(); x.putObject(c2t("Clr "), c2t("RGBC"), rgbDesc(hex)); x.putEnumerated(c2t("Type"), c2t("Clry"), c2t("UsrS")); x.putInteger(c2t("Lctn"), loc); x.putInteger(c2t("Mdpn"), 50); return x; }
    cl.putObject(c2t("Clrt"), stop(c1, 0)); cl.putObject(c2t("Clrt"), stop(c2, 4096));
    gr.putList(c2t("Clrs"), cl);
    var tl = new ActionList();
    function ts(loc) { var x = new ActionDescriptor(); x.putUnitDouble(c2t("Opct"), c2t("#Prc"), 100); x.putInteger(c2t("Lctn"), loc); x.putInteger(c2t("Mdpn"), 50); return x; }
    tl.putObject(c2t("TrnS"), ts(0)); tl.putObject(c2t("TrnS"), ts(4096));
    gr.putList(c2t("Trns"), tl);
    g.putObject(c2t("Grad"), c2t("Grdn"), gr);
    g.putUnitDouble(c2t("Angl"), c2t("#Ang"), goc || 0);
    g.putEnumerated(c2t("Type"), c2t("GrdT"), c2t("Lnr "));
    g.putBoolean(c2t("Rvrs"), false); g.putBoolean(c2t("Algn"), true);
    g.putUnitDouble(c2t("Scl "), c2t("#Prc"), 100);
    fe.putObject(c2t("GrFl"), c2t("GrFl"), g);
    d.putObject(c2t("T   "), c2t("Lefx"), fe);
    executeAction(c2t("setd"), d, DialogModes.NO);
  } catch (e) { THEME_LOG += "Theme: chu chuyen sac loi (" + e.message + "), giu mau dac\n"; }
}

// ---------- bia toi gian (fen 12/11 21h52 anh mau "iPhone 11" + "lam anh nay thanh theme luon") ----------
// Nen den tron, TEN MAY chu manh can trai, 2 gach ngan kep 2-4 dong mo ta nho, anh can 1 goc may (cum camera) rat to tran goc duoi phai.
// o = { ten: "iPad Pro M4", mo: ["dòng 1", "dòng 2", "dòng 3"], may: "file.png", hop: [trai, tren, rong] (khung dat anh, rong > W de phong to 1 goc) }
function biaToiGian(o) {
  var AA = typeof A != "undefined" ? A : (typeof TN != "undefined" ? TN : "");
  var x = o.x || 210, y = 150, q, TF = THEME.font_bia ? pick(THEME.font_bia.concat([F.T])) : F.T;
  text("POLY STORE", F.B, 22, C.WHITE, 96, 80, { track: 200, name: "Thương hiệu" });
  if (o.may) {   // anh dat truoc (nam duoi chu)
    var h = o.hop || [230, 560, 2600];
    var L = placeSO(AA + o.may, "Ảnh cận máy"), b0 = bb(L), k = h[2] / (b0[2] - b0[0]) * 100;
    L.resize(k, k, AnchorPosition.TOPLEFT); b0 = bb(L); L.translate(h[0] - b0[0], h[1] - b0[1]);
  }
  var T = text(o.ten, TF, 128, C.WHITE, x, 300, { maxW: 1080 - x - 60, name: "Tên máy" });
  q = bb(T); T.translate(x - q[0], y - q[1]); q = bb(T); y = q[3] + 52;
  var mo = o.mo || [];
  if (mo.length) {
    rect(x, y, x + 70, y + 3, 0, "FFFFFF", "Gạch trên"); y += 44;
    for (var i = 0; i < mo.length; i++) {
      var M = text(mo[i], F.R || F.B, 32, C.WHITE, x, y + 30, { maxW: 700, name: "Mô tả " + (i + 1) });
      var qm = bb(M); M.translate(x - qm[0], 0); y += 52;
    }
    y += 18; rect(x, y, x + 70, y + 3, 0, "FFFFFF", "Gạch dưới");
  }
}
