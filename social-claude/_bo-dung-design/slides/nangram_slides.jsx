// ================= SLIDES: LAPTOP 8GB CÓ NÊN NÂNG RAM? (14/11) =================
// kiểu bài mẹo (file10bit_slides.jsx): headT + trickSlide; tiêu đề slide giữa tự canh cỡ 84–92 theo dòng dài nhất (16f, 14/11)
// ảnh slide 3, 4: Task Manager vẽ lại 2x (chưa có ảnh chụp shop, luật 18 / 16i), script tai-nguyen/script/ve_taskmgr.py
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var nL = t.split("\r").length;
  // đo ở cỡ 84 rồi đặt lại: dòng dài nhất ~840px, cỡ 84–92 (16f)
  var T0 = text(t, FS.T, 84, YEL, 540, 300, { align: Justification.CENTER, name: "Đo" });
  var b0 = bb(T0), w0 = b0[2] - b0[0];
  T0.remove();
  var sz = Math.round(84 * 840 / w0);
  if (sz > 92) sz = 92;
  if (sz < 84 && w0 * sz / 84 > 884) sz = Math.floor(84 * 870 / w0);
  var lead = Math.round(sz * 1.12), y1 = 205 + sz;
  var T = text(t, FS.T, sz, YEL, 540, y1, { align: Justification.CENTER, maxW: 940, lead: lead, name: "Tiêu đề" });
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 36, C.WHITE, 540, y1 + (nL - 1) * lead + 64, { align: Justification.CENTER, maxW: 884, name: "Phụ đề" });
  var sb = bb(S);
  fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  LOG += "  tieu de co " + sz + " rong " + Math.round(w0 * sz / 84) + "\n";
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
  var d = newDoc("Nang RAM - 0" + n);
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

// 1. BÌA (luật 17c, bố cục B Hero tràn): ThinkPad E14 Gen 6 (PSREF CT1_01) nghiêng -6° + thanh RAM DDR5 (Wikimedia, che nhãn, tách nền PS) nghiêng -10° trước máy, vệt sáng xanh lá
// lớp ảnh: bia_lop.py "sang=580,1180,1000,380,hex=22C55E,op=0.45" "may=may-e14.png@620,890,900,xoay=-6,sang=22C55E,sangop=0.5" "may=ram-tach.png@340,1085,570,xoay=-10,bong=0.6" --kenh laptop --chu 480
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Nang RAM - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad E14 + thanh RAM");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  // dòng 1 ngắn, từ khoá 8GB trắng (17b 09/11), cỡ to; dòng 2 dài canh vừa 884 (16f 14/11)
  var A = text("LAPTOP", FS.T, 120, YEL, 96, 318, { name: "Tiêu đề 1 - LAPTOP" });
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var A2 = text("8GB", FS.T, 120, C.WHITE, bb(A)[2] + 30, 318, { name: "Tiêu đề 1 - 8GB trắng" });
  fxGlow(A2, { glow: { hex: "FFFFFF", op: 30, size: 26 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B0 = text("CÓ NÊN NÂNG RAM?", FS.T, 96, YEL, 96, 440, { name: "Đo" });
  var wb = bb(B0)[2] - bb(B0)[0]; B0.remove();
  var szB = Math.min(96, Math.floor(96 * 850 / wb));
  var B = text("CÓ NÊN NÂNG RAM?", FS.T, szB, YEL, 96, 336 + szB + 10, { name: "Tiêu đề 2" });
  fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  hookPill("Giá RAM đang tăng mạnh", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(A2).join(",") + " / " + bb(B).join(",") + " co2 " + szB + "\n";
  save5(d, 1);
}
function t2() {
  trickSlide(2, "GIÁ RAM", "RAM LAPTOP\rĐANG TĂNG GIÁ", "Mua thêm thanh RAM giờ tốn hơn", "s2-ddr5.png",
    [["!", "RAM DDR5 laptop đắt gần gấp 6 lần"],
     ["!", "So với 7/2025 (Schenker, Tom's Hardware)"],
     ["!", "HP: giá RAM đẩy giá máy lên"],
     ["!", "Tình hình có thể kéo sang 2027"]],
    "Máy bạn có thật sự thiếu RAM?", S2H);
}
function t3() {
  trickSlide(3, "TỰ KIỂM TRA", "MÁY BẠN CÓ\rTHIẾU RAM KHÔNG?", "Mở Task Manager xem trong 10 giây", "s3-memory.png",
    [["1", "Bấm Ctrl + Shift + Esc"],
     ["2", "Vào Performance > Memory"],
     ["3", "Mở Chrome, Zalo, Excel như mọi ngày"],
     ["!", "Memory gần 100%, máy khựng là thiếu RAM"]],
    "Máy có còn chỗ gắn thêm?", S3H);
}
function t4() {
  trickSlide(4, "KHE RAM", "MÁY CÓ CÒN\rKHE RAM TRỐNG?", "Còn khe thì mới cắm thêm được", "s4-slots.png",
    [["ok", "Cùng màn Memory, xem dòng Slots used"],
     ["ok", "1 of 2: còn 1 khe trống để cắm thêm"],
     ["!", "Máy mỏng hay hàn RAM, không nâng được"],
     ["!", "Windows báo sai? Nhờ thợ mở đáy xem"]],
    "Mua thanh nào cho khớp?", S4H);
}
function t5() {
  trickSlide(5, "CHỌN THANH RAM", "MUA THANH RAM\rNÀO CHO KHỚP?", "Sai loại là cắm không vào", "s5-ram.png",
    [["!", "DDR4, DDR5 khác chân, không cắm lẫn"],
     ["ok", "Xem loại: CPU-Z > tab Memory > dòng Type"],
     ["ok", "Gắn thêm thanh cùng loại, cùng dung lượng"],
     ["ok", "8GB + 8GB: máy chạy kênh đôi trọn vẹn"]],
    "Nâng lên bao nhiêu là đủ?", S5H);
}
function t6() {
  trickSlide(6, "DUNG LƯỢNG", "NÂNG LÊN\rBAO NHIÊU LÀ ĐỦ?", "Tuỳ việc bạn làm mỗi ngày", "s6-nang.png",
    [["ok", "Văn phòng, Chrome nhiều tab: 16GB khỏi lo"],
     ["ok", "Premiere video HD: Adobe khuyên 16GB"],
     ["ok", "Dựng video 4K: Adobe khuyên 32GB trở lên"],
     ["!", "Máy hàn 8GB, việc nặng: lên đời máy 16GB"]],
    "Máy bạn nâng được không?", S6H);
}
// 7. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t7() {
  var d = newDoc("Nang RAM - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  // fen sửa 14/11: thêm "Poly có nhận nâng RAM theo yêu cầu nha" (dịch vụ shop), vẫn giữ câu Follow của brief
  var L1 = text("POLY NHẬN NÂNG RAM", FS.T, 66, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 610); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("theo yêu cầu nha", FS.I, 54, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 705); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("Follow Poly để biết máy nào nâng được", FS.I, 38, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Dòng 3 Follow" });
  centerText(L3, 540, 830); fxGlow(L3, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + " dong3 " + bb(L3).join(",") + "\n";
  save5(d, 7);
}

var S2H = 440, S3H = 460, S4H = 440, S5H = 380, S6H = 440;
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
