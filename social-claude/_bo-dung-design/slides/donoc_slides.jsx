// ================= SLIDES: Ổ C ĐẦY ĐỎ RỒI? (03/11) =================
// kiểu bài mẹo (trickmac_slides.jsx): headT + trickSlide; ảnh màn Windows thật trên mạng (app không tự chụp, luật 18)
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
  var d = newDoc("Don o C - 0" + n);
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

// 1. BÌA (luật 17c, bố cục B Hero tràn): ThinkPad E16 Gen 2 màn This PC ổ C đỏ, nghiêng -6°, vệt sáng đỏ
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Don o C - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ổ C đỏ");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("Ổ C ĐẦY ĐỎ RỒI?", FS.T, 96, YEL, 96, 300, { name: "Tiêu đề" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var S = text("5 cách dọn", FS.I, 44, C.WHITE, 98, 372, { name: "Dòng phụ" }); fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  LOG += "s1 t " + bb(A).join(",") + " s " + bb(S).join(",") + "\n";
  hookPill("Làm cái nào trước?", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "MẸO 1 · GỢI Ý DỌN", "ĐỂ WINDOWS\rCHỈ CHỖ DỌN", "Liệt kê file tạm, file lớn hoặc lâu không mở, app ít xài", "s2-cleanup.png",
    [["1", "Settings > System > Storage"], ["2", "Bấm Cleanup recommendations"],
     ["3", "Tick cái không cần, bấm Clean up ở từng mục"], ["!", "Downloads còn file cần thì đừng tick"]],
    "Dọn xong vài tuần lại đầy?", S2H);
}
function t3() {
  trickSlide(3, "MẸO 2 · TỰ DỌN", "BẬT TỰ DỌN", "Bạn chọn được lịch chạy ở Run Storage Sense", "s3-sense.png",
    [["1", "Settings > System > Storage > Storage Sense"], ["2", "Bật Automatic User content cleanup"],
     ["ok", "Tự xoá file tạm, Thùng rác quá 30 ngày (mặc định)"],
     ["!", "Downloads để Never nếu hay lưu file ở đó"]],
    "Mới lên Windows thì dọn thêm được gì?", S3H);
}
function t4() {
  trickSlide(4, "MẸO 3 · SAU NÂNG CẤP", "XOÁ BẢN WINDOWS CŨ", "Nâng cấp chưa quá 10 ngày, bản cũ còn trong ổ C", "s4-temp.png",
    [["1", "Settings > System > Storage > Temporary files"], ["2", "Tick Previous Windows installation(s)"],
     ["3", "Bấm Remove files"], ["!", "Chưa thấy mục này: bấm Cleanup system files"],
     ["!", "Xoá rồi không quay về được, máy chạy ổn hãy xoá"]],
    "Còn 1 file ẩn, RAM càng lớn càng nặng", S4H);
}
function t5() {
  trickSlide(5, "MẸO 4 · NGỦ ĐÔNG", "TẮT NGỦ ĐÔNG", "File hiberfil.sys nằm sẵn, không xoá tay được", "s5-cmd.png",
    [["1", "Tìm cmd, chuột phải, Run as administrator"], ["2", "Gõ powercfg /hibernate off, bấm Enter"],
     ["ok", "Windows tự xoá hiberfil.sys, Sleep vẫn xài"],
     ["!", "Chỉ mất Hibernate, Fast Startup và Hybrid Sleep"]],
    "Dọn hết vẫn thiếu chỗ thì sao?", S5H);
}
function t6() {
  trickSlide(6, "MẸO 5 · NƠI LƯU", "ĐỪNG LƯU VÀO\rỔ C NỮA", "Đổi nơi lưu cho app, tài liệu, video mới", "s6-save.png",
    [["1", "Storage > Advanced storage settings"], ["2", "Vào Where new content is saved"],
     ["3", "Chọn ổ khác cho từng mục, bấm Apply"],
     ["!", "Máy chỉ 1 ổ: còn khe M.2 trống thì gắn thêm SSD"],
     ["!", "Hết khe thì thay ổ lớn hơn, trừ máy hàn SSD"]],
    "Máy bạn còn trống bao nhiêu?", S6H);
}
// 7. CUỐI (luật 16h, không Follow): 1 thẻ kính câu hỏi căn giữa slide
function t7() {
  var d = newDoc("Don o C - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu hỏi");
  var L1 = text("Máy bạn SSD mấy GB,", FS.I, 58, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 625); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("Ổ C CÒN TRỐNG\rBAO NHIÊU?", FS.T, 68, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, lead: 80, name: "Dòng 2" });
  centerText(L2, 540, 770); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
  save5(d, 7);
}

var S2H = 418, S3H = 574, S4H = 394, S5H = 327, S6H = 374;
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
