// 💬 Hỏi app (fen 15/11 11h51 "thêm chat bot để hỏi", chọn "Cách dùng app + số liệu"): nút tròn góc dưới phải, khung chat, gợi ý câu
// hỏi, Enter gửi; mỗi câu 1 lượt Claude chỉ đọc (Read / Glob / Grep; cấm Bash / Write / Edit / Canva / POLY; không nạp bộ dựng bài,
// không luật chung); số liệu app đưa vào lệnh; máy dùng chung chỉ số liệu máy đó, không đọc được câu của máy khác. Claude giả trả lời.
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, T = '/home/claude/bug3/tgl';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const cho = async (id, h, u) => { for (let i = 0; i < 40; i++) { const r = await j((u || A) + '/api/hoi/' + id, null, h); if (r.b.tt !== 'dang') return r; await new Promise(x => setTimeout(x, 500)); } return null; };
(async () => {
  // --- máy chủ
  let r = await j(A + '/api/hoi', { cau: 'x' });
  check('câu quá ngắn: báo gõ câu hỏi', r.s === 400 && /Gõ câu hỏi/.test(r.b.err), r);
  r = await j(A + '/api/hoi', { cau: 'Bài nào đang chờ đăng?', lich_su: [{ text: 'chào' }, { ai: true, text: 'Chào fen' }] });
  const id = r.b.id; const kq = await cho(id);
  const args = JSON.parse(fs.readFileSync(T + '/last-args.json')), pr = fs.readFileSync(T + '/last-prompt.txt', 'utf8');
  check('máy shop hỏi: có câu trả lời', kq && kq.b.tt === 'xong' && /Trả lời thử:\*\* Bài nào đang chờ đăng\?/.test(kq.b.tra), kq && kq.b);
  const da = args.indexOf('--disallowedTools'), al = args.indexOf('--allowedTools');
  check('lượt hỏi chỉ đọc: cho Read/Glob/Grep, cấm Bash/Write/Edit/Canva/POLY, không nạp bộ dựng bài / luật chung', al >= 0 && args.slice(al + 1, al + 4).join() === 'Read,Glob,Grep'
    && ['Bash', 'Write', 'Edit', 'mcp__claude_ai_Canva', 'mcp__claude_ai_POLY'].every(t => args.slice(da + 1).includes(t)) && !args.includes('--plugin-dir') && !args.includes('--append-system-prompt-file')
    && args[args.indexOf('--model') + 1] === 'sonnet', args);
  check('lệnh có số liệu app (máy shop thấy mọi máy), file hướng dẫn, câu trước', /SỐ LIỆU APP/.test(pr) && /- Máy shop: /.test(pr) && /Bài chờ đăng \(\d+\)/.test(pr) && /HUONG-DAN\.txt/.test(pr) && /Fen: chào\nBot: Chào fen/.test(pr) && /Dùng chung/.test(pr), pr.slice(0, 1500));
  const ds = (await j(A + '/api/jobs')).b.jobs;
  check('câu hỏi không hiện thành bài trong danh sách, mã 0hoi-… (xếp cuối thư mục bài)', !ds.some(x => x.id === id) && /^0hoi-/.test(id), id);
  // --- máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con hỏi app' }, H)).b;
  const HK = Object.assign({ 'X-Poly-Khach': v.token }, H);
  r = await j(K + '/api/hoi', { cau: 'Máy này đăng mấy bài?', _khach: { id: 'gia', ten: 'giả' } }, HK);
  const kq2 = await cho(r.b.id, HK, K); const pr2 = fs.readFileSync(T + '/last-prompt.txt', 'utf8');
  check('máy dùng chung hỏi: trả lời, chỉ số liệu máy đó (không Máy shop, không Telegram / dùng chung)', kq2 && kq2.b.tt === 'xong' && /máy dùng chung "Máy con hỏi app"/.test(pr2) && !/- Máy shop: /.test(pr2) && !/Telegram Remote/.test(pr2) && !/Dùng chung \(/.test(pr2), pr2.slice(0, 1200));
  const lan = await j(K + '/api/hoi/' + id, null, HK);
  check('máy dùng chung không đọc được câu hỏi của máy shop', lan.s === 404, lan);
  // --- giao diện
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#moi'); await p.evaluate(() => { localStorage.removeItem('poly-hoi'); localStorage.removeItem('poly-hoi-cho'); }); await p.reload(); await p.waitForTimeout(1200);
  const n0 = await p.evaluate(() => ({ nut: !!document.querySelector('#hoiNut'), an: document.querySelector('#hoiBox').hidden }));
  await p.click('#hoiNut'); await p.waitForTimeout(150);
  const gy = await p.evaluate(() => [...document.querySelectorAll('#hoiDs [data-q]')].map(e => e.textContent));
  check('nút 💬 góc dưới phải, bấm mở khung, chưa hỏi thì có 3 câu gợi ý', n0.nut && n0.an && gy.length === 3 && await p.evaluate(() => !document.querySelector('#hoiBox').hidden), { n0, gy });
  await p.click('#hoiDs [data-q]'); await p.waitForTimeout(200);
  check('bấm câu gợi ý: gửi, hiện "Đang tìm câu trả lời…", nút Gửi khoá', await p.evaluate(() => /Đang tìm/.test(document.querySelector('#hoiDs').innerText) && document.querySelector('#hoiGui').disabled));
  await p.waitForFunction(() => !HOI.cho, null, { timeout: 25000 });
  const sau = await p.evaluate(() => ({ m: [...document.querySelectorAll('#hoiDs .hoim')].map(e => [e.className, e.innerHTML]), luu: JSON.parse(localStorage.getItem('poly-hoi') || '[]').length }));
  check('có câu trả lời (chữ **đậm** thành đậm), lưu lịch sử trên máy', sau.m.length === 2 && /bot/.test(sau.m[1][0]) && /<b>Trả lời thử:<\/b>/.test(sau.m[1][1]) && sau.luu === 2, sau);
  await p.fill('#hoiTxt', 'Cách đăng TikTok?'); await p.press('#hoiTxt', 'Enter'); await p.waitForTimeout(200);
  check('Enter gửi câu thứ 2 (gửi kèm câu trước)', await p.evaluate(() => HOI.ds.length === 3 && !!HOI.cho));
  await p.reload(); await p.waitForTimeout(800);
  await p.waitForFunction(() => !HOI.cho && HOI.ds.length === 4, null, { timeout: 25000 }).catch(() => {});
  check('tải lại trang lúc đang chờ: vẫn nhận câu trả lời, chấm vàng trên nút khi khung đóng', await p.evaluate(() => HOI.ds.length === 4 && HOI.ds[3].ai));
  await p.click('#hoiNut'); await p.click('#hoiXoa'); await p.waitForTimeout(100);
  check('Xoá: hết lịch sử, hiện lại câu gợi ý', await p.evaluate(() => HOI.ds.length === 0 && document.querySelectorAll('#hoiDs [data-q]').length === 3));
  await p.keyboard.press('Escape'); await p.waitForTimeout(100);
  check('Esc đóng khung', await p.evaluate(() => document.querySelector('#hoiBox').hidden));
  await p.setViewportSize({ width: 1024, height: 700 }); await p.click('#hoiNut'); await p.waitForTimeout(150);
  check('1024: khung nằm gọn trong màn hình', await p.evaluate(() => { const r = document.querySelector('#hoiBox').getBoundingClientRect(); return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight; }));
  await p.screenshot({ path: 'shots/hoi-app.png' });
  const g = await b.newPage({ viewport: { width: 1280, height: 800 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1200);
  await g.click('#hoiNut'); await g.waitForTimeout(150);
  check('máy dùng chung: có 💬, câu gợi ý của máy này', /máy này/.test(await g.evaluate(() => document.querySelector('#hoiDs').innerText)));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
