# Sap xep lai E:\Social Claude theo quy uoc Poly
# Chay: powershell -ExecutionPolicy Bypass -File "E:\Social Claude\sap-xep-folder.ps1"
# Script CHI di chuyen / doi ten. KHONG xoa bat ky file nao.

$ErrorActionPreference = 'Stop'
$R = 'E:\Social Claude'
$log = Join-Path $R '_sap-xep-log.txt'
"=== Sap xep folder $(Get-Date -Format 'yyyy-MM-dd HH:mm') ===" | Out-File $log -Encoding UTF8

function Say($m) { Write-Host $m; $m | Out-File $log -Append -Encoding UTF8 }

function MoveDir($from, $to) {
    $src = Join-Path $R $from
    $dst = Join-Path $R $to
    if (-not (Test-Path -LiteralPath $src)) { Say "  BO QUA (khong co): $from"; return }
    if (Test-Path -LiteralPath $dst)        { Say "  BO QUA (dich da ton tai): $to"; return }
    $parent = Split-Path $dst -Parent
    if (-not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Move-Item -LiteralPath $src -Destination $dst
    Say "  OK  $from  ->  $to"
}

# ---------- 1. Tao thu muc khung ----------
Say ''
Say '[1] Tao thu muc khung'
foreach ($d in @('iPad', 'Script', '_to_delete')) {
    $p = Join-Path $R $d
    if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p | Out-Null; Say "  Tao: $d\" }
    else { Say "  Da co: $d\" }
}

# ---------- 2. Gom 12 bai iPad vao iPad\ ----------
Say ''
Say '[2] Gom bai iPad vao iPad\'
$ipad = @(
    'T10_KetNoiiPad_01', 'T10_LenDoiiPad_05', 'T10_LoiiPadCu_13',
    'T10_A16vsAir5_14',  'T10_TopiPad_15',    'T10_ProM1vsAir5_16',
    'T10_iPad64GB_17',   'T10_BangGiaiPad_18','T10_Top5iPadSinhVien_19',
    'T10_Air4vsAir5_19-10','T10_ButGiaRe_22', 'T10_3iPadDangMua_30'
)
foreach ($b in $ipad) { MoveDir $b "iPad\$b" }

# ---------- 3. Gom file .jsx vao Script\ ----------
Say ''
Say '[3] Gom file .jsx vao Script\'
Get-ChildItem -LiteralPath $R -Filter '*.jsx' -File | ForEach-Object {
    $dst = Join-Path $R "Script\$($_.Name)"
    if (Test-Path -LiteralPath $dst) { Say "  BO QUA (da ton tai): $($_.Name)" }
    else { Move-Item -LiteralPath $_.FullName -Destination $dst; Say "  OK  $($_.Name)  ->  Script\" }
}

# ---------- 4. Chuan hoa ten trong Laptop\ ----------
Say ''
Say '[4] Chuan hoa ten trong Laptop\'
MoveDir 'Laptop\Cập nhật bảng giá laptop tại Poly' 'Laptop\T10_Laptop_BangGia'
MoveDir 'Laptop\Ban-may\Dell-Precision-7670'       'Laptop\T10_Laptop_Dell7670'
MoveDir 'Laptop\T10_LaptopCu_4Buoc_19-10'          'Laptop\T10_Laptop_Cu_4Buoc'

# Xoa vo bọc Ban-may neu da rong
$banmay = Join-Path $R 'Laptop\Ban-may'
if (Test-Path -LiteralPath $banmay) {
    if (-not (Get-ChildItem -LiteralPath $banmay -Force)) {
        Remove-Item -LiteralPath $banmay
        Say '  OK  bo vo boc rong: Laptop\Ban-may\'
    } else { Say '  CHU Y: Laptop\Ban-may\ con file, giu nguyen' }
}

# ---------- 5. Gop ban bo vao _to_delete\ ----------
Say ''
Say '[5] Gop ban bo vao _to_delete\'
MoveDir '_to_delete-T10_Air4vsAir5_20' '_to_delete\T10_Air4vsAir5_20'

# ---------- 6. Ket qua ----------
Say ''
Say '[6] Cau truc goc sau khi sap xep'
Get-ChildItem -LiteralPath $R -Force | Sort-Object { -not $_.PSIsContainer }, Name | ForEach-Object {
    if ($_.PSIsContainer) { Say "  [DIR ] $($_.Name)" } else { Say "  [file] $($_.Name)" }
}
Say ''
Say "XONG. Nhat ky: $log"
Say "Con lai: tu xoa thu muc _to_delete\ sau khi da kiem tra."
