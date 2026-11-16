# Tách nền bằng PHOTOSHOP (Select Subject) cho 1 hay nhiều ảnh, chạy qua hàng chờ _tu-chay rồi chờ xong.
# Dùng (máy shop):  python tach_nen_ps.py "<anh-vao-1>" "<anh-ra-1.png>" ["<anh-vao-2>" "<anh-ra-2.png>" ...]
# Ra PNG nền trong suốt, đã cắt sát máy. Đặt lên nền studio:  python prep/tach_nen.py anh-ra.png khung.png  (tự nhận ảnh có nền trong)
import sys as _s
for _f in (_s.stdout, _s.stderr):
    try: _f.reconfigure(encoding='utf-8', errors='replace')
    except Exception: pass
import sys, os, time, json
Q = os.environ.get("POLY_TU_CHAY", r"C:\Users\Dao\Pictures\PolySocial\_tu-chay")
a = sys.argv[1:]
if len(a) < 2 or len(a) % 2: sys.exit('Can cap: anh-vao anh-ra ...')
cap = [(os.path.abspath(a[i]).replace('\\', '/'), os.path.abspath(a[i + 1]).replace('\\', '/')) for i in range(0, len(a), 2)]
for _, o in cap:
    if os.path.exists(o): os.remove(o)
js = '''// tach nen bang Select Subject
var CAP = %s, LOG = [], LOGF = %s;
var oldD = app.displayDialogs; app.displayDialogs = DialogModes.NO;
for (var i = 0; i < CAP.length; i++) {
  try {
    var d = app.open(new File(CAP[i][0]));
    if (d.mode != DocumentMode.RGB) d.changeMode(ChangeMode.RGB);
    var ad = new ActionDescriptor(); ad.putBoolean(stringIDToTypeID("sampleAllLayers"), false);
    executeAction(stringIDToTypeID("autoCutout"), ad, DialogModes.NO);
    executeAction(charIDToTypeID("CpTL"), undefined, DialogModes.NO);
    var keep = d.activeLayer;
    for (var k = d.layers.length - 1; k >= 0; k--) if (d.layers[k] != keep) d.layers[k].remove();
    d.trim(TrimType.TRANSPARENT, true, true, true, true);
    var o = new PNGSaveOptions(); o.compression = 6;
    d.saveAs(new File(CAP[i][1]), o, true, Extension.LOWERCASE);
    d.close(SaveOptions.DONOTSAVECHANGES);
    LOG.push("ok " + CAP[i][1]);
  } catch (e) { LOG.push("LOI " + CAP[i][0] + ": " + e.message); try { app.activeDocument.close(SaveOptions.DONOTSAVECHANGES); } catch (e2) {} }
}
app.displayDialogs = oldD;
var lf = new File(LOGF); lf.encoding = "UTF-8"; lf.open("w"); lf.write(LOG.join("\\n")); lf.close();
''' % (json.dumps([[i, o] for i, o in cap]), json.dumps(cap[0][1] + '.log'))
ten = 'tach-nen-%d.jsx' % int(time.time())
tmp = os.path.join(Q, ten + '.tmp')
open(tmp, 'w', encoding='ascii', errors='backslashreplace').write(js.encode('ascii', 'backslashreplace').decode('ascii'))
os.replace(tmp, os.path.join(Q, ten))
print('Da gui Photoshop:', ten, '-', len(cap), 'anh')
t0 = time.time()
while time.time() - t0 < 60 + 30 * len(cap):
    time.sleep(2)
    if os.path.exists(cap[0][1] + '.log'):
        time.sleep(1); break
for i, o in cap: print(('OK  ' if os.path.exists(o) else 'THIEU ') + o)
if os.path.exists(cap[0][1] + '.log'): print(open(cap[0][1] + '.log', encoding='utf-8').read()); os.remove(cap[0][1] + '.log')
sys.exit(0 if all(os.path.exists(o) for _, o in cap) else 1)
