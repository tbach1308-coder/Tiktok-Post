// ================= BÌA MẪU SÁNG TẠO (29/10, thử thư viện bia-lib.jsx + prep/bia_lop.py) =================
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function brand() { text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" }); }
function tieuDeGiua(l1, l2, sub) {
  var A = text(l1, FS.T, 112, YEL, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 1" });
  centerText(A, 540, 250); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text(l2, FS.T, 104, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Tiêu đề 2" });
  centerText(B, 540, 358); fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  if (sub) { var S = text(sub, FS.I, 44, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 940, name: "Mô tả" }); centerText(S, 540, 446); fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } }); }
}
function tieuDeTrai(l1, l2, sub) {
  var A = text(l1, FS.T, 118, YEL, 96, 300, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B = text(l2, FS.T, 106, C.WHITE, 96, 410, { name: "Tiêu đề 2" }); fxGlow(B, { shadow: { op: 70, dist: 4, blur: 10 } });
  if (sub) { var S = text(sub, FS.I, 44, C.WHITE, 100, 472, { name: "Mô tả" }); fxGlow(S, { shadow: { op: 75, dist: 3, blur: 8 } }); }
}
// 1. Đối đầu VS: 2 máy cùng cỡ, nghiêng nhẹ vào nhau, vệt sáng 2 màu (xanh dương máy trạm, đỏ gaming)
function t1() {
  var d = newDoc("Bia mau A - doi dau");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-A.png", "Ảnh bìa - 2 máy");
  brand(); tieuDeGiua("MÁY TRẠM", "HAY GAMING?", "Dân kỹ thuật chọn sao");
  vsBadge(540, 806, 66, -8);
  sticker("MÁY TRẠM", 270, 1112, -4, "xanhduong", 34);
  sticker("GAMING", 812, 1112, 4, "do", 34);
  hookPill("Đừng mua nhầm card", HOOK_Y);
  save5(d, 1);
}
// 2. Hero tràn: 1 máy rất to, nghiêng, tràn mép phải; tiêu đề căn trái; sticker chỉ vào ý chính
function t2() {
  var d = newDoc("Bia mau B - hero");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-B.png", "Ảnh bìa - ASUS TUF");
  brand(); tieuDeTrai("MÁY TRẠM", "HAY GAMING?");
  sticker("RTX A hay GeForce?", 330, 1182, -6, "trang", 34);
  hookPill("Đừng mua nhầm card", HOOK_Y);
  save5(d, 2);
}
// 3. Cận chi tiết: đúng thứ quyết định (card đồ hoạ) to, nghiêng; sticker xanh nói ý
function t3() {
  var d = newDoc("Bia mau C - can chi tiet");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  lopBia(TN + "bia-C.png", "Ảnh bìa - card");
  brand(); tieuDeGiua("MÁY TRẠM", "HAY GAMING?");
  sticker("Khác nhau ở CARD", 770, 560, 6, "xanh", 36);
  hookPill("Đừng mua nhầm card", HOOK_Y);
  save5(d, 3);
}

// 4. SLIDE CUỐI kiểu mới (30/10): 2 thẻ kính bằng nhau, trên = câu hỏi chọn + gọi comment, dưới = khoiFollow (lợi ích + nút to + mũi tên chỉ avatar)
function t4() {
  var d = newDoc("Cuoi mau - follow + comment");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 150, { track: 200, name: "Thương hiệu" });
  glass(98, 250, 982, 650, 36, "Thẻ comment");
  var L1 = text("BẠN CHỌN", FS.I, 60, C.WHITE, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 1" });
  centerText(L1, 540, 352); fxGlow(L1, { shadow: { op: 75, dist: 3, blur: 8 } });
  var L2 = text("MÁY TRẠM HAY GAMING?", FS.T, 66, YEL, 540, 0, { align: Justification.CENTER, maxW: 860, name: "Dòng 2" });
  centerText(L2, 540, 450); fxGlow(L2, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L4 = text("Comment, Poly chọn máy giúp", F.B, 38, C.GREEN_L, 0, 0, { name: "Comment" });
  var b4 = bb(L4), w4 = b4[2] - b4[0] + 70;
  L4.translate(540 - w4 / 2 - b4[0], 0); centerText(L4, 540 - 35, 556); b4 = bb(L4);
  fx(L4, { shadow: { op: 70, dist: 2, blur: 6 } });
  emojiC("👇", 50, b4[2] + 40, 552, "Chỉ xuống");
  glass(98, 760, 982, 1160, 36, "Thẻ follow");
  khoiFollow("@polystorelaptop", "Follow để chọn laptop đúng tiền", 960);
  save5(d, 4);
}

var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1, 2, 3, 4];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1, t2, t3, t4];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 4; k++) if (want(k)) {
    try { FN[k](); LOG += "0" + k + " ok\n"; } catch (e1) { LOG += "LOI 0" + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
