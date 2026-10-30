// ================= SLIDES: 3 LỖI VẶT LAPTOP TỰ SỬA (26/10) =================
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
function trickSlide(n, pillTxt, title, sub, img, items, hook, fh) {
  var d = newDoc("3 loi vat - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title, sub);
  var ft = sb + 30;
  shot(img, 884, 98, ft, fh, "Ảnh - " + title);
  var bot = steps(ft + fh + 26, items);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " sub den " + sb + " anh " + ft + "-" + (ft + fh) + " y den " + bot + "\n";
  if (bot > HOOK_Y - 50) LOG += "  CANH BAO s" + n + ": o y sat cau moc\n";
  save5(d, n);
}



function t1() {
  var d = newDoc("3 loi vat - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("3 LỖI VẶT LAPTOP", FS.T, 100, YEL, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Tiêu đề" });
  var ab = bb(A); A.translate(540 - (ab[0] + ab[2]) / 2, 200 - ab[1]); ab = bb(A);
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("tự sửa TẠI NHÀ", FS.I, 64, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Tiêu đề 2" });
  var bb2 = bb(B); B.translate(540 - (bb2[0] + bb2[2]) / 2, ab[3] + 24 - bb2[1]); bb2 = bb(B);
  fxGlow(B, { shadow: { op: 75, dist: 3, blur: 8 } });
  var S = text("Khỏi mang ra tiệm, mỗi lỗi chưa tới 1 phút", F.B, 32, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Mô tả" });
  var sb = bb(S); S.translate(540 - (sb[0] + sb[2]) / 2, bb2[3] + 22 - sb[1]); sb = bb(S);
  fx(S, { shadow: { op: 70, dist: 2, blur: 6 } });
  var ft = sb[3] + 34;
  shot("cv-dell.png", 884, 98, ft, 640, "Ảnh thật - Dell ở shop mở trang Cài đặt Bàn phím");
  hookPill("Lỗi 1: gõ phím không ăn", HOOK_Y);
  LOG += "s1 tieu de " + ab.join(",") + " anh " + ft + "-" + (ft + 640) + "\n";
  if (ft + 640 > HOOK_Y - 50) LOG += "  CANH BAO s1: anh sat cau moc\n";
  save5(d, 1);
}
function t2() {
  trickSlide(2, "LỖI 1 · BÀN PHÍM", "GÕ PHÍM PHẢI\rGIỮ MỚI ĂN", "Lỡ bật Phím lọc (Filter Keys) mà không biết", "f2-filterkeys.png",
    [["!", "Lỡ giữ Shift phải 8 giây rồi bấm Có"], ["ok", "Tắt nhanh: giữ Shift phải 8 giây lần nữa"],
     ["1", "Hoặc mở Cài đặt > Trợ năng"], ["2", "Bàn phím > tắt Phím lọc"]],
    "Lỗi 2: touchpad tự nhiên đứng", 515);
}
function t3() {
  trickSlide(3, "LỖI 2 · TOUCHPAD", "TOUCHPAD\rTỰ NHIÊN ĐỨNG", "Thường do lỡ bấm phím tắt touchpad", "f3-touchpad.png",
    [["!", "Lỡ bấm phím F hình touchpad gạch chéo"], ["ok", "Bấm lại phím đó (kèm Fn nếu cần)"],
     ["1", "Hoặc Cài đặt > Bluetooth và các thiết bị"], ["2", "Bàn di chuột > bật lại công tắc"]],
    "Lỗi 3: Wi-Fi hay rớt", 515);
}
function t4() {
  trickSlide(4, "LỖI 3 · WI-FI", "WI-FI HAY RỚT", "Có khi do Windows tắt card để tiết kiệm pin", "f4-powermgmt.png",
    [["1", "Device Manager > Network adapters"], ["2", "Chuột phải card Wi-Fi > Properties"],
     ["3", "Power Management > bỏ tick ô đầu tiên"], ["ok", "Không có tab thì cập nhật driver Wi-Fi"]],
    "Làm rồi vẫn không được?", 570);
}
function t5() {
  trickSlide(5, "LỖI PHẦN CỨNG", "VẪN KHÔNG ĐƯỢC?", "Chưa cần mua máy mới", "f5-matc.png",
    [["ok", "Bàn phím, touchpad đều thay được"], ["!", "Có máy phải thay cả mặt C (liền phím)"],
     ["ok", "Card Wi-Fi rời thì thay, hàn thì cắm USB"]],
    "Máy bạn đang bị lỗi gì?", 570);
}
function t6() {
  var d = newDoc("3 loi vat - 06 cuoi");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var L1 = text("Máy bạn đang bị", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 1" });
  centerText(L1, 540, 600); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("lỗi vặt nào?", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 2" });
  centerText(L2, 540, 682); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var cy = 820;
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
