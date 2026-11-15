// 💡 Gợi ý bài từ kho (fen 15/11 11h23 chọn "Gợi ý bài từ hàng mới về"): dòng gọn dưới ô Kho ở Bài mới (máy shop cập nhật, máy con xem — fen 13h31), 🔄 Quét kho = 1 lượt
// Claude chỉ đọc kho (tim_may / du_lieu_may; cấm Bash / Write / Edit / Canva / anh_may; không bộ dựng bài), kết quả dòng GOI_Y_JSON; lần
// quét đầu coi hết là hàng cũ, lần sau dòng máy mới thấy = 🆕; "Dùng" điền chủ đề + tên máy vào ô Kho; tự quét 7h30 bật / tắt; máy dùng
// chung không thấy, API chặn. Claude giả (FAKE_KHO2 = thêm 1 dòng máy mới, FAKE_KHO_LOI = báo lỗi).
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, T = '/home/claude/bug3/tgl';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const rm = f => { try { fs.renameSync(f, '/tmp/_bo_' + Date.now() + '_' + f.split('/').pop()); } catch (e) {} };      // dời đi, không xoá
const cho = async () => { for (let i = 0; i < 40; i++) { const r = await j(A + '/api/goi-y'); if (!r.b.dang) return r.b; await new Promise(x => setTimeout(x, 500)); } return null; };
(async () => {
  [T + '/goi-y-kho.json', T + '/kho-snap.json', T + '/FAKE_KHO2', T + '/FAKE_KHO_LOI'].forEach(rm);
  let r = await j(A + '/api/goi-y');
  check('chưa quét: không có gợi ý, tự quét tắt', r.s === 200 && !(r.b.ds || []).length && r.b.tu === false, r.b);
  // --- giao diện trước khi quét
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 900 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#moi'); await p.evaluate(() => localStorage.removeItem('poly-gy-mo')); await p.reload(); await p.waitForSelector('#gyKho .gyhd', { timeout: 15000 });
  check('Bài mới: dòng 💡 Gợi ý từ kho dưới ô Kho, chưa cập nhật thì ghi cách dùng + nút 🔄 Cập nhật kho (fen 13h31: máy con xem được)', await p.evaluate(() => /Chưa cập nhật/.test(document.querySelector('#gyKho').innerText) && /máy con xem được/.test(document.querySelector('#gyKho').innerText) && /Cập nhật kho/.test(document.querySelector('#gyQuet').textContent)));
  await p.click('#gyQuet'); await p.waitForTimeout(400);
  const args = JSON.parse(fs.readFileSync(T + '/last-args.json')), pr = fs.readFileSync(T + '/last-prompt.txt', 'utf8');
  const al = args.indexOf('--allowedTools'), da = args.indexOf('--disallowedTools');
  check('lượt quét chỉ đọc: cho tim_may + du_lieu_may (+ đọc file), cấm Bash / Write / Edit / Canva / anh_may, không bộ dựng bài, Sonnet',
    args.slice(al + 1, da).join() === 'Read,Glob,Grep,mcp__claude_ai_POLY__tim_may,mcp__claude_ai_POLY__du_lieu_may' && ['Bash', 'Write', 'Edit', 'mcp__claude_ai_Canva', 'mcp__claude_ai_POLY__anh_may'].every(t => args.slice(da + 1).includes(t))
    && !args.includes('--plugin-dir') && !args.includes('--append-system-prompt-file') && args[args.indexOf('--model') + 1] === 'sonnet', args);
  check('lệnh: hãng / dòng 2 kênh, không seri / giá vốn, bài 45 ngày qua để tránh trùng, trả GOI_Y_JSON', /Dell, ThinkPad/.test(pr) && /iPad Pro, iPad Air/.test(pr) && /KHÔNG ghi seri, giá vốn/.test(pr) && /45 ngày/.test(pr) && /GOI_Y_JSON/.test(pr), pr.slice(0, 600));
  let d = await cho();
  check('quét xong lần đầu: 2 dòng máy, 2 gợi ý, chưa có 🆕 (lần đầu coi là hàng cũ)', d && d.may.length === 2 && d.ds.length === 2 && !d.ds.some(x => x.moi) && d.lan_dau, d);
  await p.waitForFunction(() => S.gy && !S.gy.dang && S.gy.luc, null, { timeout: 15000 });
  const gy = await p.evaluate(() => ({ st: document.querySelector('#gyKho .gyst').innerText, mo: !!document.querySelector('#gyMo'), ds: document.querySelectorAll('#gyKho .gyi').length, h: document.querySelector('#gyKho').getBoundingClientRect().height }));
  check('xong: dòng gọn "1 gợi ý Laptop · 1 dòng máy · cập nhật …", danh sách đóng (bấm Xem mới mở)', /1 gợi ý Laptop · 1 dòng máy · cập nhật/.test(gy.st) && gy.mo && gy.ds === 0 && gy.h < 50, gy);
  await p.click('#gyMo'); await p.waitForTimeout(150);
  const it = await p.evaluate(() => [...document.querySelectorAll('#gyKho .gyi')].map(e => e.innerText));
  check('Xem: gợi ý đúng kênh đang chọn (Laptop: Dell 7420 + giá + chủ đề + lý do)', it.length === 1 && /Dell Latitude 7420/.test(it[0]) && /12,9–13,5 triệu/.test(it[0]) && /4 máy/.test(it[0]), it);
  const my = await p.evaluate(() => [...document.querySelectorAll('#gyKho .gymay [data-gm]')].map(e => e.innerText));
  check('Xem: thêm "📦 Máy trong kho" của kênh (tên · số máy · giá bán)', my.length === 1 && /Dell Latitude 7420 i7 16GB 512GB · 4 máy · 12,9–13,5 triệu/.test(my[0]), my);
  await p.click('#gyKho [data-gm="0"]'); await p.waitForTimeout(150);
  check('bấm 1 máy trong kho: điền tên máy vào ô Kho', await p.evaluate(() => $('#fKho').value === 'Dell Latitude 7420 i7 16GB 512GB' && S.form.kho === $('#fKho').value));
  await p.click('#gyKho [data-gy="0"]'); await p.waitForTimeout(150);
  check('Dùng: điền chủ đề + tên máy vào ô Kho (lưu nháp)', await p.evaluate(() => $('#fChuDe').value === 'Dell 7420 i7: laptop văn phòng bền nhất tầm 13 triệu?' && $('#fKho').value === 'Dell Latitude 7420 i7 16GB 512GB' && S.form.kho === $('#fKho').value));
  await p.click('#seg [data-k="ipad"]'); await p.waitForTimeout(400);
  const ip = await p.evaluate(() => ({ st: document.querySelector('#gyKho .gyst') && document.querySelector('#gyKho .gyst').innerText, it: [...document.querySelectorAll('#gyKho .gyi')].map(e => e.innerText) }));
  check('đổi sang kênh iPad: gợi ý iPad', /gợi ý iPad/.test(ip.st || '') && ip.it.some(x => /iPad Air 5/.test(x)), ip);
  // --- lần quét 2 có máy mới về
  fs.writeFileSync(T + '/FAKE_KHO2', '1');
  await j(A + '/api/goi-y', { quet: true }); d = await cho();
  const x1 = (d.ds || []).find(x => /X1 Carbon/.test(x.may));
  check('lần sau: dòng máy mới thấy = 🆕, gợi ý máy mới lên đầu; máy cũ không 🆕', x1 && x1.moi && d.ds[0] === x1 && !d.ds.find(x => /Dell/.test(x.may)).moi, d.ds);
  await p.click('#seg [data-k="laptop"]'); await p.waitForTimeout(300); await p.evaluate(() => gyTai(true)); await p.waitForTimeout(400);
  check('Bài mới hiện "🆕 1 mới về" + nhãn MỚI VỀ cạnh máy mới (cùng dòng tên máy)', await p.evaluate(() => /🆕 1 mới về/.test(document.querySelector('#gyKho .gyst').innerText) && /MỚI VỀ/.test((document.querySelector('#gyKho .gyi') || {}).innerText || '')));
  // --- lỗi đọc kho
  fs.writeFileSync(T + '/FAKE_KHO_LOI', '1');
  await j(A + '/api/goi-y', { quet: true }); d = await cho();
  check('đọc kho lỗi: báo lỗi, giữ gợi ý cũ', /POLY/.test(d.loi || '') && d.ds.length === 3, d);
  rm(T + '/FAKE_KHO_LOI');
  // --- tự quét
  r = await j(A + '/api/goi-y', { tu: true });
  check('bật tự quét mỗi sáng 7h30: lưu cài đặt', r.b.tu === true && JSON.parse(fs.readFileSync(T + '/config.json')).goi_y_tu === true, r.b.tu);
  await j(A + '/api/goi-y', { tu: false });
  // --- máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con gợi ý kho' }, H)).b;
  const HK = Object.assign({ 'X-Poly-Khach': v.token }, H);
  const g1 = await j(K + '/api/goi-y', null, HK), g2 = await j(K + '/api/goi-y', { quet: true }, HK);
  check('máy dùng chung: xem được bản kho máy shop (máy + gợi ý, không mã lượt), không cập nhật / tự cập nhật được', g1.s === 200 && g1.b.khach && g1.b.may.length >= 2 && g1.b.ds.length >= 2 && !('jid' in g1.b) && !('tu' in g1.b) && [g2.s, (await j(K + '/api/goi-y', { tu: true }, HK)).s].every(s => s === 403 || s === 404), [g1.s, g2.s, Object.keys(g1.b)]);
  const g = await b.newPage({ viewport: { width: 1280, height: 800 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1500);
  await g.waitForSelector('#gyKho .gyhd', { timeout: 10000 }).catch(() => {});
  const gk = await g.evaluate(() => ({ v: S.view, st: (document.querySelector('#gyKho .gyst') || {}).innerText, quet: !!document.querySelector('#gyQuet'), mo: !!document.querySelector('#gyMo') }));
  check('máy dùng chung: Bài mới có dòng Gợi ý từ kho "… (máy shop)", không nút Cập nhật kho', gk.v === 'new' && /cập nhật .*\(máy shop\)/.test(gk.st || '') && !gk.quet && gk.mo, gk);
  await g.click('#gyMo'); await g.waitForTimeout(150);
  const gm = await g.evaluate(() => ({ m: document.querySelectorAll('#gyKho [data-gm]').length, tu: !!document.querySelector('#gyTu') }));
  await g.click('#gyKho [data-gm="0"]'); await g.waitForTimeout(150);
  check('máy dùng chung: Xem thấy máy trong kho, bấm 1 máy điền ô Kho, không có tự cập nhật', gm.m >= 1 && !gm.tu && await g.evaluate(() => !!$('#fKho').value), gm);
  await p.screenshot({ path: 'shots/goi-y-kho.png' });
  check('không lỗi JS', errs.length === 0, errs);
  rm(T + '/FAKE_KHO2'); await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
