// Poly TikTok 0.13 (0.13.3 fen 24/11: báo đã vào trang + chẩn đoán khi không thấy bảng) (fen 15/11 13h49 "https://app.polystorevn.com/kho-may đọc qua link này là dc mầ", chọn "Đọc link qua Chrome đã
// đăng nhập"): app bấm 🔄 Cập nhật kho mở link kho đã lưu trong Chrome này, kèm #poly_kho=<mã>&k=<kênh>. Không có dấu đó thì tiện ích
// KHÔNG làm gì trên trang Polysto. CHỈ ĐỌC: đợi bảng máy hiện, chép cột tên / cấu hình / tình trạng / giá bán (bỏ giá vốn, giá nhập,
// seri, mã, khách, nhân viên, ghi chú, ngày), bấm nút "trang sau" của bảng nếu có (tối đa 40 trang), gửi về app rồi app đóng tab.
// Không gõ gì, không bấm nút nào khác. Gặp trang đăng nhập: báo app, để nguyên tab cho fen tự đăng nhập.
(() => {
  const KEY = 'polyKho';
  const m = location.hash.match(/poly_kho=(\w{8,40})&k=(laptop|ipad|ca)/);
  if (m) {
    try { sessionStorage.setItem(KEY, JSON.stringify({ tok: m[1], k: m[2], t: Date.now() })); } catch (e) {}
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) {}
  }
  let viec = null;
  try { viec = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (!viec || Date.now() - viec.t > 5 * 60000) return;
  if (window.top !== window) return;
  const CAM = /vốn|nhập|gốc|sỉ|lãi|lời|\bhh\b|hoa hồng|cost|khách|\bkh\b|sđt|điện thoại|phone|nhân viên|\bnv\b|người|ncc|nhà cung|ghi chú|note|seri|serial|imei|(^|[\s(])mã([\s:)]|$)|ngày|thời gian|hình ảnh|(^|\s)ảnh(\s|$)|thao tác|hành động|chọn/i;
  const TEN = /tên|model|máy|sản phẩm|thiết bị|dòng/i, THEM = /cấu hình|cpu|chip|ram|ổ cứng|ssd|dung lượng|màu|tình trạng|t\.\s*trạng|pin|ngoại hình|loại|bảo hành/i;
  // 0.13.1 (kho thật 15/11 14h49: cột "TÊN MÁY & SERI"): cột tên được có chữ seri, chỉ lấy dòng đầu của ô (tên máy), bỏ mã kiểu seri
  const TEN_CAM = /khách|nhân viên|\bnv\b|người|ncc|nhà cung|ghi chú|giá/i, TT = /^trạng thái$|^tình trạng bán$/i;
  const boSeri = t => t.replace(/\b(?=[A-Z0-9-]*\d)(?=[A-Z0-9-]*[A-Z])[A-Z0-9-]{8,}\b/g, '').replace(/\s+/g, ' ').trim();
  const GIA = /giá/i, GIA_BAN = /bán|lẻ|niêm yết/i;
  const ngu = ms => new Promise(x => setTimeout(x, ms));
  const sach = e => (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim();
  const gui = data => chrome.runtime.sendMessage({ poly: 'kho', data: Object.assign({ tok: viec.tok, k: viec.k }, data) }).catch(() => {});
  function bang() {
    let best = null;
    for (const t of document.querySelectorAll('table')) {
      const rows = t.querySelectorAll('tbody tr');
      if (rows.length && (!best || rows.length > best.rows.length)) best = { t, rows };
    }
    if (best) {
      let hd = [...best.t.querySelectorAll('thead th, thead td')].map(sach);
      if (!hd.length) hd = [...best.t.querySelectorAll('tr:first-child th')].map(sach);
      return { hd, rows: [...best.rows].filter(r => !r.querySelector('th')).map(r => [...r.children].map(c => (c.innerText || c.textContent || '').trim())) };
    }
    const g = [...document.querySelectorAll('[role=table],[role=grid]')].find(x => x.querySelectorAll('[role=row]').length > 1);
    if (g) {
      return { hd: [...g.querySelectorAll('[role=columnheader]')].map(sach),
               rows: [...g.querySelectorAll('[role=row]')].filter(r => !r.querySelector('[role=columnheader]')).map(r => [...r.querySelectorAll('[role=cell],[role=gridcell]')].map(c => (c.innerText || c.textContent || '').trim())) };
    }
    return null;
  }
  function chonCot(hd) {
    const ok = h => h && !CAM.test(h);
    let ten = hd.findIndex(h => h && /tên|model|sản phẩm|thiết bị|dòng máy/i.test(h) && !TEN_CAM.test(h));
    if (ten < 0) ten = hd.findIndex(h => ok(h) && TEN.test(h) && !THEM.test(h));
    const gias = hd.map((h, i) => [h, i]).filter(([h]) => ok(h) && GIA.test(h));
    const ban = gias.filter(([h]) => GIA_BAN.test(h));
    const gia = ban.length ? ban[0][1] : gias.length === 1 ? gias[0][1] : -1;     // nhiều cột "giá" mà không ghi "bán": không lấy cột nào
    const them = hd.map((h, i) => [h, i]).filter(([h, i]) => ok(h) && THEM.test(h) && !TT.test(h) && i !== ten && i !== gia).map(([, i]) => i).slice(0, 3);
    const tt = hd.findIndex((h, i) => h && TT.test(h.trim()) && i !== ten);
    return { ten, gia, them, tt };
  }
  function nutSau() {
    const ds = [...document.querySelectorAll('[class*=paginat] button, [class*=paginat] a, [class*=Paginat] button, [class*=Paginat] a, nav[aria-label] button, nav[aria-label] a, button[aria-label], a[aria-label]')];
    return ds.find(b => {
      const t = sach(b), a = (b.getAttribute('aria-label') || '') + ' ' + (b.title || '');
      const la = /^(›|»|>|→|Sau|Trang sau|Tiếp|Next)$/i.test(t) || /next page|^next$|trang sau|trang tiếp/i.test(a.trim());
      return la && !b.disabled && b.getAttribute('aria-disabled') !== 'true' && !/disabled/i.test(b.className || '');
    });
  }
  // 0.13.3 (fen 24/11: đọc kho lúc được lúc không): chẩn đoán CẤU TRÚC trang khi không đọc được (không chép ô dữ liệu nào)
  function chanDoan() {
    const tb = [...document.querySelectorAll('table')].slice(0, 5).map(t => ({ th: t.querySelectorAll('th').length, tr: t.querySelectorAll('tbody tr').length,
      an: !t.offsetParent }));
    const dlg = [...document.querySelectorAll('[role=dialog],[role=alertdialog],[aria-modal=true],.modal,.ant-modal,[class*=Dialog],[class*=Modal]')]
      .filter(x => x.offsetParent || getComputedStyle(x).position === 'fixed').slice(0, 3)
      .map(x => sach(x.querySelector('h1,h2,h3,h4,[class*=title],[class*=Title]') || x).slice(0, 40));
    const tai = !!document.querySelector('[aria-busy=true],[class*=skeleton],[class*=Skeleton],[class*=spinner],[class*=Spinner],[class*=loading],[class*=Loading]');
    return { an: document.visibilityState, path: location.pathname, bang: tb, hop: dlg, tai, grid: document.querySelectorAll('[role=row]').length };
  }
  async function chay() {
    gui({ tt: 'vao', url: location.pathname });          // báo app: tiện ích đã vào trang kho
    let truoc = '', yen = 0, trang = 1, hd = [], cot = null;
    const da = new Set(), rows = [];
    for (let i = 0; i < 120; i++) {           // tối đa ~2 phút
      await ngu(1000);
      if (document.querySelector('input[type=password]')) {
        try { sessionStorage.removeItem(KEY); } catch (e) {}
        return gui({ tt: 'dang-nhap', cot: [] });
      }
      const b = bang();
      if (!b || !b.rows.length) continue;
      const dau = b.rows.length + '|' + b.rows[0].join('|');
      if (dau !== truoc) { truoc = dau; yen = 0; continue; }
      if (++yen < 2) continue;                // bảng đứng yên 2 giây mới đọc
      if (da.has(dau)) break;                 // trang này đọc rồi (bấm trang sau không đổi)
      da.add(dau);
      if (!cot) { hd = b.hd; cot = chonCot(hd); if (cot.ten < 0) break; }
      const gon = t => String(t || '').replace(/\s+/g, ' ').trim();
      for (const r of b.rows) {
        const ten = boSeri(String(r[cot.ten] || '').split('\n').map(x => x.trim()).filter(Boolean)[0] || '');
        if (!ten) continue;
        const loai = re => cot.them.filter(i => re.test(hd[i] || '')).map(i => gon(r[i])).filter(Boolean).join(' · ');
        // ô giá có thể 2 dòng (kho thật 15/11 14h59: "42.000" + dòng số khác): CHỈ lấy dòng đầu = giá bán
        const giaDau = cot.gia >= 0 ? (String(r[cot.gia] || '').split('\n').map(x => x.trim()).filter(Boolean)[0] || '') : '';
        rows.push({ ten, gia: gon(giaDau), them: cot.them.map(i => gon(r[i])).filter(Boolean).join(' · '), tt: cot.tt >= 0 ? gon(r[cot.tt]).slice(0, 30) : '',
          cau: loai(/cấu hình|cpu|chip|ram|ổ cứng|ssd|dung lượng|màu|loại/i), tinh: loai(/tình trạng|t\.\s*trạng|ngoại hình/i), pin: loai(/pin/i) });
      }
      const s = trang < 40 && nutSau();
      if (!s) break;
      s.click(); trang++; yen = 0;
    }
    try { sessionStorage.removeItem(KEY); } catch (e) {}
    if (!cot || cot.ten < 0 || !rows.length) {
      const nhan = hd.length ? hd : [...document.querySelectorAll('h1,h2,h3,th,[role=columnheader]')].map(sach).filter(Boolean).slice(0, 20);
      return gui({ tt: 'khong-thay', cot: nhan.map(x => x.slice(0, 40)), ct: chanDoan() });
    }
    gui({ tt: 'ok', cot: hd.map(x => x.slice(0, 40)), chon: { ten: hd[cot.ten], gia: cot.gia >= 0 ? hd[cot.gia] : '', them: cot.them.map(i => hd[i]), tt: cot.tt >= 0 ? hd[cot.tt] : '' }, rows, trang });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', chay); else chay();
})();
