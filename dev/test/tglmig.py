import json, time, sys
sys.argv=[sys.argv[0]]
exec(open('/home/claude/bug3/tgltest.py').read().split("n=len(logs())\nr=req(APP")[0])
def cfg(): return json.load(open('/home/claude/bug3/tgl/config.json'))
req(APP+'/api/tg-lenh', {"bat": True}); ma=req(APP+'/api/tg-lenh', {"ma_nhom": True})['ma']
G=-5317425899
push({"message": {"message_id": 1, "date": int(time.time()), "chat": {"id": G, "type": "group", "title": "POLY Dựng Bài"}, "from": {"id": 111, "first_name": "Hoài", "is_bot": False}, "text": "/start@poly_dung_bai_bot "+ma}})
time.sleep(3); check('nối nhóm thường', cfg().get('tg_lenh_chat')==G, cfg().get('tg_lenh_chat'))
push({"message": {"message_id": 2, "date": int(time.time()), "chat": {"id": G, "type": "group", "title": "POLY Dựng Bài"}, "from": {"id": 111, "first_name": "Hoài", "is_bot": False}, "migrate_to_chat_id": -1003000000001}})
time.sleep(3); check('nhóm lên supergroup: theo mã mới', cfg().get('tg_lenh_chat')==-1003000000001, cfg().get('tg_lenh_chat'))
n=len(logs())
push({"message": {"message_id": 3, "date": int(time.time()), "chat": {"id": -1003000000001, "type": "supergroup", "title": "POLY Dựng Bài"}, "from": {"id": 222, "first_name": "Quân", "is_bot": False}, "text": "/tinhhinh"}})
x=wait_for(n, lambda x: 'Tình hình' in txt(x)); check('lệnh trong supergroup mới: trả lời', x is not None and x['vals'].get('chat_id')=='-1003000000001', x and x['vals'].get('chat_id'))
req(APP+'/api/tg-lenh', {"bo_noi": True})
print('KẾT QUẢ: %d đạt, %d lỗi' % tuple(ok))
