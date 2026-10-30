@echo off
rem Thay bo tu chay moi va chi giu 1 ban dang chay
timeout /t 3 /nobreak >nul
copy /y "E:\Social Claude\_bo-dung-design\tu-chay\poly-tu-chay.vbs" "C:\Users\Dao\Pictures\PolySocial\poly-tu-chay.vbs" >nul
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='wscript.exe'\" | Where-Object { $_.CommandLine -like '*poly-tu-chay.vbs*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
del /q "C:\Users\Dao\Pictures\PolySocial\_tu-chay\dang-chay.txt" 2>nul
start "" wscript.exe "C:\Users\Dao\Pictures\PolySocial\poly-tu-chay.vbs"
echo %date% %time% da lam moi bo tu chay >> "C:\Users\Dao\Pictures\PolySocial\_tu-chay\nhat-ky.txt"
