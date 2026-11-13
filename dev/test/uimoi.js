// fen 13/11 15h30 "cho máy con tự hiện thông báo bấm update khi có bản mới": máy khách không tự tải lại, hiện nút Cập nhật; máy shop rảnh thì tự tải lại
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, UI = '/home/claude/bug3/tgl/ui/index.html';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  let r = await j(A + '/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = await j(A + '/api/chung'); }
  const ma = (await j(A + '/api/chung', { ma_moi: true })).ma;
  const v = await j(K + '/api/chung/vao', { ma, ten: 'Mac Bản Mới' }, H);
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const g = await b.newPage(); const errs = []; g.on('pageerror', e => errs.push(e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])'); await g.waitForTimeout(1500);
  const p = await b.newPage(); await p.goto(A + '/'); await p.waitForTimeout(1500);
  await g.evaluate(() => { window.__chuaTai = 1; }); await p.evaluate(() => { window.__chuaTai = 1; });
  const t = new Date(Date.now() + 5000); fs.utimesSync(UI, t, t);          // giả như vừa chép bản giao diện mới
  await g.waitForSelector('#uiMoi', { timeout: 30000 }).catch(() => {});
  const kh = await g.evaluate(() => ({ con: window.__chuaTai === 1, bao: (document.querySelector('#uiMoi') || {}).innerText || '' }));
  check('máy khách: không tự tải lại, hiện thanh có nút Cập nhật', kh.con && /Cập nhật/.test(kh.bao), kh);
  await p.waitForFunction(() => window.__chuaTai !== 1, null, { timeout: 30000 }).catch(() => {});
  check('máy shop (đang rảnh): vẫn tự tải lại như cũ', await p.evaluate(() => window.__chuaTai !== 1));
  await g.click('#uiMoiTai'); await g.waitForTimeout(2500);
  check('máy khách bấm Cập nhật: tải lại, hết thanh', await g.evaluate(() => window.__chuaTai !== 1 && !document.querySelector('#uiMoi')));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); console.log('KẾT QUẢ: ' + ok + ' đạt, ' + bad + ' lỗi');
})();
