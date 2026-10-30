
// ================= POST 30/10: 3 MẪU iPAD ĐÁNG MUA NHẤT 2026 =================
var A = OUT.fsName + "/tai-nguyen/anh-that/";
var FS = {
  T: pick(["SourceSerifRoman-Black", "SourceSerifRoman-Bold", "UTM-Cookies"]),
  I: pick(["SourceSerifItalic-SemiboldItalic", "SourceSerifItalic-BoldItalic", "UTMAvo-BoldItalic"])
};
var AMBER = "F59E0B", AMBER_SOFT = "FEF3C7", YEL = "FFD60A", TAG = "FACC15";
var HEART = "\uD83D\uDC9A", WARN = "\u26A0\uFE0F";

// ---------- chuyển file tải về (Downloads) ----------
var MOVELOG = "";
function moveTo(src, dstDir) {
  var s = new File(src); var dd = new Folder(dstDir); if (!dd.exists) dd.create();
  if (!s.exists) { MOVELOG += "khong thay (da chuyen?): " + src + "\n"; return; }
  var d = new File(dstDir + "/" + s.name), len = s.length;
  if (d.exists && d.length == len) { s.remove(); MOVELOG += "da co ban giong het, bo ban o Downloads: " + src + "\n"; return; }
  if (s.copy(d.fsName) && d.exists && d.length == len) { s.remove(); MOVELOG += "da chuyen: " + src + " -> " + d.fsName + "\n"; }
  else MOVELOG += "LOI chuyen: " + src + "\n";
}

// ---------- hiệu ứng phát sáng ----------
function fxGlow(L, o) {
  app.activeDocument.activeLayer = L;
  var d = new ActionDescriptor(), r = new ActionReference();
  r.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
  r.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
  d.putReference(charIDToTypeID("null"), r);
  var e = new ActionDescriptor();
  e.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
  if (o.glow) {
    var g = new ActionDescriptor();
    g.putBoolean(charIDToTypeID("enab"), true);
    g.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Scrn"));
    g.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc(o.glow.hex));
    g.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), o.glow.op);
    g.putEnumerated(charIDToTypeID("GlwT"), charIDToTypeID("BETE"), charIDToTypeID("SfBL"));
    g.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), o.glow.spread || 0);
    g.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), o.glow.size);
    g.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    g.putUnitDouble(charIDToTypeID("ShdN"), charIDToTypeID("#Prc"), 0);
    g.putBoolean(charIDToTypeID("AntA"), false);
    e.putObject(charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), g);
  }
  if (o.stroke) {
    var st = new ActionDescriptor();
    st.putBoolean(charIDToTypeID("enab"), true);
    st.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID("OutF"));
    st.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
    st.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml"));
    st.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), o.stroke.op || 100);
    st.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), o.stroke.size);
    st.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc(o.stroke.hex));
    e.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), st);
  }
  if (o.shadow) {
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc(o.shadow.hex || "000000"));
    ds.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), o.shadow.op);
    ds.putBoolean(charIDToTypeID("uglg"), false);
    ds.putUnitDouble(charIDToTypeID("lagl"), charIDToTypeID("#Ang"), 90);
    ds.putUnitDouble(charIDToTypeID("Dstn"), charIDToTypeID("#Pxl"), o.shadow.dist);
    ds.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    ds.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), o.shadow.blur);
    ds.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    ds.putBoolean(charIDToTypeID("AntA"), false);
    e.putObject(charIDToTypeID("DrSh"), charIDToTypeID("DrSh"), ds);
  }
  d.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), e);
  executeAction(charIDToTypeID("setd"), d, DialogModes.NO);
}

// ---------- đặt ảnh ----------
// ảnh phủ kín khung hình (đúng 1080x1440): đặt vào là khớp, không đo bounds
function placeFull(file, name) { return placeSO(A + file, name); }
function placeAt(file, name, cx, cy, w) {
  var L = placeSO(A + file, name), b = bb(L), s = w / (b[2] - b[0]) * 100;
  L.resize(s, s, AnchorPosition.MIDDLECENTER); b = bb(L);
  L.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
  return L;
}
function devicePic(file, name, l, t, r, b, sh) {
  var L = placeSO(A + file, name);
  var bx = fitBox(L, l, t, r, b);
  fx(L, { shadow: sh || { op: 62, dist: 20, blur: 40 } });
  return bx;
}
function bgPhoto(file, imgW, cropL, cropT, cropW, blur, op) {
  var L = placeSO(IMG + file, "Ảnh nền - " + file);
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W);
  gblur(blur);
  var O = rect(0, 0, W, H, 0, C.BLACK, "Lớp tối"); O.opacity = op;
}

// ---------- chữ, nhãn ----------
function head30(n, bg, pillTxt, t, sub) {
  var d = newDoc("Slide 0" + n);
  bgPhoto(bg[0], bg[1], bg[2], bg[3], bg[4], 14, 60);
  text("POLY STORE", F.B, 22, C.WHITE, 84, 112, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, F.T, 96, C.WHITE, 540, 310, { align: Justification.CENTER, maxW: 900, name: "Tiêu đề" });
  fx(T, { stroke: { hex: C.GREEN_D, size: 9 }, shadow: { op: 45, dist: 7, blur: 12 } });
  var S = text(sub, F.B, 31, C.WHITE, 540, 382, { align: Justification.CENTER, maxW: 900, name: "Phụ đề" });
  fx(S, { shadow: { op: 60, dist: 2, blur: 6 } });
  return d;
}
function emojiC(ch, size, cx, cy, name) {
  var E = text(ch, F.E, size, C.WHITE, cx, cy, { align: Justification.CENTER, name: name });
  var b = bb(E); E.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
  return E;
}
function checkDot(cx, cy, r) {
  oval(cx - r, cy - r, cx + r, cy + r, C.GREEN, "Dấu tích - nền");
  check(cx, cy + 1, r * 1.05, C.WHITE);
}
function bullet(str, x, y, size, hex) {
  checkDot(x + 17, y - Math.round(size * 0.34), 17);
  var T = text(str, F.B, size, hex || C.WHITE, x + 46, y, { maxW: 948 - (x + 46), name: "Ý - " + str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  return T;
}
function priceTag(val, x, cy, lab) {
  var L1 = text(lab || "GIÁ TẠI POLY", F.B, 21, C.GREEN_L, x + 30, cy, { track: 60, name: "Giá - nhãn" });
  centerY(L1, cy);
  var b1 = bb(L1);
  var L2 = text(val, F.T, 42, C.WHITE, b1[2] + 16, cy, { name: "Giá - số" });
  centerY(L2, cy);
  var b2 = bb(L2);
  var R = rect(x, cy - 33, b2[2] + 30, cy + 33, 33, C.BLACK, "Giá - nền");
  R.fillOpacity = 62;
  fx(R, { stroke: { hex: C.GREEN_L, size: 2, op: 90, inside: true }, shadow: { op: 40, dist: 4, blur: 10 } });
  R.move(L1, ElementPlacement.PLACEAFTER);
  return b2[2] + 30;
}
function lifeCircle(file, cx, cy, r, name) {
  placeAt(file, "Ảnh đời thực - " + name, cx, cy, 2 * r);
  var Rg = oval(cx - r, cy - r, cx + r, cy + r, C.WHITE, "Viền - " + name); Rg.fillOpacity = 0;
  fx(Rg, { stroke: { hex: C.WHITE, size: 5 }, shadow: { op: 55, dist: 8, blur: 16 } });
}
function labelChipUp(cx, cy, label, fillH, name) {
  var T = text(label, F.B, 28, C.WHITE, cx, cy + 10, { align: Justification.CENTER, name: name + " - chữ" });
  var b = bb(T), w = b[2] - b[0];
  T.translate(cx - (b[0] + b[2]) / 2, 0);
  var R = rect(cx - w / 2 - 26, cy - 28, cx + w / 2 + 26, cy + 28, 28, fillH, name + " - nền");
  var Tl = poly([[cx - 12, cy - 26], [cx + 12, cy - 26], [cx, cy - 42]], fillH, name + " - đuôi");
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 70 }, shadow: { op: 40, dist: 6, blur: 12 } });
  R.move(T, ElementPlacement.PLACEAFTER); Tl.move(R, ElementPlacement.PLACEAFTER);
  return [cx - w / 2 - 26, cy - 28, cx + w / 2 + 26, cy + 28];
}
function labelChipDown(cx, cy, label, fillH, name) {
  var T = text(label, F.B, 26, C.WHITE, cx, cy + 9, { align: Justification.CENTER, name: name + " - chữ" });
  var b = bb(T), w = b[2] - b[0];
  T.translate(cx - (b[0] + b[2]) / 2, 0);
  var R = rect(cx - w / 2 - 24, cy - 26, cx + w / 2 + 24, cy + 26, 26, fillH, name + " - nền");
  var Tl = poly([[cx - 11, cy + 24], [cx + 11, cy + 24], [cx, cy + 40]], fillH, name + " - đuôi");
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 70 }, shadow: { op: 40, dist: 6, blur: 12 } });
  R.move(T, ElementPlacement.PLACEAFTER); Tl.move(R, ElementPlacement.PLACEAFTER);
  return [cx - w / 2 - 24, cy - 26, cx + w / 2 + 24, cy + 26];
}
function glass(l, t, r, b, rad, name) {
  var G = rect(l, t, r, b, rad, C.WHITE, name); G.fillOpacity = 11;
  fx(G, { stroke: { hex: C.WHITE, size: 2, op: 40, inside: true } });
  return G;
}

