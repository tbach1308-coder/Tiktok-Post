// 📅 Lịch đăng cả tuần (fen 15/11 11h23) + khung 📱 Máy ↔ Telegram ở trang Số bài (fen 15/11 11h30). Dữ liệu lịch giả: thay S.jobs
// bằng vài bài dựng sẵn quanh hôm nay rồi vẽ lại (lịch chỉ đọc danh sách bài app đã có).
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const GIA = () => {      // chạy trong trang: bài giả quanh hôm nay
  const d0 = new Date(); d0.setHours(0, 0, 0, 0); const t = (ngay, gio) => d0 / 1000 + ngay * 86400 + gio * 3600;
  const thu2 = (d0.getDay() + 6) % 7;     // hôm nay là ngày thứ mấy của tuần (0 = T2)
  const sau = thu2 <= 4 ? 1 : -1, sau2 = thu2 <= 4 ? 2 : -2;     // ngày khác cùng tuần
  S.jobs = [
    { id: 'gia-1', kenh: 'laptop', tieu_de: 'Laptop đã đăng hôm nay', status: 'xong', da_dang: { t: t(0, 9) } },
    { id: 'gia-2', kenh: 'ipad', tieu_de: 'iPad Schedule', status: 'xong', da_dang: { t: t(0, 8), lich: Date.now() / 1000 + 1800 } },
    { id: 'gia-3', kenh: 'laptop', tieu_de: 'Laptop hẹn đăng', status: 'xong', hen_dang: t(sau2, 19.5) },
    { id: 'gia-4', kenh: 'laptop', tieu_de: 'Laptop thứ 2 cùng ngày', status: 'xong', da_dang: { t: t(0, 21), tay: true } },
    { id: 'gia-5', kenh: 'ipad', tieu_de: 'Bài máy Quân', status: 'xong', da_dang: { t: t(0, 10) }, khach: { id: 'mq1', ten: 'Mac Quân Lịch' } },
    { id: 'gia-6', kenh: 'ipad', tieu_de: 'Bài chưa có ngày', status: 'xong' },
  ];
  loadJobs = async () => {};      // giữ bài giả (không lấy lại danh sách thật mỗi 5 giây)
  renderJobs(); lichVe(); return { thu2, sau, sau2 };
};
(async () => {
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const errs = [];
  for (const [w, h] of [[1440, 900], [1024, 760]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } }); p.on('pageerror', e => errs.push(e.message));
    await p.goto(A + '/#moi'); await p.waitForTimeout(1200);
    const nut = await p.evaluate(() => [...document.querySelectorAll('.side .row3 .btn')].filter(e => getComputedStyle(e).display !== 'none').map(e => ({ t: e.textContent, cat: e.scrollWidth > e.clientWidth + 1 })));
    check(w + ': hàng nút có 🎨 Kho theme · 📅 Lịch đăng · 📊 Số bài, không bị cắt chữ', nut.length === 3 && /Lịch đăng/.test(nut[1].t) && nut.every(x => !x.cat), nut);
    await p.click('#bLich'); await p.waitForSelector('.lichpage .lgrid');
    const g = await p.evaluate(GIA); await p.waitForTimeout(200);
    const r = await p.evaluate(() => ({ hash: location.hash, on: document.querySelector('#bLich').classList.contains('on'), o: document.querySelectorAll('.lgrid .lo').length,
      nay: document.querySelectorAll('.lgrid .lh.nay').length, kh: document.querySelector('#lKhoang').textContent, may: document.querySelector('#lMay').value,
      lb: [...document.querySelectorAll('.lgrid .lbi')].map(e => [e.dataset.id, e.className.replace('lbi ', '')]), trung: [...document.querySelectorAll('.lgrid .lo.trung .tr')].map(e => e.textContent),
      trong: document.querySelectorAll('.lgrid .lo .trong').length, them: document.querySelectorAll('.lgrid .them').length,
      tran: document.querySelector('.lichpage').scrollWidth > document.querySelector('#main').clientWidth + 2 }));
    check(w + ': mở 📅 Lịch đăng: hash #lich, nút sáng, 2 kênh × 7 ngày, hôm nay tô', r.hash === '#lich' && r.on && r.o === 14 && r.nay === 1 && /tuần này/.test(r.kh), r);
    check(w + ': bài đúng loại: ✓ đã đăng, ⏳ Schedule, 📌 hẹn đăng; bài chưa có ngày không hiện', JSON.stringify(r.lb.map(x => x[0]).sort()) === JSON.stringify(['gia-1', 'gia-2', 'gia-3', 'gia-4'])
      && r.lb.find(x => x[0] === 'gia-2')[1] === 'lich' && r.lb.find(x => x[0] === 'gia-3')[1] === 'du' && r.lb.find(x => x[0] === 'gia-1')[1] === 'dang', r.lb);
    check(w + ': máy shop mặc định lọc Máy shop: bài máy Quân ẩn', r.may === 'chu' && !r.lb.some(x => x[0] === 'gia-5'), r);
    check(w + ': 2 bài Laptop máy shop cùng hôm nay: báo trùng', r.trung.length === 1 && /máy shop/.test(r.trung[0]), r.trung);
    check(w + ': ngày trống có "Trống"/"Không có bài"', r.trong >= 8, r);
    check(w + ': không tràn ngang', !r.tran, r);
    if (w === 1440) {
      await p.selectOption('#lMay', ''); await p.waitForTimeout(200);
      const r2 = await p.evaluate(() => ({ lb: [...document.querySelectorAll('.lgrid .lbi')].map(e => e.dataset.id), sb: S.sbMay, txt: (document.querySelector('.lgrid .lbi[data-id="gia-5"] i') || {}).textContent }));
      check('chọn Tất cả máy: thấy bài máy Quân (ghi tên máy), ô Máy bên trái đổi theo', r2.lb.includes('gia-5') && r2.sb === '' && /Mac Quân Lịch/.test(r2.txt || ''), r2);
      const k0 = await p.evaluate(() => document.querySelector('#lKhoang').textContent);
      await p.click('#lSau'); await p.waitForTimeout(150);
      const k1 = await p.evaluate(() => ({ k: document.querySelector('#lKhoang').textContent, nay: document.querySelectorAll('.lgrid .lh.nay').length, lb: document.querySelectorAll('.lgrid .lbi').length }));
      await p.click('#lNay'); await p.waitForTimeout(150);
      check('› tuần sau: đổi khoảng ngày, không còn ô hôm nay; Tuần này quay lại', k1.k !== k0 && !/tuần này/.test(k1.k) && k1.nay === 0 && await p.evaluate(k => document.querySelector('#lKhoang').textContent === k, k0), [k0, k1]);
      await p.evaluate(() => { window.__mo = null; openJob = id => { window.__mo = id; }; });
      await p.click('.lgrid .lbi[data-id="gia-3"]'); await p.waitForTimeout(100);
      check('bấm 1 bài trên lịch: mở bài đó', await p.evaluate(() => window.__mo === 'gia-3'));
      await p.click('#lSau'); await p.waitForTimeout(150);
      check('tuần sau: ngày trống có ＋ Bài', await p.evaluate(() => document.querySelectorAll('.lgrid .them').length === 14));
      const kn = await p.evaluate(() => document.querySelector('.lgrid .them').dataset.k);
      await p.click('.lgrid .them'); await p.waitForTimeout(300);
      check('bấm ＋ Bài ở ngày trống: mở Bài mới đúng kênh', await p.evaluate(k => S.view === 'new' && S.form.kenh === k, kn), kn);
      await p.goto(A + '/#lich'); await p.reload(); await p.waitForTimeout(1500);
      check('tải lại (#lich): vẫn ở Lịch đăng', await p.evaluate(() => S.view === 'lich' && !!document.querySelector('.lgrid')));
      await p.screenshot({ path: 'shots/lich-dang.png' });
      // trang Số bài: khung Máy ↔ Telegram
      await p.click('#bThongKe'); await p.waitForSelector('.tkpage tbody tr');
      const tg = await p.evaluate(() => ({ co: !!document.querySelector('.tktg'), txt: (document.querySelector('.tktg') || {}).textContent || '' }));
      check('Số bài có khung 📱 Máy ↔ Telegram (chưa nối Remote: báo chưa gán được)', tg.co && /Máy ↔ Telegram/.test(tg.txt) && /Chưa nối Telegram/.test(tg.txt), tg);
      await p.evaluate(() => { const r = { may: [{ id: 'chu', ten: 'Máy shop', con: true }, { id: 't:mac quân', ten: 'Mac Quân', con: true }, { id: 't:cu', ten: 'Máy cũ', con: false }], bai: [], chi_tieu: {}, luc: 0,
        tg: { 't:mac quân': '222' }, nguoi: [{ id: '111', ten: 'Hoài' }, { id: '222', ten: 'Quân' }], tg_noi: true, tg_nhom: true };
        window.__goi = []; const goc = api; api = async (u, d) => { if (u === '/api/thong-ke') { if (d) window.__goi.push(d); return r; } return goc(u, d); }; });
      await p.click('#tkKhoang [data-k="tuan"]'); await p.waitForTimeout(100); await p.evaluate(() => { stopPoll(); }); await p.click('#bThongKe'); await p.waitForTimeout(500);
      const t2 = await p.evaluate(() => ({ dong: [...document.querySelectorAll('.tktg .tgr')].map(e => [e.querySelector('span').textContent.trim(), e.querySelector('select').value, e.querySelector('select').classList.contains('on')]) }));
      check('nối rồi: mỗi máy đang dùng chung 1 dòng (máy cũ không có), Mac Quân đang nối Quân', t2.dong.length === 2 && t2.dong[1][1] === '222' && t2.dong[1][2] && t2.dong[0][1] === '', t2);
      await p.selectOption('.tktg select[data-tg="chu"]', '111'); await p.waitForTimeout(300);
      check('chọn người cho máy shop: gửi đúng { tg: { may, nguoi } }', await p.evaluate(() => JSON.stringify(window.__goi) === JSON.stringify([{ tg: { may: 'chu', nguoi: '111' } }])), await p.evaluate(() => window.__goi));
    }
    await p.close();
  }
  // máy dùng chung: có nút Lịch, không có ô chọn máy
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con thử lịch' }, H)).b;
  const g = await b.newPage({ viewport: { width: 1280, height: 800 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1500);
  const gk = await g.evaluate(() => ({ nut: [...document.querySelectorAll('.side .row3 .btn')].filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent) }));
  await g.click('#bLich'); await g.waitForSelector('.lgrid');
  check('máy dùng chung: có 🎨 Kho theme + 📅 Lịch đăng (không 📊), lịch không có ô chọn máy', gk.nut.length === 2 && /Lịch/.test(gk.nut[1]) && await g.evaluate(() => !document.querySelector('#lMay')), gk);
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
