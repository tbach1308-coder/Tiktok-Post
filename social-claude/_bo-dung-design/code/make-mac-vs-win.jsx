#target photoshop
// POLY STORE LAPTOP - MacBook hay Windows
// khong keo Photoshop len truoc: fen dang lam viec khac (28/10)
app.displayDialogs = DialogModes.NO;
var OLD_RU = app.preferences.rulerUnits, OLD_TU = app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var W = 1080, H = 1440;
var IMG = "E:/Social Claude/Anh tai ve/";
var OUT = new Folder("E:/Social Claude/Laptop");
if (!OUT.exists) OUT.create();

function writeFile(name, s) {
  var f = new File(OUT.fsName + "/" + name);
  f.encoding = "UTF-8"; f.open("w"); f.write(s); f.close();
}

var C = {
  WHITE: "FFFFFF", BLACK: "000000", INK: "111827", BAR: "D9D9D9",
  GREEN: "22C55E", GREEN_D: "16A34A", GREEN_L: "4ADE80", GREEN_SOFT: "DCFCE7", GREEN_PALE: "86EFAC"
};

// ---------- fonts ----------
var PSN = {};
for (var i = 0; i < app.fonts.length; i++) { try { PSN[app.fonts[i].postScriptName] = 1; } catch (e) {} }
function pick(a) { for (var i = 0; i < a.length; i++) if (PSN[a[i]]) return a[i]; return a[a.length - 1]; }
var F = {
  T: pick(["UTM-Cookies", "UTM-Alberta-Heavy", "SegoeUIBlack"]),
  B: pick(["UTMAvoBold", "SegoeUI-Bold"]),
  R: pick(["UTM-Avo", "SegoeUI"]),
  E: pick(["NotoColorEmoji-SVG", "AppleColorEmoji", "SegoeUIEmoji"])
};
var BULB = "\uD83D\uDCA1", POINT = "\uD83D\uDC49";

// ---------- helpers ----------
function col(h) { var c = new SolidColor(); c.rgb.hexValue = h; return c; }
function rgbDesc(h) {
  var c = col(h), d = new ActionDescriptor();
  d.putDouble(charIDToTypeID("Rd  "), c.rgb.red);
  d.putDouble(charIDToTypeID("Grn "), c.rgb.green);
  d.putDouble(charIDToTypeID("Bl  "), c.rgb.blue);
  return d;
}
function shape(kind, l, t, r, b, rad, h, name) {
  var d = new ActionDescriptor(), ref = new ActionReference();
  ref.putClass(stringIDToTypeID("contentLayer"));
  d.putReference(charIDToTypeID("null"), ref);
  var d2 = new ActionDescriptor(), d3 = new ActionDescriptor();
  d3.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc(h));
  d2.putObject(charIDToTypeID("Type"), stringIDToTypeID("solidColorLayer"), d3);
  var s = new ActionDescriptor();
  s.putInteger(stringIDToTypeID("unitValueQuadVersion"), 1);
  s.putUnitDouble(charIDToTypeID("Top "), charIDToTypeID("#Pxl"), t);
  s.putUnitDouble(charIDToTypeID("Left"), charIDToTypeID("#Pxl"), l);
  s.putUnitDouble(charIDToTypeID("Btom"), charIDToTypeID("#Pxl"), b);
  s.putUnitDouble(charIDToTypeID("Rght"), charIDToTypeID("#Pxl"), r);
  if (kind == "rect" && rad > 0) {
    var k = ["topRight", "topLeft", "bottomLeft", "bottomRight"];
    for (var i = 0; i < 4; i++) s.putUnitDouble(stringIDToTypeID(k[i]), charIDToTypeID("#Pxl"), rad);
  }
  d2.putObject(charIDToTypeID("Shp "), kind == "rect" ? charIDToTypeID("Rctn") : charIDToTypeID("Elps"), s);
  d.putObject(charIDToTypeID("Usng"), stringIDToTypeID("contentLayer"), d2);
  executeAction(charIDToTypeID("Mk  "), d, DialogModes.NO);
  var L = app.activeDocument.activeLayer;
  if (name) L.name = name;
  return L;
}
function rect(l, t, r, b, rad, h, name) { return shape("rect", l, t, r, b, rad, h, name || "Box"); }
function oval(l, t, r, b, h, name) { return shape("oval", l, t, r, b, 0, h, name || "Circle"); }
function poly(pts, h, name) {
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.name = name || "Shape";
  doc.selection.select(pts, SelectionType.REPLACE, 0, true);
  doc.selection.fill(col(h));
  doc.selection.deselect();
  return L;
}
function check(cx, cy, k, h) {
  return poly([[cx - 0.5 * k, cy - 0.02 * k], [cx - 0.32 * k, cy - 0.2 * k], [cx - 0.12 * k, cy + 0.02 * k],
    [cx + 0.32 * k, cy - 0.42 * k], [cx + 0.5 * k, cy - 0.24 * k], [cx - 0.12 * k, cy + 0.38 * k]], h, "D\u1ea5u t\u00edch");
}
function spark(ax, ay, angDeg, r0, len, th, h) {
  var a = angDeg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  var px = -sa * th / 2, py = ca * th / 2;
  var x1 = ax + ca * r0, y1 = ay + sa * r0, x2 = ax + ca * (r0 + len), y2 = ay + sa * (r0 + len);
  return poly([[x1 + px, y1 + py], [x2 + px, y2 + py], [x2 - px, y2 - py], [x1 - px, y1 - py]], h, "Tia s\u00e1ng");
}
function arrowH(x1, x2, y, th, hl, hw, h, name) {
  return poly([[x1, y - th / 2], [x2 - hl, y - th / 2], [x2 - hl, y - hw / 2], [x2, y],
    [x2 - hl, y + hw / 2], [x2 - hl, y + th / 2], [x1, y + th / 2]], h, name || "M\u0169i t\u00ean");
}
function bb(L) { var b = L.bounds; return [b[0].as("px"), b[1].as("px"), b[2].as("px"), b[3].as("px")]; }
var LAST = 0;
// text(): tao lop chu bang 1 lenh ActionManager (nhanh ~6 lan so voi gan tung textItem.x); loi thi quay ve cach DOM cu. Giu dung 28 dong (build.py lay 223 dong dau file).
var TEXT_AM = true;
function textAM(str, font, size, h, x, y, lead, track, align) {
  var s2t = stringIDToTypeID, c2t = charIDToTypeID, d = new ActionDescriptor(), r = new ActionReference(), tl = new ActionDescriptor(), pt = new ActionDescriptor(), st = new ActionDescriptor();
  r.putClass(s2t("textLayer")); d.putReference(c2t("null"), r); tl.putString(s2t("textKey"), str);
  pt.putUnitDouble(c2t("Hrzn"), c2t("#Prc"), x / W * 100); pt.putUnitDouble(c2t("Vrtc"), c2t("#Prc"), y / H * 100); tl.putObject(s2t("textClickPoint"), c2t("Pnt "), pt);
  st.putString(s2t("fontPostScriptName"), font); st.putUnitDouble(s2t("size"), c2t("#Pnt"), size); st.putBoolean(s2t("autoLeading"), false); st.putUnitDouble(s2t("leading"), c2t("#Pnt"), lead); st.putInteger(s2t("tracking"), track || 0); st.putObject(s2t("color"), s2t("RGBColor"), rgbDesc(h));
  var sr = new ActionDescriptor(); sr.putInteger(s2t("from"), 0); sr.putInteger(s2t("to"), str.length); sr.putObject(s2t("textStyle"), s2t("textStyle"), st); var sl = new ActionList(); sl.putObject(s2t("textStyleRange"), sr); tl.putList(s2t("textStyleRange"), sl);
  var ps = new ActionDescriptor(); ps.putEnumerated(s2t("align"), s2t("alignmentType"), s2t(align == Justification.CENTER ? "center" : (align == Justification.RIGHT ? "right" : "left")));
  var pr = new ActionDescriptor(); pr.putInteger(s2t("from"), 0); pr.putInteger(s2t("to"), str.length); pr.putObject(s2t("paragraphStyle"), s2t("paragraphStyle"), ps); var pl = new ActionList(); pl.putObject(s2t("paragraphStyleRange"), pr); tl.putList(s2t("paragraphStyleRange"), pl);
  d.putObject(c2t("Usng"), s2t("textLayer"), tl); executeAction(c2t("Mk  "), d, DialogModes.NO); return app.activeDocument.activeLayer;
}
function textDOM(str, font, size, h, x, y, lead, track, align) {
  var L = app.activeDocument.artLayers.add(); L.kind = LayerKind.TEXT; var t = L.textItem;
  t.contents = str; t.font = font; t.size = size; t.color = col(h); t.useAutoLeading = false; t.leading = lead; t.tracking = track || 0; t.justification = align || Justification.LEFT; t.position = [x, y]; return L;
}
function text(str, font, size, h, x, y, o) {
  o = o || {}; var lead = o.lead || Math.round(size * 1.2), L = null;
  if (TEXT_AM) { try { L = textAM(str, font, size, h, x, y, lead, o.track, o.align); } catch (e) { TEXT_AM = false; } }
  if (!L) L = textDOM(str, font, size, h, x, y, lead, o.track, o.align);
  L.name = o.name || str.replace(/\r/g, " ").substr(0, 40); var s = size;
  if (o.maxW) { var b = bb(L), w0 = b[2] - b[0]; if (w0 > o.maxW) {
    var t = L.textItem, seq = [size]; while (seq.length < 31 && w0 * seq[seq.length - 1] / size > o.maxW) seq.push(Math.floor(seq[seq.length - 1] * 0.96));
    var setS = function (v) { t.size = v; t.leading = Math.round((o.lead || size * 1.2) * v / size); var q = bb(L); return q[2] - q[0]; };
    var k = seq.length - 1, done = false; if (k >= 2 && setS(seq[k - 1]) <= o.maxW) { s = seq[k - 1]; done = true; }
    if (!done) { var v = seq[k], wv = setS(v), g = k; while (wv > o.maxW && g < 30) { v = Math.floor(v * 0.96); wv = setS(v); g++; } s = v; } } }
  LAST = s; return L;
}
function centerY(L, cy) { var b = bb(L); L.translate(0, cy - (b[1] + b[3]) / 2); }
function pill(str, x, cy, size, txtH, fillH, padX, hgt, font, track, name) {
  var T = text(str, font, size, txtH, x + padX, cy + Math.round(size * 0.36), { track: track, name: name + " - ch\u1eef" });
  var b = bb(T);
  T.translate(x + padX - b[0], 0);
  b = bb(T);
  var P = rect(x, cy - hgt / 2, b[2] + padX, cy + hgt / 2, hgt / 2, fillH, name);
  P.move(T, ElementPlacement.PLACEAFTER);
  return b[2] + padX;
}
// layer style: stroke + b\u00f3ng \u0111\u1ed5
function fx(L, o) {
  app.activeDocument.activeLayer = L;
  var d = new ActionDescriptor(), r = new ActionReference();
  r.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
  r.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
  d.putReference(charIDToTypeID("null"), r);
  var e = new ActionDescriptor();
  e.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100);
  if (o.stroke) {
    var st = new ActionDescriptor();
    st.putBoolean(charIDToTypeID("enab"), true);
    st.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID(o.stroke.inside ? "InsF" : "OutF"));
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
function placeSO(file, name) {
  var d = new ActionDescriptor();
  d.putPath(charIDToTypeID("null"), new File(file));
  d.putEnumerated(charIDToTypeID("FTcs"), charIDToTypeID("QCSt"), charIDToTypeID("Qcsa"));
  var off = new ActionDescriptor();
  off.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), 0);
  off.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), 0);
  d.putObject(charIDToTypeID("Ofst"), charIDToTypeID("Ofst"), off);
  executeAction(charIDToTypeID("Plc "), d, DialogModes.NO);
  var L = app.activeDocument.activeLayer;
  L.name = name;
  return L;
}
// \u1ea3nh: v\u00f9ng c\u1eaft (cropL, cropT, cropW tr\u00ean \u1ea3nh g\u1ed1c r\u1ed9ng imgW) \u0111\u1eb7t v\u00e0o (dstL, dstT) r\u1ed9ng dstW
function fitSO(L, imgW, cropL, cropT, cropW, dstL, dstT, dstW) {
  var sc = dstW / cropW, b = bb(L);
  var pct = (imgW * sc) / (b[2] - b[0]) * 100;
  L.resize(pct, pct, AnchorPosition.TOPLEFT);
  b = bb(L);
  L.translate(dstL - cropL * sc - b[0], dstT - cropT * sc - b[1]);
}
function gblur(r) {
  var d = new ActionDescriptor();
  d.putUnitDouble(charIDToTypeID("Rds "), charIDToTypeID("#Pxl"), r);
  executeAction(charIDToTypeID("GsnB"), d, DialogModes.NO);
}
function background(file, imgW, cropL, cropT, cropW, blurR) {
  var L = placeSO(IMG + file, "\u1ea2nh n\u1ec1n - " + file);
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W); L.rasterize(RasterizeType.ENTIRELAYER); // ảnh nền thành ảnh thường rồi mới mờ: ảnh ra y hệt, PSD nhẹ ~1/2 (đo 29/10)
  gblur(blurR || 5);
  var O = rect(0, 0, W, H, 0, C.BLACK, "L\u1edbp t\u1ed1i");
  O.opacity = 45;
}
function photoCard(file, imgW, cropL, cropT, cropW, l, t, w, h, rad, name) {
  rect(l, t, l + w, t + h, rad, C.WHITE, name + " - khung");
  var L = placeSO(IMG + file, name);
  fitSO(L, imgW, cropL, cropT, cropW, l, t, w);
  L.grouped = true;
  return L;
}
function newDoc(name) {
  var d = app.documents.add(W, H, 72, name, NewDocumentMode.RGB, DocumentFill.WHITE);
  d.activeLayer = d.backgroundLayer;
  d.selection.selectAll(); d.selection.fill(col(C.BLACK)); d.selection.deselect();
  return d;
}
function save(doc, n) {
  doc.resizeImage(undefined, undefined, 150, ResampleMethod.NONE);
  var o = new PhotoshopSaveOptions(); o.layers = true; o.embedColorProfile = true;
  doc.saveAs(new File(OUT.fsName + "/slide-0" + n + ".psd"), o, false, Extension.LOWERCASE);
  var p = new PNGSaveOptions(); p.compression = 6; p.interlaced = false;
  doc.saveAs(new File(OUT.fsName + "/slide-0" + n + ".png"), p, true, Extension.LOWERCASE);
}

// ================= POST LAPTOP: MACBOOK HAY WINDOWS =================
var OUT5 = new Folder("E:/Social Claude/Laptop/T10_Laptop_Mac_vs_Win");
if (!OUT5.exists) OUT5.create();
var TN = OUT5.fsName + "/tai-nguyen/";
var LOGF = new Folder(OUT5.fsName + "/log"); if (!LOGF.exists) LOGF.create();
function plog(name, s) { var f = new File(LOGF.fsName + "/" + name); f.encoding = "UTF-8"; f.open("w"); f.write(s); f.close(); }
var FS = {
  T: pick(["SourceSerifRoman-Black", "SourceSerifRoman-Bold", "UTM-Cookies"]),
  I: pick(["SourceSerifItalic-SemiboldItalic", "SourceSerifItalic-BoldItalic", "UTMAvo-BoldItalic"])
};
var YEL = "FFD60A", INKBG = "0B1220";
var KBZ = { file: "E:/Social Claude/Laptop/T10_Laptop_02/tai-nguyen/ban-phim-thinkpad-zoom.png", cw: 1380, ch: 580, ct: 100 };

function pillC(str, cx, cy, size, txtH, fillH, padX, hgt, font, track, name) {
  var T = text(str, font, size, txtH, 0, cy + Math.round(size * 0.36), { track: track, name: name + " - ch\u1EEF" });
  var b = bb(T), w = b[2] - b[0];
  T.translate(cx - w / 2 - b[0], 0);
  var P = rect(cx - w / 2 - padX, cy - hgt / 2, cx + w / 2 + padX, cy + hgt / 2, hgt / 2, fillH, name);
  P.move(T, ElementPlacement.PLACEAFTER);
  return P;
}
function emojiC(ch, size, cx, cy, name) {
  var E = text(ch, F.E, size, C.WHITE, cx, cy, { align: Justification.CENTER, name: name });
  var b = bb(E); E.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2);
  return E;
}
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
    g.putUnitDouble(charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), 0);
    g.putUnitDouble(charIDToTypeID("blur"), charIDToTypeID("#Pxl"), o.glow.size);
    g.putUnitDouble(charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0);
    g.putUnitDouble(charIDToTypeID("ShdN"), charIDToTypeID("#Prc"), 0);
    g.putBoolean(charIDToTypeID("AntA"), false);
    e.putObject(charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), g);
  }
  if (o.shadow) {
    var ds = new ActionDescriptor();
    ds.putBoolean(charIDToTypeID("enab"), true);
    ds.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Mltp"));
    ds.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), rgbDesc("000000"));
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
// n\u1EC1n: \u1EA3nh th\u1EADt l\u00E0m m\u1EDD + l\u1EDBp t\u1ED1i
function bgPhoto(file, imgW, cropL, cropT, cropW, blur, op) {
  var L = placeSO(file, "\u1EA2nh n\u1EC1n");
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W); L.rasterize(RasterizeType.ENTIRELAYER); // ảnh nền thành ảnh thường rồi mới mờ: ảnh ra y hệt, PSD nhẹ ~1/2 (đo 29/10)
  gblur(blur);
  var O = rect(0, 0, W, H, 0, C.BLACK, "L\u1EDBp t\u1ED1i"); O.opacity = op;
}
// \u0111\u1EA7u slide: POLY STORE + nh\u00E3n xanh + ti\u00EAu \u0111\u1EC1 Cookies + ph\u1EE5 \u0111\u1EC1
function head(n, pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Th\u01B0\u01A1ng hi\u1EC7u" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nh\u00E3n");
  var T = text(t, F.T, 96, C.WHITE, 540, 304, { align: Justification.CENTER, maxW: 880, name: "Ti\u00EAu \u0111\u1EC1" });
  fx(T, { stroke: { hex: C.GREEN_D, size: 9 }, shadow: { op: 45, dist: 7, blur: 12 } });
  var S = text(sub, F.B, 31, C.WHITE, 540, 374, { align: Justification.CENTER, maxW: 880, name: "Ph\u1EE5 \u0111\u1EC1" });
  fx(S, { shadow: { op: 60, dist: 2, blur: 6 } });
}
function glass(l, t, r, b, rad, name) {
  var G = rect(l, t, r, b, rad, C.WHITE, name); G.fillOpacity = 11;
  fx(G, { stroke: { hex: C.WHITE, size: 2, op: 40, inside: true } });
  return G;
}
function checkDot(cx, cy, r) {
  oval(cx - r, cy - r, cx + r, cy + r, C.GREEN, "D\u1EA5u t\u00EDch - n\u1EC1n");
  check(cx, cy + 1, r * 1.05, C.WHITE);
}
function bullet(str, x, y, size) {
  checkDot(x + 17, y - Math.round(size * 0.34), 17);
  var T = text(str, F.B, size, C.WHITE, x + 46, y, { maxW: 960 - (x + 46), name: "\u00DD - " + str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  return T;
}
// \u00F4 ph\u00E2n t\u00EDch (n\u1EC1n xanh nh\u1EA1t)
function note(t, h, emo, str) {
  var K = rect(98, t, 982, t + h, 28, C.GREEN_SOFT, "Ph\u00E2n t\u00EDch - n\u1EC1n");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  emojiC(emo, 40, 142, t + h / 2, "Ph\u00E2n t\u00EDch - icon");
  var T = text(str, F.B, 27, C.INK, 186, t + 40, { lead: 38, maxW: 958 - 186, name: "Ph\u00E2n t\u00EDch" });
  centerY(T, t + h / 2);
}
// c\u00E2u m\u00F3c cu\u1ED1i slide
function hookPill(str, cy) {
  var T = text(str, F.B, 27, C.WHITE, 0, cy + 10, { name: "C\u00E2u m\u00F3c - ch\u1EEF" });
  var b = bb(T), tw = b[2] - b[0], ew = 40, total = tw + 12 + ew, l = 540 - total / 2;
  T.translate(l - b[0], 0);
  emojiC("\uD83D\uDC49", 34, l + tw + 12 + ew / 2, cy, "C\u00E2u m\u00F3c - icon");
  var R = rect(l - 30, cy - 32, l + total + 30, cy + 32, 32, INKBG, "C\u00E2u m\u00F3c - n\u1EC1n");
  R.fillOpacity = 80;
  fx(R, { stroke: { hex: C.GREEN_L, size: 2, op: 85, inside: true }, shadow: { op: 45, dist: 5, blur: 12 } });
  R.move(T, ElementPlacement.PLACEAFTER);
}
function labelChipDown(cx, cy, label, fillH, name) {
  var T = text(label, F.B, 26, C.WHITE, cx, cy + 9, { align: Justification.CENTER, name: name + " - ch\u1EEF" });
  var b = bb(T), w = b[2] - b[0];
  T.translate(cx - (b[0] + b[2]) / 2, 0);
  var R = rect(cx - w / 2 - 24, cy - 26, cx + w / 2 + 24, cy + 26, 26, fillH, name + " - n\u1EC1n");
  var Tl = poly([[cx - 11, cy + 24], [cx + 11, cy + 24], [cx, cy + 40]], fillH, name + " - \u0111u\u00F4i");
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 70 }, shadow: { op: 40, dist: 6, blur: 12 } });
  R.move(T, ElementPlacement.PLACEAFTER); Tl.move(R, ElementPlacement.PLACEAFTER);
}
// \u1EA3nh th\u1EADt trong khung bo g\u00F3c vi\u1EC1n tr\u1EAFng
function photoFrame(file, imgW, cropL, cropT, cropW, l, t, w, h, name) {
  var K = rect(l, t, l + w, t + h, 32, C.WHITE, name + " - khung");
  fx(K, { stroke: { hex: C.WHITE, size: 5 }, shadow: { op: 55, dist: 10, blur: 24 } });
  var P = placeSO(file, name);
  fitSO(P, imgW, cropL, cropT, cropW, l, t, w);
  P.grouped = true;
}
// \u1EA3nh th\u1EADt trong khung tr\u00F2n
function photoCircle(file, imgW, cropL, cropT, cropW, cx, cy, r, name) {
  var O = oval(cx - r, cy - r, cx + r, cy + r, C.WHITE, name + " - khung");
  fx(O, { stroke: { hex: C.WHITE, size: 6 }, shadow: { op: 55, dist: 8, blur: 18 } });
  var P = placeSO(file, name);
  fitSO(P, imgW, cropL, cropT, cropW, cx - r, cy - r, 2 * r);
  P.grouped = true;
}
function save5(doc, n) {
  doc.resizeImage(undefined, undefined, 150, ResampleMethod.NONE);
  var o = new PhotoshopSaveOptions(); o.layers = true; o.embedColorProfile = true;
  doc.saveAs(new File(OUT5.fsName + "/slide-0" + n + ".psd"), o, true, Extension.LOWERCASE);
  var p = new PNGSaveOptions(); p.compression = 6; p.interlaced = false;
  doc.saveAs(new File(OUT5.fsName + "/slide-0" + n + ".png"), p, true, Extension.LOWERCASE);
  doc.close(SaveOptions.DONOTSAVECHANGES);
}


var RED = "EF4444", AMBER = "F59E0B", HOOK_Y = 1320;
var BG_WIN = "E:/Social Claude/Anh tai ve/sunrise-king-NK-cB-l1cv0-unsplash.jpg";
// v\u00F2ng khoanh + s\u1ED1 th\u1EE9 t\u1EF1
function ring(l, t, r, b, rad, hex, name) {
  var R = rect(l, t, r, b, rad, hex, name);
  R.fillOpacity = 0;
  fx(R, { stroke: { hex: hex, size: 6, inside: true }, shadow: { op: 55, dist: 3, blur: 8 } });
  return R;
}
function centerText(T, cx, cy) { var b = bb(T); T.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2); }
function badge(n, cx, cy, hex, name) {
  var O = oval(cx - 22, cy - 22, cx + 22, cy + 22, hex, name + " - n\u1EC1n");
  fx(O, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 50, dist: 3, blur: 8 } });
  centerText(text(String(n), F.B, 28, C.WHITE, cx, cy + 10, { align: Justification.CENTER, name: name + " - s\u1ED1" }), cx, cy);
}
function dotText(x, y, size, hex, ch, name) {
  var cy = y - Math.round(size * 0.34);
  oval(x, cy - 17, x + 34, cy + 17, hex, name + " - n\u1EC1n");
  centerText(text(ch, F.B, 22, C.WHITE, x + 17, y, { align: Justification.CENTER, name: name }), x + 17, cy);
}
function lineText(str, x, y, size) {
  var T = text(str, F.B, size, C.WHITE, x + 46, y, { maxW: 960 - (x + 46), name: "\u00DD - " + str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
}
function bulletN(n, hex, str, x, y, size) { dotText(x, y, size, hex, String(n), "S\u1ED1 " + n); lineText(str, x, y, size); }
function bulletW(str, x, y, size) { dotText(x, y, size, AMBER, "!", "L\u01B0u \u00FD"); lineText(str, x, y, size); }
// \u1EA3nh \u0111\u00E3 c\u1EAFt s\u1EB5n \u0111\u00FAng k\u00EDch th\u01B0\u1EDBc hi\u1EC3n th\u1ECB: \u0111\u1EB7t 100%, khung bo g\u00F3c vi\u1EC1n tr\u1EAFng
function shot(file, w, l, t, h, name) { photoFrame(TN + file, w, 0, 0, w, l, t, w, h, name); }
function litKey(k, name) {
  var R = rect(k[0] + 8, k[1] + 8, k[2] - 8, k[3] - 8, 14, C.GREEN, name);
  R.blendMode = BlendMode.SCREEN; R.opacity = 78;
  fxGlow(R, { glow: { hex: C.GREEN_L, op: 85, size: 14 } });
}


// ---------- s\u1ED1 li\u1EC7u ----------
var M1_PRICE = "12.900.000\u0111", NEO_PRICE = "19.499.000\u0111", NEO_EDU = "16.999.000\u0111";
var CHENH = "2\u20134 tri\u1EC7u", NEO_LN = "15\u201317 tri\u1EC7u", M1_PIN = "tr\u00EAn 90%";
var NEO = "4F46E5", NEO_L = "A5B4FC", AIRC = C.GREEN_D;

function tag(str, x, cy, hex, name) {
  var T = text(str, F.B, 23, C.WHITE, x + 18, cy + 8, { track: 40, name: name + " - ch\u1EEF" });
  var b = bb(T);
  var R = rect(x, cy - 21, b[2] + 18, cy + 21, 21, hex, name + " - n\u1EC1n");
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 70 }, shadow: { op: 40, dist: 3, blur: 8 } });
  R.move(T, ElementPlacement.PLACEAFTER);
}
function ctext(str, font, size, hex, cx, y, maxW, name) {
  var T = text(str, font, size, hex, cx, y, { align: Justification.CENTER, maxW: maxW, name: name || str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  return T;
}
function photoCard(file, l, t, w, h, tagStr, hex) {
  shot(file, w, l, t, h, "\u1EA2nh - " + tagStr);
  tag(tagStr, l + 16, t + 38, hex, "Nh\u00E3n " + tagStr);
}
// b\u1EA3ng so s\u00E1nh 2 c\u1ED9t: nh\u00E3n \u1EDF gi\u1EEFa, gi\u00E1 tr\u1ECB Air b\u00EAn tr\u00E1i, Neo b\u00EAn ph\u1EA3i
function compare(t, rows, rh, name) {
  var b = t + 24 + rows.length * rh;
  glass(98, t, 982, b, 28, name);
  for (var i = 0; i < rows.length; i++) {
    var cy = t + 12 + rh / 2 + i * rh;
    if (i > 0) { var Ln = rect(122, cy - rh / 2, 958, cy - rh / 2 + 2, 0, C.WHITE, "K\u1EBB d\u00F2ng"); Ln.opacity = 18; }
    var r = rows[i];
    ctext(r[1], F.B, 27, r[3] || C.WHITE, 300, cy + 10, 300, "Air - " + r[0]);
    ctext(r[2], F.B, 27, r[4] || C.WHITE, 780, cy + 10, 300, "Neo - " + r[0]);
    pillC(r[0], 540, cy, 20, C.WHITE, "334155", 14, 34, F.B, 20, "M\u1EE5c - " + r[0]);
  }
  return b;
}
function vs(cx, cy) {
  var O = oval(cx - 34, cy - 34, cx + 34, cy + 34, YEL, "VS - n\u1EC1n");
  fx(O, { stroke: { hex: C.WHITE, size: 4 }, shadow: { op: 55, dist: 4, blur: 10 } });
  centerText(text("VS", FS.T, 30, C.INK, cx, cy + 10, { align: Justification.CENTER, name: "VS" }), cx, cy);
}
var AMB = "FCD34D";


// \u0111\u1EA7u slide ki\u1EC3u ch\u1EEF c\u00F3 ch\u00E2n (\u0111\u1ED3ng b\u1ED9 v\u1EDBi \u1EA3nh b\u00ECa)
function headN(n, pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Th\u01B0\u01A1ng hi\u1EC7u" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nh\u00E3n");
  var T = text(t, FS.T, 84, YEL, 540, 302, { align: Justification.CENTER, maxW: 880, name: "Ti\u00EAu \u0111\u1EC1" });
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 38, C.WHITE, 540, 372, { align: Justification.CENTER, maxW: 880, name: "Ph\u1EE5 \u0111\u1EC1" });
  fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
}

var MACC = "475569", WINC = "0284C7";

// b\u1EA3ng t\u1EC9 s\u1ED1: winner = "mac" | "win" | "tie"
function scoreboard(cy, macS, winS, winner) {
  var l = 170, r = 910;
  var B = rect(l, cy - 56, r, cy + 56, 56, INKBG, "T\u1EC9 s\u1ED1 - n\u1EC1n");
  B.fillOpacity = 88;
  fx(B, { stroke: { hex: C.GREEN_L, size: 3, op: 90, inside: true }, shadow: { op: 50, dist: 6, blur: 14 } });
  emojiC("\uD83C\uDF4E", 44, l + 62, cy, "T\u1EC9 s\u1ED1 - icon Mac");
  var M = text("MAC", F.B, 34, winner == "mac" ? C.GREEN_L : C.WHITE, l + 98, cy + 12, { track: 60, name: "T\u1EC9 s\u1ED1 - MAC" });
  var Wt = text("WIN", F.B, 34, winner == "win" ? C.GREEN_L : C.WHITE, 0, cy + 12, { track: 60, name: "T\u1EC9 s\u1ED1 - WIN" });
  var bw = bb(Wt); Wt.translate(r - 98 - bw[2], 0);
  emojiC("\uD83E\uDE9F", 44, r - 62, cy, "T\u1EC9 s\u1ED1 - icon Win");
  var S = text(macS + "  \u2013  " + winS, FS.T, 66, YEL, 540, cy + 24, { align: Justification.CENTER, name: "T\u1EC9 s\u1ED1" });
  fxGlow(S, { glow: { hex: YEL, op: 35, size: 20 }, shadow: { op: 60, dist: 3, blur: 8 } });
  if (winner == "mac" || winner == "win") {
    var cx = winner == "mac" ? l + 150 : r - 150;
    var P = pillC("+1", cx, cy - 64, 24, C.WHITE, C.GREEN_D, 16, 40, F.B, 0, "T\u1EC9 s\u1ED1 - c\u1ED9ng \u0111i\u1EC3m");
    fx(P, { stroke: { hex: C.WHITE, size: 2 }, shadow: { op: 40, dist: 3, blur: 8 } });
  } else {
    var P2 = pillC("H\u00D2A", 540, cy - 64, 22, C.INK, YEL, 18, 40, F.B, 40, "T\u1EC9 s\u1ED1 - h\u00F2a");
  }
}
function claim(t, h, str, size) {
  glass(98, t, 982, t + h, 28, "\u00DD ch\u00EDnh - n\u1EC1n");
  var T = text(str, F.B, size || 34, C.WHITE, 540, t + h / 2 + 12, { align: Justification.CENTER, lead: Math.round((size || 34) * 1.35), maxW: 840, name: "\u00DD ch\u00EDnh" });
  centerText(T, 540, t + h / 2);
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
}

// ================= 1. B\u00CCA =================
function m1() {
  var d = newDoc("Mac vs Win - 01 bia");
  placeSO(TN + "bg-mac.png", "N\u1EC1n");
  var G = rect(0, 0, W, 520, 0, C.BLACK, "N\u1EC1n t\u1ED1i ph\u1EA7n ch\u1EEF"); G.opacity = 55;
  text("POLY STORE", F.B, 22, C.WHITE, 100, 140, { track: 200, name: "Th\u01B0\u01A1ng hi\u1EC7u" });
  var y1 = 262, sz = 150;
  var L1 = text("MACBOOK", FS.T, sz, YEL, 100, y1, { name: "Ti\u00EAu \u0111\u1EC1 1" });
  var H = text("hay", FS.I, Math.round(sz * 0.62), C.WHITE, 700, y1, { name: "Ti\u00EAu \u0111\u1EC1 - hay" });
  var L2 = text("WINDOWS?", FS.T, sz, YEL, 100, y1 + Math.round(sz * 1.18), { name: "Ti\u00EAu \u0111\u1EC1 2" });
  var a = bb(L1), h = bb(H), c = bb(L2);
  var k = Math.min(1, 880 / Math.max((a[2] - a[0]) + 26 + (h[2] - h[0]), c[2] - c[0]));
  if (k < 1) {
    sz = Math.floor(sz * k);
    L1.textItem.size = sz; H.textItem.size = Math.round(sz * 0.62); L2.textItem.size = sz;
  }
  var y2 = y1 + Math.round(sz * 1.18);
  L2.textItem.position = [100, y2];
  var b1 = bb(L1); H.textItem.position = [b1[2] + 26, y1];
  fxGlow(L1, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  fxGlow(L2, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  fxGlow(H, { shadow: { op: 70, dist: 3, blur: 8 } });
  var S = text("Poly b\u00E1n c\u1EA3 2 \u2014 n\u00F3i th\u1EADt", FS.I, 50, C.WHITE, 104, y2 + 82, { name: "M\u00F4 t\u1EA3" });
  fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  var bs = bb(S);
  emojiC("\uD83E\uDD4A", 52, bs[2] + 42, y2 + 64, "M\u00F4 t\u1EA3 - icon");
  photoCard("c1-mac.png", 98, 640, 430, 560, "MACBOOK", MACC);
  photoCard("c1-win.png", 552, 640, 430, 560, "WINDOWS", WINC);
  vs(540, 920);
  hookPill("Vu\u1ED1t xem phe n\u00E0o th\u1EAFng", HOOK_Y);
  save5(d, 1);
}

// ================= 2. PIN & \u0110\u1ED8 M\u01AF\u1EE2T =================
function m2() {
  var d = newDoc("Mac vs Win - 02 pin");
  placeSO(TN + "bg-mac.png", "N\u1EC1n");
  headN(2, "HI\u1EC6P 1", "PIN & \u0110\u1ED8 M\u01AF\u1EE2T", "D\u00F9ng c\u1EA3 ng\u00E0y, x\u00E0i v\u00E0i n\u0103m th\u00EC sao?");
  photoCard("s2-mac.png", 98, 420, 884, 560, "MACBOOK", MACC);
  claim(1004, 104, "Mac: pin c\u1EA3 ng\u00E0y, 3 n\u0103m v\u1EABn m\u01B0\u1EE3t", 36);
  scoreboard(1196, 1, 0, "mac");
  hookPill("Hi\u1EC7p 2: Windows ph\u1EA3n c\u00F4ng", HOOK_Y);
  save5(d, 2);
}

// ================= 3. PH\u1EA6N M\u1EC0M & GAME =================
function m3() {
  var d = newDoc("Mac vs Win - 03 phan mem");
  placeSO(TN + "bg-win.png", "N\u1EC1n");
  headN(3, "HI\u1EC6P 2", "PH\u1EA6N M\u1EC0M & GAME", "C\u00F3 nh\u1EEFng th\u1EE9 ch\u1EC9 ch\u1EA1y tr\u00EAn Windows");
  photoCard("s3-win.png", 98, 420, 884, 560, "WINDOWS", WINC);
  claim(1004, 104, "AutoCAD full, app k\u1EBF to\u00E1n, game:\rch\u1EC9 Windows c\u00E2n", 32);
  scoreboard(1196, 1, 1, "win");
  hookPill("Hi\u1EC7p 3: m\u00E1y ch\u1EADm th\u00EC c\u1EE9u sao?", HOOK_Y);
  save5(d, 3);
}

// ================= 4. N\u00C2NG C\u1EA4P =================
function m4() {
  var d = newDoc("Mac vs Win - 04 nang cap");
  placeSO(TN + "bg-win.png", "N\u1EC1n");
  headN(4, "HI\u1EC6P 3", "N\u00C2NG C\u1EA4P", "M\u00E1y ch\u1EADm sau v\u00E0i n\u0103m, c\u1EE9u \u0111\u01B0\u1EE3c kh\u00F4ng?");
  photoCard("s4-win.png", 98, 420, 430, 420, "WIN: THAY \u0110\u01AF\u1EE2C", WINC);
  photoCard("s4-mac.png", 552, 420, 430, 420, "MAC: H\u00C0N CH\u1EBET", MACC);
  glass(98, 862, 982, 1050, 28, "\u00DD ch\u00EDnh - n\u1EC1n");
  var A = text("Win: n\u00E2ng RAM, thay SSD \u2014 ch\u1EADm l\u00E0 c\u1EE9u \u0111\u01B0\u1EE3c", F.B, 30, C.WHITE, 540, 930, { align: Justification.CENTER, maxW: 840, name: "\u00DD Win" });
  fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text("Mac: h\u00E0n ch\u1EBFt, mua sao d\u00F9ng v\u1EADy", F.B, 30, C.WHITE, 540, 990, { align: Justification.CENTER, maxW: 840, name: "\u00DD Mac" });
  fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  ctext("*M\u1ED9t s\u1ED1 m\u00E1y Win m\u1ECFng nh\u1EB9 c\u0169ng h\u00E0n RAM, h\u1ECFi k\u1EF9 tr\u01B0\u1EDBc khi mua", F.B, 21, "CBD5E1", 540, 1034, 820, "Ch\u00FA th\u00EDch");
  scoreboard(1196, 2, 1, "win");
  hookPill("Mac c\u00F3 g\u1EE1 h\u00F2a \u0111\u01B0\u1EE3c kh\u00F4ng?", HOOK_Y);
  save5(d, 4);
}

// ================= 5. TR\u1EA2I NGHI\u1EC6M =================
function m5() {
  var d = newDoc("Mac vs Win - 05 trai nghiem");
  placeSO(TN + "bg-mac.png", "N\u1EC1n");
  headN(5, "HI\u1EC6P 4", "TR\u1EA2I NGHI\u1EC6M", "C\u1EA7m l\u00EAn d\u00F9ng l\u00E0 th\u1EA5y kh\u00E1c");
  photoCard("s5-mac.png", 98, 420, 884, 560, "MACBOOK", MACC);
  claim(1004, 104, "M\u00E0n, loa, trackpad, AirDrop v\u1EDBi iPhone:\rMac kh\u00F4ng \u0111\u1ED1i th\u1EE7", 32);
  scoreboard(1196, 2, 2, "tie");
  emojiC("\uD83E\uDD2F", 54, 862, 1140, "T\u1EC9 s\u1ED1 - b\u1EA5t ng\u1EDD");
  hookPill("V\u1EADy r\u1ED1t cu\u1ED9c ch\u1ECDn m\u00E1y n\u00E0o?", HOOK_Y);
  save5(d, 5);
}

// ================= 6. CH\u1ED0T =================
function pick2(t, file, tagStr, hex, emo, line) {
  glass(98, t, 982, t + 290, 28, "Th\u1EBB - " + tagStr);
  shot(file, 300, 118, t + 25, 240, "\u1EA2nh - " + tagStr);
  tag(tagStr, 446, t + 66, hex, "Nh\u00E3n " + tagStr);
  emojiC(emo, 50, 920, t + 66, "Icon - " + tagStr);
  var T = text(line, F.B, 32, C.WHITE, 446, t + 150, { lead: 46, maxW: 500, name: "H\u1EE3p v\u1EDBi - " + tagStr });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
}
function m6() {
  var d = newDoc("Mac vs Win - 06 chot");
  placeSO(TN + "bg-mac.png", "N\u1EC1n");
  headN(6, "CH\u1ED0T K\u00C8O", "H\u00D2A 2 \u2013 2", "Kh\u00F4ng c\u00F3 m\u00E1y t\u1ED1t nh\u1EA5t, ch\u1EC9 c\u00F3 m\u00E1y h\u1EE3p nh\u1EA5t");
  pick2(420, "s6-mac.png", "CH\u1ECCN MAC", MACC, "\uD83C\uDF4E", "V\u0103n ph\u00F2ng, code,\rx\u00E0i iPhone");
  pick2(734, "s6-win.png", "CH\u1ECCN WIN", WINC, "\uD83E\uDE9F", "K\u1EF9 thu\u1EADt, k\u1EBF to\u00E1n,\rgame");
  note(1052, 96, "\uD83D\uDCA1", "Ph\u00E2n v\u00E2n th\u00EC mang nhu c\u1EA7u t\u1EDBi Poly,\rth\u1EED c\u1EA3 hai m\u00E1y tr\u01B0\u1EDBc khi ch\u1ED1t.");
  hookPill("B\u1EA1n thu\u1ED9c phe n\u00E0o?", HOOK_Y);
  save5(d, 6);
}

// ================= 7. K\u00CAU G\u1ECCI =================
function m7() {
  var d = newDoc("Mac vs Win - 07 keu goi");
  placeSO(TN + "bg-win.png", "N\u1EC1n");
  headN(7, "B\u00CCNH CH\u1ECCN", "MAC HAY WIN?", "Comment phe c\u1EE7a b\u1EA1n");
  photoCard("s7-mac.png", 98, 420, 430, 560, "MACBOOK", MACC);
  photoCard("s7-win.png", 552, 420, 430, 560, "WINDOWS", WINC);
  vs(540, 700);
  var T = text("Comment MAC hay WIN \u2014 phe n\u00E0o \u0111\u00F4ng?", F.B, 34, C.WHITE, 520, 1066, { align: Justification.CENTER, maxW: 820, name: "K\u00EAu g\u1ECDi comment" });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  var bt = bb(T);
  emojiC("\uD83D\uDE0E", 44, bt[2] + 32, 1054, "K\u00EAu g\u1ECDi - icon");
  var P = pillC("C\u1EA3 2 \u0111\u1EC1u c\u00F3 s\u1EB5n t\u1EA1i Poly", 540, 1170, 30, C.WHITE, C.GREEN_D, 36, 66, F.B, 0, "C\u00F3 s\u1EB5n t\u1EA1i Poly");
  fx(P, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 40, dist: 5, blur: 12 } });
  var A = pillC("POLY Store \u00B7 125/16/26 B\u00F9i \u0110\u00ECnh T\u00FAy, B\u00ECnh Th\u1EA1nh", 540, HOOK_Y, 26, C.WHITE, INKBG, 30, 58, F.B, 0, "\u0110\u1ECBa ch\u1EC9");
  A.fillOpacity = 85;
  fx(A, { stroke: { hex: C.GREEN_L, size: 2, op: 85, inside: true } });
  save5(d, 7);
}

// ---------- ch\u1EA1y ----------
var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5, 6, 7];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var LOG = "Fonts: T=" + F.T + " | B=" + F.B + " | serif=" + FS.T + " / " + FS.I + " | emoji=" + F.E + "\n";
var FN = [null, m1, m2, m3, m4, m5, m6, m7];
try {
  for (var k = 1; k <= 7; k++) if (want(k)) { FN[k](); LOG += "0" + k + " ok\n"; }
  plog("done.txt", LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU;
app.preferences.typeUnits = OLD_TU;
