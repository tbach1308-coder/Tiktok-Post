// Khung Sửa bài gọn (fen 15/11 11h51 "làm gọn lại"): bỏ đoạn hướng dẫn dài + nhãn, ô sửa chung 2 dòng, khung ảnh to thành nút
// 📎 Ảnh (khung ảnh chỉ hiện khi có ảnh / đang kéo ảnh vào), dòng tóm tắt ngắn cạnh tiêu đề.
const { chromium } = require('playwright');
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1386, height: 990 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const js = await (await fetch('http://127.0.0.1:8790/api/jobs')).json();
  const j = js.jobs.find(x => x.status === 'xong');
  await p.goto('http://127.0.0.1:8790/#bai=' + j.id); await p.waitForSelector('#fixCard', { timeout: 15000 }); await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({ h: document.querySelector('#fixCard').getBoundingClientRect().height, tom: document.querySelector('#fixTom').textContent,
    drop: getComputedStyle(document.querySelector('#fdrop')).display, nut: !!document.querySelector('.fixbar #fpick'), lbl: !!document.querySelector('#fixCard .lbl') }));
  check('khung Sửa bài gọn (thấp hơn 230px), không còn nhãn dài, có nút 📎 Ảnh, khung ảnh ẩn khi chưa có ảnh', r.h < 230 && !r.lbl && r.nut && r.drop === 'none' && r.tom.length < 70, r);
  await p.evaluate(() => { const df = draft(); df.anh.push({ name: 'a.png', data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }); renderThumbs($('#fdrop'), df.anh); });
  check('có ảnh: khung ảnh hiện (ảnh nhỏ + nút bỏ)', await p.evaluate(() => getComputedStyle(document.querySelector('#fdrop')).display !== 'none' && document.querySelectorAll('#fdrop .th').length === 1));
  await p.evaluate(() => { const df = draft(); df.anh.splice(0); renderThumbs($('#fdrop'), df.anh); document.querySelector('#fdrop').classList.add('hot'); });
  check('đang kéo ảnh vào: khung hiện chữ "Thả ảnh vào đây"', await p.evaluate(() => getComputedStyle(document.querySelector('#fdrop')).display !== 'none' && /Thả ảnh/.test(document.querySelector('#fdrop').innerText)));
  await p.evaluate(() => document.querySelector('#fdrop').classList.remove('hot'));
  await p.fill('#fixText', 'chữ cả bài to hơn'); await p.waitForTimeout(150);
  check('gõ sửa chung: dòng tóm tắt đổi', /Sửa chung cả bài/.test(await p.evaluate(() => document.querySelector('#fixTom').textContent)));
  await p.fill('#fixText', ''); await p.evaluate(() => { const df = draft(); df.text = ''; });
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
