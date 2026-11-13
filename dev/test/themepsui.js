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
    await p.waitForSelector('#thPsG .thps', { state: 'attached', timeout: 8000 }).catch(() => {}); await p.waitForTimeout(600);
    // fen 13/11 11h35 "hiển thị theme theo tag": tab Canva chỉ theme Canva, theme Photoshop chỉ ở tab Photoshop
    const kc = await p.$$eval('#thCvWrap .thps b', x => x.map(e => e.textContent));
    check(ten + ': tab Canva (cả mục ☁️ Kho chung) không có theme Photoshop', kc.length === 0, kc);
    const nKc = await p.$eval('#thKcN', e => e.textContent), soKc = await p.$$eval('#thKcG .thc', x => x.length);
    check(ten + ': số theme kho chung = số thẻ Canva trong kho chung', nKc === (soKc ? '· ' + soKc : ''), [nKc, soKc]);
    check(ten + ': nút tab ghi số theme Photoshop', /Photoshop · 6/.test(await p.$eval('#thKieu [data-k=ps]', e => e.textContent)));
    const soCv = await p.$$eval('#thCvWrap .thc', x => new Set(x.map(e => e.dataset.id)).size);
    check(ten + ': nút tab Canva ghi số theme Canva', (await p.$eval('#thKieu [data-k=cv]', e => e.textContent)) === '🎨 Canva · ' + soCv, [await p.$eval('#thKieu [data-k=cv]', e => e.textContent), soCv]);
    const yCv = await p.evaluate(() => { const e = document.querySelector('#thCvWrap .thc .tha'); return e ? Math.round(e.getBoundingClientRect().width) : 0; });
    if (ten === 'rong') await p.screenshot({ path: '/home/claude/bug3/shots/theme-ps-khochung.png', fullPage: true });
    await p.click('#thKieu [data-k=ps]'); await p.waitForSelector('#thPsG .thps', { timeout: 8000 }); await p.waitForTimeout(1200);
    const co = await p.evaluate(() => { const e = document.querySelector('#thPsG .thps .tha'); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height / r.width * 100)]; });
    check(ten + ': ảnh thẻ Photoshop cùng cỡ thẻ Canva (3:4)', co && yCv && Math.abs(co[0] - yCv) <= 2 && co[1] === 133, [co, yCv]);
    const the = await p.$$eval('#thPsG .thps', x => x.map(e => ({ ten: e.querySelector('b').textContent, anh: e.querySelectorAll('.tha img').length, thua: !!e.querySelector('.kcb') || /Photoshop/.test(e.querySelector('.thm').textContent) })));
    // fen 13/11 11h39 "tối ưu loại bỏ phần thừa": thẻ Photoshop không còn nhãn "☁️ Kho chung" / chữ "Photoshop" (đang ở tab Photoshop)
    check(ten + ': tab Photoshop có 6 theme, thẻ giống Canva (1 ảnh bìa), không chữ thừa', the.length === 6 && the.every(t => t.anh === 1 && !t.thua), the);
    check(ten + ': tab Photoshop không còn đoạn giới thiệu dài', await p.$$eval('#thPsWrap > .pnote', x => x.length) === 0);
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
      // fen 21h28 "chọn cái nào hiện cái đó": hàng Theme chỉ 1 nút (theme đang chọn hoặc Không theme / Mẫu kênh)
      check('hàng Theme chỉ hiện 1 theme', (await p.$$eval('#thPick [data-th], #thPick [data-thps]', x => x.length)) === 1, await p.$$eval('#thPick button', x => x.map(e => e.textContent)));
      await p.click('#segDung [data-d=""]'); await p.waitForTimeout(300);
      await p.fill('#fBrief', 'Bìa: THỬ GIAO DIỆN THEME PS\nSlide 2: x'); await p.waitForTimeout(300);
      const nhapTruoc = await p.evaluate(() => S.nhap.ds.length);
      await p.click('#thMo'); await p.waitForSelector('#thPsG .thps', { timeout: 8000 }); await p.waitForTimeout(800);
      check('Đổi theme: mở Kho theme ở tab Photoshop, có dòng đang chọn cho bài', !(await p.$eval('#thPsWrap', e => e.hidden)) && !!(await p.$('.thcho')));
      check('nút thẻ ghi "✓ Chọn theme này"', /Chọn theme này/.test(await p.$eval('#thPsG [data-dungps="phang-than-xanh-duong"]', e => e.textContent)));
      await p.click('#thPsG [data-dungps="phang-than-xanh-duong"]'); await p.waitForTimeout(900);
      check('chọn xong: về bài đang viết, giữ brief, không mở nháp mới', /THỬ GIAO DIỆN THEME PS/.test(await p.$eval('#fBrief', e => e.value)) && (await p.evaluate(() => S.nhap.ds.length)) === nhapTruoc);
      check('bấm theme Photoshop: về Photoshop + chọn theme đó', await p.$eval('#segDung [data-d=""]', e => e.classList.contains('on')) && await p.$eval('#thPick [data-thps="phang-than-xanh-duong"]', e => e.classList.contains('on')));
      check('hàng Theme vẫn chỉ 1 theme + chữ Đổi theme', (await p.$$eval('#thPick [data-th], #thPick [data-thps]', x => x.length)) === 1 && /Đổi theme/.test(await p.$eval('#thMo', e => e.textContent)));
      await p.screenshot({ path: '/home/claude/bug3/shots/theme-ps-hang-chon.png' });
      // Chạy: bắt yêu cầu /api/run
      let gui = null; p.on('request', r => { if (r.url().endsWith('/api/run')) gui = JSON.parse(r.postData() || '{}'); });
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
