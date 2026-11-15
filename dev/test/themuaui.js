// Giao diện theme theo mùa (fen 14/11 12h13): Kho theme ẩn theme hết mùa (dòng 🍂 + nút Hiện), thẻ có nhãn mùa,
// ⋯ → Thông tin có ô Mùa (tự theo tên / cả năm / từng mùa). Chạy: node themuaui.js (app thử 8790)
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790';
const j = (u, d) => fetch(A + u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
const R = () => 'D' + Math.random().toString(36).slice(2, 12).padEnd(10, 'x').slice(0, 10);
let dat = 0, loi = 0;
const check = (n, c, x) => { c ? dat++ : loi++; console.log((c ? '✓ ' : '✗ ') + n, c ? '' : JSON.stringify(x === undefined ? '' : x)); };
(async () => {
  await j('/api/theme-canva', { them: { link: `https://www.canva.com/design/${R()}/edit`, ten: 'Mùa UI · hết mùa', kenh: '' } });
  let r = await j('/api/theme-canva', { them: { link: `https://www.canva.com/design/${R()}/edit`, ten: 'Mùa UI · cả năm', kenh: '' } });
  const a = r.ds.find(t => t.ten === 'Mùa UI · hết mùa'), b = r.ds.find(t => t.ten === 'Mùa UI · cả năm');
  // chọn 1 mùa đang ngoài mùa hôm nay cho theme a (Valentine / Halloween / Tết)
  for (const k of ['valentine', 'halloween', 'tet', 'christmas']) {
    r = await j('/api/theme-canva', { sua: { id: a.id, ten: a.ten, kenh: '', dang: [], mua: k } });
    if (r.ds.find(t => t.id === a.id).ngoai_mua) break;
  }
  const a1 = r.ds.find(t => t.id === a.id);
  check('theme thử đang hết mùa (' + a1.mua_ten + ')', a1.ngoai_mua === true, a1);
  const hetDs = r.ds.filter(t => t.ngoai_mua);
  const br = await chromium.launch(); const errs = [];
  const p = await br.newPage({ viewport: { width: 1440, height: 1000 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/'); await p.waitForTimeout(1500); await p.click('#bTheme'); await p.waitForSelector('#thG .thc', { timeout: 10000 }); await p.waitForTimeout(800);
  const ten = async () => p.$$eval('#thG .thc b, #thKcG .thc b', x => x.map(e => e.textContent));
  let ds = await ten();
  // 15/11 11h09 fen "ẩn khúc này đi": bỏ dòng 🍂 Hiện / Ẩn đi; theme hết mùa nằm mục "🍂 Hết mùa" cuối lưới, thẻ mờ
  check('không còn dòng 🍂 Hiện / Ẩn đi', !(await p.$('#thMua')) && !(await p.$('#thPsMua')));
  check('theme không mùa vẫn hiện', ds.includes('Mùa UI · cả năm'), ds);
  const muc = await p.$$eval('#thG .thmuah', x => x.map(e => e.textContent));
  check('lưới chia mục mùa, mục 🍂 Hết mùa nằm cuối', muc.length >= 2 && /🍂 Hết mùa/.test(muc[muc.length - 1]) && !muc.slice(0, -1).some(x => /🍂/.test(x)), muc);
  const cuoiMuc = await p.$$eval('#thG .thmuah', x => { const h = x[x.length - 1]; const g = h && h.nextElementSibling; return g ? [...g.querySelectorAll('.thc b')].map(e => e.textContent) : []; });
  check('theme hết mùa nằm trong mục 🍂 cuối', cuoiMuc.includes('Mùa UI · hết mùa'), cuoiMuc);
  const the = await p.$eval(`.thc[data-id="${a.id}"]`, e => ({ mo: e.classList.contains('hetmua'), nhan: (e.querySelector('.thmua') || {}).textContent || '' }));
  check('thẻ hết mùa mờ + nhãn "Hết mùa · hiện lại dd/mm"', the.mo && /Hết mùa · hiện lại \d\d\/\d\d/.test(the.nhan), the);
  const coMua = r.ds.filter(t => t.mua && !t.ngoai_mua);
  if (coMua.length) {
    const n2 = await p.$eval(`.thc[data-id="${coMua[0].id}"] .thmua`, e => e.textContent).catch(() => '');
    check('thẻ đang mùa có nhãn "Mùa … · tới dd/mm"', /Mùa .+ · tới \d\d\/\d\d/.test(n2), n2);
  }
  check('thẻ không mùa không có nhãn mùa', !(await p.$(`.thc[data-id="${b.id}"] .thmua`)));
  // Thông tin: ô Mùa
  await p.click(`.thc[data-id="${a.id}"] [data-more]`); await p.click(`.thc[data-id="${a.id}"] [data-info]`); await p.waitForTimeout(300);
  const op = await p.$$eval(`.thc[data-id="${a.id}"] [data-f=mua] option`, x => x.map(e => [e.value, e.textContent, e.selected]));
  check('ô Mùa: tự theo tên + cả năm + ' + r.mua_ds.length + ' mùa', op.length === 2 + r.mua_ds.length && op[0][0] === 'auto' && op[1][0] === '', op);
  check('ô Mùa chọn sẵn mùa đang đặt', op.some(o => o[0] === a1.mua && o[2]), op);
  await p.selectOption(`.thc[data-id="${a.id}"] [data-f=mua]`, ''); await p.click(`.thc[data-id="${a.id}"] [data-iluu]`); await p.waitForTimeout(800);
  const a2 = (await j('/api/theme-canva')).ds.find(t => t.id === a.id);
  check('lưu "cả năm": theme hết ẩn', a2.mua === '' && a2.mua_chon === true && a2.ngoai_mua === false, a2);
  const the2 = await p.$eval(`.thc[data-id="${a.id}"]`, e => ({ mo: e.classList.contains('hetmua'), nhan: !!e.querySelector('.thmua') }));
  check('thẻ hết mờ, bỏ nhãn mùa', !the2.mo && !the2.nhan, the2);
  await p.screenshot({ path: 'shots/theme-mua.png', fullPage: true });
  check('không lỗi JS', !errs.length, errs);
  await br.close();
  for (const t of [a, b]) await j('/api/theme-canva', { xoa: t.id });
  console.log(`\n${dat} đạt, ${loi} lỗi`);
})();
