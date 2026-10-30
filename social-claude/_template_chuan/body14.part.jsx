
// ================= POST 14/10: iPAD A16 MỚI HAY AIR 5 LIKENEW? (theme Poly, chữ trắng + xanh viền đen) =================
var POINTE = "\uD83D\uDC49", RED = "EF4444", NB = "\u00A0", INK = "111827";
var P30 = "E:/Social Claude/T10_3iPadDangMua_30/tai-nguyen/anh-that/";
var P22 = "E:/Social Claude/T10_ButGiaRe_22/tai-nguyen/anh-that/";
function copyIn(src, name) {
  var s = new File(src), d = new File(A + (name || s.name));
  var AF = new Folder(A); if (!AF.exists) AF.create();
  if (d.exists) return;
  if (s.exists) { s.copy(d.fsName); LOG += "chep " + s.name + "\n"; } else LOG += "KHONG THAY " + src + "\n";
}
function head14(n, bg, pillTxt, pillFill, t, sub, tsize) {
  var d = newDoc("Slide 0" + n);
  bgPhoto(bg[0], bg[1], bg[2], bg[3], bg[4], 16, 62);
  text("POLY STORE", F.B, 22, C.WHITE, 84, 112, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, pillFill || C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, F.T, tsize || 100, C.WHITE, 540, 312, { align: Justification.CENTER, maxW: 900, name: "Tiêu đề" });
  fx(T, { stroke: { hex: INK, size: 10 }, shadow: { op: 45, dist: 7, blur: 12 } });
  var S = text(sub, F.B, 31, C.WHITE, 540, 384, { align: Justification.CENTER, maxW: 900, name: "Phụ đề" });
  fx(S, { shadow: { op: 60, dist: 2, blur: 6 } });
  return d;
}
function hook(str, cy) {
  cy = cy || 1250; var cx = 530;
  var T = text(str, F.B, 26, C.WHITE, 0, cy, { maxW: 760, name: "Câu móc" });
  var E = text(POINTE, F.E, 34, C.WHITE, 0, cy, { name: "Emoji chỉ sang" });
  var b = bb(T), be = bb(E), w = b[2] - b[0], ew = be[2] - be[0], total = w + 14 + ew, x0 = cx - total / 2;
  T.translate(x0 - b[0], 0); E.translate(x0 + w + 14 - be[0], 0);
  centerY(T, cy); centerY(E, cy);
  var R = rect(x0 - 30, cy - 34, x0 + total + 30, cy + 34, 34, C.BLACK, "Câu móc - nền");
  R.fillOpacity = 62;
  fx(R, { stroke: { hex: C.GREEN_L, size: 2, op: 90, inside: true }, shadow: { op: 40, dist: 4, blur: 10 } });
  R.move(T, ElementPlacement.PLACEAFTER);
}
function para(str, font, size, hex, x, y, w, lead, name) {
  var doc = app.activeDocument, L = doc.artLayers.add();
  L.kind = LayerKind.TEXT;
  var t = L.textItem;
  t.kind = TextType.PARAGRAPHTEXT;
  t.position = [x, y];
  t.width = w; t.height = 700;
  t.contents = str; t.font = font; t.size = size; t.color = col(hex);
  t.useAutoLeading = false; t.leading = lead;
  t.justification = Justification.LEFT;
  L.name = name;
  return L;
}
function placeBox(file, name, l, t, r, b) { var L = placeSO(A + file, name); return fitBox(L, l, t, r, b); }
function iconDot(file, cx, cy, r, fillH, name) {
  var O = oval(cx - r, cy - r, cx + r, cy + r, fillH, name + " - nền");
  placeAt(file, name, cx, cy, Math.round(r * 1.25));
  return O;
}
// dòng có dấu ✓ / ✗ / ! rồi chữ (tự xuống dòng)
function markRow(x, y, w, kind, str, size, name) {
  var T = para(str, F.B, size, C.WHITE, x + 46, y, w - 46, Math.round(size * 1.36), name);
  fx(T, { shadow: { op: 55, dist: 2, blur: 5 } });
  var b = bb(T), cy = b[1] + Math.round(size * 0.46);
  if (kind == "ok") iconDot("ic-check.png", x + 17, cy, 17, C.GREEN, name + " - dấu");
  else if (kind == "no") iconDot("ic-x.png", x + 17, cy, 17, RED, name + " - dấu");
  else if (kind == "plus") { oval(x, cy - 17, x + 34, cy + 17, "F59E0B", name + " - dấu"); text("+", F.B, 30, C.WHITE, x + 17, cy + 11, { align: Justification.CENTER, name: name + " - dấu cộng" }); }
  else { oval(x, cy - 17, x + 34, cy + 17, "F59E0B", name + " - dấu"); text("!", F.B, 24, C.WHITE, x + 17, cy + 9, { align: Justification.CENTER, name: name + " - chấm than" }); }
  return b[3];
}
function noteBox(l, t, r, str, size, emo) {
  var tx = emo ? l + 84 : l + 30;
  var T = para(str, F.B, size, INK, tx, t + 24, Math.min(r - 30, SAFE_R) - tx, Math.round(size * 1.4), "Ghi chú");
  var b = bb(T), h = b[3] - t + 24;
  var B = rect(l, t, r, t + h, 26, C.GREEN_SOFT, "Ghi chú - nền");
  fx(B, { shadow: { op: 40, dist: 6, blur: 12 } });
  B.move(T, ElementPlacement.PLACEAFTER);
  if (emo) emojiC(emo, 40, l + 44, t + h / 2, "Emoji ghi chú");
  return t + h;
}
// bảng tỉ số
function score(cy, a, b, label) {
  var w = 640, h = 104, l = 540 - w / 2;
  var R = rect(l, cy - h / 2, l + w, cy + h / 2, 34, "0B0F14", "Tỉ số - nền");
  R.fillOpacity = 90;
  fx(R, { stroke: { hex: C.GREEN_L, size: 3, op: 95, inside: true }, shadow: { op: 55, dist: 8, blur: 18 } });
  var L1 = text("AIR 5", F.B, 34, C.WHITE, l + 46, cy + 12, { track: 60, name: "Tỉ số - Air 5" }); centerY(L1, cy);
  var L2 = text("A16", F.B, 34, C.WHITE, l + w - 46, cy + 12, { align: Justification.RIGHT, track: 60, name: "Tỉ số - A16" }); centerY(L2, cy);
  var S = text(a + " - " + b, F.T, 70, C.GREEN_L, 540, cy + 24, { align: Justification.CENTER, name: "Tỉ số" });
  fx(S, { stroke: { hex: INK, size: 6 } }); centerY(S, cy);
  if (label) pillC(label, 540, cy - h / 2, 21, C.WHITE, C.GREEN_D, 22, 40, F.B, 80, "Tỉ số - nhãn");
}
var SAFE_R = 940;
function safeCheck(tag) {
  var doc = app.activeDocument, bad = 0;
  function walk(c) {
    for (var i = 0; i < c.layers.length; i++) {
      var Lr = c.layers[i];
      if (Lr.typename == "LayerSet") { walk(Lr); continue; }
      if (Lr.kind != LayerKind.TEXT) continue;
      var q = bb(Lr);
      if (q[2] > 950 && q[3] > 620 && q[1] < 1320) { LOG += "  CANH BAO " + tag + " chu lan vung nut phai: " + Lr.name + " " + q.join(",") + "\n"; bad++; }
      if (q[3] > 1300) { LOG += "  CANH BAO " + tag + " chu qua thap: " + Lr.name + " " + q.join(",") + "\n"; bad++; }
    }
  }
  walk(doc);
  LOG += "  vung an toan " + tag + ": " + (bad ? bad + " loi" : "ok") + "\n";
}
function saveAsName(doc, nm) {
  doc.resizeImage(undefined, undefined, 150, ResampleMethod.NONE);
  var o = new PhotoshopSaveOptions(); o.layers = true; o.embedColorProfile = true;
  doc.saveAs(new File(OUT.fsName + "/" + nm + ".psd"), o, false, Extension.LOWERCASE);
  var p = new PNGSaveOptions(); p.compression = 6; p.interlaced = false;
  doc.saveAs(new File(OUT.fsName + "/" + nm + ".png"), p, true, Extension.LOWERCASE);
}

// ================= 00 THUMBNAIL =================
function thumb14() {
  var d = app.documents.add(W, H, 72, "Thumbnail", NewDocumentMode.RGB, DocumentFill.WHITE);
  placeFull("bg-thumb.png", "Nền tối");
  var b1 = devicePic("gen11-xanh.png", "Ảnh thật - iPad A16", 60, 490, 560, 1230, { op: 70, dist: 24, blur: 50 });
  var b2 = devicePic("air5-doc-chuan.png", "Ảnh thật - iPad Air 5", 500, 450, 1030, 1260, { op: 70, dist: 24, blur: 50 });
  labelChipUp(Math.round((b1[0] + b1[2]) / 2) - 20, 1262, "A16 mới", INK, "Nhãn A16");
  labelChipUp(Math.round((b2[0] + b2[2]) / 2), 1262, "Air 5 likenew", C.GREEN_D, "Nhãn Air 5");
  text("POLY STORE", F.B, 22, C.WHITE, 84, 100, { track: 200, name: "Thương hiệu" });
  var T = text("A16 hay AIR 5?", FS.T, 132, YEL, 540, 292, { align: Justification.CENTER, maxW: 960, name: "Tiêu đề" });
  fxGlow(T, { glow: { hex: YEL, op: 40, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var tb = bb(T);
  var S2 = text("cùng tầm tiền, chọn sai là tiếc", FS.I, 58, C.WHITE, tb[0] + 10, tb[3] + 44, { maxW: 980 - tb[0], name: "Mô tả" });
  fxGlow(S2, { shadow: { op: 70, dist: 3, blur: 8 } });
  LOG += "thumb title " + tb.join(",") + " sub " + bb(S2).join(",") + " a16 " + b1.join(",") + " air " + b2.join(",") + "\n";
  safeCheck("thumb"); saveAsName(d, "slide-00-thumbnail");
}

// ================= 01 BÌA =================
function s1(n) {
  var d = newDoc("Slide 0" + n);
  bgPhoto("daniel-romero--cCxgKIA5RA-unsplash.jpg", 3652, 1600, 0, 1540, 16, 64);
  text("POLY STORE", F.B, 22, C.WHITE, 84, 112, { track: 200, name: "Thương hiệu" });
  pillC("SO KÈO 6 HIỆP", 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T1 = text("iPAD A16 MỚI", F.T, 104, C.WHITE, 540, 300, { align: Justification.CENTER, maxW: 900, name: "Tiêu đề 1" });
  fx(T1, { stroke: { hex: INK, size: 10 }, shadow: { op: 50, dist: 8, blur: 14 } });
  var T2 = text("HAY AIR 5 LIKENEW?", F.T, 88, C.GREEN_L, 540, 414, { align: Justification.CENTER, maxW: 960, name: "Tiêu đề 2" });
  fx(T2, { stroke: { hex: INK, size: 9 }, shadow: { op: 50, dist: 8, blur: 14 } });
  var b2 = bb(T2), sy = Math.round(b2[3]) + 62;
  var S = text("Cùng tầm tiền, chọn sai là tiếc", F.B, 34, C.WHITE, 540, sy, { align: Justification.CENTER, maxW: 860, name: "Phụ đề" });
  fx(S, { shadow: { op: 60, dist: 2, blur: 6 } });
  var E = text("\uD83D\uDE05", F.E, 36, C.WHITE, 0, sy, { name: "Emoji cười" });
  var sb = bb(S), eb = bb(E); S.translate(-(eb[2] - eb[0] + 12) / 2, 0); sb = bb(S);
  E.translate(sb[2] + 12 - eb[0], 0); centerY(E, (sb[1] + sb[3]) / 2);
  var top = sy + 60;
  var a = devicePic("gen11-xanh.png", "Ảnh thật - iPad A16", 70, top, 500, 1110);
  var b = devicePic("air5-doc-chuan.png", "Ảnh thật - iPad Air 5", 580, top, 1010, 1110);
  var vy = Math.round((a[1] + a[3]) / 2);
  var V = oval(540 - 62, vy - 62, 540 + 62, vy + 62, C.GREEN, "VS - nền");
  fx(V, { stroke: { hex: C.WHITE, size: 5 }, shadow: { op: 55, dist: 6, blur: 14 } });
  var VT = text("VS", F.T, 60, C.WHITE, 540, vy + 22, { align: Justification.CENTER, name: "VS" }); centerY(VT, vy);
  fx(VT, { stroke: { hex: INK, size: 4 } });
  labelChipUp(Math.round((a[0] + a[2]) / 2), Math.round(a[3]) + 46, "iPad A16 · máy mới", INK, "Nhãn A16");
  labelChipUp(Math.round((b[0] + b[2]) / 2), Math.round(b[3]) + 46, "iPad Air 5 · likenew", C.GREEN_D, "Nhãn Air 5");
  hook("Chấm 6 hiệp, vuốt xem máy nào thắng", 1262);
  LOG += "s1 a16 " + a.join(",") + " air " + b.join(",") + "\n";
  safeCheck("s" + n); save(d, n);
}

// ================= 02 HIỆU NĂNG =================
function specCard(l, r, t, b, img, nameTxt, chip, desc, hot) {
  var G = glass(l, t, r, b, 30, "Thẻ - " + nameTxt);
  if (hot) fx(G, { stroke: { hex: C.GREEN_L, size: 3, op: 95, inside: true } });
  var bx = devicePic(img, "Ảnh thật - " + nameTxt, l + 18, t + 20, l + 170, b - 20, { op: 55, dist: 10, blur: 20 });
  var x = l + 190;
  var N = text(nameTxt, F.B, 28, hot ? C.GREEN_L : C.WHITE, x, t + 74, { maxW: r - 20 - x, name: "Tên - " + nameTxt });
  var Cp = text(chip, F.T, 54, C.WHITE, x, t + 150, { maxW: r - 20 - x, name: "Chip - " + nameTxt });
  fx(Cp, { stroke: { hex: INK, size: 5 } });
  var D = para(desc, F.B, 25, C.WHITE, x, t + 176, r - 22 - x, 34, "Thông số - " + nameTxt);
  fx(D, { shadow: { op: 55, dist: 2, blur: 5 } });
}
function useCircle(file, cx, cy, r, label, verdict, hot) {
  lifeCircle(file, cx, cy, r, label);
  var Lb = text(label, F.B, 28, C.WHITE, cx, cy + r + 50, { align: Justification.CENTER, name: "Nhu cầu - " + label });
  fx(Lb, { shadow: { op: 60, dist: 2, blur: 6 } });
  var Vt = text(verdict, F.B, 26, C.WHITE, cx, cy + r + 112, { align: Justification.CENTER, name: "Kết quả - " + label });
  var vb = bb(Vt), w = vb[2] - vb[0]; centerY(Vt, cy + r + 102);
  var R = rect(cx - w / 2 - 26, cy + r + 102 - 28, cx + w / 2 + 26, cy + r + 102 + 28, 28, hot ? C.GREEN_D : INK, "Kết quả - nền - " + label);
  fx(R, { stroke: { hex: C.WHITE, size: 2, op: 60, inside: true } });
  R.move(Vt, ElementPlacement.PLACEAFTER);
}
function s2(n) {
  var d = head14(n, ["auguras-pipiras-1cPl1dv-uFY-unsplash.jpg", 3312, 350, 0, 1627], "HIỆP 1", null, "HIỆU NĂNG", "Chip nào khỏe hơn?");
  specCard(60, 530, 436, 726, "air5-doc-chuan.png", "iPad Air 5", "M1", "CPU 8 nhân\rRAM 8GB", true);
  specCard(550, 1020, 436, 726, "gen11-xanh.png", "iPad A16", "A16", "CPU 5 nhân\rRAM 6GB", false);
  useCircle("tron-hoc-online.png", 290, 870, 104, "Học, xem phim", "Như nhau", false);
  useCircle("tron-ghi-chu.png", 790, 870, 104, "Vẽ, edit video", "M1 khỏe hơn hẳn", true);
  score(1238, 1, 0);
  safeCheck("s" + n); save(d, n);
}

// ================= 03 MÀN HÌNH =================
function screenCard(t, h, img, nameTxt, ok, hot) {
  var G = glass(60, t, 1020, t + h, 30, "Thẻ - " + nameTxt);
  if (hot) fx(G, { stroke: { hex: C.GREEN_L, size: 3, op: 95, inside: true } });
  var bx = devicePic(img, "Ảnh thật - " + nameTxt, 84, t + 22, 470, t + h - 22, { op: 55, dist: 10, blur: 20 });
  var x = 500;
  var N = text(nameTxt, F.B, 32, hot ? C.GREEN_L : C.WHITE, x, t + 74, { name: "Tên - " + nameTxt });
  fx(N, { shadow: { op: 55, dist: 2, blur: 5 } });
  var y = t + 112;
  y = markRow(x, y, 990 - x, ok ? "ok" : "no", "Màn dán kín", 30, nameTxt + " - dán kín") + 22;
  markRow(x, y, 990 - x, ok ? "ok" : "no", "Chống phản chiếu", 30, nameTxt + " - chống phản chiếu");
}
function s3(n) {
  var d = head14(n, ["faizur-rehman-dJpupM4LiS4-unsplash.jpg", 2268, 0, 600, 2268], "HIỆP 2", null, "MÀN HÌNH", "Viết vẽ và ngồi gần cửa sổ");
  screenCard(436, 268, "air5-ngang-chuan.png", "iPad Air 5", true, true);
  screenCard(724, 268, "gen11-facetime.png", "iPad A16", false, false);
  noteBox(60, 1016, 1020, "Màn dán kín: viết vẽ sát nét. Chống phản chiếu: ngồi gần cửa sổ ít bị lóa hơn. A16 không có cả hai.", 26, "\u270D\uFE0F");
  score(1238, 2, 0);
  safeCheck("s" + n); save(d, n);
}

// ================= 04 BÚT VÀ CỔNG SẠC =================
function penCard(l, r, t, img, imgW, imgH, nameTxt, pen, rows, hot, minB) {
  var pl = l + 20, pr = r - 20, ph = Math.round((pr - pl) * imgH / imgW), pt = t + 20;
  var K = rect(pl, pt, pr, pt + ph, 22, C.WHITE, "Ảnh - khung - " + nameTxt);
  var L = placeSO(A + img, "Ảnh thật - " + pen); fitBox(L, pl, pt, pr, pt + ph); L.grouped = true;
  var x = l + 24, y0 = pt + ph;
  var N = text(nameTxt, F.B, 32, hot ? C.GREEN_L : C.WHITE, x, y0 + 52, { maxW: r - 24 - x, name: "Tên - " + nameTxt });
  fx(N, { shadow: { op: 55, dist: 2, blur: 5 } });
  var Pn = text(pen, F.B, 25, "D1FAE5", x, y0 + 90, { maxW: r - 24 - x, name: "Bút - " + nameTxt });
  var y = y0 + 116;
  for (var i = 0; i < rows.length; i++) y = markRow(x, y, Math.min(r - 22, SAFE_R) - x, rows[i][0], rows[i][1], 26, nameTxt + " - ý " + (i + 1)) + 18;
  var b = Math.max(y - 18 + 26, minB || 0);
  var G = glass(l, t, r, b, 30, "Thẻ - " + nameTxt);
  if (hot) fx(G, { stroke: { hex: C.GREEN_L, size: 3, op: 95, inside: true } });
  G.move(K, ElementPlacement.PLACEAFTER);
  return b;
}
function s4(n) {
  var d = head14(n, ["rodrigo-rodrigues-wolf-r-t-9a8Ayj55PRo-unsplash.jpg", 2973, 0, 400, 2973], "HIỆP 3", null, "BÚT VÀ CỔNG SẠC", "Vẽ, ghi chú và chép file", 92);
  var b1 = penCard(60, 530, 436, "s4-air5-pencil2.jpg", 1000, 650, "iPad Air 5", "Apple Pencil 2", [
    ["ok", "Hít sạc bên cạnh máy,\rkhỏi cắm dây"],
    ["ok", "Có lực nhấn, vẽ đậm nhạt theo tay"],
    ["ok", "Cổng USB-C nhanh,\rtới 10Gb/s"]], true, 1151);
  var b2 = penCard(550, 1020, 436, "s4-a16-pencil-usbc.jpg", 1000, 650, "iPad A16", "Apple Pencil USB-C", [
    ["no", "Không có lực nhấn,\rnét không đậm nhạt"],
    ["warn", "Muốn có lực nhấn\rphải dùng Pencil 1\r+ đầu chuyển"],
    ["no", "Cổng USB 2.0,\rchép file chậm"]], false);
  LOG += "s4 the den " + b1 + " / " + b2 + "\n";
  score(1238, 3, 0);
  safeCheck("s" + n); save(d, n);
}

// ================= 05 APPLE INTELLIGENCE =================
function aiCol(cx, img, label, ok) {
  var bx = devicePic(img, "Ảnh thật - " + label, cx - 200, 446, cx + 200, 856, { op: 62, dist: 18, blur: 36 });
  var bxx = Math.round(bx[2]) - 18, byy = Math.round(bx[1]) + 18;
  var O = ok ? iconDot("ic-check.png", bxx, byy, 44, C.GREEN, "Dấu - " + label) : iconDot("ic-x.png", bxx, byy, 44, RED, "Dấu - " + label);
  fx(O, { stroke: { hex: C.WHITE, size: 4 }, shadow: { op: 55, dist: 6, blur: 12 } });
  labelChipUp(cx, Math.round(bx[3]) + 46, label, ok ? C.GREEN_D : "7F1D1D", "Nhãn - " + label);
}
function s5(n) {
  var d = head14(n, ["yosuke-ota-5hhyXiCHfTs-unsplash.jpg", 4000, 0, 500, 4000], "HIỆP 4", null, "APPLE INTELLIGENCE", "Bộ tính năng AI mới của Apple", 84);
  aiCol(285, "gen11-xanh.png", "A16: không dùng được", false);
  aiCol(772, "air5-doc-chuan.png", "Air 5 M1: dùng được", true);
  noteBox(60, 958, 1020, "iPad A16 mới mua về... không dùng được\rApple Intelligence. Air 5 chip M1 thì dùng được.", 26, "\uD83E\uDD16");
  score(1150, 4, 0);
  hook("Khoan, A16 vẫn có điểm mạnh", 1266);
  safeCheck("s" + n); save(d, n);
}

// ================= 06 A16 GỠ 2 ĐIỂM =================
function s6(n) {
  var d = head14(n, ["totte-annerbrink-t3Miv9Ygv9U-unsplash.jpg", 5304, 0, 700, 5304], "HIỆP 5 + 6", null, "A16 GỠ 2 ĐIỂM", "Máy mới cũng có cái hay");
  var hb = devicePic("gen11-facetime.png", "Ảnh thật - iPad A16 gọi video", 150, 500, 930, 820, { op: 62, dist: 18, blur: 36 });
  var camX = hb[0] + 0.501 * (hb[2] - hb[0]), camY = hb[1] + 0.035 * (hb[3] - hb[1]);
  var Rg = oval(camX - 18, camY - 18, camX + 18, camY + 18, C.GREEN, "Khoanh camera trước"); Rg.fillOpacity = 0;
  fx(Rg, { stroke: { hex: C.GREEN_L, size: 5 }, shadow: { op: 45, dist: 3, blur: 8 } });
  labelChipDown(Math.round(camX), Math.round(camY - 58), "Camera trước nằm ngang", C.GREEN_D, "Nhãn camera");
  var t = Math.round(hb[3]) + 30, y = t + 32, l = 60, r = 1020, first = null;
  var rows = [["ok", "Hiệp 5: máy mới, pin 100%,\rbảo hành chính hãng Apple 12 tháng"],
              ["ok", "Hiệp 6: camera trước nằm ngang,\rhọc online, gọi video lên hình chuẩn"]];
  var mark = app.activeDocument.activeLayer;
  for (var i = 0; i < rows.length; i++) y = markRow(l + 34, y, SAFE_R - (l + 34), rows[i][0], rows[i][1], 27, "A16 - ý " + (i + 1)) + 24;
  var G = glass(l, t, r, y - 24 + 30, 30, "Thẻ điểm mạnh A16");
  G.move(mark, ElementPlacement.PLACEBEFORE);
  score(1238, 4, 2, "CHUNG CUỘC");
  LOG += "s6 the " + t + "-" + (y - 24 + 30) + "\n";
  safeCheck("s" + n); save(d, n);
}

// ================= 07 CHỐT =================
function priceRow(t, img, price, name, sub, hl, gifts) {
  var h = gifts ? 318 : 230;
  var R = glass(60, t, 1020, t + h, 30, "Thẻ - " + name);
  if (hl) fx(R, { stroke: { hex: C.GREEN_L, size: 3, op: 95, inside: true } });
  var bx = devicePic(img, "Ảnh thật - " + name, 84, t + 16, 300, t + 214, { op: 55, dist: 8, blur: 16 });
  var N = text(name, F.B, 31, hl ? C.GREEN_L : C.WHITE, 330, t + (gifts ? 82 : 70), { maxW: 990 - 330, name: "Máy - " + name });
  fx(N, { shadow: { op: 55, dist: 2, blur: 5 } });
  var P = text(price, F.T, 62, C.WHITE, 330, t + (gifts ? 164 : 148), { maxW: 990 - 330, name: "Giá - " + name });
  fx(P, { stroke: { hex: INK, size: 6 }, shadow: { op: 50, dist: 3, blur: 6 } });
  if (sub) {
    var U = text(sub, F.B, 26, "BBF7D0", 330, t + 196, { maxW: 990 - 330, name: "Thông tin - " + name });
    fx(U, { shadow: { op: 55, dist: 2, blur: 5 } });
  }
  if (gifts) giftRow(88, t + 264, 950, gifts);
  return t + h;
}
// hàng quà tặng: nhãn + các ô có icon, nằm trên 1 hàng
function giftRow(x0, cy, maxR, items) {
  var Lb = text("Tặng kèm:", F.B, 23, C.GREEN_L, x0, cy + 9, { name: "Tặng kèm - nhãn" });
  centerY(Lb, cy); fx(Lb, { shadow: { op: 55, dist: 2, blur: 5 } });
  var x = bb(Lb)[2] + 12;
  for (var i = 0; i < items.length; i++) {
    var E = placeSO(A + items[i][0], "Tặng kèm - icon " + items[i][1]); fitBox(E, 0, cy - 17, 34, cy + 17);
    var T = text(items[i][1], F.B, 21, C.WHITE, 0, cy + 8, { name: "Tặng kèm - " + items[i][1] });
    var eb = bb(E), tb = bb(T), ew = eb[2] - eb[0], tw = tb[2] - tb[0];
    var l = x, r = x + 14 + ew + 7 + tw + 16;
    E.translate(l + 14 - eb[0], 0); T.translate(l + 14 + ew + 7 - tb[0], 0);
    centerY(E, cy); centerY(T, cy);
    var K = rect(l, cy - 25, r, cy + 25, 25, C.BLACK, "Tặng kèm - ô " + (i + 1));
    K.fillOpacity = 55; fx(K, { stroke: { hex: C.WHITE, size: 2, op: 45, inside: true } });
    K.move(E, ElementPlacement.PLACEAFTER);
    x = r + 10;
  }
  LOG += "qua tang den x=" + (x - 12) + " (gioi han " + maxR + ")\n";
}
function s7(n) {
  var d = newDoc("Slide 0" + n);
  placeFull("bg-thumb.png", "Nền tối");
  text("POLY STORE", F.B, 22, C.WHITE, 84, 112, { track: 200, name: "Thương hiệu" });
  pillC("CHỐT KÈO", 540, 236, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var A1 = text("CÙNG TẦM TIỀN", F.T, 100, C.WHITE, 540, 376, { align: Justification.CENTER, maxW: 900, name: "Tiêu đề 1" });
  fx(A1, { stroke: { hex: INK, size: 10 }, shadow: { op: 50, dist: 8, blur: 14 } });
  var A2 = text("CHỌN MÁY NÀO?", F.T, 104, C.GREEN_L, 540, 494, { align: Justification.CENTER, maxW: 920, name: "Tiêu đề 2" });
  fx(A2, { stroke: { hex: INK, size: 10 }, shadow: { op: 50, dist: 8, blur: 14 } });
  var y = priceRow(570, "gen11-xanh.png", "Khoảng 12 triệu", "iPad A16 mới · 128GB", "Máy mới, bảo hành Apple", false) + 22;
  y = priceRow(y, "air5-doc-chuan.png", "Từ 12,7 triệu", "iPad Air 5 likenew 256GB tại Poly", null, true,
    [["ic-sac.png", "Sạc 20W Mikha chính hãng"], ["ic-op.png", "Ốp lưng"], ["ic-kinh.png", "Cường lực"]]);
  var hy = y + 66;
  var Ht = text("#polystore", F.B, 32, C.WHITE, 540, hy + 12, { align: Justification.CENTER, track: 40, name: "Hashtag - chữ" });
  var hb = bb(Ht), hw = hb[2] - hb[0]; centerY(Ht, hy);
  var K = rect(540 - hw / 2 - 32, hy - 30, 540 + hw / 2 + 32, hy + 30, 30, C.BLACK, "Hashtag - nền");
  K.fillOpacity = 55; fx(K, { stroke: { hex: C.GREEN_L, size: 2, op: 80, inside: true } });
  K.move(Ht, ElementPlacement.PLACEAFTER);
  LOG += "s7 the den " + y + " hashtag " + hy + "\n";
  safeCheck("s" + n); save(d, n);
}

// ---------- chạy ----------
var LOG = "Fonts: T=" + F.T + " | B=" + F.B + " | E=" + F.E + " | FS.T=" + FS.T + "\n";
var ONLY = (typeof ONLY_LIST != "undefined") ? ONLY_LIST : [0, 1, 2, 3, 4, 5, 6, 7];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var LOGNAME = (typeof LOG_NAME != "undefined") ? LOG_NAME : "post14.log";
try {
  var need30 = ["air5-tim-doc.png", "air5-tim-ngang.png", "gen11-xanh.png", "gen11-facetime.png", "tron-ve.png", "tron-xem-phim.png", "tron-hoc-online.png", "tron-ghi-chu.png", "bg-thumb.png"];
  for (var c = 0; c < need30.length; c++) copyIn(P30 + need30[c]);
  copyIn(P22 + "ic-check.png"); copyIn(P22 + "ic-x.png");
  moveTo("C:/Users/Dao/Downloads/apple-pencil-usbc-newsroom.zip", "E:/Social Claude/_to_delete/T10_A16vsAir5_14");
  if (typeof DROP_S1 != "undefined" && DROP_S1) { moveTo(OUT.fsName + "/slide-01.psd", "E:/Social Claude/_to_delete/T10_A16vsAir5_14"); moveTo(OUT.fsName + "/slide-01.png", "E:/Social Claude/_to_delete/T10_A16vsAir5_14"); LOG += MOVELOG; }
  for (var di = app.documents.length - 1; di >= 0; di--) app.documents[di].close(SaveOptions.DONOTSAVECHANGES);
  var FN = [thumb14, s1, s2, s3, s4, s5, s6, s7];
  for (var k = 0; k < FN.length; k++) {
    if (!want(k)) continue;
    try { if (k == 0) FN[k](); else FN[k](k); LOG += "0" + k + " ok\n"; }
    catch (e1) { LOG += "LOI 0" + k + ": " + e1 + " line " + e1.line + "\n"; }
    while (app.documents.length) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
} catch (e) { LOG += "LOI: " + e + " line " + e.line + "\n"; }
writeFile(LOGNAME, LOG);
app.preferences.rulerUnits = OLD_RU;
app.preferences.typeUnits = OLD_TU;
