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
function themeNen() {
  THEME_N++;
  rect(0, 0, W, H, 0, THEME.nen, "Nền phẳng - " + THEME.ten);
  var k = THEME_N % 2, tt = THEME.trang_tri || "tron";
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
// nen anh mo cua thu vien -> bo (nen phang da ve luc tao trang)
bgPhoto = function () {};
background = function () {};
// the kinh mo -> the phang dac
glass = function (l, t, r, b, rad, name) { return rect(l, t, r, b, rad, THEME.the, name || "Thẻ"); };
