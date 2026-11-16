// 📱 Story / reel (fen 15/11 12h36 "thay ô này thành ô chức năng làm ảnh story reel", chọn "Từ bài đã làm"; nút "Mở bài có sẵn" dời vào
// hộp Lịch sử brief): ảnh 9:16 1080×1920 từ slide (Pillow trên máy shop), nền màu viền slide / mờ, tải .zip, gửi Telegram, máy dùng chung
// chỉ làm cho bài của máy đó.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const pil = (f, xy) => JSON.parse(execFileSync('python3', ['-c', `import json,sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');print(json.dumps([im.size,im.getpixel((${xy}))]))`, f]).toString());
(async () => {
  const js = (await j(A + '/api/jobs')).b.jobs;
  let jb = null;
  for (const x of js.filter(x => x.status === 'xong' && !x.khach)) { const v = (await j(A + '/api/job/' + x.id)).b; if ((v.slides || []).length >= 2) { jb = Object.assign(x, { slides: v.slides, thu: v.job.thu_muc_bai }); break; } }
  require('fs').existsSync(jb.thu + '/story') && require('fs').renameSync(jb.thu + '/story', jb.thu + '/_story_thu_' + Date.now());     // dời ảnh story lần thử trước (không xoá)
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 900 } }); p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  await p.goto(A + '/#moi'); await p.waitForTimeout(1200);
  const nut = await p.evaluate(() => [...document.querySelectorAll('.side .new .row2:not(.row3) .btn')].map(e => e.textContent.trim()));
  check('cột trái: "📱 Story / reel" thay chỗ "Mở bài có sẵn"', nut.join('|') === '📱 Story / reel|Lịch sử brief', nut);
  await p.click('#bLs'); await p.waitForSelector('#lsCoSan'); await p.click('#lsCoSan'); await p.waitForTimeout(400);
  check('hộp Lịch sử brief có nút "📂 Mở bài có sẵn", bấm mở đúng hộp cũ', await p.evaluate(() => [...document.querySelectorAll('.modal.on h3')].some(h => /Mở bài có sẵn/.test(h.textContent))));
  await p.evaluate(() => document.querySelectorAll('.modal').forEach(m => m.remove()));
  await p.click('#bStory'); await p.waitForSelector('.stpage .stpick');
  const tr = await p.evaluate(() => ({ view: S.view, hash: location.hash, on: $('#bStory').classList.contains('on'), n: document.querySelectorAll('.stpick [data-st]').length, chon: document.querySelectorAll('.stpick .on').length, modal: !!document.querySelector('.modal.on') }));
  check('bấm Story / reel: mở trang riêng #story (fen 12h50 "cho tab riêng"), nút sáng, hàng bài đã làm, chọn sẵn bài mới nhất, không hộp nổi', tr.view === 'story' && /^#story/.test(tr.hash) && tr.on && tr.n > 0 && tr.chon === 1 && !tr.modal, tr);
  await p.click(`.stpick [data-st="${jb.id}"]`); await p.waitForSelector('#stG'); await p.waitForFunction(() => !/Đang tải/.test($('#stG').innerText), null, { timeout: 10000 });
  check('chọn bài: bài đó viền xanh, tên bài trên thanh, chưa có ảnh thì ghi số slide', await p.evaluate(id => /Chưa có ảnh story/.test($('#stG').innerText) && $('#stTg').disabled && document.querySelector('.stpick .on').dataset.st === id && location.hash === '#story=' + id, jb.id));
  await p.click('#stNen [data-nen="mau"]'); await p.click('#stLam'); await p.waitForFunction(() => document.querySelectorAll('#stG img').length > 0, null, { timeout: 20000 });
  const n = await p.evaluate(() => document.querySelectorAll('#stG img').length);
  const f1 = jb.thu + '/story/story-' + String(jb.slides[0].n).padStart(2, '0') + '.jpg';
  const a1 = pil(f1, '540,100');
  check('Làm ảnh story: mỗi slide 1 ảnh 1080×1920 (JPG trong thư mục bài/story)', n === jb.slides.length && a1[0][0] === 1080 && a1[0][1] === 1920, { n, sl: jb.slides.length, a1 });
  const z = await fetch(A + '/api/job/' + jb.id + '/story.zip'); const zb = Buffer.from(await z.arrayBuffer());
  check('⬇ Tải tất cả: .zip có đủ ảnh', z.status === 200 && zb.slice(0, 2).toString() === 'PK' && (zb.toString('latin1').match(/story-\d+\.jpg/g) || []).length >= n * 2, z.status);
  await p.click('#stNen [data-nen="mo"]'); await p.click('#stLam'); await p.waitForFunction(() => /Xong/.test($('#stSt').textContent), null, { timeout: 20000 }); await p.waitForTimeout(300);
  const a2 = pil(f1, '540,100');
  check('Nền Mờ: làm lại, vùng trên khác nền màu phẳng, nhớ lựa chọn', JSON.stringify(a2[1]) !== JSON.stringify(a1[1]) && (await j(A + '/api/job/' + jb.id + '/story')).b.nen === 'mo', [a1[1], a2[1]]);
  const tg = await j(A + '/api/job/' + jb.id + '/story-tg', {});
  check('📨 Gửi Telegram: gửi đủ ảnh (hoặc báo cần cài Telegram)', (tg.s === 200 && tg.b.n === n) || /CAI_TELEGRAM/.test(tg.b.err || ''), tg);
  await p.reload(); await p.waitForSelector('#stG img', { timeout: 15000 });
  check('tải lại trang (#story=…): vẫn ở trang Story, đúng bài, thấy ảnh', await p.evaluate(id => S.view === 'story' && S.stId === id, jb.id));
  // đang mở 1 bài: bấm Story / reel chọn sẵn bài đó
  await p.goto(A + '/#bai=' + jb.id); await p.reload(); await p.waitForSelector('#fixCard', { timeout: 15000 });
  await p.click('#bStory'); await p.waitForSelector('#stG'); await p.waitForFunction(() => !/Đang tải/.test($('#stG').innerText), null, { timeout: 10000 });
  check('đang mở 1 bài xong: bấm Story / reel chọn sẵn bài đó, thấy ảnh đã làm', await p.evaluate(id => document.querySelectorAll('#stG img').length > 0 && S.stId === id, jb.id));
  await p.screenshot({ path: 'shots/story.png' });
  // máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con story' }, H)).b;
  const r = await j(K + '/api/job/' + jb.id + '/story', { nen: 'mau' }, Object.assign({ 'X-Poly-Khach': v.token }, H));
  check('máy dùng chung: không làm được story cho bài của máy shop', r.s === 404, r);
  const g = await b.newPage({ viewport: { width: 1280, height: 800 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1200);
  check('máy dùng chung: có nút Story / reel, hộp Lịch sử brief không có Mở bài có sẵn', await g.evaluate(async () => { const c = getComputedStyle($('#bStory')).display !== 'none'; $('#bLs').click(); await new Promise(x => setTimeout(x, 400)); return c && !document.querySelector('#lsCoSan'); }));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
