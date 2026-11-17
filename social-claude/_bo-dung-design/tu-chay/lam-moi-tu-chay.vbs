' POLY STORE - Lam moi bo tu chay Photoshop: chep ban moi (E:\Social Claude\...\poly-tu-chay.vbs) sang PolySocial,
' tat ban dang chay, bat ban moi (an, khong cua so). Chay duoc 3 cach: bam dup lam-moi-tu-chay.bat, bam dup file nay,
' hoac goi tu 1 file .jsx trong hang cho (File.execute): file nay ghi _da-chay\.lam-moi-xong.txt ngay sau khi tat ban cu
' de file .jsx biet ma tra Photoshop ve, ban moi bat sau 3 giay (luc do Photoshop da ranh).
' Tham so (chi de thu): /q:<hang cho> /g:<ban moi> /c:<noi chep toi> /tattheoten:1 (may khong doc duoc dong lenh, vd wine:
'   tat moi wscript.exe, phai chay file nay bang cscript); tham so khac chuyen tiep cho ban moi
Option Explicit
Dim fso, sh, A, Q, G, C, p, n, t, k, th, cl
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
Set A = ThamSo()
Q = "C:\Users\Dao\Pictures\PolySocial\_tu-chay"
If A.Exists("q") Then Q = A("q")
G = "E:\Social Claude\_bo-dung-design\tu-chay\poly-tu-chay.vbs"
If A.Exists("g") Then G = A("g")
C = "C:\Users\Dao\Pictures\PolySocial\poly-tu-chay.vbs"
If A.Exists("c") Then C = A("c")
If Not fso.FolderExists(Q & "\_da-chay") Then fso.CreateFolder Q & "\_da-chay"
If fso.FileExists(G) Then fso.CopyFile G, C, True
' tat moi ban poly-tu-chay.vbs dang chay (wscript / cscript)
n = 0
For Each p In GetObject("winmgmts:\\.\root\cimv2").ExecQuery("SELECT ProcessId, Name, CommandLine FROM Win32_Process WHERE Name='wscript.exe' OR Name='cscript.exe'")
  cl = p.CommandLine & ""
  ' khong tu tat chinh minh (dong lenh file nay co the chua duong dan poly-tu-chay.vbs o tham so /c)
  If InStr(1, cl, "lam-moi-tu-chay.vbs", 1) > 0 Then
    cl = "-"
  ElseIf cl = "" And LCase(p.Name) = "wscript.exe" And A.Exists("tattheoten") Then
    cl = "poly-tu-chay.vbs"
  End If
  If InStr(1, cl, "poly-tu-chay.vbs", 1) > 0 Then
    On Error Resume Next
    p.Terminate
    If Err.Number <> 0 Then
      Err.Clear
      sh.Run "taskkill /f /pid " & p.ProcessId, 0, True
    End If
    On Error GoTo 0
    n = n + 1
  End If
Next
' khoa cua ban cu: khong xoa han, chuyen vao _da-chay
k = Year(Now) & Right("0" & Month(Now), 2) & Right("0" & Day(Now), 2) & "-" & Right("0" & Hour(Now), 2) & Right("0" & Minute(Now), 2) & Right("0" & Second(Now), 2)
If fso.FileExists(Q & "\dang-lam.txt") Then fso.MoveFile Q & "\dang-lam.txt", Q & "\_da-chay\.dang-lam-cu-" & k & ".txt"
If fso.FileExists(Q & "\dang-chay.txt") Then fso.MoveFile Q & "\dang-chay.txt", Q & "\_da-chay\.dang-chay-cu-" & k & ".txt"
Set t = fso.CreateTextFile(Q & "\_da-chay\.lam-moi-xong.txt", True): t.WriteLine Now & "  tat " & n & " ban cu": t.Close
Set t = fso.OpenTextFile(Q & "\nhat-ky.txt", 8, True): t.WriteLine Now & "  LAM MOI BO TU CHAY (tat " & n & " ban cu)": t.Close
On Error Resume Next
WScript.Sleep 3000
If Err.Number <> 0 Then
  Err.Clear
  k = Timer
  Do While Timer - k < 3 And Timer >= k
  Loop
End If
On Error GoTo 0
' tham so thu (tru /g /c) chuyen tiep cho ban moi
th = ""
For Each p In A.Keys
  If LCase(p) <> "g" And LCase(p) <> "c" And LCase(p) <> "tattheoten" Then th = th & " /" & p & ":""" & A(p) & """"
Next
sh.Run "wscript.exe """ & C & """" & th, 0, False

' tham so dang /ten:gia tri (tu doc WScript.Arguments: WScript.Arguments.Named khong co o moi noi)
Function ThamSo()
  Dim d, x, i, j
  Set d = CreateObject("Scripting.Dictionary")
  d.CompareMode = 1
  For j = 0 To WScript.Arguments.Count - 1
    x = WScript.Arguments(j)
    i = InStr(x, ":")
    If Left(x, 1) = "/" And i > 2 Then d(LCase(Mid(x, 2, i - 2))) = Mid(x, i + 1)
  Next
  Set ThamSo = d
End Function
