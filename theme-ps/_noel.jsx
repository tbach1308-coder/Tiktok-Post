
// _noel.jsx: theme "Noel · Poly Christmas" (fen 14/11 17h59 gui banner POLY CHRISTMAS "theme style nay", chon "Theme Photoshop Noel moi").
// tao.py noi file nay vao theme co "them": ["_noel.jsx"]. Anh trang tri ve san bang theme-ps/<id>/tao_anh.py (PIL) trong theme-ps/<id>/anh:
// nen thong (2 ban xen ke), chau do / xanh / trang, keo gay, day den, tuyet day, phieu uu dai vien thu may bay, tem rang cua, dau buu dien,
// soc cheo de lot chu (soc-trang tren chu do, soc-xanh tren chu trang). Banner la mau rieng cua shop nen theme nay duoc trang tri nhieu
// hon luat "khong sen" chung, nhung van phang: khong bong mo, khong phat sang; chi 1 bong cung xanh dam lech 5px duoi tieu de nhu banner.
var NOEL_DIR = (typeof THEME_DIR != "undefined" ? THEME_DIR : "") + "/anh/";
var FSC = pick((THEME.font_script || []).concat([F.B]));      // chu viet tay tren phieu ("Mua iPad giảm", "— Poly Store")
var NOEL_DO = THEME.do || "E23B32", NOEL_XANH = THEME.noel_xanh || "1F5A3A", NOEL_BONG = THEME.noel_bong || "0A1E14";
// 14/11 21h: fen "thêm theme christmas" -> 4 theme Noel khac mau (Do nhung, Trang tuyet, Anh that, Dem xanh) dung chung file nay, khac nhau o khoa theme:
// noel_nen [anh nen le, chan] ([] = theme anh that: nen la anh cua bai), noel_t1 / noel_t2 [mau, anh soc] 2 dong tieu de bia, noel_soc_tieu soc tieu de trang trong,
// noel_chu mau chu chinh tren nen (bia + theme nen sang), noel_nhan mau chu *nhan* dong dam, noel_uu mau dong uu dai, noel_chau [[chau trang le], [chau trang chan]],
// noel_chau_bia [3 chau canh dong dam bia], noel_tuyet anh tuyet day, noel_keo (keo gay), noel_day mau day treo, noel_sang (nen sang: chu tieu de / phu de / thuong hieu / khung y doi mau)
var NOEL_NEN = THEME.noel_nen || ["nen-1.jpg", "nen-2.jpg"], NOEL_T1 = THEME.noel_t1 || [NOEL_DO, "soc-trang.png"], NOEL_T2 = THEME.noel_t2 || ["FFFFFF", "soc-xanh.png"];
var NOEL_SOC_TIEU = THEME.noel_soc_tieu || "soc-xanh.png", NOEL_CHU = THEME.noel_chu || "FFFFFF", NOEL_NHAN = THEME.noel_nhan || NOEL_DO, NOEL_UU = THEME.noel_uu || THEME.vang || "F5C542";
var NOEL_CHAU = THEME.noel_chau || [["chau-trang.png", "chau-do.png"], ["chau-xanh.png", "chau-do.png"]], NOEL_CHAU_BIA = THEME.noel_chau_bia || ["chau-do.png", "chau-trang.png", "chau-xanh.png"];
var NOEL_TUYET = THEME.noel_tuyet || "tuyet.png", NOEL_KEO = THEME.noel_keo !== false, NOEL_DAY = THEME.noel_day || "C9A24A";
function noelAnh(ten, name) {
  var f = new File(NOEL_DIR + ten);
  if (!f.exists) { RUN += "   noel: thieu anh " + ten + "\n"; return null; }
  return placeSO(f.fsName, name || ten);
}
// dat 1 anh trang tri: rong w, tam (cx, cy), xoay goc (do, duong = theo chieu kim dong ho)
function noelDat(ten, cx, cy, w, goc, name) {
  var L = noelAnh(ten, name);
  if (!L) return null;
  var q = bb(L), s = w / (q[2] - q[0]) * 100;
  L.resize(s, s, AnchorPosition.MIDDLECENTER);
  if (goc) L.rotate(goc, AnchorPosition.MIDDLECENTER);
  q = bb(L); L.translate(cx - (q[0] + q[2]) / 2, cy - (q[1] + q[3]) / 2);
  return L;
}
// chau treo: day mong tu mep tren xuong nap chau
function noelChau(ten, cx, cy, w, name, khongTreo) {
  var L = noelDat(ten, cx, cy, w, 0, name);
  if (L && !khongTreo && THEME.noel_day_treo !== false) {
    var q = bb(L), D = rect(Math.round(cx) - 1, 0, Math.round(cx) + 1, q[1] + 4, 0, NOEL_DAY, (name || "Châu") + " - dây treo");
    D.move(L, ElementPlacement.PLACEAFTER);
  }
  return L;
}
// chu co de cho vua rong
function noelVua(T, maxW) {
  var q = bb(T), w = q[2] - q[0];
  if (w > maxW) { try { T.textItem.size = new UnitValue(Math.floor(T.textItem.size.as("px") * maxW / w), "px"); } catch (e) { T.resize(maxW / w * 100, maxW / w * 100, AnchorPosition.TOPLEFT); } }
  return T;
}
// chu soc keo (nhu "POLY" do soc hong, "CHRISTMAS" trang soc xanh nhat trong banner): soc cheo cat theo chu + bong cung xanh dam lech nhe
function noelSoc(T, soc, lech) {
  var doc = app.activeDocument;
  try {
    if (lech !== 0) {
      var D = T.duplicate();
      D.textItem.color = col(NOEL_BONG);
      D.move(T, ElementPlacement.PLACEAFTER);
      D.translate(lech || 5, lech || 5);
      D.name = T.name + " - bóng";
    }
    doc.activeLayer = T;
    var q = bb(T), S = noelAnh(soc, T.name + " - sọc");
    if (!S) return T;
    var qs = bb(S), k = Math.max((q[2] - q[0] + 60) / (qs[2] - qs[0]), (q[3] - q[1] + 40) / (qs[3] - qs[1]), 0.35) * 100;
    S.resize(k, k, AnchorPosition.MIDDLECENTER); qs = bb(S);
    S.translate((q[0] + q[2]) / 2 - (qs[0] + qs[2]) / 2, (q[1] + q[3]) / 2 - (qs[1] + qs[3]) / 2);
    S.grouped = true;
  } catch (e) { RUN += "   noel: soc chu loi (" + e.message + ")\n"; }
  return T;
}
// 3 vach do toa ra canh tieu de (nhu banner)
function noelVach(x, cy, huong, name) {
  var ps = [], h = huong || 1;
  for (var i = -1; i <= 1; i++) {
    var g = i * 26 * Math.PI / 180, x1 = x, y1 = cy + i * 16, x2 = x + h * Math.cos(g) * 38, y2 = y1 + Math.sin(g) * 38;
    var dx = x2 - x1, dy = y2 - y1, d = Math.sqrt(dx * dx + dy * dy), nx = -dy / d * 3.5, ny = dx / d * 3.5;
    ps.push([[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]);
  }
  var doc = app.activeDocument, L = doc.artLayers.add(); L.name = name || "Vạch đỏ";
  for (var j = 0; j < ps.length; j++) doc.selection.select(ps[j], j ? SelectionType.EXTEND : SelectionType.REPLACE, 0, true);
  doc.selection.fill(col(NOEL_DO)); doc.selection.deselect();
  return L;
}
// gom cac lop vao 1 nhom
function noelNhom(ls, ten) {
  var G = app.activeDocument.layerSets.add(); G.name = ten;
  for (var i = 0; i < ls.length; i++) if (ls[i]) { try { ls[i].move(G, ElementPlacement.INSIDE); } catch (e) { try { ls[i].move(G, ElementPlacement.PLACEATEND); } catch (e2) {} } }
  return G;
}

// ---------- nen moi trang: anh nen (2 ban xen ke) + chau goc phai tren + keo gay goc trai duoi + tuyet day ----------
// theme anh that (noel_nen []): nen phang cua theme, bgPhoto ve anh cua bai roi ve lai chau + tuyet len tren anh
function noelTrangTri(lai) {
  var doc = app.activeDocument;
  if (lai) {
    try { doc.layerSets.getByName("Trang trí Noel").remove(); } catch (e) {}
    try { doc.artLayers.getByName("Tuyết đáy").remove(); } catch (e2) {}
  }
  var ls = [], c = NOEL_CHAU[THEME_N % 2 ? 0 : 1] || NOEL_CHAU[0];
  if (THEME_N % 2) {
    if (c[0]) ls.push(noelChau(c[0], W - 212, 112, 78, "Châu 1"));
    if (c[1]) ls.push(noelChau(c[1], W - 112, 168, 116, "Châu 2"));
  } else {
    if (c[0]) ls.push(noelChau(c[0], W - 200, 136, 92, "Châu 1"));
    if (c[1]) ls.push(noelChau(c[1], W - 96, 104, 84, "Châu 2"));
  }
  if (NOEL_KEO) ls.push(noelDat("keo-gay.png", 64, H - 230, 74, -14, "Kẹo gậy"));
  noelNhom(ls, "Trang trí Noel");
  noelDat(NOEL_TUYET, W / 2, H - 95, W + 8, 0, "Tuyết đáy");
}
var NOEL_NEN0 = themeNen;
themeNen = function () {
  NOEL_NEN0();
  if (NOEL_NEN.length) {
    var L = noelAnh(NOEL_NEN[THEME_N % 2 ? 0 : 1] || NOEL_NEN[0], "Nền Noel");
    if (L) { var q = bb(L); L.resize(W / (q[2] - q[0]) * 100, H / (q[3] - q[1]) * 100, AnchorPosition.TOPLEFT); q = bb(L); L.translate(-q[0], -q[1]); }
  }
  noelTrangTri(false);
};
if (THEME.nen_kieu == "kinh") {
  var NOEL_BG0 = bgPhoto;
  bgPhoto = function () {
    var r = NOEL_BG0.apply(this, arguments);
    if (arguments[0]) noelTrangTri(true);          // co anh: chau + tuyet ve lai len tren anh mo
    return r;
  };
}
// nen sang (Trang tuyet): chu trang nam tren nen trang doi sang mau chu theme; khung y (lib: trang trong 10%) thanh the dac mau theme
if (THEME.noel_sang) {
  var NOEL_TEXT0 = text;
  text = function (str, font, size, h, x, y, o) {
    var nm = o && o.name;
    if (h == C.WHITE && (nm == "Thương hiệu" || nm == "Tiêu đề" || nm == "Phụ đề")) h = NOEL_CHU;
    return NOEL_TEXT0(str, font, size, h, x, y, o);
  };
  var NOEL_RECT0 = rect, NOEL_KHUNG = null;
  rect = function (l, t, r, b, rad, hex, name) {
    var khung = name == "Khung ý" && hex == C.WHITE, chip = hex == C.BLACK && /Chip xem tiếp - nền$/.test(name || "");
    var L = NOEL_RECT0(l, t, r, b, rad, khung || chip ? (THEME.noel_khung || THEME.the) : hex, name);
    if (khung) NOEL_KHUNG = L;
    return L;
  };
  // chip "Xem tiep" (lib: den trong 50% -> xam duc tren nen sang): dac mau theme
  if (typeof hook == "function") {
    var NOEL_HOOK0 = hook;
    hook = function (label) {
      var r = NOEL_HOOK0(label);
      try { app.activeDocument.artLayers.getByName("Chip xem tiếp - nền").fillOpacity = 100; } catch (e) {}
      return r;
    };
  }
  if (typeof liGroup == "function") {        // liGroup chỉ có ở bộ iPad
    var NOEL_LI0 = liGroup;
    liGroup = function (items, top, name) {
      NOEL_KHUNG = null;
      var r = NOEL_LI0(items, top, name);
      if (NOEL_KHUNG) { try { NOEL_KHUNG.fillOpacity = 100; } catch (e) {} }
      return r;
    };
  }
}

// ---------- trang noi dung: tieu de trang soc xanh nhat + bong cung (nhu chu CHRISTMAS) ----------
// headC chỉ có ở bộ iPad (ipad/poly-lib.jsx): bài laptop (code/build.py) không có thì bỏ qua (24/11: bài laptop theme này lỗi "headC is undefined")
if (typeof headC == "function") {
  var NOEL_HEADC0 = headC;
  headC = function (n, bg, pillTxt, t, sub, op, blur) {
    var d = NOEL_HEADC0(n, bg, pillTxt, t, sub, op, blur);
    try { noelSoc(d.artLayers.getByName("Tiêu đề"), NOEL_SOC_TIEU, 4); } catch (e) { RUN += "   noel: tieu de soc loi (" + e.message + ")\n"; }
    return d;
  };
}

// ---------- phieu uu dai (nhu thiep trong banner): giay kem vien thu may bay, chu viet tay, gia do, tem, dau buu dien, "— Poly Store" ----------
// p = { chu: "Mua iPad giảm", gia: "200K", tem: "HSSV", mau: "xanh" | "do" }
function noelPhieu(p, l, t, w) {
  var k = w / 466, h = Math.round(w * 280 / 480), ls = [];
  var P = noelAnh("phieu.png", "Phiếu - " + (p.chu || p.gia || ""));
  if (!P) return ls;
  var q = bb(P), s = w / (q[2] - q[0]) * 100;
  P.resize(s, s, AnchorPosition.TOPLEFT); q = bb(P); P.translate(l - q[0], t - q[1]); ls.push(P);
  if (p.chu) ls.push(THEME_TEXT0(p.chu, FSC, Math.round(30 * k), NOEL_XANH, Math.round(l + 36 * k), Math.round(t + 66 * k), { name: "Phiếu - chữ" }));
  if (p.gia) { var G = THEME_TEXT0(p.gia, F.T, Math.round(84 * k), NOEL_DO, Math.round(l + 32 * k), Math.round(t + 160 * k), { name: "Phiếu - giá" }); noelVua(G, w * 0.6); ls.push(G); }
  // tem goc phai tren
  var tw = Math.round(90 * k), tx = l + w - Math.round(34 * k) - tw, ty = t + Math.round(30 * k);
  var Tm = noelAnh(p.mau == "do" ? "tem-do.png" : "tem-xanh.png", "Phiếu - tem");
  if (Tm) {
    var qt = bb(Tm), st = tw / (qt[2] - qt[0]) * 100; Tm.resize(st, st, AnchorPosition.TOPLEFT); qt = bb(Tm); Tm.translate(tx - qt[0], ty - qt[1]); qt = bb(Tm); ls.push(Tm);
    var cx = (qt[0] + qt[2]) / 2, cy = (qt[1] + qt[3]) / 2;
    var U = THEME_TEXT0("ƯU ĐÃI", F.B, Math.round(13 * k), "FFFFFF", cx, cy - 14 * k, { align: Justification.CENTER, name: "Phiếu - tem chữ" }); ls.push(U);
    var V = THEME_TEXT0(p.tem || "HSSV", F.B, Math.round(25 * k), "FFFFFF", cx, cy + 16 * k, { align: Justification.CENTER, name: "Phiếu - tem" }); noelVua(V, tw - 22 * k); ls.push(V);
    var qv = bb(V); V.translate(cx - (qv[0] + qv[2]) / 2, 0);
  }
  // dau buu dien "NOEL <nam>" goc phai duoi
  var dx = l + w - Math.round(96 * k), dy = t + h - Math.round(82 * k), Dg = noelDat("dau-buu-dien.png", dx, dy, Math.round(92 * k), 0, "Phiếu - dấu");
  if (Dg) {
    ls.push(Dg);
    ls.push(THEME_TEXT0("NOEL", F.B, Math.round(14 * k), "7E857F", dx, dy - 2 * k, { align: Justification.CENTER, name: "Phiếu - dấu chữ" }));
    ls.push(THEME_TEXT0(String(p.nam || THEME.noel_nam || new Date().getFullYear()), F.B, Math.round(14 * k), "7E857F", dx, dy + 16 * k, { align: Justification.CENTER, name: "Phiếu - dấu năm" }));
  }
  ls.push(rect(Math.round(l + 36 * k), Math.round(t + h - 78 * k), Math.round(l + w * 0.6), Math.round(t + h - 76 * k), 0, "CDBFA8", "Phiếu - kẻ"));
  ls.push(THEME_TEXT0("— Poly Store", FSC, Math.round(24 * k), NOEL_XANH, Math.round(l + 36 * k), Math.round(t + h - 40 * k), { name: "Phiếu - ký" }));
  noelNhom(ls, "Phiếu " + (p.gia || ""));
  return ls;
}

// ---------- bia (nhu banner POLY CHRISTMAS): tieu de 2 dong soc keo, dong dam co chu do, dong uu dai vang, phieu, anh may, chau, den, keo ----------
// o = { t1: "POLY" (do soc hong), t2: "CHRISTMAS" (trang soc xanh), nho: "NOEL *LÊN ĐỜI*\rMÁY XỊN" (*...* = chu do), uu_dai: "ƯU ĐÃI HỌC SINH · SINH VIÊN",
//       phieu: [{chu, gia, tem, mau}] (0-2 phieu), anh: "ảnh máy nền trong.png", chan: "dòng địa chỉ / hotline trên tuyết" (mặc định THEME.noel_chan) }
function biaNoel(o) {
  o = o || {};
  var doc = app.activeDocument, x0 = THEME.bia_x || 60, co = o.co || THEME.bia_co || 150, q, y = 60;
  try { doc.layerSets.getByName("Trang trí Noel").remove(); } catch (e) {}
  // tieu de
  var T1 = THEME_TEXT0(o.t1 || "POLY", F.T, co, NOEL_T1[0], x0, co, { name: "Tiêu đề - dòng 1" });
  noelVua(T1, W - 2 * x0 - 120); q = bb(T1); T1.translate(x0 - q[0], y - q[1]); q = bb(T1);
  noelSoc(T1, NOEL_T1[1]);
  noelVach(q[2] + 30, (q[1] + q[3]) / 2, 1, "Vạch đỏ cạnh tiêu đề");
  y = q[3] + Math.round(co * 0.1);
  if (o.t2 !== "") {
    var T2 = THEME_TEXT0(o.t2 || "CHRISTMAS", F.T, co, NOEL_T2[0], x0, co, { name: "Tiêu đề - dòng 2" });
    noelVua(T2, W - 2 * x0 - 10); q = bb(T2); T2.translate(x0 - q[0], y - q[1]); q = bb(T2);
    noelSoc(T2, NOEL_T2[1]);
    y = q[3];
  }
  y += 40;
  // dong dam: *...* do
  var cn = THEME.bia_co_phu || 64, lead = Math.round(cn * 1.16), dong = String(o.nho || "").split("\r"), yN = y;
  for (var i = 0; i < dong.length && o.nho; i++) {
    var x = x0, phan = dong[i].split("*"), base = y + cn;
    for (var j = 0; j < phan.length; j++) {
      if (!phan[j]) continue;
      var Tn = THEME_TEXT0(phan[j], THEME.font_bia_phu ? pick(THEME.font_bia_phu.concat([F.B])) : F.B, cn, j % 2 ? NOEL_NHAN : NOEL_CHU, x, base, { name: "Dòng đậm " + (i + 1) });
      var qn = bb(Tn); if (j == 0 && i == 0) Tn.translate(x0 - qn[0], 0);
      x = bb(Tn)[2] + (/\s$/.test(phan[j]) || /^\s/.test(phan[j + 1] || "") ? Math.round(cn * 0.26) : 0);
    }
    y += lead;
  }
  if (o.nho) y += 18;
  // dong uu dai vang + gach
  if (o.uu_dai) {
    var Uu = THEME_TEXT0(o.uu_dai, F.B, 28, NOEL_UU, x0, y + 28, { track: 60, name: "Dòng ưu đãi" });
    q = bb(Uu); Uu.translate(x0 - q[0], 0); q = bb(Uu);
    rect(q[2] + 20, Math.round((q[1] + q[3]) / 2) - 1, Math.min(W - x0, q[2] + 220), Math.round((q[1] + q[3]) / 2) + 2, 0, NOEL_UU, "Gạch ưu đãi");
    y = q[3] + 26;
  }
  // chau canh dong dam (ben phai)
  noelChau(NOEL_CHAU_BIA[0], W - 132, yN + 28, 112, "Châu 1", true);       // bia: chau nam, khong day treo (day cat ngang tieu de)
  noelChau(NOEL_CHAU_BIA[1], W - 236, yN - 4, 74, "Châu 2", true);
  noelChau(NOEL_CHAU_BIA[2], W - 52, yN + 88, 84, "Châu 3", true);
  // phieu
  var ps = o.phieu || [];
  if (ps.length) {
    var n = Math.min(2, ps.length), gap = 24, pw = n == 1 ? 520 : Math.floor((W - 2 * x0 + 10 - gap) / 2), ph = Math.round(pw * 280 / 480);
    for (var k = 0; k < n; k++) noelPhieu(ps[k], x0 - 5 + k * (pw + gap), y, pw);
    y += ph + 22;
  }
  // day den + keo gay tren tuyet, anh may dat len tren
  noelDat("day-den.png", 300, H - 168, 620, -3, "Dây đèn");
  if (NOEL_KEO) noelDat("keo-gay.png", W - 74, H - 250, 86, 14, "Kẹo gậy");
  if (o.anh) {
    var f = themeTimAnh(o.anh);
    if (f) { var A1 = placeSO(f.fsName, "Ảnh máy"); fitBox(A1, 150, y + 6, W - 150, H - 112); }
    else RUN += "   noel: khong thay anh may " + o.anh + "\n";
  }
  var chan = o.chan != null ? o.chan : THEME.noel_chan;
  if (chan) {
    var C = THEME_TEXT0(chan, F.B, 24, THEME.noel_xanh_dam || "16402B", W / 2, H - 30, { align: Justification.CENTER, maxW: W - 80, name: "Địa chỉ / hotline" });
    q = bb(C); C.translate(W / 2 - (q[0] + q[2]) / 2, 0);
  }
  RUN += "   bia noel: phieu " + ps.length + ", anh " + (o.anh || "-") + "\n";
}

// ---------- bia theme anh that (Noel · Ảnh thật): anh that phu kin + day toi duoi, day den vat ngang tren, chau treo 2 goc, tuyet day,
// cum chu o duoi (tieu de 2 dong soc keo, dong dam *nhan*, dong uu dai) xep tu duoi len tren tuyet ----------
// o = { anh, tam: [x, y], toi: 0..60, t1, t2, nho, uu_dai, chan }
function biaNoelAnh(o) {
  o = o || {};
  var doc = app.activeDocument, x0 = THEME.bia_x || 60, co = o.co || THEME.bia_co || 140, q;
  try { doc.layerSets.getByName("Trang trí Noel").remove(); } catch (e) {}
  try { doc.artLayers.getByName("Tuyết đáy").remove(); } catch (e2) {}
  if (o.anh) themeAnhPhu({ anh: o.anh, tam: o.tam, toi: o.toi != null ? o.toi : 18 });
  themeDayToi(THEME.bia_day ? THEME.bia_day[0] : 820, THEME.bia_day ? THEME.bia_day[1] : 88);
  // trang tri: day den tren cung (2 doan), chau treo goc trai + phai, tuyet day
  noelDat("day-den.png", 300, 46, 640, 2, "Dây đèn trái");
  noelDat("day-den.png", W - 300, 40, 640, -3, "Dây đèn phải");
  var cb = NOEL_CHAU_BIA;
  noelChau(cb[0], W - 118, 236, 104, "Châu 1");
  noelChau(cb[1], W - 228, 176, 70, "Châu 2");
  noelChau(cb[2], 96, 206, 80, "Châu 3");
  noelDat(NOEL_TUYET, W / 2, H - 95, W + 8, 0, "Tuyết đáy");
  if (NOEL_KEO) noelDat("keo-gay.png", W - 70, H - 236, 80, 14, "Kẹo gậy");
  // chu tu duoi len
  var y = H - 158;
  if (o.uu_dai) {
    var Uu = THEME_TEXT0(o.uu_dai, F.B, 28, NOEL_UU, x0, y, { track: 60, name: "Dòng ưu đãi" });
    q = bb(Uu); Uu.translate(x0 - q[0], 0); q = bb(Uu);
    rect(q[2] + 20, Math.round((q[1] + q[3]) / 2) - 1, Math.min(W - x0, q[2] + 200), Math.round((q[1] + q[3]) / 2) + 2, 0, NOEL_UU, "Gạch ưu đãi");
    y = q[1] - 34;
  }
  var cn = THEME.bia_co_phu || 60, lead = Math.round(cn * 1.16), dong = o.nho ? String(o.nho).split("\r") : [];
  for (var i = dong.length - 1; i >= 0; i--) {
    var x = x0, phan = dong[i].split("*"), first = true;
    for (var j = 0; j < phan.length; j++) {
      if (!phan[j]) continue;
      var Tn = THEME_TEXT0(phan[j], F.B, cn, j % 2 ? NOEL_NHAN : NOEL_CHU, x, y, { name: "Dòng đậm " + (i + 1) });
      if (first) { var qn = bb(Tn); Tn.translate(x0 - qn[0], 0); first = false; }
      x = bb(Tn)[2] + (/\s$/.test(phan[j]) || /^\s/.test(phan[j + 1] || "") ? Math.round(cn * 0.26) : 0);
    }
    y -= lead;
  }
  y -= o.nho ? Math.round(cn * 0.15) : 0;
  if (o.t2 !== "") {
    var T2 = THEME_TEXT0(o.t2 || "CHRISTMAS", F.T, co, NOEL_T2[0], x0, y, { name: "Tiêu đề - dòng 2" });
    noelVua(T2, W - 2 * x0 - 10); q = bb(T2); T2.translate(x0 - q[0], y - q[3]); q = bb(T2);
    noelSoc(T2, NOEL_T2[1]);
    y = q[1] - Math.round(co * 0.1);
  }
  var T1 = THEME_TEXT0(o.t1 || "POLY", F.T, co, NOEL_T1[0], x0, y, { name: "Tiêu đề - dòng 1" });
  noelVua(T1, W - 2 * x0 - 120); q = bb(T1); T1.translate(x0 - q[0], y - q[3]); q = bb(T1);
  noelSoc(T1, NOEL_T1[1]);
  noelVach(q[2] + 30, (q[1] + q[3]) / 2, 1, "Vạch cạnh tiêu đề");
  var B = THEME_TEXT0("POLY STORE", F.B, 22, "FFFFFF", 96, 112, { track: 200, name: "Thương hiệu" });
  var chan = o.chan != null ? o.chan : THEME.noel_chan;
  if (chan) { var C2 = THEME_TEXT0(chan, F.B, 24, THEME.noel_xanh_dam || "16402B", W / 2, H - 30, { align: Justification.CENTER, maxW: W - 80, name: "Địa chỉ / hotline" }); q = bb(C2); C2.translate(W / 2 - (q[0] + q[2]) / 2, 0); }
  RUN += "   bia noel anh that: " + (o.anh || "-") + "\n";
}
