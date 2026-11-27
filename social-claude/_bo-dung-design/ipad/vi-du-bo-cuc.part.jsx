// Mau bo cuc trang trong sinh dong (fen 27/11 19h23 "Moi slide 1 bo cuc khac"), bai T11_SinhVienDungMuaiPadDat_27-11 slide 2-6:
// 2 = A so sanh 2 cot + VS, 3 = B chia doi + chu to, 4 = C may nghieng + 2 the nhan gai, 5 = D chu rat to + anh tron, 6 = E hang the. Doc ipad/BO-CUC.md.
var NB = "tai-ve-27-11/svdat/goc/";
var PILL = "SINH VIÊN CHỌN iPAD";
BODY_BOT = 1266 - 34 - 48;

// dau trang can giua (nhu bai goc)
function headGiua(n, bg, lines) {
  var d = newDoc("Slide 0" + n);
  bgPhoto(bg[0], bg[1], bg[2], bg[3], bg[4], 22, 64);
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  pillC(PILL, CXc, 158, 26, C.WHITE, C.GREEN, 26, 56, F.B, 40, "Nhãn");
  var mw = 0, i, T;
  for (i = 0; i < lines.length; i++) { T = text(lines[i], F.T, 84, C.WHITE, CXc, 290, { align: Justification.CENTER, name: "đo" }); var b = bb(T); mw = Math.max(mw, b[2] - b[0]); T.remove(); }
  var ts = Math.max(84, Math.min(92, Math.floor(84 * 840 / mw))), y = 290, bot = 0;
  for (i = 0; i < lines.length; i++) {
    T = text(lines[i], F.T, ts, C.WHITE, CXc, y, { align: Justification.CENTER, maxW: 884, name: "Tiêu đề " + (i + 1) });
    fx(T, { stroke: { hex: NAVY, size: 9 }, shadow: { op: 52, dist: 0, blur: 30 } });
    bot = bb(T)[3]; y += Math.round(ts * 1.12);
  }
  BODY_TOP2 = bot + 44; TOP0 = BODY_TOP2;
  return d;
}

// ===== SLIDE 2 - so sanh 2 cot + VS (dau trang can trai, anh ngang tran le) =====
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
  save(d2, 2); d2.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 3 - chia doi: anh dan nghieng trai, chu to M1 phai =====
if (want(3)) {
  var d3 = headGiua(3, [NB + "pex-5212666.jpg", 2000, 500, 0, 1000], ["CHIP M1 VẪN ĐỦ", "CHO VIỆC HỌC"]);
  var t3 = TOP0 + 20;
  var A3 = bcAnh("s3-ghichu.png", 120, t3 + 10, 500, t3 + 540, 16, "Ảnh - iPad Air ghi chú (apple.com)", { vien: 14, xoay: -4, tam: [0.27, 0.5] });
  var xR = 560;
  pill("iPAD AIR 5", xR, t3 + 30, 26, C.WHITE, C.GREEN, 24, 54, F.B, 40, "Nhãn máy");
  var dd = app.activeDocument, Pn = [dd.artLayers.getByName("Nhãn máy"), dd.artLayers.getByName("Nhãn máy - chữ")];
  var S3 = bcSo("M1", xR - 6, t3 + 80, { co: 230, mau: C.GREEN_L });
  var R3 = text("RAM 8GB", F.T, 64, C.WHITE, xR, 0, { name: "RAM 8GB" });
  var bs = blkBox(S3), br = bb(R3); R3.translate(xR - br[0], bs.b + 20 - br[1]);
  fx(R3, { stroke: { hex: NAVY, size: 7 }, shadow: { op: 52, dist: 0, blur: 20 } });
  TOP0 = bb(R3)[3] + 36;
  var T3 = bcThe({ l: xR, r: BC_R, y: [["check", "Có Apple\rIntelligence"], ["check", "Chia đôi màn: xem\rbài giảng + ghi chú"]], co: 29 });
  var B3 = [bcGop([A3, blk(Pn), S3, blk([R3]), T3])];
  hook("Còn cây bút thì sao?");
  RUN += "03 chia doi: " + bodyFit(B3, 60) + "px\n";
  save(d3, 3); d3.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 4 - may nghieng to + 2 the but nhan gai mep =====
if (want(4)) {
  var d4 = headTrai(4, [NB + "pex-5905701.jpg", 2000, 600, 0, 1000], PILL, ["KHÔNG CẦN BÚT", "ĐẮT NHẤT"]);
  var M4 = placeAt("s4-air-but.png", "Ảnh - iPad Air, bút hít cạnh trên (apple.com)", CXc + 30, TOP0 + 200, 600);
  M4.rotate(-6, AnchorPosition.MIDDLECENTER);
  fx(M4, { shadow: { op: 58, dist: 16, blur: 34 } });
  var yT = bb(M4)[3] + 50;
  var TL = bcThe({ l: BC_L, r: 522, t: yT, nhan: "PENCIL 2", nhanKieu: "pill", y: [["check", "Air 5 dùng được"], ["check", "Có lực nhấn, hít\rnam châm là sạc"]], co: 29 });
  var TR = bcThe({ l: 558, r: BC_R, t: yT, nhan: "PENCIL PRO", nhanKieu: "pill", mauVien: YEL2, y: [["bang", "Chỉ chạy với Air M2,\rPro M4 trở lên và\rmini A17 Pro"]], co: 29 });
  var B4 = [blk([M4], M4), bcGop([TL, TR])];
  hook("Bản 5G có đáng thêm tiền?");
  RUN += "04 may nghieng + 2 the: " + bodyFit(B4, 50) + "px\n";
  save(d4, 4); d4.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 5 - chu rat to WIFI + anh tron =====
if (want(5)) {
  var d5 = headGiua(5, [NB + "pex-7013900.jpg", 2000, 500, 0, 1000], ["SINH VIÊN ÍT KHI", "CẦN BẢN 5G"]);
  var t5 = TOP0 + 10;
  var W5 = bcSo("WIFI", BC_L + 4, t5 + 30, { co: 200, mau: C.GREEN_L, xoay: -4 });
  var w5 = blkBox(W5);
  var L5 = bcSo("LÀ ĐỦ", BC_L + 24, w5.b + 4, { co: 100, mau: C.WHITE, xoay: -4 });
  var O5 = bcAnhTron("s5-ipad-dt.png", 790, t5 + 180, 180, "Ảnh - iPad và điện thoại (Pexels 377718)", { tam: [0.62, 0.55] });
  TOP0 = Math.max(blkBox(L5).b, blkBox(O5).b) + 44;
  var T5 = bcThe({ l: BC_L, r: BC_R, y: [["bang", "Bản 5G thường đắt hơn Wifi cùng dung lượng"], ["check", "Ra ngoài phát mạng từ điện thoại là xài được"]], co: 30 });
  var B5 = [bcGop([W5, L5, O5]), T5];
  hook("Vậy ngành nào mới cần máy mạnh?");
  RUN += "05 chu to + anh tron: " + bodyFit(B5, 60) + "px\n";
  save(d5, 5); d5.close(SaveOptions.DONOTSAVECHANGES);
}

// ===== SLIDE 6 - hang the (moi nganh 1 the) + anh may goc phai dau trang =====
if (want(6)) {
  var d6 = headTrai(6, [NB + "pex-8199167.jpg", 2000, 300, 800, 1400], PILL, ["NGÀNH NÀO", "LẤY MÁY NÀO"], null, { maxW: 520 });
  var M6 = placeAt("s6-3may.png", "Ảnh - các dòng iPad (apple.com)", 846, 318, 350);
  M6.rotate(5, AnchorPosition.MIDDLECENTER);
  fx(M6, { shadow: { op: 55, dist: 12, blur: 30 } });
  TOP0 = Math.max(TOP0, bb(M6)[3] + 34); BODY_TOP2 = TOP0;
  var H1 = bcHang({ t: TOP0, kind: "check", nhan: "KINH TẾ · LUẬT · NGÔN NGỮ", chinh: "Air 5 M1 256GB", phu: "Học, ghi chú, làm slide" });
  var H2 = bcHang({ t: blkBox(H1).b + 22, kind: "check", nhan: "VẼ PROCREATE NHIỀU", chinh: "Air M3 / M4 11 inch", phu: "Cần Pencil Pro" });
  var H3 = bcHang({ t: blkBox(H2).b + 22, kind: "bang", nhan: "THIẾT KẾ · DỰNG VIDEO NẶNG", chinh: "iPad Pro", phu: "Chỉ khi học thiết kế, dựng video nặng" });
  var B6 = [bcGop([H1, H2, H3])];
  hook("Lưu lại để đi mua đỡ tốn");
  RUN += "06 hang the: " + bodyFit(B6, 60) + "px\n";
  save(d6, 6); d6.close(SaveOptions.DONOTSAVECHANGES);
}

ketThuc("vN.log");
