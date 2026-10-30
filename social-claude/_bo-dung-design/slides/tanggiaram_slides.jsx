// ================= SLIDES: LAPTOP ĐANG TĂNG GIÁ, MUA GIỜ COI RAM GÌ? (30/10) =================
// kiểu bài mẹo (ocung_slides.jsx): headT + trickSlide; slide 3 so sánh 2 ảnh linh kiện (luật 18b); ảnh Task Manager dựng lại 2x (luật 18)
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
  var d = newDoc("Tang gia RAM - 0" + n);
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

// 1. BÌA (luật 17c, bố cục B Hero tràn): ThinkPad T16 Gen 3 (PSREF) góc 3/4 nghiêng -7°, vệt sáng cam đỏ "tăng giá", sticker trắng
// lớp ảnh: bia_lop.py "sang=600,1000,1000,460,hex=F97316,op=0.45" "may=may-t16.png@600,925,1180,xoay=-7,sang=EF4444,sangop=0.5" --kenh laptop --chu 480
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Tang gia RAM - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad T16");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP ĐANG", FS.T, 96, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("TĂNG GIÁ", FS.T, 96, YEL, 96, 416, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  sticker("Mua giờ coi RAM gì?", 300, 585, -6, "trang");
  LOG += "s1 t1 " + bb(A).join(",") + " t2 " + bb(B).join(",") + "\n";
  hookPill("Thợ chỉ cách mua", HOOK_Y);
  save5(d, 1);
}
function t2() {
  trickSlide(2, "VÌ SAO", "VÌ SAO LAPTOP\rLÊN GIÁ", "Máy chủ AI đang giành chip nhớ", "p2-maychu.png",
    [["!", "Chip nhớ dồn cho máy chủ AI: RAM, SSD đắt lên"], ["!", "TrendForce (3/2026): laptop có thể tăng hơn 30%"],
     ["!", "Dell báo tăng giá 15–20% từ 12/2025"]],
    "Vậy mua máy coi gì trước?", 460);
}
// 3. So sánh 2 loại RAM: mỗi bên 1 ảnh linh kiện (luật 18b), cùng khung 430x400
function t3() {
  var d = newDoc("Tang gia RAM - 03");
  placeAt(TN + "bg-3.png", 0, 0, "Nền");
  var sb = headT("RAM HÀN HAY RỜI", "RAM HÀN\rHAY RAM RỜI", "Mua sai máy là hết đường nâng");
  var items = [["!", "MacBook chip M, Core Ultra 200V: RAM hàn liền"], ["!", "Mua bản nào xài bản đó, không nâng được"],
               ["ok", "RAM rời: còn khe trống là cắm thêm thanh"]];
  var ih = 400, capH = 52, stepsH = 34 + items.length * 52, top0 = sb + 30, bot0 = HOOK_Y - 62;
  var extra = Math.max(0, (bot0 - top0) - (ih + capH + 26 + stepsH));
  var gap = 26 + Math.min(Math.round(extra / 3), 60);
  var ft = top0 + Math.round((extra - (gap - 26)) / 2);
  shot("p3-ramhan.png", 430, 98, ft, ih, "Ảnh - RAM hàn");
  shot("p3-khe.png", 430, 552, ft, ih, "Ảnh - RAM rời");
  var c1 = text("RAM hàn chung chip", F.B, 28, C.WHITE, 313, ft + ih + 40, { align: Justification.CENTER, maxW: 430, name: "Chú thích trái" });
  var c2 = text("Thanh RAM rời", F.B, 28, C.WHITE, 767, ft + ih + 40, { align: Justification.CENTER, maxW: 430, name: "Chú thích phải" });
  fxGlow(c1, { shadow: { op: 75, dist: 2, blur: 6 } }); fxGlow(c2, { shadow: { op: 75, dist: 2, blur: 6 } });
  var bot = steps(ft + ih + capH + gap, items);
  hookPill("Máy Windows tự check được", HOOK_Y);
  LOG += "s3 sub den " + sb + " anh " + ft + "-" + (ft + ih) + " y den " + bot + "\n";
  if (bot > HOOK_Y - 50) LOG += "  CANH BAO s3: o y sat cau moc\n";
  save5(d, 3);
}
function t4() {
  trickSlide(4, "TỰ CHECK", "CHECK KHE RAM\r10 GIÂY", "Máy tiếng Việt: Hiệu suất > Bộ nhớ", "s4-memory.png",
    [["ok", "Ctrl + Shift + Esc > Performance > Memory"], ["ok", "Slots used: 1 of 2 là còn 1 khe trống"],
     ["!", "2 of 2: đầy khe, phải thay thanh to hơn"]],
    "Dòng máy nào còn khe?", 562);
}
function t5() {
  trickSlide(5, "CHỌN MÁY", "MÁY CÒN\r2 KHE RAM", "Mua vừa tiền, sau nâng tiếp", "p5-2khe.png",
    [["ok", "Dell Precision 5560: 2 khe RAM rời"], ["ok", "ThinkPad P1 Gen 5, TUF A15 (FA507): 2 khe"],
     ["ok", "16GB 1 thanh, sau cắm thêm lên 32GB"], ["ok", "Hợp dân kỹ thuật, dựng video, app nặng"]],
    "Còn ổ cứng thì sao?", 449);
}
function t6() {
  trickSlide(6, "Ổ CỨNG", "SSD CŨNG\rLÊN GIÁ", "Còn khe M.2 thì khỏi bỏ ổ cũ", "p6-m2.png",
    [["ok", "2 khe M.2: giữ ổ cũ, gắn thêm ổ thứ 2"], ["ok", "Khỏi cài lại Win, khỏi chép dữ liệu"],
     ["1", "Lenovo: tra PSREF xem máy mấy khe M.2"], ["2", "Dell, HP: xem sách sửa chữa trên web hãng"]],
    "Mới hay likenew?", 340);
}
// 7. CUỐI (luật 16h, fen bỏ khối Follow Laptop 30/10 15h22): 1 thẻ kính câu hỏi căn giữa slide
function t7() {
  var d = newDoc("Tang gia RAM - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ câu hỏi");
  var L1 = text("Bạn lấy máy mới", FS.I, 56, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 660); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("HAY LIKENEW LÚC NÀY?", FS.T, 64, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
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
