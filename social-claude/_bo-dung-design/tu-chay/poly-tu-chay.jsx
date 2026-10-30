#target photoshop
// POLY STORE - Bat bo tu chay (poly-tu-chay.vbs) moi khi mo Photoshop.
// Da gan vao: File > Scripts > Script Events Manager > Start Application.
// Sau do: bo file .jsx vao C:\Users\Dao\Pictures\PolySocial\_tu-chay\ la Photoshop tu chay, khong can bam.
(function () {
  try {
    var v = new File("C:/Users/Dao/Pictures/PolySocial/poly-tu-chay.vbs");
    if (v.exists) v.execute();
  } catch (e) {}
})();
