
// ================= SLIDES: LAPTOP 2026: TÊN MỚI, RUỘT CŨ? (03/11) =================
function headT(pillTxt, t) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 265, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" }); // canh theo chân chữ, dấu không làm lệch
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  return 267;
}
// slide máy: ảnh 884x500 + thẻ kính (cấu hình trắng, ý cần biết vàng nhạt) + ô xanh "Hợp với" + câu móc
function maySlide(n, pillTxt, title, img, cfg, y, hop, hook) {
  var d = newDoc("Laptop 2026 - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title);
  var pt = sb + 30;
  shot(img, 884, 98, pt, 540, "Ảnh - " + title);
  var gt = pt + 540 + 24, lhC = 46, lhY = 42;
  var gh = 284, dem = Math.round((gh - cfg.length * lhC - 14 - y.length * lhY) / 2); // thẻ cùng cao mọi slide, chữ căn giữa thẻ
  glass(98, gt, 982, gt + gh, 28, "Thông tin - nền");
  for (var i = 0; i < cfg.length; i++) {
    var A = text(cfg[i], F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 850, name: "Cấu hình " + (i + 1) });
    centerText(A, 540, gt + dem + lhC / 2 + i * lhC); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  var y0 = gt + dem + cfg.length * lhC + 14;
  for (var j = 0; j < y.length; j++) {
    var B = text(y[j], F.B, 29, "FDE68A", 540, 0, { align: Justification.CENTER, maxW: 850, name: "Ý " + (j + 1) });
    centerText(B, 540, y0 + lhY / 2 + j * lhY); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  var ky = gt + gh + 22;
  var K = rect(98, ky, 982, ky + 76, 28, C.GREEN_SOFT, "Hợp với - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var H = text(hop, F.B, 28, C.INK, 540, 0, { align: Justification.CENTER, maxW: 850, name: "Hợp với" });
  centerText(H, 540, ky + 38);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " tieu de den " + sb + " anh " + pt + " the den " + (gt + gh) + " xanh den " + (ky + 76) + "\n";
  if (ky + 76 > HOOK_Y - 40) LOG += "  CANH BAO s" + n + ": o xanh sat cau moc\n";
  save5(d, n);
}
// 1. BÌA (luật 17c, bố cục F Sticker chú thích): TUF Gaming 16 2026 (ảnh ASUS, đã xoá logo game trên màn) nghiêng -6°, vệt sáng xanh lá, 2 sticker
// lớp ảnh: bia_lop.py "sang=560,1120,900,360,hex=22C55E,op=0.42" "may=tuf-bia-sach.png@550,911,820,xoay=-6,bong=0.5" --kenh laptop --chu 470
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Laptop 2026 - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - TUF Gaming 16 2026");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP 2026:", FS.T, 93, YEL, 96, 292, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("TÊN MỚI, RUỘT CŨ?", FS.T, 93, YEL, 96, 404, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  sticker("Chip gì?", 838, 590, 6, "vang", 42);
  hookPill("Đời mới chưa chắc mới", HOOK_Y);
  LOG += "s1 tieu de 2 " + bb(B).join(",") + "\n";
  save5(d, 1);
}
function t2() {
  maySlide(2, "CARD THẤP HƠN", "LEGION 5i GEN 11", "p-legion.png",
    ["Core Ultra 7 356H, RTX 5060 8GB 115W", "OLED 15.3 inch 2.5K 165Hz"],
    ["Đời trước có RTX 5070, bản 356H này chỉ có 5060", "Muốn 5070 phải lấy bản chip HX", "Bù lại RAM 2 khe, nâng được tới 32GB"],
    "Hợp với chơi game vừa, làm đồ họa cần màn đẹp", "TUF thì ngược lại, card cao chip cũ");
}
function t3() {
  maySlide(3, "CHIP CŨ", "TUF GAMING 16 2026", "p-tuf.png",
    ["Bản cao: i7-14650HX, RTX 5070 85W", "Màn 2.5K 165Hz"],
    ["Tên 2026 nhưng chip ra từ đầu 2024,", "đừng thấy năm mới mà tưởng chip mới", "RTX 5070 này 85W, RTX 5060 của Legion tới 115W"],
    "Hợp với anh em chơi game, cần card cấp 5070", "Không chơi game thì xem XPS");
}
function t4() {
  maySlide(4, "COI KỸ BẢN RẺ", "DELL XPS 14 2026", "p-xps.png",
    ["Bản Ultra X7 358H: 32GB, OLED 2.8K 120Hz", "Card tích hợp Arc B390"],
    ["Coi kỹ bản rẻ: màn IPS Full HD+, RAM 16GB,", "không có Arc B390, khác hẳn bản OLED"],
    "Hợp với dân văn phòng, hay mang máy đi gặp khách", "Làm CAD, render thì cần con khác");
}
function t5() {
  maySlide(5, "ĐỔI TÊN", "DELL PRO MAX 16 PLUS", "p-promax.png",
    ["Bản cao: Ultra 9 285HX, RTX PRO 5000 24GB", "RAM CAMM2 128GB, 3 khe SSD"],
    ["2025 Dell đổi Precision thành Pro Max,", "con này nối tiếp Precision 7680, ra từ 2025", "2026 Dell lại có thêm dòng Pro Precision"],
    "Hợp với dân kỹ thuật, render nặng", "Vậy bạn nên lấy con nào?");
}
// 6. CHỌN THEO VIỆC: 4 hàng, mỗi hàng ảnh máy + việc + tên máy (luật 18c: kết luận có ảnh từng bên)
function t6() {
  var d = newDoc("Laptop 2026 - 06");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var sb = headT("CHỐT", "CHỌN THEO VIỆC");
  var rows = [["t-tuf.png", "Chơi game,\rcần card cấp 5070", "TUF Gaming 16"],
              ["t-legion.png", "Game vừa, cần màn OLED,\rmuốn nâng RAM", "Legion 5i Gen 11"],
              ["t-xps.png", "Đi làm gọn nhẹ", "XPS 14"],
              ["t-promax.png", "Kỹ thuật, render", "Pro Max 16 Plus"]];
  var t0 = sb + 26, gap = 14, rh = Math.floor((HOOK_Y - 50 - t0 - 3 * gap) / 4);
  for (var i = 0; i < rows.length; i++) {
    var t = t0 + i * (rh + gap);
    glass(98, t, 982, t + rh, 28, "Hàng " + (i + 1) + " - nền");
    shot(rows[i][0], 280, 116, t + Math.round((rh - 190) / 2), 190, "Ảnh - " + rows[i][2]);
    var nL = rows[i][1].split("\r").length;
    var top = t + Math.round((rh - (nL * 42 + 62)) / 2); // khối việc + tên máy căn giữa hàng
    var N = text(rows[i][1], F.B, 31, C.WHITE, 420, top + 32, { lead: 42, name: "Việc " + (i + 1) });
    fx(N, { shadow: { op: 60, dist: 2, blur: 6 } });
    var M = text(rows[i][2], FS.T, 50, YEL, 420, top + nL * 42 + 54, { name: "Máy " + (i + 1) });
    fxGlow(M, { glow: { hex: YEL, op: 30, size: 18 }, shadow: { op: 60, dist: 3, blur: 8 } });
    LOG += "s6 hang " + i + " " + t + "-" + (t + rh) + " viec " + bb(N).join(",") + " may " + bb(M).join(",") + "\n";
  }
  hookPill("Muốn cập nhật máy mới mỗi ngày?", HOOK_Y);
  save5(d, 6);
}
// 7. CUỐI: ngoại lệ riêng bài này (Lịch sử sửa 3/11, fen yêu cầu câu kêu gọi Follow); chỉ chữ, 1 thẻ kính, không nút, không mũi tên
function t7() {
  var d = newDoc("Laptop 2026 - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu kêu gọi");
  var L1 = text("FOLLOW POLY", FS.T, 96, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 630); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để cập nhật máy mới", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 738); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("mỗi ngày", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 3" });
  centerText(L3, 540, 812); fxGlow(L3, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + "\n";
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
