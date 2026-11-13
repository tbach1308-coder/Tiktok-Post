const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', H = 'http://poly-thu.example';
const j = (u, d) => fetch(A + u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
const k = (u, tok, d) => fetch('http://127.0.0.1:8791' + u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', Host: 'poly-thu.example', 'X-Poly-Khach': tok || '' }, body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
(async () => {
  let r = await j('/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = await j('/api/chung'); }
  const m = await j('/api/chung', { ma_moi: true });
  const v = await k('/api/chung/vao', '', { ma: m.ma, ten: 'Mac Quân' });
  const R = () => Math.random().toString(36).slice(2, 12).padEnd(10, 'x').slice(0, 10);
  await k('/api/theme-canva', v.token, { them: { link: `https://www.canva.com/design/D${R()}/a/edit`, ten: 'Theme riêng của Mac', kenh: 'ipad' } });
  const run = await k('/api/run', v.token, { kenh: 'laptop', brief: 'Bìa: BÀI CỦA MAC QUÂN\nSlide 2: x', theme_ps: 'phang-xanh-dem' });
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const out = {}, errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); p.on('pageerror', e => errs.push('chu: ' + e.message));
  await p.goto(A + '/'); await p.waitForTimeout(1500); await p.click('#bTheme'); await p.waitForSelector('#thG .thc', { timeout: 10000 }); await p.waitForTimeout(800);
  out.chuTruoc = { rieng: await p.$$eval('#thG .thc', x => x.length), chung: await p.$$eval('#thKcG .thc', x => x.length), coMac: await p.$$eval('#thG .thc b', x => x.some(e => /Mac/.test(e.textContent))) };
  const nut = await p.$('#thG .kctg:not(.on)'); if (nut) { await nut.click(); await p.waitForTimeout(1200); }
  out.chuSau = { chung: await p.$$eval('#thKcG .thc', x => x.length), ghi: await p.$eval('#thKcGhi', x => x.textContent) };
  await p.screenshot({ path: 'shots/kho-chu.png', fullPage: true });
  // danh sách bài: lọc máy
  out.locMay = await p.$$eval('#sbMaySel option', x => x.map(e => e.textContent));     // 13/11: ô chọn máy (trước là hàng nút)
  const mMay = await p.$$eval('#sbMaySel option', x => (x.find(e => /^m/.test(e.value)) || {}).value); if (mMay) { await p.selectOption('#sbMaySel', mMay); await p.waitForTimeout(500); }
  out.sauLoc = await p.$$eval('#jobs .ji .t', x => x.map(e => e.textContent));
  await (await p.$('aside, .side, #jobs')).screenshot({ path: 'shots/loc-may.png' }).catch(() => {});
  // máy khách
  const g = await b.newPage({ viewport: { width: 1440, height: 1000 } }); g.on('pageerror', e => errs.push('khach: ' + e.message));
  await g.goto(H + '/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])'); await g.waitForTimeout(800);
  await g.click('#bTheme'); await g.waitForSelector('#thKcG .thc, #thG .thc', { timeout: 10000 }); await g.waitForTimeout(800);
  out.khach = { rieng: await g.$$eval('#thG .thc b', x => x.map(e => e.textContent)), chung: await g.$$eval('#thKcG .thc', x => x.length),
    chungCoChinh: await g.$$eval('#thKcG [data-chinh], #thKcG [data-more]', x => x.length), riengCoChinh: await g.$$eval('#thG [data-chinh]', x => x.length),
    kcd: await g.$eval('#thKcd', x => getComputedStyle(x).display), sync: await g.$eval('.thdb', x => getComputedStyle(x).display).catch(() => 'không có'),
    bai: await g.$$eval('#jobs .ji .t', x => x.map(e => e.textContent)) };
  await g.screenshot({ path: 'shots/kho-khach.png', fullPage: true });
  out.errs = errs; console.log(JSON.stringify(out, null, 1)); await b.close();
})();
