// ================= SLIDES: DỰNG VIDEO CẦN LAPTOP GÌ (25/10) =================
function fitW(T, maxW) { var b = bb(T), w = b[2] - b[0]; if (w > maxW) { var p = maxW / w * 100; T.resize(p, p, AnchorPosition.MIDDLECENTER); } }
function headT(pillTxt, t) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" });
  var tb = bb(T); T.translate(0, 214 - tb[1]); tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  return tb[3];
}
function needCard(t, n, title, sub) {
  var h = 128; glass(98, t, 982, t + h, 28, "Ý " + n + " - nền");
  var O = oval(126, t + h / 2 - 32, 190, t + h / 2 + 32, YEL, "Ý " + n + " - số nền");
  fx(O, { shadow: { op: 50, dist: 3, blur: 8 } });
  centerText(text(String(n), FS.T, 40, C.INK, 158, t + h / 2 + 14, { align: Justification.CENTER, name: "Ý " + n + " - số" }), 158, t + h / 2);
  var A = text(title, F.B, 34, C.WHITE, 218, t + 54, { maxW: 740, name: "Ý " + n + " - tên" });
  fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text(sub, F.B, 26, "CBD5E1", 218, t + 98, { maxW: 740, name: "Ý " + n + " - giải thích" });
  fitW(B, 740);
  return t + h;
}
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
function productSlide(n, brand, model, img, l1, l2, l3, hop, hook) {
  var d = newDoc("Dung video - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var K = text(brand, F.B, 26, "CBD5E1", 540, 0, { align: Justification.CENTER, track: 300, name: "Hãng" });
  centerText(K, 540, 204);
  var T = text(model, FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, name: "Tiêu đề" });
  fitW(T, 880); centerText(T, 540, 280);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  shot(img, 884, 98, 372, 540, "Ảnh - " + model);
  var bot = specHop(932, l1, l2, l3, hop);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " title " + bb(T).join(",") + " hop den " + bot + "\n";
  if (bot > HOOK_Y - 46) LOG += "  CANH BAO s" + n + ": sat cau moc\n";
  save5(d, n);
}
// 1. BÌA
function t1() {
  var d = newDoc("Dung video - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("DỰNG VIDEO", FS.T, 112, YEL, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 1" });
  centerText(A, 540, 250); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("cần LAPTOP GÌ?", FS.T, 104, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 2" });
  centerText(B, 540, 358); fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  var S = text("3 máy màn 4K đang có ở Poly", FS.I, 40, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Mô tả" });
  centerText(S, 540, 446); fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  shot("cv-p1g4.png", 884, 98, 500, 640, "Ảnh thật - ThinkPad P1 Gen 4 ở shop mở phần mềm dựng video");
  hookPill("Xem máy hợp kiểu bạn dựng", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(B).join(",") + "\n";
  save5(d, 1);
}
// 2. CẦN 3 THỨ
function t2() {
  var d = newDoc("Dung video - 02 can 3 thu");
  placeAt(TN + "bg-2.png", 0, 0, "Nền");
  var sb = headT("TRƯỚC KHI CHỌN MÁY", "DỰNG VIDEO\rCẦN 3 THỨ");
  var ft = sb + 40;
  shot("f2-premiere.png", 884, 98, ft, 380, "Ảnh thật - màn hình dựng video");
  var y = ft + 380 + 26;
  y = needCard(y, 1, "Card rời đủ VRAM", "Xuất video nhanh, VRAM nhiều thì 4K mượt") + 14;
  y = needCard(y, 2, "RAM 16GB trở lên", "Chạy Premiere, DaVinci không giật lag") + 14;
  var bot = needCard(y, 3, "Màn nét, chuẩn màu", "Phủ màu rộng thì chỉnh màu mới ra màu thật");
  hookPill("Máy đầu tiên cho dân vlog", HOOK_Y);
  LOG += "s2 tieu de den " + sb + " anh " + ft + " the den " + bot + "\n";
  if (bot > HOOK_Y - 46) LOG += "  CANH BAO s2: sat cau moc\n";
  save5(d, 2);
}
function t3() {
  productSlide(3, "DELL", "XPS 15 9520", "p-xps.png",
    "i7-12700H · RTX 3050 Ti 4GB", "RAM 16GB · SSD 1TB", "15.6 inch 4K cảm ứng",
    "Hợp với: dựng Full HD, vlog, YouTube, chỉnh ảnh", "Cần xuất 4K nhanh hơn?");
}
function t4() {
  productSlide(4, "LENOVO", "ThinkPad P1 Gen 4", "p-p1g4.png",
    "i9-11950H · RTX 3080 16GB", "RAM 16GB · SSD 1TB", "16 inch 4K · 600 nit",
    "Hợp với: dựng 4K trên Premiere, DaVinci,\rlàm After Effects, render 3D", "Muốn đời mới nhất?");
}
function t5() {
  productSlide(5, "LENOVO", "ThinkPad P1 Gen 8", "p-p1g8.png",
    "Ultra 7 255H · RTX PRO 2000 Blackwell", "RAM 32GB · SSD 1TB", "16 inch 4K · pin 100%",
    "Hợp với: dựng 4K cả ngày, làm studio,\rcần máy đời mới", "Bạn dựng bằng gì?");
}
// 6. CUỐI: chỉ chữ
function t6() {
  var d = newDoc("Dung video - 06 cuoi");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var L1 = text("Bạn dựng bằng CapCut,", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Hỏi 1" });
  centerText(L1, 540, 470); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("Premiere hay DaVinci?", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 2" });
  centerText(L2, 540, 552); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("COMMENT NGAY", FS.T, 88, YEL, 0, 0, { name: "Comment" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 84;
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 664); b3 = bb(L3);
  fxGlow(L3, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  emojiC("👇", 64, b3[2] + 50, 660, "Chỉ xuống");
  var L4 = text("Poly chọn máy và báo giá", F.B, 34, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Poly chọn máy" });
  centerText(L4, 540, 756); fx(L4, { shadow: { op: 70, dist: 2, blur: 6 } });
  var cy = 874;
  var T = text("+  Follow @polystorelaptop", F.B, 34, C.WHITE, 0, cy + 12, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 38, cy - 38, 540 + w / 2 + 38, cy + 38, 38, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  save5(d, 6);
}
var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5, 6];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4, t5, t6];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 6; k++) if (want(k)) {
    try { FN[k](); LOG += "0" + k + " ok\n"; } catch (e1) { LOG += "LOI 0" + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
