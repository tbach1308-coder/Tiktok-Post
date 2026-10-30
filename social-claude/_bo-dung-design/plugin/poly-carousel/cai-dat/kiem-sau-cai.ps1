$ErrorActionPreference = 'Continue'
$LOG = 'E:\Social Claude\_bo-dung-design\plugin\poly-carousel\cai-dat\kiem-sau-cai.log'
function L($m) { $t = (Get-Date).ToString('HH:mm:ss'); "$t  $m" | Out-File -FilePath $LOG -Append -Encoding utf8 }
"=== KIEM SAU CAI $(Get-Date) ===" | Out-File -FilePath $LOG -Encoding utf8
$env:PYTHONUTF8 = '1'
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
L ('python: ' + ((Get-Command python -ErrorAction SilentlyContinue).Source))
L ('claude: ' + ((Get-Command claude -ErrorAction SilentlyContinue).Source))
L 'Chay lai buoc cai dat cua Claude Code (npm chan postinstall lan truoc)...'
$o = & npm install -g --allow-scripts=@anthropic-ai/claude-code @anthropic-ai/claude-code 2>&1 | Select-Object -Last 3 | Out-String; L $o.Trim()
$o = & claude --version 2>&1 | Out-String; L ('claude --version: ' + $o.Trim())
$o = & claude doctor 2>&1 | Select-Object -First 25 | Out-String; L $o.Trim()
$py = (Get-Command python).Source
$o = & $py "E:\Social Claude\_bo-dung-design\prep\trung_anh.py" kiem "E:\Social Claude\Laptop\T10_Top5Duoi25Tr_28-10\tai-nguyen" T10_Top5Duoi25Tr_28-10 2>&1 | Out-String; L ("Do trung anh:`n" + $o.Trim())
New-Item -ItemType Directory -Force -Path 'E:\Social Claude\_bo-dung-design\plugin\poly-carousel\cai-dat\thu' | Out-Null
$t0 = Get-Date
$o = & $py "E:\Social Claude\_bo-dung-design\prep\tach_nen.py" "C:\Users\Dao\Downloads\Telegram Desktop\photo_2026-10-22_13-44-40.jpg" "E:\Social Claude\_bo-dung-design\plugin\poly-carousel\cai-dat\thu\thu-ai.png" --ai 2>&1 | Out-String
L ("Tach nen AI (" + [int]((Get-Date) - $t0).TotalSeconds + "s): " + $o.Trim())
L '=== XONG ==='
