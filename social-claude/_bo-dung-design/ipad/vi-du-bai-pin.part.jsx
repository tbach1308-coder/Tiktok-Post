// ================= SLIDE 1 - BÌA =================
if (want(1)) {
  var d1 = newDoc("Slide 01");
  placeSO(A + "bg-thumb.png", "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  var T1 = text("PIN iPAD", FS.T, 106, YEL2, 96, 300, { maxW: CW, name: "Tiêu đề - dòng 1" });
  var b1 = bb(T1); T1.translate(96 - b1[0], 170 - b1[1]); b1 = bb(T1);
  var T2 = text("TỤT NHANH?", FS.T, 106, YEL2, 96, 300, { maxW: CW, name: "Tiêu đề - dòng 2" });
  var b2 = bb(T2); T2.translate(96 - b2[0], (b1[3] + 24) - b2[1]); b2 = bb(T2);
  fx(T1, { shadow: { op: 58, dist: 0, blur: 28 } });
  fx(T2, { shadow: { op: 58, dist: 0, blur: 28 } });
  var S1 = text("4 cách giữ pin bền hơn", FS.I, 42, C.WHITE, 96, 300, { maxW: CW, name: "Mô tả" });
  var bs = bb(S1); S1.translate(96 - bs[0], (b2[3] + 44) - bs[1]); bs = bb(S1);
  // iPad nam ngang: anh that cua Apple, giao dien tieng Viet, DUNG TI LE THAT.
  // (ban truoc cat 1 phan anh ngang nhet vao man doc -> chu bi phong to ~1,4 lan)
  // Mep trai thang hang tieu de (x = 96) cho may to hon; mep phai dung o 900 (ne cot nut TikTok).
  // Anh bia = man hinh iPad HET PIN (anh chon PA1): khung iPad that, man den, ve pin vach do + day sac bang shape
  // de con sua tung lop. Man hinh trong anh 1560x1110 nam o (56,56)-(1504,1054).
  var bx1 = devicePic("bia-ipad-man-den.png", "Ảnh - iPad màn đen", 96, bs[3], 900, 1300);   // fitBox can giua -> tren duoi bang nhau
  var kx = (bx1[2] - bx1[0]) / 1560, ky = (bx1[3] - bx1[1]) / 1110;
  var scx = bx1[0] + 780 * kx, scy = bx1[1] + 555 * ky, ks = (bx1[2] - bx1[0]) / 804;   // ks = 1 khi iPad rong 804px
  var GRAY = "9A9AA2", bw = Math.round(330 * ks), bh = Math.round(150 * ks), st = Math.round(9 * ks);
  var top1 = Math.round(scy - (bh + 196 * ks) / 2), bl = Math.round(scx - bw / 2 - 10 * ks);
  var PV = rect(bl, top1, bl + bw, top1 + bh, Math.round(34 * ks), GRAY, "Pin - vỏ");
  PV.fillOpacity = 0; fx(PV, { stroke: { hex: GRAY, size: st, inside: true } });
  var tw = Math.round(14 * ks), th = Math.round(50 * ks);
  rect(bl + bw + Math.round(5 * ks), top1 + (bh - th) / 2, bl + bw + Math.round(5 * ks) + tw, top1 + (bh + th) / 2, tw / 2, GRAY, "Pin - núm");
  var g = st + Math.round(8 * ks);
  rect(bl + g, top1 + g, bl + g + Math.round(26 * ks), top1 + bh - g, Math.round(10 * ks), "FF3B30", "Pin - vạch đỏ");
  var cy0 = top1 + bh + Math.round(40 * ks), cw = Math.round(8 * ks);
  rect(scx - cw / 2, cy0, scx + cw / 2, cy0 + Math.round(70 * ks), cw / 2, GRAY, "Dây sạc - dây");
  rect(scx - 22 * ks, cy0 + 70 * ks, scx + 22 * ks, cy0 + 136 * ks, Math.round(10 * ks), GRAY, "Dây sạc - đầu cắm");
  rect(scx - 10 * ks, cy0 + 136 * ks, scx + 10 * ks, cy0 + 156 * ks, Math.round(4 * ks), GRAY, "Dây sạc - chân cắm");
  RUN += "01 bia: tieu de y " + Math.round(b1[1]) + "-" + Math.round(b2[3]) + ", may y " + Math.round(bx1[1]) + "-" + Math.round(bx1[3]) + "\n";
  save(d1, 1); d1.close(SaveOptions.DONOTSAVECHANGES);
}

// ================= SLIDE 2 - CÁCH 1: XEM APP ĂN PIN =================
if (want(2)) {
  var d2 = headC(2, ["unsplash-ipad-man-hinh-den-kHmLy8MkurU.jpg", 2400, 560, 0, 1200], "CÁCH 1",
    "XEM APP ĂN PIN", "Cài đặt > Pin", 70, 17);
  // Buoc 1: vao muc Pin (anh iPad)  |  Buoc 2: nhin cot % (danh sach app) - hai the cung chieu cao
  var P2 = 14, G2 = 24, ar1 = 416 / 404, ar2 = 432 / 568;
  var core2 = (CW - 4 * P2 - G2) / (1 / ar1 + 1 / ar2);
  var w21 = Math.round(core2 / ar1 + 2 * P2), w22 = CW - G2 - w21;
  var c21 = cardShot("s2-cai-dat-pin.png", LX + w21 / 2, TOP0, w21, 404, 416, P2, 22, "Ảnh 1 - mục Pin trong Cài đặt",
                     [[18, 203, 378, 267, 16]]);
  var c22 = cardShot("s2-ds-app-b.png", LX + w21 + G2 + w22 / 2, TOP0, w22, 568, 432, P2, 22, "Ảnh 2 - danh sách app kèm %",
                     [[455, 8, 540, 178, 16]]);
  var n21 = numBadge(c21.m, 1), n22 = numBadge(c22.m, 2);
  var B2 = [
    blk(c21.ls.concat(c22.ls, n21, n22), c21.m),
    liGroup([["check", "App ít dùng mà % cao là thủ phạm", 29],
             ["bang", "Tắt thông báo của app đó", 30]], TOP0),
    nextChip(CXc, Y0, "Cách 2", "Chip xem tiếp")
  ];
  RUN += "02 khoang cach deu: " + bodyFit(B2) + "px\n";
  save(d2, 2); d2.close(SaveOptions.DONOTSAVECHANGES);
}

// ================= SLIDE 3 - CÁCH 2: SẠC LÚC MÁY MÁT =================
if (want(3)) {
  var d3 = headC(3, ["Hand Holding Gray iPad at Counter.png", 1254, 157, 0, 940], "CÁCH 2",
    "SẠC LÚC MÁY MÁT", "Nóng quá iPad tự dừng sạc", 72, 20);
  // Cap anh NEN (sac tren ban mat) / KHONG NEN (may trong xe, nang gat) - khong ghi chu, bullet ben duoi da noi
  var W3 = (CW - 24) / 2, H3 = 312;
  var k31 = cardPhoto("s3-nen-ban-mat-r.png", LX, TOP0, LX + W3, TOP0 + H3, 24, "Ảnh nên - sạc trên bàn mát");
  var k32 = cardPhoto("s3-khong-trong-xe-r.png", LX + W3 + 24, TOP0, RX, TOP0 + H3, 24, "Ảnh không nên - máy trong xe ngoài nắng");
  var i31 = cornerIcon(k31.m, "check"), i32 = cornerIcon(k32.m, "x");
  var B3 = [
    blk(k31.ls.concat(k32.ls, i31, i32), k31.m),
    liGroup([["check", "Sạc ở nơi 0 đến 35 độ", 30],
             ["check", "Máy nóng thì tháo ốp ra rồi sạc", 30],
             ["x", "Không để máy trong xe, ngoài nắng", 30]], TOP0),
    nextChip(CXc, Y0, "Cách 3", "Chip xem tiếp")
  ];
  RUN += "03 khoang cach deu: " + bodyFit(B3) + "px\n";
  save(d3, 3); d3.close(SaveOptions.DONOTSAVECHANGES);
}

// ================= SLIDE 4 - CÁCH 3: GIỚI HẠN SẠC =================
if (want(4)) {
  var d4 = headC(4, ["poly-air5-man-hinh.jpg", 1960, 455, 0, 1050], "CÁCH 3",
    "GIỚI HẠN SẠC", "Đầy 80% là dừng, pin đỡ hao", 74, 22);
  var G4 = rect(LX, TOP0, RX, TOP0 + 178, 26, C.WHITE, "Khung máy hỗ trợ");
  G4.fillOpacity = 11;
  fx(G4, { stroke: { hex: C.WHITE, size: 2, op: 38, inside: true } });
  var P4 = [G4];
  P4.push(text("MÁY CÓ TÍNH NĂNG NÀY", F.B, 24, C.GREEN_L, CXc, TOP0 + 42,
    { align: Justification.CENTER, track: 60, name: "Nhãn - máy hỗ trợ" }));
  P4 = P4.concat(chipLine(["iPad Pro M4 trở lên", "iPad Air M2 trở lên"], CXc, TOP0 + 94, 25, 22, 50, 18));
  P4 = P4.concat(chipLine(["iPad mini A17 Pro", "iPad A16"], CXc, TOP0 + 146, 25, 22, 50, 18));
  var B4 = [
    blk(P4, G4),
    cardShot("s4-gioi-han-80.png", CXc, TOP0, CW, 1030, 152, 14, 22, "Ảnh - công tắc Giới hạn 80%",
                [[896, 24, 1016, 86, 30]]),
    liGroup([["check", "Cài đặt > Pin > Tình trạng pin > Giới hạn 80%", 28],
             ["x", "Air 4, Air 5, Pro M1, M2 không có", 30]], TOP0),
    nextChip(CXc, Y0, "Cách 4", "Chip xem tiếp")
  ];
  RUN += "04 khoang cach deu: " + bodyFit(B4) + "px\n";
  save(d4, 4); d4.close(SaveOptions.DONOTSAVECHANGES);
}

// ================= SLIDE 5 - CÁCH 4: NGUỒN ĐIỆN THẤP =================
if (want(5)) {
  var d5 = headC(5, ["unsplash-ipad-man-hinh-den-kHmLy8MkurU.jpg", 2400, 180, 0, 1200], "CÁCH 4",
    "NGUỒN ĐIỆN THẤP", "Máy nào cũng có", 71, 18);
  // Hinh di dung theo cau huong dan: (1) Cai dat > Pin  ->  (2) Che do nguon dien thap. Anh Apple tieng Viet.
  // Hai the cung rong 600, can giua; so buoc dan o goc (off 6) de khong de len chu "Che do..." trong anh.
  // s5-buoc1-pin-c: cat lai tu s2-cai-dat-pin (10,72,388,342) - bo 2 vach vien doc + du dong "Cai dat chung".
  var s51 = cardShot("s5-buoc1-pin-c.png", CXc, TOP0, 560, 378, 270, 14, 22, "Bước 1 - mục Pin trong Cài đặt",
                     [[12, 126, 366, 198, 18]]);
  var s52 = cardShot("s5-lpm-on.png", CXc, TOP0, 560, 568, 100, 14, 22, "Bước 2 - công tắc Chế độ nguồn điện thấp",
                     [[428, 18, 543, 81, 30]]);
  var n51 = numBadge(s51.m, 1, 6), n52 = numBadge(s52.m, 2, 6);
  var B5 = [
    blk(s51.ls.concat(n51), s51.m),
    blk(s52.ls.concat(n52), s52.m),
    liGroup([["check", "Cài đặt > Pin > Chế độ nguồn điện thấp", 29],
             ["bang", "Sạc lên 80% tự tắt", 30]], TOP0),
    nextChip(CXc, Y0, "Khi nào thay pin?", "Chip xem tiếp")
  ];
  RUN += "05 khoang cach deu: " + bodyFit(B5) + "px\n";
  save(d5, 5); d5.close(SaveOptions.DONOTSAVECHANGES);
}

// ================= SLIDE 6 - KHI NÀO THAY PIN =================
if (want(6)) {
  var d6 = headC(6, ["unsplash-me-dung-ipad-UJHhWwCuuAs.jpg", 1600, 400, 0, 800], "KHI NÀO THAY PIN",
    "PIN CÒN BAO NHIÊU", "Apple thiết kế giữ 80% sau 1.000 chu kỳ sạc", 73, 19);
  var B6 = [
    shotDevice("s6-ipad-tinh-trang-pin.png", CXc, TOP0, CW, 1560, 1110, "Ảnh - iPad mở Tình trạng pin",
               [[1375, 306, 1482, 376, 16], [1400, 428, 1482, 498, 16]]),
    liGroup([["check", "Máy đời mới: Cài đặt > Pin > Tình trạng pin", 28],
             ["x", "Máy đời cũ không xem được trong máy", 30]], TOP0)
  ];
  RUN += "06 khoang cach deu: " + bodyFit(B6) + "px\n";
  save(d6, 6); d6.close(SaveOptions.DONOTSAVECHANGES);
}

// ================= SLIDE 7 - CUỐI =================
if (want(7)) {
  var d7 = newDoc("Slide 07");
  placeSO(A + "bg-thumb.png", "Nền");
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  var E7 = emojiC(BATT, 170, CXc, 400, "Biểu tượng pin");
  fxGlow(E7, { glow: { hex: C.GREEN, op: 55, size: 50, spread: 6 } });
  var A1 = text("PIN iPAD BẠN", F.T, 86, C.WHITE, CXc, 600, { align: Justification.CENTER, maxW: CW, name: "Dòng chốt 1" });
  fxGlow(A1, { stroke: { hex: NAVY, size: 8 }, shadow: { op: 52, dist: 0, blur: 30 } });
  var A2 = text("CÒN BAO NHIÊU %?", F.T, 86, C.GREEN_L, CXc, 720, { align: Justification.CENTER, maxW: CW, name: "Dòng chốt 2" });
  fxGlow(A2, { stroke: { hex: NAVY, size: 8 }, shadow: { op: 52, dist: 0, blur: 30 } });
  var HP = text("#polystore", F.B, 29, C.WHITE, CXc, 980, { align: Justification.CENTER, name: "Hashtag - chữ" });
  var bp = bb(HP);
  var HR = rect(bp[0] - 34, bp[1] - 19, bp[2] + 34, bp[3] + 19, 34, C.BLACK, "Hashtag - nền");
  HR.fillOpacity = 45;
  fx(HR, { stroke: { hex: C.GREEN_L, size: 2, op: 90, inside: true } });
  HR.move(HP, ElementPlacement.PLACEAFTER);
  centerGroup([blk([E7]), blk([A1]), blk([A2]), blk([HR, HP], HR)], 58, 300, 1340);
  RUN += "07 CTA: can giua cum\n";
  save(d7, 7); d7.close(SaveOptions.DONOTSAVECHANGES);
}

ketThuc("dung-bo-pin.txt");
