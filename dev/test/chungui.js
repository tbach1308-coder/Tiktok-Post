const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', H = 'http://poly-thu.example';
const j = (u, d) => fetch(A + u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
(async () => {
  let r = await j('/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = await j('/api/chung'); }
  r = await j('/api/chung', { ma_moi: true });
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const out = {}; const errs = [];
  const c1 = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await c1.newPage(); p.on('pageerror', e => errs.push('khach: ' + e.message));
  await p.goto(H + '/'); await p.waitForSelector('#vaoBox', { timeout: 8000 });
  await p.screenshot({ path: 'shots/chung-vao.png' });
  await p.fill('#vaoMa', '111111'); await p.click('#vaoOk'); await p.waitForTimeout(800);
  out.saiMa = await p.$eval('#vaoErr', x => x.textContent);
  await p.fill('#vaoMa', r.ma); await p.fill('#vaoTen', 'MacBook Quân'); await p.click('#vaoOk');
  await p.waitForSelector('#khc:not([hidden])', { timeout: 10000 }); await p.waitForTimeout(1500);
  out.khc = await p.$eval('#khc', x => x.textContent);
  out.an = await p.evaluate(() => ['#bChung', '#bRm', '#bQt', '#bTg', '#hc'].map(s => [s, !!document.querySelector(s) && getComputedStyle(document.querySelector(s)).display !== 'none']));
  await p.screenshot({ path: 'shots/chung-khach.png' });
  const done = await p.evaluate(async () => { const r = await fetch('/api/run', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({kenh: 'laptop', brief: 'Bìa: BÀI MÁY KHÁC\nSlide 2: x'})}).then(r => r.json());
    for (let i = 0; i < 90; i++) { const v = await fetch('/api/job/' + r.id).then(x => x.json()); if ((v.job || {}).status === 'xong') return {id: r.id}; await new Promise(x => setTimeout(x, 1000)); } return {id: r.id}; });
  await p.goto(H + '/#bai=' + done.id); await p.reload(); await p.waitForSelector('.post', { state: 'attached', timeout: 10000 }); await p.waitForTimeout(1200);
  out.post = await p.evaluate(() => ({ zip: !!document.querySelector('#bZip'), dang: getComputedStyle(document.querySelector('#bDang')).display, tg: getComputedStyle(document.querySelector('#bGuiTg')).display, mo: document.querySelector('#bOpen') ? getComputedStyle(document.querySelector('#bOpen')).display : 'không có' }));
  await (await p.$('.post')).screenshot({ path: 'shots/chung-post.png' });
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('#bZip')]); out.zip = dl.suggestedFilename();
  // app Mac mở kèm #vao=token
  const m2 = await j('/api/chung', { ma_moi: true });
  const v = await fetch('http://127.0.0.1:8791/api/chung/vao', { method: 'POST', headers: { 'Content-Type': 'application/json', Host: 'poly-thu.example' }, body: JSON.stringify({ ma: m2.ma, ten: 'Mac app' }) }).then(x => x.json());
  const c2 = await b.newContext({ viewport: { width: 1280, height: 800 } }); const p2 = await c2.newPage(); p2.on('pageerror', e => errs.push('mac: ' + e.message));
  await p2.goto(H + '/#vao=' + v.token); await p2.waitForSelector('#khc:not([hidden])', { timeout: 10000 });
  out.macApp = { khc: await p2.$eval('#khc', x => x.textContent), hash: await p2.evaluate(() => location.hash), vao: !!(await p2.$('#vaoBox')) };
  // điện thoại 400px: màn nhập mã
  const c3 = await b.newContext({ viewport: { width: 400, height: 800 } }); const p3 = await c3.newPage();
  await p3.goto(H + '/'); await p3.waitForSelector('#vaoBox'); await p3.screenshot({ path: 'shots/chung-vao-400.png' });
  out.ngang400 = await p3.evaluate(() => document.documentElement.scrollWidth <= 400);
  // máy chủ: hộp Máy khác
  const c4 = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p4 = await c4.newPage(); p4.on('pageerror', e => errs.push('chu: ' + e.message));
  await p4.goto(A + '/'); await p4.waitForTimeout(1500); await p4.click('#bChung'); await p4.waitForSelector('#chBox .chmay', { timeout: 8000 });
  await (await p4.$('#chBox')).screenshot({ path: 'shots/chung-chu.png' });
  out.chu = await p4.$eval('#chSt', x => x.textContent.slice(0, 300));
  out.chip = await p4.$eval('#bChung .dot', x => x.className);
  out.errs = errs; console.log(JSON.stringify(out, null, 1)); await b.close();
})();
