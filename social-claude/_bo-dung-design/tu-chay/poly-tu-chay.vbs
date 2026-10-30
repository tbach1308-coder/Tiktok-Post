' POLY STORE - Bo tu chay script Photoshop (khong can bam).
' Moi 5 giay xem thu muc _tu-chay: co file .jsx thi chuyen sang _da-chay roi bao Photoshop chay (qua COM).
' Bat cung Windows (Startup) + scheduled task 5 phut + khi mo Photoshop. dang-lam.txt chan bat trung khi dang chay script dai.
Option Explicit
Dim fso, Q, D, lockF, t, f, best, nm, dest, ps, n
Set fso = CreateObject("Scripting.FileSystemObject")
Q = "C:\Users\Dao\Pictures\PolySocial\_tu-chay"
D = Q & "\_da-chay"
lockF = Q & "\dang-chay.txt"
If Not fso.FolderExists(Q) Then fso.CreateFolder Q
If Not fso.FolderExists(D) Then fso.CreateFolder D
' chi chay 1 ban: neu ban khac vua bao song < 20 giay thi thoat
If fso.FileExists(lockF) Then
  If DateDiff("s", fso.GetFile(lockF).DateLastModified, Now) < 20 Then WScript.Quit
End If
' dang chay 1 script dai (Photoshop chua tra ve) thi dang-lam.txt con moi -> khong bat them ban thu 2
If fso.FileExists(Q & "\dang-lam.txt") Then
  If DateDiff("s", fso.GetFile(Q & "\dang-lam.txt").DateLastModified, Now) < 900 Then WScript.Quit
End If
Sub GhiLog(s)
  Dim L
  Set L = fso.OpenTextFile(Q & "\nhat-ky.txt", 8, True)
  L.WriteLine Now & "  " & s
  L.Close
End Sub
GhiLog "BO TU CHAY DA BAT"
Do
  Set t = fso.CreateTextFile(lockF, True): t.WriteLine Now: t.Close
  Set best = Nothing
  For Each f In fso.GetFolder(Q).Files
    If LCase(fso.GetExtensionName(f.Name)) = "jsx" Then
      If DateDiff("s", f.DateLastModified, Now) >= 3 Then
        If best Is Nothing Then
          Set best = f
        ElseIf f.DateLastModified < best.DateLastModified Then
          Set best = f
        End If
      End If
    End If
  Next
  If Not best Is Nothing Then
    nm = best.Name
    n = Year(Now) & Right("0" & Month(Now), 2) & Right("0" & Day(Now), 2) & "-" & Right("0" & Hour(Now), 2) & Right("0" & Minute(Now), 2) & Right("0" & Second(Now), 2)
    dest = D & "\" & n & "-" & nm
    fso.MoveFile best.Path, dest
    GhiLog "BAT DAU  " & nm
    Set t = fso.CreateTextFile(Q & "\dang-lam.txt", True): t.WriteLine Now & "  " & nm: t.Close
    On Error Resume Next
    Set ps = CreateObject("Photoshop.Application")
    ps.DoJavaScriptFile dest
    If Err.Number <> 0 Then
      GhiLog "LOI  " & nm & "  " & Err.Description
    Else
      GhiLog "XONG  " & nm
    End If
    Err.Clear
    Set ps = Nothing
    If fso.FileExists(Q & "\dang-lam.txt") Then fso.DeleteFile Q & "\dang-lam.txt"
    On Error GoTo 0
  End If
  WScript.Sleep 5000
Loop
