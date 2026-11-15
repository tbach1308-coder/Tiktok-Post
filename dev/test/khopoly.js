// Chip "Kho Poly" trên thanh trên cùng (fen 15/11 13h10 "thêm trạng thái để biết kho poly đã được kết nối chưa") + thứ tự thanh trên cùng
// Chạy: rm -f tgl/poly-tt.json && bash reset.sh && node khopoly.js (trạng thái kho nhớ lúc app khởi động)
// (13h09 "sắp xếp thứ tự nút bấm cho hợp lý"): kết nối Canva · Kho Poly · Telegram · Remote · Máy khác | Quy tắc · Claude | Hỏi app.
// Kiểm (chỉ khi fen bấm, 13h41) = 1 lượt Claude haiku ngắn (Claude giả: FAKE_POLY_CHUA = chưa nối); quét 💡 Gợi ý từ kho thành công cũng là "đã nối". Máy dùng chung không có.
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, T = '/home/claude/bug3/tgl';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const rm = f => { try { fs.renameSync(f, '/tmp/_bo_' + Date.now() + '_' + f.split('/').pop()); } catch (e) {} };
const cho = async () => { for (let i = 0; i < 40; i++) { const r = await j(A + '/api/poly-tt'); if (r.b.tt !== 'dang') return r.b; await new Promise(x => setTimeout(x, 500)); } return null; };
(async () => {
  [T + '/poly-tt.json', T + '/FAKE_POLY_CHUA'].forEach(rm);
  await j(A + '/api/goi-y', { cach: 'poly' });   // test này thử cách connector POLY (cách Chrome: khoweb.js)
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#moi'); await p.waitForTimeout(800);
  const thu = await p.evaluate(() => [...document.querySelectorAll('.top .chip')].filter(e => !e.hidden).map(e => e.id));
  check('thanh trên cùng theo nhóm: Canva · Kho Poly · Telegram · Remote · Máy khác | Quy tắc · Claude | Hỏi app', thu.join(',') === 'bCv,bPoly,bTg,bRm,bChung,bQt,hc,hoiNut', thu);
  const pr0 = fs.existsSync(T + '/last-prompt.txt') ? fs.statSync(T + '/last-prompt.txt').mtimeMs : 0;
  await p.waitForTimeout(1500);
  check('mở app KHÔNG tự kiểm kho (fen 13h41 "có nút update mình bấm mới truy cập kho"): chip "chưa kiểm", không chạy Claude', await p.evaluate(() => S.pl && S.pl.tt === 'chua-kiem') && (fs.existsSync(T + '/last-prompt.txt') ? fs.statSync(T + '/last-prompt.txt').mtimeMs : 0) === pr0);
  await p.click('#bPoly'); await p.waitForSelector('#plKiem'); await p.click('#plKiem');
  check('bấm chip → Kiểm lại: "Kho Poly" chấm xanh', await p.waitForFunction(() => S.pl && S.pl.tt === 'noi' && /ok/.test($('#bPoly .dot').className) && $('#bPoly').innerText.trim() === 'Kho Poly', null, { timeout: 15000 }).then(() => true).catch(() => false));
  await p.evaluate(() => document.querySelectorAll('.modal').forEach(m => m.remove()));
  const pr = fs.readFileSync(T + '/last-prompt.txt', 'utf8'), ar = JSON.parse(fs.readFileSync(T + '/last-args.json'));
  check('lượt kiểm: haiku, chỉ cho tim_may, lệnh dặn không chép số liệu kho', /^Kiểm kết nối kho Polysto/.test(pr) && /KHÔNG chép số liệu kho/.test(pr) && ar[ar.indexOf('--model') + 1] === 'haiku' && ar.includes('mcp__claude_ai_POLY__tim_may') && !ar.includes('mcp__claude_ai_POLY__du_lieu_may'), ar);
  fs.writeFileSync(T + '/FAKE_POLY_CHUA', '1');
  await p.click('#bPoly'); await p.waitForSelector('#plKiem'); await p.click('#plKiem');
  await p.waitForFunction(() => S.pl && S.pl.tt === 'chua', null, { timeout: 15000 });
  const r = await p.evaluate(() => ({ chip: $('#bPoly').innerText.trim(), dot: $('#bPoly .dot').className, hop: $('#plTt').innerText }));
  check('bấm chip → hộp Kho Polysto, Kiểm lại: chưa nối thì chip đỏ "Kho Poly chưa nối", hộp ghi lý do + cách Connect', r.chip === 'Kho Poly chưa nối' && /err/.test(r.dot) && /chưa nối/.test(r.hop) && /Connect POLY/.test(r.hop) && await p.evaluate(() => /Connectors/.test(document.querySelector('.modal.on').innerText)), r);
  rm(T + '/FAKE_POLY_CHUA');
  fs.writeFileSync(T + '/FAKE_POLY_KHONG', '1');      // fen 13h28 "kho poly kết nối ntn": tài khoản chưa có POLY → hộp ghi rõ lý do
  await p.click('#plKiem'); await p.waitForFunction(() => S.pl && S.pl.tt === 'chua' && /connector POLY/.test($('#plTt').innerText), null, { timeout: 15000 }).catch(() => {});
  const r2 = await p.evaluate(() => $('#plTt').innerText), lg = fs.readFileSync(T + '/app-log.txt', 'utf8').split('\n').filter(l => /kiem poly/.test(l)).pop();
  check('Claude chỉ báo POLY_CHUA: app ghi lý do theo connector ("tài khoản Claude trên máy này chưa có connector POLY"), nhật ký ghi tên connector đang có', /chưa có connector POLY/.test(r2) && /mcp: claude\.ai Canva=connected/.test(lg || ''), { r2, lg });
  rm(T + '/FAKE_POLY_KHONG');
  await p.evaluate(() => document.querySelectorAll('.modal').forEach(m => m.remove()));
  // quét gợi ý kho thành công → đã nối
  rm(T + '/FAKE_KHO_LOI');
  await j(A + '/api/goi-y', { quet: true }); for (let i = 0; i < 40; i++) { if (!(await j(A + '/api/goi-y')).b.dang) break; await new Promise(x => setTimeout(x, 500)); }
  check('quét 💡 Gợi ý từ kho thành công: trạng thái Kho Poly = đã nối', (await j(A + '/api/poly-tt')).b.tt === 'noi');
  // máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con kho poly' }, H)).b;
  const g1 = await j(K + '/api/poly-tt', null, Object.assign({ 'X-Poly-Khach': v.token }, H));
  check('máy dùng chung: /api/poly-tt bị chặn', g1.s === 403, g1.s);
  const g = await b.newPage({ viewport: { width: 1280, height: 800 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1200);
  check('máy dùng chung: không thấy chip Kho Poly', await g.evaluate(() => getComputedStyle($('#bPoly')).display === 'none'));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  await j(A + '/api/goi-y', { cach: 'web' });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
