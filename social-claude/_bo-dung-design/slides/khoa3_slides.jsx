// ================= SLIDES: 3 CÁI KHÓA LAPTOP VĂN PHÒNG CŨ (26/10) =================
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
  var d = newDoc("3 khoa - 0" + n);
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
  var d = newDoc("3 khoa - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 140, { track: 200, name: "Thương hiệu" });
  var A = text("MUA LAPTOP\rVĂN PHÒNG CŨ", FS.T, 100, YEL, 540, 0, { align: Justification.CENTER, maxW: 960, lead: 104, name: "Tiêu đề" });
  var ab = bb(A); A.translate(540 - (ab[0] + ab[2]) / 2, 176 - ab[1]); ab = bb(A);
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("coi chừng 3 CÁI KHÓA", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Tiêu đề 2" });
  var bb2 = bb(B); B.translate(540 - (bb2[0] + bb2[2]) / 2, ab[3] + 22 - bb2[1]); bb2 = bb(B);
  fxGlow(B, { shadow: { op: 75, dist: 3, blur: 8 } });
  var S = text("Máy công ty thanh lý hay dính, mua xong mới biết", F.B, 30, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Mô tả" });
  var sb = bb(S); S.translate(540 - (sb[0] + sb[2]) / 2, bb2[3] + 20 - sb[1]); sb = bb(S);
  fx(S, { shadow: { op: 70, dist: 2, blur: 6 } });
  var ft = sb[3] + 30;
  shot("cv-bios.png", 884, 98, ft, 640, "Ảnh thật - ThinkPad ở shop đang mở BIOS");
  hookPill("Khóa 1 nằm ngay lúc bật máy", HOOK_Y);
  LOG += "s1 tieu de " + ab.join(",") + " mo ta den " + sb[3] + " anh " + ft + "-" + (ft + 640) + "\n";
  if (ft + 640 > HOOK_Y - 50) LOG += "  CANH BAO s1: anh sat cau moc\n";
  save5(d, 1);
}
function t2() {
  trickSlide(2, "KHÓA 1 · BIOS", "MẬT KHẨU BIOS", "Máy công ty hay cài mật khẩu này", "f2-bios.png",
    [["!", "Nhiều đời ThinkPad tháo pin không mất"], ["!", "Quên mật khẩu supervisor là thay main"],
     ["1", "Bật máy bấm F1 ThinkPad, F2 Dell, F10 HP"], ["ok", "Vào thẳng BIOS, không hỏi mật khẩu là ổn"]],
    "Khóa 2 hiện khi cài lại Windows", 570);
}
function t3() {
  trickSlide(3, "KHÓA 2 · TÀI KHOẢN", "TÀI KHOẢN\rCÔNG TY", "Cài lại Windows, nối mạng là hiện công ty cũ", "f3-oobe.png",
    [["!", "Bắt đăng nhập tài khoản công ty cũ"], ["!", "Chỉ công ty cũ hoặc nơi đăng ký mới gỡ"],
     ["1", "Tới bước chọn Wi-Fi thì nối mạng"], ["ok", "Không hiện tên công ty cũ là ổn"]],
    "Khóa 3 có thể làm mất dữ liệu", 515);
}
function t4() {
  trickSlide(4, "KHÓA 3 · BITLOCKER", "Ổ CỨNG BỊ MÃ HÓA", "Có lúc máy đòi mã khôi phục 48 số", "f4-bitlocker.png",
    [["!", "Không có mã là mất hết dữ liệu"], ["1", "Tìm \"Quản lý BitLocker\" ở ô tìm kiếm"],
     ["2", "Bản Home: tìm \"Mã hóa thiết bị\""], ["3", "Đang bật: nhờ bên bán tắt hoặc cài sạch"]],
    "Ở Poly kiểm thế nào?", 570);
}
function t5() {
  trickSlide(5, "MÁY Ở POLY", "KIỂM TRƯỚC\rMẶT KHÁCH", "Khi giao máy văn phòng cũ cho khách", "f5-shop.png",
    [["ok", "Vào BIOS không mật khẩu"], ["ok", "Cài Windows sạch"],
     ["ok", "Không dính tài khoản công ty"], ["ok", "Không bật BitLocker"]],
    "Bạn đang nhắm máy nào?", 495);
}
function t6() {
  var d = newDoc("3 khoa - 06 cuoi");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var L1 = text("Bạn đang tính mua", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 1" });
  centerText(L1, 540, 470); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("máy văn phòng cũ nào?", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 2" });
  centerText(L2, 540, 552); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("COMMENT TÊN MÁY", FS.T, 84, YEL, 0, 0, { name: "Comment" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 84;
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 664); b3 = bb(L3);
  fxGlow(L3, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  emojiC("👇", 64, b3[2] + 50, 660, "Chỉ xuống");
  var L4 = text("Poly báo máy đã kiểm và giá", F.B, 34, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Poly báo" });
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
