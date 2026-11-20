// mo phong Photoshop de thu logic tieuDeBia (khong phai Photoshop that)
const fs = require('fs');
const src = fs.readFileSync(require('path').join(__dirname, '../../../social-claude/_bo-dung-design/code/bia-lib.jsx'), 'utf8');
let layers = [];
function mk(str, font, size, hex, x, y, o) {
  const it = font === 'I';
  const w = str.length * (it ? 0.42 : 0.62) * size * (process.env.LECH && size < 80 ? 0.93 : 1);
  const acc = /[ÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ]/.test(str);
  const nang = /[ẠẬẶẸỆỊỌỘỢỤỰỴ]/.test(str);
  const L = { name: (o && o.name) || str, str, size, font, hex, b: [x + 0.04 * size, y - 0.7 * size - (acc ? 0.24 * size : 0), x + 0.04 * size + w, y + (nang ? 0.15 * size : 0)],
    translate(dx, dy) { this.b[0] += dx; this.b[2] += dx; this.b[1] += dy; this.b[3] += dy; },
    remove() { layers = layers.filter(l => l !== this); this.dead = true; }, fx: null };
  layers.push(L); return L;
}
global.text = (s, f, z, h, x, y, o) => mk(s, f, z, h, x, y, o);
global.bb = L => { if (L.dead) throw new Error('dung lop da xoa: ' + L.name); return L.b.slice(); };
global.fxGlow = (L, o) => { if (L.fx) throw new Error('fx 2 lan'); L.fx = o; };
global.fx = global.fxGlow; global.rect = () => mk('', 'T', 1, '', 0, 0); global.oval = global.rect; global.poly = global.rect; global.placeSO = () => mk('', 'T', 1, '', 0, 0);
global.FS = { T: 'T', I: 'I' }; global.F = { B: 'B' };
global.biaNhom = (n, ls) => { global.NHOM = { n, ls }; };
global.app = { activeDocument: { artLayers: { getByName(n) { const l = layers.find(l => l.name === n); if (!l) throw new Error('no'); return l; } } } };
global.ElementPlacement = {}; global.AnchorPosition = {}; global.Justification = {};
new Function(src + '\nbiaNhom = function (n, ls) { global.NHOM = { n: n, ls: ls }; };\nglobal.tieuDeBia = tieuDeBia; global._tdbTach = _tdbTach; global._tdbNgat = _tdbNgat;')();
module.exports = { reset() { layers = []; }, layers: () => layers };
