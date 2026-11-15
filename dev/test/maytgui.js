// Khung 📱 Máy ↔ Telegram ở trang 📊 Số bài (fen 15/11 11h30 "quản lý máy nào link với telegram nào", chọn "Cả 2 chiều").
// (📅 Lịch đăng làm 15/11 11h50, fen 11h58 "bỏ mục này đi": đã bỏ; test này giữ phần khung Telegram + hàng nút 2 nút như cũ.)
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790';
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#moi'); await p.waitForTimeout(1200);
  const nut = await p.evaluate(() => ({ lich: !!document.querySelector('#bLich'), ds: [...document.querySelectorAll('.side .row3 .btn')].map(e => e.textContent) }));
  check('không còn nút 📅 Lịch đăng, hàng nút: 🎨 Kho theme · 📊 Số bài', !nut.lich && nut.ds.length === 2, nut);
  await p.click('#bThongKe'); await p.waitForSelector('.tkpage tbody tr');
  const tg = await p.evaluate(() => ({ co: !!document.querySelector('.tktg'), txt: (document.querySelector('.tktg') || {}).textContent || '' }));
  check('Số bài có khung 📱 Máy ↔ Telegram (chưa nối Remote: báo chưa nối)', tg.co && /Máy ↔ Telegram/.test(tg.txt) && /chưa nối Telegram/.test(tg.txt), tg);
  await p.evaluate(() => { const r = { may: [{ id: 'chu', ten: 'Máy shop', con: true }, { id: 't:mac quân', ten: 'Mac Quân', con: true }, { id: 't:cu', ten: 'Máy cũ', con: false }], bai: [], chi_tieu: {}, luc: 0,
    tg: { 't:mac quân': '222' }, nguoi: [{ id: '111', ten: 'Hoài' }, { id: '222', ten: 'Quân' }], tg_noi: true, tg_nhom: true };
    window.__goi = []; const goc = api; api = async (u, d) => { if (u === '/api/thong-ke') { if (d) window.__goi.push(d); return r; } return goc(u, d); }; stopPoll(); });
  await p.click('#bThongKe'); await p.waitForTimeout(500);
  const t2 = await p.evaluate(() => ({ dong: [...document.querySelectorAll('.tktg .tgr')].map(e => [e.querySelector('span').textContent.trim(), e.querySelector('select').value, e.querySelector('select').classList.contains('on')]) }));
  check('nối rồi: mỗi máy đang dùng chung 1 dòng (máy cũ không có), Mac Quân đang nối Quân', t2.dong.length === 2 && t2.dong[1][1] === '222' && t2.dong[1][2] && t2.dong[0][1] === '', t2);
  const gon = await p.evaluate(() => { const r = document.querySelector('.tktg').getBoundingClientRect(); return { h: Math.round(r.height), w: Math.round(r.width) }; });
  check('khung gọn: hẹp ≤ 560px, thấp (3 máy < 150px) (fen 12h09 "làm gọn lại to quá")', gon.w <= 560 && gon.h < 150, gon);
  const sang = await p.evaluate(() => [...document.querySelectorAll('.tktg select')].map(e => getComputedStyle(e).color.match(/\d+/g).slice(0, 3).reduce((a, x) => a + +x, 0) / 3));
  check('chữ trong ô chọn sáng rõ (fen 12h03 "tối thui sao thấy đường")', sang.every(x => x > 150), sang);
  await p.selectOption('.tktg select[data-tg="chu"]', '111'); await p.waitForTimeout(300);
  check('chọn người cho máy shop: gửi đúng { tg: { may, nguoi } }', await p.evaluate(() => JSON.stringify(window.__goi) === JSON.stringify([{ tg: { may: 'chu', nguoi: '111' } }])), await p.evaluate(() => window.__goi));
  check('không tràn ngang ở 1024', await (async () => { await p.setViewportSize({ width: 1024, height: 760 }); await p.waitForTimeout(300); return p.evaluate(() => document.querySelector('.tkpage').scrollWidth <= document.querySelector('#main').clientWidth + 2); })());
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
