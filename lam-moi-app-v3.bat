@echo off
rem POLY Dung Bai - tat MOI ban may chu app dang nghe cong 8777 roi bat lai 1 ban. Bai dang chay (claude.exe) khong bi anh huong.
set L=E:\Tool\poly-dung-bai\kiem-app.log
echo === %date% %time% > "%L%"
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /c:"127.0.0.1:8777 " ^| findstr "LISTENING"') do (
  echo tat PID %%p >> "%L%"
  taskkill /F /PID %%p >> "%L%" 2>&1
)
timeout /t 2 /nobreak >nul
start "" "C:\Users\Dao\AppData\Local\Programs\Python\Python312\pythonw.exe" "E:\Tool\poly-dung-bai\server.py"
timeout /t 5 /nobreak >nul
netstat -ano | findstr /c:"127.0.0.1:8777 " | findstr "LISTENING" >> "%L%"
"%SystemRoot%\System32\curl.exe" -s "http://127.0.0.1:8777/api/health?force=1" >> "%L%" 2>&1
echo. >> "%L%"
echo === XONG >> "%L%"
