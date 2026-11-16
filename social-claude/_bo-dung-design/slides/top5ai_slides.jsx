
// ================= SLIDES: TOP 5 LAPTOP CHẠY AI TẠI POLY (09/11) =================
// dạng báo giá nhiều máy (luật 2, 5): tiêu đề fen viết (17d), tên máy nghiêng, ảnh 884x450, giá nhỏ xanh, cấu hình + ý, ô xanh, câu móc
function fitW(T, maxW) { var b = bb(T), w = b[2] - b[0]; if (w > maxW) { var p = maxW / w * 100; T.resize(p, p, AnchorPosition.MIDDLECENTER); } }
var FH = 450;
function aiSlide(n, title, model, cfg, y, gia, xanh, hook) {
  var d = newDoc("Top5 AI - 0" + n);
  placeAt(TN + "bg-" + n + ".png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var nL = title.split("\r").length;
  var T = text(title, FS.T, 72, YEL, 540, 0, { align: Justification.CENTER, lead: 82, name: "Tiêu đề" });
  fitW(T, 860); centerText(T, 540, nL > 1 ? 272 : 250);
  fxGlow(T, { glow: { hex: YEL, op: 35, size: 24 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var S = text(model, FS.I, 36, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Tên máy" });
  centerText(S, 540, 394); fxGlow(S, { shadow: { op: 75, dist: 2, blur: 6 } });
  var pt = 440; // cố định để ảnh 5 slide thẳng hàng (agent thiết kế 09/11)
  shot("p-" + n + ".png", 884, 98, pt, FH, "Ảnh - " + model);
  // giá: khung trắng nhỏ, chữ xanh, nằm ngay mép dưới ảnh (không chữ "Giá")
  var gy = pt + FH;
  var GT = text(gia, F.B, 36, "16A34A", 540, 0, { align: Justification.CENTER, name: "Giá" });
  centerText(GT, 540, gy);
  var gb = bb(GT);
  var GR = rect(gb[0] - 28, gy - 31, gb[2] + 28, gy + 31, 20, C.WHITE, "Giá - nền");
  fx(GR, { shadow: { op: 50, dist: 4, blur: 10 } });
  GR.move(GT, ElementPlacement.PLACEAFTER);
  // thẻ kính: cấu hình trắng, ý cần biết vàng nhạt
  var gt = gy + 46, lhC = 46, lhY = 41, gh = 206;
  var dem = Math.round((gh - cfg.length * lhC - 10 - y.length * lhY) / 2);
  glass(98, gt, 982, gt + gh, 28, "Thông tin - nền");
  for (var i = 0; i < cfg.length; i++) {
    var A = text(cfg[i], F.B, 33, C.WHITE, 540, 0, { align: Justification.CENTER, name: "Cấu hình " + (i + 1) });
    fitW(A, 820); centerText(A, 540, gt + dem + lhC / 2 + i * lhC); fx(A, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  var y0 = gt + dem + cfg.length * lhC + 10;
  for (var j = 0; j < y.length; j++) {
    var B = text(y[j], F.B, 28, "FDE68A", 540, 0, { align: Justification.CENTER, name: "Ý " + (j + 1) });
    fitW(B, 820); centerText(B, 540, y0 + lhY / 2 + j * lhY); fx(B, { shadow: { op: 60, dist: 2, blur: 6 } });
  }
  // ô xanh
  var ky = gt + gh + 14, hh = xanh.indexOf("\r") >= 0 ? 100 : 70;
  var R = rect(98, ky, 982, ky + hh, 26, C.GREEN_SOFT, "Ô xanh - nền");
  fx(R, { shadow: { op: 40, dist: 6, blur: 12 } });
  var H = text(xanh, F.B, 28, C.INK, 540, 0, { align: Justification.CENTER, lead: 38, name: "Ô xanh" });
  fitW(H, 820); centerText(H, 540, ky + hh / 2);
  hookPill(hook, HOOK_Y);
  LOG += "s" + n + " tieu de " + bb(T).join(",") + " anh " + pt + "-" + (pt + FH) + " xanh den " + (ky + hh) + "\n";
  if (ky + hh > HOOK_Y - 36) LOG += "  CANH BAO s" + n + ": o xanh sat cau moc\n";
  save5(d, n);
}
// 1. BÌA (luật 17b, 17c, bố cục G Số to): Legion 7a Gen 11 (PSREF CT1_08) nghiêng -4°, số 5 vàng mờ phía sau, vệt sáng tím
// lớp ảnh: bia_lop.py "sang=600,1200,1000,380,hex=A855F7,op=0.42" "may=<bia-may.png>@590,880,880,xoay=-4,sang=A855F7" --kenh laptop --chu 500
$.evalFile(new File("E:/Social Claude/_bo-dung-design/code/bia-lib.jsx"));
function t1() {
  var d = newDoc("Top5 AI - 01 bia");
  placeAt(TN + "bg-thumb.png", 0, 0, "Nền");
  soTo("5", 240, 720, 640, 30, YEL); // bên trái, đuôi số sau thân máy (agent thiết kế 09/11)
  lopBia(TN + "bia-lop.png", "Ảnh bìa - Legion 7a 2026");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  var A = text("TOP 5 LAPTOP", FS.T, 96, YEL, 96, 292, { name: "Tiêu đề 1" }); fxGlow(A, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  // fen sửa 09/11: tiêu đề ngắn hơn (bỏ "TẠI POLY"), chữ AI màu trắng (từ khoá chủ đề)
  var B = text("CHẠY ", FS.T, 96, YEL, 96, 406, { name: "Tiêu đề 2" }); fxGlow(B, { glow: { hex: YEL, op: 42, size: 30 }, shadow: { op: 60, dist: 6, blur: 14 } });
  var B2 = text("AI", FS.T, 96, C.WHITE, bb(B)[2] - 27 + 12, 406, { name: "Tiêu đề 2 - AI trắng" }); fxGlow(B2, { glow: { hex: "FFFFFF", op: 30, size: 26 }, shadow: { op: 60, dist: 6, blur: 14 } });
  // fen sửa 09/11 lần 2: "tại Poly" chữ trắng nhỏ, cùng dòng sau chữ AI
  var B3 = text("tại Poly", FS.I, 48, C.WHITE, bb(B2)[2] - 26 + 18, 406, { name: "Tiêu đề 2 - tại Poly" }); fxGlow(B3, { shadow: { op: 75, dist: 3, blur: 8 } });
  LOG += "s1 AI " + bb(B2).join(",") + " taipoly " + bb(B3).join(",") + "\n";
  hookPill("Từ việc nhẹ tới nặng", HOOK_Y);
  LOG += "s1 tieu de " + bb(A).join(",") + " / " + bb(B).join(",") + "\n";
  save5(d, 1);
}
function t2() { aiSlide(2, "DELL XPS 13 LO VIỆC\rAI NHẸ HẰNG NGÀY", "Dell XPS 13 9350",
  ["Core Ultra 7 256V · NPU 47 TOPS", "Chuẩn Copilot+ PC"],
  ["Live Captions dịch hơn 40 thứ tiếng ra phụ đề tiếng Anh,", "xử lý bằng NPU ngay trên máy"], "24.800.000đ",
  "Hợp với bạn dùng ChatGPT, Copilot tóm tắt tài liệu,\rcần máy nhỏ mang đi", "Muốn tự chạy model AI offline?"); }
function t3() { aiSlide(3, "LEGION 7A 2026 CHẠY\rĐƯỢC AI OFFLINE", "Lenovo Legion 7a 2026",
  ["Ryzen AI 9 HX 470 · RTX 5060 8GB", "RAM 32GB"],
  ["8GB VRAM chạy mượt model 7B, 8B bản nén 4-bit", "bằng Ollama, LM Studio"], "58.000.000đ",
  "Hợp với bạn mới tập chạy AI offline,\rtạo ảnh Stable Diffusion", "Model to hơn thì cần máy nào?"); }
function t4() { aiSlide(4, "THINKPAD P1 GEN 6 CHẠY\rĐƯỢC MODEL 14B", "Lenovo ThinkPad P1 Gen 6",
  ["i7-13800H · RTX 4000 Ada 12GB", "RAM 32GB · màn 4K OLED"],
  ["12GB VRAM chứa vừa model 14B bản 4-bit", "(khoảng 9GB), còn dư khoảng 3GB cho đoạn chat"], "47.800.000đ",
  "Hợp với dân code dùng AI viết code offline,\rdữ liệu không ra ngoài", "Cần tạo ảnh AI thật nhanh?"); }
function t5() { aiSlide(5, "ROG STRIX G18 CÓ CARD\rMẠNH NHẤT KHO", "Asus ROG Strix G18 2024",
  ["i9-14900HX · RTX 4080 12GB", "Card chạy tới 175W"],
  ["RAM 16GB, máy có 2 khe RAM để nâng thêm"], "42.000.000đ",
  "Card mạnh nhất kho Poly, hợp tạo ảnh\rStable Diffusion, train LoRA", "Máy nào nhiều VRAM nhất?"); }
function t6() { aiSlide(6, "THINKPAD P1 GEN 4\rCÓ 16GB VRAM", "Lenovo ThinkPad P1 Gen 4",
  ["i9-11950H · RTX 3080 16GB", "Màn 4K"],
  ["16GB VRAM nhiều nhất kho Poly, chạy được gpt-oss-20b", "(OpenAI ghi chạy được trong 16GB bộ nhớ)"], "28.500.000đ",
  "Card đời cũ chậm hơn 4080,\rnhưng chứa được model to hơn", "Chọn máy theo việc AI bạn làm"); }
// 7. CUỐI (luật 16h): 1 thẻ kính câu Follow căn giữa slide, giữ đúng chữ fen
function t7() {
  var d = newDoc("Top5 AI - 07 cuoi");
  placeAt(TN + "bg-7.png", 0, 0, "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 100, 166, { track: 200, name: "Thương hiệu" });
  glass(98, 520, 982, 920, 36, "Thẻ Follow");
  var L1 = text("FOLLOW POLY", FS.T, 96, YEL, 540, 0, { align: Justification.CENTER, name: "Dòng 1" });
  fitW(L1, 840); centerText(L1, 540, 640); fxGlow(L1, { glow: { hex: YEL, op: 40, size: 26 }, shadow: { op: 60, dist: 5, blur: 12 } });
  var L2 = text("để chọn đúng laptop\rcho việc AI bạn làm", FS.I, 52, C.WHITE, 540, 0, { align: Justification.CENTER, lead: 66, name: "Dòng 2" });
  fitW(L2, 820); centerText(L2, 540, 790); fxGlow(L2, { shadow: { op: 75, dist: 3, blur: 8 } });
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
