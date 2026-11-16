// ================= SLIDES: LAPTOP BẬT KHÔNG LÊN (05/11) =================
// kiểu bài mẹo (dauhieu_slides.jsx): headT + trickSlide
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
  var d = newDoc("Bat khong len - 0" + n);
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

// 1. BÌA (luật 17c, bố cục F Sticker chú thích): ThinkPad T14 Gen 5 màn tắt đen, nghiêng -6°, vệt sáng đỏ, 1 sticker
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Bat khong len - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - laptop màn đen");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP BẬT\rKHÔNG LÊN?", FS.T, 96, YEL, 96, 276, { lead: 106, name: "Tiêu đề" });
  LOG += "s1 t " + bb(A).join(",") + "\n";
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var P = text("Chưa chắc hư máy", FS.I, 38, C.WHITE, 96, 442, { name: "Dòng phụ" });
  fxGlow(P, { shadow: { op: 80, dist: 3, blur: 8 } });
  LOG += "s1 phu " + bb(P).join(",") + "\n";
  sticker("Đèn nguồn?", 790, 745, -6, "vang");
  hookPill("Tự kiểm tra trước", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "BƯỚC 1", "NHÌN ĐÈN\rNGUỒN TRƯỚC", "Biết máy có nhận điện không", "s2-den.png",
    [["ok", "Cắm sạc, bấm nguồn, nhìn đèn và nghe quạt"],
     ["!", "Đèn tắt hẳn: đổi ổ cắm, thử cục sạc khác đúng loại"],
     ["!", "Đèn sáng, màn đen: nghi màn, cáp, RAM, mainboard"]],
    "Sạc ổn mà máy vẫn im?", S2H);
}
function t3() {
  trickSlide(3, "BƯỚC 2", "XẢ ĐIỆN DƯ\rTRONG MÁY", "Sạc ổn mà máy im thì thử bước này", "s3-nut.png",
    [["1", "Rút sạc, USB, thẻ nhớ. Máy pin rời thì tháo pin luôn"],
     ["2", "Giữ nút nguồn 20 giây, cắm sạc lại rồi bật"],
     ["ok", "Không tốn đồng nào, không mất file"],
     ["ok", "Dell cũng hướng dẫn bước này"]],
    "Đèn sáng mà màn đen thì sao?", S3H);
}
function t4() {
  trickSlide(4, "BƯỚC 3", "MÀN ĐEN:\rRỌI ĐÈN PIN THỬ", "Biết máy còn chạy hay không", "s4-denpin.png",
    [["ok", "Bật máy, tắt đèn phòng, rọi đèn pin xéo sát màn"],
     ["ok", "Thấy hình mờ: máy còn chạy, nghi đèn nền, cáp màn"],
     ["!", "Không thấy gì: nghi màn, cáp, RAM hoặc mainboard"],
     ["!", "Màn OLED không có đèn nền, cách này không áp dụng"]],
    "Máy Dell có cách tự kiểm riêng", S4H);
}
function t5() {
  trickSlide(5, "RIÊNG DELL", "MÁY DELL:\rTỰ KIỂM MAINBOARD", "Một số đời Dell có bài kiểm M-BIST", "s5-dell.png",
    [["ok", "Tắt máy, giữ phím M và nút nguồn cùng lúc"],
     ["!", "Đèn báo pin sáng cam hoặc cam trắng: lỗi mainboard"],
     ["ok", "Đèn tắt, màn đổi màu: chưa thấy lỗi mainboard"]],
    "Làm hết vẫn không lên?", S5H);
}
function t6() {
  trickSlide(6, "BƯỚC CUỐI", "VẪN KHÔNG LÊN:\rĐỪNG VỘI BỎ MÁY", "Thợ mở máy kiểm là khoanh được lỗi", "s6-mo.png",
    [["ok", "Pin, màn hình, RAM rời đều thay được"],
     ["!", "Máy mỏng hay hàn RAM, loại này không thay rời được"],
     ["ok", "SSD rời, ổ còn tốt thì tháo ra lấy lại dữ liệu được"],
     ["!", "Ổ bật BitLocker thì cần mã khôi phục"]],
    "Còn lỗi khác thì sao?", S6H);
}
// 7. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t7() {
  var d = newDoc("Bat khong len - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 657); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để xem thêm cách xử lý lỗi laptop", FS.I, 50, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 787); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
  save5(d, 7);
}

var S2H = 532, S3H = 480, S4H = 480, S5H = 532, S6H = 480;
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
