
// ================= SLIDES: MÁY TRẠM DELL CHO KỸ SƯ (12/11) =================
// dạng báo giá nhiều máy (luật 2): tiêu đề fen viết (17d), giá nhỏ xanh không chữ "Giá" (luật 5), ảnh 884x470 cùng góc chính diện, thẻ kính cấu hình, ô xanh "Hợp với", câu móc
function fitW(T, maxW) { var b = bb(T), w = b[2] - b[0]; if (w > maxW) { var p = maxW / w * 100; T.resize(p, p, AnchorPosition.MIDDLECENTER); } }
var FH = 470, XANH = "4ADE80";
function dSlide(n, title, gia, cfg, xanh, hook) {
  var d = newDoc("Precision - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var tl = title.split("\r"), T = null;
  for (var q = 0; q < tl.length; q++) {
    var TQ = text(tl[q], FS.T, 72, YEL, 540, 0, { align: Justification.CENTER, name: "Tiêu đề " + (q + 1) });
    fitW(TQ, 860); centerText(TQ, 540, 231 + q * 82);
    fxGlow(TQ, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
    if (!T) T = TQ;
  }
  // giá nhỏ, chữ xanh, không chữ "Giá" (luật 5), đúng số fen viết
  var S = text(gia, FS.T, 44, XANH, 540, 0, { align: Justification.CENTER, name: "Giá" });
  centerText(S, 540, 392); fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  var pt = 440;
  shot("p-" + n + ".png", 884, 98, pt, FH, "Ảnh máy");
  var gt = pt + FH + 22, lhC = 48, gh = cfg.length * lhC + 40;
  glass(98, gt, 982, gt + gh, 28, "Cấu hình - nền");
  for (var i = 0; i < cfg.length; i++) {
    var A = text(cfg[i], F.B, 32, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Cấu hình " + (i + 1) });
    fitW(A, 820); centerText(A, 540, gt + 20 + lhC / 2 + i * lhC); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  var ky = gt + gh + 16, hh = xanh.indexOf("\r") >= 0 ? 100 : 70;
  var R = rect(98, ky, 982, ky + hh, 26, C.GREEN_SOFT, "Ô xanh - nền");
  fx(R, { shadow: { op: 40, dist: 6, blur: 12 } });
  var H = text(xanh, F.B, 28, C.INK, 540, 0, { align: Justification.CENTER, lead: 38, name: "Ô xanh" });
  fitW(H, 820); centerText(H, 540, ky + hh / 2);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " tieu de " + bb(T).join(",") + " gia " + bb(S).join(",") + " anh " + pt + "-" + (pt + FH) + " xanh den " + (ky + hh) + "\n";
  if (ky + hh > HOOK_Y - 36) LOG += "  CANH BAO s" + n + ": o xanh sat cau moc\n";
  save5(d, n);
}
// 1. BÌA (17b, 17c, 17d; bố cục C Cận chi tiết): Precision 5760 bung linh kiện, màn bản vẽ kiến trúc, nghiêng -6°, vệt sáng xanh dương
// lớp ảnh: bia_lop.py "sang=560,1200,1000,320,hex=3B82F6,op=0.42" "may=bia-may.png@580,880,1180,xoay=-6,sang=3B82F6" --kenh laptop --chu 530 -> DAT
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Precision - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - Precision 5760");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  // tiêu đề fen viết giữ đúng chữ (17d), từ khoá DELL trắng (17b 09/11)
  // 12/11 fen: cụm bìa cũ chưa hay -> "5 MÁY TRẠM DELL / CHO KỸ SƯ", bỏ dòng phụ (số 5 đã nằm trong tiêu đề)
  // 12/11 lần 2 fen: "Top 5 máy trạm dell cho kỹ sư; tại poly (chữ nhỏ trắng phía dưới)"
  var A = text("TOP 5 MÁY TRẠM", FS.T, 88, YEL, 96, 292, { name: "Tiêu đề 1 - TOP 5 MÁY TRẠM" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var A2 = text("DELL", FS.T, 88, C.WHITE, 96, 402, { name: "Tiêu đề 2 - DELL trắng" }); fxGlow(A2, { glow: { hex: "FFFFFF", op: 30, size: 26 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("CHO KỸ SƯ", FS.T, 88, YEL, bb(A2)[2] - 8, 402, { name: "Tiêu đề 2 - CHO KỸ SƯ" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var S = text("tại Poly", FS.I, 48, C.WHITE, 98, 490, { name: "Tại Poly - chữ trắng nhỏ" }); fxGlow(S, { shadow: { op: 80, dist: 3, blur: 8 } });
  hookPill("Rẻ nhất con nào?", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(A2).join(",") + " / " + bb(B).join(",") + " taipoly " + bb(S).join(",") + "\n";
  save5(d, 1);
}
function t2() { dSlide(2, "PRECISION 5550\rRẺ NHẤT", "13.800.000đ",
  ["i7-10850H · Quadro T2000 4GB", "RAM 32GB · SSD 512GB", "Màn 15.6 inch"],
  "Hợp với: vẽ AutoCAD 2D,\rdựng hình 3D nhẹ", "Cần màn to hơn?"); }
function t3() { dSlide(3, "PRECISION 5760\rMÀN 17 INCH", "22.800.000đ",
  ["Xeon W-11955M · RTX A3000 6GB", "RAM 16GB · SSD 1TB", "Màn 17 inch"],
  "Hợp với: Revit, SolidWorks\rcần màn rộng nhìn bản vẽ", "Muốn chip đời mới hơn?"); }
function t4() { dSlide(4, "PRECISION 5570\rLÊN CHIP I9", "24.800.000đ",
  ["i9-12900H · RTX A2000 8GB", "RAM DDR5 16GB · SSD 1TB", "Màn 15.6 inch · Ngoại hình 99%"],
  "Hợp với: kỹ sư cần máy\r15.6 inch gọn mà mạnh", "Mở nhiều phần mềm cùng lúc?"); }
function t5() { dSlide(5, "PRECISION 7680\rRAM 64GB", "26.500.000đ",
  ["i7-13850HX", "RAM DDR5 64GB · SSD 512GB", "Màn 16 inch"],
  "Hợp với: file bản vẽ nặng,\rmở CAD và Revit song song", "Đời mới nhất giá bao nhiêu?"); }
function t6() { dSlide(6, "PRECISION 5690\rĐỜI MỚI NHẤT", "38.800.000đ",
  ["Ultra 9 185H · RTX 2000 Ada 8GB", "RAM 32GB · SSD 1TB", "Màn 16 inch"],
  "Hợp với: render, dựng video,\rhay mang đi công trình", "Lưu bài lại so giá"); }
// 7. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa, đúng chữ fen
function t7() {
  var d = newDoc("Precision - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 96, YEL, 540, 0, { align: Justification.CENTER, name: "Dòng 1" });
  fitW(L1, 840); centerText(L1, 540, 640); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("lưu lại\rkhi cần nha", FS.I, 52, C.WHITE, 540, 0, { align: Justification.CENTER, lead: 66, name: "Dòng 2" });
  fitW(L2, 820); centerText(L2, 540, 790); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
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
