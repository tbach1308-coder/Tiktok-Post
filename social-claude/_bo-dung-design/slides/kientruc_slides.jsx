
// ================= SLIDES: LAPTOP CHO DÂN KIẾN TRÚC (30/10) =================
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" });
  var tb = bb(T); T.translate(0, 214 - tb[1]); tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(sub, FS.I, 40, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 900, name: "Phụ đề" });
  centerText(S, 540, (tb[3] - tb[1] > 110 ? tb[3] : 290) + 40); fx(S, { shadow: { op: 70, dist: 2, blur: 6 } }); // tiêu đề 1 dòng: phụ đề cố định y 330
  return bb(S)[3];
}
function yBox(t, y1, y2) {
  var h = 122;
  glass(98, t, 982, t + h, 28, "Ý - nền");
  var A = text(y1, F.B, 29, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 830, name: "Ý 1" });
  centerText(A, 540, t + 40); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text(y2, F.B, 29, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 830, name: "Ý 2" });
  centerText(B, 540, t + 84); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  return t + h;
}
function nhanMinhHoa(t, h) {
  var L = text("ảnh minh họa", F.B, 26, C.WHITE, 120, t + h - 22, { name: "Nhãn ảnh minh họa" });
  fx(L, { shadow: { op: 90, dist: 2, blur: 6 } });
}
// slide trong: tiêu đề + phụ đề + ô 2 ý + ảnh 884x560 + ô xanh 1–2 dòng + câu móc
function mucSlide(n, bgf, pillTxt, title, sub, y1, y2, img, imgName, xanh, hook, minhHoa) {
  var d = newDoc("Kien truc - 0" + n);
  placeAt(TN + bgf, 0, 0, "Nền");
  var sb = headT(pillTxt, title, sub);
  var pt = yBox(sb + 24, y1, y2) + 20;
  shot(img, 884, 98, pt, 560, "Ảnh - " + imgName);
  // fen 30/10: không ghi chữ "ảnh minh họa" trên hình (luật 16i, 16j)
  var y = pt + 560 + 18, kh = xanh.length > 1 ? 124 : 80;
  var K = rect(98, y, 982, y + kh, 28, C.GREEN_SOFT, "Ô xanh - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  for (var i = 0; i < xanh.length; i++) {
    var T = text(xanh[i], F.B, 30, C.INK, 540, 0, { align: Justification.CENTER, maxW: 850, name: "Ô xanh " + (i + 1) });
    centerText(T, 540, xanh.length > 1 ? y + 40 + i * 44 : y + 40);
  }
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " phu de " + sb + " den " + (y + kh) + "\n";
  save5(d, n);
}
// 1. BÌA (luật 17c, bố cục F Sticker chú thích): ThinkPad P16v Gen 2 (PSREF, màn mô hình nội thất 3D) nghiêng -6°, vệt sáng xanh dương + 3 sticker phần mềm
// lớp ảnh: python "E:/Social Claude/_bo-dung-design/prep/bia_lop.py" "<bài>/tai-nguyen/bia-lop.png" "sang=600,1040,1000,420,hex=3B82F6,op=0.40" "may=E:/Social Claude/Anh tai ve/tai-ve-30-10/kientruc/psref-ThinkPad_P16v_Gen_2_Intel_01.png@610,1000,1240,xoay=-6,sang=3B82F6" --kenh laptop --chu 610
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Kien truc - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ThinkPad P16v Gen 2");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("LAPTOP CHO", FS.T, 104, YEL, 96, 292, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("DÂN KIẾN TRÚC", FS.T, 104, YEL, 96, 404, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var bB = bb(B);
  if (bB[2] > 982) B.resize(100 * (982 - 96) / (bB[2] - 96), 100 * (982 - 96) / (bB[2] - 96), AnchorPosition.MIDDLELEFT);
  var S = text("CAD khác render", FS.I, 46, C.WHITE, 100, 500, { name: "Dòng phụ" }); fx(S, { shadow: { op: 70, dist: 2, blur: 6 } });
  sticker("AutoCAD", 800, 690, 6, "trang");
  sticker("Revit", 830, 830, -5, "xanh");
  sticker("Lumion", 790, 970, 5, "vang");
  hookPill("Chọn theo phần mềm", HOOK_Y);
  LOG += "s1 tieu de 2 " + bb(B).join(",") + "\n";
  save5(d, 1);
}
function t2() {
  mucSlide(2, "bg-2.png", "MỨC 1", "VẼ CAD 2D", "AutoCAD ăn CPU là chính",
    "Card không cần mạnh, xung CPU cao vẽ mượt", "AutoCAD 2027 ghi tối thiểu 16GB RAM, khuyên 32GB",
    "p2-cad.png", "bản vẽ CAD 2D",
    ["Hợp: sinh viên năm đầu, dân vẽ hồ sơ"], "Lên 3D thì sao?");
}
function t3() {
  mucSlide(3, "bg-3.png", "MỨC 2", "DỰNG 3D REVIT", "RAM là chỗ phải chi",
    "Revit cần tối thiểu 16GB RAM, file lớn nên 32GB", "Mô hình ăn xung đơn nhân, chip xung cao đỡ khựng",
    "p3-bim.png", "mô hình BIM 3D",
    ["Hợp: sinh viên năm 3 trở lên, văn phòng thiết kế"], "Render mới tốn tiền");
}
function t4() {
  mucSlide(4, "bg-4.png", "MỨC 3", "RENDER LUMION", "Card rời quyết định",
    "Lumion khuyên card 10GB VRAM, RAM 32GB", "Card 8GB như RTX 4060 laptop: cảnh nặng render lâu",
    "p4-lumion.png", "cảnh render Lumion",
    ["Lumion Pro chỉ hỗ trợ Windows,", "MacBook chỉ có Lumion View cho SketchUp"], "Màn cũng quan trọng");
}
function t5() {
  mucSlide(5, "bg-5.png", "LƯU Ý", "MÀN HÌNH ĐÚNG MÀU", "Lệch màu là làm lại",
    "Màn 45% NTSC hay gặp ở máy rẻ, màu nhạt", "Chọn màn phủ 100% sRGB cho màu sát thật",
    "p5-mau-sach.png", "cân màu màn hình",
    ["Màn 16 inch nhìn bản vẽ rộng, đỡ phải zoom"], "Máy hàn RAM thì kẹt", true);
}
function t6() {
  mucSlide(6, "bg-6.png", "MẸO", "CHỪA ĐƯỜNG NÂNG CẤP", "Mua máy, nhìn khe trước",
    "Máy hàn RAM 16GB thì không lên 32GB được", "Lấy máy có khe RAM rời, còn khe SSD trống",
    "p6-ram-sach.png", "khe RAM laptop (ảnh tạm, chờ ảnh shop)",
    ["Thợ Poly mở máy nâng RAM, SSD ngay tại shop"], "Bạn đang ở mức nào?", true);
}
// 7. CUỐI (luật 16h [Laptop]): 2 thẻ kính, trên câu hỏi fen viết, dưới khoiFollow
function t7() {
  var d = newDoc("Kien truc - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  glass(98, 250, 982, 650, 36, "Thẻ câu hỏi");
  var L1 = text("BẠN VẼ CAD, REVIT", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 390); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("HAY RENDER LUMION?", FS.T, 66, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 500); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  glass(98, 760, 982, 1160, 36, "Thẻ follow");
  khoiFollow("@polystorelaptop", "Follow để chọn laptop đúng nghề", 960);
  LOG += "s7 dong2 " + bb(L2).join(",") + "\n";
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
