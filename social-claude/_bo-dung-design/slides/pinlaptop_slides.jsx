// ================= SLIDES: PIN LAPTOP CÒN BAO NHIÊU % (30/10) =================
// kiểu bài mẹo (thaotac5_slides.jsx): headT + trickSlide; slide 5 là 3 thẻ hãng
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
  var d = newDoc("Pin laptop - 0" + n);
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

// 1. BÌA (luật 17c, bố cục G Số to): "%" vàng rất to mờ sau máy, máy Zenbook tách nền nghiêng -6°, vệt sáng xanh lá
// lớp ảnh: bia_lop.py "sang=560,1100,900,400,hex=22C55E,op=0.40" "may=psref-ThinkPad_X1_Carbon_Gen_12_CT1_01.png@640,1010,1300,xoay=0,bong=0.5" --kenh laptop --chu 480
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Pin laptop - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  soTo("%", 330, 740, 560, 22, YEL);
  lopBia(TN + "bia-lop.png", "Ảnh bìa - laptop");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("PIN LAPTOP CÒN", FS.T, 100, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("BAO NHIÊU %?", FS.T, 100, YEL, 96, 424, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  LOG += "s1 t1 " + bb(A).join(",") + " t2 " + bb(B).join(",") + "\n";
  hookPill("Gõ 1 lệnh là biết", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "BƯỚC 1 · LỆNH", "1 LỆNH RA\rBÁO CÁO PIN", "Gõ trong Terminal, không cần cài gì", "s2-terminal.png",
    [["1", "Win + X, chọn Terminal (không chọn Admin)"], ["2", "Gõ powercfg /batteryreport rồi Enter"],
     ["3", "Mở file battery-report.html bằng trình duyệt"], ["!", "Win 10 thì chọn Windows PowerShell"]],
    "Coi 2 dòng nào?", 310);
}
function t3() {
  trickSlide(3, "BƯỚC 2 · DUNG LƯỢNG", "DESIGN VÀ\rFULL CHARGE", "Mục Installed batteries trong báo cáo", "s3-report.png",
    [["ok", "Design Capacity: pin lúc mới"], ["ok", "Full Charge Capacity: pin bây giờ"],
     ["ok", "Lấy Full Charge chia Design ra % pin còn"], ["ok", "VD: 45.000 / 60.000 mWh là còn 75%"]],
    "Mua máy cũ coi thêm dòng này", 460);
}
function t4() {
  trickSlide(4, "BƯỚC 3 · VÒNG SẠC", "CYCLE COUNT\rLÀ SỐ VÒNG SẠC", "Đừng chỉ nghe \u201Cpin còn ngon\u201D", "s4-cycle.png",
    [["ok", "1 vòng là cộng dồn đủ 100% pin"], ["ok", "Sạc 2 lần 50% cũng tính 1 vòng"],
     ["!", "Có máy để trống hoặc ghi 0: coi Full Charge"], ["ok", "Mua máy cũ: xin chạy lệnh ngay tại chỗ"]],
    "Cắm sạc cả ngày thì sao?", 460);
}
function hang(ct, ten, l1, l2, l3) {
  glass(98, ct, 982, ct + 224, 28, "Thẻ " + ten);
  var N = text(ten, FS.T, 44, YEL, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Hãng " + ten });
  centerText(N, 540, ct + 44); fxGlow(N, { glow: { hex: YEL, op: 30, size: 18 }, shadow: { op: 60, dist: 3, blur: 8 } });
  var ls = [l1, l2, l3];
  for (var i = 0; i < 3; i++) {
    var T = text(ls[i], F.B, 29, i == 0 ? C.WHITE : "E2E8F0", 540, 0, { align: Justification.CENTER, maxW: 840, name: ten + " dòng " + (i + 1) });
    centerText(T, 540, ct + 98 + i * 42); fx(T, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  return ct + 224;
}
function t5() {
  var d = newDoc("Pin laptop - 05");
  placeAt(TN + "bg-5.png", 0, 0, "Nền");
  var sb = headT("BƯỚC 4 · GIỚI HẠN SẠC", "CẮM SẠC CẢ NGÀY:\rBẬT GIỚI HẠN SẠC", "Chọn đúng app của hãng máy bạn");
  var t = sb + 34, gap = 24;
  var y = hang(t, "LENOVO", "App Lenovo Vantage", "ThinkPad: Battery Charge Threshold", "IdeaPad, Legion: Conservation Mode");
  y = hang(y + gap, "ASUS", "App MyASUS > Battery Health Charging", "Balanced Mode: sạc tới 80%", "Maximum Lifespan: sạc tới 60%");
  y = hang(y + gap, "DELL", "App Dell Power Manager > Battery Info", "Chọn Custom, chỉnh mức dừng sạc", "Không có app thì vào BIOS (F2) chỉnh");
  hookPill("Pin yếu rồi thì sao?", HOOK_Y);
  LOG += "s5 sub den " + sb + " y den " + y + "\n";
  if (y > HOOK_Y - 50) LOG += "  CANH BAO s5: the sat cau moc\n";
  save5(d, 5);
}
function t6() {
  trickSlide(6, "BƯỚC 5 · THAY PIN", "PIN YẾU: THAY PIN\rKHÔNG PHẢI THAY MÁY", "Pin chai hay pin phồng đều thay được", "p6-pin.png",
    [["!", "Còn 20–30% đã sập, rút sạc là tắt: pin chai"], ["ok", "Báo cáo pin xác nhận thì thay pin là xài tiếp"],
     ["!", "Touchpad cộm, bấm cứng, đáy hở: coi chừng pin phồng"], ["!", "Ngưng sạc, đừng tự cạy, mang ra tiệm thay"]],
    "Pin máy bạn còn bao nhiêu?", 460);
}
// 7. CUỐI (luật 16h [Laptop]): 2 thẻ kính, trên câu hỏi fen viết, dưới khoiFollow
function t7() {
  var d = newDoc("Pin laptop - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  glass(98, 250, 982, 650, 36, "Thẻ câu hỏi");
  var L1 = text("PIN LAPTOP BẠN", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 390); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("CÒN BAO NHIÊU %?", FS.T, 66, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 500); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  glass(98, 760, 982, 1160, 36, "Thẻ follow");
  khoiFollow("@polystorelaptop", "Follow để có thêm mẹo laptop", 960);
  LOG += "s7 dong2 " + bb(L2).join(",") + "\n";
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
