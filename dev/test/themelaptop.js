// fen 24/11 "kiểm tra app có lỗi gì ko": bài laptop dùng theme Noel lỗi ngay khi chạy (14:10 nganh24-v1.jsx
// "headC is undefined", dòng var NOEL_HEADC0 = headC;): theme bọc hàm chỉ có trong bộ iPad (poly-lib.jsx) mà không hỏi có hàm đó chưa.
// Thử: nạp theme.jsx của cả 19 theme như bộ laptop (code/build.py: không có hàm riêng iPad) và như bộ iPad: không lỗi lúc nạp.
//   node dev/test/themelaptop.js
const fs = require('fs'), path = require('path');
const R = path.resolve(__dirname, '../..'), K = path.join(R, 'social-claude/_bo-dung-design');
let ok = 0, bad = 0;
const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + (x || ''))); };
const ten = s => new Set([...s.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g), ...s.matchAll(/(?:^|[\s;])var\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]));
// bộ laptop = 223 dòng đầu make-mac-vs-win.jsx + top5_body.jsx (dòng 8–186, 231–243), như code/build.py
const t5 = fs.readFileSync(path.join(K, 'code/top5_body.jsx'), 'utf8').split('\n');
const laptop = fs.readFileSync(path.join(K, 'code/make-mac-vs-win.jsx'), 'utf8').split('\n').slice(0, 223).join('\n') + t5.slice(7, 186).join('\n') + t5.slice(230, 243).join('\n');
const ipad = fs.readFileSync(path.join(K, 'ipad/poly-lib.jsx'), 'utf8');
const coL = ten(laptop), chiIpad = [...ten(ipad)].filter(x => !coL.has(x));
check('có hàm chỉ bộ iPad mới có (headC, liGroup, hook)', ['headC', 'liGroup', 'hook'].every(x => chiIpad.includes(x)), chiIpad.join(','));

function stub() {
  const f = function () { return P; };
  const P = new Proxy(f, { get: (o, k) => (k === Symbol.toPrimitive ? () => 0 : k === 'length' ? 0 : P), apply: () => P, construct: () => P });
  return P;
}
let NAP = null;
function nap(js, thieu) {
  const own = ten(js), kho = new Map();
  const g = new Proxy({}, {
    has: (o, k) => typeof k === 'string' && !own.has(k) && !thieu.has(k) && !(k in globalThis),
    get: (o, k) => (k === Symbol.unscopables ? undefined : kho.has(k) ? kho.get(k) : stub()),
    set: (o, k, v) => (kho.set(k, v), true),
  });
  try {
    new Function('G', 'with (G) {\n' + js + '\n}')(g);
    NAP = kho;
    return '';
  } catch (e) {
    return e.name + ': ' + e.message;
  }
}
const TP = path.join(R, 'theme-ps');
const ids = fs.readdirSync(TP).filter(d => fs.existsSync(path.join(TP, d, 'theme.jsx'))).sort();
check('19 theme', ids.length === 19, ids.length);
for (const id of ids) {
  const js = fs.readFileSync(path.join(TP, id, 'theme.jsx'), 'utf8');
  const lap = nap(js, new Set(chiIpad)), ip = nap(js, new Set()), boc = NAP && NAP.has('headC');
  check('theme ' + id + ': nạp được với bộ laptop + bộ iPad', !lap && !ip, (lap || '') + ' | ' + (ip || ''));
  if (/\n\s*var (NOEL|TAY|BX)_HEADC0 = headC;/.test(js)) check('theme ' + id + ': bộ iPad vẫn có tiêu đề trang riêng của theme (bọc headC)', boc);
}
// theme vẫn bọc hàm iPad khi có (bộ iPad giữ đủ phần riêng theme)
for (const f of fs.readdirSync(TP).filter(x => /^_.*\.jsx$/.test(x))) {
  const s = fs.readFileSync(path.join(TP, f), 'utf8');
  const tran = [...s.matchAll(/^var ([A-Z_0-9]+) = (\w+);/gm)].filter(m => chiIpad.includes(m[2]));
  check(f + ': không bọc trần hàm riêng iPad (phải hỏi typeof trước)', !tran.length, tran.map(m => m[0]).join(' ; '));
}
console.log('\n' + ok + ' đạt, ' + bad + ' lỗi');
process.exit(bad ? 1 : 0);
