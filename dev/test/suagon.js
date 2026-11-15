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
    drop: getComputedStyle(document.querySelector('#fdrop')).display, nut: !!document.querySelector('.fin #fpick'), lbl: !!document.querySelector('#fixCard .lbl') }));
  check('khung Hỏi / sửa bài gọn (thấp hơn 230px), không còn nhãn dài, có nút 📎, khung ảnh ẩn khi chưa có ảnh', r.h < 230 && !r.lbl && r.nut && r.drop === 'none' && r.tom.length < 70, r);
  await p.evaluate(() => { const df = draft(); df.anh.push({ name: 'a.png', data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }); renderThumbs($('#fdrop'), df.anh); });
  check('có ảnh: khung ảnh hiện (ảnh nhỏ + nút bỏ)', await p.evaluate(() => getComputedStyle(document.querySelector('#fdrop')).display !== 'none' && document.querySelectorAll('#fdrop .th').length === 1));
  await p.evaluate(() => { const df = draft(); df.anh.splice(0); renderThumbs($('#fdrop'), df.anh); document.querySelector('#fdrop').classList.add('hot'); });
  check('đang kéo ảnh vào: khung hiện chữ "Thả ảnh vào đây"', await p.evaluate(() => getComputedStyle(document.querySelector('#fdrop')).display !== 'none' && /Thả ảnh/.test(document.querySelector('#fdrop').innerText)));
  await p.evaluate(() => document.querySelector('#fdrop').classList.remove('hot'));
  await p.evaluate(() => { const o = document.querySelector('.slfix[data-fn="2"]'); o.value = 'đổi ảnh'; o.dispatchEvent(new Event('input')); }); await p.waitForTimeout(150);
  check('ghi ở ô dưới slide 2: dòng tóm tắt "Kèm ghi sửa ở slide 2", nút "Gửi (kèm 1 slide)"', await p.evaluate(() => /slide 2/.test(document.querySelector('#fixTom').textContent) && $('#bFix').textContent === 'Gửi (kèm 1 slide)'));
  await p.evaluate(() => { const o = document.querySelector('.slfix[data-fn="2"]'); o.value = ''; o.dispatchEvent(new Event('input')); });
  await p.fill('#fixText', ''); await p.evaluate(() => { const df = draft(); df.text = ''; });
  // fen 15/11 12h01 "nút telegram dài bằng nút đăng tiktok": bài đã đăng (không còn ⏰ Hẹn giờ đăng) thì Gửi Telegram cả hàng
  const jd = js.jobs.find(x => x.status === 'xong' && x.da_dang);
  if (jd) { await p.goto('http://127.0.0.1:8790/#bai=' + jd.id); await p.reload(); await p.waitForSelector('#bGuiTg', { timeout: 15000 }); await p.waitForTimeout(300);
    const w = await p.evaluate(() => ({ tg: Math.round(document.querySelector('#bGuiTg').getBoundingClientRect().width), pa: Math.round(document.querySelector('.post .pa2').getBoundingClientRect().width), hen: !!document.querySelector('#bHenDang') }));
    check('bài đã đăng: nút Gửi Telegram dài cả hàng (bằng nút Đăng TikTok)', !w.hen && w.tg === w.pa, w); }
  // fen 15/11 12h15 "bấm chuyển tab không cần hỏi": bấm kênh khác ở "Kênh của bài" là đổi luôn, không hiện câu hỏi thư mục
  const jk = js.jobs.find(x => x.status === 'xong' && x.kenh === 'ipad');
  if (jk) { await p.goto('http://127.0.0.1:8790/#bai=' + jk.id); await p.reload(); await p.waitForSelector('#jb [data-kenh="laptop"]', { timeout: 15000 });
    await p.click('#jb [data-kenh="laptop"]'); await p.waitForTimeout(1200);
    const k1 = (await (await fetch('http://127.0.0.1:8790/api/job/' + jk.id)).json()).job.kenh;
    check('bấm Laptop ở Kênh của bài: đổi luôn, không hỏi', k1 === 'laptop' && await p.evaluate(() => !document.querySelector('.kxn')), k1);
    await p.click('#jb [data-kenh="ipad"]'); await p.waitForTimeout(1200);
    check('bấm iPad lại: về iPad', (await (await fetch('http://127.0.0.1:8790/api/job/' + jk.id)).json()).job.kenh === 'ipad'); }
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
