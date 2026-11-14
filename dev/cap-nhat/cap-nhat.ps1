# POLY Dung Bai - cap nhat 13/11 toi (Claude goi san). Bam dup CAP-NHAT.bat de chay.
# 1) cho khong con bai / quy tac dang chay  2) cat ban cu vao _to_delete  3) chep ban moi
# 4) khoi dong lai app  5) Photoshop dung anh xem truoc 2 theme moi. Khong xoa file nao.
$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$app = 'E:\Tool\poly-dung-bai'
$tuchay = 'C:\Users\Dao\Pictures\PolySocial\_tu-chay'
$log = Join-Path $app 'cap-nhat-13-11.log'
function Ghi($s) { $t = (Get-Date -Format 'HH:mm:ss') + ' ' + $s; Write-Host $t; Add-Content -Path $log -Value $t }

Ghi '=== POLY Dung Bai: cap nhat 13/11 toi ==='
if (-not (Test-Path (Join-Path $app 'server.py'))) { Ghi "LOI: khong thay $app\server.py"; exit 1 }

# 1. cho khong con viec dang chay (khoi dong lai giua chung lam hong bai)
while ($true) {
  $dang = @()
  try {
    $j = Invoke-RestMethod 'http://127.0.0.1:8777/api/jobs' -TimeoutSec 15
    $dang += @($j.jobs | Where-Object { $_.status -eq 'dang-chay' } | ForEach-Object { 'bai ' + $_.id })
    $q = Invoke-RestMethod 'http://127.0.0.1:8777/api/quy-tac' -TimeoutSec 15
    $dang += @($q.viec | Where-Object { $_.status -eq 'dang-chay' -or $_.status -eq 'moi' } | ForEach-Object { 'quy tac ' + $_.id })
  } catch { Ghi 'App chua mo hoac khong hoi duoc: van cap nhat binh thuong' }
  if ($dang.Count -eq 0) { break }
  Ghi ('Dang co viec chay: ' + ($dang -join ', ') + ' -> cho 1 phut roi kiem lai (dung tat cua so nay)')
  Start-Sleep -Seconds 60
}

# 2 + 3. cat ban cu vao _to_delete roi chep ban moi
$bk = Join-Path $app ('_to_delete\truoc-cap-nhat-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
$src = Join-Path $here 'files'
$n = 0
Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length + 1)
  $dst = Join-Path $app $rel
  if (Test-Path $dst) { $b = Join-Path $bk $rel; New-Item -ItemType Directory -Force -Path (Split-Path $b) | Out-Null; Copy-Item $dst $b -Force }
  New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
  Copy-Item $_.FullName $dst -Force
  $n++
}
Ghi "Da chep $n file moi (ban cu cat o $bk)"

# anh may mau cho anh xem truoc 2 theme moi (lay tu theme cu tren may)
$cap = @(@('bento-cloud-dancer', 'glass-xanh-ngoc'), @('ghi-chu-iphone', 'phang-than-xanh-duong'))
foreach ($c in $cap) {
  $from = Join-Path $app ('theme-ps\' + $c[1] + '\xem\tai-nguyen\anh-that\may.png')
  $toD = Join-Path $app ('theme-ps\' + $c[0] + '\xem\tai-nguyen\anh-that')
  New-Item -ItemType Directory -Force -Path $toD | Out-Null
  New-Item -ItemType Directory -Force -Path (Join-Path $app ('theme-ps\' + $c[0] + '\xem\log')) | Out-Null
  if (Test-Path $from) { Copy-Item $from (Join-Path $toD 'may.png') -Force; Ghi ('Anh may mau cho ' + $c[0] + ': lay tu ' + $c[1]) }
  else { Ghi ('Thieu anh may mau ' + $from + ' (anh xem truoc ' + $c[0] + ' se khong co may)') }
}

# 4. khoi dong lai app
Ghi 'Khoi dong lai app...'
$bat = Join-Path $app 'lam-moi-app-v3.bat'
$kl = Join-Path $app 'kiem-app.log'
$t0 = Get-Date
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', ('"' + $bat + '"') -WindowStyle Hidden
$ok = $false
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 2
  $xong = $false
  try { $xong = (Test-Path $kl) -and ((Get-Item $kl).LastWriteTime -gt $t0) -and ((Get-Content $kl -Raw) -match 'XONG') } catch { $xong = $false }
  if ($xong) {
    try { Invoke-RestMethod 'http://127.0.0.1:8777/api/ping' -TimeoutSec 5 | Out-Null; $ok = $true; break } catch {}
  }
}
if ($ok) { Ghi 'App da chay lai ban moi (cong 8777)' } else { Ghi 'CHU Y: app chua len lai, bam dup lam-moi-app-v3.bat trong thu muc app' }

# 5. Photoshop dung anh xem truoc 2 theme moi (hang cho _tu-chay, Photoshop phai dang mo)
if (Test-Path $tuchay) {
  Get-ChildItem (Join-Path $here 'xem') -Filter *.jsx | ForEach-Object { Copy-Item $_.FullName (Join-Path $tuchay $_.Name) -Force }
  Ghi 'Da gui 2 file dung anh xem truoc cho Photoshop, cho toi da 4 phut...'
  $themes = @('bento-cloud-dancer', 'ghi-chu-iphone')
  for ($i = 0; $i -lt 48; $i++) {
    $du = $true
    foreach ($t in $themes) { if (-not (Test-Path (Join-Path $app ('theme-ps\' + $t + '\xem\slide-03.png')))) { $du = $false } }
    if ($du) { break }
    Start-Sleep -Seconds 5
  }
  foreach ($t in $themes) {
    $c = @(Get-ChildItem (Join-Path $app ('theme-ps\' + $t + '\xem')) -Filter 'slide-0*.png' -ErrorAction SilentlyContinue).Count
    Ghi ("Anh xem truoc " + $t + ": $c / 3")
  }
} else { Ghi ("Khong thay " + $tuchay + " : chua dung anh xem truoc") }
Ghi '=== XONG. Mo app Poly Dung Bai > Kho theme > Photoshop xem 2 theme moi. Nhan Claude "da chay xong" de Claude kiem tra. ==='
