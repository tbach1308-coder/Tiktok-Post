// Trang 📊 Số bài theo máy (fen 15/11 10h53): nút ở cột trái, 3 khoảng Hôm nay / 7 ngày / Tháng này, bảng mỗi máy, đặt chỉ tiêu
// bằng ô số + Enter (lưu vào máy shop), bấm tên máy lọc danh sách bài; máy dùng chung không có nút, gọi API bị chặn.
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const errs = [];
  for (const [w, h] of [[1440, 900], [1024, 760]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => errs.push(e.message));
    await p.goto(A + '/'); await p.waitForTimeout(1200);
    await p.click('#bThongKe'); await p.waitForSelector('.tkpage tbody tr', { timeout: 8000 });
    const r = await p.evaluate(() => ({ hash: location.hash, on: document.querySelector('#bThongKe').classList.contains('on'), dong: document.querySelectorAll('.tkpage tbody tr').length,
      dau: document.querySelector('.tkpage tbody tr td').textContent.trim(), tong: document.querySelectorAll('.tkpage .tkso').length, tran: document.querySelector('.tkpage').scrollWidth > document.querySelector('#main').clientWidth + 2 }));
    check(w + ': bấm 📊 Số bài mở trang, nút sáng, hash #thongke', r.hash === '#thongke' && r.on, r);
    check(w + ': 4 ô tổng + bảng có dòng Máy shop đầu', r.tong === 4 && r.dong >= 1 && /Máy shop/.test(r.dau), r);
    check(w + ': không tràn ngang', !r.tran, r);
    if (w === 1440) {
      for (const k of ['tuan', 'thang', 'hom']) { await p.click(`#tkKhoang [data-k="${k}"]`); await p.waitForTimeout(200); }
      check('đổi khoảng Hôm nay / 7 ngày / Tháng này: chữ ô tổng đổi theo', await p.evaluate(() => /hôm nay/.test(document.querySelector('.tkso span').textContent)));
      await p.fill('.tkpage input[data-ct="chu"]', '5'); await p.press('.tkpage input[data-ct="chu"]', 'Enter'); await p.waitForTimeout(800);
      const tk = await j(A + '/api/thong-ke');
      check('gõ chỉ tiêu 5 + Enter: lưu ở máy shop, hiện "/ 5"', tk.b.chi_tieu.chu === 5 && await p.evaluate(() => /\/ 5/.test(document.querySelector('.tkpage tbody tr .tkct span').textContent)), tk.b.chi_tieu);
      await p.fill('.tkpage input[data-ct="chu"]', '0'); await p.press('.tkpage input[data-ct="chu"]', 'Enter'); await p.waitForTimeout(800);
      check('gõ 0: bỏ chỉ tiêu', !('chu' in (await j(A + '/api/thong-ke')).b.chi_tieu));
      await p.click('.tkpage [data-loc="chu"]'); await p.waitForTimeout(400);
      check('bấm tên máy: lọc danh sách bài bên trái theo máy đó', await p.evaluate(() => S.sbMay === 'chu' && document.querySelector('#sbMaySel') ? document.querySelector('#sbMaySel').value === 'chu' : S.sbMay === 'chu'));
      await p.reload(); await p.waitForTimeout(1800);
      check('tải lại trang (#thongke): vẫn ở trang Số bài', await p.evaluate(() => S.view === 'thongke' && !!document.querySelector('.tkpage')));
      await p.screenshot({ path: 'shots/thong-ke.png' });
    }
    await p.close();
  }
  // máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con thử số bài' }, H)).b;
  const g = await b.newPage(); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1500);
  check('máy dùng chung: không thấy nút 📊 Số bài', await g.evaluate(() => getComputedStyle(document.querySelector('#bThongKe')).display === 'none'));
  const api = await g.evaluate(() => fetch('/api/thong-ke').then(r => r.status));
  check('máy dùng chung gọi /api/thong-ke bị chặn', api === 403 || api === 404, api);
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log('KẾT QUẢ: ' + ok + ' đạt, ' + bad + ' lỗi');
})();
