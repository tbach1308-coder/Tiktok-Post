import json, time, sys
sys.argv=[sys.argv[0]]
exec(open('/home/claude/bug3/tgltest.py').read().split("n=len(logs())\nr=req(APP")[0])
G=-100500
def gmsg(text, uid=222, chat=G, name='Quân', **kw):
    m = {"message_id": int(time.time()*1000)%10**7, "date": int(time.time()), "chat": {"id": chat, "type": "supergroup", "title": "POLY làm bài"},
         "from": {"id": uid, "first_name": name, "is_bot": False}, "text": text}
    m.update(kw); return push({"message": m})
def gcb(data, uid=222, mid=1): return push({"callback_query": {"id": "cb%d" % time.time_ns(), "from": {"id": uid}, "message": {"message_id": mid, "chat": {"id": G, "type": "supergroup"}}, "data": data}})
def quiet(n, t=2.5): time.sleep(t); return [x for x in sent(n) if x['meth'] in ('sendMessage','sendPhoto','sendMediaGroup')]
# nối riêng trước (như fen đang dùng)
r=req(APP+'/api/tg-lenh', {"bat": True})
if not r['noi']:
    ma=req(APP+'/api/tg-lenh', {"ma_moi": True})['ma']; n=len(logs()); msg('/start '+ma); wait_for(n, lambda x: 'Đã nối' in txt(x))
check('đang nối riêng', req(APP+'/api/tg-lenh')['noi'] and not req(APP+'/api/tg-lenh')['nhom'])
r=req(APP+'/api/tg-lenh', {"ma_nhom": True}); check('nút Dùng trong nhóm -> mã nhóm', r['ma_nhom'] and len(r['ma'])==6, r); ma=r['ma']
n=len(logs()); gmsg('/start@poly_dung_bai_bot 123456', uid=111, name='Bách'); check('mã sai trong nhóm: không nối', not quiet(n) and not req(APP+'/api/tg-lenh')['nhom'])
n=len(logs()); msg(ma); x=wait_for(n, lambda x: 'Thêm bot vào nhóm' in txt(x), 5); check('mã nhóm gửi riêng: không đổi, nhắc cách nối', x is not None and not req(APP+'/api/tg-lenh')['nhom'])
n=len(logs()); gmsg('/start@poly_dung_bai_bot '+ma, uid=111, name='Bách')
x=wait_for(n, lambda x: 'Đã nối' in txt(x)); check('mã đúng trong nhóm: nối nhóm', x is not None and x['vals'].get('chat_id')==str(G), x)
print('   ', txt(x).replace('\n',' | ') if x else '')
r=req(APP+'/api/tg-lenh'); check('trạng thái nhom=True, tên nhóm', r['nhom'] and r['ten']=='POLY làm bài' and not r['ma'], r)
y=wait_for(n, lambda x: 'Quản trị viên' in txt(x), 5); check('bot chưa là admin: nhắc cho làm quản trị viên', y is not None)
n=len(logs()); gmsg('/tinhhinh'); x=wait_for(n, lambda x: 'Tình hình' in txt(x)); check('Quân /tinhhinh trong nhóm: trả lời', x is not None)
n=len(logs()); gmsg('đẹp đó anh'); check('chuyện thường: bot im', not quiet(n), quiet(n,0))
n=len(logs()); gmsg('bài này lên chưa'); check('"bài này…" không dấu ":": bot im', not quiet(n))
n=len(logs()); gmsg('ok', photo=[{"file_id":"p1","width":1,"height":1}]); check('ảnh thường trong nhóm: bot im', not quiet(n))
n=len(logs()); gmsg('/tat'); x=wait_for(n, lambda x: 'Chỉ' in txt(x)); check('Quân /tat: từ chối', x is not None and req(APP+'/api/tg-lenh')['bat'])
print('   ', txt(x) if x else '')
n=len(logs()); gmsg('quy tắc: slide cuối không ghi địa chỉ'); x=wait_for(n, lambda x: 'quy tắc' in txt(x).lower()); check('Quân ghi quy tắc: từ chối', x is not None and 'Chỉ' in txt(x) or 'chỉ' in txt(x), x and txt(x))
n=len(logs()); gcb('bg:tat'); x=wait_for(n, lambda x: x['meth']=='answerCallbackQuery'); check('Quân bấm Tắt trên bảng: từ chối', x is not None and 'Chỉ' in (x['vals'].get('text') or '') and req(APP+'/api/tg-lenh')['bat'], x)
n=len(logs()); gcb('bg:th'); x=wait_for(n, lambda x: 'Tình hình' in txt(x)); check('Quân bấm Tình hình: được', x is not None)
n=len(logs()); gmsg('@poly_dung_bai_bot ?'); x=wait_for(n, lambda x: 'Cách dùng' in txt(x)); check('@bot ?: hướng dẫn kiểu nhóm', x is not None and 'bài:' in txt(x), x and txt(x))
n=len(logs()); gmsg('bài: laptop cho dân kiến trúc'); x=wait_for(n, lambda x: x['meth']=='sendMessage', 20); check('Quân "bài: …": bot làm brief', x is not None, '')
print('   ', txt(x)[:120].replace('\n',' | ') if x else '')
n=len(logs()); gmsg('/brief máy cho sinh viên'); x=wait_for(n, lambda x: x['meth']=='sendMessage', 20); check('Quân /brief: bot làm', x is not None)
n=len(logs()); msg('/tinhhinh'); check('fen nhắn riêng khi đã nối nhóm: bỏ qua', not quiet(n))
time.sleep(6); n=len(logs()); gmsg('/tinhhinh', chat=-100999); check('nhóm lạ: bỏ qua', not quiet(n), quiet(n,0))
n=len(logs()); gmsg('/tat', uid=111, name='Bách'); time.sleep(2.5); check('fen /tat trong nhóm: tắt', not req(APP+'/api/tg-lenh')['bat'])
n=len(logs()); gmsg('/bat'); time.sleep(2.5); check('Quân /bat: không bật', not req(APP+'/api/tg-lenh')['bat'])
n=len(logs()); gmsg('/bat', uid=111, name='Bách'); time.sleep(2.5); check('fen /bat: bật lại', req(APP+'/api/tg-lenh')['bat'])
r=req(APP+'/api/tg-lenh', {"bo_noi": True}); check('bỏ nối: hết nhóm', not r['noi'] and not r['nhom'], r)
# bot là quản trị viên: không nhắc
open('/home/claude/bug3/tglfake.admin','w').write('administrator')
r=req(APP+'/api/tg-lenh', {"bat": True}); ma=req(APP+'/api/tg-lenh', {"ma_nhom": True})['ma']
n=len(logs()); gmsg('/start@poly_dung_bai_bot '+ma, uid=111, name='Bách'); x=wait_for(n, lambda x: 'Đã nối' in txt(x))
time.sleep(1.5); check('nối thẳng nhóm (chưa nối riêng) + bot admin: không nhắc quản trị', x is not None and not any('Quản trị viên' in txt(y) for y in sent(n)))
import os; os.remove('/home/claude/bug3/tglfake.admin')
n=len(logs()); push({"message": {"message_id": 5, "date": int(time.time()), "chat": {"id": G, "type": "supergroup", "title": "x"}, "from": {"id": 222, "first_name": "Quân", "is_bot": False}, "text": "trả lời", "reply_to_message": {"message_id": 4, "from": {"id": 1, "is_bot": True}, "text": "x"}}})
x=wait_for(n, lambda x: x['meth']=='sendMessage', 10); check('trả lời tin bot (không phải brief): coi là gọi bot', x is not None, '')
req(APP+'/api/tg-lenh', {"bo_noi": True})
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
