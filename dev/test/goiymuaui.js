// 💡 Ngày nào cũng có gợi ý (fen 16/11 11h45): gợi ý theo mùa (kho kênh trống) hiện "🎄 Theo mùa", Dùng chỉ điền chủ đề; dòng trạng thái
// báo kho chưa có máy kênh này; dán link kho vào ô 📦 Kho (fen 11h59 nhầm ô) có nút 💾 Lưu làm link kho; 🔗 Link kho có ô 🌅 Mỗi sáng 8h tự cập nhật.
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', T = '/home/claude/bug3/tgl';
const j = (u, d) => fetch(u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  const luc = Date.now() / 1000 - 60;
  fs.writeFileSync(T + '/goi-y-kho.json', JSON.stringify({ luc, jid: 'x', dang: false, loi: '', web: true,
    may: [{ kenh: 'laptop', ten: 'Dell Precision 5760 Xeon', so: 4, gia: '21,5 triệu' }],
    ds: [{ kenh: 'laptop', may: 'Dell Precision 5760 Xeon', gia: '21,5 triệu', chu_de: 'Máy trạm 17 inch tầm 22 triệu', ly_do: '4 máy', mua: false },
      { kenh: 'ipad', may: '', gia: '', chu_de: 'iPad nào làm quà Noel cho học sinh?', ly_do: 'Kho chưa có iPad · mùa Noel', mua: true },
      { kenh: 'ipad', may: '', gia: '', chu_de: 'Mẹo giữ pin iPad mùa lạnh', ly_do: 'chủ đề chung', mua: true }] }));
  fs.writeFileSync(T + '/goi-y-tu.json', JSON.stringify({ ngay: '2026-11-16', luc: luc - 20 }));
  await j(A + '/api/goi-y', { link: { laptop: 'https://app.polystorevn.com/kho-may', ipad: '' }, tu_sang: true });
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 950 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#moi'); await p.evaluate(() => { localStorage.setItem('poly-gy-mo', 'true'); }); await p.reload(); await p.waitForSelector('#gyKho .gyhd', { timeout: 15000 });
  await p.click('#seg [data-k="ipad"]'); await p.waitForTimeout(400);
  await p.evaluate(() => { $('#fKho').value = ''; S.form.kho = ''; $('#fChuDe').value = ''; S.form.chude = ''; gyVe(); });
  const g = await p.evaluate(() => ({ st: document.querySelector('#gyKho .gyst').innerText, mua: document.querySelectorAll('#gyKho .gymua').length, b: [...document.querySelectorAll('#gyKho .gyi .t b')].length }));
  check('kênh iPad: 2 gợi ý "🎄 Theo mùa" (không tên máy / giá), trạng thái "2 gợi ý iPad (2 theo mùa) · kho chưa có máy iPad (🔗 thêm link kho iPad) … (tự động)"',
    g.mua === 2 && g.b === 0 && /2 gợi ý iPad \(2 theo mùa\)/.test(g.st) && /kho chưa có máy iPad \(🔗 thêm link kho iPad\)/.test(g.st) && /\(tự động\)/.test(g.st), g);
  await p.click('#gyKho [data-gy="0"]'); await p.waitForTimeout(200);
  const d = await p.evaluate(() => ({ cd: $('#fChuDe').value, kho: $('#fKho').value }));
  check('Dùng gợi ý theo mùa: điền chủ đề, ô Kho để trống', d.cd === 'iPad nào làm quà Noel cho học sinh?' && d.kho === '', d);
  await p.fill('#fKho', 'https://app.polystorevn.com/kho-may?loai=IPAD'); await p.waitForTimeout(200);
  const nut = await p.evaluate(() => ($('#gyLuuLink') || {}).innerText);
  await p.click('#gyLuuLink'); await p.waitForTimeout(600);
  const r = await j(A + '/api/goi-y');
  check('dán link kho vào ô 📦 Kho: hiện "💾 Lưu làm link kho iPad", bấm là lưu link kho iPad (giữ link Laptop), nút ẩn',
    /Lưu làm link kho iPad/.test(nut || '') && r.b.link.ipad === 'https://app.polystorevn.com/kho-may?loai=IPAD' && r.b.link.laptop === 'https://app.polystorevn.com/kho-may' && !(await p.$('#gyLuuLink')), { nut, link: r.b.link });
  await p.fill('#fKho', 'C02DK3XYQ6L4'); await p.waitForTimeout(150);
  check('ô Kho là seri / chữ thường: không có nút lưu link', !(await p.$('#gyLuuLink')));
  await p.click('#gyLink'); await p.waitForSelector('#klTu');
  const tu0 = await p.evaluate(() => $('#klTu').checked);
  await p.click('#klTu'); await p.click('#klLuu'); await p.waitForTimeout(600);
  const r2 = await j(A + '/api/goi-y');
  const cfg = JSON.parse(fs.readFileSync(T + '/config.json', 'utf8'));
  check('🔗 Link kho: ô 🌅 Mỗi sáng 8h tự cập nhật (mặc định bật), bỏ chọn + Lưu = tắt (config kho_tu_sang)', tu0 && r2.b.tu_sang === false && cfg.kho_tu_sang === false, { tu0, ts: r2.b.tu_sang });
  await j(A + '/api/goi-y', { tu_sang: false });     // máy thử: tắt tự cập nhật (reset.sh cũng tắt) để test khác không bị lượt tự chạy chen vào
  check('không lỗi JS', errs.length === 0, errs);
  await b.close();
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
