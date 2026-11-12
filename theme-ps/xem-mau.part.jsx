// Slide mau de xem truoc theme Photoshop (app Poly Dung Bai, kho theme > Photoshop). Dung thu vien iPad + theme.jsx.
// 3 slide: bia, noi dung, cuoi. Chu + anh nen mau lay o THEME.xem (moi theme 1 may, 1 chu de khac nhau: fen 12/11 "anh chinh thumbnail lay da dang anh vo dung 1 kieu").
// Anh may: <thu muc xem>/tai-nguyen/anh-that/may.png (nen trong, moi theme 1 may).
function luuXem(doc, n) {
  var p = new PNGSaveOptions(); p.compression = 6; p.interlaced = false;
  doc.saveAs(new File(OUT.fsName + "/slide-0" + n + ".png"), p, true, Extension.LOWERCASE);
}
var XM = THEME.xem || {};
function xm(k, d) { return XM[k] || d; }
var XN = xm("nen", []);
function nenXem(i) { var a = XN[i]; if (a) bgPhoto(a[0], a[1], a[2], a[3], a[4]); }   // theme phang: khong ve gi; theme kinh: anh that lam mo
BODY_BOT = 1266 - 34 - 48;

if (want(1)) {
  var d1 = newDoc("Slide 01");
  nenXem(0);
  if (XM.bia_sp || XM.bia_tn || XM.bia_tg) { if (XM.bia_sp) biaSanPham(XM.bia_sp); else if (XM.bia_tg) biaToiGian(XM.bia_tg); else biaTinhNang(XM.bia_tn); RUN += "01 bia kieu quang cao\n"; luuXem(d1, 1); d1.close(SaveOptions.DONOTSAVECHANGES); }
  else {
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  var T1 = text(xm("t1", "IPAD NÀO"), F.T, 104, C.WHITE, 96, 300, { maxW: 884, name: "Tiêu đề - dòng 1" });
  var T2 = text(xm("t2", "ĐÁNG MUA?"), F.T, 104, YEL2, 96, 420, { maxW: 884, name: "Tiêu đề - dòng 2" });
  var b1 = bb(T1); T1.translate(96 - b1[0], 176 - b1[1]); b1 = bb(T1);
  var b2 = bb(T2); T2.translate(96 - b2[0], (b1[3] + 22) - b2[1]); b2 = bb(T2);
  var S1 = text(xm("nho", "3 máy chạy ngon, giá dễ thở"), F.B, 40, C.WHITE, 96, 300, { maxW: 884, name: "Dòng nhỏ dưới tiêu đề" });
  var bs = bb(S1); S1.translate(96 - bs[0], (b2[3] + 26) - bs[1]); bs = bb(S1);
  devIn("may.png", "Ảnh máy", 110, bs[3] + 70, 970, 1210);
  pillC("XEM NGAY", CXc, 1300, 30, C.WHITE, C.GREEN, 34, 70, F.B, 80, "Câu móc");
  RUN += "01 bia\n";
  luuXem(d1, 1); d1.close(SaveOptions.DONOTSAVECHANGES);
  }
}

function theMay() {
  var l = LX, t = TOP0, h = 300;
  var G = glass(l, t, RX, t + h, 26, "Thẻ máy");
  var ls = [G];
  ls.push(devIn("may.png", "Ảnh máy", l + 24, t + 34, l + 300, t + h - 34));
  ls.push(text(xm("ten", "iPad Air 5"), F.T, 46, C.GREEN_L, l + 324, t + 96, { maxW: 370, name: "Tên máy" }));
  ls = ls.concat(li("check", xm("cau", "Chip M1 · 64GB"), l + 324, t + 166, 28, 360));
  ls.push(text(xm("gia", "8.490.000đ"), F.T, 46, C.WHITE, l + 324, t + 252, { maxW: 370, name: "Giá" }));
  return blk(ls, G);
}
if (want(2)) {
  var a2 = XN[1] || ["", 1, 0, 0, 1];
  var d2 = headC(2, a2, xm("pill", "MẸO 1"), xm("tieu", "TẮT LÀM MỚI NỀN"), xm("phu", "Đỡ hao pin, máy mát hơn hẳn"));
  var yy = xm("y", [["check", "Mở Cài đặt > Cài đặt chung"], ["check", "Chọn Làm mới ứng dụng trong nền"], ["x", "Đừng tắt hẳn app Tin nhắn"]]);
  var it = []; for (var i = 0; i < yy.length; i++) it.push([yy[i][0], yy[i][1], 30]);
  var B2 = [theMay(), liGroup(it, TOP0, "Khung ý"), noteBox(xm("ghi", ["Máy vẫn hao pin nhanh?", "Ghé POLY kiểm tra pin miễn phí"]), CXc, TOP0, CW, "Ghi chú")];
  hook(xm("moc", "Xem mẹo 2"));
  RUN += "02 khoang cach deu: " + bodyFit(B2) + "px\n";
  luuXem(d2, 2); d2.close(SaveOptions.DONOTSAVECHANGES);
}

if (want(3)) {
  var d3 = newDoc("Slide 03");
  nenXem(2);
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  var G3 = glass(130, 540, 950, 920, 36, "Thẻ câu hỏi");
  var Q = text(xm("hoi", "Bạn đang xài\riPad đời nào?"), F.T, 84, C.WHITE, CXc, 700, { align: Justification.CENTER, maxW: 740, name: "Câu hỏi" });
  var bq = bb(Q); Q.translate(CXc - (bq[0] + bq[2]) / 2, 730 - (bq[1] + bq[3]) / 2);
  RUN += "03 cuoi\n";
  luuXem(d3, 3); d3.close(SaveOptions.DONOTSAVECHANGES);
}
ketThuc("xem.log");
