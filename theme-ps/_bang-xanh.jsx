
// ---------- theme "Bảng xanh · Giấy xé" (fen 14/11 gui the san pham "iPad Pro M1 - 11inch / iPad Air5 - 10.9inch / Pencil 2 Full box: 1400K" + "theme này nữa nha") ----------
// tao.py noi file nay vao theme co "them": ["_bang-xanh.jsx"]. Anh ve san bang theme-ps/bang-xanh-tao-anh.py (PIL) trong theme-ps/<id>/anh:
// nen bang xanh ke o + khung trang mong (2 ban lech o), dai giay xe trang, nhan co trang (vet son), bang ron trang 2 duoi chu V.
// Phang: khong bong, khong phat sang. Bia biaBang = the san pham nhu anh mau; trang trong: tieu de nam tren dai giay xe, nhan thanh tab xanh dam.
var BX_DIR = (typeof THEME_DIR != "undefined" ? THEME_DIR : "") + "/anh/";
var BX_XANH = THEME.bx_chu || "1F5A3A", BX_TAB = THEME.bx_tab || "15432A", BX_VANG = THEME.bx_vang || THEME.vang || "F2D13B", BX_DEN = THEME.bx_den || "1B1B1B";
var BX_NEN = THEME.bx_nen || ["nen-1.jpg", "nen-2.jpg"];
var FRB = pick((THEME.font_ruy_bang || []).concat([F.T]));     // chu tren bang ron (anh mau: chu co chan dam)
function bxAnh(ten, name) {
  var f = new File(BX_DIR + ten);
  if (!f.exists) { RUN += "   bang xanh: thieu anh " + ten + "\n"; return null; }
  return placeSO(f.fsName, name || ten);
}
// keo anh cho vua dung khung (l, t, r, b), khong giu ti le (giay xe / bang ron dai ra theo chu)
function bxKeo(ten, l, t, r, b, name) {
  var L = bxAnh(ten, name);
  if (!L) return null;
  var q = bb(L);
  L.resize((r - l) / (q[2] - q[0]) * 100, (b - t) / (q[3] - q[1]) * 100, AnchorPosition.TOPLEFT);
  q = bb(L); L.translate(l - q[0], t - q[1]);
  return L;
}
function bxVua(T, maxW) {
  var q = bb(T), w = q[2] - q[0];
  if (w > maxW) { try { T.textItem.size = new UnitValue(Math.floor(T.textItem.size.as("px") * maxW / w), "px"); } catch (e) { T.resize(maxW / w * 100, maxW / w * 100, AnchorPosition.TOPLEFT); } }
  return T;
}
function bxGiua(L, cx, cy) { var q = bb(L); L.translate(cx - (q[0] + q[2]) / 2, cy - (q[1] + q[3]) / 2); return L; }
// tab xanh dam chu trang (nhu nhan nho tren dai giay trong anh mau)
function bxTab(str, cx, cy, name) {
  var T = THEME_TEXT0(str, F.B, 24, "FFFFFF", cx, cy + 9, { align: Justification.CENTER, track: 160, name: (name || "Tab") + " - chữ" });
  var q = bb(T), w = q[2] - q[0];
  T.translate(cx - (q[0] + q[2]) / 2, 0);
  var R = rect(Math.round(cx - w / 2 - 30), cy - 26, Math.round(cx + w / 2 + 30), cy + 26, 8, BX_TAB, name || "Tab");
  R.move(T, ElementPlacement.PLACEAFTER);
  return [R, T];
}
function bxNhom(ls, ten) {
  var G = app.activeDocument.layerSets.add(); G.name = ten;
  for (var i = 0; i < ls.length; i++) if (ls[i]) { try { ls[i].move(G, ElementPlacement.INSIDE); } catch (e) { try { ls[i].move(G, ElementPlacement.PLACEATEND); } catch (e2) {} } }
  return G;
}

// ---------- nen moi trang: anh bang xanh (2 ban xen ke) ----------
var BX_NEN0 = themeNen;
themeNen = function () {
  BX_NEN0();
  if (BX_NEN.length) bxKeo(BX_NEN[THEME_N % 2 ? 0 : 1] || BX_NEN[0], 0, 0, W, H, "Nền bảng xanh");
};

// ---------- trang noi dung: tieu de xanh tren dai giay xe, nhan (pill) thanh tab xanh dam gai len mep tren giay ----------
var BX_TEXT0 = text;
text = function (str, font, size, h, x, y, o) {
  if (o && o.name == "Tiêu đề" && h == C.WHITE) h = BX_XANH;
  return BX_TEXT0(str, font, size, h, x, y, o);
};
var BX_RECT0 = rect;
rect = function (l, t, r, b, rad, hex, name) {
  if (name == "Nhãn") rad = Math.min(rad, 8);          // nhan bo goc nho thanh tab (mau theo "pill" cua theme)
  return BX_RECT0(l, t, r, b, rad, hex, name);
};
// headC chỉ có ở bộ iPad (ipad/poly-lib.jsx): bài laptop (code/build.py) không có thì bỏ qua (24/11: bài laptop theme này lỗi "headC is undefined")
if (typeof headC == "function") {
  var BX_HEADC0 = headC;
  headC = function (n, bg, pillTxt, t, sub, op, blur) {
    var d = BX_HEADC0(n, bg, pillTxt, t, sub, op, blur);
    try {
      var T = d.artLayers.getByName("Tiêu đề"), q = bb(T), top = q[1] - 44, bot = q[3] + 30;
      var P = bxKeo(THEME_N % 2 ? "giay-xe.png" : "giay-xe-2.png", -24, top, W + 24, bot, "Giấy xé");
      if (P) { try { P.move(d.artLayers.getByName("Thương hiệu"), ElementPlacement.PLACEBEFORE); } catch (e) {} }
      // tab: tam o mep tren giay
      var ls = [];
      try { ls.push(d.artLayers.getByName("Nhãn")); ls.push(d.artLayers.getByName("Nhãn - chữ")); } catch (e) {}
      if (ls.length == 2) { var qn = bb(ls[0]), dy = top + 4 - (qn[1] + qn[3]) / 2; ls[0].translate(0, dy); ls[1].translate(0, dy); }
      // phu de trang ngay duoi giay
      var S = null;
      try { S = d.artLayers.getByName("Phụ đề"); } catch (e) {}
      if (S) { var qs = bb(S), can = bot + 20 - qs[1]; if (can > 0) S.translate(0, can); }
    } catch (e2) { RUN += "   bang xanh: tieu de giay xe loi (" + e2.message + ")\n"; }
    return d;
  };
}

// ---------- bia (nhu the san pham trong anh mau) ----------
// o = { tab: "POLY STORE", ten: "iPad Pro M1 - 11inch" (chu xanh tren giay xe), anh: "ảnh máy nền trong.png",
//       nhan: "128GB · 13.990K" (chu den tren nhan co trang), km: "MUA IPAD - *SĂN APPLE PENCIL GIÁ CỰC SỐC*" (*...* = chu vang),
//       ruy: "Pencil 2 Full box: 1400K" (chu den tren bang ron trang) }  - bo trong o nao thi khong ve o do, anh may gian ra
function biaBang(o) {
  o = o || {};
  var doc = app.activeDocument, cx = W / 2, q, ls = [];
  // giay xe + ten may
  var pt = 132, pb = 322;
  ls.push(bxKeo("giay-xe.png", -24, pt, W + 24, pb, "Giấy xé"));
  var T = THEME_TEXT0(o.ten || "iPad Pro M1 - 11inch", F.T, o.co || 96, BX_XANH, cx, 0, { align: Justification.CENTER, name: "Tên máy" });
  bxVua(T, W - 170); bxGiua(T, cx, (pt + pb) / 2 + 4); ls.push(T);
  if (o.tab !== "") ls = ls.concat(bxTab(o.tab || "POLY STORE", cx, pt + 2, "Tab"));
  bxNhom(ls, "Đầu - giấy xé");
  // tu duoi len: bang ron, dong khuyen mai, nhan co
  var y = H - 62, yAnh = H - 70;
  if (o.ruy) {
    var R = bxKeo("ruy-bang.png", 40, y - 150, W - 40, y, "Băng rôn");
    var Rt = THEME_TEXT0(o.ruy, FRB, o.co_ruy || 62, BX_DEN, cx, 0, { align: Justification.CENTER, name: "Băng rôn - chữ" });
    bxVua(Rt, W - 300); bxGiua(Rt, cx, y - 150 + 150 * 0.44);
    bxNhom([R, Rt], "Băng rôn");
    y -= 172; yAnh = y;
  }
  if (o.km) {
    // "MUA IPAD - *SĂN APPLE PENCIL GIÁ CỰC SỐC*": doan le chu trang, doan chan (trong *...*) chu vang, noi lien 1 dong, can giua
    var p = String(o.km).split("*"), ks = [], cach = [], ckm = o.co_km || 34;
    for (var i = 0; i < p.length; i++) if (p[i].replace(/\s/g, "")) {
      ks.push(THEME_TEXT0(p[i].replace(/^\s+|\s+$/g, ""), F.B, ckm, i % 2 ? BX_VANG : "FFFFFF", 0, y, { name: "Khuyến mãi " + (ks.length + 1) }));
      cach.push(/\s$/.test(p[i]) || /^\s/.test(p[i + 1] || "") ? 0.3 : 0);
    }
    var xep = function () { var x = 0; for (var j = 0; j < ks.length; j++) { var qq = bb(ks[j]); ks[j].translate(x - qq[0], 0); qq = bb(ks[j]); x = qq[2] + cach[j] * ckm; } return x; };
    if (ks.length) {
      var w = xep();
      if (w > W - 140) { var k = (W - 140) / w; for (var j = 0; j < ks.length; j++) ks[j].resize(k * 100, k * 100, AnchorPosition.BOTTOMLEFT); ckm = ckm * k; w = xep(); }
      for (var j3 = 0; j3 < ks.length; j3++) ks[j3].translate(cx - w / 2, 0);
      bxNhom(ks, "Dòng khuyến mãi");
    }
    y -= 62; yAnh = y;
  }
  if (o.nhan) {
    var Nt = THEME_TEXT0(o.nhan, F.B, o.co_nhan || 34, BX_DEN, cx, 0, { align: Justification.CENTER, name: "Nhãn cọ - chữ" });
    q = bb(Nt); var nw = Math.max(420, q[2] - q[0] + 170);
    var N = bxKeo("co-trang.png", cx - nw / 2, y - 100, cx + nw / 2, y - 4, "Nhãn cọ");
    bxGiua(Nt, cx, y - 52); Nt.move(N, ElementPlacement.PLACEBEFORE);
    bxNhom([N, Nt], "Nhãn cọ");
    yAnh = y - 110;
  }
  // anh may o giua
  if (o.anh) {
    var f = themeTimAnh(o.anh);
    if (f) { var A1 = placeSO(f.fsName, "Ảnh máy"); fitBox(A1, 130, pb + 26, W - 130, yAnh - 14); }
    else RUN += "   bang xanh: khong thay anh may " + o.anh + "\n";
  }
  RUN += "   bia bang xanh: " + (o.ten || "-") + ", anh " + (o.anh || "-") + "\n";
}
