import sys
def esc(s):
    out = []
    for ch in s:
        o = ord(ch)
        if o < 128: out.append(ch)
        elif o <= 0xFFFF: out.append('\\u%04X' % o)
        else:
            o -= 0x10000; out.append('\\u%04X\\u%04X' % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
    return ''.join(out)
dst, pre = sys.argv[1], sys.argv[2]
P = '/home/claude/work/p14/'
src = open(P + 'head14.part.jsx').read() + open(P + 'helpers14.part.jsx').read() + open(P + 'body14.part.jsx').read()
open(P + 'post14.src.jsx', 'w').write(src)
open(dst, 'w').write(esc(src.replace('#target photoshop\n', '#target photoshop\n' + pre, 1)))
print('ok', dst, len(src))
