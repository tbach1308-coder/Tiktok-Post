// fen 13/11 15h14 "chỉ có máy admin mới có quyền thay đổi" (quy tắc): máy dùng chung chỉ xem quy tắc, không ghi; bài máy khách không ghi luật
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  let r = (await j(A + '/api/chung', { bat: true })).b;
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = (await j(A + '/api/chung')).b; }
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Mac Quy Tắc' }, H)).b;
  const HT = Object.assign({ 'X-Poly-Khach': v.token }, H);
  const ghi = await j(K + '/api/quy-tac', { text: 'thử quy tắc từ máy khách', pham_vi: 'chung' }, HT);
  check('máy khách không ghi được quy tắc (403)', ghi.s === 403, ghi);
  const xem = await j(K + '/api/quy-tac', null, HT);
  check('máy khách vẫn xem được quy tắc', xem.s === 200, xem.s);
  const run = (await j(K + '/api/run', { kenh: 'laptop', brief: 'Bìa: BÀI QUY TẮC KHÁCH\nSlide 2: x', theme_ps: 'phang-xanh-dem' }, HT)).b;
  await new Promise(x => setTimeout(x, 1500));
  const pk = fs.readFileSync('/home/claude/bug3/tgl/jobs/' + run.id + '/prompt-1.txt', 'utf8');
  check('lệnh dựng bài của máy khách có dặn không ghi luật', pk.includes('KHÔNG ghi, KHÔNG sửa file luật'), pk.slice(-300));
  const shop = (await j(A + '/api/run', { kenh: 'laptop', brief: 'Bìa: BÀI MÁY SHOP\nSlide 2: x' })).b;
  const fp = '/home/claude/bug3/tgl/jobs/' + shop.id + '/prompt-1.txt';     // bài máy khách đang chạy thì bài này xếp hàng
  for (let i = 0; i < 90 && !fs.existsSync(fp); i++) await new Promise(x => setTimeout(x, 1000));
  const ps = fs.readFileSync(fp, 'utf8');
  check('lệnh máy shop không có dặn đó', !ps.includes('KHÔNG ghi, KHÔNG sửa file luật'));
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const g = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; g.on('pageerror', e => errs.push(e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])'); await g.waitForTimeout(800);
  await g.click('#bQt'); await g.waitForSelector('#qtBox'); await g.waitForTimeout(800);
  const qt = await g.evaluate(() => ({ o: !!document.querySelector('#qtText'), nut: !!document.querySelector('#qtGhi'), chu: document.querySelector('#qtBox').innerText.includes('chỉ máy shop thêm / sửa được') }));
  check('máy khách: hộp Quy tắc chỉ xem (không ô gõ, không nút Ghi)', !qt.o && !qt.nut && qt.chu, qt);
  const p = await b.newPage(); await p.goto(A + '/'); await p.waitForTimeout(1200); await p.click('#bQt'); await p.waitForSelector('#qtBox');
  check('máy shop: hộp Quy tắc vẫn có ô gõ + nút Ghi', await p.evaluate(() => !!document.querySelector('#qtText') && !!document.querySelector('#qtGhi')));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); console.log('KẾT QUẢ: ' + ok + ' đạt, ' + bad + ' lỗi');
})();
