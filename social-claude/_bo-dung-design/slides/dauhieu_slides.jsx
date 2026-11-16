// ================= SLIDES: 4 DẤU HIỆU LAPTOP CẦN SỬA (05/11) =================
// kiểu bài mẹo (win10_slides.jsx): headT + trickSlide
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var nL = t.split("\r").length;
  var T = text(t, FS.T, 76, YEL, 540, 281, { align: Justification.CENTER, maxW: 884, lead: 84, name: "Tiêu đề" });
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 36, C.WHITE, 540, 345 + (nL - 1) * 84, { align: Justification.CENTER, maxW: 884, name: "Phụ đề" });
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
  var d = newDoc("4 dau hieu - 0" + n);
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

// 1. BÌA (luật 17c, bố cục B Hero tràn): ThinkPad L14 Gen 5 màn sọc thật, nghiêng -7°, vệt sáng đỏ
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("4 dau hieu - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - laptop màn sọc");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("4 DẤU HIỆU\rLAPTOP CẦN SỬA", FS.T, 96, YEL, 96, 300, { lead: 108, name: "Tiêu đề" });
  LOG += "s1 t " + bb(A).join(",") + "\n";
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  hookPill("Số 1 đừng xài tiếp", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "SỐ 1", "PIN PHỒNG", "Gặp là ngưng xài, đừng ráng dùng tiếp", "s2-pin.png",
    [["!", "Touchpad hay hàng phím dưới bị đội lên"], ["!", "Khe vỏ hở không đều, đặt bàn phẳng máy bị kênh"],
     ["ok", "Ngưng xài, rút sạc, đừng đè lên chỗ phồng"], ["ok", "Mang đi thay pin liền"]],
    "Màn có sọc thì sao?", S2H);
}
function t3() {
  trickSlide(3, "SỐ 2", "MÀN BỊ SỌC", "Cắm thử màn ngoài để biết hư ở đâu", "s3-soc.png",
    [["ok", "Cắm màn ngoài qua HDMI, Win + P, chọn Duplicate"], ["ok", "Màn ngoài đẹp: thường do màn laptop hoặc cáp màn"],
     ["!", "Cũng sọc: đổi dây HDMI, cập nhật driver card hình"], ["!", "Vẫn sọc: nghi card hình hoặc mainboard"]],
    "Ổ cứng tự kiểm tra sao?", S3H);
}
function t4() {
  trickSlide(4, "SỐ 3", "Ổ CỨNG SẮP HƯ", "1 lệnh trên Windows là biết ổ còn ổn không", "s4-disk.png",
    [["1", "Bấm Win + X, chọn Terminal hoặc PowerShell"], ["2", "Gõ Get-PhysicalDisk, bấm Enter"],
     ["ok", "HealthStatus ghi Healthy: ổ chưa báo lỗi"], ["!", "Warning, Unhealthy: sao lưu trước, rồi tính thay ổ"]],
    "Màn xanh hoài là lỗi gì?", S4H);
}
function t5() {
  trickSlide(5, "SỐ 4", "MÀN XANH,\rTỰ KHỞI ĐỘNG LẠI", "Windows 11 24H2 trở lên, màn lỗi có thể màu đen", "s5-ram.png",
    [["!", "Mã MEMORY_MANAGEMENT thì test RAM trước"], ["ok", "Lưu file, Win + R, gõ mdsched.exe, Restart now"],
     ["!", "Báo lỗi: RAM rời thì thay, RAM hàn đưa thợ kiểm"], ["!", "Không lỗi chưa chắc RAM ổn, soi tiếp driver, ổ cứng"]],
    "Còn nhiều lỗi nữa nha", S5H);
}
// 6. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t6() {
  var d = newDoc("4 dau hieu - 06 cuoi");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 650); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để xem thêm lỗi laptop hay gặp", FS.I, 52, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 780); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s6 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
  save5(d, 6);
}

var S2H = 520, S3H = 520, S4H = 420, S5H = 490;
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
