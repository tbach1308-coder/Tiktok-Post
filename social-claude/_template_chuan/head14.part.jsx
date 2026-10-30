#target photoshop
// POLY STORE - Carousel 14/10 "iPad A16 mới hay Air 5 likenew?" (theme Poly)
app.bringToFront();
app.displayDialogs = DialogModes.NO;
var OLD_RU = app.preferences.rulerUnits, OLD_TU = app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

var W = 1080, H = 1440;
var IMG = "E:/Social Claude/Anh tai ve/";
var OUT = new Folder("E:/Social Claude/T10_A16vsAir5_14");
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
  E: pick(["NotoColorEmoji-SVG", "SegoeUIEmoji"])
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
function text(str, font, size, h, x, y, o) {
  o = o || {};
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.kind = LayerKind.TEXT;
  var t = L.textItem;
  t.contents = str;
  t.font = font;
  t.size = size;
  t.color = col(h);
  t.useAutoLeading = false;
  t.leading = o.lead || Math.round(size * 1.2);
  t.tracking = o.track || 0;
  t.justification = o.align || Justification.LEFT;
  t.position = [x, y];
  L.name = o.name || str.replace(/\r/g, " ").substr(0, 40);
  var s = size;
  if (o.maxW) {
    var g = 0, b = bb(L);
    while ((b[2] - b[0]) > o.maxW && g < 30) {
      s = Math.floor(s * 0.96);
      t.size = s;
      t.leading = Math.round((o.lead || size * 1.2) * s / size);
      b = bb(L); g++;
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
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W);
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

