// Giao diện kho theme Photoshop (fen 12/11): tab Photoshop trong Kho theme, ▶ Làm bài, hàng theme ở Bài mới, Chạy gửi theme_ps
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790';
let ok = 0, bad = 0;
const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  const b = await chromium.launch(); const errs = [];
  for (const [w, h, ten] of [[1440, 1000, 'rong'], [400, 860, 'hep']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => errs.push(ten + ': ' + e.message));
    await p.goto(A + '/'); await p.waitForTimeout(1500);
    await p.evaluate(() => khoTheme()); await p.waitForTimeout(600);
    const rongCv = await p.evaluate(() => document.documentElement.scrollWidth);
    await p.click('#thKieu [data-k=ps]'); await p.waitForSelector('#thPsG .thps', { timeout: 8000 }); await p.waitForTimeout(1200);
    const the = await p.$$eval('#thPsG .thps', x => x.map(e => ({ ten: e.querySelector('b').textContent, anh: e.querySelectorAll('.tha3 img').length, kc: !!e.querySelector('.kcb') })));
    check(ten + ': tab Photoshop có 2 theme, mỗi thẻ 3 ảnh + nhãn kho chung', the.length === 2 && the.every(t => t.anh === 3 && t.kc), the);
    const anhOk = await p.$$eval('#thPsG img', x => x.every(i => i.complete && i.naturalWidth > 0));
    check(ten + ': ảnh xem trước hiện được', anhOk);
    check(ten + ': phần Canva ẩn khi xem Photoshop', await p.$eval('#thCvWrap', e => e.hidden));
    const rongPs = await p.evaluate(() => document.documentElement.scrollWidth);
    check(ten + ': tab Photoshop không rộng hơn tab Canva (app vốn là giao diện máy tính)', rongPs <= rongCv, [rongPs, rongCv]);
    await p.screenshot({ path: '/home/claude/bug3/shots/theme-ps-' + ten + '.png', fullPage: false });
    if (ten === 'rong') {
      await p.click('#thPsG [data-dungps="phang-xanh-dem"]'); await p.waitForTimeout(1000);
      const pick = await p.$$eval('#thPick [data-thps]', x => x.map(e => ({ id: e.dataset.thps, on: e.classList.contains('on') })));
      check('▶ Làm bài: mở Bài mới, theme Photoshop đang chọn', pick.some(t => t.id === 'phang-xanh-dem' && t.on), pick);
      check('đang chọn Photoshop (không Canva)', await p.$eval('#segDung [data-d=""]', e => e.classList.contains('on')));
      await p.screenshot({ path: '/home/claude/bug3/shots/theme-ps-baimoi.png' });
      // bấm Canva: theme PS thôi sáng; bấm lại theme PS: về Photoshop
      await p.click('#segDung [data-d=canva]'); await p.waitForTimeout(300);
      check('chuyển Canva: theme Photoshop không còn chọn', !(await p.$$eval('#thPick [data-thps].on', x => x.length)));
      await p.click('#thPick [data-thps="phang-than-xanh-duong"]'); await p.waitForTimeout(300);
      check('bấm theme Photoshop: về Photoshop + chọn theme đó', await p.$eval('#segDung [data-d=""]', e => e.classList.contains('on')) && await p.$eval('#thPick [data-thps="phang-than-xanh-duong"]', e => e.classList.contains('on')));
      // Chạy: bắt yêu cầu /api/run
      let gui = null; p.on('request', r => { if (r.url().endsWith('/api/run')) gui = JSON.parse(r.postData() || '{}'); });
      await p.fill('#fBrief', 'Bìa: THỬ GIAO DIỆN THEME PS\nSlide 2: x'); await p.waitForTimeout(200);
      await p.click('#bRun'); await p.waitForTimeout(1500);
      check('Chạy gửi theme_ps đúng theme', gui && gui.theme_ps === 'phang-than-xanh-duong' && !gui.dung_bang, gui);
      await p.waitForTimeout(2500);
      const tag = await p.$$eval('.tgd.ps', x => x.map(e => e.getAttribute('title')));
      check('bài có nhãn 🖌 kèm tên theme', tag.some(t => /Than xanh dương/.test(t || '')), tag);
      // bỏ theme
      await p.evaluate(() => newView()); await p.waitForTimeout(600);
      await p.click('#thPick [data-th="-"]'); await p.waitForTimeout(300);
      check('Không theme: bỏ theme Photoshop', !(await p.$$eval('#thPick [data-thps].on', x => x.length)));
    }
    await p.close();
  }
  check('không lỗi JS', !errs.length, errs);
  console.log('KẾT QUẢ: ' + ok + ' đạt, ' + bad + ' lỗi'); await b.close();
})();
