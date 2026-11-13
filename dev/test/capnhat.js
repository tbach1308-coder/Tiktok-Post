// fen 13/11 20h26 "app con không cần bấm update, mình cho nút chủ động bấm update luôn": máy shop bấm "Cập nhật máy con"
// -> máy con đang mở app tự tải bản mới (không bấm gì); máy con đang gõ dở thì chờ rảnh mới tải; máy shop thấy máy nào đã là bản mới.
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, UI = '/home/claude/bug3/tgl/ui/index.html';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const ngu = ms => new Promise(x => setTimeout(x, ms));
const doiBan = s => { const t = new Date(Date.now() + s * 1000); fs.utimesSync(UI, t, t); };      // giả như vừa chép bản giao diện mới
(async () => {
  let r = await j(A + '/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await ngu(500); r = await j(A + '/api/chung'); }
  const ma = (await j(A + '/api/chung', { ma_moi: true })).ma;
  const v = await j(K + '/api/chung/vao', { ma, ten: 'Mac Cập Nhật' }, H);
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const errs = [];
  const g = await b.newPage(); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])'); await g.waitForTimeout(2500);
  const st0 = await j(A + '/api/chung');
  const may0 = (st0.may || []).find(x => x.ten === 'Mac Cập Nhật') || {};
  check('máy shop thấy máy con đang là bản mới (máy con báo bản đang mở)', may0.ui_moi === true, may0);
  // 1. có bản mới, chưa bấm: máy con hiện thanh Cập nhật như cũ, chưa tự tải
  await g.evaluate(() => { window.__chuaTai = 1; });
  doiBan(5);
  await g.waitForSelector('#uiMoi', { timeout: 20000 }).catch(() => {});
  check('có bản mới: máy con hiện thanh Cập nhật, chưa tự tải lại', await g.evaluate(() => window.__chuaTai === 1 && !!document.querySelector('#uiMoi')));
  await ngu(3500);
  const st1 = await j(A + '/api/chung');
  check('máy shop thấy máy con đang bản cũ', ((st1.may || []).find(x => x.ten === 'Mac Cập Nhật') || {}).ui_moi === false, st1.may);
  // 2. máy shop mở hộp Dùng chung, bấm "Cập nhật máy con"
  const p = await b.newPage(); p.on('pageerror', e => errs.push('shop: ' + e.message));
  await p.goto(A + '/'); await p.waitForTimeout(2000);
  await p.evaluate(() => chungDlg()); await p.waitForSelector('#chCapNhat', { timeout: 15000 }).catch(() => {});
  check('hộp Dùng chung có nút "Cập nhật máy con" + máy con ghi "bản cũ"', !!(await p.$('#chCapNhat')) && /bản cũ/.test(await p.$eval('#chSt', e => e.innerText)));
  await p.click('#chCapNhat');
  await g.waitForFunction(() => window.__chuaTai !== 1, null, { timeout: 15000 }).catch(() => {});
  check('máy con đang rảnh: tự tải bản mới, không phải bấm gì', await g.evaluate(() => window.__chuaTai !== 1 && !document.querySelector('#uiMoi')));
  await g.waitForTimeout(4000);
  check('hộp máy shop: máy con thành "✓ bản mới", có giờ đã gửi', await p.$eval('#chSt', e => /✓ bản mới/.test(e.innerText) && /đã gửi lúc/.test(e.innerText)).catch(() => false));
  // 3. máy con đang gõ dở: chưa tải; gõ xong (bỏ chọn ô) thì tự tải
  await g.waitForSelector('textarea, input[type=text]', { timeout: 10000 });
  await g.evaluate(() => { window.__chuaTai = 1; const t = document.querySelector('textarea') || document.querySelector('input[type=text]'); t.focus(); });
  doiBan(15); await ngu(6000);
  await p.reload(); await p.waitForTimeout(1500); await p.evaluate(() => chungDlg()); await p.waitForSelector('#chCapNhat');
  await p.click('#chCapNhat'); await ngu(8000);
  check('máy con đang gõ dở: KHÔNG tự tải (khỏi mất chữ đang gõ)', await g.evaluate(() => window.__chuaTai === 1));
  await g.evaluate(() => document.activeElement && document.activeElement.blur());
  await g.waitForFunction(() => window.__chuaTai !== 1, null, { timeout: 15000 }).catch(() => {});
  check('gõ xong (bỏ chọn ô): tự tải bản mới', await g.evaluate(() => window.__chuaTai !== 1));
  // 4. máy shop bấm khi máy con đã là bản mới: không tải lại vô ích
  await g.waitForTimeout(2000); await g.evaluate(() => { window.__chuaTai = 1; });
  await p.click('#chCapNhat').catch(async () => { await p.evaluate(() => chungDlg()); await p.click('#chCapNhat'); });
  await ngu(8000);
  check('máy con đã là bản mới: bấm Cập nhật không làm tải lại', await g.evaluate(() => window.__chuaTai === 1));
  const s403 = await fetch(K + '/api/chung', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json', 'X-Poly-Khach': v.token }, H), body: JSON.stringify({ cap_nhat: true }) }).then(x => x.status);
  check('máy con không tự bấm "Cập nhật máy con" được (chỉ máy shop)', s403 === 403 || s403 === 404, s403);
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log('KẾT QUẢ: ' + ok + ' đạt, ' + bad + ' lỗi');
})();
