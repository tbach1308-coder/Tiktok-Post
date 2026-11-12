#!/usr/bin/env python3
# cloudflared giả: in link trycloudflare như thật rồi chạy mãi (máy thử không mở được đường nối thật)
import sys, time, random, string
ten = ''.join(random.choice(string.ascii_lowercase) for _ in range(6)) + '-thu-' + ''.join(random.choice(string.ascii_lowercase) for _ in range(5))
print("2026-11-12T09:00:00Z INF Requesting new quick Tunnel on trycloudflare.com...", flush=True)
time.sleep(1)
print("2026-11-12T09:00:01Z INF |  https://%s.trycloudflare.com  |" % ten, flush=True)
print("args:", " ".join(sys.argv[1:]), flush=True)
while True:
    time.sleep(60)
