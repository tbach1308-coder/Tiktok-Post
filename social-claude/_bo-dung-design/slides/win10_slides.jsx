// ================= SLIDES: LAPTOP WIN 10 CÒN XÀI ĐƯỢC? (03/11) =================
// kiểu bài mẹo (donoc_slides.jsx): headT + trickSlide; ảnh màn Windows thật trên mạng (máy shop Win 11, app không tự chụp, luật 18)
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var nL = t.split("\r").length;
  var T = text(t, FS.T, 76, YEL, 540, 281, { align: Justification.CENTER, maxW: 884, lead: 84, name: "Tiêu đề" });
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
  var d = newDoc("Win 10 - 0" + n);
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

// 1. BÌA (luật 17c, bố cục C Cận chi tiết): ThinkPad T480s màn Windows Update Win 10, nghiêng -8°, vệt sáng xanh lá
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Win 10 - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - laptop Win 10");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP WIN 10\rCÒN XÀI ĐƯỢC?", FS.T, 96, YEL, 96, 300, { lead: 108, name: "Tiêu đề" });
  fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  LOG += "s1 t " + bb(A).join(",") + "\n";
  hookPill("Hạn chót đổi rồi", HOOK_Y);
  save5(d, 1);
}
// 2. Ảnh + thẻ 3 mốc ngày + 2 ý
function moc(cx, y, ngay, nhan, hex) {
  var N = text(ngay, FS.T, 42, hex, cx, y, { align: Justification.CENTER, name: "Mốc - " + nhan });
  fxGlow(N, { shadow: { op: 60, dist: 2, blur: 6 } });
  text(nhan, F.B, 27, C.WHITE, cx, y + 44, { align: Justification.CENTER, name: "Nhãn mốc - " + nhan });
}
function t2() {
  var d = newDoc("Win 10 - 02");
  placeAt(TN + "bg-2.png", 0, 0, "Nền");
  var sb = headT("HẾT HỖ TRỢ", "WIN 10\rHẾT CẬP NHẬT CHƯA?", "ESU là gói bảo mật thêm của Microsoft");
  var fh = S2H, mH = 142, its = [["!", "Không đăng ký ESU: hết bản vá sau 14/10/2025"], ["ok", "Máy vẫn chạy, chỉ không được vá lỗ hổng mới"]];
  var sH = 34 + its.length * 52, top0 = sb + 30, bot0 = HOOK_Y - 62;
  var extra = Math.max(0, (bot0 - top0) - (fh + mH + sH + 52));
  var gap = 26 + Math.min(Math.round(extra / 4), 40);
  var ft = top0 + Math.round((extra - 2 * (gap - 26)) / 2);
  shot("s2-het.png", 884, 98, ft, fh, "Ảnh - Windows Update hết hỗ trợ");
  var mt = ft + fh + gap;
  glass(98, mt, 982, mt + mH, 28, "Thẻ mốc - nền");
  moc(245, mt + 62, "14/10/2025", "Hết bản vá", C.WHITE);
  moc(540, mt + 62, "13/10/2026", "Hạn ESU cũ", C.WHITE);
  moc(835, mt + 62, "12/10/2027", "Hạn ESU mới", YEL);
  var bot = steps(mt + mH + gap, its);
  hookPill("Đăng ký ở đâu?", HOOK_Y);
  LOG += "s2 sub den " + sb + " anh " + ft + "-" + (ft + fh) + " y den " + bot + "\n";
  save5(d, 2);
}
function t3() {
  trickSlide(3, "CÁCH 1 · GÓI BẢO MẬT", "ĐĂNG KÝ GÓI\rBẢO MẬT Ở ĐÂU?", "Chỉ vá bảo mật, bật sao lưu cài đặt là miễn phí", "s3-enroll.png",
    [["1", "Cài đặt > Cập nhật & Bảo mật > Windows Update"], ["2", "Bấm Đăng ký ngay (Enroll now)"],
     ["ok", "Cần Win 10 22H2, tài khoản Microsoft quản trị"],
     ["!", "Máy dính domain công ty không đăng ký được"]],
    "Hay lên luôn Win 11?", S3H);
}
function t4() {
  trickSlide(4, "CÁCH 2 · LÊN WIN 11", "MÁY BẠN LÊN WIN 11\rĐƯỢC KHÔNG?", "Microsoft xét đời chip, RAM nhiều không cứu được", "s4-health.png",
    [["ok", "Cài app PC Health Check, bấm Check now là biết"],
     ["ok", "Chip: Intel từ đời 8, laptop AMD từ Ryzen 3000"], ["ok", "i5-8350U là đời 8, i7-7700HQ là đời 7"],
     ["!", "i7-7700HQ gắn RAM 32GB vẫn rớt vì đời chip"]],
    "Chip đủ mà vẫn báo rớt?", S4H);
}
function t5() {
  trickSlide(5, "KIỂM TPM", "CHIP ĐỦ\rMÀ VẪN BÁO RỚT?", "TPM là phần bảo mật Win 11 bắt buộc có", "s5-tpm.png",
    [["1", "Bấm Win + R, gõ tpm.msc, bấm Enter"], ["ok", "Dòng Specification Version phải là 2.0"],
     ["2", "Không thấy TPM: vào BIOS bật Intel PTT / AMD fTPM"],
     ["!", "Vẫn rớt: xem dòng Secure Boot trong Health Check"]],
    "Rớt thì chọn đường nào?", S5H);
}
function t6() {
  trickSlide(6, "CHỐT ĐƯỜNG ĐI", "ĐẠT THÌ LÊN,\rRỚT THÌ SAO?", "Mỗi máy 1 đường, chọn là xong", "s6-win11.png",
    [["ok", "Máy đạt: lên Win 11 miễn phí qua Windows Update"], ["ok", "Sao lưu dữ liệu trước khi lên"],
     ["!", "Máy rớt: đăng ký ESU, vá tới 12/10/2027, rồi lên đời"], ["ok", "Mua likenew chọn Intel đời 8, Ryzen 3000 trở lên"]],
    "Máy bạn đời mấy?", S6H);
}
// 7. CUỐI (luật 16h, không Follow): 1 thẻ kính câu hỏi căn giữa slide
function t7() {
  var d = newDoc("Win 10 - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu hỏi");
  var L1 = text("Laptop bạn đang dùng", FS.I, 58, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 640); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("CHIP ĐỜI MẤY?", FS.T, 84, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 770); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
  save5(d, 7);
}

var S2H = 288, S3H = 364, S4H = 373, S5H = 430, S6H = 477;
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
