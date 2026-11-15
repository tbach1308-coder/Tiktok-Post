// Ô "Máy" trên danh sách bài (fen 15/11 11h13 "máy nào thì sẽ để mặc định hiển thị máy đó"): máy shop mở app là đang lọc
// Máy shop (ô không sáng xanh), chọn Tất cả máy thì thấy cả bài máy dùng chung, tải lại về Máy shop; mở 1 bài của máy khác
// (link #bai=, Telegram xem:) thì danh sách chuyển sang máy đó. 📊 Số bài chỉ máy shop: máy dùng chung mở #thongke không vào được.
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const O = `window.__o = () => { const s = document.querySelector('#sbMaySel'); return { may: S.sbMay, val: s && s.value, on: !!s && s.classList.contains('on'), tong: [...document.querySelectorAll('#sbTabs b')].reduce((a, e) => a + (+e.textContent || 0), 0) }; };`;
const o = () => window.__o();
(async () => {
  const ds = (await j(A + '/api/jobs')).b; const jobs = ds.jobs || ds;
  const kh = jobs.find(x => x.khach && x.khach.id), chu = jobs.filter(x => !x.khach).length;
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message)); await p.addInitScript(O);
  await p.goto(A + '/#moi'); await p.waitForTimeout(1500);
  let r = await p.evaluate(o);
  check('máy shop mở app: mặc định lọc Máy shop, ô không sáng xanh', r.may === 'chu' && r.val === 'chu' && !r.on, r);
  await p.selectOption('#sbMaySel', ''); await p.waitForTimeout(400);
  const r2 = await p.evaluate(o);
  check('chọn Tất cả máy: thấy thêm bài máy dùng chung', r2.may === '' && r2.tong > r.tong && !r2.on, [r, r2]);
  await p.reload(); await p.waitForTimeout(1500);
  check('tải lại: về Máy shop', (await p.evaluate(o)).may === 'chu');
  if (kh) {
    await p.goto(A + '/#bai=' + kh.id); await p.reload(); await p.waitForTimeout(1800);
    const r3 = await p.evaluate(id => Object.assign(window.__o(), { act: !!document.querySelector('#jobs .ji.on[data-id="' + id + '"], #jobs [data-id="' + id + '"].on'), k: mayKhoa((S.jobs.find(x => x.id === id).khach || {}).ten) }), kh.id);
    check('mở link bài của máy dùng chung: danh sách chuyển sang máy đó, ô sáng xanh', r3.may === r3.k && r3.val === r3.k && r3.on, r3);
    const motChu = jobs.find(x => !x.khach && x.status === 'xong');
    if (motChu) { await p.evaluate(id => openJob(id), motChu.id); await p.waitForTimeout(600);
      check('mở bài máy shop: danh sách về Máy shop', (await p.evaluate(o)).may === 'chu'); }
    await p.selectOption('#sbMaySel', ''); await p.waitForTimeout(300); await p.evaluate(id => openJob(id), kh.id); await p.waitForTimeout(500);
    check('đang chọn Tất cả máy thì mở bài máy khác không đổi lọc', (await p.evaluate(o)).may === '');
  } else check('có bài máy dùng chung để thử', false, chu);
  await p.screenshot({ path: 'shots/may-mac-dinh.png' });
  // máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con thử mặc định' }, H)).b;
  const g = await b.newPage(); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1500);
  const gk = await g.evaluate(() => ({ may: S.sbMay, sel: !!document.querySelector('#sbMaySel'), nut: getComputedStyle(document.querySelector('#bThongKe')).display }));
  check('máy dùng chung: không có ô Máy, không lọc, không thấy nút 📊 Số bài', gk.may === '' && !gk.sel && gk.nut === 'none', gk);
  await g.evaluate(() => { location.hash = 'thongke'; }); await g.reload(); await g.waitForTimeout(1800);
  await g.evaluate(() => thongKe()); await g.waitForTimeout(500);
  check('máy dùng chung mở #thongke / gọi thongKe(): không vào trang Số bài', await g.evaluate(() => S.view !== 'thongke' && !document.querySelector('.tkpage')));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
