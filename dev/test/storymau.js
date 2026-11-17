// 📱 Thư viện mẫu story (fen 15/11 13h07 "phần này cho thư viện template tạo riêng, để gắn ảnh vô chạy, cho điền text") + 🎨 khung design
// kéo thả (13h58 "cho có công cụ design cơ bản như canva", chọn "Kéo thả trên ảnh"; 13h57 / 14h04 "cho preview trực tiếp"): khung 9:16
// vẽ trên trình duyệt = xem trước trực tiếp; chọn / kéo / đổi cỡ, bảng chỉnh chữ màu cỡ, thêm chữ / ảnh / khối, hoàn tác, Lưu ảnh 1080×1920,
// ⬇ Tải về máy (14h07 "cho thêm nút lưu ảnh"), Lưu thành mẫu (máy shop), thư viện font + kiểu chữ có sẵn (14h18). Mẫu fen thêm bằng ảnh nền + bố cục vẫn có. Máy dùng chung làm
// ảnh được, không lưu / bỏ mẫu.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', K = 'http://127.0.0.1:8791', H = { Host: 'poly-thu.example' }, APP = '/home/claude/bug3/tgl';
const j = (u, d, h) => fetch(u, { method: d ? 'POST' : 'GET', headers: Object.assign({ 'Content-Type': 'application/json' }, h || {}), body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const pil = (f, xy) => JSON.parse(execFileSync('python3', ['-c', `import json,sys;from PIL import Image;im=Image.open(sys.argv[1]).convert('RGB');print(json.dumps([im.size,im.getpixel((${xy}))]))`, f]).toString());
execFileSync('python3', ['-c', `from PIL import Image,ImageDraw
im=Image.new('RGB',(1600,1200),'#f0f0f0');d=ImageDraw.Draw(im);d.rounded_rectangle((300,100,1300,1100),60,fill='#2b6cff');im.save('/tmp/sm-may.png')
n=Image.new('RGB',(1200,2000),'#f4e6c8');ImageDraw.Draw(n).rectangle((0,0,1200,300),fill='#c0392b');n.save('/tmp/sm-nen.jpg')`]);
(async () => {
  for (const d of fs.readdirSync(APP + '/story-mau')) if (/^f[0-9a-f]{8}$/.test(d)) fs.renameSync(APP + '/story-mau/' + d, '/tmp/_bo_mau_' + Date.now() + '_' + d);   // mẫu fen của lần thử trước
  const api = await j(A + '/api/story-mau');
  check('API: 10 mẫu có sẵn (6 mẫu + 4 mẫu reel Facebook, kèm bản vẽ đầy đủ) + 4 bố cục', api.b.ds.filter(x => x.san && !/^(ps|dc)-/.test(x.id)).map(x => x.id).slice(0, 10).join() === 'may-moi-ve,gia-soc,so-sanh,feedback,thong-bao,noel,fb-moi-ve,fb-top3,fb-sale,fb-review' && api.b.bo_cuc.length === 4 && api.b.ds.find(x => x.id === 'gia-soc').ve.nen === '#a61e1e' && api.b.ds.find(x => x.id === 'gia-soc').ve.o.length >= 7, api.b.ds.map(x => x.id));
  const ps = api.b.ds.filter(x => x.nhom === 'ps'), glass = ps.find(x => x.id === 'ps-glass-tim-hong');
  check('mẫu theo kho theme Photoshop (fen 14h43 "cho theme giống style kho photoshop"): 1 mẫu / theme (13 + 5 theme Noel ở nhóm 🎄 Noel), màu + font theo theme (Glass tím hồng 16/11 dựng như bìa Photoshop: nền 110C26 + đốm màu, TÊN MÁY cam FB923C League Spartan), ảnh nền làm mờ + lớp kính', ps.length === 13 && api.b.ds.filter(x => x.nhom === 'noel').length === 5 && glass.ve.nen === '#110C26' && /nen-story\.jpg/.test(glass.ve.nen_url) && glass.ve.o.find(x => x.k === 'ten').mau === '#FB923C' && glass.ve.o.find(x => x.k === 'ten').ff === 'spartan' && glass.ve.o.some(x => x.k === 'nen_anh' && x.mo > 0 && x.toi > 0) && glass.ve.o.some(x => x.k === 'phu_kinh' && x.chi_khi_co === 'nen_anh'), { n: ps.length, g: glass && glass.ve.o.slice(0, 3) });
  const fb = api.b.ds.find(x => x.id === 'fb-top3');
  check('mẫu reel Facebook (fen 14h19 "clone theme reel facebook"): có vùng Facebook che (trên 270, dưới 1250, phải 940), chữ / ảnh nằm trong vùng an toàn', fb.ve.vung && fb.ve.vung.duoi === 1250 && fb.ve.vung.phai === 940 && api.b.ds.filter(x => /^fb-/.test(x.id)).every(m => m.ve.o.filter(x => x.loai === 'chu').every(x => x.y >= 270 && x.y + x.h <= 1250 && x.x + x.w <= 940)), fb.ve.vung);
  const xem = await fetch(A + api.b.ds.find(x => x.id === 'gia-soc').xem);
  check('ảnh xem trước mẫu (JPG nhỏ)', xem.status === 200 && /jpeg/.test(xem.headers.get('content-type')), xem.status);
  const b = await chromium.launch({ args: ['--host-resolver-rules=MAP poly-thu.example 127.0.0.1:8791'] }); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 950 }, acceptDownloads: true }); p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  await p.goto(A + '/#story'); await p.waitForSelector('#mPick [data-m]');
  await p.evaluate(() => { localStorage.removeItem('poly-tk'); localStorage.removeItem('poly-st-tab'); });
  await p.reload(); await p.waitForSelector('#mPick [data-m]');
  const t1 = await p.evaluate(() => ({ hash: location.hash, n: document.querySelectorAll('#mPick [data-m]').length, them: !!$('#mThem'), chon: document.querySelector('#mPick .on').dataset.m, tab: !!$('#stTab'), tatca: !!document.querySelector('#mNhom [data-nh=""]') }));
  check('📱 Story chỉ còn thư viện mẫu (fen 16/11 bỏ tab "Từ bài đã làm" + nút "Tất cả"): mở nhóm đầu ✨ Ảnh của fen + decor (4 mẫu, 17/11), nút Thêm mẫu của fen, chọn sẵn mẫu đầu, #storymau=…', t1.n === 4 && !t1.tab && !t1.tatca && t1.them && t1.chon === 'dc-noel' && t1.hash === '#storymau=dc-noel', t1);
  await p.click('#mNhom [data-nh="co-ban"]'); await p.waitForSelector('#tkCv'); await p.click('#mPick [data-m="gia-soc"]'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(800);
  const px = (x, y) => p.evaluate(([x, y]) => [...$('#tkCv').getContext('2d').getImageData(x, y, 1, 1).data].slice(0, 3), [x, y]);
  const e0 = await p.evaluate(() => ({ cv: !!$('#tkCv'), nd: [...document.querySelectorAll('#tkNd [data-nd]')].map(t => t.value), n: TK.d.o.length }));
  check('chọn Giá sốc: khung design 9:16 + "Nội dung" điền sẵn chữ mẫu (Nhãn GIÁ SỐC HÔM NAY …)', e0.cv && e0.nd[0] === 'GIÁ SỐC HÔM NAY' && e0.nd.includes('16.490.000đ'), e0);
  const truoc = await p.evaluate(() => $('#tkCv').toDataURL().length);
  const iTen = await p.evaluate(() => TK.d.o.findIndex(x => x.k === 'ten'));
  await p.fill(`#tkNd [data-nd="${iTen}"]`, 'iPad Air 5 M1 64GB'); await p.waitForTimeout(250);
  check('xem trước trực tiếp: gõ chữ là khung vẽ lại ngay (không cần bấm Làm ảnh)', await p.evaluate(n => $('#tkCv').toDataURL().length !== n && TK.d.o.find(x => x.k === 'ten').text === 'iPad Air 5 M1 64GB', truoc));
  const box = await p.locator('#tkCv').boundingBox(), k = box.width / 1080, cl = (x, y) => [box.x + x * k, box.y + y * k];
  const ten = await p.evaluate(() => TK.d.o.find(x => x.k === 'ten'));
  await p.mouse.click(...cl(ten.x + ten.w / 2, ten.y + 30)); await p.waitForTimeout(200);
  check('bấm vào chữ trên khung: chọn đúng ô (viền xanh), bảng bên trái hiện chỉnh chữ', await p.evaluate(() => TK.d.o[TK.sel].k === 'ten' && !!$('#tkpText') && $('#tkpText').value === 'iPad Air 5 M1 64GB'));
  await p.mouse.move(...cl(ten.x + ten.w / 2, ten.y + 30)); await p.mouse.down(); await p.mouse.move(...cl(ten.x + ten.w / 2 + 90, ten.y + 30 - 120), { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(200);
  const sau = await p.evaluate(() => TK.d.o.find(x => x.k === 'ten'));
  check('kéo chữ: di chuyển theo chuột (≈ +90, -120)', Math.abs(sau.x - ten.x - 90) < 8 && Math.abs(sau.y - ten.y + 120) < 8, [ten.x, ten.y, sau.x, sau.y]);
  await p.mouse.move(...cl(sau.x + sau.w / 2 + 5, sau.y + 30)); await p.mouse.down(); await p.mouse.move(...cl(sau.x + sau.w / 2 - 85, sau.y + 32), { steps: 6 }); await p.mouse.up();
  check('kéo gần đường giữa: dính giữa khung', await p.evaluate(() => { const x = TK.d.o.find(x => x.k === 'ten'); return Math.abs(x.x + x.w / 2 - 540) < 1; }));
  const s1 = await p.evaluate(() => TK.d.o.find(x => x.k === 'ten'));
  await p.mouse.move(...cl(s1.x + s1.w - 4, s1.y + s1.h - 4)); await p.mouse.down(); await p.mouse.move(...cl(s1.x + s1.w - 104, s1.y + s1.h + 56), { steps: 6 }); await p.mouse.up();
  const s2 = await p.evaluate(() => TK.d.o.find(x => x.k === 'ten'));
  check('kéo ô vuông góc dưới phải: đổi cỡ khung chữ', Math.abs(s2.w - (s1.w - 100)) < 8 && Math.abs(s2.h - (s1.h + 60)) < 8, [s1.w, s1.h, s2.w, s2.h]);
  await p.$eval('#tkpMau', e => { e.value = '#00ff00'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await p.waitForTimeout(150);
  await p.$eval('#tkpCo', e => { e.value = '90'; e.dispatchEvent(new Event('input', { bubbles: true })); }); await p.waitForTimeout(150);
  check('bảng chỉnh: đổi màu chữ / cỡ chữ là thấy ngay', await p.evaluate(() => { const x = TK.d.o.find(x => x.k === 'ten'); return x.mau === '#00ff00' && x.co === 90; }));
  const nTruoc = await p.evaluate(() => TK.d.o.length);
  await p.click('[data-them="chu"]'); await p.waitForTimeout(150);
  await p.click('#tkUndo'); await p.waitForTimeout(150); const nUndo = await p.evaluate(() => TK.d.o.length);
  await p.click('#tkRedo'); await p.waitForTimeout(150); const nRedo = await p.evaluate(() => TK.d.o.length);
  check('＋ Chữ thêm ô chữ mới (chọn sẵn), ↶ hoàn tác bỏ đi, ↷ làm lại có lại', nUndo === nTruoc && nRedo === nTruoc + 1, [nTruoc, nUndo, nRedo]);
  await p.focus('#tkCv'); await p.keyboard.press('Delete'); await p.waitForTimeout(150);
  check('phím Delete: xoá ô đang chọn', await p.evaluate(n => TK.d.o.length === n && TK.sel === -1, nTruoc));
  // khung design mẫu reel FB vẽ vạch vùng Facebook
  await p.click('#mNhom [data-nh="fb"]'); await p.waitForSelector('#tkCv'); await p.click('#mPick [data-m="fb-moi-ve"]'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(500);
  const vfb = await p.evaluate(() => { const c = $('#tkCv').getContext('2d'); return [...c.getImageData(10, 1250, 1, 1).data].slice(0, 3).concat([...c.getImageData(940, 1262, 1, 1).data].slice(0, 3)); });
  check('mẫu reel FB trong khung design: vạch vùng Facebook (dưới 1250, cột nút bên phải 940)', vfb[0] > 60 && vfb[3] > 60, vfb);
  // nhóm Theme Photoshop + nền kính làm mờ
  await p.click('#mNhom [data-nh="ps"]'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(300);
  const nps = await p.evaluate(() => document.querySelectorAll('#mPick [data-m]').length);
  await p.click('#mPick [data-m="ps-glass-tim-hong"]'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(600);
  const g0 = await p.evaluate(() => [...$('#tkCv').getContext('2d').getImageData(20, 1800, 1, 1).data].slice(0, 3));
  const iMay = await p.evaluate(() => TK.d.o.findIndex(x => x.k === 'nen_anh'));
  const [fcg] = await Promise.all([p.waitForEvent('filechooser'), p.click(`#tkNd [data-anh="${iMay}"]`)]); await fcg.setFiles('/tmp/sm-may.png');
  await p.waitForFunction(i => /^img:/.test(TK.d.o[i].img || ''), iMay); await p.waitForTimeout(700);
  const g1 = await p.evaluate(() => [...$('#tkCv').getContext('2d').getImageData(20, 1800, 1, 1).data].slice(0, 3));
  check('nhóm "Theme Photoshop" lọc 13 mẫu; mẫu Glass: gắn Ảnh nền thì ảnh làm mờ + tối + lớp kính (góc dưới đổi màu)', nps === 13 && JSON.stringify(g0) !== JSON.stringify(g1), { nps, g0, g1 });
  await p.click('#mNhom [data-nh="co-ban"]'); await p.waitForSelector('#tkCv');
  await p.click('#mPick [data-m="gia-soc"]'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(400);
  // 🔤 thư viện chữ (fen 14h18 "cho thư viện chữ đẹp đi, font phù hợp nhiều mùa, chủ đề")
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(x => x.k === 'nhan'); tkBang(); });
  await p.click('#tkpFf'); await p.waitForSelector('#tkpFg:not([hidden])');
  const nf = await p.evaluate(() => document.querySelectorAll('#tkpFg [data-ff]').length);
  await p.click('#tkpFg [data-ff="lobster"]'); await p.waitForTimeout(600);
  check('Font: bảng 18 font (hiện đại, sale, sang trọng, Tết, Noel, viết tay…) chọn là đổi ngay, font tải về dùng được', nf === 18 && await p.evaluate(() => TK.d.o.find(x => x.k === 'nhan').ff === 'lobster' && document.fonts.check('400 40px "tv-lobster"', 'Ưu đãi')), nf);
  const nk0 = await p.evaluate(() => TK.d.o.length);
  await p.selectOption('#tkMenu', 'kieu'); await p.waitForTimeout(150);   // 17/11: Kiểu chữ nằm trong ô chọn mục
  await p.click('[data-kieu="5"]'); await p.waitForTimeout(300);
  check('Kiểu chữ có sẵn: đang chọn chữ thì đổi kiểu (GIÁ SỐC: Anton vàng viền đen), không thêm ô', await p.evaluate(n => { const x = TK.d.o.find(x => x.k === 'nhan'); return TK.d.o.length === n && x.ff === 'anton' && x.mau === '#ffe600' && x.vien === '#111111' && x.text === 'GIÁ SỐC HÔM NAY'; }, nk0));
  await p.evaluate(() => { TK.sel = -1; tkBang(); }); await p.click('[data-kieu="0"]'); await p.waitForTimeout(300);
  check('chưa chọn chữ: bấm kiểu "Chúc Mừng Năm Mới" thêm ô chữ mới đúng kiểu (Lobster, vàng, viền đỏ)', await p.evaluate(n => { const x = TK.d.o[TK.sel]; return TK.d.o.length === n + 1 && x.text === 'Chúc Mừng Năm Mới' && x.ff === 'lobster' && x.vien === '#8b0a14'; }, nk0));
  await p.click('#tkUndo'); await p.waitForTimeout(150); await p.selectOption('#tkMenu', 'nd'); await p.waitForTimeout(150);
  const iAnh = await p.evaluate(() => TK.d.o.findIndex(x => x.loai === 'anh'));
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click(`#tkNd [data-anh="${iAnh}"]`)]);
  await fc.setFiles('/tmp/sm-may.png'); await p.waitForFunction(i => /^img:/.test(TK.d.o[i].img || '') && !!tkHinh(TK.d.o[i].img), iAnh, { timeout: 8000 });
  await p.waitForTimeout(300); const a = await p.evaluate(i => TK.d.o[i], iAnh);
  const cx = await px(Math.round(a.x + a.w / 2), Math.round(a.y + a.h / 2));
  check('gắn ảnh vào ô ảnh: ảnh hiện ngay trên khung (giữa ô màu xanh của ảnh)', cx[2] > 200 && cx[0] < 100, cx);
  await p.click('[data-them="hcn"]'); await p.waitForTimeout(100);
  await p.click('[data-lop="xuong"]'); await p.click('[data-lop="doi"]'); await p.waitForTimeout(100);
  check('＋ Khối, ⬇ Xuống lớp, ⧉ Nhân đôi', await p.evaluate(() => TK.d.o.filter(x => x.loai === 'hcn').length === 3));
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), p.click('#tkTai')]);
  const dp = '/tmp/tk-tai.jpg'; await dl.saveAs(dp); const dpx = pil(dp, '40,1700');
  check('⬇ Tải về máy (fen 14h07 "cho thêm nút lưu ảnh"): tải thẳng ảnh 1080×1920 đúng khung, chưa cần Lưu ảnh', /^story-\d{8}-\d{6}-gia-soc\.jpg$/.test(dl.suggestedFilename()) && dpx[0][0] === 1080 && dpx[1][0] > 140, [dl.suggestedFilename(), dpx]);
  await p.click('#tkLuu'); await p.waitForSelector('#tkTg', { timeout: 15000 });
  const r1 = await p.evaluate(() => ({ st: $('#tkTt').textContent, tg: !!$('#tkTg'), mo: !!$('#tkMo'), mau: !!$('#tkMau') }));
  r1.ten = (r1.st.match(/story-[\w-]+\.jpg/) || [])[0];
  const thang = new Date().toISOString().slice(0, 7), file = APP + '/Story/' + thang + '/' + r1.ten;
  const f1 = fs.existsSync(file) ? pil(file, '40,1700') : null, f2 = f1 && pil(file, '540,600');      // trong ảnh máy (khối vàng vừa thêm che giữa ô ảnh)
  check('📸 Lưu ảnh: ảnh 1080×1920 vẽ đúng khung (nền đỏ, ảnh máy), lưu thư mục Story, có 📨 Telegram / 📂 / 💾', f1 && f1[0][0] === 1080 && f1[0][1] === 1920 && f1[1][0] > 140 && f2[1][2] > 200 && r1.tg && r1.mo && r1.mau, { r1, f1, f2 });
  const tg = await j(A + '/api/story-mau', { tg: r1.ten });
  check('📨 Gửi Telegram ảnh vừa lưu (hoặc báo cần cài Telegram)', (tg.s === 200 && tg.b.ok) || /CAI_TELEGRAM/.test(tg.b.err || ''), tg);
  await p.reload(); await p.waitForSelector('#tkCv'); await p.waitForTimeout(500);
  check('tải lại trang: vẫn mẫu Giá sốc, chỉnh sửa còn nguyên (ảnh vừa gắn thì không nhớ)', await p.evaluate(() => location.hash === '#storymau=gia-soc' && TK.d.o.find(x => x.k === 'ten').text === 'iPad Air 5 M1 64GB' && TK.d.o.find(x => x.k === 'ten').mau === '#00ff00'));
  const [fc2] = await Promise.all([p.waitForEvent('filechooser'), p.click(`#tkNd [data-anh="${iAnh}"]`)]); await fc2.setFiles('/tmp/sm-may.png');
  await p.waitForFunction(i => /^img:/.test(TK.d.o[i].img || ''), iAnh);
  // lưu thành mẫu
  await p.click('#tkMau'); await p.waitForSelector('#tkmTen'); await p.fill('#tkmTen', 'Giá sốc của fen'); await p.click('#tkmMoi');
  await p.waitForFunction(() => !document.querySelector('#tkmTen') && document.querySelector('#mPick .on .kn'), null, { timeout: 15000 });
  const mt = await p.evaluate(() => ({ id: S.mauId, ten: document.querySelector('#mPick .on b').textContent, chu: TK.d.o.find(x => x.k === 'ten').text, anh: TK.d.o.find(x => x.loai === 'anh').img }));
  const mj = JSON.parse(fs.readFileSync(APP + '/story-mau/' + mt.id + '/mau.json'));
  const xem2 = await fetch(A + '/api/story-mau/xem/' + mt.id);
  check('mẫu lưu giữ font + viền chữ (ảnh xem trước vẽ bằng đúng font)', mj.o.some(x => x.k === 'nhan' && x.ff === 'anton' && x.vien === '#111111'), mj.o.find(x => x.k === 'nhan'));
  check('💾 Lưu thành mẫu: mẫu mới "của fen" mở sẵn, giữ chữ / màu / vị trí, ảnh gắn lưu thành file trong mẫu, có ảnh xem trước', mt.ten === 'Giá sốc của fen' && mt.chu === 'iPad Air 5 M1 64GB' && /\/api\/story-mau\/tep\/f[0-9a-f]{8}\/e\d+\.png/.test(mt.anh || '') && mj.tk && mj.o.some(x => x.src && fs.existsSync(APP + '/story-mau/' + mt.id + '/' + x.src)) && xem2.status === 200, { mt, o: mj.o.filter(x => x.loai === 'anh') });
  await p.fill(`#tkNd [data-nd="${await p.evaluate(() => TK.d.o.findIndex(x => x.k === 'ten'))}"]`, 'MacBook Pro M3'); await p.waitForTimeout(200);
  await p.click('#tkMau'); await p.waitForSelector('#tkmSua'); await p.click('#tkmSua');
  await p.waitForFunction(() => !document.querySelector('#tkmTen'), null, { timeout: 15000 }); await p.waitForTimeout(300);
  const mj2 = JSON.parse(fs.readFileSync(APP + '/story-mau/' + mt.id + '/mau.json'));
  check('mẫu của fen: "Cập nhật mẫu này" ghi đè đúng mẫu đó (giữ ảnh cũ trong mẫu)', mj2.o.find(x => x.k === 'ten').mac === 'MacBook Pro M3' && mj2.o.some(x => x.src && fs.existsSync(APP + '/story-mau/' + mt.id + '/' + x.src)), mj2.o.filter(x => x.loai === 'anh'));
  // mẫu bằng ảnh nền + bố cục (hộp cũ)
  await p.click('#mThem'); await p.waitForSelector('#mtTen');
  await p.fill('#mtTen', 'Nền kem thử'); await p.setInputFiles('#mtNen input', '/tmp/sm-nen.jpg'); await p.waitForFunction(() => !$('#mtNen img').hidden);
  await p.selectOption('#mtBc', 'so-sanh'); await p.click('#mtChu [data-chu="den"]'); await p.click('#mtLuu');
  await p.waitForFunction(() => !document.querySelector('#mtTen') && document.querySelector('#mPick .on .kn') && $('#tkCv'), null, { timeout: 15000 }); await p.waitForTimeout(800);
  const nk = await p.evaluate(() => ({ id: S.mauId, anh: TK.d.o.filter(x => x.loai === 'anh').length, nen: TK.d.nenImg }));
  const pn = await px(540, 100);
  check('Thêm mẫu của fen (ảnh nền + bố cục So sánh): mở trong khung, nền ảnh của fen (vùng trên đỏ), 2 ô ảnh', nk.anh === 2 && /nen\.jpg/.test(nk.nen) && pn[0] > 150 && pn[2] < 90, { nk, pn });
  p.once('dialog', d => d.accept()); await p.click('#mBo'); await p.waitForFunction(id => !document.querySelector(`#mPick [data-m="${id}"]`), nk.id, { timeout: 10000 });
  check('🗑 Bỏ mẫu: dời vào _to_delete/story-mau (không xoá hẳn)', !fs.existsSync(APP + '/story-mau/' + nk.id) && fs.readdirSync(APP + '/_to_delete/story-mau').some(x => x.startsWith(nk.id)));
  check('không bỏ / sửa được mẫu có sẵn', (await j(A + '/api/story-mau', { bo: 'gia-soc' })).s === 400 && (await j(A + '/api/story-mau', { sua_tk: { id: 'gia-soc', ten: 'x', nen: '#000', o: [{ loai: 'hcn', x: 0, y: 0, w: 9, h: 9 }] } })).s === 400);
  const bay = await j(A + '/api/story-mau', { them_tk: { ten: 'x', nen: '#000000', o: [{ loai: 'chu', k: '../x', text: 'a', mau: 'red;x', x: 'NaN', co: 1e9 }, { loai: 'script' }] } });
  const bj = bay.s === 200 && JSON.parse(fs.readFileSync(APP + '/story-mau/' + bay.b.mau.id + '/mau.json'));
  check('lưu mẫu: lọc bản vẽ (bỏ loại lạ, màu sai, số quá lớn)', bj && bj.o.length === 1 && !bj.o[0].mau && bj.o[0].co <= 6000, bj && bj.o);
  if (bj) await j(A + '/api/story-mau', { bo: bay.b.mau.id });
  await p.screenshot({ path: 'shots/storymau.png' });
  // máy dùng chung
  await j(A + '/api/chung', { bat: true }); await new Promise(x => setTimeout(x, 1500));
  const ma = (await j(A + '/api/chung', { ma_moi: true })).b.ma;
  const v = (await j(K + '/api/chung/vao', { ma, ten: 'Máy con mẫu' }, H)).b, HK = Object.assign({ 'X-Poly-Khach': v.token }, H);
  const anh = 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
  const kds = await j(K + '/api/story-mau', undefined, HK), kluu = await j(K + '/api/story-mau', { luu: { anh, mau: 'gia-soc' } }, HK), kthem = await j(K + '/api/story-mau', { them_tk: { ten: 'x', nen: '#000', o: [] } }, HK);
  const kf = kluu.b.ten && fs.readdirSync(APP + '/story-mau/_khach').some(d => fs.existsSync(APP + '/story-mau/_khach/' + d + '/' + kluu.b.ten));
  check('máy dùng chung: thấy thư viện, lưu ảnh được (riêng story-mau/_khach/<máy>, không lộ thư mục máy shop), không lưu mẫu', kds.s === 200 && kds.b.ds.length >= 28 && kluu.s === 200 && kf && kluu.b.thu_muc === '' && kthem.s === 400, { k: kds.s, kluu: kluu.s, kf, kthem: kthem.s });
  const g = await b.newPage({ viewport: { width: 1280, height: 860 } }); g.on('pageerror', e => errs.push('con: ' + e.message));
  await g.goto('http://poly-thu.example/#vao=' + v.token); await g.waitForSelector('#khc:not([hidden])', { timeout: 20000 }).catch(() => {}); await g.waitForTimeout(1000);
  await g.click('#bStory'); await g.waitForSelector('#tkCv');
  check('máy dùng chung: có khung design + Lưu ảnh / Tải về máy, không có Thêm mẫu / Lưu thành mẫu / Bỏ mẫu', await g.evaluate(() => !$('#mThem') && !$('#tkMau') && !$('#mBo') && !!$('#tkLuu') && !!$('#tkTai')));
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); await j(A + '/api/chung', { bat: false });
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
