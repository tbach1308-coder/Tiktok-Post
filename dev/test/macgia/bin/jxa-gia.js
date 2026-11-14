// "JavaScript for Automation" giả cho test (osascript -l JavaScript): chạy script JXA bằng node, cầu ObjC tối thiểu
// ($.NSString.stringWithContentsOfFileEncodingError, $.NSFileManager.defaultManager.contentsOfDirectoryAtPathError, ObjC.unwrap) theo đúng
// kiểu JXA: hàm ObjC trả đối tượng bọc có .js / .isNil(), không có thì trả nil bọc ($()).
const fs = require('fs');
const nil = () => ({ isNil: () => true, js: undefined });
const boc = v => ({ isNil: () => false, js: v });
const $ = () => nil();
$.NSUTF8StringEncoding = 4;
$.NSString = { stringWithContentsOfFileEncodingError: p => { try { return boc(fs.readFileSync(p, 'utf8')); } catch (e) { return nil(); } } };
$.NSFileManager = { defaultManager: { contentsOfDirectoryAtPathError: p => { try { return boc(fs.readdirSync(p).map(x => boc(x))); } catch (e) { return nil(); } } } };
const ObjC = { unwrap: o => (o && o.js !== undefined ? o.js : o) };
const src = fs.readFileSync(0, 'utf8');
const run = new Function('$', 'ObjC', src + '\nreturn run;')($, ObjC);
const r = run(process.argv.slice(2));
if (r !== undefined && r !== '') process.stdout.write(String(r) + '\n');
