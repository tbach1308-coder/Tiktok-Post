# POLY Dung Bai - tao icon "Poly Dung Bai" ngoai Desktop (chay 1 lan)
$ErrorActionPreference = 'Stop'
$app = Split-Path -Parent $MyInvocation.MyCommand.Path
$desk = Join-Path $env:USERPROFILE 'Desktop'
if (-not (Test-Path $desk)) { $desk = [Environment]::GetFolderPath('Desktop') }
$ws = New-Object -ComObject WScript.Shell
$lnk = $ws.CreateShortcut((Join-Path $desk 'Poly Dung Bai.lnk'))
$lnk.TargetPath = Join-Path $env:SystemRoot 'System32\wscript.exe'
$lnk.Arguments = '"' + (Join-Path $app 'Poly Dung Bai.vbs') + '"'
$lnk.WorkingDirectory = $app
$lnk.IconLocation = (Join-Path $app 'ui\poly.ico') + ',0'
$lnk.Description = 'Poly Dung Bai - nhap brief, bam Chay'
$lnk.Save()
"OK icon: " + (Join-Path $desk 'Poly Dung Bai.lnk')
