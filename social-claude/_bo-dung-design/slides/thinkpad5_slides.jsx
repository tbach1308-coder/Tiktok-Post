
// ================= SLIDES: THINKPAD NÀO PHÙ HỢP VỚI BẠN? (10/11) =================
// dạng báo giá nhiều máy (luật 2): tiêu đề fen viết có giá (17d), phụ đề nghiêng = ý fen, ảnh 884x450, thẻ kính cấu hình, ô xanh "Hợp với", câu móc
function fitW(T, maxW) { var b = bb(T), w = b[2] - b[0]; if (w > maxW) { var p = maxW / w * 100; T.resize(p, p, AnchorPosition.MIDDLECENTER); } }
var FH = 450;
function tpSlide(n, title, sub, cfg, xanh, hook) {
  var d = newDoc("ThinkPad - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  // 2 dòng tách lớp: dòng 1 (giá) giữ 72 mọi slide, dòng dài chỉ tự thu dòng đó (agent thiết kế 10/11)
  var tl = title.split("\r"), T = null;
  for (var q = 0; q < tl.length; q++) {
    var TQ = text(tl[q], FS.T, 72, YEL, 540, 0, { align: Justification.CENTER, name: "Tiêu đề " + (q + 1) });
    fitW(TQ, 860); centerText(TQ, 540, 231 + q * 82);
    fxGlow(TQ, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
    if (!T) T = TQ;
  }
  var S = text(sub, FS.I, 34, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Phụ đề" });
  fitW(S, 860); centerText(S, 540, 394); fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  var pt = 440; // cố định để ảnh 5 slide thẳng hàng
  shot("p-" + n + ".png", 884, 98, pt, FH, "Ảnh máy");
  // thẻ kính: cấu hình trắng
  var gt = pt + FH + 22, lhC = 48, gh = cfg.length * lhC + 40;
  glass(98, gt, 982, gt + gh, 28, "Cấu hình - nền");
  for (var i = 0; i < cfg.length; i++) {
    var A = text(cfg[i], F.B, 32, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Cấu hình " + (i + 1) });
    fitW(A, 820); centerText(A, 540, gt + 20 + lhC / 2 + i * lhC); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  // ô xanh
  var ky = gt + gh + 16, hh = xanh.indexOf("\r") >= 0 ? 100 : 70;
  var R = rect(98, ky, 982, ky + hh, 26, C.GREEN_SOFT, "Ô xanh - nền");
  fx(R, { shadow: { op: 40, dist: 6, blur: 12 } });
  var H = text(xanh, F.B, 28, C.INK, 540, 0, { align: Justification.CENTER, lead: 38, name: "Ô xanh" });
  fitW(H, 820); centerText(H, 540, ky + hh / 2);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " tieu de " + bb(T).join(",") + " phu de " + bb(S).join(",") + " anh " + pt + "-" + (pt + FH) + " xanh den " + (ky + hh) + "\n";
  if (ky + hh > HOOK_Y - 36) LOG += "  CANH BAO s" + n + ": o xanh sat cau moc\n";
  save5(d, n);
}
// 1. BÌA (luật 17b, 17c, 17d, bố cục B Hero tràn): P1 Gen 6 (Icecat g6_02, góc 3/4) tràn phải 7%, vệt sáng xanh dương, 1 sticker trắng
// lớp ảnh: bia_lop.py "sang=600,1200,1000,300,hex=3B82F6,op=0.42" "may=<bia-may.png>@612,862,1240,xoay=-7,sang=3B82F6" --kenh laptop --chu 450
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("ThinkPad - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad P1 Gen 6");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  // tiêu đề fen viết giữ đúng chữ (17d), từ khoá THINKPAD trắng (17b 09/11)
  var A = text("THINKPAD", FS.T, 88, C.WHITE, 96, 292, { name: "Tiêu đề 1 - THINKPAD trắng" }); fxGlow(A, { glow: { hex: "FFFFFF", op: 30, size: 26 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var A2 = text("NÀO", FS.T, 88, YEL, bb(A)[2] - 4, 292, { name: "Tiêu đề 1 - NÀO" }); fxGlow(A2, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("PHÙ HỢP VỚI BẠN?", FS.T, 88, YEL, 96, 402, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  fitW(B, 884);
  // bỏ sticker "5 máy, 5 tầm tiền" (agent duyệt 10/11: bìa quá 12 chữ, luật 17b)
  hookPill("Có con RTX 3080", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(A2).join(",") + " / " + bb(B).join(",") + "\n";
  save5(d, 1);
}
function t2() { tpSlide(2, "15,3 TRIỆU CÓ\rTHINKPAD T14 GEN 3",
  "Máy có 1 khe RAM, cần thì shop nâng thêm được",
  ["i7-1260P · RAM 16GB · SSD 512GB", "Màn 14 inch Full HD+", "Máy newbody, pin 100%"],
  "Hợp với: văn phòng, kế toán,\rExcel nặng, họp online", "Cần RAM nhiều hơn mà vẫn nhẹ?"); }
function t3() { tpSlide(3, "21,8 TRIỆU CÓ\rTHINKPAD P14S GEN 4",
  "RAM hàn liền main, mua sẵn 32GB là xài lâu khỏi nâng",
  ["Ryzen 5 PRO 7540U", "RAM 32GB LPDDR5X · SSD 512GB", "Màn 14 inch Full HD+"],
  "Hợp với: code, chạy máy ảo,\rCAD 2D nhẹ", "Có card rời thì phải lên tầm nào?"); }
function t4() { tpSlide(4, "28,5 TRIỆU CÓ\rTHINKPAD P1 GEN 4",
  "RAM 2 khe, nâng lên 32GB dễ",
  ["i9-11950H · RTX 3080 16GB", "RAM 16GB DDR4 · SSD 1TB", "Màn 16 inch 4K 600 nits · Pin còn 81/90Wh"],
  "Hợp với: dựng video, render 3D, Revit", "Muốn card dòng máy trạm thì sao?"); }
function t5() { tpSlide(5, "37,8 TRIỆU CÓ\rTHINKPAD P1 GEN 6",
  "Card RTX Ada là dòng card dành cho máy trạm",
  ["i7-13800H · RTX 2000 Ada 8GB", "RAM 32GB DDR5 · SSD 1TB", "Màn 16 inch 2.5K · Pin còn 86/90Wh"],
  "Hợp với: SolidWorks, AutoCAD,\rRevit làm hằng ngày", "Đi công tác nhiều thì lấy con nào?"); }
function t6() { tpSlide(6, "39,5 TRIỆU CÓ\rTHINKPAD X1 CARBON GEN 13",
  "Không card rời, đổi lại mỏng nhẹ nhất trong 5 con",
  ["Core Ultra 7 258V · RAM 32GB LPDDR5X", "SSD 512GB · Màn 14 inch 2.8K", "Pin 100% · nặng chỉ khoảng 1kg"],
  "Hợp với: sếp, sale,\rngười hay đi công tác", "Bạn hợp con nào trong 5 con?"); }
// 7. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t7() {
  var d = newDoc("ThinkPad - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 96, YEL, 540, 0, { align: Justification.CENTER, name: "Dòng 1" });
  fitW(L1, 840); centerText(L1, 540, 640); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để cập nhật máy\rmỗi ngày", FS.I, 52, C.WHITE, 540, 0, { align: Justification.CENTER, lead: 66, name: "Dòng 2" });
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
