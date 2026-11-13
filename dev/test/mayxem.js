// fen 13/11 15h03 "bấm vô chỗ máy Quân thấy Quân đang làm gì": máy shop bấm tên máy trong 💻 Máy khác -> hộp xem máy đó (nháp, bài đang làm, gần đây); máy khách bị chặn /api/chung/may
const { chromium } = require('playwright');
const A = 'http://127.0.0.1:8790';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
(async () => {
  let r = (await j(A + '/api/chung', { bat: true })).b;
  for (let i = 0; i < 30 && !r.chay; i++) { await new Promise(x => setTimeout(x, 500)); r = (await j(A + '/api/chung')).b; }
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' };
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Mac Xem Thử' }, H)).b;
  const HT = Object.assign({ 'X-Poly-Khach': v.token }, H); v.id = (await j(K + '/api/chung/toi', null, HT)).b.id;
  await j(K + '/api/nhap', { ds: [{ id: 'nxem1', kenh: 'ipad', chude: 'Top 3 iPad cho sinh viên', brief: 'Bìa: TOP 3 IPAD CHO SINH VIÊN\nSlide 2: iPad Gen 9\nSlide 3: iPad Air 5', t: Date.now() }], cur: 'nxem1' }, HT);
  const run = (await j(K + '/api/run', { kenh: 'laptop', brief: 'Bìa: BÀI CỦA MAC XEM THỬ\nSlide 2: x' }, HT)).b;
  const cam = await j(K + '/api/chung/may?id=' + v.id, null, HT);
  const api = (await j(A + '/api/chung/may?id=' + v.id)).b;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/'); await p.waitForTimeout(1500); await p.click('#bChung'); await p.waitForSelector('[data-xemmay]', { timeout: 8000 });
  await p.click(`[data-xemmay="${v.id}"]`); await p.waitForSelector('#myBox .mysec', { timeout: 8000 }); await p.waitForTimeout(800);
  const txt = await p.$eval('#myBox', e => e.innerText);
  await (await p.$('#myBox')).screenshot({ path: '/home/claude/bug3/shots/may-xem.png' });
  await p.click('#myBox [data-bai]'); await p.waitForTimeout(1500);
  const moBai = await p.evaluate(() => S.jobId);
  console.log(JSON.stringify({ camKhach: cam.s, apiTen: api.ten, nNhap: (api.nhap || []).length, nBai: (api.bai || []).length, coChuDe: txt.includes('Top 3 iPad cho sinh viên'), coBai: txt.includes('BÀI CỦA MAC XEM THỬ') || txt.includes('Bài của mac xem thử'), dangMo: txt.includes('đang mở app'), moBai, runId: run.id, errs }, null, 1));
  await b.close();
})();
