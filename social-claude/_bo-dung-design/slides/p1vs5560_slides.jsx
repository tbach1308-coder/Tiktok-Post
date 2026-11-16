
// ================= SLIDES: P1 GEN 5 HAY PRECISION 5560? (03/11) =================
function headT(pillTxt, t) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 265, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" }); // canh theo chân chữ, dấu không làm lệch
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  return t.indexOf("\r") >= 0 ? 351 : 267;
}
var LH = 46;
// thẻ kính: ảnh 380x300 bên trái; bên phải tên máy vàng + các dòng trắng (hoặc số to) + ghi chú nhỏ
function theMay(t, h, name, img, lines, size, soTo_, note) {
  glass(98, t, 982, t + h, 28, "Thẻ - " + name);
  shot(img, 380, 116, t + Math.round((h - 300) / 2), 300, "Ảnh - " + name);
  var cx = 736, lh = size + 12;
  var cao = 52 + (soTo_ ? 112 : 0) + lines.length * lh + (note ? 40 : 0);
  var y = t + Math.round((h - cao) / 2);
  var N = text(name, FS.T, 44, YEL, 540, 0, { align: Justification.CENTER, maxW: 440, name: "Tên máy - " + name });
  centerText(N, cx, y + 26); fxGlow(N, { glow: { hex: YEL, op: 30, size: 18 }, shadow: { op: 60, dist: 3, blur: 8 } });
  y += 52;
  if (soTo_) {
    var S = text(soTo_, FS.T, 92, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 440, name: "Số nhân - " + name });
    centerText(S, cx, y + 56); fxGlow(S, { shadow: { op: 70, dist: 4, blur: 10 } });
    y += 112;
  }
  for (var i = 0; i < lines.length; i++) {
    var B = text(lines[i], F.B, size, C.WHITE, cx, Math.round(y + lh / 2 + size * 0.36 + i * lh), { align: Justification.CENTER, maxW: 450, name: name + " - dòng " + (i + 1) });
    fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  y += lines.length * lh;
  if (note) {
    var Nt = text(note, FS.I, 28, "CBD5E1", 540, 0, { align: Justification.CENTER, maxW: 450, name: name + " - ghi chú" });
    centerText(Nt, cx, y + 22);
  }
  LOG += "the " + name + " " + t + "-" + (t + h) + " chu " + bb(N).join(",") + "\n";
}
// ô xanh chốt ý, 1–2 dòng
function oXanh(t, lines) {
  var h = lines.length == 1 ? 84 : 124;
  var K = rect(98, t, 982, t + h, 28, C.GREEN_SOFT, "Ô xanh - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  for (var i = 0; i < lines.length; i++) {
    text(lines[i], F.B, 31, C.INK, 540, Math.round(t + (h - lines.length * LH) / 2 + LH / 2 + 11 + i * LH), { align: Justification.CENTER, maxW: 850, name: "Ô xanh - dòng " + (i + 1) });
  }
  return t + h;
}
// khung 2 thẻ + ô xanh, lấp đầy tới câu móc
function haiThe(n, pillTxt, title, a, b, xanh, hook) {
  var d = newDoc("P1 vs 5560 - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title);
  var t0 = sb + 30, hx = xanh.length == 1 ? 84 : 124, gap = 22;
  var h = Math.floor((HOOK_Y - 56 - t0 - hx - 2 * gap) / 2);
  theMay(t0, h, a[0], a[1], a[2], a[3], a[4], a[5]);
  theMay(t0 + h + gap, h, b[0], b[1], b[2], b[3], b[4], b[5]);
  var y = oXanh(t0 + 2 * h + 2 * gap, xanh);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " the cao " + h + " xanh den " + y + "\n";
  save5(d, n);
}
// 1. BÌA (luật 17c, 18c, bố cục G Số to): ThinkPad P1 Gen 5 (datasheet Lenovo) nghiêng, số 4 vàng mờ phía sau, vệt sáng xanh dương
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("P1 vs 5560 - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  soTo("4", 300, 700, 600, 30);
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad P1 Gen 5");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("P1 GEN 5 HAY", FS.T, 100, YEL, 96, 276, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("PRECISION 5560?", FS.T, 100, YEL, 96, 388, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  hookPill("Khác nhau ở 4 điểm", HOOK_Y);
  LOG += "s1 tieu de 1 " + bb(A).join(",") + " tieu de 2 " + bb(B).join(",") + "\n";
  save5(d, 1);
}
function t2() {
  haiThe(2, "CHIP", "P1 GEN 5\rNHIỀU NHÂN HƠN",
    ["P1 Gen 5", "t-p1.png", ["i7-12800H", "6 nhân lớn + 8 nhân nhỏ"], 31, "14 nhân"],
    ["Precision 5560", "t-5560.png", ["i7-11850H", "8 nhân cùng loại"], 31, "8 nhân"],
    ["Render, xuất video ăn nhiều nhân thì P1 có lợi"], "Card thì sao?");
}
function t3() {
  haiThe(3, "CARD", "CÙNG TÊN MÁY,\rKHÁC NHIỀU",
    ["Precision 5560", "c-a2000.png", ["T1200 hoặc RTX A2000,", "đều 4GB"], 29, null, "ảnh card rời"],
    ["P1 Gen 5", "c-a4500.png", ["RTX A1000 4GB,", "RTX A2000 8GB,", "cao hơn có A3000,", "A4500, A5500"], 29, null, "ảnh card rời"],
    ["Mua máy cũ nhớ hỏi đúng tên card"], "Cắm dây máy nào tiện?");
}
function t4() {
  haiThe(4, "CỔNG", "P1 GEN 5\rKHỎI CẦN HUB",
    ["P1 Gen 5", "port-p1.png", ["Có sẵn 2 USB-A, HDMI", "và 2 Thunderbolt 4"], 29],
    ["Precision 5560", "port-5560.png", ["Không có USB-A, HDMI", "Chuột dây, màn ngoài thì", "cần cục chuyển, hub USB-C"], 29],
    ["Máy mới Dell kèm cục chuyển,", "mua máy cũ nhớ hỏi còn không"], "5560 hơn ở đâu?");
}
// 5. 2 máy cùng góc, cùng tỉ lệ thật + 2 cột thông số
function t5() {
  var d = newDoc("P1 vs 5560 - 05");
  placeAt(TN + "bg-5.png", 0, 0, "Nền");
  var sb = headT("KÍCH THƯỚC", "PRECISION 5560\rGỌN HƠN");
  var pt = sb + 34;
  shot("hai-may.png", 884, 98, pt, 482, "Ảnh - 2 máy cùng tỉ lệ");
  var gt = pt + 482 + 24, gh = 200;
  glass(98, gt, 982, gt + gh, 28, "Thông số - nền");
  var cot = [[320, "P1 Gen 5", "màn 16 inch", "thân 36 x 25.4 cm"], [760, "Precision 5560", "màn 15.6 inch", "thân 34.4 x 23 cm"]];
  for (var i = 0; i < 2; i++) {
    var N = text(cot[i][1], FS.T, 44, YEL, 540, 0, { align: Justification.CENTER, maxW: 420, name: "Tên máy " + (i + 1) });
    centerText(N, cot[i][0], gt + 46); fxGlow(N, { glow: { hex: YEL, op: 30, size: 18 }, shadow: { op: 60, dist: 3, blur: 8 } });
    var A = text(cot[i][2], F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 420, name: "Màn " + (i + 1) });
    centerText(A, cot[i][0], gt + 104); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
    var B = text(cot[i][3], F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 420, name: "Thân " + (i + 1) });
    centerText(B, cot[i][0], gt + 152); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  var y = oXanh(gt + gh + 22, ["Bản nhẹ của cả 2 đều tầm 1.8 kg", "Balo nhỏ, hay đi công trình: 5560 dễ chịu hơn"]);
  hookPill("Vậy nên lấy máy nào?", HOOK_Y);
  LOG += "s5 anh " + pt + " the " + gt + " xanh den " + y + "\n";
  save5(d, 5);
}
function t6() {
  haiThe(6, "CHỐT", "AI NÊN LẤY MÁY NÀO",
    ["P1 Gen 5", "k-p1.png", ["Màn 16 inch", "Render, dựng video,", "mô hình nặng,", "cần card 8GB trở lên"], 31],
    ["Precision 5560", "k-5560.png", ["Màn 15.6 inch", "Hay đi lại", "Việc vừa sức card 4GB", "Chịu cắm cục chuyển, hub"], 31],
    ["Cần chip nhiều nhân, card 8GB trở lên: P1 Gen 5", "Ưu tiên gọn: Precision 5560"], "Bạn hợp máy nào?");
}
// 7. CUỐI: chỉ chữ, 1 thẻ kính câu hỏi giữa slide, không Follow (luật 16h)
function t7() {
  var d = newDoc("P1 vs 5560 - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu hỏi");
  var L1 = text("Bạn chọn", FS.I, 62, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 620); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("P1 GEN 5 HAY", FS.T, 88, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 720); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L3 = text("PRECISION 5560?", FS.T, 88, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 3" });
  centerText(L3, 540, 824); fxGlow(L3, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  LOG += "s7 dong3 " + bb(L3).join(",") + "\n";
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
