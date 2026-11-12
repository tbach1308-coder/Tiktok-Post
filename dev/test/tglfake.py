# Telegram giả cho chat lệnh Remote: hàng tin chờ (POST /_push), getUpdates long-poll ngắn, ghi mọi lệnh vào tglfake.log
import json, re, os, time, threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs
LOG = '/home/claude/bug3/tglfake.log'
Q = []; L = threading.Lock(); MID = [1000]; UID = [500]
PNG = bytes.fromhex('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360000002000154a24f5d0000000049454e44ae426082')
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def send_j(self, o, code=200):
        b = json.dumps(o, ensure_ascii=False).encode(); self.send_response(code); self.send_header('Content-Type', 'application/json'); self.send_header('Content-Length', str(len(b))); self.end_headers(); self.wfile.write(b)
    def do_GET(self):
        if self.path.startswith('/file/bot'):
            self.send_response(200); self.send_header('Content-Length', str(len(PNG))); self.end_headers(); self.wfile.write(PNG); return
        if self.path == '/_q':
            return self.send_j(Q)
        self.send_j({"ok": False}, 404)
    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0); body = self.rfile.read(n)
        if self.path == '/_push':
            u = json.loads(body.decode())
            with L:
                UID[0] += 1; u['update_id'] = UID[0]; Q.append(u)
            return self.send_j({"ok": True, "update_id": UID[0]})
        m = re.match(r'/bot([^/]+)/(\w+)', self.path); tok, meth = m.groups()
        ct = self.headers.get('Content-Type') or ''
        vals = {k: v[0] for k, v in parse_qs(body.decode('utf-8')).items()} if ct.startswith('application/x-www-form') else {'_multipart': len(body)}
        if 'multipart' in ct:
            for mm in re.finditer(rb'name="(\w+)"\r\n\r\n(.*?)\r\n--', body, re.S):
                try: vals[mm.group(1).decode()] = mm.group(2).decode('utf-8')
                except Exception: pass
        open(LOG, 'a').write(json.dumps({'t': round(time.time(), 2), 'meth': meth, 'vals': vals}, ensure_ascii=False) + '\n')
        if meth == 'getUpdates':
            off = int(vals.get('offset') or 0); to = min(float(vals.get('timeout') or 0), 1.5); bd = time.time()
            while True:
                with L:
                    r = [u for u in Q if u['update_id'] >= off]
                    if off:
                        Q[:] = [u for u in Q if u['update_id'] >= off]
                if r or time.time() - bd >= to: break
                time.sleep(0.1)
            return self.send_j({"ok": True, "result": r})
        if meth == 'getMe': return self.send_j({"ok": True, "result": {"username": "poly_lenh_bot"}})
        if meth == 'getChatMember': return self.send_j({"ok": True, "result": {"status": open('/home/claude/bug3/tglfake.admin').read().strip() if os.path.exists('/home/claude/bug3/tglfake.admin') else 'member'}})
        if meth == 'getFile': return self.send_j({"ok": True, "result": {"file_path": "photos/f_%s.png" % vals.get('file_id')}})
        if meth == 'sendMediaGroup' and os.path.exists('/home/claude/bug3/tglfake.slow'): time.sleep(6)
        if meth in ('sendMessage', 'sendPhoto', 'sendMediaGroup'):
            if meth == 'sendMessage' and len(vals.get('text') or '') > 4096: return self.send_j({"ok": False, "description": "Bad Request: message is too long"}, 400)
            MID[0] += 1
            open(LOG, 'a').write(json.dumps({'t': round(time.time(), 2), 'meth': '_mid', 'vals': {'mid': MID[0], 'text': ''}}) + '\n')
            return self.send_j({"ok": True, "result": {"message_id": MID[0]}})
        return self.send_j({"ok": True, "result": True})
ThreadingHTTPServer(('127.0.0.1', 8798), H).serve_forever()
