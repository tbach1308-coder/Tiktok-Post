' POLY Dung Bai - mo app nhap brief, bam Chay (Claude Code + plugin poly-carousel tu dung slide)
' Bat may chu nho (pythonw server.py, chi chay tren may nay, cong 8777) neu chua chay, roi mo cua so app bang Edge.
Option Explicit
Dim sh, fso, app, py, url, i, edge, prof
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
app = fso.GetParentFolderName(WScript.ScriptFullName)
url = "http://127.0.0.1:8777/"

Function Song()
  Dim h
  On Error Resume Next
  Set h = CreateObject("MSXML2.ServerXMLHTTP.6.0")
  h.setTimeouts 800, 800, 800, 800
  h.Open "GET", url & "api/ping", False
  h.Send
  Song = (Err.Number = 0)
  If Song Then Song = (h.Status = 200)
  Err.Clear
  On Error GoTo 0
End Function

If Not Song() Then
  ' goi Python bang duong dan day du (PATH may shop hay bi phan mem khac lam hong)
  py = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Programs\Python\Python312\pythonw.exe"
  If Not fso.FileExists(py) Then py = "pythonw.exe"
  sh.CurrentDirectory = app
  sh.Run """" & py & """ """ & app & "\server.py""", 0, False
  For i = 1 To 60
    WScript.Sleep 250
    If Song() Then Exit For
  Next
  If Not Song() Then
    MsgBox "Khong bat duoc app Poly Dung Bai." & vbCrLf & "Xem file " & app & "\app-log.txt roi chup man hinh gui Claude.", 48, "Poly Dung Bai"
    WScript.Quit
  End If
End If

edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
If Not fso.FileExists(edge) Then edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
If fso.FileExists(edge) Then
  ' ho so Edge rieng cho app + giao dien tieng Viet + tat dich trang: Edge khong tu dich app sang tieng Anh nua
  prof = app & "\_edge"
  sh.Run """" & edge & """ --app=" & url & " --user-data-dir=""" & prof & """ --lang=vi --disable-features=Translate,TranslateUI --no-first-run --no-default-browser-check --window-size=1440,930", 1, False
Else
  sh.Run url, 1, False
End If
