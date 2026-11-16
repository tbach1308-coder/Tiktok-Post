
// ================= SLIDES: GIÁ LAPTOP THÁNG 11 (03/11) =================
// bài 13 slide: tên file 2 chữ số (slide-10, không phải slide-010)
function save5(doc, n) {
  var ten = (n < 10 ? "0" : "") + n;
  doc.resizeImage(undefined, undefined, 150, ResampleMethod.NONE);
  var o = new PhotoshopSaveOptions(); o.layers = true; o.embedColorProfile = true;
  doc.saveAs(new File(OUT5.fsName + "/slide-" + ten + ".psd"), o, true, Extension.LOWERCASE);
  var p = new PNGSaveOptions(); p.compression = 6; p.interlaced = false;
  doc.saveAs(new File(OUT5.fsName + "/slide-" + ten + ".png"), p, true, Extension.LOWERCASE);
  doc.close(SaveOptions.DONOTSAVECHANGES);
}
function fitW(T, maxW) { var b = bb(T), w = b[2] - b[0]; if (w > maxW) { var p = maxW / w * 100; T.resize(p, p, AnchorPosition.MIDDLECENTER); } }
// slide báo giá 1 máy (luật 2, 5, 8): hãng nhỏ, tên máy vàng, ảnh 884x540, giá nhỏ xanh trong khung trắng, cấu hình + ý cần biết + "Hợp với", câu móc
function giaSlide(n, brand, model, cfg, y, gia, hop, hook) {
  var d = newDoc("Gia laptop T11 - " + (n < 10 ? "0" : "") + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var K = text(brand, F.B, 26, "CBD5E1", 540, 0, { align: Justification.CENTER, track: 300, name: "Hãng" });
  centerText(K, 540, 204);
  var T = text(model, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, name: "Tiêu đề" });
  fitW(T, 880); centerText(T, 540, 270);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var pt = 322;
  shot("p-" + n + ".png", 884, 98, pt, 540, "Ảnh - " + model);
  // giá: khung trắng nhỏ, chữ xanh, nằm ngay mép dưới ảnh (không chữ "Giá")
  var gy = pt + 540;
  var GT = text(gia, F.B, 38, "16A34A", 540, 0, { align: Justification.CENTER, name: "Giá" });
  centerText(GT, 540, gy);
  var gb = bb(GT);
  var GR = rect(gb[0] - 28, gy - 33, gb[2] + 28, gy + 33, 20, C.WHITE, "Giá - nền");
  fx(GR, { shadow: { op: 50, dist: 4, blur: 10 } });
  GR.move(GT, ElementPlacement.PLACEAFTER);
  // thẻ kính: cấu hình trắng, ý cần biết vàng nhạt
  var gt = gy + 48, lhC = 46, lhY = 41, gh = 212;
  var dem = Math.round((gh - cfg.length * lhC - 10 - y.length * lhY) / 2);
  glass(98, gt, 982, gt + gh, 28, "Thông tin - nền");
  for (var i = 0; i < cfg.length; i++) {
    var A = text(cfg[i], F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Cấu hình " + (i + 1) });
    fitW(A, 800); centerText(A, 540, gt + dem + lhC / 2 + i * lhC); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  var y0 = gt + dem + cfg.length * lhC + 10;
  for (var j = 0; j < y.length; j++) {
    var B = text(y[j], F.B, 28, "FDE68A", 540, 0, { align: Justification.CENTER, name: "Ý " + (j + 1) });
    fitW(B, 800); centerText(B, 540, y0 + lhY / 2 + j * lhY); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  // ô xanh "Hợp với"
  var ky = gt + gh + 14, hh = hop.indexOf("\r") >= 0 ? 104 : 72;
  var R = rect(98, ky, 982, ky + hh, 26, C.GREEN_SOFT, "Hợp với - nền");
  fx(R, { shadow: { op: 40, dist: 6, blur: 12 } });
  var H = text(hop, F.B, 28, C.INK, 540, 0, { align: Justification.CENTER, lead: 38, name: "Hợp với" });
  fitW(H, 800); centerText(H, 540, ky + hh / 2);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " tieu de " + bb(T).join(",") + " gia " + gb.join(",") + " xanh den " + (ky + hh) + "\n";
  if (ky + hh > HOOK_Y - 36) LOG += "  CANH BAO s" + n + ": o xanh sat cau moc\n";
  save5(d, n);
}
// 1. BÌA (luật 17b, 17c, bố cục G Số to): ThinkPad P1 Gen 6 (PSREF) nghiêng -8°, số 11 vàng mờ phía sau, vệt sáng xanh lá
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Gia laptop T11 - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  soTo("11", 850, 236, 190, 30, YEL);
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad P1 Gen 6");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("GIÁ LAPTOP", FS.T, 93, YEL, 96, 292, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("THÁNG 11 TẠI POLY", FS.T, 93, YEL, 96, 404, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var S = text("Máy nào đáng tiền?", FS.I, 46, C.WHITE, 98, 490, { name: "Dòng phụ" }); fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  hookPill("Vuốt xem 11 máy", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(B).join(",") + " phu " + bb(S).join(",") + "\n";
  save5(d, 1);
}
function t2() { giaSlide(2, "LENOVO THINKPAD", "X1 Extreme Gen 2",
  ["i7-9850H · GTX 1650 Max-Q 4GB", "RAM 32GB · SSD 1TB · 15.6 inch Full HD"],
  ["Máy đời 2019 nhưng vẫn có card rời,", "giá thấp nhất bài"], "14.800.000đ",
  "Hợp với sinh viên kỹ thuật, AutoCAD 2D, Photoshop", "Cần máy gọn hơn để mang đi?"); }
function t3() { giaSlide(3, "LENOVO THINKPAD", "X13 Gen 3",
  ["i7-1280P · Iris Xe", "RAM 32GB · SSD 1TB · 13.3 inch Full HD+"],
  ["RAM hàn liền, không nâng được,", "bản này có sẵn 32GB nên khỏi lo"], "17.800.000đ",
  "Hợp với văn phòng, Excel, họp online, hay đi lại", "Thích màn 14 inch rộng hơn?"); }
function t4() { giaSlide(4, "LENOVO THINKPAD", "P14s Gen 4",
  ["Ryzen 5 PRO 7540U · Radeon 740M", "RAM 32GB · SSD 512GB · 14 inch Full HD+"],
  ["RAM cũng hàn liền, bản này có sẵn 32GB,", "SSD vẫn thay được"], "21.800.000đ",
  "Hợp với kế toán, IT, code web, hay mang máy đi làm", "Cần RAM nhiều hơn hẳn?"); }
function t5() { giaSlide(5, "DELL", "Precision 7680",
  ["i7-13850HX · card onboard", "RAM 64GB · SSD 512GB · 16 inch Full HD+"],
  ["Bản này không card rời,", "làm 3D, render thì xem máy sau"], "26.500.000đ",
  "Hợp với chạy máy ảo, file Excel nặng,\rmở nhiều phần mềm cùng lúc", "Cần card khỏe để render?"); }
function t6() { giaSlide(6, "LENOVO THINKPAD", "P1 Gen 4",
  ["i9-11950H · RTX 3080 16GB", "RAM 16GB · SSD 1TB · 16 inch 4K"],
  ["Có 2 khe RAM,", "làm nặng thì nâng thêm được, tối đa 64GB"], "28.500.000đ",
  "Hợp với render, dựng video 4K, làm đồ họa cần màn nét", "Muốn có sẵn RAM 32GB, card máy trạm?"); }
function t7() { giaSlide(7, "LENOVO THINKPAD", "P1 Gen 5",
  ["i7-12800H · RTX A2000 8GB", "RAM 32GB · SSD 1TB · 16 inch 2.5K"],
  ["Có 2 khe RAM DDR5,", "cần thêm thì nâng được, tối đa 64GB"], "31.800.000đ",
  "Hợp với AutoCAD, SolidWorks, thiết kế đồ họa", "Muốn chip mới, card Ada?"); }
function t8() { giaSlide(8, "LENOVO THINKPAD", "P1 Gen 6",
  ["i7-13800H · RTX 2000 Ada 8GB", "RAM 32GB · SSD 1TB · 16 inch 2.5K"],
  ["Có 2 khe RAM DDR5,", "nâng được tối đa 96GB"], "37.800.000đ",
  "Hợp với dân kỹ thuật, đồ họa cần card máy trạm\rđời mới, sau này muốn nâng RAM", "Thích Dell hơn?"); }
function t9() { giaSlide(9, "DELL", "Precision 5690",
  ["Ultra 9 185H · RTX 2000 Ada 8GB", "RAM 32GB · SSD 1TB · 16 inch Full HD+"],
  ["RAM hàn liền, không nâng được,", "Có 2 khe M.2 để thêm SSD"], "38.800.000đ",
  "Hợp với dân kỹ thuật, đồ họa thích Dell, dùng 32GB là đủ", "Cần card cao hơn, màn OLED?"); }
function t10() { giaSlide(10, "LENOVO THINKPAD", "P1 Gen 6 OLED",
  ["i7-13800H · RTX 3500 Ada 12GB", "RAM 32GB · SSD 1TB · 16 inch 4K OLED cảm ứng"],
  ["Card 12GB VRAM, gấp rưỡi bản", "RTX 2000 Ada 8GB ở trên"], "42.000.000đ",
  "Hợp với dựng 3D, render, chỉnh màu ảnh và video", "Muốn chip Ultra, máy newbody?"); }
function t11() { giaSlide(11, "LENOVO THINKPAD", "P1 Gen 7",
  ["Ultra 7 155H · RTX 2000 Ada 8GB", "RAM 32GB · SSD 1TB · 16 inch 2.5K"],
  ["Máy newbody, pin mới sạc 2 lần,", "RAM dạng LPCAMM2 thay được, tối đa 64GB"], "45.500.000đ",
  "Hợp với người muốn máy gần như mới để dùng lâu dài", "Cần card Ada cao hơn nữa?"); }
function t12() { giaSlide(12, "LENOVO THINKPAD", "P1 Gen 6 RTX 4000 Ada",
  ["i7-13800H · RTX 4000 Ada 12GB", "RAM 32GB · SSD 1TB · 16 inch 4K OLED"],
  ["Cùng 12GB, 7.424 lõi so với 5.120 của 3500 Ada,", "2 khe RAM DDR5, tối đa 96GB"], "47.800.000đ",
  "Hợp với render 3D nặng, dựng video, đồ họa cần màn đẹp", "Bạn hợp con nào?"); }
// 13. CUỐI (luật 9, 16h mới 03/11): chỉ chữ, 1 thẻ kính giữa slide, câu Follow fen viết (sửa lỗi gõ), không nút, không địa chỉ
function t13() {
  var d = newDoc("Gia laptop T11 - 13 cuoi");
  placeAt(TN + "bg-13.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ lời gọi");
  var L1 = text("FOLLOW POLY", FS.T, 104, YEL, 540, 0, { align: Justification.CENTER, name: "Dòng 1" });
  fitW(L1, 840); centerText(L1, 540, 635); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("cập nhật giá mỗi tháng nha", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Dòng 2" });
  fitW(L2, 800); centerText(L2, 540, 790); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s13 dong1 " + bb(L1).join(",") + "\n";
  save5(d, 13);
}

var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + " | emoji=" + F.E + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 13; k++) if (want(k)) {
    try { FN[k](); LOG += (k < 10 ? "0" : "") + k + " ok\n"; } catch (e1) { LOG += "LOI " + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
