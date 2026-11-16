// 🎨 Mẫu story dựng lại đúng trang bìa từng theme Photoshop (fen 16/11 12h05 "theme glass nữa đi", 12h07 "theme pts story xóa làm lại cái mới"):
// 13 theme (Glass, Ảnh thật ×5, Bảng xanh, Tính năng ×3, Tiệm vẽ tay, Tối giản) = mẫu nhóm "Theme Photoshop" tên như kho, không còn mẫu "Theme · …" chung;
// ảnh nhỏ server vẽ được, khung design mở từng mẫu không lỗi, chữ trình duyệt khớp ảnh nhỏ (đặt theo chân chữ).
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', APP = '/home/claude/bug3/tgl';
const j = (u, d) => fetch(u, { method: d ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: d ? JSON.stringify(d) : undefined }).then(async r => ({ s: r.status, b: await r.json().catch(() => ({})) }));
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
(async () => {
  const api = await j(A + '/api/story-mau'), ps = api.b.ds.filter(x => x.nhom === 'ps'), id = k => ps.find(x => x.id === 'ps-' + k);
  const tenKho = fs.readdirSync(APP + '/theme-ps').filter(d => fs.existsSync(`${APP}/theme-ps/${d}/theme.json`) && !/^noel-/.test(d)).map(d => JSON.parse(fs.readFileSync(`${APP}/theme-ps/${d}/theme.json`, 'utf8')).ten).sort();
  check('13 mẫu Theme Photoshop = 13 theme không Noel của kho, tên như kho, bản mới (v 2), không còn "Theme · …" chung',
    ps.length === 13 && ps.map(x => x.ten).sort().join('|') === tenKho.join('|') && ps.every(x => x.v === 2 && !/^Theme ·/.test(x.ten)), ps.map(x => x.ten));
  const o = (k, kk) => id(k).ve.o.find(x => x.k === kk) || {};
  check('Glass: TÊN MÁY League Spartan màu bia_mau, 2 nhãn viền kính, máy xoè quạt ±8°, lớp kính khi có ảnh nền',
    o('glass-tim-hong', 'ten').ff === 'spartan' && o('glass-tim-hong', 'nhan_trai').khung && o('glass-tim-hong', 'may_trai').xoay === -8 && o('glass-tim-hong', 'may_phai').xoay === 8 && o('glass-tim-hong', 'phu_kinh').chi_khi_co === 'nen_anh');
  check('Ảnh thật: chữ nghiêng (Noto Serif nghiêng + dòng nhỏ Anton giãn chữ vàng), chữ vàng (Anton vàng viền tối), đáy tối (lớp tối mờ dần, canh trái, xếp dưới)',
    o('anh-that-chu-nghieng', 't1').ff === 'nghieng' && o('anh-that-chu-nghieng', 'tren').ff === 'anton' && o('anh-that-chu-nghieng', 'tren').gian > 0 &&
    o('anh-that-chu-vang', 't1').mau === '#FFD400' && o('anh-that-chu-vang', 't1').vien && o('anh-that-day-toi', 't1').canh === 'trai' &&
    id('anh-that-day-toi').ve.o.some(x => x.loai === 'hcn' && x.mo_dan && x.chi_khi_co === 'anh') && o('anh-that-day-toi', 'nho').y > 1300);
  check('Nền sáng: ảnh trong khung bo góc, dòng 2 có vạch vàng tô; Chú thích tay: chữ viết tay + gạch chân + 3 mũi tên vẽ tay theo nhóm',
    o('anh-that-nen-sang', 'anh').bo === 28 && o('anh-that-nen-sang', 't2').to === '#FFD400' && o('anh-that-chu-thich', 't1').ff === 'patrick' &&
    id('anh-that-chu-thich').ve.o.filter(x => /ct-mui-/.test(x.src_url || '')).length === 3 && o('anh-that-chu-thich', 'anh').mo_vien === 40);
  check('Bảng xanh: giấy xé + tab + nhãn cọ + dòng khuyến mãi *chữ vàng* + băng rôn; Tiệm vẽ tay: ảnh tiệm iPad mép lượn + chữ tròn 2 lớp viền',
    /giay-xe/.test(o('bang-xanh-giay-xe', 'giay').src_url) && o('bang-xanh-giay-xe', 'km').mau2 === '#F2D13B' && /ruy-bang/.test(o('bang-xanh-giay-xe', 'ruy').src_url) &&
    /tiem-ipad/.test(o('tiem-ve-tay', 'tiem').src_url) && o('tiem-ve-tay', 't1').vien2 && o('tiem-ve-tay', 't1').vien);
  check('Tính năng: số to mờ phía sau, máy nghiêng tràn mép; Tối xanh băng: dòng 2 chuyển sắc; Tối giản: ảnh cận theo bề ngang + 2 gạch kẹp mô tả',
    /^#[0-9A-F]{8}$/i.test(o('phang-xanh-dem', 'so').mau) && o('phang-xanh-dem', 'anh').xoay === -10 && Array.isArray(o('toi-xanh-bang', 't2').sac) &&
    o('toi-gian-den', 'anh').rong && id('toi-gian-den').ve.o.filter(x => x.loai === 'hcn').length === 2);
  const xem = await Promise.all(ps.map(async m => { const r = await fetch(A + m.xem); await r.arrayBuffer(); return r.status; }));
  check('ảnh nhỏ 13 mẫu vẽ được', xem.every(s => s === 200), xem);
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 950 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#storymau=ps-glass-tim-hong'); await p.evaluate(() => localStorage.removeItem('poly-tk')); await p.reload(); await p.waitForSelector('#tkCv');
  const nhom = await p.evaluate(() => document.querySelector('#mNhom .on').dataset.nh);
  const trong = [];
  for (const m of ps) {
    await p.evaluate(id => storyMau(id), m.id); await p.waitForSelector('#tkCv'); await p.waitForTimeout(500);
    const kq = await p.evaluate(() => { const c = $('#tkCv').getContext('2d').getImageData(0, 300, 1080, 1200).data; let n = 0, s = new Set(); for (let i = 0; i < c.length; i += 4000) s.add(c[i] >> 4 << 8 | c[i + 1] >> 4 << 4 | c[i + 2] >> 4); return s.size; });
    if (kq < 6) trong.push([m.id, kq]);
  }
  check('khung design mở cả 13 mẫu (nhóm Theme Photoshop), mỗi khung có hình (không trắng trơn)', nhom === 'ps' && !trong.length, { nhom, trong });
  check('không lỗi JS', errs.length === 0, errs);
  await b.close();
  console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
