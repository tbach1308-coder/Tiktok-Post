// Story: dời ảnh trong khung (fen 17/11 16h36 "story cho thêm chức năng di chuyển hình ảnh trong ô vuông"): bấm đúp ảnh / nút ✥ Dời ảnh,
// kéo chọn phần hiện trong khung, lăn chuột phóng to, mũi tên, Esc / bấm ra ngoài xong, ↺ Về giữa, đổi ảnh về giữa, xuất ảnh không có
// phần mờ, Lưu thành mẫu giữ vị trí + Pillow vẽ đúng. Chạy: cd /home/claude/bug3 && bash reset.sh && node storydich.js
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', APP = '/home/claude/bug3/tgl';
const NGANG = '/tmp/claude-0/anh-ngang.png', DOC = '/tmp/claude-0/anh-doc.png';   // ngang: trái đỏ / phải xanh dương; dọc: trên xanh lá / dưới vàng
let ok = 0, loi = 0; const check = (n, c, x) => { c ? ok++ : loi++; console.log((c ? '✓ ' : '✗ ') + n, c ? '' : JSON.stringify(x === undefined ? '' : x).slice(0, 400)); };
const do_ = c => c[0] > 150 && c[2] < 90, xanh = c => c[2] > 150 && c[0] < 90;
(async () => {
  if (!fs.existsSync(NGANG) || !fs.existsSync(DOC)) require('child_process').execSync(`python3 -c "
from PIL import Image
im=Image.new('RGB',(1600,600),(220,30,30)); im.paste((30,60,220),(800,0,1600,600)); im.save('${NGANG}')
im=Image.new('RGB',(600,1600),(30,160,60)); im.paste((240,200,20),(0,800,600,1600)); im.save('${DOC}')"`);
  for (const d of fs.readdirSync(APP + '/story-mau')) if (/^f[0-9a-f]{8}$/.test(d)) fs.renameSync(APP + '/story-mau/' + d, '/tmp/_bo_mau_' + Date.now() + '_' + d);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 1000 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#storymau=feedback'); await p.waitForSelector('#tkCv', { timeout: 15000 }); await p.waitForTimeout(1200);
  await p.evaluate(() => { localStorage.removeItem('poly-tk'); }); await p.evaluate(() => { TK.d = tkTuMau(TK.mau); TK.sel = TK.d.o.findIndex(x => x.k === 'anh'); tkBang(); tkVe(); });
  const pa = await p.evaluate(() => $('#tkProp').innerText);
  check('ô ảnh chưa có ảnh: chưa có nút Dời ảnh', !/Dời ảnh/.test(pa), pa);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.click('#tkpChon')]); await fc.setFiles(NGANG); await p.waitForTimeout(1200);
  const g = (x, y) => p.evaluate(([x, y]) => [...$('#tkCv').getContext('2d').getImageData(x, y, 1, 1).data], [x, y]);
  const o = () => p.evaluate(() => { const x = TK.d.o[TK.sel]; return { ax: x.ax, ay: x.ay, zoom: x.zoom, dich: TK.dichAnh === TK.sel, x: x.x, y: x.y }; });
  check('mặc định như cũ: phủ kín cắt giữa (trái khung đỏ, phải khung xanh)', do_(await g(110, 730)) && xanh(await g(970, 730)), [await g(110, 730), await g(970, 730)]);
  const pb = await p.evaluate(() => ({ t: $('#tkProp').innerText, z: !!$('#tkpZoom') }));
  check('có ảnh: nút ✥ Dời ảnh + thanh Phóng to %', /Dời ảnh/.test(pb.t) && /Phóng to/.test(pb.t) && pb.z, pb.t);
  // bấm đúp ảnh = dời ảnh
  const box = await p.evaluate(() => { const r = $('#tkCv').getBoundingClientRect(); return { l: r.left, t: r.top, k: r.width / 1080 }; });
  const sc = (x, y) => [box.l + x * box.k, box.t + y * box.k];
  await p.mouse.dblclick(...sc(540, 730)); await p.waitForTimeout(300);
  let s = await o(); const pc = await p.evaluate(() => $('#tkProp').innerText);
  check('bấm đúp ảnh: vào chế độ dời ảnh, nút thành ✓ Xong + dòng hướng dẫn', s.dich && /✓ Xong/.test(pc) && /Kéo trên ảnh/.test(pc), { s, pc });
  check('đang dời: hiện mờ phần ảnh bị cắt ngoài khung (bên phải khung có màu ảnh)', (await g(1040, 300))[0] - (await g(1040, 730))[0] > 40, [await g(1040, 730), await g(1040, 300)]);
  await p.screenshot({ path: 'shots/story-dich-anh.png' });
  // kéo ảnh sang phải 400 px khung
  await p.mouse.move(...sc(500, 730)); await p.mouse.down(); await p.mouse.move(...sc(700, 730), { steps: 5 }); await p.mouse.move(...sc(900, 730), { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(300);
  s = await o();
  check('kéo sang phải: ảnh dời phải (thấy phần trái nhiều hơn: phải khung thành đỏ), khung không đi', s.ax < 500 && do_(await g(880, 730)) && s.x === 90 && s.y === 380 && s.dich, { s, c: await g(880, 730) });
  // kéo quá tay: dừng ở mép ảnh (không lộ khoảng trống)
  await p.mouse.move(...sc(300, 730)); await p.mouse.down(); await p.mouse.move(...sc(1000, 730), { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
  s = await o(); check('kéo quá mép: dừng sát mép ảnh (ax = 0), không lộ nền', s.ax === 0 && do_(await g(100, 730)), { s, c: await g(100, 730) });
  // mũi tên
  await p.keyboard.press('Shift+ArrowLeft'); await p.waitForTimeout(600); s = await o();
  check('mũi tên trái: dời ảnh trong khung từng chút', s.ax > 0 && s.ax < 60, s);
  // lăn chuột phóng to
  await p.mouse.move(...sc(540, 730)); for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, -120); await p.waitForTimeout(60); } await p.waitForTimeout(700);
  s = await o(); const zv = await p.evaluate(() => [$('#tkpZoom').value, $('#tkpZoomV').textContent]);
  check('lăn chuột: phóng to ảnh trong khung, thanh Phóng to theo', s.zoom > 130 && s.zoom <= 400 && +zv[0] === s.zoom && +zv[1] === s.zoom, { s, zv });
  // kéo dọc khi đã phóng (ảnh cao hơn khung)
  await p.mouse.move(...sc(540, 800)); await p.mouse.down(); await p.mouse.move(...sc(540, 600), { steps: 5 }); await p.mouse.up(); await p.waitForTimeout(300);
  s = await o(); check('đã phóng thì kéo lên / xuống được', s.ay > 500, s);
  // Esc = xong
  await p.keyboard.press('Escape'); await p.waitForTimeout(300); s = await o();
  check('Esc: xong dời ảnh, khung giữ vị trí ảnh đã chọn', !s.dich && s.ax !== undefined && /✥ Dời ảnh/.test(await p.evaluate(() => $('#tkProp').innerText)), s);
  check('xong rồi: không còn phần mờ ngoài khung', JSON.stringify(await g(1040, 730)) === JSON.stringify(await g(1040, 300)), [await g(1040, 730), await g(1040, 300)]);
  // ngoài chế độ dời: kéo ảnh = kéo cả khung như cũ
  await p.mouse.move(...sc(540, 730)); await p.mouse.down(); await p.mouse.move(...sc(560, 750), { steps: 4 }); await p.mouse.up(); await p.waitForTimeout(300);
  s = await o(); check('bình thường kéo ảnh vẫn dời cả khung', s.x === 110 && s.y === 400, s);
  await p.keyboard.press('Control+z'); await p.waitForTimeout(300); s = await o();
  check('Ctrl+Z hoàn tác dời khung, vị trí ảnh trong khung giữ', s.x === 90 && s.y === 380 && s.ax !== undefined, s);
  // nút ✥ Dời ảnh + bấm ra ngoài khung = xong
  await p.click('#tkpDich'); await p.waitForTimeout(200); s = await o(); check('nút ✥ Dời ảnh: vào chế độ dời', s.dich, s);
  await p.mouse.click(...sc(540, 200)); await p.waitForTimeout(300);
  const ng = await p.evaluate(() => ({ dich: TK.dichAnh, sel: TK.sel }));
  check('bấm ra ngoài khung: xong dời ảnh', ng.dich === false, ng);
  // xuất ảnh: đúng phần đã chọn, không có phần mờ
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(x => x.k === 'anh'); tkBang(); });
  const xu = await p.evaluate(async () => { const u = tkXuat(), im = new Image(); im.src = u; await im.decode(); const c = document.createElement('canvas'); c.width = 1080; c.height = 1920; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const g = (a, b) => [...x.getImageData(a, b, 1, 1).data]; return { trong: g(970, 1000), ngoai: g(1040, 730), nen: g(1040, 300) }; });
  check('📸 ảnh xuất: phần trong khung theo vị trí đã chọn, ngoài khung là nền', do_(xu.trong) && Math.abs(xu.ngoai[0] - xu.nen[0]) < 6 && Math.abs(xu.ngoai[2] - xu.nen[2]) < 6, xu);
  // ↺ Về giữa
  await p.click('#tkpVeGiua'); await p.waitForTimeout(300); s = await o();
  check('↺ Về giữa: bỏ vị trí + phóng, như mặc định', s.ax === undefined && s.ay === undefined && s.zoom === undefined && xanh(await g(970, 730)), s);
  // lưu thành mẫu giữ vị trí, Pillow vẽ đúng
  await p.evaluate(() => { const x = TK.d.o[TK.sel]; x.ax = 0; x.zoom = 150; x.ay = 1000; tkGhi(); tkVe(); });
  await p.click('#tkMau'); await p.waitForSelector('#tkmTen'); await p.fill('#tkmTen', 'Feedback dời ảnh'); await p.click('#tkmMoi'); await p.waitForTimeout(1500);
  const fm = fs.readdirSync(APP + '/story-mau').find(d => /^f[0-9a-f]{8}$/.test(d));
  const mj = fm && JSON.parse(fs.readFileSync(APP + '/story-mau/' + fm + '/mau.json', 'utf8')), ma = mj && mj.o.find(x => x.loai === 'anh' && x.src);
  check('💾 Lưu thành mẫu: giữ vị trí ảnh + phóng (ax 0, ay 1000, zoom 150)', ma && ma.ax === 0 && ma.ay === 1000 && ma.zoom === 150, ma);
  const r2 = await fetch(A + '/api/story-mau').then(r => r.json()), mf = r2.ds.find(x => x.id === fm);
  const xem = Buffer.from(await (await fetch(A + mf.xem)).arrayBuffer()); fs.writeFileSync('/tmp/claude-0/xem-dich.jpg', xem);
  const px = JSON.parse(require('child_process').execSync(`python3 -c "
from PIL import Image; im=Image.open('/tmp/claude-0/xem-dich.jpg').convert('RGB'); k=im.width/1080
print([list(im.getpixel((int(x*k),int(y*k)))) for x,y in ((970,730),(110,730))])"`).toString());
  check('ảnh nhỏ mẫu (Pillow): cũng lệch trái như trình duyệt (phải khung đỏ)', do_(px[0]) && do_(px[1]), px);
  // trình duyệt + Pillow vẽ cùng chỗ: so ảnh xuất của mẫu mới với Pillow
  await p.goto(A + '/#storymau=' + fm); await p.waitForTimeout(1500);
  const sv = await p.evaluate(() => { const x = TK.d.o.find(y => y.loai === 'anh' && y.img); return x && { ax: x.ax, ay: x.ay, zoom: x.zoom }; });
  check('mở lại mẫu đã lưu: ô ảnh nhớ vị trí', sv && sv.ax === 0 && sv.ay === 1000 && sv.zoom === 150, sv);
  // đổi ảnh: về giữa
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(y => y.loai === 'anh' && y.img); tkBang(); });
  const [fc2] = await Promise.all([p.waitForEvent('filechooser'), p.click('#tkpChon')]); await fc2.setFiles(DOC); await p.waitForTimeout(1200);
  s = await o(); check('đổi ảnh khác: vị trí + phóng về mặc định', s.ax === undefined && s.ay === undefined && s.zoom === undefined, s);
  // Vừa khung (ảnh dọc nhỏ hơn khung): dời ngang trong khung
  await p.click('#tkpPhu [data-p="0"]'); await p.waitForTimeout(300);
  const tam = await g(540, 600); check('Vừa khung: ảnh dọc ở giữa khung', tam[1] > 120 && tam[0] < 90, tam);
  await p.click('#tkpDich'); await p.waitForTimeout(200);
  await p.mouse.move(...sc(540, 600)); await p.mouse.down(); await p.mouse.move(...sc(100, 600), { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(300);
  s = await o(); const trai = await g(150, 600), giua = await g(540, 600);
  check('Vừa khung: kéo trái thì ảnh sát trái khung, giữa khung trống', s.ax === 0 && trai[1] > 120 && trai[0] < 90 && !(giua[1] > 120 && giua[0] < 90), { s, trai, giua });
  // ảnh trang trí / ảnh rong không có nút dời
  const kd = await p.evaluate(() => { const x = TK.d.o[TK.sel]; x.rong = true; tkBang(); const t = $('#tkProp').innerText; delete x.rong; tkBang(); return t; });
  check('ảnh theo bề ngang (rong): không có Dời ảnh', !/Dời ảnh/.test(kd), kd);
  // fen 16h39 "chỗ này gom lại thành menu dropdown để chọn là được": Nội dung / Kiểu chữ / Decor gom vào 1 ô chọn
  const mn = () => p.evaluate(() => ({ v: $('#tkMenu').value, opt: [...$('#tkMenu').options].map(o => o.text), hien: [...document.querySelectorAll('.tkmn [data-pn]')].filter(d => !d.hidden).map(d => d.dataset.pn),
    details: document.querySelectorAll('#mWork details.tknd').length }));
  await p.selectOption('#tkMenu', 'nd'); await p.waitForTimeout(200); let m = await mn();
  check('menu chọn mục: 1 ô chọn 3 mục (Nội dung, Kiểu chữ, Decor), không còn 3 khung gập', m.opt.length === 3 && /Nội dung/.test(m.opt[0]) && /Kiểu chữ/.test(m.opt[1]) && /Decor/.test(m.opt[2]) && m.details === 0, m);
  check('chọn Nội dung: chỉ hiện ô điền nhanh', m.v === 'nd' && m.hien.join() === 'nd', m);
  await p.selectOption('#tkMenu', 'kieu'); await p.waitForTimeout(200); m = await mn();
  check('chọn Kiểu chữ: chỉ hiện kiểu chữ, bấm được', m.hien.join() === 'kieu' && await p.isVisible('#tkKieuD [data-kieu="0"]'), m);
  await p.click('#tkDecorBt'); await p.waitForTimeout(300); m = await mn();
  check('nút ✨ Decor trên thanh: menu nhảy sang Decor', m.v === 'decor' && m.hien.join() === 'decor' && await p.isVisible('#tkDecor [data-di]'), m);
  await p.goto(A + '/#storymau=feedback'); await p.reload(); await p.waitForSelector('#tkMenu'); await p.waitForTimeout(800); m = await mn();
  const dm = await p.evaluate(() => ({ ten: TK.mau.id, dich: TK.dichAnh }));
  check('mở mẫu khác: không còn ở chế độ dời ảnh', dm.ten === 'feedback' && dm.dich === false, dm);
  check('mở mẫu khác: nhớ mục đang chọn (Decor)', m.v === 'decor' && m.hien.join() === 'decor', m);
  await p.selectOption('#tkMenu', 'nd'); await p.waitForTimeout(200);
  await p.screenshot({ path: 'shots/story-menu.png', clip: { x: 0, y: 0, width: 1440, height: 1000 } });
  check('không lỗi JS', errs.length === 0, errs);
  await b.close();
  console.log('KẾT QUẢ: %d đạt, %d lỗi', ok, loi);
  process.exit(loi ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
