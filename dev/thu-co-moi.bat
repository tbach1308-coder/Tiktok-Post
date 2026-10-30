@echo off
chcp 65001 >nul
cd /d "E:\Social Claude"
echo === %date% %time% > "E:\Tool\poly-dung-bai\dev\thu-co-moi.log"
echo Reply in one short sentence: how must you address the shop owner, per the shop rules? | "C:\Users\Dao\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe" -p --output-format stream-json --verbose --model haiku --plugin-dir "E:\Social Claude\_bo-dung-design\plugin\poly-carousel" --append-system-prompt-file "E:\Tool\poly-dung-bai\prompts\luat-chung.md" >> "E:\Tool\poly-dung-bai\dev\thu-co-moi.log" 2>&1
echo === XONG %errorlevel% >> "E:\Tool\poly-dung-bai\dev\thu-co-moi.log"
