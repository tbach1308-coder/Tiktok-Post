// 🌐 Đọc kho qua Chrome (fen 15/11 13h49 "https://app.polystorevn.com/kho-may đọc qua link này là dc mầ", chọn "Đọc link qua Chrome đã
// đăng nhập"): 🔄 Cập nhật kho → app mở /kho-mo trong Chrome (hồ sơ iPad) → chuyển sang link kho #poly_kho=… → tiện ích kho.js chép cột
// tên / cấu hình / tình trạng / giá bán (bỏ mã, giá nhập, khách, ngày), sang trang 2, gửi /api/kho-web → app gom dòng máy → Claude gợi ý.
// Trang kho giả (Playwright route), tiện ích giả lập: kho.js chèn vào trang, tin gửi background thì test chuyển tiếp như background.js.
const { chromium } = require('playwright');
const fs = require('fs'), http = require('http');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, T = '/home/claude/bug3/tgl';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
const post = (path, data, origin) => new Promise(ok => { const b = Buffer.from(JSON.stringify(data));      // như background.js (Origin chrome-extension://)
  const r = http.request({ host: '127.0.0.1', port: 8790, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': b.length, Origin: origin || 'chrome-extension://abcdefpoly' } },
    res => { let t = ''; res.on('data', c => t += c); res.on('end', () => ok({ s: res.statusCode, b: (() => { try { return JSON.parse(t); } catch (e) { return {}; } })() })); });
  r.end(b); });
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const rm = f => { try { fs.renameSync(f, '/tmp/_bo_' + Date.now() + '_' + f.split('/').pop()); } catch (e) {} };
const cho = async (f, n = 60) => { for (let i = 0; i < n; i++) { const r = await j(A + '/api/goi-y'); if (f(r.b)) return r.b; await new Promise(x => setTimeout(x, 500)); } return (await j(A + '/api/goi-y')).b; };
const moTu = async () => { for (let i = 0; i < 30; i++) { const m = (fs.readFileSync(T + '/fakechrome/args.log', 'utf8').match(/(http:\/\/127\.0\.0\.1:8790\/kho-mo\?tok=\w+)/) || [])[1]; if (m) return m; await new Promise(x => setTimeout(x, 200)); } return ''; };   // Chrome giả ghi link chậm
const KHO = fs.readFileSync('/home/claude/repo/tiktok-ext/kho.js', 'utf8');
// cột giống trang kho thật (15/11 14h49): #, TÊN MÁY & SERI (tên + seri xuống dòng), CẤU HÌNH, T.TRẠNG, PIN, GIÁ BÁN, HH, GHI CHÚ, TRẠNG THÁI, (nút)
const ROWS = [['1', 'Dell Latitude 7420 i7 16GB 512GB<br>C02DK3XYQ6L4', 'i7-1185G7 · 16GB', 'Like new', '92%', '12.900.000', '500.000', 'Khách Nguyễn Văn A cọc', 'Đang bán', 'Sửa'],
  ['2', 'Dell Latitude 7420 i7 16GB 512GB<br>C02DK3XYQ6L5', 'i7-1185G7 · 16GB', 'Like new', '90%', '13.500.000', '500.000', '', 'Đang bán', 'Sửa'],
  ['3', 'iPad Air 5 64GB Wifi<br>DMPH12ABCD34', 'M1 · 64GB', '99%', '95%', '11.200.000', '300.000', 'Trần B hỏi', 'Đang bán', 'Sửa'],
  ['4', 'ThinkPad X1 Carbon Gen 10<br>PF3AB12C', 'i7-1260P · 16GB', '98%', '88%', '17.900.000', '700.000', '', 'Đang bán', 'Sửa']];
const P2 = [['5', 'iPad Pro M1 11 inch 128GB<br>FX8KLM90QW', 'M1 · 128GB', '98%', '97%', '13.990.000', '400.000', 'Võ E', 'Đang bán', 'Sửa'],
  ['6', 'Apple Watch S7 45mm<br>GY7H2KQ1AB', 'GPS', '97%', '90%', '4.500.000', '100.000', '', 'Đang bán', 'Sửa']];
const trangKho = `<!doctype html><meta charset=utf-8><title>POLY Store</title><body><div id=app>Đang tải...</div><script>
const HD = ['#', 'TÊN MÁY & SERI', 'CẤU HÌNH', 'T.TRẠNG', 'PIN', 'GIÁ BÁN', 'HH', 'GHI CHÚ', 'TRẠNG THÁI', ''];
const P = [${JSON.stringify(ROWS)}, ${JSON.stringify(P2)}]; let t = 0;
function ve(){ document.getElementById('app').innerHTML = '<h1>Kho máy</h1><table><thead><tr>' + HD.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
  P[t].map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table><div class="pagination"><button aria-label="Previous page"' + (t ? '' : ' disabled') + '>‹</button><button id="sau" aria-label="Next page"' + (t < 1 ? '' : ' disabled') + '>›</button></div>';
  document.getElementById('sau').onclick = () => { window.__bam = (window.__bam || 0) + 1; t = 1; document.getElementById('app').innerHTML = 'Đang tải...'; setTimeout(ve, 700); }; }
setTimeout(ve, 1200);
</script>`;
const trangLogin = `<!doctype html><meta charset=utf-8><title>POLY Store</title><body><h1>Đăng nhập</h1><input type=text placeholder="Tài khoản"><input type=password><button>Đăng nhập hệ thống</button>`;
(async () => {
  [T + '/goi-y-kho.json', T + '/kho-snap.json', T + '/kho-web.json', T + '/FAKE_KHO_LOI', T + '/poly-tt.json'].forEach(rm);
  const LS = T + '/fakechrome/ud/Local State';     // hồ sơ Chrome giả (chỉ trong lúc chạy test này)
  fs.writeFileSync(LS, JSON.stringify({ profile: { info_cache: { Default: { name: 'Your Chrome' }, 'Profile 2': { name: 'Laptop' }, 'Profile 9': { name: 'Kho POLY' } } } }));
  fs.mkdirSync(T + '/fakechrome/ud/Profile 9', { recursive: true });       // hồ sơ "Kho POLY" cài tiện ích Poly TikTok (thư mục tiktok-ext)
  fs.writeFileSync(T + '/fakechrome/ud/Profile 9/Secure Preferences', JSON.stringify({ extensions: { settings: { abcdefpoly: { path: 'E:\\Tool\\poly-dung-bai\\tiktok-ext', location: 4, state: 1 } } } }));
  await j(A + '/api/tiktok-cai', { ho_so: 'Default' }); await j(A + '/api/goi-y', { hs: '' });
  await j(A + '/api/goi-y', { cach: 'web', link: { laptop: 'https://app.polystorevn.com/kho-may', ipad: '' } });
  fs.writeFileSync(T + '/fakechrome/args.log', '');
  let r = await j(A + '/api/goi-y', { quet: true });
  const mo = await moTu(), arg = fs.readFileSync(T + '/fakechrome/args.log', 'utf8').trim();
  check('🔄 Cập nhật kho (cách web): app mở trang /kho-mo trong Chrome hồ sơ có tiện ích Poly TikTok (chưa chọn: tự dò), dòng gợi ý báo "Đang mở trang kho trên Chrome"', r.s === 200 && r.b.dang && /Đang mở trang kho trên Chrome/.test(r.b.buoc || '') && !!mo && /--profile-directory=Profile 9/.test(arg), { r: r.b, arg });
  check('Kho Poly đang "đọc web"', (await j(A + '/api/poly-tt')).b.nguon === 'đọc web');
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const ctx = await b.newContext({ viewport: { width: 1280, height: 860 } });
  let trang = 'kho';
  await ctx.route('https://app.polystorevn.com/**', rt => rt.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: trang === 'kho' ? trangKho : trangLogin }));
  await ctx.addInitScript(({ KHO, coTi }) => {
    if (location.host === '127.0.0.1:8790' && coTi) document.addEventListener('readystatechange', () => { document.documentElement.dataset.polyTiktok = '0.13.0'; }, { once: true });
    if (location.host !== 'app.polystorevn.com') return;
    window.__kho = null;
    Object.defineProperty(window, 'chrome', { value: { runtime: { sendMessage: m => { window.__kho = m; return Promise.resolve({}); } } }, configurable: true });
    new Function(KHO)();
  }, { KHO, coTi: true });
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(e.message));
  await p.goto(mo);
  check('trang /kho-mo: thấy tiện ích → chuyển sang link kho kèm dấu #poly_kho (tiện ích xoá dấu khỏi thanh địa chỉ)', await p.waitForURL(/app\.polystorevn\.com\/kho-may/, { timeout: 8000 }).then(() => true).catch(() => false) && !/poly_kho/.test(p.url()), p.url());
  await p.waitForFunction(() => window.__kho, null, { timeout: 30000 }).catch(() => {});
  const msg = await p.evaluate(() => window.__kho), bam = await p.evaluate(() => window.__bam || 0);
  const d0 = (msg || {}).data || {};
  check('kho.js: đợi bảng hiện, bấm trang sau 1 lần, đọc 2 trang (6 dòng)', d0.tt === 'ok' && d0.trang === 2 && bam === 1 && (d0.rows || []).length === 6, { tt: d0.tt, trang: d0.trang, bam, n: (d0.rows || []).length });
  check('kho.js (cột như kho thật): tên máy (bỏ seri dòng 2) + giá bán + cấu hình / t.trạng / pin + trạng thái; KHÔNG chép seri, HH, ghi chú (tên khách)', d0.chon && d0.chon.ten === 'TÊN MÁY & SERI' && d0.chon.gia === 'GIÁ BÁN' && d0.chon.them.join() === 'CẤU HÌNH,T.TRẠNG,PIN' && d0.chon.tt === 'TRẠNG THÁI'
    && d0.rows[0].ten === 'Dell Latitude 7420 i7 16GB 512GB' && d0.rows[0].tt === 'Đang bán' && !JSON.stringify(d0.rows).match(/C02DK3XYQ6L4|"[0-9]00\.000"|Nguyễn Văn A|Trần B|Sửa/), { chon: d0.chon, r0: (d0.rows || [])[0] });
  const g1 = await post('/api/kho-web', Object.assign({}, d0, { tok: 'sai-ma-123456' }));
  check('gửi về sai mã lượt: bị từ chối', g1.s === 400, g1);
  const g2 = await post('/api/kho-web', d0, 'https://evil.example');
  check('trang lạ (không phải tiện ích / app) gửi về: bị chặn', g2.s === 403, g2);
  const g3 = await post('/api/kho-web', d0);
  check('tiện ích gửi về đúng mã: app nhận, bảo đóng tab', g3.s === 200 && g3.b.dong === true, g3);
  const kw = JSON.parse(fs.readFileSync(T + '/kho-web.json'));
  const dell = kw.may.find(x => /Dell Latitude 7420/.test(x.ten)), ipa = kw.may.find(x => /iPad Air 5/.test(x.ten));
  check('app gom dòng máy: Dell 7420 · 2 máy · 12,9–13,5 triệu (laptop); iPad Air 5 kênh iPad; Apple Watch bỏ (không thuộc kênh nào)', dell && dell.so === 2 && dell.gia === '12,9–13,5 triệu' && dell.kenh === 'laptop' && ipa && ipa.kenh === 'ipad' && ipa.gia === '11,2 triệu' && !kw.may.some(x => /Watch/.test(x.ten)) && kw.may.length === 4, kw.may);
  let d = await cho(x => !x.dang, 80);
  const pr = fs.readFileSync(T + '/last-prompt.txt', 'utf8');
  check('Claude gợi ý từ danh sách (không công cụ, không giá nhập / khách trong lệnh)', /kho app vừa đọc từ trang web Polysto/.test(pr) && /KHÔNG dùng công cụ nào/.test(pr) && /Dell Latitude 7420 i7 16GB 512GB i7-1185G7 · 16GB · 2 máy · 12,9–13,5 triệu · Like new · pin 90–92%/.test(pr) && /iPad Pro M1 11 inch 128GB M1 · 128GB · 1 máy · 13,99 triệu · 98% · pin 97%/.test(pr) && !/C02DK3XYQ6L4|Nguyễn Văn A|500\.000/.test(pr), pr.slice(0, 900));
  check('xong: Gợi ý có máy đúng như bảng kho (web), Kho Poly = đã nối (đọc web)', d.luc && d.web && d.may.length === 4 && d.may.some(x => x.so === 2 && /12,9–13,5/.test(x.gia)) && (await j(A + '/api/poly-tt')).b.tt === 'noi', d);
  // Chrome chưa đăng nhập POLY
  trang = 'login'; fs.writeFileSync(T + '/fakechrome/args.log', '');
  await j(A + '/api/goi-y', { quet: true });
  const mo2 = await moTu();
  const p2 = await ctx.newPage(); await p2.goto(mo2); await p2.waitForFunction(() => window.__kho, null, { timeout: 15000 }).catch(() => {});
  const m2 = await p2.evaluate(() => window.__kho);
  const g4 = await post('/api/kho-web', m2 && m2.data);
  d = (await j(A + '/api/goi-y')).b;
  check('trang đăng nhập: tiện ích không gõ gì, báo app; app báo "Chrome chưa đăng nhập POLY", để tab cho fen tự đăng nhập; giữ gợi ý cũ', m2 && m2.data.tt === 'dang-nhap' && g4.b.dong === false && !d.dang && /chưa đăng nhập POLY/.test(d.loi) && d.may.length === 4 && (await j(A + '/api/poly-tt')).b.tt === 'chua', { m2, g4: g4.b, loi: d.loi });
  // Chrome không có tiện ích
  fs.writeFileSync(T + '/fakechrome/args.log', '');
  await j(A + '/api/goi-y', { quet: true });
  const mo3 = await moTu();
  const c2 = await b.newContext(); const p3 = await c2.newPage(); await p3.goto(mo3); await p3.waitForTimeout(2500);
  d = (await j(A + '/api/goi-y')).b;
  check('Chrome hồ sơ không có tiện ích Poly TikTok: trang /kho-mo báo, app báo lỗi rõ', /chưa có tiện ích/.test(await p3.innerText('body')) && /chưa chạy tiện ích Poly TikTok/.test(d.loi) && /Link kho/.test(d.loi) && !d.dang, d.loi);
  // quá 3 phút không thấy gửi về
  await j(A + '/api/goi-y', { quet: true });
  const f = JSON.parse(fs.readFileSync(T + '/goi-y-kho.json')); f.bat -= 200; fs.writeFileSync(T + '/goi-y-kho.json', JSON.stringify(f));
  d = (await j(A + '/api/goi-y')).b;
  check('Chrome không gửi kho về sau 3 phút: hết chờ, báo lỗi rõ', !d.dang && /sau 3 phút/.test(d.loi), d.loi);
  // chưa chọn hồ sơ Chrome (fen 14h30: Chrome tự chọn hồ sơ mở gần nhất → mở nhầm hồ sơ không có tiện ích)
  await j(A + '/api/tiktok-cai', { ho_so: '' }); await j(A + '/api/goi-y', { hs: '' });
  const SP = T + '/fakechrome/ud/Profile 9/Secure Preferences', SP2 = SP + '.bo'; if (fs.existsSync(SP)) fs.renameSync(SP, SP2);
  await new Promise(x => setTimeout(x, 61000));      // app nhớ danh sách hồ sơ có tiện ích 60 giây
  const ch = await j(A + '/api/goi-y', { quet: true });
  fs.renameSync(SP2, SP); await new Promise(x => setTimeout(x, 61000));
  check('chưa chọn hồ sơ Chrome đọc kho (và hồ sơ iPad cũng chưa chọn): báo chọn hồ sơ, không mở Chrome bừa', ch.s === 400 && /^CHON_HS\|/.test(ch.b.err || '') && !(await j(A + '/api/goi-y')).b.dang, ch);
  const gt = (await j(A + '/api/goi-y')).b;
  check('tự dò hồ sơ có tiện ích Poly TikTok (Secure Preferences): đánh dấu ✓, chưa chọn thì tự dùng hồ sơ đó', gt.ho_so.find(h => h.dir === 'Profile 9').ti === true && !gt.ho_so.find(h => h.dir === 'Default').ti && gt.hs_tu === 'Profile 9', { ho_so: gt.ho_so, hs_tu: gt.hs_tu });
  r = await j(A + '/api/goi-y', { hs: 'Profile 9' }); fs.writeFileSync(T + '/fakechrome/args.log', '');
  const ch2 = await j(A + '/api/goi-y', { quet: true }); const a2 = (await moTu(), fs.readFileSync(T + '/fakechrome/args.log', 'utf8'));
  check('chọn hồ sơ "Kho POLY" ở 🔗 Link kho: Cập nhật kho mở đúng hồ sơ đó', r.b.hs === 'Profile 9' && ch2.s === 200 && /--profile-directory=Profile 9/.test(a2), { hs: r.b.hs, a2 });
  check('hồ sơ không có trên máy: không lưu', (await j(A + '/api/goi-y', { hs: 'Profile 77' })).s === 400);
  await j(A + '/api/tiktok-cai', { ho_so: 'Default' }); await j(A + '/api/goi-y', { hs: '' });
  // giao diện
  const u = await ctx.newPage(); u.on('pageerror', e => errs.push(e.message));
  await u.goto(A + '/#moi'); await u.waitForSelector('#gyLink'); await u.click('#gyLink'); await u.waitForSelector('#klCach');
  check('🔗 Link kho: ô "Hồ sơ Chrome đã đăng nhập POLY" (danh sách hồ sơ trên máy) + "Đọc kho bằng" (Chrome / Connector POLY), mặc định Chrome', await u.evaluate(() => $('#klCach').value === 'web' && $('#klCach').options.length === 2 && [...$('#klHs').options].map(o => o.value).join() === ',Default,Profile 2,Profile 9'));
  await u.evaluate(() => document.querySelectorAll('.modal').forEach(m => m.remove()));
  await u.click('#bPoly'); await u.waitForSelector('#plKiem');
  check('hộp Kho Poly (cách web): giải thích đọc qua Chrome, nút "Cập nhật kho"', await u.evaluate(() => /trang web Polysto trên Chrome/.test(document.querySelector('.modal.on').innerText) && $('#plKiem').textContent === 'Cập nhật kho'));
  // máy dùng chung không gọi được
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con kho web' }, H)).b, HK = Object.assign({ 'X-Poly-Khach': v.token }, H);
  const k1 = await j(K + '/api/kho-web', d0, HK), k2 = await j(K + '/kho-mo?tok=x', undefined, HK);
  check('máy dùng chung: không gửi kho / mở trang /kho-mo được', [k1.s, k2.s].every(s => s === 403 || s === 404 || s === 401), [k1.s, k2.s]);
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false }); rm(LS);
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
