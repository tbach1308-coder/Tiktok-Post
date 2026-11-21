// Thu ham tieuDeBia (code/bia-lib.jsx) tren Photoshop gia lap: node dev/test/typobia/thu.js ; LECH=1 gia do co nho lech 7%
const M = require('./mock.js');
let loi = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) loi++; };
// tach doan
let t = _tdbTach('CHẠY *AI* _tại Poly_');
ok(JSON.stringify(t) === JSON.stringify([{t:'CHẠY',k:'v',sp:false},{t:'AI',k:'w',sp:true},{t:'tại Poly',k:'i',sp:true}]), 'tach 3 doan ' + JSON.stringify(t));
t = _tdbTach('*AI*?'); ok(t.length === 2 && !t[1].sp, 'dau ? dinh tu khoa');
t = _tdbTach('iPAD LAG ?'); ok(t.length === 1 && t[0].t === 'iPAD LAG ?', 'giu chu fen');
function bia(dong, o) {
  M.reset(); text('POLY STORE', 'B', 22, 'FFFFFF', 100, 166, { name: 'Thương hiệu' });
  const L0 = M.layers()[0]; L0.b = [102, 150, 260, 166];
  const r = tieuDeBia(dong, o); console.log('   ' + r.log.trim()); return r;
}
let r = bia(['TOP 5 MÁY TRẠM', '*DELL* CHO KỸ SƯ'], { duoi: 'tại Poly' });
ok(r.co[0] === r.co[1] && r.co[0] >= 84 && r.co[0] <= 112, '2 dong dai gan bang -> cung co ' + r.co);
ok(Math.abs(r.box[0] - 102) < 1, 'mep trai thang POLY STORE ' + r.box[0]);
ok(r.box[2] <= 982, 'khong qua le phai');
const lop = r.lop; ok(lop.length === 4, 'so lop ' + lop.length);
ok(lop.every(l => l.fx), 'moi lop co hieu ung');
ok(lop.filter(l => l.hex === 'FFFFFF' && l.font === 'T').length === 1, '1 cum trang');
ok(NHOM && NHOM.ls.length === 4, 'gom nhom');
// dau khong cham
const d1 = lop.filter(l => /Tiêu đề 1/.test(l.name)), d2 = lop.filter(l => /Tiêu đề 2/.test(l.name));
const h = ls => [Math.min(...ls.map(l => l.b[1])), Math.max(...ls.map(l => l.b[3]))];
ok(h(d2)[0] - h(d1)[1] >= 8, 'dong 2 cach dong 1 >= 8px: ' + (h(d2)[0] - h(d1)[1]).toFixed(1));
const S = lop.find(l => /dưới/.test(l.name)); ok(S && Math.abs(S.b[1] - h(d2)[1] - 26) < 1, 'duoi cach 26');
// nhip to nho
r = bia(['*DELL*', 'CHO KỸ SƯ TRẺ'], {}); ok(r.co[0] > r.co[1] && r.co[0] <= 124 && r.co[0] <= Math.floor(r.co[1] * 1.3), 'dong chi tu khoa to hon ' + r.co);
// deu
r = bia(['TOP 3 iPAD', 'CHO *SINH VIÊN*'], { deu: true }); ok(r.co[0] === r.co[1], 'deu ' + r.co);
r = bia(['TOP 3 iPAD', 'CHO *SINH VIÊN*'], {}); ok(Math.max(...r.co) <= 112, 'cap 112 ' + r.co);
// dai qua
r = bia(['TOP 5 LAPTOP DƯỚI 25 TRIỆU CHO DÂN KỸ THUẬT'], {}); ok(/CANH BAO/.test(r.log), 'dong dai qua co canh bao');
ok(r.box[2] <= 982 + 1, 'dai qua van ha co cho vua le ' + r.box[2]);
// inline nghieng
r = bia(['LAPTOP', 'CHẠY *AI* _tại Poly_'], {}); ok(r.lop.filter(l => l.font === 'I').length === 1 && r.lop.find(l => l.font === 'I').size === 48, 'nghieng cung dong co 48');
// yMax
r = bia(['iPAD PRO M2', 'HAY AIR M2?', 'CHỌN CON NÀO'], { yMax: 520 }); ok(r.box[3] <= 520 || /CANH BAO/.test(r.log), 'yMax ' + r.box[3]);
// 1 dong ngan
r = bia(['PIN TỤT NHANH?'], {}); ok(r.co[0] <= 112 && r.co[0] >= 84, '1 dong ' + r.co);
r = bia(['*DELL* CHO KỸ SƯ VÀ KIẾN TRÚC SƯ TRẺ'], {}); ok(r.co.length >= 2 && /tu ngat/.test(r.log) && r.lop.filter(l => l.hex === 'FFFFFF' && l.font === 'T').map(l => l.str).join() === 'DELL', 'tu ngat dong, giu nguyen tu khoa');
ok(_tdbNgat('LAPTOP DƯỚI 25 TRIỆU CHO DÂN KỸ THUẬT').join(' | ').indexOf('25 | TRIỆU') < 0, 'khong tach 25 TRIEU: ' + _tdbNgat('LAPTOP DƯỚI 25 TRIỆU CHO DÂN KỸ THUẬT').join(' | '));
ok(_tdbNgat('*DELL* CHO KỸ SƯ VÀ KIẾN TRÚC SƯ')[0].indexOf('*') === 0 && _tdbNgat('*DELL* CHO KỸ SƯ VÀ KIẾN TRÚC SƯ')[0].split('*').length === 3, 'khong cat giua *...*');
// khong con lop do tam
ok(!M.layers().some(l => l.name === 'tdb do'), 'khong con lop do tam');
r = bia(['NEWSEAL CPO', 'OPENBOX LIKENEW', 'KHÁC GÌ NHAU?'], { co: [74, 74, 0] }); ok(r.co[0] === 74 && r.co[1] === 74 && r.co[2] > 74, 'co dat tay theo vai tro ' + r.co);
global.THEME = { id: 'toi-gian-den', vang: 'E5E7EB' };
r = bia(['iPAD PRO M5'], {}); ok(/CANH BAO bai co theme toi-gian-den/.test(r.log) && r.lop[0].hex === 'E5E7EB', 'bai co theme (may con): canh bao + khong dung vang shop');
delete global.THEME;
console.log(loi ? 'LOI ' + loi : 'TAT CA DAT'); process.exit(loi ? 1 : 0);
