// Thu GIAY TRANG (fen 27/11 20h25 "cho nền nằm trên tờ giấy trắng" -> chon "Tờ giấy trên nền tối" + "Thử bài này trước")
// tren bai T11_SinhVienDungMuaiPadDat_27-11 (ban v3, bo cuc sinh dong), slide 2-6. Ra thu muc thu, khong dung bai goc.
// Nen anh mo toi giu o vien; 1 to giay trang (to duoi nghieng nhe lo goc + bang keo goc phai) giua slide;
// tieu de, anh, the nam tren giay, chu navy; nhan xanh gai mep tren giay; cau moc o duoi giay (tren nen toi) nhu cu.
// Ham trung ten trong thu vien (headTrai, glass, bcThe, bcHang, bcCot, bcSo, bcAnh, bcAnhTron) khai lai o day -> ban nay thang (chi file thu).
var NB = "tai-ve-27-11/svdat/goc/";
var PILL = "SINH VIÊN CHỌN iPAD";

var GIAY = { l: 56, t: 170, r: 1024, b: 1208 };
var CHU = NAVY, CHU2 = "334155", XANH_D = "15803D";
BODY_BOT = GIAY.b - 36;

// vien the tren giay: xanh nhat / vang nhat kho thay tren nen trang -> dam hon 1 bac
function vienGiay(h) { if (h == C.GREEN_L) return C.GREEN; if (h == YEL2) return "EAB308"; return h; }
function bangKeo(cx, cy, w, rot, name) {
  var K = rect(cx - w / 2, cy - 22, cx + w / 2, cy + 22, 3, "F2E6B6", name || "Băng keo");
  K.fillOpacity = 82;
  fx(K, { shadow: { op: 18, dist: 2, blur: 4 } });
  if (rot) K.rotate(rot, AnchorPosition.MIDDLECENTER);
  return K;
}
// to giay: to duoi xam nhat nghieng 1.8 do (lo goc) + to tren trang, van giay rat nhe, bang keo goc phai tren
function giayTrang() {
  var S = rect(GIAY.l + 8, GIAY.t + 8, GIAY.r - 8, GIAY.b, 8, "E7E3DA", "Giấy - tờ dưới");
  S.rotate(1.8, AnchorPosition.MIDDLECENTER);
  fx(S, { shadow: { op: 50, dist: 12, blur: 34 } });
  var P = rect(GIAY.l, GIAY.t, GIAY.r, GIAY.b, 8, "FBFAF7", "Giấy trắng");
  try {
    P.rasterize(RasterizeType.ENTIRELAYER);
    app.activeDocument.activeLayer = P;
    P.applyAddNoise(1.5, NoiseDistribution.GAUSSIAN, true);
  } catch (e) { RUN += "   (van giay: " + e.message + ")\n"; }
  fx(P, { shadow: { op: 35, dist: 4, blur: 14 } });
  bangKeo(GIAY.r - 34, GIAY.t + 2, 170, 38, "Băng keo - góc giấy");
}

// dau trang can trai tren giay
function headTrai(n, bg, pillTxt, lines, sub, o) {
  o = o || {};
  var d = newDoc("Slide 0" + n);
  if (bg) bgPhoto(bg[0], bg[1], bg[2], bg[3], bg[4], o.mo || 22, o.toi || 64);
  text("POLY STORE", F.B, 22, C.WHITE, BC_L, 112, { track: 200, name: "Thương hiệu" });
  giayTrang();
  if (pillTxt) pill(pillTxt, BC_L, GIAY.t, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var maxW = o.maxW || (BC_R - BC_L), mw = 0, i, T;
  for (i = 0; i < lines.length; i++) { T = text(lines[i], F.T, 84, CHU, BC_L, 300, { name: "đo" }); var b0 = bb(T); mw = Math.max(mw, b0[2] - b0[0]); T.remove(); }
  var ts = Math.max(72, Math.min(o.co || 96, Math.floor(84 * (maxW - 10) / mw)));
  var y = 300, bot = 0;
  for (i = 0; i < lines.length; i++) {
    T = text(lines[i], F.T, ts, o.mau && o.mau[i] ? o.mau[i] : CHU, BC_L, y, { maxW: maxW, name: "Tiêu đề " + (i + 1) });
    var bt = bb(T); T.translate(BC_L - bt[0], 0);
    bot = bb(T)[3]; y += Math.round(ts * 1.12);
  }
  if (sub) { var S = text(sub, F.B, 31, CHU2, BC_L, bot + 52, { maxW: maxW, name: "Phụ đề" }); bot = bb(S)[3]; }
  BODY_TOP2 = bot + 44; TOP0 = BODY_TOP2;
  RUN += "0" + n + " giay trang, dau trang can trai, tieu de co " + ts + "\n";
  return d;
}
// dau trang can giua tren giay
function headGiua(n, bg, lines) {
  var d = newDoc("Slide 0" + n);
  bgPhoto(bg[0], bg[1], bg[2], bg[3], bg[4], 22, 64);
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  giayTrang();
  pillC(PILL, CXc, GIAY.t, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var mw = 0, i, T;
  for (i = 0; i < lines.length; i++) { T = text(lines[i], F.T, 84, CHU, CXc, 300, { align: Justification.CENTER, name: "đo" }); var b = bb(T); mw = Math.max(mw, b[2] - b[0]); T.remove(); }
  var ts = Math.max(84, Math.min(92, Math.floor(84 * 840 / mw))), y = 300, bot = 0;
  for (i = 0; i < lines.length; i++) {
    T = text(lines[i], F.T, ts, CHU, CXc, y, { align: Justification.CENTER, maxW: 884, name: "Tiêu đề " + (i + 1) });
    bot = bb(T)[3]; y += Math.round(ts * 1.12);
  }
  BODY_TOP2 = bot + 44; TOP0 = BODY_TOP2;
  RUN += "0" + n + " giay trang, dau trang can giua, tieu de co " + ts + "\n";
  return d;
}
// the tren giay: nen xam rat nhat, vien mau, khong bong
function glass(l, t, r, b, rad, name) { return rect(l, t, r, b, rad, "F0F2EE", name); }
function bcThe(o) {
  var l = o.l == null ? LX : o.l, r = o.r == null ? RX : o.r, t = o.t == null ? TOP0 : o.t, co = o.co || 31;
  var ls = [], pad = 40, cy = t + 70, bot = t, Lb = null;
  if (o.nhan && o.nhanKieu != "pill") cy = t + 112;
  if (o.nhan && o.nhanKieu != "pill") { Lb = text(o.nhan, F.B, 26, XANH_D, (l + r) / 2, t + 50, { align: Justification.CENTER, track: 60, name: "Nhãn - " + o.nhan }); ls.push(Lb); }
  for (var i = 0; i < o.y.length; i++) {
    ls = ls.concat(dotIcon(o.y[i][0], l + pad + 22, cy, 22));
    var T = text(o.y[i][1], F.B, co, CHU, l + pad + 66, cy + 11, { maxW: r - l - pad * 2 - 70, name: "Ý " + (i + 1) });
    ls.push(T);
    var b = bb(T); bot = Math.max(cy + 24, b[3]); cy = Math.max(cy + 74, b[3] + 44);
  }
  var G = glass(l, t, r, bot + 38, 26, "Thẻ - " + (o.nhan || "ý"));
  fx(G, { stroke: { hex: vienGiay(o.mauVien || C.GREEN_L), size: 3, inside: true } });
  G.move(ls[0], ElementPlacement.PLACEAFTER);
  ls.unshift(G);
  if (o.nhan && o.nhanKieu == "pill") {
    var cx = (l + r) / 2, Tp = text(o.nhan, F.B, 26, C.WHITE, 0, t + 9, { track: 40, name: "Nhãn thẻ - " + o.nhan + " - chữ" });
    var bp = bb(Tp), wp = bp[2] - bp[0];
    Tp.translate(cx - wp / 2 - bp[0], t - (bp[1] + bp[3]) / 2);
    var P = rect(cx - wp / 2 - 26, t - 26, cx + wp / 2 + 26, t + 26, 26, C.GREEN, "Nhãn thẻ - " + o.nhan);
    P.move(Tp, ElementPlacement.PLACEAFTER);
    ls.push(P); ls.push(Tp);
  }
  return blk(ls, G);
}
function bcHang(o) {
  var l = o.l == null ? BC_L : o.l, r = o.r == null ? BC_R : o.r, t = o.t == null ? TOP0 : o.t, ls = [], x = l + 104, y = t + 30;
  if (o.nhan) { var Ln = text(o.nhan, F.B, 24, XANH_D, x, y + 24, { track: 60, maxW: r - x - 30, name: "Hàng - nhãn - " + o.nhan }); ls.push(Ln); y = bb(Ln)[3] + 14; }
  var Tc = text(o.chinh, F.T, 46, CHU, x, y + 44, { maxW: r - x - 30, name: "Hàng - chính - " + o.chinh });
  var bc = bb(Tc); Tc.translate(0, y - bc[1]); ls.push(Tc); y = bb(Tc)[3];
  if (o.phu) { var Tp = text(o.phu, F.B, 29, CHU2, x, y + 44, { maxW: r - x - 30, name: "Hàng - phụ" }); var bp = bb(Tp); Tp.translate(0, y + 12 - bp[1]); ls.push(Tp); y = bb(Tp)[3]; }
  var G = glass(l, t, r, y + 30, 26, "Hàng - thẻ");
  var vh = AMBER;
  if (o.kind == "check") vh = C.GREEN; else if (o.kind == "x") vh = RED;
  fx(G, { stroke: { hex: vh, size: 3, inside: true } });
  G.move(ls[0], ElementPlacement.PLACEAFTER);
  ls = [G].concat(ls).concat(dotIcon(o.kind || "check", l + 54, (t + y + 30) / 2, 28));
  return blk(ls, G);
}
function bcCot(o) {
  var l = o.l, r = o.r, t = o.t == null ? TOP0 : o.t, co = o.co || 30, pad = 30, ls = [];
  var Tn = text(o.ten, F.T, 54, o.mau || CHU, (l + r) / 2, t + 80, { align: Justification.CENTER, maxW: r - l - 40, name: "Cột - " + o.ten });
  fx(Tn, { stroke: { hex: NAVY, size: 6 }, shadow: { op: 25, dist: 5, blur: 3 } });
  var bt = bb(Tn); Tn.translate(0, t + 34 - bt[1]); ls.push(Tn);
  var cy = bb(Tn)[3] + 50, bot = cy;
  for (var i = 0; i < o.y.length; i++) {
    ls = ls.concat(dotIcon(o.y[i][0], l + pad + 18, cy, 18));
    var T = text(o.y[i][1], F.B, co, CHU, l + pad + 50, cy + 10, { maxW: r - l - pad * 2 - 52, name: "Cột " + o.ten + " - ý " + (i + 1) });
    ls.push(T); var b = bb(T); bot = Math.max(cy + 20, b[3]); cy = Math.max(cy + 64, b[3] + 38);
  }
  var G = glass(l, t, r, Math.max(bot + 36, o.cao ? t + o.cao : 0), 26, "Cột - thẻ - " + o.ten);
  fx(G, { stroke: { hex: vienGiay(o.vien || o.mau || C.GREEN_L), size: 3, inside: true } });
  G.move(ls[0], ElementPlacement.PLACEAFTER);
  return blk([G].concat(ls), G);
}
// chu to tren giay: vien navy, bong in lech nhe (khong quang toi)
function bcSo(str, x, y, o) {
  o = o || {};
  var co = o.co || 200, can = o.can || "trai";
  var T = text(str, F.T, co, o.mau || C.GREEN_L, 0, y, { name: "Chữ to - " + str.replace(/\r/g, " ") });
  var b = bb(T), dx = x - b[0];
  if (can == "giua") dx = x - (b[0] + b[2]) / 2; else if (can == "phai") dx = x - b[2];
  T.translate(dx, y - b[1]);
  // chu navy tren giay: khong vien navy (vien cung mau lam dinh net chu, thu 1 "LA DU" bi bet)
  if ((o.mau || C.GREEN_L) == CHU) fx(T, { shadow: { op: 22, dist: 6, blur: 3 } });
  else fx(T, { stroke: { hex: NAVY, size: Math.max(8, Math.round(co / 18)) }, shadow: { op: 28, dist: 8, blur: 4 } });
  if (o.xoay) T.rotate(o.xoay, AnchorPosition.MIDDLECENTER);
  return blk([T], T);
}
function bcAnh(file, l, t, r, b, rad, name, o) {
  o = o || {};
  var v = o.vien || 0;
  var Fr = rect(l - v, t - v, r + v, b + v, rad + (v ? Math.round(v / 2) : 0), v ? C.WHITE : C.BLACK, name + " - khung");
  fx(Fr, { shadow: { op: 38, dist: 10, blur: 22 } });
  var L = bcPhu(file, name, l, t, r, b, bcBoGoc(l, t, r, b, rad), o.tam);
  if (o.xoay) {
    L.rasterize(RasterizeType.ENTIRELAYER);
    app.activeDocument.activeLayer = L;
    try { applyMask(); } catch (e) {}
    Fr.rotate(o.xoay, AnchorPosition.MIDDLECENTER);
    L.rotate(o.xoay, AnchorPosition.MIDDLECENTER);
  }
  return blk([Fr, L], Fr);
}
function bcAnhTron(file, cx, cy, r, name, o) {
  o = o || {};
  var v = o.vien == null ? 8 : o.vien;
  var Fr = oval(cx - r - v, cy - r - v, cx + r + v, cy + r + v, C.WHITE, name + " - viền");
  fx(Fr, { stroke: { hex: "DADCD6", size: 2, inside: true }, shadow: { op: 38, dist: 10, blur: 22 } });
  var L = bcPhu(file, name, cx - r, cy - r, cx + r, cy + r, bcTron(cx, cy, r), o.tam);
  return blk([Fr, L], Fr);
}

// ===== SLIDE 2 - so sanh 2 cot + VS =====
if (want(2)) {
  var d2 = headTrai(2, [NB + "pex-16150336.jpg", 2000, 400, 600, 1200], PILL, ["iPAD PRO ĐẮT", "HƠN Ở ĐÂU"]);
  var A2 = bcAnh("s2-oled.png", BC_L, TOP0, BC_R, TOP0 + 330, 30, "Ảnh - màn OLED iPad Pro M5 (apple.com)");
  var C2 = bcHaiCot({ l: BC_L, r: 522, t: TOP0 + 400, ten: "PRO M5", mau: YEL2, vien: YEL2, y: [["bang", "Màn OLED 120Hz"], ["bang", "Face ID"], ["bang", "Thunderbolt"]] },
                    { l: 558, r: BC_R, t: TOP0 + 400, ten: "AIR", mau: C.GREEN_L, y: [["check", "Màn LCD 60Hz"], ["check", "Ghi chú, đọc PDF\rvẫn đủ nét"]] });
  var B2 = [A2, bcGop(C2)];
  hook("Chip yếu hơn có lag không?");
  RUN += "02 so sanh 2 cot: " + bodyFit(B2, 70) + "px\n";
  var ua = blkBox(A2), uc = blkBox(B2[1]);
  bcVs(CXc, Math.round((ua.b + uc.t) / 2 + 6), 54);
  RUN += "02 day noi dung: " + Math.round(uc.b) + " (giay " + GIAY.b + ")\n";
  save(d2, 2); d2.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 3 - chia doi: anh dan nghieng (bang keo) trai, chu to M1 phai =====
if (want(3)) {
  var d3 = headGiua(3, [NB + "pex-5212666.jpg", 2000, 500, 0, 1000], ["CHIP M1 VẪN ĐỦ", "CHO VIỆC HỌC"]);
  var t3 = TOP0 + 20;
  var A3 = bcAnh("s3-ghichu.png", 120, t3 + 10, 500, t3 + 540, 16, "Ảnh - iPad Air ghi chú (apple.com)", { vien: 14, xoay: -4, tam: [0.27, 0.5] });
  var K3 = bangKeo(310, t3 - 6, 150, 4, "Băng keo - ảnh");
  var xR = 560;
  pill("iPAD AIR 5", xR, t3 + 30, 26, C.WHITE, C.GREEN, 24, 54, F.B, 40, "Nhãn máy");
  var dd = app.activeDocument, Pn = [dd.artLayers.getByName("Nhãn máy"), dd.artLayers.getByName("Nhãn máy - chữ")];
  var S3 = bcSo("M1", xR - 6, t3 + 80, { co: 230, mau: C.GREEN_L });
  var R3 = text("RAM 8GB", F.T, 64, CHU, xR, 0, { name: "RAM 8GB" });
  var bs = blkBox(S3), br = bb(R3); R3.translate(xR - br[0], bs.b + 20 - br[1]);
  TOP0 = bb(R3)[3] + 36;
  var T3 = bcThe({ l: xR, r: BC_R, y: [["check", "Có Apple\rIntelligence"], ["check", "Chia đôi màn: xem\rbài giảng + ghi chú"]], co: 29 });
  var B3 = [bcGop([A3, blk([K3]), blk(Pn), S3, blk([R3]), T3])];
  hook("Còn cây bút thì sao?");
  RUN += "03 chia doi: " + bodyFit(B3, 60) + "px, day " + Math.round(blkBox(B3[0]).b) + "\n";
  save(d3, 3); d3.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 4 - may nghieng + 2 the but nhan gai mep (may nho hon 1 chut cho vua giay) =====
if (want(4)) {
  var d4 = headTrai(4, [NB + "pex-5905701.jpg", 2000, 600, 0, 1000], PILL, ["KHÔNG CẦN BÚT", "ĐẮT NHẤT"]);
  var M4 = placeAt("s4-air-but.png", "Ảnh - iPad Air, bút hít cạnh trên (apple.com)", CXc + 30, TOP0 + 176, 520);
  M4.rotate(-6, AnchorPosition.MIDDLECENTER);
  fx(M4, { shadow: { op: 40, dist: 14, blur: 28 } });
  var yT = bb(M4)[3] + 50;
  var TL = bcThe({ l: BC_L, r: 522, t: yT, nhan: "PENCIL 2", nhanKieu: "pill", y: [["check", "Air 5 dùng được"], ["check", "Có lực nhấn, hít\rnam châm là sạc"]], co: 29 });
  var TR = bcThe({ l: 558, r: BC_R, t: yT, nhan: "PENCIL PRO", nhanKieu: "pill", mauVien: YEL2, y: [["bang", "Chỉ chạy với Air M2,\rPro M4 trở lên và\rmini A17 Pro"]], co: 29 });
  var B4 = [blk([M4], M4), bcGop([TL, TR])];
  hook("Bản 5G có đáng thêm tiền?");
  RUN += "04 may nghieng + 2 the: " + bodyFit(B4, 50) + "px, day " + Math.round(blkBox(B4[1]).b) + "\n";
  save(d4, 4); d4.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 5 - chu rat to WIFI + anh tron =====
if (want(5)) {
  var d5 = headGiua(5, [NB + "pex-7013900.jpg", 2000, 500, 0, 1000], ["SINH VIÊN ÍT KHI", "CẦN BẢN 5G"]);
  var t5 = TOP0 + 10;
  var W5 = bcSo("WIFI", BC_L + 4, t5 + 30, { co: 200, mau: C.GREEN_L, xoay: -4 });
  var w5 = blkBox(W5);
  var L5 = bcSo("LÀ ĐỦ", BC_L + 24, w5.b + 4, { co: 100, mau: CHU, xoay: -4 });
  var O5 = bcAnhTron("s5-ipad-dt.png", 790, t5 + 180, 180, "Ảnh - iPad và điện thoại (Pexels 377718)", { tam: [0.62, 0.55] });
  TOP0 = Math.max(blkBox(L5).b, blkBox(O5).b) + 44;
  var T5 = bcThe({ l: BC_L, r: BC_R, y: [["bang", "Bản 5G thường đắt hơn Wifi cùng dung lượng"], ["check", "Ra ngoài phát mạng từ điện thoại là xài được"]], co: 30 });
  var B5 = [bcGop([W5, L5, O5]), T5];
  hook("Vậy ngành nào mới cần máy mạnh?");
  RUN += "05 chu to + anh tron: " + bodyFit(B5, 60) + "px, day " + Math.round(blkBox(T5).b) + "\n";
  save(d5, 5); d5.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 6 - hang the + anh may goc phai =====
if (want(6)) {
  var d6 = headTrai(6, [NB + "pex-8199167.jpg", 2000, 300, 800, 1400], PILL, ["NGÀNH NÀO", "LẤY MÁY NÀO"], null, { maxW: 520 });
  var M6 = placeAt("s6-3may.png", "Ảnh - các dòng iPad (apple.com)", 846, 318, 350);
  M6.rotate(5, AnchorPosition.MIDDLECENTER);
  fx(M6, { shadow: { op: 40, dist: 10, blur: 24 } });
  TOP0 = Math.max(TOP0, bb(M6)[3] + 34); BODY_TOP2 = TOP0;
  var H1 = bcHang({ t: TOP0, kind: "check", nhan: "KINH TẾ · LUẬT · NGÔN NGỮ", chinh: "Air 5 M1 256GB", phu: "Học, ghi chú, làm slide" });
  var H2 = bcHang({ t: blkBox(H1).b + 18, kind: "check", nhan: "VẼ PROCREATE NHIỀU", chinh: "Air M3 / M4 11 inch", phu: "Cần Pencil Pro" });
  var H3 = bcHang({ t: blkBox(H2).b + 18, kind: "bang", nhan: "THIẾT KẾ · DỰNG VIDEO NẶNG", chinh: "iPad Pro", phu: "Chỉ khi học thiết kế, dựng video nặng" });
  var B6 = [bcGop([H1, H2, H3])];
  hook("Lưu lại để đi mua đỡ tốn");
  RUN += "06 hang the: " + bodyFit(B6, 60) + "px, day " + Math.round(blkBox(B6[0]).b) + "\n";
  save(d6, 6); d6.close(SaveOptions.DONOTSAVECHANGES);
}

ketThuc("thu-giay-trang.log");
