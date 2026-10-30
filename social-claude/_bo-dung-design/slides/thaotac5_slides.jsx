// ================= SLIDES: 5 THAO TÁC LAPTOP ÍT AI BIẾT (28/10) =================
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  // đặt theo đường chân chữ cố định (dấu tiếng Việt không làm lệch vị trí giữa các slide)
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
function trickSlide(n, pillTxt, title, sub, img, items, hook, fh) {
  var d = newDoc("5 thao tac - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title, sub);
  // cân bố cục: khối (ảnh + ô ý) lấp vùng từ dưới phụ đề tới trên câu móc, phần dư chia đều trên/dưới
  var stepsH = 34 + items.length * 52, top0 = sb + 30, bot0 = HOOK_Y - 62;
  var extra = Math.max(0, (bot0 - top0) - (fh + 26 + stepsH));
  // phần dư: trên ảnh tối đa 42, giữa ảnh và ô ý tối đa 60, còn lại để dưới (câu móc)
  var gap = 26 + Math.min(Math.round(extra / 3), 60);
  var ft = top0 + Math.round((extra - (gap - 26)) / 2);   // phần còn lại chia đều trên/dưới cho cân
  shot(img, 884, 98, ft, fh, "Ảnh - " + title);
  var bot = steps(ft + fh + gap, items);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " sub den " + sb + " anh " + ft + "-" + (ft + fh) + " y den " + bot + "\n";
  if (bot > HOOK_Y - 50) LOG += "  CANH BAO s" + n + ": o y sat cau moc\n";
  save5(d, n);
}




function t1() {
  var d = newDoc("5 thao tac - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  // bìa: chữ căn TRÁI hết lề (luật chủ shop: "căn lề hết bên trái")
  var A = text("5 THAO TÁC LAPTOP", FS.T, 90, YEL, 98, 0, { maxW: 884, name: "Tiêu đề" });
  var ab = bb(A); A.translate(98 - ab[0], 200 - ab[1]); ab = bb(A);
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("ít ai BIẾT", FS.I, 70, C.WHITE, 98, 0, { maxW: 884, name: "Tiêu đề 2" });
  var bb2 = bb(B); B.translate(98 - bb2[0], ab[3] + 22 - bb2[1]); bb2 = bb(B);
  fxGlow(B, { shadow: { op: 75, dist: 3, blur: 8 } });
  var S = text("Số 5 đỡ hết lo ổ cứng đầy", F.B, 34, C.GREEN_L, 98, 0, { maxW: 884, name: "Mô tả" });
  var sb = bb(S); S.translate(100 - sb[0], bb2[3] + 22 - sb[1]); sb = bb(S);
  fx(S, { shadow: { op: 70, dist: 2, blur: 6 } });
  var ft = sb[3] + 34;
  shot("cv-laptop.png", 884, 98, ft, 699, "Ảnh - laptop trên bàn (tạm)");
  hookPill("Thao tác 1: lỡ tay đóng tab", HOOK_Y);
  LOG += "s1 tieu de " + ab.join(",") + " anh " + ft + "-" + (ft + 699) + "\n";
  if (ft + 699 > HOOK_Y - 50) LOG += "  CANH BAO s1: anh sat cau moc\n";
  save5(d, 1);
}
function t2() {
  trickSlide(2, "THAO TÁC 1 · TAB", "LỠ ĐÓNG TAB", "Mở lại tab vừa đóng trên Chrome, Edge", "f2-tab.png",
    [["ok", "Bấm Ctrl + Shift + T"], ["ok", "Bấm nhiều lần: mở lại nhiều tab"]],
    "Rời bàn mà quên tắt màn?", 557);
}
function t3() {
  trickSlide(3, "THAO TÁC 2 · KHÓA MÁY", "KHÓA MÁY 1 GIÂY", "Ứng dụng đang mở vẫn giữ nguyên", "f3-osk.png",
    [["ok", "Bấm Win + L là khóa ngay"], ["ok", "Đi họp, đi ăn trưa bấm 1 cái"], ["ok", "Khỏi lo người khác xem màn hình"]],
    "Lười gõ phím?", 420);
}
function t4() {
  trickSlide(4, "THAO TÁC 3 · GIỌNG NÓI", "GÕ BẰNG GIỌNG NÓI", "Nói tới đâu chữ hiện tới đó", "f4-voice.png",
    [["1", "Đặt con trỏ vào Word, Zalo, Gmail"], ["2", "Bấm Win + H rồi nói"], ["!", "Cần có mạng mới gõ được"]],
    "Chữ nhỏ quá nhìn không rõ?", 500);
}
function t5() {
  trickSlide(5, "THAO TÁC 4 · KÍNH LÚP", "PHÓNG TO CHỮ NHỎ", "Xem bảng tính, ảnh scan mờ đỡ căng mắt", "f5-kinhlup.png",
    [["ok", "Win + dấu cộng (+): bật Kính lúp"], ["ok", "Win + Esc để tắt"]],
    "Ổ cứng lúc nào cũng đầy?", 566);
}
function t6() {
  trickSlide(6, "THAO TÁC 5 · Ổ CỨNG", "TỰ DỌN RÁC Ổ CỨNG", "Windows tự xóa file tạm, thùng rác cũ", "f6-storage.png",
    [["1", "Cài đặt > Hệ thống > Lưu trữ"], ["2", "Bật Storage Sense"]],
    "Máy bạn ổ còn bao nhiêu?", 400);
}
function t7() {
  var d = newDoc("5 thao tac - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  var L1 = text("Máy bạn ổ cứng còn trống", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Hỏi 1" });
  centerText(L1, 540, 565); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("bao nhiêu, dùng máy gì?", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Hỏi 2" });
  centerText(L2, 540, 647); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("Comment, Poly báo nên nâng ổ hay đổi máy", F.B, 34, C.GREEN_L, 0, 0, { name: "Comment" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 56; // + khoảng cách + emoji để cả nhóm căn giữa
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 747); b3 = bb(L3);
  fx(L3, { shadow: { op: 70, dist: 2, blur: 6 } });
  emojiC("👇", 44, b3[2] + 34, 745, "Chỉ xuống");
  var cy = 855;
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
