// ================= SLIDES: TOP 5 LAPTOP CHO KẾ TOÁN (15/11, sửa từ bài Kế toán chọn laptop nào) =================
// Máy + cấu hình lấy từ kho Poly (file _thong-tin-may.txt), ảnh hãng PSREF, kiểu productSlide của top5_25tr_slides.jsx. Không giá (bài nhiều máy).
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
  var y = t + h + 24;
  var K = rect(98, y, 982, y + hh, 28, C.GREEN_SOFT, "Hợp với - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var T = text(hop, F.B, 30, C.INK, 540, 0, { align: Justification.CENTER, lead: 42, name: "Hợp với" });
  fitW(T, 820); centerText(T, 540, y + hh / 2);
  return y + hh;
}
function productSlide(n, brand, model, sub, img, l1, l2, l3, hop, hook) {
  var d = newDoc("Top5 ke toan - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var K = text(brand, F.B, 26, "CBD5E1", 540, 0, { align: Justification.CENTER, track: 300, name: "Hãng" });
  centerText(K, 540, 204);
  var T = text(model, FS.T, 80, YEL, 540, 0, { align: Justification.CENTER, name: "Tiêu đề" });
  fitW(T, 880); centerText(T, 540, 272);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 34, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Phụ đề" });
  fitW(S, 900); centerText(S, 540, 342); fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  shot(img, 884, 98, 390, 510, "Ảnh - " + model);
  var bot = specHop(924, l1, l2, l3, hop);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " title " + bb(T).join(",") + " hop den " + bot + "\n";
  if (bot > HOOK_Y - 46) LOG += "  CANH BAO s" + n + ": sat cau moc\n";
  save5(d, n);
}
// 1. BÌA (luật 17c, bố cục F Sticker chú thích): ThinkPad T16 Gen 3 (PSREF CT1_08), nghiêng -1°, vệt sáng xanh lá, 1 sticker "Phím số"
// lớp ảnh: bia_lop.py "sang=520,1180,1000,420,hex=22C55E,op=0.40" "may=<bia-may.png>@592,868,1165,xoay=-1,sang=22C55E" --kenh laptop --chu 480
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Top5 ke toan - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad T16 Gen 3");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("TOP 5 LAPTOP", FS.T, 96, YEL, 96, 276, { name: "Tiêu đề 1" });
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("CHO KẾ TOÁN", FS.T, 96, C.WHITE, 96, 382, { name: "Tiêu đề 2 (từ khoá trắng)" }); // luật 17b: từ khoá trắng
  fxGlow(B, { glow: { hex: C.WHITE, op: 30, size: 24 }, shadow: { op: 70, dist: 5, blur: 12 } });
  LOG += "s1 t " + bb(A).join(",") + " / " + bb(B).join(",") + "\n";
  var P = text("tại Poly Store", FS.I, 38, C.WHITE, 100, 442, { name: "Dòng phụ" }); // fen 15/11: chữ trắng nhỏ dưới title
  fxGlow(P, { shadow: { op: 80, dist: 3, blur: 8 } });
  LOG += "s1 phu " + bb(P).join(",") + "\n";
  sticker("Phím số", 780, 950, -5, "vang");
  hookPill("Chọn theo cách dùng", HOOK_Y);
  save5(d, 1);
}
function t2() {
  productSlide(2, "LENOVO THINKPAD", "T16 Gen 3", "Máy duy nhất trong top có phím số riêng.", "p-t16.png",
    "Ultra 5 125U · Intel Graphics", "RAM 16GB · SSD 512GB", "16 inch Full HD+ cảm ứng",
    "Hợp với: nhập số liệu cả ngày.\rRAM 2 khe, nâng được tới 64GB", "Cần cổng mạng, máy gọn?");
}
function t3() {
  productSlide(3, "LENOVO THINKPAD", "T14 Gen 3", "Có cổng mạng RJ-45 và HDMI, nặng từ 1,36 kg.", "p-t14.png",
    "i7-1260P · Intel Iris Xe", "RAM 16GB · SSD 512GB", "14 inch Full HD+",
    "Hợp với: ngồi văn phòng, cắm dây mạng.\rCó HDMI ra màn hình ngoài", "Mở nhiều file cùng lúc?");
}
function t4() {
  productSlide(4, "LENOVO THINKPAD", "X1 Carbon Gen 9", "RAM 32GB hàn trên main, nặng từ 1,13 kg.", "p-x1c9.png",
    "i7-1185G7 · Intel Iris Xe", "RAM 32GB · SSD 512GB", "14 inch Full HD+ cảm ứng",
    "Hợp với: mở nhiều file Excel, MISA.\rRAM hàn, không nâng được", "Cần ổ cứng lớn?");
}
function t5() {
  productSlide(5, "LENOVO THINKPAD", "X13 Gen 3", "13,3 inch gọn, RAM 32GB, SSD 1TB.", "p-x13.png",
    "i7-1280P · Intel Iris Xe", "RAM 32GB · SSD 1TB", "13,3 inch Full HD+",
    "Hợp với: lưu nhiều chứng từ, SSD 1TB.\rRAM hàn, không có cổng mạng", "Muốn máy mới hơn?");
}
function t6() {
  productSlide(6, "LENOVO THINKPAD", "X1 Carbon Gen 13", "Đời mới nhất trong top, chip Ultra 7, RAM 32GB.", "p-x1c.png",
    "Ultra 7 258V · Intel Arc 140V", "RAM 32GB · SSD 512GB", "14 inch",
    "Hợp với: đi lại nhiều, cần máy mỏng.\rRAM hàn, không có cổng mạng", "Chọn máy theo nghề?");
}
// 7. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t7() {
  var d = newDoc("Top5 ke toan - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 657); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để chọn laptop theo nghề", FS.I, 54, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 787); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
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
