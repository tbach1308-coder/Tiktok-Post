# Cho bo tu chay Photoshop chay ca khi Photoshop dang tat: bat cung Windows + tu bat lai moi 5 phut neu bi tat.
$LOG = 'C:\Users\Dao\Pictures\PolySocial\_tu-chay\cai-tu-chay-luon.log'
function L($m) { "$((Get-Date).ToString('HH:mm:ss'))  $m" | Out-File $LOG -Append -Encoding utf8 }
"=== $(Get-Date) ===" | Out-File $LOG -Encoding utf8
$vbs = 'C:\Users\Dao\Pictures\PolySocial\poly-tu-chay.vbs'
# 1. Khoi dong cung Windows (thu muc Startup cua user, khong can quyen admin)
$st = [Environment]::GetFolderPath('Startup')
$launcher = Join-Path $st 'poly-tu-chay.vbs'
'CreateObject("WScript.Shell").Run "wscript.exe ""' + $vbs + '""", 0, False' | Out-File $launcher -Encoding ascii
L "Startup: $launcher -> $(Test-Path $launcher)"
# 2. Tu bat lai moi 5 phut (ban dang chay thi ban moi tu thoat, khong bi trung)
$o = & schtasks.exe /Create /F /TN "POLY tu chay Photoshop" /SC MINUTE /MO 5 /TR "wscript.exe `"$vbs`"" 2>&1 | Out-String
L ("schtasks: " + $o.Trim())
$o = & schtasks.exe /Query /TN "POLY tu chay Photoshop" /FO LIST 2>&1 | Select-Object -First 8 | Out-String
L $o.Trim()
L '=== XONG ==='
