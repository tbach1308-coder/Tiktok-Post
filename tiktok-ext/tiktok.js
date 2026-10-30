// Poly TikTok: chạy trên trang TikTok. Chỉ làm khi trang được app mở (có ?poly=<mã bài>) hoặc fen bấm Gắn.
// Việc: gắn slide, điền tiêu đề + hashtag, chọn nhạc, bật Tiết lộ nội dung -> Thương hiệu của bạn. KHÔNG BAO GIỜ tự bấm Post / Schedule.
// Fen chốt 29/10 17h50 (sau khi tìm hiểu): điều khoản TikTok cấm script tự động tương tác / đăng bài; bài bán hàng không bật
//   Tiết lộ nội dung thì không được lên Dành cho bạn. Nên: điền sẵn, fen tự bấm Post; muốn hẹn thì fen bấm nút "⏰ Hẹn giờ" ở khung
//   Poly (giờ lấy từ app, không có thì gợi ý 19–22h ngày còn trống, 1 bài/ngày): tiện ích chọn Schedule + ngày giờ, fen tự bấm Schedule.
// ĐÃ BỎ (không làm lại): tự bấm Post sau 8 giây đếm ngược (0.8), tự hẹn + tự bấm Schedule (0.9), app tự mở TikTok lúc có hẹn (0.9).
// QUY TẮC fen chốt 29/10: thấy bài nháp cũ ("unsaved photo post") thì tự Discard rồi đăng bài mới; bấm Điền lại thì
//   bỏ ảnh cũ trên trang (Discard ở cuối trang soạn bài) rồi gắn lại từ đầu, không gắn chồng.
// ĐÃ THỬ KHÔNG ĐƯỢC, KHÔNG DÙNG LẠI:
//   - gắn ảnh vào ô file đầu tiên (ô của tab Videos) -> "File format not supported"; chỉ dùng ô accept ảnh.
//   - execCommand('insertText') vào ô mô tả (Draft.js) -> chữ chỉ hiện trên mặt ô, TikTok không nhận, dòng mờ vẫn còn.
//     Dùng: dán từng chữ bằng sự kiện paste, hashtag bấm chip History hoặc chọn gợi ý; xoá = chọn hết + Backspace.
//   - tìm bảng nhạc bằng class chung (panel/sound/music) -> lấy nhầm khung trang, ô "Search locations", gõ từ khoá nhạc
//     vào ô mô tả. Chỉ dùng .MusicPickerView__root và ô trong MusicPanelSearchBar; không gõ khi ô đó không có focus.
//   - hỏi fen trong khung Poly khi có bài nháp cũ -> fen không thấy, bài không được gắn gì.
//   - đếm ảnh đã gắn theo input.files sau khi báo change -> TikTok xoá ô ngay, báo "0/7" dù trang đã nhận đủ 7 ảnh.
//     Đếm theo chữ "N photos uploaded" / trang đã sang bước soạn bài.
//   - gõ từng chữ + chờ cố định 1–1,6 giây mỗi hashtag -> fen thấy chậm. Gõ theo từ, gợi ý hiện là chọn ngay.
// Thao tác như người (nhịp tay người, rê chuột + cuộn tới trước khi bấm, nghỉ ngẫu nhiên ngắn), 1 bài mỗi lần.
// KHÔNG làm trò qua mặt hệ thống chống bot của TikTok; gặp captcha / xác minh thì dừng hẳn, fen tự làm.
// Mã bài giữ theo tab ở background: khung con (nếu trang tải lên nằm trong iframe) hỏi background,
// chỉ 1 khung được nhận việc (khung nào thấy ô tải ảnh trước).
(function () {
  if (window.__polyTT) return; window.__polyTT = 1;
  const TOP = window === window.top;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const nghi = (a, b) => sleep(a + Math.random() * (b - a));   // nghỉ như người: a..b ms
  const SEGV = (() => { try { return new Intl.Segmenter('vi', { granularity: 'grapheme' }); } catch (e) { return null; } })();
  const chu = t => SEGV ? [...SEGV.segment(t)].map(x => x.segment) : [...t];
  const ask = m => new Promise(r => {
    try { chrome.runtime.sendMessage(m, x => { void chrome.runtime.lastError; r(x || {}); }); } catch (e) { r({}); }
  });
  let id = TOP ? new URLSearchParams(location.search).get('poly') : null;
  let tim = false, busy = false, doi = false, box, msgEl, nutEl;   // doi: khung đang hiện câu 'đang chờ/đang tìm'

  // ---------- khung báo ----------
  const san = () => document.readyState === 'loading'
    ? new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true })) : Promise.resolve();
  const NUT = 'border:0;border-radius:8px;padding:5px 10px;cursor:pointer;font:inherit';
  function panel() {
    if (box) return;
    box = document.createElement('div'); box.id = 'polyBox';
    box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;max-width:360px;background:#171717;color:#ededed;border:1px solid #1f8f4e;border-radius:12px;padding:12px 14px;font:13px/1.45 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.5)';
    box.innerHTML = '<b style="color:#7bf1a8">Poly TikTok <span style="color:#8a8a8a;font-weight:400">' + chrome.runtime.getManifest().version + '</span></b><div class="m" style="margin-top:4px"></div><div class="n" style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"></div>';
    (document.body || document.documentElement).appendChild(box);
    msgEl = box.querySelector('.m'); nutEl = box.querySelector('.n');
  }
  async function say(t, bad, nut, cho) {
    doi = !!cho;
    await san(); panel();
    box.style.display = '';
    msgEl.textContent = t; msgEl.style.color = bad ? '#ffb4a8' : '#ededed';
    nutEl.textContent = '';
    (nut || [['Điền lại', dienLai], ['Ẩn', an]]).forEach(([ten, fn], k) => {
      const b = document.createElement('button');
      b.textContent = ten;
      b.style.cssText = NUT + (k === 0 ? ';background:#1f8f4e;color:#fff' : ';background:#262626;color:#ededed');
      b.onclick = fn;
      nutEl.appendChild(b);
    });
  }
  function an() { if (box) box.style.display = 'none'; }

  // ---------- tìm ô trên trang ----------
  // chỉ nhận ô tải nhận ẢNH: trang Tải lên mặc định ở tab Videos, ô đó chỉ nhận video (29/10 gắn nhầm vào đó)
  const NHAN_ANH = i => /image|\.png|\.jpe?g|\.webp/i.test(i.accept || '');
  function findInput() {
    const ins = [...document.querySelectorAll('input[type="file"]')];
    return ins.find(NHAN_ANH) || ins.find(i => !i.accept) || null;
  }
  // tab "Photos" / "Ảnh" trên trang Tải lên. Chỉ bấm tab này (đổi chế độ đăng ảnh), không bấm nút nào khác của TikTok.
  const TAB_ANH = /^(photos?|ảnh|hình ảnh|đăng ảnh)$/i, TAB_VIDEO = /^(videos?|video)$/i;
  function tabAnh() {
    const ds = [...document.querySelectorAll('[role="tab"], [data-e2e*="tab" i], button, a, div, span, p, li')]
      .filter(e => e.offsetParent && TAB_ANH.test((e.textContent || '').trim()) && e.querySelectorAll('*').length <= 4 && !e.closest('#polyBox'));
    // ưu tiên chữ "Photos" nằm cạnh chữ "Videos" (đúng thanh tab của trang Tải lên)
    const canhVideo = e => { for (let p = e.parentElement, k = 0; p && k < 4; p = p.parentElement, k++) if ([...p.querySelectorAll('*')].some(x => x !== e && !x.contains(e) && !e.contains(x) && TAB_VIDEO.test((x.textContent || '').trim()))) return true; return false; };
    return ds.find(canhVideo) || ds[0] || null;
  }
  function bam(el) {   // đủ chuỗi sự kiện chuột: tab của TikTok có thể nghe mousedown/pointerdown thay vì click
    const r = el.getBoundingClientRect(), o = { bubbles: true, cancelable: true, view: window, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, button: 0 };
    for (const t of ['pointerover', 'pointerdown', 'mousedown', 'pointerup', 'mouseup']) el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, o));
    el.click();
  }
  let daBamTab = 0, soLanBam = 0;
  async function sangTabAnh() {
    if (findInput()) return true;
    const t = tabAnh();
    if (!t || Date.now() - daBamTab < 3000 || soLanBam >= 4) return false;
    daBamTab = Date.now(); soLanBam++;
    if (soLanBam === 1) await nghi(1200, 2600);   // như người: mở trang, nhìn rồi mới bấm tab
    const dich = t.closest('[role="tab"], button, a, li') || t;
    bam(soLanBam % 2 ? dich : t);             // lần sau thử bấm thẳng vào chữ
    return !!(await waitFor(findInput, 6000));
  }
  // ---------- gõ caption như người ----------
  // gợi ý hashtag TikTok hiện ra sau khi gõ "#tên": tìm đúng dòng "#tên" để chọn (để thành hashtag thật)
  function goiY(tag) {
    const t = '#' + tag.toLowerCase();
    const ds = [...document.querySelectorAll('[role="option"], [role="listbox"] *, [class*="hash" i], [class*="mention" i] *, [class*="suggest" i] *, li')]
      .filter(e => e.offsetParent && !e.closest('#polyBox') && !e.closest('[contenteditable="true"]') && !e.closest('[class*="hashtag-list" i]'));
    return ds.find(e => { const x = (e.textContent || '').trim().replace(/^#\s+/, '#').toLowerCase().split(/\s+/)[0]; return x === t && e.querySelectorAll('*').length <= 12; }) || null;
  }
  // Ô mô tả là Draft.js: dán từng chữ (paste) mới vào đúng trạng thái của TikTok. Ô thường (tiêu đề, tìm nhạc): gõ khi ô có focus,
  // không có focus thì đặt giá trị thẳng vào đúng ô đó. Không bao giờ gõ vào ô đang có focus khác.
  const laDraft = el => !!(el && el.isContentEditable);
  function dan(el, c) { const dt = new DataTransfer(); dt.setData('text/plain', c); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })); }
  function datGiaTri(o, v) {
    const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(o), 'value') || Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    d.set.call(o, v); o.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const tu = t => t.match(/\S+\s*|\s+/g) || [];     // gõ theo từng từ (fen 29/10: gõ từng chữ chậm quá)
  async function goChu(el, t) {
    for (const c of tu(t)) {
      if (laDraft(el)) dan(el, c);
      else if (document.activeElement === el || (el.focus(), document.activeElement === el)) document.execCommand('insertText', false, c);
      else datGiaTri(el, (el.value || '') + c);
      await nghi(30, 90);
    }
  }
  async function xoaO(ed) {
    bam(ed); ed.focus(); await nghi(150, 300);
    if (laDraft(ed)) {
      if (!(ed.innerText || '').trim()) return;
      document.execCommand('selectAll', false, null); await nghi(80, 150);
      for (const t of ['keydown', 'keyup']) ed.dispatchEvent(new KeyboardEvent(t, { key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8, bubbles: true, cancelable: true }));
      await nghi(150, 300); return;
    }
    if (ed.select) ed.select();
    await nghi(80, 150);
    if (document.activeElement === ed) document.execCommand('delete', false, null); else datGiaTri(ed, '');
    await nghi(150, 300);
  }
  const giaTri = e => (e.value != null && !e.isContentEditable ? e.value : (e.innerText || e.textContent || ''));
  async function goTieuDe(o, t) { await xoaO(o); await goChu(o, t); }
  // hàng chip "History" dưới ô mô tả (# ipad, # polystore…): bấm chip là TikTok tự chèn hashtag chuẩn
  function chipLichSu(tag) {
    const t = '#' + tag.toLowerCase();
    return [...document.querySelectorAll('[class*="hashtag-list" i] [role="listitem"]')]
      .find(e => e.offsetParent && !e.closest('#polyBox') && (e.textContent || '').replace(/\s+/g, '').toLowerCase() === t) || null;
  }
  const canCach = ed => { const v = giaTri(ed).replace(/\n+$/, ''); return v.trim() && !/\s$/.test(v); };
  async function goCaption(ed, cap) {
    await xoaO(ed);
    const phan = cap.split(/(#[\p{L}\p{N}_]+)/u);   // xen kẽ: chữ thường | #hashtag
    let soTag = 0, daChon = 0;
    for (const p of phan) {
      if (!p || !p.trim()) continue;
      if (canCach(ed)) { dan(ed, ' '); await nghi(30, 80); }
      if (/^#[\p{L}\p{N}_]+$/u.test(p)) {
        soTag++;
        const chip = chipLichSu(p.slice(1));
        if (chip) { hover(chip); await nghi(80, 180); bam(chip); daChon++; await nghi(200, 350); continue; }
        await goChu(ed, p);
        const g = await choNhanh(() => goiY(p.slice(1)), 1800);   // gợi ý hiện là chọn ngay
        if (g) { await nghi(80, 180); bam(g.closest('[role="option"], li') || g); daChon++; await nghi(200, 350); }
      } else await goChu(ed, p.trim());
    }
    return { soTag, daChon };
  }
  // ---------- soi trang: ghi cấu trúc (không lấy ảnh, không lấy chữ dài) gửi về app ----------
  const SOI_RE = /sound|music|audio|nhạc|âm thanh|bài hát|photo|ảnh|video|caption|mô tả|đăng|post|lịch|schedule|hashtag|nháp|draft|disclos|tiết lộ|brand|thương hiệu|promot|quảng bá|switch|checkbox|more|thêm/i;
  function chupCauTruc() {
    const out = [];
    const ds = [...document.querySelectorAll('button, [role], input, textarea, label, a, h1, h2, h3, h4, [contenteditable="true"], [data-e2e], [placeholder], [data-placeholder], [class*="placeholder" i], [class*="sound" i], [class*="music" i], [class*="audio" i], [class*="hashtag" i], [class*="title" i], [class*="desc" i]'),
      ...[...document.querySelectorAll('div, span, p')].filter(e => e.children.length <= 2 && /^(description|sound|photos?|cover|add sound|hashtags?|mention|history|\d+\/\d+|use|sử dụng|show more|show less|more options|xem thêm|ẩn bớt|disclose post content|your brand|branded content|promotional content|thương hiệu của bạn|nội dung có thương hiệu)$/i.test((e.textContent || '').trim()))];
    for (const e of ds) {
      if (out.length >= 2500 || e.closest('#polyBox')) continue;
      const r = e.getBoundingClientRect(), txt = (e.innerText || e.value || '').trim().replace(/\s+/g, ' ');
      const it = { tag: e.tagName.toLowerCase(), role: e.getAttribute('role') || '', e2e: e.getAttribute('data-e2e') || '',
        cls: (typeof e.className === 'string' ? e.className : '').slice(0, 90), aria: (e.getAttribute('aria-label') || '').slice(0, 60),
        txt: txt.length <= 60 ? txt : txt.slice(0, 40) + '…', hien: !!(e.offsetParent || r.width), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
      if (e.tagName === 'INPUT') { it.type = e.type; it.accept = e.accept || ''; it.multiple = !!e.multiple; if (e.type === 'checkbox' || e.type === 'radio') it.checked = !!e.checked; }
      const ph = phOf(e); if (ph) it.ph = ph.slice(0, 80);
      if (e.isContentEditable || e.tagName === 'TEXTAREA') it.ce = true;
      if (!it.hien && !SOI_RE.test(it.txt + it.cls + it.e2e + it.aria) && e.tagName !== 'INPUT') continue;
      out.push(it);
    }
    return out;
  }
  let daSoi = {};
  function soi(nhan) {
    if (daSoi[nhan] && Date.now() - daSoi[nhan] < 20000) return;
    daSoi[nhan] = Date.now();
    try { chrome.runtime.sendMessage({ poly: 'soi', data: { nhan, url: location.pathname + location.search.replace(/poly=[^&]+/, 'poly=…'), ban: chrome.runtime.getManifest().version, items: chupCauTruc() } }, () => void chrome.runtime.lastError); } catch (e) {}
  }
  // fen mở bảng chọn nhạc / âm thanh: chụp lại cấu trúc bảng đó (để Claude làm phần tự chọn nhạc)
  function canhBangNhac() {
    if (!id || !TOP) return;
    const mo = new MutationObserver(() => {
      const bang = [...document.querySelectorAll('[role="dialog"], [class*="modal" i], [class*="drawer" i], [class*="panel" i], [class*="sound" i], [class*="music" i]')]
        .find(e => e.offsetParent && /sound|music|âm thanh|nhạc|bài hát/i.test((e.innerText || '').slice(0, 400)));
      if (bang) setTimeout(() => soi('bang-nhac'), 1500);
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 15 * 60000);
  }
  const ADD_SOUND = /^\+?\s*(add sound|add music|thêm âm thanh|thêm nhạc|chọn âm thanh|chọn nhạc)$/i;
  const NUT_DUNG = /^(use|use this sound|sử dụng|dùng|chọn|select|add|thêm|\+)$/i;
  function hover(el) {
    const r0 = el.getBoundingClientRect();
    if (r0.bottom < 0 || r0.top > innerHeight) el.scrollIntoView({ block: 'center' });   // ngoài màn hình: cuộn tới như người
    const r = el.getBoundingClientRect(), o = { bubbles: true, view: window, clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
    for (const t of ['pointerover', 'pointerenter', 'mouseover', 'mouseenter', 'mousemove']) el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, o));
  }
  const nutThemNhac = () => [...document.querySelectorAll('button, [role="button"], div, span')]
    .find(e => e.offsetParent && ADD_SOUND.test((e.textContent || '').trim()) && e.querySelectorAll('*').length <= 4 && !e.closest('#polyBox')) || null;
  const daCoNhac = () => !nutThemNhac() && /sound|âm thanh/i.test(document.body.innerText.slice(0, 20000));
  const nutDung = goc => [...goc.querySelectorAll('button, [role="button"]')].find(e => e.offsetParent && NUT_DUNG.test(((e.textContent || '').trim()) || e.getAttribute('aria-label') || '')) || null;
  // ---------- nhạc: gu hip hop, không trùng bài đã dùng (fen chốt 29/10) ----------
  const chuanNhac = t => (t || '').toLowerCase().replace(/\s+/g, ' ').trim();
  function baiNhac(goc) {   // trang thật: .MusicPanelMusicItem__wrap > __infoBasicTitle, __infoBasicDesc ("01:02 · tác giả"), nút "Use"
    const ds = [...goc.querySelectorAll('[class*="MusicPanelMusicItem__wrap"], [class*="MusicItem" i][class*="wrap" i]')];
    const goc2 = ds.length ? ds : [...goc.querySelectorAll('[role="listitem"]')];
    return goc2.filter(e => e.offsetParent).map(e => {
      const ten = (e.querySelector('[class*="infoBasicTitle" i], [class*="title" i]')?.textContent || '').trim();
      const mo = (e.querySelector('[class*="infoBasicDesc" i], [class*="desc" i]')?.textContent || '').trim();
      const tg = mo.split('·').pop().trim(), giay = (m => m ? +m[1] * 60 + +m[2] : 0)(mo.match(/(\d+):(\d{2})/));
      return { el: e, ten, tacgia: tg, giay, khoa: chuanNhac(ten + ' · ' + tg) };
    }).filter(x => x.ten);
  }
  function enter(o) { for (const t of ['keydown', 'keypress', 'keyup']) o.dispatchEvent(new KeyboardEvent(t, { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true })); }
  // Bảng nhạc thật (29/10): div[role=dialog].TUXModal.pickerModal > .MusicPickerView__root; ô "Search sounds" trong
  // .MusicPanelSearchBar__wrap; tab For You / Favorites / Recent; danh sách đang tải có .MusicPanelTabListMusicList__loading.
  // Kênh shop (tài khoản doanh nghiệp) chỉ có nhạc thương mại, ít bài: Favorites (fen thả tim sẵn) trước, rồi tìm, rồi For You.
  const bangNhac = () => document.querySelector('[class*="MusicPickerView__root"]')
    || [...document.querySelectorAll('[role="dialog"]')].find(e => e.offsetParent && /^\s*(sounds?|âm thanh)/i.test(e.innerText || '')) || null;
  const oTimNhac = root => root.querySelector('[class*="MusicPanelSearchBar"] input, input[placeholder*="sound" i], input[placeholder*="âm thanh" i]');
  const dangTai = root => [...root.querySelectorAll('[class*="loading" i]')].some(e => e.offsetParent && !/loadingMore|loading-false/i.test(e.className || ''));
  const tabNhac = (root, re) => [...root.querySelectorAll('[role="tab"]')].find(e => e.offsetParent && re.test((e.textContent || '').trim())) || null;
  async function choDs(root, truoc, ms) {   // chờ danh sách tải xong; có "truoc" thì chờ danh sách đổi khác
    return (await waitFor(() => { if (dangTai(root)) return null; const ds = baiNhac(root); return ds.length && (truoc == null || ds[0].ten !== truoc) ? ds : null; }, ms || 10000)) || [];
  }
  async function timNhac(root, q) {
    const o = oTimNhac(root);
    if (!o) return [];
    const truoc = (baiNhac(root)[0] || {}).ten || '';
    bam(o); o.focus(); await nghi(200, 400);
    if (o.value) { datGiaTri(o, ''); await nghi(200, 400); }
    await goChu(o, q);
    let rong = 0;                                   // kênh shop: nhiều từ khoá không ra bài nào, biết sớm để thử từ khác
    const kq = await choNhanh(() => {
      if (dangTai(root)) { rong = 0; return null; }
      const ds = baiNhac(root);
      if (ds.length && ds[0].ten !== truoc) return ds;
      if (!ds.length) { if (!rong) rong = Date.now(); else if (Date.now() - rong > 1200) return 'rong'; }
      return null;
    }, 4000);
    if (kq === 'rong') return [];
    let ds = kq || [];
    if (!kq) { enter(o); ds = await choDs(root, truoc, 5000); }
    await nghi(400, 800);    // như người: đọc danh sách kết quả
    return ds;
  }
  async function chonNhac(d) {
    const b = nutThemNhac();
    if (!b) return 'khong-nut';
    await nghi(400, 800);
    const nut = b.matches('button, [role="button"]') ? b : (b.querySelector('button, [role="button"]') || b.closest('button, [role="button"]') || b);
    bam(nut);
    const root = await waitFor(bangNhac, 9000);
    if (!root) return 'khong-bang';
    await choDs(root, null, 12000);
    await nghi(500, 900);
    soi('bang-nhac');
    const daDung = (d.nhac_da_dung || []).map(chuanNhac), set = new Set(daDung);
    const du = x => !x.giay || x.giay >= 15;
    const moi = ds => ds.find(x => !set.has(x.khoa) && du(x));
    let chon = null, nguon = '', ds = [];
    // fen 30/10 18h20 "chọn nhạc ngẫu nhiên đi miễn không trùng nhau" (cả iPad và Laptop): bốc ngẫu nhiên 1 bài chưa
    // đăng ở tab For You (danh sách đang mở), rồi Favorites, rồi tìm 1 từ khoá rộng ngẫu nhiên; không còn theo gu hip hop.
    if (d.nhac_kieu === 'ngau-nhien') {
      const boc = a => { const c = a.filter(x => !set.has(x.khoa) && du(x)); return c.length ? c[Math.floor(Math.random() * c.length)] : null; };
      const fy = tabNhac(root, /^(for you|dành cho bạn|gợi ý|đề xuất)$/i);
      if (fy && fy.getAttribute('aria-selected') !== 'true') { bam(fy); await nghi(600, 1000); }
      ds = await choDs(root, null, 8000); chon = boc(ds); if (chon) nguon = 'For You (ngẫu nhiên)';
      if (!chon) { const fv = tabNhac(root, /^(favorites|yêu thích|đã lưu|mục yêu thích)$/i);
        if (fv) { bam(fv); await nghi(600, 1000); ds = await choDs(root, null, 6000); chon = boc(ds); if (chon) nguon = 'Favorites (ngẫu nhiên)'; } }
      if (!chon) for (const q of (d.nhac_tim || []).slice(0, 3)) { chon = boc(await timNhac(root, q)); if (chon) { nguon = q + ' (ngẫu nhiên)'; break; } }
    }
    const fav = !chon && d.nhac_kieu !== 'ngau-nhien' && tabNhac(root, /^(favorites|yêu thích|đã lưu|mục yêu thích)$/i);      // 1) nhạc fen thả tim sẵn
    if (fav) { bam(fav); await nghi(600, 1000); ds = await choDs(root, null, 6000); chon = moi(ds); if (chon) nguon = 'Favorites'; }
    if (!chon && d.nhac_kieu !== 'ngau-nhien') for (const q of (d.nhac_tim || ['hip hop']).slice(0, 3)) {             // 2) tìm theo gu, xoay từ khoá
      chon = moi(await timNhac(root, q)); if (chon) { nguon = q; break; }
    }
    if (!chon) {                                                                       // 3) For You (nhạc thương mại TikTok gợi ý)
      const o = oTimNhac(root); if (o && o.value) { datGiaTri(o, ''); await nghi(500, 900); }
      const fy = tabNhac(root, /^(for you|dành cho bạn|gợi ý|đề xuất)$/i); if (fy) { bam(fy); await nghi(600, 1000); }
      ds = await choDs(root, null, 8000); chon = moi(ds); if (chon) nguon = 'For You';
      if (!chon && ds.length) {                                                        // 4) hết bài mới: lấy bài dùng lâu nhất rồi
        const vt = k => daDung.lastIndexOf(k);
        chon = ds.filter(du).sort((x, y) => vt(x.khoa) - vt(y.khoa))[0] || ds[0]; nguon = 'dung-lai';
      }
    }
    if (!chon) return 'khong-thay-bai';
    hover(chon.el); await nghi(300, 600);
    const u = nutDung(chon.el);
    if (!u) return 'khong-nut-dung';
    bam(u);
    await waitFor(() => !bangNhac(), 5000);
    await nghi(400, 800);
    try { chrome.runtime.sendMessage({ poly: 'nhac', data: { id, ten: chon.ten, tacgia: chon.tacgia, tu_khoa: nguon } }, () => void chrome.runtime.lastError); } catch (e) {}
    soi('sau-chon-nhac');
    return 'ok:' + chon.ten + (chon.tacgia ? ' · ' + chon.tacgia : '') + (nguon === 'dung-lai' ? ' (hết bài mới, dùng lại bài cũ nhất)' : '');
  }
  function chanDoan() {
    const ins = [...document.querySelectorAll('input[type="file"]')];
    return ' (thấy ' + ins.length + ' ô tải' + (ins.length ? ': ' + ins.map(i => i.accept || 'mọi file').join(' | ').slice(0, 80) : '') + '; tab Photos: ' + (tabAnh() ? 'có' : 'không thấy') + ')';
  }
  const NHAN = /mô tả|chú thích|caption|description/i;
  // trang thật 29/10: "Description" có ô tiêu đề ("Add a catchy title", 0/90) + ô mô tả ("Writing a long description…", 0/4000)
  const PH_TITLE = /catchy title|add a title|tiêu đề/i, PH_DESC = /long description|description|mô tả|chú thích/i;
  const phOf = e => [e.getAttribute('placeholder'), e.getAttribute('data-placeholder'), e.getAttribute('aria-placeholder'), e.getAttribute('aria-label')].filter(Boolean).join(' ');
  function phNear(e) {   // chữ gợi ý vẽ thành 1 lớp riêng cạnh ô (Draft.js, Lexical)
    for (let p = e.parentElement, k = 0; p && k < 3; p = p.parentElement, k++) {
      const ph = [...p.querySelectorAll('[class*="placeholder" i], [data-placeholder]')].find(x => !e.contains(x) && x !== e);
      if (ph) return (ph.textContent || '') + ' ' + phOf(ph);
    }
    return '';
  }
  const oNhap = () => [...document.querySelectorAll('input[type="text"], input:not([type]), textarea, [contenteditable="true"]')]
    .filter(e => e.offsetParent && !e.closest('#polyBox, header, nav, [role="search"], [role="banner"]'));
  function findTitle() { return oNhap().find(e => PH_TITLE.test(phOf(e) + ' ' + phNear(e))) || null; }
  function findEditor() {
    const t = findTitle();
    const theoChu = oNhap().find(e => e !== t && e.isContentEditable && PH_DESC.test(phOf(e) + ' ' + phNear(e)));
    if (theoChu) return theoChu;
    const a = [...document.querySelectorAll('.public-DraftEditor-content[contenteditable="true"], [data-e2e*="caption"] [contenteditable="true"], [data-e2e*="desc" i] [contenteditable="true"]')].find(e => e !== t);
    if (a) return a;
    // dự phòng: chỉ nhận ô sửa được có nhãn Mô tả / Caption ngay cạnh, không nằm ở thanh tìm kiếm, đầu trang
    for (const e of document.querySelectorAll('[contenteditable="true"]')) {
      if (e === t || !e.offsetParent || e.closest('header,nav,[role="search"],[role="banner"]')) continue;
      if (NHAN.test((e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('placeholder') || ''))) return e;
      let p = e.parentElement;
      for (let k = 0; k < 4 && p; k++, p = p.parentElement) {
        const nhan = [...p.children].filter(c => !c.contains(e)).map(c => c.textContent || '').join(' ');
        if (nhan.length < 200 && NHAN.test(nhan)) return e;
      }
    }
    return null;
  }
  function choNhanh(fn, ms) {   // như waitFor nhưng soi mỗi 100ms
    return new Promise(res => { const t0 = Date.now(); const v = fn(); if (v) return res(v);
      const iv = setInterval(() => { const x = fn(); if (x || Date.now() - t0 > ms) { clearInterval(iv); res(x || null); } }, 100); });
  }
  function waitFor(fn, ms) {
    return new Promise(res => {
      const t0 = Date.now(); const v = fn(); if (v) return res(v);
      const iv = setInterval(() => { const x = fn(); if (x || Date.now() - t0 > ms) { clearInterval(iv); res(x || null); } }, 500);
    });
  }
  // khung con nhỏ (quảng cáo, đo lường) không nhận việc
  const duTo = () => TOP || (innerWidth > 400 && innerHeight > 300);

  // ---------- chờ ô tải ảnh rồi nhận việc ----------
  async function cho() {
    if (tim || !id) return; tim = true;
    try {
      const t0 = Date.now(); let bao = false;
      while (Date.now() - t0 < 90000) {
        const st = await ask({ poly: 'trang' });
        if (st.id !== id || !st.bat) { if (doi) an(); return; }        // việc xong ở khung khác, hoặc fen đã Bỏ
        if (st.co && !st.minh) { if (doi) an(); return; }              // khung khác đã nhận
        if (!findInput() && duTo() && tabAnh()) await sangTabAnh();   // trang mở ở tab Videos: tự chuyển sang Photos
        if (duTo() && (findInput() || (TOP && findTitle()))) {
          const r = await ask({ poly: 'nhan', id });
          if (r.ok) run(); else if (doi) an();
          return;
        }
        if (TOP && !bao && Date.now() - t0 > 12000) {
          say('Đang chờ ô tải ảnh của TikTok… Trang đang ở chế độ video thì fen bấm sang đăng Ảnh.', false, null, true); bao = true;
        }
        await sleep(600);
      }
      if (TOP) {
        const st = await ask({ poly: 'trang' });
        if (st.id === id && st.bat && !st.co) say('Không thấy ô tải ảnh trên trang. Fen bấm tab Photos / Ảnh rồi bấm Điền lại.' + chanDoan(), true);
      }
    } finally { tim = false; }
  }
  function dienLai() {
    if (!id) return;
    soLanBam = 0;
    if (findInput()) { ask({ poly: 'nhan', id, ep: true }).then(() => run()); return; }
    if (TOP) { say('Đang tìm lại ô tải ảnh…', false, null, true); ask({ poly: 'lai', id }); }   // mọi khung trong tab tìm lại
    else run();
  }
  // TikTok còn bài ảnh chưa lưu của lần trước ("You have an unsaved photo post. Continue editing?" Discard | Continue,
  // data-e2e="local_draft_container"). Fen chốt 29/10 16h30: tiện ích TỰ bấm Discard rồi gắn bài này (bản 0.6.1 hỏi fen,
  // fen không thấy khung hỏi nên bài không được gắn gì; không làm lại kiểu hỏi đó).
  const NHAP_CU = /unsaved (photo |video )?post|continue editing|chưa (được )?lưu|tiếp tục chỉnh sửa/i, NUT_BO = /^(discard|bỏ|hủy bỏ|huỷ bỏ|loại bỏ)$/i;
  function nhapCu() {
    const the = document.querySelector('[data-e2e="local_draft_container"]');
    const el = (the && the.offsetParent && the) || [...document.querySelectorAll('div, p, span')].find(e => e.offsetParent && !e.closest('#polyBox') && e.children.length <= 3
      && (e.textContent || '').length < 160 && NHAP_CU.test((e.textContent || '').trim()));
    if (!el) return null;
    for (let p = el, k = 0; p && k < 5; p = p.parentElement, k++) {
      const b = [...p.querySelectorAll('button, [role="button"]')].find(x => x.offsetParent && NUT_BO.test((x.textContent || '').trim()));
      if (b) return { el, bo: b };
    }
    return { el, bo: null };
  }
  async function boNhapCu() {
    say('Đang bỏ bài nháp cũ…');
    const nc = nhapCu();
    if (nc && nc.bo) {
      hover(nc.bo); await nghi(400, 900); bam(nc.bo);
      // TikTok có thể hỏi lại "Discard this post?": fen đã đồng ý ở khung Poly nên bấm Discard trong hộp đó
      const xn = await waitFor(() => [...document.querySelectorAll('[role="dialog"] button, [class*="modal" i] button, [class*="Modal"] button')]
        .find(x => x.offsetParent && x !== nc.bo && NUT_BO.test((x.textContent || '').trim())), 2500);
      if (xn) { await nghi(400, 900); bam(xn); }
    }
    if (await waitFor(() => !nhapCu(), 6000) === null && nhapCu()) {
      say('Chưa bỏ được bài nháp cũ. Fen bấm Discard của TikTok, tiện ích tự gắn bài này ngay sau đó.', true);
      await waitFor(() => !nhapCu(), 180000);               // fen tự bấm Discard thì chạy tiếp, không bắt bấm Điền lại
      if (nhapCu()) return;
    }
    await nghi(800, 1500);
    run(false, true);
  }
  // Trang đang soạn 1 bài (ảnh cũ / lần điền trước, fen bấm Điền lại). Fen chốt 29/10 16h30: bỏ ảnh cũ rồi gắn lại bài mới,
  // không gắn chồng thêm ảnh. Bấm Discard ở cuối trang soạn bài (cạnh Post / Save draft), KHÔNG bao giờ bấm Post.
  function nutBoBai() {
    return [...document.querySelectorAll('button, [role="button"]')].find(x => x.offsetParent && !x.closest('#polyBox')
      && !x.closest('[data-e2e="local_draft_container"]') && NUT_BO.test((x.textContent || '').trim())) || null;
  }
  async function boBaiDangSoan() {
    const b = nutBoBai();
    if (!b) return false;
    hover(b); await nghi(400, 900); bam(b);
    const xn = await waitFor(() => [...document.querySelectorAll('[role="dialog"] button, [class*="modal" i] button, [class*="Modal"] button')]
      .find(x => x.offsetParent && x !== b && NUT_BO.test((x.textContent || '').trim())), 3000);
    if (xn) { await nghi(400, 900); bam(xn); }
    return !!(await waitFor(() => !findTitle() && (findInput() || nhapCu()), 12000));
  }
  // TikTok hỏi xác minh (captcha, kéo thanh trượt): tiện ích dừng hẳn, không bấm gì, fen tự làm.
  const coXacMinh = () => !!document.querySelector('[id*="captcha" i], [class*="captcha" i], iframe[src*="captcha" i], iframe[src*="verify" i]')
    || [...document.querySelectorAll('[role="dialog"]')].some(e => e.offsetParent && /captcha|verify (you|that)|drag the slider|xác minh|kéo thanh trượt|ghép hình/i.test((e.innerText || '').slice(0, 400)));
  // ---------- hẹn giờ đăng bằng TikTok (fen chốt 29/10 17h09) ----------
  // "When to post": radio value post_now / schedule. Chọn Schedule -> TikTok hiện ô ngày + ô giờ (bấm mở lịch / cột giờ phút).
  // Chọn xong phải ĐỌC LẠI 2 ô thấy đúng ngày giờ mới bấm; sai / không chắc thì không bấm, báo fen chỉnh tay.
  const p2 = n => String(n).padStart(2, '0');
  const THANG = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  function oHen() {
    const ins = [...document.querySelectorAll('input')].filter(i => i.offsetParent && !i.closest('#polyBox') && i.type !== 'radio' && i.type !== 'checkbox');
    return { ngay: ins.find(i => /^\d{4}-\d{1,2}-\d{1,2}$|^\d{1,2}\/\d{1,2}\/\d{4}$/.test((i.value || '').trim())) || null,
             gio: ins.find(i => /^\d{1,2}:\d{2}$/.test((i.value || '').trim())) || null };
  }
  const dungNgay = (v, d) => { v = (v || '').trim(); let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/); if (m) return +m[1] === d.getFullYear() && +m[2] === d.getMonth() + 1 && +m[3] === d.getDate();
    m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return !!m && +m[3] === d.getFullYear() && ((+m[1] === d.getDate() && +m[2] === d.getMonth() + 1) || (+m[2] === d.getDate() && +m[1] === d.getMonth() + 1)); };
  const dungGio = (v, d) => { const m = (v || '').trim().match(/^(\d{1,2}):(\d{2})$/); return !!m && +m[1] === d.getHours() && +m[2] === d.getMinutes(); };
  const soMuc = e => (e.textContent || '').trim();
  function cotSo(nho, lon) {   // các cột số trong bảng chọn giờ: nhóm theo cha, cột có 13-24 số 0..23 là giờ, 12/60 số 0..59 là phút
    const ds = [...document.querySelectorAll('li, div, span, button')].filter(e => e.offsetParent && !e.closest('#polyBox') && e.children.length === 0 && /^\d{2}$/.test(soMuc(e)));
    const nhom = new Map(); ds.forEach(e => { const k = e.parentElement; if (!nhom.has(k)) nhom.set(k, []); nhom.get(k).push(e); });
    return [...nhom.values()].filter(g => g.length >= nho && g.length <= lon);
  }
  async function bamSo(cot, so) {
    const e = cot.find(x => soMuc(x) === p2(so)); if (!e) return false;
    e.scrollIntoView({ block: 'center' }); await nghi(150, 300); hover(e); bam(e); await nghi(250, 450); return true;
  }
  async function chonGio(o, d) {
    bam(o); o.focus(); await nghi(500, 900);
    const cot = cotSo(12, 60);
    const gio = cot.find(g => g.length >= 13 && g.length <= 24 && g.every(e => +soMuc(e) <= 23)), phut = cot.find(g => g !== gio && (g.length === 12 || g.length === 60 || g.some(e => +soMuc(e) > 23)));
    if (!gio || !phut) return false;
    if (!(await bamSo(gio, d.getHours()))) return false;
    if (!(await bamSo(phut, d.getMinutes()))) return false;
    await nghi(300, 600);
    return dungGio(o.value, d) || dungGio((oHen().gio || {}).value, d);
  }
  function thangDangHien() {   // tiêu đề lịch: "October 2026" / "2026-10" / "Tháng 10 2026"
    const t = [...document.querySelectorAll('div, span, p, button')].filter(e => e.offsetParent && e.children.length <= 2).map(soMuc).find(x => x.length < 30 &&
      (new RegExp('^(' + THANG.join('|') + ')\\s+\\d{4}$', 'i').test(x) || /^\d{4}[-\/.\s]+\d{1,2}$/.test(x) || /^tháng\s*\d{1,2}[,\s/]+\d{4}$/i.test(x)));
    if (!t) return null;
    let m = t.match(/^(\w+)\s+(\d{4})$/); if (m && THANG.indexOf(m[1].toLowerCase()) >= 0) return { y: +m[2], m: THANG.indexOf(m[1].toLowerCase()) + 1 };
    m = t.match(/^(\d{4})[-\/.\s]+(\d{1,2})$/); if (m) return { y: +m[1], m: +m[2] };
    m = t.match(/(\d{1,2})[,\s/]+(\d{4})/); return m ? { y: +m[2], m: +m[1] } : null;
  }
  async function chonNgay(o, d) {
    if (dungNgay(o.value, d)) return true;
    bam(o); o.focus(); await nghi(500, 900);
    for (let k = 0; k < 2; k++) {                 // hẹn tối đa 10 ngày: cùng tháng hoặc tháng sau
      const th = thangDangHien();
      if (!th) break;
      if (th.y === d.getFullYear() && th.m === d.getMonth() + 1) break;
      const tiep = [...document.querySelectorAll('button, [role="button"], span, div')].find(e => e.offsetParent && !e.closest('#polyBox')
        && /next|sau|arrow-right|right/i.test((e.getAttribute('aria-label') || '') + ' ' + (typeof e.className === 'string' ? e.className : '')) && e.getBoundingClientRect().width < 60);
      if (!tiep) return false;
      bam(tiep); await nghi(300, 600);
    }
    const o2 = [...document.querySelectorAll('td, div, span, button')].filter(e => e.offsetParent && !e.closest('#polyBox') && e.children.length === 0 && soMuc(e) === String(d.getDate())
      && !/disabled|other|outside|prev|next|gray|grey|invalid/i.test(((typeof e.className === 'string' ? e.className : '') + ' ' + (typeof e.parentElement.className === 'string' ? e.parentElement.className : ''))));
    const o3 = o2.find(e => !e.closest('input')); if (!o3) return false;
    hover(o3); bam(o3); await nghi(400, 700);
    return dungNgay(o.value, d) || dungNgay((oHen().ngay || {}).value, d);
  }
  async function henGio(ts) {
    const d = new Date(ts * 1000);
    const r = document.querySelector('input[type="radio"][value="schedule"]') || [...document.querySelectorAll('input[type="radio"]')].find(i => /schedule|lên lịch|hẹn/i.test((i.closest('label') || i.parentElement || {}).textContent || ''));
    if (!r) return 'không thấy mục Schedule của TikTok';
    if (!r.checked) { const l = r.closest('label') || r.parentElement; hover(l || r); await nghi(200, 400); bam(l || r); if (!r.checked) r.click(); await nghi(700, 1200); }
    if (!r.checked) return 'chưa chọn được Schedule';
    const o = await waitFor(() => { const x = oHen(); return x.ngay && x.gio ? x : null; }, 6000);
    soi('hen-gio');
    if (!o) return 'không thấy ô ngày / giờ hẹn';
    if (!(await chonNgay(o.ngay, d))) { soi('hen-gio-ngay'); return 'chưa chọn được ngày ' + p2(d.getDate()) + '/' + p2(d.getMonth() + 1); }
    if (!(await chonGio(oHen().gio || o.gio, d))) { soi('hen-gio-gio'); return 'chưa chọn được giờ ' + p2(d.getHours()) + ':' + p2(d.getMinutes()); }
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); await nghi(300, 500);   // đóng bảng chọn
    const x = oHen();
    if (!(x.ngay && x.gio && dungNgay(x.ngay.value, d) && dungGio(x.gio.value, d))) { soi('hen-gio-sai'); return 'đọc lại ô hẹn chưa đúng ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ' ' + p2(d.getDate()) + '/' + p2(d.getMonth() + 1); }
    return '';
  }

  // ---------- nút Post / Schedule của TikTok: tiện ích KHÔNG bấm, chỉ nhận biết khi fen bấm ----------
  const NUT_POST = /^(post|đăng|đăng bài|schedule|lên lịch|hẹn giờ|đặt lịch)$/i;
  function taiKhoanKhac(handle) {   // trang có link hồ sơ @tên khác mà không có @poly.store: đang đăng nhập nhầm tài khoản
    const h = (handle || '').replace(/^@/, '').toLowerCase();
    const ds = [...document.querySelectorAll('a[href*="/@"]')].map(a => ((a.getAttribute('href') || '').match(/\/@([\w.]+)/) || [])[1]).filter(Boolean).map(x => x.toLowerCase());
    return !h || !ds.length || ds.includes(h) ? null : ds[0];
  }

  // ---------- Tiết lộ nội dung -> Thương hiệu của bạn ----------
  // TikTok: "Marketing content is ineligible for the FYF if it is not disclosed" -> bài bán máy phải bật, bật không giảm view.
  // Trang thật 29/10: [data-e2e="disclose_content_container"] nằm trong phần thu gọn cuối mục Settings (Show more), có
  // input.Switch__input (role=switch). Bật lên mới hiện ô "Your brand" / "Branded content". Chỉ tích Your brand, không đụng
  // công tắc khác (AI-generated content), không bỏ tích Branded content nếu fen đã tích.
  const XEM_THEM = /^(show more|more options|advanced settings|xem thêm|hiện thêm|thêm tùy chọn|cài đặt nâng cao)$/i;
  const DISC = /^(disclose (post |photo |video )?content|disclose commercial content|tiết lộ nội dung)/i, BRAND = /^(your brand|thương hiệu của bạn)$/i;
  const hien = e => !!(e && (e.offsetParent || e.getClientRects().length));
  function khungDisc() {
    const c = document.querySelector('[data-e2e="disclose_content_container"]');
    if (c) return c;
    return [...document.querySelectorAll('div')].find(e => !e.closest('#polyBox') && e.querySelector('input[role="switch"], [role="switch"]')
      && DISC.test((e.textContent || '').trim()) && (e.textContent || '').length < 700) || null;
  }
  const congTac = c => c && (c.querySelector('input[role="switch"]') || c.querySelector('[role="switch"]') || c.querySelector('input[type="checkbox"]'));
  const batRoi = x => !!x && (x.checked === true || x.getAttribute('aria-checked') === 'true');
  function nutXemThem() {
    const vis = document.querySelector('[data-e2e="video_visibility_container"]'), y0 = vis ? vis.getBoundingClientRect().top : 0;
    return [...document.querySelectorAll('button, [role="button"], a, div, span, p')].filter(e => hien(e) && !e.closest('#polyBox') && !e.closest('[contenteditable="true"]')
      && e.children.length <= 3 && XEM_THEM.test((e.textContent || '').trim()) && e.getBoundingClientRect().top >= y0)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0] || null;
  }
  function oBrand(c) {   // ô tích "Your brand": checkbox (không phải công tắc) gần chữ Your brand
    const nhan = [...(c || document).querySelectorAll('label, span, div, p')].filter(e => hien(e) && !e.closest('#polyBox') && BRAND.test((e.textContent || '').trim()));
    for (const n of nhan) for (let p = n, k = 0; p && k < 4; p = p.parentElement, k++) {
      const cb = [...p.querySelectorAll('input[type="checkbox"]:not([role="switch"]), [role="checkbox"]')];
      if (cb.length === 1) return cb[0];
      if (cb.length > 1) break;
    }
    return null;
  }
  async function tich(x) {   // bấm như người vào nhãn / khung của ô, chưa đổi thì bấm thẳng ô
    const t0 = batRoi(x), l = x.closest('label') || x.parentElement;
    if (l) { l.scrollIntoView({ block: 'center' }); await nghi(200, 400); hover(l); bam(l); await nghi(400, 700); }
    if (batRoi(x) === t0) { x.click(); await nghi(400, 700); }
    return batRoi(x) !== t0;
  }
  async function batBrand() {
    let c = khungDisc();
    if (!c || !hien(c)) {
      const n = nutXemThem();
      if (n) { n.scrollIntoView({ block: 'center' }); await nghi(300, 600); hover(n); bam(n); await nghi(600, 1000); }
      c = await waitFor(() => { const x = khungDisc(); return x && hien(x) ? x : null; }, 4000);
    }
    if (!c) { soi('brand-khong-thay'); return 'không thấy mục Tiết lộ nội dung'; }
    const sw = congTac(c);
    if (!sw) { soi('brand-khong-thay'); return 'không thấy công tắc Tiết lộ nội dung'; }
    if (!batRoi(sw) && !(await tich(sw))) { soi('brand-cong-tac'); return 'chưa bật được công tắc Tiết lộ nội dung'; }
    const cb = await waitFor(() => oBrand(c) || oBrand(), 4000);
    if (!cb) { soi('brand-o'); return 'không thấy ô Thương hiệu của bạn'; }
    if (!batRoi(cb) && !(await tich(cb))) { soi('brand-o'); return 'chưa tích được Thương hiệu của bạn'; }
    soi('brand');
    return '';
  }
  // mặc định (app gửi brand khác true, fen chốt 30/10 12h54): không bật; công tắc đang bật sẵn thì tắt đi
  async function tatBrand() {
    const c = khungDisc(); if (!c || !hien(c)) return '';
    const sw = congTac(c); if (!sw || !batRoi(sw)) return '';
    if (!(await tich(sw))) { soi('brand-tat'); return 'chưa tắt được Tiết lộ nội dung'; }
    soi('brand-tat'); return '';
  }
  const daBrand = () => { const c = khungDisc(), cb = c && (oBrand(c) || oBrand()); return !!(c && batRoi(congTac(c)) && batRoi(cb)); };

  // ---------- nút ⏰ Hẹn giờ (fen bấm) ----------
  const ngayKey = t => { const d = new Date(t * 1000); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
  const txtHen = t => (d => p2(d.getHours()) + ':' + p2(d.getMinutes()) + ' ' + p2(d.getDate()) + '/' + p2(d.getMonth() + 1))(new Date(t * 1000));
  const dtLocal = t => (d => d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) + 'T' + p2(d.getHours()) + ':' + p2(d.getMinutes()))(new Date(t * 1000));
  let henChon = 0, xongCu = null;   // giờ fen đã cho tiện ích chọn trên trang; câu báo "xong" để quay lại
  function gioMacDinh(d) { const h = d.hen_dang || 0; return h && h * 1000 - Date.now() >= 16 * 60000 ? h : (d.goi_y_hen || 0); }
  async function moHen(d) {
    const ts0 = henChon || gioMacDinh(d) || Math.ceil((Date.now() / 1000 + 3600) / 300) * 300;
    await say('Chọn giờ đăng (TikTok cần sau ít nhất 15 phút, trong 10 ngày; kênh 1 bài/ngày, 19–22h):', false, [
      ['Chọn giờ này trên TikTok', () => chotHen(d)], ['Thôi', () => xongCu && xongCu()]]);
    const w = document.createElement('div'); w.style.cssText = 'margin-top:6px';
    w.innerHTML = '<input type="datetime-local" step="300" style="background:#262626;color:#ededed;border:1px solid #3a3a3a;border-radius:6px;padding:4px 6px;font:inherit;color-scheme:dark">'
      + '<div class="tr" style="margin-top:4px;color:#ffd28a"></div>';
    msgEl.appendChild(w);
    const o = w.querySelector('input'), tr = w.querySelector('.tr');
    o.value = dtLocal(ts0); o.min = dtLocal(Date.now() / 1000 + 16 * 60); o.max = dtLocal(Date.now() / 1000 + 10 * 86400);
    const ve = () => { const t = o.value ? new Date(o.value).getTime() / 1000 : 0, ds = t ? ((d.ngay_co_bai || {})[ngayKey(t)] || []) : [];
      tr.textContent = ds.length ? 'Ngày này đã có: ' + ds.join(', ') + '. Nên chọn ngày khác.' : ''; };
    o.oninput = ve; ve(); moHen.o = o;
  }
  async function chotHen(d) {
    const o = moHen.o; if (!o || !o.value) return;
    const dd = new Date(o.value); dd.setMinutes(Math.round(dd.getMinutes() / 5) * 5, 0, 0);
    const ts = dd.getTime() / 1000, con = (ts * 1000 - Date.now()) / 60000;
    if (con < 16) return say('Giờ hẹn phải sau ít nhất 16 phút nữa (TikTok cần 15 phút). Chọn giờ khác.', true, [['Chọn lại', () => moHen(d)], ['Thôi', () => xongCu && xongCu()]]);
    if (con > 10 * 1440) return say('TikTok chỉ cho hẹn trong 10 ngày. Chọn giờ khác.', true, [['Chọn lại', () => moHen(d)], ['Thôi', () => xongCu && xongCu()]]);
    if (busy) return;
    busy = true;
    try {
      say('Đang chọn Schedule ' + txtHen(ts) + ' trên TikTok…');
      const loi = await henGio(ts);
      if (loi) return say('Chưa chọn được giờ hẹn: ' + loi + '. Fen chọn Schedule, chỉnh ngày giờ ' + txtHen(ts) + ' trên trang rồi tự bấm Schedule.', true, [['Thử lại', () => moHen(d)], ['Ẩn', an]]);
      henChon = ts;
      say('Đã chọn hẹn ' + txtHen(ts) + ' trên TikTok. Fen kiểm lại trang rồi tự bấm Schedule ở cuối trang (TikTok tự đăng đúng giờ, máy tắt cũng được).', false,
        [['Đổi giờ', () => moHen(d)], ['Ẩn', an]]);
    } finally { busy = false; }
  }
  // giờ hẹn đang chọn trên trang (fen có thể tự chỉnh lại trong bảng của TikTok)
  function gioTrenTrang() {
    const r = document.querySelector('input[type="radio"][value="schedule"]');
    if (!r || !r.checked) return 0;
    const x = oHen(); if (!x.ngay || !x.gio) return henChon;
    const g = (x.gio.value || '').trim().match(/^(\d{1,2}):(\d{2})$/); if (!g) return henChon;
    const v = (x.ngay.value || '').trim(); let m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/), ca = [];
    if (m) ca = [new Date(+m[1], +m[2] - 1, +m[3], +g[1], +g[2])];
    else if ((m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/))) ca = [new Date(+m[3], +m[2] - 1, +m[1], +g[1], +g[2]), new Date(+m[3], +m[1] - 1, +m[2], +g[1], +g[2])];
    ca = ca.map(x => x.getTime() / 1000).filter(t => t > Date.now() / 1000 && t < Date.now() / 1000 + 11 * 86400);
    return ca.find(t => henChon && ngayKey(t) === ngayKey(henChon)) || ca[0] || henChon;
  }
  function bytes(b64) { const s = atob(b64), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }

  // ---------- gắn slide + caption ----------
  function run(ep, quaNhap) {
    if (busy) return; busy = true;
    say('Đang lấy slide từ app Poly Dựng Bài…');
    chrome.runtime.sendMessage({ poly: 'lay', id }, async d => {
      void chrome.runtime.lastError;
      try {
        if (!d || d.err) return say((d && d.err) || 'Không lấy được bài.', true);
        if (d.ten) ask({ poly: 'ten', id, ten: d.ten });
        if (!d.anh.length) return say('Bài chưa có slide.', true);
        const files = d.anh.map(a => new File([bytes(a.b64)], a.name, { type: 'image/png' }));
        if (!quaNhap && nhapCu()) {
          soi('nhap-cu');
          busy = false;
          return boNhapCu();                                    // tự bỏ nháp cũ rồi gắn bài này
        }
        if (findTitle()) {                                     // còn ảnh cũ trên trang: bỏ hết rồi gắn lại từ đầu
          say('Đang bỏ ảnh cũ trên trang để gắn lại bài này…');
          if (!(await boBaiDangSoan())) return say('Chưa bỏ được ảnh cũ. Fen bấm Discard ở cuối trang TikTok rồi bấm Điền lại.', true);
          await nghi(800, 1500);
          if (nhapCu()) { busy = false; return boNhapCu(); }
        }
        let n = 0;
        say('Chờ ô tải ảnh của TikTok…');
        if (!findInput()) await sangTabAnh();
        const input = await waitFor(findInput, 30000);
        if (!input) { soi('khong-thay-o'); return say('Không thấy ô tải ẢNH. Fen bấm tab Photos / Ảnh rồi bấm Điền lại, hoặc kéo ' + files.length + ' slide trong thư mục bài vào.' + chanDoan(), true); }
        if (!input.multiple && files.length > 1 && !ep) {
          return say('Ô tải của trang này chỉ nhận 1 file (thường do đang ở chế độ đăng video), chưa gắn slide nào. Fen bấm sang đăng Ảnh rồi bấm Điền lại.', true,
            [['Điền lại', dienLai], ['Vẫn gắn ' + files.length + ' slide', () => run(true, quaNhap)], ['Ẩn', an]]);
        }
        await nghi(400, 800);
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        input.files = dt.files;
        const gan = input.files ? input.files.length : 0;    // đọc NGAY khi gán: TikTok xoá ô chọn file sau khi nhận ảnh
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        await sleep(1500);
        const loi = [...document.querySelectorAll('[role="alert"], [class*="toast" i], [class*="Toast"], [class*="notice" i]')]
          .map(e => (e.textContent || '').trim()).find(t => /not supported|không (được )?hỗ trợ|không hợp lệ|failed|thất bại|try again/i.test(t));
        if (loi) return say('TikTok không nhận ảnh: "' + loi.slice(0, 120) + '". Fen bấm tab Photos / Ảnh rồi bấm Điền lại.', true);
        // TikTok nhận đủ chưa: xem trang ("7 photos uploaded" / đã sang bước soạn bài), không đếm theo ô file
        say('Đã gắn ' + files.length + ' slide. Chờ TikTok nhận ảnh…');
        const soTrang = () => { const m = (document.body.innerText || '').match(/(\d+)\s*(photos? uploaded|ảnh đã tải lên|ảnh được tải lên)/i); return m ? +m[1] : 0; };
        const nhan = await waitFor(() => soTrang() >= files.length || (!soTrang() && findTitle()), 20000);
        n = soTrang() || (nhan ? files.length : gan);
        if (!nhan && gan < files.length) return say('Mới gắn ' + gan + '/' + files.length + ' slide. Fen kéo đủ ' + files.length + ' slide trong thư mục bài vào, hoặc bấm Điền lại.', true);
        if (n < files.length) return say('TikTok mới nhận ' + n + '/' + files.length + ' ảnh. Fen bấm Điền lại.', true);
        await nghi(500, 900);
        soi('sau-khi-gan');
        const bao = [];   // các việc chưa làm được, báo fen ở cuối
        const dg = 'Đã gắn ' + n + ' slide';
        if (!d.caption) bao.push('bài chưa có caption, fen tự gõ');
        else {
          const cau = d.caption.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s+/g, ' ').trim();
          const tags = (d.caption.match(/#[\p{L}\p{N}_]+/gu) || []).join(' ');
          const ti = await waitFor(findTitle, 20000);
          const ed = await waitFor(findEditor, ti ? 8000 : 60000);
          if (ti && cau) {                                     // tiêu đề: câu caption, không hashtag
            say(dg + '. Đang gõ tiêu đề…');
            await goTieuDe(ti, cau.slice(0, 90));
            await nghi(200, 400);
          }
          const vaoMoTa = ti ? tags : d.caption;               // có ô tiêu đề thì mô tả chỉ cần hashtag
          if (vaoMoTa) {
            if (!ed) bao.push('không thấy ô mô tả, bấm Chép caption trong app rồi dán');
            else {
              say(dg + '. Đang gõ ' + (ti ? 'hashtag' : 'caption') + '…');
              const kq = await goCaption(ed, vaoMoTa);
              await nghi(250, 450);
              const ph = document.querySelector('.public-DraftEditorPlaceholder-root');
              if ((ph && ph.offsetParent) || !giaTri(ed).replace(/\s+/g, ' ').includes(vaoMoTa.replace(/\s+/g, ' ').slice(0, 10))) bao.push('ô mô tả chưa nhận hashtag, fen bấm vào ô gõ lại giúp');
              else if (kq.soTag > kq.daChon) bao.push((kq.soTag - kq.daChon) + '/' + kq.soTag + ' hashtag không có gợi ý để chọn, fen xem lại');
            }
          }
          if (!ti && !ed) bao.push('không thấy ô tiêu đề / mô tả');
        }
        say(dg + '. Đang chọn nhạc…');
        const nhac = daCoNhac() ? 'co-san' : await chonNhac(d);
        if (!/^ok|^co-san/.test(nhac)) bao.push('chưa chọn được nhạc (' + nhac + '), fen bấm Add sound chọn giúp');
        const coBrand = d.brand === true;   // fen chốt 30/10 12h54: mặc định TẮT như cài đặt gốc TikTok; chỉ bật khi fen bấm Bật ở ô Đăng bài của app
        let br = '';
        if (coBrand) {
          say(dg + '. Đang bật Tiết lộ nội dung → Thương hiệu của bạn…');
          br = await batBrand();
          if (br) bao.push(br + ': fen mở "Show more" cuối mục Settings, bật Disclose post content, tích Your brand (bài bán hàng không bật thì không lên Dành cho bạn)');
        } else {
          br = await tatBrand();
          if (br) bao.push(br + ': fen tắt Disclose post content giúp (mặc định tắt)');
        }
        ask({ poly: 'xong' });
        soi('xong'); canhBangNhac();
        const tenNhac = /^ok:/.test(nhac) ? ' Nhạc: ' + nhac.slice(3) + '.' : '';
        const khac = taiKhoanKhac(d.handle);
        if (khac) bao.push('trang đang đăng nhập @' + khac + ', không phải ' + d.handle + ', đừng bấm Post');
        if (coXacMinh()) bao.push('TikTok đang hỏi xác minh, fen tự làm');
        const gm = gioMacDinh(d);
        const nut = [['⏰ Hẹn giờ' + (gm ? ' ' + txtHen(gm) : ''), () => moHen(d)], ['Điền lại', dienLai], ['Ẩn', an]];
        const brTxt = coBrand ? 'Thương hiệu của bạn' : 'Tiết lộ nội dung để tắt (mặc định)';
        xongCu = () => say((bao.length ? dg + '. Còn: ' + bao.join('; ') + '.' + tenNhac + ' Fen sửa chỗ còn thiếu, ' : 'Xong: ' + n + ' ảnh, tiêu đề, hashtag, nhạc, ' + brTxt + '.' + tenNhac + ' Fen kiểm đúng ' + d.handle + ', thứ tự ảnh, chữ, ')
          + 'rồi tự bấm Post. Muốn hẹn giờ thì bấm ⏰ Hẹn giờ' + (gm && d.hen_dang ? ' (giờ hẹn trong app)' : '') + ', rồi tự bấm Schedule.', bao.length > 0, nut);
        xongCu();
      } finally { busy = false; }
    });
  }

  // fen tự bấm Post / Schedule: báo app (nhạc của bài này tính là "đã dùng", ghi giờ hẹn, đã bật Thương hiệu của bạn chưa)
  let theoDoi = 0;
  async function choDangXong(info) {
    const k = ++theoDoi, url0 = location.href;
    const ok = await waitFor(() => k !== theoDoi || location.href !== url0
      || /your (post|video|photos?) (has been|was|is being|will be) (uploaded|posted|published|scheduled)|post scheduled|đã (được )?(đăng|lên lịch|hẹn)/i.test((document.body.innerText || '').slice(0, 8000)) ? true : null, 60000);
    if (!ok || k !== theoDoi || location.href !== url0) return;   // chuyển trang: background báo app
    try { chrome.runtime.sendMessage({ poly: 'dang', data: Object.assign({ id, ok: true }, info) }, () => void chrome.runtime.lastError); } catch (e) {}
    say(info.lich ? 'Đã hẹn ' + txtHen(info.lich) + ', TikTok tự đăng đúng giờ.' : 'Đã đăng. Nhớ ghim comment và trực comment giờ đầu nha.', false, [['Ẩn', an]]);
  }
  document.addEventListener('click', e => {
    if (!id || !e.isTrusted) return;
    const b = e.target.closest && e.target.closest('button, [role="button"]');
    if (!b || b.closest('#polyBox')) return;
    const t = (b.textContent || '').trim();
    if ((!b.closest('[role="dialog"]') && NUT_POST.test(t)) || (b.closest('[role="dialog"]') && /^(post now|đăng ngay|schedule|lên lịch)$/i.test(t))) {
      const info = { lich: gioTrenTrang() || 0, brand: daBrand() };
      ask(Object.assign({ poly: 'dang-bam', id }, info));
      choDangXong(info);
    }
  }, true);

  // ---------- bắt đầu ----------
  chrome.runtime.onMessage.addListener(m => {
    if (!m || m.poly !== 'tim') return;
    if (id) cho();
    else if (!TOP) ask({ poly: 'hoi' }).then(r => { if (r.id) { id = r.id; cho(); } });
  });
  (async () => {
    if (TOP) {
      if (id) { await ask({ poly: 'dat', id }); cho(); return; }
      // trang không có ?poly= (mở tay, hoặc TikTok chuyển trang làm mất): không tự gắn, chỉ hỏi fen
      const cu = await ask({ poly: 'tat' });
      if (cu.id && /upload/i.test(location.pathname)) {
        say('Gắn bài ' + (cu.ten ? '"' + cu.ten + '"' : 'vừa mở từ app') + ' vào trang này?', false,
          [['Gắn', () => { id = cu.id; say('Đang tìm ô tải ảnh…', false, null, true); ask({ poly: 'lai', id }); }], ['Bỏ', () => { ask({ poly: 'bo' }); an(); }]]);
      }
      return;
    }
    for (let k = 0; k < 24 && !id; k++) { const r = await ask({ poly: 'hoi' }); if (r.id) id = r.id; else await sleep(500); }
    if (id) cho();
  })();
})();
