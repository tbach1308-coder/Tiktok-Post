# Cai dat moi truong cho plugin poly-carousel (chay 1 lan tren may shop).
#   cai-dat.bat          -> cai thu vien Python can thiet
$ErrorActionPreference = 'Continue'
$kit = 'E:\Social Claude\_bo-dung-design'
Write-Host '== 1. Python ==' -ForegroundColor Cyan
$py = (Get-Command python -ErrorAction SilentlyContinue)
if (-not $py) { $py = (Get-Command py -ErrorAction SilentlyContinue) }
if (-not $py) {
  Write-Host 'CHUA CO PYTHON. Cai tu https://www.python.org/downloads/ (tick "Add python.exe to PATH") roi chay lai file nay.' -ForegroundColor Red
  exit 1
}
& $py.Source --version
& $py.Source -m pip install --upgrade pip
& $py.Source -m pip install pillow numpy scipy opencv-python
& $py.Source -c "import PIL, numpy, scipy, cv2; print('Thu vien Python: OK')"

Write-Host '== 2. Node.js (de kiem cu phap script, khong bat buoc) ==' -ForegroundColor Cyan
if (Get-Command node -ErrorAction SilentlyContinue) { node --version } else { Write-Host 'Chua co Node.js: van chay duoc, chi bo qua buoc kiem cu phap. Muon cai: https://nodejs.org' -ForegroundColor Yellow }

Write-Host '== 3. Quyen cho Claude Code trong E:\Social Claude ==' -ForegroundColor Cyan
$dst = 'E:\Social Claude\.claude\settings.json'
if (Test-Path $dst) {
  Write-Host "Da co $dst -> giu nguyen. Muon dung mau cua plugin thi tu chep tu: $PSScriptRoot\settings.mau.json" -ForegroundColor Yellow
} else {
  New-Item -ItemType Directory -Force -Path 'E:\Social Claude\.claude' | Out-Null
  Copy-Item "$PSScriptRoot\settings.mau.json" $dst
  Write-Host "Da tao $dst" -ForegroundColor Green
}

Write-Host '== 4. Kiem bo tu chay Photoshop ==' -ForegroundColor Cyan
$hb = 'C:\Users\Dao\Pictures\PolySocial\_tu-chay\dang-chay.txt'
if ((Test-Path $hb) -and ((Get-Date) - (Get-Item $hb).LastWriteTime).TotalSeconds -lt 30) { Write-Host 'Photoshop tu chay: DANG BAT' -ForegroundColor Green }
else { Write-Host 'Photoshop tu chay: CHUA BAT (mo Photoshop la tu bat).' -ForegroundColor Yellow }

Write-Host ''
Write-Host 'XONG. Buoc tiep theo (trong Claude Code, mo tai E:\Social Claude):' -ForegroundColor Cyan
Write-Host '   /plugin marketplace add "E:\Social Claude\_bo-dung-design\plugin"'
Write-Host '   /plugin install poly-carousel@poly-store'
Write-Host '   /poly-carousel:dung-bai  <dan brief vao>'
Write-Host 'Luu y: can Claude Code ban moi (2.1.214 tro len) de chu tieng Viet khong bi loi. Cap nhat: claude update'
