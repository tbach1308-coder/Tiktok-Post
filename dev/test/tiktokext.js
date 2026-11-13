// Tiện ích Poly TikTok thật (Chromium + tiện ích) trên máy con: trang app có data-poly-tiktok, bấm Đăng TikTok (web) mở tab TikTok,
// tiện ích lấy bài / slide qua link app bằng khoá, báo đã đăng. Máy thử không có https: bản sao tiện ích cho phép http://*.trycloudflare.com.
// chạy: cd /home/claude/bug3 && bash reset.sh && node tiktokext.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const A = 'http://127.0.0.1:8790', HOST = 'poly-thu.trycloudflare.com', H = 'http://' + HOST;
const j = (u, d) => fetch(A + u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
let ok = 0, loi = 0; const check = (n, c, x) => { c ? ok++ : loi++; console.log((c ? '✓ ' : '✗ ') + n, c ? '' : JSON.stringify(x === undefined ? '' : x).slice(0, 300)); };
(async () => {
  // bản sao tiện ích cho máy thử (http)
  const goc = '/home/claude/bug3/tgl/tiktok-ext', D = '/home/claude/bug3/_ext-thu';
  fs.rmSync(D, { recursive: true, force: true }); fs.mkdirSync(D);
  for (const f of fs.readdirSync(goc)) fs.copyFileSync(path.join(goc, f), path.join(D, f));
  const mf = JSON.parse(fs.readFileSync(path.join(D, 'manifest.json'), 'utf8'));
  mf.host_permissions.push('http://*.trycloudflare.com/*'); mf.content_scripts[1].matches.push('http://*.trycloudflare.com/*');
  fs.writeFileSync(path.join(D, 'manifest.json'), JSON.stringify(mf));
  const bg = fs.readFileSync(path.join(D, 'background.js'), 'utf8');
  fs.writeFileSync(path.join(D, 'background.js'), bg.replace('/^https:\\/\\/[\\w.-]+$/', '/^https?:\\/\\/[\\w.-]+$/'));
  check('bản sao tiện ích cho máy thử đã sửa http', fs.readFileSync(path.join(D, 'background.js'), 'utf8').includes('/^https?:'));

  let r = await j('/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = await j('/api/chung'); }
  const ma = (await j('/api/chung', { ma_moi: true })).ma;
  const ud = fs.mkdtempSync(require('path').join(require('os').tmpdir(), 'ud-'));
  const c = await chromium.launchPersistentContext(ud, { headless: true, channel: 'chromium', viewport: { width: 1440, height: 900 },
    args: ['--disable-extensions-except=' + D, '--load-extension=' + D, '--host-resolver-rules=MAP ' + HOST + ' 127.0.0.1:8791'] });
  // trang TikTok giả (máy thử không ra mạng): chỉ cần tab mở đúng link
  await c.route('https://www.tiktok.com/**', rt => rt.fulfill({ status: 200, contentType: 'text/html', body: '<html><body>TikTok gia</body></html>' }));
  const tkUrl = []; c.on('request', rq => { if (rq.url().startsWith('https://www.tiktok.com/')) tkUrl.push(rq.url()); });
  let sw = c.serviceWorkers()[0]; if (!sw) sw = await c.waitForEvent('serviceworker', { timeout: 15000 });
  check('tiện ích đã nạp (service worker chạy)', !!sw);
  const errs = []; const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto(H + '/'); await p.waitForSelector('#vaoBox', { timeout: 10000 });
  check('trang app máy con: tiện ích gắn data-poly-tiktok', (await p.evaluate(() => document.documentElement.dataset.polyTiktok)) === mf.version, await p.evaluate(() => document.documentElement.dataset.polyTiktok));
  await p.fill('#vaoMa', ma); await p.fill('#vaoTen', 'Mac thu tien ich'); await p.click('#vaoOk');
  await p.waitForSelector('#khc:not([hidden])', { timeout: 10000 });
  const done = await p.evaluate(async () => { const r = await fetch('/api/run', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({kenh: 'ipad', brief: 'Bìa: BÀI TIỆN ÍCH MÁY CON\nSlide 2: x', theme_ps: 'phang-xanh-dem'})}).then(r => r.json());
    for (let i = 0; i < 120; i++) { const v = await fetch('/api/job/' + r.id).then(x => x.json()); if ((v.job || {}).status === 'xong') return {id: r.id, n: (v.slides || []).length}; await new Promise(x => setTimeout(x, 1000)); } return {id: r.id}; });
  check('bài máy con dựng xong', done.n > 0, done);
  await p.evaluate(id => fetch('/api/job/' + id + '/caption', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({text: 'Caption tiện ích máy con #ipad\nghim'})}), done.id);
  await p.goto(H + '/#bai=' + done.id); await p.reload(); await p.waitForSelector('.post', { state: 'attached', timeout: 10000 }); await p.waitForTimeout(1200);
  check('máy con thấy nút Đăng TikTok (web)', await p.evaluate(() => { const b = document.querySelector('#bDang'); return !!b && getComputedStyle(b).display !== 'none' && /Đăng TikTok/.test(b.textContent); }));
  const [tab] = await Promise.all([c.waitForEvent('page', { timeout: 15000 }), p.click('#bDang')]);
  await tab.waitForLoadState().catch(() => {});
  await p.waitForTimeout(1500);
  check('bấm Đăng TikTok: Chrome máy con mở tab TikTok Studio đúng bài', !!tab && tkUrl.some(u => u.startsWith('https://www.tiktok.com/tiktokstudio/upload') && u.endsWith('poly=' + done.id)), tkUrl);
  await p.waitForTimeout(800);
  check('app báo đã mở TikTok, không báo lỗi', /Đã mở TikTok/.test(await p.evaluate(() => document.querySelector('#toast').textContent)), await p.evaluate(() => document.querySelector('#toast').textContent));
  const ss = await sw.evaluate(async id => (await chrome.storage.session.get('app' + id))['app' + id], done.id);
  check('tiện ích nhớ link app + khoá của bài (storage.session)', ss && ss.base === H && /^[0-9a-f]{40,64}$/.test(ss.k), ss);
  const d = await sw.evaluate(async id => { try { const d = await lay(id); return { cap: d.caption, n: d.anh.length, png: d.anh[0] && atob(d.anh[0].b64.slice(0, 8)).slice(1, 4), ten: d.ten }; } catch (e) { return { err: String(e.message || e) }; } }, done.id);
  check('tiện ích lấy caption + đủ slide (PNG) từ app máy shop qua link', d.cap && d.cap.startsWith('Caption tiện ích máy con') && d.n === done.n && d.png === 'PNG', d);
  const dg = await sw.evaluate(async id => { const r = await guiApp(id, '/api/tiktok-dang', { id, ok: true, lich: 0, brand: false }); return r.status; }, done.id);
  const v = await p.evaluate(id => fetch('/api/job/' + id).then(r => r.json()), done.id);
  check('tiện ích báo đã đăng: bài máy con chuyển Đã đăng', dg === 200 && !!v.job.da_dang, { dg, da: v.job.da_dang });
  // máy shop: bài không có link app (mở từ máy shop) vẫn lấy ở 127.0.0.1:8777 như cũ
  const shop = await sw.evaluate(async () => (await nguon('khong-co-bai')).base);
  check('bài máy shop: tiện ích vẫn dùng app 127.0.0.1:8777', shop === 'http://127.0.0.1:8777', shop);
  // trang web khác không nhờ tiện ích mở được (tin nhắn phải từ chính trang app, đúng khoá dạng)
  const la = await sw.evaluate(() => new Promise(res => chrome.runtime.onMessage.hasListeners() ? res('co') : res('khong')));
  check('service worker có nghe tin nhắn', la === 'co');
  // máy chưa có tiện ích: hộp hướng dẫn cài
  const c2 = await chromium.launch({ args: ['--host-resolver-rules=MAP ' + HOST + ' 127.0.0.1:8791'] });
  const p2 = await (await c2.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); p2.on('pageerror', e => errs.push('p2: ' + e.message));
  const ck = (await c.cookies(H)).find(x => x.name === 'pdb_k');
  await p2.context().addCookies([{ name: 'pdb_k', value: ck.value, domain: HOST, path: '/' }]);
  await p2.goto(H + '/#bai=' + done.id); await p2.waitForSelector('.post', { state: 'attached', timeout: 10000 }); await p2.waitForTimeout(1000);
  await p2.click('#bDang'); await p2.waitForTimeout(500);
  const box = await p2.evaluate(() => { const b = document.querySelector('#extBox'); return b && { h: b.querySelector('h3').textContent, tai: !!b.querySelector('a[href="/tai-tiktok-ext"]') }; });
  check('máy chưa cài tiện ích: hiện hộp Cài tiện ích + nút tải', box && /Cài tiện ích Poly TikTok/.test(box.h) && box.tai, box);
  await p2.screenshot({ path: 'shots/tiktok-cai-ext.png' });
  const [dl] = await Promise.all([p2.waitForEvent('download'), p2.click('#extBox a[href="/tai-tiktok-ext"]')]);
  check('nút Tải tiện ích tải file zip', /^poly-tiktok-[\d.]+\.zip$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  // bản cũ: hộp Cập nhật
  await p2.evaluate(() => { document.querySelector('#extDong').click(); document.documentElement.dataset.polyTiktok = '0.10.3'; });
  await p2.click('#bDang'); await p2.waitForTimeout(400);
  check('máy có bản cũ 0.10.3: hộp Cập nhật', /Cập nhật tiện ích/.test(await p2.evaluate(() => (document.querySelector('#extBox h3') || {}).textContent || '')));
  check('không lỗi JS', errs.length === 0, errs);
  await c.close(); await c2.close();
  console.log('KẾT QUẢ: %d đạt, %d lỗi', ok, loi);
  process.exit(loi ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
