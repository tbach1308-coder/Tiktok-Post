// Giao diện bài trùng (fen 21/11): node baitrungui.js <ids.json> <thư mục ảnh>; ids.json do baitrung.py tạo bài giữ (xem đầu file baitrung.py) hoặc tự tạo: {s, k, tok}
const { chromium } = require('playwright');
const d = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8'));
(async () => {
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1'] }); const loi = [];
  const p = await b.newPage({ viewport: { width: 1280, height: 860 } });
  p.on('pageerror', e => loi.push('admin: ' + e.message));
  await p.goto('http://127.0.0.1:8790/#bai=' + d.k); await p.waitForTimeout(2500);
  const ad = await p.evaluate(() => ({ banner: [...document.querySelectorAll('#jb .banner')].map(x => x.innerText), nut: [...document.querySelectorAll('#jb button')].map(x => x.innerText), tag: document.querySelectorAll('.trtag').length, line: [...document.querySelectorAll('.ji .jl')].map(x => x.innerText).slice(0, 3) }));
  await p.screenshot({ path: process.argv[3] + '/trung-admin.png' });
  const c = await b.newContext({ viewport: { width: 1280, height: 860 }, extraHTTPHeaders: { 'X-Poly-Khach': d.tok } });
  await c.addCookies([{ name: 'pdb_k', value: d.tok, url: 'http://poly-thu.example:8791' }]);
  const q = await c.newPage(); q.on('pageerror', e => loi.push('khach: ' + e.message));
  await q.goto('http://poly-thu.example:8791/#bai=' + d.k); await q.waitForTimeout(3000);
  const kh = await q.evaluate(() => ({ banner: [...document.querySelectorAll('#jb .banner')].map(x => x.innerText), nut: [...document.querySelectorAll('#jb button')].map(x => x.innerText), line: [...document.querySelectorAll('.ji .jl')].map(x => x.innerText).slice(0, 3) }));
  await q.screenshot({ path: process.argv[3] + '/trung-khach.png' });
  console.log(JSON.stringify({ ad, kh, loi }, null, 1)); await b.close();
})();
