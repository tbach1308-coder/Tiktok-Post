# 💡 Ngày nào cũng có gợi ý (fen 16/11 11h45, chọn "Kho trống thì gợi ý chủ đề theo mùa" + "Mỗi sáng tự cập nhật kho" + "Fen thêm link kho iPad"):
# lệnh gợi ý đòi mỗi kênh >= 4 gợi ý (kho trống thì theo mùa, loai "mua"), app đọc gợi ý theo mùa (không máy / giá), tự cập nhật kho 1 lần / ngày từ 8h.
import json, os, sys, time
T = '/home/claude/bug3/tgl'
os.chdir(T); sys.path.insert(0, T); sys.argv = ['x']
import server as S
ok = bad = 0
def check(n, c, x=None):
    global ok, bad
    ok += bool(c); bad += (not c)
    print(('✓ ' if c else '✗ ') + n + ('' if c else ' ' + json.dumps(x, ensure_ascii=False, default=str)[:400]))
for f in (S.GOI_Y_FILE, S.GOI_Y_TU, S.KHO_WEB_F, S.KHO_SNAP):
    if os.path.isfile(f): os.replace(f, '/tmp/_bo_%d_%s' % (time.time(), os.path.basename(f)))
# 1) lệnh: kho chỉ có laptop -> iPad "(không có)" + yêu cầu theo mùa
S.write_json(S.KHO_WEB_F, {"luc": S.now(), "may": [{"kenh": "laptop", "ten": "Dell Precision 5760 Xeon", "so": 4, "gia": "21,5 triệu"}]})
cap = {}
S.start_run = lambda job, prompt, *a, **k: cap.update(p=prompt, job=job)
S.resolve_claude = lambda: "claude"
S.goi_y_quet(web=True)
p = cap.get("p", "")
check('lệnh gợi ý (kho qua Chrome): kho iPad "(không có)", đòi mỗi kênh ít nhất 4 gợi ý, kho trống bù chủ đề theo mùa ("loai": "mua"), có dịp Noel',
      'kênh iPad (tên · số máy · giá bán):\n(không có)' in p and 'ÍT NHẤT 4 GỢI Ý' in p and '"loai": "mua"' in p and 'Noel' in p and 'GOI_Y_LOI' not in p, p[-900:])
cap.clear(); S.CFG["kho_cach"] = "poly"
S.goi_y_quet(web=False)
check('lệnh gợi ý (connector POLY) cũng đòi theo mùa', 'ÍT NHẤT 4 GỢI Ý' in cap.get("p", ""), cap.get("p", "")[-400:])
S.CFG["kho_cach"] = "web"
# 2) đọc kết quả có gợi ý theo mùa
jid = cap["job"]["id"]
j = S.load_job(jid) or cap["job"]
j["runs"] = [{"n": 1, "exit": 0}]; j["status"] = "xong"; S.save_job(j)
kq = {"goi_y": [{"kenh": "laptop", "may": "Dell Precision 5760 Xeon", "gia": "21,5 triệu", "chu_de": "Máy trạm 17 inch tầm 22 triệu", "ly_do": "4 máy"},
                {"kenh": "ipad", "may": "", "gia": "", "chu_de": "iPad nào làm quà Noel cho học sinh?", "ly_do": "Kho chưa có iPad · mùa Noel", "loai": "mua"},
                {"kenh": "ipad", "may": "iPad nào đó bịa", "gia": "9 triệu", "chu_de": "Mẹo giữ pin iPad mùa lạnh", "ly_do": "chủ đề chung", "loai": "mua"}]}
with open(os.path.join(S.job_dir(jid), "stream-1.jsonl"), "w", encoding="utf-8") as fh:
    fh.write(json.dumps({"type": "result", "result": "xong\nGOI_Y_JSON " + json.dumps(kq, ensure_ascii=False)}, ensure_ascii=False) + "\n")
cu = S.read_json(S.GOI_Y_FILE, {}); cu["web_may"] = [{"kenh": "laptop", "ten": "Dell Precision 5760 Xeon", "so": 4, "gia": "21,5 triệu"}]; S.write_json(S.GOI_Y_FILE, cu)
S.goi_y_xong(jid)
d = S.goi_y_doc()
ip = [x for x in d["ds"] if x["kenh"] == "ipad"]
check('gợi ý theo mùa: đánh dấu mua, không gắn máy / giá (bỏ máy bịa), không ghi vào danh sách máy mới về',
      len(ip) == 2 and all(x["mua"] and x["may"] == "" and x["gia"] == "" for x in ip) and not [x for x in d["ds"] if x["kenh"] == "laptop"][0]["mua"]
      and "" not in S.read_json(S.KHO_SNAP, {}) and not any("bịa" in k for k in S.read_json(S.KHO_SNAP, {})), d["ds"])
check('máy dùng chung thấy cờ theo mùa', all(x.get("mua") for x in S.goi_y_khach()["ds"] if x["kenh"] == "ipad"))
# 3) tự cập nhật mỗi sáng
goi = []
S.goi_y_quet = lambda web=False: goi.append(1) or {}
S.KHO_TU_GIO = 0
S.CFG.pop("kho_tu_sang", None)      # goiymuaui.js có thể đã tắt ô 🌅 trong config máy thử
S.write_json(S.GOI_Y_FILE, dict(S.read_json(S.GOI_Y_FILE, {}), luc=S.now() - 2 * 86400, dang=False))
S.APP_MO = time.time()
r0 = S.goi_y_tu_sang()
check('mỗi sáng: vừa mở app (chưa đủ 4 phút) thì chờ, chưa cập nhật (24/11: Chrome / tiện ích chưa sẵn sàng)', not r0 and not goi, [r0, goi])
S.APP_MO = time.time() - 300
r1 = S.goi_y_tu_sang(); r2 = S.goi_y_tu_sang()
check('mỗi sáng: hôm nay chưa cập nhật -> tự cập nhật đúng 1 lần (ghi goi-y-tu.json)', r1 and not r2 and len(goi) == 1 and S.read_json(S.GOI_Y_TU, {}).get("ngay") == time.strftime("%Y-%m-%d"), [r1, r2, goi])
os.remove(S.GOI_Y_TU); goi.clear()
S.write_json(S.GOI_Y_FILE, dict(S.read_json(S.GOI_Y_FILE, {}), luc=S.now()))
check('hôm nay fen đã bấm Cập nhật kho -> không tự cập nhật nữa', not S.goi_y_tu_sang() and not goi)
S.write_json(S.GOI_Y_FILE, dict(S.read_json(S.GOI_Y_FILE, {}), luc=S.now() - 86400 * 2))
S.CFG["kho_tu_sang"] = False
check('tắt "Mỗi sáng tự cập nhật" -> không tự cập nhật', not S.goi_y_tu_sang() and not goi)
S.CFG.pop("kho_tu_sang", None)
S.KHO_TU_GIO = 24
check('trước 8h sáng -> chưa tự cập nhật', not S.goi_y_tu_sang() and not goi)
S.KHO_TU_GIO = 0
def loi(web=False): raise ValueError("CHON_HS|Chọn hồ sơ Chrome đã đăng nhập POLY")
S.goi_y_quet = loi
r = S.goi_y_tu_sang(); r2 = S.goi_y_tu_sang()
d = S.read_json(S.GOI_Y_FILE, {})
check('tự cập nhật lỗi: ghi lỗi dễ hiểu, không thử lại trong ngày', r and not r2 and "Tự cập nhật sáng nay chưa được: Chọn hồ sơ Chrome" in d.get("loi", ""), d.get("loi"))
# 4) cài đặt qua API
for f in (S.GOI_Y_TU,):
    if os.path.isfile(f): os.remove(f)
print("\n%d đạt, %d lỗi" % (ok, bad)); sys.exit(1 if bad else 0)
