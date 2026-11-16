// ================= SLIDES: THUMBNAIL ASUS ROG ZEPHYRUS G16 BẢN TRẮNG (15/11, sửa v2) =================
// 1 slide bìa, theme Photoshop "Glass · Tím hồng" (build --theme).
// fen sửa 15/11: bỏ thông số, chỉ tên máy + giá 105.000.000đ; dùng ĐÚNG ảnh máy fen gửi (góc + vị trí như ảnh), xoá cánh tay / bàn tay
// ảnh: tai-nguyen/bia-anh.png = ảnh fen gửi đã xoá tay (script xoa_tay4.py), cắt đến y 1430, rộng 1080 x cao 1351, đặt (0,0)
function bandsV(y0, y1, opTop, opBot, hex) {
  var n = 24, h = (y1 - y0) / n;
  for (var i = 0; i < n; i++) {
    var op = opTop + (opBot - opTop) * (i + 0.5) / n;
    var R = rect(0, Math.round(y0 + i * h), W, Math.round(y0 + (i + 1) * h), 0, hex, "Lớp tối " + (i + 1));
    R.opacity = op;
  }
}
function t1() {
  var d = newDoc("Slide 01");
  placeAt(TN + "bia-anh.png", 0, 0, "Ảnh máy thật");
  var TF = THEME.font_bia ? pick(THEME.font_bia.concat([F.T])) : F.T, mau = THEME.bia_mau || THEME.vang;
  // chữ trên đầu: nền tối mờ dần xuống để đọc rõ, máy giữ nguyên chỗ
  bandsV(0, 400, 80, 0, "110C26");
  // đáy: tối nhẹ dần để thẻ giá đọc rõ (không che góc máy y ~1328)
  bandsV(1330, H, 0, 78, "110C26");
  text("POLY STORE", F.B, 22, C.WHITE, 96, 112, { track: 200, name: "Thương hiệu" });
  var q, cx = W / 2;
  var D1 = text("ROG Zephyrus", F.B, 56, C.WHITE, cx, 200, { align: Justification.CENTER, name: "Dòng máy" });
  themeGiua(D1, cx); q = themeDuoi(D1, 150);
  var T = text("G16", TF, 190, mau, cx, 400, { align: Justification.CENTER, maxW: 960, name: "Tên máy" });
  themeGiua(T, cx); q = themeDuoi(T, q[3] + 8);
  // giá (fen đưa 15/11): thẻ kính nhỏ ở đáy, trong vùng an toàn y <= 1386
  var P = text("105.000.000đ", TF, 60, C.WHITE, cx, 1360, { align: Justification.CENTER, maxW: 760, name: "Giá" });
  var qp = themeGiua(P, cx), pw = qp[2] - qp[0], pcy = 1349;
  P.translate(0, pcy - (qp[1] + qp[3]) / 2);
  var G = rect(cx - pw / 2 - 34, pcy - 36, cx + pw / 2 + 34, pcy + 36, 36, "FFFFFF", "Thẻ giá");
  G.fillOpacity = 12;
  THEME_FX0(G, { stroke: { hex: "FFFFFF", size: 2, op: 90, inside: true } });
  G.move(P, ElementPlacement.PLACEAFTER);
  save5(d, 1);
}

var ONLY = (typeof ONLY_M != "undefined") ? ONLY_M : [1];
function want(k) { for (var i = 0; i < ONLY.length; i++) if (ONLY[i] == k) return true; return false; }
var FN = [null, t1];
var LOG = "Fonts: " + F.B + " | serif=" + FS.T + " / " + FS.I + "\n";
try {
  var KEEP = app.documents.length; // không đóng file fen đang mở
  for (var k = 1; k <= 1; k++) if (want(k)) {
    try { FN[k](); LOG += "0" + k + " ok\n"; } catch (e1) { LOG += "LOI 0" + k + " line " + e1.line + ": " + e1.message + "\n"; }
    while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
  if (typeof THEME_LOG != "undefined") LOG += THEME_LOG;
  plog(LOGN, LOG);
} catch (e) { plog("error.txt", LOG + "ERROR line " + e.line + ": " + e.message); }
app.preferences.rulerUnits = OLD_RU; app.preferences.typeUnits = OLD_TU;
