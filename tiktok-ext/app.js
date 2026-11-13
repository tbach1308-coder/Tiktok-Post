// Poly TikTok trên trang app Poly Dựng Bài của máy con (mở app máy shop qua link Cloudflare, fen 13/11 17h05):
// báo app "máy này có tiện ích" (data-poly-tiktok = bản), nhận lệnh Đăng TikTok (web) của chính trang app rồi nhờ tiện ích mở TikTok Studio.
(() => {
  const ban = chrome.runtime.getManifest().version;
  const gan = () => { if (document.documentElement) document.documentElement.dataset.polyTiktok = ban; };
  gan(); document.addEventListener('DOMContentLoaded', gan);
  window.addEventListener('message', e => {
    const m = e.data;
    if (e.source !== window || e.origin !== location.origin || !m || m.poly !== 'mo-tiktok') return;
    const tra = x => window.postMessage(Object.assign({ poly: 'mo-tiktok-xong', id: m.id }, x), location.origin);
    try {
      chrome.runtime.sendMessage({ poly: 'mo-app', id: m.id, k: m.k, url: m.url }, r => {
        if (chrome.runtime.lastError || !r) return tra({ ok: false, err: 'Tiện ích Poly TikTok vừa cập nhật: tải lại trang app (F5) rồi bấm lại' });
        tra(r.ok ? { ok: true } : { ok: false, err: r.err || 'Tiện ích chưa mở được TikTok' });
      });
    } catch (err) { tra({ ok: false, err: 'Tiện ích Poly TikTok vừa cập nhật: tải lại trang app (F5) rồi bấm lại' }); }
  });
})();
