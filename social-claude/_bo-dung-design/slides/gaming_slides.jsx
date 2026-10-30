
// ================= SLIDES: LAPTOP GAMING (22/10) =================
function priceLine(str, cy) {
  var T = text(str, F.B, 46, C.GREEN_L, 540, 0, { align: Justification.CENTER, track: 20, name: "Giá" });
  centerText(T, 540, cy);
  fxGlow(T, { shadow: { op: 75, dist: 3, blur: 8 } });
}
function specHop3(t, l1, l2, l3, hop) {
  var h = 178;
  glass(98, t, 982, t + h, 28, "Cấu hình - nền");
  var A = text(l1, F.B, 34, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Cấu hình 1" });
  centerText(A, 540, t + 44); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text(l2, F.B, 34, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Cấu hình 2" });
  centerText(B, 540, t + 92); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  var Cc = text(l3, F.B, 27, "CBD5E1", 540, 0, { align: Justification.CENTER, maxW: 840, name: "Màn - tình trạng" });
  centerText(Cc, 540, t + 140);
  var y = t + h + 16;
  var K = rect(98, y, 982, y + 86, 28, C.GREEN_SOFT, "Hợp với - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var T = text(hop, F.B, 30, C.INK, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Hợp với" });
  centerText(T, 540, y + 43);
  return y + 86;
}
function productSlide(n, brand, model, bgf, img, l1, l2, l3, hop, hook) {
  var d = newDoc("Laptop gaming - 0" + n);
  placeAt(TN + bgf, 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var K = text(brand, F.B, 26, "CBD5E1", 540, 0, { align: Justification.CENTER, track: 300, name: "Hãng" });
  centerText(K, 540, 204);
  var T = text(model, FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, maxW: 880, name: "Tiêu đề" });
  centerText(T, 540, 280);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  shot(img, 884, 98, 380, 560, "Ảnh - " + model);
  var bot = specHop3(966, l1, l2, l3, hop);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " title " + bb(T).join(",") + " hop den " + bot + "\n";
  save5(d, n);
}
// 1. BÌA
function t1() {
  var d = newDoc("Laptop gaming - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP GAMING", FS.T, 116, YEL, 540, 0, { align: Justification.CENTER, maxW: 900, name: "Tiêu đề" });
  centerText(A, 540, 290);
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var S = text("Vừa đi làm vừa chơi game", FS.I, 50, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 900, name: "Mô tả" });
  centerText(S, 540, 404);
  fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  shot("cv-legion.png", 884, 98, 500, 640, "Ảnh đại diện - Legion Pro 5");
  hookPill("3 máy cho 3 kiểu chơi", HOOK_Y);
  save5(d, 1);
}
function t2() {
  productSlide(2, "GIGABYTE", "Aorus 15 2023", "bg-aorus.png", "p2-aorus.png",
    "i5-13500H · RTX 4050 6GB", "RAM 16GB · SSD 512GB", "15.6 inch Full HD · Máy 99, pin 100%",
    "Hợp: LMHT, Valorant, FC Online, làm văn phòng", "Muốn chơi game nặng hơn?");
}
function t3() {
  productSlide(3, "HP", "Omen 16 2024", "bg-omen.png", "p2-omen.png",
    "i7-14650HX · RTX 4060 8GB", "RAM 16GB · SSD 512GB", "16 inch Full HD 144Hz · Máy likenew",
    "Hợp: game AAA, dựng video, livestream", "Cần màn đẹp, đời mới hơn?");
}
function t4() {
  productSlide(4, "LENOVO", "Legion Pro 5 2025", "bg-legion.png", "p2-legion.png",
    "Ryzen 9 8945HX · RTX 5060 8GB", "RAM 32GB · SSD 1TB", "16 inch 2.5K · Máy 99",
    "Hợp: game nặng ở 2.5K, làm 3D, dựng video 4K", "Bạn chơi game gì?");
}
// 5. CUỐI: chỉ chữ, không địa chỉ
function t5() {
  var d = newDoc("Laptop gaming - 05 cuoi");
  placeAt(TN + "bg-mix.png", 0, 0, "Nền");
  var L1 = text("Cần máy nào, comment", FS.I, 64, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Dòng 1" });
  centerText(L1, 540, 560); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("POLY BÁO GIÁ NHA", FS.T, 84, YEL, 0, 0, { name: "Dòng 2" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 84;
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 670); b3 = bb(L3);
  fxGlow(L3, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  emojiC("👇", 64, b3[2] + 50, 666, "Chỉ xuống");
  var cy = 816;
  var T = text("+  Follow @polystorelaptop", F.B, 34, C.WHITE, 0, cy + 12, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 38, cy - 38, 540 + w / 2 + 38, cy + 38, 38, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  LOG += "s5 comment " + b3.join(",") + "\n";
  save5(d, 5);
}

var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4, t5];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + " | emoji=" + F.E + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 5; k++) if (want(k)) {
    try { FN[k](); LOG += "0" + k + " ok\n"; } catch (e1) { LOG += "LOI 0" + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
