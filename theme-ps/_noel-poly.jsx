// _noel-poly.jsx: theme "Noel · Kiểu Poly" (fen 27/11 14h51 "tạo concept mới cho noel" + ảnh bài "iPad của bạn nên đổi chưa?", chọn "Kiểu bài shop + Noel").
// Theme có "dong_co": false: tao.py KHÔNG ghép _dong-co.jsx -> giữ nguyên kiểu bài shop (font, màu, nền ảnh mờ tối, khung xanh lá, viền + bóng chữ, bìa tự làm).
// Chỉ thêm 2 chi tiết Noel, nằm ngay trên lớp nền (dưới chữ, thẻ, ảnh máy): cụm thông + châu đỏ, châu vàng ở góc phải trên (anh/goc-thong.png),
// lớp tuyết mỏng ở đáy (anh/tuyet-mong.png). Ảnh vẽ bằng theme-ps/noel-kieu-poly/tao_anh.py.
// Nền ảnh đặt sau newDoc (bgPhoto / background / placeSO tên "Nền…") thì nhóm trang trí tự đưa lên trên ảnh nền.
var THEME_N = 0;
var THEME_LOG = "Theme " + THEME.ten + ": T=" + F.T + " B=" + F.B + " (giu kieu bai shop, them thong + tuyet)\n";
var NP_DIR = (typeof THEME_DIR != "undefined" ? THEME_DIR : "") + "/anh/";
var NP_LS = [], NP_TRANG = "";
var NP_PLACE0 = placeSO;
function npAnh(ten, name, rong) {
  var f = new File(NP_DIR + ten);
  if (!f.exists) { RUN += "   noel: thieu anh " + ten + "\n"; return null; }
  var L = NP_PLACE0(f.fsName, name);
  var q = bb(L), s = rong / (q[2] - q[0]) * 100;
  L.resize(s, s, AnchorPosition.TOPLEFT);
  return L;
}
// vẽ 2 lớp trang trí ở trang đang mở; trang này đã có thì đưa 2 lớp lên trên cùng (ngay trên ảnh nền vừa đặt).
// Không gom nhóm: lớp trên cùng là lớp đang chọn, chữ / thẻ / ảnh vẽ sau nằm trên trang trí.
function npVe() {
  var doc = app.activeDocument;
  if (NP_LS.length && NP_TRANG == doc.name) {
    try {
      for (var i = NP_LS.length - 1; i >= 0; i--) NP_LS[i].move(doc, ElementPlacement.PLACEATBEGINNING);
      doc.activeLayer = NP_LS[0];
      return;
    } catch (e) {}
  }
  var T = npAnh(THEME.np_tuyet || "tuyet-mong.png", "Noel - tuyết đáy", W + 8);
  if (T) { var q2 = bb(T); T.translate(-4 - q2[0], H - q2[3]); }
  var G = npAnh(THEME.np_goc || "goc-thong.png", "Noel - thông + châu góc", THEME.np_goc_rong || 420);
  if (G) { var q = bb(G); G.translate(W - q[2], -q[1]); }
  NP_LS = []; if (G) NP_LS.push(G); if (T) NP_LS.push(T);
  NP_TRANG = doc.name;
  if (NP_LS.length) doc.activeLayer = NP_LS[0];
}
var NP_NEWDOC0 = newDoc;
newDoc = function (name) {
  var d = NP_NEWDOC0(name);
  THEME_N++;
  NP_LS = [];
  npVe();
  return d;
};
if (typeof bgPhoto == "function") {
  var NP_BG0 = bgPhoto;
  bgPhoto = function (file, imgW, cropL, cropT, cropW, blur, op) {      // thiếu độ mờ / độ tối (vd slide mẫu kho theme) thì lấy như headC: 16 / 70
    var r = NP_BG0(file, imgW, cropL, cropT, cropW, blur || 16, op || 70); npVe(); return r;
  };
}
if (typeof background == "function") {
  var NP_BGR0 = background;
  background = function () { var r = NP_BGR0.apply(this, arguments); npVe(); return r; };
}
placeSO = function (file, name) {
  var L = NP_PLACE0(file, name);
  if (/^Nền/.test(name || "")) npVe();
  return L;
};
