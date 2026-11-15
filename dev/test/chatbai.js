// Khung chat của bài (fen 15/11 12h17 "cho chỗ này thành chat box hỏi với sửa bài đi"): khung Sửa bài thành "💬 Hỏi / sửa bài".
// Câu hỏi → Claude chỉ trả lời (dòng CHI_TRA_LOI, app ẩn chữ đó, không báo "Xong" Telegram); nhờ sửa → sửa như cũ; đang chạy thì khung
// vẫn hiện lịch sử + "Claude đang…", khoá Gửi; Enter gửi; ô dưới từng slide gửi kèm. Claude giả: câu kết thúc "?" = câu hỏi.
const { chromium } = require('playwright');
const fs = require('fs');
const A = 'http://127.0.0.1:8790', T = '/home/claude/bug3/tgl';
let ok = 0, bad = 0; const check = (n, c, x) => { c ? ok++ : bad++; console.log((c ? '✓ ' : '✗ ') + n + (c ? '' : ' ' + JSON.stringify(x))); };
const job = async id => (await (await fetch(A + '/api/job/' + id)).json());
(async () => {
  const js = await (await fetch(A + '/api/jobs')).json();
  const j = js.jobs.find(x => x.status === 'xong' && x.kenh === 'ipad' && !x.khach && !x.dung_bang);
  const b = await chromium.launch(); const errs = [];
  const p = await b.newPage({ viewport: { width: 1386, height: 950 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto(A + '/#bai=' + j.id); await p.reload(); await p.waitForSelector('#fixCard', { timeout: 15000 }); await p.waitForTimeout(500);
  const r0 = await p.evaluate(() => ({ sec: document.querySelector('#fixCard .sec').textContent, nut: $('#bFix').textContent, cu: /Sửa một lượt/.test(document.body.innerText), ph: $('#fixText').placeholder, n: (S.data.chat || []).length }));
  check('khung "💬 Hỏi / sửa bài", nút Gửi, không còn "Sửa một lượt", chữ mờ chỉ cách hỏi / sửa', /Hỏi \/ sửa bài/.test(r0.sec) && r0.nut === 'Gửi' && !r0.cu && /Hỏi về bài hoặc nhờ sửa… \(Enter gửi\)/.test(r0.ph), r0);
  // câu hỏi
  const n0 = r0.n;
  await p.fill('#fixText', 'slide 3 đọc có rõ không?'); await p.press('#fixText', 'Enter'); await p.waitForTimeout(300);
  const pr = fs.readFileSync(T + '/last-prompt.txt', 'utf8');
  check('Enter gửi: lệnh sửa của bài + đoạn KHUNG CHAT (câu hỏi chỉ trả lời, quy tắc chỉ khi fen nói rõ)', /^\/poly-carousel:sua-bai .* slide 3 đọc có rõ không\?/.test(pr) && /KHUNG CHAT CỦA BÀI/.test(pr) && /CHI_TRA_LOI/.test(pr) && /lần sau/.test(pr), pr.slice(0, 300));
  check('ô gõ xoá sau khi gửi', await p.evaluate(() => $('#fixText').value === ''));
  await p.waitForFunction(n => (S.data.chat || []).length > n && S.data.chat[S.data.chat.length - 1].tra, n0, { timeout: 30000 });
  await p.waitForTimeout(800);
  const r1 = await p.evaluate(() => ({ m: [...document.querySelectorAll('#fChat .fm')].slice(-2).map(e => [e.className, e.innerText]), dis: $('#bFix').disabled, last: S.data.chat[S.data.chat.length - 1] }));
  check('câu hỏi: bong bóng fen + câu trả lời của Claude (ẩn chữ CHI_TRA_LOI), lượt đánh dấu là hỏi', r1.m.length === 2 && /fen/.test(r1.m[0][0]) && /slide 3 đọc có rõ không\?/.test(r1.m[0][1]) && /bot/.test(r1.m[1][0]) && /đọc rõ rồi fen/.test(r1.m[1][1]) && !/CHI_TRA_LOI/.test(r1.m[1][1]) && r1.last.hoi && r1.last.chat, r1);
  // nhờ sửa kèm ô dưới slide 2
  await p.evaluate(() => { const o = document.querySelector('.slfix[data-fn="2"]'); o.value = 'đổi ảnh máy to hơn'; o.dispatchEvent(new Event('input')); });
  await p.fill('#fixText', 'chữ cả bài to hơn'); await p.click('#bFix'); await p.waitForTimeout(700);
  const r2 = await p.evaluate(() => ({ dis: $('#bFix').disabled, dang: !!document.querySelector('#fChat .fm.dang'), the: !!$('#fixCard'), ph: $('#fixText').placeholder }));
  check('đang sửa: khung vẫn hiện, "Claude đang…", nút Gửi khoá', r2.the && r2.dang && r2.dis && /Chờ Claude/.test(r2.ph), r2);
  await p.waitForFunction(() => S.data.job.status !== 'dang-chay', null, { timeout: 90000 }); await p.waitForTimeout(800);
  const r3 = await p.evaluate(() => ({ m: [...document.querySelectorAll('#fChat .fm')].slice(-2).map(e => e.innerText), dis: $('#bFix').disabled, last: S.data.chat[S.data.chat.length - 1] }));
  check('nhờ sửa: gửi kèm "Slide 2: …", Claude sửa xong có câu trả lời, nút Gửi mở lại, không phải lượt hỏi', /Slide 2: đổi ảnh máy to hơn/.test(r3.m[0]) && /chữ cả bài to hơn/.test(r3.m[0]) && /Xong/.test(r3.m[1]) && !r3.dis && !r3.last.hoi, r3);
  const jj = await job(j.id);
  check('lịch sử lưu ở bài (sua có chat), tải lại trang vẫn thấy', (jj.job.sua || []).filter(x => x.chat).length >= 2 && await (async () => { await p.reload(); await p.waitForSelector('#fChat .fm', { timeout: 15000 }); return p.evaluate(() => document.querySelectorAll('#fChat .fm').length >= 4); })());
  // fen 12h26 "khung chat này nhỏ lại": khung thấp, trả lời dài chỉ 3 dòng đầu + "xem hết", bỏ dòng đường dẫn file
  await p.evaluate(() => { S.data.chat.push({ text: 'thông tin bài này đúng chưa?', chat: true, tra: 'Đã soát lại cả bài.\nSlide 4 lệch 1 chỗ, đã sửa thành “quay về công cụ trước đó”.\nChip, dung lượng, bút đều khớp nguồn.\nCaption khớp.\n\nĐường dẫn: `E:\\Social Claude\\iPad\\T11_Bai\\slide-04.png`', hoi: false, n: 9 }); veChatBai(); });
  const r4 = await p.evaluate(() => { const b = [...document.querySelectorAll('#fChat .fm.bot')].pop(); return { t: b.innerText, h: document.querySelector('#fChat').getBoundingClientRect().height, xh: !!b.querySelector('[data-xh]') }; });
  check('trả lời dài: 3 dòng đầu + "xem hết", không hiện dòng đường dẫn E:\\…, khung chat ≤ 210px', r4.xh && /xem hết/.test(r4.t) && !/Caption khớp/.test(r4.t) && !/E:\\/.test(r4.t) && r4.h <= 211, r4);
  await p.click('#fChat [data-xh]'); await p.waitForTimeout(100);
  const r5 = await p.evaluate(() => [...document.querySelectorAll('#fChat .fm.bot')].pop().innerText);
  check('bấm "xem hết": hiện cả câu trả lời (vẫn bỏ dòng đường dẫn)', /Caption khớp/.test(r5) && !/xem hết/.test(r5) && !/E:\\/.test(r5), r5);
  await p.screenshot({ path: 'shots/chat-bai.png' });
  check('không lỗi JS', errs.length === 0, errs);
  await b.close(); console.log(`\n${ok} đạt, ${bad} lỗi`); process.exit(bad ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
