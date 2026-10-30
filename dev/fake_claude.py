import sys, json, time, os
try:
    from PIL import Image
except ImportError:
    Image = None
a = sys.argv[1:]
HERE = os.path.dirname(os.path.abspath(__file__))
if '--version' in a: print('2.1.311 (Claude Code)'); sys.exit(0)
if a[:2] == ['auth', 'status']:
    ok = not os.path.exists(os.path.join(HERE, 'NOLOGIN'))
    em = open(os.path.join(HERE, 'EMAIL')).read().strip() if os.path.exists(os.path.join(HERE, 'EMAIL')) else ''
    print(json.dumps(dict({"loggedIn": ok, "authMethod": "claude.ai" if ok else "none"}, **({"email": em, "subscriptionType": "max"} if ok and em else {}))))
    sys.exit(0 if ok else 1)
json.dump(a, open(os.path.join(HERE, 'last-args.json'), 'w'))   # để test xem app truyền cờ gì
prompt = sys.stdin.read()
sid = a[a.index('--resume') + 1] if '--resume' in a else 'sess-' + str(int(time.time() * 1000))
def out(o, d=0.12): print(json.dumps(o, ensure_ascii=False), flush=True); time.sleep(d)
out({"type": "system", "subtype": "init", "session_id": sid, "model": "claude-opus-5-5"})
if 'LOI' in prompt:
    out({"type": "assistant", "message": {"content": [{"type": "text", "text": "Mình dựng bài kênh iPad."}]}})
    sys.stderr.write("Not logged in · Please run /login\n"); sys.exit(1)
if 'CHAT SỬA BRIEF' in prompt:   # ô chat sửa brief
    import re as _re
    f = _re.search(r'vào đúng file "([^"]+)"', prompt).group(1)
    tin = prompt.split('Tin mới của fen:')[1].split('\n')[0]
    cu = prompt.split('<<<\n')[1].split('\n>>>')[0]
    time.sleep(1.5)
    if 'ngắn' in tin:
        moi = cu.split('\n', 1); open(f, 'w', encoding='utf-8').write('BÌA NGẮN GỌN\n' + (moi[1] if len(moi) > 1 else ''))
        out({"type": "result", "subtype": "success", "is_error": False, "result": "Đã rút bìa còn 3 chữ, giữ nguyên các slide khác.", "session_id": sid, "duration_ms": 1500, "num_turns": 2, "total_cost_usd": 0.02})
    else:
        out({"type": "result", "subtype": "success", "is_error": False, "result": "Slide 4 hợp rồi. Nên thêm 1 slide so pin để người xem kể máy đang dùng.", "session_id": sid, "duration_ms": 1500, "num_turns": 1, "total_cost_usd": 0.01})
    sys.exit(0)
if 'Viết BRIEF TỪNG SLIDE' in prompt:   # nút "Viết brief" của app
    import re as _re
    f = _re.search(r'Ghi brief ra đúng file "([^"]+)"', prompt).group(1)
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "g1", "name": "Glob", "input": {"pattern": "T*_*"}}]}}, 1.0)
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "g2", "name": "Read", "input": {"file_path": "E:/Social Claude/_bo-dung-design/noi-dung/quy-tac-xay-kenh.md"}}]}}, 1.0)
    if 'CHAMBRIEF' in prompt: time.sleep(600)
    if 'mua laptop cũ' in prompt and 'làm lại' not in prompt.split('Chủ đề fen gõ:')[1].split('\n')[0]:
        out({"type": "result", "subtype": "success", "is_error": False, "result": "TRUNG: Mua laptop cũ: 4 thứ phải kiểm tra (19/10)\nGOI_Y: Máy chậm như rùa? Thủ phạm thường là ổ cứng\nGOI_Y: Cắm sạc cả ngày có chai pin?\nGOI_Y: Theo nghề: laptop cho kế toán", "session_id": sid, "duration_ms": 2000, "num_turns": 4, "total_cost_usd": 0.1})
        sys.exit(0)
    open(f, 'w', encoding='utf-8').write("MÁY TRẠM CHO KIẾN TRÚC\ntầm 20–30 triệu lấy con nào?\nRevit, Lumion chạy mượt\n👉 Con đầu tiên?\n\nSlide 2 – THINKPAD P1 GEN 5\ni7-12800H, RTX A2000 8GB, RAM 32GB.\nHợp với Revit, AutoCAD, Lumion nhẹ.\n👉 Cần màn to hơn?\n\nSlide 7 – Cuối (chỉ chữ)\nBạn vẽ phần mềm gì, ngân sách bao nhiêu?\nComment, Poly chọn máy giúp 👇\n")
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "g3", "name": "Write", "input": {"file_path": f, "content": "..."}}]}})
    out({"type": "result", "subtype": "success", "is_error": False, "result": "Brief 7 slide, góc chọn máy trạm theo phần mềm kiến trúc.\nTRUNG: Top 5 máy trạm 21/10 → bỏ dạng top 5, làm theo phần mềm\nHOI_FEN: Có ghi giá từng máy? | Không ghi giá | Ghi giá Poly", "session_id": sid, "duration_ms": 2000, "num_turns": 6, "total_cost_usd": 0.3})
    sys.exit(0)
if 'Viết caption TikTok' in prompt:   # nút "Viết caption" của app
    import re as _re
    f = _re.search(r"^Thư mục bài: (.+)$", prompt, _re.M).group(1).strip()
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "x1", "name": "Bash", "input": {"command": "python xem_nhanh.py", "description": "Ghép slide thành 1 ảnh để xem"}}]}})
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "x2", "name": "Write", "input": {"file_path": f + "/caption.txt", "content": "..."}}]}})
    open(os.path.join(f, 'caption.txt'), 'w', encoding='utf-8').write("Laptop có 5 thao tác này chưa? 💻 #meolaptop #thuthuatmaytinh #polystore\nComment ghim: Bạn hay dùng thao tác nào nhất?\n")
    out({"type": "result", "subtype": "success", "is_error": False, "result": "Đã viết caption: Laptop có 5 thao tác này chưa? 💻 #meolaptop #thuthuatmaytinh #polystore\nTHU_MUC_BAI=" + f, "session_id": sid, "duration_ms": 2000, "num_turns": 4, "total_cost_usd": 0.1})
    sys.exit(0)
out({"type": "assistant", "message": {"content": [{"type": "text", "text": "Mình dựng bài Top 5 laptop dưới 25 triệu, kênh laptop. Chưa có ảnh shop cho slide 4 (ZBook Firefly), dùng tạm ảnh HP Icecat, fen có thì gửi."}]}})
steps = ["Biên tập brief + kiểm thông tin (song song)", "Kê ảnh từng slide, lấy ảnh PSREF cỡ gốc", "Tách nền bằng Photoshop, soi viền", "Dò trùng ảnh với bài cũ", "Viết slides.jsx, build v1, chạy Photoshop", "Soi bố cục + agent thiết kế + agent duyệt", "Sửa lỗi duyệt, giao bảng final"]
NT = 'KHONGTASK' in prompt
for i, t in enumerate([] if NT else steps):
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "tc%d" % i, "name": "TaskCreate", "input": {"subject": t}}]}}, 0.02)
    out({"type": "user", "message": {"content": [{"type": "tool_result", "tool_use_id": "tc%d" % i, "content": "Task #%d created successfully" % (i + 1)}]}}, 0.02)
def upd(n, s):
    if NT: return
    out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "u%d%s" % (n, s), "name": "TaskUpdate", "input": {"taskId": str(n), "status": s}}]}}, 0.05)
upd(1, 'in_progress')
out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "ag1", "name": "Agent", "input": {"description": "Biên tập brief", "subagent_type": "poly-carousel:bien-tap"}}, {"type": "tool_use", "id": "ag2", "name": "Agent", "input": {"description": "Kiểm thông tin 5 máy", "subagent_type": "poly-carousel:kiem-thong-tin"}}]}})
for q in ["ThinkPad P14s Gen 4 AMD PSREF", "Dell Precision 3581 RTX A1000 spec", "HP ZBook Firefly 14 G10 notebookcheck"]:
    out({"type": "assistant", "parent_tool_use_id": "ag2", "message": {"content": [{"type": "tool_use", "id": "w" + q[:3], "name": "WebSearch", "input": {"query": q}}]}})
out({"type": "user", "message": {"content": [{"type": "tool_result", "tool_use_id": "ag1", "content": "ok"}, {"type": "tool_result", "tool_use_id": "ag2", "content": "ok"}]}})
upd(1, 'completed'); upd(2, 'in_progress')
kenh = 'iPad' if 'iPad (' in prompt else 'Laptop'
folder = os.path.join(HERE, 'ws', kenh, 'T10_Bai%s_28-10' % sid[-5:])
os.makedirs(folder, exist_ok=True)
out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "c1", "name": "Bash", "input": {"command": "curl -L -o ...", "description": "Tải ảnh PSREF P14s Gen 4 cỡ gốc 2000x2000"}}]}})
out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "r1", "name": "Read", "input": {"file_path": "E:\\Social Claude\\Anh tai ve\\tai-ve-28-10\\p14s-ct1-03.png"}}]}})
upd(2, 'completed'); upd(3, 'completed'); upd(4, 'completed'); upd(5, 'in_progress')
out({"type": "assistant", "message": {"content": [{"type": "text", "text": "THU_MUC_BAI=" + folder}]}})
out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "b1", "name": "Bash", "input": {"command": "python chay_ps.py", "description": "Chạy Photoshop dựng 7 slide (chờ ~95 giây)"}}]}})
base = '/mnt/user-data/uploads/Social Claude/' + ('iPad/T10_Tam10TrieuiPad_29-10' if kenh == 'iPad' else 'Laptop/T10_Top5Duoi25Tr_28-10')
srcs = [os.path.join(base, f) for f in ('slide-01.png', 'slide-02.png', 'slide-07.png')]
slow = 'CHAM' in prompt
n_max = 7 if '--resume' not in a else 2
for n in range(1, n_max + 1):
    p = srcs[0] if n == 1 else srcs[2] if n == 7 else srcs[1]
    dst = os.path.join(folder, 'slide-%02d.png' % n)
    if Image is None:
        import base64; open(dst, 'wb').write(base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkMGD4DwABBAEAgh9OewAAAABJRU5ErkJggg=='))
    else:
        im = Image.open(p).convert('RGB') if os.path.exists(p) else Image.new('RGB', (1080, 1440), (20, 40, 30))
        im.save(dst)
    time.sleep(0.15 if not slow else 1.0)
    if slow and n == 3: time.sleep(900)
upd(5, 'completed'); upd(6, 'in_progress')
out({"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "ag3", "name": "Agent", "input": {"description": "Duyệt bài vòng 1", "subagent_type": "poly-carousel:duyet-bai"}}]}})
out({"type": "user", "message": {"content": [{"type": "tool_result", "tool_use_id": "ag3", "content": "CHUA DAT 2 loi"}]}})
out({"type": "assistant", "message": {"content": [{"type": "text", "text": "Duyệt bắt 2 lỗi: slide 3 chữ mồ côi \"đơ.\", slide 5 ảnh ZBook bị phóng 1.15x. Sửa rồi build lại slide 3, 5."}]}})
upd(6, 'completed'); upd(7, 'completed')
# CLI thật có thể ra nhiều "result" trong 1 lượt (Claude kết thúc lượt khi chờ agent nền rồi chạy tiếp)
out({"type": "result", "subtype": "success", "is_error": False, "result": "Đang chờ agent thiết kế và agent duyệt trả kết quả.", "session_id": sid, "duration_ms": 3000, "num_turns": 30, "total_cost_usd": 1.2})
out({"type": "system", "subtype": "init", "session_id": sid, "model": "claude-opus-5-5"})  # CLI thật có nhiều init trong 1 lượt
out({"type": "assistant", "message": {"content": [{"type": "text", "text": "Agent duyệt: ĐẠT. Sửa gộp 2 lỗi, dựng lại slide 3, 5."}]}})
res = "Xong 7 slide, đã qua duyệt.\n"
if 'THUHOI' in prompt and '--resume' not in a:
    res += "Đã đổi so với brief: slide 5 giá mini 8 thành 19.499.000đ\nHOI_FEN: Slide 5 giá mini 8? | 19.499.000đ (giá Apple VN) | Chờ giá Việt Nam\nHOI_FEN: Slide 7 có bán kèm bút? | Có, giữ \"kèm bút\" | Bỏ \"kèm bút\"\n"
res += "THU_MUC_BAI=" + folder
out({"type": "result", "subtype": "success", "is_error": False, "result": res, "session_id": sid, "duration_ms": 5000, "num_turns": 40, "total_cost_usd": 2.5})
