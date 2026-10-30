// Dan vao javascript_tool cua trinh duyet tich hop (dang dung o trang CUNG MIEN voi anh
// hoac mien cho phep CORS: support.apple.com -> cdsassets/ipcdn, pexels.com, unsplash.com).
// Sua DS roi chay. Moi lan toi da 2 anh (cau noi gioi han ~200k ky tu).
// Ket qua qua lon se tu luu thanh file -> chay giai-ma.py tren file do.
var DS = {
  'ten-anh-1': 'https://...',
  'ten-anh-2': 'https://...'
};
var RONG = 1100;      // be ngang toi da khi luu
var CL = 0.88;        // chat luong WebP (anh giao dien: 0.93)
async function g(u) {
  var b = await (await fetch(u, { mode: 'cors' })).blob(); var bm = await createImageBitmap(b);
  var sc = Math.min(1, RONG / bm.width);
  var cv = new OffscreenCanvas(Math.round(bm.width * sc), Math.round(bm.height * sc));
  cv.getContext('2d').drawImage(bm, 0, 0, cv.width, cv.height);
  var o = await cv.convertToBlob({ type: 'image/webp', quality: CL });
  var buf = new Uint8Array(await o.arrayBuffer()), s = '';
  for (var i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
  return { w: cv.width, h: cv.height, b: btoa(s) };
}
var out = [];
for (var k in DS) { try { var r = await g(DS[k]); out.push('###' + k + '###' + r.w + 'x' + r.h + '###' + r.b); } catch (e) { out.push('LOI ' + k + ' ' + e); } }
out.join('\n') + '\n' + 'P'.repeat(110000)
