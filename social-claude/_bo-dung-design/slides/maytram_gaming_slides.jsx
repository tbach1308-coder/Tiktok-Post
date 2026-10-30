
// ================= SLIDES: MÁY TRẠM HAY GAMING (29/10) =================
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" });
  var tb = bb(T); T.translate(0, 214 - tb[1]); tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  return tb[3];
}
// thẻ kính: nhãn xanh nhạt + vài dòng chữ trắng, căn giữa
function cardH(lines, size) { return 40 + 44 + lines.length * (size + 16) + 26; }
function card(t, label, lines, size, extra) {
  var lh = size + 16, h = cardH(lines, size) + extra, e = extra / 2;
  glass(98, t, 982, t + h, 28, "Thẻ - nền");
  var A = text(label, F.B, 34, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Thẻ - nhãn" });
  centerText(A, 540, t + 50 + e); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  for (var i = 0; i < lines.length; i++) {
    var B = text(lines[i], F.B, size, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Thẻ - dòng " + (i + 1) });
    centerText(B, 540, t + 112 + e + i * lh); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  return t + h;
}
function textSlide(n, bgf, pillTxt, title, c1, c2, hook) {
  var d = newDoc("May tram - 0" + n);
  placeAt(TN + bgf, 0, 0, "Nền");
  var sb = headT(pillTxt, title);
  var t0 = sb + 60, size = 46;
  var mx = Math.max(c1[1].length, c2[1].length);
  var hh = Math.max(0, (1240 - t0 - 36) / 2);
  var e1 = hh - cardH(c1[1], size), e2 = hh - cardH(c2[1], size);
  var y = card(t0, c1[0], c1[1], size, Math.max(0, e1));
  y = card(y + 36, c2[0], c2[1], size, Math.max(0, e2));
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " den " + y + "\n";
  save5(d, n);
}
function modelSlide(n, bgf, pillTxt, title, y1, y2, img, name, cfg, scr, hop, hook) {
  var d = newDoc("May tram - 0" + n);
  placeAt(TN + bgf, 0, 0, "Nền");
  var sb = headT(pillTxt, title);
  var t = sb + 28, h = 122;
  glass(98, t, 982, t + h, 28, "Ý - nền");
  var A = text(y1, F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Ý 1" });
  centerText(A, 540, t + 40); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text(y2, F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Ý 2" });
  centerText(B, 540, t + 84); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  var pt = t + h + 20;
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
// 1. BÌA (29/10 19h25, fen chọn mẫu B "Hero tràn", luật 17c): ASUS TUF tách nền to, nghiêng, tràn mép phải, vệt sáng đỏ; tiêu đề căn trái
// lớp ảnh: python "E:/Social Claude/_bo-dung-design/prep/bia_lop.py" "<bài>/tai-nguyen/bia-lop.png" "sang=640,900,820,420,hex=EF4444,op=0.22" "may=E:/Social Claude/Anh tai ve/tai-ve-29-10/asus-tuf-a15-2023-front.png@600,930,1020,xoay=-8,sang=EF4444,sangop=0.5" --chu 470
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("May tram - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-lop.png", "Ảnh bìa - ASUS TUF A15");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("MÁY TRẠM", FS.T, 118, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("HAY GAMING?", FS.T, 106, C.WHITE, 96, 410, { name: "Tiêu đề 2" }); fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  sticker("RTX A hay GeForce?", 330, 1182, -6, "trang", 34);
  hookPill("Đừng mua nhầm card", HOOK_Y);
  save5(d, 1);
}
// thẻ có ảnh card thật bên trái, chữ bên phải
function cardImg(t, h, label, lines, img, alt, note) {
  glass(98, t, 982, t + h, 28, "Thẻ - nền");
  shot(img, 380, 118, t + (h - 300) / 2, 300, "Ảnh card - " + alt);
  var cx = 728;
  var A = text(label, F.B, 30, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 440, name: "Thẻ - nhãn" });
  centerText(A, cx, t + 62); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var y0 = t + 62 + (h - 62 - 30 - lines.length * 56) / 2 + 28;
  for (var i = 0; i < lines.length; i++) {
    var B = text(lines[i], F.B, 40, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 440, name: "Thẻ - dòng " + (i + 1) });
    centerText(B, cx, y0 + i * 56); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  if (note) {
    var N = text(note, FS.I, 26, "CBD5E1", 540, 0, { align: Justification.CENTER, maxW: 440, name: "Thẻ - ghi chú" });
    centerText(N, cx, t + h - 34);
  }
}
function t2() {
  var d = newDoc("May tram - 02");
  placeAt(TN + "bg-2.png", 0, 0, "Nền");
  var sb = headT("CARD ĐỒ HỌA", "KHÁC NHAU\rỞ CARD");
  var t0 = sb + 60, h = Math.floor((1240 - t0 - 36) / 2);
  cardImg(t0, h, "MÁY TRẠM · RTX A2000", ["Driver được hãng", "phần mềm kiểm chứng"], "card-a2000.png", "RTX A2000", "ảnh card rời, minh họa");
  cardImg(t0 + h + 36, h, "MÁY GAMING · RTX 4060", ["Card GeForce,", "mạnh game,", "render nhanh"], "card-4060.png", "GeForce RTX 4060", "ảnh card rời, minh họa");
  hookPill("Vậy ai cần máy trạm?", HOOK_Y);
  LOG += "s2 den " + (t0 + 2 * h + 36) + "\n";
  save5(d, 2);
}
function t3() {
  modelSlide(3, "bg-3.png", "DÂN KỸ THUẬT", "CHỌN MÁY TRẠM KHI",
    "Chạy SolidWorks, Revit, Catia cả ngày,", "cần máy ổn định hơn cần FPS", "p3-dell.png",
    "Dell Precision 5560", "i7-11850H · RTX A2000 4GB", "Máy trạm 15.6 inch",
    "Hợp: kỹ sư cơ khí, xây dựng", "Còn gaming hợp ai?");
}
function t4() {
  modelSlide(4, "bg-4.png", "DÂN SÁNG TẠO", "CHỌN GAMING KHI",
    "Dựng video, render Blender,", "tối về còn làm vài trận game", "p4-tuf.png",
    "ASUS TUF A15", "Ryzen 7 7735HS · RTX 4060 8GB", "15.6 inch · màn 144Hz",
    "Hợp: dựng phim, làm 3D tự do", "Mua nhầm thì sao?");
}
function t5() {
  textSlide(5, "bg-5.png", "LƯU Ý", "MUA NHẦM\rLÀ MỆT",
    ["GAMING · chạy Catia, SolidWorks", ["Vẫn chạy được, nhưng card không", "nằm trong danh sách hãng chứng nhận,", "lỗi hiển thị khó nhờ hãng hỗ trợ"]],
    ["MÁY TRẠM · chơi game", ["Vẫn chơi được, nhưng card", "thiên về ổn định, không tối ưu FPS"]],
    "Vậy chọn theo gì?");
}
function t6() {
  var d = newDoc("May tram - 06");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var sb = headT("CHỐT LẠI", "CHỌN THEO\rVIỆC CHÍNH");
  var t0 = sb + 60, h = Math.floor((1240 - t0 - 36) / 2);
  cardImg(t0, h, "VIỆC CHÍNH · kỹ thuật", ["Chọn máy trạm,", "card được hãng", "kiểm chứng"], "s6-ky-thuat.png", "Làm phần mềm kỹ thuật");
  cardImg(t0 + h + 36, h, "VIỆC CHÍNH · render, game", ["Chọn gaming,", "card mạnh", "xử lý đồ họa"], "s6-render.png", "Dựng video, render");
  hookPill("Bạn chọn bên nào?", HOOK_Y);
  LOG += "s6 den " + (t0 + 2 * h + 36) + "\n";
  save5(d, 6);
}
// 7. CUỐI: chỉ chữ, không địa chỉ
function t7() {
  var d = newDoc("May tram - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  var L1 = text("BẠN CHỌN", FS.I, 64, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Dòng 1" });
  centerText(L1, 540, 550); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("MÁY TRẠM HAY GAMING?", FS.T, 70, YEL, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Dòng 2" });
  centerText(L2, 540, 650); var b3 = bb(L2);
  fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L4 = text("Comment, Poly chọn máy giúp", F.B, 36, C.GREEN_L, 0, 0, { name: "Comment" });
  var b4 = bb(L4), w4 = b4[2] - b4[0] + 70;
  L4.translate(540 - w4 / 2 - b4[0], 0); centerY(L4, 754); b4 = bb(L4);
  fx(L4, { shadow: { op: 70, dist: 2, blur: 6 } });
  emojiC("👇", 50, b4[2] + 40, 750, "Chỉ xuống");
  var cy = 880;
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
