// ✨ Story decor (fen 17/11 10h45 "thêm story có icon decor như này, hình nền tự thêm"): 4 mẫu "ảnh của fen + decor", nút ✨ Decor thả icon,
// lưu ảnh / lưu thành mẫu giữ icon. Chạy: cd /home/claude/bug3 && bash reset.sh && node storydecor.js
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', APP = '/home/claude/bug3/tgl';
const j = (u, d) => fetch(u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, loi = 0; const check = (n, c, x) => { c ? ok++ : loi++; console.log((c ? '✓ ' : '✗ ') + n, c ? '' : JSON.stringify(x === undefined ? '' : x).slice(0, 400)); };
(async () => {
  for (const d of fs.readdirSync(APP + '/story-mau')) if (/^f[0-9a-f]{8}$/.test(d)) fs.renameSync(APP + '/story-mau/' + d, '/tmp/_bo_mau_' + Date.now() + '_' + d);
  const api = await j(A + '/api/story-mau'), ds = api.b.ds, dc = ds.filter(x => x.nhom === 'decor');
  check('4 mẫu "ảnh của fen + decor" lên đầu thư viện (Noel, Black Friday, Tết, Máy mới về)', dc.length === 4 && ds.slice(0, 4).every(x => x.nhom === 'decor') && dc.map(x => x.id).join() === 'dc-noel,dc-sale,dc-tet,dc-moi', ds.slice(0, 5).map(x => x.id));
  check('kho decor 4 bộ: Noel 12, Sale 8, Tết 7, Ngày thường 8 (có url + cỡ)', (api.b.decor || []).map(b => b.id + b.ds.length).join() === 'noel12,sale8,tet7,thuong8' && api.b.decor.every(b => b.ds.every(x => x.url && x.w > 0 && x.h > 0)), (api.b.decor || []).map(b => b.id + b.ds.length));
  const n = dc[0], ve = n.ve;
  check('mẫu Noel: ô ảnh nền phủ kín (fen tự gắn, không bắt buộc) + nền mờ có sẵn + icon decor', n.o.some(x => x.k === 'anh' && x.loai === 'anh' && x.bo_qua) && /\/api\/story-mau\/decor\/xem\/noel\.jpg/.test(ve.nen_url) &&
    ve.o.filter(x => /\/api\/story-mau\/decor\/noel\//.test(x.src_url || '')).length >= 8 && !n.o.some(x => /^(den|chau|tuyet|keo|qua)/.test(x.k)), { o: n.o.map(x => x.k), nen: ve.nen_url });
  const tai = async u => { const r = await fetch(A + u); return [r.status, r.headers.get('content-type')]; };
  const t = [await tai(ve.o.find(x => x.k === 'chau1').src_url), await tai(ve.nen_url), await tai('/api/story-mau/decor/noel/..%2F..%2Fconfig.json'), await tai('/api/story-mau/decor/abc/x.png'), await tai('/api/story-mau/decor/noel/tao-decor.png')];
  check('file icon / nền mờ đúng loại; đường lạ chặn', t[0][0] === 200 && /png/.test(t[0][1]) && t[1][0] === 200 && /jpeg/.test(t[1][1]) && t.slice(2).every(x => x[0] === 404), t);
  for (const m of dc) { const r = await fetch(A + m.xem); check('ảnh nhỏ mẫu ' + m.ten + ' vẽ được (JPEG)', r.status === 200 && /jpeg/.test(r.headers.get('content-type')), r.status); }
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#storymau=dc-noel'); await p.waitForSelector('#tkCv', { timeout: 15000 }); await p.waitForTimeout(1500);
  const nh = await p.evaluate(() => ({ nhom: [...document.querySelectorAll('#mNhom [data-nh]')].map(x => x.innerText), on: (document.querySelector('#mNhom .on') || {}).innerText, mau: [...document.querySelectorAll('#mPick [data-m]')].map(x => x.dataset.m) }));
  check('trang Story: nhóm "✨ Ảnh của fen + decor" đầu tiên, đang mở, 4 mẫu', /Ảnh của fen \+ decor/.test(nh.nhom[0]) && /decor/.test(nh.on) && nh.mau.join() === 'dc-noel,dc-sale,dc-tet,dc-moi', nh);
  // icon decor đã vẽ lên khung (điểm ở dây đèn / tuyết khác nền)
  const px = await p.evaluate(() => { const c = $('#tkCv').getContext('2d'); const g = (x, y) => [...c.getImageData(x, y, 1, 1).data]; return { tuyet: g(540, 1880), nen: g(540, 700) }; });
  check('khung design vẽ nền mờ + tuyết trắng ở đáy', px.tuyet[0] > 200 && px.tuyet[1] > 200 && px.nen[0] < 120, px);
  const nd = await p.evaluate(() => [...document.querySelectorAll('#tkNd .tkndr')].map(x => x.innerText.split('\n')[0]));
  check('Nội dung (điền nhanh): có ô "Ảnh nền (của fen)" + chữ, không có icon decor', nd.some(x => /Ảnh nền/.test(x)) && !nd.some(x => /Dây đèn|Châu|Kẹo|Tuyết|Hộp quà/.test(x)), nd);
  await p.screenshot({ path: 'shots/story-decor-noel.png' });
  // ✨ Decor
  await p.click('#tkDecorBt'); await p.waitForTimeout(300);
  const dp = await p.evaluate(() => ({ open: $('#tkDecorD').open, bo: [...document.querySelectorAll('#tkDecor [data-db]')].map(x => x.innerText), on: (document.querySelector('#tkDecor [data-db].on') || {}).innerText, n: document.querySelectorAll('#tkDecor [data-di]').length }));
  check('✨ Decor: mở mục decor, 4 bộ, mẫu Noel thì bộ Noel (12 icon)', dp.open && dp.bo.length === 4 && /Noel/.test(dp.on) && dp.n === 12, dp);
  await p.click('#tkDecor [data-db="tet"]'); await p.waitForTimeout(200);
  const n0 = await p.evaluate(() => TK.d.o.length);
  await p.click('#tkDecor [data-di="0"]'); await p.waitForTimeout(600);
  const th = await p.evaluate(() => { const x = TK.d.o[TK.sel]; return { n: TK.d.o.length, x: x && { nhan: x.nhan, img: x.img, w: x.w, h: x.h, x: x.x, y: x.y, tt: x.trang_tri, bq: x.bo_qua }, bang: ($('#tkProp') || {}).innerText }; });
  check('bấm icon Đèn lồng: thêm 1 lớp ảnh trang trí giữa story, đúng tỉ lệ, chọn sẵn', th.n === n0 + 1 && th.x && /Đèn lồng/.test(th.x.nhan) && /\/api\/story-mau\/decor\/tet\/den-long\.png/.test(th.x.img) && th.x.tt && th.x.bq &&
    Math.abs(th.x.h / th.x.w - 420 / 220) < 0.05 && Math.abs(th.x.x + th.x.w / 2 - 540) < 2, th);
  const px2 = await p.evaluate(() => { const c = $('#tkCv').getContext('2d'), x = TK.d.o[TK.sel]; return [...c.getImageData(x.x + x.w / 2, x.y + x.h * 0.45, 1, 1).data]; });
  check('đèn lồng vẽ lên khung (màu đỏ)', px2[0] > 150 && px2[1] < 90, px2);
  // ô ảnh nền: gắn ảnh của fen
  const anh = require('path').join(require('os').tmpdir(), 'anh-nen-thu.png'); { const z = require('zlib'), w = 90, h = 120, raw = Buffer.alloc((w * 3 + 1) * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * (w * 3 + 1) + 1 + x * 3; raw[i] = 30; raw[i + 1] = 60; raw[i + 2] = 200; } const crc = b => { let c, t = [], r = 0xffffffff; for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } for (const v of b) r = t[(r ^ v) & 255] ^ (r >>> 8); return (r ^ 0xffffffff) >>> 0; }; const ch = (ty, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(ty), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); }; const ih = Buffer.alloc(13); ih.writeUInt32BE(w, 0); ih.writeUInt32BE(h, 4); ih[8] = 8; ih[9] = 2; fs.writeFileSync(anh, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), ch('IHDR', ih), ch('IDAT', z.deflateSync(raw)), ch('IEND', Buffer.alloc(0))])); }
  await p.evaluate(() => { const i = TK.d.o.findIndex(x => x.k === 'anh'); TK.sel = i; tkBang(); });
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#tkpChon')]); await fc.setFiles(anh); await p.waitForTimeout(1200);
  const px3 = await p.evaluate(() => { const c = $('#tkCv').getContext('2d'); return [...c.getImageData(540, 600, 1, 1).data]; });
  check('gắn ảnh nền của fen: phủ kín khung (màu ảnh thử)', px3[2] > 150 && px3[0] < 80, px3);
  // lưu ảnh (vẽ ở trình duyệt, icon cùng nguồn không chặn xuất ảnh)
  await p.click('#tkLuu'); await p.waitForTimeout(1500);
  const kq = await p.evaluate(() => TK.kq && { ten: TK.kq.ten });
  check('📸 Lưu ảnh: ra ảnh story (có icon decor)', !!(kq && kq.ten && /^story-.*dc-noel\.jpg$/.test(kq.ten)), kq);
  // lưu thành mẫu: icon decor giữ đường kho decor
  await p.click('#tkMau'); await p.waitForSelector('#tkmTen'); await p.fill('#tkmTen', 'Noel thử decor'); await p.click('#tkmMoi'); await p.waitForTimeout(1500);
  const fm = fs.readdirSync(APP + '/story-mau').find(d => /^f[0-9a-f]{8}$/.test(d));
  const mj = fm && JSON.parse(fs.readFileSync(APP + '/story-mau/' + fm + '/mau.json', 'utf8'));
  const dl = mj && mj.o.find(x => x.src === 'decor/tet/den-long.png');
  check('💾 Lưu thành mẫu: icon decor giữ "decor/tet/den-long.png" (không chép ảnh), mẫu mới mở được', mj && dl && dl.src === 'decor/tet/den-long.png' && mj.o.filter(x => /^decor\//.test(x.src || '')).length === 9 && dl.trang_tri, mj && mj.o.map(x => x.src).filter(Boolean));
  const r2 = await j(A + '/api/story-mau'), mf = r2.b.ds.find(x => x.id === fm);
  check('mẫu của fen: icon decor lấy từ kho decor', mf && mf.ve.o.some(x => /\/api\/story-mau\/decor\/tet\/den-long\.png/.test(x.src_url || '')), mf && mf.ve.o.map(x => x.src_url).filter(Boolean).slice(0, 3));
  const xm = await fetch(A + mf.xem); check('ảnh nhỏ mẫu của fen vẽ được (Pillow đọc icon decor)', xm.status === 200, xm.status);
  // 4 mẫu: chụp để xem bố cục
  for (const m of ['dc-sale', 'dc-tet', 'dc-moi']) { await p.goto(A + '/#storymau=' + m); await p.waitForSelector('#tkCv'); await p.waitForTimeout(1500);
    const cv = await p.$('#tkCv'); await cv.screenshot({ path: 'shots/story-' + m + '.png' }); }
  await p.goto(A + '/#storymau=dc-noel'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(1200); await (await p.$('#tkCv')).screenshot({ path: 'shots/story-dc-noel.png' });
  check('không lỗi JS', errs.length === 0, errs);
  if (fm) fs.renameSync(APP + '/story-mau/' + fm, '/tmp/_bo_mau_' + Date.now() + '_' + fm);
  await b.close();
  console.log('\nKẾT QUẢ: %d đạt, %d lỗi', ok, loi); process.exit(loi ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
