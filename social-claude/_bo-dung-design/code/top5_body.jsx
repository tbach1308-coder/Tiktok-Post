
// ================= POST LAPTOP: TOP 5 LAPTOP CHO SINH VIÊN ĐỒ HỌA =================
var OUT5 = new Folder("E:/Social Claude/Laptop/T10_Laptop_Top5_DoHoa");
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
  var T = text(str, font, size, txtH, 0, cy + Math.round(size * 0.36), { track: track, name: name + " - chữ" });
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
// nền: ảnh thật làm mờ + lớp tối
function bgPhoto(file, imgW, cropL, cropT, cropW, blur, op) {
  var L = placeSO(file, "Ảnh nền");
  fitSO(L, imgW, cropL, cropT, cropW, 0, 0, W);
  gblur(blur);
  var O = rect(0, 0, W, H, 0, C.BLACK, "Lớp tối"); O.opacity = op;
}
// đầu slide: POLY STORE + nhãn xanh + tiêu đề Cookies + phụ đề
function head(n, pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, F.T, 96, C.WHITE, 540, 304, { align: Justification.CENTER, maxW: 880, name: "Tiêu đề" });
  fx(T, { stroke: { hex: C.GREEN_D, size: 9 }, shadow: { op: 45, dist: 7, blur: 12 } });
  var S = text(sub, F.B, 31, C.WHITE, 540, 374, { align: Justification.CENTER, maxW: 880, name: "Phụ đề" });
  fx(S, { shadow: { op: 60, dist: 2, blur: 6 } });
}
function glass(l, t, r, b, rad, name) {
  var G = rect(l, t, r, b, rad, C.WHITE, name); G.fillOpacity = 11;
  fx(G, { stroke: { hex: C.WHITE, size: 2, op: 40, inside: true } });
  return G;
}
function checkDot(cx, cy, r) {
  oval(cx - r, cy - r, cx + r, cy + r, C.GREEN, "Dấu tích - nền");
  check(cx, cy + 1, r * 1.05, C.WHITE);
}
function bullet(str, x, y, size) {
  checkDot(x + 17, y - Math.round(size * 0.34), 17);
  var T = text(str, F.B, size, C.WHITE, x + 46, y, { maxW: 960 - (x + 46), name: "Ý - " + str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  return T;
}
// ô phân tích (nền xanh nhạt)
function note(t, h, emo, str) {
  var K = rect(98, t, 982, t + h, 28, C.GREEN_SOFT, "Phân tích - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  emojiC(emo, 40, 142, t + h / 2, "Phân tích - icon");
  var T = text(str, F.B, 27, C.INK, 186, t + 40, { lead: 38, maxW: 958 - 186, name: "Phân tích" });
  centerY(T, t + h / 2);
}
// câu móc cuối slide
function hookPill(str, cy) {
  var T = text(str, F.B, 27, C.WHITE, 0, cy + 10, { name: "Câu móc - chữ" });
  var b = bb(T), tw = b[2] - b[0], ew = 40, total = tw + 12 + ew, l = 540 - total / 2;
  T.translate(l - b[0], 0);
  emojiC("👉", 34, l + tw + 12 + ew / 2, cy, "Câu móc - icon");
  var R = rect(l - 30, cy - 32, l + total + 30, cy + 32, 32, INKBG, "Câu móc - nền");
  R.fillOpacity = 80;
  fx(R, { stroke: { hex: C.GREEN_L, size: 2, op: 85, inside: true }, shadow: { op: 45, dist: 5, blur: 12 } });
  R.move(T, ElementPlacement.PLACEAFTER);
}
function labelChipDown(cx, cy, label, fillH, name) {
  var T = text(label, F.B, 26, C.WHITE, cx, cy + 9, { align: Justification.CENTER, name: name + " - chữ" });
  var b = bb(T), w = b[2] - b[0];
  T.translate(cx - (b[0] + b[2]) / 2, 0);
  var R = rect(cx - w / 2 - 24, cy - 26, cx + w / 2 + 24, cy + 26, 26, fillH, name + " - nền");
  var Tl = poly([[cx - 11, cy + 24], [cx + 11, cy + 24], [cx, cy + 40]], fillH, name + " - đuôi");
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 70 }, shadow: { op: 40, dist: 6, blur: 12 } });
  R.move(T, ElementPlacement.PLACEAFTER); Tl.move(R, ElementPlacement.PLACEAFTER);
}
// ảnh thật trong khung bo góc viền trắng
function photoFrame(file, imgW, cropL, cropT, cropW, l, t, w, h, name) {
  var K = rect(l, t, l + w, t + h, 32, C.WHITE, name + " - khung");
  fx(K, { stroke: { hex: C.WHITE, size: 5 }, shadow: { op: 55, dist: 10, blur: 24 } });
  var P = placeSO(file, name);
  fitSO(P, imgW, cropL, cropT, cropW, l, t, w);
  P.grouped = true;
}
// ảnh thật trong khung tròn
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
// vòng khoanh + số thứ tự
function ring(l, t, r, b, rad, hex, name) {
  var R = rect(l, t, r, b, rad, hex, name);
  R.fillOpacity = 0;
  fx(R, { stroke: { hex: hex, size: 6, inside: true }, shadow: { op: 55, dist: 3, blur: 8 } });
  return R;
}
function centerText(T, cx, cy) { var b = bb(T); T.translate(cx - (b[0] + b[2]) / 2, cy - (b[1] + b[3]) / 2); }
function badge(n, cx, cy, hex, name) {
  var O = oval(cx - 22, cy - 22, cx + 22, cy + 22, hex, name + " - nền");
  fx(O, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 50, dist: 3, blur: 8 } });
  centerText(text(String(n), F.B, 28, C.WHITE, cx, cy + 10, { align: Justification.CENTER, name: name + " - số" }), cx, cy);
}
function dotText(x, y, size, hex, ch, name) {
  var cy = y - Math.round(size * 0.34);
  oval(x, cy - 17, x + 34, cy + 17, hex, name + " - nền");
  centerText(text(ch, F.B, 22, C.WHITE, x + 17, y, { align: Justification.CENTER, name: name }), x + 17, cy);
}
function lineText(str, x, y, size) {
  var T = text(str, F.B, size, C.WHITE, x + 46, y, { maxW: 960 - (x + 46), name: "Ý - " + str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
}
function bulletN(n, hex, str, x, y, size) { dotText(x, y, size, hex, String(n), "Số " + n); lineText(str, x, y, size); }
function bulletW(str, x, y, size) { dotText(x, y, size, AMBER, "!", "Lưu ý"); lineText(str, x, y, size); }
// ảnh đã cắt sẵn đúng kích thước hiển thị: đặt 100%, khung bo góc viền trắng
function shot(file, w, l, t, h, name) { photoFrame(TN + file, w, 0, 0, w, l, t, w, h, name); }
function litKey(k, name) {
  var R = rect(k[0] + 8, k[1] + 8, k[2] - 8, k[3] - 8, 14, C.GREEN, name);
  R.blendMode = BlendMode.SCREEN; R.opacity = 78;
  fxGlow(R, { glow: { hex: C.GREEN_L, op: 85, size: 14 } });
}


// ---------- số liệu ----------
var M1_PRICE = "12.900.000đ", NEO_PRICE = "19.499.000đ", NEO_EDU = "16.999.000đ";
var CHENH = "2–4 triệu", NEO_LN = "15–17 triệu", M1_PIN = "trên 90%";
var NEO = "4F46E5", NEO_L = "A5B4FC", AIRC = C.GREEN_D;

function tag(str, x, cy, hex, name) {
  var T = text(str, F.B, 23, C.WHITE, x + 18, cy + 8, { track: 40, name: name + " - chữ" });
  var b = bb(T);
  var R = rect(x, cy - 21, b[2] + 18, cy + 21, 21, hex, name + " - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 70 }, shadow: { op: 40, dist: 3, blur: 8 } });
  R.move(T, ElementPlacement.PLACEAFTER);
}
function ctext(str, font, size, hex, cx, y, maxW, name) {
  var T = text(str, font, size, hex, cx, y, { align: Justification.CENTER, maxW: maxW, name: name || str.substr(0, 30) });
  fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  return T;
}
function photoCard(file, l, t, w, h, tagStr, hex) {
  shot(file, w, l, t, h, "Ảnh - " + tagStr);
  tag(tagStr, l + 16, t + 38, hex, "Nhãn " + tagStr);
}
// bảng so sánh 2 cột: nhãn ở giữa, giá trị Air bên trái, Neo bên phải
function compare(t, rows, rh, name) {
  var b = t + 24 + rows.length * rh;
  glass(98, t, 982, b, 28, name);
  for (var i = 0; i < rows.length; i++) {
    var cy = t + 12 + rh / 2 + i * rh;
    if (i > 0) { var Ln = rect(122, cy - rh / 2, 958, cy - rh / 2 + 2, 0, C.WHITE, "Kẻ dòng"); Ln.opacity = 18; }
    var r = rows[i];
    ctext(r[1], F.B, 27, r[3] || C.WHITE, 300, cy + 10, 300, "Air - " + r[0]);
    ctext(r[2], F.B, 27, r[4] || C.WHITE, 780, cy + 10, 300, "Neo - " + r[0]);
    pillC(r[0], 540, cy, 20, C.WHITE, "334155", 14, 34, F.B, 20, "Mục - " + r[0]);
  }
  return b;
}
function vs(cx, cy) {
  var O = oval(cx - 34, cy - 34, cx + 34, cy + 34, YEL, "VS - nền");
  fx(O, { stroke: { hex: C.WHITE, size: 4 }, shadow: { op: 55, dist: 4, blur: 10 } });
  centerText(text("VS", FS.T, 30, C.INK, cx, cy + 10, { align: Justification.CENTER, name: "VS" }), cx, cy);
}
var AMB = "FCD34D";


// đầu slide kiểu chữ có chân (đồng bộ với ảnh bìa)
function headN(n, pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 84, YEL, 540, 302, { align: Justification.CENTER, maxW: 880, name: "Tiêu đề" });
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 38, C.WHITE, 540, 372, { align: Justification.CENTER, maxW: 880, name: "Phụ đề" });
  fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
}


var RANKC = C.GREEN_D;
function placeAt(file, l, t, name) { var L = placeSO(file, name); var b = bb(L); L.translate(l - b[0], t - b[1]); return L; }
// huy hiệu hạng (#5..#1) tròn vàng
function rankBadge(str, cx, cy, r, size) {
  var O = oval(cx - r, cy - r, cx + r, cy + r, YEL, "Hạng - nền");
  fx(O, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 4, blur: 10 } });
  centerText(text(str, FS.T, size || 34, C.INK, cx, cy + 10, { align: Justification.CENTER, name: "Hạng " + str }), cx, cy);
}
// ô thông số: kính mờ, chữ trắng căn giữa (1 hoặc 2 dòng)
function specBox(t, lines) {
  var lh = 50, h = 34 + lines.length * lh;
  glass(98, t, 982, t + h, 26, "Thông số - nền");
  for (var i = 0; i < lines.length; i++) {
    var T = text(lines[i], F.B, 30, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Thông số " + (i + 1) });
    centerText(T, 540, t + 17 + lh / 2 + i * lh);
    fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  return t + h;
}
// slide xếp hạng
function rankSlide(n, rank, model, sub, img, tagStr, lines, hop, hook, bgFile) {
  var d = newDoc("Top5 do hoa - 0" + n);
  placeAt(TN + (bgFile || "bg.png"), 0, 0, "Nền");
  headN(n, "TOP " + rank, model, sub);
  shot(img, 884, 98, 420, 580, "Ảnh - " + tagStr);
  var y = specBox(1020, lines);
  note(y + 16, 96, "👉", hop);
  hookPill(hook, HOOK_Y);
  save5(d, n);
}

// ================= 1. BÌA =================
function t1() {
  var d = newDoc("Top5 do hoa - 01 bia");
  placeAt(TN + "bg.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("TOP 5 LAPTOP", FS.T, 118, YEL, 540, 0, { align: Justification.CENTER, maxW: 880, name: "Tiêu đề 1" });
  centerText(A, 540, 262);
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("CHO SINH VIÊN ĐỒ HỌA", FS.T, 66, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 880, name: "Tiêu đề 2" });
  centerText(B, 540, 376);
  fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  var S = text("Chọn sai là màu in ra lệch hết", FS.I, 44, C.WHITE, 0, 470, { name: "Mô tả" });
  var sb = bb(S), sw = sb[2] - sb[0] + 64; S.translate(540 - sw / 2 - sb[0], 0); sb = bb(S);
  fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  emojiC("😵", 46, sb[2] + 36, (sb[1] + sb[3]) / 2, "Mô tả - icon");
  // 3 ô hàng trên (#5 #4 #3) + 2 ô hàng dưới (#2 #1)
  var top = [["c-zenbook.png", "5"], ["c-nitro.png", "4"], ["c-xps.png", "3"]];
  for (var i = 0; i < 3; i++) {
    var l = 98 + i * (284 + 16);
    shot(top[i][0], 284, l, 560, 230, "Ô #" + top[i][1]);
    rankBadge("#" + top[i][1], l + 40, 600, 30, 24);
  }
  var bot = [["c-legion.png", "2"], ["c-7670-v2.png", "1"]];
  for (var j = 0; j < 2; j++) {
    var l2 = 98 + j * (434 + 16);
    shot(bot[j][0], 434, l2, 810, 280, "Ô #" + bot[j][1]);
    rankBadge("#" + bot[j][1], l2 + 44, 854, 34, 28);
  }
  hookPill("Vuốt xem máy đứng #1 là ai", HOOK_Y);
  save5(d, 1);
}
function t2() {
  rankSlide(2, "#5", "ASUS Zenbook 14 OLED", "Mỏng nhẹ, màu đẹp cho đồ họa 2D", "p-zenbook.png", "ZENBOOK 14 OLED",
    ["Màn OLED 2.8K, 100% DCI-P3 · mỏng nhẹ, pin tốt"],
    "Hợp 2D: Photoshop, Illustrator, Canva,\rngân sách thấp", "#4 có card rời làm được 3D");
}
function t3() {
  rankSlide(3, "#4", "Acer Nitro 5 Tiger", "Card rời RTX 3060, làm được 3D", "p-nitro.png", "NITRO 5 TIGER",
    ["Màn QHD 165Hz, 100% sRGB · RTX 3060 render nhanh"],
    "Hợp 3D, dựng video,\rchơi game được luôn", "#3 là máy đẹp nhất để gặp khách");
}
function t4() {
  rankSlide(4, "#3", "Dell XPS 15 OLED", "Màn đẹp, vỏ nhôm sang", "p-xps.png", "XPS 15 OLED",
    ["Màn OLED 3.5K · RTX 3050 Ti · vỏ nhôm sang"],
    "Hợp 2D + dựng video nhẹ,\rcần máy đẹp đi gặp khách", "#2 màn to, render nặng");
}
function t5() {
  rankSlide(5, "#2", "Lenovo Legion 5 Pro", "Màn 16 inch, RTX 3070 cân render", "p-legion.png", "LEGION 5 PRO",
    ["Màn 16\" 2.5K, 100% sRGB, 165Hz · RTX 3070"],
    "Hợp dựng video, render 3D nặng,\rmàn to làm việc đã", "#1 là máy trạm chuyên nghiệp");
}
function t6() {
  rankSlide(6, "#1", "Dell Precision 7670", "Máy trạm cho dân kỹ thuật", "p-7670-v2.png", "PRECISION 7670",
    ["i9 · RTX A3000 · RAM 64GB · SSD 1TB", "Driver chứng nhận cho AutoCAD, SolidWorks, Revit"],
    "Hợp kiến trúc, nội thất,\r3D chuyên sâu", "Muốn săn deal máy tốt mỗi ngày?");
  // sao cho hạng #1
}
// ================= 7. FOLLOW =================
function t7() {
  var d = newDoc("Top5 do hoa - 07 follow");
  placeAt(TN + "bg.png", 0, 0, "Nền");
  // cả khối căn giữa khung hình
  var S = text("Xem deal laptop mỗi ngày", FS.I, 56, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Phụ đề" });
  centerText(S, 540, 612);
  fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  var cy = 730;
  var T = text("+  Follow @polystorelaptop", F.B, 40, C.WHITE, 0, cy + 14, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 44, cy - 44, 540 + w / 2 + 44, cy + 44, 44, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  pillC("POLY Store · 125/16/26 Bùi Đình Túy, Bình Thạnh", 540, 850, 28, C.WHITE, INKBG, 30, 60, F.B, 0, "Địa chỉ");
  save5(d, 7);
}

var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5, 6, 7];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4, t5, t6, t7];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + " | emoji=" + F.E + "\n";
try {
  for (var k = 1; k <= 7; k++) if (want(k)) { FN[k](); LOG += "0" + k + " ok\n"; }
  plog("done.txt", LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
