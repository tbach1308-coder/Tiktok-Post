// =====================================================================
// poly-lib.jsx - THU VIEN DUNG CHUNG. Khong sua tay ban tren may cua tung bai.
// Can co truoc: var BAI (thu muc bai), var ONLY (mang so slide) - build.py tu chen.
// =====================================================================
// POLY STORE - thu vien dung slide (goc: bai 24-10 + bai pin 26-10)
// khong keo Photoshop len truoc: fen dang lam viec khac (28/10)
app.displayDialogs = DialogModes.NO;
var OLD_RU = app.preferences.rulerUnits, OLD_TU = app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var W = 1080, H = 1440;
var IMG = "E:/Social Claude/Anh tai ve/";
var OUT = new Folder(BAI);
if (!OUT.exists) OUT.create();
var LOGF = new Folder(OUT.fsName + "/log"); if (!LOGF.exists) LOGF.create();
var TN = new Folder(OUT.fsName + "/tai-nguyen"); if (!TN.exists) TN.create();

function writeFile(name, s) {
  var LG = new Folder(OUT.fsName + "/log"); if (!LG.exists) LG.create();
  var f = new File(LG.fsName + "/" + name);
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
    [cx + 0.32 * k, cy - 0.42 * k], [cx + 0.5 * k, cy - 0.24 * k], [cx - 0.12 * k, cy + 0.38 * k]], h, "Dấu tích");
}
function spark(ax, ay, angDeg, r0, len, th, h) {
  var a = angDeg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  var px = -sa * th / 2, py = ca * th / 2;
  var x1 = ax + ca * r0, y1 = ay + sa * r0, x2 = ax + ca * (r0 + len), y2 = ay + sa * (r0 + len);
  return poly([[x1 + px, y1 + py], [x2 + px, y2 + py], [x2 - px, y2 - py], [x1 - px, y1 - py]], h, "Tia sáng");
}
function arrowH(x1, x2, y, th, hl, hw, h, name) {
  return poly([[x1, y - th / 2], [x2 - hl, y - th / 2], [x2 - hl, y - hw / 2], [x2, y],
    [x2 - hl, y + hw / 2], [x2 - hl, y + th / 2], [x1, y + th / 2]], h, name || "Mũi tên");
}
function bb(L) { var b = L.bounds; return [b[0].as("px"), b[1].as("px"), b[2].as("px"), b[3].as("px")]; }
var LAST = 0;
// Tạo lớp chữ bằng 1 lệnh ActionManager (nhanh gấp ~10 lần cách DOM cũ: mỗi lần gán textItem.x Photoshop dàn chữ lại 1 lần).
// Lỗi gì thì quay về cách DOM cũ (textDOM) nên không bao giờ hỏng bài.
var TEXT_AM = true;
function textAM(str, font, size, h, x, y, lead, track, align) {
  var s2t = stringIDToTypeID, c2t = charIDToTypeID;
  var d = new ActionDescriptor(), r = new ActionReference();
  r.putClass(s2t("textLayer"));
  d.putReference(c2t("null"), r);
  var tl = new ActionDescriptor();
  tl.putString(s2t("textKey"), str);
  var pt = new ActionDescriptor();
  pt.putUnitDouble(c2t("Hrzn"), c2t("#Prc"), x / W * 100);
  pt.putUnitDouble(c2t("Vrtc"), c2t("#Prc"), y / H * 100);
  tl.putObject(s2t("textClickPoint"), c2t("Pnt "), pt);
  var st = new ActionDescriptor();
  st.putString(s2t("fontPostScriptName"), font);
  st.putUnitDouble(s2t("size"), c2t("#Pnt"), size);
  st.putBoolean(s2t("autoLeading"), false);
  st.putUnitDouble(s2t("leading"), c2t("#Pnt"), lead);
  st.putInteger(s2t("tracking"), track || 0);
  st.putObject(s2t("color"), s2t("RGBColor"), rgbDesc(h));
  var sr = new ActionDescriptor();
  sr.putInteger(s2t("from"), 0); sr.putInteger(s2t("to"), str.length);
  sr.putObject(s2t("textStyle"), s2t("textStyle"), st);
  var sl = new ActionList(); sl.putObject(s2t("textStyleRange"), sr);
  tl.putList(s2t("textStyleRange"), sl);
  var ps = new ActionDescriptor();
  ps.putEnumerated(s2t("align"), s2t("alignmentType"), s2t(align == Justification.CENTER ? "center" : (align == Justification.RIGHT ? "right" : "left")));
  var pr = new ActionDescriptor();
  pr.putInteger(s2t("from"), 0); pr.putInteger(s2t("to"), str.length);
  pr.putObject(s2t("paragraphStyle"), s2t("paragraphStyle"), ps);
  var pl = new ActionList(); pl.putObject(s2t("paragraphStyleRange"), pr);
  tl.putList(s2t("paragraphStyleRange"), pl);
  d.putObject(c2t("Usng"), s2t("textLayer"), tl);
  executeAction(c2t("Mk  "), d, DialogModes.NO);
  return app.activeDocument.activeLayer;
}
function textDOM(str, font, size, h, x, y, lead, track, align) {
  var L = app.activeDocument.artLayers.add();
  L.kind = LayerKind.TEXT;
  var t = L.textItem;
  t.contents = str; t.font = font; t.size = size; t.color = col(h);
  t.useAutoLeading = false; t.leading = lead; t.tracking = track || 0;
  t.justification = align || Justification.LEFT; t.position = [x, y];
  return L;
}
function text(str, font, size, h, x, y, o) {
  o = o || {};
  var lead = o.lead || Math.round(size * 1.2), L = null;
  if (TEXT_AM) { try { L = textAM(str, font, size, h, x, y, lead, o.track, o.align); } catch (e) { TEXT_AM = false; RUN += "   (chữ: quay về cách cũ - " + e.message + ")\n"; } }
  if (!L) L = textDOM(str, font, size, h, x, y, lead, o.track, o.align);
  L.name = o.name || str.replace(/\r/g, " ").substr(0, 40);
  var s = size;
  if (o.maxW) {
    // co chữ theo đúng dãy cỡ cũ (mỗi bước x0.96) nhưng không đo từng bước: đoán bước vừa (chữ rộng tỉ lệ cỡ), đo bước đó và bước trước nó
    var b = bb(L), w0 = b[2] - b[0];
    if (w0 > o.maxW) {
      var t = L.textItem, seq = [size];
      while (seq.length < 31 && w0 * seq[seq.length - 1] / size > o.maxW) seq.push(Math.floor(seq[seq.length - 1] * 0.96));
      var setS = function (v) { t.size = v; t.leading = Math.round((o.lead || size * 1.2) * v / size); var q = bb(L); return q[2] - q[0]; };
      var k = seq.length - 1, done = false;
      if (k >= 2 && setS(seq[k - 1]) <= o.maxW) { s = seq[k - 1]; done = true; }
      if (!done) {
        var v = seq[k], wv = setS(v), g = k;
        while (wv > o.maxW && g < 30) { v = Math.floor(v * 0.96); wv = setS(v); g++; }
        s = v;
      }
    }
  }
  LAST = s;
  return L;
}
function centerY(L, cy) { var b = bb(L); L.translate(0, cy - (b[1] + b[3]) / 2); }
function pill(str, x, cy, size, txtH, fillH, padX, hgt, font, track, name) {
  var T = text(str, font, size, txtH, x + padX, cy + Math.round(size * 0.36), { track: track, name: name + " - chữ" });
  var b = bb(T);
  T.translate(x + padX - b[0], 0);
  b = bb(T);
  var P = rect(x, cy - hgt / 2, b[2] + padX, cy + hgt / 2, hgt / 2, fillH, name);
  P.move(T, ElementPlacement.PLACEAFTER);
  return b[2] + padX;
}
// layer style: stroke + bóng đổ
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
// ảnh: vùng cắt (cropL, cropT, cropW trên ảnh gốc rộng imgW) đặt vào (dstL, dstT) rộng dstW
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
  var L = placeSO(IMG + file, "Ảnh nền - " + file);
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W); L.rasterize(RasterizeType.ENTIRELAYER); // ảnh nền thành ảnh thường rồi mới mờ: ảnh ra y hệt, PSD nhẹ ~1/2 (đo 29/10)
  gblur(blurR || 5);
  var O = rect(0, 0, W, H, 0, C.BLACK, "Lớp tối");
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


// ---------- THUMBNAIL ----------
function pillC(str, cx, cy, size, txtH, fillH, padX, hgt, font, track, name) {
  var T = text(str, font, size, txtH, 0, cy + Math.round(size * 0.36), { track: track, name: name + " - chữ" });
  var b = bb(T), w = b[2] - b[0];
  T.translate(cx - w / 2 - b[0], 0);
  var P = rect(cx - w / 2 - padX, cy - hgt / 2, cx + w / 2 + padX, cy + hgt / 2, hgt / 2, fillH, name);
  P.move(T, ElementPlacement.PLACEAFTER);
}
function iconAt(cx, top) {
  var l = cx - 70;
  var T = rect(l, top, l + 140, top + 140, 36, C.WHITE, "Icon - nền");
  fx(T, { shadow: { op: 35, dist: 8, blur: 22 } });
  rect(l + 28, top + 26, l + 92, top + 90, 14, C.GREEN_PALE, "Icon - giấy sau");
  rect(l + 44, top + 42, l + 116, top + 114, 17, C.WHITE, "Icon - viền");
  rect(l + 48, top + 46, l + 112, top + 110, 14, C.GREEN, "Icon - giấy trước");
  rect(l + 62, top + 66, l + 98, top + 74, 4, C.WHITE, "Icon - dòng 1");
  rect(l + 62, top + 82, l + 88, top + 90, 4, C.WHITE, "Icon - dòng 2");
}


// ---------- cắt nền ảnh thật ----------
function applyMask() {
  var d = new ActionDescriptor(), r = new ActionReference();
  r.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
  d.putReference(charIDToTypeID("null"), r);
  d.putBoolean(charIDToTypeID("Aply"), true);
  executeAction(charIDToTypeID("Dlt "), d, DialogModes.NO);
}
function maskFromSelection() {
  var m = new ActionDescriptor(), r = new ActionReference();
  m.putClass(charIDToTypeID("Nw  "), charIDToTypeID("Chnl"));
  r.putEnumerated(charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk "));
  m.putReference(charIDToTypeID("At  "), r);
  m.putEnumerated(charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS"));
  executeAction(charIDToTypeID("Mk  "), m, DialogModes.NO);
}
var CUTLOG = "";
// mở ảnh, cắt vùng, tách nền, cắt sát, chép sang tài liệu đích
function cutout(file, crop, maxW, target, name) {
  var src = app.open(new File(file));
  src.crop([crop[0], crop[1], crop[2], crop[3]]);
  if (src.width.as("px") > maxW) src.resizeImage(UnitValue(maxW, "px"), null, null, ResampleMethod.BICUBIC);
  src.activeLayer.isBackgroundLayer = false;
  var ok = false;
  try { executeAction(stringIDToTypeID("removeBackground"), undefined, DialogModes.NO); ok = true; CUTLOG += name + ": removeBackground\n"; } catch (e1) { CUTLOG += name + ": removeBackground lỗi " + e1.message + "\n"; }
  if (!ok) {
    var dd = new ActionDescriptor(); dd.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
    executeAction(stringIDToTypeID("autoCutout"), dd, DialogModes.NO);
    maskFromSelection();
    CUTLOG += name + ": autoCutout\n";
  }
  applyMask();
  src.trim(TrimType.TRANSPARENT, true, true, true, true);
  var L = src.activeLayer.duplicate(target, ElementPlacement.PLACEATBEGINNING);
  src.close(SaveOptions.DONOTSAVECHANGES);
  app.activeDocument = target;
  target.activeLayer = L;
  executeAction(stringIDToTypeID("newPlacedLayer"), undefined, DialogModes.NO);
  L = target.activeLayer;
  L.name = name;
  return L;
}
// đặt vừa khung (l,t,r,b), canh giữa
function fitBox(L, l, t, r, b) {
  var bx = bb(L), w = bx[2] - bx[0], h = bx[3] - bx[1];
  var s = Math.min((r - l) / w, (b - t) / h) * 100;
  L.resize(s, s, AnchorPosition.MIDDLECENTER);
  bx = bb(L);
  L.translate((l + r) / 2 - (bx[0] + bx[2]) / 2, (t + b) / 2 - (bx[1] + bx[3]) / 2);
  return bb(L);
}


function arrow(x1, y1, x2, y2, th, hl, hw, h, name) {
  var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  function P(s, t) { return [x1 + ux * s + nx * t, y1 + uy * s + ny * t]; }
  return poly([P(0, -th / 2), P(L - hl, -th / 2), P(L - hl, -hw / 2), P(L, 0), P(L - hl, hw / 2), P(L - hl, th / 2), P(0, th / 2)], h, name || "Mũi tên");
}
// nhãn bước: [số trong vòng tròn] + chữ, có đuôi chỉ xuống
function stepChip(cx, cy, num, label, fillH, numFill, numTxt, name) {
  var g = app.activeDocument.layerSets.add(); g.name = name;
  var T = text(label, F.B, 30, C.WHITE, 0, cy + 11, { name: name + " - chữ" });
  var b = bb(T), w = b[2] - b[0];
  var cw = 60 + w + 26, x0 = Math.round(cx - cw / 2), x1 = x0 + cw;
  T.translate(x0 + 60 - b[0], 0);
  var R = rect(x0, cy - 30, x1, cy + 30, 30, fillH, name + " - nền");
  var Tl = poly([[cx - 13, cy + 28], [cx + 13, cy + 28], [cx, cy + 46]], fillH, name + " - đuôi");
  var O = oval(x0 + 8, cy - 22, x0 + 52, cy + 22, numFill, name + " - vòng số");
  var N = text(num, F.B, 28, numTxt, x0 + 30, cy + 10, { align: Justification.CENTER, name: name + " - số" });
  R.move(g, ElementPlacement.INSIDE); Tl.move(g, ElementPlacement.INSIDE); O.move(g, ElementPlacement.INSIDE);
  N.move(g, ElementPlacement.INSIDE); T.move(g, ElementPlacement.INSIDE);
  // thứ tự: nền dưới cùng
  Tl.move(R, ElementPlacement.PLACEAFTER);
  fx(R, { shadow: { op: 40, dist: 6, blur: 12 } });
  return [x0, cy - 30, x1, cy + 30];
}



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
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W); L.rasterize(RasterizeType.ENTIRELAYER); // ảnh nền thành ảnh thường rồi mới mờ: ảnh ra y hệt, PSD nhẹ ~1/2 (đo 29/10)
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



// ================= ENGINE DO KHUNG + THE ANH + HUY HIEU (da va loi 26/10) =================
var YEL2 = "FFD200", NAVY = "0E1A2B", RED = "E4484B", MINT = "D8F3E2";
var BATT = "🔋";
function want(n) { if (!ONLY.length) return true; for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == n) return true; return false; }
var RUN = "";

// ---------- đo khung thật, BỎ QUA viền và bóng đổ ----------
function bndsNE(L) {
  app.activeDocument.activeLayer = L;
  var r = new ActionReference();
  r.putProperty(stringIDToTypeID("property"), stringIDToTypeID("boundsNoEffects"));
  r.putEnumerated(stringIDToTypeID("layer"), stringIDToTypeID("ordinal"), stringIDToTypeID("targetEnum"));
  var d = executeActionGet(r).getObjectValue(stringIDToTypeID("boundsNoEffects"));
  var l = d.getUnitDoubleValue(stringIDToTypeID("left")), t = d.getUnitDoubleValue(stringIDToTypeID("top"));
  var rr = d.getUnitDoubleValue(stringIDToTypeID("right")), b = d.getUnitDoubleValue(stringIDToTypeID("bottom"));
  return { l: l, t: t, r: rr, b: b, w: rr - l, h: b - t };
}
function unionNE(ls) {
  var l = 99999, t = 99999, r = -99999, b = -99999;
  for (var i = 0; i < ls.length; i++) {
    var x = bndsNE(ls[i]);
    if (x.l < l) l = x.l; if (x.t < t) t = x.t; if (x.r > r) r = x.r; if (x.b > b) b = x.b;
  }
  return { l: l, t: t, r: r, b: b, w: r - l, h: b - t };
}
// Một khối = danh sách layer + (tuỳ chọn) layer dùng để ĐO.
// Ảnh trong thẻ bị cắt bằng clipping nên khung layer của nó to hơn thẻ
// -> phải đo theo layer khung, không đo cả cụm.
function blk(ls, m) { return { ls: ls, m: m || null }; }
function blkBox(b) { return b.m ? bndsNE(b.m) : unionNE(b.ls); }
// dời cả khối 1 lệnh (chọn hết lớp theo id rồi move) thay vì dời từng lớp; lỗi thì dời từng lớp như cũ
var MOVE_AM = true;
function moveLayers(ls, dx, dy) {
  if (!ls.length || (!dx && !dy)) return;
  if (MOVE_AM) {
    var doc = app.activeDocument, prev = doc.activeLayer;
    try {
      var c2t = charIDToTypeID, r = new ActionReference(), seen = {};
      for (var i = 0; i < ls.length; i++) { var id = ls[i].id; if (!seen[id]) { seen[id] = 1; r.putIdentifier(c2t("Lyr "), id); } }
      var d = new ActionDescriptor(); d.putReference(c2t("null"), r); d.putBoolean(c2t("MkVs"), false);
      executeAction(c2t("slct"), d, DialogModes.NO);
      var m = new ActionDescriptor(), r2 = new ActionReference();
      r2.putEnumerated(c2t("Lyr "), c2t("Ordn"), c2t("Trgt"));
      m.putReference(c2t("null"), r2);
      var o = new ActionDescriptor();
      o.putUnitDouble(c2t("Hrzn"), c2t("#Pxl"), dx); o.putUnitDouble(c2t("Vrtc"), c2t("#Pxl"), dy);
      m.putObject(c2t("T   "), c2t("Ofst"), o);
      executeAction(c2t("move"), m, DialogModes.NO);
      doc.activeLayer = prev;
      return;
    } catch (e) { MOVE_AM = false; RUN += "   (dời khối: quay về cách cũ - " + e.message + ")\n"; try { doc.activeLayer = prev; } catch (e2) {} }
  }
  for (var j = 0; j < ls.length; j++) ls[j].translate(dx, dy);
}
function moveBlk(b, top) {
  var u = blkBox(b), dy = top - u.t;
  moveLayers(b.ls, 0, Math.round(dy));
}
// chia đều phần trống giữa các khối trong dải TOP..BOT
function spread(blocks, TOP, BOT) {
  var hs = [], tot = 0, i;
  for (i = 0; i < blocks.length; i++) { var h = blkBox(blocks[i]).h; hs.push(h); tot += h; }
  RUN += "   cao tung khoi: " + hs.join(" / ") + "\n";
  var gap = blocks.length > 1 ? (BOT - TOP - tot) / (blocks.length - 1) : 0;
  var cur = TOP;
  for (i = 0; i < blocks.length; i++) { moveBlk(blocks[i], cur); cur += hs[i] + gap; }
  return Math.round(gap);
}
// khoảng cách cố định rồi căn giữa cả cụm (dùng cho slide CTA)
function centerGroup(blocks, gap, TOP, BOT) {
  var hs = [], tot = 0, i;
  for (i = 0; i < blocks.length; i++) { var h = blkBox(blocks[i]).h; hs.push(h); tot += h; }
  var total = tot + gap * (blocks.length - 1);
  var cur = (TOP + BOT) / 2 - total / 2;
  for (i = 0; i < blocks.length; i++) { moveBlk(blocks[i], cur); cur += hs[i] + gap; }
}

// ---------- khung và lề ----------
var CXc = 540, LX = 180, RX = 900, CW = 720;
// Luoi an toan truoc khi luu: bo nay KHONG dung clipping chu y o dau ca, nen go het
// moi clipping vo tinh (layer tao sau bi dinh vao nhom cat cua layer khac).
function unclipAll(doc) {
  var n = 0;
  for (var i = 0; i < doc.layers.length; i++) {
    try { if (doc.layers[i].grouped) { doc.layers[i].grouped = false; n++; } } catch (e) {}
  }
  return n;
}
var _saveGoc = save;
save = function (doc, n) { var k = unclipAll(doc); if (k) RUN += "   slide " + n + ": go " + k + " clipping vo tinh\n"; _saveGoc(doc, n); };
var BODY_TOP = 470, BODY_BOT = 1300;
// Dung khoi o giua canvas roi moi xep: toa do am lam Photoshop do khung sai.
var Y0 = 640, TOP0 = 520;

// ---------- biểu tượng đầu dòng ----------
function crossMark(cx, cy, k, h) {
  // Hai net ve chung MOT layer (chon them vung roi to mot lan) - tach 2 layer thi khi
  // dua len dinh tai lieu co luc mat mot net, dau X thanh mot vach ngang.
  var t = 0.17 * k, a = 0.40 * k, doc = app.activeDocument;
  var L = doc.artLayers.add(); L.name = "Dấu X";
  doc.selection.select([[cx - a - t, cy - a + t], [cx - a + t, cy - a - t], [cx + a + t, cy + a - t], [cx + a - t, cy + a + t]], SelectionType.REPLACE, 0, true);
  doc.selection.select([[cx + a - t, cy - a - t], [cx + a + t, cy - a + t], [cx - a + t, cy + a + t], [cx - a - t, cy + a - t]], SelectionType.EXTEND, 0, true);
  doc.selection.fill(col(h));
  doc.selection.deselect();
  return [L];
}
function bangMark(cx, cy, k, h) {
  return [rect(cx - 0.085 * k, cy - 0.44 * k, cx + 0.085 * k, cy + 0.12 * k, 0.085 * k, h, "Dấu chấm than - thân"),
          oval(cx - 0.10 * k, cy + 0.24 * k, cx + 0.10 * k, cy + 0.44 * k, h, "Dấu chấm than - chấm")];
}
function dotIcon(kind, cx, cy, r) {
  var fill = kind == "check" ? C.GREEN : (kind == "x" ? RED : AMBER);
  var out = [oval(cx - r, cy - r, cx + r, cy + r, fill, "Biểu tượng - nền")];
  if (kind == "check") out.push(check(cx, cy + 1, r * 1.05, C.WHITE));
  else if (kind == "x") out = out.concat(crossMark(cx, cy, r * 1.25, C.WHITE));
  else out = out.concat(bangMark(cx, cy, r * 1.6, C.WHITE));
  return out;
}
// một dòng ý: biểu tượng tròn + chữ
function li(kind, str, x, y, size, maxW) {
  var out = dotIcon(kind, x + 18, y - Math.round(size * 0.34), 18);
  var T = text(str, F.B, size, C.WHITE, x + 50, y, { maxW: maxW, name: "Ý - " + str.substr(0, 28) });
  fx(T, { shadow: { op: 62, dist: 2, blur: 7 } });
  out.push(T);
  return out;
}

// ---------- thẻ ảnh ----------
// ảnh phủ kín khung, phần thừa bị cắt bằng clipping
function cardCover(file, l, t, r, b, rad, name) {
  var Fr = rect(l, t, r, b, rad, C.WHITE, name + " - khung");
  fx(Fr, { shadow: { op: 52, dist: 9, blur: 24 } });
  var L = placeSO(A + file, name);
  var bx = bb(L), w = bx[2] - bx[0], h = bx[3] - bx[1];
  var s = Math.max((r - l) / w, (b - t) / h) * 100;
  L.resize(s, s, AnchorPosition.MIDDLECENTER); bx = bb(L);
  L.translate((l + r) / 2 - (bx[0] + bx[2]) / 2, (t + b) / 2 - (bx[1] + bx[3]) / 2);
  L.grouped = true;
  return blk([Fr, L], Fr);
}
// ảnh chụp màn hình: vừa trọn, không cắt. Khung tự tính theo tỉ lệ ảnh.
// Khoanh vien xanh vao dung mot vung cua anh chup man hinh.
// x0,y0,x1,y1 tinh theo pixel cua chinh file anh, ham tu quy ra toa do canvas.
// Do THANG vung anh da ve tren canvas roi quy doi, khong tin so khai bao.
// x0,y0,x1,y1 tinh theo he toa do imgW x imgH cua chinh file anh do.
function markOn(Img, imgW, imgH, x0, y0, x1, y1, rad, name) {
  var ib = bndsNE(Img);
  var sx = ib.w / imgW, sy = ib.h / imgH;
  // bndsNE vua chon Img lam layer hien hanh -> vong khoanh sinh ra NGAY TREN anh
  var M = rect(ib.l + x0 * sx, ib.t + y0 * sy, ib.l + x1 * sx, ib.t + y1 * sy, rad || 14, C.GREEN, name);
  M.fillOpacity = 0;
  fx(M, { stroke: { hex: C.GREEN, size: 5 } });
  return M;
}
function cardShot(file, cx, top, w, imgW, imgH, pad, rad, name, marks) {
  // Dat anh TRUOC de lay ti le that; khai sai so do thi khung van khop anh.
  var L = placeSO(A + file, name);
  var rb = bb(L), ih = Math.round((w - pad * 2) * (rb[3] - rb[1]) / (rb[2] - rb[0]));
  var l = Math.round(cx - w / 2), r = l + w, t = top, b = top + ih + pad * 2;
  var Fr = rect(l, t, r, b, rad, C.WHITE, name + " - khung");
  fx(Fr, { shadow: { op: 52, dist: 9, blur: 24 } });
  Fr.move(L, ElementPlacement.PLACEAFTER);
  fitBox(L, l + pad, t + pad, r - pad, b - pad);
  var ls = [Fr, L];
  if (marks) for (var i = 0; i < marks.length; i++)
    ls.push(markOn(L, imgW, imgH, marks[i][0], marks[i][1], marks[i][2], marks[i][3], marks[i][4],
                   name + " - khoanh " + (i + 1)));
  return blk(ls, Fr);
}
// Huy hieu tron o goc tren-trai cua the: so buoc (1, 2) hoac dau nen/khong nen.
// Tao tren CUNG cua tai lieu va go clipping, khong thi bi nhet vao nhom cat cua the ben canh.
function badgeTop() { app.activeDocument.activeLayer = app.activeDocument.layers[0]; }
function unclip(ls) { for (var i = 0; i < ls.length; i++) { try { ls[i].grouped = false; } catch (e) {} } return ls; }
// Dua tung layer len dinh tai lieu theo thu tu (phan tu sau nam tren phan tu truoc), roi go clipping.
// Khong tin vao viec "tao phia tren layer dang chon" - da hong 1 lan: huy hieu bi nam duoi anh.
function toTop(ls) {
  var d = app.activeDocument, i;
  for (i = 0; i < ls.length; i++) { try { ls[i].move(d, ElementPlacement.PLACEATBEGINNING); } catch (e) {} }
  for (i = 0; i < ls.length; i++) { try { ls[i].grouped = false; } catch (e) {} }
  // QUAN TRONG: chon layer tren cung. Neu de vong tron huy hieu dang duoc chon, layer tao sau
  // se chen vao giua no va dau X -> bi dinh clipping va bien mat (da mac o slide 3).
  d.activeLayer = ls[ls.length - 1];
  return ls;
}
// off: tam huy hieu cach goc the (mac dinh 32 = nam trong the; ~6 = dan o goc, khong de len chu trong anh).
function numBadge(Fr, n, off) {
  if (off == null) off = 32;
  var b = bndsNE(Fr), r = 24, cx = b.l + off, cy = b.t + off;
  badgeTop();
  var O = oval(cx - r, cy - r, cx + r, cy + r, C.GREEN, "Bước " + n + " - nền");
  fx(O, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 45, dist: 3, blur: 8 } });
  var T = text(String(n), F.B, 30, C.WHITE, cx, cy + 11, { align: Justification.CENTER, name: "Bước " + n + " - số" });
  var tb = bb(T); T.translate(cx - (tb[0] + tb[2]) / 2, cy - (tb[1] + tb[3]) / 2);
  return toTop([O, T]);
}
function cornerIcon(Fr, kind) {
  var b = bndsNE(Fr), r = 26, cx = b.l + 36, cy = b.t + 36;
  badgeTop();
  var out = dotIcon(kind, cx, cy, r);
  fx(out[0], { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 45, dist: 3, blur: 8 } });
  return toTop(out);
}

// Anh da bo goc san bang Python, dung dung ti le khung -> dat vao la khop, KHONG clipping.
// (clipping lam cac layer tao sau bi "dinh" vao nhom cat cua the ben canh va bien mat)
function cardPhoto(file, l, t, r, b, rad, name) {
  var Fr = rect(l, t, r, b, rad, C.WHITE, name + " - khung");
  fx(Fr, { shadow: { op: 52, dist: 9, blur: 24 } });
  var L = placeSO(A + file, name);
  fitBox(L, l, t, r, b);
  return blk([Fr, L], Fr);
}
// Nguyen chiec may (anh nen trong suot) + vong khoanh, khong khung trang
function shotDevice(file, cx, top, w, imgW, imgH, name, marks) {
  var h = Math.round(w * imgH / imgW), l = Math.round(cx - w / 2);
  var L = placeSO(A + file, name);
  fitBox(L, l, top, l + w, top + h);
  fx(L, { shadow: { op: 60, dist: 16, blur: 36 } });
  var ls = [L];
  if (marks) for (var i = 0; i < marks.length; i++)
    ls.push(markOn(L, imgW, imgH, marks[i][0], marks[i][1], marks[i][2], marks[i][3], marks[i][4], name + " - khoanh " + (i + 1)));
  return blk(ls, L);
}

// ảnh tròn có viền
function photoRound(file, cx, cy, r, name) {
  var L = placeAt(file, "Ảnh đời thực - " + name, cx, cy, 2 * r);
  var Rg = oval(cx - r, cy - r, cx + r, cy + r, C.WHITE, "Viền - " + name);
  Rg.fillOpacity = 0;
  fx(Rg, { stroke: { hex: C.WHITE, size: 5 }, shadow: { op: 55, dist: 8, blur: 16 } });
  return blk([L, Rg], Rg);
}

// ---------- hàng chip ----------
function chipLine(items, cx, cy, size, padX, hgt, gapX) {
  var ls = [], ws = [], tot = 0, i, T, b, out = [];
  for (i = 0; i < items.length; i++) {
    T = text(items[i], F.R, size, C.WHITE, 0, cy + Math.round(size * 0.35), { name: "Chip - " + items[i] });
    b = bb(T); ls.push(T); ws.push(b[2] - b[0] + padX * 2); tot += b[2] - b[0] + padX * 2;
  }
  tot += gapX * (items.length - 1);
  var x = cx - tot / 2;
  for (i = 0; i < items.length; i++) {
    b = bb(ls[i]);
    ls[i].translate(x + padX - b[0], 0);
    var R = rect(x, cy - hgt / 2, x + ws[i], cy + hgt / 2, hgt / 2, C.WHITE, "Chip - nền - " + items[i]);
    R.fillOpacity = 15;
    fx(R, { stroke: { hex: C.WHITE, size: 2, op: 38, inside: true } });
    R.move(ls[i], ElementPlacement.PLACEAFTER);
    out.push(R); out.push(ls[i]);
    x += ws[i] + gapX;
  }
  return out;
}

// ---------- khoi danh sach y: cac dong CACH DEU CO DINH, nen kinh mo phia sau ----------
// Moi dong la 1 khoi rieng thi spread keo gian -> thua, xau (anh Hoai da che). Gom lai 1 khoi.
// items: [[kind, chu, co chu], ...]  kind: "check" | "x" | "bang"
var LI_PITCH = 62;
function liGroup(items, top, name) {
  var padX = 30, padY = 26, x = LX + padX, maxW = CW - padX * 2 - 50;
  var ls = [], first = null;
  for (var i = 0; i < items.length; i++) {
    var line = li(items[i][0], items[i][1], x, top + padY + 30 + i * LI_PITCH, items[i][2] || 30, maxW);
    if (!first) first = line[0];
    ls = ls.concat(line);
  }
  var u = unionNE(ls);
  var P = rect(LX, u.t - padY, RX, u.b + padY, 26, C.WHITE, name || "Khung ý");
  P.fillOpacity = 10;
  fx(P, { stroke: { hex: C.WHITE, size: 2, op: 32, inside: true } });
  P.move(first, ElementPlacement.PLACEAFTER);           // nen nam duoi dong dau tien
  return blk([P].concat(ls), P);
}
// Than bai: khoang cach co dinh (toi da 60) roi CAN GIUA ca cum trong dai duoi tieu de.
// Dung thay spread cho slide noi dung - spread chia het cho khoang trong nen hay bi thua.
var BODY_TOP2 = 450;
function bodyFit(blocks, gapMax) {
  var tot = 0;
  for (var i = 0; i < blocks.length; i++) tot += blkBox(blocks[i]).h;
  var g = blocks.length > 1 ? Math.min(gapMax || 60, (BODY_BOT - BODY_TOP2 - tot) / (blocks.length - 1)) : 0;
  if (g < 24) g = 24;
  centerGroup(blocks, g, BODY_TOP2, BODY_BOT);
  return Math.round(g);
}

// ---------- chip "xem tiếp" ----------
function nextChip(cx, cy, label, name) {
  var E = text(POINT, F.E, 30, C.WHITE, 0, cy, { name: name + " - biểu tượng" });
  var T = text(label, F.B, 28, C.WHITE, 0, cy, { name: name + " - chữ" });
  var be = bb(E), bt = bb(T);
  T.translate(be[2] + 16 - bt[0], 0);
  bt = bb(T); be = bb(E);
  E.translate(0, (bt[1] + bt[3]) / 2 - (be[1] + be[3]) / 2);   // emoji ngang tâm chữ
  var u = unionNE([E, T]), dx = cx - (u.l + u.r) / 2;          // căn giữa cả cụm
  E.translate(dx, 0); T.translate(dx, 0);
  u = unionNE([E, T]);
  var R = rect(u.l - 30, u.t - 17, u.r + 30, u.b + 17, (u.h + 34) / 2, C.BLACK, name + " - nền");
  R.fillOpacity = 50;
  fx(R, { stroke: { hex: C.GREEN_L, size: 2, op: 88, inside: true } });
  R.move(E, ElementPlacement.PLACEAFTER);
  return blk([R, E, T], R);
}

// ---------- box ghi chú nền mint ----------
function noteBox(lines, cx, top, w, name) {
  var pad = 30, lead = 46, size = 29;
  var h = pad * 2 + size + lead * (lines.length - 1);
  var l = Math.round(cx - w / 2);
  var R = rect(l, top, l + w, top + h, 22, MINT, name);
  fx(R, { shadow: { op: 42, dist: 6, blur: 16 } });
  var out = [R];
  for (var i = 0; i < lines.length; i++) {
    out.push(text(lines[i], F.B, size, NAVY, cx, top + pad + size - 6 + i * lead,
      { align: Justification.CENTER, maxW: w - 56, name: name + " - dòng " + (i + 1) }));
  }
  return blk(out, R);
}

// ---------- đầu slide nội dung ----------
function headC(n, bg, pillTxt, t, sub, op, blur) {
  var d = newDoc("Slide 0" + n);
  bgPhoto(bg[0], bg[1], bg[2], bg[3], bg[4], blur || 16, op || 70);
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, CXc, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, F.T, 92, C.WHITE, CXc, 312, { align: Justification.CENTER, maxW: CW, name: "Tiêu đề" });
  fx(T, { stroke: { hex: NAVY, size: 9 }, shadow: { op: 52, dist: 0, blur: 30 } });
  var S = text(sub, F.B, 31, C.WHITE, CXc, 386, { align: Justification.CENTER, maxW: CW, name: "Phụ đề" });
  fx(S, { shadow: { op: 62, dist: 2, blur: 7 } });
  return d;
}


// ================= HÀM HAY DÙNG (28/10: bài nào cũng tự viết lại 3 hàm này, đưa vào thư viện để khỏi viết) =================
// Bài tự khai hàm cùng tên thì bản của bài được dùng (khai sau đè khai trước).
// cặp chữ + emoji đặt liền nhau, căn giữa tại cx
function lineEmoji(str, em, size, cx, y, name) {
  var T = text(str, F.B, size, C.WHITE, 0, y, { name: name + " - chữ" });
  var E = text(em, F.E, size, C.WHITE, 0, y, { name: name + " - biểu tượng" });
  var bt = bb(T), be = bb(E);
  E.translate(bt[2] + 12 - be[0], 0);
  be = bb(E); E.translate(0, (bt[1] + bt[3]) / 2 - (be[1] + be[3]) / 2);
  var u = unionNE([T, E]), dx = cx - (u.l + u.r) / 2;
  T.translate(dx, 0); E.translate(dx, 0);
  fx(T, { shadow: { op: 55, dist: 2, blur: 8 } });
  return blk([T, E]);
}
// câu móc ghim tâm y 1266 (luật iPad). Dùng thì đặt BODY_BOT = 1266 - 34 - 48 để thân bài không chạm câu móc.
function hook(label) {
  var c = nextChip(CXc, Y0, label, "Chip xem tiếp");
  moveBlk(c, 1266 - blkBox(c).h / 2);
  return c;
}
// ảnh máy nền trong (đã tách nền), vừa khung, bóng đổ
function devIn(file, name, l, t, r, b) {
  var L = placeSO(A + file, name);
  fitBox(L, l, t, r, b);
  fx(L, { shadow: { op: 60, dist: 14, blur: 30 } });
  return L;
}


// ================= KET THUC: ghi log, KHONG hien hop thoai =================
// Claude doc log tim chu XONG thay vi chup man hinh + bam OK -> nhanh hon.
function ketThuc(tenLog) {
  writeFile(tenLog, "Fonts: T=" + F.T + " | B=" + F.B + " | R=" + F.R + " | E=" + F.E + " | Serif=" + FS.T + "\n" + RUN + "XONG\n");
  app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
}
