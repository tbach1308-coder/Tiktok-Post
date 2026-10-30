
// ================= SLIDES: 5 PHÍM TẮT LAPTOP =================
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" });
  var tb = bb(T); T.translate(0, 214 - tb[1]); tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 36, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 900, name: "Phụ đề" });
  var sb = bb(S); S.translate(0, tb[3] + 24 - sb[1]); sb = bb(S);
  fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  return sb[3];
}
function steps(t, items) {
  // items: [["1"|"!"|"ok", "chữ"], ...]
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
function trickSlide(n, pillTxt, title, sub, img, items, hook) {
  var d = newDoc("5 phim tat - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title, sub);
  var ft = sb + 30;
  shot(img, 884, 98, ft, 520, "Ảnh - " + title);
  var bot = steps(ft + 520 + 26, items);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " sub den " + sb + " anh " + ft + "-" + (ft + 520) + " y den " + bot + "\n";
  if (bot > HOOK_Y - 50) LOG += "  CANH BAO s" + n + ": o y sat cau moc\n";
  save5(d, n);
}

function t1() {
  var d = newDoc("5 phim tat - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("5 PHÍM TẮT LAPTOP", FS.T, 104, YEL, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề" });
  centerText(A, 540, 262);
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("dân văn phòng nên biết", FS.I, 58, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 2" });
  centerText(B, 540, 360); fxGlow(B, { shadow: { op: 75, dist: 3, blur: 8 } });
  var S = text("Laptop Windows, bấm 1 lần là nhớ", F.B, 32, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 900, name: "Mô tả" });
  centerText(S, 540, 438); fx(S, { shadow: { op: 70, dist: 2, blur: 6 } });
  shot("cv-shop.png", 884, 98, 500, 640, "Ảnh thật - phím Windows cận cảnh");
  hookPill("Phím 1 cứu màn hình đơ", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "PHÍM 1 · MÀN HÌNH", "MÀN ĐƠ, ĐEN?\rBẤM 4 PHÍM", "Win + Ctrl + Shift + B", "f-keys.png",
    [["ok", "Khởi động lại driver màn hình"], ["ok", "App đang mở vẫn còn nguyên"], ["!", "Bị hoài thì nên kiểm tra card, driver"]],
    "Chụp màn hình nhanh hơn?");
}
function t3() {
  trickSlide(3, "PHÍM 2 · CHỤP MÀN HÌNH", "CHỤP 1 VÙNG\rMÀN HÌNH", "Win + Shift + S", "f-snip.png",
    [["1", "Kéo chọn vùng cần chụp"], ["2", "Ảnh nằm sẵn trong bộ nhớ tạm"], ["ok", "Dán thẳng vào Zalo, Word, Excel"]],
    "Mở nhiều việc quá rối?");
}
function t4() {
  trickSlide(4, "PHÍM 3 · MÀN HÌNH ẢO", "TÁCH 2 MÀN HÌNH ẢO", "Màn làm việc, màn việc riêng, không lẫn", "f-taskview.png",
    [["1", "Win + Ctrl + D: tạo màn hình ảo mới"], ["2", "Win + Ctrl + mũi tên: chuyển qua lại"], ["3", "Win + Ctrl + F4: đóng màn đang dùng"]],
    "Đi họp cần chiếu màn hình?");
}
function t5() {
  trickSlide(5, "PHÍM 4 · MÁY CHIẾU", "CHIẾU LÊN TIVI,\rMÁY CHIẾU", "Cắm dây xong bấm Win + P", "f-winp.png",
    [["ok", "Duplicate: 2 màn giống nhau"], ["ok", "Extend: mở rộng thành 2 màn riêng"]],
    "Phím cuối: 2 việc 1 màn hình");
}
function t6() {
  trickSlide(6, "PHÍM 5 · CHIA ĐÔI", "CHIA ĐÔI MÀN HÌNH", "Vừa soạn báo giá vừa ghi chú khách", "f-split.png",
    [["1", "Win + mũi tên trái/phải: dính nửa màn"], ["2", "Chọn cửa sổ còn lại cho nửa kia"], ["!", "Màn 13–14 inch hơi chật, 16 inch thoải mái"]],
    "Máy bạn chia đôi có chật?");
}
function t7() {
  var d = newDoc("5 phim tat - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  var L1 = text("Máy bạn màn mấy inch,", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 1" });
  centerText(L1, 540, 470); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("làm việc gì?", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 2" });
  centerText(L2, 540, 552); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("COMMENT TÊN MÁY", FS.T, 84, YEL, 0, 0, { name: "Comment" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 84;
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 664); b3 = bb(L3);
  fxGlow(L3, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  emojiC("👇", 64, b3[2] + 50, 660, "Chỉ xuống");
  var L4 = text("Poly báo máy còn hợp hay nên lên đời", F.B, 34, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Poly báo" });
  centerText(L4, 540, 756); fx(L4, { shadow: { op: 70, dist: 2, blur: 6 } });
  var cy = 874;
  var T = text("+  Follow @polystorelaptop", F.B, 34, C.WHITE, 0, cy + 12, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 38, cy - 38, 540 + w / 2 + 38, cy + 38, 38, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  LOG += "s7 comment " + b3.join(",") + "\n";
  save5(d, 7);
}
var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5, 6, 7];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4, t5, t6, t7];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + " | emoji=" + F.E + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 7; k++) if (want(k)) {
    try { FN[k](); LOG += "0" + k + " ok\n"; } catch (e1) { LOG += "LOI 0" + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
