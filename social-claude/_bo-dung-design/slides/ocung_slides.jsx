// ================= SLIDES: LAPTOP CHẬM? SOI Ổ CỨNG TRƯỚC (30/10) =================
// kiểu bài mẹo (pinlaptop_slides.jsx): headT + trickSlide; ảnh Task Manager / Settings dựng lại 2x (luật 18, app không tự chụp)
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
  var d = newDoc("O cung - 0" + n);
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

// 1. BÌA (luật 17c, bố cục C Cận chi tiết): màn Task Manager Disk 0 tràn ngang, mờ viền trên vào bg-thumb, vệt sáng xanh lá
// lớp ảnh: bia_lop.py "sang=560,900,1000,500,hex=22C55E,op=0.35" "anh=bia-taskmgr.png@0,540,1080,crop=0:0:1080:700,mo=tren:160:duoi:60" --kenh laptop --chu 480
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("O cung - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - Task Manager");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP CHẬM?", FS.T, 90, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("SOI Ổ CỨNG TRƯỚC", FS.T, 90, YEL, 96, 412, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  sticker("Máy bạn ra gì?", 200, 1075, -6, "xanh");
  LOG += "s1 t1 " + bb(A).join(",") + " t2 " + bb(B).join(",") + "\n";
  hookPill("Mở Task Manager ra", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "BƯỚC 1 · LOẠI Ổ", "XEM MÁY\rXÀI Ổ GÌ", "Khỏi vội cài lại Win", "s2-disk-type.png",
    [["1", "Chuột phải nút Start > Task Manager"], ["2", "Tab Performance > bấm Disk 0"],
     ["3", "Nhìn dòng Type: SSD hay HDD"]],
    "Ra HDD thì sao?", 460);
}
function t3() {
  trickSlide(3, "BƯỚC 2 · Ổ NGHẼN", "ACTIVE TIME\rĐỨNG 100%", "Ổ chạy hết sức, máy khựng theo", "s3-active-time.png",
    [["!", "Mở Chrome, Excel mà đứng 100% cả phút"], ["!", "Máy ổ HDD hay dính cảnh này"],
     ["ok", "Thay SSD là đỡ hẳn"], ["ok", "Lúc update, quét virus: 100% là thường"]],
    "Xài SSD rồi vẫn chậm?", 460);
}
function t4() {
  trickSlide(4, "BƯỚC 3 · SỨC KHOẺ SSD", "SSD CŨNG CÓ\rLÚC YẾU", "Ổ NVMe tự báo tuổi thọ còn lại", "s4-drive-health.png",
    [["1", "Settings > System > Storage"], ["2", "Advanced storage settings > Disks & volumes"],
     ["3", "Chọn ổ > Properties, xem Drive health"], ["!", "Tuổi thọ còn thấp: chép dữ liệu ra, thay ổ"]],
    "Ổ khoẻ mà vẫn ì?", 460);
}
function t5() {
  trickSlide(5, "BƯỚC 4 · RAM", "RAM KÍN,\rMÁY ĐỨNG", "Mở việc hay làm rồi mới xem", "s5-memory.png",
    [["ok", "Tab Performance > Memory"], ["!", "In use gần kín là thiếu RAM"],
     ["ok", "Slots used ghi \u201C1 of 2\u201D: có thể còn khe"], ["!", "Laptop RAM hàn hay báo sai, ra tiệm kiểm"]],
    "Còn 1 thủ phạm lúc mở máy", 460);
}
function t6() {
  trickSlide(6, "BƯỚC 5 · KHỞI ĐỘNG", "APP TỰ CHẠY\rLÚC BẬT MÁY", "Càng nhiều app, mở máy càng lâu", "s6-startup.png",
    [["1", "Task Manager > tab Startup apps"], ["2", "Xem cột Startup impact"],
     ["3", "App \u201CHigh\u201D không cần: chuột phải > Disable"], ["!", "Đừng tắt app hãng máy, driver âm thanh"]],
    "Máy bạn ra kết quả gì?", 445);
}
// 7. CUỐI (luật 16h, fen bỏ khối Follow Laptop 30/10 15h22): 1 thẻ kính câu hỏi căn giữa slide
function t7() {
  var d = newDoc("O cung - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu hỏi");
  var L1 = text("MÁY BẠN Ổ SSD HAY HDD,", FS.I, 56, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 660); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("RAM MẤY GB?", FS.T, 72, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 775); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  LOG += "s7 dong1 " + bb(L1).join(",") + " dong2 " + bb(L2).join(",") + "\n";
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
