
// ================= SLIDES: NGÀNH BẠN CÀI APP GÌ (24/10) =================
function headT(pillTxt, t, sub) {
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  pillC(pillTxt, 540, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var T = text(t, FS.T, 76, YEL, 540, 0, { align: Justification.CENTER, maxW: 920, lead: 84, name: "Tiêu đề" });
  var tb = bb(T); T.translate(0, 214 - tb[1]); tb = bb(T);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  if (!sub) return tb[3];
  var S = text(sub, FS.I, 36, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 900, name: "Phụ đề" });
  var sb = bb(S); S.translate(0, tb[3] + 24 - sb[1]); sb = bb(S);
  fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  return sb[3];
}

function chips(cy, list) {
  var gap = 14, items = [], total = 0;
  for (var i = 0; i < list.length; i++) {
    var T = text(list[i], F.B, 28, C.WHITE, 0, cy + 10, { name: "App - " + list[i] });
    var b = bb(T), w = b[2] - b[0]; items.push([T, b, w]); total += w + 44 + (i ? gap : 0);
  }
  var x = 540 - total / 2;
  for (var j = 0; j < items.length; j++) {
    var T2 = items[j][0], b2 = items[j][1], w2 = items[j][2];
    T2.translate(x + 22 - b2[0], 0);
    var R = rect(x, cy - 28, x + w2 + 44, cy + 28, 28, C.BLACK, "App - nền " + j);
    R.fillOpacity = 55; fx(R, { stroke: { hex: C.GREEN_L, size: 2, op: 85, inside: true } });
    R.move(T2, ElementPlacement.PLACEAFTER);
    x += w2 + 44 + gap;
  }
}
function infoBox(t, can, sv) {
  var h = 126; glass(98, t, 982, t + h, 28, "Cần - Sinh viên - nền");
  var A = text("Cần:  " + can, F.B, 29, C.WHITE, 130, t + 50, { maxW: 820, name: "Cần" });
  fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  var B = text("Sinh viên:  " + sv, F.B, 27, "CBD5E1", 130, t + 100, { maxW: 820, name: "Sinh viên" });
  return t + h;
}
function mayHop(t, name, cfg) {
  var h = 112; var K = rect(98, t, 982, t + h, 28, C.GREEN_SOFT, "Máy hợp - nền");
  fx(K, { shadow: { op: 40, dist: 6, blur: 12 } });
  var A = text("Máy hợp: " + name, F.B, 31, C.INK, 540, 0, { align: Justification.CENTER, maxW: 840, name: "Máy hợp" });
  centerText(A, 540, t + 38);
  var B = text(cfg, F.B, 26, "1F5130", 540, 0, { align: Justification.CENTER, maxW: 840, name: "Cấu hình" });
  centerText(B, 540, t + 80);
  return t + h;
}
function nganhSlide(n, pillTxt, title, apps, img, can, sv, name, cfg, hook) {
  var d = newDoc("Nganh - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  var sb = headT(pillTxt, title, "");
  var cy = sb + 52; chips(cy, apps);
  var ft = cy + 52;
  shot(img, 884, 98, ft, 430, "Ảnh - " + name);
  var y = infoBox(ft + 430 + 22, can, sv);
  var bot = mayHop(y + 16, name, cfg);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " chips " + cy + " anh " + ft + " den " + bot + "\n";
  if (bot > HOOK_Y - 46) LOG += "  CANH BAO s" + n + ": sat cau moc\n";
  save5(d, n);
}
function sticker(str, cx, cy, ang, bgHex, txHex) {
  var T = text(str, F.B, 32, txHex, 540, 0, { align: Justification.CENTER, name: "Sticker - " + str });
  centerText(T, cx, cy); var b = bb(T);
  var R = rect(b[0] - 28, cy - 36, b[2] + 28, cy + 36, 18, bgHex, "Sticker nền - " + str);
  fx(R, { shadow: { op: 55, dist: 6, blur: 14 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  R.rotate(ang, AnchorPosition.MIDDLECENTER); T.rotate(ang, AnchorPosition.MIDDLECENTER);
  LOG += "sticker " + str + " " + Math.round(b[0] - 28) + "-" + Math.round(b[2] + 28) + "\n";
}
function t1() {
  var d = newDoc("Nganh - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  var A = text("NGÀNH BẠN", FS.T, 112, YEL, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 1" });
  centerText(A, 540, 250); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text("cài APP GÌ?", FS.T, 104, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 2" });
  centerText(B, 540, 358); fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  var S = text("App cần cài và laptop chạy nổi, theo từng ngành", FS.I, 38, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Mô tả" });
  centerText(S, 540, 446); fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } });
  placeAt(TN + "cv-app.png", 0, 500, "Ảnh - HP EliteBook mở Start menu");
  sticker("KẾ TOÁN · Excel, MISA", 300, 604, -5, C.WHITE, C.INK);
  sticker("IT · VS Code, Docker", 796, 662, 5, C.GREEN, C.WHITE);
  sticker("KIẾN TRÚC · AutoCAD, Revit", 296, 1046, 4, C.GREEN, C.WHITE);
  sticker("CƠ KHÍ · SolidWorks, CATIA", 784, 1150, -4, C.WHITE, C.INK);
  hookPill("Kế toán, văn phòng trước", HOOK_Y);
  save5(d, 1);
}
function t2() { nganhSlide(2, "NGÀNH 1 · KẾ TOÁN", "KẾ TOÁN,\rVĂN PHÒNG", ["Excel", "Word", "MISA", "HTKK", "Zalo"], "p-hp.png",
  "RAM 16GB, SSD, pin trâu", "Office 365 bản web miễn phí qua email trường", "HP EliteBook 1040 G10", "i7-1365U · 16GB · 512GB · 14 inch", "Dân IT cần gì khác?"); }
function t3() { nganhSlide(3, "NGÀNH 2 · IT", "IT, LẬP TRÌNH", ["VS Code", "Git", "Docker", "Android Studio"], "p-x13.png",
  "RAM 32GB chạy Docker, máy ảo Android mượt", "GitHub Student Pack, JetBrains miễn phí", "ThinkPad X13 Gen 3", "i7-1280P · 32GB · 1TB · 13.3 inch", "Vẽ bản vẽ thì cần gì?"); }
function t4() { nganhSlide(4, "NGÀNH 3 · KIẾN TRÚC", "KIẾN TRÚC,\rXÂY DỰNG", ["AutoCAD", "Revit", "SketchUp", "Enscape"], "p-dell.png",
  "card rời 8GB để xoay mô hình 3D, render", "AutoCAD, Revit có bản Education miễn phí", "Dell Precision 5570", "i7-12800H · RTX A2000 8GB · 16GB · 15.6 inch", "Cơ khí còn nặng hơn"); }
function t5() { nganhSlide(5, "NGÀNH 4 · CƠ KHÍ", "CƠ KHÍ", ["SolidWorks", "Inventor", "AutoCAD", "CATIA"], "p-p1.png",
  "card RTX A SolidWorks khuyên dùng, RAM 32GB", "Inventor có bản Education miễn phí", "ThinkPad P1 Gen 5", "i7-12800H · RTX A2000 8GB · 32GB · 16 inch", "Ngành bạn chưa có?"); }
function t6() {
  var d = newDoc("Nganh - 06 cuoi");
  placeAt(TN + "bg-6.png", 0, 0, "Nền");
  var L1 = text("Bạn học hoặc làm ngành gì,", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 960, name: "Hỏi 1" });
  centerText(L1, 540, 470); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("cài app gì?", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Hỏi 2" });
  centerText(L2, 540, 552); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L3 = text("COMMENT NGAY", FS.T, 88, YEL, 0, 0, { name: "Comment" });
  var b3 = bb(L3), w3 = b3[2] - b3[0] + 84;
  L3.translate(540 - w3 / 2 - b3[0], 0); centerY(L3, 664); b3 = bb(L3);
  fxGlow(L3, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  emojiC("👇", 64, b3[2] + 50, 660, "Chỉ xuống");
  var L4 = text("Poly chọn máy chạy nổi và báo giá", F.B, 34, C.GREEN_L, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Poly chọn máy" });
  centerText(L4, 540, 756); fx(L4, { shadow: { op: 70, dist: 2, blur: 6 } });
  var cy = 874;
  var T = text("+  Follow @polystorelaptop", F.B, 34, C.WHITE, 0, cy + 12, { name: "Follow - chữ" });
  var b2 = bb(T), w = b2[2] - b2[0]; T.translate(540 - w / 2 - b2[0], 0);
  var R = rect(540 - w / 2 - 38, cy - 38, 540 + w / 2 + 38, cy + 38, 38, C.GREEN, "Follow - nền");
  fx(R, { stroke: { hex: C.WHITE, size: 3 }, shadow: { op: 55, dist: 8, blur: 18 } });
  R.move(T, ElementPlacement.PLACEAFTER);
  save5(d, 6);
}
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
