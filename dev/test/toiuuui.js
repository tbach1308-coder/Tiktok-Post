// fen 13/11 18h50 "tối ưu app", 19h02 "đảm bảo máy admin và máy con chạy trơn": app để nền thì 30 giây mới hỏi máy chủ 1 lần,
// mở lên là hỏi ngay; máy con nhận trang app nén gzip mà vẫn chạy bình thường. Thử cả máy shop (cổng app) và máy con (cổng khách).
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(r => r.json());
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const ngu = ms => new Promise(x => setTimeout(x, ms));
const an = (p, v) => p.evaluate(v => {      // giả cửa sổ app thu nhỏ / bị che (document.hidden) rồi báo trang như trình duyệt thật
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => v });
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => v ? 'hidden' : 'visible' });
  document.dispatchEvent(new Event('visibilitychange'));
}, v);

async function thu(ten, p, url, demJob) {
  const hoi = []; p.on('request', r => { const u = new URL(r.url()); if (u.pathname === '/api/jobs' || (demJob && u.pathname === '/api/job/' + demJob)) hoi.push([u.pathname, Date.now()]); });
  const dem = (path, t) => hoi.filter(([x, at]) => x === path && at >= t).length;
  await p.goto(url); await p.waitForTimeout(2500);
  let t = Date.now(); await p.waitForTimeout(11000);
  const hienDs = dem('/api/jobs', t), hienBai = demJob ? dem('/api/job/' + demJob, t) : 0;
  check(ten + ': app đang hiện, danh sách bài hỏi đều (≥ 2 lần / 11 giây)', hienDs >= 2, hienDs);
  if (demJob) check(ten + ': trang bài đang mở hỏi đều (≥ 1 lần / 11 giây)', hienBai >= 1, hienBai);
  await an(p, true); await p.waitForTimeout(500); t = Date.now(); await p.waitForTimeout(22000);
  const anDs = dem('/api/jobs', t), anBai = demJob ? dem('/api/job/' + demJob, t) : 0;
  check(ten + ': để nền 22 giây: danh sách bài không hỏi (trước 4–5 lần)', anDs === 0, anDs);
  if (demJob) check(ten + ': để nền 22 giây: trang bài không hỏi', anBai === 0, anBai);
  t = Date.now(); await p.waitForTimeout(12000);
  const anDs2 = dem('/api/jobs', t);
  check(ten + ': để nền quá 30 giây: hỏi lại 1 lần (vẫn biết bài xong)', anDs2 === 1, anDs2);
  t = Date.now(); await an(p, false); await p.waitForTimeout(2000);
  const lenDs = dem('/api/jobs', t), lenBai = demJob ? dem('/api/job/' + demJob, t) : 0;
  check(ten + ': mở app lên: hỏi danh sách ngay (trong 2 giây)', lenDs >= 1, lenDs);
  if (demJob) check(ten + ': mở app lên: trang bài hỏi ngay (trong 2 giây)', lenBai >= 1, lenBai);
}

(async () => {
  const ds = (await j(A + '/api/jobs')).jobs || [];
  const bai = ds.find(x => x.status === 'xong');
  let r = await j(A + '/api/chung', { bat: true });
  for (let i = 0; i < 30 && !r.chay; i++) { await ngu(500); r = await j(A + '/api/chung'); }
  const ma = (await j(A + '/api/chung', { ma_moi: true })).ma;
  const v = await j(K + '/api/chung/vao', { ma, ten: 'Máy con thử tối ưu' }, H);
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] });
  const errs = [];
  // máy shop: mở 1 bài xong
  const p = await b.newPage(); p.on('pageerror', e => errs.push('shop: ' + e.message));
  await thu('Máy shop', p, A + '/' + (bai ? '#bai=' + bai.id : ''), bai && bai.id);
  // máy con: trang app nén gzip, chạy bình thường
  const g = await b.newPage(); g.on('pageerror', e => errs.push('con: ' + e.message));
  const nen = {}; g.on('response', x => { const u = new URL(x.url()); if (u.pathname === '/' || u.pathname === '/api/theme-ps') nen[u.pathname] = x.headers()['content-encoding'] || ''; });
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {});
  await g.waitForTimeout(2000);
  check('Máy con: trang app nhận dạng nén gzip', nen['/'] === 'gzip', nen);
  const kh = await g.evaluate(() => ({ khach: !document.querySelector('#khc').hidden, tabs: !!document.querySelector('#sbTabs button') }));
  check('Máy con: app chạy bình thường (đã vào dùng chung, có cột bài)', kh.khach && kh.tabs, kh);
  await thu('Máy con', g, 'http://poly-thu.example/', null);
  check('không lỗi JS (máy shop + máy con)', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log('KẾT QUẢ: ' + ok + ' đạt, ' + bad + ' lỗi');
})();
