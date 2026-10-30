// Poly TikTok: lấy slide + caption của bài từ app Poly Dựng Bài (chạy trên chính máy này, cổng 8777).
// Trang TikTok không gọi thẳng 127.0.0.1 được, nên nhờ service worker (có quyền host) lấy hộ.
// Mã bài giữ THEO TỪNG TAB (storage.session, key "tab<id>"): tab khác hay trang mở tay không bị gắn nhầm bài.
const APP = 'http://127.0.0.1:8777';
const HAN = 10 * 60 * 1000;          // việc của tab quá 10 phút thì bỏ
let q = Promise.resolve();           // xử lý tuần tự: 2 khung cùng xin nhận việc thì chỉ 1 khung được
const tuanTu = f => (q = q.then(f, f));
const key = t => 'tab' + t;
async function lay1(t) { const k = key(t); const o = await chrome.storage.session.get(k); return o[k] || null; }
const ghi = (t, v) => v ? chrome.storage.session.set({ [key(t)]: v }) : chrome.storage.session.remove(key(t));

chrome.runtime.onInstalled.addListener(() => { chrome.storage.local.remove('polyJob'); });   // bản 0.1 để chung 1 mã cho mọi tab
chrome.tabs.onRemoved.addListener(t => { tuanTu(() => ghi(t, null)); chrome.storage.session.remove('dang' + t); });
// vừa bấm Post mà tab rời trang Tải lên (TikTok chuyển sang trang Bài đăng): báo app là đã đăng
chrome.tabs.onUpdated.addListener(async (t, info) => {
  if (!info.url || !/tiktok\.com\/tiktokstudio/.test(info.url) || /\/upload/.test(new URL(info.url).pathname)) return;
  const k = 'dang' + t, o = (await chrome.storage.session.get(k))[k];
  if (!o || Date.now() - o.t > 3 * 60000) return;
  await chrome.storage.session.remove(k);
  fetch(APP + '/api/tiktok-dang', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: o.id, ok: true, qua: 'chuyen-trang', lich: o.lich || 0, brand: o.brand }) }).catch(() => {});
});

chrome.runtime.onMessage.addListener((msg, sender, send) => {
  if (!msg || !msg.poly) return;
  if (msg.poly === 'lay') {
    lay(msg.id).then(send, e => send({ err: String((e && e.message) || e) }));
    return true;
  }
  if (msg.poly === 'nhac') {   // ghi bài nhạc vừa chọn vào sổ của app (lần sau không chọn lại)
    fetch(APP + '/api/tiktok-nhac', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg.data) })
      .then(r => send({ ok: r.ok }), () => send({ ok: false }));
    return true;
  }
  if (msg.poly === 'dang') {   // TikTok báo đăng / hẹn xong mà không chuyển trang -> app ghi vào bài
    fetch(APP + '/api/tiktok-dang', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg.data) })
      .then(r => send({ ok: r.ok }), () => send({ ok: false }));
    if (sender.tab) chrome.storage.session.remove('dang' + sender.tab.id);
    return true;
  }
  if (msg.poly === 'dang-bam') {   // fen vừa bấm Post / Schedule: nhớ lại (giờ hẹn, Thương hiệu), TikTok chuyển trang thì vẫn báo được app
    if (sender.tab) chrome.storage.session.set({ ['dang' + sender.tab.id]: { id: msg.id, t: Date.now(), lich: msg.lich || 0, brand: msg.brand } }).then(() => send({ ok: true }));
    return true;
  }
  if (msg.poly === 'soi') {   // cấu trúc trang (tên nút, tab, ô nhập) gửi về app để Claude soi giao diện thật
    fetch(APP + '/api/tiktok-soi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg.data) })
      .then(r => send({ ok: r.ok }), () => send({ ok: false }));
    return true;
  }
  const tab = sender.tab && sender.tab.id;
  if (tab == null) return;
  const top = sender.frameId === 0;
  tuanTu(async () => {
    let j = await lay1(tab);
    if (j && Date.now() - j.t > HAN) { await ghi(tab, null); j = null; }
    switch (msg.poly) {
      case 'dat':     // khung chính có ?poly=<id> (hoặc fen bấm Gắn): giao việc cho tab này
        if (!top) return send({});
        await ghi(tab, { id: msg.id, t: Date.now(), bat: true, khung: null, ten: msg.ten || (j && j.id === msg.id ? j.ten : '') });
        return send({ ok: true });
      case 'tat':     // khung chính mở trang KHÔNG có ?poly=: khung con không được tự gắn; trả việc cũ để hỏi fen
        if (!top) return send({});
        if (j) { j.bat = false; j.khung = null; await ghi(tab, j); }
        return send(j ? { id: j.id, ten: j.ten || '' } : {});
      case 'hoi':     // khung con hỏi tab này đang có việc không
        return send(j && j.bat ? { id: j.id } : {});
      case 'nhan': {  // khung tìm thấy ô tải ảnh xin nhận việc
        if (!j || !j.bat || j.id !== msg.id) return send({ ok: false });
        if (j.khung != null && j.khung !== sender.frameId && !msg.ep) return send({ ok: false });
        j.khung = sender.frameId; await ghi(tab, j);
        return send({ ok: true });
      }
      case 'ten':     // lưu tên bài (để hỏi lại nếu TikTok chuyển trang làm mất ?poly=)
        if (j && j.id === msg.id) { j.ten = msg.ten; await ghi(tab, j); }
        return send({});
      case 'trang':   // co: đã có khung nhận việc; minh: chính khung hỏi là khung đã nhận
        return send(j ? { id: j.id, bat: j.bat, co: j.khung != null, minh: j.khung === sender.frameId } : {});
      case 'xong':
      case 'bo':
        await ghi(tab, null);
        return send({ ok: true });
      case 'lai':     // fen bấm Điền lại ở khung chính: mọi khung tìm lại ô tải ảnh
        if (!j || j.id !== msg.id) await ghi(tab, { id: msg.id, t: Date.now(), bat: true, khung: null, ten: '' });
        else { j.bat = true; j.khung = null; j.t = Date.now(); await ghi(tab, j); }
        chrome.tabs.sendMessage(tab, { poly: 'tim' }).catch(() => {});
        return send({ ok: true });
    }
    send({});
  }).catch(e => send({ err: String(e) }));
  return true;
});

async function lay(id) {
  let r;
  try { r = await fetch(APP + '/api/tiktok/' + encodeURIComponent(id)); }
  catch (e) { throw new Error('Không nối được app Poly Dựng Bài. Mở app (icon ngoài Desktop) rồi bấm Điền lại.'); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.err || ('App báo lỗi ' + r.status));
  d.anh = [];
  for (const f of d.files || []) {
    let rr;
    try { rr = await fetch(f.url); } catch (e) { throw new Error('Không nối được app Poly Dựng Bài khi lấy ' + f.name + '. Bấm Điền lại.'); }
    if (!rr.ok) throw new Error('Thiếu slide ' + f.name + ' (vừa bị xoá hoặc đổi tên?). Mở lại bài trong app rồi bấm Điền lại.');
    d.anh.push({ name: f.name, b64: toB64(await rr.arrayBuffer()) });
  }
  return d;
}
function toB64(buf) {
  const a = new Uint8Array(buf); let s = '';
  for (let i = 0; i < a.length; i += 0x8000) s += String.fromCharCode.apply(null, a.subarray(i, i + 0x8000));
  return btoa(s);
}
