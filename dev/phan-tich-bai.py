# -*- coding: utf-8 -*-
"""Phan tich 1 bai da chay trong app: thoi gian tung buoc, Photoshop, agent, bi chan quyen, chi phi.

Dung:  python dev/phan-tich-bai.py jobs/<id-bai>            (in ra man hinh)
       python dev/phan-tich-bai.py jobs/<id-bai> --chi-tiet  (in ca tung lenh)
Doc: jobs/<id>/job.json + stream-*.jsonl (moi dong 1 su kien stream-json cua Claude Code, co "timestamp").
Dung de lead dinh huong: buoc nao ton thoi gian nhat, lam lai bao nhieu vong, chan quyen bao nhieu lan.
"""
import datetime, glob, io, json, os, re, sys
from collections import Counter, defaultdict

for f in (sys.stdout, sys.stderr):
    try:
        f.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

d = sys.argv[1] if len(sys.argv) > 1 else "."
CHI_TIET = "--chi-tiet" in sys.argv


def ts(o):
    t = o.get("timestamp")
    if not t:
        return None
    try:
        return datetime.datetime.fromisoformat(t.replace("Z", "+00:00")).timestamp()
    except ValueError:
        return None


def fm(s):
    s = int(round(s))
    return "%d:%02d" % (s // 60, s % 60)


job = {}
try:
    job = json.load(io.open(os.path.join(d, "job.json"), encoding="utf-8"))
except Exception:
    pass
print("Bai:", job.get("tieu_de"), "| kenh:", job.get("kenh"), "| trang thai:", job.get("status"))
for r in job.get("runs", []):
    if r.get("ended") and r.get("started"):
        print("  luot %s (%s): %s" % (r.get("n"), r.get("label"), fm(r["ended"] - r["started"])))

for sp in sorted(glob.glob(os.path.join(d, "stream-*.jsonl"))):
    print("\n==== %s ====" % os.path.basename(sp))
    ev = []
    for line in io.open(sp, encoding="utf-8", errors="replace"):
        try:
            ev.append(json.loads(line))
        except ValueError:
            pass
    t0 = last = None
    pending, rows = {}, []
    tools = Counter()
    tool_time = defaultdict(float)
    denied, results, agents = [], [], []
    for o in ev:
        t = ts(o)
        if t:
            last = t
            t0 = t0 or t
        typ, sub = o.get("type"), o.get("subtype")
        main = not o.get("parent_tool_use_id")
        if typ == "assistant" and main:
            for c in o.get("message", {}).get("content", []):
                if c.get("type") == "tool_use":
                    inp = c.get("input") or {}
                    desc = inp.get("description") or inp.get("subject") or inp.get("file_path") or inp.get("query") or (inp.get("command") or "")[:70]
                    pending[c["id"]] = (last, c["name"], str(desc)[:90])
                    tools[c["name"]] += 1
                    if c["name"] == "Agent":
                        agents.append((last - t0, inp.get("subagent_type"), inp.get("description")))
                elif c.get("type") == "text" and CHI_TIET:
                    rows.append((last - t0, 0, "CHU", c["text"][:100].replace("\n", " ")))
        if typ == "user" and main:
            for c in (o.get("message", {}).get("content") or []):
                if isinstance(c, dict) and c.get("type") == "tool_result" and c.get("tool_use_id") in pending:
                    st, n, desc = pending.pop(c["tool_use_id"])
                    tool_time[n] += last - st
                    rows.append((st - t0, last - st, n, desc))
        if typ == "system" and sub == "permission_denied":
            denied.append((o.get("tool_name"), (o.get("decision_reason") or o.get("message") or "")[:110]))
        if typ == "system" and sub in ("task_started", "task_notification") and CHI_TIET:
            rows.append((last - t0, 0, sub, (o.get("description") or o.get("task_description") or "") + " " + str(o.get("status") or "")))
        if typ == "result":
            results.append(o)
    if t0 is None:
        print("(khong co timestamp)")
        continue
    models = sorted({o.get("model") for o in ev if o.get("type") == "system" and o.get("subtype") == "init" and o.get("model")})
    print("Tong: %s | model: %s | %d su kien | lenh: %s" % (fm(last - t0), ", ".join(models) or "?", len(ev), ", ".join("%s %d" % kv for kv in tools.most_common(8))))
    if results:
        cost = max((r.get("total_cost_usd") or 0) for r in results)
        print("result: %d lan (nhieu lan = Claude ket thuc luot khi cho agent nen) | chi phi ~%.2f USD | luot cuoi %s" % (
            len(results), cost, (results[-1].get("result") or "")[:80].replace("\n", " ")))
    print("\nAgent goi:")
    for t, typ_, desc in agents:
        print("  %s  %-28s %s" % (fm(t), typ_, desc))
    ps = [r for r in rows if r[2] in ("Bash", "PowerShell") and re.search(r"photoshop|build|dung lai|dựng|tách nền|tach nen", r[3], re.I)]
    print("\nLenh lien quan Photoshop (bat dau, thoi gian cho, mo ta):")
    for r in ps:
        print("  %s  %6s  %s" % (fm(r[0]), fm(r[1]), r[3]))
    print("\nLenh cho lau nhat:")
    for r in sorted(rows, key=lambda x: -x[1])[:8]:
        print("  %s  %6s  %-10s %s" % (fm(r[0]), fm(r[1]), r[2], r[3]))
    print("\nBi chan quyen: %d lan" % len(denied))
    for (tool, why), k in Counter(denied).most_common():
        print("  %dx %s: %s" % (k, tool, why))
    if CHI_TIET:
        print("\nTung buoc:")
        for r in sorted(rows):
            print("  %s %6s %-16s %s" % (fm(r[0]), fm(r[1]), r[2], r[3]))
