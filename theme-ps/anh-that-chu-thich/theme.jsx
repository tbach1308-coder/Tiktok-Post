// theme.jsx tự tạo bằng theme-ps/tao.py - sửa theme.json / _dong-co.jsx rồi chạy lại, đừng sửa tay
var THEME = {
 "id": "anh-that-chu-thich",
 "ten": "Ảnh thật · Chú thích tay",
 "kieu": "ảnh thật",
 "kenh": "",
 "ve_tay": true,
 "mo_ta": "Theo ảnh mẫu fen gửi 14/11 (iPad Pro M5 + phím + Pencil + sạc): ảnh thật món đồ, chữ viết tay trắng, mũi tên cong vẽ tay chỉ từng món, giá 2 gạch chân, viền quanh món như cắt dán. Bìa biaChuThich (tiêu đề viết tay + ảnh có chú thích); trang có ảnh món đồ dùng anhChuThich (mục Chú thích vẽ tay trong luật theme). Trang chữ: gọi bgPhoto ảnh của bài thì ảnh đó làm mờ phủ tối, không gọi thì phông xám có quầng sáng + hạt giấy (không bao giờ nền trơn); tiêu đề viết tay có gạch chân vẽ tay; thẻ tối trong. Không bóng, không trang trí thêm.",
 "nen": "131313",
 "nen2": "131313",
 "the": "000000",
 "the_kieu": "toi",
 "the_op": 40,
 "nhan": "2B2B2B",
 "nhan_dam": "1F1F1F",
 "nhan_nhat": "FFFFFF",
 "vang": "FFFFFF",
 "ghi_nen": "F5F5F4",
 "ghi_chu": "1F1F1F",
 "do": "F87171",
 "inkbg": "1F1F1F",
 "font_tieu_de": [
  "InkFree",
  "SegoePrint",
  "UTM-Duepuntozero"
 ],
 "font_than": [
  "UTMAvoBold",
  "UTMNeoSansIntelBold"
 ],
 "font_thuong": [
  "UTM-Avo",
  "UTMAvo"
 ],
 "co_tieu_de": 0.9,
 "giu_vien": false,
 "trang_tri": "khong",
 "pill": [
  "FFFFFF",
  "1F1F1F"
 ],
 "dau_tick": [
  "FFFFFF",
  "1F1F1F"
 ],
 "chu_tieu_de": "FFFFFF",
 "font_tay": [
  "InkFree",
  "SegoePrint",
  "UTM-Duepuntozero"
 ],
 "tay_mau": "FFFFFF",
 "tay_co": 46,
 "tay_vien": true,
 "bia_co": 84,
 "bia_x": 64,
 "xem": {
  "bia_ct": {
   "t1": "iPad Air 5",
   "t2": "chọn màu nào?",
   "anh": "Ads Air 5.jpg",
   "thu": 0.8,
   "cy": 880,
   "vien": true,
   "mau": "FFFFFF",
   "ds": [
    {
     "chu": "Tím · 64GB",
     "gia": "9tr490",
     "o": [
      1030,
      96
     ],
     "can": "phai",
     "toi": [
      905,
      480
     ],
     "xoay": -3
    },
    {
     "chu": "Xanh dương",
     "gia": "12tr990",
     "o": [
      64,
      318
     ],
     "toi": [
      262,
      640
     ],
     "co": 42,
     "xoay": -4
    },
    {
     "chu": "Xám",
     "gia": "9tr290",
     "o": [
      1060,
      1316
     ],
     "can": "phai",
     "toi": [
      985,
      1218
     ],
     "co": 40,
     "xoay": -3
    }
   ]
  },
  "pill": "SO SÁNH",
  "tieu": "64GB hay 256GB?",
  "phu": "Học, xem phim: 64GB là đủ",
  "ten": "iPad Air 5",
  "cau": "Chip M1 · 64GB",
  "gia": "9.490.000đ",
  "y": [
   [
    "check",
    "Học online, ghi chú, xem phim: 64GB"
   ],
   [
    "check",
    "Quay 4K, lưu file nặng: 256GB"
   ],
   [
    "x",
    "Đừng chọn 64GB nếu chơi game nặng"
   ]
  ],
  "ghi": [
   "Còn phân vân bản nào?",
   "Ghé POLY cầm thử cả 2"
  ],
  "moc": "Xem bảng màu",
  "hoi": "Bạn chọn\rmàu nào?",
  "nen": [
   null,
   [
    "unsplash-ipad-pencil-ban-toi-gYVNvRygCUw.jpg",
    2000,
    500,
    0,
    1070
   ],
   null
  ]
 },
 "nen_kieu": "kinh",
 "dom": [],
 "toa": [
  [
   "6B6B6B",
   760,
   190,
   760,
   600,
   340,
   85
  ]
 ],
 "hat_nen": 9,
 "hat_op": 45,
 "anh_mau": 52,
 "anh_mo": 34,
 "anh_toi": 30
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
if (typeof INKBG != "undefined") INKBG = THEME.inkbg || THEME.nen;   // nen o cau moc / dia chi (Laptop): theme nen sang thi dung inkbg toi
if (typeof RED != "undefined" && THEME.do) RED = THEME.do;
if (typeof RANKC != "undefined") RANKC = THEME.nhan_dam;

// ---------- font: thu lan luot danh sach cua theme, khong co thi giu font cu ----------
(function () {
  var t = pick(THEME.font_tieu_de.concat([F.T])), b = pick(THEME.font_than.concat([F.B]));
  F.T = t; F.B = b;
  if (THEME.font_thuong) F.R = pick(THEME.font_thuong.concat([F.R]));
  if (typeof FS != "undefined") { FS.T = t; FS.I = THEME.font_nghieng ? pick(THEME.font_nghieng.concat([b])) : b; }
  if (THEME.font_phu) F.P = pick(THEME.font_phu.concat([b]));     // dong phu de "Phụ đề" (vd chu nghieng co chan, theme anh that 14/11)
  if (THEME.font_kicker) F.K = pick(THEME.font_kicker.concat([t]));   // dong nho tren tieu de bia (theme "Ảnh thật · Chữ nghiêng" 14/11)
  THEME_LOG = "Theme " + THEME.ten + ": T=" + F.T + " B=" + F.B + "\n";
})();

// ---------- chu tieu de: font theme hep / rong hon font cu thi nhan co chu cho bang (co_tieu_de) ----------
var THEME_TEXT0 = text;
text = function (str, font, size, h, x, y, o) {
  var nm = o && o.name;
  if (font == F.T && THEME.chu_tieu_de && h == C.WHITE) h = THEME.chu_tieu_de;      // chu to (tieu de, gia, cau hoi) doi mau theme
  if (nm == "Phụ đề" && F.P) {
    font = F.P; size = Math.round(size * (THEME.co_phu || 1)); if (THEME.mau_phu) h = THEME.mau_phu;
    var Lp = THEME_TEXT0(str, font, size, h, x, y, o);
    if (THEME.vien_phu) THEME_FX0(Lp, { stroke: THEME.vien_phu });
    return Lp;
  }
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
  if (o.stroke.size > 3 && THEME.vien_chu) { THEME_FX0(L, { stroke: THEME.vien_chu }); return; }   // vien toi manh nhu anh mau (theme anh that)
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
  else if (tt == "khung") themeKhungNen();
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
  // tieu de ve TRUOC anh tiem: lop nao ve sau anh cung bi khung anh cat mat (fen 13/11: bia trong chu)
  // chu tron xanh la vien kem + nau, dong nho nau; ca cum can giua trong dai duoi anh
  var ls = [], y = BOT + 30, mau = THEME.bia_mau || THEME.bang;
  if (o.t1) { var A1 = themeChuBong(o.t1, TF, 88, mau, cx, y + 88, 960, "Tiêu đề - dòng 1"); ls = ls.concat(A1); y = bb(A1[0])[3] + 6; }
  if (o.t2) { var A2 = themeChuBong(o.t2, TF, 88, mau, cx, y + 88, 960, "Tiêu đề - dòng 2"); ls = ls.concat(A2); y = bb(A2[0])[3] + 6; }
  if (o.nho) { var N = text(o.nho, F.B, 38, THEME.vien_nau || "4A3631", cx, y + 52, { align: Justification.CENTER, maxW: 900, name: "Dòng nhỏ" }); ls.push(N); }
  if (ls.length) {
    var t = 1e9, b = -1e9;
    for (var i = 0; i < ls.length; i++) { try { ls[i].grouped = false; } catch (e3) {} var qq = bb(ls[i]); t = Math.min(t, qq[1]); b = Math.max(b, qq[3]); }
    var dy = (BOT + 12 + H - 30) / 2 - (t + b) / 2;
    for (var j = 0; j < ls.length; j++) ls[j].translate(0, dy);
  }
  if (a && dir) {
    // khung anh: mep duoi luon nhu mai hien (1 lop), anh tiem cat theo khung (clipping)
    var K = themeVungLuon(0, BOT, r, THEME.vien_nau || "4A3631", "Khung ảnh tiệm");
    try {
      var L = placeSO(dir + "/anh/" + a[0], "Ảnh tiệm - " + k), q = bb(L);
      var pct = W / (q[2] - q[0]) * 100;
      L.resize(pct, pct, AnchorPosition.TOPLEFT); q = bb(L);
      L.translate(-q[0], -a[1] * (q[2] - q[0]) / 941 - q[1]);
      L.grouped = true;
      // nhap anh vao khung thanh 1 lop: neu de nguyen nhom cat thi chu tieu de ve sau cung bi khung cat mat (fen 13/11: bia trong chu)
      var M = K;
      try { M = L.merge(); M.name = "Ảnh tiệm - " + k; } catch (e2) { THEME_LOG += "Theme: khong nhap duoc anh tiem vao khung (" + e2.message + ")\n"; }
      THEME_FX0(M, { stroke: { hex: THEME.vien_nau || "4A3631", size: 4, op: 100 } });
    } catch (e) { THEME_LOG += "Theme: khong dat duoc anh tiem " + a[0] + " (" + e.message + ")\n"; }
  } else THEME_LOG += "Theme: thieu anh tiem (THEME_DIR / tiem." + k + ")\n";
}
// ---------- tien ich chung ----------
// xep cac lop chu theo chieu doc, can trai tai x, khoang cach gaps[i] giua lop i va i+1; ca cum can giua trong [top, bot] (khong du cho thi canh tren)
function themeXepDoc(ls, x, top, bot, gaps) {
  if (!ls.length) return;
  var y = top, q;
  for (var i = 0; i < ls.length; i++) {
    q = bb(ls[i]); ls[i].translate(x - q[0], y - q[1]); q = bb(ls[i]);
    y = q[3] + (gaps && gaps[i] != null ? gaps[i] : 16);
  }
  var t = bb(ls[0])[1], b = bb(ls[ls.length - 1])[3], dy = Math.round((top + bot) / 2 - (t + b) / 2);
  if (dy > 0) for (var j = 0; j < ls.length; j++) ls[j].translate(0, dy);
}
function themeAnhDau(may) { return may ? (may instanceof Array ? may[0] : may) : ""; }

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
  if (THEME.anh_mau !== 0) { var T = rect(0, 0, W, H, 0, THEME.nen, "Lớp màu theme"); T.opacity = THEME.anh_mau || 45; }
  themeDom(THEME.dom_tren || 55);
  if (THEME.trang_tri == "khung") themeKhungNen();     // anh nen nam trong khung sang (theme "Ảnh thật · Nền sáng")
}
bgPhoto = function (file, imgW, cropL, cropT, cropW, blur, op) {
  themeAnhMo(function (a) { THEME_BG0(a[0], a[1], a[2], a[3], a[4], THEME.anh_mo || 30, THEME.anh_toi || 30); }, [file, imgW, cropL, cropT, cropW]);
};
background = function (file, imgW, cropL, cropT, cropW, blurR) {
  themeAnhMo(function (a) { THEME_BGR0(a[0], a[1], a[2], a[3], a[4], THEME.anh_mo || 30); }, [file, imgW, cropL, cropT, cropW]);
};
// the: theme phang -> the dac; theme kinh -> the trang trong + vien mong (khong bong)
glass = function (l, t, r, b, rad, name) {
  if (THEME.the_kieu == "toi") { var Gt = rect(l, t, r, b, rad, THEME.the, name || "Thẻ"); Gt.fillOpacity = THEME.the_op || 50; return Gt; }   // khung toi trong, khong vien, khong bong
  if (THEME.nen_kieu != "kinh") return rect(l, t, r, b, rad, THEME.the, name || "Thẻ");
  var G = rect(l, t, r, b, rad, "FFFFFF", name || "Thẻ kính");
  G.fillOpacity = THEME.kinh_op || 14;
  THEME_FX0(G, { stroke: { hex: "FFFFFF", size: 2, op: THEME.kinh_vien || 45, inside: true } });
  return G;
};

// ---------- nhan / dau tick mau rieng (theme anh that 14/11: nhan vang chu den). nhan = mau nen tron cua C.GREEN (dau tick, so buoc...) giu toi cho chu trang ----------
if (THEME.pill) {
  var THEME_PILLC0 = pillC;
  pillC = function (str, cx, cy, size, txtH, fillH, padX, hgt, font, track, name) {
    if (fillH == THEME.nhan) { fillH = THEME.pill[0]; txtH = THEME.pill[1]; }
    return THEME_PILLC0(str, cx, cy, size, txtH, fillH, padX, hgt, font, track, name);
  };
  if (typeof pill != "undefined") {
    var THEME_PILL0 = pill;
    pill = function (str, x, cy, size, txtH, fillH, padX, hgt, font, track, name) {
      if (fillH == THEME.nhan) { fillH = THEME.pill[0]; txtH = THEME.pill[1]; }
      return THEME_PILL0(str, x, cy, size, txtH, fillH, padX, hgt, font, track, name);
    };
  }
}
if (THEME.dau_tick) {
  if (typeof dotIcon != "undefined") {
    var THEME_DOT0 = dotIcon;
    dotIcon = function (kind, cx, cy, r) {
      if (kind != "check") return THEME_DOT0(kind, cx, cy, r);
      return [oval(cx - r, cy - r, cx + r, cy + r, THEME.dau_tick[0], "Biểu tượng - nền"), check(cx, cy + 1, r * 1.05, THEME.dau_tick[1])];
    };
  }
  if (typeof checkDot != "undefined") {
    checkDot = function (cx, cy, r) {
      oval(cx - r, cy - r, cx + r, cy + r, THEME.dau_tick[0], "Dấu tích - nền");
      check(cx, cy + 1, r * 1.05, THEME.dau_tick[1]);
    };
  }
}

// ---------- tien ich anh that (fen 14/11 13h30 "xoay quanh style nay lam 3 theme cho photoshop") ----------
// diem cua hinh chu nhat bo goc (de chon vung): l, t, r, b, ban kinh goc
function themeBoGoc(l, t, r, b, rad) {
  var p = [], n = 10;
  function cung(cx, cy, a0) { for (var i = 0; i <= n; i++) { var g = (a0 + 90 * i / n) * Math.PI / 180; p.push([cx + rad * Math.cos(g), cy + rad * Math.sin(g)]); } }
  cung(r - rad, t + rad, -90); cung(r - rad, b - rad, 0); cung(l + rad, b - rad, 90); cung(l + rad, t + rad, 180);
  return p;
}
// khung sang (nhu passe-partout): 1 lop mau mau phu kin trang, chua 1 o bo goc trong o giua de lo anh / bang phia duoi
function themeKhungSang(l, t, r, b, rad, mau, name) {
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.name = name || "Khung sáng";
  doc.selection.selectAll();
  doc.selection.select(themeBoGoc(l, t, r, b, rad), SelectionType.DIMINISH, 0, true);
  doc.selection.fill(col(mau)); doc.selection.deselect();
  return L;
}
// trang trong theme khung: nen toi (THEME.nen) trong khung sang le [trai, tren, phai, duoi]
function themeKhungNen() {
  var k = THEME.khung_sang || {}, le = k.le || [36, 62, 36, 36];
  return themeKhungSang(le[0], le[1], W - le[2], H - le[3], k.r || 30, k.mau || "F5F2EB", "Khung sáng");
}
// lop toi mo dan o day trang (chu de tren anh that van doc ro): lop to mau chuyen sac, den op% o day -> trong suot o do cao cao px.
// Loi thi ve 24 dai chong nhau (gan giong).
function themeDayToi(cao, op) {
  cao = cao || 760; op = op || 85;
  try {
    var c2t = charIDToTypeID, s2t = stringIDToTypeID, d = new ActionDescriptor(), r = new ActionReference();
    r.putClass(s2t("contentLayer")); d.putReference(c2t("null"), r);
    var lay = new ActionDescriptor(), g = new ActionDescriptor(), gr = new ActionDescriptor();
    lay.putString(c2t("Nm  "), "Lớp tối đáy");
    g.putUnitDouble(c2t("Angl"), c2t("#Ang"), 90);
    g.putEnumerated(c2t("Type"), c2t("GrdT"), c2t("Lnr "));
    gr.putString(c2t("Nm  "), "Day toi");
    gr.putEnumerated(c2t("GrdF"), c2t("GrdF"), c2t("CstS"));
    gr.putDouble(c2t("Intr"), 4096);
    var cl = new ActionList();
    function mau(loc) { var x = new ActionDescriptor(); x.putObject(c2t("Clr "), c2t("RGBC"), rgbDesc("000000")); x.putEnumerated(c2t("Type"), c2t("Clry"), c2t("UsrS")); x.putInteger(c2t("Lctn"), loc); x.putInteger(c2t("Mdpn"), 50); return x; }
    cl.putObject(c2t("Clrt"), mau(0)); cl.putObject(c2t("Clrt"), mau(4096));
    gr.putList(c2t("Clrs"), cl);
    var tl = new ActionList(), k = Math.min(4096, Math.round(cao / H * 4096));
    function ts(o2, loc) { var x = new ActionDescriptor(); x.putUnitDouble(c2t("Opct"), c2t("#Prc"), o2); x.putInteger(c2t("Lctn"), loc); x.putInteger(c2t("Mdpn"), 50); return x; }
    tl.putObject(c2t("TrnS"), ts(op, 0)); tl.putObject(c2t("TrnS"), ts(Math.round(op * 0.55), Math.round(k * 0.45))); tl.putObject(c2t("TrnS"), ts(0, k));
    if (k < 4096) tl.putObject(c2t("TrnS"), ts(0, 4096));
    gr.putList(c2t("Trns"), tl);
    g.putObject(c2t("Grad"), c2t("Grdn"), gr);
    lay.putObject(c2t("Type"), s2t("gradientLayer"), g);
    d.putObject(c2t("Usng"), s2t("contentLayer"), lay);
    executeAction(c2t("Mk  "), d, DialogModes.NO);
    var L = app.activeDocument.activeLayer; L.name = "Lớp tối đáy";
    return L;
  } catch (e) {
    THEME_LOG += "Theme: lop toi day chuyen sac loi (" + e.message + "), ve dai\n";
    var n = 24, hb = cao / n;
    for (var i = 0; i < n; i++) { var B = rect(0, H - (i + 1) * hb, W, H - i * hb + 1, 0, "000000", "Lớp tối đáy " + (i + 1)); B.opacity = Math.max(1, Math.round(op * (1 - i / n) * 0.16)); }
    return null;
  }
}

// ---------- bia anh that (fen 14/11 gui anh mau TikTok: anh that cam may, chu vang rat to chu hep vien toi + dong nghieng trang; "style kieu co anh that r thumbnail") ----------
// Anh that cua bai phu kin trang (khong lam mo, khong ve them may), chu thumbnail de len. Goi ngay sau newDoc.
// o = { anh: "ten-anh.jpg" (tim o thu muc anh cua bai, roi "Anh tai ve") hoac duong dan day du,
//       cat: [rongAnh, catTrai, catTren, catRong] (tuy chon, nhu bgPhoto; khong co thi tu cat phu kin, giu diem tam [x, y] 0..1 o giua),
//       t1: "dòng tiêu đề 1", t2: "dòng 2" (tuy chon), nho: "dòng nghiêng", vi_tri: "giua" | "tren" | "duoi" (cho trong cua anh), toi: 0..60 }
function themeTimAnh(f) {
  if (!f) return null;
  if (/^[A-Za-z]:[\\\/]|^[\\\/~]/.test(f)) { var g0 = new File(f); return g0.exists ? g0 : null; }
  var ds = [];
  if (typeof A == "string") ds.push(A);
  if (typeof TN == "string") ds.push(TN);
  if (typeof IMG == "string") ds.push(IMG);
  for (var i = 0; i < ds.length; i++) { var g = new File(ds[i] + f); if (g.exists) return g; }
  return null;
}
function themeAnhPhu(o) {
  var f = themeTimAnh(o.anh);
  if (!f) { THEME_LOG += "Theme: khong thay anh bia " + o.anh + " (giu nen theme)\n"; return null; }
  var L = placeSO(f.fsName, "Ảnh thật - bìa"), q = bb(L);
  if (o.cat && o.cat.length >= 4) fitSO(L, o.cat[0], o.cat[1], o.cat[2], o.cat[3], 0, 0, W);
  else {
    var w = q[2] - q[0], h = q[3] - q[1], s = Math.max(W / w, H / h) * 100;
    L.resize(s, s, AnchorPosition.TOPLEFT); q = bb(L); w = q[2] - q[0]; h = q[3] - q[1];
    var tm = o.tam || [0.5, 0.5];
    var x = Math.min(0, Math.max(W - w, W / 2 - tm[0] * w)), y = Math.min(0, Math.max(H - h, H / 2 - tm[1] * h));
    L.translate(x - q[0], y - q[1]);
  }
  try { L.rasterize(RasterizeType.ENTIRELAYER); } catch (e) {}
  return L;
}
function themeDoiMuc(it, dx, dy) { for (var i = 0; i < it.ls.length; i++) it.ls[i].translate(dx, dy); }
function biaAnhThat(o) {
  o = o || {};
  var Ph = themeAnhPhu(o), toi = o.toi != null ? o.toi : (THEME.bia_toi || 0), cx = W / 2;
  if (Ph && toi > 0) { var O = rect(0, 0, W, H, 0, "000000", "Lớp tối ảnh bìa"); O.opacity = toi; }
  if (Ph && THEME.bia_day) themeDayToi(THEME.bia_day[0], THEME.bia_day[1]);          // theme "Ảnh thật · Đáy tối"
  var trai = THEME.bia_can == "trai", x0 = THEME.bia_x || 84, can = trai ? Justification.LEFT : Justification.CENTER;
  var Br = THEME_TEXT0("POLY STORE", F.B, 22, "FFFFFF", trai ? x0 : cx, 96, { track: 200, align: can, name: "Thương hiệu" });
  if (trai) { var qb = bb(Br); Br.translate(x0 - qb[0], 0); } else themeGiua(Br, cx);
  var co = o.co || THEME.bia_co || 150, tr = THEME.bia_track || 0, it = [], dong = [o.t1, o.t2];
  if (o.tren) {      // dong nho tren tieu de (vd "MẸO IPHONE"), chu hep vang gian chu
    var K = THEME_TEXT0(o.tren, F.K || F.B, THEME.bia_co_tren || 34, THEME.bia_mau_tren || THEME.vang || "FFD400", cx, 0, { track: THEME.bia_track_tren != null ? THEME.bia_track_tren : 200, align: can, maxW: W - 140, name: "Dòng nhỏ trên tiêu đề" });
    it.push({ ls: [K], m: K, gap: THEME.bia_cach_tren != null ? THEME.bia_cach_tren : 20 });
  }
  for (var i = 0; i < dong.length; i++) {
    if (!dong[i]) continue;
    var T = THEME_TEXT0(dong[i], F.T, co, i == 0 ? THEME.bia_mau : (THEME.bia_mau2 || THEME.bia_mau), cx, 0, { track: tr, align: can, maxW: W - 120, name: "Tiêu đề bìa - dòng " + (i + 1) });
    if (THEME.bia_vien) THEME_FX0(T, { stroke: THEME.bia_vien });
    it.push({ ls: [T], m: T, gap: THEME.bia_gian || 10 });
  }
  if (o.nho) {
    var S = THEME_TEXT0(o.nho, F.P || F.B, THEME.bia_co_phu || 60, THEME.bia_mau_phu || "FFFFFF", cx, 0, { align: can, maxW: W - 140, name: "Dòng nghiêng bìa" });
    if (THEME.bia_vien_phu) THEME_FX0(S, { stroke: THEME.bia_vien_phu });
    it.push({ ls: [S], m: S, gap: 0 });
    if (it.length > 1) it[it.length - 2].gap = THEME.bia_cach_phu != null ? THEME.bia_cach_phu : 24;
  }
  if (!it.length) return;
  var tong = 0;
  for (var j = 0; j < it.length; j++) { var b = bb(it[j].m); tong += b[3] - b[1] + (j < it.length - 1 ? it[j].gap : 0); }
  var vt = o.vi_tri || THEME.bia_vi_tri || "giua", y = vt == "tren" ? 190 : (vt == "duoi" ? H - 150 - tong : Math.round((H - tong) / 2 + (THEME.bia_lech || 0)));
  for (var k = 0; k < it.length; k++) {
    var bk = bb(it[k].m);
    themeDoiMuc(it[k], Math.round(trai ? x0 - bk[0] : cx - (bk[0] + bk[2]) / 2), Math.round(y - bk[1]));
    y += bk[3] - bk[1] + it[k].gap;
  }
}

// ---------- bia anh trong khung sang (theme "Ảnh thật · Nền sáng", fen 14/11 13h30) ----------
// Nen kem, anh that cua bai nam trong o bo goc phia tren, duoi la tieu de chu hep den rat to can trai + vach vang to duoi 1 dong + dong nghieng xam.
// o = { anh, tam: [x, y] 0..1, t1, t2, nho, vach: 1 | 2 (dong tieu de co vach vang, mac dinh dong cuoi) }. THEME.bia_khung = { t, b, le, rad, x }
function biaAnhKhung(o) {
  o = o || {};
  var k = THEME.bia_khung || {}, le = k.le || 60, l = le, t = k.t || 150, r = W - le, b = k.b || 860, rad = k.rad || 28, x0 = k.x || 84;
  var f = themeTimAnh(o.anh);
  if (f) {
    var L = placeSO(f.fsName, "Ảnh thật - bìa"), q = bb(L), w = q[2] - q[0], h = q[3] - q[1], s = Math.max((r - l) / w, (b - t) / h) * 100;
    L.resize(s, s, AnchorPosition.TOPLEFT); q = bb(L); w = q[2] - q[0]; h = q[3] - q[1];
    var tm = o.tam || [0.5, 0.5];
    var x = Math.min(l, Math.max(r - w, (l + r) / 2 - tm[0] * w)), y0 = Math.min(t, Math.max(b - h, (t + b) / 2 - tm[1] * h));
    L.translate(x - q[0], y0 - q[1]);
    try { L.rasterize(RasterizeType.ENTIRELAYER); } catch (e) {}
  } else THEME_LOG += "Theme: khong thay anh bia " + o.anh + "\n";
  themeKhungSang(l, t, r, b, rad, THEME.bia_nen || "F5F2EB", "Nền sáng bìa");
  var mc = THEME.bia_chu || "141414";
  var Br = THEME_TEXT0("POLY STORE", F.B, 22, mc, x0, 96, { track: 200, name: "Thương hiệu" });
  var qb = bb(Br); Br.translate(x0 - qb[0], 96 - qb[1]);
  var co = o.co || THEME.bia_co || 150, tr = THEME.bia_track || 0, ls = [], dong = [o.t1, o.t2], vach = o.vach || (o.t2 ? 2 : 1), Tv = null;
  for (var i = 0; i < dong.length; i++) {
    if (!dong[i]) continue;
    var T = THEME_TEXT0(dong[i], F.T, co, i == 0 ? (THEME.bia_mau || mc) : (THEME.bia_mau2 || THEME.bia_mau || mc), x0, 0, { track: tr, maxW: W - 2 * x0, name: "Tiêu đề bìa - dòng " + (i + 1) });
    ls.push([T, THEME.bia_gian || 8]);
    if (i + 1 == vach) Tv = T;
  }
  if (o.nho) { var S = THEME_TEXT0(o.nho, F.P || F.B, THEME.bia_co_phu || 54, THEME.bia_mau_phu || "3F3F46", x0, 0, { maxW: W - 2 * x0, name: "Dòng nghiêng bìa" }); if (ls.length) ls[ls.length - 1][1] = THEME.bia_cach_phu != null ? THEME.bia_cach_phu : 26; ls.push([S, 0]); }
  if (!ls.length) return;
  var tong = 0;
  for (var j = 0; j < ls.length; j++) { var qj = bb(ls[j][0]); tong += qj[3] - qj[1] + (j < ls.length - 1 ? ls[j][1] : 0); }
  var yy = Math.round(b + (H - b - tong) / 2 - 8);
  for (var m = 0; m < ls.length; m++) { var qm = bb(ls[m][0]); ls[m][0].translate(x0 - qm[0], yy - qm[1]); yy += qm[3] - qm[1] + ls[m][1]; }
  if (Tv) {      // vach vang to nua duoi dong tieu de (nhu but da quang), nam sau chu
    var qv = bb(Tv), V = rect(qv[0] - 12, qv[1] + Math.round((qv[3] - qv[1]) * 0.5), qv[2] + 12, qv[3] + 8, 0, THEME.vach || THEME.vang || "FFD400", "Vạch vàng");
    try { V.move(Tv, ElementPlacement.PLACEAFTER); } catch (e2) {}
  }
}

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

// _ve-tay.jsx: chu thich ve tay, CHI ghep vao theme co "ve_tay": true trong theme.json (fen 14/11 15h24 "cai nay lam theme rieng di khong ap dung tat ca").
// tao.py noi file nay sau _dong-co.jsx. Theme khac khong co cac ham duoi day.
// ---------- chu thich ve tay (fen 14/11 13h48 gui anh "iPad Pro M5 11" / giá: 24tr500" + "lam dc may cai chu thich ve nhu hinh nay cho theme khong") ----------
// Chu viet tay + mui ten cong ve tay + 2 gach chan duoi gia + (tuy chon) vien quanh mon do nhu cat dan sticker. Chi theme "Ảnh thật · Chú thích tay" (ve_tay: true).
// Font tay mac dinh Ink Free (giong anh mau nhat, du dau tieng Viet; KG Ten Thousand Reasons so 1 giong chu l nen xep sau).
// Net ve = vung chon da giac (thon 2 dau, rung nhe) to mau tren 1 lop thuong: khong bong, khong vien, sua mau bang Fill / Hue nhu lop thuong.
var FTAY = pick((THEME.font_tay || []).concat(["InkFree", "SegoePrint", "UTM-Duepuntozero", "SVN-KGTenThousandReasons", F.B]));
var TAY_HAT = 11;
function tayRand() { TAY_HAT = (TAY_HAT * 9301 + 49297) % 233280; return TAY_HAT / 233280; }
// diem tren duong cong bac 2 S -> E (diem keo K)
function tayCong(S, K, E, n) {
  var p = [];
  for (var i = 0; i <= n; i++) { var t = i / n, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t; p.push([a * S[0] + b * K[0] + c * E[0], a * S[1] + b * K[1] + c * E[1]]); }
  return p;
}
function tayTron(cx, cy, r) { var q = []; for (var i = 0; i < 16; i++) { var g = i / 16 * 6.2832; q.push([cx + r * Math.cos(g), cy + r * Math.sin(g)]); } return q; }
// 1 net qua cac diem p: day w, do day 2 dau thon = [dau, cuoi] (ti le), rung = do lech vuong goc toi da (px, 2 dau = 0). Tra ve cac da giac (than + 2 dau tron).
function tayNet(p, w, thon, rung) {
  var n = p.length, L = [], R = [], ph = tayRand() * 6.28, f = 0.6 + tayRand() * 1.2;
  thon = thon || [0.6, 0.6]; rung = rung == null ? 1.2 : rung;
  for (var i = 0; i < n; i++) {
    var a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / d, ny = dx / d, t = i / (n - 1);
    var k = t < 0.5 ? thon[0] + (1 - thon[0]) * Math.min(1, t / 0.2) : thon[1] + (1 - thon[1]) * Math.min(1, (1 - t) / 0.2);
    var o = rung * Math.sin(Math.PI * t) * Math.sin(ph + f * 6.2832 * t), cx = p[i][0] + nx * o, cy = p[i][1] + ny * o, ww = w * k / 2;
    L.push([cx + nx * ww, cy + ny * ww]); R.push([cx - nx * ww, cy - ny * ww]);
  }
  var out = [L.concat(R.reverse())], r0 = w * thon[0] / 2, r1 = w * thon[1] / 2;
  if (r0 >= 1) out.push(tayTron(p[0][0], p[0][1], r0));
  if (r1 >= 1) out.push(tayTron(p[n - 1][0], p[n - 1][1], r1));
  return out;
}
// to cac da giac len 1 lop moi
function tayVe(ps, mau, name) {
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.name = name || "Nét vẽ tay";
  for (var i = 0; i < ps.length; i++) doc.selection.select(ps[i], i ? SelectionType.EXTEND : SelectionType.REPLACE, 0, true);
  doc.selection.fill(col(mau)); doc.selection.deselect();
  return L;
}
// mui ten cong ve tay S -> E (mui nhon mo o E). K: diem keo (khong co thi cong theo goc vuong [S.x, E.y] neu dung, [E.x, S.y] neu ngang);
// cong: so (ti le do dai, am = cong nguoc) thay cho K.
function tayMuiTen(S, E, w, mau, name, huong, cong) {
  var dx = E[0] - S[0], dy = E[1] - S[1], d = Math.sqrt(dx * dx + dy * dy) || 1, mx = (S[0] + E[0]) / 2, my = (S[1] + E[1]) / 2, K;
  if (cong != null) K = [mx - dy / d * d * cong, my + dx / d * d * cong];
  else { var G = huong == "doc" ? [S[0], E[1]] : [E[0], S[1]]; K = [mx + (G[0] - mx) * 0.7, my + (G[1] - my) * 0.7]; }     // mac dinh ra ngang, cam doc vao mon do
  var p = tayCong(S, K, E, Math.max(16, Math.round(d / 7))), ps = tayNet(p, w, [0.5, 0.95], Math.min(2, d / 120));
  var tx = E[0] - K[0], ty = E[1] - K[1], tl = Math.sqrt(tx * tx + ty * ty) || 1, hl = Math.max(22, w * 5.5);
  tx /= tl; ty /= tl;
  for (var s = -1; s <= 1; s += 2) {
    var g = s * (26 + tayRand() * 8) * Math.PI / 180, bx = -tx, by = -ty, len = hl * (s < 0 ? 1 : 0.82);
    var hx = bx * Math.cos(g) - by * Math.sin(g), hy = bx * Math.sin(g) + by * Math.cos(g), A2 = [E[0] + hx * len, E[1] + hy * len];
    ps = ps.concat(tayNet(tayCong(E, [(E[0] + A2[0]) / 2 + hy * 2, (E[1] + A2[1]) / 2 - hx * 2], A2, 6), w * 0.95, [0.95, 0.45], 0));
  }
  return tayVe(ps, mau, name || "Mũi tên");
}
// 2 gach chan ve tay duoi doan [l, r] o do cao y
function tayGach(l, r, y, w, mau, name, mot) {
  var len = r - l, n = Math.max(10, Math.round(len / 10));
  var ps = tayNet(tayCong([l - 6, y + 3], [(l + r) / 2, y + 6 - tayRand() * 8], [r + 10, y - 2], n), w, [0.55, 0.4], 0.8);
  if (!mot) ps = ps.concat(tayNet(tayCong([l + 10, y + 16], [(l + r) / 2, y + 18 + tayRand() * 4], [r - 2, y + 11], n), w * 0.88, [0.5, 0.35], 0.8));
  return tayVe(ps, mau, name || "Gạch chân");
}
// vien quanh mon do (nhu cat dan sticker trong anh mau): Chon chu the (Select Subject) tren lop anh -> no rong + bo tron -> ke net. Loi thi bo qua.
function tayVienMon(L, mau, w, no) {
  var doc = app.activeDocument;
  try {
    doc.activeLayer = L;
    var d = new ActionDescriptor(); d.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
    executeAction(stringIDToTypeID("autoCutout"), d, DialogModes.NO);
    doc.selection.expand(new UnitValue(no || 16, "px"));
    doc.selection.smooth(24);
    var V = doc.artLayers.add(); V.name = "Viền món đồ";
    doc.selection.stroke(col(mau), w || 5, StrokeLocation.CENTER, ColorBlendMode.NORMAL, 100, false);
    doc.selection.deselect();
    return V;
  } catch (e) { try { doc.selection.deselect(); } catch (e2) {} RUN += "   chu thich: khong ve duoc vien mon do (" + e.message + ")\n"; return null; }
}
// 1 chu thich: it = { chu: "Tên\rdòng 2", gia: "24tr500" (tuy chon, them "giá: " + 2 gach chan), o: [x, y] goc tren trai (can "phai": goc tren phai, "giua": giua tren),
//   toi: [x, y] mui ten chi toi (khong co = khong mui ten), tu: "duoi" | "tren" | "trai" | "phai" (mui ten ra tu canh nao, mac dinh tu chon),
//   huong: "ngang" (mac dinh: ra ngang, cam doc vao mon do) | "doc" (ra doc, cam ngang),
//   xoay: do (am = nghieng len ben phai, mac dinh -4..-2), cong: so (tuy chon), co: co chu }
function chuThich1(it, i, mau, co) {
  var doc = app.activeDocument, ls = [], rows = [];
  co = it.co || co || THEME.tay_co || 46;
  var lead = Math.round(co * 1.18), can = it.can == "phai" ? Justification.RIGHT : (it.can == "giua" ? Justification.CENTER : Justification.LEFT);
  var nd = it.chu ? String(it.chu).split("\r").length : 0, P = null, Gc = null, base = co;
  if (it.chu) { var N = THEME_TEXT0(it.chu, FTAY, co, mau, 0, base, { lead: lead, align: can, name: "Chú thích - chữ" }); ls.push(N); rows.push([N]); }
  if (it.gia) {
    var yb = base + nd * lead, pre = it.gia_chu != null ? it.gia_chu : "giá: ";
    var row = [];
    if (pre) { var G1 = THEME_TEXT0(pre, FTAY, co, mau, 0, yb, { name: "Chú thích - chữ giá" }); row.push(G1); ls.push(G1); }
    P = THEME_TEXT0(String(it.gia), FTAY, co, mau, row.length ? bb(row[0])[2] + Math.round(co * 0.3) : 0, yb, { name: "Chú thích - giá" });
    row.push(P); ls.push(P); rows.push(row);
  }
  if (!ls.length) return null;
  // can cac hang theo kieu can (hang chu nhieu dong da tu can trong lop)
  var wmax = 0, rb = [];
  for (var r = 0; r < rows.length; r++) { var a = bb(rows[r][0]), z = bb(rows[r][rows[r].length - 1]); rb.push([a[0], z[2]]); wmax = Math.max(wmax, z[2] - a[0]); }
  var x0 = 1e9; for (var r2 = 0; r2 < rows.length; r2++) x0 = Math.min(x0, rb[r2][0]);
  for (var r3 = 0; r3 < rows.length; r3++) {
    var wr = rb[r3][1] - rb[r3][0], want = can == Justification.RIGHT ? wmax - wr : (can == Justification.CENTER ? (wmax - wr) / 2 : 0), dx = x0 + want - rb[r3][0];
    if (Math.abs(dx) > 0.5) for (var c = 0; c < rows[r3].length; c++) rows[r3][c].translate(dx, 0);
  }
  // dat ca cum chu vao o, roi moi ve gach chan (ve ngoai trang thi net bi cat mat)
  var t = 1e9, l = 1e9, rr = -1e9;
  for (var j = 0; j < ls.length; j++) { var q = bb(ls[j]); t = Math.min(t, q[1]); l = Math.min(l, q[0]); rr = Math.max(rr, q[2]); }
  var ax = can == Justification.RIGHT ? rr : (can == Justification.CENTER ? (l + rr) / 2 : l), mx = it.o[0] - ax, my = it.o[1] - t;
  for (var k = 0; k < ls.length; k++) ls[k].translate(mx, my);
  if (P) { var qp = bb(P); Gc = tayGach(qp[0], qp[2], qp[3] + 7, Math.max(3, co / 11), mau, "Chú thích - gạch chân"); ls.push(Gc); }
  // gom nhom + nghieng nhe nhu viet tay
  var Gr = doc.layerSets.add();
  Gr.name = "Chú thích " + (i + 1) + (it.chu ? " - " + String(it.chu).replace(/\r/g, " ").substr(0, 28) : "");
  for (var m = 0; m < ls.length; m++) { try { ls[m].move(Gr, ElementPlacement.INSIDE); } catch (e) { ls[m].move(Gr, ElementPlacement.PLACEATEND); } }
  var xo = it.xoay != null ? it.xoay : -2 - tayRand() * 2.5;
  if (xo) { try { Gr.rotate(xo, AnchorPosition.MIDDLECENTER); } catch (e2) { RUN += "   chu thich: khong nghieng duoc nhom (" + e2.message + ")\n"; } }
  if (it.toi) {
    var gb = bb(Gr), E = it.toi, cx = (gb[0] + gb[2]) / 2, cy = (gb[1] + gb[3]) / 2, ex = E[0] - cx, ey = E[1] - cy, tu = it.tu;
    if (!tu) tu = Math.abs(ey) > Math.abs(ex) * 0.7 ? (ey > 0 ? "duoi" : "tren") : (ex > 0 ? "phai" : "trai");
    var hb = Gc ? bb(Gc) : gb, S, cach = it.cach || 18;
    if (tu == "duoi") S = [hb[0] + (hb[2] - hb[0]) * (ex > 0 ? 0.72 : 0.28), hb[3] + cach];
    else if (tu == "tren") S = [gb[0] + (gb[2] - gb[0]) * (ex > 0 ? 0.72 : 0.28), gb[1] - cach];
    else if (tu == "phai") S = [Math.max(gb[2], hb[2]) + cach, (hb[1] + hb[3]) / 2 - (Gc ? 10 : 0)];
    else S = [Math.min(gb[0], hb[0]) - cach, (hb[1] + hb[3]) / 2 - (Gc ? 10 : 0)];
    var Mt = tayMuiTen(S, E, it.day || Math.max(3.5, co / 9.5), mau, "Chú thích - mũi tên", it.huong || "ngang", it.cong);
    try { Mt.move(Gr, ElementPlacement.INSIDE); } catch (e3) { try { Mt.move(Gr, ElementPlacement.PLACEATEND); } catch (e4) {} }
  }
  return Gr;
}
// chu thich tren trang da co anh: ds = [it, ...] toa do px tren trang 1080x1440; o = { mau, co }
function chuThich(ds, o) {
  o = o || {};
  var mau = o.mau || THEME.tay_mau || "FFFFFF", out = [];
  for (var i = 0; i < ds.length; i++) out.push(chuThich1(ds[i], i, ds[i].mau || mau, o.co));
  RUN += "   chu thich ve tay: " + ds.length + " cai, font " + FTAY + "\n";
  return out;
}
// ca trang: anh that + chu thich ve tay. Goi ngay sau newDoc.
// o = { anh, tam: [x, y] 0..1 (diem giu o giua trang khi anh phu kin), thu: 1 (< 1 = thu nho anh cho rong cho chu, nen trang lay mau goc anh, mep anh mo dan),
//       cy: tam anh theo chieu doc khi thu < 1 (mac dinh giua trang), toi: 0..60 (lam toi anh), vien: true | false (vien quanh mon do, mac dinh THEME.tay_vien),
//       mau: mau chu + net (anh toi: "FFFFFF", anh sang: "1C1C1C"), co: co chu, ds: [it, ...] }
// Toa do o / toi trong ds: so <= 1 la ti le tren ANH GOC (x / rong anh, y / cao anh: nhin anh goc roi uoc), so > 1 la px tren trang.
function anhChuThich(o) {
  o = o || {};
  var doc = app.activeDocument, f = themeTimAnh(o.anh), q = [0, 0, W, H], mau = o.mau || THEME.tay_mau || "FFFFFF";
  if (f) {
    var L = placeSO(f.fsName, "Ảnh thật - chú thích");
    q = bb(L);
    var w = q[2] - q[0], h = q[3] - q[1], thu = o.thu || 1, s = Math.max(W / w, H / h) * thu * 100;
    L.resize(s, s, AnchorPosition.TOPLEFT); q = bb(L); w = q[2] - q[0]; h = q[3] - q[1];
    var tm = o.tam || [0.5, 0.5], x, y;
    if (thu >= 1) { x = Math.min(0, Math.max(W - w, W / 2 - tm[0] * w)); y = Math.min(0, Math.max(H - h, H / 2 - tm[1] * h)); }
    else { x = Math.round((W - w) / 2 + (o.lech || 0)); y = Math.round((o.cy || H / 2) - h / 2); }
    L.translate(x - q[0], y - q[1]); q = bb(L);
    try { L.rasterize(RasterizeType.ENTIRELAYER); } catch (e) {}
    if (thu < 1) {
      // nen trang = mau goc anh, mep anh mo dan vao nen (khong lo duong cat)
      var hex = "111111";
      try { var cs = doc.colorSamplers.add([Math.max(0, q[0]) + 6, Math.max(0, q[1]) + 6]); hex = cs.color.rgb.hexValue; cs.remove(); } catch (e2) {}
      var Bg = rect(0, 0, W, H, 0, hex, "Nền theo ảnh"); Bg.move(L, ElementPlacement.PLACEAFTER);
      try {
        doc.activeLayer = L;
        var m = 40, l2 = Math.max(0, q[0]) + m, t2 = Math.max(0, q[1]) + m, r2 = Math.min(W, q[2]) - m, b2 = Math.min(H, q[3]) - m;
        doc.selection.select([[l2, t2], [r2, t2], [r2, b2], [l2, b2]], SelectionType.REPLACE, 0, false);
        doc.selection.feather(m);
        var c2t = charIDToTypeID, dm = new ActionDescriptor(), rf = new ActionReference();
        dm.putClass(c2t("Nw  "), c2t("Chnl"));
        rf.putEnumerated(c2t("Chnl"), c2t("Chnl"), c2t("Msk ")); dm.putReference(c2t("At  "), rf);
        dm.putEnumerated(c2t("Usng"), c2t("UsrM"), c2t("RvlS"));
        executeAction(c2t("Mk  "), dm, DialogModes.NO);
      } catch (e3) { RUN += "   chu thich: khong mo duoc mep anh (" + e3.message + ")\n"; }
      try { doc.selection.deselect(); } catch (e4) {}
    }
    if (o.vien != null ? o.vien : THEME.tay_vien) tayVienMon(L, mau, o.day_vien || 5, o.no_vien);
    if (o.toi > 0) { var O = rect(0, 0, W, H, 0, "000000", "Lớp tối ảnh"); O.opacity = o.toi; }
  } else RUN += "   chu thich: khong thay anh " + o.anh + "\n";
  var pw = q[2] - q[0], ph = q[3] - q[1];
  function P(v) { return v ? [v[0] <= 1 ? q[0] + v[0] * pw : v[0], v[1] <= 1 ? q[1] + v[1] * ph : v[1]] : v; }
  var ds = [], src = o.ds || [];
  for (var i = 0; i < src.length; i++) { var it = {}; for (var k in src[i]) it[k] = src[i][k]; it.o = P(src[i].o); it.toi = P(src[i].toi); ds.push(it); }
  return chuThich(ds, { mau: mau, co: o.co });
}
// bia theme "Ảnh thật · Chú thích tay": "POLY STORE" nho + tieu de viet tay (t2 co 1 gach chan ve tay) + dong nho chu khong chan, anh that co chu thich ve tay.
// o = { t1, t2?, nho?, vi_tri: "tren" (mac dinh, cum tieu de sat tren) | "duoi" (sat duoi), + cac khoa cua anhChuThich (anh, thu, cy, tam, toi, vien, mau, co, ds) }
// Cum tieu de cao ~ 64 -> 64 + 0.26 * H (vi_tri "tren"): dat anh (cy) va chu thich (o) tranh vung nay.
function biaChuThich(o) {
  o = o || {};
  var mau = o.mau || THEME.tay_mau || "FFFFFF", x0 = THEME.bia_x || 72, co = o.co_tieu || THEME.bia_co || 96, ls = [], q;
  anhChuThich(o);
  var B = THEME_TEXT0("POLY STORE", F.B, 22, mau, x0, 40, { track: 200, name: "Thương hiệu" });
  q = bb(B); B.translate(x0 - q[0], 0 - q[1]); q = bb(B); ls.push(B);
  var y = q[3] + 22;
  var T1 = THEME_TEXT0(o.t1 || "", FTAY, co, mau, x0, co, { name: "Tiêu đề - dòng 1" });
  q = bb(T1); T1.translate(x0 - q[0], y - q[1]); q = bb(T1); ls.push(T1); y = q[3] + Math.round(co * 0.14);
  if (o.t2) {
    var T2 = THEME_TEXT0(o.t2, FTAY, co, mau, x0, co, { name: "Tiêu đề - dòng 2" });
    q = bb(T2); T2.translate(x0 - q[0], y - q[1]); q = bb(T2); ls.push(T2);
    var Gt = tayGach(q[0], q[2], q[3] + 10, Math.max(4, co / 15), mau, "Tiêu đề - gạch chân", true); ls.push(Gt); y = bb(Gt)[3] + 20;
  }
  if (o.nho) {
    var N = THEME_TEXT0(o.nho, F.B, THEME.bia_co_phu || 34, mau, x0, 40, { maxW: W - 2 * x0, name: "Dòng nhỏ dưới tiêu đề" });
    q = bb(N); N.translate(x0 - q[0], y - q[1]); ls.push(N); y = bb(N)[3];
  }
  var dy = o.vi_tri == "duoi" ? H - 64 - y : 64;
  for (var i = 0; i < ls.length; i++) ls[i].translate(0, dy);
  RUN += "   bia chu thich: tieu de " + (64) + "-" + Math.round(y + dy) + "\n";
  return ls;
}

// ---------- nen + gach chan tieu de trang trong (fen 14/11 17h54 "phan theme nay nen tron qua xau") ----------
// Nen "phong chup": quang sang mo (THEME.toa, ve trong themeNen goc) nhu phong xam trong anh mau + hat giay nhe (THEME.hat_nen = do hat, hat_op = do dam).
var TAY_NEN0 = themeNen;
themeNen = function () {
  TAY_NEN0();
  if (THEME.hat_nen) {
    var G = rect(0, 0, W, H, 0, "808080", "Hạt nền");
    themeHat(G, THEME.hat_nen);
    G.blendMode = BlendMode.OVERLAY; G.opacity = THEME.hat_op || 40;
  }
};
// tieu de trang noi dung (headC) co 1 gach chan ve tay o giua, nhu gach gia o bia. Sat phu de qua thi bo.
var TAY_HEADC0 = headC;
headC = function (n, bg, pillTxt, t, sub, op, blur) {
  var d = TAY_HEADC0(n, bg, pillTxt, t, sub, op, blur);
  if (THEME.tay_gach_tieu === false) return d;
  try {
    var T = d.artLayers.getByName("Tiêu đề"), q = bb(T), y = q[3] + 12, S = null;
    try { S = d.artLayers.getByName("Phụ đề"); } catch (e) {}
    if (S) { var qs = bb(S), gap = qs[1] - q[3]; if (gap < 44) S.translate(0, Math.min(30, 44 - gap)); }   // day phu de xuong cho gach chan (than bai bat dau tu 450)
    var w = q[2] - q[0]; tayGach(q[0] + w * 0.1, q[2] - w * 0.1, y, 5, THEME.tay_mau || "FFFFFF", "Tiêu đề - gạch chân", true);
  } catch (e2) { RUN += "   gach chan tieu de: " + e2.message + "\n"; }
  return d;
};
