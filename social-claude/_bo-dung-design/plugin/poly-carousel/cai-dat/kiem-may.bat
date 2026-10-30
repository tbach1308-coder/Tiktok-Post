@echo off
set LOG=E:\Social Claude\_bo-dung-design\plugin\poly-carousel\cai-dat\kiem-may.log
echo === KIEM MAY %date% %time% === > "%LOG%"
echo --- python >> "%LOG%"
where python >> "%LOG%" 2>&1
python --version >> "%LOG%" 2>&1
where py >> "%LOG%" 2>&1
py -3 --version >> "%LOG%" 2>&1
py -0p >> "%LOG%" 2>&1
python -c "import PIL,numpy,scipy,cv2;print('libs ok')" >> "%LOG%" 2>&1
echo --- node >> "%LOG%"
where node >> "%LOG%" 2>&1
node --version >> "%LOG%" 2>&1
echo --- git >> "%LOG%"
where git >> "%LOG%" 2>&1
where bash >> "%LOG%" 2>&1
echo --- winget >> "%LOG%"
where winget >> "%LOG%" 2>&1
echo --- claude >> "%LOG%"
where claude >> "%LOG%" 2>&1
call claude --version >> "%LOG%" 2>&1
call claude plugin list >> "%LOG%" 2>&1
echo --- settings >> "%LOG%"
if exist "E:\Social Claude\.claude\settings.json" (type "E:\Social Claude\.claude\settings.json" >> "%LOG%") else (echo khong co settings.json >> "%LOG%")
if exist "%USERPROFILE%\.claude\settings.json" (echo user settings: & type "%USERPROFILE%\.claude\settings.json") >> "%LOG%" 2>&1
echo === XONG === >> "%LOG%"
