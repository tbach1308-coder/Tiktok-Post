// Poly TikTok trên trang app dùng chung (máy khác mở app của máy shop qua đường nối Cloudflare), fen 14/11 18h07 "cho máy phú có chức năng này".
// Bấm Đăng TikTok (web) trên máy khác: trang app gửi {mã bài, vé} cho tiện ích ở đây -> tiện ích nhớ link app + vé theo mã bài,
// trang TikTok chỉ mang ?poly=<mã bài> (không lộ vé hay link app cho TikTok). Chỉ nhận tin từ chính trang này.
document.documentElement.dataset.polyTiktok = chrome.runtime.getManifest().version;   // app biết máy này đã cài tiện ích (bản nào)
window.addEventListener('message', e => {
  if (e.source !== window || e.origin !== location.origin) return;
  const m = e.data && e.data.polyTiktok;
  if (!m || !/^[\w-]{6,64}$/.test(m.id || '') || !/^[\w-]{20,64}$/.test(m.ve || '')) return;
  chrome.storage.local.get('ve').then(o => {
    const v = o.ve || {}, n = Date.now();
    for (const k in v) if (!v[k] || n - v[k].t > 12 * 3600e3) delete v[k];
    v[m.id] = { base: location.origin, ve: m.ve, t: n };
    return chrome.storage.local.set({ ve: v });
  }).then(() => window.postMessage({ polyTiktokOk: m.id }, location.origin), () => {});
});
