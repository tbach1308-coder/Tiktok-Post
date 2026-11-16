// ================= SLIDES: MACBOOK BẠN BẬT 5 TRICK CHƯA? (03/11) =================
// kiểu bài mẹo (ocung_slides.jsx): headT + trickSlide; ảnh màn macOS là ảnh thật trên mạng (máy shop là Windows, app không tự chụp)
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var nL = t.split("\r").length;
  var T = text(t, FS.T, 76, YEL, 540, 281, { align: Justification.CENTER, maxW: 884, lead: 84, name: "Tiêu đề" });
  var tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 36, C.WHITE, 540, 337 + (nL - 1) * 84, { align: Justification.CENTER, maxW: 884, name: "Phụ đề" });
  var sb = bb(S);
  fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  return sb[3];
}
function steps(t, items) {
  var lh = 52, h = 34 + items.length * lh;
  glass(98, t, 982, t + h, 28, "Ý chính - nền");
  for (var i = 0; i < items.length; i++) {
    var y = t + 17 + lh / 2 + i * lh + 10;
    var k = items[i][0];
    if (k == "!") bulletW(items[i][1], 128, y, 29);
    else if (k == "ok") bullet(items[i][1], 128, y, 29);
    else bulletN(k, C.GREEN, items[i][1], 128, y, 29);
  }
  return t + h;
}
function trickSlide(n, pillTxt, title, sub, img, items, hook, fh) {
  var d = newDoc("Trick Mac - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title, sub);
  var stepsH = 34 + items.length * 52, top0 = sb + 30, bot0 = HOOK_Y - 62;
  var extra = Math.max(0, (bot0 - top0) - (fh + 26 + stepsH));
  var gap = 26 + Math.min(Math.round(extra / 3), 60);
  var ft = top0 + Math.round((extra - (gap - 26)) / 2);
  shot(img, 884, 98, ft, fh, "Ảnh - " + title);
  var bot = steps(ft + fh + gap, items);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " sub den " + sb + " anh " + ft + "-" + (ft + fh) + " y den " + bot + "\n";
  if (bot > HOOK_Y - 50) LOG += "  CANH BAO s" + n + ": o y sat cau moc\n";
  save5(d, n);
}

// 1. BÌA (luật 17c, bố cục C Cận chi tiết): MacBook Air 13 màn System Settings > Battery, nghiêng -7°, vệt sáng xanh lá
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Trick Mac - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - MacBook");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("5 MẸO MACBOOK", FS.T, 90, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("BẠN BIẾT CHƯA?", FS.T, 90, YEL, 96, 412, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  LOG += "s1 t1 " + bb(A).join(",") + " t2 " + bb(B).join(",") + "\n";
  hookPill("Vuốt coi máy bạn", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "MẸO 1 · TRACKPAD", "KÉO BẰNG 3 NGÓN", "Kéo cửa sổ, file khỏi đè trackpad", "s2-trackpad.png",
    [["1", "System Settings > Accessibility > Pointer Control"], ["2", "Trackpad Options > Use trackpad for dragging"],
     ["3", "Dragging style chọn Three Finger Drag"], ["!", "Tuỳ chọn này dành cho trackpad Force Touch"]],
    "Cắm sạc cả ngày thì chỉnh gì?", 487);
}
function t3() {
  trickSlide(3, "MẸO 2 · GIỚI HẠN SẠC", "CẮM SẠC CẢ NGÀY", "Chọn mức sạc tối đa cho pin", "s3-sac.png",
    [["1", "System Settings > Battery"], ["2", "Bấm nút i cạnh Charging"],
     ["3", "Chọn giới hạn từ 80% đến 100%"], ["!", "Cần macOS Tahoe 26.4 trở lên, máy chip Apple"]],
    "Pin bạn sạc bao nhiêu lần rồi?", 500);
}
function t4() {
  trickSlide(4, "MẸO 3 · PIN", "XEM SỐ LẦN SẠC", "Coi pin đang ở mốc nào", "s4-cycle.png",
    [["1", "Giữ Option, bấm menu Apple > System Information"], ["2", "Vào Power, coi dòng Cycle Count"],
     ["!", "Nhiều đời tính mốc 1.000 lần, pin giữ tới 80%"],
     ["!", "Tới mốc này, Apple khuyên thay pin"]],
    "Máy đơ có phải do thiếu RAM?", 427);
}
function t5() {
  trickSlide(5, "MẸO 4 · RAM", "MÁY ĐƠ DO\rTHIẾU RAM?", "Coi đúng chỗ rồi hẵng kết luận", "s5-am.png",
    [["1", "Activity Monitor > Memory, coi Memory Pressure"], ["ok", "Xanh là ổn, đỏ là máy cần thêm RAM"],
     ["2", "Giữ Option, vào System Information > Memory"], ["!", "Không có Memory Slots: thêm RAM phải lên đời"]],
    "Ổ đầy thì dọn ở đâu?", 508);
}
function t6() {
  trickSlide(6, "MẸO 5 · Ổ CỨNG", "Ổ ĐẦY,\rDỌN CHỖ NÀO?", "Thấy ngay app, loại file nào chiếm chỗ", "s6-storage.png",
    [["1", "System Settings > General > Storage"],
     ["2", "Bật Empty Trash Automatically"], ["ok", "Rác quá 30 ngày máy tự xoá"],
     ["!", "Chưa đổ Thùng rác thì ổ chưa trống đâu nha"]],
    "Máy bạn thì sao?", 461);
}
// 7. CUỐI (luật 16h, không Follow): 1 thẻ kính câu hỏi căn giữa slide
function t7() {
  var d = newDoc("Trick Mac - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu hỏi");
  var L1 = text("MacBook bạn đời nào,", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 665); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("SẠC BAO NHIÊU LẦN RỒI?", FS.T, 60, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 775); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
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
