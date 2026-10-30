// ================= SLIDES: TOP 5 LAPTOP DƯỚI 25 TRIỆU (28/10) =================
function fitW(T, maxW) { var b = bb(T), w = b[2] - b[0]; if (w > maxW) { var p = maxW / w * 100; T.resize(p, p, AnchorPosition.MIDDLECENTER); } }
function specHop(t, l1, l2, l3, hop) {
  var h = 178;
  glass(98, t, 982, t + h, 28, "Cấu hình - nền");
  var A = text(l1, F.B, 34, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Cấu hình 1" });
  fitW(A, 820); centerText(A, 540, t + 44); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text(l2, F.B, 34, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Cấu hình 2" });
  fitW(B, 820); centerText(B, 540, t + 92); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  var Cc = text(l3, F.B, 28, "CBD5E1", 540, 0, { align: Justification.CENTER, name: "Màn hình" });
  fitW(Cc, 820); centerText(Cc, 540, t + 140);
  var two = hop.indexOf("\r") >= 0, hh = two ? 124 : 86;
  var y = t + h + 16;
  var K = rect(98, y, 982, y + hh, 28, C.GREEN_SOFT, "Hợp với - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var T = text(hop, F.B, 30, C.INK, 540, 0, { align: Justification.CENTER, lead: 42, name: "Hợp với" });
  fitW(T, 820); centerText(T, 540, y + hh / 2);
  return y + hh;
}
function productSlide(n, brand, model, sub, img, l1, l2, l3, hop, hook) {
  var d = newDoc("Top5 25tr - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var K = text(brand, F.B, 26, "CBD5E1", 540, 0, { align: Justification.CENTER, track: 300, name: "Hãng" });
  centerText(K, 540, 204);
  var T = text(model, FS.T, 80, YEL, 540, 0, { align: Justification.CENTER, name: "Tiêu đề" });
  fitW(T, 880); centerText(T, 540, 272);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 34, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Phụ đề" });
  fitW(S, 900); centerText(S, 540, 342); fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  shot(img, 884, 98, 380, 510, "Ảnh - " + model);
  var bot = specHop(912, l1, l2, l3, hop);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " title " + bb(T).join(",") + " hop den " + bot + "\n";
  if (bot > HOOK_Y - 46) LOG += "  CANH BAO s" + n + ": sat cau moc\n";
  save5(d, n);
}
function t1() {
  var d = newDoc("Top5 25tr - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("TOP 5 LAPTOP", FS.T, 112, YEL, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 1" });
  centerText(A, 540, 250); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("dưới 25 TRIỆU", FS.T, 104, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 2" });
  centerText(B, 540, 358); fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  var S = text("cho dân kỹ thuật, kiến trúc, đồ họa", FS.I, 40, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Mô tả" });
  centerText(S, 540, 446); fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  shot("cv-hp.png", 884, 98, 500, 699, "Ảnh thật - HP EliteBook ở shop");
  hookPill("Máy đầu tiên nhẹ nhất", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(B).join(",") + "\n";
  save5(d, 1);
}
function t2() {
  productSlide(2, "LENOVO", "ThinkPad P14s Gen 4", "Nhẹ, gọn, RAM 32GB mở file lớn không đơ.", "p-p14s.png",
    "Ryzen 5 PRO 7540U · Radeon 740M", "RAM 32GB · SSD 512GB", "14 inch Full HD+",
    "Hợp với: AutoCAD 2D, bóc khối lượng,\rmang ra công trình", "Cần card rời để dựng 3D?");
}
function t3() {
  productSlide(3, "LENOVO", "ThinkPad P15 Gen 1", "Card 8GB, RAM 32GB, dư sức dựng mô hình 3D.", "p-p15.png",
    "i9-10885H · Quadro RTX 4000 8GB", "RAM 32GB · SSD 1TB", "15.6 inch Full HD",
    "Hợp với: Revit, SolidWorks, mô hình 3D", "Cần màn to nhìn bản vẽ?");
}
function t4() {
  productSlide(4, "DELL", "Precision 5760", "Màn 17 inch, mở bản vẽ lớn ít phải phóng to.", "p-5760.png",
    "Xeon W-11955M · RTX A3000 6GB", "RAM 16GB · SSD 1TB", "17 inch Full HD+",
    "Hợp với: bản vẽ kỹ thuật, mô hình 3D,\rmở nhiều cửa sổ", "Muốn máy gọn nhẹ hơn?");
}
function t5() {
  productSlide(5, "DELL", "Precision 5570", "Gọn hơn máy 17 inch, màn 100% sRGB, card 8GB.", "p-5570.png",
    "i7-12800H · RTX A2000 8GB", "RAM 16GB · SSD 512GB", "15.6 inch Full HD+",
    "Hợp với: kiến trúc, SketchUp, Revit,\rrender Enscape vừa phải", "Cần bàn phím số để nhập liệu?");
}
function t6() {
  productSlide(6, "HP", "ZBook Power 15 G9", "Có bàn phím số, máy newbody như mới.", "p-zb9.png",
    "i7-12800H · RTX A2000 8GB", "RAM 16GB · SSD 512GB", "15.6 inch Full HD · 100% sRGB",
    "Hợp với: dự toán, nhập số liệu nhiều, diễn họa", "Bạn hợp máy nào?");
}
function t7() {
  var d = newDoc("Top5 25tr - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  var L1 = text("Bạn làm ngành gì,", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Hỏi 1" });
  centerText(L1, 540, 540); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("dùng phần mềm gì?", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Hỏi 2" });
  centerText(L2, 540, 622); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("Comment, Poly báo giá máy hợp bạn", F.B, 38, C.GREEN_L, 0, 0, { name: "Comment" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 60;
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 722); b3 = bb(L3);
  fx(L3, { shadow: { op: 70, dist: 2, blur: 6 } });
  emojiC("👇", 44, b3[2] + 34, 720, "Chỉ xuống");
  var cy = 830;
  var T = text("+  Follow @polystorelaptop", F.B, 34, C.WHITE, 0, cy + 12, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 38, cy - 38, 540 + w / 2 + 38, cy + 38, 38, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  save5(d, 7);
}
var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5, 6, 7];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4, t5, t6, t7];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 7; k++) if (want(k)) {
    try { FN[k](); LOG += "0" + k + " ok\n"; } catch (e1) { LOG += "LOI 0" + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
