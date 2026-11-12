import json, time, urllib.request, sys
APP='http://127.0.0.1:8790'; TG='http://127.0.0.1:8798'; LOG='/home/claude/bug3/tglfake.log'
def req(u, d=None):
    r = urllib.request.Request(u, data=json.dumps(d).encode() if d is not None else None, headers={'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(r, timeout=30) as f: return json.loads(f.read())
    except urllib.error.HTTPError as e: return json.loads(e.read())
def push(u): return req(TG+'/_push', u)
def msg(text, uid=111, chat=None, typ='private', **kw):
    m = {"message_id": int(time.time()*1000)%10**7, "date": int(time.time()), "chat": {"id": chat or uid, "type": typ, "first_name": "Bách"}, "from": {"id": uid, "first_name": "Bách", "is_bot": False}, "text": text}
    m.update(kw); return push({"message": m})
def cb(data, mid=1, uid=111): return push({"callback_query": {"id": "cb%d" % time.time_ns(), "from": {"id": uid}, "message": {"message_id": mid, "chat": {"id": 111, "type": "private"}}, "data": data}})
def logs():
    try: return [json.loads(l) for l in open(LOG)]
    except FileNotFoundError: return []
def sent(since):
    return [x for x in logs()[since:] if x['meth'] not in ('getUpdates','getMe','getFile','editMessageText','pinChatMessage') or x['meth'] in WANT]
WANT=set()
def wait_for(since, pred, t=30):
    bd=time.time()
    while time.time()-bd<t:
        for x in sent(since):
            if pred(x): return x
        time.sleep(0.3)
    return None
def txt(x): return (x['vals'].get('text') or x['vals'].get('caption') or '')
ok=[0,0]
def check(name, cond, extra=''):
    ok[0 if cond else 1]+=1; print(('✓ ' if cond else '✗ ')+name, ('' if cond else extra))
n=len(logs())
r=req(APP+'/api/tg-lenh', {"bat": True}); check('bật -> có mã 6 số', r.get('bat') and len(r.get('ma',''))==6, r); ma=r['ma']
time.sleep(1.5); r=req(APP+'/api/tg-lenh'); check('luồng nghe chạy', r['chay'], r)
msg('/start 000000'); time.sleep(2); check('mã sai: chưa nối', not req(APP+'/api/tg-lenh')['noi'])
msg('nhóm: /start '+ma, uid=111, chat=-100222, typ='supergroup'); time.sleep(2); check('mã gửi trong nhóm: không nối', not req(APP+'/api/tg-lenh')['noi'])
n=len(logs()); msg('/start '+ma)
x=wait_for(n, lambda x: 'Đã nối' in txt(x)); check('mã đúng: nối + chào', x is not None)
r=req(APP+'/api/tg-lenh'); check('trạng thái noi=True, ten', r['noi'] and r['ten']=='Bách' and not r['ma'], r)
check('setMyCommands gọi', any(y['meth']=='setMyCommands' for y in sent(n)))
n=len(logs()); msg('/tinhhinh', uid=999, chat=999); time.sleep(2); check('người lạ: bỏ qua', not sent(n), sent(n))
n=len(logs()); msg('/tinhhinh'); x=wait_for(n, lambda x: 'Tình hình' in txt(x)); check('/tinhhinh trả lời', x is not None); print('   ', txt(x).replace('\n',' | ') if x else '')
n=len(logs()); msg('/abc'); x=wait_for(n, lambda x: 'Lệnh lạ' in txt(x)); check('lệnh lạ -> hướng dẫn', x is not None)
# brief iPad tự nhận kênh
n=len(logs()); msg('tìm chủ đề hot mẹo ipad mùa thi')
x=wait_for(n, lambda x: 'Đang viết brief' in txt(x)); check('brief iPad: báo đang viết', x is not None and 'iPad' in txt(x), txt(x) if x else '')
x=wait_for(n, lambda x: '"chay:' in (x['vals'].get('reply_markup') or ''), 40); check('brief xong: tóm tắt + nút Chạy', x is not None)
if x:
    t=txt(x); print('   ', t.replace('\n',' | ')); check('có đánh giá + rủi ro', ('🟡' in t or '🟢' in t or '🔴' in t) and '⚠️' in t)
    body=[y for y in sent(n) if y['meth']=='sendMessage' and 'Brief iPad' in txt(y)]; check('gửi nội dung brief', bool(body))
    km=json.loads(x['vals']['reply_markup'])['inline_keyboard']; jid=km[0][0]['callback_data'].split(':',1)[1]
    n2=len(logs()); cb('chay:'+jid, mid=1234)
    y=wait_for(n2, lambda y: 'Đang dựng' in txt(y) or 'Xếp hàng' in txt(y)); check('bấm Chạy -> dựng', y is not None, sent(n2)); print('   ', txt(y).replace('\n',' | ') if y else '')
    check('bỏ nút sau khi bấm', any(z['meth']=='editMessageReplyMarkup' for z in sent(n2)))
    n3=len(logs()); cb('chay:'+jid, mid=1234); time.sleep(2)
    a=[z for z in sent(n3) if z['meth']=='answerCallbackQuery']; check('bấm Chạy lần 2: báo đã chạy', a and 'đã chạy' in a[-1]['vals'].get('text',''), a)
    jobs=req(APP+'/api/jobs')['jobs']; jb=[j for j in jobs if j['status'] in ('dang-chay','hen')]; check('có bài mới trong app', bool(jb))
    # chờ bài dựng xong -> báo về chat lệnh (theo_doi 3s)
    z=wait_for(n2, lambda z: z['meth'] in ('sendPhoto','sendMessage') and str(z['vals'].get('chat_id'))=='111' and ('Xong:' in txt(z) or 'dừng giữa' in txt(z)), 120)
    check('bài xong: báo về chat lệnh', z is not None); print('   ', (z['meth']+': '+txt(z).replace('\n',' | ')) if z else '')
# brief chung chung -> hỏi kênh
n=len(logs()); msg('5 lỗi hay gặp khi mua máy cũ')
x=wait_for(n, lambda x: 'Kênh nào' in txt(x)); check('chưa rõ kênh -> hỏi nút', x is not None)
if x:
    km=json.loads(x['vals']['reply_markup'])['inline_keyboard']; d=km[0][0]['callback_data']
    n2=len(logs()); cb(d)
    y=wait_for(n2, lambda y: 'Chạy dựng bài' in (y['vals'].get('reply_markup') or ''), 40); check('chọn Laptop -> brief xong', y is not None)
    if y:
        sm=json.loads([z for z in logs() if z['meth']=='sendMessage'][-1]['vals'].get('reply_markup','{}') or '{}')
        # mid của tin tóm tắt = message_id fake trả; lấy từ job.tg.msg
        km=json.loads(y['vals']['reply_markup'])['inline_keyboard']; jid=km[0][0]['callback_data'].split(':',1)[1]
        jj=json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json'%jid)); mid=jj['tg']['msg']; check('ghi msg id vào job', bool(mid), jj.get('tg'))
        n3=len(logs()); msg('bìa ngắn lại', reply_to_message={"message_id": mid})
        z=wait_for(n3, lambda z: 'Đang sửa brief' in txt(z)); check('reply -> chat sửa brief', z is not None)
        z=wait_for(n3, lambda z: 'Chạy dựng bài' in (z['vals'].get('reply_markup') or ''), 40); check('sửa xong -> brief đã sửa + nút', z is not None and 'Đã sửa' in txt(z), txt(z) if z else sent(n3))
        n4=len(logs()); cb('chay:'+jid); time.sleep(2); a=[q for q in sent(n4) if q['meth']=='answerCallbackQuery']
        check('bản cũ sau khi sửa: không chạy', a and 'bỏ' in a[-1]['vals'].get('text',''), a)
        # reply hỏi (không sửa)
        if z:
            jid2=json.loads(z['vals']['reply_markup'])['inline_keyboard'][0][0]['callback_data'].split(':',1)[1]
            mid2=json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json'%jid2))['tg']['msg']
            n5=len(logs()); msg('slide 4 hợp chưa?', reply_to_message={"message_id": mid2})
            q=wait_for(n5, lambda q: txt(q).startswith('💬'), 40); check('reply hỏi -> trả lời + nút chạy bản đang có', q is not None and 'chay:'+jid2 in (q['vals'].get('reply_markup') or ''), txt(q) if q else sent(n5))
# trùng
n=len(logs()); msg('mua laptop cũ cần kiểm gì')
x=wait_for(n, lambda x: 'Trùng bài' in txt(x), 40); check('trùng -> gợi ý nút', x is not None and 'gy:' in (x['vals'].get('reply_markup') or ''), txt(x) if x else '')
# quy tắc kèm ảnh (album 2 ảnh)
n=len(logs())
msg('', caption='quy tắc: slide cuối không ghi địa chỉ shop', photo=[{"file_id":"a1"},{"file_id":"a1big"}], media_group_id='g1')
msg('', photo=[{"file_id":"b1"},{"file_id":"b1big"}], media_group_id='g1')
y=wait_for(n, lambda y: 'Đang ghi quy tắc' in txt(y), 20); check('quy tắc -> ghi luôn không hỏi (chung, kèm 2 ảnh)', y is not None and 'chung 2 kênh' in txt(y) and '2 ảnh' in txt(y), txt(y) if y else sent(n))
y=wait_for(n, lambda y: txt(y).startswith('📏 Đã ghi'), 40); check('ghi quy tắc xong -> báo', y is not None, sent(n))
import glob
qj=sorted(glob.glob('/home/claude/bug3/tgl/jobs/*/anh-quy-tac/*')); check('ảnh album lưu vào việc quy tắc (2 ảnh)', len(qj)>=2, qj)
n=len(logs()); msg('quy tắc: bìa iPad chữ to hơn'); y=wait_for(n, lambda y: 'Đang ghi quy tắc' in txt(y), 20); check('quy tắc nhắc iPad -> chỉ iPad', y is not None and 'chỉ iPad' in txt(y), txt(y) if y else '')
# ảnh không chữ
n=len(logs()); msg('', photo=[{"file_id":"c1"}]); x=wait_for(n, lambda x: 'Ảnh dùng khi ghi quy tắc' in txt(x)); check('ảnh không chữ -> nhắc', x is not None)
# bảng điều khiển ghim
L=logs(); pins=[x for x in L if x['meth']=='pinChatMessage']; check('nối xong: gửi bảng điều khiển + ghim', bool(pins), [x['meth'] for x in L[-30:]])
bang=[x for x in L if x['meth']=='sendMessage' and '🎛 Poly Dựng Bài' in txt(x)]; check('bảng có nút Tắt / Viết brief / Quy tắc', bang and all(k in bang[0]['vals'].get('reply_markup','') for k in ('bg:tat','bg:brief','bg:qt')))
ed=[x for x in L if x['meth']=='editMessageText' and '🎛 Poly Dựng Bài' in (x['vals'].get('text') or '')]; check('bảng tự sửa khi có bài chạy / xong', len(ed)>=1, len(ed))
n=len(logs()); cb('bg:brief'); x=wait_for(n, lambda x: 'Nhắn chủ đề bài' in txt(x)); check('nút Viết brief -> hỏi chủ đề (force reply)', x is not None and 'force_reply' in x['vals'].get('reply_markup',''))
n=len(logs()); cb('bg:qt'); x=wait_for(n, lambda x: 'Nhắn quy tắc mới' in txt(x)); check('nút Quy tắc -> hỏi luật', x is not None)
if x:
    import time as _t; _t.sleep(0.5)
    mid=json.loads(urllib.request.urlopen(TG+'/_q').read() or b'[]') and None
    # message_id fake trả = MID: lấy từ log không có -> dùng TGL.hoi_qt qua reply id = id fake trả gần nhất: đọc /_q không có; dùng cách: gửi reply với id lớn nhất đã cấp
n=len(logs()); cb('bg:th'); x=wait_for(n, lambda x: 'Tình hình' in txt(x)); check('nút Tình hình chi tiết', x is not None)
# tắt bằng nút bảng -> vẫn nghe /bat
n=len(logs()); cb('bg:tat'); x=wait_for(n, lambda x: 'Đã tắt Remote' in txt(x)); check('nút Tắt -> tắt + báo', x is not None and not req(APP+'/api/tg-lenh')['bat'])
WANT.add('editMessageText'); y=wait_for(n, lambda y: y['meth']=='editMessageText' and 'bg:bat' in (y['vals'].get('reply_markup') or '')); check('bảng đổi nút thành Bật Remote', y is not None); WANT.discard('editMessageText')
time.sleep(2); check('lúc tắt luồng vẫn nghe (chờ /bat)', req(APP+'/api/tg-lenh')['chay'])
n=len(logs()); msg('laptop gaming'); x=wait_for(n, lambda x: 'Remote đang tắt' in txt(x)); check('tắt: tin việc -> nhắc /bat, không làm', x is not None and not wait_for(n, lambda x: 'Đang viết brief' in txt(x), 3))
n=len(logs()); cb('chay:abcdef123'); time.sleep(1.5); a=[z for z in sent(n) if z['meth']=='answerCallbackQuery']; check('tắt: bấm nút việc -> báo đang tắt', a and 'đang tắt' in a[-1]['vals'].get('text',''), a)
n=len(logs()); msg('/bat'); x=wait_for(n, lambda x: 'Đã bật Remote' in txt(x)); check('/bat từ Telegram -> bật lại', x is not None and req(APP+'/api/tg-lenh')['bat'])
n=len(logs()); msg('/tinhhinh'); x=wait_for(n, lambda x: 'Tình hình' in txt(x)); check('bật lại: làm việc bình thường', x is not None)
n=len(logs()); msg('/bang'); x=wait_for(n, lambda x: '🎛 Poly Dựng Bài' in txt(x)); y=wait_for(n, lambda y: y['meth']=='unpinChatMessage'); check('/bang -> gửi bảng mới, bỏ ghim bảng cũ', x is not None and y is not None)
# tắt từ app khi chưa ai nghe: tin cũ bị bỏ
n=len(logs()); msg('/tat'); wait_for(n, lambda x: 'Đã tắt Remote' in txt(x))
r=req(APP+'/api/tg-lenh', {"bo_noi": True}); time.sleep(3); check('bỏ nối lúc tắt -> luồng dừng', not req(APP+'/api/tg-lenh')['chay'], r)
r=req(APP+'/api/jobs'); check('/api/jobs có remote', 'remote' in r, r.get('remote'))
r=req(APP+'/api/tg-lenh', {"bat": True}); check('bật lại -> mã mới (chưa nối)', not r['noi'] and len(r['ma'])==6, r)
req(APP+'/api/tg-lenh', {"bat": False})
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
