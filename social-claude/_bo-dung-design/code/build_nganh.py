import sys, subprocess
SP = '/tmp/claude-0/-home-claude/198efd24-7826-530f-b023-69f2a6cd32fb/scratchpad/'
ver = sys.argv[1]
only = sys.argv[2] if len(sys.argv) > 2 else None
head = open('/mnt/user-data/outputs/PolySocial-Laptop/make-mac-vs-win.jsx', encoding='utf-8').read().split('\n')[:223]
head[1] = '// POLY STORE - nganh cai app gi 24-10 (' + ver + ')'
t5 = open(SP + 'top5_body.jsx', encoding='utf-8').read().split('\n')
helpers = t5[7:186] + t5[230:243]   # FS..litKey, headN, RANKC/placeAt
pre = '''
var OUT5 = new Folder("E:/Social Claude/Laptop/T10_NganhCaiAppGi_24-10");
if (!OUT5.exists) OUT5.create();
var TN = OUT5.fsName + "/tai-nguyen/";
var LOGF = new Folder(OUT5.fsName + "/log"); if (!LOGF.exists) LOGF.create();
function plog(name, s) { var f = new File(LOGF.fsName + "/" + name); f.encoding = "UTF-8"; f.open("w"); f.write(s); f.close(); }
'''
pre += ('var ONLY_M = [' + only + '];\n' if only else '') + 'var LOGN = "' + ver + '.log";\n'
body = pre + '\n'.join(helpers) + '\n' + open(SP + 'nganh_slides.jsx', encoding='utf-8').read()
def esc(s):
    out = []
    for ch in s:
        o = ord(ch)
        if o < 128: out.append(ch)
        elif o > 0xFFFF:
            o -= 0x10000; out.append('\\u%04X\\u%04X' % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
        else: out.append('\\u%04X' % o)
    return ''.join(out)
src = '\n'.join(head) + '\n' + esc(body)
fn = '/mnt/user-data/outputs/PolySocial-Laptop/make-nganh-cai-app-gi-' + ver + '.jsx'
open(fn, 'w', encoding='ascii').write(src)
r = subprocess.run(['node', '-e', 'const s=require("fs").readFileSync(process.argv[1],"utf8");new Function(s.replace(/^#.*$/mg,""));console.log("syntax ok")', fn], capture_output=True, text=True)
print(fn, len(src), r.stdout.strip(), r.stderr.strip()[:500])
