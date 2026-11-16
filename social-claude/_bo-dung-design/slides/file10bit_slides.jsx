// ================= SLIDES: FILE MÁY ẢNH 10-BIT BỊ GIẬT? (13/11) =================
// brief fen "Laptop dựng video cần gì?" trùng bài T10_DungVideoLaptop_25-10 (luật 1b) -> agent biên tập đổi chủ đề, giữ ý RTX 50 của fen
// kiểu bài mẹo + chốt máy: headT + trickSlide (ketoan_slides.jsx)
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
// xanh: mảng 1–2 dòng ô xanh "Hợp với" dưới ô ý (không có thì bỏ)
function trickSlide(n, pillTxt, title, sub, img, items, hook, fh, xanh) {
  var d = newDoc("File 10-bit - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title, sub);
  var kh = xanh ? (xanh.length > 1 ? 124 : 80) + 18 : 0;
  var stepsH = 34 + items.length * 52, top0 = sb + 30, bot0 = HOOK_Y - 62;
  var extra = Math.max(0, (bot0 - top0) - (fh + 26 + stepsH + kh));
  var gap = 26 + Math.min(Math.round(extra / 3), 60);
  var ft = top0 + Math.round((extra - (gap - 26)) / 2);
  shot(img, 884, 98, ft, fh, "Ảnh - " + title);
  var bot = steps(ft + fh + gap, items);
  if (xanh) {
    var yx = bot + 18, kk = kh - 18;
    var K = rect(98, yx, 982, yx + kk, 28, C.GREEN_SOFT, "Ô xanh - nền");
    fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
    for (var i = 0; i < xanh.length; i++) {
      var X = text(xanh[i], F.B, 30, C.INK, 540, 0, { align: Justification.CENTER, maxW: 850, name: "Ô xanh " + (i + 1) });
      centerText(X, 540, xanh.length > 1 ? yx + 40 + i * 44 : yx + 40);
    }
    bot = yx + kk;
  }
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " sub den " + sb + " anh " + ft + "-" + (ft + fh) + " y den " + bot + "\n";
  if (bot > HOOK_Y - 50) LOG += "  CANH BAO s" + n + ": o y sat cau moc\n";
  save5(d, n);
}

// 1. BÌA (luật 17c, bố cục D Đời thật): ảnh Pexels 35691843 tay cầm máy ảnh trên laptop (đã xoá chữ SONY/FX30 + tem, xoa-logo-bia.jsx), tràn ngang, mờ viền trên, vệt sáng đỏ
// lớp ảnh: bia_lop.py "sang=560,1100,1000,380,hex=EF4444,op=0.2" "anh=px_35691843_sach.png@0,455,1080,crop=150:850:1750:2140,mo=tren:150,toi=0.1" --kenh laptop --chu 440
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("File 10-bit - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - máy ảnh và laptop");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("FILE MÁY ẢNH", FS.T, 92, YEL, 96, 292, { name: "Tiêu đề 1" });
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  // từ khoá 10-BIT trắng (17b 09/11)
  var B = text("10-BIT", FS.T, 92, C.WHITE, 96, 406, { name: "Tiêu đề 2 - 10-BIT trắng" });
  fxGlow(B, { glow: { hex: "FFFFFF", op: 30, size: 26 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B2 = text("BỊ GIẬT?", FS.T, 92, YEL, bb(B)[2] - 6, 406, { name: "Tiêu đề 2 - BỊ GIẬT" });
  fxGlow(B2, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  hookPill("Do card hay do chip?", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(B).join(",") + " / " + bb(B2).join(",") + "\n";
  save5(d, 1);
}
function t2() {
  trickSlide(2, "FILE 4:2:2", "FILE 4:2:2 NẶNG Ở ĐÂU?", "Màu đẹp để chỉnh, nhưng khó giải mã", "s2-mediainfo.png",
    [["ok", "Sony, Canon quay 10-bit 4:2:2 để chỉnh màu"],
     ["!", "Không giải mã phần cứng thì CPU gánh hết"],
     ["ok", "Tự xem bằng app MediaInfo (miễn phí)"],
     ["ok", "Thấy 4:2:2 và 10 bits là file loại này"]],
    "Card nào giải mã được?", S2H);
}
function t3() {
  trickSlide(3, "CARD", "FILE MÁY ẢNH 10-BIT\rNÊN CÓ CARD RTX 50", "Card gánh việc giải mã thay CPU", "s3-legion.png",
    [["ok", "RTX 50 giải mã HEVC, H.264 4:2:2"],
     ["!", "RTX 30, 40 không giải mã được loại này"],
     ["ok", "VD: Legion Pro 7i Gen 10 có bản RTX 5080"],
     ["ok", "Hợp với dân quay sự kiện, cưới"]],
    "Không có RTX 50 thì sao?", S3H);
}
function t4() {
  trickSlide(4, "CHIP INTEL", "CHIP INTEL CÓ SẴN\rBỘ GIẢI MÃ", "Quick Sync nằm sẵn trong chip", "s4-chip.png",
    [["ok", "Intel đời 11 trở lên giải mã được HEVC 4:2:2"],
     ["ok", "Intel + RTX 40 vẫn kéo được HEVC 4:2:2"],
     ["!", "Intel không giải mã được H.264 4:2:2"],
     ["!", "Chip AMD + RTX 30, 40: CPU gánh hết"]],
    "Kiểm tra trong Premiere ở đâu?", S4H);
}
function t5() {
  trickSlide(5, "PREMIERE", "BẬT GIẢI MÃ PHẦN CỨNG\rTRONG PREMIERE", "Mặc định đã bật, nên xem lại", "s5-prefs.png",
    [["1", "Vào Edit > Preferences > Media"],
     ["2", "Xem ô hardware accelerated decoding"],
     ["3", "Tích ô Intel, NVIDIA rồi mở lại Premiere"]],
    "Máy bạn đủ chưa?", S5H);
}
// 6. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t6() {
  var d = newDoc("File 10-bit - 06 cuoi");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 657); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để chọn đúng máy dựng video", FS.I, 54, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 787); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s6 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
  save5(d, 6);
}

var S2H = 440, S3H = 480, S4H = 480, S5H = 470;
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
