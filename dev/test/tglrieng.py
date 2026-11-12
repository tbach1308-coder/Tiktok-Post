# Bài gửi riêng từng người khi Remote ở nhóm (fen 12/11 20h04)
import json, time, sys, re
sys.argv=[sys.argv[0]]
exec(open('/home/claude/bug3/tgltest.py').read().split("n=len(logs())\nr=req(APP")[0])
G=-1003000000777
def cfg(): return json.load(open('/home/claude/bug3/tgl/config.json'))
def gm(text, uid, name, **kw):
    m={"message_id": int(time.time()*1000)%10**7, "date": int(time.time()), "chat": {"id": G, "type": "supergroup", "title": "POLY Dựng Bài"}, "from": {"id": uid, "first_name": name, "is_bot": False}, "text": text}
    m.update(kw); return push({"message": m})
def pm(text, uid, name): return push({"message": {"message_id": int(time.time()*1000)%10**7, "date": int(time.time()), "chat": {"id": uid, "type": "private", "first_name": name}, "from": {"id": uid, "first_name": name, "is_bot": False}, "text": text}})
def gcb(data, uid, chat=G, typ='supergroup'): return push({"callback_query": {"id": "cb%d" % time.time_ns(), "from": {"id": uid, "first_name": {111:'Hoài',222:'Quân',444:'Khoa'}.get(uid,'X')}, "message": {"message_id": 5, "chat": {"id": chat, "type": typ}}, "data": data}})
open('/home/claude/bug3/tglfake.admin','w').write('administrator')
req(APP+'/api/tg-lenh', {"bat": True}); ma=req(APP+'/api/tg-lenh', {"ma_nhom": True})['ma']
n=len(logs()); gm('/start@poly_dung_bai_bot '+ma, 111, 'Hoài'); x=wait_for(n, lambda x: 'gửi riêng cho người đó' in txt(x)); check('nối nhóm: nhắc mỗi người bấm Start bot', x is not None)
n=len(logs()); pm('/start', 222, 'Quân'); x=wait_for(n, lambda x: 'Đã nối' in txt(x) and x['vals'].get('chat_id')=='222'); check('Quân bấm Start riêng: đăng ký nhận bài', x is not None and '222' in (cfg().get('tg_rieng') or {}))
n=len(logs()); pm('/start', 333, 'Lạ'); time.sleep(2.5); check('người ngoài nhóm nhắn riêng: bỏ qua', not [y for y in sent(n) if y['vals'].get('chat_id')=='333'] and '333' not in (cfg().get('tg_rieng') or {}))
n=len(logs()); pm('alo', 222, 'Quân'); x=wait_for(n, lambda x: 'Ra lệnh trong nhóm' in txt(x), 5); check('Quân nhắn lệnh ở chat riêng: nhắc ra lệnh trong nhóm', x is not None)
# Quân viết brief + Chạy trong nhóm
n=len(logs()); gm('bài: laptop cho dân kiến trúc', 222, 'Quân')
x=wait_for(n, lambda x: 'chay:' in json.dumps(x['vals'].get('reply_markup') or ''), 40)
jb=re.search(r'chay:([\w-]+)', x['vals'].get('reply_markup') or '').group(1) if x else None
check('brief viết xong trong nhóm, có nút Chạy', jb is not None)
n=len(logs()); gcb('chay:'+jb, 222); x=wait_for(n, lambda x: 'Đang dựng' in txt(x) or 'Xếp hàng' in txt(x), 20)
check('Chạy: báo trong nhóm sẽ gửi riêng cho Quân', x is not None and 'gửi riêng cho Quân' in txt(x) and x['vals'].get('chat_id')==str(G), x and txt(x))
jid=None
for _ in range(60):
    for j in req(APP+'/api/jobs')['jobs']:
        if (j.get('tieu_de') or '') and j.get('created',0) > time.time()-200 and not j.get('loai'):
            jj=json.load(open('/home/claude/bug3/tgl/jobs/%s/job.json' % j['id'], encoding='utf-8'))
            if (jj.get('tg_nguoi') or {}).get('id')==222: jid=j['id']
    if jid: break
    time.sleep(1)
check('bài ghi người nhận = Quân', jid is not None)
n0=len(logs())
for _ in range(120):
    st=req(APP+'/api/job/'+jid)['job']['status']
    if st in ('xong','loi'): break
    time.sleep(1)
x=wait_for(n0, lambda x: x['vals'].get('chat_id')=='222' and ('xong' in txt(x).lower() or x['meth']=='sendPhoto'), 40)
check('bài xong: báo riêng cho Quân', x is not None, st)
time.sleep(1); check('bài xong: không báo vào nhóm, không vào nhóm nhận slide', not [y for y in sent(n0) if y['vals'].get('chat_id') in (str(G), '123456') and jid in json.dumps(y['vals'])], [ (y['meth'], y['vals'].get('chat_id')) for y in sent(n0)][:6])
n=len(logs()); gcb('xem:'+jid, 222, chat=222, typ='private'); x=wait_for(n, lambda x: x['meth']=='sendMediaGroup' and x['vals'].get('chat_id')=='222', 30)
check('Quân bấm 📷 ở chat riêng: album về chat riêng', x is not None)
time.sleep(61-0)  if False else None
n=len(logs()); gcb('xem:'+jid, 111); x=wait_for(n, lambda x: x['meth']=='sendMediaGroup' and x['vals'].get('chat_id')=='111', 70)
check('fen bấm 📷 trong nhóm: album về chat riêng của fen', x is not None and not [y for y in sent(n) if y['meth']=='sendMediaGroup' and y['vals'].get('chat_id')==str(G)])
n=len(logs()); gcb('xem:'+jid, 444); x=wait_for(n, lambda x: 'Start' in txt(x) and x['vals'].get('chat_id')==str(G), 10)
check('người chưa bấm Start bấm 📷: nhắc trong nhóm', x is not None)
s=req(APP+'/api/job/%s/telegram' % jid, {}); x=wait_for(n, lambda x: x['meth']=='sendMediaGroup' and x['vals'].get('chat_id')=='222', 30)
check('app bấm Gửi Telegram bài của Quân: gửi riêng Quân', x is not None, s)
r=req(APP+'/api/chung'); check('Máy khác: danh sách người nhận có Quân', any(p['ten']=='Quân' for p in r.get('nguoi',[])), r.get('nguoi'))
req(APP+'/api/tg-lenh', {"bo_noi": True})
import os; os.remove('/home/claude/bug3/tglfake.admin')
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
