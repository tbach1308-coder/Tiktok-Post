
// ================= SLIDES: LAPTOP CHO DÂN CODE (30/10) =================
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" });
  var tb = bb(T); T.translate(0, 214 - tb[1]); tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  return tb[3];
}
function yBox(t, y1, y2) {
  var h = 122;
  glass(98, t, 982, t + h, 28, "Ý - nền");
  var A = text(y1, F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Ý 1" });
  centerText(A, 540, t + 40); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text(y2, F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Ý 2" });
  centerText(B, 540, t + 84); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  return t + h;
}
function modelSlide(n, bgf, pillTxt, title, y1, y2, img, name, cfg, scr, hop, hook) {
  var d = newDoc("Dan code - 0" + n);
  placeAt(TN + bgf, 0, 0, "Nền");
  var sb = headT(pillTxt, title);
  var pt = yBox(304, y1, y2) + 20; // đỉnh ô ý cố định, các slide máy không nhảy
  shot(img, 884, 98, pt, 500, "Ảnh - " + name);
  var st = pt + 500 + 18, sh = 158;
  glass(98, st, 982, st + sh, 28, "Cấu hình - nền");
  var N = text(name, FS.T, 44, YEL, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Tên máy" });
  centerText(N, 540, st + 40); fxGlow(N, { glow: { hex: YEL, op: 30, size: 18 }, shadow: { op: 60, dist: 3, blur: 8 } });
  var Cf = text(cfg, F.B, 34, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Cấu hình" });
  centerText(Cf, 540, st + 92); fx(Cf, { shadow: { op: 60, dist: 2, blur: 6 } });
  var S = text(scr, F.B, 27, "CBD5E1", 540, 0, { align: Justification.CENTER, maxW: 840, name: "Màn" });
  centerText(S, 540, st + 132);
  var y = st + sh + 16;
  var K = rect(98, y, 982, y + 80, 28, C.GREEN_SOFT, "Hợp với - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var T = text(hop, F.B, 30, C.INK, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Hợp với" });
  centerText(T, 540, y + 40);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " den " + (y + 80) + " title " + sb + "\n";
  save5(d, n);
}
// 1. BÌA (luật 17c, bố cục C Cận chi tiết): ảnh thật màn hình code tràn ngang, mờ viền vào bg-thumb, vệt sáng xanh lá
// lớp ảnh: python "E:/Social Claude/_bo-dung-design/prep/bia_lop.py" "<bài>/tai-nguyen/bia-lop.png" "sang=540,860,1000,520,hex=22C55E,op=0.38" "anh=E:/Social Claude/Anh tai ve/tai-ve-30-10/u-1607799279861-4dd421887fb3.jpg@-110,450,1300,mo=tren:150:duoi:90:trai:60:phai:60" --chu 560
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Dan code - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - màn hình code");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP CHO", FS.T, 118, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("DÂN CODE", FS.T, 118, YEL, 96, 422, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var S = text("Code gì lấy máy đó", FS.I, 46, C.WHITE, 100, 522, { name: "Dòng phụ" }); fx(S, { shadow: { op: 70, dist: 2, blur: 6 } });
  hookPill("Đừng mua thừa", HOOK_Y);
  save5(d, 1);
}
function t2() {
  modelSlide(2, "bg-2.png", "MẢNG 1", "CODE WEB, BACKEND",
    "Chủ yếu VS Code, trình duyệt, Docker.", "RAM 16GB, SSD 512GB là xài ngon.", "p2-t14.png",
    "ThinkPad T14 Gen 3", "Core i7 · RAM 16GB", "Laptop 14 inch",
    "Hợp: dev web, sinh viên IT năm cuối", "Code Android thì cần nhiều hơn");
}
function t3() {
  modelSlide(3, "bg-3.png", "MẢNG 2", "CODE ANDROID",
    "Google ghi rõ: Android Studio kèm máy ảo", "cần tối thiểu RAM 16GB, khuyên dùng 32GB.", "p3-dell.png",
    "Dell Precision 5560", "RAM 32GB · 2 khe RAM rời", "Máy trạm 15.6 inch · máy thật tại Poly",
    "Hợp: dev app bật máy ảo cả ngày", "Code iOS thì Windows chịu thua");
}
function t4() {
  modelSlide(4, "bg-4.png", "MẢNG 3", "CODE iOS",
    "Xcode chỉ chạy trên macOS,", "Windows không cài được.", "p4-m2.png",
    "MacBook Air M2", "RAM 16GB · 13.6 inch", "RAM hàn liền, không nâng sau được",
    "Hợp: dev iOS, Flutter build cả iOS lẫn Android", "Làm AI, data thì khác hẳn");
}
function t5() {
  modelSlide(5, "bg-5.png", "MẢNG 4", "AI, DATA",
    "CUDA chỉ chạy trên card NVIDIA,", "muốn train bằng CUDA phải có card rời.", "p5-p1.png",
    "ThinkPad P1 Gen 5", "Bản card NVIDIA RTX rời", "Máy trạm 16 inch",
    "Hợp: train model nhỏ, chạy Jupyter nặng", "Máy cũ đang xài còn cứu được?");
}
function t6() {
  var d = newDoc("Dan code - 06");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var sb = headT("MẸO", "CHƯA CẦN\rBỎ MÁY CŨ");
  var pt = yBox(sb + 28, "Máy RAM 8GB, ổ HDD mà build chậm", "thì thay SSD, nâng RAM trước đã.") + 20;
  shot("p6-shop.png", 884, 98, pt, 500, "Ảnh - mở đáy máy ở shop (fen gửi 30/10)");
  var y = pt + 500 + 18;
  var K = rect(98, y, 982, y + 130, 28, C.GREEN_SOFT, "Mẹo - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var T1 = text("Còn khe RAM rời là nâng được,", F.B, 32, C.INK, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Mẹo 1" });
  centerText(T1, 540, y + 44);
  var T2 = text("thợ Poly mở máy xem giúp.", F.B, 32, C.INK, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Mẹo 2" });
  centerText(T2, 540, y + 88);
  hookPill("Comment để Poly chọn giúp", HOOK_Y);
  LOG += "s6 den " + (y + 130) + " title " + sb + "\n";
  save5(d, 6);
}
// 7. CUỐI: chỉ chữ fen viết + Follow, không địa chỉ
function t7() {
  var d = newDoc("Dan code - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  var L1 = text("FEN CODE GÌ,", FS.I, 66, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Dòng 1" });
  centerText(L1, 540, 590); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("ĐANG XÀI MÁY NÀO?", FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Dòng 2" });
  centerText(L2, 540, 700); var b3 = bb(L2);
  fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var cy = 850;
  var T = text("+  Follow @polystorelaptop", F.B, 34, C.WHITE, 0, cy + 12, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 38, cy - 38, 540 + w / 2 + 38, cy + 38, 38, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  LOG += "s7 dong2 " + b3.join(",") + "\n";
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
