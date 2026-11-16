// 🎄 Mẫu story Noel theo kho theme Photoshop (fen 16/11 11h23 "story theme same kho pts" + "tạo theme christmas", gửi ảnh 5 theme Noel):
// 5 mẫu từ theme-ps/noel-* dựng như bìa biaNoel / biaNoelAnh (ảnh trang trí của theme, nền 9:16 riêng, tiêu đề sọc kẹo, *chữ đỏ*,
// phiếu ưu đãi nhóm kéo đi cả phiếu, kẹo gậy xoay, tuyết khoá dưới ảnh máy), ảnh xem trước server vẽ cùng kiểu.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', APP = '/home/claude/bug3/tgl';
const j = (u, d) => fetch(u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
execFileSync('python3', ['-c', `from PIL import Image,ImageDraw
im=Image.new('RGBA',(1000,800),(0,0,0,0));d=ImageDraw.Draw(im);d.rounded_rectangle((100,50,900,750),50,fill='#2b6cff');im.save('/tmp/sn-may.png')`]);
(async () => {
  for (const d of fs.readdirSync(APP + '/story-mau')) if (/^f[0-9a-f]{8}$/.test(d)) fs.renameSync(APP + '/story-mau/' + d, '/tmp/_bo_mau_' + Date.now() + '_' + d);
  const api = await j(A + '/api/story-mau'), ds = api.b.ds, noel = ds.filter(x => x.nhom === 'noel');
  check('API: 5 mẫu 🎄 Noel đúng 5 theme Noel của kho Photoshop, lên đầu danh sách, tên như kho',
    noel.length === 5 && ds.slice(0, 5).every(x => x.nhom === 'noel') && noel.map(x => x.ten).sort().join() === ['Noel · Poly Christmas', 'Noel · Trắng tuyết', 'Noel · Ảnh thật', 'Noel · Đêm xanh', 'Noel · Đỏ nhung'].sort().join(), noel.map(x => x.ten));
  const pc = ds.find(x => x.id === 'ps-noel-poly-christmas'), at = ds.find(x => x.id === 'ps-noel-anh-that'), dx = ds.find(x => x.id === 'ps-noel-dem-xanh');
  const o = k => pc.ve.o.find(x => x.k === k);
  check('Poly Christmas: nền lá thông 9:16 riêng, tiêu đề 2 dòng Alfa Slab sọc kẹo (đỏ sọc trắng / trắng sọc xanh nhạt) + bóng cứng, 3 tia đỏ, dòng đậm *chữ đỏ*, ưu đãi vàng + kẻ',
    /\/api\/story-mau\/tep\/ps-noel-poly-christmas\/nen-story\.jpg/.test(pc.ve.nen_url) && o('t1').ff === 'alfa' && o('t1').mau === '#E23B32' && o('t1').soc === '#FFFFFF5F' && o('t1').vach &&
    o('t2').soc === '#BFE3CF' && o('t1').lech === 5 && o('nho').mau2 === '#E23B32' && /\*LÊN ĐỜI\*\nMÁY XỊN/.test(o('nho').mac) && o('uu_dai').ke === '#F5C542', { t1: o('t1'), nen: pc.ve.nen_url });
  const ph1 = pc.ve.o.filter(x => x.nhom === 'phieu1'), ph2 = pc.ve.o.filter(x => x.nhom === 'phieu2');
  check('2 phiếu ưu đãi (giấy kem viền thư máy bay, chữ viết tay, giá đỏ, tem xanh / đỏ HSSV, dấu bưu điện NOEL + năm), mỗi phiếu 1 nhóm',
    ph1.length >= 9 && ph2.length >= 9 && ph1.some(x => x.src_url && /phieu\.png/.test(x.src_url)) && ph1.some(x => /tem-xanh/.test(x.src_url || '')) && ph2.some(x => /tem-do/.test(x.src_url || '')) &&
    o('p1_gia').mac === '200K' && o('p2_gia').mac === '300K' && o('p1_chu').ff === 'dancing' && ph1.some(x => x.mac === String(new Date().getFullYear())), { n1: ph1.length, n2: ph2.length });
  check('trang trí của theme: châu (cạnh dòng đậm + 2 châu treo dây), kẹo gậy xoay 14°, dây đèn, tuyết đáy khoá; ảnh máy sát đáy trên tuyết',
    pc.ve.o.filter(x => /chau-/.test(x.src_url || '')).length === 5 && o('keo').xoay === 14 && /keo-gay/.test(o('keo').src_url) && o('den').xoay === -3 && o('tuyet').khoa &&
    o('anh').day && o('anh').y + o('anh').h <= 1810 && pc.ve.o.indexOf(o('anh')) > pc.ve.o.indexOf(o('tuyet')), o('keo'));
  check('ô điền nhanh / form chỉ có chữ + ảnh máy (không có ảnh trang trí)', pc.o.every(x => !/^(chau|keo|den|tuyet|phieu)/.test(x.k)) && pc.o.some(x => x.k === 'anh') && pc.o.some(x => x.k === 'p1_gia'), pc.o.map(x => x.k));
  check('Đêm xanh: không kẹo gậy (như theme), tiêu đề vàng sọc trắng, chân navy; Ảnh thật: ảnh thật phủ kín + lớp tối mờ dần (khoá), chữ xếp dưới, dây đèn trên',
    !dx.ve.o.some(x => x.k === 'keo') && dx.ve.o.find(x => x.k === 't1').mau === '#F5C542' && dx.ve.o.find(x => x.k === 'chan').mau === '#0B1631' &&
    at.ve.o[0].k === 'anh' && at.ve.o[0].phu && at.ve.o[1].mo_dan && at.ve.o[1].khoa && at.ve.o.find(x => x.k === 't1').y > 900 && at.ve.o.filter(x => /day-den/.test(x.src_url || '')).length === 2, at.ve.o.slice(0, 2));
  const lay = async u => { const r = await fetch(u); await r.arrayBuffer().catch(() => {}); return r; };
  const t1 = await lay(A + o('chau1').src_url), t2 = await lay(A + pc.ve.nen_url), t3 = await lay(A + '/api/story-mau/tep/ps-noel-poly-christmas/..%2Ftheme.json'), t4 = await lay(A + '/api/story-mau/tep/ps-noel-poly-christmas/theme.json'),
    t5 = await lay(A + '/api/story-mau/tep/ps-..%2F..%2Fconfig/x.png'), t6 = await lay(A + '/api/story-mau/tep/ps-noel-poly-christmas/may-mau.png');
  check('file mẫu: châu + nền 9:16 tải được, không đọc được file khác (theme.json, ../)', t1.status === 200 && /png/.test(t1.headers.get('content-type')) && t2.status === 200 && t3.status !== 200 && t4.status !== 200 && t5.status !== 200 && [200, 400, 404].includes(t6.status), [t1.status, t2.status, t3.status, t4.status, t5.status, t6.status]);
  const xem = await fetch(A + pc.xem); const xb = Buffer.from(await xem.arrayBuffer()); fs.writeFileSync('/tmp/sn-xem.jpg', xb);
  const xp = JSON.parse(execFileSync('python3', ['-c', `import json;from PIL import Image;im=Image.open('/tmp/sn-xem.jpg').convert('RGB');print(json.dumps([im.size,[im.getpixel((x,y)) for x,y in ((60,95),(8,628),(352,628))]]))`]).toString());
  check('ảnh xem trước (server vẽ): 360×640, nền xanh lá, tuyết trắng dưới', xem.status === 200 && /v=2/.test(pc.xem) && xp[0][0] === 360 && xp[1][1][1] > 200 && xp[1][2][0] > 200, xp);
  // làm ảnh bằng form (không cần gắn ảnh trang trí)
  const may = 'data:image/png;base64,' + fs.readFileSync('/tmp/sn-may.png').toString('base64');
  const lam = await j(A + '/api/story-mau', { lam: { id: 'ps-noel-do-nhung', chu: { t1: 'MERRY', p1_gia: '500K' }, anh: { anh: may } } });
  check('Làm ảnh qua form: mẫu Noel không đòi ảnh trang trí, ra ảnh 1080×1920', lam.s === 200 && /^data:image\/jpeg/.test(lam.b.anh || ''), lam.s + ' ' + JSON.stringify(lam.b).slice(0, 120));

  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 950 } }); p.on('pageerror', e => errs.push(e.message + ' @ ' + (e.stack || '').split('\n').slice(0, 3).join(' | ')));
  await p.goto(A + '/#story'); await p.waitForSelector('#stTab');
  await p.evaluate(() => { localStorage.removeItem('poly-st-tab'); localStorage.setItem('poly-mau-nhom', JSON.stringify(''));
    localStorage.setItem('poly-tk', JSON.stringify({ 'ps-noel-dem-xanh': { t: Date.now(), d: { nen: '#000000', o: [{ loai: 'chu', k: 'cu', text: 'BẢN CŨ', x: 0, y: 0, w: 500, h: 100, co: 60 }] } } })); });
  await p.click('#stTab [data-tab="mau"]'); await p.waitForSelector('#mPick [data-m]');
  const nh = await p.evaluate(() => [...document.querySelectorAll('#mNhom [data-nh]')].map(b => b.textContent.trim()));
  await p.click('#mNhom [data-nh="noel"]'); await p.waitForSelector('#tkCv');
  const n5 = await p.evaluate(() => [...document.querySelectorAll('#mPick [data-m]')].map(b => b.dataset.m));
  check('nhóm 🎄 Noel: lọc đúng 5 mẫu', nh.some(t => /Noel 5/.test(t)) && n5.length === 5 && n5.every(x => /^ps-noel-/.test(x)), { nh, n5 });
  await p.click('#mPick [data-m="ps-noel-dem-xanh"]'); await p.waitForSelector('#tkCv'); await p.waitForTimeout(500);
  check('bản đang sửa cũ (mẫu "Theme · Noel" trước) bị bỏ, mở bố cục Noel mới', await p.evaluate(() => !TK.d.o.some(x => x.k === 'cu') && TK.d.o.some(x => x.k === 'p1_gia') && TK.mau.v === 3));
  await p.click('#mPick [data-m="ps-noel-poly-christmas"]'); await p.waitForSelector('#tkCv');
  await p.waitForFunction(() => document.fonts.check('400 60px "tv-alfa"', 'POLY') && document.fonts.check('400 60px "tv-dancing"', 'Mua'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(1500);
  const cv = await p.evaluate(() => { const c = $('#tkCv').getContext('2d'), px = (x, y) => [...c.getImageData(x, y, 1, 1).data].slice(0, 3);
    const quet = (x0, y0, x1, y1) => { const d = c.getImageData(x0, y0, x1 - x0, y1 - y0).data; let r = 0, h = 0, w = 0;
      for (let i = 0; i < d.length; i += 4) { const [R, G, B] = [d[i], d[i + 1], d[i + 2]]; if (R > 200 && G < 90 && B < 90) r++; else if (R > 225 && G > 105 && G < 185 && B > 95 && B < 180) h++; else if (R > 225 && G > 225 && B > 225) w++; } return { r, h, w }; };
    const T = TK.d.o.find(x => x.k === 't1'), N = TK.d.o.find(x => x.k === 'nho');
    return { tieu: quet(T.x, T.y, T.x + 420, T.y + T.h), nho: quet(N.x, N.y, N.x + 700, N.y + N.h), keo: TK.d.o.find(x => x.k === 'keo'), sno: px(540, 1900), bg: px(540, 1000) }; });
  check('khung design vẽ: tiêu đề đỏ có sọc kẹo (đỏ + hồng nhạt), dòng đậm trắng + *chữ đỏ*, tuyết trắng đáy, nền xanh lá',
    cv.tieu.r > 2000 && cv.tieu.h > 800 && cv.nho.r > 1000 && cv.nho.w > 1000 && cv.sno[0] > 200 && cv.bg[1] > cv.bg[0], cv);
  await p.screenshot({ path: '/tmp/sn-khung.png' });
  // kéo giá phiếu 1 -> cả phiếu đi theo
  await p.evaluate(() => $('#tkCv').scrollIntoView({ block: 'center' })); await p.waitForTimeout(200);
  const box = await p.$eval('#tkCv', c => { const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, k: r.width / 1080, kh: r.height / 1920 }; });
  const truoc = await p.evaluate(() => TK.d.o.map(x => [x.k || x.loai, x.nhom || '', x.x, x.y]));
  const G = await p.evaluate(() => TK.d.o.find(x => x.k === 'p1_gia'));
  const sx = box.x + (G.x + 60) * box.k, sy = box.y + (G.y + G.h / 2) * box.kh;
  await p.mouse.move(sx, sy); await p.mouse.down(); await p.mouse.move(sx + 40 * box.k, sy + 30 * box.kh, { steps: 5 }); await p.mouse.move(sx + 80 * box.k, sy + 60 * box.kh, { steps: 5 }); await p.mouse.up();
  const sau = await p.evaluate(() => TK.d.o.map(x => [x.k || x.loai, x.nhom || '', x.x, x.y]));
  const dich = sau.map((s, i) => [s[1], s[2] - truoc[i][2], s[3] - truoc[i][3]]);
  const sel = await p.evaluate(() => TK.d.o[TK.sel] && TK.d.o[TK.sel].k);
  check('kéo giá phiếu 1: cả phiếu (giấy, chữ, tem, dấu, kẻ, ký) đi theo, phiếu 2 + chữ khác đứng yên',
    sel === 'p1_gia' && dich.filter(d => d[0] === 'phieu1').every(d => Math.abs(d[1] - 80) <= 2 && Math.abs(d[2] - 60) <= 2) && dich.filter(d => d[0] !== 'phieu1').every(d => d[1] === 0 && d[2] === 0), { sel, d: dich.filter(d => d[0] === 'phieu1').slice(0, 3) });
  await p.keyboard.press('ArrowLeft');
  const mt = await p.evaluate(() => TK.d.o.filter(x => x.nhom === 'phieu1').map(x => x.x));
  await p.waitForTimeout(500);
  const mt0 = sau.filter(s => s[1] === 'phieu1').map(s => s[2]);
  check('mũi tên: dời cả phiếu', mt.every((x, i) => x === mt0[i] - 4), { mt, mt0 });
  // bấm chỗ tuyết có ảnh máy đè: chọn ảnh máy; bấm tuyết chỗ trống: chọn được tuyết (khoá)
  const An = await p.evaluate(() => TK.d.o.find(x => x.k === 'anh'));
  await p.mouse.click(box.x + 540 * box.k, box.y + (An.y + An.h - 20) * box.kh);
  const s1 = await p.evaluate(() => TK.d.o[TK.sel].k);
  await p.mouse.click(box.x + 1060 * box.k, box.y + 1905 * box.kh);
  const s2 = await p.evaluate(() => TK.d.o[TK.sel] && TK.d.o[TK.sel].k);
  check('tuyết đáy (khoá) không che ảnh máy: bấm chỗ chồng nhau chọn ảnh máy, chỗ chỉ có tuyết thì chọn tuyết', s1 === 'anh' && s2 === 'tuyet', { s1, s2 });
  // bảng chỉnh: *nhấn*, sọc kẹo, xoay
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(x => x.k === 't2'); tkBang(); });
  const bang = await p.evaluate(() => ({ m2: $('#tkpM2Co').checked, soc: $('#tkpSocCo').checked }));
  await p.click('#tkpSocCo'); await p.waitForTimeout(300);
  const bo = await p.evaluate(() => !TK.d.o.find(x => x.k === 't2').soc);
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(x => x.k === 'keo'); tkBang(); });
  const xo = await p.evaluate(() => +$('#tkpXoay').value);
  check('bảng chỉnh: tiêu đề có ô Sọc kẹo (bỏ được), kẹo gậy có thanh Xoay = 14', bang.soc && !bang.m2 && bo && xo === 14, { bang, bo, xo });
  await p.click('#tkUndo'); await p.waitForTimeout(200);
  // xoá phiếu 2 = xoá cả nhóm
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(x => x.k === 'p2_gia'); tkBang(); $('#tkCv').focus(); });
  await p.keyboard.press('Delete'); await p.waitForTimeout(300);
  check('Xoá (Delete) giá phiếu 2: xoá cả phiếu 2', await p.evaluate(() => !TK.d.o.some(x => x.nhom === 'phieu2') && TK.d.o.some(x => x.nhom === 'phieu1')));
  await p.evaluate(() => { TK.sel = TK.d.o.findIndex(x => x.k === 'p1_tem'); tkBang(); });
  await p.click('[data-lop="doi"]'); await p.waitForTimeout(300);
  const doi = await p.evaluate(() => { const ns = [...new Set(TK.d.o.filter(x => x.nhom && /^n/.test(x.nhom)).map(x => x.nhom))]; return { ns, n: ns.length ? TK.d.o.filter(x => x.nhom === ns[0]).length : 0, n1: TK.d.o.filter(x => x.nhom === 'phieu1').length }; });
  check('Nhân đôi phiếu 1: ra phiếu mới đủ lớp (nhóm mới, kéo riêng được)', doi.ns.length === 1 && doi.n === doi.n1, doi);
  // xuất ảnh + lưu thành mẫu: giữ sọc / *nhấn* / nhóm / xoay, ảnh trang trí thành file trong mẫu
  const xuat = await p.evaluate(() => tkXuat());
  check('Lưu ảnh: xuất 1080×1920 (ô ảnh máy trống thì bỏ trống)', /^data:image\/jpeg/.test(xuat) && xuat.length > 100000, xuat.length);
  await p.click('#tkMau'); await p.waitForSelector('#tkmMoi'); await p.fill('#tkmTen', 'Noel của fen'); await p.click('#tkmMoi');
  await p.waitForFunction(() => TK.mau && !TK.mau.san, null, { timeout: 15000 });
  const fm = await p.evaluate(() => ({ id: TK.mau.id, o: TK.mau.ve.o, nen: TK.mau.ve.nen_url }));
  const mj = JSON.parse(fs.readFileSync(APP + '/story-mau/' + fm.id + '/mau.json', 'utf8'));
  const g = k => mj.o.find(x => x.k === k);
  check('💾 Lưu thành mẫu: giữ sọc kẹo, *chữ nhấn*, bóng lệch, tia, kẻ, nhóm phiếu, kẹo xoay, tuyết khoá, ảnh trang trí thành file; nền 9:16 giữ',
    g('t1').soc === '#FFFFFF5F' && g('nho').mau2 && g('t1').lech === 5 && g('t1').vach && g('uu_dai').ke && mj.o.filter(x => x.nhom === 'phieu1').length >= 9 && g('keo').xoay === 14 && g('tuyet').khoa &&
    g('keo').src && fs.existsSync(APP + '/story-mau/' + fm.id + '/' + g('keo').src) && mj.nen === 'anh' && fs.existsSync(APP + '/story-mau/' + fm.id + '/nen.jpg'), { t1: g('t1'), keo: g('keo') });
  const xm = await lay(A + (await j(A + '/api/story-mau')).b.ds.find(x => x.id === fm.id).xem);
  check('mẫu của fen từ mẫu Noel: ảnh xem trước vẽ được', xm.status === 200, xm.status);
  check('không lỗi JS', errs.length === 0, errs);
  await b.close();
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
