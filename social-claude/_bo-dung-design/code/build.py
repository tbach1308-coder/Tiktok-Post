# Ghép script Photoshop cho 1 bài carousel (dùng chung mọi bài).
# Cách chạy (trong container, đặt cả thư mục bo-dung-design ở 1 chỗ):
#   python3 code/build.py slides/loivat_slides.jsx T10_3LoiVatLaptop_26-10 make-3-loi-vat-laptop v1 [1,2,4]
#   -> ra file out/make-3-loi-vat-laptop-v1.jsx. Ghi file đó vào C:\Users\Dao\Pictures\PolySocial\_tu-chay\ là Photoshop TỰ CHẠY (không cần bấm).
# Đầu file = 223 dòng đầu make-mac-vs-win.jsx (font, màu C, FS, text/rect/fx/newDoc…)
# + helper top5_body.jsx (dòng 8–186 và 231–243: pillC, fxGlow, glass, hookPill, photoFrame, shot, save5, placeAt…)
# + file slides của bài (t1..tN, ONLY, vòng chạy, ghi log).
# Ký tự ngoài ASCII được đổi sang \uXXXX (Photoshop ExtendScript đọc file ASCII an toàn hơn).
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, os, subprocess
K = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
slides, folder, name, ver = sys.argv[1:5]
only = sys.argv[5] if len(sys.argv) > 5 else None
kenh = 'iPad' if folder.lower().find('ipad') >= 0 else 'Laptop'
head = open(os.path.join(K, 'code/make-mac-vs-win.jsx'), encoding='utf-8').read().split('\n')[:223]
head[1] = '// POLY STORE - ' + name + ' (' + ver + ')'
t5 = open(os.path.join(K, 'code/top5_body.jsx'), encoding='utf-8').read().split('\n')
helpers = t5[7:186] + t5[230:243]
pre = '''
var OUT5 = new Folder("E:/Social Claude/%s/%s");
if (!OUT5.exists) OUT5.create();
var TN = OUT5.fsName + "/tai-nguyen/";
var LOGF = new Folder(OUT5.fsName + "/log"); if (!LOGF.exists) LOGF.create();
function plog(name, s) { var f = new File(LOGF.fsName + "/" + name); f.encoding = "UTF-8"; f.open("w"); f.write(s); f.close(); }
''' % (kenh, folder)
pre += ('var ONLY_M = [' + only + '];\n' if only else '') + 'var LOGN = "' + ver + '.log";\n'
sl = open(os.path.join(K, slides), encoding='utf-8').read()
# không đóng file fen đang mở: chỉ đóng file do script tạo
sl = sl.replace('for (var di = app.documents.length - 1; di >= 0; di--) app.documents[di].close(SaveOptions.DONOTSAVECHANGES);', 'var KEEP = app.documents.length;')
sl = sl.replace('while (app.documents.length) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);', 'while (app.documents.length > KEEP) app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);')
body = pre + '\n'.join(helpers) + '\n' + sl
def esc(s):
    out = []
    for ch in s:
        o = ord(ch)
        if o < 128: out.append(ch)
        elif o > 0xFFFF:
            o -= 0x10000; out.append('\\u%04X\\u%04X' % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
        else: out.append('\\u%04X' % o)
    return ''.join(out)
src = esc('\n'.join(head)) + '\n' + esc(body)
os.makedirs(os.path.join(K, 'out'), exist_ok=True)
fn = os.path.join(K, 'out', name + '-' + ver + '.jsx')
open(fn, 'w', encoding='ascii').write(src)
try:
    r = subprocess.run(['node', '-e', 'const s=require("fs").readFileSync(process.argv[1],"utf8");new Function(s.replace(/^#.*$/mg,""));console.log("syntax ok")', fn], capture_output=True, text=True)
    print(fn, len(src), r.stdout.strip(), r.stderr.strip()[:500])
    if r.returncode: sys.exit(1)
except FileNotFoundError:
    print(fn, len(src), '(chua cai Node.js nen bo qua kiem cu phap)')
import re as _re
_n = len(only.split(',')) if only else len(_re.search(r'var FN = \[([^\]]*)\]', sl).group(1).split(',')) - 1
print('Photoshop dung %d slide, cho khoang %d giay roi xem log/%s.log' % (_n, 12 * _n + 10, ver))
