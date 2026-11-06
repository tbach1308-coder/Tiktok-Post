; Poly Dung Bai - bo cai cho may Windows khac (fen 6/11 "chuyen thanh exe cho nhieu nguoi sai duoc").
; Build tren Linux: packaging/build.sh (makensis). Cai cho rieng nguoi dung, khong can quyen admin.
; Cai de len ban cu: chi thay file cua app + Python di kem; config.json, jobs\, _edge\ (du lieu may nay) va ~\Social Claude giu nguyen.
Unicode true
SetCompressor /SOLID lzma
SetCompressorDictSize 64

!ifndef VERSION
  !define VERSION "1.0.0"
!endif
!ifndef BUILD
  !define BUILD "build"
!endif
!define APPNAME "Poly Dựng Bài"
!define UNINSTKEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\PolyDungBai"

Name "${APPNAME}"
OutFile "${OUTFILE}"
InstallDir "$LOCALAPPDATA\Programs\PolyDungBai"
InstallDirRegKey HKCU "Software\PolyDungBai" "InstallDir"
RequestExecutionLevel user
BrandingText "POLY Store · ${APPNAME} ${VERSION}"
VIProductVersion "${VERSION}.0"
VIAddVersionKey /LANG=0 "ProductName" "Poly Dung Bai"
VIAddVersionKey /LANG=0 "FileDescription" "Cai dat Poly Dung Bai"
VIAddVersionKey /LANG=0 "CompanyName" "POLY Store"
VIAddVersionKey /LANG=0 "FileVersion" "${VERSION}"
VIAddVersionKey /LANG=0 "ProductVersion" "${VERSION}"
VIAddVersionKey /LANG=0 "LegalCopyright" "POLY Store"

!include "MUI2.nsh"
!define MUI_ICON "${BUILD}\app\ui\poly.ico"
!define MUI_UNICON "${BUILD}\app\ui\poly.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "Cài ${APPNAME}"
!define MUI_WELCOMEPAGE_TEXT "App dựng bài carousel TikTok của POLY Store (iPad, Laptop), làm bằng Photoshop hoặc Canva.$\r$\n$\r$\nCài cho tài khoản Windows này, không cần quyền quản trị. Python và thư viện ảnh đi kèm sẵn.$\r$\n$\r$\nSau khi cài, mở app lần đầu: app tự tạo thư mục Social Claude trong thư mục người dùng và chỉ cách cài Claude Code + đăng nhập tài khoản Claude (gói Pro / Max).$\r$\n$\r$\nCài đè lên bản cũ được: bài, cài đặt, bộ luật của máy này giữ nguyên."
!define MUI_FINISHPAGE_RUN "$INSTDIR\Poly Dung Bai.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Mở ${APPNAME} ngay"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\app\HUONG-DAN.txt"
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Xem hướng dẫn"
!define MUI_FINISHPAGE_SHOWREADME_NOTCHECKED

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "Vietnamese"

; tat app dang chay tu thu muc cai (may chu Python + bo canh hang cho Photoshop) de thay duoc file
!macro TatApp
  nsExec::Exec 'powershell -NoProfile -ExecutionPolicy Bypass -Command "$$d = [IO.Path]::GetFullPath(''$INSTDIR\python''); Get-Process python,pythonw -ErrorAction SilentlyContinue | Where-Object { $$_.Path -and $$_.Path.StartsWith($$d, [StringComparison]::OrdinalIgnoreCase) } | Stop-Process -Force -ErrorAction SilentlyContinue"'
  Pop $0
  Sleep 800
!macroend

Section "App" SecApp
  SectionIn RO
  !insertmacro TatApp
  ; Python di kem: thay ca thu muc (ban cu co the khac thu vien)
  RMDir /r "$INSTDIR\python"
  SetOutPath "$INSTDIR\python"
  File /r "${BUILD}\python\*.*"
  ; ma app: chep de len, file cua may nay (config.json, jobs, _edge, nhat ky) khong co trong goi nen khong bi dong toi
  SetOutPath "$INSTDIR\app"
  File /r "${BUILD}\app\*.*"
  SetOutPath "$INSTDIR"
  File "${BUILD}\Poly Dung Bai.exe"
  WriteUninstaller "$INSTDIR\Go cai Poly Dung Bai.exe"

  CreateShortCut "$DESKTOP\${APPNAME}.lnk" "$INSTDIR\Poly Dung Bai.exe" "" "$INSTDIR\app\ui\poly.ico"
  CreateDirectory "$SMPROGRAMS\${APPNAME}"
  CreateShortCut "$SMPROGRAMS\${APPNAME}\${APPNAME}.lnk" "$INSTDIR\Poly Dung Bai.exe" "" "$INSTDIR\app\ui\poly.ico"
  CreateShortCut "$SMPROGRAMS\${APPNAME}\Hướng dẫn.lnk" "$INSTDIR\app\HUONG-DAN.txt"
  CreateShortCut "$SMPROGRAMS\${APPNAME}\Gỡ cài ${APPNAME}.lnk" "$INSTDIR\Go cai Poly Dung Bai.exe"

  WriteRegStr HKCU "Software\PolyDungBai" "InstallDir" "$INSTDIR"
  WriteRegStr HKCU "Software\PolyDungBai" "Version" "${VERSION}"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayName" "${APPNAME}"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayVersion" "${VERSION}"
  WriteRegStr HKCU "${UNINSTKEY}" "Publisher" "POLY Store"
  WriteRegStr HKCU "${UNINSTKEY}" "DisplayIcon" "$INSTDIR\app\ui\poly.ico"
  WriteRegStr HKCU "${UNINSTKEY}" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "${UNINSTKEY}" "UninstallString" '"$INSTDIR\Go cai Poly Dung Bai.exe"'
  WriteRegDWORD HKCU "${UNINSTKEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINSTKEY}" "NoRepair" 1
SectionEnd

; Go cai: bo ma app + Python di kem. Giu lai du lieu (app\config.json, app\jobs, app\_edge) va ~\Social Claude:
; khong xoa han gi cua nguoi dung, muon bo han thi tu xoa thu muc.
Section "Uninstall"
  !insertmacro TatApp
  RMDir /r "$INSTDIR\python"
  Delete "$INSTDIR\Poly Dung Bai.exe"
  !include "${BUILD}\go-cai-app.nsh"
  Delete "$DESKTOP\${APPNAME}.lnk"
  RMDir /r "$SMPROGRAMS\${APPNAME}"
  DeleteRegKey HKCU "${UNINSTKEY}"
  DeleteRegKey HKCU "Software\PolyDungBai"
  Delete "$INSTDIR\Go cai Poly Dung Bai.exe"
  RMDir "$INSTDIR"
SectionEnd
