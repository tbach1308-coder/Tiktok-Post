// 📱 Thư viện mẫu story (fen 15/11 13h07 "phần này cho thư viện template tạo riêng, để gắn ảnh vô chạy, cho điền text"; chọn "App tự vẽ,
// mẫu có sẵn" + "Có: ảnh nền + chọn bố cục"): tab "Thư viện mẫu" trong trang Story / reel, 6 mẫu có sẵn, gắn ảnh + điền chữ → ảnh 9:16,
// fen thêm mẫu bằng ảnh nền + bố cục, bỏ mẫu (dời _to_delete), máy dùng chung làm được nhưng không thêm / bỏ mẫu.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, APP = '/home/claude/bug3/tgl';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const pil = (f, xy) => JSON.parse(execFileSync('python3', ['-c', `import json,sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');print(json.dumps([im.size,im.getpixel((${xy}))]))`, f]).toString());
execFileSync('python3', ['-c', `from PIL import Image,ImageDraw
im=Image.new('RGB',(1600,1200),'#f0f0f0');d=ImageDraw.Draw(im);d.rounded_rectangle((300,100,1300,1100),60,fill='#2b6cff');im.save('/tmp/sm-may.png')
n=Image.new('RGB',(1200,2000),'#f4e6c8');ImageDraw.Draw(n).rectangle((0,0,1200,300),fill='#c0392b');n.save('/tmp/sm-nen.jpg')`]);
(async () => {
  const api = await j(A + '/api/story-mau');
  check('API: 6 mẫu có sẵn + 4 bố cục cho mẫu fen thêm', api.b.ds.filter(x => x.san).map(x => x.id).join() === 'may-moi-ve,gia-soc,so-sanh,feedback,thong-bao,noel' && api.b.bo_cuc.length === 4, api.b);
  const xem = await fetch(A + api.b.ds[1].xem);
  check('ảnh xem trước mẫu (JPG nhỏ)', xem.status === 200 && /jpeg/.test(xem.headers.get('content-type')), xem.status);
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 900 } }); p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  await p.goto(A + '/#story'); await p.waitForSelector('#stTab');
  await p.evaluate(() => { localStorage.removeItem('poly-mau-chu'); localStorage.removeItem('poly-st-tab'); });
  await p.click('#stTab [data-tab="mau"]'); await p.waitForSelector('#mPick [data-m]');
  const t1 = await p.evaluate(() => ({ hash: location.hash, n: document.querySelectorAll('#mPick [data-m]').length, them: !!$('#mThem'), on: document.querySelector('#stTab .on').dataset.tab, chon: document.querySelector('#mPick .on').dataset.m }));
  check('tab "Thư viện mẫu": 6 mẫu có ảnh xem trước, nút Thêm mẫu của fen, chọn sẵn mẫu đầu, #storymau=…', t1.n === 6 && t1.them && t1.on === 'mau' && t1.chon === 'may-moi-ve' && t1.hash === '#storymau=may-moi-ve', t1);
  await p.click('#mPick [data-m="gia-soc"]'); await p.waitForSelector('#mc-ten');
  const f1 = await p.evaluate(() => ({ nhan: $('#mc-nhan').value, ten: $('#mc-ten').value, ph: $('#mc-ten').placeholder, anh: document.querySelectorAll('[data-a]').length, kq: !!document.querySelector('#mKq img') }));
  check('chọn Giá sốc: ô nhãn điền sẵn, ô tên máy trống (chữ gợi ý mờ), 1 ô ảnh, bên phải ảnh mẫu', f1.nhan === 'GIÁ SỐC HÔM NAY' && f1.ten === '' && /MacBook/.test(f1.ph) && f1.anh === 1 && f1.kq, f1);
  await p.fill('#mc-ten', 'iPad Air 5 M1'); await p.fill('#mc-gia', '9.990.000đ'); await p.fill('#mc-gia_cu', '11.490.000đ');
  await p.click('#mLam'); await p.waitForFunction(() => [...document.querySelectorAll('.toast')].some(t => /Gắn ảnh/.test(t.textContent)), null, { timeout: 8000 }).catch(() => {});
  check('chưa gắn ảnh: báo "Gắn ảnh vào ô …", không làm', await p.evaluate(() => [...document.querySelectorAll('.toast')].some(t => /Gắn ảnh vào ô/.test(t.textContent)) && !/Xong/.test($('#mSt').textContent)));
  await p.setInputFiles('[data-a="anh"] input', '/tmp/sm-may.png'); await p.waitForFunction(() => !$('[data-a="anh"] img').hidden, null, { timeout: 8000 });
  check('gắn ảnh: hiện ảnh nhỏ + nút Bỏ', await p.evaluate(() => /Đổi ảnh/.test($('[data-a="anh"] span').textContent) && !$('[data-xa="anh"]').hidden));
  await p.click('#mLam'); await p.waitForFunction(() => /Xong/.test($('#mSt').textContent), null, { timeout: 20000 });
  const kq = await p.evaluate(() => ({ src: $('#mKq img').src.slice(0, 22), ten: $('#mTai').getAttribute('download'), tg: !!$('#mTg'), mo: !!$('#mMo') }));
  const thang = new Date().toISOString().slice(0, 7), dir = APP + '/Story/' + thang, file = dir + '/' + kq.ten;
  check('Làm ảnh: bên phải ảnh kết quả, ⬇ Tải ảnh / 📨 Telegram / 📂 Mở thư mục, file lưu "<thư mục làm việc>/Story/<tháng>"', kq.src === 'data:image/jpeg;base64' && fs.existsSync(file) && kq.tg && kq.mo, { kq, file });
  const px = pil(file, '40,1700');
  check('ảnh 1080×1920, nền đỏ của mẫu Giá sốc', px[0][0] === 1080 && px[0][1] === 1920 && px[1][0] > 140 && px[1][1] < 60, px);
  await p.reload(); await p.waitForSelector('#mc-ten');
  check('tải lại trang: vẫn ở mẫu Giá sốc, chữ đã điền còn nguyên', await p.evaluate(() => location.hash === '#storymau=gia-soc' && $('#mc-ten').value === 'iPad Air 5 M1' && $('#mc-gia').value === '9.990.000đ'));
  const tg = await j(A + '/api/story-mau', { tg: kq.ten });
  check('📨 Gửi Telegram ảnh vừa làm (hoặc báo cần cài Telegram)', (tg.s === 200 && tg.b.ok) || /CAI_TELEGRAM/.test(tg.b.err || ''), tg);
  const xau = await j(A + '/api/story-mau', { tg: '../config.json' });
  check('gửi Telegram chỉ ảnh story trong thư mục Story', xau.s === 400, xau);
  // thêm mẫu của fen
  await p.click('#mThem'); await p.waitForSelector('#mtTen');
  await p.fill('#mtTen', 'Nền kem thử'); await p.setInputFiles('#mtNen input', '/tmp/sm-nen.jpg'); await p.waitForFunction(() => !$('#mtNen img').hidden);
  await p.selectOption('#mtBc', 'so-sanh'); await p.click('#mtChu [data-chu="den"]'); await p.click('#mtLuu');
  await p.waitForFunction(() => !document.querySelector('#mtTen') && document.querySelector('#mPick .on .kn'), null, { timeout: 15000 });
  const mt = await p.evaluate(() => ({ id: S.mauId, ten: document.querySelector('#mPick .on b').textContent, o: [...document.querySelectorAll('[data-a]')].map(x => x.dataset.a), bo: !!$('#mBo') }));
  check('Thêm mẫu của fen (ảnh nền + bố cục So sánh 2 ảnh + chữ đen): mẫu mới chọn sẵn, nhãn "của fen", 2 ô ảnh, có nút Bỏ mẫu', mt.ten === 'Nền kem thử' && mt.o.join() === 'anh1,anh2' && mt.bo && fs.existsSync(APP + '/story-mau/' + mt.id + '/nen.jpg'), mt);
  await p.setInputFiles('[data-a="anh1"] input', '/tmp/sm-may.png'); await p.setInputFiles('[data-a="anh2"] input', '/tmp/sm-may.png');
  await p.waitForFunction(() => !$('[data-a="anh2"] img').hidden); await p.fill('#mc-ten1', 'Máy A'); await p.click('#mLam');
  await p.waitForFunction(() => /Xong/.test($('#mSt').textContent), null, { timeout: 20000 });
  const f2 = dir + '/' + await p.evaluate(() => $('#mTai').getAttribute('download')), px2 = pil(f2, '540,100');
  check('làm ảnh từ mẫu fen thêm: dùng ảnh nền của fen (vùng trên đỏ)', px2[1][0] > 150 && px2[1][2] < 80, px2);
  p.once('dialog', d => d.accept()); await p.click('#mBo'); await p.waitForFunction(id => !document.querySelector(`#mPick [data-m="${id}"]`), mt.id, { timeout: 10000 });
  const dd = fs.readdirSync(APP + '/_to_delete/story-mau').filter(x => x.startsWith(mt.id));
  check('🗑 Bỏ mẫu: hết trong thư viện, thư mục mẫu dời vào _to_delete/story-mau (không xoá hẳn)', !fs.existsSync(APP + '/story-mau/' + mt.id) && dd.length === 1, dd);
  const bo2 = await j(A + '/api/story-mau', { bo: 'gia-soc' });
  check('không bỏ được mẫu có sẵn', bo2.s === 400, bo2);
  await p.screenshot({ path: 'shots/storymau.png' });
  // máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con mẫu' }, H)).b, HK = Object.assign({ 'X-Poly-Khach': v.token }, H);
  const kds = await j(K + '/api/story-mau', undefined, HK), kthem = await j(K + '/api/story-mau', { them: { ten: 'x', nen: 'data:,' } }, HK);
  const anh = 'data:image/png;base64,' + fs.readFileSync('/tmp/sm-may.png').toString('base64');
  const klam = await j(K + '/api/story-mau', { lam: { id: 'may-moi-ve', chu: { ten: 'Máy khách' }, anh: { anh } } }, HK);
  const kf = klam.b.ten && fs.readdirSync(APP + '/story-mau/_khach').some(d => fs.existsSync(APP + '/story-mau/_khach/' + d + '/' + klam.b.ten));
  check('máy dùng chung: thấy thư viện mẫu, làm được ảnh (lưu riêng story-mau/_khach/<máy>, không lộ thư mục máy shop), không thêm mẫu', kds.s === 200 && kds.b.ds.length >= 6 && klam.s === 200 && kf && klam.b.thu_muc === '' && kthem.s === 400, { k: kds.s, klam: klam.s, kf, tm: klam.b.thu_muc, kthem });
  const g = await b.newPage({ viewport: { width: 1280, height: 800 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1000);
  await g.click('#bStory'); await g.waitForSelector('#stTab'); await g.click('#stTab [data-tab="mau"]'); await g.waitForSelector('#mPick [data-m]');
  check('máy dùng chung: tab Thư viện mẫu không có Thêm mẫu / Bỏ mẫu', await g.evaluate(() => !$('#mThem') && !$('#mBo')));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
