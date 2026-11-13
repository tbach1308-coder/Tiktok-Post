cd /home/claude/bug3
python3 - <<'PY'
import json
p='/home/claude/bug3/tgl/config.json'
c=json.load(open(p)); c.update(tg_lenh_offset=0, tg_lenh=True, tg_lenh_chat=None, tg_lenh_nguoi=None, tg_lenh_nhom=False, tg_rieng={}, tg_lenh_quyen=[], chung_bat=False, chung_may={})
json.dump(c, open(p,'w'), ensure_ascii=False, indent=1)
PY
kill $(cat tgl/srv.pid) 2>/dev/null; kill $(cat tglfake.pid) 2>/dev/null; sleep 1; : > tglfake.log
(nohup python3 tglfake.py > tglfake.out 2>&1 & echo $! > tglfake.pid)
cd tgl && (nohup python3 server.py > srv.out 2>&1 & echo $! > srv.pid); sleep 4
