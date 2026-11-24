' POLY STORE - thu bo tu chay cu (poly-tu-chay.vbs ban 24/11) nhuong POLYTool, tren thu muc hang cho THU (khong dung hang cho that)
' Ket qua: C:\Users\Dao\Pictures\PolySocial\_tam\thu-polytool-kq.txt
Option Explicit
Dim fso, sh, T, V, kq, i, nk, h
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
T = "C:\Users\Dao\Pictures\PolySocial\_tam\thu-polytool"
V = "C:\Users\Dao\Pictures\PolySocial\_tam\poly-tu-chay-moi.vbs"
kq = ""
If Not fso.FolderExists(T) Then fso.CreateFolder T
If fso.FileExists(T & "\nhat-ky.txt") Then fso.DeleteFile T & "\nhat-ky.txt"
Sub Nhip(polytool)
  Dim f
  Set f = fso.CreateTextFile(T & "\dang-chay.txt", True)
  If polytool Then f.WriteLine "24/11/2026 00:00:00 polytool pid 1" Else f.WriteLine "24/11/2026 00:00:00" & vbCrLf & "ps=1"
  f.Close
End Sub
Function Doc(p)
  Doc = ""
  On Error Resume Next
  Dim x
  Set x = fso.OpenTextFile(p, 1)
  Doc = x.ReadAll
  x.Close
  Err.Clear
  On Error GoTo 0
End Function
Function SoBan()
  Dim c, p
  SoBan = 0
  Set c = GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT CommandLine FROM Win32_Process WHERE Name='wscript.exe' OR Name='cscript.exe'")
  For Each p In c
    If InStr(1, p.CommandLine & "", "poly-tu-chay-moi.vbs", 1) > 0 Then SoBan = SoBan + 1
  Next
End Function
Sub TatHet()
  Dim c, p
  Set c = GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT * FROM Win32_Process WHERE Name='wscript.exe' OR Name='cscript.exe'")
  For Each p In c
    If InStr(1, p.CommandLine & "", "poly-tu-chay-moi.vbs", 1) > 0 Then p.Terminate
  Next
End Sub
Sub Chay()
  sh.Run "wscript.exe //nologo """ & V & """ ""/q:" & T & """ /nghi:500", 0, False
End Sub
If Not fso.FileExists(V) Then
  kq = kq & "LOI: khong thay " & V & vbCrLf
Else
  ' A) POLYTool dang chay 1 script dai (nhip cu 21 giay, nhu 23/11 21:15): bo cu khong bat
  Nhip True
  WScript.Sleep 21000
  Chay
  WScript.Sleep 4000
  nk = Doc(T & "\nhat-ky.txt")
  If SoBan() = 0 And InStr(nk, "BO TU CHAY DA BAT") = 0 Then kq = kq & "DAT  A: nhip POLYTool 21 giay -> bo cu khong bat" & vbCrLf Else kq = kq & "LOI  A: so ban " & SoBan() & " / " & nk & vbCrLf
  TatHet
  ' B) khong co POLYTool: bo cu bat (ghi ps=), roi POLYTool ghi nhip -> bo cu tu tat
  If fso.FileExists(T & "\dang-chay.txt") Then fso.DeleteFile T & "\dang-chay.txt"
  Chay
  WScript.Sleep 4000
  nk = Doc(T & "\nhat-ky.txt")
  h = Doc(T & "\dang-chay.txt")
  If SoBan() = 1 And InStr(nk, "BO TU CHAY DA BAT") > 0 And InStr(h, "ps=") > 0 Then kq = kq & "DAT  B1: khong co POLYTool -> bo cu bat, ghi ps=" & vbCrLf Else kq = kq & "LOI  B1: so ban " & SoBan() & " / " & nk & " / " & h & vbCrLf
  For i = 1 To 20
    Nhip True
    WScript.Sleep 500
    If SoBan() = 0 Then Exit For
  Next
  nk = Doc(T & "\nhat-ky.txt")
  If SoBan() = 0 And InStr(nk, "POLYTOOL DANG CANH HANG CHO - BO TU CHAY CU TU TAT") > 0 Then kq = kq & "DAT  B2: POLYTool ghi nhip -> bo cu tu tat (" & (i * 0.5) & " giay)" & vbCrLf Else kq = kq & "LOI  B2: so ban " & SoBan() & " / " & nk & vbCrLf
  TatHet
  ' C) nhip cu khong phai POLYTool (bo cu chet): bat nhu thuong
  Nhip False
  WScript.Sleep 21000
  Chay
  WScript.Sleep 4000
  If SoBan() = 1 Then kq = kq & "DAT  C: nhip cu cua bo khac -> bo cu bat nhu thuong" & vbCrLf Else kq = kq & "LOI  C: so ban " & SoBan() & vbCrLf
  TatHet
  WScript.Sleep 1000
  kq = kq & "nhat ky thu:" & vbCrLf & Doc(T & "\nhat-ky.txt")
End If
Set h = fso.CreateTextFile("C:\Users\Dao\Pictures\PolySocial\_tam\thu-polytool-kq.txt", True)
h.Write Now & vbCrLf & kq & "XONG" & vbCrLf
h.Close
