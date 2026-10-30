# Cai tu dong (khong can bam): Python 3.12, thu vien anh, Claude Code, plugin poly-carousel, settings.
$ErrorActionPreference = 'Continue'
$LOG = 'E:\Social Claude\_bo-dung-design\plugin\poly-carousel\cai-dat\cai-tu-dong.log'
function L($m) { $t = (Get-Date).ToString('HH:mm:ss'); "$t  $m" | Out-File -FilePath $LOG -Append -Encoding utf8 }
"=== CAI TU DONG $(Get-Date) ===" | Out-File -FilePath $LOG -Encoding utf8

# 1. Python
$py = Join-Path $env:LOCALAPPDATA 'Programs\Python\Python312\python.exe'
if (-not (Test-Path $py)) {
  L 'Cai Python 3.12 bang winget...'
  $o = & winget install -e --id Python.Python.3.12 --scope user --silent --accept-package-agreements --accept-source-agreements --override "/quiet InstallAllUsers=0 PrependPath=1 Include_launcher=1 Include_test=0" 2>&1 | Out-String
  L $o.Trim()
}
if (Test-Path $py) { L ("Python: " + (& $py --version 2>&1)) } else { L 'LOI: khong cai duoc Python'; L '=== DUNG ==='; exit 1 }

# 2. Thu vien
L 'pip install thu vien anh...'
$o = & $py -m pip install --upgrade pip 2>&1 | Select-Object -Last 1 | Out-String; L $o.Trim()
$o = & $py -m pip install pillow numpy scipy opencv-python 2>&1 | Select-Object -Last 3 | Out-String; L $o.Trim()
$o = & $py -c "import PIL, numpy, scipy, cv2; print('thu vien anh OK')" 2>&1 | Out-String; L $o.Trim()

# 3. Claude Code
$claude = Join-Path $env:APPDATA 'npm\claude.cmd'
if (-not (Test-Path $claude)) {
  L 'Cai Claude Code bang npm...'
  $o = & npm install -g @anthropic-ai/claude-code 2>&1 | Select-Object -Last 3 | Out-String; L $o.Trim()
}
if (Test-Path $claude) {
  L ("Claude Code: " + (& $claude --version 2>&1 | Out-String).Trim())
  $o = & $claude plugin marketplace add "E:\Social Claude\_bo-dung-design\plugin" 2>&1 | Out-String; L $o.Trim()
  $o = & $claude plugin install poly-carousel@poly-store 2>&1 | Out-String; L $o.Trim()
  $o = & $claude plugin list 2>&1 | Out-String; L $o.Trim()
} else { L 'LOI: khong cai duoc Claude Code' }

# 4. Settings cho thu muc E:\Social Claude
$dst = 'E:\Social Claude\.claude\settings.json'
if (-not (Test-Path $dst)) {
  New-Item -ItemType Directory -Force -Path 'E:\Social Claude\.claude' | Out-Null
  Copy-Item "$PSScriptRoot\settings.mau.json" $dst
  L "Da tao $dst"
} else { L "Da co $dst, giu nguyen" }

# 5. Kiem lai cong cu
$o = & $py "E:\Social Claude\_bo-dung-design\code\build.py" slides/top5_25tr_slides.jsx T10_Top5Duoi25Tr_28-10 thu-cai-dat v0 1 2>&1 | Out-String; L $o.Trim()
Remove-Item "E:\Social Claude\_bo-dung-design\out\thu-cai-dat-v0.jsx" -ErrorAction SilentlyContinue
$o = & $py "E:\Social Claude\_bo-dung-design\prep\trung_anh.py" kiem "E:\Social Claude\Laptop\T10_Top5Duoi25Tr_28-10\tai-nguyen" T10_Top5Duoi25Tr_28-10 2>&1 | Select-Object -Last 1 | Out-String; L ("Do trung anh: " + $o.Trim())
L '=== XONG ==='
