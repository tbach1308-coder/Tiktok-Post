// Giao diện Đăng TikTok (web) trên máy dùng chung (fen 14/11 18h07 "cho máy phú có chức năng này và file extion"):
// chưa cài tiện ích -> hộp hướng dẫn + tải file; có tiện ích 0.11 -> đưa vé cho tiện ích rồi mở TikTok ngay trên máy đó.
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', H = 'http://poly-thu.example';
const j = (u, d) => fetch(A + u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
let ok = 0, loi = 0; const check = (n, c, x) => { if (c) { ok++; console.log('✓ ' + n); } else { loi++; console.log('✗ ' + n, x === undefined ? '' : JSON.stringify(x)); } };
(async () => {
  let r = await j('/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = await j('/api/chung'); }
  r = await j('/api/chung', { ma_moi: true });
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const errs = [];
  const c1 = await b.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true }); const p = await c1.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto(H + '/'); await p.waitForSelector('#vaoBox', { timeout: 8000 });
  await p.fill('#vaoMa', r.ma); await p.fill('#vaoTen', "phupoly’s Mac mini"); await p.click('#vaoOk');
  await p.waitForSelector('#khc:not([hidden])', { timeout: 10000 });
  const done = await p.evaluate(async () => { const r = await fetch('/api/run', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({kenh: 'ipad', brief: 'Bìa: ĐĂNG TIKTOK MÁY PHÚ\nSlide 2: x', theme_ps: 'phang-xanh-dem'})}).then(r => r.json());
    for (let i = 0; i < 90; i++) { const v = await fetch('/api/job/' + r.id).then(x => x.json()); if ((v.job || {}).status === 'xong') break; await new Promise(x => setTimeout(x, 1000)); }
    await fetch('/api/job/' + r.id + '/caption', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({text: 'Caption máy Phú #ipad'})});
    return {id: r.id}; });
  await p.goto(H + '/#bai=' + done.id); await p.reload(); await p.waitForSelector('#bDang', { timeout: 10000 }); await p.waitForTimeout(800);
  check('máy khác thấy nút Đăng TikTok (web) + 🧩 Tiện ích TikTok', await p.evaluate(() => getComputedStyle(document.querySelector('#bDang')).display !== 'none' && !!document.querySelector('#bTienIch')));
  // 1) chưa cài tiện ích
  await p.click('#bDang'); await p.waitForTimeout(600);
  const hop = await p.evaluate(() => { const m = [...document.querySelectorAll('.modal.on')].pop(); return m ? { chu: m.textContent, tai: !!m.querySelector('a[href="/tai-tien-ich"]') } : null; });
  check('chưa cài tiện ích: hiện hộp hướng dẫn cài + nút tải file', hop && hop.tai && /chưa có tiện ích/.test(hop.chu) && /chrome:\/\/extensions/.test(hop.chu), hop);
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('.modal.on a[href="/tai-tien-ich"]')]);
  check('tải file tiện ích', /^Poly-TikTok-tien-ich-0\.11\.1\.zip$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  await p.screenshot({ path: 'shots/tiktok-khach-cai.png' });
  await p.click('#tiDong');
  check('chưa cài: không mở TikTok, không cấp vé', !((await j('/api/job/' + done.id)).da_gui || []).some(x => x.kieu === 'tiktok'));
  // 2) bản cũ 0.10.3
  await p.evaluate(() => { document.documentElement.dataset.polyTiktok = '0.10.3'; });
  await p.click('#bDang'); await p.waitForTimeout(500);
  check('tiện ích bản cũ: báo cập nhật', await p.evaluate(() => /bản cũ 0\.10\.3/.test(([...document.querySelectorAll('.modal.on')].pop() || {}).textContent || '')));
  await p.click('#tiDong');
  // 3) tiện ích 0.11 (giả app.js: nhận vé, trả lời đã nhớ)
  await p.evaluate(() => {
    document.documentElement.dataset.polyTiktok = '0.11.0'; window.__ve = null; window.__mo = [];
    addEventListener('message', e => { const m = e.data && e.data.polyTiktok; if (m) { window.__ve = m; postMessage({ polyTiktokOk: m.id }, location.origin); } });
    const goc = window.open; window.open = (u, t) => { const w = { closed: false, location: { href: u }, close() { this.closed = true; } }; window.__mo.push(w); return w; };
  });
  await p.click('#bDang'); await p.waitForTimeout(2500);
  const kq = await p.evaluate(() => ({ ve: window.__ve, mo: window.__mo.map(w => w.location.href), dong: window.__mo.map(w => w.closed) }));
  check('có tiện ích: đưa {mã bài, vé} cho tiện ích trên trang', kq.ve && kq.ve.id === done.id && kq.ve.ve && kq.ve.ve.length >= 30, kq);
  check('mở TikTok Studio ngay trên máy này, link chỉ có ?poly=<mã bài>', kq.mo.length === 1 && /^https:\/\/www\.tiktok\.com\/tiktokstudio\/upload\?.*poly=/.test(kq.mo[0]) && kq.mo[0].endsWith('poly=' + done.id) && !kq.dong[0], kq);
  const dg = (await j('/api/job/' + done.id)).da_gui || [];
  check('app ghi đã mở TikTok từ máy Phú', dg.some(x => x.kieu === 'tiktok' && /phupoly/.test(x.may || '')), dg);
  const ve = kq.ve && kq.ve.ve;
  const td = await fetch('http://127.0.0.1:8791/api/tiktok/' + done.id, { headers: { Host: 'poly-thu.example', Origin: 'chrome-extension://abcdefghijklmnopabcdefghijklmnop', 'X-Poly-Ve': ve } }).then(x => x.json());
  check('vé trang đưa cho tiện ích đọc được bài', td.caption === 'Caption máy Phú #ipad' && (td.files || []).length > 0, td);
  // 4) bấm lại: hỏi mở lại, đồng ý thì mở tiếp
  p.once('dialog', d => d.accept());
  await p.click('#bDang'); await p.waitForTimeout(2500);
  check('bấm lại: hỏi rồi mở lần 2', (await p.evaluate(() => window.__mo.length)) === 2);
  await p.click('#bTienIch'); await p.waitForTimeout(300);
  check('nút 🧩 Tiện ích TikTok: bản mới nhất', await p.evaluate(() => /bản 0\.11\.0 \(mới nhất\)/.test(([...document.querySelectorAll('.modal.on')].pop() || {}).textContent || '')));
  await p.screenshot({ path: 'shots/tiktok-khach-moi.png' });
  // máy shop: nút như cũ (không đi đường vé)
  const c4 = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p4 = await c4.newPage(); p4.on('pageerror', e => errs.push('chu: ' + e.message));
  await p4.goto(A + '/#bai=' + done.id); await p4.waitForSelector('#bDang', { timeout: 10000 });
  check('máy shop không có nút 🧩 (tiện ích cài trên máy shop như cũ)', !(await p4.$('#bTienIch')));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j('/api/chung', { bat: false });
  console.log('\nKẾT QUẢ: ' + ok + ' đạt, ' + loi + ' lỗi');
})().catch(e => { console.log('LỖI', e); process.exit(1); });
