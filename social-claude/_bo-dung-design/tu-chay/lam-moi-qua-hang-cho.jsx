#target photoshop
// POLY STORE - lam moi bo tu chay qua hang cho (khong ai phai bam): chep file nay vao _tu-chay, bo tu chay dang chay
// dua cho Photoshop -> goi lam-moi-tu-chay.vbs (chep ban moi, tat ban cu, bat ban moi). Vi di qua hang cho nen luc nay
// khong co script dung bai nao dang chay. Cho toi khi ban cu da tat (toi da 20 giay) roi moi tra Photoshop ve.
// Nhat ky se co "BAT DAU lam-moi-qua-hang-cho.jsx" khong co XONG (ban cu bi tat giua chung), roi "LAM MOI BO TU CHAY",
// "BO TU CHAY DA BAT".
(function () {
  var t0 = new Date().getTime() - 2000;
  var mk = new File("C:/Users/Dao/Pictures/PolySocial/_tu-chay/_da-chay/.lam-moi-xong.txt");
  var v = new File("E:/Social Claude/_bo-dung-design/tu-chay/lam-moi-tu-chay.vbs");
  if (!v.exists) return;
  v.execute();
  for (var i = 0; i < 80; i++) {
    $.sleep(250);
    if (mk.exists && mk.modified && mk.modified.getTime() >= t0) break;
  }
})();
